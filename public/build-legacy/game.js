function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/* =============================================
   GIFT BOX GAME - VANILLA JAVASCRIPT
   ============================================= */

// ============================================
// STATE MANAGEMENT
// ============================================
var game = {
  step: 1,
  sessionCode: null,
  playerId: null,
  name: null,
  phone: null,
  selectedBox: null,
  prize: null,
  soundEnabled: true,
  localStorage: null
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
  var params;
  return _regenerator().w(function (_context) {
    while (1) switch (_context.n) {
      case 0:
        // Add CSS class to body
        document.body.classList.add('game-page');

        // Initialize particles
        initParticles();

        // Check for sessionCode in URL
        params = new URLSearchParams(window.location.search);
        game.sessionCode = params.get('code');

        // Load state from localStorage
        loadGameState();

        // Sound toggle
        setupSoundToggle();

        // If returnin user
        if (game.step > 1 && game.sessionCode) {
          showStep(game.step);
        } else {
          showStep(1);
        }

        // Handle Enter key for continuing
        document.addEventListener('keypress', function (e) {
          if (e.key === 'Enter') {
            var continueBtn = document.querySelector('.btn-continue');
            if (continueBtn && !continueBtn.classList.contains('loading')) {
              continueBtn.click();
            }
          }
        });
      case 1:
        return _context.a(2);
    }
  }, _callee);
})));

