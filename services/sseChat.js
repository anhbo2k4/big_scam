'use strict';

/**
 * SSE Chat Service — replaces Socket.IO entirely.
 * Uses Server-Sent Events for realtime chat, typing indicators,
 * online/offline status, and admin realtime events.
 *
 * Singleton — require() this file anywhere to share state.
 */

class SSEChatService {
  constructor() {
    // Map<sessionCode, Map<clientId, res>> — player connections
    this.playerClients = new Map();
    // Map<clientId, res> — admin connections
    this.adminClients = new Map();
    // Map<clientId, { name: string, id?: string|number|null }> — admin identities for presence metadata
    this.adminMeta = new Map();
    // Map<sessionCode, timestamp> — last seen for offline players
    this.playerLastSeen = new Map();
    // Map<sessionCode, { player?: Timer, admin?: Timer }> — auto-clear typing
    this.typingTimers = new Map();
    // Map<clientId, { res, sessionCode?: string|null }> — global /events stream
    this.globalClients = new Map();
    // One active connection per scoped client identity.
    this.globalClientKeys = new Map();
    this.adminClientKeys = new Map();
    this.playerClientKeys = new Map();
    this.gameClientKeys = new Map();
    // Unified tracking for all open SSE responses (for leak monitoring/cleanup)
    this.clients = new Set();
    this._counter = 0;
    // Global event counter for Last-Event-ID support
    this._eventCounter = 0;
    // Replay buffer for Last-Event-ID reconnect recovery (P1-1)
    // Stores recent critical player-scoped events so missed messages can be
    // replayed when a client reconnects carrying a Last-Event-ID header.
    this._replayBuffer = [];
    this._replayWindowMs = Number(process.env.SSE_REPLAY_WINDOW_MS || 60000);
    // Duplicate suppression cache: Map<scopeKey, { signature: string, ts: number }>
    this._lastEventByScope = new Map();

    const runtimeProfile = String(process.env.APP_RUNTIME_PROFILE || process.env.NODE_ENV || 'dev').toLowerCase();
    const defaultDiagnosticsMs = runtimeProfile === 'prod' || runtimeProfile === 'production'
      ? 180000
      : (runtimeProfile === 'staging' ? 15000 : 10000);

    this._heartbeatMs = Number(process.env.SSE_HEARTBEAT_MS || 25000);
    this._diagnosticsMs = Number(process.env.SSE_DIAGNOSTICS_MS || defaultDiagnosticsMs);
    this._strictSingleConnection = String(process.env.SSE_STRICT_SINGLE_CONNECTION || 'true').toLowerCase() !== 'false';
    this._maxTotalConnections = Math.max(10, Number(process.env.SSE_MAX_CONNECTIONS || 120));
    this._maxAdminConnections = Math.max(1, Number(process.env.SSE_MAX_ADMIN_CONNECTIONS || 16));
    this._maxGlobalConnections = Math.max(1, Number(process.env.SSE_MAX_GLOBAL_CONNECTIONS || 64));
    this._maxPlayerConnectionsPerSession = Math.max(1, Number(process.env.SSE_MAX_PLAYER_CONNECTIONS_PER_SESSION || 24));
    this._maxGameConnectionsPerSession = Math.max(1, Number(process.env.SSE_MAX_GAME_CONNECTIONS_PER_SESSION || 12));
    this._dupSuppressWindowMs = Math.max(100, Number(process.env.SSE_DUP_SUPPRESS_WINDOW_MS || 800));
    this._eventDedupeTtlMs = Math.max(5000, this._dupSuppressWindowMs * 6);
    this._safeModeWindowMs = Math.max(10000, Number(process.env.SSE_SAFE_MODE_WINDOW_MS || 60000));
    this._reconnectStormThreshold = Math.max(3, Number(process.env.SSE_RECONNECT_STORM_THRESHOLD || 4));
    this._reconnectStormIntervalMs = Math.max(2000, Number(process.env.SSE_RECONNECT_STORM_INTERVAL_MS || 15000));
    this._retryMs = Math.max(3000, Number(process.env.SSE_RETRY_MS || 8000));
    this._backpressureSoftBytes = Math.max(32768, Number(process.env.SSE_BACKPRESSURE_SOFT_BYTES || 131072));
    this._backpressureHardBytes = Math.max(this._backpressureSoftBytes + 32768, Number(process.env.SSE_BACKPRESSURE_HARD_BYTES || 393216));
    this._maxDroppedEventsPerClient = Math.max(5, Number(process.env.SSE_MAX_DROPPED_EVENTS_PER_CLIENT || 40));
    this._slowClientDrops = new WeakMap();
    this._identityClients = new Map();
    this._idToIdentity = new Map();
    this._identityReconnectHistory = new Map();
    this._safeModeUntilByIdentity = new Map();
    this._heartbeatTick = 0;
    this._criticalEvents = new Set([
      'new_message',
      'chat_message',
      'admin_message',
      'message_status',
      'system_notification',
      'notification',
      'approval',
      'box_result',
      'session_result'
    ]);
    this._heartbeatTimer = setInterval(() => this._heartbeatAll(), this._heartbeatMs);
    this._diagnosticsTimer = this._diagnosticsMs > 0
      ? setInterval(() => this._logDiagnostics(), this._diagnosticsMs)
      : null;
    if (typeof this._heartbeatTimer.unref === 'function') this._heartbeatTimer.unref();
    if (this._diagnosticsTimer && typeof this._diagnosticsTimer.unref === 'function') this._diagnosticsTimer.unref();
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  _uid() {
    return `sse_${Date.now()}_${++this._counter}`;
  }

  _safeHash(raw) {
    const source = String(raw || '');
    let hash = 2166136261;
    for (let i = 0; i < source.length; i += 1) {
      hash ^= source.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  _getClientIp(req) {
    const forwardedHeader = req?.headers?.['x-forwarded-for'];
    const forwarded = Array.isArray(forwardedHeader)
      ? forwardedHeader[0]
      : String(forwardedHeader || '').split(',')[0].trim();
    const raw = forwarded
      || req?.ip
      || req?.socket?.remoteAddress
      || req?.connection?.remoteAddress
      || '';
    return String(raw || '').replace('::ffff:', '').trim();
  }

  _buildClientKey(req, scope, scopeId = '', options = {}) {
    const safeScope = String(scope || 'global').trim().toLowerCase();
    const safeScopeId = String(scopeId || '').trim().toUpperCase();
    const query = req?.query || {};
    const headers = req?.headers || {};
    const explicitClientId = String(
      options.clientId
      || query.clientId
      || headers['x-client-id']
      || ''
    ).trim();
    const fingerprint = String(
      options.fingerprint
      || query.fingerprint
      || headers['x-browser-fingerprint']
      || ''
    ).trim();
    const userId = String(
      options.userId
      || options.adminId
      || req?.user?.id
      || req?.session?.user?.id
      || ''
    ).trim();
    const sessionId = String(req?.sessionID || '').trim();
    const ip = this._getClientIp(req);
    const ua = String(headers['user-agent'] || '').trim().slice(0, 200);

    const identity = [
      explicitClientId ? `cid:${explicitClientId}` : '',
      fingerprint ? `fp:${fingerprint}` : '',
      userId ? `uid:${userId}` : '',
      sessionId ? `sid:${sessionId}` : '',
      ip ? `ip:${ip}` : '',
      ua ? `ua:${this._safeHash(ua)}` : ''
    ].filter(Boolean).join('|');

    return `${safeScope}|${safeScopeId}|${identity || 'anon'}`;
  }

  _buildIdentityKey(req, options = {}) {
    const scope = String(options.identityScope || 'global').trim().toLowerCase();
    const scopeId = String(options.identityScopeId || 'all').trim().toUpperCase();
    return this._buildClientKey(req, `identity-${scope}`, scopeId, options);
  }

  _recordReconnectAndCheckStorm(identityKey, now = Date.now()) {
    const prev = this._identityReconnectHistory.get(identityKey) || [];
    const next = prev
      .filter((ts) => (now - ts) <= this._reconnectStormIntervalMs)
      .concat(now)
      .slice(-12);
    this._identityReconnectHistory.set(identityKey, next);
    return next.length >= this._reconnectStormThreshold;
  }

  _isSafeModeActive(identityKey, now = Date.now()) {
    const until = Number(this._safeModeUntilByIdentity.get(identityKey) || 0);
    if (!until) return false;
    if (until <= now) {
      this._safeModeUntilByIdentity.delete(identityKey);
      return false;
    }
    return true;
  }

  _pruneReconnectMaps(now = Date.now()) {
    if (this._identityReconnectHistory.size) {
      this._identityReconnectHistory.forEach((arr, key) => {
        if (!Array.isArray(arr) || arr.length === 0) {
          this._identityReconnectHistory.delete(key);
          return;
        }
        const next = arr.filter((ts) => (now - ts) <= this._reconnectStormIntervalMs);
        if (next.length) this._identityReconnectHistory.set(key, next);
        else this._identityReconnectHistory.delete(key);
      });
    }
    if (this._safeModeUntilByIdentity.size) {
      this._safeModeUntilByIdentity.forEach((until, key) => {
        if (!until || until <= now) this._safeModeUntilByIdentity.delete(key);
      });
    }
  }

  _resolveResByClientId(clientId) {
    if (!clientId) return null;
    const g = this.globalClients.get(clientId);
    if (g?.res) return g.res;
    if (this.adminClients.has(clientId)) return this.adminClients.get(clientId);
    for (const [, clients] of this.playerClients) {
      if (clients.has(clientId)) return clients.get(clientId);
    }
    if (this.gameClients) {
      for (const [, clients] of this.gameClients) {
        if (clients.has(clientId)) return clients.get(clientId);
      }
    }
    return null;
  }

  _closeResponse(res) {
    if (!res) return;
    try {
      if (!res.writableEnded && !res.destroyed) {
        res.end();
      }
    } catch (_) {}
  }

  _closeByClientId(clientId, type = 'closed', message = 'Stream closed.') {
    if (!clientId) return;
    const res = this._resolveResByClientId(clientId);
    if (res && this._isResponseOpen(res)) {
      this._write(res, 'system_notification', { type, message, ts: Date.now() }, ++this._eventCounter);
      this._closeResponse(res);
    }
  }

  _registerIdentity(res, id, req, options = {}) {
    if (!this._strictSingleConnection) return null;
    const identityKey = this._buildIdentityKey(req, options);
    const now = Date.now();
    const stormDetected = this._recordReconnectAndCheckStorm(identityKey, now);
    if (stormDetected) {
      this._safeModeUntilByIdentity.set(identityKey, now + this._safeModeWindowMs);
    }
    const safeModeActive = this._isSafeModeActive(identityKey, now);
    const previousId = this._identityClients.get(identityKey);
    if (previousId && previousId !== id && !safeModeActive) {
      this._closeByClientId(previousId, 'replaced', 'A newer realtime connection replaced this stream.');
    }
    this._identityClients.set(identityKey, id);
    this._idToIdentity.set(id, identityKey);
    return identityKey;
  }

  _unregisterIdentity(id) {
    if (!id) return;
    const identityKey = this._idToIdentity.get(id);
    if (!identityKey) return;
    if (this._identityClients.get(identityKey) === id) {
      this._identityClients.delete(identityKey);
    }
    this._idToIdentity.delete(id);
  }

  _pruneEventDedupeCache(now = Date.now()) {
    if (!this._lastEventByScope.size) return;
    this._lastEventByScope.forEach((entry, key) => {
      if (!entry || !entry.ts || (now - entry.ts) > this._eventDedupeTtlMs) {
        this._lastEventByScope.delete(key);
      }
    });
  }

  _toMessageDelta(message, fallbackSessionCode = '') {
    const raw = message && typeof message.toJSON === 'function' ? message.toJSON() : (message || {});
    return {
      id: raw.id,
      session_code: String(raw.session_code || fallbackSessionCode || '').trim().toUpperCase() || undefined,
      sender_name: raw.sender_name,
      sender_type: raw.sender_type,
      message: typeof raw.message === 'string' ? raw.message : '',
      message_type: raw.message_type || 'text',
      attachment_url: raw.attachment_url || null,
      is_read: typeof raw.is_read === 'boolean' ? raw.is_read : undefined,
      created_at: raw.created_at || raw.createdAt || Date.now(),
      updated_at: raw.updated_at || raw.updatedAt || undefined
    };
  }

  _toCompactDelta(payload, maxStringLength = 160) {
    if (!payload || typeof payload !== 'object') return {};
    const out = {};
    Object.keys(payload).slice(0, 24).forEach((key) => {
      const value = payload[key];
      if (value === null || value === undefined) return;
      if (typeof value === 'string') {
        out[key] = value.length > maxStringLength ? `${value.slice(0, maxStringLength)}...` : value;
        return;
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        out[key] = value;
        return;
      }
      if (Array.isArray(value)) {
        out[key] = value.slice(0, 10).map((item) => {
          if (item && typeof item === 'object') {
            const compact = {};
            ['id', 'code', 'status', 'type', 'amount', 'value', 'sessionCode', 'session_code', 'ts'].forEach((k) => {
              if (item[k] !== undefined && item[k] !== null) compact[k] = item[k];
            });
            return compact;
          }
          return item;
        });
        return;
      }
      if (typeof value === 'object') {
        const compact = {};
        ['id', 'code', 'status', 'type', 'amount', 'value', 'sessionCode', 'session_code', 'balance', 'wallet', 'updated_at', 'ts'].forEach((k) => {
          if (value[k] !== undefined && value[k] !== null) compact[k] = value[k];
        });
        if (Object.keys(compact).length > 0) out[key] = compact;
      }
    });
    return out;
  }

  _isCriticalEvent(event) {
    return this._criticalEvents.has(String(event || '').trim());
  }

  _enforceTotalConnectionLimit(res) {
    if (this.clients.size < this._maxTotalConnections) return true;
    this._write(res, 'system_notification', {
      type: 'overloaded',
      message: 'Server too busy. Please reconnect shortly.',
      ts: Date.now()
    }, ++this._eventCounter);
    this._closeResponse(res);
    return false;
  }

  _isDuplicateEvent(scopeKey, event, data) {
    const signature = `${String(event || '').trim()}|${JSON.stringify(data || {})}`;
    const now = Date.now();
    const last = this._lastEventByScope.get(scopeKey);
    if (last && last.signature === signature && (now - last.ts) < this._dupSuppressWindowMs) {
      return true;
    }
    this._lastEventByScope.set(scopeKey, { signature, ts: now });
    return false;
  }

  _setupHeaders(res) {
    // Must not buffer SSE on Nginx / LiteSpeed
    const lastId = res.req && res.req.headers['last-event-id'];
    res.set({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });

    // TCP-level optimizations for Apache/cPanel/Passenger:
    // - setNoDelay(true): disable Nagle algorithm so each write() flushes immediately
    // - setTimeout(0): disable Node's socket inactivity timeout (heartbeat keeps connection alive)
    const sock = res.req && (res.req.socket || (res.req.connection && res.req.connection.socket));
    if (sock) {
      try { sock.setNoDelay(true); } catch (_) {}
      try { sock.setTimeout(0); } catch (_) {}
    }
    // Reconnect hint to browser
    try {
      res.write(`retry: ${this._retryMs}\n\n`);
      if (typeof res.flush === 'function') res.flush();
    } catch (_) {}
    // IOS-2: Safari buffers the SSE response until >=1 KB of data has arrived.
    // Write a 2 KB comment block immediately so Safari flushes on the first real
    // event instead of batching many events together and delivering them late.
    try {
      res.write(': ' + ' '.repeat(2048) + '\n\n');
      if (typeof res.flush === 'function') res.flush();
    } catch (_) {}
    if (typeof res.flushHeaders === 'function') res.flushHeaders();
    return lastId || null;
  }

  // P1-1: store critical player-scoped events in a time-limited buffer so they
  // can be replayed when a client reconnects with a Last-Event-ID header.
  _addToReplayBuffer(id, event, data, sessionCode) {
    const now = Date.now();
    this._replayBuffer.push({
      id,
      event: String(event),
      data: typeof data === 'string' ? data : JSON.stringify(data),
      sessionCode: String(sessionCode || '').trim().toUpperCase(),
      ts: now
    });
    // Evict entries outside the replay window (oldest first)
    const cutoff = now - this._replayWindowMs;
    while (this._replayBuffer.length > 0 && this._replayBuffer[0].ts < cutoff) {
      this._replayBuffer.shift();
    }
  }

  _write(res, event, data, id) {
    try {
      if (!this._isResponseOpen(res)) return false;
      const pendingBytes = Number(res.writableLength || 0);
      const isCritical = this._isCriticalEvent(event);
      if (pendingBytes > this._backpressureHardBytes) {
        this._closeResponse(res);
        return false;
      }
      if (pendingBytes > this._backpressureSoftBytes && !isCritical) {
        const dropped = Number(this._slowClientDrops.get(res) || 0) + 1;
        this._slowClientDrops.set(res, dropped);
        if (dropped >= this._maxDroppedEventsPerClient) {
          this._write(res, 'system_notification', {
            type: 'slow_client_disconnected',
            message: 'Realtime stream disconnected due to slow client backpressure.',
            ts: Date.now()
          }, ++this._eventCounter);
          this._closeResponse(res);
        }
        return false;
      }

      const json = typeof data === 'string' ? data : JSON.stringify(data);
      const idLine = id !== undefined ? `id: ${id}\n` : '';
      res.write(`${idLine}event: ${event}\ndata: ${json}\n\n`);
      // Flush immediately — required when Express compression middleware is active
      // otherwise compressed bytes sit in zlib buffer and never reach the browser.
      if (typeof res.flush === 'function') res.flush();
      if (this._slowClientDrops.has(res)) this._slowClientDrops.delete(res);
      return true;
    } catch (_) { /* client disconnected */ }
    return false;
  }

  _isResponseOpen(res) {
    if (!res) return false;
    if (res.writableEnded || res.finished || res.destroyed) return false;
    return true;
  }

  _trackClient(res) {
    if (!res) return;
    this.clients.add(res);
  }

  _untrackClient(res) {
    if (!res) return;
    this.clients.delete(res);
    if (this._slowClientDrops.has(res)) this._slowClientDrops.delete(res);
  }

  _heartbeatAll() {
    this._heartbeatTick += 1;
    const stale = [];
    this.clients.forEach((res) => {
      if (!this._isResponseOpen(res)) {
        stale.push(res);
        return;
      }
      try {
        // Named event (not a comment) so client EventSource can listen and reset its watchdog.
        // SSE comments (': ping') are invisible to EventSource listeners.
        res.write('event: ping\ndata: {}\n\n');
        if (typeof res.flush === 'function') res.flush();
      } catch (_) {
        stale.push(res);
      }
    });
    if (stale.length) {
      stale.forEach((res) => this._untrackClient(res));
    }
    if (stale.length || (this._heartbeatTick % 3) === 0) {
      this._pruneStaleClients();
      this._pruneEventDedupeCache();
      this._pruneReconnectMaps();
    }
  }

  _pruneStaleClients() {
    const isAlive = (res) => this._isResponseOpen(res) && this.clients.has(res);

    this.globalClients.forEach((entry, id) => {
      if (!isAlive(entry?.res)) {
        this.globalClients.delete(id);
        if (entry?.clientKey && this.globalClientKeys.get(entry.clientKey) === id) {
          this.globalClientKeys.delete(entry.clientKey);
        }
        this._unregisterIdentity(id);
      }
    });

    this.adminClients.forEach((res, id) => {
      if (!isAlive(res)) {
        this.adminClients.delete(id);
        const meta = this.adminMeta.get(id);
        this.adminMeta.delete(id);
        if (meta?.clientKey && this.adminClientKeys.get(meta.clientKey) === id) {
          this.adminClientKeys.delete(meta.clientKey);
        }
        this._unregisterIdentity(id);
      }
    });

    this.playerClients.forEach((clientMap, sessionCode) => {
      clientMap.forEach((res, id) => {
        if (!isAlive(res)) clientMap.delete(id);
        if (!isAlive(res)) {
          const keyMap = this.playerClientKeys.get(sessionCode);
          if (keyMap) {
            keyMap.forEach((mappedId, clientKey) => {
              if (mappedId === id) keyMap.delete(clientKey);
            });
            if (keyMap.size === 0) this.playerClientKeys.delete(sessionCode);
          }
          this._unregisterIdentity(id);
        }
      });
      if (clientMap.size === 0) this.playerClients.delete(sessionCode);
    });

    if (this.gameClients) {
      this.gameClients.forEach((clientMap, sessionCode) => {
        clientMap.forEach((res, id) => {
          if (!isAlive(res)) clientMap.delete(id);
          if (!isAlive(res)) {
            const keyMap = this.gameClientKeys.get(sessionCode);
            if (keyMap) {
              keyMap.forEach((mappedId, clientKey) => {
                if (mappedId === id) keyMap.delete(clientKey);
              });
              if (keyMap.size === 0) this.gameClientKeys.delete(sessionCode);
            }
            this._unregisterIdentity(id);
          }
        });
        if (clientMap.size === 0) this.gameClients.delete(sessionCode);
      });
    }
  }

  _logDiagnostics() {
    this._pruneStaleClients();
    this._pruneEventDedupeCache();
    this._pruneReconnectMaps();
    const memory = process.memoryUsage().heapUsed;
    // Keep this exact format for hosting-side grep and alerting.
    console.log('Active SSE:', this.clients.size);
    console.log('Memory:', memory);
  }

  _broadcastToAdmins(event, data) {
    const id = ++this._eventCounter;
    this.adminClients.forEach((res) => this._write(res, event, data, id));
  }

  _broadcastToAllPlayers(event, data) {
    const id = ++this._eventCounter;
    this.playerClients.forEach((clients) => {
      clients.forEach((res) => this._write(res, event, data, id));
    });
  }

  _broadcastToGlobal(event, data, options = {}) {
    const id = ++this._eventCounter;
    const targetSession = String(options.sessionCode || data?.sessionCode || '').trim().toUpperCase();
    this.globalClients.forEach((client) => {
      const res = client?.res;
      const clientSessions = Array.isArray(client?.sessionCodes)
        ? client.sessionCodes
        : (String(client?.sessionCode || '').trim().toUpperCase() ? [String(client.sessionCode).trim().toUpperCase()] : []);
      if (!res) return;
      // If stream is bound to one or more sessions, only deliver matching session events.
      if (targetSession && clientSessions.length > 0 && !clientSessions.includes(targetSession)) return;
      // If stream has no session scope, skip session-specific events for privacy.
      if (targetSession && clientSessions.length === 0) return;
      this._write(res, event, data, id);
    });
  }

  _getAdminPresenceMeta() {
    const names = [];
    const seen = new Set();
    this.adminMeta.forEach((meta) => {
      const raw = String(meta?.name || '').trim();
      if (!raw) return;
      if (seen.has(raw.toLowerCase())) return;
      seen.add(raw.toLowerCase());
      names.push(raw);
    });
    return {
      admin_count: this.adminClients.size,
      admin_names: names
    };
  }

  _clearTypingTimer(sessionCode, role) {
    const t = this.typingTimers.get(sessionCode);
    if (t && t[role]) { clearTimeout(t[role]); t[role] = null; }
    if (t && !t.player && !t.admin) this.typingTimers.delete(sessionCode);
  }

  // ─── Player SSE subscription ──────────────────────────────────────────────────

  subscribeGlobal(res, options = {}) {
    if (!this._enforceTotalConnectionLimit(res)) return null;
    if (this.globalClients.size >= this._maxGlobalConnections) {
      this._write(res, 'system_notification', {
        type: 'overloaded',
        message: 'Realtime stream limit reached. Please reconnect shortly.',
        ts: Date.now()
      }, ++this._eventCounter);
      this._closeResponse(res);
      return null;
    }

    const id = this._uid();
    const req = res.req;
    this._setupHeaders(res);
    this._trackClient(res);

    const normalizeCode = (value) => String(value || '').trim().toUpperCase();
    const rawCodes = Array.isArray(options.sessionCodes)
      ? options.sessionCodes
      : String(options.sessionCode || '')
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean);
    const sessionCodes = [...new Set(rawCodes.map(normalizeCode).filter(Boolean))];
    this._registerIdentity(res, id, req, {
      ...options,
      identityScope: 'global',
      identityScopeId: sessionCodes[0] || 'all'
    });
    const clientKey = this._buildClientKey(req, 'global', sessionCodes[0] || 'all', options);
    const previousId = this.globalClientKeys.get(clientKey);
    if (previousId && previousId !== id) {
      const prev = this.globalClients.get(previousId);
      if (prev?.res) {
        this._write(prev.res, 'system_notification', {
          type: 'replaced',
          message: 'A newer realtime connection replaced this stream.',
          ts: Date.now()
        }, ++this._eventCounter);
      }
      this.globalClients.delete(previousId);
      this._closeResponse(prev?.res);
    }
    this.globalClientKeys.set(clientKey, id);
    this.globalClients.set(id, {
      res,
      clientKey,
      sessionCode: sessionCodes[0] || null,
      sessionCodes
    });

    this._write(res, 'system_notification', {
      type: 'connected',
      sessionCode: sessionCodes[0] || null,
      sessionCodes,
      ts: Date.now()
    }, ++this._eventCounter);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      this._untrackClient(res);
      this.globalClients.delete(id);
      this._unregisterIdentity(id);
      if (this.globalClientKeys.get(clientKey) === id) {
        this.globalClientKeys.delete(clientKey);
      }
    };

    res.req?.on?.('close', cleanup);
    res.on('close', cleanup);
    res.on('error', cleanup);
    return id;
  }

  subscribePlayer(sessionCode, res) {
    if (!this._enforceTotalConnectionLimit(res)) return null;

    const id = this._uid();
    const req = res.req;
    const lastEventId = this._setupHeaders(res);  // P1-1: capture Last-Event-ID for replay
    this._trackClient(res);

    if (!this.playerClients.has(sessionCode)) {
      this.playerClients.set(sessionCode, new Map());
    }
    if (this.playerClients.get(sessionCode).size >= this._maxPlayerConnectionsPerSession) {
      this._write(res, 'system_notification', {
        type: 'overloaded',
        message: 'Too many player streams in this session. Please reconnect shortly.',
        ts: Date.now()
      }, ++this._eventCounter);
      this._closeResponse(res);
      return null;
    }

    const clientKey = this._buildClientKey(req, 'player', sessionCode);
    this._registerIdentity(res, id, req, {
      sessionCode,
      userId: req?.user?.id || req?.session?.user?.id || null,
      identityScope: 'player',
      identityScopeId: sessionCode
    });
    if (!this.playerClientKeys.has(sessionCode)) this.playerClientKeys.set(sessionCode, new Map());
    const keyMap = this.playerClientKeys.get(sessionCode);
    const previousId = keyMap.get(clientKey);
    if (previousId && previousId !== id) {
      const prevRes = this.playerClients.get(sessionCode)?.get(previousId) || null;
      if (prevRes) {
        this._write(prevRes, 'system_notification', {
          type: 'replaced',
          message: 'A newer realtime connection replaced this stream.',
          ts: Date.now()
        }, ++this._eventCounter);
      }
      this.playerClients.get(sessionCode)?.delete(previousId);
      this._closeResponse(prevRes);
    }
    this.playerClients.get(sessionCode).set(id, res);
    keyMap.set(clientKey, id);
    this.playerLastSeen.set(sessionCode, Date.now());

    // P1-1: replay events missed while the client was disconnected.
    // The browser (EventSource) or the Layer 1 fetch includes Last-Event-ID
    // automatically after receiving at least one id: field from the server.
    if (lastEventId) {
      const lastIdNum = Number(lastEventId) || 0;
      if (lastIdNum > 0) {
        const missed = this._replayBuffer.filter(
          (e) => e.sessionCode === sessionCode && e.id > lastIdNum
        );
        if (missed.length > 0) {
          missed.forEach((e) => {
            try { res.write(`id: ${e.id}\nevent: ${e.event}\ndata: ${e.data}\n\n`); } catch (_) {}
          });
          try { if (typeof res.flush === 'function') res.flush(); } catch (_) {}
        }
      }
    }

    // GEN-1: canary event — client sets a 4-second timer that triggers a fallback
    // to long polling if this event doesn't arrive.  A buffering CDN or proxy would
    // block ALL events including this one, making it a reliable proxy-detection probe.
    this._write(res, 'canary', { ts: Date.now() }, ++this._eventCounter);

    // Tell this player whether admin is online
    this._write(res, 'online_status', {
      role: 'admin',
      online: this.adminClients.size > 0,
      ...this._getAdminPresenceMeta(),
      ts: Date.now()
    }, ++this._eventCounter);

    // Tell all admins this player is online
    this._broadcastToAdmins('online_status', {
      role: 'player',
      sessionCode,
      online: true,
      ts: Date.now()
    });
    this._broadcastToGlobal('online_status', {
      role: 'player',
      sessionCode,
      online: true,
      ts: Date.now()
    }, { sessionCode });

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      this._untrackClient(res);
      this._unregisterIdentity(id);
      const clients = this.playerClients.get(sessionCode);
      if (clients) {
        clients.delete(id);
        const scopedKeys = this.playerClientKeys.get(sessionCode);
        if (scopedKeys && scopedKeys.get(clientKey) === id) {
          scopedKeys.delete(clientKey);
          if (scopedKeys.size === 0) this.playerClientKeys.delete(sessionCode);
        }
        if (clients.size === 0) {
          this.playerClients.delete(sessionCode);
          const lastSeen = Date.now();
          this.playerLastSeen.set(sessionCode, lastSeen);
          this._broadcastToAdmins('online_status', {
            role: 'player',
            sessionCode,
            online: false,
            lastSeen,
            ts: Date.now()
          });
          this._broadcastToGlobal('online_status', {
            role: 'player',
            sessionCode,
            online: false,
            lastSeen,
            ts: Date.now()
          }, { sessionCode });
        }
      }
    };

    res.req?.on?.('close', cleanup);
    res.on('close', cleanup);
    res.on('error', cleanup);
    return id;
  }

