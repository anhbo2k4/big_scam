(function initWalletModule(global) {
  global.LMBModules = global.LMBModules || {};
  if (global.LMBModules.wallet) return;

  let booted = false;
  let refreshDebounceTimer = null;
  let refreshInFlight = false;
  let pendingRefresh = false;
  const MIN_REFRESH_INTERVAL_MS = 2500;
  let lastRefreshAt = 0;

  function shouldHandleWalletEvent(payload) {
    const coreManaged = !!(global.__lmbHooks && global.__lmbHooks.realtimeManagedByCore);
    if (coreManaged) return false;

    const p = payload && typeof payload === 'object' ? payload : {};
    const nested = p.payload && typeof p.payload === 'object' ? p.payload : {};
    const reason = String(nested.reason || p.reason || '').trim().toLowerCase();
    const status = String(nested.status || p.status || '').trim().toLowerCase();

    if (!reason) return false;

    if (reason === 'withdrawal_status_updated') return status === 'approved' || status === 'rejected';
    if (reason === 'conversion_status_updated') return status === 'approved' || status === 'rejected';
    if (reason === 'gift_status_updated') return false;
    return false;
  }

  function scheduleWalletRefresh() {
    if (!global.__lmbHooks || typeof global.__lmbHooks.refreshWalletBundle !== 'function') return;
    if (refreshInFlight) {
      pendingRefresh = true;
      return;
    }

    const now = Date.now();
    const waitMs = Math.max(0, (lastRefreshAt + MIN_REFRESH_INTERVAL_MS) - now);
    if (refreshDebounceTimer) return;

    refreshDebounceTimer = global.setTimeout(function runRefresh() {
      refreshDebounceTimer = null;
      if (!global.__lmbHooks || typeof global.__lmbHooks.refreshWalletBundle !== 'function') return;

      refreshInFlight = true;
      Promise.resolve(global.__lmbHooks.refreshWalletBundle())
        .catch(function ignore() {})
        .finally(function onDone() {
          refreshInFlight = false;
          lastRefreshAt = Date.now();
          if (pendingRefresh) {
            pendingRefresh = false;
            scheduleWalletRefresh();
          }
        });
    }, waitMs);
  }

  function bindWalletRealtime() {
    const bus = global.LMBEventBus;
    if (!bus || typeof bus.on !== 'function') return;

    bus.on('wallet:update', function onWalletUpdate(payload) {
      if (!shouldHandleWalletEvent(payload)) return;
      scheduleWalletRefresh();
    });
  }

  global.LMBModules.wallet = {
    init: function init() {
      if (!booted && global.__lmbHooks && typeof global.__lmbHooks.ensureWalletUi === 'function') {
        booted = true;
        global.__lmbHooks.ensureWalletUi().catch(function ignore() {});
      }

      bindWalletRealtime();
      if (global.location && /localhost|127\.0\.0\.1/.test(global.location.hostname || '')) {
        console.log('[LMB][module] wallet ready');
      }
    }
  };
})(window);
