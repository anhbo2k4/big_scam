function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// ===== GET SESSION CODE FROM URL =====
function getSessionCodeFromURL() {
  var params = new URLSearchParams(window.location.search);
  return (params.get('code') || '').toUpperCase();
}

// ===== SECURITY HELPER =====
// Add browser fingerprint to all API requests
function secureAPICall(_x) {
  return _secureAPICall.apply(this, arguments);
}
function _secureAPICall() {
  _secureAPICall = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(url) {
    var options,
      headers,
      fp,
      response,
      _args3 = arguments,
      _t,
      _t2;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
          _context3.p = 1;
          // Get browser fingerprint if available
          headers = options.headers || {};
          if (!(typeof BrowserFingerprint !== 'undefined')) {
            _context3.n = 5;
            break;
          }
          if (!(typeof BrowserFingerprint.getForAPIAsync === 'function')) {
            _context3.n = 3;
            break;
          }
          _context3.n = 2;
          return BrowserFingerprint.getForAPIAsync();
        case 2:
          _t = _context3.v;
          _context3.n = 4;
          break;
        case 3:
          _t = BrowserFingerprint.getForAPI();
        case 4:
          fp = _t;
          headers = _objectSpread(_objectSpread({}, headers), {}, {
            'X-Browser-Fingerprint': fp.fingerprintHash,
            'X-Fingerprint-Data': fp.browserFingerprint
          });
        case 5:
          // Merge headers
          options.headers = _objectSpread({
            'Content-Type': 'application/json'
          }, headers);
          _context3.n = 6;
          return fetch(url, options);
        case 6:
          response = _context3.v;
          return _context3.a(2, response);
        case 7:
          _context3.p = 7;
          _t2 = _context3.v;
          throw _t2;
        case 8:
          return _context3.a(2);
      }
    }, _callee3, null, [[1, 7]]);
  }));
  return _secureAPICall.apply(this, arguments);
}
function parseMoneyInputValue(value) {
  var normalized = String(value !== null && value !== void 0 ? value : '').replace(/[^\d-]/g, '');
  var parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
}
function formatMoneyComma(value) {
  return parseMoneyInputValue(value).toLocaleString('en-US');
}
function bindMoneyCommaInput(inputEl) {
  if (!inputEl || inputEl.dataset.moneyCommaBound === '1') return;
  var applyFormattedValue = function applyFormattedValue() {
    var numeric = parseMoneyInputValue(inputEl.value);
    inputEl.value = numeric > 0 ? formatMoneyComma(numeric) : '';
  };
  inputEl.addEventListener('input', applyFormattedValue);
  inputEl.addEventListener('blur', applyFormattedValue);
  inputEl.dataset.moneyCommaBound = '1';
  applyFormattedValue();
}

// ===== GLOBAL PAGE LOADER =====
var globalLoaderPendingRequests = 0;
var globalLoaderShowTimer = null;
var globalLoaderHideTimer = null;
var globalLoaderVisibleSince = 0;
var globalLoaderSpinnerAnim = null;
var GLOBAL_LOADER_MIN_VISIBLE_MS = 500;
var GLOBAL_LOADER_LIGHT_MIN_VISIBLE_MS = 220;
function ensureGlobalPageLoader() {
  var overlay = document.getElementById('pageGlobalLoader');
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = 'pageGlobalLoader';
  overlay.style.cssText = ['position:fixed', 'inset:0', 'display:none', 'align-items:center', 'justify-content:center', 'background:rgba(5,8,20,0.82)', 'backdrop-filter:blur(4px)', 'z-index:2147483646', 'padding:16px', 'opacity:0', 'pointer-events:none', 'transition:opacity .24s ease'].join(';');
  overlay.innerHTML = "\n      <div id=\"pageGlobalLoaderCard\" style=\"width:min(420px,100%);border-radius:16px;background:linear-gradient(160deg,#1a1840,#0f0d2a);border:1px solid rgba(124,58,237,.45);padding:22px 18px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.4);transform:translateY(10px) scale(.985);opacity:.92;transition:transform .24s ease,opacity .24s ease\">\n        <div style=\"font-size:28px;margin-bottom:10px\">\u23F3</div>\n        <div id=\"pageGlobalLoaderText\" style=\"font-size:15px;font-weight:700;color:#e2e8f0;margin-bottom:10px\">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u t\u1EEB server...</div>\n        <div id=\"pageGlobalLoaderSpinner\" style=\"width:34px;height:34px;border:3px solid rgba(148,163,184,.3);border-top-color:#38bdf8;border-radius:999px;margin:0 auto;animation:globalLoaderSpin 0.9s linear infinite;will-change:transform\"></div>\n      </div>\n    ";
  if (!document.getElementById('pageGlobalLoaderStyle')) {
    var style = document.createElement('style');
    style.id = 'pageGlobalLoaderStyle';
    style.textContent = '@keyframes globalLoaderSpin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
  document.body.appendChild(overlay);
  return overlay;
}
function ensureGlobalLoaderSpinnerAnimation() {
  var spinner = document.getElementById('pageGlobalLoaderSpinner');
  if (!spinner) return;
  if (spinner.animate) {
    if (!globalLoaderSpinnerAnim) {
      globalLoaderSpinnerAnim = spinner.animate([{
        transform: 'rotate(0deg)'
      }, {
        transform: 'rotate(360deg)'
      }], {
        duration: 900,
        iterations: Infinity,
        easing: 'linear'
      });
    } else if (globalLoaderSpinnerAnim.playState === 'paused') {
      globalLoaderSpinnerAnim.play();
    }
  }
}
function showGlobalPageLoader(message) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var overlay = ensureGlobalPageLoader();
  var card = document.getElementById('pageGlobalLoaderCard');
  var textEl = document.getElementById('pageGlobalLoaderText');
  var isLight = options.light === true;
  overlay.dataset.mode = isLight ? 'light' : 'default';
  overlay.style.background = isLight ? 'rgba(5,8,20,0.46)' : 'rgba(5,8,20,0.82)';
  overlay.style.backdropFilter = isLight ? 'blur(2px)' : 'blur(4px)';
  if (card) {
    card.style.width = isLight ? 'min(340px,92%)' : 'min(420px,100%)';
    card.style.padding = isLight ? '16px 14px' : '22px 18px';
    card.style.borderRadius = isLight ? '14px' : '16px';
    card.style.boxShadow = isLight ? '0 8px 28px rgba(0,0,0,.32)' : '0 10px 40px rgba(0,0,0,.4)';
  }
  if (textEl && message) {
    textEl.textContent = message;
  }
  if (globalLoaderHideTimer) {
    clearTimeout(globalLoaderHideTimer);
    globalLoaderHideTimer = null;
  }
  overlay.style.display = 'flex';
  requestAnimationFrame(function () {
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    if (card) {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.opacity = '1';
    }
  });
  ensureGlobalLoaderSpinnerAnimation();
  globalLoaderVisibleSince = Date.now();
}
function hideGlobalPageLoader() {
  var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var minVisibleMsOverride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var overlay = document.getElementById('pageGlobalLoader');
  if (!overlay) return;
  var isLight = overlay.dataset.mode === 'light';
  var minVisibleMs = typeof minVisibleMsOverride === 'number' ? minVisibleMsOverride : isLight ? GLOBAL_LOADER_LIGHT_MIN_VISIBLE_MS : GLOBAL_LOADER_MIN_VISIBLE_MS;
  var elapsed = Date.now() - globalLoaderVisibleSince;
  var waitMs = force ? 0 : Math.max(0, minVisibleMs - elapsed);
  if (globalLoaderHideTimer) {
    clearTimeout(globalLoaderHideTimer);
  }
  globalLoaderHideTimer = setTimeout(function () {
    var card = document.getElementById('pageGlobalLoaderCard');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    if (card) {
      card.style.transform = 'translateY(10px) scale(.985)';
      card.style.opacity = '.92';
    }
    setTimeout(function () {
      overlay.style.display = 'none';
      overlay.dataset.mode = 'default';
    }, 240);
  }, waitMs);
}
function withGlobalPageLoader(_x2, _x3) {
  return _withGlobalPageLoader.apply(this, arguments);
}
function _withGlobalPageLoader() {
  _withGlobalPageLoader = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(message, task) {
    var options,
      _args4 = arguments;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          options = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
          showGlobalPageLoader(message, options);
          _context4.p = 1;
          _context4.n = 2;
          return task();
        case 2:
          return _context4.a(2, _context4.v);
        case 3:
          _context4.p = 3;
          hideGlobalPageLoader(false, options.minVisibleMs);
          return _context4.f(3);
        case 4:
          return _context4.a(2);
      }
    }, _callee4, null, [[1,, 3, 4]]);
  }));
  return _withGlobalPageLoader.apply(this, arguments);
}
function trackGlobalRequestStart() {
  globalLoaderPendingRequests += 1;
  if (globalLoaderShowTimer) {
    clearTimeout(globalLoaderShowTimer);
  }
  globalLoaderShowTimer = setTimeout(function () {
    if (globalLoaderPendingRequests > 0) {
      showGlobalPageLoader('Đang tải dữ liệu từ server...');
    }
  }, 380);
}
function shouldUseAutoGlobalLoader() {
  return false;
}
function trackGlobalRequestEnd() {
  globalLoaderPendingRequests = Math.max(0, globalLoaderPendingRequests - 1);
  if (globalLoaderPendingRequests === 0) {
    if (globalLoaderShowTimer) {
      clearTimeout(globalLoaderShowTimer);
      globalLoaderShowTimer = null;
    }
    hideGlobalPageLoader(false);
  }
}
function initGlobalFetchLoader() {
  if (window.__globalFetchLoaderInitialized) return;
  window.__globalFetchLoaderInitialized = true;
  var nativeFetch = window.fetch.bind(window);
  window.fetch = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(input) {
      var init,
        _args = arguments;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            init = _args.length > 1 && _args[1] !== undefined ? _args[1] : undefined;
            if (shouldUseAutoGlobalLoader()) {
              _context.n = 1;
              break;
            }
            return _context.a(2, nativeFetch(input, init));
          case 1:
            trackGlobalRequestStart();
            _context.p = 2;
            _context.n = 3;
            return nativeFetch(input, init);
          case 3:
            return _context.a(2, _context.v);
          case 4:
            _context.p = 4;
            trackGlobalRequestEnd();
            return _context.f(4);
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[2,, 4, 5]]);
    }));
    return function (_x4) {
      return _ref.apply(this, arguments);
    };
  }();
}
initGlobalFetchLoader();

// ===== MINIMAL STATE (Client-side only) =====
var OPENING_RESULT_DELAY_MS = 0;
var OPENING_ANIMATION_MIN_MS = 3000;
var state = {
  sessionCode: getSessionCodeFromURL() || localStorage.getItem('lmbSessionCode') || '',
  hasOpened: false,
  currentPrize: null,
  boxesInfo: null,
  // ✅ NEW: Store preloaded boxes info
  lastPage: 'home',
  claimingItemIndex: -1,
  onlineBase: Math.floor(Math.random() * 300) + 800,
  sessionStartTime: parseInt(localStorage.getItem('lmbSessionStart')) || Date.now(),
  sessionTimeout: 30 * 60 * 1000,
  // 30 minutes
  isSessionValid: true,
  userChosenAction: null,
  // Track whether user chose 'claim' or 'convert'
  existingWithdrawalId: null,
  isUpdatingWithdrawal: false,
  walletTransactions: [],
  walletTxFilter: 'all',
  walletTxPage: 1,
  walletTxPageSize: 6,
  openedPrizeItems: []
};
var openingAnimationTimers = [];
function clearOpeningAnimationTimers() {
  while (openingAnimationTimers.length > 0) {
    var timer = openingAnimationTimers.pop();
    clearTimeout(timer);
  }
}

// ===== NEW: Initialize session from 24-hour persistent storage =====
function initializeSessionFromStorage() {
  if (typeof lmbManager !== 'undefined') {
    var savedSession = lmbManager.restoreSession();
    if (savedSession && !state.sessionCode) {
      state.sessionCode = savedSession;
      state.sessionStartTime = parseInt(localStorage.getItem('lmbSessionStart')) || Date.now();
      state.isSessionValid = true;
    }
  }
}

// Initialize on script load
initializeSessionFromStorage();

// ===== SAVE SESSION TO LOCALSTORAGE =====
function saveSessionCode(code) {
  state.sessionCode = code;
  state.sessionStartTime = Date.now();

  // Use the new box manager for 24-hour persistence
  if (typeof lmbManager !== 'undefined') {
    lmbManager.saveSession(code);
  }

  // Keep old keys for backward compatibility
  localStorage.setItem('lmbSessionCode', code);
  localStorage.setItem('lmbSessionStart', state.sessionStartTime.toString());
}
function clearSessionCode() {
  state.sessionCode = '';
  state.isSessionValid = false;

  // Clear using box manager
  if (typeof lmbManager !== 'undefined') {
    lmbManager.clearSession();
  }
  localStorage.removeItem('lmbSessionCode');
  localStorage.removeItem('lmbSessionStart');
}
function getSessionScopedKey(suffix) {
  var code = (state.sessionCode || '').trim().toUpperCase();
  return code ? "lmb:".concat(code, ":").concat(suffix) : "lmb:".concat(suffix);
}
function saveSessionProfile(suffix) {
  var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  try {
    localStorage.setItem(getSessionScopedKey(suffix), JSON.stringify(payload));
  } catch (e) {}
}
function loadSessionProfile(suffix) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  try {
    var raw = localStorage.getItem(getSessionScopedKey(suffix));
    if (!raw) return fallback;
    var parsed = JSON.parse(raw);
    return parsed && _typeof(parsed) === 'object' ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

// ✅ NEW: Save/Restore prize data for persistent display after refresh
function savePrizeState(prize) {
  if (prize) {
    var scopedKey = getSessionScopedKey('currentPrize');
    localStorage.setItem(scopedKey, JSON.stringify(prize));
    localStorage.removeItem('lmbCurrentPrize');
  }
}
function restorePrizeState() {
  var scopedKey = getSessionScopedKey('currentPrize');
  var saved = localStorage.getItem(scopedKey) || localStorage.getItem('lmbCurrentPrize');
  if (saved) {
    try {
      state.currentPrize = JSON.parse(saved);
      if (localStorage.getItem('lmbCurrentPrize')) {
        localStorage.removeItem('lmbCurrentPrize');
      }
      return true;
    } catch (e) {
      localStorage.removeItem(scopedKey);
      localStorage.removeItem('lmbCurrentPrize');
      return false;
    }
  }
  return false;
}
function clearPrizeState() {
  state.currentPrize = null;
  localStorage.removeItem(getSessionScopedKey('currentPrize'));
  localStorage.removeItem('lmbCurrentPrize');
}

// ✅ NEW: Preload all 3 boxes info to reduce API calls and fix 429 rate limiting
function preloadBoxes() {
  return _preloadBoxes.apply(this, arguments);
} // ✅ Display preloaded boxes info under each box
function _preloadBoxes() {
  _preloadBoxes = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var response, result, _t3;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          if (state.sessionCode) {
            _context5.n = 1;
            break;
          }
          console.warn('⚠️ No session code, skipping preloadBoxes');
          return _context5.a(2, false);
        case 1:
          _context5.p = 1;
          console.log("\uD83D\uDCE6 Preloading boxes for session: ".concat(state.sessionCode));
          _context5.n = 2;
          return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/preload-boxes"));
        case 2:
          response = _context5.v;
          if (response.ok) {
            _context5.n = 3;
            break;
          }
          console.error("\u274C API returned ".concat(response.status, ": ").concat(response.statusText));
          return _context5.a(2, false);
        case 3:
          _context5.n = 4;
          return response.json();
        case 4:
          result = _context5.v;
          console.log('📦 Preload response:', result);
          if (!(result.success && result.data && result.data.boxes)) {
            _context5.n = 5;
            break;
          }
          state.boxesInfo = result.data.boxes;
          console.log("\u2705 Loaded ".concat(result.data.boxes.length, " boxes"));
          // ✅ Display box info under each box card
          displayBoxesInfo();
          return _context5.a(2, true);
        case 5:
          console.warn('⚠️ API success but no boxes data:', result.message || 'Unknown error');
          return _context5.a(2, false);
        case 6:
          _context5.n = 8;
          break;
        case 7:
          _context5.p = 7;
          _t3 = _context5.v;
          console.error('❌ Error in preloadBoxes:', _t3);
          return _context5.a(2, false);
        case 8:
          return _context5.a(2);
      }
    }, _callee5, null, [[1, 7]]);
  }));
  return _preloadBoxes.apply(this, arguments);
}
function displayBoxesInfo() {
  if (!state.boxesInfo || state.boxesInfo.length === 0) return;
  state.boxesInfo.forEach(function (_, idx) {
    var boxNum = idx + 1;
    var boxCard = document.querySelector(".box-card[onclick=\"openBox(".concat(boxNum, ")\"]"));
    if (!boxCard) return;
    var infoDiv = boxCard.querySelector('.box-info');
    if (infoDiv) {
      infoDiv.remove();
    }
  });
}

// ===== SESSION VALIDATION & TIMEOUT =====
function isSessionExpired() {
  if (!state.sessionCode) return true;
  var elapsed = Date.now() - state.sessionStartTime;
  return elapsed > state.sessionTimeout;
}
function validateSession() {
  if (isSessionExpired()) {
    state.isSessionValid = false;
    clearSessionCode();
    showToast('⏱️ Phiên chơi đã hết hạn. Vui lòng bắt đầu lại.', '⏱️');
    showPage('home');
    return false;
  }
  state.isSessionValid = true;
  return true;
}
function getSessionRemainingTime() {
  var elapsed = Date.now() - state.sessionStartTime;
  var remaining = Math.max(0, state.sessionTimeout - elapsed);
  return remaining;
}

// ===== DECORATIVE DATA (for win notifications) =====
var vietNames = ['Nguyễn Văn Hùng', 'Trần Thị Mai', 'Lê Văn Tùng', 'Phạm Thị Hoa', 'Hoàng Minh Tuấn', 'Đỗ Thị Lan', 'Vũ Văn Nam', 'Bùi Thị Thu', 'Ngô Văn Đức', 'Dương Thị Hằng'];
var notifPrizes = [{
  name: 'iPhone 16 Pro Max',
  emoji: '📱',
  color: '#a78bfa'
}, {
  name: 'Sony WH-1000XM5',
  emoji: '🎧',
  color: '#67e8f9'
}, {
  name: 'MacBook Air M3',
  emoji: '💻',
  color: '#86efac'
}, {
  name: 'Galaxy S25',
  emoji: '📲',
  color: '#fcd34d'
}, {
  name: 'iPad Pro M4',
  emoji: '🖥️',
  color: '#f9a8d4'
}];
var timeAgo = ['vừa xong', '1 phút trước', '2 phút trước', 'vài giây trước'];
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function formatDate(d) {
  var hours = d.getHours().toString().padStart(2, '0');
  var minutes = d.getMinutes().toString().padStart(2, '0');
  var date = d.getDate().toString().padStart(2, '0');
  var month = (d.getMonth() + 1).toString().padStart(2, '0');
  var year = d.getFullYear();
  return "".concat(hours, ":").concat(minutes, " ").concat(date, "/").concat(month, "/").concat(year);
}

