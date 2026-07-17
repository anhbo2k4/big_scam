function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * ================================================
 * GAME INITIALIZER - Bootstrap & Setup
 * ================================================
 */

var gameEngine = null;
var boxesGame = null;
var wheelGame = null;

/**
 * Initialize game from session code
 */
function initializeGame(_x) {
  return _initializeGame.apply(this, arguments);
}
/**
 * Initialize scratch game
 */
function _initializeGame() {
  _initializeGame = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(sessionCode) {
    var response, data, _data$data, game_type, box_count, config, prizes, _t, _t2;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          console.log('🎮 Initializing game:', sessionCode);

          // Fetch game configuration
          _context4.n = 1;
          return fetch("/api/games/".concat(sessionCode, "/config"));
        case 1:
          response = _context4.v;
          _context4.n = 2;
          return response.json();
        case 2:
          data = _context4.v;
          if (data.success) {
            _context4.n = 3;
            break;
          }
          showError('❌ Game session not found');
          return _context4.a(2);
        case 3:
          _data$data = data.data, game_type = _data$data.game_type, box_count = _data$data.box_count, config = _data$data.config, prizes = _data$data.prizes;
          console.log("\u2705 Game Type: ".concat(game_type, ", Boxes: ").concat(box_count));

          // Initialize appropriate game controller
          _t = game_type;
          _context4.n = _t === 'boxes' ? 4 : _t === 'wheel' ? 5 : _t === 'scratch' ? 6 : _t === 'mystery' ? 7 : _t === 'gacha' ? 8 : _t === 'dice' ? 9 : _t === 'cards' ? 10 : 11;
          break;
        case 4:
          boxesGame = new BoxesGame(sessionCode, config, prizes);
          boxesGame.render('gameContainer');
          gameEngine = boxesGame;
          return _context4.a(3, 12);
        case 5:
          wheelGame = new WheelGame(sessionCode, config, prizes);
          wheelGame.render('gameContainer');
          gameEngine = wheelGame;
          return _context4.a(3, 12);
        case 6:
          initializeScratchGame(sessionCode, config, prizes);
          return _context4.a(3, 12);
        case 7:
          initializeMysteryGame(sessionCode, config, prizes);
          return _context4.a(3, 12);
        case 8:
          initializeGachaGame(sessionCode, config, prizes);
          return _context4.a(3, 12);
        case 9:
          initializeDiceGame(sessionCode, config, prizes);
          return _context4.a(3, 12);
        case 10:
          initializeCardsGame(sessionCode, config, prizes);
          return _context4.a(3, 12);
        case 11:
          showError('❌ Unknown game type: ' + game_type);
        case 12:
          _context4.n = 14;
          break;
        case 13:
          _context4.p = 13;
          _t2 = _context4.v;
          console.error('❌ Error initializing game:', _t2);
          showError('❌ Failed to load game');
        case 14:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 13]]);
  }));
  return _initializeGame.apply(this, arguments);
}
function initializeScratchGame(sessionCode, config, prizes) {
  var html = "\n    <div class=\"game-container\">\n      <div class=\"game-header\">\n        <h1>\uD83C\uDFAB C\xE0o Qu\xE0</h1>\n        <p>C\xE0o \u0111\u1EC3 ph\xE1t hi\u1EC7n gi\u1EA3i th\u01B0\u1EDFng</p>\n      </div>\n\n      <div style=\"display: flex; justify-content: center; margin: 40px 0;\">\n        <div class=\"scratch-card\">\n          <div class=\"scratch-revealed\">\n            <div class=\"prize-emoji\">".concat(prizes[0].icon || '🎁', "</div>\n            <div class=\"prize-name\">").concat(prizes[0].name, "</div>\n            <div class=\"prize-value\">\uD83D\uDCB0 ").concat((prizes[0].cash_amount || 0).toLocaleString(), "\u0111</div>\n          </div>\n          <canvas id=\"scratchCanvas\" class=\"scratch-canvas\" style=\"width: 100%; height: 100%;\"></canvas>\n        </div>\n      </div>\n\n      <div class=\"scratch-info\">\n        <p>C\xE0o 50% \u0111\u1EC3 ph\xE1t hi\u1EC7n gi\u1EA3i th\u01B0\u1EDFng</p>\n        <div class=\"scratch-progress\">\n          <div class=\"scratch-progress-bar\" id=\"progressBar\"></div>\n        </div>\n      </div>\n    </div>\n  ");
  document.getElementById('gameContainer').innerHTML = html;

  // Initialize scratch logic
  var canvas = document.getElementById('scratchCanvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 500;

  // Draw scratch layer
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#a0860f';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CÀO ĐỂ NHẬN THƯỞNG', canvas.width / 2, canvas.height / 2);
  var scratchAmount = 0;
  var isScratching = false;
  canvas.addEventListener('mousedown', function () {
    isScratching = true;
  });
  canvas.addEventListener('mouseup', function () {
    isScratching = false;
  });
  canvas.addEventListener('mousemove', function (e) {
    if (!isScratching) return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    // Clear area
    ctx.clearRect(x - 20, y - 20, 40, 40);
    scratchAmount += 40 * 40;

    // Update progress
    var percentage = scratchAmount / (canvas.width * canvas.height) * 100;
    document.getElementById('progressBar').style.width = percentage + '%';

    // Check if 50% revealed
    if (percentage >= 50) {
      canvas.style.pointerEvents = 'none';
      setTimeout(function () {
        return completeGame(sessionCode, 0, prizes[0]);
      }, 500);
    }
  });

  // Touch support
  canvas.addEventListener('touchmove', function (e) {
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];
    var x = touch.clientX - rect.left;
    var y = touch.clientY - rect.top;
    ctx.clearRect(x - 20, y - 20, 40, 40);
    scratchAmount += 40 * 40;
    var percentage = scratchAmount / (canvas.width * canvas.height) * 100;
    document.getElementById('progressBar').style.width = percentage + '%';
    if (percentage >= 50) {
      canvas.style.pointerEvents = 'none';
      setTimeout(function () {
        return completeGame(sessionCode, 0, prizes[0]);
      }, 500);
    }
  });
}

