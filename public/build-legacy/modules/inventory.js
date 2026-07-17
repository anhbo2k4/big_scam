(function initInventoryModule(global) {
  global.LMBModules = global.LMBModules || {};
  if (global.LMBModules.inventory) return;
  var refreshTimer = null;
  var OPEN_REFRESH_DEBOUNCE_MS = 1200;
  function scheduleInventoryRefresh() {
    if (!global.__lmbHooks || typeof global.__lmbHooks.refreshInventoryBundle !== 'function') return;
    if (refreshTimer) return;
    refreshTimer = global.setTimeout(function runRefresh() {
      refreshTimer = null;
      if (global.__lmbHooks && typeof global.__lmbHooks.refreshInventoryBundle === 'function') {
        global.__lmbHooks.refreshInventoryBundle().catch(function ignore() {});
      }
    }, OPEN_REFRESH_DEBOUNCE_MS);
  }
  function bindInventoryOpen() {
    global.addEventListener('lmb:open-hub', function onHubOpen(ev) {
      var tab = String(ev && ev.detail && ev.detail.tab || '').toLowerCase();
      if (tab !== 'inventory' && tab !== 'exchange') return;
      if (global.__lmbHooks && typeof global.__lmbHooks.ensureWalletUi === 'function') {
        global.__lmbHooks.ensureWalletUi().catch(function ignore() {});
      }
      scheduleInventoryRefresh();
    });
  }
  global.LMBModules.inventory = {
    init: function init() {
      bindInventoryOpen();
      if (global.location && /localhost|127\.0\.0\.1/.test(global.location.hostname || '')) {
        console.log('[LMB][module] inventory ready');
      }
    }
  };
})(window);