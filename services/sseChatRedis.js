'use strict';

/**
 * services/sseChatRedis.js
 *
 * In-process SSE chat service for single Node.js process hosting (cPanel/VPS).
 * No Redis dependency.
 */

const SSE_TTL_MS = Math.max(5_000, Math.min(30_000, parseInt(process.env.STREAM_TTL_MS || '12000', 10)));
const MAX_CLIENTS = Math.max(1, parseInt(process.env.STREAM_MAX_CLIENTS || '50', 10));
const MSG_HISTORY = Math.max(10, parseInt(process.env.STREAM_MSG_HISTORY || '50', 10));
const KEEPALIVE_MS = Math.max(2_000, parseInt(process.env.STREAM_PING_MS || '5000', 10));
const KILL_SECRET = process.env.STREAM_KILL_SECRET || '';

class SSEChatRedis {
  constructor() {
    this.clients = new Map();
    this.messageBuffer = [];
    this._clientSeq = 0;
    this._msgId = 0;
    this._shutdownHooked = false;
    this._registerShutdownHooks();
  }

  _evict(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;
    clearTimeout(client.ttlTimer);
    clearInterval(client.pingTimer);
    try { client.res.end(); } catch (_) {}
    this.clients.delete(clientId);
  }

  _broadcast(msg) {
    this.messageBuffer.push(msg);
    if (this.messageBuffer.length > MSG_HISTORY) this.messageBuffer.shift();

    const frame = `id: ${msg.id}\ndata: ${JSON.stringify(msg)}\n\n`;
    for (const [clientId, client] of this.clients.entries()) {
      try {
        client.res.write(frame);
        if (typeof client.res.flush === 'function') client.res.flush();
      } catch (_) {
        this._evict(clientId);
      }
    }
  }

  subscribe(req, res) {
    if (this.clients.size >= MAX_CLIENTS) {
      return res.status(503).json({
        error: 'Server at capacity',
        active: this.clients.size,
        maxClients: MAX_CLIENTS
      });
    }

    const clientId = ++this._clientSeq;
    const lastEventId = Math.max(0, parseInt(req.headers['last-event-id'] || req.query.lastEventId || '0', 10) || 0);

    res.set({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    res.flushHeaders();

    const missed = this.messageBuffer.filter((m) => m.id > lastEventId);
    if (missed.length > 0) {
      res.write(missed.map((m) => `id: ${m.id}\ndata: ${JSON.stringify(m)}\n\n`).join(''));
    }

    const pingTimer = setInterval(() => {
      try {
        res.write(': ping\n\n');
        if (typeof res.flush === 'function') res.flush();
      } catch (_) {
        this._evict(clientId);
      }
    }, KEEPALIVE_MS);
    if (typeof pingTimer.unref === 'function') pingTimer.unref();

    const ttlTimer = setTimeout(() => {
      try {
        res.write('event: reconnect\ndata: {}\n\n');
      } catch (_) {}
      this._evict(clientId);
    }, SSE_TTL_MS);
    if (typeof ttlTimer.unref === 'function') ttlTimer.unref();

    this.clients.set(clientId, { res, pingTimer, ttlTimer });
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
    this._broadcast(msg);
    return msg;
  }

  kill() {
    const count = this.clients.size;
    for (const [clientId, client] of this.clients.entries()) {
      try {
        client.res.write('event: kill\ndata: {}\n\n');
        client.res.end();
      } catch (_) {}
      clearTimeout(client.ttlTimer);
      clearInterval(client.pingTimer);
      this.clients.delete(clientId);
    }
    this.messageBuffer.length = 0;
    this._msgId = 0;
    return count;
  }

  getStatus() {
    return {
      mode: 'in-process',
      connections: this.clients.size,
      maxClients: MAX_CLIENTS,
      buffered: this.messageBuffer.length,
      historySize: MSG_HISTORY,
      ttlMs: SSE_TTL_MS,
      pingMs: KEEPALIVE_MS,
      uptimeSec: Math.floor(process.uptime())
    };
  }

  get killSecret() {
    return KILL_SECRET;
  }

  _registerShutdownHooks() {
    if (this._shutdownHooked) return;
    this._shutdownHooked = true;
    const closeAll = () => {
      try { this.kill(); } catch (_) {}
    };
    process.on('SIGTERM', closeAll);
    process.on('SIGINT', closeAll);
  }
}

if (!global.__sseChatRedisInstance) {
  global.__sseChatRedisInstance = new SSEChatRedis();
}

module.exports = global.__sseChatRedisInstance;
