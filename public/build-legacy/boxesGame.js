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
 * BOXES GAME CONTROLLER
 * ================================================
 */
var BoxesGame = /*#__PURE__*/function (_GameEngine) {
  function BoxesGame(sessionCode, config, prizes) {
    var _this;
    _classCallCheck(this, BoxesGame);
    _this = _callSuper(this, BoxesGame, [sessionCode, 'boxes', config]);
    _this.prizes = prizes;
    _this.revealed = new Set();
    _this.state = {
      revealed: []
    };
    return _this;
  }

  /**
   * Initialize boxes game UI
   */
  _inherits(BoxesGame, _GameEngine);
  return _createClass(BoxesGame, [{
    key: "render",
    value: function render(containerId) {
      var container = document.getElementById(containerId);
      var _this$config$layout = this.config.layout,
        columns = _this$config$layout.columns,
        rows = _this$config$layout.rows,
        gap = _this$config$layout.gap;
      var html = "\n      <div class=\"game-container\">\n        <div class=\"game-header\">\n          <h1>\uD83C\uDF81 Ch\u1ECDn H\u1ED9p Qu\xE0</h1>\n          <p>Ch\u1ECDn 1 h\u1ED9p \u0111\u1EC3 nh\u1EADn th\u01B0\u1EDFng</p>\n          <div class=\"game-info\">\n            <div class=\"info-badge\">\n              \uD83D\uDCE6 <strong>".concat(this.prizes.length, "</strong> h\u1ED9p\n            </div>\n            <div class=\"info-badge\">\n              \u23F1\uFE0F <strong id=\"timer\">0s</strong>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"boxes-game\">\n          <div class=\"boxes-grid\" id=\"boxesGrid\" style=\"--columns: ").concat(columns, "; --gap: ").concat(gap, "\">\n            ").concat(this.prizes.map(function (prize, idx) {
        return "\n              <div class=\"box\" \n                   data-index=\"".concat(idx, "\" \n                   data-rarity=\"").concat(prize.rarity, "\"\n                   style=\"--rarity-color: ").concat(prize.color, "\">\n                <div class=\"box-content\">\n                  <span class=\"box-number\">").concat(idx + 1, "</span>\n                  <span class=\"box-prize\">").concat(prize.name, "</span>\n                </div>\n              </div>\n            ");
      }).join(''), "\n          </div>\n        </div>\n      </div>\n    ");
      container.innerHTML = html;
      this.attachEventListeners();
      this.startTimer();
    }

    /**
     * Attach click listeners to boxes
     */
  }, {
    key: "attachEventListeners",
    value: function attachEventListeners() {
      var _this2 = this;
      var boxes = document.querySelectorAll('.box');
      boxes.forEach(function (box) {
        box.addEventListener('click', function () {
          return _this2.selectBox(parseInt(box.dataset.index));
        });
      });
    }

    /**
     * Select a box
     */
  }, {
    key: "selectBox",
    value: (function () {
      var _selectBox = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(index) {
        var box;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (!(this.revealed.has(index) || !this.isPlaying)) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              box = document.querySelector(".box[data-index=\"".concat(index, "\"]"));
              box.classList.add('selected');

              // Animate and reveal
              _context.n = 2;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 300);
              });
            case 2:
              box.classList.remove('selected');
              box.classList.add('revealed');
              this.revealed.add(index);
              this.state.revealed.push(index);

              // Play success sound
              this.playSound('select');

              // Check if this completes the game (after slight delay)
              _context.n = 3;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 500);
              });
            case 3:
              _context.n = 4;
              return this.endGame(index);
            case 4:
              // Show result screen
              this.showResultScreen(this.prizes[index]);
            case 5:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function selectBox(_x) {
        return _selectBox.apply(this, arguments);
      }
      return selectBox;
    }()
    /**
     * Play sound effect
     */
    )
  }, {
    key: "playSound",
    value: function playSound(type) {
      // Create audio context for sound effects
      var audioContext = new (window.AudioContext || window.webkitAudioContext)();
      var oscillator = audioContext.createOscillator();
      var gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      switch (type) {
        case 'select':
          oscillator.frequency.value = 800;
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'win':
          oscillator.frequency.value = 1200;
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
        case 'fail':
          oscillator.frequency.value = 300;
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
      }
    }

    /**
     * Show result screen
     */
  }, {
    key: "showResultScreen",
    value: function showResultScreen(prize) {
      var html = "\n      <div class=\"result-screen\">\n        <div class=\"result-emoji\" style=\"color: ".concat(prize.color, "\">\uD83C\uDF89</div>\n        <h2 class=\"result-title\">B\u1EA1n Th\u1EAFng!</h2>\n        <p class=\"result-message\">Ch\xFAc m\u1EEBng b\u1EA1n chi\u1EBFn th\u1EAFng!</p>\n        \n        <div class=\"result-detail\">\n          <div style=\"font-size: 2rem; margin-bottom: 10px;\">").concat(prize.icon || '🎁', "</div>\n          <strong style=\"color: ").concat(prize.color, "; font-size: 1.3rem;\">").concat(prize.name, "</strong>\n          ").concat(prize.cash_amount ? "<p>\uD83D\uDCB0 ".concat(prize.cash_amount.toLocaleString(), "\u0111</p>") : '', "\n          <p style=\"font-size: 0.9rem; opacity: 0.8;\">Rarity: <strong>").concat(prize.rarity, "</strong></p>\n        </div>\n\n        <div class=\"result-buttons\">\n          <button class=\"btn btn-primary\" onclick=\"location.href='/thank-you'\">\n            Nh\u1EADn Th\u01B0\u1EDFng\n          </button>\n          <button class=\"btn btn-secondary\" onclick=\"gameEngine.shareResult()\">\n            Chia S\u1EBB \uD83D\uDCE4\n          </button>\n        </div>\n      </div>\n    ");
      document.querySelector('.game-container').innerHTML = html;
      this.playSound('win');
    }

    /**
     * Start game timer
     */
  }, {
    key: "startTimer",
    value: function startTimer() {
      var _this3 = this;
      var timerEl = document.getElementById('timer');
      var interval = setInterval(function () {
        if (!_this3.isPlaying) {
          clearInterval(interval);
          return;
        }
        timerEl.textContent = _this3.getCompletionTime() + 's';
      }, 1000);
    }
  }]);
}(GameEngine);
console.log('✅ BoxesGame loaded');