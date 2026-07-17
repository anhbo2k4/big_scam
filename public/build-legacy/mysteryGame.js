function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
 * MYSTERY GAME CONTROLLER
 * ================================================
 * Hidden box matching game
 */
var MysteryGame = /*#__PURE__*/function (_GameEngine) {
  function MysteryGame(sessionCode, config, prizes) {
    var _this;
    _classCallCheck(this, MysteryGame);
    _this = _callSuper(this, MysteryGame, [sessionCode, 'mystery', config]);
    _this.prizes = prizes;
    _this.selected = [];
    _this.matched = 0;
    _this.clicks = 0;
    return _this;
  }
  _inherits(MysteryGame, _GameEngine);
  return _createClass(MysteryGame, [{
    key: "render",
    value: function render(containerId) {
      var html = "\n      <div class=\"game-container\">\n        <div class=\"game-header\">\n          <h2>\uD83C\uDF81 H\u1ED9p B\xED \u1EA8n</h2>\n          <p>T\xECm 3 h\u1ED9p c\xF3 c\xF9ng gi\u1EA3i th\u01B0\u1EDFng</p>\n          <div class=\"timer\" id=\"timer\">0s</div>\n        </div>\n\n        <div class=\"mystery-game\">\n          <div class=\"mystery-boxes\" id=\"mysteryBoxes\">\n            ".concat(this.prizes.map(function (prize, idx) {
        return "\n              <div class=\"mystery-box\" data-index=\"".concat(idx, "\" onclick=\"selectMysteryBox(this, ").concat(idx, ")\">\n                <div class=\"mystery-box-inner\">\n                  <div class=\"mystery-box-back\">?</div>\n                  <div class=\"mystery-box-front\" style=\"color: ").concat(prize.color || '#8b5cf6', "\">\n                    <div class=\"mystery-box-emoji\">").concat(prize.icon || '🎁', "</div>\n                    <div class=\"mystery-box-name\">").concat(prize.name, "</div>\n                  </div>\n                </div>\n              </div>\n            ");
      }).join(''), "\n          </div>\n\n          <div class=\"mystery-stats\">\n            <div class=\"stat-item\">\n              <div class=\"stat-label\">Tr\xFAng T\xECm</div>\n              <div class=\"stat-value\" id=\"matchCount\">0</div>\n            </div>\n            <div class=\"stat-item\">\n              <div class=\"stat-label\">T\u1ED5ng Ch\u1ECDn</div>\n              <div class=\"stat-value\" id=\"totalClicks\">0</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    ");
      document.getElementById(containerId).innerHTML = html;
      this.startTimer();
    }
  }, {
    key: "attachEventListeners",
    value: function attachEventListeners() {
      // Event delegation handled by onclick attributes above
    }
  }, {
    key: "selectBox",
    value: function selectBox(el, index) {
      var _this2 = this;
      if (el.classList.contains('found') || this.selected.length >= 2 || el.classList.contains('flipped')) {
        return;
      }
      el.classList.add('flipped');
      this.selected.push(index);
      this.clicks++;
      document.getElementById('totalClicks').textContent = this.clicks;
      if (this.selected.length === 2) {
        var _this$selected = _slicedToArray(this.selected, 2),
          first = _this$selected[0],
          second = _this$selected[1];
        var el1 = document.querySelector("[data-index=\"".concat(first, "\"]"));
        var el2 = document.querySelector("[data-index=\"".concat(second, "\"]"));
        var match = this.prizes[first].name === this.prizes[second].name;
        setTimeout(function () {
          if (match) {
            el1.classList.add('found');
            el2.classList.add('found');
            _this2.matched += 2;
            document.getElementById('matchCount').textContent = _this2.matched;
            if (_this2.matched === _this2.prizes.length) {
              _this2.endGame(0);
            }
          } else {
            el1.classList.remove('flipped');
            el2.classList.remove('flipped');
          }
          _this2.selected = [];
        }, 600);
      }
    }
  }, {
    key: "endGame",
    value: function endGame(prizeIndex) {
      this.state = 'completed';
      var prize = this.prizes[prizeIndex || 0];
      this.selectedPrize = prize;
      var completionTime = this.getCompletionTime();
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
            clicks: this.clicks,
            matched: this.matched
          }
        })
      }).catch(function (err) {});
      this.showResultScreen(prize);
    }
  }, {
    key: "showResultScreen",
    value: function showResultScreen(prize) {
      var resultColor = prize.color || '#8b5cf6';
      var html = "\n      <div class=\"result-screen\">\n        <div class=\"result-emoji\" style=\"color: ".concat(resultColor, "\">\uD83C\uDF89</div>\n        <h2 class=\"result-title\">Ch\xFAc M\u1EEBng!</h2>\n        <p class=\"result-message\">B\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh tr\xF2 ch\u01A1i</p>\n        \n        <div class=\"result-detail\">\n          <div style=\"font-size: 2.5rem; margin-bottom: 10px;\">").concat(prize.icon || '🎁', "</div>\n          <strong style=\"color: ").concat(resultColor, "; font-size: 1.4rem;\">").concat(prize.name, "</strong>\n          ").concat(prize.cash_amount ? "<p>\uD83D\uDCB0 ".concat(prize.cash_amount.toLocaleString(), "\u0111</p>") : '', "\n          <p style=\"font-size: 0.9rem; opacity: 0.8;\">L\u1EA7n nh\u1EA5p: <strong>").concat(this.clicks, "</strong></p>\n        </div>\n\n        <div class=\"result-buttons\">\n          <button class=\"btn btn-primary\" onclick=\"location.href='/thank-you'\">\n            \u2705 Nh\u1EADn Th\u01B0\u1EDFng\n          </button>\n          <button class=\"btn btn-secondary\" onclick=\"shareResult()\">\n            \uD83D\uDCE4 Chia S\u1EBB\n          </button>\n        </div>\n      </div>\n    ");
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
function selectMysteryBox(el, index) {
  if (window.mysteryGameInstance) {
    window.mysteryGameInstance.selectBox(el, index);
  }
}