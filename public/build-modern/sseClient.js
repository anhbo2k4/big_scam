/* Dependencies loaded via script tags: eventQueue.js, scheduler.js */
var createEventQueue = (window.EventQueueModule && window.EventQueueModule.createEventQueue) || function() { throw new Error('EventQueueModule not loaded'); };
var createAdaptiveScheduler = (window.SchedulerModule && window.SchedulerModule.createAdaptiveScheduler) || function() { throw new Error('SchedulerModule not loaded'); };

const DEFAULT_EVENTS = [
  'new_message',
  'chat_message',
  'admin_message',
  'typing',
  'stop_typing',
  'online_status',
  'wallet_update',
  'system_notification',
  'approval',
  'box_result',
  'session_result'
];

const CRITICAL_EVENT_TYPES = new Set([
  'approval',
  'box_result',
  'session_result'
]);

const HIGH_PRIORITY_TYPES = new Set([
  'system_notification',
  'wallet_update'
]);

function resolvePriority(type, payload) {
  const t = String(type || '').trim();
  if (payload && (payload.critical === true || payload.priority === 'high')) return 'high';
  return HIGH_PRIORITY_TYPES.has(t) ? 'high' : 'low';
}

function parsePayload(raw) {
  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function extractVersion(payload, fallbackTs) {
  if (!payload || typeof payload !== 'object') return Number(fallbackTs || Date.now());
  const raw = payload.version
    ?? payload.stateVersion
    ?? payload.updatedAtMs
    ?? payload.updatedAt
    ?? payload.ts
    ?? payload.timestamp
    ?? fallbackTs
    ?? Date.now();
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const asNum = Number(raw);
    if (Number.isFinite(asNum) && asNum > 0) return asNum;
    const asDate = Date.parse(raw);
    if (Number.isFinite(asDate) && asDate > 0) return asDate;
  }
  return Number(fallbackTs || Date.now());
}

/* SSEClient - exposed via window.SSEClientModule */
class SSEClient {
  constructor(options = {}) {
    this.onEvent = typeof options.onEvent === 'function' ? options.onEvent : () => {};
    this.onCriticalEvent = typeof options.onCriticalEvent === 'function' ? options.onCriticalEvent : () => {};
    this.onOpen = typeof options.onOpen === 'function' ? options.onOpen : null;
    this.onError = typeof options.onError === 'function' ? options.onError : null;
    this.onReconnect = typeof options.onReconnect === 'function' ? options.onReconnect : null;
    const customEventTypes = Array.isArray(options.eventTypes) && options.eventTypes.length
      ? options.eventTypes
      : DEFAULT_EVENTS;
    this.eventTypes = Array.from(new Set([...
      customEventTypes,
      ...Array.from(CRITICAL_EVENT_TYPES)
    ]));

    this.source = null;
    this.url = '';
    this.connectCount = 0;
  }

  connect(url) {
    const next = String(url || '').trim();
    if (!next) return;
    if (this.source && this.url === next) return;

    this.disconnect();
    this.url = next;

    const source = new EventSource(next);
    this.source = source;
    this.connectCount += 1;
    let openedOnce = false;

    source.onopen = () => {
      const isReconnect = openedOnce || this.connectCount > 1;
      openedOnce = true;
      if (this.onOpen) this.onOpen({ isReconnect, url: this.url });
      if (isReconnect && this.onReconnect) this.onReconnect({ url: this.url, reason: 'eventsource-open' });
    };

    source.onerror = (err) => {
      if (this.onError) this.onError(err);
    };

    for (const eventType of this.eventTypes) {
      source.addEventListener(eventType, (event) => {
        const payload = parsePayload(event.data);
        if (payload == null) return;

        const normalized = {
          type: eventType,
          payload,
          id: String(event.lastEventId || payload.id || payload.messageId || '').trim() || null,
          ts: Date.now(),
          version: extractVersion(payload, Date.now()),
          priority: resolvePriority(eventType, payload)
        };

        if (CRITICAL_EVENT_TYPES.has(eventType)) {
          // Critical state events bypass queue/scheduler and must be processed immediately.
          this.onCriticalEvent(normalized);
          return;
        }

        this.onEvent(normalized);
      });
    }
  }

  disconnect() {
    if (!this.source) return;
    this.source.close();
    this.source = null;
    this.url = '';
  }
}

