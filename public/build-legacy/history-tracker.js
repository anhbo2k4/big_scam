function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Game History & Activity Tracking Module
 * Tracks all user actions and game events for analytics and audit purposes
 */

var historyModule = {
  container: null,
  data: [],
  currentFilter: 'all',
  currentPage: 1,
  itemsPerPage: 15,
  init: function init() {
    historyModule.container = document.getElementById('historyContainer');
    if (!historyModule.container) return;
    historyModule.setupEventListeners();
    historyModule.loadHistory();
  },
  setupEventListeners: function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('[data-history-filter]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        document.querySelectorAll('[data-history-filter]').forEach(function (b) {
          return b.classList.remove('active');
        });
        e.target.classList.add('active');
        historyModule.currentFilter = e.target.dataset.historyFilter;
        historyModule.currentPage = 1;
        historyModule.render();
      });
    });

    // Search input
    var searchInput = document.getElementById('historySearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', debounce(function (e) {
        historyModule.currentPage = 1;
        historyModule.render();
      }, 300));
    }

    // Export button
    var exportBtn = document.getElementById('historyExportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        return historyModule.exportAsCSV();
      });
    }
  },
  loadHistory: function () {
    var _loadHistory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var response, contentType, result, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return fetch("/api/history?filter=".concat(historyModule.currentFilter, "&page=").concat(historyModule.currentPage));
          case 1:
            response = _context.v;
            if (response.ok) {
              _context.n = 2;
              break;
            }
            console.warn("\u26A0\uFE0F History HTTP ".concat(response.status));
            return _context.a(2);
          case 2:
            contentType = response.headers.get('content-type');
            if (!(!contentType || !contentType.includes('application/json'))) {
              _context.n = 3;
              break;
            }
            console.warn('⚠️ History: Non-JSON response');
            return _context.a(2);
          case 3:
            _context.n = 4;
            return response.json();
          case 4:
            result = _context.v;
            if (result.success && Array.isArray(result.data)) {
              historyModule.data = result.data;
              historyModule.render();
            }
            _context.n = 6;
            break;
          case 5:
            _context.p = 5;
            _t = _context.v;
            console.error('❌ Error loading history:', _t.message);
          case 6:
            return _context.a(2);
        }
      }, _callee, null, [[0, 5]]);
    }));
    function loadHistory() {
      return _loadHistory.apply(this, arguments);
    }
    return loadHistory;
  }(),
  render: function render() {
    var _document$getElementB;
    if (!historyModule.container) return;
    var searchTerm = ((_document$getElementB = document.getElementById('historySearchInput')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value.toLowerCase()) || '';
    var filtered = historyModule.data;
    if (searchTerm) {
      filtered = filtered.filter(function (item) {
        return (item.user_name || '').toLowerCase().includes(searchTerm) || (item.action || '').toLowerCase().includes(searchTerm) || (item.description || '').toLowerCase().includes(searchTerm);
      });
    }
    var totalPages = Math.ceil(filtered.length / historyModule.itemsPerPage);
    var start = (historyModule.currentPage - 1) * historyModule.itemsPerPage;
    var paginatedData = filtered.slice(start, start + historyModule.itemsPerPage);
    if (paginatedData.length === 0) {
      historyModule.container.innerHTML = "\n        <div class=\"history-empty\">\n          <i class=\"fas fa-inbox\"></i>\n          <p>Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u l\u1ECBch s\u1EED</p>\n        </div>\n      ";
      return;
    }
    historyModule.container.innerHTML = "\n      <div class=\"history-list\">\n        ".concat(paginatedData.map(function (item) {
      return "\n          <div class=\"history-item ".concat(item.status || 'info', "\">\n            <div class=\"history-icon\">\n              <i class=\"fas ").concat(historyModule.getIcon(item.action), "\"></i>\n            </div>\n            <div class=\"history-content\">\n              <h4 class=\"history-action\">").concat(historyModule.formatAction(item.action), "</h4>\n              <p class=\"history-description\">").concat(item.description || '', "</p>\n              <div class=\"history-meta\">\n                <span class=\"meta-user\">\uD83D\uDC64 ").concat(item.user_name || 'Hệ thống', "</span>\n                <span class=\"meta-time\">\uD83D\uDD50 ").concat(new Date(item.created_at).toLocaleString('vi-VN'), "</span>\n                ").concat(item.details ? "<span class=\"meta-details\">\uD83D\uDCDD ".concat(JSON.stringify(item.details).substring(0, 50), "...</span>") : '', "\n              </div>\n            </div>\n          </div>\n        ");
    }).join(''), "\n      </div>\n\n      ").concat(totalPages > 1 ? "\n        <div class=\"history-pagination\">\n          ".concat(historyModule.currentPage > 1 ? "\n            <button onclick=\"historyModule.previousPage()\" class=\"history-page-btn\">\n              <i class=\"fas fa-chevron-left\"></i> Tr\u01B0\u1EDBc\n            </button>\n          " : '', "\n          <span class=\"history-page-info\">Trang ").concat(historyModule.currentPage, "/").concat(totalPages, "</span>\n          ").concat(historyModule.currentPage < totalPages ? "\n            <button onclick=\"historyModule.nextPage()\" class=\"history-page-btn\">\n              Ti\u1EBFp <i class=\"fas fa-chevron-right\"></i>\n            </button>\n          " : '', "\n        </div>\n      ") : '', "\n    ");
  },
  getIcon: function getIcon(action) {
    var icons = {
      'box_opened': 'fa-gift',
      'prize_claimed': 'fa-star',
      'form_submitted': 'fa-check-circle',
      'withdrawal_created': 'fa-money-bill-wave',
      'login': 'fa-sign-in-alt',
      'logout': 'fa-sign-out-alt',
      'user_created': 'fa-user-plus',
      'user_deleted': 'fa-user-minus',
      'settings_changed': 'fa-cogs',
      'export': 'fa-download'
    };
    return icons[action] || 'fa-history';
  },
  formatAction: function formatAction(action) {
    var labels = {
      'box_opened': 'Mở Hộp Quà',
      'prize_claimed': 'Nhận Quà',
      'form_submitted': 'Nộp Biểu Mẫu',
      'withdrawal_created': 'Tạo Yêu Cầu Rút Quà',
      'login': 'Đăng Nhập',
      'logout': 'Đăng Xuất',
      'user_created': 'Tạo Người Dùng',
      'user_deleted': 'Xóa Người Dùng',
      'settings_changed': 'Thay Đổi Cài Đặt',
      'export': 'Xuất Dữ Liệu'
    };
    return labels[action] || action;
  },
  previousPage: function previousPage() {
    if (historyModule.currentPage > 1) {
      historyModule.currentPage--;
      historyModule.render();
    }
  },
  nextPage: function nextPage() {
    historyModule.currentPage++;
    historyModule.render();
  },
  exportAsCSV: function exportAsCSV() {
    var headers = ['Thời gian', 'Người dùng', 'Hành động', 'Mô tả', 'Chi tiết'];
    var rows = historyModule.data.map(function (item) {
      return [new Date(item.created_at).toLocaleString('vi-VN'), item.user_name || 'Hệ thống', historyModule.formatAction(item.action), item.description || '', item.details ? JSON.stringify(item.details) : ''];
    });
    var csv = headers.join(',') + '\n';
    rows.forEach(function (row) {
      csv += row.map(function (cell) {
        return "\"".concat((cell || '').toString().replace(/"/g, '""'), "\"");
      }).join(',') + '\n';
    });
    var blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "history-".concat(new Date().toISOString().split('T')[0], ".csv");
    link.click();
  }
};

// Debounce helper
function debounce(func, wait) {
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

// Auto-initialize if DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    return historyModule.init();
  });
} else {
  historyModule.init();
}