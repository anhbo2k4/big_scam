var _state$chat;
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var cvs = document.getElementById('bgCanvas');
var ctx = cvs ? cvs.getContext('2d') : null;
var W = window.innerWidth;
var H = window.innerHeight;
var HOMEPAGE_THEME_STORAGE_KEY = 'lmbHomepageThemeV2';
var FORCE_INTERNAL_HOME_SCREEN = true;
var HOMEPAGE_THEME_PRESETS = [{
  value: 'new_homepage.html',
  label: 'Giao diện 1'
}, {
  value: 'background_upgraded.html',
  label: 'Giao diện 2'
}, {
  value: 'background.html',
  label: 'Giao diện 3'
}, {
  value: 'background-alt.html',
  label: 'Giao diện 4'
}, {
  value: 'background (1).html',
  label: 'Giao diện 5'
}, {
  value: 'card_v3_purple.html',
  label: 'Giao diện 6'
}, {
  value: 'card_v4_cyber.html',
  label: 'Giao diện 7'
}, {
  value: 'card_v4_cyber (1).html',
  label: 'Giao diện 8'
}, {
  value: 'card_v5_baroque.html',
  label: 'Giao diện 9'
}, {
  value: 'b10-card.html',
  label: 'Giao diện 10'
}, {
  value: 'boxes-redesign.html',
  label: 'Giao diện 11'
}, {
  value: 'gift-boxes (1).html',
  label: 'Giao diện 12'
}, {
  value: 'mo-hop-qua (1).html',
  label: 'Giao diện 13'
}];
var HOMEPAGE_THEME_LABEL_DEFAULTS = HOMEPAGE_THEME_PRESETS.reduce(function (acc, item) {
  acc[item.value] = item.label;
  return acc;
}, {});
var homepageThemeLabelOverrides = {};
function sanitizeHomepageThemeLabels(source) {
  var result = {};
  if (!source || _typeof(source) !== 'object') return result;
  HOMEPAGE_THEME_PRESETS.forEach(function (item) {
    var raw = source[item.value];
    if (typeof raw === 'string' && raw.trim()) {
      result[item.value] = raw.trim();
    }
  });
  return result;
}
function restartCssAnimationByClass(el, className) {
  if (!el || !className) return;
  el.classList.remove(className);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      el.classList.add(className);
    });
  });
}
function loadEngagementState() {
  try {
    var raw = JSON.parse(localStorage.getItem(CHAT_GLOBAL_KEYS.engagement) || '{}');
    state.engagement = _objectSpread(_objectSpread({}, state.engagement), {}, {
      pityCount: Math.max(0, Number(raw.pityCount || 0)),
      streak: Math.max(0, Number(raw.streak || 0)),
      points: Math.max(0, Number(raw.points || 0)),
      opens: Math.max(0, Number(raw.opens || 0)),
      lastOpenAt: Math.max(0, Number(raw.lastOpenAt || 0))
    });
  } catch (_) {}
}
function saveEngagementState() {
  try {
    localStorage.setItem(CHAT_GLOBAL_KEYS.engagement, JSON.stringify({
      pityCount: Number(state.engagement.pityCount || 0),
      streak: Number(state.engagement.streak || 0),
      points: Number(state.engagement.points || 0),
      opens: Number(state.engagement.opens || 0),
      lastOpenAt: Number(state.engagement.lastOpenAt || 0)
    }));
  } catch (_) {}
}
function updateEngagementUI() {
  var pityFill = document.getElementById('engagePityFill');
  var pityCount = document.getElementById('engagePityCount');
  var streak = document.getElementById('engageStreak');
  var points = document.getElementById('engagePoints');
  var redeemBtn = document.getElementById('engageRedeemBtn');
  var redeemHint = document.getElementById('engageRedeemHint');
  var threshold = Math.max(1, Number(state.engagement.pityThreshold || 8));
  var pity = Math.max(0, Number(state.engagement.pityCount || 0));
  var pityPct = Math.min(100, Math.round(pity / threshold * 100));
  var pt = Math.max(0, Number(state.engagement.points || 0));
  var canRedeem = pt >= Number(state.engagement.freeBoxCost || 120);
  if (pityFill) pityFill.style.width = "".concat(pityPct, "%");
  if (pityCount) pityCount.textContent = "".concat(Math.min(pity, threshold), "/").concat(threshold);
  if (streak) streak.textContent = "\uD83D\uDD25 Streak x".concat(Math.max(0, Number(state.engagement.streak || 0)));
  if (points) points.textContent = "\u2B50 ".concat(pt.toLocaleString('vi-VN'), " \u0111i\u1EC3m");
  if (redeemBtn) redeemBtn.disabled = !canRedeem;
  if (redeemHint) redeemHint.textContent = canRedeem ? 'Sẵn sàng đổi thưởng' : "C\u1EA7n ".concat(Number(state.engagement.freeBoxCost || 120), " \u0111i\u1EC3m");
}
function touchEngagementActivity() {
  state.engagement.idleHintShown = false;
  if (state.inactivityHintTimerId) clearTimeout(state.inactivityHintTimerId);
  state.inactivityHintTimerId = setTimeout(function () {
    if (state.engagement.idleHintShown) return;
    state.engagement.idleHintShown = true;
    showToast('💡 Bạn có thể mở hộp đang sáng để nhận thêm điểm thưởng.', {
      type: 'info',
      duration: 3000
    });
  }, 45000);
}
function redeemFreeBox() {
  var cost = Number(state.engagement.freeBoxCost || 120);
  if (state.engagement.points < cost) {
    showToast('❌ Chưa đủ điểm để đổi hộp miễn phí.', {
      type: 'error',
      duration: 2800
    });
    return;
  }
  state.engagement.points -= cost;
  var nextInactive = state.openOrder.find(function (n) {
    var _state$boxes;
    return String(((_state$boxes = state.boxes) === null || _state$boxes === void 0 || (_state$boxes = _state$boxes[n]) === null || _state$boxes === void 0 ? void 0 : _state$boxes.state) || '') === 'inactive';
  });
  if (nextInactive) state.boxes[nextInactive].state = 'active';
  renderBoxes();
  saveEngagementState();
  updateEngagementUI();
  showToast('🎉 Đổi hộp miễn phí thành công! Mở tiếp nào.', {
    type: 'success',
    duration: 3200
  });
}
function setupEngagementSystem() {
  loadEngagementState();
  updateEngagementUI();
  touchEngagementActivity();
}
function getHomepageThemeLabel(themeValue) {
  return homepageThemeLabelOverrides[themeValue] || HOMEPAGE_THEME_LABEL_DEFAULTS[themeValue] || themeValue;
}
function refreshHomepageThemeSelectOptions(keepSelectedValue) {
  var select = document.getElementById('homepageThemeSelect');
  if (!select) return;
  var selectedBefore = keepSelectedValue || select.value || '';
  select.innerHTML = HOMEPAGE_THEME_PRESETS.map(function (item) {
    return "<option value=\"".concat(item.value, "\">").concat(getHomepageThemeLabel(item.value), "</option>");
  }).join('');
  if (selectedBefore) {
    select.value = normalizeHomepageTheme(selectedBefore);
  }
}
function updateHomepageThemeCurrentLabel(themeValue) {
  var current = document.getElementById('homepageThemeCurrent');
  if (!current) return;
  var rawPrefix = contentTextGlobal('homeThemeCurrentPrefix', 'Đang dùng');
  var rawLabel = getHomepageThemeLabel(themeValue);
  var _m = window.__manualTextMap || null;
  var _tx = function _tx(s) {
    return _m ? translateExactTextByMap(s, _m) || s : s;
  };
  var prefix = _tx(rawPrefix);
  var label = _tx(rawLabel) || rawLabel;
  current.textContent = "".concat(prefix, ": ").concat(label);
}
function applyHomepageThemeLabelOverridesFromSettings() {
  var _window$__lmbUiSettin, _document$getElementB;
  var labelsFromSettings = ((_window$__lmbUiSettin = window.__lmbUiSettings) === null || _window$__lmbUiSettin === void 0 || (_window$__lmbUiSettin = _window$__lmbUiSettin.appearance) === null || _window$__lmbUiSettin === void 0 ? void 0 : _window$__lmbUiSettin.homepageThemeLabels) || {};
  homepageThemeLabelOverrides = sanitizeHomepageThemeLabels(labelsFromSettings);
  var selectedTheme = normalizeHomepageTheme(((_document$getElementB = document.getElementById('homepageThemeSelect')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || localStorage.getItem(HOMEPAGE_THEME_STORAGE_KEY) || getDefaultHomepageTheme());
  refreshHomepageThemeSelectOptions(selectedTheme);
  updateHomepageThemeCurrentLabel(selectedTheme);
}
function getDefaultHomepageTheme() {
  var _window$__lmbUiSettin2, _window$LMB_BOOTSTRAP;
  var fromSettings = String(((_window$__lmbUiSettin2 = window.__lmbUiSettings) === null || _window$__lmbUiSettin2 === void 0 || (_window$__lmbUiSettin2 = _window$__lmbUiSettin2.appearance) === null || _window$__lmbUiSettin2 === void 0 ? void 0 : _window$__lmbUiSettin2.homepageTheme) || '').trim();
  if (HOMEPAGE_THEME_PRESETS.some(function (item) {
    return item.value === fromSettings;
  })) {
    return fromSettings;
  }
  var fromBootstrap = String(((_window$LMB_BOOTSTRAP = window.LMB_BOOTSTRAP) === null || _window$LMB_BOOTSTRAP === void 0 ? void 0 : _window$LMB_BOOTSTRAP.defaultHomepageTheme) || '').trim();
  if (HOMEPAGE_THEME_PRESETS.some(function (item) {
    return item.value === fromBootstrap;
  })) {
    return fromBootstrap;
  }
  return 'new_homepage.html';
}
function resolveHomepageThemeKey(themeFile) {
  var normalized = normalizeHomepageTheme(themeFile);
  var map = {
    'new_homepage.html': 'background_upgraded',
    'background_upgraded.html': 'background_upgraded',
    'background.html': 'background',
    'background-alt.html': 'background-alt',
    'background (1).html': 'background-1',
    'card_v3_purple.html': 'card_v3_purple',
    'card_v4_cyber.html': 'card_v4_cyber',
    'card_v4_cyber (1).html': 'card_v4_cyber-1',
    'card_v5_baroque.html': 'card_v5_baroque',
    'b10-card.html': 'b10-card',
    'boxes-redesign.html': 'boxes-redesign',
    'gift-boxes (1).html': 'gift-boxes-1',
    'mo-hop-qua (1).html': 'mo-hop-qua-1'
  };
  return map[normalized] || 'background_upgraded';
}
function applyHomepageThemeVisual(themeFile) {
  var themeKey = resolveHomepageThemeKey(themeFile);
  document.body.setAttribute('data-home-theme', themeKey);
  var loginScreen = document.getElementById('screen-login');
  if (loginScreen) {
    loginScreen.setAttribute('data-home-theme', themeKey);
  }
}
var homepageRenderToken = 0;
window.__lmbUiSettings = {
  content: {},
  logo: {},
  appearance: {},
  seo: {},
  chat: {},
  popup: {},
  boxSettings: {},
  social: {},
  watermark: {},
  maintenance: {},
  scripts: {},
  features: {},
  userNotification: {}
};
if (!window.__lmbNativeConsole) {
  var _console, _console2, _console3, _console4, _console5;
  window.__lmbNativeConsole = {
    log: typeof ((_console = console) === null || _console === void 0 ? void 0 : _console.log) === 'function' ? console.log.bind(console) : function () {},
    info: typeof ((_console2 = console) === null || _console2 === void 0 ? void 0 : _console2.info) === 'function' ? console.info.bind(console) : function () {},
    debug: typeof ((_console3 = console) === null || _console3 === void 0 ? void 0 : _console3.debug) === 'function' ? console.debug.bind(console) : function () {},
    warn: typeof ((_console4 = console) === null || _console4 === void 0 ? void 0 : _console4.warn) === 'function' ? console.warn.bind(console) : function () {},
    error: typeof ((_console5 = console) === null || _console5 === void 0 ? void 0 : _console5.error) === 'function' ? console.error.bind(console) : function () {}
  };
}
if (!window.__lmbErrorsOnlyConsolePatched) {
  var _window$location;
  window.__lmbErrorsOnlyConsolePatched = true;
  var hostname = String(((_window$location = window.location) === null || _window$location === void 0 ? void 0 : _window$location.hostname) || '').toLowerCase();
  var isLocalDevHost = hostname === 'localhost' || hostname === '127.0.0.1';
  if (typeof console !== 'undefined' && window.__LMB_ERRORS_ONLY === true && !isLocalDevHost) {
    console.log = function () {};
    console.info = function () {};
    console.debug = function () {};
    console.warn = function () {};
  }
}
var LMB_API_GET_BURST_CACHE = new Map();
function normalizeApiGetCacheKey(url) {
  try {
    var parsed = new URL(String(url || ''), window.location.origin);
    parsed.searchParams.delete('_ts');
    return "".concat(parsed.pathname).concat(parsed.search);
  } catch (_) {
    return String(url || '').replace(/([?&])_ts=\d+(&|$)/, '$1').replace(/[?&]$/, '');
  }
}
function isRealtimeDebugEnabled() {
  try {
    var qp = new URLSearchParams(window.location.search);
    if (qp.get('rtdebug') === '1') return true;
    var ls = localStorage.getItem('lmb:rt:debug');
    if (ls === '1' || ls === 'true') return true;
  } catch (_) {}
  return !!window.__LMB_RT_DEBUG;
}
function rtDbg(step, payload) {
  if (!isRealtimeDebugEnabled()) return;
  var ts = new Date().toISOString();
  var rawData = payload && _typeof(payload) === 'object' ? payload : {
    value: payload
  };
  var data = rawData;
  if (!rawData || _typeof(rawData) !== 'object') {
    data = {
      value: rawData
    };
  }
  var safeLogData = data;
  try {
    // Keep logs serializable and lightweight for fast inspection.
    safeLogData = JSON.parse(JSON.stringify(data));
  } catch (_) {
    safeLogData = {
      note: 'non-serializable-payload',
      type: Object.prototype.toString.call(data)
    };
  }
  window.__lmbRtLogs = Array.isArray(window.__lmbRtLogs) ? window.__lmbRtLogs : [];
  window.__lmbRtLogs.push(_objectSpread({
    ts: ts,
    step: step
  }, safeLogData));
  if (window.__lmbRtLogs.length > 300) window.__lmbRtLogs.splice(0, window.__lmbRtLogs.length - 300);
  try {
    var _window$__lmbNativeCo;
    (((_window$__lmbNativeCo = window.__lmbNativeConsole) === null || _window$__lmbNativeCo === void 0 ? void 0 : _window$__lmbNativeCo.log) || console.log)("[LMB-RT] ".concat(ts, " ").concat(step), safeLogData);
  } catch (_) {}
}
window.enableLmbRtDebug = function enableLmbRtDebug() {
  var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  try {
    localStorage.setItem('lmb:rt:debug', enabled ? '1' : '0');
  } catch (_) {}
  window.__LMB_RT_DEBUG = !!enabled;
  rtDbg('debug-toggle', {
    enabled: !!enabled
  });
};
var state = {
  mode: 'Lucky',
  sessionCode: '',
  sessionCurrency: 'VND',
  openOrder: [1, 2, 3],
  boxes: {
    1: {
      state: 'inactive',
      value: 0,
      name: ''
    },
    2: {
      state: 'inactive',
      value: 0,
      name: ''
    },
    3: {
      state: 'inactive',
      value: 0,
      name: ''
    }
  },
  wallet: {
    balance: 0,
    remaining: 0,
    withdrawn: 0,
    pending: 0,
    pendingConversion: 0,
    trustScore: 100,
    minTrustScoreForWithdrawal: 100,
    canWithdrawByTrust: true,
    trustBlockedMessage: '',
    transactions: []
  },
  inventoryItems: [],
  balance: 0,
  loadingOpen: false,
  ckOn: false,
  currentHubTab: 'inventory',
  txFilter: 'all',
  txPage: 1,
  txPageSize: 6,
  activeClaimBox: null,
  currentWinBox: null,
  currentPrize: null,
  gameLocked: false,
  gameLockReason: '',
  approvalWaitIntervalId: null,
  approvalPollIntervalId: null,
  approvalReminderIntervalId: null,
  approvalSupportBlinkIntervalId: null,
  approvalTypingIntervalId: null,
  approvalTypingCursorTimeoutId: null,
  approvalUiRafId: 0,
  approvalStageTimerId: null,
  approvalLongWaitHintTimerId: null,
  approvalReminderIndex: 0,
  winOverlayRefreshTimer: null,
  existingWithdrawalId: null,
  isUpdatingWithdrawal: false,
  isSubmittingWithdrawal: false,
  withdrawSubmitPendingTimer: null,
  withdrawSubmitPendingStartedAt: 0,
  autoReloadPending: false,
  autoReloadTimerId: null,
  withdrawModalTab: 'history',
  withdrawalHistoryRows: [],
  withdrawalHistorySessionCode: '',
  sessionStartTime: parseInt(localStorage.getItem('lmbSessionStart') || '0', 10) || Date.now(),
  sessionTimeout: 30 * 60 * 1000,
  isSessionValid: true,
  syncTimer: null,
  syncBusy: false,
  economyRefreshTimer: null,
  economyRefreshInFlight: false,
  economyRefreshQueued: false,
  economyRefreshLastAt: 0,
  economyRefreshMinIntervalMs: 900,
  renderBoxesToken: 0,
  chat: {
    sessionCode: '',
    pollingTimer: null,
    pollingInterval: 8000,
    pollingInFlight: null,
    pollingSince: 0,
    pollingFallbackMode: false,
    sseUrl: '',
    initialized: false,
    unreadBaselineReady: false,
    messages: [],
    maxDomMessages: 1200,
    virtualizationThreshold: 90,
    virtualWindowSize: 64,
    virtualOverscan: 14,
    virtualRowEstimate: 84,
    virtualScrollBound: false,
    lastSeenAt: 0,
    lastUnreadCount: 0,
    pendingPrizeInfo: null,
    sendBusy: false,
    sendBusySince: 0,
    sendQueue: [],
    sendDrainPromise: null,
    uploadBusy: false,
    dragDropBound: false,
    emojiBound: false,
    sseSource: null,
    sseClient: null,
    sseScopeSignature: '',
    sseLastEventAt: 0,
    sseWatchdogTimer: null,
    sseRecoveryTimer: null,
    sseRecoveryBindingsReady: false,
    renderTimer: null,
    unreadSyncTimer: null,
    messagesFetchInFlight: null,
    messagesLastFetchAt: 0,
    messagesFetchMinIntervalMs: 1800,
    seenPostTimer: null,
    seenPostInFlight: false,
    seenPostLastAt: 0,
    seenPostCooldownMs: 1200,
    fabHintCycleTimer: null,
    fabHintCycleRunning: false,
    profileCompleted: false,
    quickStartInFlight: false,
    messageActionBound: false,
    composerRecoveryBound: false,
    iconLibrary: ['😀', '😁', '😂', '🥰', '😍', '🤩', '😎', '👏', '👍', '🙏', '🎉', '✨', '🔥', '💬', '📦', '🎁', '💸', '💎', '🌟', '🧧', '❤️', '🤝', '🛟', '📞']
  },
  gameSettings: {
    showUnluckyPopup: false,
    allowReopenPopup: true,
    showCelebrationEffects: true
  },
  sessionSpecialByBox: {
    1: false,
    2: false,
    3: false
  },
  sessionImageByBox: {
    1: '',
    2: '',
    3: ''
  },
  heroTypingTimer: null,
  heroTypingRestartTimer: null,
  homeFeedTimer: null,
  gameFeedTimer: null,
  floatingRealFeedRefreshTimer: null,
  floatingRealFeedQueue: [],
  floatingRealFeedLastFetchAt: 0,
  floatingRealFeedInFlight: false,
  floatingRealFeedCursor: 0,
  floatingRealFeedShownIds: {},
  floatingFeedMixToggle: false,
  realtimeQueue: [],
  realtimeQueueRaf: 0,
  realtimeQueueDrainTimer: null,
  approvedConversionReminderBox: null,
  approvedConversionReminderVisible: false,
  approvedConversionReminderLastShownAtByBox: {},
  approvedConversionReminderTimersByBox: {},
  approvedConversionReminderMutedThisSession: false,
  approvedConversionReminderIntervalMin: 3,
  approvalWaitingBox: 0,
  urlAutoEnterRunning: false,
  urlAutoEnterDone: false,
  urlAutoEnterAttempts: 0,
  urlAutoEnterMaxAttempts: 2,
  autoEnterRetryTimerIds: [],
  startGamePromise: null,
  hasUserInteracted: false,
  inactivityHintTimerId: null,
  rewardReminderTimerId: null,
  engagement: {
    pityThreshold: 8,
    pityCount: 0,
    streak: 0,
    points: 0,
    opens: 0,
    freeBoxCost: 120,
    lastOpenAt: 0,
    idleHintShown: false
  }
};
// Expose state globally so lazy-loaded modules (lmb-floating-feed, etc.)
// can access it regardless of whether this file runs as a classic script or ES module.
window.state = state;
var CHAT_GLOBAL_KEYS = {
  sessionCode: 'lmbv2:chat:sessionCode',
  profile: 'lmbv2:chat:profile',
  lastSeenAt: 'lmbv2:chat:lastSeenAt',
  unreadCount: 'lmbv2:chat:unreadCount',
  engagement: 'lmbv2:engagement',
  withdrawalSupportLastAt: 'lmbv2:withdraw:support:lastAt',
  withdrawalPendingDecisionIds: 'lmbv2:withdraw:pending:ids'
};
var WITHDRAW_SUPPORT_COOLDOWN_MS = 5 * 60 * 1000;
var DEFAULT_WITHDRAW_REJECT_REASON = 'Giao dịch chưa thể xử lý do lỗi hệ thống. Quý khách vui lòng liên hệ CSKH để được hỗ trợ.';
function markUserInteracted() {
  if (!state.hasUserInteracted) state.hasUserInteracted = true;
  touchEngagementActivity();
}
window.addEventListener('pointerdown', markUserInteracted, {
  passive: true
});
window.addEventListener('keydown', markUserInteracted, {
  passive: true
});
function isMobileLiteEffects() {
  var mobile = !!(window.matchMedia && window.matchMedia('(max-width: 1024px)').matches);
  var reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var hc = Number(navigator.hardwareConcurrency || 4);
  var dm = Number(navigator.deviceMemory || 4);
  var lowEndDesktop = hc <= 4 || dm <= 4;
  return mobile || reducedMotion || saveData || lowEndDesktop;
}
function shouldUseLegacyChatPollingTransport() {
  if (window.LMB_DISABLE_SSE) return true;
  if (typeof window.EventSource !== 'function') return true;
  var ua = String(navigator.userAgent || '').toLowerCase();
  var androidMatch = ua.match(/android\s+(\d+)/i);
  var androidVersion = androidMatch ? parseInt(androidMatch[1], 10) || 0 : 0;
  var lowMemory = Number(navigator.deviceMemory || 4) <= 3;
  var lowCpu = Number(navigator.hardwareConcurrency || 4) <= 4;
  return ua.includes('android') && androidVersion > 0 && (androidVersion <= 8 || isMobileLiteEffects() && (lowMemory || lowCpu));
}
function syncHomepagePerformanceMode() {
  var loginScreen = document.getElementById('screen-login');
  var homeVisible = !!(loginScreen && window.getComputedStyle(loginScreen).display !== 'none');
  document.body.classList.toggle('lmb-home-static', homeVisible);
}
if (isMobileLiteEffects()) {
  document.body.classList.add('lmb-mobile-lite');
}
var hiddenPauseCssId = 'lmbHiddenPauseAnimations';
if (!document.getElementById(hiddenPauseCssId)) {
  var style = document.createElement('style');
  style.id = hiddenPauseCssId;
  style.textContent = 'body.lmb-hidden-paused *, body.lmb-hidden-paused *::before, body.lmb-hidden-paused *::after { animation-play-state: paused !important; }';
  document.head.appendChild(style);
}
document.addEventListener('visibilitychange', function () {
  document.body.classList.toggle('lmb-hidden-paused', document.hidden);
});
function createLocalEventBus() {
  var listeners = new Map();
  return {
    on: function on(eventName, handler) {
      var key = String(eventName || '');
      if (!key || typeof handler !== 'function') return function () {};
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(handler);
      return function () {
        var set = listeners.get(key);
        if (!set) return;
        set.delete(handler);
        if (set.size === 0) listeners.delete(key);
      };
    },
    emit: function emit(eventName, payload) {
      var key = String(eventName || '');
      var set = listeners.get(key);
      if (!set || set.size === 0) return;
      set.forEach(function (fn) {
        try {
          fn(payload);
        } catch (_) {}
      });
    }
  };
}
var LMB_EVENT_BUS = window.LMBEventBus && typeof window.LMBEventBus.on === 'function' && typeof window.LMBEventBus.emit === 'function' ? window.LMBEventBus : window.__lmbLocalEventBus || (window.__lmbLocalEventBus = createLocalEventBus());
var LMB_UPDATE_SCHEDULER = window.LMBUpdateScheduler || {
  schedule: function schedule(key, payload, apply) {
    if (typeof apply === 'function') apply(payload);
  }
};
var LMB_RUNTIME = {
  realtimeConsumersBound: false,
  chatRuntimeBound: false,
  chatRuntimeStarted: false,
  chatRuntimeStarting: false,
  sseEndpointResolved: false,
  sseEndpointBase: '/events',
  sseProbePromise: null
};
var LMB_DEV_MONITOR = {
  enabled: /localhost|127\.0\.0\.1/i.test(String(location.hostname || '')),
  sseCounter: 0,
  sseWindowStart: Date.now()
};
var _cachedApiFingerprint = null;
var _cachedApiFingerprintPromise = null;
function ensureApiFingerprintCached() {
  return _ensureApiFingerprintCached.apply(this, arguments);
}
function _ensureApiFingerprintCached() {
  _ensureApiFingerprintCached = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.n) {
        case 0:
          if (!_cachedApiFingerprint) {
            _context14.n = 1;
            break;
          }
          return _context14.a(2, _cachedApiFingerprint);
        case 1:
          if (!_cachedApiFingerprintPromise) {
            _context14.n = 2;
            break;
          }
          return _context14.a(2, _cachedApiFingerprintPromise);
        case 2:
          if (!(typeof BrowserFingerprint === 'undefined')) {
            _context14.n = 3;
            break;
          }
          return _context14.a(2, null);
        case 3:
          _cachedApiFingerprintPromise = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
            var fp, _t9, _t0;
            return _regenerator().w(function (_context13) {
              while (1) switch (_context13.p = _context13.n) {
                case 0:
                  _context13.p = 0;
                  if (!(typeof BrowserFingerprint.getForAPIAsync === 'function')) {
                    _context13.n = 2;
                    break;
                  }
                  _context13.n = 1;
                  return BrowserFingerprint.getForAPIAsync();
                case 1:
                  _t9 = _context13.v;
                  _context13.n = 3;
                  break;
                case 2:
                  _t9 = typeof BrowserFingerprint.getForAPI === 'function' ? BrowserFingerprint.getForAPI() : null;
                case 3:
                  fp = _t9;
                  _cachedApiFingerprint = fp || null;
                  return _context13.a(2, _cachedApiFingerprint);
                case 4:
                  _context13.p = 4;
                  _t0 = _context13.v;
                  return _context13.a(2, null);
              }
            }, _callee13, null, [[0, 4]]);
          }))();
          return _context14.a(2, _cachedApiFingerprintPromise);
      }
    }, _callee14);
  }));
  return _ensureApiFingerprintCached.apply(this, arguments);
}
function requestBrowserNotificationPermissionOnce() {
  if (!('Notification' in window)) return Promise.resolve('unsupported');
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Promise.resolve(Notification.permission);
  }
  if (state.chat.notificationPermissionRequested) {
    return Promise.resolve(Notification.permission || 'default');
  }
  state.chat.notificationPermissionRequested = true;
  return Notification.requestPermission().catch(function () {
    return 'default';
  });
}
function emitRealtimeEvent(type, payload) {
  var isChatMessageEvent = type === 'chat:new_message';
  LMB_UPDATE_SCHEDULER.schedule(type, payload, function (nextPayload) {
    LMB_EVENT_BUS.emit(type, nextPayload);
  }, 100, {
    coalesce: !isChatMessageEvent
  });
}
function clearRealtimeQueueDrainTimer() {
  if (!state.realtimeQueueDrainTimer) return;
  clearTimeout(state.realtimeQueueDrainTimer);
  state.realtimeQueueDrainTimer = null;
}
function scheduleRealtimeQueueDrain() {
  if (state.realtimeQueueRaf) return;
  if (document.hidden) {
    if (!state.realtimeQueueDrainTimer) {
      state.realtimeQueueDrainTimer = setTimeout(function () {
        state.realtimeQueueDrainTimer = null;
        scheduleRealtimeQueueDrain();
      }, 240);
    }
    return;
  }
  clearRealtimeQueueDrainTimer();
  state.realtimeQueueRaf = requestAnimationFrame(function () {
    state.realtimeQueueRaf = 0;
    flushRealtimeEventQueue();
  });
}
function flushRealtimeEventQueue() {
  if (!Array.isArray(state.realtimeQueue) || state.realtimeQueue.length === 0) return;
  var started = performance.now();
  var processed = 0;
  var batchSize = 20;
  while (state.realtimeQueue.length > 0 && processed < batchSize) {
    var event = state.realtimeQueue.shift();
    if (event && event.type) {
      emitRealtimeEvent(event.type, event.payload);
    }
    processed += 1;
    if (performance.now() - started >= 8) break;
  }
  if (state.realtimeQueue.length > 0) {
    scheduleRealtimeQueueDrain();
  }
}
function enqueueRealtimeEvent(type, payload) {
  if (!type) return;
  if (!Array.isArray(state.realtimeQueue)) state.realtimeQueue = [];
  state.realtimeQueue.push({
    type: type,
    payload: payload
  });

  // Hard cap queue to keep memory bounded during traffic spikes.
  if (state.realtimeQueue.length > 500) {
    state.realtimeQueue.splice(0, state.realtimeQueue.length - 500);
  }
  scheduleRealtimeQueueDrain();
}
function resolveRealtimeSseBase() {
  return _resolveRealtimeSseBase.apply(this, arguments);
}
function _resolveRealtimeSseBase() {
  _resolveRealtimeSseBase = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.n) {
        case 0:
          if (!LMB_RUNTIME.sseEndpointResolved) {
            _context16.n = 1;
            break;
          }
          return _context16.a(2, LMB_RUNTIME.sseEndpointBase);
        case 1:
          if (!LMB_RUNTIME.sseProbePromise) {
            _context16.n = 2;
            break;
          }
          return _context16.a(2, LMB_RUNTIME.sseProbePromise);
        case 2:
          LMB_RUNTIME.sseProbePromise = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
            return _regenerator().w(function (_context15) {
              while (1) switch (_context15.n) {
                case 0:
                  // Use the shared /events stream directly.
                  // HEAD probing can incorrectly fail on some hosting/proxy setups and causes
                  // fallback to /api/chat/events, where player message updates may not stream.
                  LMB_RUNTIME.sseEndpointBase = '/events';
                  LMB_RUNTIME.sseEndpointResolved = true;
                  return _context15.a(2, LMB_RUNTIME.sseEndpointBase);
              }
            }, _callee15);
          }))();
          return _context16.a(2, LMB_RUNTIME.sseProbePromise);
      }
    }, _callee16);
  }));
  return _resolveRealtimeSseBase.apply(this, arguments);
}
function ensureLazyModule(_x) {
  return _ensureLazyModule.apply(this, arguments);
}
function _ensureLazyModule() {
  _ensureLazyModule = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(name) {
    var _t1;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.p = _context17.n) {
        case 0:
          if (!(!window.lmbLazyModules || typeof window.lmbLazyModules.ensure !== 'function')) {
            _context17.n = 1;
            break;
          }
          return _context17.a(2, false);
        case 1:
          _context17.p = 1;
          _context17.n = 2;
          return window.lmbLazyModules.ensure(name);
        case 2:
          return _context17.a(2, _context17.v);
        case 3:
          _context17.p = 3;
          _t1 = _context17.v;
          return _context17.a(2, false);
      }
    }, _callee17, null, [[1, 3]]);
  }));
  return _ensureLazyModule.apply(this, arguments);
}
function ensureWalletModuleReady() {
  return _ensureWalletModuleReady.apply(this, arguments);
}
function _ensureWalletModuleReady() {
  _ensureWalletModuleReady = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.n) {
        case 0:
          return _context18.a(2, ensureLazyModule('wallet'));
      }
    }, _callee18);
  }));
  return _ensureWalletModuleReady.apply(this, arguments);
}
function ensureHistoryModuleReady() {
  return _ensureHistoryModuleReady.apply(this, arguments);
}
function _ensureHistoryModuleReady() {
  _ensureHistoryModuleReady = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.n) {
        case 0:
          return _context19.a(2, ensureLazyModule('history'));
      }
    }, _callee19);
  }));
  return _ensureHistoryModuleReady.apply(this, arguments);
}
function ensureAdminStatusModuleReady() {
  return _ensureAdminStatusModuleReady.apply(this, arguments);
}
function _ensureAdminStatusModuleReady() {
  _ensureAdminStatusModuleReady = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.n) {
        case 0:
          return _context20.a(2, ensureLazyModule('admin-status'));
      }
    }, _callee20);
  }));
  return _ensureAdminStatusModuleReady.apply(this, arguments);
}
function ensureChatModuleReady() {
  return _ensureChatModuleReady.apply(this, arguments);
}
function _ensureChatModuleReady() {
  _ensureChatModuleReady = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
    var mounted, _t10;
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.p = _context21.n) {
        case 0:
          mounted = false;
          _context21.p = 1;
          _context21.n = 2;
          return ensureLazyModule('chat');
        case 2:
          mounted = _context21.v;
          _context21.n = 4;
          break;
        case 3:
          _context21.p = 3;
          _t10 = _context21.v;
          mounted = false;
        case 4:
          if (!LMB_RUNTIME.chatRuntimeBound) {
            _context21.n = 5;
            break;
          }
          return _context21.a(2, mounted);
        case 5:
          LMB_RUNTIME.chatRuntimeBound = true;
          setChatReadyUI(false);
          initChatWidgetNotificationRuntime();
          return _context21.a(2, mounted);
      }
    }, _callee21, null, [[1, 3]]);
  }));
  return _ensureChatModuleReady.apply(this, arguments);
}
var FX_PROFILE = function () {
  var reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hc = Number(navigator.hardwareConcurrency || 4);
  var dm = Number(navigator.deviceMemory || 4);
  var qp = new URLSearchParams(window.location.search).get('fx');
  var tier = 'high';
  if (qp === 'low' || qp === 'medium' || qp === 'high') {
    tier = qp;
  } else if (reducedMotion || hc <= 4 || dm <= 4) {
    tier = 'low';
  } else if (hc <= 6 || dm <= 6) {
    tier = 'medium';
  }
  return {
    tier: tier,
    effectScale: tier === 'high' ? 0.78 : tier === 'medium' ? 0.52 : 0.34,
    canvasScale: tier === 'high' ? 0.8 : tier === 'medium' ? 0.55 : 0.32,
    allowShake: tier === 'high',
    allowDualScan: tier !== 'low',
    allowVipText: tier === 'high',
    allowBeams: tier !== 'low',
    reducedMotion: reducedMotion
  };
}();
function fxScaledCount(base) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return Math.max(min, Math.round(base * FX_PROFILE.effectScale));
}
// Expose to window: needed by lazy-loaded lmb-celebration-fx.js when this file
// runs as type="module" (top-level const/fn are not automatically on window)
window.FX_PROFILE = FX_PROFILE;
window.fxScaledCount = fxScaledCount;
function resizeCanvas() {
  if (!cvs) return;
  W = cvs.width = window.innerWidth;
  H = cvs.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
var STARS = Array.from({
  length: Math.max(20, Math.round(80 * FX_PROFILE.canvasScale))
}, function () {
  return {
    x: Math.random() * 3000,
    y: Math.random() * 2000,
    r: 0.35 + Math.random() * 2.1,
    phase: Math.random() * Math.PI * 2,
    spd: 0.002 + Math.random() * 0.009,
    col: ['#ffffff', '#d8b4fe', '#c084fc', '#a78bfa', '#fbbf24', '#93c5fd'][Math.floor(Math.random() * 6)]
  };
});
var BSTARS = Array.from({
  length: Math.max(3, Math.round(10 * FX_PROFILE.canvasScale))
}, function () {
  return {
    x: Math.random() * 3000,
    y: Math.random() * 2000,
    sz: 3 + Math.random() * 5,
    phase: Math.random() * Math.PI * 2,
    spd: 0.015 + Math.random() * 0.025,
    col: ['#e879f9', '#fbbf24', '#a78bfa', '#fff', '#67e8f9'][Math.floor(Math.random() * 5)]
  };
});
function mkGift(init) {
  var s = 20 + Math.random() * 30;
  return {
    x: Math.random() * (W || 1920),
    y: init ? Math.random() * -(H || 900) - 10 : -s - 10,
    size: s,
    vy: 0.45 + Math.random() * 0.9,
    vx: (Math.random() - 0.5) * 0.55,
    rot: Math.random() * Math.PI * 2,
    rspd: (Math.random() - 0.5) * 0.022,
    a: 0.48 + Math.random() * 0.38,
    col: ['#c0603a', '#d97706', '#7c3aed', '#a855f7', '#ef4444'][Math.floor(Math.random() * 5)],
    bow: ['#f59e0b', '#fbbf24', '#c084fc', '#f0abfc', '#fca5a5'][Math.floor(Math.random() * 5)]
  };
}
var GIFTS = Array.from({
  length: Math.max(3, Math.round(8 * FX_PROFILE.canvasScale))
}, function () {
  return mkGift(true);
});
function drawGift(g) {
  ctx.save();
  ctx.translate(g.x, g.y);
  ctx.rotate(g.rot);
  ctx.globalAlpha = g.a;
  var s = g.size;
  var h = s * 0.6;
  ctx.shadowColor = g.col;
  ctx.shadowBlur = 7;
  ctx.fillStyle = g.col;
  ctx.beginPath();
  ctx.roundRect(-s / 2, -h / 2 + s * 0.17, s, h, 3);
  ctx.fill();
  ctx.globalAlpha = g.a * 0.88;
  ctx.beginPath();
  ctx.roundRect(-s / 2 - 2, -h / 2 - s * 0.16, s + 4, s * 0.22, 3);
  ctx.fill();
  ctx.globalAlpha = g.a;
  ctx.fillStyle = g.bow;
  ctx.fillRect(-s * 0.09, -h / 2 - s * 0.16, s * 0.18, h + s * 0.18);
  ctx.fillRect(-s / 2, -s * 0.07, s, s * 0.14);
  ctx.shadowBlur = 0;
  [[-0.15, 0.5], [0.15, -0.5]].forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      ox = _ref2[0],
      sg = _ref2[1];
    ctx.beginPath();
    ctx.ellipse(ox * s, -h / 2 - s * 0.02, s * 0.15, s * 0.1, sg * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}
function drawXStar(x, y, r, a, col) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.1;
  for (var i = 0; i < 4; i += 1) {
    var ang = i * Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(ang) * r * 0.4, y + Math.sin(ang) * r * 0.4);
    ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r);
    ctx.stroke();
  }
  ctx.restore();
}
var tt = 0;
if (ctx && !isMobileLiteEffects()) {
  var frameSkip = 0;
  var canvasStep = FX_PROFILE.tier === 'high' ? 1 : FX_PROFILE.tier === 'medium' ? 2 : 3;
  var canvasRafId = 0;
  var _loop = function loop() {
    frameSkip += 1;
    var loginScreen = document.getElementById('screen-login');
    var homeVisible = !!(loginScreen && window.getComputedStyle(loginScreen).display !== 'none');
    if (homeVisible) {
      ctx.clearRect(0, 0, W, H);
      canvasRafId = requestAnimationFrame(_loop);
      return;
    }
    if (document.hidden) {
      canvasRafId = requestAnimationFrame(_loop);
      return;
    }
    if (frameSkip % canvasStep !== 0) {
      canvasRafId = requestAnimationFrame(_loop);
      return;
    }
    ctx.clearRect(0, 0, W, H);
    tt += 0.016;
    var _iterator = _createForOfIteratorHelper(STARS),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var s = _step.value;
        var a = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(s.phase + tt * s.spd * 60));
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = s.col;
        if (s.r > 1.4) {
          ctx.shadowColor = s.col;
          ctx.shadowBlur = s.r * 3;
        }
        ctx.beginPath();
        ctx.arc(s.x % W, s.y % H, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var _iterator2 = _createForOfIteratorHelper(BSTARS),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _s = _step2.value;
        var _a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(_s.phase + tt * _s.spd * 60));
        var r = _s.sz * (0.7 + 0.5 * _a);
        ctx.save();
        ctx.globalAlpha = _a;
        ctx.fillStyle = _s.col;
        ctx.shadowColor = _s.col;
        ctx.shadowBlur = r * 4;
        ctx.beginPath();
        ctx.arc(_s.x % W, _s.y % H, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (_a > 0.5) drawXStar(_s.x % W, _s.y % H, r * 2.5, _a * 0.55, _s.col);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    for (var i = 0; i < GIFTS.length; i += 1) {
      var g = GIFTS[i];
      drawGift(g);
      g.y += g.vy;
      g.x += g.vx;
      g.rot += g.rspd;
      if (g.y > H + 80) GIFTS[i] = mkGift(false);
      if (g.x < -80 || g.x > W + 80) g.vx *= -1;
    }
    canvasRafId = requestAnimationFrame(_loop);
  };
  var startCanvasFx = function startCanvasFx() {
    if (canvasRafId) return;
    canvasRafId = requestAnimationFrame(_loop);
  };
  var stopCanvasFx = function stopCanvasFx() {
    if (!canvasRafId) return;
    cancelAnimationFrame(canvasRafId);
    canvasRafId = 0;
  };
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopCanvasFx();else startCanvasFx();
  });
  startCanvasFx();
} else if (cvs) {
  cvs.style.display = 'none';
}
function showToast(text) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var t = document.getElementById('toast');
  if (!t) return;
  var tone = String(options.tone || options.type || '').toLowerCase();
  var duration = Math.max(5000, Math.min(8000, Number(options.duration || 6500) || 6500));
  var toastId = "toast-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 10000));
  t.dataset.toastId = toastId;
  t.classList.remove('toast-success', 'toast-error', 'toast-info', 'toast-warning');
  if (tone === 'success') t.classList.add('toast-success');else if (tone === 'error') t.classList.add('toast-error');else if (tone === 'warning') t.classList.add('toast-warning');else t.classList.add('toast-info');
  var titleMap = {
    success: 'Thành công',
    error: 'Thông báo lỗi',
    warning: 'Cảnh báo',
    info: 'Thông báo'
  };
  var iconMap = {
    success: '✓',
    error: '!',
    warning: '!',
    info: 'i'
  };
  var toneKey = tone === 'success' || tone === 'error' || tone === 'warning' ? tone : 'info';
  t.style.setProperty('--toast-life', "".concat(duration, "ms"));
  t.innerHTML = "\n    <div class=\"toast-card\">\n      <div class=\"toast-tone\" aria-hidden=\"true\"></div>\n      <div class=\"toast-icon\" aria-hidden=\"true\">".concat(iconMap[toneKey], "</div>\n      <div class=\"toast-body\">\n        <div class=\"toast-title\">").concat(titleMap[toneKey], "</div>\n        <div class=\"toast-msg\"></div>\n      </div>\n      <button type=\"button\" class=\"toast-close\" aria-label=\"\u0110\xF3ng\" onclick=\"var el=this.closest('#toast');if(el)el.classList.remove('show')\">\xD7</button>\n      <div class=\"toast-progress\" aria-hidden=\"true\"></div>\n    </div>\n  ");
  var msgEl = t.querySelector('.toast-msg');
  if (msgEl) msgEl.textContent = text;
  if ((window.__currentLang || 'vi') !== 'vi') {
    translateRuntimeText(text).then(function (out) {
      if (out && t.dataset.toastId === toastId) {
        var latestMsgEl = t.querySelector('.toast-msg');
        if (latestMsgEl) latestMsgEl.textContent = out;
      }
    }).catch(function () {});
  }
  t.classList.add('show');
  clearTimeout(t._hideTimerId);
  t._hideTimerId = setTimeout(function () {
    return t.classList.remove('show');
  }, duration);
}
function notifyDbg(stage) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  try {
    var _window$__lmbNativeCo2;
    var enabled = false;
    try {
      var qp = new URLSearchParams(window.location.search);
      enabled = qp.get('notifydebug') === '1' || isRealtimeDebugEnabled() || window.__LMB_NOTIFY_DEBUG === true;
      if (!enabled) {
        var ls = localStorage.getItem('lmb:notify:debug');
        enabled = ls === '1' || ls === 'true';
      }
    } catch (_) {
      enabled = isRealtimeDebugEnabled() || window.__LMB_NOTIFY_DEBUG === true;
    }
    if (!enabled) return;
    var record = {
      ts: new Date().toISOString(),
      stage: stage,
      data: data
    };
    window.__LMB_NOTIFY_DEBUG_LOGS = window.__LMB_NOTIFY_DEBUG_LOGS || [];
    window.__LMB_NOTIFY_DEBUG_LOGS.push(record);
    if (window.__LMB_NOTIFY_DEBUG_LOGS.length > 400) {
      window.__LMB_NOTIFY_DEBUG_LOGS.splice(0, window.__LMB_NOTIFY_DEBUG_LOGS.length - 400);
    }
    (((_window$__lmbNativeCo2 = window.__lmbNativeConsole) === null || _window$__lmbNativeCo2 === void 0 ? void 0 : _window$__lmbNativeCo2.log) || console.log)('[LMB][notify-debug]', stage, data);
  } catch (_) {}
}
notifyDbg('runtime-script-loaded', {
  href: window.location.href,
  userAgent: navigator.userAgent,
  gameSessionCode: (state === null || state === void 0 ? void 0 : state.sessionCode) || '',
  chatSessionCode: (state === null || state === void 0 || (_state$chat = state.chat) === null || _state$chat === void 0 ? void 0 : _state$chat.sessionCode) || ''
});
function playRealtimeNotificationSound() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'message';
  if (!state.hasUserInteracted) {
    notifyDbg('sound-skip-no-interaction', {
      type: type
    });
    return;
  }
  if (!window.notificationSound && window.NotificationSoundModule && typeof window.NotificationSoundModule.getNotificationSound === 'function') {
    try {
      window.NotificationSoundModule.getNotificationSound();
    } catch (_) {}
  }
  if (!window.notificationSound || typeof notificationSound.playSound !== 'function') {
    notifyDbg('sound-skip-manager-missing', {
      type: type,
      hasManager: !!window.notificationSound
    });
    return;
  }
  try {
    notificationSound.playSound(type);
    notifyDbg('sound-play-dispatched', {
      type: type
    });
  } catch (_) {}
}
function isPendingApprovedCashBox(boxMeta) {
  var box = boxMeta || {};
  var decision = String(box.decision || '').toLowerCase();
  return !!(box.isSpecial && box.specialApproved && isCashPrizeLike(box) && !['converted', 'exchanged', 'declined'].includes(decision));
}
function getApprovedWithdrawalCount() {
  var _state$wallet;
  var historyMatchesSession = String(state.withdrawalHistorySessionCode || '').trim().toUpperCase() === String(state.sessionCode || '').trim().toUpperCase();
  var approvedIds = new Set();
  if (historyMatchesSession && Array.isArray(state.withdrawalHistoryRows)) {
    state.withdrawalHistoryRows.forEach(function (row) {
      if (!row || String(row.status || '').toLowerCase() !== 'approved') return;
      var key = String(row.id || row.request_code || row.requested_at || Math.random()).trim();
      if (key) approvedIds.add("hist:".concat(key));
    });
  }
  var txRows = Array.isArray((_state$wallet = state.wallet) === null || _state$wallet === void 0 ? void 0 : _state$wallet.transactions) ? state.wallet.transactions : [];
  txRows.forEach(function (tx) {
    var type = String((tx === null || tx === void 0 ? void 0 : tx.type) || '').toLowerCase();
    if (type !== 'withdraw') return;
    if (String((tx === null || tx === void 0 ? void 0 : tx.status) || '').toLowerCase() !== 'approved') return;
    var key = String((tx === null || tx === void 0 ? void 0 : tx.id) || (tx === null || tx === void 0 ? void 0 : tx.withdrawalCode) || (tx === null || tx === void 0 ? void 0 : tx.requestedAt) || (tx === null || tx === void 0 ? void 0 : tx.created_at) || Math.random()).trim();
    if (key) approvedIds.add("tx:".concat(key));
  });
  return approvedIds.size;
}
function getOpenedMoneyPrizeCount() {
  var ordered = Array.isArray(state.openOrder) && state.openOrder.length ? state.openOrder : [1, 2, 3];
  return ordered.reduce(function (count, boxNum) {
    var _state$boxes2;
    var box = ((_state$boxes2 = state.boxes) === null || _state$boxes2 === void 0 ? void 0 : _state$boxes2[boxNum]) || null;
    if (!box) return count;
    var boxState = String(box.state || '').toLowerCase();
    var opened = boxState.startsWith('opened');
    var isMoneyBox = !!box.isCash && Math.max(0, Number(box.value || 0)) > 0;
    if (!opened || !isMoneyBox) return count;
    return count + 1;
  }, 0);
}
function getPendingApprovedCashBoxNumber() {
  var ordered = Array.isArray(state.openOrder) && state.openOrder.length ? state.openOrder : [1, 2, 3];
  var found = ordered.find(function (boxNum) {
    var _state$boxes3;
    return isPendingApprovedCashBox(((_state$boxes3 = state.boxes) === null || _state$boxes3 === void 0 ? void 0 : _state$boxes3[boxNum]) || null);
  });
  return Number(found || 0);
}
function requiresWalletWithdrawalBeforeNextBox() {
  if (state.requireWithdrawal === false) return false;
  var openedMoneyCount = getOpenedMoneyPrizeCount();
  if (openedMoneyCount <= 0) return false;
  var approvedWithdrawalCount = getApprovedWithdrawalCount();
  return approvedWithdrawalCount < openedMoneyCount;
}
function updateGameLockByApprovedPendingCash() {
  var pendingBox = getPendingApprovedCashBoxNumber();
  if (pendingBox > 0) {
    state.gameLocked = true;
    state.gameLockReason = 'convert_required';
    return state.gameLocked;
  }
  if (requiresWalletWithdrawalBeforeNextBox()) {
    state.gameLocked = true;
    state.gameLockReason = 'withdraw_request_required';
    return state.gameLocked;
  }
  state.gameLocked = false;
  state.gameLockReason = '';
  return state.gameLocked;
}
function getGameLockNoticeText() {
  if (state.gameLockReason === 'withdraw_request_required') {
    return 'Vui lòng hoàn tất bước xác minh phần thưởng tại CSKH trước khi mở hộp tiếp theo';
  }
  return 'Vui lòng quy đổi phần thưởng đã duyệt trước khi mở hộp tiếp theo';
}
function isAlreadyConvertedErrorMessage(message) {
  var msg = String(message || '').toLowerCase();
  if (!msg) return false;
  return msg.includes('đã quy đổi') || msg.includes('da quy doi') || msg.includes('đã được duyệt quy đổi') || msg.includes('da duoc duyet quy doi') || msg.includes('đã được duyệt') || msg.includes('already converted') || msg.includes('already approved');
}
function getApprovedConversionReminderIntervalMs() {
  var mins = Math.max(1, Math.min(120, Number(state.approvedConversionReminderIntervalMin || 3) || 3));
  state.approvedConversionReminderIntervalMin = mins;
  return mins * 60 * 1000;
}
function clearApprovedConversionReminderTimer(boxNumber) {
  var box = Number(boxNumber || 0);
  if (!box) return;
  var timerId = state.approvedConversionReminderTimersByBox[box];
  if (timerId) {
    clearTimeout(timerId);
    state.approvedConversionReminderTimersByBox[box] = null;
  }
}
function scheduleApprovedConversionReminder(boxNumber) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var box = Number(boxNumber || 0);
  if (!box) return;
  clearApprovedConversionReminderTimer(box);
  if (state.approvedConversionReminderMutedThisSession) return;
  var delayMs = Math.max(5000, Number(options.delayMs || getApprovedConversionReminderIntervalMs()));
  state.approvedConversionReminderTimersByBox[box] = setTimeout(function () {
    var _state$boxes4;
    state.approvedConversionReminderTimersByBox[box] = null;
    var meta = ((_state$boxes4 = state.boxes) === null || _state$boxes4 === void 0 ? void 0 : _state$boxes4[box]) || null;
    if (!meta || !isPendingApprovedCashBox(meta)) return;
    var winOv = document.getElementById('winOv');
    var winOverlayOpen = !!(winOv && winOv.classList.contains('open'));
    if (!winOverlayOpen) {
      showApprovedConversionReminderModal(box);
      return;
    }

    // Defer reminder while the main prize overlay is currently open.
    scheduleApprovedConversionReminder(box, {
      delayMs: 45000
    });
  }, delayMs);
}
function stopApprovedConversionReminder(boxNumber) {
  var box = Number(boxNumber || 0);
  if (box > 0) {
    clearApprovedConversionReminderTimer(box);
  }
  if (state.approvedConversionReminderBox && Number(state.approvedConversionReminderBox) === box) {
    hideApprovedConversionReminderModal({
      scheduleNext: false
    });
  }
}
function ensureApprovedConversionReminderModal() {
  var styleEl = document.getElementById('lmbApprovedReminderStyle');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'lmbApprovedReminderStyle';
    styleEl.textContent = '.apr-reminder-ov{position:fixed;inset:0;z-index:99998;background:rgba(3,8,20,.64);display:none;align-items:center;justify-content:center;padding:16px}.apr-reminder-card{width:min(460px,94vw);border-radius:16px;border:1px solid rgba(148,163,184,.36);background:linear-gradient(165deg,#0f172a,#111827);box-shadow:0 28px 70px rgba(2,6,23,.6);color:#e2e8f0;padding:18px 18px 16px}.apr-reminder-title{font-size:18px;font-weight:800;margin:0 0 8px;color:#f8fafc}.apr-reminder-msg{font-size:13px;line-height:1.5;color:#cbd5e1}.apr-reminder-options{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;flex-wrap:wrap}.apr-reminder-interval{font-size:12px;color:#cbd5e1;display:flex;align-items:center;gap:6px}.apr-reminder-interval input{width:54px;border:1px solid rgba(148,163,184,.45);border-radius:7px;background:rgba(15,23,42,.45);color:#e2e8f0;padding:4px 6px;font-size:12px}.apr-reminder-check{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:#cbd5e1;cursor:pointer}.apr-reminder-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:14px}.apr-reminder-btn{border:none;border-radius:10px;padding:9px 12px;font-size:13px;font-weight:700;cursor:pointer}.apr-reminder-btn.primary{background:linear-gradient(135deg,#22d3ee,#38bdf8);color:#082f49}.apr-reminder-btn.secondary{background:rgba(148,163,184,.2);color:#e2e8f0}';
    document.head.appendChild(styleEl);
  }
  var ov = document.getElementById('approvedConversionReminderOv');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'approvedConversionReminderOv';
    ov.className = 'apr-reminder-ov';
    ov.innerHTML = '<div class="apr-reminder-card" role="dialog" aria-modal="true" aria-labelledby="aprReminderTitle"><h3 class="apr-reminder-title" id="aprReminderTitle">Thông báo duyệt quà</h3><div class="apr-reminder-msg" id="aprReminderMsg"></div><div class="apr-reminder-options"><label class="apr-reminder-interval">Nhắc lại sau <input type="number" id="aprReminderMinutesInput" min="1" max="120" step="1" value="3"> phút</label><label class="apr-reminder-check"><input type="checkbox" id="aprReminderMuteSession"> Không nhắc lại trong phiên này</label></div><div class="apr-reminder-actions"><button type="button" class="apr-reminder-btn secondary" id="aprReminderLaterBtn">Để sau</button><button type="button" class="apr-reminder-btn primary" id="aprReminderConvertBtn">Quy đổi ngay</button></div></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function (e) {
      if (e.target === ov) hideApprovedConversionReminderModal();
    });
    var minutesInput = ov.querySelector('#aprReminderMinutesInput');
    if (minutesInput) {
      minutesInput.addEventListener('change', function () {
        var mins = Math.max(1, Math.min(120, Number(minutesInput.value || 3) || 3));
        state.approvedConversionReminderIntervalMin = mins;
        minutesInput.value = String(mins);
      });
    }
    var muteCheckbox = ov.querySelector('#aprReminderMuteSession');
    if (muteCheckbox) {
      muteCheckbox.addEventListener('change', function () {
        state.approvedConversionReminderMutedThisSession = !!muteCheckbox.checked;
        if (state.approvedConversionReminderMutedThisSession) {
          Object.keys(state.approvedConversionReminderTimersByBox || {}).forEach(function (key) {
            clearApprovedConversionReminderTimer(Number(key));
          });
        }
      });
    }
    var laterBtn = ov.querySelector('#aprReminderLaterBtn');
    if (laterBtn) {
      laterBtn.addEventListener('click', function () {
        return hideApprovedConversionReminderModal({
          scheduleNext: true
        });
      });
    }
    var convertBtn = ov.querySelector('#aprReminderConvertBtn');
    if (convertBtn) {
      convertBtn.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var box, ok, _t, _t2;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              box = Number(state.approvedConversionReminderBox || 0);
              if (!(!box || !state.boxes[box])) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              ok = window.confirm('Bạn chắc chắn muốn quy đổi tiền ngay bây giờ?');
              if (ok) {
                _context.n = 2;
                break;
              }
              return _context.a(2);
            case 2:
              hideApprovedConversionReminderModal({
                scheduleNext: false
              });
              _context.p = 3;
              _context.n = 4;
              return convertApprovedSpecialPrizeNow(box);
            case 4:
              _context.n = 10;
              break;
            case 5:
              _context.p = 5;
              _t = _context.v;
              if (!isAlreadyConvertedErrorMessage(_t === null || _t === void 0 ? void 0 : _t.message)) {
                _context.n = 9;
                break;
              }
              _context.p = 6;
              if (state.boxes[box]) {
                state.boxes[box].decision = 'converted';
                state.boxes[box].status = 'converted';
                state.boxes[box].processingStatus = 'converted';
              }
              stopApprovedConversionReminder(box);
              _context.n = 7;
              return Promise.all([refreshHubData(), refreshBoxesFromServer()]);
            case 7:
              activateNextBox();
              showToast('✅ Hệ thống đã đồng bộ trạng thái quy đổi thành công.');
              return _context.a(2);
            case 8:
              _context.p = 8;
              _t2 = _context.v;
            case 9:
              showToast("\u274C ".concat((_t === null || _t === void 0 ? void 0 : _t.message) || 'Quy đổi thất bại'));
              showApprovedConversionReminderModal(box, {
                force: true
              });
            case 10:
              return _context.a(2);
          }
        }, _callee, null, [[6, 8], [3, 5]]);
      })));
    }
  }
  return ov;
}
function hideApprovedConversionReminderModal() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var scheduleNext = options.scheduleNext !== false;
  var ov = document.getElementById('approvedConversionReminderOv');
  if (!ov) return;
  var box = Number(state.approvedConversionReminderBox || 0);
  ov.style.display = 'none';
  state.approvedConversionReminderVisible = false;
  if (scheduleNext && box > 0 && !state.approvedConversionReminderMutedThisSession) {
    var _state$boxes5;
    var meta = ((_state$boxes5 = state.boxes) === null || _state$boxes5 === void 0 ? void 0 : _state$boxes5[box]) || null;
    if (meta && isPendingApprovedCashBox(meta)) {
      scheduleApprovedConversionReminder(box);
    }
  }
}
function showApprovedConversionReminderModal(boxNumber) {
  var _state$boxes6;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var box = Number(boxNumber || 0);
  var meta = ((_state$boxes6 = state.boxes) === null || _state$boxes6 === void 0 ? void 0 : _state$boxes6[box]) || null;
  if (!box || !meta || !isPendingApprovedCashBox(meta)) return;
  if (state.approvedConversionReminderMutedThisSession) return;
  var force = options.force === true;
  var now = Date.now();
  var lastShownAt = Number(state.approvedConversionReminderLastShownAtByBox[box] || 0);
  if (!force && now - lastShownAt < 12000) return;
  var ov = ensureApprovedConversionReminderModal();
  if (!ov) return;
  var amount = Number(meta.value || 0);
  var currency = String(meta.currency || 'VND').toUpperCase();
  var amountText = formatCurrencyBySymbol(amount, currency);
  var msgEl = ov.querySelector('#aprReminderMsg');
  var minutesInput = ov.querySelector('#aprReminderMinutesInput');
  var muteCheckbox = ov.querySelector('#aprReminderMuteSession');
  if (msgEl) {
    msgEl.textContent = "Qu\xE0 c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c admin duy\u1EC7t. B\u1EA1n ch\u01B0a quy \u0111\u1ED5i ".concat(amountText, ". Vui l\xF2ng b\u1EA5m \"Quy \u0111\u1ED5i ngay\" \u0111\u1EC3 ho\xE0n t\u1EA5t.");
  }
  if (minutesInput) {
    var mins = Math.max(1, Math.min(120, Number(state.approvedConversionReminderIntervalMin || 3) || 3));
    state.approvedConversionReminderIntervalMin = mins;
    minutesInput.value = String(mins);
  }
  if (muteCheckbox) {
    muteCheckbox.checked = !!state.approvedConversionReminderMutedThisSession;
  }
  state.approvedConversionReminderBox = box;
  state.approvedConversionReminderVisible = true;
  state.approvedConversionReminderLastShownAtByBox[box] = now;
  ov.style.display = 'flex';
  clearApprovedConversionReminderTimer(box);
  playRealtimeNotificationSound('admin_message');
}
window.__runtimeI18nCache = window.__runtimeI18nCache || {};
window.__manualTextMap = window.__manualTextMap || {};
function translateRuntimeText(text) {
  var lang = window.__currentLang || 'vi';
  var src = String(text || '');
  if (!src || lang === 'vi') return Promise.resolve(src);
  var ck = lang + '::' + src;
  if (window.__runtimeI18nCache[ck]) return Promise.resolve(window.__runtimeI18nCache[ck]);
  var map = window.__i18nTranslations || {};
  var textMap = window.__manualTextMap || {};
  var out = map[src] || textMap[src] || src;
  window.__runtimeI18nCache[ck] = out;
  return Promise.resolve(out);
}
function formatVND(value) {
  return "".concat(Math.max(0, Number(value) || 0).toLocaleString('vi-VN'), " \u0111");
}
function formatCurrency(value, currency) {
  var v = Math.max(0, Number(value) || 0).toLocaleString('vi-VN');
  if (currency === 'USD') return "$".concat(v, " USD");
  if (currency === 'NDT') return "\xA5".concat(v, " NDT");
  return "".concat(v, " \u0111");
}
function normalizeCurrency(currency) {
  var cur = String(currency || 'VND').toUpperCase();
  if (cur === 'USD' || cur === 'NDT') return cur;
  return 'VND';
}
function formatCurrencyBySymbol(value, currency) {
  var amount = Math.max(0, Number(value) || 0).toLocaleString('vi-VN');
  var cur = normalizeCurrency(currency);
  if (cur === 'USD') return "$".concat(amount);
  if (cur === 'NDT') return "\xA5".concat(amount);
  return "".concat(amount, "\u20AB");
}
function renderCurrencyWalletCards() {
  var card = document.getElementById('walletItemVND');
  var badge = document.getElementById('walletBadgeVND');
  var amount = document.getElementById('walletAmtVND');
  var note = document.getElementById('walletNoteVND');
  if (!card || !badge || !amount || !note) return;
  var vndAmount = Math.max(0, Number(state.wallet.remaining || 0));
  var pending = Math.max(0, Number(state.wallet.pendingConversion || 0));
  card.classList.remove('is-hidden');
  amount.textContent = vndAmount.toLocaleString('vi-VN');
  if (vndAmount > 0) {
    badge.className = 'wallet-currency-badge ready';
    badge.textContent = contentTextGlobal('walletBadgeReady', 'Khả dụng');
    note.textContent = pending > 0 ? "".concat(contentTextGlobal('walletNotePendingPrefix', 'Đang chờ duyệt quy đổi thêm'), " ").concat(formatCurrencyBySymbol(pending, 'VND')) : contentTextGlobal('walletNoteReady', 'Đang chờ xác nhận quy đổi từ hệ thống');
    return;
  }
  if (pending > 0) {
    badge.className = 'wallet-currency-badge waiting';
    badge.textContent = contentTextGlobal('walletBadgeWaiting', 'Chờ duyệt');
    note.textContent = "".concat(contentTextGlobal('walletNoteCurrencyPendingPrefix', 'USD/NDT đang duyệt, sẽ tự cộng'), " ").concat(formatCurrencyBySymbol(pending, 'VND'));
    return;
  }
  badge.className = 'wallet-currency-badge locked';
  badge.textContent = contentTextGlobal('walletBadgeEmpty', 'Ví trống');
  note.textContent = contentTextGlobal('walletNoteEmpty', 'Mở hộp có thưởng tiền để cộng vào ví VND');
}
function pushGameSystemNotice(title, message) {
  var feed = document.getElementById('gameFloatingFeed');
  if (!feed) return;
  var now = new Date();
  var time = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  var el = document.createElement('div');
  el.className = 'home-feed-item';
  el.innerHTML = "<div class=\"home-feed-icon\" aria-hidden=\"true\"><span class=\"home-feed-glyph\">\uD83D\uDCB0</span></div><div class=\"home-feed-body\"><div class=\"home-feed-title\">".concat(escapeHtml(title || 'Cập nhật ví'), "</div><div class=\"home-feed-sub\">").concat(escapeHtml(message || ''), "</div><div class=\"home-feed-time\">").concat(time, "</div></div>");
  requestAnimationFrame(function () {
    if (!feed.isConnected) return;
    feed.appendChild(el);
  });
  while (feed.children.length > 3) {
    feed.removeChild(feed.firstElementChild);
  }
  setTimeout(function () {
    if (el.parentNode) el.remove();
  }, 6200);
}
function updateCurrencyUI() {
  var cur = state.sessionCurrency || 'VND';
  // Nav currency badge
  var badge = document.getElementById('navCurrBadge');
  if (badge) {
    if (cur !== 'VND') {
      badge.textContent = cur === 'USD' ? '$ USD' : '¥ NDT';
      badge.className = 'nav-curr-badge ' + (cur === 'USD' ? 'cur-usd' : 'cur-ndt');
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }
  // Withdrawal currency labels
  var withCurrLabel = document.getElementById('withCurrLabel');
  if (withCurrLabel) withCurrLabel.textContent = cur === 'USD' ? 'USD' : cur === 'NDT' ? 'NDT' : 'VNĐ';
  var withCurrUnit = document.getElementById('withCurrUnit');
  if (withCurrUnit) withCurrUnit.textContent = "(".concat(cur === 'USD' ? 'USD' : cur === 'NDT' ? 'NDT' : 'VNĐ', ")");
}

/* ========== VietQR Integration ========== */
var vietqrState = {
  banks: [],
  loaded: false
};
function loadVietQRBanks() {
  return _loadVietQRBanks.apply(this, arguments);
}
function _loadVietQRBanks() {
  _loadVietQRBanks = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
    var res, json, _t11;
    return _regenerator().w(function (_context22) {
      while (1) switch (_context22.p = _context22.n) {
        case 0:
          if (!vietqrState.loaded) {
            _context22.n = 1;
            break;
          }
          return _context22.a(2, vietqrState.banks);
        case 1:
          _context22.p = 1;
          _context22.n = 2;
          return fetch('https://api.vietqr.io/v2/banks');
        case 2:
          res = _context22.v;
          _context22.n = 3;
          return res.json();
        case 3:
          json = _context22.v;
          if (Array.isArray(json.data)) {
            vietqrState.banks = json.data;
            vietqrState.loaded = true;
            populateBankSelect();
          }
          _context22.n = 5;
          break;
        case 4:
          _context22.p = 4;
          _t11 = _context22.v;
        case 5:
          return _context22.a(2, vietqrState.banks);
      }
    }, _callee22, null, [[1, 4]]);
  }));
  return _loadVietQRBanks.apply(this, arguments);
}
function populateBankSelect() {
  var sel = document.getElementById('withBank');
  if (!sel || sel.tagName !== 'SELECT') return;
  var current = sel.value;
  sel.innerHTML = "<option value=\"\">".concat(escapeHtml(contentTextGlobal('withBankPlaceholderOption', '-- Chọn ngân hàng --')), "</option>");
  vietqrState.banks.forEach(function (b) {
    var opt = document.createElement('option');
    opt.value = b.bin;
    opt.textContent = "".concat(b.shortName, " - ").concat(b.name);
    opt.dataset.shortName = b.shortName || '';
    opt.dataset.bin = b.bin || '';
    sel.appendChild(opt);
  });
  if (current) sel.value = current;
}
function getSelectedBankBin() {
  var sel = document.getElementById('withBank');
  if (!sel) return '';
  return sel.value || '';
}
function getSelectedBankName() {
  var sel = document.getElementById('withBank');
  if (!sel || !sel.selectedOptions.length) return '';
  var opt = sel.selectedOptions[0];
  return opt.dataset.shortName || opt.textContent || '';
}
function generateVietQR() {
  var _document$getElementB2, _document$getElementB3, _document$getElementB4;
  var bin = getSelectedBankBin();
  var accNo = (((_document$getElementB2 = document.getElementById('withAccNo')) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.value) || '').trim();
  var accName = (((_document$getElementB3 = document.getElementById('withAccName')) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) || '').trim();
  var amount = parseMoneyInputValue(((_document$getElementB4 = document.getElementById('withAmount')) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '');
  var preview = document.getElementById('withQrPreview');
  var img = document.getElementById('withQrImg');
  if (!preview || !img) return;
  if (!bin || !accNo) {
    preview.style.display = 'none';
    return;
  }
  var params = new URLSearchParams();
  if (amount > 0) params.set('amount', String(amount));
  if (accName) params.set('accountName', accName);
  params.set('addInfo', "Rut tien ".concat(state.sessionCode || ''));
  var url = "https://img.vietqr.io/image/".concat(encodeURIComponent(bin), "-").concat(encodeURIComponent(accNo), "-compact.jpg?").concat(params.toString());
  img.src = url;
  preview.style.display = 'block';
}
function formatDateTime(value) {
  if (!value) return '--';
  var d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return d.toLocaleString('vi-VN');
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
}
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
function getSessionScopedKey(suffix) {
  return "lmbv2:".concat(state.sessionCode || 'unknown', ":").concat(suffix);
}
function saveSessionProfile(suffix) {
  var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!state.sessionCode) return;
  localStorage.setItem(getSessionScopedKey(suffix), JSON.stringify(payload));
}
function saveSessionCode(code) {
  state.sessionCode = String(code || '').toUpperCase();
  state.sessionStartTime = Date.now();
  state.isSessionValid = true;
  localStorage.setItem('lmbSessionCode', state.sessionCode);
  localStorage.setItem('lmbSessionStart', String(state.sessionStartTime));

  // Re-scope realtime SSE as soon as a valid game session code exists.
  // Notification runtime can start before joinSession() completes.
  if (state.chat.notificationRuntimeReady || state.chat.sseSource || state.chat.sseClient) {
    startChatSSE();
  }
}
function clearSessionCode() {
  state.sessionCode = '';
  state.isSessionValid = false;
  localStorage.removeItem('lmbSessionCode');
  localStorage.removeItem('lmbSessionStart');
  if (typeof lmbManager !== 'undefined') {
    lmbManager.clearSession();
  }
}
function isSessionExpired() {
  return Date.now() - state.sessionStartTime > state.sessionTimeout;
}
function getSessionRemainingTime() {
  return Math.max(0, state.sessionTimeout - (Date.now() - state.sessionStartTime));
}
function validateSession() {
  if (!state.sessionCode) return false;
  if (isSessionExpired()) {
    clearSessionCode();
    stopRealtimeSync();
    var gameScreen = document.getElementById('screen-game');
    var loginScreen = document.getElementById('screen-login');
    if (gameScreen) gameScreen.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
    showToast('⏰ Phiên đã hết hạn, vui lòng nhập lại mã phiên');
    return false;
  }
  return true;
}
function pushPageHistoryState(pageName) {
  try {
    window.history.pushState({
      lmbPage: pageName,
      sessionCode: state.sessionCode || ''
    }, '', window.location.href);
  } catch (_) {}
}
function handleBackNavigationInSession() {
  var hub = document.getElementById('hubOv');
  var claim = document.getElementById('claimOv');
  var withModal = document.getElementById('modalOv');
  var thank = document.getElementById('thankYouOv');
  if (thank && thank.classList.contains('open')) return closeThankYou();
  if (claim && claim.classList.contains('open')) return closeClaimModal();
  if (withModal && withModal.classList.contains('open')) return closeWith();
  if (hub && hub.classList.contains('open')) return closeHub();
  var gameScreen = document.getElementById('screen-game');
  var loginScreen = document.getElementById('screen-login');
  if (gameScreen && gameScreen.style.display !== 'none') {
    gameScreen.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
  }
}
function loadSessionProfile(suffix) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!state.sessionCode) return fallback;
  try {
    var raw = localStorage.getItem(getSessionScopedKey(suffix));
    if (!raw) return fallback;
    var parsed = JSON.parse(raw);
    return parsed && _typeof(parsed) === 'object' ? parsed : fallback;
  } catch (_) {
    return fallback;
  }
}
function ensureLoadingOverlay() {
  var ov = document.getElementById('lmbLoadingOv');
  if (ov) return ov;
  ov = document.createElement('div');
  ov.id = 'lmbLoadingOv';
  ov.className = 'modal-ov';
  ov.innerHTML = "\n    <div class=\"mbox\" style=\"width:min(420px,92vw)\">\n      <div class=\"mbody\" style=\"text-align:center;padding:24px;\">\n        <div style=\"font-size:34px;margin-bottom:10px\">\u23F3</div>\n        <div id=\"lmbLoadingText\" class=\"mttl\" style=\"font-size:16px;\">\u0110ang x\u1EED l\xFD...</div>\n      </div>\n    </div>\n  ";
  document.body.appendChild(ov);
  return ov;
}
function showLoadingOverlay(message) {
  var ov = ensureLoadingOverlay();
  var txt = document.getElementById('lmbLoadingText');
  if (txt && message) txt.textContent = message;
  ov.classList.add('open');
}
function hideLoadingOverlay() {
  var ov = document.getElementById('lmbLoadingOv');
  if (ov) ov.classList.remove('open');
}
function withLoadingOverlay(_x2, _x3) {
  return _withLoadingOverlay.apply(this, arguments);
}
function _withLoadingOverlay() {
  _withLoadingOverlay = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(message, task) {
    return _regenerator().w(function (_context23) {
      while (1) switch (_context23.p = _context23.n) {
        case 0:
          showLoadingOverlay(message);
          _context23.p = 1;
          _context23.n = 2;
          return task();
        case 2:
          return _context23.a(2, _context23.v);
        case 3:
          _context23.p = 3;
          hideLoadingOverlay();
          return _context23.f(3);
        case 4:
          return _context23.a(2);
      }
    }, _callee23, null, [[1,, 3, 4]]);
  }));
  return _withLoadingOverlay.apply(this, arguments);
}
function withTimeout(taskPromise, timeoutMs, timeoutMessage) {
  var ms = Math.max(1000, Number(timeoutMs) || 15000);
  var timer = null;
  return new Promise(function (resolve, reject) {
    timer = setTimeout(function () {
      reject(new Error(timeoutMessage || 'Yeu cau bi timeout'));
    }, ms);
    Promise.resolve(taskPromise).then(resolve).catch(reject).finally(function () {
      if (timer) clearTimeout(timer);
    });
  });
}

// ── Floating Feed — lazy loaded from modules/lmb-floating-feed.js ──
function showWinNoti() {}
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function buildNamePool() {
  return [];
}
function buildPrizePool() {
  return [];
}
function randomFeedDelayMs() {
  return 3000;
}
function maskName() {
  return '********ng';
}
function randomTickerAgo() {
  return '1 phút trước';
}
function parseToEpochMs() {
  return 0;
}
function formatFloatingAgoFromTimestamp() {
  return '';
}
function normalizeFloatingWinnerEvent() {
  return null;
}
function getNextRealFloatingWinner() {
  return null;
}
function refreshRealFloatingWinnerFeed() {}
function startRealFloatingFeedRefreshTimer() {}
function stopRealFloatingFeedRefreshTimer() {
  if (state.floatingRealFeedRefreshTimer) {
    clearTimeout(state.floatingRealFeedRefreshTimer);
    state.floatingRealFeedRefreshTimer = null;
  }
}
function getFloatingPrizePool() {
  return [];
}
function normalizeFloatingMessageItem() {
  return {
    text: '',
    icon: '',
    image: ''
  };
}
function getFloatingMessageTemplates() {
  return [];
}
function buildTickerHtml() {
  return '';
}
function buildHomeFeedNotice() {
  return {};
}
function pushHomeFloatingNotice() {}
function initHomeFloatingFeed() {}
function pushGameFloatingNotice() {}
function initGameFloatingFeed() {}
function renderWinnerTicker() {}
function initWinnerTicker() {}
function loadFloatingConfig() {
  return Promise.resolve();
}
function applyFloatingPosition() {}
function scheduleNoti() {}
function showThankYouPage() {
  var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var title = document.getElementById('thankYouTitle');
  var sub = document.getElementById('thankYouSub');
  var method = document.getElementById('thankYouMethod');
  var name = document.getElementById('thankYouName');
  var phone = document.getElementById('thankYouPhone');
  var detail = document.getElementById('thankYouDetail');
  if (title) title.textContent = result.title || state.gameSettings.thankyouTitle || 'Cảm ơn bạn!';
  if (sub) sub.textContent = result.subtitle || state.gameSettings.thankyouMessage || 'Yêu cầu đã được hệ thống ghi nhận';
  if (method) method.textContent = "Ph\u01B0\u01A1ng th\u1EE9c: ".concat(result.method || '--');
  if (name) name.textContent = "Ng\u01B0\u1EDDi nh\u1EADn: ".concat(result.playerName || '--');
  if (phone) phone.textContent = "\u0110i\u1EC7n tho\u1EA1i: ".concat(result.playerPhone || '--');
  if (detail) detail.textContent = "Chi ti\u1EBFt: ".concat(result.detail || '--');
  var ov = document.getElementById('thankYouOv');
  if (ov) ov.classList.add('open');
  pushPageHistoryState('thank-you');
}
function closeThankYou() {
  var ov = document.getElementById('thankYouOv');
  if (ov) ov.classList.remove('open');
}
function getHeaders() {
  return _getHeaders.apply(this, arguments);
}
function _getHeaders() {
  _getHeaders = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
    var extra,
      headers,
      fp,
      _args24 = arguments,
      _t12;
    return _regenerator().w(function (_context24) {
      while (1) switch (_context24.n) {
        case 0:
          extra = _args24.length > 0 && _args24[0] !== undefined ? _args24[0] : {};
          headers = _objectSpread({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }, extra);
          _t12 = _cachedApiFingerprint;
          if (_t12) {
            _context24.n = 2;
            break;
          }
          _context24.n = 1;
          return ensureApiFingerprintCached();
        case 1:
          _t12 = _context24.v;
        case 2:
          fp = _t12;
          if (fp) {
            headers['X-Browser-Fingerprint'] = fp.fingerprintHash;
            headers['X-Fingerprint-Data'] = fp.browserFingerprint;
          }
          return _context24.a(2, headers);
      }
    }, _callee24);
  }));
  return _getHeaders.apply(this, arguments);
}
function apiJson(_x4) {
  return _apiJson.apply(this, arguments);
}
function _apiJson() {
  _apiJson = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(url) {
    var options,
      t0,
      timeoutMs,
      method,
      isGet,
      cacheKey,
      cacheTtlMs,
      entry,
      controller,
      fetchOptions,
      timeoutId,
      fetchPromise,
      _args26 = arguments,
      _t14,
      _t15,
      _t16,
      _t17,
      _t18,
      _t19;
    return _regenerator().w(function (_context26) {
      while (1) switch (_context26.p = _context26.n) {
        case 0:
          options = _args26.length > 1 && _args26[1] !== undefined ? _args26[1] : {};
          t0 = performance.now();
          timeoutMs = Math.max(3000, Number(options.timeoutMs) || 12000);
          method = String(options.method || 'GET').toUpperCase();
          isGet = method === 'GET';
          cacheKey = isGet ? normalizeApiGetCacheKey(url) : '';
          cacheTtlMs = isMobileLiteEffects() ? 1200 : 550;
          if (!(isGet && cacheKey)) {
            _context26.n = 2;
            break;
          }
          entry = LMB_API_GET_BURST_CACHE.get(cacheKey);
          if (!(entry !== null && entry !== void 0 && entry.inFlight)) {
            _context26.n = 1;
            break;
          }
          return _context26.a(2, entry.inFlight);
        case 1:
          if (!(entry !== null && entry !== void 0 && entry.value && Date.now() - Number(entry.ts || 0) <= cacheTtlMs)) {
            _context26.n = 2;
            break;
          }
          return _context26.a(2, entry.value);
        case 2:
          controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
          _t14 = _objectSpread;
          _t15 = _objectSpread({}, options);
          _t16 = {};
          _t17 = method;
          _context26.n = 3;
          return getHeaders(options.headers || {});
        case 3:
          _t18 = _context26.v;
          fetchOptions = _t14(_t15, _t16, {
            method: _t17,
            cache: 'no-store',
            headers: _t18
          });
          delete fetchOptions.timeoutMs;
          timeoutId = null;
          if (controller) {
            fetchOptions.signal = controller.signal;
            timeoutId = setTimeout(function () {
              try {
                controller.abort();
              } catch (_) {}
            }, timeoutMs);
          }
          fetchPromise = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
            var res, data, ms, apiErr, _t13;
            return _regenerator().w(function (_context25) {
              while (1) switch (_context25.p = _context25.n) {
                case 0:
                  _context25.p = 0;
                  _context25.n = 1;
                  return fetch(url, fetchOptions);
                case 1:
                  res = _context25.v;
                  _context25.n = 4;
                  break;
                case 2:
                  _context25.p = 2;
                  _t13 = _context25.v;
                  if (!(_t13 && _t13.name === 'AbortError')) {
                    _context25.n = 3;
                    break;
                  }
                  throw new Error('Kết nối máy chủ quá lâu. Vui lòng thử lại.');
                case 3:
                  throw _t13;
                case 4:
                  _context25.p = 4;
                  if (timeoutId) clearTimeout(timeoutId);
                  return _context25.f(4);
                case 5:
                  _context25.n = 6;
                  return res.json().catch(function () {
                    return {
                      success: false,
                      message: 'Dữ liệu phản hồi không hợp lệ'
                    };
                  });
                case 6:
                  data = _context25.v;
                  if (LMB_DEV_MONITOR.enabled) {
                    ms = Math.round(performance.now() - t0);
                    console.log('[LMB][api] %s %sms %s', url, ms, res.status);
                  }
                  if (!(!res.ok || data.success === false)) {
                    _context25.n = 7;
                    break;
                  }
                  apiErr = new Error(data.message || "Request failed (".concat(res.status, ")"));
                  apiErr.code = data.code || null;
                  apiErr.data = data;
                  throw apiErr;
                case 7:
                  if (isGet && cacheKey) {
                    LMB_API_GET_BURST_CACHE.set(cacheKey, {
                      value: data,
                      ts: Date.now(),
                      inFlight: null
                    });
                  }
                  return _context25.a(2, data);
              }
            }, _callee25, null, [[0, 2, 4, 5]]);
          }))();
          if (isGet && cacheKey) {
            LMB_API_GET_BURST_CACHE.set(cacheKey, {
              value: null,
              ts: Date.now(),
              inFlight: fetchPromise
            });
          }
          _context26.p = 4;
          _context26.n = 5;
          return fetchPromise;
        case 5:
          return _context26.a(2, _context26.v);
        case 6:
          _context26.p = 6;
          _t19 = _context26.v;
          if (isGet && cacheKey) {
            LMB_API_GET_BURST_CACHE.delete(cacheKey);
          }
          throw _t19;
        case 7:
          return _context26.a(2);
      }
    }, _callee26, null, [[4, 6]]);
  }));
  return _apiJson.apply(this, arguments);
}
function invalidateGetBurstCache(url) {
  var key = normalizeApiGetCacheKey(url);
  if (!key) return;
  LMB_API_GET_BURST_CACHE.delete(key);
}
function invalidateSessionEconomyBurstCache(sessionCode) {
  var code = String(sessionCode || '').trim();
  if (!code) return;
  var encoded = encodeURIComponent(code);
  invalidateGetBurstCache("/api/lucky-mystery-box/".concat(encoded, "/wallet"));
  invalidateGetBurstCache("/api/lucky-mystery-box/".concat(encoded, "/transactions"));
  invalidateGetBurstCache("/api/lucky-mystery-box/".concat(encoded, "/player-inventory"));
  invalidateGetBurstCache("/api/lucky-mystery-box/session?code=".concat(encoded));
}
function getSessionCodeFromUrl() {
  var p = new URLSearchParams(window.location.search);
  return (p.get('code') || '').toUpperCase();
}
function tryAutoEnterFromUrl() {
  return _tryAutoEnterFromUrl.apply(this, arguments);
}
function _tryAutoEnterFromUrl() {
  _tryAutoEnterFromUrl = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
    var reason,
      code,
      input,
      _args27 = arguments;
    return _regenerator().w(function (_context27) {
      while (1) switch (_context27.p = _context27.n) {
        case 0:
          reason = _args27.length > 0 && _args27[0] !== undefined ? _args27[0] : 'unknown';
          code = getSessionCodeFromUrl();
          if (code) {
            _context27.n = 1;
            break;
          }
          return _context27.a(2, false);
        case 1:
          if (!(state.urlAutoEnterDone || state.urlAutoEnterRunning)) {
            _context27.n = 2;
            break;
          }
          return _context27.a(2, false);
        case 2:
          if (!(state.urlAutoEnterAttempts >= state.urlAutoEnterMaxAttempts)) {
            _context27.n = 3;
            break;
          }
          clearAutoEnterRetryTimers();
          return _context27.a(2, false);
        case 3:
          if (!(state.sessionCode && state.sessionCode === code)) {
            _context27.n = 4;
            break;
          }
          state.urlAutoEnterDone = true;
          return _context27.a(2, true);
        case 4:
          state.urlAutoEnterAttempts += 1;
          state.urlAutoEnterRunning = true;
          _context27.p = 5;
          input = getHomepageSessionInput();
          if (input) {
            input.value = code;
            syncLoginStartButtonState();
          }
          _context27.n = 6;
          return startGame(code);
        case 6:
          if (!(state.sessionCode === code)) {
            _context27.n = 7;
            break;
          }
          state.urlAutoEnterDone = true;
          clearAutoEnterRetryTimers();
          return _context27.a(2, true);
        case 7:
          return _context27.a(2, false);
        case 8:
          _context27.p = 8;
          state.urlAutoEnterRunning = false;
          return _context27.f(8);
        case 9:
          return _context27.a(2);
      }
    }, _callee27, null, [[5,, 8, 9]]);
  }));
  return _tryAutoEnterFromUrl.apply(this, arguments);
}
function clearAutoEnterRetryTimers() {
  var ids = Array.isArray(state.autoEnterRetryTimerIds) ? state.autoEnterRetryTimerIds : [];
  ids.forEach(function (id) {
    try {
      clearTimeout(id);
    } catch (_) {}
  });
  state.autoEnterRetryTimerIds = [];
}
function scheduleAutoEnterRetries() {
  var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'schedule';
  var code = getSessionCodeFromUrl();
  if (!code || state.urlAutoEnterDone || state.sessionCode === code || state.urlAutoEnterAttempts >= state.urlAutoEnterMaxAttempts) return;
  clearAutoEnterRetryTimers();
  var delays = [0, 1200];
  state.autoEnterRetryTimerIds = delays.map(function (ms, idx) {
    return setTimeout(function () {
      if (state.urlAutoEnterDone || state.sessionCode === code || state.urlAutoEnterAttempts >= state.urlAutoEnterMaxAttempts) {
        clearAutoEnterRetryTimers();
        return;
      }
      tryAutoEnterFromUrl("".concat(reason, "-").concat(idx + 1)).catch(function () {});
    }, ms);
  });
}
function withNoCache(url) {
  var sep = url.includes('?') ? '&' : '?';
  return "".concat(url).concat(sep, "_ts=").concat(Date.now());
}
function setFavicon(url) {
  if (!url) return;
  var link = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
}
function applyLogoToPlayerUI(logo) {
  var url = logo && logo.url ? String(logo.url).trim() : '';
  if (!url) return;
  document.querySelectorAll('.nav-icon-box img, .game-hero-logo img').forEach(function (img) {
    img.src = url;
  });
  setFavicon(url);
}
function getAdvancedContentTextMap(content) {
  var map = content && content.advancedTexts;
  if (!map || _typeof(map) !== 'object' || Array.isArray(map)) return {};
  return map;
}
function contentText(content, key, fallback) {
  var map = getAdvancedContentTextMap(content);
  var advancedValue = map[key];
  var directValue = content ? content[key] : undefined;
  var raw = advancedValue !== undefined ? advancedValue : directValue;
  var normalized = String(raw !== null && raw !== void 0 ? raw : '').trim();
  return normalized || fallback;
}
function contentTextGlobal(key, fallback) {
  var content = window.__lmbUiSettings && window.__lmbUiSettings.content || {};
  return contentText(content, key, fallback);
}
function setElementText(el, text) {
  if (!el || text === undefined || text === null) return;
  el.textContent = String(text);
}
function setButtonTextKeepIcon(buttonEl, text) {
  if (!buttonEl || !String(text || '').trim()) return;
  var icon = buttonEl.querySelector('svg, i, span:first-child');
  var label = buttonEl.querySelector('span:last-child');
  if (label && label !== icon) {
    label.textContent = String(text);
    return;
  }
  if (icon) {
    var textNode = Array.from(buttonEl.childNodes).find(function (n) {
      return n.nodeType === Node.TEXT_NODE && String(n.textContent || '').trim();
    });
    if (textNode) {
      textNode.textContent = " ".concat(text);
    } else {
      buttonEl.appendChild(document.createTextNode(" ".concat(text)));
    }
    return;
  }
  buttonEl.textContent = String(text);
}
function applyStaticContentTextOverrides(content) {
  var c = content || {};
  setElementText(document.getElementById('homeThemeLabel'), contentText(c, 'homeThemeLabel', 'Giao diện homepage'));
  var homeSelect = document.getElementById('homepageThemeSelect');
  if (homeSelect) homeSelect.setAttribute('aria-label', contentText(c, 'homeThemeSelectAriaLabel', 'Chọn giao diện homepage'));
  var homeFeed = document.getElementById('homeFloatingFeed');
  if (homeFeed) homeFeed.setAttribute('aria-label', contentText(c, 'homeFloatingFeedAriaLabel', 'Thông báo trúng thưởng gần đây'));
  setButtonTextKeepIcon(document.getElementById('navHomeBtn'), contentText(c, 'navHomeButton', 'Về trang chủ'));
  var gameFeed = document.getElementById('gameFloatingFeed');
  if (gameFeed) gameFeed.setAttribute('aria-label', contentText(c, 'gameFloatingFeedAriaLabel', 'Thông báo nhận thưởng gần đây'));
  setElementText(document.getElementById('walletTotalLabel'), contentText(c, 'walletTotalLabel', 'Ví điện tử Việt Nam'));
  setElementText(document.getElementById('walletWithdrawHint'), contentText(c, 'walletWithdrawHint', 'Hãy liên hệ CSKH để được giúp đỡ.'));
  setElementText(document.getElementById('walletTrustLabel'), contentText(c, 'walletTrustLabel', 'Tín nhiệm'));
  setButtonTextKeepIcon(document.getElementById('walletOpenSessionBtn'), contentText(c, 'walletOpenSessionButton', 'Mở ví phiên'));
  setButtonTextKeepIcon(document.getElementById('walletWithdrawBtn'), contentText(c, 'walletWithdrawButton', 'Rút tiền'));
  setElementText(document.getElementById('withTabHistoryText'), contentText(c, 'withTabHistory', 'Lịch sử rút tiền'));
  setElementText(document.getElementById('withTabCreateText'), contentText(c, 'withTabCreate', 'Tạo lệnh mới'));
  setElementText(document.getElementById('withAvailableBalanceLabel'), contentText(c, 'withAvailableBalanceLabel', 'Số dư khả dụng'));
  setElementText(document.getElementById('withTrustScoreLabel'), contentText(c, 'withTrustScoreLabel', 'Điểm tín nhiệm'));
  setElementText(document.getElementById('withCloseBtn'), contentText(c, 'withCloseButton', 'Đóng'));
  setElementText(document.getElementById('winCongratsBadge'), contentText(c, 'winCongratsBadge', '✨ CHÚC MỪNG!'));
  setButtonTextKeepIcon(document.getElementById('winShareBtn'), contentText(c, 'winShareButton', 'Chia sẻ nhanh'));
  setButtonTextKeepIcon(document.getElementById('winDownloadBtn'), contentText(c, 'winDownloadButton', 'Tải ảnh phần quà'));
  setButtonTextKeepIcon(document.getElementById('winCaptureBtn'), contentText(c, 'winCaptureButton', 'Chụp ảnh kết quả'));
  setElementText(document.getElementById('winThanksText'), contentText(c, 'winThanksText', 'Cảm ơn Quý khách đã tham gia trò chơi!'));
  setElementText(document.getElementById('approvalProcessingLabel'), contentText(c, 'approvalProcessingLabel', 'Đang xử lý'));
  setElementText(document.getElementById('approvalTimeLeftLabel'), contentText(c, 'approvalTimeLeftLabel', '⏱ Thời gian còn lại'));
  setElementText(document.getElementById('approvalTimeHint'), contentText(c, 'approvalTimeHint', 'Giữ trang mở để nhận thông báo'));
  setElementText(document.getElementById('approvalPrizeTag'), contentText(c, 'approvalPrizeTag', 'Phần thưởng VIP'));
  setElementText(document.getElementById('approvalProgressLabel'), contentText(c, 'approvalProgressLabel', 'Tiến trình xử lý'));
  setElementText(document.getElementById('approvalBotName'), contentText(c, 'approvalBotName', 'AI Nhắc nhở'));
  setElementText(document.getElementById('approvalReminderTag'), contentText(c, 'approvalReminderTag', 'NHẮC NHỞ'));
  setElementText(document.getElementById('approvalConnText'), contentText(c, 'approvalConnText', 'Kết nối thành công · Đang chờ phản hồi từ admin'));
  setElementText(document.getElementById('awSupportButton'), "\uD83D\uDCAC ".concat(contentText(c, 'approvalSupportButton', 'Liên hệ CSKH')));
  setElementText(document.getElementById('approvalAcceptBtn'), "\uD83D\uDCB0 ".concat(contentText(c, 'approvalAcceptButton', 'Quy đổi tiền')));
  setElementText(document.getElementById('approvalDeclineBtn'), "\u274C ".concat(contentText(c, 'approvalDeclineButton', 'Từ chối')));
  setElementText(document.getElementById('awNote'), contentText(c, 'approvalFooterNote', 'Đang chờ phản hồi từ admin... (thường < 5 phút) · Kết quả minh bạch · Không lưu thông tin cá nhân'));
  setElementText(document.getElementById('hubTitle'), contentText(c, 'hubTitleDefault', 'Quản lý phiên'));
  setElementText(document.getElementById('hubSubtitle'), contentText(c, 'hubSubtitleDefault', 'Các chức năng đầy đủ theo mã phiên'));
  setElementText(document.getElementById('hubSessionCodeLabel'), contentText(c, 'hubSessionCodeLabel', 'Mã phiên'));
  setElementText(document.getElementById('hubRefreshInventoryBtn'), contentText(c, 'hubRefreshButton', 'Làm mới'));
  setElementText(document.getElementById('hubRefreshExchangeBtn'), contentText(c, 'hubRefreshButton', 'Làm mới'));
  setElementText(document.getElementById('hubExchangeDesc'), contentText(c, 'hubExchangeDesc', 'Đổi quà/nhận quà theo từng hộp đã mở'));
  setElementText(document.getElementById('hubWalletBalanceLabel'), contentText(c, 'hubWalletBalanceLabel', 'Số dư ví'));
  setElementText(document.getElementById('hubPendingConversionLabel'), contentText(c, 'hubPendingConversionLabel', 'Đang chờ duyệt quy đổi'));
  setElementText(document.getElementById('hubTrustScoreLabel'), contentText(c, 'hubTrustScoreLabel', 'Điểm tín nhiệm'));
  setElementText(document.getElementById('hubSearchButton'), contentText(c, 'hubSearchButton', 'Tra cứu'));
  var searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = contentText(c, 'hubSearchPlaceholder', 'Nhập mã phiên cần tra cứu...');
  setElementText(document.getElementById('sessionDetailTitle'), contentText(c, 'sessionDetailTitleDefault', 'Chi tiết phiên chơi'));
  setElementText(document.getElementById('sessionDetailSub'), contentText(c, 'sessionDetailSubDefault', 'Tổng hợp đầy đủ hộp quà, ví, giao dịch và trạng thái xử lý'));
  setElementText(document.getElementById('sessionDetailLoadingText'), contentText(c, 'sessionDetailLoading', 'Đang tải dữ liệu phiên...'));
  setElementText(document.getElementById('thankYouCloseBtn'), contentText(c, 'thankYouCloseButton', 'Đóng'));
  setElementText(document.getElementById('thankYouViewTxBtn'), contentText(c, 'thankYouViewTransactionsButton', 'Xem giao dịch'));
}
function applyContentToPlayerUI(content) {
  var c = content || {};
  applyStaticContentTextOverrides(c);
  // If text map is already loaded (on settings reload), re-translate immediately
  if (window.__manualTextMap && Object.keys(window.__manualTextMap).length > 0) {
    applyManualTextMapToDOM(window.__manualTextMap);
  }
  var ensureSingleNavBrandName = function ensureSingleNavBrandName(name) {
    var navBrand = document.querySelector('.nav-brand');
    if (!navBrand) return;
    var navBrandName = navBrand.querySelector('.nav-brand-name');
    if (!navBrandName) {
      navBrandName = document.createElement('span');
      navBrandName.className = 'nav-brand-name';
      var iconBox = navBrand.querySelector('.nav-icon-box');
      if (iconBox && iconBox.nextSibling) {
        navBrand.insertBefore(navBrandName, iconBox.nextSibling);
      } else {
        navBrand.appendChild(navBrandName);
      }
    }
    navBrandName.textContent = name || '';

    // Keep only icon + one brand label to avoid duplicated text in nav-brand.
    Array.from(navBrand.children).forEach(function (el) {
      if (el.classList.contains('nav-icon-box')) return;
      if (el === navBrandName) return;
      el.remove();
    });
    Array.from(navBrand.childNodes).filter(function (n) {
      return n.nodeType === Node.TEXT_NODE && String(n.textContent || '').trim();
    }).forEach(function (n) {
      n.textContent = '';
    });
  };
  var brandName = String(c.brandName || '').trim();
  ensureSingleNavBrandName(brandName);
  var headTitle = String(c.headTitle || '').trim();
  if (headTitle) {
    document.title = headTitle;
    var ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) ogTitleMeta.setAttribute('content', headTitle);
  }
  var heroTitle = String(c.heroTitle || '').trim();
  if (heroTitle) {
    var el = document.querySelector('.game-hero-title');
    if (el) el.textContent = heroTitle;
  }
  var heroSubtitle = String(c.heroSubtitle || '').trim();
  if (heroSubtitle) {
    var _el = document.getElementById('gameHeroSubtitle');
    if (_el) {
      _el.dataset.fullText = heroSubtitle;
      _el.textContent = heroSubtitle;
    }
  }
  var heroTitleSize = parseInt(c.heroTitleSize, 10);
  var heroSubtitleSize = parseInt(c.heroSubtitleSize, 10);
  if (heroTitleSize > 0 || heroSubtitleSize > 0) {
    var heroStyle = document.getElementById('lmbHeroSizeStyle');
    if (!heroStyle) {
      heroStyle = document.createElement('style');
      heroStyle.id = 'lmbHeroSizeStyle';
      document.head.appendChild(heroStyle);
    }
    var heroRules = [];
    if (heroTitleSize > 0) heroRules.push(".game-hero-title{font-size:".concat(heroTitleSize, "px!important}"));
    if (heroSubtitleSize > 0) heroRules.push(".game-hero-subtitle{font-size:".concat(heroSubtitleSize, "px!important}"));
    heroStyle.textContent = heroRules.join('\n');
  }
}
function applyCustomizationToHomepageFrame(doc, ui) {
  if (!doc || !ui) return;
  var c = ui.content || {};
  var l = ui.logo || {};
  var logoUrl = String(l.url || '').trim();
  if (logoUrl) {
    doc.querySelectorAll('.nav-logo img, .logo img, .brand img, .hero-logo img, img[alt*="logo" i]').forEach(function (img) {
      img.src = logoUrl;
    });
  }
  var sessionInput = doc.getElementById('sessionInput') || doc.getElementById('sessionCode') || doc.querySelector('input[type="text"]');
  if (sessionInput && c.loginPlaceholder) {
    sessionInput.placeholder = c.loginPlaceholder;
  }
  var startBtn = doc.getElementById('startBtn') || Array.from(doc.querySelectorAll('button')).find(function (btn) {
    return /bắt\s*đầu|start/i.test(btn.textContent || '');
  });
  if (startBtn && c.loginButton) {
    startBtn.textContent = c.loginButton;
  }
  var titleTarget = doc.querySelector('.card-title, .nhp-card-title, .hero-title, h1');
  if (titleTarget) {
    var titleText = String(c.mainTitle || c.loginTitle || '').trim();
    if (titleText) titleTarget.textContent = titleText;
  }
  var subtitleTarget = doc.querySelector('.card-subtitle, .nhp-card-subtitle, .hero-subtitle, .sub-title, p');
  if (subtitleTarget) {
    var subText = String(c.mainDescription || '').trim();
    if (subText) subtitleTarget.textContent = subText;
  }
  var customHtml = String(c.customText || '').trim();
  var customBlock = doc.getElementById('lmbCustomTextBlock');
  if (customHtml && sessionInput) {
    if (!customBlock) {
      customBlock = doc.createElement('div');
      customBlock.id = 'lmbCustomTextBlock';
      customBlock.style.cssText = 'margin-top:10px;font-size:13px;line-height:1.5;opacity:.95;';
      var host = sessionInput.parentElement || doc.body;
      host.appendChild(customBlock);
    }
    customBlock.innerHTML = customHtml;
    customBlock.style.display = 'block';
  } else if (customBlock) {
    customBlock.style.display = 'none';
    customBlock.innerHTML = '';
  }
  // Apply active language to the frame if map is ready (called after settings reload)
  if (window.__manualTextMap && Object.keys(window.__manualTextMap).length > 0) {
    applyManualTextMapToHomepageFrame(window.__manualTextMap);
  }
}

/* ========================================================
   COMPREHENSIVE SETTINGS APPLICATION — applies ALL admin
   customization settings to the player-facing UI.
   ======================================================== */

function applySeoSettings(seo) {
  if (!seo) return;
  if (seo.pageTitle) document.title = seo.pageTitle;
  var setMeta = function setMeta(sel, attr, val) {
    if (!val) return;
    var el = document.querySelector(sel);
    if (!el) {
      var _sel$match;
      el = document.createElement('meta');
      el.setAttribute(attr === 'content' ? 'name' : 'property', ((_sel$match = sel.match(/\[(?:name|property)="([^"]+)"\]/)) === null || _sel$match === void 0 ? void 0 : _sel$match[1]) || '');
      document.head.appendChild(el);
    }
    el.setAttribute('content', val);
  };
  setMeta('meta[name="description"]', 'content', seo.metaDescription);
  setMeta('meta[name="keywords"]', 'content', seo.keywords);
  setMeta('meta[property="og:image"]', 'content', seo.ogImage);
  setMeta('meta[property="og:title"]', 'content', seo.pageTitle);
  setMeta('meta[property="og:description"]', 'content', seo.metaDescription);
  if (seo.favicon) setFavicon(seo.favicon);
}
var _PLAYER_GFONTS = {
  'Poppins': 'Poppins:wght@300;400;500;600;700;800',
  'Inter': 'Inter:wght@300;400;500;600;700',
  'DM Sans': 'DM+Sans:wght@300;400;500;600;700',
  'Outfit': 'Outfit:wght@300;400;500;600;700;800',
  'Plus Jakarta Sans': 'Plus+Jakarta+Sans:wght@300;400;500;600;700;800',
  'Figtree': 'Figtree:wght@300;400;500;600;700;800',
  'Sora': 'Sora:wght@300;400;500;600;700;800',
  'Nunito': 'Nunito:wght@300;400;500;600;700;800;900',
  'Nunito Sans': 'Nunito+Sans:wght@300;400;500;600;700;800',
  'Open Sans': 'Open+Sans:wght@300;400;500;600;700',
  'Roboto': 'Roboto:wght@300;400;500;700',
  'Lato': 'Lato:wght@300;400;700',
  'Montserrat': 'Montserrat:wght@300;400;500;600;700;800',
  'Ubuntu': 'Ubuntu:wght@300;400;500;700',
  'Quicksand': 'Quicksand:wght@300;400;500;600;700',
  'Be Vietnam Pro': 'Be+Vietnam+Pro:wght@300;400;500;600;700;800',
  'Source Sans 3': 'Source+Sans+3:wght@300;400;500;600;700',
  'Lexend': 'Lexend:wght@300;400;500;600;700;800',
  'Raleway': 'Raleway:wght@300;400;500;600;700;800',
  'Josefin Sans': 'Josefin+Sans:wght@300;400;500;600;700',
  'Exo 2': 'Exo+2:wght@300;400;500;600;700;800',
  'Orbitron': 'Orbitron:wght@400;500;600;700;800',
  'Space Grotesk': 'Space+Grotesk:wght@300;400;500;600;700',
  'Cinzel': 'Cinzel:wght@400;500;600;700',
  'Bebas Neue': 'Bebas+Neue',
  'Playfair Display': 'Playfair+Display:wght@400;500;600;700;800',
  'Merriweather': 'Merriweather:wght@300;400;700',
  'EB Garamond': 'EB+Garamond:wght@400;500;600;700',
  'Libre Baskerville': 'Libre+Baskerville:wght@400;700',
  'Dancing Script': 'Dancing+Script:wght@400;500;600;700',
  'Pacifico': 'Pacifico',
  'Caveat': 'Caveat:wght@400;500;600;700',
  'Kaushan Script': 'Kaushan+Script',
  'JetBrains Mono': 'JetBrains+Mono:wght@300;400;500;600;700',
  'Fira Code': 'Fira+Code:wght@300;400;500;600;700',
  'Source Code Pro': 'Source+Code+Pro:wght@300;400;500;600;700'
};
function loadGoogleFontForPlayer(name) {
  if (!name) return;
  var slug = _PLAYER_GFONTS[name];
  if (!slug) return;
  var id = 'pgf_' + name.replace(/[^a-z0-9]/gi, '-');
  if (document.getElementById(id)) return;
  var link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=' + slug + '&display=swap';
  document.head.appendChild(link);
}
function applyAppearanceSettings(app) {
  if (!app) return;
  var root = document.documentElement;
  var s = function s(k, v) {
    if (v !== undefined && v !== '') root.style.setProperty(k, v);
  };
  if (app.primaryColor) {
    s('--lmb-primary', app.primaryColor);
    s('--purple', app.primaryColor);
  }
  s('--lmb-nav-icon-bg', '#ffffff');
  if (app.accentColor) s('--lmb-accent', app.accentColor);
  if (app.fontFamily) s('--lmb-font', app.fontFamily);
  if (app.fontSize) s('--lmb-font-size', app.fontSize + 'px');
  if (app.borderRadius !== undefined && app.borderRadius !== '') s('--lmb-radius', app.borderRadius + 'px');
  if (app.cardBg) s('--lmb-card-bg', app.cardBg);
  if (app.cardBorderColor) s('--lmb-card-border', app.cardBorderColor);
  if (app.boxGlowColor) s('--lmb-box-glow', app.boxGlowColor);
  if (app.animationSpeed) s('--lmb-anim-speed', app.animationSpeed === 'fast' ? '0.5' : app.animationSpeed === 'slow' ? '2' : '1');

  // Background
  var aurora = document.querySelector('.aurora');
  if (app.bgType === 'solid' && app.bgColor1) {
    document.body.style.background = app.bgColor1;
    if (aurora) aurora.style.display = 'none';
  } else if (app.bgType === 'gradient' && app.bgColor1) {
    document.body.style.background = "linear-gradient(135deg, ".concat(app.bgColor1, ", ").concat(app.bgColor2 || app.bgColor1, ", ").concat(app.bgColor3 || app.bgColor1, ")");
    if (aurora) aurora.style.display = 'none';
  } else if (app.bgType === 'image' && app.bgImage) {
    document.body.style.background = "url(\"".concat(app.bgImage, "\") center/cover no-repeat fixed");
    if (aurora) aurora.style.opacity = String((app.bgOverlayOpacity || 40) / 100);
  }
  // aurora (default) — leave as-is

  // Dark mode class
  if (app.darkMode === true) document.body.classList.add('lmb-dark');else document.body.classList.remove('lmb-dark');

  // Inject dynamic CSS override stylesheet
  var styleEl = document.getElementById('lmbAppearanceStyle');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'lmbAppearanceStyle';
    document.head.appendChild(styleEl);
  }
  var rules = [];
  if (app.fontFamily) {
    loadGoogleFontForPlayer(app.fontFamily);
    rules.push("body{font-family:'".concat(app.fontFamily, "',sans-serif!important}button,input,textarea,select,label{font-family:'").concat(app.fontFamily, "',sans-serif!important}"));
  }
  if (app.fontSize) rules.push("body{font-size:".concat(app.fontSize, "px}"));
  if (app.borderRadius !== undefined && app.borderRadius !== '') {
    var r = app.borderRadius + 'px';
    rules.push(".gcard,.mbox,.hub-box,.cpanel,.wov-modal,.celebrate-card,.aws-card,.toast{border-radius:".concat(r, "!important}"));
  }
  if (app.primaryColor) {
    rules.push(".bsub,.chat-pre-btn,.wbtn.doi{background:linear-gradient(135deg,".concat(app.primaryColor, ",").concat(adjustColor(app.primaryColor, -20), ")!important}"));
    rules.push(".cfab{background:linear-gradient(135deg,".concat(adjustColor(app.primaryColor, -15), ",").concat(app.primaryColor, ")!important}"));
  }
  if (app.navStyle === 'solid') rules.push(".g-nav{background:rgba(15,10,40,.95)!important;backdrop-filter:none!important}");else if (app.navStyle === 'transparent') rules.push(".g-nav{background:transparent!important;backdrop-filter:none!important;box-shadow:none!important}");
  if (app.buttonStyle === 'flat') rules.push(".bsub,.wbtn,.chat-pre-btn{background:var(--lmb-primary,#7c3aed)!important;box-shadow:none!important}");else if (app.buttonStyle === 'outline') rules.push(".bsub,.wbtn,.chat-pre-btn{background:transparent!important;border:2px solid var(--lmb-primary,#7c3aed)!important;color:var(--lmb-primary,#7c3aed)!important}");
  if (app.popupStyle === 'solid') rules.push(".wov-modal,.celebrate-card{backdrop-filter:none!important}");
  if (app.cardBg) rules.push(".wallet-panel,.wi{background:".concat(app.cardBg, "!important}"));
  if (app.cardBorderColor) rules.push(".wallet-panel{border-color:".concat(app.cardBorderColor, "!important}"));
  styleEl.textContent = rules.join('\n');
  var customCssEl = document.getElementById('lmbAppearanceCustomCss');
  if (!customCssEl) {
    customCssEl = document.createElement('style');
    customCssEl.id = 'lmbAppearanceCustomCss';
    document.head.appendChild(customCssEl);
  }
  customCssEl.textContent = String(app.playerCustomCss || '');
  var oldCustomJs = document.getElementById('lmbAppearanceCustomJs');
  if (oldCustomJs) oldCustomJs.remove();
  var customJs = String(app.playerCustomJs || '').trim();
  if (customJs) {
    var customJsEl = document.createElement('script');
    customJsEl.id = 'lmbAppearanceCustomJs';
    customJsEl.textContent = customJs;
    document.head.appendChild(customJsEl);
  }
}
function adjustColor(hex, amount) {
  if (!hex) return '#000000';
  var c = String(hex).replace('#', '');
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  var num = parseInt(c, 16);
  var r = Math.min(255, Math.max(0, (num >> 16 & 0xff) + amount));
  var g = Math.min(255, Math.max(0, (num >> 8 & 0xff) + amount));
  var b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function applyChatSettings(chatCfg) {
  if (!chatCfg) return;
  var titleEl = document.querySelector('.ch-title');
  var onlineEl = document.querySelector('.ch-online');
  var fabEl = document.querySelector('.cfab');
  var fabBtn = document.getElementById('chatFabBtn');
  var fabAvatar = document.querySelector('.cfab-avatar');
  var fabIcon = document.getElementById('chatFabIcon');
  var headerAvatar = document.querySelector('.ch-av img');
  var inputEl = document.getElementById('cinp');
  var panel = document.getElementById('cpanel');
  if (chatCfg.headerTitle && titleEl) titleEl.textContent = chatCfg.headerTitle;
  if (chatCfg.headerSubtitle && onlineEl) onlineEl.textContent = chatCfg.headerSubtitle;
  var fallbackAvatar = fabAvatar ? String(fabAvatar.getAttribute('src') || '').trim() : '';
  var avatarSrc = String(chatCfg.adminAvatar || fallbackAvatar || '').trim();
  if (avatarSrc) {
    if (fabAvatar) fabAvatar.src = avatarSrc;
    if (headerAvatar) headerAvatar.src = avatarSrc;
  }
  var bubbleIcon = String(chatCfg.bubbleIcon || '💬').trim();
  if (fabIcon) fabIcon.textContent = bubbleIcon || '💬';
  var shouldUseAvatar = Boolean(avatarSrc);
  if (fabEl) {
    if (shouldUseAvatar) fabEl.classList.remove('use-icon');else fabEl.classList.add('use-icon');
  }
  if (fabAvatar) {
    fabAvatar.onerror = function () {
      if (fabEl) fabEl.classList.add('use-icon');
    };
  }
  if (fabBtn) {
    var fabHintText = 'Bấm vào để sẵn sàng liên hệ CSKH';
    fabBtn.setAttribute('aria-label', fabHintText);
    fabBtn.setAttribute('title', fabHintText);
  }
  if (chatCfg.placeholder && inputEl) inputEl.placeholder = chatCfg.placeholder;
  var emojiBtn = document.querySelector('.c-emoji');
  if (emojiBtn) emojiBtn.style.display = chatCfg.enableEmoji === false ? 'none' : '';
  if (Array.isArray(chatCfg.iconLibrary) && chatCfg.iconLibrary.length) {
    state.chat.iconLibrary = chatCfg.iconLibrary.map(function (x) {
      return String(x || '').trim();
    }).filter(Boolean).slice(0, 120);
  }
  initChatEmojiPicker();

  // Quick replies
  var quickContainer = document.querySelector('.cquick');
  if (quickContainer && Array.isArray(chatCfg.quickReplies) && chatCfg.quickReplies.length > 0) {
    quickContainer.innerHTML = chatCfg.quickReplies.map(function (text) {
      return "<button class=\"qbtn\" onclick=\"qChat('".concat(String(text).replace(/'/g, "\\'"), "')\">").concat(escapeHtml(text), "</button>");
    }).join('');
  }

  // Chat panel styling
  var chatStyle = document.getElementById('lmbChatStyle');
  if (!chatStyle) {
    chatStyle = document.createElement('style');
    chatStyle.id = 'lmbChatStyle';
    document.head.appendChild(chatStyle);
  }
  var rules = [];
  if (chatCfg.headerBgColor) rules.push(".ch{background:".concat(chatCfg.headerBgColor, "!important}"));
  if (chatCfg.headerTextColor) rules.push(".ch-title,.ch-online,.ch-x svg{color:".concat(chatCfg.headerTextColor, "!important;fill:").concat(chatCfg.headerTextColor, "!important}"));
  if (chatCfg.bubbleColor) rules.push(".cfab{background:linear-gradient(135deg,".concat(chatCfg.bubbleColor, ",").concat(adjustColor(chatCfg.bubbleColor, 25), ")!important;box-shadow:0 6px 24px ").concat(chatCfg.bubbleColor, "88!important}"));
  if (chatCfg.position === 'left') {
    rules.push(".cfab{right:auto!important;left:16px!important}");
    rules.push(".cpanel{right:auto!important;left:0!important;border-left:none!important;border-right:1px solid #dbe4f0!important;transform:translateX(-105%)!important}");
    rules.push(".cpanel.open{transform:translateX(0)!important}");
  }
  chatStyle.textContent = rules.join('\n');
}
function applyPopupSettings(popup) {
  if (!popup) return;
  state.gameSettings.popupShowConfetti = popup.showConfetti !== false;
  state.gameSettings.popupConfettiDuration = popup.confettiDuration || 3000;
  state.gameSettings.popupAutoClose = popup.autoClose === true;
  state.gameSettings.popupAutoCloseDelay = popup.autoCloseDelay || 10000;
  state.gameSettings.popupShowShareButton = popup.showShareButton === true;
  var popStyle = document.getElementById('lmbPopupStyle');
  if (!popStyle) {
    popStyle = document.createElement('style');
    popStyle.id = 'lmbPopupStyle';
    document.head.appendChild(popStyle);
  }
  var rules = [];
  if (popup.overlayOpacity !== undefined) rules.push(".win-ov,.celebrate-ov{background:rgba(0,0,0,".concat(Math.min(100, Math.max(0, Number(popup.overlayOpacity || 70))) / 100, ")!important}"));
  popStyle.textContent = rules.join('\n');

  // Share button visibility
  var shareBtn = document.querySelector('.wsnap-share');
  if (shareBtn) shareBtn.style.display = popup.showShareButton ? '' : 'none';
}
function applyBoxSettings(boxCfg) {
  if (!boxCfg) return;
  var total = Math.max(1, Math.min(9, Number(boxCfg.totalBoxes) || 3));
  if (total !== Object.keys(state.boxes).length) {
    var newBoxes = {};
    var newOrder = [];
    for (var i = 1; i <= total; i++) {
      newBoxes[i] = state.boxes[i] || {
        state: 'inactive',
        value: 0,
        name: ''
      };
      newOrder.push(i);
    }
    state.boxes = newBoxes;
    state.openOrder = newOrder;
  }
  state.gameSettings.boxIcon = boxCfg.boxIcon || '🎁';
  state.gameSettings.openedBoxIcon = boxCfg.openedBoxIcon || '📦';
  state.gameSettings.showBoxNumber = boxCfg.showBoxNumber === true;
  state.gameSettings.boxSize = boxCfg.boxSize || 'medium';
  state.gameSettings.boxOpenAnimation = boxCfg.boxOpenAnimation || 'shake';
  state.gameSettings.extraAnimations = Array.isArray(boxCfg.extraAnimations) && boxCfg.extraAnimations.length ? boxCfg.extraAnimations : ['shake', 'flip', 'bounce', 'explode', 'fade'];
  state.gameSettings.boxColors = Array.isArray(boxCfg.boxColors) ? boxCfg.boxColors : [];
  state.gameSettings.boxGlowColor = boxCfg.boxGlowColor || '#fbbf24';
  state.gameSettings.enableBox3d = boxCfg.enable3d === true;
  state.gameSettings.enableBoxDragDrop = boxCfg.enableDragDrop === true;
  state.gameSettings.boxTemplateHtml = String(boxCfg.templateHtml || '');
  state.gameSettings.boxTemplateCss = String(boxCfg.templateCss || '');
  state.gameSettings.boxTemplateJs = String(boxCfg.templateJs || '');
  state.gameSettings.partLayout = boxCfg.partLayout || {
    lid: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1
    },
    body: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1
    },
    ribbon: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1
    }
  };
  var boxStyle = document.getElementById('lmbBoxStyle');
  if (!boxStyle) {
    boxStyle = document.createElement('style');
    boxStyle.id = 'lmbBoxStyle';
    document.head.appendChild(boxStyle);
  }
  var rules = [];
  if (boxCfg.boxSize === 'small') rules.push(".box-wrap{max-width:140px}.gcard{min-height:200px}");else if (boxCfg.boxSize === 'large') rules.push(".box-wrap{max-width:260px}.gcard{min-height:380px}");
  if (boxCfg.boxGlowColor) rules.push(".gcard.is-active{box-shadow:0 0 24px ".concat(boxCfg.boxGlowColor, "44,0 0 60px ").concat(boxCfg.boxGlowColor, "22!important}"));
  if (Array.isArray(boxCfg.boxColors) && boxCfg.boxColors.length) {
    boxCfg.boxColors.forEach(function (color, i) {
      rules.push(".box-wrap:nth-child(".concat(i + 1, ") .box-layer{background:linear-gradient(135deg,").concat(color, ",").concat(adjustColor(color, -30), ")!important}"));
    });
  }
  if (state.gameSettings.enableBox3d) {
    rules.push('.gcard.gift-card{transform-style:preserve-3d;perspective:1200px}');
    rules.push('.gcard.gift-card .box-layer{transform:rotateX(14deg) rotateY(-12deg);transition:transform .32s ease}');
    rules.push('.gcard.gift-card:hover .box-layer{transform:rotateX(8deg) rotateY(-6deg) translateY(-6px)}');
  }
  var p = state.gameSettings.partLayout || {};
  var lid = p.lid || {};
  var body = p.body || {};
  var ribbon = p.ribbon || {};
  rules.push(".gcard.gift-card .box-lid{transform:translate(".concat(Number(lid.x || 0), "px,").concat(Number(lid.y || 0), "px) rotate(").concat(Number(lid.rotate || 0), "deg) scale(").concat(Number(lid.scale || 1), ")}"));
  rules.push(".gcard.gift-card .box-body{transform:translate(".concat(Number(body.x || 0), "px,").concat(Number(body.y || 0), "px) rotate(").concat(Number(body.rotate || 0), "deg) scale(").concat(Number(body.scale || 1), ")}"));
  rules.push(".gcard.gift-card .box-ribbon{transform-box:fill-box;transform-origin:center;transform:translate(".concat(Number(ribbon.x || 0), "px,").concat(Number(ribbon.y || 0), "px) rotate(").concat(Number(ribbon.rotate || 0), "deg) scale(").concat(Number(ribbon.scale || 1), ")}"));
  boxStyle.textContent = rules.join('\n');
  var customStyle = document.getElementById('lmbBoxCustomStyle');
  if (!customStyle) {
    customStyle = document.createElement('style');
    customStyle.id = 'lmbBoxCustomStyle';
    document.head.appendChild(customStyle);
  }
  customStyle.textContent = state.gameSettings.boxTemplateCss || '';
  applyBoxTemplateJs();
  initBoxDragDrop();
}
function applyBoxTemplateJs() {
  var source = String(state.gameSettings.boxTemplateJs || '').trim();
  var fn = null;
  if (source) {
    try {
      // Supports either a function body or full function expression.
      fn = new Function('row', 'state', source);
    } catch (_) {
      try {
        fn = new Function('row', 'state', "return (".concat(source, ")(row, state);"));
      } catch (err) {
        console.warn('boxTemplateJs parse failed:', err.message);
      }
    }
  }
  state.gameSettings.boxTemplateFn = fn;
}
function initBoxDragDrop() {
  var row = document.getElementById('boxesRow');
  if (!row) return;
  var canDrag = state.gameSettings.enableBoxDragDrop === true;
  row.dataset.dragEnabled = canDrag ? '1' : '0';
  row.querySelectorAll('.box-wrap').forEach(function (el) {
    el.draggable = canDrag;
    if (canDrag) el.classList.add('box-wrap-draggable');else el.classList.remove('box-wrap-draggable');
  });
  if (!state._boxDragBound) {
    var dragEl = null;
    row.addEventListener('dragstart', function (e) {
      if (row.dataset.dragEnabled !== '1') return;
      var wrap = e.target.closest('.box-wrap');
      if (!wrap) return;
      dragEl = wrap;
      wrap.classList.add('dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', wrap.dataset.box || '');
      }
    });
    row.addEventListener('dragend', function () {
      if (dragEl) dragEl.classList.remove('dragging');
      dragEl = null;
      row.querySelectorAll('.box-wrap.over').forEach(function (el) {
        return el.classList.remove('over');
      });
    });
    row.addEventListener('dragover', function (e) {
      if (row.dataset.dragEnabled !== '1') return;
      e.preventDefault();
      var target = e.target.closest('.box-wrap');
      if (!target || !dragEl || target === dragEl) return;
      var rect = target.getBoundingClientRect();
      var before = e.clientX - rect.left < rect.width / 2;
      row.querySelectorAll('.box-wrap.over').forEach(function (el) {
        return el.classList.remove('over');
      });
      target.classList.add('over');
      row.insertBefore(dragEl, before ? target : target.nextSibling);
    });
    row.addEventListener('drop', function (e) {
      if (row.dataset.dragEnabled !== '1') return;
      e.preventDefault();
      var ordered = Array.from(row.querySelectorAll('.box-wrap')).map(function (el) {
        return Number(el.dataset.box || 0);
      }).filter(function (n) {
        return n > 0;
      });
      if (ordered.length) state.openOrder = ordered;
      row.querySelectorAll('.box-wrap.over').forEach(function (el) {
        return el.classList.remove('over');
      });
    });
    state._boxDragBound = true;
  }
}
function applyWatermarkSettings(wm) {
  if (!wm || !wm.enabled) {
    var existing = document.getElementById('lmbWatermark');
    if (existing) existing.remove();
    return;
  }
  var el = document.getElementById('lmbWatermark');
  if (!el) {
    el = document.createElement('div');
    el.id = 'lmbWatermark';
    el.style.cssText = 'position:fixed;z-index:9990;pointer-events:none;user-select:none;';
    document.body.appendChild(el);
  }
  var pos = wm.position || 'bottom-right';
  el.style.bottom = pos.includes('bottom') ? '12px' : 'auto';
  el.style.top = pos.includes('top') ? '12px' : 'auto';
  el.style.right = pos.includes('right') ? '12px' : 'auto';
  el.style.left = pos.includes('left') ? '12px' : 'auto';
  if (wm.type === 'image' && wm.imageUrl) {
    var sz = wm.imageSize || 60;
    var op = (wm.imageOpacity || 30) / 100;
    el.innerHTML = "<img src=\"".concat(escapeHtml(wm.imageUrl), "\" style=\"width:").concat(sz, "px;height:auto;opacity:").concat(op, "\" alt=\"watermark\">");
  } else {
    var _sz = wm.fontSize || 12;
    var _op = (wm.opacity || 30) / 100;
    el.innerHTML = "<span style=\"font-size:".concat(_sz, "px;opacity:").concat(_op, ";color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.4)\">").concat(escapeHtml(wm.text || ''), "</span>");
  }
}
function applyMaintenanceMode(maint, features) {
  var isEnabled = maint && maint.enabled || features && features.enableMaintenanceMode;
  var overlay = document.getElementById('lmbMaintenanceOv');
  if (!isEnabled) {
    if (overlay) overlay.remove();
    return;
  }
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lmbMaintenanceOv';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(8,7,26,.97);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;font-family:inherit;text-align:center;padding:24px;';
    document.body.appendChild(overlay);
  }
  var msg = maint && maint.message || 'Hệ thống đang bảo trì, vui lòng quay lại sau.';
  var safeMsg = escapeHtml(msg);
  if (safeMsg.includes('manhlamstore.shop')) {
    safeMsg = safeMsg.replace('manhlamstore.shop', '<a href="https://manhlamstore.shop" style="color:#3b82f6;text-decoration:none;font-weight:700;border-bottom:2px solid #3b82f6;transition:color 0.2s,border-color 0.2s;padding-bottom:1px;" onmouseover="this.style.color=\'#60a5fa\';this.style.borderColor=\'#60a5fa\'" onmouseout="this.style.color=\'#3b82f6\';this.style.borderColor=\'#3b82f6\'">manhlamstore.shop</a>');
  }
  var est = maint && maint.estimatedTime ? "<p style=\"margin-top:12px;font-size:14px;opacity:.7\">D\u1EF1 ki\u1EBFn ho\xE0n t\u1EA5t: ".concat(escapeHtml(maint.estimatedTime), "</p>") : '';
  overlay.innerHTML = "<div style=\"max-width:420px\"><div style=\"font-size:48px;margin-bottom:16px\">\uD83D\uDD27</div><h2 style=\"font-size:22px;font-weight:800;margin:0 0 12px\">B\u1EA3o tr\xEC h\u1EC7 th\u1ED1ng</h2><p style=\"font-size:15px;opacity:.85;line-height:1.6\">".concat(safeMsg, "</p>").concat(est, "</div>");
}
function applyScriptsInjection(scripts) {
  if (!scripts) return;
  if (scripts.css && typeof scripts.css === 'string') {
    var el = document.getElementById('lmbCustomCSS');
    if (!el) {
      el = document.createElement('style');
      el.id = 'lmbCustomCSS';
      document.head.appendChild(el);
    }
    el.textContent = scripts.css;
  }
  if (scripts.js && typeof scripts.js === 'string') {
    var _el2 = document.getElementById('lmbCustomJS');
    if (_el2) _el2.remove();
    _el2 = document.createElement('script');
    _el2.id = 'lmbCustomJS';
    _el2.textContent = scripts.js;
    document.head.appendChild(_el2);
  }
}
function applySocialLinks(social) {
  if (!social || !social.showInFooter) {
    var existing = document.getElementById('lmbSocialFooter');
    if (existing) existing.remove();
    return;
  }
  var links = [];
  var safeUrl = function safeUrl(url, schemes) {
    var u = String(url || '').trim();
    try {
      var parsed = new URL(u, location.origin);
      if (schemes.includes(parsed.protocol)) return escapeHtml(u);
    } catch (_) {}
    return '';
  };
  var httpUrl = function httpUrl(u) {
    return safeUrl(u, ['http:', 'https:']);
  };
  if (social.facebook && httpUrl(social.facebook)) links.push("<a href=\"".concat(httpUrl(social.facebook), "\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#60a5fa;text-decoration:none;font-size:18px\" title=\"Facebook\">\uD83D\uDCD8 Facebook</a>"));
  if (social.zalo && httpUrl(social.zalo)) links.push("<a href=\"".concat(httpUrl(social.zalo), "\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#60a5fa;text-decoration:none;font-size:18px\" title=\"Zalo\">\uD83D\uDCAC Zalo</a>"));
  if (social.telegram && httpUrl(social.telegram)) links.push("<a href=\"".concat(httpUrl(social.telegram), "\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#60a5fa;text-decoration:none;font-size:18px\" title=\"Telegram\">\u2708\uFE0F Telegram</a>"));
  if (social.phone) links.push("<a href=\"tel:".concat(escapeHtml(social.phone), "\" style=\"color:#60a5fa;text-decoration:none;font-size:18px\" title=\"\u0110i\u1EC7n tho\u1EA1i\">\uD83D\uDCDE ").concat(escapeHtml(social.phone), "</a>"));
  if (social.email) links.push("<a href=\"mailto:".concat(escapeHtml(social.email), "\" style=\"color:#60a5fa;text-decoration:none;font-size:18px\" title=\"Email\">\uD83D\uDCE7 Email</a>"));
  if (social.website && httpUrl(social.website)) links.push("<a href=\"".concat(httpUrl(social.website), "\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#60a5fa;text-decoration:none;font-size:18px\" title=\"Website\">\uD83C\uDF10 Website</a>"));
  if (!links.length) return;
  var el = document.getElementById('lmbSocialFooter');
  if (!el) {
    el = document.createElement('div');
    el.id = 'lmbSocialFooter';
    el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99;display:flex;align-items:center;justify-content:center;gap:16px;padding:8px 16px;background:rgba(8,7,26,.88);backdrop-filter:blur(8px);border-top:1px solid rgba(255,255,255,.08);flex-wrap:wrap;';
    document.body.appendChild(el);
  }
  el.innerHTML = links.join('');
}
function applySocialLinksToChat(social) {
  if (!social || !social.showInChat) return;
  var panel = document.getElementById('cpanel');
  if (!panel) return;
  var existingFooter = panel.querySelector('.lmb-chat-social');
  if (existingFooter) existingFooter.remove();
  var safeUrl = function safeUrl(url, schemes) {
    var u = String(url || '').trim();
    try {
      var parsed = new URL(u, location.origin);
      if (schemes.includes(parsed.protocol)) return escapeHtml(u);
    } catch (_) {}
    return '';
  };
  var httpUrl = function httpUrl(u) {
    return safeUrl(u, ['http:', 'https:']);
  };
  var links = [];
  if (social.facebook && httpUrl(social.facebook)) links.push("<a href=\"".concat(httpUrl(social.facebook), "\" target=\"_blank\" rel=\"noopener noreferrer\" title=\"Facebook\" style=\"font-size:16px;text-decoration:none\">\uD83D\uDCD8</a>"));
  if (social.zalo && httpUrl(social.zalo)) links.push("<a href=\"".concat(httpUrl(social.zalo), "\" target=\"_blank\" rel=\"noopener noreferrer\" title=\"Zalo\" style=\"font-size:16px;text-decoration:none\">\uD83D\uDCAC</a>"));
  if (social.telegram && httpUrl(social.telegram)) links.push("<a href=\"".concat(httpUrl(social.telegram), "\" target=\"_blank\" rel=\"noopener noreferrer\" title=\"Telegram\" style=\"font-size:16px;text-decoration:none\">\u2708\uFE0F</a>"));
  if (social.phone) links.push("<a href=\"tel:".concat(escapeHtml(social.phone), "\" title=\"G\u1ECDi \u0111i\u1EC7n\" style=\"font-size:16px;text-decoration:none\">\uD83D\uDCDE</a>"));
  if (!links.length) return;
  var footer = document.createElement('div');
  footer.className = 'lmb-chat-social';
  footer.style.cssText = 'display:flex;gap:10px;justify-content:center;padding:6px 8px;border-top:1px solid #e2e8f0;background:#f8fafc;';
  footer.innerHTML = links.join('');
  panel.appendChild(footer);
}
function applyFeatureToggles(features) {
  if (!features) return;
  // Chat visibility
  var fab = document.querySelector('.cfab');
  var panel = document.getElementById('cpanel');
  if (features.enableChat === false) {
    if (fab) fab.style.display = 'none';
    if (panel) panel.style.display = 'none';
  }
  // Withdraw button visibility
  if (features.enableWithdraw === false) {
    document.querySelectorAll('.wbtn.rut').forEach(function (el) {
      return el.style.display = 'none';
    });
  }
  // Theme picker visibility
  var picker = document.getElementById('homepageThemePicker');
  if (picker && features.enableThemePicker === false) picker.style.display = 'none';
  // Animated boxes
  state.gameSettings.enableAnimatedBoxes = features.enableAnimatedBoxes !== false;
  // Sound effects
  state.gameSettings.enableSoundEffects = features.enableSoundEffects === true;
  // Floating notification
  if (features.enableFloatingNotification === false) {
    document.querySelectorAll('.floating-notification, #floatingNoti, .fn-container').forEach(function (el) {
      return el.style.display = 'none';
    });
  }
  // Push notification
  if (features.enablePushNotification === false) {
    document.querySelectorAll('.push-noti, #pushNoti').forEach(function (el) {
      return el.style.display = 'none';
    });
  }
  // Online status indicator
  if (features.enableOnlineStatus === false) {
    document.querySelectorAll('.online-status, .status-indicator').forEach(function (el) {
      return el.style.display = 'none';
    });
  }
  // Typing indicator
  state.gameSettings.enableTypingIndicator = features.enableTypingIndicator !== false;
  // Auto reply
  state.gameSettings.enableAutoReply = features.enableAutoReply !== false;
  // Player registration
  if (features.enablePlayerRegistration === false) {
    document.querySelectorAll('.register-btn, #registerForm').forEach(function (el) {
      return el.style.display = 'none';
    });
  }
  // Game features → store in state for runtime use
  state.gameSettings.enableBoxPreview = features.enableBoxPreview === true;
  state.gameSettings.enableHints = features.enableHints === true;
  state.gameSettings.enableStreakBonus = features.enableStreakBonus === true;
  state.gameSettings.enableReferral = features.enableReferral === true;
  state.gameSettings.enableLeaderboard = features.enableLeaderboard === true;
  state.gameSettings.enableAchievements = features.enableAchievements === true;
  state.gameSettings.enableTimerChallenge = features.enableTimerChallenge === true;
  state.gameSettings.enableDailyLimit = features.enableDailyLimit === true;
  state.gameSettings.enableMultiBoxOpen = features.enableMultiBoxOpen === true;
  // Game settings values
  if (features.maxDailyBoxes) state.gameSettings.maxDailyBoxes = parseInt(features.maxDailyBoxes, 10) || 10;
  if (features.timerDuration) state.gameSettings.timerDuration = parseInt(features.timerDuration, 10) || 30;
  if (features.streakBonusMultiplier) state.gameSettings.streakBonusMultiplier = parseFloat(features.streakBonusMultiplier) || 1.5;
  if (features.referralBonus) state.gameSettings.referralBonus = parseInt(features.referralBonus, 10) || 10000;
}

/* ===== i18n Integration ===== */
function applyI18nSettings(i18nConfig) {
  if (!i18nConfig) return;
  var langFromCookie = document.cookie.split(';').map(function (c) {
    return c.trim();
  }).find(function (c) {
    return c.startsWith('lang=');
  });
  var cookieLang = langFromCookie ? langFromCookie.split('=')[1] : null;
  var lang = cookieLang || i18nConfig.defaultLang || 'vi';
  window.__currentLang = lang;
  if (i18nConfig.enableLangSwitcher !== false) ensurePlayerLanguageDock(lang);

  // Fetch and apply translations
  fetchAndApplyTranslations(lang, i18nConfig.customTranslations || {});
}
function ensurePlayerLanguageDock(lang) {
  if (!document.getElementById('lmbLangDockStyle')) {
    var s = document.createElement('style');
    s.id = 'lmbLangDockStyle';
    s.textContent = '#lmbLangDock{display:inline-flex;align-items:center;gap:4px;padding:4px;background:linear-gradient(135deg,rgba(15,23,42,.88),rgba(30,41,59,.95));border:1px solid rgba(148,163,184,.28);border-radius:999px;box-shadow:0 4px 14px rgba(2,6,23,.3);backdrop-filter:blur(10px);}' + '#lmbLangDock .lmb-lang-label{font-size:11px;color:rgba(148,163,184,.75);padding:0 5px;}' + '#lmbLangDock .lmb-lang-btn{border:1px solid transparent;background:transparent;color:rgba(203,213,225,.85);font-size:11px;font-weight:700;border-radius:999px;padding:5px 9px;cursor:pointer;transition:color .18s,background .18s,border-color .18s;}' + '#lmbLangDock .lmb-lang-btn:hover{color:#f8fafc;border-color:rgba(59,130,246,.4);}' + '#lmbLangDock .lmb-lang-btn.active{color:#fff;border-color:rgba(59,130,246,.5);background:linear-gradient(135deg,#2563eb,#4f46e5);}' + '#lmbLangDock.lmb-lang-dock-mobile{position:fixed;left:10px;right:auto;top:auto;bottom:max(12px, env(safe-area-inset-bottom));z-index:26;}' + '@media (max-width:768px){#lmbLangDock{gap:2px;padding:3px;}#lmbLangDock .lmb-lang-label{display:none;}#lmbLangDock .lmb-lang-btn{font-size:10px;padding:4px 7px;min-width:30px;text-align:center;}}' + '@media (max-width:400px){#lmbLangDock{padding:2px;}#lmbLangDock .lmb-lang-btn{font-size:9px;padding:3px 5px;min-width:26px;}}';
    document.head.appendChild(s);
  }
  var dock = document.getElementById('lmbLangDock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'lmbLangDock';
    dock.setAttribute('role', 'toolbar');
    dock.setAttribute('aria-label', 'Language');
    dock.innerHTML = '<span class="lmb-lang-label">🌐</span>' + '<button class="lmb-lang-btn" data-lang="vi" onclick="switchLanguage(\'vi\')">VI</button>' + '<button class="lmb-lang-btn" data-lang="en" onclick="switchLanguage(\'en\')">EN</button>' + '<button class="lmb-lang-btn" data-lang="zh" onclick="switchLanguage(\'zh\')">中文</button>';
  }
  var placeDock = function placeDock() {
    var isMobile = window.matchMedia('(max-width: 768px)').matches;
    var gNav = document.querySelector('.g-nav');
    if (isMobile) {
      dock.classList.add('lmb-lang-dock-mobile');
      dock.style.top = '';
      dock.style.right = '';
      if (dock.parentNode !== document.body) document.body.appendChild(dock);
      return;
    }
    dock.classList.remove('lmb-lang-dock-mobile');
    if (gNav) {
      var rightGroup = document.getElementById('gNavRightGroup');
      if (!rightGroup) {
        rightGroup = document.createElement('div');
        rightGroup.id = 'gNavRightGroup';
        rightGroup.style.cssText = 'display:flex;align-items:center;gap:8px;flex-shrink:0;min-width:0;';
        var homeBtn = document.getElementById('navHomeBtn');
        if (homeBtn && homeBtn.parentNode === gNav) {
          gNav.insertBefore(rightGroup, homeBtn);
          rightGroup.appendChild(homeBtn);
        } else {
          gNav.appendChild(rightGroup);
        }
      }
      if (dock.parentNode !== rightGroup) rightGroup.appendChild(dock);
      return;
    }
    dock.style.cssText = 'position:fixed;top:12px;right:12px;z-index:9999;';
    if (dock.parentNode !== document.body) document.body.appendChild(dock);
  };
  placeDock();
  if (!window.__lmbLangDockBound) {
    window.addEventListener('resize', placeDock, {
      passive: true
    });
    window.addEventListener('orientationchange', placeDock, {
      passive: true
    });
    window.__lmbLangDockBound = true;
  }
  dock.querySelectorAll('.lmb-lang-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}
function switchLanguage(lang) {
  document.cookie = 'lang=' + lang + ';path=/;max-age=' + 365 * 86400 + ';SameSite=Lax';
  window.__currentLang = lang;
  var dock = document.getElementById('lmbLangDock');
  if (dock) dock.querySelectorAll('.lmb-lang-btn').forEach(function (btn) {
    return btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  var ui = window.__lmbUiSettings || {};
  var i18nCfg = ui.i18n || {};
  fetchAndApplyTranslations(lang, i18nCfg.customTranslations || {});
}
window.__manualTextMapCache = window.__manualTextMapCache || {};
window.__manualTextNodeOriginals = window.__manualTextNodeOriginals || new WeakMap();
function translateExactTextByMap(sourceText, map) {
  var src = String(sourceText || '');
  if (!src) return src;
  if (Object.prototype.hasOwnProperty.call(map, src)) return map[src];
  var trimmed = src.trim();
  if (!trimmed || trimmed === src) return src;
  if (!Object.prototype.hasOwnProperty.call(map, trimmed)) return src;
  return src.replace(trimmed, map[trimmed]);
}
// Expose to window: needed by lazy-loaded lmb-floating-feed.js when this file
// runs as type="module"
window.translateExactTextByMap = translateExactTextByMap;
function fetchManualTextMap(lang) {
  var l = ['vi', 'en', 'zh'].includes(lang) ? lang : 'vi';
  if (window.__manualTextMapCache[l]) return Promise.resolve(window.__manualTextMapCache[l]);
  return fetch('/api/i18n/text-map/' + l).then(function (r) {
    return r.json();
  }).then(function (j) {
    var map = j && j.success && j.map && _typeof(j.map) === 'object' ? j.map : {};
    window.__manualTextMapCache[l] = map;
    return map;
  }).catch(function () {
    return {};
  });
}
function applyManualTextMapToDocRoot(map, root, originals) {
  if (!root || !map || _typeof(map) !== 'object') return;
  var doc = root.ownerDocument || document;
  var walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function acceptNode(node) {
      var parent = node && node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      var tag = parent.tagName;
      if (!tag || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(tag)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[data-i18n]')) return NodeFilter.FILTER_REJECT;
      var text = String(node.textContent || '');
      return text.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  var node;
  while (node = walker.nextNode()) {
    if (!originals.has(node)) originals.set(node, String(node.textContent || ''));
    node.textContent = translateExactTextByMap(originals.get(node), map);
  }
  root.querySelectorAll('[placeholder], [title], [aria-label]').forEach(function (el) {
    ['placeholder', 'title', 'aria-label'].forEach(function (attr) {
      if (!el.hasAttribute(attr)) return;
      var dsKey = 'lmbI18nOrig' + attr.replace(/-([a-z])/g, function (_, c) {
        return c.toUpperCase();
      }).replace(/^./, function (c) {
        return c.toUpperCase();
      });
      if (!el.dataset[dsKey]) el.dataset[dsKey] = el.getAttribute(attr) || '';
      el.setAttribute(attr, translateExactTextByMap(el.dataset[dsKey] || '', map));
    });
  });
}
function applyManualTextMapToHomepageFrame(map) {
  var frame = document.getElementById('homepagePresetFrame');
  if (!frame) return;
  var frameDoc;
  try {
    frameDoc = frame.contentDocument;
  } catch (_) {
    return;
  }
  if (!frameDoc || !frameDoc.body) return;
  if (!map || _typeof(map) !== 'object') return;
  if (!window.__frameTextNodeOriginals) window.__frameTextNodeOriginals = new WeakMap();
  applyManualTextMapToDocRoot(map, frameDoc.body, window.__frameTextNodeOriginals);
}
function applyManualTextMapToDOM(map) {
  if (!map || _typeof(map) !== 'object') return;
  var gameScreen = document.getElementById('screen-game');
  var loginScreen = document.getElementById('screen-login');
  var roots = [];
  if (gameScreen) roots.push(gameScreen);
  if (loginScreen) roots.push(loginScreen);
  if (!roots.length) roots.push(document.body);
  roots.forEach(function (root) {
    return applyManualTextMapToDocRoot(map, root, window.__manualTextNodeOriginals);
  });
  applyManualTextMapToHomepageFrame(map);
}
function fetchAndApplyTranslations(lang, customOverrides) {
  Promise.all([fetch('/api/i18n/' + lang).then(function (r) {
    return r.json();
  }), fetchManualTextMap(lang)]).then(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
      j = _ref5[0],
      textMap = _ref5[1];
    if (!j || !j.success) return;
    var t = _objectSpread(_objectSpread({}, j.translations), customOverrides[lang] || {});
    window.__i18nTranslations = t;
    window.__manualTextMap = textMap || {};
    applyTranslationsToDOM(t);
    applyManualTextMapToDOM(window.__manualTextMap);
    // Update data-full-text on typing elements so they type in the current language
    var heroSub = document.getElementById('gameHeroSubtitle');
    if (heroSub && heroSub.dataset.fullText && window.__manualTextMap) {
      var translated = translateExactTextByMap(heroSub.dataset.fullText, window.__manualTextMap);
      if (translated && translated !== heroSub.dataset.fullText) {
        heroSub.dataset.fullText = translated;
        heroSub.textContent = translated;
      }
    }
    // Re-translate homepage theme current label
    var themeSelect = document.getElementById('homepageThemeSelect');
    var themeVal = (themeSelect === null || themeSelect === void 0 ? void 0 : themeSelect.value) || localStorage.getItem(HOMEPAGE_THEME_STORAGE_KEY) || '';
    if (themeVal) updateHomepageThemeCurrentLabel(themeVal);
  }).catch(function () {});
}
function applyTranslationsToDOM(t) {
  var _window$__lmbUiSettin3;
  if (!t) return;
  // Apply to elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = t[key];else el.textContent = t[key];
    }
  });
  // Apply known mappings
  var mappings = {
    '.hero-title, .game-hero-title': 'heroTitle',
    '.hero-subtitle, .game-hero-subtitle': 'heroSubtitle',
    '#loginTitle': 'loginTitle',
    '#loginBtn, .login-btn': 'loginButton',
    '#walletWithdrawBtn': 'walletWithdraw',
    '.aws-title': 'approvalTitle',
    '.aws-processing': 'approvalProcessing',
    '#thankYouTitle': 'thankYouTitle',
    '#thankYouClose, .thankyou-close-btn': 'thankYouClose'
  };
  Object.entries(mappings).forEach(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
      sel = _ref7[0],
      key = _ref7[1];
    if (!t[key]) return;
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.tagName === 'INPUT') el.placeholder = t[key];else el.textContent = t[key];
    });
  });
  var preferredBrandName = String(((_window$__lmbUiSettin3 = window.__lmbUiSettings) === null || _window$__lmbUiSettin3 === void 0 || (_window$__lmbUiSettin3 = _window$__lmbUiSettin3.content) === null || _window$__lmbUiSettin3 === void 0 ? void 0 : _window$__lmbUiSettin3.brandName) || '').trim() || String(t.brandName || '').trim();
  if (preferredBrandName) {
    var navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
      var navBrandName = navBrand.querySelector('.nav-brand-name');
      if (!navBrandName) {
        navBrandName = document.createElement('span');
        navBrandName.className = 'nav-brand-name';
        var iconBox = navBrand.querySelector('.nav-icon-box');
        if (iconBox && iconBox.nextSibling) navBrand.insertBefore(navBrandName, iconBox.nextSibling);else navBrand.appendChild(navBrandName);
      }
      navBrandName.textContent = preferredBrandName;
      Array.from(navBrand.children).forEach(function (el) {
        if (el.classList.contains('nav-icon-box')) return;
        if (el === navBrandName) return;
        el.remove();
      });
      Array.from(navBrand.childNodes).filter(function (n) {
        return n.nodeType === Node.TEXT_NODE && String(n.textContent || '').trim();
      }).forEach(function (n) {
        n.textContent = '';
      });
    }
  }
}

/* ===== Modal Editor Custom CSS/HTML Injection ===== */
function applyModalEditorOverrides(modalEditor) {
  if (!modalEditor) return;
  // Inject custom CSS for all modals
  var cssText = '';
  Object.values(modalEditor).forEach(function (cfg) {
    if (cfg.customCss) cssText += cfg.customCss + '\n';
  });
  if (cssText) {
    var _style = document.getElementById('lmbModalEditorCss');
    if (!_style) {
      _style = document.createElement('style');
      _style.id = 'lmbModalEditorCss';
      document.head.appendChild(_style);
    }
    _style.textContent = cssText;
  }
  // Win popup overrides
  if (modalEditor.winPopup) {
    var wp = modalEditor.winPopup;
    if (wp.bgGradient) {
      var winOv = document.getElementById('winOv');
      if (winOv) {
        var modal = winOv.querySelector('.wov-modal');
        if (modal) modal.style.background = wp.bgGradient;
      }
    }
    if (wp.badgeText) state.gameSettings.winBadgeText = wp.badgeText;
    if (wp.thanksText) state.gameSettings.winThanksText = wp.thanksText;
  }
  // Custom HTML overrides
  var htmlMap = {
    winPopup: '#winOv .wov-modal',
    celebrate: '#celebrate .celebrate-inner, #celebrate .celebrate-card',
    withdrawal: '#modalOv .mbox',
    approvalWait: '#approvalWaitScreen .aws-card',
    thankYou: '#thankYouOv .mbox',
    hub: '#hubOv .hub-box',
    sessionDetail: '#sessionDetailOv .session-detail-box',
    claimModal: '#claimModal .claim-inner',
    chatPreForm: '#chatPreForm .chat-form-inner',
    lightbox: '#wovLightbox .wov-lb-inner'
  };
  Object.entries(htmlMap).forEach(function (_ref8) {
    var _ref9 = _slicedToArray(_ref8, 2),
      key = _ref9[0],
      sel = _ref9[1];
    var cfg = modalEditor[key];
    if (cfg !== null && cfg !== void 0 && cfg.customHtml) {
      var target = document.querySelector(sel);
      if (target) target.innerHTML = cfg.customHtml;
    }
  });
}
function applyContentExtras(content) {
  if (!content) return;
  // Store win/lose popup titles for use by setupWinOverlay and playCelebrationOverlay
  state.gameSettings.winPopupTitle = content.winPopupTitle || '';
  state.gameSettings.losePopupTitle = content.losePopupTitle || '';
  state.gameSettings.thankyouTitle = content.thankyouTitle || '';
  state.gameSettings.thankyouMessage = content.thankyouMessage || '';

  // Banner feature removed: always keep hidden if leftover DOM exists.
  var banner = document.getElementById('lmbBanner');
  if (banner) {
    banner.style.display = 'none';
  }

  // Footer
  var footer = document.getElementById('lmbFooterText');
  if (content.footerText) {
    if (!footer) {
      footer = document.createElement('div');
      footer.id = 'lmbFooterText';
      footer.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:98;padding:6px 16px;background:rgba(8,7,26,.7);color:rgba(255,255,255,.55);text-align:center;font-size:11px;backdrop-filter:blur(4px);';
      document.body.appendChild(footer);
    }
    footer.textContent = content.footerText;
  }
}
function applyLogoHeight(logo) {
  if (!logo || !logo.height) return;
  var h = Math.max(20, Math.min(500, Number(logo.height) || 160));
  document.querySelectorAll('.game-hero-logo img').forEach(function (img) {
    img.style.maxHeight = h + 'px';
  });
}
function applyUiCustomizationEverywhere() {
  var _document$getElementB5;
  var ui = window.__lmbUiSettings || {};
  applyContentToPlayerUI(ui.content || {});
  applyLogoToPlayerUI(ui.logo || {});
  applyLogoHeight(ui.logo || {});
  applySeoSettings(ui.seo || {});
  applyAppearanceSettings(ui.appearance || {});
  applyChatSettings(ui.chat || {});
  applyPopupSettings(ui.popup || {});
  applyBoxSettings(ui.boxSettings || {});
  applyAnimationPresets(ui.animationPresets || {});
  applyWatermarkSettings(ui.watermark || {});
  applyMaintenanceMode(ui.maintenance || {}, ui.features || {});
  applyScriptsInjection(ui.scripts || {});
  applySocialLinks(ui.social || {});
  applySocialLinksToChat(ui.social || {});
  applyFeatureToggles(ui.features || {});
  applyContentExtras(ui.content || {});
  applyModalEditorOverrides(ui.modalEditor || {});
  applyI18nSettings(ui.i18n || {});
  var frameDoc = (_document$getElementB5 = document.getElementById('homepagePresetFrame')) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.contentDocument;
  if (frameDoc) applyCustomizationToHomepageFrame(frameDoc, ui);
}
function normalizeHomepageTheme(theme) {
  var raw = String(theme || '').trim();
  var found = HOMEPAGE_THEME_PRESETS.find(function (item) {
    return item.value === raw;
  });
  return found ? found.value : getDefaultHomepageTheme();
}
function getHomepageSessionInput() {
  var _document$getElementB6;
  var presetDoc = (_document$getElementB6 = document.getElementById('homepagePresetFrame')) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.contentDocument;
  if (presetDoc) {
    return presetDoc.getElementById('sessionInput') || presetDoc.getElementById('sessionCode') || presetDoc.querySelector('input[type="text"]');
  }
  return document.getElementById('sessionInput') || document.getElementById('sessionCode') || document.querySelector('#homepageThemeStage input[type="text"]') || document.querySelector('#screen-login input[type="text"]');
}
function getHomepageStartButton() {
  var _document$getElementB7;
  var presetDoc = (_document$getElementB7 = document.getElementById('homepagePresetFrame')) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.contentDocument;
  if (presetDoc) {
    return presetDoc.getElementById('startBtn') || Array.from(presetDoc.querySelectorAll('button')).find(function (btn) {
      return /bắt\s*đầu|start/i.test(btn.textContent || '');
    });
  }
  return document.getElementById('startBtn') || document.querySelector('#screen-login button[data-start-game="1"]') || document.querySelector('#homepageThemeStage button[data-start-game="1"]') || Array.from(document.querySelectorAll('#homepageThemeStage button')).find(function (btn) {
    return /bắt\s*đầu|start/i.test(btn.textContent || '');
  });
}
function bindSessionInputEnterKey() {
  var input = getHomepageSessionInput();
  if (!input || input.dataset.enterBound === '1') return;
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') startGame();
  });
  input.dataset.enterBound = '1';
}
function renderHomepageTheme(_x5) {
  return _renderHomepageTheme.apply(this, arguments);
}
function _renderHomepageTheme() {
  _renderHomepageTheme = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(themeFile) {
    var stage, selectedFile, renderId, response, htmlText, frame;
    return _regenerator().w(function (_context28) {
      while (1) switch (_context28.n) {
        case 0:
          stage = document.getElementById('homepageThemeStage');
          if (stage) {
            _context28.n = 1;
            break;
          }
          return _context28.a(2);
        case 1:
          if (!FORCE_INTERNAL_HOME_SCREEN) {
            _context28.n = 2;
            break;
          }
          stage.innerHTML = '';
          applyHomepageThemeVisual(themeFile);
          bindLoginInputState();
          bindSessionInputEnterKey();
          syncLoginStartButtonState();
          return _context28.a(2);
        case 2:
          selectedFile = normalizeHomepageTheme(themeFile);
          renderId = ++homepageRenderToken;
          stage.innerHTML = '<div class="homepage-stage-loading">Đang tải giao diện...</div>';
          _context28.n = 3;
          return fetch(withNoCache("/homepage-presets/".concat(encodeURIComponent(selectedFile))));
        case 3:
          response = _context28.v;
          if (response.ok) {
            _context28.n = 4;
            break;
          }
          throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c giao di\u1EC7n (".concat(response.status, ")"));
        case 4:
          _context28.n = 5;
          return response.text();
        case 5:
          htmlText = _context28.v;
          if (!(renderId !== homepageRenderToken)) {
            _context28.n = 6;
            break;
          }
          return _context28.a(2);
        case 6:
          stage.innerHTML = '<iframe id="homepagePresetFrame" class="homepage-preset-frame" title="Homepage preset" loading="eager"></iframe>';
          frame = document.getElementById('homepagePresetFrame');
          if (frame) {
            _context28.n = 7;
            break;
          }
          return _context28.a(2);
        case 7:
          _context28.n = 8;
          return new Promise(function (resolve) {
            frame.addEventListener('load', function () {
              if (renderId !== homepageRenderToken) {
                resolve();
                return;
              }
              var presetDoc = frame.contentDocument;
              if (presetDoc) {
                var input = presetDoc.getElementById('sessionInput') || presetDoc.getElementById('sessionCode') || presetDoc.querySelector('input[type="text"]');
                if (input) {
                  input.setAttribute('autocomplete', 'off');
                  if (!input.getAttribute('maxlength')) input.setAttribute('maxlength', '24');
                }
                var button = presetDoc.getElementById('startBtn') || Array.from(presetDoc.querySelectorAll('button')).find(function (btn) {
                  return /bắt\s*đầu|start/i.test(btn.textContent || '');
                });
                if (button) {
                  button.type = 'button';
                  button.onclick = function (event) {
                    event.preventDefault();
                    startGame();
                  };
                }
                applyCustomizationToHomepageFrame(presetDoc, window.__lmbUiSettings || {
                  content: {},
                  logo: {}
                });
                // Apply current language translations to the newly loaded iframe
                window.__frameTextNodeOriginals = new WeakMap();
                if (window.__manualTextMap && Object.keys(window.__manualTextMap).length > 0) {
                  applyManualTextMapToHomepageFrame(window.__manualTextMap);
                }
              }
              bindLoginInputState();
              bindSessionInputEnterKey();
              syncLoginStartButtonState();
              resolve();
            }, {
              once: true
            });
            frame.srcdoc = htmlText;
          });
        case 8:
          return _context28.a(2);
      }
    }, _callee28);
  }));
  return _renderHomepageTheme.apply(this, arguments);
}
function applyGameBackgroundTheme(themeFile) {
  var frame = document.getElementById('gameThemeBgFrame');
  if (!frame) return;
  if (FORCE_INTERNAL_HOME_SCREEN) {
    frame.removeAttribute('src');
    frame.srcdoc = '';
    var bg = document.getElementById('gameThemeBg');
    if (bg) bg.style.display = 'none';
    return;
  }
  if (isMobileLiteEffects()) {
    frame.removeAttribute('src');
    frame.srcdoc = '';
    var _bg = document.getElementById('gameThemeBg');
    if (_bg) _bg.style.display = 'none';
    return;
  }
  var normalized = normalizeHomepageTheme(themeFile);
  if (frame.dataset.themeFile === normalized) return;
  frame.dataset.themeFile = normalized;
  frame.addEventListener('load', function () {
    var doc = frame.contentDocument;
    if (!doc) return;
    var hideCardStyleId = 'lmbGameThemeHideCard';
    if (!doc.getElementById(hideCardStyleId)) {
      var _style2 = doc.createElement('style');
      _style2.id = hideCardStyleId;
      _style2.textContent = "\n        .card-wrapper,\n        .card-wrap,\n        .login-card,\n        .tagline-wrap,\n        .status-bar,\n        .mode-row,\n        .info-bar,\n        .floating-gifts-row,\n        [id*=\"startBtn\"],\n        .btn-start {\n          display:none !important;\n          visibility:hidden !important;\n        }\n        body, html {\n          overflow:hidden !important;\n        }\n      ";
      doc.head.appendChild(_style2);
    }
  }, {
    once: true
  });
  frame.src = withNoCache("/homepage-presets/".concat(encodeURIComponent(normalized)));
}
function applyHomepageTheme(_x6) {
  return _applyHomepageTheme.apply(this, arguments);
}
function _applyHomepageTheme() {
  _applyHomepageTheme = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(theme) {
    var _getHomepageSessionIn;
    var persist,
      normalized,
      previousCode,
      input,
      _args29 = arguments;
    return _regenerator().w(function (_context29) {
      while (1) switch (_context29.n) {
        case 0:
          persist = _args29.length > 1 && _args29[1] !== undefined ? _args29[1] : true;
          normalized = normalizeHomepageTheme(theme);
          previousCode = (((_getHomepageSessionIn = getHomepageSessionInput()) === null || _getHomepageSessionIn === void 0 ? void 0 : _getHomepageSessionIn.value) || '').trim();
          updateHomepageThemeCurrentLabel(normalized);
          applyHomepageThemeVisual(normalized);
          if (persist) {
            localStorage.setItem(HOMEPAGE_THEME_STORAGE_KEY, normalized);
          }
          _context29.n = 1;
          return renderHomepageTheme(normalized);
        case 1:
          applyGameBackgroundTheme(normalized);
          input = getHomepageSessionInput();
          if (input && previousCode) {
            input.value = previousCode;
            syncLoginStartButtonState();
          }
        case 2:
          return _context29.a(2);
      }
    }, _callee29);
  }));
  return _applyHomepageTheme.apply(this, arguments);
}
function initHomepageThemePicker() {
  return _initHomepageThemePicker.apply(this, arguments);
}
function _initHomepageThemePicker() {
  _initHomepageThemePicker = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30() {
    var picker, select, stage, defaultTheme;
    return _regenerator().w(function (_context30) {
      while (1) switch (_context30.n) {
        case 0:
          picker = document.getElementById('homepageThemePicker');
          select = document.getElementById('homepageThemeSelect');
          if (picker) picker.style.display = 'none';
          if (select) select.style.display = 'none';
          if (FORCE_INTERNAL_HOME_SCREEN) {
            stage = document.getElementById('homepageThemeStage');
            if (stage) stage.innerHTML = '';
            applyGameBackgroundTheme('');
          }
          defaultTheme = getDefaultHomepageTheme();
          _context30.n = 1;
          return applyHomepageTheme(defaultTheme, false);
        case 1:
          return _context30.a(2);
      }
    }, _callee30);
  }));
  return _initHomepageThemePicker.apply(this, arguments);
}
function inferBoxState(item) {
  var unlucky = item && (item.level === 'UNLUCKY' || item.status === 'UNLUCKY');
  return unlucky ? 'opened-bad' : 'opened-win';
}
function isCashPrizeLike(data) {
  var _ref0, _data$value, _data$isCash;
  if (!data) return false;
  var numericValue = Number((_ref0 = (_data$value = data.value) !== null && _data$value !== void 0 ? _data$value : data.prize_value) !== null && _ref0 !== void 0 ? _ref0 : 0);
  var rawCash = (_data$isCash = data.isCash) !== null && _data$isCash !== void 0 ? _data$isCash : data.is_cash;
  var cashFlag = rawCash === true || rawCash === 1 || String(rawCash || '').toLowerCase() === 'true';
  return cashFlag && numericValue > 0;
}
function normalizePrizeImageUrl(value) {
  var raw = String(value !== null && value !== void 0 ? value : '').trim();
  if (!raw || raw === 'null' || raw === 'undefined') return '';
  if (/^data:image\//i.test(raw) || /^blob:/i.test(raw)) return raw;

  // Normalize Windows/backslash and legacy relative paths from DB/admin forms.
  var normalized = raw.replace(/\\/g, '/').replace(/^\.\//, '').trim();
  if (/^https?:\/\//i.test(normalized)) return normalized;
  if (normalized.startsWith('/public/')) {
    return normalized.replace('/public/', '/');
  }
  if (normalized.startsWith('/public/uploads/')) {
    return normalized.replace('/public/uploads/', '/uploads/');
  }
  if (normalized.startsWith('/uploads/uploads/')) {
    return normalized.replace('/uploads/uploads/', '/uploads/');
  }

  // Keep absolute public paths (e.g. /images/banner.png) unchanged.
  if (normalized.startsWith('/') && !normalized.startsWith('/uploads/')) {
    return normalized;
  }
  if (normalized.startsWith('/uploads/')) return normalized;
  if (normalized.startsWith('uploads/')) {
    return "/".concat(normalized);
  }

  // Preserve known static folders when path is missing leading slash.
  if (/^(images|img|css|js|homepage-presets|new_homepage|favicon\.ico)(\/|$)/i.test(normalized)) {
    return "/".concat(normalized);
  }
  return "/uploads/".concat(normalized.replace(/^\/+/, ''));
}
function resolvePrizeMedia(item, sessionData, boxNumber) {
  var n = Number(boxNumber || (item === null || item === void 0 ? void 0 : item.box_number) || (item === null || item === void 0 ? void 0 : item.boxNumber) || 0);
  var sessionImage = n >= 1 && n <= 3 ? sessionData === null || sessionData === void 0 ? void 0 : sessionData["prize_".concat(n, "_image_url")] : '';
  var sessionIcon = n >= 1 && n <= 3 ? sessionData === null || sessionData === void 0 ? void 0 : sessionData["prize_".concat(n, "_icon")] : '';
  var image = normalizePrizeImageUrl((item === null || item === void 0 ? void 0 : item.prize_image) || (item === null || item === void 0 ? void 0 : item.image_url) || (item === null || item === void 0 ? void 0 : item.imageUrl) || (item === null || item === void 0 ? void 0 : item.image) || sessionImage);
  var rawIcon = String((item === null || item === void 0 ? void 0 : item.prize_icon) || (item === null || item === void 0 ? void 0 : item.prizeIcon) || (item === null || item === void 0 ? void 0 : item.icon) || sessionIcon || '🎁').trim();
  return {
    image: image,
    icon: rawIcon || '🎁'
  };
}
function refreshWallet() {
  return _refreshWallet.apply(this, arguments);
}
function _refreshWallet() {
  _refreshWallet = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31() {
    var prevRemaining, prevPendingConv, prevGameLocked, prevGameLockReason, result, wallet, cur, trustEl, wTrustVal, wTrustFill, ts, row, walletBalanceEl, pendingEl, currentRemaining, currentPendingConv, approvedDelta;
    return _regenerator().w(function (_context31) {
      while (1) switch (_context31.n) {
        case 0:
          if (state.sessionCode) {
            _context31.n = 1;
            break;
          }
          return _context31.a(2);
        case 1:
          prevRemaining = Math.max(0, Number(state.wallet.remaining || 0));
          prevPendingConv = Math.max(0, Number(state.wallet.pendingConversion || 0));
          prevGameLocked = !!state.gameLocked;
          prevGameLockReason = String(state.gameLockReason || '');
          _context31.n = 2;
          return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/wallet"));
        case 2:
          result = _context31.v;
          wallet = result.data || {};
          state.wallet.balance = Number(wallet.balance || 0) || 0;
          state.wallet.remaining = Number(wallet.remaining || 0) || 0;
          state.wallet.withdrawn = Number(wallet.withdrawn || 0) || 0;
          state.wallet.pending = Number(wallet.pending || 0) || 0;
          state.wallet.pendingConversion = Number(wallet.pending_conversion || 0) || 0;
          state.wallet.trustScore = Number(wallet.trust_score || 100) || 100;
          state.wallet.minTrustScoreForWithdrawal = Number(wallet.min_trust_score_for_withdrawal || 100) || 100;
          state.wallet.canWithdrawByTrust = wallet.can_withdraw_by_trust !== false;
          state.wallet.trustBlockedMessage = String(wallet.trust_block_message || '').trim();
          state.wallet.transactions = Array.isArray(wallet.transactions) ? wallet.transactions : [];
          state.balance = state.wallet.remaining;
          cur = state.sessionCurrency || 'VND';
          trustEl = document.getElementById('hubTrustScore');
          if (trustEl) trustEl.textContent = String(state.wallet.trustScore);

          // Update inline wallet trust score badge
          wTrustVal = document.getElementById('walletTrustVal');
          wTrustFill = document.getElementById('walletTrustFill');
          if (wTrustVal || wTrustFill) {
            ts = Math.max(0, Math.min(100, state.wallet.trustScore));
            if (wTrustVal) wTrustVal.textContent = String(ts);
            if (wTrustFill) {
              wTrustFill.style.width = ts + '%';
              wTrustFill.style.background = ts >= 80 ? 'linear-gradient(90deg,#22c55e,#4ade80)' : ts >= 50 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)';
            }
            row = document.getElementById('walletTrustRow');
            if (row) row.dataset.tier = ts >= 80 ? 'high' : ts >= 50 ? 'mid' : 'low';
          }
          walletBalanceEl = document.getElementById('hubWalletBalance');
          if (walletBalanceEl) walletBalanceEl.textContent = formatCurrency(state.wallet.remaining, cur);
          pendingEl = document.getElementById('hubPendingConversion');
          if (pendingEl) pendingEl.textContent = formatCurrency(state.wallet.pendingConversion, cur);
          renderCurrencyWalletCards();
          currentRemaining = Math.max(0, Number(state.wallet.remaining || 0));
          currentPendingConv = Math.max(0, Number(state.wallet.pendingConversion || 0));
          approvedDelta = currentRemaining - prevRemaining;
          if (approvedDelta > 0 && prevPendingConv > currentPendingConv) {
            pushGameSystemNotice('Quy đổi đã duyệt', "\u0110\xE3 c\u1ED9ng ".concat(formatCurrencyBySymbol(approvedDelta, 'VND'), " v\xE0o v\xED VND."));
          }
          updateGameLockByApprovedPendingCash();
          if (prevGameLocked !== state.gameLocked || prevGameLockReason !== String(state.gameLockReason || '')) {
            renderBoxes();
          }
          renderTransactions();
        case 3:
          return _context31.a(2);
      }
    }, _callee31);
  }));
  return _refreshWallet.apply(this, arguments);
}
function refreshBoxesFromServer() {
  return _refreshBoxesFromServer.apply(this, arguments);
}
function _refreshBoxesFromServer() {
  _refreshBoxesFromServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32() {
    var _state$boxes1, _state$boxes10, _state$boxes11, _inventoryRs$data;
    var prevBoxSnapshots, _yield$Promise$all, _yield$Promise$all2, sessionRs, inventoryRs, sessionData, boxPos, rwRaw, parseSpecialFlag, items, nextBox, winOv, winOverlayOpen;
    return _regenerator().w(function (_context32) {
      while (1) switch (_context32.n) {
        case 0:
          if (state.sessionCode) {
            _context32.n = 1;
            break;
          }
          return _context32.a(2);
        case 1:
          prevBoxSnapshots = {
            1: _objectSpread({}, ((_state$boxes1 = state.boxes) === null || _state$boxes1 === void 0 ? void 0 : _state$boxes1[1]) || {}),
            2: _objectSpread({}, ((_state$boxes10 = state.boxes) === null || _state$boxes10 === void 0 ? void 0 : _state$boxes10[2]) || {}),
            3: _objectSpread({}, ((_state$boxes11 = state.boxes) === null || _state$boxes11 === void 0 ? void 0 : _state$boxes11[3]) || {})
          };
          _context32.n = 2;
          return Promise.all([apiJson("/api/lucky-mystery-box/session?code=".concat(encodeURIComponent(state.sessionCode))), apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/player-inventory"))]);
        case 2:
          _yield$Promise$all = _context32.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          sessionRs = _yield$Promise$all2[0];
          inventoryRs = _yield$Promise$all2[1];
          sessionData = (sessionRs === null || sessionRs === void 0 ? void 0 : sessionRs.data) || {};
          boxPos = sessionData.box_positions; // box_positions may arrive as a JSON string from SQLite — always parse & validate
          if (typeof boxPos === 'string') {
            try {
              boxPos = JSON.parse(boxPos);
            } catch (_) {
              boxPos = null;
            }
          }
          if (Array.isArray(boxPos) && boxPos.length === 3) {
            boxPos = boxPos.map(function (v) {
              return parseInt(v, 10);
            }).filter(function (v) {
              return [1, 2, 3].includes(v);
            });
            if (new Set(boxPos).size !== 3) boxPos = [1, 2, 3];
          } else {
            boxPos = [1, 2, 3];
          }
          state.openOrder = boxPos;
          state.boxes = {
            1: {
              state: 'inactive',
              value: 0,
              name: ''
            },
            2: {
              state: 'inactive',
              value: 0,
              name: ''
            },
            3: {
              state: 'inactive',
              value: 0,
              name: ''
            }
          };

          // Store session currency
          state.sessionCurrency = sessionData.currency || 'VND';

          // Store withdrawal requirement flag (default true if not set)
          rwRaw = sessionData.require_withdrawal;
          state.requireWithdrawal = rwRaw === null || rwRaw === undefined ? true : rwRaw === false || Number(rwRaw) === 0 ? false : true;
          parseSpecialFlag = function parseSpecialFlag(value) {
            if (value === true || value === 1) return true;
            var v = String(value !== null && value !== void 0 ? value : '').toLowerCase();
            return v === 'true' || v === '1';
          };
          state.sessionSpecialByBox = {
            1: parseSpecialFlag(sessionData.prize_1_is_special),
            2: parseSpecialFlag(sessionData.prize_2_is_special),
            3: parseSpecialFlag(sessionData.prize_3_is_special)
          };
          state.sessionImageByBox = {
            1: normalizePrizeImageUrl(sessionData.prize_1_image_url),
            2: normalizePrizeImageUrl(sessionData.prize_2_image_url),
            3: normalizePrizeImageUrl(sessionData.prize_3_image_url)
          };
          items = (inventoryRs === null || inventoryRs === void 0 || (_inventoryRs$data = inventoryRs.data) === null || _inventoryRs$data === void 0 ? void 0 : _inventoryRs$data.items) || []; // Always allow sequential opening of all boxes.
          state.gameLocked = false;
          items.forEach(function (item) {
            var boxNum = Number(item.box_number || item.boxNumber);
            if (boxNum >= 1 && boxNum <= 3) {
              var _state$boxes$boxNum;
              var media = resolvePrizeMedia(item, sessionData, boxNum);
              var existingDecision = ((_state$boxes$boxNum = state.boxes[boxNum]) === null || _state$boxes$boxNum === void 0 ? void 0 : _state$boxes$boxNum.decision) || null;
              var statusLower = String(item.status || '').toLowerCase();
              var decisionLower = String(item.decision || '').toLowerCase();
              var specialApproved = !!(item.is_special && (['confirmed', 'converted', 'declined'].includes(statusLower) || ['confirmed', 'converted', 'declined'].includes(decisionLower)));
              var mappedDecision = item.decision || (item.status === 'converted' ? 'converted' : null) || (item.status === 'declined' ? 'declined' : null) || (item.status === 'exchanged' ? 'exchanged' : null) || (item.status === 'confirmed' ? 'confirmed' : null) || (item.status === 'rejected' ? 'declined' : null) || existingDecision;
              state.boxes[boxNum] = {
                state: inferBoxState(item),
                value: Number(item.prize_value || 0),
                name: item.prize_name || 'Phần thưởng',
                icon: media.icon,
                image: media.image,
                isCash: isCashPrizeLike(item),
                isSpecial: !!item.is_special,
                specialApproved: specialApproved,
                level: item.level || 'NORMAL',
                currency: item.currency || 'VND',
                category: item.prize_description || item.category || '',
                status: statusLower || 'obtained',
                decision: mappedDecision,
                processingStatus: item.processingStatus || item.status || 'obtained'
              };
            }
          });

          // Do not unlock next box when there is an approved cash prize waiting for conversion.
          updateGameLockByApprovedPendingCash();
          if (!state.gameLocked) {
            nextBox = state.openOrder.find(function (boxNum) {
              return state.boxes[boxNum].state === 'inactive';
            });
            if (nextBox) state.boxes[nextBox].state = 'active';
          }
          renderBoxes();
          winOv = document.getElementById('winOv');
          winOverlayOpen = !!(winOv && winOv.classList.contains('open'));
          [1, 2, 3].forEach(function (boxNum) {
            var _state$boxes12;
            var prev = prevBoxSnapshots[boxNum] || {};
            var curr = ((_state$boxes12 = state.boxes) === null || _state$boxes12 === void 0 ? void 0 : _state$boxes12[boxNum]) || {};
            var becameApprovedPending = !isPendingApprovedCashBox(prev) && isPendingApprovedCashBox(curr);
            if (becameApprovedPending && !winOverlayOpen) {
              showApprovedConversionReminderModal(boxNum, {
                force: true
              });
            }
            if (isPendingApprovedCashBox(curr)) {
              scheduleApprovedConversionReminder(boxNum);
            } else {
              stopApprovedConversionReminder(boxNum);
            }
          });
        case 3:
          return _context32.a(2);
      }
    }, _callee32);
  }));
  return _refreshBoxesFromServer.apply(this, arguments);
}
function loadPlayerInventory() {
  return _loadPlayerInventory.apply(this, arguments);
}
function _loadPlayerInventory() {
  _loadPlayerInventory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33() {
    var _result$data;
    var result;
    return _regenerator().w(function (_context33) {
      while (1) switch (_context33.n) {
        case 0:
          if (state.sessionCode) {
            _context33.n = 1;
            break;
          }
          return _context33.a(2, []);
        case 1:
          _context33.n = 2;
          return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/player-inventory"));
        case 2:
          result = _context33.v;
          state.inventoryItems = (result === null || result === void 0 || (_result$data = result.data) === null || _result$data === void 0 ? void 0 : _result$data.items) || [];
          renderCurrencyWalletCards();
          renderInventory();
          renderExchange();
          renderWalletUnifiedHistory();
          return _context33.a(2, state.inventoryItems);
      }
    }, _callee33);
  }));
  return _loadPlayerInventory.apply(this, arguments);
}
function getStatusText(item) {
  var level = item.level || 'NORMAL';
  if (level === 'UNLUCKY') return 'Xui lỗi';
  if (item.decision === 'declined') return 'Đã từ chối quy đổi';
  if (item.status === 'obtained') return 'Đã nhận trong kho';
  if (item.status === 'claimed') return 'Đã gửi yêu cầu nhận quà';
  if (item.status === 'exchanged') return 'Đang chờ CSKH xử lý';
  if (item.status === 'converted') return 'Đã quy đổi thành công';
  return item.status || 'Không xác định';
}
function buildItemCard(item, withActions) {
  var level = item.level || 'NORMAL';
  var currency = item.currency || 'VND';
  var canAct = withActions && item.status === 'obtained' && level !== 'UNLUCKY';
  var isPendingCskh = item.status === 'exchanged';
  var prizeVal = Number(item.prize_value || 0);
  var amountLabel = 'Quà hiện vật';
  if (prizeVal > 0) {
    if (currency === 'USD') amountLabel = "$".concat(prizeVal.toLocaleString('vi-VN'), " USD");else if (currency === 'NDT') amountLabel = "\xA5".concat(prizeVal.toLocaleString('vi-VN'), " NDT");else amountLabel = formatVND(prizeVal);
  }
  var itemName = item.prize_name || 'Phần thưởng';
  var boxNumber = Number(item.box_number || 0);
  return "\n    <div class=\"hub-card\">\n      <div class=\"hub-card-title\">H\u1ED9p #".concat(boxNumber, ": ").concat(itemName, "</div>\n      <div class=\"hub-card-meta\">Gi\xE1 tr\u1ECB: ").concat(amountLabel).concat(currency !== 'VND' && prizeVal > 0 ? " <small>(\u2248 ".concat((prizeVal * (currency === 'USD' ? 26000 : 3800)).toLocaleString('vi-VN'), " VND)</small>") : '', "</div>\n      <div class=\"hub-card-meta\">Tr\u1EA1ng th\xE1i: ").concat(getStatusText(item)).concat(isPendingCskh ? ' <small style="color:#e67e22">⏳ Chờ CSKH duyệt</small>' : '', "</div>\n      <div class=\"hub-card-meta\">M\u1EE9c \u0111\u1ED9: ").concat(level, "</div>\n      <div class=\"hub-card-meta\">Th\u1EDDi gian: ").concat(formatDateTime(item.createdAt), "</div>\n      ").concat(canAct ? "\n        <div class=\"hub-card-actions\">\n          <button class=\"hub-inline-btn claim\" type=\"button\" onclick=\"openClaimModal(".concat(boxNumber, ")\">Nh\u1EADn qu\xE0</button>\n          <button class=\"hub-inline-btn convert\" type=\"button\" onclick=\"convertPrize(").concat(boxNumber, ")\">\u0110\u1ED5i sang ti\u1EC1n</button>\n        </div>\n      ") : '<div class="hub-card-actions"><button class="hub-inline-btn disabled" type="button">Không khả dụng</button></div>', "\n    </div>\n  ");
}
function renderInventory() {
  var list = document.getElementById('inventoryList');
  if (!list) return;
  var sessionCodeEl = document.getElementById('hubSessionCode');
  if (sessionCodeEl) sessionCodeEl.textContent = state.sessionCode || '-';
  if (!state.inventoryItems.length) {
    list.innerHTML = '<div class="hub-card"><div class="hub-card-title">Kho trống</div><div class="hub-card-meta">Bạn chưa mở hộp nào trong phiên này.</div></div>';
    if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
    return;
  }
  list.innerHTML = state.inventoryItems.map(function (item) {
    return buildItemCard(item, false);
  }).join('');
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}
function renderExchange() {
  var list = document.getElementById('exchangeList');
  if (!list) return;
  if (!state.inventoryItems.length) {
    list.innerHTML = '<div class="hub-card"><div class="hub-card-title">Chưa có quà để xử lý</div><div class="hub-card-meta">Mở hộp trước khi nhận hoặc quy đổi quà.</div></div>';
    if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
    return;
  }
  list.innerHTML = state.inventoryItems.map(function (item) {
    return buildItemCard(item, true);
  }).join('');
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}
function refreshTransactions() {
  return _refreshTransactions.apply(this, arguments);
}
function _refreshTransactions() {
  _refreshTransactions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34() {
    var result;
    return _regenerator().w(function (_context34) {
      while (1) switch (_context34.n) {
        case 0:
          if (state.sessionCode) {
            _context34.n = 1;
            break;
          }
          return _context34.a(2);
        case 1:
          _context34.n = 2;
          return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/transactions"));
        case 2:
          result = _context34.v;
          state.wallet.transactions = Array.isArray(result.data) ? result.data : [];
          renderTransactions();
          renderWalletUnifiedHistory();
        case 3:
          return _context34.a(2);
      }
    }, _callee34);
  }));
  return _refreshTransactions.apply(this, arguments);
}
function scheduleEconomyRealtimeRefresh() {
  var delayMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 160;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!state.sessionCode || document.hidden) return;
  var needsBoxRefresh = !!options.refreshBoxes;
  if (needsBoxRefresh) {
    state.economyRefreshNeedBoxes = true;
  }
  if (state.economyRefreshInFlight) {
    state.economyRefreshQueued = true;
    return;
  }
  if (state.economyRefreshTimer) return;
  var now = Date.now();
  var minIntervalMs = Math.max(250, Number(state.economyRefreshMinIntervalMs || 900));
  var earliest = Number(state.economyRefreshLastAt || 0) + minIntervalMs;
  var waitMs = Math.max(Number(delayMs) || 0, Math.max(0, earliest - now));
  state.economyRefreshTimer = setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var refreshTasks, _t3;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          state.economyRefreshTimer = null;
          if (!(!state.sessionCode || document.hidden)) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2);
        case 1:
          if (!state.economyRefreshInFlight) {
            _context2.n = 2;
            break;
          }
          state.economyRefreshQueued = true;
          return _context2.a(2);
        case 2:
          state.economyRefreshInFlight = true;
          _context2.p = 3;
          refreshTasks = [refreshWallet(), refreshTransactions()];
          if (state.economyRefreshNeedBoxes) {
            refreshTasks.push(refreshBoxesFromServer());
          }
          _context2.n = 4;
          return Promise.all(refreshTasks);
        case 4:
          state.economyRefreshLastAt = Date.now();
          _context2.n = 6;
          break;
        case 5:
          _context2.p = 5;
          _t3 = _context2.v;
        case 6:
          _context2.p = 6;
          state.economyRefreshInFlight = false;
          state.economyRefreshNeedBoxes = false;
          if (state.economyRefreshQueued) {
            state.economyRefreshQueued = false;
            scheduleEconomyRealtimeRefresh(160);
          }
          return _context2.f(6);
        case 7:
          return _context2.a(2);
      }
    }, _callee2, null, [[3, 5, 6, 7]]);
  })), waitMs);
}
function shouldSyncNow() {
  if (!state.sessionCode || document.hidden) return false;
  var gameScreen = document.getElementById('screen-game');
  var gameVisible = !!gameScreen && gameScreen.style.display !== 'none';
  var hubOpen = !!document.querySelector('#hubOv.open');
  return gameVisible || hubOpen || state.wallet.pendingConversion > 0;
}
function backgroundSync() {
  return _backgroundSync.apply(this, arguments);
}
function _backgroundSync() {
  _backgroundSync = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35() {
    var _t20;
    return _regenerator().w(function (_context35) {
      while (1) switch (_context35.p = _context35.n) {
        case 0:
          if (!(state.syncBusy || !shouldSyncNow() || document.hidden)) {
            _context35.n = 1;
            break;
          }
          return _context35.a(2);
        case 1:
          state.syncBusy = true;
          _context35.p = 2;
          _context35.n = 3;
          return Promise.all([refreshWallet(), refreshTransactions(), loadPlayerInventory()]);
        case 3:
          _context35.n = 5;
          break;
        case 4:
          _context35.p = 4;
          _t20 = _context35.v;
        case 5:
          _context35.p = 5;
          state.syncBusy = false;
          return _context35.f(5);
        case 6:
          return _context35.a(2);
      }
    }, _callee35, null, [[2, 4, 5, 6]]);
  }));
  return _backgroundSync.apply(this, arguments);
}
function startRealtimeSync() {
  // Polling removed. Keep a single on-demand sync for legacy call sites.
  backgroundSync();
}
function stopRealtimeSync() {
  // Legacy no-op after polling removal.
  if (state.syncTimer) {
    clearInterval(state.syncTimer);
    state.syncTimer = null;
  }
}
function matchTxFilter(tx, filter) {
  if (filter === 'all') return true;
  if (filter === 'pending') return tx.status === 'pending';
  if (filter === 'approved') return tx.status === 'approved';
  if (filter === 'rejected') return tx.status === 'rejected';
  return true;
}
function txTitle(tx) {
  var _m = window.__manualTextMap || null;
  var _tx = function _tx(s) {
    return _m ? translateExactTextByMap(s, _m) || s : s;
  };
  if (tx.type === 'withdraw') return _tx('Rút tiền');
  if (String(tx.type || '').startsWith('conversion')) return "".concat(_tx('Quy đổi hộp'), " #").concat(tx.boxNumber || '--');
  return _tx('Giao dịch');
}
function txStatus(tx) {
  var _m = window.__manualTextMap || null;
  var _tx = function _tx(s) {
    return _m ? translateExactTextByMap(s, _m) || s : s;
  };
  if (tx.status === 'approved') return _tx('Đã duyệt');
  if (tx.status === 'rejected') return _tx('Từ chối');
  return _tx('Chờ duyệt');
}
function txReasonLine(tx) {
  var _m = window.__manualTextMap || null;
  var _tx = function _tx(s) {
    return _m ? translateExactTextByMap(s, _m) || s : s;
  };
  var reason = String((tx === null || tx === void 0 ? void 0 : tx.rejectionReason) || (tx === null || tx === void 0 ? void 0 : tx.rejection_reason) || (tx === null || tx === void 0 ? void 0 : tx.reason) || '').trim();
  if (String((tx === null || tx === void 0 ? void 0 : tx.status) || '').toLowerCase() !== 'rejected' || !reason) return '';
  return "<div class=\"hub-card-meta\" style=\"color:#ef4444;margin-top:4px\">".concat(_tx('Lý do từ chối'), ": ").concat(esc(reason), "</div>");
}
function renderTransactions() {
  var list = document.getElementById('txList');
  var pagination = document.getElementById('txPagination');
  if (!list) return;
  var _m = window.__manualTextMap || null;
  var _tx = function _tx(s) {
    return _m ? translateExactTextByMap(s, _m) || s : s;
  };
  var rows = (state.wallet.transactions || []).filter(function (tx) {
    return matchTxFilter(tx, state.txFilter);
  });
  if (!rows.length) {
    list.innerHTML = "<div class=\"hub-card\"><div class=\"hub-card-title\">".concat(_tx('Chưa có giao dịch'), "</div><div class=\"hub-card-meta\">").concat(_tx('Lịch sử giao dịch theo phiên sẽ hiển thị tại đây.'), "</div></div>");
    if (pagination) pagination.innerHTML = '';
    if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
    return;
  }
  var totalPages = Math.max(1, Math.ceil(rows.length / state.txPageSize));
  if (state.txPage > totalPages) state.txPage = totalPages;
  if (state.txPage < 1) state.txPage = 1;
  var start = (state.txPage - 1) * state.txPageSize;
  var pageRows = rows.slice(start, start + state.txPageSize);
  list.innerHTML = pageRows.map(function (tx) {
    return "\n    <div class=\"tx-row\">\n      <div class=\"tx-left\">\n        <div class=\"tx-title\">".concat(txTitle(tx), "</div>\n        <div class=\"tx-time\">").concat(formatDateTime(tx.requestedAt), "</div>\n        ").concat(txReasonLine(tx), "\n      </div>\n      <div class=\"tx-left\" style=\"align-items:flex-end;\">\n        <div class=\"tx-amount\">").concat(formatVND(tx.amount), "</div>\n        <div class=\"tx-status\">").concat(txStatus(tx), "</div>\n      </div>\n    </div>\n  ");
  }).join('');
  if (!pagination) return;
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  var html = "<button class=\"tx-page-btn\" type=\"button\" onclick=\"setTxPage(".concat(state.txPage - 1, ")\" ").concat(state.txPage === 1 ? 'disabled' : '', ">\u2039</button>");
  var maxPages = 5;
  var startPage = Math.max(1, state.txPage - Math.floor(maxPages / 2));
  var endPage = Math.min(totalPages, startPage + maxPages - 1);
  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  for (var p = startPage; p <= endPage; p += 1) {
    html += "<button class=\"tx-page-btn ".concat(p === state.txPage ? 'active' : '', "\" type=\"button\" onclick=\"setTxPage(").concat(p, ")\">").concat(p, "</button>");
  }
  html += "<button class=\"tx-page-btn\" type=\"button\" onclick=\"setTxPage(".concat(state.txPage + 1, ")\" ").concat(state.txPage === totalPages ? 'disabled' : '', ">\u203A</button>");
  html += "<span class=\"hub-card-meta\">".concat(_tx('Trang'), " ").concat(state.txPage, "/").concat(totalPages, "</span>");
  pagination.innerHTML = html;
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}
function renderWalletUnifiedHistory() {
  var wrap = document.getElementById('hubUnifiedList');
  if (!wrap) return;
  var _m = window.__manualTextMap || null;
  var _tx = function _tx(s) {
    return _m ? translateExactTextByMap(s, _m) || s : s;
  };
  var txRows = Array.isArray(state.wallet.transactions) ? state.wallet.transactions : [];
  var items = Array.isArray(state.inventoryItems) ? state.inventoryItems : [];
  var exchangeRows = items.filter(function (item) {
    var st = String(item.status || '').toLowerCase();
    return ['claimed', 'exchanged', 'converted', 'declined', 'rejected', 'confirmed', 'pending_approval'].includes(st);
  });
  var txHtml = txRows.length ? txRows.slice(0, 8).map(function (tx) {
    return "\n      <div class=\"tx-row\">\n        <div class=\"tx-left\">\n          <div class=\"tx-title\">".concat(txTitle(tx), "</div>\n          <div class=\"tx-time\">").concat(formatDateTime(tx.requestedAt), "</div>\n          ").concat(txReasonLine(tx), "\n        </div>\n        <div class=\"tx-left\" style=\"align-items:flex-end;\">\n          <div class=\"tx-amount\">").concat(formatVND(tx.amount), "</div>\n          <div class=\"tx-status\">").concat(txStatus(tx), "</div>\n        </div>\n      </div>\n    ");
  }).join('') : "<div class=\"hub-card\"><div class=\"hub-card-title\">".concat(_tx('Chưa có giao dịch'), "</div><div class=\"hub-card-meta\">").concat(_tx('Lịch sử giao dịch theo phiên sẽ hiển thị tại đây.'), "</div></div>");
  var invHtml = items.length ? items.slice(0, 8).map(function (item) {
    var itemCur = item.currency || state.sessionCurrency || 'VND';
    return "\n      <div class=\"hub-card\">\n        <div class=\"hub-card-title\">".concat(_tx('Hộp'), " #").concat(Number(item.box_number || item.boxNumber || 0), ": ").concat(item.prize_name || _tx('Phần thưởng'), "</div>\n        <div class=\"hub-card-meta\">").concat(_tx('Giá trị'), ": ").concat(Number(item.prize_value || 0) > 0 ? formatCurrency(item.prize_value, itemCur) : _tx('Quà hiện vật'), "</div>\n        <div class=\"hub-card-meta\">").concat(_tx('Trạng thái kho'), ": ").concat(getStatusText(item), "</div>\n        <div class=\"hub-card-meta\">").concat(_tx('Thời gian'), ": ").concat(formatDateTime(item.createdAt || item.created_at), "</div>\n      </div>\n    ");
  }).join('') : "<div class=\"hub-card\"><div class=\"hub-card-title\">".concat(_tx('Kho vật phẩm trống'), "</div><div class=\"hub-card-meta\">").concat(_tx('Chưa có vật phẩm nào trong phiên này.'), "</div></div>");
  var exchangeHtml = exchangeRows.length ? exchangeRows.slice(0, 8).map(function (item) {
    var itemCur = item.currency || state.sessionCurrency || 'VND';
    return "\n      <div class=\"hub-card\">\n        <div class=\"hub-card-title\">".concat(_tx('Hộp'), " #").concat(Number(item.box_number || item.boxNumber || 0), ": ").concat(item.prize_name || _tx('Phần thưởng'), "</div>\n        <div class=\"hub-card-meta\">").concat(_tx('Trạng thái đổi quà'), ": ").concat(getStatusText(item), "</div>\n        <div class=\"hub-card-meta\">").concat(_tx('Giá trị'), ": ").concat(Number(item.prize_value || 0) > 0 ? formatCurrency(item.prize_value, itemCur) : _tx('Quà hiện vật'), "</div>\n      </div>\n    ");
  }).join('') : "<div class=\"hub-card\"><div class=\"hub-card-title\">".concat(_tx('Chưa có bản ghi đổi quà'), "</div><div class=\"hub-card-meta\">").concat(_tx('Các yêu cầu nhận/quy đổi sẽ hiển thị tại đây.'), "</div></div>");
  wrap.innerHTML = "\n    <div class=\"hub-card\"><div class=\"hub-card-title\">".concat(_tx('Lịch sử giao dịch phiên'), "</div></div>\n    ").concat(txHtml, "\n    <div class=\"hub-card\"><div class=\"hub-card-title\">").concat(_tx('Lịch sử kho vật phẩm'), "</div></div>\n    ").concat(invHtml, "\n    <div class=\"hub-card\"><div class=\"hub-card-title\">").concat(_tx('Lịch sử đổi quà'), "</div></div>\n    ").concat(exchangeHtml, "\n  ");
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}
function setTxFilter(filter, el) {
  state.txFilter = filter;
  state.txPage = 1;
  document.querySelectorAll('#hubTabWallet .qbtn').forEach(function (btn) {
    btn.style.background = 'rgba(32,26,65,.7)';
  });
  if (el) el.style.background = 'rgba(124,58,237,.3)';
  renderTransactions();
}
function setTxPage(page) {
  state.txPage = Math.max(1, Number(page) || 1);
  renderTransactions();
}

// ── Pending-approval persistence (survives reload) ──────────────────────────
function savePendingApprovalState(prize, forceNewDeadline) {
  if (!state.sessionCode) return;
  try {
    var existing = getPendingApprovalState();
    // Preserve the original deadline — never overwrite it on restore
    var deadline = !forceNewDeadline && (existing === null || existing === void 0 ? void 0 : existing.deadline) || Date.now() + 7200 * 1000;
    localStorage.setItem("lmb_pap_".concat(state.sessionCode), JSON.stringify(_objectSpread(_objectSpread({}, prize || {}), {}, {
      deadline: deadline
    })));
  } catch (_) {}
}
function clearPendingApprovalState() {
  if (!state.sessionCode) return;
  try {
    localStorage.removeItem("lmb_pap_".concat(state.sessionCode));
  } catch (_) {}
}
function getPendingApprovalState() {
  if (!state.sessionCode) return null;
  try {
    var r = localStorage.getItem("lmb_pap_".concat(state.sessionCode));
    return r ? JSON.parse(r) : null;
  } catch (_) {
    return null;
  }
}

// After session data is loaded, check if there's an unresolved special-prize approval
function checkAndRestorePendingApproval() {
  if (!state.sessionCode) return;
  var isBoxStillSpecial = function isBoxStillSpecial(boxNumber) {
    var _state$sessionSpecial;
    var n = Number(boxNumber || 0);
    if (![1, 2, 3].includes(n)) return false;
    return !!((_state$sessionSpecial = state.sessionSpecialByBox) !== null && _state$sessionSpecial !== void 0 && _state$sessionSpecial[n]);
  };

  // Primary source: live inventory (most authoritative)
  var pending = state.inventoryItems.find(function (i) {
    var status = String(i.status || '').toLowerCase();
    var boxNumber = Number(i.box_number || i.boxNumber || 0);
    var itemSaysSpecial = !!i.is_special;
    return status === 'pending_approval' && itemSaysSpecial && isBoxStillSpecial(boxNumber);
  });
  if (pending) {
    var media = resolvePrizeMedia(pending, null, pending.box_number || pending.boxNumber);
    var prize = {
      icon: media.icon,
      image: media.image,
      name: pending.prize_name || 'Phần thưởng',
      value: Number(pending.prize_value || 0),
      isCash: !!pending.is_cash,
      isSpecial: true,
      boxNumber: Number(pending.box_number || 0),
      level: pending.level || 'VIP'
    };
    state.currentPrize = _objectSpread({}, prize);
    state.currentWinBox = prize.boxNumber;
    showApprovalWaitScreen(prize);
    return;
  }

  // Fallback: localStorage (covers the case where inventory call hasn't resolved yet
  // or the item status hasn't synced, but the previous session showed the screen)
  var saved = getPendingApprovalState();
  if (saved && saved.boxNumber && isBoxStillSpecial(saved.boxNumber)) {
    state.currentPrize = _objectSpread({}, saved);
    state.currentWinBox = Number(saved.boxNumber || 0);
    showApprovalWaitScreen(saved);
    return;
  }

  // Session config was updated to no longer require approval for that box.
  clearPendingApprovalState();
}
function joinSession(_x7) {
  return _joinSession.apply(this, arguments);
}
function _joinSession() {
  _joinSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36(code) {
    var navCode;
    return _regenerator().w(function (_context36) {
      while (1) switch (_context36.n) {
        case 0:
          _context36.n = 1;
          return apiJson('/api/lucky-mystery-box/join', {
            method: 'POST',
            body: JSON.stringify({
              sessionCode: code
            })
          });
        case 1:
          _context36.n = 2;
          return apiJson("/api/lucky-mystery-box/session?code=".concat(encodeURIComponent(code)));
        case 2:
          state.sessionCode = code;
          state.withdrawalHistoryRows = [];
          state.withdrawalHistorySessionCode = String(code || '').trim().toUpperCase();
          saveSessionCode(code);
          navCode = document.getElementById('navCode');
          if (navCode) navCode.textContent = code;
          if (typeof lmbManager !== 'undefined') {
            lmbManager.saveSession(code);
          }
          startRealtimeSync();

          // Do not block session entry on secondary data APIs.
          Promise.allSettled([withTimeout(refreshBoxesFromServer(), 10000, 'Tải danh sách hộp quá lâu'), withTimeout(refreshWallet(), 10000, 'Tải ví quá lâu'), withTimeout(loadPlayerInventory(), 10000, 'Tải kho quà quá lâu'), withTimeout(refreshTransactions(), 10000, 'Tải giao dịch quá lâu')]).finally(function () {
            // Update currency badge and labels based on latest session data
            updateCurrencyUI();

            // Restore approval wait screen if a special prize is still pending (survives reload)
            checkAndRestorePendingApproval();
            // Surface withdrawal decision after reload (approved/rejected).
            checkExistingWithdrawal().catch(function () {});
          });
        case 3:
          return _context36.a(2);
      }
    }, _callee36);
  }));
  return _joinSession.apply(this, arguments);
}
function renderCustomBoxTemplate(template, payload) {
  var data = payload || {};
  return String(template || '').replace(/\{(\w+)\}/g, function (_, key) {
    var value = Object.prototype.hasOwnProperty.call(data, key) ? data[key] : '';
    return esc(String(value));
  });
}
function applyAnimationPresets(animCfg) {
  if (!animCfg) return;
  var presets = Array.isArray(animCfg.presets) ? animCfg.presets : [];
  var styleEl = document.getElementById('lmbCustomAnimStyle');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'lmbCustomAnimStyle';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = presets.map(function (p) {
    return String(p.css || '');
  }).filter(Boolean).join('\n');
}
function getOpenAnimationProfile(name) {
  var key = String(name || 'shake').toLowerCase();
  var map = {
    shake: {
      phase1Ms: 700,
      phase2Ms: 220,
      boxAnim: 'boxShake .7s cubic-bezier(.36,.07,.19,.97) both',
      lidAnim: 'lidOpen .45s cubic-bezier(.4,0,.2,1) forwards'
    },
    flip: {
      phase1Ms: 620,
      phase2Ms: 200,
      boxAnim: 'boxFlip .62s cubic-bezier(.2,.85,.2,1) both',
      lidAnim: 'lidOpen .45s cubic-bezier(.4,0,.2,1) forwards'
    },
    bounce: {
      phase1Ms: 560,
      phase2Ms: 220,
      boxAnim: 'boxBounce .56s cubic-bezier(.25,.86,.36,1) both',
      lidAnim: 'lidOpen .42s cubic-bezier(.4,0,.2,1) forwards'
    },
    explode: {
      phase1Ms: 780,
      phase2Ms: 240,
      boxAnim: 'boxExplode .78s cubic-bezier(.2,.85,.2,1) both',
      lidAnim: 'lidOpen .48s cubic-bezier(.4,0,.2,1) forwards'
    },
    fade: {
      phase1Ms: 540,
      phase2Ms: 180,
      boxAnim: 'boxFadePulse .54s ease-out both',
      lidAnim: 'lidOpen .4s cubic-bezier(.4,0,.2,1) forwards'
    },
    spin3d: {
      phase1Ms: 760,
      phase2Ms: 220,
      boxAnim: 'boxSpin3d .76s cubic-bezier(.18,.88,.24,1) both',
      lidAnim: 'lidOpen .45s cubic-bezier(.4,0,.2,1) forwards'
    },
    warp: {
      phase1Ms: 640,
      phase2Ms: 230,
      boxAnim: 'boxWarp .64s cubic-bezier(.2,.8,.2,1) both',
      lidAnim: 'lidOpen .45s cubic-bezier(.4,0,.2,1) forwards'
    }
  };
  if (map[key]) return map[key];
  // Check custom presets from admin animation preset library
  var customPresets = window.__lmbUiSettings && window.__lmbUiSettings.animationPresets && window.__lmbUiSettings.animationPresets.presets || [];
  var preset = customPresets.find(function (p) {
    return String(p.name || '').toLowerCase() === key;
  });
  if (preset) {
    var dur = String(preset.duration || '0.8s');
    var durMs = Math.round((parseFloat(dur) || 0.8) * 1000);
    return {
      phase1Ms: durMs,
      phase2Ms: Math.round(durMs * 0.3),
      boxAnim: "".concat(preset.name, " ").concat(dur, " ease both"),
      lidAnim: 'lidOpen .45s cubic-bezier(.4,0,.2,1) forwards'
    };
  }
  return map.shake;
}
function mkCard(boxNumber, boxMeta) {
  var _state$sessionImageBy;
  var st = boxMeta.state;
  var wrap = document.createElement('div');
  wrap.className = 'box-wrap';
  if (st === 'opened-win' || st === 'opened-bad') wrap.classList.add('box-wrap-opened');
  wrap.dataset.box = String(boxNumber);
  var levelKey = String(boxMeta.level || (st === 'opened-bad' ? 'UNLUCKY' : 'NORMAL')).toUpperCase();
  var isUnlucky = st === 'opened-bad' || levelKey === 'UNLUCKY';
  var isVip = levelKey === 'VIP' || boxMeta.isSpecial;
  var tierClass = isUnlucky ? 'unlucky' : isVip ? 'vip' : 'normal';
  var tierLabel = isUnlucky ? 'UNLUCKY RESULT' : isVip ? 'VIP TIER' : 'NORMAL TIER';
  var card = document.createElement('div');
  card.className = "gcard ".concat(tierClass);
  var _m = window.__manualTextMap || null;
  var _tx = function _tx(s) {
    return _m ? translateExactTextByMap(s, _m) || s : s;
  };
  if (st === 'opened-win' || st === 'opened-bad') card.classList.add('is-opened');
  if (st === 'active') card.classList.add('is-active');
  if (st === 'inactive') card.classList.add('is-inactive');
  var mkParticles = function mkParticles(tier) {
    var palette = {
      unlucky: ['#a78bfa', '#7c3aed', '#c4b5fd'],
      normal: ['#4ade80', '#22c55e', '#86efac'],
      vip: ['#fbbf24', '#f59e0b', '#fcd34d']
    };
    var colors = palette[tier] || palette.normal;
    var html = '';
    for (var i = 0; i < 24; i++) {
      var c = colors[i % colors.length];
      var px = (Math.random() - 0.5) * 168;
      var py = -(44 + Math.random() * 126);
      var left = 10 + Math.random() * 80;
      var top = 20 + Math.random() * 60;
      html += "<div class=\"particle\" style=\"left:".concat(left, "%;top:").concat(top, "%;background:").concat(c, ";--px:").concat(px, "px;--py:").concat(py, "px;--pdur:").concat(.9 + Math.random() * 1.4, "s;--pdelay:-").concat(Math.random() * 1.5, "s\"></div>");
    }
    return html;
  };
  var mkBadgeSparks = function mkBadgeSparks() {
    var dots = '';
    for (var i = 0; i < 8; i++) {
      var angle = i * 45 * Math.PI / 180;
      var px = Math.round(Math.cos(angle) * 22);
      var py = Math.round(Math.sin(angle) * 22);
      dots += "<div class=\"sp\" style=\"--px:".concat(px, "px;--py:").concat(py, "px;--pd:").concat(0.9 + Math.random() * 0.5, "s;--ps:-").concat((Math.random() * 0.9).toFixed(2), "s\"></div>");
    }
    return dots;
  };
  var mkRainDrops = function mkRainDrops() {
    var html = '';
    for (var i = 0; i < 22; i++) {
      var h = 16 + Math.random() * 28;
      html += "<div class=\"raindrop\" style=\"left:".concat(4 + Math.random() * 92, "%;height:").concat(h, "px;--rdur:").concat(0.45 + Math.random() * 0.5, "s;--rdelay:-").concat(Math.random() * 1.2, "s\"></div>");
    }
    return html;
  };
  var preferredImage = normalizePrizeImageUrl(boxMeta.image || ((_state$sessionImageBy = state.sessionImageByBox) === null || _state$sessionImageBy === void 0 ? void 0 : _state$sessionImageBy[boxNumber]) || '');
  var safeIcon = esc(boxMeta.icon || state.gameSettings.boxIcon || '🎁');
  var prizeName = esc(boxMeta.name || 'Phần thưởng');
  var valueText = 'Quà hiện vật';
  if (Number(boxMeta.value || 0) > 0) {
    var fmtVal = Math.max(0, Number(boxMeta.value)).toLocaleString('vi-VN');
    var cur = boxMeta.currency || 'VND';
    if (cur === 'USD') valueText = "$".concat(fmtVal);else if (cur === 'NDT') valueText = "\xA5".concat(fmtVal);else valueText = "".concat(fmtVal, "\u0111");
  }
  var bodyHtml = '';
  if (st === 'opened-bad') {
    var unluckyIcon = String(boxMeta.icon || '').trim() || '😭';
    bodyHtml = "\n      <div class=\"img-shell\">\n        <div class=\"cry-shell\">\n          <div class=\"rain\">".concat(mkRainDrops(), "</div>\n          <div class=\"cry-vignette\"></div>\n          <span class=\"cry-emoji\">").concat(esc(unluckyIcon), "</span>\n          <div class=\"cry-puddle\"></div>\n        </div>\n      </div>\n      <div class=\"card-body card-body-unified\">\n        <div class=\"card-title\">Ch\xFAc b\u1EA1n may m\u1EAFn l\u1EA7n sau</div>\n        <div class=\"card-subtitle\">H\u1ED9p ti\u1EBFp theo c\xF3 th\u1EC3 s\u1EBD mang \u0111\u1EBFn b\u1EA5t ng\u1EDD l\u1EDBn h\u01A1n</div>\n        <div class=\"status-row status-declined\"><div class=\"status-dot\"></div>UNLUCKY RESULT</div>\n      </div>");
    card.onclick = function () {
      return reopenWinOptions(boxNumber);
    };
  } else if (st === 'opened-win') {
    var hasImage = !!String(preferredImage || '').trim();
    var _procStatusMap = {
      obtained: {
        cls: 'status-pending',
        label: '⏳ Chờ xử lý'
      },
      pending_approval: {
        cls: 'status-pending',
        label: '⏳ Đang xử lý'
      },
      confirmed: {
        cls: 'status-confirmed',
        label: '✅ Đã xác nhận'
      },
      converted: {
        cls: 'status-redeemed',
        label: '✅ Đã quy đổi'
      },
      declined: {
        cls: 'status-declined',
        label: '✕ Đã từ chối'
      },
      rejected: {
        cls: 'status-declined',
        label: '✕ Đã từ chối'
      },
      claimed: {
        cls: 'status-redeemed',
        label: '✅ Đã nhận'
      },
      exchanged: {
        cls: 'status-redeemed',
        label: '✅ Đã trao đổi'
      },
      banned: {
        cls: 'status-declined',
        label: '🚫 Đã khóa'
      }
    };
    var _rawProc = String(boxMeta.processingStatus || boxMeta.decision || 'obtained').toLowerCase();
    var _procInfo = _procStatusMap[_rawProc] || _procStatusMap.obtained;
    var statusHtml = "<div class=\"status-row ".concat(_procInfo.cls, "\"><div class=\"status-dot\"></div>").concat(_procInfo.label, "</div>");
    var imageContent = hasImage ? "<img class=\"result-reward-image\" src=\"".concat(esc(preferredImage), "\" alt=\"").concat(prizeName, "\" loading=\"lazy\" decoding=\"async\" onerror=\"this.onerror=null;this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='flex';}\"><div class=\"emoji-fallback\" style=\"display:none\">").concat(safeIcon, "</div><div class=\"img-glow\"></div><div class=\"img-scan\"></div>") : "<div class=\"emoji-fallback\">".concat(safeIcon, "</div>");
    var badgeHtml = hasImage ? "<div class=\"badge-sparks\">".concat(mkBadgeSparks(), "</div><div class=\"reward-badge\">").concat(safeIcon, "</div>") : '';
    var useUnluckyBodyLayout = !isUnlucky;
    var valueSubtitle = "".concat(_tx('Giá trị'), ": ").concat(valueText);
    var bodyInfoHtml = useUnluckyBodyLayout ? "<div class=\"card-subtitle\">".concat(esc(valueSubtitle), "</div>").concat(statusHtml) : "<div class=\"card-amount\">".concat(valueText, "</div>").concat(statusHtml);
    bodyHtml = "\n      <div class=\"img-shell\">\n        ".concat(imageContent, "\n        ").concat(badgeHtml, "\n      </div>\n      <div class=\"card-body card-body-unified\">\n        <div class=\"card-title\">").concat(prizeName, "</div>\n        ").concat(bodyInfoHtml, "\n      </div>");
    card.onclick = function () {
      return reopenWinOptions(boxNumber);
    };
  } else {
    var isActive = st === 'active';
    var subtitle = state.gameLocked ? _tx(getGameLockNoticeText()) : isActive ? _tx('Bấm để mở') : _tx('Phần thưởng bí ẩn');
    var sparkMap = {
      normal: ['✦', '✧', '◆', '·'],
      vip: ['✶', '✦', '✷', '✹'],
      unlucky: ['✕', '◌', '⟡', '·']
    };
    var sparks = sparkMap[tierClass] || sparkMap.normal;
    var tierEmblem = tierClass === 'vip' ? '♛' : tierClass === 'unlucky' ? '☍' : '◈';
    card.classList.add('gift-card');
    if (isActive) {
      card.classList.add('gift-active');
    } else {
      card.classList.add('gift-inactive');
    }
    var n = boxNumber;
    var customTemplate = String(state.gameSettings.boxTemplateHtml || '').trim();
    if (customTemplate) {
      card.classList.add('custom-box-template');
      bodyHtml = renderCustomBoxTemplate(customTemplate, {
        boxNumber: n,
        subtitle: subtitle,
        title: "".concat(_tx('Hộp quà'), " #").concat(n),
        hint: isActive && !state.gameLocked ? _tx('Bấm để mở') : ''
      });
    } else {
      bodyHtml = "\n      <div class=\"card-shimmer\"></div>\n      <div class=\"box-area\">\n        <div class=\"box-glow\"></div>\n        <span class=\"tier-orbit o1\"></span>\n        <span class=\"tier-orbit o2\"></span>\n        <span class=\"tier-emblem\">".concat(tierEmblem, "</span>\n          <span class=\"box-open-wave\"></span>\n        <div class=\"box-layer tier-").concat(tierClass, "\">\n          <div class=\"box-lid\">\n            <svg viewBox=\"0 0 140 46\" fill=\"none\">\n              <rect x=\"2\" y=\"8\" width=\"136\" height=\"36\" rx=\"7\" fill=\"url(#lidGrad").concat(n, ")\" stroke=\"rgba(196,181,253,.7)\" stroke-width=\"1.3\"/>\n              <g class=\"box-ribbon\">\n                <rect x=\"57\" y=\"0\" width=\"26\" height=\"46\" rx=\"6\" fill=\"url(#ribGrad").concat(n, ")\" stroke=\"rgba(196,181,253,.5)\" stroke-width=\"1\"/>\n                <ellipse cx=\"55\" cy=\"10\" rx=\"22\" ry=\"13\" fill=\"url(#bowGrad").concat(n, ")\" stroke=\"rgba(196,181,253,.65)\" stroke-width=\"1.2\" transform=\"rotate(-18 55 10)\"/>\n                <ellipse cx=\"85\" cy=\"10\" rx=\"22\" ry=\"13\" fill=\"url(#bowGrad").concat(n, ")\" stroke=\"rgba(196,181,253,.65)\" stroke-width=\"1.2\" transform=\"rotate(18 85 10)\"/>\n                <circle cx=\"70\" cy=\"8\" r=\"9\" fill=\"rgba(196,181,253,.75)\" stroke=\"rgba(255,255,255,.6)\" stroke-width=\"1.2\"/>\n                <circle cx=\"70\" cy=\"8\" r=\"5\" fill=\"rgba(255,255,255,.3)\"/>\n              </g>\n              <defs>\n                <linearGradient id=\"lidGrad").concat(n, "\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"rgba(139,92,246,.45)\"/><stop offset=\"100%\" stop-color=\"rgba(76,29,149,.6)\"/></linearGradient>\n                <linearGradient id=\"ribGrad").concat(n, "\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0%\" stop-color=\"rgba(196,181,253,.25)\"/><stop offset=\"50%\" stop-color=\"rgba(196,181,253,.45)\"/><stop offset=\"100%\" stop-color=\"rgba(196,181,253,.25)\"/></linearGradient>\n                <radialGradient id=\"bowGrad").concat(n, "\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0%\" stop-color=\"rgba(167,139,250,.5)\"/><stop offset=\"100%\" stop-color=\"rgba(109,40,217,.6)\"/></radialGradient>\n              </defs>\n            </svg>\n          </div>\n          <div class=\"box-body\">\n            <svg viewBox=\"0 0 140 118\" fill=\"none\">\n              <rect x=\"2\" y=\"2\" width=\"136\" height=\"114\" rx=\"8\" fill=\"url(#bodyGrad").concat(n, ")\" stroke=\"rgba(139,92,246,.6)\" stroke-width=\"1.5\"/>\n              <g class=\"box-ribbon\">\n                <rect x=\"57\" y=\"2\" width=\"26\" height=\"114\" rx=\"5\" fill=\"url(#ribBodyGrad").concat(n, ")\" stroke=\"rgba(139,92,246,.35)\" stroke-width=\"1\"/>\n              </g>\n              <rect x=\"10\" y=\"10\" width=\"40\" height=\"94\" rx=\"6\" fill=\"rgba(255,255,255,.03)\"/>\n              <rect x=\"95\" y=\"10\" width=\"34\" height=\"94\" rx=\"6\" fill=\"rgba(255,255,255,.02)\"/>\n              <rect x=\"4\" y=\"2\" width=\"132\" height=\"3\" rx=\"2\" fill=\"rgba(196,181,253,.18)\"/>\n              <circle cx=\"12\" cy=\"14\" r=\"3.5\" fill=\"rgba(196,181,253,.35)\"/>\n              <circle cx=\"128\" cy=\"14\" r=\"3.5\" fill=\"rgba(196,181,253,.35)\"/>\n              <circle cx=\"12\" cy=\"106\" r=\"3.5\" fill=\"rgba(139,92,246,.3)\"/>\n              <circle cx=\"128\" cy=\"106\" r=\"3.5\" fill=\"rgba(139,92,246,.3)\"/>\n              <path d=\"M30 60 L50 40 L70 60 L50 80Z\" fill=\"rgba(196,181,253,.04)\" stroke=\"rgba(196,181,253,.08)\" stroke-width=\".5\"/>\n              <path d=\"M90 60 L110 40 L130 60 L110 80Z\" fill=\"rgba(196,181,253,.04)\" stroke=\"rgba(196,181,253,.08)\" stroke-width=\".5\"/>\n              <defs>\n                <linearGradient id=\"bodyGrad").concat(n, "\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"rgba(60,20,120,.85)\"/><stop offset=\"50%\" stop-color=\"rgba(46,16,101,.92)\"/><stop offset=\"100%\" stop-color=\"rgba(30,10,70,.95)\"/></linearGradient>\n                <linearGradient id=\"ribBodyGrad").concat(n, "\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0%\" stop-color=\"rgba(139,92,246,.12)\"/><stop offset=\"50%\" stop-color=\"rgba(139,92,246,.25)\"/><stop offset=\"100%\" stop-color=\"rgba(139,92,246,.12)\"/></linearGradient>\n              </defs>\n            </svg>\n          </div>\n          <span class=\"box-spark sp1\">").concat(sparks[0], "</span>\n          <span class=\"box-spark sp2\">").concat(sparks[1], "</span>\n          <span class=\"box-spark sp3\">").concat(sparks[2], "</span>\n          <span class=\"box-spark sp4\">").concat(sparks[3], "</span>\n        </div>\n      </div>\n      <div class=\"card-divider\"></div>\n      <div class=\"text-area\">\n        <span class=\"box-title\">").concat(_tx('Hộp quà'), " #").concat(n, "</span>\n        <span class=\"box-subtitle\">").concat(esc(subtitle), "</span>\n        ").concat(isActive && !state.gameLocked ? "<div class=\"box-hint\"><span class=\"box-hint-dot\"></span><span>".concat(_tx('Bấm để mở'), "</span><span class=\"box-hint-dot\"></span></div>") : '', "\n      </div>");
    }
    if (isActive && !state.gameLocked) card.onclick = function () {
      return openBox(boxNumber);
    };
  }
  if (card.classList.contains('gift-card')) {
    card.innerHTML = bodyHtml;
  } else {
    card.innerHTML = "\n      <div class=\"glow-ring\"></div>\n      ".concat(st === 'opened-win' || st === 'opened-bad' ? "<div class=\"chip\">".concat(_tx('Đã mở'), "</div>") : '', "\n      <div class=\"tier-ribbon ").concat(tierClass, "\">").concat(tierLabel, "</div>\n      <div class=\"particles\">").concat(mkParticles(tierClass), "</div>\n      ").concat(bodyHtml, "\n    ");
  }
  wrap.appendChild(card);

  // Caption is only shown for opened cards; the new gift-card design has title inside
  if (!card.classList.contains('gift-card')) {
    var caption = document.createElement('div');
    caption.className = 'box-caption';
    var _m2 = window.__manualTextMap || null;
    var _tx2 = function _tx2(s) {
      return _m2 ? translateExactTextByMap(s, _m2) || s : s;
    };
    var captionTitle = "".concat(_tx2('Hộp'), " ").concat(boxNumber);
    var captionSub = '';
    if (st === 'active') captionSub = _tx2('Sẵn sàng mở');else if (st === 'inactive') captionSub = state.gameLocked ? _tx2(getGameLockNoticeText()) : _tx2('Chưa mở');else if (st === 'opened-bad') captionSub = _tx2('Đã mở - Unlucky');else captionSub = "".concat(_tx2('Đã mở'), " - ").concat(esc(boxMeta.name || _tx2('Phần thưởng')));
    caption.innerHTML = "<div class=\"box-caption-title\">".concat(esc(captionTitle), "</div><div class=\"box-caption-sub\">").concat(esc(captionSub), "</div>");
    wrap.appendChild(caption);
  }
  return wrap;
}
function renderBoxes() {
  ensureGiftStars();
  var row = document.getElementById('boxesRow');
  if (!row) return;
  state.renderBoxesToken = Number(state.renderBoxesToken || 0) + 1;
  var renderToken = state.renderBoxesToken;
  var orderedBoxes = Array.isArray(state.openOrder) ? state.openOrder.slice() : [];
  row.innerHTML = '';
  var finalizeRender = function finalizeRender() {
    if (state.renderBoxesToken !== renderToken) return;
    initBoxDragDrop();
    if (typeof state.gameSettings.boxTemplateFn === 'function') {
      try {
        state.gameSettings.boxTemplateFn(row, state);
      } catch (err) {
        console.warn('boxTemplateJs runtime error:', err.message);
      }
    }
    if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
  };
  var shouldChunkRender = isMobileLiteEffects() || FX_PROFILE.tier !== 'high';
  if (!shouldChunkRender) {
    orderedBoxes.forEach(function (boxNumber) {
      row.appendChild(mkCard(boxNumber, state.boxes[boxNumber]));
    });
    finalizeRender();
    return;
  }
  var index = 0;
  var chunkBudgetMs = 6;
  var chunkSize = isMobileLiteEffects() ? 2 : 3;
  var _pump = function pump() {
    if (state.renderBoxesToken !== renderToken) return;
    var startedAt = performance.now();
    while (index < orderedBoxes.length) {
      var boxNumber = orderedBoxes[index];
      row.appendChild(mkCard(boxNumber, state.boxes[boxNumber]));
      index += 1;
      if (index % chunkSize === 0) break;
      if (performance.now() - startedAt >= chunkBudgetMs) break;
    }
    if (index < orderedBoxes.length) {
      requestAnimationFrame(_pump);
      return;
    }
    finalizeRender();
  };
  requestAnimationFrame(_pump);
}
function ensureGiftStars() {
  var starsEl = document.getElementById('stars');
  if (!starsEl || starsEl.dataset.ready === '1') return;
  var frag = document.createDocumentFragment();
  var count = FX_PROFILE.tier === 'high' ? 30 : FX_PROFILE.tier === 'medium' ? 18 : 10;
  for (var i = 0; i < count; i++) {
    var s = document.createElement('div');
    s.className = 'star';
    var size = Math.random() * 2.5 + 0.5;
    s.style.cssText = "width:".concat(size, "px;height:").concat(size, "px;top:").concat(Math.random() * 100, "%;left:").concat(Math.random() * 100, "%;--dur:").concat(2 + Math.random() * 4, "s;--delay:-").concat(Math.random() * 5, "s");
    frag.appendChild(s);
  }
  starsEl.appendChild(frag);
  starsEl.dataset.ready = '1';
}
function selMode(mode, el) {
  state.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(function (b) {
    b.style.outline = 'none';
  });
  if (el) el.style.outline = '2px solid rgba(255,255,255,.32)';
}
function stopGameHeroTyping() {
  if (state.heroTypingTimer) {
    clearTimeout(state.heroTypingTimer);
    state.heroTypingTimer = null;
  }
  if (state.heroTypingRestartTimer) {
    clearTimeout(state.heroTypingRestartTimer);
    state.heroTypingRestartTimer = null;
  }
}
function startGameHeroTyping() {
  var subtitleEl = document.getElementById('gameHeroSubtitle');
  if (!subtitleEl) return;
  var gameScreen = document.getElementById('screen-game');
  if (!gameScreen || window.getComputedStyle(gameScreen).display === 'none') return;
  var fullText = String(subtitleEl.dataset.fullText || subtitleEl.textContent || '').trim();
  if (!fullText) return;
  if (isMobileLiteEffects()) {
    stopGameHeroTyping();
    subtitleEl.textContent = fullText;
    subtitleEl.classList.remove('typing-active');
    subtitleEl.classList.add('typing-done');
    return;
  }
  stopGameHeroTyping();
  subtitleEl.textContent = '';
  subtitleEl.classList.remove('typing-done');
  subtitleEl.classList.add('typing-active');
  var idx = 0;
  var _typeNext = function typeNext() {
    if (idx >= fullText.length) {
      subtitleEl.classList.add('typing-done');
      state.heroTypingRestartTimer = setTimeout(function () {
        startGameHeroTyping();
      }, 2400);
      return;
    }
    subtitleEl.textContent += fullText.charAt(idx);
    idx += 1;
    var stepDelay = 36 + Math.floor(Math.random() * 28);
    state.heroTypingTimer = setTimeout(_typeNext, stepDelay);
  };
  state.heroTypingTimer = setTimeout(_typeNext, 260);
}
function startGame(_x8) {
  return _startGame.apply(this, arguments);
} // ── Celebration FX — lazy loaded from modules/lmb-celebration-fx.js ──
function _startGame() {
  _startGame = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39(preferredCode) {
    return _regenerator().w(function (_context39) {
      while (1) switch (_context39.p = _context39.n) {
        case 0:
          if (!state.startGamePromise) {
            _context39.n = 1;
            break;
          }
          return _context39.a(2, state.startGamePromise);
        case 1:
          state.startGamePromise = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38() {
            var input, forcedCode, code, loginScreen, gameScreen, nextUrl, _t21;
            return _regenerator().w(function (_context38) {
              while (1) switch (_context38.p = _context38.n) {
                case 0:
                  if (!state._settingsReady) {
                    _context38.n = 1;
                    break;
                  }
                  _context38.n = 1;
                  return state._settingsReady;
                case 1:
                  input = getHomepageSessionInput();
                  forcedCode = String(preferredCode || '').trim().toUpperCase();
                  code = forcedCode || (input ? (input.value || '').trim().toUpperCase() : '');
                  if (!(!input && !forcedCode)) {
                    _context38.n = 2;
                    break;
                  }
                  showToast('Không tìm thấy ô nhập mã phiên');
                  return _context38.a(2);
                case 2:
                  if (code) {
                    _context38.n = 3;
                    break;
                  }
                  showToast('Vui lòng nhập mã phiên');
                  return _context38.a(2);
                case 3:
                  _context38.p = 3;
                  _context38.n = 4;
                  return withLoadingOverlay('Đang kết nối phiên chơi...', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37() {
                    return _regenerator().w(function (_context37) {
                      while (1) switch (_context37.n) {
                        case 0:
                          _context37.n = 1;
                          return withTimeout(joinSession(code), 15000, 'Kết nối phiên quá lâu. Vui lòng thử lại.');
                        case 1:
                          return _context37.a(2);
                      }
                    }, _callee37);
                  })));
                case 4:
                  loginScreen = document.getElementById('screen-login');
                  gameScreen = document.getElementById('screen-game');
                  if (loginScreen) loginScreen.style.display = 'none';
                  if (gameScreen) gameScreen.style.display = 'block';
                  syncHomepagePerformanceMode();
                  startGameHeroTyping();
                  state.chat.initialized = false;
                  stopChatSSE();
                  startChatSSE();
                  showToast('Kết nối phiên thành công');
                  nextUrl = "".concat(window.location.pathname, "?code=").concat(encodeURIComponent(code));
                  window.history.replaceState({
                    sessionCode: code
                  }, '', nextUrl);
                  state.urlAutoEnterDone = true;
                  clearAutoEnterRetryTimers();
                  _context38.n = 6;
                  break;
                case 5:
                  _context38.p = 5;
                  _t21 = _context38.v;
                  showToast("\u274C ".concat(_t21.message));
                case 6:
                  return _context38.a(2);
              }
            }, _callee38, null, [[3, 5]]);
          }))();
          _context39.p = 2;
          _context39.n = 3;
          return state.startGamePromise;
        case 3:
          return _context39.a(2, _context39.v);
        case 4:
          _context39.p = 4;
          state.startGamePromise = null;
          return _context39.f(4);
        case 5:
          return _context39.a(2);
      }
    }, _callee39, null, [[2,, 4, 5]]);
  }));
  return _startGame.apply(this, arguments);
}
function delay(ms) {
  return new Promise(function (r) {
    return setTimeout(r, ms);
  });
}
function mkRing() {}
function burst() {}
function mkConf() {}
function screenShake() {}
function mkCoreFlash() {}
function mkShockwave() {}
function mkRays() {}
function mkSparks() {}
function megaExplosion() {}
function ensureOpenBoxAnimStyles() {}
function spawnUnboxFX() {}
function spawnScanLine() {}
function spawnSparks() {}
function spawnScreenFlash() {}
function spawnCardGlow() {}
function spawnVipGlowRings() {}
function spawnLightBeams() {}
function spawnBoxBurst() {}
function spawnVipRevealTexts() {
  return null;
}
function playPrizeFlyAnimation() {
  return Promise.resolve();
}
function playCelebrationOverlay() {
  return Promise.resolve();
}
function openBox(_x9) {
  return _openBox.apply(this, arguments);
}
function _openBox() {
  _openBox = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40(boxNumber) {
    var initialLocked, initialReason, pendingBox, boxWrap, card, boxLayer, lid, rect, cx, cy, _result$prize, _result$prize2, _result$prize3, _result$prize4, _result$prize5, _state$sessionImageBy2, _result$prize6, _result$prize7, _result$prize8, _result$prize9, _result$prize0, _result$prize1, _result$prize10, _result$prize11, _result$prize12, _result$prize13, _state$boxes13, _state$boxes$boxNumbe, requestPromise, fx, openAnim, result, level, unlucky, isVip, resolvedOpenImage, prizeCurrency, nextBox, isVndCashPrize, refreshPromise, isNoMoneyWinningPrize, msg, _t22, _t23, _t24, _t25;
    return _regenerator().w(function (_context40) {
      while (1) switch (_context40.p = _context40.n) {
        case 0:
          initialLocked = updateGameLockByApprovedPendingCash();
          if (!initialLocked) {
            _context40.n = 6;
            break;
          }
          initialReason = String(state.gameLockReason || ''); // Approval/withdraw status may have just changed server-side.
          // Re-sync once before hard-blocking to avoid forcing manual page reload.
          if (!(initialReason === 'withdraw_request_required' && state.sessionCode)) {
            _context40.n = 5;
            break;
          }
          _context40.p = 1;
          _context40.n = 2;
          return Promise.all([refreshWallet(), refreshTransactions(), refreshBoxesFromServer()]);
        case 2:
          _context40.n = 4;
          break;
        case 3:
          _context40.p = 3;
          _t22 = _context40.v;
        case 4:
          if (!updateGameLockByApprovedPendingCash()) {
            renderBoxes();
          }
        case 5:
          if (!state.gameLocked) {
            _context40.n = 6;
            break;
          }
          pendingBox = getPendingApprovedCashBoxNumber();
          showToast("\u23F3 ".concat(getGameLockNoticeText(), "."));
          if (pendingBox) {
            showApprovedConversionReminderModal(pendingBox, {
              force: true
            });
          }
          return _context40.a(2);
        case 6:
          if (validateSession()) {
            _context40.n = 7;
            break;
          }
          return _context40.a(2);
        case 7:
          if (!(!state.sessionCode || state.loadingOpen)) {
            _context40.n = 8;
            break;
          }
          return _context40.a(2);
        case 8:
          state.loadingOpen = true;

          // Find the specific card for this box number; fall back to the active card selector
          boxWrap = document.querySelector(".box-wrap[data-box=\"".concat(boxNumber, "\"]"));
          card = (boxWrap ? boxWrap.querySelector('.gcard') : null) || document.querySelector('.gcard.ga'); // Ensure card is in viewport before measuring (handles scrolled mobile layout)
          if (card) card.scrollIntoView({
            behavior: 'instant',
            block: 'nearest'
          });
          boxLayer = card ? card.querySelector('.box-layer') : null;
          lid = card ? card.querySelector('.box-lid') : null;
          rect = card ? card.getBoundingClientRect() : {
            left: W / 2,
            top: H / 2,
            width: 280,
            height: 320
          };
          cx = rect.left + rect.width / 2;
          cy = rect.top + rect.height / 2;
          _context40.p = 9;
          requestPromise = apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/select-box"), {
            method: 'POST',
            body: JSON.stringify({
              sessionCode: state.sessionCode,
              boxNumber: boxNumber
            })
          });
          fx = true;
          openAnim = getOpenAnimationProfile(state.gameSettings.boxOpenAnimation); // Use boxes-redesign opening rhythm: shake -> lid open.
          if (card) {
            card.style.pointerEvents = 'none';
            card.classList.add('opening-shake');
          }
          if (fx && boxLayer) boxLayer.style.animation = openAnim.boxAnim;
          _context40.n = 10;
          return delay(openAnim.phase1Ms);
        case 10:
          if (card) card.classList.remove('opening-shake');
          if (card) {
            card.classList.add('opening-lid-wave');
            setTimeout(function () {
              return card.classList.remove('opening-lid-wave');
            }, 680);
          }
          if (fx && lid) lid.style.animation = openAnim.lidAnim;
          if (fx && boxLayer) boxLayer.style.animation = '';
          _context40.n = 11;
          return delay(openAnim.phase2Ms);
        case 11:
          _context40.n = 12;
          return requestPromise;
        case 12:
          result = _context40.v;
          level = ((result === null || result === void 0 || (_result$prize = result.prize) === null || _result$prize === void 0 ? void 0 : _result$prize.level) || (result === null || result === void 0 || (_result$prize2 = result.prize) === null || _result$prize2 === void 0 ? void 0 : _result$prize2.status) || 'NORMAL').toUpperCase();
          unlucky = level === 'UNLUCKY';
          isVip = level === 'VIP';
          resolvedOpenImage = normalizePrizeImageUrl((result === null || result === void 0 || (_result$prize3 = result.prize) === null || _result$prize3 === void 0 ? void 0 : _result$prize3.imageUrl) || (result === null || result === void 0 || (_result$prize4 = result.prize) === null || _result$prize4 === void 0 ? void 0 : _result$prize4.prize_image) || (result === null || result === void 0 || (_result$prize5 = result.prize) === null || _result$prize5 === void 0 ? void 0 : _result$prize5.image) || ((_state$sessionImageBy2 = state.sessionImageByBox) === null || _state$sessionImageBy2 === void 0 ? void 0 : _state$sessionImageBy2[boxNumber]) || ''); // Store prize state
          state.currentPrize = _objectSpread(_objectSpread({}, (result === null || result === void 0 ? void 0 : result.prize) || {}), {}, {
            boxNumber: boxNumber,
            image: resolvedOpenImage
          });
          state.currentWinBox = boxNumber;
          prizeCurrency = (result === null || result === void 0 || (_result$prize6 = result.prize) === null || _result$prize6 === void 0 ? void 0 : _result$prize6.currency) || (result === null || result === void 0 ? void 0 : result.currency) || 'VND';
          state.boxes[boxNumber] = {
            state: unlucky ? 'opened-bad' : 'opened-win',
            value: Number((result === null || result === void 0 || (_result$prize7 = result.prize) === null || _result$prize7 === void 0 ? void 0 : _result$prize7.value) || 0),
            name: (result === null || result === void 0 || (_result$prize8 = result.prize) === null || _result$prize8 === void 0 ? void 0 : _result$prize8.name) || 'Phần thưởng',
            icon: (result === null || result === void 0 || (_result$prize9 = result.prize) === null || _result$prize9 === void 0 ? void 0 : _result$prize9.icon) || "\uD83C\uDF81",
            image: resolvedOpenImage,
            isCash: isCashPrizeLike({
              isCash: result === null || result === void 0 || (_result$prize0 = result.prize) === null || _result$prize0 === void 0 ? void 0 : _result$prize0.isCash,
              value: result === null || result === void 0 || (_result$prize1 = result.prize) === null || _result$prize1 === void 0 ? void 0 : _result$prize1.value
            }),
            isSpecial: !!(result !== null && result !== void 0 && (_result$prize10 = result.prize) !== null && _result$prize10 !== void 0 && _result$prize10.isSpecial),
            level: (result === null || result === void 0 || (_result$prize11 = result.prize) === null || _result$prize11 === void 0 ? void 0 : _result$prize11.level) || 'NORMAL',
            currency: prizeCurrency,
            category: (result === null || result === void 0 || (_result$prize12 = result.prize) === null || _result$prize12 === void 0 ? void 0 : _result$prize12.description) || (result === null || result === void 0 || (_result$prize13 = result.prize) === null || _result$prize13 === void 0 ? void 0 : _result$prize13.category) || '',
            decision: null
          };

          // Activate next box when this result does not enter a separate approval flow.
          if (!(result !== null && result !== void 0 && result.requiresApproval)) {
            nextBox = state.openOrder.find(function (n) {
              return state.boxes[n].state === 'inactive';
            });
            if (nextBox) state.boxes[nextBox].state = 'active';
          }

          // Opening result effects aligned with boxes-redesign style.
          if (fx) {
            burst(cx, cy, isVip, true);
            if (!unlucky) mkConf(isVip ? 30 : 22, true);
          }
          isVndCashPrize = !!(!unlucky && !(result !== null && result !== void 0 && result.requiresApproval) && prizeCurrency === 'VND' && isCashPrizeLike(state.boxes[boxNumber]));
          if (!isVndCashPrize) {
            _context40.n = 16;
            break;
          }
          _context40.p = 13;
          _context40.n = 14;
          return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/convert"), {
            method: 'POST',
            body: JSON.stringify({
              boxNumber: boxNumber,
              instant: true
            })
          });
        case 14:
          if (state.boxes[boxNumber]) state.boxes[boxNumber].decision = 'converted';
          _context40.n = 16;
          break;
        case 15:
          _context40.p = 15;
          _t23 = _context40.v;
          console.error('VND auto-convert failed:', (_t23 === null || _t23 === void 0 ? void 0 : _t23.message) || _t23);
        case 16:
          renderBoxes();
          if (result !== null && result !== void 0 && result.requiresApproval) {
            _context40.n = 17;
            break;
          }
          _context40.n = 17;
          return runOpenedCardRevealSequence(boxNumber, {
            unlucky: unlucky
          });
        case 17:
          refreshPromise = Promise.all([refreshWallet(), loadPlayerInventory(), refreshTransactions()]).catch(function (refreshErr) {
            console.error('Non-blocking refresh failed after openBox:', (refreshErr === null || refreshErr === void 0 ? void 0 : refreshErr.message) || refreshErr);
            return null;
          });
          if (!unlucky) {
            _context40.n = 19;
            break;
          }
          _context40.n = 18;
          return refreshPromise;
        case 18:
          showToast('😔 Chúc bạn may mắn lần sau!');
          return _context40.a(2);
        case 19:
          if (!(result !== null && result !== void 0 && result.requiresApproval)) {
            _context40.n = 22;
            break;
          }
          _context40.n = 20;
          return refreshPromise;
        case 20:
          _context40.n = 21;
          return delay(220);
        case 21:
          showApprovalWaitScreen(state.currentPrize);
          return _context40.a(2);
        case 22:
          isNoMoneyWinningPrize = !unlucky && Number(((_state$boxes13 = state.boxes) === null || _state$boxes13 === void 0 || (_state$boxes13 = _state$boxes13[boxNumber]) === null || _state$boxes13 === void 0 ? void 0 : _state$boxes13.value) || 0) <= 0;
          if (!isNoMoneyWinningPrize) {
            _context40.n = 24;
            break;
          }
          _context40.n = 23;
          return refreshPromise;
        case 23:
          showToast('🎁 Quà trúng không có phần tiền, hệ thống tự động chuyển qua hộp tiếp theo.');
          return _context40.a(2);
        case 24:
          if (isVndCashPrize && ((_state$boxes$boxNumbe = state.boxes[boxNumber]) === null || _state$boxes$boxNumbe === void 0 ? void 0 : _state$boxes$boxNumbe.decision) === 'converted') {
            showToast('✅ Tiền thưởng VND đã tự động cộng vào ví.');
          }
          setupWinOverlay(boxNumber);
          openWinOverlay(boxNumber);
          _context40.n = 25;
          return refreshPromise;
        case 25:
          _context40.n = 32;
          break;
        case 26:
          _context40.p = 26;
          _t24 = _context40.v;
          msg = String((_t24 === null || _t24 === void 0 ? void 0 : _t24.message) || '');
          if (!/403|forbidden|khong duoc|không được|khong the|không thể/i.test(msg)) {
            _context40.n = 31;
            break;
          }
          _context40.p = 27;
          _context40.n = 28;
          return Promise.all([refreshBoxesFromServer(), loadPlayerInventory()]);
        case 28:
          _context40.n = 30;
          break;
        case 29:
          _context40.p = 29;
          _t25 = _context40.v;
        case 30:
          showToast('🔄 Trạng thái hộp vừa được cập nhật. Vui lòng thử mở lại hộp đang sáng.');
          _context40.n = 32;
          break;
        case 31:
          showToast("\u274C ".concat(_t24.message));
        case 32:
          _context40.p = 32;
          if (card) card.classList.remove('opening-shake');
          if (boxLayer) boxLayer.style.animation = '';
          if (lid) lid.style.animation = '';
          state.loadingOpen = false;
          return _context40.f(32);
        case 33:
          return _context40.a(2);
      }
    }, _callee40, null, [[27, 29], [13, 15], [9, 26, 32, 33], [1, 3]]);
  }));
  return _openBox.apply(this, arguments);
}
function nextAnimFrame() {
  return new Promise(function (resolve) {
    requestAnimationFrame(function () {
      return requestAnimationFrame(resolve);
    });
  });
}
function runOpenedCardRevealSequence(_x0) {
  return _runOpenedCardRevealSequence.apply(this, arguments);
}
function _runOpenedCardRevealSequence() {
  _runOpenedCardRevealSequence = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee41(boxNumber) {
    var options,
      _options$unlucky,
      unlucky,
      wrap,
      card,
      _args41 = arguments;
    return _regenerator().w(function (_context41) {
      while (1) switch (_context41.n) {
        case 0:
          options = _args41.length > 1 && _args41[1] !== undefined ? _args41[1] : {};
          _options$unlucky = options.unlucky, unlucky = _options$unlucky === void 0 ? false : _options$unlucky;
          wrap = document.querySelector(".box-wrap[data-box=\"".concat(Number(boxNumber || 0), "\"]"));
          card = wrap ? wrap.querySelector('.gcard.is-opened') : null;
          if (card) {
            _context41.n = 1;
            break;
          }
          return _context41.a(2);
        case 1:
          card.classList.remove('reveal-seq', 'reveal-shake', 'reveal-lid-open', 'reveal-prize', 'reveal-name', 'reveal-value', 'reveal-done');
          card.classList.add('reveal-seq');
          _context41.n = 2;
          return nextAnimFrame();
        case 2:
          card.classList.add('reveal-shake');
          _context41.n = 3;
          return delay(760);
        case 3:
          card.classList.remove('reveal-shake');
          card.classList.add('reveal-lid-open');
          _context41.n = 4;
          return delay(560);
        case 4:
          card.classList.add('reveal-prize');
          _context41.n = 5;
          return delay(460);
        case 5:
          card.classList.add('reveal-name');
          _context41.n = 6;
          return delay(unlucky ? 360 : 420);
        case 6:
          card.classList.add('reveal-value');
          _context41.n = 7;
          return delay(360);
        case 7:
          card.classList.add('reveal-done');
        case 8:
          return _context41.a(2);
      }
    }, _callee41);
  }));
  return _runOpenedCardRevealSequence.apply(this, arguments);
}
function closeWin() {
  return _closeWin.apply(this, arguments);
}
function _closeWin() {
  _closeWin = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee42() {
    var winOv, modal, boxNum, box, decision, waitingSpecialApproval, _t26;
    return _regenerator().w(function (_context42) {
      while (1) switch (_context42.p = _context42.n) {
        case 0:
          winOv = document.getElementById('winOv');
          if (winOv) winOv.classList.remove('open');
          stopWinOverlayRefresh();
          modal = document.querySelector('#winOv .wov-modal');
          if (modal) {
            modal.getAnimations().forEach(function (anim) {
              return anim.cancel();
            });
          }

          // For non-cash prizes, no extra decision is needed.
          // Allow opening the next box immediately without requiring page reload.
          boxNum = Number(state.currentWinBox || 0);
          box = state.boxes[boxNum];
          if (box) {
            _context42.n = 1;
            break;
          }
          return _context42.a(2);
        case 1:
          if (isPendingApprovedCashBox(box)) {
            showApprovedConversionReminderModal(boxNum, {
              force: true
            });
            scheduleApprovedConversionReminder(boxNum);
          }
          decision = String(box.decision || '').toLowerCase();
          waitingSpecialApproval = !!(box.isSpecial && !box.specialApproved && !['confirmed', 'converted', 'declined'].includes(decision));
          if (waitingSpecialApproval) {
            _context42.n = 6;
            break;
          }
          if (!(box.isSpecial && box.specialApproved)) {
            _context42.n = 5;
            break;
          }
          _context42.p = 2;
          _context42.n = 3;
          return Promise.all([refreshBoxesFromServer(), loadPlayerInventory()]);
        case 3:
          _context42.n = 5;
          break;
        case 4:
          _context42.p = 4;
          _t26 = _context42.v;
        case 5:
          activateNextBox();
        case 6:
          return _context42.a(2);
      }
    }, _callee42, null, [[2, 4]]);
  }));
  return _closeWin.apply(this, arguments);
}
function getBoxInventoryRecord(boxNumber) {
  var target = Number(boxNumber || 0);
  if (!target || !Array.isArray(state.inventoryItems)) return null;
  return state.inventoryItems.find(function (item) {
    return Number(item.box_number || item.boxNumber || 0) === target;
  }) || null;
}
function applyWinPreviewTone(_ref10) {
  var isVip = _ref10.isVip,
    isUnlucky = _ref10.isUnlucky,
    isPending = _ref10.isPending;
  var modal = document.querySelector('#winOv .wov-modal');
  if (!modal) return;
  modal.classList.remove('preview-vip', 'preview-unlucky', 'preview-pending');
  if (isVip) modal.classList.add('preview-vip');
  if (isUnlucky) modal.classList.add('preview-unlucky');
  if (isPending) modal.classList.add('preview-pending');
}
function getWinOverlaySourceRect(boxNumber) {
  var targetBox = Number(boxNumber || 0);
  if (!targetBox) return null;
  var wrap = document.querySelector(".box-wrap[data-box=\"".concat(targetBox, "\"]"));
  if (!wrap) return null;
  var sourceEl = wrap.querySelector('.img-shell img, .img-shell .emoji-fallback, .img-shell .cry-shell, .box-area .result-media-shell, .box-area .result-reward-layer, .box-area .result-reward-image, .box-area .result-reward-icon');
  if (!sourceEl) return null;
  var rect = sourceEl.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) return null;
  return rect;
}
function openWinOverlay(boxNumber) {
  var winOv = document.getElementById('winOv');
  var modal = document.querySelector('#winOv .wov-modal');
  if (!winOv || !modal) return;
  modal.getAnimations().forEach(function (anim) {
    return anim.cancel();
  });
  var sourceRect = getWinOverlaySourceRect(boxNumber);
  winOv.classList.add('open');
  startWinOverlayRefresh(boxNumber);
  if (!sourceRect) return;
  var modalRect = modal.getBoundingClientRect();
  if (!modalRect || modalRect.width <= 0 || modalRect.height <= 0) return;
  var sourceCenterX = sourceRect.left + sourceRect.width / 2;
  var sourceCenterY = sourceRect.top + sourceRect.height / 2;
  var modalCenterX = modalRect.left + modalRect.width / 2;
  var modalCenterY = modalRect.top + modalRect.height / 2;
  var dx = sourceCenterX - modalCenterX;
  var dy = sourceCenterY - modalCenterY;
  var rawScale = Math.min(sourceRect.width / modalRect.width, sourceRect.height / modalRect.height);
  var startScale = Math.max(0.16, Math.min(0.92, rawScale || 0.2));
  modal.animate([{
    transform: "translate(".concat(dx, "px, ").concat(dy, "px) scale(").concat(startScale, ")"),
    opacity: 0.16,
    filter: 'blur(3px)'
  }, {
    transform: 'translate(0, 0) scale(1.035)',
    opacity: 1,
    filter: 'blur(0)'
  }, {
    transform: 'translate(0, 0) scale(1)',
    opacity: 1,
    filter: 'blur(0)'
  }], {
    duration: 620,
    easing: 'cubic-bezier(.16,.9,.28,1)',
    fill: 'both'
  });
}
function stopWinOverlayRefresh() {
  if (!state.winOverlayRefreshTimer) return;
  clearTimeout(state.winOverlayRefreshTimer);
  state.winOverlayRefreshTimer = null;
}
function startWinOverlayRefresh(boxNumber) {
  stopWinOverlayRefresh();
  var targetBox = Number(boxNumber || 0);
  if (!targetBox) return;
  state.winOverlayRefreshTimer = setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var winOv, currentBox, current, currentDecision, currentStatus, shouldTrack, _t4;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          winOv = document.getElementById('winOv');
          if (!(!winOv || !winOv.classList.contains('open'))) {
            _context3.n = 1;
            break;
          }
          stopWinOverlayRefresh();
          return _context3.a(2);
        case 1:
          currentBox = Number(state.currentWinBox || targetBox || 0);
          current = state.boxes[currentBox] || {};
          currentDecision = String(current.decision || '').toLowerCase();
          currentStatus = String(current.processingStatus || current.status || '').toLowerCase();
          shouldTrack = !!current.isSpecial && !current.specialApproved || currentStatus === 'pending_approval' || currentStatus === 'exchanged' || currentDecision === 'exchanged';
          if (shouldTrack) {
            _context3.n = 2;
            break;
          }
          stopWinOverlayRefresh();
          return _context3.a(2);
        case 2:
          _context3.p = 2;
          _context3.n = 3;
          return Promise.all([refreshBoxesFromServer(), loadPlayerInventory()]);
        case 3:
          setupWinOverlay(currentBox);
          _context3.n = 5;
          break;
        case 4:
          _context3.p = 4;
          _t4 = _context3.v;
        case 5:
          state.winOverlayRefreshTimer = null;
        case 6:
          return _context3.a(2);
      }
    }, _callee3, null, [[2, 4]]);
  })), 1200);
}
function buildPreviewTimelineHtml(boxNumber, box) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$decision = options.decision,
    decision = _options$decision === void 0 ? '' : _options$decision,
    _options$isUnluckyBox = options.isUnluckyBox,
    isUnluckyBox = _options$isUnluckyBox === void 0 ? false : _options$isUnluckyBox,
    _options$isCash = options.isCash,
    isCash = _options$isCash === void 0 ? false : _options$isCash,
    _options$isSpecialApp = options.isSpecialApproved,
    isSpecialApproved = _options$isSpecialApp === void 0 ? false : _options$isSpecialApp,
    _options$currency = options.currency,
    currency = _options$currency === void 0 ? 'VND' : _options$currency,
    _options$amount = options.amount,
    amount = _options$amount === void 0 ? 0 : _options$amount;
  var inv = getBoxInventoryRecord(boxNumber);
  var openedAt = formatDateTime((inv === null || inv === void 0 ? void 0 : inv.createdAt) || (inv === null || inv === void 0 ? void 0 : inv.created_at) || null);
  var events = [];
  var _m = window.__manualTextMap || null;
  var _tx = function _tx(s) {
    return _m ? translateExactTextByMap(s, _m) || s : s;
  };
  events.push({
    cls: 'ok',
    text: "".concat(_tx('Phần thưởng'), " #").concat(Number(boxNumber || 0), " ").concat(_tx('đã được mở thành công') || 'đã được mở thành công'),
    time: openedAt !== '--' ? openedAt : _tx('Vừa xong')
  });
  if (isUnluckyBox) {
    events.push({
      cls: 'fail',
      text: _tx('Kết quả UNLUCKY - hộp quà không có phần thưởng khả dụng'),
      time: _tx('Kết quả tức thì') || 'Kết quả tức thì'
    });
  } else {
    var valueText = Number(amount || 0) > 0 ? formatCurrency(amount, currency) : _tx('Quà hiện vật') || 'Quà hiện vật';
    events.push({
      cls: 'ok',
      text: "".concat(_tx('Phần thưởng'), ": ").concat((box === null || box === void 0 ? void 0 : box.name) || _tx('Phần thưởng'), " \u2022 ").concat(valueText),
      time: _tx('Đã ghi nhận vào phiên')
    });
  }
  if (box !== null && box !== void 0 && box.isSpecial && !isSpecialApproved) {
    events.push({
      cls: 'pending',
      text: _tx('Đang chờ admin duyệt phần thưởng đặc biệt'),
      time: _tx('Đang chờ duyệt')
    });
  }
  if (decision === 'exchanged') {
    events.push({
      cls: 'pending',
      text: _tx('Yêu cầu quy đổi đã gửi, chờ CSKH xử lý'),
      time: _tx('Đang chờ duyệt')
    });
  } else if (decision === 'converted') {
    events.push({
      cls: 'ok',
      text: isCash ? _tx('Đã quy đổi và cộng vào ví thành công') : _tx('Đã xác nhận xử lý phần thưởng'),
      time: _tx('Hoàn tất')
    });
  } else if (decision === 'declined') {
    events.push({
      cls: 'fail',
      text: _tx('Người chơi đã từ chối quy đổi phần thưởng này'),
      time: _tx('Đã đóng xử lý')
    });
  }
  return events.map(function (evt) {
    return "\n    <div class=\"wpreview-event ".concat(evt.cls, "\">\n      <span class=\"dot\"></span>\n      <div class=\"txt\">").concat(esc(evt.text), "</div>\n      <div class=\"time\">").concat(esc(evt.time || '--'), "</div>\n    </div>\n  ");
  }).join('');
}
function shareCurrentPrizePreview() {
  var _state$boxes7, _navigator$clipboard;
  var boxNumber = Number(state.currentWinBox || 0);
  var box = ((_state$boxes7 = state.boxes) === null || _state$boxes7 === void 0 ? void 0 : _state$boxes7[boxNumber]) || {};
  if (!boxNumber || !box) {
    showToast('Không tìm thấy dữ liệu hộp quà để chia sẻ.');
    return;
  }
  var currency = box.currency || 'VND';
  var amount = Number(box.value || 0);
  var valueText = amount > 0 ? formatCurrency(amount, currency) : 'Quà hiện vật';
  var level = String(box.level || 'NORMAL').toUpperCase();
  var shareText = "Phi\xEAn ".concat(state.sessionCode || '', " | H\u1ED9p #").concat(boxNumber, "\nPh\u1EA7n th\u01B0\u1EDFng: ").concat(box.name || 'Phần thưởng', "\nGi\xE1 tr\u1ECB: ").concat(valueText, "\nM\u1EE9c \u0111\u1ED9: ").concat(level);
  if (navigator.share) {
    navigator.share({
      title: "K\u1EBFt qu\u1EA3 h\u1ED9p qu\xE0 #".concat(boxNumber),
      text: shareText
    }).catch(function () {});
    return;
  }
  if ((_navigator$clipboard = navigator.clipboard) !== null && _navigator$clipboard !== void 0 && _navigator$clipboard.writeText) {
    navigator.clipboard.writeText(shareText).then(function () {
      return showToast('Đã sao chép nội dung chia sẻ vào clipboard.');
    }).catch(function () {
      return showToast('Không thể sao chép nội dung chia sẻ.');
    });
    return;
  }
  showToast('Thiết bị không hỗ trợ chia sẻ nhanh.');
}
function downloadCurrentPrizeImage() {
  var _state$boxes8;
  var boxNumber = Number(state.currentWinBox || 0);
  var box = ((_state$boxes8 = state.boxes) === null || _state$boxes8 === void 0 ? void 0 : _state$boxes8[boxNumber]) || {};
  var imageUrl = String(box.image || '').trim();
  if (!imageUrl) {
    showToast('Phần quà này không có ảnh để tải.');
    return;
  }
  var filenameSafe = String(box.name || "box-".concat(boxNumber)).replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '_').slice(0, 60);
  var link = document.createElement('a');
  link.href = imageUrl;
  link.download = "".concat(filenameSafe || "box-".concat(boxNumber), ".jpg");
  link.target = '_blank';
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Populate the fullscreen win overlay for a given box
function setupWinOverlay(boxNumber) {
  state.currentWinBox = boxNumber;
  var box = state.boxes[boxNumber] || {};
  var hasPrizeImage = !!String(box.image || '').trim();
  var isCash = isCashPrizeLike(box);
  var isSpecialApproved = !!box.specialApproved;
  var isVip = box.level === 'VIP' || box.isSpecial;
  var statusLower = String(box.status || box.processingStatus || '').toLowerCase();
  var decision = String(box.decision || (statusLower === 'exchanged' ? 'exchanged' : '') || (statusLower === 'converted' ? 'converted' : '') || (statusLower === 'declined' ? 'declined' : '')).toLowerCase();
  var isUnluckyBox = box.state === 'opened-bad' || String(box.level || '').toUpperCase() === 'UNLUCKY';
  var currency = box.currency || 'VND';
  var amount = Number(box.value || 0);
  var valueText = amount > 0 ? formatCurrency(amount, currency) : 'Quà hiện vật';
  var approxRate = currency === 'USD' ? 26000 : currency === 'NDT' ? 3800 : 0;
  var approxVndText = amount > 0 && approxRate > 0 ? " (\u2248 ".concat(Math.round(amount * approxRate).toLocaleString('vi-VN'), " VND)") : '';
  var valueTextWithApprox = "".concat(valueText).concat(approxVndText);
  var statusText = isUnluckyBox ? 'Xui lỗi' : box.isSpecial && !isSpecialApproved ? 'Đang chờ admin duyệt' : getStatusText({
    level: box.level,
    decision: box.decision,
    status: box.status || (box.decision === 'exchanged' ? 'exchanged' : 'obtained')
  });
  var decisionText = decision === 'converted' ? 'Đã quy đổi' : decision === 'declined' ? 'Đã từ chối' : decision === 'exchanged' ? 'Đang chờ CSKH' : box.isSpecial && !isSpecialApproved ? 'Chờ duyệt' : 'Chưa xử lý';
  var processingStatusLabels = {
    obtained: {
      label: 'Chờ xử lý',
      cls: 'wstatus-pending'
    },
    pending_approval: {
      label: 'Đang xử lý',
      cls: 'wstatus-pending'
    },
    confirmed: {
      label: 'Đã xác nhận',
      cls: 'wstatus-confirmed'
    },
    converted: {
      label: 'Đã quy đổi',
      cls: 'wstatus-done'
    },
    declined: {
      label: 'Đã từ chối',
      cls: 'wstatus-declined'
    },
    rejected: {
      label: 'Bị từ chối',
      cls: 'wstatus-declined'
    },
    claimed: {
      label: 'Đã nhận thưởng',
      cls: 'wstatus-done'
    },
    exchanged: {
      label: 'Đang chờ CSKH',
      cls: 'wstatus-pending'
    },
    banned: {
      label: 'Bị khóa',
      cls: 'wstatus-declined'
    }
  };
  var rawProcStatus = String(box.processingStatus || '').toLowerCase();
  var procInfo = processingStatusLabels[rawProcStatus] || processingStatusLabels.obtained;
  var procLabel = procInfo.label;
  var procCls = procInfo.cls;
  applyWinPreviewTone({
    isVip: isVip,
    isUnlucky: isUnluckyBox,
    isPending: !!(box.isSpecial && !isSpecialApproved)
  });
  var sessEl = document.getElementById('wSessionCode');
  if (sessEl) sessEl.textContent = state.sessionCode || '';
  var iconEl = document.getElementById('wPrizeIcon');
  if (iconEl) {
    iconEl.innerHTML = renderPrizeVisualHtml(hasPrizeImage ? box.image : '', box.icon || '🎁', 'wprize-img', box.name || 'Phần thưởng');
    iconEl.style.display = '';
  }
  var wCardEl = document.querySelector('.wcard');
  if (wCardEl) {
    if (hasPrizeImage) {
      wCardEl.classList.add('has-prize-bg');
      wCardEl.style.setProperty('--wcard-prize-bg', "url(\"".concat(String(box.image).replace(/"/g, '\\"'), "\")"));
    } else {
      wCardEl.classList.remove('has-prize-bg');
      wCardEl.style.removeProperty('--wcard-prize-bg');
    }
  }
  var nameEl = document.getElementById('wPrizeName');
  if (nameEl) nameEl.textContent = box.name || 'Phần thưởng';
  var categEl = document.getElementById('wPrizeCategory');
  if (categEl) {
    categEl.textContent = box.category || '';
    categEl.style.display = box.category ? '' : 'none';
  }
  var tagsEl = document.getElementById('wPreviewTags');
  if (tagsEl) {
    var tags = [];
    tags.push("<span class=\"wpreview-tag".concat(isVip ? ' accent' : '', "\">").concat(esc(String(box.level || (isUnluckyBox ? 'UNLUCKY' : 'NORMAL')).toUpperCase()), "</span>"));
    tags.push("<span class=\"wpreview-tag\">".concat(isCash ? 'Tiền mặt' : 'Hiện vật', "</span>"));
    tags.push("<span class=\"wpreview-tag\">".concat(esc(currency), "</span>"));
    if (box.isSpecial) tags.push('<span class="wpreview-tag accent">Special</span>');
    tagsEl.innerHTML = tags.join('');
  }
  var metaEl = document.getElementById('wPreviewMeta');
  if (metaEl) {
    metaEl.innerHTML = "\n      <div class=\"wmeta-item\"><span class=\"lbl\">H\u1ED9p qu\xE0</span><span class=\"val\">#".concat(Number(boxNumber || 0), "</span></div>\n      <div class=\"wmeta-item\"><span class=\"lbl\">Gi\xE1 tr\u1ECB</span><span class=\"val\">").concat(esc(valueTextWithApprox), "</span></div>\n      <div class=\"wmeta-item\"><span class=\"lbl\">Tr\u1EA1ng th\xE1i</span><span class=\"val\"><span class=\"wstatus-badge ").concat(procCls, "\">").concat(esc(procLabel), "</span></span></div>\n      <div class=\"wmeta-item\"><span class=\"lbl\">Quy\u1EBFt \u0111\u1ECBnh</span><span class=\"val\">").concat(esc(decisionText), "</span></div>\n    ");
  }
  var timelineEl = document.getElementById('wPreviewTimeline');
  if (timelineEl) {
    timelineEl.innerHTML = buildPreviewTimelineHtml(boxNumber, box, {
      decision: decision,
      isUnluckyBox: isUnluckyBox,
      isCash: isCash,
      isSpecialApproved: isSpecialApproved,
      currency: currency,
      amount: amount
    });
  }
  var levelEl = document.getElementById('wLevelBadge');
  if (levelEl) {
    if (isUnluckyBox) {
      levelEl.className = 'wlevel unlucky';
      levelEl.textContent = state.gameSettings.losePopupTitle || '😢 Chúc bạn may mắn lần sau!';
    } else if (isVip) {
      levelEl.className = 'wlevel vip';
      levelEl.textContent = state.gameSettings.winPopupTitle || '👑 GIẢI THƯỞNG VIP!';
    } else {
      levelEl.className = 'wlevel lucky';
      levelEl.textContent = state.gameSettings.winPopupTitle || '🎁 GIẢI THƯỞNG MAY MẮN!';
    }
  }
  var actionEl = document.getElementById('wActionBox');
  if (actionEl) {
    actionEl.className = '';
    var _m = window.__manualTextMap || null;
    var _tx = function _tx(s) {
      return _m ? translateExactTextByMap(s, _m) || s : s;
    };
    var isNonCashSpecialApproved = !!(box.isSpecial && isSpecialApproved && !isCash);
    var showCskhBtn = !isUnluckyBox;
    var viewImageBtn = hasPrizeImage ? "<button class=\"wab-view-image-btn\" type=\"button\" onclick=\"viewPrizeImage(".concat(boxNumber, ")\">\uD83D\uDDBC\uFE0F ").concat(_tx('🖼️ Xem kỹ hình ảnh').replace('🖼️ ', '') || 'Xem kỹ hình ảnh', "</button>") : '';
    var cskhLabel = _tx('Nhắn CSKH');
    var cskhBtn = showCskhBtn ? "<button class=\"wab-cskh-btn\" onclick=\"openChatWithPrizeInfo(".concat(boxNumber, ")\"><i class=\"wab-cskh-icon\">\uD83D\uDCAC</i> ").concat(cskhLabel, "</button>") : '';
    if (isUnluckyBox) {
      actionEl.innerHTML = "<div class=\"wab-declined\">\uD83D\uDE14 ".concat(_tx('😔 Chúc bạn may mắn lần sau!').replace('😔 ', '') || 'Chúc bạn may mắn lần sau!', "</div>");
    } else if (box.isSpecial && !isSpecialApproved) {
      // Special prize pending approval
      actionEl.innerHTML = "<div class=\"wab-cskh\"><div class=\"wab-cskh-title\">\u2B50 ".concat(_tx('⭐ Phần thưởng đặc biệt!').replace('⭐ ', '') || 'Phần thưởng đặc biệt!', "</div><div class=\"wab-cskh-body\">").concat(_tx('Quà của bạn đang được admin xem xét và duyệt.') || 'Quà của bạn đang được admin xem xét và duyệt.', "</div><div class=\"wab-cskh-body\">").concat(_tx('Vui lòng không tắt trang và chờ thông báo.') || 'Vui lòng không tắt trang và chờ thông báo.', "</div></div>").concat(cskhBtn);
    } else if (isCash) {
      // Cash prize: show convert/decline buttons with currency awareness
      var currencySymbol = currency === 'USD' ? '$' : currency === 'NDT' ? '¥' : '';
      var amtStr = Number(box.value || 0).toLocaleString('vi-VN');
      var displayAmt = currency !== 'VND' ? "".concat(currencySymbol).concat(amtStr, " ").concat(currency) : "".concat(amtStr, " VN\u0110");
      var isAutoVndConverted = currency === 'VND' && decision === 'converted';
      if (isAutoVndConverted) {
        actionEl.innerHTML = "<div class=\"wab-converted\" style=\"margin-bottom:10px\">\u2705 ".concat(_tx('Đã quy đổi và cộng vào ví thành công') || 'Đã tự động cộng ' + displayAmt + ' vào ví', "</div>").concat(viewImageBtn).concat(cskhBtn);
        if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
        return;
      }
      var isExchanged = decision === 'exchanged';
      var convertedHint = decision === 'converted' && currency === 'VND' ? "<div class=\"wab-converted\" style=\"margin-bottom:10px\">\u2705 ".concat(_tx('Đã quy đổi và cộng vào ví thành công') || 'Đã quy đổi ' + displayAmt + ' vào ví', "</div>") : '';
      var pendingHint = isExchanged ? "<div class=\"wab-cskh wab-cskh-pending\" style=\"margin-bottom:10px\"><div class=\"wab-cskh-title\">\u23F3 ".concat(_tx('Yêu cầu quy đổi đã gửi, chờ CSKH xử lý') || 'Yêu cầu quy đổi ' + displayAmt + ' đang chờ CSKH xử lý', "</div><div class=\"wab-cskh-body\">").concat(_tx('Vui lòng liên hệ CSKH để hoàn tất quy đổi.') || 'Vui lòng liên hệ CSKH để hoàn tất.', "</div></div>") : '';
      var declinedHint = decision === 'declined' ? "<div class=\"wab-declined\" style=\"margin-bottom:10px\">\u2715 ".concat(_tx('Đã đóng xử lý') || 'Đã từ chối quy đổi', "</div>") : '';
      var isConverted = decision === 'converted';
      var isDeclined = decision === 'declined';
      var declineForbidden = currency === 'NDT';
      var disabled = isConverted || isDeclined || isExchanged;
      var btnLabel = isConverted ? _tx('✅ Đã quy đổi') : isExchanged ? _tx('⏳ Đang chờ duyệt') : isDeclined ? _tx('✕ Đã từ chối') : _tx('💱 Quy đổi ngay');
      var declineLabel = _tx('Từ chối');
      var cashTitle = _tx('💰 Quy đổi tiền mặt');
      var rateLabel = currency !== 'VND' ? "<div class=\"wab-cash-rate\" style=\"font-size:0.85em;color:#888;margin-top:2px\">".concat(_tx('Tỷ giá') || 'Tỷ giá', ": 1 ").concat(currency, " = ").concat((currency === 'USD' ? 26000 : 3800).toLocaleString('vi-VN'), " VND</div>") : '';
      actionEl.innerHTML = "<div class=\"wab-cash\">".concat(convertedHint).concat(pendingHint).concat(declinedHint, "<div class=\"wab-cash-title\">").concat(cashTitle, "</div><div class=\"wab-cash-amt\">").concat(displayAmt, "</div>").concat(rateLabel).concat(declineForbidden ? '<div class="wab-cash-rate" style="font-size:0.85em;color:#f59e0b;margin-top:6px"> </div>' : '', "<div class=\"wab-cash-btns\"><button class=\"wab-btn-convert\" onclick=\"winConvertNow()\" ").concat(disabled ? 'disabled' : '', ">").concat(btnLabel, "</button><button class=\"wab-btn-decline\" onclick=\"winDeclineNow()\" ").concat(disabled || declineForbidden ? 'disabled' : '', ">").concat(declineLabel, "</button></div></div>").concat(viewImageBtn).concat(cskhBtn);
    } else {
      // Non-cash prize (including approved special non-cash)
      var congratsMsg = _tx('Chúc mừng Quý khách đã đạt được giải thưởng');
      var cskhInstr = _tx('Vui lòng liên hệ bộ phận CSKH để nhận thưởng.');
      actionEl.innerHTML = "<div class=\"wab-cskh\"><div class=\"wab-cskh-title\">\u2705 ".concat(congratsMsg, " ").concat(esc(box.name || _tx('Phần thưởng')), ".</div><div class=\"wab-cskh-body\">").concat(cskhInstr, "</div></div>").concat(viewImageBtn).concat(cskhBtn);
    }
  }
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}
function viewPrizeImage(boxNumber) {
  var _state$boxes9;
  var box = ((_state$boxes9 = state.boxes) === null || _state$boxes9 === void 0 ? void 0 : _state$boxes9[boxNumber]) || {};
  var imageUrl = String(box.image || '').trim();
  if (!imageUrl) {
    showToast('Không có ảnh chi tiết cho phần thưởng này.');
    return;
  }
  var lb = document.getElementById('wovLightbox');
  var img = document.getElementById('wovLbImg');
  if (!lb || !img) return;
  img.src = imageUrl;
  img.alt = box.name || 'Phần thưởng';
  lb.classList.add('open');
}
function closePrizeLightbox(e) {
  if (e && e.target !== e.currentTarget) return;
  var lb = document.getElementById('wovLightbox');
  if (lb) lb.classList.remove('open');
}
function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function renderPrizeVisualHtml(imageUrl) {
  var icon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '🎁';
  var imgClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var alt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Phần thưởng';
  var safeAlt = esc(alt || 'Phần thưởng');
  var raw = normalizePrizeImageUrl(imageUrl);
  var safeIcon = esc(icon || '🎁');
  if (raw) {
    var safeUrl = esc(raw);
    var cls = imgClass ? " class=\"".concat(imgClass, "\"") : '';
    return "<img".concat(cls, " src=\"").concat(safeUrl, "\" alt=\"").concat(safeAlt, "\" loading=\"lazy\" decoding=\"async\" onerror=\"this.onerror=null;this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='inline-flex';}\"><span class=\"result-reward-icon result-reward-icon-prize\" style=\"display:none\">").concat(safeIcon, "</span>");
  }
  return "<span class=\"result-reward-icon result-reward-icon-prize\">".concat(safeIcon, "</span>");
}
function captureResult() {
  var _state$boxes0;
  var boxNumber = Number(state.currentWinBox || 0);
  var box = ((_state$boxes0 = state.boxes) === null || _state$boxes0 === void 0 ? void 0 : _state$boxes0[boxNumber]) || {};
  if (!boxNumber) {
    showToast('Không có dữ liệu để chụp ảnh kết quả.');
    return;
  }
  var canvas = document.createElement('canvas');
  var w = 1080;
  var h = 1620;
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d');
  if (!ctx) {
    showToast('Thiết bị không hỗ trợ tạo ảnh kết quả.');
    return;
  }
  var currency = box.currency || 'VND';
  var amount = Number(box.value || 0);
  var valueText = amount > 0 ? formatCurrency(amount, currency) : 'Quà hiện vật';
  var statusText = getStatusText({
    level: box.level,
    decision: box.decision,
    status: box.status || 'obtained'
  });
  var sessionCode = state.sessionCode || '--';
  var drawRoundedRect = function drawRoundedRect(x, y, width, height, radius, fillStyle) {
    var r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };
  var loadImageForCanvas = function loadImageForCanvas(src) {
    return new Promise(function (resolve) {
      var raw = normalizePrizeImageUrl(src);
      if (!raw) return resolve(null);
      var img = new Image();
      img.crossOrigin = 'anonymous';
      var done = function done(ok) {
        return resolve(ok ? img : null);
      };
      img.onload = function () {
        return done(true);
      };
      img.onerror = function () {
        return done(false);
      };
      img.src = raw;
      setTimeout(function () {
        return done(false);
      }, 5000);
    });
  };

  // Background
  var bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(1, '#111827');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Decorative glow
  var glow = ctx.createRadialGradient(w * 0.9, h * 0.12, 20, w * 0.9, h * 0.12, 420);
  glow.addColorStop(0, 'rgba(59,130,246,0.22)');
  glow.addColorStop(1, 'rgba(59,130,246,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  drawRoundedRect(64, 64, w - 128, h - 128, 38, 'rgba(17,24,39,0.88)');
  ctx.fillStyle = '#93c5fd';
  ctx.font = '700 36px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.fillText('KET QUA MO HOP QUA', 108, 156);
  ctx.fillStyle = '#e5e7eb';
  ctx.font = '800 54px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.fillText("#".concat(boxNumber, " ").concat(String(box.name || 'Phan thuong')), 108, 228);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 30px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.fillText("Ma phien: ".concat(sessionCode), 108, 284);
  drawRoundedRect(96, 330, w - 192, 640, 30, 'rgba(30,41,59,0.72)');
  var prizeImageUrl = String(box.image || '').trim();
  loadImageForCanvas(prizeImageUrl).then(function (img) {
    if (img) {
      var cardX = 126;
      var cardY = 360;
      var cardW = w - 252;
      var cardH = 580;
      drawRoundedRect(cardX, cardY, cardW, cardH, 22, '#0b1220');
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cardX + 22, cardY);
      ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, 22);
      ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, 22);
      ctx.arcTo(cardX, cardY + cardH, cardX, cardY, 22);
      ctx.arcTo(cardX, cardY, cardX + cardW, cardY, 22);
      ctx.closePath();
      ctx.clip();
      var scale = Math.max(cardW / img.width, cardH / img.height);
      var dw = img.width * scale;
      var dh = img.height * scale;
      var dx = cardX + (cardW - dw) / 2;
      var dy = cardY + (cardH - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    } else {
      drawRoundedRect(126, 360, w - 252, 580, 22, 'rgba(51,65,85,0.72)');
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '700 44px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillText('KHONG CO ANH PHAN QUA', 210, 660);
    }
    drawRoundedRect(96, 1004, w - 192, 238, 24, 'rgba(15,23,42,0.92)');
    ctx.fillStyle = '#a5b4fc';
    ctx.font = '700 30px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText("Gia tri: ".concat(valueText), 132, 1068);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 30px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText("Trang thai: ".concat(statusText), 132, 1128);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 26px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText("Thoi gian: ".concat(new Date().toLocaleString('vi-VN')), 132, 1188);
    ctx.fillStyle = 'rgba(148,163,184,0.9)';
    ctx.font = '600 22px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText('Giftbox Game • Ket qua minh bach', 108, h - 86);
    var safeName = String(box.name || "hop-".concat(boxNumber)).replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '_').slice(0, 60);
    var filename = "ket-qua-".concat(safeName || "hop-".concat(boxNumber), ".png");
    var triggerDownload = function triggerDownload(blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () {
        return URL.revokeObjectURL(url);
      }, 1000);
      showToast('📷 Đã chụp và tải ảnh kết quả.');
    };
    if (canvas.toBlob) {
      canvas.toBlob(function (blob) {
        if (!blob) {
          showToast('Không thể tạo ảnh kết quả. Vui lòng thử lại.');
          return;
        }
        triggerDownload(blob);
      }, 'image/png', 0.95);
      return;
    }
    try {
      var dataUrl = canvas.toDataURL('image/png');
      var a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('📷 Đã chụp và tải ảnh kết quả.');
    } catch (_) {
      showToast('Không thể tạo ảnh kết quả. Vui lòng thử lại.');
    }
  });
}
function activateNextBox() {
  if (updateGameLockByApprovedPendingCash()) {
    renderBoxes();
    return;
  }
  var nextBox = state.openOrder.find(function (n) {
    return state.boxes[n].state === 'inactive';
  });
  if (nextBox) {
    state.boxes[nextBox].state = 'active';
    renderBoxes();
  }
}
function openNextAvailableBox() {
  if (updateGameLockByApprovedPendingCash()) {
    var pendingBox = getPendingApprovedCashBoxNumber();
    showToast("\u23F3 ".concat(getGameLockNoticeText(), "."));
    if (pendingBox) showApprovedConversionReminderModal(pendingBox, {
      force: true
    });
    return;
  }
  if (state.loadingOpen) return;
  var nextActive = state.openOrder.find(function (n) {
    return state.boxes[n].state === 'active';
  });
  if (!nextActive) {
    showToast('ℹ️ Hiện chưa có hộp sẵn sàng để mở.', {
      type: 'info',
      duration: 2600
    });
    return;
  }
  closeWin();
  setTimeout(function () {
    openBox(nextActive).catch(function () {});
  }, 120);
}

// "Quy đổi ngay" — instant convert for VND, or pending for USD/NDT
function winConvertNow() {
  return _winConvertNow.apply(this, arguments);
} // "Từ chối" — decline cash convert, allow opening next box (do NOT lock game)
function _winConvertNow() {
  _winConvertNow = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee44() {
    var box, boxData, currency, _m, _tx, actionEl, _result, result, currencySymbol, amtStr, _state$boxes$box, val, fmtAmt, _t27;
    return _regenerator().w(function (_context44) {
      while (1) switch (_context44.p = _context44.n) {
        case 0:
          box = Number(state.currentWinBox || 0);
          if (box) {
            _context44.n = 1;
            break;
          }
          return _context44.a(2);
        case 1:
          boxData = state.boxes[box] || {};
          currency = boxData.currency || 'VND';
          _m = window.__manualTextMap || null;
          _tx = function _tx(s) {
            return _m ? translateExactTextByMap(s, _m) || s : s;
          }; // Update action box to show loading state
          actionEl = document.getElementById('wActionBox');
          if (actionEl) actionEl.innerHTML = "<div class=\"wab-converted\">".concat(_tx('⏳ Đang quy đổi...'), "</div>");
          _context44.p = 2;
          _context44.n = 3;
          return withLoadingOverlay('Đang quy đổi phần thưởng...', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee43() {
            return _regenerator().w(function (_context43) {
              while (1) switch (_context43.n) {
                case 0:
                  _context43.n = 1;
                  return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/convert"), {
                    method: 'POST',
                    body: JSON.stringify({
                      boxNumber: box,
                      instant: true
                    })
                  });
                case 1:
                  result = _context43.v;
                case 2:
                  return _context43.a(2);
              }
            }, _callee43);
          })));
        case 3:
          if (!((_result = result) !== null && _result !== void 0 && _result.pendingApproval)) {
            _context44.n = 5;
            break;
          }
          // USD/NDT: pending CSKH approval — lock remaining boxes until approved.
          if (state.boxes[box]) {
            state.boxes[box].decision = 'exchanged';
            state.boxes[box].status = 'exchanged';
            state.boxes[box].processingStatus = 'exchanged';
          }
          stopApprovedConversionReminder(box);
          currencySymbol = currency === 'USD' ? '$' : '¥';
          amtStr = Number(boxData.value || 0).toLocaleString('vi-VN');
          if (actionEl) actionEl.innerHTML = "<div class=\"wab-cskh wab-cskh-pending\"><div class=\"wab-cskh-title\">\u23F3 ".concat(_tx('Yêu cầu quy đổi đã gửi, chờ CSKH xử lý') || 'Yêu cầu quy đổi ' + currencySymbol + amtStr + ' ' + currency + ' đã được gửi', "</div><div class=\"wab-cskh-body\">").concat(_tx('Vui lòng liên hệ CSKH để hoàn tất quy đổi.') || 'Vui lòng liên hệ CSKH để hoàn tất quy đổi.', "</div></div><button class=\"wab-cskh-btn\" onclick=\"openChatWithPrizeInfo(").concat(box, ")\"><i class=\"wab-cskh-icon\">\uD83D\uDCAC</i> ").concat(_tx('Liên hệ CSKH ngay'), "</button>");
          invalidateSessionEconomyBurstCache(state.sessionCode);
          _context44.n = 4;
          return Promise.all([refreshBoxesFromServer(), loadPlayerInventory(), refreshWallet()]);
        case 4:
          renderBoxes();
          showToast("\u23F3 ".concat(_tx('Yêu cầu quy đổi đã gửi, chờ CSKH xử lý') || 'Yêu cầu quy đổi đã gửi. Vui lòng liên hệ CSKH!'));
          _context44.n = 7;
          break;
        case 5:
          // Instant convert — allow next box
          if (state.boxes[box]) state.boxes[box].decision = 'converted';
          stopApprovedConversionReminder(box);
          val = Number(((_state$boxes$box = state.boxes[box]) === null || _state$boxes$box === void 0 ? void 0 : _state$boxes$box.value) || 0);
          fmtAmt = currency !== 'VND' ? "".concat(currency === 'USD' ? '$' : '¥').concat(val.toLocaleString('vi-VN'), " ").concat(currency) : "".concat(val.toLocaleString('vi-VN'), " VN\u0110");
          if (actionEl) actionEl.innerHTML = "<div class=\"wab-converted\">\u2705 ".concat(_tx('Đã quy đổi và cộng vào ví thành công') || 'Đã quy đổi ' + fmtAmt + ' vào ví', "</div>");
          invalidateSessionEconomyBurstCache(state.sessionCode);
          _context44.n = 6;
          return Promise.all([refreshBoxesFromServer(), loadPlayerInventory(), refreshWallet()]);
        case 6:
          activateNextBox();
          showToast("\u2705 ".concat(_tx('Đã quy đổi thành tiền trong ví!')));
        case 7:
          _context44.n = 9;
          break;
        case 8:
          _context44.p = 8;
          _t27 = _context44.v;
          setupWinOverlay(box);
          showToast("\u274C ".concat(_t27.message));
        case 9:
          return _context44.a(2);
      }
    }, _callee44, null, [[2, 8]]);
  }));
  return _winConvertNow.apply(this, arguments);
}
function winDeclineNow() {
  return _winDeclineNow.apply(this, arguments);
} // Reopen win overlay for an already-opened box (from eye icon)
function _winDeclineNow() {
  _winDeclineNow = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee45() {
    var box, boxData, currency, _m, _tx, actionEl, _t28;
    return _regenerator().w(function (_context45) {
      while (1) switch (_context45.p = _context45.n) {
        case 0:
          box = Number(state.currentWinBox || 0);
          if (box) {
            _context45.n = 1;
            break;
          }
          return _context45.a(2);
        case 1:
          boxData = state.boxes[box] || {};
          currency = boxData.currency || 'VND';
          _m = window.__manualTextMap || null;
          _tx = function _tx(s) {
            return _m ? translateExactTextByMap(s, _m) || s : s;
          };
          if (!(currency === 'NDT')) {
            _context45.n = 2;
            break;
          }
          showToast('❌ NDT bắt buộc gửi admin duyệt, không thể từ chối trực tiếp.');
          return _context45.a(2);
        case 2:
          // Update overlay to show pending decline state
          actionEl = document.getElementById('wActionBox');
          if (actionEl) actionEl.innerHTML = "<div class=\"wab-declined\">".concat(_tx('⏳ Đang ghi nhận từ chối...'), "</div>");
          _context45.p = 3;
          _context45.n = 4;
          return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/convert"), {
            method: 'POST',
            body: JSON.stringify({
              boxNumber: box,
              decline: true
            })
          });
        case 4:
          if (state.boxes[box]) state.boxes[box].decision = 'declined';
          stopApprovedConversionReminder(box);
          if (actionEl) actionEl.innerHTML = "<div class=\"wab-declined\">".concat(_tx('× Đã từ chối quy đổi tiền mặt'), "</div>");
          _context45.n = 5;
          return Promise.all([refreshBoxesFromServer(), loadPlayerInventory(), refreshTransactions()]);
        case 5:
          activateNextBox();
          setTimeout(function () {
            closeWin();
          }, 500);
          _context45.n = 7;
          break;
        case 6:
          _context45.p = 6;
          _t28 = _context45.v;
          setupWinOverlay(box);
          showToast("\u274C ".concat(_t28.message));
        case 7:
          return _context45.a(2);
      }
    }, _callee45, null, [[3, 6]]);
  }));
  return _winDeclineNow.apply(this, arguments);
}
function reopenWinOptions(boxNumber) {
  if (!state.gameSettings.allowReopenPopup) return;
  if (!state.boxes[boxNumber] || state.boxes[boxNumber].state === 'inactive') return;
  if (state.boxes[boxNumber].state === 'opened-bad') {
    showToast('😔 Chúc bạn may mắn lần sau!');
    return;
  }
  setupWinOverlay(boxNumber);
  openWinOverlay(boxNumber);
}

// ===== Approval Waiting Screen =====

var APPROVAL_AI_REMINDERS = ['Mình đang theo dõi trạng thái duyệt cho bạn theo thời gian thực.', 'Bạn cứ giữ màn hình này, khi admin duyệt mình sẽ báo ngay lập tức.', 'Nếu mạng chậm, hệ thống vẫn tự đồng bộ lại để không bỏ lỡ kết quả.', 'Trong lúc chờ, bạn không cần thao tác gì thêm, mình đang hỗ trợ bạn.'];
var APPROVAL_PROGRESS_STAGES = ['Đang gửi yêu cầu...', 'Đang chờ duyệt...', 'Sắp xong...'];
function scheduleApprovalUiFrame(task) {
  if (typeof task !== 'function') return;
  if (state.approvalUiRafId) {
    cancelAnimationFrame(state.approvalUiRafId);
  }
  state.approvalUiRafId = requestAnimationFrame(function () {
    state.approvalUiRafId = 0;
    task();
  });
}
function clearApprovalStageTimers() {
  if (state.approvalStageTimerId) {
    clearTimeout(state.approvalStageTimerId);
    state.approvalStageTimerId = null;
  }
  if (state.approvalLongWaitHintTimerId) {
    clearTimeout(state.approvalLongWaitHintTimerId);
    state.approvalLongWaitHintTimerId = null;
  }
}
function startApprovalProgressiveStatus() {
  clearApprovalStageTimers();
  var titleEl = document.getElementById('awTitle');
  if (!titleEl) return;
  var stages = APPROVAL_PROGRESS_STAGES.map(function (text) {
    return window.__manualTextMap ? translateExactTextByMap(text, window.__manualTextMap) : text;
  });
  var idx = 0;
  var _applyStage = function applyStage() {
    if (!isApprovalScreenVisible()) return;
    titleEl.textContent = stages[Math.min(idx, stages.length - 1)] || 'Đang chờ phê duyệt...';
    if (idx < stages.length - 1) {
      idx += 1;
      state.approvalStageTimerId = setTimeout(_applyStage, 1300);
    }
  };
  _applyStage();
  state.approvalLongWaitHintTimerId = setTimeout(function () {
    if (!isApprovalScreenVisible()) return;
    var noteEl = document.getElementById('awNote');
    if (noteEl) {
      noteEl.textContent = contentTextGlobal('approvalLongWaitHint', 'Đang xử lý, vui lòng chờ...');
    }
  }, 5000);
}
function prewarmResultOverlayShell() {
  var winOv = document.getElementById('winOv');
  if (!winOv || winOv.dataset.prewarmed === '1') return;
  winOv.dataset.prewarmed = '1';
  var modal = winOv.querySelector('.wov-modal');
  if (modal) modal.style.willChange = 'transform, opacity';
  var actionBox = document.getElementById('wActionBox');
  if (actionBox && !actionBox.dataset.prepared) {
    actionBox.dataset.prepared = '1';
    var placeholder = document.createElement('div');
    placeholder.className = 'wab-pending';
    placeholder.style.display = 'none';
    actionBox.appendChild(placeholder);
  }
}
function showApprovalScreenSmooth(screen) {
  if (!screen) return;
  if (screen.classList.contains('is-visible')) return;
  screen.style.display = 'flex';
  scheduleApprovalUiFrame(function () {
    screen.classList.remove('is-hiding');
    screen.classList.add('is-visible');
  });
}
function hideApprovalScreenSmooth(screen) {
  if (!screen) return;
  if (!screen.classList.contains('is-visible')) {
    screen.style.display = 'none';
    return;
  }
  screen.classList.remove('is-visible');
  screen.classList.add('is-hiding');
  setTimeout(function () {
    screen.classList.remove('is-hiding');
    screen.style.display = 'none';
  }, 160);
}
function clearApprovalTypingEffect() {
  if (state.approvalTypingIntervalId) {
    clearInterval(state.approvalTypingIntervalId);
    state.approvalTypingIntervalId = null;
  }
  if (state.approvalTypingCursorTimeoutId) {
    clearTimeout(state.approvalTypingCursorTimeoutId);
    state.approvalTypingCursorTimeoutId = null;
  }
}
function typeApprovalReminderText(message) {
  var reminderEl = document.getElementById('awRobotReminder');
  if (!reminderEl) return;
  clearApprovalTypingEffect();
  reminderEl.classList.add('typing-active');
  reminderEl.textContent = '';
  var text = String(message || '');
  if (!text) {
    reminderEl.classList.remove('typing-active');
    return;
  }
  var idx = 0;
  state.approvalTypingIntervalId = setInterval(function () {
    idx += 1;
    reminderEl.textContent = text.slice(0, idx);
    if (idx >= text.length) {
      clearApprovalTypingEffect();
      state.approvalTypingCursorTimeoutId = setTimeout(function () {
        reminderEl.classList.remove('typing-active');
      }, 550);
    }
  }, 40);
}
function updateApprovalRobotReminder(forceStep) {
  var reminderEl = document.getElementById('awRobotReminder');
  if (!reminderEl) return;
  if (typeof forceStep === 'number') state.approvalReminderIndex = forceStep;
  var idx = state.approvalReminderIndex % APPROVAL_AI_REMINDERS.length;
  var rawText = APPROVAL_AI_REMINDERS[idx];
  var text = window.__manualTextMap ? translateExactTextByMap(rawText, window.__manualTextMap) : rawText;
  typeApprovalReminderText(text);
}
function startApprovalRobotReminderLoop() {
  if (state.approvalReminderIntervalId) {
    clearInterval(state.approvalReminderIntervalId);
    state.approvalReminderIntervalId = null;
  }
  clearApprovalTypingEffect();
  state.approvalReminderIndex = 0;
  updateApprovalRobotReminder(0);
  state.approvalReminderIntervalId = setInterval(function () {
    state.approvalReminderIndex += 1;
    updateApprovalRobotReminder();
  }, 8000);
}
function startApprovalSupportBlinkLoop() {
  if (state.approvalSupportBlinkIntervalId) {
    clearInterval(state.approvalSupportBlinkIntervalId);
    state.approvalSupportBlinkIntervalId = null;
  }
  var supportBtn = document.getElementById('awSupportButton');
  if (!supportBtn) return;
  var visible = true;
  supportBtn.style.visibility = 'visible';
  state.approvalSupportBlinkIntervalId = setInterval(function () {
    var screen = document.getElementById('approvalWaitScreen');
    if (!screen || screen.style.display === 'none' || screen.classList.contains('timeout-state')) {
      return;
    }
    visible = !visible;
    supportBtn.style.visibility = visible ? 'visible' : 'hidden';
  }, 5000);
}
function stopApprovalSupportBlinkLoop() {
  if (state.approvalSupportBlinkIntervalId) {
    clearInterval(state.approvalSupportBlinkIntervalId);
    state.approvalSupportBlinkIntervalId = null;
  }
  var supportBtn = document.getElementById('awSupportButton');
  if (supportBtn) supportBtn.style.visibility = 'visible';
}
function showApprovalWaitScreen(_x1) {
  return _showApprovalWaitScreen.apply(this, arguments);
}
function _showApprovalWaitScreen() {
  _showApprovalWaitScreen = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee46(prize) {
    var _state$currentPrize4;
    var screen, cardEl, sessBadgeEl, iconEl, nameEl, titleEl, messagesEl, line1, line2, line3, countdownWrap, progressWrap, connRow, noteEl, actionBtns, _awAcceptTxt, _awDeclineTxt, supportBtn, bar, pctEl, _saved, _remaining;
    return _regenerator().w(function (_context46) {
      while (1) switch (_context46.n) {
        case 0:
          _context46.n = 1;
          return ensureAdminStatusModuleReady();
        case 1:
          screen = document.getElementById('approvalWaitScreen');
          if (screen) {
            _context46.n = 2;
            break;
          }
          return _context46.a(2);
        case 2:
          prewarmResultOverlayShell();
          screen.classList.remove('timeout-state');
          cardEl = document.getElementById('awCard');
          if (cardEl) cardEl.classList.remove('is-ok');
          sessBadgeEl = document.getElementById('awSessionBadge');
          if (sessBadgeEl) sessBadgeEl.textContent = state.sessionCode || '--';
          iconEl = document.getElementById('awPrizeIcon');
          nameEl = document.getElementById('awPrizeName');
          if (iconEl) {
            iconEl.innerHTML = renderPrizeVisualHtml(prize === null || prize === void 0 ? void 0 : prize.image, (prize === null || prize === void 0 ? void 0 : prize.icon) || '🎁', 'aw-prize-img', (prize === null || prize === void 0 ? void 0 : prize.name) || 'Phần thưởng');
          }
          if (nameEl) nameEl.textContent = (prize === null || prize === void 0 ? void 0 : prize.name) || 'Phần thưởng';
          state.approvalWaitingBox = Number((prize === null || prize === void 0 ? void 0 : prize.boxNumber) || state.currentWinBox || ((_state$currentPrize4 = state.currentPrize) === null || _state$currentPrize4 === void 0 ? void 0 : _state$currentPrize4.boxNumber) || 0) || 0;
          // Reset to waiting state (in case previously transformed to accept/decline)
          titleEl = document.getElementById('awTitle');
          if (titleEl) titleEl.textContent = contentTextGlobal('approvalWaitingTitle', 'Đang chờ phê duyệt...');
          messagesEl = document.getElementById('awMessages');
          if (messagesEl) {
            line1 = contentTextGlobal('approvalMsgLine1', '🎁 Phần thưởng đặc biệt của bạn đang được admin xem xét');
            line2 = contentTextGlobal('approvalMsgLine2', '⚡ Vui lòng không tắt trang và chờ thông báo');
            line3 = contentTextGlobal('approvalMsgLine3', '✨ Bạn sẽ sớm nhận được kết quả!');
            messagesEl.innerHTML = "<div class=\"aws-msg\">".concat(escapeHtml(line1), "</div><div class=\"aws-msg\">").concat(escapeHtml(line2), "</div><div class=\"aws-msg\">").concat(escapeHtml(line3), "</div>");
          }
          countdownWrap = document.getElementById('awCountdownWrap');
          if (countdownWrap) countdownWrap.style.display = '';
          progressWrap = document.getElementById('awProgressWrap');
          if (progressWrap) progressWrap.style.display = '';
          connRow = document.getElementById('awConnRow');
          if (connRow) connRow.style.display = '';
          noteEl = document.getElementById('awNote');
          if (noteEl) noteEl.style.display = '';
          actionBtns = document.getElementById('awActionButtons');
          if (actionBtns) {
            actionBtns.style.display = 'none';
            _awAcceptTxt = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền'), window.__manualTextMap) : contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền');
            _awDeclineTxt = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalDeclineButton', 'Từ chối'), window.__manualTextMap) : contentTextGlobal('approvalDeclineButton', 'Từ chối');
            actionBtns.innerHTML = "<button class=\"aws-btn aws-btn-accept\" onclick=\"acceptSpecialPrize()\">\uD83D\uDCB0 ".concat(escapeHtml(_awAcceptTxt), "</button><button class=\"aws-btn aws-btn-decline\" onclick=\"declineSpecialPrize()\">\u274C ").concat(escapeHtml(_awDeclineTxt), "</button>");
          }
          supportBtn = document.getElementById('awSupportButton');
          if (supportBtn) supportBtn.style.display = 'inline-flex';
          // Reset progress bar animation
          bar = document.getElementById('awProgressBar');
          pctEl = document.getElementById('awPct');
          if (pctEl) pctEl.textContent = '36%';
          if (bar) {
            bar.style.animation = 'none';
            bar.style.width = '36%';
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                bar.style.animation = '';
              });
            });
          }
          showApprovalScreenSmooth(screen);
          startApprovalRobotReminderLoop();
          startApprovalSupportBlinkLoop();
          startApprovalProgressiveStatus();
          if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
          savePendingApprovalState(prize); // Persist so reload brings screen back (deadline preserved)
          // Compute remaining from stored deadline so timer survives reload
          _saved = getPendingApprovalState();
          _remaining = _saved !== null && _saved !== void 0 && _saved.deadline ? Math.max(0, Math.floor((_saved.deadline - Date.now()) / 1000)) : 7200;
          startApprovalCountdown(_remaining);
          connectApprovalWebSocket(); // Real-time via WebSocket
          startApprovalPoll(); // Fallback polling
        case 3:
          return _context46.a(2);
      }
    }, _callee46);
  }));
  return _showApprovalWaitScreen.apply(this, arguments);
}
function contactSupportFromApprovalTimeout() {
  var _state$currentPrize;
  ensureChatModuleReady().catch(function () {});
  var panel = document.getElementById('cpanel');
  if (panel && !panel.classList.contains('open')) {
    panel.classList.add('open');
  }
  initCustomerChatUI();
  var preferredBox = Number(state.currentWinBox || ((_state$currentPrize = state.currentPrize) === null || _state$currentPrize === void 0 ? void 0 : _state$currentPrize.boxNumber) || 0);
  if (preferredBox) {
    openChatWithPrizeInfo(preferredBox);
  }
  showToast(contentTextGlobal('approvalSupportOpenedToast', '💬 Khung chat CSKH đã được mở. Vui lòng gửi yêu cầu để được hỗ trợ nhanh hơn.'));
}
function handleApprovalTimeout() {
  var screen = document.getElementById('approvalWaitScreen');
  if (screen) screen.classList.add('timeout-state');
  stopApprovalSupportBlinkLoop();
  if (state.approvalWaitIntervalId) {
    clearInterval(state.approvalWaitIntervalId);
    state.approvalWaitIntervalId = null;
  }
  if (state.approvalReminderIntervalId) {
    clearInterval(state.approvalReminderIntervalId);
    state.approvalReminderIntervalId = null;
  }
  clearApprovalTypingEffect();
  var titleEl = document.getElementById('awTitle');
  if (titleEl) titleEl.textContent = contentTextGlobal('approvalTimeoutTitle', 'ĐÃ QUÁ THỜI GIAN CHỜ PHÊ DUYỆT');
  var reminderEl = document.getElementById('awRobotReminder');
  if (reminderEl) {
    var _rawReminder = contentTextGlobal('approvalTimeoutReminder', 'Đã hết thời gian chờ tự động. Bạn hãy liên hệ CSKH để được ưu tiên hỗ trợ ngay.');
    typeApprovalReminderText(window.__manualTextMap ? translateExactTextByMap(_rawReminder, window.__manualTextMap) : _rawReminder);
  }
  var messagesEl = document.getElementById('awMessages');
  if (messagesEl) {
    messagesEl.innerHTML = "<div class=\"aws-msg\">".concat(escapeHtml(contentTextGlobal('approvalTimeoutMsgLine1', '⚠️ Hệ thống chưa nhận được quyết định duyệt từ admin trong thời gian chờ.')), "</div><div class=\"aws-msg\">").concat(escapeHtml(contentTextGlobal('approvalTimeoutMsgLine2', '💬 Vui lòng liên hệ bộ phận chăm sóc khách hàng để được xử lý ngay.')), "</div>");
  }
  var connRow = document.getElementById('awConnRow');
  if (connRow) connRow.style.display = 'none';
  var progressWrap = document.getElementById('awProgressWrap');
  if (progressWrap) progressWrap.style.display = 'none';
  var noteEl = document.getElementById('awNote');
  if (noteEl) noteEl.textContent = contentTextGlobal('approvalTimeoutNote', 'Bạn có thể bấm nút bên dưới để mở chat với CSKH.');
  var actionBtns = document.getElementById('awActionButtons');
  if (actionBtns) {
    actionBtns.style.display = 'flex';
    var _supportNowTxt = contentTextGlobal('approvalSupportNowButton', 'Liên hệ CSKH ngay');
    actionBtns.innerHTML = "<button class=\"aws-btn aws-btn-support\" onclick=\"contactSupportFromApprovalTimeout()\">\uD83D\uDCAC ".concat(escapeHtml(window.__manualTextMap ? translateExactTextByMap(_supportNowTxt, window.__manualTextMap) : _supportNowTxt), "</button>");
  }
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}
function hideApprovalWaitScreen() {
  var screen = document.getElementById('approvalWaitScreen');
  if (screen) hideApprovalScreenSmooth(screen);
  stopApprovalSupportBlinkLoop();
  clearApprovalStageTimers();
  if (state.approvalUiRafId) {
    cancelAnimationFrame(state.approvalUiRafId);
    state.approvalUiRafId = 0;
  }
  if (state.approvalWaitIntervalId) {
    clearInterval(state.approvalWaitIntervalId);
    state.approvalWaitIntervalId = null;
  }
  if (state.approvalPollIntervalId) {
    clearInterval(state.approvalPollIntervalId);
    state.approvalPollIntervalId = null;
  }
  if (state.approvalReminderIntervalId) {
    clearInterval(state.approvalReminderIntervalId);
    state.approvalReminderIntervalId = null;
  }
  clearApprovalTypingEffect();
  var reminderEl = document.getElementById('awRobotReminder');
  if (reminderEl) reminderEl.classList.remove('typing-active');
  disconnectApprovalWebSocket();
  clearPendingApprovalState(); // Remove persisted data once resolved
  state.approvalWaitingBox = 0;
}
function startApprovalCountdown(totalSeconds) {
  if (state.approvalWaitIntervalId) clearInterval(state.approvalWaitIntervalId);
  var startedAt = Date.now();
  var total = Math.max(0, Number(totalSeconds) || 0);
  function tick() {
    var elapsed = Math.floor((Date.now() - startedAt) / 1000);
    var remaining = Math.max(0, total - elapsed);
    var h = Math.floor(remaining / 3600);
    var m = Math.floor(remaining % 3600 / 60);
    var s = remaining % 60;
    var txt = "".concat(String(h).padStart(2, '0'), ":").concat(String(m).padStart(2, '0'), ":").concat(String(s).padStart(2, '0'));
    var el = document.getElementById('awCountdown');
    if (el) el.textContent = txt;
    if (remaining > 0) {
      return;
    }
    handleApprovalTimeout();
  }
  tick();
  state.approvalWaitIntervalId = setInterval(tick, 1000);
}
function isApprovalScreenVisible() {
  var screen = document.getElementById('approvalWaitScreen');
  if (!screen) return false;
  return screen.style.display !== 'none';
}
function checkApprovalDecisionFromInventory() {
  return _checkApprovalDecisionFromInventory.apply(this, arguments);
} // ===== Realtime approval listener (SSE/event-bus bridge) =====
function _checkApprovalDecisionFromInventory() {
  _checkApprovalDecisionFromInventory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee47() {
    var trigger,
      now,
      minGapMs,
      _state$currentPrize5,
      _rs$data,
      savedPending,
      box,
      rs,
      items,
      item,
      status,
      _args47 = arguments,
      _t29;
    return _regenerator().w(function (_context47) {
      while (1) switch (_context47.p = _context47.n) {
        case 0:
          trigger = _args47.length > 0 && _args47[0] !== undefined ? _args47[0] : '';
          if (!(!state.sessionCode || !isApprovalScreenVisible())) {
            _context47.n = 1;
            break;
          }
          return _context47.a(2);
        case 1:
          if (!state._approvalStatusCheckBusy) {
            _context47.n = 2;
            break;
          }
          return _context47.a(2);
        case 2:
          now = Date.now();
          minGapMs = 1200;
          if (!(state._approvalStatusCheckedAt && now - state._approvalStatusCheckedAt < minGapMs)) {
            _context47.n = 3;
            break;
          }
          return _context47.a(2);
        case 3:
          state._approvalStatusCheckedAt = now;
          state._approvalStatusCheckBusy = true;
          _context47.p = 4;
          savedPending = getPendingApprovalState();
          box = Number(state.approvalWaitingBox || (savedPending === null || savedPending === void 0 ? void 0 : savedPending.boxNumber) || state._approvedSpecialBox || state.currentWinBox || ((_state$currentPrize5 = state.currentPrize) === null || _state$currentPrize5 === void 0 ? void 0 : _state$currentPrize5.boxNumber) || 0);
          if (box) {
            _context47.n = 5;
            break;
          }
          return _context47.a(2);
        case 5:
          _context47.n = 6;
          return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/player-inventory"));
        case 6:
          rs = _context47.v;
          items = Array.isArray(rs === null || rs === void 0 || (_rs$data = rs.data) === null || _rs$data === void 0 ? void 0 : _rs$data.items) ? rs.data.items : [];
          item = items.find(function (x) {
            return Number(x.box_number || x.boxNumber || 0) === box;
          });
          if (item) {
            _context47.n = 7;
            break;
          }
          return _context47.a(2);
        case 7:
          status = String(item.status || '').toLowerCase();
          if (!(status === 'confirmed')) {
            _context47.n = 8;
            break;
          }
          handleSpecialPrizeDecision('approved', box);
          return _context47.a(2);
        case 8:
          if (!(status === 'rejected')) {
            _context47.n = 9;
            break;
          }
          handleSpecialPrizeDecision('rejected', box);
          return _context47.a(2);
        case 9:
          _context47.n = 11;
          break;
        case 10:
          _context47.p = 10;
          _t29 = _context47.v;
        case 11:
          _context47.p = 11;
          state._approvalStatusCheckBusy = false;
          return _context47.f(11);
        case 12:
          return _context47.a(2);
      }
    }, _callee47, null, [[4, 10, 11, 12]]);
  }));
  return _checkApprovalDecisionFromInventory.apply(this, arguments);
}
function connectApprovalWebSocket() {
  disconnectApprovalWebSocket();
  if (!state.sessionCode) return;
  state._approvalRealtimeUnsubs = state._approvalRealtimeUnsubs || [];
  var offWallet = LMB_EVENT_BUS.on('wallet:update', function (payload) {
    var sessionCode = String((payload === null || payload === void 0 ? void 0 : payload.sessionCode) || '').trim().toUpperCase();
    if (!sessionCode || sessionCode !== String(state.sessionCode || '').trim().toUpperCase()) return;
    checkApprovalDecisionFromInventory('wallet:update').catch(function () {});
  });
  var offSystem = LMB_EVENT_BUS.on('system:notification', function (payload) {
    var p = (payload === null || payload === void 0 ? void 0 : payload.payload) || {};
    var sessionCode = String(p.sessionCode || p.session_code || (payload === null || payload === void 0 ? void 0 : payload.sessionCode) || '').trim().toUpperCase();
    if (!sessionCode || sessionCode !== String(state.sessionCode || '').trim().toUpperCase()) return;
    checkApprovalDecisionFromInventory('system:notification').catch(function () {});
  });
  var offVisibility = LMB_EVENT_BUS.on('app:visibility', function (payload) {
    if (payload !== null && payload !== void 0 && payload.hidden) return;
    checkApprovalDecisionFromInventory('visibility').catch(function () {});
  });
  state._approvalRealtimeUnsubs.push(offWallet, offSystem, offVisibility);
  // One immediate check to sync quickly if admin already decided.
  checkApprovalDecisionFromInventory('connect').catch(function () {});
}
function disconnectApprovalWebSocket() {
  if (Array.isArray(state._approvalRealtimeUnsubs)) {
    state._approvalRealtimeUnsubs.forEach(function (off) {
      try {
        if (typeof off === 'function') off();
      } catch (_) {}
    });
  }
  state._approvalRealtimeUnsubs = [];
  if (state._approvalWs) {
    try {
      state._approvalWs.close();
    } catch (_) {}
    state._approvalWs = null;
  }
}
function handleSpecialPrizeDecision(decision, boxNumber) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var shouldEmitFeedback = options.emitFeedback !== false;
  if (decision === 'approved') {
    var _state$currentPrize2;
    // Admin approved → open preview modal for convert/decline or congratulation.
    if (shouldEmitFeedback) {
      showToast('🎉 Phần thưởng đã được admin duyệt!');
      playRealtimeNotificationSound('special_prize_approved');
    }
    // Stop polling & countdown
    if (state.approvalPollIntervalId) {
      clearInterval(state.approvalPollIntervalId);
      state.approvalPollIntervalId = null;
    }
    if (state.approvalWaitIntervalId) {
      clearInterval(state.approvalWaitIntervalId);
      state.approvalWaitIntervalId = null;
    }
    var approvedBox = Number(boxNumber || state.currentWinBox || ((_state$currentPrize2 = state.currentPrize) === null || _state$currentPrize2 === void 0 ? void 0 : _state$currentPrize2.boxNumber) || 0);
    state._approvedSpecialBox = approvedBox;
    if (approvedBox && state.boxes[approvedBox]) {
      state.boxes[approvedBox].specialApproved = true;
      state.boxes[approvedBox].isSpecial = true;
      state.boxes[approvedBox].decision = state.boxes[approvedBox].decision || 'confirmed';
      // Keep current prize in sync so convert/decline actions target right box.
      state.currentPrize = _objectSpread(_objectSpread({}, state.currentPrize || {}), {}, {
        boxNumber: approvedBox
      });
      state.currentWinBox = approvedBox;
    }
    hideApprovalWaitScreen();
    var approvedBoxMeta = state.boxes[approvedBox] || {};
    var isCashApproved = isCashPrizeLike(approvedBoxMeta);
    if (!isCashApproved) {
      // Non-cash special prize should never force convert/decline.
      activateNextBox();
      renderBoxes();
      refreshHubData();
      showToast('✅ Quà đã duyệt. Bạn có thể mở hộp tiếp theo hoặc bấm xem chi tiết để gửi CSKH yêu cầu đổi quà.');
      return;
    }
    if (approvedBox) {
      setupWinOverlay(approvedBox);
      openWinOverlay(approvedBox);
      showApprovedConversionReminderModal(approvedBox, {
        force: true
      });
      scheduleApprovedConversionReminder(approvedBox);
    }
  } else {
    // Admin rejected → activate next box
    hideApprovalWaitScreen();
    if (shouldEmitFeedback) {
      showToast('😔 Phần thưởng đặc biệt đã bị admin từ chối.');
      playRealtimeNotificationSound('special_prize_rejected');
    }
    var nextBox = state.openOrder.find(function (n) {
      return state.boxes[n].state === 'inactive';
    });
    if (nextBox) state.boxes[nextBox].state = 'active';
    renderBoxes();
    refreshHubData();
  }
}

// Player accepts the approved special prize → convert to money, game locks
function convertApprovedSpecialPrizeNow(_x10) {
  return _convertApprovedSpecialPrizeNow.apply(this, arguments);
}
function _convertApprovedSpecialPrizeNow() {
  _convertApprovedSpecialPrizeNow = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee48(box) {
    var _result2;
    var safeBox, prevRemaining, result, creditedAmount, nowRemaining, _t30;
    return _regenerator().w(function (_context48) {
      while (1) switch (_context48.p = _context48.n) {
        case 0:
          safeBox = Number(box || 0);
          if (safeBox) {
            _context48.n = 1;
            break;
          }
          throw new Error('Không xác định được hộp cần quy đổi');
        case 1:
          prevRemaining = Math.max(0, Number(state.wallet.remaining || 0));
          _context48.p = 2;
          _context48.n = 3;
          return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/convert"), {
            method: 'POST',
            body: JSON.stringify({
              boxNumber: safeBox,
              instant: true
            })
          });
        case 3:
          result = _context48.v;
          _context48.n = 7;
          break;
        case 4:
          _context48.p = 4;
          _t30 = _context48.v;
          if (isAlreadyConvertedErrorMessage(_t30 === null || _t30 === void 0 ? void 0 : _t30.message)) {
            _context48.n = 5;
            break;
          }
          throw _t30;
        case 5:
          if (state.boxes[safeBox]) {
            state.boxes[safeBox].decision = 'converted';
            state.boxes[safeBox].status = 'converted';
            state.boxes[safeBox].processingStatus = 'converted';
          }
          stopApprovedConversionReminder(safeBox);
          invalidateSessionEconomyBurstCache(state.sessionCode);
          _context48.n = 6;
          return Promise.all([refreshHubData(), refreshBoxesFromServer()]);
        case 6:
          activateNextBox();
          renderBoxes();
          showToast('✅ Phần quà đã được quy đổi trước đó. Đã đồng bộ lại số dư ví.');
          return _context48.a(2, {
            success: true,
            pendingApproval: false,
            instant: true,
            alreadyConverted: true,
            boxNumber: safeBox
          });
        case 7:
          hideApprovalWaitScreen();
          if (!((_result2 = result) !== null && _result2 !== void 0 && _result2.pendingApproval)) {
            _context48.n = 9;
            break;
          }
          // USD/NDT: pending CSKH — lock remaining boxes until approved
          if (state.boxes[safeBox]) {
            state.boxes[safeBox].decision = 'exchanged';
            state.boxes[safeBox].status = 'exchanged';
            state.boxes[safeBox].processingStatus = 'exchanged';
          }
          stopApprovedConversionReminder(safeBox);
          invalidateSessionEconomyBurstCache(state.sessionCode);
          _context48.n = 8;
          return refreshHubData();
        case 8:
          renderBoxes();
          showToast("\u23F3 Y\xEAu c\u1EA7u quy \u0111\u1ED5i ".concat(result.currency || '', " \u0111\xE3 g\u1EEDi. Vui l\xF2ng li\xEAn h\u1EC7 CSKH!"));
          _context48.n = 13;
          break;
        case 9:
          // VND: instant convert — allow next box
          if (state.boxes[safeBox]) state.boxes[safeBox].decision = 'converted';
          stopApprovedConversionReminder(safeBox);
          renderBoxes();
          invalidateSessionEconomyBurstCache(state.sessionCode);
          _context48.n = 10;
          return refreshHubData();
        case 10:
          creditedAmount = Math.max(0, Number(result.amountVND || result.cashAmount || 0));
          nowRemaining = Math.max(0, Number(state.wallet.remaining || 0));
          if (!(creditedAmount > 0 && nowRemaining <= prevRemaining)) {
            _context48.n = 12;
            break;
          }
          _context48.n = 11;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 650);
          });
        case 11:
          invalidateSessionEconomyBurstCache(state.sessionCode);
          _context48.n = 12;
          return refreshWallet();
        case 12:
          activateNextBox();
          showToast('✅ Đã quy đổi thành tiền trong ví!');
        case 13:
          return _context48.a(2, result);
      }
    }, _callee48, null, [[2, 4]]);
  }));
  return _convertApprovedSpecialPrizeNow.apply(this, arguments);
}
function acceptSpecialPrize() {
  return _acceptSpecialPrize.apply(this, arguments);
} // Player declines the approved special prize → can open next box
function _acceptSpecialPrize() {
  _acceptSpecialPrize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee49() {
    var box, actionBtns, _convertingTxt, _actionBtns, _errAccept, _errDecline, _t31;
    return _regenerator().w(function (_context49) {
      while (1) switch (_context49.p = _context49.n) {
        case 0:
          box = state._approvedSpecialBox || state.currentWinBox;
          if (box) {
            _context49.n = 1;
            break;
          }
          return _context49.a(2);
        case 1:
          _context49.p = 1;
          actionBtns = document.getElementById('awActionButtons');
          if (actionBtns) {
            _convertingTxt = window.__manualTextMap ? translateExactTextByMap('⏳ Đang quy đổi...', window.__manualTextMap) : '⏳ Đang quy đổi...';
            actionBtns.innerHTML = "<div style=\"color:#4ade80;font-weight:700;font-size:16px;\">".concat(escapeHtml(_convertingTxt), "</div>");
          }
          _context49.n = 2;
          return convertApprovedSpecialPrizeNow(box);
        case 2:
          _context49.n = 4;
          break;
        case 3:
          _context49.p = 3;
          _t31 = _context49.v;
          showToast("\u274C ".concat(_t31.message));
          _actionBtns = document.getElementById('awActionButtons');
          if (_actionBtns) {
            _errAccept = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền'), window.__manualTextMap) : contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền');
            _errDecline = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalDeclineButton', 'Từ chối'), window.__manualTextMap) : contentTextGlobal('approvalDeclineButton', 'Từ chối');
            _actionBtns.innerHTML = "<button class=\"aws-btn aws-btn-accept\" onclick=\"acceptSpecialPrize()\">\uD83D\uDCB0 ".concat(escapeHtml(_errAccept), "</button><button class=\"aws-btn aws-btn-decline\" onclick=\"declineSpecialPrize()\">\u274C ").concat(escapeHtml(_errDecline), "</button>");
            _actionBtns.style.display = 'flex';
          }
        case 4:
          return _context49.a(2);
      }
    }, _callee49, null, [[1, 3]]);
  }));
  return _acceptSpecialPrize.apply(this, arguments);
}
function declineSpecialPrize() {
  return _declineSpecialPrize.apply(this, arguments);
} // Fallback polling (in case WebSocket is unavailable)
function _declineSpecialPrize() {
  _declineSpecialPrize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee50() {
    var box, actionBtns, _processingTxt, nextBox, _actionBtns2, _declErrAccept, _declErrDecline, _t32;
    return _regenerator().w(function (_context50) {
      while (1) switch (_context50.p = _context50.n) {
        case 0:
          box = state._approvedSpecialBox || state.currentWinBox;
          if (box) {
            _context50.n = 1;
            break;
          }
          return _context50.a(2);
        case 1:
          _context50.p = 1;
          actionBtns = document.getElementById('awActionButtons');
          if (actionBtns) {
            _processingTxt = window.__manualTextMap ? translateExactTextByMap('⏳ Đang xử lý...', window.__manualTextMap) : '⏳ Đang xử lý...';
            actionBtns.innerHTML = "<div style=\"color:#94a3b8;font-weight:700;font-size:16px;\">".concat(escapeHtml(_processingTxt), "</div>");
          }
          _context50.n = 2;
          return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/convert"), {
            method: 'POST',
            body: JSON.stringify({
              boxNumber: box,
              decline: true
            })
          });
        case 2:
          hideApprovalWaitScreen();
          if (state.boxes[box]) state.boxes[box].decision = 'declined';
          stopApprovedConversionReminder(box);
          // Activate next box
          nextBox = state.openOrder.find(function (n) {
            return state.boxes[n].state === 'inactive';
          });
          if (nextBox) state.boxes[nextBox].state = 'active';
          renderBoxes();
          _context50.n = 3;
          return refreshHubData();
        case 3:
          showToast('Đã từ chối phần thưởng. Bạn có thể mở hộp tiếp theo.');
          _context50.n = 5;
          break;
        case 4:
          _context50.p = 4;
          _t32 = _context50.v;
          showToast("\u274C ".concat(_t32.message));
          _actionBtns2 = document.getElementById('awActionButtons');
          if (_actionBtns2) {
            _declErrAccept = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền'), window.__manualTextMap) : contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền');
            _declErrDecline = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalDeclineButton', 'Từ chối'), window.__manualTextMap) : contentTextGlobal('approvalDeclineButton', 'Từ chối');
            _actionBtns2.innerHTML = "<button class=\"aws-btn aws-btn-accept\" onclick=\"acceptSpecialPrize()\">\uD83D\uDCB0 ".concat(escapeHtml(_declErrAccept), "</button><button class=\"aws-btn aws-btn-decline\" onclick=\"declineSpecialPrize()\">\u274C ").concat(escapeHtml(_declErrDecline), "</button>");
            _actionBtns2.style.display = 'flex';
          }
        case 5:
          return _context50.a(2);
      }
    }, _callee50, null, [[1, 4]]);
  }));
  return _declineSpecialPrize.apply(this, arguments);
}
function startApprovalPoll() {
  // Disabled to eliminate polling loops. Approval state refreshes on focus/visibility.
}

// Keep legacy stubs for backward compatibility
function winChooseClaim() {
  return _winChooseClaim.apply(this, arguments);
}
function _winChooseClaim() {
  _winChooseClaim = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee51() {
    return _regenerator().w(function (_context51) {
      while (1) switch (_context51.n) {
        case 0:
          showToast('ℹ️ Liên hệ CSKH để nhận quà');
        case 1:
          return _context51.a(2);
      }
    }, _callee51);
  }));
  return _winChooseClaim.apply(this, arguments);
}
function winChooseMoney() {
  return _winChooseMoney.apply(this, arguments);
}
function _winChooseMoney() {
  _winChooseMoney = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee52() {
    return _regenerator().w(function (_context52) {
      while (1) switch (_context52.n) {
        case 0:
          _context52.n = 1;
          return winConvertNow();
        case 1:
          return _context52.a(2);
      }
    }, _callee52);
  }));
  return _winChooseMoney.apply(this, arguments);
}
function togChat() {
  return _togChat.apply(this, arguments);
}
function _togChat() {
  _togChat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee53() {
    var panel;
    return _regenerator().w(function (_context53) {
      while (1) switch (_context53.n) {
        case 0:
          _context53.n = 1;
          return ensureChatModuleReady();
        case 1:
          panel = document.getElementById('cpanel');
          if (panel) {
            _context53.n = 2;
            break;
          }
          return _context53.a(2);
        case 2:
          panel.classList.toggle('open');
          if (panel.classList.contains('open')) {
            stopChatFabHintCycle();
            if (window.tabNotification) tabNotification.resetBadge();
            hideChatToast();
            resetChatFabHintMessage();
            initCustomerChatUI();
          } else {
            startChatFabHintCycle();
          }
        case 3:
          return _context53.a(2);
      }
    }, _callee53);
  }));
  return _togChat.apply(this, arguments);
}
function buildUserRealtimeNotice(rawPayload) {
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'notification';
  var raw = rawPayload && _typeof(rawPayload) === 'object' ? rawPayload : {};
  var nested = raw.payload && _typeof(raw.payload) === 'object' ? raw.payload : {};
  var eventType = String(source === 'system' ? raw.event || '' : raw.type || '').trim().toLowerCase();
  var sessionCode = String(raw.sessionCode || raw.session_code || nested.sessionCode || nested.session_code || '').trim().toUpperCase();
  var boxNumber = Number(raw.box_number || raw.boxNumber || nested.box_number || nested.boxNumber || 0) || 0;
  var amountVnd = Math.max(0, Number(raw.amount_vnd || nested.amount_vnd || raw.amount || nested.amount || 0) || 0);
  var rejectionReason = String(raw.rejection_reason || nested.rejection_reason || '').trim();
  var title = String(raw.title || '').trim();
  var body = String(raw.message || '').trim();
  var level = String(raw.level || nested.level || 'info').trim().toLowerCase();
  var shouldRefreshWallet = false;
  var shouldRefreshBoxes = false;
  switch (eventType) {
    case 'admin_message':
      title = title || 'Tin nhan tu CSKH';
      body = body || 'Ban co tin nhan moi tu tu van vien.';
      level = 'info';
      break;
    case 'wallet_approved':
      title = title || 'Rút tiền đã duyệt';
      body = body || "Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n \u0111\xE3 \u0111\u01B0\u1EE3c duy\u1EC7t".concat(amountVnd > 0 ? " (".concat(amountVnd.toLocaleString('vi-VN'), " VND)") : '', ".");
      level = 'success';
      shouldRefreshWallet = true;
      break;
    case 'wallet_rejected':
      title = title || 'Rút tiền bị từ chối';
      body = body || "Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n \u0111\xE3 b\u1ECB t\u1EEB ch\u1ED1i".concat(rejectionReason ? ": ".concat(rejectionReason) : '.');
      level = 'warning';
      shouldRefreshWallet = true;
      break;
    case 'gift_approved':
      title = title || 'Duyệt quà thành công';
      body = body || "Y\xEAu c\u1EA7u nh\u1EADn qu\xE0 \u0111\xE3 \u0111\u01B0\u1EE3c duy\u1EC7t".concat(boxNumber > 0 ? " cho h\u1ED9p #".concat(boxNumber) : '', ".");
      level = 'success';
      break;
    case 'gift_rejected':
      title = title || 'Yêu cầu quà bị từ chối';
      body = body || "Y\xEAu c\u1EA7u nh\u1EADn qu\xE0 \u0111\xE3 b\u1ECB t\u1EEB ch\u1ED1i".concat(rejectionReason ? ": ".concat(rejectionReason) : '.');
      level = 'warning';
      break;
    case 'special_prize_approved':
      title = title || 'Quà đặc biệt đã duyệt';
      body = body || "Ph\u1EA7n th\u01B0\u1EDFng \u0111\u1EB7c bi\u1EC7t".concat(boxNumber > 0 ? " h\u1ED9p #".concat(boxNumber) : '', " \u0111\xE3 \u0111\u01B0\u1EE3c admin duy\u1EC7t.");
      level = 'success';
      break;
    case 'special_prize_rejected':
      title = title || 'Quà đặc biệt bị từ chối';
      body = body || "Ph\u1EA7n th\u01B0\u1EDFng \u0111\u1EB7c bi\u1EC7t".concat(boxNumber > 0 ? " h\u1ED9p #".concat(boxNumber) : '', " \u0111\xE3 b\u1ECB t\u1EEB ch\u1ED1i.");
      level = 'warning';
      break;
    case 'conversion_approved':
      title = title || 'Quy đổi đã duyệt';
      body = body || "Quy \u0111\u1ED5i".concat(boxNumber > 0 ? " h\u1ED9p #".concat(boxNumber) : '', " \u0111\xE3 \u0111\u01B0\u1EE3c duy\u1EC7t").concat(amountVnd > 0 ? " (".concat(amountVnd.toLocaleString('vi-VN'), " VND)") : '', ".");
      level = 'success';
      shouldRefreshWallet = true;
      break;
    case 'conversion_rejected':
      title = title || 'Quy đổi bị từ chối';
      body = body || "Y\xEAu c\u1EA7u quy \u0111\u1ED5i".concat(boxNumber > 0 ? " h\u1ED9p #".concat(boxNumber) : '', " \u0111\xE3 b\u1ECB t\u1EEB ch\u1ED1i").concat(rejectionReason ? ": ".concat(rejectionReason) : '.');
      level = 'warning';
      shouldRefreshWallet = true;
      break;
    case 'withdrawal_status_updated':
      title = title || 'Cập nhật rút tiền';
      body = body || "Tr\u1EA1ng th\xE1i r\xFAt ti\u1EC1n \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt".concat(amountVnd > 0 ? " (".concat(amountVnd.toLocaleString('vi-VN'), " VND)") : '', ".");
      shouldRefreshWallet = true;
      break;
    case 'gift_status_updated':
      title = title || 'Cập nhật duyệt quà';
      body = body || "Tr\u1EA1ng th\xE1i duy\u1EC7t qu\xE0 \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt".concat(boxNumber > 0 ? " (h\u1ED9p #".concat(boxNumber, ")") : '', ".");
      break;
    case 'conversion_status_updated':
      title = title || 'Cập nhật quy đổi';
      body = body || "Tr\u1EA1ng th\xE1i quy \u0111\u1ED5i \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt".concat(boxNumber > 0 ? " (h\u1ED9p #".concat(boxNumber, ")") : '', ".");
      shouldRefreshWallet = true;
      break;
    case 'session_updated':
      title = title || 'Phiên chơi đã cập nhật';
      body = body || 'Thông tin hộp quà vừa được cập nhật. Hệ thống đang đồng bộ dữ liệu mới.';
      shouldRefreshWallet = true;
      shouldRefreshBoxes = true;
      break;
    default:
      if (source === 'system' && !title && !body) {
        return null;
      }
      title = title || 'Thông báo';
      body = body || String(raw.event || eventType || '').trim();
      break;
  }
  if (!title && !body) return null;
  var toastType = ['success', 'error', 'warning', 'info'].includes(level) ? level : 'info';
  return {
    type: eventType || 'notification',
    sessionCode: sessionCode,
    boxNumber: boxNumber,
    title: title,
    body: body,
    toastType: toastType,
    shouldRefreshWallet: shouldRefreshWallet,
    shouldRefreshBoxes: shouldRefreshBoxes
  };
}
function getActiveRealtimeSessionCodes() {
  var _state$chat2;
  var codes = [String(state.sessionCode || '').trim().toUpperCase(), String(((_state$chat2 = state.chat) === null || _state$chat2 === void 0 ? void 0 : _state$chat2.sessionCode) || '').trim().toUpperCase()].filter(Boolean);
  return _toConsumableArray(new Set(codes));
}
function doesNoticeSessionMatchActive(detailSessionCode) {
  var normalized = String(detailSessionCode || '').trim().toUpperCase();
  if (!normalized) return true;
  var activeCodes = getActiveRealtimeSessionCodes();
  if (activeCodes.length === 0) return true;
  return activeCodes.includes(normalized);
}
function scheduleCustomerAutoReload() {
  var reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'wallet_decision';
  var now = Date.now();
  var guardKey = 'lmb:auto-reload:guard';
  try {
    var lastAt = Number(sessionStorage.getItem(guardKey) || 0);
    if (lastAt && now - lastAt < 15000) return;
    sessionStorage.setItem(guardKey, String(now));
  } catch (_) {}
  if (state.autoReloadPending) return;
  state.autoReloadPending = true;
  if (state.autoReloadTimerId) {
    clearTimeout(state.autoReloadTimerId);
    state.autoReloadTimerId = null;
  }
  state.autoReloadTimerId = setTimeout(function () {
    state.autoReloadTimerId = null;
    try {
      window.location.reload();
    } catch (_) {
      window.location.href = window.location.href;
    }
  }, 900);
  notifyDbg('auto-reload-scheduled', {
    reason: reason,
    at: now
  });
}
function showUserRealtimeNotice(rawPayload) {
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'notification';
  var detail = buildUserRealtimeNotice(rawPayload, source);
  if (!detail) {
    notifyDbg('notice-skip-no-detail', {
      source: source,
      rawPayload: rawPayload
    });
    return;
  }
  var activeSessionCodes = getActiveRealtimeSessionCodes();
  if (!doesNoticeSessionMatchActive(detail.sessionCode)) {
    notifyDbg('notice-skip-session-mismatch', {
      eventType: detail.type,
      detailSessionCode: detail.sessionCode,
      activeSessionCodes: activeSessionCodes
    });
    return;
  }
  notifyDbg('notice-accepted', {
    eventType: detail.type,
    source: source,
    detailSessionCode: detail.sessionCode,
    activeSessionCodes: activeSessionCodes,
    title: detail.title
  });
  if (detail.type === 'special_prize_approved' || detail.type === 'special_prize_rejected') {
    var _state$currentPrize3;
    var decision = detail.type === 'special_prize_approved' ? 'approved' : 'rejected';
    var raw = rawPayload && _typeof(rawPayload) === 'object' ? rawPayload : {};
    var nested = raw.payload && _typeof(raw.payload) === 'object' ? raw.payload : {};
    var realtimeBox = Number(detail.boxNumber || raw.box_number || raw.boxNumber || nested.box_number || nested.boxNumber || state.approvalWaitingBox || state.currentWinBox || ((_state$currentPrize3 = state.currentPrize) === null || _state$currentPrize3 === void 0 ? void 0 : _state$currentPrize3.boxNumber) || 0) || 0;
    handleSpecialPrizeDecision(decision, realtimeBox, {
      emitFeedback: false
    });

    // Keep special-prize notifications in the same UX pipeline as other notices.
    showToast("\uD83D\uDD14 ".concat(detail.title).concat(detail.body ? ": ".concat(detail.body) : ''), {
      type: detail.toastType,
      duration: 5000
    });
    playRealtimeNotificationSound(decision === 'approved' ? 'special_prize_approved' : 'special_prize_rejected');
    var specialTabLabel = decision === 'approved' ? 'Duyệt quà đặc biệt' : 'Từ chối quà đặc biệt';
    if (document.hidden && window.tabNotification && typeof tabNotification.incrementBadge === 'function') {
      try {
        tabNotification.incrementBadge(specialTabLabel);
      } catch (_) {}
    }
    return;
  }
  if (detail.type === 'admin_message') {
    var chatText = String(detail.body || detail.title || 'Bạn có tin nhắn mới').trim();
    showChatToast({
      message: chatText
    });
    showChatFabHintMessage({
      message: chatText
    });
  } else {
    showToast("\uD83D\uDD14 ".concat(detail.title).concat(detail.body ? ": ".concat(detail.body) : ''), {
      type: detail.toastType,
      duration: 4200
    });
  }
  var realtimeNoticeSoundTypeMap = {
    wallet_approved: 'wallet_approved',
    wallet_rejected: 'wallet_rejected',
    gift_approved: 'gift_approved',
    gift_rejected: 'gift_rejected',
    special_prize_approved: 'special_prize_approved',
    special_prize_rejected: 'special_prize_rejected',
    conversion_approved: 'conversion_approved',
    conversion_rejected: 'conversion_rejected',
    session_updated: 'admin_message'
  };
  var soundType = realtimeNoticeSoundTypeMap[detail.type] || 'admin_message';
  playRealtimeNotificationSound(soundType);
  var tabNotifyTypeLabelMap = {
    admin_message: 'Tin nhắn CSKH',
    wallet_approved: 'Duyệt rút tiền',
    withdrawal_status_updated: 'Cập nhật rút tiền',
    gift_approved: 'Duyệt quà',
    gift_status_updated: 'Cập nhật duyệt quà',
    session_updated: 'Cập nhật phiên chơi',
    special_prize_approved: 'Duyệt quà đặc biệt',
    special_prize_rejected: 'Từ chối quà đặc biệt'
  };
  var tabNotifyLabel = tabNotifyTypeLabelMap[detail.type] || '';
  if (tabNotifyLabel && document.hidden && window.tabNotification) {
    try {
      var currentCount = typeof tabNotification.getCount === 'function' ? Number(tabNotification.getCount() || 0) : 0;
      if (typeof tabNotification.startTabBlink === 'function') {
        tabNotification.startTabBlink(Math.max(1, currentCount + 1), tabNotifyLabel);
      } else if (typeof tabNotification.incrementBadge === 'function') {
        tabNotification.incrementBadge(tabNotifyLabel);
      }
    } catch (_) {}
  }
  if (detail.type === 'wallet_approved' || detail.type === 'wallet_rejected') {
    showToast('↻ Hệ thống đang tự tải lại để cập nhật kết quả duyệt.', {
      type: 'info',
      duration: 1400
    });
    scheduleCustomerAutoReload(detail.type);
    return;
  }
  if (detail.shouldRefreshWallet && !document.hidden) {
    var shouldRefreshBoxes = detail.shouldRefreshBoxes || detail.type === 'conversion_approved' || detail.type === 'conversion_rejected';
    scheduleEconomyRealtimeRefresh(120, {
      refreshBoxes: shouldRefreshBoxes
    });
    if (shouldRefreshBoxes) {
      loadPlayerInventory().catch(function () {});
    }
  }
  if ('Notification' in window && document.hidden && Notification.permission === 'granted') {
    try {
      new Notification(detail.title, {
        body: detail.body || 'Có cập nhật mới',
        icon: '/favicon.ico',
        tag: "rt-".concat(detail.type || 'notify')
      });
    } catch (_) {}
  }
}
function bindRealtimeEventConsumers() {
  if (LMB_RUNTIME.realtimeConsumersBound) return;
  LMB_RUNTIME.realtimeConsumersBound = true;
  rtDbg('bind-realtime-consumers', {
    sessionCode: state.chat.sessionCode || ''
  });

  // Helper: format elapsed time since a timestamp into a human-readable string
  function formatAdminLastSeen(ts) {
    if (!ts) return 'Offline';
    var diffMs = Date.now() - Number(ts);
    if (diffMs < 0) return 'Offline';
    var diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Offline \xB7 ".concat(diffSec, " gi\xE2y tr\u01B0\u1EDBc");
    var diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return "Offline \xB7 ".concat(diffMin, " ph\xFAt tr\u01B0\u1EDBc");
    var diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return "Offline \xB7 ".concat(diffHour, " gi\u1EDD tr\u01B0\u1EDBc");
    var diffDay = Math.floor(diffHour / 24);
    // > 1 day: show "Lần cuối X ngày trước"
    return "L\u1EA7n cu\u1ED1i ho\u1EA1t \u0111\u1ED9ng ".concat(diffDay, " ng\xE0y tr\u01B0\u1EDBc");
  }
  var _adminOfflineTimer = null;
  LMB_EVENT_BUS.on('chat:online_status', function (payload) {
    if ((payload === null || payload === void 0 ? void 0 : payload.role) !== 'admin') return;
    var onlineEl = document.querySelector('#cpanel .ch-online');
    if (!onlineEl) return;

    // Clear any running offline-ticker
    if (_adminOfflineTimer) {
      clearInterval(_adminOfflineTimer);
      _adminOfflineTimer = null;
    }
    var adminCount = Math.max(0, Number(payload.admin_count || 0) || 0);
    var adminNames = Array.isArray(payload.admin_names) ? payload.admin_names.map(function (n) {
      return String(n || '').trim();
    }).filter(Boolean) : [];
    if (!payload.online) {
      var _tickOffline = function tickOffline() {
        var el = document.querySelector('#cpanel .ch-online');
        if (!el) {
          clearInterval(_adminOfflineTimer);
          _adminOfflineTimer = null;
          return;
        }
        el.textContent = formatAdminLastSeen(lastSeenTs);
        // Once > 1 day, slow down to every 10 min
        if (lastSeenTs && Date.now() - Number(lastSeenTs) > 86400000) {
          clearInterval(_adminOfflineTimer);
          _adminOfflineTimer = setInterval(_tickOffline, 600000);
        }
      };
      var lastSeenTs = payload.lastSeen || payload.last_seen || payload.ts || 0;
      _tickOffline();
      // Update every 10 seconds while < 1 day
      _adminOfflineTimer = setInterval(_tickOffline, 10000);
      return;
    }
    if (adminCount > 1) {
      var namesLabel = adminNames.length ? " (".concat(adminNames.slice(0, 2).join(', ')).concat(adminNames.length > 2 ? ', ...' : '', ")") : '';
      onlineEl.textContent = "".concat(adminCount, " t\u01B0 v\u1EA5n vi\xEAn online").concat(namesLabel);
      return;
    }
    if (adminNames.length === 1) {
      onlineEl.textContent = "".concat(adminNames[0], " \u0111ang online");
      return;
    }
    onlineEl.textContent = 'Đang online • Phản hồi nhanh';
  });
  LMB_EVENT_BUS.on('chat:new_message', function (msg) {
    if (!msg || !state.chat.sessionCode) return;
    if (String(msg.session_code || msg.sessionCode || '').toUpperCase() !== String(state.chat.sessionCode || '').toUpperCase()) return;
    rtDbg('event-chat-new-message', {
      id: msg.id || '',
      sender: msg.sender_type || '',
      sessionCode: String(msg.session_code || msg.sessionCode || ''),
      panelOpen: isChatPanelOpen(),
      hidden: !!document.hidden
    });
    var senderType = String(msg.sender_type || '').toLowerCase();
    var inserted = appendChatMessage(msg);
    if (senderType === 'customer') {
      if (inserted && isChatPanelOpen() && !document.hidden) {
        scheduleChatRender({
          fresh: true
        });
      }
      return;
    }
    hideChatTypingBubble();
    if (inserted && (isChatPanelOpen() || !document.hidden)) {
      scheduleChatRender({
        fresh: true
      });
    }
    if (!document.hidden) {
      showChatToast(msg || {
        message: 'Bạn có tin nhắn mới'
      });
    }
    if (isChatPanelOpen()) {
      playRealtimeNotificationSound('admin_in_chat');
      markChatMessagesAsSeen();
      scheduleChatSeenPost(80);
      return;
    }
    playRealtimeNotificationSound('admin_message');
    if (document.hidden && 'Notification' in window) {
      var notifTitle = 'New message';
      var notifBody = String(msg.message || '').slice(0, 100) || 'Bạn có tin nhắn mới';
      if (Notification.permission === 'granted') {
        try {
          new Notification(notifTitle, {
            body: notifBody,
            icon: '/favicon.ico',
            tag: 'chat-msg',
            requireInteraction: false
          });
        } catch (_) {}
      } else if (Notification.permission !== 'denied') {
        requestBrowserNotificationPermissionOnce().then(function (p) {
          if (p === 'granted') {
            try {
              new Notification(notifTitle, {
                body: notifBody,
                icon: '/favicon.ico',
                tag: 'chat-msg',
                requireInteraction: false
              });
            } catch (_) {}
          }
        });
      }
    }
    if (window.tabNotification) tabNotification.incrementBadge('Tin nhắn mới');
    scheduleChatUnreadSync(msg);
  });
  LMB_EVENT_BUS.on('chat:typing', function (payload) {
    if ((payload === null || payload === void 0 ? void 0 : payload.role) === 'admin') showChatTypingBubble();
  });
  LMB_EVENT_BUS.on('chat:message_status', function (payload) {
    applyIncomingOutgoingStatusUpdate(payload);
  });
  LMB_EVENT_BUS.on('chat:stop_typing', function (payload) {
    if ((payload === null || payload === void 0 ? void 0 : payload.role) === 'admin') hideChatTypingBubble();
  });
  LMB_EVENT_BUS.on('wallet:update', /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(payload) {
      var sessionCode, activeSessionCodes, ext, reason, status, isWithdrawDecisionEvent, inferredType, walletUpdateMatchesActive, decisionLabel, shouldRefreshBoxes;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            notifyDbg('eventbus-wallet-update', {
              payload: payload,
              gameSessionCode: state.sessionCode || '',
              chatSessionCode: state.chat.sessionCode || ''
            });
            sessionCode = String((payload === null || payload === void 0 ? void 0 : payload.sessionCode) || '').trim().toUpperCase();
            activeSessionCodes = getActiveRealtimeSessionCodes();
            ext = payload && payload.payload && _typeof(payload.payload) === 'object' ? payload.payload : {};
            reason = String(ext.reason || (payload === null || payload === void 0 ? void 0 : payload.reason) || '').trim().toLowerCase();
            status = String(ext.status || (payload === null || payload === void 0 ? void 0 : payload.status) || '').trim().toLowerCase();
            isWithdrawDecisionEvent = reason === 'withdrawal_status_updated' && (status === 'approved' || status === 'rejected'); // Fallback path: if backend did not emit `notification`, infer a user notice from status updates.
            inferredType = '';
            if (reason === 'withdrawal_status_updated') {
              inferredType = status === 'approved' ? 'wallet_approved' : status === 'rejected' ? 'wallet_rejected' : '';
            } else if (reason === 'gift_status_updated') {
              inferredType = status === 'approved' ? 'gift_approved' : status === 'rejected' ? 'gift_rejected' : '';
            } else if (reason === 'conversion_status_updated') {
              inferredType = status === 'approved' ? 'conversion_approved' : status === 'rejected' ? 'conversion_rejected' : '';
            }
            walletUpdateMatchesActive = !sessionCode || activeSessionCodes.length === 0 || activeSessionCodes.includes(sessionCode); // Hard guarantee: once admin approves/rejects withdrawal, force customer tab reload.
            // This path does not rely on notification type mapping.
            if (!(isWithdrawDecisionEvent && walletUpdateMatchesActive)) {
              _context4.n = 1;
              break;
            }
            decisionLabel = status === 'approved' ? 'đã duyệt' : 'đã từ chối';
            showToast("\u21BB Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n ".concat(decisionLabel, ". Trang s\u1EBD t\u1EF1 t\u1EA3i l\u1EA1i..."), {
              type: status === 'approved' ? 'success' : 'warning',
              duration: 1200
            });
            scheduleCustomerAutoReload("wallet_update:".concat(status));
            return _context4.a(2);
          case 1:
            if (inferredType && walletUpdateMatchesActive) {
              notifyDbg('wallet-update-inferred-notice', {
                reason: reason,
                status: status,
                inferredType: inferredType,
                sessionCode: sessionCode,
                activeSessionCodes: activeSessionCodes
              });
              showUserRealtimeNotice({
                type: inferredType,
                sessionCode: sessionCode || activeSessionCodes[0] || '',
                amount_vnd: Number(ext.amount_vnd || ext.amount || 0) || 0,
                box_number: Number(ext.box_number || 0) || 0,
                rejection_reason: String(ext.rejection_reason || '').trim(),
                payload: ext
              }, 'notification');
            }
            if (!document.hidden) {
              _context4.n = 2;
              break;
            }
            return _context4.a(2);
          case 2:
            if (!(!sessionCode || activeSessionCodes.length === 0)) {
              _context4.n = 3;
              break;
            }
            return _context4.a(2);
          case 3:
            if (activeSessionCodes.includes(sessionCode)) {
              _context4.n = 4;
              break;
            }
            return _context4.a(2);
          case 4:
            shouldRefreshBoxes = reason === 'conversion_status_updated';
            scheduleEconomyRealtimeRefresh(120, {
              refreshBoxes: shouldRefreshBoxes
            });
          case 5:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return function (_x11) {
      return _ref12.apply(this, arguments);
    };
  }());
  LMB_EVENT_BUS.on('system:notification', function (payload) {
    showUserRealtimeNotice(payload, 'system');
  });
  LMB_EVENT_BUS.on('user:notification', function (payload) {
    var _payload$payload;
    notifyDbg('eventbus-user-notification', {
      type: (payload === null || payload === void 0 ? void 0 : payload.type) || '',
      sessionCode: (payload === null || payload === void 0 ? void 0 : payload.sessionCode) || (payload === null || payload === void 0 ? void 0 : payload.session_code) || (payload === null || payload === void 0 || (_payload$payload = payload.payload) === null || _payload$payload === void 0 ? void 0 : _payload$payload.session_code) || ''
    });
    showUserRealtimeNotice(payload, 'notification');
  });
}

// ─── SSE Chat Connection ──────────────────────────────────────────────────────

var CHAT_SSE_STALE_MS = 90000;
var CHAT_SSE_WATCHDOG_TICK_MS = 20000;
function getRealtimeScopeCodes() {
  var codes = [];
  var pushCode = function pushCode(value) {
    var normalized = String(value || '').trim().toUpperCase();
    if (!normalized) return;
    if (codes.includes(normalized)) return;
    codes.push(normalized);
  };
  pushCode(state.sessionCode);
  pushCode(state.chat.sessionCode);
  pushCode(localStorage.getItem(getChatSessionStorageKey()));
  return codes;
}
function getRealtimeScopeSignature() {
  var codes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getRealtimeScopeCodes();
  return codes.join(',');
}
function markChatSseActivity() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'event';
  state.chat.sseLastEventAt = Date.now();
  notifyDbg('sse-activity', {
    source: source,
    at: state.chat.sseLastEventAt,
    url: state.chat.sseUrl || ''
  });
}
function scheduleChatSseRecovery() {
  var delayMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1200;
  if (state.chat.sseRecoveryTimer) return;
  state.chat.sseRecoveryTimer = setTimeout(function () {
    state.chat.sseRecoveryTimer = null;
    if (document.hidden) return;
    // Native EventSource already auto-reconnects while CONNECTING (readyState=0).
    // Avoid stop/start loops that can create reconnect storms and repeated /events calls.
    if (state.chat.sseSource && state.chat.sseSource.readyState === 0) return;
    stopChatSSE();
    startChatSSE();
  }, Math.max(500, Number(delayMs) || 1200));
}
function ensureChatSseRecoveryBindings() {
  if (state.chat.sseRecoveryBindingsReady) return;
  state.chat.sseRecoveryBindingsReady = true;
  window.addEventListener('focus', function () {
    if (!state.chat.notificationRuntimeReady) return;
    scheduleChatSseRecovery(600);
  });
  document.addEventListener('visibilitychange', function () {
    if (!state.chat.notificationRuntimeReady || document.hidden) return;
    scheduleChatSseRecovery(450);
  });
}
function ensureChatSseWatchdog() {
  if (state.chat.sseWatchdogTimer) return;
  state.chat.sseWatchdogTimer = setInterval(function () {
    if (!state.chat.notificationRuntimeReady) return;
    if (document.hidden) return;
    var desiredScopeSignature = getRealtimeScopeSignature();
    var currentScopeSignature = String(state.chat.sseScopeSignature || '');
    if (desiredScopeSignature !== currentScopeSignature) {
      notifyDbg('sse-watchdog-scope-drift', {
        desiredScopeSignature: desiredScopeSignature,
        currentScopeSignature: currentScopeSignature,
        url: state.chat.sseUrl || ''
      });
      scheduleChatSseRecovery(250);
      return;
    }
    var hasRealtimeConn = !!(state.chat.sseSource || state.chat.sseClient);
    if (!hasRealtimeConn) {
      scheduleChatSseRecovery(400);
      return;
    }
    var lastAt = Number(state.chat.sseLastEventAt || 0);
    if (!lastAt) {
      markChatSseActivity('watchdog-bootstrap');
      return;
    }
    var idleMs = Date.now() - lastAt;
    if (idleMs < CHAT_SSE_STALE_MS) return;
    notifyDbg('sse-watchdog-stale', {
      idleMs: idleMs,
      staleMs: CHAT_SSE_STALE_MS,
      url: state.chat.sseUrl || ''
    });
    scheduleChatSseRecovery(300);
  }, CHAT_SSE_WATCHDOG_TICK_MS);
}
function getLatestSupportMessageTs() {
  var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.chat.messages;
  return (Array.isArray(messages) ? messages : []).reduce(function (max, msg) {
    if (String((msg === null || msg === void 0 ? void 0 : msg.sender_type) || '').toLowerCase() === 'customer') return max;
    return Math.max(max, getChatMessageTs(msg));
  }, 0);
}
function stopChatPolling() {
  if (state.chat.pollingTimer) {
    clearTimeout(state.chat.pollingTimer);
    state.chat.pollingTimer = null;
  }
  state.chat.pollingInFlight = null;
}
function scheduleChatPolling() {
  var delayMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 250;
  if (!state.chat.sessionCode) return;
  if (state.chat.pollingTimer || state.chat.pollingInFlight) return;
  state.chat.pollingTimer = setTimeout(function () {
    state.chat.pollingTimer = null;
    runChatPolling().catch(function () {});
  }, Math.max(120, Number(delayMs) || 250));
}
function runChatPolling() {
  return _runChatPolling.apply(this, arguments);
}
function _runChatPolling() {
  _runChatPolling = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee54() {
    var sessionCode, latestSupportTs;
    return _regenerator().w(function (_context54) {
      while (1) switch (_context54.n) {
        case 0:
          if (!(!state.chat.sessionCode || document.hidden)) {
            _context54.n = 1;
            break;
          }
          return _context54.a(2);
        case 1:
          if (!state.chat.pollingInFlight) {
            _context54.n = 2;
            break;
          }
          return _context54.a(2, state.chat.pollingInFlight);
        case 2:
          sessionCode = String(state.chat.sessionCode || '').trim().toUpperCase();
          if (sessionCode) {
            _context54.n = 3;
            break;
          }
          return _context54.a(2);
        case 3:
          state.chat.pollingFallbackMode = true;
          latestSupportTs = Math.max(Number(state.chat.pollingSince || 0), getLatestSupportMessageTs());
          state.chat.pollingInFlight = apiJson("/api/chat/poll/".concat(encodeURIComponent(sessionCode), "?since=").concat(latestSupportTs), {
            method: 'GET',
            timeoutMs: 32000
          }).then(function (rs) {
            markChatSseActivity('poll-fallback');
            var items = Array.isArray(rs === null || rs === void 0 ? void 0 : rs.messages) ? rs.messages : [];
            if (items.length > 0) {
              var nextSince = latestSupportTs;
              items.forEach(function (raw) {
                var msg = raw && _typeof(raw) === 'object' ? raw : null;
                if (!msg) return;
                nextSince = Math.max(nextSince, getChatMessageTs(msg));
                enqueueRealtimeEvent('chat:new_message', msg);
              });
              state.chat.pollingSince = nextSince;
            }
            scheduleChatPolling(items.length > 0 ? 300 : 2000);
          }).catch(function (err) {
            var msg = String((err === null || err === void 0 ? void 0 : err.message) || '').toLowerCase();
            if (msg.includes('không tìm thấy phiên chat') || msg.includes('hết hạn')) {
              state.chat.sessionCode = '';
              state.chat.profileCompleted = false;
              localStorage.removeItem(getChatSessionStorageKey());
              localStorage.removeItem(getChatUnreadStorageKey());
              setChatReadyUI(false);
              showToast('ℹ️ Phiên chat đã hết hạn, vui lòng bắt đầu chat lại.');
              return;
            }
            scheduleChatPolling(1800);
          }).finally(function () {
            state.chat.pollingInFlight = null;
          });
          return _context54.a(2, state.chat.pollingInFlight);
      }
    }, _callee54);
  }));
  return _runChatPolling.apply(this, arguments);
}
function startChatSSE() {
  bindRealtimeEventConsumers();
  ensureChatSseRecoveryBindings();
  ensureChatSseWatchdog();
  var preferredSessionCode = String(state.chat.sessionCode || localStorage.getItem(getChatSessionStorageKey()) || '').trim().toUpperCase();
  if (preferredSessionCode !== String(state.chat.sessionCode || '').trim().toUpperCase()) {
    state.chat.sessionCode = preferredSessionCode;
  }
  if (shouldUseLegacyChatPollingTransport()) {
    stopChatSSE();
    state.chat.pollingSince = Math.max(Number(state.chat.pollingSince || 0), getLatestSupportMessageTs());
    scheduleChatPolling(120);
    return;
  }
  var openSse = function openSse(nextUrl) {
    if ((state.chat.sseSource || state.chat.sseClient) && state.chat.sseUrl === nextUrl) return;
    rtDbg('sse-open-attempt', {
      nextUrl: nextUrl,
      sessionCode: state.chat.sessionCode || ''
    });
    markChatSseActivity('open-attempt');
    if (state.chat.sseClient) {
      state.chat.sseClient.close();
      state.chat.sseClient = null;
    }
    if (state.chat.sseSource) {
      state.chat.sseSource.close();
      state.chat.sseSource = null;
    }
    var useMobileBatchClient = isMobileLiteEffects();
    if (window.MobileSSEBatchClient && useMobileBatchClient) {
      rtDbg('sse-open-mobile-client', {
        nextUrl: nextUrl
      });
      state.chat.sseClient = new window.MobileSSEBatchClient({
        online_status: function online_status(d) {
          markChatSseActivity('online_status-mobile');
          enqueueRealtimeEvent('chat:online_status', d);
        },
        new_message: function new_message(d) {
          markChatSseActivity('new_message-mobile');
          var msg = d.message || d;
          if (!msg) return;
          rtDbg('mobile-client-new-message', {
            sessionCode: d.sessionCode || msg.session_code || '',
            sender: msg.sender_type || ''
          });
          var scopedMessage = _objectSpread(_objectSpread({}, msg), {}, {
            session_code: msg.session_code || d.sessionCode
          });
          enqueueRealtimeEvent('chat:new_message', scopedMessage);
        },
        chat_message: function chat_message(d) {
          markChatSseActivity('chat_message-mobile');
          var msg = d.message || d;
          if (!msg) return;
          rtDbg('mobile-client-chat-message', {
            sessionCode: d.sessionCode || msg.session_code || '',
            sender: msg.sender_type || ''
          });
          var scopedMessage = _objectSpread(_objectSpread({}, msg), {}, {
            session_code: msg.session_code || d.sessionCode
          });
          enqueueRealtimeEvent('chat:new_message', scopedMessage);
        },
        admin_message: function admin_message(d) {
          markChatSseActivity('admin_message-mobile');
          var msg = d.message || d;
          if (!msg) return;
          rtDbg('mobile-client-admin-message', {
            sessionCode: d.sessionCode || msg.session_code || '',
            sender: msg.sender_type || ''
          });
          var scopedMessage = _objectSpread(_objectSpread({}, msg), {}, {
            session_code: msg.session_code || d.sessionCode
          });
          enqueueRealtimeEvent('chat:new_message', scopedMessage);
        },
        typing: function typing(d) {
          markChatSseActivity('typing-mobile');
          if (state.chat.sessionCode && d.sessionCode && String(d.sessionCode).toUpperCase() !== String(state.chat.sessionCode).toUpperCase()) return;
          enqueueRealtimeEvent('chat:typing', d);
        },
        stop_typing: function stop_typing(d) {
          markChatSseActivity('stop_typing-mobile');
          if (state.chat.sessionCode && d.sessionCode && String(d.sessionCode).toUpperCase() !== String(state.chat.sessionCode).toUpperCase()) return;
          enqueueRealtimeEvent('chat:stop_typing', d);
        },
        message_status: function message_status(d) {
          markChatSseActivity('message_status-mobile');
          if (state.chat.sessionCode && d.sessionCode && String(d.sessionCode).toUpperCase() !== String(state.chat.sessionCode).toUpperCase()) return;
          enqueueRealtimeEvent('chat:message_status', d);
        },
        wallet_update: function wallet_update(d) {
          markChatSseActivity('wallet_update-mobile');
          enqueueRealtimeEvent('wallet:update', d);
        },
        system_notification: function system_notification(d) {
          markChatSseActivity('system_notification-mobile');
          enqueueRealtimeEvent('system:notification', d);
        },
        notification: function notification(d) {
          markChatSseActivity('notification-mobile');
          enqueueRealtimeEvent('user:notification', d);
        }
      }, {
        batchSize: 20,
        frameBudgetMs: 8,
        hiddenFlushMs: 260,
        maxQueueSize: 500
      });
      state.chat.sseClient.connect(nextUrl);
      state.chat.sseUrl = nextUrl;
      rtDbg('sse-opened-mobile-client', {
        nextUrl: nextUrl
      });
      return;
    }
    rtDbg('sse-open-native-eventsource', {
      nextUrl: nextUrl
    });
    state.chat.sseSource = new EventSource(nextUrl);
    state.chat.sseUrl = nextUrl;
    rtDbg('sse-opened-eventsource', {
      nextUrl: nextUrl
    });
    state.chat.sseSource.addEventListener('open', function () {
      markChatSseActivity('open-native');
    });
    state.chat.sseSource.addEventListener('online_status', function (e) {
      try {
        markChatSseActivity('online_status-native');
        var d = JSON.parse(e.data);
        enqueueRealtimeEvent('chat:online_status', d);
      } catch (_) {}
    });
    var onRealtimeMessage = function onRealtimeMessage(e) {
      try {
        markChatSseActivity('message-native');
        var d = JSON.parse(e.data);
        var msg = d.message || d;
        if (!msg) return;
        rtDbg('sse-message-raw', {
          eventType: 'new_message',
          id: msg.id || '',
          sender: msg.sender_type || '',
          sessionCode: msg.session_code || d.sessionCode || ''
        });
        if (LMB_DEV_MONITOR.enabled) {
          LMB_DEV_MONITOR.sseCounter += 1;
          var elapsed = Date.now() - LMB_DEV_MONITOR.sseWindowStart;
          if (elapsed >= 5000) {
            var rate = (LMB_DEV_MONITOR.sseCounter / (elapsed / 1000)).toFixed(2);
            console.log('[LMB][sse] message-rate=%s/s', rate);
            LMB_DEV_MONITOR.sseCounter = 0;
            LMB_DEV_MONITOR.sseWindowStart = Date.now();
          }
        }
        var scopedMessage = _objectSpread(_objectSpread({}, msg), {}, {
          session_code: msg.session_code || d.sessionCode
        });
        enqueueRealtimeEvent('chat:new_message', scopedMessage);
      } catch (_) {}
    };
    state.chat.sseSource.addEventListener('new_message', onRealtimeMessage);
    state.chat.sseSource.addEventListener('chat_message', onRealtimeMessage);
    state.chat.sseSource.addEventListener('admin_message', onRealtimeMessage);
    state.chat.sseSource.addEventListener('typing', function (e) {
      try {
        markChatSseActivity('typing-native');
        var d = JSON.parse(e.data);
        if (state.chat.sessionCode && d.sessionCode && String(d.sessionCode).toUpperCase() !== String(state.chat.sessionCode).toUpperCase()) return;
        enqueueRealtimeEvent('chat:typing', d);
      } catch (_) {}
    });
    state.chat.sseSource.addEventListener('stop_typing', function (e) {
      try {
        markChatSseActivity('stop_typing-native');
        var d = JSON.parse(e.data);
        if (state.chat.sessionCode && d.sessionCode && String(d.sessionCode).toUpperCase() !== String(state.chat.sessionCode).toUpperCase()) return;
        enqueueRealtimeEvent('chat:stop_typing', d);
      } catch (_) {}
    });
    state.chat.sseSource.addEventListener('message_status', function (e) {
      try {
        markChatSseActivity('message_status-native');
        var d = JSON.parse(e.data);
        enqueueRealtimeEvent('chat:message_status', d);
      } catch (_) {}
    });
    state.chat.sseSource.addEventListener('wallet_update', function (e) {
      try {
        markChatSseActivity('wallet_update-native');
        var d = JSON.parse(e.data);
        enqueueRealtimeEvent('wallet:update', d);
      } catch (_) {}
    });
    state.chat.sseSource.addEventListener('system_notification', function (e) {
      try {
        markChatSseActivity('system_notification-native');
        var d = JSON.parse(e.data);
        enqueueRealtimeEvent('system:notification', d);
      } catch (_) {}
    });
    state.chat.sseSource.addEventListener('notification', function (e) {
      try {
        var _d$payload;
        markChatSseActivity('notification-native');
        var d = JSON.parse(e.data);
        notifyDbg('sse-notification-received', {
          type: (d === null || d === void 0 ? void 0 : d.type) || '',
          sessionCode: (d === null || d === void 0 ? void 0 : d.sessionCode) || (d === null || d === void 0 ? void 0 : d.session_code) || (d === null || d === void 0 || (_d$payload = d.payload) === null || _d$payload === void 0 ? void 0 : _d$payload.session_code) || '',
          chatSessionCode: state.chat.sessionCode || '',
          gameSessionCode: state.sessionCode || ''
        });
        enqueueRealtimeEvent('user:notification', d);
      } catch (err) {
        notifyDbg('sse-notification-parse-error', {
          message: (err === null || err === void 0 ? void 0 : err.message) || String(err || '')
        });
      }
    });
    state.chat.sseSource.onerror = function () {
      // Native EventSource auto-reconnects by itself; do not force a manual
      // stop/start here to prevent duplicated reconnect loops.
      rtDbg('sse-error', {
        url: state.chat.sseUrl || ''
      });
      notifyDbg('sse-error', {
        url: state.chat.sseUrl || '',
        chatSessionCode: state.chat.sessionCode || '',
        gameSessionCode: state.sessionCode || ''
      });
      if (shouldUseLegacyChatPollingTransport()) {
        stopChatSSE();
        state.chat.pollingSince = Math.max(Number(state.chat.pollingSince || 0), getLatestSupportMessageTs());
        scheduleChatPolling(300);
      }
    };
  };
  var init = /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var base, scopedSessionCodes, scopedSessionCode, nextUrl, query, _t5;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            if (!window.LMB_DISABLE_SSE) {
              _context5.n = 1;
              break;
            }
            throw new Error('SSE disabled by server policy');
          case 1:
            _context5.p = 1;
            _context5.n = 2;
            return resolveRealtimeSseBase();
          case 2:
            base = _context5.v;
            scopedSessionCodes = getRealtimeScopeCodes();
            scopedSessionCode = scopedSessionCodes[0] || '';
            state.chat.sseScopeSignature = getRealtimeScopeSignature(scopedSessionCodes);
            nextUrl = '/events';
            if (!(base === '/events')) {
              _context5.n = 3;
              break;
            }
            query = scopedSessionCodes.length > 0 ? "?sessionCode=".concat(encodeURIComponent(scopedSessionCodes.join(','))) : '';
            nextUrl = "/events".concat(query);
            _context5.n = 5;
            break;
          case 3:
            if (scopedSessionCode) {
              _context5.n = 4;
              break;
            }
            return _context5.a(2);
          case 4:
            nextUrl = "/api/chat/events/".concat(encodeURIComponent(scopedSessionCode));
          case 5:
            openSse(nextUrl);
            rtDbg('sse-init-success', {
              nextUrl: nextUrl,
              base: base
            });
            notifyDbg('sse-init-success', {
              nextUrl: nextUrl,
              base: base,
              scopedSessionCode: scopedSessionCode,
              scopedSessionCodes: scopedSessionCodes,
              chatSessionCode: state.chat.sessionCode || '',
              gameSessionCode: state.sessionCode || ''
            });
            _context5.n = 7;
            break;
          case 6:
            _context5.p = 6;
            _t5 = _context5.v;
            state.chat.sseSource = null;
            state.chat.sseUrl = '';
            rtDbg('sse-init-error', {
              message: (_t5 === null || _t5 === void 0 ? void 0 : _t5.message) || String(_t5 || '')
            });
            notifyDbg('sse-init-error', {
              message: (_t5 === null || _t5 === void 0 ? void 0 : _t5.message) || String(_t5 || '')
            });
            state.chat.pollingSince = Math.max(Number(state.chat.pollingSince || 0), getLatestSupportMessageTs());
            scheduleChatPolling(400);
          case 7:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 6]]);
    }));
    return function init() {
      return _ref13.apply(this, arguments);
    };
  }();
  init().catch(function () {});
}
function stopChatSSE() {
  stopChatPolling();
  if (state.chat.sseRecoveryTimer) {
    clearTimeout(state.chat.sseRecoveryTimer);
    state.chat.sseRecoveryTimer = null;
  }
  if (state.chat.sseClient) {
    state.chat.sseClient.close();
    state.chat.sseClient = null;
  }
  if (state.chat.sseSource) {
    state.chat.sseSource.close();
    state.chat.sseSource = null;
  }
  state.chat.sseUrl = '';
  state.chat.sseScopeSignature = '';
  clearRealtimeQueueDrainTimer();
  if (state.realtimeQueueRaf) {
    cancelAnimationFrame(state.realtimeQueueRaf);
    state.realtimeQueueRaf = 0;
  }
  state.realtimeQueue = [];
}

// Show "Admin đang nhập..." typing indicator bubble
function showChatTypingBubble() {
  var el = document.getElementById('chatTypingBubble');
  if (!el) {
    el = document.createElement('div');
    el.id = 'chatTypingBubble';
    el.className = 'chat-typing-bubble';
    el.innerHTML = "<span class=\"typing-dot\"></span><span class=\"typing-dot\"></span><span class=\"typing-dot\"></span><span class=\"typing-label\">".concat(DEFAULT_CHAT_AGENT_NAME, " \u0111ang nh\u1EADp...</span>");
    var _box = document.getElementById('cmsgs');
    if (_box) _box.parentNode.insertBefore(el, _box.nextSibling);
  }
  el.style.display = 'flex';
  var box = document.getElementById('cmsgs');
  if (box) box.scrollTop = box.scrollHeight;
}
function hideChatTypingBubble() {
  var el = document.getElementById('chatTypingBubble');
  if (el) el.style.display = 'none';
}

// Emit typing event to server
var _chatTypingTimer = null;
var _chatIsTyping = false;
function emitChatTyping() {
  if (!state.chat.sessionCode) return;
  if (!_chatIsTyping) {
    _chatIsTyping = true;
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        session_code: state.chat.sessionCode,
        role: 'player',
        typing: true
      })
    }).catch(function () {});
  }
  clearTimeout(_chatTypingTimer);
  _chatTypingTimer = setTimeout(function () {
    _chatIsTyping = false;
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        session_code: state.chat.sessionCode,
        role: 'player',
        typing: false
      })
    }).catch(function () {});
  }, 2500);
}
function getChatSessionStorageKey() {
  return CHAT_GLOBAL_KEYS.sessionCode;
}
function getChatProfileStorageKey() {
  return CHAT_GLOBAL_KEYS.profile;
}
function getChatSeenStorageKey() {
  return CHAT_GLOBAL_KEYS.lastSeenAt;
}
function getChatUnreadStorageKey() {
  return CHAT_GLOBAL_KEYS.unreadCount;
}
function migrateLegacyChatStorage() {
  try {
    var currentSessionCode = localStorage.getItem(getChatSessionStorageKey()) || '';
    if (!currentSessionCode) {
      for (var i = 0; i < localStorage.length; i += 1) {
        var key = localStorage.key(i) || '';
        if (!/:chatSessionCode$/.test(key)) continue;
        var value = String(localStorage.getItem(key) || '').trim();
        if (value) {
          localStorage.setItem(getChatSessionStorageKey(), value);
          break;
        }
      }
    }
    var currentProfile = localStorage.getItem(getChatProfileStorageKey()) || '';
    if (!currentProfile) {
      for (var _i = 0; _i < localStorage.length; _i += 1) {
        var _key = localStorage.key(_i) || '';
        if (!/:chatProfile$/.test(_key)) continue;
        var _value = localStorage.getItem(_key);
        if (_value) {
          localStorage.setItem(getChatProfileStorageKey(), _value);
          break;
        }
      }
    }
  } catch (_) {}
}
function getChatMessageTs(message) {
  var raw = (message === null || message === void 0 ? void 0 : message.created_at) || (message === null || message === void 0 ? void 0 : message.createdAt) || (message === null || message === void 0 ? void 0 : message.updated_at) || 0;
  var ts = new Date(raw).getTime();
  return Number.isFinite(ts) && ts > 0 ? ts : 0;
}
function isCustomerChatMessage(message) {
  return String((message === null || message === void 0 ? void 0 : message.sender_type) || '').toLowerCase() === 'customer';
}
function ensureChatMessageUiMeta(message) {
  if (!message || _typeof(message) !== 'object') return {
    status: 'sent'
  };
  if (!message._ui || _typeof(message._ui) !== 'object') {
    message._ui = {};
  }
  return message._ui;
}
function resolveOutgoingMessageStatus(message) {
  var ui = (message === null || message === void 0 ? void 0 : message._ui) || {};
  var explicit = String(ui.status || '').trim().toLowerCase();
  if (explicit) return explicit;
  if (!isCustomerChatMessage(message)) return '';
  if (message !== null && message !== void 0 && message.is_read || message !== null && message !== void 0 && message.read_at) return 'seen';
  return 'sent';
}
function hydrateChatMessageForUi(raw) {
  if (!raw || _typeof(raw) !== 'object') return null;
  var msg = raw;
  var ui = ensureChatMessageUiMeta(msg);
  if (isCustomerChatMessage(msg) && !String(ui.status || '').trim()) {
    ui.status = resolveOutgoingMessageStatus(msg);
  }
  return msg;
}
function hydrateChatMessageListForUi() {
  var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return (Array.isArray(messages) ? messages : []).map(function (m) {
    return hydrateChatMessageForUi(m);
  }).filter(Boolean);
}
function createOptimisticTextMessage(text) {
  var _document$getElementB8;
  var nowIso = new Date().toISOString();
  var name = (((_document$getElementB8 = document.getElementById('chatCustomerName')) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value) || 'Khach hang').trim() || 'Khach hang';
  var clientId = "tmp_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 7));
  return {
    id: clientId,
    session_code: state.chat.sessionCode,
    sender_type: 'customer',
    sender_name: name,
    message: String(text || ''),
    message_type: 'text',
    created_at: nowIso,
    updated_at: nowIso,
    _ui: {
      clientId: clientId,
      optimistic: true,
      status: 'pending',
      retryPayload: {
        type: 'text',
        message: String(text || '')
      }
    }
  };
}
function markChatMessageFailedById(messageId) {
  var errorMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var targetId = String(messageId || '').trim();
  if (!targetId || !Array.isArray(state.chat.messages)) return false;
  var idx = state.chat.messages.findIndex(function (m) {
    return String((m === null || m === void 0 ? void 0 : m.id) || '') === targetId;
  });
  if (idx < 0) return false;
  var msg = state.chat.messages[idx];
  var ui = ensureChatMessageUiMeta(msg);
  ui.optimistic = false;
  ui.status = 'failed';
  ui.error = String(errorMessage || '').trim();
  return true;
}
function replaceOptimisticMessage(clientId, serverMessage) {
  var cid = String(clientId || '').trim();
  var hydrated = hydrateChatMessageForUi(serverMessage);
  if (!hydrated) return false;
  if (!cid || !Array.isArray(state.chat.messages)) return false;
  var idx = state.chat.messages.findIndex(function (m) {
    return String((m === null || m === void 0 ? void 0 : m.id) || '') === cid;
  });
  if (idx < 0) return false;
  var serverId = String(hydrated.id || '').trim();
  if (serverId) {
    var existingServerIdx = state.chat.messages.findIndex(function (m, i) {
      return i !== idx && String((m === null || m === void 0 ? void 0 : m.id) || '') === serverId;
    });
    if (existingServerIdx >= 0) {
      state.chat.messages.splice(idx, 1);
      return true;
    }
  }
  state.chat.messages[idx] = hydrated;
  return true;
}
function applyIncomingOutgoingStatusUpdate() {
  var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var payloadSession = String((payload === null || payload === void 0 ? void 0 : payload.sessionCode) || (payload === null || payload === void 0 ? void 0 : payload.session_code) || '').trim().toUpperCase();
  var activeSession = String(state.chat.sessionCode || '').trim().toUpperCase();
  if (payloadSession && activeSession && payloadSession !== activeSession) return;
  var status = String((payload === null || payload === void 0 ? void 0 : payload.status) || '').trim().toLowerCase();
  if (!status || !Array.isArray(state.chat.messages) || !state.chat.messages.length) return;
  var rawMsgId = Number((payload === null || payload === void 0 ? void 0 : payload.messageId) || (payload === null || payload === void 0 ? void 0 : payload.message_id) || 0);
  var hasNumericMsgId = Number.isFinite(rawMsgId) && rawMsgId > 0;
  var mutated = false;
  for (var i = 0; i < state.chat.messages.length; i += 1) {
    var msg = state.chat.messages[i];
    if (!isCustomerChatMessage(msg)) continue;
    var ui = ensureChatMessageUiMeta(msg);
    if (ui.status === 'pending' || ui.status === 'failed') continue;
    var numericId = Number((msg === null || msg === void 0 ? void 0 : msg.id) || 0);
    if (hasNumericMsgId && Number.isFinite(numericId) && numericId > rawMsgId) continue;
    if (status === 'seen') {
      if (ui.status !== 'seen') {
        ui.status = 'seen';
        mutated = true;
      }
      continue;
    }
    if (status === 'delivered') {
      if (ui.status !== 'seen' && ui.status !== 'delivered') {
        ui.status = 'delivered';
        mutated = true;
      }
    }
  }
  if (mutated) scheduleChatRender();
}
function formatChatMessageDateTime(raw) {
  var ts = new Date(raw || 0).getTime();
  if (!Number.isFinite(ts) || ts <= 0) return '--/-- --:--';
  var d = new Date(ts);
  var day = String(d.getDate()).padStart(2, '0');
  var month = String(d.getMonth() + 1).padStart(2, '0');
  var hour = String(d.getHours()).padStart(2, '0');
  var minute = String(d.getMinutes()).padStart(2, '0');
  return "".concat(day, "/").concat(month, " ").concat(hour, ":").concat(minute);
}
function getUnseenSupportMessages() {
  var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.chat.messages;
  return (Array.isArray(messages) ? messages : []).filter(function (m) {
    if (m.sender_type === 'customer') return false;
    return getChatMessageTs(m) > (state.chat.lastSeenAt || 0);
  });
}
function capChatMessages() {
  var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var list = Array.isArray(messages) ? messages : [];
  var cap = Math.max(20, Number(state.chat.maxDomMessages || 100));
  if (list.length <= cap) return list;
  return list.slice(-cap);
}
function appendChatMessage(message) {
  if (!message || _typeof(message) !== 'object') return false;
  var hydratedMessage = hydrateChatMessageForUi(message);
  var id = hydratedMessage.id;
  if (id && Array.isArray(state.chat.messages) && state.chat.messages.some(function (m) {
    return m.id === id;
  })) {
    return false;
  }
  if (!Array.isArray(state.chat.messages)) state.chat.messages = [];
  state.chat.messages.push(hydratedMessage);
  var cap = Math.max(20, Number(state.chat.maxDomMessages || 100));
  if (state.chat.messages.length > cap) {
    state.chat.messages.splice(0, state.chat.messages.length - cap);
  }
  return true;
}
function getVirtualizedChatWindow(messages, box) {
  var list = Array.isArray(messages) ? messages : [];
  var total = list.length;
  var threshold = Math.max(40, Number(state.chat.virtualizationThreshold || 90));
  if (!box || total <= threshold) {
    return {
      start: 0,
      end: total,
      topPad: 0,
      bottomPad: 0,
      virtualized: false
    };
  }
  var estimate = Math.max(56, Number(state.chat.virtualRowEstimate || 84));
  var overscan = Math.max(4, Number(state.chat.virtualOverscan || 14));
  var viewportH = Math.max(240, Number(box.clientHeight || 0));
  var baseCount = Math.max(20, Math.ceil(viewportH / estimate));
  var windowSize = Math.max(baseCount, Number(state.chat.virtualWindowSize || 64));
  var approxStart = Math.max(0, Math.floor(Number(box.scrollTop || 0) / estimate) - overscan);
  var start = Math.min(Math.max(0, total - windowSize), approxStart);
  var end = Math.min(total, start + windowSize + overscan * 2);
  return {
    start: start,
    end: end,
    topPad: Math.max(0, Math.round(start * estimate)),
    bottomPad: Math.max(0, Math.round((total - end) * estimate)),
    virtualized: true
  };
}
function getOutgoingChatStatusLabel(message) {
  var status = resolveOutgoingMessageStatus(message);
  if (status === 'pending') return 'Dang gui...';
  if (status === 'failed') return 'Gui that bai';
  if (status === 'delivered') return 'Da nhan';
  if (status === 'seen') return 'Da xem';
  return 'Da gui';
}
function syncChatUnreadUi() {
  var preferredMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var unseenMessages = getUnseenSupportMessages(state.chat.messages);
  var unseen = unseenMessages.length;
  var prevUnread = Number(state.chat.lastUnreadCount || 0);
  updateChatFabBadge(unseen);
  if (!isChatPanelOpen() && unseen > prevUnread) {
    var latestMsg = preferredMessage || unseenMessages[unseenMessages.length - 1];
    if (latestMsg) {
      var currentText = String(latestMsg.message || '').replace(/^([🖼️📎]\s*)/, '').trim();
      var wasRecent = Date.now() - Number(state.chat.lastToastAt || 0) < 900;
      var isSameContent = currentText && currentText === String(state.chat.lastToastText || '');
      if (!(wasRecent && isSameContent)) {
        showChatToast(latestMsg);
        showChatFabHintMessage(latestMsg);
      }
    }
  }
  state.chat.lastUnreadCount = unseen;
}
function scheduleChatUnreadSync() {
  var preferredMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (state.chat.unreadSyncTimer) return;
  state.chat.unreadSyncTimer = setTimeout(function () {
    state.chat.unreadSyncTimer = null;
    syncChatUnreadUi(preferredMessage);
  }, 140);
}
function isChatPanelOpen() {
  var panel = document.getElementById('cpanel');
  return !!(panel && panel.classList.contains('open'));
}
function isNearChatBottom(box) {
  var thresholdPx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 96;
  if (!box) return false;
  var remaining = box.scrollHeight - (box.scrollTop + box.clientHeight);
  return remaining <= Math.max(16, Number(thresholdPx) || 96);
}
function scheduleChatRender() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fresh = !!options.fresh;
  if (!state.chat.pendingFreshRender && fresh) {
    state.chat.pendingFreshRender = true;
  }
  if (state.chat.renderTimer) {
    // If a fresh render is requested, shorten the existing timer
    if (fresh && state.chat.renderTimerDelay > 50) {
      clearTimeout(state.chat.renderTimer);
      state.chat.renderTimer = null;
    } else {
      return;
    }
  }
  var delay = fresh ? 35 : 120;
  state.chat.renderTimerDelay = delay;
  state.chat.renderTimer = setTimeout(function () {
    state.chat.renderTimer = null;
    state.chat.renderTimerDelay = 0;
    var useFresh = !!state.chat.pendingFreshRender;
    state.chat.pendingFreshRender = false;
    renderChatMessages({
      forceFresh: useFresh
    });
  }, delay);
}
function showChatToast(msg) {
  var stack = ensureChatToastStack();
  if (!stack || !state.chat.toastTemplate) return;
  var panelOpen = isChatPanelOpen();
  var lifetime = panelOpen ? 3600 : 5600;
  var textValue = String((msg === null || msg === void 0 ? void 0 : msg.message) || '').replace(/^([🖼️📎]\s*)/, '').trim();
  // Strip HTML tags for toast preview (support messages may contain rich HTML)
  var plainTextValue = function () {
    if (!textValue) return '';
    if (!/<[a-z][\s\S]*?>/i.test(textValue)) return textValue;
    var tmp = document.createElement('div');
    tmp.innerHTML = textValue;
    return (tmp.innerText || tmp.textContent || '').trim();
  }();
  var preview = (plainTextValue || 'Bạn có tin nhắn mới').slice(0, 90);
  rtDbg('toast-show', {
    sessionCode: state.chat.sessionCode || '',
    panelOpen: panelOpen,
    text: preview
  });
  var now = Date.now();
  var bucket = state.chat.toastGroupBucket;
  var groupWindowMs = getChatToastGroupWindowMs();
  var canGroup = !!(groupWindowMs > 0 && bucket && bucket.el && bucket.el.isConnected && !bucket.el.classList.contains('is-closing') && bucket.panelOpen === panelOpen && now - Number(bucket.lastAt || 0) <= groupWindowMs);
  if (canGroup) {
    var nextCount = Math.max(2, Number(bucket.count || 1) + 1);
    updateChatToastNode(bucket.el, {
      panelOpen: panelOpen,
      preview: preview,
      count: nextCount,
      ts: (msg === null || msg === void 0 ? void 0 : msg.created_at) || (msg === null || msg === void 0 ? void 0 : msg.createdAt) || Date.now()
    });
    bucket.count = nextCount;
    bucket.lastAt = now;
    var existingItem = Array.isArray(state.chat.toastItems) ? state.chat.toastItems.find(function (item) {
      return (item === null || item === void 0 ? void 0 : item.el) === bucket.el;
    }) : null;
    if (existingItem !== null && existingItem !== void 0 && existingItem.timer) clearTimeout(existingItem.timer);
    var nextTimer = setTimeout(function () {
      return hideChatToast(bucket.el);
    }, lifetime);
    if (existingItem) existingItem.timer = nextTimer;
    state.chat.lastToastText = preview;
    state.chat.lastToastAt = now;
    return;
  }
  var clone = state.chat.toastTemplate.cloneNode(true);
  clone.classList.remove('is-template', 'visible', 'in-chat', 'is-closing');
  clone.removeAttribute('id');
  clone.removeAttribute('onclick');
  clone.querySelectorAll('[id]').forEach(function (el) {
    return el.removeAttribute('id');
  });
  clone.style.setProperty('--toast-life', "".concat(lifetime, "ms"));
  clone.classList.toggle('in-chat', panelOpen);
  updateChatToastNode(clone, {
    panelOpen: panelOpen,
    preview: preview,
    count: 1,
    ts: (msg === null || msg === void 0 ? void 0 : msg.created_at) || (msg === null || msg === void 0 ? void 0 : msg.createdAt) || Date.now()
  });
  var closeBtn = clone.querySelector('.chat-msg-toast-x');
  if (closeBtn) {
    closeBtn.removeAttribute('onclick');
    closeBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      hideChatToast(clone);
    }, {
      passive: true
    });
  }
  clone.addEventListener('click', function () {
    if (clone.dataset.swiped === '1') {
      clone.dataset.swiped = '0';
      return;
    }
    hideChatToast(clone);
    resetChatFabHintMessage();
    togChat();
  }, {
    passive: true
  });
  attachSwipeDismissToToast(clone);
  stack.prepend(clone);
  requestAnimationFrame(function () {
    return clone.classList.add('visible');
  });
  if (!Array.isArray(state.chat.toastItems)) state.chat.toastItems = [];
  state.chat.toastItems.unshift({
    el: clone,
    timer: setTimeout(function () {
      return hideChatToast(clone);
    }, lifetime)
  });
  state.chat.toastGroupBucket = {
    el: clone,
    count: 1,
    panelOpen: panelOpen,
    lastAt: now
  };
  var isMobileStack = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
  var maxToasts = isMobileStack ? 3 : 4;
  while (state.chat.toastItems.length > maxToasts) {
    var old = state.chat.toastItems.pop();
    if (!old || !old.el) continue;
    clearTimeout(old.timer);
    hideChatToast(old.el);
  }
  state.chat.lastToastText = preview;
  state.chat.lastToastAt = now;
}
function updateChatToastNode(toastEl) {
  var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!toastEl) return;
  var count = Math.max(1, Number(payload.count || 1));
  var panelOpen = !!payload.panelOpen;
  var preview = String(payload.preview || 'Bạn có tin nhắn mới').slice(0, 90);
  var ts = payload.ts || Date.now();
  var textEl = toastEl.querySelector('.chat-msg-toast-text');
  var timeEl = toastEl.querySelector('.chat-msg-toast-time');
  var tagEl = toastEl.querySelector('.chat-msg-toast-tag');
  if (textEl) {
    textEl.textContent = count > 1 ? "".concat(preview, " (+").concat(count - 1, ")") : preview;
  }
  if (timeEl) {
    timeEl.textContent = formatChatMessageDateTime(ts);
  }
  if (tagEl) {
    if (count > 1) {
      tagEl.textContent = panelOpen ? "".concat(count, " tin nh\u1EAFn trong CSKH") : "".concat(count, " tin nh\u1EAFn m\u1EDBi");
    } else {
      tagEl.textContent = panelOpen ? 'Tin nhắn mới trong CSKH' : 'Thông báo mới';
    }
  }
}
function attachSwipeDismissToToast(toastEl) {
  if (!toastEl || toastEl.dataset.swipeBound === '1') return;
  if (!isChatToastSwipeDismissEnabled()) return;
  if (!(window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)) return;
  toastEl.dataset.swipeBound = '1';
  var pointerId = null;
  var startX = 0;
  var startY = 0;
  var deltaX = 0;
  var active = false;
  var onPointerMove = function onPointerMove(event) {
    if (!active || event.pointerId !== pointerId) return;
    var dx = event.clientX - startX;
    var dy = event.clientY - startY;
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    if (Math.abs(dy) > Math.abs(dx)) return;
    deltaX = dx;
    toastEl.classList.add('is-swiping');
    toastEl.style.transform = "translate3d(".concat(dx, "px,0,0)");
    toastEl.style.opacity = String(Math.max(0.2, 1 - Math.min(1, Math.abs(dx) / 180)));
  };
  var onPointerEnd = function onPointerEnd(event) {
    if (!active || event.pointerId !== pointerId) return;
    active = false;
    try {
      toastEl.releasePointerCapture(pointerId);
    } catch (_) {}
    var dismiss = Math.abs(deltaX) > 84;
    toastEl.classList.remove('is-swiping');
    toastEl.style.removeProperty('transform');
    toastEl.style.removeProperty('opacity');
    if (dismiss) {
      toastEl.dataset.swiped = '1';
      hideChatToast(toastEl);
    }
    pointerId = null;
    deltaX = 0;
  };
  toastEl.addEventListener('pointerdown', function (event) {
    if (event.button !== 0 && event.pointerType !== 'touch') return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    deltaX = 0;
    active = true;
    try {
      toastEl.setPointerCapture(pointerId);
    } catch (_) {}
  }, {
    passive: true
  });
  toastEl.addEventListener('pointermove', onPointerMove, {
    passive: true
  });
  toastEl.addEventListener('pointerup', onPointerEnd, {
    passive: true
  });
  toastEl.addEventListener('pointercancel', onPointerEnd, {
    passive: true
  });
}
function getChatToastGroupWindowMs() {
  var _window$__lmbUiSettin4;
  var cfg = ((_window$__lmbUiSettin4 = window.__lmbUiSettings) === null || _window$__lmbUiSettin4 === void 0 ? void 0 : _window$__lmbUiSettin4.chat) || {};
  if (cfg.adminToastGroupEnabled === false) return 0;
  var raw = Number(cfg.adminToastGroupWindowMs || 2000);
  if (!Number.isFinite(raw)) return 2000;
  return Math.max(0, Math.min(6000, Math.round(raw)));
}
function isChatToastSwipeDismissEnabled() {
  var _window$__lmbUiSettin5;
  var cfg = ((_window$__lmbUiSettin5 = window.__lmbUiSettings) === null || _window$__lmbUiSettin5 === void 0 ? void 0 : _window$__lmbUiSettin5.chat) || {};
  return cfg.adminToastSwipeDismissEnabled !== false;
}
function showChatFabHintMessage(msg) {
  var hint = document.getElementById('chatFabHint');
  if (!hint) return;
  stopChatFabHintCycle();
  hint.classList.remove('is-hidden');
  var lines = hint.querySelectorAll('.cfab-hint-line');
  if (!lines || lines.length < 2) return;
  if (!hint.dataset.defaultLine1) {
    hint.dataset.defaultLine1 = String(lines[0].textContent || 'Bấm vào');
    hint.dataset.defaultLine2 = String(lines[1].textContent || 'để sẵn sàng liên hệ CSKH');
  }
  var msgRaw = String((msg === null || msg === void 0 ? void 0 : msg.message) || '').replace(/^([🖼️📎]\s*)/, '');
  // Strip HTML tags for hint display
  var msgText = function () {
    if (!msgRaw) return '';
    if (!/<[a-z][\s\S]*?>/i.test(msgRaw)) return msgRaw.trim();
    var tmp = document.createElement('div');
    tmp.innerHTML = msgRaw;
    return (tmp.innerText || tmp.textContent || '').trim();
  }().slice(0, 38);
  lines[0].textContent = 'Tin nhắn mới';
  lines[1].textContent = msgText || 'Bấm vào để xem ngay';
  hint.classList.add('is-chat-message');
  clearTimeout(window._chatFabHintTimer);
  window._chatFabHintTimer = setTimeout(resetChatFabHintMessage, 6000);
}
function resetChatFabHintMessage() {
  var hint = document.getElementById('chatFabHint');
  if (!hint) return;
  var lines = hint.querySelectorAll('.cfab-hint-line');
  if (!lines || lines.length < 2) return;
  if (hint.dataset.defaultLine1) lines[0].textContent = hint.dataset.defaultLine1;
  if (hint.dataset.defaultLine2) lines[1].textContent = hint.dataset.defaultLine2;
  hint.classList.remove('is-chat-message');
  if (!isChatPanelOpen()) {
    startChatFabHintCycle();
  }
}
function stopChatFabHintCycle() {
  state.chat.fabHintCycleRunning = false;
  if (state.chat.fabHintCycleTimer) {
    clearTimeout(state.chat.fabHintCycleTimer);
    state.chat.fabHintCycleTimer = null;
  }
}
function startChatFabHintCycle() {
  var hint = document.getElementById('chatFabHint');
  if (!hint) return;
  if (state.chat.fabHintCycleRunning) return;
  if (isChatPanelOpen()) return;
  state.chat.fabHintCycleRunning = true;
  var _showPhase = function showPhase() {
    if (!state.chat.fabHintCycleRunning) return;
    if (isChatPanelOpen()) {
      state.chat.fabHintCycleTimer = setTimeout(_showPhase, 1000);
      return;
    }
    hint.classList.remove('is-hidden');
    restartCssAnimationByClass(hint, 'is-reveal');
    state.chat.fabHintCycleTimer = setTimeout(hidePhase, 5000);
  };
  var hidePhase = function hidePhase() {
    if (!state.chat.fabHintCycleRunning) return;
    hint.classList.add('is-hidden');
    var waitMs = 6000 + Math.floor(Math.random() * 4001);
    state.chat.fabHintCycleTimer = setTimeout(_showPhase, waitMs);
  };
  _showPhase();
}
function hideChatToast() {
  var targetToast = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var removeToast = function removeToast(toastEl) {
    if (!toastEl || toastEl.classList.contains('is-template')) return;
    toastEl.classList.add('is-closing');
    toastEl.classList.remove('visible');
    setTimeout(function () {
      if (toastEl && toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 220);
  };
  if (targetToast) {
    var _state$chat$toastGrou;
    removeToast(targetToast);
    if (Array.isArray(state.chat.toastItems)) {
      state.chat.toastItems = state.chat.toastItems.filter(function (item) {
        var same = (item === null || item === void 0 ? void 0 : item.el) === targetToast;
        if (same && item !== null && item !== void 0 && item.timer) clearTimeout(item.timer);
        return !same;
      });
    }
    if (((_state$chat$toastGrou = state.chat.toastGroupBucket) === null || _state$chat$toastGrou === void 0 ? void 0 : _state$chat$toastGrou.el) === targetToast) {
      state.chat.toastGroupBucket = null;
    }
    return;
  }
  var stack = document.getElementById('chatMsgToastStack');
  if (!stack) return;
  if (Array.isArray(state.chat.toastItems)) {
    state.chat.toastItems.forEach(function (item) {
      if (item !== null && item !== void 0 && item.timer) clearTimeout(item.timer);
      removeToast(item === null || item === void 0 ? void 0 : item.el);
    });
    state.chat.toastItems = [];
    state.chat.toastGroupBucket = null;
    return;
  }
  stack.querySelectorAll('.chat-msg-toast:not(.is-template)').forEach(removeToast);
}
function ensureChatToastStack() {
  if (state.chat.toastStackRoot && state.chat.toastTemplate) return state.chat.toastStackRoot;
  var toastTemplate = document.getElementById('chatMsgToast') || createFallbackChatToastTemplate();
  if (!toastTemplate) return null;
  var stack = document.getElementById('chatMsgToastStack');
  if (!stack) {
    stack = document.createElement('div');
    stack.id = 'chatMsgToastStack';
    stack.className = 'chat-msg-toast-stack';
    document.body.appendChild(stack);
  }
  if (toastTemplate.parentNode !== stack) {
    stack.appendChild(toastTemplate);
  }
  toastTemplate.classList.add('is-template');
  state.chat.toastStackRoot = stack;
  state.chat.toastTemplate = toastTemplate;
  if (!Array.isArray(state.chat.toastItems)) state.chat.toastItems = [];
  if (!state.chat.toastGroupBucket) state.chat.toastGroupBucket = null;
  return stack;
}
function createFallbackChatToastTemplate() {
  var _window$__lmbUiSettin6, _document$querySelect;
  var existing = document.getElementById('chatMsgToast');
  if (existing) return existing;
  var avatarSrc = String(((_window$__lmbUiSettin6 = window.__lmbUiSettings) === null || _window$__lmbUiSettin6 === void 0 || (_window$__lmbUiSettin6 = _window$__lmbUiSettin6.chat) === null || _window$__lmbUiSettin6 === void 0 ? void 0 : _window$__lmbUiSettin6.adminAvatar) || ((_document$querySelect = document.querySelector('#chatFabBtn .cfab-avatar')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.getAttribute('src')) || '/favicon.ico').trim();
  var wrapper = document.createElement('div');
  wrapper.id = 'chatMsgToast';
  wrapper.className = 'chat-msg-toast';
  wrapper.setAttribute('role', 'button');
  wrapper.setAttribute('tabindex', '0');
  wrapper.innerHTML = "\n    <div class=\"chat-msg-toast-glow\" aria-hidden=\"true\"></div>\n    <div class=\"chat-msg-toast-av\"><img src=\"".concat(escapeHtml(avatarSrc), "\" alt=\"CSKH\"></div>\n    <div class=\"chat-msg-toast-body\">\n      <div class=\"chat-msg-toast-meta\">\n        <div class=\"chat-msg-toast-name\">CSKH</div>\n        <div class=\"chat-msg-toast-time\" id=\"chatMsgToastTime\">B\xE2y gi\u1EDD</div>\n      </div>\n      <div class=\"chat-msg-toast-text\" id=\"chatMsgToastText\">B\u1EA1n c\xF3 tin nh\u1EAFn m\u1EDBi</div>\n      <div class=\"chat-msg-toast-tag\" id=\"chatMsgToastTag\">Th\xF4ng b\xE1o m\u1EDBi</div>\n    </div>\n    <button class=\"chat-msg-toast-x\" aria-label=\"\u0110\xF3ng\">\xD7</button>\n    <div class=\"chat-msg-toast-progress\" aria-hidden=\"true\"></div>\n  ");
  document.body.appendChild(wrapper);
  return wrapper;
}
function togChatFromToast() {
  hideChatToast();
  resetChatFabHintMessage();
  togChat();
}
function markChatMessagesAsSeen() {
  var latestSupportTs = (Array.isArray(state.chat.messages) ? state.chat.messages : []).reduce(function (max, m) {
    if (m.sender_type === 'customer') return max;
    return Math.max(max, getChatMessageTs(m));
  }, state.chat.lastSeenAt || 0);
  state.chat.lastSeenAt = latestSupportTs;
  if (state.chat.sessionCode) {
    localStorage.setItem(getChatSeenStorageKey(), String(latestSupportTs));
    localStorage.setItem(getChatUnreadStorageKey(), '0');
  }
  state.chat.lastUnreadCount = 0;
  updateChatFabBadge(0);
}
function scheduleChatSeenPost() {
  var delayMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 140;
  if (!state.chat.sessionCode) return;
  if (state.chat.seenPostInFlight) return;
  if (state.chat.seenPostTimer) return;
  var now = Date.now();
  var cooldownMs = Math.max(300, Number(state.chat.seenPostCooldownMs || 1200));
  var earliest = Number(state.chat.seenPostLastAt || 0) + cooldownMs;
  var waitMs = Math.max(Number(delayMs) || 0, Math.max(0, earliest - now));
  state.chat.seenPostTimer = setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          state.chat.seenPostTimer = null;
          if (state.chat.sessionCode) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2);
        case 1:
          if (!(document.hidden && !isChatPanelOpen())) {
            _context6.n = 2;
            break;
          }
          return _context6.a(2);
        case 2:
          state.chat.seenPostInFlight = true;
          _context6.p = 3;
          _context6.n = 4;
          return fetch("/api/chat/mark-seen/".concat(encodeURIComponent(state.chat.sessionCode)), {
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
        case 4:
          state.chat.seenPostLastAt = Date.now();
          _context6.n = 6;
          break;
        case 5:
          _context6.p = 5;
          _t6 = _context6.v;
        case 6:
          _context6.p = 6;
          state.chat.seenPostInFlight = false;
          return _context6.f(6);
        case 7:
          return _context6.a(2);
      }
    }, _callee6, null, [[3, 5, 6, 7]]);
  })), waitMs);
}
function setChatFieldError(fieldId, message) {
  var err = document.getElementById("".concat(fieldId, "Err"));
  var input = document.getElementById(fieldId);
  if (err) err.textContent = message || '';
  if (input) {
    input.style.borderColor = message ? 'rgba(239,68,68,.8)' : 'rgba(124,58,237,.18)';
  }
}
function updateChatFabBadge() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var badge = document.getElementById('chatFabBadge');
  var fabBtn = document.getElementById('chatFabBtn');
  if (!badge) return;
  var prevValue = Number(badge.textContent || 0) || 0;
  var value = Number(count) || 0;
  badge.textContent = String(value);
  badge.style.display = value > 0 ? 'flex' : 'none';
  if (fabBtn) fabBtn.classList.toggle('has-unread', value > 0);
  if (value > prevValue) {
    restartCssAnimationByClass(badge, 'is-bump');
    setTimeout(function () {
      return badge.classList.remove('is-bump');
    }, 520);
  }
  if (state.chat.sessionCode) {
    localStorage.setItem(getChatUnreadStorageKey(), String(value));
  }
}
function initChatWidgetNotificationRuntime() {
  if (state.chat.notificationRuntimeReady) return;
  state.chat.notificationRuntimeReady = true;
  rtDbg('runtime-init', {
    sessionCode: state.chat.sessionCode || ''
  });
  ensureChatToastStack();
  startChatFabHintCycle();
  window.addEventListener('giftbox:chat-unread', function (event) {
    var _document$getElementB9;
    var detail = (event === null || event === void 0 ? void 0 : event.detail) || {};
    var incomingUnread = Number(detail.unreadCount || detail.count || 0);
    if (state.chat.sessionCode) {
      if (detail.message && !isChatPanelOpen()) {
        playRealtimeNotificationSound('admin_message');
        if (window.tabNotification) tabNotification.incrementBadge('Tin nhắn mới');
        showChatToast({
          message: detail.message
        });
        showChatFabHintMessage({
          message: detail.message
        });
      }
      return;
    }
    var current = Number(((_document$getElementB9 = document.getElementById('chatFabBadge')) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.textContent) || '0') || 0;
    var nextCount = incomingUnread > 0 ? incomingUnread : current + 1;
    updateChatFabBadge(nextCount);
    state.chat.lastUnreadCount = nextCount;
    if (nextCount > 0) {
      playRealtimeNotificationSound('admin_message');
      if (window.tabNotification) tabNotification.incrementBadge('Tin nhắn mới');
      showChatToast({
        message: detail.message || 'Bạn có tin nhắn mới'
      });
      showChatFabHintMessage({
        message: detail.message || 'Bạn có tin nhắn mới'
      });
    }
  });
  var savedSessionCode = localStorage.getItem(getChatSessionStorageKey()) || '';
  updateChatFabBadge(0);
  state.chat.lastUnreadCount = 0;
  state.chat.unreadBaselineReady = false;
  state.chat.sessionCode = String(state.chat.sessionCode || savedSessionCode || '').trim().toUpperCase();
  if (state.chat.sessionCode) {
    state.chat.lastSeenAt = Number(localStorage.getItem(getChatSeenStorageKey()) || '0') || 0;
  }

  // Keep notifications working even when chat panel is closed.
  startChatSSE();

  // Bootstrap realtime notifications in background so user does not need to
  // open the chat panel before receiving admin message sound/toast/hint.
  bootstrapChatNotificationRuntime().catch(function () {});
}
function bootstrapChatNotificationRuntime() {
  return _bootstrapChatNotificationRuntime.apply(this, arguments);
}
function _bootstrapChatNotificationRuntime() {
  _bootstrapChatNotificationRuntime = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee55() {
    var _t33;
    return _regenerator().w(function (_context55) {
      while (1) switch (_context55.p = _context55.n) {
        case 0:
          if (!state.chat.notificationBootstrapInFlight) {
            _context55.n = 1;
            break;
          }
          return _context55.a(2);
        case 1:
          state.chat.notificationBootstrapInFlight = true;
          rtDbg('bootstrap-start', {
            sessionCode: state.chat.sessionCode || ''
          });
          _context55.p = 2;
          if (!state.chat.sessionCode) {
            state.chat.sessionCode = localStorage.getItem(getChatSessionStorageKey()) || '';
          }
          if (state.chat.sessionCode) {
            _context55.n = 3;
            break;
          }
          scheduleChatNotificationBootstrapRetry();
          rtDbg('bootstrap-no-session', {});
          return _context55.a(2);
        case 3:
          state.chat.lastSeenAt = Number(localStorage.getItem(getChatSeenStorageKey()) || '0') || 0;
          state.chat.lastUnreadCount = Number(localStorage.getItem(getChatUnreadStorageKey()) || '0') || 0;
          startChatSSE();
          _context55.n = 4;
          return fetchChatMessages();
        case 4:
          rtDbg('bootstrap-success', {
            sessionCode: state.chat.sessionCode || '',
            messageCount: Array.isArray(state.chat.messages) ? state.chat.messages.length : 0
          });
          _context55.n = 6;
          break;
        case 5:
          _context55.p = 5;
          _t33 = _context55.v;
          // Keep startup resilient: if bootstrap fails, panel-open path still works.
          scheduleChatNotificationBootstrapRetry();
          rtDbg('bootstrap-failed', {});
        case 6:
          _context55.p = 6;
          state.chat.notificationBootstrapInFlight = false;
          return _context55.f(6);
        case 7:
          return _context55.a(2);
      }
    }, _callee55, null, [[2, 5, 6, 7]]);
  }));
  return _bootstrapChatNotificationRuntime.apply(this, arguments);
}
function scheduleChatNotificationBootstrapRetry() {
  var attempts = Number(state.chat.notificationBootstrapAttempts || 0) + 1;
  state.chat.notificationBootstrapAttempts = attempts;
  if (attempts > 5) return;
  var delayMs = Math.min(7000, 900 + attempts * 900);
  if (state.chat.notificationBootstrapRetryTimer) {
    clearTimeout(state.chat.notificationBootstrapRetryTimer);
  }
  state.chat.notificationBootstrapRetryTimer = setTimeout(function () {
    state.chat.notificationBootstrapRetryTimer = null;
    bootstrapChatNotificationRuntime().catch(function () {});
  }, delayMs);
  rtDbg('bootstrap-retry-scheduled', {
    attempts: attempts,
    delayMs: delayMs
  });
}
function applyUiMotionSettingForCustomer() {
  var mode = localStorage.getItem('uiMotionLevel') || 'full';
  document.body.classList.toggle('medium-motion', mode === 'medium');
  document.body.classList.toggle('reduce-motion', mode === 'reduced');
}
function setChatReadyUI(isReady) {
  var pre = document.getElementById('chatPreForm');
  var quick = document.querySelector('#cpanel .cquick');
  var inputWrap = document.getElementById('cinputWrap');
  var inputRow = document.querySelector('#cpanel .cinp-row');
  if (pre) pre.style.display = isReady ? 'none' : 'flex';
  if (quick) quick.style.display = isReady ? 'flex' : 'none';
  if (inputWrap) inputWrap.style.display = isReady ? 'block' : 'none';
  if (inputRow) inputRow.style.display = isReady ? 'flex' : 'none';
  var input = document.getElementById('cinp');
  if (input) {
    if (isReady) ensureCustomerChatInteractiveBindings();
    autoResizeCustomerChatInput(input);
    updateChatComposerState(input);
  }
}
function isChatProfileComplete() {
  return !!state.chat.profileCompleted;
}
function hasValidSavedChatProfile(profile) {
  var p = profile && _typeof(profile) === 'object' ? profile : {};
  var nameOk = String(p.customerName || '').trim().length > 0;
  var phone = String(p.customerPhone || '').replace(/\D/g, '');
  var phoneOk = /^\d{10,11}$/.test(phone);
  var code = String(p.gameSessionCode || '').trim().toUpperCase();
  var codeOk = code.length > 0;
  return nameOk && phoneOk && codeOk;
}
function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
var DEFAULT_CHAT_AGENT_NAME = 'CSKH Lâm TaoBao';
function isAutoBotSupportName(name) {
  var normalized = String(name || '').trim().toLowerCase();
  return normalized === 'bot hồng ngọc' || normalized === 'bot hong ngoc';
}
function getVisibleChatMessages() {
  var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.chat.messages;
  var list = Array.isArray(messages) ? messages : [];
  var hasHumanSupportReply = list.some(function (m) {
    if (m.sender_type === 'customer') return false;
    return !isAutoBotSupportName(m.sender_name);
  });
  return hasHumanSupportReply ? list.filter(function (m) {
    return !(m.sender_type !== 'customer' && isAutoBotSupportName(m.sender_name));
  }) : list;
}
function getChatMessageDomKey(message) {
  var id = String((message === null || message === void 0 ? void 0 : message.id) || '').trim();
  if (id) return "id:".concat(id);
  var ts = getChatMessageTs(message);
  var sender = String((message === null || message === void 0 ? void 0 : message.sender_type) || '').toLowerCase();
  var txt = String((message === null || message === void 0 ? void 0 : message.message) || '').slice(0, 60);
  return "fallback:".concat(ts, ":").concat(sender, ":").concat(txt);
}
function pseudoRandHeights(seed, count) {
  var h = 0;
  for (var i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i) | 0;
  var out = [];
  for (var _i2 = 0; _i2 < count; _i2++) {
    h = Math.imul(h, 1664525) + 1013904223 | 0;
    out.push(18 + (h >>> 0) % 72);
  }
  return out;
}
function createVoicePlayerNode(url) {
  var BARS = 30;
  var PLAY_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>';
  var PAUSE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  var wrap = document.createElement('div');
  wrap.className = 'chat-voice-player';
  var audio = document.createElement('audio');
  audio.src = url;
  audio.preload = 'auto';
  audio.style.cssText = 'display:none;position:absolute;pointer-events:none;';
  var playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'chat-voice-play-btn';
  playBtn.innerHTML = PLAY_SVG;
  playBtn.setAttribute('aria-label', 'Phát tin nhắn thoại');
  var waveWrap = document.createElement('div');
  waveWrap.className = 'chat-voice-wave';
  var heights = pseudoRandHeights(url, BARS);
  for (var i = 0; i < BARS; i++) {
    var bar = document.createElement('span');
    bar.className = 'chat-voice-bar';
    bar.style.height = "".concat(heights[i], "%");
    waveWrap.appendChild(bar);
  }
  var timeEl = document.createElement('span');
  timeEl.className = 'chat-voice-time';
  timeEl.textContent = '0:00';
  function fmt(s) {
    var t = Math.floor(s || 0);
    return "".concat(Math.floor(t / 60), ":").concat(String(t % 60).padStart(2, '0'));
  }
  function updateBars(pct) {
    var filled = Math.round(pct * BARS);
    var bars = waveWrap.children;
    for (var _i3 = 0; _i3 < bars.length; _i3++) bars[_i3].classList.toggle('played', _i3 < filled);
  }
  playBtn.addEventListener('click', function () {
    if (audio.paused) {
      document.querySelectorAll('.chat-voice-player audio').forEach(function (a) {
        if (a !== audio) a.pause();
      });
      audio.play().catch(function () {});
    } else {
      audio.pause();
    }
  });
  waveWrap.addEventListener('click', function (e) {
    if (!audio.duration) return;
    var r = waveWrap.getBoundingClientRect();
    audio.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * audio.duration;
  });
  audio.addEventListener('play', function () {
    wrap.classList.add('playing');
    playBtn.innerHTML = PAUSE_SVG;
  });
  audio.addEventListener('pause', function () {
    wrap.classList.remove('playing');
    playBtn.innerHTML = PLAY_SVG;
  });
  audio.addEventListener('ended', function () {
    wrap.classList.remove('playing');
    playBtn.innerHTML = PLAY_SVG;
    updateBars(0);
    if (audio.duration) timeEl.textContent = fmt(audio.duration);
  });
  audio.addEventListener('timeupdate', function () {
    if (!audio.duration) return;
    updateBars(audio.currentTime / audio.duration);
    timeEl.textContent = fmt(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', function () {
    if (audio.duration > 0) timeEl.textContent = fmt(audio.duration);
  });
  wrap.appendChild(audio);
  wrap.appendChild(playBtn);
  wrap.appendChild(waveWrap);
  wrap.appendChild(timeEl);
  return wrap;
}
function createChatAttachmentNode(message) {
  var url = String((message === null || message === void 0 ? void 0 : message.attachment_url) || '').trim();
  if (!url) return null;
  var messageType = String((message === null || message === void 0 ? void 0 : message.message_type) || '').toLowerCase();
  var attachmentType = String((message === null || message === void 0 ? void 0 : message.attachment_type) || '').toLowerCase();
  var name = String((message === null || message === void 0 ? void 0 : message.message) || 'Tep dinh kem').replace(/^([🖼️📎🎤]\s*)/, '').trim() || 'Tep dinh kem';
  var isImage = messageType === 'image' || attachmentType.includes('image') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);
  var isAudio = attachmentType.includes('audio') || /\.(webm|ogg|mp3|wav|m4a|aac)$/i.test(url);
  var wrap = document.createElement('span');
  wrap.className = 'chat-attachment';
  if (isImage) {
    var img = document.createElement('img');
    img.className = 'chat-attachment-img';
    img.src = url;
    img.alt = name;
    img.loading = 'lazy';
    img.decoding = 'async';
    wrap.appendChild(img);
    return wrap;
  }
  if (isAudio) {
    return createVoicePlayerNode(url);
  }
  var link = document.createElement('a');
  link.className = 'chat-attachment-file';
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('download', '');
  var icon = document.createElement('span');
  icon.className = 'chat-attachment-icon';
  icon.textContent = 'FILE';
  var label = document.createElement('span');
  label.textContent = name;
  link.appendChild(icon);
  link.appendChild(label);
  wrap.appendChild(link);
  return wrap;
}
function sanitizeSupportHtml(raw) {
  var text = String(raw || '');
  if (!text) return '';
  if (!/<[a-z][\s\S]*?>/i.test(text)) {
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML.replace(/\n/g, '<br>');
  }
  var ALLOWED = {
    b: 1,
    i: 1,
    u: 1,
    strong: 1,
    em: 1,
    span: 1,
    br: 1,
    p: 1,
    div: 1,
    ol: 1,
    ul: 1,
    li: 1
  };
  var tmp = document.createElement('div');
  tmp.innerHTML = text;
  (function clean(node) {
    Array.from(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) return;
      if (child.nodeType !== 1) {
        child.remove();
        return;
      }
      var tag = child.tagName.toLowerCase();
      if (!ALLOWED[tag]) {
        while (child.firstChild) node.insertBefore(child.firstChild, child);
        child.remove();
        return;
      }
      Array.from(child.attributes).forEach(function (attr) {
        if (tag === 'span' && attr.name === 'style') {
          var safe = attr.value.split(';').filter(function (s) {
            return /^\s*(color|font-size)\s*:/i.test(s);
          }).join(';');
          child.setAttribute('style', safe);
        } else {
          child.removeAttribute(attr.name);
        }
      });
      clean(child);
    });
  })(tmp);
  return tmp.innerHTML;
}
function createChatMessageRowElement(message) {
  var _document$getElementB0, _opts$_cachedSupportA, _document$querySelect2;
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var m = message || {};
  var mine = String(m.sender_type || '').toLowerCase() === 'customer';
  var customerName = opts._cachedCustomerName || String(((_document$getElementB0 = document.getElementById('chatCustomerName')) === null || _document$getElementB0 === void 0 ? void 0 : _document$getElementB0.value) || 'Ban').trim() || 'Ban';
  var senderName = mine ? customerName : DEFAULT_CHAT_AGENT_NAME;
  var displayName = mine ? customerName : senderName;
  var supportAvatar = (_opts$_cachedSupportA = opts._cachedSupportAvatar) !== null && _opts$_cachedSupportA !== void 0 ? _opts$_cachedSupportA : String(((_document$querySelect2 = document.querySelector('.ch-av img')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.getAttribute('src')) || '').trim();
  var text = String(m.message || '').replace(/^([🖼️📎🎤]\s*)/, '').trim();
  var attachUrl = String(m.attachment_url || '').trim();
  var mType = String(m.message_type || '').toLowerCase();
  var aType = String(m.attachment_type || '').toLowerCase();
  var isImageMsg = !!attachUrl && (mType === 'image' || aType.includes('image') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(attachUrl));
  var isAudioMsg = !!attachUrl && (aType.includes('audio') || /\.(webm|ogg|mp3|wav|m4a|aac)$/i.test(attachUrl));
  var key = getChatMessageDomKey(m);
  var row = document.createElement('div');
  row.className = "cmsg-row ".concat(mine ? 'mine' : '').concat(opts.isFreshMessage ? ' is-fresh' : '');
  row.dataset.chatId = String(m.id || m.created_at || Date.now());
  row.dataset.chatKey = key;
  var content = document.createElement('div');
  content.className = 'cmsg-row-content';
  if (!mine && supportAvatar) {
    var avatar = document.createElement('span');
    avatar.className = 'cmsg-avatar admin';
    var img = document.createElement('img');
    img.src = supportAvatar;
    img.alt = displayName;
    img.loading = 'lazy';
    img.decoding = 'async';
    avatar.appendChild(img);
    content.appendChild(avatar);
  } else {
    var _avatar = document.createElement('span');
    _avatar.className = "cmsg-avatar ".concat(mine ? 'mine' : 'admin');
    _avatar.textContent = displayName.slice(0, 2).toUpperCase();
    content.appendChild(_avatar);
  }
  var col = document.createElement('div');
  col.className = 'cmsg-col';
  var title = document.createElement('div');
  title.className = 'msnd';
  title.textContent = mine ? 'Ban' : DEFAULT_CHAT_AGENT_NAME;
  col.appendChild(title);
  var bubble = document.createElement('div');
  bubble.className = isImageMsg ? 'mbub media-only' : "mbub".concat(mine ? ' mine' : '').concat(isAudioMsg ? ' voice-bubble' : '');
  if (!isImageMsg && !isAudioMsg && text) {
    if (mine) {
      bubble.textContent = text;
    } else {
      bubble.innerHTML = sanitizeSupportHtml(text);
    }
  }
  var attachment = createChatAttachmentNode(m);
  if (attachment) bubble.appendChild(attachment);
  col.appendChild(bubble);
  var timeEl = document.createElement('div');
  timeEl.className = 'cmsg-time';
  timeEl.textContent = formatChatMessageDateTime(m.created_at || m.createdAt || m.updated_at);
  var statusWrap = document.createElement('div');
  statusWrap.className = 'cmsg-meta';
  statusWrap.appendChild(timeEl);
  if (mine) {
    var statusEl = document.createElement('span');
    var status = resolveOutgoingMessageStatus(m);
    statusEl.className = "cmsg-status ".concat(status);
    statusEl.textContent = getOutgoingChatStatusLabel(m);
    statusWrap.appendChild(statusEl);
    if (status === 'failed') {
      var retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'cmsg-retry-btn';
      retryBtn.dataset.chatRetryId = String(m.id || '');
      retryBtn.textContent = 'Thu lai';
      statusWrap.appendChild(retryBtn);
    }
  }
  col.appendChild(statusWrap);
  content.appendChild(col);
  row.appendChild(content);
  return row;
}
function createChatWelcomeRow() {
  return createChatMessageRowElement({
    id: 'welcome',
    sender_type: 'support',
    sender_name: DEFAULT_CHAT_AGENT_NAME,
    message: 'Xin chao! Chung toi co the giup gi cho ban?'
  });
}
function renderChatMessages() {
  var _document$getElementB1, _document$querySelect3;
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var box = document.getElementById('cmsgs');
  if (!box) return;
  var forceFresh = !!options.forceFresh;
  var shouldStickBottom = isNearChatBottom(box);
  state.chat.messages = capChatMessages(state.chat.messages);
  var visibleMessages = getVisibleChatMessages(state.chat.messages);
  var previousRenderedTs = Number(state.chat.lastRenderedMessageTs || 0);
  var allowFreshAnimation = previousRenderedTs > 0;
  var maxRenderedTs = previousRenderedTs;
  if (!visibleMessages.length) {
    box.textContent = '';
    box.appendChild(createChatWelcomeRow());
    box.dataset.chatHydrated = '1';
    box.dataset.chatEmpty = '1';
    box.dataset.chatVirtualized = '0';
    return;
  }
  var windowRange = getVirtualizedChatWindow(visibleMessages, box);
  var messagesInWindow = visibleMessages.slice(windowRange.start, windowRange.end);
  var renderFrag = document.createDocumentFragment();
  var cachedCustomerName = String(((_document$getElementB1 = document.getElementById('chatCustomerName')) === null || _document$getElementB1 === void 0 ? void 0 : _document$getElementB1.value) || 'Ban').trim() || 'Ban';
  var cachedSupportAvatar = String(((_document$querySelect3 = document.querySelector('.ch-av img')) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.getAttribute('src')) || '').trim();
  if (windowRange.virtualized && windowRange.topPad > 0) {
    var topSpacer = document.createElement('div');
    topSpacer.className = 'chat-vspacer chat-vspacer-top';
    topSpacer.style.height = "".concat(windowRange.topPad, "px");
    renderFrag.appendChild(topSpacer);
  }
  for (var i = 0; i < messagesInWindow.length; i += 1) {
    var message = messagesInWindow[i];
    var msgTs = getChatMessageTs(message);
    if (msgTs > maxRenderedTs) maxRenderedTs = msgTs;
    var isFreshMessage = forceFresh || allowFreshAnimation && msgTs > previousRenderedTs;
    renderFrag.appendChild(createChatMessageRowElement(message, {
      isFreshMessage: isFreshMessage,
      _cachedCustomerName: cachedCustomerName,
      _cachedSupportAvatar: cachedSupportAvatar
    }));
  }
  if (windowRange.virtualized && windowRange.bottomPad > 0) {
    var bottomSpacer = document.createElement('div');
    bottomSpacer.className = 'chat-vspacer chat-vspacer-bottom';
    bottomSpacer.style.height = "".concat(windowRange.bottomPad, "px");
    renderFrag.appendChild(bottomSpacer);
  }
  box.replaceChildren(renderFrag);
  if (maxRenderedTs > 0) {
    state.chat.lastRenderedMessageTs = maxRenderedTs;
  }
  box.dataset.chatHydrated = '1';
  box.dataset.chatEmpty = '0';
  box.dataset.chatVirtualized = windowRange.virtualized ? '1' : '0';
  if ((!document.hidden || isChatPanelOpen()) && shouldStickBottom) {
    box.scrollTop = box.scrollHeight;
  }
}
function renderChatAttachment(message) {
  var url = String((message === null || message === void 0 ? void 0 : message.attachment_url) || '').trim();
  if (!url) return '';
  var messageType = String((message === null || message === void 0 ? void 0 : message.message_type) || '').toLowerCase();
  var attachmentType = String((message === null || message === void 0 ? void 0 : message.attachment_type) || '').toLowerCase();
  var name = escapeHtml(String((message === null || message === void 0 ? void 0 : message.message) || 'Tệp đính kèm').replace(/^([🖼️📎🎤]\s*)/, ''));
  var isImage = messageType === 'image' || attachmentType.includes('image') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);
  var isAudio = messageType === 'audio' || attachmentType.includes('audio') || /\.(webm|ogg|mp3|wav|m4a|aac)$/i.test(url);
  if (isImage) {
    return "<span class=\"chat-attachment\"><img class=\"chat-attachment-img\" src=\"".concat(escapeHtml(url), "\" alt=\"").concat(name, "\" loading=\"lazy\"></span>");
  }
  if (isAudio) {
    return "<span class=\"chat-attachment chat-attachment-voice\"><audio controls preload=\"auto\" src=\"".concat(escapeHtml(url), "\"></audio></span>");
  }
  return "<span class=\"chat-attachment\"><a class=\"chat-attachment-file\" href=\"".concat(escapeHtml(url), "\" target=\"_blank\" rel=\"noopener noreferrer\" download><span class=\"chat-attachment-icon\">FILE</span><span>").concat(name, "</span></a></span>");
}
function fetchChatMessages() {
  return _fetchChatMessages.apply(this, arguments);
}
function _fetchChatMessages() {
  _fetchChatMessages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee57() {
    var options,
      force,
      now,
      minIntervalMs,
      hasHydratedMessages,
      elapsedMs,
      runFetch,
      _args57 = arguments;
    return _regenerator().w(function (_context57) {
      while (1) switch (_context57.n) {
        case 0:
          options = _args57.length > 0 && _args57[0] !== undefined ? _args57[0] : {};
          if (state.chat.sessionCode) {
            _context57.n = 1;
            break;
          }
          return _context57.a(2);
        case 1:
          if (!state.chat.messagesFetchInFlight) {
            _context57.n = 2;
            break;
          }
          return _context57.a(2, state.chat.messagesFetchInFlight);
        case 2:
          force = options && options.force === true;
          now = Date.now();
          minIntervalMs = Math.max(400, Number(state.chat.messagesFetchMinIntervalMs || 1800));
          hasHydratedMessages = Array.isArray(state.chat.messages) && state.chat.messages.length > 0;
          elapsedMs = now - Number(state.chat.messagesLastFetchAt || 0);
          if (!(!force && hasHydratedMessages && elapsedMs >= 0 && elapsedMs < minIntervalMs)) {
            _context57.n = 3;
            break;
          }
          if (isChatPanelOpen()) {
            markChatMessagesAsSeen();
            scheduleChatSeenPost(80);
            state.chat.unreadBaselineReady = true;
          } else {
            syncChatUnreadUi();
          }
          return _context57.a(2);
        case 3:
          runFetch = /*#__PURE__*/function () {
            var _ref26 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee56() {
              var rs, msg, latestSupportTs, _t34;
              return _regenerator().w(function (_context56) {
                while (1) switch (_context56.p = _context56.n) {
                  case 0:
                    rtDbg('fetch-messages-start', {
                      sessionCode: state.chat.sessionCode || ''
                    });
                    notifyDbg('fetch-chat-messages-start', {
                      sessionCode: state.chat.sessionCode || ''
                    });
                    _context56.p = 1;
                    _context56.n = 2;
                    return apiJson("/api/chat/messages/".concat(encodeURIComponent(state.chat.sessionCode)));
                  case 2:
                    rs = _context56.v;
                    _context56.n = 5;
                    break;
                  case 3:
                    _context56.p = 3;
                    _t34 = _context56.v;
                    notifyDbg('fetch-chat-messages-error', {
                      sessionCode: state.chat.sessionCode || '',
                      message: (_t34 === null || _t34 === void 0 ? void 0 : _t34.message) || String(_t34 || '')
                    });
                    msg = String((_t34 === null || _t34 === void 0 ? void 0 : _t34.message) || '').toLowerCase();
                    if (!(msg.includes('không tìm thấy phiên chat') || msg.includes('hết hạn'))) {
                      _context56.n = 4;
                      break;
                    }
                    state.chat.sessionCode = '';
                    localStorage.removeItem(getChatSessionStorageKey());
                    state.chat.profileCompleted = false;
                    setChatReadyUI(false);
                    showToast('ℹ️ Phiên chat đã hết hạn, vui lòng bắt đầu chat lại.');
                    return _context56.a(2);
                  case 4:
                    throw _t34;
                  case 5:
                    state.chat.messagesLastFetchAt = Date.now();
                    state.chat.messages = capChatMessages(hydrateChatMessageListForUi(Array.isArray(rs.data) ? rs.data : []));
                    rtDbg('fetch-messages-done', {
                      sessionCode: state.chat.sessionCode || '',
                      messageCount: state.chat.messages.length
                    });
                    scheduleChatRender();
                    if (!isChatPanelOpen()) {
                      _context56.n = 6;
                      break;
                    }
                    markChatMessagesAsSeen();
                    scheduleChatSeenPost(80);
                    state.chat.unreadBaselineReady = true;
                    return _context56.a(2);
                  case 6:
                    if (state.chat.unreadBaselineReady) {
                      _context56.n = 7;
                      break;
                    }
                    latestSupportTs = getUnseenSupportMessages(state.chat.messages).reduce(function (max, m) {
                      return Math.max(max, getChatMessageTs(m));
                    }, 0);
                    if (latestSupportTs > 0) {
                      state.chat.lastSeenAt = latestSupportTs;
                      localStorage.setItem(getChatSeenStorageKey(), String(latestSupportTs));
                    }
                    state.chat.lastUnreadCount = 0;
                    updateChatFabBadge(0);
                    state.chat.unreadBaselineReady = true;
                    return _context56.a(2);
                  case 7:
                    syncChatUnreadUi();
                  case 8:
                    return _context56.a(2);
                }
              }, _callee56, null, [[1, 3]]);
            }));
            return function runFetch() {
              return _ref26.apply(this, arguments);
            };
          }();
          state.chat.messagesFetchInFlight = runFetch().finally(function () {
            state.chat.messagesFetchInFlight = null;
          });
          return _context57.a(2, state.chat.messagesFetchInFlight);
      }
    }, _callee57);
  }));
  return _fetchChatMessages.apply(this, arguments);
}
function startCustomerChat() {
  return _startCustomerChat.apply(this, arguments);
}
function _startCustomerChat() {
  _startCustomerChat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee58() {
    var _document$getElementB10, _document$getElementB11, _document$getElementB12;
    var customerName, customerPhone, gameSessionCode, hasError, payload, _rs$data2, rs, _err$data, existingCode, _t35, _t36;
    return _regenerator().w(function (_context58) {
      while (1) switch (_context58.p = _context58.n) {
        case 0:
          customerName = (((_document$getElementB10 = document.getElementById('chatCustomerName')) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.value) || '').trim();
          customerPhone = (((_document$getElementB11 = document.getElementById('chatCustomerPhone')) === null || _document$getElementB11 === void 0 ? void 0 : _document$getElementB11.value) || '').trim();
          gameSessionCode = (((_document$getElementB12 = document.getElementById('chatGameSessionCode')) === null || _document$getElementB12 === void 0 ? void 0 : _document$getElementB12.value) || '').trim().toUpperCase();
          setChatFieldError('chatCustomerName', '');
          setChatFieldError('chatCustomerPhone', '');
          setChatFieldError('chatGameSessionCode', '');
          hasError = false;
          if (!customerName) {
            setChatFieldError('chatCustomerName', 'Vui lòng nhập họ và tên.');
            hasError = true;
          }
          if (!/^\d{10,11}$/.test(customerPhone.replace(/\D/g, ''))) {
            setChatFieldError('chatCustomerPhone', 'Số điện thoại phải gồm 10-11 chữ số.');
            hasError = true;
          }
          if (!gameSessionCode) {
            setChatFieldError('chatGameSessionCode', 'Vui lòng nhập mã phiên chơi.');
            hasError = true;
          }
          if (!hasError) {
            _context58.n = 1;
            break;
          }
          return _context58.a(2);
        case 1:
          payload = {
            customer_name: customerName,
            customer_phone: customerPhone,
            game_session_code: gameSessionCode,
            topic: "H\u1ED7 tr\u1EE3 phi\xEAn ".concat(gameSessionCode)
          };
          _context58.p = 2;
          if (!state.chat.sessionCode) {
            _context58.n = 4;
            break;
          }
          notifyDbg('chat-start-profile-update', {
            sessionCode: state.chat.sessionCode,
            gameSessionCode: gameSessionCode
          });
          _context58.n = 3;
          return apiJson("/api/chat/profile/".concat(encodeURIComponent(state.chat.sessionCode)), {
            method: 'POST',
            body: JSON.stringify(payload)
          });
        case 3:
          rs = _context58.v;
          _context58.n = 6;
          break;
        case 4:
          notifyDbg('chat-start-new-session', {
            gameSessionCode: gameSessionCode
          });
          _context58.n = 5;
          return apiJson('/api/chat/start', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
        case 5:
          rs = _context58.v;
        case 6:
          state.chat.sessionCode = ((_rs$data2 = rs.data) === null || _rs$data2 === void 0 ? void 0 : _rs$data2.session_code) || '';
          state.chat.profileCompleted = true;
          if (state.chat.sessionCode) {
            localStorage.setItem(getChatSessionStorageKey(), state.chat.sessionCode);
            localStorage.setItem(getChatProfileStorageKey(), JSON.stringify({
              customerName: customerName,
              customerPhone: customerPhone,
              gameSessionCode: gameSessionCode
            }));
            state.chat.lastSeenAt = 0;
            localStorage.setItem(getChatSeenStorageKey(), '0');
            localStorage.setItem(getChatUnreadStorageKey(), '0');
          }
          setChatReadyUI(true);
          ensureCustomerChatInteractiveBindings();
          _context58.n = 7;
          return fetchChatMessages();
        case 7:
          startChatSSE();
          notifyDbg('chat-start-success', {
            chatSessionCode: state.chat.sessionCode || '',
            gameSessionCode: gameSessionCode,
            messageCount: Array.isArray(state.chat.messages) ? state.chat.messages.length : 0
          });
          showToast('✅ Bắt đầu chat thành công');

          // Auto-send prize info if pending from openChatWithPrizeInfo
          if (!state.chat.pendingPrizeInfo) {
            _context58.n = 8;
            break;
          }
          _context58.n = 8;
          return sendPrizeInfoMessage();
        case 8:
          _context58.n = 16;
          break;
        case 9:
          _context58.p = 9;
          _t35 = _context58.v;
          notifyDbg('chat-start-error', {
            message: (_t35 === null || _t35 === void 0 ? void 0 : _t35.message) || String(_t35 || ''),
            code: (_t35 === null || _t35 === void 0 ? void 0 : _t35.code) || ''
          });
          if (!((_t35 === null || _t35 === void 0 ? void 0 : _t35.code) === 'IP_RATE_LIMITED')) {
            _context58.n = 15;
            break;
          }
          existingCode = String((_t35 === null || _t35 === void 0 || (_err$data = _t35.data) === null || _err$data === void 0 ? void 0 : _err$data.existing_session_code) || '').trim().toUpperCase();
          if (!existingCode) {
            _context58.n = 14;
            break;
          }
          _context58.p = 10;
          _context58.n = 11;
          return apiJson("/api/chat/session/".concat(encodeURIComponent(existingCode)));
        case 11:
          state.chat.sessionCode = existingCode;
          state.chat.profileCompleted = true;
          localStorage.setItem(getChatSessionStorageKey(), existingCode);
          localStorage.setItem(getChatProfileStorageKey(), JSON.stringify({
            customerName: customerName,
            customerPhone: customerPhone,
            gameSessionCode: gameSessionCode
          }));
          state.chat.lastSeenAt = 0;
          localStorage.setItem(getChatSeenStorageKey(), '0');
          localStorage.setItem(getChatUnreadStorageKey(), '0');
          setChatReadyUI(true);
          ensureCustomerChatInteractiveBindings();
          _context58.n = 12;
          return fetchChatMessages();
        case 12:
          startChatSSE();
          showToast('💬 Đã kết nối lại phiên chat hiện tại của bạn');
          return _context58.a(2);
        case 13:
          _context58.p = 13;
          _t36 = _context58.v;
        case 14:
          showToast("\u26A0\uFE0F ".concat(_t35.message));
          return _context58.a(2);
        case 15:
          showToast("\u274C ".concat(_t35.message));
        case 16:
          return _context58.a(2);
      }
    }, _callee58, null, [[10, 13], [2, 9]]);
  }));
  return _startCustomerChat.apply(this, arguments);
}
function sendCustomerMessage(_x12) {
  return _sendCustomerMessage.apply(this, arguments);
}
function _sendCustomerMessage() {
  _sendCustomerMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee59(text) {
    var _document$getElementB13, _document$getElementB14;
    var options,
      message,
      senderName,
      senderPhone,
      optimisticMessage,
      optimisticId,
      rs,
      sentMessage,
      replaced,
      _args59 = arguments,
      _t37;
    return _regenerator().w(function (_context59) {
      while (1) switch (_context59.p = _context59.n) {
        case 0:
          options = _args59.length > 1 && _args59[1] && _typeof(_args59[1]) === 'object' ? _args59[1] : {};
          if (state.chat.sessionCode) {
            _context59.n = 1;
            break;
          }
          showToast('❌ Vui lòng nhập thông tin và bắt đầu chat trước');
          throw new Error('Vui lòng bắt đầu chat trước');
        case 1:
          if (isChatProfileComplete()) {
            _context59.n = 2;
            break;
          }
          showToast('ℹ️ Vui lòng điền tên, số điện thoại và mã phiên để tiếp tục chat.');
          setChatReadyUI(false);
          throw new Error('Vui lòng điền đầy đủ thông tin chat');
        case 2:
          message = String(text || '').trim();
          if (message) {
            _context59.n = 3;
            break;
          }
          return _context59.a(2);
        case 3:
          senderName = (((_document$getElementB13 = document.getElementById('chatCustomerName')) === null || _document$getElementB13 === void 0 ? void 0 : _document$getElementB13.value) || 'Khach hang').trim() || 'Khach hang';
          senderPhone = String(((_document$getElementB14 = document.getElementById('chatCustomerPhone')) === null || _document$getElementB14 === void 0 ? void 0 : _document$getElementB14.value) || '').replace(/\D/g, '');
          optimisticMessage = createOptimisticTextMessage(message);
          optimisticId = String(optimisticMessage.id || '');
          appendChatMessage(optimisticMessage);
          if (!document.hidden || isChatPanelOpen()) {
            scheduleChatRender({
              fresh: true
            });
          }
          _context59.p = 4;
          _context59.n = 5;
          return apiJson('/api/chat/message', {
            method: 'POST',
            timeoutMs: Math.max(8000, Number(options.timeoutMs) || 20000),
            body: JSON.stringify({
              session_code: state.chat.sessionCode,
              sender_type: 'customer',
              sender_name: senderName,
              customer_name: senderName,
              customer_phone: senderPhone,
              message: message
            })
          });
        case 5:
          rs = _context59.v;
          sentMessage = hydrateChatMessageForUi(rs === null || rs === void 0 ? void 0 : rs.data);
          if (sentMessage) {
            replaced = replaceOptimisticMessage(optimisticId, sentMessage);
            if (!replaced) appendChatMessage(sentMessage);
            if (!document.hidden || isChatPanelOpen()) {
              scheduleChatRender({
                fresh: true
              });
            }
          }
          _context59.n = 7;
          break;
        case 6:
          _context59.p = 6;
          _t37 = _context59.v;
          markChatMessageFailedById(optimisticId, (_t37 === null || _t37 === void 0 ? void 0 : _t37.message) || 'Gui that bai');
          scheduleChatRender();
          throw _t37;
        case 7:
          return _context59.a(2);
      }
    }, _callee59, null, [[4, 6]]);
  }));
  return _sendCustomerMessage.apply(this, arguments);
}
function enqueueCustomerMessage(text) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var message = String(text || '').trim();
  if (!message) return Promise.resolve();
  if (!Array.isArray(state.chat.sendQueue)) state.chat.sendQueue = [];
  return new Promise(function (resolve, reject) {
    state.chat.sendQueue.push({
      text: message,
      options: {
        restoreDraftOnError: options.restoreDraftOnError !== false,
        focusInputOnDone: options.focusInputOnDone !== false,
        timeoutMs: Math.max(8000, Number(options.timeoutMs) || 20000),
        silent: options.silent === true
      },
      resolve: resolve,
      reject: reject
    });
    flushCustomerMessageQueue().catch(function () {});
  });
}
function flushCustomerMessageQueue() {
  return _flushCustomerMessageQueue.apply(this, arguments);
}
function _flushCustomerMessageQueue() {
  _flushCustomerMessageQueue = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee61() {
    return _regenerator().w(function (_context61) {
      while (1) switch (_context61.n) {
        case 0:
          if (!state.chat.sendDrainPromise) {
            _context61.n = 1;
            break;
          }
          return _context61.a(2, state.chat.sendDrainPromise);
        case 1:
          state.chat.sendDrainPromise = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee60() {
            var nextJob, _nextJob$options, _nextJob$options2, _nextJob$options3, input, _t38;
            return _regenerator().w(function (_context60) {
              while (1) switch (_context60.p = _context60.n) {
                case 0:
                  if (!(Array.isArray(state.chat.sendQueue) && state.chat.sendQueue.length > 0)) {
                    _context60.n = 7;
                    break;
                  }
                  nextJob = state.chat.sendQueue.shift();
                  if (!(!nextJob || !String(nextJob.text || '').trim())) {
                    _context60.n = 1;
                    break;
                  }
                  return _context60.a(3, 0);
                case 1:
                  setChatSendBusy(true);
                  _context60.p = 2;
                  _context60.n = 3;
                  return sendCustomerMessage(nextJob.text, {
                    timeoutMs: ((_nextJob$options = nextJob.options) === null || _nextJob$options === void 0 ? void 0 : _nextJob$options.timeoutMs) || 20000
                  });
                case 3:
                  nextJob.resolve();
                  _context60.n = 5;
                  break;
                case 4:
                  _context60.p = 4;
                  _t38 = _context60.v;
                  input = document.getElementById('cinp');
                  if (((_nextJob$options2 = nextJob.options) === null || _nextJob$options2 === void 0 ? void 0 : _nextJob$options2.restoreDraftOnError) !== false && input && !String(input.value || '').trim()) {
                    input.value = nextJob.text;
                    autoResizeCustomerChatInput(input);
                    updateChatComposerState(input);
                  }
                  if (((_nextJob$options3 = nextJob.options) === null || _nextJob$options3 === void 0 ? void 0 : _nextJob$options3.focusInputOnDone) !== false && input) {
                    try {
                      input.focus();
                    } catch (_) {}
                  }
                  nextJob.reject(_t38);
                case 5:
                  _context60.p = 5;
                  setChatSendBusy(false);
                  return _context60.f(5);
                case 6:
                  _context60.n = 0;
                  break;
                case 7:
                  return _context60.a(2);
              }
            }, _callee60, null, [[2, 4, 5, 6]]);
          }))().finally(function () {
            state.chat.sendDrainPromise = null;
            updateChatComposerState(document.getElementById('cinp'));
          });
          return _context61.a(2, state.chat.sendDrainPromise);
      }
    }, _callee61);
  }));
  return _flushCustomerMessageQueue.apply(this, arguments);
}
function retryFailedChatMessage(_x13) {
  return _retryFailedChatMessage.apply(this, arguments);
}
function _retryFailedChatMessage() {
  _retryFailedChatMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee62(messageId) {
    var _message$_ui;
    var targetId, message, payload, ui, _document$getElementB15, _document$getElementB16, senderName, senderPhone, rs, sentMessage, _t39;
    return _regenerator().w(function (_context62) {
      while (1) switch (_context62.p = _context62.n) {
        case 0:
          targetId = String(messageId || '').trim();
          if (!(!targetId || !Array.isArray(state.chat.messages))) {
            _context62.n = 1;
            break;
          }
          return _context62.a(2);
        case 1:
          message = state.chat.messages.find(function (m) {
            return String((m === null || m === void 0 ? void 0 : m.id) || '') === targetId;
          });
          if (message) {
            _context62.n = 2;
            break;
          }
          return _context62.a(2);
        case 2:
          payload = message === null || message === void 0 || (_message$_ui = message._ui) === null || _message$_ui === void 0 ? void 0 : _message$_ui.retryPayload;
          if (!(!payload || payload.type !== 'text')) {
            _context62.n = 3;
            break;
          }
          return _context62.a(2);
        case 3:
          ui = ensureChatMessageUiMeta(message);
          ui.status = 'pending';
          ui.error = '';
          scheduleChatRender({
            fresh: true
          });
          _context62.p = 4;
          senderName = (((_document$getElementB15 = document.getElementById('chatCustomerName')) === null || _document$getElementB15 === void 0 ? void 0 : _document$getElementB15.value) || 'Khach hang').trim() || 'Khach hang';
          senderPhone = String(((_document$getElementB16 = document.getElementById('chatCustomerPhone')) === null || _document$getElementB16 === void 0 ? void 0 : _document$getElementB16.value) || '').replace(/\D/g, '');
          setChatSendBusy(true);
          _context62.n = 5;
          return apiJson('/api/chat/message', {
            method: 'POST',
            timeoutMs: 20000,
            body: JSON.stringify({
              session_code: state.chat.sessionCode,
              sender_type: 'customer',
              sender_name: senderName,
              customer_name: senderName,
              customer_phone: senderPhone,
              message: String(payload.message || '')
            })
          });
        case 5:
          rs = _context62.v;
          sentMessage = hydrateChatMessageForUi(rs === null || rs === void 0 ? void 0 : rs.data);
          if (sentMessage) {
            replaceOptimisticMessage(targetId, sentMessage);
            scheduleChatRender({
              fresh: true
            });
          }
          _context62.n = 7;
          break;
        case 6:
          _context62.p = 6;
          _t39 = _context62.v;
          markChatMessageFailedById(targetId, (_t39 === null || _t39 === void 0 ? void 0 : _t39.message) || 'Gui that bai');
          scheduleChatRender();
          throw _t39;
        case 7:
          _context62.p = 7;
          setChatSendBusy(false);
          return _context62.f(7);
        case 8:
          return _context62.a(2);
      }
    }, _callee62, null, [[4, 6, 7, 8]]);
  }));
  return _retryFailedChatMessage.apply(this, arguments);
}
function ensureChatMessageActionBindings() {
  if (state.chat.messageActionBound) return;
  var box = document.getElementById('cmsgs');
  if (!box) return;
  box.addEventListener('click', function (event) {
    var _event$target, _event$target$closest;
    var retryBtn = (_event$target = event.target) === null || _event$target === void 0 || (_event$target$closest = _event$target.closest) === null || _event$target$closest === void 0 ? void 0 : _event$target$closest.call(_event$target, '.cmsg-retry-btn');
    if (!retryBtn) return;
    event.preventDefault();
    event.stopPropagation();
    retryFailedChatMessage(retryBtn.dataset.chatRetryId).catch(function (err) {
      showToast("\u274C ".concat((err === null || err === void 0 ? void 0 : err.message) || 'Khong the gui lai tin nhan'));
    });
  });
  state.chat.messageActionBound = true;
}
function ensureChatVirtualScrollBinding() {
  if (state.chat.virtualScrollBound) return;
  var box = document.getElementById('cmsgs');
  if (!box) return;
  var scrollTicking = false;
  box.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      scrollTicking = false;
      scheduleChatRender();
    });
  }, {
    passive: true
  });
  state.chat.virtualScrollBound = true;
}
function appendEmojiToChatInput(emoji) {
  var input = document.getElementById('cinp');
  if (!input) return;
  input.value = "".concat(input.value || '').concat(emoji);
  autoResizeCustomerChatInput(input);
  updateChatComposerState(input);
  input.focus();
}
var _chatInputResizeRaf = 0;
var _chatInputLastHeight = 38;
var _chatInputComposing = false;
var _chatTypingEmitDebounceTimer = null;
function setChatInputTypingState() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var typingEl = document.getElementById('cinputTypingState');
  if (!typingEl) return;
  typingEl.textContent = String(text || '').trim();
}
function updateChatComposerState() {
  var inputEl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.getElementById('cinp');
  var panel = document.getElementById('cpanel');
  var inputWrap = document.getElementById('cinputWrap');
  var sendBtn = document.querySelector('.c-send');
  if (!inputEl || !sendBtn) return;

  // Auto-recover stale uploadBusy (e.g. network hang on mobile)
  if (state.chat.uploadBusy && state._uploadBusySince && Date.now() - state._uploadBusySince > 45000) {
    state.chat.uploadBusy = false;
    state._uploadBusySince = 0;
    inputEl.disabled = false;
  }
  if (state.chat.sendBusy && state.chat.sendBusySince && Date.now() - state.chat.sendBusySince > 45000) {
    state.chat.sendBusy = false;
    state.chat.sendBusySince = 0;
  }
  var hasText = String(inputEl.value || '').trim().length > 0;
  var chatReady = !!state.chat.sessionCode && isChatProfileComplete();
  var composerVisible = !inputWrap || inputWrap.style.display !== 'none';
  var canSend = hasText && composerVisible && chatReady && !state.chat.uploadBusy && !state.chat.sendBusy && !inputEl.disabled;
  sendBtn.disabled = !canSend;
  sendBtn.classList.toggle('is-busy', !!state.chat.sendBusy || !!state.chat.uploadBusy);
  sendBtn.setAttribute('aria-disabled', canSend ? 'false' : 'true');
  sendBtn.setAttribute('aria-busy', state.chat.sendBusy || state.chat.uploadBusy ? 'true' : 'false');
  if (panel) panel.classList.toggle('is-typing', hasText);
  setChatInputTypingState(hasText ? 'Bạn đang nhập tin nhắn...' : '');
}
function bindCustomerChatComposer() {
  var inputEl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.getElementById('cinp');
  if (!inputEl || inputEl.dataset.composerBound === '1') return;
  var refreshComposer = function refreshComposer() {
    autoResizeCustomerChatInput(inputEl);
    updateChatComposerState(inputEl);
  };
  inputEl.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey && !_chatInputComposing && !event.isComposing) {
      event.preventDefault();
      sendC();
    }
  });
  inputEl.addEventListener('compositionstart', function () {
    _chatInputComposing = true;
  });
  inputEl.addEventListener('compositionend', function () {
    _chatInputComposing = false;
    refreshComposer();
  });
  inputEl.addEventListener('input', function () {
    refreshComposer();
    if (_chatTypingEmitDebounceTimer) {
      clearTimeout(_chatTypingEmitDebounceTimer);
    }
    _chatTypingEmitDebounceTimer = setTimeout(function () {
      _chatTypingEmitDebounceTimer = null;
      if (state.chat.sessionCode) emitChatTyping();
    }, 90);
  });
  ['change', 'keyup', 'focus', 'blur'].forEach(function (eventName) {
    inputEl.addEventListener(eventName, refreshComposer);
  });
  ['paste', 'cut'].forEach(function (eventName) {
    inputEl.addEventListener(eventName, function () {
      setTimeout(refreshComposer, 0);
    });
  });
  refreshComposer();
  inputEl.dataset.composerBound = '1';
}
function ensureCustomerChatInteractiveBindings() {
  var input = document.getElementById('cinp');
  bindCustomerChatComposer(input);
  initChatDragDrop();
  initChatEmojiPicker();
  ensureChatMessageActionBindings();
  ensureChatVirtualScrollBinding();
  if (input) {
    autoResizeCustomerChatInput(input);
    updateChatComposerState(input);
  }
}
function autoResizeCustomerChatInput(inputEl) {
  if (!inputEl) return;
  if (_chatInputResizeRaf) {
    cancelAnimationFrame(_chatInputResizeRaf);
    _chatInputResizeRaf = 0;
  }
  _chatInputResizeRaf = requestAnimationFrame(function () {
    var minHeight = 44;
    var maxHeight = 136;
    inputEl.style.height = "".concat(minHeight, "px");
    var nextHeight = Math.min(inputEl.scrollHeight, maxHeight);
    var finalHeight = Math.max(minHeight, nextHeight);
    if (Math.abs(finalHeight - _chatInputLastHeight) > 0.5) {
      _chatInputLastHeight = finalHeight;
      inputEl.style.height = "".concat(finalHeight, "px");
    } else {
      inputEl.style.height = "".concat(_chatInputLastHeight, "px");
    }
    inputEl.style.overflowY = inputEl.scrollHeight > maxHeight ? 'auto' : 'hidden';
    _chatInputResizeRaf = 0;
  });
}
function initChatEmojiPicker() {
  var panel = document.getElementById('chatEmojiPanel');
  var grid = document.getElementById('chatEmojiGrid');
  var trigger = document.querySelector('.c-emoji');
  if (!panel || !grid || !trigger) return;
  var positionEmojiPanel = function positionEmojiPanel() {
    var row = document.querySelector('.cinp-row');
    if (!row) return;
    var rowRect = row.getBoundingClientRect();
    var triggerRect = trigger.getBoundingClientRect();
    var panelWidth = panel.offsetWidth || 352;
    var maxLeft = Math.max(8, rowRect.width - panelWidth - 8);
    var left = Math.min(Math.max(8, triggerRect.left - rowRect.left - 4), maxLeft);
    panel.style.left = "".concat(Math.round(left), "px");
    panel.style.bottom = "".concat(Math.round(rowRect.height + 8), "px");
  };
  var ensurePickerReady = /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      var data, picker, _t7;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            if (!(grid.dataset.ready === '1')) {
              _context7.n = 1;
              break;
            }
            return _context7.a(2);
          case 1:
            if (!(!window.EmojiMart || typeof window.EmojiMart.Picker !== 'function')) {
              _context7.n = 2;
              break;
            }
            grid.innerHTML = '<div class="chat-emoji-fallback">Emoji tạm thời không khả dụng.</div>';
            return _context7.a(2);
          case 2:
            _context7.p = 2;
            _context7.n = 3;
            return fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data').then(function (res) {
              if (!res.ok) throw new Error('Không tải được dữ liệu emoji');
              return res.json();
            });
          case 3:
            data = _context7.v;
            picker = new window.EmojiMart.Picker({
              data: data,
              theme: 'light',
              locale: 'vi',
              perLine: 8,
              previewPosition: 'none',
              skinTonePosition: 'none',
              onEmojiSelect: function onEmojiSelect(emoji) {
                appendEmojiToChatInput((emoji === null || emoji === void 0 ? void 0 : emoji.native) || '');
                panel.style.display = 'none';
              }
            });
            grid.innerHTML = '';
            grid.appendChild(picker);
            grid.dataset.ready = '1';
            if (panel.style.display && panel.style.display !== 'none') {
              requestAnimationFrame(positionEmojiPanel);
            }
            _context7.n = 5;
            break;
          case 4:
            _context7.p = 4;
            _t7 = _context7.v;
            grid.innerHTML = '<div class="chat-emoji-fallback">Không thể tải bộ emoji.</div>';
          case 5:
            return _context7.a(2);
        }
      }, _callee7, null, [[2, 4]]);
    }));
    return function ensurePickerReady() {
      return _ref15.apply(this, arguments);
    };
  }();
  if (!state.chat.emojiBound) {
    trigger.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            _context8.n = 1;
            return ensurePickerReady();
          case 1:
            panel.style.display = panel.style.display === 'none' || !panel.style.display ? 'block' : 'none';
            if (panel.style.display === 'block') {
              requestAnimationFrame(positionEmojiPanel);
            }
          case 2:
            return _context8.a(2);
        }
      }, _callee8);
    })));
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && !trigger.contains(e.target)) {
        panel.style.display = 'none';
      }
    });
    window.addEventListener('resize', function () {
      if (panel.style.display === 'none' || !panel.style.display) return;
      positionEmojiPanel();
    });
    state.chat.emojiBound = true;
  }
}

// ─── Voice Recording ───
var _voiceMediaRecorder = null;
var _voiceChunks = [];
var _voiceRecordingTimer = null;
var _voiceRecordingStartTs = 0;
var VOICE_MAX_DURATION_MS = 120000; // 2 minutes max

function isVoiceRecording() {
  return _voiceMediaRecorder && _voiceMediaRecorder.state === 'recording';
}
function updateVoiceRecordingUI(recording) {
  var btn = document.getElementById('btnVoice');
  var timerEl = document.getElementById('voiceRecordTimer');
  var wrap = document.getElementById('cinputWrap');
  if (btn) {
    btn.classList.toggle('recording', recording);
    btn.title = recording ? 'Dừng ghi âm' : 'Ghi âm';
    btn.innerHTML = recording ? '<span class="voice-rec-pulse"></span>⏹️' : '🎤';
  }
  if (timerEl) timerEl.style.display = recording ? 'inline' : 'none';
  if (wrap) wrap.classList.toggle('voice-recording', recording);
}
function updateVoiceTimer() {
  var timerEl = document.getElementById('voiceRecordTimer');
  if (!timerEl || !_voiceRecordingStartTs) return;
  var elapsed = Math.floor((Date.now() - _voiceRecordingStartTs) / 1000);
  var mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  var ss = String(elapsed % 60).padStart(2, '0');
  timerEl.textContent = "\uD83D\uDD34 ".concat(mm, ":").concat(ss);
}
function startVoiceRecording() {
  return _startVoiceRecording.apply(this, arguments);
}
function _startVoiceRecording() {
  _startVoiceRecording = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee64() {
    var stream, mimeType, msg, _t41;
    return _regenerator().w(function (_context64) {
      while (1) switch (_context64.p = _context64.n) {
        case 0:
          if (state.chat.sessionCode) {
            _context64.n = 1;
            break;
          }
          showToast('❌ Vui lòng bắt đầu chat trước khi ghi âm');
          return _context64.a(2);
        case 1:
          if (!state.chat.uploadBusy) {
            _context64.n = 2;
            break;
          }
          return _context64.a(2);
        case 2:
          if (!isVoiceRecording()) {
            _context64.n = 3;
            break;
          }
          stopVoiceRecording();
          return _context64.a(2);
        case 3:
          _context64.p = 3;
          _context64.n = 4;
          return navigator.mediaDevices.getUserMedia({
            audio: true
          });
        case 4:
          stream = _context64.v;
          mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
          _voiceChunks = [];
          _voiceMediaRecorder = new MediaRecorder(stream, {
            mimeType: mimeType
          });
          _voiceMediaRecorder.ondataavailable = function (e) {
            if (e.data && e.data.size > 0) _voiceChunks.push(e.data);
          };
          _voiceMediaRecorder.onstop = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee63() {
            var blob, ext, file, _t40;
            return _regenerator().w(function (_context63) {
              while (1) switch (_context63.p = _context63.n) {
                case 0:
                  clearInterval(_voiceRecordingTimer);
                  _voiceRecordingTimer = null;
                  stream.getTracks().forEach(function (t) {
                    return t.stop();
                  });
                  updateVoiceRecordingUI(false);
                  if (_voiceChunks.length) {
                    _context63.n = 1;
                    break;
                  }
                  return _context63.a(2);
                case 1:
                  blob = new Blob(_voiceChunks, {
                    type: mimeType
                  });
                  _voiceChunks = [];
                  if (!(blob.size < 1000)) {
                    _context63.n = 2;
                    break;
                  }
                  showToast('ℹ️ Ghi âm quá ngắn, vui lòng thử lại');
                  return _context63.a(2);
                case 2:
                  ext = mimeType.includes('webm') ? 'webm' : 'ogg';
                  file = new File([blob], "voice-".concat(Date.now(), ".").concat(ext), {
                    type: mimeType
                  });
                  _context63.p = 3;
                  _context63.n = 4;
                  return uploadAndSendChatAttachment(file, 'audio');
                case 4:
                  _context63.n = 6;
                  break;
                case 5:
                  _context63.p = 5;
                  _t40 = _context63.v;
                  showToast("\u274C ".concat(_t40.message || 'Không thể gửi ghi âm'));
                case 6:
                  return _context63.a(2);
              }
            }, _callee63, null, [[3, 5]]);
          }));
          _voiceMediaRecorder.onerror = function () {
            clearInterval(_voiceRecordingTimer);
            _voiceRecordingTimer = null;
            stream.getTracks().forEach(function (t) {
              return t.stop();
            });
            updateVoiceRecordingUI(false);
            showToast('❌ Lỗi ghi âm');
          };
          _voiceMediaRecorder.start(250);
          _voiceRecordingStartTs = Date.now();
          updateVoiceRecordingUI(true);
          _voiceRecordingTimer = setInterval(updateVoiceTimer, 500);

          // Auto-stop after max duration
          setTimeout(function () {
            if (isVoiceRecording()) stopVoiceRecording();
          }, VOICE_MAX_DURATION_MS);
          _context64.n = 6;
          break;
        case 5:
          _context64.p = 5;
          _t41 = _context64.v;
          msg = String((_t41 === null || _t41 === void 0 ? void 0 : _t41.message) || '').toLowerCase();
          if (msg.includes('denied') || msg.includes('permission') || msg.includes('not allowed')) {
            showToast('❌ Vui lòng cho phép quyền truy cập micro trong trình duyệt');
          } else {
            showToast('❌ Không thể bật ghi âm: ' + (_t41.message || 'Lỗi không xác định'));
          }
        case 6:
          return _context64.a(2);
      }
    }, _callee64, null, [[3, 5]]);
  }));
  return _startVoiceRecording.apply(this, arguments);
}
function stopVoiceRecording() {
  if (_voiceMediaRecorder && _voiceMediaRecorder.state === 'recording') {
    _voiceMediaRecorder.stop();
  }
}
function openChatFilePicker() {
  var kind = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'file';
  if (!state.chat.sessionCode) {
    showToast('❌ Vui lòng bắt đầu chat trước khi gửi ảnh/file');
    return;
  }
  if (state.chat.uploadBusy) return;
  var inputId = kind === 'image' ? 'chatImageInput' : 'chatAttachInput';
  var input = document.getElementById(inputId);
  if (input) input.click();
}
function handleChatFilePicked(_x14) {
  return _handleChatFilePicked.apply(this, arguments);
}
function _handleChatFilePicked() {
  _handleChatFilePicked = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee65(event) {
    var _event$target2;
    var forcedType,
      file,
      _args65 = arguments,
      _t42;
    return _regenerator().w(function (_context65) {
      while (1) switch (_context65.p = _context65.n) {
        case 0:
          forcedType = _args65.length > 1 && _args65[1] !== undefined ? _args65[1] : 'file';
          file = event === null || event === void 0 || (_event$target2 = event.target) === null || _event$target2 === void 0 || (_event$target2 = _event$target2.files) === null || _event$target2 === void 0 ? void 0 : _event$target2[0];
          if (file) {
            _context65.n = 1;
            break;
          }
          return _context65.a(2);
        case 1:
          _context65.p = 1;
          _context65.n = 2;
          return uploadAndSendChatAttachment(file, forcedType);
        case 2:
          _context65.n = 4;
          break;
        case 3:
          _context65.p = 3;
          _t42 = _context65.v;
          showToast("\u274C ".concat(_t42.message || 'Không thể gửi tệp'));
        case 4:
          _context65.p = 4;
          if (event.target) event.target.value = '';
          return _context65.f(4);
        case 5:
          return _context65.a(2);
      }
    }, _callee65, null, [[1, 3, 4, 5]]);
  }));
  return _handleChatFilePicked.apply(this, arguments);
}
function setChatUploadProgress() {
  var percent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var progressEl = document.getElementById('chatUploadProgress');
  if (!progressEl) return;
  if (percent === null) {
    progressEl.style.display = 'none';
    return;
  }
  var pct = Math.max(0, Math.min(100, Number(percent) || 0));
  progressEl.style.display = 'block';
  progressEl.textContent = text || "\u0110ang t\u1EA3i ".concat(pct, "%");
}
function setChatUploadBusy(busy) {
  state.chat.uploadBusy = !!busy;
  if (state._uploadBusySafetyTimer) {
    clearTimeout(state._uploadBusySafetyTimer);
    state._uploadBusySafetyTimer = null;
  }
  if (busy) {
    state._uploadBusySince = Date.now();
    state._uploadBusySafetyTimer = setTimeout(function () {
      if (state.chat.uploadBusy) setChatUploadBusy(false);
    }, 45000);
  } else {
    state._uploadBusySince = 0;
  }
  var sendBtn = document.querySelector('.c-send');
  var fileBtn = document.querySelector('.c-tool[onclick*="file"]');
  var imageBtn = document.querySelector('.c-tool[onclick*="image"]');
  var input = document.getElementById('cinp');
  if (sendBtn) sendBtn.disabled = busy;
  if (fileBtn) fileBtn.disabled = busy;
  if (imageBtn) imageBtn.disabled = busy;
  if (input) input.disabled = busy;
  updateChatComposerState(input || document.getElementById('cinp'));
}
function setChatSendBusy(busy) {
  state.chat.sendBusy = !!busy;
  state.chat.sendBusySince = busy ? Date.now() : 0;
  updateChatComposerState(document.getElementById('cinp'));
}
function uploadFileWithProgress(file, onProgress) {
  return new Promise(function (resolve, reject) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('session_code', state.chat.sessionCode || '');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/chat/upload', true);
    xhr.upload.onprogress = function (evt) {
      if (!evt.lengthComputable) return;
      var percent = Math.round(evt.loaded / evt.total * 100);
      if (typeof onProgress === 'function') onProgress(percent);
    };
    xhr.onload = function () {
      try {
        var data = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300 && data.success) {
          resolve(data);
          return;
        }
        reject(new Error(data.message || 'Upload thất bại'));
      } catch (_) {
        reject(new Error('Phản hồi upload không hợp lệ'));
      }
    };
    xhr.onerror = function () {
      return reject(new Error('Lỗi mạng khi tải tệp'));
    };
    xhr.timeout = 30000;
    xhr.ontimeout = function () {
      return reject(new Error('Tải tệp quá lâu, vui lòng thử lại'));
    };
    xhr.send(formData);
  });
}
function uploadAndSendChatAttachment(_x15) {
  return _uploadAndSendChatAttachment.apply(this, arguments);
}
function _uploadAndSendChatAttachment() {
  _uploadAndSendChatAttachment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee66(file) {
    var forcedType,
      isImage,
      isAudio,
      label,
      messageType,
      _uploadRs$data,
      _document$getElementB17,
      _document$getElementB18,
      uploadRs,
      attachmentUrl,
      senderName,
      senderPhone,
      rs,
      sentMessage,
      _args66 = arguments;
    return _regenerator().w(function (_context66) {
      while (1) switch (_context66.p = _context66.n) {
        case 0:
          forcedType = _args66.length > 1 && _args66[1] !== undefined ? _args66[1] : 'file';
          if (state.chat.sessionCode) {
            _context66.n = 1;
            break;
          }
          throw new Error('Vui lòng bắt đầu chat trước');
        case 1:
          if (file) {
            _context66.n = 2;
            break;
          }
          return _context66.a(2);
        case 2:
          if (!(file.size > 20 * 1024 * 1024)) {
            _context66.n = 3;
            break;
          }
          throw new Error('Tệp vượt quá 20MB');
        case 3:
          isImage = forcedType === 'image' || String(file.type || '').startsWith('image/');
          isAudio = forcedType === 'audio' || String(file.type || '').startsWith('audio/');
          label = isAudio ? "\uD83C\uDFA4 Tin nh\u1EAFn tho\u1EA1i" : isImage ? "\uD83D\uDDBC\uFE0F ".concat(file.name) : "\uD83D\uDCCE ".concat(file.name);
          messageType = isImage ? 'image' : 'file';
          setChatUploadBusy(true);
          setChatUploadProgress(0, 'Đang tải 0%');
          _context66.p = 4;
          _context66.n = 5;
          return uploadFileWithProgress(file, function (percent) {
            setChatUploadProgress(percent, "\u0110ang t\u1EA3i ".concat(percent, "%"));
          });
        case 5:
          uploadRs = _context66.v;
          attachmentUrl = uploadRs === null || uploadRs === void 0 || (_uploadRs$data = uploadRs.data) === null || _uploadRs$data === void 0 ? void 0 : _uploadRs$data.url;
          if (attachmentUrl) {
            _context66.n = 6;
            break;
          }
          throw new Error('Không nhận được URL tệp');
        case 6:
          senderName = (((_document$getElementB17 = document.getElementById('chatCustomerName')) === null || _document$getElementB17 === void 0 ? void 0 : _document$getElementB17.value) || 'Khách hàng').trim() || 'Khách hàng';
          senderPhone = String(((_document$getElementB18 = document.getElementById('chatCustomerPhone')) === null || _document$getElementB18 === void 0 ? void 0 : _document$getElementB18.value) || '').replace(/\D/g, '');
          _context66.n = 7;
          return apiJson('/api/chat/message', {
            method: 'POST',
            body: JSON.stringify({
              session_code: state.chat.sessionCode,
              sender_type: 'customer',
              sender_name: senderName,
              customer_name: senderName,
              customer_phone: senderPhone,
              message: label,
              message_type: messageType,
              attachment_url: attachmentUrl,
              attachment_type: file.type || null
            })
          });
        case 7:
          rs = _context66.v;
          setChatUploadProgress(100, 'Đã tải xong 100%');
          sentMessage = rs === null || rs === void 0 ? void 0 : rs.data;
          if (sentMessage && appendChatMessage(sentMessage)) {
            if (!document.hidden || isChatPanelOpen()) {
              scheduleChatRender({
                fresh: true
              });
            }
          }
          showToast(isAudio ? '🎤 Đã gửi tin nhắn thoại' : isImage ? '🖼️ Đã gửi ảnh' : '📎 Đã gửi tệp');
        case 8:
          _context66.p = 8;
          setTimeout(function () {
            return setChatUploadProgress(null);
          }, 500);
          setChatUploadBusy(false);
          return _context66.f(8);
        case 9:
          return _context66.a(2);
      }
    }, _callee66, null, [[4,, 8, 9]]);
  }));
  return _uploadAndSendChatAttachment.apply(this, arguments);
}
function initChatDragDrop() {
  if (state.chat.dragDropBound) return;
  var panel = document.getElementById('cpanel');
  var dropZone = document.getElementById('cmsgs');
  if (!panel || !dropZone) return;
  var stopEvt = function stopEvt(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  };
  ['dragenter', 'dragover'].forEach(function (evtName) {
    dropZone.addEventListener(evtName, function (evt) {
      stopEvt(evt);
      if (!state.chat.sessionCode || state.chat.uploadBusy) return;
      panel.classList.add('drag-over');
    });
  });
  ['dragleave', 'drop'].forEach(function (evtName) {
    dropZone.addEventListener(evtName, function (evt) {
      stopEvt(evt);
      panel.classList.remove('drag-over');
    });
  });
  dropZone.addEventListener('drop', /*#__PURE__*/function () {
    var _ref17 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(evt) {
      var _evt$dataTransfer;
      var file, forcedType, _t8;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            file = (_evt$dataTransfer = evt.dataTransfer) === null || _evt$dataTransfer === void 0 || (_evt$dataTransfer = _evt$dataTransfer.files) === null || _evt$dataTransfer === void 0 ? void 0 : _evt$dataTransfer[0];
            if (file) {
              _context9.n = 1;
              break;
            }
            return _context9.a(2);
          case 1:
            if (state.chat.sessionCode) {
              _context9.n = 2;
              break;
            }
            showToast('❌ Vui lòng bắt đầu chat trước khi kéo-thả tệp');
            return _context9.a(2);
          case 2:
            forcedType = String(file.type || '').startsWith('image/') ? 'image' : 'file';
            _context9.p = 3;
            _context9.n = 4;
            return uploadAndSendChatAttachment(file, forcedType);
          case 4:
            _context9.n = 6;
            break;
          case 5:
            _context9.p = 5;
            _t8 = _context9.v;
            showToast("\u274C ".concat(_t8.message || 'Không thể gửi tệp'));
          case 6:
            return _context9.a(2);
        }
      }, _callee9, null, [[3, 5]]);
    }));
    return function (_x16) {
      return _ref17.apply(this, arguments);
    };
  }());
  state.chat.dragDropBound = true;
}
function qChat(_x17) {
  return _qChat.apply(this, arguments);
}
function _qChat() {
  _qChat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee67(t) {
    var _t43;
    return _regenerator().w(function (_context67) {
      while (1) switch (_context67.p = _context67.n) {
        case 0:
          _context67.p = 0;
          _context67.n = 1;
          return enqueueCustomerMessage(t, {
            restoreDraftOnError: false,
            focusInputOnDone: true,
            timeoutMs: 20000
          });
        case 1:
          _context67.n = 3;
          break;
        case 2:
          _context67.p = 2;
          _t43 = _context67.v;
          showToast("\u274C ".concat(_t43.message));
        case 3:
          return _context67.a(2);
      }
    }, _callee67, null, [[0, 2]]);
  }));
  return _qChat.apply(this, arguments);
}
function sendC() {
  return _sendC.apply(this, arguments);
} // Open chat panel pre-filled with prize info for customer care request
function _sendC() {
  _sendC = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee68() {
    var i, v, _t44;
    return _regenerator().w(function (_context68) {
      while (1) switch (_context68.p = _context68.n) {
        case 0:
          i = document.getElementById('cinp');
          if (i) {
            _context68.n = 1;
            break;
          }
          return _context68.a(2);
        case 1:
          if (!(state.chat.sendBusy || state.chat.uploadBusy)) {
            _context68.n = 2;
            break;
          }
          return _context68.a(2);
        case 2:
          v = i.value.trim();
          if (v) {
            _context68.n = 3;
            break;
          }
          return _context68.a(2);
        case 3:
          i.value = '';
          autoResizeCustomerChatInput(i);
          updateChatComposerState(i);
          _context68.p = 4;
          _context68.n = 5;
          return enqueueCustomerMessage(v, {
            restoreDraftOnError: true,
            focusInputOnDone: true,
            timeoutMs: 20000
          });
        case 5:
          _context68.n = 7;
          break;
        case 6:
          _context68.p = 6;
          _t44 = _context68.v;
          showToast("\u274C ".concat(_t44.message));
        case 7:
          _context68.p = 7;
          updateChatComposerState(i);
          i.focus();
          return _context68.f(7);
        case 8:
          return _context68.a(2);
      }
    }, _callee68, null, [[4, 6, 7, 8]]);
  }));
  return _sendC.apply(this, arguments);
}
function openChatWithPrizeInfo(_x18) {
  return _openChatWithPrizeInfo.apply(this, arguments);
}
function _openChatWithPrizeInfo() {
  _openChatWithPrizeInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee69(boxNumber) {
    var box, decision, isUnluckyBox, sessionCode, prizeName, prizeIcon, prizeValue, isCash, panel;
    return _regenerator().w(function (_context69) {
      while (1) switch (_context69.n) {
        case 0:
          box = state.boxes[boxNumber] || {};
          decision = String(box.decision || '').toLowerCase();
          isUnluckyBox = box.state === 'opened-bad' || String(box.level || '').toUpperCase() === 'UNLUCKY';
          if (!(isUnluckyBox || decision === 'converted' || decision === 'declined')) {
            _context69.n = 1;
            break;
          }
          showToast('ℹ️ Trạng thái phần thưởng hiện tại không hỗ trợ gửi yêu cầu CSKH.');
          return _context69.a(2);
        case 1:
          sessionCode = state.sessionCode || 'N/A';
          prizeName = box.name || 'Phần thưởng';
          prizeIcon = box.icon || '🎁';
          prizeValue = Number(box.value || 0);
          isCash = !!(box.isCash && prizeValue > 0); // Store prize info so it auto-sends after chat starts
          state.chat.pendingPrizeInfo = {
            boxNumber: boxNumber,
            sessionCode: sessionCode,
            prizeName: prizeName,
            prizeIcon: prizeIcon,
            prizeValue: prizeValue,
            isCash: isCash
          };

          // Open chat panel
          panel = document.getElementById('cpanel');
          if (panel && !panel.classList.contains('open')) {
            panel.classList.add('open');
            initCustomerChatUI();
          }

          // If chat is already started, send the prize info immediately
          if (!state.chat.sessionCode) {
            _context69.n = 2;
            break;
          }
          _context69.n = 2;
          return sendPrizeInfoMessage();
        case 2:
          return _context69.a(2);
      }
    }, _callee69);
  }));
  return _openChatWithPrizeInfo.apply(this, arguments);
}
function sendPrizeInfoMessage() {
  return _sendPrizeInfoMessage.apply(this, arguments);
}
function _sendPrizeInfoMessage() {
  _sendPrizeInfoMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee70() {
    var info, lines, _t45;
    return _regenerator().w(function (_context70) {
      while (1) switch (_context70.p = _context70.n) {
        case 0:
          info = state.chat.pendingPrizeInfo;
          if (!(!info || !state.chat.sessionCode)) {
            _context70.n = 1;
            break;
          }
          return _context70.a(2);
        case 1:
          state.chat.pendingPrizeInfo = null;
          lines = ["\uD83C\uDF81 Y\xCAU C\u1EA6U NH\u1EACN TH\u01AF\u1EDENG", "", "\uD83C\uDFAE  M\xE3 phi\xEAn:  ".concat(info.sessionCode), "\uD83D\uDCE6  H\u1ED9p qu\xE0:   #".concat(info.boxNumber), "".concat(info.prizeIcon, "  Gi\u1EA3i th\u01B0\u1EDFng: ").concat(info.prizeName), info.isCash ? "\uD83D\uDCB0  Gi\xE1 tr\u1ECB:   ".concat(formatCurrency(info.prizeValue, state.sessionCurrency)) : '', "", "Vui l\xF2ng h\u1ED7 tr\u1EE3 t\xF4i nh\u1EADn ph\u1EA7n th\u01B0\u1EDFng n\xE0y. Xin c\u1EA3m \u01A1n!"].filter(function (l) {
            return l !== false && l !== null && l !== undefined;
          }).join('\n');
          _context70.p = 2;
          _context70.n = 3;
          return enqueueCustomerMessage(lines, {
            restoreDraftOnError: false,
            focusInputOnDone: false,
            timeoutMs: 22000
          });
        case 3:
          _context70.n = 5;
          break;
        case 4:
          _context70.p = 4;
          _t45 = _context70.v;
          showToast("\u274C ".concat(_t45.message));
        case 5:
          return _context70.a(2);
      }
    }, _callee70, null, [[2, 4]]);
  }));
  return _sendPrizeInfoMessage.apply(this, arguments);
}
function initCustomerChatUI() {
  return _initCustomerChatUI.apply(this, arguments);
}
function _initCustomerChatUI() {
  _initCustomerChatUI = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee71() {
    var savedProfile, fallback, nameInput, phoneInput, sessionCodeInput, cinpEl, recoverComposer, _t46;
    return _regenerator().w(function (_context71) {
      while (1) switch (_context71.p = _context71.n) {
        case 0:
          migrateLegacyChatStorage();
          ensureCustomerChatInteractiveBindings();
          if (isMobileLiteEffects()) {
            state.chat.maxDomMessages = 220;
            state.chat.virtualizationThreshold = 42;
            state.chat.virtualWindowSize = 32;
            state.chat.virtualOverscan = 8;
            state.chat.virtualRowEstimate = 76;
            state.chat.messagesFetchMinIntervalMs = 2600;
            state.chat.pollingInterval = 1200;
          }
          if (!state.chat.initialized) {
            savedProfile = function () {
              try {
                return JSON.parse(localStorage.getItem(getChatProfileStorageKey()) || '{}');
              } catch (_) {
                return {};
              }
            }();
            fallback = loadSessionProfile('withdrawProfile', {});
            nameInput = document.getElementById('chatCustomerName');
            phoneInput = document.getElementById('chatCustomerPhone');
            sessionCodeInput = document.getElementById('chatGameSessionCode');
            if (nameInput && !nameInput.value) nameInput.value = savedProfile.customerName || fallback.customerName || '';
            if (phoneInput && !phoneInput.value) phoneInput.value = savedProfile.customerPhone || fallback.customerPhone || '';
            if (sessionCodeInput && !sessionCodeInput.value) sessionCodeInput.value = savedProfile.gameSessionCode || (state.sessionCode || '').toUpperCase();
            state.chat.profileCompleted = hasValidSavedChatProfile(savedProfile);
            state.chat.initialized = true;
          }
          if (!state.chat.sessionCode) {
            state.chat.sessionCode = localStorage.getItem(getChatSessionStorageKey()) || '';
          }
          if (state.chat.sessionCode) {
            _context71.n = 1;
            break;
          }
          // Keep pre-chat form visible and wait for explicit customer submit.
          setChatReadyUI(false);
          scheduleChatRender();
          return _context71.a(2);
        case 1:
          if (state.chat.sessionCode) {
            state.chat.lastSeenAt = Number(localStorage.getItem(getChatSeenStorageKey()) || '0') || 0;
            state.chat.lastUnreadCount = Number(localStorage.getItem(getChatUnreadStorageKey()) || '0') || 0;
          }
          initChatDragDrop();
          initChatEmojiPicker();
          ensureChatMessageActionBindings();
          ensureChatVirtualScrollBinding();
          cinpEl = document.getElementById('cinp');
          bindCustomerChatComposer(cinpEl);
          if (!state.chat.composerRecoveryBound) {
            recoverComposer = function recoverComposer() {
              var input = document.getElementById('cinp');
              if (!input) return;
              autoResizeCustomerChatInput(input);
              updateChatComposerState(input);
            };
            window.addEventListener('pageshow', recoverComposer, {
              passive: true
            });
            window.addEventListener('focus', recoverComposer, {
              passive: true
            });
            document.addEventListener('visibilitychange', function () {
              if (!document.hidden) recoverComposer();
            });
            state.chat.composerRecoveryBound = true;
          }
          if (!(!state.chat.sessionCode || !isChatProfileComplete())) {
            _context71.n = 2;
            break;
          }
          setChatReadyUI(false);
          scheduleChatRender();
          return _context71.a(2);
        case 2:
          setChatReadyUI(true);
          _context71.p = 3;
          _context71.n = 4;
          return fetchChatMessages();
        case 4:
          _context71.n = 6;
          break;
        case 5:
          _context71.p = 5;
          _t46 = _context71.v;
          setChatReadyUI(false);
          state.chat.sessionCode = '';
          localStorage.removeItem(getChatSessionStorageKey());
          localStorage.removeItem(getChatUnreadStorageKey());
        case 6:
          startChatSSE();
        case 7:
          return _context71.a(2);
      }
    }, _callee71, null, [[3, 5]]);
  }));
  return _initCustomerChatUI.apply(this, arguments);
}
function checkExistingWithdrawal() {
  return _checkExistingWithdrawal.apply(this, arguments);
}
function _checkExistingWithdrawal() {
  _checkExistingWithdrawal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee72() {
    var result, rows, sorted, latest, mappings, _t47;
    return _regenerator().w(function (_context72) {
      while (1) switch (_context72.p = _context72.n) {
        case 0:
          if (state.sessionCode) {
            _context72.n = 1;
            break;
          }
          return _context72.a(2);
        case 1:
          state.existingWithdrawalId = null;
          state.isUpdatingWithdrawal = false;
          _context72.p = 2;
          _context72.n = 3;
          return apiJson("/api/withdrawals/session/".concat(encodeURIComponent(state.sessionCode)));
        case 3:
          result = _context72.v;
          rows = Array.isArray(result.data) ? result.data : [];
          state.withdrawalHistoryRows = rows;
          state.withdrawalHistorySessionCode = String(state.sessionCode || '').trim().toUpperCase();
          handleWithdrawalDecisionToasts(rows);
          if (rows.length) {
            _context72.n = 4;
            break;
          }
          return _context72.a(2, []);
        case 4:
          sorted = _toConsumableArray(rows).sort(function (a, b) {
            var ta = new Date(a.requested_at || a.created_at || a.createdAt || 0).getTime();
            var tb = new Date(b.requested_at || b.created_at || b.createdAt || 0).getTime();
            return tb - ta;
          });
          latest = sorted[0];
          if (latest) {
            _context72.n = 5;
            break;
          }
          return _context72.a(2, sorted);
        case 5:
          // Always create new withdrawal requests; history is used for prefill only.
          state.existingWithdrawalId = null;
          state.isUpdatingWithdrawal = false;

          // Store bank name for later matching after VietQR banks load
          if (latest.bank_name) state.existingWithdrawalBankName = latest.bank_name;
          mappings = [['withName', latest.customer_name], ['withPhone', latest.customer_phone], ['withEmail', latest.customer_email], ['withAccNo', latest.account_number], ['withAccName', latest.account_holder], ['withAmount', latest.amount]];
          mappings.forEach(function (_ref29) {
            var _ref30 = _slicedToArray(_ref29, 2),
              id = _ref30[0],
              value = _ref30[1];
            var el = document.getElementById(id);
            if (!el) return;
            if (id === 'withAmount') {
              if (!el.value && Number(value) > 0) el.value = formatMoneyComma(value);
              return;
            }
            if (!el.value && value) el.value = String(value);
          });
          return _context72.a(2, sorted);
        case 6:
          _context72.p = 6;
          _t47 = _context72.v;
          // Keep modal usable even if history endpoint fails.
          state.withdrawalHistoryRows = [];
          state.withdrawalHistorySessionCode = String(state.sessionCode || '').trim().toUpperCase();
          return _context72.a(2, []);
      }
    }, _callee72, null, [[2, 6]]);
  }));
  return _checkExistingWithdrawal.apply(this, arguments);
}
function switchWithTab(tab) {
  state.withdrawModalTab = 'create';
  var historyBtn = document.getElementById('withTabHistory');
  var createBtn = document.getElementById('withTabCreate');
  if (historyBtn) historyBtn.classList.remove('active');
  if (createBtn) createBtn.classList.remove('active');
  var historyPanel = document.getElementById('withPanelHistory');
  var createPanel = document.getElementById('withPanelCreate');
  if (historyPanel) historyPanel.style.display = '';
  if (createPanel) createPanel.style.display = '';
  var trustWrap = document.getElementById('withTrustWrap');
  if (trustWrap) trustWrap.style.display = '';
}
function fillWithdrawAmountPercent(percent) {
  var p = Number(percent) || 0;
  var amountInput = document.getElementById('withAmount');
  if (!amountInput) return;
  var amount = Math.floor(Math.max(0, Number(state.wallet.remaining || 0)) * p / 100);
  amountInput.value = formatMoneyComma(amount);
}
function getWithdrawalStatusText(status) {
  var st = String(status || '').toLowerCase();
  if (st === 'approved') return 'Đã duyệt';
  if (st === 'rejected') return 'Từ chối';
  return 'Chờ xử lý';
}
function getCleanRejectionReason(row) {
  var raw = String((row === null || row === void 0 ? void 0 : row.rejection_reason) || (row === null || row === void 0 ? void 0 : row.rejectionReason) || (row === null || row === void 0 ? void 0 : row.reason) || '').trim();
  if (!raw) return '';
  var lowered = raw.toLowerCase();
  var looksLikeRequestNote = /^\[wd-[^\]]+\]/i.test(raw) || lowered.includes('liên hệ cskh') && lowered.includes('mã rút tiền');
  if (looksLikeRequestNote) return '';
  return raw;
}
function getWithdrawalStatusNoteMeta(row, status) {
  var requestCode = getWithdrawalSupportRef(row);
  var snapshot = row !== null && row !== void 0 && row.box_selection_snapshot && _typeof(row.box_selection_snapshot) === 'object' ? row.box_selection_snapshot : {};
  var supportHint = String(snapshot.support_hint || '').trim();
  if (status === 'rejected') {
    var rejectionReason = getCleanRejectionReason(row);
    return {
      className: 'rejected',
      label: 'Ghi chú từ chối',
      text: rejectionReason || DEFAULT_WITHDRAW_REJECT_REASON
    };
  }
  if (status === 'approved') {
    var codeText = requestCode ? "M\xE3 ".concat(requestCode, ". ") : '';
    return {
      className: 'approved',
      label: 'Ghi chú duyệt',
      text: "".concat(codeText, "Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n \u0111\xE3 \u0111\u01B0\u1EE3c duy\u1EC7t v\xE0 x\u1EED l\xFD th\xE0nh c\xF4ng.").trim()
    };
  }
  var hintText = supportHint || 'Yêu cầu đang chờ CSKH kiểm tra và duyệt.';
  var pendingText = requestCode ? "M\xE3 ".concat(requestCode, ". ").concat(hintText) : hintText;
  return {
    className: 'pending',
    label: 'Ghi chú chờ duyệt',
    text: pendingText
  };
}
function renderWithdrawalHistory() {
  var list = document.getElementById('withHistoryList');
  if (!list) return;
  var rows = Array.isArray(state.withdrawalHistoryRows) ? _toConsumableArray(state.withdrawalHistoryRows) : [];
  rows.sort(function (a, b) {
    var ta = new Date(a.requested_at || a.created_at || a.createdAt || 0).getTime();
    var tb = new Date(b.requested_at || b.created_at || b.createdAt || 0).getTime();
    return tb - ta;
  });
  if (!rows.length) {
    list.className = 'with-history-empty';
    list.textContent = contentTextGlobal('withHistoryEmpty', 'Chưa có lệnh rút tiền nào');
    return;
  }
  list.className = 'with-history-list';
  list.innerHTML = rows.map(function (row, index) {
    var amount = Number(row.amount || 0).toLocaleString('vi-VN');
    var dateText = formatDateTime(row.requested_at || row.created_at || row.createdAt || '');
    var status = String(row.status || 'pending').toLowerCase();
    var bankName = esc(row.bank_name || 'Chưa có ngân hàng');
    var accountNumber = esc(row.account_number || 'Chưa có số tài khoản');
    var accountHolder = esc(row.account_holder || 'Chưa có chủ tài khoản');
    var requestCode = getWithdrawalSupportRef(row);
    var noteMeta = getWithdrawalStatusNoteMeta(row, status);
    var noteHtml = noteMeta ? "<div class=\"with-history-note ".concat(noteMeta.className, "\"><span class=\"with-history-note-label\">").concat(esc(noteMeta.label), ":</span> <span class=\"with-history-note-text\">").concat(esc(noteMeta.text), "</span></div>") : '';
    var remainingMs = requestCode ? getWithdrawalSupportRemainingMs(requestCode) : 0;
    var disabled = !requestCode || remainingMs > 0;
    var coolMinutes = Math.floor(remainingMs / 60000);
    var coolSeconds = Math.floor(remainingMs % 60000 / 1000);
    var supportLabel = remainingMs > 0 ? "\u0110\u1EE3i ".concat(coolMinutes, ":").concat(String(coolSeconds).padStart(2, '0')) : 'Gửi CSKH';
    var supportTitle = !requestCode ? 'Không có mã lệnh rút tiền để gửi CSKH' : remainingMs > 0 ? 'Yêu cầu này chỉ được gửi 5 phút 1 lần' : 'Gửi yêu cầu nhanh cho CSKH theo lệnh này';
    return "<div class=\"with-history-item\"><div class=\"with-history-main\"><div class=\"with-history-amount\">".concat(amount, " VN\u0110</div><div class=\"with-history-account\">").concat(bankName, " \u2022 STK ").concat(accountNumber, "</div><div class=\"with-history-account-holder\">").concat(accountHolder, "</div><div class=\"with-history-meta\">").concat(dateText, "</div>").concat(noteHtml, "</div><div class=\"with-history-side\"><div class=\"with-history-status ").concat(status, "\">").concat(getWithdrawalStatusText(status), "</div><button type=\"button\" class=\"with-history-support-btn\" onclick=\"quickSupportWithdrawByIndex(").concat(index, ")\" ").concat(disabled ? 'disabled' : '', " title=\"").concat(esc(supportTitle), "\">").concat(supportLabel, "</button></div></div>");
  }).join('');
}
function openWith() {
  return _openWith.apply(this, arguments);
}
function _openWith() {
  _openWith = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee73() {
    var withdrawProfile, prefillMappings, amountInput, sessionRs, s, playerDefaults, withModalTitle, withSubmitBtn, withAmt, trustScoreEl, trustAlert, hasBalance, canSubmit, modal, bankSel, savedBank, opts, match, _t48;
    return _regenerator().w(function (_context73) {
      while (1) switch (_context73.p = _context73.n) {
        case 0:
          _context73.n = 1;
          return ensureWalletModuleReady();
        case 1:
          if (validateSession()) {
            _context73.n = 2;
            break;
          }
          return _context73.a(2);
        case 2:
          if (state.sessionCode) {
            _context73.n = 3;
            break;
          }
          showToast('❌ Vui lòng vào phiên trước');
          return _context73.a(2);
        case 3:
          _context73.n = 4;
          return refreshWallet();
        case 4:
          withdrawProfile = loadSessionProfile('withdrawProfile', {});
          prefillMappings = [['withName', withdrawProfile.customerName], ['withPhone', withdrawProfile.customerPhone], ['withEmail', withdrawProfile.customerEmail], ['withAccNo', withdrawProfile.accountNumber], ['withAccName', withdrawProfile.accountHolder], ['withAmount', withdrawProfile.amount]];
          prefillMappings.forEach(function (_ref31) {
            var _ref32 = _slicedToArray(_ref31, 2),
              id = _ref32[0],
              value = _ref32[1];
            var el = document.getElementById(id);
            if (!el || el.value) return;
            if (id === 'withAmount') {
              if (Number(value) > 0) {
                el.value = formatMoneyComma(value);
              }
              return;
            }
            if (value) el.value = String(value);
          });
          amountInput = document.getElementById('withAmount');
          if (amountInput) {
            bindMoneyCommaInput(amountInput);
            if (!amountInput.value) {
              amountInput.value = formatMoneyComma(state.wallet.remaining);
            }
          }

          // Prefill hidden contact fields from session if available (required by backend)
          _context73.p = 5;
          _context73.n = 6;
          return apiJson("/api/lucky-mystery-box/session?code=".concat(encodeURIComponent(state.sessionCode)));
        case 6:
          sessionRs = _context73.v;
          s = (sessionRs === null || sessionRs === void 0 ? void 0 : sessionRs.data) || {};
          playerDefaults = [['withName', s.player_name], ['withPhone', s.player_phone], ['withEmail', s.player_email]];
          playerDefaults.forEach(function (_ref33) {
            var _ref34 = _slicedToArray(_ref33, 2),
              id = _ref34[0],
              val = _ref34[1];
            var el = document.getElementById(id);
            if (el && !el.value && val) el.value = String(val);
          });
          _context73.n = 8;
          break;
        case 7:
          _context73.p = 7;
          _t48 = _context73.v;
        case 8:
          _context73.n = 9;
          return checkExistingWithdrawal();
        case 9:
          renderWithdrawalHistory();
          withModalTitle = document.getElementById('withModalTitle');
          withSubmitBtn = document.getElementById('withSubmitBtn');
          if (withModalTitle) withModalTitle.innerHTML = "Qu\u1EA3n l\xFD r\xFAt ti\u1EC1n - <span id=\"withSessionCode\">".concat(state.sessionCode || '-', "</span>");
          if (withSubmitBtn) withSubmitBtn.textContent = contentTextGlobal('withSubmitCreateButton', 'Tạo lệnh rút tiền');
          withAmt = document.getElementById('withAmt');
          if (withAmt) withAmt.textContent = Math.max(0, state.wallet.remaining).toLocaleString('vi-VN');
          trustScoreEl = document.getElementById('withTrustScore');
          if (trustScoreEl) trustScoreEl.textContent = String(state.wallet.trustScore || 100);
          trustAlert = document.getElementById('withTrustBlockAlert');
          if (trustAlert) {
            if (state.wallet.canWithdrawByTrust) {
              trustAlert.style.display = 'none';
              trustAlert.textContent = '';
            } else {
              trustAlert.style.display = '';
              trustAlert.textContent = state.wallet.trustBlockedMessage || 'Điểm tín nhiệm chưa đủ điều kiện để rút tiền.';
            }
          }
          if (withSubmitBtn) {
            hasBalance = Number(state.wallet.remaining || 0) > 0;
            canSubmit = state.wallet.canWithdrawByTrust && hasBalance;
            withSubmitBtn.disabled = !canSubmit;
            if (!state.wallet.canWithdrawByTrust) {
              withSubmitBtn.title = state.wallet.trustBlockedMessage || 'Điểm tín nhiệm chưa đủ để rút tiền';
            } else if (!hasBalance) {
              withSubmitBtn.title = 'Số dư ví đang bằng 0, chưa thể rút tiền';
            } else {
              withSubmitBtn.title = '';
            }
          }
          clearFieldErrors(['withName', 'withPhone', 'withEmail', 'withBank', 'withAccNo', 'withAccName', 'withAmount']);
          modal = document.getElementById('modalOv');
          if (modal) modal.classList.add('open');
          switchWithTab('history');
          pushPageHistoryState('withdraw');

          // Load VietQR bank list and setup QR auto-update
          _context73.n = 10;
          return loadVietQRBanks();
        case 10:
          bankSel = document.getElementById('withBank');
          if (bankSel) {
            savedBank = withdrawProfile.bankName || withdrawProfile.bankBin || state.existingWithdrawalBankName || '';
            if (savedBank) {
              opts = Array.from(bankSel.options);
              match = opts.find(function (o) {
                return o.value === savedBank || o.dataset.shortName === savedBank || o.textContent && o.textContent.includes(savedBank);
              });
              if (match) bankSel.value = match.value;
            }
          }
        case 11:
          return _context73.a(2);
      }
    }, _callee73, null, [[5, 7]]);
  }));
  return _openWith.apply(this, arguments);
}
function closeWith() {
  if (state.isSubmittingWithdrawal) {
    showToast('⏳ Đang gửi yêu cầu rút tiền, vui lòng chờ hoàn tất...');
    return;
  }
  var modal = document.getElementById('modalOv');
  if (modal) modal.classList.remove('open');
  stopWithdrawSubmitPendingState();
  var withSubmitBtn = document.getElementById('withSubmitBtn');
  if (withSubmitBtn) {
    withSubmitBtn.disabled = false;
    withSubmitBtn.title = '';
  }
  switchWithTab('history');
  clearFieldErrors(['withName', 'withPhone', 'withEmail', 'withBank', 'withAccNo', 'withAccName', 'withAmount']);
}
function togCk() {
  state.ckOn = !state.ckOn;
  var e = document.getElementById('ck');
  if (!e) return;
  e.classList.toggle('on', state.ckOn);
  e.innerHTML = state.ckOn ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '';
}
function renderWithdrawSubmitPendingState(remainingSeconds) {
  var withSubmitBtn = document.getElementById('withSubmitBtn');
  if (!withSubmitBtn) return;
  var remaining = Math.max(1, Math.min(5, Number(remainingSeconds) || 1));
  withSubmitBtn.classList.add('with-submit-pending');
  withSubmitBtn.setAttribute('aria-busy', 'true');
  withSubmitBtn.disabled = true;
  withSubmitBtn.title = 'Đang gửi yêu cầu rút tiền';
  withSubmitBtn.innerHTML = "<span class=\"with-submit-check\" aria-hidden=\"true\">\u2713</span><span class=\"with-submit-label\">\u0110ang g\u1EEDi y\xEAu c\u1EA7u r\xFAt ti\u1EC1n ".concat(remaining, "<span class=\"with-submit-dots\" aria-hidden=\"true\"><span>.</span><span>.</span><span>.</span></span></span>");
}
function startWithdrawSubmitPendingState() {
  state.isSubmittingWithdrawal = true;
  state.withdrawSubmitPendingStartedAt = Date.now();
  if (state.withdrawSubmitPendingTimer) {
    clearInterval(state.withdrawSubmitPendingTimer);
    state.withdrawSubmitPendingTimer = null;
  }
  renderWithdrawSubmitPendingState(5);
  state.withdrawSubmitPendingTimer = window.setInterval(function () {
    if (!state.isSubmittingWithdrawal) return;
    var elapsedMs = Date.now() - Number(state.withdrawSubmitPendingStartedAt || 0);
    var remaining = Math.max(1, 5 - Math.floor(elapsedMs / 1000));
    renderWithdrawSubmitPendingState(remaining);
  }, 220);
}
function stopWithdrawSubmitPendingState() {
  state.isSubmittingWithdrawal = false;
  state.withdrawSubmitPendingStartedAt = 0;
  if (state.withdrawSubmitPendingTimer) {
    clearInterval(state.withdrawSubmitPendingTimer);
    state.withdrawSubmitPendingTimer = null;
  }
  var withSubmitBtn = document.getElementById('withSubmitBtn');
  if (!withSubmitBtn) return;
  withSubmitBtn.classList.remove('with-submit-pending');
  withSubmitBtn.removeAttribute('aria-busy');
  withSubmitBtn.innerHTML = contentTextGlobal('withSubmitCreateButton', 'Tạo lệnh rút tiền');
}
function waitWithdrawSubmitPendingCompletion() {
  return _waitWithdrawSubmitPendingCompletion.apply(this, arguments);
}
function _waitWithdrawSubmitPendingCompletion() {
  _waitWithdrawSubmitPendingCompletion = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee74() {
    var pendingDurationMs, startedAt, elapsed, remain;
    return _regenerator().w(function (_context74) {
      while (1) switch (_context74.n) {
        case 0:
          pendingDurationMs = 5000;
          startedAt = Number(state.withdrawSubmitPendingStartedAt || 0);
          if (startedAt) {
            _context74.n = 1;
            break;
          }
          return _context74.a(2);
        case 1:
          elapsed = Date.now() - startedAt;
          remain = Math.max(0, pendingDurationMs - elapsed);
          if (!(remain <= 0)) {
            _context74.n = 2;
            break;
          }
          return _context74.a(2);
        case 2:
          _context74.n = 3;
          return new Promise(function (resolve) {
            return window.setTimeout(resolve, remain);
          });
        case 3:
          return _context74.a(2);
      }
    }, _callee74);
  }));
  return _waitWithdrawSubmitPendingCompletion.apply(this, arguments);
}
function submitWith() {
  return _submitWith.apply(this, arguments);
}
function _submitWith() {
  _submitWith = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee76() {
    var _document$getElementB19, _document$getElementB20, _document$getElementB21, _document$getElementB22, _document$getElementB23, _document$getElementB24, _document$getElementB25, _document$getElementB26;
    var nameEl, phoneEl, emailEl, backupProfile, fallbackName, fallbackPhone, fallbackEmail, payload, trustBlockMessage, trustAlert, withAmt, hasError, _withdrawalResponse, withdrawalResponse, createdWithdrawalId, _t49;
    return _regenerator().w(function (_context76) {
      while (1) switch (_context76.p = _context76.n) {
        case 0:
          if (state.sessionCode) {
            _context76.n = 1;
            break;
          }
          showToast('❌ Phiên không hợp lệ');
          return _context76.a(2);
        case 1:
          if (!state.isSubmittingWithdrawal) {
            _context76.n = 2;
            break;
          }
          return _context76.a(2);
        case 2:
          nameEl = document.getElementById('withName');
          phoneEl = document.getElementById('withPhone');
          emailEl = document.getElementById('withEmail');
          backupProfile = loadSessionProfile('withdrawProfile', {});
          fallbackName = backupProfile.customerName || "Kh\xE1ch h\xE0ng ".concat(state.sessionCode || '').trim();
          fallbackPhone = backupProfile.customerPhone || '0900000000';
          fallbackEmail = backupProfile.customerEmail || "".concat(String(state.sessionCode || 'guest').toLowerCase(), "@giftbox.local");
          if (nameEl && !nameEl.value) nameEl.value = fallbackName;
          if (phoneEl && !phoneEl.value) phoneEl.value = fallbackPhone;
          if (emailEl && !emailEl.value) emailEl.value = fallbackEmail;
          payload = {
            bankName: getSelectedBankName() || (((_document$getElementB19 = document.getElementById('withBank')) === null || _document$getElementB19 === void 0 ? void 0 : _document$getElementB19.value) || '').trim(),
            accountNumber: (((_document$getElementB20 = document.getElementById('withAccNo')) === null || _document$getElementB20 === void 0 ? void 0 : _document$getElementB20.value) || '').trim(),
            accountHolder: (((_document$getElementB21 = document.getElementById('withAccName')) === null || _document$getElementB21 === void 0 ? void 0 : _document$getElementB21.value) || '').trim(),
            amount: parseMoneyInputValue(((_document$getElementB22 = document.getElementById('withAmount')) === null || _document$getElementB22 === void 0 ? void 0 : _document$getElementB22.value) || ''),
            customerName: (((_document$getElementB23 = document.getElementById('withName')) === null || _document$getElementB23 === void 0 ? void 0 : _document$getElementB23.value) || '').trim(),
            customerPhone: (((_document$getElementB24 = document.getElementById('withPhone')) === null || _document$getElementB24 === void 0 ? void 0 : _document$getElementB24.value) || '').trim(),
            customerEmail: (((_document$getElementB25 = document.getElementById('withEmail')) === null || _document$getElementB25 === void 0 ? void 0 : _document$getElementB25.value) || '').trim(),
            note: (((_document$getElementB26 = document.getElementById('withNote')) === null || _document$getElementB26 === void 0 ? void 0 : _document$getElementB26.value) || '').trim()
          }; // Strict balance re-check before submitting
          _context76.n = 3;
          return refreshWallet();
        case 3:
          if (state.wallet.canWithdrawByTrust) {
            _context76.n = 4;
            break;
          }
          trustBlockMessage = state.wallet.trustBlockedMessage || 'Điểm tín nhiệm chưa đủ để rút tiền.';
          setFieldError('withAmount', trustBlockMessage);
          trustAlert = document.getElementById('withTrustBlockAlert');
          if (trustAlert) {
            trustAlert.style.display = '';
            trustAlert.textContent = trustBlockMessage;
          }
          showToast("\u274C ".concat(trustBlockMessage));
          return _context76.a(2);
        case 4:
          if (!(payload.amount > state.wallet.remaining)) {
            _context76.n = 5;
            break;
          }
          setFieldError('withAmount', "S\u1ED1 d\u01B0 kh\xF4ng \u0111\u1EE7. Hi\u1EC7n t\u1EA1i ch\u1EC9 c\xF2n ".concat(Math.max(0, state.wallet.remaining).toLocaleString('vi-VN'), " \u0111"));
          withAmt = document.getElementById('withAmt');
          if (withAmt) withAmt.textContent = Math.max(0, state.wallet.remaining).toLocaleString('vi-VN');
          showToast('❌ Số dư không đủ để rút');
          return _context76.a(2);
        case 5:
          clearFieldErrors(['withName', 'withPhone', 'withEmail', 'withBank', 'withAccNo', 'withAccName', 'withAmount']);
          hasError = false;
          if (!payload.customerName) {
            setFieldError('withName', 'Vui lòng nhập họ và tên.');
            hasError = true;
          }
          if (!payload.customerPhone) {
            setFieldError('withPhone', 'Vui lòng nhập số điện thoại.');
            hasError = true;
          } else if (!/^\d{10,11}$/.test(payload.customerPhone)) {
            setFieldError('withPhone', 'Số điện thoại phải gồm 10-11 chữ số.');
            hasError = true;
          }
          if (!payload.customerEmail) {
            setFieldError('withEmail', 'Vui lòng nhập email.');
            hasError = true;
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.customerEmail)) {
            setFieldError('withEmail', 'Email không hợp lệ.');
            hasError = true;
          }
          if (!payload.bankName) {
            setFieldError('withBank', 'Vui lòng nhập ngân hàng.');
            hasError = true;
          }
          if (!payload.accountNumber) {
            setFieldError('withAccNo', 'Vui lòng nhập số tài khoản.');
            hasError = true;
          }
          if (!payload.accountHolder) {
            setFieldError('withAccName', 'Vui lòng nhập tên chủ tài khoản.');
            hasError = true;
          }
          if (!payload.amount) {
            setFieldError('withAmount', 'Vui lòng nhập số tiền rút.');
            hasError = true;
          } else if (payload.amount < 10000) {
            setFieldError('withAmount', 'Số tiền tối thiểu là 10.000 đ.');
            hasError = true;
          } else if (payload.amount > state.wallet.remaining) {
            setFieldError('withAmount', "S\u1ED1 d\u01B0 kh\xF4ng \u0111\u1EE7. T\u1ED1i \u0111a ".concat(Math.max(0, state.wallet.remaining).toLocaleString('vi-VN'), " \u0111"));
            hasError = true;
          }
          if (!hasError) {
            _context76.n = 6;
            break;
          }
          showToast('❌ Vui lòng kiểm tra lại thông tin rút tiền');
          return _context76.a(2);
        case 6:
          _context76.p = 6;
          withdrawalResponse = null;
          startWithdrawSubmitPendingState();
          _context76.n = 7;
          return withLoadingOverlay('Đang gửi yêu cầu rút tiền...', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee75() {
            return _regenerator().w(function (_context75) {
              while (1) switch (_context75.n) {
                case 0:
                  _context75.n = 1;
                  return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/withdraw"), {
                    method: 'POST',
                    body: JSON.stringify(payload)
                  });
                case 1:
                  withdrawalResponse = _context75.v;
                case 2:
                  return _context75.a(2);
              }
            }, _callee75);
          })));
        case 7:
          createdWithdrawalId = String(((_withdrawalResponse = withdrawalResponse) === null || _withdrawalResponse === void 0 || (_withdrawalResponse = _withdrawalResponse.data) === null || _withdrawalResponse === void 0 ? void 0 : _withdrawalResponse.id) || '').trim();
          if (createdWithdrawalId) {
            trackPendingWithdrawalDecision(createdWithdrawalId);
          }
          _context76.n = 8;
          return waitWithdrawSubmitPendingCompletion();
        case 8:
          stopWithdrawSubmitPendingState();
          saveSessionProfile('withdrawProfile', _objectSpread(_objectSpread({}, payload), {}, {
            bankBin: getSelectedBankBin()
          }));
          closeWith();
          _context76.n = 9;
          return Promise.all([refreshWallet(), refreshTransactions()]);
        case 9:
          showToast('✅ Yêu cầu rút tiền đã được gửi!');
          showThankYouPage({
            title: 'Yêu cầu rút tiền đã ghi nhận',
            subtitle: 'Bộ phận xử lý sẽ duyệt trong thời gian sớm nhất',
            method: 'Rút tiền',
            playerName: payload.customerName,
            playerPhone: payload.customerPhone,
            detail: "".concat(Math.max(0, payload.amount).toLocaleString('vi-VN'), " \u0111 v\u1EC1 ").concat(payload.bankName)
          });
          state.existingWithdrawalId = null;
          state.isUpdatingWithdrawal = false;
          _context76.n = 11;
          break;
        case 10:
          _context76.p = 10;
          _t49 = _context76.v;
          showToast("\u274C ".concat(_t49.message));
          stopWithdrawSubmitPendingState();
        case 11:
          _context76.p = 11;
          if (state.isSubmittingWithdrawal) {
            _context76.n = 12;
            break;
          }
          return _context76.a(2);
        case 12:
          stopWithdrawSubmitPendingState();
          return _context76.f(11);
        case 13:
          return _context76.a(2);
      }
    }, _callee76, null, [[6, 10, 11, 13]]);
  }));
  return _submitWith.apply(this, arguments);
}
function getLatestWithdrawalSupportRef() {
  var rows = Array.isArray(state.withdrawalHistoryRows) ? _toConsumableArray(state.withdrawalHistoryRows) : [];
  if (!rows.length) return '';
  rows.sort(function (a, b) {
    var ta = new Date(a.requested_at || a.created_at || a.createdAt || 0).getTime();
    var tb = new Date(b.requested_at || b.created_at || b.createdAt || 0).getTime();
    return tb - ta;
  });
  var latest = rows[0] || {};
  return String(latest.id || latest.withdrawal_id || latest.request_id || latest.withdrawal_code || latest.request_code || latest.reference_code || latest.ref_code || '').trim();
}
function getWithdrawalSupportRef(row) {
  if (!row || _typeof(row) !== 'object') return '';
  return String(row.id || row.withdrawal_id || row.request_id || row.withdrawal_code || row.request_code || row.reference_code || row.ref_code || '').trim();
}
function getWithdrawalSupportDisplayRef(requestCode) {
  var raw = String(requestCode || '').trim();
  if (!raw) return '';
  var compact = raw.replace(/^(ruttien|rut_tien|withdrawal|withdraw|request|req|wd)[_:\-]*/i, '').replace(/[^a-zA-Z0-9]/g, '').trim();
  var base = compact || raw;
  if (base.length <= 12) return base;
  return "".concat(base.slice(0, 4), "...").concat(base.slice(-4));
}
function getWithdrawalSupportLastAtMap() {
  try {
    var raw = localStorage.getItem(CHAT_GLOBAL_KEYS.withdrawalSupportLastAt) || '{}';
    var parsed = JSON.parse(raw);
    if (!parsed || _typeof(parsed) !== 'object') return {};
    return parsed;
  } catch (_) {
    return {};
  }
}
function saveWithdrawalSupportLastAtMap(map) {
  try {
    var payload = map && _typeof(map) === 'object' ? map : {};
    localStorage.setItem(CHAT_GLOBAL_KEYS.withdrawalSupportLastAt, JSON.stringify(payload));
  } catch (_) {}
}
function buildWithdrawalPendingDecisionStorageKey() {
  var session = String(state.sessionCode || '').trim().toUpperCase();
  if (!session) return '';
  return "".concat(CHAT_GLOBAL_KEYS.withdrawalPendingDecisionIds, ":").concat(session);
}
function getPendingWithdrawalDecisionIds() {
  var key = buildWithdrawalPendingDecisionStorageKey();
  if (!key) return [];
  try {
    var raw = localStorage.getItem(key) || '[]';
    var parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(function (id) {
      return String(id || '').trim();
    }).filter(Boolean);
  } catch (_) {
    return [];
  }
}
function savePendingWithdrawalDecisionIds(ids) {
  var key = buildWithdrawalPendingDecisionStorageKey();
  if (!key) return;
  try {
    var list = Array.isArray(ids) ? _toConsumableArray(new Set(ids.map(function (id) {
      return String(id || '').trim();
    }).filter(Boolean))) : [];
    localStorage.setItem(key, JSON.stringify(list));
  } catch (_) {}
}
function trackPendingWithdrawalDecision(withdrawalId) {
  var id = String(withdrawalId || '').trim();
  if (!id) return;
  var next = getPendingWithdrawalDecisionIds();
  if (!next.includes(id)) next.push(id);
  savePendingWithdrawalDecisionIds(next);
}
function handleWithdrawalDecisionToasts(rows) {
  var pendingIds = getPendingWithdrawalDecisionIds();
  if (!pendingIds.length || !Array.isArray(rows) || !rows.length) return;
  var byId = rows.reduce(function (acc, row) {
    var id = String((row === null || row === void 0 ? void 0 : row.id) || '').trim();
    if (id) acc[id] = row;
    return acc;
  }, {});
  var remain = [];
  pendingIds.forEach(function (id) {
    var row = byId[id];
    if (!row) return;
    var status = String(row.status || '').toLowerCase();
    if (status === 'approved') {
      var amount = Number(row.amount || 0);
      var amountText = amount > 0 ? "".concat(amount.toLocaleString('vi-VN'), " \u0111") : 'lệnh rút tiền';
      showToast("\u2705 Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n ".concat(amountText, " \u0111\xE3 \u0111\u01B0\u1EE3c admin duy\u1EC7t."));
      return;
    }
    if (status === 'rejected') {
      var reason = getCleanRejectionReason(row) || DEFAULT_WITHDRAW_REJECT_REASON;
      var reasonSuffix = reason ? " (".concat(reason, ")") : '';
      showToast("\u274C Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n \u0111\xE3 b\u1ECB admin t\u1EEB ch\u1ED1i".concat(reasonSuffix));
      return;
    }
    remain.push(id);
  });
  savePendingWithdrawalDecisionIds(remain);
}
function buildWithdrawalSupportThrottleKey(requestCode) {
  return "".concat(String(state.sessionCode || '').trim(), ":").concat(String(requestCode || '').trim());
}
function getWithdrawalSupportRemainingMs(requestCode) {
  var key = buildWithdrawalSupportThrottleKey(requestCode);
  if (!key || key === ':') return 0;
  var store = getWithdrawalSupportLastAtMap();
  var lastAt = Number(store[key] || 0);
  if (!lastAt || Number.isNaN(lastAt)) return 0;
  return Math.max(0, WITHDRAW_SUPPORT_COOLDOWN_MS - (Date.now() - lastAt));
}
function markWithdrawalSupportSent(requestCode) {
  var key = buildWithdrawalSupportThrottleKey(requestCode);
  if (!key || key === ':') return;
  var now = Date.now();
  var store = getWithdrawalSupportLastAtMap();
  var nextStore = {};
  Object.keys(store).forEach(function (k) {
    var ts = Number(store[k] || 0);
    if (!ts || Number.isNaN(ts)) return;
    if (now - ts <= 24 * 60 * 60 * 1000) {
      nextStore[k] = ts;
    }
  });
  nextStore[key] = now;
  saveWithdrawalSupportLastAtMap(nextStore);
}
function getWithdrawalByHistoryIndex(index) {
  var rows = Array.isArray(state.withdrawalHistoryRows) ? _toConsumableArray(state.withdrawalHistoryRows) : [];
  rows.sort(function (a, b) {
    var ta = new Date(a.requested_at || a.created_at || a.createdAt || 0).getTime();
    var tb = new Date(b.requested_at || b.created_at || b.createdAt || 0).getTime();
    return tb - ta;
  });
  return rows[index] || null;
}
function quickSupportWithdrawByIndex(index) {
  var row = getWithdrawalByHistoryIndex(Number(index));
  return quickSupportWithdraw(row);
}
function quickSupportWithdraw(_x19) {
  return _quickSupportWithdraw.apply(this, arguments);
}
function _quickSupportWithdraw() {
  _quickSupportWithdraw = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee77(withdrawalRow) {
    var _document$getElementB27, _document$getElementB28, _document$getElementB29, _document$getElementB30;
    var row, amountInput, bankName, accountNumber, accountHolder, requestCode, requestDisplayRef, remainingMs, minutes, seconds, amountValue, amountText, lines, panel, _t50;
    return _regenerator().w(function (_context77) {
      while (1) switch (_context77.p = _context77.n) {
        case 0:
          if (state.sessionCode) {
            _context77.n = 1;
            break;
          }
          showToast('❌ Phiên không hợp lệ');
          return _context77.a(2);
        case 1:
          row = withdrawalRow && _typeof(withdrawalRow) === 'object' ? withdrawalRow : null;
          amountInput = parseMoneyInputValue(((_document$getElementB27 = document.getElementById('withAmount')) === null || _document$getElementB27 === void 0 ? void 0 : _document$getElementB27.value) || '');
          bankName = row ? String(row.bank_name || '').trim() : getSelectedBankName() || (((_document$getElementB28 = document.getElementById('withBank')) === null || _document$getElementB28 === void 0 ? void 0 : _document$getElementB28.value) || '').trim();
          accountNumber = row ? String(row.account_number || '').trim() : String((((_document$getElementB29 = document.getElementById('withAccNo')) === null || _document$getElementB29 === void 0 ? void 0 : _document$getElementB29.value) || '').trim());
          accountHolder = row ? String(row.account_holder || '').trim() : String((((_document$getElementB30 = document.getElementById('withAccName')) === null || _document$getElementB30 === void 0 ? void 0 : _document$getElementB30.value) || '').trim());
          requestCode = row ? getWithdrawalSupportRef(row) : getLatestWithdrawalSupportRef();
          if (requestCode) {
            _context77.n = 2;
            break;
          }
          showToast('❌ Không tìm thấy mã lệnh rút tiền để gửi CSKH');
          return _context77.a(2);
        case 2:
          requestDisplayRef = getWithdrawalSupportDisplayRef(requestCode);
          remainingMs = getWithdrawalSupportRemainingMs(requestCode);
          if (!(remainingMs > 0)) {
            _context77.n = 3;
            break;
          }
          minutes = Math.floor(remainingMs / 60000);
          seconds = Math.floor(remainingMs % 60000 / 1000);
          showToast("\u23F1\uFE0F Vui l\xF2ng ch\u1EDD ".concat(minutes, ":").concat(String(seconds).padStart(2, '0'), " r\u1ED3i g\u1EEDi l\u1EA1i y\xEAu c\u1EA7u cho l\u1EC7nh ").concat(requestDisplayRef || requestCode));
          return _context77.a(2);
        case 3:
          amountValue = row ? Number(row.amount || 0) : amountInput;
          amountText = amountValue > 0 ? "".concat(amountValue.toLocaleString('vi-VN'), " VN\u0110") : "".concat(Math.max(0, Number(state.wallet.remaining || 0)).toLocaleString('vi-VN'), " VN\u0110");
          lines = ['💳 YÊU CẦU HỖ TRỢ RÚT TIỀN NHANH', '', "\uD83C\uDFAE M\xE3 phi\xEAn: ".concat(state.sessionCode || 'N/A'), "\uD83D\uDCB0 S\u1ED1 ti\u1EC1n: ".concat(amountText), bankName ? "\uD83C\uDFE6 Ng\xE2n h\xE0ng: ".concat(bankName) : '', accountNumber ? "\uD83D\uDD22 STK: ".concat(accountNumber) : '', accountHolder ? "\uD83D\uDC64 Ch\u1EE7 TK: ".concat(accountHolder) : '', requestCode ? "\uD83E\uDDFE M\xE3 l\u1EC7nh r\xFAt: ".concat(requestDisplayRef || requestCode) : '', '', 'Nhờ CSKH ưu tiên kiểm tra và duyệt giúp tôi. Xin cảm ơn!'].filter(Boolean).join('\n');
          _context77.p = 4;
          _context77.n = 5;
          return ensureChatModuleReady();
        case 5:
          panel = document.getElementById('cpanel');
          if (panel && !panel.classList.contains('open')) {
            panel.classList.add('open');
          }
          _context77.n = 6;
          return initCustomerChatUI();
        case 6:
          _context77.n = 7;
          return enqueueCustomerMessage(lines, {
            restoreDraftOnError: false,
            focusInputOnDone: false,
            timeoutMs: 22000
          });
        case 7:
          markWithdrawalSupportSent(requestCode);
          showToast('✅ Đã gửi yêu cầu nhanh tới CSKH');
          _context77.n = 9;
          break;
        case 8:
          _context77.p = 8;
          _t50 = _context77.v;
          showToast("\u274C ".concat(_t50.message || 'Không thể gửi yêu cầu tới CSKH'));
        case 9:
          return _context77.a(2);
      }
    }, _callee77, null, [[4, 8]]);
  }));
  return _quickSupportWithdraw.apply(this, arguments);
}
function showHubTab(tab) {
  state.currentHubTab = tab;
  var tabs = ['inventory', 'exchange', 'wallet', 'search'];
  tabs.forEach(function (name) {
    var el = document.getElementById("hubTab".concat(name.charAt(0).toUpperCase()).concat(name.slice(1)));
    if (el) el.style.display = name === tab ? 'block' : 'none';
  });
  var titles = {
    inventory: contentTextGlobal('hubTabInventoryTitle', 'Kho vật phẩm'),
    exchange: contentTextGlobal('hubTabExchangeTitle', 'Đổi quà / Nhận quà'),
    wallet: contentTextGlobal('hubTabWalletTitle', 'Ví phiên'),
    search: contentTextGlobal('hubTabSearchTitle', 'Tra cứu phiên chơi')
  };
  var titleEl = document.getElementById('hubTitle');
  if (titleEl) titleEl.textContent = titles[tab] || contentTextGlobal('hubTitleDefault', 'Quản lý phiên');
}
function refreshHubData() {
  return _refreshHubData.apply(this, arguments);
}
function _refreshHubData() {
  _refreshHubData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee78() {
    return _regenerator().w(function (_context78) {
      while (1) switch (_context78.n) {
        case 0:
          if (state.sessionCode) {
            _context78.n = 1;
            break;
          }
          return _context78.a(2);
        case 1:
          _context78.n = 2;
          return Promise.all([refreshWallet(), loadPlayerInventory(), refreshTransactions()]);
        case 2:
          return _context78.a(2);
      }
    }, _callee78);
  }));
  return _refreshHubData.apply(this, arguments);
}
function openHub(_x20) {
  return _openHub.apply(this, arguments);
}
function _openHub() {
  _openHub = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee79(tab) {
    var isMobile, hub, _t51;
    return _regenerator().w(function (_context79) {
      while (1) switch (_context79.p = _context79.n) {
        case 0:
          isMobile = !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
          if (!(!isMobile && (tab === 'search' || tab === 'wallet'))) {
            _context79.n = 1;
            break;
          }
          _context79.n = 1;
          return ensureHistoryModuleReady();
        case 1:
          if (!(tab === 'wallet' || tab === 'exchange' || tab === 'inventory')) {
            _context79.n = 2;
            break;
          }
          _context79.n = 2;
          return ensureWalletModuleReady();
        case 2:
          if (!(!validateSession() && tab !== 'search')) {
            _context79.n = 3;
            break;
          }
          return _context79.a(2);
        case 3:
          if (!(!state.sessionCode && tab !== 'search')) {
            _context79.n = 4;
            break;
          }
          showToast('❌ Vui lòng nhập mã phiên trước');
          return _context79.a(2);
        case 4:
          showHubTab(tab);
          hub = document.getElementById('hubOv');
          if (hub) hub.classList.add('open');
          window.dispatchEvent(new CustomEvent('lmb:open-hub', {
            detail: {
              tab: String(tab || '').toLowerCase()
            }
          }));
          pushPageHistoryState("hub:".concat(tab));
          if (!(state.sessionCode && tab !== 'search')) {
            _context79.n = 8;
            break;
          }
          _context79.p = 5;
          _context79.n = 6;
          return refreshHubData();
        case 6:
          _context79.n = 8;
          break;
        case 7:
          _context79.p = 7;
          _t51 = _context79.v;
          showToast("\u274C ".concat(_t51.message));
        case 8:
          if (tab === 'wallet') {
            renderWalletUnifiedHistory();
          }
        case 9:
          return _context79.a(2);
      }
    }, _callee79, null, [[5, 7]]);
  }));
  return _openHub.apply(this, arguments);
}
function closeHub() {
  var hub = document.getElementById('hubOv');
  if (hub) hub.classList.remove('open');

  // Mobile DOM pressure guard: drop heavy list markup when hub closes.
  if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
    var inventoryList = document.getElementById('inventoryList');
    var exchangeList = document.getElementById('exchangeList');
    if (inventoryList) inventoryList.innerHTML = '';
    if (exchangeList) exchangeList.innerHTML = '';
  }
}
function openClaimModal(boxNumber) {
  state.activeClaimBox = Number(boxNumber);
  var item = state.inventoryItems.find(function (x) {
    return Number(x.box_number || x.boxNumber) === Number(boxNumber);
  });
  var itemName = (item === null || item === void 0 ? void 0 : item.prize_name) || 'Phần thưởng';
  var label = document.getElementById('claimItemLabel');
  if (label) label.textContent = "Ph\u1EA7n qu\xE0 h\u1ED9p #".concat(boxNumber, ": ").concat(itemName || 'Phần thưởng');
  var claimProfile = loadSessionProfile('claimProfile', {});
  var mappings = [['claimName', claimProfile.name], ['claimPhone', claimProfile.phone], ['claimEmail', claimProfile.email], ['claimAddress', claimProfile.address], ['claimCity', claimProfile.city], ['claimNote', claimProfile.note]];
  mappings.forEach(function (_ref18) {
    var _ref19 = _slicedToArray(_ref18, 2),
      id = _ref19[0],
      value = _ref19[1];
    var el = document.getElementById(id);
    if (el && !el.value && value) el.value = String(value);
  });
  clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
  var modal = document.getElementById('claimOv');
  if (modal) modal.classList.add('open');
  pushPageHistoryState('claim');
}
function closeClaimModal() {
  var modal = document.getElementById('claimOv');
  if (modal) modal.classList.remove('open');
  clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
}
function confirmClaim() {
  return _confirmClaim.apply(this, arguments);
}
function _confirmClaim() {
  _confirmClaim = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee81() {
    var _document$getElementB31, _document$getElementB32, _document$getElementB33, _document$getElementB34, _document$getElementB35, _document$getElementB36;
    var payload, hasError, _t52;
    return _regenerator().w(function (_context81) {
      while (1) switch (_context81.p = _context81.n) {
        case 0:
          if (!(!state.sessionCode || !state.activeClaimBox)) {
            _context81.n = 1;
            break;
          }
          showToast('❌ Phiên hoặc hộp quà không hợp lệ');
          return _context81.a(2);
        case 1:
          payload = {
            name: (((_document$getElementB31 = document.getElementById('claimName')) === null || _document$getElementB31 === void 0 ? void 0 : _document$getElementB31.value) || '').trim(),
            phone: (((_document$getElementB32 = document.getElementById('claimPhone')) === null || _document$getElementB32 === void 0 ? void 0 : _document$getElementB32.value) || '').trim(),
            email: (((_document$getElementB33 = document.getElementById('claimEmail')) === null || _document$getElementB33 === void 0 ? void 0 : _document$getElementB33.value) || '').trim(),
            address: (((_document$getElementB34 = document.getElementById('claimAddress')) === null || _document$getElementB34 === void 0 ? void 0 : _document$getElementB34.value) || '').trim(),
            city: (((_document$getElementB35 = document.getElementById('claimCity')) === null || _document$getElementB35 === void 0 ? void 0 : _document$getElementB35.value) || '').trim(),
            note: (((_document$getElementB36 = document.getElementById('claimNote')) === null || _document$getElementB36 === void 0 ? void 0 : _document$getElementB36.value) || '').trim(),
            boxNumber: state.activeClaimBox
          };
          clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
          hasError = false;
          if (!payload.name) {
            setFieldError('claimName', 'Vui lòng nhập họ tên.');
            hasError = true;
          }
          if (!payload.phone) {
            setFieldError('claimPhone', 'Vui lòng nhập số điện thoại.');
            hasError = true;
          } else if (!/^\d{10,11}$/.test(payload.phone)) {
            setFieldError('claimPhone', 'Số điện thoại phải gồm 10-11 chữ số.');
            hasError = true;
          }
          if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            setFieldError('claimEmail', 'Email không hợp lệ.');
            hasError = true;
          }
          if (!payload.address) {
            setFieldError('claimAddress', 'Vui lòng nhập địa chỉ giao hàng.');
            hasError = true;
          }
          if (!payload.city) {
            setFieldError('claimCity', 'Vui lòng nhập tỉnh/thành phố.');
            hasError = true;
          }
          if (!hasError) {
            _context81.n = 2;
            break;
          }
          showToast('⚠️ Vui lòng kiểm tra lại thông tin nhận quà');
          return _context81.a(2);
        case 2:
          _context81.p = 2;
          _context81.n = 3;
          return withLoadingOverlay('Đang gửi thông tin nhận quà...', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee80() {
            return _regenerator().w(function (_context80) {
              while (1) switch (_context80.n) {
                case 0:
                  return _context80.a(2, apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/claim"), {
                    method: 'POST',
                    body: JSON.stringify(payload)
                  }));
              }
            }, _callee80);
          })));
        case 3:
          saveSessionProfile('claimProfile', payload);
          closeClaimModal();
          _context81.n = 4;
          return refreshHubData();
        case 4:
          activateNextBox();
          renderBoxes();
          showToast('✅ Đã gửi thông tin nhận quà, đang chờ admin duyệt...');
          showApprovalWaitScreen(state.currentPrize);
          _context81.n = 6;
          break;
        case 5:
          _context81.p = 5;
          _t52 = _context81.v;
          showToast("\u274C ".concat(_t52.message));
        case 6:
          return _context81.a(2);
      }
    }, _callee81, null, [[2, 5]]);
  }));
  return _confirmClaim.apply(this, arguments);
}
function convertPrize(_x21) {
  return _convertPrize.apply(this, arguments);
}
function _convertPrize() {
  _convertPrize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee82(boxNumber) {
    var options,
      _state$boxes14,
      result,
      safeBox,
      box,
      _args82 = arguments,
      _t53;
    return _regenerator().w(function (_context82) {
      while (1) switch (_context82.p = _context82.n) {
        case 0:
          options = _args82.length > 1 && _args82[1] !== undefined ? _args82[1] : {};
          if (validateSession()) {
            _context82.n = 1;
            break;
          }
          return _context82.a(2);
        case 1:
          if (state.sessionCode) {
            _context82.n = 2;
            break;
          }
          showToast('❌ Phiên không hợp lệ');
          return _context82.a(2);
        case 2:
          _context82.p = 2;
          _context82.n = 3;
          return apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(state.sessionCode), "/convert"), {
            method: 'POST',
            body: JSON.stringify({
              boxNumber: boxNumber,
              instant: true
            })
          });
        case 3:
          result = _context82.v;
          safeBox = Number(boxNumber || 0);
          box = ((_state$boxes14 = state.boxes) === null || _state$boxes14 === void 0 ? void 0 : _state$boxes14[safeBox]) || null;
          if (box) {
            if (result !== null && result !== void 0 && result.pendingApproval) {
              box.decision = 'exchanged';
              box.status = 'exchanged';
              box.processingStatus = 'exchanged';
            } else {
              box.decision = 'converted';
              box.status = 'converted';
              box.processingStatus = 'converted';
            }
          }
          _context82.n = 4;
          return Promise.all([refreshHubData(), refreshBoxesFromServer()]);
        case 4:
          if (!(result !== null && result !== void 0 && result.pendingApproval)) {
            activateNextBox();
          }
          if (!options.fromWin) {
            if (result !== null && result !== void 0 && result.pendingApproval) {
              showToast("\u23F3 Y\xEAu c\u1EA7u quy \u0111\u1ED5i ".concat(result.currency || '', " \u0111\xE3 g\u1EEDi cho CSKH. Vui l\xF2ng li\xEAn h\u1EC7 CSKH!"));
            } else {
              showToast("\u2705 \u0110\xE3 quy \u0111\u1ED5i th\xE0nh c\xF4ng cho h\u1ED9p #".concat(boxNumber));
            }
          }
          _context82.n = 6;
          break;
        case 5:
          _context82.p = 5;
          _t53 = _context82.v;
          showToast("\u274C ".concat(_t53.message));
          throw _t53;
        case 6:
          return _context82.a(2);
      }
    }, _callee82, null, [[2, 5]]);
  }));
  return _convertPrize.apply(this, arguments);
}
function searchSession() {
  return _searchSession.apply(this, arguments);
}
function _searchSession() {
  _searchSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee83() {
    var input, resultEl, code, rs, data, info, safeCode, inventoryCount, _t54;
    return _regenerator().w(function (_context83) {
      while (1) switch (_context83.p = _context83.n) {
        case 0:
          input = document.getElementById('searchInput');
          resultEl = document.getElementById('searchResult');
          code = ((input === null || input === void 0 ? void 0 : input.value) || '').trim().toUpperCase();
          if (code) {
            _context83.n = 1;
            break;
          }
          showToast('Vui lòng nhập mã phiên để tra cứu');
          return _context83.a(2);
        case 1:
          _context83.p = 1;
          _context83.n = 2;
          return apiJson("/api/lucky-mystery-box/search?code=".concat(encodeURIComponent(code)));
        case 2:
          rs = _context83.v;
          data = rs.data || {};
          info = data.session || {};
          safeCode = escapeHtml(info.code || code);
          inventoryCount = Array.isArray(data.inventory) ? data.inventory.length : 0;
          if (resultEl) {
            resultEl.innerHTML = "\n        <div class=\"hub-card search-session-card\">\n          <div class=\"hub-card-title\">M\xE3 phi\xEAn: ".concat(safeCode, "</div>\n          <div class=\"hub-card-meta\">Tr\u1EA1ng th\xE1i ho\u1EA1t \u0111\u1ED9ng: ").concat(info.isActive ? 'Đang hoạt động' : 'Không hoạt động', "</div>\n          <div class=\"hub-card-meta\">Ho\xE0n t\u1EA5t: ").concat(info.isCompleted ? 'Đã hoàn tất' : 'Chưa hoàn tất', "</div>\n          <div class=\"hub-card-meta\">Ng\u01B0\u1EDDi ch\u01A1i: ").concat(escapeHtml(info.playerName || 'Chưa cập nhật'), "</div>\n          <div class=\"hub-card-meta\">S\u1ED1 b\u1EA3n ghi nh\u1EADn qu\xE0: ").concat(inventoryCount, "</div>\n          <div class=\"hub-card-actions\">\n            <button class=\"hub-inline-btn convert\" type=\"button\" onclick=\"openSessionDetailModal('").concat(safeCode, "')\">Xem chi ti\u1EBFt phi\xEAn ch\u01A1i</button>\n          </div>\n        </div>\n      ");
          }
          _context83.n = 4;
          break;
        case 3:
          _context83.p = 3;
          _t54 = _context83.v;
          if (resultEl) {
            resultEl.innerHTML = "<div class=\"hub-card\"><div class=\"hub-card-title\">Kh\xF4ng t\xECm th\u1EA5y</div><div class=\"hub-card-meta\">".concat(_t54.message, "</div></div>");
          }
          showToast("\u274C ".concat(_t54.message));
        case 4:
          return _context83.a(2);
      }
    }, _callee83, null, [[1, 3]]);
  }));
  return _searchSession.apply(this, arguments);
}
function closeSessionDetailModal() {
  var ov = document.getElementById('sessionDetailOv');
  if (ov) ov.classList.remove('open');
}
function openSessionDetailImage(encodedUrl, encodedName) {
  var url = decodeURIComponent(String(encodedUrl || ''));
  if (!url) return;
  var name = decodeURIComponent(String(encodedName || 'Phần thưởng'));
  var lb = document.getElementById('wovLightbox');
  var img = document.getElementById('wovLbImg');
  if (!lb || !img) return;
  img.src = url;
  img.alt = name;
  lb.classList.add('open');
}
function buildSessionStatusBadge(active, completed) {
  var activeBadge = active ? '<span class="sd-badge active">Đang hoạt động</span>' : '<span class="sd-badge inactive">Không hoạt động</span>';
  var completedBadge = completed ? '<span class="sd-badge completed">Đã hoàn tất</span>' : '<span class="sd-badge pending">Đang chơi</span>';
  return "".concat(activeBadge).concat(completedBadge);
}
function renderSessionDetailBoxCard(item) {
  var boxNumber = Number(item.box_number || item.boxNumber || item.selected_box_number || 0);
  var prizeName = escapeHtml(item.prize_name || 'Phần thưởng');
  var level = String(item.level || 'NORMAL').toUpperCase();
  var statusText = escapeHtml(getStatusText(item));
  var currency = String(item.currency || 'VND').toUpperCase();
  var amount = Number(item.prize_value || item.value || 0);
  var amountLabel = amount > 0 ? formatCurrency(amount, currency) : 'Quà hiện vật';
  var approx = currency !== 'VND' && amount > 0 ? " (\u2248 ".concat((amount * (currency === 'USD' ? 26000 : 3800)).toLocaleString('vi-VN'), " VND)") : '';
  var desc = escapeHtml(item.prize_description || item.category || 'Không có mô tả chi tiết');
  var openedAt = formatDateTime(item.createdAt || item.created_at);
  var decision = item.decision ? escapeHtml(String(item.decision)) : '--';
  var imageUrl = String(item.prize_image || item.image_url || '').trim();
  var mediaHtml = "<span class=\"sd-box-icon\">".concat(escapeHtml(item.prize_icon || item.icon || '🎁'), "</span>");
  if (imageUrl) {
    var encodedUrl = encodeURIComponent(imageUrl);
    var encodedName = encodeURIComponent(item.prize_name || 'Phần thưởng');
    mediaHtml = "<img src=\"".concat(escapeHtml(imageUrl), "\" alt=\"").concat(prizeName, "\" loading=\"lazy\" decoding=\"async\" onclick=\"openSessionDetailImage('").concat(encodedUrl, "','").concat(encodedName, "')\">");
  }
  return "\n    <article class=\"sd-box-card\">\n      <div class=\"sd-box-media\">".concat(mediaHtml, "</div>\n      <div>\n        <div class=\"sd-box-title\">H\u1ED9p #").concat(boxNumber, ": ").concat(prizeName, "</div>\n        <div class=\"sd-box-sub\">").concat(desc, "</div>\n        <div class=\"sd-tags\">\n          <span class=\"sd-tag\">").concat(escapeHtml(level), "</span>\n          <span class=\"sd-tag\">").concat(statusText, "</span>\n          ").concat(item.is_special ? '<span class="sd-tag">Special</span>' : '', "\n          ").concat(item.is_cash ? '<span class="sd-tag">Tiền mặt</span>' : '<span class="sd-tag">Hiện vật</span>', "\n        </div>\n        <div class=\"sd-box-lines\">\n          <div class=\"sd-line\"><b>Gi\xE1 tr\u1ECB:</b> ").concat(escapeHtml(amountLabel)).concat(approx, "</div>\n          <div class=\"sd-line\"><b>Quy\u1EBFt \u0111\u1ECBnh:</b> ").concat(decision, "</div>\n          <div class=\"sd-line\"><b>Th\u1EDDi gian m\u1EDF:</b> ").concat(escapeHtml(openedAt), "</div>\n        </div>\n      </div>\n    </article>\n  ");
}
function renderSessionTimeline(transactions) {
  if (!Array.isArray(transactions) || !transactions.length) {
    return '<div class="sd-no-data">Chưa có giao dịch trong phiên này.</div>';
  }
  return transactions.slice(0, 30).map(function (tx) {
    var type = String(tx.type || '').toLowerCase();
    var status = String(tx.status || '').toLowerCase();
    var amount = Number(tx.amountVND || tx.amount || 0);
    var title = 'Giao dịch';
    if (type.includes('conversion')) title = 'Quy đổi phần quà';
    if (type === 'withdraw') title = 'Yêu cầu rút tiền';
    var detail = amount > 0 ? "".concat(amount.toLocaleString('vi-VN'), " \u0111") : '--';
    var subtitle = "".concat(status || 'pending').concat(tx.boxNumber ? " \u2022 H\u1ED9p #".concat(Number(tx.boxNumber)) : '');
    var time = formatDateTime(tx.requestedAt || tx.createdAt || tx.approvedAt);
    return "\n      <div class=\"sd-event\">\n        <div>\n          <div class=\"sd-event-title\">".concat(escapeHtml(title), ": ").concat(escapeHtml(detail), "</div>\n          <div class=\"sd-event-sub\">").concat(escapeHtml(subtitle), "</div>\n        </div>\n        <div class=\"sd-event-time\">").concat(escapeHtml(time), "</div>\n      </div>\n    ");
  }).join('');
}
function openSessionDetailModal(_x22) {
  return _openSessionDetailModal.apply(this, arguments);
}
function _openSessionDetailModal() {
  _openSessionDetailModal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee84(codeParam) {
    var _document$getElementB37;
    var rawCode, ov, body, titleEl, subEl, _sessionRs$value, _inventoryRs$value, _walletRs$value, _transactionsRs$value, _yield$Promise$allSet, _yield$Promise$allSet2, sessionRs, inventoryRs, walletRs, transactionsRs, searchData, session, inventoryItems, walletData, txData, isActive, isCompleted, sessionCode, playerName, itemCount, pendingConversion, walletRemaining, trustScore, statusBadges, boxCardsHtml, _t55;
    return _regenerator().w(function (_context84) {
      while (1) switch (_context84.p = _context84.n) {
        case 0:
          rawCode = String(codeParam || ((_document$getElementB37 = document.getElementById('searchInput')) === null || _document$getElementB37 === void 0 ? void 0 : _document$getElementB37.value) || '').trim().toUpperCase();
          if (rawCode) {
            _context84.n = 1;
            break;
          }
          showToast(contentTextGlobal('sessionDetailMissingCode', 'Vui lòng nhập mã phiên để xem chi tiết'));
          return _context84.a(2);
        case 1:
          ov = document.getElementById('sessionDetailOv');
          body = document.getElementById('sessionDetailBody');
          titleEl = document.getElementById('sessionDetailTitle');
          subEl = document.getElementById('sessionDetailSub');
          if (!(!ov || !body || !titleEl || !subEl)) {
            _context84.n = 2;
            break;
          }
          return _context84.a(2);
        case 2:
          titleEl.textContent = "".concat(contentTextGlobal('sessionDetailTitlePrefix', 'Chi tiết phiên chơi'), ": ").concat(rawCode);
          subEl.textContent = contentTextGlobal('sessionDetailLoadingSub', 'Đang tải toàn bộ thông tin hộp quà, ví và giao dịch...');
          body.innerHTML = "<div class=\"session-detail-loading\">".concat(escapeHtml(contentTextGlobal('sessionDetailLoadingData', 'Đang tải dữ liệu phiên và ảnh phần thưởng...')), "</div>");
          ov.classList.add('open');
          _context84.p = 3;
          _context84.n = 4;
          return Promise.allSettled([apiJson("/api/lucky-mystery-box/search?code=".concat(encodeURIComponent(rawCode))), apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(rawCode), "/player-inventory")), apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(rawCode), "/wallet")), apiJson("/api/lucky-mystery-box/".concat(encodeURIComponent(rawCode), "/transactions"))]);
        case 4:
          _yield$Promise$allSet = _context84.v;
          _yield$Promise$allSet2 = _slicedToArray(_yield$Promise$allSet, 4);
          sessionRs = _yield$Promise$allSet2[0];
          inventoryRs = _yield$Promise$allSet2[1];
          walletRs = _yield$Promise$allSet2[2];
          transactionsRs = _yield$Promise$allSet2[3];
          searchData = sessionRs.status === 'fulfilled' ? ((_sessionRs$value = sessionRs.value) === null || _sessionRs$value === void 0 ? void 0 : _sessionRs$value.data) || {} : {};
          session = searchData.session || {};
          inventoryItems = inventoryRs.status === 'fulfilled' ? ((_inventoryRs$value = inventoryRs.value) === null || _inventoryRs$value === void 0 || (_inventoryRs$value = _inventoryRs$value.data) === null || _inventoryRs$value === void 0 ? void 0 : _inventoryRs$value.items) || [] : Array.isArray(searchData.inventory) ? searchData.inventory.map(function (row) {
            return {
              box_number: row.selected_box_number,
              prize_name: row.prize_name,
              status: row.status,
              createdAt: row.createdAt,
              prize_value: 0,
              currency: 'VND',
              prize_icon: '🎁',
              level: 'NORMAL'
            };
          }) : [];
          walletData = walletRs.status === 'fulfilled' ? ((_walletRs$value = walletRs.value) === null || _walletRs$value === void 0 ? void 0 : _walletRs$value.data) || {} : {};
          txData = transactionsRs.status === 'fulfilled' ? ((_transactionsRs$value = transactionsRs.value) === null || _transactionsRs$value === void 0 ? void 0 : _transactionsRs$value.data) || [] : [];
          isActive = !!session.isActive;
          isCompleted = !!session.isCompleted;
          sessionCode = escapeHtml(session.code || rawCode);
          playerName = escapeHtml(session.playerName || 'Chưa cập nhật');
          itemCount = Number(inventoryItems.length || 0);
          pendingConversion = Number(walletData.pending_conversion || 0);
          walletRemaining = Number(walletData.remaining || walletData.balance || 0);
          trustScore = Number(walletData.trust_score || 100);
          statusBadges = buildSessionStatusBadge(isActive, isCompleted);
          boxCardsHtml = itemCount ? inventoryItems.sort(function (a, b) {
            return Number(a.box_number || a.boxNumber || 0) - Number(b.box_number || b.boxNumber || 0);
          }).map(renderSessionDetailBoxCard).join('') : '<div class="sd-no-data">Phiên này chưa có hộp quà nào được mở.</div>';
          subEl.textContent = contentTextGlobal('sessionDetailSummarySub', 'Tổng hợp đầy đủ hộp quà, trạng thái xử lý, ví và lịch sử giao dịch theo phiên.');
          body.innerHTML = "\n      <section class=\"sd-top\">\n        <div class=\"sd-hero\">\n          <div class=\"sd-code\">".concat(sessionCode, "</div>\n          <div class=\"sd-subline\">\n            ").concat(statusBadges, "\n          </div>\n          <div class=\"sd-meta-grid\">\n            <div class=\"sd-meta-item\">\n              <div class=\"sd-meta-label\">Ng\u01B0\u1EDDi ch\u01A1i</div>\n              <div class=\"sd-meta-value\">").concat(playerName, "</div>\n            </div>\n            <div class=\"sd-meta-item\">\n              <div class=\"sd-meta-label\">S\u1ED1 h\u1ED9p \u0111\xE3 c\xF3 d\u1EEF li\u1EC7u</div>\n              <div class=\"sd-meta-value\">").concat(itemCount, " h\u1ED9p</div>\n            </div>\n            <div class=\"sd-meta-item\">\n              <div class=\"sd-meta-label\">Ngu\u1ED3n d\u1EEF li\u1EC7u</div>\n              <div class=\"sd-meta-value\">Player Inventory + Transactions</div>\n            </div>\n            <div class=\"sd-meta-item\">\n              <div class=\"sd-meta-label\">M\xE3 tra c\u1EE9u</div>\n              <div class=\"sd-meta-value\">").concat(sessionCode, "</div>\n            </div>\n          </div>\n        </div>\n        <div class=\"sd-wallet\">\n          <div class=\"sd-wallet-row\"><span class=\"lbl\">S\u1ED1 d\u01B0 kh\u1EA3 d\u1EE5ng</span><span class=\"val\">").concat(walletRemaining.toLocaleString('vi-VN'), " \u0111</span></div>\n          <div class=\"sd-wallet-row\"><span class=\"lbl\">\u0110ang ch\u1EDD quy \u0111\u1ED5i</span><span class=\"val warn\">").concat(pendingConversion.toLocaleString('vi-VN'), " \u0111</span></div>\n          <div class=\"sd-wallet-row\"><span class=\"lbl\">\u0110i\u1EC3m t\xEDn nhi\u1EC7m</span><span class=\"val\">").concat(Math.max(0, Math.min(100, trustScore)).toLocaleString('vi-VN'), "</span></div>\n        </div>\n      </section>\n\n      <section class=\"sd-section\">\n        <div class=\"sd-section-head\">\n          <div class=\"sd-section-title\">Chi ti\u1EBFt t\u1EEBng h\u1ED9p qu\xE0</div>\n          <div class=\"sd-section-note\">Nh\u1EA5n \u1EA3nh \u0111\u1EC3 xem ph\xF3ng to</div>\n        </div>\n        <div class=\"sd-box-grid\">").concat(boxCardsHtml, "</div>\n      </section>\n\n      <section class=\"sd-section\">\n        <div class=\"sd-section-head\">\n          <div class=\"sd-section-title\">L\u1ECBch s\u1EED giao d\u1ECBch phi\xEAn</div>\n          <div class=\"sd-section-note\">Hi\u1EC3n th\u1ECB t\u1ED1i \u0111a 30 b\u1EA3n ghi m\u1EDBi nh\u1EA5t</div>\n        </div>\n        <div class=\"sd-timeline\">").concat(renderSessionTimeline(txData), "</div>\n      </section>\n    ");
          if (window.__manualTextMap && typeof applyManualTextMapToDOM === 'function') {
            applyManualTextMapToDOM(window.__manualTextMap);
          }
          _context84.n = 6;
          break;
        case 5:
          _context84.p = 5;
          _t55 = _context84.v;
          body.innerHTML = "<div class=\"sd-no-data\">Kh\xF4ng th\u1EC3 t\u1EA3i chi ti\u1EBFt phi\xEAn: ".concat(escapeHtml(_t55.message || 'Lỗi không xác định'), "</div>");
          subEl.textContent = contentTextGlobal('sessionDetailLoadFailedSub', 'Không thể tải dữ liệu chi tiết, vui lòng thử lại.');
        case 6:
          return _context84.a(2);
      }
    }, _callee84, null, [[3, 5]]);
  }));
  return _openSessionDetailModal.apply(this, arguments);
}
function syncLoginStartButtonState() {
  var input = getHomepageSessionInput();
  var button = getHomepageStartButton();
  if (!input || !button) return;
  button.disabled = (input.value || '').trim().length < 1;
}
function bindLoginInputState() {
  var input = getHomepageSessionInput();
  if (!input || input.dataset.startButtonBound === '1') return;
  input.addEventListener('input', syncLoginStartButtonState);
  input.dataset.startButtonBound = '1';
  syncLoginStartButtonState();
}
function initLoginDecor() {
  var stars = document.getElementById('nhpStars');
  var blobs = document.getElementById('nhpGlowBlobs');
  var shapes = document.getElementById('nhpShapes');
  if (!stars || !blobs || !shapes || stars.dataset.decorReady === '1') return;
  var prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var lowPowerMode = prefersReducedMotion || isMobileLiteEffects();
  var starCount = lowPowerMode ? 18 : 36;
  var shapeCount = lowPowerMode ? 10 : 16;
  var starFrag = document.createDocumentFragment();
  for (var i = 0; i < starCount; i += 1) {
    var el = document.createElement('div');
    var size = (Math.random() * 2 + 0.4).toFixed(1);
    var o = (Math.random() * 0.35 + 0.1).toFixed(2);
    el.className = 'nhp-star';
    el.style.cssText = "width:".concat(size, "px;height:").concat(size, "px;top:").concat((Math.random() * 100).toFixed(2), "%;left:").concat((Math.random() * 100).toFixed(2), "%;--o:").concat(o, ";--d:").concat((Math.random() * 5 + 2).toFixed(1), "s;--sd:").concat((Math.random() * 8).toFixed(1), "s;");
    starFrag.appendChild(el);
  }
  stars.appendChild(starFrag);
  var blobCfg = [{
    w: 120,
    h: 44,
    top: 21,
    left: 41,
    blur: 18,
    color: 'rgba(96,165,250,0.22)',
    bd: 8,
    bx: '15px',
    by: '-20px'
  }, {
    w: 90,
    h: 34,
    top: 44,
    left: 31,
    blur: 14,
    color: 'rgba(139,92,246,0.28)',
    bd: 11,
    bx: '-10px',
    by: '-25px'
  }, {
    w: 60,
    h: 22,
    top: 61,
    left: 32,
    blur: 10,
    color: 'rgba(96,165,250,0.2)',
    bd: 9,
    bx: '8px',
    by: '-18px'
  }, {
    w: 200,
    h: 72,
    top: 66,
    left: 24,
    blur: 22,
    color: 'rgba(139,92,246,0.22)',
    bd: 13,
    bx: '-20px',
    by: '-30px'
  }, {
    w: 160,
    h: 58,
    top: 72,
    left: 46,
    blur: 20,
    color: 'rgba(96,165,250,0.18)',
    bd: 10,
    bx: '12px',
    by: '-22px'
  }, {
    w: 230,
    h: 82,
    top: 63,
    left: 60,
    blur: 24,
    color: 'rgba(139,92,246,0.18)',
    bd: 14,
    bx: '18px',
    by: '-28px'
  }, {
    w: 100,
    h: 36,
    top: 18,
    left: 79,
    blur: 14,
    color: 'rgba(167,139,250,0.2)',
    bd: 9,
    bx: '-12px',
    by: '-20px'
  }];
  var blobFrag = document.createDocumentFragment();
  blobCfg.slice(0, lowPowerMode ? 4 : blobCfg.length).forEach(function (cfg, i) {
    var el = document.createElement('div');
    el.className = 'nhp-glow-blob';
    el.style.cssText = "width:".concat(cfg.w, "px;height:").concat(cfg.h, "px;top:").concat(cfg.top, "%;left:").concat(cfg.left, "%;--gb-color:").concat(cfg.color, ";--gb-blur:").concat(cfg.blur, "px;--gb-op:").concat(lowPowerMode ? 0.12 : 0.2, ";--gb-dur:").concat(cfg.bd, "s;--gb-delay:").concat(-(i * 1.3).toFixed(1), "s;--gb-tx:").concat(cfg.bx, ";--gb-ty:").concat(cfg.by, ";--gb-sc:").concat(lowPowerMode ? 1.03 : 1.08, ";");
    blobFrag.appendChild(el);
  });
  blobs.appendChild(blobFrag);
  var colors = ['#a78bfa', '#818cf8', '#c4b5fd', '#7dd3fc', '#93c5fd', '#ddd6fe', '#e879f9'];
  var shapeDefs = {
    diamond: function diamond(c) {
      return "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"20,2 38,20 20,38 2,20\" fill=\"".concat(c, "\" fill-opacity=\".18\" stroke=\"").concat(c, "\" stroke-width=\"1.5\"/></svg>");
    },
    star: function star(c) {
      return "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"20,2 24,15 38,15 27,23 31,37 20,29 9,37 13,23 2,15 16,15\" fill=\"".concat(c, "\" fill-opacity=\".22\" stroke=\"").concat(c, "\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/></svg>");
    },
    gift: function gift(c) {
      return "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"6\" y=\"18\" width=\"28\" height=\"18\" rx=\"1.5\" fill=\"".concat(c, "\" fill-opacity=\".2\" stroke=\"").concat(c, "\" stroke-width=\"1.4\"/><rect x=\"4\" y=\"13\" width=\"32\" height=\"7\" rx=\"1.5\" fill=\"").concat(c, "\" fill-opacity=\".28\" stroke=\"").concat(c, "\" stroke-width=\"1.4\"/><rect x=\"18\" y=\"13\" width=\"4\" height=\"23\" fill=\"").concat(c, "\" fill-opacity=\".45\"/></svg>");
    }
  };
  var keys = Object.keys(shapeDefs);
  var shapeFrag = document.createDocumentFragment();
  for (var _i4 = 0; _i4 < shapeCount; _i4 += 1) {
    var key = keys[Math.floor(Math.random() * keys.length)];
    var color = colors[Math.floor(Math.random() * colors.length)];
    var wrapper = document.createElement('div');
    wrapper.className = 'nhp-shape';
    wrapper.style.cssText = "top:".concat((Math.random() * 88 + 2).toFixed(2), "%;left:").concat((Math.random() * 94 + 1).toFixed(2), "%;width:40px;height:40px;--float-y:").concat((-(Math.random() * 28 + 10)).toFixed(0), "px;--r0:").concat((Math.random() * 30 - 15).toFixed(0), "deg;--r1:").concat((Math.random() * 30 - 15).toFixed(0), "deg;--sf-dur:").concat((Math.random() * 6 + 5).toFixed(1), "s;--s-delay:").concat((-(Math.random() * 14)).toFixed(1), "s;--s-op:").concat((Math.random() * 0.35 + 0.5).toFixed(2), ";--s-color:").concat(color, ";");
    wrapper.innerHTML = shapeDefs[key](color);
    shapeFrag.appendChild(wrapper);
  }
  var commitShapes = function commitShapes() {
    if (!shapes.isConnected) return;
    shapes.appendChild(shapeFrag);
  };
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(commitShapes, {
      timeout: 900
    });
  } else {
    setTimeout(commitShapes, 180);
  }
  stars.dataset.decorReady = '1';
}
function initFromBootstrap() {
  return _initFromBootstrap.apply(this, arguments);
}
function _initFromBootstrap() {
  _initFromBootstrap = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee85() {
    var settingsReady, bootstrap, byUrl, byBootstrap, byStorage, code, input;
    return _regenerator().w(function (_context85) {
      while (1) switch (_context85.n) {
        case 0:
          syncHomepagePerformanceMode();
          _context85.n = 1;
          return initHomepageThemePicker();
        case 1:
          initLoginDecor();
          bindLoginInputState();
          bindSessionInputEnterKey();

          // Load game settings from server (must complete before game can start)
          settingsReady = fetch('/api/settings').then(function (r) {
            return r.json();
          }).then(function (j) {
            if (j.success && j.data) {
              var d = j.data;
              if (d.features) {
                var f = d.features;
                state.gameSettings.showUnluckyPopup = f.showUnluckyPopup === true;
                state.gameSettings.allowReopenPopup = f.allowReopenPopup !== false;
                state.gameSettings.showCelebrationEffects = f.showCelebrationEffects !== false;
              }
              window.__lmbUiSettings = {
                content: d.content || {},
                logo: d.logo || {},
                appearance: d.appearance || {},
                seo: d.seo || {},
                chat: d.chat || {},
                popup: d.popup || {},
                boxSettings: d.boxSettings || {},
                social: d.social || {},
                watermark: d.watermark || {},
                maintenance: d.maintenance || {},
                scripts: d.scripts || {},
                features: d.features || {},
                floatingNotification: d.floatingNotification || {},
                userNotification: d.userNotification || {},
                modalEditor: d.modalEditor || {},
                i18n: d.i18n || {},
                animationPresets: d.animationPresets || {}
              };
              applyUiCustomizationEverywhere();
              applyHomepageThemeLabelOverridesFromSettings();
            }
          }).catch(function () {});
          state._settingsReady = settingsReady;
          bootstrap = window.LMB_BOOTSTRAP || {};
          byUrl = getSessionCodeFromUrl();
          byBootstrap = (bootstrap.sessionCode || '').toUpperCase();
          byStorage = (typeof lmbManager !== 'undefined' ? lmbManager.restoreSession() || '' : '').toUpperCase();
          code = byUrl || byBootstrap || byStorage;
          if (bootstrap.showThankYou) {
            showThankYouPage({
              title: 'Cảm ơn bạn đã tham gia',
              subtitle: 'Hệ thống đã lưu trạng thái phiên chơi của bạn',
              method: 'Phiên chơi',
              detail: 'Bạn có thể tiếp tục tra cứu trong mục Quản lý phiên'
            });
          }
          renderBoxes();
          if (code) {
            _context85.n = 2;
            break;
          }
          return _context85.a(2);
        case 2:
          input = getHomepageSessionInput();
          if (input) input.value = code;
          syncLoginStartButtonState();
          if (!(bootstrap.autoLoadChooseBox || byUrl)) {
            _context85.n = 5;
            break;
          }
          if (!byUrl) {
            _context85.n = 4;
            break;
          }
          _context85.n = 3;
          return tryAutoEnterFromUrl('bootstrap');
        case 3:
          _context85.n = 5;
          break;
        case 4:
          _context85.n = 5;
          return startGame(code);
        case 5:
          return _context85.a(2);
      }
    }, _callee85);
  }));
  return _initFromBootstrap.apply(this, arguments);
}
function enterSession() {
  return startGame();
}
function openWithdrawModal() {
  return openWith();
}
function closeWithdrawModal() {
  return closeWith();
}
function confirmWithdraw() {
  return submitWith();
}
function filterTx(type, el) {
  return setTxFilter(type, el);
}
function goBack() {
  return handleBackNavigationInSession();
}
function backToHome() {
  var gameScreen = document.getElementById('screen-game');
  var loginScreen = document.getElementById('screen-login');
  try {
    var cleanUrl = window.location.pathname;
    window.history.replaceState({
      lmbPage: 'home',
      sessionCode: ''
    }, '', cleanUrl);
  } catch (_) {}
  if (gameScreen) gameScreen.style.display = 'none';
  if (loginScreen) loginScreen.style.display = 'flex';
  syncHomepagePerformanceMode();
  stopGameHeroTyping();
}
function initMobileWalletDocking() {
  // Nav, ticker and wallet are all position:fixed on mobile — no scroll tracking needed.
}
window.addEventListener('popstate', function () {
  handleBackNavigationInSession();
});
document.addEventListener('visibilitychange', function () {
  if (LMB_UPDATE_SCHEDULER && typeof LMB_UPDATE_SCHEDULER.setPaused === 'function') {
    LMB_UPDATE_SCHEDULER.setPaused(!!document.hidden);
  }
  LMB_EVENT_BUS.emit('app:visibility', {
    hidden: !!document.hidden,
    ts: Date.now()
  });
  if (document.hidden) {
    clearRealtimeQueueDrainTimer();
    stopGameHeroTyping();
    stopRealFloatingFeedRefreshTimer();
    if (state.homeFeedTimer) {
      clearTimeout(state.homeFeedTimer);
      state.homeFeedTimer = null;
    }
    if (state.gameFeedTimer) {
      clearTimeout(state.gameFeedTimer);
      state.gameFeedTimer = null;
    }
    return;
  }
  scheduleRealtimeQueueDrain();
  validateSession();
  if (LMB_UPDATE_SCHEDULER && typeof LMB_UPDATE_SCHEDULER.flushNow === 'function') {
    LMB_UPDATE_SCHEDULER.flushNow();
  }
  backgroundSync();
  initWinnerTicker();
  checkAndRestorePendingApproval();
});
window.addEventListener('focus', function () {
  if (document.hidden) return;
  validateSession();
  backgroundSync();
  checkAndRestorePendingApproval();
});
window.addEventListener('beforeunload', function () {
  clearAutoEnterRetryTimers();
  stopGameHeroTyping();
  stopRealtimeSync();
  stopChatSSE();
  stopRealFloatingFeedRefreshTimer();
  if (state.homeFeedTimer) {
    clearTimeout(state.homeFeedTimer);
    state.homeFeedTimer = null;
  }
  if (state.gameFeedTimer) {
    clearTimeout(state.gameFeedTimer);
    state.gameFeedTimer = null;
  }
});
window.selMode = selMode;
window.startGame = startGame;
window.openBox = openBox;
window.closeWin = closeWin;
window.closePrizeLightbox = closePrizeLightbox;
window.togChat = togChat;
window.togChatFromToast = togChatFromToast;
window.hideChatToast = hideChatToast;
window.qChat = qChat;
window.sendC = sendC;
window.startCustomerChat = startCustomerChat;
window.startVoiceRecording = startVoiceRecording;
window.openChatFilePicker = openChatFilePicker;
window.handleChatFilePicked = handleChatFilePicked;
window.contactSupportFromApprovalTimeout = contactSupportFromApprovalTimeout;
window.openWith = openWith;
window.closeWith = closeWith;
window.togCk = togCk;
window.submitWith = submitWith;
window.fillWithdrawAmountPercent = fillWithdrawAmountPercent;
window.refreshWallet = refreshWallet;
window.quickSupportWithdraw = quickSupportWithdraw;
window.quickSupportWithdrawByIndex = quickSupportWithdrawByIndex;
window.openHub = openHub;
window.closeHub = closeHub;
window.searchSession = searchSession;
window.setTxFilter = setTxFilter;
window.setTxPage = setTxPage;
window.refreshHubData = refreshHubData;
window.openClaimModal = openClaimModal;
window.closeClaimModal = closeClaimModal;
window.confirmClaim = confirmClaim;
window.convertPrize = convertPrize;
window.winChooseClaim = winChooseClaim;
window.winChooseMoney = winChooseMoney;
window.winConvertNow = winConvertNow;
window.winClaimNow = function () {
  return showToast('ℹ️ Liên hệ CSKH để nhận quà');
};
window.winDeclineNow = winDeclineNow;
window.acceptSpecialPrize = acceptSpecialPrize;
window.declineSpecialPrize = declineSpecialPrize;
window.reopenWinOptions = reopenWinOptions;
window.setupWinOverlay = setupWinOverlay;
window.shareCurrentPrizePreview = shareCurrentPrizePreview;
window.downloadCurrentPrizeImage = downloadCurrentPrizeImage;
window.captureResult = captureResult;
window.activateNextBox = activateNextBox;
window.openNextAvailableBox = openNextAvailableBox;
window.redeemFreeBox = redeemFreeBox;
window.showApprovalWaitScreen = showApprovalWaitScreen;
window.hideApprovalWaitScreen = hideApprovalWaitScreen;
window.showThankYouPage = showThankYouPage;
window.closeThankYou = closeThankYou;
window.enterSession = enterSession;
window.openWithdrawModal = openWithdrawModal;
window.closeWithdrawModal = closeWithdrawModal;
window.confirmWithdraw = confirmWithdraw;
window.filterTx = filterTx;
window.goBack = goBack;
window.backToHome = backToHome;
window.validateSession = validateSession;
window.getSessionRemainingTime = getSessionRemainingTime;
window.switchLanguage = switchLanguage;
window.__lmbHooks = {
  realtimeManagedByCore: true,
  eventDrivenFetchOnly: true,
  startChatRuntime: function () {
    var _startChatRuntime = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.p = _context0.n) {
          case 0:
            if (!(LMB_RUNTIME.chatRuntimeStarted || LMB_RUNTIME.chatRuntimeStarting)) {
              _context0.n = 1;
              break;
            }
            return _context0.a(2);
          case 1:
            LMB_RUNTIME.chatRuntimeStarting = true;
            _context0.p = 2;
            // Realtime notification runtime must start regardless of lazy widget state.
            initChatWidgetNotificationRuntime();
            bindRealtimeEventConsumers();
            _context0.n = 3;
            return ensureChatModuleReady();
          case 3:
            startChatSSE();
            bootstrapChatNotificationRuntime().catch(function () {});
            requestBrowserNotificationPermissionOnce().catch(function () {});
            LMB_RUNTIME.chatRuntimeStarted = true;
          case 4:
            _context0.p = 4;
            LMB_RUNTIME.chatRuntimeStarting = false;
            return _context0.f(4);
          case 5:
            return _context0.a(2);
        }
      }, _callee0, null, [[2,, 4, 5]]);
    }));
    function startChatRuntime() {
      return _startChatRuntime.apply(this, arguments);
    }
    return startChatRuntime;
  }(),
  ensureWalletUi: function () {
    var _ensureWalletUi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            _context1.n = 1;
            return ensureWalletModuleReady();
          case 1:
            return _context1.a(2);
        }
      }, _callee1);
    }));
    function ensureWalletUi() {
      return _ensureWalletUi.apply(this, arguments);
    }
    return ensureWalletUi;
  }(),
  ensureHistoryUi: function () {
    var _ensureHistoryUi = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            _context10.n = 1;
            return ensureHistoryModuleReady();
          case 1:
            return _context10.a(2);
        }
      }, _callee10);
    }));
    function ensureHistoryUi() {
      return _ensureHistoryUi.apply(this, arguments);
    }
    return ensureHistoryUi;
  }(),
  refreshWalletBundle: function () {
    var _refreshWalletBundle = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.n) {
          case 0:
            _context11.n = 1;
            return Promise.all([refreshWallet(), refreshTransactions()]);
          case 1:
            return _context11.a(2);
        }
      }, _callee11);
    }));
    function refreshWalletBundle() {
      return _refreshWalletBundle.apply(this, arguments);
    }
    return refreshWalletBundle;
  }(),
  refreshInventoryBundle: function () {
    var _refreshInventoryBundle = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            _context12.n = 1;
            return Promise.all([loadPlayerInventory(), refreshTransactions()]);
          case 1:
            return _context12.a(2);
        }
      }, _callee12);
    }));
    function refreshInventoryBundle() {
      return _refreshInventoryBundle.apply(this, arguments);
    }
    return refreshInventoryBundle;
  }()
};
initFromBootstrap().catch(function (err) {
  showToast("\u274C ".concat((err === null || err === void 0 ? void 0 : err.message) || 'Không thể khởi tạo homepage'));
});
setTimeout(function () {
  if (getSessionCodeFromUrl()) {
    scheduleAutoEnterRetries('delayed-fallback');
  }
}, 900);
if (typeof BrowserFingerprint !== 'undefined' && typeof BrowserFingerprint.initializeCache === 'function') {
  BrowserFingerprint.initializeCache().catch(function () {});
}
ensureApiFingerprintCached().catch(function () {});
initMobileWalletDocking();
applyUiMotionSettingForCustomer();
setupEngagementSystem();
if (window.moduleLoader && typeof window.moduleLoader.preloadMobileDefaults === 'function') {
  window.moduleLoader.preloadMobileDefaults();
}
function scheduleChatRuntimeStartRetry() {
  var attempt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var maxAttempts = 5;
  var delays = [600, 1200, 2200, 3600, 5200];
  var idx = Math.max(0, Math.min(attempt, delays.length - 1));
  var waitMs = delays[idx];
  setTimeout(function () {
    if (!window.__lmbHooks || typeof window.__lmbHooks.startChatRuntime !== 'function') return;
    window.__lmbHooks.startChatRuntime().catch(function () {}).finally(function () {
      if (LMB_RUNTIME.chatRuntimeStarted) return;
      if (attempt + 1 >= maxAttempts) return;
      scheduleChatRuntimeStartRetry(attempt + 1);
    });
  }, waitMs);
}
scheduleChatRuntimeStartRetry(0);

// Hard-start realtime chat notifications on page load.
// This bypasses lazy-widget timing so user can receive admin message
// sound/toast/hint without opening the chat widget first.
setTimeout(function () {
  try {
    initChatWidgetNotificationRuntime();
    bindRealtimeEventConsumers();
    bootstrapChatNotificationRuntime().catch(function () {});
    startChatSSE();
  } catch (_) {}
}, 280);
scheduleNoti();
initWinnerTicker();