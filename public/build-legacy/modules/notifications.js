(function initNotificationsModule(global) {
  global.LMBModules = global.LMBModules || {};
  if (global.LMBModules.notifications) return;
  var requested = false;
  function requestPermissionOnce() {
    if (requested || !('Notification' in global)) return;
    requested = true;
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(function ignore() {});
    }
  }
  function bindNotificationBus() {
    var bus = global.LMBEventBus;
    if (!bus || typeof bus.on !== 'function') return;
    bus.on('chat:new_message', function onMsg(payload) {
      if (!global.document.hidden) return;
      if (!('Notification' in global) || Notification.permission !== 'granted') return;
      var text = String(payload && payload.message || '').trim();
      if (!text) return;
      try {
        new Notification('New message', {
          body: text,
          icon: '/favicon.ico',
          tag: 'lmb-chat'
        });
      } catch (_) {}
    });
  }
  global.LMBModules.notifications = {
    init: function init() {
      requestPermissionOnce();
      bindNotificationBus();
      if (global.location && /localhost|127\.0\.0\.1/.test(global.location.hostname || '')) {
        console.log('[LMB][module] notifications ready');
      }
    }
  };
})(window);