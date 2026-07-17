(function initLmbUpdateScheduler(global) {
  if (global.LMBUpdateScheduler) return;
  var queuedCoalesced = new Map();
  var queuedOrdered = [];
  var rafId = 0;
  var timer = null;
  var lastFlushAt = 0;
  var paused = false;
  var DEFAULT_WAIT_MS = 120;
  var MAX_BATCH_SIZE = 24;
  function hasPendingEvents() {
    return queuedCoalesced.size > 0 || queuedOrdered.length > 0;
  }
  function cancelTimer() {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
  }
  function scheduleRafFlush() {
    if (rafId) return;
    rafId = global.requestAnimationFrame(function () {
      rafId = 0;
      flush();
    });
  }
  function scheduleFlush(delay) {
    var waitMs = Math.max(0, Number(delay || DEFAULT_WAIT_MS));
    var now = Date.now();
    var elapsed = now - lastFlushAt;
    if (elapsed >= waitMs) {
      cancelTimer();
      scheduleRafFlush();
      return;
    }
    if (timer) return;
    timer = setTimeout(function () {
      timer = null;
      scheduleRafFlush();
    }, waitMs - elapsed);
  }
  function drainBatch(list, batchSize) {
    var out = [];
    while (out.length < batchSize && list.length > 0) {
      out.push(list.shift());
    }
    return out;
  }
  function flush(force) {
    cancelTimer();
    lastFlushAt = Date.now();
    if (!force && (paused || typeof document !== 'undefined' && document.hidden)) {
      if (hasPendingEvents()) scheduleFlush(DEFAULT_WAIT_MS);
      return;
    }
    var coalescedSnapshot = Array.from(queuedCoalesced.values()).slice(0, MAX_BATCH_SIZE);
    for (var i = 0; i < coalescedSnapshot.length; i += 1) {
      var item = coalescedSnapshot[i];
      if (item && item.key) queuedCoalesced.delete(item.key);
    }
    var orderedSnapshot = drainBatch(queuedOrdered, MAX_BATCH_SIZE);
    for (var _i = 0; _i < coalescedSnapshot.length; _i += 1) {
      var _item = coalescedSnapshot[_i];
      try {
        _item.apply(_item.payload);
      } catch (_) {
        // Keep scheduler fault-tolerant.
      }
    }
    for (var _i2 = 0; _i2 < orderedSnapshot.length; _i2 += 1) {
      var _item2 = orderedSnapshot[_i2];
      try {
        _item2.apply(_item2.payload);
      } catch (_) {
        // Keep scheduler fault-tolerant.
      }
    }
    if (hasPendingEvents()) scheduleFlush(DEFAULT_WAIT_MS);
  }
  function schedule(key, payload, apply, waitMs, options) {
    if (!key || typeof apply !== 'function') return;
    var opts = options || {};
    var delay = Math.max(0, Number(waitMs || DEFAULT_WAIT_MS));
    var coalesce = opts.coalesce !== false;
    if (coalesce) {
      var normalizedKey = String(key);
      queuedCoalesced.set(normalizedKey, {
        key: normalizedKey,
        payload: payload,
        apply: apply
      });
    } else {
      queuedOrdered.push({
        payload: payload,
        apply: apply
      });
    }
    scheduleFlush(delay);
  }
  function setPaused(nextPaused) {
    paused = !!nextPaused;
    if (!paused) {
      flush(true);
    } else if (hasPendingEvents()) {
      scheduleFlush(DEFAULT_WAIT_MS);
    }
  }
  function flushNow() {
    flush(true);
  }
  global.LMBUpdateScheduler = {
    schedule: schedule,
    setPaused: setPaused,
    flushNow: flushNow
  };
})(window);