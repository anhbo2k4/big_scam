/**
 * ================================================
 * CARDS GAME CONTROLLER
 * ================================================
 * Memory card matching game
 */

class CardsGame extends GameEngine {
  constructor(sessionCode, config, prizes) {
    super(sessionCode, 'cards', config);
    this.prizes = prizes;
    this.selected = [];
    this.matched = 0;
    this.moves = 0;
  }

  render(containerId) {
    const html = `
      <div class="game-container">
        <div class="game-header">
          <h2>🃏 Trò Chơi Bài</h2>
          <p>Tìm các cặp bài giống nhau</p>
          <div class="timer" id="timer">0s</div>
        </div>

        <div class="cards-game">
          <div class="cards-stats">
            <div class="stat-item small">
              <div class="stat-label">Nước Đi</div>
              <div class="stat-value" id="movesCount">0</div>
            </div>
            <div class="stat-item small">
              <div class="stat-label">Tìm Thấy</div>
              <div class="stat-value" id="matchedCount">0/${this.prizes.length}</div>
            </div>
          </div>

          <div class="cards-grid" id="cardsGrid">
            ${this.prizes.map((prize, idx) => `
              <div class="card" data-index="${idx}" onclick="flipCard(${idx})">
                <div class="card-inner">
                  <div class="card-back">?</div>
                  <div class="card-front" style="color: ${prize.color || '#8b5cf6'}">
                    ${prize.icon || '🎁'}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById(containerId).innerHTML = html;
    this.startTimer();
  }

  selectCard(index) {
    const card = document.querySelector(`[data-index="${index}"]`);

    // Already matched or flipped
    if (card.classList.contains('matched') || card.classList.contains('flipped') || this.selected.length >= 2) {
      return;
    }

    card.classList.add('flipped');
    this.selected.push(index);

    if (this.selected.length === 2) {
      this.moves++;
      document.getElementById('movesCount').textContent = this.moves;

      const [first, second] = this.selected;
      const el1 = document.querySelector(`[data-index="${first}"]`);
      const el2 = document.querySelector(`[data-index="${second}"]`);

      const match = this.prizes[first].name === this.prizes[second].name;

      setTimeout(() => {
        if (match) {
          el1.classList.add('matched');
          el2.classList.add('matched');
          this.matched += 2;

          const totalPairs = this.prizes.length;
          document.getElementById('matchedCount').textContent = `${this.matched}/${totalPairs}`;

          // Play match sound
          this.playSound('match');

          if (this.matched === totalPairs) {
            setTimeout(() => this.endGame(0), 500);
          }
        } else {
          el1.classList.remove('flipped');
          el2.classList.remove('flipped');
          this.playSound('nomatch');
        }

        this.selected = [];
      }, 600);
    }
  }

  playSound(type) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      oscillator.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'match') {
        // Success sound: ascending tones
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.2);
      } else {
        // Fail sound: descending tone
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.2);
      }
    } catch (err) {
      console.warn('Audio not available:', err);
    }
  }

  endGame(prizeIndex) {
    this.state = 'completed';
    const prize = this.prizes[prizeIndex || 0];
    this.selectedPrize = prize;

    const completionTime = this.getCompletionTime();
    console.log(`✅ Cards game completed in ${completionTime}s (${this.moves} moves)`);

    fetch(`/api/game/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_code: this.sessionCode,
        game_type: this.gameType,
        prize_id: prize.id,
        completion_time: completionTime,
        extra_data: { moves: this.moves, total_pairs: this.prizes.length }
      })
    }).catch(err => console.error(err));

    this.showResultScreen(prize);
  }

  showResultScreen(prize) {
    const resultColor = prize.color || '#8b5cf6';
    const perfection = this.moves <= this.prizes.length ? '⭐ Hoàn Hảo!' : '';

    const html = `
      <div class="result-screen">
        <div class="result-emoji" style="color: ${resultColor}">🎉</div>
        <h2 class="result-title">Chúc Mừng!</h2>
        <p class="result-message">Bạn đã hoàn thành trò chơi</p>
        
        <div class="result-detail">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">${prize.icon || '🎁'}</div>
          <strong style="color: ${resultColor}; font-size: 1.4rem;">${prize.name}</strong>
          ${prize.cash_amount ? `<p>💰 ${prize.cash_amount.toLocaleString()}đ</p>` : ''}
          <p style="font-size: 0.95rem; opacity: 0.8;">
            <strong>${this.moves}</strong> nước đi
            ${perfection ? `<span style="color: gold; font-weight: bold;"> ${perfection}</span>` : ''}
          </p>
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
function flipCard(index) {
  if (window.cardsGameInstance) {
    window.cardsGameInstance.selectCard(index);
  }
}

console.log('✅ CardsGame class loaded');
