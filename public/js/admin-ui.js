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
let _currentCode  = (window.ADMIN_DATA && window.ADMIN_DATA.currentCode) || null;
let _typingTimer  = null;
let _adminSse     = null;
let _darkMode     = localStorage.getItem('adminDarkMode') === 'true';
let _sseRetryDelay = 3000; // exponential backoff: 3s → 6s → 12s … max 60s

// ─────────────────────── Init ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved dark mode
  if (_darkMode) {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('dmToggle');
    if (btn) btn.textContent = '☀️';
  }

  // Scroll messages to bottom
  const chatMsgs = document.getElementById('chatMsgs');
  if (chatMsgs) chatMsgs.scrollTop = chatMsgs.scrollHeight;

  // Enable send button if there's an active chat
  if (_currentCode) _setSendEnabled(false);

  // Watch textarea for content changes to toggle send button
  const input = document.getElementById('adminInput');
  if (input) {
    input.addEventListener('input', () => {
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
  const btn = document.getElementById('dmToggle');
  if (btn) btn.textContent = _darkMode ? '☀️' : '🌙';
}

// ─────────────────────── SSE setup ───────────────────────────
function _initAdminSSE() {
  if (_adminSse) return;
  const url = (window.ADMIN_DATA && window.ADMIN_DATA.adminSseUrl) || '/api/chat/events/admin';
  try {
    _adminSse = new EventSource(url, { withCredentials: true });

    _adminSse.addEventListener('new_message', e => {
      try { _handleNewMessage(JSON.parse(e.data)); } catch (_) {}
    });

    _adminSse.addEventListener('typing', e => {
      try { _handleTypingEvent(JSON.parse(e.data)); } catch (_) {}
    });

    _adminSse.addEventListener('stop_typing', e => {
      try { _handleStopTyping(JSON.parse(e.data)); } catch (_) {}
    });

    _adminSse.addEventListener('online_status', e => {
      try { _handleOnlineStatus(JSON.parse(e.data)); } catch (_) {}
    });

    _adminSse.addEventListener('message_status', e => {
      try { _handleMessageStatus(JSON.parse(e.data)); } catch (_) {}
    });

    _adminSse.addEventListener('message_edited', e => {
      try { _handleMessageEdited(JSON.parse(e.data)); } catch (_) {}
    });

    _adminSse.addEventListener('message_deleted', e => {
      try {
        const d = JSON.parse(e.data);
        const row = document.querySelector('[data-msg-id="' + d.messageId + '"]');
        if (row) row.remove();
      } catch (_) {}
    });

    _adminSse.addEventListener('stats_update', e => {
      try { _handleStatsUpdate(JSON.parse(e.data)); } catch (_) {}
    });

    _adminSse.addEventListener('system_notification', e => {
      try {
        const d = JSON.parse(e.data);
        showToast(d.message || 'Thông báo hệ thống', 'warning');
      } catch (_) {}
    });

    _adminSse.onerror = () => {
      _adminSse.close();
      _adminSse = null;
      const delay = _sseRetryDelay;
      _sseRetryDelay = Math.min(_sseRetryDelay * 2, 60000); // double each retry, cap at 60s
      setTimeout(_initAdminSSE, delay);
    };

    _adminSse.onopen = () => {
      _sseRetryDelay = 3000; // reset on successful connect
    };
  } catch (err) {
    console.warn('[admin-ui] SSE init failed, will retry in', _sseRetryDelay / 1000 + 's', err);
    const delay = _sseRetryDelay;
    _sseRetryDelay = Math.min(_sseRetryDelay * 2, 60000);
    setTimeout(_initAdminSSE, delay);
  }
}

// ─────────────────────── SSE handlers ────────────────────────
function _handleNewMessage(data) {
  const code = data.session_code || data.code;
  if (!code) return;

  // Update contact list preview + badge
  const item = document.querySelector('.msg-item[data-code="' + code + '"]');
  if (item) {
    const previewEl = item.querySelector('.msg-preview');
    if (previewEl) {
      previewEl.textContent = data.message || data.content || '📎 File';
      previewEl.classList.remove('typing');
    }
    const timeEl = item.querySelector('.msg-time');
    if (timeEl) timeEl.textContent = _fmtTime(data.created_at);

    // Unread badge
    if (code !== _currentCode) {
      let badge = item.querySelector('.msg-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'msg-badge';
        badge.id = 'badge-' + code;
        item.querySelector('.msg-meta').appendChild(badge);
      }
      badge.style.display = '';
      const curr = parseInt(badge.textContent) || 0;
      badge.textContent = curr + 1 > 99 ? '99+' : curr + 1;
    }

    // Bump to top
    item.parentNode.prepend(item);
  }

  // If currently viewing this chat — append the bubble
  if (code === _currentCode) {
    _appendMsgDOM(data);
    // Mark read after short delay
    setTimeout(() => _markRead(code), 700);
  }
}

function _handleTypingEvent(data) {
  const code = data.session_code || data.code;
  if (data.role === 'player' || data.sender_type === 'customer') {
    if (code === _currentCode) {
      const row = document.getElementById('typingRow');
      if (row) { row.style.display = 'flex'; _scrollBottom(); }
    }
    const item = document.querySelector('.msg-item[data-code="' + code + '"]');
    if (item) {
      const preview = item.querySelector('.msg-preview');
      if (preview) { preview.textContent = 'Đang nhập...'; preview.classList.add('typing'); }
    }
  }
}

function _handleStopTyping(data) {
  const code = data.session_code || data.code;
  if (code === _currentCode) {
    const row = document.getElementById('typingRow');
    if (row) row.style.display = 'none';
  }
  const item = document.querySelector('.msg-item[data-code="' + code + '"]');
  if (item) {
    const preview = item.querySelector('.msg-preview');
    if (preview) preview.classList.remove('typing');
  }
}

function _handleOnlineStatus(data) {
  const code = data.session_code || data.code;
  const item = document.querySelector('.msg-item[data-code="' + code + '"]');
  if (item) {
    const wrap = item.querySelector('.avatar-wrap');
    let dot = wrap && wrap.querySelector('.online-dot');
    if (data.isOnline && !dot && wrap) {
      dot = document.createElement('div');
      dot.className = 'online-dot';
      wrap.appendChild(dot);
    } else if (!data.isOnline && dot) {
      dot.remove();
    }
  }
  if (code === _currentCode) {
    const el = document.getElementById('hdrStatus');
    if (el) el.textContent = data.isOnline ? 'Đang hoạt động' : 'Offline';
  }
}

function _handleMessageStatus(data) {
  const tick = document.querySelector('.tick-status[data-msg-id="' + data.messageId + '"]');
  if (tick) {
    if (data.status === 'seen') { tick.textContent = '✓✓'; tick.classList.add('seen'); }
    else if (data.status === 'delivered') { tick.textContent = '✓✓'; tick.classList.remove('seen'); }
    else { tick.textContent = '✓'; tick.classList.remove('seen'); }
  }
}

function _handleMessageEdited(data) {
  const row = document.querySelector('[data-msg-id="' + data.messageId + '"]');
  if (row) {
    const bubble = row.querySelector('.bubble');
    if (bubble) {
      bubble.innerHTML = _esc(data.message || data.content || '')
        + ' <span class="edited-label">(đã sửa)</span>';
    }
  }
}

function _handleStatsUpdate(data) {
  const el = document.getElementById('statUnread');
  if (el && data.unreadChats !== undefined) el.textContent = data.unreadChats;
  const badge = document.getElementById('totalUnreadBadge');
  if (badge && data.unreadChats !== undefined) {
    badge.textContent = data.unreadChats;
    badge.style.display = data.unreadChats > 0 ? '' : 'none';
  }
}

// ─────────────────────── Chat Selection ───────────────────────
async function selectChat(code) {
  if (!code || code === _currentCode) return;
  _currentCode = code;

  // Highlight active
  document.querySelectorAll('.msg-item').forEach(el => {
    el.classList.toggle('active', el.dataset.code === code);
  });

  // Update URL
  const url = new URL(window.location.href);
  const paramKey = url.pathname.includes('/cskh') ? 'code' : 'chat';
  url.searchParams.set(paramKey, code);
  history.replaceState({}, '', url.toString());

  // Fetch messages
  try {
    const res = await fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/messages', {
      credentials: 'include'
    });
    const json = await res.json();
    if (json.success !== false) {
      const msgs = json.data || json.messages || [];
      const session = json.session || null;
      _renderMessages(msgs, session, code);
    }
  } catch (err) {
    showToast('Không thể tải tin nhắn', 'error');
  }

  // Mark read
  setTimeout(() => _markRead(code), 700);

  // Enable input
  _setSendEnabled(false);
  const input = document.getElementById('adminInput');
  if (input) input.focus();
}

