(function initHistoryModule(global) {
  global.LMBModules = global.LMBModules || {};
  if (global.LMBModules.history) return;

  global.LMBModules.history = {
    init: function init() {
      const isMobile = !!(global.matchMedia && global.matchMedia('(max-width: 768px)').matches);
      if (isMobile) return;
      if (global.__lmbHooks && typeof global.__lmbHooks.ensureHistoryUi === 'function') {
        global.__lmbHooks.ensureHistoryUi().catch(function ignore() {});
      }
      if (global.location && /localhost|127\.0\.0\.1/.test(global.location.hostname || '')) {
        console.log('[LMB][module] history ready');
      }
    }
  };
})(window);
