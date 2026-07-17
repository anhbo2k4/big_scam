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
const WCfg = window.CHAT_CONFIG || {};

let _floatOpen   = false;
let _chatCode    = sessionStorage.getItem('chatCode') || null;
let _widgetUnread = 0;
let _soundEnabled = localStorage.getItem('widgetSound') !== 'false';

const _escW = str => (str == null ? '' : String(str)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;'));

// ─────────────────────── Init ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  _applyAccentColor();
  _applyPosition();

  if (_chatCode) {
    _showChatView();
    _loadHistory();
    _loadQuickReplies();
  }

  // SSE events dispatched by chat-advanced.js
  document.addEventListener('chat:event', e => _handleChatEvent(e.detail));
  document.addEventListener('chat:layer', e => {
    const badge = document.getElementById('layerBadge');
    if (badge) badge.textContent = e.detail && e.detail.layer ? e.detail.layer : '';
  });

  // Close emoji picker when clicking elsewhere
  document.addEventListener('click', e => {
    const picker = document.getElementById('emojiPickerWrap');
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
  const wrap = document.getElementById('floatWrap');
  if (!wrap) return;
  const pos = WCfg.position || 'bottom-right';
  wrap.className = 'float-wrap ' + pos.replace('-', ' ');
}

// ─────────────────────── Toggle open/close ────────────────────
function toggleFloat() {
  _floatOpen = !_floatOpen;
  const win = document.getElementById('floatWindow');
  if (win) win.classList.toggle('open', _floatOpen);

  if (_floatOpen && _widgetUnread > 0) {
    _widgetUnread = 0;
    _updateFabBadge();
  }
}

function _updateFabBadge() {
  const badge = document.getElementById('fabBadge');
  if (!badge) return;
  badge.textContent = _widgetUnread;
  badge.style.display = _widgetUnread > 0 ? '' : 'none';
}

// ─────────────────────── Session ──────────────────────────────
async function initSession() {
  const nameEl  = document.getElementById('playerNameInput');
  const phoneEl = document.getElementById('playerPhoneInput');
  const issueEl = document.getElementById('issueSelect');

  const playerName  = nameEl  ? nameEl.value.trim()  : '';
  const phone       = phoneEl ? phoneEl.value.trim()  : '';
  const issue       = issueEl ? issueEl.value          : '';

  if (!playerName) { _showFormError('Vui lòng nhập tên.'); return; }

  const btn = document.getElementById('startChatBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Đang kết nối...'; }

  try {
    const res = await fetch('/api/chat/start', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'include',
      body: JSON.stringify({ playerName, phone, source: 'widget', issue_description: issue })
    });
    const json = await res.json();
    if (!res.ok || json.success === false) throw new Error(json.message || 'Lỗi server');

    _chatCode = (json.data && json.data.session_code) || json.session_code;
    sessionStorage.setItem('chatCode', _chatCode);

    _showChatView();
    _loadHistory();
    _loadQuickReplies();

    // Notify chat-advanced.js to subscribe SSE for this session
    document.dispatchEvent(new CustomEvent('chat:subscribe', { detail: { code: _chatCode } }));
  } catch (err) {
    _showFormError(err.message || 'Không thể bắt đầu trò chuyện. Vui lòng thử lại.');
    if (btn) { btn.disabled = false; btn.textContent = 'Bắt đầu trò chuyện'; }
  }
}

function _showChatView() {
  const form     = document.getElementById('sessionForm');
  const msgs     = document.getElementById('floatMsgs');
  const inputBar = document.getElementById('floatInputBar');
  if (form)     form.style.display = 'none';
  if (msgs)     msgs.style.display = 'flex';
  if (inputBar) inputBar.style.display = 'flex';

  const input = document.getElementById('floatInput');
  if (input) setTimeout(() => input.focus(), 100);
}

function _showFormError(msg) {
  let err = document.getElementById('formError');
  if (!err) {
    err = document.createElement('div');
    err.id = 'formError';
    err.className = 'form-error';
    const form = document.getElementById('sessionForm');
    if (form) form.appendChild(err);
  }
  err.textContent = msg;
  err.style.display = '';
}

// ─────────────────────── Message history ──────────────────────
async function _loadHistory() {
  if (!_chatCode) return;
  try {
    const res  = await fetch('/api/chat/messages/' + encodeURIComponent(_chatCode), { credentials: 'include' });
    const json = await res.json();
    const msgs = json.data || json.messages || [];
    const container = document.getElementById('floatMsgs');
    if (!container) return;
    container.innerHTML = msgs.map(_buildWidgetBubbleHTML).join('');
    _widgetScrollBottom();
  } catch (e) {
    console.warn('[widget-ui] history load error', e);
  }
}

function _buildWidgetBubbleHTML(msg) {
  if (msg.sender_type === 'system' || msg.message_type === 'system') {
    return '<div class="fw-system">' + _escW(msg.message || '') + '</div>';
  }
  const isUser = msg.sender_type === 'customer';
  const cls    = isUser ? 'user' : 'agent';
  const time   = _fmtWidgetTime(msg.created_at);

  let content = '';
  if (msg.message_type === 'image' && msg.attachment_url) {
    content = '<img src="' + _escW(msg.attachment_url) + '" alt="Ảnh" loading="lazy" style="max-width:180px;border-radius:8px;cursor:zoom-in" onclick="openWidgetLightbox(\'' + _escW(msg.attachment_url) + '\')">';
  } else if (msg.message_type === 'file' && msg.attachment_url) {
    content = '📎 <a href="' + _escW(msg.attachment_url) + '" target="_blank" rel="noopener">' + _escW(msg.message || 'Tệp đính kèm') + '</a>';
  } else {
    content = _escW(msg.message || '');
  }

  return '<div class="fm-bubble ' + cls + '" data-msg-id="' + msg.id + '">'
    + '<div class="fm-text">' + content + '</div>'
    + '<div class="fm-time">' + time + '</div>'
    + '</div>';
}

function _appendWidgetMsg(msg) {
  const container = document.getElementById('floatMsgs');
  if (!container) return;
  const html = _buildWidgetBubbleHTML(msg);
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  const el = wrap.firstElementChild;
  if (el) container.appendChild(el);
  _widgetScrollBottom();
}

// ─────────────────────── Quick Replies ────────────────────────
async function _loadQuickReplies() {
  try {
    const res  = await fetch('/api/chat/quick-replies', { credentials: 'include' });
    const json = await res.json();
    const items = json.data || json.quickReplies || [];
    const wrap  = document.getElementById('qrChips');
    if (!wrap || !items.length) { if (wrap) wrap.style.display = 'none'; return; }
    wrap.innerHTML = items.map(function(qr) {
      return '<button class="qr-chip" onclick="sendQuickReply(\'' + _escW(qr.content || qr.text || '') + '\')">' + _escW(qr.label || qr.content || '') + '</button>';
    }).join('');
    wrap.style.display = '';
  } catch { /* quick replies are optional */ }
}

function sendQuickReply(text) {
  const input = document.getElementById('floatInput');
  if (input) { input.value = text; input.focus(); }
}

// ─────────────────────── Send ─────────────────────────────────
async function sendFloatMsg() {
  const input = document.getElementById('floatInput');
  const text  = input ? input.value.trim() : '';
  if (!text || !_chatCode) return;

  const btn = document.getElementById('floatSendBtn');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/chat/message', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'include',
      body: JSON.stringify({ code: _chatCode, content: text, type: 'text', role: 'customer' })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    if (input) { input.value = ''; input.style.height = 'auto'; }
    // SSE will push the message back
  } catch {
    _appendSystemMsg('Gửi thất bại. Vui lòng thử lại.');
  } finally {
    if (btn) btn.disabled = false;
  }
}

function handleFloatKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendFloatMsg();
  }
}

function _appendSystemMsg(text) {
  const wrap = document.getElementById('floatMsgs');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'fw-system error';
  el.textContent = text;
  wrap.appendChild(el);
  _widgetScrollBottom();
}

// ─────────────────────── Typing ───────────────────────────────
let _wTypingTimer = null;
function handleWidgetTyping() {
  if (!_chatCode) return;
  if (_wTypingTimer) clearTimeout(_wTypingTimer);
  fetch('/api/chat/typing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'include',
    body: JSON.stringify({ code: _chatCode, role: 'player', isTyping: true })
  }).catch(function() {});
  _wTypingTimer = setTimeout(function() {
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'include',
      body: JSON.stringify({ code: _chatCode, role: 'player', isTyping: false })
    }).catch(function() {});
  }, 2000);
}

// ─────────────────────── SSE / Events ─────────────────────────
function _handleChatEvent(data) {
  if (!data || !data.type) return;
  const code = data.session_code || data.code;
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
        if (t) { t.style.display = 'flex'; _widgetScrollBottom(); }
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
    var ctx  = new AudioCtx();
    var osc  = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) { /* ignore */ }
}

function toggleSound() {
  _soundEnabled = !_soundEnabled;
  localStorage.setItem('widgetSound', String(_soundEnabled));
  var btn = document.getElementById('soundBtn');
  if (btn) { btn.title = _soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'; btn.textContent = _soundEnabled ? '🔊' : '🔇'; }
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
  document.querySelectorAll('.star-btn').forEach(function(el, i) {
    el.classList.toggle('active', i < star);
  });
}
async function submitRating() {
  if (!_selectedRating || !_chatCode) return;
  var noteEl = document.getElementById('ratingNote');
  var note   = noteEl ? noteEl.value.trim() : '';
  try {
    await fetch('/api/chat/rating', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code: _chatCode, rating: _selectedRating, note: note })
    });
    closeRatingPanel();
    _appendSystemMsg('Cảm ơn bạn đã đánh giá!');
  } catch { _appendSystemMsg('Gửi đánh giá thất bại.'); }
}