// ===== PAGE NAVIGATION =====
function getActivePageName() {
  var active = document.querySelector('.page.active');
  if (!active || !active.id) return 'home';
  return active.id.replace('page-', '') || 'home';
}
function pushPageHistoryState(pageName) {
  if (!state.sessionCode || pageName === 'home') return;
  var current = history.state || {};
  if (current.lmbManaged && current.lmbPage === pageName) return;
  history.pushState(_objectSpread(_objectSpread({}, current), {}, {
    lmbManaged: true,
    sessionCode: state.sessionCode,
    lmbPage: pageName,
    at: Date.now()
  }), '', window.location.href);
}
function handleBackNavigationInSession() {
  if (!state.sessionCode) return false;
  var activePage = getActivePageName();
  if (activePage === 'thankyou') {
    showToast('⚠️ Bạn nên nhận quà trước khi thoát', '⚠️');
    pushPageHistoryState('thankyou');
    return true;
  }
  if (activePage === 'choose') {
    backToHome();
    return true;
  }
  if (activePage !== 'home') {
    showPage('choose', {
      fromPopState: true
    });
    pushPageHistoryState('choose');
    return true;
  }
  return false;
}
function showPage(name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$fromPopState = options.fromPopState,
    fromPopState = _options$fromPopState === void 0 ? false : _options$fromPopState,
    _options$skipDataLoad = options.skipDataLoad,
    skipDataLoad = _options$skipDataLoad === void 0 ? false : _options$skipDataLoad;
  var previous = getActivePageName();
  var pages = document.querySelectorAll('.page');
  pages.forEach(function (p) {
    return p.classList.remove('active');
  });
  var page = document.getElementById('page-' + name);
  if (page) {
    page.classList.add('active');
  }

  // IMPORTANT: Ensure overlays are always visible when z-index requires it
  // Force reflow to ensure CSS changes are applied
  void (page === null || page === void 0 ? void 0 : page.offsetHeight);

  // Load fresh data when switching to inventory or wallet
  if (!skipDataLoad) {
    if (name === 'inventory' && state.sessionCode) {
      loadInventory({
        showLoader: true
      });
    } else if (name === 'wallet' && state.sessionCode) {
      loadWallet({
        showLoader: true
      });
    } else if (name === 'exchange' && state.sessionCode) {
      // Load exchange options when showing exchange page
      loadExchangeOptions();
    } else if (name === 'choose' && state.sessionCode) {
      // Load opened prizes when showing choose page
      loadOpenedPrizes();
      loadExchangeOptions();
      loadWallet({
        showLoader: false
      });
    }
  }
  if (!fromPopState && state.sessionCode && name !== 'home' && name !== previous) {
    pushPageHistoryState(name);
  }
}
function runOpeningAnimation(boxNumber) {
  clearOpeningAnimationTimers();
  var labelEl = document.getElementById('openingBoxLabel');
  var textEl = document.getElementById('openingText');
  var giftBoxEl = document.getElementById('openingGiftBox');
  var sceneEl = document.querySelector('#page-opening .opening-scene');
  var steps = ["\uD83C\uDF81 \u0110ang m\u1EDF h\u1ED9p #".concat(boxNumber, "..."), '✨ Kiểm tra vận may của bạn...', '🔮 Xác thực phần thưởng...', '🎊 Kết nối kho quà bí ẩn...', '🎉 Sắp công bố phần thưởng...'];
  if (labelEl) {
    labelEl.textContent = "\uD83C\uDF81 H\u1ED9p qu\xE0 #".concat(boxNumber);
    labelEl.style.animation = 'none';
    void labelEl.offsetHeight;
    labelEl.style.animation = 'pulse 0.6s ease-in-out';
  }
  if (giftBoxEl) {
    giftBoxEl.classList.remove('opening-final');
    void giftBoxEl.offsetHeight;
    giftBoxEl.classList.add('opening-final');

    // Add shake animation
    giftBoxEl.style.animation = 'shake 0.5s ease-in-out infinite';
  }
  if (sceneEl) {
    sceneEl.classList.remove('phase-2', 'phase-3', 'phase-4');
    void sceneEl.offsetHeight;

    // Trigger particles immediately
    var particles = sceneEl.querySelectorAll('.opening-particle');
    particles.forEach(function (p, i) {
      p.style.animation = "float-particle ".concat(2 + i * 0.3, "s ease-in-out infinite");
    });
    var sparks = sceneEl.querySelectorAll('.opening-spark');
    sparks.forEach(function (s, i) {
      s.style.animation = "sparkle ".concat(1.5 + i * 0.2, "s ease-in-out infinite");
    });
  }
  if (textEl) {
    textEl.textContent = steps[0];
    textEl.style.animation = 'fadeInUp 0.5s ease-out';
    openingAnimationTimers.push(setTimeout(function () {
      var openingPage = document.getElementById('page-opening');
      if (openingPage && openingPage.classList.contains('active')) {
        textEl.textContent = steps[1];
        textEl.style.animation = 'fadeInUp 0.5s ease-out';
      }
    }, 700));
    openingAnimationTimers.push(setTimeout(function () {
      var openingPage = document.getElementById('page-opening');
      if (openingPage && openingPage.classList.contains('active')) {
        textEl.textContent = steps[2];
        textEl.style.animation = 'fadeInUp 0.5s ease-out';
        if (sceneEl) sceneEl.classList.add('phase-2');
        if (giftBoxEl) giftBoxEl.style.animation = 'shake-intensive 0.3s ease-in-out infinite';
      }
    }, 1450));
    openingAnimationTimers.push(setTimeout(function () {
      var openingPage = document.getElementById('page-opening');
      if (openingPage && openingPage.classList.contains('active')) {
        textEl.textContent = steps[3];
        textEl.style.animation = 'fadeInUp 0.5s ease-out';
        if (sceneEl) sceneEl.classList.add('phase-3');
        if (giftBoxEl) giftBoxEl.style.animation = 'bounce 0.4s ease-in-out infinite';
      }
    }, 2200));
    openingAnimationTimers.push(setTimeout(function () {
      var openingPage = document.getElementById('page-opening');
      if (openingPage && openingPage.classList.contains('active')) {
        textEl.textContent = steps[4];
        textEl.style.animation = 'fadeInUp 0.5s ease-out';
        if (sceneEl) sceneEl.classList.add('phase-4');
        if (giftBoxEl) {
          giftBoxEl.style.animation = 'scale-pulse 0.6s ease-in-out infinite';
          giftBoxEl.style.filter = 'brightness(1.3) drop-shadow(0 0 20px rgba(168,85,247,0.8))';
        }
      }
    }, 2750));
  }
}
function goHome() {
  // Clear session and go back to home page
  clearSessionCode();
  state.hasOpened = false;
  state.currentPrize = null;
  showGlobalPageLoader('Đang quay về trang chủ...');
  window.location.href = '/';
  showToast('🏠 Quay về trang chủ', '🏠');
}
function goBack() {
  if (state.sessionCode) {
    showPage('choose');
  } else {
    showPage('home');
  }
}
function applyUserTheme(theme) {
  var nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('userTheme', nextTheme);
  var isLight = nextTheme === 'light';
  var icon = document.getElementById('userThemeToggleIcon');
  if (icon) {
    icon.textContent = isLight ? '☀️' : '🌙';
  }
  var mobileText = document.getElementById('userThemeToggleMobileText');
  if (mobileText) {
    mobileText.textContent = isLight ? 'Chế độ tối' : 'Chế độ sáng';
  }
}
function toggleUserTheme() {
  var current = localStorage.getItem('userTheme') || 'dark';
  var next = current === 'dark' ? 'light' : 'dark';
  applyUserTheme(next);
}
window.toggleUserTheme = toggleUserTheme;

