/**
 * admin-ui.js — Admin Chat UI interactions + SSE
 * Works with: views/admin/chat.ejs + views/admin/cskh.ejs
 * CSS:        public/css/admin-chat.css
 *
 * Connects to:
 *   - /api/chat/admin/* endpoints (authenticate with session cookie)
 *   - /api/chat/events/admin  (SSE stream)
 *
 * RULES:
 *   - Does NOT modify chat.js
 *   - All API calls use credentials: 'include'
 *   - DOES NOT manually append sent messages — waits for SSE push
 */

'use strict';

// ─────────────────────── State ───────────────────────────────
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _currentCode = window.ADMIN_DATA && window.ADMIN_DATA.currentCode || null;
var _typingTimer = null;
var _adminSse = null;
var _darkMode = localStorage.getItem('adminDarkMode') === 'true';
var _sseRetryDelay = 3000; // exponential backoff: 3s → 6s → 12s … max 60s

// ─────────────────────── Init ────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  // Apply saved dark mode
  if (_darkMode) {
    document.body.classList.add('dark-mode');
    var btn = document.getElementById('dmToggle');
    if (btn) btn.textContent = '☀️';
  }

  // Scroll messages to bottom
  var chatMsgs = document.getElementById('chatMsgs');
  if (chatMsgs) chatMsgs.scrollTop = chatMsgs.scrollHeight;

  // Enable send button if there's an active chat
  if (_currentCode) _setSendEnabled(false);

  // Watch textarea for content changes to toggle send button
  var input = document.getElementById('adminInput');
  if (input) {
    input.addEventListener('input', function () {
      _setSendEnabled(input.value.trim().length > 0);
    });
  }

  // Start SSE
  _initAdminSSE();
});

// ─────────────────────── Dark Mode ───────────────────────────
function toggleDarkMode() {
  _darkMode = !_darkMode;
  document.body.classList.toggle('dark-mode', _darkMode);
  localStorage.setItem('adminDarkMode', _darkMode);
  var btn = document.getElementById('dmToggle');
  if (btn) btn.textContent = _darkMode ? '☀️' : '🌙';
}

// ─────────────────────── SSE setup ───────────────────────────
function _initAdminSSE() {
  if (_adminSse) return;
  var url = window.ADMIN_DATA && window.ADMIN_DATA.adminSseUrl || '/api/chat/events/admin';
  try {
    _adminSse = new EventSource(url, {
      withCredentials: true
    });
    _adminSse.addEventListener('new_message', function (e) {
      try {
        _handleNewMessage(JSON.parse(e.data));
      } catch (_) {}
    });
    _adminSse.addEventListener('typing', function (e) {
      try {
        _handleTypingEvent(JSON.parse(e.data));
      } catch (_) {}
    });
    _adminSse.addEventListener('stop_typing', function (e) {
      try {
        _handleStopTyping(JSON.parse(e.data));
      } catch (_) {}
    });
    _adminSse.addEventListener('online_status', function (e) {
      try {
        _handleOnlineStatus(JSON.parse(e.data));
      } catch (_) {}
    });
    _adminSse.addEventListener('message_status', function (e) {
      try {
        _handleMessageStatus(JSON.parse(e.data));
      } catch (_) {}
    });
    _adminSse.addEventListener('message_edited', function (e) {
      try {
        _handleMessageEdited(JSON.parse(e.data));
      } catch (_) {}
    });
    _adminSse.addEventListener('message_deleted', function (e) {
      try {
        var d = JSON.parse(e.data);
        var row = document.querySelector('[data-msg-id="' + d.messageId + '"]');
        if (row) row.remove();
      } catch (_) {}
    });
    _adminSse.addEventListener('stats_update', function (e) {
      try {
        _handleStatsUpdate(JSON.parse(e.data));
      } catch (_) {}
    });
    _adminSse.addEventListener('system_notification', function (e) {
      try {
        var d = JSON.parse(e.data);
        showToast(d.message || 'Thông báo hệ thống', 'warning');
      } catch (_) {}
    });
    _adminSse.onerror = function () {
      _adminSse.close();
      _adminSse = null;
      var delay = _sseRetryDelay;
      _sseRetryDelay = Math.min(_sseRetryDelay * 2, 60000); // double each retry, cap at 60s
      setTimeout(_initAdminSSE, delay);
    };
    _adminSse.onopen = function () {
      _sseRetryDelay = 3000; // reset on successful connect
    };
  } catch (err) {
    console.warn('[admin-ui] SSE init failed, will retry in', _sseRetryDelay / 1000 + 's', err);
    var delay = _sseRetryDelay;
    _sseRetryDelay = Math.min(_sseRetryDelay * 2, 60000);
    setTimeout(_initAdminSSE, delay);
  }
}