// ─────────────────────── QR Panel ─────────────────────────────
function openQrPanel() {
  var panel = document.getElementById('qrPanel');
  if (panel) panel.style.display = '';
}
function closeQrPanel() {
  var panel = document.getElementById('qrPanel');
  if (panel) panel.style.display = 'none';
}

async function generateAndSendQR() {
  var bankEl    = document.getElementById('qrBank');
  var accountEl = document.getElementById('qrAccount');
  var amountEl  = document.getElementById('qrAmount');
  var descEl    = document.getElementById('qrDesc');

  var bank    = bankEl    ? bankEl.value.trim()    : '';
  var account = accountEl ? accountEl.value.trim()  : '';
  var amount  = amountEl  ? amountEl.value.trim()   : '';
  var desc    = descEl    ? descEl.value.trim()     : '';

  if (!bank || !account) { alert('Vui lòng nhập ngân hàng và số tài khoản.'); return; }

  var qrUrl = 'https://img.vietqr.io/image/' + encodeURIComponent(bank) + '-' + encodeURIComponent(account) + '-compact2.png'
    + (amount ? '?amount=' + encodeURIComponent(amount) : '')
    + (desc   ? (amount ? '&' : '?') + 'addInfo=' + encodeURIComponent(desc) : '');

  if (_chatCode) {
    try {
      await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: _chatCode, content: 'Mã QR chuyển khoản', type: 'image', attachment_url: qrUrl, role: 'customer' })
      });
    } catch { /* ignore */ }
  }
  closeQrPanel();
}

// ─────────────────────── Emoji Picker ─────────────────────────
function toggleEmojiPicker() {
  var picker = document.getElementById('emojiPickerWrap');
  if (picker) picker.classList.toggle('open');
}

function insertEmoji(emoji) {
  var input = document.getElementById('floatInput');
  if (!input) return;
  var start = input.selectionStart;
  var end   = input.selectionEnd;
  var val   = input.value;
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
    box.onclick = function() { box.style.display = 'none'; };
    box.innerHTML = '<img src="" alt="Preview" style="max-width:90vw;max-height:90vh;border-radius:12px">';
    document.body.appendChild(box);
    Object.assign(box.style, { position:'fixed', inset:'0', display:'none', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.85)', zIndex:'9999', cursor:'zoom-out' });
  }
  box.querySelector('img').src = url;
  box.style.display = 'flex';
}

// ─────────────────────── Utility ──────────────────────────────
function _fmtWidgetTime(dateStr) {
  if (!dateStr) return '';
  try { return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
}

function _widgetScrollBottom() {
  var el = document.getElementById('floatMsgs');
  if (el) el.scrollTop = el.scrollHeight;
}
