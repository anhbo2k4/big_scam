function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
 * SCRATCH GAME CONTROLLER
 * ================================================
 * Interactive scratch card game
 */
var ScratchGame = /*#__PURE__*/function (_GameEngine) {
  function ScratchGame(sessionCode, config, prizes) {
    var _this;
    _classCallCheck(this, ScratchGame);
    _this = _callSuper(this, ScratchGame, [sessionCode, 'scratch', config]);
    _this.prizes = prizes;
    _this.canvas = null;
    _this.ctx = null;
    _this.isScratching = false;
    _this.scratchAmount = 0;
    _this.revealThreshold = config.reveal_threshold || 0.5;
    return _this;
  }
  _inherits(ScratchGame, _GameEngine);
  return _createClass(ScratchGame, [{
    key: "render",
    value: function render(containerId) {
      var html = "\n      <div class=\"game-container\">\n        <div class=\"game-header\">\n          <h2>\uD83C\uDFAB C\xE0o Qu\xE0</h2>\n          <p>C\xE0o \u0111\u1EC3 ph\xE1t hi\u1EC7n gi\u1EA3i th\u01B0\u1EDFng</p>\n          <div class=\"timer\" id=\"timer\">0s</div>\n        </div>\n\n        <div class=\"scratch-game-wrapper\">\n          <div class=\"scratch-card\">\n            <div class=\"scratch-revealed\">\n              <div class=\"prize-emoji\">".concat(this.prizes[0].icon || '🎁', "</div>\n              <div class=\"prize-name\">").concat(this.prizes[0].name, "</div>\n              <div class=\"prize-value\">\uD83D\uDCB0 ").concat((this.prizes[0].cash_amount || 0).toLocaleString(), "\u0111</div>\n            </div>\n            <canvas id=\"scratchCanvas\" class=\"scratch-canvas\" width=\"300\" height=\"350\"></canvas>\n          </div>\n        </div>\n\n        <div class=\"scratch-info\">\n          <p>C\xE0o <strong>").concat(Math.round(this.revealThreshold * 100), "%</strong> \u0111\u1EC3 ph\xE1t hi\u1EC7n</p>\n          <div class=\"scratch-progress\">\n            <div class=\"scratch-progress-bar\" id=\"progressBar\"></div>\n          </div>\n          <p id=\"progressText\">0%</p>\n        </div>\n      </div>\n    ");
      document.getElementById(containerId).innerHTML = html;

      // Setup canvas
      this.canvas = document.getElementById('scratchCanvas');
      this.ctx = this.canvas.getContext('2d');

      // Draw scratch layer (golden)
      this.ctx.fillStyle = '#d4af37';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Add text
      this.ctx.fillStyle = '#a0860f';
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('CÀO ĐỂ NHẬN', this.canvas.width / 2, this.canvas.height / 2 - 20);
      this.ctx.fillText('THƯỞNG', this.canvas.width / 2, this.canvas.height / 2 + 20);
      this.attachEventListeners();
      this.startTimer();
    }
  }, {
    key: "attachEventListeners",
    value: function attachEventListeners() {
      var _this2 = this;
      this.canvas.addEventListener('mousedown', function () {
        _this2.isScratching = true;
      });
      this.canvas.addEventListener('mouseup', function () {
        _this2.isScratching = false;
      });
      this.canvas.addEventListener('mousemove', function (e) {
        return _this2.scratch(e);
      });
      this.canvas.addEventListener('touchstart', function () {
        _this2.isScratching = true;
      });
      this.canvas.addEventListener('touchend', function () {
        _this2.isScratching = false;
      });
      this.canvas.addEventListener('touchmove', function (e) {
        return _this2.scratch(e);
      });
    }
  }, {
    key: "scratch",
    value: function scratch(event) {
      var _this3 = this;
      if (!this.isScratching) return;
      var rect = this.canvas.getBoundingClientRect();
      var x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
      var y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;

      // Clear circular area
      this.ctx.clearRect(x - 25, y - 25, 50, 50);
      this.scratchAmount += 50 * 50;

      // Update progress
      var totalArea = this.canvas.width * this.canvas.height;
      var percentage = this.scratchAmount / totalArea;
      var percent = Math.min(100, Math.round(percentage * 100));
      document.getElementById('progressBar').style.width = percent + '%';
      document.getElementById('progressText').textContent = percent + '%';

      // Check if threshold reached
      if (percentage >= this.revealThreshold) {
        this.canvas.style.pointerEvents = 'none';
        setTimeout(function () {
          return _this3.endGame(0);
        }, 300);
      }
    }
  }, {
    key: "endGame",
    value: function endGame(prizeIndex) {
      this.state = 'completed';
      var prize = this.prizes[prizeIndex || 0];
      this.selectedPrize = prize;
      var completionTime = this.getCompletionTime();

      // Save to server
      fetch("/api/game/result", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_code: this.sessionCode,
          game_type: this.gameType,
          prize_id: prize.id,
          completion_time: completionTime
        })
      }).catch(function (err) {});
      this.showResultScreen(prize);
    }
  }, {
    key: "showResultScreen",
    value: function showResultScreen(prize) {
      var resultColor = prize.color || '#8b5cf6';
      var html = "\n      <div class=\"result-screen\">\n        <div class=\"result-emoji\" style=\"color: ".concat(resultColor, "\">\uD83C\uDF89</div>\n        <h2 class=\"result-title\">Ch\xFAc M\u1EEBng!</h2>\n        <p class=\"result-message\">B\u1EA1n \u0111\xE3 th\u1EAFng gi\u1EA3i th\u01B0\u1EDFng</p>\n        \n        <div class=\"result-detail\">\n          <div style=\"font-size: 2.5rem; margin-bottom: 10px;\">").concat(prize.icon || '🎁', "</div>\n          <strong style=\"color: ").concat(resultColor, "; font-size: 1.4rem;\">").concat(prize.name, "</strong>\n          ").concat(prize.cash_amount ? "<p>\uD83D\uDCB0 ".concat(prize.cash_amount.toLocaleString(), "\u0111</p>") : '', "\n          <p style=\"font-size: 0.9rem; opacity: 0.8;\">Rarity: <strong>").concat(prize.rarity || 'common', "</strong></p>\n        </div>\n\n        <div class=\"result-buttons\">\n          <button class=\"btn btn-primary\" onclick=\"location.href='/thank-you'\">\n            \u2705 Nh\u1EADn Th\u01B0\u1EDFng\n          </button>\n          <button class=\"btn btn-secondary\" onclick=\"shareResult()\">\n            \uD83D\uDCE4 Chia S\u1EBB\n          </button>\n        </div>\n      </div>\n    ");
      document.querySelector('.game-container').innerHTML = html;
    }
  }, {
    key: "startTimer",
    value: function startTimer() {
      var _this4 = this;
      this.startTime = Date.now();
      var timerId = setInterval(function () {
        var elapsed = Math.floor((Date.now() - _this4.startTime) / 1000);
        var timerEl = document.getElementById('timer');
        if (timerEl) timerEl.textContent = elapsed + 's';else clearInterval(timerId);
      }, 1000);
    }
  }]);
}(GameEngine);