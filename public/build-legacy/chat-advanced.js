function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Prevent redeclaration of variables
if (typeof chatMessages === 'undefined') {
  var chatMessages = [];
}
if (typeof isTyping === 'undefined') {
  var isTyping = false;
}
var currentChatSession = null;
var currentChatCode = null;
var autoReplyTimer = null;
var chatEventSource = null; // kept for legacy reference
var _chatTransport = null; // ChatTransport layered fallback instance
var typingTimer = null;
var _typingDebounceTimer = null;
var isPlayerTyping = false;
var chatUiSettingsLoaded = false;
var DEFAULT_CHAT_AGENT_NAME = 'CSKH Lâm TaoBao';
var CHAT_GLOBAL_SESSION_KEY = 'lmbv2:chat:sessionCode';
var CHAT_INITIAL_MESSAGES_LIMIT = 40;
var chatRenderQueue = [];
var chatRenderRaf = 0;
var chatMarkSeenTimer = null;
var chatSendBusy = false;
var chatUiSettings = {
  adminName: DEFAULT_CHAT_AGENT_NAME,
  adminAvatar: '/images/support-avatar.png',
  headerTitle: '',
  headerSubtitle: '',
  placeholder: 'Nhập tin nhắn...',
  position: 'right',
  bubbleColor: '#6366f1',
  textColor: '#ffffff',
  bubbleIcon: '💬',
  headerBgColor: '',
  headerTextColor: ''
};
function normalizeHexColor(hex) {
  var raw = String(hex || '').trim();
  if (!raw) return '';
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw;
  if (/^#[0-9a-f]{3}$/i.test(raw)) {
    return '#' + raw.slice(1).split('').map(function (ch) {
      return ch + ch;
    }).join('');
  }
  return '';
}
function toRgba(hex, alpha) {
  var v = normalizeHexColor(hex);
  if (!v) return '';
  var r = parseInt(v.slice(1, 3), 16);
  var g = parseInt(v.slice(3, 5), 16);
  var b = parseInt(v.slice(5, 7), 16);
  return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(alpha, ")");
}
function applyChatCustomizationToUI() {
  var titleEl = document.getElementById('chatHeaderTitleText') || document.querySelector('.chat-title');
  var subtitleEl = document.getElementById('chatHeaderSubtitleText') || document.querySelector('#chatOnlineStatus .status-text');
  var avatarEl = document.getElementById('chatHeaderAvatar') || document.querySelector('.chat-avatar img');
  var bubbleIconEl = document.querySelector('.chat-icon-inner');
  var inputEl = document.getElementById('chatInput');
  var floatIcon = document.getElementById('chatFloatIcon');
  var chatBox = document.getElementById('chatBox');
  var chatHeader = document.querySelector('.chat-header');
  var sendButton = document.getElementById('sendButton');
  var displayTitle = chatUiSettings.headerTitle || chatUiSettings.adminName || DEFAULT_CHAT_AGENT_NAME;
  if (titleEl) titleEl.textContent = displayTitle;
  if (subtitleEl && chatUiSettings.headerSubtitle) {
    subtitleEl.textContent = chatUiSettings.headerSubtitle;
  }
  if (avatarEl && chatUiSettings.adminAvatar) {
    avatarEl.src = chatUiSettings.adminAvatar;
  }
  if (bubbleIconEl && chatUiSettings.bubbleIcon) {
    bubbleIconEl.textContent = chatUiSettings.bubbleIcon;
  }
  if (inputEl && chatUiSettings.placeholder) {
    inputEl.placeholder = chatUiSettings.placeholder;
  }
  var textColor = normalizeHexColor(chatUiSettings.textColor || '') || '#ffffff';
  if (chatBox) {
    chatBox.style.setProperty('--chat-text-color', textColor);
  }
  var bubbleColor = normalizeHexColor(chatUiSettings.bubbleColor || '') || '#6366f1';
  if (floatIcon) {
    floatIcon.style.background = "linear-gradient(135deg, ".concat(bubbleColor, " 0%, ").concat(toRgba(bubbleColor, 0.86), " 100%)");
    floatIcon.style.boxShadow = "0 12px 35px ".concat(toRgba(bubbleColor, 0.45), ", 0 0 0 0 ").concat(toRgba(bubbleColor, 0.38));
  }
  if (sendButton) {
    sendButton.style.background = "linear-gradient(135deg, ".concat(bubbleColor, " 0%, ").concat(toRgba(bubbleColor, 0.88), " 100%)");
  }
  var headerBg = normalizeHexColor(chatUiSettings.headerBgColor || '');
  if (chatHeader && headerBg) {
    chatHeader.style.background = "linear-gradient(135deg, ".concat(headerBg, " 0%, ").concat(toRgba(headerBg, 0.88), " 100%)");
  }
  if (chatHeader && chatUiSettings.headerTextColor) {
    chatHeader.style.color = chatUiSettings.headerTextColor;
  }
  if (floatIcon && chatBox) {
    var isLeft = String(chatUiSettings.position || 'right').toLowerCase() === 'left';
    if (isLeft) {
      floatIcon.style.left = '30px';
      floatIcon.style.right = 'auto';
      chatBox.style.left = '30px';
      chatBox.style.right = 'auto';
    } else {
      floatIcon.style.right = '30px';
      floatIcon.style.left = 'auto';
      chatBox.style.right = '30px';
      chatBox.style.left = 'auto';
    }
  }
  syncSendButtonState();
}
function loadChatCustomizationSettings() {
  return _loadChatCustomizationSettings.apply(this, arguments);
}
function _loadChatCustomizationSettings() {
  _loadChatCustomizationSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var force,
      _result$data,
      response,
      result,
      chat,
      _args = arguments,
      _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          force = _args.length > 0 && _args[0] !== undefined ? _args[0] : false;
          if (!(chatUiSettingsLoaded && !force)) {
            _context.n = 1;
            break;
          }
          applyChatCustomizationToUI();
          return _context.a(2);
        case 1:
          _context.p = 1;
          _context.n = 2;
          return fetch('/api/settings');
        case 2:
          response = _context.v;
          _context.n = 3;
          return response.json();
        case 3:
          result = _context.v;
          chat = result !== null && result !== void 0 && result.success ? ((_result$data = result.data) === null || _result$data === void 0 ? void 0 : _result$data.chat) || {} : {};
          chatUiSettings = {
            adminName: DEFAULT_CHAT_AGENT_NAME,
            adminAvatar: chat.adminAvatar || '/images/support-avatar.png',
            headerTitle: chat.headerTitle || '',
            headerSubtitle: chat.headerSubtitle || '',
            placeholder: chat.placeholder || 'Nhập tin nhắn...',
            position: chat.position || 'right',
            bubbleColor: chat.bubbleColor || '#6366f1',
            textColor: chat.textColor || '#ffffff',
            bubbleIcon: chat.bubbleIcon || '💬',
            headerBgColor: chat.headerBgColor || '',
            headerTextColor: chat.headerTextColor || ''
          };
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          console.warn('⚠️ Cannot load chat customization settings:', _t);
        case 5:
          _context.p = 5;
          chatUiSettingsLoaded = true;
          applyChatCustomizationToUI();
          return _context.f(5);
        case 6:
          return _context.a(2);
      }
    }, _callee, null, [[1, 4, 5, 6]]);
  }));
  return _loadChatCustomizationSettings.apply(this, arguments);
}
function initializeChat() {
  return _initializeChat.apply(this, arguments);
} // ─── SSE Connection ────────────────────────────────────────────────────────────
// ── Handlers forwarded from ChatTransport events ──────────────────────────────
function _initializeChat() {
  _initializeChat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var sessionCode,
      params,
      _args2 = arguments,
      _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          sessionCode = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : null;
          _context2.p = 1;
          _context2.n = 2;
          return loadChatCustomizationSettings();
        case 2:
          if (!sessionCode) {
            params = new URLSearchParams(window.location.search);
            sessionCode = params.get('code') || null;
          }
          if (sessionCode) {
            _context2.n = 4;
            break;
          }
          _context2.n = 3;
          return startNewChatSession();
        case 3:
          _context2.n = 5;
          break;
        case 4:
          _context2.n = 5;
          return loadChatSession(sessionCode);
        case 5:
          _context2.n = 6;
          return loadChatMessages();
        case 6:
          // Connect SSE stream for realtime updates (no polling needed)
          connectChatSSE();
          console.log('✅ Chat initialized successfully');
          _context2.n = 8;
          break;
        case 7:
          _context2.p = 7;
          _t2 = _context2.v;
          console.error('❌ Error initializing chat:', _t2);
        case 8:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 7]]);
  }));
  return _initializeChat.apply(this, arguments);
}
function _handleIncomingMessage(msg) {
  if (!msg) return;
  hideTypingIndicator();
  addMessageToUI(msg);
  chatMessages.push(msg);
  var chatBox = document.getElementById('chatBox');
  if (!chatBox || !chatBox.classList.contains('active')) {
    if (window.notifyNewMessage) {
      window.notifyNewMessage.fromChat(msg);
    } else {
      if (window.notificationSound) {
        notificationSound.playSound('message');
      } else {
        playNotificationSound();
      }
      if (window.tabNotification) tabNotification.incrementBadge('Tin nhắn mới');
    }
    incrementUnreadBadge();
  }
  scheduleMarkSeen();
}
function setSending(busy) {
  chatSendBusy = !!busy;
  syncSendButtonState();
}
function syncSendButtonState() {
  var input = document.getElementById('chatInput');
  var btn = document.getElementById('sendButton');
  if (!btn) return;
  var hasMessage = !!String((input === null || input === void 0 ? void 0 : input.value) || '').trim();
  var enabled = hasMessage && !chatSendBusy;
  var color = normalizeHexColor(chatUiSettings.bubbleColor || '') || '#6366f1';
  btn.disabled = !enabled;
  btn.style.opacity = chatSendBusy ? '0.5' : '';
  btn.setAttribute('aria-disabled', enabled ? 'false' : 'true');
  btn.setAttribute('aria-busy', chatSendBusy ? 'true' : 'false');
  btn.style.background = enabled ? "linear-gradient(135deg, ".concat(color, " 0%, ").concat(toRgba(color, 0.88), " 100%)") : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
}
function bindChatInputStateGuards() {
  var input = document.getElementById('chatInput');
  if (!input || input.dataset.sendStateBound === '1') return;
  ['input', 'change', 'keyup', 'paste', 'cut', 'focus', 'blur', 'compositionend'].forEach(function (eventName) {
    input.addEventListener(eventName, syncSendButtonState, {
      passive: true
    });
  });
  input.dataset.sendStateBound = '1';
  syncSendButtonState();
}
function connectChatSSE() {
  if (!currentChatCode) return;
  var chatBox = document.getElementById('chatBox');
  if (!chatBox || !chatBox.classList.contains('active')) return;
  if (_chatTransport) return; // already connected

  _chatTransport = new ChatTransport({
    sessionId: currentChatCode,
    onMessage: _handleIncomingMessage,
    onSendLock: setSending,
    onStatusChange: function onStatusChange(info) {
      // layer 1 = Stream (silent), 2 = SSE (yellow bar), 3 = Polling (red bar)
      // _updateBadge is called internally by ChatTransport; nothing extra needed here.
    }
  });
  _chatTransport.start();

  // Re-wire secondary SSE events dispatched by ChatTransport as DOM events
  document.addEventListener('chatTransport:typing', _onTransportTyping);
  document.addEventListener('chatTransport:stop_typing', _onTransportStopTyping);
  document.addEventListener('chatTransport:online_status', _onTransportOnlineStatus);
  document.addEventListener('chatTransport:message_status', _onTransportMessageStatus);
}
function disconnectChatSSE() {
  if (_chatTransport) {
    _chatTransport.stop();
    _chatTransport = null;
  }
  document.removeEventListener('chatTransport:typing', _onTransportTyping);
  document.removeEventListener('chatTransport:stop_typing', _onTransportStopTyping);
  document.removeEventListener('chatTransport:online_status', _onTransportOnlineStatus);
  document.removeEventListener('chatTransport:message_status', _onTransportMessageStatus);
  // Legacy cleanup
  if (chatEventSource) {
    chatEventSource.close();
    chatEventSource = null;
  }
}
function _onTransportTyping(e) {
  try {
    if (e.detail && e.detail.role === 'admin') showTypingIndicator("".concat(DEFAULT_CHAT_AGENT_NAME, " \u0111ang nh\u1EADp..."));
  } catch (_) {}
}
function _onTransportStopTyping(e) {
  try {
    if (e.detail && e.detail.role === 'admin') hideTypingIndicator();
  } catch (_) {}
}
function _onTransportOnlineStatus(e) {
  try {
    if (e.detail && e.detail.role === 'admin') updateAdminOnlineStatus(e.detail.online, e.detail.ts);
  } catch (_) {}
}
function _onTransportMessageStatus(e) {
  try {
    if (e.detail) updateMessageStatus(e.detail.messageId, e.detail.status);
  } catch (_) {}
}
function scheduleMarkSeen() {
  if (!currentChatCode) return;
  clearTimeout(chatMarkSeenTimer);
  chatMarkSeenTimer = setTimeout(function () {
    fetch("/api/chat/mark-seen/".concat(currentChatCode), {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).catch(function () {});
  }, 700);
}
function playNotificationSound() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (_) {}
}
function incrementUnreadBadge() {
  var badge = document.getElementById('notificationBadge');
  if (!badge) return;
  var current = parseInt(badge.textContent || '0', 10);
  badge.textContent = current + 1;
  badge.classList.add('has-unread');
}