// ─────────────────────── SSE handlers ────────────────────────
function _handleNewMessage(data) {
  var code = data.session_code || data.code;
  if (!code) return;

  // Update contact list preview + badge
  var item = document.querySelector('.msg-item[data-code="' + code + '"]');
  if (item) {
    var previewEl = item.querySelector('.msg-preview');
    if (previewEl) {
      previewEl.textContent = data.message || data.content || '📎 File';
      previewEl.classList.remove('typing');
    }
    var timeEl = item.querySelector('.msg-time');
    if (timeEl) timeEl.textContent = _fmtTime(data.created_at);

    // Unread badge
    if (code !== _currentCode) {
      var badge = item.querySelector('.msg-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'msg-badge';
        badge.id = 'badge-' + code;
        item.querySelector('.msg-meta').appendChild(badge);
      }
      badge.style.display = '';
      var curr = parseInt(badge.textContent) || 0;
      badge.textContent = curr + 1 > 99 ? '99+' : curr + 1;
    }

    // Bump to top
    item.parentNode.prepend(item);
  }

  // If currently viewing this chat — append the bubble
  if (code === _currentCode) {
    _appendMsgDOM(data);
    // Mark read after short delay
    setTimeout(function () {
      return _markRead(code);
    }, 700);
  }
}
function _handleTypingEvent(data) {
  var code = data.session_code || data.code;
  if (data.role === 'player' || data.sender_type === 'customer') {
    if (code === _currentCode) {
      var row = document.getElementById('typingRow');
      if (row) {
        row.style.display = 'flex';
        _scrollBottom();
      }
    }
    var item = document.querySelector('.msg-item[data-code="' + code + '"]');
    if (item) {
      var preview = item.querySelector('.msg-preview');
      if (preview) {
        preview.textContent = 'Đang nhập...';
        preview.classList.add('typing');
      }
    }
  }
}
function _handleStopTyping(data) {
  var code = data.session_code || data.code;
  if (code === _currentCode) {
    var row = document.getElementById('typingRow');
    if (row) row.style.display = 'none';
  }
  var item = document.querySelector('.msg-item[data-code="' + code + '"]');
  if (item) {
    var preview = item.querySelector('.msg-preview');
    if (preview) preview.classList.remove('typing');
  }
}
function _handleOnlineStatus(data) {
  var code = data.session_code || data.code;
  var item = document.querySelector('.msg-item[data-code="' + code + '"]');
  if (item) {
    var wrap = item.querySelector('.avatar-wrap');
    var dot = wrap && wrap.querySelector('.online-dot');
    if (data.isOnline && !dot && wrap) {
      dot = document.createElement('div');
      dot.className = 'online-dot';
      wrap.appendChild(dot);
    } else if (!data.isOnline && dot) {
      dot.remove();
    }
  }
  if (code === _currentCode) {
    var el = document.getElementById('hdrStatus');
    if (el) el.textContent = data.isOnline ? 'Đang hoạt động' : 'Offline';
  }
}
function _handleMessageStatus(data) {
  var tick = document.querySelector('.tick-status[data-msg-id="' + data.messageId + '"]');
  if (tick) {
    if (data.status === 'seen') {
      tick.textContent = '✓✓';
      tick.classList.add('seen');
    } else if (data.status === 'delivered') {
      tick.textContent = '✓✓';
      tick.classList.remove('seen');
    } else {
      tick.textContent = '✓';
      tick.classList.remove('seen');
    }
  }
}
function _handleMessageEdited(data) {
  var row = document.querySelector('[data-msg-id="' + data.messageId + '"]');
  if (row) {
    var bubble = row.querySelector('.bubble');
    if (bubble) {
      bubble.innerHTML = _esc(data.message || data.content || '') + ' <span class="edited-label">(đã sửa)</span>';
    }
  }
}
function _handleStatsUpdate(data) {
  var el = document.getElementById('statUnread');
  if (el && data.unreadChats !== undefined) el.textContent = data.unreadChats;
  var badge = document.getElementById('totalUnreadBadge');
  if (badge && data.unreadChats !== undefined) {
    badge.textContent = data.unreadChats;
    badge.style.display = data.unreadChats > 0 ? '' : 'none';
  }
}

