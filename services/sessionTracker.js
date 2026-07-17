const db = require('../models');
const sseChat = require('./sseChat');

const SESSION_TOUCH_THROTTLE_MS = Math.max(
  10000,
  Number(process.env.SESSION_TRACKER_TOUCH_MS || 60000)
);
const SESSION_TRACKER_CACHE_LIMIT = Math.max(
  200,
  Number(process.env.SESSION_TRACKER_CACHE_LIMIT || 5000)
);

const touchCache = global.__giftboxSessionTrackerCache || new Map();
if (!global.__giftboxSessionTrackerCache) {
  global.__giftboxSessionTrackerCache = touchCache;
}

function getClientIp(req) {
  const rawForwarded = req?.headers?.['x-forwarded-for'];
  const forwarded = Array.isArray(rawForwarded)
    ? rawForwarded[0]
    : String(rawForwarded || '').split(',')[0].trim();
  const rawIp = forwarded
    || req?.ip
    || req?.connection?.remoteAddress
    || req?.socket?.remoteAddress
    || '';

  return String(rawIp || '').replace('::ffff:', '').trim() || 'unknown';
}

function getUserAgent(req) {
  return String(req?.get?.('user-agent') || req?.headers?.['user-agent'] || '')
    .trim()
    .slice(0, 1000) || null;
}

function getSessionId(req, overrides = {}) {
  return String(overrides.sessionId || req?.sessionID || '').trim() || null;
}

function getSessionUser(req, overrides = {}) {
  return overrides.user || req?.session?.user || req?.user || null;
}

function getGameSessionCode(req, overrides = {}) {
  const raw = overrides.gameSessionCode || req?.session?.sessionCode || null;
  const normalized = String(raw || '').trim().toUpperCase();
  return normalized || null;
}

function getSessionType(req, overrides = {}) {
  if (overrides.sessionType) return String(overrides.sessionType).trim().toLowerCase();

  const sessionUser = getSessionUser(req, overrides);
  const gameSessionCode = getGameSessionCode(req, overrides);

  if (sessionUser?.role === 'admin') return 'admin';
  if (sessionUser) return 'authenticated';
  if (gameSessionCode) return 'game';
  return 'guest';
}

function hasMeaningfulSession(req, overrides = {}) {
  const sessionId = getSessionId(req, overrides);
  if (!sessionId) return false;
  return !!(getSessionUser(req, overrides) || getGameSessionCode(req, overrides));
}

function shouldTrackRequest(req) {
  const method = String(req?.method || '').toUpperCase();
  const path = String(req?.path || '').toLowerCase();
  const accept = String(req?.headers?.accept || '').toLowerCase();

  if (!req) return false;
  if (method === 'HEAD' || method === 'OPTIONS') return false;
  if (accept.includes('text/event-stream')) return false;
  if (path === '/stream' || path === '/events' || path === '/realtime/events') return false;
  if (path.startsWith('/css')
    || path.startsWith('/js')
    || path.startsWith('/build-modern')
    || path.startsWith('/build-legacy')
    || path.startsWith('/images')
    || path.startsWith('/uploads')) {
    return false;
  }
  if (/\.(css|js|mjs|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|map|mp3|wav|ogg)$/i.test(path)) {
    return false;
  }

  return true;
}

function buildMetadata(req, overrides = {}) {
  const metadata = {
    ...(overrides.metadata && typeof overrides.metadata === 'object' ? overrides.metadata : {})
  };

  if (overrides.reason) {
    metadata.reason = String(overrides.reason).trim();
  }

  if (Object.keys(metadata).length === 0) {
    return null;
  }

  return metadata;
}

function buildSessionPayload(req, overrides = {}) {
  const sessionId = getSessionId(req, overrides);
  if (!sessionId) return null;

  const now = overrides.now instanceof Date ? overrides.now : new Date();
  const sessionUser = getSessionUser(req, overrides);
  const gameSessionCode = getGameSessionCode(req, overrides);
  const sessionType = getSessionType(req, overrides);
  const metadata = buildMetadata(req, overrides);

  const payload = {
    session_id: sessionId,
    user_id: sessionUser?.id || null,
    username: sessionUser?.username || null,
    role: sessionUser?.role || null,
    session_type: sessionType,
    game_session_code: gameSessionCode,
    ip_address: getClientIp(req),
    user_agent: getUserAgent(req),
    is_authenticated: !!sessionUser,
    remember_token_used: !!overrides.rememberTokenUsed,
    status: String(overrides.status || 'active').trim().toLowerCase() || 'active',
    last_seen_at: now,
    last_path: String(overrides.lastPath || req?.originalUrl || req?.path || '')
      .trim()
      .slice(0, 255) || null
  };

  if (overrides.loginAt instanceof Date) {
    payload.login_at = overrides.loginAt;
  }

  if (overrides.logoutAt instanceof Date) {
    payload.logout_at = overrides.logoutAt;
  }

  if (metadata) {
    payload.metadata = metadata;
  }

  return payload;
}

