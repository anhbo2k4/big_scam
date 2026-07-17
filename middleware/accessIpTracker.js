const { AccessVisit } = require('../models');

const RECENT_TRACK_DEBOUNCE_MS = 4000;
const MAX_STORED_PATHS = 40;
const MAX_STORED_CLIENTS = 24;
const recentTrackByKey = new Map();

const BLOCKED_PATH_PREFIXES = [
  '/wp-',
  '/wordpress',
  '/xmlrpc.php',
  '/wp-admin',
  '/wp-content',
  '/wp-includes',
  '/phpmyadmin',
  '/pma',
  '/.env',
  '/.git',
  '/cgi-bin',
  '/vendor/',
  '/server-status',
  '/events',
  '/ui/fragments'
];

const BLOCKED_PATH_EXACT = new Set([
  '/wp-login.php',
  '/xmlrpc.php'
]);

function normalizeIp(rawIp) {
  const value = String(rawIp || '').trim();
  if (!value) return '';
  return value.replace('::ffff:', '');
}

function getClientIp(req) {
  const xForwardedFor = req.headers['x-forwarded-for'];
  const forwarded = Array.isArray(xForwardedFor)
    ? xForwardedFor[0]
    : String(xForwardedFor || '').split(',')[0].trim();

  return normalizeIp(forwarded || req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '');
}

function isTrackablePageRequest(req) {
  if (req.method !== 'GET') return false;

  const path = String(req.path || '').toLowerCase();
  if (!path || path.startsWith('/api')) return false;
  if (path.startsWith('/css') || path.startsWith('/js') || path.startsWith('/images') || path.startsWith('/uploads')) return false;
  if (path.startsWith('/socket.io')) return false;
  if (/\.(css|js|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|map|txt|xml)$/i.test(path)) return false;
  if (BLOCKED_PATH_EXACT.has(path)) return false;
  if (BLOCKED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;

  const accept = String(req.get('accept') || '').toLowerCase();
  const fetchDest = String(req.get('sec-fetch-dest') || '').toLowerCase();
  const fetchMode = String(req.get('sec-fetch-mode') || '').toLowerCase();
  const looksLikeDocument = fetchDest === 'document' || fetchMode === 'navigate';
  const acceptsHtml = accept.includes('text/html');
  return looksLikeDocument || acceptsHtml;
}

function normalizePath(req) {
  const value = String(req.path || '/').trim();
  if (!value) return '/';
  return value;
}

function parseVisitedPaths(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .slice(0, MAX_STORED_PATHS);
  } catch (_) {
    return [];
  }
}

function parseClientSignatures(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        key: String(item?.key || '').trim(),
        browser: String(item?.browser || '').trim(),
        os: String(item?.os || '').trim(),
        device: String(item?.device || '').trim(),
        count: Math.max(1, Number(item?.count || 1)),
        last_seen_at: String(item?.last_seen_at || '').trim()
      }))
      .filter((item) => item.key)
      .slice(0, MAX_STORED_CLIENTS);
  } catch (_) {
    return [];
  }
}

function parseBrowser(ua) {
  const v = String(ua || '').toLowerCase();
  if (!v) return 'Unknown';
  if (v.includes('edg/')) return 'Edge';
  if (v.includes('opr/') || v.includes('opera')) return 'Opera';
  if (v.includes('chrome/') && !v.includes('edg/')) return 'Chrome';
  if (v.includes('firefox/')) return 'Firefox';
  if (v.includes('safari/') && !v.includes('chrome/')) return 'Safari';
  if (v.includes('samsungbrowser/')) return 'Samsung Internet';
  return 'Other';
}

function parseOs(ua) {
  const v = String(ua || '').toLowerCase();
  if (!v) return 'Unknown';
  if (v.includes('windows')) return 'Windows';
  if (v.includes('android')) return 'Android';
  if (v.includes('iphone') || v.includes('ipad') || v.includes('ios')) return 'iOS';
  if (v.includes('mac os') || v.includes('macintosh')) return 'macOS';
  if (v.includes('linux')) return 'Linux';
  return 'Other';
}

function parseDevice(ua, req) {
  const v = String(ua || '').toLowerCase();
  const mobileHeader = String(req.get('sec-ch-ua-mobile') || '').toLowerCase();
  if (v.includes('ipad') || (v.includes('tablet') && !v.includes('mobile'))) return 'Tablet';
  if (v.includes('mobile') || v.includes('android') || mobileHeader === '?1') return 'Mobile';
  return 'Desktop';
}

