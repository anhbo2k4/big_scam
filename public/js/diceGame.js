/**
 * ================================================
 * DICE GAME CONTROLLER
 * ================================================
 * 3D6 rolling and summing game
 */

class DiceGame extends GameEngine {
  constructor(sessionCode, config, prizes) {
    super(sessionCode, 'dice', config);
    this.prizes = prizes;
    this.results = [0, 0, 0];
    this.isRolling = false;
  }

  render(containerId) {
    const html = `
      <div class="game-container">
        <div class="game-header">
          <h2>🎲 Xúc Sắc</h2>
          <p>Tung 3 xúc sắc để nhận giải thưởng</p>
          <div class="timer" id="timer">0s</div>
        </div>

        <div class="dice-container">
          <div class="dice-roller">
            <div class="dice" id="dice1">1</div>
            <div class="dice" id="dice2">1</div>
            <div class="dice" id="dice3">1</div>
          </div>

          <button class="roll-button" id="rollBtn" onclick="rollDice()">
            🎲 TUNG NGAY
          </button>

          <div class="roll-result" id="rollResult"></div>

          <div class="roll-stats">
            <p id="rollSum"></p>
            <p id="rollMessage"></p>
          </div>
        </div>
      </div>
    `;

    document.getElementById(containerId).innerHTML = html;
    this.startTimer();
  }

  async roll() {
    const btn = document.getElementById('rollBtn');
    if (this.isRolling || btn.disabled) return;

    this.isRolling = true;
    btn.disabled = true;
    btn.textContent = '⏳ ĐANG TUNG...';

    const dices = [
      document.getElementById('dice1'),
      document.getElementById('dice2'),
      document.getElementById('dice3')
    ];

    // Animate rolling for 1.5 seconds
    dices.forEach(d => d.classList.add('rolling'));

    let rollInterval = setInterval(() => {
      dices.forEach(d => {
        d.textContent = Math.floor(Math.random() * 6) + 1;
      });
    }, 50);

    await new Promise(r => setTimeout(r, 1500));
    clearInterval(rollInterval);

    // Set final results
    this.results = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];

    dices.forEach((d, i) => {
      d.textContent = this.results[i];
      d.classList.remove('rolling');
    });

    const total = this.results.reduce((a, b) => a + b, 0);
    const isWin = total >= 15;
    const message = isWin 
      ? '🎉 Bạn Thắng Rồi!' 
      : '✨ Hãy Thử Lại Lần Sau';

    document.getElementById('rollSum').innerHTML = `<strong>Tổng: ${total}</strong>`;
    document.getElementById('rollMessage').textContent = message;

    this.playSound(isWin ? 'win' : 'lose');

    await new Promise(r => setTimeout(r, 1000));
    this.endGame(0);
  }

  playSound(type) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      oscillator.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'win') {
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);

        // Play second tone
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.value = 800;
        gain2.gain.setValueAtTime(0.2, audioCtx.currentTime + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc2.start(audioCtx.currentTime + 0.2);
        osc2.stop(audioCtx.currentTime + 0.5);
      } else {
        oscillator.frequency.value = 300;
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
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
    const total = this.results.reduce((a, b) => a + b, 0);

    console.log(`✅ Dice game completed in ${completionTime}s (Total: ${total})`);

    fetch(`/api/game/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_code: this.sessionCode,
        game_type: this.gameType,
        prize_id: prize.id,
        completion_time: completionTime,
        extra_data: { dice_total: total, dice_values: this.results }
      })
    }).catch(err => console.error(err));

    this.showResultScreen(prize);
  }

  showResultScreen(prize) {
    const resultColor = prize.color || '#8b5cf6';
    const total = this.results.reduce((a, b) => a + b, 0);

    const html = `
      <div class="result-screen">
        <div class="result-emoji" style="color: ${resultColor}">🎉</div>
        <h2 class="result-title">Kết Quả</h2>
        <p class="result-message">Bạn đã tung được</p>
        
        <div class="result-detail">
          <div style="font-size: 1.5rem; margin-bottom: 10px; letter-spacing: 10px;">
            ${this.results[0]} 🎲 ${this.results[1]} 🎲 ${this.results[2]}
          </div>
          <strong style="color: ${resultColor}; font-size: 1.5rem;">Tổng: ${total}</strong>
          <div style="font-size: 2.5rem; margin: 20px 0;">${prize.icon || '🎁'}</div>
          <strong style="color: ${resultColor}; font-size: 1.4rem;">${prize.name}</strong>
          ${prize.cash_amount ? `<p>💰 ${prize.cash_amount.toLocaleString()}đ</p>` : ''}
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
function rollDice() {
  if (window.diceGameInstance) {
    window.diceGameInstance.roll();
  }
}

console.log('✅ DiceGame class loaded');