// ─────────────────────── Render messages ─────────────────────
function _renderMessages(messages, session, code) {
  const container = document.getElementById('chatMsgs');
  if (!container) return;

  if (!messages || messages.length === 0) {
    container.innerHTML = '<div class="system-msg">Chưa có tin nhắn nào.</div>';
    return;
  }

  // Update header info from session if provided
  if (session) {
    const nameEl = document.getElementById('hdrName');
    if (nameEl) {
      const name = session.customer_nickname || session.customer_name || ('Khách ' + code);
      nameEl.textContent = name;
    }
    const statusEl = document.getElementById('hdrStatus');
    if (statusEl) statusEl.textContent = _statusLabel(session.status);
  }

  container.innerHTML = messages.map(msg => _buildBubbleHTML(msg, code, session)).join('');
  _scrollBottom();
}

function _buildBubbleHTML(msg, code, session) {
  const isAdmin  = msg.sender_type === 'support';
  const isSystem = msg.sender_type === 'system' || msg.message_type === 'system';
  const timeStr  = _fmtTime(msg.created_at);
  const initials = ((session && (session.customer_nickname || session.customer_name)) || 'K')[0].toUpperCase();
  const colorCls = (session && session.colorClass) || 'color-a';

  if (isSystem) {
    return `<div class="system-msg">${_esc(msg.message || '')}</div>`;
  }

  let bubbleContent = '';
  const cls = isAdmin ? 'light' : 'dark';

  if (msg.message_type === 'image' && msg.attachment_url) {
    bubbleContent = `<div class="bubble ${cls}">
      <img src="${_esc(msg.attachment_url)}" onclick="openLightbox('${_esc(msg.attachment_url)}')" alt="Ảnh">
    </div>`;
  } else if (msg.message_type === 'file' && msg.attachment_url) {
    bubbleContent = `<div class="bubble ${cls}">
      📎 <a href="${_esc(msg.attachment_url)}" target="_blank" rel="noopener">${_esc(msg.message || 'Tệp đính kèm')}</a>
    </div>`;
  } else {
    const edited = msg.is_edited ? ' <span class="edited-label">(đã sửa)</span>' : '';
    bubbleContent = `<div class="bubble ${cls}">${_esc(msg.message || '')}${edited}</div>`;
  }

  const botLabel  = msg.sender_type === 'bot' ? '<div class="msg-role-label">🤖 Bot</div>' : '';
  const tickHtml  = isAdmin
    ? `<span class="tick-status ${msg.is_read ? 'seen' : ''}" data-msg-id="${msg.id}">${msg.is_read ? '✓✓' : '✓'}</span>`
    : '';
  const actionsHtml = isAdmin
    ? `<div class="msg-actions">
        <button onclick="editMsg('${msg.id}','${code}')" title="Sửa">✏️</button>
        <button onclick="deleteMsg('${msg.id}','${code}')" title="Xóa">🗑️</button>
       </div>`
    : '';

  const avatarHtml = isAdmin ? '' : `<div class="row-avatar ${colorCls}">${initials}</div>`;

  return `<div class="msg-row ${isAdmin ? 'me' : ''}" data-msg-id="${msg.id}" data-role="${msg.sender_type}">
    ${avatarHtml}
    <div class="bubble-wrap">
      ${botLabel}
      ${bubbleContent}
      <div class="bubble-time">${timeStr}${tickHtml}</div>
      ${actionsHtml}
    </div>
  </div>`;
}

