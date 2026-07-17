function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Payment QR Code Generator
 * Tạo mã QR thanh toán từ VietQR API
 */

var qrCurrentData = {};
var qrInitialized = false; // Guard flag to prevent double initialization

/**
 * Initialize QR Payment Module
 */
function initPaymentQR() {
  // Prevent double initialization
  if (qrInitialized) {
    return;
  }
  qrInitialized = true;

  // Load banks on first interaction instead of page load
  var bankSelect = document.getElementById('bankSelect');
  if (bankSelect) {
    bankSelect.addEventListener('click', loadBanksOnce, {
      once: true
    });
  }
}

/**
 * Load banks once on first interaction
 */
function loadBanksOnce() {
  return _loadBanksOnce.apply(this, arguments);
}
/**
 * Load danh sách ngân hàng từ API
 */
function _loadBanksOnce() {
  _loadBanksOnce = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (qrCurrentData.banksLoaded) {
            _context.n = 2;
            break;
          }
          _context.n = 1;
          return loadBanksList();
        case 1:
          qrCurrentData.banksLoaded = true;
        case 2:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _loadBanksOnce.apply(this, arguments);
}
function loadBanksList() {
  return _loadBanksList.apply(this, arguments);
}
/**
 * Populate bank dropdown with bank options
 */
function _loadBanksList() {
  _loadBanksList = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var bankSelect, spinner, response, result, banks, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          bankSelect = document.getElementById('bankSelect');
          spinner = document.getElementById('bankLoadingSpinner');
          _context2.p = 1;
          spinner.style.display = 'block';
          _context2.n = 2;
          return fetch('/api/banks', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        case 2:
          response = _context2.v;
          if (response.ok) {
            _context2.n = 3;
            break;
          }
          // If rate limited (429) or error, use fallback immediately
          populateBankDropdown(getQRFallbackBanks());
          spinner.style.display = 'none';
          return _context2.a(2);
        case 3:
          _context2.n = 4;
          return response.json();
        case 4:
          result = _context2.v;
          banks = result.data || [];
          if (banks.length) {
            _context2.n = 5;
            break;
          }
          populateBankDropdown(getQRFallbackBanks());
          spinner.style.display = 'none';
          return _context2.a(2);
        case 5:
          // Clear existing options
          bankSelect.innerHTML = '<option value="">-- Chọn ngân hàng --</option>';

          // Add bank options
          banks.forEach(function (bank) {
            var option = document.createElement('option');
            option.value = bank.bin; // Use BIN as value
            option.textContent = "".concat(bank.shortName, " - ").concat(bank.name);
            option.dataset.name = bank.shortName;
            option.dataset.bin = bank.bin;
            bankSelect.appendChild(option);
          });
          _context2.n = 7;
          break;
        case 6:
          _context2.p = 6;
          _t = _context2.v;
          // Use fallback on any error
          populateBankDropdown(getQRFallbackBanks());
        case 7:
          _context2.p = 7;
          spinner.style.display = 'none';
          return _context2.f(7);
        case 8:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 6, 7, 8]]);
  }));
  return _loadBanksList.apply(this, arguments);
}
function populateBankDropdown(banks) {
  var bankSelect = document.getElementById('bankSelect');
  if (!bankSelect) return;
  bankSelect.innerHTML = '<option value="">-- Chọn ngân hàng --</option>';
  banks.forEach(function (bank) {
    var option = document.createElement('option');
    option.value = bank.bin;
    option.textContent = "".concat(bank.shortName, " - ").concat(bank.name);
    option.dataset.name = bank.shortName;
    option.dataset.bin = bank.bin;
    bankSelect.appendChild(option);
  });
}

/**
 * Fallback Vietnamese banks list for QR payment
 */
function getQRFallbackBanks() {
  return [{
    name: 'Ngân hàng TMCP Ngoại thương Việt Nam',
    shortName: 'Vietcombank',
    bin: '970436'
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
  }];
}

/**
 * Generate QR Code
 */
