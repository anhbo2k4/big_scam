'use strict';

/**
 * routes/stream.js
 *
 * Production-ready SSE chat routes — powered by services/sseChatRedis.js (in-process mode).
 *
 * ── Endpoints ─────────────────────────────────────────────────────────────────
 *   GET  /stream         SSE — short-lived (~15 s), auto-reconnect via event:reconnect
 *   POST /message        Publish { user, text } — rate-limited 5/IP/10 s
 *   POST /kill           Admin: close all SSE connections + clear replay buffer
 *   GET  /stream/status  Health probe (connections, buffer, mode, uptime)
 *
 * ── Mounting (already done in app.js) ─────────────────────────────────────────
 *   const streamRouter = require('./routes/stream');
 *   app.use(streamRouter);   // before 404 handler
 *
 * ── .env variables ────────────────────────────────────────────────────────────
 *   STREAM_TTL_MS           12000                    Connection lifetime before reconnect signal
 *   STREAM_MAX_CLIENTS      50                       Hard cap → 503 beyond this
 *   STREAM_MSG_HISTORY      50                       Replay buffer depth
 *   STREAM_PING_MS          5000                     Keep-alive comment interval (< nginx proxy_read_timeout)
 *   STREAM_KILL_SECRET      (empty)                  Protect POST /kill in production
 *
 * ── Frontend drop-in (no UI changes needed) ───────────────────────────────────
 *
 *   // ── state ──
 *   let lastEventId = 0;
 *   let sse         = null;
 *   let killed      = false;   // true after server sends event:kill — stop reconnecting
 *
 *   // ── connect / reconnect ──
 *   function connectStream() {
 *     if (sse) { sse.close(); sse = null; }
 *
 *     sse = new EventSource('/stream?lastEventId=' + lastEventId);
 *
 *     // default message — new chat message
 *     sse.onmessage = function(e) {
 *       try {
 *         var msg = JSON.parse(e.data);
 *         lastEventId = parseInt(e.lastEventId || msg.id, 10) || lastEventId;
 *         appendMessage(msg);          // → your render function
 *       } catch(_) {}
 *     };
 *
 *     // server closed cleanly — reconnect immediately
 *     sse.addEventListener('reconnect', function() {
 *       sse.close(); sse = null;
 *       if (!killed) setTimeout(connectStream, 200);
 *     });
 *
 *     // admin kill — stop reconnecting; show a notice
 *     sse.addEventListener('kill', function() {
 *       killed = true;
 *       sse.close(); sse = null;
 *       showNotice('Chat was closed by the server.');
 *     });
 *
 *     // network error / proxy drop — backoff reconnect
 *     sse.onerror = function() {
 *       sse.close(); sse = null;
 *       if (!killed) setTimeout(connectStream, 1000);
 *     };
 *   }
 *   connectStream();
 *
 *   // ── render helper with XSS safety and smooth scroll ──
 *   function escHtml(s) {
 *     return String(s)
 *       .replace(/&/g,'&amp;').replace(/</g,'&lt;')
 *       .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 *   }
 *   function appendMessage(msg) {
 *     var chatEl  = document.getElementById('chat');
 *     var time    = new Date(msg.time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
 *     var el      = document.createElement('div');
 *     el.className = 'chat-msg';
 *     el.innerHTML = '<b>' + escHtml(msg.user) + '</b> '
 *                  + '<span class="ts">' + escHtml(time) + '</span><br>'
 *                  + escHtml(msg.text);
 *     chatEl.appendChild(el);
 *     // smooth-scroll only when user is already near the bottom (within 120 px)
 *     var nearBottom = chatEl.scrollHeight - chatEl.scrollTop - chatEl.clientHeight < 120;
 *     if (nearBottom) chatEl.scrollTo({ top: chatEl.scrollHeight, behavior: 'smooth' });
 *   }
 *
 *   // ── send a message ──
 *   async function sendMessage(user, text) {
 *     var resp = await fetch('/message', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ user: user, text: text })
 *     });
 *     if (resp.status === 429) { showNotice('Too many messages — slow down.'); return; }
 *     if (!resp.ok) { var d = await resp.json().catch(function(){ return {}; });
 *                     showNotice('Error: ' + (d.error || resp.statusText)); }
 *   }
 *
 *   // ── optional admin kill button ──
 *   // document.getElementById('btn-kill').addEventListener('click', function() {
 *   //   fetch('/kill', { method:'POST', headers:{'x-kill-secret':'YOUR_SECRET'} });
 *   // });
 */

