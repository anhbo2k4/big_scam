
// Prevent redeclaration of variables
if (typeof chatMessages === 'undefined') {
    var chatMessages = [];
}
if (typeof isTyping === 'undefined') {
    var isTyping = false;
}
var currentChatSession = null;
var currentChatCode = null;
var currentChatPlayerToken = null;
var autoReplyTimer = null;
var chatEventSource = null;   // kept for legacy reference
var _chatTransport = null;    // ChatTransport layered fallback instance
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
    const raw = String(hex || '').trim();
    if (!raw) return '';
    if (/^#[0-9a-f]{6}$/i.test(raw)) return raw;
    if (/^#[0-9a-f]{3}$/i.test(raw)) {
        return '#' + raw.slice(1).split('').map(ch => ch + ch).join('');
    }
    return '';
}

function toRgba(hex, alpha) {
    const v = normalizeHexColor(hex);
    if (!v) return '';
    const r = parseInt(v.slice(1, 3), 16);
    const g = parseInt(v.slice(3, 5), 16);
    const b = parseInt(v.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyChatCustomizationToUI() {
    const titleEl = document.getElementById('chatHeaderTitleText') || document.querySelector('.chat-title');
    const subtitleEl = document.getElementById('chatHeaderSubtitleText') || document.querySelector('#chatOnlineStatus .status-text');
    const avatarEl = document.getElementById('chatHeaderAvatar') || document.querySelector('.chat-avatar img');
    const bubbleIconEl = document.querySelector('.chat-icon-inner');
    const inputEl = document.getElementById('chatInput');
    const floatIcon = document.getElementById('chatFloatIcon');
    const chatBox = document.getElementById('chatBox');
    const chatHeader = document.querySelector('.chat-header');
    const sendButton = document.getElementById('sendButton');

    const displayTitle = chatUiSettings.headerTitle || chatUiSettings.adminName || DEFAULT_CHAT_AGENT_NAME;
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

    const textColor = normalizeHexColor(chatUiSettings.textColor || '') || '#ffffff';
    if (chatBox) {
        chatBox.style.setProperty('--chat-text-color', textColor);
    }

    const bubbleColor = normalizeHexColor(chatUiSettings.bubbleColor || '') || '#6366f1';
    if (floatIcon) {
        floatIcon.style.background = `linear-gradient(135deg, ${bubbleColor} 0%, ${toRgba(bubbleColor, 0.86)} 100%)`;
        floatIcon.style.boxShadow = `0 12px 35px ${toRgba(bubbleColor, 0.45)}, 0 0 0 0 ${toRgba(bubbleColor, 0.38)}`;
    }
    if (sendButton) {
        sendButton.style.background = `linear-gradient(135deg, ${bubbleColor} 0%, ${toRgba(bubbleColor, 0.88)} 100%)`;
    }

    const headerBg = normalizeHexColor(chatUiSettings.headerBgColor || '');
    if (chatHeader && headerBg) {
        chatHeader.style.background = `linear-gradient(135deg, ${headerBg} 0%, ${toRgba(headerBg, 0.88)} 100%)`;
    }
    if (chatHeader && chatUiSettings.headerTextColor) {
        chatHeader.style.color = chatUiSettings.headerTextColor;
    }

    if (floatIcon && chatBox) {
        const isLeft = String(chatUiSettings.position || 'right').toLowerCase() === 'left';
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

async function loadChatCustomizationSettings(force = false) {
    if (chatUiSettingsLoaded && !force) {
        applyChatCustomizationToUI();
        return;
    }

    try {
        const response = await fetch('/api/settings');
        const result = await response.json();
        const chat = result?.success ? (result.data?.chat || {}) : {};
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
    } catch (err) {
        console.warn('⚠️ Cannot load chat customization settings:', err);
    } finally {
        chatUiSettingsLoaded = true;
        applyChatCustomizationToUI();
    }
}

async function initializeChat(sessionCode = null) {
    try {
        await loadChatCustomizationSettings();
        
        if (!sessionCode) {
            const params = new URLSearchParams(window.location.search);
            sessionCode = params.get('code') || null;
        }

        if (!sessionCode) {
            await startNewChatSession();
        } else {
            await loadChatSession(sessionCode);
        }

        await loadChatMessages();

        // Connect SSE stream for realtime updates (no polling needed)
        connectChatSSE();

        console.log('✅ Chat initialized successfully');
    } catch (err) {
        console.error('❌ Error initializing chat:', err);
    }
}

// ─── SSE Connection ────────────────────────────────────────────────────────────

// ── Handlers forwarded from ChatTransport events ──────────────────────────────
function _handleIncomingMessage(msg) {
    if (!msg) return;
    hideTypingIndicator();
    addMessageToUI(msg);
    chatMessages.push(msg);
    const chatBox = document.getElementById('chatBox');
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
    const input = document.getElementById('chatInput');
    const btn = document.getElementById('sendButton');
    if (!btn) return;

    const hasMessage = !!String(input?.value || '').trim();
    const enabled = hasMessage && !chatSendBusy;
    const color = normalizeHexColor(chatUiSettings.bubbleColor || '') || '#6366f1';

    btn.disabled = !enabled;
    btn.style.opacity = chatSendBusy ? '0.5' : '';
    btn.setAttribute('aria-disabled', enabled ? 'false' : 'true');
    btn.setAttribute('aria-busy', chatSendBusy ? 'true' : 'false');
    btn.style.background = enabled
        ? `linear-gradient(135deg, ${color} 0%, ${toRgba(color, 0.88)} 100%)`
        : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
}

function bindChatInputStateGuards() {
    const input = document.getElementById('chatInput');
    if (!input || input.dataset.sendStateBound === '1') return;

    ['input', 'change', 'keyup', 'paste', 'cut', 'focus', 'blur', 'compositionend'].forEach((eventName) => {
        input.addEventListener(eventName, syncSendButtonState, { passive: true });
    });

    input.dataset.sendStateBound = '1';
    syncSendButtonState();
}

function connectChatSSE() {
    if (!currentChatCode) return;
    const chatBox = document.getElementById('chatBox');
    if (!chatBox || !chatBox.classList.contains('active')) return;
    if (_chatTransport) return; // already connected

    _chatTransport = new ChatTransport({
        sessionId: currentChatCode,
        onMessage: _handleIncomingMessage,
        onSendLock: setSending,
        onStatusChange: function (info) {
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
    if (chatEventSource) { chatEventSource.close(); chatEventSource = null; }
}

function _onTransportTyping(e) {
    try { if (e.detail && e.detail.role === 'admin') showTypingIndicator(`${DEFAULT_CHAT_AGENT_NAME} đang nhập...`); } catch (_) {}
}
function _onTransportStopTyping(e) {
    try { if (e.detail && e.detail.role === 'admin') hideTypingIndicator(); } catch (_) {}
}
function _onTransportOnlineStatus(e) {
    try { if (e.detail && e.detail.role === 'admin') updateAdminOnlineStatus(e.detail.online, e.detail.ts); } catch (_) {}
}
function _onTransportMessageStatus(e) {
    try { if (e.detail) updateMessageStatus(e.detail.messageId, e.detail.status); } catch (_) {}
}

function scheduleMarkSeen() {
    if (!currentChatCode) return;
    clearTimeout(chatMarkSeenTimer);
    chatMarkSeenTimer = setTimeout(() => {
        fetch(`/api/chat/mark-seen/${currentChatCode}`, { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' } }).catch(() => {});
    }, 700);
}

function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
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
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    const current = parseInt(badge.textContent || '0', 10);
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
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ session_code: currentChatCode, role: 'player', typing: true })
        }).catch(() => {});
    }
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        isPlayerTyping = false;
        fetch('/api/chat/typing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ session_code: currentChatCode, role: 'player', typing: false })
        }).catch(() => {});
    }, 2000);
}