// ─────────────────────── Chat Selection ───────────────────────
function selectChat(_x) {
  return _selectChat.apply(this, arguments);
} // ─────────────────────── Render messages ─────────────────────
function _selectChat() {
  _selectChat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(code) {
    var url, paramKey, res, json, msgs, session, input, _t6;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          if (!(!code || code === _currentCode)) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2);
        case 1:
          _currentCode = code;

          // Highlight active
          document.querySelectorAll('.msg-item').forEach(function (el) {
            el.classList.toggle('active', el.dataset.code === code);
          });

          // Update URL
          url = new URL(window.location.href);
          paramKey = url.pathname.includes('/cskh') ? 'code' : 'chat';
          url.searchParams.set(paramKey, code);
          history.replaceState({}, '', url.toString());

          // Fetch messages
          _context7.p = 2;
          _context7.n = 3;
          return fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/messages', {
            credentials: 'include'
          });
        case 3:
          res = _context7.v;
          _context7.n = 4;
          return res.json();
        case 4:
          json = _context7.v;
          if (json.success !== false) {
            msgs = json.data || json.messages || [];
            session = json.session || null;
            _renderMessages(msgs, session, code);
          }
          _context7.n = 6;
          break;
        case 5:
          _context7.p = 5;
          _t6 = _context7.v;
          showToast('Không thể tải tin nhắn', 'error');
        case 6:
          // Mark read
          setTimeout(function () {
            return _markRead(code);
          }, 700);

          // Enable input
          _setSendEnabled(false);
          input = document.getElementById('adminInput');
          if (input) input.focus();
        case 7:
          return _context7.a(2);
      }
    }, _callee7, null, [[2, 5]]);
  }));
  return _selectChat.apply(this, arguments);
}
function _renderMessages(messages, session, code) {
  var container = document.getElementById('chatMsgs');
  if (!container) return;
  if (!messages || messages.length === 0) {
    container.innerHTML = '<div class="system-msg">Chưa có tin nhắn nào.</div>';
    return;
  }

  // Update header info from session if provided
  if (session) {
    var nameEl = document.getElementById('hdrName');
    if (nameEl) {
      var name = session.customer_nickname || session.customer_name || 'Khách ' + code;
      nameEl.textContent = name;
    }
    var statusEl = document.getElementById('hdrStatus');
    if (statusEl) statusEl.textContent = _statusLabel(session.status);
  }
  container.innerHTML = messages.map(function (msg) {
    return _buildBubbleHTML(msg, code, session);
  }).join('');
  _scrollBottom();
}
function _buildBubbleHTML(msg, code, session) {
  var isAdmin = msg.sender_type === 'support';
  var isSystem = msg.sender_type === 'system' || msg.message_type === 'system';
  var timeStr = _fmtTime(msg.created_at);
  var initials = (session && (session.customer_nickname || session.customer_name) || 'K')[0].toUpperCase();
  var colorCls = session && session.colorClass || 'color-a';
  if (isSystem) {
    return "<div class=\"system-msg\">".concat(_esc(msg.message || ''), "</div>");
  }
  var bubbleContent = '';
  var cls = isAdmin ? 'light' : 'dark';
  if (msg.message_type === 'image' && msg.attachment_url) {
    bubbleContent = "<div class=\"bubble ".concat(cls, "\">\n      <img src=\"").concat(_esc(msg.attachment_url), "\" onclick=\"openLightbox('").concat(_esc(msg.attachment_url), "')\" alt=\"\u1EA2nh\">\n    </div>");
  } else if (msg.message_type === 'file' && msg.attachment_url) {
    bubbleContent = "<div class=\"bubble ".concat(cls, "\">\n      \uD83D\uDCCE <a href=\"").concat(_esc(msg.attachment_url), "\" target=\"_blank\" rel=\"noopener\">").concat(_esc(msg.message || 'Tệp đính kèm'), "</a>\n    </div>");
  } else {
    var edited = msg.is_edited ? ' <span class="edited-label">(đã sửa)</span>' : '';
    bubbleContent = "<div class=\"bubble ".concat(cls, "\">").concat(_esc(msg.message || '')).concat(edited, "</div>");
  }
  var botLabel = msg.sender_type === 'bot' ? '<div class="msg-role-label">🤖 Bot</div>' : '';
  var tickHtml = isAdmin ? "<span class=\"tick-status ".concat(msg.is_read ? 'seen' : '', "\" data-msg-id=\"").concat(msg.id, "\">").concat(msg.is_read ? '✓✓' : '✓', "</span>") : '';
  var actionsHtml = isAdmin ? "<div class=\"msg-actions\">\n        <button onclick=\"editMsg('".concat(msg.id, "','").concat(code, "')\" title=\"S\u1EEDa\">\u270F\uFE0F</button>\n        <button onclick=\"deleteMsg('").concat(msg.id, "','").concat(code, "')\" title=\"X\xF3a\">\uD83D\uDDD1\uFE0F</button>\n       </div>") : '';
  var avatarHtml = isAdmin ? '' : "<div class=\"row-avatar ".concat(colorCls, "\">").concat(initials, "</div>");
  return "<div class=\"msg-row ".concat(isAdmin ? 'me' : '', "\" data-msg-id=\"").concat(msg.id, "\" data-role=\"").concat(msg.sender_type, "\">\n    ").concat(avatarHtml, "\n    <div class=\"bubble-wrap\">\n      ").concat(botLabel, "\n      ").concat(bubbleContent, "\n      <div class=\"bubble-time\">").concat(timeStr).concat(tickHtml, "</div>\n      ").concat(actionsHtml, "\n    </div>\n  </div>");
}
function _appendMsgDOM(data) {
  var container = document.getElementById('chatMsgs');
  if (!container) return;

  // Remove empty state message if present
  var sys = container.querySelector('.system-msg');
  if (sys && sys.textContent === 'Chưa có tin nhắn nào.') sys.remove();
  var code = data.session_code || data.code || _currentCode;
  var session = {
    colorClass: 'color-a'
  }; // best guess; full session not available here
  var html = _buildBubbleHTML(data, code, session);
  var row = document.createElement('div');
  row.innerHTML = html;
  var el = row.firstElementChild;
  if (el) {
    el.classList.add('new');
    container.appendChild(el);
  }
  _scrollBottom();
}

