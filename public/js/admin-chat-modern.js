// ==================== ADMIN CHAT MODERN MODULE ====================

const adminChatModern = {
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

    init: () => {
        adminChatModern.setupWidgetButton();
        adminChatModern.setupUI();
        adminChatModern.setupEventListeners();
        adminChatModern.bindRealtimeRefreshTriggers();
        adminChatModern.connectRealtime();
        adminChatModern.fetchMessages();
    },

    setupWidgetButton: () => {
        const chatWidget = document.createElement('div');
        chatWidget.id = 'chatWidgetButton';
        chatWidget.className = 'chat-widget-button';
        chatWidget.innerHTML = `
            <button class="chat-widget-btn" title="Open Chat">
                <i class="fas fa-comments"></i>
                <span class="chat-unread-badge" id="chatUnreadBadge" style="display: none;">0</span>
            </button>
        `;
        document.body.appendChild(chatWidget);

        const btn = chatWidget.querySelector('.chat-widget-btn');
        btn.addEventListener('click', () => {
            adminChatModern.toggleChat();
        });
    },

    setupUI: () => {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'adminChatModernContainer';
        chatContainer.className = 'chat-modern-container';
        chatContainer.innerHTML = `
            <div class="chat-modern-wrapper">
                <div class="chat-modern-header">
                    <div class="chat-modern-title">
                        <i class="fas fa-comments"></i>
                        <span>Admin Chat</span>
                    </div>
                    <div class="chat-modern-controls">
                        <button class="chat-control-btn" id="chatMinimizeBtn" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="chat-control-btn" id="chatCloseBtn" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="chat-modern-messages" id="chatModernMessages"></div>
                <div class="chat-modern-input-area">
                    <input type="text" id="chatModernInput" placeholder="Type message..." class="chat-modern-input">
                    <button class="chat-modern-send-btn" id="chatModernSendBtn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(chatContainer);
    },

    setupEventListeners: () => {
        const sendBtn = document.getElementById('chatModernSendBtn');
        const input = document.getElementById('chatModernInput');
        const closeBtn = document.getElementById('chatCloseBtn');
        const minimizeBtn = document.getElementById('chatMinimizeBtn');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => adminChatModern.sendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    adminChatModern.sendMessage();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => adminChatModern.closeChat());
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => adminChatModern.minimizeChat());
        }
    },

    toggleChat: () => {
        adminChatModern.isOpen ? adminChatModern.closeChat() : adminChatModern.openChat();
    },

    openChat: () => {
        const container = document.getElementById('adminChatModernContainer');
        if (container) {
            container.classList.add('active');
        }
        adminChatModern.isOpen = true;
        adminChatModern.unreadCount = 0;
        adminChatModern.renderUnreadBadge();
        adminChatModern.fetchMessages();
    },

    closeChat: () => {
        const container = document.getElementById('adminChatModernContainer');
        if (container) {
            container.classList.remove('active');
        }
        adminChatModern.isOpen = false;
    },

    minimizeChat: () => {
        const container = document.getElementById('adminChatModernContainer');
        if (container) {
            container.classList.toggle('minimized');
        }
    },

    fetchMessages: async () => {
        if (adminChatModern.isFetching) return;
        adminChatModern.isFetching = true;

        try {
            const response = await fetch('/api/admin/chat/messages');
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                adminChatModern.messages = result.data;
                adminChatModern.renderMessages();
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            adminChatModern.isFetching = false;
        }
    },

    renderMessages: () => {
        const messagesContainer = document.getElementById('chatModernMessages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = adminChatModern.messages.map(msg => {
            const isOwn = msg.sender_id === adminChatModern.currentUserId;
            const timestamp = new Date(msg.created_at).toLocaleTimeString('vi-VN');

            return `
                <div class="chat-modern-message ${isOwn ? 'own' : 'other'}">
                    <div class="modern-message-content">
                        <p class="modern-message-text">${adminChatModern.escapeHtml(msg.message)}</p>
                        <span class="modern-message-time">${timestamp}</span>
                    </div>
                </div>
            `;
        }).join('');

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    sendMessage: async () => {
        const input = document.getElementById('chatModernInput');
        const message = input.value.trim();

        if (!message) {
            if (typeof toast !== 'undefined') {
                toast.warning('Please enter a message');
            }
            return;
        }

        try {
            const response = await fetch('/api/admin/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            const result = await response.json();

            if (result.success) {
                input.value = '';
                adminChatModern.fetchMessages();
                window.dispatchEvent(new CustomEvent('admin:chat:messages-changed'));
            } else {
                if (typeof toast !== 'undefined') {
                    toast.error(result.message || 'Failed to send message');
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Connection error');
            }
        }
    },

    bindRealtimeRefreshTriggers: () => {
        if (adminChatModern.hasBoundRealtimeTriggers) return;
        adminChatModern.hasBoundRealtimeTriggers = true;

        window.addEventListener('admin:chat:messages-changed', () => {
            if (!adminChatModern.isOpen) {
                adminChatModern.unreadCount += 1;
                adminChatModern.renderUnreadBadge();
            }
            if (adminChatModern.isOpen) adminChatModern.fetchMessages();
        });

        window.addEventListener('focus', () => {
            if (adminChatModern.isOpen) adminChatModern.fetchMessages();
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && adminChatModern.isOpen) adminChatModern.fetchMessages();
        });
    },

    connectRealtime: () => {
        if (adminChatModern.sseSource) return;
        try {
            const src = new EventSource('/api/chat/events/admin');
            adminChatModern.sseSource = src;

            src.addEventListener('open', () => {
                adminChatModern.sseConnected = true;
                adminChatModern.sseReconnectDelayMs = 1200;
            });

            const handleRealtimeChange = () => {
                window.dispatchEvent(new CustomEvent('admin:chat:messages-changed'));
            };

            src.addEventListener('new_message', handleRealtimeChange);
            src.addEventListener('chat_message', handleRealtimeChange);
            src.addEventListener('admin_message', handleRealtimeChange);
            src.addEventListener('message_edited', handleRealtimeChange);

            src.onerror = () => {
                adminChatModern.sseConnected = false;
                adminChatModern.closeRealtime();
                adminChatModern.scheduleRealtimeReconnect();
            };
        } catch (err) {
            console.error('adminChatModern SSE init failed:', err);
            adminChatModern.scheduleRealtimeReconnect();
        }
    },

    closeRealtime: () => {
        if (adminChatModern.sseSource) {
            adminChatModern.sseSource.close();
            adminChatModern.sseSource = null;
        }
    },

    scheduleRealtimeReconnect: () => {
        if (adminChatModern.sseReconnectTimer) return;
        const delay = Math.min(12000, Math.max(800, Number(adminChatModern.sseReconnectDelayMs || 1200)));
        adminChatModern.sseReconnectTimer = setTimeout(() => {
            adminChatModern.sseReconnectTimer = null;
            adminChatModern.sseReconnectDelayMs = Math.min(12000, delay * 1.8);
            adminChatModern.connectRealtime();
        }, delay);
    },

    renderUnreadBadge: () => {
        const badge = document.getElementById('chatUnreadBadge');
        if (!badge) return;
        const count = Math.max(0, Number(adminChatModern.unreadCount || 0));
        if (count > 0) {
            badge.style.display = 'inline-flex';
            badge.textContent = count > 99 ? '99+' : String(count);
        } else {
            badge.style.display = 'none';
            badge.textContent = '0';
        }
    },

    escapeHtml: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        adminChatModern.init();
    });
} else {
    adminChatModern.init();
}