function _appendMsgDOM(data) {
  const container = document.getElementById('chatMsgs');
  if (!container) return;

  // Remove empty state message if present
  const sys = container.querySelector('.system-msg');
  if (sys && sys.textContent === 'Chưa có tin nhắn nào.') sys.remove();

  const code    = data.session_code || data.code || _currentCode;
  const session = { colorClass: 'color-a' }; // best guess; full session not available here
  const html    = _buildBubbleHTML(data, code, session);
  const row     = document.createElement('div');
  row.innerHTML = html;
  const el = row.firstElementChild;
  if (el) { el.classList.add('new'); container.appendChild(el); }
  _scrollBottom();
}

// ─────────────────────── Send Message ─────────────────────────
async function sendAdminMsg(code) {
  const input = document.getElementById('adminInput');
  const text  = input ? input.value.trim() : '';
  if (!text || !code) return;

  const btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/chat/admin/send-message', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'include',
      body: JSON.stringify({ code, content: text, type: 'text' })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    if (input) { input.value = ''; input.style.height = 'auto'; }
    if (btn) btn.disabled = true; // stays disabled until input has text
    _stopAdminTyping(code);
  } catch (e) {
    showToast('Gửi tin thất bại', 'error');
    if (btn) btn.disabled = false;
  }
}

