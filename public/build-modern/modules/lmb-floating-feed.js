/**
 * Floating Feed Module — lazy loaded after core JS
 * Contains: winner ticker, floating notifications (home + game), real feed refresh
 * Depends on: state, translateExactTextByMap (from main file global scope)
 */

// When loaded as a classic script (build-legacy / dynamic loadSequentially),
// `state` is not in scope — alias it from window so all references below work.
/* eslint-disable no-var */
var state = (typeof state !== 'undefined') ? state : window.state;
var translateExactTextByMap = (typeof translateExactTextByMap !== 'undefined') ? translateExactTextByMap : (window.translateExactTextByMap || function(t) { return t; });
/* eslint-enable no-var */

const TICKER_FIRST_NAMES = [
  'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Huynh', 'Phan', 'Vu', 'Vo', 'Dang',
  'Bui', 'Do', 'Ho', 'Ngo', 'Duong', 'Ly', 'Truong', 'Dinh', 'Mai', 'Luu',
  'Chu', 'Trinh', 'Cao', 'Ta', 'Ton', 'La', 'Diep', 'Ninh'
];

const TICKER_MIDDLE_NAMES = [
  'Van', 'Thi', 'Ngoc', 'Thanh', 'Quoc', 'Gia', 'Phuong', 'Duc', 'Minh', 'Anh',
  'Hong', 'Bao', 'Nhat', 'Huu', 'Hoang', 'Thu', 'Kim', 'Xuan', 'Tien', 'Khanh',
  'Ha', 'Quynh', 'My', 'Gia Han'
];

const TICKER_LAST_NAMES = [
  'An', 'Binh', 'Cuong', 'Dung', 'Dat', 'Giang', 'Hanh', 'Hoa', 'Kiet', 'Linh',
  'Long', 'My', 'Nam', 'Phuc', 'Quan', 'Son', 'Trang', 'Vy', 'Yen', 'Khoa',
  'Hieu', 'Thuy', 'Ngan', 'Khanh', 'Lam', 'Truc', 'Nhi', 'Hao', 'Tuan', 'Phuong'
];

const TICKER_PRIZE_PREFIX = [
  'O to', 'Xe dien', 'Dien thoai', 'Vang SJC', 'Bac 999', 'Kim cuong', 'Dong ho',
  'Tien thuong', 'Voucher', 'Qua dac biet', 'Bo trang suc', 'Set qua cao cap',
  'The VIP', 'Qua cong nghe', 'Qua sieu xe'
];

const TICKER_PRIZE_SUFFIX = [
  'cao cap', 'gaming', 'thoi trang', 'gia dung', 'cong nghe', 'dac biet', 'sieu vip',
  'ban gioi han', 'pro', 'premium', 'plus', '2026', 'hot trend', 'doc quyen',
  'bat ngo', 'sieu tiet kiem', 'xinh xan', 'sang trong', 'dang yeu', 'chat luong cao'
];

function showWinNoti(message = 'Ch\u00fac m\u1eebng! C\u00f3 ng\u01b0\u1eddi ch\u01a1i v\u1eeba nh\u1eadn th\u01b0\u1edfng') {
  const container = document.getElementById('winNotiContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'win-noti';
  el.innerHTML = `<span class="dot-green"></span><span>${message}</span>`;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 320);
  }, 3600);
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildNamePool(size = 100) {
  const pool = [];
  const used = new Set();
  let guard = 0;
  while (pool.length < size && guard < size * 40) {
    guard += 1;
    const full = `${randomItem(TICKER_FIRST_NAMES)} ${randomItem(TICKER_MIDDLE_NAMES)} ${randomItem(TICKER_LAST_NAMES)}`;
    if (used.has(full)) continue;
    used.add(full);
    pool.push(full);
  }
  return pool;
}