// Backward-compatible global wrapper used by legacy runtime.
class MobileSSEBatchClient {
  constructor(handlers = {}, options = {}) {
    this.handlers = handlers;
    this.stateManager = handlers && handlers.stateManager && typeof handlers.stateManager.handleCriticalEvent === 'function'
      ? handlers.stateManager
      : null;
    this.lastCriticalEvents = new Map();
    this.lastCriticalVersionByType = new Map();
    this.recoveryInFlight = false;
    this.getStateSnapshot = typeof handlers.getStateSnapshot === 'function'
      ? handlers.getStateSnapshot
      : (typeof options.getStateSnapshot === 'function' ? options.getStateSnapshot : null);

    this.queue = createEventQueue({
      hardCap: Number(options.maxQueueSize) || 500,
      hiddenCap: Math.min(120, Number(options.maxQueueSize) || 500)
    });

    this.scheduler = createAdaptiveScheduler(this.queue, (evt) => {
      const fn = this.handlers[evt.type] || this.handlers.onEvent;
      if (typeof fn === 'function') fn(evt.payload, evt.type);
    }, {
      frameBudgetMs: Number(options.frameBudgetMs) || 8,
      maxEventsPerFrame: Math.max(10, Math.min(50, Number(options.batchSize) || 20)),
      minEventsPerFrame: 8,
      hiddenQueueCap: 120
    });

    this.client = new SSEClient({
      onEvent: (evt) => {
        this.queue.enqueue(evt);
        this.scheduler.schedule();
      },
      onCriticalEvent: (evt) => {
        this.handleCriticalEvent(evt);
      },
      onOpen: (ctx) => {
        if (typeof this.handlers.onOpen === 'function') this.handlers.onOpen(ctx);
      },
      onReconnect: () => {
        this.recoverStateFromServer();
      },
      onError: () => {
        if (typeof this.handlers.onError === 'function') this.handlers.onError();
      }
    });

    this.scheduler.start();
  }

  connect(url) {
    this.client.connect(url);
  }

  close() {
    this.client.disconnect();
    this.scheduler.stop();
    this.queue.clear();
    this.lastCriticalEvents.clear();
    this.lastCriticalVersionByType.clear();
  }

  dispose() {
    this.close();
    this.scheduler.dispose();
  }

  handleCriticalEvent(evt) {
    if (!evt || !evt.type) return;

    const version = Number(evt.version || 0);
    const prevVersion = Number(this.lastCriticalVersionByType.get(evt.type) || 0);
    if (version > 0 && prevVersion > 0 && version < prevVersion) {
      // Drop out-of-order stale critical events.
      return;
    }
    if (version > 0) {
      this.lastCriticalVersionByType.set(evt.type, Math.max(prevVersion, version));
    }

    const key = String(evt.type);
    this.lastCriticalEvents.set(key, evt);
    if (this.lastCriticalEvents.size > 20) {
      const oldest = this.lastCriticalEvents.keys().next().value;
      this.lastCriticalEvents.delete(oldest);
    }

    // State machine handles critical state transitions immediately.
    if (this.stateManager) {
      try {
        this.stateManager.handleCriticalEvent(evt.type, evt.payload || {}, evt);
      } catch (_) {}
    }

    const specific = this.handlers[key];
    if (typeof specific === 'function') {
      specific(evt.payload, evt.type, evt);
      return;
    }

    if (typeof this.handlers.onCriticalEvent === 'function') {
      this.handlers.onCriticalEvent(evt.payload, evt.type, evt);
    }
  }

  recoverStateFromServer() {
    if (this.recoveryInFlight) return;
    this.recoveryInFlight = true;

    const done = () => {
      this.recoveryInFlight = false;
    };

    if (this.stateManager && typeof this.stateManager.syncNow === 'function') {
      Promise.resolve(this.stateManager.syncNow())
        .catch(() => {})
        .finally(done);
      return;
    }

    if (typeof this.getStateSnapshot === 'function') {
      Promise.resolve(this.getStateSnapshot())
        .then((snapshot) => {
          if (!snapshot) return;
          if (typeof this.handlers.onRecoveredState === 'function') {
            this.handlers.onRecoveredState(snapshot);
          }
        })
        .catch(() => {})
        .finally(done);
      return;
    }

    done();
  }

  getDebugInfo() {
    return {
      queue: typeof this.queue.stats === 'function' ? this.queue.stats() : { total: this.queue.size() },
      scheduler: typeof this.scheduler.stats === 'function' ? this.scheduler.stats() : {},
      criticalVersions: Object.fromEntries(this.lastCriticalVersionByType.entries()),
      lastCriticalTypes: Array.from(this.lastCriticalEvents.keys()),
      connectedUrl: this.client?.url || '',
      reconnectRecoveryInFlight: this.recoveryInFlight
    };
  }
}

window.MobileSSEBatchClient = window.MobileSSEBatchClient || MobileSSEBatchClient;
window.__lmbRealtimeDebug = window.__lmbRealtimeDebug || {};
window.__lmbRealtimeDebug.getClientDebug = () => {
  const Ctor = window.MobileSSEBatchClient;
  if (!Ctor || !Ctor.__lastInstance) return null;
  return Ctor.__lastInstance.getDebugInfo();
};

const _MobileCtor = window.MobileSSEBatchClient;
if (_MobileCtor && !_MobileCtor.__debugWrapped) {
  const OriginalCtor = _MobileCtor;
  const WrappedCtor = function wrappedMobileSSEBatchClient(...args) {
    const instance = new OriginalCtor(...args);
    WrappedCtor.__lastInstance = instance;
    return instance;
  };
  WrappedCtor.prototype = OriginalCtor.prototype;
  WrappedCtor.__debugWrapped = true;
  WrappedCtor.__lastInstance = null;
  window.MobileSSEBatchClient = WrappedCtor;
}

window.SSEClientModule = { SSEClient: SSEClient };
