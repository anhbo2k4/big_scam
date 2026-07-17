(function initLmbModuleLoader(global) {
  if (global.moduleLoader) return;

  const loadedScripts = new Set();
  const moduleInit = new Set();
  const pending = new Map();

  const moduleScripts = {
    'game-board': '/js/modules/game-board.js',
    'countdown': '/js/modules/countdown.js',
    'wallet': '/js/modules/wallet.js',
    'chat': '/js/modules/chat.js',
    'history': '/js/modules/history.js',
    'inventory': '/js/modules/inventory.js',
    'notifications': '/js/modules/notifications.js'
  };

  function loadScriptOnce(url) {
    if (!url) return Promise.resolve(true);
    if (loadedScripts.has(url)) return Promise.resolve(true);

    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-lmb-module-src="' + url + '"]');
      if (existing) {
        loadedScripts.add(url);
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.dataset.lmbModuleSrc = url;
      script.onload = function onLoad() {
        loadedScripts.add(url);
        resolve(true);
      };
      script.onerror = function onErr() {
        reject(new Error('Module script load failed: ' + url));
      };
      document.head.appendChild(script);
    });
  }

  async function ensure(name) {
    const key = String(name || '').trim().toLowerCase();
    if (!key) return false;

    if (pending.has(key)) return pending.get(key);

    const task = (async () => {
      if (global.lmbLazyModules && (key === 'wallet' || key === 'chat' || key === 'history' || key === 'admin-status')) {
        try { await global.lmbLazyModules.ensure(key); } catch (_) {}
      }

      const scriptUrl = moduleScripts[key];
      if (scriptUrl) {
        await loadScriptOnce(scriptUrl);
      }

      const modules = global.LMBModules || {};
      const mod = modules[key];
      if (mod && typeof mod.init === 'function' && !moduleInit.has(key)) {
        mod.init();
        moduleInit.add(key);
      }

      return true;
    })().finally(() => {
      pending.delete(key);
    });

    pending.set(key, task);
    return task;
  }

  function preloadMobileDefaults() {
    const isMobile = !!(global.matchMedia && global.matchMedia('(max-width: 768px)').matches);
    const defaults = isMobile
      ? ['game-board', 'countdown', 'wallet', 'chat', 'notifications']
      : ['game-board', 'countdown', 'wallet', 'chat', 'notifications'];

    const run = function run() {
      defaults.forEach((name) => {
        ensure(name).catch(function ignore() {});
      });
    };

    if (typeof global.requestIdleCallback === 'function') {
      global.requestIdleCallback(run, { timeout: 1200 });
      return;
    }
    setTimeout(run, 250);
  }

  global.moduleLoader = {
    ensure: ensure,
    preloadMobileDefaults: preloadMobileDefaults
  };
})(window);