// ============================================
// PARTICLE BACKGROUND
// ============================================
function initParticles() {
  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var particles = [];
  var particleCount = 60;

  // Create particles
  for (var i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  // Animation loop
  function animate() {
    ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity += (Math.random() - 0.5) * 0.02;
      p.opacity = Math.max(0.1, Math.min(0.6, p.opacity));

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.fillStyle = "rgba(139, 92, 246, ".concat(p.opacity, ")");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ============================================
// STEP TRANSITIONS
// ============================================
function showStep(step) {
  game.step = step;
  saveGameState();

  // Hide all steps
  document.querySelectorAll('.step-container').forEach(function (el) {
    el.classList.remove('active');
  });

  // Show current step
  var stepEl = document.querySelector(".step-".concat(step, "-container"));
  if (stepEl) {
    stepEl.classList.add('active');
  }

  // Focus first input
  var firstInput = stepEl === null || stepEl === void 0 ? void 0 : stepEl.querySelector('input');
  if (firstInput) {
    setTimeout(function () {
      return firstInput.focus();
    }, 100);
  }
}

// ✅ NEW: Update prize display in step 4
function updatePrizeDisplay() {
  if (game.step !== 4 || !game.prize) return;
  var prizeIcon = document.getElementById('prizeIcon');
  var prizeName = document.getElementById('prizeName');
  var prizeDesc = document.getElementById('prizeDesc');
  var prizeLevel = document.getElementById('prizeLevel');
  var walletAmount = document.getElementById('walletAmount');
  var walletTitle = document.getElementById('walletTitle');
  var withdrawAmount = document.getElementById('withdrawAmount');
  var giftPrizeName = document.getElementById('giftPrizeName');
  if (prizeIcon) prizeIcon.textContent = game.prize.icon || '🎁';
  if (prizeName) prizeName.textContent = game.prize.name || 'Phần thưởng';
  if (prizeDesc) prizeDesc.textContent = game.prize.description || '';
  if (prizeLevel) {
    var badgeClass = 'normal';
    var badgeText = 'THƯỜNG';
    if (game.prize.level === 'VIP') {
      badgeClass = 'vip';
      badgeText = '⭐ VIP';
    } else if (game.prize.level === 'UNLUCKY') {
      badgeClass = 'unlucky';
      badgeText = '💔 HẠN CÓ PHẦN SAI';
    }
    prizeLevel.innerHTML = "<div class=\"prize-badge ".concat(badgeClass, "\">").concat(badgeText, "</div>");
  }
  if (game.prize.isCash && game.prize.cashAmount > 0) {
    if (walletAmount) {
      walletAmount.textContent = (game.prize.cashAmount || 0).toLocaleString('vi-VN') + ' VNĐ';
    }
    if (walletTitle) {
      walletTitle.textContent = "V\xED phi\xEAn: ".concat(game.sessionCode);
    }
    document.getElementById('btnWithdraw').style.display = 'block';
    document.getElementById('walletCard').style.opacity = '1';
  } else {
    if (walletAmount) walletAmount.textContent = '0 VNĐ';
    if (walletTitle) walletTitle.textContent = 'Phần thưởng: Hiện vật';
    document.getElementById('btnWithdraw').style.display = 'none';
    document.getElementById('walletCard').style.opacity = '0.6';
  }
  if (withdrawAmount && game.prize.isCash) {
    withdrawAmount.textContent = (game.prize.cashAmount || 0).toLocaleString('vi-VN') + ' VNĐ';
  }
  if (giftPrizeName) {
    giftPrizeName.textContent = "Ph\u1EA7n qu\xE0: ".concat(game.prize.icon, " ").concat(game.prize.name || 'Quà tặng');
  }

  // ✅ Hide buttons if UNLUCKY - No claiming or withdrawing allowed
  var btnClaimGift = document.getElementById('btnClaimGift');
  var btnWithdraw = document.getElementById('btnWithdraw');
  if (game.prize.level === 'UNLUCKY') {
    if (btnClaimGift) {
      btnClaimGift.style.display = 'none';
      btnClaimGift.disabled = true;
    }
    if (btnWithdraw) {
      btnWithdraw.style.display = 'none';
      btnWithdraw.disabled = true;
    }
    console.warn('⚠️ [updatePrizeDisplay] Prize is UNLUCKY - buttons disabled');
  }
}

// ============================================
// STEP 1: VALIDATE SESSION CODE
// ============================================
window.continueToStep2 = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
  var sessionInput, code, btn, res, data, _t;
  return _regenerator().w(function (_context2) {
    while (1) switch (_context2.p = _context2.n) {
      case 0:
        sessionInput = document.querySelector('.session-code-input');
        code = sessionInput === null || sessionInput === void 0 ? void 0 : sessionInput.value.trim().toUpperCase();
        if (code) {
          _context2.n = 1;
          break;
        }
        showToast('Vui lòng nhập mã phiên chơi', 'error');
        return _context2.a(2);
      case 1:
        btn = document.querySelector('.btn-continue');
        btn.classList.add('loading');
        btn.innerHTML = '<span class="spinner"></span>Đang kiểm tra...';
        _context2.p = 2;
        _context2.n = 3;
        return fetch("/api/game/session-info/".concat(code));
      case 3:
        res = _context2.v;
        _context2.n = 4;
        return res.json();
      case 4:
        data = _context2.v;
        if (!(!data.success || !data.isValid)) {
          _context2.n = 5;
          break;
        }
        sessionInput.classList.add('shake');
        showToast('Mã phiên chơi không tồn tại', 'error');
        setTimeout(function () {
          return sessionInput.classList.remove('shake');
        }, 400);
        return _context2.a(2);
      case 5:
        if (!data.isUnlucky) {
          _context2.n = 6;
          break;
        }
        sessionInput.classList.add('shake');
        showNotification('😢 Kết quả xui lỗi', '❌ Bạn đã chơi mã phiên này và không trúng phần quà nào cả.<br><br>Hãy thử lại bằng <strong>mã phiên khác</strong>!', 'error');
        setTimeout(function () {
          return sessionInput.classList.remove('shake');
        }, 400);
        return _context2.a(2);
      case 6:
        if (!data.alreadyPlayed) {
          _context2.n = 7;
          break;
        }
        showToast('Phiên này đã được sử dụng rồi', 'error');
        return _context2.a(2);
      case 7:
        if (!data.isExpired) {
          _context2.n = 8;
          break;
        }
        showToast('Phiên chơi đã hết hạn', 'error');
        return _context2.a(2);
      case 8:
        game.sessionCode = code;
        saveGameState();
        showStep(2);
        _context2.n = 10;
        break;
      case 9:
        _context2.p = 9;
        _t = _context2.v;
        console.error('Error:', _t);
        showToast('Lỗi kết nối, vui lòng thử lại', 'error');
      case 10:
        _context2.p = 10;
        btn.classList.remove('loading');
        btn.innerHTML = 'Tiếp tục ✓';
        return _context2.f(10);
      case 11:
        return _context2.a(2);
    }
  }, _callee2, null, [[2, 9, 10, 11]]);
}));

