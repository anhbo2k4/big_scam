/**
 * build-detector.js — Diagnostic log: which JS build is loaded on this device.
 *
 * Loaded via the module/nomodule dual-build pattern:
 *   <script type="module" src="/build-modern/build-detector.js">   → modern browsers
 *   <script nomodule      src="/build-legacy/build-detector.js">   → legacy browsers
 *
 * The runtime check 'noModule' in HTMLScriptElement.prototype is the SAME test
 * browsers use internally to decide which <script> tag to execute, so it always
 * matches the actual file that was served.
 */
(function () {
  'use strict';

  /* ── Which build was loaded ─────────────────────────────────────────────── */
  var supportsModules = 'noModule' in HTMLScriptElement.prototype;
  var buildLabel = supportsModules ? 'ES6+ (build-modern)' : 'ES5 (build-legacy)';
  var buildPath  = supportsModules ? '/build-modern/' : '/build-legacy/';

  /* ── Extended feature detection ─────────────────────────────────────────── */
  function tryEval(code) {
    try { Function('"use strict";' + code); return true; } catch (e) { return false; }
  }
  function trySafeEval(code) {
    try { return !!Function('return (' + code + ')')(); } catch (e) { return false; }
  }

  var f = {
    'ES modules (nomodule)'  : supportsModules,
    'const / let'            : tryEval('const x=1;let y=2;'),
    'arrow functions'        : trySafeEval('(x=>x)(1)'),
    'class syntax'           : tryEval('class X{}'),
    'template literals'      : trySafeEval('`ok`'),
    'async / await'          : tryEval('async function f(){}'),
    'destructuring'          : tryEval('const {a}={a:1};'),
    'spread operator'        : tryEval('const a=[...[1]];'),
    'Promise'                : typeof Promise !== 'undefined',
    'fetch'                  : typeof fetch !== 'undefined',
    'Symbol'                 : typeof Symbol !== 'undefined',
    'Map / Set'              : typeof Map !== 'undefined' && typeof Set !== 'undefined',
    'WeakMap'                : typeof WeakMap !== 'undefined',
    'IntersectionObserver'   : typeof IntersectionObserver !== 'undefined',
    'requestIdleCallback'    : typeof requestIdleCallback !== 'undefined',
    'AbortController'        : typeof AbortController !== 'undefined',
  };

  /* ── Expose globally for runtime inspection ─────────────────────────────── */
  window.__buildInfo = {
    build     : supportsModules ? 'modern' : 'legacy',
    buildPath : buildPath,
    label     : buildLabel,
    features  : f,
    ua        : navigator.userAgent,
    timestamp : new Date().toISOString()
  };

  /* ── Console output ─────────────────────────────────────────────────────── */
  var icon    = supportsModules ? '\u2705' : '\u26A0\uFE0F'; // ✅ : ⚠️
  var color   = supportsModules ? '#22c55e' : '#f59e0b';
  var bgColor = supportsModules ? '#052e16' : '#431407';
  var badgeStyle = 'background:' + bgColor + ';color:' + color + ';font-weight:bold;padding:2px 8px;border-radius:4px;font-size:12px;';

  var ua = navigator.userAgent;

  // Summarise feature flags as PASS/FAIL one-liner
  var passCount = 0;
  var failList = [];
  for (var k in f) {
    if (Object.prototype.hasOwnProperty.call(f, k)) {
      if (f[k]) { passCount++; } else { failList.push(k); }
    }
  }

  try {
    var c = console;
    if (c.groupCollapsed) {
      c.groupCollapsed(
        '%c ' + icon + '  GiftBox JS Build: ' + buildLabel + ' ',
        badgeStyle
      );
      c.log('%cBuild path  %c' + buildPath, 'font-weight:bold;color:#94a3b8', 'color:#e2e8f0');
      c.log('%cUser-Agent  %c' + ua,         'font-weight:bold;color:#94a3b8', 'color:#e2e8f0');
      c.log(
        '%cFeatures    %c' + passCount + ' / ' + Object.keys(f).length + ' supported' +
        (failList.length ? ' — missing: ' + failList.join(', ') : ''),
        'font-weight:bold;color:#94a3b8',
        failList.length ? 'color:#f87171' : 'color:#4ade80'
      );
      if (c.table) {
        c.table(f);
      }
      c.groupEnd();
    } else {
      // Very old browser — no groupCollapsed
      c.log('[GiftBox] ' + icon + ' ' + buildLabel + ' | features: ' + passCount + '/' + Object.keys(f).length + ' | UA: ' + ua);
    }
  } catch (e) {
    // Silent fallback — no crash on restricted consoles
  }
})();
