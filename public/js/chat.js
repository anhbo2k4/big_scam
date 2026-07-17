const DEFAULTS = {
  maxDomNodes: 50,
  nearBottomThresholdPx: 72,
  typingDebounceMs: 220
};
const DEFAULT_CHAT_AGENT_NAME = 'CSKH Lâm TaoBao';

function toText(value, fallback = '') {
  const text = value == null ? '' : String(value);
  return text.trim() || fallback;
}

function isInvisibleSupportColor(value) {
  var normalized = String(value || '').replace(/\s+/g, '').toLowerCase();
  return normalized === '#fff'
    || normalized === '#ffffff'
    || normalized === 'white'
    || normalized === 'rgb(255,255,255)'
    || normalized === 'rgba(255,255,255,1)'
    || normalized === 'rgba(255,255,255,1.0)';
}

function sanitizeSupportInlineStyle(value) {
  return String(value || '')
    .split(';')
    .map(function(rule) { return rule.trim(); })
    .filter(Boolean)
    .reduce(function(safeRules, rule) {
      var parts = rule.split(':');
      if (parts.length < 2) return safeRules;
      var name = parts.shift().trim().toLowerCase();
      var cssValue = parts.join(':').trim();
      if (!cssValue) return safeRules;
      if (name === 'font-size') {
        safeRules.push('font-size: ' + cssValue);
        return safeRules;
      }
      if (name === 'color' && !isInvisibleSupportColor(cssValue)) {
        safeRules.push('color: ' + cssValue);
      }
      return safeRules;
    }, [])
    .join('; ');
}

function sanitizeSupportHtml(raw) {
  var text = String(raw || '');
  if (!text) return '';
  if (!/<[a-z][\s\S]*?>/i.test(text)) {
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML.replace(/\n/g, '<br>');
  }
  var ALLOWED = { b:1, i:1, u:1, strong:1, em:1, span:1, br:1, p:1, div:1, ol:1, ul:1, li:1 };
  var tmp = document.createElement('div');
  tmp.innerHTML = text;
  (function clean(node) {
    Array.from(node.childNodes).forEach(function(child) {
      if (child.nodeType === 3) return;
      if (child.nodeType !== 1) { child.remove(); return; }
      var tag = child.tagName.toLowerCase();
      if (!ALLOWED[tag]) {
        while (child.firstChild) node.insertBefore(child.firstChild, child);
        child.remove();
        return;
      }
      Array.from(child.attributes).forEach(function(attr) {
        if (tag === 'span' && attr.name === 'style') {
          var safe = sanitizeSupportInlineStyle(attr.value);
          if (safe) child.setAttribute('style', safe);
          else child.removeAttribute('style');
        } else {
          child.removeAttribute(attr.name);
        }
      });
      clean(child);
    });
  })(tmp);
  return tmp.innerHTML;
}

function messageIdFrom(payload) {
  return String(
    payload?.id
    || payload?.messageId
    || payload?.message_id
    || payload?.createdAt
    || ''
  ).trim();
}

function isCustomerMessage(payload) {
  const role = String(payload?.role || payload?.senderRole || payload?.sender_type || '').toLowerCase();
  return payload?.isMine === true || role === 'user' || role === 'customer';
}