/**
 * Initialize mystery game
 */
function initializeMysteryGame(sessionCode, config, prizes) {
  var html = "\n    <div class=\"game-container\">\n      <div class=\"game-header\">\n        <h1>\uD83C\uDF81 H\u1ED9p B\xED \u1EA8n</h1>\n        <p>T\xECm 3 h\u1ED9p c\xF3 c\xF9ng gi\u1EA3i th\u01B0\u1EDFng</p>\n      </div>\n\n      <div class=\"mystery-game\">\n        <div class=\"mystery-boxes\" id=\"mysteryBoxes\">\n          ".concat(prizes.map(function (prize, idx) {
    return "\n            <div class=\"mystery-box\" data-index=\"".concat(idx, "\" onclick=\"selectMysteryBox(").concat(idx, ")\">\n              <div class=\"mystery-box-number\">").concat(idx + 1, "</div>\n              <div class=\"mystery-box-prize\">").concat(prize.name, "</div>\n            </div>\n          ");
  }).join(''), "\n        </div>\n\n        <div class=\"mystery-stats\">\n          <div class=\"stat-item\">\n            <div class=\"stat-label\">Tr\xFAng T\xECm</div>\n            <div class=\"stat-value\" id=\"matchCount\">0</div>\n          </div>\n          <div class=\"stat-item\">\n            <div class=\"stat-label\">T\u1ED5ng Ch\u1ECDn</div>\n            <div class=\"stat-value\" id=\"totalClicks\">0</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  ");
  document.getElementById('gameContainer').innerHTML = html;
  window.mysteryState = {
    selected: [],
    matched: 0,
    clicks: 0,
    prizes: prizes
  };
  window.selectMysteryBox = function (index) {
    var state = window.mysteryState;
    var box = document.querySelector("[data-index=\"".concat(index, "\"]"));
    if (box.classList.contains('found') || state.selected.length >= 2) {
      return;
    }
    if (state.selected.includes(index)) {
      return;
    }
    state.selected.push(index);
    state.clicks++;
    box.classList.add('flipped');
    document.getElementById('totalClicks').textContent = state.clicks;
    if (state.selected.length === 2) {
      var _state$selected = _slicedToArray(state.selected, 2),
        first = _state$selected[0],
        second = _state$selected[1];
      var match = state.prizes[first].name === state.prizes[second].name;
      setTimeout(function () {
        if (match) {
          document.querySelector("[data-index=\"".concat(first, "\"]")).classList.add('found');
          document.querySelector("[data-index=\"".concat(second, "\"]")).classList.add('found');
          state.matched += 2;
          document.getElementById('matchCount').textContent = state.matched;
          if (state.matched === state.prizes.length) {
            completeGame(sessionCode, 0, state.prizes[0]);
          }
        } else {
          document.querySelector("[data-index=\"".concat(first, "\"]")).classList.remove('flipped');
          document.querySelector("[data-index=\"".concat(second, "\"]")).classList.remove('flipped');
        }
        state.selected = [];
      }, 600);
    }
  };
}