function stopPlayerTyping() {
    if (!currentChatCode) return;
    isPlayerTyping = false;
    clearTimeout(typingTimer);
    fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ session_code: currentChatCode, role: 'player', typing: false })
    }).catch(() => {});
}

let _adminOfflineLastSeen = null;
let _adminOfflineTimer = null;

function updateAdminOnlineStatus(online, ts) {
    clearInterval(_adminOfflineTimer);
    _adminOfflineTimer = null;

    const statusDot = document.querySelector('.chat-header .status-dot');
    const statusText = document.querySelector('.chat-header .status-text');
    const avatarStatus = document.getElementById('chatAvatarStatus') || document.querySelector('.chat-header .avatar-status');
    if (statusDot) statusDot.style.background = online ? '#22c55e' : '#9ca3af';
    if (avatarStatus) {
        avatarStatus.style.background = online ? '#22c55e' : '#6b7280';
        avatarStatus.classList.toggle('offline', !online);
    }
    if (online) {
        _adminOfflineLastSeen = null;
        if (statusText) statusText.textContent = 'Đang hoạt động';
    } else {
        _adminOfflineLastSeen = ts || null;
        function refreshOfflineText() {
            if (!statusText) return;
            statusText.textContent = _adminOfflineLastSeen
                ? 'Offline · ' + formatLastSeen(_adminOfflineLastSeen)
                : 'Ngoại tuyến';
        }
        refreshOfflineText();
        _adminOfflineTimer = setInterval(refreshOfflineText, 30000);
    }
}