function buildPrizePool(size = 100) {
  const values = [100, 150, 200, 300, 500, 700, 1000, 1500, 2000, 3000, 5000];
  const pool = [];
  const used = new Set();
  let guard = 0;
  while (pool.length < size && guard < size * 50) {
    guard += 1;
    const value = randomItem(values);
    const prize = `${randomItem(TICKER_PRIZE_PREFIX)} ${value}K ${randomItem(TICKER_PRIZE_SUFFIX)}`;
    if (used.has(prize)) continue;
    used.add(prize);
    pool.push(prize);
  }
  return pool;
}

const TICKER_NAMES = buildNamePool(100);
const TICKER_PRIZES = buildPrizePool(100);
const FORCED_NOTIFICATION_IMAGE_URL = '/images/logo-floating.webp';
const DEFAULT_FLOATING_PRIZE_POOL = [
  'L\u00ec x\u00ec tr\u1ecb gi\u00e1 88,888 NDT',
  'L\u00ec x\u00ec tr\u1ecb gi\u00e1 3,888 USD',
  'L\u00ec x\u00ec tr\u1ecb gi\u00e1 50,000,000 VND',
  '1 c\u00e2y v\u00e0ng SJC 9999',
  '\u00d4 t\u00f4 h\u1ea1ng sang',
  '\u00d4 t\u00f4 \u0111i\u1ec7n cao c\u1ea5p',
  '\u00d4 t\u00f4 \u0111i\u1ec7n h\u1ea1ng sang phi\u00ean b\u1ea3n gi\u1edbi h\u1ea1n',
  '\u00d4 t\u00f4 BMW 5 Series',
  '\u00d4 t\u00f4 Mercedes C300',
  '\u00d4 t\u00f4 Lexus RX',
  'Xe m\u00e1y SH',
  '\u0110i\u1ec7n tho\u1ea1i iPhone 17 Pro Max',
  '\u0110i\u1ec7n tho\u1ea1i iPhone 17 Ultra',
  '\u0110i\u1ec7n tho\u1ea1i Samsung Galaxy S26 Ultra',
  '\u0110i\u1ec7n tho\u1ea1i Vertu Signature',
  'Voucher mua s\u1eafm 20,000,000 VND',
  'L\u00ec x\u00ec tr\u1ecb gi\u00e1 18,888 NDT',
  'L\u00ec x\u00ec tr\u1ecb gi\u00e1 1,888 USD',
  'L\u00ec x\u00ec tr\u1ecb gi\u00e1 8,888 USD',
  'L\u00ec x\u00ec tr\u1ecb gi\u00e1 120,000,000 VND',
  'L\u00ec x\u00ec tr\u1ecb gi\u00e1 88,000,000 VND',
  'L\u00ec x\u00ec tr\u1ecb gi\u00e1 68,000,000 VND',
  '1 ch\u1ec9 v\u00e0ng SJC 9999',
  '2 c\u00e2y v\u00e0ng SJC 9999',
  '3 c\u00e2y v\u00e0ng SJC 9999',
  '\u00d4 t\u00f4 h\u1ea1ng sang phi\u00ean b\u1ea3n gi\u1edbi h\u1ea1n',
  '\u00d4 t\u00f4 h\u1ea1ng sang full option',
  'Xe m\u00e1y SH 350i',
  'Xe m\u00e1y SH mode cao c\u1ea5p',
  '\u0110i\u1ec7n tho\u1ea1i iPhone 17 Pro',
  '\u0110i\u1ec7n tho\u1ea1i iPhone 17 Pro Max 1TB',
  'Voucher mua s\u1eafm 50,000,000 VND',
  'Voucher mua s\u1eafm 100,000,000 VND',
  'Tai nghe AirPods Pro',
  '\u0110\u1ed3ng h\u1ed3 th\u00f4ng minh cao c\u1ea5p',
  'MacBook Pro M4 Max',
  'iPad Pro 13-inch',
  'Tivi OLED 77 inch',
  '5 c\u00e2y v\u00e0ng SJC 9999',
  '10 c\u00e2y v\u00e0ng SJC 9999',
  '1kg b\u1ea1c 999',
  '5kg b\u1ea1c 999',
  'Nh\u1eabn kim c\u01b0\u01a1ng VVS1',
  'D\u00e2y chuy\u1ec1n v\u00e0ng 24K cao c\u1ea5p',
  'L\u1eafc tay v\u00e0ng tr\u1eafng \u0111\u00ednh kim c\u01b0\u01a1ng',
  'B\u1ed9 trang s\u1ee9c kim c\u01b0\u01a1ng',
  'Chuy\u1ebfn du l\u1ecbch 5 sao cho gia \u0111\u00ecnh',
  'B\u1ed9 vali Rimowa phi\u00ean b\u1ea3n gi\u1edbi h\u1ea1n',
  'Set n\u01b0\u1edbc hoa niche cao c\u1ea5p',
  'Laptop gaming RTX 5090',
  'B\u1ed9 sofa da \u00dd cao c\u1ea5p',
  'Th\u1ebb th\u00e0nh vi\u00ean golf VIP 1 n\u0103m',
  'Du thuy\u1ec1n tr\u1ea3i nghi\u1ec7m 2 ng\u00e0y 1 \u0111\u00eam',
  'B\u1ed9 camera full-frame chuy\u00ean nghi\u1ec7p',
  'Xe \u0111i\u1ec7n h\u1ea1ng sang',
  'Kim c\u01b0\u01a1ng 1 carat ch\u1ee9ng nh\u1eadn GIA',
  'Voucher ngh\u1ec9 d\u01b0\u1ee1ng 7 ng\u00e0y 6 \u0111\u00eam Maldives',
  'Combo n\u1ed9i th\u1ea5t th\u00f4ng minh to\u00e0n nh\u00e0',
  'Bi\u1ec7t th\u1ef1 ngh\u1ec9 d\u01b0\u1ee1ng cu\u1ed1i tu\u1ea7n',
  'Voucher th\u1eddi trang h\u00e0ng hi\u1ec7u 300,000,000 VND'
];
const HOME_FEED_ICONS = ['\uD83C\uDF81', '\uD83D\uDCB0', '\uD83C\uDFC6', '\u2B50', '\uD83D\uDD25'];
const HOME_FEED_OBJECT_IMAGES = [
  FORCED_NOTIFICATION_IMAGE_URL
];