/**
 * Initialize gacha/summon game
 */
function initializeGachaGame(sessionCode, config, prizes) {
  var html = "\n    <div class=\"game-container\">\n      <div class=\"game-header\">\n        <h1>\u2728 Gacha</h1>\n        <p>Tri\u1EC7u h\u1ED3i \u0111\u1EC3 nh\u1EADn gi\u1EA3i th\u01B0\u1EDFng</p>\n      </div>\n\n      <div class=\"gacha-container\">\n        <div class=\"pull-buttons\">\n          <button class=\"pull-button\" onclick=\"gachaPull(1)\">\uD83C\uDF9F\uFE0F 1 L\u1EA7n Quay</button>\n          <button class=\"pull-button bulk\" onclick=\"gachaPull(10)\">\uD83C\uDF9F\uFE0F\u2A2F10 Quay (10% Gi\u1EA3m)</button>\n        </div>\n\n        <div class=\"pulls-result\" id=\"pullResult\"></div>\n\n        <div class=\"pity-status\">\n          <div class=\"pity-label\">Pity Counter (\u0110\u1EA3m b\u1EA3o SSR)</div>\n          <div class=\"pity-progress\">\n            <div class=\"pity-bar\" id=\"pityBar\"></div>\n          </div>\n          <div class=\"pity-count\">\n            <span id=\"pityCount\">0</span> / 50\n          </div>\n        </div>\n      </div>\n    </div>\n  ";
  document.getElementById('gameContainer').innerHTML = html;
  window.gachaState = {
    pityCount: 0,
    prizes: prizes
  };
  window.gachaPull = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(count) {
      var state, results, i, prize, pityPercentage, resultHtml;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            state = window.gachaState;
            results = [];
            for (i = 0; i < count; i++) {
              prize = state.prizes[Math.floor(Math.random() * state.prizes.length)];
              results.push(prize);
              state.pityCount++;
              if (prize.rarity === 'legendary') {
                state.pityCount = 0; // Reset on legendary
              }
            }

            // Update pity
            pityPercentage = state.pityCount / 50 * 100;
            document.getElementById('pityBar').style.width = pityPercentage + '%';
            document.getElementById('pityCount').textContent = state.pityCount;

            // Display results
            resultHtml = results.map(function (prize) {
              return "\n      <div class=\"pull-item ".concat(prize.rarity, "\">\n        <div class=\"pull-item-emoji\">").concat(prize.icon || '💎', "</div>\n        <div class=\"pull-item-name\">").concat(prize.name, "</div>\n        <div class=\"pull-item-rarity\">").concat(prize.rarity, "</div>\n      </div>\n    ");
            }).join('');
            document.getElementById('pullResult').innerHTML = resultHtml;

            // Complete game on first pull
            if (!(count >= 1)) {
              _context.n = 2;
              break;
            }
            _context.n = 1;
            return new Promise(function (r) {
              return setTimeout(r, 1000);
            });
          case 1:
            _context.n = 2;
            return completeGame(sessionCode, 0, results[0]);
          case 2:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function (_x2) {
      return _ref.apply(this, arguments);
    };
  }();
}

