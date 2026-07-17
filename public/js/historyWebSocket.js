/**
 * History WebSocket Client
 * Real-time history and activity updates
 */

class HistoryWebSocketClient {
  constructor(url = null) {
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

  getWebSocketURL() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => this.handleMessage(event.data);
        this.ws.onerror = (error) => {
          reject(error);
        };
        this.ws.onclose = () => this.handleClose();
      } catch (err) {
        reject(err);
      }
    });
  }

  handleMessage(data) {
    try {
      const message = JSON.parse(data);

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
    } catch (err) {
    }
  }

  handleClose() {
    if (this.isManualClose) {
      this.emit('closed');
      return;
    }

    // Attempt reconnection
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * this.reconnectAttempts;

      setTimeout(() => {
        this.connect()
          .catch(err => {});
      }, delay);
    } else {
      this.emit('disconnected');
    }
  }

  subscribe(roomType, roomId) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    const roomKey = `${roomType}:${roomId}`;
    this.subscriptions.add(roomKey);

    this.ws.send(JSON.stringify({
      type: 'subscribe',
      roomType,
      roomId
    }));

    return true;
  }

  subscribeToAdmin() {
    this.subscribe('admin', 'all');
    this.subscribe('admin', 'redemptions');
  }

  subscribeToSession(sessionCode) {
    this.subscribe('session', sessionCode);
  }

  subscribeToUser(userId) {
    this.subscribe('user', userId);
  }

  unsubscribe(roomType, roomId) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;

    const roomKey = `${roomType}:${roomId}`;
    this.subscriptions.delete(roomKey);

    this.ws.send(JSON.stringify({
      type: 'unsubscribe',
      roomType,
      roomId
    }));

    return true;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (err) {
      }
    });
  }

  close() {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close();
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Global instance
let historyWS = null;

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
  module.exports = { HistoryWebSocketClient, getHistoryWebSocket };
}