function randomFeedDelayMs(cfg = {}) {
  const minRaw = Number(cfg.minIntervalMs || 0);
  const maxRaw = Number(cfg.maxIntervalMs || 0);
  if (Number.isFinite(minRaw) && Number.isFinite(maxRaw) && minRaw > 0 && maxRaw > 0) {
    const minMs = Math.max(300, Math.floor(Math.min(minRaw, maxRaw)));
    const maxMs = Math.max(minMs, Math.floor(Math.max(minRaw, maxRaw)));
    return minMs + Math.floor(Math.random() * (maxMs - minMs + 1));
  }
  const duration = Math.max(1800, Number(cfg.displayDuration || 6000));
  const maxVisible = Math.max(1, Number(cfg.maxVisible || 3));
  const base = Math.max(900, Math.floor(duration / Math.max(2, maxVisible)));
  const jitter = Math.floor(Math.random() * 700);
  return base + jitter;
}

function maskName(raw) {
  const parts = String(raw || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '********ng';
  const displayName = String(parts[parts.length - 1] || '').replace(/[^a-zA-Z]/g, '');
  if (!displayName) return '********ng';
  const visibleTail = displayName.slice(-2).toLowerCase() || 'ng';
  const starCount = Math.max(8, displayName.length + 3);
  return `${'*'.repeat(starCount)}${visibleTail}`;
}

function randomTickerAgo() {
  const minutes = 1 + Math.floor(Math.random() * 1440);
  if (minutes < 60) return `${minutes} ph\u00fat tr\u01b0\u1edbc`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} gi\u1edd tr\u01b0\u1edbc`;
  return '1 ng\u00e0y tr\u01b0\u1edbc';
}

function parseToEpochMs(value) {
  if (!value) return 0;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : 0;
}

function formatFloatingAgoFromTimestamp(tsValue) {
  const tsMs = parseToEpochMs(tsValue);
  if (!tsMs) return randomTickerAgo();
  const elapsedMinutes = Math.max(1, Math.floor((Date.now() - tsMs) / 60000));
  if (elapsedMinutes < 60) return `${elapsedMinutes} ph\u00fat tr\u01b0\u1edbc`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} gi\u1edd tr\u01b0\u1edbc`;
  return `${Math.min(7, Math.floor(elapsedHours / 24))} ng\u00e0y tr\u01b0\u1edbc`;
}