// ─── Typing via fetch POST ────────────────────────────────────────────────────

function emitTyping() {
  if (!currentChatCode) return;
  if (!isPlayerTyping) {
    isPlayerTyping = true;
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        session_code: currentChatCode,
        role: 'player',
        typing: true
      })
    }).catch(function () {});
  }
  clearTimeout(typingTimer);
  typingTimer = setTimeout(function () {
    isPlayerTyping = false;
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        session_code: currentChatCode,
        role: 'player',
        typing: false
      })
    }).catch(function () {});
  }, 2000);
}
function stopPlayerTyping() {
  if (!currentChatCode) return;
  isPlayerTyping = false;
  clearTimeout(typingTimer);
  fetch('/api/chat/typing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
      session_code: currentChatCode,
      role: 'player',
      typing: false
    })
  }).catch(function () {});
}
var _adminOfflineLastSeen = null;
var _adminOfflineTimer = null;
function updateAdminOnlineStatus(online, ts) {
  clearInterval(_adminOfflineTimer);
  _adminOfflineTimer = null;
  var statusDot = document.querySelector('.chat-header .status-dot');
  var statusText = document.querySelector('.chat-header .status-text');
  var avatarStatus = document.getElementById('chatAvatarStatus') || document.querySelector('.chat-header .avatar-status');
  if (statusDot) statusDot.style.background = online ? '#22c55e' : '#9ca3af';
  if (avatarStatus) {
    avatarStatus.style.background = online ? '#22c55e' : '#6b7280';
    avatarStatus.classList.toggle('offline', !online);
  }
  if (online) {
    _adminOfflineLastSeen = null;
    if (statusText) statusText.textContent = 'Đang hoạt động';
  } else {
    var refreshOfflineText = function refreshOfflineText() {
      if (!statusText) return;
      statusText.textContent = _adminOfflineLastSeen ? 'Offline · ' + formatLastSeen(_adminOfflineLastSeen) : 'Ngoại tuyến';
    };
    _adminOfflineLastSeen = ts || null;
    refreshOfflineText();
    _adminOfflineTimer = setInterval(refreshOfflineText, 30000);
  }
}
function formatLastSeen(ts) {
  if (!ts) return '';
  var diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return diff + ' giây trước';
  if (diff < 3600) return Math.floor(diff / 60) + ' phút trước';
  if (diff < 86400) return Math.floor(diff / 3600) + ' giờ trước';
  return Math.floor(diff / 86400) + ' ngày trước';
}

