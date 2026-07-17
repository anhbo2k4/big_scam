'use strict';

/**
 * services/sseChatStream.js
 *
 * In-process SSE public chat service.
 *
 * Works ALONGSIDE the existing sseChat.js (which handles game session events).
 * This service owns three endpoints (wired in routes/stream.js):
 *
 *   GET  /stream         — short-lived SSE connection (~15 s, then reconnect signal)
 *   POST /message        — publish a chat message
 *   POST /kill           — admin: terminate all connections + clear replay buffer
 *   GET  /stream/status  — health probe
 *
 * Environment variables (all optional, sensible defaults for shared hosting):
 *
 *   STREAM_TTL_MS           15000                    SSE connection lifetime in ms (10000–30000 recommended)
 *   STREAM_MAX_CLIENTS      100                      Hard cap — returns 503 beyond this; set 1.5× peak
 *   STREAM_MSG_HISTORY      100                      Replay buffer size (# messages kept for reconnect)
 *   STREAM_PING_MS          5000                     Keep-alive comment interval — must be < proxy read timeout
 *   STREAM_KILL_SECRET                               If set, POST /kill requires x-kill-secret header
 */

// Clamp TTL to a safe range: never below 5 s (too many reconnects) or above 60 s (FD pressure)
const SSE_TTL_MS = Math.max(5_000, Math.min(60_000, parseInt(process.env.STREAM_TTL_MS || '15000', 10)));
const MAX_CLIENTS = Math.max(1, parseInt(process.env.STREAM_MAX_CLIENTS || '100', 10));
const MSG_HISTORY = Math.max(10, parseInt(process.env.STREAM_MSG_HISTORY || '100', 10));
const KEEPALIVE_MS = Math.max(2_000, parseInt(process.env.STREAM_PING_MS || '5000', 10));
const KILL_SECRET = process.env.STREAM_KILL_SECRET || '';

class SSEChatStream {
  constructor() {
    this.clients = new Map();
    this._clientSeq = 0;
    this.messageBuffer = [];
    this._msgId = 0;
    this._registerShutdownHooks();
  }

  _bufferAndFanOut(msg) {
    this.messageBuffer.push(msg);
    if (this.messageBuffer.length > MSG_HISTORY) this.messageBuffer.shift();

    const frame = `id: ${msg.id}\ndata: ${JSON.stringify(msg)}\n\n`;

    for (const [clientId] of this.clients) {
      const c = this.clients.get(clientId);
      if (!c) continue;
      try {
        c.res.write(frame);
        if (typeof c.res.flush === 'function') c.res.flush();
      } catch {
        this._evict(clientId);
      }
    }
  }

  _evict(clientId) {
    const c = this.clients.get(clientId);
    if (!c) return;
    clearTimeout(c.ttlTimer);
    clearInterval(c.pingTimer);
    try { c.res.end(); } catch {}
    this.clients.delete(clientId);
  }

  subscribe(req, res) {
    if (this.clients.size >= MAX_CLIENTS) {
      return res.status(503).json({
        error: 'Server at capacity — please retry shortly',
        active: this.clients.size,
        maxClients: MAX_CLIENTS
      });
    }

    const clientId = ++this._clientSeq;
    const lastEvtId = Math.max(0,
      parseInt(req.headers['last-event-id'] || req.query.lastEventId || '0', 10) || 0
    );

    res.set({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    res.flushHeaders();

    const missed = this.messageBuffer.filter((m) => m.id > lastEvtId);
    if (missed.length) {
      res.write(missed.map((m) => `id: ${m.id}\ndata: ${JSON.stringify(m)}\n\n`).join(''));
    }

    const pingTimer = setInterval(() => {
      try {
        res.write(': ping\n\n');
        if (typeof res.flush === 'function') res.flush();
      } catch {
        this._evict(clientId);
      }
    }, KEEPALIVE_MS);
    if (typeof pingTimer.unref === 'function') pingTimer.unref();

    const ttlTimer = setTimeout(() => {
      try { res.write('event: reconnect\ndata: {}\n\n'); } catch {}
      this._evict(clientId);
    }, SSE_TTL_MS);
    if (typeof ttlTimer.unref === 'function') ttlTimer.unref();

    this.clients.set(clientId, { res, ttlTimer, pingTimer });
    req.on('close', () => this._evict(clientId));

    return clientId;
  }

  async publish(user, text) {
    const msg = {
      id: ++this._msgId,
      user,
      text,
      time: new Date().toISOString()
    };

    this._bufferAndFanOut(msg);
    return msg;
  }

  kill() {
    const count = this.clients.size;

    for (const [, c] of this.clients) {
      try {
        c.res.write('event: kill\ndata: {}\n\n');
        c.res.end();
      } catch {}
      clearTimeout(c.ttlTimer);
      clearInterval(c.pingTimer);
    }
    this.clients.clear();

    this.messageBuffer.length = 0;
    this._msgId = 0;

    return count;
  }

  getStatus() {
    return {
      connections: this.clients.size,
      maxClients: MAX_CLIENTS,
      buffered: this.messageBuffer.length,
      historySize: MSG_HISTORY,
      mode: 'in-process',
      ttlMs: SSE_TTL_MS,
      pingMs: KEEPALIVE_MS,
      uptimeSec: Math.floor(process.uptime())
    };
  }

  get killSecret() { return KILL_SECRET; }

  _registerShutdownHooks() {
    if (SSEChatStream._shutdownRegistered) return;
    SSEChatStream._shutdownRegistered = true;

    const handler = async (signal) => {
      console.log(`[stream] ${signal} received — closing ${this.clients.size} SSE connection(s)`);
      this.kill();
    };

    process.on('SIGTERM', () => handler('SIGTERM'));
    process.on('SIGINT', () => handler('SIGINT'));
  }
}

SSEChatStream._shutdownRegistered = false;

if (!global.__sseChatStreamInstance) {
  global.__sseChatStreamInstance = new SSEChatStream();
}

module.exports = global.__sseChatStreamInstance;
