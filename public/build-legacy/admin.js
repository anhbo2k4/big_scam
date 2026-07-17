var _document$getElementB27;
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var CONFIG = {
  AUTO_REFRESH_INTERVAL: 30000,
  TOAST_DURATION: 4000,
  ANIMATION_DURATION: 300
};
var usersData = [{
  id: 1,
  username: 'admin999',
  role: 'admin',
  status: 'active',
  createdAt: '20/1/2026',
  password: 'password123'
}, {
  id: 2,
  username: 'admin',
  role: 'admin',
  status: 'active',
  createdAt: '4/6/2025',
  password: 'password123'
}];
var filesData = [];
var state = {
  currentTab: 'sessions',
  sidebarCollapsed: false,
  autoRefresh: false,
  autoRefreshTimer: null,
  notificationPanelOpen: false,
  notificationTimer: null,
  customizationTab: 'logo'
};
var utils = {
  formatCurrency: function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },
  formatNumber: function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  },
  copyToClipboard: function () {
    var _copyToClipboard = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(text) {
      var _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return navigator.clipboard.writeText(text);
          case 1:
            return _context.a(2, true);
          case 2:
            _context.p = 2;
            _t = _context.v;
            console.error('Failed to copy:', _t);
            return _context.a(2, false);
        }
      }, _callee, null, [[0, 2]]);
    }));
    function copyToClipboard(_x) {
      return _copyToClipboard.apply(this, arguments);
    }
    return copyToClipboard;
  }(),
  debounce: function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var later = function later() {
        clearTimeout(timeout);
        func.apply(void 0, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};
var toast = {
  ensureStyles: function ensureStyles() {
    if (document.getElementById('admin-toast-modern-style')) return;
    var style = document.createElement('style');
    style.id = 'admin-toast-modern-style';
    style.textContent = "\n            .admin-toast-stack {\n                position: fixed;\n                top: 14px;\n                right: 14px;\n                display: flex;\n                flex-direction: column;\n                gap: 10px;\n                width: min(390px, calc(100vw - 20px));\n                z-index: 9999;\n                pointer-events: none;\n            }\n            .admin-toast-modern {\n                pointer-events: all;\n                position: relative;\n                display: flex;\n                align-items: flex-start;\n                gap: 10px;\n                padding: 10px 12px 12px;\n                border-radius: 14px;\n                border: 1px solid rgba(148,163,184,.32);\n                background: linear-gradient(145deg, rgba(15,23,42,.95), rgba(30,41,59,.96));\n                box-shadow: 0 16px 36px rgba(2,6,23,.45);\n                transform: translate3d(24px,0,0);\n                opacity: 0;\n                transition: transform .2s ease, opacity .2s ease;\n            }\n            .admin-toast-modern.show { transform: translate3d(0,0,0); opacity: 1; }\n            .admin-toast-modern.hide { transform: translate3d(24px,0,0); opacity: 0; }\n            .admin-toast-modern .icon {\n                width: 30px;\n                height: 30px;\n                border-radius: 10px;\n                display: inline-flex;\n                align-items: center;\n                justify-content: center;\n                font-size: 14px;\n                flex-shrink: 0;\n                border: 1px solid rgba(148,163,184,.25);\n                background: rgba(30,41,59,.85);\n            }\n            .admin-toast-modern.success .icon { background: rgba(34,197,94,.16); border-color: rgba(34,197,94,.45); }\n            .admin-toast-modern.error .icon { background: rgba(239,68,68,.16); border-color: rgba(239,68,68,.45); }\n            .admin-toast-modern.warning .icon { background: rgba(245,158,11,.16); border-color: rgba(245,158,11,.45); }\n            .admin-toast-modern .body { min-width: 0; flex: 1; }\n            .admin-toast-modern .title { font-size: 12px; font-weight: 800; color: #f8fafc; }\n            .admin-toast-modern .msg { margin-top: 2px; font-size: 12px; color: #cbd5e1; line-height: 1.35; word-break: break-word; }\n            .admin-toast-modern .close {\n                background: none;\n                border: none;\n                color: #94a3b8;\n                cursor: pointer;\n                font-size: 16px;\n                line-height: 1;\n                padding: 0;\n                margin-top: 1px;\n            }\n            .admin-toast-modern .bar {\n                position: absolute;\n                left: 0;\n                bottom: 0;\n                width: 100%;\n                height: 3px;\n                transform-origin: left center;\n                transform: scaleX(1);\n                background: rgba(59,130,246,.95);\n            }\n            .admin-toast-modern.success .bar { background: rgba(34,197,94,.95); }\n            .admin-toast-modern.error .bar { background: rgba(239,68,68,.95); }\n            .admin-toast-modern.warning .bar { background: rgba(245,158,11,.95); }\n            @media (max-width: 980px) {\n                .admin-toast-stack {\n                    top: auto;\n                    right: 10px;\n                    left: 10px;\n                    bottom: calc(12px + env(safe-area-inset-bottom));\n                    width: auto;\n                }\n                .admin-toast-modern { transform: translate3d(0,16px,0); }\n                .admin-toast-modern.hide { transform: translate3d(0,16px,0); }\n            }\n        ";
    document.head.appendChild(style);
  },
  show: function show(message) {
    var _toastEl$querySelecto;
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
    var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    toast.ensureStyles();
    var container = document.getElementById('toastContainer') || function () {
      var el = document.createElement('div');
      el.id = 'toastContainer';
      el.className = 'admin-toast-stack';
      document.body.appendChild(el);
      return el;
    }();
    var icons = {
      success: '✅',
      error: '⛔',
      warning: '⚠️',
      info: 'ℹ️'
    };
    var titles = {
      success: title || 'Thành công',
      error: title || 'Lỗi',
      warning: title || 'Cảnh báo',
      info: title || 'Thông báo'
    };
    var toastEl = document.createElement('div');
    toastEl.className = "admin-toast-modern ".concat(type);
    toastEl.innerHTML = "\n            <span class=\"icon\">".concat(icons[type] || 'ℹ️', "</span>\n            <div class=\"body\">\n                <div class=\"title\">").concat(titles[type], "</div>\n                <div class=\"msg\">").concat(message, "</div>\n            </div>\n            <button class=\"close\" aria-label=\"\u0110\xF3ng\">\xD7</button>\n            <span class=\"bar\"></span>\n        ");
    container.appendChild(toastEl);
    requestAnimationFrame(function () {
      toastEl.classList.add('show');
      var bar = toastEl.querySelector('.bar');
      if (bar) {
        bar.style.transition = "transform linear ".concat(Math.max(900, CONFIG.TOAST_DURATION), "ms");
        bar.style.transform = 'scaleX(0)';
      }
    });
    (_toastEl$querySelecto = toastEl.querySelector('.close')) === null || _toastEl$querySelecto === void 0 || _toastEl$querySelecto.addEventListener('click', function () {
      toast.remove(toastEl);
    });
    setTimeout(function () {
      toast.remove(toastEl);
    }, CONFIG.TOAST_DURATION);
  },
  remove: function remove(toastEl) {
    if (!toastEl || !toastEl.isConnected) return;
    toastEl.classList.add('hide');
    setTimeout(function () {
      toastEl.remove();
    }, CONFIG.ANIMATION_DURATION);
  },
  success: function success(message, title) {
    return toast.show(message, 'success', title);
  },
  error: function error(message, title) {
    return toast.show(message, 'error', title);
  },
  warning: function warning(message, title) {
    return toast.show(message, 'warning', title);
  },
  info: function info(message, title) {
    return toast.show(message, 'info', title);
  }
};
var sidebar = {
  init: function init() {
    var toggle = document.getElementById('sidebarToggle');
    var mobileToggle = document.getElementById('mobileMenuToggle');
    var sidebarEl = document.getElementById('sidebar');
    toggle === null || toggle === void 0 || toggle.addEventListener('click', function () {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      sidebarEl.classList.toggle('collapsed');
      localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed);
    });
    mobileToggle === null || mobileToggle === void 0 || mobileToggle.addEventListener('click', function () {
      sidebarEl.classList.toggle('active');
    });
    var savedState = localStorage.getItem('sidebarCollapsed') === 'true';
    if (savedState) {
      sidebarEl.classList.add('collapsed');
      state.sidebarCollapsed = true;
    }
  }
};
var navigation = {
  init: function init() {
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var tab = item.dataset.tab;
        if (tab) {
          navigation.switchTab(tab);
        }
      });
    });
  },
  switchTab: function switchTab(tabName) {
    var _document$getElementB;
    state.currentTab = tabName;
    document.querySelectorAll('.nav-item').forEach(function (item) {
      item.classList.remove('active');
      if (item.dataset.tab === tabName) {
        item.classList.add('active');
      }
    });
    document.querySelectorAll('.tab-panel').forEach(function (panel) {
      panel.classList.remove('active');
    });
    var targetPanel = document.getElementById("".concat(tabName, "-panel"));
    var targetTab = document.getElementById("".concat(tabName, "-tab"));
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
    if (targetTab) {
      targetTab.style.display = 'block';
    }
    document.querySelectorAll('.tab-content').forEach(function (tab) {
      tab.style.display = 'none';
    });
    if (targetTab) {
      targetTab.style.display = 'block';
    }
    var breadcrumb = document.querySelector('.breadcrumb-current');
    if (breadcrumb) {
      var labels = {
        sessions: 'Phiên chơi',
        withdrawals: 'Rút tiền',
        gifts: 'Phê duyệt',
        users: 'Người dùng',
        files: 'Quản lý File',
        analytics: 'Thống kê',
        customization: 'Tùy chỉnh',
        tools: 'Công cụ',
        settings: 'Cấu hình'
      };
      breadcrumb.textContent = labels[tabName] || tabName;
    }
    (_document$getElementB = document.getElementById('sidebar')) === null || _document$getElementB === void 0 || _document$getElementB.classList.remove('active');
  }
};
var sessions = {
  isFetching: false,
  init: function init() {
    sessions.fetch();
    filters.initSessionFilters();
  },
  fetch: function (_fetch) {
    function fetch() {
      return _fetch.apply(this, arguments);
    }
    fetch.toString = function () {
      return _fetch.toString();
    };
    return fetch;
  }(function () {
    if (sessions.isFetching) return;
    sessions.isFetching = true;
    sessions.currentPage = 1;
    fetch('/api/sessions').then(function (res) {
      if (!res.ok) {
        console.error("\u26A0\uFE0F [Sessions API] HTTP ".concat(res.status, ": ").concat(res.statusText));
        throw new Error("HTTP ".concat(res.status, ": ").concat(res.statusText));
      }
      // Check content type before parsing as JSON
      var contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return res.json();
      } else {
        return res.text().then(function (text) {
          console.warn("\u26A0\uFE0F [Sessions] Non-JSON response: ".concat(text.substring(0, 100)));
          return {
            success: false,
            data: []
          };
        });
      }
    }).then(function (data) {
      if (data && data.success && Array.isArray(data.data)) {
        sessions.data = data.data;
        console.log("\u2705 [Sessions] Loaded ".concat(data.data.length, " sessions"));
      } else {
        console.warn('⚠️ [Sessions] Invalid response format:', data);
        sessions.data = [];
      }
      sessions.render();
      sessions.initActions();
    }).catch(function (err) {
      console.error('❌ [Sessions] Error fetching sessions:', err.message);
      sessions.data = [];
      sessions.render();
      sessions.initActions();
    }).finally(function () {
      sessions.isFetching = false;
    });
  }),
  data: [],
  currentPage: 1,
  itemsPerPage: 10,
  render: function render() {
    var grid = document.getElementById('sessionsGrid');
    if (!grid) return;
    var totalItems = sessions.data.length;
    var totalPages = Math.ceil(totalItems / sessions.itemsPerPage);
    var startIndex = (sessions.currentPage - 1) * sessions.itemsPerPage;
    var endIndex = Math.min(startIndex + sessions.itemsPerPage, totalItems);
    var pageItems = sessions.data.slice(startIndex, endIndex);
    grid.innerHTML = pageItems.map(function (session) {
      var code = session.session_code || session.code || 'N/A';
      var createdAt = session.createdAt || new Date().toLocaleString('vi-VN');
      var status = session.is_active ? 'active' : 'inactive';
      var statusText = session.is_active ? 'Hoạt động' : 'Không hoạt động';
      var prize1 = session.prize_1 || 'Phần thưởng 1';
      var prize1Desc = session.prize_1_description || '';
      var prize1Price = session.prize_1 || '0đ';
      var prize1Icon = session.prize_1_icon || '🎁';
      var prize1Status = session.prize_1_status || 'NORMAL';
      var prize2 = session.prize_2 || 'Phần thưởng 2';
      var prize2Desc = session.prize_2_description || '';
      var prize2Price = session.prize_2 || '0đ';
      var prize2Icon = session.prize_2_icon || '🎁';
      var prize2Status = session.prize_2_status || 'NORMAL';
      var prize3 = session.prize_3 || 'Phần thưởng 3';
      var prize3Desc = session.prize_3_description || '';
      var prize3Price = session.prize_3 || '0đ';
      var prize3Icon = session.prize_3_icon || '🎁';
      var prize3Status = session.prize_3_status || 'NORMAL';
      var getPrizeIcon = function getPrizeIcon(status) {
        if (status === 'VIP') return '<i class="fas fa-crown"></i>';
        return '';
      };
      return "\n            <div class=\"session-card\" data-code=\"".concat(code, "\" data-session-code=\"").concat(code, "\" data-session-owner=\"admin\" data-session-account=\"").concat(code, "\" data-session-date=\"").concat(createdAt, "\">\n                <div class=\"session-card-header\">\n                    <div class=\"session-code-section\">\n                        <div class=\"session-code-title\">\n                            <h3>").concat(code, "</h3>\n                            <button class=\"btn-copy-session\" data-code=\"").concat(code, "\" title=\"Sao ch\xE9p m\xE3\">\n                                <i class=\"fas fa-copy\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <div class=\"session-info-right\">\n                        <div class=\"session-time\">\n                            <i class=\"fas fa-calendar\"></i>\n                            <span>").concat(createdAt, "</span>\n                        </div>\n                        <div class=\"session-stat\">\n                            <div class=\"stat-badge\">100/100</div>\n                            <button class=\"btn-edit-stat\" title=\"Ch\u1EC9nh s\u1EEDa\">\n                                <i class=\"fas fa-pen\"></i>\n                            </button>\n                        </div>\n                        <div class=\"session-user\">\n                            <i class=\"fas fa-user\"></i>\n                            <span>admin</span>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"session-card-status\">\n                    <span class=\"status-tag ").concat(status, " session-status\">").concat(statusText, "</span>\n                    <button class=\"action-btn ").concat(session.require_withdrawal === false ? 'success' : 'warning', "\" data-action=\"toggle-withdrawal\" data-code=\"").concat(code, "\" title=\"").concat(session.require_withdrawal === false ? 'Không yêu cầu rút tiền' : 'Yêu cầu rút tiền', "\" style=\"width:auto;padding:0 8px;gap:4px;font-size:11px;\">\n                        <i class=\"fas fa-").concat(session.require_withdrawal === false ? 'unlock' : 'lock', "\"></i>\n                        ").concat(session.require_withdrawal === false ? 'Tự do mở hộp' : 'Bắt rút tiền', "\n                    </button>\n                    ").concat(session.player_selected_box ? "\n                        <span class=\"status-badge selected\">\n                            \u2705 H\u1ED9p #".concat(session.player_selected_box, "\n                        </span>\n                        <span class=\"status-timestamp\">").concat(new Date(session.player_selected_at).toLocaleTimeString('vi-VN'), "</span>\n                    ") : '', "\n                    ").concat(session.player_name ? "\n                        <span class=\"player-name\">\uD83D\uDC64 ".concat(session.player_name, "</span>\n                    ") : '', "\n                </div>\n\n                <div class=\"session-card-body\">\n                    <div class=\"progress-section\">\n                        <div class=\"progress-header\">\n                            <span class=\"progress-label\">Ti\u1EBFn \u0111\u1ED9 m\u1EDF h\u1ED9p</span>\n                            <span class=\"progress-value\">3/3</span>\n                        </div>\n                        <div class=\"progress-bar-container\">\n                            <div class=\"progress-bar-bg\">\n                                <div class=\"progress-bar-fill\" style=\"width: 100%\"></div>\n                            </div>\n                        </div>\n                        <div class=\"progress-stats\">\n                            <span>\uD83D\uDCCA 1 ng\u01B0\u1EDDi ch\u01A1i</span>\n                            <span>\uD83C\uDF81 0 ho\xE0n th\xE0nh</span>\n                        </div>\n                    </div>\n\n                    <div class=\"prizes-grid\">\n                        <div class=\"prize-item\">\n                            <div class=\"prize-number\">1</div>\n                            <div class=\"prize-icon\">").concat(prize1Icon, "</div>\n                            ").concat(prize1Status === 'VIP' ? '<div class="prize-crown"><i class="fas fa-crown"></i></div>' : '', "\n                            <div class=\"prize-name\">").concat(prize1, "</div>\n                            <div class=\"prize-price\">\n                                <span class=\"price-value\">").concat(prize1Price, "</span>\n                                <button class=\"btn-mini-edit\" title=\"S\u1EEDa\">\n                                    <i class=\"fas fa-pen\"></i>\n                                </button>\n                            </div>\n                            ").concat(session.player_selected_box === 1 ? '<div class="prize-status">✅ Đã mở</div>' : '', "\n                        </div>\n\n                        <div class=\"prize-item\">\n                            <div class=\"prize-number\">2</div>\n                            <div class=\"prize-icon\">").concat(prize2Icon, "</div>\n                            ").concat(prize2Status === 'VIP' ? '<div class="prize-crown"><i class="fas fa-crown"></i></div>' : '', "\n                            <div class=\"prize-name\">").concat(prize2, "</div>\n                            <div class=\"prize-price\">\n                                <button class=\"btn-mini-edit\" title=\"S\u1EEDa\">\n                                    <i class=\"fas fa-dollar-sign\"></i>\n                                </button>\n                            </div>\n                            ").concat(session.player_selected_box === 2 ? '<div class="prize-status">✅ Đã mở</div>' : '', "\n                        </div>\n\n                        <div class=\"prize-item\">\n                            <div class=\"prize-number\">3</div>\n                            <div class=\"prize-icon\">").concat(prize3Icon, "</div>\n                            ").concat(prize3Status === 'VIP' ? '<div class="prize-crown"><i class="fas fa-crown"></i></div>' : '', "\n                            <div class=\"prize-name\">").concat(prize3, "</div>\n                            <div class=\"prize-price\">\n                                <span class=\"price-value\">").concat(prize3Price, "</span>\n                                <button class=\"btn-mini-edit\" title=\"S\u1EEDa\">\n                                    <i class=\"fas fa-pen\"></i>\n                                </button>\n                            </div>\n                            ").concat(session.player_selected_box === 3 ? '<div class="prize-status">✅ Đã mở</div>' : '', "\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"session-card-footer\">\n                    <button class=\"action-btn primary\" data-action=\"link\" data-code=\"").concat(code, "\">\n                        <i class=\"fas fa-link\"></i>\n                        Copy Link\n                    </button>\n                    <button class=\"action-btn\" data-action=\"view\" data-code=\"").concat(code, "\">\n                        <i class=\"fas fa-eye\"></i>\n                    </button>\n                    <button class=\"action-btn\" data-action=\"clone\" data-code=\"").concat(code, "\" title=\"Clone phi\xEAn\" style=\"width:auto;padding:0 10px;gap:6px;\">\n                        <i class=\"fas fa-copy\"></i>\n                        Clone\n                    </button>\n                    <button class=\"action-btn\" data-action=\"edit\" data-code=\"").concat(code, "\">\n                        <i class=\"fas fa-pen\"></i>\n                    </button>\n                    <button class=\"action-btn warning\" data-action=\"pause\" data-code=\"").concat(code, "\">\n                        <i class=\"fas fa-pause\"></i>\n                    </button>\n                    <button class=\"action-btn danger\" data-action=\"delete\" data-code=\"").concat(code, "\">\n                        <i class=\"fas fa-trash\"></i>\n                    </button>\n                </div>\n            </div>\n        ");
    }).join('');
    grid.querySelectorAll('.btn-copy-session').forEach(function (btn) {
      btn.addEventListener('click', /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(e) {
          var code, success;
          return _regenerator().w(function (_context2) {
            while (1) switch (_context2.n) {
              case 0:
                e.stopPropagation();
                code = btn.dataset.code;
                _context2.n = 1;
                return utils.copyToClipboard(code);
              case 1:
                success = _context2.v;
                if (success) {
                  btn.innerHTML = '<i class="fas fa-check"></i>';
                  btn.style.color = 'var(--success)';
                  toast.success("\u0110\xE3 sao ch\xE9p m\xE3: ".concat(code));
                  setTimeout(function () {
                    btn.innerHTML = '<i class="fas fa-copy"></i>';
                    btn.style.color = '';
                  }, 2000);
                } else {
                  toast.error('Không thể sao chép');
                }
              case 2:
                return _context2.a(2);
            }
          }, _callee2);
        }));
        return function (_x2) {
          return _ref.apply(this, arguments);
        };
      }());
    });
    sessions.renderPagination();
    setTimeout(function () {
      filters.applySessionFilters();
    }, 0);
  },
  renderPagination: function renderPagination() {
    var totalItems = sessions.data.length;
    var totalPages = Math.ceil(totalItems / sessions.itemsPerPage);
    var startIndex = (sessions.currentPage - 1) * sessions.itemsPerPage;
    var endIndex = Math.min(startIndex + sessions.itemsPerPage, totalItems);
    var paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
      paginationInfo.innerHTML = "Hi\u1EC3n th\u1ECB <strong>".concat(startIndex + 1, "-").concat(endIndex, "</strong> trong t\u1ED5ng s\u1ED1 <strong>").concat(totalItems, "</strong> phi\xEAn");
    }
    var paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    var prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = sessions.currentPage === 1;
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.addEventListener('click', function () {
      if (sessions.currentPage > 1) {
        sessions.currentPage--;
        sessions.render();
      }
    });
    paginationContainer.appendChild(prevBtn);
    var _loop = function _loop(i) {
      var pageBtn = document.createElement('button');
      pageBtn.className = "pagination-btn ".concat(i === sessions.currentPage ? 'active' : '');
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', function () {
        sessions.currentPage = i;
        sessions.render();
      });
      paginationContainer.appendChild(pageBtn);
    };
    for (var i = 1; i <= totalPages; i++) {
      _loop(i);
    }
    var nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = sessions.currentPage === totalPages || totalPages === 0;
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.addEventListener('click', function () {
      if (sessions.currentPage < totalPages) {
        sessions.currentPage++;
        sessions.render();
      }
    });
    paginationContainer.appendChild(nextBtn);
  },
  buildSessionPlayLink: function buildSessionPlayLink(code) {
    var rawCode = String(code || '').trim();
    if (!rawCode) return '';
    var pathname = String(window.location.pathname || '/');
    var adminIndex = pathname.indexOf('/admin');
    var basePrefix = adminIndex >= 0 ? pathname.slice(0, adminIndex) : '';
    var basePath = "".concat(basePrefix || '', "/").replace(/\/+/g, '/');
    return "".concat(window.location.origin).concat(basePath, "?code=").concat(encodeURIComponent(rawCode));
  },
  initActions: function initActions() {
    var grid = document.getElementById('sessionsGrid');
    if (!grid) return;
    grid.addEventListener('click', function (e) {
      var actionBtn = e.target.closest('.action-btn');
      if (!actionBtn) return;
      var action = actionBtn.dataset.action;
      var code = actionBtn.dataset.code;
      if (!code) return;
      switch (action) {
        case 'link':
          var link = sessions.buildSessionPlayLink(code);
          utils.copyToClipboard(link).then(function (success) {
            if (success) {
              toast.success("\u0110\xE3 sao ch\xE9p link: ".concat(link));
            } else {
              toast.error('Không thể sao chép link');
            }
          });
          break;
        case 'view':
          modal.openPreview(code);
          break;
        case 'clone':
          modal.cloneSession(code);
          break;
        case 'edit':
          modal.openEdit(code);
          break;
        case 'pause':
          sessions.toggleStatus(code);
          break;
        case 'toggle-withdrawal':
          sessions.toggleWithdrawal(code);
          break;
        case 'delete':
          modal.deleteSession(code);
          break;
      }
    });
  },
  toggleWithdrawal: function () {
    var _toggleWithdrawal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(code) {
      var session, newVal, response, updated, index, _t2;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            session = sessions.data.find(function (s) {
              return s.session_code === code || s.code === code;
            });
            if (session) {
              _context3.n = 1;
              break;
            }
            toast.error('Không tìm thấy phiên');
            return _context3.a(2);
          case 1:
            newVal = !(session.require_withdrawal !== false);
            _context3.p = 2;
            _context3.n = 3;
            return fetch("/api/sessions/".concat(code), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                require_withdrawal: newVal
              })
            });
          case 3:
            response = _context3.v;
            if (!response.ok) {
              _context3.n = 5;
              break;
            }
            _context3.n = 4;
            return response.json();
          case 4:
            updated = _context3.v;
            index = sessions.data.findIndex(function (s) {
              return s.session_code === code || s.code === code;
            });
            if (index !== -1) {
              sessions.data[index] = updated.data || updated;
              sessions.render();
              sessions.initActions();
              toast.success(newVal ? 'Đã bật: Yêu cầu rút tiền trước khi mở hộp tiếp theo' : 'Đã tắt: Không cần rút tiền để mở hộp tiếp theo');
            }
            _context3.n = 6;
            break;
          case 5:
            toast.error('Không thể cập nhật phiên');
          case 6:
            _context3.n = 8;
            break;
          case 7:
            _context3.p = 7;
            _t2 = _context3.v;
            console.error('Toggle withdrawal error:', _t2);
            toast.error('Lỗi: ' + _t2.message);
          case 8:
            return _context3.a(2);
        }
      }, _callee3, null, [[2, 7]]);
    }));
    function toggleWithdrawal(_x3) {
      return _toggleWithdrawal.apply(this, arguments);
    }
    return toggleWithdrawal;
  }(),
  toggleStatus: function () {
    var _toggleStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(code) {
      var session, response, updated, index, _updated$data, _t3;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            session = sessions.data.find(function (s) {
              return s.session_code === code || s.code === code;
            });
            if (session) {
              _context4.n = 1;
              break;
            }
            toast.error('Không tìm thấy phiên');
            return _context4.a(2);
          case 1:
            _context4.p = 1;
            _context4.n = 2;
            return fetch("/api/sessions/".concat(code), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                is_active: !session.is_active
              })
            });
          case 2:
            response = _context4.v;
            if (!response.ok) {
              _context4.n = 4;
              break;
            }
            _context4.n = 3;
            return response.json();
          case 3:
            updated = _context4.v;
            index = sessions.data.findIndex(function (s) {
              return s.session_code === code || s.code === code;
            });
            if (index !== -1) {
              sessions.data[index] = updated.data || updated;
              sessions.render();
              sessions.initActions();
              toast.success((_updated$data = updated.data) !== null && _updated$data !== void 0 && _updated$data.is_active ? 'Đã kích hoạt phiên' : 'Đã tạm dừng phiên');
            }
            _context4.n = 5;
            break;
          case 4:
            toast.error('Không thể cập nhật phiên');
          case 5:
            _context4.n = 7;
            break;
          case 6:
            _context4.p = 6;
            _t3 = _context4.v;
            console.error('Toggle status error:', _t3);
            toast.error('Lỗi: ' + _t3.message);
          case 7:
            return _context4.a(2);
        }
      }, _callee4, null, [[1, 6]]);
    }));
    function toggleStatus(_x4) {
      return _toggleStatus.apply(this, arguments);
    }
    return toggleStatus;
  }(),
  delete: function _delete(id) {
    var session = sessions.data.find(function (s) {
      return s.id === id;
    });
    if (session) {
      var card = document.querySelector("[data-id=\"".concat(id, "\"]"));
      if (card) {
        card.style.animation = 'fadeOut 0.5s ease';
        setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
          var response, result, _t4;
          return _regenerator().w(function (_context5) {
            while (1) switch (_context5.p = _context5.n) {
              case 0:
                _context5.p = 0;
                _context5.n = 1;
                return fetch("/api/sessions/".concat(session.session_code), {
                  method: 'DELETE'
                });
              case 1:
                response = _context5.v;
                _context5.n = 2;
                return response.json();
              case 2:
                result = _context5.v;
                if (result.success) {
                  sessions.data = sessions.data.filter(function (s) {
                    return s.id !== id;
                  });
                  sessions.render();
                  toast.success("\u0110\xE3 x\xF3a phi\xEAn: ".concat(session.session_code));
                } else {
                  toast.error('Lỗi: ' + (result.message || 'Không thể xóa phiên'));
                }
                _context5.n = 4;
                break;
              case 3:
                _context5.p = 3;
                _t4 = _context5.v;
                console.error('Delete error:', _t4);
                toast.error('Lỗi: ' + _t4.message);
              case 4:
                return _context5.a(2);
            }
          }, _callee5, null, [[0, 3]]);
        })), 500);
      }
    }
  }
};
var users = {
  init: function init() {
    users.render();
    users.initActions();
  },
  render: function render() {
    var grid = document.getElementById('usersGrid');
    if (!grid) return;
    grid.innerHTML = usersData.map(function (user) {
      return "\n            <div class=\"user-card\" data-id=\"".concat(user.id, "\">\n                <div class=\"user-header\">\n                    <div class=\"user-info-header\">\n                        <span class=\"username\">").concat(user.username, "</span>\n                        <span class=\"user-role-badge\">\n                            <i class=\"fas fa-crown\"></i>\n                            ").concat(user.role === 'admin' ? 'Admin' : 'User', "\n                        </span>\n                    </div>\n                    <span class=\"user-status\">").concat(user.status === 'active' ? 'Hoạt động' : 'Khóa', "</span>\n                </div>\n                <div class=\"user-date\">T\u1EA1o: ").concat(user.createdAt, "</div>\n                <div class=\"password-field\">\n                    <label>M\u1EADt kh\u1EA9u:</label>\n                    <div class=\"password-input-wrapper\">\n                        <input type=\"password\" class=\"password-input\" value=\"").concat(user.password, "\" readonly>\n                        <button class=\"password-toggle\">\n                            <i class=\"fas fa-eye\"></i>\n                        </button>\n                    </div>\n                </div>\n                ").concat(user.id !== 1 ? "\n                <div class=\"user-actions\">\n                    <button class=\"user-action-btn change-password\" data-action=\"password\" data-id=\"".concat(user.id, "\">\n                        <i class=\"fas fa-key\"></i>\n                        \u0110\u1ED5i m\u1EADt kh\u1EA9u\n                    </button>\n                    <button class=\"user-action-btn lock\" data-action=\"lock\" data-id=\"").concat(user.id, "\">\n                        <i class=\"fas fa-lock\"></i>\n                        Kh\xF3a\n                    </button>\n                    <button class=\"user-action-btn delete\" data-action=\"delete\" data-id=\"").concat(user.id, "\">\n                        <i class=\"fas fa-trash\"></i>\n                        X\xF3a\n                    </button>\n                </div>\n                ") : '', "\n            </div>\n        ");
    }).join('');
    grid.querySelectorAll('.password-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = btn.previousElementSibling;
        var icon = btn.querySelector('i');
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    });
  },
  initActions: function initActions() {
    var grid = document.getElementById('usersGrid');
    if (!grid) return;
    grid.addEventListener('click', function (e) {
      var actionBtn = e.target.closest('.user-action-btn');
      if (!actionBtn) return;
      var action = actionBtn.dataset.action;
      var id = parseInt(actionBtn.dataset.id);
      var user = usersData.find(function (u) {
        return u.id === id;
      });
      if (!user) return;
      switch (action) {
        case 'password':
          toast.info("\u0110\u1ED5i m\u1EADt kh\u1EA9u cho: ".concat(user.username));
          break;
        case 'lock':
          toast.warning("Kh\xF3a t\xE0i kho\u1EA3n: ".concat(user.username));
          break;
        case 'delete':
          NotificationModal.confirm('Xác nhận', "B\u1EA1n c\xF3 ch\u1EAFc mu\u1ED1n x\xF3a ng\u01B0\u1EDDi d\xF9ng ".concat(user.username, "?"), function () {
            toast.success("\u0110\xE3 x\xF3a ng\u01B0\u1EDDi d\xF9ng: ".concat(user.username));
          });
          break;
      }
    });
  }
};
var files = {
  data: [],
  isFetching: false,
  init: function init() {
    console.log('🔵 files.init() called');
    files.fetch().then(function () {
      console.log('🔵 files.fetch() completed');
    });
    files.setupListeners();
  },
  fetch: function (_fetch2) {
    function fetch() {
      return _fetch2.apply(this, arguments);
    }
    fetch.toString = function () {
      return _fetch2.toString();
    };
    return fetch;
  }(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var response, result, _t5;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          if (!files.isFetching) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2);
        case 1:
          files.isFetching = true;
          console.log('🔵 files.fetch() called');
          _context6.p = 2;
          _context6.n = 3;
          return fetch('/api/files');
        case 3:
          response = _context6.v;
          _context6.n = 4;
          return response.json();
        case 4:
          result = _context6.v;
          console.log('🔵 files.fetch() response:', result);
          if (result.success) {
            files.data = result.data || [];
            files.stats = result.stats || {};
            console.log("\uD83D\uDD35 files.data set to ".concat(files.data.length, " items"));
            files.render();
            files.updateStats();
          } else {
            console.error('❌ files.fetch() failed:', result.message);
          }
          _context6.n = 6;
          break;
        case 5:
          _context6.p = 5;
          _t5 = _context6.v;
          console.error('Error fetching files:', _t5);
          files.data = [];
          files.render();
        case 6:
          _context6.p = 6;
          files.isFetching = false;
          return _context6.f(6);
        case 7:
          return _context6.a(2);
      }
    }, _callee6, null, [[2, 5, 6, 7]]);
  }))),
  render: function render() {
    var grid = document.getElementById('filesGrid');
    if (!grid) {
      console.log('❌ filesGrid element NOT found');
      return;
    }
    console.log("\uD83D\uDD35 files.render() - rendering ".concat(files.data.length, " files"));
    if (files.data.length === 0) {
      grid.innerHTML = "\n                <div class=\"empty-state\">\n                    <i class=\"fas fa-folder-open\"></i>\n                    <h3>Ch\u01B0a c\xF3 t\u1EC7p tin</h3>\n                    <p>T\u1EA3i l\xEAn t\u1EC7p tin \u0111\u1EA7u ti\xEAn b\u1EB1ng n\xFAt \"T\u1EA3i l\xEAn t\u1EC7p\"</p>\n                </div>\n            ";
      return;
    }
    grid.innerHTML = files.data.map(function (file) {
      return "\n            <div class=\"file-card\" data-id=\"".concat(file.id, "\" data-name=\"").concat(file.name, "\">\n                ").concat(file.isImage ? "\n                    <div class=\"file-preview-img\">\n                        <img src=\"".concat(file.url, "\" alt=\"").concat(file.name, "\" onerror=\"this.src='/images/file-placeholder.png'\">\n                    </div>\n                ") : "\n                    <div class=\"file-preview-icon\">\n                        <i class=\"fas fa-file\"></i>\n                    </div>\n                ", "\n                <div class=\"file-info\">\n                    <div class=\"file-name\" title=\"").concat(file.name, "\">").concat(file.name, "</div>\n                    <div class=\"file-meta\">\n                        <span><i class=\"fas fa-weight\"></i> ").concat(file.size, "</span>\n                        <span><i class=\"fas fa-tag\"></i> ").concat(file.type, "</span>\n                        <span><i class=\"fas fa-calendar\"></i> ").concat(file.uploadedAt, "</span>\n                    </div>\n                </div>\n                <div class=\"file-actions\">\n                    <button class=\"action-btn\" data-action=\"view\" title=\"Xem\">\n                        <i class=\"fas fa-eye\"></i>\n                    </button>\n                    <button class=\"action-btn\" data-action=\"download\" title=\"T\u1EA3i v\u1EC1\">\n                        <i class=\"fas fa-download\"></i>\n                    </button>\n                    <button class=\"action-btn danger\" data-action=\"delete\" title=\"X\xF3a\">\n                        <i class=\"fas fa-trash\"></i>\n                    </button>\n                </div>\n            </div>\n        ");
    }).join('');
  },
  updateStats: function updateStats() {
    var stats = files.stats;
    document.querySelectorAll('#files-panel .stat-value').forEach(function (el, idx) {
      if (idx === 0) el.textContent = stats.totalFiles || 0;
      if (idx === 1) el.textContent = stats.totalImages || 0;
      if (idx === 2) el.textContent = stats.totalSizeFormatted || '0 B';
    });
  },
  setupListeners: function setupListeners() {
    // Upload button
    var uploadBtn = document.getElementById('uploadFileBtn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', files.openUploadDialog);
    }

    // File actions (delegation)
    var grid = document.getElementById('filesGrid');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var btn = e.target.closest('.action-btn');
        if (!btn) return;
        var card = btn.closest('.file-card');
        var action = btn.dataset.action;
        var fileName = card.dataset.name;
        console.log('File action:', action, fileName);
        if (action === 'view') files.viewFile(fileName);
        if (action === 'download') files.downloadFile(fileName);
        if (action === 'delete') files.deleteFile(fileName, card);
      });
    }
  },
  openUploadDialog: function openUploadDialog() {
    var input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = function (e) {
      var selectedFiles = e.target.files;
      files.uploadFiles(selectedFiles);
    };
    input.click();
  },
  uploadFiles: function () {
    var _uploadFiles = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(fileList) {
      var _iterator, _step, file, formData, response, result, _t6, _t7;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            _iterator = _createForOfIteratorHelper(fileList);
            _context7.p = 1;
            _iterator.s();
          case 2:
            if ((_step = _iterator.n()).done) {
              _context7.n = 8;
              break;
            }
            file = _step.value;
            _context7.p = 3;
            formData = new FormData();
            formData.append('file', file);
            _context7.n = 4;
            return fetch('/api/files', {
              method: 'POST',
              body: formData
            });
          case 4:
            response = _context7.v;
            _context7.n = 5;
            return response.json();
          case 5:
            result = _context7.v;
            if (result.success) {
              toast.success("T\u1EC7p ".concat(file.name, " \u0111\xE3 t\u1EA3i l\xEAn"));
            } else {
              toast.error("L\u1ED7i t\u1EA3i ".concat(file.name, ": ").concat(result.message));
            }
            _context7.n = 7;
            break;
          case 6:
            _context7.p = 6;
            _t6 = _context7.v;
            console.error('Upload error:', _t6);
            toast.error("L\u1ED7i t\u1EA3i ".concat(file.name));
          case 7:
            _context7.n = 2;
            break;
          case 8:
            _context7.n = 10;
            break;
          case 9:
            _context7.p = 9;
            _t7 = _context7.v;
            _iterator.e(_t7);
          case 10:
            _context7.p = 10;
            _iterator.f();
            return _context7.f(10);
          case 11:
            // Refresh list
            setTimeout(function () {
              return files.fetch();
            }, 1000);
          case 12:
            return _context7.a(2);
        }
      }, _callee7, null, [[3, 6], [1, 9, 10, 11]]);
    }));
    function uploadFiles(_x5) {
      return _uploadFiles.apply(this, arguments);
    }
    return uploadFiles;
  }(),
  viewFile: function viewFile(fileName) {
    var file = files.data.find(function (f) {
      return f.name === fileName;
    });
    if (!file) return;
    var modal = document.createElement('div');
    modal.className = 'modal-overlay show';
    modal.innerHTML = "\n            <div class=\"modal-content\">\n                <button class=\"modal-close\" onclick=\"this.closest('.modal-overlay').remove()\">\n                    <i class=\"fas fa-times\"></i>\n                </button>\n                <div class=\"modal-body\">\n                    ".concat(file.isImage ? "\n                        <img src=\"".concat(file.url, "\" alt=\"").concat(file.name, "\" style=\"max-width: 100%; max-height: 80vh; border-radius: 8px;\">\n                    ") : "\n                        <div style=\"text-align: center; padding: 40px;\">\n                            <i class=\"fas fa-file\" style=\"font-size: 60px; margin-bottom: 20px; color: var(--text-secondary);\"></i>\n                            <p style=\"margin: 10px 0; color: var(--text-primary);\">Lo\u1EA1i: ".concat(file.type, "</p>\n                            <p style=\"margin: 10px 0; color: var(--text-secondary);\">Dung l\u01B0\u1EE3ng: ").concat(file.size, "</p>\n                            <a href=\"").concat(file.url, "\" class=\"btn btn-primary\" download style=\"margin-top: 20px;\">\n                                <i class=\"fas fa-download\"></i> T\u1EA3i v\u1EC1\n                            </a>\n                        </div>\n                    "), "\n                </div>\n            </div>\n        ");

    // Append to content-area instead of body
    var contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.appendChild(modal);
    } else {
      document.body.appendChild(modal);
    }
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.remove();
    });
  },
  downloadFile: function downloadFile(fileName) {
    var file = files.data.find(function (f) {
      return f.name === fileName;
    });
    if (!file) return;
    var link = document.createElement('a');
    link.href = file.url;
    link.download = fileName;
    link.click();
  },
  deleteFile: function () {
    var _deleteFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(fileName, card) {
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            NotificationModal.confirm('Xác nhận xóa', "X\xE1c nh\u1EADn x\xF3a t\u1EC7p: ".concat(fileName, "?"), /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
              var response, result, _t8;
              return _regenerator().w(function (_context8) {
                while (1) switch (_context8.p = _context8.n) {
                  case 0:
                    _context8.p = 0;
                    _context8.n = 1;
                    return fetch("/api/files/".concat(encodeURIComponent(fileName)), {
                      method: 'DELETE'
                    });
                  case 1:
                    response = _context8.v;
                    _context8.n = 2;
                    return response.json();
                  case 2:
                    result = _context8.v;
                    if (result.success) {
                      toast.success('Tệp đã xóa');
                      card.remove();
                      files.fetch(); // Refresh stats
                    } else {
                      toast.error('Xóa tệp thất bại');
                    }
                    _context8.n = 4;
                    break;
                  case 3:
                    _context8.p = 3;
                    _t8 = _context8.v;
                    console.error('Delete error:', _t8);
                    toast.error('Lỗi xóa tệp');
                  case 4:
                    return _context8.a(2);
                }
              }, _callee8, null, [[0, 3]]);
            })));
          case 1:
            return _context9.a(2);
        }
      }, _callee9);
    }));
    function deleteFile(_x6, _x7) {
      return _deleteFile.apply(this, arguments);
    }
    return deleteFile;
  }()
};