// ============================================
// STEP 2: PERSONAL INFO
// ============================================
window.startGame = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
  var nameInput, phoneInput, name, phone, btn, res, data, _t2;
  return _regenerator().w(function (_context3) {
    while (1) switch (_context3.p = _context3.n) {
      case 0:
        nameInput = document.querySelector('input[placeholder*="Họ tên"]') || document.querySelector('input[name="name"]');
        phoneInput = document.querySelector('input[placeholder*="Số điện thoại"]') || document.querySelector('input[name="phone"]');
        name = nameInput === null || nameInput === void 0 ? void 0 : nameInput.value.trim();
        phone = phoneInput === null || phoneInput === void 0 ? void 0 : phoneInput.value.trim();
        if (name) {
          _context3.n = 1;
          break;
        }
        showToast('Vui lòng nhập họ tên', 'error');
        nameInput === null || nameInput === void 0 || nameInput.focus();
        return _context3.a(2);
      case 1:
        if (phone) {
          _context3.n = 2;
          break;
        }
        showToast('Vui lòng nhập số điện thoại', 'error');
        phoneInput === null || phoneInput === void 0 || phoneInput.focus();
        return _context3.a(2);
      case 2:
        if (/^\d{10,11}$/.test(phone)) {
          _context3.n = 3;
          break;
        }
        showToast('Số điện thoại không hợp lệ (10-11 chữ số)', 'error');
        phoneInput === null || phoneInput === void 0 || phoneInput.focus();
        return _context3.a(2);
      case 3:
        btn = document.querySelector('.btn-start');
        btn.classList.add('loading');
        btn.innerHTML = '<span class="spinner"></span>Đang bắt đầu...';
        _context3.p = 4;
        _context3.n = 5;
        return fetch('/api/game/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sessionCode: game.sessionCode,
            name: name,
            phone: phone
          })
        });
      case 5:
        res = _context3.v;
        _context3.n = 6;
        return res.json();
      case 6:
        data = _context3.v;
        if (data.success) {
          _context3.n = 7;
          break;
        }
        showToast(data.message || 'Lỗi, vui lòng thử lại', 'error');
        return _context3.a(2);
      case 7:
        game.playerId = data.data.playerId;
        game.name = name;
        game.phone = phone;
        saveGameState();
        playSound(0.7, 0.3, 'sine'); // Success sound
        showStep(3);
        _context3.n = 9;
        break;
      case 8:
        _context3.p = 8;
        _t2 = _context3.v;
        console.error('Error:', _t2);
        showToast('Lỗi kết nối', 'error');
      case 9:
        _context3.p = 9;
        btn.classList.remove('loading');
        btn.innerHTML = 'Bắt đầu chơi';
        return _context3.f(9);
      case 10:
        return _context3.a(2);
    }
  }, _callee3, null, [[4, 8, 9, 10]]);
}));

// ============================================
// STEP 3: BOX SELECTION
// ============================================
window.selectBox = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(index) {
    var boxes, btn, res, data, _t3;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          boxes = document.querySelectorAll('.gift-box');
          game.selectedBox = index;

          // Play sound
          playSound(0.5, 0.2, 'sine');

          // Mark selected and disable others
          boxes.forEach(function (box, i) {
            if (i === index) {
              box.classList.add('selected');
            } else {
              box.classList.add('disabled');
            }
          });
          _context4.n = 1;
          return new Promise(function (r) {
            return setTimeout(r, 600);
          });
        case 1:
          // Fetch prize
          btn = document.querySelector('.btn-continue, .btn-open');
          if (btn) {
            btn.classList.add('loading');
            btn.innerHTML = '<span class="spinner"></span>Đang mở hộp...';
          }
          _context4.p = 2;
          // Confetti animation
          createConfetti();

          // Play success sound (arpeggio)
          playArpeggio();
          _context4.n = 3;
          return fetch('/api/game/open-box', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              playerId: game.playerId,
              sessionCode: game.sessionCode,
              boxIndex: index
            })
          });
        case 3:
          res = _context4.v;
          _context4.n = 4;
          return res.json();
        case 4:
          data = _context4.v;
          if (data.success) {
            _context4.n = 5;
            break;
          }
          showToast(data.message || 'Lỗi, vui lòng thử lại', 'error');
          return _context4.a(2);
        case 5:
          game.prize = data.data.prize;
          saveGameState();
          _context4.n = 6;
          return new Promise(function (r) {
            return setTimeout(r, 1000);
          });
        case 6:
          showStep(4);
          updatePrizeDisplay(); // ✅ Update DOM immediately
          _context4.n = 8;
          break;
        case 7:
          _context4.p = 7;
          _t3 = _context4.v;
          console.error('Error:', _t3);
          showToast('Lỗi kết nối', 'error');
        case 8:
          _context4.p = 8;
          if (btn) {
            btn.classList.remove('loading');
            btn.innerHTML = 'Mở hộp quà';
          }
          return _context4.f(8);
        case 9:
          return _context4.a(2);
      }
    }, _callee4, null, [[2, 7, 8, 9]]);
  }));
  return function (_x) {
    return _ref4.apply(this, arguments);
  };
}();