function normalizeFloatingWinnerEvent(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = String(raw.id || '').trim();
  const winnerName = String(raw.winnerName || '').trim();
  const prizeName = String(raw.prizeName || '').trim();
  const sessionCode = String(raw.sessionCode || '').trim().toUpperCase();
  if (!id || !winnerName || !prizeName) return null;
  return {
    id,
    sessionCode,
    winnerName,
    prizeName,
    approvedAt: raw.approvedAt || raw.requestedAt || null
  };
}

function getNextRealFloatingWinner() {
  if (!Array.isArray(state.floatingRealFeedQueue) || !state.floatingRealFeedQueue.length) return null;
  return state.floatingRealFeedQueue.shift() || null;
}

async function refreshRealFloatingWinnerFeed(force = false) {
  const now = Date.now();
  if (!force && now - Number(state.floatingRealFeedLastFetchAt || 0) < 30000) return;
  if (state.floatingRealFeedInFlight) return;
  state.floatingRealFeedInFlight = true;
  try {
    const res = await fetch('/api/withdrawals/floating-feed?limit=120&days=14', { credentials: 'same-origin' });
    const j = await res.json();
    if (j && j.success && Array.isArray(j.data)) {
      const normalized = j.data
        .map(normalizeFloatingWinnerEvent)
        .filter(Boolean)
        .filter((event) => !state.floatingRealFeedShownIds[event.id]);
      if (normalized.length) {
        const existingIds = new Set((state.floatingRealFeedQueue || []).map((event) => event && event.id).filter(Boolean));
        normalized.forEach((event) => {
          if (!existingIds.has(event.id)) {
            state.floatingRealFeedQueue.push(event);
            existingIds.add(event.id);
          }
        });
        state.floatingRealFeedCursor = 0;
      }
    }
    state.floatingRealFeedLastFetchAt = now;
  } catch (_) {
    state.floatingRealFeedLastFetchAt = now;
  } finally {
    state.floatingRealFeedInFlight = false;
  }
}

function startRealFloatingFeedRefreshTimer() {
  if (state.floatingRealFeedRefreshTimer) return;
  const tick = async () => {
    await refreshRealFloatingWinnerFeed(false);
    state.floatingRealFeedRefreshTimer = setTimeout(tick, 45000);
  };
  tick();
}

function stopRealFloatingFeedRefreshTimer() {
  if (state.floatingRealFeedRefreshTimer) {
    clearTimeout(state.floatingRealFeedRefreshTimer);
    state.floatingRealFeedRefreshTimer = null;
  }
}

function getFloatingPrizePool(cfg) {
  const customPool = Array.isArray(cfg?.prizePool) ? cfg.prizePool.map((x) => String(x || '').trim()).filter(Boolean) : [];
  if (customPool.length) return customPool;
  return DEFAULT_FLOATING_PRIZE_POOL;
}

function normalizeFloatingMessageItem(raw) {
  if (raw && typeof raw === 'object') {
    return {
      text: String(raw.text || '').trim(),
      icon: String(raw.icon || '').trim(),
      image: String(raw.image || '').trim()
    };
  }
  return {
    text: String(raw || '').trim(),
    icon: '',
    image: ''
  };
}

