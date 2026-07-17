/**
 * ================================================
 * MYSTERY GAME CONTROLLER
 * ================================================
 * Hidden box matching game
 */

class MysteryGame extends GameEngine {
  constructor(sessionCode, config, prizes) {
    super(sessionCode, 'mystery', config);
    this.prizes = prizes;
    this.selected = [];
    this.matched = 0;
    this.clicks = 0;
  }

  render(containerId) {
    const html = `
      <div class="game-container">
        <div class="game-header">
          <h2>🎁 Hộp Bí Ẩn</h2>
          <p>Tìm 3 hộp có cùng giải thưởng</p>
          <div class="timer" id="timer">0s</div>
        </div>

        <div class="mystery-game">
          <div class="mystery-boxes" id="mysteryBoxes">
            ${this.prizes.map((prize, idx) => `
              <div class="mystery-box" data-index="${idx}" onclick="selectMysteryBox(this, ${idx})">
                <div class="mystery-box-inner">
                  <div class="mystery-box-back">?</div>
                  <div class="mystery-box-front" style="color: ${prize.color || '#8b5cf6'}">
                    <div class="mystery-box-emoji">${prize.icon || '🎁'}</div>
                    <div class="mystery-box-name">${prize.name}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="mystery-stats">
            <div class="stat-item">
              <div class="stat-label">Trúng Tìm</div>
              <div class="stat-value" id="matchCount">0</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Tổng Chọn</div>
              <div class="stat-value" id="totalClicks">0</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById(containerId).innerHTML = html;
    this.startTimer();
  }

  attachEventListeners() {
    // Event delegation handled by onclick attributes above
  }

  selectBox(el, index) {
    if (el.classList.contains('found') || this.selected.length >= 2 || el.classList.contains('flipped')) {
      return;
    }

    el.classList.add('flipped');
    this.selected.push(index);
    this.clicks++;
    document.getElementById('totalClicks').textContent = this.clicks;

    if (this.selected.length === 2) {
      const [first, second] = this.selected;
      const el1 = document.querySelector(`[data-index="${first}"]`);
      const el2 = document.querySelector(`[data-index="${second}"]`);

      const match = this.prizes[first].name === this.prizes[second].name;

      setTimeout(() => {
        if (match) {
          el1.classList.add('found');
          el2.classList.add('found');
          this.matched += 2;
          document.getElementById('matchCount').textContent = this.matched;

          if (this.matched === this.prizes.length) {
            this.endGame(0);
          }
        } else {
          el1.classList.remove('flipped');
          el2.classList.remove('flipped');
        }

        this.selected = [];
      }, 600);
    }
  }

  endGame(prizeIndex) {
    this.state = 'completed';
    const prize = this.prizes[prizeIndex || 0];
    this.selectedPrize = prize;

    const completionTime = this.getCompletionTime();

    fetch(`/api/game/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_code: this.sessionCode,
        game_type: this.gameType,
        prize_id: prize.id,
        completion_time: completionTime,
        extra_data: { clicks: this.clicks, matched: this.matched }
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
        <p class="result-message">Bạn đã hoàn thành trò chơi</p>
        
        <div class="result-detail">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">${prize.icon || '🎁'}</div>
          <strong style="color: ${resultColor}; font-size: 1.4rem;">${prize.name}</strong>
          ${prize.cash_amount ? `<p>💰 ${prize.cash_amount.toLocaleString()}đ</p>` : ''}
          <p style="font-size: 0.9rem; opacity: 0.8;">Lần nhấp: <strong>${this.clicks}</strong></p>
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

// Global function for onclick binding
function selectMysteryBox(el, index) {
  if (window.mysteryGameInstance) {
    window.mysteryGameInstance.selectBox(el, index);
  }
}