// ===== SESSION MANAGEMENT =====
function enterSession() {
  return _enterSession.apply(this, arguments);
} // ===== BOX OPENING =====
function _enterSession() {
  _enterSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var input, code, _t4;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          input = document.getElementById('sessionCodeInput');
          code = input.value.trim().toUpperCase();
          if (code) {
            _context7.n = 1;
            break;
          }
          input.style.borderColor = '#ef4444';
          setTimeout(function () {
            input.style.borderColor = '';
          }, 1500);
          return _context7.a(2);
        case 1:
          if (!(code.length < 4 || code.length > 20)) {
            _context7.n = 2;
            break;
          }
          showToast('❌ Mã phiên phải từ 4-20 ký tự', '❌');
          return _context7.a(2);
        case 2:
          _context7.p = 2;
          _context7.n = 3;
          return withGlobalPageLoader('Đang tải dữ liệu phiên từ server...', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
            var response, result, verifyResponse, verifyResult, _verifyResult$data, order, preloaded, newURL;
            return _regenerator().w(function (_context6) {
              while (1) switch (_context6.n) {
                case 0:
                  _context6.n = 1;
                  return fetch('/api/lucky-mystery-box/join', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      sessionCode: code
                    })
                  });
                case 1:
                  response = _context6.v;
                  _context6.n = 2;
                  return response.json();
                case 2:
                  result = _context6.v;
                  if (result.success) {
                    _context6.n = 3;
                    break;
                  }
                  showToast('❌ ' + result.message, '❌');
                  input.style.borderColor = '#ef4444';
                  return _context6.a(2);
                case 3:
                  _context6.n = 4;
                  return fetch("/api/lucky-mystery-box/session?code=".concat(code));
                case 4:
                  verifyResponse = _context6.v;
                  _context6.n = 5;
                  return verifyResponse.json();
                case 5:
                  verifyResult = _context6.v;
                  if (verifyResult.success) {
                    _context6.n = 6;
                    break;
                  }
                  showToast('❌ ' + verifyResult.message, '❌');
                  return _context6.a(2);
                case 6:
                  if (verifyResult.data.is_active) {
                    _context6.n = 7;
                    break;
                  }
                  showToast('⚠️ Phiên này không còn hoạt động', '⚠️');
                  return _context6.a(2);
                case 7:
                  saveSessionCode(code);
                  state.hasOpened = verifyResult.data.player_selected_box !== null;
                  state.isSessionValid = true;
                  if (typeof lmbManager !== 'undefined') {
                    order = Array.isArray(verifyResult === null || verifyResult === void 0 || (_verifyResult$data = verifyResult.data) === null || _verifyResult$data === void 0 ? void 0 : _verifyResult$data.box_positions) ? verifyResult.data.box_positions : [1, 2, 3];
                    lmbManager.setOpenOrder(order);
                  }

                  // ✅ NEW: Preload all 3 boxes info to reduce API calls
                  _context6.n = 8;
                  return preloadBoxes();
                case 8:
                  preloaded = _context6.v;
                  if (preloaded) {
                    _context6.n = 9;
                    break;
                  }
                  showToast('❌ Không tải được dữ liệu hộp. Vui lòng thử lại.', '❌');
                  return _context6.a(2);
                case 9:
                  // Update URL to include session code as query parameter
                  newURL = window.location.protocol + '//' + window.location.host + '/?code=' + code;
                  window.history.replaceState({
                    sessionCode: code
                  }, '', newURL);

                  // ✅ If already opened a box, skip personal form and go to choose page
                  if (state.hasOpened) {
                    showToast('✅ Chào mừng quay lại! Đây là phiên của bạn.', '✅');
                    showPage('choose');
                    // Load opened prizes
                    setTimeout(function () {
                      return loadOpenedPrizes();
                    }, 500);
                  } else {
                    // First time - show personal form
                    showPage('personal');
                    showToast('✅ Tham gia phiên thành công!', '✅');
                  }
                case 10:
                  return _context6.a(2);
              }
            }, _callee6);
          })), {
            minVisibleMs: 420
          });
        case 3:
          _context7.n = 5;
          break;
        case 4:
          _context7.p = 4;
          _t4 = _context7.v;
          showToast('❌ Lỗi: ' + _t4.message, '❌');
        case 5:
          return _context7.a(2);
      }
    }, _callee7, null, [[2, 4]]);
  }));
  return _enterSession.apply(this, arguments);
}
function openBox(_x5) {
  return _openBox.apply(this, arguments);
}
function _openBox() {
  _openBox = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(num) {
    var canOpen, canOpenSpecific, response, result, openingStartedAt, info, openedEl, renderResult, elapsed, waitForAnimationMs, totalDelay, _t5;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          if (validateSession()) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2);
        case 1:
          if (state.sessionCode) {
            _context8.n = 2;
            break;
          }
          showToast('❌ Vui lòng tham gia phiên trước', '❌');
          return _context8.a(2);
        case 2:
          console.log('[openBox] start', {
            sessionCode: state.sessionCode,
            boxNumber: num
          });

          // ===== NEW: Check box opening constraints =====
          if (!(typeof lmbManager !== 'undefined')) {
            _context8.n = 8;
            break;
          }
          // Check if can open any box
          canOpen = lmbManager.canOpenBox();
          if (!(!canOpen.allowed && lmbManager.isPendingConfirmation())) {
            _context8.n = 4;
            break;
          }
          _context8.n = 3;
          return syncLocalProgressFromServer();
        case 3:
          canOpen = lmbManager.canOpenBox();
        case 4:
          if (canOpen.allowed) {
            _context8.n = 5;
            break;
          }
          showToast('⚠️ ' + canOpen.reason, '⚠️');
          return _context8.a(2);
        case 5:
          // Check if this specific box can be opened
          canOpenSpecific = lmbManager.canOpenSpecificBox(num);
          if (!(!canOpenSpecific.allowed && lmbManager.isPendingConfirmation())) {
            _context8.n = 7;
            break;
          }
          _context8.n = 6;
          return syncLocalProgressFromServer();
        case 6:
          canOpenSpecific = lmbManager.canOpenSpecificBox(num);
        case 7:
          if (canOpenSpecific.allowed) {
            _context8.n = 8;
            break;
          }
          showToast('⚠️ ' + canOpenSpecific.reason, '⚠️');
          return _context8.a(2);
        case 8:
          if (!(!num || num < 1 || num > 3)) {
            _context8.n = 9;
            break;
          }
          showToast('❌ Hộp không hợp lệ', '❌');
          return _context8.a(2);
        case 9:
          // ===== CHECK SERVER PERMISSION FIRST =====
          // Show simple loading message while checking permission
          showLoadingOverlay('Đang kiểm tra quyền mở hộp...', '🔍 Xác thực');
          _context8.p = 10;
          _context8.n = 11;
          return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/select-box"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Skip-Global-Loader': '1'
            },
            body: JSON.stringify({
              sessionCode: state.sessionCode,
              boxNumber: num
            })
          });
        case 11:
          response = _context8.v;
          console.log('[openBox] response status', response.status);
          _context8.n = 12;
          return response.json();
        case 12:
          result = _context8.v;
          console.log('[openBox] response payload', result);
          if (result.success) {
            _context8.n = 13;
            break;
          }
          hideLoadingOverlay();
          showToast('❌ ' + result.message, '❌');
          return _context8.a(2);
        case 13:
          if (!result.requiresApproval) {
            _context8.n = 14;
            break;
          }
          hideLoadingOverlay();
          showToast('⏳ ' + (result.message || 'Phần thưởng cần admin xác nhận'), '⏳');
          showPage('choose');
          return _context8.a(2);
        case 14:
          // ===== NOW START ANIMATION - Permission granted =====
          hideLoadingOverlay();
          state.hasOpened = true;
          openingStartedAt = Date.now();
          showPage('opening', {
            skipDataLoad: true
          });
          runOpeningAnimation(num);

          // ===== NEW: Sync API state with manager =====
          if (typeof lmbManager !== 'undefined') {
            // Mark box as opened in manager
            lmbManager.markBoxOpened(result.openedBox || num, result.prize || null);

            // Update display (UI will use lmbManager data)
            info = lmbManager.getSessionInfo();
            openedEl = document.getElementById('boxOpenedCount');
            if (openedEl) {
              openedEl.textContent = info.openedCount + '/3';
            }
          }

          // ✅ Log full prize data for debugging
          renderResult = function renderResult() {
            if (result.prize) {
              state.currentPrize = result.prize;
              state.currentPrize.boxNumber = result.openedBox || num;
              savePrizeState(result.prize); // Persist prize to localStorage

              if (typeof lmbManager !== 'undefined' && isUnluckyPrize(result.prize)) {
                lmbManager.confirmCurrentBox();
              }
              showWinResult(result.prize);
              if (!isUnluckyPrize(result.prize)) {
                spawnConfetti();
              }
              setTimeout(function () {
                return loadOpenedPrizes();
              }, 300);
              return;
            }
            if (result.won) {
              console.warn('[openBox] missing prize data', result);
              showToast('❌ Lỗi: Không có dữ liệu phần thưởng', '❌');
              showPage('choose');
              return;
            }
            showLoseResult();
            showToast('Chúc bạn may mắn lần sau!', '😢');
          };
          elapsed = Date.now() - openingStartedAt;
          waitForAnimationMs = Math.max(0, OPENING_ANIMATION_MIN_MS - elapsed);
          totalDelay = Math.max(waitForAnimationMs, OPENING_RESULT_DELAY_MS);
          if (totalDelay > 0) {
            setTimeout(renderResult, totalDelay);
          } else {
            renderResult();
          }
          _context8.n = 16;
          break;
        case 15:
          _context8.p = 15;
          _t5 = _context8.v;
          console.error('[openBox] error', _t5);
          hideLoadingOverlay();
          showToast('❌ Lỗi: ' + _t5.message, '❌');
          state.hasOpened = false;
        case 16:
          return _context8.a(2);
      }
    }, _callee8, null, [[10, 15]]);
  }));
  return _openBox.apply(this, arguments);
}
function syncLocalProgressFromServer() {
  return _syncLocalProgressFromServer.apply(this, arguments);
} // ===== RESULT OVERLAYS =====
function _syncLocalProgressFromServer() {
  _syncLocalProgressFromServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
    var response, _result, _t6;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          if (!(!state.sessionCode || typeof lmbManager === 'undefined')) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2, false);
        case 1:
          _context9.p = 1;
          _context9.n = 2;
          return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/player-inventory"));
        case 2:
          response = _context9.v;
          if (response.ok) {
            _context9.n = 3;
            break;
          }
          return _context9.a(2, false);
        case 3:
          _context9.n = 4;
          return response.json();
        case 4:
          _result = _context9.v;
          if (!(!_result.success || !_result.data || !Array.isArray(_result.data.items))) {
            _context9.n = 5;
            break;
          }
          return _context9.a(2, false);
        case 5:
          lmbManager.syncOpenedBoxes(_result.data.items);
          return _context9.a(2, true);
        case 6:
          _context9.p = 6;
          _t6 = _context9.v;
          return _context9.a(2, false);
      }
    }, _callee9, null, [[1, 6]]);
  }));
  return _syncLocalProgressFromServer.apply(this, arguments);
}
function isUnluckyPrize(prize) {
  if (!prize) return false;
  var type = (prize.type || '').toLowerCase();
  var level = (prize.level || '').toUpperCase();
  var status = (prize.status || '').toUpperCase();
  return type === 'unlucky' || level === 'UNLUCKY' || status === 'UNLUCKY';
}
function showWinResult(prize) {
  if (!prize) {
    showToast('❌ Lỗi: Không có dữ liệu phần thưởng', '❌');
    return;
  }
  console.log('[showWinResult] prize', prize);
  applyPrizeTheme(prize);
  var isUnlucky = isUnluckyPrize(prize);

  // Ensure result overlay exists before trying to update it
  var resultOverlay = document.getElementById('resultWinOverlay');
  var resultItemName = document.getElementById('resultItemName');
  var resultItemDesc = document.getElementById('resultItemDesc');
  var resultImg = document.getElementById('resultImg');
  var resultMedia = document.getElementById('resultMedia');
  var resultIconFallback = document.getElementById('resultIconFallback');
  var resultValue = document.getElementById('resultValue');
  var resultValueBadge = resultOverlay ? resultOverlay.querySelector('.result-value-badge') : null;
  var resultTitle = resultOverlay ? resultOverlay.querySelector('.result-title') : null;
  var resultSubtitle = resultOverlay ? resultOverlay.querySelector('.result-subtitle') : null;
  var resultActions = resultOverlay ? resultOverlay.querySelector('.result-actions') : null;
  if (!resultOverlay || !resultItemName || !resultItemDesc || !resultValue) {
    showToast('❌ Lỗi hiển thị kết quả. Vui lòng tải lại trang.', '❌');
    return;
  }
  if (!resultMedia) {
    resultMedia = document.createElement('div');
    resultMedia.className = 'result-media';
    resultMedia.id = 'resultMedia';
    resultMedia.setAttribute('aria-hidden', 'true');
    resultItemName.parentElement.insertBefore(resultMedia, resultItemName);
  }
  if (!resultImg) {
    resultImg = document.createElement('img');
    resultImg.id = 'resultImg';
    resultImg.className = 'result-img';
    resultImg.alt = 'Prize';
    resultMedia.appendChild(resultImg);
  }
  if (!resultIconFallback) {
    resultIconFallback = document.createElement('div');
    resultIconFallback.id = 'resultIconFallback';
    resultIconFallback.className = 'result-icon-fallback';
    resultIconFallback.setAttribute('aria-hidden', 'true');
    resultMedia.appendChild(resultIconFallback);
  }

  // Reset user action choice when showing new result
  state.userChosenAction = null;

  // Update header and actions for unlucky
  if (resultTitle) {
    resultTitle.textContent = isUnlucky ? '😢 Rất tiếc!' : '🎉 Chúc Mừng!';
  }
  if (resultSubtitle) {
    resultSubtitle.textContent = isUnlucky ? 'Chúc bạn may mắn lần sau' : 'Bạn đã nhận được';
  }
  var prizeValue = prize.value || prize.amount || 0;
  var valueNum = typeof prizeValue === 'number' ? prizeValue : Number(String(prizeValue).replace(/[.,\s](?=\d{3}(\D|$))/g, '').replace(/[^\d-]/g, '')) || 0;
  var isCashEnabled = prize.isCash === true || prize.isCash === 1 || String(prize.isCash).toLowerCase() === 'true';
  var canConvert = !isUnlucky && isCashEnabled && valueNum > 0;
  if (resultActions) {
    resultActions.style.display = '';
    if (isUnlucky) {
      resultActions.innerHTML = "<button class=\"btn-claim\" onclick=\"closeWinOverlay()\">\u27A1\uFE0F Ti\u1EBFp t\u1EE5c m\u1EDF h\u1ED9p</button>";
    } else if (canConvert) {
      resultActions.innerHTML = "\n          <button class=\"btn-claim\" onclick=\"claimItem()\">\uD83C\uDF81 Nh\u1EADn v\u1EADt ph\u1EA9m</button>\n          <button class=\"btn-convert\" onclick=\"convertToMoney()\">\n            \uD83D\uDCB0 \u0110\u1ED5i sang ti\u1EC1n<br>\n            <small id=\"convertAmount\" style=\"font-weight:500;opacity:.9\">0 \u0111</small>\n          </button>\n        ";
    } else {
      resultActions.innerHTML = "<button class=\"btn-claim\" onclick=\"claimItem()\">\uD83C\uDF81 Nh\u1EADn v\u1EADt ph\u1EA9m</button>";
    }
  }
  if (resultValueBadge) {
    resultValueBadge.style.display = isUnlucky ? 'none' : '';
  }

  // Set prize image with fallback handling
  var imgUrl = prize.img || prize.image || '';
  console.log('[showWinResult] image url', imgUrl);
  if (imgUrl && imgUrl.trim() !== '') {
    var img = new Image();
    img.onload = function () {
      resultImg.src = imgUrl;
      resultImg.style.display = 'block';
      if (resultIconFallback) resultIconFallback.style.display = 'none';
    };
    img.onerror = function () {
      console.warn('[showWinResult] image failed to load', imgUrl);
      resultImg.style.display = 'none';
      if (resultIconFallback) {
        var icon = prize.icon || (isUnlucky ? '😢' : '🎁');
        resultIconFallback.textContent = icon;
        resultIconFallback.style.display = 'block';
      }
    };
    img.src = imgUrl;
  } else {
    resultImg.style.display = 'none';
    if (resultIconFallback) {
      var icon = prize.icon || (isUnlucky ? '😢' : '🎁');
      resultIconFallback.textContent = icon;
      resultIconFallback.style.display = 'block';
    }
  }
  resultItemName.textContent = prize.name || 'Phần Thưởng';
  resultItemDesc.textContent = prize.description || prize.desc || '';

  // Safely handle prize value
  resultValue.textContent = formatMoneyComma(valueNum) + ' đ';
  var convertVal = isCashEnabled ? valueNum : prize.convertValue || Math.floor(valueNum * 0.7);
  var convertAmountEl = document.getElementById('convertAmount');
  if (convertAmountEl) {
    convertAmountEl.textContent = formatMoneyComma(convertVal) + ' đ';
  }

  // Ensure buttons are enabled when showing result
  var claimBtn = document.querySelector('.btn-claim');
  var convertBtn = document.querySelector('.btn-convert');
  if (claimBtn) {
    claimBtn.style.opacity = '1';
    claimBtn.style.pointerEvents = 'auto';
    claimBtn.style.cursor = 'pointer';
    claimBtn.title = '';
  }
  if (convertBtn) {
    convertBtn.style.opacity = '1';
    convertBtn.style.pointerEvents = 'auto';
    convertBtn.style.cursor = 'pointer';
    convertBtn.title = '';
  }

  // Add overlay with multiple safeguards to ensure visibility
  resultOverlay.classList.add('active');
  resultOverlay.style.setProperty('display', 'flex', 'important'); // Force display with !important
  resultOverlay.style.setProperty('visibility', 'visible', 'important'); // Ensure visibility
  resultOverlay.style.setProperty('opacity', '1', 'important'); // Ensure full opacity

  // Force browser reflow to apply changes immediately
  void resultOverlay.offsetHeight;
  void resultOverlay.offsetWidth;
}
function applyPrizeTheme(prize) {
  var resultOverlay = document.getElementById('resultWinOverlay');
  var resultValue = document.getElementById('resultValue');
  if (!resultOverlay || !resultValue) return;
  var rarityColors = {
    legendary: '#f97316',
    epic: '#8b5cf6',
    rare: '#3b82f6',
    uncommon: '#22c55e',
    common: '#94a3b8',
    VIP: '#f59e0b',
    NORMAL: '#3b82f6',
    UNLUCKY: '#ef4444'
  };
  var color = prize.colorHex || rarityColors[prize.rarity] || rarityColors[prize.level] || '#3b82f6';
  resultOverlay.style.boxShadow = "0 0 0 1px ".concat(color, "66, 0 20px 60px rgba(0,0,0,0.45)");
  resultOverlay.style.borderColor = "".concat(color, "55");
  resultValue.style.color = color;
}
function showLoseResult() {
  var resultLoseOverlay = document.getElementById('resultLoseOverlay');
  if (!resultLoseOverlay) {
    showToast('❌ Lỗi hiển thị kết quả thua. Vui lòng tải lại trang.', '❌');
    return;
  }

  // Add overlay with multiple safeguards to ensure visibility
  resultLoseOverlay.classList.add('active');
  resultLoseOverlay.style.setProperty('display', 'flex', 'important'); // Force display with !important
  resultLoseOverlay.style.setProperty('visibility', 'visible', 'important'); // Ensure visibility
  resultLoseOverlay.style.setProperty('opacity', '1', 'important'); // Ensure full opacity

  // Force browser reflow to apply changes immediately
  void resultLoseOverlay.offsetHeight;
  void resultLoseOverlay.offsetWidth;
}
function closeLoseOverlay() {
  var resultLoseOverlay = document.getElementById('resultLoseOverlay');
  if (resultLoseOverlay) {
    resultLoseOverlay.classList.remove('active');
  }
  showPage('choose');
}
function closeWinOverlay() {
  var resultWinOverlay = document.getElementById('resultWinOverlay');
  if (resultWinOverlay) {
    resultWinOverlay.classList.remove('active');
    resultWinOverlay.style.removeProperty('display');
    resultWinOverlay.style.removeProperty('visibility');
    resultWinOverlay.style.removeProperty('opacity');
  }
  showPage('choose');
  setTimeout(function () {
    loadOpenedPrizes();
    loadExchangeOptions();
  }, 80);
}
window.closeWinOverlay = closeWinOverlay;
function setFieldError(fieldId, message) {
  var field = document.getElementById(fieldId);
  var errorEl = document.getElementById("".concat(fieldId, "Error"));
  if (field) field.classList.add('input-error');
  if (errorEl) errorEl.textContent = message || '';
}
function clearFieldError(fieldId) {
  var field = document.getElementById(fieldId);
  var errorEl = document.getElementById("".concat(fieldId, "Error"));
  if (field) field.classList.remove('input-error');
  if (errorEl) errorEl.textContent = '';
}
function clearFieldErrors() {
  var fieldIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  fieldIds.forEach(function (id) {
    return clearFieldError(id);
  });
}

// ===== CLAIMING & CONVERSION =====
function claimItem() {
  return _claimItem.apply(this, arguments);
}
function _claimItem() {
  _claimItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
    var resultWinOverlay;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          if (state.currentPrize) {
            _context0.n = 1;
            break;
          }
          showToast('❌ Lỗi: Không có vật phẩm để nhận', '❌');
          return _context0.a(2);
        case 1:
          if (!isUnluckyPrize(state.currentPrize)) {
            _context0.n = 2;
            break;
          }
          showToast('💔 Phần thưởng xui lỗi! Không thể nhận phần thưởng này.', '❌');
          return _context0.a(2);
        case 2:
          // Mark that user chose to claim (prevent conversion)
          state.userChosenAction = 'claim';
          updateExchangeButtonStates();

          // Open modal to collect info - using current prize data
          openClaimModal(state.currentPrize);
          resultWinOverlay = document.getElementById('resultWinOverlay');
          if (resultWinOverlay) {
            resultWinOverlay.classList.remove('active');
            resultWinOverlay.style.removeProperty('display');
            resultWinOverlay.style.removeProperty('visibility');
            resultWinOverlay.style.removeProperty('opacity');
          }
        case 3:
          return _context0.a(2);
      }
    }, _callee0);
  }));
  return _claimItem.apply(this, arguments);
}
function openClaimModal(prize) {
  if (!prize) {
    showToast('❌ Lỗi: Không tìm thấy vật phẩm', '❌');
    return;
  }
  var item = prize;
  state.claimingBoxNumber = prize.boxNumber || null;
  var claimModalItemName = document.getElementById('claimModalItemName');
  var claimName = document.getElementById('claimName');
  var claimPhone = document.getElementById('claimPhone');
  var claimEmail = document.getElementById('claimEmail');
  var claimAddress = document.getElementById('claimAddress');
  var claimCity = document.getElementById('claimCity');
  var claimNote = document.getElementById('claimNote');
  var claimModal = document.getElementById('claimModal');
  var claimProfile = loadSessionProfile('claimProfile', {});
  if (!claimModalItemName || !claimName || !claimPhone || !claimEmail || !claimAddress || !claimCity || !claimNote || !claimModal) {
    showToast('❌ Lỗi hiển thị form nhận quà. Vui lòng tải lại trang.', '❌');
    return;
  }
  claimModalItemName.textContent = '📦 ' + item.name;
  claimName.value = state.playerName || claimProfile.name || localStorage.getItem('lmbPlayerName') || '';
  claimPhone.value = state.playerPhone || claimProfile.phone || localStorage.getItem('lmbPlayerPhone') || '';
  claimEmail.value = state.playerEmail || claimProfile.email || localStorage.getItem('lmbPlayerEmail') || '';
  claimAddress.value = claimProfile.address || state.playerAddress || '';
  claimCity.value = claimProfile.city || state.playerCity || '';
  claimNote.value = claimProfile.note || state.playerNote || '';
  clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
  claimModal.classList.add('active');
}
function closeClaimModal() {
  var claimModal = document.getElementById('claimModal');
  if (claimModal) {
    claimModal.classList.remove('active');
  }
  clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
  state.claimingItemIndex = -1;
  showPage('inventory');
}
function confirmClaim() {
  var _state$currentPrize;
  var claimNameEl = document.getElementById('claimName');
  var claimPhoneEl = document.getElementById('claimPhone');
  var claimEmailEl = document.getElementById('claimEmail');
  var claimAddressEl = document.getElementById('claimAddress');
  var claimCityEl = document.getElementById('claimCity');
  var claimNoteEl = document.getElementById('claimNote');
  if (!claimNameEl || !claimPhoneEl || !claimEmailEl || !claimAddressEl || !claimCityEl || !claimNoteEl) {
    showToast('❌ Lỗi form. Vui lòng tải lại trang.', '❌');
    return;
  }
  var name = claimNameEl.value.trim();
  var phone = claimPhoneEl.value.trim();
  var email = claimEmailEl.value.trim();
  var address = claimAddressEl.value.trim();
  var city = claimCityEl.value.trim();
  var phoneOk = /^\d{10,11}$/.test(phone);
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
  var hasError = false;
  if (!name) {
    setFieldError('claimName', 'Vui lòng nhập họ và tên người nhận.');
    hasError = true;
  }
  if (!phone) {
    setFieldError('claimPhone', 'Vui lòng nhập số điện thoại.');
    hasError = true;
  } else if (!phoneOk) {
    setFieldError('claimPhone', 'Số điện thoại phải gồm 10-11 chữ số.');
    hasError = true;
  }
  if (!email) {
    setFieldError('claimEmail', 'Vui lòng nhập email liên hệ.');
    hasError = true;
  } else if (!emailOk) {
    setFieldError('claimEmail', 'Email không hợp lệ.');
    hasError = true;
  }
  if (!address) {
    setFieldError('claimAddress', 'Vui lòng nhập địa chỉ giao hàng.');
    hasError = true;
  }
  if (!city) {
    setFieldError('claimCity', 'Vui lòng chọn tỉnh/thành phố.');
    hasError = true;
  }
  if (hasError) {
    showToast('❌ Vui lòng kiểm tra thông tin nhận quà', '❌');
    return;
  }
  submitClaim({
    name: name,
    phone: phone,
    email: email,
    address: address,
    city: city,
    note: claimNoteEl.value.trim(),
    boxNumber: state.claimingBoxNumber || ((_state$currentPrize = state.currentPrize) === null || _state$currentPrize === void 0 ? void 0 : _state$currentPrize.boxNumber) || null
  });
}
function submitClaim(_x6) {
  return _submitClaim.apply(this, arguments);
}
function _submitClaim() {
  _submitClaim = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(formData) {
    var claimLoadingMinDuration, claimLoadingStartedAt, claimLoadingToken, _result3, response, text, _result2, errorMsg, _t7;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          setButtonLoading('claimSubmitBtn', true, 'Đang gửi thông tin...');
          claimLoadingMinDuration = getDefaultLoadingDurationMs();
          claimLoadingStartedAt = Date.now();
          claimLoadingToken = startLoadingSequence('Đang gửi yêu cầu nhận quà', ['Đang gửi thông tin nhận quà...', 'Đang kiểm tra họ tên, số điện thoại và email...', 'Hệ thống đang ghi nhận địa chỉ giao quà...', 'Sắp hoàn tất, đang chuyển đến trang cảm ơn...'], Math.max(500, Math.floor(claimLoadingMinDuration / 4)));
          _context1.p = 1;
          console.log('[submitClaim] payload', formData);
          _context1.n = 2;
          return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/claim"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
        case 2:
          response = _context1.v;
          console.log('[submitClaim] response status', response.status);
          _context1.n = 3;
          return response.text();
        case 3:
          text = _context1.v;
          _result2 = {};
          try {
            _result2 = JSON.parse(text);
          } catch (e) {
            _result2 = {
              success: false,
              message: 'Invalid response from server'
            };
          }
          console.log('[submitClaim] response payload', _result2);
          if (_result2.success) {
            _context1.n = 5;
            break;
          }
          _context1.n = 4;
          return waitForDefaultLoading(claimLoadingStartedAt, claimLoadingMinDuration);
        case 4:
          stopLoadingSequence(claimLoadingToken);
          errorMsg = resolveRequestError(response, _result2, 'Không thể xử lý yêu cầu');
          showToast('❌ ' + errorMsg, '❌');
          return _context1.a(2);
        case 5:
          document.getElementById('claimModal').classList.remove('active');
          state.claimingItemIndex = -1;

          // ✅ NEW: Confirm current box in manager
          if (typeof lmbManager !== 'undefined') {
            lmbManager.confirmCurrentBox();
          }
          showToast('✅ ' + _result2.message, '📦');

          // Save form data to state for thank you page
          state.playerName = formData.name;
          state.playerPhone = formData.phone;
          state.playerEmail = formData.email;
          state.playerAddress = formData.address;
          state.playerCity = formData.city;
          state.playerNote = formData.note || '';
          state.claimMethod = 'Giao hàng';
          localStorage.setItem('lmbPlayerName', formData.name);
          localStorage.setItem('lmbPlayerPhone', formData.phone);
          localStorage.setItem('lmbPlayerEmail', formData.email);
          saveSessionProfile('claimProfile', {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            note: formData.note || ''
          });
          updateLoadingOverlayMessage('Yêu cầu nhận quà thành công. Đang chuyển trang...');
          _context1.n = 6;
          return waitForDefaultLoading(claimLoadingStartedAt, claimLoadingMinDuration);
        case 6:
          stopLoadingSequence(claimLoadingToken);

          // Show thank you page with claim details
          showThankYouPage({
            method: 'Giao hàng',
            address: formData.address,
            playerName: formData.name,
            playerPhone: formData.phone,
            playerAddress: formData.address,
            confirmationCode: ((_result3 = _result2) === null || _result3 === void 0 || (_result3 = _result3.data) === null || _result3 === void 0 ? void 0 : _result3.confirmationCode) || ''
          });
          _context1.n = 9;
          break;
        case 7:
          _context1.p = 7;
          _t7 = _context1.v;
          _context1.n = 8;
          return waitForDefaultLoading(claimLoadingStartedAt, claimLoadingMinDuration);
        case 8:
          stopLoadingSequence(claimLoadingToken);
          showToast('❌ Lỗi từ server. Vui lòng thử lại sau.', '❌');
        case 9:
          _context1.p = 9;
          setButtonLoading('claimSubmitBtn', false);
          return _context1.f(9);
        case 10:
          return _context1.a(2);
      }
    }, _callee1, null, [[1, 7, 9, 10]]);
  }));
  return _submitClaim.apply(this, arguments);
}
function convertToMoney() {
  return _convertToMoney.apply(this, arguments);
} // ===== UPDATE BUTTON STATES BASED ON USER CHOICE =====
function _convertToMoney() {
  _convertToMoney = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
    var convertLoadingMinDuration, convertLoadingStartedAt, convertLoadingToken, _state$currentPrize5, response, _result4, errorMsg, resultWinOverlay, displayAmount, _t8;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          if (!(!state.sessionCode || !state.currentPrize)) {
            _context10.n = 1;
            break;
          }
          return _context10.a(2);
        case 1:
          if (!isUnluckyPrize(state.currentPrize)) {
            _context10.n = 2;
            break;
          }
          showToast('💔 Phần thưởng xui lỗi! Không thể đổi sang tiền mặt.', '❌');
          return _context10.a(2);
        case 2:
          // Mark that user chose to convert (prevent claiming)
          state.userChosenAction = 'convert';
          updateExchangeButtonStates();
          convertLoadingMinDuration = getDefaultLoadingDurationMs();
          convertLoadingStartedAt = Date.now();
          convertLoadingToken = startLoadingSequence('Đang gửi yêu cầu quy đổi tiền', ['Đang tạo yêu cầu quy đổi...', 'Đang đối soát giá trị phần thưởng...', 'Đang gửi yêu cầu chờ admin duyệt...', 'Sắp hoàn tất, đang cập nhật ví phiên...'], Math.max(500, Math.floor(convertLoadingMinDuration / 4)));
          _context10.p = 3;
          _context10.n = 4;
          return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/convert"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              boxNumber: ((_state$currentPrize5 = state.currentPrize) === null || _state$currentPrize5 === void 0 ? void 0 : _state$currentPrize5.boxNumber) || null
            })
          });
        case 4:
          response = _context10.v;
          _context10.n = 5;
          return response.json();
        case 5:
          _result4 = _context10.v;
          if (_result4.success) {
            _context10.n = 7;
            break;
          }
          _context10.n = 6;
          return waitForDefaultLoading(convertLoadingStartedAt, convertLoadingMinDuration);
        case 6:
          stopLoadingSequence(convertLoadingToken);
          errorMsg = resolveRequestError(response, _result4, 'Không thể gửi yêu cầu quy đổi.');
          showToast('❌ ' + errorMsg, '❌');
          return _context10.a(2);
        case 7:
          updateLoadingOverlayMessage('Yêu cầu quy đổi đã gửi thành công. Đang mở ví phiên...');
          _context10.n = 8;
          return waitForDefaultLoading(convertLoadingStartedAt, convertLoadingMinDuration);
        case 8:
          stopLoadingSequence(convertLoadingToken);
          resultWinOverlay = document.getElementById('resultWinOverlay');
          if (resultWinOverlay) {
            resultWinOverlay.classList.remove('active');
            resultWinOverlay.style.removeProperty('display');
            resultWinOverlay.style.removeProperty('visibility');
            resultWinOverlay.style.removeProperty('opacity');
          }
          displayAmount = Math.floor(_result4.cashAmount || 0).toLocaleString('vi-VN');
          showToast('⏳ Yêu cầu quy đổi ' + displayAmount + ' đ đã gửi, đang chờ duyệt.', '⏳');
          if (typeof lmbManager !== 'undefined') {
            lmbManager.confirmCurrentBox();
          }

          // Go to wallet page to track pending conversion status
          showPage('wallet', {
            skipDataLoad: true
          });
          state.convertedAmount = _result4.cashAmount;

          // Refresh wallet to show the new converted amount
          setTimeout(function () {
            loadWallet({
              showLoader: false
            });
          }, 300);
          setTimeout(function () {
            loadOpenedPrizes();
            loadExchangeOptions();
          }, 350);
          _context10.n = 11;
          break;
        case 9:
          _context10.p = 9;
          _t8 = _context10.v;
          _context10.n = 10;
          return waitForDefaultLoading(convertLoadingStartedAt, convertLoadingMinDuration);
        case 10:
          stopLoadingSequence(convertLoadingToken);
          showToast('❌ Lỗi từ server. Vui lòng thử lại sau.', '❌');
        case 11:
          return _context10.a(2);
      }
    }, _callee10, null, [[3, 9]]);
  }));
  return _convertToMoney.apply(this, arguments);
}
function updateExchangeButtonStates() {
  var claimBtn = document.querySelector('.btn-claim');
  var convertBtn = document.querySelector('.btn-convert');
  if (!claimBtn || !convertBtn) return;

  // Disable claim button if user chose convert
  if (state.userChosenAction === 'convert') {
    claimBtn.style.opacity = '0.5';
    claimBtn.style.pointerEvents = 'none';
    claimBtn.style.cursor = 'not-allowed';
    claimBtn.title = 'Bạn đã chọn đổi sang tiền. Không thể nhận quà!';
  }
  // Disable convert button if user chose claim
  else if (state.userChosenAction === 'claim') {
    convertBtn.style.opacity = '0.5';
    convertBtn.style.pointerEvents = 'none';
    convertBtn.style.cursor = 'not-allowed';
    convertBtn.title = 'Bạn đã chọn nhận quà. Không thể đổi sang tiền!';
  }
}

