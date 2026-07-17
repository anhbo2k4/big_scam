(function initLmbEventBus(global) {
  if (global.LMBEventBus) return;

  const listeners = new Map();

  function on(type, handler) {
    if (!type || typeof handler !== 'function') {
      return function noop() {};
    }
    const key = String(type);
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(handler);
    return function off() {
      listeners.get(key)?.delete(handler);
    };
  }

  function emit(type, payload) {
    const key = String(type || '');
    const group = listeners.get(key);
    if (!group || group.size === 0) return;
    group.forEach((fn) => {
      try {
        fn(payload);
      } catch (_) {
        // Keep bus resilient: one consumer must not break others.
      }
    });
  }

  global.LMBEventBus = { on, emit };
})(window);
