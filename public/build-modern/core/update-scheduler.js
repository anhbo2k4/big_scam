(function initLmbUpdateScheduler(global) {
  if (global.LMBUpdateScheduler) return;

  const queuedCoalesced = new Map();
  const queuedOrdered = [];
  let rafId = 0;
  let timer = null;
  let lastFlushAt = 0;
  let paused = false;
  const DEFAULT_WAIT_MS = 120;
  const MAX_BATCH_SIZE = 24;

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
    rafId = global.requestAnimationFrame(() => {
      rafId = 0;
      flush();
    });
  }

  function scheduleFlush(delay) {
    const waitMs = Math.max(0, Number(delay || DEFAULT_WAIT_MS));
    const now = Date.now();
    const elapsed = now - lastFlushAt;

    if (elapsed >= waitMs) {
      cancelTimer();
      scheduleRafFlush();
      return;
    }

    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      scheduleRafFlush();
    }, waitMs - elapsed);
  }

  function drainBatch(list, batchSize) {
    const out = [];
    while (out.length < batchSize && list.length > 0) {
      out.push(list.shift());
    }
    return out;
  }

  function flush(force) {
    cancelTimer();
    lastFlushAt = Date.now();

    if (!force && (paused || (typeof document !== 'undefined' && document.hidden))) {
      if (hasPendingEvents()) scheduleFlush(DEFAULT_WAIT_MS);
      return;
    }

    const coalescedSnapshot = Array.from(queuedCoalesced.values()).slice(0, MAX_BATCH_SIZE);
    for (let i = 0; i < coalescedSnapshot.length; i += 1) {
      const item = coalescedSnapshot[i];
      if (item && item.key) queuedCoalesced.delete(item.key);
    }

    const orderedSnapshot = drainBatch(queuedOrdered, MAX_BATCH_SIZE);

    for (let i = 0; i < coalescedSnapshot.length; i += 1) {
      const item = coalescedSnapshot[i];
      try {
        item.apply(item.payload);
      } catch (_) {
        // Keep scheduler fault-tolerant.
      }
    }

    for (let i = 0; i < orderedSnapshot.length; i += 1) {
      const item = orderedSnapshot[i];
      try {
        item.apply(item.payload);
      } catch (_) {
        // Keep scheduler fault-tolerant.
      }
    }

    if (hasPendingEvents()) scheduleFlush(DEFAULT_WAIT_MS);
  }

  function schedule(key, payload, apply, waitMs, options) {
    if (!key || typeof apply !== 'function') return;

    const opts = options || {};
    const delay = Math.max(0, Number(waitMs || DEFAULT_WAIT_MS));
    const coalesce = opts.coalesce !== false;

    if (coalesce) {
      const normalizedKey = String(key);
      queuedCoalesced.set(normalizedKey, { key: normalizedKey, payload: payload, apply: apply });
    } else {
      queuedOrdered.push({ payload: payload, apply: apply });
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