// ============================================
// STEP 4: PRIZE RESULT & MODALS
// ============================================
window.openWithdrawModal = function () {
  var modal = document.getElementById('withdrawalModal');
  modal === null || modal === void 0 || modal.classList.add('active');
};
window.openGiftModal = function () {
  // ✅ CHECK IF PRIZE IS UNLUCKY - CANNOT CLAIM
  if (game.prize && game.prize.level === 'UNLUCKY') {
    showToast('💔 Phần thưởng xui lỗi! Không thể nhận phần thưởng này.', '❌');
    return;
  }
  var modal = document.getElementById('giftModal');
  modal === null || modal === void 0 || modal.classList.add('active');
};
window.closeModal = function (modalId) {
  var modal = document.getElementById(modalId);
  modal === null || modal === void 0 || modal.classList.remove('active');
};
window.claimPrize = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(method) {
    var bankSelect, accountNum, accountName, phone, bank, account, holder, withdrawPhone, btn, res, data, receiverName, giftPhone, province, district, address, receiver, giftPhoneVal, prov, dist, addr, _btn, _res, _data, _t4, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          if (!(game.prize && game.prize.level === 'UNLUCKY')) {
            _context5.n = 1;
            break;
          }
          showToast('💔 Phần thưởng xui lỗi! Không thể nhận phần thưởng này.', 'error');
          return _context5.a(2);
        case 1:
          if (!(method === 'bank')) {
            _context5.n = 12;
            break;
          }
          bankSelect = document.querySelector('select[name="bank"]');
          accountNum = document.querySelector('input[name="account"]');
          accountName = document.querySelector('input[name="accountName"]');
          phone = document.querySelector('input[name="withdrawPhone"]');
          bank = bankSelect === null || bankSelect === void 0 ? void 0 : bankSelect.value;
          account = accountNum === null || accountNum === void 0 ? void 0 : accountNum.value.trim();
          holder = accountName === null || accountName === void 0 ? void 0 : accountName.value.trim().toUpperCase();
          withdrawPhone = phone === null || phone === void 0 ? void 0 : phone.value.trim();
          if (!(!bank || !account || !holder)) {
            _context5.n = 2;
            break;
          }
          showToast('Vui lòng điền đầy đủ thông tin ngân hàng', 'error');
          return _context5.a(2);
        case 2:
          if (withdrawPhone) {
            _context5.n = 3;
            break;
          }
          showToast('Vui lòng nhập số điện thoại xác nhận', 'error');
          return _context5.a(2);
        case 3:
          btn = document.querySelector('#withdrawalModal .btn-modal-confirm');
          btn.classList.add('loading');
          btn.innerHTML = '<span class="spinner"></span>Đang xác nhận...';
          _context5.p = 4;
          _context5.n = 5;
          return fetch('/api/game/claim', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              playerId: game.playerId,
              sessionCode: game.sessionCode,
              method: 'bank',
              bankName: bank,
              accountNumber: account,
              accountName: holder,
              phone: withdrawPhone
            })
          });
        case 5:
          res = _context5.v;
          _context5.n = 6;
          return res.json();
        case 6:
          data = _context5.v;
          if (data.success) {
            _context5.n = 7;
            break;
          }
          showToast(data.message || 'Lỗi, vui lòng thử lại', 'error');
          return _context5.a(2);
        case 7:
          game.claimId = data.data.claimId;
          game.claimMethod = 'bank';
          saveGameState();
          playSound(0.8, 0.15, 'sine'); // Success
          playSound(0.6, 0.15, 'sine');
          closeModal('withdrawalModal');
          _context5.n = 8;
          return new Promise(function (r) {
            return setTimeout(r, 500);
          });
        case 8:
          showStep(5);
          _context5.n = 10;
          break;
        case 9:
          _context5.p = 9;
          _t4 = _context5.v;
          console.error('Error:', _t4);
          showToast('Lỗi kết nối', 'error');
        case 10:
          _context5.p = 10;
          btn.classList.remove('loading');
          btn.innerHTML = 'Xác nhận rút tiền';
          return _context5.f(10);
        case 11:
          _context5.n = 21;
          break;
        case 12:
          if (!(method === 'gift')) {
            _context5.n = 21;
            break;
          }
          receiverName = document.querySelector('input[name="receiverName"]');
          giftPhone = document.querySelector('input[name="giftPhone"]');
          province = document.querySelector('select[name="province"]');
          district = document.querySelector('input[name="district"]');
          address = document.querySelector('textarea[name="address"]');
          receiver = receiverName === null || receiverName === void 0 ? void 0 : receiverName.value.trim();
          giftPhoneVal = giftPhone === null || giftPhone === void 0 ? void 0 : giftPhone.value.trim();
          prov = province === null || province === void 0 ? void 0 : province.value;
          dist = district === null || district === void 0 ? void 0 : district.value.trim();
          addr = address === null || address === void 0 ? void 0 : address.value.trim();
          if (!(!receiver || !giftPhoneVal || !prov || !dist || !addr)) {
            _context5.n = 13;
            break;
          }
          showToast('Vui lòng điền đầy đủ thông tin giao hàng', 'error');
          return _context5.a(2);
        case 13:
          _btn = document.querySelector('#giftModal .btn-modal-confirm');
          _btn.classList.add('loading');
          _btn.innerHTML = '<span class="spinner"></span>Đang xác nhận...';
          _context5.p = 14;
          _context5.n = 15;
          return fetch('/api/game/claim', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              playerId: game.playerId,
              sessionCode: game.sessionCode,
              method: 'gift',
              province: prov,
              district: dist,
              address: addr,
              phone: giftPhoneVal,
              note: 'N/A'
            })
          });
        case 15:
          _res = _context5.v;
          _context5.n = 16;
          return _res.json();
        case 16:
          _data = _context5.v;
          if (_data.success) {
            _context5.n = 17;
            break;
          }
          showToast(_data.message || 'Lỗi, vui lòng thử lại', 'error');
          return _context5.a(2);
        case 17:
          game.claimId = _data.data.claimId;
          game.claimMethod = 'gift';
          saveGameState();
          playSound(0.8, 0.15, 'sine');
          playSound(0.6, 0.15, 'sine');
          closeModal('giftModal');
          _context5.n = 18;
          return new Promise(function (r) {
            return setTimeout(r, 500);
          });
        case 18:
          showStep(5);
          _context5.n = 20;
          break;
        case 19:
          _context5.p = 19;
          _t5 = _context5.v;
          console.error('Error:', _t5);
          showToast('Lỗi kết nối', 'error');
        case 20:
          _context5.p = 20;
          _btn.classList.remove('loading');
          _btn.innerHTML = 'Xác nhận nhận quà';
          return _context5.f(20);
        case 21:
          return _context5.a(2);
      }
    }, _callee5, null, [[14, 19, 20, 21], [4, 9, 10, 11]]);
  }));
  return function (_x2) {
    return _ref5.apply(this, arguments);
  };
}();