/** Update a sent-message status badge in the UI */
function updateMessageStatus(messageId, status) {
  var statusMap = {
    sent: '✓ Đã gửi',
    delivered: '✓✓ Đã nhận',
    seen: '✓✓ Đã xem'
  };
  var label = statusMap[status];
  if (!label) return;
  if (messageId) {
    // Update specific message by ID
    var el = document.querySelector(".message[data-id=\"".concat(messageId, "\"] .message-status"));
    if (el) {
      el.textContent = label;
      if (status === 'seen') el.style.color = '#6366f1';
      if (status === 'delivered') el.style.color = '#10b981';
    }
  } else if (status === 'seen') {
    // No specific ID — mark ALL sent (customer) messages as seen
    document.querySelectorAll('.message.sent .message-status').forEach(function (el) {
      el.textContent = label;
      el.style.color = '#6366f1';
    });
  }
}
function showServerNotification(message, type) {
  if (!message) return;
  var colors = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };
  var icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  var color = colors[type] || colors.info;
  var icon = icons[type] || icons.info;
  var toast = document.createElement('div');
  toast.className = 'server-toast-notification';
  toast.style.cssText = 'position:fixed;bottom:90px;right:20px;background:#fff;padding:14px 20px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.18);z-index:99998;display:flex;align-items:center;gap:10px;font-family:Poppins,sans-serif;max-width:340px;animation:slideInRight .3s ease-out;border-left:4px solid ' + color + ';';
  toast.innerHTML = '<span style="font-size:18px;">' + icon + '</span><span style="color:#333;font-weight:500;font-size:13px;">' + (message || '').replace(/</g, '&lt;') + '</span>';
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.style.animation = 'slideOutRight .3s ease-in forwards';
    setTimeout(function () {
      return toast.remove();
    }, 350);
  }, 5000);
}
function startNewChatSession() {
  return _startNewChatSession.apply(this, arguments);
}
function _startNewChatSession() {
  _startNewChatSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var _document$getElementB, _document$getElementB2, _document$getElementB3, existing, storedCode, _existing, sessionCodeFromUi, customerName, customerPhoneRaw, customerPhone, response, result, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          if (!currentChatCode) {
            _context3.n = 2;
            break;
          }
          _context3.n = 1;
          return loadChatSession(currentChatCode);
        case 1:
          existing = _context3.v;
          if (!existing) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2, existing);
        case 2:
          storedCode = String(localStorage.getItem(CHAT_GLOBAL_SESSION_KEY) || '').trim().toUpperCase();
          if (!storedCode) {
            _context3.n = 4;
            break;
          }
          _context3.n = 3;
          return loadChatSession(storedCode);
        case 3:
          _existing = _context3.v;
          if (!_existing) {
            _context3.n = 4;
            break;
          }
          return _context3.a(2, _existing);
        case 4:
          sessionCodeFromUi = String(((_document$getElementB = document.getElementById('chatGameSessionCode')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || '').trim().toUpperCase();
          customerName = String(((_document$getElementB2 = document.getElementById('chatCustomerName')) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.value) || 'Khách hàng').trim() || 'Khách hàng';
          customerPhoneRaw = String(((_document$getElementB3 = document.getElementById('chatCustomerPhone')) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.value) || '').trim();
          customerPhone = customerPhoneRaw.replace(/\D/g, '') || '0000000000';
          if (sessionCodeFromUi) {
            _context3.n = 5;
            break;
          }
          showServerNotification('Vui lòng nhập mã phiên chơi.', 'warning');
          return _context3.a(2, null);
        case 5:
          _context3.n = 6;
          return fetch('/api/chat/start', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              customer_name: customerName,
              customer_phone: customerPhone,
              game_session_code: sessionCodeFromUi,
              topic: "H\u1ED7 tr\u1EE3 phi\xEAn ".concat(sessionCodeFromUi)
            })
          });
        case 6:
          response = _context3.v;
          _context3.n = 7;
          return response.json();
        case 7:
          result = _context3.v;
          if (!result.success) {
            _context3.n = 8;
            break;
          }
          currentChatSession = result.data;
          currentChatCode = result.data.session_code;
          localStorage.setItem(CHAT_GLOBAL_SESSION_KEY, currentChatCode);
          console.log('✅ New chat session created:', currentChatCode);
          return _context3.a(2, result.data);
        case 8:
          if (!(result.code === 'IP_RATE_LIMITED')) {
            _context3.n = 11;
            break;
          }
          showServerNotification(result.message || 'Vui lòng đợi trước khi mở phiên chat mới.', 'warning');
          if (!result.existing_session_code) {
            _context3.n = 10;
            break;
          }
          _context3.n = 9;
          return loadChatSession(result.existing_session_code);
        case 9:
          return _context3.a(2, _context3.v);
        case 10:
          _context3.n = 12;
          break;
        case 11:
          showServerNotification(result.message || 'Không thể tạo phiên chat mới.', 'error');
        case 12:
          _context3.n = 14;
          break;
        case 13:
          _context3.p = 13;
          _t3 = _context3.v;
          console.error('❌ Error starting chat session:', _t3);
        case 14:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 13]]);
  }));
  return _startNewChatSession.apply(this, arguments);
}
function loadChatSession(_x) {
  return _loadChatSession.apply(this, arguments);
}
function _loadChatSession() {
  _loadChatSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(sessionCode) {
    var response, result, _result$data$session$, _result$data$session, unread, badge, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _context4.n = 1;
          return fetch("/api/chat/session/".concat(sessionCode));
        case 1:
          response = _context4.v;
          _context4.n = 2;
          return response.json();
        case 2:
          result = _context4.v;
          if (!result.success) {
            _context4.n = 3;
            break;
          }
          currentChatSession = result.data.session;
          currentChatCode = sessionCode;
          localStorage.setItem(CHAT_GLOBAL_SESSION_KEY, currentChatCode);
          unread = (_result$data$session$ = (_result$data$session = result.data.session) === null || _result$data$session === void 0 ? void 0 : _result$data$session.unread_count) !== null && _result$data$session$ !== void 0 ? _result$data$session$ : 0;
          if (unread > 0) {
            badge = document.getElementById('notificationBadge');
            if (badge) {
              badge.textContent = unread > 99 ? '99+' : String(unread);
              badge.classList.add('has-unread');
            }
          }
          console.log('✅ Chat session loaded:', sessionCode);
          return _context4.a(2, result.data.session);
        case 3:
          _context4.n = 5;
          break;
        case 4:
          _context4.p = 4;
          _t4 = _context4.v;
          console.error('❌ Error loading chat session:', _t4);
        case 5:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 4]]);
  }));
  return _loadChatSession.apply(this, arguments);
}
function closeChatSession() {
  return _closeChatSession.apply(this, arguments);
}
function _closeChatSession() {
  _closeChatSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var satisfaction,
      feedback,
      response,
      result,
      _args5 = arguments,
      _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          satisfaction = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : null;
          feedback = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : null;
          _context5.p = 1;
          if (currentChatCode) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2);
        case 2:
          _context5.n = 3;
          return fetch("/api/chat/close/".concat(currentChatCode), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              satisfaction: satisfaction,
              feedback: feedback
            })
          });
        case 3:
          response = _context5.v;
          _context5.n = 4;
          return response.json();
        case 4:
          result = _context5.v;
          if (!result.success) {
            _context5.n = 5;
            break;
          }
          console.log('✅ Chat session closed');
          if (currentChatSession) currentChatSession.status = 'closed';
          showNotification('💬', 'Cảm ơn đã liên hệ chúng tôi!', '#10b981');
          return _context5.a(2, true);
        case 5:
          _context5.n = 7;
          break;
        case 6:
          _context5.p = 6;
          _t5 = _context5.v;
          console.error('❌ Error closing chat session:', _t5);
        case 7:
          return _context5.a(2);
      }
    }, _callee5, null, [[1, 6]]);
  }));
  return _closeChatSession.apply(this, arguments);
}
function loadChatMessages() {
  return _loadChatMessages.apply(this, arguments);
}
function _loadChatMessages() {
  _loadChatMessages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var chatBox, response, result, messagesContainer, _pump, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          if (currentChatCode) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2);
        case 1:
          chatBox = document.getElementById('chatBox');
          if (!(!chatBox || !chatBox.classList.contains('active'))) {
            _context6.n = 2;
            break;
          }
          return _context6.a(2);
        case 2:
          _context6.n = 3;
          return fetch("/api/chat/messages/".concat(currentChatCode, "?limit=").concat(CHAT_INITIAL_MESSAGES_LIMIT));
        case 3:
          response = _context6.v;
          _context6.n = 4;
          return response.json();
        case 4:
          result = _context6.v;
          if (!(result.success && result.data)) {
            _context6.n = 6;
            break;
          }
          messagesContainer = document.getElementById('chatMessages');
          if (messagesContainer) {
            _context6.n = 5;
            break;
          }
          return _context6.a(2);
        case 5:
          messagesContainer.innerHTML = '';
          chatMessages = Array.isArray(result.data) ? result.data : [];

          // Progressive append prevents blocking the main thread on large histories.
          if (chatRenderRaf) {
            cancelAnimationFrame(chatRenderRaf);
            chatRenderRaf = 0;
          }
          chatRenderQueue = chatMessages.slice();
          _pump = function pump() {
            var chunk = chatRenderQueue.splice(0, 18);
            chunk.forEach(function (msg) {
              return addMessageToUI(msg, {
                skipScroll: true
              });
            });
            if (chatRenderQueue.length > 0) {
              chatRenderRaf = requestAnimationFrame(_pump);
            } else {
              chatRenderRaf = 0;
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          };
          chatRenderRaf = requestAnimationFrame(_pump);
        case 6:
          _context6.n = 8;
          break;
        case 7:
          _context6.p = 7;
          _t6 = _context6.v;
          console.error('❌ Error loading chat messages:', _t6);
        case 8:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 7]]);
  }));
  return _loadChatMessages.apply(this, arguments);
}
function sendMessage() {
  return _sendMessage.apply(this, arguments);
}
function _sendMessage() {
  _sendMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var input, message, response, result, _t7;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          input = document.getElementById('chatInput');
          if (input) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2);
        case 1:
          if (!chatSendBusy) {
            _context7.n = 2;
            break;
          }
          return _context7.a(2);
        case 2:
          message = input.value.trim();
          if (!(message === '')) {
            _context7.n = 3;
            break;
          }
          return _context7.a(2);
        case 3:
          if (currentChatCode) {
            _context7.n = 5;
            break;
          }
          _context7.n = 4;
          return startNewChatSession();
        case 4:
          connectChatSSE();
        case 5:
          // Stop typing immediately once the message is sent.
          stopPlayerTyping();
          setSending(true);
          _context7.p = 6;
          _context7.n = 7;
          return fetch('/api/chat/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              session_code: currentChatCode,
              sender_name: 'Khách hàng',
              sender_type: 'customer',
              message: message,
              message_type: 'text'
            })
          });
        case 7:
          response = _context7.v;
          _context7.n = 8;
          return response.json();
        case 8:
          result = _context7.v;
          if (result.success) {
            addMessageToUI(result.data);
            chatMessages.push(result.data);
            input.value = '';
            input.focus();
            syncSendButtonState();
          } else {
            showNotification('❌', result.message || 'Lỗi gửi tin nhắn', '#ef4444');
          }
          _context7.n = 10;
          break;
        case 9:
          _context7.p = 9;
          _t7 = _context7.v;
          console.error('❌ Error sending message:', _t7);
          showNotification('❌', 'Lỗi gửi tin nhắn', '#ef4444');
        case 10:
          _context7.p = 10;
          setSending(false);
          return _context7.f(10);
        case 11:
          return _context7.a(2);
      }
    }, _callee7, null, [[6, 9, 10, 11]]);
  }));
  return _sendMessage.apply(this, arguments);
}
function addMessageToUI(messageData) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;
  var shouldStickBottom = messagesContainer.scrollHeight - (messagesContainer.scrollTop + messagesContainer.clientHeight) <= 120;
  var forceScroll = !!options.forceScroll;
  var skipScroll = !!options.skipScroll;
  var messageDiv = document.createElement('div');
  var isSent = messageData.sender_type === 'customer';
  messageDiv.className = "message ".concat(isSent ? 'sent' : 'received');
  if (messageData.id) messageDiv.setAttribute('data-id', messageData.id);
  var time = formatTime(messageData.created_at);
  var messageType = String(messageData.message_type || 'text');
  var attachmentUrl = messageData.attachment_url || '';
  var attachmentType = String(messageData.attachment_type || messageType || '').toLowerCase();
  var attachmentHtml = renderAttachmentHtml(attachmentUrl, attachmentType, messageData.message || 'Tệp đính kèm');

  // Media-only: when message is purely an image, skip the bubble wrapper
  var isMediaOnly = messageType === 'image' && !!attachmentUrl;
  var bubbleCls = isMediaOnly ? 'message-bubble media-only' : 'message-bubble';
  // Customer messages → plain escape; Support/admin messages → allow rich HTML from Tiptap
  var bubbleText = isMediaOnly ? '' : isSent ? escapeHtml(messageData.message || '') : sanitizeMessageHtml(messageData.message || '');
  if (isSent) {
    var statusLabel = messageData.is_read ? '✓✓ Đã xem' : '✓ Đã gửi';
    var statusColor = messageData.is_read ? 'color:#6366f1' : '';
    messageDiv.innerHTML = "\n            <div class=\"message-content\">\n                <div class=\"message-name\">B\u1EA1n</div>\n                <div class=\"".concat(bubbleCls, "\">").concat(bubbleText).concat(attachmentHtml, "</div>\n                <div class=\"message-time\">").concat(time, "<span class=\"message-status\" style=\"").concat(statusColor, "\">").concat(statusLabel, "</span></div>\n            </div>\n        ");
  } else {
    var _currentChatSession;
    var avatar = ((_currentChatSession = currentChatSession) === null || _currentChatSession === void 0 ? void 0 : _currentChatSession.support_agent_avatar) || chatUiSettings.adminAvatar || '/images/support-avatar.png';
    // Always use configured admin name — never show raw DB sender_name (prevents "AD" etc.)
    var senderName = DEFAULT_CHAT_AGENT_NAME;
    messageDiv.innerHTML = "\n            <div class=\"message-avatar\"><img src=\"".concat(avatar, "\" alt=\"").concat(senderName, "\" onerror=\"this.src='https://ui-avatars.com/api/?name=TV&background=6366f1&color=fff&size=40'\"></div>\n            <div class=\"message-content\">\n                <div class=\"message-name\">").concat(escapeHtml(senderName), "</div>\n                <div class=\"").concat(bubbleCls, "\">").concat(bubbleText).concat(attachmentHtml, "</div>\n                <div class=\"message-time\">").concat(time, "<span class=\"message-status\">\u2713 \u0110\xE3 xem</span></div>\n            </div>\n        ");
  }
  messagesContainer.appendChild(messageDiv);
  if (!skipScroll && (forceScroll || shouldStickBottom)) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}