function formatLastSeen(ts) {
    if (!ts) return '';
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return diff + ' giây trước';
    if (diff < 3600) return Math.floor(diff / 60) + ' phút trước';
    if (diff < 86400) return Math.floor(diff / 3600) + ' giờ trước';
    return Math.floor(diff / 86400) + ' ngày trước';
}

/** Update a sent-message status badge in the UI */
function updateMessageStatus(messageId, status) {
    const statusMap = { sent: '✓ Đã gửi', delivered: '✓✓ Đã nhận', seen: '✓✓ Đã xem' };
    const label = statusMap[status];
    if (!label) return;

    if (messageId) {
        // Update specific message by ID
        const el = document.querySelector(`.message[data-id="${messageId}"] .message-status`);
        if (el) {
            el.textContent = label;
            if (status === 'seen') el.style.color = '#6366f1';
            if (status === 'delivered') el.style.color = '#10b981';
        }
    } else if (status === 'seen') {
        // No specific ID — mark ALL sent (customer) messages as seen
        document.querySelectorAll('.message.sent .message-status').forEach(el => {
            el.textContent = label;
            el.style.color = '#6366f1';
        });
    }
}


function showServerNotification(message, type) {
    if (!message) return;
    const colors = { info: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444' };
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    const color = colors[type] || colors.info;
    const icon = icons[type] || icons.info;

    const toast = document.createElement('div');
    toast.className = 'server-toast-notification';
    toast.style.cssText = 'position:fixed;bottom:90px;right:20px;background:#fff;padding:14px 20px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.18);z-index:99998;display:flex;align-items:center;gap:10px;font-family:Poppins,sans-serif;max-width:340px;animation:slideInRight .3s ease-out;border-left:4px solid ' + color + ';';
    toast.innerHTML = '<span style="font-size:18px;">' + icon + '</span><span style="color:#333;font-weight:500;font-size:13px;">' + (message || '').replace(/</g, '&lt;') + '</span>';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOutRight .3s ease-in forwards';
        setTimeout(() => toast.remove(), 350);
    }, 5000);
}

async function startNewChatSession() {
    try {
        if (currentChatCode) {
            const existing = await loadChatSession(currentChatCode);
            if (existing) return existing;
        }

        const storedCode = String(localStorage.getItem(CHAT_GLOBAL_SESSION_KEY) || '').trim().toUpperCase();
        if (storedCode) {
            const existing = await loadChatSession(storedCode);
            if (existing) return existing;
        }

        const sessionCodeFromUi = String(document.getElementById('chatGameSessionCode')?.value || '').trim().toUpperCase();
        const customerName = String(document.getElementById('chatCustomerName')?.value || 'Khách hàng').trim() || 'Khách hàng';
        const customerPhoneRaw = String(document.getElementById('chatCustomerPhone')?.value || '').trim();
        const customerPhone = customerPhoneRaw.replace(/\D/g, '') || '0000000000';

        if (!sessionCodeFromUi) {
            showServerNotification('Vui lòng nhập mã phiên chơi.', 'warning');
            return null;
        }

        const response = await fetch('/api/chat/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({
                customer_name: customerName,
                customer_phone: customerPhone,
                game_session_code: sessionCodeFromUi,
                topic: `Hỗ trợ phiên ${sessionCodeFromUi}`
            })
        });

        const result = await response.json();
        if (result.success) {
            currentChatSession = result.data;
            currentChatCode = result.data.session_code;
            localStorage.setItem(CHAT_GLOBAL_SESSION_KEY, currentChatCode);
            console.log('✅ New chat session created:', currentChatCode);
            return result.data;
        }
        if (result.code === 'IP_RATE_LIMITED') {
            showServerNotification(result.message || 'Vui lòng đợi trước khi mở phiên chat mới.', 'warning');
            if (result.existing_session_code) {
                return await loadChatSession(result.existing_session_code);
            }
        } else {
            showServerNotification(result.message || 'Không thể tạo phiên chat mới.', 'error');
        }
    } catch (err) {
        console.error('❌ Error starting chat session:', err);
    }
}