// ===== LOAD WALLET & INVENTORY =====
// ===== LOAD WALLET & INVENTORY =====
function loadWallet() {
  return _loadWallet.apply(this, arguments);
} // Update wallet display based on current state.balance
function _loadWallet() {
  _loadWallet = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
    var options,
      showLoader,
      walletTask,
      _args12 = arguments;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          options = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : {};
          if (state.sessionCode) {
            _context12.n = 1;
            break;
          }
          return _context12.a(2);
        case 1:
          showLoader = options.showLoader === true;
          walletTask = /*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
              var walletSessionCodeEl, response, _result5, data, toNum, fmt, balance, withdrawn, pending, pendingConversion, used, remaining, trustScore, walletBalanceEl, navWalletEl, remainingEl, walletTotalEl, walletWithdrawnEl, walletPendingConversionEl, chooseTrustScoreEl, _t9;
              return _regenerator().w(function (_context11) {
                while (1) switch (_context11.p = _context11.n) {
                  case 0:
                    _context11.p = 0;
                    // Update session code display
                    walletSessionCodeEl = document.getElementById('walletSessionCode');
                    if (walletSessionCodeEl) {
                      walletSessionCodeEl.textContent = state.sessionCode;
                    }
                    _context11.n = 1;
                    return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/wallet"));
                  case 1:
                    response = _context11.v;
                    _context11.n = 2;
                    return response.json();
                  case 2:
                    _result5 = _context11.v;
                    if (_result5.success) {
                      _context11.n = 3;
                      break;
                    }
                    showToast('❌ Lỗi khi tải ví', '❌');
                    return _context11.a(2);
                  case 3:
                    // Update wallet UI with fresh data
                    data = _result5.data || {};
                    toNum = function toNum(v) {
                      return Number(v) || 0;
                    };
                    fmt = function fmt(v) {
                      return Math.floor(toNum(v)).toLocaleString('vi-VN') + ' đ';
                    };
                    balance = toNum(data.balance);
                    withdrawn = toNum(data.withdrawn);
                    pending = toNum(data.pending);
                    pendingConversion = toNum(data.pending_conversion);
                    used = Number.isFinite(Number(data.used)) ? toNum(data.used) : withdrawn + pending;
                    remaining = Number.isFinite(Number(data.remaining)) ? Math.max(0, toNum(data.remaining)) : Math.max(0, balance - used);
                    trustScore = Number(data.trust_score);
                    walletBalanceEl = document.getElementById('walletBalance');
                    navWalletEl = document.getElementById('navWalletAmount');
                    remainingEl = document.getElementById('walletRemaining');
                    walletTotalEl = document.getElementById('walletTotal');
                    walletWithdrawnEl = document.getElementById('walletWithdrawn');
                    walletPendingConversionEl = document.getElementById('walletPendingConversion');
                    if (walletBalanceEl) walletBalanceEl.textContent = fmt(remaining);
                    if (navWalletEl) navWalletEl.textContent = fmt(remaining);
                    if (walletTotalEl) walletTotalEl.textContent = fmt(balance);
                    if (walletWithdrawnEl) walletWithdrawnEl.textContent = fmt(withdrawn);
                    if (walletPendingConversionEl) walletPendingConversionEl.textContent = fmt(pendingConversion);
                    if (remainingEl) remainingEl.textContent = fmt(remaining);
                    chooseTrustScoreEl = document.getElementById('chooseTrustScore');
                    if (chooseTrustScoreEl) {
                      chooseTrustScoreEl.textContent = Number.isFinite(trustScore) ? Math.max(0, Math.min(100, Math.round(trustScore))).toString() : '--';
                    }
                    state.walletTransactions = Array.isArray(data.transactions) ? data.transactions : [];
                    state.walletTxFilter = 'all';
                    state.walletTxPage = 1;
                    renderTxList(state.walletTxFilter, state.walletTransactions);
                    _context11.n = 5;
                    break;
                  case 4:
                    _context11.p = 4;
                    _t9 = _context11.v;
                    showToast('❌ Lỗi: ' + _t9.message, '❌');
                  case 5:
                    return _context11.a(2);
                }
              }, _callee11, null, [[0, 4]]);
            }));
            return function walletTask() {
              return _ref4.apply(this, arguments);
            };
          }();
          if (!showLoader) {
            _context12.n = 3;
            break;
          }
          _context12.n = 2;
          return withGlobalPageLoader('Đang tải ví phiên...', walletTask, {
            minVisibleMs: 360
          });
        case 2:
          return _context12.a(2);
        case 3:
          _context12.n = 4;
          return walletTask();
        case 4:
          return _context12.a(2);
      }
    }, _callee12);
  }));
  return _loadWallet.apply(this, arguments);
}
function updateWalletDisplay() {
  var fmt = function fmt(v) {
    return Math.floor(v || 0).toLocaleString('vi-VN') + ' đ';
  };
  var balance = state.balance || 0;
  var walletBalanceEl = document.getElementById('walletBalance');
  var navWalletEl = document.getElementById('navWalletAmount');
  if (walletBalanceEl) {
    walletBalanceEl.textContent = fmt(balance);
  }
  if (navWalletEl) {
    navWalletEl.textContent = fmt(balance);
  }
}
function loadInventory() {
  return _loadInventory.apply(this, arguments);
} // ===== TRANSACTION LIST RENDERING =====
function _loadInventory() {
  _loadInventory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
    var options,
      showLoader,
      inventoryTask,
      _args14 = arguments;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.n) {
        case 0:
          options = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : {};
          if (state.sessionCode) {
            _context14.n = 1;
            break;
          }
          return _context14.a(2);
        case 1:
          showLoader = options.showLoader === true;
          inventoryTask = /*#__PURE__*/function () {
            var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
              var inventorySessionCodeEl, response, _result6, cont, items, _t0;
              return _regenerator().w(function (_context13) {
                while (1) switch (_context13.p = _context13.n) {
                  case 0:
                    _context13.p = 0;
                    // Update session code display
                    inventorySessionCodeEl = document.getElementById('inventorySessionCode');
                    if (inventorySessionCodeEl) {
                      inventorySessionCodeEl.textContent = state.sessionCode;
                    }
                    _context13.n = 1;
                    return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/inventory"));
                  case 1:
                    response = _context13.v;
                    _context13.n = 2;
                    return response.json();
                  case 2:
                    _result6 = _context13.v;
                    if (_result6.success) {
                      _context13.n = 3;
                      break;
                    }
                    showToast('❌ Lỗi khi tải kho', '❌');
                    return _context13.a(2);
                  case 3:
                    // Update inventory UI with fresh data
                    cont = document.getElementById('inventoryContent');
                    items = _result6.data || [];
                    if (!(items.length === 0)) {
                      _context13.n = 4;
                      break;
                    }
                    cont.innerHTML = "\n          <div class=\"empty-state\">\n            <span class=\"empty-state-icon\">\uD83D\uDCE6</span>\n            <div class=\"empty-state-title\">Kho v\u1EADt ph\u1EA9m tr\u1ED1ng</div>\n            <div class=\"empty-state-desc\">B\u1EA1n ch\u01B0a c\xF3 v\u1EADt ph\u1EA9m n\xE0o. H\xE3y m\u1EDF h\u1ED9p qu\xE0 \u0111\u1EC3 nh\u1EADn ph\u1EA7n th\u01B0\u1EDFng!</div>\n          </div>";
                    return _context13.a(2);
                  case 4:
                    cont.innerHTML = "<div class=\"inventory-grid\">".concat(items.map(function (item, idx) {
                      var status = item.status || 'pending';
                      var isApproved = status === 'approved';
                      var isPending = status === 'pending';
                      var isRejected = status === 'rejected';

                      // Get prize name with fallback
                      var prizeName = item.prizeName || item.prize_name || 'Phần quà';
                      var recipientName = item.recipientName || 'N/A';
                      var statusBadge = '';
                      if (isApproved) {
                        statusBadge = "\n              <div style=\"background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);border-radius:10px;padding:8px 12px;font-size:12px;font-weight:600;color:#34d399;text-align:center;margin-top:12px\">\n                \u2705 \u0110\xE3 x\xE1c nh\u1EADn<br>\n                <span style=\"font-weight:400;opacity:.8;font-size:11px\">Ng\u01B0\u1EDDi nh\u1EADn: ".concat(recipientName, "</span>\n              </div>");
                      } else if (isPending) {
                        statusBadge = "\n              <div style=\"background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.4);border-radius:10px;padding:8px 12px;font-size:12px;font-weight:600;color:#60a5fa;text-align:center;margin-top:12px\">\n                \u23F3 Ch\u1EDD x\xE1c nh\u1EADn\n              </div>";
                      } else if (isRejected) {
                        statusBadge = "\n              <div style=\"background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);border-radius:10px;padding:8px 12px;font-size:12px;font-weight:600;color:#f87171;text-align:center;margin-top:12px\">\n                \u274C Y\xEAu c\u1EA7u b\u1ECB t\u1EEB ch\u1ED1i\n              </div>";
                      }
                      return "\n          <div class=\"inventory-item-card\">\n            <div style=\"text-align: center; margin-bottom: 12px; min-height: 80px; display: flex; align-items: center; justify-content: center; background: var(--bg4); border-radius: 8px; overflow: hidden;\">\n              ".concat(item.prizeImage && item.prizeImage.trim() ? "<img src=\"".concat(item.prizeImage, "\" alt=\"").concat(prizeName, "\" style=\"max-width: 100%; max-height: 80px; object-fit: contain;\" onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\">") : '', " \n              <div style=\"display: ").concat(item.prizeImage && item.prizeImage.trim() ? 'none' : 'flex', "; font-size: 48px; align-items: center; justify-content: center;\">").concat(item.prizeIcon || '🎁', "</div>\n            </div>\n            <div class=\"inventory-item-name\">").concat(prizeName, "</div>\n            <div class=\"inventory-item-val\">H\u1ED9p #").concat(item.boxNumber, "</div>\n            ").concat(statusBadge, "\n          </div>");
                    }).join(''), "</div>");
                    _context13.n = 6;
                    break;
                  case 5:
                    _context13.p = 5;
                    _t0 = _context13.v;
                    showToast('❌ Lỗi: ' + _t0.message, '❌');
                  case 6:
                    return _context13.a(2);
                }
              }, _callee13, null, [[0, 5]]);
            }));
            return function inventoryTask() {
              return _ref5.apply(this, arguments);
            };
          }();
          if (!showLoader) {
            _context14.n = 3;
            break;
          }
          _context14.n = 2;
          return withGlobalPageLoader('Đang tải kho đồ...', inventoryTask, {
            minVisibleMs: 320
          });
        case 2:
          return _context14.a(2);
        case 3:
          _context14.n = 4;
          return inventoryTask();
        case 4:
          return _context14.a(2);
      }
    }, _callee14);
  }));
  return _loadInventory.apply(this, arguments);
}
function renderTxList(_x7, _x8) {
  return _renderTxList.apply(this, arguments);
}
function _renderTxList() {
  _renderTxList = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(filter, transactions) {
    var list, pagination, txs, filterParam, response, _result7, pageSize, totalPages, startIndex, pageItems, maxPagesToShow, startPage, endPage, html, page, isActive, _t1;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          list = document.getElementById('txList');
          pagination = document.getElementById('txPagination');
          if (list) {
            _context15.n = 1;
            break;
          }
          return _context15.a(2);
        case 1:
          _context15.p = 1;
          txs = transactions || []; // If no transactions provided, fetch them
          if (!(!transactions && state.sessionCode)) {
            _context15.n = 6;
            break;
          }
          if (!(Array.isArray(state.walletTransactions) && state.walletTransactions.length > 0)) {
            _context15.n = 2;
            break;
          }
          txs = state.walletTransactions;
          _context15.n = 6;
          break;
        case 2:
          filterParam = filter && filter !== 'all' ? "?filter=".concat(filter) : '';
          _context15.n = 3;
          return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/transactions").concat(filterParam));
        case 3:
          response = _context15.v;
          _context15.n = 4;
          return response.json();
        case 4:
          _result7 = _context15.v;
          if (_result7.success) {
            _context15.n = 5;
            break;
          }
          list.innerHTML = "<div class=\"empty-state\" style=\"padding:40px 0\">\n            <div class=\"empty-state-title\" style=\"font-size:15px\">L\u1ED7i khi t\u1EA3i giao d\u1ECBch</div>\n          </div>";
          return _context15.a(2);
        case 5:
          txs = _result7.data || [];
        case 6:
          if (filter && filter !== 'all') {
            txs = txs.filter(function (tx) {
              if (filter === 'withdraw') {
                return String(tx.type || '').startsWith('withdraw') || tx.type === 'cash_prize';
              }
              if (filter === 'exchange') {
                return String(tx.type || '').startsWith('conversion') || tx.type === 'exchange';
              }
              if (filter === 'win') {
                return tx.type === 'win';
              }
              return true;
            });
          }
          if (!(txs.length === 0)) {
            _context15.n = 7;
            break;
          }
          list.innerHTML = "<div class=\"empty-state\" style=\"padding:40px 0\">\n          <div class=\"empty-state-title\" style=\"font-size:15px\">Ch\u01B0a c\xF3 giao d\u1ECBch n\xE0o</div>\n          <div class=\"empty-state-desc\">M\u1EDF h\u1ED9p qu\xE0 \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u!</div>\n        </div>";
          if (pagination) pagination.innerHTML = '';
          return _context15.a(2);
        case 7:
          pageSize = Math.max(1, Number(state.walletTxPageSize) || 6);
          totalPages = Math.max(1, Math.ceil(txs.length / pageSize));
          if (state.walletTxPage > totalPages) state.walletTxPage = totalPages;
          if (state.walletTxPage < 1) state.walletTxPage = 1;
          startIndex = (state.walletTxPage - 1) * pageSize;
          pageItems = txs.slice(startIndex, startIndex + pageSize);
          list.innerHTML = pageItems.map(function (tx) {
            var amount = tx.amount || 0;
            var status = tx.status || 'pending';
            var isWithdraw = (tx.type || '') === 'withdraw' || (tx.type || '') === 'cash_prize';
            var isConversion = String(tx.type || '').startsWith('conversion');
            var statusColor = status === 'approved' ? '#34d399' : status === 'rejected' ? '#f87171' : '#fbbf24';
            var statusText = status === 'approved' ? isConversion ? '✅ Đã cộng vào ví phiên' : '✅ Hoàn thành' : status === 'rejected' ? '❌ Bị từ chối' : isConversion ? '⏳ Chờ duyệt quy đổi vào ví' : '⏳ Chờ duyệt';
            var txName = isConversion ? '💱 Quy đổi vào ví' : isWithdraw ? '💰 Rút tiền' : '📋 ' + (tx.type || 'Giao dịch');
            var txDate = new Date(tx.requestedAt || tx.requested_at || Date.now()).toLocaleDateString('vi-VN');
            return "\n          <div class=\"tx-item\">\n            <div class=\"tx-icon\">\n              <svg width=\"16\" height=\"16\" fill=\"none\" viewBox=\"0 0 24 24\">\n                <polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n              </svg>\n            </div>\n            <div class=\"tx-info\">\n              <div class=\"tx-name\">".concat(txName, "</div>\n              <div class=\"tx-date\">").concat(txDate, "</div>\n            </div>\n            <div style=\"text-align:right\">\n              <div class=\"tx-amount\">").concat(isWithdraw ? '-' : '+').concat(Math.floor(amount).toLocaleString('vi-VN'), " \u0111</div>\n              <div class=\"tx-status\" style=\"color:").concat(statusColor, "\">").concat(statusText, "</div>\n            </div>\n          </div>");
          }).join('');
          if (pagination) {
            if (totalPages <= 1) {
              pagination.innerHTML = '';
            } else {
              maxPagesToShow = 5;
              startPage = Math.max(1, state.walletTxPage - Math.floor(maxPagesToShow / 2));
              endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
              if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
              }
              html = '';
              html += "<button type=\"button\" onclick=\"setWalletTxPage(".concat(state.walletTxPage - 1, ")\" ").concat(state.walletTxPage === 1 ? 'disabled' : '', " style=\"padding:6px 10px;border-radius:8px;border:1px solid rgba(148,163,184,.35);background:var(--bg4);color:var(--text);cursor:pointer;\">\u2039</button>");
              for (page = startPage; page <= endPage; page++) {
                isActive = page === state.walletTxPage;
                html += "<button type=\"button\" onclick=\"setWalletTxPage(".concat(page, ")\" style=\"min-width:34px;padding:6px 10px;border-radius:8px;border:1px solid ").concat(isActive ? 'rgba(59,130,246,.65)' : 'rgba(148,163,184,.35)', ";background:").concat(isActive ? 'rgba(59,130,246,.2)' : 'var(--bg4)', ";color:").concat(isActive ? '#93c5fd' : 'var(--text)', ";cursor:pointer;font-weight:").concat(isActive ? '700' : '500', ";\">").concat(page, "</button>");
              }
              html += "<button type=\"button\" onclick=\"setWalletTxPage(".concat(state.walletTxPage + 1, ")\" ").concat(state.walletTxPage === totalPages ? 'disabled' : '', " style=\"padding:6px 10px;border-radius:8px;border:1px solid rgba(148,163,184,.35);background:var(--bg4);color:var(--text);cursor:pointer;\">\u203A</button>");
              html += "<span style=\"font-size:12px;color:var(--text-dim);margin-left:4px;\">Trang ".concat(state.walletTxPage, "/").concat(totalPages, "</span>");
              pagination.innerHTML = html;
            }
          }
          _context15.n = 9;
          break;
        case 8:
          _context15.p = 8;
          _t1 = _context15.v;
          showToast('❌ Lỗi: ' + _t1.message, '❌');
        case 9:
          return _context15.a(2);
      }
    }, _callee15, null, [[1, 8]]);
  }));
  return _renderTxList.apply(this, arguments);
}
function setWalletTxPage(page) {
  state.walletTxPage = Math.max(1, Number(page) || 1);
  renderTxList(state.walletTxFilter || 'all', state.walletTransactions);
}
function filterTx(type, el) {
  document.querySelectorAll('.tx-tab').forEach(function (t) {
    return t.classList.remove('active');
  });
  el.classList.add('active');
  state.walletTxFilter = type;
  state.walletTxPage = 1;
  renderTxList(type, state.walletTransactions);
}

