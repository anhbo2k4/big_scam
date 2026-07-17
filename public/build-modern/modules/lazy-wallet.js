(function initLazyWalletModule(global) {
  if (global.__lmbLazyWalletReady) return;
  global.__lmbLazyWalletReady = true;

  function safe(fn) {
    if (typeof fn !== 'function') return;
    try { fn(); } catch (_) {}
  }

  // Wallet data stays in main runtime; this module only initializes fragment lifecycle.
  safe(global.refreshWallet);
  safe(global.renderWalletUnifiedHistory);

  global.dispatchEvent(new CustomEvent('lmb:module-wallet-ready'));
})(window);