function handleAdminKey(event, code) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendAdminMsg(code);
  }
}

// ─────────────────────── File Upload ──────────────────────────
function triggerFileUpload() {
  const el = document.getElementById('fileInput');
  if (el) el.click();
}

async function uploadAndSendFile(file, code) {
  if (!file || !code) return;
  if (file.size > 20 * 1024 * 1024) {
    showToast('File quá lớn (tối đa 20MB)', 'error');
    return;
  }

  const bar = document.getElementById('uploadProgress');
  if (bar) { bar.style.display = 'block'; bar.style.width = '10%'; }

  try {
    const form = new FormData();
    form.append('file', file);
    form.append('code', code);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/chat/admin/send-file');
    xhr.withCredentials = true;

    xhr.upload.onprogress = e => {
      if (bar && e.lengthComputable) {
        bar.style.width = Math.round(e.loaded / e.total * 90) + '%';
      }
    };
    xhr.onload = () => {
      if (bar) { bar.style.width = '100%'; setTimeout(() => { bar.style.display = 'none'; bar.style.width = '0'; }, 500); }
      if (xhr.status >= 400) showToast('Upload thất bại', 'error');
      // SSE will deliver the file message
    };
    xhr.onerror = () => {
      showToast('Upload thất bại', 'error');
      if (bar) bar.style.display = 'none';
    };
    xhr.send(form);
  } catch (e) {
    showToast('Upload thất bại', 'error');
    if (bar) bar.style.display = 'none';
  }
}

// ─────────────────────── Typing ───────────────────────────────
function handleTyping(code) {
  if (!code) return;
  if (_typingTimer) clearTimeout(_typingTimer);
  _sendTyping(code, true);
  _typingTimer = setTimeout(() => _stopAdminTyping(code), 2000);
}

function _sendTyping(code, isTyping) {
  fetch('/api/chat/typing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'include',
    body: JSON.stringify({ code, role: 'admin', isTyping })
  }).catch(() => {});
}

function _stopAdminTyping(code) {
  clearTimeout(_typingTimer);
  _sendTyping(code, false);
}

// ─────────────────────── Mark Read ────────────────────────────
function _markRead(code) {
  fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/mark-read', {
    method: 'PUT', credentials: 'include'
  }).then(() => {
    // Clear badge
    const badge = document.getElementById('badge-' + code);
    if (badge) badge.style.display = 'none';
  }).catch(() => {});
}