function getClientSignature(req) {
  const userAgent = String(req.get('user-agent') || '').trim();
  const browser = parseBrowser(userAgent);
  const os = parseOs(userAgent);
  const device = parseDevice(userAgent, req);
  const key = [browser, os, device].join('|').toLowerCase();
  return {
    key,
    browser,
    os,
    device,
    user_agent: userAgent.slice(0, 255)
  };
}

function rememberRecentTrack(ip, pagePath) {
  const key = `${ip}|${pagePath}`;
  const now = Date.now();
  const last = Number(recentTrackByKey.get(key) || 0);
  if (last && (now - last) < RECENT_TRACK_DEBOUNCE_MS) return false;

  recentTrackByKey.set(key, now);

  if (recentTrackByKey.size > 20000) {
    const cutoff = now - (RECENT_TRACK_DEBOUNCE_MS * 3);
    for (const [cacheKey, ts] of recentTrackByKey.entries()) {
      if (Number(ts || 0) < cutoff) recentTrackByKey.delete(cacheKey);
    }
  }

  return true;
}

async function upsertAccessVisit(ip, pagePath, clientSignature) {
  const now = new Date();
  const defaultClient = clientSignature && clientSignature.key
    ? [{
      key: clientSignature.key,
      browser: clientSignature.browser,
      os: clientSignature.os,
      device: clientSignature.device,
      count: 1,
      last_seen_at: now.toISOString()
    }]
    : [];

  const [row, created] = await AccessVisit.findOrCreate({
    where: { ip_address: ip },
    defaults: {
      ip_address: ip,
      hit_count: 1,
      visited_paths: JSON.stringify([pagePath]),
      client_signatures: JSON.stringify(defaultClient),
      client_count: defaultClient.length,
      last_user_agent: String(clientSignature?.user_agent || '') || null,
      first_seen_at: now,
      last_seen_at: now,
      created_at: now,
      updated_at: now
    }
  });

  if (created) return;

  const existingHitCount = Number(row.hit_count || 0);
  const nextPaths = parseVisitedPaths(row.visited_paths);
  const deduped = [pagePath, ...nextPaths.filter((p) => p !== pagePath)].slice(0, MAX_STORED_PATHS);
  const clients = parseClientSignatures(row.client_signatures);
  const byKey = new Map(clients.map((item) => [item.key, item]));

  if (clientSignature && clientSignature.key) {
    const existingClient = byKey.get(clientSignature.key);
    if (existingClient) {
      existingClient.count = Math.max(1, Number(existingClient.count || 1)) + 1;
      existingClient.last_seen_at = now.toISOString();
      existingClient.browser = clientSignature.browser;
      existingClient.os = clientSignature.os;
      existingClient.device = clientSignature.device;
      byKey.set(existingClient.key, existingClient);
    } else {
      byKey.set(clientSignature.key, {
        key: clientSignature.key,
        browser: clientSignature.browser,
        os: clientSignature.os,
        device: clientSignature.device,
        count: 1,
        last_seen_at: now.toISOString()
      });
    }
  }

  const nextClients = Array.from(byKey.values())
    .sort((a, b) => {
      const bTs = new Date(b.last_seen_at || 0).getTime();
      const aTs = new Date(a.last_seen_at || 0).getTime();
      if (bTs !== aTs) return bTs - aTs;
      return Number(b.count || 0) - Number(a.count || 0);
    })
    .slice(0, MAX_STORED_CLIENTS);

  await row.update({
    hit_count: existingHitCount + 1,
    visited_paths: JSON.stringify(deduped),
    client_signatures: JSON.stringify(nextClients),
    client_count: nextClients.length,
    last_user_agent: String(clientSignature?.user_agent || row.last_user_agent || '') || null,
    last_seen_at: now,
    updated_at: now
  });
}

function trackWebsiteAccessIp(req, res, next) {
  try {
    if (!AccessVisit || !isTrackablePageRequest(req)) return next();

    const ip = getClientIp(req);
    const pagePath = normalizePath(req);
    const clientSignature = getClientSignature(req);
    if (!ip || !pagePath) return next();

    res.on('finish', () => {
      try {
        if (res.statusCode < 200 || res.statusCode >= 400) return;
        const contentType = String(res.getHeader('content-type') || '').toLowerCase();
        if (!contentType.includes('text/html')) return;
        if (!rememberRecentTrack(ip, pagePath)) return;
        void upsertAccessVisit(ip, pagePath, clientSignature).catch(() => {});
      } catch (_) {}
    });
  } catch (_) {}

  return next();
}

module.exports = {
  trackWebsiteAccessIp
};
