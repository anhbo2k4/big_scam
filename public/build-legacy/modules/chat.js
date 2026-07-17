(function initChatModule(global) {
  global.LMBModules = global.LMBModules || {};
  if (global.LMBModules.chat) return;
  var started = false;
  var startPromise = null;
  function startRuntimeSafe() {
    if (!global.__lmbHooks || typeof global.__lmbHooks.startChatRuntime !== 'function') {
      return Promise.resolve(false);
    }
    if (startPromise) return startPromise;
    startPromise = global.__lmbHooks.startChatRuntime().then(function ok() {
      started = true;
      return true;
    }).catch(function failed() {
      started = false;
      return false;
    }).finally(function done() {
      startPromise = null;
    });
    return startPromise;
  }
  function bindOpenTrigger() {
    var trigger = document.getElementById('chatFabBtn') || document.getElementById('chatFab');
    if (!trigger) return;
    if (trigger.dataset.moduleChatBound === '1') return;
    trigger.dataset.moduleChatBound = '1';
    trigger.addEventListener('click', function onOpen() {
      startRuntimeSafe().catch(function ignore() {});
    }, {
      passive: true
    });
  }
  global.LMBModules.chat = {
    init: function init() {
      bindOpenTrigger();
      if (!started) {
        startRuntimeSafe().catch(function ignore() {});
      }
      if (global.location && /localhost|127\.0\.0\.1/.test(global.location.hostname || '')) {
        console.log('[LMB][module] chat ready');
      }
    }
  };
})(window);