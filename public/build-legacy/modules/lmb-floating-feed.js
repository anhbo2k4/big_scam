function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * Floating Feed Module — lazy loaded after core JS
 * Contains: winner ticker, floating notifications (home + game), real feed refresh
 * Depends on: state, translateExactTextByMap (from main file global scope)
 */

// When loaded as a classic script (build-legacy / dynamic loadSequentially),
// `state` is not in scope — alias it from window so all references below work.
/* eslint-disable no-var */
var state = typeof state !== 'undefined' ? state : window.state;
var translateExactTextByMap = typeof translateExactTextByMap !== 'undefined' ? translateExactTextByMap : window.translateExactTextByMap || function (t) {
  return t;
};
/* eslint-enable no-var */

var TICKER_FIRST_NAMES = ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Huynh', 'Phan', 'Vu', 'Vo', 'Dang', 'Bui', 'Do', 'Ho', 'Ngo', 'Duong', 'Ly', 'Truong', 'Dinh', 'Mai', 'Luu', 'Chu', 'Trinh', 'Cao', 'Ta', 'Ton', 'La', 'Diep', 'Ninh'];
var TICKER_MIDDLE_NAMES = ['Van', 'Thi', 'Ngoc', 'Thanh', 'Quoc', 'Gia', 'Phuong', 'Duc', 'Minh', 'Anh', 'Hong', 'Bao', 'Nhat', 'Huu', 'Hoang', 'Thu', 'Kim', 'Xuan', 'Tien', 'Khanh', 'Ha', 'Quynh', 'My', 'Gia Han'];
var TICKER_LAST_NAMES = ['An', 'Binh', 'Cuong', 'Dung', 'Dat', 'Giang', 'Hanh', 'Hoa', 'Kiet', 'Linh', 'Long', 'My', 'Nam', 'Phuc', 'Quan', 'Son', 'Trang', 'Vy', 'Yen', 'Khoa', 'Hieu', 'Thuy', 'Ngan', 'Khanh', 'Lam', 'Truc', 'Nhi', 'Hao', 'Tuan', 'Phuong'];
var TICKER_PRIZE_PREFIX = ['O to', 'Xe dien', 'Dien thoai', 'Vang SJC', 'Bac 999', 'Kim cuong', 'Dong ho', 'Tien thuong', 'Voucher', 'Qua dac biet', 'Bo trang suc', 'Set qua cao cap', 'The VIP', 'Qua cong nghe', 'Qua sieu xe'];
var TICKER_PRIZE_SUFFIX = ['cao cap', 'gaming', 'thoi trang', 'gia dung', 'cong nghe', 'dac biet', 'sieu vip', 'ban gioi han', 'pro', 'premium', 'plus', '2026', 'hot trend', 'doc quyen', 'bat ngo', 'sieu tiet kiem', 'xinh xan', 'sang trong', 'dang yeu', 'chat luong cao'];
function showWinNoti() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Ch\xFAc m\u1EEBng! C\xF3 ng\u01B0\u1EDDi ch\u01A1i v\u1EEBa nh\u1EADn th\u01B0\u1EDFng";
  var container = document.getElementById('winNotiContainer');
  if (!container) return;
  var el = document.createElement('div');
  el.className = 'win-noti';
  el.innerHTML = "<span class=\"dot-green\"></span><span>".concat(message, "</span>");
  container.appendChild(el);
  requestAnimationFrame(function () {
    return el.classList.add('show');
  });
  setTimeout(function () {
    el.classList.remove('show');
    setTimeout(function () {
      return el.remove();
    }, 320);
  }, 3600);
}
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function buildNamePool() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
  var pool = [];
  var used = new Set();
  var guard = 0;
  while (pool.length < size && guard < size * 40) {
    guard += 1;
    var full = "".concat(randomItem(TICKER_FIRST_NAMES), " ").concat(randomItem(TICKER_MIDDLE_NAMES), " ").concat(randomItem(TICKER_LAST_NAMES));
    if (used.has(full)) continue;
    used.add(full);
    pool.push(full);
  }
  return pool;
}
function buildPrizePool() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
  var values = [100, 150, 200, 300, 500, 700, 1000, 1500, 2000, 3000, 5000];
  var pool = [];
  var used = new Set();
  var guard = 0;
  while (pool.length < size && guard < size * 50) {
    guard += 1;
    var value = randomItem(values);
    var prize = "".concat(randomItem(TICKER_PRIZE_PREFIX), " ").concat(value, "K ").concat(randomItem(TICKER_PRIZE_SUFFIX));
    if (used.has(prize)) continue;
    used.add(prize);
    pool.push(prize);
  }
  return pool;
}
var TICKER_NAMES = buildNamePool(100);
var TICKER_PRIZES = buildPrizePool(100);
var FORCED_NOTIFICATION_IMAGE_URL = '/images/logo-floating.webp';
var DEFAULT_FLOATING_PRIZE_POOL = ["L\xEC x\xEC tr\u1ECB gi\xE1 88,888 NDT", "L\xEC x\xEC tr\u1ECB gi\xE1 3,888 USD", "L\xEC x\xEC tr\u1ECB gi\xE1 50,000,000 VND", "1 c\xE2y v\xE0ng SJC 9999", "\xD4 t\xF4 h\u1EA1ng sang", "\xD4 t\xF4 \u0111i\u1EC7n cao c\u1EA5p", "\xD4 t\xF4 \u0111i\u1EC7n h\u1EA1ng sang phi\xEAn b\u1EA3n gi\u1EDBi h\u1EA1n", "\xD4 t\xF4 BMW 5 Series", "\xD4 t\xF4 Mercedes C300", "\xD4 t\xF4 Lexus RX", "Xe m\xE1y SH", "\u0110i\u1EC7n tho\u1EA1i iPhone 17 Pro Max", "\u0110i\u1EC7n tho\u1EA1i iPhone 17 Ultra", "\u0110i\u1EC7n tho\u1EA1i Samsung Galaxy S26 Ultra", "\u0110i\u1EC7n tho\u1EA1i Vertu Signature", "Voucher mua s\u1EAFm 20,000,000 VND", "L\xEC x\xEC tr\u1ECB gi\xE1 18,888 NDT", "L\xEC x\xEC tr\u1ECB gi\xE1 1,888 USD", "L\xEC x\xEC tr\u1ECB gi\xE1 8,888 USD", "L\xEC x\xEC tr\u1ECB gi\xE1 120,000,000 VND", "L\xEC x\xEC tr\u1ECB gi\xE1 88,000,000 VND", "L\xEC x\xEC tr\u1ECB gi\xE1 68,000,000 VND", "1 ch\u1EC9 v\xE0ng SJC 9999", "2 c\xE2y v\xE0ng SJC 9999", "3 c\xE2y v\xE0ng SJC 9999", "\xD4 t\xF4 h\u1EA1ng sang phi\xEAn b\u1EA3n gi\u1EDBi h\u1EA1n", "\xD4 t\xF4 h\u1EA1ng sang full option", "Xe m\xE1y SH 350i", "Xe m\xE1y SH mode cao c\u1EA5p", "\u0110i\u1EC7n tho\u1EA1i iPhone 17 Pro", "\u0110i\u1EC7n tho\u1EA1i iPhone 17 Pro Max 1TB", "Voucher mua s\u1EAFm 50,000,000 VND", "Voucher mua s\u1EAFm 100,000,000 VND", 'Tai nghe AirPods Pro', "\u0110\u1ED3ng h\u1ED3 th\xF4ng minh cao c\u1EA5p", 'MacBook Pro M4 Max', 'iPad Pro 13-inch', 'Tivi OLED 77 inch', "5 c\xE2y v\xE0ng SJC 9999", "10 c\xE2y v\xE0ng SJC 9999", "1kg b\u1EA1c 999", "5kg b\u1EA1c 999", "Nh\u1EABn kim c\u01B0\u01A1ng VVS1", "D\xE2y chuy\u1EC1n v\xE0ng 24K cao c\u1EA5p", "L\u1EAFc tay v\xE0ng tr\u1EAFng \u0111\xEDnh kim c\u01B0\u01A1ng", "B\u1ED9 trang s\u1EE9c kim c\u01B0\u01A1ng", "Chuy\u1EBFn du l\u1ECBch 5 sao cho gia \u0111\xECnh", "B\u1ED9 vali Rimowa phi\xEAn b\u1EA3n gi\u1EDBi h\u1EA1n", "Set n\u01B0\u1EDBc hoa niche cao c\u1EA5p", 'Laptop gaming RTX 5090', "B\u1ED9 sofa da \xDD cao c\u1EA5p", "Th\u1EBB th\xE0nh vi\xEAn golf VIP 1 n\u0103m", "Du thuy\u1EC1n tr\u1EA3i nghi\u1EC7m 2 ng\xE0y 1 \u0111\xEAm", "B\u1ED9 camera full-frame chuy\xEAn nghi\u1EC7p", "Xe \u0111i\u1EC7n h\u1EA1ng sang", "Kim c\u01B0\u01A1ng 1 carat ch\u1EE9ng nh\u1EADn GIA", "Voucher ngh\u1EC9 d\u01B0\u1EE1ng 7 ng\xE0y 6 \u0111\xEAm Maldives", "Combo n\u1ED9i th\u1EA5t th\xF4ng minh to\xE0n nh\xE0", "Bi\u1EC7t th\u1EF1 ngh\u1EC9 d\u01B0\u1EE1ng cu\u1ED1i tu\u1EA7n", "Voucher th\u1EDDi trang h\xE0ng hi\u1EC7u 300,000,000 VND"];
var HOME_FEED_ICONS = ["\uD83C\uDF81", "\uD83D\uDCB0", "\uD83C\uDFC6", "\u2B50", "\uD83D\uDD25"];
var HOME_FEED_OBJECT_IMAGES = [FORCED_NOTIFICATION_IMAGE_URL];
function randomFeedDelayMs() {
  var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var minRaw = Number(cfg.minIntervalMs || 0);
  var maxRaw = Number(cfg.maxIntervalMs || 0);
  if (Number.isFinite(minRaw) && Number.isFinite(maxRaw) && minRaw > 0 && maxRaw > 0) {
    var minMs = Math.max(300, Math.floor(Math.min(minRaw, maxRaw)));
    var maxMs = Math.max(minMs, Math.floor(Math.max(minRaw, maxRaw)));
    return minMs + Math.floor(Math.random() * (maxMs - minMs + 1));
  }
  var duration = Math.max(1800, Number(cfg.displayDuration || 6000));
  var maxVisible = Math.max(1, Number(cfg.maxVisible || 3));
  var base = Math.max(900, Math.floor(duration / Math.max(2, maxVisible)));
  var jitter = Math.floor(Math.random() * 700);
  return base + jitter;
}
function maskName(raw) {
  var parts = String(raw || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '********ng';
  var displayName = String(parts[parts.length - 1] || '').replace(/[^a-zA-Z]/g, '');
  if (!displayName) return '********ng';
  var visibleTail = displayName.slice(-2).toLowerCase() || 'ng';
  var starCount = Math.max(8, displayName.length + 3);
  return "".concat('*'.repeat(starCount)).concat(visibleTail);
}
function randomTickerAgo() {
  var minutes = 1 + Math.floor(Math.random() * 1440);
  if (minutes < 60) return "".concat(minutes, " ph\xFAt tr\u01B0\u1EDBc");
  var hours = Math.floor(minutes / 60);
  if (hours < 24) return "".concat(hours, " gi\u1EDD tr\u01B0\u1EDBc");
  return "1 ng\xE0y tr\u01B0\u1EDBc";
}
function parseToEpochMs(value) {
  if (!value) return 0;
  var ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : 0;
}
function formatFloatingAgoFromTimestamp(tsValue) {
  var tsMs = parseToEpochMs(tsValue);
  if (!tsMs) return randomTickerAgo();
  var elapsedMinutes = Math.max(1, Math.floor((Date.now() - tsMs) / 60000));
  if (elapsedMinutes < 60) return "".concat(elapsedMinutes, " ph\xFAt tr\u01B0\u1EDBc");
  var elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return "".concat(elapsedHours, " gi\u1EDD tr\u01B0\u1EDBc");
  return "".concat(Math.min(7, Math.floor(elapsedHours / 24)), " ng\xE0y tr\u01B0\u1EDBc");
}
function normalizeFloatingWinnerEvent(raw) {
  if (!raw || _typeof(raw) !== 'object') return null;
  var id = String(raw.id || '').trim();
  var winnerName = String(raw.winnerName || '').trim();
  var prizeName = String(raw.prizeName || '').trim();
  var sessionCode = String(raw.sessionCode || '').trim().toUpperCase();
  if (!id || !winnerName || !prizeName) return null;
  return {
    id: id,
    sessionCode: sessionCode,
    winnerName: winnerName,
    prizeName: prizeName,
    approvedAt: raw.approvedAt || raw.requestedAt || null
  };
}
function getNextRealFloatingWinner() {
  if (!Array.isArray(state.floatingRealFeedQueue) || !state.floatingRealFeedQueue.length) return null;
  return state.floatingRealFeedQueue.shift() || null;
}
function refreshRealFloatingWinnerFeed() {
  return _refreshRealFloatingWinnerFeed.apply(this, arguments);
}
function _refreshRealFloatingWinnerFeed() {
  _refreshRealFloatingWinnerFeed = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var force,
      now,
      res,
      j,
      normalized,
      existingIds,
      _args2 = arguments,
      _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          force = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : false;
          now = Date.now();
          if (!(!force && now - Number(state.floatingRealFeedLastFetchAt || 0) < 30000)) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2);
        case 1:
          if (!state.floatingRealFeedInFlight) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2);
        case 2:
          state.floatingRealFeedInFlight = true;
          _context2.p = 3;
          _context2.n = 4;
          return fetch('/api/withdrawals/floating-feed?limit=120&days=14', {
            credentials: 'same-origin'
          });
        case 4:
          res = _context2.v;
          _context2.n = 5;
          return res.json();
        case 5:
          j = _context2.v;
          if (j && j.success && Array.isArray(j.data)) {
            normalized = j.data.map(normalizeFloatingWinnerEvent).filter(Boolean).filter(function (event) {
              return !state.floatingRealFeedShownIds[event.id];
            });
            if (normalized.length) {
              existingIds = new Set((state.floatingRealFeedQueue || []).map(function (event) {
                return event && event.id;
              }).filter(Boolean));
              normalized.forEach(function (event) {
                if (!existingIds.has(event.id)) {
                  state.floatingRealFeedQueue.push(event);
                  existingIds.add(event.id);
                }
              });
              state.floatingRealFeedCursor = 0;
            }
          }
          state.floatingRealFeedLastFetchAt = now;
          _context2.n = 7;
          break;
        case 6:
          _context2.p = 6;
          _t = _context2.v;
          state.floatingRealFeedLastFetchAt = now;
        case 7:
          _context2.p = 7;
          state.floatingRealFeedInFlight = false;
          return _context2.f(7);
        case 8:
          return _context2.a(2);
      }
    }, _callee2, null, [[3, 6, 7, 8]]);
  }));
  return _refreshRealFloatingWinnerFeed.apply(this, arguments);
}
function startRealFloatingFeedRefreshTimer() {
  if (state.floatingRealFeedRefreshTimer) return;
  var _tick = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.n = 1;
            return refreshRealFloatingWinnerFeed(false);
          case 1:
            state.floatingRealFeedRefreshTimer = setTimeout(_tick, 45000);
          case 2:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function tick() {
      return _ref.apply(this, arguments);
    };
  }();
  _tick();
}
function stopRealFloatingFeedRefreshTimer() {
  if (state.floatingRealFeedRefreshTimer) {
    clearTimeout(state.floatingRealFeedRefreshTimer);
    state.floatingRealFeedRefreshTimer = null;
  }
}
function getFloatingPrizePool(cfg) {
  var customPool = Array.isArray(cfg === null || cfg === void 0 ? void 0 : cfg.prizePool) ? cfg.prizePool.map(function (x) {
    return String(x || '').trim();
  }).filter(Boolean) : [];
  if (customPool.length) return customPool;
  return DEFAULT_FLOATING_PRIZE_POOL;
}
function normalizeFloatingMessageItem(raw) {
  if (raw && _typeof(raw) === 'object') {
    return {
      text: String(raw.text || '').trim(),
      icon: String(raw.icon || '').trim(),
      image: String(raw.image || '').trim()
    };
  }
  return {
    text: String(raw || '').trim(),
    icon: '',
    image: ''
  };
}
function getFloatingMessageTemplates(cfg) {
  var list = Array.isArray(cfg === null || cfg === void 0 ? void 0 : cfg.customMessages) ? cfg.customMessages.map(normalizeFloatingMessageItem).filter(function (x) {
    return x.text;
  }) : [];
  if (list.length) return list;
  var fallbackTemplate = String((cfg === null || cfg === void 0 ? void 0 : cfg.template) || '').trim() || "\uD83C\uDF81 {name} v\u1EEBa nh\u1EADn \u0111\u01B0\u1EE3c {prize}!";
  return [{
    text: fallbackTemplate,
    icon: '',
    image: ''
  }];
}
function buildTickerHtml() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;
  var items = [];
  for (var i = 0; i < count; i += 1) {
    var name = maskName(randomItem(TICKER_NAMES));
    var prize = randomItem(TICKER_PRIZES);
    var ago = randomTickerAgo();
    items.push("<span class=\"win-ticker-item\"><span class=\"ticker-dot\" aria-hidden=\"true\"></span><span class=\"ticker-main\"><strong>".concat(name, "</strong> v\u1EEBa nh\u1EADn <b>").concat(prize, "</b></span><span class=\"ticker-time\">").concat(ago, "</span></span>"));
  }
  return items.join('');
}
function buildHomeFeedNotice() {
  var cfg = window.__floatingConfig || {};
  var hasRealQueue = Array.isArray(state.floatingRealFeedQueue) && state.floatingRealFeedQueue.length > 0;
  var realEvent = null;
  if (hasRealQueue) {
    state.floatingFeedMixToggle = !state.floatingFeedMixToggle;
    if (state.floatingFeedMixToggle) {
      realEvent = getNextRealFloatingWinner();
    }
  }
  if (realEvent && realEvent.id) {
    state.floatingRealFeedShownIds[realEvent.id] = Date.now();
    var ids = Object.keys(state.floatingRealFeedShownIds);
    if (ids.length > 1200) {
      var sorted = ids.sort(function (a, b) {
        return Number(state.floatingRealFeedShownIds[a] || 0) - Number(state.floatingRealFeedShownIds[b] || 0);
      });
      sorted.slice(0, 400).forEach(function (id) {
        delete state.floatingRealFeedShownIds[id];
      });
    }
  }
  var fallbackName = maskName(randomItem(TICKER_NAMES));
  var nameFromSource = realEvent ? realEvent.winnerName : fallbackName;
  var prizePool = getFloatingPrizePool(cfg);
  var prizeFromSource = realEvent ? realEvent.prizeName : randomItem(prizePool);
  var name = cfg.showRecipientName !== false ? nameFromSource : "Ng\u01B0\u1EDDi ch\u01A1i";
  var prize = cfg.showPrizeName !== false ? prizeFromSource : "ph\u1EA7n th\u01B0\u1EDFng h\u1EA5p d\u1EABn";
  var ago = realEvent ? formatFloatingAgoFromTimestamp(realEvent.approvedAt) : randomTickerAgo();
  var templates = getFloatingMessageTemplates(cfg);
  var selectedTemplateItem = normalizeFloatingMessageItem(randomItem(templates));
  var customImageUrl = FORCED_NOTIFICATION_IMAGE_URL;
  var entryImageUrl = String(selectedTemplateItem.image || '').trim();
  var entryIcon = String(selectedTemplateItem.icon || '').trim();
  var fallbackIcon = entryIcon || String(cfg.customIcon || '').trim() || "\uD83C\uDF81";
  var visualType = 'image';
  var image = entryImageUrl || customImageUrl || randomItem(HOME_FEED_OBJECT_IMAGES);
  var icon = entryIcon || fallbackIcon || randomItem(HOME_FEED_ICONS);
  var selectedTemplate = selectedTemplateItem.text || String(cfg.template || '').trim() || "\uD83C\uDF81 {name} v\u1EEBa nh\u1EADn \u0111\u01B0\u1EE3c {prize}!";
  var message = realEvent ? "Ch\xFAc m\u1EEBng kh\xE1ch h\xE0ng v\u1EDBi m\xE3 phi\xEAn ".concat(realEvent.sessionCode || 'N/A', " tr\xFAng ").concat(prize) : selectedTemplate.replace(/\{name\}/g, name).replace(/\{prize\}/g, prize);
  return {
    visualType: visualType,
    image: image,
    icon: icon,
    fallbackIcon: fallbackIcon,
    title: realEvent ? "Ch\xFAc m\u1EEBng kh\xE1ch h\xE0ng" : "Th\xF4ng b\xE1o nh\u1EADn th\u01B0\u1EDFng",
    message: message,
    time: ago
  };
}
function pushHomeFloatingNotice() {
  var feed = document.getElementById('homeFloatingFeed');
  if (!feed || document.hidden) return;
  var maxVisible = window.__floatingConfig && window.__floatingConfig.maxVisible || 3;
  var duration = window.__floatingConfig && window.__floatingConfig.displayDuration || 6100;
  var n = buildHomeFeedNotice();
  var el = document.createElement('div');
  el.className = 'home-feed-item';
  var cfg = window.__floatingConfig || {};
  if (cfg.bgColor) el.style.background = cfg.bgColor;
  if (cfg.borderColor) el.style.border = "1px solid ".concat(cfg.borderColor);
  var visualHtml = n.visualType === 'image' && n.image ? "<img class=\"home-feed-thumb\" src=\"".concat(n.image, "\" alt=\"Hinh anh vat pham\" loading=\"lazy\" decoding=\"async\" onerror=\"this.style.display='none';var fb=this.parentElement&&this.parentElement.querySelector('.home-feed-glyph');if(fb){fb.style.display='inline-flex';}\"><span class=\"home-feed-glyph\" aria-hidden=\"true\" style=\"display:none\">").concat(n.fallbackIcon || "\uD83C\uDF81", "</span>") : "<span class=\"home-feed-glyph\" aria-hidden=\"true\">".concat(n.icon || "\uD83C\uDF81", "</span>");
  el.innerHTML = "<div class=\"home-feed-icon\" aria-hidden=\"true\">".concat(visualHtml, "</div><div class=\"home-feed-body\"><div class=\"home-feed-title\">").concat(n.title, "</div><div class=\"home-feed-sub\">").concat(n.message, "</div><div class=\"home-feed-time\">").concat(n.time, "</div></div>");
  if (cfg.textColor) {
    var titleEl = el.querySelector('.home-feed-title');
    var subEl = el.querySelector('.home-feed-sub');
    var timeEl = el.querySelector('.home-feed-time');
    if (titleEl) titleEl.style.color = cfg.textColor;
    if (subEl) subEl.style.color = cfg.textColor;
    if (timeEl) timeEl.style.color = cfg.textColor;
  }
  requestAnimationFrame(function () {
    if (!feed.isConnected) return;
    feed.appendChild(el);
  });
  if (window.__manualTextMap) {
    var _map = window.__manualTextMap;
    var _title = el.querySelector('.home-feed-title');
    var _time = el.querySelector('.home-feed-time');
    if (_title) _title.textContent = translateExactTextByMap(_title.textContent, _map);
    if (_time) _time.textContent = translateExactTextByMap(_time.textContent, _map);
  }
  while (feed.children.length > maxVisible) {
    feed.removeChild(feed.firstElementChild);
  }
  setTimeout(function () {
    if (el.parentNode) el.remove();
  }, duration);
}
function initHomeFloatingFeed() {
  var feed = document.getElementById('homeFloatingFeed');
  if (!feed || state.homeFeedTimer) return;
  var cfg = window.__floatingConfig || {};
  if (cfg.enabled === false && cfg.alwaysOn !== true) return;
  var _scheduleNext = function scheduleNext() {
    var delayMs = randomFeedDelayMs(cfg);
    state.homeFeedTimer = setTimeout(function () {
      pushHomeFloatingNotice();
      _scheduleNext();
    }, delayMs);
  };
  _scheduleNext();
}
function pushGameFloatingNotice() {
  var feed = document.getElementById('gameFloatingFeed');
  if (!feed || document.hidden) return;
  var gameScreen = document.getElementById('screen-game');
  if (!gameScreen || window.getComputedStyle(gameScreen).display === 'none') return;
  var maxVisible = window.__floatingConfig && window.__floatingConfig.maxVisible || 3;
  var duration = window.__floatingConfig && window.__floatingConfig.displayDuration || 6200;
  var n = buildHomeFeedNotice();
  var el = document.createElement('div');
  el.className = 'home-feed-item';
  var cfg = window.__floatingConfig || {};
  if (cfg.bgColor) el.style.background = cfg.bgColor;
  if (cfg.borderColor) el.style.border = "1px solid ".concat(cfg.borderColor);
  var visualHtml = n.visualType === 'image' && n.image ? "<img class=\"home-feed-thumb\" src=\"".concat(n.image, "\" alt=\"Hinh anh vat pham\" loading=\"lazy\" decoding=\"async\" onerror=\"this.style.display='none';var fb=this.parentElement&&this.parentElement.querySelector('.home-feed-glyph');if(fb){fb.style.display='inline-flex';}\"><span class=\"home-feed-glyph\" aria-hidden=\"true\" style=\"display:none\">").concat(n.fallbackIcon || "\uD83C\uDF81", "</span>") : "<span class=\"home-feed-glyph\" aria-hidden=\"true\">".concat(n.icon || "\uD83C\uDF81", "</span>");
  el.innerHTML = "<div class=\"home-feed-icon\" aria-hidden=\"true\">".concat(visualHtml, "</div><div class=\"home-feed-body\"><div class=\"home-feed-title\">").concat(n.title, "</div><div class=\"home-feed-sub\">").concat(n.message, "</div><div class=\"home-feed-time\">").concat(n.time, "</div></div>");
  if (cfg.textColor) {
    var titleEl = el.querySelector('.home-feed-title');
    var subEl = el.querySelector('.home-feed-sub');
    var timeEl = el.querySelector('.home-feed-time');
    if (titleEl) titleEl.style.color = cfg.textColor;
    if (subEl) subEl.style.color = cfg.textColor;
    if (timeEl) timeEl.style.color = cfg.textColor;
  }
  if (window.__manualTextMap) {
    var _map = window.__manualTextMap;
    var _title = el.querySelector('.home-feed-title');
    var _time = el.querySelector('.home-feed-time');
    if (_title) _title.textContent = translateExactTextByMap(_title.textContent, _map);
    if (_time) _time.textContent = translateExactTextByMap(_time.textContent, _map);
  }
  requestAnimationFrame(function () {
    if (!feed.isConnected) return;
    feed.appendChild(el);
    while (feed.children.length > maxVisible) {
      feed.removeChild(feed.firstElementChild);
    }
  });
  setTimeout(function () {
    if (el.parentNode) el.remove();
  }, duration);
}
function initGameFloatingFeed() {
  var feed = document.getElementById('gameFloatingFeed');
  if (!feed || state.gameFeedTimer) return;
  var cfg = window.__floatingConfig || {};
  if (cfg.enabled === false && cfg.alwaysOn !== true) return;
  var _scheduleNext2 = function scheduleNext() {
    var delayMs = randomFeedDelayMs(cfg);
    state.gameFeedTimer = setTimeout(function () {
      pushGameFloatingNotice();
      _scheduleNext2();
    }, delayMs);
  };
  _scheduleNext2();
}
function renderWinnerTicker() {
  var tracks = document.querySelectorAll('.js-win-ticker-track');
  if (!tracks.length) return;
  var segment = buildTickerHtml(14);
  var html = "".concat(segment).concat(segment);
  tracks.forEach(function (track) {
    track.innerHTML = html;
  });
}
function initWinnerTicker() {
  loadFloatingConfig().then(function () {
    refreshRealFloatingWinnerFeed(true);
    startRealFloatingFeedRefreshTimer();
    initHomeFloatingFeed();
    initGameFloatingFeed();
  });
}
function loadFloatingConfig() {
  return _loadFloatingConfig.apply(this, arguments);
}
function _loadFloatingConfig() {
  _loadFloatingConfig = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var fn, features, res, j, fallbackFn, _t2;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          if (!((!window.__lmbUiSettings || !window.__lmbUiSettings.features) && state._settingsReady)) {
            _context3.n = 1;
            break;
          }
          _context3.n = 1;
          return state._settingsReady;
        case 1:
          fn = window.__lmbUiSettings && window.__lmbUiSettings.floatingNotification || {};
          features = window.__lmbUiSettings && window.__lmbUiSettings.features || {};
          if (!(fn || features)) {
            _context3.n = 2;
            break;
          }
          window.__floatingConfig = {
            enabled: fn.enabled !== false,
            alwaysOn: fn.alwaysOn !== false,
            position: fn.position || 'left',
            showRecipientName: fn.showRecipientName !== false,
            showPrizeName: fn.showPrizeName !== false,
            displayDuration: fn.displayDuration || 6000,
            maxVisible: fn.maxVisible || 3,
            minIntervalMs: fn.minIntervalMs || 3200,
            maxIntervalMs: fn.maxIntervalMs || 5200,
            customMessages: fn.customMessages || [],
            prizePool: Array.isArray(fn.prizePool) ? fn.prizePool : [],
            template: fn.template || "\uD83C\uDFC6 Ch\xFAc m\u1EEBng {name} tr\xFAng {prize}!",
            bgColor: fn.bgColor || '',
            textColor: fn.textColor || '',
            borderColor: fn.borderColor || '',
            showAvatar: fn.showAvatar !== false,
            visualMode: fn.visualMode || 'auto',
            customImageUrl: FORCED_NOTIFICATION_IMAGE_URL,
            customIcon: fn.customIcon || "\uD83C\uDF81"
          };
          applyFloatingPosition(window.__floatingConfig.position);
          return _context3.a(2);
        case 2:
          _context3.n = 3;
          return fetch('/api/settings');
        case 3:
          res = _context3.v;
          _context3.n = 4;
          return res.json();
        case 4:
          j = _context3.v;
          if (j && j.success && j.data) {
            fallbackFn = j.data.floatingNotification || {};
            window.__floatingConfig = {
              enabled: fallbackFn.enabled !== false,
              alwaysOn: fallbackFn.alwaysOn !== false,
              position: fallbackFn.position || 'left',
              showRecipientName: fallbackFn.showRecipientName !== false,
              showPrizeName: fallbackFn.showPrizeName !== false,
              displayDuration: fallbackFn.displayDuration || 6000,
              maxVisible: fallbackFn.maxVisible || 3,
              minIntervalMs: fallbackFn.minIntervalMs || 1800,
              maxIntervalMs: fallbackFn.maxIntervalMs || 3200,
              customMessages: fallbackFn.customMessages || [],
              prizePool: Array.isArray(fallbackFn.prizePool) ? fallbackFn.prizePool : [],
              template: fallbackFn.template || "\uD83C\uDFC6 Ch\xFAc m\u1EEBng {name} tr\xFAng {prize}!",
              bgColor: fallbackFn.bgColor || '',
              textColor: fallbackFn.textColor || '',
              borderColor: fallbackFn.borderColor || '',
              showAvatar: fallbackFn.showAvatar !== false,
              visualMode: fallbackFn.visualMode || 'auto',
              customImageUrl: FORCED_NOTIFICATION_IMAGE_URL,
              customIcon: fallbackFn.customIcon || "\uD83C\uDF81"
            };
            applyFloatingPosition(window.__floatingConfig.position);
          }
          _context3.n = 6;
          break;
        case 5:
          _context3.p = 5;
          _t2 = _context3.v;
          window.__floatingConfig = {
            enabled: true,
            alwaysOn: true,
            position: 'left',
            maxVisible: 3,
            displayDuration: 6000,
            minIntervalMs: 1800,
            maxIntervalMs: 3200,
            prizePool: DEFAULT_FLOATING_PRIZE_POOL,
            visualMode: 'auto',
            customImageUrl: FORCED_NOTIFICATION_IMAGE_URL,
            customIcon: "\uD83C\uDF81"
          };
        case 6:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 5]]);
  }));
  return _loadFloatingConfig.apply(this, arguments);
}
function applyFloatingPosition(position) {
  var feeds = document.querySelectorAll('.home-floating-feed, .game-floating-feed');
  feeds.forEach(function (feed) {
    if (position === 'right') {
      feed.style.left = 'auto';
      feed.style.right = '14px';
    } else {
      feed.style.left = '14px';
      feed.style.right = 'auto';
    }
  });
}

// Self-init: start feeds when this module loads
try {
  renderWinnerTicker();
  initWinnerTicker();
} catch (_) {}