// ==================== CUSTOMIZATION ====================
var customization = {
  data: {
    content: {
      mainTitle: 'Manh Lam Store',
      mainDescription: 'Tham gia chơi game nhận quà tặng hấp dẫn',
      bannerText: '',
      bannerVisible: false,
      footerText: '© 2024 - Manh Lam Store. All rights reserved.'
    },
    features: {
      history: true,
      chat: true,
      twoFA: false,
      withdraw: true,
      gifts: true
    },
    scripts: {
      css: '',
      js: ''
    }
  },
  init: function init() {
    var _document$getElementB2, _document$getElementB3, _document$getElementB4, _document$getElementB5, _document$getElementB6, _document$getElementB7;
    var tabs = document.querySelectorAll('.custom-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetTab = tab.dataset.custom;
        customization.switchTab(targetTab);
      });
    });

    // Logo height slider
    var slider = document.getElementById('logoHeightSlider');
    var valueDisplay = document.getElementById('logoHeightValue');
    if (slider && valueDisplay) {
      slider.addEventListener('input', function (e) {
        valueDisplay.textContent = e.target.value + 'px';
      });
    }

    // Content tab listeners
    (_document$getElementB2 = document.getElementById('saveContentBtn')) === null || _document$getElementB2 === void 0 || _document$getElementB2.addEventListener('click', function () {
      return customization.saveContent();
    });
    (_document$getElementB3 = document.getElementById('resetContentBtn')) === null || _document$getElementB3 === void 0 || _document$getElementB3.addEventListener('click', function () {
      return customization.resetContent();
    });

    // Features tab listeners
    (_document$getElementB4 = document.getElementById('saveFeaturesBtn')) === null || _document$getElementB4 === void 0 || _document$getElementB4.addEventListener('click', function () {
      return customization.saveFeatures();
    });

    // Scripts tab listeners
    (_document$getElementB5 = document.getElementById('saveScriptsBtn')) === null || _document$getElementB5 === void 0 || _document$getElementB5.addEventListener('click', function () {
      return customization.saveScripts();
    });
    (_document$getElementB6 = document.getElementById('testScriptsBtn')) === null || _document$getElementB6 === void 0 || _document$getElementB6.addEventListener('click', function () {
      return customization.testScripts();
    });
    (_document$getElementB7 = document.getElementById('clearScriptsBtn')) === null || _document$getElementB7 === void 0 || _document$getElementB7.addEventListener('click', function () {
      return customization.clearScripts();
    });

    // Load saved settings
    customization.loadSettings();
  },
  switchTab: function switchTab(tabName) {
    state.customizationTab = tabName;

    // Update tabs
    document.querySelectorAll('.custom-tab').forEach(function (tab) {
      tab.classList.remove('active');
      if (tab.dataset.custom === tabName) {
        tab.classList.add('active');
      }
    });

    // Update content
    document.querySelectorAll('.custom-content').forEach(function (content) {
      content.classList.remove('active');
    });
    var targetContent = document.getElementById("".concat(tabName, "-content"));
    if (targetContent) {
      targetContent.classList.add('active');
    }
  },
  loadSettings: function () {
    var _loadSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
      var response, result, settings, _t9;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.p = _context0.n) {
          case 0:
            _context0.p = 0;
            _context0.n = 1;
            return fetch('/api/settings');
          case 1:
            response = _context0.v;
            if (response.ok) {
              _context0.n = 2;
              break;
            }
            return _context0.a(2);
          case 2:
            _context0.n = 3;
            return response.json();
          case 3:
            result = _context0.v;
            if (!(!result.success || !result.data)) {
              _context0.n = 4;
              break;
            }
            return _context0.a(2);
          case 4:
            settings = result.data; // Load content
            if (settings.content) {
              document.getElementById('mainTitle').value = settings.content.mainTitle || '';
              document.getElementById('mainDescription').value = settings.content.mainDescription || '';
              document.getElementById('bannerText').value = settings.content.bannerText || '';
              document.getElementById('bannerVisible').checked = settings.content.bannerVisible || false;
              document.getElementById('footerText').value = settings.content.footerText || '';
            }

            // Load features
            if (settings.features) {
              document.getElementById('featureHistory').checked = settings.features.history !== false;
              document.getElementById('featureChat').checked = settings.features.chat !== false;
              document.getElementById('feature2FA').checked = settings.features.twoFA === true;
              document.getElementById('featureWithdraw').checked = settings.features.withdraw !== false;
              document.getElementById('featureGifts').checked = settings.features.gifts !== false;
            }

            // Load scripts
            if (settings.scripts) {
              document.getElementById('customCSS').value = settings.scripts.css || '';
              document.getElementById('customJS').value = settings.scripts.js || '';
            }
            _context0.n = 6;
            break;
          case 5:
            _context0.p = 5;
            _t9 = _context0.v;
            console.error('Failed to load settings:', _t9);
          case 6:
            return _context0.a(2);
        }
      }, _callee0, null, [[0, 5]]);
    }));
    function loadSettings() {
      return _loadSettings.apply(this, arguments);
    }
    return loadSettings;
  }(),
  saveContent: function saveContent() {
    var content = {
      mainTitle: document.getElementById('mainTitle').value,
      mainDescription: document.getElementById('mainDescription').value,
      bannerText: document.getElementById('bannerText').value,
      bannerVisible: document.getElementById('bannerVisible').checked,
      footerText: document.getElementById('footerText').value
    };
    customization.data.content = content;
    customization.saveToServer({
      content: content
    });
  },
  resetContent: function resetContent() {
    NotificationModal.confirm('Xác nhận', 'Bạn có chắc muốn khôi phục nội dung mặc định?', function () {
      customization.data.content = {
        mainTitle: 'Manh Lam Store',
        mainDescription: 'Tham gia chơi game nhận quà tặng hấp dẫn',
        bannerText: '',
        bannerVisible: false,
        footerText: '© 2024 - Manh Lam Store. All rights reserved.'
      };
      document.getElementById('mainTitle').value = customization.data.content.mainTitle;
      document.getElementById('mainDescription').value = customization.data.content.mainDescription;
      document.getElementById('bannerText').value = customization.data.content.bannerText;
      document.getElementById('bannerVisible').checked = customization.data.content.bannerVisible;
      document.getElementById('footerText').value = customization.data.content.footerText;
      customization.saveToServer({
        content: customization.data.content
      });
      toast.success('Đã khôi phục nội dung mặc định');
    });
  },
  saveFeatures: function saveFeatures() {
    var features = {
      history: document.getElementById('featureHistory').checked,
      chat: document.getElementById('featureChat').checked,
      twoFA: document.getElementById('feature2FA').checked,
      withdraw: document.getElementById('featureWithdraw').checked,
      gifts: document.getElementById('featureGifts').checked
    };
    customization.data.features = features;
    customization.saveToServer({
      features: features
    });
  },
  saveScripts: function saveScripts() {
    var scripts = {
      css: document.getElementById('customCSS').value,
      js: document.getElementById('customJS').value
    };
    customization.data.scripts = scripts;
    customization.saveToServer({
      scripts: scripts
    });
  },
  testScripts: function testScripts() {
    try {
      var css = document.getElementById('customCSS').value;
      var js = document.getElementById('customJS').value;

      // Test CSS
      if (css.trim()) {
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        toast.success('CSS test thành công');
        setTimeout(function () {
          return style.remove();
        }, 2000);
      }

      // Test JS
      if (js.trim()) {
        // Use Function instead of eval for safety
        new Function(js)();
        toast.success('JavaScript test thành công');
      }
      if (!css.trim() && !js.trim()) {
        toast.info('Vui lòng nhập CSS hoặc JavaScript');
      }
    } catch (error) {
      toast.error("L\u1ED7i: ".concat(error.message));
    }
  },
  clearScripts: function clearScripts() {
    NotificationModal.confirm('Xác nhận', 'Bạn có chắc muốn xóa tất cả custom scripts?', function () {
      document.getElementById('customCSS').value = '';
      document.getElementById('customJS').value = '';
      customization.data.scripts = {
        css: '',
        js: ''
      };
      customization.saveToServer({
        scripts: {
          css: '',
          js: ''
        }
      });
      toast.success('Đã xóa tất cả custom scripts');
    });
  },
  saveToServer: function () {
    var _saveToServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(settings) {
      var response, result, _t0;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.p = _context1.n) {
          case 0:
            _context1.p = 0;
            _context1.n = 1;
            return fetch('/api/settings', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(settings)
            });
          case 1:
            response = _context1.v;
            _context1.n = 2;
            return response.json();
          case 2:
            result = _context1.v;
            if (result.success) {
              toast.success('Đã lưu cài đặt thành công');
            } else {
              toast.error(result.message || 'Lỗi khi lưu cài đặt');
            }
            _context1.n = 4;
            break;
          case 3:
            _context1.p = 3;
            _t0 = _context1.v;
            toast.error('Không thể kết nối đến server');
            console.error('Save settings error:', _t0);
          case 4:
            return _context1.a(2);
        }
      }, _callee1, null, [[0, 3]]);
    }));
    function saveToServer(_x8) {
      return _saveToServer.apply(this, arguments);
    }
    return saveToServer;
  }()
};

