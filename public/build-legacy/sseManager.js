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
/**
 * sseManager.js — Resilient SSE connection manager.
 *
 * Usage:
 *   const mgr = new SSEManager('/api/chat/events/admin', {
 *     new_message:   (data) => { ... },
 *     admin_event:   (data) => { ... },
 *   });
 *   mgr.connect();
 *
 * Features:
 *  - Exponential backoff on error (1s → 2s → 4s → … → 30s max)
 *  - Last-Event-ID header forwarded on reconnect
 *  - Tab hidden > 5 min → disconnect to save resources
 *  - Tab visible again → reconnect if disconnected
 *
 * Exported as window.SSEManager (constructor).
 */
(function () {
  'use strict';

  var SSEManager = /*#__PURE__*/function () {
    /**
     * @param {string} url       SSE endpoint URL
     * @param {object} handlers  { eventName: (data) => {} }
     * @param {object} [opts]
     * @param {boolean} [opts.withCredentials=true]
     * @param {number}  [opts.hiddenThreshold=300000]  ms tab must be hidden before auto-disconnect
     */
    function SSEManager(url, handlers, opts) {
      _classCallCheck(this, SSEManager);
      this.url = url;
      this.handlers = handlers || {};
      this.opts = Object.assign({
        withCredentials: true,
        hiddenThreshold: 300000
      }, opts);
      this._es = null;
      this._attempt = 0;
      this._reconnectTimer = null;
      this._lastEventId = null;
      this._hiddenAt = null;
      this._hiddenTimer = null;
      this._destroyed = false;

      // Visibility / focus management
      this._onVisibility = this._onVisibility.bind(this);
      this._onFocus = this._onFocus.bind(this);
      document.addEventListener('visibilitychange', this._onVisibility);
      window.addEventListener('focus', this._onFocus);
    }

    // ─── Public API ──────────────────────────────────────────────────────────────
    return _createClass(SSEManager, [{
      key: "connect",
      value: function connect() {
        if (this._destroyed || this._es) return;
        if (window.LMB_DISABLE_SSE) return;
        this._createSource();
      }
    }, {
      key: "disconnect",
      value: function disconnect() {
        this._clearTimers();
        if (this._es) {
          this._es.close();
          this._es = null;
        }
      }

      /** Permanently tear down — removes all global listeners */
    }, {
      key: "destroy",
      value: function destroy() {
        this._destroyed = true;
        this.disconnect();
        document.removeEventListener('visibilitychange', this._onVisibility);
        window.removeEventListener('focus', this._onFocus);
      }
    }, {
      key: "isConnected",
      get: function get() {
        return !!(this._es && this._es.readyState === EventSource.OPEN);
      }

      // ─── Internal ────────────────────────────────────────────────────────────────
    }, {
      key: "_buildUrl",
      value: function _buildUrl() {
        var u = new URL(this.url, window.location.href);
        if (this._lastEventId) u.searchParams.set('lastEventId', this._lastEventId);
        return u.toString();
      }
    }, {
      key: "_createSource",
      value: function _createSource() {
        var _this = this;
        if (this._destroyed) return;
        try {
          var es = new EventSource(this._buildUrl(), {
            withCredentials: this.opts.withCredentials
          });
          this._es = es;
          es.addEventListener('open', function () {
            _this._attempt = 0;
            if (typeof _this.onOpen === 'function') _this.onOpen();
          });
          es.onerror = function () {
            if (_this._destroyed) return;
            // Let the browser close and reopen if it wants (readyState → CONNECTING)
            // but we schedule our own reconnect if it transitions to CLOSED
            setTimeout(function () {
              if (!_this._destroyed && _this._es && _this._es.readyState === EventSource.CLOSED) {
                _this._es = null;
                _this._scheduleReconnect();
              }
            }, 200);
          };

          // Register all event handlers
          Object.entries(this.handlers).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              event = _ref2[0],
              fn = _ref2[1];
            es.addEventListener(event, function (e) {
              if (e.lastEventId) _this._lastEventId = e.lastEventId;
              try {
                fn(JSON.parse(e.data), e);
              } catch (_) {}
            });
          });

          // Keep track of last event ID from any event
          es.addEventListener('message', function (e) {
            if (e.lastEventId) _this._lastEventId = e.lastEventId;
          });
        } catch (err) {
          this._scheduleReconnect();
        }
      }
    }, {
      key: "_scheduleReconnect",
      value: function _scheduleReconnect() {
        var _this2 = this;
        if (this._destroyed || this._reconnectTimer) return;
        // Exponential backoff: 1s, 2s, 4s, 8s … capped at 30s
        var delay = Math.min(1000 * Math.pow(2, this._attempt), 30000);
        this._attempt++;
        this._reconnectTimer = setTimeout(function () {
          _this2._reconnectTimer = null;
          if (!_this2._destroyed && !_this2._es) {
            _this2._createSource();
          }
        }, delay);
      }
    }, {
      key: "_clearTimers",
      value: function _clearTimers() {
        clearTimeout(this._reconnectTimer);
        clearTimeout(this._hiddenTimer);
        this._reconnectTimer = null;
        this._hiddenTimer = null;
      }

      // ─── Visibility management ────────────────────────────────────────────────────
    }, {
      key: "_onVisibility",
      value: function _onVisibility() {
        var _this3 = this;
        if (document.visibilityState === 'hidden') {
          this._hiddenAt = Date.now();
          // disconnect after threshold to save server resources
          this._hiddenTimer = setTimeout(function () {
            if (document.visibilityState === 'hidden') {
              _this3.disconnect();
            }
          }, this.opts.hiddenThreshold);
        } else {
          clearTimeout(this._hiddenTimer);
          this._hiddenTimer = null;
          this._hiddenAt = null;
          // Reconnect if we were disconnected while hidden
          if (!this._destroyed && !this._es) {
            this._attempt = 0; // reset backoff on intentional reconnect
            this._createSource();
          }
        }
      }
    }, {
      key: "_onFocus",
      value: function _onFocus() {
        if (!this._destroyed && !this._es) {
          this._attempt = 0;
          this._createSource();
        }
      }
    }]);
  }();
  window.SSEManager = SSEManager;
})();