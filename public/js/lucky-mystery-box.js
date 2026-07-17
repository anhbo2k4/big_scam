  // ===== GET SESSION CODE FROM URL =====
  function getSessionCodeFromURL() {
    const params = new URLSearchParams(window.location.search);
    return (params.get('code') || '').toUpperCase();
  }

  // ===== SECURITY HELPER =====
  // Add browser fingerprint to all API requests
  async function secureAPICall(url, options = {}) {
    try {
      // Get browser fingerprint if available
      let headers = options.headers || {};
      if (typeof BrowserFingerprint !== 'undefined') {
        const fp = (typeof BrowserFingerprint.getForAPIAsync === 'function')
          ? await BrowserFingerprint.getForAPIAsync()
          : BrowserFingerprint.getForAPI();
        headers = {
          ...headers,
          'X-Browser-Fingerprint': fp.fingerprintHash,
          'X-Fingerprint-Data': fp.browserFingerprint
        };
      }
      
      // Merge headers
      options.headers = {
        'Content-Type': 'application/json',
        ...headers
      };
      
      const response = await fetch(url, options);
      return response;
    } catch (err) {
      throw err;
    }
  }

  function parseMoneyInputValue(value) {
    const normalized = String(value ?? '').replace(/[^\d-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
  }

  function formatMoneyComma(value) {
    return parseMoneyInputValue(value).toLocaleString('en-US');
  }

  function bindMoneyCommaInput(inputEl) {
    if (!inputEl || inputEl.dataset.moneyCommaBound === '1') return;

    const applyFormattedValue = () => {
      const numeric = parseMoneyInputValue(inputEl.value);
      inputEl.value = numeric > 0 ? formatMoneyComma(numeric) : '';
    };

    inputEl.addEventListener('input', applyFormattedValue);
    inputEl.addEventListener('blur', applyFormattedValue);
    inputEl.dataset.moneyCommaBound = '1';
    applyFormattedValue();
  }

  // ===== GLOBAL PAGE LOADER =====
  let globalLoaderPendingRequests = 0;
  let globalLoaderShowTimer = null;
  let globalLoaderHideTimer = null;
  let globalLoaderVisibleSince = 0;
  let globalLoaderSpinnerAnim = null;
  const GLOBAL_LOADER_MIN_VISIBLE_MS = 500;
  const GLOBAL_LOADER_LIGHT_MIN_VISIBLE_MS = 220;

  function ensureGlobalPageLoader() {
    let overlay = document.getElementById('pageGlobalLoader');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'pageGlobalLoader';
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'display:none',
      'align-items:center',
      'justify-content:center',
      'background:rgba(5,8,20,0.82)',
      'backdrop-filter:blur(4px)',
      'z-index:2147483646',
      'padding:16px',
      'opacity:0',
      'pointer-events:none',
      'transition:opacity .24s ease'
    ].join(';');

    overlay.innerHTML = `
      <div id="pageGlobalLoaderCard" style="width:min(420px,100%);border-radius:16px;background:linear-gradient(160deg,#1a1840,#0f0d2a);border:1px solid rgba(124,58,237,.45);padding:22px 18px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.4);transform:translateY(10px) scale(.985);opacity:.92;transition:transform .24s ease,opacity .24s ease">
        <div style="font-size:28px;margin-bottom:10px">⏳</div>
        <div id="pageGlobalLoaderText" style="font-size:15px;font-weight:700;color:#e2e8f0;margin-bottom:10px">Đang tải dữ liệu từ server...</div>
        <div id="pageGlobalLoaderSpinner" style="width:34px;height:34px;border:3px solid rgba(148,163,184,.3);border-top-color:#38bdf8;border-radius:999px;margin:0 auto;animation:globalLoaderSpin 0.9s linear infinite;will-change:transform"></div>
      </div>
    `;

    if (!document.getElementById('pageGlobalLoaderStyle')) {
      const style = document.createElement('style');
      style.id = 'pageGlobalLoaderStyle';
      style.textContent = '@keyframes globalLoaderSpin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    document.body.appendChild(overlay);
    return overlay;
  }

  function ensureGlobalLoaderSpinnerAnimation() {
    const spinner = document.getElementById('pageGlobalLoaderSpinner');
    if (!spinner) return;

    if (spinner.animate) {
      if (!globalLoaderSpinnerAnim) {
        globalLoaderSpinnerAnim = spinner.animate(
          [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
          { duration: 900, iterations: Infinity, easing: 'linear' }
        );
      } else if (globalLoaderSpinnerAnim.playState === 'paused') {
        globalLoaderSpinnerAnim.play();
      }
    }
  }

  function showGlobalPageLoader(message, options = {}) {
    const overlay = ensureGlobalPageLoader();
    const card = document.getElementById('pageGlobalLoaderCard');
    const textEl = document.getElementById('pageGlobalLoaderText');
    const isLight = options.light === true;

    overlay.dataset.mode = isLight ? 'light' : 'default';
    overlay.style.background = isLight ? 'rgba(5,8,20,0.46)' : 'rgba(5,8,20,0.82)';
    overlay.style.backdropFilter = isLight ? 'blur(2px)' : 'blur(4px)';

    if (card) {
      card.style.width = isLight ? 'min(340px,92%)' : 'min(420px,100%)';
      card.style.padding = isLight ? '16px 14px' : '22px 18px';
      card.style.borderRadius = isLight ? '14px' : '16px';
      card.style.boxShadow = isLight ? '0 8px 28px rgba(0,0,0,.32)' : '0 10px 40px rgba(0,0,0,.4)';
    }

    if (textEl && message) {
      textEl.textContent = message;
    }

    if (globalLoaderHideTimer) {
      clearTimeout(globalLoaderHideTimer);
      globalLoaderHideTimer = null;
    }

    overlay.style.display = 'flex';
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      if (card) {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.opacity = '1';
      }
    });
    ensureGlobalLoaderSpinnerAnimation();
    globalLoaderVisibleSince = Date.now();
  }

  function hideGlobalPageLoader(force = false, minVisibleMsOverride = null) {
    const overlay = document.getElementById('pageGlobalLoader');
    if (!overlay) return;

    const isLight = overlay.dataset.mode === 'light';
    const minVisibleMs = typeof minVisibleMsOverride === 'number'
      ? minVisibleMsOverride
      : (isLight ? GLOBAL_LOADER_LIGHT_MIN_VISIBLE_MS : GLOBAL_LOADER_MIN_VISIBLE_MS);
    const elapsed = Date.now() - globalLoaderVisibleSince;
    const waitMs = force ? 0 : Math.max(0, minVisibleMs - elapsed);

    if (globalLoaderHideTimer) {
      clearTimeout(globalLoaderHideTimer);
    }

    globalLoaderHideTimer = setTimeout(() => {
      const card = document.getElementById('pageGlobalLoaderCard');
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      if (card) {
        card.style.transform = 'translateY(10px) scale(.985)';
        card.style.opacity = '.92';
      }
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.dataset.mode = 'default';
      }, 240);
    }, waitMs);
  }

  async function withGlobalPageLoader(message, task, options = {}) {
    showGlobalPageLoader(message, options);
    try {
      return await task();
    } finally {
      hideGlobalPageLoader(false, options.minVisibleMs);
    }
  }

  function trackGlobalRequestStart() {
    globalLoaderPendingRequests += 1;
    if (globalLoaderShowTimer) {
      clearTimeout(globalLoaderShowTimer);
    }
    globalLoaderShowTimer = setTimeout(() => {
      if (globalLoaderPendingRequests > 0) {
        showGlobalPageLoader('Đang tải dữ liệu từ server...');
      }
    }, 380);
  }

  function shouldUseAutoGlobalLoader() {
    return false;
  }

  function trackGlobalRequestEnd() {
    globalLoaderPendingRequests = Math.max(0, globalLoaderPendingRequests - 1);
    if (globalLoaderPendingRequests === 0) {
      if (globalLoaderShowTimer) {
        clearTimeout(globalLoaderShowTimer);
        globalLoaderShowTimer = null;
      }
      hideGlobalPageLoader(false);
    }
  }

  function initGlobalFetchLoader() {
    if (window.__globalFetchLoaderInitialized) return;
    window.__globalFetchLoaderInitialized = true;

    const nativeFetch = window.fetch.bind(window);
    window.fetch = async (input, init = undefined) => {
      if (!shouldUseAutoGlobalLoader()) {
        return nativeFetch(input, init);
      }

      trackGlobalRequestStart();
      try {
        return await nativeFetch(input, init);
      } finally {
        trackGlobalRequestEnd();
      }
    };
  }

  initGlobalFetchLoader();

  // ===== MINIMAL STATE (Client-side only) =====
  const OPENING_RESULT_DELAY_MS = 0;
  const OPENING_ANIMATION_MIN_MS = 3000;

  const state = {
    sessionCode: getSessionCodeFromURL() || localStorage.getItem('lmbSessionCode') || '',
    hasOpened: false,
    currentPrize: null,
    boxesInfo: null,  // ✅ NEW: Store preloaded boxes info
    lastPage: 'home',
    claimingItemIndex: -1,
    onlineBase: Math.floor(Math.random() * 300) + 800,
    sessionStartTime: parseInt(localStorage.getItem('lmbSessionStart')) || Date.now(),
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    isSessionValid: true,
    userChosenAction: null,  // Track whether user chose 'claim' or 'convert'
    existingWithdrawalId: null,
    isUpdatingWithdrawal: false,
    walletTransactions: [],
    walletTxFilter: 'all',
    walletTxPage: 1,
    walletTxPageSize: 6,
    openedPrizeItems: []
  };

  const openingAnimationTimers = [];

  function clearOpeningAnimationTimers() {
    while (openingAnimationTimers.length > 0) {
      const timer = openingAnimationTimers.pop();
      clearTimeout(timer);
    }
  }

  // ===== NEW: Initialize session from 24-hour persistent storage =====
  function initializeSessionFromStorage() {
    if (typeof lmbManager !== 'undefined') {
      const savedSession = lmbManager.restoreSession();
      if (savedSession && !state.sessionCode) {
        state.sessionCode = savedSession;
        state.sessionStartTime = parseInt(localStorage.getItem('lmbSessionStart')) || Date.now();
        state.isSessionValid = true;
      }
    }
  }

  // Initialize on script load
  initializeSessionFromStorage();

  // ===== SAVE SESSION TO LOCALSTORAGE =====
  function saveSessionCode(code) {
    state.sessionCode = code;
    state.sessionStartTime = Date.now();
    
    // Use the new box manager for 24-hour persistence
    if (typeof lmbManager !== 'undefined') {
      lmbManager.saveSession(code);
    }
    
    // Keep old keys for backward compatibility
    localStorage.setItem('lmbSessionCode', code);
    localStorage.setItem('lmbSessionStart', state.sessionStartTime.toString());
  }

  function clearSessionCode() {
    state.sessionCode = '';
    state.isSessionValid = false;
    
    // Clear using box manager
    if (typeof lmbManager !== 'undefined') {
      lmbManager.clearSession();
    }
    
    localStorage.removeItem('lmbSessionCode');
    localStorage.removeItem('lmbSessionStart');
  }

  function getSessionScopedKey(suffix) {
    const code = (state.sessionCode || '').trim().toUpperCase();
    return code ? `lmb:${code}:${suffix}` : `lmb:${suffix}`;
  }

  function saveSessionProfile(suffix, payload = {}) {
    try {
      localStorage.setItem(getSessionScopedKey(suffix), JSON.stringify(payload));
    } catch (e) {}
  }

  function loadSessionProfile(suffix, fallback = {}) {
    try {
      const raw = localStorage.getItem(getSessionScopedKey(suffix));
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  // ✅ NEW: Save/Restore prize data for persistent display after refresh
  function savePrizeState(prize) {
    if (prize) {
      const scopedKey = getSessionScopedKey('currentPrize');
      localStorage.setItem(scopedKey, JSON.stringify(prize));
      localStorage.removeItem('lmbCurrentPrize');
    }
  }

  function restorePrizeState() {
    const scopedKey = getSessionScopedKey('currentPrize');
    const saved = localStorage.getItem(scopedKey) || localStorage.getItem('lmbCurrentPrize');
    if (saved) {
      try {
        state.currentPrize = JSON.parse(saved);
        if (localStorage.getItem('lmbCurrentPrize')) {
          localStorage.removeItem('lmbCurrentPrize');
        }
        return true;
      } catch (e) {
        localStorage.removeItem(scopedKey);
        localStorage.removeItem('lmbCurrentPrize');
        return false;
      }
    }
    return false;
  }

  function clearPrizeState() {
    state.currentPrize = null;
    localStorage.removeItem(getSessionScopedKey('currentPrize'));
    localStorage.removeItem('lmbCurrentPrize');
  }

  // ✅ NEW: Preload all 3 boxes info to reduce API calls and fix 429 rate limiting
  async function preloadBoxes() {
    if (!state.sessionCode) {
      console.warn('⚠️ No session code, skipping preloadBoxes');
      return false;
    }

    try {
      console.log(`📦 Preloading boxes for session: ${state.sessionCode}`);
      const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/preload-boxes`);
      
      if (!response.ok) {
        console.error(`❌ API returned ${response.status}: ${response.statusText}`);
        return false;
      }
      
      const result = await response.json();
      console.log('📦 Preload response:', result);

      if (result.success && result.data && result.data.boxes) {
        state.boxesInfo = result.data.boxes;
        console.log(`✅ Loaded ${result.data.boxes.length} boxes`);
        // ✅ Display box info under each box card
        displayBoxesInfo();
        
        return true;
      } else {
        console.warn('⚠️ API success but no boxes data:', result.message || 'Unknown error');
        return false;
      }
    } catch (err) {
      console.error('❌ Error in preloadBoxes:', err);
      return false;
    }
  }

  // ✅ Display preloaded boxes info under each box
  function displayBoxesInfo() {
    if (!state.boxesInfo || state.boxesInfo.length === 0) return;
    
    state.boxesInfo.forEach((_, idx) => {
      const boxNum = idx + 1;
      const boxCard = document.querySelector(`.box-card[onclick="openBox(${boxNum})"]`);
      if (!boxCard) return;
      const infoDiv = boxCard.querySelector('.box-info');
      if (infoDiv) {
        infoDiv.remove();
      }
    });
  }

  // ===== SESSION VALIDATION & TIMEOUT =====
  function isSessionExpired() {
    if (!state.sessionCode) return true;
    const elapsed = Date.now() - state.sessionStartTime;
    return elapsed > state.sessionTimeout;
  }

  function validateSession() {
    if (isSessionExpired()) {
      state.isSessionValid = false;
      clearSessionCode();
      showToast('⏱️ Phiên chơi đã hết hạn. Vui lòng bắt đầu lại.', '⏱️');
      showPage('home');
      return false;
    }
    state.isSessionValid = true;
    return true;
  }

  function getSessionRemainingTime() {
    const elapsed = Date.now() - state.sessionStartTime;
    const remaining = Math.max(0, state.sessionTimeout - elapsed);
    return remaining;
  }

  // ===== DECORATIVE DATA (for win notifications) =====
  const vietNames = [
    'Nguyễn Văn Hùng', 'Trần Thị Mai', 'Lê Văn Tùng', 'Phạm Thị Hoa', 'Hoàng Minh Tuấn',
    'Đỗ Thị Lan', 'Vũ Văn Nam', 'Bùi Thị Thu', 'Ngô Văn Đức', 'Dương Thị Hằng'
  ];

  const notifPrizes = [
    { name: 'iPhone 16 Pro Max', emoji: '📱', color: '#a78bfa' },
    { name: 'Sony WH-1000XM5', emoji: '🎧', color: '#67e8f9' },
    { name: 'MacBook Air M3', emoji: '💻', color: '#86efac' },
    { name: 'Galaxy S25', emoji: '📲', color: '#fcd34d' },
    { name: 'iPad Pro M4', emoji: '🖥️', color: '#f9a8d4' }
  ];

  const timeAgo = ['vừa xong', '1 phút trước', '2 phút trước', 'vài giây trước'];

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function formatDate(d) {
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const date = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} ${date}/${month}/${year}`;
  }

  // ===== PAGE NAVIGATION =====
  function getActivePageName() {
    const active = document.querySelector('.page.active');
    if (!active || !active.id) return 'home';
    return active.id.replace('page-', '') || 'home';
  }

  function pushPageHistoryState(pageName) {
    if (!state.sessionCode || pageName === 'home') return;
    const current = history.state || {};
    if (current.lmbManaged && current.lmbPage === pageName) return;

    history.pushState(
      {
        ...current,
        lmbManaged: true,
        sessionCode: state.sessionCode,
        lmbPage: pageName,
        at: Date.now()
      },
      '',
      window.location.href
    );
  }

  function handleBackNavigationInSession() {
    if (!state.sessionCode) return false;

    const activePage = getActivePageName();

    if (activePage === 'thankyou') {
      showToast('⚠️ Bạn nên nhận quà trước khi thoát', '⚠️');
      pushPageHistoryState('thankyou');
      return true;
    }

    if (activePage === 'choose') {
      backToHome();
      return true;
    }

    if (activePage !== 'home') {
      showPage('choose', { fromPopState: true });
      pushPageHistoryState('choose');
      return true;
    }

    return false;
  }

  function showPage(name, options = {}) {
    const { fromPopState = false, skipDataLoad = false } = options;
    const previous = getActivePageName();
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + name);
    if (page) {
      page.classList.add('active');
    }
    
    // IMPORTANT: Ensure overlays are always visible when z-index requires it
    // Force reflow to ensure CSS changes are applied
    void page?.offsetHeight;
    
    // Load fresh data when switching to inventory or wallet
    if (!skipDataLoad) {
      if (name === 'inventory' && state.sessionCode) {
        loadInventory({ showLoader: true });
      } else if (name === 'wallet' && state.sessionCode) {
        loadWallet({ showLoader: true });
      } else if (name === 'exchange' && state.sessionCode) {
        // Load exchange options when showing exchange page
        loadExchangeOptions();
      } else if (name === 'choose' && state.sessionCode) {
        // Load opened prizes when showing choose page
        loadOpenedPrizes();
        loadExchangeOptions();
        loadWallet({ showLoader: false });
      }
    }

    if (!fromPopState && state.sessionCode && name !== 'home' && name !== previous) {
      pushPageHistoryState(name);
    }
  }

  function runOpeningAnimation(boxNumber) {
    clearOpeningAnimationTimers();

    const labelEl = document.getElementById('openingBoxLabel');
    const textEl = document.getElementById('openingText');
    const giftBoxEl = document.getElementById('openingGiftBox');
    const sceneEl = document.querySelector('#page-opening .opening-scene');

    const steps = [
      `🎁 Đang mở hộp #${boxNumber}...`,
      '✨ Kiểm tra vận may của bạn...',
      '🔮 Xác thực phần thưởng...',
      '🎊 Kết nối kho quà bí ẩn...',
      '🎉 Sắp công bố phần thưởng...'
    ];

    if (labelEl) {
      labelEl.textContent = `🎁 Hộp quà #${boxNumber}`;
      labelEl.style.animation = 'none';
      void labelEl.offsetHeight;
      labelEl.style.animation = 'pulse 0.6s ease-in-out';
    }

    if (giftBoxEl) {
      giftBoxEl.classList.remove('opening-final');
      void giftBoxEl.offsetHeight;
      giftBoxEl.classList.add('opening-final');
      
      // Add shake animation
      giftBoxEl.style.animation = 'shake 0.5s ease-in-out infinite';
    }

    if (sceneEl) {
      sceneEl.classList.remove('phase-2', 'phase-3', 'phase-4');
      void sceneEl.offsetHeight;
      
      // Trigger particles immediately
      const particles = sceneEl.querySelectorAll('.opening-particle');
      particles.forEach((p, i) => {
        p.style.animation = `float-particle ${2 + i * 0.3}s ease-in-out infinite`;
      });
      
      const sparks = sceneEl.querySelectorAll('.opening-spark');
      sparks.forEach((s, i) => {
        s.style.animation = `sparkle ${1.5 + i * 0.2}s ease-in-out infinite`;
      });
    }

    if (textEl) {
      textEl.textContent = steps[0];
      textEl.style.animation = 'fadeInUp 0.5s ease-out';
      
      openingAnimationTimers.push(setTimeout(() => {
        const openingPage = document.getElementById('page-opening');
        if (openingPage && openingPage.classList.contains('active')) {
          textEl.textContent = steps[1];
          textEl.style.animation = 'fadeInUp 0.5s ease-out';
        }
      }, 700));
      
      openingAnimationTimers.push(setTimeout(() => {
        const openingPage = document.getElementById('page-opening');
        if (openingPage && openingPage.classList.contains('active')) {
          textEl.textContent = steps[2];
          textEl.style.animation = 'fadeInUp 0.5s ease-out';
          if (sceneEl) sceneEl.classList.add('phase-2');
          if (giftBoxEl) giftBoxEl.style.animation = 'shake-intensive 0.3s ease-in-out infinite';
        }
      }, 1450));
      
      openingAnimationTimers.push(setTimeout(() => {
        const openingPage = document.getElementById('page-opening');
        if (openingPage && openingPage.classList.contains('active')) {
          textEl.textContent = steps[3];
          textEl.style.animation = 'fadeInUp 0.5s ease-out';
          if (sceneEl) sceneEl.classList.add('phase-3');
          if (giftBoxEl) giftBoxEl.style.animation = 'bounce 0.4s ease-in-out infinite';
        }
      }, 2200));
      
      openingAnimationTimers.push(setTimeout(() => {
        const openingPage = document.getElementById('page-opening');
        if (openingPage && openingPage.classList.contains('active')) {
          textEl.textContent = steps[4];
          textEl.style.animation = 'fadeInUp 0.5s ease-out';
          if (sceneEl) sceneEl.classList.add('phase-4');
          if (giftBoxEl) {
            giftBoxEl.style.animation = 'scale-pulse 0.6s ease-in-out infinite';
            giftBoxEl.style.filter = 'brightness(1.3) drop-shadow(0 0 20px rgba(168,85,247,0.8))';
          }
        }
      }, 2750));
    }
  }

  function goHome() {
    // Clear session and go back to home page
    clearSessionCode();
    state.hasOpened = false;
    state.currentPrize = null;
    showGlobalPageLoader('Đang quay về trang chủ...');
    window.location.href = '/';
    showToast('🏠 Quay về trang chủ', '🏠');
  }

  function goBack() {
    if (state.sessionCode) {
      showPage('choose');
    } else {
      showPage('home');
    }
  }

  function applyUserTheme(theme) {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('userTheme', nextTheme);

    const isLight = nextTheme === 'light';
    const icon = document.getElementById('userThemeToggleIcon');
    if (icon) {
      icon.textContent = isLight ? '☀️' : '🌙';
    }

    const mobileText = document.getElementById('userThemeToggleMobileText');
    if (mobileText) {
      mobileText.textContent = isLight ? 'Chế độ tối' : 'Chế độ sáng';
    }
  }

  function toggleUserTheme() {
    const current = localStorage.getItem('userTheme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyUserTheme(next);
  }

  window.toggleUserTheme = toggleUserTheme;

  // ===== SESSION MANAGEMENT =====
  async function enterSession() {
    const input = document.getElementById('sessionCodeInput');
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
      input.style.borderColor = '#ef4444';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
      return;
    }

    if (code.length < 4 || code.length > 20) {
      showToast('❌ Mã phiên phải từ 4-20 ký tự', '❌');
      return;
    }

    try {
      await withGlobalPageLoader('Đang tải dữ liệu phiên từ server...', async () => {
        // Join the session via API
        const response = await fetch('/api/lucky-mystery-box/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionCode: code })
        });

        const result = await response.json();
        if (!result.success) {
          showToast('❌ ' + result.message, '❌');
          input.style.borderColor = '#ef4444';
          return;
        }

        // Verify session exists and is active
        const verifyResponse = await fetch(`/api/lucky-mystery-box/session?code=${code}`);
        const verifyResult = await verifyResponse.json();

        if (!verifyResult.success) {
          showToast('❌ ' + verifyResult.message, '❌');
          return;
        }

        if (!verifyResult.data.is_active) {
          showToast('⚠️ Phiên này không còn hoạt động', '⚠️');
          return;
        }

        saveSessionCode(code);
        state.hasOpened = verifyResult.data.player_selected_box !== null;
        state.isSessionValid = true;

        if (typeof lmbManager !== 'undefined') {
          const order = Array.isArray(verifyResult?.data?.box_positions)
            ? verifyResult.data.box_positions
            : [1, 2, 3];
          lmbManager.setOpenOrder(order);
        }

        // ✅ NEW: Preload all 3 boxes info to reduce API calls
        const preloaded = await preloadBoxes();
        if (!preloaded) {
          showToast('❌ Không tải được dữ liệu hộp. Vui lòng thử lại.', '❌');
          return;
        }

        // Update URL to include session code as query parameter
        const newURL = window.location.protocol + '//' + window.location.host + '/?code=' + code;
        window.history.replaceState({ sessionCode: code }, '', newURL);

        // ✅ If already opened a box, skip personal form and go to choose page
        if (state.hasOpened) {
          showToast('✅ Chào mừng quay lại! Đây là phiên của bạn.', '✅');
          showPage('choose');
          // Load opened prizes
          setTimeout(() => loadOpenedPrizes(), 500);
        } else {
          // First time - show personal form
          showPage('personal');
          showToast('✅ Tham gia phiên thành công!', '✅');
        }
      }, { minVisibleMs: 420 });
    } catch (err) {
      showToast('❌ Lỗi: ' + err.message, '❌');
    }
  }

  // ===== BOX OPENING =====
  async function openBox(num) {
    if (!validateSession()) return;
    if (!state.sessionCode) {
      showToast('❌ Vui lòng tham gia phiên trước', '❌');
      return;
    }

    console.log('[openBox] start', { sessionCode: state.sessionCode, boxNumber: num });
    
    // ===== NEW: Check box opening constraints =====
    if (typeof lmbManager !== 'undefined') {
      // Check if can open any box
      let canOpen = lmbManager.canOpenBox();
      if (!canOpen.allowed && lmbManager.isPendingConfirmation()) {
        await syncLocalProgressFromServer();
        canOpen = lmbManager.canOpenBox();
      }
      if (!canOpen.allowed) {
        showToast('⚠️ ' + canOpen.reason, '⚠️');
        return;
      }

      // Check if this specific box can be opened
      let canOpenSpecific = lmbManager.canOpenSpecificBox(num);
      if (!canOpenSpecific.allowed && lmbManager.isPendingConfirmation()) {
        await syncLocalProgressFromServer();
        canOpenSpecific = lmbManager.canOpenSpecificBox(num);
      }
      if (!canOpenSpecific.allowed) {
        showToast('⚠️ ' + canOpenSpecific.reason, '⚠️');
        return;
      }
    }

    if (!num || num < 1 || num > 3) {
      showToast('❌ Hộp không hợp lệ', '❌');
      return;
    }

    // ===== CHECK SERVER PERMISSION FIRST =====
    // Show simple loading message while checking permission
    showLoadingOverlay('Đang kiểm tra quyền mở hộp...', '🔍 Xác thực');
    
    try {
      const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/select-box`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Skip-Global-Loader': '1'
        },
        body: JSON.stringify({ sessionCode: state.sessionCode, boxNumber: num })
      });

      console.log('[openBox] response status', response.status);
      const result = await response.json();

      console.log('[openBox] response payload', result);

      if (!result.success) {
        hideLoadingOverlay();
        showToast('❌ ' + result.message, '❌');
        return;
      }

      if (result.requiresApproval) {
        hideLoadingOverlay();
        showToast('⏳ ' + (result.message || 'Phần thưởng cần admin xác nhận'), '⏳');
        showPage('choose');
        return;
      }

      // ===== NOW START ANIMATION - Permission granted =====
      hideLoadingOverlay();
      state.hasOpened = true;
      const openingStartedAt = Date.now();
      showPage('opening', { skipDataLoad: true });
      runOpeningAnimation(num);

      // ===== NEW: Sync API state with manager =====
      if (typeof lmbManager !== 'undefined') {
        // Mark box as opened in manager
        lmbManager.markBoxOpened(result.openedBox || num, result.prize || null);
        
        // Update display (UI will use lmbManager data)
        const info = lmbManager.getSessionInfo();
        const openedEl = document.getElementById('boxOpenedCount');
        if (openedEl) {
          openedEl.textContent = info.openedCount + '/3';
        }
      }

      // ✅ Log full prize data for debugging
      const renderResult = () => {
        if (result.prize) {
          state.currentPrize = result.prize;
          state.currentPrize.boxNumber = result.openedBox || num;
          savePrizeState(result.prize);  // Persist prize to localStorage

          if (typeof lmbManager !== 'undefined' && isUnluckyPrize(result.prize)) {
            lmbManager.confirmCurrentBox();
          }

          showWinResult(result.prize);
          if (!isUnluckyPrize(result.prize)) {
            spawnConfetti();
          }
          setTimeout(() => loadOpenedPrizes(), 300);
          return;
        }

        if (result.won) {
          console.warn('[openBox] missing prize data', result);
          showToast('❌ Lỗi: Không có dữ liệu phần thưởng', '❌');
          showPage('choose');
          return;
        }

        showLoseResult();
        showToast('Chúc bạn may mắn lần sau!', '😢');
      };

      const elapsed = Date.now() - openingStartedAt;
      const waitForAnimationMs = Math.max(0, OPENING_ANIMATION_MIN_MS - elapsed);
      const totalDelay = Math.max(waitForAnimationMs, OPENING_RESULT_DELAY_MS);

      if (totalDelay > 0) {
        setTimeout(renderResult, totalDelay);
      } else {
        renderResult();
      }
    } catch (err) {
      console.error('[openBox] error', err);
      hideLoadingOverlay();
      showToast('❌ Lỗi: ' + err.message, '❌');
      state.hasOpened = false;
    }
  }

  async function syncLocalProgressFromServer() {
    if (!state.sessionCode || typeof lmbManager === 'undefined') return false;
    try {
      const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/player-inventory`);
      if (!response.ok) return false;
      const result = await response.json();
      if (!result.success || !result.data || !Array.isArray(result.data.items)) return false;
      lmbManager.syncOpenedBoxes(result.data.items);
      return true;
    } catch (err) {
      return false;
    }
  }

  // ===== RESULT OVERLAYS =====
  function isUnluckyPrize(prize) {
    if (!prize) return false;
    const type = (prize.type || '').toLowerCase();
    const level = (prize.level || '').toUpperCase();
    const status = (prize.status || '').toUpperCase();
    return type === 'unlucky' || level === 'UNLUCKY' || status === 'UNLUCKY';
  }

  function showWinResult(prize) {
    if (!prize) {
      showToast('❌ Lỗi: Không có dữ liệu phần thưởng', '❌');
      return;
    }

    console.log('[showWinResult] prize', prize);

    applyPrizeTheme(prize);

    const isUnlucky = isUnluckyPrize(prize);

    // Ensure result overlay exists before trying to update it
    const resultOverlay = document.getElementById('resultWinOverlay');
    const resultItemName = document.getElementById('resultItemName');
    const resultItemDesc = document.getElementById('resultItemDesc');
    let resultImg = document.getElementById('resultImg');
    let resultMedia = document.getElementById('resultMedia');
    let resultIconFallback = document.getElementById('resultIconFallback');
    const resultValue = document.getElementById('resultValue');
    const resultValueBadge = resultOverlay ? resultOverlay.querySelector('.result-value-badge') : null;
    const resultTitle = resultOverlay ? resultOverlay.querySelector('.result-title') : null;
    const resultSubtitle = resultOverlay ? resultOverlay.querySelector('.result-subtitle') : null;
    const resultActions = resultOverlay ? resultOverlay.querySelector('.result-actions') : null;

    if (!resultOverlay || !resultItemName || !resultItemDesc || !resultValue) {
      showToast('❌ Lỗi hiển thị kết quả. Vui lòng tải lại trang.', '❌');
      return;
    }

    if (!resultMedia) {
      resultMedia = document.createElement('div');
      resultMedia.className = 'result-media';
      resultMedia.id = 'resultMedia';
      resultMedia.setAttribute('aria-hidden', 'true');
      resultItemName.parentElement.insertBefore(resultMedia, resultItemName);
    }

    if (!resultImg) {
      resultImg = document.createElement('img');
      resultImg.id = 'resultImg';
      resultImg.className = 'result-img';
      resultImg.alt = 'Prize';
      resultMedia.appendChild(resultImg);
    }

    if (!resultIconFallback) {
      resultIconFallback = document.createElement('div');
      resultIconFallback.id = 'resultIconFallback';
      resultIconFallback.className = 'result-icon-fallback';
      resultIconFallback.setAttribute('aria-hidden', 'true');
      resultMedia.appendChild(resultIconFallback);
    }

    // Reset user action choice when showing new result
    state.userChosenAction = null;
    
    // Update header and actions for unlucky
    if (resultTitle) {
      resultTitle.textContent = isUnlucky ? '😢 Rất tiếc!' : '🎉 Chúc Mừng!';
    }
    if (resultSubtitle) {
      resultSubtitle.textContent = isUnlucky ? 'Chúc bạn may mắn lần sau' : 'Bạn đã nhận được';
    }
    const prizeValue = prize.value || prize.amount || 0;
    const valueNum = typeof prizeValue === 'number'
      ? prizeValue
      : Number(String(prizeValue).replace(/[.,\s](?=\d{3}(\D|$))/g, '').replace(/[^\d-]/g, '')) || 0;
    const isCashEnabled = prize.isCash === true || prize.isCash === 1 || String(prize.isCash).toLowerCase() === 'true';
    const canConvert = !isUnlucky && isCashEnabled && valueNum > 0;

    if (resultActions) {
      resultActions.style.display = '';
      if (isUnlucky) {
        resultActions.innerHTML = `<button class="btn-claim" onclick="closeWinOverlay()">➡️ Tiếp tục mở hộp</button>`;
      } else if (canConvert) {
        resultActions.innerHTML = `
          <button class="btn-claim" onclick="claimItem()">🎁 Nhận vật phẩm</button>
          <button class="btn-convert" onclick="convertToMoney()">
            💰 Đổi sang tiền<br>
            <small id="convertAmount" style="font-weight:500;opacity:.9">0 đ</small>
          </button>
        `;
      } else {
        resultActions.innerHTML = `<button class="btn-claim" onclick="claimItem()">🎁 Nhận vật phẩm</button>`;
      }
    }
    if (resultValueBadge) {
      resultValueBadge.style.display = isUnlucky ? 'none' : '';
    }

    // Set prize image with fallback handling
    const imgUrl = prize.img || prize.image || '';
    console.log('[showWinResult] image url', imgUrl);
    
    if (imgUrl && imgUrl.trim() !== '') {
      const img = new Image();
      img.onload = function() {
        resultImg.src = imgUrl;
        resultImg.style.display = 'block';
        if (resultIconFallback) resultIconFallback.style.display = 'none';
      };
      img.onerror = function() {
        console.warn('[showWinResult] image failed to load', imgUrl);
        resultImg.style.display = 'none';
        if (resultIconFallback) {
          const icon = prize.icon || (isUnlucky ? '😢' : '🎁');
          resultIconFallback.textContent = icon;
          resultIconFallback.style.display = 'block';
        }
      };
      img.src = imgUrl;
    } else {
      resultImg.style.display = 'none';
      if (resultIconFallback) {
        const icon = prize.icon || (isUnlucky ? '😢' : '🎁');
        resultIconFallback.textContent = icon;
        resultIconFallback.style.display = 'block';
      }
    }
    
    resultItemName.textContent = prize.name || 'Phần Thưởng';
    resultItemDesc.textContent = prize.description || prize.desc || '';
    
    // Safely handle prize value
    resultValue.textContent = formatMoneyComma(valueNum) + ' đ';
    
    const convertVal = isCashEnabled
      ? valueNum
      : (prize.convertValue || Math.floor(valueNum * 0.7));
    const convertAmountEl = document.getElementById('convertAmount');
    if (convertAmountEl) {
      convertAmountEl.textContent = formatMoneyComma(convertVal) + ' đ';
    }
    
    // Ensure buttons are enabled when showing result
    const claimBtn = document.querySelector('.btn-claim');
    const convertBtn = document.querySelector('.btn-convert');
    if (claimBtn) {
      claimBtn.style.opacity = '1';
      claimBtn.style.pointerEvents = 'auto';
      claimBtn.style.cursor = 'pointer';
      claimBtn.title = '';
    }
    if (convertBtn) {
      convertBtn.style.opacity = '1';
      convertBtn.style.pointerEvents = 'auto';
      convertBtn.style.cursor = 'pointer';
      convertBtn.title = '';
    }
    
    // Add overlay with multiple safeguards to ensure visibility
    resultOverlay.classList.add('active');
    resultOverlay.style.setProperty('display', 'flex', 'important');  // Force display with !important
    resultOverlay.style.setProperty('visibility', 'visible', 'important');  // Ensure visibility
    resultOverlay.style.setProperty('opacity', '1', 'important');  // Ensure full opacity
    
    // Force browser reflow to apply changes immediately
    void resultOverlay.offsetHeight;
    void resultOverlay.offsetWidth;
  }

  function applyPrizeTheme(prize) {
    const resultOverlay = document.getElementById('resultWinOverlay');
    const resultValue = document.getElementById('resultValue');
    if (!resultOverlay || !resultValue) return;

    const rarityColors = {
      legendary: '#f97316',
      epic: '#8b5cf6',
      rare: '#3b82f6',
      uncommon: '#22c55e',
      common: '#94a3b8',
      VIP: '#f59e0b',
      NORMAL: '#3b82f6',
      UNLUCKY: '#ef4444'
    };

    const color = prize.colorHex || rarityColors[prize.rarity] || rarityColors[prize.level] || '#3b82f6';
    resultOverlay.style.boxShadow = `0 0 0 1px ${color}66, 0 20px 60px rgba(0,0,0,0.45)`;
    resultOverlay.style.borderColor = `${color}55`;
    resultValue.style.color = color;
  }

  function showLoseResult() {
    const resultLoseOverlay = document.getElementById('resultLoseOverlay');
    if (!resultLoseOverlay) {
      showToast('❌ Lỗi hiển thị kết quả thua. Vui lòng tải lại trang.', '❌');
      return;
    }
    
    // Add overlay with multiple safeguards to ensure visibility
    resultLoseOverlay.classList.add('active');
    resultLoseOverlay.style.setProperty('display', 'flex', 'important');  // Force display with !important
    resultLoseOverlay.style.setProperty('visibility', 'visible', 'important');  // Ensure visibility
    resultLoseOverlay.style.setProperty('opacity', '1', 'important');  // Ensure full opacity
    
    // Force browser reflow to apply changes immediately
    void resultLoseOverlay.offsetHeight;
    void resultLoseOverlay.offsetWidth;
  }

  function closeLoseOverlay() {
    const resultLoseOverlay = document.getElementById('resultLoseOverlay');
    if (resultLoseOverlay) {
      resultLoseOverlay.classList.remove('active');
    }
    showPage('choose');
  }

  function closeWinOverlay() {
    const resultWinOverlay = document.getElementById('resultWinOverlay');
    if (resultWinOverlay) {
      resultWinOverlay.classList.remove('active');
      resultWinOverlay.style.removeProperty('display');
      resultWinOverlay.style.removeProperty('visibility');
      resultWinOverlay.style.removeProperty('opacity');
    }
    showPage('choose');
    setTimeout(() => {
      loadOpenedPrizes();
      loadExchangeOptions();
    }, 80);
  }

  window.closeWinOverlay = closeWinOverlay;

  function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (field) field.classList.add('input-error');
    if (errorEl) errorEl.textContent = message || '';
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (field) field.classList.remove('input-error');
    if (errorEl) errorEl.textContent = '';
  }

  function clearFieldErrors(fieldIds = []) {
    fieldIds.forEach((id) => clearFieldError(id));
  }

  // ===== CLAIMING & CONVERSION =====
  async function claimItem() {
    if (!state.currentPrize) {
      showToast('❌ Lỗi: Không có vật phẩm để nhận', '❌');
      return;
    }

    // ✅ Double-check if prize is UNLUCKY
    if (isUnluckyPrize(state.currentPrize)) {
      showToast('💔 Phần thưởng xui lỗi! Không thể nhận phần thưởng này.', '❌');
      return;
    }

    // Mark that user chose to claim (prevent conversion)
    state.userChosenAction = 'claim';
    updateExchangeButtonStates();

    // Open modal to collect info - using current prize data
    openClaimModal(state.currentPrize);
    const resultWinOverlay = document.getElementById('resultWinOverlay');
    if (resultWinOverlay) {
      resultWinOverlay.classList.remove('active');
      resultWinOverlay.style.removeProperty('display');
      resultWinOverlay.style.removeProperty('visibility');
      resultWinOverlay.style.removeProperty('opacity');
    }
  }

  function openClaimModal(prize) {
    if (!prize) {
      showToast('❌ Lỗi: Không tìm thấy vật phẩm', '❌');
      return;
    }
    
    const item = prize;
    state.claimingBoxNumber = prize.boxNumber || null;
    const claimModalItemName = document.getElementById('claimModalItemName');
    const claimName = document.getElementById('claimName');
    const claimPhone = document.getElementById('claimPhone');
    const claimEmail = document.getElementById('claimEmail');
    const claimAddress = document.getElementById('claimAddress');
    const claimCity = document.getElementById('claimCity');
    const claimNote = document.getElementById('claimNote');
    const claimModal = document.getElementById('claimModal');
    const claimProfile = loadSessionProfile('claimProfile', {});
    
    if (!claimModalItemName || !claimName || !claimPhone || !claimEmail || !claimAddress || !claimCity || !claimNote || !claimModal) {
      showToast('❌ Lỗi hiển thị form nhận quà. Vui lòng tải lại trang.', '❌');
      return;
    }
    
    claimModalItemName.textContent = '📦 ' + item.name;
    claimName.value = state.playerName || claimProfile.name || localStorage.getItem('lmbPlayerName') || '';
    claimPhone.value = state.playerPhone || claimProfile.phone || localStorage.getItem('lmbPlayerPhone') || '';
    claimEmail.value = state.playerEmail || claimProfile.email || localStorage.getItem('lmbPlayerEmail') || '';
    claimAddress.value = claimProfile.address || state.playerAddress || '';
    claimCity.value = claimProfile.city || state.playerCity || '';
    claimNote.value = claimProfile.note || state.playerNote || '';
    clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
    claimModal.classList.add('active');
  }

  function closeClaimModal() {
    const claimModal = document.getElementById('claimModal');
    if (claimModal) {
      claimModal.classList.remove('active');
    }
    clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
    state.claimingItemIndex = -1;
    showPage('inventory');
  }

  function confirmClaim() {
    const claimNameEl = document.getElementById('claimName');
    const claimPhoneEl = document.getElementById('claimPhone');
    const claimEmailEl = document.getElementById('claimEmail');
    const claimAddressEl = document.getElementById('claimAddress');
    const claimCityEl = document.getElementById('claimCity');
    const claimNoteEl = document.getElementById('claimNote');
    
    if (!claimNameEl || !claimPhoneEl || !claimEmailEl || !claimAddressEl || !claimCityEl || !claimNoteEl) {
      showToast('❌ Lỗi form. Vui lòng tải lại trang.', '❌');
      return;
    }
    
    const name = claimNameEl.value.trim();
    const phone = claimPhoneEl.value.trim();
    const email = claimEmailEl.value.trim();
    const address = claimAddressEl.value.trim();
    const city = claimCityEl.value.trim();

    const phoneOk = /^\d{10,11}$/.test(phone);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);

    let hasError = false;

    if (!name) {
      setFieldError('claimName', 'Vui lòng nhập họ và tên người nhận.');
      hasError = true;
    }

    if (!phone) {
      setFieldError('claimPhone', 'Vui lòng nhập số điện thoại.');
      hasError = true;
    } else if (!phoneOk) {
      setFieldError('claimPhone', 'Số điện thoại phải gồm 10-11 chữ số.');
      hasError = true;
    }

    if (!email) {
      setFieldError('claimEmail', 'Vui lòng nhập email liên hệ.');
      hasError = true;
    } else if (!emailOk) {
      setFieldError('claimEmail', 'Email không hợp lệ.');
      hasError = true;
    }

    if (!address) {
      setFieldError('claimAddress', 'Vui lòng nhập địa chỉ giao hàng.');
      hasError = true;
    }

    if (!city) {
      setFieldError('claimCity', 'Vui lòng chọn tỉnh/thành phố.');
      hasError = true;
    }

    if (hasError) {
      showToast('❌ Vui lòng kiểm tra thông tin nhận quà', '❌');
      return;
    }

    submitClaim({
      name,
      phone,
      email,
      address,
      city,
      note: claimNoteEl.value.trim(),
      boxNumber: state.claimingBoxNumber || state.currentPrize?.boxNumber || null
    });
  }

  async function submitClaim(formData) {
    setButtonLoading('claimSubmitBtn', true, 'Đang gửi thông tin...');
    const claimLoadingMinDuration = getDefaultLoadingDurationMs();
    const claimLoadingStartedAt = Date.now();
    const claimLoadingToken = startLoadingSequence('Đang gửi yêu cầu nhận quà', [
      'Đang gửi thông tin nhận quà...',
      'Đang kiểm tra họ tên, số điện thoại và email...',
      'Hệ thống đang ghi nhận địa chỉ giao quà...',
      'Sắp hoàn tất, đang chuyển đến trang cảm ơn...'
    ], Math.max(500, Math.floor(claimLoadingMinDuration / 4)));
    try {
      console.log('[submitClaim] payload', formData);
      const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log('[submitClaim] response status', response.status);
      const text = await response.text();
      
      let result = {};
      try {
        result = JSON.parse(text);
      } catch (e) {
        result = { success: false, message: 'Invalid response from server' };
      }

      console.log('[submitClaim] response payload', result);
      
      if (!result.success) {
        await waitForDefaultLoading(claimLoadingStartedAt, claimLoadingMinDuration);
        stopLoadingSequence(claimLoadingToken);
        const errorMsg = resolveRequestError(response, result, 'Không thể xử lý yêu cầu');
        showToast('❌ ' + errorMsg, '❌');
        return;
      }

      document.getElementById('claimModal').classList.remove('active');
      state.claimingItemIndex = -1;
      
      // ✅ NEW: Confirm current box in manager
      if (typeof lmbManager !== 'undefined') {
        lmbManager.confirmCurrentBox();
      }
      
      showToast('✅ ' + result.message, '📦');
      
      // Save form data to state for thank you page
      state.playerName = formData.name;
      state.playerPhone = formData.phone;
      state.playerEmail = formData.email;
      state.playerAddress = formData.address;
      state.playerCity = formData.city;
      state.playerNote = formData.note || '';
      state.claimMethod = 'Giao hàng';

      localStorage.setItem('lmbPlayerName', formData.name);
      localStorage.setItem('lmbPlayerPhone', formData.phone);
      localStorage.setItem('lmbPlayerEmail', formData.email);
      saveSessionProfile('claimProfile', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        note: formData.note || ''
      });

      updateLoadingOverlayMessage('Yêu cầu nhận quà thành công. Đang chuyển trang...');
      await waitForDefaultLoading(claimLoadingStartedAt, claimLoadingMinDuration);
      stopLoadingSequence(claimLoadingToken);
      
      // Show thank you page with claim details
      showThankYouPage({
        method: 'Giao hàng',
        address: formData.address,
        playerName: formData.name,
        playerPhone: formData.phone,
        playerAddress: formData.address,
        confirmationCode: result?.data?.confirmationCode || ''
      });
    } catch (err) {
      await waitForDefaultLoading(claimLoadingStartedAt, claimLoadingMinDuration);
      stopLoadingSequence(claimLoadingToken);
      showToast('❌ Lỗi từ server. Vui lòng thử lại sau.', '❌');
    } finally {
      setButtonLoading('claimSubmitBtn', false);
    }
  }

  async function convertToMoney() {
    if (!state.sessionCode || !state.currentPrize) return;

    // ✅ Check if prize is UNLUCKY
    if (isUnluckyPrize(state.currentPrize)) {
      showToast('💔 Phần thưởng xui lỗi! Không thể đổi sang tiền mặt.', '❌');
      return;
    }

    // Mark that user chose to convert (prevent claiming)
    state.userChosenAction = 'convert';
    updateExchangeButtonStates();

    const convertLoadingMinDuration = getDefaultLoadingDurationMs();
    const convertLoadingStartedAt = Date.now();

    const convertLoadingToken = startLoadingSequence('Đang gửi yêu cầu quy đổi tiền', [
      'Đang tạo yêu cầu quy đổi...',
      'Đang đối soát giá trị phần thưởng...',
      'Đang gửi yêu cầu chờ admin duyệt...',
      'Sắp hoàn tất, đang cập nhật ví phiên...'
    ], Math.max(500, Math.floor(convertLoadingMinDuration / 4)));

    try {
      const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boxNumber: state.currentPrize?.boxNumber || null })
      });

      const result = await response.json();
      if (!result.success) {
        await waitForDefaultLoading(convertLoadingStartedAt, convertLoadingMinDuration);
        stopLoadingSequence(convertLoadingToken);
        const errorMsg = resolveRequestError(response, result, 'Không thể gửi yêu cầu quy đổi.');
        showToast('❌ ' + errorMsg, '❌');
        return;
      }

      updateLoadingOverlayMessage('Yêu cầu quy đổi đã gửi thành công. Đang mở ví phiên...');
      await waitForDefaultLoading(convertLoadingStartedAt, convertLoadingMinDuration);
      stopLoadingSequence(convertLoadingToken);

      const resultWinOverlay = document.getElementById('resultWinOverlay');
      if (resultWinOverlay) {
        resultWinOverlay.classList.remove('active');
        resultWinOverlay.style.removeProperty('display');
        resultWinOverlay.style.removeProperty('visibility');
        resultWinOverlay.style.removeProperty('opacity');
      }
      const displayAmount = Math.floor(result.cashAmount || 0).toLocaleString('vi-VN');
      showToast('⏳ Yêu cầu quy đổi ' + displayAmount + ' đ đã gửi, đang chờ duyệt.', '⏳');

      if (typeof lmbManager !== 'undefined') {
        lmbManager.confirmCurrentBox();
      }
      
      // Go to wallet page to track pending conversion status
      showPage('wallet', { skipDataLoad: true });
      state.convertedAmount = result.cashAmount;
      
      // Refresh wallet to show the new converted amount
      setTimeout(() => {
        loadWallet({ showLoader: false });
      }, 300);

      setTimeout(() => {
        loadOpenedPrizes();
        loadExchangeOptions();
      }, 350);
    } catch (err) {
      await waitForDefaultLoading(convertLoadingStartedAt, convertLoadingMinDuration);
      stopLoadingSequence(convertLoadingToken);
      showToast('❌ Lỗi từ server. Vui lòng thử lại sau.', '❌');
    }
  }

  // ===== UPDATE BUTTON STATES BASED ON USER CHOICE =====
  function updateExchangeButtonStates() {
    const claimBtn = document.querySelector('.btn-claim');
    const convertBtn = document.querySelector('.btn-convert');
    
    if (!claimBtn || !convertBtn) return;
    
    // Disable claim button if user chose convert
    if (state.userChosenAction === 'convert') {
      claimBtn.style.opacity = '0.5';
      claimBtn.style.pointerEvents = 'none';
      claimBtn.style.cursor = 'not-allowed';
      claimBtn.title = 'Bạn đã chọn đổi sang tiền. Không thể nhận quà!';
    }
    // Disable convert button if user chose claim
    else if (state.userChosenAction === 'claim') {
      convertBtn.style.opacity = '0.5';
      convertBtn.style.pointerEvents = 'none';
      convertBtn.style.cursor = 'not-allowed';
      convertBtn.title = 'Bạn đã chọn nhận quà. Không thể đổi sang tiền!';
    }
  }

  // ===== LOAD WALLET & INVENTORY =====
  // ===== LOAD WALLET & INVENTORY =====
  async function loadWallet(options = {}) {
    if (!state.sessionCode) return;

    const showLoader = options.showLoader === true;
    const walletTask = async () => {

    try {
      // Update session code display
      const walletSessionCodeEl = document.getElementById('walletSessionCode');
      if (walletSessionCodeEl) {
        walletSessionCodeEl.textContent = state.sessionCode;
      }

      const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/wallet`);
      const result = await response.json();

      if (!result.success) {
        showToast('❌ Lỗi khi tải ví', '❌');
        return;
      }

      // Update wallet UI with fresh data
      const data = result.data || {};
      const toNum = v => Number(v) || 0;
      const fmt = v => Math.floor(toNum(v)).toLocaleString('vi-VN') + ' đ';

      const balance = toNum(data.balance);
      const withdrawn = toNum(data.withdrawn);
      const pending = toNum(data.pending);
      const pendingConversion = toNum(data.pending_conversion);
      const used = Number.isFinite(Number(data.used)) ? toNum(data.used) : (withdrawn + pending);
      const remaining = Number.isFinite(Number(data.remaining))
        ? Math.max(0, toNum(data.remaining))
        : Math.max(0, balance - used);
      const trustScore = Number(data.trust_score);
      
      const walletBalanceEl = document.getElementById('walletBalance');
      const navWalletEl = document.getElementById('navWalletAmount');
      const remainingEl = document.getElementById('walletRemaining');
      const walletTotalEl = document.getElementById('walletTotal');
      const walletWithdrawnEl = document.getElementById('walletWithdrawn');
      const walletPendingConversionEl = document.getElementById('walletPendingConversion');
      
      if (walletBalanceEl) walletBalanceEl.textContent = fmt(remaining);
      if (navWalletEl) navWalletEl.textContent = fmt(remaining);
      if (walletTotalEl) walletTotalEl.textContent = fmt(balance);
      if (walletWithdrawnEl) walletWithdrawnEl.textContent = fmt(withdrawn);
      if (walletPendingConversionEl) walletPendingConversionEl.textContent = fmt(pendingConversion);
      if (remainingEl) remainingEl.textContent = fmt(remaining);
      const chooseTrustScoreEl = document.getElementById('chooseTrustScore');
      if (chooseTrustScoreEl) {
        chooseTrustScoreEl.textContent = Number.isFinite(trustScore)
          ? Math.max(0, Math.min(100, Math.round(trustScore))).toString()
          : '--';
      }
      
      state.walletTransactions = Array.isArray(data.transactions) ? data.transactions : [];
      state.walletTxFilter = 'all';
      state.walletTxPage = 1;
      renderTxList(state.walletTxFilter, state.walletTransactions);
    } catch (err) {
      showToast('❌ Lỗi: ' + err.message, '❌');
    }
    };

    if (showLoader) {
      await withGlobalPageLoader('Đang tải ví phiên...', walletTask, { minVisibleMs: 360 });
      return;
    }

    await walletTask();
  }

  // Update wallet display based on current state.balance
  function updateWalletDisplay() {
    const fmt = v => Math.floor(v || 0).toLocaleString('vi-VN') + ' đ';
    const balance = state.balance || 0;
    
    const walletBalanceEl = document.getElementById('walletBalance');
    const navWalletEl = document.getElementById('navWalletAmount');
    
    if (walletBalanceEl) {
      walletBalanceEl.textContent = fmt(balance);
    }
    if (navWalletEl) {
      navWalletEl.textContent = fmt(balance);
    }
  }

  async function loadInventory(options = {}) {
    if (!state.sessionCode) return;

    const showLoader = options.showLoader === true;
    const inventoryTask = async () => {

    try {
      // Update session code display
      const inventorySessionCodeEl = document.getElementById('inventorySessionCode');
      if (inventorySessionCodeEl) {
        inventorySessionCodeEl.textContent = state.sessionCode;
      }

      const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/inventory`);
      const result = await response.json();

      if (!result.success) {
        showToast('❌ Lỗi khi tải kho', '❌');
        return;
      }

      // Update inventory UI with fresh data
      const cont = document.getElementById('inventoryContent');
      const items = result.data || [];

      if (items.length === 0) {
        cont.innerHTML = `
          <div class="empty-state">
            <span class="empty-state-icon">📦</span>
            <div class="empty-state-title">Kho vật phẩm trống</div>
            <div class="empty-state-desc">Bạn chưa có vật phẩm nào. Hãy mở hộp quà để nhận phần thưởng!</div>
          </div>`;
        return;
      }

      cont.innerHTML = `<div class="inventory-grid">${items
        .map((item, idx) => {
          const status = item.status || 'pending';
          const isApproved = status === 'approved';
          const isPending = status === 'pending';
          const isRejected = status === 'rejected';
          
          // Get prize name with fallback
          const prizeName = item.prizeName || item.prize_name || 'Phần quà';
          const recipientName = item.recipientName || 'N/A';
          
          let statusBadge = '';
          if (isApproved) {
            statusBadge = `
              <div style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);border-radius:10px;padding:8px 12px;font-size:12px;font-weight:600;color:#34d399;text-align:center;margin-top:12px">
                ✅ Đã xác nhận<br>
                <span style="font-weight:400;opacity:.8;font-size:11px">Người nhận: ${recipientName}</span>
              </div>`;
          } else if (isPending) {
            statusBadge = `
              <div style="background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.4);border-radius:10px;padding:8px 12px;font-size:12px;font-weight:600;color:#60a5fa;text-align:center;margin-top:12px">
                ⏳ Chờ xác nhận
              </div>`;
          } else if (isRejected) {
            statusBadge = `
              <div style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);border-radius:10px;padding:8px 12px;font-size:12px;font-weight:600;color:#f87171;text-align:center;margin-top:12px">
                ❌ Yêu cầu bị từ chối
              </div>`;
          }
          
          return `
          <div class="inventory-item-card">
            <div style="text-align: center; margin-bottom: 12px; min-height: 80px; display: flex; align-items: center; justify-content: center; background: var(--bg4); border-radius: 8px; overflow: hidden;">
              ${item.prizeImage && item.prizeImage.trim() ? `<img src="${item.prizeImage}" alt="${prizeName}" style="max-width: 100%; max-height: 80px; object-fit: contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''} 
              <div style="display: ${item.prizeImage && item.prizeImage.trim() ? 'none' : 'flex'}; font-size: 48px; align-items: center; justify-content: center;">${item.prizeIcon || '🎁'}</div>
            </div>
            <div class="inventory-item-name">${prizeName}</div>
            <div class="inventory-item-val">Hộp #${item.boxNumber}</div>
            ${statusBadge}
          </div>`;
        })
        .join('')}</div>`;
    } catch (err) {
      showToast('❌ Lỗi: ' + err.message, '❌');
    }
    };

    if (showLoader) {
      await withGlobalPageLoader('Đang tải kho đồ...', inventoryTask, { minVisibleMs: 320 });
      return;
    }

    await inventoryTask();
  }

  // ===== TRANSACTION LIST RENDERING =====
  async function renderTxList(filter, transactions) {
    const list = document.getElementById('txList');
    const pagination = document.getElementById('txPagination');
    if (!list) return;
    
    try {
      let txs = transactions || [];
      
      // If no transactions provided, fetch them
      if (!transactions && state.sessionCode) {
        if (Array.isArray(state.walletTransactions) && state.walletTransactions.length > 0) {
          txs = state.walletTransactions;
        } else {
        const filterParam = filter && filter !== 'all' ? `?filter=${filter}` : '';
        const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/transactions${filterParam}`);
        const result = await response.json();

        if (!result.success) {
          list.innerHTML = `<div class="empty-state" style="padding:40px 0">
            <div class="empty-state-title" style="font-size:15px">Lỗi khi tải giao dịch</div>
          </div>`;
          return;
        }
        txs = result.data || [];
        }
      }

      if (filter && filter !== 'all') {
        txs = txs.filter(tx => {
          if (filter === 'withdraw') {
            return String(tx.type || '').startsWith('withdraw') || tx.type === 'cash_prize';
          }
          if (filter === 'exchange') {
            return String(tx.type || '').startsWith('conversion') || tx.type === 'exchange';
          }
          if (filter === 'win') {
            return tx.type === 'win';
          }
          return true;
        });
      }

      if (txs.length === 0) {
        list.innerHTML = `<div class="empty-state" style="padding:40px 0">
          <div class="empty-state-title" style="font-size:15px">Chưa có giao dịch nào</div>
          <div class="empty-state-desc">Mở hộp quà để bắt đầu!</div>
        </div>`;
        if (pagination) pagination.innerHTML = '';
        return;
      }

      const pageSize = Math.max(1, Number(state.walletTxPageSize) || 6);
      const totalPages = Math.max(1, Math.ceil(txs.length / pageSize));
      if (state.walletTxPage > totalPages) state.walletTxPage = totalPages;
      if (state.walletTxPage < 1) state.walletTxPage = 1;
      const startIndex = (state.walletTxPage - 1) * pageSize;
      const pageItems = txs.slice(startIndex, startIndex + pageSize);

      list.innerHTML = pageItems
        .map(tx => {
          const amount = tx.amount || 0;
          const status = tx.status || 'pending';
          const isWithdraw = (tx.type || '') === 'withdraw' || (tx.type || '') === 'cash_prize';
          const isConversion = String(tx.type || '').startsWith('conversion');
          const statusColor = status === 'approved' ? '#34d399' : status === 'rejected' ? '#f87171' : '#fbbf24';
          const statusText = status === 'approved'
            ? (isConversion ? '✅ Đã cộng vào ví phiên' : '✅ Hoàn thành')
            : status === 'rejected'
              ? '❌ Bị từ chối'
              : (isConversion ? '⏳ Chờ duyệt quy đổi vào ví' : '⏳ Chờ duyệt');
          const txName = isConversion
            ? '💱 Quy đổi vào ví'
            : (isWithdraw ? '💰 Rút tiền' : '📋 ' + (tx.type || 'Giao dịch'));
          const txDate = new Date(tx.requestedAt || tx.requested_at || Date.now()).toLocaleDateString('vi-VN');
          
          return `
          <div class="tx-item">
            <div class="tx-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="tx-info">
              <div class="tx-name">${txName}</div>
              <div class="tx-date">${txDate}</div>
            </div>
            <div style="text-align:right">
              <div class="tx-amount">${isWithdraw ? '-' : '+'}${Math.floor(amount).toLocaleString('vi-VN')} đ</div>
              <div class="tx-status" style="color:${statusColor}">${statusText}</div>
            </div>
          </div>`;
        })
        .join('');

      if (pagination) {
        if (totalPages <= 1) {
          pagination.innerHTML = '';
        } else {
          const maxPagesToShow = 5;
          let startPage = Math.max(1, state.walletTxPage - Math.floor(maxPagesToShow / 2));
          let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
          if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
          }

          let html = '';
          html += `<button type="button" onclick="setWalletTxPage(${state.walletTxPage - 1})" ${state.walletTxPage === 1 ? 'disabled' : ''} style="padding:6px 10px;border-radius:8px;border:1px solid rgba(148,163,184,.35);background:var(--bg4);color:var(--text);cursor:pointer;">‹</button>`;

          for (let page = startPage; page <= endPage; page++) {
            const isActive = page === state.walletTxPage;
            html += `<button type="button" onclick="setWalletTxPage(${page})" style="min-width:34px;padding:6px 10px;border-radius:8px;border:1px solid ${isActive ? 'rgba(59,130,246,.65)' : 'rgba(148,163,184,.35)'};background:${isActive ? 'rgba(59,130,246,.2)' : 'var(--bg4)'};color:${isActive ? '#93c5fd' : 'var(--text)'};cursor:pointer;font-weight:${isActive ? '700' : '500'};">${page}</button>`;
          }

          html += `<button type="button" onclick="setWalletTxPage(${state.walletTxPage + 1})" ${state.walletTxPage === totalPages ? 'disabled' : ''} style="padding:6px 10px;border-radius:8px;border:1px solid rgba(148,163,184,.35);background:var(--bg4);color:var(--text);cursor:pointer;">›</button>`;
          html += `<span style="font-size:12px;color:var(--text-dim);margin-left:4px;">Trang ${state.walletTxPage}/${totalPages}</span>`;
          pagination.innerHTML = html;
        }
      }
    } catch (err) {
      showToast('❌ Lỗi: ' + err.message, '❌');
    }
  }

  function setWalletTxPage(page) {
    state.walletTxPage = Math.max(1, Number(page) || 1);
    renderTxList(state.walletTxFilter || 'all', state.walletTransactions);
  }

  function filterTx(type, el) {
    document.querySelectorAll('.tx-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    state.walletTxFilter = type;
    state.walletTxPage = 1;
    renderTxList(type, state.walletTransactions);
  }

  // ===== SEARCH =====
  async function searchSession() {
    const code = document.getElementById('searchInput').value.trim();
    const res = document.getElementById('searchResult');

    if (!code) {
      res.innerHTML = `<div class="empty-state" style="padding:40px 0">
        <div class="empty-state-title">Vui lòng nhập mã phiên</div>
      </div>`;
      return;
    }

    try {
      const response = await fetch(`/api/lucky-mystery-box/search?code=${encodeURIComponent(code)}`);
      const result = await response.json();

      if (result.success) {
        res.innerHTML = `<div class="search-result-card">
          <div class="search-result-title">✅ Kết quả tra cứu phiên: <strong style="color:var(--purple-light)">${code}</strong></div>
          <div style="font-size:13px;color:var(--text-dim);margin-bottom:8px">Trạng thái: <span style="color:var(--green);font-weight:700">Đang hoạt động</span></div>
          <div style="font-size:13px;color:var(--text-dim)">Số dư: <strong style="color:var(--text)">${Math.floor(result.data.wallet.balance).toLocaleString('vi-VN')} đ</strong></div>
          <div style="font-size:13px;color:var(--text-dim);margin-top:4px">Vật phẩm: <strong style="color:var(--text)">${result.data.inventory.length} item</strong></div>
        </div>`;
      } else {
        res.innerHTML = `<div class="search-result-card" style="border-color:rgba(239,68,68,.3)">
          <div class="search-result-title" style="color:#f87171">❌ Không tìm thấy phiên: <strong>${code}</strong></div>
          <div style="font-size:13px;color:var(--text-dim)">Mã phiên không tồn tại hoặc đã hết hạn.</div>
        </div>`;
      }
    } catch (err) {
      showToast('❌ Lỗi: ' + err.message, '❌');
    }
  }

  // ===== WITHDRAW =====
  async function openWithdrawModal() {
    
    // ✅ CHECK IF PRIZE IS UNLUCKY - CANNOT WITHDRAW
    // Access game.prize from window scope if available
    if (typeof game !== 'undefined' && isUnluckyPrize(game.prize)) {
      showToast('💔 Phần thưởng xui lỗi! Không thể đổi sang tiền mặt.', '❌');
      return;
    }
    
    // Validate session before allowing withdrawal
    if (!validateSession()) {
      showToast('❌ Phiên của bạn đã hết hạn. Vui lòng tham gia phiên mới.', '❌');
      return;
    }
    
    if (!state.sessionCode || state.sessionCode.trim() === '') {
      showToast('❌ Lỗi: Không có mã phiên. Vui lòng tham gia phiên trước.', '❌');
      return;
    }
    
    await withGlobalPageLoader('Đang mở biểu mẫu rút tiền...', async () => {
      // ✅ Fetch balance from API first (more reliable)
      let balance = 0;
      try {
        const walletResponse = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/wallet`);
        if (walletResponse.ok) {
          const walletData = await walletResponse.json();
          if (walletData.success && walletData.data) {
            const trustScore = Number(walletData.data.trust_score);
            if (Number.isFinite(trustScore) && trustScore < 100) {
              showToast('Điểm tín nhiệm quá thấp hiện chưa thể rút tiền. Vui lòng liên hệ với nhân viên để được hỗ trợ!', '❌');
              return;
            }

            const toNum = v => Number(v) || 0;
            const apiBalance = toNum(walletData.data.balance);
            const apiWithdrawn = toNum(walletData.data.withdrawn);
            const apiRemaining = Number.isFinite(Number(walletData.data.remaining))
              ? toNum(walletData.data.remaining)
              : Math.max(0, apiBalance - apiWithdrawn);
            balance = apiRemaining;
          }
        }
      } catch (err) {
      }

      // Fallback: Try to get from DOM if API fetch fails or returns 0
      if (balance <= 0) {
        const walletBalanceEl = document.getElementById('walletBalance');
        if (walletBalanceEl && walletBalanceEl.textContent) {
          const balanceText = walletBalanceEl.textContent.replace(/\s*đ\s*$/, '').replace(/,/g, '');
          balance = parseInt(balanceText) || 0;
        }
      }

      // Check existing withdrawals only to prefill contact/bank information
      await checkExistingWithdrawal();

      if (balance <= 0) {
        showToast('❌ Bạn không có số tiền để rút.', '❌');
        return;
      }

      // ✅ IMPORTANT: Save balance to state for later use in confirmWithdraw
      state.balance = balance;

      // Prefill contact info from state/localStorage (won't overwrite values set by checkExistingWithdrawal)
      const withdrawProfile = loadSessionProfile('withdrawProfile', {});
      const savedName = state.playerName || withdrawProfile.customerName || localStorage.getItem('lmbPlayerName') || '';
      const savedPhone = state.playerPhone || withdrawProfile.customerPhone || localStorage.getItem('lmbPlayerPhone') || '';
      const savedEmail = state.playerEmail || withdrawProfile.customerEmail || localStorage.getItem('lmbPlayerEmail') || '';
      const withdrawCustomerName = document.getElementById('withdrawCustomerName');
      const withdrawCustomerPhone = document.getElementById('withdrawCustomerPhone');
      const withdrawCustomerEmail = document.getElementById('withdrawCustomerEmail');
      const withdrawBank = document.getElementById('withdrawBank');
      const withdrawAccount = document.getElementById('withdrawAccount');
      const withdrawName = document.getElementById('withdrawName');
      const withdrawAmount = document.getElementById('withdrawAmount');
      if (withdrawCustomerName && !withdrawCustomerName.value) withdrawCustomerName.value = savedName;
      if (withdrawCustomerPhone && !withdrawCustomerPhone.value) withdrawCustomerPhone.value = savedPhone;
      if (withdrawCustomerEmail && !withdrawCustomerEmail.value) withdrawCustomerEmail.value = savedEmail;
      if (withdrawBank && !withdrawBank.value && withdrawProfile.bankName) withdrawBank.value = withdrawProfile.bankName;
      if (withdrawAccount && !withdrawAccount.value && withdrawProfile.accountNumber) withdrawAccount.value = withdrawProfile.accountNumber;
      if (withdrawName && !withdrawName.value && withdrawProfile.accountHolder) withdrawName.value = withdrawProfile.accountHolder;
      if (withdrawAmount && !withdrawAmount.value && withdrawProfile.amount) {
        withdrawAmount.value = formatMoneyComma(withdrawProfile.amount);
      }
      if (withdrawAmount) bindMoneyCommaInput(withdrawAmount);

      const modalBalance = document.getElementById('modalBalance');
      if (modalBalance) {
        modalBalance.textContent = formatMoneyComma(balance) + ' đ';
      }

      const withdrawModal = document.getElementById('withdrawModal');
      if (withdrawModal) {
        clearFieldErrors(['withdrawCustomerName', 'withdrawCustomerPhone', 'withdrawCustomerEmail', 'withdrawBank', 'withdrawAccount', 'withdrawName', 'withdrawAmount']);
        const submitBtn = document.getElementById('withdrawSubmitBtn');
        if (submitBtn) submitBtn.textContent = 'Xác nhận rút tiền';
        withdrawModal.classList.add('active');
      }
    }, { light: true, minVisibleMs: 220 });
  }

  function closeWithdrawModal() {
    document.getElementById('withdrawModal').classList.remove('active');
    clearFieldErrors(['withdrawCustomerName', 'withdrawCustomerPhone', 'withdrawCustomerEmail', 'withdrawBank', 'withdrawAccount', 'withdrawName', 'withdrawAmount']);
    const noticeEl = document.getElementById('existingWithdrawalNotice');
    if (noticeEl) { noticeEl.textContent = ''; noticeEl.style.display = 'none'; }
    const submitBtn = document.getElementById('withdrawSubmitBtn');
    if (submitBtn) submitBtn.textContent = 'Xác nhận rút tiền';
    const amountField = document.getElementById('withdrawAmount');
    if (amountField) amountField.disabled = false;
    state.existingWithdrawalId = null;
    state.isUpdatingWithdrawal = false;
  }

  async function checkExistingWithdrawal() {
    try {
      const response = await fetch(`/api/withdrawals/session/${state.sessionCode}`);
      const result = await response.json();
      
      if (!result.success || !result.data || result.data.length === 0) {
        return;
      }

      const sorted = [...result.data].sort((a, b) => {
        const ta = new Date(a.requested_at || a.created_at || a.createdAt || 0).getTime();
        const tb = new Date(b.requested_at || b.created_at || b.createdAt || 0).getTime();
        return tb - ta;
      });

      const latestWithdrawal = sorted[0];

      if (!latestWithdrawal) {
        return;
      }

      // Always create new requests; only prefill beneficiary/contact information.
      state.existingWithdrawalId = null;
      state.isUpdatingWithdrawal = false;

      if (latestWithdrawal.account_holder) {
        const nameField = document.getElementById('withdrawName');
        if (nameField && !nameField.value) nameField.value = latestWithdrawal.account_holder;
      }
      if (latestWithdrawal.customer_name) {
        const contactNameField = document.getElementById('withdrawCustomerName');
        if (contactNameField && !contactNameField.value) contactNameField.value = latestWithdrawal.customer_name;
      }
      if (latestWithdrawal.customer_phone) {
        const contactPhoneField = document.getElementById('withdrawCustomerPhone');
        if (contactPhoneField && !contactPhoneField.value) contactPhoneField.value = latestWithdrawal.customer_phone;
      }
      if (latestWithdrawal.customer_email) {
        const contactEmailField = document.getElementById('withdrawCustomerEmail');
        if (contactEmailField && !contactEmailField.value) contactEmailField.value = latestWithdrawal.customer_email;
      }
      if (latestWithdrawal.account_number) {
        const accountField = document.getElementById('withdrawAccount');
        if (accountField && !accountField.value) accountField.value = latestWithdrawal.account_number;
      }
      if (latestWithdrawal.bank_name) {
        const bankField = document.getElementById('withdrawBank');
        if (bankField && !bankField.value) bankField.value = latestWithdrawal.bank_name;
      }
    } catch (err) {
    }
  }

  function confirmWithdraw() {
    const submitBtn = document.getElementById('withdrawSubmitBtn');
    if (submitBtn) submitBtn.textContent = 'Xác nhận rút tiền';

    const customerName = document.getElementById('withdrawCustomerName')?.value.trim() || '';
    const customerPhone = document.getElementById('withdrawCustomerPhone')?.value.trim() || '';
    const customerEmail = document.getElementById('withdrawCustomerEmail')?.value.trim() || '';
    const accountNumber = document.getElementById('withdrawAccount')?.value.trim() || '';
    const bankName = document.getElementById('withdrawBank')?.value.trim() || '';
    const accountHolder = document.getElementById('withdrawName')?.value.trim() || '';
    const withdrawAmount = document.getElementById('withdrawAmount');
    
    // ✅ Type conversion: ensure amount is a number
    const amount = withdrawAmount ? parseMoneyInputValue(withdrawAmount.value) : 0;

    clearFieldErrors(['withdrawCustomerName', 'withdrawCustomerPhone', 'withdrawCustomerEmail', 'withdrawBank', 'withdrawAccount', 'withdrawName', 'withdrawAmount']);

    let hasError = false;

    if (!customerName) {
      setFieldError('withdrawCustomerName', 'Vui lòng nhập họ và tên liên hệ.');
      hasError = true;
    }

    if (!customerPhone) {
      setFieldError('withdrawCustomerPhone', 'Vui lòng nhập số điện thoại liên hệ.');
      hasError = true;
    } else if (!/^\d{10,11}$/.test(customerPhone)) {
      setFieldError('withdrawCustomerPhone', 'Số điện thoại phải gồm 10-11 chữ số.');
      hasError = true;
    }

    if (!customerEmail) {
      setFieldError('withdrawCustomerEmail', 'Vui lòng nhập email liên hệ.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setFieldError('withdrawCustomerEmail', 'Email liên hệ không hợp lệ.');
      hasError = true;
    }

    if (!bankName) {
      setFieldError('withdrawBank', 'Vui lòng chọn ngân hàng nhận tiền.');
      hasError = true;
    }

    if (!accountNumber) {
      setFieldError('withdrawAccount', 'Vui lòng nhập số tài khoản.');
      hasError = true;
    }

    if (!accountHolder) {
      setFieldError('withdrawName', 'Vui lòng nhập tên chủ tài khoản.');
      hasError = true;
    }

    if (!amount || isNaN(amount)) {
      setFieldError('withdrawAmount', 'Vui lòng nhập số tiền rút.');
      hasError = true;
    } else if (amount < 10000) {
      setFieldError('withdrawAmount', 'Số tiền tối thiểu là 10.000 VND.');
      hasError = true;
    }

    if (hasError) {
      showToast('❌ Vui lòng kiểm tra lại thông tin rút tiền', '❌');
      return;
    }

    // ✅ Get current balance and ensure it's a number
    const currentBalance = parseFloat(state.balance) || 0;
    
    if (amount > currentBalance) {
      setFieldError('withdrawAmount', `Số dư không đủ. Hiện tại: ${currentBalance.toLocaleString('vi-VN')} đ`);
      showToast('❌ Số dư không đủ. Số dư hiện tại: ' + currentBalance.toLocaleString('vi-VN') + ' đ', '❌');
      return;
    }

    submitWithdraw({
      customerName,
      customerPhone,
      customerEmail,
      accountNumber,
      bankName,
      accountHolder,
      amount
    });
  }

  async function submitWithdraw(formData) {
    setButtonLoading('withdrawSubmitBtn', true, 'Đang gửi yêu cầu...');
    const withdrawLoadingMinDuration = getDefaultLoadingDurationMs();
    const withdrawLoadingStartedAt = Date.now();
    const withdrawLoadingToken = startLoadingSequence('Đang gửi yêu cầu rút tiền', [
      'Đang gửi thông tin rút tiền...',
      'Đang kiểm tra tài khoản ngân hàng nhận tiền...',
      'Hệ thống đang ghi nhận yêu cầu chờ duyệt...',
      'Sắp hoàn tất, đang chuyển đến trang cảm ơn...'
    ], Math.max(500, Math.floor(withdrawLoadingMinDuration / 4)));
    try {
      // Validate session code
      if (!state.sessionCode || state.sessionCode.trim() === '') {
        await waitForDefaultLoading(withdrawLoadingStartedAt, withdrawLoadingMinDuration);
        stopLoadingSequence(withdrawLoadingToken);
        showToast('❌ Lỗi: Không có mã phiên. Vui lòng tham gia phiên trước.', '❌');
        return;
      }
      
      // Validate form data
      if (!formData.customerName || !formData.customerPhone || !formData.customerEmail || !formData.accountNumber || !formData.bankName || !formData.accountHolder) {
        await waitForDefaultLoading(withdrawLoadingStartedAt, withdrawLoadingMinDuration);
        stopLoadingSequence(withdrawLoadingToken);
        showToast('❌ Vui lòng điền đầy đủ thông tin liên hệ và ngân hàng', '❌');
        return;
      }
      
      const url = `/api/lucky-mystery-box/${state.sessionCode}/withdraw`;
      const method = 'POST';
      const body = {
        ...formData,
        boxNumber: state.currentPrize?.boxNumber || (typeof lmbManager !== 'undefined' ? lmbManager.getCurrentBoxNumber() : null)
      };
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      
      if (!result.success) {
        await waitForDefaultLoading(withdrawLoadingStartedAt, withdrawLoadingMinDuration);
        stopLoadingSequence(withdrawLoadingToken);
        const errorMsg = resolveRequestError(response, result, 'Yêu cầu thất bại. Vui lòng thử lại.');
        showToast('❌ ' + errorMsg, '❌');
        return;
      }

      updateLoadingOverlayMessage('Yêu cầu rút tiền đã gửi thành công. Đang chuyển trang...');
      await waitForDefaultLoading(withdrawLoadingStartedAt, withdrawLoadingMinDuration);
      stopLoadingSequence(withdrawLoadingToken);
      
      const withdrawModal = document.getElementById('withdrawModal');
      const withdrawAccount = document.getElementById('withdrawAccount');
      const withdrawBank = document.getElementById('withdrawBank');
      const withdrawName = document.getElementById('withdrawName');
      
      if (withdrawModal) {
        withdrawModal.classList.remove('active');
      }
      const withdrawCustomerName = document.getElementById('withdrawCustomerName');
      const withdrawCustomerPhone = document.getElementById('withdrawCustomerPhone');
      const withdrawCustomerEmail = document.getElementById('withdrawCustomerEmail');
      if (withdrawAccount) withdrawAccount.value = '';
      if (withdrawBank) withdrawBank.value = '';
      if (withdrawName) withdrawName.value = '';
      if (withdrawCustomerName) withdrawCustomerName.value = '';
      if (withdrawCustomerPhone) withdrawCustomerPhone.value = '';
      if (withdrawCustomerEmail) withdrawCustomerEmail.value = '';
      
      // Clear withdrawal tracking state
      state.existingWithdrawalId = null;
      state.isUpdatingWithdrawal = false;
      
      const successMsg = '✅ Yêu cầu rút tiền đã được gửi!';

      state.playerName = formData.customerName;
      state.playerPhone = formData.customerPhone;
      state.playerEmail = formData.customerEmail;
      localStorage.setItem('lmbPlayerName', formData.customerName);
      localStorage.setItem('lmbPlayerPhone', formData.customerPhone);
      localStorage.setItem('lmbPlayerEmail', formData.customerEmail);
      saveSessionProfile('withdrawProfile', {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountHolder: formData.accountHolder,
        amount: formData.amount || ''
      });
      
      showToast(successMsg, '✅');

      if (typeof lmbManager !== 'undefined') {
        lmbManager.confirmCurrentBox();
      }
      
      // Refresh wallet stats after withdrawal (source of truth from server)
      setTimeout(() => {
        loadWallet({ showLoader: false });
      }, 500);
      
      // Show thank you page with withdrawal details
      showThankYouPage({
        method: 'Rút tiền qua ngân hàng',
        bank: formData.bankName,
        account: formData.accountNumber,
        withdrawalCode: result.data?.id || result.data?.code || 'N/A',
        accountHolder: formData.accountHolder
      });
    } catch (err) {
      await waitForDefaultLoading(withdrawLoadingStartedAt, withdrawLoadingMinDuration);
      stopLoadingSequence(withdrawLoadingToken);
      showToast('❌ Lỗi từ server. Vui lòng thử lại sau.', '❌');
    } finally {
      setButtonLoading('withdrawSubmitBtn', false);
    }
  }

  // ===== CONFETTI =====
  function spawnConfetti() {
    const container = document.getElementById('confettiContainer');
    container.innerHTML = '';
    const colors = ['#a855f7', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#fff'];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute;
        left:${Math.random() * 100}%;
        top:-20px;
        width:${6 + Math.random() * 8}px;
        height:${6 + Math.random() * 8}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation:confettiFall ${1.5 + Math.random() * 2}s ${Math.random() * 1}s forwards;
      `;
      container.appendChild(el);
    }
    setTimeout(() => {
      container.innerHTML = '';
    }, 4000);
  }

  // ===== LOADING OVERLAY =====
  let loadingSequenceTimer = null;
  let loadingSequenceToken = 0;
  let loadingOverlaySpinnerAnim = null;
  let loadingOverlayHideTimer = null;

  function ensureLoadingOverlaySpinnerAnimation() {
    const spinner = document.getElementById('loadingOverlaySpinner');
    if (!spinner) return;

    if (!document.getElementById('loadingOverlaySpinStyle')) {
      const style = document.createElement('style');
      style.id = 'loadingOverlaySpinStyle';
      style.textContent = '@keyframes loadingOverlaySpin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    spinner.style.animation = 'loadingOverlaySpin 1s linear infinite';

    if (spinner.animate) {
      if (!loadingOverlaySpinnerAnim || loadingOverlaySpinnerAnim.playState === 'finished') {
        loadingOverlaySpinnerAnim = spinner.animate(
          [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
          { duration: 1000, iterations: Infinity, easing: 'linear' }
        );
      } else if (loadingOverlaySpinnerAnim.playState === 'paused') {
        loadingOverlaySpinnerAnim.play();
      }
    }
  }

  function showLoadingOverlay(message, title) {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loadingOverlay';
    }

    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.flexDirection = 'column';
    overlay.style.gap = '20px';
    overlay.style.zIndex = '2147483647';
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'auto';
    overlay.style.transition = 'opacity .24s ease';

    if (overlay.parentElement !== document.body) {
      document.body.appendChild(overlay);
    } else {
      // Move to the end of body so it stays above dynamically created nodes.
      document.body.appendChild(overlay);
    }
    
    overlay.innerHTML = `
      <div id="loadingOverlayPanel" style="
        background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        padding: 28px;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        max-width: 420px;
        width: calc(100% - 32px);
        transform: translateY(10px) scale(.985);
        opacity: .92;
        transition: transform .24s ease, opacity .24s ease;
      ">
        <div style="font-size: 36px; margin-bottom: 12px;">⏳</div>
        <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 8px;">
          ${title || 'Đang xử lý yêu cầu'}
        </div>
        <div id="loadingOverlayMessage" style="font-size: 15px; font-weight: 600; color: #334155; white-space: pre-line; line-height: 1.5; min-height: 44px;">
          ${message || 'Đang xử lý...'}
        </div>
        <div style="margin-top: 20px;">
          <div id="loadingOverlaySpinner" style="
            width: 40px;
            height: 40px;
            border: 4px solid #f0f0f0;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            margin: 0 auto;
          "></div>
        </div>
      </div>
    `;
    overlay.style.display = 'flex';
    if (loadingOverlayHideTimer) {
      clearTimeout(loadingOverlayHideTimer);
      loadingOverlayHideTimer = null;
    }
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      const panel = document.getElementById('loadingOverlayPanel');
      if (panel) {
        panel.style.transform = 'translateY(0) scale(1)';
        panel.style.opacity = '1';
      }
    });
    ensureLoadingOverlaySpinnerAnimation();
  }

  function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      const panel = document.getElementById('loadingOverlayPanel');
      overlay.style.opacity = '0';
      if (panel) {
        panel.style.transform = 'translateY(10px) scale(.985)';
        panel.style.opacity = '.92';
      }
      loadingOverlayHideTimer = setTimeout(() => {
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
      }, 240);
      overlay.style.pointerEvents = 'none';
      if (loadingOverlaySpinnerAnim && loadingOverlaySpinnerAnim.playState === 'running') {
        loadingOverlaySpinnerAnim.pause();
      }
    }
  }

  function updateLoadingOverlayMessage(message) {
    const messageEl = document.getElementById('loadingOverlayMessage');
    if (messageEl) {
      messageEl.textContent = message || 'Đang xử lý...';
    }
  }

  function startLoadingSequence(title, messages, intervalMs) {
    const safeMessages = Array.isArray(messages) && messages.length > 0
      ? messages
      : ['Đang xử lý...'];

    if (loadingSequenceTimer) {
      clearInterval(loadingSequenceTimer);
      loadingSequenceTimer = null;
    }

    loadingSequenceToken += 1;
    const token = loadingSequenceToken;
    let index = 0;
    showLoadingOverlay(safeMessages[index], title);

    if (safeMessages.length > 1) {
      loadingSequenceTimer = setInterval(() => {
        if (token !== loadingSequenceToken) {
          clearInterval(loadingSequenceTimer);
          loadingSequenceTimer = null;
          return;
        }

        if (index < safeMessages.length - 1) {
          index += 1;
          updateLoadingOverlayMessage(safeMessages[index]);
        } else {
          clearInterval(loadingSequenceTimer);
          loadingSequenceTimer = null;
        }
      }, Number(intervalMs) > 0 ? Number(intervalMs) : 900);
    }

    return token;
  }

  function stopLoadingSequence(token) {
    if (token && token !== loadingSequenceToken) {
      return;
    }

    if (loadingSequenceTimer) {
      clearInterval(loadingSequenceTimer);
      loadingSequenceTimer = null;
    }
    hideLoadingOverlay();
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getDefaultLoadingDurationMs() {
    return 2000 + Math.floor(Math.random() * 1001);
  }

  async function waitForDefaultLoading(startedAt, minDurationMs) {
    const elapsed = Date.now() - (startedAt || Date.now());
    const waitMs = Number(minDurationMs) - elapsed;
    if (waitMs > 0) {
      await delay(waitMs);
    }
  }

  function setButtonLoading(buttonId, isLoading, loadingText) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    if (!btn.dataset.defaultText) {
      btn.dataset.defaultText = btn.innerHTML;
    }

    btn.disabled = !!isLoading;
    btn.innerHTML = isLoading
      ? `⏳ ${loadingText || 'Đang xử lý...'}`
      : btn.dataset.defaultText;
  }

  function resolveRequestError(response, result, fallbackMessage) {
    if (response && response.status >= 500) {
      return 'Lỗi từ server. Vui lòng thử lại sau.';
    }
    return (result && result.message) || fallbackMessage;
  }

  // ===== TOAST =====
  function showToast(text, emoji) {
    const toast = document.getElementById('toast');
    document.getElementById('toastText').textContent = text;
    document.getElementById('toastAvatar').textContent = emoji || '🎁';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }



  // ===== WIN NOTIFICATIONS =====
  function showWinNoti() {
    const container = document.getElementById('winNotiContainer');
    const name = pickRandom(vietNames);
    const prize = pickRandom(notifPrizes);
    const time = pickRandom(timeAgo);

    const el = document.createElement('div');
    el.className = 'win-noti';
    el.innerHTML = `
      <div class="win-noti-avatar">${prize.emoji}</div>
      <div class="win-noti-body">
        <div class="win-noti-name">🎉 ${name}</div>
        <div class="win-noti-prize" style="color:${prize.color}">đã trúng ${prize.name}</div>
        <div class="win-noti-time">⏱ ${time}</div>
      </div>
      <div class="win-noti-badge">TRÚNG</div>
    `;

    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));

    setTimeout(() => {
      el.classList.add('hide');
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 400);
    }, 4500);

    // Keep max 3 visible
    const all = container.querySelectorAll('.win-noti');
    if (all.length > 3) {
      const oldest = all[0];
      oldest.classList.add('hide');
      setTimeout(() => {
        if (oldest.parentNode) oldest.parentNode.removeChild(oldest);
      }, 400);
    }
  }

  function scheduleNoti() {
    const delay = 3000 + Math.random() * 4000;
    setTimeout(() => {
      showWinNoti();
      scheduleNoti();
    }, delay);
  }

  // ===== PERSONAL INFO FORM =====
  function validatePersonalForm() {
    return {
      isValid: true,
      name: state.playerName || localStorage.getItem('lmbPlayerName') || '',
      phone: state.playerPhone || localStorage.getItem('lmbPlayerPhone') || '',
      email: state.playerEmail || localStorage.getItem('lmbPlayerEmail') || ''
    };
  }

  async function goToBoxSelection() {
    if (!state.sessionCode) {
      let latestSessionCode = '';

      if (typeof lmbManager !== 'undefined') {
        latestSessionCode = (lmbManager.restoreSession() || '').trim().toUpperCase();
      }

      if (!latestSessionCode) {
        latestSessionCode = (localStorage.getItem('lmbSessionCode') || '').trim().toUpperCase();
      }

      if (latestSessionCode) {
        state.sessionCode = latestSessionCode;
        state.sessionStartTime = parseInt(localStorage.getItem('lmbSessionStart')) || Date.now();
        state.isSessionValid = true;
      }
    }

    if (!state.sessionCode) {
      showToast('ℹ️ Bạn chưa chơi phiên nào! Hãy nhập mã phiên mà chúng tôi cung cấp vào ô nhập ở trang chủ để chơi nhé!', 'ℹ️');
      showPage('home');
      return;
    }

    try {
      const verifyResponse = await fetch(`/api/lucky-mystery-box/session?code=${encodeURIComponent(state.sessionCode)}`);
      const verifyResult = await verifyResponse.json();

      if (!verifyResult.success || !verifyResult.data) {
        clearSessionCode();
        showToast('ℹ️ Bạn chưa chơi phiên nào! Hãy nhập mã phiên mà chúng tôi cung cấp vào ô nhập ở trang chủ để chơi nhé!', 'ℹ️');
        showPage('home');
        return;
      }

      state.hasOpened = verifyResult.data.player_selected_box !== null;
      state.isSessionValid = true;

      if (typeof lmbManager !== 'undefined') {
        const order = Array.isArray(verifyResult?.data?.box_positions)
          ? verifyResult.data.box_positions
          : [1, 2, 3];
        lmbManager.setOpenOrder(order);
      }
    } catch (err) {
      showToast('❌ Không thể tải phiên gần nhất. Vui lòng thử lại.', '❌');
      return;
    }

    // If session already has opened box, skip validation
    if (state.hasOpened) {
      // Load personal info from localStorage if exists
      const savedName = localStorage.getItem('lmbPlayerName');
      const savedPhone = localStorage.getItem('lmbPlayerPhone');
      const savedEmail = localStorage.getItem('lmbPlayerEmail');
      
      if (savedName) state.playerName = savedName;
      if (savedPhone) state.playerPhone = savedPhone;
      if (savedEmail) state.playerEmail = savedEmail;
      
      const loaded = await preloadBoxes();
      if (!loaded) {
        showToast('❌ Không tải được dữ liệu hộp. Vui lòng thử lại.', '❌');
        return;
      }
      await syncLocalProgressFromServer();
      showPage('choose');
      setTimeout(() => {
        loadOpenedPrizes();
        loadExchangeOptions();
      }, 80);
      showToast('✅ Đã quay lại phiên chơi gần nhất', '✅');
      return;
    }
    
    const cachedInfo = validatePersonalForm();
    state.playerName = cachedInfo.name;
    state.playerPhone = cachedInfo.phone;
    state.playerEmail = cachedInfo.email;
    
    const loaded = await preloadBoxes();
    if (!loaded) {
      showToast('❌ Không tải được dữ liệu hộp. Vui lòng thử lại.', '❌');
      return;
    }
    await syncLocalProgressFromServer();
    showPage('choose');
    setTimeout(() => {
      loadOpenedPrizes();
      loadExchangeOptions();
    }, 80);
    showToast('✅ Mời bạn chọn hộp quà', '✅');
  }

  // ===== THANK YOU PAGE =====
  function showThankYouPage(result) {
    const isCashRequest = !!(result && result.method && /rút tiền|chuyển khoản|đổi tiền/i.test(result.method));
    const thankYouHeading = document.getElementById('thankYouHeading');
    const processingMessage = document.getElementById('processingMessage');

    if (thankYouHeading) {
      thankYouHeading.textContent = isCashRequest
        ? 'Yêu cầu rút tiền đã được ghi nhận!'
        : 'Hàng sẽ sớm được giao đến bạn!';
    }

    if (processingMessage) {
      processingMessage.innerHTML = isCashRequest
        ? '<strong>Vui lòng nhắn cho nhân viên hỗ trợ để cập nhật thông tin.</strong><br>Sau đó hệ thống sẽ giải ngân.'
        : '<strong>Hàng sẽ sớm được giao đến bạn!!</strong>.<br>Vui lòng nhắn cho nhân viên hỗ trợ để cập nhật đơn hàng!';
    }

    // Fill in confirmation details
    const confirmId = (result && result.confirmationCode)
      ? String(result.confirmationCode).replace(/^#/, '')
      : ('LMB' + Date.now().toString().slice(-6));
    document.getElementById('confirmationIdDisplay').textContent = '#' + confirmId;
    
    // Prize and value
    document.getElementById('summaryPrizeDisplay').textContent = state.currentPrize?.name || 'N/A';
    document.getElementById('summaryValueDisplay').textContent = 
      Math.floor(state.currentPrize?.value || 0).toLocaleString('vi-VN') + ' đ';
    
    // Personal info
    document.getElementById('summaryNameDisplay').textContent = state.playerName || 'N/A';
    document.getElementById('summaryPhoneDisplay').textContent = result.playerPhone || state.playerPhone || 'N/A';
    if (state.playerEmail) {
      document.getElementById('summaryEmailSection').style.display = 'flex';
      document.getElementById('summaryEmailDisplay').textContent = state.playerEmail;
    }
    
    // Exchange method info (if provided)
    if (result && result.method) {
      if (result.method === 'Rút tiền qua ngân hàng') {
        const prizeSection = document.getElementById('summaryPrizeSection');
        if (prizeSection) prizeSection.style.display = 'none';
      } else {
        const prizeSection = document.getElementById('summaryPrizeSection');
        if (prizeSection) prizeSection.style.display = '';
      }

      document.getElementById('exchangeMethodSection').style.display = 'flex';
      document.getElementById('summaryMethodDisplay').textContent = result.method;
      
      if (result.method === 'Chuyển khoản' && result.bank) {
        document.getElementById('summaryBankSection').style.display = 'flex';
        document.getElementById('summaryBankDisplay').textContent = result.bank;
        
        if (result.account) {
          document.getElementById('summaryAccountSection').style.display = 'flex';
          document.getElementById('summaryAccountDisplay').textContent = 
            '****' + result.account.slice(-4);
        }
      }
      
      if (result.method === 'Giao hàng' && result.address) {
        document.getElementById('summaryAddressSection').style.display = 'flex';
        document.getElementById('summaryAddressDisplay').textContent = result.address || result.playerAddress || state.playerAddress || 'N/A';
      }
      
      // Withdrawal method info
      if (result.method === 'Rút tiền qua ngân hàng') {
        if (result.bank) {
          document.getElementById('summaryBankSection').style.display = 'flex';
          document.getElementById('summaryBankDisplay').textContent = '🏦 ' + result.bank;
        }
        
        if (result.account) {
          document.getElementById('summaryAccountSection').style.display = 'flex';
          document.getElementById('summaryAccountDisplay').textContent = 
            'Tài khoản: ****' + result.account.slice(-4);
        }
        
        if (result.withdrawalCode) {
          const withdrawalSection = document.getElementById('summaryBankSection');
          if (withdrawalSection) {
            const codeElement = document.createElement('div');
            codeElement.style.cssText = 'margin-top: 10px; font-size: 12px; color: #666;';
            codeElement.innerHTML = `<strong>Mã yêu cầu rút tiền:</strong> ${result.withdrawalCode}`;
            withdrawalSection.appendChild(codeElement);
          }
        }
        
        if (result.accountHolder) {
        }
      }
    }
    
    showPage('thankyou');
  }

  function backToHome() {
    clearSessionCode();
    state.playerName = '';
    state.playerPhone = '';
    state.playerEmail = '';
    state.currentPrize = null;
    state.hasOpened = false;
    localStorage.removeItem('lmbPlayerName');
    localStorage.removeItem('lmbPlayerPhone');
    localStorage.removeItem('lmbPlayerEmail');
    showGlobalPageLoader('Đang quay về trang chủ...');
    window.location.href = '/';
  }

  function shareResult() {
    const prize = state.currentPrize?.name || 'phần thưởng';
    const confirmId = document.getElementById('confirmationIdDisplay').textContent;
    const text = `Tôi vừa mở được ${prize}! 🎁 Mã xác nhận: ${confirmId} Lucky Mystery Box`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Lucky Mystery Box',
        text: text
      }).catch(err => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        showToast('✅ Đã sao chép vào clipboard', '✅');
      });
    }
  }

  // ===== LOAD OPENED PRIZES (Display under boxes) =====
  async function loadOpenedPrizes() {
    if (!state.sessionCode) {
      return;
    }

    try {
      console.log('[loadOpenedPrizes] session', state.sessionCode);
      const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/player-inventory`);
      console.log('[loadOpenedPrizes] response status', response.status);
      const result = await response.json();

      console.log('[loadOpenedPrizes] payload', result);

      if (!result.success) {
        return;
      }

      const openedPrizesContainer = document.getElementById('openedPrizesContainer');
      if (!openedPrizesContainer) {
        return;
      }

      const items = result.data.items || [];
      state.openedPrizeItems = items;

      if (typeof lmbManager !== 'undefined') {
        lmbManager.syncOpenedBoxes(items);
      }

      console.log('[loadOpenedPrizes] items count', items.length);

      if (items.length === 0) {
        openedPrizesContainer.style.display = 'none';
        return;
      }

      if (openedPrizesContainer.dataset.source !== 'exchange') {
        // Show container and populate with opened prizes
        openedPrizesContainer.style.display = 'block';
        
        const prizeHTML = items.map((item, idx) => {
          const statusText = item.status === 'claimed'
            ? '✅ Đã nhận quà'
            : item.status === 'converted'
              ? '💰 Đã nhận tiền'
              : item.status === 'exchanged'
                ? '⏳ Chờ duyệt quy đổi tiền'
                : '';
          return `
          <div class="opened-prize-item" onclick="openPrizeDetailModalByIndex(${idx}, 'opened')">
            <div class="opened-prize-icon">${item.prize_icon || '🎁'}</div>
            <div class="opened-prize-name">${item.prize_name}</div>
            <div class="opened-prize-detail">Hộp #${item.box_number}</div>
            ${item.is_cash ? `<div class="opened-prize-value">${Math.floor(item.prize_value).toLocaleString('vi-VN')} đ</div>` : ''}
            ${statusText ? `<div class="opened-prize-status">${statusText}</div>` : ''}
            <div class="opened-prize-rarity rarity-${item.rarity}">${item.rarity}</div>
          </div>
        `;
        }).join('');

        openedPrizesContainer.innerHTML = `
          <div class="opened-prizes-title">🏆 Phần Quà Đã Mở</div>
          <div class="opened-prizes-grid">${prizeHTML}</div>
        `;

        console.log('[loadOpenedPrizes] rendered');
      }
    } catch (err) {
      console.error('[loadOpenedPrizes] error', err);
    }
  }

  // ===== EXCHANGE OPTIONS =====
  async function loadExchangeOptions() {
    if (!state.sessionCode) return;

    try {
      const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/player-inventory`);
      
      // ✅ NEW: Check response status - allow 200, 304 (Not Modified), and other success codes
      if (response.status === 304) {
        // Display what we have from state or cache
        if (state.currentPrize) {
          return; // Already displayed
        }
        return;
      }
      
      if (!response.ok) {
        const exchangeContainer = document.getElementById('exchangeContainer');
        if (exchangeContainer) {
          exchangeContainer.innerHTML = `
            <div class="empty-state">
              <span class="empty-state-icon">❌</span>
              <div class="empty-state-title">Lỗi tải phần quà</div>
              <div class="empty-state-desc">Hãy thử tải lại trang (F5)</div>
            </div>`;
        }
        return;
      }
      
      const result = await response.json();

      const exchangeContainer = document.getElementById('exchangeContainer');
      if (!exchangeContainer) return;

      if (!result.success || !result.data || result.data.total === 0) {
        exchangeContainer.innerHTML = `
          <div class="empty-state">
            <span class="empty-state-icon">📦</span>
            <div class="empty-state-title">Chưa có quà để đổi</div>
            <div class="empty-state-desc">Hãy mở hộp quà trước để nhận phần thưởng!</div>
          </div>`;
        return;
      }

      const items = result.data.items || [];
      state.exchangeItems = items;
      state.openedPrizeItems = items;
      
      const availableItems = items.filter(item => item.status === 'obtained');
      if (availableItems.length === 0) {
        exchangeContainer.innerHTML = `
          <div class="empty-state">
            <span class="empty-state-icon">📦</span>
            <div class="empty-state-title">Chưa có quà để đổi</div>
            <div class="empty-state-desc">Các quà của bạn đang chờ xử lý hoặc đã được xác nhận!</div>
          </div>`;
        return;
      }

      const exchangeHTML = items.map((item, idx) => {
        const isUnlucky = isUnluckyPrize(item);
        const itemValue = Number(item.prize_value) || 0;
        const itemCashEnabled = item.is_cash === true || item.is_cash === 1 || String(item.is_cash).toLowerCase() === 'true';
        const canConvert = !isUnlucky && itemCashEnabled && itemValue > 0;
        const isDone = item.status !== 'obtained';
        const statusLabel = isUnlucky
          ? '😢 Chúc bạn may mắn lần sau'
          : item.status === 'claimed'
            ? '✅ Đã nhận quà'
            : item.status === 'converted'
              ? '💰 Đã nhận tiền'
              : item.status === 'exchanged'
                ? '⏳ Chờ duyệt quy đổi tiền'
                : '';
        const valueText = isUnlucky
          ? 'Chúc bạn may mắn lần sau'
          : canConvert
            ? (Math.floor(itemValue).toLocaleString('vi-VN') + ' đ')
            : 'Quà quý';
        const showActions = !isDone && !isUnlucky;
        
        return `
          <div class="exchange-item ${isDone || isUnlucky ? 'exchange-converted' : ''}" onclick="openPrizeDetailModalByIndex(${idx}, 'exchange')">
            <div class="exchange-prize-icon">${item.prize_icon || (isUnlucky ? '😢' : '🎁')}</div>
            <div class="exchange-prize-name">${item.prize_name || 'Phần quà'}</div>
            <div class="exchange-prize-detail">Hộp #${item.box_number}</div>
            <div class="exchange-prize-value" style="${item.color_hex ? `color: ${item.color_hex};` : ''}">
              ${valueText}
            </div>
            <div class="exchange-actions">
              ${showActions
                ? (canConvert
                  ? `<button class="btn-exchange-claim" onclick="event.stopPropagation();quickClaimPrize(${idx})">🎁 Nhận quà</button><button class="btn-exchange-convert" onclick="event.stopPropagation();quickConvertPrize(${idx})">💰 Đổi tiền</button>`
                  : `<button class="btn-exchange-claim" onclick="event.stopPropagation();quickClaimPrize(${idx})">🎁 Nhận quà</button>`)
                : `<span class="exchange-status-badge">${statusLabel}</span>`}
            </div>
          </div>
        `;
      }).join('');

      const exchangeSection = `
        <div class="exchange-header">
          💎 Phần Quà Đã Mở
        </div>
        <div class="exchange-items">
          ${exchangeHTML}
        </div>
      `;

      exchangeContainer.innerHTML = exchangeSection;

      // Also add to choose page if element exists
      const choosePageExchange = document.getElementById('openedPrizesContainer');
      if (choosePageExchange) {
        choosePageExchange.innerHTML = exchangeSection;
        choosePageExchange.style.display = 'block';
        choosePageExchange.dataset.source = 'exchange';
      }
    } catch (err) {
      showToast('❌ Lỗi tải phần quà: ' + err.message, '❌');
    }
  }

  // Quick convert function
  async function quickConvertPrize(index) {
    if (!state.sessionCode) return;
    const item = (state.exchangeItems || [])[index];
    if (!item) return;

    const itemValue = Number(item.prize_value) || 0;
    const itemCashEnabled = item.is_cash === true || item.is_cash === 1 || String(item.is_cash).toLowerCase() === 'true';
    if (!itemCashEnabled || itemValue <= 0) {
      showToast('⚠️ Phần thưởng này không hỗ trợ quy đổi tiền mặt', '⚠️');
      return;
    }
    
    const quickConvertLoadingMinDuration = getDefaultLoadingDurationMs();
    const quickConvertLoadingStartedAt = Date.now();
    const quickConvertLoadingToken = startLoadingSequence('Đang gửi yêu cầu quy đổi tiền', [
      'Đang gửi thông tin quy đổi... ',
      'Đang xác thực phiên chơi... ',
      'Hệ thống đang ghi nhận yêu cầu chờ duyệt...'
    ], Math.max(450, Math.floor(quickConvertLoadingMinDuration / 3)));

    try {
      const response = await fetch(`/api/lucky-mystery-box/${state.sessionCode}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boxNumber: item.box_number })
      });
      const result = await response.json();
      
      if (result.success) {
        await waitForDefaultLoading(quickConvertLoadingStartedAt, quickConvertLoadingMinDuration);
        stopLoadingSequence(quickConvertLoadingToken);
        showToast('⏳ Đã gửi yêu cầu quy đổi ' + Math.floor(result.cashAmount || 0).toLocaleString('vi-VN') + ' đ, đang chờ duyệt.', '⏳');
        setTimeout(() => loadExchangeOptions(), 500); // Reload
        setTimeout(() => loadWallet({ showLoader: false }), 500);
      } else {
        await waitForDefaultLoading(quickConvertLoadingStartedAt, quickConvertLoadingMinDuration);
        stopLoadingSequence(quickConvertLoadingToken);
        showToast('❌ ' + (result.message || 'Lỗi quy đổi'), '❌');
      }
    } catch (err) {
      await waitForDefaultLoading(quickConvertLoadingStartedAt, quickConvertLoadingMinDuration);
      stopLoadingSequence(quickConvertLoadingToken);
      showToast('❌ Lỗi: ' + err.message, '❌');
    }
  }

  // Quick claim function
  async function quickClaimPrize(index) {
    const item = (state.exchangeItems || [])[index];
    if (!item) return;
    openClaimModal({
      name: item.prize_name || 'Quà',
      description: item.prize_description || 'Phần quà từ hộp quà bí mật',
      icon: item.prize_icon || '🎁',
      boxNumber: item.box_number
    });
  }

  function openPrizeDetailModalByIndex(index, source) {
    const sourceItems = source === 'exchange' ? (state.exchangeItems || []) : (state.openedPrizeItems || []);
    const item = sourceItems[index];
    if (!item) return;
    openPrizeDetailModal(item);
  }

  function openPrizeDetailModal(item) {
    const modal = ensurePrizeDetailModal();
    if (!modal) return;

    const body = modal.querySelector('#prizeDetailModalBody');
    if (!body) return;

    const safeName = item.prize_name || 'Phần quà';
    const safeDesc = item.prize_description || 'Chưa có mô tả cho phần quà này.';
    const safeIcon = item.prize_icon || '🎁';
    const safeImage = item.prize_image || '';
    const safeBox = item.box_number || '-';
    const safeStatus = item.status || 'obtained';
    const safeValue = Number(item.prize_value) || 0;
    const statusText = safeStatus === 'claimed'
      ? 'Đã đổi quà'
      : safeStatus === 'converted'
        ? 'Đã quy đổi tiền'
        : safeStatus === 'exchanged'
          ? 'Chờ duyệt quy đổi tiền'
          : 'Đang chờ xử lý';

    body.innerHTML = `
      <div class="prize-detail-media">
        ${safeImage ? `<img src="${safeImage}" alt="${safeName}" class="prize-detail-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
        <div class="prize-detail-fallback" style="display:${safeImage ? 'none' : 'flex'}">${safeIcon}</div>
      </div>
      <div class="prize-detail-name">${safeName}</div>
      <div class="prize-detail-desc">${safeDesc}</div>
      <div class="prize-detail-grid">
        <div class="prize-detail-item"><span>Hộp mở</span><strong>#${safeBox}</strong></div>
        <div class="prize-detail-item"><span>Giá trị</span><strong>${safeValue > 0 ? formatMoneyComma(safeValue) + ' đ' : 'Không định giá'}</strong></div>
        <div class="prize-detail-item"><span>Trạng thái</span><strong>${statusText}</strong></div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePrizeDetailModal() {
    const modal = document.getElementById('prizeDetailModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function ensurePrizeDetailModal() {
    let modal = document.getElementById('prizeDetailModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'prizeDetailModal';
    modal.className = 'modal-overlay prize-detail-modal-overlay';
    modal.innerHTML = `
      <div class="modal-card prize-detail-modal-card" role="dialog" aria-modal="true" aria-label="Chi tiết phần quà">
        <div class="modal-header">
          <span class="modal-title">Chi tiết phần quà</span>
          <button class="modal-close" type="button" onclick="closePrizeDetailModal()">✕</button>
        </div>
        <div id="prizeDetailModalBody" class="prize-detail-modal-body"></div>
      </div>
    `;

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closePrizeDetailModal();
      }
    });

    if (!window.__prizeDetailEscBound) {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closePrizeDetailModal();
        }
      });
      window.__prizeDetailEscBound = true;
    }

    document.body.appendChild(modal);
    return modal;
  }

  async function loadAndApplySettings() {
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();
      const settings = result.data || result;

      if (settings.logo && settings.logo.url) {
        const logoContainer = document.getElementById('customLogoContainer');
        if (logoContainer) {
          logoContainer.innerHTML = `<img src="${settings.logo.url}" style="max-width: 300px; max-height: 200px; object-fit: contain;">`;
        }
        const faviconLink = document.getElementById('faviconLink');
        if (faviconLink) {
          faviconLink.href = settings.logo.url;
        }
      }

      if (settings.content && settings.content.customText) {
        const textContent = document.getElementById('customTextContent');
        if (textContent) {
          textContent.innerHTML = settings.content.customText.replace(/\n/g, '<br>');
        }
      }
    } catch (err) {}
  }

  // ===== INITIALIZATION =====
  document.addEventListener('DOMContentLoaded', async () => {
    let initLoaderShown = false;
    const initLoaderTimer = setTimeout(() => {
      initLoaderShown = true;
      showGlobalPageLoader('Đang chuẩn bị dữ liệu trang...');
    }, 140);

    try {
      const savedTheme = localStorage.getItem('userTheme') || 'dark';
      applyUserTheme(savedTheme);

      // ✅ Restore prize state from localStorage if page was refreshed
      restorePrizeState();

      // ✅ NEW: If session exists, preload boxes info
      if (state.sessionCode && !state.boxesInfo) {
        await preloadBoxes().catch(err => {});
      }

      await loadAndApplySettings();


      // Initialize win notifications
      setTimeout(() => {
        showWinNoti();
        scheduleNoti();
      }, 2000);

      // Keyboard shortcuts
      const sessionInput = document.getElementById('sessionCodeInput');
      if (sessionInput) {
        sessionInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') enterSession();
        });
      }

      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') searchSession();
        });
      }

      window.addEventListener('popstate', (event) => {
        const handled = handleBackNavigationInSession();
        if (handled) return;

        if (event.state && event.state.lmbManaged && event.state.lmbPage) {
          showPage(event.state.lmbPage, { fromPopState: true });
        }
      });
    } finally {
      clearTimeout(initLoaderTimer);
      if (initLoaderShown) {
        hideGlobalPageLoader(false, 260);
      }
    }
  });

  // Also run on window load for fallback
  window.addEventListener('load', () => {
    // Check if settings already loaded, if not fetch again
    const customTextEl = document.getElementById('customTextContent');
    if (customTextEl && !customTextEl.innerHTML) {
      loadAndApplySettings();
    }
  });
