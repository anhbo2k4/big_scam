(function initGameBoardModule(global) {
  global.LMBModules = global.LMBModules || {};
  if (global.LMBModules['game-board']) return;

  global.LMBModules['game-board'] = {
    init: function init() {
      const root = document.getElementById('screen-game');
      if (root) root.dataset.moduleGameBoard = '1';
      if (global.location && /localhost|127\.0\.0\.1/.test(global.location.hostname || '')) {
        console.log('[LMB][module] game-board ready');
      }
    }
  };
})(window);
