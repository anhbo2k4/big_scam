(function initLmbLazyModules(global) {
  if (global.lmbLazyModules) return;

  const loaded = new Set();
  const loading = new Map();
  const loadedScripts = new Set();

  const moduleMap = {
    wallet: { endpoint: '/ui/fragments/wallet', rootId: 'lazyWalletModule', script: '/js/modules/lazy-wallet.js' },
    chat: { endpoint: '/ui/fragments/chat', rootId: 'lazyChatModule', script: '/js/modules/lazy-chat.js' },
    history: { endpoint: '/ui/fragments/history', rootId: 'lazyHistoryModule', script: '/js/modules/lazy-history.js' },
    'admin-status': { endpoint: '/ui/fragments/admin-status', rootId: 'lazyAdminStatusModule', script: '/js/modules/lazy-admin-status.js' }
  };

  function loadScriptOnce(url) {
    const key = String(url || '').trim();
    if (!key) return Promise.resolve(true);
    if (loadedScripts.has(key)) return Promise.resolve(true);

    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-lmb-lazy-module="${key}"]`);
      if (existing) {
        loadedScripts.add(key);
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = key;
      script.async = true;
      script.dataset.lmbLazyModule = key;
      script.onload = () => {
        loadedScripts.add(key);
        resolve(true);
      };
      script.onerror = () => reject(new Error('Failed to load module script'));
      document.head.appendChild(script);
    });
  }

  function hasModule(name) {
    return loaded.has(String(name || '').toLowerCase());
  }

  async function ensure(name) {
    const key = String(name || '').toLowerCase();
    const cfg = moduleMap[key];
    if (!cfg) throw new Error('Unknown lazy module');
    if (loaded.has(key)) return true;
    if (loading.has(key)) return loading.get(key);

    const promise = (async () => {
      const root = document.getElementById(cfg.rootId);
      if (!root) return false;

      const html = await fetch(cfg.endpoint, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      }).then((res) => {
        if (!res.ok) throw new Error('Fragment request failed');
        return res.text();
      });

      root.innerHTML = html;
      root.dataset.loaded = '1';

      if (cfg.script) {
        await loadScriptOnce(cfg.script);
      }

      loaded.add(key);
      loading.delete(key);
      global.dispatchEvent(new CustomEvent('lmb:module-loaded', { detail: { name: key } }));
      return true;
    })().catch((err) => {
      loading.delete(key);
      throw err;
    });

    loading.set(key, promise);
    return promise;
  }

  function preloadDefault() {
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const preloadKeys = isMobile ? ['wallet', 'chat'] : ['wallet', 'chat'];

    const kick = () => {
      preloadKeys.forEach((key) => {
        ensure(key).catch(() => {});
      });
    };

    if (typeof global.requestIdleCallback === 'function') {
      global.requestIdleCallback(kick, { timeout: 1200 });
    } else {
      setTimeout(kick, 700);
    }
  }

  global.lmbLazyModules = {
    ensure,
    hasModule,
    preloadDefault
  };
})(window);
