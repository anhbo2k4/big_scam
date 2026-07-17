/**
 * widget-ui.js — Floating chat widget for customers
 * Depends on: chat-advanced.js (loaded before this file)
 *
 * Config: window.CHAT_CONFIG = { serverUrl, position, accentColor, agentName, agentAvatar }
 *
 * RULES:
 *   - Does NOT modify chat.js or chat-advanced.js
 *   - All customer API calls route through /api/chat/* (no admin paths)
 *   - Do NOT append sent messages manually — wait for SSE push via chat:event
 */

'use strict';

// ─────────────────────── State ────────────────────────────────
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var WCfg = window.CHAT_CONFIG || {};
var _floatOpen = false;
var _chatCode = sessionStorage.getItem('chatCode') || null;
var _widgetUnread = 0;
var _soundEnabled = localStorage.getItem('widgetSound') !== 'false';
var _escW = function _escW(str) {
  return str == null ? '' : String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};

// ─────────────────────── Init ─────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  _applyAccentColor();
  _applyPosition();
  if (_chatCode) {
    _showChatView();
    _loadHistory();
    _loadQuickReplies();
  }

  // SSE events dispatched by chat-advanced.js
  document.addEventListener('chat:event', function (e) {
    return _handleChatEvent(e.detail);
  });
  document.addEventListener('chat:layer', function (e) {
    var badge = document.getElementById('layerBadge');
    if (badge) badge.textContent = e.detail && e.detail.layer ? e.detail.layer : '';
  });

  // Close emoji picker when clicking elsewhere
  document.addEventListener('click', function (e) {
    var picker = document.getElementById('emojiPickerWrap');
    if (picker && !picker.contains(e.target) && !e.target.closest('.emoji-btn')) {
      picker.classList.remove('open');
    }
  });
});

// ─────────────────────── Config helpers ───────────────────────
function _applyAccentColor() {
  if (!WCfg.accentColor) return;
  document.documentElement.style.setProperty('--w-accent', WCfg.accentColor);
}
function _applyPosition() {
  var wrap = document.getElementById('floatWrap');
  if (!wrap) return;
  var pos = WCfg.position || 'bottom-right';
  wrap.className = 'float-wrap ' + pos.replace('-', ' ');
}

// ─────────────────────── Toggle open/close ────────────────────
function toggleFloat() {
  _floatOpen = !_floatOpen;
  var win = document.getElementById('floatWindow');
  if (win) win.classList.toggle('open', _floatOpen);
  if (_floatOpen && _widgetUnread > 0) {
    _widgetUnread = 0;
    _updateFabBadge();
  }
}
function _updateFabBadge() {
  var badge = document.getElementById('fabBadge');
  if (!badge) return;
  badge.textContent = _widgetUnread;
  badge.style.display = _widgetUnread > 0 ? '' : 'none';
}

// ─────────────────────── Session ──────────────────────────────
function initSession() {
  return _initSession.apply(this, arguments);
}
function _initSession() {
  _initSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var nameEl, phoneEl, issueEl, playerName, phone, issue, btn, res, json, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          nameEl = document.getElementById('playerNameInput');
          phoneEl = document.getElementById('playerPhoneInput');
          issueEl = document.getElementById('issueSelect');
          playerName = nameEl ? nameEl.value.trim() : '';
          phone = phoneEl ? phoneEl.value.trim() : '';
          issue = issueEl ? issueEl.value : '';
          if (playerName) {
            _context.n = 1;
            break;
          }
          _showFormError('Vui lòng nhập tên.');
          return _context.a(2);
        case 1:
          btn = document.getElementById('startChatBtn');
          if (btn) {
            btn.disabled = true;
            btn.textContent = 'Đang kết nối...';
          }
          _context.p = 2;
          _context.n = 3;
          return fetch('/api/chat/start', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: JSON.stringify({
              playerName: playerName,
              phone: phone,
              source: 'widget',
              issue_description: issue
            })
          });
        case 3:
          res = _context.v;
          _context.n = 4;
          return res.json();
        case 4:
          json = _context.v;
          if (!(!res.ok || json.success === false)) {
            _context.n = 5;
            break;
          }
          throw new Error(json.message || 'Lỗi server');
        case 5:
          _chatCode = json.data && json.data.session_code || json.session_code;
          sessionStorage.setItem('chatCode', _chatCode);
          _showChatView();
          _loadHistory();
          _loadQuickReplies();

          // Notify chat-advanced.js to subscribe SSE for this session
          document.dispatchEvent(new CustomEvent('chat:subscribe', {
            detail: {
              code: _chatCode
            }
          }));
          _context.n = 7;
          break;
        case 6:
          _context.p = 6;
          _t = _context.v;
          _showFormError(_t.message || 'Không thể bắt đầu trò chuyện. Vui lòng thử lại.');
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Bắt đầu trò chuyện';
          }
        case 7:
          return _context.a(2);
      }
    }, _callee, null, [[2, 6]]);
  }));
  return _initSession.apply(this, arguments);
}
function _showChatView() {
  var form = document.getElementById('sessionForm');
  var msgs = document.getElementById('floatMsgs');
  var inputBar = document.getElementById('floatInputBar');
  if (form) form.style.display = 'none';
  if (msgs) msgs.style.display = 'flex';
  if (inputBar) inputBar.style.display = 'flex';
  var input = document.getElementById('floatInput');
  if (input) setTimeout(function () {
    return input.focus();
  }, 100);
}
function _showFormError(msg) {
  var err = document.getElementById('formError');
  if (!err) {
    err = document.createElement('div');
    err.id = 'formError';
    err.className = 'form-error';
    var form = document.getElementById('sessionForm');
    if (form) form.appendChild(err);
  }
  err.textContent = msg;
  err.style.display = '';
}

