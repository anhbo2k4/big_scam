const DEFAULTS = {
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

  const cfg = { ...DEFAULTS, ...(options || {}) };
  let running = false;
  let rafId = 0;
  let hidden = !!document.hidden;
  let avgEventCostMs = 0.22;
  let slowEventCostMs = 0.5;
  let warmupFramesLeft = 0;
  let cleanupTimerId = 0;
  let idleCleanupHandle = 0;

  const visHandler = () => {
    hidden = !!document.hidden;
    if (hidden) {
      queue.trimForHidden?.(cfg.hiddenQueueCap);
      cancel();
      return;
    }
    warmupFramesLeft = cfg.resumeWarmupFrames;
    schedule();
  };

  document.addEventListener('visibilitychange', visHandler, { passive: true });

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

    const totalBefore = queue.size();
    if (totalBefore > cfg.emergencyQueueThreshold && typeof queue.trimForOverload === 'function') {
      queue.trimForOverload(cfg.emergencyTargetCap);
    } else if (totalBefore > cfg.overloadQueueThreshold && typeof queue.trimForOverload === 'function') {
      queue.trimForOverload(cfg.overloadTargetCap);
    }

    const start = performance.now();
    const frameBudget = computeFrameBudget(queue.size(), cfg.frameBudgetMs);
    const maxEvents = Math.max(1, Number(cfg.maxEventsPerFrame) || 50);
    const minEvents = Math.max(1, Number(cfg.minEventsPerFrame) || 10);
    const queueSize = queue.size();
    const adaptiveLimit = computeAdaptiveBatchSize(queueSize, minEvents, maxEvents, frameBudget);

    const highSize = typeof queue.sizeHigh === 'function' ? queue.sizeHigh() : queueSize;
    const lowSize = typeof queue.sizeLow === 'function' ? queue.sizeLow() : Math.max(0, queueSize - highSize);

    const overload = queueSize > cfg.overloadQueueThreshold;
    const highRatio = queueSize > 0 ? (highSize / queueSize) : 1;
    const highReserve = clamp(
      Math.round(adaptiveLimit * Math.max(cfg.highPriorityReserveRatio, highRatio)),
      1,
      adaptiveLimit
    );
    const lowAllowance = overload ? Math.min(2, Math.max(0, adaptiveLimit - highReserve)) : Math.max(1, adaptiveLimit - highReserve);

    let processed = 0;
    let processedHigh = 0;
    let processedLow = 0;
    while (processed < adaptiveLimit) {
      const elapsedBeforeTake = performance.now() - start;
      const remaining = frameBudget - elapsedBeforeTake;
      // Always allow at least one event, but avoid starting expensive extra work
      // when the frame budget is almost exhausted.
      if (processed > 0 && remaining <= minRemainingBudget()) break;

      let prefer = 'high';
      if (lowSize > 0 && processedLow < lowAllowance && processedHigh >= highReserve) {
        prefer = 'low';
      }
      const evt = queue.takeNext({ prefer });
      if (!evt) break;

      const eventStart = performance.now();
      renderer(evt);
      const eventCost = performance.now() - eventStart;
      processed += 1;
      if (evt.priority === 'high') processedHigh += 1;
      else processedLow += 1;

      slowEventCostMs = (slowEventCostMs * 0.9) + (Math.max(eventCost, avgEventCostMs) * 0.1);

      const elapsed = performance.now() - start;
      if (elapsed >= frameBudget) break;
    }

    if (processed > 0) {
      const elapsed = performance.now() - start;
      const cost = elapsed / processed;
      avgEventCostMs = (avgEventCostMs * 0.85) + (cost * 0.15);
    }

    if (queue.size() > 0) schedule();
  }

  function computeAdaptiveBatchSize(queueLen, minEvents, maxEvents, frameBudget) {
    // Small queues should not force large batches.
    const effectiveMin = queueLen <= 5 ? 1 : minEvents;

    let depthTarget = effectiveMin;
    if (queueLen > 900) depthTarget = maxEvents;
    else if (queueLen > 500) depthTarget = Math.round(maxEvents * 0.94);
    else if (queueLen > 280) depthTarget = Math.round(maxEvents * 0.88);
    else if (queueLen > 180) depthTarget = Math.round(maxEvents * 0.8);
    else if (queueLen > 90) depthTarget = Math.round(maxEvents * 0.68);
    else if (queueLen > 30) depthTarget = Math.round(maxEvents * 0.5);
    else if (queueLen > 12) depthTarget = Math.round(maxEvents * 0.34);

    // Use the slower moving estimate to prevent optimistic overshoot after spikes.
    const safeCost = Math.max(0.08, Math.max(avgEventCostMs, slowEventCostMs * 0.7));
    const budgetTarget = Math.floor((frameBudget - minRemainingBudget()) / safeCost);
    let limit = clamp(Math.min(depthTarget, budgetTarget), effectiveMin, maxEvents);

    // Warmup after tab visibility restore to avoid sudden burst rendering.
    if (warmupFramesLeft > 0) {
      warmupFramesLeft -= 1;
      limit = Math.min(limit, Math.max(effectiveMin, 10));
    }

    return limit;
  }

  function computeFrameBudget(queueLen, baseBudget) {
    const base = clamp(Number(baseBudget) || 7, 6, 8);
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
    const runCleanup = () => {
      if (!running) return;
      if (typeof queue.cleanup === 'function') {
        queue.cleanup(Date.now());
      }
      scheduleIdleCleanup();
    };

    if (typeof requestIdleCallback === 'function') {
      const idleRunner = () => {
        if (!running) return;
        idleCleanupHandle = requestIdleCallback(() => {
          runCleanup();
        }, { timeout: cfg.idleCleanupIntervalMs });
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

  let scheduleIdleCleanup = () => {};

  return {
    start,
    stop,
    dispose,
    schedule,
    stats: () => ({
      avgEventCostMs,
      slowEventCostMs,
      queueSize: queue.size(),
      hidden,
      running
    })
  };
}

window.SchedulerModule = { createAdaptiveScheduler: createAdaptiveScheduler };
