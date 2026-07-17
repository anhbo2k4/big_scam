/**
 * WebSocket Handler for Real-time History Updates
 * Broadcasts game plays and redemption updates in real-time
 */

const WebSocket = require('ws');

class HistoryWebSocketHandler {
  constructor(server) {
    // Use noServer mode to avoid hijacking all upgrade requests (conflicts with Socket.IO)
    this.wss = new WebSocket.Server({ noServer: true });
    this.clients = new Map();
    this.rooms = new Map();
    this.heartbeatTimer = null;
    this.server = server;
    this.setup();
    this.setupHeartbeat();
  }

  setup() {
    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      ws.isAlive = true;

      this.clients.set(clientId, {
        ws,
        rooms: new Set(),
        userId: null,
        sessionCode: null
      });

      ws.on('message', (message) => this.handleMessage(clientId, message));
      ws.on('close', () => this.handleDisconnect(clientId));
      ws.on('error', (err) => console.error(`WebSocket error (${clientId}):`, err.message));
  ws.on('pong', () => { ws.isAlive = true; });

      // Send connection confirmation
      ws.send(JSON.stringify({
        type: 'connection',
        clientId,
        message: 'Connected to history server'
      }));
    });

  }

  setupHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          try {
            ws.terminate();
          } catch (err) {}
          return;
        }
        ws.isAlive = false;
        try {
          ws.ping();
        } catch (err) {}
      });
    }, 25000);

    if (typeof this.heartbeatTimer.unref === 'function') this.heartbeatTimer.unref();
    this.wss.on('close', () => {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    });
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  handleMessage(clientId, data) {
    try {
      const raw = Buffer.isBuffer(data) ? data.toString('utf8') : String(data || '');
      const message = JSON.parse(raw);
      const client = this.clients.get(clientId);

      if (!client) return;

      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(clientId, message);
          break;
        case 'unsubscribe':
          this.handleUnsubscribe(clientId, message);
          break;
        case 'update':
          this.handleUpdate(clientId, message);
          break;
        default:
          console.log(`Unknown message type: ${message.type}`);
      }
    } catch (err) {
      console.error('Error processing WebSocket message:', err.message);
    }
  }

  handleSubscribe(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { roomType, roomId, userId, sessionCode } = message;
    const roomKey = `${roomType}:${roomId}`;

    client.rooms.add(roomKey);
    if (userId) client.userId = userId;
    if (sessionCode) client.sessionCode = sessionCode;

    if (!this.rooms.has(roomKey)) {
      this.rooms.set(roomKey, new Set());
    }
    this.rooms.get(roomKey).add(clientId);

    console.log(`👤 Client ${clientId} subscribed to ${roomKey}`);

    client.ws.send(JSON.stringify({
      type: 'subscribed',
      roomKey,
      message: `Subscribed to ${roomKey}`
    }));
  }

  handleUnsubscribe(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { roomType, roomId } = message;
    const roomKey = `${roomType}:${roomId}`;

    client.rooms.delete(roomKey);
    const room = this.rooms.get(roomKey);
    if (room) {
      room.delete(clientId);
      if (room.size === 0) {
        this.rooms.delete(roomKey);
      }
    }

    console.log(`👤 Client ${clientId} unsubscribed from ${roomKey}`);
  }

  handleUpdate(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Relay update to relevant rooms
    const { roomType, roomId, data } = message;
    const roomKey = `${roomType}:${roomId}`;

    this.broadcastToRoom(roomKey, {
      type: 'update',
      roomKey,
      data,
      timestamp: new Date().toISOString()
    });
  }

  handleDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Unsubscribe from all rooms
    client.rooms.forEach((roomKey) => {
      const room = this.rooms.get(roomKey);
      if (room) {
        room.delete(clientId);
        if (room.size === 0) {
          this.rooms.delete(roomKey);
        }
      }
    });

    this.clients.delete(clientId);
    console.log(`🔌 WebSocket disconnected: ${clientId}`);
  }

  broadcastToRoom(roomKey, message) {
    const room = this.rooms.get(roomKey);
    if (!room || room.size === 0) return;

    const payload = JSON.stringify(message);
    room.forEach((clientId) => {
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
      }
    });
  }

  broadcastGamePlay(gamePlayData) {
    const message = {
      type: 'game_play',
      event: 'new_game_play',
      data: gamePlayData,
      timestamp: new Date().toISOString()
    };

    // Broadcast to:
    // 1. Admin room
    this.broadcastToRoom('admin:all', message);

    // 2. Session-specific room
    if (gamePlayData.session_code) {
      this.broadcastToRoom(`session:${gamePlayData.session_code}`, message);
    }

    // 3. User-specific room
    if (gamePlayData.user_id) {
      this.broadcastToRoom(`user:${gamePlayData.user_id}`, message);
    }
  }

  broadcastRedemption(redemptionData) {
    const message = {
      type: 'prize_redemption',
      event: 'new_redemption',
      data: redemptionData,
      timestamp: new Date().toISOString()
    };

    // Broadcast to:
    // 1. Admin room
    this.broadcastToRoom('admin:redemptions', message);

    // 2. Session-specific room
    if (redemptionData.session_code) {
      this.broadcastToRoom(`session:${redemptionData.session_code}`, message);
    }

    // 3. User-specific room
    if (redemptionData.user_id) {
      this.broadcastToRoom(`user:${redemptionData.user_id}`, message);
    }
  }

  broadcastRedemptionStatusUpdate(redemptionId, newStatus, details = {}) {
    const message = {
      type: 'redemption_status_update',
      event: 'status_changed',
      redemptionId,
      newStatus,
      details,
      timestamp: new Date().toISOString()
    };

    // Broadcast to admin room
    this.broadcastToRoom('admin:redemptions', message);

    // Could also broadcast to specific user room if we have that info
  }

  getStats() {
    return {
      totalClients: this.clients.size,
      totalRooms: this.rooms.size,
      roomDetails: Array.from(this.rooms.entries()).map(([key, clients]) => ({
        room: key,
        subscribedClients: clients.size
      }))
    };
  }
}

module.exports = HistoryWebSocketHandler;