// ─────────────────────── Send Message ─────────────────────────
function sendAdminMsg(_x2) {
  return _sendAdminMsg.apply(this, arguments);
}
function _sendAdminMsg() {
  _sendAdminMsg = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(code) {
    var input, text, btn, res, _t7;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          input = document.getElementById('adminInput');
          text = input ? input.value.trim() : '';
          if (!(!text || !code)) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2);
        case 1:
          btn = document.getElementById('sendBtn');
          if (btn) btn.disabled = true;
          _context8.p = 2;
          _context8.n = 3;
          return fetch('/api/chat/admin/send-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: JSON.stringify({
              code: code,
              content: text,
              type: 'text'
            })
          });
        case 3:
          res = _context8.v;
          if (res.ok) {
            _context8.n = 4;
            break;
          }
          throw new Error('HTTP ' + res.status);
        case 4:
          if (input) {
            input.value = '';
            input.style.height = 'auto';
          }
          if (btn) btn.disabled = true; // stays disabled until input has text
          _stopAdminTyping(code);
          _context8.n = 6;
          break;
        case 5:
          _context8.p = 5;
          _t7 = _context8.v;
          showToast('Gửi tin thất bại', 'error');
          if (btn) btn.disabled = false;
        case 6:
          return _context8.a(2);
      }
    }, _callee8, null, [[2, 5]]);
  }));
  return _sendAdminMsg.apply(this, arguments);
}
function handleAdminKey(event, code) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendAdminMsg(code);
  }
}