async function loadChatSession(sessionCode) {
    try {
        const response = await fetch(`/api/chat/session/${sessionCode}`);
        const result = await response.json();
        
        if (result.success) {
            currentChatSession = result.data.session;
            currentChatCode = sessionCode;
            localStorage.setItem(CHAT_GLOBAL_SESSION_KEY, currentChatCode);
            const unread = result.data.session?.unread_count ?? 0;
            if (unread > 0) {
                const badge = document.getElementById('notificationBadge');
                if (badge) {
                    badge.textContent = unread > 99 ? '99+' : String(unread);
                    badge.classList.add('has-unread');
                }
            }
            console.log('✅ Chat session loaded:', sessionCode);
            return result.data.session;
        }
    } catch (err) {
        console.error('❌ Error loading chat session:', err);
    }
}

async function closeChatSession(satisfaction = null, feedback = null) {
    try {
        if (!currentChatCode) return;

        const response = await fetch(`/api/chat/close/${currentChatCode}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({
                satisfaction: satisfaction,
                feedback: feedback
            })
        });

        const result = await response.json();
        if (result.success) {
            console.log('✅ Chat session closed');
            if (currentChatSession) currentChatSession.status = 'closed';
            showNotification('💬', 'Cảm ơn đã liên hệ chúng tôi!', '#10b981');
            return true;
        }
    } catch (err) {
        console.error('❌ Error closing chat session:', err);
    }
}

async function loadChatMessages() {
    try {
        if (!currentChatCode) return;
        const chatBox = document.getElementById('chatBox');
        if (!chatBox || !chatBox.classList.contains('active')) return;

        const response = await fetch(`/api/chat/messages/${currentChatCode}?limit=${CHAT_INITIAL_MESSAGES_LIMIT}`);
        const result = await response.json();

        if (result.success && result.data) {
            const messagesContainer = document.getElementById('chatMessages');
            if (!messagesContainer) return;

            messagesContainer.innerHTML = '';
            chatMessages = Array.isArray(result.data) ? result.data : [];

            // Progressive append prevents blocking the main thread on large histories.
            if (chatRenderRaf) {
                cancelAnimationFrame(chatRenderRaf);
                chatRenderRaf = 0;
            }
            chatRenderQueue = chatMessages.slice();

            const pump = () => {
                const chunk = chatRenderQueue.splice(0, 18);
                chunk.forEach((msg) => addMessageToUI(msg, { skipScroll: true }));
                if (chatRenderQueue.length > 0) {
                    chatRenderRaf = requestAnimationFrame(pump);
                } else {
                    chatRenderRaf = 0;
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            };

            chatRenderRaf = requestAnimationFrame(pump);
        }
    } catch (err) {
        console.error('❌ Error loading chat messages:', err);
    }
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    if (chatSendBusy) return;

    const message = input.value.trim();
    if (message === '') return;

    if (!currentChatCode) {
        await startNewChatSession();
        connectChatSSE();
    }

    // Stop typing immediately once the message is sent.
    stopPlayerTyping();
    setSending(true);

    try {
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({
                session_code: currentChatCode,
                sender_name: 'Khách hàng',
                sender_type: 'customer',
                message: message,
                message_type: 'text'
            })
        });

        const result = await response.json();
        if (result.success) {
            addMessageToUI(result.data);
            chatMessages.push(result.data);
            input.value = '';
            input.focus();
            syncSendButtonState();
        } else {
            showNotification('❌', result.message || 'Lỗi gửi tin nhắn', '#ef4444');
        }
    } catch (err) {
        console.error('❌ Error sending message:', err);
        showNotification('❌', 'Lỗi gửi tin nhắn', '#ef4444');
    } finally {
        setSending(false);
    }
}

function addMessageToUI(messageData, options = {}) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    const shouldStickBottom = ((messagesContainer.scrollHeight - (messagesContainer.scrollTop + messagesContainer.clientHeight)) <= 120);
    const forceScroll = !!options.forceScroll;
    const skipScroll = !!options.skipScroll;

    const messageDiv = document.createElement('div');
    const isSent = messageData.sender_type === 'customer';
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    if (messageData.id) messageDiv.setAttribute('data-id', messageData.id);

    const time = formatTime(messageData.created_at);

    const messageType = String(messageData.message_type || 'text');
    const attachmentUrl = messageData.attachment_url || '';
    const attachmentType = String(messageData.attachment_type || messageType || '').toLowerCase();
    const attachmentHtml = renderAttachmentHtml(attachmentUrl, attachmentType, messageData.message || 'Tệp đính kèm');

    // Media-only: when message is purely an image, skip the bubble wrapper
    const isMediaOnly = messageType === 'image' && !!attachmentUrl;
    const bubbleCls = isMediaOnly ? 'message-bubble media-only' : 'message-bubble';
    // Customer messages → plain escape; Support/admin messages → allow rich HTML from Tiptap
    const bubbleText = isMediaOnly ? '' : (isSent ? escapeHtml(messageData.message || '') : sanitizeMessageHtml(messageData.message || ''));

    if (isSent) {
        const statusLabel = messageData.is_read ? '✓✓ Đã xem' : '✓ Đã gửi';
        const statusColor = messageData.is_read ? 'color:#6366f1' : '';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-name">Bạn</div>
                <div class="${bubbleCls}">${bubbleText}${attachmentHtml}</div>
                <div class="message-time">${time}<span class="message-status" style="${statusColor}">${statusLabel}</span></div>
            </div>
        `;
    } else {
        const avatar = currentChatSession?.support_agent_avatar || chatUiSettings.adminAvatar || '/images/support-avatar.png';
        // Always use configured admin name — never show raw DB sender_name (prevents "AD" etc.)
        const senderName = DEFAULT_CHAT_AGENT_NAME;

        messageDiv.innerHTML = `
            <div class="message-avatar"><img src="${avatar}" alt="${senderName}" onerror="this.src='https://ui-avatars.com/api/?name=TV&background=6366f1&color=fff&size=40'"></div>
            <div class="message-content">
                <div class="message-name">${escapeHtml(senderName)}</div>
                <div class="${bubbleCls}">${bubbleText}${attachmentHtml}</div>
                <div class="message-time">${time}<span class="message-status">✓ Đã xem</span></div>
            </div>
        `;
    }

    messagesContainer.appendChild(messageDiv);
    if (!skipScroll && (forceScroll || shouldStickBottom)) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

async function addBotResponse(userMessage) {
    try {
        const responses = getSmartResponse(userMessage);
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        
        const response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({
                session_code: currentChatCode,
                sender_name: DEFAULT_CHAT_AGENT_NAME,
                sender_type: 'support',
                message: randomResponse,
                message_type: 'text'
            })
        });

        const result = await response.json();
        if (result.success) {
            addMessageToUI(result.data);
        }
    } catch (err) {
        console.error('❌ Error sending bot response:', err);
    }
}

