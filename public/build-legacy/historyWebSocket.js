function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * History WebSocket Client
 * Real-time history and activity updates
 */
var HistoryWebSocketClient = /*#__PURE__*/function () {
  function HistoryWebSocketClient() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    _classCallCheck(this, HistoryWebSocketClient);
    this.url = url || this.getWebSocketURL();
    this.ws = null;
    this.clientId = null;
    this.listeners = new Map();
    this.subscriptions = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 3000;
    this.isManualClose = false;
  }
  return _createClass(HistoryWebSocketClient, [{
    key: "getWebSocketURL",
    value: function getWebSocketURL() {
      var protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return "".concat(protocol, "//").concat(window.location.host);
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this = this;
      return new Promise(function (resolve, reject) {
        try {
          _this.ws = new WebSocket(_this.url);
          _this.ws.onopen = function () {
            _this.reconnectAttempts = 0;
            resolve();
          };
          _this.ws.onmessage = function (event) {
            return _this.handleMessage(event.data);
          };
          _this.ws.onerror = function (error) {
            reject(error);
          };
          _this.ws.onclose = function () {
            return _this.handleClose();
          };
        } catch (err) {
          reject(err);
        }
      });
    }
  }, {
    key: "handleMessage",
    value: function handleMessage(data) {
      try {
        var message = JSON.parse(data);

        // Handle connection confirmation
        if (message.type === 'connection') {
          this.clientId = message.clientId;
          this.emit('connected', message);
          return;
        }

        // Handle subscription confirmation
        if (message.type === 'subscribed') {
          this.emit('subscribed', message);
          return;
        }

        // Handle updates
        if (message.type === 'game_play') {
          this.emit('game_play', message.data);
          this.emit('update', message);
          return;
        }
        if (message.type === 'prize_redemption') {
          this.emit('prize_redemption', message.data);
          this.emit('update', message);
          return;
        }
        if (message.type === 'redemption_status_update') {
          this.emit('status_update', message);
          this.emit('update', message);
          return;
        }
        if (message.type === 'update') {
          this.emit('update', message);
          return;
        }

        // Fallback
        this.emit('message', message);
      } catch (err) {}
    }
  }, {
    key: "handleClose",
    value: function handleClose() {
      var _this2 = this;
      if (this.isManualClose) {
        this.emit('closed');
        return;
      }

      // Attempt reconnection
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        var delay = this.reconnectDelay * this.reconnectAttempts;
        setTimeout(function () {
          _this2.connect().catch(function (err) {});
        }, delay);
      } else {
        this.emit('disconnected');
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(roomType, roomId) {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return false;
      }
      var roomKey = "".concat(roomType, ":").concat(roomId);
      this.subscriptions.add(roomKey);
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        roomType: roomType,
        roomId: roomId
      }));
      return true;
    }
  }, {
    key: "subscribeToAdmin",
    value: function subscribeToAdmin() {
      this.subscribe('admin', 'all');
      this.subscribe('admin', 'redemptions');
    }
  }, {
    key: "subscribeToSession",
    value: function subscribeToSession(sessionCode) {
      this.subscribe('session', sessionCode);
    }
  }, {
    key: "subscribeToUser",
    value: function subscribeToUser(userId) {
      this.subscribe('user', userId);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(roomType, roomId) {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
      var roomKey = "".concat(roomType, ":").concat(roomId);
      this.subscriptions.delete(roomKey);
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        roomType: roomType,
        roomId: roomId
      }));
      return true;
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      if (!this.listeners.has(event)) return;
      var callbacks = this.listeners.get(event);
      var index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }, {
    key: "emit",
    value: function emit(event, data) {
      if (!this.listeners.has(event)) return;
      this.listeners.get(event).forEach(function (callback) {
        try {
          callback(data);
        } catch (err) {}
      });
    }
  }, {
    key: "close",
    value: function close() {
      this.isManualClose = true;
      if (this.ws) {
        this.ws.close();
      }
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
  }]);
}(); // Global instance
var historyWS = null;
function getHistoryWebSocket() {
  if (!historyWS) {
    historyWS = new HistoryWebSocketClient();
  }
  return historyWS;
}

// Auto-connect when page loads
// ❌ DISABLED: WebSocket disabled due to hosting compatibility
/*
document.addEventListener('DOMContentLoaded', () => {
  getHistoryWebSocket().connect().catch(err => {
  });
});
*/

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HistoryWebSocketClient: HistoryWebSocketClient,
    getHistoryWebSocket: getHistoryWebSocket
  };
}