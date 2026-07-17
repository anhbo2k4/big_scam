function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DEFAULTS = {
  frameBudgetMs: 7,
  maxEventsPerFrame: 70,
  minEventsPerFrame: 10,
  hiddenQueueCap: 120,
  resumeWarmupFrames: 4,
  idleCleanupIntervalMs: 20000,
  minRemainingBudgetMs: 0.4,
  overloadQueueThreshold: 260,
  emergencyQueueThreshold: 700,
  overloadTargetCap: 420,
  emergencyTargetCap: 520,
  highPriorityReserveRatio: 0.72
};
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function createAdaptiveScheduler(queue, renderer, options) {
  options = options || {};
  if (!queue || typeof queue.takeNext !== 'function') {
    throw new Error('Scheduler requires a queue with takeNext()');
  }
  if (typeof renderer !== 'function') {
    throw new Error('Scheduler requires a renderer callback');
  }
  var cfg = _objectSpread(_objectSpread({}, DEFAULTS), options || {});
  var running = false;
  var rafId = 0;
  var hidden = !!document.hidden;
  var avgEventCostMs = 0.22;
  var slowEventCostMs = 0.5;
  var warmupFramesLeft = 0;
  var cleanupTimerId = 0;
  var idleCleanupHandle = 0;
  var visHandler = function visHandler() {
    hidden = !!document.hidden;
    if (hidden) {
      var _queue$trimForHidden;
      (_queue$trimForHidden = queue.trimForHidden) === null || _queue$trimForHidden === void 0 || _queue$trimForHidden.call(queue, cfg.hiddenQueueCap);
      cancel();
      return;
    }
    warmupFramesLeft = cfg.resumeWarmupFrames;
    schedule();
  };
  document.addEventListener('visibilitychange', visHandler, {
    passive: true
  });
  function start() {
    running = true;
    startCleanupLoop();
    if (!hidden) schedule();
  }
  function stop() {
    running = false;
    cancel();
    stopCleanupLoop();
  }
  function dispose() {
    stop();
    document.removeEventListener('visibilitychange', visHandler);
  }
  function schedule() {
    if (!running || hidden || rafId) return;
    if (queue.size() < 1) return;
    rafId = requestAnimationFrame(flushFrame);
  }
  function cancel() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  function flushFrame() {
    rafId = 0;
    if (!running || hidden) return;
    var totalBefore = queue.size();
    if (totalBefore > cfg.emergencyQueueThreshold && typeof queue.trimForOverload === 'function') {
      queue.trimForOverload(cfg.emergencyTargetCap);
    } else if (totalBefore > cfg.overloadQueueThreshold && typeof queue.trimForOverload === 'function') {
      queue.trimForOverload(cfg.overloadTargetCap);
    }
    var start = performance.now();
    var frameBudget = computeFrameBudget(queue.size(), cfg.frameBudgetMs);
    var maxEvents = Math.max(1, Number(cfg.maxEventsPerFrame) || 50);
    var minEvents = Math.max(1, Number(cfg.minEventsPerFrame) || 10);
    var queueSize = queue.size();
    var adaptiveLimit = computeAdaptiveBatchSize(queueSize, minEvents, maxEvents, frameBudget);
    var highSize = typeof queue.sizeHigh === 'function' ? queue.sizeHigh() : queueSize;
    var lowSize = typeof queue.sizeLow === 'function' ? queue.sizeLow() : Math.max(0, queueSize - highSize);
    var overload = queueSize > cfg.overloadQueueThreshold;
    var highRatio = queueSize > 0 ? highSize / queueSize : 1;
    var highReserve = clamp(Math.round(adaptiveLimit * Math.max(cfg.highPriorityReserveRatio, highRatio)), 1, adaptiveLimit);
    var lowAllowance = overload ? Math.min(2, Math.max(0, adaptiveLimit - highReserve)) : Math.max(1, adaptiveLimit - highReserve);
    var processed = 0;
    var processedHigh = 0;
    var processedLow = 0;
    while (processed < adaptiveLimit) {
      var elapsedBeforeTake = performance.now() - start;
      var remaining = frameBudget - elapsedBeforeTake;
      // Always allow at least one event, but avoid starting expensive extra work
      // when the frame budget is almost exhausted.
      if (processed > 0 && remaining <= minRemainingBudget()) break;
      var prefer = 'high';
      if (lowSize > 0 && processedLow < lowAllowance && processedHigh >= highReserve) {
        prefer = 'low';
      }
      var evt = queue.takeNext({
        prefer: prefer
      });
      if (!evt) break;
      var eventStart = performance.now();
      renderer(evt);
      var eventCost = performance.now() - eventStart;
      processed += 1;
      if (evt.priority === 'high') processedHigh += 1;else processedLow += 1;
      slowEventCostMs = slowEventCostMs * 0.9 + Math.max(eventCost, avgEventCostMs) * 0.1;
      var elapsed = performance.now() - start;
      if (elapsed >= frameBudget) break;
    }
    if (processed > 0) {
      var _elapsed = performance.now() - start;
      var cost = _elapsed / processed;
      avgEventCostMs = avgEventCostMs * 0.85 + cost * 0.15;
    }
    if (queue.size() > 0) schedule();
  }
  function computeAdaptiveBatchSize(queueLen, minEvents, maxEvents, frameBudget) {
    // Small queues should not force large batches.
    var effectiveMin = queueLen <= 5 ? 1 : minEvents;
    var depthTarget = effectiveMin;
    if (queueLen > 900) depthTarget = maxEvents;else if (queueLen > 500) depthTarget = Math.round(maxEvents * 0.94);else if (queueLen > 280) depthTarget = Math.round(maxEvents * 0.88);else if (queueLen > 180) depthTarget = Math.round(maxEvents * 0.8);else if (queueLen > 90) depthTarget = Math.round(maxEvents * 0.68);else if (queueLen > 30) depthTarget = Math.round(maxEvents * 0.5);else if (queueLen > 12) depthTarget = Math.round(maxEvents * 0.34);

    // Use the slower moving estimate to prevent optimistic overshoot after spikes.
    var safeCost = Math.max(0.08, Math.max(avgEventCostMs, slowEventCostMs * 0.7));
    var budgetTarget = Math.floor((frameBudget - minRemainingBudget()) / safeCost);
    var limit = clamp(Math.min(depthTarget, budgetTarget), effectiveMin, maxEvents);

    // Warmup after tab visibility restore to avoid sudden burst rendering.
    if (warmupFramesLeft > 0) {
      warmupFramesLeft -= 1;
      limit = Math.min(limit, Math.max(effectiveMin, 10));
    }
    return limit;
  }
  function computeFrameBudget(queueLen, baseBudget) {
    var base = clamp(Number(baseBudget) || 7, 6, 8);
    if (queueLen > 700) return 8;
    if (queueLen > 250) return 7.8;
    if (queueLen > 90) return Math.min(8, base + 0.6);
    if (queueLen < 12) return Math.max(6, base - 0.5);
    return base;
  }
  function minRemainingBudget() {
    return clamp(Number(cfg.minRemainingBudgetMs) || 0.4, 0.2, 1.2);
  }
  function startCleanupLoop() {
    stopCleanupLoop();
    var runCleanup = function runCleanup() {
      if (!running) return;
      if (typeof queue.cleanup === 'function') {
        queue.cleanup(Date.now());
      }
      scheduleIdleCleanup();
    };
    if (typeof requestIdleCallback === 'function') {
      var idleRunner = function idleRunner() {
        if (!running) return;
        idleCleanupHandle = requestIdleCallback(function () {
          runCleanup();
        }, {
          timeout: cfg.idleCleanupIntervalMs
        });
      };
      scheduleIdleCleanup = idleRunner;
      idleRunner();
      return;
    }
    cleanupTimerId = setInterval(runCleanup, cfg.idleCleanupIntervalMs);
  }
  function stopCleanupLoop() {
    if (cleanupTimerId) {
      clearInterval(cleanupTimerId);
      cleanupTimerId = 0;
    }
    if (idleCleanupHandle && typeof cancelIdleCallback === 'function') {
      cancelIdleCallback(idleCleanupHandle);
      idleCleanupHandle = 0;
    }
  }
  var scheduleIdleCleanup = function scheduleIdleCleanup() {};
  return {
    start: start,
    stop: stop,
    dispose: dispose,
    schedule: schedule,
    stats: function stats() {
      return {
        avgEventCostMs: avgEventCostMs,
        slowEventCostMs: slowEventCostMs,
        queueSize: queue.size(),
        hidden: hidden,
        running: running
      };
    }
  };
}
window.SchedulerModule = {
  createAdaptiveScheduler: createAdaptiveScheduler
};