function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * ================================================
 * DICE GAME CONTROLLER
 * ================================================
 * 3D6 rolling and summing game
 */
var DiceGame = /*#__PURE__*/function (_GameEngine) {
  function DiceGame(sessionCode, config, prizes) {
    var _this;
    _classCallCheck(this, DiceGame);
    _this = _callSuper(this, DiceGame, [sessionCode, 'dice', config]);
    _this.prizes = prizes;
    _this.results = [0, 0, 0];
    _this.isRolling = false;
    return _this;
  }
  _inherits(DiceGame, _GameEngine);
  return _createClass(DiceGame, [{
    key: "render",
    value: function render(containerId) {
      var html = "\n      <div class=\"game-container\">\n        <div class=\"game-header\">\n          <h2>\uD83C\uDFB2 X\xFAc S\u1EAFc</h2>\n          <p>Tung 3 x\xFAc s\u1EAFc \u0111\u1EC3 nh\u1EADn gi\u1EA3i th\u01B0\u1EDFng</p>\n          <div class=\"timer\" id=\"timer\">0s</div>\n        </div>\n\n        <div class=\"dice-container\">\n          <div class=\"dice-roller\">\n            <div class=\"dice\" id=\"dice1\">1</div>\n            <div class=\"dice\" id=\"dice2\">1</div>\n            <div class=\"dice\" id=\"dice3\">1</div>\n          </div>\n\n          <button class=\"roll-button\" id=\"rollBtn\" onclick=\"rollDice()\">\n            \uD83C\uDFB2 TUNG NGAY\n          </button>\n\n          <div class=\"roll-result\" id=\"rollResult\"></div>\n\n          <div class=\"roll-stats\">\n            <p id=\"rollSum\"></p>\n            <p id=\"rollMessage\"></p>\n          </div>\n        </div>\n      </div>\n    ";
      document.getElementById(containerId).innerHTML = html;
      this.startTimer();
    }
  }, {
    key: "roll",
    value: function () {
      var _roll = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this2 = this;
        var btn, dices, rollInterval, total, isWin, message;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              btn = document.getElementById('rollBtn');
              if (!(this.isRolling || btn.disabled)) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              this.isRolling = true;
              btn.disabled = true;
              btn.textContent = '⏳ ĐANG TUNG...';
              dices = [document.getElementById('dice1'), document.getElementById('dice2'), document.getElementById('dice3')]; // Animate rolling for 1.5 seconds
              dices.forEach(function (d) {
                return d.classList.add('rolling');
              });
              rollInterval = setInterval(function () {
                dices.forEach(function (d) {
                  d.textContent = Math.floor(Math.random() * 6) + 1;
                });
              }, 50);
              _context.n = 2;
              return new Promise(function (r) {
                return setTimeout(r, 1500);
              });
            case 2:
              clearInterval(rollInterval);

              // Set final results
              this.results = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
              dices.forEach(function (d, i) {
                d.textContent = _this2.results[i];
                d.classList.remove('rolling');
              });
              total = this.results.reduce(function (a, b) {
                return a + b;
              }, 0);
              isWin = total >= 15;
              message = isWin ? '🎉 Bạn Thắng Rồi!' : '✨ Hãy Thử Lại Lần Sau';
              document.getElementById('rollSum').innerHTML = "<strong>T\u1ED5ng: ".concat(total, "</strong>");
              document.getElementById('rollMessage').textContent = message;
              this.playSound(isWin ? 'win' : 'lose');
              _context.n = 3;
              return new Promise(function (r) {
                return setTimeout(r, 1000);
              });
            case 3:
              this.endGame(0);
            case 4:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function roll() {
        return _roll.apply(this, arguments);
      }
      return roll;
    }()
  }, {
    key: "playSound",
    value: function playSound(type) {
      try {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        oscillator.connect(gain);
        gain.connect(audioCtx.destination);
        if (type === 'win') {
          oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.3);

          // Play second tone
          var osc2 = audioCtx.createOscillator();
          var gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.frequency.value = 800;
          gain2.gain.setValueAtTime(0.2, audioCtx.currentTime + 0.2);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
          osc2.start(audioCtx.currentTime + 0.2);
          osc2.stop(audioCtx.currentTime + 0.5);
        } else {
          oscillator.frequency.value = 300;
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.5);
        }
      } catch (err) {
        console.warn('Audio not available:', err);
      }
    }
  }, {
    key: "endGame",
    value: function endGame(prizeIndex) {
      this.state = 'completed';
      var prize = this.prizes[prizeIndex || 0];
      this.selectedPrize = prize;
      var completionTime = this.getCompletionTime();
      var total = this.results.reduce(function (a, b) {
        return a + b;
      }, 0);
      console.log("\u2705 Dice game completed in ".concat(completionTime, "s (Total: ").concat(total, ")"));
      fetch("/api/game/result", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_code: this.sessionCode,
          game_type: this.gameType,
          prize_id: prize.id,
          completion_time: completionTime,
          extra_data: {
            dice_total: total,
            dice_values: this.results
          }
        })
      }).catch(function (err) {
        return console.error(err);
      });
      this.showResultScreen(prize);
    }
  }, {
    key: "showResultScreen",
    value: function showResultScreen(prize) {
      var resultColor = prize.color || '#8b5cf6';
      var total = this.results.reduce(function (a, b) {
        return a + b;
      }, 0);
      var html = "\n      <div class=\"result-screen\">\n        <div class=\"result-emoji\" style=\"color: ".concat(resultColor, "\">\uD83C\uDF89</div>\n        <h2 class=\"result-title\">K\u1EBFt Qu\u1EA3</h2>\n        <p class=\"result-message\">B\u1EA1n \u0111\xE3 tung \u0111\u01B0\u1EE3c</p>\n        \n        <div class=\"result-detail\">\n          <div style=\"font-size: 1.5rem; margin-bottom: 10px; letter-spacing: 10px;\">\n            ").concat(this.results[0], " \uD83C\uDFB2 ").concat(this.results[1], " \uD83C\uDFB2 ").concat(this.results[2], "\n          </div>\n          <strong style=\"color: ").concat(resultColor, "; font-size: 1.5rem;\">T\u1ED5ng: ").concat(total, "</strong>\n          <div style=\"font-size: 2.5rem; margin: 20px 0;\">").concat(prize.icon || '🎁', "</div>\n          <strong style=\"color: ").concat(resultColor, "; font-size: 1.4rem;\">").concat(prize.name, "</strong>\n          ").concat(prize.cash_amount ? "<p>\uD83D\uDCB0 ".concat(prize.cash_amount.toLocaleString(), "\u0111</p>") : '', "\n        </div>\n\n        <div class=\"result-buttons\">\n          <button class=\"btn btn-primary\" onclick=\"location.href='/thank-you'\">\n            \u2705 Nh\u1EADn Th\u01B0\u1EDFng\n          </button>\n          <button class=\"btn btn-secondary\" onclick=\"shareResult()\">\n            \uD83D\uDCE4 Chia S\u1EBB\n          </button>\n        </div>\n      </div>\n    ");
      document.querySelector('.game-container').innerHTML = html;
    }
  }, {
    key: "startTimer",
    value: function startTimer() {
      var _this3 = this;
      this.startTime = Date.now();
      var timerId = setInterval(function () {
        var elapsed = Math.floor((Date.now() - _this3.startTime) / 1000);
        var timerEl = document.getElementById('timer');
        if (timerEl) timerEl.textContent = elapsed + 's';else clearInterval(timerId);
      }, 1000);
    }
  }]);
}(GameEngine); // Global function for onclick binding
function rollDice() {
  if (window.diceGameInstance) {
    window.diceGameInstance.roll();
  }
}
console.log('✅ DiceGame class loaded');