// ==================== TOOLS ====================
var tools = {
  init: function init() {
    var runCleanupBtn = document.getElementById('runCleanupBtn');
    var autoCleanupToggle = document.getElementById('autoCleanupToggle');
    runCleanupBtn === null || runCleanupBtn === void 0 || runCleanupBtn.addEventListener('click', function () {
      NotificationModal.confirm('Xác nhận', 'Bạn có chắc muốn chạy cleanup ngay bây giờ?', function () {
        tools.runCleanup();
      });
    });
    autoCleanupToggle === null || autoCleanupToggle === void 0 || autoCleanupToggle.addEventListener('change', function (e) {
      if (e.target.checked) {
        toast.success('Đã bật tự động cleanup');
      } else {
        toast.info('Đã tắt tự động cleanup');
      }
    });
  },
  runCleanup: function runCleanup() {
    toast.info('Đang chạy cleanup...');

    // Simulate cleanup process
    setTimeout(function () {
      toast.success('Cleanup hoàn tất! Đã xóa 0 phiên cũ.');
    }, 2000);
  }
};

// Session updates are refreshed by explicit triggers instead of interval polling.
var sessionPoller = {
  isRunning: false,
  refreshTimer: null,
  isBoundRefreshTriggers: false,
  lastUpdateTime: {},
  init: function init() {
    sessionPoller.bindRefreshTriggers();
    sessionPoller.requestRefresh('init');
  },
  startPolling: function startPolling() {
    sessionPoller.bindRefreshTriggers();
    sessionPoller.requestRefresh('manual-start');
  },
  stopPolling: function stopPolling() {
    if (sessionPoller.refreshTimer) {
      clearTimeout(sessionPoller.refreshTimer);
      sessionPoller.refreshTimer = null;
    }
    sessionPoller.isRunning = false;
  },
  bindRefreshTriggers: function bindRefreshTriggers() {
    if (sessionPoller.isBoundRefreshTriggers) return;
    sessionPoller.isBoundRefreshTriggers = true;
    sessionPoller.isRunning = true;
    window.addEventListener('focus', function () {
      sessionPoller.requestRefresh('window-focus');
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) sessionPoller.requestRefresh('tab-visible');
    });
    window.addEventListener('admin:sessions:changed', function () {
      sessionPoller.requestRefresh('sessions-changed-event');
    });
  },
  requestRefresh: function requestRefresh() {
    var _reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'event';
    if (!sessionPoller.isRunning) return;
    if (sessionPoller.refreshTimer) return;
    sessionPoller.refreshTimer = setTimeout(function () {
      sessionPoller.refreshTimer = null;
      sessionPoller.pollSessions();
    }, 120);
  },
  pollSessions: function pollSessions() {
    fetch('/api/sessions').then(function (res) {
      if (!res.ok) {
        console.warn("\u26A0\uFE0F [Poll] HTTP ".concat(res.status, ": ").concat(res.statusText));
        throw new Error("HTTP ".concat(res.status));
      }
      // Handle both JSON and text responses
      var contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return res.json();
      } else {
        return res.text().then(function (text) {
          console.warn("\u26A0\uFE0F [Poll] Non-JSON response: ".concat(text));
          throw new Error('Non-JSON response from server');
        });
      }
    }).then(function (data) {
      if (data.success && Array.isArray(data.data)) {
        // Check for updates in sessions
        data.data.forEach(function (newSession) {
          var oldSession = sessions.data.find(function (s) {
            return (s.session_code || s.code) === (newSession.session_code || newSession.code);
          });
          if (oldSession) {
            // Check if box selection was updated
            if (newSession.player_selected_box && !oldSession.player_selected_box) {
              sessionPoller.handleNewBoxSelection(newSession);
            }

            // Check if form was submitted
            if (newSession.is_form_submitted && !oldSession.is_form_submitted) {
              sessionPoller.handleFormSubmitted(newSession);
            }
          }
        });

        // Update sessions data
        sessions.data = data.data;
        sessions.render();
      }
    }).catch(function (err) {
      return console.warn('⚠️ [Poll] Session polling error:', err.message);
    });
  },
  handleNewBoxSelection: function handleNewBoxSelection(session) {
    // Show real-time indicator
    var sessionCode = session.session_code || session.code;
    var sessionCard = document.querySelector("[data-session-code=\"".concat(sessionCode, "\"]"));
    if (sessionCard) {
      var statusEl = sessionCard.querySelector('.session-status');
      if (statusEl) {
        statusEl.innerHTML = "\n                    <span class=\"status-badge selected\" style=\"animation: pulse 0.6s ease-in-out;\">\n                        \u2705 \u0110\xE3 ch\u1ECDn H\u1ED9p #".concat(session.player_selected_box, "\n                    </span>\n                    <span class=\"status-timestamp\">").concat(new Date(session.player_selected_at).toLocaleTimeString('vi-VN'), "</span>\n                    ").concat(session.player_name ? "<span class=\"player-name\">Ng\u01B0\u1EDDi ch\u01A1i: ".concat(session.player_name, "</span>") : '', "\n                ");
        sessionCard.classList.add('has-selection');
      }
    }

    // Show toast notification
    toast.info("\u2705 H\u1ED9p #".concat(session.player_selected_box, " \u0111\u01B0\u1EE3c ch\u1ECDn b\u1EDFi ").concat(session.player_name || 'người chơi'));
  },
  handleFormSubmitted: function handleFormSubmitted(session) {
    // Update UI to show form submitted
    var sessionCode = session.session_code || session.code;
    var sessionCard = document.querySelector("[data-session-code=\"".concat(sessionCode, "\"]"));
    if (sessionCard) {
      sessionCard.classList.add('form-submitted');
    }
    toast.success("\uD83D\uDCCB M\u1EABu \u0111\u01B0\u1EE3c g\u1EEDi cho ".concat(session.player_name || 'người chơi'));
  }
};

// ==================== NOTIFICATIONS MANAGER ====================
var notifications = {
  data: [],
  currentPage: 1,
  itemsPerPage: 10,
  isLoading: false,
  getTotalPages: function getTotalPages() {
    return Math.ceil(this.data.length / this.itemsPerPage);
  },
  getPaginatedData: function getPaginatedData() {
    var start = (this.currentPage - 1) * this.itemsPerPage;
    return this.data.slice(start, start + this.itemsPerPage);
  },
  fetch: function (_fetch3) {
    function fetch() {
      return _fetch3.apply(this, arguments);
    }
    fetch.toString = function () {
      return _fetch3.toString();
    };
    return fetch;
  }(function () {
    var _this = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
      var response, contentType, text, result, _t1;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.p = _context10.n) {
          case 0:
            _context10.p = 0;
            _context10.n = 1;
            return fetch('/api/notifications');
          case 1:
            response = _context10.v;
            if (response.ok) {
              _context10.n = 2;
              break;
            }
            console.warn("\u26A0\uFE0F Notifications HTTP ".concat(response.status, ": ").concat(response.statusText));
            return _context10.a(2);
          case 2:
            // Check if response is JSON before parsing
            contentType = response.headers.get('content-type');
            if (!(!contentType || !contentType.includes('application/json'))) {
              _context10.n = 4;
              break;
            }
            _context10.n = 3;
            return response.text();
          case 3:
            text = _context10.v;
            console.warn("\u26A0\uFE0F Notifications: Non-JSON response (".concat(text.substring(0, 50), ")"));
            return _context10.a(2);
          case 4:
            _context10.n = 5;
            return response.json();
          case 5:
            result = _context10.v;
            if (result.success) {
              _this.data = result.data || [];
              _this.currentPage = 1; // Reset to first page when fetching new data
              _this.updateBadge(result.unreadCount);
              _this.render();
            }
            _context10.n = 7;
            break;
          case 6:
            _context10.p = 6;
            _t1 = _context10.v;
            if (_t1 instanceof SyntaxError) {
              console.warn('⚠️ Notifications: JSON parse error (likely non-JSON response):', _t1.message);
            } else {
              console.error('❌ Error fetching notifications:', _t1.message);
            }
          case 7:
            return _context10.a(2);
        }
      }, _callee10, null, [[0, 6]]);
    }))();
  }),
  updateBadge: function updateBadge(count) {
    var badge = document.querySelector('.notification-badge');
    if (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }
  },
  getTimeAgo: function getTimeAgo(timestamp) {
    var now = new Date();
    var date = new Date(timestamp);
    var seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return "".concat(Math.floor(seconds / 60), " ph\xFAt tr\u01B0\u1EDBc");
    if (seconds < 86400) return "".concat(Math.floor(seconds / 3600), " gi\u1EDD tr\u01B0\u1EDBc");
    if (seconds < 604800) return "".concat(Math.floor(seconds / 86400), " ng\xE0y tr\u01B0\u1EDBc");
    return date.toLocaleDateString('vi-VN');
  },
  getIconClass: function getIconClass(type) {
    var icons = {
      session: 'fa-gamepad',
      withdrawal: 'fa-money-bill-wave',
      gift: 'fa-gift',
      user: 'fa-user-plus',
      system: 'fa-info-circle'
    };
    return icons[type] || 'fa-bell';
  },
  getColorClass: function getColorClass(color) {
    var colors = {
      blue: 'notification-icon blue',
      warning: 'notification-icon warning',
      success: 'notification-icon green',
      danger: 'notification-icon red',
      info: 'notification-icon blue'
    };
    return colors[color] || 'notification-icon blue';
  },
  render: function render() {
    var _this2 = this;
    var container = document.getElementById('notificationList');
    if (!container) return;
    if (this.data.length === 0) {
      container.innerHTML = "\n                <div style=\"text-align: center; padding: 40px; color: rgba(255,255,255,0.5);\">\n                    <i class=\"fas fa-inbox\" style=\"font-size: 2em; margin-bottom: 10px;\"></i>\n                    <p>Kh\xF4ng c\xF3 th\xF4ng b\xE1o m\u1EDBi</p>\n                </div>\n            ";
      return;
    }
    var paginatedData = this.getPaginatedData();
    container.innerHTML = paginatedData.map(function (notification) {
      var colorMap = {
        blue: 'blue',
        warning: 'warning',
        success: 'green',
        danger: 'red'
      };
      return "\n                <div class=\"notification-item ".concat(notification.read ? '' : 'unread', "\" style=\"opacity: ").concat(notification.read ? '0.6' : '1', "; cursor: pointer;\" onclick=\"notifications.markAsRead('").concat(notification.id, "')\">\n                    <div class=\"").concat(_this2.getColorClass(colorMap[notification.color]), "\">\n                        <i class=\"fas ").concat(_this2.getIconClass(notification.type), "\"></i>\n                    </div>\n                    <div class=\"notification-content\">\n                        <div class=\"notification-title\">").concat(notification.title, "</div>\n                        <div class=\"notification-text\">").concat(notification.message, "</div>\n                        <div class=\"notification-time\">").concat(_this2.getTimeAgo(notification.timestamp), " ").concat(notification.read ? '• Đã đọc' : '', "</div>\n                    </div>\n                    ").concat(!notification.read ? '<div class="notification-dot"></div>' : '', "\n                </div>\n            ");
    }).join('');
    this.renderPagination();
  },
  renderPagination: function renderPagination() {
    var totalPages = this.getTotalPages();
    var paginationContainer = document.getElementById('notificationPagination');
    if (!paginationContainer || totalPages <= 1) return;
    var paginationHTML = '<div style="display: flex; gap: 8px; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); justify-content: center; flex-wrap: wrap;\">';

    // Previous button
    if (this.currentPage > 1) {
      paginationHTML += "<button onclick=\"notifications.goToPage(".concat(this.currentPage - 1, ")\" style=\"padding: 6px 10px; background: rgba(99, 102, 241, 0.3); border: 1px solid #6366f1; border-radius: 4px; color: #fff; cursor: pointer; font-size: 12px;\">\u2190 Tr\u01B0\u1EDBc</button>");
    }

    // Calculate page numbers to show
    var maxVisible = 7;
    var startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    var endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Show first page if not visible
    if (startPage > 1) {
      paginationHTML += "<button onclick=\"notifications.goToPage(1)\" style=\"padding: 6px 10px; background: rgba(99, 102, 241, 0.2); border: 1px solid #6366f1; border-radius: 4px; color: #fff; cursor: pointer; font-size: 12px;\">1</button>";
      if (startPage > 2) {
        paginationHTML += "<span style=\"color: rgba(255,255,255,0.5); padding: 6px 8px;\">...</span>";
      }
    }

    // Page numbers
    for (var i = startPage; i <= endPage; i++) {
      var isActive = i === this.currentPage;
      paginationHTML += "<button onclick=\"notifications.goToPage(".concat(i, ")\" style=\"padding: 6px 10px; background: ").concat(isActive ? '#6366f1' : 'rgba(99, 102, 241, 0.2)', "; border: 1px solid #6366f1; border-radius: 4px; color: #fff; cursor: pointer; font-size: 12px; font-weight: ").concat(isActive ? 'bold' : 'normal', ";\">").concat(i, "</button>");
    }

    // Show last page if not visible
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += "<span style=\"color: rgba(255,255,255,0.5); padding: 6px 8px;\">...</span>";
      }
      paginationHTML += "<button onclick=\"notifications.goToPage(".concat(totalPages, ")\" style=\"padding: 6px 10px; background: rgba(99, 102, 241, 0.2); border: 1px solid #6366f1; border-radius: 4px; color: #fff; cursor: pointer; font-size: 12px;\">").concat(totalPages, "</button>");
    }

    // Next button
    if (this.currentPage < totalPages) {
      paginationHTML += "<button onclick=\"notifications.goToPage(".concat(this.currentPage + 1, ")\" style=\"padding: 6px 10px; background: rgba(99, 102, 241, 0.3); border: 1px solid #6366f1; border-radius: 4px; color: #fff; cursor: pointer; font-size: 12px;\">Sau \u2192</button>");
    }
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
  },
  goToPage: function goToPage(pageNum) {
    var totalPages = this.getTotalPages();
    if (pageNum >= 1 && pageNum <= totalPages) {
      this.currentPage = pageNum;
      this.render();
      // Scroll to top of notification list
      var container = document.getElementById('notificationList');
      if (container) {
        container.scrollTop = 0;
      }
    }
  },
  markAsRead: function markAsRead(id) {
    var notification = this.data.find(function (n) {
      return n.id === id;
    });
    if (notification && !notification.read) {
      notification.read = true;
      // Update badge
      var unreadCount = this.data.filter(function (n) {
        return !n.read;
      }).length;
      this.updateBadge(unreadCount);
      // Re-render current page
      this.render();
    }
  },
  startPolling: function startPolling() {
    this.bindRefreshTriggers();
    this.requestRefresh('manual-start');
  },
  stopPolling: function stopPolling() {
    if (state.notificationTimer) {
      clearTimeout(state.notificationTimer);
      state.notificationTimer = null;
    }
  },
  bindRefreshTriggers: function bindRefreshTriggers() {
    var _this3 = this;
    if (this._hasRefreshBindings) return;
    this._hasRefreshBindings = true;
    window.addEventListener('focus', function () {
      return _this3.requestRefresh('window-focus');
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) _this3.requestRefresh('tab-visible');
    });
    window.addEventListener('admin:notifications:changed', function () {
      return _this3.requestRefresh('notifications-changed-event');
    });
  },
  requestRefresh: function requestRefresh() {
    var _this4 = this;
    var _reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'event';
    if (state.notificationTimer) return;
    state.notificationTimer = setTimeout(function () {
      state.notificationTimer = null;
      _this4.fetch();
    }, 120);
  },
  init: function init() {
    this.startPolling();
  }
};

