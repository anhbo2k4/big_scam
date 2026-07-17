const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  message: 'Quá nhiều yêu cầu từ IP này. Vui lòng thử lại sau.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for static files, root, and read-only polling endpoints
    if (req.path === '/' ||
        req.path.startsWith('/css') ||
        req.path.startsWith('/js') ||
        req.path.startsWith('/build-modern') ||
        req.path.startsWith('/build-legacy') ||
        req.path.startsWith('/images') ||
        req.path.startsWith('/public') ||
        req.path.startsWith('/static')) {
      return true;
    }
    // Skip SSE long-lived connections entirely — they hold open 1 slot for minutes
    if (req.method === 'GET' && req.path.includes('/events')) return true;
    // Skip high-frequency chat signals (typing fires every ~2s while composing)
    if (req.method === 'POST' && req.path.includes('/typing')) return true;
    // Skip lightweight read receipts
    if (req.method === 'PUT' && req.path.includes('/mark-read')) return true;
    // Skip long-poll fallback — fires every 300ms when SSE is unavailable
    if (req.method === 'GET' && req.path.includes('/poll/')) return true;
    // Skip GET requests to high-frequency polling endpoints
    if (req.method === 'GET' && (
        req.path.includes('/wallet') ||
        req.path.includes('/transactions') ||
        req.path.includes('/player-inventory') ||
        req.path.includes('/messages') ||
        req.path.includes('/all-chats'))) {
      return true;
    }
    return false;
  }
});

// Strict rate limiter for game session progress (anti-spam)
const gameProgressLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Quá nhiều yêu cầu chơi. Vui lòng chờ 1 phút.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Rate limit per session code
    return `${req.ip}-${req.params.code}`;
  }
});

// Strict rate limiter for session creation
const sessionCreateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 sessions per minute per IP
  message: 'Quá nhiều phiên chơi được tạo. Vui lòng chờ 1 phút.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Rate limit per IP
    return req.ip;
  }
});

// Authentication attempt limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== 'POST' // Only apply to POST requests
});

// Dedicated limiter for long-poll fallback (/api/chat/poll/).
// The global apiLimiter exempts /poll/ to avoid 429s at 300ms cadence,
// but with no limiter at all a 50-user fallback storm = ~10k req/min.
// 40 req/min/IP ≈ one poll per 1.5s — comfortable for Layer 3 (300ms debounce
// means the client never actually hits more than ~30–40 real requests/min).
const pollLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      retryAfter: Math.ceil(options.windowMs / 1000),
      message: 'Polling quá nhanh. Vui lòng thử lại.'
    });
  }
});

module.exports = {
  apiLimiter,
  gameProgressLimiter,
  sessionCreateLimiter,
  authLimiter,
  pollLimiter
};
