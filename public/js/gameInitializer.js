/**
 * ================================================
 * GAME INITIALIZER - Bootstrap & Setup
 * ================================================
 */

let gameEngine = null;
let boxesGame = null;
let wheelGame = null;

/**
 * Initialize game from session code
 */
async function initializeGame(sessionCode) {
  try {
    console.log('🎮 Initializing game:', sessionCode);

    // Fetch game configuration
    const response = await fetch(`/api/games/${sessionCode}/config`);
    const data = await response.json();

    if (!data.success) {
      showError('❌ Game session not found');
      return;
    }

    const { game_type, box_count, config, prizes } = data.data;

    console.log(`✅ Game Type: ${game_type}, Boxes: ${box_count}`);

    // Initialize appropriate game controller
    switch (game_type) {
      case 'boxes':
        boxesGame = new BoxesGame(sessionCode, config, prizes);
        boxesGame.render('gameContainer');
        gameEngine = boxesGame;
        break;

      case 'wheel':
        wheelGame = new WheelGame(sessionCode, config, prizes);
        wheelGame.render('gameContainer');
        gameEngine = wheelGame;
        break;

      case 'scratch':
        initializeScratchGame(sessionCode, config, prizes);
        break;

      case 'mystery':
        initializeMysteryGame(sessionCode, config, prizes);
        break;

      case 'gacha':
        initializeGachaGame(sessionCode, config, prizes);
        break;

      case 'dice':
        initializeDiceGame(sessionCode, config, prizes);
        break;

      case 'cards':
        initializeCardsGame(sessionCode, config, prizes);
        break;

      default:
        showError('❌ Unknown game type: ' + game_type);
    }

  } catch (err) {
    console.error('❌ Error initializing game:', err);
    showError('❌ Failed to load game');
  }
}

/**
 * Initialize scratch game
 */