// ─────────────────────── File Upload ──────────────────────────
function triggerFileUpload() {
  var el = document.getElementById('fileInput');
  if (el) el.click();
}
function uploadAndSendFile(_x3, _x4) {
  return _uploadAndSendFile.apply(this, arguments);
} // ─────────────────────── Typing ───────────────────────────────
function _uploadAndSendFile() {
  _uploadAndSendFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(file, code) {
    var bar, form, xhr;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          if (!(!file || !code)) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2);
        case 1:
          if (!(file.size > 20 * 1024 * 1024)) {
            _context9.n = 2;
            break;
          }
          showToast('File quá lớn (tối đa 20MB)', 'error');
          return _context9.a(2);
        case 2:
          bar = document.getElementById('uploadProgress');
          if (bar) {
            bar.style.display = 'block';
            bar.style.width = '10%';
          }
          try {
            form = new FormData();
            form.append('file', file);
            form.append('code', code);
            xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/chat/admin/send-file');
            xhr.withCredentials = true;
            xhr.upload.onprogress = function (e) {
              if (bar && e.lengthComputable) {
                bar.style.width = Math.round(e.loaded / e.total * 90) + '%';
              }
            };
            xhr.onload = function () {
              if (bar) {
                bar.style.width = '100%';
                setTimeout(function () {
                  bar.style.display = 'none';
                  bar.style.width = '0';
                }, 500);
              }
              if (xhr.status >= 400) showToast('Upload thất bại', 'error');
              // SSE will deliver the file message
            };
            xhr.onerror = function () {
              showToast('Upload thất bại', 'error');
              if (bar) bar.style.display = 'none';
            };
            xhr.send(form);
          } catch (e) {
            showToast('Upload thất bại', 'error');
            if (bar) bar.style.display = 'none';
          }
        case 3:
          return _context9.a(2);
      }
    }, _callee9);
  }));
  return _uploadAndSendFile.apply(this, arguments);
}
function handleTyping(code) {
  if (!code) return;
  if (_typingTimer) clearTimeout(_typingTimer);
  _sendTyping(code, true);
  _typingTimer = setTimeout(function () {
    return _stopAdminTyping(code);
  }, 2000);
}
function _sendTyping(code, isTyping) {
  fetch('/api/chat/typing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'include',
    body: JSON.stringify({
      code: code,
      role: 'admin',
      isTyping: isTyping
    })
  }).catch(function () {});
}
function _stopAdminTyping(code) {
  clearTimeout(_typingTimer);
  _sendTyping(code, false);
}

// ─────────────────────── Mark Read ────────────────────────────
function _markRead(code) {
  fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/mark-read', {
    method: 'PUT',
    credentials: 'include'
  }).then(function () {
    // Clear badge
    var badge = document.getElementById('badge-' + code);
    if (badge) badge.style.display = 'none';
  }).catch(function () {});
}

