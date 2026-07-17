/**
 * ================================================
 * BOXES GAME CONTROLLER
 * ================================================
 */

class BoxesGame extends GameEngine {
  constructor(sessionCode, config, prizes) {
    super(sessionCode, 'boxes', config);
    this.prizes = prizes;
    this.revealed = new Set();
    this.state = { revealed: [] };
  }

  /**
   * Initialize boxes game UI
   */
  render(containerId) {
    const container = document.getElementById(containerId);
    const { columns, rows, gap } = this.config.layout;

    const html = `
      <div class="game-container">
        <div class="game-header">
          <h1>🎁 Chọn Hộp Quà</h1>
          <p>Chọn 1 hộp để nhận thưởng</p>
          <div class="game-info">
            <div class="info-badge">
              📦 <strong>${this.prizes.length}</strong> hộp
            </div>
            <div class="info-badge">
              ⏱️ <strong id="timer">0s</strong>
            </div>
          </div>
        </div>

        <div class="boxes-game">
          <div class="boxes-grid" id="boxesGrid" style="--columns: ${columns}; --gap: ${gap}">
            ${this.prizes.map((prize, idx) => `
              <div class="box" 
                   data-index="${idx}" 
                   data-rarity="${prize.rarity}"
                   style="--rarity-color: ${prize.color}">
                <div class="box-content">
                  <span class="box-number">${idx + 1}</span>
                  <span class="box-prize">${prize.name}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.attachEventListeners();
    this.startTimer();
  }

  /**
   * Attach click listeners to boxes
   */
  attachEventListeners() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
      box.addEventListener('click', () => this.selectBox(parseInt(box.dataset.index)));
    });
  }

  /**
   * Select a box
   */
  async selectBox(index) {
    if (this.revealed.has(index) || !this.isPlaying) return;

    const box = document.querySelector(`.box[data-index="${index}"]`);
    box.classList.add('selected');

    // Animate and reveal
    await new Promise(resolve => setTimeout(resolve, 300));

    box.classList.remove('selected');
    box.classList.add('revealed');
    this.revealed.add(index);
    this.state.revealed.push(index);

    // Play success sound
    this.playSound('select');

    // Check if this completes the game (after slight delay)
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.endGame(index);

    // Show result screen
    this.showResultScreen(this.prizes[index]);
  }

  /**
   * Play sound effect
   */
  playSound(type) {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'select':
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'win':
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
      case 'fail':
        oscillator.frequency.value = 300;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
    }
  }

  /**
   * Show result screen
   */
  showResultScreen(prize) {
    const html = `
      <div class="result-screen">
        <div class="result-emoji" style="color: ${prize.color}">🎉</div>
        <h2 class="result-title">Bạn Thắng!</h2>
        <p class="result-message">Chúc mừng bạn chiến thắng!</p>
        
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
          <button class="btn btn-secondary" onclick="gameEngine.shareResult()">
            Chia Sẻ 📤
          </button>
        </div>
      </div>
    `;

    document.querySelector('.game-container').innerHTML = html;
    this.playSound('win');
  }

  /**
   * Start game timer
   */
  startTimer() {
    const timerEl = document.getElementById('timer');
    const interval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(interval);
        return;
      }
      timerEl.textContent = this.getCompletionTime() + 's';
    }, 1000);
  }
}

console.log('✅ BoxesGame loaded');