// ===== SEARCH =====
function searchSession() {
  return _searchSession.apply(this, arguments);
} // ===== WITHDRAW =====
function _searchSession() {
  _searchSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
    var code, res, response, _result8, _t10;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.p = _context16.n) {
        case 0:
          code = document.getElementById('searchInput').value.trim();
          res = document.getElementById('searchResult');
          if (code) {
            _context16.n = 1;
            break;
          }
          res.innerHTML = "<div class=\"empty-state\" style=\"padding:40px 0\">\n        <div class=\"empty-state-title\">Vui l\xF2ng nh\u1EADp m\xE3 phi\xEAn</div>\n      </div>";
          return _context16.a(2);
        case 1:
          _context16.p = 1;
          _context16.n = 2;
          return fetch("/api/lucky-mystery-box/search?code=".concat(encodeURIComponent(code)));
        case 2:
          response = _context16.v;
          _context16.n = 3;
          return response.json();
        case 3:
          _result8 = _context16.v;
          if (_result8.success) {
            res.innerHTML = "<div class=\"search-result-card\">\n          <div class=\"search-result-title\">\u2705 K\u1EBFt qu\u1EA3 tra c\u1EE9u phi\xEAn: <strong style=\"color:var(--purple-light)\">".concat(code, "</strong></div>\n          <div style=\"font-size:13px;color:var(--text-dim);margin-bottom:8px\">Tr\u1EA1ng th\xE1i: <span style=\"color:var(--green);font-weight:700\">\u0110ang ho\u1EA1t \u0111\u1ED9ng</span></div>\n          <div style=\"font-size:13px;color:var(--text-dim)\">S\u1ED1 d\u01B0: <strong style=\"color:var(--text)\">").concat(Math.floor(_result8.data.wallet.balance).toLocaleString('vi-VN'), " \u0111</strong></div>\n          <div style=\"font-size:13px;color:var(--text-dim);margin-top:4px\">V\u1EADt ph\u1EA9m: <strong style=\"color:var(--text)\">").concat(_result8.data.inventory.length, " item</strong></div>\n        </div>");
          } else {
            res.innerHTML = "<div class=\"search-result-card\" style=\"border-color:rgba(239,68,68,.3)\">\n          <div class=\"search-result-title\" style=\"color:#f87171\">\u274C Kh\xF4ng t\xECm th\u1EA5y phi\xEAn: <strong>".concat(code, "</strong></div>\n          <div style=\"font-size:13px;color:var(--text-dim)\">M\xE3 phi\xEAn kh\xF4ng t\u1ED3n t\u1EA1i ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n.</div>\n        </div>");
          }
          _context16.n = 5;
          break;
        case 4:
          _context16.p = 4;
          _t10 = _context16.v;
          showToast('❌ Lỗi: ' + _t10.message, '❌');
        case 5:
          return _context16.a(2);
      }
    }, _callee16, null, [[1, 4]]);
  }));
  return _searchSession.apply(this, arguments);
}
function openWithdrawModal() {
  return _openWithdrawModal.apply(this, arguments);
}
function _openWithdrawModal() {
  _openWithdrawModal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.n) {
        case 0:
          if (!(typeof game !== 'undefined' && isUnluckyPrize(game.prize))) {
            _context18.n = 1;
            break;
          }
          showToast('💔 Phần thưởng xui lỗi! Không thể đổi sang tiền mặt.', '❌');
          return _context18.a(2);
        case 1:
          if (validateSession()) {
            _context18.n = 2;
            break;
          }
          showToast('❌ Phiên của bạn đã hết hạn. Vui lòng tham gia phiên mới.', '❌');
          return _context18.a(2);
        case 2:
          if (!(!state.sessionCode || state.sessionCode.trim() === '')) {
            _context18.n = 3;
            break;
          }
          showToast('❌ Lỗi: Không có mã phiên. Vui lòng tham gia phiên trước.', '❌');
          return _context18.a(2);
        case 3:
          _context18.n = 4;
          return withGlobalPageLoader('Đang mở biểu mẫu rút tiền...', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
            var balance, walletResponse, walletData, trustScore, _toNum, apiBalance, apiWithdrawn, apiRemaining, walletBalanceEl, balanceText, withdrawProfile, savedName, savedPhone, savedEmail, withdrawCustomerName, withdrawCustomerPhone, withdrawCustomerEmail, withdrawBank, withdrawAccount, withdrawName, withdrawAmount, modalBalance, withdrawModal, submitBtn, _t11;
            return _regenerator().w(function (_context17) {
              while (1) switch (_context17.p = _context17.n) {
                case 0:
                  // ✅ Fetch balance from API first (more reliable)
                  balance = 0;
                  _context17.p = 1;
                  _context17.n = 2;
                  return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/wallet"));
                case 2:
                  walletResponse = _context17.v;
                  if (!walletResponse.ok) {
                    _context17.n = 5;
                    break;
                  }
                  _context17.n = 3;
                  return walletResponse.json();
                case 3:
                  walletData = _context17.v;
                  if (!(walletData.success && walletData.data)) {
                    _context17.n = 5;
                    break;
                  }
                  trustScore = Number(walletData.data.trust_score);
                  if (!(Number.isFinite(trustScore) && trustScore < 100)) {
                    _context17.n = 4;
                    break;
                  }
                  showToast('Điểm tín nhiệm quá thấp hiện chưa thể rút tiền. Vui lòng liên hệ với nhân viên để được hỗ trợ!', '❌');
                  return _context17.a(2);
                case 4:
                  _toNum = function _toNum(v) {
                    return Number(v) || 0;
                  };
                  apiBalance = _toNum(walletData.data.balance);
                  apiWithdrawn = _toNum(walletData.data.withdrawn);
                  apiRemaining = Number.isFinite(Number(walletData.data.remaining)) ? _toNum(walletData.data.remaining) : Math.max(0, apiBalance - apiWithdrawn);
                  balance = apiRemaining;
                case 5:
                  _context17.n = 7;
                  break;
                case 6:
                  _context17.p = 6;
                  _t11 = _context17.v;
                case 7:
                  // Fallback: Try to get from DOM if API fetch fails or returns 0
                  if (balance <= 0) {
                    walletBalanceEl = document.getElementById('walletBalance');
                    if (walletBalanceEl && walletBalanceEl.textContent) {
                      balanceText = walletBalanceEl.textContent.replace(/\s*đ\s*$/, '').replace(/,/g, '');
                      balance = parseInt(balanceText) || 0;
                    }
                  }

                  // Check existing withdrawals only to prefill contact/bank information
                  _context17.n = 8;
                  return checkExistingWithdrawal();
                case 8:
                  if (!(balance <= 0)) {
                    _context17.n = 9;
                    break;
                  }
                  showToast('❌ Bạn không có số tiền để rút.', '❌');
                  return _context17.a(2);
                case 9:
                  // ✅ IMPORTANT: Save balance to state for later use in confirmWithdraw
                  state.balance = balance;

                  // Prefill contact info from state/localStorage (won't overwrite values set by checkExistingWithdrawal)
                  withdrawProfile = loadSessionProfile('withdrawProfile', {});
                  savedName = state.playerName || withdrawProfile.customerName || localStorage.getItem('lmbPlayerName') || '';
                  savedPhone = state.playerPhone || withdrawProfile.customerPhone || localStorage.getItem('lmbPlayerPhone') || '';
                  savedEmail = state.playerEmail || withdrawProfile.customerEmail || localStorage.getItem('lmbPlayerEmail') || '';
                  withdrawCustomerName = document.getElementById('withdrawCustomerName');
                  withdrawCustomerPhone = document.getElementById('withdrawCustomerPhone');
                  withdrawCustomerEmail = document.getElementById('withdrawCustomerEmail');
                  withdrawBank = document.getElementById('withdrawBank');
                  withdrawAccount = document.getElementById('withdrawAccount');
                  withdrawName = document.getElementById('withdrawName');
                  withdrawAmount = document.getElementById('withdrawAmount');
                  if (withdrawCustomerName && !withdrawCustomerName.value) withdrawCustomerName.value = savedName;
                  if (withdrawCustomerPhone && !withdrawCustomerPhone.value) withdrawCustomerPhone.value = savedPhone;
                  if (withdrawCustomerEmail && !withdrawCustomerEmail.value) withdrawCustomerEmail.value = savedEmail;
                  if (withdrawBank && !withdrawBank.value && withdrawProfile.bankName) withdrawBank.value = withdrawProfile.bankName;
                  if (withdrawAccount && !withdrawAccount.value && withdrawProfile.accountNumber) withdrawAccount.value = withdrawProfile.accountNumber;
                  if (withdrawName && !withdrawName.value && withdrawProfile.accountHolder) withdrawName.value = withdrawProfile.accountHolder;
                  if (withdrawAmount && !withdrawAmount.value && withdrawProfile.amount) {
                    withdrawAmount.value = formatMoneyComma(withdrawProfile.amount);
                  }
                  if (withdrawAmount) bindMoneyCommaInput(withdrawAmount);
                  modalBalance = document.getElementById('modalBalance');
                  if (modalBalance) {
                    modalBalance.textContent = formatMoneyComma(balance) + ' đ';
                  }
                  withdrawModal = document.getElementById('withdrawModal');
                  if (withdrawModal) {
                    clearFieldErrors(['withdrawCustomerName', 'withdrawCustomerPhone', 'withdrawCustomerEmail', 'withdrawBank', 'withdrawAccount', 'withdrawName', 'withdrawAmount']);
                    submitBtn = document.getElementById('withdrawSubmitBtn');
                    if (submitBtn) submitBtn.textContent = 'Xác nhận rút tiền';
                    withdrawModal.classList.add('active');
                  }
                case 10:
                  return _context17.a(2);
              }
            }, _callee17, null, [[1, 6]]);
          })), {
            light: true,
            minVisibleMs: 220
          });
        case 4:
          return _context18.a(2);
      }
    }, _callee18);
  }));
  return _openWithdrawModal.apply(this, arguments);
}
function closeWithdrawModal() {
  document.getElementById('withdrawModal').classList.remove('active');
  clearFieldErrors(['withdrawCustomerName', 'withdrawCustomerPhone', 'withdrawCustomerEmail', 'withdrawBank', 'withdrawAccount', 'withdrawName', 'withdrawAmount']);
  var noticeEl = document.getElementById('existingWithdrawalNotice');
  if (noticeEl) {
    noticeEl.textContent = '';
    noticeEl.style.display = 'none';
  }
  var submitBtn = document.getElementById('withdrawSubmitBtn');
  if (submitBtn) submitBtn.textContent = 'Xác nhận rút tiền';
  var amountField = document.getElementById('withdrawAmount');
  if (amountField) amountField.disabled = false;
  state.existingWithdrawalId = null;
  state.isUpdatingWithdrawal = false;
}
function checkExistingWithdrawal() {
  return _checkExistingWithdrawal.apply(this, arguments);
}
function _checkExistingWithdrawal() {
  _checkExistingWithdrawal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
    var response, _result9, sorted, latestWithdrawal, nameField, contactNameField, contactPhoneField, contactEmailField, accountField, bankField, _t12;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.p = _context19.n) {
        case 0:
          _context19.p = 0;
          _context19.n = 1;
          return fetch("/api/withdrawals/session/".concat(state.sessionCode));
        case 1:
          response = _context19.v;
          _context19.n = 2;
          return response.json();
        case 2:
          _result9 = _context19.v;
          if (!(!_result9.success || !_result9.data || _result9.data.length === 0)) {
            _context19.n = 3;
            break;
          }
          return _context19.a(2);
        case 3:
          sorted = _toConsumableArray(_result9.data).sort(function (a, b) {
            var ta = new Date(a.requested_at || a.created_at || a.createdAt || 0).getTime();
            var tb = new Date(b.requested_at || b.created_at || b.createdAt || 0).getTime();
            return tb - ta;
          });
          latestWithdrawal = sorted[0];
          if (latestWithdrawal) {
            _context19.n = 4;
            break;
          }
          return _context19.a(2);
        case 4:
          // Always create new requests; only prefill beneficiary/contact information.
          state.existingWithdrawalId = null;
          state.isUpdatingWithdrawal = false;
          if (latestWithdrawal.account_holder) {
            nameField = document.getElementById('withdrawName');
            if (nameField && !nameField.value) nameField.value = latestWithdrawal.account_holder;
          }
          if (latestWithdrawal.customer_name) {
            contactNameField = document.getElementById('withdrawCustomerName');
            if (contactNameField && !contactNameField.value) contactNameField.value = latestWithdrawal.customer_name;
          }
          if (latestWithdrawal.customer_phone) {
            contactPhoneField = document.getElementById('withdrawCustomerPhone');
            if (contactPhoneField && !contactPhoneField.value) contactPhoneField.value = latestWithdrawal.customer_phone;
          }
          if (latestWithdrawal.customer_email) {
            contactEmailField = document.getElementById('withdrawCustomerEmail');
            if (contactEmailField && !contactEmailField.value) contactEmailField.value = latestWithdrawal.customer_email;
          }
          if (latestWithdrawal.account_number) {
            accountField = document.getElementById('withdrawAccount');
            if (accountField && !accountField.value) accountField.value = latestWithdrawal.account_number;
          }
          if (latestWithdrawal.bank_name) {
            bankField = document.getElementById('withdrawBank');
            if (bankField && !bankField.value) bankField.value = latestWithdrawal.bank_name;
          }
          _context19.n = 6;
          break;
        case 5:
          _context19.p = 5;
          _t12 = _context19.v;
        case 6:
          return _context19.a(2);
      }
    }, _callee19, null, [[0, 5]]);
  }));
  return _checkExistingWithdrawal.apply(this, arguments);
}
function confirmWithdraw() {
  var _document$getElementB, _document$getElementB2, _document$getElementB3, _document$getElementB4, _document$getElementB5, _document$getElementB6;
  var submitBtn = document.getElementById('withdrawSubmitBtn');
  if (submitBtn) submitBtn.textContent = 'Xác nhận rút tiền';
  var customerName = ((_document$getElementB = document.getElementById('withdrawCustomerName')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value.trim()) || '';
  var customerPhone = ((_document$getElementB2 = document.getElementById('withdrawCustomerPhone')) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.value.trim()) || '';
  var customerEmail = ((_document$getElementB3 = document.getElementById('withdrawCustomerEmail')) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value.trim()) || '';
  var accountNumber = ((_document$getElementB4 = document.getElementById('withdrawAccount')) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value.trim()) || '';
  var bankName = ((_document$getElementB5 = document.getElementById('withdrawBank')) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value.trim()) || '';
  var accountHolder = ((_document$getElementB6 = document.getElementById('withdrawName')) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value.trim()) || '';
  var withdrawAmount = document.getElementById('withdrawAmount');

  // ✅ Type conversion: ensure amount is a number
  var amount = withdrawAmount ? parseMoneyInputValue(withdrawAmount.value) : 0;
  clearFieldErrors(['withdrawCustomerName', 'withdrawCustomerPhone', 'withdrawCustomerEmail', 'withdrawBank', 'withdrawAccount', 'withdrawName', 'withdrawAmount']);
  var hasError = false;
  if (!customerName) {
    setFieldError('withdrawCustomerName', 'Vui lòng nhập họ và tên liên hệ.');
    hasError = true;
  }
  if (!customerPhone) {
    setFieldError('withdrawCustomerPhone', 'Vui lòng nhập số điện thoại liên hệ.');
    hasError = true;
  } else if (!/^\d{10,11}$/.test(customerPhone)) {
    setFieldError('withdrawCustomerPhone', 'Số điện thoại phải gồm 10-11 chữ số.');
    hasError = true;
  }
  if (!customerEmail) {
    setFieldError('withdrawCustomerEmail', 'Vui lòng nhập email liên hệ.');
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    setFieldError('withdrawCustomerEmail', 'Email liên hệ không hợp lệ.');
    hasError = true;
  }
  if (!bankName) {
    setFieldError('withdrawBank', 'Vui lòng chọn ngân hàng nhận tiền.');
    hasError = true;
  }
  if (!accountNumber) {
    setFieldError('withdrawAccount', 'Vui lòng nhập số tài khoản.');
    hasError = true;
  }
  if (!accountHolder) {
    setFieldError('withdrawName', 'Vui lòng nhập tên chủ tài khoản.');
    hasError = true;
  }
  if (!amount || isNaN(amount)) {
    setFieldError('withdrawAmount', 'Vui lòng nhập số tiền rút.');
    hasError = true;
  } else if (amount < 10000) {
    setFieldError('withdrawAmount', 'Số tiền tối thiểu là 10.000 VND.');
    hasError = true;
  }
  if (hasError) {
    showToast('❌ Vui lòng kiểm tra lại thông tin rút tiền', '❌');
    return;
  }

  // ✅ Get current balance and ensure it's a number
  var currentBalance = parseFloat(state.balance) || 0;
  if (amount > currentBalance) {
    setFieldError('withdrawAmount', "S\u1ED1 d\u01B0 kh\xF4ng \u0111\u1EE7. Hi\u1EC7n t\u1EA1i: ".concat(currentBalance.toLocaleString('vi-VN'), " \u0111"));
    showToast('❌ Số dư không đủ. Số dư hiện tại: ' + currentBalance.toLocaleString('vi-VN') + ' đ', '❌');
    return;
  }
  submitWithdraw({
    customerName: customerName,
    customerPhone: customerPhone,
    customerEmail: customerEmail,
    accountNumber: accountNumber,
    bankName: bankName,
    accountHolder: accountHolder,
    amount: amount
  });
}
function submitWithdraw(_x9) {
  return _submitWithdraw.apply(this, arguments);
} // ===== CONFETTI =====
function _submitWithdraw() {
  _submitWithdraw = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(formData) {
    var withdrawLoadingMinDuration, withdrawLoadingStartedAt, withdrawLoadingToken, _state$currentPrize6, _result0$data, _result0$data2, url, method, body, response, _result0, errorMsg, withdrawModal, withdrawAccount, withdrawBank, withdrawName, withdrawCustomerName, withdrawCustomerPhone, withdrawCustomerEmail, successMsg, _t13;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.p = _context20.n) {
        case 0:
          setButtonLoading('withdrawSubmitBtn', true, 'Đang gửi yêu cầu...');
          withdrawLoadingMinDuration = getDefaultLoadingDurationMs();
          withdrawLoadingStartedAt = Date.now();
          withdrawLoadingToken = startLoadingSequence('Đang gửi yêu cầu rút tiền', ['Đang gửi thông tin rút tiền...', 'Đang kiểm tra tài khoản ngân hàng nhận tiền...', 'Hệ thống đang ghi nhận yêu cầu chờ duyệt...', 'Sắp hoàn tất, đang chuyển đến trang cảm ơn...'], Math.max(500, Math.floor(withdrawLoadingMinDuration / 4)));
          _context20.p = 1;
          if (!(!state.sessionCode || state.sessionCode.trim() === '')) {
            _context20.n = 3;
            break;
          }
          _context20.n = 2;
          return waitForDefaultLoading(withdrawLoadingStartedAt, withdrawLoadingMinDuration);
        case 2:
          stopLoadingSequence(withdrawLoadingToken);
          showToast('❌ Lỗi: Không có mã phiên. Vui lòng tham gia phiên trước.', '❌');
          return _context20.a(2);
        case 3:
          if (!(!formData.customerName || !formData.customerPhone || !formData.customerEmail || !formData.accountNumber || !formData.bankName || !formData.accountHolder)) {
            _context20.n = 5;
            break;
          }
          _context20.n = 4;
          return waitForDefaultLoading(withdrawLoadingStartedAt, withdrawLoadingMinDuration);
        case 4:
          stopLoadingSequence(withdrawLoadingToken);
          showToast('❌ Vui lòng điền đầy đủ thông tin liên hệ và ngân hàng', '❌');
          return _context20.a(2);
        case 5:
          url = "/api/lucky-mystery-box/".concat(state.sessionCode, "/withdraw");
          method = 'POST';
          body = _objectSpread(_objectSpread({}, formData), {}, {
            boxNumber: ((_state$currentPrize6 = state.currentPrize) === null || _state$currentPrize6 === void 0 ? void 0 : _state$currentPrize6.boxNumber) || (typeof lmbManager !== 'undefined' ? lmbManager.getCurrentBoxNumber() : null)
          });
          _context20.n = 6;
          return fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });
        case 6:
          response = _context20.v;
          _context20.n = 7;
          return response.json();
        case 7:
          _result0 = _context20.v;
          if (_result0.success) {
            _context20.n = 9;
            break;
          }
          _context20.n = 8;
          return waitForDefaultLoading(withdrawLoadingStartedAt, withdrawLoadingMinDuration);
        case 8:
          stopLoadingSequence(withdrawLoadingToken);
          errorMsg = resolveRequestError(response, _result0, 'Yêu cầu thất bại. Vui lòng thử lại.');
          showToast('❌ ' + errorMsg, '❌');
          return _context20.a(2);
        case 9:
          updateLoadingOverlayMessage('Yêu cầu rút tiền đã gửi thành công. Đang chuyển trang...');
          _context20.n = 10;
          return waitForDefaultLoading(withdrawLoadingStartedAt, withdrawLoadingMinDuration);
        case 10:
          stopLoadingSequence(withdrawLoadingToken);
          withdrawModal = document.getElementById('withdrawModal');
          withdrawAccount = document.getElementById('withdrawAccount');
          withdrawBank = document.getElementById('withdrawBank');
          withdrawName = document.getElementById('withdrawName');
          if (withdrawModal) {
            withdrawModal.classList.remove('active');
          }
          withdrawCustomerName = document.getElementById('withdrawCustomerName');
          withdrawCustomerPhone = document.getElementById('withdrawCustomerPhone');
          withdrawCustomerEmail = document.getElementById('withdrawCustomerEmail');
          if (withdrawAccount) withdrawAccount.value = '';
          if (withdrawBank) withdrawBank.value = '';
          if (withdrawName) withdrawName.value = '';
          if (withdrawCustomerName) withdrawCustomerName.value = '';
          if (withdrawCustomerPhone) withdrawCustomerPhone.value = '';
          if (withdrawCustomerEmail) withdrawCustomerEmail.value = '';

          // Clear withdrawal tracking state
          state.existingWithdrawalId = null;
          state.isUpdatingWithdrawal = false;
          successMsg = '✅ Yêu cầu rút tiền đã được gửi!';
          state.playerName = formData.customerName;
          state.playerPhone = formData.customerPhone;
          state.playerEmail = formData.customerEmail;
          localStorage.setItem('lmbPlayerName', formData.customerName);
          localStorage.setItem('lmbPlayerPhone', formData.customerPhone);
          localStorage.setItem('lmbPlayerEmail', formData.customerEmail);
          saveSessionProfile('withdrawProfile', {
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            customerEmail: formData.customerEmail,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            accountHolder: formData.accountHolder,
            amount: formData.amount || ''
          });
          showToast(successMsg, '✅');
          if (typeof lmbManager !== 'undefined') {
            lmbManager.confirmCurrentBox();
          }

          // Refresh wallet stats after withdrawal (source of truth from server)
          setTimeout(function () {
            loadWallet({
              showLoader: false
            });
          }, 500);

          // Show thank you page with withdrawal details
          showThankYouPage({
            method: 'Rút tiền qua ngân hàng',
            bank: formData.bankName,
            account: formData.accountNumber,
            withdrawalCode: ((_result0$data = _result0.data) === null || _result0$data === void 0 ? void 0 : _result0$data.id) || ((_result0$data2 = _result0.data) === null || _result0$data2 === void 0 ? void 0 : _result0$data2.code) || 'N/A',
            accountHolder: formData.accountHolder
          });
          _context20.n = 13;
          break;
        case 11:
          _context20.p = 11;
          _t13 = _context20.v;
          _context20.n = 12;
          return waitForDefaultLoading(withdrawLoadingStartedAt, withdrawLoadingMinDuration);
        case 12:
          stopLoadingSequence(withdrawLoadingToken);
          showToast('❌ Lỗi từ server. Vui lòng thử lại sau.', '❌');
        case 13:
          _context20.p = 13;
          setButtonLoading('withdrawSubmitBtn', false);
          return _context20.f(13);
        case 14:
          return _context20.a(2);
      }
    }, _callee20, null, [[1, 11, 13, 14]]);
  }));
  return _submitWithdraw.apply(this, arguments);
}
function spawnConfetti() {
  var container = document.getElementById('confettiContainer');
  container.innerHTML = '';
  var colors = ['#a855f7', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#fff'];
  for (var i = 0; i < 60; i++) {
    var el = document.createElement('div');
    el.style.cssText = "\n        position:absolute;\n        left:".concat(Math.random() * 100, "%;\n        top:-20px;\n        width:").concat(6 + Math.random() * 8, "px;\n        height:").concat(6 + Math.random() * 8, "px;\n        background:").concat(colors[Math.floor(Math.random() * colors.length)], ";\n        border-radius:").concat(Math.random() > 0.5 ? '50%' : '2px', ";\n        animation:confettiFall ").concat(1.5 + Math.random() * 2, "s ").concat(Math.random() * 1, "s forwards;\n      ");
    container.appendChild(el);
  }
  setTimeout(function () {
    container.innerHTML = '';
  }, 4000);
}

// ===== LOADING OVERLAY =====
var loadingSequenceTimer = null;
var loadingSequenceToken = 0;
var loadingOverlaySpinnerAnim = null;
var loadingOverlayHideTimer = null;
function ensureLoadingOverlaySpinnerAnimation() {
  var spinner = document.getElementById('loadingOverlaySpinner');
  if (!spinner) return;
  if (!document.getElementById('loadingOverlaySpinStyle')) {
    var style = document.createElement('style');
    style.id = 'loadingOverlaySpinStyle';
    style.textContent = '@keyframes loadingOverlaySpin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
  spinner.style.animation = 'loadingOverlaySpin 1s linear infinite';
  if (spinner.animate) {
    if (!loadingOverlaySpinnerAnim || loadingOverlaySpinnerAnim.playState === 'finished') {
      loadingOverlaySpinnerAnim = spinner.animate([{
        transform: 'rotate(0deg)'
      }, {
        transform: 'rotate(360deg)'
      }], {
        duration: 1000,
        iterations: Infinity,
        easing: 'linear'
      });
    } else if (loadingOverlaySpinnerAnim.playState === 'paused') {
      loadingOverlaySpinnerAnim.play();
    }
  }
}
function showLoadingOverlay(message, title) {
  var overlay = document.getElementById('loadingOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
  }
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0, 0, 0, 0.8)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.flexDirection = 'column';
  overlay.style.gap = '20px';
  overlay.style.zIndex = '2147483647';
  overlay.style.visibility = 'visible';
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'auto';
  overlay.style.transition = 'opacity .24s ease';
  if (overlay.parentElement !== document.body) {
    document.body.appendChild(overlay);
  } else {
    // Move to the end of body so it stays above dynamically created nodes.
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = "\n      <div id=\"loadingOverlayPanel\" style=\"\n        background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);\n        padding: 28px;\n        border-radius: 16px;\n        text-align: center;\n        box-shadow: 0 10px 40px rgba(0,0,0,0.3);\n        max-width: 420px;\n        width: calc(100% - 32px);\n        transform: translateY(10px) scale(.985);\n        opacity: .92;\n        transition: transform .24s ease, opacity .24s ease;\n      \">\n        <div style=\"font-size: 36px; margin-bottom: 12px;\">\u23F3</div>\n        <div style=\"font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 8px;\">\n          ".concat(title || 'Đang xử lý yêu cầu', "\n        </div>\n        <div id=\"loadingOverlayMessage\" style=\"font-size: 15px; font-weight: 600; color: #334155; white-space: pre-line; line-height: 1.5; min-height: 44px;\">\n          ").concat(message || 'Đang xử lý...', "\n        </div>\n        <div style=\"margin-top: 20px;\">\n          <div id=\"loadingOverlaySpinner\" style=\"\n            width: 40px;\n            height: 40px;\n            border: 4px solid #f0f0f0;\n            border-top: 4px solid #3b82f6;\n            border-radius: 50%;\n            margin: 0 auto;\n          \"></div>\n        </div>\n      </div>\n    ");
  overlay.style.display = 'flex';
  if (loadingOverlayHideTimer) {
    clearTimeout(loadingOverlayHideTimer);
    loadingOverlayHideTimer = null;
  }
  requestAnimationFrame(function () {
    overlay.style.opacity = '1';
    var panel = document.getElementById('loadingOverlayPanel');
    if (panel) {
      panel.style.transform = 'translateY(0) scale(1)';
      panel.style.opacity = '1';
    }
  });
  ensureLoadingOverlaySpinnerAnimation();
}
function hideLoadingOverlay() {
  var overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    var panel = document.getElementById('loadingOverlayPanel');
    overlay.style.opacity = '0';
    if (panel) {
      panel.style.transform = 'translateY(10px) scale(.985)';
      panel.style.opacity = '.92';
    }
    loadingOverlayHideTimer = setTimeout(function () {
      overlay.style.display = 'none';
      overlay.style.visibility = 'hidden';
    }, 240);
    overlay.style.pointerEvents = 'none';
    if (loadingOverlaySpinnerAnim && loadingOverlaySpinnerAnim.playState === 'running') {
      loadingOverlaySpinnerAnim.pause();
    }
  }
}
function updateLoadingOverlayMessage(message) {
  var messageEl = document.getElementById('loadingOverlayMessage');
  if (messageEl) {
    messageEl.textContent = message || 'Đang xử lý...';
  }
}
function startLoadingSequence(title, messages, intervalMs) {
  var safeMessages = Array.isArray(messages) && messages.length > 0 ? messages : ['Đang xử lý...'];
  if (loadingSequenceTimer) {
    clearInterval(loadingSequenceTimer);
    loadingSequenceTimer = null;
  }
  loadingSequenceToken += 1;
  var token = loadingSequenceToken;
  var index = 0;
  showLoadingOverlay(safeMessages[index], title);
  if (safeMessages.length > 1) {
    loadingSequenceTimer = setInterval(function () {
      if (token !== loadingSequenceToken) {
        clearInterval(loadingSequenceTimer);
        loadingSequenceTimer = null;
        return;
      }
      if (index < safeMessages.length - 1) {
        index += 1;
        updateLoadingOverlayMessage(safeMessages[index]);
      } else {
        clearInterval(loadingSequenceTimer);
        loadingSequenceTimer = null;
      }
    }, Number(intervalMs) > 0 ? Number(intervalMs) : 900);
  }
  return token;
}
function stopLoadingSequence(token) {
  if (token && token !== loadingSequenceToken) {
    return;
  }
  if (loadingSequenceTimer) {
    clearInterval(loadingSequenceTimer);
    loadingSequenceTimer = null;
  }
  hideLoadingOverlay();
}
function delay(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
function getDefaultLoadingDurationMs() {
  return 2000 + Math.floor(Math.random() * 1001);
}
function waitForDefaultLoading(_x0, _x1) {
  return _waitForDefaultLoading.apply(this, arguments);
}
function _waitForDefaultLoading() {
  _waitForDefaultLoading = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(startedAt, minDurationMs) {
    var elapsed, waitMs;
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.n) {
        case 0:
          elapsed = Date.now() - (startedAt || Date.now());
          waitMs = Number(minDurationMs) - elapsed;
          if (!(waitMs > 0)) {
            _context21.n = 1;
            break;
          }
          _context21.n = 1;
          return delay(waitMs);
        case 1:
          return _context21.a(2);
      }
    }, _callee21);
  }));
  return _waitForDefaultLoading.apply(this, arguments);
}
function setButtonLoading(buttonId, isLoading, loadingText) {
  var btn = document.getElementById(buttonId);
  if (!btn) return;
  if (!btn.dataset.defaultText) {
    btn.dataset.defaultText = btn.innerHTML;
  }
  btn.disabled = !!isLoading;
  btn.innerHTML = isLoading ? "\u23F3 ".concat(loadingText || 'Đang xử lý...') : btn.dataset.defaultText;
}
function resolveRequestError(response, result, fallbackMessage) {
  if (response && response.status >= 500) {
    return 'Lỗi từ server. Vui lòng thử lại sau.';
  }
  return result && result.message || fallbackMessage;
}