function initializeScratchGame(sessionCode, config, prizes) {
  const html = `
    <div class="game-container">
      <div class="game-header">
        <h1>🎫 Cào Quà</h1>
        <p>Cào để phát hiện giải thưởng</p>
      </div>

      <div style="display: flex; justify-content: center; margin: 40px 0;">
        <div class="scratch-card">
          <div class="scratch-revealed">
            <div class="prize-emoji">${prizes[0].icon || '🎁'}</div>
            <div class="prize-name">${prizes[0].name}</div>
            <div class="prize-value">💰 ${(prizes[0].cash_amount || 0).toLocaleString()}đ</div>
          </div>
          <canvas id="scratchCanvas" class="scratch-canvas" style="width: 100%; height: 100%;"></canvas>
        </div>
      </div>

      <div class="scratch-info">
        <p>Cào 50% để phát hiện giải thưởng</p>
        <div class="scratch-progress">
          <div class="scratch-progress-bar" id="progressBar"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('gameContainer').innerHTML = html;

  // Initialize scratch logic
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 500;

  // Draw scratch layer
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#a0860f';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CÀO ĐỂ NHẬN THƯỞNG', canvas.width / 2, canvas.height / 2);

  let scratchAmount = 0;
  let isScratching = false;

  canvas.addEventListener('mousedown', () => { isScratching = true; });
  canvas.addEventListener('mouseup', () => { isScratching = false; });
  canvas.addEventListener('mousemove', (e) => {
    if (!isScratching) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clear area
    ctx.clearRect(x - 20, y - 20, 40, 40);
    scratchAmount += 40 * 40;

    // Update progress
    const percentage = (scratchAmount / (canvas.width * canvas.height)) * 100;
    document.getElementById('progressBar').style.width = percentage + '%';

    // Check if 50% revealed
    if (percentage >= 50) {
      canvas.style.pointerEvents = 'none';
      setTimeout(() => completeGame(sessionCode, 0, prizes[0]), 500);
    }
  });

  // Touch support
  canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.clearRect(x - 20, y - 20, 40, 40);
    scratchAmount += 40 * 40;

    const percentage = (scratchAmount / (canvas.width * canvas.height)) * 100;
    document.getElementById('progressBar').style.width = percentage + '%';

    if (percentage >= 50) {
      canvas.style.pointerEvents = 'none';
      setTimeout(() => completeGame(sessionCode, 0, prizes[0]), 500);
    }
  });
}

/**
 * Initialize mystery game
 */
function initializeMysteryGame(sessionCode, config, prizes) {
  const html = `
    <div class="game-container">
      <div class="game-header">
        <h1>🎁 Hộp Bí Ẩn</h1>
        <p>Tìm 3 hộp có cùng giải thưởng</p>
      </div>

      <div class="mystery-game">
        <div class="mystery-boxes" id="mysteryBoxes">
          ${prizes.map((prize, idx) => `
            <div class="mystery-box" data-index="${idx}" onclick="selectMysteryBox(${idx})">
              <div class="mystery-box-number">${idx + 1}</div>
              <div class="mystery-box-prize">${prize.name}</div>
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

  document.getElementById('gameContainer').innerHTML = html;

  window.mysteryState = {
    selected: [],
    matched: 0,
    clicks: 0,
    prizes
  };

  window.selectMysteryBox = function(index) {
    const state = window.mysteryState;
    const box = document.querySelector(`[data-index="${index}"]`);

    if (box.classList.contains('found') || state.selected.length >= 2) {
      return;
    }

    if (state.selected.includes(index)) {
      return;
    }

    state.selected.push(index);
    state.clicks++;
    box.classList.add('flipped');

    document.getElementById('totalClicks').textContent = state.clicks;

    if (state.selected.length === 2) {
      const [first, second] = state.selected;
      const match = state.prizes[first].name === state.prizes[second].name;

      setTimeout(() => {
        if (match) {
          document.querySelector(`[data-index="${first}"]`).classList.add('found');
          document.querySelector(`[data-index="${second}"]`).classList.add('found');
          state.matched += 2;
          document.getElementById('matchCount').textContent = state.matched;

          if (state.matched === state.prizes.length) {
            completeGame(sessionCode, 0, state.prizes[0]);
          }
        } else {
          document.querySelector(`[data-index="${first}"]`).classList.remove('flipped');
          document.querySelector(`[data-index="${second}"]`).classList.remove('flipped');
        }

        state.selected = [];
      }, 600);
    }
  };
}

/**
 * Initialize gacha/summon game
 */
function initializeGachaGame(sessionCode, config, prizes) {
  const html = `
    <div class="game-container">
      <div class="game-header">
        <h1>✨ Gacha</h1>
        <p>Triệu hồi để nhận giải thưởng</p>
      </div>

      <div class="gacha-container">
        <div class="pull-buttons">
          <button class="pull-button" onclick="gachaPull(1)">🎟️ 1 Lần Quay</button>
          <button class="pull-button bulk" onclick="gachaPull(10)">🎟️⨯10 Quay (10% Giảm)</button>
        </div>

        <div class="pulls-result" id="pullResult"></div>

        <div class="pity-status">
          <div class="pity-label">Pity Counter (Đảm bảo SSR)</div>
          <div class="pity-progress">
            <div class="pity-bar" id="pityBar"></div>
          </div>
          <div class="pity-count">
            <span id="pityCount">0</span> / 50
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('gameContainer').innerHTML = html;

  window.gachaState = {
    pityCount: 0,
    prizes
  };

  window.gachaPull = async function(count) {
    const state = window.gachaState;
    const results = [];

    for (let i = 0; i < count; i++) {
      const prize = state.prizes[Math.floor(Math.random() * state.prizes.length)];
      results.push(prize);
      state.pityCount++;

      if (prize.rarity === 'legendary') {
        state.pityCount = 0; // Reset on legendary
      }
    }

    // Update pity
    const pityPercentage = (state.pityCount / 50) * 100;
    document.getElementById('pityBar').style.width = pityPercentage + '%';
    document.getElementById('pityCount').textContent = state.pityCount;

    // Display results
    const resultHtml = results.map(prize => `
      <div class="pull-item ${prize.rarity}">
        <div class="pull-item-emoji">${prize.icon || '💎'}</div>
        <div class="pull-item-name">${prize.name}</div>
        <div class="pull-item-rarity">${prize.rarity}</div>
      </div>
    `).join('');

    document.getElementById('pullResult').innerHTML = resultHtml;

    // Complete game on first pull
    if (count >= 1) {
      await new Promise(r => setTimeout(r, 1000));
      await completeGame(sessionCode, 0, results[0]);
    }
  };
}

/**
 * Initialize dice game
 */
function initializeDiceGame(sessionCode, config, prizes) {
  const html = `
    <div class="game-container">
      <div class="game-header">
        <h1>🎲 Xúc Sắc</h1>
        <p>Tung 3 xúc sắc</p>
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
      </div>
    </div>
  `;

  document.getElementById('gameContainer').innerHTML = html;

  window.rollDice = async function() {
    const btn = document.getElementById('rollBtn');
    if (btn.disabled) return;

    btn.disabled = true;
    btn.textContent = '⏳ ĐANG TUNG...';

    const dices = [
      document.getElementById('dice1'),
      document.getElementById('dice2'),
      document.getElementById('dice3')
    ];

    // Animate rolling
    dices.forEach(d => d.classList.add('rolling'));

    await new Promise(r => setTimeout(r, 1500));

    dices.forEach(d => d.classList.remove('rolling'));

    // Generate results
    const results = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];

    dices.forEach((d, i) => {
      d.textContent = results[i];
    });

    const total = results.reduce((a, b) => a + b, 0);
    document.getElementById('rollResult').innerHTML = `
      <strong>Tổng: ${total}</strong> ${total >= 15 ? '🎉 Bạn Thắng!' : ''}
    `;

    await new Promise(r => setTimeout(r, 1000));
    await completeGame(sessionCode, 0, window.gachaState?.prizes[0] || {});
  };
}

/**
 * Initialize cards game
 */
function initializeCardsGame(sessionCode, config, prizes) {
  const html = `
    <div class="game-container">
      <div class="game-header">
        <h1>🃏 Trò Chơi Bài</h1>
        <p>Tìm các cặp bài giống nhau</p>
      </div>

      <div class="cards-game">
        <div class="cards-grid" id="cardsGrid">
          ${prizes.map((prize, idx) => `
            <div class="card" data-index="${idx}" onclick="flipCard(${idx})">
              <div class="card-content">
                <div class="card-back">?</div>
                <div class="card-front">${prize.icon || '🎁'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('gameContainer').innerHTML = html;

  window.cardsState = {
    selected: [],
    matched: 0,
    prizes
  };

  window.flipCard = async function(index) {
    const state = window.cardsState;
    const card = document.querySelector(`[data-index="${index}"]`);

    if (card.classList.contains('flipped') || state.selected.length >= 2) {
      return;
    }

    card.classList.add('flipped');
    state.selected.push(index);

    if (state.selected.length === 2) {
      const [first, second] = state.selected;
      const match = state.prizes[first].name === state.prizes[second].name;

      await new Promise(r => setTimeout(r, 600));

      if (!match) {
        document.querySelector(`[data-index="${first}"]`).classList.remove('flipped');
        document.querySelector(`[data-index="${second}"]`).classList.remove('flipped');
      } else {
        state.matched += 2;
      }

      state.selected = [];

      if (state.matched === state.prizes.length) {
        await completeGame(sessionCode, 0, state.prizes[0]);
      }
    }
  };
}

/**
 * Complete game and show result
 */
async function completeGame(sessionCode, prizeIndex, prize) {
  const html = `
    <div class="result-screen">
      <div class="result-emoji" style="color: ${prize.color || '#8b5cf6'}">🎉</div>
      <h2 class="result-title">Chúc Mừng!</h2>
      <p class="result-message">Bạn đã thắng giải thưởng</p>
      
      <div class="result-detail">
        <div style="font-size: 2rem; margin-bottom: 10px;">${prize.icon || '🎁'}</div>
        <strong style="color: ${prize.color || '#8b5cf6'}; font-size: 1.3rem;">${prize.name}</strong>
        ${prize.cash_amount ? `<p>💰 ${prize.cash_amount.toLocaleString()}đ</p>` : ''}
        <p style="font-size: 0.9rem; opacity: 0.8;">Rarity: <strong>${prize.rarity || 'common'}</strong></p>
      </div>

      <div class="result-buttons">
        <button class="btn btn-primary" onclick="location.href='/thank-you'">
          Nhận Thưởng
        </button>
      </div>
    </div>
  `;

  document.querySelector('.game-container').innerHTML = html;
}

/**
 * Show error message
 */
function showError(message) {
  const html = `
    <div class="game-container">
      <div class="result-screen">
        <div class="result-emoji">❌</div>
        <h2 class="result-title">Lỗi</h2>
        <p class="result-message">${message}</p>
        <button class="btn btn-primary" onclick="location.href='/'">
          Quay Lại
        </button>
      </div>
    </div>
  `;

  document.getElementById('gameContainer').innerHTML = html;
}

console.log('✅ Game Initializer loaded');