function getSmartResponse(message) {
    const msg = (message || '').toLowerCase();

    
    if (msg.match(/^(xin chào|chào|hello|hi|hey)/i)) {
        return [
            'Xin chào! Rất vui được hỗ trợ bạn hôm nay. Bạn cần giúp đỡ gì nhé? 😊',
            'Chào bạn! Tôi có thể giúp gì cho bạn? ✨',
            'Hi! Chào mừng bạn đến với dịch vụ hỗ trợ của chúng tôi! 👋'
        ];
    }

    
    if (msg.match(/(giúp|hỗ trợ|support|help|bạn làm gì)/i)) {
        return [
            'Tôi sẵn sàng hỗ trợ bạn! Bạn đang gặp vấn đề gì? 🤝',
            'Đừng lo, tôi ở đây để giúp bạn! Hãy cho tôi biết chi tiết nhé.',
            'Tôi luôn sẵn sàng! Bạn cần hỗ trợ về vấn đề nào? 💪'
        ];
    }

    
    if (msg.match(/(game|chơi|phiên|mã|quà|thưởng|prize|phần thưởng)/i)) {
        return [
            'Về trò chơi, bạn đã có mã phiên chơi chưa? Hãy nhập mã để bắt đầu nhé! 🎮',
            'Để tham gia, bạn cần nhập mã phiên chơi. Bạn đã có mã chưa? 🎁',
            'Hệ thống đang hoạt động tốt! Bạn có thể nhập mã và chọn hộp quà của mình! ✨',
            'Mỗi hộp quà đều chứa phần thưởng đặc biệt! Chúc bạn may mắn! 🍀'
        ];
    }

    
    if (msg.match(/(rút tiền|payment|withdraw|tài khoản|balance|số dư)/i)) {
        return [
            'Để rút tiền, vui lòng nhập số tiền cần rút và chọn phương thức. Bạn cần hỗ trợ gì? 💰',
            'Chúng tôi hỗ trợ rút tiền qua ngân hàng, MoMo, ZaloPay. Chọn phương thức nào nhé? 🏦',
            'Tôi có thể giúp bạn rút tiền! Bạn muốn rút bao nhiêu? 💸'
        ];
    }

    
    if (msg.match(/(cảm ơn|thank|cám ơn|thanks|khỏe|ổn)/i)) {
        return [
            'Không có gì! Rất vui được hỗ trợ bạn! 😊',
            'Luôn sẵn lòng giúp đỡ! Chúc bạn một ngày tốt lành! ✨',
            'Hân hạnh được phục vụ! Nếu cần gì cứ nhắn nhé! 🌟'
        ];
    }

    
    return [
        'Cảm ơn bạn đã liên hệ! Tôi đã ghi nhận yêu cầu của bạn. 📝',
        'Để tôi kiểm tra thông tin cho bạn nhé! Vui lòng đợi trong giây lát. ⏳',
        'Tôi hiểu rồi! Bạn có thể cung cấp thêm thông tin chi tiết không? 🔍',
        'Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7! Bạn cần gì khác không? 💬',
        'Rất vui được trò chuyện với bạn! Có gì thắc mắc cứ hỏi nhé! 😊',
        'Xin lỗi nếu tôi chưa hiểu rõ! Bạn có thể diễn đạt lại được không? 👂'
    ];
}

