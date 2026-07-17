function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* Dependencies loaded via script tags: eventQueue.js, scheduler.js */
var createEventQueue = window.EventQueueModule && window.EventQueueModule.createEventQueue || function () {
  throw new Error('EventQueueModule not loaded');
};
var createAdaptiveScheduler = window.SchedulerModule && window.SchedulerModule.createAdaptiveScheduler || function () {
  throw new Error('SchedulerModule not loaded');
};
var DEFAULT_EVENTS = ['new_message', 'chat_message', 'admin_message', 'typing', 'stop_typing', 'online_status', 'wallet_update', 'system_notification', 'approval', 'box_result', 'session_result'];
var CRITICAL_EVENT_TYPES = new Set(['approval', 'box_result', 'session_result']);
var HIGH_PRIORITY_TYPES = new Set(['system_notification', 'wallet_update']);
function resolvePriority(type, payload) {
  var t = String(type || '').trim();
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
  var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _payload$version;
  if (!payload || _typeof(payload) !== 'object') return Number(fallbackTs || Date.now());
  var raw = (_ref = (_ref2 = (_ref3 = (_ref4 = (_ref5 = (_ref6 = (_payload$version = payload.version) !== null && _payload$version !== void 0 ? _payload$version : payload.stateVersion) !== null && _ref6 !== void 0 ? _ref6 : payload.updatedAtMs) !== null && _ref5 !== void 0 ? _ref5 : payload.updatedAt) !== null && _ref4 !== void 0 ? _ref4 : payload.ts) !== null && _ref3 !== void 0 ? _ref3 : payload.timestamp) !== null && _ref2 !== void 0 ? _ref2 : fallbackTs) !== null && _ref !== void 0 ? _ref : Date.now();
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    var asNum = Number(raw);
    if (Number.isFinite(asNum) && asNum > 0) return asNum;
    var asDate = Date.parse(raw);
    if (Number.isFinite(asDate) && asDate > 0) return asDate;
  }
  return Number(fallbackTs || Date.now());
}

