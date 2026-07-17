function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// ==================== ADMIN CHAT MODERN MODULE ====================

var adminChatModern = {
  isOpen: false,
  messages: [],
  currentUserId: null,
  isFetching: false,
  hasBoundRealtimeTriggers: false,
  sseSource: null,
  sseReconnectTimer: null,
  sseReconnectDelayMs: 1200,
  sseConnected: false,
  unreadCount: 0,
  init: function init() {
    adminChatModern.setupWidgetButton();
    adminChatModern.setupUI();
    adminChatModern.setupEventListeners();
    adminChatModern.bindRealtimeRefreshTriggers();
    adminChatModern.connectRealtime();
    adminChatModern.fetchMessages();
  },
  setupWidgetButton: function setupWidgetButton() {
    var chatWidget = document.createElement('div');
    chatWidget.id = 'chatWidgetButton';
    chatWidget.className = 'chat-widget-button';
    chatWidget.innerHTML = "\n            <button class=\"chat-widget-btn\" title=\"Open Chat\">\n                <i class=\"fas fa-comments\"></i>\n                <span class=\"chat-unread-badge\" id=\"chatUnreadBadge\" style=\"display: none;\">0</span>\n            </button>\n        ";
    document.body.appendChild(chatWidget);
    var btn = chatWidget.querySelector('.chat-widget-btn');
    btn.addEventListener('click', function () {
      adminChatModern.toggleChat();
    });
  },
  setupUI: function setupUI() {
    var chatContainer = document.createElement('div');
    chatContainer.id = 'adminChatModernContainer';
    chatContainer.className = 'chat-modern-container';
    chatContainer.innerHTML = "\n            <div class=\"chat-modern-wrapper\">\n                <div class=\"chat-modern-header\">\n                    <div class=\"chat-modern-title\">\n                        <i class=\"fas fa-comments\"></i>\n                        <span>Admin Chat</span>\n                    </div>\n                    <div class=\"chat-modern-controls\">\n                        <button class=\"chat-control-btn\" id=\"chatMinimizeBtn\" title=\"Minimize\">\n                            <i class=\"fas fa-minus\"></i>\n                        </button>\n                        <button class=\"chat-control-btn\" id=\"chatCloseBtn\" title=\"Close\">\n                            <i class=\"fas fa-times\"></i>\n                        </button>\n                    </div>\n                </div>\n                <div class=\"chat-modern-messages\" id=\"chatModernMessages\"></div>\n                <div class=\"chat-modern-input-area\">\n                    <input type=\"text\" id=\"chatModernInput\" placeholder=\"Type message...\" class=\"chat-modern-input\">\n                    <button class=\"chat-modern-send-btn\" id=\"chatModernSendBtn\">\n                        <i class=\"fas fa-paper-plane\"></i>\n                    </button>\n                </div>\n            </div>\n        ";
    document.body.appendChild(chatContainer);
  },
  setupEventListeners: function setupEventListeners() {
    var sendBtn = document.getElementById('chatModernSendBtn');
    var input = document.getElementById('chatModernInput');
    var closeBtn = document.getElementById('chatCloseBtn');
    var minimizeBtn = document.getElementById('chatMinimizeBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        return adminChatModern.sendMessage();
      });
    }
    if (input) {
      input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          adminChatModern.sendMessage();
        }
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        return adminChatModern.closeChat();
      });
    }
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', function () {
        return adminChatModern.minimizeChat();
      });
    }
  },
  toggleChat: function toggleChat() {
    adminChatModern.isOpen ? adminChatModern.closeChat() : adminChatModern.openChat();
  },
  openChat: function openChat() {
    var container = document.getElementById('adminChatModernContainer');
    if (container) {
      container.classList.add('active');
    }
    adminChatModern.isOpen = true;
    adminChatModern.unreadCount = 0;
    adminChatModern.renderUnreadBadge();
    adminChatModern.fetchMessages();
  },
  closeChat: function closeChat() {
    var container = document.getElementById('adminChatModernContainer');
    if (container) {
      container.classList.remove('active');
    }
    adminChatModern.isOpen = false;
  },
  minimizeChat: function minimizeChat() {
    var container = document.getElementById('adminChatModernContainer');
    if (container) {
      container.classList.toggle('minimized');
    }
  },
  fetchMessages: function () {
    var _fetchMessages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var response, result, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (!adminChatModern.isFetching) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            adminChatModern.isFetching = true;
            _context.p = 2;
            _context.n = 3;
            return fetch('/api/admin/chat/messages');
          case 3:
            response = _context.v;
            _context.n = 4;
            return response.json();
          case 4:
            result = _context.v;
            if (result.success && Array.isArray(result.data)) {
              adminChatModern.messages = result.data;
              adminChatModern.renderMessages();
            }
            _context.n = 6;
            break;
          case 5:
            _context.p = 5;
            _t = _context.v;
            console.error('Error fetching messages:', _t);
          case 6:
            _context.p = 6;
            adminChatModern.isFetching = false;
            return _context.f(6);
          case 7:
            return _context.a(2);
        }
      }, _callee, null, [[2, 5, 6, 7]]);
    }));
    function fetchMessages() {
      return _fetchMessages.apply(this, arguments);
    }
    return fetchMessages;
  }(),
  renderMessages: function renderMessages() {
    var messagesContainer = document.getElementById('chatModernMessages');
    if (!messagesContainer) return;
    messagesContainer.innerHTML = adminChatModern.messages.map(function (msg) {
      var isOwn = msg.sender_id === adminChatModern.currentUserId;
      var timestamp = new Date(msg.created_at).toLocaleTimeString('vi-VN');
      return "\n                <div class=\"chat-modern-message ".concat(isOwn ? 'own' : 'other', "\">\n                    <div class=\"modern-message-content\">\n                        <p class=\"modern-message-text\">").concat(adminChatModern.escapeHtml(msg.message), "</p>\n                        <span class=\"modern-message-time\">").concat(timestamp, "</span>\n                    </div>\n                </div>\n            ");
    }).join('');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },
  sendMessage: function () {
    var _sendMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var input, message, response, result, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            input = document.getElementById('chatModernInput');
            message = input.value.trim();
            if (message) {
              _context2.n = 1;
              break;
            }
            if (typeof toast !== 'undefined') {
              toast.warning('Please enter a message');
            }
            return _context2.a(2);
          case 1:
            _context2.p = 1;
            _context2.n = 2;
            return fetch('/api/admin/chat/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: message
              })
            });
          case 2:
            response = _context2.v;
            _context2.n = 3;
            return response.json();
          case 3:
            result = _context2.v;
            if (result.success) {
              input.value = '';
              adminChatModern.fetchMessages();
              window.dispatchEvent(new CustomEvent('admin:chat:messages-changed'));
            } else {
              if (typeof toast !== 'undefined') {
                toast.error(result.message || 'Failed to send message');
              }
            }
            _context2.n = 5;
            break;
          case 4:
            _context2.p = 4;
            _t2 = _context2.v;
            console.error('Error sending message:', _t2);
            if (typeof toast !== 'undefined') {
              toast.error('Connection error');
            }
          case 5:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 4]]);
    }));
    function sendMessage() {
      return _sendMessage.apply(this, arguments);
    }
    return sendMessage;
  }(),
  bindRealtimeRefreshTriggers: function bindRealtimeRefreshTriggers() {
    if (adminChatModern.hasBoundRealtimeTriggers) return;
    adminChatModern.hasBoundRealtimeTriggers = true;
    window.addEventListener('admin:chat:messages-changed', function () {
      if (!adminChatModern.isOpen) {
        adminChatModern.unreadCount += 1;
        adminChatModern.renderUnreadBadge();
      }
      if (adminChatModern.isOpen) adminChatModern.fetchMessages();
    });
    window.addEventListener('focus', function () {
      if (adminChatModern.isOpen) adminChatModern.fetchMessages();
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && adminChatModern.isOpen) adminChatModern.fetchMessages();
    });
  },
  connectRealtime: function connectRealtime() {
    if (adminChatModern.sseSource) return;
    try {
      var src = new EventSource('/api/chat/events/admin');
      adminChatModern.sseSource = src;
      src.addEventListener('open', function () {
        adminChatModern.sseConnected = true;
        adminChatModern.sseReconnectDelayMs = 1200;
      });
      var handleRealtimeChange = function handleRealtimeChange() {
        window.dispatchEvent(new CustomEvent('admin:chat:messages-changed'));
      };
      src.addEventListener('new_message', handleRealtimeChange);
      src.addEventListener('chat_message', handleRealtimeChange);
      src.addEventListener('admin_message', handleRealtimeChange);
      src.addEventListener('message_edited', handleRealtimeChange);
      src.onerror = function () {
        adminChatModern.sseConnected = false;
        adminChatModern.closeRealtime();
        adminChatModern.scheduleRealtimeReconnect();
      };
    } catch (err) {
      console.error('adminChatModern SSE init failed:', err);
      adminChatModern.scheduleRealtimeReconnect();
    }
  },
  closeRealtime: function closeRealtime() {
    if (adminChatModern.sseSource) {
      adminChatModern.sseSource.close();
      adminChatModern.sseSource = null;
    }
  },
  scheduleRealtimeReconnect: function scheduleRealtimeReconnect() {
    if (adminChatModern.sseReconnectTimer) return;
    var delay = Math.min(12000, Math.max(800, Number(adminChatModern.sseReconnectDelayMs || 1200)));
    adminChatModern.sseReconnectTimer = setTimeout(function () {
      adminChatModern.sseReconnectTimer = null;
      adminChatModern.sseReconnectDelayMs = Math.min(12000, delay * 1.8);
      adminChatModern.connectRealtime();
    }, delay);
  },
  renderUnreadBadge: function renderUnreadBadge() {
    var badge = document.getElementById('chatUnreadBadge');
    if (!badge) return;
    var count = Math.max(0, Number(adminChatModern.unreadCount || 0));
    if (count > 0) {
      badge.style.display = 'inline-flex';
      badge.textContent = count > 99 ? '99+' : String(count);
    } else {
      badge.style.display = 'none';
      badge.textContent = '0';
    }
  },
  escapeHtml: function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    adminChatModern.init();
  });
} else {
  adminChatModern.init();
}