// ─────────────────────── Message history ──────────────────────
function _loadHistory() {
  return _loadHistory2.apply(this, arguments);
}
function _loadHistory2() {
  _loadHistory2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var res, json, msgs, container, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          if (_chatCode) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2);
        case 1:
          _context2.p = 1;
          _context2.n = 2;
          return fetch('/api/chat/messages/' + encodeURIComponent(_chatCode), {
            credentials: 'include'
          });
        case 2:
          res = _context2.v;
          _context2.n = 3;
          return res.json();
        case 3:
          json = _context2.v;
          msgs = json.data || json.messages || [];
          container = document.getElementById('floatMsgs');
          if (container) {
            _context2.n = 4;
            break;
          }
          return _context2.a(2);
        case 4:
          container.innerHTML = msgs.map(_buildWidgetBubbleHTML).join('');
          _widgetScrollBottom();
          _context2.n = 6;
          break;
        case 5:
          _context2.p = 5;
          _t2 = _context2.v;
          console.warn('[widget-ui] history load error', _t2);
        case 6:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 5]]);
  }));
  return _loadHistory2.apply(this, arguments);
}
function _buildWidgetBubbleHTML(msg) {
  if (msg.sender_type === 'system' || msg.message_type === 'system') {
    return '<div class="fw-system">' + _escW(msg.message || '') + '</div>';
  }
  var isUser = msg.sender_type === 'customer';
  var cls = isUser ? 'user' : 'agent';
  var time = _fmtWidgetTime(msg.created_at);
  var content = '';
  if (msg.message_type === 'image' && msg.attachment_url) {
    content = '<img src="' + _escW(msg.attachment_url) + '" alt="Ảnh" loading="lazy" style="max-width:180px;border-radius:8px;cursor:zoom-in" onclick="openWidgetLightbox(\'' + _escW(msg.attachment_url) + '\')">';
  } else if (msg.message_type === 'file' && msg.attachment_url) {
    content = '📎 <a href="' + _escW(msg.attachment_url) + '" target="_blank" rel="noopener">' + _escW(msg.message || 'Tệp đính kèm') + '</a>';
  } else {
    content = _escW(msg.message || '');
  }
  return '<div class="fm-bubble ' + cls + '" data-msg-id="' + msg.id + '">' + '<div class="fm-text">' + content + '</div>' + '<div class="fm-time">' + time + '</div>' + '</div>';
}
function _appendWidgetMsg(msg) {
  var container = document.getElementById('floatMsgs');
  if (!container) return;
  var html = _buildWidgetBubbleHTML(msg);
  var wrap = document.createElement('div');
  wrap.innerHTML = html;
  var el = wrap.firstElementChild;
  if (el) container.appendChild(el);
  _widgetScrollBottom();
}

// ─────────────────────── Quick Replies ────────────────────────
function _loadQuickReplies() {
  return _loadQuickReplies2.apply(this, arguments);
}
function _loadQuickReplies2() {
  _loadQuickReplies2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var res, json, items, wrap, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return fetch('/api/chat/quick-replies', {
            credentials: 'include'
          });
        case 1:
          res = _context3.v;
          _context3.n = 2;
          return res.json();
        case 2:
          json = _context3.v;
          items = json.data || json.quickReplies || [];
          wrap = document.getElementById('qrChips');
          if (!(!wrap || !items.length)) {
            _context3.n = 3;
            break;
          }
          if (wrap) wrap.style.display = 'none';
          return _context3.a(2);
        case 3:
          wrap.innerHTML = items.map(function (qr) {
            return '<button class="qr-chip" onclick="sendQuickReply(\'' + _escW(qr.content || qr.text || '') + '\')">' + _escW(qr.label || qr.content || '') + '</button>';
          }).join('');
          wrap.style.display = '';
          _context3.n = 5;
          break;
        case 4:
          _context3.p = 4;
          _t3 = _context3.v;
        case 5:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 4]]);
  }));
  return _loadQuickReplies2.apply(this, arguments);
}
function sendQuickReply(text) {
  var input = document.getElementById('floatInput');
  if (input) {
    input.value = text;
    input.focus();
  }
}