// ─────────────────────── Actions ──────────────────────────────
async function resolveChat(code) {
  openModal('Giải quyết cuộc trò chuyện',
    '<p>Xác nhận đánh dấu cuộc trò chuyện là đã giải quyết?</p>',
    async () => {
      try {
        await fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/mark-resolved', {
          method: 'PUT', credentials: 'include'
        });
        const status = document.getElementById('hdrStatus');
        if (status) { status.textContent = 'Đã giải quyết'; status.className = 'hdr-status'; }
        const item = document.querySelector('.msg-item[data-code="' + code + '"]');
        if (item) item.dataset.status = 'closed';
        showToast('Đã đánh dấu giải quyết', 'success');
      } catch { showToast('Thao tác thất bại', 'error'); }
    }
  );
}

async function archiveChat(code) {
  try {
    await fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/archive', {
      method: 'PUT', credentials: 'include'
    });
    const item = document.querySelector('.msg-item[data-code="' + code + '"]');
    if (item) item.classList.add('archived');
    showToast('Đã archive', 'success');
  } catch { showToast('Thao tác thất bại', 'error'); }
}

async function togglePriority(code, current) {
  const newPri = (current === 'high' || current === 'urgent') ? 'normal' : 'high';
  try {
    await fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/priority', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ priority: newPri })
    });
    const btn  = document.getElementById('priorityBtn');
    if (btn) btn.textContent = newPri === 'high' ? '🔴' : '⚪';
    const item = document.querySelector('.msg-item[data-code="' + code + '"]');
    if (item) item.classList.toggle('priority-high', newPri === 'high');
    showToast(newPri === 'high' ? 'Đã đặt priority cao' : 'Đã bỏ priority', 'success');
  } catch { showToast('Thao tác thất bại', 'error'); }
}

function deleteSession(code) {
  openModal(
    '⚠️ Xóa session',
    '<p style="color:var(--red-priority)">Hành động này sẽ xóa toàn bộ lịch sử trò chuyện và không thể hoàn tác.</p>',
    async () => {
      try {
        await fetch('/api/chat/admin/chat/' + encodeURIComponent(code), {
          method: 'DELETE', credentials: 'include'
        });
        const item = document.querySelector('.msg-item[data-code="' + code + '"]');
        if (item) item.remove();
        const chatArea = document.querySelector('.chat-area');
        if (chatArea) chatArea.innerHTML = '<div class="empty-state"><div class="empty-icon">💬</div><div>Chọn một cuộc trò chuyện</div></div>';
        _currentCode = null;
        showToast('Đã xóa session', 'warning');
      } catch { showToast('Xóa thất bại', 'error'); }
    },
    true // danger style
  );
}

function openNoteModal(code) {
  const banner = document.getElementById('noteBanner');
  const existing = banner ? banner.textContent.replace('📝 ', '').trim() : '';
  openModal(
    '📝 Ghi chú nội bộ',
    `<textarea rows="4" placeholder="Nhập ghi chú...">${_esc(existing)}</textarea>`,
    async () => {
      const note = document.querySelector('#modalBody textarea').value.trim();
      try {
        await fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/note', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ note })
        });
        if (banner) {
          banner.textContent = note ? '📝 ' + note : '';
          banner.style.display = note ? '' : 'none';
        }
        showToast('Đã lưu ghi chú', 'success');
      } catch { showToast('Lưu thất bại', 'error'); }
    }
  );
}

function openNicknameModal(code, current) {
  openModal(
    '✏️ Đặt nickname',
    `<input type="text" value="${_esc(current || '')}" placeholder="Nhập nickname...">`,
    async () => {
      const nickname = document.querySelector('#modalBody input').value.trim();
      try {
        await fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/nickname', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ nickname })
        });
        const hdrName = document.getElementById('hdrName');
        if (hdrName && nickname) hdrName.childNodes[0].textContent = nickname + ' ';
        const item = document.querySelector('.msg-item[data-code="' + code + '"]');
        const nameEl = item && item.querySelector('.msg-name');
        if (nameEl && nickname) nameEl.childNodes[0].textContent = nickname + ' ';
        showToast('Đã đặt nickname', 'success');
      } catch { showToast('Lưu thất bại', 'error'); }
    }
  );
}

