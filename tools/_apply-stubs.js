/**
 * One-time script: replace Celebration FX and Floating Feed blocks
 * in lucky-mystery-box-v2.js with lightweight no-op stubs.
 * Run once, then delete this file.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'js', 'lucky-mystery-box-v2.js');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
console.log('Total lines before:', lines.length);

// ── 1. Replace Celebration FX block (L5194-5847) with stubs ──
const fxStart = 5194 - 1;
const fxEnd = 5847;
const fxStubs = [
  '// ── Celebration FX — lazy loaded from modules/lmb-celebration-fx.js ──',
  'function mkRing() {}',
  'function burst() {}',
  'function mkConf() {}',
  'function screenShake() {}',
  'function mkCoreFlash() {}',
  'function mkShockwave() {}',
  'function mkRays() {}',
  'function mkSparks() {}',
  'function megaExplosion() {}',
  'function ensureOpenBoxAnimStyles() {}',
  'function spawnUnboxFX() {}',
  'function spawnScanLine() {}',
  'function spawnSparks() {}',
  'function spawnScreenFlash() {}',
  'function spawnCardGlow() {}',
  'function spawnVipGlowRings() {}',
  'function spawnLightBeams() {}',
  'function spawnBoxBurst() {}',
  'function spawnVipRevealTexts() { return null; }',
  'function playPrizeFlyAnimation() { return Promise.resolve(); }',
  'function playCelebrationOverlay() { return Promise.resolve(); }',
];

console.log('FX block start (L5194):', lines[fxStart].substring(0, 60));
console.log('FX block end   (L5847):', lines[fxEnd - 1].substring(0, 60));
console.log('After FX (L5848-5849):', lines[fxEnd].substring(0, 50), '|', (lines[fxEnd + 1] || '').substring(0, 50));

lines.splice(fxStart, fxEnd - fxStart, ...fxStubs);
console.log('After FX replacement:', lines.length, 'lines (removed', fxEnd - fxStart - fxStubs.length, 'lines)');

// ── 2. Replace Floating Feed block (L1728-2327) with stubs ──
// Feed block is above FX block, so line numbers are unchanged
const feedStart = 1728 - 1;
const feedEnd = 2327;
const feedStubs = [
  '// ── Floating Feed — lazy loaded from modules/lmb-floating-feed.js ──',
  'function showWinNoti() {}',
  'function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }',
  'function buildNamePool() { return []; }',
  'function buildPrizePool() { return []; }',
  'function randomFeedDelayMs() { return 3000; }',
  "function maskName() { return '********ng'; }",
  "function randomTickerAgo() { return '1 ph\u00fat tr\u01b0\u1edbc'; }",
  'function parseToEpochMs() { return 0; }',
  "function formatFloatingAgoFromTimestamp() { return ''; }",
  'function normalizeFloatingWinnerEvent() { return null; }',
  'function getNextRealFloatingWinner() { return null; }',
  'function refreshRealFloatingWinnerFeed() {}',
  'function startRealFloatingFeedRefreshTimer() {}',
  'function stopRealFloatingFeedRefreshTimer() {',
  '  if (state.floatingRealFeedRefreshTimer) {',
  '    clearTimeout(state.floatingRealFeedRefreshTimer);',
  '    state.floatingRealFeedRefreshTimer = null;',
  '  }',
  '}',
  'function getFloatingPrizePool() { return []; }',
  "function normalizeFloatingMessageItem() { return { text: '', icon: '', image: '' }; }",
  'function getFloatingMessageTemplates() { return []; }',
  "function buildTickerHtml() { return ''; }",
  'function buildHomeFeedNotice() { return {}; }',
  'function pushHomeFloatingNotice() {}',
  'function initHomeFloatingFeed() {}',
  'function pushGameFloatingNotice() {}',
  'function initGameFloatingFeed() {}',
  'function renderWinnerTicker() {}',
  'function initWinnerTicker() {}',
  'function loadFloatingConfig() { return Promise.resolve(); }',
  'function applyFloatingPosition() {}',
  'function scheduleNoti() {}',
];

console.log('Feed block start (L1728):', lines[feedStart].substring(0, 60));
console.log('Feed block end   (L2327):', lines[feedEnd - 1].substring(0, 60));
console.log('After feed (L2328):', (lines[feedEnd] || '').substring(0, 60));

lines.splice(feedStart, feedEnd - feedStart, ...feedStubs);
console.log('After feed replacement:', lines.length, 'lines (removed', feedEnd - feedStart - feedStubs.length, 'more lines)');

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('✓ File written successfully');