/**
 * Initialize dice game
 */
function initializeDiceGame(sessionCode, config, prizes) {
  var html = "\n    <div class=\"game-container\">\n      <div class=\"game-header\">\n        <h1>\uD83C\uDFB2 X\xFAc S\u1EAFc</h1>\n        <p>Tung 3 x\xFAc s\u1EAFc</p>\n      </div>\n\n      <div class=\"dice-container\">\n        <div class=\"dice-roller\">\n          <div class=\"dice\" id=\"dice1\">1</div>\n          <div class=\"dice\" id=\"dice2\">1</div>\n          <div class=\"dice\" id=\"dice3\">1</div>\n        </div>\n\n        <button class=\"roll-button\" id=\"rollBtn\" onclick=\"rollDice()\">\n          \uD83C\uDFB2 TUNG NGAY\n        </button>\n\n        <div class=\"roll-result\" id=\"rollResult\"></div>\n      </div>\n    </div>\n  ";
  document.getElementById('gameContainer').innerHTML = html;
  window.rollDice = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var _window$gachaState;
    var btn, dices, results, total;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          btn = document.getElementById('rollBtn');
          if (!btn.disabled) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2);
        case 1:
          btn.disabled = true;
          btn.textContent = '⏳ ĐANG TUNG...';
          dices = [document.getElementById('dice1'), document.getElementById('dice2'), document.getElementById('dice3')]; // Animate rolling
          dices.forEach(function (d) {
            return d.classList.add('rolling');
          });
          _context2.n = 2;
          return new Promise(function (r) {
            return setTimeout(r, 1500);
          });
        case 2:
          dices.forEach(function (d) {
            return d.classList.remove('rolling');
          });

          // Generate results
          results = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
          dices.forEach(function (d, i) {
            d.textContent = results[i];
          });
          total = results.reduce(function (a, b) {
            return a + b;
          }, 0);
          document.getElementById('rollResult').innerHTML = "\n      <strong>T\u1ED5ng: ".concat(total, "</strong> ").concat(total >= 15 ? '🎉 Bạn Thắng!' : '', "\n    ");
          _context2.n = 3;
          return new Promise(function (r) {
            return setTimeout(r, 1000);
          });
        case 3:
          _context2.n = 4;
          return completeGame(sessionCode, 0, ((_window$gachaState = window.gachaState) === null || _window$gachaState === void 0 ? void 0 : _window$gachaState.prizes[0]) || {});
        case 4:
          return _context2.a(2);
      }
    }, _callee2);
  }));
}

/**
 * Initialize cards game
 */
