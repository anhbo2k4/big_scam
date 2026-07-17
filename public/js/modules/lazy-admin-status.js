(function initLazyAdminStatusModule(global) {
  if (global.__lmbLazyAdminStatusReady) return;
  global.__lmbLazyAdminStatusReady = true;

  // Module marker for approval/status fragment readiness.
  global.dispatchEvent(new CustomEvent('lmb:module-admin-status-ready'));
})(window);