function generateQR(event) {
  event.preventDefault();

  // Get form values
  var bankSelect = document.getElementById('bankSelect');
  var accountNumber = document.getElementById('accountNumber').value.trim();
  var accountName = document.getElementById('accountName').value.trim().toUpperCase();
  var amount = document.getElementById('amount').value.trim();
  var content = document.getElementById('content').value.trim().toUpperCase();

  // Validate
  var errors = [];
  if (!bankSelect.value) errors.push('Vui lòng chọn ngân hàng');
  if (!accountNumber) errors.push('Vui lòng nhập số tài khoản');
  if (!accountName) errors.push('Vui lòng nhập tên chủ tài khoản');
  if (!amount || amount < 1000) errors.push('Số tiền phải >= 1000 VND');
  if (!content) errors.push('Vui lòng nhập nội dung chuyển khoản');
  if (errors.length > 0) {
    showQRError(errors.join('\n'));
    return false;
  }

  // Get selected bank info
  var selectedOption = bankSelect.options[bankSelect.selectedIndex];
  var bin = selectedOption.value;
  var bankName = selectedOption.dataset.name;

  // Build VietQR URL
  var encodedContent = encodeURIComponent(content);
  var encodedName = encodeURIComponent(accountName);
  var qrUrl = "https://img.vietqr.io/image/".concat(bin, "-").concat(accountNumber, "-compact2.png?amount=").concat(amount, "&addInfo=").concat(encodedContent, "&accountName=").concat(encodedName);

  // Store data for later use
  qrCurrentData = {
    bankName: bankName,
    accountNumber: accountNumber,
    accountName: accountName,
    amount: amount,
    content: content,
    qrUrl: qrUrl
  };

  // Display QR
  displayQR(qrUrl);
  hideQRError();
  return false;
}

/**
 * Display QR Image
 */
function displayQR(qrUrl) {
  var display = document.getElementById('qrDisplay');
  var qrImage = document.getElementById('qrImage');
  var qrBankName = document.getElementById('qrBankName');
  var qrAccountNumber = document.getElementById('qrAccountNumber');
  var qrAmount = document.getElementById('qrAmount');
  var qrContent = document.getElementById('qrContent');
  qrImage.src = qrUrl;
  qrImage.onerror = function () {
    showQRError('Không thể tạo mã QR. Vui lòng kiểm tra lại thông tin');
  };
  qrBankName.textContent = qrCurrentData.bankName;
  qrAccountNumber.textContent = qrCurrentData.accountNumber;
  qrAmount.textContent = qrCurrentData.amount.toLocaleString('vi-VN') + ' đ';
  qrContent.textContent = qrCurrentData.content;
  display.style.display = 'block';

  // Scroll to QR
  setTimeout(function () {
    display.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }, 100);
}

/**
 * Copy QR URL to Clipboard
 */
function copyQRUrl() {
  if (!qrCurrentData.qrUrl) {
    alert('Vui lòng tạo mã QR trước');
    return;
  }
  navigator.clipboard.writeText(qrCurrentData.qrUrl).then(function () {
    showQRToast('✅ Đã sao chép link QR', 'success');
  }).catch(function () {
    // Fallback
    var textarea = document.createElement('textarea');
    textarea.value = qrCurrentData.qrUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showQRToast('✅ Đã sao chép link QR', 'success');
  });
}

/**
 * Download QR Image
 */
function downloadQR() {
  if (!qrCurrentData.qrUrl) {
    alert('Vui lòng tạo mã QR trước');
    return;
  }
  var link = document.createElement('a');
  link.href = qrCurrentData.qrUrl;
  link.download = "QR_".concat(qrCurrentData.accountNumber, "_").concat(Date.now(), ".png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showQRToast('✅ Đang tải mã QR', 'success');
}

/**
 * Reset QR Form
 */
function resetQRForm() {
  document.getElementById('qrForm').reset();
  document.getElementById('qrDisplay').style.display = 'none';
  qrCurrentData = {};
  hideQRError();
}

/**
 * Show Error Message
 */
function showQRError(message) {
  var errorDiv = document.getElementById('qrError');
  var errorMsg = document.getElementById('qrErrorMessage');
  errorMsg.textContent = message;
  errorDiv.style.display = 'flex';
}

/**
 * Hide Error Message
 */
function hideQRError() {
  var errorDiv = document.getElementById('qrError');
  errorDiv.style.display = 'none';
}

/**
 * QR toast helper (local scope, does not override global dashboard toast)
 */
function showQRToast(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
  // Prefer the dashboard/global toast renderer when available
  if (typeof window.showToast === 'function') {
    window.showToast(message, type);
    return;
  }

  // Fallback for pages that expose toast object API
  if (typeof window.toast !== 'undefined' && window.toast && typeof window.toast.show === 'function') {
    window.toast.show(message, type);
    return;
  }

  // Fallback: create simple alert
  var toastEl = document.createElement('div');
  toastEl.style.cssText = "\n    position: fixed;\n    bottom: 20px;\n    right: 20px;\n    padding: 12px 20px;\n    background: ".concat(type === 'success' ? '#22c55e' : '#6366f1', ";\n    color: white;\n    border-radius: 6px;\n    font-size: 14px;\n    z-index: 999999;\n    animation: slideInRight 0.3s ease-out;\n  ");
  toastEl.textContent = message;
  document.body.appendChild(toastEl);
  setTimeout(function () {
    toastEl.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(function () {
      return toastEl.remove();
    }, 300);
  }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('bankSelect')) {
    initPaymentQR();
  }
});

// Allow external initialization
window.initPaymentQR = initPaymentQR;