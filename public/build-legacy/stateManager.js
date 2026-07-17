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
var STATES = Object.freeze({
  IDLE: 'IDLE',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  APPROVED: 'APPROVED',
  SHOW_RESULT: 'SHOW_RESULT'
});
var VALID_TRANSITIONS = Object.freeze({
  IDLE: new Set([STATES.WAITING_APPROVAL, STATES.SHOW_RESULT]),
  WAITING_APPROVAL: new Set([STATES.APPROVED, STATES.SHOW_RESULT, STATES.IDLE]),
  APPROVED: new Set([STATES.SHOW_RESULT, STATES.IDLE]),
  SHOW_RESULT: new Set([STATES.IDLE, STATES.WAITING_APPROVAL])
});
var DEFAULTS = {
  initialState: STATES.IDLE,
  syncIntervalMs: 4000,
  dedupeTtlMs: 10 * 60 * 1000,
  channelName: 'lmb-state-sync-v1',
  enableBroadcastSync: true,
  enableDebug: true,
  getSnapshot: null,
  onStateChange: null,
  renderers: {}
};
function getTabId() {
  return "tab-".concat(Math.random().toString(36).slice(2), "-").concat(Date.now().toString(36));
}
function normalizeState(state) {
  var next = String(state || '').trim().toUpperCase();
  if (Object.prototype.hasOwnProperty.call(STATES, next)) return STATES[next];
  if (Object.values(STATES).includes(next)) return next;
  return null;
}
function eventIdFrom(eventType, payload, eventMeta) {
  var direct = String((eventMeta === null || eventMeta === void 0 ? void 0 : eventMeta.id) || (payload === null || payload === void 0 ? void 0 : payload.eventId) || (payload === null || payload === void 0 ? void 0 : payload.id) || (payload === null || payload === void 0 ? void 0 : payload.messageId) || (payload === null || payload === void 0 ? void 0 : payload.resultId) || '').trim();
  if (direct) return "".concat(eventType, ":").concat(direct);
  var code = String((payload === null || payload === void 0 ? void 0 : payload.sessionCode) || (payload === null || payload === void 0 ? void 0 : payload.session_code) || '').trim();
  var box = String((payload === null || payload === void 0 ? void 0 : payload.boxNumber) || (payload === null || payload === void 0 ? void 0 : payload.box_number) || '').trim();
  var ts = String((payload === null || payload === void 0 ? void 0 : payload.ts) || (payload === null || payload === void 0 ? void 0 : payload.updatedAt) || (payload === null || payload === void 0 ? void 0 : payload.createdAt) || '').trim();
  return "".concat(eventType, ":").concat(code, ":").concat(box, ":").concat(ts);
}
function deriveStateFromSnapshot(snapshot) {
  if (!snapshot || _typeof(snapshot) !== 'object') return null;
  var explicit = normalizeState(snapshot.state || snapshot.currentState);
  if (explicit) return explicit;
  var status = String(snapshot.status || snapshot.approvalStatus || '').trim().toLowerCase();
  if (status === 'waiting' || status === 'pending' || status === 'pending_approval') {
    return STATES.WAITING_APPROVAL;
  }
  if (status === 'approved' || status === 'confirmed') return STATES.APPROVED;
  var hasResult = !!(snapshot.result || snapshot.reward || snapshot.prize || snapshot.sessionResult);
  if (hasResult) return STATES.SHOW_RESULT;
  return STATES.IDLE;
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
function canTransition(fromState, toState) {
  if (fromState === toState) return true;
  var allowed = VALID_TRANSITIONS[fromState];
  return !!(allowed && allowed.has(toState));
}
function callRenderer(renderers, state, context, meta) {
  var fn = renderers[state];
  if (typeof fn === 'function') fn(context, meta);
  if (typeof renderers.onAny === 'function') renderers.onAny(state, context, meta);
}

/* exported via window.StateManagerModule */

function createStateManager(options) {
  options = options || {};
  var cfg = _objectSpread(_objectSpread({}, DEFAULTS), options || {});
  var renderers = cfg.renderers || {};
  var currentState = normalizeState(cfg.initialState) || STATES.IDLE;
  var lastContext = null;
  var currentVersion = 0;
  var syncTimer = 0;
  var bc = null;
  var tabId = getTabId();
  var processedIds = new Map();
  var actionLocks = new Map();
  function transitionTo(nextState) {
    var _meta$version;
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var next = normalizeState(nextState);
    if (!next) return false;
    var incomingVersion = Number((_meta$version = meta.version) !== null && _meta$version !== void 0 ? _meta$version : extractVersion(context, meta.ts || Date.now()));
    if (!meta.force && Number.isFinite(incomingVersion) && incomingVersion > 0 && incomingVersion < currentVersion) {
      // Ignore stale out-of-order transition to preserve monotonic state progression.
      return false;
    }
    var eventId = String(meta.eventId || '').trim();
    if (eventId) {
      if (processedIds.has(eventId)) return false;
      processedIds.set(eventId, Date.now());
      trimProcessedIds();
    }
    if (!meta.force && !canTransition(currentState, next)) {
      return false;
    }
    if (currentState === next) {
      // Idempotent: duplicate transition should not re-render heavy UI.
      return false;
    }
    var prev = currentState;
    currentState = next;
    lastContext = context;
    if (Number.isFinite(incomingVersion) && incomingVersion > 0) {
      currentVersion = Math.max(currentVersion, incomingVersion);
    } else {
      currentVersion = Math.max(currentVersion, Date.now());
    }
    callRenderer(renderers, currentState, context, meta);
    if (typeof cfg.onStateChange === 'function') {
      cfg.onStateChange(currentState, prev, context, meta);
    }
    if (!meta.silentBroadcast) {
      broadcastState({
        state: currentState,
        context: context,
        version: currentVersion,
        eventId: eventId,
        source: meta.source || 'local'
      });
    }
    return true;
  }
  function handleCriticalEvent(eventType) {
    var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var eventMeta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var type = String(eventType || '').trim().toLowerCase();
    var eventId = eventIdFrom(type, payload, eventMeta);

    // Opening box starts a state transition to waiting approval.
    if (type === 'approval') {
      var status = String((payload === null || payload === void 0 ? void 0 : payload.status) || (payload === null || payload === void 0 ? void 0 : payload.approvalStatus) || '').trim().toLowerCase();
      if (status === 'pending' || status === 'waiting' || status === 'pending_approval') {
        return transitionTo(STATES.WAITING_APPROVAL, payload, {
          source: 'sse-critical',
          eventType: type,
          eventId: eventId,
          version: extractVersion(payload, eventMeta === null || eventMeta === void 0 ? void 0 : eventMeta.ts)
        });
      }

      // Approval result must remove waiting state immediately.
      if (status === 'approved' || (payload === null || payload === void 0 ? void 0 : payload.approved) === true || (payload === null || payload === void 0 ? void 0 : payload.isApproved) === true) {
        var hasResult = !!(payload.result || payload.reward || payload.prize);
        if (hasResult) {
          return transitionTo(STATES.SHOW_RESULT, payload, {
            source: 'sse-critical',
            eventType: type,
            eventId: "".concat(eventId, ":result-fast"),
            version: extractVersion(payload, eventMeta === null || eventMeta === void 0 ? void 0 : eventMeta.ts),
            force: true
          });
        }
        var changed = transitionTo(STATES.APPROVED, payload, {
          source: 'sse-critical',
          eventType: type,
          eventId: "".concat(eventId, ":approved"),
          version: extractVersion(payload, eventMeta === null || eventMeta === void 0 ? void 0 : eventMeta.ts)
        });
        return changed;
      }
      if (status === 'rejected' || status === 'declined') {
        return transitionTo(STATES.IDLE, payload, {
          source: 'sse-critical',
          eventType: type,
          eventId: eventId,
          version: extractVersion(payload, eventMeta === null || eventMeta === void 0 ? void 0 : eventMeta.ts)
        });
      }
      return false;
    }
    if (type === 'box_result' || type === 'session_result') {
      // Critical result display should never be delayed.
      return transitionTo(STATES.SHOW_RESULT, payload, {
        source: 'sse-critical',
        eventType: type,
        eventId: "".concat(eventId, ":show-direct"),
        version: extractVersion(payload, eventMeta === null || eventMeta === void 0 ? void 0 : eventMeta.ts),
        force: true
      });
    }
    return false;
  }
  function syncNow() {
    if (typeof cfg.getSnapshot !== 'function') return Promise.resolve(false);
    return Promise.resolve().then(function () {
      return cfg.getSnapshot();
    }).then(function (snapshot) {
      var target = deriveStateFromSnapshot(snapshot);
      if (!target) return false;
      return transitionTo(target, snapshot, {
        source: 'poll-sync',
        force: true,
        eventId: "sync:".concat(target, ":").concat(String((snapshot === null || snapshot === void 0 ? void 0 : snapshot.updatedAt) || '')),
        version: extractVersion(snapshot, Date.now())
      });
    }).catch(function () {
      return false;
    });
  }
  function startBroadcastSync() {
    if (!cfg.enableBroadcastSync) return;
    if (typeof BroadcastChannel === 'undefined') return;
    if (bc) return;
    bc = new BroadcastChannel(cfg.channelName);
    bc.onmessage = function (event) {
      var data = event && event.data ? event.data : null;
      if (!data || data.kind !== 'state-transition') return;
      if (String(data.tabId || '') === tabId) return;
      var nextState = normalizeState(data.state);
      if (!nextState) return;
      transitionTo(nextState, data.context || {}, {
        source: 'broadcast',
        eventId: String(data.eventId || "bc:".concat(data.version || '')),
        version: Number(data.version || 0),
        force: true,
        silentBroadcast: true
      });
    };
  }
  function stopBroadcastSync() {
    if (!bc) return;
    bc.close();
    bc = null;
  }
  function broadcastState(message) {
    if (!bc) return;
    try {
      bc.postMessage({
        kind: 'state-transition',
        tabId: tabId,
        state: message.state,
        context: message.context || null,
        version: Number(message.version || currentVersion || Date.now()),
        eventId: String(message.eventId || ''),
        source: String(message.source || 'state-manager')
      });
    } catch (_) {}
  }
  function startSync() {
    stopSync();
    var interval = Math.max(3000, Math.min(5000, Number(cfg.syncIntervalMs) || 4000));
    syncTimer = setInterval(function () {
      syncNow().catch(function () {});
      trimProcessedIds();
    }, interval);
  }
  function stopSync() {
    if (!syncTimer) return;
    clearInterval(syncTimer);
    syncTimer = 0;
  }
  function trimProcessedIds() {
    var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now();
    var ttl = Math.max(30000, Number(cfg.dedupeTtlMs) || DEFAULTS.dedupeTtlMs);
    var threshold = now - ttl;
    var _iterator = _createForOfIteratorHelper(processedIds.entries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          id = _step$value[0],
          ts = _step$value[1];
        if (ts < threshold) processedIds.delete(id);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (processedIds.size > 3000) {
      var overflow = processedIds.size - 3000;
      var removed = 0;
      var _iterator2 = _createForOfIteratorHelper(processedIds.keys()),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var key = _step2.value;
          processedIds.delete(key);
          removed += 1;
          if (removed >= overflow) break;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    var _iterator3 = _createForOfIteratorHelper(actionLocks.entries()),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _step3$value = _slicedToArray(_step3.value, 2),
          _key = _step3$value[0],
          lock = _step3$value[1];
        if (!lock || Number(lock.expiresAt || 0) <= now) {
          actionLocks.delete(_key);
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }
  function getState() {
    return currentState;
  }
  function getContext() {
    return lastContext;
  }
  function reset() {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    currentState = STATES.IDLE;
    lastContext = context;
    currentVersion = Math.max(currentVersion, Date.now());
    callRenderer(renderers, currentState, context, {
      source: 'reset',
      force: true
    });
  }
  function acquireActionLock(actionKey) {
    var ttlMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3500;
    var key = String(actionKey || '').trim();
    if (!key) return true;
    var now = Date.now();
    trimProcessedIds(now);
    var existing = actionLocks.get(key);
    if (existing && Number(existing.expiresAt || 0) > now) {
      return false;
    }
    actionLocks.set(key, {
      acquiredAt: now,
      expiresAt: now + Math.max(200, Number(ttlMs) || 3500)
    });
    return true;
  }
  function releaseActionLock(actionKey) {
    var key = String(actionKey || '').trim();
    if (!key) return;
    actionLocks.delete(key);
  }
  function isActionLocked(actionKey) {
    var key = String(actionKey || '').trim();
    if (!key) return false;
    var now = Date.now();
    var lock = actionLocks.get(key);
    if (!lock) return false;
    if (Number(lock.expiresAt || 0) <= now) {
      actionLocks.delete(key);
      return false;
    }
    return true;
  }
  function getDebugInfo() {
    return {
      tabId: tabId,
      state: currentState,
      version: currentVersion,
      hasBroadcastChannel: !!bc,
      processedIds: processedIds.size,
      activeLocks: actionLocks.size,
      syncRunning: !!syncTimer,
      context: lastContext
    };
  }

  /* ── Visibility-based sync throttle ── */
  var _visibilityHandler = null;
  function bindVisibilityThrottle() {
    if (_visibilityHandler || typeof document === 'undefined') return;
    _visibilityHandler = function _visibilityHandler() {
      if (document.hidden) {
        stopSync();
      } else {
        startSync();
        syncNow().catch(function () {});
      }
    };
    document.addEventListener('visibilitychange', _visibilityHandler);
  }
  function unbindVisibilityThrottle() {
    if (!_visibilityHandler) return;
    document.removeEventListener('visibilitychange', _visibilityHandler);
    _visibilityHandler = null;
  }
  function dispose() {
    stopSync();
    stopBroadcastSync();
    unbindVisibilityThrottle();
    processedIds.clear();
    actionLocks.clear();
  }
  startBroadcastSync();
  bindVisibilityThrottle();
  if (cfg.enableDebug && typeof window !== 'undefined') {
    window.__lmbStateDebug = {
      getInfo: function getInfo() {
        return getDebugInfo();
      },
      getState: function getState() {
        return currentState;
      },
      getVersion: function getVersion() {
        return currentVersion;
      },
      forceTransition: function forceTransition(nextState) {
        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return transitionTo(nextState, context, {
          force: true,
          source: 'debug',
          eventId: "debug:".concat(Date.now())
        });
      }
    };
  }
  return {
    STATES: STATES,
    getState: getState,
    getDebugInfo: getDebugInfo,
    getContext: getContext,
    transitionTo: transitionTo,
    handleCriticalEvent: handleCriticalEvent,
    syncNow: syncNow,
    startSync: startSync,
    stopSync: stopSync,
    acquireActionLock: acquireActionLock,
    releaseActionLock: releaseActionLock,
    isActionLocked: isActionLocked,
    reset: reset,
    dispose: dispose
  };
}
window.StateManagerModule = {
  STATES: STATES,
  createStateManager: createStateManager
};