function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    const chatIcon = document.getElementById('chatFloatIcon');
    const badge = document.getElementById('notificationBadge');

    if (!chatBox) return;

    if (chatBox.classList.contains('active')) {
        chatBox.classList.remove('active');
        if (chatIcon) chatIcon.style.transform = 'scale(1)';
        disconnectChatSSE();
    } else {
        chatBox.classList.add('active');
        if (chatIcon) chatIcon.style.transform = 'scale(0.9)';
        if (badge) { badge.classList.remove('has-unread'); badge.textContent = '0'; }
        // Reset tab title blink when customer opens chat
        if (window.tabNotification) tabNotification.resetBadge();

        
        if (!currentChatCode) {
            initializeChat().finally(() => {
                window.dispatchEvent(new CustomEvent('chat:opened', { detail: { sessionCode: currentChatCode || null } }));
            });
        } else {
            connectChatSSE();
            window.dispatchEvent(new CustomEvent('chat:opened', { detail: { sessionCode: currentChatCode } }));
        }

        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
        syncSendButtonState();
    }
}

function showTypingIndicator(label = 'Đang nhập tin nhắn...') {
    const typingDiv = document.getElementById('chatTyping');
    const typingText = document.querySelector('#chatTyping .typing-text');
    if (typingDiv) {
        typingDiv.style.display = 'flex';
        isTyping = true;
    }
    if (typingText) {
        typingText.textContent = label;
    }
}

function hideTypingIndicator() {
    const typingDiv = document.getElementById('chatTyping');
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
    const input = document.getElementById('chatInput');
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
    const nextHeight = Math.min(inputEl.scrollHeight, 120);
    inputEl.style.height = `${Math.max(42, nextHeight)}px`;
}

function handleAttachment() {
    const input = document.getElementById('chatAttachmentInput');
    if (input) input.click();
}

function handleImage() {
    const input = document.getElementById('chatImageInput');
    if (input) input.click();
}

async function handleAttachmentSelected(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    await uploadAndSendAttachment(file, 'file');
    event.target.value = '';
}

