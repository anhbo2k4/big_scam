const net = require('net');

const BLOCKED_METHODS = new Set(['TRACE', 'TRACK', 'CONNECT']);
const SUSPICIOUS_PATH_PREFIXES = [
  '/.git',
  '/.svn',
  '/.hg',
  '/.env',
  '/.well-known/acme-challenge/',
  '/phpmyadmin',
  '/pma',
  '/wp-',
  '/wordpress',
  '/xmlrpc.php',
  '/cgi-bin',
  '/server-status',
  '/server-info',
  '/boaform',
  '/autodiscover',
  '/vendor/',
  '/console/',
  '/actuator/',
  '/owa/',
  '/ecp/',
  '/geoserver/',
  '/jenkins/',
  '/manager/html',
  '/hudson/',
  '/solr/',
  '/_ignition/',
  '/debug/'
];
const SUSPICIOUS_PATH_EXACT = new Set([
  '/wp-login.php',
  '/xmlrpc.php',
  '/phpinfo.php',
  '/info.php',
  '/adminer.php',
  '/.env',
  '/.git/config',
  '/composer.json',
  '/composer.lock',
  '/package-lock.json',
  '/yarn.lock'
]);
const SUSPICIOUS_UA_TOKENS = [
  'sqlmap',
  'nikto',
  'acunetix',
  'nessus',
  'nmap',
  'masscan',
  'zgrab',
  'gobuster',
  'dirbuster',
  'dirb',
  'ffuf',
  'feroxbuster',
  'nuclei',
  'wpscan',
  'whatweb',
  'httpx',
  'jaeles',
  'metasploit',
  'burp',
  'owasp zap',
  'python-requests',
  'go-http-client',
  'libwww-perl'
];

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return fallback;
}

function normalizeHost(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';

  if (raw.startsWith('[') && raw.endsWith(']')) {
    return raw.slice(1, -1);
  }

  const withoutPort = raw.replace(/:\d+$/, '');
  if (withoutPort.startsWith('[') && withoutPort.endsWith(']')) {
    return withoutPort.slice(1, -1);
  }

  return withoutPort;
}

function extractHostFromUrl(value) {
  try {
    const parsed = new URL(String(value || '').trim());
    return normalizeHost(parsed.hostname);
  } catch (_) {
    return '';
  }
}

function parseAllowedHosts(...sources) {
  const hosts = new Set();

  sources.forEach((source) => {
    if (!source) return;

    if (typeof source === 'string') {
      source.split(',').forEach((entry) => {
        const trimmed = String(entry || '').trim();
        if (!trimmed) return;
        const host = trimmed.includes('://') ? extractHostFromUrl(trimmed) : normalizeHost(trimmed);
        if (host) hosts.add(host);
      });
      return;
    }

    if (Array.isArray(source)) {
      source.forEach((entry) => {
        const host = normalizeHost(entry);
        if (host) hosts.add(host);
      });
    }
  });

  return hosts;
}

function isIpHost(hostname) {
  return net.isIP(normalizeHost(hostname)) > 0;
}

function isLoopbackHost(hostname) {
  const normalized = normalizeHost(hostname);
  return normalized === 'localhost' || normalized === '127.0.0.1' || normalized === '::1';
}

function isSecureRequest(req) {
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '')
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    req.secure
    || forwardedProto.includes('https')
    || String(req.headers['x-forwarded-ssl'] || '').trim().toLowerCase() === 'on'
    || String(req.headers['front-end-https'] || '').trim().toLowerCase() === 'on'
    || String(req.headers['x-url-scheme'] || '').trim().toLowerCase() === 'https'
  );
}

function shouldUseSecureCookies(req) {
  return process.env.NODE_ENV === 'production' || isSecureRequest(req);
}

function resolveTrustProxySetting(value) {
  const normalized = String(value === undefined || value === null ? '1' : value).trim().toLowerCase();

  if (!normalized) return 1;
  if (normalized === 'true') return 1;
  if (normalized === 'false') return false;
  if (/^\d+$/.test(normalized)) return Number(normalized);
  return normalized;
}

function buildContentSecurityPolicy({ secureRequest = false } = {}) {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
    "connect-src 'self' https: wss:",
    "frame-src 'self'",
    "media-src 'self' blob: data: https:",
    "worker-src 'self' blob:",
    "manifest-src 'self'"
  ];

  if (secureRequest) {
    directives.push('upgrade-insecure-requests');
  }

  return directives.join('; ');
}