function editMsg(msgId, code) {
  const row    = document.querySelector('[data-msg-id="' + msgId + '"]');
  const bubble = row && row.querySelector('.bubble');
  const current = bubble ? bubble.childNodes[0].textContent.trim() : '';
  openModal(
    '✏️ Sửa tin nhắn',
    `<textarea rows="3">${_esc(current)}</textarea>`,
    async () => {
      const newText = document.querySelector('#modalBody textarea').value.trim();
      if (!newText) return;
      try {
        await fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/messages/' + encodeURIComponent(msgId), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ content: newText })
        });
        showToast('Đã sửa tin nhắn', 'success');
        // SSE message_edited event will update DOM
      } catch { showToast('Sửa thất bại', 'error'); }
    }
  );
}

function deleteMsg(msgId, code) {
  openModal(
    '🗑️ Xóa tin nhắn',
    '<p>Tin nhắn sẽ bị xóa vĩnh viễn.</p>',
    async () => {
      try {
        await fetch('/api/chat/admin/chat/' + encodeURIComponent(code) + '/messages/' + encodeURIComponent(msgId), {
          method: 'DELETE', credentials: 'include'
        });
        const row = document.querySelector('[data-msg-id="' + msgId + '"]');
        if (row) row.remove();
        showToast('Đã xóa tin nhắn', 'success');
      } catch { showToast('Xóa thất bại', 'error'); }
    },
    true
  );
}

// ─────────────────────── Sidebar ──────────────────────────────
function toggleSidebar() {
  const panel = document.getElementById('msgPanel');
  if (panel) panel.classList.toggle('collapsed');
}

// ─────────────────────── Search / Filter ─────────────────────
function filterContacts(keyword) {
  const kw = (keyword || '').toLowerCase();
  document.querySelectorAll('.msg-item').forEach(el => {
    const name = (el.dataset.name || '').toLowerCase();
    el.style.display = name.includes(kw) ? '' : 'none';
  });
}

function filterByStatus(status, tab) {
  // Update tab active state
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  if (tab) tab.classList.add('active');
  // Filter items
  document.querySelectorAll('.msg-item').forEach(el => {
    const s = el.dataset.status || '';
    el.style.display = (status === 'all' || s === status) ? '' : 'none';
  });
}

// ─────────────────────── Modal ────────────────────────────────
function openModal(title, bodyHTML, onConfirm, danger) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  const confirmBtn = document.getElementById('modalConfirm');
  confirmBtn.className = danger ? 'btn-danger' : 'btn-primary';
  confirmBtn.onclick = async () => { await onConfirm(); closeModal(); };
  document.getElementById('modalOverlay').classList.add('open');

  // Focus first input/textarea
  const focusable = document.querySelector('#modalBody input, #modalBody textarea');
  if (focusable) setTimeout(() => focusable.focus(), 50);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ─────────────────────── Toast ────────────────────────────────
function showToast(message, type) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'success');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
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
  const btn = document.getElementById('sendBtn');
  if (btn) btn.disabled = !enabled;
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  _setSendEnabled(el.value.trim().length > 0);
}

function _scrollBottom() {
  const el = document.getElementById('chatMsgs');
  if (el) el.scrollTop = el.scrollHeight;
}

function _fmtTime(dateStr) {
  if (!dateStr) return '';
  try { return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
}

function _esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function _statusLabel(status) {
  const map = { active: 'Đang hoạt động', waiting: 'Đang chờ', closed: 'Đã đóng', archived: 'Đã lưu trữ', resolved: 'Đã giải quyết' };
  return map[status] || status || '';
}
