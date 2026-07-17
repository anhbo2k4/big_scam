function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var DEFAULTS = {
  hardCap: 1200,
  hiddenCap: 120,
  overloadCap: 900,
  recentIdCap: 2000,
  dedupeTtlMs: 10 * 60 * 1000
};
var COLLAPSIBLE_TYPES = new Set(['typing', 'stop_typing', 'online_status', 'wallet_update', 'system_notification']);
function normalizeEvent(input) {
  if (!input || _typeof(input) !== 'object') return null;
  var type = String(input.type || '').trim();
  if (!type) return null;
  var payload = input.payload !== undefined ? input.payload : null;
  var ts = Number(input.ts || Date.now());
  var id = String(input.id || (payload === null || payload === void 0 ? void 0 : payload.id) || (payload === null || payload === void 0 ? void 0 : payload.messageId) || '').trim() || null;
  var priority = String(input.priority || '').toLowerCase() === 'high' ? 'high' : 'low';
  return {
    type: type,
    payload: payload,
    ts: ts,
    id: id,
    key: String(input.key || ''),
    priority: priority
  };
}
function buildCollapseKey(evt) {
  if (!COLLAPSIBLE_TYPES.has(evt.type)) return '';
  var p = evt.payload || {};
  var session = String(p.sessionCode || p.session_code || p.session || '').trim();
  var user = String(p.userId || p.user_id || p.senderId || p.sender_id || '').trim();
  var scope = session || user || 'global';
  return "".concat(evt.type, ":").concat(scope);
}
function createEventQueue(options) {
  options = options || {};
  var cfg = _objectSpread(_objectSpread({}, DEFAULTS), options || {});
  var highFifo = [];
  var lowFifo = [];
  var highCoalesced = new Map();
  var lowCoalesced = new Map();
  var highCoalescedOrder = [];
  var lowCoalescedOrder = [];
  var recentIds = new Map();
  var droppedHigh = 0;
  var droppedLow = 0;
  var coalescedCount = 0;
  var api = {
    enqueue: function enqueue(input) {
      var evt = normalizeEvent(input);
      if (!evt) return false;
      if (evt.id) {
        if (recentIds.has(evt.id)) return false;
        recentIds.set(evt.id, evt.ts);
        if (recentIds.size > cfg.recentIdCap) {
          var oldest = recentIds.keys().next().value;
          recentIds.delete(oldest);
        }
      }
      var collapseKey = evt.key || buildCollapseKey(evt);
      if (collapseKey) {
        var isHigh = evt.priority === 'high';
        var map = isHigh ? highCoalesced : lowCoalesced;
        var order = isHigh ? highCoalescedOrder : lowCoalescedOrder;
        var prev = map.get(collapseKey);
        if (prev) {
          map.set(collapseKey, mergeEvents(prev, evt));
          coalescedCount += 1;
        } else {
          map.set(collapseKey, evt);
          order.push(collapseKey);
        }
      } else {
        if (evt.priority === 'high') highFifo.push(evt);else lowFifo.push(evt);
      }
      trimToCap(cfg.hardCap);
      return true;
    },
    takeNext: function takeNext() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var preferLow = opts && opts.prefer === 'low';
      if (preferLow) {
        var lowEvt = takeLow();
        if (lowEvt) return lowEvt;
        return takeHigh();
      }
      var highEvt = takeHigh();
      if (highEvt) return highEvt;
      return takeLow();
    },
    size: function size() {
      return highFifo.length + lowFifo.length + highCoalesced.size + lowCoalesced.size;
    },
    sizeHigh: function sizeHigh() {
      return highFifo.length + highCoalesced.size;
    },
    sizeLow: function sizeLow() {
      return lowFifo.length + lowCoalesced.size;
    },
    trimForHidden: function trimForHidden() {
      var cap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cfg.hiddenCap;
      trimLowFirstToCap(Math.max(0, Number(cap) || cfg.hiddenCap));
    },
    trimForOverload: function trimForOverload() {
      var targetCap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : cfg.overloadCap;
      trimLowFirstToCap(Math.max(0, Number(targetCap) || cfg.overloadCap));
    },
    cleanup: function cleanup() {
      var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now();
      var threshold = now - cfg.dedupeTtlMs;
      var _iterator = _createForOfIteratorHelper(recentIds.entries()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            id = _step$value[0],
            ts = _step$value[1];
          if (ts < threshold) recentIds.delete(id);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      trimToCap(cfg.hardCap);
    },
    clear: function clear() {
      highFifo.length = 0;
      lowFifo.length = 0;
      highCoalesced.clear();
      lowCoalesced.clear();
      highCoalescedOrder.length = 0;
      lowCoalescedOrder.length = 0;
      recentIds.clear();
      droppedHigh = 0;
      droppedLow = 0;
      coalescedCount = 0;
    },
    stats: function stats() {
      return {
        total: api.size(),
        high: api.sizeHigh(),
        low: api.sizeLow(),
        droppedHigh: droppedHigh,
        droppedLow: droppedLow,
        coalescedCount: coalescedCount,
        recentIds: recentIds.size
      };
    }
  };
  function mergeEvents(prev, next) {
    var payload = next.payload;
    if (prev && prev.payload && _typeof(prev.payload) === 'object' && !Array.isArray(prev.payload) && next && next.payload && _typeof(next.payload) === 'object' && !Array.isArray(next.payload)) {
      payload = _objectSpread(_objectSpread({}, prev.payload), next.payload);
    }
    return _objectSpread(_objectSpread(_objectSpread({}, prev), next), {}, {
      payload: payload,
      ts: Math.max(Number((prev === null || prev === void 0 ? void 0 : prev.ts) || 0), Number((next === null || next === void 0 ? void 0 : next.ts) || 0))
    });
  }
  function takeHigh() {
    if (highFifo.length) return highFifo.shift() || null;
    return shiftCoalesced(highCoalesced, highCoalescedOrder);
  }
  function takeLow() {
    if (lowFifo.length) return lowFifo.shift() || null;
    return shiftCoalesced(lowCoalesced, lowCoalescedOrder);
  }
  function shiftCoalesced(map, order) {
    while (order.length) {
      var key = order.shift();
      if (!map.has(key)) continue;
      var evt = map.get(key) || null;
      map.delete(key);
      return evt;
    }
    return null;
  }
  function trimToCap(cap) {
    trimLowFirstToCap(cap);
    while (api.size() > cap) {
      if (highFifo.length) {
        highFifo.shift();
        droppedHigh += 1;
        continue;
      }
      if (highCoalesced.size) {
        var dropped = shiftCoalesced(highCoalesced, highCoalescedOrder);
        if (dropped) droppedHigh += 1;
        continue;
      }
      break;
    }
  }
  function trimLowFirstToCap(cap) {
    while (api.size() > cap) {
      if (lowFifo.length) {
        lowFifo.shift();
        droppedLow += 1;
        continue;
      }
      if (lowCoalesced.size) {
        var dropped = shiftCoalesced(lowCoalesced, lowCoalescedOrder);
        if (dropped) droppedLow += 1;
        continue;
      }
      break;
    }
  }
  return api;
}
window.EventQueueModule = {
  createEventQueue: createEventQueue
};