// ─────────────────────── Send ─────────────────────────────────
function sendFloatMsg() {
  return _sendFloatMsg.apply(this, arguments);
}
function _sendFloatMsg() {
  _sendFloatMsg = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var input, text, btn, res, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          input = document.getElementById('floatInput');
          text = input ? input.value.trim() : '';
          if (!(!text || !_chatCode)) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2);
        case 1:
          btn = document.getElementById('floatSendBtn');
          if (btn) btn.disabled = true;
          _context4.p = 2;
          _context4.n = 3;
          return fetch('/api/chat/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: JSON.stringify({
              code: _chatCode,
              content: text,
              type: 'text',
              role: 'customer'
            })
          });
        case 3:
          res = _context4.v;
          if (res.ok) {
            _context4.n = 4;
            break;
          }
          throw new Error('HTTP ' + res.status);
        case 4:
          if (input) {
            input.value = '';
            input.style.height = 'auto';
          }
          // SSE will push the message back
          _context4.n = 6;
          break;
        case 5:
          _context4.p = 5;
          _t4 = _context4.v;
          _appendSystemMsg('Gửi thất bại. Vui lòng thử lại.');
        case 6:
          _context4.p = 6;
          if (btn) btn.disabled = false;
          return _context4.f(6);
        case 7:
          return _context4.a(2);
      }
    }, _callee4, null, [[2, 5, 6, 7]]);
  }));
  return _sendFloatMsg.apply(this, arguments);
}
function handleFloatKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendFloatMsg();
  }
}
function _appendSystemMsg(text) {
  var wrap = document.getElementById('floatMsgs');
  if (!wrap) return;
  var el = document.createElement('div');
  el.className = 'fw-system error';
  el.textContent = text;
  wrap.appendChild(el);
  _widgetScrollBottom();
}

// ─────────────────────── Typing ───────────────────────────────
var _wTypingTimer = null;
function handleWidgetTyping() {
  if (!_chatCode) return;
  if (_wTypingTimer) clearTimeout(_wTypingTimer);
  fetch('/api/chat/typing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'include',
    body: JSON.stringify({
      code: _chatCode,
      role: 'player',
      isTyping: true
    })
  }).catch(function () {});
  _wTypingTimer = setTimeout(function () {
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify({
        code: _chatCode,
        role: 'player',
        isTyping: false
      })
    }).catch(function () {});
  }, 2000);
}

// ─────────────────────── SSE / Events ─────────────────────────
function _handleChatEvent(data) {
  if (!data || !data.type) return;
  var code = data.session_code || data.code;
  if (code && code !== _chatCode) return; // not our session

  switch (data.type) {
    case 'new_message':
      _appendWidgetMsg(data);
      if (!_floatOpen) {
        _widgetUnread++;
        _updateFabBadge();
        if (_soundEnabled) _playNotifySound();
      }
      break;
    case 'typing':
      if (data.role === 'admin' || data.sender_type === 'support') {
        var t = document.getElementById('wTypingRow');
        if (t) {
          t.style.display = 'flex';
          _widgetScrollBottom();
        }
      }
      break;
    case 'stop_typing':
      if (data.role === 'admin' || data.sender_type === 'support') {
        var t2 = document.getElementById('wTypingRow');
        if (t2) t2.style.display = 'none';
      }
      break;
    case 'session_closed':
      _appendSystemMsg('Cuộc trò chuyện đã được đóng.');
      break;
  }
}

