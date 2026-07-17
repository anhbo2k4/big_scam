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
 * CARDS GAME CONTROLLER
 * ================================================
 * Memory card matching game
 */
var CardsGame = /*#__PURE__*/function (_GameEngine) {
  function CardsGame(sessionCode, config, prizes) {
    var _this;
    _classCallCheck(this, CardsGame);
    _this = _callSuper(this, CardsGame, [sessionCode, 'cards', config]);
    _this.prizes = prizes;
    _this.selected = [];
    _this.matched = 0;
    _this.moves = 0;
    return _this;
  }
  _inherits(CardsGame, _GameEngine);
  return _createClass(CardsGame, [{
    key: "render",
    value: function render(containerId) {
      var html = "\n      <div class=\"game-container\">\n        <div class=\"game-header\">\n          <h2>\uD83C\uDCCF Tr\xF2 Ch\u01A1i B\xE0i</h2>\n          <p>T\xECm c\xE1c c\u1EB7p b\xE0i gi\u1ED1ng nhau</p>\n          <div class=\"timer\" id=\"timer\">0s</div>\n        </div>\n\n        <div class=\"cards-game\">\n          <div class=\"cards-stats\">\n            <div class=\"stat-item small\">\n              <div class=\"stat-label\">N\u01B0\u1EDBc \u0110i</div>\n              <div class=\"stat-value\" id=\"movesCount\">0</div>\n            </div>\n            <div class=\"stat-item small\">\n              <div class=\"stat-label\">T\xECm Th\u1EA5y</div>\n              <div class=\"stat-value\" id=\"matchedCount\">0/".concat(this.prizes.length, "</div>\n            </div>\n          </div>\n\n          <div class=\"cards-grid\" id=\"cardsGrid\">\n            ").concat(this.prizes.map(function (prize, idx) {
        return "\n              <div class=\"card\" data-index=\"".concat(idx, "\" onclick=\"flipCard(").concat(idx, ")\">\n                <div class=\"card-inner\">\n                  <div class=\"card-back\">?</div>\n                  <div class=\"card-front\" style=\"color: ").concat(prize.color || '#8b5cf6', "\">\n                    ").concat(prize.icon || '🎁', "\n                  </div>\n                </div>\n              </div>\n            ");
      }).join(''), "\n          </div>\n        </div>\n      </div>\n    ");
      document.getElementById(containerId).innerHTML = html;
      this.startTimer();
    }
  }, {
    key: "selectCard",
    value: function selectCard(index) {
      var _this2 = this;
      var card = document.querySelector("[data-index=\"".concat(index, "\"]"));

      // Already matched or flipped
      if (card.classList.contains('matched') || card.classList.contains('flipped') || this.selected.length >= 2) {
        return;
      }
      card.classList.add('flipped');
      this.selected.push(index);
      if (this.selected.length === 2) {
        this.moves++;
        document.getElementById('movesCount').textContent = this.moves;
        var _this$selected = _slicedToArray(this.selected, 2),
          first = _this$selected[0],
          second = _this$selected[1];
        var el1 = document.querySelector("[data-index=\"".concat(first, "\"]"));
        var el2 = document.querySelector("[data-index=\"".concat(second, "\"]"));
        var match = this.prizes[first].name === this.prizes[second].name;
        setTimeout(function () {
          if (match) {
            el1.classList.add('matched');
            el2.classList.add('matched');
            _this2.matched += 2;
            var totalPairs = _this2.prizes.length;
            document.getElementById('matchedCount').textContent = "".concat(_this2.matched, "/").concat(totalPairs);

            // Play match sound
            _this2.playSound('match');
            if (_this2.matched === totalPairs) {
              setTimeout(function () {
                return _this2.endGame(0);
              }, 500);
            }
          } else {
            el1.classList.remove('flipped');
            el2.classList.remove('flipped');
            _this2.playSound('nomatch');
          }
          _this2.selected = [];
        }, 600);
      }
    }
  }, {
    key: "playSound",
    value: function playSound(type) {
      try {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        oscillator.connect(gain);
        gain.connect(audioCtx.destination);
        if (type === 'match') {
          // Success sound: ascending tones
          oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.2);
        } else {
          // Fail sound: descending tone
          oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.2);
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
      console.log("\u2705 Cards game completed in ".concat(completionTime, "s (").concat(this.moves, " moves)"));
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
            moves: this.moves,
            total_pairs: this.prizes.length
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
      var perfection = this.moves <= this.prizes.length ? '⭐ Hoàn Hảo!' : '';
      var html = "\n      <div class=\"result-screen\">\n        <div class=\"result-emoji\" style=\"color: ".concat(resultColor, "\">\uD83C\uDF89</div>\n        <h2 class=\"result-title\">Ch\xFAc M\u1EEBng!</h2>\n        <p class=\"result-message\">B\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh tr\xF2 ch\u01A1i</p>\n        \n        <div class=\"result-detail\">\n          <div style=\"font-size: 2.5rem; margin-bottom: 10px;\">").concat(prize.icon || '🎁', "</div>\n          <strong style=\"color: ").concat(resultColor, "; font-size: 1.4rem;\">").concat(prize.name, "</strong>\n          ").concat(prize.cash_amount ? "<p>\uD83D\uDCB0 ".concat(prize.cash_amount.toLocaleString(), "\u0111</p>") : '', "\n          <p style=\"font-size: 0.95rem; opacity: 0.8;\">\n            <strong>").concat(this.moves, "</strong> n\u01B0\u1EDBc \u0111i\n            ").concat(perfection ? "<span style=\"color: gold; font-weight: bold;\"> ".concat(perfection, "</span>") : '', "\n          </p>\n        </div>\n\n        <div class=\"result-buttons\">\n          <button class=\"btn btn-primary\" onclick=\"location.href='/thank-you'\">\n            \u2705 Nh\u1EADn Th\u01B0\u1EDFng\n          </button>\n          <button class=\"btn btn-secondary\" onclick=\"shareResult()\">\n            \uD83D\uDCE4 Chia S\u1EBB\n          </button>\n        </div>\n      </div>\n    ");
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
function flipCard(index) {
  if (window.cardsGameInstance) {
    window.cardsGameInstance.selectCard(index);
  }
}
console.log('✅ CardsGame class loaded');