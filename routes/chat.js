const express = require('express');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fsPromises = require('fs').promises;
const os = require('os');

const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const chatbotController = require('../controllers/chatbotController');
const { readSettingsFromDB } = require('../controllers/settingsController');
const sseChat = require('../services/sseChat');
const { pollLimiter } = require('../middleware/rateLimitMiddleware');

const chatUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
const DEFAULT_CHAT_AGENT_NAME = 'CSKH Lâm TaoBao';
const CHAT_SESSION_REUSE_ATTRIBUTES = [
  'id',
  'session_code',
  'user_id',
  'customer_name',
  'customer_phone',
  'customer_email',
  'customer_ip',
  'status',
  'topic',
  'issue_description',
  'metadata',
  'support_agent_name',
  'support_agent_avatar',
  'message_count',
  'unread_count',
  'updated_at',
  'closed_at'
];
const CHAT_SETTINGS_CACHE_TTL_MS = Math.max(1000, Number(process.env.CHAT_SETTINGS_CACHE_TTL_MS || 15000));
let cachedChatAgentSettings = null;
let cachedChatAgentSettingsAt = 0;
let cachedChatAgentSettingsPromise = null;

async function resolveChatUploadDir() {
  const defaultDir = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(__dirname, '../public/uploads');
  for (const dir of [defaultDir, path.join(os.tmpdir(), 'giftbox-game-uploads')]) {
    try { await fsPromises.mkdir(dir, { recursive: true }); return dir; } catch (_) {}
  }
  throw new Error('No writable upload directory');
}

function resolveChatUploadCandidates(attachmentUrl) {
  const normalizedUrl = String(attachmentUrl || '').trim().replace(/\\/g, '/');
  if (!normalizedUrl.startsWith('/uploads/')) return [];

  const fileName = path.basename(normalizedUrl);
  if (!fileName || fileName === '.' || fileName === '..') return [];

  const defaultDir = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(__dirname, '../public/uploads');

  return [
    path.join(defaultDir, fileName),
    path.join(os.tmpdir(), 'giftbox-game-uploads', fileName)
  ];
}

async function deleteChatAttachmentIfOwned(attachmentUrl) {
  const candidates = resolveChatUploadCandidates(attachmentUrl);
  if (!candidates.length) return;

  await Promise.all(candidates.map(async (filePath) => {
    try {
      await fsPromises.unlink(filePath);
    } catch (err) {
      if (err && err.code !== 'ENOENT') {
        console.warn('[chat] attachment cleanup failed:', filePath, err.message);
      }
    }
  }));
}

const xss = require('xss');

function sanitizeMessage(text) {
  // Allow safe rich-text formatting tags sent by the Tiptap editor.
  // Strips scripts, event handlers, href, src and all other dangerous attributes.
  return xss(String(text || ''), {
    whiteList: {
      b: ['style'], i: ['style'], u: ['style'],
      strong: ['style'], em: ['style'],
      span: ['style'], p: ['style'],
      div: ['style'], br: [],
      ol: [], ul: [], li: []
    },
    // Only allow color and font-size inside style attributes
    css: false,
    onTagAttr(tag, name, value) {
      if (name === 'style') {
        const safe = String(value || '')
          .split(';')
          .filter(s => /^\s*(color|font-size)\s*:/i.test(s))
          .join(';');
        return safe ? `style="${safe}"` : '';
      }
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'noscript', 'object', 'embed']
  }).trim();
}

function isInvisibleSupportColor(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');

  return normalized === '#fff'
    || normalized === '#ffffff'
    || normalized === 'white'
    || normalized === 'rgb(255,255,255)'
    || normalized === 'rgba(255,255,255,1)'
    || normalized === 'rgba(255,255,255,1.0)';
}

function stripInvisibleSupportColors(html) {
  return String(html || '').replace(/style="([^"]*)"/gi, (fullMatch, styleValue) => {
    const nextRules = String(styleValue || '')
      .split(';')
      .map((rule) => String(rule || '').trim())
      .filter(Boolean)
      .filter((rule) => {
        if (!/^\s*color\s*:/i.test(rule)) return true;
        const colorValue = rule.split(':').slice(1).join(':').trim();
        return !isInvisibleSupportColor(colorValue);
      });

    return nextRules.length > 0
      ? `style="${nextRules.join('; ')}"`
      : '';
  });
}

function normalizeSupportRichText(text) {
  return stripInvisibleSupportColors(sanitizeMessage(text));
}

function csrfGuard(req, res, next) {
  const xrw = req.headers['x-requested-with'];
  const origin = req.headers['origin'];
  if (xrw === 'XMLHttpRequest') return next();
  if (origin) {
    const appUrl = process.env.APP_URL;
    const allowed = new Set([appUrl].filter(Boolean));
    // If APP_URL is configured, enforce strict origin check.
    // If APP_URL is not set, block ALL cross-origin non-AJAX requests to be safe.
    if (allowed.size > 0 && !allowed.has(origin)) {
      return res.status(403).json({ success: false, error: 'CSRF check failed' });
    }
    if (allowed.size === 0) {
      return res.status(403).json({ success: false, error: 'CSRF check failed' });
    }
  }
  next();
}

const { ChatSession, ChatMessage, GameSession } = db;
const CHAT_ADMIN_PERMISSION_CODE = 'manage_prizes';
const requireChatAdminPermission = [authMiddleware.verifyToken, authMiddleware.hasPermission(CHAT_ADMIN_PERMISSION_CODE)];
// Anti-spam: same IP must wait this long before creating another NEW session.
const IP_NEW_SESSION_COOLDOWN_MS = Number(process.env.CHAT_IP_COOLDOWN_MIN || 10) * 60 * 1000;
let lastChatCleanupAt = 0;

function getClientIP(req) {
  const rawForwarded = req.headers['x-forwarded-for'];
  const forwarded = Array.isArray(rawForwarded)
    ? rawForwarded[0]
    : String(rawForwarded || '').split(',')[0].trim();
  const rawIp = forwarded ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    'unknown';
  return String(rawIp || '').replace('::ffff:', '').trim() || 'unknown';
}

function getClientUserAgent(req) {
  return String(req.get('user-agent') || req.headers['user-agent'] || '').trim() || 'unknown';
}

function getFingerprintPayload(req) {
  const headerHash = String(req.headers['x-browser-fingerprint'] || '').trim();
  const bodyHash = String(req.body?.fingerprint_hash || '').trim();
  const fingerprintHash = headerHash || bodyHash || '';

  const headerData = String(req.headers['x-fingerprint-data'] || '').trim();
  const bodyData = req.body?.fingerprint_data;
  let fingerprintData = null;
  if (headerData) fingerprintData = headerData;
  else if (typeof bodyData === 'string' && bodyData.trim()) fingerprintData = bodyData.trim();
  else if (bodyData && typeof bodyData === 'object') {
    try {
      fingerprintData = JSON.stringify(bodyData);
    } catch (_) {
      fingerprintData = null;
    }
  }

  return {
    fingerprintHash,
    fingerprintData
  };
}

function getSessionMeta(session) {
  return session?.metadata && typeof session.metadata === 'object'
    ? { ...session.metadata }
    : {};
}

