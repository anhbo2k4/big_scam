function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Enhanced Gift Box Opening Interface
 * Upgraded with animations, effects, and better UX
 */

var giftBoxGame = {
  boxes: [],
  selectedIndex: -1,
  isAnimating: false,
  gameSession: null,
  init: function () {
    var _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var response, data, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            // Initialize boxes
            giftBoxGame.setupBoxes();
            giftBoxGame.attachEventListeners();

            // Get current game session
            _context.n = 1;
            return fetch('/api/current-session');
          case 1:
            response = _context.v;
            if (!response.ok) {
              _context.n = 3;
              break;
            }
            _context.n = 2;
            return response.json();
          case 2:
            data = _context.v;
            giftBoxGame.gameSession = data.data;
            giftBoxGame.updateGameInfo();
          case 3:
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            console.error('❌ Error initializing game:', _t);
            giftBoxGame.showNotification('Lỗi khi khởi tạo trò chơi', 'error');
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[0, 4]]);
    }));
    function init() {
      return _init.apply(this, arguments);
    }
    return init;
  }(),
  setupBoxes: function setupBoxes() {
    var boxContainer = document.getElementById('giftBoxContainer');
    if (!boxContainer) return;
    var boxCount = parseInt(boxContainer.dataset.boxCount) || 12;
    boxContainer.innerHTML = '';
    var _loop = function _loop(i) {
      var box = document.createElement('div');
      box.className = 'gift-box-item';
      box.dataset.index = i;
      box.innerHTML = "\n        <div class=\"gift-box\">\n          <div class=\"gift-box-lid\">\n            <div class=\"gift-box-ribbon\"></div>\n            <div class=\"gift-box-bow\"></div>\n          </div>\n          <div class=\"gift-box-body\">\n            <div class=\"gift-box-emoji\">\uD83C\uDF81</div>\n          </div>\n        </div>\n        <div class=\"box-glow\"></div>\n        <span class=\"box-number\">".concat(i + 1, "</span>\n      ");
      box.addEventListener('click', function () {
        return giftBoxGame.selectBox(i);
      });
      box.addEventListener('mouseenter', function () {
        if (!giftBoxGame.isAnimating && giftBoxGame.selectedIndex === -1) {
          box.classList.add('hover');
        }
      });
      box.addEventListener('mouseleave', function () {
        box.classList.remove('hover');
      });
      boxContainer.appendChild(box);
    };
    for (var i = 0; i < boxCount; i++) {
      _loop(i);
    }
    giftBoxGame.boxes = document.querySelectorAll('.gift-box-item');
  },
  selectBox: function () {
    var _selectBox = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(index) {
      var box, _giftBoxGame$gameSess, response, data, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            if (!(giftBoxGame.isAnimating || giftBoxGame.selectedIndex !== -1)) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            box = giftBoxGame.boxes[index];
            giftBoxGame.isAnimating = true;
            giftBoxGame.selectedIndex = index;

            // Animate selection
            box.classList.add('selected');

            // Play sound if available
            giftBoxGame.playSound('select');

            // Show selection feedback
            giftBoxGame.showSelectionFeedback(box);

            // Submit selection
            _context2.p = 2;
            _context2.n = 3;
            return fetch('/api/select-box', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                sessionId: (_giftBoxGame$gameSess = giftBoxGame.gameSession) === null || _giftBoxGame$gameSess === void 0 ? void 0 : _giftBoxGame$gameSess.id,
                boxIndex: index
              })
            });
          case 3:
            response = _context2.v;
            if (response.ok) {
              _context2.n = 4;
              break;
            }
            throw new Error("HTTP ".concat(response.status));
          case 4:
            _context2.n = 5;
            return response.json();
          case 5:
            data = _context2.v;
            if (!data.success) {
              _context2.n = 8;
              break;
            }
            _context2.n = 6;
            return giftBoxGame.animateBoxOpening(box);
          case 6:
            _context2.n = 7;
            return giftBoxGame.showPrizeResult(data.data.prize);
          case 7:
            _context2.n = 9;
            break;
          case 8:
            giftBoxGame.showNotification(data.message || 'Lỗi khi chọn hộp', 'error');
          case 9:
            _context2.n = 11;
            break;
          case 10:
            _context2.p = 10;
            _t2 = _context2.v;
            console.error('❌ Error selecting box:', _t2);
            giftBoxGame.showNotification('Không thể xử lý lựa chọn của bạn', 'error');
          case 11:
            _context2.p = 11;
            giftBoxGame.isAnimating = false;
            return _context2.f(11);
          case 12:
            return _context2.a(2);
        }
      }, _callee2, null, [[2, 10, 11, 12]]);
    }));
    function selectBox(_x) {
      return _selectBox.apply(this, arguments);
    }
    return selectBox;
  }(),
  animateBoxOpening: function () {
    var _animateBoxOpening = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(box) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            return _context3.a(2, new Promise(function (resolve) {
              var boxElement = box.querySelector('.gift-box');
              var lid = box.querySelector('.gift-box-lid');
              var body = box.querySelector('.gift-box-body');

              // Lid animation
              lid.style.animation = 'lidFlip 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

              // Body shine
              body.style.animation = 'shine 1s ease-in-out';

              // Particles effect
              giftBoxGame.createParticles(box);

              // Sound effect
              giftBoxGame.playSound('open');
              setTimeout(resolve, 1000);
            }));
        }
      }, _callee3);
    }));
    function animateBoxOpening(_x2) {
      return _animateBoxOpening.apply(this, arguments);
    }
    return animateBoxOpening;
  }(),
  createParticles: function createParticles(box) {
    var container = box.querySelector('.gift-box-body');
    var particleCount = 20;
    var _loop2 = function _loop2() {
      var particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.innerHTML = '✨';
      var angle = i / particleCount * Math.PI * 2;
      var velocity = 3 + Math.random() * 3;
      var tx = Math.cos(angle) * 100 * velocity;
      var ty = Math.sin(angle) * 100 * velocity;
      particle.style.setProperty('--tx', "".concat(tx, "px"));
      particle.style.setProperty('--ty', "".concat(ty, "px"));
      particle.style.animation = "particle 1.2s ease-out forwards";
      container.appendChild(particle);
      setTimeout(function () {
        return particle.remove();
      }, 1200);
    };
    for (var i = 0; i < particleCount; i++) {
      _loop2();
    }
  },
  showSelectionFeedback: function showSelectionFeedback(box) {
    var feedback = document.createElement('div');
    feedback.className = 'selection-feedback';
    feedback.innerHTML = '✓ Đã chọn!';
    box.appendChild(feedback);
    setTimeout(function () {
      return feedback.remove();
    }, 500);
  },
  showPrizeResult: function () {
    var _showPrizeResult = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(prize) {
      var modal;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            modal = document.createElement('div');
            modal.className = 'prize-modal';
            modal.innerHTML = "\n      <div class=\"prize-modal-content\">\n        <div class=\"prize-celebration\">\n          <div class=\"confetti\"></div>\n          <div class=\"prize-icon\">".concat(giftBoxGame.getPrizeEmoji(prize.type), "</div>\n          <h2 class=\"prize-title\">\uD83C\uDF89 Ch\xFAc m\u1EEBng! \uD83C\uDF89</h2>\n          <p class=\"prize-description\">").concat(prize.name, "</p>\n          <p class=\"prize-value\">").concat(giftBoxGame.formatPrizeValue(prize), "</p>\n          <button class=\"btn-primary\" onclick=\"giftBoxGame.closePrizeModal()\">\n            Ti\u1EBFp t\u1EE5c\n          </button>\n        </div>\n      </div>\n    ");
            document.body.appendChild(modal);
            giftBoxGame.playSound('congratulations');
            giftBoxGame.triggerConfetti();
            setTimeout(function () {
              modal.classList.add('show');
            }, 100);
          case 1:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    function showPrizeResult(_x3) {
      return _showPrizeResult.apply(this, arguments);
    }
    return showPrizeResult;
  }(),
  closePrizeModal: function closePrizeModal() {
    var modal = document.querySelector('.prize-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(function () {
        return modal.remove();
      }, 300);
    }
  },
  getPrizeEmoji: function getPrizeEmoji(type) {
    var emojis = {
      'cash': '💰',
      'voucher': '🎟️',
      'product': '🛍️',
      'unlucky': '😅',
      'super_lucky': '🤯'
    };
    return emojis[type] || '🎁';
  },
  formatPrizeValue: function formatPrizeValue(prize) {
    if (prize.type === 'unlucky') return 'Hên xui lần này rồi!';
    if (prize.cash_amount) return "".concat(prize.cash_amount.toLocaleString('vi-VN'), " \u0111\u1ED3ng");
    return prize.name;
  },
  updateGameInfo: function updateGameInfo() {
    var sessionInfo = document.getElementById('sessionInfo');
    if (sessionInfo && giftBoxGame.gameSession) {
      sessionInfo.innerHTML = "\n        <div class=\"session-detail\">\n          <span>\uD83D\uDCC5 ".concat(new Date(giftBoxGame.gameSession.created_at).toLocaleDateString('vi-VN'), "</span>\n          <span>\uD83C\uDFAE Phi\xEAn ch\u01A1i #").concat(giftBoxGame.gameSession.id, "</span>\n        </div>\n      ");
    }
  },
  triggerConfetti: function triggerConfetti() {
    var confetti = document.querySelector('.confetti');
    if (!confetti) return;
    for (var i = 0; i < 50; i++) {
      var piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 5)];
      piece.style.animation = "confetti-fall ".concat(2 + Math.random() * 2, "s ease-in forwards");
      document.querySelector('.confetti').appendChild(piece);
    }
  },
  playSound: function playSound(type) {
    // Stub for sound playback - can be implemented with Web Audio API
    console.log("\uD83D\uDD0A Playing sound: ".concat(type));
  },
  showNotification: function showNotification(message) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
    var notification = document.createElement('div');
    notification.className = "notification notification-".concat(type);
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(function () {
      return notification.classList.add('show');
    }, 100);
    setTimeout(function () {
      notification.classList.remove('show');
      setTimeout(function () {
        return notification.remove();
      }, 300);
    }, 3000);
  },
  attachEventListeners: function attachEventListeners() {
    var _document$getElementB, _document$getElementB2;
    // Reset button
    (_document$getElementB = document.getElementById('resetGameBtn')) === null || _document$getElementB === void 0 || _document$getElementB.addEventListener('click', function () {
      if (confirm('Bạn chắc chắn muốn bắt đầu lại?')) {
        location.reload();
      }
    });

    // Info button
    (_document$getElementB2 = document.getElementById('gameInfoBtn')) === null || _document$getElementB2 === void 0 || _document$getElementB2.addEventListener('click', function () {
      giftBoxGame.showGameInfo();
    });
  },
  showGameInfo: function showGameInfo() {
    var info = "\n    <div class=\"game-info-modal\">\n      <h3>\u2139\uFE0F Th\xF4ng Tin Tr\xF2 Ch\u01A1i</h3>\n      <p>Ch\u1ECDn m\u1ED9t h\u1ED9p qu\xE0 \u0111\u1EC3 m\u1EDF v\xE0 nh\u1EADn ph\u1EA7n th\u01B0\u1EDFng!</p>\n      <ul>\n        <li>\uD83C\uDF81 M\u1ED7i h\u1ED9p c\xF3 m\u1ED9t ph\u1EA7n th\u01B0\u1EDFng ri\xEAng</li>\n        <li>\uD83D\uDCB0 Gi\u1EA3i th\u01B0\u1EDFng c\xF3 th\u1EC3 l\xE0 ti\u1EC1n m\u1EB7t ho\u1EB7c voucher</li>\n        <li>\u26A0\uFE0F C\xF3 th\u1EC3 g\u1EB7p ph\u1EA3i gi\u1EA3i \"h\xEAn xui\"</li>\n      </ul>\n      <button onclick=\"this.parentElement.remove()\" class=\"btn-primary\">\u0110\xF3ng</button>\n    </div>\n    ";
    var container = document.createElement('div');
    container.className = 'modal-overlay';
    container.innerHTML = info;
    document.body.appendChild(container);
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    return giftBoxGame.init();
  });
} else {
  giftBoxGame.init();
}