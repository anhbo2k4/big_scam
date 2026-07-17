function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Withdrawal Banks Module
 * Handles loading Vietnamese banks for withdrawal modal
 */

var withdrawalBanksCache = null;

/**
 * Load all Vietnamese banks for withdrawal dropdown
 */
function loadWithdrawalBanks() {
  return _loadWithdrawalBanks.apply(this, arguments);
}
/**
 * Populate bank dropdown with options
 */
function _loadWithdrawalBanks() {
  _loadWithdrawalBanks = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var bankSelect, spinner, response, data, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          bankSelect = document.getElementById('withdrawBank');
          spinner = document.getElementById('bankLoadingSpinner');
          if (bankSelect) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          _context.p = 1;
          // Show spinner
          if (spinner) spinner.style.display = 'block';

          // Check cache first
          if (!(withdrawalBanksCache && withdrawalBanksCache.banks && withdrawalBanksCache.banks.length > 0)) {
            _context.n = 2;
            break;
          }
          populateBankDropdown(withdrawalBanksCache.banks);
          if (spinner) spinner.style.display = 'none';
          return _context.a(2);
        case 2:
          _context.n = 3;
          return fetch('/api/banks');
        case 3:
          response = _context.v;
          if (response.ok) {
            _context.n = 4;
            break;
          }
          // If rate limited (429) or error, use fallback immediately
          populateBankDropdown(getFallbackBanks());
          if (spinner) spinner.style.display = 'none';
          return _context.a(2);
        case 4:
          _context.n = 5;
          return response.json();
        case 5:
          data = _context.v;
          if (data.success && data.data && data.data.length > 0) {
            // Cache the banks
            withdrawalBanksCache = {
              banks: data.data,
              timestamp: Date.now()
            };

            // Populate dropdown
            populateBankDropdown(data.data);
          } else {
            // Fallback to default banks
            populateBankDropdown(getFallbackBanks());
          }
          _context.n = 7;
          break;
        case 6:
          _context.p = 6;
          _t = _context.v;
          // Use fallback banks on error
          populateBankDropdown(getFallbackBanks());
        case 7:
          _context.p = 7;
          if (spinner) spinner.style.display = 'none';
          return _context.f(7);
        case 8:
          return _context.a(2);
      }
    }, _callee, null, [[1, 6, 7, 8]]);
  }));
  return _loadWithdrawalBanks.apply(this, arguments);
}
function populateBankDropdown(banks) {
  var bankSelect = document.getElementById('withdrawBank');
  if (!bankSelect) return;

  // Clear current options (keep the placeholder)
  var currentOptions = bankSelect.querySelectorAll('option:not(:first-child)');
  currentOptions.forEach(function (opt) {
    return opt.remove();
  });

  // Add banks as options
  banks.forEach(function (bank) {
    var option = document.createElement('option');
    option.value = bank.name || bank.shortName || bank.bin;
    option.textContent = bank.name || bank.shortName;
    option.dataset.bin = bank.bin;
    option.dataset.shortName = bank.shortName;
    bankSelect.appendChild(option);
  });
}

/**
 * Fallback Vietnamese banks list
 */
function getFallbackBanks() {
  return [{
    name: 'Ngân hàng TMCP Ngoại thương Việt Nam',
    shortName: 'Vietcombank',
    bin: '970436'
  }, {
    name: 'Ngân hàng TMCP Phát triển Nhà đất',
    shortName: 'LPB',
    bin: '970562'
  }, {
    name: 'Ngân hàng TMCP Công thương Việt Nam',
    shortName: 'CTG',
    bin: '970010'
  }, {
    name: 'Ngân hàng Techcombank',
    shortName: 'TCB',
    bin: '970407'
  }, {
    name: 'Ngân hàng TMCP Á Châu',
    shortName: 'ACB',
    bin: '970005'
  }, {
    name: 'Ngân hàng TMCP Quân Đội',
    shortName: 'MBB',
    bin: '970422'
  }, {
    name: 'Ngân hàng TMCP Nông nghiệp',
    shortName: 'AGR',
    bin: '970012'
  }, {
    name: 'Ngân hàng TMCP Sài Gòn',
    shortName: 'STB',
    bin: '970415'
  }, {
    name: 'Ngân hàng VP Bank',
    shortName: 'VPB',
    bin: '970432'
  }, {
    name: 'Ngân hàng TMCP Quốc tế',
    shortName: 'VIB',
    bin: '970441'
  }, {
    name: 'Ngân hàng TMCP Kiên Long',
    shortName: 'KLB',
    bin: '970452'
  }, {
    name: 'Ngân hàng TMCP Kỹ thương',
    shortName: 'TCB',
    bin: '970458'
  }, {
    name: 'Ngân hàng Bản Việt',
    shortName: 'BVB',
    bin: '970450'
  }];
}

/**
 * Initialize withdrawal banks module
 */
function initWithdrawalBanks() {
  // Load banks only when withdrawal modal is opened
  var withdrawModal = document.getElementById('withdrawModal');
  if (withdrawModal) {
    // Detect when modal becomes visible
    var observer = new MutationObserver(function () {
      var isVisible = withdrawModal.style.display !== 'none' && withdrawModal.style.visibility !== 'hidden' && !withdrawModal.classList.contains('hidden');
      if (isVisible && !withdrawalBanksCache) {
        loadWithdrawalBanks();
      }
    });
    observer.observe(withdrawModal, {
      attributes: true,
      style: true
    });
  }

  // Also check for openWithdrawModal function to load banks
  if (window.openWithdrawModal) {
    var original = window.openWithdrawModal;
    window.openWithdrawModal = function () {
      if (!withdrawalBanksCache) {
        loadWithdrawalBanks();
      }
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return original.apply(this, args);
    };
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWithdrawalBanks);
} else {
  initWithdrawalBanks();
}

// Export for manual calls
window.loadWithdrawalBanks = loadWithdrawalBanks;