function getFloatingMessageTemplates(cfg) {
  const list = Array.isArray(cfg?.customMessages)
    ? cfg.customMessages.map(normalizeFloatingMessageItem).filter((x) => x.text)
    : [];
  if (list.length) return list;
  const fallbackTemplate = String(cfg?.template || '').trim() || '\uD83C\uDF81 {name} v\u1eeba nh\u1eadn \u0111\u01b0\u1ee3c {prize}!';
  return [{ text: fallbackTemplate, icon: '', image: '' }];
}

function buildTickerHtml(count = 12) {
  const items = [];
  for (let i = 0; i < count; i += 1) {
    const name = maskName(randomItem(TICKER_NAMES));
    const prize = randomItem(TICKER_PRIZES);
    const ago = randomTickerAgo();
    items.push(`<span class="win-ticker-item"><span class="ticker-dot" aria-hidden="true"></span><span class="ticker-main"><strong>${name}</strong> v\u1eeba nh\u1eadn <b>${prize}</b></span><span class="ticker-time">${ago}</span></span>`);
  }
  return items.join('');
}

function buildHomeFeedNotice() {
  const cfg = window.__floatingConfig || {};
  const hasRealQueue = Array.isArray(state.floatingRealFeedQueue) && state.floatingRealFeedQueue.length > 0;
  let realEvent = null;
  if (hasRealQueue) {
    state.floatingFeedMixToggle = !state.floatingFeedMixToggle;
    if (state.floatingFeedMixToggle) {
      realEvent = getNextRealFloatingWinner();
    }
  }
  if (realEvent && realEvent.id) {
    state.floatingRealFeedShownIds[realEvent.id] = Date.now();
    const ids = Object.keys(state.floatingRealFeedShownIds);
    if (ids.length > 1200) {
      const sorted = ids.sort((a, b) => Number(state.floatingRealFeedShownIds[a] || 0) - Number(state.floatingRealFeedShownIds[b] || 0));
      sorted.slice(0, 400).forEach((id) => {
        delete state.floatingRealFeedShownIds[id];
      });
    }
  }
  const fallbackName = maskName(randomItem(TICKER_NAMES));
  const nameFromSource = realEvent ? realEvent.winnerName : fallbackName;
  const prizePool = getFloatingPrizePool(cfg);
  const prizeFromSource = realEvent ? realEvent.prizeName : randomItem(prizePool);
  const name = cfg.showRecipientName !== false ? nameFromSource : 'Ng\u01b0\u1eddi ch\u01a1i';
  const prize = cfg.showPrizeName !== false ? prizeFromSource : 'ph\u1ea7n th\u01b0\u1edfng h\u1ea5p d\u1eabn';
  const ago = realEvent ? formatFloatingAgoFromTimestamp(realEvent.approvedAt) : randomTickerAgo();
  const templates = getFloatingMessageTemplates(cfg);
  const selectedTemplateItem = normalizeFloatingMessageItem(randomItem(templates));
  const customImageUrl = FORCED_NOTIFICATION_IMAGE_URL;
  const entryImageUrl = String(selectedTemplateItem.image || '').trim();
  const entryIcon = String(selectedTemplateItem.icon || '').trim();
  const fallbackIcon = entryIcon || String(cfg.customIcon || '').trim() || '\uD83C\uDF81';
  const visualType = 'image';
  const image = entryImageUrl || customImageUrl || randomItem(HOME_FEED_OBJECT_IMAGES);
  const icon = entryIcon || fallbackIcon || randomItem(HOME_FEED_ICONS);
  const selectedTemplate = selectedTemplateItem.text || (String(cfg.template || '').trim() || '\uD83C\uDF81 {name} v\u1eeba nh\u1eadn \u0111\u01b0\u1ee3c {prize}!');
  const message = realEvent
    ? `Ch\u00fac m\u1eebng kh\u00e1ch h\u00e0ng v\u1edbi m\u00e3 phi\u00ean ${realEvent.sessionCode || 'N/A'} tr\u00fang ${prize}`
    : selectedTemplate.replace(/\{name\}/g, name).replace(/\{prize\}/g, prize);
  return {
    visualType,
    image,
    icon,
    fallbackIcon,
    title: realEvent ? 'Ch\u00fac m\u1eebng kh\u00e1ch h\u00e0ng' : 'Th\u00f4ng b\u00e1o nh\u1eadn th\u01b0\u1edfng',
    message,
    time: ago
  };
}

