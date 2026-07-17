  // app.js  (or server.js - the main entry file)

  require('dotenv').config();
  require('./utils/envSetup');


  // Unified runtime profile: `dev` | `staging` | `prod` controls observability defaults.
  const runtimeProfile = String(process.env.APP_RUNTIME_PROFILE || process.env.NODE_ENV || 'dev').toLowerCase();
  const isErrorsOnlyRequested = String(process.env.CONSOLE_ERRORS_ONLY || '').toLowerCase() === 'true';
  const shouldUseErrorsOnly = runtimeProfile === 'prod' || runtimeProfile === 'production' || isErrorsOnlyRequested;
  if (shouldUseErrorsOnly) {
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.warn = () => {};
  }

  const crypto = require('crypto');
  const express = require('express');
  const os = require('os');
  const path = require('path');
  const compression = require('compression');
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  const session = require('express-session');
  const SequelizeStore = require('connect-session-sequelize')(session.Store);
  const {
    buildCookieOptions,
    createReconShieldMiddleware,
    createHostGuardMiddleware,
    createHttpsRedirectMiddleware,
    createSecurityHeadersMiddleware,
    parseAllowedHosts,
    parseBoolean,
    resolveTrustProxySetting
  } = require('./utils/requestSecurity');

  const app = express();
  const { isLocalPC } = require('./utils/envSetup');
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';
  app.disable('x-powered-by');
  const ASSET_VERSION = String(process.env.ASSET_VERSION || '20260423chatfix2');
  app.locals.assetVersion = ASSET_VERSION;
  app.use((req, res, next) => {
    res.locals.assetVersion = ASSET_VERSION;
    res.locals.disableSse = process.env.DISABLE_SSE === 'true';
    next();
  });
  app.use((req, res, next) => {
    if (process.env.DISABLE_SSE === 'true') {
      const url = req.path;
      if (
        url === '/events' ||
        url === '/stream' ||
        url === '/api/chat/events/admin' ||
        url.startsWith('/api/chat/events/') ||
        url.startsWith('/api/game-events/')
      ) {
        return res.status(503).json({ success: false, message: 'Server-Sent Events disabled by server policy' });
      }
    }
    next();
  });
  app.locals.realtimeEnabled = false;
  app.locals.realtimeDiagnostics = {
    initialized: false,
    started: false,
    reason: 'not-initialized',
    error: '',
    charset: {
      mode: 'unknown',
      status: 'idle',
      error: ''
    }
  };

  // ========== PROXY CONFIGURATION ==========
  // Trust the closest reverse proxy by default; override with TRUST_PROXY when hosting requires it.
  app.set('trust proxy', resolveTrustProxySetting(process.env.TRUST_PROXY));

  const allowedHosts = parseAllowedHosts(
    process.env.ALLOWED_HOSTS,
    process.env.APP_URL
  );
  const enableCsp = parseBoolean(process.env.ENABLE_CSP);
  const forceHttps = parseBoolean(process.env.FORCE_HTTPS);
  const blockDirectIpAccess = parseBoolean(process.env.BLOCK_DIRECT_IP_ACCESS);
  const blockHeadRequests = parseBoolean(process.env.BLOCK_HEAD_REQUESTS);
  const blockAutomationUserAgents = parseBoolean(process.env.BLOCK_AUTOMATION_USER_AGENTS);
  const allowLoopbackHosts = !isProd;

  if (isProd && allowedHosts.size === 0) {
    console.error('[SECURITY] APP_URL/ALLOWED_HOSTS chưa được cấu hình. App chỉ có thể chặn truy cập trực tiếp bằng IP, không thể khóa chặt Host header.');
  }

  // Database
  const db = require('./models');
  const runMigrations = require('./migrations');
  const fixDatabase = require('./utils/fixDatabase');
  const DatabaseRecovery = require('./utils/databaseRecovery');
  const ensureUtf8mb4 = require('./utils/ensureUtf8mb4');
  const settingsController = require('./controllers/settingsController');
  const sessionTracker = require('./services/sessionTracker');

  const sessionStore = new SequelizeStore({
    db: db.sequelize,
    tableName: 'sessions',
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000
  });

  // ========== MIDDLEWARE ==========
  app.use(createHostGuardMiddleware({
    allowedHosts,
    blockDirectIpAccess,
    allowLoopback: allowLoopbackHosts
  }));
  app.use(createReconShieldMiddleware({
    blockAutomationUserAgents,
    blockHeadRequests
  }));
  app.use(createHttpsRedirectMiddleware({ enabled: forceHttps }));
  app.use(createSecurityHeadersMiddleware({ enableCsp }));

  app.use(compression({
    level: 6,
    threshold: 1024,
    // Never compress SSE streams — compression middleware buffers writes which
    // breaks Server-Sent Events (events never arrive until buffer fills/flushes).
    filter: (req, res) => {
      if (req.headers['accept'] === 'text/event-stream') return false;
      if (req.path && req.path.includes('/events')) return false;
      return compression.filter(req, res);
    }
  }));

  // SEC-BODY: 1 MB cap prevents large-body DoS. File uploads use multer (its
  // own fileSize limit) so they are not affected by this JSON body limit.
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Prevent accidental double responses from crashing noisy routes.
  app.use((req, res, next) => {
    const rawJson = res.json.bind(res);
    const rawSend = res.send.bind(res);
    res.json = (payload) => {
      if (res.headersSent) return res;
      return rawJson(payload);
    };
    res.send = (payload) => {
      if (res.headersSent) return res;
      return rawSend(payload);
    };
    next();
  });

  // Lightweight in-memory cache to reduce repeated settings queries under traffic bursts.
  let cachedSiteSettings = null;
  let cachedSiteSettingsAt = 0;
  let cachedSiteSettingsPromise = null;
  let cachedGameSessionTableSchema = null;
  let cachedGameSessionTableSchemaPromise = null;
  const SETTINGS_CACHE_TTL_MS = 10000;
  const SETTINGS_QUERY_TIMEOUT_MS = Number(process.env.SETTINGS_QUERY_TIMEOUT_MS || 1200);
  const ROOT_SESSION_QUERY_TIMEOUT_MS = Number(process.env.ROOT_SESSION_QUERY_TIMEOUT_MS || 1200);

  const withTimeout = async (promise, timeoutMs, fallbackValue = null) => {
    let timer = null;
    try {
      const timeoutPromise = new Promise((resolve) => {
        timer = setTimeout(() => resolve(fallbackValue), timeoutMs);
      });
      const result = await Promise.race([promise, timeoutPromise]);
      return result;
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const getSiteSettingsCached = async () => {
    const now = Date.now();
    if (cachedSiteSettings && (now - cachedSiteSettingsAt) < SETTINGS_CACHE_TTL_MS) {
      return cachedSiteSettings;
    }

    if (!cachedSiteSettingsPromise) {
      cachedSiteSettingsPromise = withTimeout(
        settingsController.readSettingsFromDB(),
        SETTINGS_QUERY_TIMEOUT_MS,
        cachedSiteSettings || {}
      )
        .then((fresh) => {
          cachedSiteSettings = fresh || cachedSiteSettings || {};
          cachedSiteSettingsAt = Date.now();
          return cachedSiteSettings;
        })
        .finally(() => {
          cachedSiteSettingsPromise = null;
        });
    }

    return cachedSiteSettingsPromise;
  };

  const getGameSessionTableSchema = async () => {
    if (cachedGameSessionTableSchema) return cachedGameSessionTableSchema;
    if (!cachedGameSessionTableSchemaPromise) {
      cachedGameSessionTableSchemaPromise = db.GameSession.sequelize.queryInterface
        .describeTable('game_sessions')
        .then((schema) => {
          cachedGameSessionTableSchema = schema || {};
          return cachedGameSessionTableSchema;
        })
        .catch(() => ({}))
        .finally(() => {
          cachedGameSessionTableSchemaPromise = null;
        });
    }
    return cachedGameSessionTableSchemaPromise;
  };

  const configuredSessionSecret = String(process.env.SESSION_SECRET || (isLocalPC ? '' : 'manhlamstore.vn')).trim();
  const sessionSecret = configuredSessionSecret || crypto.randomBytes(48).toString('hex');
  const sessionRolling = parseBoolean(process.env.SESSION_ROLLING, false);
  if (!configuredSessionSecret) {
    console.error('[SECURITY] SESSION_SECRET đang thiếu. App đang dùng secret tạm thời và tất cả session sẽ bị reset sau mỗi lần restart.');
  } else if (configuredSessionSecret.length < 32) {
    console.error('[SECURITY] SESSION_SECRET nên dài ít nhất 32 ký tự để chống brute-force tốt hơn.');
  }

  app.use(session({
    name: String(process.env.SESSION_COOKIE_NAME || 'gbgsid'),
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: sessionRolling,
    unset: 'destroy',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,
      secure: 'auto',
      sameSite: 'lax',
      priority: 'high',
      path: '/'
    }
  }));

  if (!global.__giftboxSessionStoreSyncPromise) {
    global.__giftboxSessionStoreSyncPromise = sessionStore.sync().catch((err) => {
      console.error('[SESSION] session store sync failed:', err?.message || err);
      return null;
    });
  }

  if (!global.__giftboxUserSessionSyncPromise) {
    global.__giftboxUserSessionSyncPromise = sessionTracker.ensureReady().catch(() => null);
  }

  app.use((req, res, next) => {
    if (!sessionTracker.shouldTrackRequest(req)) {
      return next();
    }

    let tracked = false;
    const flushSessionActivity = () => {
      if (tracked) return;
      tracked = true;

      if (!sessionTracker.hasMeaningfulSession(req)) {
        return;
      }

      sessionTracker.touchSession(req).catch(() => {});
    };

    res.on('finish', flushSessionActivity);
    res.on('close', flushSessionActivity);
    next();
  });

  
  const { apiLimiter } = require('./middleware/rateLimitMiddleware');
  const { sanitizeInputs } = require('./middleware/sanitizeMiddleware');

  
  app.use(sanitizeInputs);

 
  app.use(apiLimiter);

  app.get('/favicon.ico', async (req, res) => {
    try {
      const settings = await getSiteSettingsCached();
      const faviconUrl = settings?.seo?.favicon || settings?.logo?.url || '/favicon.ico';

      if (faviconUrl && faviconUrl !== '/favicon.ico') {
        return res.redirect(302, faviconUrl);
      }
    } catch (_) {}

    return res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send('User-agent: *\nDisallow: /\n');
  });

  const staticAssetOptions = {
    etag: true,
    lastModified: true,
    maxAge: '365d',
    setHeaders: (res, servedPath) => {
      const lowerPath = String(servedPath || '').toLowerCase();
      const ensureUtf8ContentType = (mime) => {
        const current = String(res.getHeader('Content-Type') || '');
        if (!current || !/charset=/i.test(current)) {
          res.setHeader('Content-Type', `${mime}; charset=utf-8`);
        }
      };

      if (lowerPath.endsWith('.html')) ensureUtf8ContentType('text/html');
      else if (lowerPath.endsWith('.css')) ensureUtf8ContentType('text/css');
      else if (lowerPath.endsWith('.js')) ensureUtf8ContentType('application/javascript');
      else if (lowerPath.endsWith('.json')) ensureUtf8ContentType('application/json');
      else if (lowerPath.endsWith('.svg')) ensureUtf8ContentType('image/svg+xml');
      else if (lowerPath.endsWith('.txt')) ensureUtf8ContentType('text/plain');

      if (servedPath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
        return;
      }

      // Long-term immutable cache for static assets. Cache busting is done via asset version query strings.
      if (/(\.css|\.js|\.mjs|\.png|\.jpg|\.jpeg|\.gif|\.webp|\.avif|\.svg|\.woff2?|\.ttf|\.otf|\.mp3|\.wav|\.ogg)$/i.test(lowerPath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return;
      }

      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400');
    }
  };

  // Serve pre-compressed minified assets when available (must be before express.static)
  // JS dual-build: /build-modern (ES6+) and /build-legacy (Babel ES5 for Android 5-7)
  const preCompressed = require('./middleware/preCompressedStatic');
  app.use('/css', preCompressed(path.join(__dirname, 'public/css')));
  app.use('/build-modern', preCompressed(path.join(__dirname, 'public/build-modern')));
  app.use('/build-legacy', preCompressed(path.join(__dirname, 'public/build-legacy')));
  // Keep /js/ as alias → build-legacy for any paths not yet migrated
  app.use('/js',  preCompressed(path.join(__dirname, 'public/build-legacy')));

  app.use('/css',    express.static(path.join(__dirname, 'public/css'), staticAssetOptions));
  app.use('/build-modern', express.static(path.join(__dirname, 'public/build-modern'), staticAssetOptions));
  app.use('/build-legacy', express.static(path.join(__dirname, 'public/build-legacy'), staticAssetOptions));
  app.use('/js',     express.static(path.join(__dirname, 'public/build-legacy'), staticAssetOptions));
  app.use('/images', express.static(path.join(__dirname, 'public/images'), staticAssetOptions));
  const defaultUploadDir = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(__dirname, 'public/uploads');
  const fallbackUploadDir = path.join(os.tmpdir(), 'giftbox-game-uploads');
  app.use('/uploads', express.static(defaultUploadDir, staticAssetOptions));
  // Fallback for hosting environments that disallow writes in app/public.
  app.use('/uploads', express.static(fallbackUploadDir, staticAssetOptions));
  const HOMEPAGE_PRESET_VIEW_MAP = {
    'new_homepage': 'homepage-presets/new_homepage',
    'new_homepage.html': 'homepage-presets/new_homepage',
    'background_upgraded': 'homepage-presets/background_upgraded',
    'background_upgraded.html': 'homepage-presets/background_upgraded',
    'background': 'homepage-presets/background',
    'background.html': 'homepage-presets/background',
    'background-alt': 'homepage-presets/background_alt',
    'background-alt.html': 'homepage-presets/background_alt',
    'background (1)': 'homepage-presets/background_1',
    'background (1).html': 'homepage-presets/background_1',
    'card_v3_purple': 'homepage-presets/card_v3_purple',
    'card_v3_purple.html': 'homepage-presets/card_v3_purple',
    'card_v4_cyber': 'homepage-presets/card_v4_cyber',
    'card_v4_cyber.html': 'homepage-presets/card_v4_cyber',
    'card_v4_cyber (1)': 'homepage-presets/card_v4_cyber_1',
    'card_v4_cyber (1).html': 'homepage-presets/card_v4_cyber_1',
    'card_v5_baroque': 'homepage-presets/card_v5_baroque',
    'card_v5_baroque.html': 'homepage-presets/card_v5_baroque'
  };

  app.get('/homepage-presets/:preset', async (req, res, next) => {
    try {
      const rawPreset = String(req.params.preset || '').trim();
      if (!rawPreset || rawPreset.includes('/') || rawPreset.includes('\\')) {
        return res.status(404).send('Preset không tồn tại');
      }

      const presetKey = rawPreset.toLowerCase();
      const presetView = HOMEPAGE_PRESET_VIEW_MAP[presetKey];
      if (!presetView) {
        return next();
      }

      let siteSettings = {};
      try {
        siteSettings = await getSiteSettingsCached();
      } catch (_) {}

      return res.render(presetView, {
        title: siteSettings?.seo?.pageTitle || 'Mở Hộp Quà',
        seo: siteSettings?.seo || {},
        settings: siteSettings,
        appearance: siteSettings?.appearance || {}
      });
    } catch (err) {
      return res.status(500).send('Không thể tải giao diện preset');
    }
  });

  app.use('/homepage-presets', express.static(path.join(__dirname, 'new_homepage'), staticAssetOptions));

  // Service Worker must be served with no-cache so browsers pick up updates immediately.
  // This route MUST come before the catch-all express.static below.
  app.get('/sw.js', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.sendFile(path.join(__dirname, 'public', 'sw.js'));
  });

  app.use(express.static(path.join(__dirname, 'public'), staticAssetOptions));

  // ========== VIEW ENGINE ==========
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // Keep rendered HTML responses explicitly in UTF-8 to avoid Vietnamese text corruption.
  app.use((req, res, next) => {
    const baseRender = res.render.bind(res);
    res.render = (...args) => {
      const currentType = String(res.getHeader('Content-Type') || '');
      if (!currentType || currentType.startsWith('text/html')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
      }
      return baseRender(...args);
    };
    next();
  });

  // ========== REQUEST CONTEXT (user in templates) ==========
  app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
  });

  // ========== SESSION LOCALS MIDDLEWARE ==========
  const sessionLocals = require('./middleware/sessionLocals');
  app.use(sessionLocals);

  // ========== i18n MIDDLEWARE ==========
  const i18nMiddleware = require('./middleware/i18nMiddleware');
  app.use(i18nMiddleware);

  // ========== SITE-WIDE IP/PAGE TRACKING ==========
  const { trackWebsiteAccessIp } = require('./middleware/accessIpTracker');
  app.use(trackWebsiteAccessIp);

  // ========== WEBSITE VISIT IP LOGGING ==========
  function getClientIp(req) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const forwarded = Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : String(xForwardedFor || '').split(',')[0].trim();
    const rawIp = forwarded || req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '';
    return String(rawIp || '').replace('::ffff:', '') || 'unknown';
  }

  function isTrackableWebsiteRequest(req) {
    if (req.method !== 'GET') return false;
    if (!req.path || req.path.startsWith('/api')) return false;
    if (req.path.startsWith('/css') || req.path.startsWith('/js') ||
        req.path.startsWith('/build-modern') || req.path.startsWith('/build-legacy') ||
        req.path.startsWith('/images')) return false;
    if (/\.(css|js|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|map)$/i.test(req.path)) return false;
    return true;
  }

  const websiteVisitThrottle = new Map();
  app.use((req, res, next) => {
    if (!isTrackableWebsiteRequest(req) || !db.AuditLog) {
      return next();
    }

    const now = Date.now();
    const throttleMs = 60 * 1000;
    const throttleKey = [
      getClientIp(req),
      String(req.get('user-agent') || '').trim().slice(0, 120),
      String(req.path || '/')
    ].join('|');
    const lastLoggedAt = Number(websiteVisitThrottle.get(throttleKey) || 0);
    if (lastLoggedAt && (now - lastLoggedAt) < throttleMs) {
      return next();
    }

    websiteVisitThrottle.set(throttleKey, now);
    if (websiteVisitThrottle.size > 5000) {
      const cutoff = now - (throttleMs * 2);
      for (const [key, ts] of websiteVisitThrottle.entries()) {
        if (Number(ts || 0) < cutoff) websiteVisitThrottle.delete(key);
      }
    }

    const sessionCode = (req.query?.code || '').toString().toUpperCase() || null;
    db.AuditLog.create({
      user_id: req.session?.user?.id || null,
      session_code: sessionCode,
      action: 'WEBSITE_VISIT',
      description: `Website accessed: ${req.method} ${req.originalUrl}`,
      ip_address: getClientIp(req),
      user_agent: req.get('user-agent') || '',
      details: {
        path: req.path,
        referer: req.get('referer') || '',
        host: req.get('host') || ''
      },
      status: 'success'
    }).catch(() => {});

    next();
  });

  
    

  // ========== AUTH MIDDLEWARE ==========
  const authMiddleware = require('./middleware/authMiddleware');

  // ========== MIDDLEWARE ==========
  // ========== ROUTES ==========

  // ===== MAIN GAME PAGE (ROOT) =====
  // Manages all game sessions via query parameter: /?code=ABC123
  app.get('/', async (req, res) => {
    try {
      const { GameSession } = require('./models');
      const code = (req.query.code || '').toUpperCase();

      // Load settings for SEO/title
      let siteSettings = {};
      try {
        siteSettings = await getSiteSettingsCached();
      } catch (_) {}
      const seo = siteSettings.seo || {};
      const pageTitle = siteSettings?.content?.headTitle || seo.pageTitle || 'Mạnh Lâm Store - Mở Hộp Quà Bí Ẩn';

      let sessionData = null;
      if (code && code.length >= 3) {
        const session = await withTimeout(
          GameSession.findOne({ where: { session_code: code, is_active: true } }),
          ROOT_SESSION_QUERY_TIMEOUT_MS,
          null
        );
        if (session) {
          // Sanitize sensitive fields before sending to view
          sessionData = session.toJSON();
          delete sessionData.player_token;
          delete sessionData.server_random_boxes;
          delete sessionData.server_random_seed;
          delete sessionData.result_hash;
          delete sessionData.fraud_flag;
          delete sessionData.fraud_reason;
          delete sessionData.player_ip;
        }
      }

      res.render('lucky-mystery-box', {
        title: pageTitle,
        seo: seo,
        content: siteSettings.content || {},
        appearance: siteSettings.appearance || {},
        session: sessionData,
        sessionCode: code,
        autoLoadChooseBox: code && code.length >= 3 ? true : false,
        user: req.session.user || null
      });
    } catch (err) {
      res.status(500).send('Lỗi khi tải trang trò chơi');
    }
  });

  // ===== THANK YOU PAGE =====
  // Using query parameter: /?code=ABC123&page=thank-you
  app.get('/thank-you', (req, res) => {
    res.render('lucky-mystery-box', {
      title: 'Cảm Ơn Bạn',
      appearance: {},
      showThankYou: true,
      user: req.session.user || null
    });
  });

  // ===== BACKWARD COMPATIBILITY & REDIRECTS =====
  // Redirect old routes to new query parameter format
  app.get('/home', (req, res) => res.redirect('/'));
  app.get('/play/:code', (req, res) => res.redirect(`/?code=${req.params.code}`));
  app.get('/ket-qua', (req, res) => res.redirect('/thank-you'));
  app.get('/result', (req, res) => res.redirect('/thank-you'));
  app.get('/lucky-mystery-box', (req, res) => res.redirect(`/?code=${req.query.code || ''}`));
  app.get('/lucky-mystery-box/play/:code', (req, res) => res.redirect(`/?code=${req.params.code}`));
  app.get('/chon-hop-qua', (req, res) => {
    if (req.query.code) {
      return res.redirect(`/?code=${req.query.code}`);
    }
    res.redirect('/');
  });


  // Admin login (public page)
  app.get('/admin/login', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
      return res.redirect('/admin');
    }
    res.render('admin/adminLogin', { title: 'Đăng Nhập Admin' });
  });


  // Admin dashboard (protected)
  app.get('/admin', authMiddleware.isAdmin, async (req, res) => {
    try {
      const { GameSession, Withdrawal, GiftExchange, User, ConversionRequest, AuditLog, PlayerInventory } = require('./models');
      const Sequelize = require('sequelize');

      const [
        sessionsCount,
        withdrawalsCount,
        pendingWithdrawals,
        approvedWithdrawals,
        specialPendingCount,
        specialApprovedCount,
        specialDecidedCount,
        usersCount,
        totalAmountResult,
        withdrawals,
        sessions,
        users,
        specialPrizeItems,
        sessionTable
      ] = await Promise.all([
        GameSession.count(),
        Withdrawal.count(),
        Withdrawal.count({ where: { status: 'pending' } }),
        Withdrawal.count({ where: { status: 'approved' } }),
        PlayerInventory.count({ where: { is_special: true, status: 'pending_approval' } }),
        PlayerInventory.count({ where: { is_special: true, status: { [Sequelize.Op.in]: ['confirmed', 'converted', 'declined'] } } }),
        PlayerInventory.count({ where: { is_special: true, status: { [Sequelize.Op.in]: ['converted', 'declined', 'rejected'] } } }),
        User.count(),
        Withdrawal.sum('amount', { where: { status: 'approved' } }),
        Withdrawal.findAll({ limit: 200, order: [['createdAt', 'DESC']], raw: true }),
        GameSession.findAll({ limit: 6, order: [['createdAt', 'DESC']], raw: true }),
        User.findAll({ limit: 6, order: [['createdAt', 'DESC']], raw: true }),
        PlayerInventory.findAll({
          where: { is_special: true },
          limit: 200,
          order: [['updated_at', 'DESC']],
          raw: true
        }),
        getGameSessionTableSchema()
      ]);
      
      const totalAmount = totalAmountResult ? `${totalAmountResult.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ';

      // Enrich with player/session metadata from GameSession
      const sessionCodes = [...new Set(specialPrizeItems.map(i => i.session_code))];
      const sessionAttrs = ['session_code', 'player_name', 'player_phone', 'created_by', 'player_ip']
        .filter((attr) => !!sessionTable[attr]);
      const relatedSessions = sessionCodes.length > 0
        ? await GameSession.findAll({
            where: { session_code: { [Sequelize.Op.in]: sessionCodes } },
            attributes: sessionAttrs.length > 0 ? sessionAttrs : ['session_code'],
            raw: true
          })
        : [];
      const sessionMap = {};
      relatedSessions.forEach((row) => {
        if (row.session_code) sessionMap[row.session_code] = row;
      });
      const specialPrizeSessions = specialPrizeItems.map(item => {
        const sess = sessionMap[item.session_code];
        return {
          ...item,
          _playerName: sess?.player_name || 'N/A',
          _playerPhone: sess?.player_phone || 'N/A',
          _createdBy: sess?.created_by || 'admin',
          _playerIp: sess?.player_ip || 'N/A'
        };
      });
      
      res.render('admin/adminDashboard', { 
        title: 'Admin Dashboard',
        currentUser: req.session.user,
        stats: {
          sessions: sessionsCount,
          withdrawals: withdrawalsCount,
          pendingWithdrawals: pendingWithdrawals,
          approvedWithdrawals: approvedWithdrawals,
          totalAmount: totalAmount,
          specialPending: specialPendingCount,
          specialApproved: specialApprovedCount,
          specialDecided: specialDecidedCount,
          users: usersCount,
          files: 0,
          totalFiles: 0,
          totalImages: 0,
          notifications: 0
        },
        withdrawalsList: withdrawals,
        sessionsList: sessions,
        usersList: users,
        specialPrizeList: specialPrizeSessions
      });
    } catch (error) {
      console.error('❌ [ADMIN DASHBOARD] load error:', error?.message || error);
      res.render('admin/adminDashboard', { 
        title: 'Admin Dashboard',
        currentUser: req.session.user,
        stats: {
          sessions: 0,
          withdrawals: 0,
          pendingWithdrawals: 0,
          approvedWithdrawals: 0,
          totalAmount: '0 VNĐ',
          specialPending: 0,
          specialApproved: 0,
          specialDecided: 0,
          users: 0,
          files: 0,
          totalFiles: 0,
          totalImages: 0,
          notifications: 0
        },
        // Provide empty lists so templates that expect these variables do not throw
        withdrawalsList: [],
        sessionsList: [],
        usersList: [],
        specialPrizeList: []
      });
    }
  });

  app.get('/admin/sessions', authMiddleware.isAdmin, async (req, res) => {
    try {
      const { GameSession, Withdrawal, GiftExchange, User, ConversionRequest } = require('./models');
      const [sessionsCount, withdrawalsCount, usersCount] = await Promise.all([
        GameSession.count(),
        Withdrawal.count(),
        User.count()
      ]);
      
      res.render('admin/adminDashboard', { 
        title: 'Quản Lý Phiên Chơi',
        currentUser: req.session.user,
        stats: {
          sessions: sessionsCount,
          withdrawals: withdrawalsCount,
          specialPending: 0,
          specialApproved: 0,
          specialDecided: 0,
          users: usersCount,
          files: 0,
          notifications: 0
        },
        withdrawalsList: [],
        sessionsList: [],
        usersList: [],
        specialPrizeList: []
      });
    } catch (error) {
      res.render('admin/adminDashboard', { 
        title: 'Quản Lý Phiên Chơi',
        currentUser: req.session.user,
        stats: {
          sessions: 0,
          withdrawals: 0,
          specialPending: 0,
          specialApproved: 0,
          specialDecided: 0,
          users: 0,
          files: 0,
          notifications: 0
        },
        withdrawalsList: [],
        sessionsList: [],
        usersList: [],
        specialPrizeList: []
      });
    }
  });

  // Admin chat views (protected) — handled by routes/adminView.js
  app.use('/', require('./routes/adminView'));

  // API routes
  const apiRouter = require('./routes/api');
  const gameRouter = require('./routes/game');
  const chatRouter = require('./routes/chat');
  const gamefeaturesRouter = require('./routes/gamefeatures');
  const prizesRouter = require('./routes/prizes');
  const analyticsRouter = require('./routes/analytics');
  const luckyMysteryBoxRouter = require('./routes/lucky-mystery-box');
  const luckyMysteryBoxController = require('./controllers/luckyMysteryBoxController');
  const banksRouter = require('./routes/banks');
  const uiFragmentsRouter = require('./routes/ui-fragments');
  const sseChat = require('./services/sseChat');

  // Global realtime SSE stream for frontend consumers.
  // Optional query: ?sessionCode=XXX to scope session events.
  app.get(['/events', '/events/', '/realtime/events'], (req, res) => {
    const sessionCodes = String(req.query.sessionCode || '')
      .split(',')
      .map((code) => String(code || '').trim().toUpperCase())
      .filter(Boolean);
    sseChat.subscribeGlobal(res, {
      sessionCodes,
      sessionCode: sessionCodes[0] || null
    });
  });

  // Shared-hosting guardrail: apply default pagination and hard cap limit=20 for API GET list endpoints.
  app.use('/api', (req, res, next) => {
    if (req.method !== 'GET') return next();
    const pathName = String(req.path || '').toLowerCase();
    const isCollectionEndpoint = !/\/\d+(\/|$)/.test(pathName) && !/\/(search|stats|status|health|events|sse|realtime-status)(\/|$)/.test(pathName);
    if (!isCollectionEndpoint) return next();

    const parsedLimit = Number.parseInt(String(req.query.limit || '20'), 10);
    const parsedPage = Number.parseInt(String(req.query.page || '1'), 10);
    req.query.limit = String(Math.max(1, Math.min(20, Number.isFinite(parsedLimit) ? parsedLimit : 20)));
    req.query.page = String(Math.max(1, Number.isFinite(parsedPage) ? parsedPage : 1));
    next();
  });

  app.use('/api', apiRouter);
  app.use('/api/game', gameRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/games', gamefeaturesRouter);
  app.use('/api/prizes', prizesRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/lucky-mystery-box', luckyMysteryBoxRouter);
  app.use('/ui/fragments', uiFragmentsRouter);
  // Backward compatibility for legacy clients/tests still calling /search directly.
  app.get('/search', luckyMysteryBoxController.searchSession);
  app.use('/api/banks', banksRouter);
  const pushRouter = require('./routes/push');
  app.use('/api/push', pushRouter);

  const walletRouter = require('./routes/wallet');
  app.use('/api/wallet', walletRouter);

  const anticheatRouter = require('./routes/anticheat');
  app.use('/api/anticheat', anticheatRouter);

  const gamificationRouter = require('./routes/gamification');
  app.use('/api/gamification', gamificationRouter);

  const adminConfigRouter = require('./routes/admin-config');
  app.use('/api/admin/config', adminConfigRouter);

  // ========== i18n API ==========
  const { getTranslations, getManualTextMap, SUPPORTED_LANGS } = require('./utils/i18n');
  app.get('/api/i18n/:lang', (req, res) => {
    const lang = SUPPORTED_LANGS.includes(req.params.lang) ? req.params.lang : 'vi';
    res.json({ success: true, lang, translations: getTranslations(lang) });
  });

  app.get('/api/i18n/text-map/:lang', (req, res) => {
    const lang = SUPPORTED_LANGS.includes(req.params.lang) ? req.params.lang : 'vi';
    res.json({ success: true, lang, map: getManualTextMap(lang) });
  });

  app.post('/api/i18n/set', (req, res) => {
    const lang = SUPPORTED_LANGS.includes(req.body.lang) ? req.body.lang : 'vi';
    res.cookie('lang', lang, buildCookieOptions(req, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: 'lax'
    }));
    res.json({ success: true, lang });
  });

  // Realtime capability probe for clients
  app.get('/api/realtime-status', (req, res) => {
    const sseChat = require('./services/sseChat');
    res.json({
      success: true,
      socketIo: false,          // Socket.IO removed
      sse: !!app.locals.realtimeEnabled,
      sseStatus: sseChat.getStatus(),
      diagnostics: app.locals.realtimeDiagnostics || {}
    });
  });

  // ========== PUBLIC CHAT STREAM (SSE in-process) ==========
  // Routes: GET /stream, POST /message, POST /kill, GET /stream/status
    // See services/sseChatRedis.js (in-process mode) and routes/stream.js for full documentation.
  const streamRouter = require('./routes/stream');
  app.use(streamRouter);

  // ========== 404 HANDLER ==========
  app.use((req, res) => {
    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 - Không tìm thấy trang</title>
          <style>
              body {
                  font-family: 'Inter', 'Nunito', sans-serif;
                  background: linear-gradient(135deg, #0f0720 0%, #1a0b2e 100%);
                  color: white;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
              }
              .error-container {
                  text-align: center;
                  animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
              }
              h1 { font-size: 6rem; margin: 0; color: #8b5cf6; font-weight: 900; text-shadow: 0 8px 32px rgba(139,92,246,0.4); }
              p  { font-size: 1.5rem; color: #d1d5db; margin: 1rem 0; font-weight: 500; }
              a  {
                  display: inline-block;
                  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                  color: white;
                  padding: 1rem 2.5rem;
                  border-radius: 12px;
                  text-decoration: none;
                  margin-top: 2rem;
                  font-weight: 600;
                  transition: all 0.3s ease;
                  box-shadow: 0 8px 20px rgba(139,92,246,0.3);
              }
              a:hover {
                  transform: translateY(-3px);
                  box-shadow: 0 12px 30px rgba(139,92,246,0.5);
              }
              @keyframes slideIn {
                  from { opacity: 0; transform: translateY(30px); }
                  to   { opacity: 1; transform: translateY(0); }
              }
          </style>
      </head>
      <body>
          <div class="error-container">
              <h1>404</h1>
              <p>Không tìm thấy trang bạn đang tìm kiếm</p>
              <a href="/">Quay về trang chủ</a>
          </div>
      </body>
      </html>
    `);
  });

  // ========== GLOBAL ERROR HANDLER ==========
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    const isDev = process.env.NODE_ENV === 'development';
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi trên máy chủ',
      error: isDev ? err.message : undefined
    });
  });

  // ========== START SERVER ==========
  // Only start server if not in test mode
  const startServer = !process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test';
  // ── Build-output safety check ──────────────────────────────────────────────
  // public/build-legacy and public/build-modern are in .gitignore.
  // If they are missing (deploy without running `npm run build`), ALL JS will 404.
  {
    const fsSync = require('fs');
    const buildLegacyDir = path.join(__dirname, 'public', 'build-legacy');
    const buildModernDir = path.join(__dirname, 'public', 'build-modern');
    const legacyMissing = !fsSync.existsSync(buildLegacyDir);
    const modernMissing = !fsSync.existsSync(buildModernDir);
    if (legacyMissing || modernMissing) {
      console.error(
        '[BOOT] ⚠️  MISSING BUILD OUTPUT: ' +
        (legacyMissing ? 'public/build-legacy ' : '') +
        (modernMissing ? 'public/build-modern ' : '') +
        '— ALL JS WILL 404. Run: npm run build'
      );
    }
  }
  // ──────────────────────────────────────────────────────────────────────────
  const strictBoot = String(process.env.STRICT_BOOT || (isProd ? 'false' : 'true')).toLowerCase() === 'true';
  const shouldBootstrapDb = String(process.env.DB_BOOTSTRAP_ON_START || (isProd ? 'false' : 'true')).toLowerCase() === 'true';
  const shouldEnsureUtf8mb4 = String(process.env.DB_ENSURE_UTF8MB4_ON_START || 'true').toLowerCase() === 'true';
  const charsetMode = String(process.env.DB_ENSURE_UTF8MB4_MODE || 'blocking').toLowerCase();
  app.locals.realtimeDiagnostics.initialized = true;
  app.locals.realtimeDiagnostics.started = !!startServer;
  app.locals.realtimeDiagnostics.charset.mode = shouldEnsureUtf8mb4 ? charsetMode : 'disabled';
  if (!startServer) {
    app.locals.realtimeDiagnostics.reason = 'startServer-disabled';
  } else {
    app.locals.realtimeDiagnostics.reason = 'starting';
  }

  if (startServer) {
    if (global.__giftboxServerBootstrapped) {
      app.locals.realtimeDiagnostics.reason = 'start-skipped-duplicate';
    } else {
      global.__giftboxServerBootstrapped = true;

      const isPassenger = typeof global.PhusionPassenger !== 'undefined';
      const http = require('http');
      const server = http.createServer(app);

      // Connection tuning for production traffic spikes.
      server.keepAliveTimeout = Number(process.env.HTTP_KEEP_ALIVE_TIMEOUT || 65000);
      server.headersTimeout = Number(process.env.HTTP_HEADERS_TIMEOUT || 66000);
      server.requestTimeout = Number(process.env.HTTP_REQUEST_TIMEOUT || 120000);
      server.maxRequestsPerSocket = Number(process.env.HTTP_MAX_REQUESTS_PER_SOCKET || 1000);

      // Bring realtime online immediately so chat can respond before heavy DB boot tasks.
      const sseChat = require('./services/sseChat');
      app.locals.sseChat = sseChat;
      app.locals.realtimeEnabled = process.env.DISABLE_SSE !== 'true';
      app.locals.realtimeDiagnostics.reason = process.env.DISABLE_SSE === 'true' ? 'disabled-by-env' : 'realtime-ready';
      app.locals.realtimeDiagnostics.error = '';

      server.on('error', (serverErr) => {
        console.error('[SERVER] listen error:', serverErr);
        app.locals.realtimeEnabled = false;
        app.locals.realtimeDiagnostics.reason = 'listen-error';
        app.locals.realtimeDiagnostics.error = String(serverErr?.message || serverErr || 'listen-error');
        process.exit(1);
      });

      const listenTarget = isPassenger ? 'passenger' : PORT;
      global.__giftboxListenAttempted = true;
      try {
        server.listen(listenTarget, () => {
          app.locals.realtimeDiagnostics.reason = isPassenger ? 'ok-passenger' : 'ok';
        });
      } catch (listenErr) {
        const listenMsg = String(listenErr?.message || '');
        if (listenMsg.includes('more than once')) {
          app.locals.realtimeDiagnostics.reason = 'ok-litespeed';
        } else {
          throw listenErr;
        }
      }

      // Heavy DB bootstrap now runs in background and no longer blocks first response.
      (async () => {
        try {
          app.locals.realtimeDiagnostics.reason = 'boot-auth-db';
          let databaseNeedsRecovery = false;

          try {
            await db.sequelize.authenticate();
          } catch (_) {
            databaseNeedsRecovery = true;
          }

          if (databaseNeedsRecovery) {
            app.locals.realtimeDiagnostics.reason = 'boot-db-recovery';
            const recovery = new DatabaseRecovery();
            await recovery.recover();
            await db.sequelize.authenticate();
          }

          const runCharsetEnforcement = async () => {
            app.locals.realtimeDiagnostics.charset.status = 'running';
            app.locals.realtimeDiagnostics.charset.error = '';
            try {
              await ensureUtf8mb4();
              app.locals.realtimeDiagnostics.charset.status = 'done';
            } catch (charsetErr) {
              app.locals.realtimeDiagnostics.charset.status = 'error';
              app.locals.realtimeDiagnostics.charset.error = String(charsetErr?.message || charsetErr || 'utf8mb4-enforcement-error');
              console.error('[DB] utf8mb4 enforcement error:', app.locals.realtimeDiagnostics.charset.error);
            }
          };

          if (shouldEnsureUtf8mb4) {
            if (charsetMode === 'background') {
              app.locals.realtimeDiagnostics.reason = 'boot-db-charset-background';
              runCharsetEnforcement();
            } else {
              app.locals.realtimeDiagnostics.reason = 'boot-db-charset';
              await runCharsetEnforcement();
            }
          }

          if (shouldBootstrapDb) {
            app.locals.realtimeDiagnostics.reason = 'boot-db-bootstrap';
            await db.sequelize.sync({
              alter: process.env.NODE_ENV === 'development',
              logging: false
            });

            if (db.PlayerInventory) {
              await db.PlayerInventory.sync({
                alter: process.env.NODE_ENV === 'development'
              });
            }

            try { await fixDatabase(); } catch (_) {}
            try { await runMigrations(); } catch (_) {}

            const requiredTables = [
              'users',
              'game_sessions',
              'withdrawals',
              'gift_exchanges',
              'chat_messages',
              'chat_sessions',
              'player_inventory'
            ];

            for (const tableName of requiredTables) {
              try {
                await db.sequelize.queryInterface.describeTable(tableName);
              } catch (tableErr) {
                console.error('[BOOT] Missing table:', tableName, tableErr.message);
              }
            }
          }

          app.locals.realtimeDiagnostics.reason = 'boot-complete';
        } catch (err) {
          console.error('[BOOT] Background startup error:', err);
          app.locals.realtimeDiagnostics.reason = 'boot-error';
          app.locals.realtimeDiagnostics.error = String(err?.message || err || 'boot-error');
          if (strictBoot) {
            process.exit(1);
          }
        }
      })();
    }
  }

  // Export app for testing and external use
  module.exports = app;

  // SHUTDOWN: notify all connected SSE clients before process terminates so browsers
  // can reconnect immediately rather than waiting for TCP timeout (~90s).
  // This runs after module.exports so it never fires during test requires.
  process.on('SIGTERM', () => {
    try {
      const sseChat = require('./services/sseChat');
      sseChat.clients.forEach((res) => {
        try {
          if (sseChat._isResponseOpen(res)) {
            res.write('event: server_restart\ndata: {"reconnectAfter":2000}\n\n');
            res.end();
          }
        } catch (_) {}
      });
    } catch (_) {}
    // Allow up to 2 s for writes to flush before the process exits.
    setTimeout(() => process.exit(0), 2000);
  });

  // PM2 sends SIGINT (Ctrl-C / stop) before SIGTERM; handle it identically so
  // graceful shutdown works regardless of which signal arrives first.
  process.on('SIGINT', () => {
    try {
      const sseChat = require('./services/sseChat');
      sseChat.clients.forEach((res) => {
        try {
          if (sseChat._isResponseOpen(res)) {
            res.write('event: server_restart\ndata: {"reconnectAfter":2000}\n\n');
            res.end();
          }
        } catch (_) {}
      });
    } catch (_) {}
    setTimeout(() => process.exit(0), 2000);
  });