/* SSEClient - exposed via window.SSEClientModule */
var SSEClient = /*#__PURE__*/function () {
  function SSEClient() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, SSEClient);
    this.onEvent = typeof options.onEvent === 'function' ? options.onEvent : function () {};
    this.onCriticalEvent = typeof options.onCriticalEvent === 'function' ? options.onCriticalEvent : function () {};
    this.onOpen = typeof options.onOpen === 'function' ? options.onOpen : null;
    this.onError = typeof options.onError === 'function' ? options.onError : null;
    this.onReconnect = typeof options.onReconnect === 'function' ? options.onReconnect : null;
    var customEventTypes = Array.isArray(options.eventTypes) && options.eventTypes.length ? options.eventTypes : DEFAULT_EVENTS;
    this.eventTypes = Array.from(new Set([].concat(_toConsumableArray(customEventTypes), _toConsumableArray(Array.from(CRITICAL_EVENT_TYPES)))));
    this.source = null;
    this.url = '';
    this.connectCount = 0;
  }
  return _createClass(SSEClient, [{
    key: "connect",
    value: function connect(url) {
      var _this = this;
      var next = String(url || '').trim();
      if (!next) return;
      if (this.source && this.url === next) return;
      this.disconnect();
      this.url = next;
      var source = new EventSource(next);
      this.source = source;
      this.connectCount += 1;
      var openedOnce = false;
      source.onopen = function () {
        var isReconnect = openedOnce || _this.connectCount > 1;
        openedOnce = true;
        if (_this.onOpen) _this.onOpen({
          isReconnect: isReconnect,
          url: _this.url
        });
        if (isReconnect && _this.onReconnect) _this.onReconnect({
          url: _this.url,
          reason: 'eventsource-open'
        });
      };
      source.onerror = function (err) {
        if (_this.onError) _this.onError(err);
      };
      var _iterator = _createForOfIteratorHelper(this.eventTypes),
        _step;
      try {
        var _loop = function _loop() {
          var eventType = _step.value;
          source.addEventListener(eventType, function (event) {
            var payload = parsePayload(event.data);
            if (payload == null) return;
            var normalized = {
              type: eventType,
              payload: payload,
              id: String(event.lastEventId || payload.id || payload.messageId || '').trim() || null,
              ts: Date.now(),
              version: extractVersion(payload, Date.now()),
              priority: resolvePriority(eventType, payload)
            };
            if (CRITICAL_EVENT_TYPES.has(eventType)) {
              // Critical state events bypass queue/scheduler and must be processed immediately.
              _this.onCriticalEvent(normalized);
              return;
            }
            _this.onEvent(normalized);
          });
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (!this.source) return;
      this.source.close();
      this.source = null;
      this.url = '';
    }
  }]);
}(); // Backward-compatible global wrapper used by legacy runtime.
var MobileSSEBatchClient = /*#__PURE__*/function () {
  function MobileSSEBatchClient() {
    var _this2 = this;
    var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, MobileSSEBatchClient);
    this.handlers = handlers;
    this.stateManager = handlers && handlers.stateManager && typeof handlers.stateManager.handleCriticalEvent === 'function' ? handlers.stateManager : null;
    this.lastCriticalEvents = new Map();
    this.lastCriticalVersionByType = new Map();
    this.recoveryInFlight = false;
    this.getStateSnapshot = typeof handlers.getStateSnapshot === 'function' ? handlers.getStateSnapshot : typeof options.getStateSnapshot === 'function' ? options.getStateSnapshot : null;
    this.queue = createEventQueue({
      hardCap: Number(options.maxQueueSize) || 500,
      hiddenCap: Math.min(120, Number(options.maxQueueSize) || 500)
    });
    this.scheduler = createAdaptiveScheduler(this.queue, function (evt) {
      var fn = _this2.handlers[evt.type] || _this2.handlers.onEvent;
      if (typeof fn === 'function') fn(evt.payload, evt.type);
    }, {
      frameBudgetMs: Number(options.frameBudgetMs) || 8,
      maxEventsPerFrame: Math.max(10, Math.min(50, Number(options.batchSize) || 20)),
      minEventsPerFrame: 8,
      hiddenQueueCap: 120
    });
    this.client = new SSEClient({
      onEvent: function onEvent(evt) {
        _this2.queue.enqueue(evt);
        _this2.scheduler.schedule();
      },
      onCriticalEvent: function onCriticalEvent(evt) {
        _this2.handleCriticalEvent(evt);
      },
      onOpen: function onOpen(ctx) {
        if (typeof _this2.handlers.onOpen === 'function') _this2.handlers.onOpen(ctx);
      },
      onReconnect: function onReconnect() {
        _this2.recoverStateFromServer();
      },
      onError: function onError() {
        if (typeof _this2.handlers.onError === 'function') _this2.handlers.onError();
      }
    });
    this.scheduler.start();
  }
  return _createClass(MobileSSEBatchClient, [{
    key: "connect",
    value: function connect(url) {
      this.client.connect(url);
    }
  }, {
    key: "close",
    value: function close() {
      this.client.disconnect();
      this.scheduler.stop();
      this.queue.clear();
      this.lastCriticalEvents.clear();
      this.lastCriticalVersionByType.clear();
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.close();
      this.scheduler.dispose();
    }
  }, {
    key: "handleCriticalEvent",
    value: function handleCriticalEvent(evt) {
      if (!evt || !evt.type) return;
      var version = Number(evt.version || 0);
      var prevVersion = Number(this.lastCriticalVersionByType.get(evt.type) || 0);
      if (version > 0 && prevVersion > 0 && version < prevVersion) {
        // Drop out-of-order stale critical events.
        return;
      }
      if (version > 0) {
        this.lastCriticalVersionByType.set(evt.type, Math.max(prevVersion, version));
      }
      var key = String(evt.type);
      this.lastCriticalEvents.set(key, evt);
      if (this.lastCriticalEvents.size > 20) {
        var oldest = this.lastCriticalEvents.keys().next().value;
        this.lastCriticalEvents.delete(oldest);
      }

      // State machine handles critical state transitions immediately.
      if (this.stateManager) {
        try {
          this.stateManager.handleCriticalEvent(evt.type, evt.payload || {}, evt);
        } catch (_) {}
      }
      var specific = this.handlers[key];
      if (typeof specific === 'function') {
        specific(evt.payload, evt.type, evt);
        return;
      }
      if (typeof this.handlers.onCriticalEvent === 'function') {
        this.handlers.onCriticalEvent(evt.payload, evt.type, evt);
      }
    }
  }, {
    key: "recoverStateFromServer",
    value: function recoverStateFromServer() {
      var _this3 = this;
      if (this.recoveryInFlight) return;
      this.recoveryInFlight = true;
      var done = function done() {
        _this3.recoveryInFlight = false;
      };
      if (this.stateManager && typeof this.stateManager.syncNow === 'function') {
        Promise.resolve(this.stateManager.syncNow()).catch(function () {}).finally(done);
        return;
      }
      if (typeof this.getStateSnapshot === 'function') {
        Promise.resolve(this.getStateSnapshot()).then(function (snapshot) {
          if (!snapshot) return;
          if (typeof _this3.handlers.onRecoveredState === 'function') {
            _this3.handlers.onRecoveredState(snapshot);
          }
        }).catch(function () {}).finally(done);
        return;
      }
      done();
    }
  }, {
    key: "getDebugInfo",
    value: function getDebugInfo() {
      var _this$client;
      return {
        queue: typeof this.queue.stats === 'function' ? this.queue.stats() : {
          total: this.queue.size()
        },
        scheduler: typeof this.scheduler.stats === 'function' ? this.scheduler.stats() : {},
        criticalVersions: Object.fromEntries(this.lastCriticalVersionByType.entries()),
        lastCriticalTypes: Array.from(this.lastCriticalEvents.keys()),
        connectedUrl: ((_this$client = this.client) === null || _this$client === void 0 ? void 0 : _this$client.url) || '',
        reconnectRecoveryInFlight: this.recoveryInFlight
      };
    }
  }]);
}();
window.MobileSSEBatchClient = window.MobileSSEBatchClient || MobileSSEBatchClient;
window.__lmbRealtimeDebug = window.__lmbRealtimeDebug || {};
window.__lmbRealtimeDebug.getClientDebug = function () {
  var Ctor = window.MobileSSEBatchClient;
  if (!Ctor || !Ctor.__lastInstance) return null;
  return Ctor.__lastInstance.getDebugInfo();
};
var _MobileCtor = window.MobileSSEBatchClient;
if (_MobileCtor && !_MobileCtor.__debugWrapped) {
  var OriginalCtor = _MobileCtor;
  var WrappedCtor = function wrappedMobileSSEBatchClient() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var instance = _construct(OriginalCtor, args);
    WrappedCtor.__lastInstance = instance;
    return instance;
  };
  WrappedCtor.prototype = OriginalCtor.prototype;
  WrappedCtor.__debugWrapped = true;
  WrappedCtor.__lastInstance = null;
  window.MobileSSEBatchClient = WrappedCtor;
}
window.SSEClientModule = {
  SSEClient: SSEClient
};