function pushHomeFloatingNotice() {
  const feed = document.getElementById('homeFloatingFeed');
  if (!feed || document.hidden) return;
  const maxVisible = (window.__floatingConfig && window.__floatingConfig.maxVisible) || 3;
  const duration = (window.__floatingConfig && window.__floatingConfig.displayDuration) || 6100;
  const n = buildHomeFeedNotice();
  const el = document.createElement('div');
  el.className = 'home-feed-item';
  const cfg = window.__floatingConfig || {};
  if (cfg.bgColor) el.style.background = cfg.bgColor;
  if (cfg.borderColor) el.style.border = `1px solid ${cfg.borderColor}`;
  const visualHtml = n.visualType === 'image' && n.image
    ? `<img class="home-feed-thumb" src="${n.image}" alt="Hinh anh vat pham" loading="lazy" decoding="async" onerror="this.style.display='none';var fb=this.parentElement&&this.parentElement.querySelector('.home-feed-glyph');if(fb){fb.style.display='inline-flex';}"><span class="home-feed-glyph" aria-hidden="true" style="display:none">${n.fallbackIcon || '\uD83C\uDF81'}</span>`
    : `<span class="home-feed-glyph" aria-hidden="true">${n.icon || '\uD83C\uDF81'}</span>`;
  el.innerHTML = `<div class="home-feed-icon" aria-hidden="true">${visualHtml}</div><div class="home-feed-body"><div class="home-feed-title">${n.title}</div><div class="home-feed-sub">${n.message}</div><div class="home-feed-time">${n.time}</div></div>`;
  if (cfg.textColor) {
    const titleEl = el.querySelector('.home-feed-title');
    const subEl = el.querySelector('.home-feed-sub');
    const timeEl = el.querySelector('.home-feed-time');
    if (titleEl) titleEl.style.color = cfg.textColor;
    if (subEl) subEl.style.color = cfg.textColor;
    if (timeEl) timeEl.style.color = cfg.textColor;
  }
  requestAnimationFrame(() => {
    if (!feed.isConnected) return;
    feed.appendChild(el);
  });
  if (window.__manualTextMap) {
    const _map = window.__manualTextMap;
    const _title = el.querySelector('.home-feed-title');
    const _time = el.querySelector('.home-feed-time');
    if (_title) _title.textContent = translateExactTextByMap(_title.textContent, _map);
    if (_time) _time.textContent = translateExactTextByMap(_time.textContent, _map);
  }
  while (feed.children.length > maxVisible) {
    feed.removeChild(feed.firstElementChild);
  }
  setTimeout(() => {
    if (el.parentNode) el.remove();
  }, duration);
}

function initHomeFloatingFeed() {
  const feed = document.getElementById('homeFloatingFeed');
  if (!feed || state.homeFeedTimer) return;
  const cfg = window.__floatingConfig || {};
  if (cfg.enabled === false && cfg.alwaysOn !== true) return;
  const scheduleNext = () => {
    const delayMs = randomFeedDelayMs(cfg);
    state.homeFeedTimer = setTimeout(() => {
      pushHomeFloatingNotice();
      scheduleNext();
    }, delayMs);
  };
  scheduleNext();
}