// ============================================
// UTILITIES
// ============================================

// Save game state
function saveGameState() {
  var state = {
    step: game.step,
    sessionCode: game.sessionCode,
    playerId: game.playerId,
    name: game.name,
    phone: game.phone,
    selectedBox: game.selectedBox,
    prize: game.prize,
    claimMethod: game.claimMethod,
    claimId: game.claimId,
    timestamp: Date.now()
  };
  localStorage.setItem("game_session_".concat(game.sessionCode), JSON.stringify(state));
}

// Load game state
function loadGameState() {
  if (!game.sessionCode && new URLSearchParams(window.location.search).get('code')) {
    game.sessionCode = new URLSearchParams(window.location.search).get('code');
  }
  if (game.sessionCode) {
    var saved = localStorage.getItem("game_session_".concat(game.sessionCode));
    if (saved) {
      try {
        var state = JSON.parse(saved);
        var ageMs = Date.now() - state.timestamp;
        var age48h = 48 * 60 * 60 * 1000;
        if (ageMs > age48h) {
          // Expired
          localStorage.removeItem("game_session_".concat(game.sessionCode));
          return;
        }
        Object.assign(game, state);
      } catch (err) {
        console.error('Error loading state:', err);
      }
    }
  }
}

// Toast notifications
function showToast(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;
  var toast = document.createElement('div');
  toast.className = "toast ".concat(type);
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(function () {
      return toast.remove();
    }, 300);
  }, duration);
}

