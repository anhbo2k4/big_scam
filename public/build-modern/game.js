/* =============================================
   GIFT BOX GAME - VANILLA JAVASCRIPT
   ============================================= */

// ============================================
// STATE MANAGEMENT
// ============================================
const game = {
  step: 1,
  sessionCode: null,
  playerId: null,
  name: null,
  phone: null,
  selectedBox: null,
  prize: null,
  soundEnabled: true,
  localStorage: null
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  // Add CSS class to body
  document.body.classList.add('game-page');

  // Initialize particles
  initParticles();

  // Check for sessionCode in URL
  const params = new URLSearchParams(window.location.search);
  game.sessionCode = params.get('code');

  // Load state from localStorage
  loadGameState();

  // Sound toggle
  setupSoundToggle();

  // If returnin user
  if (game.step > 1 && game.sessionCode) {
    showStep(game.step);
  } else {
    showStep(1);
  }

  // Handle Enter key for continuing
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const continueBtn = document.querySelector('.btn-continue');
      if (continueBtn && !continueBtn.classList.contains('loading')) {
        continueBtn.click();
      }
    }
  });
});

// ============================================
// PARTICLE BACKGROUND
// ============================================
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 60;

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  // Animation loop
  function animate() {
    ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity += (Math.random() - 0.5) * 0.02;
      p.opacity = Math.max(0.1, Math.min(0.6, p.opacity));

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ============================================
// STEP TRANSITIONS
// ============================================
function showStep(step) {
  game.step = step;
  saveGameState();

  // Hide all steps
  document.querySelectorAll('.step-container').forEach((el) => {
    el.classList.remove('active');
  });

  // Show current step
  const stepEl = document.querySelector(`.step-${step}-container`);
  if (stepEl) {
    stepEl.classList.add('active');
  }

  // Focus first input
  const firstInput = stepEl?.querySelector('input');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

// ✅ NEW: Update prize display in step 4
function updatePrizeDisplay() {
  if (game.step !== 4 || !game.prize) return;

  const prizeIcon = document.getElementById('prizeIcon');
  const prizeName = document.getElementById('prizeName');
  const prizeDesc = document.getElementById('prizeDesc');
  const prizeLevel = document.getElementById('prizeLevel');
  const walletAmount = document.getElementById('walletAmount');
  const walletTitle = document.getElementById('walletTitle');
  const withdrawAmount = document.getElementById('withdrawAmount');
  const giftPrizeName = document.getElementById('giftPrizeName');

  if (prizeIcon) prizeIcon.textContent = game.prize.icon || '🎁';
  if (prizeName) prizeName.textContent = game.prize.name || 'Phần thưởng';
  if (prizeDesc) prizeDesc.textContent = game.prize.description || '';

  if (prizeLevel) {
    let badgeClass = 'normal';
    let badgeText = 'THƯỜNG';
    if (game.prize.level === 'VIP') {
      badgeClass = 'vip';
      badgeText = '⭐ VIP';
    } else if (game.prize.level === 'UNLUCKY') {
      badgeClass = 'unlucky';
      badgeText = '💔 HẠN CÓ PHẦN SAI';
    }
    prizeLevel.innerHTML = `<div class="prize-badge ${badgeClass}">${badgeText}</div>`;
  }

  if (game.prize.isCash && game.prize.cashAmount > 0) {
    if (walletAmount) {
      walletAmount.textContent = (game.prize.cashAmount || 0).toLocaleString('vi-VN') + ' VNĐ';
    }
    if (walletTitle) {
      walletTitle.textContent = `Ví phiên: ${game.sessionCode}`;
    }
    document.getElementById('btnWithdraw').style.display = 'block';
    document.getElementById('walletCard').style.opacity = '1';
  } else {
    if (walletAmount) walletAmount.textContent = '0 VNĐ';
    if (walletTitle) walletTitle.textContent = 'Phần thưởng: Hiện vật';
    document.getElementById('btnWithdraw').style.display = 'none';
    document.getElementById('walletCard').style.opacity = '0.6';
  }

  if (withdrawAmount && game.prize.isCash) {
    withdrawAmount.textContent = (game.prize.cashAmount || 0).toLocaleString('vi-VN') + ' VNĐ';
  }

  if (giftPrizeName) {
    giftPrizeName.textContent = `Phần quà: ${game.prize.icon} ${game.prize.name || 'Quà tặng'}`;
  }

  // ✅ Hide buttons if UNLUCKY - No claiming or withdrawing allowed
  const btnClaimGift = document.getElementById('btnClaimGift');
  const btnWithdraw = document.getElementById('btnWithdraw');
  if (game.prize.level === 'UNLUCKY') {
    if (btnClaimGift) {
      btnClaimGift.style.display = 'none';
      btnClaimGift.disabled = true;
    }
    if (btnWithdraw) {
      btnWithdraw.style.display = 'none';
      btnWithdraw.disabled = true;
    }
    console.warn('⚠️ [updatePrizeDisplay] Prize is UNLUCKY - buttons disabled');
  }
}

// ============================================
// STEP 1: VALIDATE SESSION CODE
// ============================================
window.continueToStep2 = async function () {
  const sessionInput = document.querySelector('.session-code-input');
  const code = sessionInput?.value.trim().toUpperCase();

  if (!code) {
    showToast('Vui lòng nhập mã phiên chơi', 'error');
    return;
  }

  const btn = document.querySelector('.btn-continue');
  btn.classList.add('loading');
  btn.innerHTML = '<span class="spinner"></span>Đang kiểm tra...';

  try {
    const res = await fetch(`/api/game/session-info/${code}`);
    const data = await res.json();

    if (!data.success || !data.isValid) {
      sessionInput.classList.add('shake');
      showToast('Mã phiên chơi không tồn tại', 'error');
      setTimeout(() => sessionInput.classList.remove('shake'), 400);
      return;
    }

    // Check if already played with unlucky result
    if (data.isUnlucky) {
      sessionInput.classList.add('shake');
      showNotification(
        '😢 Kết quả xui lỗi',
        '❌ Bạn đã chơi mã phiên này và không trúng phần quà nào cả.<br><br>Hãy thử lại bằng <strong>mã phiên khác</strong>!',
        'error'
      );
      setTimeout(() => sessionInput.classList.remove('shake'), 400);
      return;
    }

    if (data.alreadyPlayed) {
      showToast('Phiên này đã được sử dụng rồi', 'error');
      return;
    }

    if (data.isExpired) {
      showToast('Phiên chơi đã hết hạn', 'error');
      return;
    }

    game.sessionCode = code;
    saveGameState();
    showStep(2);
  } catch (err) {
    console.error('Error:', err);
    showToast('Lỗi kết nối, vui lòng thử lại', 'error');
  } finally {
    btn.classList.remove('loading');
    btn.innerHTML = 'Tiếp tục ✓';
  }
};

// ============================================
// STEP 2: PERSONAL INFO
// ============================================
window.startGame = async function () {
  const nameInput = document.querySelector('input[placeholder*="Họ tên"]') ||
    document.querySelector('input[name="name"]');
  const phoneInput = document.querySelector('input[placeholder*="Số điện thoại"]') ||
    document.querySelector('input[name="phone"]');

  const name = nameInput?.value.trim();
  const phone = phoneInput?.value.trim();

  if (!name) {
    showToast('Vui lòng nhập họ tên', 'error');
    nameInput?.focus();
    return;
  }

  if (!phone) {
    showToast('Vui lòng nhập số điện thoại', 'error');
    phoneInput?.focus();
    return;
  }

  // Validate phone (10-11 digits)
  if (!/^\d{10,11}$/.test(phone)) {
    showToast('Số điện thoại không hợp lệ (10-11 chữ số)', 'error');
    phoneInput?.focus();
    return;
  }

  const btn = document.querySelector('.btn-start');
  btn.classList.add('loading');
  btn.innerHTML = '<span class="spinner"></span>Đang bắt đầu...';

  try {
    const res = await fetch('/api/game/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionCode: game.sessionCode,
        name: name,
        phone: phone
      })
    });

    const data = await res.json();

    if (!data.success) {
      showToast(data.message || 'Lỗi, vui lòng thử lại', 'error');
      return;
    }

    game.playerId = data.data.playerId;
    game.name = name;
    game.phone = phone;
    saveGameState();

    playSound(0.7, 0.3, 'sine'); // Success sound
    showStep(3);
  } catch (err) {
    console.error('Error:', err);
    showToast('Lỗi kết nối', 'error');
  } finally {
    btn.classList.remove('loading');
    btn.innerHTML = 'Bắt đầu chơi';
  }
};