function pushGameFloatingNotice() {
  const feed = document.getElementById('gameFloatingFeed');
  if (!feed || document.hidden) return;
  const gameScreen = document.getElementById('screen-game');
  if (!gameScreen || window.getComputedStyle(gameScreen).display === 'none') return;
  const maxVisible = (window.__floatingConfig && window.__floatingConfig.maxVisible) || 3;
  const duration = (window.__floatingConfig && window.__floatingConfig.displayDuration) || 6200;
  const n = buildHomeFeedNotice();
  const el = document.createElement('div');
  el.className = 'home-feed-item';
  const cfg = window.__floatingConfig || {};
  if (cfg.bgColor) el.style.background = cfg.bgColor;
  if (cfg.borderColor) el.style.border = `1px solid ${cfg.borderColor}`;
  const visualHtml = n.visualType === 'image' && n.image
    ? `<img class="home-feed-thumb" src="${n.image}" alt="Hinh anh vat pham" loading="lazy" decoding="async" onerror="this.style.display='none';var fb=this.parentElement&&this.parentElement.querySelector('.home-feed-glyph');if(fb){fb.style.display='inline-flex';}"><span class="home-feed-glyph" aria-hidden="true" style="display:none">${n.fallbackIcon || '\uD83C\uDF81'}</span>`
    : `<span class="home-feed-glyph" aria-hidden="true">${n.icon || '\uD83C\uDF81'}</span>`;
  el.innerHTML = `<div class="home-feed-icon" aria-hidden="true">${visualHtml}</div><div class="home-feed-body"><div class="home-feed-title">${n.title}</div><div class="home-feed-sub">${n.message}</div><div class="home-feed-time">${n.time}</div></div>`;
  if (cfg.textColor) {
    const titleEl = el.querySelector('.home-feed-title');
    const subEl = el.querySelector('.home-feed-sub');
    const timeEl = el.querySelector('.home-feed-time');
    if (titleEl) titleEl.style.color = cfg.textColor;
    if (subEl) subEl.style.color = cfg.textColor;
    if (timeEl) timeEl.style.color = cfg.textColor;
  }
  if (window.__manualTextMap) {
    const _map = window.__manualTextMap;
    const _title = el.querySelector('.home-feed-title');
    const _time = el.querySelector('.home-feed-time');
    if (_title) _title.textContent = translateExactTextByMap(_title.textContent, _map);
    if (_time) _time.textContent = translateExactTextByMap(_time.textContent, _map);
  }
  requestAnimationFrame(() => {
    if (!feed.isConnected) return;
    feed.appendChild(el);
    while (feed.children.length > maxVisible) {
      feed.removeChild(feed.firstElementChild);
    }
  });
  setTimeout(() => {
    if (el.parentNode) el.remove();
  }, duration);
}

function initGameFloatingFeed() {
  const feed = document.getElementById('gameFloatingFeed');
  if (!feed || state.gameFeedTimer) return;
  const cfg = window.__floatingConfig || {};
  if (cfg.enabled === false && cfg.alwaysOn !== true) return;
  const scheduleNext = () => {
    const delayMs = randomFeedDelayMs(cfg);
    state.gameFeedTimer = setTimeout(() => {
      pushGameFloatingNotice();
      scheduleNext();
    }, delayMs);
  };
  scheduleNext();
}

function renderWinnerTicker() {
  const tracks = document.querySelectorAll('.js-win-ticker-track');
  if (!tracks.length) return;
  const segment = buildTickerHtml(14);
  const html = `${segment}${segment}`;
  tracks.forEach((track) => {
    track.innerHTML = html;
  });
}

function initWinnerTicker() {
  loadFloatingConfig().then(() => {
    refreshRealFloatingWinnerFeed(true);
    startRealFloatingFeedRefreshTimer();
    initHomeFloatingFeed();
    initGameFloatingFeed();
  });
}