// ===== TOAST =====
function showToast(text, emoji) {
  var toast = document.getElementById('toast');
  document.getElementById('toastText').textContent = text;
  document.getElementById('toastAvatar').textContent = emoji || '🎁';
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 3000);
}

// ===== WIN NOTIFICATIONS =====
function showWinNoti() {
  var container = document.getElementById('winNotiContainer');
  var name = pickRandom(vietNames);
  var prize = pickRandom(notifPrizes);
  var time = pickRandom(timeAgo);
  var el = document.createElement('div');
  el.className = 'win-noti';
  el.innerHTML = "\n      <div class=\"win-noti-avatar\">".concat(prize.emoji, "</div>\n      <div class=\"win-noti-body\">\n        <div class=\"win-noti-name\">\uD83C\uDF89 ").concat(name, "</div>\n        <div class=\"win-noti-prize\" style=\"color:").concat(prize.color, "\">\u0111\xE3 tr\xFAng ").concat(prize.name, "</div>\n        <div class=\"win-noti-time\">\u23F1 ").concat(time, "</div>\n      </div>\n      <div class=\"win-noti-badge\">TR\xDANG</div>\n    ");
  container.appendChild(el);
  requestAnimationFrame(function () {
    return el.classList.add('show');
  });
  setTimeout(function () {
    el.classList.add('hide');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 400);
  }, 4500);

  // Keep max 3 visible
  var all = container.querySelectorAll('.win-noti');
  if (all.length > 3) {
    var oldest = all[0];
    oldest.classList.add('hide');
    setTimeout(function () {
      if (oldest.parentNode) oldest.parentNode.removeChild(oldest);
    }, 400);
  }
}
function scheduleNoti() {
  var delay = 3000 + Math.random() * 4000;
  setTimeout(function () {
    showWinNoti();
    scheduleNoti();
  }, delay);
}