function createChatRenderer(options) {
  options = options || {};
  const cfg = { ...DEFAULTS, ...(options || {}) };
  const container = options.container;
  if (!(container instanceof HTMLElement)) {
    throw new Error('chat renderer needs a valid container element');
  }

  const typingEl = options.typingEl || null;
  const presenceEl = options.presenceEl || null;
  const sound = options.sound || null;

  const renderedIds = new Set();
  const renderedIdOrder = [];
  let lastPresenceText = '';
  let typingState = false;
  let typingTimer = 0;

  function handleEvent(evt) {
    if (!evt || !evt.type) return;

    switch (evt.type) {
      case 'new_message':
      case 'chat_message':
      case 'admin_message':
        appendMessage(evt.payload || {});
        break;
      case 'typing':
        setTyping(true);
        break;
      case 'stop_typing':
        setTyping(false);
        break;
      case 'online_status':
        updatePresence(evt.payload || {});
        break;
      default:
        break;
    }
  }

  function appendMessage(payload) {
    const id = messageIdFrom(payload);
    if (id && renderedIds.has(id)) return;

    const isNearBottom = nearBottom();

    const row = document.createElement('div');
    row.className = `chat-message ${resolveDirection(payload)}`;
    if (id) row.dataset.mid = id;

    const nameEl = document.createElement('div');
    nameEl.className = 'chat-message-name';
    nameEl.textContent = isCustomerMessage(payload)
      ? toText(payload.senderName || payload.sender || payload.name, 'Bạn')
      : DEFAULT_CHAT_AGENT_NAME;

    const bodyEl = document.createElement('div');
    bodyEl.className = 'chat-message-body';
    const rawMsg = toText(payload.message || payload.text, '');
    const isFromCustomer = isCustomerMessage(payload);
    if (isFromCustomer || !rawMsg) {
      bodyEl.textContent = rawMsg;
    } else {
      bodyEl.innerHTML = sanitizeSupportHtml(rawMsg);
    }

    const timeEl = document.createElement('time');
    timeEl.className = 'chat-message-time';
    timeEl.textContent = toText(payload.time || formatTime(payload.createdAt), '');

    row.appendChild(nameEl);
    row.appendChild(bodyEl);
    row.appendChild(timeEl);
    container.appendChild(row);

    if (id) {
      renderedIds.add(id);
      renderedIdOrder.push(id);
      if (renderedIdOrder.length > 600) {
        const oldest = renderedIdOrder.shift();
        renderedIds.delete(oldest);
      }
    }

    pruneDomNodes(cfg.maxDomNodes);

    if (isNearBottom) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }

    if (sound && typeof sound.playSound === 'function') {
      sound.playSound('message');
    }
  }

  function resolveDirection(payload) {
    const mine = isCustomerMessage(payload);
    return mine ? 'is-self' : 'is-other';
  }

  function updatePresence(payload) {
    if (!presenceEl) return;
    const online = Number(payload.onlineUsers || payload.online || 0);
    const text = online > 0 ? `${online} online` : 'Offline';
    if (text === lastPresenceText) return;
    lastPresenceText = text;
    presenceEl.textContent = text;
  }

  function setTyping(next) {
    const desired = !!next;
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = 0;
    }

    typingTimer = setTimeout(() => {
      typingTimer = 0;
      if (!typingEl || typingState === desired) return;
      typingState = desired;
      typingEl.style.display = desired ? 'flex' : 'none';
    }, cfg.typingDebounceMs);
  }

  function nearBottom() {
    const distance = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distance <= cfg.nearBottomThresholdPx;
  }

  function pruneDomNodes(maxNodes) {
    while (container.childNodes.length > maxNodes) {
      const first = container.firstChild;
      if (!first) break;
      if (first.nodeType === Node.ELEMENT_NODE) {
        const mid = first.dataset ? first.dataset.mid : '';
        if (mid) renderedIds.delete(mid);
      }
      container.removeChild(first);
    }
  }

  function formatTime(raw) {
    if (!raw) return '';
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  function dispose() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = 0;
    }
  }

  return {
    handleEvent,
    dispose
  };
}

window.ChatModule = { createChatRenderer: createChatRenderer };

