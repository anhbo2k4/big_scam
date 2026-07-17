function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// ==================== ADMIN CHAT MODULE ====================

var adminChat = {
  messages: [],
  currentUserId: null,
  isFetching: false,
  hasBoundRealtimeTriggers: false,
  sseSource: null,
  sseReconnectTimer: null,
  sseReconnectDelayMs: 1200,
  sseConnected: false,
  init: function init() {
    adminChat.setupUI();
    adminChat.setupEventListeners();
    adminChat.bindRealtimeRefreshTriggers();
    adminChat.connectRealtime();
    adminChat.fetchMessages();
  },
  setupUI: function setupUI() {
    var chatContainer = document.getElementById('adminChatContainer');
    if (!chatContainer) return;
    chatContainer.innerHTML = "\n            <div class=\"chat-wrapper\">\n                <div class=\"chat-header\">\n                    <h3><i class=\"fas fa-comments\"></i> Admin Chat</h3>\n                    <button class=\"chat-close-btn\" id=\"chatCloseBtn\">\n                        <i class=\"fas fa-times\"></i>\n                    </button>\n                </div>\n                <div class=\"chat-messages\" id=\"chatMessages\"></div>\n                <div class=\"chat-input-area\">\n                    <input type=\"text\" id=\"chatInput\" placeholder=\"Type your message...\" class=\"chat-input\">\n                    <button class=\"chat-send-btn\" id=\"chatSendBtn\">\n                        <i class=\"fas fa-paper-plane\"></i>\n                    </button>\n                </div>\n            </div>\n        ";
  },
  setupEventListeners: function setupEventListeners() {
    var chatSendBtn = document.getElementById('chatSendBtn');
    var chatInput = document.getElementById('chatInput');
    var chatCloseBtn = document.getElementById('chatCloseBtn');
    if (chatSendBtn) {
      chatSendBtn.addEventListener('click', function () {
        return adminChat.sendMessage();
      });
    }
    if (chatInput) {
      chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          adminChat.sendMessage();
        }
      });
    }
    if (chatCloseBtn) {
      chatCloseBtn.addEventListener('click', function () {
        return adminChat.close();
      });
    }
  },
  fetchMessages: function () {
    var _fetchMessages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var response, result, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (!adminChat.isFetching) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            adminChat.isFetching = true;
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
              adminChat.messages = result.data;
              adminChat.renderMessages();
            }
            _context.n = 6;
            break;
          case 5:
            _context.p = 5;
            _t = _context.v;
            console.error('Error fetching messages:', _t);
          case 6:
            _context.p = 6;
            adminChat.isFetching = false;
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
    var messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    messagesContainer.innerHTML = adminChat.messages.map(function (msg) {
      var isOwn = msg.sender_id === adminChat.currentUserId;
      var timestamp = new Date(msg.created_at).toLocaleTimeString('vi-VN');
      return "\n                <div class=\"chat-message ".concat(isOwn ? 'own' : 'other', "\">\n                    <div class=\"message-content\">\n                        <p class=\"message-text\">").concat(adminChat.escapeHtml(msg.message), "</p>\n                        <span class=\"message-time\">").concat(timestamp, "</span>\n                    </div>\n                </div>\n            ");
    }).join('');

    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },
  sendMessage: function () {
    var _sendMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var chatInput, message, response, result, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            chatInput = document.getElementById('chatInput');
            message = chatInput.value.trim();
            if (message) {
              _context2.n = 1;
              break;
            }
            toast.warning('Please enter a message');
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
              chatInput.value = '';
              adminChat.fetchMessages();
              window.dispatchEvent(new CustomEvent('admin:chat:messages-changed'));
            } else {
              toast.error(result.message || 'Failed to send message');
            }
            _context2.n = 5;
            break;
          case 4:
            _context2.p = 4;
            _t2 = _context2.v;
            console.error('Error sending message:', _t2);
            toast.error('Connection error');
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
    if (adminChat.hasBoundRealtimeTriggers) return;
    adminChat.hasBoundRealtimeTriggers = true;
    window.addEventListener('admin:chat:messages-changed', function () {
      adminChat.fetchMessages();
    });
    window.addEventListener('focus', function () {
      adminChat.fetchMessages();
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) adminChat.fetchMessages();
    });
  },
  connectRealtime: function connectRealtime() {
    if (adminChat.sseSource) return;
    try {
      var src = new EventSource('/api/chat/events/admin');
      adminChat.sseSource = src;
      src.addEventListener('open', function () {
        adminChat.sseConnected = true;
        adminChat.sseReconnectDelayMs = 1200;
      });
      var handleRealtimeChange = function handleRealtimeChange() {
        window.dispatchEvent(new CustomEvent('admin:chat:messages-changed'));
      };
      src.addEventListener('new_message', handleRealtimeChange);
      src.addEventListener('chat_message', handleRealtimeChange);
      src.addEventListener('admin_message', handleRealtimeChange);
      src.addEventListener('message_edited', handleRealtimeChange);
      src.onerror = function () {
        adminChat.sseConnected = false;
        adminChat.closeRealtime();
        adminChat.scheduleRealtimeReconnect();
      };
    } catch (err) {
      console.error('adminChat SSE init failed:', err);
      adminChat.scheduleRealtimeReconnect();
    }
  },
  closeRealtime: function closeRealtime() {
    if (adminChat.sseSource) {
      adminChat.sseSource.close();
      adminChat.sseSource = null;
    }
  },
  scheduleRealtimeReconnect: function scheduleRealtimeReconnect() {
    if (adminChat.sseReconnectTimer) return;
    var delay = Math.min(12000, Math.max(800, Number(adminChat.sseReconnectDelayMs || 1200)));
    adminChat.sseReconnectTimer = setTimeout(function () {
      adminChat.sseReconnectTimer = null;
      adminChat.sseReconnectDelayMs = Math.min(12000, delay * 1.8);
      adminChat.connectRealtime();
    }, delay);
  },
  close: function close() {
    var chatContainer = document.getElementById('adminChatContainer');
    if (chatContainer) {
      chatContainer.style.display = 'none';
    }
  },
  open: function open() {
    var chatContainer = document.getElementById('adminChatContainer');
    if (chatContainer) {
      chatContainer.style.display = 'block';
    }
    adminChat.fetchMessages();
  },
  escapeHtml: function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Initialize admin chat when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('adminChatContainer')) {
      adminChat.init();
    }
  });
} else {
  if (document.getElementById('adminChatContainer')) {
    adminChat.init();
  }
}