function isSuspiciousPath(pathname) {
  const normalized = String(pathname || '').trim().toLowerCase();
  if (!normalized) return false;
  if (SUSPICIOUS_PATH_EXACT.has(normalized)) return true;
  if (SUSPICIOUS_PATH_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return true;
  if (/\.(php\d*|asp|aspx|jsp|jspx|cgi|pl|bak|old|sql|tar|gz|zip|rar|7z|ini|ya?ml|log|conf|cfg|env)(?:\/|$)/i.test(normalized)) return true;
  if (/(^|\/)(?:id_rsa|config\.php|web\.config|docker-compose|\.ds_store)(?:$|[/?#])/i.test(normalized)) return true;
  return false;
}

function isSuspiciousUserAgent(userAgent) {
  const normalized = String(userAgent || '').trim().toLowerCase();
  if (!normalized) return false;
  return SUSPICIOUS_UA_TOKENS.some((token) => normalized.includes(token));
}

function createReconShieldMiddleware(options = {}) {
  const blockAutomationUserAgents = options.blockAutomationUserAgents !== false;
  const blockHeadRequests = Boolean(options.blockHeadRequests);

  return (req, res, next) => {
    const method = String(req.method || 'GET').trim().toUpperCase();
    const path = String(req.path || req.originalUrl || '/').trim();
    const userAgent = String(req.get('user-agent') || '').trim();
    const suspiciousPath = isSuspiciousPath(path);
    const suspiciousUserAgent = blockAutomationUserAgents && isSuspiciousUserAgent(userAgent);

    if (BLOCKED_METHODS.has(method)) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(405).send('Method Not Allowed');
    }

    if (blockHeadRequests && method === 'HEAD' && !String(path).startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(404).end();
    }

    if (suspiciousPath || suspiciousUserAgent) {
      res.setHeader('Cache-Control', 'no-store');
      if (req.path && req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy tài nguyên' });
      }
      return res.status(404).send('Not Found');
    }

    next();
  };
}

function createSecurityHeadersMiddleware(options = {}) {
  const enableCsp = options.enableCsp !== false;

  return (req, res, next) => {
    const secureRequest = isSecureRequest(req);

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    res.setHeader('Origin-Agent-Cluster', '?1');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');

    if (secureRequest) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    if (enableCsp) {
      res.setHeader('Content-Security-Policy', buildContentSecurityPolicy({ secureRequest }));
    }

    next();
  };
}

function createHostGuardMiddleware(options = {}) {
  const allowedHosts = options.allowedHosts instanceof Set ? options.allowedHosts : new Set();
  const blockDirectIpAccess = options.blockDirectIpAccess !== false;
  const allowLoopback = options.allowLoopback !== false;

  return (req, res, next) => {
    const hostname = normalizeHost(req.hostname || req.headers.host);

    if (!hostname) return next();
    if (allowLoopback && isLoopbackHost(hostname)) return next();

    if (allowedHosts.size > 0 && !allowedHosts.has(hostname)) {
      const payload = { success: false, message: 'Host không hợp lệ' };
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(421).json(payload);
      }
      return res.status(421).send(payload.message);
    }

    if (blockDirectIpAccess && isIpHost(hostname) && !allowedHosts.has(hostname)) {
      const payload = { success: false, message: 'Truy cập trực tiếp bằng IP đã bị chặn' };
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(403).json(payload);
      }
      return res.status(403).send(payload.message);
    }

    next();
  };
}

function createHttpsRedirectMiddleware(options = {}) {
  const enabled = Boolean(options.enabled);

  return (req, res, next) => {
    if (!enabled) return next();
    if (isSecureRequest(req) || isLoopbackHost(req.hostname)) return next();

    const host = String(req.headers.host || req.hostname || '').trim();
    if (!host) return next();

    const targetUrl = `https://${host}${req.originalUrl || req.url || '/'}`;
    const statusCode = req.method === 'GET' || req.method === 'HEAD' ? 301 : 307;
    return res.redirect(statusCode, targetUrl);
  };
}

function buildCookieOptions(req, overrides = {}) {
  return {
    path: '/',
    secure: shouldUseSecureCookies(req),
    ...overrides
  };
}

module.exports = {
  buildContentSecurityPolicy,
  buildCookieOptions,
  createReconShieldMiddleware,
  createHostGuardMiddleware,
  createHttpsRedirectMiddleware,
  createSecurityHeadersMiddleware,
  isSecureRequest,
  parseAllowedHosts,
  parseBoolean,
  resolveTrustProxySetting,
  shouldUseSecureCookies
};