// ==================== TOPBAR ACTIONS ====================
var topbar = {
  init: function init() {
    // Refresh button
    var refreshBtn = document.getElementById('refreshBtn');
    refreshBtn === null || refreshBtn === void 0 || refreshBtn.addEventListener('click', function () {
      var icon = refreshBtn.querySelector('i');
      icon.style.animation = 'spin 1s linear';
      setTimeout(function () {
        icon.style.animation = '';
        toast.show('Dữ liệu đã được làm mới', 'success');

        // Re-render current tab
        switch (state.currentTab) {
          case 'sessions':
            sessions.render();
            break;
          case 'withdrawals':
            withdrawals.fetch();
            break;
          case 'gifts':
            giftExchanges.fetch();
            break;
          case 'users':
            users.render();
            break;
        }
      }, 1000);
    });

    // Notification button
    var notificationBtn = document.getElementById('notificationBtn');
    var notificationPanel = document.getElementById('notificationPanel');
    var closeNotificationPanel = document.getElementById('closeNotificationPanel');
    var markAllAsRead = document.getElementById('markAllAsRead');
    notificationBtn === null || notificationBtn === void 0 || notificationBtn.addEventListener('click', function () {
      state.notificationPanelOpen = !state.notificationPanelOpen;
      notificationPanel === null || notificationPanel === void 0 || notificationPanel.classList.toggle('active');
      if (state.notificationPanelOpen) {
        notifications.fetch();
      }
    });
    closeNotificationPanel === null || closeNotificationPanel === void 0 || closeNotificationPanel.addEventListener('click', function () {
      state.notificationPanelOpen = false;
      notificationPanel === null || notificationPanel === void 0 || notificationPanel.classList.remove('active');
    });
    markAllAsRead === null || markAllAsRead === void 0 || markAllAsRead.addEventListener('click', function () {
      notifications.data.forEach(function (n) {
        return n.read = true;
      });
      notifications.render();
      notifications.updateBadge(0);
      toast.show('Đã đánh dấu tất cả là đã đọc', 'success');
    });

    // Theme toggle
    var themeBtn = document.getElementById('themeBtn');
    var currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeBtn === null || themeBtn === void 0 || themeBtn.addEventListener('click', function () {
      var htmlElement = document.documentElement;
      var theme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);

      // Update icon
      var icon = themeBtn.querySelector('i');
      if (theme === 'dark') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
      toast.show("\u0110\xE3 chuy\u1EC3n sang ch\u1EBF \u0111\u1ED9 ".concat(theme === 'dark' ? 'tối' : 'sáng'), 'info');
    });

    // Initialize theme icon
    if (currentTheme === 'light') {
      var icon = themeBtn === null || themeBtn === void 0 ? void 0 : themeBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    }

    // Auto refresh toggle
    var autoRefreshToggle = document.getElementById('autoRefreshToggle');
    autoRefreshToggle === null || autoRefreshToggle === void 0 || autoRefreshToggle.addEventListener('change', function (e) {
      state.autoRefresh = e.target.checked;
      if (state.autoRefresh) {
        topbar.startAutoRefresh();
        toast.show('Đã bật tự động làm mới', 'success');
      } else {
        topbar.stopAutoRefresh();
        toast.show('Đã tắt tự động làm mới', 'info');
      }
    });

    // Global search
    var globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
      globalSearch.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var query = globalSearch.value.trim();
          if (query) {
            toast.show("T\xECm ki\u1EBFm: ".concat(query), 'info');
            // Clear search after showing message
            setTimeout(function () {
              globalSearch.value = '';
            }, 500);
          }
        }
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        globalSearch === null || globalSearch === void 0 || globalSearch.focus();
        toast.show('Tìm kiếm toàn cầu', 'info');
      }

      // Ctrl/Cmd + R for refresh
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshBtn === null || refreshBtn === void 0 || refreshBtn.click();
      }

      // Escape to close notification panel
      if (e.key === 'Escape' && state.notificationPanelOpen) {
        closeNotificationPanel === null || closeNotificationPanel === void 0 || closeNotificationPanel.click();
      }
    });

    // Logout button
    var logoutBtn = document.getElementById('logoutBtn');
    logoutBtn === null || logoutBtn === void 0 || logoutBtn.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            NotificationModal.confirm('Xác nhận', 'Bạn có chắc chắn muốn đăng xuất?', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
              var response, _t10;
              return _regenerator().w(function (_context11) {
                while (1) switch (_context11.p = _context11.n) {
                  case 0:
                    _context11.p = 0;
                    _context11.n = 1;
                    return fetch('/api/admin/logout', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    });
                  case 1:
                    response = _context11.v;
                    if (response.ok) {
                      toast.show('Đăng xuất thành công!', 'success');
                      setTimeout(function () {
                        window.location.href = '/admin/login';
                      }, 1500);
                    } else {
                      toast.show('Lỗi đăng xuất', 'error');
                    }
                    _context11.n = 3;
                    break;
                  case 2:
                    _context11.p = 2;
                    _t10 = _context11.v;
                    console.error('Logout error:', _t10);
                    toast.show('Lỗi kết nối máy chủ', 'error');
                  case 3:
                    return _context11.a(2);
                }
              }, _callee11, null, [[0, 2]]);
            })));
          case 1:
            return _context12.a(2);
        }
      }, _callee12);
    })));

    // Click outside to close notification
    document.addEventListener('click', function (e) {
      if (!(notificationPanel !== null && notificationPanel !== void 0 && notificationPanel.contains(e.target)) && !(notificationBtn !== null && notificationBtn !== void 0 && notificationBtn.contains(e.target))) {
        if (state.notificationPanelOpen) {
          closeNotificationPanel === null || closeNotificationPanel === void 0 || closeNotificationPanel.click();
        }
      }
    });
  },
  startAutoRefresh: function startAutoRefresh() {
    topbar.bindAutoRefreshTriggers();
    topbar.requestAutoRefresh('toggle-on');
  },
  stopAutoRefresh: function stopAutoRefresh() {
    if (state.autoRefreshTimer) {
      clearTimeout(state.autoRefreshTimer);
      state.autoRefreshTimer = null;
    }
  },
  bindAutoRefreshTriggers: function bindAutoRefreshTriggers() {
    if (state.autoRefreshBindingsReady) return;
    state.autoRefreshBindingsReady = true;
    window.addEventListener('focus', function () {
      if (state.autoRefresh) topbar.requestAutoRefresh('window-focus');
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && state.autoRefresh) topbar.requestAutoRefresh('tab-visible');
    });
    window.addEventListener('admin:data:refresh', function () {
      if (state.autoRefresh) topbar.requestAutoRefresh('external-event');
    });
  },
  requestAutoRefresh: function requestAutoRefresh() {
    var _reason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'event';
    if (!state.autoRefresh) return;
    if (state.autoRefreshTimer) return;
    state.autoRefreshTimer = setTimeout(function () {
      state.autoRefreshTimer = null;
      switch (state.currentTab) {
        case 'sessions':
          sessions.render();
          break;
        case 'withdrawals':
          withdrawals.fetch();
          break;
        case 'gifts':
          giftExchanges.fetch();
          break;
        case 'users':
          users.render();
          break;
      }
    }, 150);
  }
};

// ==================== BUTTON ACTIONS ====================
var buttonActions = {
  init: function init() {
    // Export sessions
    var exportSessionsBtn = document.getElementById('exportSessionsBtn');
    exportSessionsBtn === null || exportSessionsBtn === void 0 || exportSessionsBtn.addEventListener('click', function () {
      toast.show('Đang xuất dữ liệu phiên chơi...', 'info');
      // TODO: Implement export functionality
      setTimeout(function () {
        toast.show('Xuất dữ liệu thành công', 'success');
      }, 1500);
    });

    // Delete all sessions
    var deleteAllBtn = document.getElementById('deleteAllSessionsBtn');
    deleteAllBtn === null || deleteAllBtn === void 0 || deleteAllBtn.addEventListener('click', function () {
      NotificationModal.confirm('Xác nhận xóa', 'Bạn có chắc muốn xóa TẤT CẢ phiên? Hành động này không thể hoàn tác!', function () {
        toast.show('Đang xóa tất cả phiên...', 'warning');
        setTimeout(function () {
          toast.show('Đã xóa tất cả phiên thành công', 'success');
        }, 1500);
      });
    });

    // Upload file
    var uploadFileBtn = document.getElementById('uploadFileBtn');
    uploadFileBtn === null || uploadFileBtn === void 0 || uploadFileBtn.addEventListener('click', function () {
      // Create file input
      var fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true;
      fileInput.onchange = function (e) {
        var files = e.target.files;
        if (files.length > 0) {
          toast.show("\u0110ang upload ".concat(files.length, " file..."), 'info');
          setTimeout(function () {
            toast.show("Upload ".concat(files.length, " file th\xE0nh c\xF4ng"), 'success');
          }, 1500);
        }
      };
      fileInput.click();
    });
  }
};

// ==================== ANIMATIONS ====================
var animations = {
  init: function init() {
    // Add fade-in animation to cards
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for old WebViews: just show cards immediately
      document.querySelectorAll('.stat-card, .data-card, .user-card, .file-card').forEach(function (card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
      return;
    }
    var observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.stat-card, .data-card, .user-card, .file-card').forEach(function (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      observer.observe(card);
    });
  }
};

// ==================== INITIALIZATION ====================
var app = {
  init: function init() {
    // Show loading screen
    var loadingScreen = document.getElementById('loadingScreen');

    // Initialize all modules
    sidebar.init();
    navigation.init();
    topbar.init();
    buttonActions.init();
    modal.init();
    sessions.init();
    users.init();
    console.log('🔵 About to call files.init()...');
    console.log('🔵 files module:', _typeof(files), files ? 'exists' : 'undefined');
    if (typeof files !== 'undefined' && typeof files.init === 'function') {
      files.init();
      console.log('🔵 files.init() called successfully');
    } else {
      console.error('❌ files.init() NOT available!');
    }
    customization.init();
    tools.init();

    // Hide loading screen
    setTimeout(function () {
      loadingScreen === null || loadingScreen === void 0 || loadingScreen.classList.add('hidden');

      // Show welcome toast
      setTimeout(function () {
        toast.success('Chào mừng trở lại, admin999!', 'Đăng nhập thành công');
      }, 300);

      // Initialize notifications
      notifications.init();

      // 🔥 NEW: Initialize session polling for real-time updates
      sessionPoller.init();

      // Initialize animations
      animations.init();
    }, 1000);
  }
};

// ==================== START APPLICATION ====================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', app.init);
} else {
  app.init();
}