// ─────────────────────── Actions ──────────────────────────────
function resolveChat(_x5) {
  return _resolveChat.apply(this, arguments);
}
function _resolveChat() {
  _resolveChat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(code) {
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          openModal('Giải quyết cuộc trò chuyện', '<p>Xác nhận đánh dấu cuộc trò chuyện là đã giải quyết?</p>', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
            var status, item, _t8;
            return _regenerator().w(function (_context0) {
              while (1) switch (_context0.p = _context0.n) {
                case 0:
                  _context0.p = 0;
                  _context0.n = 1;
                  return fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/mark-resolved', {
                    method: 'PUT',
                    credentials: 'include'
                  });
                case 1:
                  status = document.getElementById('hdrStatus');
                  if (status) {
                    status.textContent = 'Đã giải quyết';
                    status.className = 'hdr-status';
                  }
                  item = document.querySelector('.msg-item[data-code="' + code + '"]');
                  if (item) item.dataset.status = 'closed';
                  showToast('Đã đánh dấu giải quyết', 'success');
                  _context0.n = 3;
                  break;
                case 2:
                  _context0.p = 2;
                  _t8 = _context0.v;
                  showToast('Thao tác thất bại', 'error');
                case 3:
                  return _context0.a(2);
              }
            }, _callee0, null, [[0, 2]]);
          })));
        case 1:
          return _context1.a(2);
      }
    }, _callee1);
  }));
  return _resolveChat.apply(this, arguments);
}
function archiveChat(_x6) {
  return _archiveChat.apply(this, arguments);
}
function _archiveChat() {
  _archiveChat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(code) {
    var item, _t9;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _context10.p = 0;
          _context10.n = 1;
          return fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/archive', {
            method: 'PUT',
            credentials: 'include'
          });
        case 1:
          item = document.querySelector('.msg-item[data-code="' + code + '"]');
          if (item) item.classList.add('archived');
          showToast('Đã archive', 'success');
          _context10.n = 3;
          break;
        case 2:
          _context10.p = 2;
          _t9 = _context10.v;
          showToast('Thao tác thất bại', 'error');
        case 3:
          return _context10.a(2);
      }
    }, _callee10, null, [[0, 2]]);
  }));
  return _archiveChat.apply(this, arguments);
}
function togglePriority(_x7, _x8) {
  return _togglePriority.apply(this, arguments);
}
function _togglePriority() {
  _togglePriority = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(code, current) {
    var newPri, btn, item, _t0;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          newPri = current === 'high' || current === 'urgent' ? 'normal' : 'high';
          _context11.p = 1;
          _context11.n = 2;
          return fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/priority', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              priority: newPri
            })
          });
        case 2:
          btn = document.getElementById('priorityBtn');
          if (btn) btn.textContent = newPri === 'high' ? '🔴' : '⚪';
          item = document.querySelector('.msg-item[data-code="' + code + '"]');
          if (item) item.classList.toggle('priority-high', newPri === 'high');
          showToast(newPri === 'high' ? 'Đã đặt priority cao' : 'Đã bỏ priority', 'success');
          _context11.n = 4;
          break;
        case 3:
          _context11.p = 3;
          _t0 = _context11.v;
          showToast('Thao tác thất bại', 'error');
        case 4:
          return _context11.a(2);
      }
    }, _callee11, null, [[1, 3]]);
  }));
  return _togglePriority.apply(this, arguments);
}
function deleteSession(code) {
  openModal('⚠️ Xóa session', '<p style="color:var(--red-priority)">Hành động này sẽ xóa toàn bộ lịch sử trò chuyện và không thể hoàn tác.</p>', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var item, chatArea, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return fetch('/api/chat/admin/chat/' + encodeURIComponent(code), {
            method: 'DELETE',
            credentials: 'include'
          });
        case 1:
          item = document.querySelector('.msg-item[data-code="' + code + '"]');
          if (item) item.remove();
          chatArea = document.querySelector('.chat-area');
          if (chatArea) chatArea.innerHTML = '<div class="empty-state"><div class="empty-icon">💬</div><div>Chọn một cuộc trò chuyện</div></div>';
          _currentCode = null;
          showToast('Đã xóa session', 'warning');
          _context.n = 3;
          break;
        case 2:
          _context.p = 2;
          _t = _context.v;
          showToast('Xóa thất bại', 'error');
        case 3:
          return _context.a(2);
      }
    }, _callee, null, [[0, 2]]);
  })), true // danger style
  );
}
function openNoteModal(code) {
  var banner = document.getElementById('noteBanner');
  var existing = banner ? banner.textContent.replace('📝 ', '').trim() : '';
  openModal('📝 Ghi chú nội bộ', "<textarea rows=\"4\" placeholder=\"Nh\u1EADp ghi ch\xFA...\">".concat(_esc(existing), "</textarea>"), /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var note, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          note = document.querySelector('#modalBody textarea').value.trim();
          _context2.p = 1;
          _context2.n = 2;
          return fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/note', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              note: note
            })
          });
        case 2:
          if (banner) {
            banner.textContent = note ? '📝 ' + note : '';
            banner.style.display = note ? '' : 'none';
          }
          showToast('Đã lưu ghi chú', 'success');
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
          showToast('Lưu thất bại', 'error');
        case 4:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 3]]);
  })));
}
function openNicknameModal(code, current) {
  openModal('✏️ Đặt nickname', "<input type=\"text\" value=\"".concat(_esc(current || ''), "\" placeholder=\"Nh\u1EADp nickname...\">"), /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var nickname, hdrName, item, nameEl, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          nickname = document.querySelector('#modalBody input').value.trim();
          _context3.p = 1;
          _context3.n = 2;
          return fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/nickname', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              nickname: nickname
            })
          });
        case 2:
          hdrName = document.getElementById('hdrName');
          if (hdrName && nickname) hdrName.childNodes[0].textContent = nickname + ' ';
          item = document.querySelector('.msg-item[data-code="' + code + '"]');
          nameEl = item && item.querySelector('.msg-name');
          if (nameEl && nickname) nameEl.childNodes[0].textContent = nickname + ' ';
          showToast('Đã đặt nickname', 'success');
          _context3.n = 4;
          break;
        case 3:
          _context3.p = 3;
          _t3 = _context3.v;
          showToast('Lưu thất bại', 'error');
        case 4:
          return _context3.a(2);
      }
    }, _callee3, null, [[1, 3]]);
  })));
}
function editMsg(msgId, code) {
  var row = document.querySelector('[data-msg-id="' + msgId + '"]');
  var bubble = row && row.querySelector('.bubble');
  var current = bubble ? bubble.childNodes[0].textContent.trim() : '';
  openModal('✏️ Sửa tin nhắn', "<textarea rows=\"3\">".concat(_esc(current), "</textarea>"), /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var newText, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          newText = document.querySelector('#modalBody textarea').value.trim();
          if (newText) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2);
        case 1:
          _context4.p = 1;
          _context4.n = 2;
          return fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/messages/' + encodeURIComponent(msgId), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              content: newText
            })
          });
        case 2:
          showToast('Đã sửa tin nhắn', 'success');
          // SSE message_edited event will update DOM
          _context4.n = 4;
          break;
        case 3:
          _context4.p = 3;
          _t4 = _context4.v;
          showToast('Sửa thất bại', 'error');
        case 4:
          return _context4.a(2);
      }
    }, _callee4, null, [[1, 3]]);
  })));
}
function deleteMsg(msgId, code) {
  openModal('🗑️ Xóa tin nhắn', '<p>Tin nhắn sẽ bị xóa vĩnh viễn.</p>', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var row, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _context5.n = 1;
          return fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/messages/' + encodeURIComponent(msgId), {
            method: 'DELETE',
            credentials: 'include'
          });
        case 1:
          row = document.querySelector('[data-msg-id="' + msgId + '"]');
          if (row) row.remove();
          showToast('Đã xóa tin nhắn', 'success');
          _context5.n = 3;
          break;
        case 2:
          _context5.p = 2;
          _t5 = _context5.v;
          showToast('Xóa thất bại', 'error');
        case 3:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 2]]);
  })), true);
}

