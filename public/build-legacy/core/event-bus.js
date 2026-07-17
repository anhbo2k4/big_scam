(function initLmbEventBus(global) {
  if (global.LMBEventBus) return;
  var listeners = new Map();
  function on(type, handler) {
    if (!type || typeof handler !== 'function') {
      return function noop() {};
    }
    var key = String(type);
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(handler);
    return function off() {
      var _listeners$get;
      (_listeners$get = listeners.get(key)) === null || _listeners$get === void 0 || _listeners$get.delete(handler);
    };
  }
  function emit(type, payload) {
    var key = String(type || '');
    var group = listeners.get(key);
    if (!group || group.size === 0) return;
    group.forEach(function (fn) {
      try {
        fn(payload);
      } catch (_) {
        // Keep bus resilient: one consumer must not break others.
      }
    });
  }
  global.LMBEventBus = {
    on: on,
    emit: emit
  };
})(window);