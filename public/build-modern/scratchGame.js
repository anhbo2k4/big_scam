/**
 * ================================================
 * SCRATCH GAME CONTROLLER
 * ================================================
 * Interactive scratch card game
 */

class ScratchGame extends GameEngine {
  constructor(sessionCode, config, prizes) {
    super(sessionCode, 'scratch', config);
    this.prizes = prizes;
    this.canvas = null;
    this.ctx = null;
    this.isScratching = false;
    this.scratchAmount = 0;
    this.revealThreshold = config.reveal_threshold || 0.5;
  }

  render(containerId) {
    const html = `
      <div class="game-container">
        <div class="game-header">
          <h2>🎫 Cào Quà</h2>
          <p>Cào để phát hiện giải thưởng</p>
          <div class="timer" id="timer">0s</div>
        </div>

        <div class="scratch-game-wrapper">
          <div class="scratch-card">
            <div class="scratch-revealed">
              <div class="prize-emoji">${this.prizes[0].icon || '🎁'}</div>
              <div class="prize-name">${this.prizes[0].name}</div>
              <div class="prize-value">💰 ${(this.prizes[0].cash_amount || 0).toLocaleString()}đ</div>
            </div>
            <canvas id="scratchCanvas" class="scratch-canvas" width="300" height="350"></canvas>
          </div>
        </div>

        <div class="scratch-info">
          <p>Cào <strong>${Math.round(this.revealThreshold * 100)}%</strong> để phát hiện</p>
          <div class="scratch-progress">
            <div class="scratch-progress-bar" id="progressBar"></div>
          </div>
          <p id="progressText">0%</p>
        </div>
      </div>
    `;

    document.getElementById(containerId).innerHTML = html;

    // Setup canvas
    this.canvas = document.getElementById('scratchCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Draw scratch layer (golden)
    this.ctx.fillStyle = '#d4af37';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Add text
    this.ctx.fillStyle = '#a0860f';
    this.ctx.font = 'bold 18px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('CÀO ĐỂ NHẬN', this.canvas.width / 2, this.canvas.height / 2 - 20);
    this.ctx.fillText('THƯỞNG', this.canvas.width / 2, this.canvas.height / 2 + 20);

    this.attachEventListeners();
    this.startTimer();
  }

  attachEventListeners() {
    this.canvas.addEventListener('mousedown', () => { this.isScratching = true; });
    this.canvas.addEventListener('mouseup', () => { this.isScratching = false; });
    this.canvas.addEventListener('mousemove', (e) => this.scratch(e));
    this.canvas.addEventListener('touchstart', () => { this.isScratching = true; });
    this.canvas.addEventListener('touchend', () => { this.isScratching = false; });
    this.canvas.addEventListener('touchmove', (e) => this.scratch(e));
  }

  scratch(event) {
    if (!this.isScratching) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
    const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;

    // Clear circular area
    this.ctx.clearRect(x - 25, y - 25, 50, 50);
    this.scratchAmount += 50 * 50;

    // Update progress
    const totalArea = this.canvas.width * this.canvas.height;
    const percentage = this.scratchAmount / totalArea;
    const percent = Math.min(100, Math.round(percentage * 100));

    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('progressText').textContent = percent + '%';

    // Check if threshold reached
    if (percentage >= this.revealThreshold) {
      this.canvas.style.pointerEvents = 'none';
      setTimeout(() => this.endGame(0), 300);
    }
  }

  endGame(prizeIndex) {
    this.state = 'completed';
    const prize = this.prizes[prizeIndex || 0];
    this.selectedPrize = prize;

    const completionTime = this.getCompletionTime();

    // Save to server
    fetch(`/api/game/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_code: this.sessionCode,
        game_type: this.gameType,
        prize_id: prize.id,
        completion_time: completionTime
      })
    }).catch(err => {});

    this.showResultScreen(prize);
  }

  showResultScreen(prize) {
    const resultColor = prize.color || '#8b5cf6';
    const html = `
      <div class="result-screen">
        <div class="result-emoji" style="color: ${resultColor}">🎉</div>
        <h2 class="result-title">Chúc Mừng!</h2>
        <p class="result-message">Bạn đã thắng giải thưởng</p>
        
        <div class="result-detail">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">${prize.icon || '🎁'}</div>
          <strong style="color: ${resultColor}; font-size: 1.4rem;">${prize.name}</strong>
          ${prize.cash_amount ? `<p>💰 ${prize.cash_amount.toLocaleString()}đ</p>` : ''}
          <p style="font-size: 0.9rem; opacity: 0.8;">Rarity: <strong>${prize.rarity || 'common'}</strong></p>
        </div>

        <div class="result-buttons">
          <button class="btn btn-primary" onclick="location.href='/thank-you'">
            ✅ Nhận Thưởng
          </button>
          <button class="btn btn-secondary" onclick="shareResult()">
            📤 Chia Sẻ
          </button>
        </div>
      </div>
    `;

    document.querySelector('.game-container').innerHTML = html;
  }

  startTimer() {
    this.startTime = Date.now();
    const timerId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const timerEl = document.getElementById('timer');
      if (timerEl) timerEl.textContent = elapsed + 's';
      else clearInterval(timerId);
    }, 1000);
  }
}
