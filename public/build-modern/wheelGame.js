/**
 * ================================================
 * WHEEL GAME CONTROLLER
 * ================================================
 */

class WheelGame extends GameEngine {
  constructor(sessionCode, config, prizes) {
    super(sessionCode, 'wheel', config);
    this.prizes = prizes;
    this.segments = config.segments || [];
    this.isSpinning = false;
    this.currentRotation = 0;
    this.state = { spins: 0 };
  }

  /**
   * Initialize wheel game UI
   */
  render(containerId) {
    const container = document.getElementById(containerId);

    const html = `
      <div class="game-container">
        <div class="game-header">
          <h1>🎡 Vòng Quay May Mắn</h1>
          <p>Quay để nhận thưởng</p>
          <div class="game-info">
            <div class="info-badge">
              💨 <strong>Tốc độ: ${this.config.speed}</strong>
            </div>
            <div class="info-badge">
              🎯 <strong id="spinCount">0</strong> lần quay
            </div>
          </div>
        </div>

        <div class="wheel-container">
          <div class="wheel-pointer"></div>
          <div class="wheel-wrapper">
            <div class="wheel" id="wheel">
              ${this.renderSegments()}
            </div>
            <div class="wheel-center" id="wheelCenter">
              🎁
            </div>
          </div>
        </div>

        <button class="spin-button" id="spinBtn" onclick="wheelGame.spin()">
          🎯 QUAY NGAY
        </button>
      </div>
    `;

    container.innerHTML = html;
    this.attachEventListeners();
  }

  /**
   * Render wheel segments
   */
  renderSegments() {
    const segmentAngle = 360 / this.segments.length;
    return this.segments.map((segment, idx) => {
      const rotation = idx * segmentAngle;
      const skewValue = 360 / this.segments.length - 90;

      return `
        <div class="wheel-segment" 
             style="
               background: linear-gradient(135deg, ${segment.color} 0%, ${this.lightenColor(segment.color)} 100%);
               transform: rotate(${rotation}deg) skew(0deg, ${skewValue}deg);
               clip-path: polygon(50% 50%, 50% 0%, 100% 0%);
             "
             data-index="${idx}">
          <span style="
            position: absolute;
            left: 30%;
            top: 50%;
            transform: translateY(-50%) rotate(${-rotation - skewValue}deg);
            writing-mode: horizontal-tb;
            font-size: 0.8rem;
            font-weight: bold;
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          ">${segment.label.substring(0, 8)}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Lighten hex color
   */
  lightenColor(color) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = 30;
    const usePound = typeof color === 'string' && color[0] === '#';
    return (usePound ? '#' : '') + (
      0x1000000 + (Math.min(255, (num >> 16) + amt) * 0x10000) +
      (Math.min(255, (num >> 8 & 0x00FF) + amt) * 0x100) +
      Math.min(255, (num & 0x0000FF) + amt)
    ).toString(16).slice(1);
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    document.getElementById('spinBtn').disabled = false;
  }

  /**
   * Spin the wheel
   */
  async spin() {
    if (this.isSpinning || !this.isPlaying) return;

    this.isSpinning = true;
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('spinBtn').textContent = '⏳ ĐANG QUAY...';

    // Choose random prize
    const prizeIndex = Math.floor(Math.random() * this.segments.length);
    const prize = this.prizes[prizeIndex];

    // Calculate final rotation (3 full rotations + target position)
    const segmentAngle = 360 / this.segments.length;
    const targetRotation = prizeIndex * segmentAngle;
    const finalRotation = 3 * 360 + (360 - targetRotation);

    // Animate spin
    const wheel = document.getElementById('wheel');
    const startRotation = this.currentRotation;
    const duration = this.config.spin_time_ms || 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentRotation = startRotation + (finalRotation * easeProgress);
      wheel.style.transform = `rotate(${currentRotation}deg)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.currentRotation = finalRotation % 360;
        this.onSpinComplete(prizeIndex, prize);
      }
    };

    animate();
    this.state.spins++;
    document.getElementById('spinCount').textContent = this.state.spins;
  }

  /**
   * Handle spin completion
   */
  async onSpinComplete(prizeIndex, prize) {
    this.isSpinning = false;
    this.playSound('win');

    // Wait before showing result
    await new Promise(resolve => setTimeout(resolve, 500));

    // Save result
    await this.endGame(prizeIndex);

    // Show result
    this.showResultScreen(prize);
  }

  /**
   * Play sound effect
   */
  playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'win') {
      oscillator.frequency.value = 1200;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  }

  /**
   * Show result
   */
  showResultScreen(prize) {
    const html = `
      <div class="result-screen">
        <div class="result-emoji" style="color: ${prize.color}">🎉</div>
        <h2 class="result-title">Chúc Mừng!</h2>
        <p class="result-message">Bạn đã quay trúng giải thưởng</p>
        
        <div class="result-detail">
          <div style="font-size: 2rem; margin-bottom: 10px;">${prize.icon || '🎁'}</div>
          <strong style="color: ${prize.color}; font-size: 1.3rem;">${prize.name}</strong>
          ${prize.cash_amount ? `<p>💰 ${prize.cash_amount.toLocaleString()}đ</p>` : ''}
          <p style="font-size: 0.9rem; opacity: 0.8;">Rarity: <strong>${prize.rarity}</strong></p>
        </div>

        <div class="result-buttons">
          <button class="btn btn-primary" onclick="location.href='/thank-you'">
            Nhận Thưởng
          </button>
          <button class="btn btn-secondary" onclick="wheelGame.shareResult()">
            Chia Sẻ 📤
          </button>
        </div>
      </div>
    `;

    document.querySelector('.game-container').innerHTML = html;
  }
}

