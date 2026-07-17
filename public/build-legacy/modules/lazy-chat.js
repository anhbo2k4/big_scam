(function initLazyChatModule(global) {
  if (global.__lmbLazyChatReady) return;
  global.__lmbLazyChatReady = true;
  function safe(fn) {
    if (typeof fn !== 'function') return;
    try {
      fn();
    } catch (_) {}
  }
  safe(function () {
    return global.setChatReadyUI(false);
  });
  safe(global.initChatWidgetNotificationRuntime);
  global.dispatchEvent(new CustomEvent('lmb:module-chat-ready'));
})(window);