// ─────────────────────── Sound ────────────────────────────────
function _playNotifySound() {
  try {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    var ctx = new AudioCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {/* ignore */}
}
function toggleSound() {
  _soundEnabled = !_soundEnabled;
  localStorage.setItem('widgetSound', String(_soundEnabled));
  var btn = document.getElementById('soundBtn');
  if (btn) {
    btn.title = _soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh';
    btn.textContent = _soundEnabled ? '🔊' : '🔇';
  }
}

// ─────────────────────── Rating ───────────────────────────────
var _selectedRating = 0;
function openRatingPanel() {
  var panel = document.getElementById('ratingPanel');
  if (panel) panel.style.display = '';
}
function closeRatingPanel() {
  var panel = document.getElementById('ratingPanel');
  if (panel) panel.style.display = 'none';
}
function setRating(star) {
  _selectedRating = star;
  document.querySelectorAll('.star-btn').forEach(function (el, i) {
    el.classList.toggle('active', i < star);
  });
}
function submitRating() {
  return _submitRating.apply(this, arguments);
} // ─────────────────────── QR Panel ─────────────────────────────
function _submitRating() {
  _submitRating = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var noteEl, note, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          if (!(!_selectedRating || !_chatCode)) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2);
        case 1:
          noteEl = document.getElementById('ratingNote');
          note = noteEl ? noteEl.value.trim() : '';
          _context5.p = 2;
          _context5.n = 3;
          return fetch('/api/chat/rating', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              code: _chatCode,
              rating: _selectedRating,
              note: note
            })
          });
        case 3:
          closeRatingPanel();
          _appendSystemMsg('Cảm ơn bạn đã đánh giá!');
          _context5.n = 5;
          break;
        case 4:
          _context5.p = 4;
          _t5 = _context5.v;
          _appendSystemMsg('Gửi đánh giá thất bại.');
        case 5:
          return _context5.a(2);
      }
    }, _callee5, null, [[2, 4]]);
  }));
  return _submitRating.apply(this, arguments);
}
function openQrPanel() {
  var panel = document.getElementById('qrPanel');
  if (panel) panel.style.display = '';
}
function closeQrPanel() {
  var panel = document.getElementById('qrPanel');
  if (panel) panel.style.display = 'none';
}
function generateAndSendQR() {
  return _generateAndSendQR.apply(this, arguments);
} // ─────────────────────── Emoji Picker ─────────────────────────
function _generateAndSendQR() {
  _generateAndSendQR = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var bankEl, accountEl, amountEl, descEl, bank, account, amount, desc, qrUrl, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          bankEl = document.getElementById('qrBank');
          accountEl = document.getElementById('qrAccount');
          amountEl = document.getElementById('qrAmount');
          descEl = document.getElementById('qrDesc');
          bank = bankEl ? bankEl.value.trim() : '';
          account = accountEl ? accountEl.value.trim() : '';
          amount = amountEl ? amountEl.value.trim() : '';
          desc = descEl ? descEl.value.trim() : '';
          if (!(!bank || !account)) {
            _context6.n = 1;
            break;
          }
          alert('Vui lòng nhập ngân hàng và số tài khoản.');
          return _context6.a(2);
        case 1:
          qrUrl = 'https://img.vietqr.io/image/' + encodeURIComponent(bank) + '-' + encodeURIComponent(account) + '-compact2.png' + (amount ? '?amount=' + encodeURIComponent(amount) : '') + (desc ? (amount ? '&' : '?') + 'addInfo=' + encodeURIComponent(desc) : '');
          if (!_chatCode) {
            _context6.n = 5;
            break;
          }
          _context6.p = 2;
          _context6.n = 3;
          return fetch('/api/chat/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              code: _chatCode,
              content: 'Mã QR chuyển khoản',
              type: 'image',
              attachment_url: qrUrl,
              role: 'customer'
            })
          });
        case 3:
          _context6.n = 5;
          break;
        case 4:
          _context6.p = 4;
          _t6 = _context6.v;
        case 5:
          closeQrPanel();
        case 6:
          return _context6.a(2);
      }
    }, _callee6, null, [[2, 4]]);
  }));
  return _generateAndSendQR.apply(this, arguments);
}
function toggleEmojiPicker() {
  var picker = document.getElementById('emojiPickerWrap');
  if (picker) picker.classList.toggle('open');
}
function insertEmoji(emoji) {
  var input = document.getElementById('floatInput');
  if (!input) return;
  var start = input.selectionStart;
  var end = input.selectionEnd;
  var val = input.value;
  input.value = val.slice(0, start) + emoji + val.slice(end);
  input.selectionStart = input.selectionEnd = start + emoji.length;
  input.focus();
}

// ─────────────────────── Lightbox ─────────────────────────────
function openWidgetLightbox(url) {
  var box = document.getElementById('widgetLightbox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'widgetLightbox';
    box.className = 'widget-lightbox';
    box.onclick = function () {
      box.style.display = 'none';
    };
    box.innerHTML = '<img src="" alt="Preview" style="max-width:90vw;max-height:90vh;border-radius:12px">';
    document.body.appendChild(box);
    Object.assign(box.style, {
      position: 'fixed',
      inset: '0',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,.85)',
      zIndex: '9999',
      cursor: 'zoom-out'
    });
  }
  box.querySelector('img').src = url;
  box.style.display = 'flex';
}

// ─────────────────────── Utility ──────────────────────────────
function _fmtWidgetTime(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (_unused) {
    return '';
  }
}
function _widgetScrollBottom() {
  var el = document.getElementById('floatMsgs');
  if (el) el.scrollTop = el.scrollHeight;
}