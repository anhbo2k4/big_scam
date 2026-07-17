(function initPerfMonitor() {
  var host = String(location.hostname || '').toLowerCase();
  var isDevHost = host === 'localhost' || host === '127.0.0.1';
  if (!isDevHost) return;
  var enabled = false;
  try {
    var qp = new URLSearchParams(window.location.search);
    if (qp.get('perfdebug') === '1' || qp.get('rtdebug') === '1') enabled = true;
    if (!enabled) {
      var ls = localStorage.getItem('lmb:perf:debug');
      enabled = ls === '1' || ls === 'true';
    }
  } catch (_) {}
  if (!enabled && window.__LMB_PERF_DEBUG !== true) return;
  var sampleIntervalMs = 3000;
  var warnCooldownMs = 30000;
  var fpsLogIntervalMs = 15000;
  var domWarnThreshold = Number(window.__LMB_PERF_DOM_WARN_THRESHOLD || 1600);
  var verbose = false;
  try {
    var _qp = new URLSearchParams(window.location.search);
    if (_qp.get('perfverbose') === '1') verbose = true;
    if (!verbose) {
      var lsVerbose = localStorage.getItem('lmb:perf:verbose');
      verbose = lsVerbose === '1' || lsVerbose === 'true';
    }
  } catch (_) {}
  var last = performance.now();
  var frames = 0;
  var fps = 0;
  var lastWarnAt = 0;
  var lastFpsLogAt = 0;
  function tick(now) {
    frames += 1;
    if (now - last >= sampleIntervalMs) {
      fps = frames;
      frames = 0;
      last = now;
      var nodeCount = document.getElementsByTagName('*').length;
      if (nodeCount > domWarnThreshold && now - lastWarnAt >= warnCooldownMs) {
        lastWarnAt = now;
        console.warn('[PERF] DOM node count is high:', nodeCount);
      }
      if (verbose && now - lastFpsLogAt >= fpsLogIntervalMs) {
        lastFpsLogAt = now;
        console.log('[PERF] fps=%s domNodes=%s', fps, nodeCount);
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();