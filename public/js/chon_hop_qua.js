
function createStars() {
    const starsContainer = document.getElementById('bgStars');
    
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }

    
    const giftEmojis = ['🎁', '🎀', '⭐', '✨'];
    for (let i = 0; i < 8; i++) {
        const gift = document.createElement('div');
        gift.className = 'floating-gift';
        gift.textContent = giftEmojis[Math.floor(Math.random() * giftEmojis.length)];
        gift.style.left = Math.random() * 100 + '%';
        gift.style.top = Math.random() * 100 + '%';
        gift.style.animationDelay = Math.random() * 6 + 's';
        starsContainer.appendChild(gift);
    }
}

const openedBoxes = new Set(['1']); 

function initGiftBoxes() {
    const giftBoxes = document.querySelectorAll('.gift-box');
    
    giftBoxes.forEach(box => {
        const boxNumber = box.dataset.box;
        
        
        if (boxNumber === '1') {
            box.classList.add('opened');
        }
        
        box.addEventListener('click', () => handleBoxClick(boxNumber));
    });
}

function handleBoxClick(boxNumber) {
    if (openedBoxes.has(boxNumber)) {
        
        window.location.href = `result.html?box=${boxNumber}`;
    } else {
        
        openBox(boxNumber);
    }
}

function openBox(boxNumber) {
    const box = document.getElementById(`box${boxNumber}`);
    if (!box) return;

    
    openedBoxes.add(boxNumber);
    
    
    box.classList.add('opened');
    
    const statusElement = box.querySelector('.gift-status');
    if (statusElement) {
        statusElement.innerHTML = `
            <span>✅</span>
            <span>Đã mở</span>
        `;
        statusElement.classList.remove('waiting');
    }

    
    createConfetti();
    
    
    setTimeout(() => {
        window.location.href = `result.html?box=${boxNumber}`;
    }, 1500);
}

function createConfetti() {
    const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.opacity = '1';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        
        const duration = Math.random() * 2 + 2;
        const xMovement = (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 720;
        
        confetti.animate([
            {
                transform: 'translate(0, 0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(${xMovement}px, ${window.innerHeight + 50}px) rotate(${rotation}deg)`,
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

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    initGiftBoxes();
});

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
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
        animation: slideIn 0.3s ease-out;
    `;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    notification.innerHTML = `
        <span style="margin-right: 0.5rem;">${icons[type] || icons.info}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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