// ==================== MODAL MANAGEMENT ====================
var modal = {
  currentEditingSession: null,
  selectedIcons: {
    1: '🎁',
    2: '🎁',
    3: '🎁'
  },
  boxPositions: [1, 2, 3],
  init: function init() {
    modal.setupEventListeners();
    modal.setupDisplayTypeToggle();
    modal.setupIconSelection();
    modal.setupTemplates();
    modal.setupBoxOrder();
  },
  setupEventListeners: function setupEventListeners() {
    var _document$getElementB8, _document$getElementB9, _document$getElementB0, _document$getElementB1, _document$getElementB10, _document$getElementB11, _document$getElementB12, _document$getElementB13, _document$getElementB14, _document$getElementB15;
    // Open modal button
    var createSessionBtn = document.getElementById('createSessionBtn');
    createSessionBtn === null || createSessionBtn === void 0 || createSessionBtn.addEventListener('click', function () {
      return modal.openCreate();
    });

    // Close modal buttons
    (_document$getElementB8 = document.getElementById('closeSessionModal')) === null || _document$getElementB8 === void 0 || _document$getElementB8.addEventListener('click', function () {
      return modal.close();
    });
    (_document$getElementB9 = document.getElementById('cancelSessionBtn')) === null || _document$getElementB9 === void 0 || _document$getElementB9.addEventListener('click', function () {
      return modal.close();
    });

    // Submit button
    (_document$getElementB0 = document.getElementById('submitSessionBtn')) === null || _document$getElementB0 === void 0 || _document$getElementB0.addEventListener('click', function () {
      return modal.submitSession();
    });

    // Generate code button
    (_document$getElementB1 = document.getElementById('generateCodeBtn')) === null || _document$getElementB1 === void 0 || _document$getElementB1.addEventListener('click', function () {
      return modal.generateCode();
    });

    // Delete confirmation modal
    (_document$getElementB10 = document.getElementById('closeConfirmModal')) === null || _document$getElementB10 === void 0 || _document$getElementB10.addEventListener('click', function () {
      return modal.closeConfirm();
    });
    (_document$getElementB11 = document.getElementById('cancelDeleteBtn')) === null || _document$getElementB11 === void 0 || _document$getElementB11.addEventListener('click', function () {
      return modal.closeConfirm();
    });

    // Preview modal
    (_document$getElementB12 = document.getElementById('closePreviewModal')) === null || _document$getElementB12 === void 0 || _document$getElementB12.addEventListener('click', function () {
      return modal.closePreviewModal();
    });
    (_document$getElementB13 = document.getElementById('closePreviewBtn')) === null || _document$getElementB13 === void 0 || _document$getElementB13.addEventListener('click', function () {
      return modal.closePreviewModal();
    });
    (_document$getElementB14 = document.getElementById('openGamePreviewBtn')) === null || _document$getElementB14 === void 0 || _document$getElementB14.addEventListener('click', function () {
      if (modal.previewSessionCode) {
        window.open("/play/".concat(modal.previewSessionCode), '_blank');
      }
    });

    // Close modals with overlay click
    (_document$getElementB15 = document.getElementById('modalOverlay')) === null || _document$getElementB15 === void 0 || _document$getElementB15.addEventListener('click', function (e) {
      var _document$getElementB16, _document$getElementB17, _document$getElementB18;
      if ((_document$getElementB16 = document.getElementById('sessionModal')) !== null && _document$getElementB16 !== void 0 && _document$getElementB16.classList.contains('show')) {
        modal.close();
      } else if ((_document$getElementB17 = document.getElementById('confirmDeleteModal')) !== null && _document$getElementB17 !== void 0 && _document$getElementB17.classList.contains('show')) {
        modal.closeConfirm();
      } else if ((_document$getElementB18 = document.getElementById('previewModal')) !== null && _document$getElementB18 !== void 0 && _document$getElementB18.classList.contains('show')) {
        modal.closePreviewModal();
      }
    });
  },
  setupTemplates: function setupTemplates() {
    document.querySelectorAll('.template-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var template = btn.getAttribute('data-template');

        // Remove active state from all buttons
        document.querySelectorAll('.template-btn').forEach(function (b) {
          b.classList.remove('active');
        });

        // Add active state to clicked button
        btn.classList.add('active');

        // Apply template data
        modal.applyTemplate(template);
      });
    });
  },
  applyTemplate: function applyTemplate(template) {
    var templates = {
      'all-vip': {
        prize_1: 'iPhone 15 Pro Max',
        prize_1_status: 'VIP',
        prize_1_description: 'Điện thoại cao cấp',
        prize_2: 'MacBook Pro M3',
        prize_2_status: 'VIP',
        prize_2_description: 'Laptop hiệu năng cao',
        prize_3: 'AirPods Pro Max',
        prize_3_status: 'VIP',
        prize_3_description: 'Tai nghe premium'
      },
      'two-vip-one-normal': {
        prize_1: 'iPhone 15',
        prize_1_status: 'VIP',
        prize_1_description: 'Điện thoại cao cấp',
        prize_2: 'iPad Pro',
        prize_2_status: 'VIP',
        prize_2_description: 'Máy tính bảng',
        prize_3: 'Samsung Galaxy Watch',
        prize_3_status: 'NORMAL',
        prize_3_description: 'Đồng hồ thông minh'
      },
      'mixed': {
        prize_1: 'Sony WH-1000XM5',
        prize_1_status: 'VIP',
        prize_1_description: 'Tai nghe chống ồn',
        prize_2: 'JBL Speaker',
        prize_2_status: 'NORMAL',
        prize_2_description: 'Loa Bluetooth',
        prize_3: 'Voucher 100K',
        prize_3_status: 'UNLUCKY',
        prize_3_description: 'Coupon giảm giá'
      }
    };
    var data = templates[template] || {};
    Object.keys(data).forEach(function (key) {
      var el = document.querySelector("[name=\"".concat(key, "\"]"));
      if (el) {
        el.value = data[key];
        // Trigger change event for status fields to update badges
        if (key.endsWith('_status')) {
          el.dispatchEvent(new Event('change', {
            bubbles: true
          }));
        }
      }
    });
  },
  setupDisplayTypeToggle: function setupDisplayTypeToggle() {
    // Status change handler - update badge
    document.querySelectorAll('[name^="prize_"][name$="_status"]').forEach(function (select) {
      select.addEventListener('change', function (e) {
        var prizeNum = select.name.match(/prize_(\d+)/)[1];
        var parent = select.closest('.prize-box');
        var badge = parent === null || parent === void 0 ? void 0 : parent.querySelector('.prize-badge span');
        var icon = parent === null || parent === void 0 ? void 0 : parent.querySelector('.prize-badge i');
        if (badge) {
          var status = e.target.value;
          badge.textContent = status;

          // Update icon
          if (icon) {
            if (status === 'VIP') {
              icon.className = 'fas fa-crown';
            } else if (status === 'UNLUCKY') {
              icon.className = 'fas fa-bomb';
            } else {
              icon.className = 'fas fa-check';
            }
          }

          // Update badge style
          var badgeEl = parent === null || parent === void 0 ? void 0 : parent.querySelector('.prize-badge');
          if (badgeEl) {
            badgeEl.className = 'prize-badge';
            if (status === 'VIP') {
              badgeEl.classList.add('vip');
            } else if (status === 'UNLUCKY') {
              badgeEl.classList.add('unlucky');
            } else {
              badgeEl.classList.add('normal');
            }
          }
        }
      });
    });

    // Display type toggle
    document.querySelectorAll('.radio-group').forEach(function (group) {
      group.addEventListener('change', function (e) {
        if (e.target.type === 'radio') {
          var prizeNum = group.getAttribute('data-prize');
          var parent = group.closest('.prize-content');
          if (parent) {
            var iconGroup = parent.querySelector(".icon-group[data-prize=\"".concat(prizeNum, "\"]"));
            var imageGroup = parent.querySelector(".image-group[data-prize=\"".concat(prizeNum, "\"]"));
            if (e.target.value === 'icon') {
              if (iconGroup) {
                iconGroup.classList.remove('hidden');
                iconGroup.style.display = 'block';
              }
              if (imageGroup) {
                imageGroup.classList.add('hidden');
                imageGroup.style.display = 'none';
              }
            } else if (e.target.value === 'image') {
              if (imageGroup) {
                imageGroup.classList.remove('hidden');
                imageGroup.style.display = 'block';
              }
              if (iconGroup) {
                iconGroup.classList.add('hidden');
                iconGroup.style.display = 'none';
              }
            }
          }
        }
      });
    });

    // Cash toggle handlers - display input
    document.querySelectorAll('.cash-toggle').forEach(function (checkbox) {
      checkbox.addEventListener('change', function (e) {
        var prizeNum = checkbox.getAttribute('data-prize');
        var parent = checkbox.closest('.prize-content');
        var cashInputGroup = parent === null || parent === void 0 ? void 0 : parent.querySelector(".cash-input-group[data-prize=\"".concat(prizeNum, "\"]"));
        if (cashInputGroup) {
          if (e.target.checked) {
            cashInputGroup.classList.remove('hidden');
            cashInputGroup.style.display = 'block';
          } else {
            cashInputGroup.classList.add('hidden');
            cashInputGroup.style.display = 'none';
          }
        }
      });
    });

    // Upload button handlers
    document.querySelectorAll('.btn-upload-image').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var prizeNum = btn.getAttribute('data-prize');
        var fileInput = document.querySelector("input[name=\"prize_".concat(prizeNum, "_image_file\"]"));
        fileInput === null || fileInput === void 0 || fileInput.click();
      });
    });

    // File input change handlers
    document.querySelectorAll('.image-file-input').forEach(function (fileInput) {
      fileInput.addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
          var file = e.target.files[0];
          var reader = new FileReader();
          reader.onload = function (event) {
            var prizeNum = fileInput.name.match(/prize_(\d+)/)[1];
            var urlInput = document.querySelector("input[name=\"prize_".concat(prizeNum, "_image_url\"]"));
            if (urlInput) {
              urlInput.value = event.target.result;
              toast.success('Ảnh được tải lên thành công!');
            }
          };
          reader.readAsDataURL(file);
        }
      });
    });
  },
  setupIconSelection: function setupIconSelection() {
    document.querySelectorAll('.icon-btn-small').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var icon = btn.getAttribute('data-icon');
        var grid = btn.closest('.icon-grid-small');
        var iconGroup = btn.closest('.icon-group');
        var prizeNum = iconGroup === null || iconGroup === void 0 ? void 0 : iconGroup.getAttribute('data-prize');
        if (prizeNum) {
          grid.querySelectorAll('.icon-btn-small').forEach(function (b) {
            return b.classList.remove('selected');
          });
          btn.classList.add('selected');
          modal.selectedIcons[prizeNum] = icon;

          // Update preview immediately
          var previewSpan = document.getElementById("previewPrize".concat(prizeNum, "Icon"));
          if (previewSpan) {
            previewSpan.textContent = icon;
            previewSpan.style.backgroundImage = 'none';
          }
        }
      });
    });
  },
  setupBoxOrder: function setupBoxOrder() {
    // Remove old listeners
    document.querySelectorAll('.box-order-display').forEach(function (display) {
      var upBtn = display.querySelector('.btn-sm-icon:first-child');
      var downBtn = display.querySelector('.btn-sm-icon:last-child');

      // Clone to remove all listeners
      if (upBtn) {
        var newUpBtn = upBtn.cloneNode(true);
        upBtn.parentNode.replaceChild(newUpBtn, upBtn);
      }
      if (downBtn) {
        var newDownBtn = downBtn.cloneNode(true);
        downBtn.parentNode.replaceChild(newDownBtn, downBtn);
      }
    });

    // Add new listeners
    document.querySelectorAll('.box-order-display').forEach(function (display, index) {
      var upBtn = display.querySelector('.btn-sm-icon:first-child');
      var downBtn = display.querySelector('.btn-sm-icon:last-child');
      if (upBtn) {
        upBtn.addEventListener('click', function (e) {
          e.preventDefault();
          if (index > 0) {
            // Swap with previous position
            var _ref7 = [modal.boxPositions[index - 1], modal.boxPositions[index]];
            modal.boxPositions[index] = _ref7[0];
            modal.boxPositions[index - 1] = _ref7[1];
            modal.updateBoxOrderDisplay();
          }
        });
      }
      if (downBtn) {
        downBtn.addEventListener('click', function (e) {
          e.preventDefault();
          if (index < 2) {
            // Swap with next position
            var _ref8 = [modal.boxPositions[index + 1], modal.boxPositions[index]];
            modal.boxPositions[index] = _ref8[0];
            modal.boxPositions[index + 1] = _ref8[1];
            modal.updateBoxOrderDisplay();
          }
        });
      }
    });
  },
  updateBoxOrderDisplay: function updateBoxOrderDisplay() {
    document.querySelectorAll('.box-order-display').forEach(function (display, index) {
      var value = modal.boxPositions[index];
      display.querySelector('.box-order-value').textContent = "H\u1ED9p ".concat(value);

      // Update button states
      var upBtn = display.querySelector('.btn-sm-icon:first-child');
      var downBtn = display.querySelector('.btn-sm-icon:last-child');
      upBtn.disabled = index === 0;
      downBtn.disabled = index === 2;
    });
    document.getElementById('boxPositions').value = JSON.stringify(modal.boxPositions);

    // Re-setup button listeners with new index values
    modal.setupBoxOrder();
  },
  openCreate: function openCreate() {
    modal.currentEditingSession = null;
    modal.selectedIcons = {
      1: '🎁',
      2: '🎁',
      3: '🎁'
    };
    document.getElementById('modalTitle').textContent = 'Tạo phiên chơi mới';
    document.getElementById('sessionForm').reset();
    modal.generateCode();
    modal.boxPositions = [1, 2, 3];
    modal.updateBoxOrderDisplay();

    // Reset icon selection
    document.querySelectorAll('.icon-btn-small').forEach(function (btn) {
      btn.classList.remove('selected');
      if (btn.getAttribute('data-icon') === '🎁') {
        btn.classList.add('selected');
      }
    });

    // Reset preview icons
    document.querySelectorAll('[id^="previewPrize"][id$="Icon"]').forEach(function (span) {
      span.textContent = '🎁';
      span.style.backgroundImage = 'none';
    });
    modal.open();
  },
  openEdit: function openEdit(sessionCode) {
    // Fetch session data
    fetch("/api/sessions/".concat(sessionCode)).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (data.success) {
        modal.currentEditingSession = data.data;
        document.getElementById('modalTitle').textContent = 'Chỉnh sửa phiên chơi';
        modal.populateForm(data.data);
        modal.open();
      } else {
        toast.error('Không thể tải dữ liệu phiên');
      }
    }).catch(function (err) {
      console.error(err);
      toast.error('Lỗi kết nối');
    });
  },
  cloneSession: function cloneSession(sessionCode) {
    fetch("/api/sessions/".concat(sessionCode)).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (!data.success || !data.data) {
        toast.error('Không thể tải dữ liệu phiên để clone');
        return;
      }
      modal.currentEditingSession = null;
      modal.selectedIcons = {
        1: '🎁',
        2: '🎁',
        3: '🎁'
      };
      document.getElementById('sessionForm').reset();
      document.getElementById('modalTitle').textContent = "Clone phi\xEAn ".concat(sessionCode);
      modal.populateForm(data.data);
      modal.generateCode();
      modal.open();
      toast.success('Đã nạp dữ liệu phiên. Hãy lưu để tạo phiên mới với mã mới.');
    }).catch(function (err) {
      console.error(err);
      toast.error('Lỗi kết nối khi clone phiên');
    });
  },
  populateForm: function populateForm(session) {
    var _loop2 = function _loop2() {
      document.querySelector("[name=\"prize_".concat(i, "\"]")).value = session["prize_".concat(i)] || '';
      document.querySelector("[name=\"prize_".concat(i, "_description\"]")).value = session["prize_".concat(i, "_description")] || '';
      document.querySelector("[name=\"prize_".concat(i, "_status\"]")).value = session["prize_".concat(i, "_status")] || 'NORMAL';
      document.querySelector("[name=\"prize_".concat(i, "_is_special\"]")).checked = session["prize_".concat(i, "_is_special")] || false;
      document.querySelector("[name=\"prize_".concat(i, "_cash\"]")).checked = session["prize_".concat(i, "_cash")] || false;

      // Set cash amount
      var cashAmountInput = document.querySelector("[name=\"prize_".concat(i, "_cash_amount\"]"));
      if (cashAmountInput && session["prize_".concat(i, "_cash_amount")]) {
        cashAmountInput.value = session["prize_".concat(i, "_cash_amount")];
      }

      // Set image URL
      var imageUrlInput = document.querySelector("[name=\"prize_".concat(i, "_image_url\"]"));
      if (imageUrlInput && session["prize_".concat(i, "_image_url")]) {
        imageUrlInput.value = session["prize_".concat(i, "_image_url")];
      }

      // Set icon and select the corresponding button
      var icon = session["prize_".concat(i, "_icon")] || '🎁';
      modal.selectedIcons[i] = icon;

      // Mark the corresponding icon button as selected
      var iconGroup = document.querySelector(".icon-group[data-prize=\"".concat(i, "\"]"));
      if (iconGroup) {
        var grid = iconGroup.querySelector('.icon-grid-small');
        if (grid) {
          var buttons = grid.querySelectorAll('.icon-btn-small');
          buttons.forEach(function (btn) {
            if (btn.getAttribute('data-icon') === icon) {
              btn.classList.add('selected');
            } else {
              btn.classList.remove('selected');
            }
          });
        }
      }
    };
    for (var i = 1; i <= 3; i++) {
      _loop2();
    }
    document.getElementById('sessionCode').value = session.session_code || '';
    document.getElementById('isActive').checked = session.is_active !== false;

    // Set box positions
    if (session.box_positions) {
      modal.boxPositions = session.box_positions;
      modal.updateBoxOrderDisplay();
    }
  },
  generateCode: function generateCode() {
    var code = Math.random().toString(36).substring(2, 10).toUpperCase();
    document.getElementById('sessionCode').value = code;
  },
  submitSession: function () {
    var _submitSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
      var sessionForm, formData, sessionCode, prize1, prize2, prize3, sessionData, url, method, response, result, _t11;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.p = _context13.n) {
          case 0:
            sessionForm = document.getElementById('sessionForm');
            formData = new FormData(sessionForm); // Validation
            sessionCode = formData.get('session_code');
            prize1 = formData.get('prize_1');
            prize2 = formData.get('prize_2');
            prize3 = formData.get('prize_3');
            if (!(!sessionCode || sessionCode.trim() === '')) {
              _context13.n = 1;
              break;
            }
            toast.error('Vui lòng nhập mã phiên');
            return _context13.a(2);
          case 1:
            if (!(!prize1 || prize1.trim() === '')) {
              _context13.n = 2;
              break;
            }
            toast.error('Vui lòng nhập tên phần thưởng cho hộp 1');
            return _context13.a(2);
          case 2:
            if (!(!prize2 || prize2.trim() === '')) {
              _context13.n = 3;
              break;
            }
            toast.error('Vui lòng nhập tên phần thưởng cho hộp 2');
            return _context13.a(2);
          case 3:
            if (!(!prize3 || prize3.trim() === '')) {
              _context13.n = 4;
              break;
            }
            toast.error('Vui lòng nhập tên phần thưởng cho hộp 3');
            return _context13.a(2);
          case 4:
            sessionData = {
              session_code: sessionCode,
              prize_1: prize1,
              prize_2: prize2,
              prize_3: prize3,
              prize_1_description: formData.get('prize_1_description') || '',
              prize_2_description: formData.get('prize_2_description') || '',
              prize_3_description: formData.get('prize_3_description') || '',
              prize_1_icon: modal.selectedIcons[1] || '🎁',
              prize_2_icon: modal.selectedIcons[2] || '🎁',
              prize_3_icon: modal.selectedIcons[3] || '🎁',
              prize_1_status: formData.get('prize_1_status') || 'NORMAL',
              prize_2_status: formData.get('prize_2_status') || 'NORMAL',
              prize_3_status: formData.get('prize_3_status') || 'NORMAL',
              prize_1_is_special: formData.get('prize_1_is_special') ? true : false,
              prize_2_is_special: formData.get('prize_2_is_special') ? true : false,
              prize_3_is_special: formData.get('prize_3_is_special') ? true : false,
              prize_1_cash: formData.get('prize_1_cash') ? true : false,
              prize_2_cash: formData.get('prize_2_cash') ? true : false,
              prize_3_cash: formData.get('prize_3_cash') ? true : false,
              prize_1_cash_amount: formData.get('prize_1_cash_amount') ? parseInt(formData.get('prize_1_cash_amount')) : null,
              prize_2_cash_amount: formData.get('prize_2_cash_amount') ? parseInt(formData.get('prize_2_cash_amount')) : null,
              prize_3_cash_amount: formData.get('prize_3_cash_amount') ? parseInt(formData.get('prize_3_cash_amount')) : null,
              prize_1_image_url: formData.get('prize_1_image_url') || null,
              prize_2_image_url: formData.get('prize_2_image_url') || null,
              prize_3_image_url: formData.get('prize_3_image_url') || null,
              is_active: formData.get('is_active') ? true : false,
              box_positions: modal.boxPositions
            };
            console.log('Submitting session data:', sessionData);
            _context13.p = 5;
            url = modal.currentEditingSession ? "/api/sessions/".concat(modal.currentEditingSession.session_code) : '/api/sessions';
            method = modal.currentEditingSession ? 'PUT' : 'POST';
            _context13.n = 6;
            return fetch(url, {
              method: method,
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(sessionData)
            });
          case 6:
            response = _context13.v;
            _context13.n = 7;
            return response.json();
          case 7:
            result = _context13.v;
            if (result.success) {
              toast.success(modal.currentEditingSession ? 'Cập nhật phiên thành công' : 'Tạo phiên thành công');
              modal.close();
              sessions.init(); // Reload sessions
            } else {
              toast.error(result.message || 'Có lỗi xảy ra');
              console.error('API Error:', result);
            }
            _context13.n = 9;
            break;
          case 8:
            _context13.p = 8;
            _t11 = _context13.v;
            console.error('Submit Error:', _t11);
            toast.error('Lỗi kết nối: ' + _t11.message);
          case 9:
            return _context13.a(2);
        }
      }, _callee13, null, [[5, 8]]);
    }));
    function submitSession() {
      return _submitSession.apply(this, arguments);
    }
    return submitSession;
  }(),
  deleteSession: function deleteSession(sessionCode) {
    modal.deleteSessionCode = sessionCode;
    document.getElementById('confirmMessage').textContent = "B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n x\xF3a phi\xEAn ch\u01A1i ".concat(sessionCode, "?");
    modal.openConfirm();
  },
  confirmDelete: function () {
    var _confirmDelete = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
      var sessionCode, response, result, _t12;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.p = _context14.n) {
          case 0:
            sessionCode = modal.deleteSessionCode;
            _context14.p = 1;
            _context14.n = 2;
            return fetch("/api/sessions/".concat(sessionCode), {
              method: 'DELETE'
            });
          case 2:
            response = _context14.v;
            _context14.n = 3;
            return response.json();
          case 3:
            result = _context14.v;
            if (result.success) {
              toast.success('Xóa phiên thành công');
              modal.closeConfirm();
              sessions.init(); // Reload sessions
            } else {
              toast.error(result.message || 'Có lỗi xảy ra');
            }
            _context14.n = 5;
            break;
          case 4:
            _context14.p = 4;
            _t12 = _context14.v;
            console.error(_t12);
            toast.error('Lỗi kết nối');
          case 5:
            return _context14.a(2);
        }
      }, _callee14, null, [[1, 4]]);
    }));
    function confirmDelete() {
      return _confirmDelete.apply(this, arguments);
    }
    return confirmDelete;
  }(),
  open: function open() {
    var modal = document.getElementById('sessionModal');
    var overlay = document.getElementById('modalOverlay');
    console.log('Opening modal...', {
      modalElement: modal,
      overlayElement: overlay,
      modalClasses: modal === null || modal === void 0 ? void 0 : modal.className,
      overlayClasses: overlay === null || overlay === void 0 ? void 0 : overlay.className
    });
    modal === null || modal === void 0 || modal.classList.add('show');
    overlay === null || overlay === void 0 || overlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Verify
    setTimeout(function () {
      console.log('After open:', {
        modalHasShow: modal === null || modal === void 0 ? void 0 : modal.classList.contains('show'),
        overlayHasShow: overlay === null || overlay === void 0 ? void 0 : overlay.classList.contains('show'),
        modalDisplay: window.getComputedStyle(modal).display,
        overlayDisplay: window.getComputedStyle(overlay).display
      });
    }, 100);
  },
  close: function close() {
    var modal = document.getElementById('sessionModal');
    var overlay = document.getElementById('modalOverlay');
    modal === null || modal === void 0 || modal.classList.remove('show');
    overlay === null || overlay === void 0 || overlay.classList.remove('show');
    document.body.style.overflow = '';
    modal.currentEditingSession = null;
    console.log('Modal closed');
  },
  openConfirm: function openConfirm() {
    var _document$getElementB19, _document$getElementB20;
    (_document$getElementB19 = document.getElementById('confirmDeleteModal')) === null || _document$getElementB19 === void 0 || _document$getElementB19.classList.add('show');
    (_document$getElementB20 = document.getElementById('modalOverlay')) === null || _document$getElementB20 === void 0 || _document$getElementB20.classList.add('show');
    document.body.style.overflow = 'hidden';
  },
  closeConfirm: function closeConfirm() {
    var _document$getElementB21, _document$getElementB22;
    (_document$getElementB21 = document.getElementById('confirmDeleteModal')) === null || _document$getElementB21 === void 0 || _document$getElementB21.classList.remove('show');
    (_document$getElementB22 = document.getElementById('modalOverlay')) === null || _document$getElementB22 === void 0 || _document$getElementB22.classList.remove('show');
    document.body.style.overflow = '';
  },
  openPreview: function openPreview(sessionCode) {
    // Fetch session data
    fetch("/api/sessions/".concat(sessionCode)).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (data.success) {
        modal.populatePreview(data.data);
        modal.openPreviewModal();
      } else {
        toast.error('Không thể tải dữ liệu phiên');
      }
    }).catch(function (err) {
      console.error(err);
      toast.error('Lỗi kết nối');
    });
  },
  populatePreview: function populatePreview(session) {
    // Session Info
    document.getElementById('previewSessionCode').textContent = session.session_code || 'N/A';
    document.getElementById('previewSessionStatus').innerHTML = "\n            <span class=\"status-tag ".concat(session.is_active ? 'active' : 'inactive', "\">\n                ").concat(session.is_active ? 'Hoạt động' : 'Không hoạt động', "\n            </span>\n        ");

    // Box Order
    var boxOrder = session.box_positions || [1, 2, 3];
    // Parse if it's a string
    if (typeof boxOrder === 'string') {
      try {
        boxOrder = JSON.parse(boxOrder);
      } catch (e) {
        boxOrder = [1, 2, 3];
      }
    }
    document.getElementById('previewBoxOrder').innerHTML = boxOrder.map(function (box) {
      return "<span style=\"background: var(--primary); padding: 4px 8px; border-radius: 4px; font-weight: 600;\">H\u1ED9p ".concat(box, "</span>");
    }).join('');
    document.getElementById('previewCreatedAt').textContent = session.createdAt || new Date().toLocaleString('vi-VN');
    for (var i = 1; i <= 3; i++) {
      var prizeElement = document.getElementById("previewPrize".concat(i));
      var statusColor = session["prize_".concat(i, "_status")] === 'VIP' ? '#fbbf24' : session["prize_".concat(i, "_status")] === 'UNLUCKY' ? '#ef4444' : '#3b82f6';
      prizeElement.style.borderLeftColor = statusColor;
      var prizeHTML = prizeElement.querySelector('[style*="display: flex"]');
      var nameDiv = prizeElement.querySelector('div:nth-child(2)');
      var descDiv = prizeElement.querySelector('div:nth-child(3)');
      var iconSpan = document.getElementById("previewPrize".concat(i, "Icon"));
      var statusDiv = document.getElementById("previewPrize".concat(i, "Status"));
      nameDiv.textContent = session["prize_".concat(i)] || 'Phần thưởng ' + i;
      descDiv.textContent = session["prize_".concat(i, "_description")] || '';
      if (session["prize_".concat(i, "_image_url")]) {
        iconSpan.style.backgroundImage = "url(".concat(session["prize_".concat(i, "_image_url")], ")");
        iconSpan.style.backgroundSize = 'cover';
        iconSpan.style.backgroundPosition = 'center';
        iconSpan.style.display = 'inline-block';
        iconSpan.style.width = '50px';
        iconSpan.style.height = '50px';
        iconSpan.style.borderRadius = '4px';
        iconSpan.textContent = '';
      } else {
        iconSpan.textContent = session["prize_".concat(i, "_icon")] || '🎁';
        iconSpan.style.backgroundImage = 'none';
      }
      statusDiv.textContent = session["prize_".concat(i, "_status")] || 'NORMAL';
      statusDiv.style.backgroundColor = statusColor;
      if (session["prize_".concat(i, "_cash")] && session["prize_".concat(i, "_cash_amount")]) {
        descDiv.textContent += " (Ti\u1EC1n m\u1EB7t: ".concat(session["prize_".concat(i, "_cash_amount")].toLocaleString('vi-VN'), " VN\u0110)");
      }
    }
    modal.previewSessionCode = sessionCode;
  },
  openPreviewModal: function openPreviewModal() {
    var _document$getElementB23, _document$getElementB24;
    (_document$getElementB23 = document.getElementById('previewModal')) === null || _document$getElementB23 === void 0 || _document$getElementB23.classList.add('show');
    (_document$getElementB24 = document.getElementById('modalOverlay')) === null || _document$getElementB24 === void 0 || _document$getElementB24.classList.add('show');
    document.body.style.overflow = 'hidden';
  },
  closePreviewModal: function closePreviewModal() {
    var _document$getElementB25, _document$getElementB26;
    (_document$getElementB25 = document.getElementById('previewModal')) === null || _document$getElementB25 === void 0 || _document$getElementB25.classList.remove('show');
    (_document$getElementB26 = document.getElementById('modalOverlay')) === null || _document$getElementB26 === void 0 || _document$getElementB26.classList.remove('show');
    document.body.style.overflow = '';
  }
};
(_document$getElementB27 = document.getElementById('confirmDeleteBtn')) === null || _document$getElementB27 === void 0 || _document$getElementB27.addEventListener('click', function () {
  return modal.confirmDelete();
});
var withdrawals = {
  data: [],
  currentFilter: {},
  fetch: function (_fetch4) {
    function fetch() {
      return _fetch4.apply(this, arguments);
    }
    fetch.toString = function () {
      return _fetch4.toString();
    };
    return fetch;
  }(function () {
    var _arguments = arguments,
      _this5 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
      var filters, queryString, url, response, result, _t13;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.p = _context15.n) {
          case 0:
            filters = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {};
            _context15.p = 1;
            queryString = new URLSearchParams(filters).toString();
            url = "/api/withdrawals?".concat(queryString);
            _context15.n = 2;
            return fetch(url);
          case 2:
            response = _context15.v;
            _context15.n = 3;
            return response.json();
          case 3:
            result = _context15.v;
            if (result.success) {
              _this5.data = result.data;
              _this5.render();
              _this5.updateStats();
            } else {
              toast.show(result.message || 'Lỗi khi tải dữ liệu', 'error');
            }
            _context15.n = 5;
            break;
          case 4:
            _context15.p = 4;
            _t13 = _context15.v;
            console.error('Error fetching withdrawals:', _t13);
            toast.show('Lỗi khi kết nối server', 'error');
          case 5:
            return _context15.a(2);
        }
      }, _callee15, null, [[1, 4]]);
    }))();
  }),
  render: function render() {
    var _this6 = this;
    var container = document.getElementById('withdrawalsContainer');
    if (!container) return;
    if (this.data.length === 0) {
      container.innerHTML = "\n                <div style=\"grid-column: 1/-1; text-align: center; padding: 40px;\">\n                    <i class=\"fas fa-inbox\" style=\"font-size: 2em; color: rgba(255,255,255,0.3);\"></i>\n                    <p style=\"margin-top: 10px; color: rgba(255,255,255,0.7);\">Ch\u01B0a c\xF3 y\xEAu c\u1EA7u r\xFAt ti\u1EC1n</p>\n                </div>\n            ";
      return;
    }
    container.innerHTML = this.data.map(function (item) {
      var _item$user, _item$user2, _item$user3, _item$game_session;
      var statusBadges = {
        pending: {
          text: 'Chờ duyệt',
          color: '#fbbf24',
          bgColor: '#fef3c7'
        },
        approved: {
          text: 'Đã duyệt',
          color: '#10b981',
          bgColor: '#d1fae5'
        },
        rejected: {
          text: 'Từ chối',
          color: '#ef4444',
          bgColor: '#fee2e2'
        }
      };
      var statusInfo = statusBadges[item.status] || {
        text: item.status,
        color: '#6b7280',
        bgColor: '#f3f4f6'
      };
      var createdDate = new Date(item.created_at).toLocaleString('vi-VN');
      var approvedDate = item.approved_at ? new Date(item.approved_at).toLocaleString('vi-VN') : 'N/A';
      return "\n                <div style=\"background: linear-gradient(135deg, #1a1f3a 0%, #0f172a 100%); border: 1px solid #6366f1; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1); color: #e0e0e0;\">\n                    <!-- Header -->\n                    <div style=\"display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.3);\">\n                        <div>\n                            <div style=\"font-size: 1.75rem; font-weight: bold; color: #6366f1; margin-bottom: 0.5rem;\">".concat(_this6.formatCurrency(item.amount), "</div>\n                            <span style=\"display: inline-block; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; background: ").concat(statusInfo.bgColor, "; color: ").concat(statusInfo.color, ";\">\n                                ").concat(statusInfo.status === 'approved' ? '✓' : statusInfo.status === 'pending' ? '⏳' : '✕', " ").concat(statusInfo.text, "\n                            </span>\n                        </div>\n                    </div>\n\n                    <!-- User Info -->\n                    <div style=\"margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);\">\n                        <div style=\"font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;\">\uD83D\uDC64 Th\xF4ng tin ng\u01B0\u1EDDi d\xF9ng</div>\n                        <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;\">\n                            <div>\n                                <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">H\u1ECD t\xEAn</div>\n                                <div style=\"color: #ffffff; font-weight: 500;\">").concat(((_item$user = item.user) === null || _item$user === void 0 ? void 0 : _item$user.full_name) || ((_item$user2 = item.user) === null || _item$user2 === void 0 ? void 0 : _item$user2.username) || 'N/A', "</div>\n                            </div>\n                            <div>\n                                <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">Email</div>\n                                <div style=\"color: #ffffff; font-weight: 500;\">").concat(((_item$user3 = item.user) === null || _item$user3 === void 0 ? void 0 : _item$user3.email) || 'N/A', "</div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <!-- Bank Info - Enhanced -->\n                    <div style=\"background: rgba(99, 102, 241, 0.15); border-left: 4px solid #6366f1; margin-bottom: 1.5rem; padding: 1.2rem; border-radius: 0.5rem;\">\n                        <div style=\"font-size: 0.85rem; font-weight: 700; color: #6366f1; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px;\">\uD83C\uDFE6 Th\xF4ng tin t\xE0i kho\u1EA3n ng\xE2n h\xE0ng</div>\n                        <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; font-size: 0.95rem;\">\n                            <!-- Bank Name -->\n                            <div>\n                                <div style=\"color: #a0aec0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;\">Ng\xE2n h\xE0ng</div>\n                                <div style=\"color: ").concat(item.bank_name ? '#10b981' : '#ef4444', "; font-weight: 700; font-size: 1.05rem; display: flex; align-items: center; gap: 6px;\">\n                                    ").concat(item.bank_name ? "\uD83D\uDCCA ".concat(item.bank_name) : '❌ Chưa có thông tin', "\n                                </div>\n                            </div>\n                            <!-- Account Number -->\n                            <div>\n                                <div style=\"color: #a0aec0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;\">S\u1ED1 t\xE0i kho\u1EA3n</div>\n                                <div style=\"color: ").concat(item.account_number ? '#e0e0e0' : '#ef4444', "; font-weight: 700; font-size: 1.05rem; font-family: 'Courier New', 'Monaco', monospace; letter-spacing: 1px; word-break: break-all;\">\n                                    ").concat(item.account_number || '❌ Chưa có thông tin', "\n                                </div>\n                            </div>\n                        </div>\n                        <!-- Account Holder Name -->\n                        <div style=\"margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(99, 102, 241, 0.3);\">\n                            <div style=\"display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;\">\n                                <div style=\"flex: 1;\">\n                                    <div style=\"color: #a0aec0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;\">Ch\u1EE7 t\xE0i kho\u1EA3n</div>\n                                    <div style=\"color: ").concat(item.account_holder_name ? '#e0e0e0' : '#ef4444', "; font-weight: 600; font-size: 1rem;\">\n                                        ").concat(item.account_holder_name || '❌ Chưa có thông tin', "\n                                    </div>\n                                </div>\n                                ").concat(item.account_number ? "\n                                <button onclick=\"copyBankInfo('".concat(item.bank_name || '', "', '").concat(item.account_number, "', '").concat(item.account_holder_name || '', "')\" style=\"padding: 0.5rem 0.75rem; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border: none; color: #ffffff; font-weight: 600; border-radius: 0.375rem; cursor: pointer; font-size: 0.85rem; white-space: nowrap; transition: all 0.2s; flex-shrink: 0; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);\" onmouseover=\"this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(99, 102, 241, 0.4)'\" onmouseout=\"this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(99, 102, 241, 0.3)';\">\n                                    <i class=\"fas fa-copy\"></i> Sao ch\xE9p\n                                </button>\n                                ") : '', "\n                            </div>\n                        </div>\n                    </div>\n\n                    <!-- Session Info -->\n                    <div style=\"margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);\">\n                        <div style=\"font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;\">\uD83C\uDFAE Phi\xEAn ch\u01A1i & H\u1ED9p qu\xE0</div>\n                        <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;\">\n                            <div>\n                                <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">M\xE3 phi\xEAn</div>\n                                <div style=\"color: #fbbf24; font-weight: 500; font-family: 'Courier New', monospace;\">").concat(item.session_code || ((_item$game_session = item.game_session) === null || _item$game_session === void 0 ? void 0 : _item$game_session.code) || 'N/A', "</div>\n                            </div>\n                            <div>\n                                <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">H\u1ED9p \u0111\u01B0\u1EE3c ch\u1ECDn</div>\n                                <div style=\"color: #10b981; font-weight: 500; font-size: 1.1rem;\">\n                                    ").concat(item.selected_box_number ? "\u2705 H\u1ED9p #".concat(item.selected_box_number) : '❌ Chưa chọn', "\n                                </div>\n                            </div>\n                            ").concat(item.prize_name ? "\n                            <div>\n                                <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">Ph\u1EA7n th\u01B0\u1EDFng</div>\n                                <div style=\"color: #ffffff; font-weight: 500;\">".concat(item.prize_name, "</div>\n                            </div>\n                            ") : '', "\n                            ").concat(item.selected_at ? "\n                            <div>\n                                <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">Th\u1EDDi gian ch\u1ECDn</div>\n                                <div style=\"color: #ffffff; font-weight: 500;\">".concat(new Date(item.selected_at).toLocaleString('vi-VN'), "</div>\n                            </div>\n                            ") : '', "\n                            <div>\n                                <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">\u0110\xE3 m\u1EDF</div>\n                                <div style=\"color: #6366f1; font-weight: 500; font-size: 1.1rem;\">2/3</div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <!-- Timeline -->\n                    <div style=\"margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);\">\n                        <div style=\"font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;\">\uD83D\uDCC5 Th\u1EDDi gian</div>\n                        <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;\">\n                            <div>\n                                <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">Y\xEAu c\u1EA7u l\xFAc</div>\n                                <div style=\"color: #ffffff; font-weight: 500;\">").concat(createdDate, "</div>\n                            </div>\n                            <div>\n                                <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">Duy\u1EC7t l\xFAc</div>\n                                <div style=\"color: #ffffff; font-weight: 500;\">").concat(approvedDate, "</div>\n                            </div>\n                        </div>\n                    </div>\n\n                    <!-- Action Buttons -->\n                    <div style=\"display: grid; grid-template-columns: ").concat(item.status === 'pending' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', "; gap: 0.75rem;\">\n                        <button onclick=\"openWithdrawalModal(").concat(item.id, ")\" style=\"padding: 0.6rem; border: 1px solid #6366f1; background: rgba(99, 102, 241, 0.1); color: #6366f1; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;\" onmouseover=\"this.style.backgroundColor='rgba(99, 102, 241, 0.2)'; this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.backgroundColor='rgba(99, 102, 241, 0.1)'; this.style.transform='translateY(0)'\">\n                            <i class=\"fas fa-eye\" style=\"margin-right: 0.35rem;\"></i> Chi ti\u1EBFt\n                        </button>\n                        ").concat(item.status === 'pending' ? "\n                            <button onclick=\"approveWithdrawal(".concat(item.id, ")\" style=\"padding: 0.6rem; border: 1px solid #10b981; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;\" onmouseover=\"this.style.backgroundColor='rgba(16, 185, 129, 0.2)'; this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.backgroundColor='rgba(16, 185, 129, 0.1)'; this.style.transform='translateY(0)'\">\n                                <i class=\"fas fa-check-circle\" style=\"margin-right: 0.35rem;\"></i> Ph\xEA duy\u1EC7t\n                            </button>\n                            <button onclick=\"rejectWithdrawal(").concat(item.id, ")\" style=\"padding: 0.6rem; border: 1px solid #ef4444; background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;\" onmouseover=\"this.style.backgroundColor='rgba(239, 68, 68, 0.2)'; this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.backgroundColor='rgba(239, 68, 68, 0.1)'; this.style.transform='translateY(0)'\">\n                                <i class=\"fas fa-times-circle\" style=\"margin-right: 0.35rem;\"></i> T\u1EEB ch\u1ED1i\n                            </button>\n                        ") : '', "\n                        <button onclick=\"deleteWithdrawal(").concat(item.id, ")\" style=\"padding: 0.6rem; border: 1px solid #f87171; background: rgba(248, 113, 113, 0.1); color: #f87171; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;\" onmouseover=\"this.style.backgroundColor='rgba(248, 113, 113, 0.2)'; this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.backgroundColor='rgba(248, 113, 113, 0.1)'; this.style.transform='translateY(0)'\">\n                            <i class=\"fas fa-trash\" style=\"margin-right: 0.35rem;\"></i> X\xF3a\n                        </button>\n                    </div>\n                </div>\n            ");
    }).join('');
  },
  updateStats: function updateStats() {
    var pending = this.data.filter(function (w) {
      return w.status === 'pending';
    }).length;
    var approved = this.data.filter(function (w) {
      return w.status === 'approved';
    }).length;
    var rejected = this.data.filter(function (w) {
      return w.status === 'rejected';
    }).length;
    document.getElementById('withdrawalsPending').textContent = pending;
    document.getElementById('withdrawalsApproved').textContent = approved;
    document.getElementById('withdrawalsRejected').textContent = rejected;
    document.getElementById('withdrawalsTotal').textContent = this.data.length;
  },
  approve: function approve(id) {
    var _this7 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.n) {
          case 0:
            NotificationModal.confirm('Xác nhận duyệt', 'Bạn chắc chắn muốn duyệt yêu cầu này?', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
              var response, result, _t14;
              return _regenerator().w(function (_context16) {
                while (1) switch (_context16.p = _context16.n) {
                  case 0:
                    _context16.p = 0;
                    _context16.n = 1;
                    return fetch("/api/withdrawals/".concat(id, "/approve"), {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    });
                  case 1:
                    response = _context16.v;
                    _context16.n = 2;
                    return response.json();
                  case 2:
                    result = _context16.v;
                    if (result.success) {
                      toast.show('Duyệt thành công', 'success');
                      _this7.fetch();
                    } else {
                      toast.show(result.message || 'Lỗi khi duyệt', 'error');
                    }
                    _context16.n = 4;
                    break;
                  case 3:
                    _context16.p = 3;
                    _t14 = _context16.v;
                    console.error('Error:', _t14);
                    toast.show('Lỗi khi kết nối server', 'error');
                  case 4:
                    return _context16.a(2);
                }
              }, _callee16, null, [[0, 3]]);
            })));
          case 1:
            return _context17.a(2);
        }
      }, _callee17);
    }))();
  },
  reject: function reject(id) {
    var _this8 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
      var reason, response, result, _t15;
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.p = _context18.n) {
          case 0:
            reason = prompt('Nhập lý do từ chối:');
            if (!(reason !== null)) {
              _context18.n = 5;
              break;
            }
            _context18.p = 1;
            _context18.n = 2;
            return fetch("/api/withdrawals/".concat(id, "/reject"), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                rejection_reason: reason
              })
            });
          case 2:
            response = _context18.v;
            _context18.n = 3;
            return response.json();
          case 3:
            result = _context18.v;
            if (result.success) {
              toast.show('Từ chối thành công', 'success');
              _this8.fetch();
            } else {
              toast.show(result.message || 'Lỗi khi từ chối', 'error');
            }
            _context18.n = 5;
            break;
          case 4:
            _context18.p = 4;
            _t15 = _context18.v;
            console.error('Error:', _t15);
            toast.show('Lỗi khi kết nối server', 'error');
          case 5:
            return _context18.a(2);
        }
      }, _callee18, null, [[1, 4]]);
    }))();
  },
  delete: function _delete(id) {
    var _this9 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
      return _regenerator().w(function (_context20) {
        while (1) switch (_context20.n) {
          case 0:
            NotificationModal.confirm('Xác nhận xóa', 'Bạn chắc chắn muốn xóa yêu cầu này?', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
              var response, result, _t16;
              return _regenerator().w(function (_context19) {
                while (1) switch (_context19.p = _context19.n) {
                  case 0:
                    _context19.p = 0;
                    _context19.n = 1;
                    return fetch("/api/withdrawals/".concat(id), {
                      method: 'DELETE'
                    });
                  case 1:
                    response = _context19.v;
                    _context19.n = 2;
                    return response.json();
                  case 2:
                    result = _context19.v;
                    if (result.success) {
                      toast.show('Xóa thành công', 'success');
                      _this9.fetch();
                    } else {
                      toast.show(result.message || 'Lỗi khi xóa', 'error');
                    }
                    _context19.n = 4;
                    break;
                  case 3:
                    _context19.p = 3;
                    _t16 = _context19.v;
                    console.error('Error:', _t16);
                    toast.show('Lỗi khi kết nối server', 'error');
                  case 4:
                    return _context19.a(2);
                }
              }, _callee19, null, [[0, 3]]);
            })));
          case 1:
            return _context20.a(2);
        }
      }, _callee20);
    }))();
  },
  view: function view(id) {
    var item = this.data.find(function (w) {
      return w.id === id;
    });
    if (item) {
      var _item$user4, _item$user5;
      var details = "Ng\u01B0\u1EDDi d\xF9ng: ".concat(((_item$user4 = item.user) === null || _item$user4 === void 0 ? void 0 : _item$user4.full_name) || ((_item$user5 = item.user) === null || _item$user5 === void 0 ? void 0 : _item$user5.username), "\nS\u1ED1 ti\u1EC1n: ").concat(this.formatCurrency(item.amount), "\nNg\xE2n h\xE0ng: ").concat(item.bank_name, "\nS\u1ED1 t\xE0i kho\u1EA3n: ").concat(item.account_number, "\nT\xEAn ch\u1EE7: ").concat(item.account_holder, "\nTr\u1EA1ng th\xE1i: ").concat(item.status, "\nGhi ch\xFA: ").concat(item.notes || 'N/A');
      NotificationModal.show('Chi tiết rút tiền', details, 'info');
    }
  },
  formatCurrency: function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
};
var giftExchanges = {
  data: [],
  currentFilter: {},
  fetch: function (_fetch5) {
    function fetch() {
      return _fetch5.apply(this, arguments);
    }
    fetch.toString = function () {
      return _fetch5.toString();
    };
    return fetch;
  }(function () {
    var _arguments2 = arguments,
      _this0 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
      var filters, queryString, url, response, result, _t17;
      return _regenerator().w(function (_context21) {
        while (1) switch (_context21.p = _context21.n) {
          case 0:
            filters = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : {};
            _context21.p = 1;
            queryString = new URLSearchParams(filters).toString();
            url = "/api/gift-exchanges?".concat(queryString);
            _context21.n = 2;
            return fetch(url);
          case 2:
            response = _context21.v;
            _context21.n = 3;
            return response.json();
          case 3:
            result = _context21.v;
            if (result.success) {
              _this0.data = result.data;
              _this0.render();
              _this0.updateStats();
            } else {
              toast.show(result.message || 'Lỗi khi tải dữ liệu', 'error');
            }
            _context21.n = 5;
            break;
          case 4:
            _context21.p = 4;
            _t17 = _context21.v;
            console.error('Error fetching gift exchanges:', _t17);
            toast.show('Lỗi khi kết nối server', 'error');
          case 5:
            return _context21.a(2);
        }
      }, _callee21, null, [[1, 4]]);
    }))();
  }),
  render: function render() {
    var container = document.getElementById('giftsContainer');
    var tbody = document.getElementById('giftsList');
    if (container) {
      if (this.data.length === 0) {
        container.innerHTML = "\n                    <div style=\"grid-column: 1/-1; text-align: center; padding: 40px;\">\n                        <i class=\"fas fa-inbox\" style=\"font-size: 2em; color: rgba(255,255,255,0.3);\"></i>\n                        <p style=\"margin-top: 10px; color: rgba(255,255,255,0.7);\">Ch\u01B0a c\xF3 y\xEAu c\u1EA7u qu\xE0 t\u1EB7ng</p>\n                    </div>\n                ";
        return;
      }
      container.innerHTML = this.data.map(function (item) {
        var _item$session, _item$session2;
        var statusBadges = {
          pending: {
            text: 'Chờ duyệt',
            color: '#fbbf24',
            bgColor: '#fef3c7'
          },
          approved: {
            text: 'Đã duyệt',
            color: '#10b981',
            bgColor: '#d1fae5'
          },
          rejected: {
            text: 'Từ chối',
            color: '#ef4444',
            bgColor: '#fee2e2'
          },
          shipped: {
            text: 'Đã giao',
            color: '#6366f1',
            bgColor: '#e0e7ff'
          }
        };
        var statusInfo = statusBadges[item.status] || {
          text: item.status,
          color: '#6b7280',
          bgColor: '#f3f4f6'
        };
        var createdDate = new Date(item.created_at).toLocaleString('vi-VN');
        return "\n                    <div style=\"background: linear-gradient(135deg, #1a1f3a 0%, #0f172a 100%); border: 1px solid #6366f1; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1); color: #e0e0e0;\">\n                        <!-- Header -->\n                        <div style=\"display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.3);\">\n                            <div>\n                                <div style=\"font-size: 1.75rem; font-weight: bold; color: #6366f1; margin-bottom: 0.5rem;\">\uD83C\uDF81 ".concat(item.recipient_name || 'N/A', "</div>\n                                <span style=\"display: inline-block; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; background: ").concat(statusInfo.bgColor, "; color: ").concat(statusInfo.color, ";\">\n                                    ").concat(statusInfo.status === 'approved' ? '✓' : statusInfo.status === 'pending' ? '⏳' : statusInfo.status === 'shipped' ? '✈️' : '✕', " ").concat(statusInfo.text, "\n                                </span>\n                            </div>\n                        </div>\n\n                        <!-- Recipient Info -->\n                        <div style=\"margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);\">\n                            <div style=\"font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;\">\uD83D\uDC64 Th\xF4ng tin ng\u01B0\u1EDDi nh\u1EADn</div>\n                            <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;\">\n                                <div>\n                                    <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">T\xEAn ng\u01B0\u1EDDi nh\u1EADn *</div>\n                                    <div style=\"color: #ffffff; font-weight: 500;\">").concat(item.recipient_name || 'N/A', "</div>\n                                </div>\n                                <div>\n                                    <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">S\u1ED1 \u0111i\u1EC7n tho\u1EA1i</div>\n                                    <div style=\"color: #ffffff; font-weight: 500; font-family: 'Courier New', monospace;\">").concat(item.phone || 'N/A', "</div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <!-- Address & Delivery Info -->\n                        <div style=\"margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);\">\n                            <div style=\"font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;\">\uD83D\uDCCD \u0110\u1ECBa ch\u1EC9 giao h\xE0ng</div>\n                            <div style=\"display: grid; grid-template-columns: 1fr; gap: 1rem; font-size: 0.9rem;\">\n                                <div>\n                                    <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">\u0110\u1ECBa ch\u1EC9</div>\n                                    <div style=\"color: #ffffff; font-weight: 500;\">").concat(item.address || 'N/A', "</div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <!-- Session Info -->\n                        ").concat(item.session ? "\n                            <div style=\"margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);\">\n                                <div style=\"font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;\">\uD83C\uDFAE Phi\xEAn ch\u01A1i</div>\n                                <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;\">\n                                    <div>\n                                        <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">M\xE3 phi\xEAn</div>\n                                        <div style=\"color: #fbbf24; font-weight: 500; font-family: 'Courier New', monospace;\">".concat(((_item$session = item.session) === null || _item$session === void 0 ? void 0 : _item$session.code) || 'N/A', "</div>\n                                    </div>\n                                    <div>\n                                        <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">Ng\xE0y t\u1EA1o</div>\n                                        <div style=\"color: #ffffff; font-weight: 500;\">").concat((_item$session2 = item.session) !== null && _item$session2 !== void 0 && _item$session2.created_at ? new Date(item.session.created_at).toLocaleDateString('vi-VN') : 'N/A', "</div>\n                                    </div>\n                                    <div>\n                                        <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">T\u1ED5ng h\u1ED9p</div>\n                                        <div style=\"color: #10b981; font-weight: 500;\">3/3 \uD83C\uDF81</div>\n                                    </div>\n                                    <div>\n                                        <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">H\u1ED9p m\u1EDF</div>\n                                        <div style=\"color: #6366f1; font-weight: 500;\">2/3</div>\n                                    </div>\n                                </div>\n                            </div>\n                        ") : '', "\n\n                        <!-- Prize Info -->\n                        ").concat(item.prize_info ? "\n                            <div style=\"margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);\">\n                                <div style=\"font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;\">\uD83C\uDFC6 Ph\u1EA7n qu\xE0</div>\n                                <div style=\"color: #ffffff; font-weight: 500; font-size: 0.95rem;\">".concat(item.prize_info.name || 'N/A', "</div>\n                                <div style=\"color: #a0a0a0; font-size: 0.85rem; margin-top: 0.25rem;\">").concat(item.prize_info.description || '', "</div>\n                            </div>\n                        ") : '', "\n\n                        <!-- Box Selection Info -->\n                        <div style=\"margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);\">\n                            <div style=\"font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase;\">\n                                \uD83C\uDFAE Phi\xEAn ch\u01A1i & H\u1ED9p qu\xE0\n                            </div>\n                            <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;\">\n                                <div>\n                                    <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">H\u1ED9p \u0111\u01B0\u1EE3c ch\u1ECDn</div>\n                                    <div style=\"color: #10b981; font-weight: 500; font-size: 1.1rem;\">\n                                        ").concat(item.selected_box_number ? "\u2705 H\u1ED9p #".concat(item.selected_box_number) : '❌ Chưa chọn', "\n                                    </div>\n                                </div>\n                                ").concat(item.prize_name ? "\n                                    <div>\n                                        <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">Ph\u1EA7n th\u01B0\u1EDFng</div>\n                                        <div style=\"color: #ffffff; font-weight: 500;\">".concat(item.prize_name, "</div>\n                                    </div>\n                                ") : '', "\n                            </div>\n                            ").concat(item.selected_at ? "\n                                <div style=\"margin-top: 0.75rem; color: #a0a0a0; font-size: 0.8rem;\">\n                                    \uD83D\uDCCD Ch\u1ECDn l\xFAc: ".concat(new Date(item.selected_at).toLocaleString('vi-VN'), "\n                                </div>\n                            ") : '', "\n                        </div>\n\n                        <!-- Notes -->\n                        ").concat(item.notes ? "\n                            <div style=\"margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);\">\n                                <div style=\"font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;\">\uD83D\uDCDD Ghi ch\xFA</div>\n                                <div style=\"color: #e0e0e0; font-size: 0.9rem;\">".concat(item.notes, "</div>\n                            </div>\n                        ") : '', "\n\n                        <!-- Timeline -->\n                        <div style=\"margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99, 102, 241, 0.2);\">\n                            <div style=\"font-size: 0.85rem; font-weight: 600; color: #6366f1; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;\">\uD83D\uDCC5 Th\u1EDDi gian</div>\n                            <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem;\">\n                                <div>\n                                    <div style=\"color: #a0a0a0; font-size: 0.8rem; margin-bottom: 0.25rem;\">T\u1EA1o y\xEAu c\u1EA7u l\xFAc</div>\n                                    <div style=\"color: #ffffff; font-weight: 500;\">").concat(createdDate, "</div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <!-- Action Buttons -->\n                        <div style=\"display: grid; grid-template-columns: ").concat(item.status === 'pending' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', "; gap: 0.75rem;\">\n                            <button onclick=\"openGiftModal(").concat(item.id, ")\" style=\"padding: 0.6rem; border: 1px solid #6366f1; background: rgba(99, 102, 241, 0.1); color: #6366f1; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;\" onmouseover=\"this.style.backgroundColor='rgba(99, 102, 241, 0.2)'; this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.backgroundColor='rgba(99, 102, 241, 0.1)'; this.style.transform='translateY(0)'\">\n                                <i class=\"fas fa-eye\" style=\"margin-right: 0.35rem;\"></i> Chi ti\u1EBFt\n                            </button>\n                            ").concat(item.status === 'pending' ? "\n                                <button onclick=\"approveGift(".concat(item.id, ")\" style=\"padding: 0.6rem; border: 1px solid #10b981; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;\" onmouseover=\"this.style.backgroundColor='rgba(16, 185, 129, 0.2)'; this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.backgroundColor='rgba(16, 185, 129, 0.1)'; this.style.transform='translateY(0)'\">\n                                    <i class=\"fas fa-check-circle\" style=\"margin-right: 0.35rem;\"></i> Ph\xEA duy\u1EC7t\n                                </button>\n                                <button onclick=\"rejectGift(").concat(item.id, ")\" style=\"padding: 0.6rem; border: 1px solid #ef4444; background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;\" onmouseover=\"this.style.backgroundColor='rgba(239, 68, 68, 0.2)'; this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.backgroundColor='rgba(239, 68, 68, 0.1)'; this.style.transform='translateY(0)'\">\n                                    <i class=\"fas fa-times-circle\" style=\"margin-right: 0.35rem;\"></i> T\u1EEB ch\u1ED1i\n                                </button>\n                            ") : '', "\n                            <button onclick=\"deleteGift(").concat(item.id, ")\" style=\"padding: 0.6rem; border: 1px solid #f87171; background: rgba(248, 113, 113, 0.1); color: #f87171; border-radius: 0.375rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s;\" onmouseover=\"this.style.backgroundColor='rgba(248, 113, 113, 0.2)'; this.style.transform='translateY(-2px)'\" onmouseout=\"this.style.backgroundColor='rgba(248, 113, 113, 0.1)'; this.style.transform='translateY(0)'\">\n                                <i class=\"fas fa-trash\" style=\"margin-right: 0.35rem;\"></i> X\xF3a\n                            </button>\n                        </div>\n                    </div>\n                ");
      }).join('');
      return;
    }
    if (!tbody) return;
    if (this.data.length === 0) {
      tbody.innerHTML = "<tr class=\"empty-row\"><td colspan=\"7\" style=\"text-align: center; padding: 40px;\"><i class=\"fas fa-inbox\" style=\"font-size: 2em; color: rgba(255,255,255,0.3);\"></i><p style=\"margin-top: 10px; color: rgba(255,255,255,0.7);\">Ch\u01B0a c\xF3 y\xEAu c\u1EA7u qu\xE0 t\u1EB7ng</p></td></tr>";
      return;
    }
    tbody.innerHTML = this.data.map(function (item) {
      var _item$user6, _item$user7;
      var statusBadges = {
        pending: 'Chờ duyệt',
        approved: 'Đã duyệt',
        rejected: 'Từ chối'
      };
      return "\n                <tr>\n                    <td>".concat(((_item$user6 = item.user) === null || _item$user6 === void 0 ? void 0 : _item$user6.full_name) || ((_item$user7 = item.user) === null || _item$user7 === void 0 ? void 0 : _item$user7.username) || 'N/A', "</td>\n                    <td>").concat(item.recipient_name, "</td>\n                    <td>").concat(item.address.substring(0, 30), "...</td>\n                    <td>").concat(item.phone, "</td>\n                    <td><span class=\"status-badge ").concat(item.status, "\">").concat(statusBadges[item.status] || item.status, "</span></td>\n                    <td>").concat(new Date(item.created_at).toLocaleDateString('vi-VN'), "</td>\n                    <td>\n                        <div class=\"action-buttons\">\n                            <button class=\"btn-sm btn-view\" onclick=\"openGiftModal(").concat(item.id, ")\" title=\"Xem chi ti\u1EBFt\">\n                                <i class=\"fas fa-eye\"></i>\n                            </button>\n                        </div>\n                    </td>\n                </tr>\n            ");
    }).join('');
  },
  updateStats: function updateStats() {
    var pending = this.data.filter(function (g) {
      return g.status === 'pending';
    }).length;
    var approved = this.data.filter(function (g) {
      return g.status === 'approved';
    }).length;
    var rejected = this.data.filter(function (g) {
      return g.status === 'rejected';
    }).length;
    document.getElementById('giftsPending').textContent = pending;
    document.getElementById('giftsApproved').textContent = approved;
    document.getElementById('giftsRejected').textContent = rejected;
    document.getElementById('giftsTotal').textContent = this.data.length;
  },
  approve: function approve(id) {
    var _this1 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.n) {
          case 0:
            NotificationModal.confirm('Xác nhận duyệt', 'Bạn chắc chắn muốn duyệt yêu cầu này?', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
              var response, result, _t18;
              return _regenerator().w(function (_context22) {
                while (1) switch (_context22.p = _context22.n) {
                  case 0:
                    _context22.p = 0;
                    _context22.n = 1;
                    return fetch("/api/gift-exchanges/".concat(id, "/approve"), {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    });
                  case 1:
                    response = _context22.v;
                    _context22.n = 2;
                    return response.json();
                  case 2:
                    result = _context22.v;
                    if (result.success) {
                      toast.show('Duyệt thành công', 'success');
                      _this1.fetch();
                    } else {
                      toast.show(result.message || 'Lỗi khi duyệt', 'error');
                    }
                    _context22.n = 4;
                    break;
                  case 3:
                    _context22.p = 3;
                    _t18 = _context22.v;
                    console.error('Error:', _t18);
                    toast.show('Lỗi khi kết nối server', 'error');
                  case 4:
                    return _context22.a(2);
                }
              }, _callee22, null, [[0, 3]]);
            })));
          case 1:
            return _context23.a(2);
        }
      }, _callee23);
    }))();
  },
  reject: function reject(id) {
    var _this10 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
      var reason, response, result, _t19;
      return _regenerator().w(function (_context24) {
        while (1) switch (_context24.p = _context24.n) {
          case 0:
            reason = prompt('Nhập lý do từ chối:');
            if (!(reason !== null)) {
              _context24.n = 5;
              break;
            }
            _context24.p = 1;
            _context24.n = 2;
            return fetch("/api/gift-exchanges/".concat(id, "/reject"), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                rejection_reason: reason
              })
            });
          case 2:
            response = _context24.v;
            _context24.n = 3;
            return response.json();
          case 3:
            result = _context24.v;
            if (result.success) {
              toast.show('Từ chối thành công', 'success');
              _this10.fetch();
            } else {
              toast.show(result.message || 'Lỗi khi từ chối', 'error');
            }
            _context24.n = 5;
            break;
          case 4:
            _context24.p = 4;
            _t19 = _context24.v;
            console.error('Error:', _t19);
            toast.show('Lỗi khi kết nối server', 'error');
          case 5:
            return _context24.a(2);
        }
      }, _callee24, null, [[1, 4]]);
    }))();
  },
  delete: function _delete(id) {
    var _this11 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26() {
      return _regenerator().w(function (_context26) {
        while (1) switch (_context26.n) {
          case 0:
            NotificationModal.confirm('Xác nhận xóa', 'Bạn chắc chắn muốn xóa yêu cầu này?', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
              var response, result, _t20;
              return _regenerator().w(function (_context25) {
                while (1) switch (_context25.p = _context25.n) {
                  case 0:
                    _context25.p = 0;
                    _context25.n = 1;
                    return fetch("/api/gift-exchanges/".concat(id), {
                      method: 'DELETE'
                    });
                  case 1:
                    response = _context25.v;
                    _context25.n = 2;
                    return response.json();
                  case 2:
                    result = _context25.v;
                    if (result.success) {
                      toast.show('Xóa thành công', 'success');
                      _this11.fetch();
                    } else {
                      toast.show(result.message || 'Lỗi khi xóa', 'error');
                    }
                    _context25.n = 4;
                    break;
                  case 3:
                    _context25.p = 3;
                    _t20 = _context25.v;
                    console.error('Error:', _t20);
                    toast.show('Lỗi khi kết nối server', 'error');
                  case 4:
                    return _context25.a(2);
                }
              }, _callee25, null, [[0, 3]]);
            })));
          case 1:
            return _context26.a(2);
        }
      }, _callee26);
    }))();
  },
  view: function view(id) {
    var item = this.data.find(function (g) {
      return g.id === id;
    });
    if (item) {
      var _item$user8, _item$user9;
      var details = "Ng\u01B0\u1EDDi d\xF9ng: ".concat(((_item$user8 = item.user) === null || _item$user8 === void 0 ? void 0 : _item$user8.full_name) || ((_item$user9 = item.user) === null || _item$user9 === void 0 ? void 0 : _item$user9.username), "\nT\xEAn nh\u1EADn: ").concat(item.recipient_name, "\n\u0110\u1ECBa ch\u1EC9: ").concat(item.address, "\nS\u0110T: ").concat(item.phone, "\nGhi ch\xFA: ").concat(item.notes || 'N/A', "\nTr\u1EA1ng th\xE1i: ").concat(item.status);
      NotificationModal.show('Chi tiết trao đổi quà', details, 'info');
    }
  }
};
var originalNavInit = navigation.init;
navigation.init = function () {
  originalNavInit.call(this);
  document.querySelectorAll('.nav-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = this.getAttribute('data-tab');
      setTimeout(function () {
        if (tab === 'sessions') {
          filters.initSessionFilters();
          sessions.fetch();
        } else if (tab === 'withdrawals') {
          filters.initWithdrawalFilters();
          withdrawals.fetch();
        } else if (tab === 'gifts') {
          filters.initGiftFilters();
          giftExchanges.fetch();
        } else if (tab === 'users') {
          filters.initUserFilters();
          users.fetch();
        }
      }, 100);
    });
  });
};
users.fetch = users.fetchFromAPI = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
  var response, result, _t21;
  return _regenerator().w(function (_context27) {
    while (1) switch (_context27.p = _context27.n) {
      case 0:
        _context27.p = 0;
        _context27.n = 1;
        return fetch('/api/users');
      case 1:
        response = _context27.v;
        _context27.n = 2;
        return response.json();
      case 2:
        result = _context27.v;
        if (result.success) {
          this.data = result.data;
          this.renderTable();
          this.updateCount();
        }
        _context27.n = 4;
        break;
      case 3:
        _context27.p = 3;
        _t21 = _context27.v;
        console.error('Error fetching users:', _t21);
      case 4:
        return _context27.a(2);
    }
  }, _callee27, this, [[0, 3]]);
}));
var currentEditingUserId = null;
var allPermissions = [];
function openUserModal() {
  document.getElementById('userModal').style.display = 'block';
  document.getElementById('modalOverlay').classList.add('show');
}
function closeUserModal() {
  document.getElementById('userModal').style.display = 'none';
  document.getElementById('modalOverlay').classList.remove('show');
  document.getElementById('userForm').reset();
  currentEditingUserId = null;
}
function initUserManagement() {
  return _initUserManagement.apply(this, arguments);
}
function _initUserManagement() {
  _initUserManagement = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33() {
    var addUserBtn, userForm;
    return _regenerator().w(function (_context33) {
      while (1) switch (_context33.n) {
        case 0:
          console.log('Initializing user management...');
          _context33.n = 1;
          return loadPermissions();
        case 1:
          addUserBtn = document.getElementById('addUserBtn');
          userForm = document.getElementById('userForm');
          if (addUserBtn) {
            addUserBtn.addEventListener('click', function () {
              console.log('Add user button clicked');
              currentEditingUserId = null;
              var title = document.getElementById('userModalTitle');
              if (title) title.innerHTML = '<i class="fas fa-user-plus"></i> Thêm người dùng';
              var submitText = document.getElementById('userSubmitText');
              if (submitText) submitText.textContent = 'Tạo';
              var pwdLabel = document.getElementById('userPasswordLabel');
              if (pwdLabel) pwdLabel.style.display = 'inline';
              var confirmLabel = document.getElementById('userConfirmPasswordLabel');
              if (confirmLabel) confirmLabel.style.display = 'inline';
              var hint = document.getElementById('userPasswordHint');
              if (hint) hint.style.display = 'none';
              var form = document.getElementById('userForm');
              if (form) form.reset();
              openUserModal();
            });
          } else {
            console.warn('Add user button not found');
          }
          if (userForm) {
            userForm.addEventListener('submit', handleUserSubmit);
          } else {
            console.warn('User form not found');
          }
        case 2:
          return _context33.a(2);
      }
    }, _callee33);
  }));
  return _initUserManagement.apply(this, arguments);
}
function loadPermissions() {
  return _loadPermissions.apply(this, arguments);
}
function _loadPermissions() {
  _loadPermissions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34() {
    var response, result, _t26;
    return _regenerator().w(function (_context34) {
      while (1) switch (_context34.p = _context34.n) {
        case 0:
          _context34.p = 0;
          _context34.n = 1;
          return fetch('/api/permissions');
        case 1:
          response = _context34.v;
          _context34.n = 2;
          return response.json();
        case 2:
          result = _context34.v;
          if (result.success) {
            allPermissions = result.data;
          }
          _context34.n = 4;
          break;
        case 3:
          _context34.p = 3;
          _t26 = _context34.v;
          console.error('Error loading permissions:', _t26);
        case 4:
          return _context34.a(2);
      }
    }, _callee34, null, [[0, 3]]);
  }));
  return _loadPermissions.apply(this, arguments);
}
function handleUserSubmit(_x9) {
  return _handleUserSubmit.apply(this, arguments);
}
function _handleUserSubmit() {
  _handleUserSubmit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35(e) {
    var username, email, fullName, role, password, passwordConfirm, isActive, userData, url, method, response, error, _t27;
    return _regenerator().w(function (_context35) {
      while (1) switch (_context35.p = _context35.n) {
        case 0:
          e.preventDefault();
          username = document.getElementById('userUsername').value.trim();
          email = document.getElementById('userEmail').value.trim();
          fullName = document.getElementById('userFullName').value.trim();
          role = document.getElementById('userRole').value;
          password = document.getElementById('userPassword').value;
          passwordConfirm = document.getElementById('userPasswordConfirm').value;
          isActive = document.getElementById('userIsActive').checked;
          if (!(!username || !email)) {
            _context35.n = 1;
            break;
          }
          NotificationModal.show('Lỗi', 'Vui lòng điền tên người dùng và email', 'error');
          return _context35.a(2);
        case 1:
          if (!(!currentEditingUserId && !password)) {
            _context35.n = 2;
            break;
          }
          NotificationModal.show('Lỗi', 'Vui lòng nhập mật khẩu', 'error');
          return _context35.a(2);
        case 2:
          if (!(password && password !== passwordConfirm)) {
            _context35.n = 3;
            break;
          }
          NotificationModal.show('Lỗi', 'Mật khẩu xác nhận không khớp', 'error');
          return _context35.a(2);
        case 3:
          userData = {
            username: username,
            email: email,
            full_name: fullName,
            role: role,
            is_active: isActive
          };
          if (password) {
            userData.password = password;
          }
          _context35.p = 4;
          url = currentEditingUserId ? "/api/users/".concat(currentEditingUserId) : '/api/users';
          method = currentEditingUserId ? 'PUT' : 'POST';
          _context35.n = 5;
          return fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });
        case 5:
          response = _context35.v;
          if (!response.ok) {
            _context35.n = 6;
            break;
          }
          toast.success(currentEditingUserId ? 'Cập nhật thành công' : 'Tạo tài khoản thành công');
          closeUserModal();
          users.fetchFromAPI();
          _context35.n = 8;
          break;
        case 6:
          _context35.n = 7;
          return response.json();
        case 7:
          error = _context35.v;
          NotificationModal.show('Lỗi', error.message || 'Không thể lưu tài khoản', 'error');
        case 8:
          _context35.n = 10;
          break;
        case 9:
          _context35.p = 9;
          _t27 = _context35.v;
          console.error('Error saving user:', _t27);
          NotificationModal.show('Lỗi', 'Lỗi kết nối: ' + _t27.message, 'error');
        case 10:
          return _context35.a(2);
      }
    }, _callee35, null, [[4, 9]]);
  }));
  return _handleUserSubmit.apply(this, arguments);
}
function editUser(userId) {
  var user = users.data.find(function (u) {
    return u.id === userId;
  });
  if (!user) return;
  currentEditingUserId = userId;
  document.getElementById('userUsername').value = user.username;
  document.getElementById('userEmail').value = user.email;
  document.getElementById('userFullName').value = user.full_name || '';
  document.getElementById('userRole').value = user.role || 'user';
  document.getElementById('userPassword').value = '';
  document.getElementById('userPasswordConfirm').value = '';
  document.getElementById('userIsActive').checked = user.is_active !== false;
  document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user-edit"></i> Chỉnh sửa người dùng';
  document.getElementById('userSubmitText').textContent = 'Lưu';
  document.getElementById('userPasswordLabel').style.display = 'none';
  document.getElementById('userConfirmPasswordLabel').style.display = 'none';
  document.getElementById('userPasswordHint').style.display = 'block';
  openUserModal();
}
function deleteUser(_x0) {
  return _deleteUser.apply(this, arguments);
}
function _deleteUser() {
  _deleteUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37(userId) {
    var user;
    return _regenerator().w(function (_context37) {
      while (1) switch (_context37.n) {
        case 0:
          user = users.data.find(function (u) {
            return u.id === userId;
          });
          if (user) {
            _context37.n = 1;
            break;
          }
          return _context37.a(2);
        case 1:
          NotificationModal.confirm('Xác nhận xóa', "B\u1EA1n c\xF3 ch\u1EAFc mu\u1ED1n x\xF3a ng\u01B0\u1EDDi d\xF9ng \"".concat(user.username, "\"?"), /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36() {
            var response, _t28;
            return _regenerator().w(function (_context36) {
              while (1) switch (_context36.p = _context36.n) {
                case 0:
                  _context36.p = 0;
                  _context36.n = 1;
                  return fetch("/api/users/".concat(userId), {
                    method: 'DELETE'
                  });
                case 1:
                  response = _context36.v;
                  if (response.ok) {
                    toast.success('Xóa người dùng thành công');
                    users.fetchFromAPI();
                  } else {
                    NotificationModal.show('Lỗi', 'Lỗi khi xóa người dùng', 'error');
                  }
                  _context36.n = 3;
                  break;
                case 2:
                  _context36.p = 2;
                  _t28 = _context36.v;
                  console.error('Error deleting user:', _t28);
                  NotificationModal.show('Lỗi', 'Lỗi kết nối', 'error');
                case 3:
                  return _context36.a(2);
              }
            }, _callee36, null, [[0, 2]]);
          })));
        case 2:
          return _context37.a(2);
      }
    }, _callee37);
  }));
  return _deleteUser.apply(this, arguments);
}
function openPermissionsModal(_x1) {
  return _openPermissionsModal.apply(this, arguments);
}
function _openPermissionsModal() {
  _openPermissionsModal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38(userId) {
    var user, response, result, userPermissions, userPermissionIds, permissionsGrid, _t29;
    return _regenerator().w(function (_context38) {
      while (1) switch (_context38.p = _context38.n) {
        case 0:
          user = users.data.find(function (u) {
            return u.id === userId;
          });
          if (user) {
            _context38.n = 1;
            break;
          }
          return _context38.a(2);
        case 1:
          _context38.p = 1;
          _context38.n = 2;
          return fetch("/api/users/".concat(userId, "/permissions"));
        case 2:
          response = _context38.v;
          _context38.n = 3;
          return response.json();
        case 3:
          result = _context38.v;
          userPermissions = result.data || [];
          userPermissionIds = userPermissions.map(function (p) {
            return p.id;
          });
          permissionsGrid = document.getElementById('permissionsGrid');
          permissionsGrid.innerHTML = allPermissions.map(function (perm) {
            return "\n            <div class=\"permission-item\">\n                <label>\n                    <input \n                        type=\"checkbox\" \n                        value=\"".concat(perm.id, "\"\n                        ").concat(userPermissionIds.includes(perm.id) ? 'checked' : '', "\n                    >\n                    ").concat(perm.name, "\n                </label>\n            </div>\n        ");
          }).join('');
          document.getElementById('permUserName').textContent = user.username;
          currentEditingUserId = userId;
          document.getElementById('permissionsModal').style.display = 'block';
          document.getElementById('modalOverlay').classList.add('show');
          _context38.n = 5;
          break;
        case 4:
          _context38.p = 4;
          _t29 = _context38.v;
          console.error('Error loading permissions:', _t29);
          NotificationModal.show('Lỗi', 'Lỗi khi tải quyền hạn', 'error');
        case 5:
          return _context38.a(2);
      }
    }, _callee38, null, [[1, 4]]);
  }));
  return _openPermissionsModal.apply(this, arguments);
}
function closePermissionsModal() {
  document.getElementById('permissionsModal').style.display = 'none';
  document.getElementById('modalOverlay').classList.remove('show');
  currentEditingUserId = null;
}
function savePermissions() {
  return _savePermissions.apply(this, arguments);
}
function _savePermissions() {
  _savePermissions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39() {
    var selectedPermissions, response, _t30;
    return _regenerator().w(function (_context39) {
      while (1) switch (_context39.p = _context39.n) {
        case 0:
          if (currentEditingUserId) {
            _context39.n = 1;
            break;
          }
          return _context39.a(2);
        case 1:
          selectedPermissions = Array.from(document.querySelectorAll('#permissionsGrid input[type="checkbox"]:checked')).map(function (cb) {
            return parseInt(cb.value);
          });
          _context39.p = 2;
          _context39.n = 3;
          return fetch("/api/users/".concat(currentEditingUserId, "/permissions"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              permissionIds: selectedPermissions
            })
          });
        case 3:
          response = _context39.v;
          if (response.ok) {
            toast.success('Cập nhật quyền hạn thành công');
            closePermissionsModal();
          } else {
            NotificationModal.show('Lỗi', 'Lỗi khi cập nhật quyền hạn', 'error');
          }
          _context39.n = 5;
          break;
        case 4:
          _context39.p = 4;
          _t30 = _context39.v;
          console.error('Error saving permissions:', _t30);
          NotificationModal.show('Lỗi', 'Lỗi kết nối', 'error');
        case 5:
          return _context39.a(2);
      }
    }, _callee39, null, [[2, 4]]);
  }));
  return _savePermissions.apply(this, arguments);
}
var originalRenderTable = users.renderTable;
users.renderTable = function () {
  var tbody = document.getElementById('usersList');
  if (!tbody) return;
  if (this.data.length === 0) {
    tbody.innerHTML = "<tr class=\"empty-row\"><td colspan=\"7\" style=\"text-align: center; padding: 40px;\"><i class=\"fas fa-inbox\" style=\"font-size: 2em; color: rgba(255,255,255,0.3);\"></i><p style=\"margin-top: 10px; color: rgba(255,255,255,0.7);\">Ch\u01B0a c\xF3 ng\u01B0\u1EDDi d\xF9ng n\xE0o</p></td></tr>";
    return;
  }
  tbody.innerHTML = this.data.map(function (user) {
    return "\n        <tr>\n            <td><strong>".concat(user.username, "</strong></td>\n            <td>").concat(user.email, "</td>\n            <td>").concat(user.full_name || 'N/A', "</td>\n            <td><span style=\"background: rgba(99, 102, 241, 0.2); color: var(--primary); padding: 4px 8px; border-radius: 4px; font-size: 0.85em;\">").concat(user.role || 'user', "</span></td>\n            <td><span class=\"status-badge ").concat(user.is_active ? 'active' : 'inactive', "\">").concat(user.is_active ? 'Hoạt động' : 'Bị khóa', "</span></td>\n            <td>").concat(new Date(user.createdAt || user.created_at).toLocaleDateString('vi-VN'), "</td>\n            <td>\n                <div class=\"action-buttons\">\n                    <button class=\"btn-sm btn-edit\" onclick=\"editUser(").concat(user.id, ")\" title=\"S\u1EEDa\">\n                        <i class=\"fas fa-edit\"></i>\n                    </button>\n                    <button class=\"btn-sm btn-warning\" onclick=\"openPermissionsModal(").concat(user.id, ")\" title=\"Quy\u1EC1n h\u1EA1n\">\n                        <i class=\"fas fa-shield-alt\"></i>\n                    </button>\n                    <button class=\"btn-sm btn-reject\" onclick=\"deleteUser(").concat(user.id, ")\" title=\"X\xF3a\">\n                        <i class=\"fas fa-trash\"></i>\n                    </button>\n                </div>\n            </td>\n        </tr>\n    ");
  }).join('');
};
users.updateCount = function () {
  var count = this.data.length || 0;
  var countEl = document.getElementById('usersCount');
  if (countEl) countEl.textContent = count;
  var totalEl = document.getElementById('userTotal');
  if (totalEl) totalEl.textContent = count;
};
var currentWithdrawalId = null;
function openWithdrawalModal(id) {
  var _item$user0;
  var item = withdrawals.data.find(function (w) {
    return w.id === id;
  });
  if (!item) return;
  currentWithdrawalId = id;
  document.getElementById('previewWithdrawalCustomerName').value = item.customer_name || ((_item$user0 = item.user) === null || _item$user0 === void 0 ? void 0 : _item$user0.full_name) || '';
  document.getElementById('previewWithdrawalPhone').value = item.customer_phone || '';
  document.getElementById('previewWithdrawalEmail').value = item.customer_email || '';
  document.getElementById('previewWithdrawalAmount').value = withdrawals.formatCurrency(item.amount || 0);
  document.getElementById('previewWithdrawalMethod').value = item.withdraw_method || item.bank_name || 'N/A';
  document.getElementById('previewWithdrawalAccount').value = item.account_number || item.customer_phone || '';
  document.getElementById('previewWithdrawalStatus').value = item.status || '';
  document.getElementById('previewWithdrawalPrize').value = item.prize_name || 'N/A';
  document.getElementById('withdrawalPreviewModal').style.display = 'block';
  document.getElementById('modalOverlay').classList.add('show');
}
function closeWithdrawalPreviewModal() {
  document.getElementById('withdrawalPreviewModal').style.display = 'none';
  document.getElementById('modalOverlay').classList.remove('show');
}
function closeWithdrawalEditModal() {
  document.getElementById('withdrawalEditModal').style.display = 'none';
  document.getElementById('modalOverlay').classList.remove('show');
}
function closeWithdrawalConfirmModal() {
  document.getElementById('withdrawalConfirmModal').style.display = 'none';
  document.getElementById('modalOverlay').classList.remove('show');
}
function editWithdrawal() {
  if (!currentWithdrawalId) return;
  var item = withdrawals.data.find(function (w) {
    return w.id === currentWithdrawalId;
  });
  if (!item) return;
  document.getElementById('editWithdrawalStatus').value = item.status || 'pending';
  document.getElementById('editWithdrawalNote').value = item.notes || '';
  document.getElementById('withdrawalPreviewModal').style.display = 'none';
  document.getElementById('withdrawalEditModal').style.display = 'block';
}
function saveWithdrawalEdit() {
  return _saveWithdrawalEdit.apply(this, arguments);
}
function _saveWithdrawalEdit() {
  _saveWithdrawalEdit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40() {
    var status, note, response, result, _t31;
    return _regenerator().w(function (_context40) {
      while (1) switch (_context40.p = _context40.n) {
        case 0:
          status = document.getElementById('editWithdrawalStatus').value;
          note = document.getElementById('editWithdrawalNote').value;
          _context40.p = 1;
          _context40.n = 2;
          return fetch("/api/withdrawals/".concat(currentWithdrawalId), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              status: status,
              notes: note
            })
          });
        case 2:
          response = _context40.v;
          _context40.n = 3;
          return response.json();
        case 3:
          result = _context40.v;
          if (result.success) {
            toast.success('Cập nhật thành công');
            closeWithdrawalEditModal();
            withdrawals.fetch();
          } else {
            toast.error(result.message || 'Lỗi cập nhật');
          }
          _context40.n = 5;
          break;
        case 4:
          _context40.p = 4;
          _t31 = _context40.v;
          console.error('Error:', _t31);
          toast.error('Lỗi kết nối');
        case 5:
          return _context40.a(2);
      }
    }, _callee40, null, [[1, 4]]);
  }));
  return _saveWithdrawalEdit.apply(this, arguments);
}
function deleteWithdrawal() {
  if (!currentWithdrawalId) return;
  var item = withdrawals.data.find(function (w) {
    return w.id === currentWithdrawalId;
  });
  if (!item) return;
  document.getElementById('withdrawalPreviewModal').style.display = 'none';
  document.getElementById('withdrawalConfirmModal').style.display = 'block';
  document.getElementById('withdrawalConfirmAmount').textContent = (item.amount || 0).toLocaleString('vi-VN');
}
function confirmDeleteWithdrawal() {
  return _confirmDeleteWithdrawal.apply(this, arguments);
} // ==================== GIFTS MODAL MANAGEMENT ====================
function _confirmDeleteWithdrawal() {
  _confirmDeleteWithdrawal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee41() {
    var response, result, _t32;
    return _regenerator().w(function (_context41) {
      while (1) switch (_context41.p = _context41.n) {
        case 0:
          if (currentWithdrawalId) {
            _context41.n = 1;
            break;
          }
          return _context41.a(2);
        case 1:
          _context41.p = 1;
          _context41.n = 2;
          return fetch("/api/withdrawals/".concat(currentWithdrawalId), {
            method: 'DELETE'
          });
        case 2:
          response = _context41.v;
          _context41.n = 3;
          return response.json();
        case 3:
          result = _context41.v;
          if (result.success) {
            toast.success('Xóa thành công');
            closeWithdrawalConfirmModal();
            withdrawals.fetch();
          } else {
            toast.error(result.message || 'Lỗi xóa');
          }
          _context41.n = 5;
          break;
        case 4:
          _context41.p = 4;
          _t32 = _context41.v;
          console.error('Error:', _t32);
          toast.error('Lỗi kết nối');
        case 5:
          return _context41.a(2);
      }
    }, _callee41, null, [[1, 4]]);
  }));
  return _confirmDeleteWithdrawal.apply(this, arguments);
}
var currentGiftId = null;
function openGiftModal(id) {
  var _item$user1, _item$user10, _item$user11;
  var item = giftExchanges.data.find(function (g) {
    return g.id === id;
  });
  if (!item) return;
  currentGiftId = id;
  document.getElementById('previewGiftUsername').value = ((_item$user1 = item.user) === null || _item$user1 === void 0 ? void 0 : _item$user1.full_name) || ((_item$user10 = item.user) === null || _item$user10 === void 0 ? void 0 : _item$user10.username) || '';
  document.getElementById('previewGiftEmail').value = ((_item$user11 = item.user) === null || _item$user11 === void 0 ? void 0 : _item$user11.email) || '';
  document.getElementById('previewGiftReceiverName').value = item.recipient_name || '';
  document.getElementById('previewGiftPhone').value = item.phone || '';
  document.getElementById('previewGiftAddress').value = item.address || '';
  document.getElementById('previewGiftStatus').value = item.status || '';
  document.getElementById('giftPreviewModal').style.display = 'block';
  document.getElementById('modalOverlay').classList.add('show');
}
function closeGiftPreviewModal() {
  document.getElementById('giftPreviewModal').style.display = 'none';
  document.getElementById('modalOverlay').classList.remove('show');
}
function closeGiftEditModal() {
  document.getElementById('giftEditModal').style.display = 'none';
  document.getElementById('modalOverlay').classList.remove('show');
}
function closeGiftConfirmModal() {
  document.getElementById('giftConfirmModal').style.display = 'none';
  document.getElementById('modalOverlay').classList.remove('show');
}
function editGift() {
  if (!currentGiftId) return;
  var item = giftExchanges.data.find(function (g) {
    return g.id === currentGiftId;
  });
  if (!item) return;
  document.getElementById('editGiftReceiverName').value = item.recipient_name || '';
  document.getElementById('editGiftPhone').value = item.phone || '';
  document.getElementById('editGiftAddress').value = item.address || '';
  document.getElementById('editGiftStatus').value = item.status || 'pending';
  document.getElementById('editGiftNote').value = item.notes || '';
  document.getElementById('giftPreviewModal').style.display = 'none';
  document.getElementById('giftEditModal').style.display = 'block';
}
function saveGiftEdit() {
  return _saveGiftEdit.apply(this, arguments);
}
function _saveGiftEdit() {
  _saveGiftEdit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee42() {
    var recipientName, phone, address, status, note, response, result, _t33;
    return _regenerator().w(function (_context42) {
      while (1) switch (_context42.p = _context42.n) {
        case 0:
          recipientName = document.getElementById('editGiftReceiverName').value;
          phone = document.getElementById('editGiftPhone').value;
          address = document.getElementById('editGiftAddress').value;
          status = document.getElementById('editGiftStatus').value;
          note = document.getElementById('editGiftNote').value;
          _context42.p = 1;
          _context42.n = 2;
          return fetch("/api/gift-exchanges/".concat(currentGiftId), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              recipient_name: recipientName,
              phone: phone,
              address: address,
              status: status,
              notes: note
            })
          });
        case 2:
          response = _context42.v;
          _context42.n = 3;
          return response.json();
        case 3:
          result = _context42.v;
          if (result.success) {
            toast.success('Cập nhật thành công');
            closeGiftEditModal();
            giftExchanges.fetch();
          } else {
            toast.error(result.message || 'Lỗi cập nhật');
          }
          _context42.n = 5;
          break;
        case 4:
          _context42.p = 4;
          _t33 = _context42.v;
          console.error('Error:', _t33);
          toast.error('Lỗi kết nối');
        case 5:
          return _context42.a(2);
      }
    }, _callee42, null, [[1, 4]]);
  }));
  return _saveGiftEdit.apply(this, arguments);
}
function deleteGift() {
  if (!currentGiftId) return;
  var item = giftExchanges.data.find(function (g) {
    return g.id === currentGiftId;
  });
  if (!item) return;
  document.getElementById('giftPreviewModal').style.display = 'none';
  document.getElementById('giftConfirmModal').style.display = 'block';
  document.getElementById('giftConfirmName').textContent = item.recipient_name || 'N/A';
}
function confirmDeleteGift() {
  return _confirmDeleteGift.apply(this, arguments);
} // ==================== INITIALIZATION FOR WITHDRAWALS & GIFTS ====================
function _confirmDeleteGift() {
  _confirmDeleteGift = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee43() {
    var response, result, _t34;
    return _regenerator().w(function (_context43) {
      while (1) switch (_context43.p = _context43.n) {
        case 0:
          if (currentGiftId) {
            _context43.n = 1;
            break;
          }
          return _context43.a(2);
        case 1:
          _context43.p = 1;
          _context43.n = 2;
          return fetch("/api/gift-exchanges/".concat(currentGiftId), {
            method: 'DELETE'
          });
        case 2:
          response = _context43.v;
          _context43.n = 3;
          return response.json();
        case 3:
          result = _context43.v;
          if (result.success) {
            toast.success('Xóa thành công');
            closeGiftConfirmModal();
            giftExchanges.fetch();
          } else {
            toast.error(result.message || 'Lỗi xóa');
          }
          _context43.n = 5;
          break;
        case 4:
          _context43.p = 4;
          _t34 = _context43.v;
          console.error('Error:', _t34);
          toast.error('Lỗi kết nối');
        case 5:
          return _context43.a(2);
      }
    }, _callee43, null, [[1, 4]]);
  }));
  return _confirmDeleteGift.apply(this, arguments);
}
function initWithdrawals() {
  return _initWithdrawals.apply(this, arguments);
}
function _initWithdrawals() {
  _initWithdrawals = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee44() {
    return _regenerator().w(function (_context44) {
      while (1) switch (_context44.n) {
        case 0:
          filters.initWithdrawalFilters();
          _context44.n = 1;
          return withdrawals.fetch();
        case 1:
          return _context44.a(2);
      }
    }, _callee44);
  }));
  return _initWithdrawals.apply(this, arguments);
}
function initGifts() {
  return _initGifts.apply(this, arguments);
} // Update user management initialization
function _initGifts() {
  _initGifts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee45() {
    return _regenerator().w(function (_context45) {
      while (1) switch (_context45.n) {
        case 0:
          filters.initGiftFilters();
          _context45.n = 1;
          return giftExchanges.fetch();
        case 1:
          return _context45.a(2);
      }
    }, _callee45);
  }));
  return _initGifts.apply(this, arguments);
}
var originalInitUserManagement = initUserManagement;
var newInitUserManagement = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28() {
    return _regenerator().w(function (_context28) {
      while (1) switch (_context28.n) {
        case 0:
          originalInitUserManagement();
          filters.initUserFilters();
        case 1:
          return _context28.a(2);
      }
    }, _callee28);
  }));
  return function newInitUserManagement() {
    return _ref12.apply(this, arguments);
  };
}();
initUserManagement = newInitUserManagement;