function buildStateKey(payload) {
  return JSON.stringify({
    session_id: payload.session_id,
    user_id: payload.user_id,
    username: payload.username,
    role: payload.role,
    session_type: payload.session_type,
    game_session_code: payload.game_session_code,
    is_authenticated: payload.is_authenticated,
    remember_token_used: payload.remember_token_used,
    status: payload.status,
    last_path: payload.last_path
  });
}

function pruneTouchCache(nowTs) {
  if (touchCache.size <= SESSION_TRACKER_CACHE_LIMIT) return;

  const cutoff = nowTs - (SESSION_TOUCH_THROTTLE_MS * 2);
  for (const [key, value] of touchCache.entries()) {
    if (Number(value?.lastWrittenAt || 0) < cutoff) {
      touchCache.delete(key);
    }
  }
}

async function ensureReady() {
  if (!db.UserSession || typeof db.UserSession.sync !== 'function') {
    return false;
  }

  if (!global.__giftboxUserSessionSyncPromise) {
    global.__giftboxUserSessionSyncPromise = db.UserSession.sync().catch((err) => {
      console.error('[SESSION] user session sync failed:', err?.message || err);
      return null;
    });
  }

  await global.__giftboxUserSessionSyncPromise;
  return true;
}

async function writeSessionPayload(payload, options = {}) {
  if (!payload?.session_id) return null;
  if (!db.UserSession) return null;

  const force = !!options.force;
  const nowTs = Date.now();
  const stateKey = buildStateKey(payload);
  const cached = touchCache.get(payload.session_id);

  if (!force && cached && cached.stateKey === stateKey && (nowTs - cached.lastWrittenAt) < SESSION_TOUCH_THROTTLE_MS) {
    return null;
  }

  touchCache.set(payload.session_id, {
    stateKey,
    lastWrittenAt: nowTs
  });
  pruneTouchCache(nowTs);

  try {
    await ensureReady();
    await db.UserSession.upsert(payload);
    sseChat.sendAdminEvent('user_session_update', {
      session_id: payload.session_id,
      user_id: payload.user_id,
      username: payload.username,
      role: payload.role,
      session_type: payload.session_type,
      game_session_code: payload.game_session_code,
      status: payload.status,
      is_authenticated: payload.is_authenticated,
      last_path: payload.last_path,
      last_seen_at: payload.last_seen_at,
      login_at: payload.login_at,
      logout_at: payload.logout_at
    });
    return payload;
  } catch (err) {
    console.error('[SESSION] user session write failed:', err?.message || err);
    return null;
  }
}

async function touchSession(req, overrides = {}) {
  if (!overrides.force && !shouldTrackRequest(req)) {
    return null;
  }

  if (!hasMeaningfulSession(req, overrides)) {
    return null;
  }

  const payload = buildSessionPayload(req, overrides);
  return writeSessionPayload(payload, { force: !!overrides.force });
}

async function recordLogin(req, sessionUser, options = {}) {
  return touchSession(req, {
    force: true,
    user: sessionUser,
    sessionType: sessionUser?.role === 'admin' ? 'admin' : 'authenticated',
    rememberTokenUsed: !!options.rememberMe,
    loginAt: options.loginAt instanceof Date ? options.loginAt : new Date(),
    status: 'active',
    metadata: {
      login_method: String(options.method || 'password')
    }
  });
}

function captureSessionSnapshot(req, overrides = {}) {
  const payload = buildSessionPayload(req, overrides);
  if (!payload) return null;
  return { payload };
}

async function recordLogoutBySnapshot(snapshot, options = {}) {
  if (!snapshot?.payload) return null;

  const now = options.logoutAt instanceof Date ? options.logoutAt : new Date();
  const baseMetadata = snapshot.payload.metadata && typeof snapshot.payload.metadata === 'object'
    ? snapshot.payload.metadata
    : {};

  return writeSessionPayload({
    ...snapshot.payload,
    status: String(options.status || 'logged_out').trim().toLowerCase() || 'logged_out',
    remember_token_used: typeof options.rememberTokenUsed === 'boolean'
      ? options.rememberTokenUsed
      : snapshot.payload.remember_token_used,
    last_seen_at: now,
    logout_at: now,
    last_path: String(options.lastPath || snapshot.payload.last_path || '').trim().slice(0, 255) || null,
    metadata: {
      ...baseMetadata,
      ...(options.reason ? { reason: String(options.reason).trim() } : {}),
      ...(options.metadata && typeof options.metadata === 'object' ? options.metadata : {})
    }
  }, { force: true });
}

async function recordLogout(req, options = {}) {
  const snapshot = captureSessionSnapshot(req, options);
  return recordLogoutBySnapshot(snapshot, options);
}

module.exports = {
  ensureReady,
  getClientIp,
  getSessionType,
  hasMeaningfulSession,
  shouldTrackRequest,
  touchSession,
  recordLogin,
  captureSessionSnapshot,
  recordLogout,
  recordLogoutBySnapshot
};