function addBotResponse(_x2) {
  return _addBotResponse.apply(this, arguments);
}
function _addBotResponse() {
  _addBotResponse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(userMessage) {
    var responses, randomResponse, response, result, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          responses = getSmartResponse(userMessage);
          randomResponse = responses[Math.floor(Math.random() * responses.length)];
          _context8.n = 1;
          return fetch('/api/chat/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              session_code: currentChatCode,
              sender_name: DEFAULT_CHAT_AGENT_NAME,
              sender_type: 'support',
              message: randomResponse,
              message_type: 'text'
            })
          });
        case 1:
          response = _context8.v;
          _context8.n = 2;
          return response.json();
        case 2:
          result = _context8.v;
          if (result.success) {
            addMessageToUI(result.data);
          }
          _context8.n = 4;
          break;
        case 3:
          _context8.p = 3;
          _t8 = _context8.v;
          console.error('❌ Error sending bot response:', _t8);
        case 4:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 3]]);
  }));
  return _addBotResponse.apply(this, arguments);
}
function getSmartResponse(message) {
  var msg = (message || '').toLowerCase();
  if (msg.match(/^(xin chào|chào|hello|hi|hey)/i)) {
    return ['Xin chào! Rất vui được hỗ trợ bạn hôm nay. Bạn cần giúp đỡ gì nhé? 😊', 'Chào bạn! Tôi có thể giúp gì cho bạn? ✨', 'Hi! Chào mừng bạn đến với dịch vụ hỗ trợ của chúng tôi! 👋'];
  }
  if (msg.match(/(giúp|hỗ trợ|support|help|bạn làm gì)/i)) {
    return ['Tôi sẵn sàng hỗ trợ bạn! Bạn đang gặp vấn đề gì? 🤝', 'Đừng lo, tôi ở đây để giúp bạn! Hãy cho tôi biết chi tiết nhé.', 'Tôi luôn sẵn sàng! Bạn cần hỗ trợ về vấn đề nào? 💪'];
  }
  if (msg.match(/(game|chơi|phiên|mã|quà|thưởng|prize|phần thưởng)/i)) {
    return ['Về trò chơi, bạn đã có mã phiên chơi chưa? Hãy nhập mã để bắt đầu nhé! 🎮', 'Để tham gia, bạn cần nhập mã phiên chơi. Bạn đã có mã chưa? 🎁', 'Hệ thống đang hoạt động tốt! Bạn có thể nhập mã và chọn hộp quà của mình! ✨', 'Mỗi hộp quà đều chứa phần thưởng đặc biệt! Chúc bạn may mắn! 🍀'];
  }
  if (msg.match(/(rút tiền|payment|withdraw|tài khoản|balance|số dư)/i)) {
    return ['Để rút tiền, vui lòng nhập số tiền cần rút và chọn phương thức. Bạn cần hỗ trợ gì? 💰', 'Chúng tôi hỗ trợ rút tiền qua ngân hàng, MoMo, ZaloPay. Chọn phương thức nào nhé? 🏦', 'Tôi có thể giúp bạn rút tiền! Bạn muốn rút bao nhiêu? 💸'];
  }
  if (msg.match(/(cảm ơn|thank|cám ơn|thanks|khỏe|ổn)/i)) {
    return ['Không có gì! Rất vui được hỗ trợ bạn! 😊', 'Luôn sẵn lòng giúp đỡ! Chúc bạn một ngày tốt lành! ✨', 'Hân hạnh được phục vụ! Nếu cần gì cứ nhắn nhé! 🌟'];
  }
  return ['Cảm ơn bạn đã liên hệ! Tôi đã ghi nhận yêu cầu của bạn. 📝', 'Để tôi kiểm tra thông tin cho bạn nhé! Vui lòng đợi trong giây lát. ⏳', 'Tôi hiểu rồi! Bạn có thể cung cấp thêm thông tin chi tiết không? 🔍', 'Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7! Bạn cần gì khác không? 💬', 'Rất vui được trò chuyện với bạn! Có gì thắc mắc cứ hỏi nhé! 😊', 'Xin lỗi nếu tôi chưa hiểu rõ! Bạn có thể diễn đạt lại được không? 👂'];
}
function toggleChat() {
  var chatBox = document.getElementById('chatBox');
  var chatIcon = document.getElementById('chatFloatIcon');
  var badge = document.getElementById('notificationBadge');
  if (!chatBox) return;
  if (chatBox.classList.contains('active')) {
    chatBox.classList.remove('active');
    if (chatIcon) chatIcon.style.transform = 'scale(1)';
    disconnectChatSSE();
  } else {
    chatBox.classList.add('active');
    if (chatIcon) chatIcon.style.transform = 'scale(0.9)';
    if (badge) {
      badge.classList.remove('has-unread');
      badge.textContent = '0';
    }
    // Reset tab title blink when customer opens chat
    if (window.tabNotification) tabNotification.resetBadge();
    if (!currentChatCode) {
      initializeChat().finally(function () {
        window.dispatchEvent(new CustomEvent('chat:opened', {
          detail: {
            sessionCode: currentChatCode || null
          }
        }));
      });
    } else {
      connectChatSSE();
      window.dispatchEvent(new CustomEvent('chat:opened', {
        detail: {
          sessionCode: currentChatCode
        }
      }));
    }
    var messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
    syncSendButtonState();
  }
}
function showTypingIndicator() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Đang nhập tin nhắn...';
  var typingDiv = document.getElementById('chatTyping');
  var typingText = document.querySelector('#chatTyping .typing-text');
  if (typingDiv) {
    typingDiv.style.display = 'flex';
    isTyping = true;
  }
  if (typingText) {
    typingText.textContent = label;
  }
}
function hideTypingIndicator() {
  var typingDiv = document.getElementById('chatTyping');
  if (typingDiv) {
    typingDiv.style.display = 'none';
    isTyping = false;
  }
}
function handleKeyPress(event) {
  if (event.isComposing || event.keyCode === 229) return;
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}
function handleInputChange() {
  var input = document.getElementById('chatInput');
  if (!input) return;
  autoResizeChatInput(input);
  syncSendButtonState();

  // Emit typing event via Socket.IO
  clearTimeout(_typingDebounceTimer);
  _typingDebounceTimer = setTimeout(emitTyping, 400);
}
function autoResizeChatInput(inputEl) {
  if (!inputEl) return;
  inputEl.style.height = 'auto';
  var nextHeight = Math.min(inputEl.scrollHeight, 120);
  inputEl.style.height = "".concat(Math.max(42, nextHeight), "px");
}
function handleAttachment() {
  var input = document.getElementById('chatAttachmentInput');
  if (input) input.click();
}
function handleImage() {
  var input = document.getElementById('chatImageInput');
  if (input) input.click();
}
function handleAttachmentSelected(_x3) {
  return _handleAttachmentSelected.apply(this, arguments);
}
function _handleAttachmentSelected() {
  _handleAttachmentSelected = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(event) {
    var _event$target;
    var file;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          file = event === null || event === void 0 || (_event$target = event.target) === null || _event$target === void 0 || (_event$target = _event$target.files) === null || _event$target === void 0 ? void 0 : _event$target[0];
          if (file) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2);
        case 1:
          _context9.n = 2;
          return uploadAndSendAttachment(file, 'file');
        case 2:
          event.target.value = '';
        case 3:
          return _context9.a(2);
      }
    }, _callee9);
  }));
  return _handleAttachmentSelected.apply(this, arguments);
}
function handleImageSelected(_x4) {
  return _handleImageSelected.apply(this, arguments);
}
function _handleImageSelected() {
  _handleImageSelected = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(event) {
    var _event$target2;
    var file;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          file = event === null || event === void 0 || (_event$target2 = event.target) === null || _event$target2 === void 0 || (_event$target2 = _event$target2.files) === null || _event$target2 === void 0 ? void 0 : _event$target2[0];
          if (file) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2);
        case 1:
          _context0.n = 2;
          return uploadAndSendAttachment(file, 'image');
        case 2:
          event.target.value = '';
        case 3:
          return _context0.a(2);
      }
    }, _callee0);
  }));
  return _handleImageSelected.apply(this, arguments);
}
function uploadAndSendAttachment(_x5, _x6) {
  return _uploadAndSendAttachment.apply(this, arguments);
}
function _uploadAndSendAttachment() {
  _uploadAndSendAttachment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(file, forcedType) {
    var _uploadRs$data, formData, uploadResp, uploadRs, isImage, messageType, messageText, sendResp, sendRs, _t9;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          if (file) {
            _context1.n = 1;
            break;
          }
          return _context1.a(2);
        case 1:
          if (!(file.size > 20 * 1024 * 1024)) {
            _context1.n = 2;
            break;
          }
          showNotification('⚠️', 'Tệp vượt quá 20MB. Vui lòng chọn tệp nhỏ hơn.', '#ef4444');
          return _context1.a(2);
        case 2:
          _context1.p = 2;
          if (currentChatCode) {
            _context1.n = 3;
            break;
          }
          _context1.n = 3;
          return startNewChatSession();
        case 3:
          if (currentChatCode) {
            _context1.n = 4;
            break;
          }
          showNotification('❌', 'Không thể tạo phiên chat.', '#ef4444');
          return _context1.a(2);
        case 4:
          formData = new FormData();
          formData.append('file', file);
          _context1.n = 5;
          return fetch('/api/files', {
            method: 'POST',
            body: formData
          });
        case 5:
          uploadResp = _context1.v;
          _context1.n = 6;
          return uploadResp.json();
        case 6:
          uploadRs = _context1.v;
          if (!(!uploadResp.ok || !uploadRs.success || !((_uploadRs$data = uploadRs.data) !== null && _uploadRs$data !== void 0 && _uploadRs$data.url))) {
            _context1.n = 7;
            break;
          }
          throw new Error(uploadRs.message || 'Tải tệp thất bại');
        case 7:
          isImage = forcedType === 'image' || (file.type || '').startsWith('image/');
          messageType = isImage ? 'image' : 'file';
          messageText = isImage ? "\uD83D\uDDBC\uFE0F ".concat(file.name) : "\uD83D\uDCCE ".concat(file.name);
          _context1.n = 8;
          return fetch('/api/chat/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              session_code: currentChatCode,
              sender_name: 'Khách hàng',
              sender_type: 'customer',
              message: messageText,
              message_type: messageType,
              attachment_url: uploadRs.data.url,
              attachment_type: file.type || null,
              metadata: {
                original_name: file.name,
                size: file.size
              }
            })
          });
        case 8:
          sendResp = _context1.v;
          _context1.n = 9;
          return sendResp.json();
        case 9:
          sendRs = _context1.v;
          if (!(!sendResp.ok || !sendRs.success || !sendRs.data)) {
            _context1.n = 10;
            break;
          }
          throw new Error(sendRs.message || 'Gửi tệp thất bại');
        case 10:
          addMessageToUI(sendRs.data);
          showNotification(isImage ? '🖼️' : '📎', 'Đã gửi đính kèm thành công', '#10b981');
          _context1.n = 12;
          break;
        case 11:
          _context1.p = 11;
          _t9 = _context1.v;
          console.error('❌ Error uploading attachment:', _t9);
          showNotification('❌', _t9.message || 'Không thể gửi đính kèm', '#ef4444');
        case 12:
          return _context1.a(2);
      }
    }, _callee1, null, [[2, 11]]);
  }));
  return _uploadAndSendAttachment.apply(this, arguments);
}
function handleEmoji() {
  var emojis = ['😊', '❤️', '👍', '🎉', '😂', '🔥', '✨', '🎁', '👏', '💯'];
  var randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  var input = document.getElementById('chatInput');
  if (input) {
    input.value += randomEmoji;
    input.focus();
    handleInputChange();
  }
}
function toggleChatQRPanel() {
  var panel = document.getElementById('chatQRPanel');
  if (!panel) return;
  var open = panel.getAttribute('data-open') === '1';
  panel.setAttribute('data-open', open ? '0' : '1');
  panel.style.display = open ? 'none' : 'block';
  if (!open) {
    // Populate bank select if empty
    var sel = document.getElementById('chatQRBankSelect');
    if (sel && sel.options.length <= 1) _populateChatQRBanks(sel);
  }
}
function _populateChatQRBanks(sel) {
  var banks = [{
    bin: '970436',
    name: 'Vietcombank'
  }, {
    bin: '970407',
    name: 'Techcombank'
  }, {
    bin: '970422',
    name: 'MB Bank'
  }, {
    bin: '970415',
    name: 'VietinBank'
  }, {
    bin: '970405',
    name: 'Agribank'
  }, {
    bin: '970432',
    name: 'VPBank'
  }, {
    bin: '970423',
    name: 'TPBank'
  }, {
    bin: '970418',
    name: 'BIDV'
  }, {
    bin: '970426',
    name: 'MSB'
  }, {
    bin: '970448',
    name: 'OCB'
  }, {
    bin: '970452',
    name: 'Vietbank'
  }, {
    bin: '970443',
    name: 'SHB'
  }, {
    bin: '970403',
    name: 'Sacombank'
  }, {
    bin: '970416',
    name: 'ACB'
  }, {
    bin: '796500',
    name: 'MoMo'
  }, {
    bin: '985800',
    name: 'ZaloPay'
  }];
  banks.forEach(function (b) {
    var o = document.createElement('option');
    o.value = b.bin;
    o.textContent = b.name;
    sel.appendChild(o);
  });
}
function sendChatQRPayment() {
  return _sendChatQRPayment.apply(this, arguments);
}
function _sendChatQRPayment() {
  _sendChatQRPayment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
    var _document$getElementB4, _document$getElementB5, _document$getElementB6, _document$getElementB7, _document$getElementB8;
    var bin, acct, name, amount, content, qrUrl, resp, rs, _t0;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          bin = ((_document$getElementB4 = document.getElementById('chatQRBankSelect')) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.value) || '';
          acct = (((_document$getElementB5 = document.getElementById('chatQRAccount')) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.value) || '').trim();
          name = (((_document$getElementB6 = document.getElementById('chatQRName')) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.value) || '').trim().toUpperCase();
          amount = (((_document$getElementB7 = document.getElementById('chatQRAmount')) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.value) || '').trim();
          content = (((_document$getElementB8 = document.getElementById('chatQRContent')) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.value) || '').trim().toUpperCase();
          if (!(!bin || !acct || !name || !amount)) {
            _context10.n = 1;
            break;
          }
          showNotification('⚠️', 'Vui lòng điền đầy đủ thông tin ngân hàng', '#f59e0b');
          return _context10.a(2);
        case 1:
          qrUrl = "https://img.vietqr.io/image/".concat(bin, "-").concat(encodeURIComponent(acct), "-compact2.png?amount=").concat(encodeURIComponent(amount), "&addInfo=").concat(encodeURIComponent(content || 'Chuyen khoan'), "&accountName=").concat(encodeURIComponent(name));
          if (currentChatCode) {
            _context10.n = 3;
            break;
          }
          _context10.n = 2;
          return startNewChatSession();
        case 2:
          connectChatSSE();
        case 3:
          _context10.p = 3;
          _context10.n = 4;
          return fetch('/api/chat/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              session_code: currentChatCode,
              sender_name: 'Khách hàng',
              sender_type: 'customer',
              message: "QR thanh to\xE1n: ".concat(acct),
              message_type: 'image',
              attachment_url: qrUrl,
              attachment_type: 'image/png'
            })
          });
        case 4:
          resp = _context10.v;
          _context10.n = 5;
          return resp.json();
        case 5:
          rs = _context10.v;
          if (rs.success) {
            addMessageToUI(rs.data);
            chatMessages.push(rs.data);
            toggleChatQRPanel();
            showNotification('💳', 'Đã gửi mã QR thanh toán', '#10b981');
          }
          _context10.n = 7;
          break;
        case 6:
          _context10.p = 6;
          _t0 = _context10.v;
          showNotification('❌', 'Không thể gửi QR', '#ef4444');
        case 7:
          return _context10.a(2);
      }
    }, _callee10, null, [[3, 6]]);
  }));
  return _sendChatQRPayment.apply(this, arguments);
}
function handleSticker() {
  showNotification('✨', 'Tính năng sticker sẽ sớm có!', '#8b5cf6');
}
function formatTime(timestamp) {
  if (!timestamp) return '';
  var date = new Date(timestamp);
  var hours = String(date.getHours()).padStart(2, '0');
  var minutes = String(date.getMinutes()).padStart(2, '0');
  return "".concat(hours, ":").concat(minutes);
}
function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitize rich-text HTML from the admin Tiptap editor before rendering.
 * Allows: b, i, u, strong, em, span (color/font-size style only), br, p, div.
 * Falls back to escaped plain text if no HTML tags are detected.
 */