async function handleImageSelected(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    await uploadAndSendAttachment(file, 'image');
    event.target.value = '';
}

async function uploadAndSendAttachment(file, forcedType) {
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
        showNotification('⚠️', 'Tệp vượt quá 20MB. Vui lòng chọn tệp nhỏ hơn.', '#ef4444');
        return;
    }

    try {
        if (!currentChatCode) {
            await startNewChatSession();
        }
        if (!currentChatCode) {
            showNotification('❌', 'Không thể tạo phiên chat.', '#ef4444');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const uploadResp = await fetch('/api/files', {
            method: 'POST',
            body: formData
        });
        const uploadRs = await uploadResp.json();
        if (!uploadResp.ok || !uploadRs.success || !uploadRs.data?.url) {
            throw new Error(uploadRs.message || 'Tải tệp thất bại');
        }

        const isImage = forcedType === 'image' || (file.type || '').startsWith('image/');
        const messageType = isImage ? 'image' : 'file';
        const messageText = isImage ? `🖼️ ${file.name}` : `📎 ${file.name}`;

        const sendResp = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
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

        const sendRs = await sendResp.json();
        if (!sendResp.ok || !sendRs.success || !sendRs.data) {
            throw new Error(sendRs.message || 'Gửi tệp thất bại');
        }

        addMessageToUI(sendRs.data);
        showNotification(isImage ? '🖼️' : '📎', 'Đã gửi đính kèm thành công', '#10b981');
    } catch (err) {
        console.error('❌ Error uploading attachment:', err);
        showNotification('❌', err.message || 'Không thể gửi đính kèm', '#ef4444');
    }
}

function handleEmoji() {
    const emojis = ['😊', '❤️', '👍', '🎉', '😂', '🔥', '✨', '🎁', '👏', '💯'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const input = document.getElementById('chatInput');
    if (input) {
        input.value += randomEmoji;
        input.focus();
        handleInputChange();
    }
}

function toggleChatQRPanel() {
    const panel = document.getElementById('chatQRPanel');
    if (!panel) return;
    const open = panel.getAttribute('data-open') === '1';
    panel.setAttribute('data-open', open ? '0' : '1');
    panel.style.display = open ? 'none' : 'block';
    if (!open) {
        // Populate bank select if empty
        const sel = document.getElementById('chatQRBankSelect');
        if (sel && sel.options.length <= 1) _populateChatQRBanks(sel);
    }
}

function _populateChatQRBanks(sel) {
    const banks = [
        { bin: '970436', name: 'Vietcombank' }, { bin: '970407', name: 'Techcombank' },
        { bin: '970422', name: 'MB Bank' }, { bin: '970415', name: 'VietinBank' },
        { bin: '970405', name: 'Agribank' }, { bin: '970432', name: 'VPBank' },
        { bin: '970423', name: 'TPBank' }, { bin: '970418', name: 'BIDV' },
        { bin: '970426', name: 'MSB' }, { bin: '970448', name: 'OCB' },
        { bin: '970452', name: 'Vietbank' }, { bin: '970443', name: 'SHB' },
        { bin: '970403', name: 'Sacombank' }, { bin: '970416', name: 'ACB' },
        { bin: '796500', name: 'MoMo' }, { bin: '985800', name: 'ZaloPay' }
    ];
    banks.forEach(b => {
        const o = document.createElement('option');
        o.value = b.bin; o.textContent = b.name;
        sel.appendChild(o);
    });
}

async function sendChatQRPayment() {
    const bin = document.getElementById('chatQRBankSelect')?.value || '';
    const acct = (document.getElementById('chatQRAccount')?.value || '').trim();
    const name = (document.getElementById('chatQRName')?.value || '').trim().toUpperCase();
    const amount = (document.getElementById('chatQRAmount')?.value || '').trim();
    const content = (document.getElementById('chatQRContent')?.value || '').trim().toUpperCase();

    if (!bin || !acct || !name || !amount) {
        showNotification('⚠️', 'Vui lòng điền đầy đủ thông tin ngân hàng', '#f59e0b');
        return;
    }

    const qrUrl = `https://img.vietqr.io/image/${bin}-${encodeURIComponent(acct)}-compact2.png?amount=${encodeURIComponent(amount)}&addInfo=${encodeURIComponent(content || 'Chuyen khoan')}&accountName=${encodeURIComponent(name)}`;

    if (!currentChatCode) {
        await startNewChatSession();
        connectChatSSE();
    }

    try {
        const resp = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({
                session_code: currentChatCode,
                sender_name: 'Khách hàng',
                sender_type: 'customer',
                message: `QR thanh toán: ${acct}`,
                message_type: 'image',
                attachment_url: qrUrl,
                attachment_type: 'image/png'
            })
        });
        const rs = await resp.json();
        if (rs.success) {
            addMessageToUI(rs.data);
            chatMessages.push(rs.data);
            toggleChatQRPanel();
            showNotification('💳', 'Đã gửi mã QR thanh toán', '#10b981');
        }
    } catch (err) {
        showNotification('❌', 'Không thể gửi QR', '#ef4444');
    }
}