const router     = require('express').Router();
const rateLimit  = require('express-rate-limit');
const sseChatRedis = require('../services/sseChatRedis');

// ─── Rate limiter — 5 POST /message per IP per 10 s ─────────────────────────
//
// Uses in-memory counters per Node process (fast and enough for shared hosting).
//
const messageLimiter = rateLimit({
  windowMs:              10_000,  // 10-second window
  max:                   5,       // max 5 messages per IP per window
  standardHeaders:       true,
  legacyHeaders:         false,
  skipSuccessfulRequests: false,
  message: { error: 'Too many messages — please slow down.' }
});

// ─── Input sanitisation ───────────────────────────────────────────────────────

/**
 * Strip C0/C1 control characters (excluding tab \x09) to prevent SSE header
 * injection — a bare \n or \r inside an SSE field value would break the framing.
 * Also trims whitespace and enforces a max length.
 */
function sanitize(raw, maxLen) {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\x80-\x9F]/g, '')
    .trim()
    .slice(0, maxLen);
}

// ─── GET /stream ──────────────────────────────────────────────────────────────
//
// Opens a short-lived SSE stream. Default TTL is 12 s (STREAM_TTL_MS).
// At TTL the server writes `event: reconnect` so the client reconnects in ~200 ms
// passing its last known id — the replay buffer fills any gap seamlessly.
//
// Query param  : ?lastEventId=N  (the browser also sends Last-Event-ID header
//                                 automatically on EventSource error-reconnects)
// Nginx config : proxy_read_timeout must be > STREAM_PING_MS (default 5 s)
//                proxy_buffering off;  X-Accel-Buffering: no  (set by service)
//
router.get('/stream', (req, res) => {
  sseChatRedis.subscribe(req, res);
});

// ─── POST /message ────────────────────────────────────────────────────────────
//
// Body: { "user": "Alice", "text": "Hello!" }
// Response: { "ok": true, "id": 42 }
//
router.post('/message', messageLimiter, async (req, res) => {
  const user = sanitize(req.body?.user, 50);
  const text = sanitize(req.body?.text, 500);

  if (!user || !text) {
    return res.status(400).json({
      error: '"user" (max 50 chars) and "text" (max 500 chars) are required.'
    });
  }

  try {
    const msg = await sseChatRedis.publish(user, text);
    res.json({ ok: true, id: msg.id });
  } catch (err) {
    console.error('[/message] publish error:', err.message);
    res.status(503).json({ error: 'Message delivery failed — please retry.' });
  }
});

// ─── POST /kill ───────────────────────────────────────────────────────────────
//
// Closes every active SSE connection immediately and clears the replay buffer.
// Useful for emergency moderation, maintenance windows, or admin resets.
//
// If STREAM_KILL_SECRET env var is set:
//   • Send the secret in the `x-kill-secret` header, OR
//   • Include "secret" in the JSON body.
//
// Example (curl):
//   curl -X POST /kill -H "x-kill-secret: your-secret"
//
router.post('/kill', (req, res) => {
  const secret = sseChatRedis.killSecret;
  if (secret) {
    const provided = (req.headers['x-kill-secret'] || req.body?.secret || '').trim();
    if (!provided || provided !== secret) {
      return res.status(403).json({ error: 'Forbidden: invalid or missing kill secret.' });
    }
  }

  const terminated = sseChatRedis.kill();
  console.log(`[/kill] terminated ${terminated} SSE connection(s)`);
  res.json({ ok: true, terminated });
});

// ─── GET /stream/status ───────────────────────────────────────────────────────
//
// Health / diagnostics probe. Safe to expose to uptime monitors.
// Returns: { connections, buffered, mode, maxClients, ttlMs }
//
router.get('/stream/status', (_req, res) => {
  res.json({ ok: true, ...sseChatRedis.getStatus() });
});

module.exports = router;