function sanitizeMessageHtml(raw) {
  var text = String(raw || '');
  if (!text) return '';
  if (!/<[a-z][\s\S]*?>/i.test(text)) {
    return escapeHtml(text).replace(/\n/g, '<br>');
  }
  var ALLOWED = new Set(['b', 'i', 'u', 'strong', 'em', 'span', 'br', 'p', 'div', 'ol', 'ul', 'li']);
  var tmp = document.createElement('div');
  tmp.innerHTML = text;
  (function clean(node) {
    Array.from(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) return;
      if (child.nodeType !== 1) {
        child.remove();
        return;
      }
      var tag = child.tagName.toLowerCase();
      if (!ALLOWED.has(tag)) {
        while (child.firstChild) node.insertBefore(child.firstChild, child);
        child.remove();
        return;
      }
      Array.from(child.attributes).forEach(function (attr) {
        if (tag === 'span' && attr.name === 'style') {
          child.setAttribute('style', attr.value.split(';').filter(function (s) {
            return /^\s*(color|font-size)\s*:/i.test(s);
          }).join(';'));
        } else {
          child.removeAttribute(attr.name);
        }
      });
      clean(child);
    });
  })(tmp);
  return tmp.innerHTML;
}
function renderAttachmentHtml(url, type, label) {
  var safeUrl = String(url || '').trim();
  if (!safeUrl) return '';
  var safeLabel = escapeHtml(label || 'Tệp đính kèm');
  var normalizedType = String(type || '').toLowerCase();
  var isImage = normalizedType.includes('image') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(safeUrl);
  if (isImage) {
    return "<div class=\"message-attachment\"><img src=\"".concat(safeUrl, "\" alt=\"").concat(safeLabel, "\" loading=\"lazy\"></div>");
  }
  return "<div class=\"message-attachment\"><a href=\"".concat(safeUrl, "\" target=\"_blank\" rel=\"noopener noreferrer\">\uD83D\uDCCE ").concat(safeLabel, "</a></div>");
}
function showNotification(icon, message, color) {
  var notification = document.createElement('div');
  notification.style.cssText = "\n        position: fixed;\n        top: 20px;\n        right: 20px;\n        background: white;\n        padding: 16px 24px;\n        border-radius: 12px;\n        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);\n        z-index: 100000;\n        display: flex;\n        align-items: center;\n        gap: 12px;\n        font-family: 'Poppins', sans-serif;\n        animation: slideInRight 0.3s ease-out;\n    ";
  notification.innerHTML = "\n        <span style=\"font-size: 20px;\">".concat(icon, "</span>\n        <span style=\"color: #333; font-weight: 500;\">").concat(message, "</span>\n    ");
  document.body.appendChild(notification);
  setTimeout(function () {
    return notification.remove();
  }, 3000);
}
function setupMessagePolling() {
  // Polling replaced by SSE EventSource — this function is intentionally empty.
  // Keep the call site in initializeChat for backward compatibility.
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    // Inject server toast CSS animations
    injectServerToastCSS();
    var input = document.getElementById('chatInput');
    if (input) autoResizeChatInput(input);
    bindChatInputStateGuards();
  });
} else {
  injectServerToastCSS();
  var input = document.getElementById('chatInput');
  if (input) autoResizeChatInput(input);
  bindChatInputStateGuards();
}