  // ─── Admin SSE subscription ───────────────────────────────────────────────────

  subscribeAdmin(res, options = {}) {
    if (!this._enforceTotalConnectionLimit(res)) return null;
    if (this.adminClients.size >= this._maxAdminConnections) {
      this._write(res, 'system_notification', {
        type: 'overloaded',
        message: 'Too many admin streams. Please reconnect shortly.',
        ts: Date.now()
      }, ++this._eventCounter);
      this._closeResponse(res);
      return null;
    }

    const id = this._uid();
    const req = res.req;
    this._setupHeaders(res);
    this._trackClient(res);

    this._registerIdentity(res, id, req, {
      ...options,
      userId: options.adminId || req?.user?.id || req?.session?.user?.id || null,
      identityScope: 'admin',
      identityScopeId: String(options.adminId || 'admin')
    });

    const clientKey = this._buildClientKey(req, 'admin', String(options.adminId || 'admin'), {
      ...options,
      userId: options.adminId || req?.user?.id || req?.session?.user?.id || null
    });
    const previousId = this.adminClientKeys.get(clientKey);
    if (previousId && previousId !== id) {
      const prevRes = this.adminClients.get(previousId);
      if (prevRes) {
        this._write(prevRes, 'system_notification', {
          type: 'replaced',
          message: 'A newer admin realtime connection replaced this stream.',
          ts: Date.now()
        }, ++this._eventCounter);
      }
      this.adminClients.delete(previousId);
      this.adminMeta.delete(previousId);
      this._closeResponse(prevRes);
    }

    this.adminClientKeys.set(clientKey, id);
    this.adminClients.set(id, res);
    this.adminMeta.set(id, {
      name: String(options.adminName || 'Admin').trim() || 'Admin',
      id: options.adminId || null,
      clientKey
    });

    // Send current online player list to this admin
    this.playerClients.forEach((_, sessionCode) => {
      this._write(res, 'online_status', {
        role: 'player',
        sessionCode,
        online: true,
        ts: Date.now()
      });
    });

    // Tell all online players admin is now connected
    this._broadcastToAllPlayers('online_status', {
      role: 'admin',
      online: true,
      ...this._getAdminPresenceMeta(),
      ts: Date.now()
    });
    this._broadcastToGlobal('online_status', {
      role: 'admin',
      online: true,
      ...this._getAdminPresenceMeta(),
      ts: Date.now()
    });

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      this._untrackClient(res);
      this._unregisterIdentity(id);
      this.adminClients.delete(id);
      const meta = this.adminMeta.get(id);
      this.adminMeta.delete(id);
      if (meta?.clientKey && this.adminClientKeys.get(meta.clientKey) === id) {
        this.adminClientKeys.delete(meta.clientKey);
      }
      if (this.adminClients.size === 0) {
        this._broadcastToAllPlayers('online_status', {
          role: 'admin',
          online: false,
          admin_count: 0,
          admin_names: [],
          ts: Date.now()
        });
        this._broadcastToGlobal('online_status', {
          role: 'admin',
          online: false,
          admin_count: 0,
          admin_names: [],
          ts: Date.now()
        });
      } else {
        this._broadcastToAllPlayers('online_status', {
          role: 'admin',
          online: true,
          ...this._getAdminPresenceMeta(),
          ts: Date.now()
        });
        this._broadcastToGlobal('online_status', {
          role: 'admin',
          online: true,
          ...this._getAdminPresenceMeta(),
          ts: Date.now()
        });
      }
    };