// ============================================
// STEP 3: BOX SELECTION
// ============================================
window.selectBox = async function (index) {
  const boxes = document.querySelectorAll('.gift-box');
  game.selectedBox = index;

  // Play sound
  playSound(0.5, 0.2, 'sine');

  // Mark selected and disable others
  boxes.forEach((box, i) => {
    if (i === index) {
      box.classList.add('selected');
    } else {
      box.classList.add('disabled');
    }
  });

  await new Promise((r) => setTimeout(r, 600));

  // Fetch prize
  const btn = document.querySelector('.btn-continue, .btn-open');
  if (btn) {
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span>Đang mở hộp...';
  }

  try {
    // Confetti animation
    createConfetti();

    // Play success sound (arpeggio)
    playArpeggio();

    const res = await fetch('/api/game/open-box', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: game.playerId,
        sessionCode: game.sessionCode,
        boxIndex: index
      })
    });

    const data = await res.json();

    if (!data.success) {
      showToast(data.message || 'Lỗi, vui lòng thử lại', 'error');
      return;
    }

    game.prize = data.data.prize;
    saveGameState();

    await new Promise((r) => setTimeout(r, 1000));
    showStep(4);
    updatePrizeDisplay();  // ✅ Update DOM immediately
  } catch (err) {
    console.error('Error:', err);
    showToast('Lỗi kết nối', 'error');
  } finally {
    if (btn) {
      btn.classList.remove('loading');
      btn.innerHTML = 'Mở hộp quà';
    }
  }
};

