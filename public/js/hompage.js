
let chatMessages = [];
let isTyping = false;

function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    const chatIcon = document.getElementById('chatFloatIcon');
    const badge = document.getElementById('notificationBadge');
    
    if (chatBox.classList.contains('active')) {
        chatBox.classList.remove('active');
        chatIcon.style.transform = 'scale(1)';
    } else {
        chatBox.classList.add('active');
        chatIcon.style.transform = 'scale(0.9)';
        
        
        if (badge) {
            badge.style.display = 'none';
        }
        
        
        setTimeout(() => {
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    
    addMessage(message, 'sent');
    
    
    input.value = '';
    
    
    showTypingIndicator();
    
    
    setTimeout(() => {
        hideTypingIndicator();
        addBotResponse(message);
    }, 1500 + Math.random() * 1000);
}

function addMessage(text, type = 'received', name = 'Bạn', avatar = null) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const time = getCurrentTime();
    
    if (type === 'sent') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-name">${name}</div>
                <div class="message-bubble">${escapeHtml(text)}</div>
                <div class="message-time">
                    ${time}
                    <span class="message-status">Đã gửi</span>
                </div>
            </div>
        `;
    } else {
        const avatarUrl = avatar || 'https://i.pravatar.cc/40?img=5';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${avatarUrl}" alt="${name}">
            </div>
            <div class="message-content">
                <div class="message-name">${name}</div>
                <div class="message-bubble">${escapeHtml(text)}</div>
                <div class="message-time">
                    ${time}
                    <span class="message-status">Đã xem</span>
                </div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    
    
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
    
    
    chatMessages.push({
        text,
        type,
        time,
        name
    });
}

function showTypingIndicator() {
    const typingDiv = document.getElementById('chatTyping');
    if (typingDiv) {
        typingDiv.style.display = 'flex';
        isTyping = true;
    }
}

function hideTypingIndicator() {
    const typingDiv = document.getElementById('chatTyping');
    if (typingDiv) {
        typingDiv.style.display = 'none';
        isTyping = false;
    }
}

function addBotResponse(userMessage) {
    const responses = getSmartResponse(userMessage);
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    addMessage(randomResponse, 'received', 'Hồng Ngọc');
}

function getSmartResponse(message) {
    const msg = message.toLowerCase();
    
    
    if (msg.match(/^(xin chào|chào|hello|hi|hey)/i)) {
        return [
            'Xin chào! Rất vui được hỗ trợ bạn hôm nay. Bạn cần giúp đỡ gì nhé? 😊',
            'Chào bạn! Tôi có thể giúp gì cho bạn? ✨',
            'Hi! Chào mừng bạn đến với dịch vụ hỗ trợ của chúng tôi! 👋'
        ];
    }
    
    
    if (msg.match(/(giúp|hỗ trợ|support|help)/i)) {
        return [
            'Tôi sẵn sàng hỗ trợ bạn! Bạn đang gặp vấn đề gì? 🤝',
            'Đừng lo, tôi ở đây để giúp bạn! Hãy cho tôi biết chi tiết nhé.',
            'Tôi luôn sẵn sàng! Bạn cần hỗ trợ về vấn đề nào? 💪'
        ];
    }
    
    
    if (msg.match(/(game|chơi|phiên|mã)/i)) {
        return [
            'Về trò chơi, bạn đã có mã phiên chơi chưa? Hãy nhập mã để bắt đầu nhé! 🎮',
            'Để tham gia, bạn cần nhập mã phiên chơi ở ô bên trên. Bạn đã có mã chưa? 🎁',
            'Hệ thống đang hoạt động tốt! Bạn có thể nhập mã và chọn hộp quà của mình! ✨'
        ];
    }
    
    
    if (msg.match(/(quà|thưởng|prize|gift|nhận)/i)) {
        return [
            'Các phần thưởng bao gồm VIP, Lucky và nhiều ưu đãi khác! Hãy thử vận may của bạn! 🎁',
            'Bạn có cơ hội nhận được nhiều phần quà hấp dẫn! Chọn hộp quà yêu thích nhé! 🎉',
            'Mỗi hộp quà đều chứa phần thưởng đặc biệt! Chúc bạn may mắn! 🍀'
        ];
    }
    
    
    if (msg.match(/(cảm ơn|thank|cám ơn|thanks)/i)) {
        return [
            'Không có gì! Rất vui được hỗ trợ bạn! 😊',
            'Luôn sẵn lòng giúp đỡ! Chúc bạn một ngày tốt lành! ✨',
            'Hân hạnh được phục vụ! Nếu cần gì cứ nhắn nhé! 🌟'
        ];
    }
    
    
    if (msg.match(/(khỏe|thế nào|how are you|ok|ổn)/i)) {
        return [
            'Tôi rất khỏe, cảm ơn bạn! Bạn thì sao? 😊',
            'Tuyệt vời! Tôi luôn sẵn sàng hỗ trợ bạn! 💫',
            'Tôi vẫn ổn! Cảm ơn bạn đã hỏi thăm! 🌸'
        ];
    }
    
    
    return [
        'Cảm ơn bạn đã liên hệ! Tôi đã ghi nhận yêu cầu của bạn. 📝',
        'Để tôi kiểm tra thông tin cho bạn nhé! Vui lòng đợi trong giây lát. ⏳',
        'Tôi hiểu rồi! Bạn có thể cung cấp thêm thông tin chi tiết không? 🔍',
        'Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7! Bạn cần gì khác không? 💬',
        'Rất vui được trò chuyện với bạn! Có gì thắc mắc cứ hỏi nhé! 😊'
    ];
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function handleInputChange() {
    const input = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    
    if (input.value.trim() !== '') {
        sendButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else {
        sendButton.style.background = 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
    }
}

function handleAttachment() {
    showNotification('📎', 'Tính năng đính kèm file sẽ sớm có!', '#3b82f6');
}

function handleImage() {
    showNotification('🖼️', 'Tính năng gửi hình ảnh sẽ sớm có!', '#ec4899');
}

function handleEmoji() {
    const emojis = ['😊', '❤️', '👍', '🎉', '😂', '🔥', '✨', '🎁'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const input = document.getElementById('chatInput');
    input.value += randomEmoji;
    input.focus();
}

function handleSticker() {
    showNotification('✨', 'Tính năng sticker sẽ sớm có!', '#8b5cf6');
}

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function startGame() {
    const versionCode = document.getElementById('version-code').value.trim();
    
    if (versionCode === '') {
        showNotification('⚠️', 'Vui lòng nhập mã phiên chơi!', '#f59e0b');
        return;
    }
    
    
    const button = document.querySelector('.start-button');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    showNotification('✅', 'Trò chơi đã bắt đầu! Hãy chọn một hộp quà.', '#10b981');
}

function selectGift(type) {
    const gifts = {
        vip: {
            icon: '👑',
            title: 'Chúc mừng! Bạn đã nhận VIP!',
            message: 'Bạn đã trúng phần thưởng VIP đặc biệt!'
        },
        lucky: {
            icon: '🍀',
            title: 'May mắn!',
            message: 'Bạn đã nhận được phần thưởng may mắn!'
        },
        again: {
            icon: '🔄',
            title: 'Thử lại nhé!',
            message: 'Chúc bạn may mắn lần sau!'
        }
    };
    
    const selectedGift = gifts[type];
    
    
    const giftOptions = document.querySelectorAll('.gift-option');
    giftOptions.forEach(option => {
        option.style.transform = 'scale(0.95)';
        option.style.opacity = '0.5';
    });
    
    setTimeout(() => {
        showResult(selectedGift.icon, selectedGift.title, selectedGift.message);
        
        
        giftOptions.forEach(option => {
            option.style.transform = 'scale(1)';
            option.style.opacity = '1';
        });
    }, 500);
}

function showResult(icon, title, message) {
    const modal = document.getElementById('resultModal');
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    
    resultIcon.textContent = icon;
    resultTitle.textContent = title;
    resultMessage.textContent = message;
    
    modal.classList.add('active');
    
    
    createConfetti();
}

function closeResult() {
    const modal = document.getElementById('resultModal');
    modal.classList.remove('active');
}

function createConfetti() {
    const colors = ['#7c3aed', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.opacity = '1';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        
        const duration = Math.random() * 3 + 2;
        const xMovement = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(${xMovement}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}

function showNotification(icon, message, color) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'white';
    notification.style.padding = '16px 24px';
    notification.style.borderRadius = '12px';
    notification.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.zIndex = '10000';
    notification.style.animation = 'slideInRight 0.3s ease-out';
    notification.style.borderLeft = `4px solid ${color}`;
    
    notification.innerHTML = `
        <span style="font-size: 1.5rem;">${icon}</span>
        <span style="color: #1f2937; font-weight: 600;">${message}</span>
    `;
    
    
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function toggleAdventure() {
    showNotification('🎮', 'Cuộc phiêu lưu sắp bắt đầu!', '#7c3aed');
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('resultModal');
    if (e.target === modal) {
        closeResult();
    }
});

window.addEventListener('load', () => {
    
    const giftModal = document.querySelector('.gift-modal');
    giftModal.style.opacity = '0';
    giftModal.style.transform = 'translateY(30px) scale(0.9)';
    
    setTimeout(() => {
        giftModal.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        giftModal.style.opacity = '1';
        giftModal.style.transform = 'translateY(0) scale(1)';
    }, 100);
    
    
    const giftOptions = document.querySelectorAll('.gift-option');
    giftOptions.forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
});

let titleClickCount = 0;
document.querySelector('.title')?.addEventListener('click', () => {
    titleClickCount++;
    if (titleClickCount === 5) {
        createConfetti();
        showNotification('🎉', 'Bạn đã tìm thấy easter egg!', '#ec4899');
        titleClickCount = 0;
    }
});