function emitAdminMessageNotification(session, messagePayload = {}, adminName = DEFAULT_CHAT_AGENT_NAME) {
  try {
    const meta = getSessionMeta(session);
    const gameSessionCode = String(meta.game_session_code || '').trim().toUpperCase();
    if (!gameSessionCode) return;

    const preview = String(messagePayload?.message || '').trim();
    sseChat.sendNotification(gameSessionCode, 'admin_message', {
      level: 'info',
      title: 'Tin nhan tu CSKH',
      message: preview || 'Ban co tin nhan moi tu CSKH.',
      session_code: gameSessionCode,
      chat_session_code: String(session?.session_code || '').trim(),
      sender_name: DEFAULT_CHAT_AGENT_NAME
    });
  } catch (_) {
    // Chat flow must continue even if notification emit fails.
  }
}

// Sessions never expire — only explicit admin deletion removes data.
function isSessionExpired() {
  return false;
}

// Automatic TTL cleanup is disabled — chat history is kept indefinitely.
async function cleanupExpiredChatData() {}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ');
}

function normalizePhone(phone) {
  return String(phone || '').trim().replace(/\D/g, '');
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeGameSessionCode(code) {
  return String(code || '').trim().toUpperCase();
}

async function getOrCreateChatSession(userId, options = {}) {
  const safeUserId = Number(userId || 0);
  if (!Number.isFinite(safeUserId) || safeUserId <= 0) return null;

  const {
    customerIP,
    customerName,
    customerPhone,
    customerEmail,
    gameSessionCode,
    fingerprintHash,
    fingerprintData,
    issueDescription,
    topic,
    userAgent
  } = options;

  const existing = await ChatSession.findOne({
    where: {
      user_id: safeUserId,
      status: { [Op.in]: ['active', 'waiting', 'closed'] }
    },
    attributes: CHAT_SESSION_REUSE_ATTRIBUTES,
    order: [['updated_at', 'DESC']]
  });

  if (existing && !isSessionExpired(existing)) {
    const existingMeta = getSessionMeta(existing);
    const currentGameCode = String(existingMeta.game_session_code || '').trim().toUpperCase();
    const nextGameCode = String(gameSessionCode || '').trim().toUpperCase() || currentGameCode || null;
    const updates = {
      user_id: safeUserId,
      customer_name: customerName || existing.customer_name,
      customer_phone: customerPhone || existing.customer_phone,
      customer_email: customerEmail || existing.customer_email,
      customer_ip: customerIP || existing.customer_ip,
      issue_description: String(issueDescription || '').trim() || existing.issue_description,
      topic: String(topic || '').trim() || existing.topic,
      metadata: {
        ...existingMeta,
        game_session_code: nextGameCode,
        fingerprint_hash: fingerprintHash || existingMeta.fingerprint_hash || null,
        fingerprint_data: fingerprintData || existingMeta.fingerprint_data || null,
        last_seen_ip: customerIP || existingMeta.last_seen_ip || null,
        last_seen_user_agent: userAgent || existingMeta.last_seen_user_agent || null,
        profile_completed: true,
        source: 'lucky-mystery-box-v2'
      },
      updated_at: new Date()
    };

    if (existing.status === 'closed') {
      updates.status = 'active';
      updates.closed_at = null;
    }

    await existing.update(updates);
    await existing.reload();
    return { session: existing, isExisting: true, source: 'user_id' };
  }

  return null;
}

function generateSessionCode(ip) {
  const safeIp = String(ip || '0.0.0.0');
  const ipHash = safeIp
    .replace(/[^0-9.]/g, '')
    .split('.')
    .map((x) => parseInt(x, 10) || 0)
    .reduce((acc, num) => acc + num, 0);
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CHAT_${ipHash}_${stamp}${rand}`;
}

async function getChatAgentSettings() {
  const now = Date.now();
  if (cachedChatAgentSettings && (now - cachedChatAgentSettingsAt) < CHAT_SETTINGS_CACHE_TTL_MS) {
    return cachedChatAgentSettings;
  }

  if (!cachedChatAgentSettingsPromise) {
    cachedChatAgentSettingsPromise = readSettingsFromDB()
      .then((settings) => {
        const chat = settings?.chat || {};
        cachedChatAgentSettings = {
          adminName: DEFAULT_CHAT_AGENT_NAME,
          adminAvatar: String(chat.adminAvatar || '').trim(),
          welcomeText: String(chat.welcomeText || '').trim()
        };
        cachedChatAgentSettingsAt = Date.now();
        return cachedChatAgentSettings;
      })
      .catch(() => {
        cachedChatAgentSettings = {
          adminName: DEFAULT_CHAT_AGENT_NAME,
          adminAvatar: '',
          welcomeText: ''
        };
        cachedChatAgentSettingsAt = Date.now();
        return cachedChatAgentSettings;
      })
      .finally(() => {
        cachedChatAgentSettingsPromise = null;
      });
  }

  return cachedChatAgentSettingsPromise;
}

function toInt(value, fallback = 0) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

async function requireContactInfo(req, res, next) {
  try {
    const customerName = normalizeName(req.body.customer_name);
    const customerPhone = normalizePhone(req.body.customer_phone);
    const gameSessionCode = normalizeGameSessionCode(req.body.game_session_code || req.body.session_code);

    if (!customerName) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập họ và tên.' });
    }
    if (!/^\d{10,11}$/.test(customerPhone)) {
      return res.status(400).json({ success: false, message: 'Số điện thoại phải gồm 10-11 chữ số.' });
    }
    if (!gameSessionCode) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mã phiên chơi.' });
    }

    const existingGameSession = await GameSession.findOne({
      attributes: ['session_code'],
      where: { session_code: gameSessionCode }
    });
    if (!existingGameSession) {
      return res.status(400).json({ success: false, message: 'Mã phiên chơi không tồn tại.' });
    }

    req.body.customer_name = customerName;
    req.body.customer_phone = customerPhone;
    req.body.game_session_code = gameSessionCode;
    // Keep customer_email for backward compatibility with existing DB schema/search.
    req.body.customer_email = normalizeEmail(req.body.customer_email || `${gameSessionCode}@session.local`);
    return next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Không thể xác thực thông tin chat.' });
  }
}

router.post('/start', requireContactInfo, async (req, res) => {
  try {
    await cleanupExpiredChatData();

    const customerIP = getClientIP(req);
    const userAgent = getClientUserAgent(req);
    const { fingerprintHash, fingerprintData } = getFingerprintPayload(req);
    const {
      customer_name,
      customer_phone,
      customer_email,
      game_session_code,
      issue_description,
      topic
    } = req.body;
    const userId = Number(req.session?.user?.id || req.body?.user_id || 0) || null;

    const gameSessionCode = game_session_code ? String(game_session_code).trim().toUpperCase() : '';

    const userSessionResult = await getOrCreateChatSession(userId, {
      customerIP,
      customerName: customer_name,
      customerPhone: customer_phone,
      customerEmail: customer_email,
      gameSessionCode,
      fingerprintHash,
      fingerprintData,
      issueDescription: issue_description,
      topic,
      userAgent
    });

    if (userSessionResult && userSessionResult.session) {
      return res.json({ success: true, data: userSessionResult.session, isExisting: true });
    }

    const candidates = await ChatSession.findAll({
      where: {
        customer_ip: customerIP,
        status: { [Op.in]: ['active', 'waiting', 'closed'] }
      },
      attributes: CHAT_SESSION_REUSE_ATTRIBUTES,
      order: [['updated_at', 'DESC']],
      limit: 30
    });

    const existingSession = candidates.find((sess) => {
      if (isSessionExpired(sess)) return false;

      const meta = getSessionMeta(sess);
      const sessFingerprint = String(meta.fingerprint_hash || '').trim();
      const sessGameCode = String(meta.game_session_code || '').trim().toUpperCase();
      const sessPhone = normalizePhone(sess.customer_phone || '');
      const sessEmail = normalizeEmail(sess.customer_email || '');
      const incomingEmail = normalizeEmail(customer_email || '');

      const matchedByFingerprint = Boolean(fingerprintHash && sessFingerprint && sessFingerprint === fingerprintHash);
      const matchedByContact = Boolean(!fingerprintHash && sessPhone && sessPhone === customer_phone && sessEmail === incomingEmail);
      if (!matchedByFingerprint && !matchedByContact) return false;

      if (gameSessionCode && sessGameCode && sessGameCode !== gameSessionCode) return false;
      return true;
    });

    if (existingSession) {
      const incomingGameCode = gameSessionCode;
      const existingMeta = getSessionMeta(existingSession);
      const currentGameCode = String(existingMeta.game_session_code || '').trim().toUpperCase();

      const nextMeta = {
        ...existingMeta,
        game_session_code: incomingGameCode || currentGameCode || null,
        fingerprint_hash: fingerprintHash || existingMeta.fingerprint_hash || null,
        fingerprint_data: fingerprintData || existingMeta.fingerprint_data || null,
        last_seen_ip: customerIP,
        last_seen_user_agent: userAgent,
        profile_completed: true,
        source: 'lucky-mystery-box-v2'
      };

      const updates = {
        user_id: existingSession.user_id || userId || null,
        customer_name,
        customer_phone,
        customer_email,
        customer_ip: customerIP || existingSession.customer_ip,
        issue_description: String(issue_description || '').trim() || existingSession.issue_description,
        topic: String(topic || '').trim() || existingSession.topic,
        metadata: nextMeta,
        updated_at: new Date()
      };
      if (existingSession.status === 'closed') {
        updates.status = 'active';
        updates.closed_at = null;
      }

      // Keep one active chat per customer, but always sync currently playing game session.
      if (incomingGameCode && incomingGameCode !== currentGameCode) {
        const currentEmail = String(existingSession.customer_email || '').trim();
        const emailForUpdate = /@session\.local$/i.test(currentEmail)
          ? `${incomingGameCode}@session.local`
          : currentEmail;
        updates.topic = `Hỗ trợ phiên ${incomingGameCode}`;
        updates.customer_email = normalizeEmail(emailForUpdate || `${incomingGameCode}@session.local`) || `${incomingGameCode}@session.local`;
      }

      await existingSession.update(updates);
      await existingSession.reload();

      return res.json({ success: true, data: existingSession, isExisting: true });
    }

    // ── Anti-spam: block new session creation if same IP just created one ──────
    // Allow override if the environment sets CHAT_IP_COOLDOWN_MIN=0 (disables).
    if (IP_NEW_SESSION_COOLDOWN_MS > 0 && customerIP && customerIP !== 'unknown') {
      const recentByIp = await ChatSession.findOne({
        where: {
          customer_ip: customerIP,
          created_at: { [Op.gte]: new Date(Date.now() - IP_NEW_SESSION_COOLDOWN_MS) },
          status: { [Op.notIn]: ['archived'] },
        },
        order: [['created_at', 'DESC']],
        attributes: ['session_code', 'created_at', 'customer_name'],
      });

      if (recentByIp) {
        const elapsed = Date.now() - new Date(recentByIp.created_at).getTime();
        const remainingMs = IP_NEW_SESSION_COOLDOWN_MS - elapsed;
        const remainingMin = Math.max(1, Math.ceil(remainingMs / 60000));
        return res.status(429).json({
          success: false,
          code: 'IP_RATE_LIMITED',
          message: `Địa chỉ IP này vừa mở một phiên chat. Vui lòng đợi thêm ${remainingMin} phút hoặc tiếp tục phiên hiện tại.`,
          existing_session_code: recentByIp.session_code,
          retry_after_minutes: remainingMin,
        });
      }
    }

    const sessionCode = generateSessionCode(customerIP);
    const safeTopic = String(topic || '').trim() || (gameSessionCode ? `Hỗ trợ phiên ${gameSessionCode}` : 'Hỗ trợ khách hàng');

    const chatAgent = await getChatAgentSettings();
    const supportName = chatAgent.adminName || DEFAULT_CHAT_AGENT_NAME;
    const welcomeText = (chatAgent.welcomeText || `Xin chào ${customer_name}! Chúng tôi đã nhận thông tin của bạn và sẵn sàng hỗ trợ.`)
      .replace(/\{name\}/g, customer_name || 'bạn');

    const newSession = await ChatSession.create({
      session_code: sessionCode,
      user_id: userId,
      customer_name,
      customer_phone,
      customer_email,
      customer_ip: customerIP,
      status: 'active',
      topic: safeTopic,
      issue_description: String(issue_description || '').trim() || null,
      metadata: {
        game_session_code: gameSessionCode || null,
        fingerprint_hash: fingerprintHash || null,
        fingerprint_data: fingerprintData || null,
        created_ip: customerIP,
        user_agent: userAgent,
        profile_completed: true,
        source: 'lucky-mystery-box-v2'
      },
      support_agent_name: supportName,
      support_agent_avatar: chatAgent.adminAvatar || null
    });

    await ChatMessage.create({
      session_code: sessionCode,
      sender_name: supportName,
      sender_type: 'support',
      message: welcomeText,
      message_type: 'text',
      is_read: false
    });

    await newSession.update({
      message_count: 1,
      unread_count: 1,
      updated_at: new Date()
    });

    return res.json({ success: true, data: newSession, isExisting: false });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/quick-start', async (req, res) => {
  try {
    await cleanupExpiredChatData();

    const customerIP = getClientIP(req);
    const userAgent = getClientUserAgent(req);
    const { fingerprintHash, fingerprintData } = getFingerprintPayload(req);
    const candidates = await ChatSession.findAll({
      where: {
        customer_ip: customerIP,
        status: { [Op.in]: ['active', 'waiting'] }
      },
      attributes: CHAT_SESSION_REUSE_ATTRIBUTES,
      order: [['updated_at', 'DESC']],
      limit: 20
    });

    const existingSession = candidates.find((sess) => {
      if (isSessionExpired(sess)) return false;
      const meta = getSessionMeta(sess);
      const sessFingerprint = String(meta.fingerprint_hash || '').trim();
      const sessUa = String(meta.user_agent || '').trim();
      if (fingerprintHash && sessFingerprint && fingerprintHash === sessFingerprint) return true;
      return !fingerprintHash && sessUa && sessUa === userAgent;
    });

    if (existingSession) {
      const meta = getSessionMeta(existingSession);
      const profileCompleted = !!meta.profile_completed;
      if (!profileCompleted) {
        return res.json({
          success: true,
          data: null,
          requires_profile: true,
          message: 'Vui lòng nhập đầy đủ thông tin trước khi bắt đầu chat.'
        });
      }

      await existingSession.update({
        metadata: {
          ...meta,
          fingerprint_hash: fingerprintHash || meta.fingerprint_hash || null,
          fingerprint_data: fingerprintData || meta.fingerprint_data || null,
          user_agent: meta.user_agent || userAgent,
          last_seen_ip: customerIP,
          last_seen_user_agent: userAgent,
          profile_completed: !!meta.profile_completed,
          source: 'lucky-mystery-box-v2'
        },
        updated_at: new Date()
      });

      const hasExistingMessage = await ChatMessage.findOne({
        where: { session_code: existingSession.session_code },
        attributes: ['id'],
        order: [['id', 'DESC']]
      }).catch(() => null);
      if (!hasExistingMessage) {
        const chatAgent = await getChatAgentSettings();
        const supportName = existingSession.support_agent_name || chatAgent.adminName || DEFAULT_CHAT_AGENT_NAME;
        const welcomeText = (chatAgent.welcomeText || 'Xin chào! Chúng tôi đã nhận yêu cầu hỗ trợ của bạn và sẵn sàng đồng hành ngay bây giờ.')
          .replace(/\{name\}/g, String(existingSession.customer_name || 'bạn'));
        const welcomeMessage = await ChatMessage.create({
          session_code: existingSession.session_code,
          sender_name: supportName,
          sender_type: 'support',
          message: welcomeText,
          message_type: 'text',
          is_read: false,
          metadata: {
            source: 'quick-start-system-welcome'
          }
        });
        await existingSession.update({
          message_count: Math.max(1, Number(existingSession.message_count || 0) + 1),
          unread_count: Math.max(1, Number(existingSession.unread_count || 0) + 1),
          updated_at: new Date()
        });
        sseChat.newMessageToPlayer(existingSession.session_code, welcomeMessage);
      }

      await existingSession.reload();
      return res.json({ success: true, data: existingSession, isExisting: true });
    }

    // Do not create anonymous sessions in quick-start.
    // Customers must complete pre-chat profile first.
    return res.json({
      success: true,
      data: null,
      requires_profile: true,
      message: 'Vui lòng nhập đầy đủ thông tin trước khi bắt đầu chat.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/profile/:code', requireContactInfo, async (req, res) => {
  try {
    const sessionCode = String(req.params.code || '').trim();
    const session = await ChatSession.findOne({ where: { session_code: sessionCode } });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }
    if (isSessionExpired(session)) {
      return res.status(410).json({ success: false, message: `Phiên chat đã hết hạn sau ${CHAT_SESSION_TTL_DAYS} ngày.` });
    }

    const customerIP = getClientIP(req);
    const userAgent = getClientUserAgent(req);
    const meta = getSessionMeta(session);
    const gameSessionCode = normalizeGameSessionCode(req.body.game_session_code || req.body.session_code);

    await session.update({
      customer_name: req.body.customer_name,
      customer_phone: req.body.customer_phone,
      customer_email: req.body.customer_email,
      customer_ip: customerIP,
      topic: `Hỗ trợ phiên ${gameSessionCode}`,
      metadata: {
        ...meta,
        game_session_code: gameSessionCode,
        user_agent: meta.user_agent || userAgent,
        last_seen_ip: customerIP,
        last_seen_user_agent: userAgent,
        profile_completed: true,
        source: 'lucky-mystery-box-v2'
      },
      updated_at: new Date()
    });

    await session.reload();
    return res.json({ success: true, data: session });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/session/:code', async (req, res) => {
  try {
    const rawCode = String(req.params.code || '').trim().toUpperCase();
    const session = await ChatSession.findOne({
      where: { session_code: rawCode }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }
    if (isSessionExpired(session)) {
      return res.status(410).json({ success: false, message: `Phiên chat đã hết hạn sau ${CHAT_SESSION_TTL_DAYS} ngày.` });
    }

    const messages = await ChatMessage.findAll({
      where: { session_code: rawCode },
      order: [['created_at', 'ASC']]
    });

    return res.json({ success: true, data: { session, messages } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/messages/:code', async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      where: { session_code: req.params.code }
    });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }
    if (isSessionExpired(session)) {
      return res.status(410).json({ success: false, message: `Phiên chat đã hết hạn sau ${CHAT_SESSION_TTL_DAYS} ngày.` });
    }

    const rawLimit = toInt(req.query.limit, 0);
    const limit = Math.max(0, Math.min(200, rawLimit));

    let messages = [];
    if (limit > 0) {
      const newestFirst = await ChatMessage.findAll({
        where: { session_code: req.params.code },
        order: [['created_at', 'DESC']],
        limit
      });
      messages = newestFirst.reverse();
    } else {
      messages = await ChatMessage.findAll({
        where: { session_code: req.params.code },
        order: [['created_at', 'ASC']]
      });
    }

    return res.json({ success: true, data: messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Customer-facing file upload (no admin auth required, validates chat session)
router.post('/upload', chatUpload.single('file'), async (req, res) => {
  try {
    const sessionCode = String(req.body.session_code || req.query.session_code || '').trim();
    if (!sessionCode) {
      return res.status(400).json({ success: false, message: 'Thiếu session_code.' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file nào được gửi.' });
    }
    const session = await ChatSession.findOne({ where: { session_code: sessionCode } });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }
    if (isSessionExpired(session)) {
      return res.status(410).json({ success: false, message: `Phiên chat đã hết hạn sau ${CHAT_SESSION_TTL_DAYS} ngày.` });
    }

    const uploadDir = await resolveChatUploadDir();
    const originalName = String(req.file.originalname || `file-${Date.now()}`);
    const ext = path.extname(originalName).toLowerCase();
    const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeName);
    await fsPromises.writeFile(filePath, req.file.buffer);

    const fileUrl = `/uploads/${safeName}`;
    const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].includes(ext);
    const isAudio = ['.webm', '.ogg', '.mp3', '.wav', '.m4a', '.aac'].includes(ext);

    return res.json({
      success: true,
      data: {
        url: fileUrl,
        name: safeName,
        originalName,
        isImage,
        isAudio,
        mimeType: req.file.mimetype || 'application/octet-stream',
        size: req.file.size || 0
      }
    });
  } catch (err) {
    console.error('Chat upload error:', err);
    return res.status(500).json({ success: false, message: 'Upload thất bại.' });
  }
});

router.post('/message', async (req, res) => {
  try {
    const {
      session_code,
      sender_name,
      sender_type = 'customer',
      message,
      message_type = 'text',
      attachment_url
    } = req.body;

    const normalizedMessage = sender_type === 'support'
      ? normalizeSupportRichText(message)
      : sanitizeMessage(message);
    if (!session_code || !normalizedMessage) {
      return res.status(400).json({ success: false, message: 'Thiếu session_code hoặc message.' });
    }

    const session = await ChatSession.findOne({ where: { session_code } });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }
    if (isSessionExpired(session)) {
      return res.status(410).json({ success: false, message: `Phiên chat đã hết hạn sau ${CHAT_SESSION_TTL_DAYS} ngày.` });
    }

    const senderType = ['customer', 'support', 'bot'].includes(sender_type) ? sender_type : 'customer';
    const sessionMeta = getSessionMeta(session);

    if (senderType === 'customer') {
      const profileCompleted = !!sessionMeta.profile_completed;
      const existingName = normalizeName(session.customer_name || '');
      const existingPhone = normalizePhone(session.customer_phone || '');
      const hasName = Boolean(existingName);
      const hasPhone = /^\d{10,11}$/.test(existingPhone);

      if (!profileCompleted || !hasName || !hasPhone) {
        const payloadName = normalizeName(req.body?.customer_name || sender_name || '');
        const payloadPhone = normalizePhone(req.body?.customer_phone || '');
        const canUpgradeProfile = Boolean(payloadName) && /^\d{10,11}$/.test(payloadPhone);

        if (canUpgradeProfile) {
          const mergedMeta = {
            ...sessionMeta,
            profile_completed: true,
            upgraded_from_message: true,
            profile_upgraded_at: new Date().toISOString()
          };
          await session.update({
            customer_name: payloadName,
            customer_phone: payloadPhone,
            metadata: mergedMeta,
            updated_at: new Date()
          });
        } else {
        return res.status(403).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin trước khi chat với admin.',
          requires_profile: true
        });
        }
      }
    }

    const customerIP = getClientIP(req);
    const userAgent = getClientUserAgent(req);
    const chatAgent = await getChatAgentSettings();
    const supportName = session.support_agent_name || chatAgent.adminName || DEFAULT_CHAT_AGENT_NAME;
    const newMessage = await ChatMessage.create({
      session_code,
      sender_name: String(sender_name || (senderType === 'customer' ? session.customer_name : supportName)).trim(),
      sender_type: senderType,
      message: normalizedMessage,
      message_type,
      attachment_url: attachment_url || null,
      is_read: false,
      metadata: {
        ip: customerIP,
        user_agent: userAgent,
        source: 'chat-message'
      }
    });

    const nextUnreadCount = senderType === 'customer'
      ? Math.max(0, toInt(session.unread_count) + 1)
      : Math.max(0, toInt(session.unread_count));

    await session.update({
      message_count: Math.max(0, toInt(session.message_count) + 1),
      unread_count: nextUnreadCount,
      customer_ip: customerIP || session.customer_ip,
      metadata: {
        ...sessionMeta,
        user_agent: sessionMeta.user_agent || userAgent,
        last_seen_ip: customerIP,
        last_seen_user_agent: userAgent
      },
      updated_at: new Date(),
      first_response_at: senderType === 'support' && !session.first_response_at ? new Date() : session.first_response_at
    });

    if (senderType === 'customer' && !session.first_response_at) {
      try {
        await chatbotController.generateBotResponse(session_code, normalizedMessage, sender_name || session.customer_name || 'Bạn');
      } catch (_) {
        // Keep chat usable even if bot generation fails.
      }
    }

    // Broadcast via SSE
    if (senderType === 'customer') {
      sseChat.newMessageToAdmins(session_code, newMessage);
    } else {
      sseChat.newMessageToPlayer(session_code, newMessage);
      emitAdminMessageNotification(session, newMessage, newMessage.sender_name || supportName);
    }

    return res.json({ success: true, data: newMessage });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/close/:code', async (req, res) => {
  try {
    const { satisfaction } = req.body;
    const feedback = req.body.feedback ? sanitizeMessage(req.body.feedback) : null;

    const session = await ChatSession.findOne({
      where: { session_code: String(req.params.code || '').trim().toUpperCase() }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }
    if (isSessionExpired(session)) {
      return res.status(410).json({ success: false, message: `Phiên chat đã hết hạn sau ${CHAT_SESSION_TTL_DAYS} ngày.` });
    }

    await session.update({
      status: 'closed',
      closed_at: new Date(),
      customer_satisfaction: satisfaction || session.customer_satisfaction,
      satisfaction_feedback: feedback || session.satisfaction_feedback,
      updated_at: new Date()
    });

    return res.json({ success: true, data: session });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/quick-replies', async (req, res) => {
  try {
    const replies = chatbotController.getQuickReplies();
    return res.json({ success: true, data: replies });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const total = await ChatSession.count();
    const active = await ChatSession.count({ where: { status: 'active' } });
    const closed = await ChatSession.count({ where: { status: 'closed' } });

    return res.json({
      success: true,
      data: {
        total_chats: total,
        active_chats: active,
        closed_chats: closed
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/admin/all-chats', ...requireChatAdminPermission, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

    // Admins see ALL sessions regardless of age — the TTL only applies to
    // customer-facing routes (to prevent customers reopening stale sessions).
    let where = {};
    if (status && ['active', 'waiting', 'closed', 'archived'].includes(status)) {
      where.status = status;
    }

    if (search) {
      const q = String(search).trim();
      where = {
        ...where,
        [Op.or]: [
          { customer_name: { [Op.like]: `%${q}%` } },
          { customer_email: { [Op.like]: `%${q}%` } },
          { customer_phone: { [Op.like]: `%${q}%` } },
          { session_code: { [Op.like]: `%${q}%` } },
          { customer_ip: { [Op.like]: `%${q}%` } },
          { topic: { [Op.like]: `%${q}%` } }
        ]
      };
    }

    const currentPage = Math.max(1, toInt(page, 1));
    const pageSize = Math.max(1, Math.min(200, toInt(limit, 50)));
    const offset = (currentPage - 1) * pageSize;

    const latestMessageTextLiteral = db.sequelize.literal(`(
      SELECT cm.message
      FROM chat_messages cm
      WHERE cm.session_code = ChatSession.session_code
      ORDER BY cm.created_at DESC
      LIMIT 1
    )`);
    const latestMessageSenderTypeLiteral = db.sequelize.literal(`(
      SELECT cm.sender_type
      FROM chat_messages cm
      WHERE cm.session_code = ChatSession.session_code
      ORDER BY cm.created_at DESC
      LIMIT 1
    )`);
    const latestMessageTypeLiteral = db.sequelize.literal(`(
      SELECT cm.message_type
      FROM chat_messages cm
      WHERE cm.session_code = ChatSession.session_code
      ORDER BY cm.created_at DESC
      LIMIT 1
    )`);

    const { count, rows } = await ChatSession.findAndCountAll({
      where,
      attributes: {
        include: [
          [latestMessageTextLiteral, 'last_message_text'],
          [latestMessageSenderTypeLiteral, 'last_message_sender_type'],
          [latestMessageTypeLiteral, 'last_message_type']
        ]
      },
      order: [['updated_at', 'DESC']],
      limit: pageSize,
      offset
    });

    return res.json({
      success: true,
      data: rows,
      total: count,
      page: currentPage,
      pages: Math.ceil(count / pageSize)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/admin/chat/:sessionCode/messages', ...requireChatAdminPermission, async (req, res) => {
  try {
    const messages = await ChatMessage.findAll({
      where: { session_code: req.params.sessionCode },
      order: [['created_at', 'ASC']]
    });

    return res.json({ success: true, data: messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Admin joins/claims a chat session as the primary support agent.
 * Creates a system message visible to the customer.
 */
router.post('/admin/chat/:sessionCode/join', ...requireChatAdminPermission, async (req, res) => {
  try {
    const sessionCode = String(req.params.sessionCode || '').trim();
    if (!sessionCode) return res.status(400).json({ success: false, message: 'Thiếu sessionCode.' });

    const session = await ChatSession.findOne({ where: { session_code: sessionCode } });
    if (!session) return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    if (isSessionExpired(session)) {
      return res.status(410).json({ success: false, message: `Phiên chat đã hết hạn sau ${CHAT_SESSION_TTL_DAYS} ngày.` });
    }

    const adminId = Number(req.user?.id || 0) || null;
    const adminName = String(req.user?.full_name || req.user?.username || 'Admin').trim() || 'Admin';
    const adminUsername = String(req.user?.username || '').trim() || null;

    const sessionMeta = getSessionMeta(session);
    sessionMeta.active_admin_id = adminId;
    sessionMeta.active_admin_name = adminName;
    sessionMeta.active_admin_username = adminUsername;
    sessionMeta.active_admin_at = new Date().toISOString();

    await session.update({
      support_agent_id: adminId,
      support_agent_name: DEFAULT_CHAT_AGENT_NAME,
      updated_at: new Date(),
      metadata: sessionMeta,
      status: session.status === 'closed' ? 'closed' : 'active'
    });

    // Create a system-style message so the customer knows who joined
    const joinMsg = await ChatMessage.create({
      session_code: sessionCode,
      sender_type: 'support',
      sender_name: DEFAULT_CHAT_AGENT_NAME,
      message: `🤝 ${DEFAULT_CHAT_AGENT_NAME} đã tham gia hỗ trợ bạn`,
      message_type: 'text',
      is_read: false,
      metadata: {
        is_join_event: true,
        sender_admin_id: adminId,
        sender_admin_username: adminUsername,
        sender_admin_full_name: adminName
      }
    });

    sseChat.newMessageToPlayer(sessionCode, joinMsg);
    await session.reload();
    return res.json({ success: true, data: session });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/admin/send-message', csrfGuard, ...requireChatAdminPermission, async (req, res) => {
  try {
    const { session_code, message } = req.body;
    const adminName = req.user?.full_name || req.user?.username || 'Admin';

    const normalizedMessage = normalizeSupportRichText(message);
    if (!session_code || !normalizedMessage) {
      return res.status(400).json({ success: false, message: 'Thiếu session_code hoặc message.' });
    }

    const session = await ChatSession.findOne({ where: { session_code } });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }
    if (isSessionExpired(session)) {
      return res.status(410).json({ success: false, message: `Phiên chat đã hết hạn sau ${CHAT_SESSION_TTL_DAYS} ngày.` });
    }

    const adminId = Number(req.user?.id || 0) || null;
    const adminUsername = String(req.user?.username || '').trim() || null;
    const adminFullName = String(req.user?.full_name || '').trim() || null;

    const newMessage = await ChatMessage.create({
      session_code,
      sender_type: 'support',
      sender_name: DEFAULT_CHAT_AGENT_NAME,
      message: normalizedMessage,
      is_read: false,
      metadata: {
        sender_admin_id: adminId,
        sender_admin_username: adminUsername,
        sender_admin_full_name: adminFullName
      }
    });

    const sessionMeta = session.metadata && typeof session.metadata === 'object'
      ? { ...session.metadata }
      : {};
    sessionMeta.active_admin_id = adminId;
    sessionMeta.active_admin_name = adminName;
    sessionMeta.active_admin_username = adminUsername;
    sessionMeta.active_admin_at = new Date().toISOString();

    await session.update({
      support_agent_id: adminId,
      support_agent_name: DEFAULT_CHAT_AGENT_NAME,
      status: session.status === 'closed' ? 'active' : session.status,
      updated_at: new Date(),
      first_response_at: session.first_response_at || new Date(),
      metadata: sessionMeta
    });

    // Broadcast via SSE to player
    sseChat.newMessageToPlayer(session_code, newMessage);
    emitAdminMessageNotification(session, newMessage, DEFAULT_CHAT_AGENT_NAME);

    return res.json({ success: true, data: newMessage });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/admin/chat/:sessionCode/messages/:messageId', ...requireChatAdminPermission, async (req, res) => {
  try {
    const sessionCode = String(req.params.sessionCode || '').trim();
    const messageId = toInt(req.params.messageId, 0);
    const adminName = req.user?.full_name || req.user?.username || 'Admin';
    const adminId = Number(req.user?.id || 0) || null;
    const normalizedMessage = normalizeSupportRichText(req.body?.message || '');

    if (!sessionCode || messageId <= 0) {
      return res.status(400).json({ success: false, message: 'Thiếu sessionCode hoặc messageId hợp lệ.' });
    }
    if (!normalizedMessage) {
      return res.status(400).json({ success: false, message: 'Nội dung tin nhắn không được để trống.' });
    }

    const session = await ChatSession.findOne({ where: { session_code: sessionCode } });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }

    const chatMessage = await ChatMessage.findOne({
      where: {
        id: messageId,
        session_code: sessionCode,
        sender_type: 'support'
      }
    });

    if (!chatMessage) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin nhắn admin để chỉnh sửa.' });
    }

    const messageType = String(chatMessage.message_type || 'text').toLowerCase();
    if (messageType !== 'text') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể chỉnh sửa tin nhắn văn bản.' });
    }

    const metadata = chatMessage.metadata && typeof chatMessage.metadata === 'object'
      ? { ...chatMessage.metadata }
      : {};

    const senderAdminId = Number(metadata.sender_admin_id || 0) || null;
    if (senderAdminId && adminId && senderAdminId !== adminId) {
      return res.status(403).json({ success: false, message: 'Bạn chỉ có thể sửa tin nhắn do chính bạn gửi.' });
    }

    metadata.edited_at = new Date().toISOString();
    metadata.edited_by_name = String(adminName || 'Admin').trim();
    metadata.edited_by_admin_id = adminId;

    await chatMessage.update({
      message: normalizedMessage,
      metadata,
      updated_at: new Date()
    });

    await session.update({
      updated_at: new Date()
    });

    sseChat.messageEdited(sessionCode, chatMessage);

    return res.json({ success: true, data: chatMessage });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/admin/chat/:sessionCode/mark-resolved', ...requireChatAdminPermission, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      where: { session_code: req.params.sessionCode }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }

    await session.update({
      status: 'closed',
      resolved_at: new Date(),
      closed_at: new Date(),
      updated_at: new Date()
    });

    return res.json({ success: true, data: session });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/admin/chat/:sessionCode/mark-read', ...requireChatAdminPermission, async (req, res) => {
  try {
    await ChatMessage.update(
      { is_read: true, read_at: new Date() },
      {
        where: {
          session_code: req.params.sessionCode,
          sender_type: 'customer'
        }
      }
    );

    const session = await ChatSession.findOne({
      where: { session_code: req.params.sessionCode }
    });

    if (session) {
      const adminName = req.user?.full_name || req.user?.username || 'Admin';
      const adminId = Number(req.user?.id || 0) || null;
      const adminUsername = String(req.user?.username || '').trim() || null;
      const metadata = session.metadata && typeof session.metadata === 'object'
        ? { ...session.metadata }
        : {};

      metadata.active_admin_id = adminId;
      metadata.active_admin_name = adminName;
      metadata.active_admin_username = adminUsername;
      metadata.active_admin_at = new Date().toISOString();

      await session.update({
        unread_count: 0,
        status: session.status === 'closed' ? 'closed' : 'active',
        metadata,
        updated_at: new Date()
      });
    }

    // Notify the player (if online) that admin has seen their messages
    sseChat.markReadByAdmin(req.params.sessionCode);

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/admin/chat/:sessionCode/archive', ...requireChatAdminPermission, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ where: { session_code: req.params.sessionCode } });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }

    await session.update({
      status: 'archived',
      updated_at: new Date()
    });

    return res.json({ success: true, data: session });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/admin/chat/:sessionCode/priority', ...requireChatAdminPermission, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ where: { session_code: req.params.sessionCode } });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }

    const priority = String(req.body?.priority || 'normal').toLowerCase();
    const safePriority = priority === 'high' ? 'high' : 'normal';
    const metadata = session.metadata && typeof session.metadata === 'object'
      ? { ...session.metadata }
      : {};

    metadata.priority = safePriority;

    await session.update({
      metadata,
      updated_at: new Date()
    });

    return res.json({ success: true, data: { session_code: session.session_code, priority: safePriority } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/admin/chat/:sessionCode', ...requireChatAdminPermission, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      where: { session_code: req.params.sessionCode }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }

    await ChatMessage.destroy({ where: { session_code: req.params.sessionCode } });
    await session.destroy();

    return res.json({ success: true, message: 'Đã xóa phiên chat.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/admin/chat/:sessionCode/messages/:messageId', ...requireChatAdminPermission, async (req, res) => {
  try {
    const sessionCode = String(req.params.sessionCode || '').trim();
    const messageId = toInt(req.params.messageId, 0);
    const adminId = Number(req.user?.id || 0) || null;
    const adminUsername = String(req.user?.username || '').trim().toLowerCase();

    if (!sessionCode || messageId <= 0) {
      return res.status(400).json({ success: false, message: 'Thiếu sessionCode hoặc messageId hợp lệ.' });
    }

    const chatMessage = await ChatMessage.findOne({
      where: {
        id: messageId,
        session_code: sessionCode,
        sender_type: 'support'
      }
    });

    if (!chatMessage) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin nhắn admin để xóa.' });
    }

    const metadata = chatMessage.metadata && typeof chatMessage.metadata === 'object'
      ? { ...chatMessage.metadata }
      : {};
    const ownerAdminId = Number(metadata.sender_admin_id || 0) || null;
    const ownerAdminUsername = String(metadata.sender_admin_username || '').trim().toLowerCase();

    if (ownerAdminId && adminId && ownerAdminId !== adminId) {
      return res.status(403).json({ success: false, message: 'Bạn chỉ có thể xóa tin nhắn do chính bạn gửi.' });
    }
    if (!ownerAdminId && ownerAdminUsername && adminUsername && ownerAdminUsername !== adminUsername) {
      return res.status(403).json({ success: false, message: 'Bạn chỉ có thể xóa tin nhắn do chính bạn gửi.' });
    }

    await deleteChatAttachmentIfOwned(chatMessage.attachment_url);
    await chatMessage.destroy();

    const session = await ChatSession.findOne({ where: { session_code: sessionCode } });
    if (session) {
      const nextCount = await ChatMessage.count({ where: { session_code: sessionCode } }).catch(() => null);
      const updates = { updated_at: new Date() };
      if (Number.isFinite(nextCount)) updates.message_count = Number(nextCount);
      await session.update(updates);
    }

    return res.json({ success: true, message: 'Đã xóa tin nhắn.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/admin/chat/:sessionCode/note', ...requireChatAdminPermission, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      where: { session_code: req.params.sessionCode }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }

    const note = String(req.body?.note || '').trim();
    const metadata = session.metadata && typeof session.metadata === 'object'
      ? { ...session.metadata }
      : {};

    metadata.admin_note = note;

    await session.update({
      metadata,
      updated_at: new Date()
    });

    return res.json({ success: true, data: session });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/admin/chat/:sessionCode/nickname', ...requireChatAdminPermission, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      where: { session_code: req.params.sessionCode }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    }

    const nickname = String(req.body?.nickname || '').trim().slice(0, 60);
    const metadata = session.metadata && typeof session.metadata === 'object'
      ? { ...session.metadata }
      : {};

    if (nickname) {
      metadata.customer_nickname = nickname;
    } else {
      delete metadata.customer_nickname;
    }

    await session.update({
      metadata,
      updated_at: new Date()
    });

    return res.json({ success: true, data: session });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/admin/stats', ...requireChatAdminPermission, async (req, res) => {
  try {
    const [
      totalChats,
      activeChats,
      waitingChats,
      closedChats,
      unreadChats
    ] = await Promise.all([
      ChatSession.count(),
      ChatSession.count({ where: { status: 'active' } }),
      ChatSession.count({ where: { status: 'waiting' } }),
      ChatSession.count({ where: { status: 'closed' } }),
      ChatSession.count({ where: { unread_count: { [Op.gt]: 0 } } })
    ]);

    return res.json({
      success: true,
      data: {
        totalChats,
        activeChats,
        waitingChats,
        closedChats,
        unreadChats
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
// SSE ENDPOINTS — replaces Socket.IO for realtime
// ══════════════════════════════════════════════════════════════

/**
 * Admin SSE stream (authenticated).
 * Receives: new_message, typing, stop_typing, online_status, message_status, admin_event
 * IMPORTANT: must be declared BEFORE /events/:sessionCode so Express doesn't
 * treat the literal string "admin" as a session code.
 */
router.get('/events/admin', ...requireChatAdminPermission, (req, res) => {
  sseChat.subscribeAdmin(res, {
    adminName: req.user?.full_name || req.user?.username || 'Admin',
    adminId: req.user?.id || null
  });
});

/**
 * Player SSE stream.
 * Receives: new_message, typing, stop_typing, online_status, message_status
 */
router.get('/events/:sessionCode', async (req, res) => {
  const sessionCode = String(req.params.sessionCode || '').trim().toUpperCase();
  if (!sessionCode) return res.status(400).end();

  // Verify session exists
  const session = await ChatSession.findOne({ where: { session_code: sessionCode } }).catch(() => null);
  if (!session) return res.status(404).end();
  if (isSessionExpired(session)) return res.status(410).end();

  // SEC-AUTH: if session belongs to a logged-in user, verify caller identity
  if (session.user_id !== null && session.user_id !== undefined) {
    const callerId = Number(req.session?.user?.id || 0) || null;
    const perms = Array.isArray(req.session?.user?.permissions) ? req.session.user.permissions : [];
    const isAdmin = req.session?.user?.role === 'admin' ||
      perms.some((p) => String(p?.code || '') === CHAT_ADMIN_PERMISSION_CODE);
    if (!isAdmin && callerId !== session.user_id) {
      return res.status(403).end();
    }
  }

  sseChat.subscribePlayer(sessionCode, res);
  // Never send a final response — connection stays open
});

/**
 * Typing signal endpoint (POST).
 * Body: { session_code, role: 'player'|'admin', typing: true|false }
 */
router.post('/typing', async (req, res) => {
  const sessionCode = String(req.body?.session_code || '').trim().toUpperCase();
  const role = String(req.body?.role || 'player').toLowerCase();
  const isTyping = req.body?.typing !== false;

  if (!sessionCode) return res.status(400).json({ success: false });

  const session = await ChatSession.findOne({ where: { session_code: sessionCode } }).catch(() => null);
  if (!session) return res.status(404).json({ success: false });
  if (isSessionExpired(session)) return res.status(410).json({ success: false });

  if (role === 'admin') {
    // Admins must be authenticated to send typing events
    if (!req.session?.user) return res.status(401).json({ success: false });
    const perms = Array.isArray(req.session.user.permissions) ? req.session.user.permissions : [];
    const canUseAdminChat = perms.some((p) => String(p?.code || '') === CHAT_ADMIN_PERMISSION_CODE);
    if (!canUseAdminChat) return res.status(403).json({ success: false, message: 'Bạn không có quyền sử dụng CSKH.' });
    isTyping ? sseChat.adminTyping(sessionCode) : sseChat.adminStopTyping(sessionCode);
  } else {
    isTyping ? sseChat.playerTyping(sessionCode) : sseChat.playerStopTyping(sessionCode);
  }

  return res.json({ success: true });
});

/**
 * Mark messages as delivered (admin opened the chat).
 * Tells the player their messages have been delivered.
 */
router.post('/admin/chat/:sessionCode/mark-delivered', ...requireChatAdminPermission, async (req, res) => {
  const sessionCode = req.params.sessionCode;
  // Find the last undelivered customer message
  const lastMsg = await ChatMessage.findOne({
    where: { session_code: sessionCode, sender_type: 'customer' },
    order: [['created_at', 'DESC']]
  }).catch(() => null);

  if (lastMsg) sseChat.markDelivered(sessionCode, lastMsg.id);
  return res.json({ success: true });
});

/**
 * Mark messages as seen (player opened/read admin messages).
 * Tells admins the player has seen messages, and persists to DB.
 */
router.post('/mark-seen/:sessionCode', async (req, res) => {
  const sessionCode = String(req.params.sessionCode || '').trim().toUpperCase();
  if (sessionCode) {
    const session = await ChatSession.findOne({ where: { session_code: sessionCode } }).catch(() => null);
    if (!session) return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    if (isSessionExpired(session)) {
      return res.status(410).json({ success: false, message: `Phiên chat đã hết hạn sau ${CHAT_SESSION_TTL_DAYS} ngày.` });
    }

    sseChat.markSeen(sessionCode);
    // Persist seen state so the admin panel shows ✓✓ Đã xem on reload
    ChatMessage.update(
      { is_read: true },
      { where: { session_code: sessionCode, sender_type: 'support' } }
    ).catch(() => {});
  }
  return res.json({ success: true });
});

/**
 * Long-polling fallback for Layer 3 transport.
 * GET /api/chat/poll/:sessionCode?since=<unix_ms>
 *
 * Holds the request up to POLL_HOLD_MS waiting for new messages from
 * support/bot since the given timestamp. Returns immediately if messages
 * are found or when the hold expires (empty array response). Clients
 * should re-poll immediately after each response.
 *
 * Only returns messages where sender_type IN ('support','bot') so the
 * client never sees their own outgoing messages reflected back.
 */
const POLL_HOLD_MS = process.env.DISABLE_SSE === 'true' ? 0 : 25000;
const POLL_CHECK_INTERVAL_MS = 1200;
router.get('/poll/:sessionCode', pollLimiter, async (req, res) => {
  const sessionCode = String(req.params.sessionCode || '').trim().toUpperCase();
  if (!sessionCode) return res.status(400).json({ success: false, messages: [] });

  const sinceMs = parseInt(req.query.since, 10) || 0;
  // P3-3: reject abnormal timestamps — client clock skew or tampered requests
  const now = Date.now();
  if (sinceMs && (sinceMs > now + 30000 || sinceMs < now - 24 * 60 * 60 * 1000)) {
    return res.status(400).json({ success: false, messages: [], error: 'Invalid since parameter' });
  }
  const sinceDate = new Date(sinceMs || now - 30000);

  const session = await ChatSession.findOne({ where: { session_code: sessionCode } }).catch(() => null);
  if (!session) return res.status(404).json({ success: false, messages: [] });
  if (isSessionExpired(session)) return res.status(410).json({ success: false, messages: [] });

  let closed = false;
  req.on('close', () => { closed = true; });

  const deadline = Date.now() + POLL_HOLD_MS;

  const poll = async () => {
    if (closed) return;

    const msgs = await ChatMessage.findAll({
      where: {
        session_code: sessionCode,
        sender_type: { [Op.in]: ['support', 'bot'] },
        created_at: { [Op.gt]: sinceDate }
      },
      order: [['created_at', 'ASC']],
      limit: 50
    }).catch(() => []);

    if (msgs.length > 0) {
      if (!closed) {
        res.set('Cache-Control', 'no-store');
        return res.json({ success: true, messages: msgs.map((m) => m.toJSON()) });
      }
      return;
    }

    if (Date.now() >= deadline || closed) {
      if (!closed) {
        res.set('Cache-Control', 'no-store');
        return res.json({ success: true, messages: [] });
      }
      return;
    }

    setTimeout(poll, POLL_CHECK_INTERVAL_MS);
  };

  poll();
});

/**
 * SSE status endpoint — who is online.
 */
router.get('/sse-status', (req, res) => {
  return res.json({ success: true, data: sseChat.getStatus() });
});

/**
 * Admin file/image upload in chat.
 * Saves the file and creates a ChatMessage with attachment.
 */
router.post('/admin/send-file', ...requireChatAdminPermission, chatUpload.single('file'), async (req, res) => {
  try {
    const { session_code } = req.body;
    if (!session_code || !req.file) {
      return res.status(400).json({ success: false, message: 'Thiếu file hoặc session_code.' });
    }
    const session = await ChatSession.findOne({ where: { session_code } });
    if (!session) return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chat.' });
    if (isSessionExpired(session)) {
      return res.status(410).json({ success: false, message: `Phiên chat đã hết hạn sau ${CHAT_SESSION_TTL_DAYS} ngày.` });
    }

    const uploadDir = await resolveChatUploadDir();
    // Sanitize filename to prevent path traversal
    const safeName = (req.file.originalname || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
    const fileName = `chat_${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);
    await fsPromises.writeFile(filePath, req.file.buffer);

    const mimeType = String(req.file.mimetype || '').toLowerCase();
    const isImage = mimeType.startsWith('image/');
    const adminName = req.user?.full_name || req.user?.username || 'Admin';

    const adminId = Number(req.user?.id || 0) || null;
    const adminUsername = String(req.user?.username || '').trim() || null;
    const adminFullName = String(req.user?.full_name || '').trim() || null;

    const newMessage = await ChatMessage.create({
      session_code,
      sender_type: 'support',
      sender_name: DEFAULT_CHAT_AGENT_NAME,
      message: isImage ? `🖼️ ${req.file.originalname}` : `📎 ${req.file.originalname}`,
      message_type: isImage ? 'image' : 'file',
      attachment_url: `/uploads/${fileName}`,
      attachment_type: req.file.mimetype || null,
      is_read: false,
      metadata: {
        sender_admin_id: adminId,
        sender_admin_username: adminUsername,
        sender_admin_full_name: adminFullName
      }
    });

    const sessionMeta = session.metadata && typeof session.metadata === 'object'
      ? { ...session.metadata }
      : {};
    sessionMeta.active_admin_id = adminId;
    sessionMeta.active_admin_name = adminName;
    sessionMeta.active_admin_username = adminUsername;
    sessionMeta.active_admin_at = new Date().toISOString();

    await session.update({
      support_agent_id: adminId,
      support_agent_name: DEFAULT_CHAT_AGENT_NAME,
      updated_at: new Date(),
      first_response_at: session.first_response_at || new Date(),
      metadata: sessionMeta,
      status: session.status === 'closed' ? 'closed' : 'active'
    });
    sseChat.newMessageToPlayer(session_code, newMessage);
    emitAdminMessageNotification(session, newMessage, DEFAULT_CHAT_AGENT_NAME);
    return res.json({ success: true, data: newMessage });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