function initializeCardsGame(sessionCode, config, prizes) {
  var html = "\n    <div class=\"game-container\">\n      <div class=\"game-header\">\n        <h1>\uD83C\uDCCF Tr\xF2 Ch\u01A1i B\xE0i</h1>\n        <p>T\xECm c\xE1c c\u1EB7p b\xE0i gi\u1ED1ng nhau</p>\n      </div>\n\n      <div class=\"cards-game\">\n        <div class=\"cards-grid\" id=\"cardsGrid\">\n          ".concat(prizes.map(function (prize, idx) {
    return "\n            <div class=\"card\" data-index=\"".concat(idx, "\" onclick=\"flipCard(").concat(idx, ")\">\n              <div class=\"card-content\">\n                <div class=\"card-back\">?</div>\n                <div class=\"card-front\">").concat(prize.icon || '🎁', "</div>\n              </div>\n            </div>\n          ");
  }).join(''), "\n        </div>\n      </div>\n    </div>\n  ");
  document.getElementById('gameContainer').innerHTML = html;
  window.cardsState = {
    selected: [],
    matched: 0,
    prizes: prizes
  };
  window.flipCard = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(index) {
      var state, card, _state$selected2, first, second, match;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            state = window.cardsState;
            card = document.querySelector("[data-index=\"".concat(index, "\"]"));
            if (!(card.classList.contains('flipped') || state.selected.length >= 2)) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            card.classList.add('flipped');
            state.selected.push(index);
            if (!(state.selected.length === 2)) {
              _context3.n = 3;
              break;
            }
            _state$selected2 = _slicedToArray(state.selected, 2), first = _state$selected2[0], second = _state$selected2[1];
            match = state.prizes[first].name === state.prizes[second].name;
            _context3.n = 2;
            return new Promise(function (r) {
              return setTimeout(r, 600);
            });
          case 2:
            if (!match) {
              document.querySelector("[data-index=\"".concat(first, "\"]")).classList.remove('flipped');
              document.querySelector("[data-index=\"".concat(second, "\"]")).classList.remove('flipped');
            } else {
              state.matched += 2;
            }
            state.selected = [];
            if (!(state.matched === state.prizes.length)) {
              _context3.n = 3;
              break;
            }
            _context3.n = 3;
            return completeGame(sessionCode, 0, state.prizes[0]);
          case 3:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }();
}

/**
 * Complete game and show result
 */
function completeGame(_x4, _x5, _x6) {
  return _completeGame.apply(this, arguments);
}
/**
 * Show error message
 */
function _completeGame() {
  _completeGame = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(sessionCode, prizeIndex, prize) {
    var html;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          html = "\n    <div class=\"result-screen\">\n      <div class=\"result-emoji\" style=\"color: ".concat(prize.color || '#8b5cf6', "\">\uD83C\uDF89</div>\n      <h2 class=\"result-title\">Ch\xFAc M\u1EEBng!</h2>\n      <p class=\"result-message\">B\u1EA1n \u0111\xE3 th\u1EAFng gi\u1EA3i th\u01B0\u1EDFng</p>\n      \n      <div class=\"result-detail\">\n        <div style=\"font-size: 2rem; margin-bottom: 10px;\">").concat(prize.icon || '🎁', "</div>\n        <strong style=\"color: ").concat(prize.color || '#8b5cf6', "; font-size: 1.3rem;\">").concat(prize.name, "</strong>\n        ").concat(prize.cash_amount ? "<p>\uD83D\uDCB0 ".concat(prize.cash_amount.toLocaleString(), "\u0111</p>") : '', "\n        <p style=\"font-size: 0.9rem; opacity: 0.8;\">Rarity: <strong>").concat(prize.rarity || 'common', "</strong></p>\n      </div>\n\n      <div class=\"result-buttons\">\n        <button class=\"btn btn-primary\" onclick=\"location.href='/thank-you'\">\n          Nh\u1EADn Th\u01B0\u1EDFng\n        </button>\n      </div>\n    </div>\n  ");
          document.querySelector('.game-container').innerHTML = html;
        case 1:
          return _context5.a(2);
      }
    }, _callee5);
  }));
  return _completeGame.apply(this, arguments);
}
function showError(message) {
  var html = "\n    <div class=\"game-container\">\n      <div class=\"result-screen\">\n        <div class=\"result-emoji\">\u274C</div>\n        <h2 class=\"result-title\">L\u1ED7i</h2>\n        <p class=\"result-message\">".concat(message, "</p>\n        <button class=\"btn btn-primary\" onclick=\"location.href='/'\">\n          Quay L\u1EA1i\n        </button>\n      </div>\n    </div>\n  ");
  document.getElementById('gameContainer').innerHTML = html;
}
console.log('✅ Game Initializer loaded');