// Sound synthesis
var audioContext = null;
function playSound(freq) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.3;
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sine';
  if (!game.soundEnabled) return;
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  var ctx = audioContext;
  var now = ctx.currentTime;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
  osc.start(now);
  osc.stop(now + duration);
}
function playArpeggio() {
  if (!game.soundEnabled) return;
  var freqs = [261.63, 329.63, 392]; // C4, E4, G4 (C major)
  freqs.forEach(function (freq, i) {
    setTimeout(function () {
      return playSound(freq, 0.2);
    }, i * 100);
  });
}
function setupSoundToggle() {
  var btn = document.querySelector('.sound-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    game.soundEnabled = !game.soundEnabled;
    btn.classList.toggle('muted');
    btn.textContent = game.soundEnabled ? '🔊' : '🔇';
    showToast(game.soundEnabled ? 'Âm thanh bật' : 'Âm thanh tắt', 'info', 1500);
  });
}

// Confetti effect
function createConfetti() {
  var canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = 999;
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var confetti = [];
  var colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#fbbf24', '#10b981'];
  for (var i = 0; i < 120; i++) {
    confetti.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 1) * 15,
      size: Math.random() * 4 + 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      decay: Math.random() * 0.015 + 0.01
    });
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(function (c, i) {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.3; // Gravity
      c.rotation += c.rotationSpeed;
      c.life -= c.decay;
      if (c.life <= 0) {
        confetti.splice(i, 1);
        return;
      }
      ctx.save();
      ctx.globalAlpha = c.life;
      ctx.fillStyle = c.color;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
      ctx.restore();
    });
    if (confetti.length > 0) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  animate();
}

// Share functionality
window.shareResult = function () {
  if (navigator.share) {
    var _game$prize;
    navigator.share({
      title: 'Kết quả mở hộp quà',
      text: "T\xF4i \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c: ".concat((_game$prize = game.prize) === null || _game$prize === void 0 ? void 0 : _game$prize.name, "! \uD83C\uDF89"),
      url: window.location.href
    }).catch(function (err) {
      return console.log('Share error:', err);
    });
  } else {
    var _game$prize2;
    showToast('Chức năng chia sẻ không được hỗ trợ', 'info');
    // Fallback: copy to clipboard
    var text = "K\u1EBFt qu\u1EA3 m\u1EDF h\u1ED9p qu\xE0: ".concat((_game$prize2 = game.prize) === null || _game$prize2 === void 0 ? void 0 : _game$prize2.name, "! \uD83C\uDF89 \nXem chi ti\u1EBFt t\u1EA1i: ").concat(window.location.href);
    navigator.clipboard.writeText(text).then(function () {
      showToast('Đã sao chép vào clipboard', 'success');
    });
  }
};

// Format VNĐ currency
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
}

// Count-up animation for wallet
function animateCountUp(element, startAmount, endAmount) {
  var duration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1500;
  var startTime = null;
  function update(currentTime) {
    if (!startTime) startTime = currentTime;
    var progress = (currentTime - startTime) / duration;
    if (progress < 1) {
      var current = startAmount + (endAmount - startAmount) * progress;
      element.textContent = formatVND(Math.floor(current));
      requestAnimationFrame(update);
    } else {
      element.textContent = formatVND(endAmount);
    }
  }
  requestAnimationFrame(update);
}

// Auto-populate fields in modals
window.populateWithdrawalPhone = function () {
  var phoneInput = document.querySelector('input[name="withdrawPhone"]');
  if (phoneInput) {
    phoneInput.value = game.phone;
  }
};
window.populateGiftReceiver = function () {
  var nameInput = document.querySelector('input[name="receiverName"]');
  var phoneInput = document.querySelector('input[name="giftPhone"]');
  if (nameInput) nameInput.value = game.name;
  if (phoneInput) phoneInput.value = game.phone;
};

// Handle modal close on backdrop click
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Mobile number formatting
var phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(function (input) {
  input.addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/[^\d]/g, '');
  });
});