// ===== PERSONAL INFO FORM =====
function validatePersonalForm() {
  return {
    isValid: true,
    name: state.playerName || localStorage.getItem('lmbPlayerName') || '',
    phone: state.playerPhone || localStorage.getItem('lmbPlayerPhone') || '',
    email: state.playerEmail || localStorage.getItem('lmbPlayerEmail') || ''
  };
}
function goToBoxSelection() {
  return _goToBoxSelection.apply(this, arguments);
} // ===== THANK YOU PAGE =====
function _goToBoxSelection() {
  _goToBoxSelection = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
    var latestSessionCode, verifyResponse, verifyResult, _verifyResult$data2, order, savedName, savedPhone, savedEmail, _loaded, cachedInfo, loaded, _t14;
    return _regenerator().w(function (_context22) {
      while (1) switch (_context22.p = _context22.n) {
        case 0:
          if (!state.sessionCode) {
            latestSessionCode = '';
            if (typeof lmbManager !== 'undefined') {
              latestSessionCode = (lmbManager.restoreSession() || '').trim().toUpperCase();
            }
            if (!latestSessionCode) {
              latestSessionCode = (localStorage.getItem('lmbSessionCode') || '').trim().toUpperCase();
            }
            if (latestSessionCode) {
              state.sessionCode = latestSessionCode;
              state.sessionStartTime = parseInt(localStorage.getItem('lmbSessionStart')) || Date.now();
              state.isSessionValid = true;
            }
          }
          if (state.sessionCode) {
            _context22.n = 1;
            break;
          }
          showToast('ℹ️ Bạn chưa chơi phiên nào! Hãy nhập mã phiên mà chúng tôi cung cấp vào ô nhập ở trang chủ để chơi nhé!', 'ℹ️');
          showPage('home');
          return _context22.a(2);
        case 1:
          _context22.p = 1;
          _context22.n = 2;
          return fetch("/api/lucky-mystery-box/session?code=".concat(encodeURIComponent(state.sessionCode)));
        case 2:
          verifyResponse = _context22.v;
          _context22.n = 3;
          return verifyResponse.json();
        case 3:
          verifyResult = _context22.v;
          if (!(!verifyResult.success || !verifyResult.data)) {
            _context22.n = 4;
            break;
          }
          clearSessionCode();
          showToast('ℹ️ Bạn chưa chơi phiên nào! Hãy nhập mã phiên mà chúng tôi cung cấp vào ô nhập ở trang chủ để chơi nhé!', 'ℹ️');
          showPage('home');
          return _context22.a(2);
        case 4:
          state.hasOpened = verifyResult.data.player_selected_box !== null;
          state.isSessionValid = true;
          if (typeof lmbManager !== 'undefined') {
            order = Array.isArray(verifyResult === null || verifyResult === void 0 || (_verifyResult$data2 = verifyResult.data) === null || _verifyResult$data2 === void 0 ? void 0 : _verifyResult$data2.box_positions) ? verifyResult.data.box_positions : [1, 2, 3];
            lmbManager.setOpenOrder(order);
          }
          _context22.n = 6;
          break;
        case 5:
          _context22.p = 5;
          _t14 = _context22.v;
          showToast('❌ Không thể tải phiên gần nhất. Vui lòng thử lại.', '❌');
          return _context22.a(2);
        case 6:
          if (!state.hasOpened) {
            _context22.n = 10;
            break;
          }
          // Load personal info from localStorage if exists
          savedName = localStorage.getItem('lmbPlayerName');
          savedPhone = localStorage.getItem('lmbPlayerPhone');
          savedEmail = localStorage.getItem('lmbPlayerEmail');
          if (savedName) state.playerName = savedName;
          if (savedPhone) state.playerPhone = savedPhone;
          if (savedEmail) state.playerEmail = savedEmail;
          _context22.n = 7;
          return preloadBoxes();
        case 7:
          _loaded = _context22.v;
          if (_loaded) {
            _context22.n = 8;
            break;
          }
          showToast('❌ Không tải được dữ liệu hộp. Vui lòng thử lại.', '❌');
          return _context22.a(2);
        case 8:
          _context22.n = 9;
          return syncLocalProgressFromServer();
        case 9:
          showPage('choose');
          setTimeout(function () {
            loadOpenedPrizes();
            loadExchangeOptions();
          }, 80);
          showToast('✅ Đã quay lại phiên chơi gần nhất', '✅');
          return _context22.a(2);
        case 10:
          cachedInfo = validatePersonalForm();
          state.playerName = cachedInfo.name;
          state.playerPhone = cachedInfo.phone;
          state.playerEmail = cachedInfo.email;
          _context22.n = 11;
          return preloadBoxes();
        case 11:
          loaded = _context22.v;
          if (loaded) {
            _context22.n = 12;
            break;
          }
          showToast('❌ Không tải được dữ liệu hộp. Vui lòng thử lại.', '❌');
          return _context22.a(2);
        case 12:
          _context22.n = 13;
          return syncLocalProgressFromServer();
        case 13:
          showPage('choose');
          setTimeout(function () {
            loadOpenedPrizes();
            loadExchangeOptions();
          }, 80);
          showToast('✅ Mời bạn chọn hộp quà', '✅');
        case 14:
          return _context22.a(2);
      }
    }, _callee22, null, [[1, 5]]);
  }));
  return _goToBoxSelection.apply(this, arguments);
}
function showThankYouPage(result) {
  var _state$currentPrize2, _state$currentPrize3;
  var isCashRequest = !!(result && result.method && /rút tiền|chuyển khoản|đổi tiền/i.test(result.method));
  var thankYouHeading = document.getElementById('thankYouHeading');
  var processingMessage = document.getElementById('processingMessage');
  if (thankYouHeading) {
    thankYouHeading.textContent = isCashRequest ? 'Yêu cầu rút tiền đã được ghi nhận!' : 'Hàng sẽ sớm được giao đến bạn!';
  }
  if (processingMessage) {
    processingMessage.innerHTML = isCashRequest ? '<strong>Vui lòng nhắn cho nhân viên hỗ trợ để cập nhật thông tin.</strong><br>Sau đó hệ thống sẽ giải ngân.' : '<strong>Hàng sẽ sớm được giao đến bạn!!</strong>.<br>Vui lòng nhắn cho nhân viên hỗ trợ để cập nhật đơn hàng!';
  }

  // Fill in confirmation details
  var confirmId = result && result.confirmationCode ? String(result.confirmationCode).replace(/^#/, '') : 'LMB' + Date.now().toString().slice(-6);
  document.getElementById('confirmationIdDisplay').textContent = '#' + confirmId;

  // Prize and value
  document.getElementById('summaryPrizeDisplay').textContent = ((_state$currentPrize2 = state.currentPrize) === null || _state$currentPrize2 === void 0 ? void 0 : _state$currentPrize2.name) || 'N/A';
  document.getElementById('summaryValueDisplay').textContent = Math.floor(((_state$currentPrize3 = state.currentPrize) === null || _state$currentPrize3 === void 0 ? void 0 : _state$currentPrize3.value) || 0).toLocaleString('vi-VN') + ' đ';

  // Personal info
  document.getElementById('summaryNameDisplay').textContent = state.playerName || 'N/A';
  document.getElementById('summaryPhoneDisplay').textContent = result.playerPhone || state.playerPhone || 'N/A';
  if (state.playerEmail) {
    document.getElementById('summaryEmailSection').style.display = 'flex';
    document.getElementById('summaryEmailDisplay').textContent = state.playerEmail;
  }

  // Exchange method info (if provided)
  if (result && result.method) {
    if (result.method === 'Rút tiền qua ngân hàng') {
      var prizeSection = document.getElementById('summaryPrizeSection');
      if (prizeSection) prizeSection.style.display = 'none';
    } else {
      var _prizeSection = document.getElementById('summaryPrizeSection');
      if (_prizeSection) _prizeSection.style.display = '';
    }
    document.getElementById('exchangeMethodSection').style.display = 'flex';
    document.getElementById('summaryMethodDisplay').textContent = result.method;
    if (result.method === 'Chuyển khoản' && result.bank) {
      document.getElementById('summaryBankSection').style.display = 'flex';
      document.getElementById('summaryBankDisplay').textContent = result.bank;
      if (result.account) {
        document.getElementById('summaryAccountSection').style.display = 'flex';
        document.getElementById('summaryAccountDisplay').textContent = '****' + result.account.slice(-4);
      }
    }
    if (result.method === 'Giao hàng' && result.address) {
      document.getElementById('summaryAddressSection').style.display = 'flex';
      document.getElementById('summaryAddressDisplay').textContent = result.address || result.playerAddress || state.playerAddress || 'N/A';
    }

    // Withdrawal method info
    if (result.method === 'Rút tiền qua ngân hàng') {
      if (result.bank) {
        document.getElementById('summaryBankSection').style.display = 'flex';
        document.getElementById('summaryBankDisplay').textContent = '🏦 ' + result.bank;
      }
      if (result.account) {
        document.getElementById('summaryAccountSection').style.display = 'flex';
        document.getElementById('summaryAccountDisplay').textContent = 'Tài khoản: ****' + result.account.slice(-4);
      }
      if (result.withdrawalCode) {
        var withdrawalSection = document.getElementById('summaryBankSection');
        if (withdrawalSection) {
          var codeElement = document.createElement('div');
          codeElement.style.cssText = 'margin-top: 10px; font-size: 12px; color: #666;';
          codeElement.innerHTML = "<strong>M\xE3 y\xEAu c\u1EA7u r\xFAt ti\u1EC1n:</strong> ".concat(result.withdrawalCode);
          withdrawalSection.appendChild(codeElement);
        }
      }
      if (result.accountHolder) {}
    }
  }
  showPage('thankyou');
}
function backToHome() {
  clearSessionCode();
  state.playerName = '';
  state.playerPhone = '';
  state.playerEmail = '';
  state.currentPrize = null;
  state.hasOpened = false;
  localStorage.removeItem('lmbPlayerName');
  localStorage.removeItem('lmbPlayerPhone');
  localStorage.removeItem('lmbPlayerEmail');
  showGlobalPageLoader('Đang quay về trang chủ...');
  window.location.href = '/';
}
function shareResult() {
  var _state$currentPrize4;
  var prize = ((_state$currentPrize4 = state.currentPrize) === null || _state$currentPrize4 === void 0 ? void 0 : _state$currentPrize4.name) || 'phần thưởng';
  var confirmId = document.getElementById('confirmationIdDisplay').textContent;
  var text = "T\xF4i v\u1EEBa m\u1EDF \u0111\u01B0\u1EE3c ".concat(prize, "! \uD83C\uDF81 M\xE3 x\xE1c nh\u1EADn: ").concat(confirmId, " Lucky Mystery Box");
  if (navigator.share) {
    navigator.share({
      title: 'Lucky Mystery Box',
      text: text
    }).catch(function (err) {});
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(text).then(function () {
      showToast('✅ Đã sao chép vào clipboard', '✅');
    });
  }
}

// ===== LOAD OPENED PRIZES (Display under boxes) =====
function loadOpenedPrizes() {
  return _loadOpenedPrizes.apply(this, arguments);
} // ===== EXCHANGE OPTIONS =====
function _loadOpenedPrizes() {
  _loadOpenedPrizes = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
    var response, _result1, openedPrizesContainer, items, prizeHTML, _t15;
    return _regenerator().w(function (_context23) {
      while (1) switch (_context23.p = _context23.n) {
        case 0:
          if (state.sessionCode) {
            _context23.n = 1;
            break;
          }
          return _context23.a(2);
        case 1:
          _context23.p = 1;
          console.log('[loadOpenedPrizes] session', state.sessionCode);
          _context23.n = 2;
          return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/player-inventory"));
        case 2:
          response = _context23.v;
          console.log('[loadOpenedPrizes] response status', response.status);
          _context23.n = 3;
          return response.json();
        case 3:
          _result1 = _context23.v;
          console.log('[loadOpenedPrizes] payload', _result1);
          if (_result1.success) {
            _context23.n = 4;
            break;
          }
          return _context23.a(2);
        case 4:
          openedPrizesContainer = document.getElementById('openedPrizesContainer');
          if (openedPrizesContainer) {
            _context23.n = 5;
            break;
          }
          return _context23.a(2);
        case 5:
          items = _result1.data.items || [];
          state.openedPrizeItems = items;
          if (typeof lmbManager !== 'undefined') {
            lmbManager.syncOpenedBoxes(items);
          }
          console.log('[loadOpenedPrizes] items count', items.length);
          if (!(items.length === 0)) {
            _context23.n = 6;
            break;
          }
          openedPrizesContainer.style.display = 'none';
          return _context23.a(2);
        case 6:
          if (openedPrizesContainer.dataset.source !== 'exchange') {
            // Show container and populate with opened prizes
            openedPrizesContainer.style.display = 'block';
            prizeHTML = items.map(function (item, idx) {
              var statusText = item.status === 'claimed' ? '✅ Đã nhận quà' : item.status === 'converted' ? '💰 Đã nhận tiền' : item.status === 'exchanged' ? '⏳ Chờ duyệt quy đổi tiền' : '';
              return "\n          <div class=\"opened-prize-item\" onclick=\"openPrizeDetailModalByIndex(".concat(idx, ", 'opened')\">\n            <div class=\"opened-prize-icon\">").concat(item.prize_icon || '🎁', "</div>\n            <div class=\"opened-prize-name\">").concat(item.prize_name, "</div>\n            <div class=\"opened-prize-detail\">H\u1ED9p #").concat(item.box_number, "</div>\n            ").concat(item.is_cash ? "<div class=\"opened-prize-value\">".concat(Math.floor(item.prize_value).toLocaleString('vi-VN'), " \u0111</div>") : '', "\n            ").concat(statusText ? "<div class=\"opened-prize-status\">".concat(statusText, "</div>") : '', "\n            <div class=\"opened-prize-rarity rarity-").concat(item.rarity, "\">").concat(item.rarity, "</div>\n          </div>\n        ");
            }).join('');
            openedPrizesContainer.innerHTML = "\n          <div class=\"opened-prizes-title\">\uD83C\uDFC6 Ph\u1EA7n Qu\xE0 \u0110\xE3 M\u1EDF</div>\n          <div class=\"opened-prizes-grid\">".concat(prizeHTML, "</div>\n        ");
            console.log('[loadOpenedPrizes] rendered');
          }
          _context23.n = 8;
          break;
        case 7:
          _context23.p = 7;
          _t15 = _context23.v;
          console.error('[loadOpenedPrizes] error', _t15);
        case 8:
          return _context23.a(2);
      }
    }, _callee23, null, [[1, 7]]);
  }));
  return _loadOpenedPrizes.apply(this, arguments);
}
function loadExchangeOptions() {
  return _loadExchangeOptions.apply(this, arguments);
} // Quick convert function
function _loadExchangeOptions() {
  _loadExchangeOptions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
    var response, _exchangeContainer, _result10, exchangeContainer, items, availableItems, exchangeHTML, exchangeSection, choosePageExchange, _t16;
    return _regenerator().w(function (_context24) {
      while (1) switch (_context24.p = _context24.n) {
        case 0:
          if (state.sessionCode) {
            _context24.n = 1;
            break;
          }
          return _context24.a(2);
        case 1:
          _context24.p = 1;
          _context24.n = 2;
          return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/player-inventory"));
        case 2:
          response = _context24.v;
          if (!(response.status === 304)) {
            _context24.n = 4;
            break;
          }
          if (!state.currentPrize) {
            _context24.n = 3;
            break;
          }
          return _context24.a(2);
        case 3:
          return _context24.a(2);
        case 4:
          if (response.ok) {
            _context24.n = 5;
            break;
          }
          _exchangeContainer = document.getElementById('exchangeContainer');
          if (_exchangeContainer) {
            _exchangeContainer.innerHTML = "\n            <div class=\"empty-state\">\n              <span class=\"empty-state-icon\">\u274C</span>\n              <div class=\"empty-state-title\">L\u1ED7i t\u1EA3i ph\u1EA7n qu\xE0</div>\n              <div class=\"empty-state-desc\">H\xE3y th\u1EED t\u1EA3i l\u1EA1i trang (F5)</div>\n            </div>";
          }
          return _context24.a(2);
        case 5:
          _context24.n = 6;
          return response.json();
        case 6:
          _result10 = _context24.v;
          exchangeContainer = document.getElementById('exchangeContainer');
          if (exchangeContainer) {
            _context24.n = 7;
            break;
          }
          return _context24.a(2);
        case 7:
          if (!(!_result10.success || !_result10.data || _result10.data.total === 0)) {
            _context24.n = 8;
            break;
          }
          exchangeContainer.innerHTML = "\n          <div class=\"empty-state\">\n            <span class=\"empty-state-icon\">\uD83D\uDCE6</span>\n            <div class=\"empty-state-title\">Ch\u01B0a c\xF3 qu\xE0 \u0111\u1EC3 \u0111\u1ED5i</div>\n            <div class=\"empty-state-desc\">H\xE3y m\u1EDF h\u1ED9p qu\xE0 tr\u01B0\u1EDBc \u0111\u1EC3 nh\u1EADn ph\u1EA7n th\u01B0\u1EDFng!</div>\n          </div>";
          return _context24.a(2);
        case 8:
          items = _result10.data.items || [];
          state.exchangeItems = items;
          state.openedPrizeItems = items;
          availableItems = items.filter(function (item) {
            return item.status === 'obtained';
          });
          if (!(availableItems.length === 0)) {
            _context24.n = 9;
            break;
          }
          exchangeContainer.innerHTML = "\n          <div class=\"empty-state\">\n            <span class=\"empty-state-icon\">\uD83D\uDCE6</span>\n            <div class=\"empty-state-title\">Ch\u01B0a c\xF3 qu\xE0 \u0111\u1EC3 \u0111\u1ED5i</div>\n            <div class=\"empty-state-desc\">C\xE1c qu\xE0 c\u1EE7a b\u1EA1n \u0111ang ch\u1EDD x\u1EED l\xFD ho\u1EB7c \u0111\xE3 \u0111\u01B0\u1EE3c x\xE1c nh\u1EADn!</div>\n          </div>";
          return _context24.a(2);
        case 9:
          exchangeHTML = items.map(function (item, idx) {
            var isUnlucky = isUnluckyPrize(item);
            var itemValue = Number(item.prize_value) || 0;
            var itemCashEnabled = item.is_cash === true || item.is_cash === 1 || String(item.is_cash).toLowerCase() === 'true';
            var canConvert = !isUnlucky && itemCashEnabled && itemValue > 0;
            var isDone = item.status !== 'obtained';
            var statusLabel = isUnlucky ? '😢 Chúc bạn may mắn lần sau' : item.status === 'claimed' ? '✅ Đã nhận quà' : item.status === 'converted' ? '💰 Đã nhận tiền' : item.status === 'exchanged' ? '⏳ Chờ duyệt quy đổi tiền' : '';
            var valueText = isUnlucky ? 'Chúc bạn may mắn lần sau' : canConvert ? Math.floor(itemValue).toLocaleString('vi-VN') + ' đ' : 'Quà quý';
            var showActions = !isDone && !isUnlucky;
            return "\n          <div class=\"exchange-item ".concat(isDone || isUnlucky ? 'exchange-converted' : '', "\" onclick=\"openPrizeDetailModalByIndex(").concat(idx, ", 'exchange')\">\n            <div class=\"exchange-prize-icon\">").concat(item.prize_icon || (isUnlucky ? '😢' : '🎁'), "</div>\n            <div class=\"exchange-prize-name\">").concat(item.prize_name || 'Phần quà', "</div>\n            <div class=\"exchange-prize-detail\">H\u1ED9p #").concat(item.box_number, "</div>\n            <div class=\"exchange-prize-value\" style=\"").concat(item.color_hex ? "color: ".concat(item.color_hex, ";") : '', "\">\n              ").concat(valueText, "\n            </div>\n            <div class=\"exchange-actions\">\n              ").concat(showActions ? canConvert ? "<button class=\"btn-exchange-claim\" onclick=\"event.stopPropagation();quickClaimPrize(".concat(idx, ")\">\uD83C\uDF81 Nh\u1EADn qu\xE0</button><button class=\"btn-exchange-convert\" onclick=\"event.stopPropagation();quickConvertPrize(").concat(idx, ")\">\uD83D\uDCB0 \u0110\u1ED5i ti\u1EC1n</button>") : "<button class=\"btn-exchange-claim\" onclick=\"event.stopPropagation();quickClaimPrize(".concat(idx, ")\">\uD83C\uDF81 Nh\u1EADn qu\xE0</button>") : "<span class=\"exchange-status-badge\">".concat(statusLabel, "</span>"), "\n            </div>\n          </div>\n        ");
          }).join('');
          exchangeSection = "\n        <div class=\"exchange-header\">\n          \uD83D\uDC8E Ph\u1EA7n Qu\xE0 \u0110\xE3 M\u1EDF\n        </div>\n        <div class=\"exchange-items\">\n          ".concat(exchangeHTML, "\n        </div>\n      ");
          exchangeContainer.innerHTML = exchangeSection;

          // Also add to choose page if element exists
          choosePageExchange = document.getElementById('openedPrizesContainer');
          if (choosePageExchange) {
            choosePageExchange.innerHTML = exchangeSection;
            choosePageExchange.style.display = 'block';
            choosePageExchange.dataset.source = 'exchange';
          }
          _context24.n = 11;
          break;
        case 10:
          _context24.p = 10;
          _t16 = _context24.v;
          showToast('❌ Lỗi tải phần quà: ' + _t16.message, '❌');
        case 11:
          return _context24.a(2);
      }
    }, _callee24, null, [[1, 10]]);
  }));
  return _loadExchangeOptions.apply(this, arguments);
}
function quickConvertPrize(_x10) {
  return _quickConvertPrize.apply(this, arguments);
} // Quick claim function
function _quickConvertPrize() {
  _quickConvertPrize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25(index) {
    var item, itemValue, itemCashEnabled, quickConvertLoadingMinDuration, quickConvertLoadingStartedAt, quickConvertLoadingToken, response, _result11, _t17;
    return _regenerator().w(function (_context25) {
      while (1) switch (_context25.p = _context25.n) {
        case 0:
          if (state.sessionCode) {
            _context25.n = 1;
            break;
          }
          return _context25.a(2);
        case 1:
          item = (state.exchangeItems || [])[index];
          if (item) {
            _context25.n = 2;
            break;
          }
          return _context25.a(2);
        case 2:
          itemValue = Number(item.prize_value) || 0;
          itemCashEnabled = item.is_cash === true || item.is_cash === 1 || String(item.is_cash).toLowerCase() === 'true';
          if (!(!itemCashEnabled || itemValue <= 0)) {
            _context25.n = 3;
            break;
          }
          showToast('⚠️ Phần thưởng này không hỗ trợ quy đổi tiền mặt', '⚠️');
          return _context25.a(2);
        case 3:
          quickConvertLoadingMinDuration = getDefaultLoadingDurationMs();
          quickConvertLoadingStartedAt = Date.now();
          quickConvertLoadingToken = startLoadingSequence('Đang gửi yêu cầu quy đổi tiền', ['Đang gửi thông tin quy đổi... ', 'Đang xác thực phiên chơi... ', 'Hệ thống đang ghi nhận yêu cầu chờ duyệt...'], Math.max(450, Math.floor(quickConvertLoadingMinDuration / 3)));
          _context25.p = 4;
          _context25.n = 5;
          return fetch("/api/lucky-mystery-box/".concat(state.sessionCode, "/convert"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              boxNumber: item.box_number
            })
          });
        case 5:
          response = _context25.v;
          _context25.n = 6;
          return response.json();
        case 6:
          _result11 = _context25.v;
          if (!_result11.success) {
            _context25.n = 8;
            break;
          }
          _context25.n = 7;
          return waitForDefaultLoading(quickConvertLoadingStartedAt, quickConvertLoadingMinDuration);
        case 7:
          stopLoadingSequence(quickConvertLoadingToken);
          showToast('⏳ Đã gửi yêu cầu quy đổi ' + Math.floor(_result11.cashAmount || 0).toLocaleString('vi-VN') + ' đ, đang chờ duyệt.', '⏳');
          setTimeout(function () {
            return loadExchangeOptions();
          }, 500); // Reload
          setTimeout(function () {
            return loadWallet({
              showLoader: false
            });
          }, 500);
          _context25.n = 10;
          break;
        case 8:
          _context25.n = 9;
          return waitForDefaultLoading(quickConvertLoadingStartedAt, quickConvertLoadingMinDuration);
        case 9:
          stopLoadingSequence(quickConvertLoadingToken);
          showToast('❌ ' + (_result11.message || 'Lỗi quy đổi'), '❌');
        case 10:
          _context25.n = 13;
          break;
        case 11:
          _context25.p = 11;
          _t17 = _context25.v;
          _context25.n = 12;
          return waitForDefaultLoading(quickConvertLoadingStartedAt, quickConvertLoadingMinDuration);
        case 12:
          stopLoadingSequence(quickConvertLoadingToken);
          showToast('❌ Lỗi: ' + _t17.message, '❌');
        case 13:
          return _context25.a(2);
      }
    }, _callee25, null, [[4, 11]]);
  }));
  return _quickConvertPrize.apply(this, arguments);
}
function quickClaimPrize(_x11) {
  return _quickClaimPrize.apply(this, arguments);
}
function _quickClaimPrize() {
  _quickClaimPrize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(index) {
    var item;
    return _regenerator().w(function (_context26) {
      while (1) switch (_context26.n) {
        case 0:
          item = (state.exchangeItems || [])[index];
          if (item) {
            _context26.n = 1;
            break;
          }
          return _context26.a(2);
        case 1:
          openClaimModal({
            name: item.prize_name || 'Quà',
            description: item.prize_description || 'Phần quà từ hộp quà bí mật',
            icon: item.prize_icon || '🎁',
            boxNumber: item.box_number
          });
        case 2:
          return _context26.a(2);
      }
    }, _callee26);
  }));
  return _quickClaimPrize.apply(this, arguments);
}
function openPrizeDetailModalByIndex(index, source) {
  var sourceItems = source === 'exchange' ? state.exchangeItems || [] : state.openedPrizeItems || [];
  var item = sourceItems[index];
  if (!item) return;
  openPrizeDetailModal(item);
}
function openPrizeDetailModal(item) {
  var modal = ensurePrizeDetailModal();
  if (!modal) return;
  var body = modal.querySelector('#prizeDetailModalBody');
  if (!body) return;
  var safeName = item.prize_name || 'Phần quà';
  var safeDesc = item.prize_description || 'Chưa có mô tả cho phần quà này.';
  var safeIcon = item.prize_icon || '🎁';
  var safeImage = item.prize_image || '';
  var safeBox = item.box_number || '-';
  var safeStatus = item.status || 'obtained';
  var safeValue = Number(item.prize_value) || 0;
  var statusText = safeStatus === 'claimed' ? 'Đã đổi quà' : safeStatus === 'converted' ? 'Đã quy đổi tiền' : safeStatus === 'exchanged' ? 'Chờ duyệt quy đổi tiền' : 'Đang chờ xử lý';
  body.innerHTML = "\n      <div class=\"prize-detail-media\">\n        ".concat(safeImage ? "<img src=\"".concat(safeImage, "\" alt=\"").concat(safeName, "\" class=\"prize-detail-image\" onerror=\"this.style.display='none'; this.nextElementSibling.style.display='flex';\">") : '', "\n        <div class=\"prize-detail-fallback\" style=\"display:").concat(safeImage ? 'none' : 'flex', "\">").concat(safeIcon, "</div>\n      </div>\n      <div class=\"prize-detail-name\">").concat(safeName, "</div>\n      <div class=\"prize-detail-desc\">").concat(safeDesc, "</div>\n      <div class=\"prize-detail-grid\">\n        <div class=\"prize-detail-item\"><span>H\u1ED9p m\u1EDF</span><strong>#").concat(safeBox, "</strong></div>\n        <div class=\"prize-detail-item\"><span>Gi\xE1 tr\u1ECB</span><strong>").concat(safeValue > 0 ? formatMoneyComma(safeValue) + ' đ' : 'Không định giá', "</strong></div>\n        <div class=\"prize-detail-item\"><span>Tr\u1EA1ng th\xE1i</span><strong>").concat(statusText, "</strong></div>\n      </div>\n    ");
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closePrizeDetailModal() {
  var modal = document.getElementById('prizeDetailModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}
function ensurePrizeDetailModal() {
  var modal = document.getElementById('prizeDetailModal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'prizeDetailModal';
  modal.className = 'modal-overlay prize-detail-modal-overlay';
  modal.innerHTML = "\n      <div class=\"modal-card prize-detail-modal-card\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Chi ti\u1EBFt ph\u1EA7n qu\xE0\">\n        <div class=\"modal-header\">\n          <span class=\"modal-title\">Chi ti\u1EBFt ph\u1EA7n qu\xE0</span>\n          <button class=\"modal-close\" type=\"button\" onclick=\"closePrizeDetailModal()\">\u2715</button>\n        </div>\n        <div id=\"prizeDetailModalBody\" class=\"prize-detail-modal-body\"></div>\n      </div>\n    ";
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closePrizeDetailModal();
    }
  });
  if (!window.__prizeDetailEscBound) {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closePrizeDetailModal();
      }
    });
    window.__prizeDetailEscBound = true;
  }
  document.body.appendChild(modal);
  return modal;
}
function loadAndApplySettings() {
  return _loadAndApplySettings.apply(this, arguments);
} // ===== INITIALIZATION =====
function _loadAndApplySettings() {
  _loadAndApplySettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
    var response, _result12, settings, logoContainer, faviconLink, textContent, _t18;
    return _regenerator().w(function (_context27) {
      while (1) switch (_context27.p = _context27.n) {
        case 0:
          _context27.p = 0;
          _context27.n = 1;
          return fetch('/api/settings');
        case 1:
          response = _context27.v;
          _context27.n = 2;
          return response.json();
        case 2:
          _result12 = _context27.v;
          settings = _result12.data || _result12;
          if (settings.logo && settings.logo.url) {
            logoContainer = document.getElementById('customLogoContainer');
            if (logoContainer) {
              logoContainer.innerHTML = "<img src=\"".concat(settings.logo.url, "\" style=\"max-width: 300px; max-height: 200px; object-fit: contain;\">");
            }
            faviconLink = document.getElementById('faviconLink');
            if (faviconLink) {
              faviconLink.href = settings.logo.url;
            }
          }
          if (settings.content && settings.content.customText) {
            textContent = document.getElementById('customTextContent');
            if (textContent) {
              textContent.innerHTML = settings.content.customText.replace(/\n/g, '<br>');
            }
          }
          _context27.n = 4;
          break;
        case 3:
          _context27.p = 3;
          _t18 = _context27.v;
        case 4:
          return _context27.a(2);
      }
    }, _callee27, null, [[0, 3]]);
  }));
  return _loadAndApplySettings.apply(this, arguments);
}
document.addEventListener('DOMContentLoaded', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
  var initLoaderShown, initLoaderTimer, savedTheme, sessionInput, searchInput;
  return _regenerator().w(function (_context2) {
    while (1) switch (_context2.p = _context2.n) {
      case 0:
        initLoaderShown = false;
        initLoaderTimer = setTimeout(function () {
          initLoaderShown = true;
          showGlobalPageLoader('Đang chuẩn bị dữ liệu trang...');
        }, 140);
        _context2.p = 1;
        savedTheme = localStorage.getItem('userTheme') || 'dark';
        applyUserTheme(savedTheme);

        // ✅ Restore prize state from localStorage if page was refreshed
        restorePrizeState();

        // ✅ NEW: If session exists, preload boxes info
        if (!(state.sessionCode && !state.boxesInfo)) {
          _context2.n = 2;
          break;
        }
        _context2.n = 2;
        return preloadBoxes().catch(function (err) {});
      case 2:
        _context2.n = 3;
        return loadAndApplySettings();
      case 3:
        // Initialize win notifications
        setTimeout(function () {
          showWinNoti();
          scheduleNoti();
        }, 2000);

        // Keyboard shortcuts
        sessionInput = document.getElementById('sessionCodeInput');
        if (sessionInput) {
          sessionInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') enterSession();
          });
        }
        searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') searchSession();
          });
        }
        window.addEventListener('popstate', function (event) {
          var handled = handleBackNavigationInSession();
          if (handled) return;
          if (event.state && event.state.lmbManaged && event.state.lmbPage) {
            showPage(event.state.lmbPage, {
              fromPopState: true
            });
          }
        });
      case 4:
        _context2.p = 4;
        clearTimeout(initLoaderTimer);
        if (initLoaderShown) {
          hideGlobalPageLoader(false, 260);
        }
        return _context2.f(4);
      case 5:
        return _context2.a(2);
    }
  }, _callee2, null, [[1,, 4, 5]]);
})));

// Also run on window load for fallback
window.addEventListener('load', function () {
  // Check if settings already loaded, if not fetch again
  var customTextEl = document.getElementById('customTextContent');
  if (customTextEl && !customTextEl.innerHTML) {
    loadAndApplySettings();
  }
});