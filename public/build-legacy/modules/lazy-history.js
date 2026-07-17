(function initLazyHistoryModule(global) {
  if (global.__lmbLazyHistoryReady) return;
  global.__lmbLazyHistoryReady = true;
  function safe(fn) {
    if (typeof fn !== 'function') return;
    try {
      fn();
    } catch (_) {}
  }
  safe(global.refreshTransactions);
  global.dispatchEvent(new CustomEvent('lmb:module-history-ready'));
})(window);