// ============================================
// STEP 4: PRIZE RESULT & MODALS
// ============================================
window.openWithdrawModal = function () {
  const modal = document.getElementById('withdrawalModal');
  modal?.classList.add('active');
};

window.openGiftModal = function () {
  // ✅ CHECK IF PRIZE IS UNLUCKY - CANNOT CLAIM
  if (game.prize && game.prize.level === 'UNLUCKY') {
    showToast('💔 Phần thưởng xui lỗi! Không thể nhận phần thưởng này.', '❌');
    return;
  }
  
  const modal = document.getElementById('giftModal');
  modal?.classList.add('active');
};

window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  modal?.classList.remove('active');
};

window.claimPrize = async function (method) {
  // ✅ CHECK IF PRIZE IS UNLUCKY - CANNOT CLAIM
  if (game.prize && game.prize.level === 'UNLUCKY') {
    showToast('💔 Phần thưởng xui lỗi! Không thể nhận phần thưởng này.', 'error');
    return;
  }

  if (method === 'bank') {
    const bankSelect = document.querySelector('select[name="bank"]');
    const accountNum = document.querySelector('input[name="account"]');
    const accountName = document.querySelector('input[name="accountName"]');
    const phone = document.querySelector('input[name="withdrawPhone"]');

    const bank = bankSelect?.value;
    const account = accountNum?.value.trim();
    const holder = accountName?.value.trim().toUpperCase();
    const withdrawPhone = phone?.value.trim();

    if (!bank || !account || !holder) {
      showToast('Vui lòng điền đầy đủ thông tin ngân hàng', 'error');
      return;
    }

    if (!withdrawPhone) {
      showToast('Vui lòng nhập số điện thoại xác nhận', 'error');
      return;
    }

    const btn = document.querySelector('#withdrawalModal .btn-modal-confirm');
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span>Đang xác nhận...';

    try {
      const res = await fetch('/api/game/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: game.playerId,
          sessionCode: game.sessionCode,
          method: 'bank',
          bankName: bank,
          accountNumber: account,
          accountName: holder,
          phone: withdrawPhone
        })
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || 'Lỗi, vui lòng thử lại', 'error');
        return;
      }

      game.claimId = data.data.claimId;
      game.claimMethod = 'bank';
      saveGameState();

      playSound(0.8, 0.15, 'sine'); // Success
      playSound(0.6, 0.15, 'sine');

      closeModal('withdrawalModal');
      await new Promise((r) => setTimeout(r, 500));
      showStep(5);
    } catch (err) {
      console.error('Error:', err);
      showToast('Lỗi kết nối', 'error');
    } finally {
      btn.classList.remove('loading');
      btn.innerHTML = 'Xác nhận rút tiền';
    }
  } else if (method === 'gift') {
    const receiverName = document.querySelector('input[name="receiverName"]');
    const giftPhone = document.querySelector('input[name="giftPhone"]');
    const province = document.querySelector('select[name="province"]');
    const district = document.querySelector('input[name="district"]');
    const address = document.querySelector('textarea[name="address"]');

    const receiver = receiverName?.value.trim();
    const giftPhoneVal = giftPhone?.value.trim();
    const prov = province?.value;
    const dist = district?.value.trim();
    const addr = address?.value.trim();

    if (!receiver || !giftPhoneVal || !prov || !dist || !addr) {
      showToast('Vui lòng điền đầy đủ thông tin giao hàng', 'error');
      return;
    }

    const btn = document.querySelector('#giftModal .btn-modal-confirm');
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span>Đang xác nhận...';

    try {
      const res = await fetch('/api/game/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: game.playerId,
          sessionCode: game.sessionCode,
          method: 'gift',
          province: prov,
          district: dist,
          address: addr,
          phone: giftPhoneVal,
          note: 'N/A'
        })
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || 'Lỗi, vui lòng thử lại', 'error');
        return;
      }

      game.claimId = data.data.claimId;
      game.claimMethod = 'gift';
      saveGameState();

      playSound(0.8, 0.15, 'sine');
      playSound(0.6, 0.15, 'sine');

      closeModal('giftModal');
      await new Promise((r) => setTimeout(r, 500));
      showStep(5);
    } catch (err) {
      console.error('Error:', err);
      showToast('Lỗi kết nối', 'error');
    } finally {
      btn.classList.remove('loading');
      btn.innerHTML = 'Xác nhận nhận quà';
    }
  }
};