// ==================== FILTER MANAGEMENT ====================
var filters = _defineProperty(_defineProperty(_defineProperty(_defineProperty({
  withdrawalFilters: {
    status: '',
    search: ''
  },
  giftFilters: {
    status: '',
    search: ''
  },
  userFilters: {
    search: '',
    role: ''
  },
  sessionFilters: {
    status: '',
    search: ''
  },
  initWithdrawalFilters: function initWithdrawalFilters() {
    var _this12 = this;
    var statusFilter = document.getElementById('withdrawalStatusFilter');
    var searchInput = document.getElementById('withdrawalSearch');
    if (statusFilter) {
      statusFilter.addEventListener('change', function (e) {
        _this12.withdrawalFilters.status = e.target.value;
        _this12.applyWithdrawalFilters();
      });
    }
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        _this12.withdrawalFilters.search = e.target.value.toLowerCase();
        _this12.applyWithdrawalFilters();
      });
    }
  },
  applyWithdrawalFilters: function applyWithdrawalFilters() {
    var _this$withdrawalFilte = this.withdrawalFilters,
      status = _this$withdrawalFilte.status,
      search = _this$withdrawalFilte.search;
    var container = document.getElementById('withdrawalsContainer');
    if (!container) return;
    var cards = container.querySelectorAll('.withdrawal-card');
    var visibleCount = 0;
    cards.forEach(function (card) {
      var statusText = card.textContent.toLowerCase();
      var userText = card.textContent.toLowerCase();
      var amountText = card.textContent.toLowerCase();
      var bankText = card.textContent.toLowerCase();
      var accountText = card.textContent.toLowerCase();
      var matchStatus = !status || statusText.includes(status.toLowerCase());
      var matchSearch = !search || userText.includes(search) || amountText.includes(search) || bankText.includes(search) || accountText.includes(search);
      if (matchStatus && matchSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    if (visibleCount === 0) {
      container.innerHTML = "\n                <div style=\"grid-column: 1/-1; text-align: center; padding: 40px;\">\n                    <i class=\"fas fa-search\" style=\"font-size: 2em; color: rgba(0,0,0,0.2);\"></i>\n                    <p style=\"margin-top: 10px; color: rgba(0,0,0,0.5);\">Kh\xF4ng t\xECm th\u1EA5y y\xEAu c\u1EA7u r\xFAt ti\u1EC1n ph\xF9 h\u1EE3p</p>\n                </div>\n            ";
    }
  },
  initGiftFilters: function initGiftFilters() {
    var _this13 = this;
    var statusFilter = document.getElementById('giftStatusFilter');
    var searchInput = document.getElementById('giftSearch');
    if (statusFilter) {
      statusFilter.addEventListener('change', function (e) {
        _this13.giftFilters.status = e.target.value;
        _this13.applyGiftFilters();
      });
    }
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        _this13.giftFilters.search = e.target.value.toLowerCase();
        _this13.applyGiftFilters();
      });
    }
  },
  applyGiftFilters: function applyGiftFilters() {
    var _this$giftFilters = this.giftFilters,
      status = _this$giftFilters.status,
      search = _this$giftFilters.search;
    var container = document.getElementById('giftsContainer');
    if (!container) return;

    // Try to get cards (for grid layout)
    var cards = container.children;
    if (cards.length === 0) return;
    var visibleCount = 0;
    var cardArray = Array.from(cards);
    cardArray.forEach(function (card) {
      // For grid cards, search in the text content
      var textContent = card.textContent.toLowerCase();

      // Try to find status from the badge
      var cardStatus = '';
      var statusBadge = card.querySelector('[style*="background"]');
      if (statusBadge) {
        var badges = ['chờ duyệt', 'đã duyệt', 'từ chối', 'đã giao', 'pending', 'approved', 'rejected', 'shipped'];
        var badgeText = statusBadge.textContent.toLowerCase();
        for (var _i = 0, _badges = badges; _i < _badges.length; _i++) {
          var badge = _badges[_i];
          if (badgeText.includes(badge)) {
            cardStatus = badge;
            break;
          }
        }
      }
      var matchStatus = !status || cardStatus.includes(status.toLowerCase()) || textContent.includes(status.toLowerCase());
      var matchSearch = !search || textContent.includes(search);
      if (matchStatus && matchSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    if (visibleCount === 0) {
      container.innerHTML = "\n                <div style=\"grid-column: 1/-1; text-align: center; padding: 40px;\">\n                    <i class=\"fas fa-search\" style=\"font-size: 2em; color: rgba(255,255,255,0.3);\"></i>\n                    <p style=\"margin-top: 10px; color: rgba(255,255,255,0.7);\">Kh\xF4ng t\xECm th\u1EA5y k\u1EBFt qu\u1EA3 ph\xF9 h\u1EE3p</p>\n                </div>\n            ";
    }
  },
  initUserFilters: function initUserFilters() {
    var _this14 = this;
    var searchInput = document.getElementById('userSearch');
    var roleFilter = document.getElementById('userRoleFilter');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        _this14.userFilters.search = e.target.value.toLowerCase();
        _this14.applyUserFilters();
      });
    }
    if (roleFilter) {
      roleFilter.addEventListener('change', function (e) {
        _this14.userFilters.role = e.target.value;
        _this14.applyUserFilters();
      });
    }
  },
  applyUserFilters: function applyUserFilters() {
    var _this$userFilters = this.userFilters,
      search = _this$userFilters.search,
      role = _this$userFilters.role;
    var tbody = document.getElementById('usersList');
    if (!tbody) return;
    var rows = tbody.querySelectorAll('tr:not(.empty-row)');
    var visibleCount = 0;
    rows.forEach(function (row) {
      var _row$cells$, _row$cells$2, _row$cells$3, _row$cells$4;
      var usernameCell = ((_row$cells$ = row.cells[0]) === null || _row$cells$ === void 0 ? void 0 : _row$cells$.textContent.toLowerCase()) || '';
      var emailCell = ((_row$cells$2 = row.cells[1]) === null || _row$cells$2 === void 0 ? void 0 : _row$cells$2.textContent.toLowerCase()) || '';
      var fullNameCell = ((_row$cells$3 = row.cells[2]) === null || _row$cells$3 === void 0 ? void 0 : _row$cells$3.textContent.toLowerCase()) || '';
      var roleCell = ((_row$cells$4 = row.cells[3]) === null || _row$cells$4 === void 0 ? void 0 : _row$cells$4.textContent.toLowerCase()) || '';
      var matchSearch = !search || usernameCell.includes(search) || emailCell.includes(search) || fullNameCell.includes(search);
      var matchRole = !role || roleCell.includes(role.toLowerCase());
      if (matchSearch && matchRole) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });
    if (visibleCount === 0) {
      tbody.innerHTML = "<tr class=\"empty-row\"><td colspan=\"7\" style=\"text-align: center; padding: 40px;\"><i class=\"fas fa-search\" style=\"font-size: 2em; color: rgba(255,255,255,0.3);\"></i><p style=\"margin-top: 10px; color: rgba(255,255,255,0.7);\">Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi d\xF9ng ph\xF9 h\u1EE3p</p></td></tr>";
    } else if (tbody.querySelector('.empty-row')) {
      tbody.querySelector('.empty-row').remove();
    }
  }
}, "sessionFilters", {
  code: ''
}), "initSessionFilters", function initSessionFilters() {
  var _this15 = this;
  var codeInput = document.getElementById('sessionCodeFilter');
  var resetBtn = document.getElementById('resetSessionFilters');
  if (codeInput) {
    codeInput.addEventListener('input', function (e) {
      _this15.sessionFilters.code = e.target.value.toLowerCase();
      _this15.applySessionFilters();
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      _this15.resetSessionFilters();
    });
  }
}), "applySessionFilters", function applySessionFilters() {
  var code = this.sessionFilters.code;
  var container = document.getElementById('sessionsGrid');
  if (!container) return;
  var cards = container.querySelectorAll('.session-card:not(.empty-state)');
  var visibleCount = 0;
  cards.forEach(function (card) {
    var codeText = (card.getAttribute('data-session-code') || '').toLowerCase();
    var matchCode = !code || codeText.includes(code);
    if (matchCode) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  if (visibleCount === 0) {
    // Show empty state
    var emptyState = container.querySelector('.empty-state');
    if (!emptyState) {
      emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = "<i class=\"fas fa-search\" style=\"font-size: 2em; color: rgba(255,255,255,0.3);\"></i><p style=\"margin-top: 10px; color: rgba(255,255,255,0.7);\">Kh\xF4ng t\xECm th\u1EA5y phi\xEAn ph\xF9 h\u1EE3p</p>";
      container.innerHTML = '';
      container.appendChild(emptyState);
    } else {
      emptyState.style.display = '';
    }
  } else {
    var _emptyState = container.querySelector('.empty-state');
    if (_emptyState) _emptyState.style.display = 'none';
  }
}), "resetSessionFilters", function resetSessionFilters() {
  // Reset filter state
  this.sessionFilters = {
    code: ''
  };

  // Reset filter inputs
  var codeInput = document.getElementById('sessionCodeFilter');
  if (codeInput) codeInput.value = '';

  // Show all cards
  var container = document.getElementById('sessionsGrid');
  if (container) {
    var cards = container.querySelectorAll('.session-card');
    cards.forEach(function (card) {
      return card.style.display = '';
    });
    var emptyState = container.querySelector('.empty-state');
    if (emptyState) emptyState.style.display = 'none';
  }
});

