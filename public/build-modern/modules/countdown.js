(function initCountdownModule(global) {
  global.LMBModules = global.LMBModules || {};
  if (global.LMBModules.countdown) return;

  function startTickBus() {
    if (global.__lmbGlobalTickTimer) return;
    const bus = global.LMBEventBus;
    if (!bus || typeof bus.emit !== 'function') return;

    global.__lmbGlobalTickTimer = setInterval(function everySecond() {
      bus.emit('app:tick', { now: Date.now() });
    }, 1000);
  }

  global.LMBModules.countdown = {
    init: function init() {
      startTickBus();
      if (global.location && /localhost|127\.0\.0\.1/.test(global.location.hostname || '')) {
        console.log('[LMB][module] countdown ready');
      }
    }
  };
})(window);