function handleSticker() {
    showNotification('✨', 'Tính năng sticker sẽ sớm có!', '#8b5cf6');
}

function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Sanitize rich-text HTML from the admin Tiptap editor before rendering.
 * Allows: b, i, u, strong, em, span (color/font-size style only), br, p, div.
 * Falls back to escaped plain text if no HTML tags are detected.
 */
function sanitizeMessageHtml(raw) {
    const text = String(raw || '');
    if (!text) return '';
    if (!/<[a-z][\s\S]*?>/i.test(text)) {
        return escapeHtml(text).replace(/\n/g, '<br>');
    }
    const ALLOWED = new Set(['b','i','u','strong','em','span','br','p','div','ol','ul','li']);
    const tmp = document.createElement('div');
    tmp.innerHTML = text;
    (function clean(node) {
        Array.from(node.childNodes).forEach(function(child) {
            if (child.nodeType === 3) return;
            if (child.nodeType !== 1) { child.remove(); return; }
            var tag = child.tagName.toLowerCase();
            if (!ALLOWED.has(tag)) {
                while (child.firstChild) node.insertBefore(child.firstChild, child);
                child.remove(); return;
            }
            Array.from(child.attributes).forEach(function(attr) {
                if (tag === 'span' && attr.name === 'style') {
                    child.setAttribute('style',
                        attr.value.split(';')
                            .filter(function(s) { return /^\s*(color|font-size)\s*:/i.test(s); })
                            .join(';')
                    );
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
    const safeUrl = String(url || '').trim();
    if (!safeUrl) return '';

    const safeLabel = escapeHtml(label || 'Tệp đính kèm');
    const normalizedType = String(type || '').toLowerCase();
    const isImage = normalizedType.includes('image') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(safeUrl);
    if (isImage) {
        return `<div class="message-attachment"><img src="${safeUrl}" alt="${safeLabel}" loading="lazy"></div>`;
    }
    return `<div class="message-attachment"><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">📎 ${safeLabel}</a></div>`;
}

function showNotification(icon, message, color) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 100000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Poppins', sans-serif;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <span style="font-size: 20px;">${icon}</span>
        <span style="color: #333; font-weight: 500;">${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function setupMessagePolling() {
    // Polling replaced by SSE EventSource — this function is intentionally empty.
    // Keep the call site in initializeChat for backward compatibility.
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Inject server toast CSS animations
        injectServerToastCSS();
        const input = document.getElementById('chatInput');
        if (input) autoResizeChatInput(input);
        bindChatInputStateGuards();
    });
} else {
    injectServerToastCSS();
    const input = document.getElementById('chatInput');
    if (input) autoResizeChatInput(input);
    bindChatInputStateGuards();
}

// Cleanup transport when user navigates away or closes the tab.
// 'pagehide' fires more reliably than 'beforeunload' on iOS Safari (BFCache).
window.addEventListener('pagehide', function () { disconnectChatSSE(); }, { once: true });

function injectServerToastCSS() {
    if (document.getElementById('serverToastCSS')) return;
    const style = document.createElement('style');
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
        initializeChat,
        toggleChat,
        sendMessage,
        handleKeyPress,
        handleInputChange,
        handleAttachment,
        handleImage,
        handleEmoji,
        toggleChatQRPanel,
        sendChatQRPayment,
        handleAttachmentSelected,
        handleImageSelected,
        closeChatSession,
        requestPushPermission
    });
}
