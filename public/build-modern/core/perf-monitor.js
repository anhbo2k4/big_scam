(function initPerfMonitor() {
  const host = String(location.hostname || '').toLowerCase();
  const isDevHost = host === 'localhost' || host === '127.0.0.1';
  if (!isDevHost) return;

  let enabled = false;
  try {
    const qp = new URLSearchParams(window.location.search);
    if (qp.get('perfdebug') === '1' || qp.get('rtdebug') === '1') enabled = true;
    if (!enabled) {
      const ls = localStorage.getItem('lmb:perf:debug');
      enabled = ls === '1' || ls === 'true';
    }
  } catch (_) {}
  if (!enabled && window.__LMB_PERF_DEBUG !== true) return;

  const sampleIntervalMs = 3000;
  const warnCooldownMs = 30000;
  const fpsLogIntervalMs = 15000;
  const domWarnThreshold = Number(window.__LMB_PERF_DOM_WARN_THRESHOLD || 1600);

  let verbose = false;
  try {
    const qp = new URLSearchParams(window.location.search);
    if (qp.get('perfverbose') === '1') verbose = true;
    if (!verbose) {
      const lsVerbose = localStorage.getItem('lmb:perf:verbose');
      verbose = lsVerbose === '1' || lsVerbose === 'true';
    }
  } catch (_) {}

  let last = performance.now();
  let frames = 0;
  let fps = 0;
  let lastWarnAt = 0;
  let lastFpsLogAt = 0;

  function tick(now) {
    frames += 1;
    if (now - last >= sampleIntervalMs) {
      fps = frames;
      frames = 0;
      last = now;
      const nodeCount = document.getElementsByTagName('*').length;
      if (nodeCount > domWarnThreshold && (now - lastWarnAt) >= warnCooldownMs) {
        lastWarnAt = now;
        console.warn('[PERF] DOM node count is high:', nodeCount);
      }
      if (verbose && (now - lastFpsLogAt) >= fpsLogIntervalMs) {
        lastFpsLogAt = now;
        console.log('[PERF] fps=%s domNodes=%s', fps, nodeCount);
      }
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
