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
 * GACHA GAME CONTROLLER
 * ================================================
 * Rarity-based summon/pull game with pity system
 */
var GachaGame = /*#__PURE__*/function (_GameEngine) {
  function GachaGame(sessionCode, config, prizes) {
    var _this;
    _classCallCheck(this, GachaGame);
    _this = _callSuper(this, GachaGame, [sessionCode, 'gacha', config]);
    _this.prizes = prizes;
    _this.pityCount = config.pity_count || 0;
    _this.pityThreshold = config.pity_threshold || 50;
    _this.pulls = [];
    _this.totalPulls = 0;
    return _this;
  }
  _inherits(GachaGame, _GameEngine);
  return _createClass(GachaGame, [{
    key: "render",
    value: function render(containerId) {
      var html = "\n      <div class=\"game-container\">\n        <div class=\"game-header\">\n          <h2>\u2728 Gacha - Tri\u1EC7u H\u1ED3i</h2>\n          <p>L\u1EA5y gi\u1EA3i th\u01B0\u1EDFng b\xED m\u1EADt m\u1ED7i l\u1EA7n tri\u1EC7u h\u1ED3i</p>\n          <div class=\"timer\" id=\"timer\">0s</div>\n        </div>\n\n        <div class=\"gacha-container\">\n          <div class=\"pull-buttons\">\n            <button class=\"pull-button\" id=\"pullBtn1\" onclick=\"gachaPull(1)\">\n              \uD83C\uDF9F\uFE0F 1 L\u1EA7n Quay\n            </button>\n            <button class=\"pull-button bulk\" id=\"pullBtn10\" onclick=\"gachaPull(10)\">\n              \uD83C\uDF9F\uFE0F\u2A2F10 Quay (10% Gi\u1EA3m)\n            </button>\n          </div>\n\n          <div class=\"pulls-result\" id=\"pullResult\"></div>\n\n          <div class=\"pity-status\">\n            <div class=\"pity-label\">Pity Counter (\u0110\u1EA3m b\u1EA3o SSR/Legendary)</div>\n            <div class=\"pity-progress\">\n              <div class=\"pity-bar\" id=\"pityBar\" style=\"width: ".concat(this.pityCount / this.pityThreshold * 100, "%\"></div>\n            </div>\n            <div class=\"pity-count\">\n              <span id=\"pityCount\">").concat(this.pityCount, "</span> / ").concat(this.pityThreshold, "\n            </div>\n          </div>\n\n          <div class=\"gacha-stats\">\n            <p>T\u1ED5ng Quay: <strong id=\"totalPullsCount\">0</strong></p>\n          </div>\n        </div>\n      </div>\n    ");
      document.getElementById(containerId).innerHTML = html;
      this.startTimer();
    }
  }, {
    key: "getRandomPrize",
    value: function getRandomPrize() {
      // Simple rarity-based probability
      var rand = Math.random();
      var rarityFilter;

      // Weighted probability
      if (rand < 0.7) {
        rarityFilter = function rarityFilter(prize) {
          return prize.rarity === 'common' || prize.rarity === 'uncommon';
        };
      } else if (rand < 0.95) {
        rarityFilter = function rarityFilter(prize) {
          return prize.rarity === 'rare' || prize.rarity === 'epic';
        };
      } else {
        rarityFilter = function rarityFilter(prize) {
          return prize.rarity === 'legendary' || prize.rarity === 'mythic';
        };
      }
      var filtered = this.prizes.filter(rarityFilter);
      return filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : this.prizes[Math.floor(Math.random() * this.prizes.length)];
    }
  }, {
    key: "playSound",
    value: function playSound(rarity) {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var oscillator = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);

      // Frequency based on rarity
      var frequencies = {
        'common': 440,
        'uncommon': 550,
        'rare': 660,
        'epic': 770,
        'legendary': 1000,
        'mythic': 1200
      };
      oscillator.frequency.value = frequencies[rarity] || 440;
      oscillator.type = 'sine';
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    }
  }, {
    key: "pull",
    value: function () {
      var _pull = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(count) {
        var btn1, btn10, results, i, prize, pityPercentage, resultHtml;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              btn1 = document.getElementById('pullBtn1');
              btn10 = document.getElementById('pullBtn10');
              btn1.disabled = true;
              btn10.disabled = true;
              results = [];
              i = 0;
            case 1:
              if (!(i < count)) {
                _context.n = 3;
                break;
              }
              prize = this.getRandomPrize();
              results.push(prize);
              this.pulls.push(prize);
              this.totalPulls++;
              this.pityCount++;

              // Reset pity on legendary
              if (prize.rarity === 'legendary' || prize.rarity === 'mythic') {
                this.pityCount = 0;
              }

              // Force legendary after pity threshold
              if (this.pityCount >= this.pityThreshold) {
                results[results.length - 1] = this.prizes.find(function (p) {
                  return p.rarity === 'legendary';
                }) || prize;
                this.pityCount = 0;
              }
              this.playSound(prize.rarity);
              _context.n = 2;
              return new Promise(function (r) {
                return setTimeout(r, 300);
              });
            case 2:
              i++;
              _context.n = 1;
              break;
            case 3:
              // Update UI
              pityPercentage = this.pityCount / this.pityThreshold * 100;
              document.getElementById('pityBar').style.width = pityPercentage + '%';
              document.getElementById('pityCount').textContent = this.pityCount;
              document.getElementById('totalPullsCount').textContent = this.totalPulls;

              // Display results
              resultHtml = results.map(function (prize, idx) {
                return "\n      <div class=\"pull-item ".concat(prize.rarity, "\" style=\"animation-delay: ").concat(idx * 100, "ms\">\n        <div class=\"pull-item-emoji\">").concat(prize.icon || '💎', "</div>\n        <div class=\"pull-item-name\">").concat(prize.name, "</div>\n        <div class=\"pull-item-rarity\">").concat(prize.rarity, "</div>\n        ").concat(prize.cash_amount ? "<div class=\"pull-item-value\">\uD83D\uDCB0 ".concat(prize.cash_amount.toLocaleString(), "\u0111</div>") : '', "\n      </div>\n    ");
              }).join('');
              document.getElementById('pullResult').innerHTML = resultHtml;

              // Complete game on any pull
              _context.n = 4;
              return new Promise(function (r) {
                return setTimeout(r, 1500);
              });
            case 4:
              this.endGame(this.prizes.indexOf(results[0]));
              btn1.disabled = false;
              btn10.disabled = false;
            case 5:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function pull(_x) {
        return _pull.apply(this, arguments);
      }
      return pull;
    }()
  }, {
    key: "endGame",
    value: function endGame(prizeIndex) {
      this.state = 'completed';
      var prize = this.prizes[prizeIndex || 0];
      this.selectedPrize = prize;
      var completionTime = this.getCompletionTime();
      console.log("\u2705 Gacha game completed in ".concat(completionTime, "s (").concat(this.totalPulls, " pulls)"));
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
            total_pulls: this.totalPulls,
            pity_resets: 0
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
      var html = "\n      <div class=\"result-screen\">\n        <div class=\"result-emoji\" style=\"color: ".concat(resultColor, "\">\u2728</div>\n        <h2 class=\"result-title\">Tri\u1EC7u H\u1ED3i Th\xE0nh C\xF4ng!</h2>\n        <p class=\"result-message\">B\u1EA1n \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c</p>\n        \n        <div class=\"result-detail\">\n          <div style=\"font-size: 2.5rem; margin-bottom: 10px;\">").concat(prize.icon || '✨', "</div>\n          <strong style=\"color: ").concat(resultColor, "; font-size: 1.4rem;\">").concat(prize.name, "</strong>\n          <p style=\"color: ").concat(resultColor, "; text-transform: uppercase; font-weight: bold; margin: 5px 0;\">").concat(prize.rarity, "</p>\n          ").concat(prize.cash_amount ? "<p>\uD83D\uDCB0 ".concat(prize.cash_amount.toLocaleString(), "\u0111</p>") : '', "\n          <p style=\"font-size: 0.9rem; opacity: 0.8;\">T\u1ED5ng Quay: <strong>").concat(this.totalPulls, "</strong></p>\n        </div>\n\n        <div class=\"result-buttons\">\n          <button class=\"btn btn-primary\" onclick=\"location.href='/thank-you'\">\n            \u2705 Nh\u1EADn Th\u01B0\u1EDFng\n          </button>\n          <button class=\"btn btn-secondary\" onclick=\"shareResult()\">\n            \uD83D\uDCE4 Chia S\u1EBB\n          </button>\n        </div>\n      </div>\n    ");
      document.querySelector('.game-container').innerHTML = html;
    }
  }, {
    key: "startTimer",
    value: function startTimer() {
      var _this2 = this;
      this.startTime = Date.now();
      var timerId = setInterval(function () {
        var elapsed = Math.floor((Date.now() - _this2.startTime) / 1000);
        var timerEl = document.getElementById('timer');
        if (timerEl) timerEl.textContent = elapsed + 's';else clearInterval(timerId);
      }, 1000);
    }
  }]);
}(GameEngine); // Global function for onclick binding
function gachaPull(count) {
  if (window.gachaGameInstance) {
    window.gachaGameInstance.pull(count);
  }
}
console.log('✅ GachaGame class loaded');