    res.req?.on?.('close', cleanup);
    res.on('close', cleanup);
    res.on('error', cleanup);
    return id;
  }

  // ─── Message delivery ─────────────────────────────────────────────────────────

  /** New message from customer — push to all admins */
  newMessageToAdmins(sessionCode, message) {
    const safeSessionCode = String(sessionCode || '').trim().toUpperCase();
    const delta = this._toMessageDelta(message, safeSessionCode);
    this._broadcastToAdmins('new_message', { sessionCode: safeSessionCode, message: delta, ts: Date.now() });
    this._broadcastToGlobal('chat_message', { sessionCode: safeSessionCode, message: delta, ts: Date.now() }, { sessionCode: safeSessionCode });
  }

  /** New message from admin/support — push to player's SSE stream */
  newMessageToPlayer(sessionCode, message) {
    const safeSessionCode = String(sessionCode || '').trim().toUpperCase();
    const clients = this.playerClients.get(safeSessionCode);
    // P1-1: assign a stable event ID and buffer so reconnecting clients can replay
    const id = ++this._eventCounter;
    const payload = { sessionCode: safeSessionCode, message: this._toMessageDelta(message, safeSessionCode), ts: Date.now() };
    this._addToReplayBuffer(id, 'new_message', payload, safeSessionCode);
    if (clients && clients.size > 0) {
      clients.forEach((res) => this._write(res, 'new_message', payload, id));
    }
    this._broadcastToGlobal('admin_message', payload, { sessionCode: safeSessionCode });
    return !!(clients && clients.size > 0);
  }

  /** Edited support message — push to both admin and player streams */
  messageEdited(sessionCode, message) {
    const safeSessionCode = String(sessionCode || '').trim().toUpperCase();
    const payload = { sessionCode: safeSessionCode, message: this._toMessageDelta(message, safeSessionCode), ts: Date.now() };
    this._broadcastToAdmins('message_edited', payload);

    const clients = this.playerClients.get(safeSessionCode);
    if (clients && clients.size > 0) {
      clients.forEach((res) => this._write(res, 'message_edited', payload));
    }

    this._broadcastToGlobal('message_edited', payload, { sessionCode: safeSessionCode });
    return !!(clients && clients.size > 0);
  }

  // ─── Status updates ───────────────────────────────────────────────────────────

  /** Tell player their message was delivered (admin tab opened) */
  markDelivered(sessionCode, messageId) {
    const clients = this.playerClients.get(sessionCode);
    if (!clients) return;
    const id = ++this._eventCounter;
    this._addToReplayBuffer(id, 'message_status', { messageId, status: 'delivered', ts: Date.now() }, sessionCode);
    clients.forEach((res) => this._write(res, 'message_status', {
      messageId,
      status: 'delivered',
      ts: Date.now()
    }, id));
  }

  /** Tell admins that player has read messages in this session */
  markSeen(sessionCode) {
    this._broadcastToAdmins('message_status', {
      sessionCode,
      status: 'seen',
      ts: Date.now()
    });
  }

  /** Tell the player that admin has read their messages (✓✓ Đã xem) */
  markReadByAdmin(sessionCode) {
    const clients = this.playerClients.get(sessionCode);
    if (!clients) return;
    clients.forEach((res) => this._write(res, 'message_status', {
      status: 'seen',
      ts: Date.now()
    }));
  }

  // ─── Typing indicators ────────────────────────────────────────────────────────

  /** Player started typing — notify admins, auto-stop after 3 s */
  playerTyping(sessionCode) {
    this._clearTypingTimer(sessionCode, 'player');
    this._broadcastToAdmins('typing', { role: 'player', sessionCode, ts: Date.now() });
    this._broadcastToGlobal('typing', { role: 'player', sessionCode, ts: Date.now() }, { sessionCode });
    if (!this.typingTimers.has(sessionCode)) this.typingTimers.set(sessionCode, {});
    this.typingTimers.get(sessionCode).player = setTimeout(() => {
      this._broadcastToAdmins('stop_typing', { role: 'player', sessionCode });
      this._broadcastToGlobal('stop_typing', { role: 'player', sessionCode, ts: Date.now() }, { sessionCode });
    }, 3000);
  }

  /** Player explicitly stopped typing */
  playerStopTyping(sessionCode) {
    this._clearTypingTimer(sessionCode, 'player');
    this._broadcastToAdmins('stop_typing', { role: 'player', sessionCode, ts: Date.now() });
    this._broadcastToGlobal('stop_typing', { role: 'player', sessionCode, ts: Date.now() }, { sessionCode });
  }

  /** Admin started typing — notify player, auto-stop after 3 s */
  adminTyping(sessionCode) {
    this._clearTypingTimer(sessionCode, 'admin');
    const clients = this.playerClients.get(sessionCode);
    if (clients) {
      clients.forEach((res) => this._write(res, 'typing', { role: 'admin', ts: Date.now() }));
    }
    this._broadcastToGlobal('typing', { role: 'admin', sessionCode, ts: Date.now() }, { sessionCode });
    if (!this.typingTimers.has(sessionCode)) this.typingTimers.set(sessionCode, {});
    this.typingTimers.get(sessionCode).admin = setTimeout(() => {
      if (clients) clients.forEach((res) => this._write(res, 'stop_typing', { role: 'admin' }));
      this._broadcastToGlobal('stop_typing', { role: 'admin', sessionCode, ts: Date.now() }, { sessionCode });
    }, 3000);
  }

  /** Admin explicitly stopped typing */
  adminStopTyping(sessionCode) {
    this._clearTypingTimer(sessionCode, 'admin');
    const clients = this.playerClients.get(sessionCode);
    if (clients) {
      clients.forEach((res) => this._write(res, 'stop_typing', { role: 'admin', ts: Date.now() }));
    }
    this._broadcastToGlobal('stop_typing', { role: 'admin', sessionCode, ts: Date.now() }, { sessionCode });
  }

  // ─── Admin realtime events (withdrawal, gift, game) ──────────────────────────

  /** Broadcast an operational event to all connected admins */
  sendAdminEvent(event, payload) {
    const safePayload = this._toCompactDelta(payload || {});
    if (this._isDuplicateEvent(`admin_event:${String(event || '').trim()}`, 'admin_event', safePayload)) return;
    this._broadcastToAdmins('admin_event', {
      event,
      payload: safePayload,
      ts: Date.now()
    });
    this._broadcastToGlobal('system_notification', {
      event,
      payload: safePayload,
      ts: Date.now()
    });

    const sessionCode = String(safePayload.sessionCode || safePayload.session_code || '').trim().toUpperCase();
    if (sessionCode) {
      this.broadcastWalletUpdate(sessionCode, { reason: event, ...safePayload });
    }
  }

  broadcastWalletUpdate(sessionCode, payload) {
    const safeSessionCode = String(sessionCode || '').trim().toUpperCase();
    if (!safeSessionCode) return;
    const compactPayload = this._toCompactDelta(payload || {}, 96);
    const safePayload = {
      reason: compactPayload.reason || compactPayload.event || compactPayload.type || null,
      status: compactPayload.status || compactPayload.wallet_status || null,
      amount: compactPayload.amount || compactPayload.value || null,
      balance: compactPayload.balance || compactPayload.wallet || null,
      session_code: safeSessionCode,
      ts: Date.now()
    };
    if (this._isDuplicateEvent(`wallet_update:${safeSessionCode}`, 'wallet_update', safePayload)) return;
    this._broadcastToGlobal('wallet_update', {
      sessionCode: safeSessionCode,
      payload: safePayload,
      ts: Date.now()
    }, { sessionCode: safeSessionCode });
  }

  sendNotification(sessionCode, type, payload = {}) {
    const safeSessionCode = String(sessionCode || '').trim().toUpperCase();
    if (!safeSessionCode) {
      console.error('[SSE][notify-debug] sendNotification skipped: missing sessionCode', {
        type: String(type || ''),
        title: String(payload?.title || ''),
        message: String(payload?.message || '')
      });
      return false;
    }

    const levelRaw = String(payload.level || '').trim().toLowerCase();
    const level = ['success', 'error', 'info', 'warning'].includes(levelRaw) ? levelRaw : 'info';
    const notificationPayload = {
      type: String(type || 'notification').trim() || 'notification',
      level,
      title: String(payload.title || 'Thông báo').trim() || 'Thông báo',
      message: String(payload.message || '').trim(),
      sessionCode: safeSessionCode,
      payload: payload || {},
      ts: Date.now()
    };

    const clients = this.playerClients.get(safeSessionCode);
    console.error('[SSE][notify-debug] sendNotification', {
      sessionCode: safeSessionCode,
      type: notificationPayload.type,
      level: notificationPayload.level,
      title: notificationPayload.title,
      directPlayerClientCount: clients ? clients.size : 0,
      globalClientCount: this.globalClients ? this.globalClients.size : 0
    });
    if (clients && clients.size > 0) {
      clients.forEach((res) => this._write(res, 'notification', notificationPayload));
    }

    this._broadcastToGlobal('notification', notificationPayload, { sessionCode: safeSessionCode });
    return !!(clients && clients.size > 0);
  }

  // ─── Game session realtime events ─────────────────────────────────────────────

  /**
   * Map<sessionCode, Map<clientId, res>> for game session SSE streams.
   * Separate from chat player clients.
   */
  _ensureGameClients() {
    if (!this.gameClients) this.gameClients = new Map();
  }

  subscribeGameSession(sessionCode, res) {
    if (!this._enforceTotalConnectionLimit(res)) return null;

    this._ensureGameClients();
    const id = this._uid();
    const req = res.req;
    this._setupHeaders(res);
    this._trackClient(res);

    this._registerIdentity(res, id, req, {
      sessionCode,
      userId: req?.user?.id || req?.session?.user?.id || null,
      identityScope: 'game',
      identityScopeId: sessionCode
    });

    if (!this.gameClients.has(sessionCode)) {
      this.gameClients.set(sessionCode, new Map());
    }
    if (this.gameClients.get(sessionCode).size >= this._maxGameConnectionsPerSession) {
      this._write(res, 'system_notification', {
        type: 'overloaded',
        message: 'Too many game streams in this session. Please reconnect shortly.',
        ts: Date.now()
      }, ++this._eventCounter);
      this._closeResponse(res);
      return null;
    }

    if (!this.gameClientKeys.has(sessionCode)) this.gameClientKeys.set(sessionCode, new Map());
    const keyMap = this.gameClientKeys.get(sessionCode);
    const clientKey = this._buildClientKey(req, 'game', sessionCode);
    const previousId = keyMap.get(clientKey);
    if (previousId && previousId !== id) {
      const prevRes = this.gameClients.get(sessionCode)?.get(previousId) || null;
      if (prevRes) {
        this._write(prevRes, 'system_notification', {
          type: 'replaced',
          message: 'A newer game realtime connection replaced this stream.',
          ts: Date.now()
        }, ++this._eventCounter);
      }
      this.gameClients.get(sessionCode)?.delete(previousId);
      this._closeResponse(prevRes);
    }
    this.gameClients.get(sessionCode).set(id, res);
    keyMap.set(clientKey, id);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      this._untrackClient(res);
      this._unregisterIdentity(id);
      const clients = this.gameClients.get(sessionCode);
      if (clients) {
        clients.delete(id);
        const scopedKeys = this.gameClientKeys.get(sessionCode);
        if (scopedKeys && scopedKeys.get(clientKey) === id) {
          scopedKeys.delete(clientKey);
          if (scopedKeys.size === 0) this.gameClientKeys.delete(sessionCode);
        }
        if (clients.size === 0) this.gameClients.delete(sessionCode);
      }
    };
    res.req?.on?.('close', cleanup);
    res.on('close', cleanup);
    res.on('error', cleanup);
    return id;
  }

  /** Send a game event to a specific session's viewers AND all admins */
  broadcastGameEvent(sessionCode, event, payload) {
    this._ensureGameClients();
    const data = { sessionCode, event, payload, ts: Date.now() };
    // Notify game session players
    const clients = this.gameClients.get(sessionCode);
    if (clients) {
      clients.forEach((res) => this._write(res, 'game_event', data));
    }
    // Also notify all admins
    this._broadcastToAdmins('game_event', data);
  }

  // ─── Status queries ───────────────────────────────────────────────────────────

  isPlayerOnline(sessionCode) {
    const c = this.playerClients.get(sessionCode);
    return !!(c && c.size > 0);
  }

  isAdminOnline() {
    return this.adminClients.size > 0;
  }

  getPlayerLastSeen(sessionCode) {
    return this.playerLastSeen.get(sessionCode) || null;
  }

  getOnlinePlayerCount() {
    return this.playerClients.size;
  }

  getStatus() {
    return {
      activeSseClients: this.clients.size,
      adminConnections: this.adminClients.size,
      playerSessions: this.playerClients.size,
      onlinePlayers: [...this.playerClients.keys()],
      strictSingleConnection: this._strictSingleConnection,
      uniqueIdentities: this._identityClients.size,
      dedupeCacheSize: this._lastEventByScope.size,
      safeModeIdentities: this._safeModeUntilByIdentity.size
    };
  }

  // ─── High-level broadcast helpers ─────────────────────────────────────────────

  /** Broadcast new withdrawal event to all admins */
  broadcastNewWithdrawal(withdrawal) {
    this.sendAdminEvent('new_withdrawal', withdrawal || {});
  }

  /** Broadcast session update to all admins */
  broadcastSessionUpdate(session) {
    this.sendAdminEvent('session_update', session || {});
  }

  /** Broadcast gift opened event to admin + that session's player */
  broadcastGiftOpened(sessionCode, data) {
    this.sendAdminEvent('gift_opened', { sessionCode, ...(data || {}) });
    this.broadcastGameEvent(sessionCode, 'gift_opened', data || {});
  }

  /** Broadcast user came online to all admins */
  broadcastUserOnline(sessionCode, meta) {
    this.sendAdminEvent('user_online', { sessionCode, ...(meta || {}), ts: Date.now() });
  }
}

// Export singleton — all modules share the same SSE state
module.exports = new SSEChatService();