// ============================================
// UTILITIES
// ============================================

// Save game state
function saveGameState() {
  const state = {
    step: game.step,
    sessionCode: game.sessionCode,
    playerId: game.playerId,
    name: game.name,
    phone: game.phone,
    selectedBox: game.selectedBox,
    prize: game.prize,
    claimMethod: game.claimMethod,
    claimId: game.claimId,
    timestamp: Date.now()
  };
  localStorage.setItem(`game_session_${game.sessionCode}`, JSON.stringify(state));
}

// Load game state
function loadGameState() {
  if (!game.sessionCode && new URLSearchParams(window.location.search).get('code')) {
    game.sessionCode = new URLSearchParams(window.location.search).get('code');
  }

  if (game.sessionCode) {
    const saved = localStorage.getItem(`game_session_${game.sessionCode}`);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        const ageMs = Date.now() - state.timestamp;
        const age48h = 48 * 60 * 60 * 1000;

        if (ageMs > age48h) {
          // Expired
          localStorage.removeItem(`game_session_${game.sessionCode}`);
          return;
        }

        Object.assign(game, state);
      } catch (err) {
        console.error('Error loading state:', err);
      }
    }
  }
}

// Toast notifications
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Sound synthesis
let audioContext = null;

function playSound(freq, duration = 0.3, type = 'sine') {
  if (!game.soundEnabled) return;

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const ctx = audioContext;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

  osc.start(now);
  osc.stop(now + duration);
}

function playArpeggio() {
  if (!game.soundEnabled) return;

  const freqs = [261.63, 329.63, 392]; // C4, E4, G4 (C major)
  freqs.forEach((freq, i) => {
    setTimeout(() => playSound(freq, 0.2), i * 100);
  });
}

function setupSoundToggle() {
  const btn = document.querySelector('.sound-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    game.soundEnabled = !game.soundEnabled;
    btn.classList.toggle('muted');
    btn.textContent = game.soundEnabled ? '🔊' : '🔇';
    showToast(game.soundEnabled ? 'Âm thanh bật' : 'Âm thanh tắt', 'info', 1500);
  });
}

// Confetti effect
function createConfetti() {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = 999;
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const confetti = [];

  const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#fbbf24', '#10b981'];

  for (let i = 0; i < 120; i++) {
    confetti.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 1) * 15,
      size: Math.random() * 4 + 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      decay: Math.random() * 0.015 + 0.01
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((c, i) => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.3; // Gravity
      c.rotation += c.rotationSpeed;
      c.life -= c.decay;

      if (c.life <= 0) {
        confetti.splice(i, 1);
        return;
      }

      ctx.save();
      ctx.globalAlpha = c.life;
      ctx.fillStyle = c.color;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
      ctx.restore();
    });

    if (confetti.length > 0) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  animate();
}

// Share functionality
window.shareResult = function () {
  if (navigator.share) {
    navigator.share({
      title: 'Kết quả mở hộp quà',
      text: `Tôi đã nhận được: ${game.prize?.name}! 🎉`,
      url: window.location.href
    }).catch((err) => console.log('Share error:', err));
  } else {
    showToast('Chức năng chia sẻ không được hỗ trợ', 'info');
    // Fallback: copy to clipboard
    const text = `Kết quả mở hộp quà: ${game.prize?.name}! 🎉 \nXem chi tiết tại: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Đã sao chép vào clipboard', 'success');
    });
  }
};

// Format VNĐ currency
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
}

// Count-up animation for wallet
function animateCountUp(element, startAmount, endAmount, duration = 1500) {
  let startTime = null;

  function update(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = (currentTime - startTime) / duration;

    if (progress < 1) {
      const current = startAmount + (endAmount - startAmount) * progress;
      element.textContent = formatVND(Math.floor(current));
      requestAnimationFrame(update);
    } else {
      element.textContent = formatVND(endAmount);
    }
  }

  requestAnimationFrame(update);
}

// Auto-populate fields in modals
window.populateWithdrawalPhone = function () {
  const phoneInput = document.querySelector('input[name="withdrawPhone"]');
  if (phoneInput) {
    phoneInput.value = game.phone;
  }
};

window.populateGiftReceiver = function () {
  const nameInput = document.querySelector('input[name="receiverName"]');
  const phoneInput = document.querySelector('input[name="giftPhone"]');
  if (nameInput) nameInput.value = game.name;
  if (phoneInput) phoneInput.value = game.phone;
};

// Handle modal close on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Mobile number formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach((input) => {
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^\d]/g, '');
  });
});