// ==================== GLOBAL FUNCTIONS ====================
window.approveWithdrawal = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(id) {
    var response, result, _t22;
    return _regenerator().w(function (_context29) {
      while (1) switch (_context29.p = _context29.n) {
        case 0:
          _context29.p = 0;
          _context29.n = 1;
          return fetch("/api/withdrawals/".concat(id, "/approve"), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          });
        case 1:
          response = _context29.v;
          _context29.n = 2;
          return response.json();
        case 2:
          result = _context29.v;
          if (result.success) {
            toast.show('Phê duyệt rút tiền thành công', 'success');
            withdrawals.fetch();
          } else {
            toast.show(result.message || 'Lỗi khi phê duyệt', 'error');
          }
          _context29.n = 4;
          break;
        case 3:
          _context29.p = 3;
          _t22 = _context29.v;
          console.error('Error:', _t22);
          toast.show('Lỗi khi kết nối server', 'error');
        case 4:
          return _context29.a(2);
      }
    }, _callee29, null, [[0, 3]]);
  }));
  return function (_x10) {
    return _ref13.apply(this, arguments);
  };
}();
window.rejectWithdrawal = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(id) {
    var reason, response, result, _t23;
    return _regenerator().w(function (_context30) {
      while (1) switch (_context30.p = _context30.n) {
        case 0:
          reason = prompt('Nhập lý do từ chối rút tiền:');
          if (!(reason !== null && reason.trim() !== '')) {
            _context30.n = 5;
            break;
          }
          _context30.p = 1;
          _context30.n = 2;
          return fetch("/api/withdrawals/".concat(id, "/reject"), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              rejection_reason: reason
            })
          });
        case 2:
          response = _context30.v;
          _context30.n = 3;
          return response.json();
        case 3:
          result = _context30.v;
          if (result.success) {
            toast.show('Từ chối rút tiền thành công', 'success');
            withdrawals.fetch();
          } else {
            toast.show(result.message || 'Lỗi khi từ chối', 'error');
          }
          _context30.n = 5;
          break;
        case 4:
          _context30.p = 4;
          _t23 = _context30.v;
          console.error('Error:', _t23);
          toast.show('Lỗi khi kết nối server', 'error');
        case 5:
          return _context30.a(2);
      }
    }, _callee30, null, [[1, 4]]);
  }));
  return function (_x11) {
    return _ref14.apply(this, arguments);
  };
}();
window.approveGift = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31(id) {
    var response, result, _t24;
    return _regenerator().w(function (_context31) {
      while (1) switch (_context31.p = _context31.n) {
        case 0:
          _context31.p = 0;
          _context31.n = 1;
          return fetch("/api/gift-exchanges/".concat(id, "/approve"), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          });
        case 1:
          response = _context31.v;
          _context31.n = 2;
          return response.json();
        case 2:
          result = _context31.v;
          if (result.success) {
            toast.show('Phê duyệt quà tặng thành công', 'success');
            giftExchanges.fetch();
          } else {
            toast.show(result.message || 'Lỗi khi phê duyệt', 'error');
          }
          _context31.n = 4;
          break;
        case 3:
          _context31.p = 3;
          _t24 = _context31.v;
          console.error('Error:', _t24);
          toast.show('Lỗi khi kết nối server', 'error');
        case 4:
          return _context31.a(2);
      }
    }, _callee31, null, [[0, 3]]);
  }));
  return function (_x12) {
    return _ref15.apply(this, arguments);
  };
}();
window.rejectGift = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32(id) {
    var reason, response, result, _t25;
    return _regenerator().w(function (_context32) {
      while (1) switch (_context32.p = _context32.n) {
        case 0:
          reason = prompt('Nhập lý do từ chối quà tặng:');
          if (!(reason !== null && reason.trim() !== '')) {
            _context32.n = 5;
            break;
          }
          _context32.p = 1;
          _context32.n = 2;
          return fetch("/api/gift-exchanges/".concat(id, "/reject"), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              rejection_reason: reason
            })
          });
        case 2:
          response = _context32.v;
          _context32.n = 3;
          return response.json();
        case 3:
          result = _context32.v;
          if (result.success) {
            toast.show('Từ chối quà tặng thành công', 'success');
            giftExchanges.fetch();
          } else {
            toast.show(result.message || 'Lỗi khi từ chối', 'error');
          }
          _context32.n = 5;
          break;
        case 4:
          _context32.p = 4;
          _t25 = _context32.v;
          console.error('Error:', _t25);
          toast.show('Lỗi khi kết nối server', 'error');
        case 5:
          return _context32.a(2);
      }
    }, _callee32, null, [[1, 4]]);
  }));
  return function (_x13) {
    return _ref16.apply(this, arguments);
  };
}();
window.deleteGift = function (id) {
  if (!id) return;
  var item = giftExchanges.data.find(function (g) {
    return g.id === id;
  });
  if (!item) return;
  NotificationModal.confirm('Xác nhận xóa', "B\u1EA1n ch\u1EAFc ch\u1EAFn mu\u1ED1n x\xF3a y\xEAu c\u1EA7u qu\xE0 cho ".concat(item.recipient_name, "?"), function () {
    giftExchanges.delete(id);
  });
};
window.deleteWithdrawal = function (id) {
  if (!id) return;
  var item = withdrawals.data.find(function (w) {
    return w.id === id;
  });
  if (!item) return;
  NotificationModal.confirm('Xác nhận xóa', "B\u1EA1n ch\u1EAFc ch\u1EAFn mu\u1ED1n x\xF3a y\xEAu c\u1EA7u r\xFAt ti\u1EC1n ".concat(withdrawals.formatCurrency(item.amount), "?"), function () {
    withdrawals.delete(id);
  });
};

// Copy bank info to clipboard
window.copyBankInfo = function (bankName, accountNumber, accountHolder) {
  if (!accountNumber) {
    toast.show('❌ Không có số tài khoản để sao chép', 'error');
    return;
  }
  var textToCopy = "Ng\xE2n h\xE0ng: ".concat(bankName || 'N/A', "\nS\u1ED1 t\xE0i kho\u1EA3n: ").concat(accountNumber, "\nCh\u1EE7 t\xE0i kho\u1EA3n: ").concat(accountHolder || 'N/A');
  navigator.clipboard.writeText(textToCopy).then(function () {
    toast.show('✅ Đã sao chép: ' + accountNumber, 'success');
  }).catch(function () {
    // Fallback for older browsers
    var textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    toast.show('✅ Đã sao chép thông tin ngân hàng', 'success');
  });
};
window.app = {
  state: state,
  toast: toast,
  utils: utils,
  sessions: sessions,
  users: users,
  files: files,
  navigation: navigation,
  modal: modal,
  withdrawals: withdrawals,
  giftExchanges: giftExchanges,
  notifications: notifications,
  filters: filters
};