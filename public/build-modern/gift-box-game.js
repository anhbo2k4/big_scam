/**
 * Enhanced Gift Box Opening Interface
 * Upgraded with animations, effects, and better UX
 */

const giftBoxGame = {
  boxes: [],
  selectedIndex: -1,
  isAnimating: false,
  gameSession: null,

  init: async () => {
    try {
      // Initialize boxes
      giftBoxGame.setupBoxes();
      giftBoxGame.attachEventListeners();
      
      // Get current game session
      const response = await fetch('/api/current-session');
      if (response.ok) {
        const data = await response.json();
        giftBoxGame.gameSession = data.data;
        giftBoxGame.updateGameInfo();
      }
    } catch (err) {
      console.error('❌ Error initializing game:', err);
      giftBoxGame.showNotification('Lỗi khi khởi tạo trò chơi', 'error');
    }
  },

  setupBoxes: () => {
    const boxContainer = document.getElementById('giftBoxContainer');
    if (!boxContainer) return;

    const boxCount = parseInt(boxContainer.dataset.boxCount) || 12;
    boxContainer.innerHTML = '';

    for (let i = 0; i < boxCount; i++) {
      const box = document.createElement('div');
      box.className = 'gift-box-item';
      box.dataset.index = i;
      box.innerHTML = `
        <div class="gift-box">
          <div class="gift-box-lid">
            <div class="gift-box-ribbon"></div>
            <div class="gift-box-bow"></div>
          </div>
          <div class="gift-box-body">
            <div class="gift-box-emoji">🎁</div>
          </div>
        </div>
        <div class="box-glow"></div>
        <span class="box-number">${i + 1}</span>
      `;

      box.addEventListener('click', () => giftBoxGame.selectBox(i));
      box.addEventListener('mouseenter', () => {
        if (!giftBoxGame.isAnimating && giftBoxGame.selectedIndex === -1) {
          box.classList.add('hover');
        }
      });
      box.addEventListener('mouseleave', () => {
        box.classList.remove('hover');
      });

      boxContainer.appendChild(box);
    }

    giftBoxGame.boxes = document.querySelectorAll('.gift-box-item');
  },

  selectBox: async (index) => {
    if (giftBoxGame.isAnimating || giftBoxGame.selectedIndex !== -1) return;

    const box = giftBoxGame.boxes[index];
    giftBoxGame.isAnimating = true;
    giftBoxGame.selectedIndex = index;

    // Animate selection
    box.classList.add('selected');
    
    // Play sound if available
    giftBoxGame.playSound('select');

    // Show selection feedback
    giftBoxGame.showSelectionFeedback(box);

    // Submit selection
    try {
      const response = await fetch('/api/select-box', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: giftBoxGame.gameSession?.id,
          boxIndex: index
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      
      if (data.success) {
        // Animate opening
        await giftBoxGame.animateBoxOpening(box);
        
        // Show prize result
        await giftBoxGame.showPrizeResult(data.data.prize);
      } else {
        giftBoxGame.showNotification(data.message || 'Lỗi khi chọn hộp', 'error');
      }
    } catch (err) {
      console.error('❌ Error selecting box:', err);
      giftBoxGame.showNotification('Không thể xử lý lựa chọn của bạn', 'error');
    } finally {
      giftBoxGame.isAnimating = false;
    }
  },

  animateBoxOpening: async (box) => {
    return new Promise(resolve => {
      const boxElement = box.querySelector('.gift-box');
      const lid = box.querySelector('.gift-box-lid');
      const body = box.querySelector('.gift-box-body');

      // Lid animation
      lid.style.animation = 'lidFlip 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

      // Body shine
      body.style.animation = 'shine 1s ease-in-out';

      // Particles effect
      giftBoxGame.createParticles(box);

      // Sound effect
      giftBoxGame.playSound('open');

      setTimeout(resolve, 1000);
    });
  },

  createParticles: (box) => {
    const container = box.querySelector('.gift-box-body');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.innerHTML = '✨';

      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = 3 + Math.random() * 3;
      const tx = Math.cos(angle) * 100 * velocity;
      const ty = Math.sin(angle) * 100 * velocity;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.animation = `particle 1.2s ease-out forwards`;

      container.appendChild(particle);

      setTimeout(() => particle.remove(), 1200);
    }
  },

  showSelectionFeedback: (box) => {
    const feedback = document.createElement('div');
    feedback.className = 'selection-feedback';
    feedback.innerHTML = '✓ Đã chọn!';
    box.appendChild(feedback);

    setTimeout(() => feedback.remove(), 500);
  },

  showPrizeResult: async (prize) => {
    const modal = document.createElement('div');
    modal.className = 'prize-modal';
    modal.innerHTML = `
      <div class="prize-modal-content">
        <div class="prize-celebration">
          <div class="confetti"></div>
          <div class="prize-icon">${giftBoxGame.getPrizeEmoji(prize.type)}</div>
          <h2 class="prize-title">🎉 Chúc mừng! 🎉</h2>
          <p class="prize-description">${prize.name}</p>
          <p class="prize-value">${giftBoxGame.formatPrizeValue(prize)}</p>
          <button class="btn-primary" onclick="giftBoxGame.closePrizeModal()">
            Tiếp tục
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    giftBoxGame.playSound('congratulations');
    giftBoxGame.triggerConfetti();

    setTimeout(() => {
      modal.classList.add('show');
    }, 100);
  },

  closePrizeModal: () => {
    const modal = document.querySelector('.prize-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  },

  getPrizeEmoji: (type) => {
    const emojis = {
      'cash': '💰',
      'voucher': '🎟️',
      'product': '🛍️',
      'unlucky': '😅',
      'super_lucky': '🤯'
    };
    return emojis[type] || '🎁';
  },

  formatPrizeValue: (prize) => {
    if (prize.type === 'unlucky') return 'Hên xui lần này rồi!';
    if (prize.cash_amount) return `${prize.cash_amount.toLocaleString('vi-VN')} đồng`;
    return prize.name;
  },

  updateGameInfo: () => {
    const sessionInfo = document.getElementById('sessionInfo');
    if (sessionInfo && giftBoxGame.gameSession) {
      sessionInfo.innerHTML = `
        <div class="session-detail">
          <span>📅 ${new Date(giftBoxGame.gameSession.created_at).toLocaleDateString('vi-VN')}</span>
          <span>🎮 Phiên chơi #${giftBoxGame.gameSession.id}</span>
        </div>
      `;
    }
  },

  triggerConfetti: () => {
    const confetti = document.querySelector('.confetti');
    if (!confetti) return;

    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 5)];
      piece.style.animation = `confetti-fall ${2 + Math.random() * 2}s ease-in forwards`;
      
      document.querySelector('.confetti').appendChild(piece);
    }
  },

  playSound: (type) => {
    // Stub for sound playback - can be implemented with Web Audio API
    console.log(`🔊 Playing sound: ${type}`);
  },

  showNotification: (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  attachEventListeners: () => {
    // Reset button
    document.getElementById('resetGameBtn')?.addEventListener('click', () => {
      if (confirm('Bạn chắc chắn muốn bắt đầu lại?')) {
        location.reload();
      }
    });

    // Info button
    document.getElementById('gameInfoBtn')?.addEventListener('click', () => {
      giftBoxGame.showGameInfo();
    });
  },

  showGameInfo: () => {
    const info = `
    <div class="game-info-modal">
      <h3>ℹ️ Thông Tin Trò Chơi</h3>
      <p>Chọn một hộp quà để mở và nhận phần thưởng!</p>
      <ul>
        <li>🎁 Mỗi hộp có một phần thưởng riêng</li>
        <li>💰 Giải thưởng có thể là tiền mặt hoặc voucher</li>
        <li>⚠️ Có thể gặp phải giải "hên xui"</li>
      </ul>
      <button onclick="this.parentElement.remove()" class="btn-primary">Đóng</button>
    </div>
    `;
    
    const container = document.createElement('div');
    container.className = 'modal-overlay';
    container.innerHTML = info;
    document.body.appendChild(container);
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => giftBoxGame.init());
} else {
  giftBoxGame.init();
}
