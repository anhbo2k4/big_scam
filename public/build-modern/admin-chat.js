// ==================== ADMIN CHAT MODULE ====================

const adminChat = {
    messages: [],
    currentUserId: null,
    isFetching: false,
    hasBoundRealtimeTriggers: false,
    sseSource: null,
    sseReconnectTimer: null,
    sseReconnectDelayMs: 1200,
    sseConnected: false,

    init: () => {
        adminChat.setupUI();
        adminChat.setupEventListeners();
        adminChat.bindRealtimeRefreshTriggers();
        adminChat.connectRealtime();
        adminChat.fetchMessages();
    },

    setupUI: () => {
        const chatContainer = document.getElementById('adminChatContainer');
        if (!chatContainer) return;

        chatContainer.innerHTML = `
            <div class="chat-wrapper">
                <div class="chat-header">
                    <h3><i class="fas fa-comments"></i> Admin Chat</h3>
                    <button class="chat-close-btn" id="chatCloseBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chat-messages" id="chatMessages"></div>
                <div class="chat-input-area">
                    <input type="text" id="chatInput" placeholder="Type your message..." class="chat-input">
                    <button class="chat-send-btn" id="chatSendBtn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
    },

    setupEventListeners: () => {
        const chatSendBtn = document.getElementById('chatSendBtn');
        const chatInput = document.getElementById('chatInput');
        const chatCloseBtn = document.getElementById('chatCloseBtn');

        if (chatSendBtn) {
            chatSendBtn.addEventListener('click', () => adminChat.sendMessage());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    adminChat.sendMessage();
                }
            });
        }

        if (chatCloseBtn) {
            chatCloseBtn.addEventListener('click', () => adminChat.close());
        }
    },

    fetchMessages: async () => {
        if (adminChat.isFetching) return;
        adminChat.isFetching = true;

        try {
            const response = await fetch('/api/admin/chat/messages');
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                adminChat.messages = result.data;
                adminChat.renderMessages();
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            adminChat.isFetching = false;
        }
    },

    renderMessages: () => {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = adminChat.messages.map(msg => {
            const isOwn = msg.sender_id === adminChat.currentUserId;
            const timestamp = new Date(msg.created_at).toLocaleTimeString('vi-VN');

            return `
                <div class="chat-message ${isOwn ? 'own' : 'other'}">
                    <div class="message-content">
                        <p class="message-text">${adminChat.escapeHtml(msg.message)}</p>
                        <span class="message-time">${timestamp}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Auto-scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    sendMessage: async () => {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();

        if (!message) {
            toast.warning('Please enter a message');
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
                chatInput.value = '';
                adminChat.fetchMessages();
                window.dispatchEvent(new CustomEvent('admin:chat:messages-changed'));
            } else {
                toast.error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Connection error');
        }
    },

    bindRealtimeRefreshTriggers: () => {
        if (adminChat.hasBoundRealtimeTriggers) return;
        adminChat.hasBoundRealtimeTriggers = true;

        window.addEventListener('admin:chat:messages-changed', () => {
            adminChat.fetchMessages();
        });

        window.addEventListener('focus', () => {
            adminChat.fetchMessages();
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) adminChat.fetchMessages();
        });
    },

    connectRealtime: () => {
        if (adminChat.sseSource) return;
        try {
            const src = new EventSource('/api/chat/events/admin');
            adminChat.sseSource = src;

            src.addEventListener('open', () => {
                adminChat.sseConnected = true;
                adminChat.sseReconnectDelayMs = 1200;
            });

            const handleRealtimeChange = () => {
                window.dispatchEvent(new CustomEvent('admin:chat:messages-changed'));
            };

            src.addEventListener('new_message', handleRealtimeChange);
            src.addEventListener('chat_message', handleRealtimeChange);
            src.addEventListener('admin_message', handleRealtimeChange);
            src.addEventListener('message_edited', handleRealtimeChange);

            src.onerror = () => {
                adminChat.sseConnected = false;
                adminChat.closeRealtime();
                adminChat.scheduleRealtimeReconnect();
            };
        } catch (err) {
            console.error('adminChat SSE init failed:', err);
            adminChat.scheduleRealtimeReconnect();
        }
    },

    closeRealtime: () => {
        if (adminChat.sseSource) {
            adminChat.sseSource.close();
            adminChat.sseSource = null;
        }
    },

    scheduleRealtimeReconnect: () => {
        if (adminChat.sseReconnectTimer) return;
        const delay = Math.min(12000, Math.max(800, Number(adminChat.sseReconnectDelayMs || 1200)));
        adminChat.sseReconnectTimer = setTimeout(() => {
            adminChat.sseReconnectTimer = null;
            adminChat.sseReconnectDelayMs = Math.min(12000, delay * 1.8);
            adminChat.connectRealtime();
        }, delay);
    },

    close: () => {
        const chatContainer = document.getElementById('adminChatContainer');
        if (chatContainer) {
            chatContainer.style.display = 'none';
        }
    },

    open: () => {
        const chatContainer = document.getElementById('adminChatContainer');
        if (chatContainer) {
            chatContainer.style.display = 'block';
        }
        adminChat.fetchMessages();
    },

    escapeHtml: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize admin chat when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('adminChatContainer')) {
            adminChat.init();
        }
    });
} else {
    if (document.getElementById('adminChatContainer')) {
        adminChat.init();
    }
}