// ─────────────────────────────────────────────────────────────────────────────
// ChatTransport — layered fallback: Fetch+Stream → SSE → Long Polling
//
// Usage:
//   const t = new ChatTransport({
//     sessionId: 'ABC123',
//     onMessage(msg) { /* render incoming support/bot message */ },
//     onStatusChange({ layer, label }) { /* 1=Stream,2=SSE,3=Polling */ },
//     onSendLock(busy)  { /* disable/enable send button */ }
//   });
//   t.start();
//   await t.send({ message, message_type, ... });
//   t.stop();
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var PROBE_TIMEOUT_MS = 3000;   // max time to detect layer works
  var WATCHDOG_MS      = 50000;  // silence threshold → fallback (must be > heartbeat interval 25s)
  var POLL_DEBOUNCE_MS = 3000;
  var LAYER_LABELS     = ['', 'Stream', 'SSE', 'Polling'];

  function ChatTransport(opts) {
    this._sessionId       = String(opts.sessionId || '').trim().toUpperCase();
    this._onMessage       = opts.onMessage       || function () {};
    this._onStatusChange  = opts.onStatusChange  || function () {};
    this._onSendLock      = opts.onSendLock      || function () {};

    this._layer           = 0;   // 0 = not started; 1,2,3 active
    this._stopped         = false;
    this._pollSince       = Date.now() - 30000;  // catch recent messages on first poll
    this._pollTimer       = null;
    this._pollAbort       = null;
    this._watchdog        = null;
    this._sseSource       = null;
    this._fetchAbort      = null;
    this._canaryTimer        = null;  // GEN-1
    this._reconnectDebounce  = null;  // mobile guard debounce
    this._visibilityHandler  = null;  // IOS-1 / IOS-3
    this._pageshowHandler    = null;  // IOS-3 BFCache
    this._onlineHandler      = null;  // AND-2
    this._lastEventId        = '';    // P1-1: Last-Event-ID for SSE reconnect replay
    this._lastReconnectAt    = 0;     // P1-4: cooldown — suppress rapid reconnects
    this._sseCleanupFn       = null;  // P1-3: per-instance cleanup fn carrying isClosedByUs
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  ChatTransport.prototype.start = function () {
    if (!this._sessionId) return;
    this._stopped = false;
    this._attachMobileGuards();
    this._tryLayer(1);
  };

  ChatTransport.prototype.stop = function () {
    this._stopped = true;
    this._clearWatchdog();
    this._clearCanary();
    this._cleanupSSE();
    this._cleanupPoll();
    this._cleanupFetch();
    this._detachMobileGuards();
  };

  ChatTransport.prototype.send = async function (payload) {
    this._onSendLock(true);
    try {
      var body = Object.assign({
        session_code: this._sessionId,
        sender_type: 'customer'
      }, payload);
      var resp = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      var json = await resp.json();
      return json;
    } finally {
      this._onSendLock(false);
    }
  };

  // ── Layer selection ─────────────────────────────────────────────────────────

  ChatTransport.prototype._tryLayer = function (n) {
    if (this._stopped) return;
    this._layer = n;
    this._updateBadge(n);
    if (n === 1) {
      this._tryFetchStream();
    } else if (n === 2) {
      this._trySSE();
    } else {
      this._startPolling();
    }
  };

  ChatTransport.prototype._fallback = function () {
    this._cleanupSSE();
    this._cleanupFetch();
    this._clearWatchdog();
    var next = Math.min(this._layer + 1, 3);
    if (next === this._layer) return;  // already at layer 3
    this._tryLayer(next);
  };

  // ── Layer 1: fetch() + ReadableStream (manual SSE parse) ───────────────────

  ChatTransport.prototype._tryFetchStream = function () {
    var self = this;
    var ctrl = new AbortController();
    this._fetchAbort = ctrl;

    var probeTimer = setTimeout(function () {
      ctrl.abort();
      self._fallback();
    }, PROBE_TIMEOUT_MS);

    // P1-1: include Last-Event-ID so the server can replay messages missed
    // during the disconnection window.
    var reqHeaders = { 'Accept': 'text/event-stream', 'Cache-Control': 'no-cache' };
    if (self._lastEventId) reqHeaders['Last-Event-ID'] = self._lastEventId;

    fetch('/api/chat/events/' + this._sessionId, {
      signal: ctrl.signal,
      headers: reqHeaders
    })
      .then(function (resp) {
        if (!resp.ok || !resp.body) throw new Error('no body');
        clearTimeout(probeTimer);
        self._resetWatchdog();
        // GEN-1 canary for Layer 1: if the proxy buffers the response body the
        // canary event never arrives and we fall back after 5 s (same as Layer 2).
        self._canaryTimer = setTimeout(function () {
          self._canaryTimer = null;
          if (self._fetchAbort === ctrl && !self._stopped) self._fallback();
        }, 5000);

        var reader = resp.body.getReader();
        var decoder = new TextDecoder();
        var buf = '';

        function read() {
          reader.read().then(function (result) {
            if (self._stopped || result.done) return;
            self._resetWatchdog();
            buf += decoder.decode(result.value || new Uint8Array(), { stream: true });

            var lines = buf.split('\n');
            buf = lines.pop();  // last incomplete line stays in buffer
            var evtType = '';
            var evtData = '';
            var evtId   = '';  // P1-1
            lines.forEach(function (line) {
              if (line.startsWith('id:')) {
                evtId = line.slice(3).trim();  // P1-1: capture event id
              } else if (line.startsWith('event:')) {
                evtType = line.slice(6).trim();
              } else if (line.startsWith('data:')) {
                evtData = line.slice(5).trim();
              } else if (line === '') {
                if (evtId) self._lastEventId = evtId;  // P1-1: persist last seen id
                if (evtType === 'canary') {
                  self._clearCanary();  // GEN-1: proxy not buffering
                } else if (evtType && evtData) {
                  self._dispatchSSEEvent(evtType, evtData);
                }
                evtType = '';
                evtData = '';
                evtId   = '';
              }
            });
            read();
          }).catch(function () {
            if (!self._stopped) self._fallback();
          });
        }
        read();
      })
      .catch(function (err) {
        clearTimeout(probeTimer);
        // AbortError means *we* aborted (probe timeout already called _fallback) — don't double-fallback.
        if (!self._stopped && !(err && err.name === 'AbortError')) self._fallback();
      });
  };

  ChatTransport.prototype._cleanupFetch = function () {
    if (this._fetchAbort) {
      try { this._fetchAbort.abort(); } catch (_) {}
      this._fetchAbort = null;
    }
  };

  // ── Layer 2: native EventSource ─────────────────────────────────────────────

  ChatTransport.prototype._trySSE = function () {
    var self = this;
    // P1-3: isClosedByUs prevents Samsung Internet / Chrome iOS from firing
    // onerror after we deliberately called es.close().  Lives in this closure
    // so each _trySSE() call starts with a fresh false — P3-2 is automatically
    // avoided because BFCache restores trigger _trySSE() again.
    var isClosedByUs = false;
    var es = new EventSource('/api/chat/events/' + this._sessionId);
    this._sseSource = es;
    // Store a cleanup fn that captures isClosedByUs; used by _cleanupSSE.
    this._sseCleanupFn = function () {
      isClosedByUs = true;
      try { es.close(); } catch (_) {}
    };

    var probeTimer = setTimeout(function () {
      // Probe expired — SSE didn't open in time; clean up and fall through.
      if (self._sseSource === es) self._fallback();
    }, PROBE_TIMEOUT_MS);

    // ── BUG FIX #1: clear probe on *open*, not on first message ──────────────
    // Without this, a quiet session (no messages in 3s) would wrongly fall to
    // Layer 3 even though the SSE connection is perfectly alive.
    es.onopen = function () {
      clearTimeout(probeTimer);
      self._resetWatchdog();
      // GEN-1: start canary probe — if the 'canary' event sent right after
      // connection doesn't arrive within 5s, the proxy is buffering → fall back.
      self._canaryTimer = setTimeout(function () {
        self._canaryTimer = null;
        if (self._sseSource === es && !self._stopped) self._fallback();
      }, 5000);
    };

    // 'ping' is the server heartbeat (named event). Listening here resets the watchdog
    // so a quiet chat session doesn't fall from Layer 2 (SSE) to Layer 3 (polling).
    // 'canary' is the proxy-detection probe sent once on connect (GEN-1).
    // 'server_restart' is sent by SIGTERM handler — reconnect after hint delay.
    ['new_message', 'typing', 'stop_typing', 'online_status', 'message_status', 'ping', 'canary', 'server_restart'].forEach(function (t) {
      es.addEventListener(t, function (e) {
        self._resetWatchdog();
        if (t === 'canary') { self._clearCanary(); return; } // probe arrived — proxy is not buffering
        if (t === 'server_restart') {
          var delay = 2000;
          try { var d = JSON.parse(e.data); delay = Number(d.reconnectAfter) || 2000; } catch (_) {}
          setTimeout(function () { if (!self._stopped) self._hardReconnect('server_restart'); }, delay);
          return;
        }
        if (t !== 'ping') self._dispatchSSEEvent(t, e.data);
      });
    });

    // ── BUG FIX #3 + P1-3: guard against stale-reference / Samsung Internet
    // double-fallback after es.close().  isClosedByUs (local closure) catches
    // the Samsung case; _sseSource !== es catches any other stale reference.
    es.onerror = function () {
      if (isClosedByUs || self._sseSource !== es) return;
      clearTimeout(probeTimer);
      self._fallback();
    };
  };

  ChatTransport.prototype._cleanupSSE = function () {
    this._clearCanary();
    if (this._sseSource) {
      if (this._sseCleanupFn) {
        try { this._sseCleanupFn(); } catch (_) {}  // sets isClosedByUs = true, then closes
        this._sseCleanupFn = null;
      } else {
        try { this._sseSource.close(); } catch (_) {}
      }
      this._sseSource = null;
    }
  };

  // ── Layer 3: long polling ───────────────────────────────────────────────────

  ChatTransport.prototype._startPolling = function () {
    if (this._stopped) return;
    this._doPoll();
  };

  ChatTransport.prototype._doPoll = function () {
    var self = this;
    if (this._stopped) return;

    var ctrl = new AbortController();
    this._pollAbort = ctrl;

    fetch('/api/chat/poll/' + self._sessionId + '?since=' + self._pollSince, {
      signal: ctrl.signal
    })
      .then(function (r) {
        // ── P1 FIX: stop polling on 404 (no session) or 410 (session expired) ──
        if (r.status === 404 || r.status === 410) {
          self._stopped = true;
          return null;
        }
        return r.json();
      })
      .then(function (body) {
        if (!body || self._stopped) return;
        var msgs = Array.isArray(body.messages) ? body.messages : [];
        msgs.forEach(function (m) {
          self._pollSince = Math.max(self._pollSince, new Date(m.created_at).getTime() + 1);
          self._onMessage(m);
        });
        // Re-poll after a short debounce
        self._pollTimer = setTimeout(function () { self._doPoll(); }, POLL_DEBOUNCE_MS);
      })
      .catch(function (err) {
        if (self._stopped || (err && err.name === 'AbortError')) return;
        // Network error: back-off 5 s then retry
        self._pollTimer = setTimeout(function () { self._doPoll(); }, 5000);
      });
  };

  ChatTransport.prototype._cleanupPoll = function () {
    clearTimeout(this._pollTimer);
    this._pollTimer = null;
    if (this._pollAbort) {
      try { this._pollAbort.abort(); } catch (_) {}
      this._pollAbort = null;
    }
  };

  // ── SSE event dispatcher ────────────────────────────────────────────────────

  ChatTransport.prototype._dispatchSSEEvent = function (type, rawData) {
    try {
      var data = JSON.parse(rawData);
      if (type === 'new_message') {
        var msg = data.message || data;
        if (msg && msg.sender_type !== 'customer') {
          this._pollSince = Math.max(this._pollSince, new Date(msg.created_at).getTime() + 1);
          this._onMessage(msg);
        }
      }
      // typing / status events dispatch a custom DOM event for chat-advanced.js
      if (type === 'typing' || type === 'stop_typing' || type === 'online_status' || type === 'message_status') {
        document.dispatchEvent(new CustomEvent('chatTransport:' + type, { detail: data }));
      }
    } catch (_) {}
  };

  // ── Canary (GEN-1) ─────────────────────────────────────────────────────────

  ChatTransport.prototype._clearCanary = function () {
    clearTimeout(this._canaryTimer);
    this._canaryTimer = null;
  };

  // ── Mobile guards (IOS-1 / IOS-3 / AND-2) ───────────────────────────────────
  //
  // All three guards funnel into _hardReconnect(), which is debounced (300 ms)
  // so simultaneous events (e.g. visibilitychange + online) collapse into one
  // reconnect attempt.  Guard logic inside prevents spurious reconnects when
  // the connection is already healthy.

  ChatTransport.prototype._hardReconnect = function (reason) {
    if (this._stopped) return;
    var self = this;
    clearTimeout(this._reconnectDebounce);
    // P2-1: 1000ms debounce (was 300ms) collapses WiFi↔4G multi-event storms
    // (Android fires online→offline→online within ~1-2s during IP re-negotiation).
    this._reconnectDebounce = setTimeout(function () {
      if (self._stopped) return;
      // P1-4: cooldown — prevents rapid lock/unlock screen from spawning multiple
      // connections.  BFCache pageshow bypasses _hardReconnect entirely so it
      // is not affected by this cooldown.
      var now = Date.now();
      if (now - self._lastReconnectAt < 1500) return;
      self._lastReconnectAt = now;

      // Layer 3 (long polling) self-heals — no hard reconnect needed.
      // Just kick _doPoll in case it's waiting on a back-off timer.
      if (self._layer === 3) {
        clearTimeout(self._pollTimer);
        self._pollTimer = null;
        self._doPoll();
        return;
      }

      // IOS-1 / AND-2: if the EventSource readyState is truly OPEN *and* the
      // watchdog is still live, the connection is healthy — skip reconnect.
      var esOpen     = self._sseSource && self._sseSource.readyState === 1 /* OPEN */;
      var wdLive     = !!self._watchdog;
      var fetchLive  = !!self._fetchAbort && wdLive;
      if ((esOpen && wdLive) || fetchLive) return;

      // Connection is stale (zombie) — tear down completely and restart.
      self._clearWatchdog();
      self._clearCanary();
      self._cleanupSSE();
      self._cleanupFetch();
      self._cleanupPoll();
      self._layer = 0;
      self._tryLayer(1);
    }, 1000);  // P2-1: 1000ms debounce (was 300ms)
  };

  ChatTransport.prototype._attachMobileGuards = function () {
    var self = this;

    // IOS-1 + IOS-3: iOS suspends tabs; onerror never fires, readyState stays 1.
    // Re-check health when the tab becomes visible again.
    self._visibilityHandler = function () {
      if (document.visibilityState === 'visible') self._hardReconnect('visibilitychange');
    };
    document.addEventListener('visibilitychange', self._visibilityHandler);

    // IOS-3: BFCache restore (e.persisted = true) — EventSource is a zombie.
    // Always hard-reconnect; don't rely on readyState check here.
    self._pageshowHandler = function (evt) {
      if (evt.persisted) {
        // Force reconnect regardless of readyState — BFCache guarantees zombie.
        self._clearWatchdog();
        self._cleanupSSE();
        self._cleanupFetch();
        self._layer = 0;
        if (!self._stopped) self._tryLayer(1);
      }
    };
    window.addEventListener('pageshow', self._pageshowHandler);

    // AND-2: WiFi↔4G switch drops TCP silently; onerror fires after ~90s TCP
    // timeout. Reconnect immediately when the browser reports online.
    self._onlineHandler = function () { self._hardReconnect('network-online'); };
    window.addEventListener('online', self._onlineHandler);
  };

  ChatTransport.prototype._detachMobileGuards = function () {
    if (this._visibilityHandler) {
      document.removeEventListener('visibilitychange', this._visibilityHandler);
      this._visibilityHandler = null;
    }
    if (this._pageshowHandler) {
      window.removeEventListener('pageshow', this._pageshowHandler);
      this._pageshowHandler = null;
    }
    if (this._onlineHandler) {
      window.removeEventListener('online', this._onlineHandler);
      this._onlineHandler = null;
    }
    clearTimeout(this._reconnectDebounce);
    this._reconnectDebounce = null;
  };

  // ── Watchdog (silence = fallback) ──────────────────────────────────────────

  ChatTransport.prototype._resetWatchdog = function () {
    var self = this;
    this._clearWatchdog();
    if (this._layer >= 3) return;  // layer 3 (polling) needs no watchdog
    this._watchdog = setTimeout(function () {
      if (!self._stopped) self._fallback();
    }, WATCHDOG_MS);
  };

  ChatTransport.prototype._clearWatchdog = function () {
    clearTimeout(this._watchdog);
    this._watchdog = null;
  };

  // ── Badge ───────────────────────────────────────────────────────────────────

  ChatTransport.prototype._updateBadge = function (layer) {
    this._onStatusChange({ layer: layer, label: LAYER_LABELS[layer] || '?' });

    var bar  = document.getElementById('chatConnectionBar');
    var text = document.getElementById('chatConnectionText');
    if (!bar || !text) return;

    var colors  = ['', '#22c55e', '#eab308', '#ef4444'];
    var dots    = ['', '●', '●', '●'];
    var visible = layer > 1;  // layer 1 (Stream) is silent; show bar only for degraded layers

    bar.style.display     = visible ? 'flex' : 'none';
    bar.style.background  = visible ? colors[layer] + '18' : '';
    bar.style.borderColor = visible ? colors[layer] : '';
    text.innerHTML        = visible
      ? '<span style="color:' + colors[layer] + ';margin-right:4px">' + dots[layer] + '</span>'
        + (layer === 2 ? 'Đang kết nối SSE…' : 'Chế độ thăm dò (Polling)')
      : '';
  };

  // ── Export ──────────────────────────────────────────────────────────────────
  window.ChatTransport = ChatTransport;
  window.ChatModule.ChatTransport = ChatTransport;
}());
