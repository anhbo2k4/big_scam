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
 * WHEEL GAME CONTROLLER
 * ================================================
 */
var WheelGame = /*#__PURE__*/function (_GameEngine) {
  function WheelGame(sessionCode, config, prizes) {
    var _this;
    _classCallCheck(this, WheelGame);
    _this = _callSuper(this, WheelGame, [sessionCode, 'wheel', config]);
    _this.prizes = prizes;
    _this.segments = config.segments || [];
    _this.isSpinning = false;
    _this.currentRotation = 0;
    _this.state = {
      spins: 0
    };
    return _this;
  }

  /**
   * Initialize wheel game UI
   */
  _inherits(WheelGame, _GameEngine);
  return _createClass(WheelGame, [{
    key: "render",
    value: function render(containerId) {
      var container = document.getElementById(containerId);
      var html = "\n      <div class=\"game-container\">\n        <div class=\"game-header\">\n          <h1>\uD83C\uDFA1 V\xF2ng Quay May M\u1EAFn</h1>\n          <p>Quay \u0111\u1EC3 nh\u1EADn th\u01B0\u1EDFng</p>\n          <div class=\"game-info\">\n            <div class=\"info-badge\">\n              \uD83D\uDCA8 <strong>T\u1ED1c \u0111\u1ED9: ".concat(this.config.speed, "</strong>\n            </div>\n            <div class=\"info-badge\">\n              \uD83C\uDFAF <strong id=\"spinCount\">0</strong> l\u1EA7n quay\n            </div>\n          </div>\n        </div>\n\n        <div class=\"wheel-container\">\n          <div class=\"wheel-pointer\"></div>\n          <div class=\"wheel-wrapper\">\n            <div class=\"wheel\" id=\"wheel\">\n              ").concat(this.renderSegments(), "\n            </div>\n            <div class=\"wheel-center\" id=\"wheelCenter\">\n              \uD83C\uDF81\n            </div>\n          </div>\n        </div>\n\n        <button class=\"spin-button\" id=\"spinBtn\" onclick=\"wheelGame.spin()\">\n          \uD83C\uDFAF QUAY NGAY\n        </button>\n      </div>\n    ");
      container.innerHTML = html;
      this.attachEventListeners();
    }

    /**
     * Render wheel segments
     */
  }, {
    key: "renderSegments",
    value: function renderSegments() {
      var _this2 = this;
      var segmentAngle = 360 / this.segments.length;
      return this.segments.map(function (segment, idx) {
        var rotation = idx * segmentAngle;
        var skewValue = 360 / _this2.segments.length - 90;
        return "\n        <div class=\"wheel-segment\" \n             style=\"\n               background: linear-gradient(135deg, ".concat(segment.color, " 0%, ").concat(_this2.lightenColor(segment.color), " 100%);\n               transform: rotate(").concat(rotation, "deg) skew(0deg, ").concat(skewValue, "deg);\n               clip-path: polygon(50% 50%, 50% 0%, 100% 0%);\n             \"\n             data-index=\"").concat(idx, "\">\n          <span style=\"\n            position: absolute;\n            left: 30%;\n            top: 50%;\n            transform: translateY(-50%) rotate(").concat(-rotation - skewValue, "deg);\n            writing-mode: horizontal-tb;\n            font-size: 0.8rem;\n            font-weight: bold;\n            color: white;\n            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);\n          \">").concat(segment.label.substring(0, 8), "</span>\n        </div>\n      ");
      }).join('');
    }

    /**
     * Lighten hex color
     */
  }, {
    key: "lightenColor",
    value: function lightenColor(color) {
      var num = parseInt(color.replace('#', ''), 16);
      var amt = 30;
      var usePound = typeof color === 'string' && color[0] === '#';
      return (usePound ? '#' : '') + (0x1000000 + Math.min(255, (num >> 16) + amt) * 0x10000 + Math.min(255, (num >> 8 & 0x00FF) + amt) * 0x100 + Math.min(255, (num & 0x0000FF) + amt)).toString(16).slice(1);
    }

    /**
     * Attach event listeners
     */
  }, {
    key: "attachEventListeners",
    value: function attachEventListeners() {
      document.getElementById('spinBtn').disabled = false;
    }

    /**
     * Spin the wheel
     */
  }, {
    key: "spin",
    value: (function () {
      var _spin = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this3 = this;
        var prizeIndex, prize, segmentAngle, targetRotation, finalRotation, wheel, startRotation, duration, startTime, _animate;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (!(this.isSpinning || !this.isPlaying)) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              this.isSpinning = true;
              document.getElementById('spinBtn').disabled = true;
              document.getElementById('spinBtn').textContent = '⏳ ĐANG QUAY...';

              // Choose random prize
              prizeIndex = Math.floor(Math.random() * this.segments.length);
              prize = this.prizes[prizeIndex]; // Calculate final rotation (3 full rotations + target position)
              segmentAngle = 360 / this.segments.length;
              targetRotation = prizeIndex * segmentAngle;
              finalRotation = 3 * 360 + (360 - targetRotation); // Animate spin
              wheel = document.getElementById('wheel');
              startRotation = this.currentRotation;
              duration = this.config.spin_time_ms || 3000;
              startTime = Date.now();
              _animate = function animate() {
                var elapsed = Date.now() - startTime;
                var progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out)
                var easeProgress = 1 - Math.pow(1 - progress, 3);
                var currentRotation = startRotation + finalRotation * easeProgress;
                wheel.style.transform = "rotate(".concat(currentRotation, "deg)");
                if (progress < 1) {
                  requestAnimationFrame(_animate);
                } else {
                  _this3.currentRotation = finalRotation % 360;
                  _this3.onSpinComplete(prizeIndex, prize);
                }
              };
              _animate();
              this.state.spins++;
              document.getElementById('spinCount').textContent = this.state.spins;
            case 2:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function spin() {
        return _spin.apply(this, arguments);
      }
      return spin;
    }()
    /**
     * Handle spin completion
     */
    )
  }, {
    key: "onSpinComplete",
    value: (function () {
      var _onSpinComplete = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(prizeIndex, prize) {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              this.isSpinning = false;
              this.playSound('win');

              // Wait before showing result
              _context2.n = 1;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 500);
              });
            case 1:
              _context2.n = 2;
              return this.endGame(prizeIndex);
            case 2:
              // Show result
              this.showResultScreen(prize);
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function onSpinComplete(_x, _x2) {
        return _onSpinComplete.apply(this, arguments);
      }
      return onSpinComplete;
    }()
    /**
     * Play sound effect
     */
    )
  }, {
    key: "playSound",
    value: function playSound(type) {
      var audioContext = new (window.AudioContext || window.webkitAudioContext)();
      var oscillator = audioContext.createOscillator();
      var gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      if (type === 'win') {
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    }

    /**
     * Show result
     */
  }, {
    key: "showResultScreen",
    value: function showResultScreen(prize) {
      var html = "\n      <div class=\"result-screen\">\n        <div class=\"result-emoji\" style=\"color: ".concat(prize.color, "\">\uD83C\uDF89</div>\n        <h2 class=\"result-title\">Ch\xFAc M\u1EEBng!</h2>\n        <p class=\"result-message\">B\u1EA1n \u0111\xE3 quay tr\xFAng gi\u1EA3i th\u01B0\u1EDFng</p>\n        \n        <div class=\"result-detail\">\n          <div style=\"font-size: 2rem; margin-bottom: 10px;\">").concat(prize.icon || '🎁', "</div>\n          <strong style=\"color: ").concat(prize.color, "; font-size: 1.3rem;\">").concat(prize.name, "</strong>\n          ").concat(prize.cash_amount ? "<p>\uD83D\uDCB0 ".concat(prize.cash_amount.toLocaleString(), "\u0111</p>") : '', "\n          <p style=\"font-size: 0.9rem; opacity: 0.8;\">Rarity: <strong>").concat(prize.rarity, "</strong></p>\n        </div>\n\n        <div class=\"result-buttons\">\n          <button class=\"btn btn-primary\" onclick=\"location.href='/thank-you'\">\n            Nh\u1EADn Th\u01B0\u1EDFng\n          </button>\n          <button class=\"btn btn-secondary\" onclick=\"wheelGame.shareResult()\">\n            Chia S\u1EBB \uD83D\uDCE4\n          </button>\n        </div>\n      </div>\n    ");
      document.querySelector('.game-container').innerHTML = html;
    }
  }]);
}(GameEngine);