async function loadFloatingConfig() {
  try {
    if ((!window.__lmbUiSettings || !window.__lmbUiSettings.features) && state._settingsReady) {
      await state._settingsReady;
    }
    const fn = (window.__lmbUiSettings && window.__lmbUiSettings.floatingNotification) || {};
    const features = (window.__lmbUiSettings && window.__lmbUiSettings.features) || {};
    if (fn || features) {
      window.__floatingConfig = {
        enabled: fn.enabled !== false,
        alwaysOn: fn.alwaysOn !== false,
        position: fn.position || 'left',
        showRecipientName: fn.showRecipientName !== false,
        showPrizeName: fn.showPrizeName !== false,
        displayDuration: fn.displayDuration || 6000,
        maxVisible: fn.maxVisible || 3,
        minIntervalMs: fn.minIntervalMs || 3200,
        maxIntervalMs: fn.maxIntervalMs || 5200,
        customMessages: fn.customMessages || [],
        prizePool: Array.isArray(fn.prizePool) ? fn.prizePool : [],
        template: fn.template || '\uD83C\uDFC6 Ch\u00fac m\u1eebng {name} tr\u00fang {prize}!',
        bgColor: fn.bgColor || '',
        textColor: fn.textColor || '',
        borderColor: fn.borderColor || '',
        showAvatar: fn.showAvatar !== false,
        visualMode: fn.visualMode || 'auto',
        customImageUrl: FORCED_NOTIFICATION_IMAGE_URL,
        customIcon: fn.customIcon || '\uD83C\uDF81'
      };
      applyFloatingPosition(window.__floatingConfig.position);
      return;
    }
    const res = await fetch('/api/settings');
    const j = await res.json();
    if (j && j.success && j.data) {
      const fallbackFn = j.data.floatingNotification || {};
      window.__floatingConfig = {
        enabled: fallbackFn.enabled !== false,
        alwaysOn: fallbackFn.alwaysOn !== false,
        position: fallbackFn.position || 'left',
        showRecipientName: fallbackFn.showRecipientName !== false,
        showPrizeName: fallbackFn.showPrizeName !== false,
        displayDuration: fallbackFn.displayDuration || 6000,
        maxVisible: fallbackFn.maxVisible || 3,
        minIntervalMs: fallbackFn.minIntervalMs || 1800,
        maxIntervalMs: fallbackFn.maxIntervalMs || 3200,
        customMessages: fallbackFn.customMessages || [],
        prizePool: Array.isArray(fallbackFn.prizePool) ? fallbackFn.prizePool : [],
        template: fallbackFn.template || '\uD83C\uDFC6 Ch\u00fac m\u1eebng {name} tr\u00fang {prize}!',
        bgColor: fallbackFn.bgColor || '',
        textColor: fallbackFn.textColor || '',
        borderColor: fallbackFn.borderColor || '',
        showAvatar: fallbackFn.showAvatar !== false,
        visualMode: fallbackFn.visualMode || 'auto',
        customImageUrl: FORCED_NOTIFICATION_IMAGE_URL,
        customIcon: fallbackFn.customIcon || '\uD83C\uDF81'
      };
      applyFloatingPosition(window.__floatingConfig.position);
    }
  } catch (err) {
    window.__floatingConfig = {
      enabled: true,
      alwaysOn: true,
      position: 'left',
      maxVisible: 3,
      displayDuration: 6000,
      minIntervalMs: 1800,
      maxIntervalMs: 3200,
      prizePool: DEFAULT_FLOATING_PRIZE_POOL,
      visualMode: 'auto',
      customImageUrl: FORCED_NOTIFICATION_IMAGE_URL,
      customIcon: '\uD83C\uDF81'
    };
  }
}

function applyFloatingPosition(position) {
  const feeds = document.querySelectorAll('.home-floating-feed, .game-floating-feed');
  feeds.forEach(feed => {
    if (position === 'right') {
      feed.style.left = 'auto';
      feed.style.right = '14px';
    } else {
      feed.style.left = '14px';
      feed.style.right = 'auto';
    }
  });
}

// Self-init: start feeds when this module loads
try { renderWinnerTicker(); initWinnerTicker(); } catch (_) {}
