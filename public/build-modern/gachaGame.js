/**
 * ================================================
 * GACHA GAME CONTROLLER
 * ================================================
 * Rarity-based summon/pull game with pity system
 */

class GachaGame extends GameEngine {
  constructor(sessionCode, config, prizes) {
    super(sessionCode, 'gacha', config);
    this.prizes = prizes;
    this.pityCount = config.pity_count || 0;
    this.pityThreshold = config.pity_threshold || 50;
    this.pulls = [];
    this.totalPulls = 0;
  }

  render(containerId) {
    const html = `
      <div class="game-container">
        <div class="game-header">
          <h2>✨ Gacha - Triệu Hồi</h2>
          <p>Lấy giải thưởng bí mật mỗi lần triệu hồi</p>
          <div class="timer" id="timer">0s</div>
        </div>

        <div class="gacha-container">
          <div class="pull-buttons">
            <button class="pull-button" id="pullBtn1" onclick="gachaPull(1)">
              🎟️ 1 Lần Quay
            </button>
            <button class="pull-button bulk" id="pullBtn10" onclick="gachaPull(10)">
              🎟️⨯10 Quay (10% Giảm)
            </button>
          </div>

          <div class="pulls-result" id="pullResult"></div>

          <div class="pity-status">
            <div class="pity-label">Pity Counter (Đảm bảo SSR/Legendary)</div>
            <div class="pity-progress">
              <div class="pity-bar" id="pityBar" style="width: ${(this.pityCount / this.pityThreshold) * 100}%"></div>
            </div>
            <div class="pity-count">
              <span id="pityCount">${this.pityCount}</span> / ${this.pityThreshold}
            </div>
          </div>

          <div class="gacha-stats">
            <p>Tổng Quay: <strong id="totalPullsCount">0</strong></p>
          </div>
        </div>
      </div>
    `;

    document.getElementById(containerId).innerHTML = html;
    this.startTimer();
  }

  getRandomPrize() {
    // Simple rarity-based probability
    const rand = Math.random();
    let rarityFilter;

    // Weighted probability
    if (rand < 0.7) {
      rarityFilter = prize => prize.rarity === 'common' || prize.rarity === 'uncommon';
    } else if (rand < 0.95) {
      rarityFilter = prize => prize.rarity === 'rare' || prize.rarity === 'epic';
    } else {
      rarityFilter = prize => prize.rarity === 'legendary' || prize.rarity === 'mythic';
    }

    const filtered = this.prizes.filter(rarityFilter);
    return filtered.length > 0 
      ? filtered[Math.floor(Math.random() * filtered.length)]
      : this.prizes[Math.floor(Math.random() * this.prizes.length)];
  }

  playSound(rarity) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    // Frequency based on rarity
    const frequencies = {
      'common': 440,
      'uncommon': 550,
      'rare': 660,
      'epic': 770,
      'legendary': 1000,
      'mythic': 1200
    };

    oscillator.frequency.value = frequencies[rarity] || 440;
    oscillator.type = 'sine';

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
  }

  async pull(count) {
    const btn1 = document.getElementById('pullBtn1');
    const btn10 = document.getElementById('pullBtn10');
    btn1.disabled = true;
    btn10.disabled = true;

    const results = [];

    for (let i = 0; i < count; i++) {
      const prize = this.getRandomPrize();
      results.push(prize);
      this.pulls.push(prize);
      this.totalPulls++;
      this.pityCount++;

      // Reset pity on legendary
      if (prize.rarity === 'legendary' || prize.rarity === 'mythic') {
        this.pityCount = 0;
      }

      // Force legendary after pity threshold
      if (this.pityCount >= this.pityThreshold) {
        results[results.length - 1] = this.prizes.find(p => p.rarity === 'legendary') || prize;
        this.pityCount = 0;
      }

      this.playSound(prize.rarity);
      await new Promise(r => setTimeout(r, 300));
    }

    // Update UI
    const pityPercentage = (this.pityCount / this.pityThreshold) * 100;
    document.getElementById('pityBar').style.width = pityPercentage + '%';
    document.getElementById('pityCount').textContent = this.pityCount;
    document.getElementById('totalPullsCount').textContent = this.totalPulls;

    // Display results
    const resultHtml = results.map((prize, idx) => `
      <div class="pull-item ${prize.rarity}" style="animation-delay: ${idx * 100}ms">
        <div class="pull-item-emoji">${prize.icon || '💎'}</div>
        <div class="pull-item-name">${prize.name}</div>
        <div class="pull-item-rarity">${prize.rarity}</div>
        ${prize.cash_amount ? `<div class="pull-item-value">💰 ${prize.cash_amount.toLocaleString()}đ</div>` : ''}
      </div>
    `).join('');

    document.getElementById('pullResult').innerHTML = resultHtml;

    // Complete game on any pull
    await new Promise(r => setTimeout(r, 1500));
    this.endGame(this.prizes.indexOf(results[0]));

    btn1.disabled = false;
    btn10.disabled = false;
  }

  endGame(prizeIndex) {
    this.state = 'completed';
    const prize = this.prizes[prizeIndex || 0];
    this.selectedPrize = prize;

    const completionTime = this.getCompletionTime();
    console.log(`✅ Gacha game completed in ${completionTime}s (${this.totalPulls} pulls)`);

    fetch(`/api/game/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_code: this.sessionCode,
        game_type: this.gameType,
        prize_id: prize.id,
        completion_time: completionTime,
        extra_data: { total_pulls: this.totalPulls, pity_resets: 0 }
      })
    }).catch(err => console.error(err));

    this.showResultScreen(prize);
  }

  showResultScreen(prize) {
    const resultColor = prize.color || '#8b5cf6';
    const html = `
      <div class="result-screen">
        <div class="result-emoji" style="color: ${resultColor}">✨</div>
        <h2 class="result-title">Triệu Hồi Thành Công!</h2>
        <p class="result-message">Bạn đã nhận được</p>
        
        <div class="result-detail">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">${prize.icon || '✨'}</div>
          <strong style="color: ${resultColor}; font-size: 1.4rem;">${prize.name}</strong>
          <p style="color: ${resultColor}; text-transform: uppercase; font-weight: bold; margin: 5px 0;">${prize.rarity}</p>
          ${prize.cash_amount ? `<p>💰 ${prize.cash_amount.toLocaleString()}đ</p>` : ''}
          <p style="font-size: 0.9rem; opacity: 0.8;">Tổng Quay: <strong>${this.totalPulls}</strong></p>
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
function gachaPull(count) {
  if (window.gachaGameInstance) {
    window.gachaGameInstance.pull(count);
  }
}

console.log('✅ GachaGame class loaded');