// ─────────────────────── Sidebar ──────────────────────────────
function toggleSidebar() {
  var panel = document.getElementById('msgPanel');
  if (panel) panel.classList.toggle('collapsed');
}

// ─────────────────────── Search / Filter ─────────────────────
function filterContacts(keyword) {
  var kw = (keyword || '').toLowerCase();
  document.querySelectorAll('.msg-item').forEach(function (el) {
    var name = (el.dataset.name || '').toLowerCase();
    el.style.display = name.includes(kw) ? '' : 'none';
  });
}
function filterByStatus(status, tab) {
  // Update tab active state
  document.querySelectorAll('.filter-tab').forEach(function (t) {
    return t.classList.remove('active');
  });
  if (tab) tab.classList.add('active');
  // Filter items
  document.querySelectorAll('.msg-item').forEach(function (el) {
    var s = el.dataset.status || '';
    el.style.display = status === 'all' || s === status ? '' : 'none';
  });
}

// ─────────────────────── Modal ────────────────────────────────
function openModal(title, bodyHTML, onConfirm, danger) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  var confirmBtn = document.getElementById('modalConfirm');
  confirmBtn.className = danger ? 'btn-danger' : 'btn-primary';
  confirmBtn.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return onConfirm();
        case 1:
          closeModal();
        case 2:
          return _context6.a(2);
      }
    }, _callee6);
  }));
  document.getElementById('modalOverlay').classList.add('open');

  // Focus first input/textarea
  var focusable = document.querySelector('#modalBody input, #modalBody textarea');
  if (focusable) setTimeout(function () {
    return focusable.focus();
  }, 50);
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ─────────────────────── Toast ────────────────────────────────
function showToast(message, type) {
  var container = document.getElementById('toastContainer');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'success');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function () {
    toast.style.opacity = '0';
    setTimeout(function () {
      return toast.remove();
    }, 300);
  }, 3000);
}

// ─────────────────────── Lightbox ─────────────────────────────
function openLightbox(url) {
  document.getElementById('lightboxImg').src = url;
  document.getElementById('lightboxOverlay').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightboxOverlay').classList.remove('open');
}

// ─────────────────────── Helpers ──────────────────────────────
function _setSendEnabled(enabled) {
  var btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = !enabled;
}
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  _setSendEnabled(el.value.trim().length > 0);
}
function _scrollBottom() {
  var el = document.getElementById('chatMsgs');
  if (el) el.scrollTop = el.scrollHeight;
}
function _fmtTime(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (_unused6) {
    return '';
  }
}
function _esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function _statusLabel(status) {
  var map = {
    active: 'Đang hoạt động',
    waiting: 'Đang chờ',
    closed: 'Đã đóng',
    archived: 'Đã lưu trữ',
    resolved: 'Đã giải quyết'
  };
  return map[status] || status || '';
}