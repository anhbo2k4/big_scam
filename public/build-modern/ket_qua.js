
function createStars() {
    const starsContainer = document.getElementById('bgStars');
    
    
    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }

    
    const giftEmojis = ['🎁', '🎀', '⭐', '✨', '💫'];
    for (let i = 0; i < 6; i++) {
        const gift = document.createElement('div');
        gift.className = 'floating-gift';
        gift.textContent = giftEmojis[Math.floor(Math.random() * giftEmojis.length)];
        gift.style.left = Math.random() * 100 + '%';
        gift.style.top = Math.random() * 100 + '%';
        gift.style.animationDelay = Math.random() * 8 + 's';
        starsContainer.appendChild(gift);
    }
}

function createConfetti() {
    const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#a855f7', '#3b82f6', '#10b981'];
    const confettiCount = 60;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.width = Math.random() * 12 + 6 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.opacity = '1';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        document.body.appendChild(confetti);
        
        
        setTimeout(() => {
            confetti.remove();
        }, 3500);
    }
}

const prizeData = {
    '1': {
        title: 'Voucher 500K',
        description: 'Phiếu quy đổi tiền mặt hoặc thanh toán lần sau',
        amount: '500.000 VND',
        value: 500000
    },
    '2': {
        title: 'Voucher 300K',
        description: 'Phiếu mua sắm hoặc thanh toán online',
        amount: '300.000 VND',
        value: 300000
    },
    '3': {
        title: 'Voucher 200K',
        description: 'Phiếu giảm giá cho lần mua tiếp theo',
        amount: '200.000 VND',
        value: 200000
    }
};

function getBoxNumber() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('box') || '1';
}

function displayPrize() {
    const boxNumber = getBoxNumber();
    const prize = prizeData[boxNumber];
    
    if (prize) {
        document.getElementById('prizeTitle').textContent = prize.title;
        document.getElementById('prizeDescription').textContent = prize.description;
        document.getElementById('prizeAmount').textContent = prize.amount;
    }
}

function initButtons() {
    const convertBtn = document.getElementById('convertBtn');
    const declineBtn = document.getElementById('declineBtn');
    const captureBtn = document.getElementById('captureBtn');
    
    convertBtn.addEventListener('click', handleConvert);
    declineBtn.addEventListener('click', handleDecline);
    captureBtn.addEventListener('click', handleCapture);
}

function handleConvert() {
    const boxNumber = getBoxNumber();
    const prize = prizeData[boxNumber];
    
    
    showSuccessModal(prize);
    
    
    createConfetti();
}

function handleDecline() {
    if (confirm('Bạn có chắc chắn muốn từ chối phần thưởng này?')) {
        showNotification('Bạn đã từ chối phần thưởng', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

function handleCapture() {
    showNotification('Đang chụp ảnh kết quả...', 'info');
    
    
    setTimeout(() => {
        showNotification('Đã lưu ảnh kết quả thành công!', 'success');
        createConfetti();
    }, 1000);
}

function showSuccessModal(prize) {
    const modal = document.getElementById('successModal');
    const modalMessage = modal.querySelector('.modal-message');
    
    if (prize) {
        modalMessage.textContent = `Bạn đã quy đổi thành công ${prize.amount}`;
    }
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
    
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

function goBack() {
    window.location.href = 'index.html';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 600;
        color: #1f2937;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        border-left: 4px solid ${colors[type] || colors.info};
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <span style="font-size: 1.5rem;">${icons[type] || icons.info}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    displayPrize();
    initButtons();
    
    
    setTimeout(() => {
        createConfetti();
    }, 500);
});

document.getElementById('successModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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