// Cleanup transport when user navigates away or closes the tab.
// 'pagehide' fires more reliably than 'beforeunload' on iOS Safari (BFCache).
window.addEventListener('pagehide', function () {
  disconnectChatSSE();
}, {
  once: true
});
function injectServerToastCSS() {
  if (document.getElementById('serverToastCSS')) return;
  var style = document.createElement('style');
  style.id = 'serverToastCSS';
  style.textContent = '@keyframes slideInRight{from{opacity:0;transform:translateX(40px);}to{opacity:1;transform:translateX(0);}}@keyframes slideOutRight{from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(40px);}}';
  document.head.appendChild(style);
}

// Request push notification permission
function requestPushPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
if (typeof window !== 'undefined') {
  Object.assign(window, {
    initializeChat: initializeChat,
    toggleChat: toggleChat,
    sendMessage: sendMessage,
    handleKeyPress: handleKeyPress,
    handleInputChange: handleInputChange,
    handleAttachment: handleAttachment,
    handleImage: handleImage,
    handleEmoji: handleEmoji,
    toggleChatQRPanel: toggleChatQRPanel,
    sendChatQRPayment: sendChatQRPayment,
    handleAttachmentSelected: handleAttachmentSelected,
    handleImageSelected: handleImageSelected,
    closeChatSession: closeChatSession,
    requestPushPermission: requestPushPermission
  });
}