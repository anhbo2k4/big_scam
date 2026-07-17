const cvs = document.getElementById('bgCanvas');
const ctx = cvs ? cvs.getContext('2d') : null;
let W = window.innerWidth;
let H = window.innerHeight;

const HOMEPAGE_THEME_STORAGE_KEY = 'lmbHomepageThemeV2';
const FORCE_INTERNAL_HOME_SCREEN = true;
const HOMEPAGE_THEME_PRESETS = [
  { value: 'new_homepage.html', label: 'Giao diện 1' },
  { value: 'background_upgraded.html', label: 'Giao diện 2' },
  { value: 'background.html', label: 'Giao diện 3' },
  { value: 'background-alt.html', label: 'Giao diện 4' },
  { value: 'background (1).html', label: 'Giao diện 5' },
  { value: 'card_v3_purple.html', label: 'Giao diện 6' },
  { value: 'card_v4_cyber.html', label: 'Giao diện 7' },
  { value: 'card_v4_cyber (1).html', label: 'Giao diện 8' },
  { value: 'card_v5_baroque.html', label: 'Giao diện 9' },
  { value: 'b10-card.html', label: 'Giao diện 10' },
  { value: 'boxes-redesign.html', label: 'Giao diện 11' },
  { value: 'gift-boxes (1).html', label: 'Giao diện 12' },
  { value: 'mo-hop-qua (1).html', label: 'Giao diện 13' }
];

const HOMEPAGE_THEME_LABEL_DEFAULTS = HOMEPAGE_THEME_PRESETS.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

let homepageThemeLabelOverrides = {};

function sanitizeHomepageThemeLabels(source) {
  const result = {};
  if (!source || typeof source !== 'object') return result;
  HOMEPAGE_THEME_PRESETS.forEach((item) => {
    const raw = source[item.value];
    if (typeof raw === 'string' && raw.trim()) {
      result[item.value] = raw.trim();
    }
  });
  return result;
}

function restartCssAnimationByClass(el, className) {
  if (!el || !className) return;
  el.classList.remove(className);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add(className);
    });
  });
}


  function loadEngagementState() {
    try {
      const raw = JSON.parse(localStorage.getItem(CHAT_GLOBAL_KEYS.engagement) || '{}');
      state.engagement = {
        ...state.engagement,
        pityCount: Math.max(0, Number(raw.pityCount || 0)),
        streak: Math.max(0, Number(raw.streak || 0)),
        points: Math.max(0, Number(raw.points || 0)),
        opens: Math.max(0, Number(raw.opens || 0)),
        lastOpenAt: Math.max(0, Number(raw.lastOpenAt || 0))
      };
    } catch (_) {}
  }

  function saveEngagementState() {
    try {
      localStorage.setItem(CHAT_GLOBAL_KEYS.engagement, JSON.stringify({
        pityCount: Number(state.engagement.pityCount || 0),
        streak: Number(state.engagement.streak || 0),
        points: Number(state.engagement.points || 0),
        opens: Number(state.engagement.opens || 0),
        lastOpenAt: Number(state.engagement.lastOpenAt || 0)
      }));
    } catch (_) {}
  }

  function updateEngagementUI() {
    const pityFill = document.getElementById('engagePityFill');
    const pityCount = document.getElementById('engagePityCount');
    const streak = document.getElementById('engageStreak');
    const points = document.getElementById('engagePoints');
    const redeemBtn = document.getElementById('engageRedeemBtn');
    const redeemHint = document.getElementById('engageRedeemHint');

    const threshold = Math.max(1, Number(state.engagement.pityThreshold || 8));
    const pity = Math.max(0, Number(state.engagement.pityCount || 0));
    const pityPct = Math.min(100, Math.round((pity / threshold) * 100));
    const pt = Math.max(0, Number(state.engagement.points || 0));
    const canRedeem = pt >= Number(state.engagement.freeBoxCost || 120);

    if (pityFill) pityFill.style.width = `${pityPct}%`;
    if (pityCount) pityCount.textContent = `${Math.min(pity, threshold)}/${threshold}`;
    if (streak) streak.textContent = `🔥 Streak x${Math.max(0, Number(state.engagement.streak || 0))}`;
    if (points) points.textContent = `⭐ ${pt.toLocaleString('vi-VN')} điểm`;
    if (redeemBtn) redeemBtn.disabled = !canRedeem;
    if (redeemHint) redeemHint.textContent = canRedeem ? 'Sẵn sàng đổi thưởng' : `Cần ${Number(state.engagement.freeBoxCost || 120)} điểm`;
  }

  function touchEngagementActivity() {
    state.engagement.idleHintShown = false;
    if (state.inactivityHintTimerId) clearTimeout(state.inactivityHintTimerId);
    state.inactivityHintTimerId = setTimeout(() => {
      if (state.engagement.idleHintShown) return;
      state.engagement.idleHintShown = true;
      showToast('💡 Bạn có thể mở hộp đang sáng để nhận thêm điểm thưởng.', { type: 'info', duration: 3000 });
    }, 45000);
  }


  function redeemFreeBox() {
    const cost = Number(state.engagement.freeBoxCost || 120);
    if (state.engagement.points < cost) {
      showToast('❌ Chưa đủ điểm để đổi hộp miễn phí.', { type: 'error', duration: 2800 });
      return;
    }

    state.engagement.points -= cost;
    const nextInactive = state.openOrder.find((n) => String(state.boxes?.[n]?.state || '') === 'inactive');
    if (nextInactive) state.boxes[nextInactive].state = 'active';
    renderBoxes();
    saveEngagementState();
    updateEngagementUI();
    showToast('🎉 Đổi hộp miễn phí thành công! Mở tiếp nào.', { type: 'success', duration: 3200 });
  }

  function setupEngagementSystem() {
    loadEngagementState();
    updateEngagementUI();
    touchEngagementActivity();
  }

function getHomepageThemeLabel(themeValue) {
  return homepageThemeLabelOverrides[themeValue]
    || HOMEPAGE_THEME_LABEL_DEFAULTS[themeValue]
    || themeValue;
}

function refreshHomepageThemeSelectOptions(keepSelectedValue) {
  const select = document.getElementById('homepageThemeSelect');
  if (!select) return;

  const selectedBefore = keepSelectedValue || select.value || '';
  select.innerHTML = HOMEPAGE_THEME_PRESETS
    .map((item) => `<option value="${item.value}">${getHomepageThemeLabel(item.value)}</option>`)
    .join('');

  if (selectedBefore) {
    select.value = normalizeHomepageTheme(selectedBefore);
  }
}

function updateHomepageThemeCurrentLabel(themeValue) {
  const current = document.getElementById('homepageThemeCurrent');
  if (!current) return;
  const rawPrefix = contentTextGlobal('homeThemeCurrentPrefix', 'Đang dùng');
  const rawLabel = getHomepageThemeLabel(themeValue);
  const _m = window.__manualTextMap || null;
  const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);
  const prefix = _tx(rawPrefix);
  const label = _tx(rawLabel) || rawLabel;
  current.textContent = `${prefix}: ${label}`;
}

function applyHomepageThemeLabelOverridesFromSettings() {
  const labelsFromSettings = window.__lmbUiSettings?.appearance?.homepageThemeLabels || {};
  homepageThemeLabelOverrides = sanitizeHomepageThemeLabels(labelsFromSettings);

  const selectedTheme = normalizeHomepageTheme(
    document.getElementById('homepageThemeSelect')?.value
    || localStorage.getItem(HOMEPAGE_THEME_STORAGE_KEY)
    || getDefaultHomepageTheme()
  );

  refreshHomepageThemeSelectOptions(selectedTheme);
  updateHomepageThemeCurrentLabel(selectedTheme);
}

function getDefaultHomepageTheme() {
  const fromSettings = String(window.__lmbUiSettings?.appearance?.homepageTheme || '').trim();
  if (HOMEPAGE_THEME_PRESETS.some((item) => item.value === fromSettings)) {
    return fromSettings;
  }
  const fromBootstrap = String(window.LMB_BOOTSTRAP?.defaultHomepageTheme || '').trim();
  if (HOMEPAGE_THEME_PRESETS.some((item) => item.value === fromBootstrap)) {
    return fromBootstrap;
  }
  return 'new_homepage.html';
}

function resolveHomepageThemeKey(themeFile) {
  const normalized = normalizeHomepageTheme(themeFile);
  const map = {
    'new_homepage.html': 'background_upgraded',
    'background_upgraded.html': 'background_upgraded',
    'background.html': 'background',
    'background-alt.html': 'background-alt',
    'background (1).html': 'background-1',
    'card_v3_purple.html': 'card_v3_purple',
    'card_v4_cyber.html': 'card_v4_cyber',
    'card_v4_cyber (1).html': 'card_v4_cyber-1',
    'card_v5_baroque.html': 'card_v5_baroque',
    'b10-card.html': 'b10-card',
    'boxes-redesign.html': 'boxes-redesign',
    'gift-boxes (1).html': 'gift-boxes-1',
    'mo-hop-qua (1).html': 'mo-hop-qua-1'
  };
  return map[normalized] || 'background_upgraded';
}

function applyHomepageThemeVisual(themeFile) {
  const themeKey = resolveHomepageThemeKey(themeFile);
  document.body.setAttribute('data-home-theme', themeKey);
  const loginScreen = document.getElementById('screen-login');
  if (loginScreen) {
    loginScreen.setAttribute('data-home-theme', themeKey);
  }
}

let homepageRenderToken = 0;
window.__lmbUiSettings = { content: {}, logo: {}, appearance: {}, seo: {}, chat: {}, popup: {}, boxSettings: {}, social: {}, watermark: {}, maintenance: {}, scripts: {}, features: {}, userNotification: {} };

if (!window.__lmbNativeConsole) {
  window.__lmbNativeConsole = {
    log: typeof console?.log === 'function' ? console.log.bind(console) : () => {},
    info: typeof console?.info === 'function' ? console.info.bind(console) : () => {},
    debug: typeof console?.debug === 'function' ? console.debug.bind(console) : () => {},
    warn: typeof console?.warn === 'function' ? console.warn.bind(console) : () => {},
    error: typeof console?.error === 'function' ? console.error.bind(console) : () => {}
  };
}

if (!window.__lmbErrorsOnlyConsolePatched) {
  window.__lmbErrorsOnlyConsolePatched = true;
  const hostname = String(window.location?.hostname || '').toLowerCase();
  const isLocalDevHost = hostname === 'localhost' || hostname === '127.0.0.1';
  if (typeof console !== 'undefined' && window.__LMB_ERRORS_ONLY === true && !isLocalDevHost) {
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.warn = () => {};
  }
}

const LMB_API_GET_BURST_CACHE = new Map();

function normalizeApiGetCacheKey(url) {
  try {
    const parsed = new URL(String(url || ''), window.location.origin);
    parsed.searchParams.delete('_ts');
    return `${parsed.pathname}${parsed.search}`;
  } catch (_) {
    return String(url || '').replace(/([?&])_ts=\d+(&|$)/, '$1').replace(/[?&]$/, '');
  }
}

function isRealtimeDebugEnabled() {
  try {
    const qp = new URLSearchParams(window.location.search);
    if (qp.get('rtdebug') === '1') return true;
    const ls = localStorage.getItem('lmb:rt:debug');
    if (ls === '1' || ls === 'true') return true;
  } catch (_) {}
  return !!window.__LMB_RT_DEBUG;
}

function rtDbg(step, payload) {
  if (!isRealtimeDebugEnabled()) return;
  const ts = new Date().toISOString();
  const rawData = (payload && typeof payload === 'object') ? payload : { value: payload };
  let data = rawData;
  if (!rawData || typeof rawData !== 'object') {
    data = { value: rawData };
  }

  let safeLogData = data;
  try {
    // Keep logs serializable and lightweight for fast inspection.
    safeLogData = JSON.parse(JSON.stringify(data));
  } catch (_) {
    safeLogData = {
      note: 'non-serializable-payload',
      type: Object.prototype.toString.call(data)
    };
  }

  window.__lmbRtLogs = Array.isArray(window.__lmbRtLogs) ? window.__lmbRtLogs : [];
  window.__lmbRtLogs.push({ ts, step, ...safeLogData });
  if (window.__lmbRtLogs.length > 300) window.__lmbRtLogs.splice(0, window.__lmbRtLogs.length - 300);
  try {
    (window.__lmbNativeConsole?.log || console.log)(`[LMB-RT] ${ts} ${step}`, safeLogData);
  } catch (_) {}
}

window.enableLmbRtDebug = function enableLmbRtDebug(enabled = true) {
  try {
    localStorage.setItem('lmb:rt:debug', enabled ? '1' : '0');
  } catch (_) {}
  window.__LMB_RT_DEBUG = !!enabled;
  rtDbg('debug-toggle', { enabled: !!enabled });
};

const state = {
  mode: 'Lucky',
  sessionCode: '',
  sessionCurrency: 'VND',
  openOrder: [1, 2, 3],
  boxes: {
    1: { state: 'inactive', value: 0, name: '' },
    2: { state: 'inactive', value: 0, name: '' },
    3: { state: 'inactive', value: 0, name: '' }
  },
  wallet: {
    balance: 0,
    remaining: 0,
    withdrawn: 0,
    pending: 0,
    pendingConversion: 0,
    trustScore: 100,
    minTrustScoreForWithdrawal: 100,
    canWithdrawByTrust: true,
    trustBlockedMessage: '',
    transactions: []
  },
  inventoryItems: [],
  balance: 0,
  loadingOpen: false,
  ckOn: false,
  currentHubTab: 'inventory',
  txFilter: 'all',
  txPage: 1,
  txPageSize: 6,
  activeClaimBox: null,
  currentWinBox: null,
  currentPrize: null,
  gameLocked: false,
  gameLockReason: '',
  approvalWaitIntervalId: null,
  approvalPollIntervalId: null,
  approvalReminderIntervalId: null,
  approvalSupportBlinkIntervalId: null,
  approvalTypingIntervalId: null,
  approvalTypingCursorTimeoutId: null,
  approvalUiRafId: 0,
  approvalStageTimerId: null,
  approvalLongWaitHintTimerId: null,
  approvalReminderIndex: 0,
  winOverlayRefreshTimer: null,
  existingWithdrawalId: null,
  isUpdatingWithdrawal: false,
  isSubmittingWithdrawal: false,
  withdrawSubmitPendingTimer: null,
  withdrawSubmitPendingStartedAt: 0,
  autoReloadPending: false,
  autoReloadTimerId: null,
  withdrawModalTab: 'history',
  withdrawalHistoryRows: [],
  withdrawalHistorySessionCode: '',
  sessionStartTime: parseInt(localStorage.getItem('lmbSessionStart') || '0', 10) || Date.now(),
  sessionTimeout: 30 * 60 * 1000,
  isSessionValid: true,
  syncTimer: null,
  syncBusy: false,
  economyRefreshTimer: null,
  economyRefreshInFlight: false,
  economyRefreshQueued: false,
  economyRefreshLastAt: 0,
  economyRefreshMinIntervalMs: 900,
  renderBoxesToken: 0,
  chat: {
    sessionCode: '',
    pollingTimer: null,
    pollingInterval: 8000,
    pollingInFlight: null,
    pollingSince: 0,
    pollingFallbackMode: false,
    sseUrl: '',
    initialized: false,
    unreadBaselineReady: false,
    messages: [],
    maxDomMessages: 1200,
    virtualizationThreshold: 90,
    virtualWindowSize: 64,
    virtualOverscan: 14,
    virtualRowEstimate: 84,
    virtualScrollBound: false,
    lastSeenAt: 0,
    lastUnreadCount: 0,
    pendingPrizeInfo: null,
    sendBusy: false,
    sendBusySince: 0,
    sendQueue: [],
    sendDrainPromise: null,
    uploadBusy: false,
    dragDropBound: false,
    emojiBound: false,
    sseSource: null,
    sseClient: null,
    sseScopeSignature: '',
    sseLastEventAt: 0,
    sseWatchdogTimer: null,
    sseRecoveryTimer: null,
    sseRecoveryBindingsReady: false,
    renderTimer: null,
    unreadSyncTimer: null,
    messagesFetchInFlight: null,
    messagesLastFetchAt: 0,
    messagesFetchMinIntervalMs: 1800,
    seenPostTimer: null,
    seenPostInFlight: false,
    seenPostLastAt: 0,
    seenPostCooldownMs: 1200,
    fabHintCycleTimer: null,
    fabHintCycleRunning: false,
    profileCompleted: false,
    quickStartInFlight: false,
    messageActionBound: false,
    composerRecoveryBound: false,
    iconLibrary: ['😀', '😁', '😂', '🥰', '😍', '🤩', '😎', '👏', '👍', '🙏', '🎉', '✨', '🔥', '💬', '📦', '🎁', '💸', '💎', '🌟', '🧧', '❤️', '🤝', '🛟', '📞']
  },
  gameSettings: {
    showUnluckyPopup: false,
    allowReopenPopup: true,
    showCelebrationEffects: true
  },
  sessionSpecialByBox: { 1: false, 2: false, 3: false },
  sessionImageByBox: { 1: '', 2: '', 3: '' },
  heroTypingTimer: null,
  heroTypingRestartTimer: null,
  homeFeedTimer: null,
  gameFeedTimer: null,
  floatingRealFeedRefreshTimer: null,
  floatingRealFeedQueue: [],
  floatingRealFeedLastFetchAt: 0,
  floatingRealFeedInFlight: false,
  floatingRealFeedCursor: 0,
  floatingRealFeedShownIds: {},
  floatingFeedMixToggle: false,
  realtimeQueue: [],
  realtimeQueueRaf: 0,
  realtimeQueueDrainTimer: null,
  approvedConversionReminderBox: null,
  approvedConversionReminderVisible: false,
  approvedConversionReminderLastShownAtByBox: {},
  approvedConversionReminderTimersByBox: {},
  approvedConversionReminderMutedThisSession: false,
  approvedConversionReminderIntervalMin: 3,
  approvalWaitingBox: 0,
  urlAutoEnterRunning: false,
  urlAutoEnterDone: false,
  urlAutoEnterAttempts: 0,
  urlAutoEnterMaxAttempts: 2,
  autoEnterRetryTimerIds: [],
  startGamePromise: null,
  hasUserInteracted: false,
  inactivityHintTimerId: null,
  rewardReminderTimerId: null,
  engagement: {
    pityThreshold: 8,
    pityCount: 0,
    streak: 0,
    points: 0,
    opens: 0,
    freeBoxCost: 120,
    lastOpenAt: 0,
    idleHintShown: false
  }
};
// Expose state globally so lazy-loaded modules (lmb-floating-feed, etc.)
// can access it regardless of whether this file runs as a classic script or ES module.
window.state = state;

const CHAT_GLOBAL_KEYS = {
  sessionCode: 'lmbv2:chat:sessionCode',
  profile: 'lmbv2:chat:profile',
  lastSeenAt: 'lmbv2:chat:lastSeenAt',
  unreadCount: 'lmbv2:chat:unreadCount',
  engagement: 'lmbv2:engagement',
  withdrawalSupportLastAt: 'lmbv2:withdraw:support:lastAt',
  withdrawalPendingDecisionIds: 'lmbv2:withdraw:pending:ids'
};

const WITHDRAW_SUPPORT_COOLDOWN_MS = 5 * 60 * 1000;
const DEFAULT_WITHDRAW_REJECT_REASON = 'Giao dịch chưa thể xử lý do lỗi hệ thống. Quý khách vui lòng liên hệ CSKH để được hỗ trợ.';

function markUserInteracted() {
  if (!state.hasUserInteracted) state.hasUserInteracted = true;
  touchEngagementActivity();
}

window.addEventListener('pointerdown', markUserInteracted, { passive: true });
window.addEventListener('keydown', markUserInteracted, { passive: true });

function isMobileLiteEffects() {
  const mobile = !!(window.matchMedia && window.matchMedia('(max-width: 1024px)').matches);
  const reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const hc = Number(navigator.hardwareConcurrency || 4);
  const dm = Number(navigator.deviceMemory || 4);
  const lowEndDesktop = hc <= 4 || dm <= 4;
  return mobile || reducedMotion || saveData || lowEndDesktop;
}

function shouldUseLegacyChatPollingTransport() {
  if (window.LMB_DISABLE_SSE) return true;
  if (typeof window.EventSource !== 'function') return true;
  const ua = String(navigator.userAgent || '').toLowerCase();
  const androidMatch = ua.match(/android\s+(\d+)/i);
  const androidVersion = androidMatch ? parseInt(androidMatch[1], 10) || 0 : 0;
  const lowMemory = Number(navigator.deviceMemory || 4) <= 3;
  const lowCpu = Number(navigator.hardwareConcurrency || 4) <= 4;
  return ua.includes('android') && androidVersion > 0 && (androidVersion <= 8 || (isMobileLiteEffects() && (lowMemory || lowCpu)));
}

function syncHomepagePerformanceMode() {
  const loginScreen = document.getElementById('screen-login');
  const homeVisible = !!(loginScreen && window.getComputedStyle(loginScreen).display !== 'none');
  document.body.classList.toggle('lmb-home-static', homeVisible);
}

if (isMobileLiteEffects()) {
  document.body.classList.add('lmb-mobile-lite');
}

const hiddenPauseCssId = 'lmbHiddenPauseAnimations';
if (!document.getElementById(hiddenPauseCssId)) {
  const style = document.createElement('style');
  style.id = hiddenPauseCssId;
  style.textContent = 'body.lmb-hidden-paused *, body.lmb-hidden-paused *::before, body.lmb-hidden-paused *::after { animation-play-state: paused !important; }';
  document.head.appendChild(style);
}

document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('lmb-hidden-paused', document.hidden);
});

function createLocalEventBus() {
  const listeners = new Map();
  return {
    on: (eventName, handler) => {
      const key = String(eventName || '');
      if (!key || typeof handler !== 'function') return () => {};
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(handler);
      return () => {
        const set = listeners.get(key);
        if (!set) return;
        set.delete(handler);
        if (set.size === 0) listeners.delete(key);
      };
    },
    emit: (eventName, payload) => {
      const key = String(eventName || '');
      const set = listeners.get(key);
      if (!set || set.size === 0) return;
      set.forEach((fn) => {
        try { fn(payload); } catch (_) {}
      });
    }
  };
}

const LMB_EVENT_BUS = (window.LMBEventBus && typeof window.LMBEventBus.on === 'function' && typeof window.LMBEventBus.emit === 'function')
  ? window.LMBEventBus
  : (window.__lmbLocalEventBus || (window.__lmbLocalEventBus = createLocalEventBus()));

const LMB_UPDATE_SCHEDULER = window.LMBUpdateScheduler || {
  schedule: (key, payload, apply) => {
    if (typeof apply === 'function') apply(payload);
  }
};

const LMB_RUNTIME = {
  realtimeConsumersBound: false,
  chatRuntimeBound: false,
  chatRuntimeStarted: false,
  chatRuntimeStarting: false,
  sseEndpointResolved: false,
  sseEndpointBase: '/events',
  sseProbePromise: null
};

const LMB_DEV_MONITOR = {
  enabled: /localhost|127\.0\.0\.1/i.test(String(location.hostname || '')),
  sseCounter: 0,
  sseWindowStart: Date.now()
};

let _cachedApiFingerprint = null;
let _cachedApiFingerprintPromise = null;

async function ensureApiFingerprintCached() {
  if (_cachedApiFingerprint) return _cachedApiFingerprint;
  if (_cachedApiFingerprintPromise) return _cachedApiFingerprintPromise;
  if (typeof BrowserFingerprint === 'undefined') return null;

  _cachedApiFingerprintPromise = (async () => {
    try {
      const fp = (typeof BrowserFingerprint.getForAPIAsync === 'function')
        ? await BrowserFingerprint.getForAPIAsync()
        : (typeof BrowserFingerprint.getForAPI === 'function' ? BrowserFingerprint.getForAPI() : null);
      _cachedApiFingerprint = fp || null;
      return _cachedApiFingerprint;
    } catch (_) {
      return null;
    }
  })();

  return _cachedApiFingerprintPromise;
}

function requestBrowserNotificationPermissionOnce() {
  if (!('Notification' in window)) return Promise.resolve('unsupported');
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Promise.resolve(Notification.permission);
  }
  if (state.chat.notificationPermissionRequested) {
    return Promise.resolve(Notification.permission || 'default');
  }
  state.chat.notificationPermissionRequested = true;
  return Notification.requestPermission().catch(() => 'default');
}

function emitRealtimeEvent(type, payload) {
  const isChatMessageEvent = type === 'chat:new_message';
  LMB_UPDATE_SCHEDULER.schedule(type, payload, (nextPayload) => {
    LMB_EVENT_BUS.emit(type, nextPayload);
  }, 100, {
    coalesce: !isChatMessageEvent
  });
}

function clearRealtimeQueueDrainTimer() {
  if (!state.realtimeQueueDrainTimer) return;
  clearTimeout(state.realtimeQueueDrainTimer);
  state.realtimeQueueDrainTimer = null;
}

function scheduleRealtimeQueueDrain() {
  if (state.realtimeQueueRaf) return;
  if (document.hidden) {
    if (!state.realtimeQueueDrainTimer) {
      state.realtimeQueueDrainTimer = setTimeout(() => {
        state.realtimeQueueDrainTimer = null;
        scheduleRealtimeQueueDrain();
      }, 240);
    }
    return;
  }

  clearRealtimeQueueDrainTimer();
  state.realtimeQueueRaf = requestAnimationFrame(() => {
    state.realtimeQueueRaf = 0;
    flushRealtimeEventQueue();
  });
}

function flushRealtimeEventQueue() {
  if (!Array.isArray(state.realtimeQueue) || state.realtimeQueue.length === 0) return;

  const started = performance.now();
  let processed = 0;
  const batchSize = 20;

  while (state.realtimeQueue.length > 0 && processed < batchSize) {
    const event = state.realtimeQueue.shift();
    if (event && event.type) {
      emitRealtimeEvent(event.type, event.payload);
    }
    processed += 1;
    if ((performance.now() - started) >= 8) break;
  }

  if (state.realtimeQueue.length > 0) {
    scheduleRealtimeQueueDrain();
  }
}

function enqueueRealtimeEvent(type, payload) {
  if (!type) return;
  if (!Array.isArray(state.realtimeQueue)) state.realtimeQueue = [];
  state.realtimeQueue.push({ type, payload });

  // Hard cap queue to keep memory bounded during traffic spikes.
  if (state.realtimeQueue.length > 500) {
    state.realtimeQueue.splice(0, state.realtimeQueue.length - 500);
  }
  scheduleRealtimeQueueDrain();
}

async function resolveRealtimeSseBase() {
  if (LMB_RUNTIME.sseEndpointResolved) return LMB_RUNTIME.sseEndpointBase;
  if (LMB_RUNTIME.sseProbePromise) return LMB_RUNTIME.sseProbePromise;

  LMB_RUNTIME.sseProbePromise = (async () => {
    // Use the shared /events stream directly.
    // HEAD probing can incorrectly fail on some hosting/proxy setups and causes
    // fallback to /api/chat/events, where player message updates may not stream.
    LMB_RUNTIME.sseEndpointBase = '/events';

    LMB_RUNTIME.sseEndpointResolved = true;
    return LMB_RUNTIME.sseEndpointBase;
  })();

  return LMB_RUNTIME.sseProbePromise;
}

async function ensureLazyModule(name) {
  if (!window.lmbLazyModules || typeof window.lmbLazyModules.ensure !== 'function') return false;
  try {
    return await window.lmbLazyModules.ensure(name);
  } catch (_) {
    return false;
  }
}

async function ensureWalletModuleReady() {
  return ensureLazyModule('wallet');
}

async function ensureHistoryModuleReady() {
  return ensureLazyModule('history');
}

async function ensureAdminStatusModuleReady() {
  return ensureLazyModule('admin-status');
}

async function ensureChatModuleReady() {
  let mounted = false;
  try {
    mounted = await ensureLazyModule('chat');
  } catch (_) {
    mounted = false;
  }
  if (LMB_RUNTIME.chatRuntimeBound) return mounted;
  LMB_RUNTIME.chatRuntimeBound = true;
  setChatReadyUI(false);
  initChatWidgetNotificationRuntime();
  return mounted;
}

const FX_PROFILE = (() => {
  const reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const hc = Number(navigator.hardwareConcurrency || 4);
  const dm = Number(navigator.deviceMemory || 4);
  const qp = new URLSearchParams(window.location.search).get('fx');

  let tier = 'high';
  if (qp === 'low' || qp === 'medium' || qp === 'high') {
    tier = qp;
  } else if (reducedMotion || hc <= 4 || dm <= 4) {
    tier = 'low';
  } else if (hc <= 6 || dm <= 6) {
    tier = 'medium';
  }

  return {
    tier,
    effectScale: tier === 'high' ? 0.78 : tier === 'medium' ? 0.52 : 0.34,
    canvasScale: tier === 'high' ? 0.8 : tier === 'medium' ? 0.55 : 0.32,
    allowShake: tier === 'high',
    allowDualScan: tier !== 'low',
    allowVipText: tier === 'high',
    allowBeams: tier !== 'low',
    reducedMotion
  };
})();

function fxScaledCount(base, min = 1) {
  return Math.max(min, Math.round(base * FX_PROFILE.effectScale));
}
// Expose to window: needed by lazy-loaded lmb-celebration-fx.js when this file
// runs as type="module" (top-level const/fn are not automatically on window)
window.FX_PROFILE = FX_PROFILE;
window.fxScaledCount = fxScaledCount;

function resizeCanvas() {
  if (!cvs) return;
  W = cvs.width = window.innerWidth;
  H = cvs.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const STARS = Array.from({ length: Math.max(20, Math.round(80 * FX_PROFILE.canvasScale)) }, () => ({
  x: Math.random() * 3000,
  y: Math.random() * 2000,
  r: 0.35 + Math.random() * 2.1,
  phase: Math.random() * Math.PI * 2,
  spd: 0.002 + Math.random() * 0.009,
  col: ['#ffffff', '#d8b4fe', '#c084fc', '#a78bfa', '#fbbf24', '#93c5fd'][Math.floor(Math.random() * 6)]
}));

const BSTARS = Array.from({ length: Math.max(3, Math.round(10 * FX_PROFILE.canvasScale)) }, () => ({
  x: Math.random() * 3000,
  y: Math.random() * 2000,
  sz: 3 + Math.random() * 5,
  phase: Math.random() * Math.PI * 2,
  spd: 0.015 + Math.random() * 0.025,
  col: ['#e879f9', '#fbbf24', '#a78bfa', '#fff', '#67e8f9'][Math.floor(Math.random() * 5)]
}));

function mkGift(init) {
  const s = 20 + Math.random() * 30;
  return {
    x: Math.random() * (W || 1920),
    y: init ? Math.random() * -(H || 900) - 10 : -s - 10,
    size: s,
    vy: 0.45 + Math.random() * 0.9,
    vx: (Math.random() - 0.5) * 0.55,
    rot: Math.random() * Math.PI * 2,
    rspd: (Math.random() - 0.5) * 0.022,
    a: 0.48 + Math.random() * 0.38,
    col: ['#c0603a', '#d97706', '#7c3aed', '#a855f7', '#ef4444'][Math.floor(Math.random() * 5)],
    bow: ['#f59e0b', '#fbbf24', '#c084fc', '#f0abfc', '#fca5a5'][Math.floor(Math.random() * 5)]
  };
}

const GIFTS = Array.from({ length: Math.max(3, Math.round(8 * FX_PROFILE.canvasScale)) }, () => mkGift(true));

function drawGift(g) {
  ctx.save();
  ctx.translate(g.x, g.y);
  ctx.rotate(g.rot);
  ctx.globalAlpha = g.a;
  const s = g.size;
  const h = s * 0.6;
  ctx.shadowColor = g.col;
  ctx.shadowBlur = 7;
  ctx.fillStyle = g.col;
  ctx.beginPath();
  ctx.roundRect(-s / 2, -h / 2 + s * 0.17, s, h, 3);
  ctx.fill();
  ctx.globalAlpha = g.a * 0.88;
  ctx.beginPath();
  ctx.roundRect(-s / 2 - 2, -h / 2 - s * 0.16, s + 4, s * 0.22, 3);
  ctx.fill();
  ctx.globalAlpha = g.a;
  ctx.fillStyle = g.bow;
  ctx.fillRect(-s * 0.09, -h / 2 - s * 0.16, s * 0.18, h + s * 0.18);
  ctx.fillRect(-s / 2, -s * 0.07, s, s * 0.14);
  ctx.shadowBlur = 0;
  [[-0.15, 0.5], [0.15, -0.5]].forEach(([ox, sg]) => {
    ctx.beginPath();
    ctx.ellipse(ox * s, -h / 2 - s * 0.02, s * 0.15, s * 0.1, sg * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawXStar(x, y, r, a, col) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.1;
  for (let i = 0; i < 4; i += 1) {
    const ang = i * Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(ang) * r * 0.4, y + Math.sin(ang) * r * 0.4);
    ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r);
    ctx.stroke();
  }
  ctx.restore();
}

let tt = 0;
if (ctx && !isMobileLiteEffects()) {
  let frameSkip = 0;
  const canvasStep = FX_PROFILE.tier === 'high' ? 1 : FX_PROFILE.tier === 'medium' ? 2 : 3;
  let canvasRafId = 0;
  const loop = function() {
    frameSkip += 1;
    const loginScreen = document.getElementById('screen-login');
    const homeVisible = !!(loginScreen && window.getComputedStyle(loginScreen).display !== 'none');
    if (homeVisible) {
      ctx.clearRect(0, 0, W, H);
      canvasRafId = requestAnimationFrame(loop);
      return;
    }
    if (document.hidden) {
      canvasRafId = requestAnimationFrame(loop);
      return;
    }
    if (frameSkip % canvasStep !== 0) {
      canvasRafId = requestAnimationFrame(loop);
      return;
    }
    ctx.clearRect(0, 0, W, H);
    tt += 0.016;
    for (const s of STARS) {
      const a = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(s.phase + tt * s.spd * 60));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = s.col;
      if (s.r > 1.4) {
        ctx.shadowColor = s.col;
        ctx.shadowBlur = s.r * 3;
      }
      ctx.beginPath();
      ctx.arc(s.x % W, s.y % H, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    for (const s of BSTARS) {
      const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(s.phase + tt * s.spd * 60));
      const r = s.sz * (0.7 + 0.5 * a);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = s.col;
      ctx.shadowColor = s.col;
      ctx.shadowBlur = r * 4;
      ctx.beginPath();
      ctx.arc(s.x % W, s.y % H, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (a > 0.5) drawXStar(s.x % W, s.y % H, r * 2.5, a * 0.55, s.col);
    }
    for (let i = 0; i < GIFTS.length; i += 1) {
      const g = GIFTS[i];
      drawGift(g);
      g.y += g.vy;
      g.x += g.vx;
      g.rot += g.rspd;
      if (g.y > H + 80) GIFTS[i] = mkGift(false);
      if (g.x < -80 || g.x > W + 80) g.vx *= -1;
    }
    canvasRafId = requestAnimationFrame(loop);
  };

  const startCanvasFx = () => {
    if (canvasRafId) return;
    canvasRafId = requestAnimationFrame(loop);
  };

  const stopCanvasFx = () => {
    if (!canvasRafId) return;
    cancelAnimationFrame(canvasRafId);
    canvasRafId = 0;
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopCanvasFx();
    else startCanvasFx();
  });

  startCanvasFx();
} else if (cvs) {
  cvs.style.display = 'none';
}

function showToast(text, options = {}) {
  const t = document.getElementById('toast');
  if (!t) return;
  const tone = String(options.tone || options.type || '').toLowerCase();
  const duration = Math.max(5000, Math.min(8000, Number(options.duration || 6500) || 6500));
  const toastId = `toast-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  t.dataset.toastId = toastId;

  t.classList.remove('toast-success', 'toast-error', 'toast-info', 'toast-warning');
  if (tone === 'success') t.classList.add('toast-success');
  else if (tone === 'error') t.classList.add('toast-error');
  else if (tone === 'warning') t.classList.add('toast-warning');
  else t.classList.add('toast-info');

  const titleMap = {
    success: 'Thành công',
    error: 'Thông báo lỗi',
    warning: 'Cảnh báo',
    info: 'Thông báo'
  };
  const iconMap = {
    success: '✓',
    error: '!',
    warning: '!',
    info: 'i'
  };
  const toneKey = (tone === 'success' || tone === 'error' || tone === 'warning') ? tone : 'info';

  t.style.setProperty('--toast-life', `${duration}ms`);
  t.innerHTML = `
    <div class="toast-card">
      <div class="toast-tone" aria-hidden="true"></div>
      <div class="toast-icon" aria-hidden="true">${iconMap[toneKey]}</div>
      <div class="toast-body">
        <div class="toast-title">${titleMap[toneKey]}</div>
        <div class="toast-msg"></div>
      </div>
      <button type="button" class="toast-close" aria-label="Đóng" onclick="var el=this.closest('#toast');if(el)el.classList.remove('show')">×</button>
      <div class="toast-progress" aria-hidden="true"></div>
    </div>
  `;

  const msgEl = t.querySelector('.toast-msg');
  if (msgEl) msgEl.textContent = text;

  if ((window.__currentLang || 'vi') !== 'vi') {
    translateRuntimeText(text).then((out) => {
      if (out && t.dataset.toastId === toastId) {
        const latestMsgEl = t.querySelector('.toast-msg');
        if (latestMsgEl) latestMsgEl.textContent = out;
      }
    }).catch(() => {});
  }
  t.classList.add('show');
  clearTimeout(t._hideTimerId);
  t._hideTimerId = setTimeout(() => t.classList.remove('show'), duration);
}

function notifyDbg(stage, data = {}) {
  try {
    let enabled = false;
    try {
      const qp = new URLSearchParams(window.location.search);
      enabled = qp.get('notifydebug') === '1' || isRealtimeDebugEnabled() || window.__LMB_NOTIFY_DEBUG === true;
      if (!enabled) {
        const ls = localStorage.getItem('lmb:notify:debug');
        enabled = ls === '1' || ls === 'true';
      }
    } catch (_) {
      enabled = isRealtimeDebugEnabled() || window.__LMB_NOTIFY_DEBUG === true;
    }
    if (!enabled) return;

    const record = {
      ts: new Date().toISOString(),
      stage,
      data
    };
    window.__LMB_NOTIFY_DEBUG_LOGS = window.__LMB_NOTIFY_DEBUG_LOGS || [];
    window.__LMB_NOTIFY_DEBUG_LOGS.push(record);
    if (window.__LMB_NOTIFY_DEBUG_LOGS.length > 400) {
      window.__LMB_NOTIFY_DEBUG_LOGS.splice(0, window.__LMB_NOTIFY_DEBUG_LOGS.length - 400);
    }
    (window.__lmbNativeConsole?.log || console.log)('[LMB][notify-debug]', stage, data);
  } catch (_) {}
}

notifyDbg('runtime-script-loaded', {
  href: window.location.href,
  userAgent: navigator.userAgent,
  gameSessionCode: state?.sessionCode || '',
  chatSessionCode: state?.chat?.sessionCode || ''
});

function playRealtimeNotificationSound(type = 'message') {
  if (!state.hasUserInteracted) {
    notifyDbg('sound-skip-no-interaction', { type });
    return;
  }
  if (!window.notificationSound && window.NotificationSoundModule && typeof window.NotificationSoundModule.getNotificationSound === 'function') {
    try {
      window.NotificationSoundModule.getNotificationSound();
    } catch (_) {}
  }
  if (!window.notificationSound || typeof notificationSound.playSound !== 'function') {
    notifyDbg('sound-skip-manager-missing', { type, hasManager: !!window.notificationSound });
    return;
  }
  try {
    notificationSound.playSound(type);
    notifyDbg('sound-play-dispatched', { type });
  } catch (_) {}
}

function isPendingApprovedCashBox(boxMeta) {
  const box = boxMeta || {};
  const decision = String(box.decision || '').toLowerCase();
  return !!(
    box.isSpecial
    && box.specialApproved
    && isCashPrizeLike(box)
    && !['converted', 'exchanged', 'declined'].includes(decision)
  );
}

function getApprovedWithdrawalCount() {
  const historyMatchesSession = String(state.withdrawalHistorySessionCode || '').trim().toUpperCase() === String(state.sessionCode || '').trim().toUpperCase();
  const approvedIds = new Set();

  if (historyMatchesSession && Array.isArray(state.withdrawalHistoryRows)) {
    state.withdrawalHistoryRows.forEach((row) => {
      if (!row || String(row.status || '').toLowerCase() !== 'approved') return;
      const key = String(row.id || row.request_code || row.requested_at || Math.random()).trim();
      if (key) approvedIds.add(`hist:${key}`);
    });
  }

  const txRows = Array.isArray(state.wallet?.transactions) ? state.wallet.transactions : [];
  txRows.forEach((tx) => {
    const type = String(tx?.type || '').toLowerCase();
    if (type !== 'withdraw') return;
    if (String(tx?.status || '').toLowerCase() !== 'approved') return;
    const key = String(tx?.id || tx?.withdrawalCode || tx?.requestedAt || tx?.created_at || Math.random()).trim();
    if (key) approvedIds.add(`tx:${key}`);
  });

  return approvedIds.size;
}

function getOpenedMoneyPrizeCount() {
  const ordered = Array.isArray(state.openOrder) && state.openOrder.length
    ? state.openOrder
    : [1, 2, 3];

  return ordered.reduce((count, boxNum) => {
    const box = state.boxes?.[boxNum] || null;
    if (!box) return count;
    const boxState = String(box.state || '').toLowerCase();
    const opened = boxState.startsWith('opened');
    const isMoneyBox = !!box.isCash && Math.max(0, Number(box.value || 0)) > 0;
    if (!opened || !isMoneyBox) return count;
    return count + 1;
  }, 0);
}

function getPendingApprovedCashBoxNumber() {
  const ordered = Array.isArray(state.openOrder) && state.openOrder.length
    ? state.openOrder
    : [1, 2, 3];
  const found = ordered.find((boxNum) => isPendingApprovedCashBox(state.boxes?.[boxNum] || null));
  return Number(found || 0);
}

function requiresWalletWithdrawalBeforeNextBox() {
  if (state.requireWithdrawal === false) return false;
  const openedMoneyCount = getOpenedMoneyPrizeCount();
  if (openedMoneyCount <= 0) return false;
  const approvedWithdrawalCount = getApprovedWithdrawalCount();
  return approvedWithdrawalCount < openedMoneyCount;
}

function updateGameLockByApprovedPendingCash() {
  const pendingBox = getPendingApprovedCashBoxNumber();
  if (pendingBox > 0) {
    state.gameLocked = true;
    state.gameLockReason = 'convert_required';
    return state.gameLocked;
  }

  if (requiresWalletWithdrawalBeforeNextBox()) {
    state.gameLocked = true;
    state.gameLockReason = 'withdraw_request_required';
    return state.gameLocked;
  }

  state.gameLocked = false;
  state.gameLockReason = '';
  return state.gameLocked;
}

function getGameLockNoticeText() {
  if (state.gameLockReason === 'withdraw_request_required') {
    return 'Vui lòng hoàn tất bước xác minh phần thưởng tại CSKH trước khi mở hộp tiếp theo';
  }
  return 'Vui lòng quy đổi phần thưởng đã duyệt trước khi mở hộp tiếp theo';
}

function isAlreadyConvertedErrorMessage(message) {
  const msg = String(message || '').toLowerCase();
  if (!msg) return false;
  return msg.includes('đã quy đổi')
    || msg.includes('da quy doi')
    || msg.includes('đã được duyệt quy đổi')
    || msg.includes('da duoc duyet quy doi')
    || msg.includes('đã được duyệt')
    || msg.includes('already converted')
    || msg.includes('already approved');
}

function getApprovedConversionReminderIntervalMs() {
  const mins = Math.max(1, Math.min(120, Number(state.approvedConversionReminderIntervalMin || 3) || 3));
  state.approvedConversionReminderIntervalMin = mins;
  return mins * 60 * 1000;
}

function clearApprovedConversionReminderTimer(boxNumber) {
  const box = Number(boxNumber || 0);
  if (!box) return;
  const timerId = state.approvedConversionReminderTimersByBox[box];
  if (timerId) {
    clearTimeout(timerId);
    state.approvedConversionReminderTimersByBox[box] = null;
  }
}

function scheduleApprovedConversionReminder(boxNumber, options = {}) {
  const box = Number(boxNumber || 0);
  if (!box) return;

  clearApprovedConversionReminderTimer(box);
  if (state.approvedConversionReminderMutedThisSession) return;

  const delayMs = Math.max(5000, Number(options.delayMs || getApprovedConversionReminderIntervalMs()));
  state.approvedConversionReminderTimersByBox[box] = setTimeout(() => {
    state.approvedConversionReminderTimersByBox[box] = null;
    const meta = state.boxes?.[box] || null;
    if (!meta || !isPendingApprovedCashBox(meta)) return;

    const winOv = document.getElementById('winOv');
    const winOverlayOpen = !!(winOv && winOv.classList.contains('open'));
    if (!winOverlayOpen) {
      showApprovedConversionReminderModal(box);
      return;
    }

    // Defer reminder while the main prize overlay is currently open.
    scheduleApprovedConversionReminder(box, { delayMs: 45000 });
  }, delayMs);
}

function stopApprovedConversionReminder(boxNumber) {
  const box = Number(boxNumber || 0);
  if (box > 0) {
    clearApprovedConversionReminderTimer(box);
  }
  if (state.approvedConversionReminderBox && Number(state.approvedConversionReminderBox) === box) {
    hideApprovedConversionReminderModal({ scheduleNext: false });
  }
}

function ensureApprovedConversionReminderModal() {
  let styleEl = document.getElementById('lmbApprovedReminderStyle');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'lmbApprovedReminderStyle';
    styleEl.textContent = '.apr-reminder-ov{position:fixed;inset:0;z-index:99998;background:rgba(3,8,20,.64);display:none;align-items:center;justify-content:center;padding:16px}.apr-reminder-card{width:min(460px,94vw);border-radius:16px;border:1px solid rgba(148,163,184,.36);background:linear-gradient(165deg,#0f172a,#111827);box-shadow:0 28px 70px rgba(2,6,23,.6);color:#e2e8f0;padding:18px 18px 16px}.apr-reminder-title{font-size:18px;font-weight:800;margin:0 0 8px;color:#f8fafc}.apr-reminder-msg{font-size:13px;line-height:1.5;color:#cbd5e1}.apr-reminder-options{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;flex-wrap:wrap}.apr-reminder-interval{font-size:12px;color:#cbd5e1;display:flex;align-items:center;gap:6px}.apr-reminder-interval input{width:54px;border:1px solid rgba(148,163,184,.45);border-radius:7px;background:rgba(15,23,42,.45);color:#e2e8f0;padding:4px 6px;font-size:12px}.apr-reminder-check{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:#cbd5e1;cursor:pointer}.apr-reminder-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:14px}.apr-reminder-btn{border:none;border-radius:10px;padding:9px 12px;font-size:13px;font-weight:700;cursor:pointer}.apr-reminder-btn.primary{background:linear-gradient(135deg,#22d3ee,#38bdf8);color:#082f49}.apr-reminder-btn.secondary{background:rgba(148,163,184,.2);color:#e2e8f0}';
    document.head.appendChild(styleEl);
  }

  let ov = document.getElementById('approvedConversionReminderOv');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'approvedConversionReminderOv';
    ov.className = 'apr-reminder-ov';
    ov.innerHTML = '<div class="apr-reminder-card" role="dialog" aria-modal="true" aria-labelledby="aprReminderTitle"><h3 class="apr-reminder-title" id="aprReminderTitle">Thông báo duyệt quà</h3><div class="apr-reminder-msg" id="aprReminderMsg"></div><div class="apr-reminder-options"><label class="apr-reminder-interval">Nhắc lại sau <input type="number" id="aprReminderMinutesInput" min="1" max="120" step="1" value="3"> phút</label><label class="apr-reminder-check"><input type="checkbox" id="aprReminderMuteSession"> Không nhắc lại trong phiên này</label></div><div class="apr-reminder-actions"><button type="button" class="apr-reminder-btn secondary" id="aprReminderLaterBtn">Để sau</button><button type="button" class="apr-reminder-btn primary" id="aprReminderConvertBtn">Quy đổi ngay</button></div></div>';
    document.body.appendChild(ov);

    ov.addEventListener('click', (e) => {
      if (e.target === ov) hideApprovedConversionReminderModal();
    });

    const minutesInput = ov.querySelector('#aprReminderMinutesInput');
    if (minutesInput) {
      minutesInput.addEventListener('change', () => {
        const mins = Math.max(1, Math.min(120, Number(minutesInput.value || 3) || 3));
        state.approvedConversionReminderIntervalMin = mins;
        minutesInput.value = String(mins);
      });
    }

    const muteCheckbox = ov.querySelector('#aprReminderMuteSession');
    if (muteCheckbox) {
      muteCheckbox.addEventListener('change', () => {
        state.approvedConversionReminderMutedThisSession = !!muteCheckbox.checked;
        if (state.approvedConversionReminderMutedThisSession) {
          Object.keys(state.approvedConversionReminderTimersByBox || {}).forEach((key) => {
            clearApprovedConversionReminderTimer(Number(key));
          });
        }
      });
    }

    const laterBtn = ov.querySelector('#aprReminderLaterBtn');
    if (laterBtn) {
      laterBtn.addEventListener('click', () => hideApprovedConversionReminderModal({ scheduleNext: true }));
    }

    const convertBtn = ov.querySelector('#aprReminderConvertBtn');
    if (convertBtn) {
      convertBtn.addEventListener('click', async () => {
        const box = Number(state.approvedConversionReminderBox || 0);
        if (!box || !state.boxes[box]) return;

        const ok = window.confirm('Bạn chắc chắn muốn quy đổi tiền ngay bây giờ?');
        if (!ok) return;

        hideApprovedConversionReminderModal({ scheduleNext: false });
        try {
          await convertApprovedSpecialPrizeNow(box);
        } catch (err) {
          if (isAlreadyConvertedErrorMessage(err?.message)) {
            try {
              if (state.boxes[box]) {
                state.boxes[box].decision = 'converted';
                state.boxes[box].status = 'converted';
                state.boxes[box].processingStatus = 'converted';
              }
              stopApprovedConversionReminder(box);
              await Promise.all([refreshHubData(), refreshBoxesFromServer()]);
              activateNextBox();
              showToast('✅ Hệ thống đã đồng bộ trạng thái quy đổi thành công.');
              return;
            } catch (_) {
              // Fallback to normal error handling below.
            }
          }
          showToast(`❌ ${err?.message || 'Quy đổi thất bại'}`);
          showApprovedConversionReminderModal(box, { force: true });
        }
      });
    }
  }

  return ov;
}

function hideApprovedConversionReminderModal(options = {}) {
  const scheduleNext = options.scheduleNext !== false;
  const ov = document.getElementById('approvedConversionReminderOv');
  if (!ov) return;
  const box = Number(state.approvedConversionReminderBox || 0);
  ov.style.display = 'none';
  state.approvedConversionReminderVisible = false;
  if (scheduleNext && box > 0 && !state.approvedConversionReminderMutedThisSession) {
    const meta = state.boxes?.[box] || null;
    if (meta && isPendingApprovedCashBox(meta)) {
      scheduleApprovedConversionReminder(box);
    }
  }
}

function showApprovedConversionReminderModal(boxNumber, options = {}) {
  const box = Number(boxNumber || 0);
  const meta = state.boxes?.[box] || null;
  if (!box || !meta || !isPendingApprovedCashBox(meta)) return;
  if (state.approvedConversionReminderMutedThisSession) return;

  const force = options.force === true;
  const now = Date.now();
  const lastShownAt = Number(state.approvedConversionReminderLastShownAtByBox[box] || 0);
  if (!force && (now - lastShownAt) < 12000) return;

  const ov = ensureApprovedConversionReminderModal();
  if (!ov) return;

  const amount = Number(meta.value || 0);
  const currency = String(meta.currency || 'VND').toUpperCase();
  const amountText = formatCurrencyBySymbol(amount, currency);
  const msgEl = ov.querySelector('#aprReminderMsg');
  const minutesInput = ov.querySelector('#aprReminderMinutesInput');
  const muteCheckbox = ov.querySelector('#aprReminderMuteSession');
  if (msgEl) {
    msgEl.textContent = `Quà của bạn đã được admin duyệt. Bạn chưa quy đổi ${amountText}. Vui lòng bấm "Quy đổi ngay" để hoàn tất.`;
  }
  if (minutesInput) {
    const mins = Math.max(1, Math.min(120, Number(state.approvedConversionReminderIntervalMin || 3) || 3));
    state.approvedConversionReminderIntervalMin = mins;
    minutesInput.value = String(mins);
  }
  if (muteCheckbox) {
    muteCheckbox.checked = !!state.approvedConversionReminderMutedThisSession;
  }

  state.approvedConversionReminderBox = box;
  state.approvedConversionReminderVisible = true;
  state.approvedConversionReminderLastShownAtByBox[box] = now;
  ov.style.display = 'flex';
  clearApprovedConversionReminderTimer(box);
  playRealtimeNotificationSound('admin_message');
}

window.__runtimeI18nCache = window.__runtimeI18nCache || {};
window.__manualTextMap = window.__manualTextMap || {};
function translateRuntimeText(text) {
  const lang = window.__currentLang || 'vi';
  const src = String(text || '');
  if (!src || lang === 'vi') return Promise.resolve(src);
  const ck = lang + '::' + src;
  if (window.__runtimeI18nCache[ck]) return Promise.resolve(window.__runtimeI18nCache[ck]);
  const map = window.__i18nTranslations || {};
  const textMap = window.__manualTextMap || {};
  const out = map[src] || textMap[src] || src;
  window.__runtimeI18nCache[ck] = out;
  return Promise.resolve(out);
}

function formatVND(value) {
  return `${Math.max(0, Number(value) || 0).toLocaleString('vi-VN')} đ`;
}

function formatCurrency(value, currency) {
  const v = Math.max(0, Number(value) || 0).toLocaleString('vi-VN');
  if (currency === 'USD') return `$${v} USD`;
  if (currency === 'NDT') return `¥${v} NDT`;
  return `${v} đ`;
}

function normalizeCurrency(currency) {
  const cur = String(currency || 'VND').toUpperCase();
  if (cur === 'USD' || cur === 'NDT') return cur;
  return 'VND';
}

function formatCurrencyBySymbol(value, currency) {
  const amount = Math.max(0, Number(value) || 0).toLocaleString('vi-VN');
  const cur = normalizeCurrency(currency);
  if (cur === 'USD') return `$${amount}`;
  if (cur === 'NDT') return `¥${amount}`;
  return `${amount}₫`;
}

function renderCurrencyWalletCards() {
  const card = document.getElementById('walletItemVND');
  const badge = document.getElementById('walletBadgeVND');
  const amount = document.getElementById('walletAmtVND');
  const note = document.getElementById('walletNoteVND');
  if (!card || !badge || !amount || !note) return;

  const vndAmount = Math.max(0, Number(state.wallet.remaining || 0));
  const pending = Math.max(0, Number(state.wallet.pendingConversion || 0));

  card.classList.remove('is-hidden');
  amount.textContent = vndAmount.toLocaleString('vi-VN');

  if (vndAmount > 0) {
    badge.className = 'wallet-currency-badge ready';
    badge.textContent = contentTextGlobal('walletBadgeReady', 'Khả dụng');
    note.textContent = pending > 0
      ? `${contentTextGlobal('walletNotePendingPrefix', 'Đang chờ duyệt quy đổi thêm')} ${formatCurrencyBySymbol(pending, 'VND')}`
      : contentTextGlobal('walletNoteReady', 'Đang chờ xác nhận quy đổi từ hệ thống');
    return;
  }

  if (pending > 0) {
    badge.className = 'wallet-currency-badge waiting';
    badge.textContent = contentTextGlobal('walletBadgeWaiting', 'Chờ duyệt');
    note.textContent = `${contentTextGlobal('walletNoteCurrencyPendingPrefix', 'USD/NDT đang duyệt, sẽ tự cộng')} ${formatCurrencyBySymbol(pending, 'VND')}`;
    return;
  }

  badge.className = 'wallet-currency-badge locked';
  badge.textContent = contentTextGlobal('walletBadgeEmpty', 'Ví trống');
  note.textContent = contentTextGlobal('walletNoteEmpty', 'Mở hộp có thưởng tiền để cộng vào ví VND');
}

function pushGameSystemNotice(title, message) {
  const feed = document.getElementById('gameFloatingFeed');
  if (!feed) return;
  const now = new Date();
  const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const el = document.createElement('div');
  el.className = 'home-feed-item';
  el.innerHTML = `<div class="home-feed-icon" aria-hidden="true"><span class="home-feed-glyph">💰</span></div><div class="home-feed-body"><div class="home-feed-title">${escapeHtml(title || 'Cập nhật ví')}</div><div class="home-feed-sub">${escapeHtml(message || '')}</div><div class="home-feed-time">${time}</div></div>`;
  requestAnimationFrame(() => {
    if (!feed.isConnected) return;
    feed.appendChild(el);
  });
  while (feed.children.length > 3) {
    feed.removeChild(feed.firstElementChild);
  }
  setTimeout(() => {
    if (el.parentNode) el.remove();
  }, 6200);
}

function updateCurrencyUI() {
  const cur = state.sessionCurrency || 'VND';
  // Nav currency badge
  const badge = document.getElementById('navCurrBadge');
  if (badge) {
    if (cur !== 'VND') {
      badge.textContent = cur === 'USD' ? '$ USD' : '¥ NDT';
      badge.className = 'nav-curr-badge ' + (cur === 'USD' ? 'cur-usd' : 'cur-ndt');
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }
  // Withdrawal currency labels
  const withCurrLabel = document.getElementById('withCurrLabel');
  if (withCurrLabel) withCurrLabel.textContent = cur === 'USD' ? 'USD' : cur === 'NDT' ? 'NDT' : 'VNĐ';
  const withCurrUnit = document.getElementById('withCurrUnit');
  if (withCurrUnit) withCurrUnit.textContent = `(${cur === 'USD' ? 'USD' : cur === 'NDT' ? 'NDT' : 'VNĐ'})`;
}

/* ========== VietQR Integration ========== */
const vietqrState = { banks: [], loaded: false };

async function loadVietQRBanks() {
  if (vietqrState.loaded) return vietqrState.banks;
  try {
    const res = await fetch('https://api.vietqr.io/v2/banks');
    const json = await res.json();
    if (Array.isArray(json.data)) {
      vietqrState.banks = json.data;
      vietqrState.loaded = true;
      populateBankSelect();
    }
  } catch (_) {
    // Fallback: keep empty, user can type manually
  }
  return vietqrState.banks;
}

function populateBankSelect() {
  const sel = document.getElementById('withBank');
  if (!sel || sel.tagName !== 'SELECT') return;
  const current = sel.value;
  sel.innerHTML = `<option value="">${escapeHtml(contentTextGlobal('withBankPlaceholderOption', '-- Chọn ngân hàng --'))}</option>`;
  vietqrState.banks.forEach((b) => {
    const opt = document.createElement('option');
    opt.value = b.bin;
    opt.textContent = `${b.shortName} - ${b.name}`;
    opt.dataset.shortName = b.shortName || '';
    opt.dataset.bin = b.bin || '';
    sel.appendChild(opt);
  });
  if (current) sel.value = current;
}

function getSelectedBankBin() {
  const sel = document.getElementById('withBank');
  if (!sel) return '';
  return sel.value || '';
}

function getSelectedBankName() {
  const sel = document.getElementById('withBank');
  if (!sel || !sel.selectedOptions.length) return '';
  const opt = sel.selectedOptions[0];
  return opt.dataset.shortName || opt.textContent || '';
}

function generateVietQR() {
  const bin = getSelectedBankBin();
  const accNo = (document.getElementById('withAccNo')?.value || '').trim();
  const accName = (document.getElementById('withAccName')?.value || '').trim();
  const amount = parseMoneyInputValue(document.getElementById('withAmount')?.value || '');
  const preview = document.getElementById('withQrPreview');
  const img = document.getElementById('withQrImg');
  if (!preview || !img) return;

  if (!bin || !accNo) {
    preview.style.display = 'none';
    return;
  }

  const params = new URLSearchParams();
  if (amount > 0) params.set('amount', String(amount));
  if (accName) params.set('accountName', accName);
  params.set('addInfo', `Rut tien ${state.sessionCode || ''}`);

  const url = `https://img.vietqr.io/image/${encodeURIComponent(bin)}-${encodeURIComponent(accNo)}-compact.jpg?${params.toString()}`;
  img.src = url;
  preview.style.display = 'block';
}

function formatDateTime(value) {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return d.toLocaleString('vi-VN');
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
}

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

function getSessionScopedKey(suffix) {
  return `lmbv2:${state.sessionCode || 'unknown'}:${suffix}`;
}

function saveSessionProfile(suffix, payload = {}) {
  if (!state.sessionCode) return;
  localStorage.setItem(getSessionScopedKey(suffix), JSON.stringify(payload));
}

function saveSessionCode(code) {
  state.sessionCode = String(code || '').toUpperCase();
  state.sessionStartTime = Date.now();
  state.isSessionValid = true;
  localStorage.setItem('lmbSessionCode', state.sessionCode);
  localStorage.setItem('lmbSessionStart', String(state.sessionStartTime));

  // Re-scope realtime SSE as soon as a valid game session code exists.
  // Notification runtime can start before joinSession() completes.
  if (state.chat.notificationRuntimeReady || state.chat.sseSource || state.chat.sseClient) {
    startChatSSE();
  }
}

function clearSessionCode() {
  state.sessionCode = '';
  state.isSessionValid = false;
  localStorage.removeItem('lmbSessionCode');
  localStorage.removeItem('lmbSessionStart');
  if (typeof lmbManager !== 'undefined') {
    lmbManager.clearSession();
  }
}

function isSessionExpired() {
  return Date.now() - state.sessionStartTime > state.sessionTimeout;
}

function getSessionRemainingTime() {
  return Math.max(0, state.sessionTimeout - (Date.now() - state.sessionStartTime));
}

function validateSession() {
  if (!state.sessionCode) return false;
  if (isSessionExpired()) {
    clearSessionCode();
    stopRealtimeSync();
    const gameScreen = document.getElementById('screen-game');
    const loginScreen = document.getElementById('screen-login');
    if (gameScreen) gameScreen.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
    showToast('⏰ Phiên đã hết hạn, vui lòng nhập lại mã phiên');
    return false;
  }
  return true;
}

function pushPageHistoryState(pageName) {
  try {
    window.history.pushState({ lmbPage: pageName, sessionCode: state.sessionCode || '' }, '', window.location.href);
  } catch (_) {}
}

function handleBackNavigationInSession() {
  const hub = document.getElementById('hubOv');
  const claim = document.getElementById('claimOv');
  const withModal = document.getElementById('modalOv');
  const thank = document.getElementById('thankYouOv');
  if (thank && thank.classList.contains('open')) return closeThankYou();
  if (claim && claim.classList.contains('open')) return closeClaimModal();
  if (withModal && withModal.classList.contains('open')) return closeWith();
  if (hub && hub.classList.contains('open')) return closeHub();
  const gameScreen = document.getElementById('screen-game');
  const loginScreen = document.getElementById('screen-login');
  if (gameScreen && gameScreen.style.display !== 'none') {
    gameScreen.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
  }
}

function loadSessionProfile(suffix, fallback = {}) {
  if (!state.sessionCode) return fallback;
  try {
    const raw = localStorage.getItem(getSessionScopedKey(suffix));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch (_) {
    return fallback;
  }
}

function ensureLoadingOverlay() {
  let ov = document.getElementById('lmbLoadingOv');
  if (ov) return ov;
  ov = document.createElement('div');
  ov.id = 'lmbLoadingOv';
  ov.className = 'modal-ov';
  ov.innerHTML = `
    <div class="mbox" style="width:min(420px,92vw)">
      <div class="mbody" style="text-align:center;padding:24px;">
        <div style="font-size:34px;margin-bottom:10px">⏳</div>
        <div id="lmbLoadingText" class="mttl" style="font-size:16px;">Đang xử lý...</div>
      </div>
    </div>
  `;
  document.body.appendChild(ov);
  return ov;
}

function showLoadingOverlay(message) {
  const ov = ensureLoadingOverlay();
  const txt = document.getElementById('lmbLoadingText');
  if (txt && message) txt.textContent = message;
  ov.classList.add('open');
}

function hideLoadingOverlay() {
  const ov = document.getElementById('lmbLoadingOv');
  if (ov) ov.classList.remove('open');
}

async function withLoadingOverlay(message, task) {
  showLoadingOverlay(message);
  try {
    return await task();
  } finally {
    hideLoadingOverlay();
  }
}

function withTimeout(taskPromise, timeoutMs, timeoutMessage) {
  const ms = Math.max(1000, Number(timeoutMs) || 15000);
  let timer = null;
  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(timeoutMessage || 'Yeu cau bi timeout'));
    }, ms);
    Promise.resolve(taskPromise)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        if (timer) clearTimeout(timer);
      });
  });
}

// ── Floating Feed — lazy loaded from modules/lmb-floating-feed.js ──
function showWinNoti() {}
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function buildNamePool() { return []; }
function buildPrizePool() { return []; }
function randomFeedDelayMs() { return 3000; }
function maskName() { return '********ng'; }
function randomTickerAgo() { return '1 phút trước'; }
function parseToEpochMs() { return 0; }
function formatFloatingAgoFromTimestamp() { return ''; }
function normalizeFloatingWinnerEvent() { return null; }
function getNextRealFloatingWinner() { return null; }
function refreshRealFloatingWinnerFeed() {}
function startRealFloatingFeedRefreshTimer() {}
function stopRealFloatingFeedRefreshTimer() {
  if (state.floatingRealFeedRefreshTimer) {
    clearTimeout(state.floatingRealFeedRefreshTimer);
    state.floatingRealFeedRefreshTimer = null;
  }
}
function getFloatingPrizePool() { return []; }
function normalizeFloatingMessageItem() { return { text: '', icon: '', image: '' }; }
function getFloatingMessageTemplates() { return []; }
function buildTickerHtml() { return ''; }
function buildHomeFeedNotice() { return {}; }
function pushHomeFloatingNotice() {}
function initHomeFloatingFeed() {}
function pushGameFloatingNotice() {}
function initGameFloatingFeed() {}
function renderWinnerTicker() {}
function initWinnerTicker() {}
function loadFloatingConfig() { return Promise.resolve(); }
function applyFloatingPosition() {}
function scheduleNoti() {}
function showThankYouPage(result = {}) {
  const title = document.getElementById('thankYouTitle');
  const sub = document.getElementById('thankYouSub');
  const method = document.getElementById('thankYouMethod');
  const name = document.getElementById('thankYouName');
  const phone = document.getElementById('thankYouPhone');
  const detail = document.getElementById('thankYouDetail');
  if (title) title.textContent = result.title || state.gameSettings.thankyouTitle || 'Cảm ơn bạn!';
  if (sub) sub.textContent = result.subtitle || state.gameSettings.thankyouMessage || 'Yêu cầu đã được hệ thống ghi nhận';
  if (method) method.textContent = `Phương thức: ${result.method || '--'}`;
  if (name) name.textContent = `Người nhận: ${result.playerName || '--'}`;
  if (phone) phone.textContent = `Điện thoại: ${result.playerPhone || '--'}`;
  if (detail) detail.textContent = `Chi tiết: ${result.detail || '--'}`;
  const ov = document.getElementById('thankYouOv');
  if (ov) ov.classList.add('open');
  pushPageHistoryState('thank-you');
}

function closeThankYou() {
  const ov = document.getElementById('thankYouOv');
  if (ov) ov.classList.remove('open');
}

async function getHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...extra };
  const fp = _cachedApiFingerprint || await ensureApiFingerprintCached();
  if (fp) {
    headers['X-Browser-Fingerprint'] = fp.fingerprintHash;
    headers['X-Fingerprint-Data'] = fp.browserFingerprint;
  }
  return headers;
}

async function apiJson(url, options = {}) {
  const t0 = performance.now();
  const timeoutMs = Math.max(3000, Number(options.timeoutMs) || 12000);
  const method = String(options.method || 'GET').toUpperCase();
  const isGet = method === 'GET';
  const cacheKey = isGet ? normalizeApiGetCacheKey(url) : '';
  const cacheTtlMs = isMobileLiteEffects() ? 1200 : 550;

  if (isGet && cacheKey) {
    const entry = LMB_API_GET_BURST_CACHE.get(cacheKey);
    if (entry?.inFlight) return entry.inFlight;
    if (entry?.value && (Date.now() - Number(entry.ts || 0) <= cacheTtlMs)) {
      return entry.value;
    }
  }

  const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  const fetchOptions = {
    ...options,
    method,
    cache: 'no-store',
    headers: await getHeaders(options.headers || {})
  };
  delete fetchOptions.timeoutMs;

  let timeoutId = null;
  if (controller) {
    fetchOptions.signal = controller.signal;
    timeoutId = setTimeout(() => {
      try { controller.abort(); } catch (_) {}
    }, timeoutMs);
  }

  const fetchPromise = (async () => {
    let res;
    try {
      res = await fetch(url, fetchOptions);
    } catch (err) {
      if (err && err.name === 'AbortError') {
        throw new Error('Kết nối máy chủ quá lâu. Vui lòng thử lại.');
      }
      throw err;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }

    const data = await res.json().catch(() => ({ success: false, message: 'Dữ liệu phản hồi không hợp lệ' }));
    if (LMB_DEV_MONITOR.enabled) {
      const ms = Math.round(performance.now() - t0);
      console.log('[LMB][api] %s %sms %s', url, ms, res.status);
    }
    if (!res.ok || data.success === false) {
      const apiErr = new Error(data.message || `Request failed (${res.status})`);
      apiErr.code = data.code || null;
      apiErr.data = data;
      throw apiErr;
    }
    if (isGet && cacheKey) {
      LMB_API_GET_BURST_CACHE.set(cacheKey, {
        value: data,
        ts: Date.now(),
        inFlight: null
      });
    }
    return data;
  })();

  if (isGet && cacheKey) {
    LMB_API_GET_BURST_CACHE.set(cacheKey, {
      value: null,
      ts: Date.now(),
      inFlight: fetchPromise
    });
  }

  try {
    return await fetchPromise;
  } catch (err) {
    if (isGet && cacheKey) {
      LMB_API_GET_BURST_CACHE.delete(cacheKey);
    }
    throw err;
  }
}

function invalidateGetBurstCache(url) {
  const key = normalizeApiGetCacheKey(url);
  if (!key) return;
  LMB_API_GET_BURST_CACHE.delete(key);
}

function invalidateSessionEconomyBurstCache(sessionCode) {
  const code = String(sessionCode || '').trim();
  if (!code) return;
  const encoded = encodeURIComponent(code);
  invalidateGetBurstCache(`/api/lucky-mystery-box/${encoded}/wallet`);
  invalidateGetBurstCache(`/api/lucky-mystery-box/${encoded}/transactions`);
  invalidateGetBurstCache(`/api/lucky-mystery-box/${encoded}/player-inventory`);
  invalidateGetBurstCache(`/api/lucky-mystery-box/session?code=${encoded}`);
}

function getSessionCodeFromUrl() {
  const p = new URLSearchParams(window.location.search);
  return (p.get('code') || '').toUpperCase();
}

async function tryAutoEnterFromUrl(reason = 'unknown') {
  const code = getSessionCodeFromUrl();
  if (!code) return false;
  if (state.urlAutoEnterDone || state.urlAutoEnterRunning) return false;
  if (state.urlAutoEnterAttempts >= state.urlAutoEnterMaxAttempts) {
    clearAutoEnterRetryTimers();
    return false;
  }
  if (state.sessionCode && state.sessionCode === code) {
    state.urlAutoEnterDone = true;
    return true;
  }

  state.urlAutoEnterAttempts += 1;
  state.urlAutoEnterRunning = true;
  try {
    const input = getHomepageSessionInput();
    if (input) {
      input.value = code;
      syncLoginStartButtonState();
    }

    await startGame(code);
    if (state.sessionCode === code) {
      state.urlAutoEnterDone = true;
      clearAutoEnterRetryTimers();
      return true;
    }
    return false;
  } finally {
    state.urlAutoEnterRunning = false;
  }
}

function clearAutoEnterRetryTimers() {
  const ids = Array.isArray(state.autoEnterRetryTimerIds) ? state.autoEnterRetryTimerIds : [];
  ids.forEach((id) => {
    try { clearTimeout(id); } catch (_) {}
  });
  state.autoEnterRetryTimerIds = [];
}

function scheduleAutoEnterRetries(reason = 'schedule') {
  const code = getSessionCodeFromUrl();
  if (!code || state.urlAutoEnterDone || state.sessionCode === code || state.urlAutoEnterAttempts >= state.urlAutoEnterMaxAttempts) return;

  clearAutoEnterRetryTimers();
  const delays = [0, 1200];
  state.autoEnterRetryTimerIds = delays.map((ms, idx) => setTimeout(() => {
    if (state.urlAutoEnterDone || state.sessionCode === code || state.urlAutoEnterAttempts >= state.urlAutoEnterMaxAttempts) {
      clearAutoEnterRetryTimers();
      return;
    }
    tryAutoEnterFromUrl(`${reason}-${idx + 1}`).catch(() => {});
  }, ms));
}

function withNoCache(url) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}_ts=${Date.now()}`;
}

function setFavicon(url) {
  if (!url) return;
  let link = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
}

function applyLogoToPlayerUI(logo) {
  const url = logo && logo.url ? String(logo.url).trim() : '';
  if (!url) return;

  document.querySelectorAll('.nav-icon-box img, .game-hero-logo img').forEach((img) => {
    img.src = url;
  });
  setFavicon(url);
}

function getAdvancedContentTextMap(content) {
  const map = content && content.advancedTexts;
  if (!map || typeof map !== 'object' || Array.isArray(map)) return {};
  return map;
}

function contentText(content, key, fallback) {
  const map = getAdvancedContentTextMap(content);
  const advancedValue = map[key];
  const directValue = content ? content[key] : undefined;
  const raw = advancedValue !== undefined ? advancedValue : directValue;
  const normalized = String(raw ?? '').trim();
  return normalized || fallback;
}

function contentTextGlobal(key, fallback) {
  const content = (window.__lmbUiSettings && window.__lmbUiSettings.content) || {};
  return contentText(content, key, fallback);
}

function setElementText(el, text) {
  if (!el || text === undefined || text === null) return;
  el.textContent = String(text);
}

function setButtonTextKeepIcon(buttonEl, text) {
  if (!buttonEl || !String(text || '').trim()) return;
  const icon = buttonEl.querySelector('svg, i, span:first-child');
  const label = buttonEl.querySelector('span:last-child');
  if (label && label !== icon) {
    label.textContent = String(text);
    return;
  }
  if (icon) {
    const textNode = Array.from(buttonEl.childNodes).find((n) => n.nodeType === Node.TEXT_NODE && String(n.textContent || '').trim());
    if (textNode) {
      textNode.textContent = ` ${text}`;
    } else {
      buttonEl.appendChild(document.createTextNode(` ${text}`));
    }
    return;
  }
  buttonEl.textContent = String(text);
}

function applyStaticContentTextOverrides(content) {
  const c = content || {};

  setElementText(document.getElementById('homeThemeLabel'), contentText(c, 'homeThemeLabel', 'Giao diện homepage'));
  const homeSelect = document.getElementById('homepageThemeSelect');
  if (homeSelect) homeSelect.setAttribute('aria-label', contentText(c, 'homeThemeSelectAriaLabel', 'Chọn giao diện homepage'));
  const homeFeed = document.getElementById('homeFloatingFeed');
  if (homeFeed) homeFeed.setAttribute('aria-label', contentText(c, 'homeFloatingFeedAriaLabel', 'Thông báo trúng thưởng gần đây'));

  setButtonTextKeepIcon(document.getElementById('navHomeBtn'), contentText(c, 'navHomeButton', 'Về trang chủ'));
  const gameFeed = document.getElementById('gameFloatingFeed');
  if (gameFeed) gameFeed.setAttribute('aria-label', contentText(c, 'gameFloatingFeedAriaLabel', 'Thông báo nhận thưởng gần đây'));

  setElementText(document.getElementById('walletTotalLabel'), contentText(c, 'walletTotalLabel', 'Ví điện tử Việt Nam'));
  setElementText(document.getElementById('walletWithdrawHint'), contentText(c, 'walletWithdrawHint', 'Hãy liên hệ CSKH để được giúp đỡ.'));
  setElementText(document.getElementById('walletTrustLabel'), contentText(c, 'walletTrustLabel', 'Tín nhiệm'));
  setButtonTextKeepIcon(document.getElementById('walletOpenSessionBtn'), contentText(c, 'walletOpenSessionButton', 'Mở ví phiên'));
  setButtonTextKeepIcon(document.getElementById('walletWithdrawBtn'), contentText(c, 'walletWithdrawButton', 'Rút tiền'));

  setElementText(document.getElementById('withTabHistoryText'), contentText(c, 'withTabHistory', 'Lịch sử rút tiền'));
  setElementText(document.getElementById('withTabCreateText'), contentText(c, 'withTabCreate', 'Tạo lệnh mới'));
  setElementText(document.getElementById('withAvailableBalanceLabel'), contentText(c, 'withAvailableBalanceLabel', 'Số dư khả dụng'));
  setElementText(document.getElementById('withTrustScoreLabel'), contentText(c, 'withTrustScoreLabel', 'Điểm tín nhiệm'));
  setElementText(document.getElementById('withCloseBtn'), contentText(c, 'withCloseButton', 'Đóng'));

  setElementText(document.getElementById('winCongratsBadge'), contentText(c, 'winCongratsBadge', '✨ CHÚC MỪNG!'));
  setButtonTextKeepIcon(document.getElementById('winShareBtn'), contentText(c, 'winShareButton', 'Chia sẻ nhanh'));
  setButtonTextKeepIcon(document.getElementById('winDownloadBtn'), contentText(c, 'winDownloadButton', 'Tải ảnh phần quà'));
  setButtonTextKeepIcon(document.getElementById('winCaptureBtn'), contentText(c, 'winCaptureButton', 'Chụp ảnh kết quả'));
  setElementText(document.getElementById('winThanksText'), contentText(c, 'winThanksText', 'Cảm ơn Quý khách đã tham gia trò chơi!'));

  setElementText(document.getElementById('approvalProcessingLabel'), contentText(c, 'approvalProcessingLabel', 'Đang xử lý'));
  setElementText(document.getElementById('approvalTimeLeftLabel'), contentText(c, 'approvalTimeLeftLabel', '⏱ Thời gian còn lại'));
  setElementText(document.getElementById('approvalTimeHint'), contentText(c, 'approvalTimeHint', 'Giữ trang mở để nhận thông báo'));
  setElementText(document.getElementById('approvalPrizeTag'), contentText(c, 'approvalPrizeTag', 'Phần thưởng VIP'));
  setElementText(document.getElementById('approvalProgressLabel'), contentText(c, 'approvalProgressLabel', 'Tiến trình xử lý'));
  setElementText(document.getElementById('approvalBotName'), contentText(c, 'approvalBotName', 'AI Nhắc nhở'));
  setElementText(document.getElementById('approvalReminderTag'), contentText(c, 'approvalReminderTag', 'NHẮC NHỞ'));
  setElementText(document.getElementById('approvalConnText'), contentText(c, 'approvalConnText', 'Kết nối thành công · Đang chờ phản hồi từ admin'));
  setElementText(document.getElementById('awSupportButton'), `💬 ${contentText(c, 'approvalSupportButton', 'Liên hệ CSKH')}`);
  setElementText(document.getElementById('approvalAcceptBtn'), `💰 ${contentText(c, 'approvalAcceptButton', 'Quy đổi tiền')}`);
  setElementText(document.getElementById('approvalDeclineBtn'), `❌ ${contentText(c, 'approvalDeclineButton', 'Từ chối')}`);
  setElementText(document.getElementById('awNote'), contentText(c, 'approvalFooterNote', 'Đang chờ phản hồi từ admin... (thường < 5 phút) · Kết quả minh bạch · Không lưu thông tin cá nhân'));

  setElementText(document.getElementById('hubTitle'), contentText(c, 'hubTitleDefault', 'Quản lý phiên'));
  setElementText(document.getElementById('hubSubtitle'), contentText(c, 'hubSubtitleDefault', 'Các chức năng đầy đủ theo mã phiên'));
  setElementText(document.getElementById('hubSessionCodeLabel'), contentText(c, 'hubSessionCodeLabel', 'Mã phiên'));
  setElementText(document.getElementById('hubRefreshInventoryBtn'), contentText(c, 'hubRefreshButton', 'Làm mới'));
  setElementText(document.getElementById('hubRefreshExchangeBtn'), contentText(c, 'hubRefreshButton', 'Làm mới'));
  setElementText(document.getElementById('hubExchangeDesc'), contentText(c, 'hubExchangeDesc', 'Đổi quà/nhận quà theo từng hộp đã mở'));
  setElementText(document.getElementById('hubWalletBalanceLabel'), contentText(c, 'hubWalletBalanceLabel', 'Số dư ví'));
  setElementText(document.getElementById('hubPendingConversionLabel'), contentText(c, 'hubPendingConversionLabel', 'Đang chờ duyệt quy đổi'));
  setElementText(document.getElementById('hubTrustScoreLabel'), contentText(c, 'hubTrustScoreLabel', 'Điểm tín nhiệm'));
  setElementText(document.getElementById('hubSearchButton'), contentText(c, 'hubSearchButton', 'Tra cứu'));
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = contentText(c, 'hubSearchPlaceholder', 'Nhập mã phiên cần tra cứu...');

  setElementText(document.getElementById('sessionDetailTitle'), contentText(c, 'sessionDetailTitleDefault', 'Chi tiết phiên chơi'));
  setElementText(document.getElementById('sessionDetailSub'), contentText(c, 'sessionDetailSubDefault', 'Tổng hợp đầy đủ hộp quà, ví, giao dịch và trạng thái xử lý'));
  setElementText(document.getElementById('sessionDetailLoadingText'), contentText(c, 'sessionDetailLoading', 'Đang tải dữ liệu phiên...'));

  setElementText(document.getElementById('thankYouCloseBtn'), contentText(c, 'thankYouCloseButton', 'Đóng'));
  setElementText(document.getElementById('thankYouViewTxBtn'), contentText(c, 'thankYouViewTransactionsButton', 'Xem giao dịch'));
}

function applyContentToPlayerUI(content) {
  const c = content || {};

  applyStaticContentTextOverrides(c);
  // If text map is already loaded (on settings reload), re-translate immediately
  if (window.__manualTextMap && Object.keys(window.__manualTextMap).length > 0) {
    applyManualTextMapToDOM(window.__manualTextMap);
  }

  const ensureSingleNavBrandName = (name) => {
    const navBrand = document.querySelector('.nav-brand');
    if (!navBrand) return;

    let navBrandName = navBrand.querySelector('.nav-brand-name');
    if (!navBrandName) {
      navBrandName = document.createElement('span');
      navBrandName.className = 'nav-brand-name';
      const iconBox = navBrand.querySelector('.nav-icon-box');
      if (iconBox && iconBox.nextSibling) {
        navBrand.insertBefore(navBrandName, iconBox.nextSibling);
      } else {
        navBrand.appendChild(navBrandName);
      }
    }

    navBrandName.textContent = name || '';

    // Keep only icon + one brand label to avoid duplicated text in nav-brand.
    Array.from(navBrand.children).forEach((el) => {
      if (el.classList.contains('nav-icon-box')) return;
      if (el === navBrandName) return;
      el.remove();
    });

    Array.from(navBrand.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE && String(n.textContent || '').trim())
      .forEach((n) => { n.textContent = ''; });
  };

  const brandName = String(c.brandName || '').trim();
  ensureSingleNavBrandName(brandName);

  const headTitle = String(c.headTitle || '').trim();
  if (headTitle) {
    document.title = headTitle;
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) ogTitleMeta.setAttribute('content', headTitle);
  }

  const heroTitle = String(c.heroTitle || '').trim();
  if (heroTitle) {
    const el = document.querySelector('.game-hero-title');
    if (el) el.textContent = heroTitle;
  }

  const heroSubtitle = String(c.heroSubtitle || '').trim();
  if (heroSubtitle) {
    const el = document.getElementById('gameHeroSubtitle');
    if (el) {
      el.dataset.fullText = heroSubtitle;
      el.textContent = heroSubtitle;
    }
  }

  const heroTitleSize = parseInt(c.heroTitleSize, 10);
  const heroSubtitleSize = parseInt(c.heroSubtitleSize, 10);
  if (heroTitleSize > 0 || heroSubtitleSize > 0) {
    let heroStyle = document.getElementById('lmbHeroSizeStyle');
    if (!heroStyle) {
      heroStyle = document.createElement('style');
      heroStyle.id = 'lmbHeroSizeStyle';
      document.head.appendChild(heroStyle);
    }
    const heroRules = [];
    if (heroTitleSize > 0) heroRules.push(`.game-hero-title{font-size:${heroTitleSize}px!important}`);
    if (heroSubtitleSize > 0) heroRules.push(`.game-hero-subtitle{font-size:${heroSubtitleSize}px!important}`);
    heroStyle.textContent = heroRules.join('\n');
  }
}

function applyCustomizationToHomepageFrame(doc, ui) {
  if (!doc || !ui) return;
  const c = ui.content || {};
  const l = ui.logo || {};

  const logoUrl = String(l.url || '').trim();
  if (logoUrl) {
    doc.querySelectorAll('.nav-logo img, .logo img, .brand img, .hero-logo img, img[alt*="logo" i]').forEach((img) => {
      img.src = logoUrl;
    });
  }

  const sessionInput = doc.getElementById('sessionInput')
    || doc.getElementById('sessionCode')
    || doc.querySelector('input[type="text"]');
  if (sessionInput && c.loginPlaceholder) {
    sessionInput.placeholder = c.loginPlaceholder;
  }

  const startBtn = doc.getElementById('startBtn')
    || Array.from(doc.querySelectorAll('button')).find((btn) => /bắt\s*đầu|start/i.test(btn.textContent || ''));
  if (startBtn && c.loginButton) {
    startBtn.textContent = c.loginButton;
  }

  const titleTarget = doc.querySelector('.card-title, .nhp-card-title, .hero-title, h1');
  if (titleTarget) {
    const titleText = String(c.mainTitle || c.loginTitle || '').trim();
    if (titleText) titleTarget.textContent = titleText;
  }

  const subtitleTarget = doc.querySelector('.card-subtitle, .nhp-card-subtitle, .hero-subtitle, .sub-title, p');
  if (subtitleTarget) {
    const subText = String(c.mainDescription || '').trim();
    if (subText) subtitleTarget.textContent = subText;
  }

  const customHtml = String(c.customText || '').trim();
  let customBlock = doc.getElementById('lmbCustomTextBlock');
  if (customHtml && sessionInput) {
    if (!customBlock) {
      customBlock = doc.createElement('div');
      customBlock.id = 'lmbCustomTextBlock';
      customBlock.style.cssText = 'margin-top:10px;font-size:13px;line-height:1.5;opacity:.95;';
      const host = sessionInput.parentElement || doc.body;
      host.appendChild(customBlock);
    }
    customBlock.innerHTML = customHtml;
    customBlock.style.display = 'block';
  } else if (customBlock) {
    customBlock.style.display = 'none';
    customBlock.innerHTML = '';
  }
  // Apply active language to the frame if map is ready (called after settings reload)
  if (window.__manualTextMap && Object.keys(window.__manualTextMap).length > 0) {
    applyManualTextMapToHomepageFrame(window.__manualTextMap);
  }
}

/* ========================================================
   COMPREHENSIVE SETTINGS APPLICATION — applies ALL admin
   customization settings to the player-facing UI.
   ======================================================== */

function applySeoSettings(seo) {
  if (!seo) return;
  if (seo.pageTitle) document.title = seo.pageTitle;
  const setMeta = (sel, attr, val) => {
    if (!val) return;
    let el = document.querySelector(sel);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr === 'content' ? 'name' : 'property', sel.match(/\[(?:name|property)="([^"]+)"\]/)?.[1] || ''); document.head.appendChild(el); }
    el.setAttribute('content', val);
  };
  setMeta('meta[name="description"]', 'content', seo.metaDescription);
  setMeta('meta[name="keywords"]', 'content', seo.keywords);
  setMeta('meta[property="og:image"]', 'content', seo.ogImage);
  setMeta('meta[property="og:title"]', 'content', seo.pageTitle);
  setMeta('meta[property="og:description"]', 'content', seo.metaDescription);
  if (seo.favicon) setFavicon(seo.favicon);
}

const _PLAYER_GFONTS = {
  'Poppins':'Poppins:wght@300;400;500;600;700;800',
  'Inter':'Inter:wght@300;400;500;600;700',
  'DM Sans':'DM+Sans:wght@300;400;500;600;700',
  'Outfit':'Outfit:wght@300;400;500;600;700;800',
  'Plus Jakarta Sans':'Plus+Jakarta+Sans:wght@300;400;500;600;700;800',
  'Figtree':'Figtree:wght@300;400;500;600;700;800',
  'Sora':'Sora:wght@300;400;500;600;700;800',
  'Nunito':'Nunito:wght@300;400;500;600;700;800;900',
  'Nunito Sans':'Nunito+Sans:wght@300;400;500;600;700;800',
  'Open Sans':'Open+Sans:wght@300;400;500;600;700',
  'Roboto':'Roboto:wght@300;400;500;700',
  'Lato':'Lato:wght@300;400;700',
  'Montserrat':'Montserrat:wght@300;400;500;600;700;800',
  'Ubuntu':'Ubuntu:wght@300;400;500;700',
  'Quicksand':'Quicksand:wght@300;400;500;600;700',
  'Be Vietnam Pro':'Be+Vietnam+Pro:wght@300;400;500;600;700;800',
  'Source Sans 3':'Source+Sans+3:wght@300;400;500;600;700',
  'Lexend':'Lexend:wght@300;400;500;600;700;800',
  'Raleway':'Raleway:wght@300;400;500;600;700;800',
  'Josefin Sans':'Josefin+Sans:wght@300;400;500;600;700',
  'Exo 2':'Exo+2:wght@300;400;500;600;700;800',
  'Orbitron':'Orbitron:wght@400;500;600;700;800',
  'Space Grotesk':'Space+Grotesk:wght@300;400;500;600;700',
  'Cinzel':'Cinzel:wght@400;500;600;700',
  'Bebas Neue':'Bebas+Neue',
  'Playfair Display':'Playfair+Display:wght@400;500;600;700;800',
  'Merriweather':'Merriweather:wght@300;400;700',
  'EB Garamond':'EB+Garamond:wght@400;500;600;700',
  'Libre Baskerville':'Libre+Baskerville:wght@400;700',
  'Dancing Script':'Dancing+Script:wght@400;500;600;700',
  'Pacifico':'Pacifico',
  'Caveat':'Caveat:wght@400;500;600;700',
  'Kaushan Script':'Kaushan+Script',
  'JetBrains Mono':'JetBrains+Mono:wght@300;400;500;600;700',
  'Fira Code':'Fira+Code:wght@300;400;500;600;700',
  'Source Code Pro':'Source+Code+Pro:wght@300;400;500;600;700'
};

function loadGoogleFontForPlayer(name) {
  if (!name) return;
  const slug = _PLAYER_GFONTS[name];
  if (!slug) return;
  const id = 'pgf_' + name.replace(/[^a-z0-9]/gi, '-');
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=' + slug + '&display=swap';
  document.head.appendChild(link);
}

function applyAppearanceSettings(app) {
  if (!app) return;
  const root = document.documentElement;
  const s = (k, v) => { if (v !== undefined && v !== '') root.style.setProperty(k, v); };

  if (app.primaryColor) {
    s('--lmb-primary', app.primaryColor);
    s('--purple', app.primaryColor);
  }
  s('--lmb-nav-icon-bg', '#ffffff');
  if (app.accentColor) s('--lmb-accent', app.accentColor);
  if (app.fontFamily) s('--lmb-font', app.fontFamily);
  if (app.fontSize) s('--lmb-font-size', app.fontSize + 'px');
  if (app.borderRadius !== undefined && app.borderRadius !== '') s('--lmb-radius', app.borderRadius + 'px');
  if (app.cardBg) s('--lmb-card-bg', app.cardBg);
  if (app.cardBorderColor) s('--lmb-card-border', app.cardBorderColor);
  if (app.boxGlowColor) s('--lmb-box-glow', app.boxGlowColor);
  if (app.animationSpeed) s('--lmb-anim-speed', app.animationSpeed === 'fast' ? '0.5' : app.animationSpeed === 'slow' ? '2' : '1');

  // Background
  const aurora = document.querySelector('.aurora');
  if (app.bgType === 'solid' && app.bgColor1) {
    document.body.style.background = app.bgColor1;
    if (aurora) aurora.style.display = 'none';
  } else if (app.bgType === 'gradient' && app.bgColor1) {
    document.body.style.background = `linear-gradient(135deg, ${app.bgColor1}, ${app.bgColor2 || app.bgColor1}, ${app.bgColor3 || app.bgColor1})`;
    if (aurora) aurora.style.display = 'none';
  } else if (app.bgType === 'image' && app.bgImage) {
    document.body.style.background = `url("${app.bgImage}") center/cover no-repeat fixed`;
    if (aurora) aurora.style.opacity = String((app.bgOverlayOpacity || 40) / 100);
  }
  // aurora (default) — leave as-is

  // Dark mode class
  if (app.darkMode === true) document.body.classList.add('lmb-dark');
  else document.body.classList.remove('lmb-dark');

  // Inject dynamic CSS override stylesheet
  let styleEl = document.getElementById('lmbAppearanceStyle');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'lmbAppearanceStyle';
    document.head.appendChild(styleEl);
  }
  const rules = [];
  if (app.fontFamily) {
    loadGoogleFontForPlayer(app.fontFamily);
    rules.push(`body{font-family:'${app.fontFamily}',sans-serif!important}button,input,textarea,select,label{font-family:'${app.fontFamily}',sans-serif!important}`);
  }
  if (app.fontSize) rules.push(`body{font-size:${app.fontSize}px}`);
  if (app.borderRadius !== undefined && app.borderRadius !== '') {
    const r = app.borderRadius + 'px';
    rules.push(`.gcard,.mbox,.hub-box,.cpanel,.wov-modal,.celebrate-card,.aws-card,.toast{border-radius:${r}!important}`);
  }
  if (app.primaryColor) {
    rules.push(`.bsub,.chat-pre-btn,.wbtn.doi{background:linear-gradient(135deg,${app.primaryColor},${adjustColor(app.primaryColor, -20)})!important}`);
    rules.push(`.cfab{background:linear-gradient(135deg,${adjustColor(app.primaryColor, -15)},${app.primaryColor})!important}`);
  }
  if (app.navStyle === 'solid') rules.push(`.g-nav{background:rgba(15,10,40,.95)!important;backdrop-filter:none!important}`);
  else if (app.navStyle === 'transparent') rules.push(`.g-nav{background:transparent!important;backdrop-filter:none!important;box-shadow:none!important}`);
  if (app.buttonStyle === 'flat') rules.push(`.bsub,.wbtn,.chat-pre-btn{background:var(--lmb-primary,#7c3aed)!important;box-shadow:none!important}`);
  else if (app.buttonStyle === 'outline') rules.push(`.bsub,.wbtn,.chat-pre-btn{background:transparent!important;border:2px solid var(--lmb-primary,#7c3aed)!important;color:var(--lmb-primary,#7c3aed)!important}`);
  if (app.popupStyle === 'solid') rules.push(`.wov-modal,.celebrate-card{backdrop-filter:none!important}`);
  if (app.cardBg) rules.push(`.wallet-panel,.wi{background:${app.cardBg}!important}`);
  if (app.cardBorderColor) rules.push(`.wallet-panel{border-color:${app.cardBorderColor}!important}`);
  styleEl.textContent = rules.join('\n');

  let customCssEl = document.getElementById('lmbAppearanceCustomCss');
  if (!customCssEl) {
    customCssEl = document.createElement('style');
    customCssEl.id = 'lmbAppearanceCustomCss';
    document.head.appendChild(customCssEl);
  }
  customCssEl.textContent = String(app.playerCustomCss || '');

  const oldCustomJs = document.getElementById('lmbAppearanceCustomJs');
  if (oldCustomJs) oldCustomJs.remove();
  const customJs = String(app.playerCustomJs || '').trim();
  if (customJs) {
    const customJsEl = document.createElement('script');
    customJsEl.id = 'lmbAppearanceCustomJs';
    customJsEl.textContent = customJs;
    document.head.appendChild(customJsEl);
  }
}

function adjustColor(hex, amount) {
  if (!hex) return '#000000';
  let c = String(hex).replace('#', '');
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  const num = parseInt(c, 16);
  let r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  let b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function applyChatSettings(chatCfg) {
  if (!chatCfg) return;
  const titleEl = document.querySelector('.ch-title');
  const onlineEl = document.querySelector('.ch-online');
  const fabEl = document.querySelector('.cfab');
  const fabBtn = document.getElementById('chatFabBtn');
  const fabAvatar = document.querySelector('.cfab-avatar');
  const fabIcon = document.getElementById('chatFabIcon');
  const headerAvatar = document.querySelector('.ch-av img');
  const inputEl = document.getElementById('cinp');
  const panel = document.getElementById('cpanel');

  if (chatCfg.headerTitle && titleEl) titleEl.textContent = chatCfg.headerTitle;
  if (chatCfg.headerSubtitle && onlineEl) onlineEl.textContent = chatCfg.headerSubtitle;
  const fallbackAvatar = fabAvatar ? String(fabAvatar.getAttribute('src') || '').trim() : '';
  const avatarSrc = String(chatCfg.adminAvatar || fallbackAvatar || '').trim();
  if (avatarSrc) {
    if (fabAvatar) fabAvatar.src = avatarSrc;
    if (headerAvatar) headerAvatar.src = avatarSrc;
  }
  const bubbleIcon = String(chatCfg.bubbleIcon || '💬').trim();
  if (fabIcon) fabIcon.textContent = bubbleIcon || '💬';
  const shouldUseAvatar = Boolean(avatarSrc);
  if (fabEl) {
    if (shouldUseAvatar) fabEl.classList.remove('use-icon');
    else fabEl.classList.add('use-icon');
  }
  if (fabAvatar) {
    fabAvatar.onerror = () => {
      if (fabEl) fabEl.classList.add('use-icon');
    };
  }
  if (fabBtn) {
    const fabHintText = 'Bấm vào để sẵn sàng liên hệ CSKH';
    fabBtn.setAttribute('aria-label', fabHintText);
    fabBtn.setAttribute('title', fabHintText);
  }
  if (chatCfg.placeholder && inputEl) inputEl.placeholder = chatCfg.placeholder;

  const emojiBtn = document.querySelector('.c-emoji');
  if (emojiBtn) emojiBtn.style.display = chatCfg.enableEmoji === false ? 'none' : '';
  if (Array.isArray(chatCfg.iconLibrary) && chatCfg.iconLibrary.length) {
    state.chat.iconLibrary = chatCfg.iconLibrary.map((x) => String(x || '').trim()).filter(Boolean).slice(0, 120);
  }
  initChatEmojiPicker();

  // Quick replies
  const quickContainer = document.querySelector('.cquick');
  if (quickContainer && Array.isArray(chatCfg.quickReplies) && chatCfg.quickReplies.length > 0) {
    quickContainer.innerHTML = chatCfg.quickReplies.map(text =>
      `<button class="qbtn" onclick="qChat('${String(text).replace(/'/g, "\\'")}')">${escapeHtml(text)}</button>`
    ).join('');
  }

  // Chat panel styling
  let chatStyle = document.getElementById('lmbChatStyle');
  if (!chatStyle) { chatStyle = document.createElement('style'); chatStyle.id = 'lmbChatStyle'; document.head.appendChild(chatStyle); }
  const rules = [];
  if (chatCfg.headerBgColor) rules.push(`.ch{background:${chatCfg.headerBgColor}!important}`);
  if (chatCfg.headerTextColor) rules.push(`.ch-title,.ch-online,.ch-x svg{color:${chatCfg.headerTextColor}!important;fill:${chatCfg.headerTextColor}!important}`);
  if (chatCfg.bubbleColor) rules.push(`.cfab{background:linear-gradient(135deg,${chatCfg.bubbleColor},${adjustColor(chatCfg.bubbleColor, 25)})!important;box-shadow:0 6px 24px ${chatCfg.bubbleColor}88!important}`);
  if (chatCfg.position === 'left') {
    rules.push(`.cfab{right:auto!important;left:16px!important}`);
    rules.push(`.cpanel{right:auto!important;left:0!important;border-left:none!important;border-right:1px solid #dbe4f0!important;transform:translateX(-105%)!important}`);
    rules.push(`.cpanel.open{transform:translateX(0)!important}`);
  }
  chatStyle.textContent = rules.join('\n');
}

function applyPopupSettings(popup) {
  if (!popup) return;
  state.gameSettings.popupShowConfetti = popup.showConfetti !== false;
  state.gameSettings.popupConfettiDuration = popup.confettiDuration || 3000;
  state.gameSettings.popupAutoClose = popup.autoClose === true;
  state.gameSettings.popupAutoCloseDelay = popup.autoCloseDelay || 10000;
  state.gameSettings.popupShowShareButton = popup.showShareButton === true;

  let popStyle = document.getElementById('lmbPopupStyle');
  if (!popStyle) { popStyle = document.createElement('style'); popStyle.id = 'lmbPopupStyle'; document.head.appendChild(popStyle); }
  const rules = [];
  if (popup.overlayOpacity !== undefined) rules.push(`.win-ov,.celebrate-ov{background:rgba(0,0,0,${Math.min(100, Math.max(0, Number(popup.overlayOpacity || 70))) / 100})!important}`);
  popStyle.textContent = rules.join('\n');

  // Share button visibility
  const shareBtn = document.querySelector('.wsnap-share');
  if (shareBtn) shareBtn.style.display = popup.showShareButton ? '' : 'none';
}

function applyBoxSettings(boxCfg) {
  if (!boxCfg) return;
  const total = Math.max(1, Math.min(9, Number(boxCfg.totalBoxes) || 3));
  if (total !== Object.keys(state.boxes).length) {
    const newBoxes = {};
    const newOrder = [];
    for (let i = 1; i <= total; i++) {
      newBoxes[i] = state.boxes[i] || { state: 'inactive', value: 0, name: '' };
      newOrder.push(i);
    }
    state.boxes = newBoxes;
    state.openOrder = newOrder;
  }
  state.gameSettings.boxIcon = boxCfg.boxIcon || '🎁';
  state.gameSettings.openedBoxIcon = boxCfg.openedBoxIcon || '📦';
  state.gameSettings.showBoxNumber = boxCfg.showBoxNumber === true;
  state.gameSettings.boxSize = boxCfg.boxSize || 'medium';
  state.gameSettings.boxOpenAnimation = boxCfg.boxOpenAnimation || 'shake';
  state.gameSettings.extraAnimations = Array.isArray(boxCfg.extraAnimations) && boxCfg.extraAnimations.length
    ? boxCfg.extraAnimations
    : ['shake', 'flip', 'bounce', 'explode', 'fade'];
  state.gameSettings.boxColors = Array.isArray(boxCfg.boxColors) ? boxCfg.boxColors : [];
  state.gameSettings.boxGlowColor = boxCfg.boxGlowColor || '#fbbf24';
  state.gameSettings.enableBox3d = boxCfg.enable3d === true;
  state.gameSettings.enableBoxDragDrop = boxCfg.enableDragDrop === true;
  state.gameSettings.boxTemplateHtml = String(boxCfg.templateHtml || '');
  state.gameSettings.boxTemplateCss = String(boxCfg.templateCss || '');
  state.gameSettings.boxTemplateJs = String(boxCfg.templateJs || '');
  state.gameSettings.partLayout = boxCfg.partLayout || {
    lid: { x: 0, y: 0, rotate: 0, scale: 1 },
    body: { x: 0, y: 0, rotate: 0, scale: 1 },
    ribbon: { x: 0, y: 0, rotate: 0, scale: 1 }
  };

  let boxStyle = document.getElementById('lmbBoxStyle');
  if (!boxStyle) { boxStyle = document.createElement('style'); boxStyle.id = 'lmbBoxStyle'; document.head.appendChild(boxStyle); }
  const rules = [];
  if (boxCfg.boxSize === 'small') rules.push(`.box-wrap{max-width:140px}.gcard{min-height:200px}`);
  else if (boxCfg.boxSize === 'large') rules.push(`.box-wrap{max-width:260px}.gcard{min-height:380px}`);
  if (boxCfg.boxGlowColor) rules.push(`.gcard.is-active{box-shadow:0 0 24px ${boxCfg.boxGlowColor}44,0 0 60px ${boxCfg.boxGlowColor}22!important}`);
  if (Array.isArray(boxCfg.boxColors) && boxCfg.boxColors.length) {
    boxCfg.boxColors.forEach((color, i) => {
      rules.push(`.box-wrap:nth-child(${i + 1}) .box-layer{background:linear-gradient(135deg,${color},${adjustColor(color, -30)})!important}`);
    });
  }
  if (state.gameSettings.enableBox3d) {
    rules.push('.gcard.gift-card{transform-style:preserve-3d;perspective:1200px}');
    rules.push('.gcard.gift-card .box-layer{transform:rotateX(14deg) rotateY(-12deg);transition:transform .32s ease}');
    rules.push('.gcard.gift-card:hover .box-layer{transform:rotateX(8deg) rotateY(-6deg) translateY(-6px)}');
  }
  const p = state.gameSettings.partLayout || {};
  const lid = p.lid || {};
  const body = p.body || {};
  const ribbon = p.ribbon || {};
  rules.push(`.gcard.gift-card .box-lid{transform:translate(${Number(lid.x || 0)}px,${Number(lid.y || 0)}px) rotate(${Number(lid.rotate || 0)}deg) scale(${Number(lid.scale || 1)})}`);
  rules.push(`.gcard.gift-card .box-body{transform:translate(${Number(body.x || 0)}px,${Number(body.y || 0)}px) rotate(${Number(body.rotate || 0)}deg) scale(${Number(body.scale || 1)})}`);
  rules.push(`.gcard.gift-card .box-ribbon{transform-box:fill-box;transform-origin:center;transform:translate(${Number(ribbon.x || 0)}px,${Number(ribbon.y || 0)}px) rotate(${Number(ribbon.rotate || 0)}deg) scale(${Number(ribbon.scale || 1)})}`);
  boxStyle.textContent = rules.join('\n');

  let customStyle = document.getElementById('lmbBoxCustomStyle');
  if (!customStyle) {
    customStyle = document.createElement('style');
    customStyle.id = 'lmbBoxCustomStyle';
    document.head.appendChild(customStyle);
  }
  customStyle.textContent = state.gameSettings.boxTemplateCss || '';

  applyBoxTemplateJs();
  initBoxDragDrop();
}

function applyBoxTemplateJs() {
  const source = String(state.gameSettings.boxTemplateJs || '').trim();
  let fn = null;
  if (source) {
    try {
      // Supports either a function body or full function expression.
      fn = new Function('row', 'state', source);
    } catch (_) {
      try {
        fn = new Function('row', 'state', `return (${source})(row, state);`);
      } catch (err) {
        console.warn('boxTemplateJs parse failed:', err.message);
      }
    }
  }
  state.gameSettings.boxTemplateFn = fn;
}

function initBoxDragDrop() {
  const row = document.getElementById('boxesRow');
  if (!row) return;

  const canDrag = state.gameSettings.enableBoxDragDrop === true;
  row.dataset.dragEnabled = canDrag ? '1' : '0';
  row.querySelectorAll('.box-wrap').forEach((el) => {
    el.draggable = canDrag;
    if (canDrag) el.classList.add('box-wrap-draggable');
    else el.classList.remove('box-wrap-draggable');
  });

  if (!state._boxDragBound) {
    let dragEl = null;
    row.addEventListener('dragstart', (e) => {
      if (row.dataset.dragEnabled !== '1') return;
      const wrap = e.target.closest('.box-wrap');
      if (!wrap) return;
      dragEl = wrap;
      wrap.classList.add('dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', wrap.dataset.box || '');
      }
    });
    row.addEventListener('dragend', () => {
      if (dragEl) dragEl.classList.remove('dragging');
      dragEl = null;
      row.querySelectorAll('.box-wrap.over').forEach((el) => el.classList.remove('over'));
    });
    row.addEventListener('dragover', (e) => {
      if (row.dataset.dragEnabled !== '1') return;
      e.preventDefault();
      const target = e.target.closest('.box-wrap');
      if (!target || !dragEl || target === dragEl) return;
      const rect = target.getBoundingClientRect();
      const before = (e.clientX - rect.left) < rect.width / 2;
      row.querySelectorAll('.box-wrap.over').forEach((el) => el.classList.remove('over'));
      target.classList.add('over');
      row.insertBefore(dragEl, before ? target : target.nextSibling);
    });
    row.addEventListener('drop', (e) => {
      if (row.dataset.dragEnabled !== '1') return;
      e.preventDefault();
      const ordered = Array.from(row.querySelectorAll('.box-wrap'))
        .map((el) => Number(el.dataset.box || 0))
        .filter((n) => n > 0);
      if (ordered.length) state.openOrder = ordered;
      row.querySelectorAll('.box-wrap.over').forEach((el) => el.classList.remove('over'));
    });
    state._boxDragBound = true;
  }
}

function applyWatermarkSettings(wm) {
  if (!wm || !wm.enabled) {
    const existing = document.getElementById('lmbWatermark');
    if (existing) existing.remove();
    return;
  }
  let el = document.getElementById('lmbWatermark');
  if (!el) {
    el = document.createElement('div');
    el.id = 'lmbWatermark';
    el.style.cssText = 'position:fixed;z-index:9990;pointer-events:none;user-select:none;';
    document.body.appendChild(el);
  }
  const pos = wm.position || 'bottom-right';
  el.style.bottom = pos.includes('bottom') ? '12px' : 'auto';
  el.style.top = pos.includes('top') ? '12px' : 'auto';
  el.style.right = pos.includes('right') ? '12px' : 'auto';
  el.style.left = pos.includes('left') ? '12px' : 'auto';

  if (wm.type === 'image' && wm.imageUrl) {
    const sz = wm.imageSize || 60;
    const op = (wm.imageOpacity || 30) / 100;
    el.innerHTML = `<img src="${escapeHtml(wm.imageUrl)}" style="width:${sz}px;height:auto;opacity:${op}" alt="watermark">`;
  } else {
    const sz = wm.fontSize || 12;
    const op = (wm.opacity || 30) / 100;
    el.innerHTML = `<span style="font-size:${sz}px;opacity:${op};color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.4)">${escapeHtml(wm.text || '')}</span>`;
  }
}

function applyMaintenanceMode(maint, features) {
  const isEnabled = (maint && maint.enabled) || (features && features.enableMaintenanceMode);
  let overlay = document.getElementById('lmbMaintenanceOv');
  if (!isEnabled) {
    if (overlay) overlay.remove();
    return;
  }
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lmbMaintenanceOv';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(8,7,26,.97);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;font-family:inherit;text-align:center;padding:24px;';
    document.body.appendChild(overlay);
  }
  const msg = (maint && maint.message) || 'Hệ thống đang bảo trì, vui lòng quay lại sau.';
  let safeMsg = escapeHtml(msg);
  if (safeMsg.includes('manhlamstore.shop')) {
    safeMsg = safeMsg.replace('manhlamstore.shop', '<a href="https://manhlamstore.shop" style="color:#3b82f6;text-decoration:none;font-weight:700;border-bottom:2px solid #3b82f6;transition:color 0.2s,border-color 0.2s;padding-bottom:1px;" onmouseover="this.style.color=\'#60a5fa\';this.style.borderColor=\'#60a5fa\'" onmouseout="this.style.color=\'#3b82f6\';this.style.borderColor=\'#3b82f6\'">manhlamstore.shop</a>');
  }
  const est = (maint && maint.estimatedTime) ? `<p style="margin-top:12px;font-size:14px;opacity:.7">Dự kiến hoàn tất: ${escapeHtml(maint.estimatedTime)}</p>` : '';
  overlay.innerHTML = `<div style="max-width:420px"><div style="font-size:48px;margin-bottom:16px">🔧</div><h2 style="font-size:22px;font-weight:800;margin:0 0 12px">Bảo trì hệ thống</h2><p style="font-size:15px;opacity:.85;line-height:1.6">${safeMsg}</p>${est}</div>`;
}

function applyScriptsInjection(scripts) {
  if (!scripts) return;
  if (scripts.css && typeof scripts.css === 'string') {
    let el = document.getElementById('lmbCustomCSS');
    if (!el) { el = document.createElement('style'); el.id = 'lmbCustomCSS'; document.head.appendChild(el); }
    el.textContent = scripts.css;
  }
  if (scripts.js && typeof scripts.js === 'string') {
    let el = document.getElementById('lmbCustomJS');
    if (el) el.remove();
    el = document.createElement('script');
    el.id = 'lmbCustomJS';
    el.textContent = scripts.js;
    document.head.appendChild(el);
  }
}

function applySocialLinks(social) {
  if (!social || !social.showInFooter) {
    const existing = document.getElementById('lmbSocialFooter');
    if (existing) existing.remove();
    return;
  }
  const links = [];
  const safeUrl = (url, schemes) => {
    const u = String(url || '').trim();
    try { const parsed = new URL(u, location.origin); if (schemes.includes(parsed.protocol)) return escapeHtml(u); } catch (_) {}
    return '';
  };
  const httpUrl = u => safeUrl(u, ['http:', 'https:']);
  if (social.facebook && httpUrl(social.facebook)) links.push(`<a href="${httpUrl(social.facebook)}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:none;font-size:18px" title="Facebook">📘 Facebook</a>`);
  if (social.zalo && httpUrl(social.zalo)) links.push(`<a href="${httpUrl(social.zalo)}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:none;font-size:18px" title="Zalo">💬 Zalo</a>`);
  if (social.telegram && httpUrl(social.telegram)) links.push(`<a href="${httpUrl(social.telegram)}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:none;font-size:18px" title="Telegram">✈️ Telegram</a>`);
  if (social.phone) links.push(`<a href="tel:${escapeHtml(social.phone)}" style="color:#60a5fa;text-decoration:none;font-size:18px" title="Điện thoại">📞 ${escapeHtml(social.phone)}</a>`);
  if (social.email) links.push(`<a href="mailto:${escapeHtml(social.email)}" style="color:#60a5fa;text-decoration:none;font-size:18px" title="Email">📧 Email</a>`);
  if (social.website && httpUrl(social.website)) links.push(`<a href="${httpUrl(social.website)}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:none;font-size:18px" title="Website">🌐 Website</a>`);
  if (!links.length) return;

  let el = document.getElementById('lmbSocialFooter');
  if (!el) {
    el = document.createElement('div');
    el.id = 'lmbSocialFooter';
    el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99;display:flex;align-items:center;justify-content:center;gap:16px;padding:8px 16px;background:rgba(8,7,26,.88);backdrop-filter:blur(8px);border-top:1px solid rgba(255,255,255,.08);flex-wrap:wrap;';
    document.body.appendChild(el);
  }
  el.innerHTML = links.join('');
}

function applySocialLinksToChat(social) {
  if (!social || !social.showInChat) return;
  const panel = document.getElementById('cpanel');
  if (!panel) return;
  let existingFooter = panel.querySelector('.lmb-chat-social');
  if (existingFooter) existingFooter.remove();
  const safeUrl = (url, schemes) => {
    const u = String(url || '').trim();
    try { const parsed = new URL(u, location.origin); if (schemes.includes(parsed.protocol)) return escapeHtml(u); } catch (_) {}
    return '';
  };
  const httpUrl = u => safeUrl(u, ['http:', 'https:']);
  const links = [];
  if (social.facebook && httpUrl(social.facebook)) links.push(`<a href="${httpUrl(social.facebook)}" target="_blank" rel="noopener noreferrer" title="Facebook" style="font-size:16px;text-decoration:none">📘</a>`);
  if (social.zalo && httpUrl(social.zalo)) links.push(`<a href="${httpUrl(social.zalo)}" target="_blank" rel="noopener noreferrer" title="Zalo" style="font-size:16px;text-decoration:none">💬</a>`);
  if (social.telegram && httpUrl(social.telegram)) links.push(`<a href="${httpUrl(social.telegram)}" target="_blank" rel="noopener noreferrer" title="Telegram" style="font-size:16px;text-decoration:none">✈️</a>`);
  if (social.phone) links.push(`<a href="tel:${escapeHtml(social.phone)}" title="Gọi điện" style="font-size:16px;text-decoration:none">📞</a>`);
  if (!links.length) return;
  const footer = document.createElement('div');
  footer.className = 'lmb-chat-social';
  footer.style.cssText = 'display:flex;gap:10px;justify-content:center;padding:6px 8px;border-top:1px solid #e2e8f0;background:#f8fafc;';
  footer.innerHTML = links.join('');
  panel.appendChild(footer);
}

function applyFeatureToggles(features) {
  if (!features) return;
  // Chat visibility
  const fab = document.querySelector('.cfab');
  const panel = document.getElementById('cpanel');
  if (features.enableChat === false) {
    if (fab) fab.style.display = 'none';
    if (panel) panel.style.display = 'none';
  }
  // Withdraw button visibility
  if (features.enableWithdraw === false) {
    document.querySelectorAll('.wbtn.rut').forEach(el => el.style.display = 'none');
  }
  // Theme picker visibility
  const picker = document.getElementById('homepageThemePicker');
  if (picker && features.enableThemePicker === false) picker.style.display = 'none';
  // Animated boxes
  state.gameSettings.enableAnimatedBoxes = features.enableAnimatedBoxes !== false;
  // Sound effects
  state.gameSettings.enableSoundEffects = features.enableSoundEffects === true;
  // Floating notification
  if (features.enableFloatingNotification === false) {
    document.querySelectorAll('.floating-notification, #floatingNoti, .fn-container').forEach(el => el.style.display = 'none');
  }
  // Push notification
  if (features.enablePushNotification === false) {
    document.querySelectorAll('.push-noti, #pushNoti').forEach(el => el.style.display = 'none');
  }
  // Online status indicator
  if (features.enableOnlineStatus === false) {
    document.querySelectorAll('.online-status, .status-indicator').forEach(el => el.style.display = 'none');
  }
  // Typing indicator
  state.gameSettings.enableTypingIndicator = features.enableTypingIndicator !== false;
  // Auto reply
  state.gameSettings.enableAutoReply = features.enableAutoReply !== false;
  // Player registration
  if (features.enablePlayerRegistration === false) {
    document.querySelectorAll('.register-btn, #registerForm').forEach(el => el.style.display = 'none');
  }
  // Game features → store in state for runtime use
  state.gameSettings.enableBoxPreview = features.enableBoxPreview === true;
  state.gameSettings.enableHints = features.enableHints === true;
  state.gameSettings.enableStreakBonus = features.enableStreakBonus === true;
  state.gameSettings.enableReferral = features.enableReferral === true;
  state.gameSettings.enableLeaderboard = features.enableLeaderboard === true;
  state.gameSettings.enableAchievements = features.enableAchievements === true;
  state.gameSettings.enableTimerChallenge = features.enableTimerChallenge === true;
  state.gameSettings.enableDailyLimit = features.enableDailyLimit === true;
  state.gameSettings.enableMultiBoxOpen = features.enableMultiBoxOpen === true;
  // Game settings values
  if (features.maxDailyBoxes) state.gameSettings.maxDailyBoxes = parseInt(features.maxDailyBoxes, 10) || 10;
  if (features.timerDuration) state.gameSettings.timerDuration = parseInt(features.timerDuration, 10) || 30;
  if (features.streakBonusMultiplier) state.gameSettings.streakBonusMultiplier = parseFloat(features.streakBonusMultiplier) || 1.5;
  if (features.referralBonus) state.gameSettings.referralBonus = parseInt(features.referralBonus, 10) || 10000;
}

/* ===== i18n Integration ===== */
function applyI18nSettings(i18nConfig) {
  if (!i18nConfig) return;
  const langFromCookie = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('lang='));
  const cookieLang = langFromCookie ? langFromCookie.split('=')[1] : null;
  const lang = cookieLang || i18nConfig.defaultLang || 'vi';
  window.__currentLang = lang;

  if (i18nConfig.enableLangSwitcher !== false) ensurePlayerLanguageDock(lang);

  // Fetch and apply translations
  fetchAndApplyTranslations(lang, i18nConfig.customTranslations || {});
}

function ensurePlayerLanguageDock(lang) {
  if (!document.getElementById('lmbLangDockStyle')) {
    const s = document.createElement('style');
    s.id = 'lmbLangDockStyle';
    s.textContent = '#lmbLangDock{display:inline-flex;align-items:center;gap:4px;padding:4px;background:linear-gradient(135deg,rgba(15,23,42,.88),rgba(30,41,59,.95));border:1px solid rgba(148,163,184,.28);border-radius:999px;box-shadow:0 4px 14px rgba(2,6,23,.3);backdrop-filter:blur(10px);}' +
      '#lmbLangDock .lmb-lang-label{font-size:11px;color:rgba(148,163,184,.75);padding:0 5px;}' +
      '#lmbLangDock .lmb-lang-btn{border:1px solid transparent;background:transparent;color:rgba(203,213,225,.85);font-size:11px;font-weight:700;border-radius:999px;padding:5px 9px;cursor:pointer;transition:color .18s,background .18s,border-color .18s;}' +
      '#lmbLangDock .lmb-lang-btn:hover{color:#f8fafc;border-color:rgba(59,130,246,.4);}' +
      '#lmbLangDock .lmb-lang-btn.active{color:#fff;border-color:rgba(59,130,246,.5);background:linear-gradient(135deg,#2563eb,#4f46e5);}' +
      '#lmbLangDock.lmb-lang-dock-mobile{position:fixed;left:10px;right:auto;top:auto;bottom:max(12px, env(safe-area-inset-bottom));z-index:26;}' +
      '@media (max-width:768px){#lmbLangDock{gap:2px;padding:3px;}#lmbLangDock .lmb-lang-label{display:none;}#lmbLangDock .lmb-lang-btn{font-size:10px;padding:4px 7px;min-width:30px;text-align:center;}}' +
      '@media (max-width:400px){#lmbLangDock{padding:2px;}#lmbLangDock .lmb-lang-btn{font-size:9px;padding:3px 5px;min-width:26px;}}';
    document.head.appendChild(s);
  }
  let dock = document.getElementById('lmbLangDock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'lmbLangDock';
    dock.setAttribute('role', 'toolbar');
    dock.setAttribute('aria-label', 'Language');
    dock.innerHTML =
      '<span class="lmb-lang-label">🌐</span>' +
      '<button class="lmb-lang-btn" data-lang="vi" onclick="switchLanguage(\'vi\')">VI</button>' +
      '<button class="lmb-lang-btn" data-lang="en" onclick="switchLanguage(\'en\')">EN</button>' +
      '<button class="lmb-lang-btn" data-lang="zh" onclick="switchLanguage(\'zh\')">中文</button>';
  }

  const placeDock = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const gNav = document.querySelector('.g-nav');

    if (isMobile) {
      dock.classList.add('lmb-lang-dock-mobile');
      dock.style.top = '';
      dock.style.right = '';
      if (dock.parentNode !== document.body) document.body.appendChild(dock);
      return;
    }

    dock.classList.remove('lmb-lang-dock-mobile');
    if (gNav) {
      let rightGroup = document.getElementById('gNavRightGroup');
      if (!rightGroup) {
        rightGroup = document.createElement('div');
        rightGroup.id = 'gNavRightGroup';
        rightGroup.style.cssText = 'display:flex;align-items:center;gap:8px;flex-shrink:0;min-width:0;';
        const homeBtn = document.getElementById('navHomeBtn');
        if (homeBtn && homeBtn.parentNode === gNav) {
          gNav.insertBefore(rightGroup, homeBtn);
          rightGroup.appendChild(homeBtn);
        } else {
          gNav.appendChild(rightGroup);
        }
      }
      if (dock.parentNode !== rightGroup) rightGroup.appendChild(dock);
      return;
    }

    dock.style.cssText = 'position:fixed;top:12px;right:12px;z-index:9999;';
    if (dock.parentNode !== document.body) document.body.appendChild(dock);
  };

  placeDock();
  if (!window.__lmbLangDockBound) {
    window.addEventListener('resize', placeDock, { passive: true });
    window.addEventListener('orientationchange', placeDock, { passive: true });
    window.__lmbLangDockBound = true;
  }

  dock.querySelectorAll('.lmb-lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function switchLanguage(lang) {
  document.cookie = 'lang=' + lang + ';path=/;max-age=' + (365*86400) + ';SameSite=Lax';
  window.__currentLang = lang;
  const dock = document.getElementById('lmbLangDock');
  if (dock) dock.querySelectorAll('.lmb-lang-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === lang));
  const ui = window.__lmbUiSettings || {};
  const i18nCfg = ui.i18n || {};
  fetchAndApplyTranslations(lang, i18nCfg.customTranslations || {});
}

window.__manualTextMapCache = window.__manualTextMapCache || {};
window.__manualTextNodeOriginals = window.__manualTextNodeOriginals || new WeakMap();

function translateExactTextByMap(sourceText, map) {
  const src = String(sourceText || '');
  if (!src) return src;
  if (Object.prototype.hasOwnProperty.call(map, src)) return map[src];
  const trimmed = src.trim();
  if (!trimmed || trimmed === src) return src;
  if (!Object.prototype.hasOwnProperty.call(map, trimmed)) return src;
  return src.replace(trimmed, map[trimmed]);
}
// Expose to window: needed by lazy-loaded lmb-floating-feed.js when this file
// runs as type="module"
window.translateExactTextByMap = translateExactTextByMap;

function fetchManualTextMap(lang) {
  const l = ['vi', 'en', 'zh'].includes(lang) ? lang : 'vi';
  if (window.__manualTextMapCache[l]) return Promise.resolve(window.__manualTextMapCache[l]);
  return fetch('/api/i18n/text-map/' + l)
    .then(r => r.json())
    .then(j => {
      const map = (j && j.success && j.map && typeof j.map === 'object') ? j.map : {};
      window.__manualTextMapCache[l] = map;
      return map;
    })
    .catch(() => ({}));
}

function applyManualTextMapToDocRoot(map, root, originals) {
  if (!root || !map || typeof map !== 'object') return;
  const doc = root.ownerDocument || document;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node && node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (!tag || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(tag)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[data-i18n]')) return NodeFilter.FILTER_REJECT;
      const text = String(node.textContent || '');
      return text.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  let node;
  while ((node = walker.nextNode())) {
    if (!originals.has(node)) originals.set(node, String(node.textContent || ''));
    node.textContent = translateExactTextByMap(originals.get(node), map);
  }
  root.querySelectorAll('[placeholder], [title], [aria-label]').forEach((el) => {
    ['placeholder', 'title', 'aria-label'].forEach((attr) => {
      if (!el.hasAttribute(attr)) return;
      const dsKey = 'lmbI18nOrig' + attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase());
      if (!el.dataset[dsKey]) el.dataset[dsKey] = el.getAttribute(attr) || '';
      el.setAttribute(attr, translateExactTextByMap(el.dataset[dsKey] || '', map));
    });
  });
}

function applyManualTextMapToHomepageFrame(map) {
  const frame = document.getElementById('homepagePresetFrame');
  if (!frame) return;
  let frameDoc;
  try { frameDoc = frame.contentDocument; } catch (_) { return; }
  if (!frameDoc || !frameDoc.body) return;
  if (!map || typeof map !== 'object') return;
  if (!window.__frameTextNodeOriginals) window.__frameTextNodeOriginals = new WeakMap();
  applyManualTextMapToDocRoot(map, frameDoc.body, window.__frameTextNodeOriginals);
}

function applyManualTextMapToDOM(map) {
  if (!map || typeof map !== 'object') return;
  const gameScreen = document.getElementById('screen-game');
  const loginScreen = document.getElementById('screen-login');
  const roots = [];
  if (gameScreen) roots.push(gameScreen);
  if (loginScreen) roots.push(loginScreen);
  if (!roots.length) roots.push(document.body);

  roots.forEach((root) => applyManualTextMapToDocRoot(map, root, window.__manualTextNodeOriginals));
  applyManualTextMapToHomepageFrame(map);
}

function fetchAndApplyTranslations(lang, customOverrides) {
  Promise.all([
    fetch('/api/i18n/' + lang).then(r => r.json()),
    fetchManualTextMap(lang)
  ]).then(([j, textMap]) => {
    if (!j || !j.success) return;
    const t = { ...j.translations, ...(customOverrides[lang] || {}) };
    window.__i18nTranslations = t;
    window.__manualTextMap = textMap || {};
    applyTranslationsToDOM(t);
    applyManualTextMapToDOM(window.__manualTextMap);
    // Update data-full-text on typing elements so they type in the current language
    const heroSub = document.getElementById('gameHeroSubtitle');
    if (heroSub && heroSub.dataset.fullText && window.__manualTextMap) {
      const translated = translateExactTextByMap(heroSub.dataset.fullText, window.__manualTextMap);
      if (translated && translated !== heroSub.dataset.fullText) {
        heroSub.dataset.fullText = translated;
        heroSub.textContent = translated;
      }
    }
    // Re-translate homepage theme current label
    const themeSelect = document.getElementById('homepageThemeSelect');
    const themeVal = themeSelect?.value || localStorage.getItem(HOMEPAGE_THEME_STORAGE_KEY) || '';
    if (themeVal) updateHomepageThemeCurrentLabel(themeVal);
  }).catch(() => {});
}

function applyTranslationsToDOM(t) {
  if (!t) return;
  // Apply to elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = t[key];
      else el.textContent = t[key];
    }
  });
  // Apply known mappings
  const mappings = {
    '.hero-title, .game-hero-title': 'heroTitle',
    '.hero-subtitle, .game-hero-subtitle': 'heroSubtitle',
    '#loginTitle': 'loginTitle',
    '#loginBtn, .login-btn': 'loginButton',
    '#walletWithdrawBtn': 'walletWithdraw',
    '.aws-title': 'approvalTitle',
    '.aws-processing': 'approvalProcessing',
    '#thankYouTitle': 'thankYouTitle',
    '#thankYouClose, .thankyou-close-btn': 'thankYouClose'
  };
  Object.entries(mappings).forEach(([sel, key]) => {
    if (!t[key]) return;
    document.querySelectorAll(sel).forEach(el => {
      if (el.tagName === 'INPUT') el.placeholder = t[key];
      else el.textContent = t[key];
    });
  });

  const preferredBrandName = String(window.__lmbUiSettings?.content?.brandName || '').trim() || String(t.brandName || '').trim();
  if (preferredBrandName) {
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
      let navBrandName = navBrand.querySelector('.nav-brand-name');
      if (!navBrandName) {
        navBrandName = document.createElement('span');
        navBrandName.className = 'nav-brand-name';
        const iconBox = navBrand.querySelector('.nav-icon-box');
        if (iconBox && iconBox.nextSibling) navBrand.insertBefore(navBrandName, iconBox.nextSibling);
        else navBrand.appendChild(navBrandName);
      }
      navBrandName.textContent = preferredBrandName;
      Array.from(navBrand.children).forEach((el) => {
        if (el.classList.contains('nav-icon-box')) return;
        if (el === navBrandName) return;
        el.remove();
      });
      Array.from(navBrand.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE && String(n.textContent || '').trim())
        .forEach((n) => { n.textContent = ''; });
    }
  }
}

/* ===== Modal Editor Custom CSS/HTML Injection ===== */
function applyModalEditorOverrides(modalEditor) {
  if (!modalEditor) return;
  // Inject custom CSS for all modals
  let cssText = '';
  Object.values(modalEditor).forEach(cfg => {
    if (cfg.customCss) cssText += cfg.customCss + '\n';
  });
  if (cssText) {
    let style = document.getElementById('lmbModalEditorCss');
    if (!style) { style = document.createElement('style'); style.id = 'lmbModalEditorCss'; document.head.appendChild(style); }
    style.textContent = cssText;
  }
  // Win popup overrides
  if (modalEditor.winPopup) {
    const wp = modalEditor.winPopup;
    if (wp.bgGradient) {
      const winOv = document.getElementById('winOv');
      if (winOv) {
        const modal = winOv.querySelector('.wov-modal');
        if (modal) modal.style.background = wp.bgGradient;
      }
    }
    if (wp.badgeText) state.gameSettings.winBadgeText = wp.badgeText;
    if (wp.thanksText) state.gameSettings.winThanksText = wp.thanksText;
  }
  // Custom HTML overrides
  const htmlMap = {
    winPopup: '#winOv .wov-modal',
    celebrate: '#celebrate .celebrate-inner, #celebrate .celebrate-card',
    withdrawal: '#modalOv .mbox',
    approvalWait: '#approvalWaitScreen .aws-card',
    thankYou: '#thankYouOv .mbox',
    hub: '#hubOv .hub-box',
    sessionDetail: '#sessionDetailOv .session-detail-box',
    claimModal: '#claimModal .claim-inner',
    chatPreForm: '#chatPreForm .chat-form-inner',
    lightbox: '#wovLightbox .wov-lb-inner'
  };
  Object.entries(htmlMap).forEach(([key, sel]) => {
    const cfg = modalEditor[key];
    if (cfg?.customHtml) {
      const target = document.querySelector(sel);
      if (target) target.innerHTML = cfg.customHtml;
    }
  });
}

function applyContentExtras(content) {
  if (!content) return;
  // Store win/lose popup titles for use by setupWinOverlay and playCelebrationOverlay
  state.gameSettings.winPopupTitle = content.winPopupTitle || '';
  state.gameSettings.losePopupTitle = content.losePopupTitle || '';
  state.gameSettings.thankyouTitle = content.thankyouTitle || '';
  state.gameSettings.thankyouMessage = content.thankyouMessage || '';

  // Banner feature removed: always keep hidden if leftover DOM exists.
  const banner = document.getElementById('lmbBanner');
  if (banner) {
    banner.style.display = 'none';
  }

  // Footer
  let footer = document.getElementById('lmbFooterText');
  if (content.footerText) {
    if (!footer) {
      footer = document.createElement('div');
      footer.id = 'lmbFooterText';
      footer.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:98;padding:6px 16px;background:rgba(8,7,26,.7);color:rgba(255,255,255,.55);text-align:center;font-size:11px;backdrop-filter:blur(4px);';
      document.body.appendChild(footer);
    }
    footer.textContent = content.footerText;
  }
}

function applyLogoHeight(logo) {
  if (!logo || !logo.height) return;
  const h = Math.max(20, Math.min(500, Number(logo.height) || 160));
  document.querySelectorAll('.game-hero-logo img').forEach(img => {
    img.style.maxHeight = h + 'px';
  });
}

function applyUiCustomizationEverywhere() {
  const ui = window.__lmbUiSettings || {};
  applyContentToPlayerUI(ui.content || {});
  applyLogoToPlayerUI(ui.logo || {});
  applyLogoHeight(ui.logo || {});
  applySeoSettings(ui.seo || {});
  applyAppearanceSettings(ui.appearance || {});
  applyChatSettings(ui.chat || {});
  applyPopupSettings(ui.popup || {});
  applyBoxSettings(ui.boxSettings || {});
  applyAnimationPresets(ui.animationPresets || {});
  applyWatermarkSettings(ui.watermark || {});
  applyMaintenanceMode(ui.maintenance || {}, ui.features || {});
  applyScriptsInjection(ui.scripts || {});
  applySocialLinks(ui.social || {});
  applySocialLinksToChat(ui.social || {});
  applyFeatureToggles(ui.features || {});
  applyContentExtras(ui.content || {});
  applyModalEditorOverrides(ui.modalEditor || {});
  applyI18nSettings(ui.i18n || {});
  const frameDoc = document.getElementById('homepagePresetFrame')?.contentDocument;
  if (frameDoc) applyCustomizationToHomepageFrame(frameDoc, ui);
}

function normalizeHomepageTheme(theme) {
  const raw = String(theme || '').trim();
  const found = HOMEPAGE_THEME_PRESETS.find((item) => item.value === raw);
  return found ? found.value : getDefaultHomepageTheme();
}

function getHomepageSessionInput() {
  const presetDoc = document.getElementById('homepagePresetFrame')?.contentDocument;
  if (presetDoc) {
    return presetDoc.getElementById('sessionInput')
      || presetDoc.getElementById('sessionCode')
      || presetDoc.querySelector('input[type="text"]');
  }

  return document.getElementById('sessionInput')
    || document.getElementById('sessionCode')
    || document.querySelector('#homepageThemeStage input[type="text"]')
    || document.querySelector('#screen-login input[type="text"]');
}

function getHomepageStartButton() {
  const presetDoc = document.getElementById('homepagePresetFrame')?.contentDocument;
  if (presetDoc) {
    return presetDoc.getElementById('startBtn')
      || Array.from(presetDoc.querySelectorAll('button')).find((btn) => /bắt\s*đầu|start/i.test(btn.textContent || ''));
  }

  return document.getElementById('startBtn')
    || document.querySelector('#screen-login button[data-start-game="1"]')
    || document.querySelector('#homepageThemeStage button[data-start-game="1"]')
    || Array.from(document.querySelectorAll('#homepageThemeStage button')).find((btn) => /bắt\s*đầu|start/i.test(btn.textContent || ''));
}

function bindSessionInputEnterKey() {
  const input = getHomepageSessionInput();
  if (!input || input.dataset.enterBound === '1') return;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startGame();
  });
  input.dataset.enterBound = '1';
}

async function renderHomepageTheme(themeFile) {
  const stage = document.getElementById('homepageThemeStage');
  if (!stage) return;

  if (FORCE_INTERNAL_HOME_SCREEN) {
    stage.innerHTML = '';
    applyHomepageThemeVisual(themeFile);
    bindLoginInputState();
    bindSessionInputEnterKey();
    syncLoginStartButtonState();
    return;
  }

  const selectedFile = normalizeHomepageTheme(themeFile);
  const renderId = ++homepageRenderToken;
  stage.innerHTML = '<div class="homepage-stage-loading">Đang tải giao diện...</div>';

  const response = await fetch(withNoCache(`/homepage-presets/${encodeURIComponent(selectedFile)}`));
  if (!response.ok) {
    throw new Error(`Không tải được giao diện (${response.status})`);
  }

  const htmlText = await response.text();
  if (renderId !== homepageRenderToken) return;

  stage.innerHTML = '<iframe id="homepagePresetFrame" class="homepage-preset-frame" title="Homepage preset" loading="eager"></iframe>';
  const frame = document.getElementById('homepagePresetFrame');
  if (!frame) return;

  await new Promise((resolve) => {
    frame.addEventListener('load', () => {
      if (renderId !== homepageRenderToken) {
        resolve();
        return;
      }

      const presetDoc = frame.contentDocument;
      if (presetDoc) {
        const input = presetDoc.getElementById('sessionInput')
          || presetDoc.getElementById('sessionCode')
          || presetDoc.querySelector('input[type="text"]');
        if (input) {
          input.setAttribute('autocomplete', 'off');
          if (!input.getAttribute('maxlength')) input.setAttribute('maxlength', '24');
        }

        const button = presetDoc.getElementById('startBtn')
          || Array.from(presetDoc.querySelectorAll('button')).find((btn) => /bắt\s*đầu|start/i.test(btn.textContent || ''));
        if (button) {
          button.type = 'button';
          button.onclick = (event) => {
            event.preventDefault();
            startGame();
          };
        }

        applyCustomizationToHomepageFrame(presetDoc, window.__lmbUiSettings || { content: {}, logo: {} });
        // Apply current language translations to the newly loaded iframe
        window.__frameTextNodeOriginals = new WeakMap();
        if (window.__manualTextMap && Object.keys(window.__manualTextMap).length > 0) {
          applyManualTextMapToHomepageFrame(window.__manualTextMap);
        }
      }

      bindLoginInputState();
      bindSessionInputEnterKey();
      syncLoginStartButtonState();
      resolve();
    }, { once: true });

    frame.srcdoc = htmlText;
  });
}

function applyGameBackgroundTheme(themeFile) {
  const frame = document.getElementById('gameThemeBgFrame');
  if (!frame) return;

  if (FORCE_INTERNAL_HOME_SCREEN) {
    frame.removeAttribute('src');
    frame.srcdoc = '';
    const bg = document.getElementById('gameThemeBg');
    if (bg) bg.style.display = 'none';
    return;
  }

  if (isMobileLiteEffects()) {
    frame.removeAttribute('src');
    frame.srcdoc = '';
    const bg = document.getElementById('gameThemeBg');
    if (bg) bg.style.display = 'none';
    return;
  }

  const normalized = normalizeHomepageTheme(themeFile);
  if (frame.dataset.themeFile === normalized) return;

  frame.dataset.themeFile = normalized;
  frame.addEventListener('load', () => {
    const doc = frame.contentDocument;
    if (!doc) return;

    const hideCardStyleId = 'lmbGameThemeHideCard';
    if (!doc.getElementById(hideCardStyleId)) {
      const style = doc.createElement('style');
      style.id = hideCardStyleId;
      style.textContent = `
        .card-wrapper,
        .card-wrap,
        .login-card,
        .tagline-wrap,
        .status-bar,
        .mode-row,
        .info-bar,
        .floating-gifts-row,
        [id*="startBtn"],
        .btn-start {
          display:none !important;
          visibility:hidden !important;
        }
        body, html {
          overflow:hidden !important;
        }
      `;
      doc.head.appendChild(style);
    }
  }, { once: true });

  frame.src = withNoCache(`/homepage-presets/${encodeURIComponent(normalized)}`);
}

async function applyHomepageTheme(theme, persist = true) {
  const normalized = normalizeHomepageTheme(theme);
  const previousCode = (getHomepageSessionInput()?.value || '').trim();
  updateHomepageThemeCurrentLabel(normalized);
  applyHomepageThemeVisual(normalized);

  if (persist) {
    localStorage.setItem(HOMEPAGE_THEME_STORAGE_KEY, normalized);
  }

  await renderHomepageTheme(normalized);
  applyGameBackgroundTheme(normalized);
  const input = getHomepageSessionInput();
  if (input && previousCode) {
    input.value = previousCode;
    syncLoginStartButtonState();
  }
}

async function initHomepageThemePicker() {
  const picker = document.getElementById('homepageThemePicker');
  const select = document.getElementById('homepageThemeSelect');
  if (picker) picker.style.display = 'none';
  if (select) select.style.display = 'none';

  if (FORCE_INTERNAL_HOME_SCREEN) {
    const stage = document.getElementById('homepageThemeStage');
    if (stage) stage.innerHTML = '';
    applyGameBackgroundTheme('');
  }

  const defaultTheme = getDefaultHomepageTheme();
  await applyHomepageTheme(defaultTheme, false);
}

function inferBoxState(item) {
  const unlucky = item && (item.level === 'UNLUCKY' || item.status === 'UNLUCKY');
  return unlucky ? 'opened-bad' : 'opened-win';
}

function isCashPrizeLike(data) {
  if (!data) return false;
  const numericValue = Number(data.value ?? data.prize_value ?? 0);
  const rawCash = data.isCash ?? data.is_cash;
  const cashFlag = rawCash === true || rawCash === 1 || String(rawCash || '').toLowerCase() === 'true';
  return cashFlag && numericValue > 0;
}

function normalizePrizeImageUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw || raw === 'null' || raw === 'undefined') return '';
  if (/^data:image\//i.test(raw) || /^blob:/i.test(raw)) return raw;

  // Normalize Windows/backslash and legacy relative paths from DB/admin forms.
  const normalized = raw.replace(/\\/g, '/').replace(/^\.\//, '').trim();

  if (/^https?:\/\//i.test(normalized)) return normalized;

  if (normalized.startsWith('/public/')) {
    return normalized.replace('/public/', '/');
  }

  if (normalized.startsWith('/public/uploads/')) {
    return normalized.replace('/public/uploads/', '/uploads/');
  }

  if (normalized.startsWith('/uploads/uploads/')) {
    return normalized.replace('/uploads/uploads/', '/uploads/');
  }

  // Keep absolute public paths (e.g. /images/banner.png) unchanged.
  if (normalized.startsWith('/') && !normalized.startsWith('/uploads/')) {
    return normalized;
  }

  if (normalized.startsWith('/uploads/')) return normalized;

  if (normalized.startsWith('uploads/')) {
    return `/${normalized}`;
  }

  // Preserve known static folders when path is missing leading slash.
  if (/^(images|img|css|js|homepage-presets|new_homepage|favicon\.ico)(\/|$)/i.test(normalized)) {
    return `/${normalized}`;
  }

  return `/uploads/${normalized.replace(/^\/+/, '')}`;
}

function resolvePrizeMedia(item, sessionData, boxNumber) {
  const n = Number(boxNumber || item?.box_number || item?.boxNumber || 0);
  const sessionImage = (n >= 1 && n <= 3) ? sessionData?.[`prize_${n}_image_url`] : '';
  const sessionIcon = (n >= 1 && n <= 3) ? sessionData?.[`prize_${n}_icon`] : '';

  const image = normalizePrizeImageUrl(
    item?.prize_image
    || item?.image_url
    || item?.imageUrl
    || item?.image
    || sessionImage
  );

  const rawIcon = String(
    item?.prize_icon
    || item?.prizeIcon
    || item?.icon
    || sessionIcon
    || '🎁'
  ).trim();

  return {
    image,
    icon: rawIcon || '🎁'
  };
}

async function refreshWallet() {
  if (!state.sessionCode) return;

  const prevRemaining = Math.max(0, Number(state.wallet.remaining || 0));
  const prevPendingConv = Math.max(0, Number(state.wallet.pendingConversion || 0));
  const prevGameLocked = !!state.gameLocked;
  const prevGameLockReason = String(state.gameLockReason || '');

  const result = await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/wallet`);
  const wallet = result.data || {};

  state.wallet.balance = Number(wallet.balance || 0) || 0;
  state.wallet.remaining = Number(wallet.remaining || 0) || 0;
  state.wallet.withdrawn = Number(wallet.withdrawn || 0) || 0;
  state.wallet.pending = Number(wallet.pending || 0) || 0;
  state.wallet.pendingConversion = Number(wallet.pending_conversion || 0) || 0;
  state.wallet.trustScore = Number(wallet.trust_score || 100) || 100;
  state.wallet.minTrustScoreForWithdrawal = Number(wallet.min_trust_score_for_withdrawal || 100) || 100;
  state.wallet.canWithdrawByTrust = wallet.can_withdraw_by_trust !== false;
  state.wallet.trustBlockedMessage = String(wallet.trust_block_message || '').trim();
  state.wallet.transactions = Array.isArray(wallet.transactions) ? wallet.transactions : [];
  state.balance = state.wallet.remaining;

  const cur = state.sessionCurrency || 'VND';

  const trustEl = document.getElementById('hubTrustScore');
  if (trustEl) trustEl.textContent = String(state.wallet.trustScore);

  // Update inline wallet trust score badge
  const wTrustVal = document.getElementById('walletTrustVal');
  const wTrustFill = document.getElementById('walletTrustFill');
  if (wTrustVal || wTrustFill) {
    const ts = Math.max(0, Math.min(100, state.wallet.trustScore));
    if (wTrustVal) wTrustVal.textContent = String(ts);
    if (wTrustFill) {
      wTrustFill.style.width = ts + '%';
      wTrustFill.style.background = ts >= 80 ? 'linear-gradient(90deg,#22c55e,#4ade80)'
        : ts >= 50 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
        : 'linear-gradient(90deg,#ef4444,#f87171)';
    }
    const row = document.getElementById('walletTrustRow');
    if (row) row.dataset.tier = ts >= 80 ? 'high' : ts >= 50 ? 'mid' : 'low';
  }

  const walletBalanceEl = document.getElementById('hubWalletBalance');
  if (walletBalanceEl) walletBalanceEl.textContent = formatCurrency(state.wallet.remaining, cur);

  const pendingEl = document.getElementById('hubPendingConversion');
  if (pendingEl) pendingEl.textContent = formatCurrency(state.wallet.pendingConversion, cur);

  renderCurrencyWalletCards();

  const currentRemaining = Math.max(0, Number(state.wallet.remaining || 0));
  const currentPendingConv = Math.max(0, Number(state.wallet.pendingConversion || 0));
  const approvedDelta = currentRemaining - prevRemaining;
  if (approvedDelta > 0 && prevPendingConv > currentPendingConv) {
    pushGameSystemNotice(
      'Quy đổi đã duyệt',
      `Đã cộng ${formatCurrencyBySymbol(approvedDelta, 'VND')} vào ví VND.`
    );
  }

  updateGameLockByApprovedPendingCash();
  if (prevGameLocked !== state.gameLocked || prevGameLockReason !== String(state.gameLockReason || '')) {
    renderBoxes();
  }

  renderTransactions();
}

async function refreshBoxesFromServer() {
  if (!state.sessionCode) return;

  const prevBoxSnapshots = {
    1: { ...(state.boxes?.[1] || {}) },
    2: { ...(state.boxes?.[2] || {}) },
    3: { ...(state.boxes?.[3] || {}) }
  };

  const [sessionRs, inventoryRs] = await Promise.all([
    apiJson(`/api/lucky-mystery-box/session?code=${encodeURIComponent(state.sessionCode)}`),
    apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/player-inventory`)
  ]);

  const sessionData = sessionRs?.data || {};

  let boxPos = sessionData.box_positions;
  // box_positions may arrive as a JSON string from SQLite — always parse & validate
  if (typeof boxPos === 'string') { try { boxPos = JSON.parse(boxPos); } catch (_) { boxPos = null; } }
  if (Array.isArray(boxPos) && boxPos.length === 3) {
    boxPos = boxPos.map(v => parseInt(v, 10)).filter(v => [1, 2, 3].includes(v));
    if (new Set(boxPos).size !== 3) boxPos = [1, 2, 3];
  } else {
    boxPos = [1, 2, 3];
  }
  state.openOrder = boxPos;

  state.boxes = {
    1: { state: 'inactive', value: 0, name: '' },
    2: { state: 'inactive', value: 0, name: '' },
    3: { state: 'inactive', value: 0, name: '' }
  };

  // Store session currency
  state.sessionCurrency = sessionData.currency || 'VND';

  // Store withdrawal requirement flag (default true if not set)
  const rwRaw = sessionData.require_withdrawal;
  state.requireWithdrawal = (rwRaw === null || rwRaw === undefined) ? true : (rwRaw === false || Number(rwRaw) === 0) ? false : true;

  const parseSpecialFlag = (value) => {
    if (value === true || value === 1) return true;
    const v = String(value ?? '').toLowerCase();
    return v === 'true' || v === '1';
  };
  state.sessionSpecialByBox = {
    1: parseSpecialFlag(sessionData.prize_1_is_special),
    2: parseSpecialFlag(sessionData.prize_2_is_special),
    3: parseSpecialFlag(sessionData.prize_3_is_special)
  };

  state.sessionImageByBox = {
    1: normalizePrizeImageUrl(sessionData.prize_1_image_url),
    2: normalizePrizeImageUrl(sessionData.prize_2_image_url),
    3: normalizePrizeImageUrl(sessionData.prize_3_image_url)
  };

  const items = inventoryRs?.data?.items || [];
  // Always allow sequential opening of all boxes.
  state.gameLocked = false;

  items.forEach((item) => {
    const boxNum = Number(item.box_number || item.boxNumber);
    if (boxNum >= 1 && boxNum <= 3) {
      const media = resolvePrizeMedia(item, sessionData, boxNum);
      const existingDecision = state.boxes[boxNum]?.decision || null;
      const statusLower = String(item.status || '').toLowerCase();
      const decisionLower = String(item.decision || '').toLowerCase();
      const specialApproved = !!(item.is_special && (
        ['confirmed', 'converted', 'declined'].includes(statusLower)
        || ['confirmed', 'converted', 'declined'].includes(decisionLower)
      ));
      const mappedDecision = item.decision
        || (item.status === 'converted' ? 'converted' : null)
        || (item.status === 'declined' ? 'declined' : null)
        || (item.status === 'exchanged' ? 'exchanged' : null)
        || (item.status === 'confirmed' ? 'confirmed' : null)
        || (item.status === 'rejected' ? 'declined' : null)
        || existingDecision;
      state.boxes[boxNum] = {
        state: inferBoxState(item),
        value: Number(item.prize_value || 0),
        name: item.prize_name || 'Phần thưởng',
        icon: media.icon,
        image: media.image,
        isCash: isCashPrizeLike(item),
        isSpecial: !!(item.is_special),
        specialApproved,
        level: item.level || 'NORMAL',
        currency: item.currency || 'VND',
        category: item.prize_description || item.category || '',
        status: statusLower || 'obtained',
        decision: mappedDecision,
        processingStatus: item.processingStatus || item.status || 'obtained'
      };
    }
  });

  // Do not unlock next box when there is an approved cash prize waiting for conversion.
  updateGameLockByApprovedPendingCash();
  if (!state.gameLocked) {
    const nextBox = state.openOrder.find((boxNum) => state.boxes[boxNum].state === 'inactive');
    if (nextBox) state.boxes[nextBox].state = 'active';
  }

  renderBoxes();

  const winOv = document.getElementById('winOv');
  const winOverlayOpen = !!(winOv && winOv.classList.contains('open'));
  [1, 2, 3].forEach((boxNum) => {
    const prev = prevBoxSnapshots[boxNum] || {};
    const curr = state.boxes?.[boxNum] || {};
    const becameApprovedPending = !isPendingApprovedCashBox(prev) && isPendingApprovedCashBox(curr);
    if (becameApprovedPending && !winOverlayOpen) {
      showApprovedConversionReminderModal(boxNum, { force: true });
    }
    if (isPendingApprovedCashBox(curr)) {
      scheduleApprovedConversionReminder(boxNum);
    } else {
      stopApprovedConversionReminder(boxNum);
    }
  });
}

async function loadPlayerInventory() {
  if (!state.sessionCode) return [];
  const result = await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/player-inventory`);
  state.inventoryItems = result?.data?.items || [];
  renderCurrencyWalletCards();
  renderInventory();
  renderExchange();
  renderWalletUnifiedHistory();
  return state.inventoryItems;
}

function getStatusText(item) {
  const level = item.level || 'NORMAL';
  if (level === 'UNLUCKY') return 'Xui lỗi';
  if (item.decision === 'declined') return 'Đã từ chối quy đổi';
  if (item.status === 'obtained') return 'Đã nhận trong kho';
  if (item.status === 'claimed') return 'Đã gửi yêu cầu nhận quà';
  if (item.status === 'exchanged') return 'Đang chờ CSKH xử lý';
  if (item.status === 'converted') return 'Đã quy đổi thành công';
  return item.status || 'Không xác định';
}

function buildItemCard(item, withActions) {
  const level = item.level || 'NORMAL';
  const currency = item.currency || 'VND';
  const canAct = withActions && item.status === 'obtained' && level !== 'UNLUCKY';
  const isPendingCskh = item.status === 'exchanged';
  const prizeVal = Number(item.prize_value || 0);
  let amountLabel = 'Quà hiện vật';
  if (prizeVal > 0) {
    if (currency === 'USD') amountLabel = `$${prizeVal.toLocaleString('vi-VN')} USD`;
    else if (currency === 'NDT') amountLabel = `¥${prizeVal.toLocaleString('vi-VN')} NDT`;
    else amountLabel = formatVND(prizeVal);
  }
  const itemName = item.prize_name || 'Phần thưởng';
  const boxNumber = Number(item.box_number || 0);

  return `
    <div class="hub-card">
      <div class="hub-card-title">Hộp #${boxNumber}: ${itemName}</div>
      <div class="hub-card-meta">Giá trị: ${amountLabel}${currency !== 'VND' && prizeVal > 0 ? ` <small>(≈ ${(prizeVal * (currency === 'USD' ? 26000 : 3800)).toLocaleString('vi-VN')} VND)</small>` : ''}</div>
      <div class="hub-card-meta">Trạng thái: ${getStatusText(item)}${isPendingCskh ? ' <small style="color:#e67e22">⏳ Chờ CSKH duyệt</small>' : ''}</div>
      <div class="hub-card-meta">Mức độ: ${level}</div>
      <div class="hub-card-meta">Thời gian: ${formatDateTime(item.createdAt)}</div>
      ${canAct ? `
        <div class="hub-card-actions">
          <button class="hub-inline-btn claim" type="button" onclick="openClaimModal(${boxNumber})">Nhận quà</button>
          <button class="hub-inline-btn convert" type="button" onclick="convertPrize(${boxNumber})">Đổi sang tiền</button>
        </div>
      ` : '<div class="hub-card-actions"><button class="hub-inline-btn disabled" type="button">Không khả dụng</button></div>'}
    </div>
  `;
}

function renderInventory() {
  const list = document.getElementById('inventoryList');
  if (!list) return;

  const sessionCodeEl = document.getElementById('hubSessionCode');
  if (sessionCodeEl) sessionCodeEl.textContent = state.sessionCode || '-';

  if (!state.inventoryItems.length) {
    list.innerHTML = '<div class="hub-card"><div class="hub-card-title">Kho trống</div><div class="hub-card-meta">Bạn chưa mở hộp nào trong phiên này.</div></div>';
    if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
    return;
  }

  list.innerHTML = state.inventoryItems.map((item) => buildItemCard(item, false)).join('');
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}

function renderExchange() {
  const list = document.getElementById('exchangeList');
  if (!list) return;

  if (!state.inventoryItems.length) {
    list.innerHTML = '<div class="hub-card"><div class="hub-card-title">Chưa có quà để xử lý</div><div class="hub-card-meta">Mở hộp trước khi nhận hoặc quy đổi quà.</div></div>';
    if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
    return;
  }

  list.innerHTML = state.inventoryItems.map((item) => buildItemCard(item, true)).join('');
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}

async function refreshTransactions() {
  if (!state.sessionCode) return;
  const result = await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/transactions`);
  state.wallet.transactions = Array.isArray(result.data) ? result.data : [];
  renderTransactions();
  renderWalletUnifiedHistory();
}

function scheduleEconomyRealtimeRefresh(delayMs = 160, options = {}) {
  if (!state.sessionCode || document.hidden) return;

  const needsBoxRefresh = !!options.refreshBoxes;
  if (needsBoxRefresh) {
    state.economyRefreshNeedBoxes = true;
  }

  if (state.economyRefreshInFlight) {
    state.economyRefreshQueued = true;
    return;
  }
  if (state.economyRefreshTimer) return;

  const now = Date.now();
  const minIntervalMs = Math.max(250, Number(state.economyRefreshMinIntervalMs || 900));
  const earliest = Number(state.economyRefreshLastAt || 0) + minIntervalMs;
  const waitMs = Math.max(Number(delayMs) || 0, Math.max(0, earliest - now));

  state.economyRefreshTimer = setTimeout(async () => {
    state.economyRefreshTimer = null;
    if (!state.sessionCode || document.hidden) return;
    if (state.economyRefreshInFlight) {
      state.economyRefreshQueued = true;
      return;
    }

    state.economyRefreshInFlight = true;
    try {
      const refreshTasks = [refreshWallet(), refreshTransactions()];
      if (state.economyRefreshNeedBoxes) {
        refreshTasks.push(refreshBoxesFromServer());
      }
      await Promise.all(refreshTasks);
      state.economyRefreshLastAt = Date.now();
    } catch (_) {
      // Silent by design for realtime-triggered refresh.
    } finally {
      state.economyRefreshInFlight = false;
      state.economyRefreshNeedBoxes = false;
      if (state.economyRefreshQueued) {
        state.economyRefreshQueued = false;
        scheduleEconomyRealtimeRefresh(160);
      }
    }
  }, waitMs);
}

function shouldSyncNow() {
  if (!state.sessionCode || document.hidden) return false;
  const gameScreen = document.getElementById('screen-game');
  const gameVisible = !!gameScreen && gameScreen.style.display !== 'none';
  const hubOpen = !!document.querySelector('#hubOv.open');
  return gameVisible || hubOpen || state.wallet.pendingConversion > 0;
}

async function backgroundSync() {
  if (state.syncBusy || !shouldSyncNow() || document.hidden) return;
  state.syncBusy = true;
  try {
    await Promise.all([refreshWallet(), refreshTransactions(), loadPlayerInventory()]);
  } catch (_) {
    // Silent background sync.
  } finally {
    state.syncBusy = false;
  }
}

function startRealtimeSync() {
  // Polling removed. Keep a single on-demand sync for legacy call sites.
  backgroundSync();
}

function stopRealtimeSync() {
  // Legacy no-op after polling removal.
  if (state.syncTimer) {
    clearInterval(state.syncTimer);
    state.syncTimer = null;
  }
}

function matchTxFilter(tx, filter) {
  if (filter === 'all') return true;
  if (filter === 'pending') return tx.status === 'pending';
  if (filter === 'approved') return tx.status === 'approved';
  if (filter === 'rejected') return tx.status === 'rejected';
  return true;
}

function txTitle(tx) {
  const _m = window.__manualTextMap || null;
  const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);
  if (tx.type === 'withdraw') return _tx('Rút tiền');
  if (String(tx.type || '').startsWith('conversion')) return `${_tx('Quy đổi hộp')} #${tx.boxNumber || '--'}`;
  return _tx('Giao dịch');
}

function txStatus(tx) {
  const _m = window.__manualTextMap || null;
  const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);
  if (tx.status === 'approved') return _tx('Đã duyệt');
  if (tx.status === 'rejected') return _tx('Từ chối');
  return _tx('Chờ duyệt');
}

function txReasonLine(tx) {
  const _m = window.__manualTextMap || null;
  const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);
  const reason = String(tx?.rejectionReason || tx?.rejection_reason || tx?.reason || '').trim();
  if (String(tx?.status || '').toLowerCase() !== 'rejected' || !reason) return '';
  return `<div class="hub-card-meta" style="color:#ef4444;margin-top:4px">${_tx('Lý do từ chối')}: ${esc(reason)}</div>`;
}

function renderTransactions() {
  const list = document.getElementById('txList');
  const pagination = document.getElementById('txPagination');
  if (!list) return;
  const _m = window.__manualTextMap || null;
  const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);

  const rows = (state.wallet.transactions || []).filter((tx) => matchTxFilter(tx, state.txFilter));
  if (!rows.length) {
    list.innerHTML = `<div class="hub-card"><div class="hub-card-title">${_tx('Chưa có giao dịch')}</div><div class="hub-card-meta">${_tx('Lịch sử giao dịch theo phiên sẽ hiển thị tại đây.')}</div></div>`;
    if (pagination) pagination.innerHTML = '';
    if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
    return;
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / state.txPageSize));
  if (state.txPage > totalPages) state.txPage = totalPages;
  if (state.txPage < 1) state.txPage = 1;
  const start = (state.txPage - 1) * state.txPageSize;
  const pageRows = rows.slice(start, start + state.txPageSize);

  list.innerHTML = pageRows.map((tx) => `
    <div class="tx-row">
      <div class="tx-left">
        <div class="tx-title">${txTitle(tx)}</div>
        <div class="tx-time">${formatDateTime(tx.requestedAt)}</div>
        ${txReasonLine(tx)}
      </div>
      <div class="tx-left" style="align-items:flex-end;">
        <div class="tx-amount">${formatVND(tx.amount)}</div>
        <div class="tx-status">${txStatus(tx)}</div>
      </div>
    </div>
  `).join('');

  if (!pagination) return;
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = `<button class="tx-page-btn" type="button" onclick="setTxPage(${state.txPage - 1})" ${state.txPage === 1 ? 'disabled' : ''}>‹</button>`;
  const maxPages = 5;
  let startPage = Math.max(1, state.txPage - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages, startPage + maxPages - 1);
  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  for (let p = startPage; p <= endPage; p += 1) {
    html += `<button class="tx-page-btn ${p === state.txPage ? 'active' : ''}" type="button" onclick="setTxPage(${p})">${p}</button>`;
  }
  html += `<button class="tx-page-btn" type="button" onclick="setTxPage(${state.txPage + 1})" ${state.txPage === totalPages ? 'disabled' : ''}>›</button>`;
  html += `<span class="hub-card-meta">${_tx('Trang')} ${state.txPage}/${totalPages}</span>`;
  pagination.innerHTML = html;
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}

function renderWalletUnifiedHistory() {
  const wrap = document.getElementById('hubUnifiedList');
  if (!wrap) return;
  const _m = window.__manualTextMap || null;
  const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);

  const txRows = Array.isArray(state.wallet.transactions) ? state.wallet.transactions : [];
  const items = Array.isArray(state.inventoryItems) ? state.inventoryItems : [];
  const exchangeRows = items.filter((item) => {
    const st = String(item.status || '').toLowerCase();
    return ['claimed', 'exchanged', 'converted', 'declined', 'rejected', 'confirmed', 'pending_approval'].includes(st);
  });

  const txHtml = txRows.length
    ? txRows.slice(0, 8).map((tx) => `
      <div class="tx-row">
        <div class="tx-left">
          <div class="tx-title">${txTitle(tx)}</div>
          <div class="tx-time">${formatDateTime(tx.requestedAt)}</div>
          ${txReasonLine(tx)}
        </div>
        <div class="tx-left" style="align-items:flex-end;">
          <div class="tx-amount">${formatVND(tx.amount)}</div>
          <div class="tx-status">${txStatus(tx)}</div>
        </div>
      </div>
    `).join('')
    : `<div class="hub-card"><div class="hub-card-title">${_tx('Chưa có giao dịch')}</div><div class="hub-card-meta">${_tx('Lịch sử giao dịch theo phiên sẽ hiển thị tại đây.')}</div></div>`;

  const invHtml = items.length
    ? items.slice(0, 8).map((item) => {
      const itemCur = item.currency || state.sessionCurrency || 'VND';
      return `
      <div class="hub-card">
        <div class="hub-card-title">${_tx('Hộp')} #${Number(item.box_number || item.boxNumber || 0)}: ${item.prize_name || _tx('Phần thưởng')}</div>
        <div class="hub-card-meta">${_tx('Giá trị')}: ${Number(item.prize_value || 0) > 0 ? formatCurrency(item.prize_value, itemCur) : _tx('Quà hiện vật')}</div>
        <div class="hub-card-meta">${_tx('Trạng thái kho')}: ${getStatusText(item)}</div>
        <div class="hub-card-meta">${_tx('Thời gian')}: ${formatDateTime(item.createdAt || item.created_at)}</div>
      </div>
    `;
    }).join('')
    : `<div class="hub-card"><div class="hub-card-title">${_tx('Kho vật phẩm trống')}</div><div class="hub-card-meta">${_tx('Chưa có vật phẩm nào trong phiên này.')}</div></div>`;

  const exchangeHtml = exchangeRows.length
    ? exchangeRows.slice(0, 8).map((item) => {
      const itemCur = item.currency || state.sessionCurrency || 'VND';
      return `
      <div class="hub-card">
        <div class="hub-card-title">${_tx('Hộp')} #${Number(item.box_number || item.boxNumber || 0)}: ${item.prize_name || _tx('Phần thưởng')}</div>
        <div class="hub-card-meta">${_tx('Trạng thái đổi quà')}: ${getStatusText(item)}</div>
        <div class="hub-card-meta">${_tx('Giá trị')}: ${Number(item.prize_value || 0) > 0 ? formatCurrency(item.prize_value, itemCur) : _tx('Quà hiện vật')}</div>
      </div>
    `;
    }).join('')
    : `<div class="hub-card"><div class="hub-card-title">${_tx('Chưa có bản ghi đổi quà')}</div><div class="hub-card-meta">${_tx('Các yêu cầu nhận/quy đổi sẽ hiển thị tại đây.')}</div></div>`;

  wrap.innerHTML = `
    <div class="hub-card"><div class="hub-card-title">${_tx('Lịch sử giao dịch phiên')}</div></div>
    ${txHtml}
    <div class="hub-card"><div class="hub-card-title">${_tx('Lịch sử kho vật phẩm')}</div></div>
    ${invHtml}
    <div class="hub-card"><div class="hub-card-title">${_tx('Lịch sử đổi quà')}</div></div>
    ${exchangeHtml}
  `;
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}

function setTxFilter(filter, el) {
  state.txFilter = filter;
  state.txPage = 1;
  document.querySelectorAll('#hubTabWallet .qbtn').forEach((btn) => {
    btn.style.background = 'rgba(32,26,65,.7)';
  });
  if (el) el.style.background = 'rgba(124,58,237,.3)';
  renderTransactions();
}

function setTxPage(page) {
  state.txPage = Math.max(1, Number(page) || 1);
  renderTransactions();
}

// ── Pending-approval persistence (survives reload) ──────────────────────────
function savePendingApprovalState(prize, forceNewDeadline) {
  if (!state.sessionCode) return;
  try {
    const existing = getPendingApprovalState();
    // Preserve the original deadline — never overwrite it on restore
    const deadline = (!forceNewDeadline && existing?.deadline) || (Date.now() + 7200 * 1000);
    localStorage.setItem(`lmb_pap_${state.sessionCode}`, JSON.stringify({ ...(prize || {}), deadline }));
  } catch (_) {}
}
function clearPendingApprovalState() {
  if (!state.sessionCode) return;
  try { localStorage.removeItem(`lmb_pap_${state.sessionCode}`); } catch (_) {}
}
function getPendingApprovalState() {
  if (!state.sessionCode) return null;
  try {
    const r = localStorage.getItem(`lmb_pap_${state.sessionCode}`);
    return r ? JSON.parse(r) : null;
  } catch (_) { return null; }
}

// After session data is loaded, check if there's an unresolved special-prize approval
function checkAndRestorePendingApproval() {
  if (!state.sessionCode) return;

  const isBoxStillSpecial = (boxNumber) => {
    const n = Number(boxNumber || 0);
    if (![1, 2, 3].includes(n)) return false;
    return !!state.sessionSpecialByBox?.[n];
  };

  // Primary source: live inventory (most authoritative)
  const pending = state.inventoryItems.find(
    (i) => {
      const status = String(i.status || '').toLowerCase();
      const boxNumber = Number(i.box_number || i.boxNumber || 0);
      const itemSaysSpecial = !!(i.is_special);
      return status === 'pending_approval' && itemSaysSpecial && isBoxStillSpecial(boxNumber);
    }
  );
  if (pending) {
    const media = resolvePrizeMedia(pending, null, pending.box_number || pending.boxNumber);
    const prize = {
      icon: media.icon,
      image: media.image,
      name: pending.prize_name || 'Phần thưởng',
      value: Number(pending.prize_value || 0),
      isCash: !!(pending.is_cash),
      isSpecial: true,
      boxNumber: Number(pending.box_number || 0),
      level: pending.level || 'VIP'
    };
    state.currentPrize = { ...prize };
    state.currentWinBox = prize.boxNumber;
    showApprovalWaitScreen(prize);
    return;
  }

  // Fallback: localStorage (covers the case where inventory call hasn't resolved yet
  // or the item status hasn't synced, but the previous session showed the screen)
  const saved = getPendingApprovalState();
  if (saved && saved.boxNumber && isBoxStillSpecial(saved.boxNumber)) {
    state.currentPrize = { ...saved };
    state.currentWinBox = Number(saved.boxNumber || 0);
    showApprovalWaitScreen(saved);
    return;
  }

  // Session config was updated to no longer require approval for that box.
  clearPendingApprovalState();
}

async function joinSession(code) {
  await apiJson('/api/lucky-mystery-box/join', {
    method: 'POST',
    body: JSON.stringify({ sessionCode: code })
  });

  await apiJson(`/api/lucky-mystery-box/session?code=${encodeURIComponent(code)}`);

  state.sessionCode = code;
  state.withdrawalHistoryRows = [];
  state.withdrawalHistorySessionCode = String(code || '').trim().toUpperCase();
  saveSessionCode(code);
  const navCode = document.getElementById('navCode');
  if (navCode) navCode.textContent = code;

  if (typeof lmbManager !== 'undefined') {
    lmbManager.saveSession(code);
  }

  startRealtimeSync();

  // Do not block session entry on secondary data APIs.
  Promise.allSettled([
    withTimeout(refreshBoxesFromServer(), 10000, 'Tải danh sách hộp quá lâu'),
    withTimeout(refreshWallet(), 10000, 'Tải ví quá lâu'),
    withTimeout(loadPlayerInventory(), 10000, 'Tải kho quà quá lâu'),
    withTimeout(refreshTransactions(), 10000, 'Tải giao dịch quá lâu')
  ]).finally(() => {
    // Update currency badge and labels based on latest session data
    updateCurrencyUI();

    // Restore approval wait screen if a special prize is still pending (survives reload)
    checkAndRestorePendingApproval();
    // Surface withdrawal decision after reload (approved/rejected).
    checkExistingWithdrawal().catch(() => {});
  });
}

function renderCustomBoxTemplate(template, payload) {
  const data = payload || {};
  return String(template || '').replace(/\{(\w+)\}/g, (_, key) => {
    const value = Object.prototype.hasOwnProperty.call(data, key) ? data[key] : '';
    return esc(String(value));
  });
}

function applyAnimationPresets(animCfg) {
  if (!animCfg) return;
  const presets = Array.isArray(animCfg.presets) ? animCfg.presets : [];
  let styleEl = document.getElementById('lmbCustomAnimStyle');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'lmbCustomAnimStyle';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = presets.map(p => String(p.css || '')).filter(Boolean).join('\n');
}

function getOpenAnimationProfile(name) {
  const key = String(name || 'shake').toLowerCase();
  const map = {
    shake: { phase1Ms: 700, phase2Ms: 220, boxAnim: 'boxShake .7s cubic-bezier(.36,.07,.19,.97) both', lidAnim: 'lidOpen .45s cubic-bezier(.4,0,.2,1) forwards' },
    flip: { phase1Ms: 620, phase2Ms: 200, boxAnim: 'boxFlip .62s cubic-bezier(.2,.85,.2,1) both', lidAnim: 'lidOpen .45s cubic-bezier(.4,0,.2,1) forwards' },
    bounce: { phase1Ms: 560, phase2Ms: 220, boxAnim: 'boxBounce .56s cubic-bezier(.25,.86,.36,1) both', lidAnim: 'lidOpen .42s cubic-bezier(.4,0,.2,1) forwards' },
    explode: { phase1Ms: 780, phase2Ms: 240, boxAnim: 'boxExplode .78s cubic-bezier(.2,.85,.2,1) both', lidAnim: 'lidOpen .48s cubic-bezier(.4,0,.2,1) forwards' },
    fade: { phase1Ms: 540, phase2Ms: 180, boxAnim: 'boxFadePulse .54s ease-out both', lidAnim: 'lidOpen .4s cubic-bezier(.4,0,.2,1) forwards' },
    spin3d: { phase1Ms: 760, phase2Ms: 220, boxAnim: 'boxSpin3d .76s cubic-bezier(.18,.88,.24,1) both', lidAnim: 'lidOpen .45s cubic-bezier(.4,0,.2,1) forwards' },
    warp: { phase1Ms: 640, phase2Ms: 230, boxAnim: 'boxWarp .64s cubic-bezier(.2,.8,.2,1) both', lidAnim: 'lidOpen .45s cubic-bezier(.4,0,.2,1) forwards' }
  };
  if (map[key]) return map[key];
  // Check custom presets from admin animation preset library
  const customPresets = (window.__lmbUiSettings && window.__lmbUiSettings.animationPresets && window.__lmbUiSettings.animationPresets.presets) || [];
  const preset = customPresets.find(p => String(p.name || '').toLowerCase() === key);
  if (preset) {
    const dur = String(preset.duration || '0.8s');
    const durMs = Math.round((parseFloat(dur) || 0.8) * 1000);
    return {
      phase1Ms: durMs,
      phase2Ms: Math.round(durMs * 0.3),
      boxAnim: `${preset.name} ${dur} ease both`,
      lidAnim: 'lidOpen .45s cubic-bezier(.4,0,.2,1) forwards'
    };
  }
  return map.shake;
}

function mkCard(boxNumber, boxMeta) {
  const st = boxMeta.state;
  const wrap = document.createElement('div');
  wrap.className = 'box-wrap';
  if (st === 'opened-win' || st === 'opened-bad') wrap.classList.add('box-wrap-opened');
  wrap.dataset.box = String(boxNumber);

  const levelKey = String(boxMeta.level || (st === 'opened-bad' ? 'UNLUCKY' : 'NORMAL')).toUpperCase();
  const isUnlucky = st === 'opened-bad' || levelKey === 'UNLUCKY';
  const isVip = levelKey === 'VIP' || boxMeta.isSpecial;
  const tierClass = isUnlucky ? 'unlucky' : (isVip ? 'vip' : 'normal');
  const tierLabel = isUnlucky ? 'UNLUCKY RESULT' : (isVip ? 'VIP TIER' : 'NORMAL TIER');

  const card = document.createElement('div');
  card.className = `gcard ${tierClass}`;
  const _m = window.__manualTextMap || null;
  const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);
  if (st === 'opened-win' || st === 'opened-bad') card.classList.add('is-opened');
  if (st === 'active') card.classList.add('is-active');
  if (st === 'inactive') card.classList.add('is-inactive');

  const mkParticles = (tier) => {
    const palette = {
      unlucky: ['#a78bfa', '#7c3aed', '#c4b5fd'],
      normal: ['#4ade80', '#22c55e', '#86efac'],
      vip: ['#fbbf24', '#f59e0b', '#fcd34d']
    };
    const colors = palette[tier] || palette.normal;
    let html = '';
    for (let i = 0; i < 24; i++) {
      const c = colors[i % colors.length];
      const px = (Math.random() - 0.5) * 168;
      const py = -(44 + Math.random() * 126);
      const left = 10 + Math.random() * 80;
      const top = 20 + Math.random() * 60;
      html += `<div class="particle" style="left:${left}%;top:${top}%;background:${c};--px:${px}px;--py:${py}px;--pdur:${.9 + Math.random() * 1.4}s;--pdelay:-${Math.random() * 1.5}s"></div>`;
    }
    return html;
  };

  const mkBadgeSparks = () => {
    let dots = '';
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 * Math.PI) / 180;
      const px = Math.round(Math.cos(angle) * 22);
      const py = Math.round(Math.sin(angle) * 22);
      dots += `<div class="sp" style="--px:${px}px;--py:${py}px;--pd:${0.9 + Math.random() * 0.5}s;--ps:-${(Math.random() * 0.9).toFixed(2)}s"></div>`;
    }
    return dots;
  };

  const mkRainDrops = () => {
    let html = '';
    for (let i = 0; i < 22; i++) {
      const h = 16 + Math.random() * 28;
      html += `<div class="raindrop" style="left:${4 + Math.random() * 92}%;height:${h}px;--rdur:${0.45 + Math.random() * 0.5}s;--rdelay:-${Math.random() * 1.2}s"></div>`;
    }
    return html;
  };

  const preferredImage = normalizePrizeImageUrl(boxMeta.image || state.sessionImageByBox?.[boxNumber] || '');
  const safeIcon = esc(boxMeta.icon || state.gameSettings.boxIcon || '🎁');
  const prizeName = esc(boxMeta.name || 'Phần thưởng');

  let valueText = 'Quà hiện vật';
  if (Number(boxMeta.value || 0) > 0) {
    const fmtVal = Math.max(0, Number(boxMeta.value)).toLocaleString('vi-VN');
    const cur = boxMeta.currency || 'VND';
    if (cur === 'USD') valueText = `$${fmtVal}`;
    else if (cur === 'NDT') valueText = `¥${fmtVal}`;
    else valueText = `${fmtVal}đ`;
  }

  let bodyHtml = '';
  if (st === 'opened-bad') {
    const unluckyIcon = String(boxMeta.icon || '').trim() || '😭';
    bodyHtml = `
      <div class="img-shell">
        <div class="cry-shell">
          <div class="rain">${mkRainDrops()}</div>
          <div class="cry-vignette"></div>
          <span class="cry-emoji">${esc(unluckyIcon)}</span>
          <div class="cry-puddle"></div>
        </div>
      </div>
      <div class="card-body card-body-unified">
        <div class="card-title">Chúc bạn may mắn lần sau</div>
        <div class="card-subtitle">Hộp tiếp theo có thể sẽ mang đến bất ngờ lớn hơn</div>
        <div class="status-row status-declined"><div class="status-dot"></div>UNLUCKY RESULT</div>
      </div>`;
    card.onclick = () => reopenWinOptions(boxNumber);
  } else if (st === 'opened-win') {
    const hasImage = !!String(preferredImage || '').trim();
    const _procStatusMap = {
      obtained:          { cls: 'status-pending',  label: '⏳ Chờ xử lý' },
      pending_approval:  { cls: 'status-pending',  label: '⏳ Đang xử lý' },
      confirmed:         { cls: 'status-confirmed', label: '✅ Đã xác nhận' },
      converted:         { cls: 'status-redeemed', label: '✅ Đã quy đổi' },
      declined:          { cls: 'status-declined', label: '✕ Đã từ chối' },
      rejected:          { cls: 'status-declined', label: '✕ Đã từ chối' },
      claimed:           { cls: 'status-redeemed', label: '✅ Đã nhận' },
      exchanged:         { cls: 'status-redeemed', label: '✅ Đã trao đổi' },
      banned:            { cls: 'status-declined', label: '🚫 Đã khóa' }
    };
    const _rawProc = String(boxMeta.processingStatus || boxMeta.decision || 'obtained').toLowerCase();
    const _procInfo = _procStatusMap[_rawProc] || _procStatusMap.obtained;
    const statusHtml = `<div class="status-row ${_procInfo.cls}"><div class="status-dot"></div>${_procInfo.label}</div>`;

    const imageContent = hasImage
      ? `<img class="result-reward-image" src="${esc(preferredImage)}" alt="${prizeName}" loading="lazy" decoding="async" onerror="this.onerror=null;this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='flex';}"><div class="emoji-fallback" style="display:none">${safeIcon}</div><div class="img-glow"></div><div class="img-scan"></div>`
      : `<div class="emoji-fallback">${safeIcon}</div>`;

    const badgeHtml = hasImage
      ? `<div class="badge-sparks">${mkBadgeSparks()}</div><div class="reward-badge">${safeIcon}</div>`
      : '';

    const useUnluckyBodyLayout = !isUnlucky;
    const valueSubtitle = `${_tx('Giá trị')}: ${valueText}`;
    const bodyInfoHtml = useUnluckyBodyLayout
      ? `<div class="card-subtitle">${esc(valueSubtitle)}</div>${statusHtml}`
      : `<div class="card-amount">${valueText}</div>${statusHtml}`;

    bodyHtml = `
      <div class="img-shell">
        ${imageContent}
        ${badgeHtml}
      </div>
      <div class="card-body card-body-unified">
        <div class="card-title">${prizeName}</div>
        ${bodyInfoHtml}
      </div>`;
    card.onclick = () => reopenWinOptions(boxNumber);
  } else {
    const isActive = st === 'active';
    const subtitle = state.gameLocked ? _tx(getGameLockNoticeText()) : (isActive ? _tx('Bấm để mở') : _tx('Phần thưởng bí ẩn'));
    const sparkMap = {
      normal: ['✦', '✧', '◆', '·'],
      vip: ['✶', '✦', '✷', '✹'],
      unlucky: ['✕', '◌', '⟡', '·']
    };
    const sparks = sparkMap[tierClass] || sparkMap.normal;
    const tierEmblem = tierClass === 'vip' ? '♛' : (tierClass === 'unlucky' ? '☍' : '◈');
    card.classList.add('gift-card');
    if (isActive) { card.classList.add('gift-active'); } else { card.classList.add('gift-inactive'); }
    const n = boxNumber;
    const customTemplate = String(state.gameSettings.boxTemplateHtml || '').trim();
    if (customTemplate) {
      card.classList.add('custom-box-template');
      bodyHtml = renderCustomBoxTemplate(customTemplate, {
        boxNumber: n,
        subtitle,
        title: `${_tx('Hộp quà')} #${n}`,
        hint: isActive && !state.gameLocked ? _tx('Bấm để mở') : ''
      });
    } else {
      bodyHtml = `
      <div class="card-shimmer"></div>
      <div class="box-area">
        <div class="box-glow"></div>
        <span class="tier-orbit o1"></span>
        <span class="tier-orbit o2"></span>
        <span class="tier-emblem">${tierEmblem}</span>
          <span class="box-open-wave"></span>
        <div class="box-layer tier-${tierClass}">
          <div class="box-lid">
            <svg viewBox="0 0 140 46" fill="none">
              <rect x="2" y="8" width="136" height="36" rx="7" fill="url(#lidGrad${n})" stroke="rgba(196,181,253,.7)" stroke-width="1.3"/>
              <g class="box-ribbon">
                <rect x="57" y="0" width="26" height="46" rx="6" fill="url(#ribGrad${n})" stroke="rgba(196,181,253,.5)" stroke-width="1"/>
                <ellipse cx="55" cy="10" rx="22" ry="13" fill="url(#bowGrad${n})" stroke="rgba(196,181,253,.65)" stroke-width="1.2" transform="rotate(-18 55 10)"/>
                <ellipse cx="85" cy="10" rx="22" ry="13" fill="url(#bowGrad${n})" stroke="rgba(196,181,253,.65)" stroke-width="1.2" transform="rotate(18 85 10)"/>
                <circle cx="70" cy="8" r="9" fill="rgba(196,181,253,.75)" stroke="rgba(255,255,255,.6)" stroke-width="1.2"/>
                <circle cx="70" cy="8" r="5" fill="rgba(255,255,255,.3)"/>
              </g>
              <defs>
                <linearGradient id="lidGrad${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(139,92,246,.45)"/><stop offset="100%" stop-color="rgba(76,29,149,.6)"/></linearGradient>
                <linearGradient id="ribGrad${n}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="rgba(196,181,253,.25)"/><stop offset="50%" stop-color="rgba(196,181,253,.45)"/><stop offset="100%" stop-color="rgba(196,181,253,.25)"/></linearGradient>
                <radialGradient id="bowGrad${n}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(167,139,250,.5)"/><stop offset="100%" stop-color="rgba(109,40,217,.6)"/></radialGradient>
              </defs>
            </svg>
          </div>
          <div class="box-body">
            <svg viewBox="0 0 140 118" fill="none">
              <rect x="2" y="2" width="136" height="114" rx="8" fill="url(#bodyGrad${n})" stroke="rgba(139,92,246,.6)" stroke-width="1.5"/>
              <g class="box-ribbon">
                <rect x="57" y="2" width="26" height="114" rx="5" fill="url(#ribBodyGrad${n})" stroke="rgba(139,92,246,.35)" stroke-width="1"/>
              </g>
              <rect x="10" y="10" width="40" height="94" rx="6" fill="rgba(255,255,255,.03)"/>
              <rect x="95" y="10" width="34" height="94" rx="6" fill="rgba(255,255,255,.02)"/>
              <rect x="4" y="2" width="132" height="3" rx="2" fill="rgba(196,181,253,.18)"/>
              <circle cx="12" cy="14" r="3.5" fill="rgba(196,181,253,.35)"/>
              <circle cx="128" cy="14" r="3.5" fill="rgba(196,181,253,.35)"/>
              <circle cx="12" cy="106" r="3.5" fill="rgba(139,92,246,.3)"/>
              <circle cx="128" cy="106" r="3.5" fill="rgba(139,92,246,.3)"/>
              <path d="M30 60 L50 40 L70 60 L50 80Z" fill="rgba(196,181,253,.04)" stroke="rgba(196,181,253,.08)" stroke-width=".5"/>
              <path d="M90 60 L110 40 L130 60 L110 80Z" fill="rgba(196,181,253,.04)" stroke="rgba(196,181,253,.08)" stroke-width=".5"/>
              <defs>
                <linearGradient id="bodyGrad${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(60,20,120,.85)"/><stop offset="50%" stop-color="rgba(46,16,101,.92)"/><stop offset="100%" stop-color="rgba(30,10,70,.95)"/></linearGradient>
                <linearGradient id="ribBodyGrad${n}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="rgba(139,92,246,.12)"/><stop offset="50%" stop-color="rgba(139,92,246,.25)"/><stop offset="100%" stop-color="rgba(139,92,246,.12)"/></linearGradient>
              </defs>
            </svg>
          </div>
          <span class="box-spark sp1">${sparks[0]}</span>
          <span class="box-spark sp2">${sparks[1]}</span>
          <span class="box-spark sp3">${sparks[2]}</span>
          <span class="box-spark sp4">${sparks[3]}</span>
        </div>
      </div>
      <div class="card-divider"></div>
      <div class="text-area">
        <span class="box-title">${_tx('Hộp quà')} #${n}</span>
        <span class="box-subtitle">${esc(subtitle)}</span>
        ${isActive && !state.gameLocked ? `<div class="box-hint"><span class="box-hint-dot"></span><span>${_tx('Bấm để mở')}</span><span class="box-hint-dot"></span></div>` : ''}
      </div>`;
    }
    if (isActive && !state.gameLocked) card.onclick = () => openBox(boxNumber);
  }

  if (card.classList.contains('gift-card')) {
    card.innerHTML = bodyHtml;
  } else {
    card.innerHTML = `
      <div class="glow-ring"></div>
      ${(st === 'opened-win' || st === 'opened-bad') ? `<div class="chip">${_tx('Đã mở')}</div>` : ''}
      <div class="tier-ribbon ${tierClass}">${tierLabel}</div>
      <div class="particles">${mkParticles(tierClass)}</div>
      ${bodyHtml}
    `;
  }

  wrap.appendChild(card);

  // Caption is only shown for opened cards; the new gift-card design has title inside
  if (!card.classList.contains('gift-card')) {
    const caption = document.createElement('div');
    caption.className = 'box-caption';
    const _m = window.__manualTextMap || null;
    const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);
    const captionTitle = `${_tx('Hộp')} ${boxNumber}`;
    let captionSub = '';
    if (st === 'active') captionSub = _tx('Sẵn sàng mở');
    else if (st === 'inactive') captionSub = state.gameLocked ? _tx(getGameLockNoticeText()) : _tx('Chưa mở');
    else if (st === 'opened-bad') captionSub = _tx('Đã mở - Unlucky');
    else captionSub = `${_tx('Đã mở')} - ${esc(boxMeta.name || _tx('Phần thưởng'))}`;
    caption.innerHTML = `<div class="box-caption-title">${esc(captionTitle)}</div><div class="box-caption-sub">${esc(captionSub)}</div>`;
    wrap.appendChild(caption);
  }

  return wrap;
}

function renderBoxes() {
  ensureGiftStars();
  const row = document.getElementById('boxesRow');
  if (!row) return;

  state.renderBoxesToken = Number(state.renderBoxesToken || 0) + 1;
  const renderToken = state.renderBoxesToken;
  const orderedBoxes = Array.isArray(state.openOrder) ? state.openOrder.slice() : [];

  row.innerHTML = '';

  const finalizeRender = () => {
    if (state.renderBoxesToken !== renderToken) return;
    initBoxDragDrop();
    if (typeof state.gameSettings.boxTemplateFn === 'function') {
      try {
        state.gameSettings.boxTemplateFn(row, state);
      } catch (err) {
        console.warn('boxTemplateJs runtime error:', err.message);
      }
    }
    if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
  };

  const shouldChunkRender = isMobileLiteEffects() || FX_PROFILE.tier !== 'high';
  if (!shouldChunkRender) {
    orderedBoxes.forEach((boxNumber) => {
      row.appendChild(mkCard(boxNumber, state.boxes[boxNumber]));
    });
    finalizeRender();
    return;
  }

  let index = 0;
  const chunkBudgetMs = 6;
  const chunkSize = isMobileLiteEffects() ? 2 : 3;

  const pump = () => {
    if (state.renderBoxesToken !== renderToken) return;
    const startedAt = performance.now();

    while (index < orderedBoxes.length) {
      const boxNumber = orderedBoxes[index];
      row.appendChild(mkCard(boxNumber, state.boxes[boxNumber]));
      index += 1;

      if ((index % chunkSize) === 0) break;
      if ((performance.now() - startedAt) >= chunkBudgetMs) break;
    }

    if (index < orderedBoxes.length) {
      requestAnimationFrame(pump);
      return;
    }

    finalizeRender();
  };

  requestAnimationFrame(pump);
}

function ensureGiftStars() {
  const starsEl = document.getElementById('stars');
  if (!starsEl || starsEl.dataset.ready === '1') return;

  const frag = document.createDocumentFragment();
  const count = FX_PROFILE.tier === 'high' ? 30 : FX_PROFILE.tier === 'medium' ? 18 : 10;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random() * 100}%;left:${Math.random() * 100}%;--dur:${2 + Math.random() * 4}s;--delay:-${Math.random() * 5}s`;
    frag.appendChild(s);
  }
  starsEl.appendChild(frag);
  starsEl.dataset.ready = '1';
}

function selMode(mode, el) {
  state.mode = mode;
  document.querySelectorAll('.mode-btn').forEach((b) => { b.style.outline = 'none'; });
  if (el) el.style.outline = '2px solid rgba(255,255,255,.32)';
}

function stopGameHeroTyping() {
  if (state.heroTypingTimer) {
    clearTimeout(state.heroTypingTimer);
    state.heroTypingTimer = null;
  }
  if (state.heroTypingRestartTimer) {
    clearTimeout(state.heroTypingRestartTimer);
    state.heroTypingRestartTimer = null;
  }
}

function startGameHeroTyping() {
  const subtitleEl = document.getElementById('gameHeroSubtitle');
  if (!subtitleEl) return;

  const gameScreen = document.getElementById('screen-game');
  if (!gameScreen || window.getComputedStyle(gameScreen).display === 'none') return;

  const fullText = String(subtitleEl.dataset.fullText || subtitleEl.textContent || '').trim();
  if (!fullText) return;

  if (isMobileLiteEffects()) {
    stopGameHeroTyping();
    subtitleEl.textContent = fullText;
    subtitleEl.classList.remove('typing-active');
    subtitleEl.classList.add('typing-done');
    return;
  }

  stopGameHeroTyping();
  subtitleEl.textContent = '';
  subtitleEl.classList.remove('typing-done');
  subtitleEl.classList.add('typing-active');

  let idx = 0;
  const typeNext = () => {
    if (idx >= fullText.length) {
      subtitleEl.classList.add('typing-done');
      state.heroTypingRestartTimer = setTimeout(() => {
        startGameHeroTyping();
      }, 2400);
      return;
    }

    subtitleEl.textContent += fullText.charAt(idx);
    idx += 1;
    const stepDelay = 36 + Math.floor(Math.random() * 28);
    state.heroTypingTimer = setTimeout(typeNext, stepDelay);
  };

  state.heroTypingTimer = setTimeout(typeNext, 260);
}

async function startGame(preferredCode) {
  if (state.startGamePromise) return state.startGamePromise;

  state.startGamePromise = (async () => {
    // Ensure game settings are loaded before starting
    if (state._settingsReady) await state._settingsReady;

    const input = getHomepageSessionInput();
    const forcedCode = String(preferredCode || '').trim().toUpperCase();
    const code = forcedCode || (input ? (input.value || '').trim().toUpperCase() : '');
    if (!input && !forcedCode) {
      showToast('Không tìm thấy ô nhập mã phiên');
      return;
    }
    if (!code) {
      showToast('Vui lòng nhập mã phiên');
      return;
    }

    try {
      await withLoadingOverlay('Đang kết nối phiên chơi...', async () => {
        await withTimeout(
          joinSession(code),
          15000,
          'Kết nối phiên quá lâu. Vui lòng thử lại.'
        );
      });
      const loginScreen = document.getElementById('screen-login');
      const gameScreen = document.getElementById('screen-game');
      if (loginScreen) loginScreen.style.display = 'none';
      if (gameScreen) gameScreen.style.display = 'block';
      syncHomepagePerformanceMode();
      startGameHeroTyping();

      state.chat.initialized = false;
      stopChatSSE();
      startChatSSE();

      showToast('Kết nối phiên thành công');
      const nextUrl = `${window.location.pathname}?code=${encodeURIComponent(code)}`;
      window.history.replaceState({ sessionCode: code }, '', nextUrl);
      state.urlAutoEnterDone = true;
      clearAutoEnterRetryTimers();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  })();

  try {
    return await state.startGamePromise;
  } finally {
    state.startGamePromise = null;
  }
}

// ── Celebration FX — lazy loaded from modules/lmb-celebration-fx.js ──
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function mkRing() {}
function burst() {}
function mkConf() {}
function screenShake() {}
function mkCoreFlash() {}
function mkShockwave() {}
function mkRays() {}
function mkSparks() {}
function megaExplosion() {}
function ensureOpenBoxAnimStyles() {}
function spawnUnboxFX() {}
function spawnScanLine() {}
function spawnSparks() {}
function spawnScreenFlash() {}
function spawnCardGlow() {}
function spawnVipGlowRings() {}
function spawnLightBeams() {}
function spawnBoxBurst() {}
function spawnVipRevealTexts() { return null; }
function playPrizeFlyAnimation() { return Promise.resolve(); }
function playCelebrationOverlay() { return Promise.resolve(); }

async function openBox(boxNumber) {
  const initialLocked = updateGameLockByApprovedPendingCash();
  if (initialLocked) {
    const initialReason = String(state.gameLockReason || '');

    // Approval/withdraw status may have just changed server-side.
    // Re-sync once before hard-blocking to avoid forcing manual page reload.
    if (initialReason === 'withdraw_request_required' && state.sessionCode) {
      try {
        await Promise.all([refreshWallet(), refreshTransactions(), refreshBoxesFromServer()]);
      } catch (_) {
        // Best effort only; fallback to current lock state below.
      }

      if (!updateGameLockByApprovedPendingCash()) {
        renderBoxes();
      }
    }

    if (state.gameLocked) {
      const pendingBox = getPendingApprovedCashBoxNumber();
      showToast(`⏳ ${getGameLockNoticeText()}.`);
      if (pendingBox) {
        showApprovedConversionReminderModal(pendingBox, { force: true });
      }
      return;
    }
  }

  if (!validateSession()) return;
  if (!state.sessionCode || state.loadingOpen) return;
  state.loadingOpen = true;

  // Find the specific card for this box number; fall back to the active card selector
  const boxWrap = document.querySelector(`.box-wrap[data-box="${boxNumber}"]`);
  const card = (boxWrap ? boxWrap.querySelector('.gcard') : null) || document.querySelector('.gcard.ga');
  // Ensure card is in viewport before measuring (handles scrolled mobile layout)
  if (card) card.scrollIntoView({ behavior: 'instant', block: 'nearest' });
  const boxLayer = card ? card.querySelector('.box-layer') : null;
  const lid = card ? card.querySelector('.box-lid') : null;
  const rect = card ? card.getBoundingClientRect() : { left: W / 2, top: H / 2, width: 280, height: 320 };
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  try {
    const requestPromise = apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/select-box`, {
      method: 'POST',
      body: JSON.stringify({ sessionCode: state.sessionCode, boxNumber })
    });

    const fx = true;
    const openAnim = getOpenAnimationProfile(state.gameSettings.boxOpenAnimation);

    // Use boxes-redesign opening rhythm: shake -> lid open.
    if (card) {
      card.style.pointerEvents = 'none';
      card.classList.add('opening-shake');
    }
    if (fx && boxLayer) boxLayer.style.animation = openAnim.boxAnim;
    await delay(openAnim.phase1Ms);
    if (card) card.classList.remove('opening-shake');
    if (card) {
      card.classList.add('opening-lid-wave');
      setTimeout(() => card.classList.remove('opening-lid-wave'), 680);
    }
    if (fx && lid) lid.style.animation = openAnim.lidAnim;
    if (fx && boxLayer) boxLayer.style.animation = '';

    await delay(openAnim.phase2Ms);
    const result = await requestPromise;

    const level = (result?.prize?.level || result?.prize?.status || 'NORMAL').toUpperCase();
    const unlucky = level === 'UNLUCKY';
    const isVip = level === 'VIP';

    const resolvedOpenImage = normalizePrizeImageUrl(
      result?.prize?.imageUrl
      || result?.prize?.prize_image
      || result?.prize?.image
      || state.sessionImageByBox?.[boxNumber]
      || ''
    );

    // Store prize state
    state.currentPrize = { ...(result?.prize || {}), boxNumber, image: resolvedOpenImage };
    state.currentWinBox = boxNumber;
    const prizeCurrency = result?.prize?.currency || result?.currency || 'VND';
    state.boxes[boxNumber] = {
      state: unlucky ? 'opened-bad' : 'opened-win',
      value: Number(result?.prize?.value || 0),
      name: result?.prize?.name || 'Phần thưởng',
      icon: result?.prize?.icon || '\uD83C\uDF81',
      image: resolvedOpenImage,
      isCash: isCashPrizeLike({ isCash: result?.prize?.isCash, value: result?.prize?.value }),
      isSpecial: !!(result?.prize?.isSpecial),
      level: result?.prize?.level || 'NORMAL',
      currency: prizeCurrency,
      category: result?.prize?.description || result?.prize?.category || '',
      decision: null
    };

    // Activate next box when this result does not enter a separate approval flow.
    if (!result?.requiresApproval) {
      const nextBox = state.openOrder.find((n) => state.boxes[n].state === 'inactive');
      if (nextBox) state.boxes[nextBox].state = 'active';
    }

    // Opening result effects aligned with boxes-redesign style.
    if (fx) {
      burst(cx, cy, isVip, true);
      if (!unlucky) mkConf(isVip ? 30 : 22, true);
    }

    const isVndCashPrize = !!(!unlucky
      && !result?.requiresApproval
      && prizeCurrency === 'VND'
      && isCashPrizeLike(state.boxes[boxNumber]));

    if (isVndCashPrize) {
      try {
        await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/convert`, {
          method: 'POST',
          body: JSON.stringify({ boxNumber, instant: true })
        });
        if (state.boxes[boxNumber]) state.boxes[boxNumber].decision = 'converted';
      } catch (convErr) {
        console.error('VND auto-convert failed:', convErr?.message || convErr);
      }
    }

    renderBoxes();

    if (!result?.requiresApproval) {
      await runOpenedCardRevealSequence(boxNumber, { unlucky });
    }

    const refreshPromise = Promise
      .all([refreshWallet(), loadPlayerInventory(), refreshTransactions()])
      .catch((refreshErr) => {
        console.error('Non-blocking refresh failed after openBox:', refreshErr?.message || refreshErr);
        return null;
      });

    if (unlucky) {
      await refreshPromise;
      showToast('😔 Chúc bạn may mắn lần sau!');
      return;
    }

    if (result?.requiresApproval) {
      await refreshPromise;
      await delay(220);
      showApprovalWaitScreen(state.currentPrize);
      return;
    }

    const isNoMoneyWinningPrize = !unlucky && Number(state.boxes?.[boxNumber]?.value || 0) <= 0;
    if (isNoMoneyWinningPrize) {
      await refreshPromise;
      showToast('🎁 Quà trúng không có phần tiền, hệ thống tự động chuyển qua hộp tiếp theo.');
      return;
    }

    if (isVndCashPrize && state.boxes[boxNumber]?.decision === 'converted') {
      showToast('✅ Tiền thưởng VND đã tự động cộng vào ví.');
    }

    setupWinOverlay(boxNumber);
    openWinOverlay(boxNumber);
    await refreshPromise;

  } catch (err) {
    const msg = String(err?.message || '');
    if (/403|forbidden|khong duoc|không được|khong the|không thể/i.test(msg)) {
      try {
        await Promise.all([refreshBoxesFromServer(), loadPlayerInventory()]);
      } catch (_) { }
      showToast('🔄 Trạng thái hộp vừa được cập nhật. Vui lòng thử mở lại hộp đang sáng.');
    } else {
      showToast(`❌ ${err.message}`);
    }
  } finally {
    if (card) card.classList.remove('opening-shake');
    if (boxLayer) boxLayer.style.animation = '';
    if (lid) lid.style.animation = '';
    state.loadingOpen = false;
  }
}

function nextAnimFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

async function runOpenedCardRevealSequence(boxNumber, options = {}) {
  const { unlucky = false } = options;
  const wrap = document.querySelector(`.box-wrap[data-box="${Number(boxNumber || 0)}"]`);
  const card = wrap ? wrap.querySelector('.gcard.is-opened') : null;
  if (!card) return;

  card.classList.remove('reveal-seq', 'reveal-shake', 'reveal-lid-open', 'reveal-prize', 'reveal-name', 'reveal-value', 'reveal-done');
  card.classList.add('reveal-seq');
  await nextAnimFrame();

  card.classList.add('reveal-shake');
  await delay(760);

  card.classList.remove('reveal-shake');
  card.classList.add('reveal-lid-open');
  await delay(560);

  card.classList.add('reveal-prize');
  await delay(460);

  card.classList.add('reveal-name');
  await delay(unlucky ? 360 : 420);

  card.classList.add('reveal-value');
  await delay(360);

  card.classList.add('reveal-done');
}

async function closeWin() {
  const winOv = document.getElementById('winOv');
  if (winOv) winOv.classList.remove('open');
  stopWinOverlayRefresh();

  const modal = document.querySelector('#winOv .wov-modal');
  if (modal) {
    modal.getAnimations().forEach((anim) => anim.cancel());
  }

  // For non-cash prizes, no extra decision is needed.
  // Allow opening the next box immediately without requiring page reload.
  const boxNum = Number(state.currentWinBox || 0);
  const box = state.boxes[boxNum];
  if (!box) return;
  if (isPendingApprovedCashBox(box)) {
    showApprovedConversionReminderModal(boxNum, { force: true });
    scheduleApprovedConversionReminder(boxNum);
  }
  const decision = String(box.decision || '').toLowerCase();
  const waitingSpecialApproval = !!(box.isSpecial && !box.specialApproved && !['confirmed', 'converted', 'declined'].includes(decision));
  if (!waitingSpecialApproval) {
    // Keep server/client in sync before enabling the next click after approval.
    if (box.isSpecial && box.specialApproved) {
      try {
        await Promise.all([refreshBoxesFromServer(), loadPlayerInventory()]);
      } catch (_) { }
    }
    activateNextBox();
  }
}

function getBoxInventoryRecord(boxNumber) {
  const target = Number(boxNumber || 0);
  if (!target || !Array.isArray(state.inventoryItems)) return null;
  return state.inventoryItems.find((item) => Number(item.box_number || item.boxNumber || 0) === target) || null;
}

function applyWinPreviewTone({ isVip, isUnlucky, isPending }) {
  const modal = document.querySelector('#winOv .wov-modal');
  if (!modal) return;
  modal.classList.remove('preview-vip', 'preview-unlucky', 'preview-pending');
  if (isVip) modal.classList.add('preview-vip');
  if (isUnlucky) modal.classList.add('preview-unlucky');
  if (isPending) modal.classList.add('preview-pending');
}

function getWinOverlaySourceRect(boxNumber) {
  const targetBox = Number(boxNumber || 0);
  if (!targetBox) return null;

  const wrap = document.querySelector(`.box-wrap[data-box="${targetBox}"]`);
  if (!wrap) return null;

  const sourceEl = wrap.querySelector('.img-shell img, .img-shell .emoji-fallback, .img-shell .cry-shell, .box-area .result-media-shell, .box-area .result-reward-layer, .box-area .result-reward-image, .box-area .result-reward-icon');
  if (!sourceEl) return null;

  const rect = sourceEl.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) return null;
  return rect;
}

function openWinOverlay(boxNumber) {
  const winOv = document.getElementById('winOv');
  const modal = document.querySelector('#winOv .wov-modal');
  if (!winOv || !modal) return;

  modal.getAnimations().forEach((anim) => anim.cancel());
  const sourceRect = getWinOverlaySourceRect(boxNumber);

  winOv.classList.add('open');
  startWinOverlayRefresh(boxNumber);

  if (!sourceRect) return;

  const modalRect = modal.getBoundingClientRect();
  if (!modalRect || modalRect.width <= 0 || modalRect.height <= 0) return;

  const sourceCenterX = sourceRect.left + (sourceRect.width / 2);
  const sourceCenterY = sourceRect.top + (sourceRect.height / 2);
  const modalCenterX = modalRect.left + (modalRect.width / 2);
  const modalCenterY = modalRect.top + (modalRect.height / 2);

  const dx = sourceCenterX - modalCenterX;
  const dy = sourceCenterY - modalCenterY;
  const rawScale = Math.min(sourceRect.width / modalRect.width, sourceRect.height / modalRect.height);
  const startScale = Math.max(0.16, Math.min(0.92, rawScale || 0.2));

  modal.animate([
    {
      transform: `translate(${dx}px, ${dy}px) scale(${startScale})`,
      opacity: 0.16,
      filter: 'blur(3px)'
    },
    {
      transform: 'translate(0, 0) scale(1.035)',
      opacity: 1,
      filter: 'blur(0)'
    },
    {
      transform: 'translate(0, 0) scale(1)',
      opacity: 1,
      filter: 'blur(0)'
    }
  ], {
    duration: 620,
    easing: 'cubic-bezier(.16,.9,.28,1)',
    fill: 'both'
  });
}

function stopWinOverlayRefresh() {
  if (!state.winOverlayRefreshTimer) return;
  clearTimeout(state.winOverlayRefreshTimer);
  state.winOverlayRefreshTimer = null;
}

function startWinOverlayRefresh(boxNumber) {
  stopWinOverlayRefresh();
  const targetBox = Number(boxNumber || 0);
  if (!targetBox) return;

  state.winOverlayRefreshTimer = setTimeout(async () => {
    const winOv = document.getElementById('winOv');
    if (!winOv || !winOv.classList.contains('open')) {
      stopWinOverlayRefresh();
      return;
    }

    const currentBox = Number(state.currentWinBox || targetBox || 0);
    const current = state.boxes[currentBox] || {};
    const currentDecision = String(current.decision || '').toLowerCase();
    const currentStatus = String(current.processingStatus || current.status || '').toLowerCase();
    const shouldTrack = (!!current.isSpecial && !current.specialApproved)
      || currentStatus === 'pending_approval'
      || currentStatus === 'exchanged'
      || currentDecision === 'exchanged';

    if (!shouldTrack) {
      stopWinOverlayRefresh();
      return;
    }

    try {
      await Promise.all([refreshBoxesFromServer(), loadPlayerInventory()]);
      setupWinOverlay(currentBox);
    } catch (_) {}
    state.winOverlayRefreshTimer = null;
  }, 1200);
}

function buildPreviewTimelineHtml(boxNumber, box, options = {}) {
  const {
    decision = '',
    isUnluckyBox = false,
    isCash = false,
    isSpecialApproved = false,
    currency = 'VND',
    amount = 0
  } = options;
  const inv = getBoxInventoryRecord(boxNumber);
  const openedAt = formatDateTime(inv?.createdAt || inv?.created_at || null);
  const events = [];
  const _m = window.__manualTextMap || null;
  const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);

  events.push({
    cls: 'ok',
    text: `${_tx('Phần thưởng')} #${Number(boxNumber || 0)} ${_tx('đã được mở thành công') || 'đã được mở thành công'}`,
    time: openedAt !== '--' ? openedAt : _tx('Vừa xong')
  });

  if (isUnluckyBox) {
    events.push({
      cls: 'fail',
      text: _tx('Kết quả UNLUCKY - hộp quà không có phần thưởng khả dụng'),
      time: _tx('Kết quả tức thì') || 'Kết quả tức thì'
    });
  } else {
    const valueText = Number(amount || 0) > 0
      ? formatCurrency(amount, currency)
      : (_tx('Quà hiện vật') || 'Quà hiện vật');
    events.push({
      cls: 'ok',
      text: `${_tx('Phần thưởng')}: ${box?.name || _tx('Phần thưởng')} • ${valueText}`,
      time: _tx('Đã ghi nhận vào phiên')
    });
  }

  if (box?.isSpecial && !isSpecialApproved) {
    events.push({
      cls: 'pending',
      text: _tx('Đang chờ admin duyệt phần thưởng đặc biệt'),
      time: _tx('Đang chờ duyệt')
    });
  }

  if (decision === 'exchanged') {
    events.push({
      cls: 'pending',
      text: _tx('Yêu cầu quy đổi đã gửi, chờ CSKH xử lý'),
      time: _tx('Đang chờ duyệt')
    });
  } else if (decision === 'converted') {
    events.push({
      cls: 'ok',
      text: isCash ? _tx('Đã quy đổi và cộng vào ví thành công') : _tx('Đã xác nhận xử lý phần thưởng'),
      time: _tx('Hoàn tất')
    });
  } else if (decision === 'declined') {
    events.push({
      cls: 'fail',
      text: _tx('Người chơi đã từ chối quy đổi phần thưởng này'),
      time: _tx('Đã đóng xử lý')
    });
  }

  return events.map((evt) => `
    <div class="wpreview-event ${evt.cls}">
      <span class="dot"></span>
      <div class="txt">${esc(evt.text)}</div>
      <div class="time">${esc(evt.time || '--')}</div>
    </div>
  `).join('');
}

function shareCurrentPrizePreview() {
  const boxNumber = Number(state.currentWinBox || 0);
  const box = state.boxes?.[boxNumber] || {};
  if (!boxNumber || !box) {
    showToast('Không tìm thấy dữ liệu hộp quà để chia sẻ.');
    return;
  }

  const currency = box.currency || 'VND';
  const amount = Number(box.value || 0);
  const valueText = amount > 0 ? formatCurrency(amount, currency) : 'Quà hiện vật';
  const level = String(box.level || 'NORMAL').toUpperCase();
  const shareText = `Phiên ${state.sessionCode || ''} | Hộp #${boxNumber}\nPhần thưởng: ${box.name || 'Phần thưởng'}\nGiá trị: ${valueText}\nMức độ: ${level}`;

  if (navigator.share) {
    navigator.share({
      title: `Kết quả hộp quà #${boxNumber}`,
      text: shareText
    }).catch(() => {});
    return;
  }

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(shareText)
      .then(() => showToast('Đã sao chép nội dung chia sẻ vào clipboard.'))
      .catch(() => showToast('Không thể sao chép nội dung chia sẻ.'));
    return;
  }

  showToast('Thiết bị không hỗ trợ chia sẻ nhanh.');
}

function downloadCurrentPrizeImage() {
  const boxNumber = Number(state.currentWinBox || 0);
  const box = state.boxes?.[boxNumber] || {};
  const imageUrl = String(box.image || '').trim();
  if (!imageUrl) {
    showToast('Phần quà này không có ảnh để tải.');
    return;
  }

  const filenameSafe = String(box.name || `box-${boxNumber}`)
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '_')
    .slice(0, 60);

  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `${filenameSafe || `box-${boxNumber}`}.jpg`;
  link.target = '_blank';
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Populate the fullscreen win overlay for a given box
function setupWinOverlay(boxNumber) {
  state.currentWinBox = boxNumber;
  const box = state.boxes[boxNumber] || {};
  const hasPrizeImage = !!String(box.image || '').trim();
  const isCash = isCashPrizeLike(box);
  const isSpecialApproved = !!box.specialApproved;
  const isVip = box.level === 'VIP' || box.isSpecial;
  const statusLower = String(box.status || box.processingStatus || '').toLowerCase();
  const decision = String(
    box.decision
    || (statusLower === 'exchanged' ? 'exchanged' : '')
    || (statusLower === 'converted' ? 'converted' : '')
    || (statusLower === 'declined' ? 'declined' : '')
  ).toLowerCase();
  const isUnluckyBox = box.state === 'opened-bad' || String(box.level || '').toUpperCase() === 'UNLUCKY';
  const currency = box.currency || 'VND';
  const amount = Number(box.value || 0);
  const valueText = amount > 0 ? formatCurrency(amount, currency) : 'Quà hiện vật';
  const approxRate = currency === 'USD' ? 26000 : currency === 'NDT' ? 3800 : 0;
  const approxVndText = (amount > 0 && approxRate > 0)
    ? ` (≈ ${Math.round(amount * approxRate).toLocaleString('vi-VN')} VND)`
    : '';
  const valueTextWithApprox = `${valueText}${approxVndText}`;
  const statusText = isUnluckyBox
    ? 'Xui lỗi'
    : (box.isSpecial && !isSpecialApproved
      ? 'Đang chờ admin duyệt'
      : getStatusText({
        level: box.level,
        decision: box.decision,
        status: box.status || (box.decision === 'exchanged' ? 'exchanged' : 'obtained')
      }));
  const decisionText = decision === 'converted'
    ? 'Đã quy đổi'
    : decision === 'declined'
      ? 'Đã từ chối'
      : decision === 'exchanged'
        ? 'Đang chờ CSKH'
        : (box.isSpecial && !isSpecialApproved ? 'Chờ duyệt' : 'Chưa xử lý');

  const processingStatusLabels = {
    obtained:         { label: 'Chờ xử lý',         cls: 'wstatus-pending'   },
    pending_approval: { label: 'Đang xử lý',         cls: 'wstatus-pending'   },
    confirmed:        { label: 'Đã xác nhận',        cls: 'wstatus-confirmed' },
    converted:        { label: 'Đã quy đổi',         cls: 'wstatus-done'      },
    declined:         { label: 'Đã từ chối',         cls: 'wstatus-declined'  },
    rejected:         { label: 'Bị từ chối',         cls: 'wstatus-declined'  },
    claimed:          { label: 'Đã nhận thưởng',     cls: 'wstatus-done'      },
    exchanged:        { label: 'Đang chờ CSKH',      cls: 'wstatus-pending'   },
    banned:           { label: 'Bị khóa',            cls: 'wstatus-declined'  }
  };
  const rawProcStatus = String(box.processingStatus || '').toLowerCase();
  const procInfo = processingStatusLabels[rawProcStatus] || processingStatusLabels.obtained;
  const procLabel = procInfo.label;
  const procCls   = procInfo.cls;

  applyWinPreviewTone({
    isVip,
    isUnlucky: isUnluckyBox,
    isPending: !!(box.isSpecial && !isSpecialApproved)
  });

  const sessEl = document.getElementById('wSessionCode');
  if (sessEl) sessEl.textContent = state.sessionCode || '';

  const iconEl = document.getElementById('wPrizeIcon');
  if (iconEl) {
    iconEl.innerHTML = renderPrizeVisualHtml(hasPrizeImage ? box.image : '', box.icon || '🎁', 'wprize-img', box.name || 'Phần thưởng');
    iconEl.style.display = '';
  }

  const wCardEl = document.querySelector('.wcard');
  if (wCardEl) {
    if (hasPrizeImage) {
      wCardEl.classList.add('has-prize-bg');
      wCardEl.style.setProperty('--wcard-prize-bg', `url("${String(box.image).replace(/"/g, '\\"')}")`);
    } else {
      wCardEl.classList.remove('has-prize-bg');
      wCardEl.style.removeProperty('--wcard-prize-bg');
    }
  }

  const nameEl = document.getElementById('wPrizeName');
  if (nameEl) nameEl.textContent = box.name || 'Phần thưởng';

  const categEl = document.getElementById('wPrizeCategory');
  if (categEl) { categEl.textContent = box.category || ''; categEl.style.display = box.category ? '' : 'none'; }

  const tagsEl = document.getElementById('wPreviewTags');
  if (tagsEl) {
    const tags = [];
    tags.push(`<span class="wpreview-tag${isVip ? ' accent' : ''}">${esc(String(box.level || (isUnluckyBox ? 'UNLUCKY' : 'NORMAL')).toUpperCase())}</span>`);
    tags.push(`<span class="wpreview-tag">${isCash ? 'Tiền mặt' : 'Hiện vật'}</span>`);
    tags.push(`<span class="wpreview-tag">${esc(currency)}</span>`);
    if (box.isSpecial) tags.push('<span class="wpreview-tag accent">Special</span>');
    tagsEl.innerHTML = tags.join('');
  }

  const metaEl = document.getElementById('wPreviewMeta');
  if (metaEl) {
    metaEl.innerHTML = `
      <div class="wmeta-item"><span class="lbl">Hộp quà</span><span class="val">#${Number(boxNumber || 0)}</span></div>
      <div class="wmeta-item"><span class="lbl">Giá trị</span><span class="val">${esc(valueTextWithApprox)}</span></div>
      <div class="wmeta-item"><span class="lbl">Trạng thái</span><span class="val"><span class="wstatus-badge ${procCls}">${esc(procLabel)}</span></span></div>
      <div class="wmeta-item"><span class="lbl">Quyết định</span><span class="val">${esc(decisionText)}</span></div>
    `;
  }

  const timelineEl = document.getElementById('wPreviewTimeline');
  if (timelineEl) {
    timelineEl.innerHTML = buildPreviewTimelineHtml(boxNumber, box, {
      decision,
      isUnluckyBox,
      isCash,
      isSpecialApproved,
      currency,
      amount
    });
  }

  const levelEl = document.getElementById('wLevelBadge');
  if (levelEl) {
    if (isUnluckyBox) {
      levelEl.className = 'wlevel unlucky';
      levelEl.textContent = state.gameSettings.losePopupTitle || '😢 Chúc bạn may mắn lần sau!';
    } else if (isVip) {
      levelEl.className = 'wlevel vip';
      levelEl.textContent = state.gameSettings.winPopupTitle || '👑 GIẢI THƯỞNG VIP!';
    } else {
      levelEl.className = 'wlevel lucky';
      levelEl.textContent = state.gameSettings.winPopupTitle || '🎁 GIẢI THƯỞNG MAY MẮN!';
    }
  }

  const actionEl = document.getElementById('wActionBox');
  if (actionEl) {
    actionEl.className = '';
    const _m = window.__manualTextMap || null;
    const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);
    const isNonCashSpecialApproved = !!(box.isSpecial && isSpecialApproved && !isCash);
    const showCskhBtn = !isUnluckyBox;
    const viewImageBtn = hasPrizeImage
      ? `<button class="wab-view-image-btn" type="button" onclick="viewPrizeImage(${boxNumber})">🖼️ ${_tx('🖼️ Xem kỹ hình ảnh').replace('🖼️ ','') || 'Xem kỹ hình ảnh'}</button>`
      : '';
    const cskhLabel = _tx('Nhắn CSKH');
    const cskhBtn = showCskhBtn
      ? `<button class="wab-cskh-btn" onclick="openChatWithPrizeInfo(${boxNumber})"><i class="wab-cskh-icon">💬</i> ${cskhLabel}</button>`
      : '';
    if (isUnluckyBox) {
      actionEl.innerHTML = `<div class="wab-declined">😔 ${_tx('😔 Chúc bạn may mắn lần sau!').replace('😔 ','') || 'Chúc bạn may mắn lần sau!'}</div>`;
    } else if (box.isSpecial && !isSpecialApproved) {
      // Special prize pending approval
      actionEl.innerHTML = `<div class="wab-cskh"><div class="wab-cskh-title">⭐ ${_tx('⭐ Phần thưởng đặc biệt!').replace('⭐ ','') || 'Phần thưởng đặc biệt!'}</div><div class="wab-cskh-body">${_tx('Quà của bạn đang được admin xem xét và duyệt.') || 'Quà của bạn đang được admin xem xét và duyệt.'}</div><div class="wab-cskh-body">${_tx('Vui lòng không tắt trang và chờ thông báo.') || 'Vui lòng không tắt trang và chờ thông báo.'}</div></div>${cskhBtn}`;
    } else if (isCash) {
      // Cash prize: show convert/decline buttons with currency awareness
      const currencySymbol = currency === 'USD' ? '$' : currency === 'NDT' ? '¥' : '';
      const amtStr = Number(box.value || 0).toLocaleString('vi-VN');
      const displayAmt = currency !== 'VND' ? `${currencySymbol}${amtStr} ${currency}` : `${amtStr} VNĐ`;
      const isAutoVndConverted = currency === 'VND' && decision === 'converted';
      if (isAutoVndConverted) {
        actionEl.innerHTML = `<div class="wab-converted" style="margin-bottom:10px">✅ ${_tx('Đã quy đổi và cộng vào ví thành công') || ('Đã tự động cộng ' + displayAmt + ' vào ví')}</div>${viewImageBtn}${cskhBtn}`;
        if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
        return;
      }
      const isExchanged = decision === 'exchanged';
      const convertedHint = (decision === 'converted' && currency === 'VND')
        ? `<div class="wab-converted" style="margin-bottom:10px">✅ ${_tx('Đã quy đổi và cộng vào ví thành công') || ('Đã quy đổi ' + displayAmt + ' vào ví')}</div>`
        : '';
      const pendingHint = isExchanged
        ? `<div class="wab-cskh wab-cskh-pending" style="margin-bottom:10px"><div class="wab-cskh-title">⏳ ${_tx('Yêu cầu quy đổi đã gửi, chờ CSKH xử lý') || ('Yêu cầu quy đổi ' + displayAmt + ' đang chờ CSKH xử lý')}</div><div class="wab-cskh-body">${_tx('Vui lòng liên hệ CSKH để hoàn tất quy đổi.') || 'Vui lòng liên hệ CSKH để hoàn tất.'}</div></div>`
        : '';
      const declinedHint = decision === 'declined'
        ? `<div class="wab-declined" style="margin-bottom:10px">✕ ${_tx('Đã đóng xử lý') || 'Đã từ chối quy đổi'}</div>`
        : '';
      const isConverted = decision === 'converted';
      const isDeclined = decision === 'declined';
      const declineForbidden = currency === 'NDT';
      const disabled = isConverted || isDeclined || isExchanged;
      const btnLabel = isConverted ? _tx('✅ Đã quy đổi') : isExchanged ? _tx('⏳ Đang chờ duyệt') : (isDeclined ? _tx('✕ Đã từ chối') : _tx('💱 Quy đổi ngay'));
      const declineLabel = _tx('Từ chối');
      const cashTitle = _tx('💰 Quy đổi tiền mặt');
      const rateLabel = currency !== 'VND' ? `<div class="wab-cash-rate" style="font-size:0.85em;color:#888;margin-top:2px">${_tx('Tỷ giá') || 'Tỷ giá'}: 1 ${currency} = ${(currency === 'USD' ? 26000 : 3800).toLocaleString('vi-VN')} VND</div>` : '';
      actionEl.innerHTML = `<div class="wab-cash">${convertedHint}${pendingHint}${declinedHint}<div class="wab-cash-title">${cashTitle}</div><div class="wab-cash-amt">${displayAmt}</div>${rateLabel}${declineForbidden ? '<div class="wab-cash-rate" style="font-size:0.85em;color:#f59e0b;margin-top:6px"> </div>' : ''}<div class="wab-cash-btns"><button class="wab-btn-convert" onclick="winConvertNow()" ${disabled ? 'disabled' : ''}>${btnLabel}</button><button class="wab-btn-decline" onclick="winDeclineNow()" ${(disabled || declineForbidden) ? 'disabled' : ''}>${declineLabel}</button></div></div>${viewImageBtn}${cskhBtn}`;
    } else {
      // Non-cash prize (including approved special non-cash)
      const congratsMsg = _tx('Chúc mừng Quý khách đã đạt được giải thưởng');
      const cskhInstr = _tx('Vui lòng liên hệ bộ phận CSKH để nhận thưởng.');
      actionEl.innerHTML = `<div class="wab-cskh"><div class="wab-cskh-title">✅ ${congratsMsg} ${esc(box.name || _tx('Phần thưởng'))}.</div><div class="wab-cskh-body">${cskhInstr}</div></div>${viewImageBtn}${cskhBtn}`;
    }
  }
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}

function viewPrizeImage(boxNumber) {
  const box = state.boxes?.[boxNumber] || {};
  const imageUrl = String(box.image || '').trim();
  if (!imageUrl) { showToast('Không có ảnh chi tiết cho phần thưởng này.'); return; }
  const lb = document.getElementById('wovLightbox');
  const img = document.getElementById('wovLbImg');
  if (!lb || !img) return;
  img.src = imageUrl;
  img.alt = box.name || 'Phần thưởng';
  lb.classList.add('open');
}

function closePrizeLightbox(e) {
  if (e && e.target !== e.currentTarget) return;
  const lb = document.getElementById('wovLightbox');
  if (lb) lb.classList.remove('open');
}

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderPrizeVisualHtml(imageUrl, icon = '🎁', imgClass = '', alt = 'Phần thưởng') {
  const safeAlt = esc(alt || 'Phần thưởng');
  const raw = normalizePrizeImageUrl(imageUrl);
  const safeIcon = esc(icon || '🎁');
  if (raw) {
    const safeUrl = esc(raw);
    const cls = imgClass ? ` class="${imgClass}"` : '';
    return `<img${cls} src="${safeUrl}" alt="${safeAlt}" loading="lazy" decoding="async" onerror="this.onerror=null;this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='inline-flex';}"><span class="result-reward-icon result-reward-icon-prize" style="display:none">${safeIcon}</span>`;
  }
  return `<span class="result-reward-icon result-reward-icon-prize">${safeIcon}</span>`;
}

function captureResult() {
  const boxNumber = Number(state.currentWinBox || 0);
  const box = state.boxes?.[boxNumber] || {};
  if (!boxNumber) {
    showToast('Không có dữ liệu để chụp ảnh kết quả.');
    return;
  }

  const canvas = document.createElement('canvas');
  const w = 1080;
  const h = 1620;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    showToast('Thiết bị không hỗ trợ tạo ảnh kết quả.');
    return;
  }

  const currency = box.currency || 'VND';
  const amount = Number(box.value || 0);
  const valueText = amount > 0 ? formatCurrency(amount, currency) : 'Quà hiện vật';
  const statusText = getStatusText({
    level: box.level,
    decision: box.decision,
    status: box.status || 'obtained'
  });
  const sessionCode = state.sessionCode || '--';

  const drawRoundedRect = (x, y, width, height, radius, fillStyle) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  const loadImageForCanvas = (src) => new Promise((resolve) => {
    const raw = normalizePrizeImageUrl(src);
    if (!raw) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const done = (ok) => resolve(ok ? img : null);
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.src = raw;
    setTimeout(() => done(false), 5000);
  });

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(1, '#111827');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Decorative glow
  const glow = ctx.createRadialGradient(w * 0.9, h * 0.12, 20, w * 0.9, h * 0.12, 420);
  glow.addColorStop(0, 'rgba(59,130,246,0.22)');
  glow.addColorStop(1, 'rgba(59,130,246,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  drawRoundedRect(64, 64, w - 128, h - 128, 38, 'rgba(17,24,39,0.88)');

  ctx.fillStyle = '#93c5fd';
  ctx.font = '700 36px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.fillText('KET QUA MO HOP QUA', 108, 156);

  ctx.fillStyle = '#e5e7eb';
  ctx.font = '800 54px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.fillText(`#${boxNumber} ${String(box.name || 'Phan thuong')}`, 108, 228);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 30px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.fillText(`Ma phien: ${sessionCode}`, 108, 284);

  drawRoundedRect(96, 330, w - 192, 640, 30, 'rgba(30,41,59,0.72)');

  const prizeImageUrl = String(box.image || '').trim();
  loadImageForCanvas(prizeImageUrl).then((img) => {
    if (img) {
      const cardX = 126;
      const cardY = 360;
      const cardW = w - 252;
      const cardH = 580;
      drawRoundedRect(cardX, cardY, cardW, cardH, 22, '#0b1220');
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cardX + 22, cardY);
      ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, 22);
      ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, 22);
      ctx.arcTo(cardX, cardY + cardH, cardX, cardY, 22);
      ctx.arcTo(cardX, cardY, cardX + cardW, cardY, 22);
      ctx.closePath();
      ctx.clip();

      const scale = Math.max(cardW / img.width, cardH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = cardX + (cardW - dw) / 2;
      const dy = cardY + (cardH - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    } else {
      drawRoundedRect(126, 360, w - 252, 580, 22, 'rgba(51,65,85,0.72)');
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '700 44px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillText('KHONG CO ANH PHAN QUA', 210, 660);
    }

    drawRoundedRect(96, 1004, w - 192, 238, 24, 'rgba(15,23,42,0.92)');
    ctx.fillStyle = '#a5b4fc';
    ctx.font = '700 30px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(`Gia tri: ${valueText}`, 132, 1068);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 30px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(`Trang thai: ${statusText}`, 132, 1128);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 26px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText(`Thoi gian: ${new Date().toLocaleString('vi-VN')}`, 132, 1188);

    ctx.fillStyle = 'rgba(148,163,184,0.9)';
    ctx.font = '600 22px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText('Giftbox Game • Ket qua minh bach', 108, h - 86);

    const safeName = String(box.name || `hop-${boxNumber}`)
      .replace(/[\\/:*?"<>|]+/g, '-')
      .replace(/\s+/g, '_')
      .slice(0, 60);
    const filename = `ket-qua-${safeName || `hop-${boxNumber}`}.png`;

    const triggerDownload = (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('📷 Đã chụp và tải ảnh kết quả.');
    };

    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('Không thể tạo ảnh kết quả. Vui lòng thử lại.');
          return;
        }
        triggerDownload(blob);
      }, 'image/png', 0.95);
      return;
    }

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('📷 Đã chụp và tải ảnh kết quả.');
    } catch (_) {
      showToast('Không thể tạo ảnh kết quả. Vui lòng thử lại.');
    }
  });
}

function activateNextBox() {
  if (updateGameLockByApprovedPendingCash()) {
    renderBoxes();
    return;
  }

  const nextBox = state.openOrder.find((n) => state.boxes[n].state === 'inactive');
  if (nextBox) {
    state.boxes[nextBox].state = 'active';
    renderBoxes();
  }
}

function openNextAvailableBox() {
  if (updateGameLockByApprovedPendingCash()) {
    const pendingBox = getPendingApprovedCashBoxNumber();
    showToast(`⏳ ${getGameLockNoticeText()}.`);
    if (pendingBox) showApprovedConversionReminderModal(pendingBox, { force: true });
    return;
  }

  if (state.loadingOpen) return;
  const nextActive = state.openOrder.find((n) => state.boxes[n].state === 'active');
  if (!nextActive) {
    showToast('ℹ️ Hiện chưa có hộp sẵn sàng để mở.', { type: 'info', duration: 2600 });
    return;
  }
  closeWin();
  setTimeout(() => {
    openBox(nextActive).catch(() => {});
  }, 120);
}

// "Quy đổi ngay" — instant convert for VND, or pending for USD/NDT
async function winConvertNow() {
  const box = Number(state.currentWinBox || 0);
  if (!box) return;
  const boxData = state.boxes[box] || {};
  const currency = boxData.currency || 'VND';
  const _m = window.__manualTextMap || null;
  const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);
  // Update action box to show loading state
  const actionEl = document.getElementById('wActionBox');
  if (actionEl) actionEl.innerHTML = `<div class="wab-converted">${_tx('⏳ Đang quy đổi...')}</div>`;

  try {
    let result;
    await withLoadingOverlay('Đang quy đổi phần thưởng...', async () => {
      result = await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/convert`, {
        method: 'POST',
        body: JSON.stringify({ boxNumber: box, instant: true })
      });
    });

    if (result?.pendingApproval) {
      // USD/NDT: pending CSKH approval — lock remaining boxes until approved.
      if (state.boxes[box]) {
        state.boxes[box].decision = 'exchanged';
        state.boxes[box].status = 'exchanged';
        state.boxes[box].processingStatus = 'exchanged';
      }
      stopApprovedConversionReminder(box);
      const currencySymbol = currency === 'USD' ? '$' : '¥';
      const amtStr = Number(boxData.value || 0).toLocaleString('vi-VN');
      if (actionEl) actionEl.innerHTML = `<div class="wab-cskh wab-cskh-pending"><div class="wab-cskh-title">⏳ ${_tx('Yêu cầu quy đổi đã gửi, chờ CSKH xử lý') || ('Yêu cầu quy đổi ' + currencySymbol + amtStr + ' ' + currency + ' đã được gửi')}</div><div class="wab-cskh-body">${_tx('Vui lòng liên hệ CSKH để hoàn tất quy đổi.') || 'Vui lòng liên hệ CSKH để hoàn tất quy đổi.'}</div></div><button class="wab-cskh-btn" onclick="openChatWithPrizeInfo(${box})"><i class="wab-cskh-icon">💬</i> ${_tx('Liên hệ CSKH ngay')}</button>`;
      invalidateSessionEconomyBurstCache(state.sessionCode);
      await Promise.all([refreshBoxesFromServer(), loadPlayerInventory(), refreshWallet()]);
      renderBoxes();
      showToast(`⏳ ${_tx('Yêu cầu quy đổi đã gửi, chờ CSKH xử lý') || 'Yêu cầu quy đổi đã gửi. Vui lòng liên hệ CSKH!'}`);
    } else {
      // Instant convert — allow next box
      if (state.boxes[box]) state.boxes[box].decision = 'converted';
      stopApprovedConversionReminder(box);
      const val = Number(state.boxes[box]?.value || 0);
      const fmtAmt = currency !== 'VND'
        ? `${currency === 'USD' ? '$' : '¥'}${val.toLocaleString('vi-VN')} ${currency}`
        : `${val.toLocaleString('vi-VN')} VNĐ`;
      if (actionEl) actionEl.innerHTML = `<div class="wab-converted">✅ ${_tx('Đã quy đổi và cộng vào ví thành công') || ('Đã quy đổi ' + fmtAmt + ' vào ví')}</div>`;
      invalidateSessionEconomyBurstCache(state.sessionCode);
      await Promise.all([refreshBoxesFromServer(), loadPlayerInventory(), refreshWallet()]);
      activateNextBox();
      showToast(`✅ ${_tx('Đã quy đổi thành tiền trong ví!')}`);
    }
  } catch (err) {
    setupWinOverlay(box);
    showToast(`❌ ${err.message}`);
  }
}

// "Từ chối" — decline cash convert, allow opening next box (do NOT lock game)
async function winDeclineNow() {
  const box = Number(state.currentWinBox || 0);
  if (!box) return;
  const boxData = state.boxes[box] || {};
  const currency = boxData.currency || 'VND';
  const _m = window.__manualTextMap || null;
  const _tx = (s) => (_m ? (translateExactTextByMap(s, _m) || s) : s);
  if (currency === 'NDT') {
    showToast('❌ NDT bắt buộc gửi admin duyệt, không thể từ chối trực tiếp.');
    return;
  }

  // Update overlay to show pending decline state
  const actionEl = document.getElementById('wActionBox');
  if (actionEl) actionEl.innerHTML = `<div class="wab-declined">${_tx('⏳ Đang ghi nhận từ chối...')}</div>`;

  try {
    await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/convert`, {
      method: 'POST',
      body: JSON.stringify({ boxNumber: box, decline: true })
    });

    if (state.boxes[box]) state.boxes[box].decision = 'declined';
    stopApprovedConversionReminder(box);
    if (actionEl) actionEl.innerHTML = `<div class="wab-declined">${_tx('× Đã từ chối quy đổi tiền mặt')}</div>`;

    await Promise.all([refreshBoxesFromServer(), loadPlayerInventory(), refreshTransactions()]);
    activateNextBox();

    setTimeout(() => {
      closeWin();
    }, 500);
  } catch (err) {
    setupWinOverlay(box);
    showToast(`❌ ${err.message}`);
  }
}

// Reopen win overlay for an already-opened box (from eye icon)
function reopenWinOptions(boxNumber) {
  if (!state.gameSettings.allowReopenPopup) return;
  if (!state.boxes[boxNumber] || state.boxes[boxNumber].state === 'inactive') return;
  if (state.boxes[boxNumber].state === 'opened-bad') {
    showToast('😔 Chúc bạn may mắn lần sau!');
    return;
  }
  setupWinOverlay(boxNumber);
  openWinOverlay(boxNumber);
}

// ===== Approval Waiting Screen =====

const APPROVAL_AI_REMINDERS = [
  'Mình đang theo dõi trạng thái duyệt cho bạn theo thời gian thực.',
  'Bạn cứ giữ màn hình này, khi admin duyệt mình sẽ báo ngay lập tức.',
  'Nếu mạng chậm, hệ thống vẫn tự đồng bộ lại để không bỏ lỡ kết quả.',
  'Trong lúc chờ, bạn không cần thao tác gì thêm, mình đang hỗ trợ bạn.'
];

const APPROVAL_PROGRESS_STAGES = [
  'Đang gửi yêu cầu...',
  'Đang chờ duyệt...',
  'Sắp xong...'
];

function scheduleApprovalUiFrame(task) {
  if (typeof task !== 'function') return;
  if (state.approvalUiRafId) {
    cancelAnimationFrame(state.approvalUiRafId);
  }
  state.approvalUiRafId = requestAnimationFrame(() => {
    state.approvalUiRafId = 0;
    task();
  });
}

function clearApprovalStageTimers() {
  if (state.approvalStageTimerId) {
    clearTimeout(state.approvalStageTimerId);
    state.approvalStageTimerId = null;
  }
  if (state.approvalLongWaitHintTimerId) {
    clearTimeout(state.approvalLongWaitHintTimerId);
    state.approvalLongWaitHintTimerId = null;
  }
}

function startApprovalProgressiveStatus() {
  clearApprovalStageTimers();
  const titleEl = document.getElementById('awTitle');
  if (!titleEl) return;

  const stages = APPROVAL_PROGRESS_STAGES.map((text) => window.__manualTextMap ? translateExactTextByMap(text, window.__manualTextMap) : text);
  let idx = 0;

  const applyStage = () => {
    if (!isApprovalScreenVisible()) return;
    titleEl.textContent = stages[Math.min(idx, stages.length - 1)] || 'Đang chờ phê duyệt...';
    if (idx < stages.length - 1) {
      idx += 1;
      state.approvalStageTimerId = setTimeout(applyStage, 1300);
    }
  };

  applyStage();

  state.approvalLongWaitHintTimerId = setTimeout(() => {
    if (!isApprovalScreenVisible()) return;
    const noteEl = document.getElementById('awNote');
    if (noteEl) {
      noteEl.textContent = contentTextGlobal('approvalLongWaitHint', 'Đang xử lý, vui lòng chờ...');
    }
  }, 5000);
}

function prewarmResultOverlayShell() {
  const winOv = document.getElementById('winOv');
  if (!winOv || winOv.dataset.prewarmed === '1') return;
  winOv.dataset.prewarmed = '1';

  const modal = winOv.querySelector('.wov-modal');
  if (modal) modal.style.willChange = 'transform, opacity';

  const actionBox = document.getElementById('wActionBox');
  if (actionBox && !actionBox.dataset.prepared) {
    actionBox.dataset.prepared = '1';
    const placeholder = document.createElement('div');
    placeholder.className = 'wab-pending';
    placeholder.style.display = 'none';
    actionBox.appendChild(placeholder);
  }
}

function showApprovalScreenSmooth(screen) {
  if (!screen) return;
  if (screen.classList.contains('is-visible')) return;
  screen.style.display = 'flex';
  scheduleApprovalUiFrame(() => {
    screen.classList.remove('is-hiding');
    screen.classList.add('is-visible');
  });
}

function hideApprovalScreenSmooth(screen) {
  if (!screen) return;
  if (!screen.classList.contains('is-visible')) {
    screen.style.display = 'none';
    return;
  }

  screen.classList.remove('is-visible');
  screen.classList.add('is-hiding');
  setTimeout(() => {
    screen.classList.remove('is-hiding');
    screen.style.display = 'none';
  }, 160);
}

function clearApprovalTypingEffect() {
  if (state.approvalTypingIntervalId) {
    clearInterval(state.approvalTypingIntervalId);
    state.approvalTypingIntervalId = null;
  }
  if (state.approvalTypingCursorTimeoutId) {
    clearTimeout(state.approvalTypingCursorTimeoutId);
    state.approvalTypingCursorTimeoutId = null;
  }
}

function typeApprovalReminderText(message) {
  const reminderEl = document.getElementById('awRobotReminder');
  if (!reminderEl) return;

  clearApprovalTypingEffect();
  reminderEl.classList.add('typing-active');
  reminderEl.textContent = '';

  const text = String(message || '');
  if (!text) {
    reminderEl.classList.remove('typing-active');
    return;
  }

  let idx = 0;
  state.approvalTypingIntervalId = setInterval(() => {
    idx += 1;
    reminderEl.textContent = text.slice(0, idx);
    if (idx >= text.length) {
      clearApprovalTypingEffect();
      state.approvalTypingCursorTimeoutId = setTimeout(() => {
        reminderEl.classList.remove('typing-active');
      }, 550);
    }
  }, 40);
}

function updateApprovalRobotReminder(forceStep) {
  const reminderEl = document.getElementById('awRobotReminder');
  if (!reminderEl) return;
  if (typeof forceStep === 'number') state.approvalReminderIndex = forceStep;
  const idx = state.approvalReminderIndex % APPROVAL_AI_REMINDERS.length;
  const rawText = APPROVAL_AI_REMINDERS[idx];
  const text = window.__manualTextMap ? translateExactTextByMap(rawText, window.__manualTextMap) : rawText;
  typeApprovalReminderText(text);
}

function startApprovalRobotReminderLoop() {
  if (state.approvalReminderIntervalId) {
    clearInterval(state.approvalReminderIntervalId);
    state.approvalReminderIntervalId = null;
  }
  clearApprovalTypingEffect();
  state.approvalReminderIndex = 0;
  updateApprovalRobotReminder(0);
  state.approvalReminderIntervalId = setInterval(() => {
    state.approvalReminderIndex += 1;
    updateApprovalRobotReminder();
  }, 8000);
}

function startApprovalSupportBlinkLoop() {
  if (state.approvalSupportBlinkIntervalId) {
    clearInterval(state.approvalSupportBlinkIntervalId);
    state.approvalSupportBlinkIntervalId = null;
  }

  const supportBtn = document.getElementById('awSupportButton');
  if (!supportBtn) return;
  let visible = true;
  supportBtn.style.visibility = 'visible';

  state.approvalSupportBlinkIntervalId = setInterval(() => {
    const screen = document.getElementById('approvalWaitScreen');
    if (!screen || screen.style.display === 'none' || screen.classList.contains('timeout-state')) {
      return;
    }
    visible = !visible;
    supportBtn.style.visibility = visible ? 'visible' : 'hidden';
  }, 5000);
}

function stopApprovalSupportBlinkLoop() {
  if (state.approvalSupportBlinkIntervalId) {
    clearInterval(state.approvalSupportBlinkIntervalId);
    state.approvalSupportBlinkIntervalId = null;
  }
  const supportBtn = document.getElementById('awSupportButton');
  if (supportBtn) supportBtn.style.visibility = 'visible';
}

async function showApprovalWaitScreen(prize) {
  await ensureAdminStatusModuleReady();
  const screen = document.getElementById('approvalWaitScreen');
  if (!screen) return;
  prewarmResultOverlayShell();
  screen.classList.remove('timeout-state');
  const cardEl = document.getElementById('awCard');
  if (cardEl) cardEl.classList.remove('is-ok');
  const sessBadgeEl = document.getElementById('awSessionBadge');
  if (sessBadgeEl) sessBadgeEl.textContent = state.sessionCode || '--';
  const iconEl = document.getElementById('awPrizeIcon');
  const nameEl = document.getElementById('awPrizeName');
  if (iconEl) {
    iconEl.innerHTML = renderPrizeVisualHtml(prize?.image, prize?.icon || '🎁', 'aw-prize-img', prize?.name || 'Phần thưởng');
  }
  if (nameEl) nameEl.textContent = prize?.name || 'Phần thưởng';
  state.approvalWaitingBox = Number(prize?.boxNumber || state.currentWinBox || state.currentPrize?.boxNumber || 0) || 0;
  // Reset to waiting state (in case previously transformed to accept/decline)
  const titleEl = document.getElementById('awTitle');
  if (titleEl) titleEl.textContent = contentTextGlobal('approvalWaitingTitle', 'Đang chờ phê duyệt...');
  const messagesEl = document.getElementById('awMessages');
  if (messagesEl) {
    const line1 = contentTextGlobal('approvalMsgLine1', '🎁 Phần thưởng đặc biệt của bạn đang được admin xem xét');
    const line2 = contentTextGlobal('approvalMsgLine2', '⚡ Vui lòng không tắt trang và chờ thông báo');
    const line3 = contentTextGlobal('approvalMsgLine3', '✨ Bạn sẽ sớm nhận được kết quả!');
    messagesEl.innerHTML = `<div class="aws-msg">${escapeHtml(line1)}</div><div class="aws-msg">${escapeHtml(line2)}</div><div class="aws-msg">${escapeHtml(line3)}</div>`;
  }
  const countdownWrap = document.getElementById('awCountdownWrap');
  if (countdownWrap) countdownWrap.style.display = '';
  const progressWrap = document.getElementById('awProgressWrap');
  if (progressWrap) progressWrap.style.display = '';
  const connRow = document.getElementById('awConnRow');
  if (connRow) connRow.style.display = '';
  const noteEl = document.getElementById('awNote');
  if (noteEl) noteEl.style.display = '';
  const actionBtns = document.getElementById('awActionButtons');
  if (actionBtns) {
    actionBtns.style.display = 'none';
    const _awAcceptTxt = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền'), window.__manualTextMap) : contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền');
    const _awDeclineTxt = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalDeclineButton', 'Từ chối'), window.__manualTextMap) : contentTextGlobal('approvalDeclineButton', 'Từ chối');
    actionBtns.innerHTML = `<button class="aws-btn aws-btn-accept" onclick="acceptSpecialPrize()">💰 ${escapeHtml(_awAcceptTxt)}</button><button class="aws-btn aws-btn-decline" onclick="declineSpecialPrize()">❌ ${escapeHtml(_awDeclineTxt)}</button>`;
  }
  const supportBtn = document.getElementById('awSupportButton');
  if (supportBtn) supportBtn.style.display = 'inline-flex';
  // Reset progress bar animation
  const bar = document.getElementById('awProgressBar');
  const pctEl = document.getElementById('awPct');
  if (pctEl) pctEl.textContent = '36%';
  if (bar) {
    bar.style.animation = 'none';
    bar.style.width = '36%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.animation = '';
      });
    });
  }
  showApprovalScreenSmooth(screen);
  startApprovalRobotReminderLoop();
  startApprovalSupportBlinkLoop();
  startApprovalProgressiveStatus();
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
  savePendingApprovalState(prize); // Persist so reload brings screen back (deadline preserved)
  // Compute remaining from stored deadline so timer survives reload
  const _saved = getPendingApprovalState();
  const _remaining = _saved?.deadline ? Math.max(0, Math.floor((_saved.deadline - Date.now()) / 1000)) : 7200;
  startApprovalCountdown(_remaining);
  connectApprovalWebSocket(); // Real-time via WebSocket
  startApprovalPoll(); // Fallback polling
}

function contactSupportFromApprovalTimeout() {
  ensureChatModuleReady().catch(() => {});
  const panel = document.getElementById('cpanel');
  if (panel && !panel.classList.contains('open')) {
    panel.classList.add('open');
  }
  initCustomerChatUI();

  const preferredBox = Number(state.currentWinBox || state.currentPrize?.boxNumber || 0);
  if (preferredBox) {
    openChatWithPrizeInfo(preferredBox);
  }

  showToast(contentTextGlobal('approvalSupportOpenedToast', '💬 Khung chat CSKH đã được mở. Vui lòng gửi yêu cầu để được hỗ trợ nhanh hơn.'));
}

function handleApprovalTimeout() {
  const screen = document.getElementById('approvalWaitScreen');
  if (screen) screen.classList.add('timeout-state');
  stopApprovalSupportBlinkLoop();

  if (state.approvalWaitIntervalId) {
    clearInterval(state.approvalWaitIntervalId);
    state.approvalWaitIntervalId = null;
  }

  if (state.approvalReminderIntervalId) {
    clearInterval(state.approvalReminderIntervalId);
    state.approvalReminderIntervalId = null;
  }
  clearApprovalTypingEffect();

  const titleEl = document.getElementById('awTitle');
  if (titleEl) titleEl.textContent = contentTextGlobal('approvalTimeoutTitle', 'ĐÃ QUÁ THỜI GIAN CHỜ PHÊ DUYỆT');

  const reminderEl = document.getElementById('awRobotReminder');
  if (reminderEl) {
    const _rawReminder = contentTextGlobal('approvalTimeoutReminder', 'Đã hết thời gian chờ tự động. Bạn hãy liên hệ CSKH để được ưu tiên hỗ trợ ngay.');
    typeApprovalReminderText(window.__manualTextMap ? translateExactTextByMap(_rawReminder, window.__manualTextMap) : _rawReminder);
  }

  const messagesEl = document.getElementById('awMessages');
  if (messagesEl) {
    messagesEl.innerHTML = `<div class="aws-msg">${escapeHtml(contentTextGlobal('approvalTimeoutMsgLine1', '⚠️ Hệ thống chưa nhận được quyết định duyệt từ admin trong thời gian chờ.'))}</div><div class="aws-msg">${escapeHtml(contentTextGlobal('approvalTimeoutMsgLine2', '💬 Vui lòng liên hệ bộ phận chăm sóc khách hàng để được xử lý ngay.'))}</div>`;
  }

  const connRow = document.getElementById('awConnRow');
  if (connRow) connRow.style.display = 'none';

  const progressWrap = document.getElementById('awProgressWrap');
  if (progressWrap) progressWrap.style.display = 'none';

  const noteEl = document.getElementById('awNote');
  if (noteEl) noteEl.textContent = contentTextGlobal('approvalTimeoutNote', 'Bạn có thể bấm nút bên dưới để mở chat với CSKH.');

  const actionBtns = document.getElementById('awActionButtons');
  if (actionBtns) {
    actionBtns.style.display = 'flex';
    const _supportNowTxt = contentTextGlobal('approvalSupportNowButton', 'Liên hệ CSKH ngay');
    actionBtns.innerHTML = `<button class="aws-btn aws-btn-support" onclick="contactSupportFromApprovalTimeout()">💬 ${escapeHtml(window.__manualTextMap ? translateExactTextByMap(_supportNowTxt, window.__manualTextMap) : _supportNowTxt)}</button>`;
  }
  if (window.__manualTextMap) applyManualTextMapToDOM(window.__manualTextMap);
}

function hideApprovalWaitScreen() {
  const screen = document.getElementById('approvalWaitScreen');
  if (screen) hideApprovalScreenSmooth(screen);
  stopApprovalSupportBlinkLoop();
  clearApprovalStageTimers();
  if (state.approvalUiRafId) {
    cancelAnimationFrame(state.approvalUiRafId);
    state.approvalUiRafId = 0;
  }
  if (state.approvalWaitIntervalId) { clearInterval(state.approvalWaitIntervalId); state.approvalWaitIntervalId = null; }
  if (state.approvalPollIntervalId) { clearInterval(state.approvalPollIntervalId); state.approvalPollIntervalId = null; }
  if (state.approvalReminderIntervalId) { clearInterval(state.approvalReminderIntervalId); state.approvalReminderIntervalId = null; }
  clearApprovalTypingEffect();
  const reminderEl = document.getElementById('awRobotReminder');
  if (reminderEl) reminderEl.classList.remove('typing-active');
  disconnectApprovalWebSocket();
  clearPendingApprovalState(); // Remove persisted data once resolved
  state.approvalWaitingBox = 0;
}

function startApprovalCountdown(totalSeconds) {
  if (state.approvalWaitIntervalId) clearInterval(state.approvalWaitIntervalId);
  const startedAt = Date.now();
  const total = Math.max(0, Number(totalSeconds) || 0);
  function tick() {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    const remaining = Math.max(0, total - elapsed);
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    const txt = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const el = document.getElementById('awCountdown');
    if (el) el.textContent = txt;
    if (remaining > 0) {
      return;
    }

    handleApprovalTimeout();
  }
  tick();
  state.approvalWaitIntervalId = setInterval(tick, 1000);
}

function isApprovalScreenVisible() {
  const screen = document.getElementById('approvalWaitScreen');
  if (!screen) return false;
  return screen.style.display !== 'none';
}

async function checkApprovalDecisionFromInventory(trigger = '') {
  if (!state.sessionCode || !isApprovalScreenVisible()) return;
  if (state._approvalStatusCheckBusy) return;

  const now = Date.now();
  const minGapMs = 1200;
  if (state._approvalStatusCheckedAt && (now - state._approvalStatusCheckedAt) < minGapMs) return;

  state._approvalStatusCheckedAt = now;
  state._approvalStatusCheckBusy = true;
  try {
    const savedPending = getPendingApprovalState();
    const box = Number(
      state.approvalWaitingBox
      || savedPending?.boxNumber
      || state._approvedSpecialBox
      || state.currentWinBox
      || state.currentPrize?.boxNumber
      || 0
    );
    if (!box) return;

    const rs = await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/player-inventory`);
    const items = Array.isArray(rs?.data?.items) ? rs.data.items : [];
    const item = items.find((x) => Number(x.box_number || x.boxNumber || 0) === box);
    if (!item) return;

    const status = String(item.status || '').toLowerCase();
    if (status === 'confirmed') {
      handleSpecialPrizeDecision('approved', box);
      return;
    }
    if (status === 'rejected') {
      handleSpecialPrizeDecision('rejected', box);
      return;
    }
  } catch (_) {
    // Keep silent: this checker is best-effort and event-driven.
  } finally {
    state._approvalStatusCheckBusy = false;
  }
}

// ===== Realtime approval listener (SSE/event-bus bridge) =====
function connectApprovalWebSocket() {
  disconnectApprovalWebSocket();
  if (!state.sessionCode) return;

  state._approvalRealtimeUnsubs = state._approvalRealtimeUnsubs || [];
  const offWallet = LMB_EVENT_BUS.on('wallet:update', (payload) => {
    const sessionCode = String(payload?.sessionCode || '').trim().toUpperCase();
    if (!sessionCode || sessionCode !== String(state.sessionCode || '').trim().toUpperCase()) return;
    checkApprovalDecisionFromInventory('wallet:update').catch(() => {});
  });

  const offSystem = LMB_EVENT_BUS.on('system:notification', (payload) => {
    const p = payload?.payload || {};
    const sessionCode = String(p.sessionCode || p.session_code || payload?.sessionCode || '').trim().toUpperCase();
    if (!sessionCode || sessionCode !== String(state.sessionCode || '').trim().toUpperCase()) return;
    checkApprovalDecisionFromInventory('system:notification').catch(() => {});
  });

  const offVisibility = LMB_EVENT_BUS.on('app:visibility', (payload) => {
    if (payload?.hidden) return;
    checkApprovalDecisionFromInventory('visibility').catch(() => {});
  });

  state._approvalRealtimeUnsubs.push(offWallet, offSystem, offVisibility);
  // One immediate check to sync quickly if admin already decided.
  checkApprovalDecisionFromInventory('connect').catch(() => {});
}

function disconnectApprovalWebSocket() {
  if (Array.isArray(state._approvalRealtimeUnsubs)) {
    state._approvalRealtimeUnsubs.forEach((off) => {
      try {
        if (typeof off === 'function') off();
      } catch (_) {}
    });
  }
  state._approvalRealtimeUnsubs = [];

  if (state._approvalWs) {
    try { state._approvalWs.close(); } catch (_) { }
    state._approvalWs = null;
  }
}

function handleSpecialPrizeDecision(decision, boxNumber, options = {}) {
  const shouldEmitFeedback = options.emitFeedback !== false;
  if (decision === 'approved') {
    // Admin approved → open preview modal for convert/decline or congratulation.
    if (shouldEmitFeedback) {
      showToast('🎉 Phần thưởng đã được admin duyệt!');
      playRealtimeNotificationSound('special_prize_approved');
    }
    // Stop polling & countdown
    if (state.approvalPollIntervalId) { clearInterval(state.approvalPollIntervalId); state.approvalPollIntervalId = null; }
    if (state.approvalWaitIntervalId) { clearInterval(state.approvalWaitIntervalId); state.approvalWaitIntervalId = null; }

    const approvedBox = Number(boxNumber || state.currentWinBox || state.currentPrize?.boxNumber || 0);
    state._approvedSpecialBox = approvedBox;

    if (approvedBox && state.boxes[approvedBox]) {
      state.boxes[approvedBox].specialApproved = true;
      state.boxes[approvedBox].isSpecial = true;
      state.boxes[approvedBox].decision = state.boxes[approvedBox].decision || 'confirmed';
      // Keep current prize in sync so convert/decline actions target right box.
      state.currentPrize = { ...(state.currentPrize || {}), boxNumber: approvedBox };
      state.currentWinBox = approvedBox;
    }

    hideApprovalWaitScreen();

    const approvedBoxMeta = state.boxes[approvedBox] || {};
    const isCashApproved = isCashPrizeLike(approvedBoxMeta);
    if (!isCashApproved) {
      // Non-cash special prize should never force convert/decline.
      activateNextBox();
      renderBoxes();
      refreshHubData();
      showToast('✅ Quà đã duyệt. Bạn có thể mở hộp tiếp theo hoặc bấm xem chi tiết để gửi CSKH yêu cầu đổi quà.');
      return;
    }

    if (approvedBox) {
      setupWinOverlay(approvedBox);
      openWinOverlay(approvedBox);
      showApprovedConversionReminderModal(approvedBox, { force: true });
      scheduleApprovedConversionReminder(approvedBox);
    }
  } else {
    // Admin rejected → activate next box
    hideApprovalWaitScreen();
    if (shouldEmitFeedback) {
      showToast('😔 Phần thưởng đặc biệt đã bị admin từ chối.');
      playRealtimeNotificationSound('special_prize_rejected');
    }
    const nextBox = state.openOrder.find((n) => state.boxes[n].state === 'inactive');
    if (nextBox) state.boxes[nextBox].state = 'active';
    renderBoxes();
    refreshHubData();
  }
}

// Player accepts the approved special prize → convert to money, game locks
async function convertApprovedSpecialPrizeNow(box) {
  const safeBox = Number(box || 0);
  if (!safeBox) throw new Error('Không xác định được hộp cần quy đổi');
  const prevRemaining = Math.max(0, Number(state.wallet.remaining || 0));

  let result;
  try {
    result = await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/convert`, {
      method: 'POST',
      body: JSON.stringify({ boxNumber: safeBox, instant: true })
    });
  } catch (err) {
    if (!isAlreadyConvertedErrorMessage(err?.message)) throw err;

    if (state.boxes[safeBox]) {
      state.boxes[safeBox].decision = 'converted';
      state.boxes[safeBox].status = 'converted';
      state.boxes[safeBox].processingStatus = 'converted';
    }
    stopApprovedConversionReminder(safeBox);
    invalidateSessionEconomyBurstCache(state.sessionCode);
    await Promise.all([refreshHubData(), refreshBoxesFromServer()]);
    activateNextBox();
    renderBoxes();
    showToast('✅ Phần quà đã được quy đổi trước đó. Đã đồng bộ lại số dư ví.');

    return {
      success: true,
      pendingApproval: false,
      instant: true,
      alreadyConverted: true,
      boxNumber: safeBox
    };
  }

  hideApprovalWaitScreen();

  if (result?.pendingApproval) {
    // USD/NDT: pending CSKH — lock remaining boxes until approved
    if (state.boxes[safeBox]) {
      state.boxes[safeBox].decision = 'exchanged';
      state.boxes[safeBox].status = 'exchanged';
      state.boxes[safeBox].processingStatus = 'exchanged';
    }
    stopApprovedConversionReminder(safeBox);
    invalidateSessionEconomyBurstCache(state.sessionCode);
    await refreshHubData();
    renderBoxes();
    showToast(`⏳ Yêu cầu quy đổi ${result.currency || ''} đã gửi. Vui lòng liên hệ CSKH!`);
  } else {
    // VND: instant convert — allow next box
    if (state.boxes[safeBox]) state.boxes[safeBox].decision = 'converted';
    stopApprovedConversionReminder(safeBox);
    renderBoxes();
    invalidateSessionEconomyBurstCache(state.sessionCode);
    await refreshHubData();

    const creditedAmount = Math.max(0, Number(result.amountVND || result.cashAmount || 0));
    const nowRemaining = Math.max(0, Number(state.wallet.remaining || 0));
    if (creditedAmount > 0 && nowRemaining <= prevRemaining) {
      await new Promise((resolve) => setTimeout(resolve, 650));
      invalidateSessionEconomyBurstCache(state.sessionCode);
      await refreshWallet();
    }

    activateNextBox();
    showToast('✅ Đã quy đổi thành tiền trong ví!');
  }

  return result;
}

async function acceptSpecialPrize() {
  const box = state._approvedSpecialBox || state.currentWinBox;
  if (!box) return;
  try {
    const actionBtns = document.getElementById('awActionButtons');
    if (actionBtns) {
      const _convertingTxt = window.__manualTextMap ? translateExactTextByMap('⏳ Đang quy đổi...', window.__manualTextMap) : '⏳ Đang quy đổi...';
      actionBtns.innerHTML = `<div style="color:#4ade80;font-weight:700;font-size:16px;">${escapeHtml(_convertingTxt)}</div>`;
    }

    await convertApprovedSpecialPrizeNow(box);
  } catch (err) {
    showToast(`❌ ${err.message}`);
    const actionBtns = document.getElementById('awActionButtons');
    if (actionBtns) {
      const _errAccept = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền'), window.__manualTextMap) : contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền');
      const _errDecline = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalDeclineButton', 'Từ chối'), window.__manualTextMap) : contentTextGlobal('approvalDeclineButton', 'Từ chối');
      actionBtns.innerHTML = `<button class="aws-btn aws-btn-accept" onclick="acceptSpecialPrize()">💰 ${escapeHtml(_errAccept)}</button><button class="aws-btn aws-btn-decline" onclick="declineSpecialPrize()">❌ ${escapeHtml(_errDecline)}</button>`;
      actionBtns.style.display = 'flex';
    }
  }
}

// Player declines the approved special prize → can open next box
async function declineSpecialPrize() {
  const box = state._approvedSpecialBox || state.currentWinBox;
  if (!box) return;
  try {
    const actionBtns = document.getElementById('awActionButtons');
    if (actionBtns) {
      const _processingTxt = window.__manualTextMap ? translateExactTextByMap('⏳ Đang xử lý...', window.__manualTextMap) : '⏳ Đang xử lý...';
      actionBtns.innerHTML = `<div style="color:#94a3b8;font-weight:700;font-size:16px;">${escapeHtml(_processingTxt)}</div>`;
    }

    await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/convert`, {
      method: 'POST',
      body: JSON.stringify({ boxNumber: box, decline: true })
    });

    hideApprovalWaitScreen();
    if (state.boxes[box]) state.boxes[box].decision = 'declined';
    stopApprovedConversionReminder(box);
    // Activate next box
    const nextBox = state.openOrder.find((n) => state.boxes[n].state === 'inactive');
    if (nextBox) state.boxes[nextBox].state = 'active';
    renderBoxes();
    await refreshHubData();
    showToast('Đã từ chối phần thưởng. Bạn có thể mở hộp tiếp theo.');
  } catch (err) {
    showToast(`❌ ${err.message}`);
    const actionBtns = document.getElementById('awActionButtons');
    if (actionBtns) {
      const _declErrAccept = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền'), window.__manualTextMap) : contentTextGlobal('approvalAcceptButton', 'Quy đổi tiền');
      const _declErrDecline = window.__manualTextMap ? translateExactTextByMap(contentTextGlobal('approvalDeclineButton', 'Từ chối'), window.__manualTextMap) : contentTextGlobal('approvalDeclineButton', 'Từ chối');
      actionBtns.innerHTML = `<button class="aws-btn aws-btn-accept" onclick="acceptSpecialPrize()">💰 ${escapeHtml(_declErrAccept)}</button><button class="aws-btn aws-btn-decline" onclick="declineSpecialPrize()">❌ ${escapeHtml(_declErrDecline)}</button>`;
      actionBtns.style.display = 'flex';
    }
  }
}

// Fallback polling (in case WebSocket is unavailable)
function startApprovalPoll() {
  // Disabled to eliminate polling loops. Approval state refreshes on focus/visibility.
}

// Keep legacy stubs for backward compatibility
async function winChooseClaim() { showToast('ℹ️ Liên hệ CSKH để nhận quà'); }
async function winChooseMoney() { await winConvertNow(); }

async function togChat() {
  await ensureChatModuleReady();
  const panel = document.getElementById('cpanel');
  if (!panel) return;
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    stopChatFabHintCycle();
    if (window.tabNotification) tabNotification.resetBadge();
    hideChatToast();
    resetChatFabHintMessage();
    initCustomerChatUI();
  } else {
    startChatFabHintCycle();
  }
}

function buildUserRealtimeNotice(rawPayload, source = 'notification') {
  const raw = (rawPayload && typeof rawPayload === 'object') ? rawPayload : {};
  const nested = (raw.payload && typeof raw.payload === 'object') ? raw.payload : {};
  const eventType = String(source === 'system' ? (raw.event || '') : (raw.type || '')).trim().toLowerCase();

  const sessionCode = String(
    raw.sessionCode || raw.session_code || nested.sessionCode || nested.session_code || ''
  ).trim().toUpperCase();
  const boxNumber = Number(raw.box_number || raw.boxNumber || nested.box_number || nested.boxNumber || 0) || 0;
  const amountVnd = Math.max(0, Number(raw.amount_vnd || nested.amount_vnd || raw.amount || nested.amount || 0) || 0);
  const rejectionReason = String(raw.rejection_reason || nested.rejection_reason || '').trim();

  let title = String(raw.title || '').trim();
  let body = String(raw.message || '').trim();
  let level = String(raw.level || nested.level || 'info').trim().toLowerCase();
  let shouldRefreshWallet = false;
  let shouldRefreshBoxes = false;

  switch (eventType) {
    case 'admin_message':
      title = title || 'Tin nhan tu CSKH';
      body = body || 'Ban co tin nhan moi tu tu van vien.';
      level = 'info';
      break;
    case 'wallet_approved':
      title = title || 'Rút tiền đã duyệt';
      body = body || `Yêu cầu rút tiền đã được duyệt${amountVnd > 0 ? ` (${amountVnd.toLocaleString('vi-VN')} VND)` : ''}.`;
      level = 'success';
      shouldRefreshWallet = true;
      break;
    case 'wallet_rejected':
      title = title || 'Rút tiền bị từ chối';
      body = body || `Yêu cầu rút tiền đã bị từ chối${rejectionReason ? `: ${rejectionReason}` : '.'}`;
      level = 'warning';
      shouldRefreshWallet = true;
      break;
    case 'gift_approved':
      title = title || 'Duyệt quà thành công';
      body = body || `Yêu cầu nhận quà đã được duyệt${boxNumber > 0 ? ` cho hộp #${boxNumber}` : ''}.`;
      level = 'success';
      break;
    case 'gift_rejected':
      title = title || 'Yêu cầu quà bị từ chối';
      body = body || `Yêu cầu nhận quà đã bị từ chối${rejectionReason ? `: ${rejectionReason}` : '.'}`;
      level = 'warning';
      break;
    case 'special_prize_approved':
      title = title || 'Quà đặc biệt đã duyệt';
      body = body || `Phần thưởng đặc biệt${boxNumber > 0 ? ` hộp #${boxNumber}` : ''} đã được admin duyệt.`;
      level = 'success';
      break;
    case 'special_prize_rejected':
      title = title || 'Quà đặc biệt bị từ chối';
      body = body || `Phần thưởng đặc biệt${boxNumber > 0 ? ` hộp #${boxNumber}` : ''} đã bị từ chối.`;
      level = 'warning';
      break;
    case 'conversion_approved':
      title = title || 'Quy đổi đã duyệt';
      body = body || `Quy đổi${boxNumber > 0 ? ` hộp #${boxNumber}` : ''} đã được duyệt${amountVnd > 0 ? ` (${amountVnd.toLocaleString('vi-VN')} VND)` : ''}.`;
      level = 'success';
      shouldRefreshWallet = true;
      break;
    case 'conversion_rejected':
      title = title || 'Quy đổi bị từ chối';
      body = body || `Yêu cầu quy đổi${boxNumber > 0 ? ` hộp #${boxNumber}` : ''} đã bị từ chối${rejectionReason ? `: ${rejectionReason}` : '.'}`;
      level = 'warning';
      shouldRefreshWallet = true;
      break;
    case 'withdrawal_status_updated':
      title = title || 'Cập nhật rút tiền';
      body = body || `Trạng thái rút tiền đã được cập nhật${amountVnd > 0 ? ` (${amountVnd.toLocaleString('vi-VN')} VND)` : ''}.`;
      shouldRefreshWallet = true;
      break;
    case 'gift_status_updated':
      title = title || 'Cập nhật duyệt quà';
      body = body || `Trạng thái duyệt quà đã được cập nhật${boxNumber > 0 ? ` (hộp #${boxNumber})` : ''}.`;
      break;
    case 'conversion_status_updated':
      title = title || 'Cập nhật quy đổi';
      body = body || `Trạng thái quy đổi đã được cập nhật${boxNumber > 0 ? ` (hộp #${boxNumber})` : ''}.`;
      shouldRefreshWallet = true;
      break;
    case 'session_updated':
      title = title || 'Phiên chơi đã cập nhật';
      body = body || 'Thông tin hộp quà vừa được cập nhật. Hệ thống đang đồng bộ dữ liệu mới.';
      shouldRefreshWallet = true;
      shouldRefreshBoxes = true;
      break;
    default:
      if (source === 'system' && !title && !body) {
        return null;
      }
      title = title || 'Thông báo';
      body = body || String(raw.event || eventType || '').trim();
      break;
  }

  if (!title && !body) return null;
  const toastType = ['success', 'error', 'warning', 'info'].includes(level) ? level : 'info';
  return {
    type: eventType || 'notification',
    sessionCode,
    boxNumber,
    title,
    body,
    toastType,
    shouldRefreshWallet,
    shouldRefreshBoxes
  };
}

function getActiveRealtimeSessionCodes() {
  const codes = [
    String(state.sessionCode || '').trim().toUpperCase(),
    String(state.chat?.sessionCode || '').trim().toUpperCase()
  ].filter(Boolean);
  return [...new Set(codes)];
}

function doesNoticeSessionMatchActive(detailSessionCode) {
  const normalized = String(detailSessionCode || '').trim().toUpperCase();
  if (!normalized) return true;
  const activeCodes = getActiveRealtimeSessionCodes();
  if (activeCodes.length === 0) return true;
  return activeCodes.includes(normalized);
}

function scheduleCustomerAutoReload(reason = 'wallet_decision') {
  const now = Date.now();
  const guardKey = 'lmb:auto-reload:guard';

  try {
    const lastAt = Number(sessionStorage.getItem(guardKey) || 0);
    if (lastAt && (now - lastAt) < 15000) return;
    sessionStorage.setItem(guardKey, String(now));
  } catch (_) {}

  if (state.autoReloadPending) return;
  state.autoReloadPending = true;

  if (state.autoReloadTimerId) {
    clearTimeout(state.autoReloadTimerId);
    state.autoReloadTimerId = null;
  }

  state.autoReloadTimerId = setTimeout(() => {
    state.autoReloadTimerId = null;
    try {
      window.location.reload();
    } catch (_) {
      window.location.href = window.location.href;
    }
  }, 900);

  notifyDbg('auto-reload-scheduled', { reason, at: now });
}

function showUserRealtimeNotice(rawPayload, source = 'notification') {
  const detail = buildUserRealtimeNotice(rawPayload, source);
  if (!detail) {
    notifyDbg('notice-skip-no-detail', { source, rawPayload });
    return;
  }

  const activeSessionCodes = getActiveRealtimeSessionCodes();
  if (!doesNoticeSessionMatchActive(detail.sessionCode)) {
    notifyDbg('notice-skip-session-mismatch', {
      eventType: detail.type,
      detailSessionCode: detail.sessionCode,
      activeSessionCodes
    });
    return;
  }

  notifyDbg('notice-accepted', {
    eventType: detail.type,
    source,
    detailSessionCode: detail.sessionCode,
    activeSessionCodes,
    title: detail.title
  });

  if (detail.type === 'special_prize_approved' || detail.type === 'special_prize_rejected') {
    const decision = detail.type === 'special_prize_approved' ? 'approved' : 'rejected';
    const raw = (rawPayload && typeof rawPayload === 'object') ? rawPayload : {};
    const nested = (raw.payload && typeof raw.payload === 'object') ? raw.payload : {};
    const realtimeBox = Number(
      detail.boxNumber
      || raw.box_number
      || raw.boxNumber
      || nested.box_number
      || nested.boxNumber
      || state.approvalWaitingBox
      || state.currentWinBox
      || state.currentPrize?.boxNumber
      || 0
    ) || 0;
    handleSpecialPrizeDecision(decision, realtimeBox, { emitFeedback: false });

    // Keep special-prize notifications in the same UX pipeline as other notices.
    showToast(`🔔 ${detail.title}${detail.body ? `: ${detail.body}` : ''}`, {
      type: detail.toastType,
      duration: 5000
    });
    playRealtimeNotificationSound(decision === 'approved' ? 'special_prize_approved' : 'special_prize_rejected');

    const specialTabLabel = decision === 'approved' ? 'Duyệt quà đặc biệt' : 'Từ chối quà đặc biệt';
    if (document.hidden && window.tabNotification && typeof tabNotification.incrementBadge === 'function') {
      try { tabNotification.incrementBadge(specialTabLabel); } catch (_) {}
    }

    return;
  }

  if (detail.type === 'admin_message') {
    const chatText = String(detail.body || detail.title || 'Bạn có tin nhắn mới').trim();
    showChatToast({ message: chatText });
    showChatFabHintMessage({ message: chatText });
  } else {
    showToast(`🔔 ${detail.title}${detail.body ? `: ${detail.body}` : ''}`, {
      type: detail.toastType,
      duration: 4200
    });
  }
  const realtimeNoticeSoundTypeMap = {
    wallet_approved: 'wallet_approved',
    wallet_rejected: 'wallet_rejected',
    gift_approved: 'gift_approved',
    gift_rejected: 'gift_rejected',
    special_prize_approved: 'special_prize_approved',
    special_prize_rejected: 'special_prize_rejected',
    conversion_approved: 'conversion_approved',
    conversion_rejected: 'conversion_rejected',
    session_updated: 'admin_message'
  };
  const soundType = realtimeNoticeSoundTypeMap[detail.type] || 'admin_message';
  playRealtimeNotificationSound(soundType);

  const tabNotifyTypeLabelMap = {
    admin_message: 'Tin nhắn CSKH',
    wallet_approved: 'Duyệt rút tiền',
    withdrawal_status_updated: 'Cập nhật rút tiền',
    gift_approved: 'Duyệt quà',
    gift_status_updated: 'Cập nhật duyệt quà',
    session_updated: 'Cập nhật phiên chơi',
    special_prize_approved: 'Duyệt quà đặc biệt',
    special_prize_rejected: 'Từ chối quà đặc biệt'
  };
  const tabNotifyLabel = tabNotifyTypeLabelMap[detail.type] || '';
  if (tabNotifyLabel && document.hidden && window.tabNotification) {
    try {
      const currentCount = (typeof tabNotification.getCount === 'function')
        ? Number(tabNotification.getCount() || 0)
        : 0;
      if (typeof tabNotification.startTabBlink === 'function') {
        tabNotification.startTabBlink(Math.max(1, currentCount + 1), tabNotifyLabel);
      } else if (typeof tabNotification.incrementBadge === 'function') {
        tabNotification.incrementBadge(tabNotifyLabel);
      }
    } catch (_) {}
  }

  if (detail.type === 'wallet_approved' || detail.type === 'wallet_rejected') {
    showToast('↻ Hệ thống đang tự tải lại để cập nhật kết quả duyệt.', {
      type: 'info',
      duration: 1400
    });
    scheduleCustomerAutoReload(detail.type);
    return;
  }

  if (detail.shouldRefreshWallet && !document.hidden) {
    const shouldRefreshBoxes = detail.shouldRefreshBoxes || detail.type === 'conversion_approved' || detail.type === 'conversion_rejected';
    scheduleEconomyRealtimeRefresh(120, { refreshBoxes: shouldRefreshBoxes });
    if (shouldRefreshBoxes) {
      loadPlayerInventory().catch(() => {});
    }
  }

  if ('Notification' in window && document.hidden && Notification.permission === 'granted') {
    try {
      new Notification(detail.title, {
        body: detail.body || 'Có cập nhật mới',
        icon: '/favicon.ico',
        tag: `rt-${detail.type || 'notify'}`
      });
    } catch (_) {}
  }
}

function bindRealtimeEventConsumers() {
  if (LMB_RUNTIME.realtimeConsumersBound) return;
  LMB_RUNTIME.realtimeConsumersBound = true;
  rtDbg('bind-realtime-consumers', { sessionCode: state.chat.sessionCode || '' });

  // Helper: format elapsed time since a timestamp into a human-readable string
  function formatAdminLastSeen(ts) {
    if (!ts) return 'Offline';
    const diffMs = Date.now() - Number(ts);
    if (diffMs < 0) return 'Offline';
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `Offline · ${diffSec} giây trước`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Offline · ${diffMin} phút trước`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `Offline · ${diffHour} giờ trước`;
    const diffDay = Math.floor(diffHour / 24);
    // > 1 day: show "Lần cuối X ngày trước"
    return `Lần cuối hoạt động ${diffDay} ngày trước`;
  }

  let _adminOfflineTimer = null;

  LMB_EVENT_BUS.on('chat:online_status', (payload) => {
    if (payload?.role !== 'admin') return;
    const onlineEl = document.querySelector('#cpanel .ch-online');
    if (!onlineEl) return;

    // Clear any running offline-ticker
    if (_adminOfflineTimer) { clearInterval(_adminOfflineTimer); _adminOfflineTimer = null; }

    const adminCount = Math.max(0, Number(payload.admin_count || 0) || 0);
    const adminNames = Array.isArray(payload.admin_names)
      ? payload.admin_names.map((n) => String(n || '').trim()).filter(Boolean)
      : [];

    if (!payload.online) {
      const lastSeenTs = payload.lastSeen || payload.last_seen || payload.ts || 0;
      function tickOffline() {
        const el = document.querySelector('#cpanel .ch-online');
        if (!el) { clearInterval(_adminOfflineTimer); _adminOfflineTimer = null; return; }
        el.textContent = formatAdminLastSeen(lastSeenTs);
        // Once > 1 day, slow down to every 10 min
        if (lastSeenTs && (Date.now() - Number(lastSeenTs)) > 86400000) {
          clearInterval(_adminOfflineTimer);
          _adminOfflineTimer = setInterval(tickOffline, 600000);
        }
      }
      tickOffline();
      // Update every 10 seconds while < 1 day
      _adminOfflineTimer = setInterval(tickOffline, 10000);
      return;
    }
    if (adminCount > 1) {
      const namesLabel = adminNames.length ? ` (${adminNames.slice(0, 2).join(', ')}${adminNames.length > 2 ? ', ...' : ''})` : '';
      onlineEl.textContent = `${adminCount} tư vấn viên online${namesLabel}`;
      return;
    }
    if (adminNames.length === 1) {
      onlineEl.textContent = `${adminNames[0]} đang online`;
      return;
    }
    onlineEl.textContent = 'Đang online • Phản hồi nhanh';
  });

  LMB_EVENT_BUS.on('chat:new_message', (msg) => {
    if (!msg || !state.chat.sessionCode) return;
    if (String(msg.session_code || msg.sessionCode || '').toUpperCase() !== String(state.chat.sessionCode || '').toUpperCase()) return;

    rtDbg('event-chat-new-message', {
      id: msg.id || '',
      sender: msg.sender_type || '',
      sessionCode: String(msg.session_code || msg.sessionCode || ''),
      panelOpen: isChatPanelOpen(),
      hidden: !!document.hidden
    });

    const senderType = String(msg.sender_type || '').toLowerCase();
    const inserted = appendChatMessage(msg);

    if (senderType === 'customer') {
      if (inserted && isChatPanelOpen() && !document.hidden) {
        scheduleChatRender({ fresh: true });
      }
      return;
    }

    hideChatTypingBubble();
    if (inserted && (isChatPanelOpen() || !document.hidden)) {
      scheduleChatRender({ fresh: true });
    }

    if (!document.hidden) {
      showChatToast(msg || { message: 'Bạn có tin nhắn mới' });
    }

    if (isChatPanelOpen()) {
      playRealtimeNotificationSound('admin_in_chat');
      markChatMessagesAsSeen();
      scheduleChatSeenPost(80);
      return;
    }

    playRealtimeNotificationSound('admin_message');

    if (document.hidden && 'Notification' in window) {
      const notifTitle = 'New message';
      const notifBody = String(msg.message || '').slice(0, 100) || 'Bạn có tin nhắn mới';
      if (Notification.permission === 'granted') {
        try { new Notification(notifTitle, { body: notifBody, icon: '/favicon.ico', tag: 'chat-msg', requireInteraction: false }); } catch (_) {}
      } else if (Notification.permission !== 'denied') {
        requestBrowserNotificationPermissionOnce().then((p) => {
          if (p === 'granted') {
            try { new Notification(notifTitle, { body: notifBody, icon: '/favicon.ico', tag: 'chat-msg', requireInteraction: false }); } catch (_) {}
          }
        });
      }
    }

    if (window.tabNotification) tabNotification.incrementBadge('Tin nhắn mới');
    scheduleChatUnreadSync(msg);
  });

  LMB_EVENT_BUS.on('chat:typing', (payload) => {
    if (payload?.role === 'admin') showChatTypingBubble();
  });

  LMB_EVENT_BUS.on('chat:message_status', (payload) => {
    applyIncomingOutgoingStatusUpdate(payload);
  });

  LMB_EVENT_BUS.on('chat:stop_typing', (payload) => {
    if (payload?.role === 'admin') hideChatTypingBubble();
  });

  LMB_EVENT_BUS.on('wallet:update', async (payload) => {
    notifyDbg('eventbus-wallet-update', {
      payload,
      gameSessionCode: state.sessionCode || '',
      chatSessionCode: state.chat.sessionCode || ''
    });

    const sessionCode = String(payload?.sessionCode || '').trim().toUpperCase();
    const activeSessionCodes = getActiveRealtimeSessionCodes();
    const ext = (payload && payload.payload && typeof payload.payload === 'object') ? payload.payload : {};
    const reason = String(ext.reason || payload?.reason || '').trim().toLowerCase();
    const status = String(ext.status || payload?.status || '').trim().toLowerCase();
    const isWithdrawDecisionEvent = reason === 'withdrawal_status_updated' && (status === 'approved' || status === 'rejected');

    // Fallback path: if backend did not emit `notification`, infer a user notice from status updates.
    let inferredType = '';
    if (reason === 'withdrawal_status_updated') {
      inferredType = status === 'approved' ? 'wallet_approved' : (status === 'rejected' ? 'wallet_rejected' : '');
    } else if (reason === 'gift_status_updated') {
      inferredType = status === 'approved' ? 'gift_approved' : (status === 'rejected' ? 'gift_rejected' : '');
    } else if (reason === 'conversion_status_updated') {
      inferredType = status === 'approved' ? 'conversion_approved' : (status === 'rejected' ? 'conversion_rejected' : '');
    }

    const walletUpdateMatchesActive = !sessionCode || activeSessionCodes.length === 0 || activeSessionCodes.includes(sessionCode);

    // Hard guarantee: once admin approves/rejects withdrawal, force customer tab reload.
    // This path does not rely on notification type mapping.
    if (isWithdrawDecisionEvent && walletUpdateMatchesActive) {
      const decisionLabel = status === 'approved' ? 'đã duyệt' : 'đã từ chối';
      showToast(`↻ Yêu cầu rút tiền ${decisionLabel}. Trang sẽ tự tải lại...`, {
        type: status === 'approved' ? 'success' : 'warning',
        duration: 1200
      });
      scheduleCustomerAutoReload(`wallet_update:${status}`);
      return;
    }

    if (inferredType && walletUpdateMatchesActive) {
      notifyDbg('wallet-update-inferred-notice', {
        reason,
        status,
        inferredType,
        sessionCode,
        activeSessionCodes
      });
      showUserRealtimeNotice({
        type: inferredType,
        sessionCode: sessionCode || activeSessionCodes[0] || '',
        amount_vnd: Number(ext.amount_vnd || ext.amount || 0) || 0,
        box_number: Number(ext.box_number || 0) || 0,
        rejection_reason: String(ext.rejection_reason || '').trim(),
        payload: ext
      }, 'notification');
    }

    if (document.hidden) return;
    if (!sessionCode || activeSessionCodes.length === 0) return;
    if (!activeSessionCodes.includes(sessionCode)) return;
    const shouldRefreshBoxes = reason === 'conversion_status_updated';
    scheduleEconomyRealtimeRefresh(120, { refreshBoxes: shouldRefreshBoxes });
  });

  LMB_EVENT_BUS.on('system:notification', (payload) => {
    showUserRealtimeNotice(payload, 'system');
  });

  LMB_EVENT_BUS.on('user:notification', (payload) => {
    notifyDbg('eventbus-user-notification', {
      type: payload?.type || '',
      sessionCode: payload?.sessionCode || payload?.session_code || payload?.payload?.session_code || ''
    });
    showUserRealtimeNotice(payload, 'notification');
  });
}

// ─── SSE Chat Connection ──────────────────────────────────────────────────────

const CHAT_SSE_STALE_MS = 90000;
const CHAT_SSE_WATCHDOG_TICK_MS = 20000;

function getRealtimeScopeCodes() {
  const codes = [];
  const pushCode = (value) => {
    const normalized = String(value || '').trim().toUpperCase();
    if (!normalized) return;
    if (codes.includes(normalized)) return;
    codes.push(normalized);
  };
  pushCode(state.sessionCode);
  pushCode(state.chat.sessionCode);
  pushCode(localStorage.getItem(getChatSessionStorageKey()));
  return codes;
}

function getRealtimeScopeSignature(codes = getRealtimeScopeCodes()) {
  return codes.join(',');
}

function markChatSseActivity(source = 'event') {
  state.chat.sseLastEventAt = Date.now();
  notifyDbg('sse-activity', {
    source,
    at: state.chat.sseLastEventAt,
    url: state.chat.sseUrl || ''
  });
}

function scheduleChatSseRecovery(delayMs = 1200) {
  if (state.chat.sseRecoveryTimer) return;
  state.chat.sseRecoveryTimer = setTimeout(() => {
    state.chat.sseRecoveryTimer = null;
    if (document.hidden) return;
    // Native EventSource already auto-reconnects while CONNECTING (readyState=0).
    // Avoid stop/start loops that can create reconnect storms and repeated /events calls.
    if (state.chat.sseSource && state.chat.sseSource.readyState === 0) return;
    stopChatSSE();
    startChatSSE();
  }, Math.max(500, Number(delayMs) || 1200));
}

function ensureChatSseRecoveryBindings() {
  if (state.chat.sseRecoveryBindingsReady) return;
  state.chat.sseRecoveryBindingsReady = true;

  window.addEventListener('focus', () => {
    if (!state.chat.notificationRuntimeReady) return;
    scheduleChatSseRecovery(600);
  });

  document.addEventListener('visibilitychange', () => {
    if (!state.chat.notificationRuntimeReady || document.hidden) return;
    scheduleChatSseRecovery(450);
  });
}

function ensureChatSseWatchdog() {
  if (state.chat.sseWatchdogTimer) return;

  state.chat.sseWatchdogTimer = setInterval(() => {
    if (!state.chat.notificationRuntimeReady) return;
    if (document.hidden) return;

    const desiredScopeSignature = getRealtimeScopeSignature();
    const currentScopeSignature = String(state.chat.sseScopeSignature || '');
    if (desiredScopeSignature !== currentScopeSignature) {
      notifyDbg('sse-watchdog-scope-drift', {
        desiredScopeSignature,
        currentScopeSignature,
        url: state.chat.sseUrl || ''
      });
      scheduleChatSseRecovery(250);
      return;
    }

    const hasRealtimeConn = !!(state.chat.sseSource || state.chat.sseClient);
    if (!hasRealtimeConn) {
      scheduleChatSseRecovery(400);
      return;
    }

    const lastAt = Number(state.chat.sseLastEventAt || 0);
    if (!lastAt) {
      markChatSseActivity('watchdog-bootstrap');
      return;
    }

    const idleMs = Date.now() - lastAt;
    if (idleMs < CHAT_SSE_STALE_MS) return;

    notifyDbg('sse-watchdog-stale', {
      idleMs,
      staleMs: CHAT_SSE_STALE_MS,
      url: state.chat.sseUrl || ''
    });
    scheduleChatSseRecovery(300);
  }, CHAT_SSE_WATCHDOG_TICK_MS);
}

function getLatestSupportMessageTs(messages = state.chat.messages) {
  return (Array.isArray(messages) ? messages : []).reduce((max, msg) => {
    if (String(msg?.sender_type || '').toLowerCase() === 'customer') return max;
    return Math.max(max, getChatMessageTs(msg));
  }, 0);
}

function stopChatPolling() {
  if (state.chat.pollingTimer) {
    clearTimeout(state.chat.pollingTimer);
    state.chat.pollingTimer = null;
  }
  state.chat.pollingInFlight = null;
}

function scheduleChatPolling(delayMs = 250) {
  if (!state.chat.sessionCode) return;
  if (state.chat.pollingTimer || state.chat.pollingInFlight) return;
  state.chat.pollingTimer = setTimeout(() => {
    state.chat.pollingTimer = null;
    runChatPolling().catch(() => {});
  }, Math.max(120, Number(delayMs) || 250));
}

async function runChatPolling() {
  if (!state.chat.sessionCode || document.hidden) return;
  if (state.chat.pollingInFlight) return state.chat.pollingInFlight;

  const sessionCode = String(state.chat.sessionCode || '').trim().toUpperCase();
  if (!sessionCode) return;

  state.chat.pollingFallbackMode = true;
  const latestSupportTs = Math.max(Number(state.chat.pollingSince || 0), getLatestSupportMessageTs());

  state.chat.pollingInFlight = apiJson(`/api/chat/poll/${encodeURIComponent(sessionCode)}?since=${latestSupportTs}`, {
    method: 'GET',
    timeoutMs: 32000
  }).then((rs) => {
    markChatSseActivity('poll-fallback');
    const items = Array.isArray(rs?.messages) ? rs.messages : [];
    if (items.length > 0) {
      let nextSince = latestSupportTs;
      items.forEach((raw) => {
        const msg = raw && typeof raw === 'object' ? raw : null;
        if (!msg) return;
        nextSince = Math.max(nextSince, getChatMessageTs(msg));
        enqueueRealtimeEvent('chat:new_message', msg);
      });
      state.chat.pollingSince = nextSince;
    }
    scheduleChatPolling(items.length > 0 ? 300 : 2000);
  }).catch((err) => {
    const msg = String(err?.message || '').toLowerCase();
    if (msg.includes('không tìm thấy phiên chat') || msg.includes('hết hạn')) {
      state.chat.sessionCode = '';
      state.chat.profileCompleted = false;
      localStorage.removeItem(getChatSessionStorageKey());
      localStorage.removeItem(getChatUnreadStorageKey());
      setChatReadyUI(false);
      showToast('ℹ️ Phiên chat đã hết hạn, vui lòng bắt đầu chat lại.');
      return;
    }
    scheduleChatPolling(1800);
  }).finally(() => {
    state.chat.pollingInFlight = null;
  });

  return state.chat.pollingInFlight;
}

function startChatSSE() {
  bindRealtimeEventConsumers();
  ensureChatSseRecoveryBindings();
  ensureChatSseWatchdog();

  const preferredSessionCode = String(state.chat.sessionCode || localStorage.getItem(getChatSessionStorageKey()) || '').trim().toUpperCase();
  if (preferredSessionCode !== String(state.chat.sessionCode || '').trim().toUpperCase()) {
    state.chat.sessionCode = preferredSessionCode;
  }

  if (shouldUseLegacyChatPollingTransport()) {
    stopChatSSE();
    state.chat.pollingSince = Math.max(Number(state.chat.pollingSince || 0), getLatestSupportMessageTs());
    scheduleChatPolling(120);
    return;
  }

  const openSse = (nextUrl) => {
    if ((state.chat.sseSource || state.chat.sseClient) && state.chat.sseUrl === nextUrl) return;
    rtDbg('sse-open-attempt', { nextUrl, sessionCode: state.chat.sessionCode || '' });
    markChatSseActivity('open-attempt');

    if (state.chat.sseClient) {
      state.chat.sseClient.close();
      state.chat.sseClient = null;
    }

    if (state.chat.sseSource) {
      state.chat.sseSource.close();
      state.chat.sseSource = null;
    }

    const useMobileBatchClient = isMobileLiteEffects();
    if (window.MobileSSEBatchClient && useMobileBatchClient) {
      rtDbg('sse-open-mobile-client', { nextUrl });
      state.chat.sseClient = new window.MobileSSEBatchClient({
        online_status: (d) => {
          markChatSseActivity('online_status-mobile');
          enqueueRealtimeEvent('chat:online_status', d);
        },
        new_message: (d) => {
          markChatSseActivity('new_message-mobile');
          const msg = d.message || d;
          if (!msg) return;
          rtDbg('mobile-client-new-message', {
            sessionCode: d.sessionCode || msg.session_code || '',
            sender: msg.sender_type || ''
          });
          const scopedMessage = { ...msg, session_code: msg.session_code || d.sessionCode };
          enqueueRealtimeEvent('chat:new_message', scopedMessage);
        },
        chat_message: (d) => {
          markChatSseActivity('chat_message-mobile');
          const msg = d.message || d;
          if (!msg) return;
          rtDbg('mobile-client-chat-message', {
            sessionCode: d.sessionCode || msg.session_code || '',
            sender: msg.sender_type || ''
          });
          const scopedMessage = { ...msg, session_code: msg.session_code || d.sessionCode };
          enqueueRealtimeEvent('chat:new_message', scopedMessage);
        },
        admin_message: (d) => {
          markChatSseActivity('admin_message-mobile');
          const msg = d.message || d;
          if (!msg) return;
          rtDbg('mobile-client-admin-message', {
            sessionCode: d.sessionCode || msg.session_code || '',
            sender: msg.sender_type || ''
          });
          const scopedMessage = { ...msg, session_code: msg.session_code || d.sessionCode };
          enqueueRealtimeEvent('chat:new_message', scopedMessage);
        },
        typing: (d) => {
          markChatSseActivity('typing-mobile');
          if (state.chat.sessionCode && d.sessionCode && String(d.sessionCode).toUpperCase() !== String(state.chat.sessionCode).toUpperCase()) return;
          enqueueRealtimeEvent('chat:typing', d);
        },
        stop_typing: (d) => {
          markChatSseActivity('stop_typing-mobile');
          if (state.chat.sessionCode && d.sessionCode && String(d.sessionCode).toUpperCase() !== String(state.chat.sessionCode).toUpperCase()) return;
          enqueueRealtimeEvent('chat:stop_typing', d);
        },
        message_status: (d) => {
          markChatSseActivity('message_status-mobile');
          if (state.chat.sessionCode && d.sessionCode && String(d.sessionCode).toUpperCase() !== String(state.chat.sessionCode).toUpperCase()) return;
          enqueueRealtimeEvent('chat:message_status', d);
        },
        wallet_update: (d) => {
          markChatSseActivity('wallet_update-mobile');
          enqueueRealtimeEvent('wallet:update', d);
        },
        system_notification: (d) => {
          markChatSseActivity('system_notification-mobile');
          enqueueRealtimeEvent('system:notification', d);
        },
        notification: (d) => {
          markChatSseActivity('notification-mobile');
          enqueueRealtimeEvent('user:notification', d);
        }
      }, {
        batchSize: 20,
        frameBudgetMs: 8,
        hiddenFlushMs: 260,
        maxQueueSize: 500
      });
      state.chat.sseClient.connect(nextUrl);
      state.chat.sseUrl = nextUrl;
      rtDbg('sse-opened-mobile-client', { nextUrl });
      return;
    }

    rtDbg('sse-open-native-eventsource', { nextUrl });

    state.chat.sseSource = new EventSource(nextUrl);
    state.chat.sseUrl = nextUrl;
    rtDbg('sse-opened-eventsource', { nextUrl });

    state.chat.sseSource.addEventListener('open', () => {
      markChatSseActivity('open-native');
    });

    state.chat.sseSource.addEventListener('online_status', (e) => {
      try {
        markChatSseActivity('online_status-native');
        const d = JSON.parse(e.data);
        enqueueRealtimeEvent('chat:online_status', d);
      } catch (_) {}
    });

    const onRealtimeMessage = (e) => {
      try {
        markChatSseActivity('message-native');
        const d = JSON.parse(e.data);
        const msg = d.message || d;
        if (!msg) return;
        rtDbg('sse-message-raw', {
          eventType: 'new_message',
          id: msg.id || '',
          sender: msg.sender_type || '',
          sessionCode: msg.session_code || d.sessionCode || ''
        });
        if (LMB_DEV_MONITOR.enabled) {
          LMB_DEV_MONITOR.sseCounter += 1;
          const elapsed = Date.now() - LMB_DEV_MONITOR.sseWindowStart;
          if (elapsed >= 5000) {
            const rate = (LMB_DEV_MONITOR.sseCounter / (elapsed / 1000)).toFixed(2);
            console.log('[LMB][sse] message-rate=%s/s', rate);
            LMB_DEV_MONITOR.sseCounter = 0;
            LMB_DEV_MONITOR.sseWindowStart = Date.now();
          }
        }
        const scopedMessage = { ...msg, session_code: msg.session_code || d.sessionCode };
        enqueueRealtimeEvent('chat:new_message', scopedMessage);
      } catch (_) {}
    };

    state.chat.sseSource.addEventListener('new_message', onRealtimeMessage);
    state.chat.sseSource.addEventListener('chat_message', onRealtimeMessage);
    state.chat.sseSource.addEventListener('admin_message', onRealtimeMessage);

    state.chat.sseSource.addEventListener('typing', (e) => {
      try {
        markChatSseActivity('typing-native');
        const d = JSON.parse(e.data);
        if (state.chat.sessionCode && d.sessionCode && String(d.sessionCode).toUpperCase() !== String(state.chat.sessionCode).toUpperCase()) return;
        enqueueRealtimeEvent('chat:typing', d);
      } catch (_) {}
    });

    state.chat.sseSource.addEventListener('stop_typing', (e) => {
      try {
        markChatSseActivity('stop_typing-native');
        const d = JSON.parse(e.data);
        if (state.chat.sessionCode && d.sessionCode && String(d.sessionCode).toUpperCase() !== String(state.chat.sessionCode).toUpperCase()) return;
        enqueueRealtimeEvent('chat:stop_typing', d);
      } catch (_) {}
    });

    state.chat.sseSource.addEventListener('message_status', (e) => {
      try {
        markChatSseActivity('message_status-native');
        const d = JSON.parse(e.data);
        enqueueRealtimeEvent('chat:message_status', d);
      } catch (_) {}
    });

    state.chat.sseSource.addEventListener('wallet_update', (e) => {
      try {
        markChatSseActivity('wallet_update-native');
        const d = JSON.parse(e.data);
        enqueueRealtimeEvent('wallet:update', d);
      } catch (_) {}
    });

    state.chat.sseSource.addEventListener('system_notification', (e) => {
      try {
        markChatSseActivity('system_notification-native');
        const d = JSON.parse(e.data);
        enqueueRealtimeEvent('system:notification', d);
      } catch (_) {}
    });

    state.chat.sseSource.addEventListener('notification', (e) => {
      try {
        markChatSseActivity('notification-native');
        const d = JSON.parse(e.data);
        notifyDbg('sse-notification-received', {
          type: d?.type || '',
          sessionCode: d?.sessionCode || d?.session_code || d?.payload?.session_code || '',
          chatSessionCode: state.chat.sessionCode || '',
          gameSessionCode: state.sessionCode || ''
        });
        enqueueRealtimeEvent('user:notification', d);
      } catch (err) {
        notifyDbg('sse-notification-parse-error', { message: err?.message || String(err || '') });
      }
    });

    state.chat.sseSource.onerror = () => {
      // Native EventSource auto-reconnects by itself; do not force a manual
      // stop/start here to prevent duplicated reconnect loops.
      rtDbg('sse-error', { url: state.chat.sseUrl || '' });
      notifyDbg('sse-error', {
        url: state.chat.sseUrl || '',
        chatSessionCode: state.chat.sessionCode || '',
        gameSessionCode: state.sessionCode || ''
      });
      if (shouldUseLegacyChatPollingTransport()) {
        stopChatSSE();
        state.chat.pollingSince = Math.max(Number(state.chat.pollingSince || 0), getLatestSupportMessageTs());
        scheduleChatPolling(300);
      }
    };
  };

  const init = async () => {
    if (window.LMB_DISABLE_SSE) {
      throw new Error('SSE disabled by server policy');
    }
    try {
      const base = await resolveRealtimeSseBase();
      const scopedSessionCodes = getRealtimeScopeCodes();
      const scopedSessionCode = scopedSessionCodes[0] || '';
      state.chat.sseScopeSignature = getRealtimeScopeSignature(scopedSessionCodes);
      let nextUrl = '/events';
      if (base === '/events') {
        const query = scopedSessionCodes.length > 0
          ? `?sessionCode=${encodeURIComponent(scopedSessionCodes.join(','))}`
          : '';
        nextUrl = `/events${query}`;
      } else {
        if (!scopedSessionCode) return;
        nextUrl = `/api/chat/events/${encodeURIComponent(scopedSessionCode)}`;
      }
      openSse(nextUrl);
      rtDbg('sse-init-success', { nextUrl, base });
      notifyDbg('sse-init-success', {
        nextUrl,
        base,
        scopedSessionCode,
        scopedSessionCodes,
        chatSessionCode: state.chat.sessionCode || '',
        gameSessionCode: state.sessionCode || ''
      });
    } catch (err) {
      state.chat.sseSource = null;
      state.chat.sseUrl = '';
      rtDbg('sse-init-error', { message: err?.message || String(err || '') });
      notifyDbg('sse-init-error', { message: err?.message || String(err || '') });
      state.chat.pollingSince = Math.max(Number(state.chat.pollingSince || 0), getLatestSupportMessageTs());
      scheduleChatPolling(400);
    }
  };

  init().catch(() => {});
}

function stopChatSSE() {
  stopChatPolling();
  if (state.chat.sseRecoveryTimer) {
    clearTimeout(state.chat.sseRecoveryTimer);
    state.chat.sseRecoveryTimer = null;
  }
  if (state.chat.sseClient) {
    state.chat.sseClient.close();
    state.chat.sseClient = null;
  }
  if (state.chat.sseSource) {
    state.chat.sseSource.close();
    state.chat.sseSource = null;
  }
  state.chat.sseUrl = '';
  state.chat.sseScopeSignature = '';
  clearRealtimeQueueDrainTimer();
  if (state.realtimeQueueRaf) {
    cancelAnimationFrame(state.realtimeQueueRaf);
    state.realtimeQueueRaf = 0;
  }
  state.realtimeQueue = [];
}

// Show "Admin đang nhập..." typing indicator bubble
function showChatTypingBubble() {
  let el = document.getElementById('chatTypingBubble');
  if (!el) {
    el = document.createElement('div');
    el.id = 'chatTypingBubble';
    el.className = 'chat-typing-bubble';
    el.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-label">${DEFAULT_CHAT_AGENT_NAME} đang nhập...</span>`;
    const box = document.getElementById('cmsgs');
    if (box) box.parentNode.insertBefore(el, box.nextSibling);
  }
  el.style.display = 'flex';
  const box = document.getElementById('cmsgs');
  if (box) box.scrollTop = box.scrollHeight;
}

function hideChatTypingBubble() {
  const el = document.getElementById('chatTypingBubble');
  if (el) el.style.display = 'none';
}

// Emit typing event to server
let _chatTypingTimer = null;
let _chatIsTyping = false;

function emitChatTyping() {
  if (!state.chat.sessionCode) return;
  if (!_chatIsTyping) {
    _chatIsTyping = true;
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({ session_code: state.chat.sessionCode, role: 'player', typing: true })
    }).catch(() => {});
  }
  clearTimeout(_chatTypingTimer);
  _chatTypingTimer = setTimeout(() => {
    _chatIsTyping = false;
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({ session_code: state.chat.sessionCode, role: 'player', typing: false })
    }).catch(() => {});
  }, 2500);
}

function getChatSessionStorageKey() {
  return CHAT_GLOBAL_KEYS.sessionCode;
}

function getChatProfileStorageKey() {
  return CHAT_GLOBAL_KEYS.profile;
}

function getChatSeenStorageKey() {
  return CHAT_GLOBAL_KEYS.lastSeenAt;
}

function getChatUnreadStorageKey() {
  return CHAT_GLOBAL_KEYS.unreadCount;
}

function migrateLegacyChatStorage() {
  try {
    const currentSessionCode = localStorage.getItem(getChatSessionStorageKey()) || '';
    if (!currentSessionCode) {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i) || '';
        if (!/:chatSessionCode$/.test(key)) continue;
        const value = String(localStorage.getItem(key) || '').trim();
        if (value) {
          localStorage.setItem(getChatSessionStorageKey(), value);
          break;
        }
      }
    }

    const currentProfile = localStorage.getItem(getChatProfileStorageKey()) || '';
    if (!currentProfile) {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i) || '';
        if (!/:chatProfile$/.test(key)) continue;
        const value = localStorage.getItem(key);
        if (value) {
          localStorage.setItem(getChatProfileStorageKey(), value);
          break;
        }
      }
    }
  } catch (_) {}
}

function getChatMessageTs(message) {
  const raw = message?.created_at || message?.createdAt || message?.updated_at || 0;
  const ts = new Date(raw).getTime();
  return Number.isFinite(ts) && ts > 0 ? ts : 0;
}

function isCustomerChatMessage(message) {
  return String(message?.sender_type || '').toLowerCase() === 'customer';
}

function ensureChatMessageUiMeta(message) {
  if (!message || typeof message !== 'object') return { status: 'sent' };
  if (!message._ui || typeof message._ui !== 'object') {
    message._ui = {};
  }
  return message._ui;
}

function resolveOutgoingMessageStatus(message) {
  const ui = message?._ui || {};
  const explicit = String(ui.status || '').trim().toLowerCase();
  if (explicit) return explicit;
  if (!isCustomerChatMessage(message)) return '';
  if (message?.is_read || message?.read_at) return 'seen';
  return 'sent';
}

function hydrateChatMessageForUi(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const msg = raw;
  const ui = ensureChatMessageUiMeta(msg);
  if (isCustomerChatMessage(msg) && !String(ui.status || '').trim()) {
    ui.status = resolveOutgoingMessageStatus(msg);
  }
  return msg;
}

function hydrateChatMessageListForUi(messages = []) {
  return (Array.isArray(messages) ? messages : [])
    .map((m) => hydrateChatMessageForUi(m))
    .filter(Boolean);
}

function createOptimisticTextMessage(text) {
  const nowIso = new Date().toISOString();
  const name = (document.getElementById('chatCustomerName')?.value || 'Khach hang').trim() || 'Khach hang';
  const clientId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    id: clientId,
    session_code: state.chat.sessionCode,
    sender_type: 'customer',
    sender_name: name,
    message: String(text || ''),
    message_type: 'text',
    created_at: nowIso,
    updated_at: nowIso,
    _ui: {
      clientId,
      optimistic: true,
      status: 'pending',
      retryPayload: {
        type: 'text',
        message: String(text || '')
      }
    }
  };
}

function markChatMessageFailedById(messageId, errorMessage = '') {
  const targetId = String(messageId || '').trim();
  if (!targetId || !Array.isArray(state.chat.messages)) return false;
  const idx = state.chat.messages.findIndex((m) => String(m?.id || '') === targetId);
  if (idx < 0) return false;
  const msg = state.chat.messages[idx];
  const ui = ensureChatMessageUiMeta(msg);
  ui.optimistic = false;
  ui.status = 'failed';
  ui.error = String(errorMessage || '').trim();
  return true;
}

function replaceOptimisticMessage(clientId, serverMessage) {
  const cid = String(clientId || '').trim();
  const hydrated = hydrateChatMessageForUi(serverMessage);
  if (!hydrated) return false;
  if (!cid || !Array.isArray(state.chat.messages)) return false;
  const idx = state.chat.messages.findIndex((m) => String(m?.id || '') === cid);
  if (idx < 0) return false;

  const serverId = String(hydrated.id || '').trim();
  if (serverId) {
    const existingServerIdx = state.chat.messages.findIndex((m, i) => i !== idx && String(m?.id || '') === serverId);
    if (existingServerIdx >= 0) {
      state.chat.messages.splice(idx, 1);
      return true;
    }
  }

  state.chat.messages[idx] = hydrated;
  return true;
}

function applyIncomingOutgoingStatusUpdate(payload = {}) {
  const payloadSession = String(payload?.sessionCode || payload?.session_code || '').trim().toUpperCase();
  const activeSession = String(state.chat.sessionCode || '').trim().toUpperCase();
  if (payloadSession && activeSession && payloadSession !== activeSession) return;

  const status = String(payload?.status || '').trim().toLowerCase();
  if (!status || !Array.isArray(state.chat.messages) || !state.chat.messages.length) return;

  const rawMsgId = Number(payload?.messageId || payload?.message_id || 0);
  const hasNumericMsgId = Number.isFinite(rawMsgId) && rawMsgId > 0;
  let mutated = false;

  for (let i = 0; i < state.chat.messages.length; i += 1) {
    const msg = state.chat.messages[i];
    if (!isCustomerChatMessage(msg)) continue;
    const ui = ensureChatMessageUiMeta(msg);
    if (ui.status === 'pending' || ui.status === 'failed') continue;

    const numericId = Number(msg?.id || 0);
    if (hasNumericMsgId && Number.isFinite(numericId) && numericId > rawMsgId) continue;

    if (status === 'seen') {
      if (ui.status !== 'seen') {
        ui.status = 'seen';
        mutated = true;
      }
      continue;
    }

    if (status === 'delivered') {
      if (ui.status !== 'seen' && ui.status !== 'delivered') {
        ui.status = 'delivered';
        mutated = true;
      }
    }
  }

  if (mutated) scheduleChatRender();
}

function formatChatMessageDateTime(raw) {
  const ts = new Date(raw || 0).getTime();
  if (!Number.isFinite(ts) || ts <= 0) return '--/-- --:--';
  const d = new Date(ts);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month} ${hour}:${minute}`;
}

function getUnseenSupportMessages(messages = state.chat.messages) {
  return (Array.isArray(messages) ? messages : []).filter((m) => {
    if (m.sender_type === 'customer') return false;
    return getChatMessageTs(m) > (state.chat.lastSeenAt || 0);
  });
}

function capChatMessages(messages = []) {
  const list = Array.isArray(messages) ? messages : [];
  const cap = Math.max(20, Number(state.chat.maxDomMessages || 100));
  if (list.length <= cap) return list;
  return list.slice(-cap);
}

function appendChatMessage(message) {
  if (!message || typeof message !== 'object') return false;
  const hydratedMessage = hydrateChatMessageForUi(message);
  const id = hydratedMessage.id;
  if (id && Array.isArray(state.chat.messages) && state.chat.messages.some((m) => m.id === id)) {
    return false;
  }
  if (!Array.isArray(state.chat.messages)) state.chat.messages = [];
  state.chat.messages.push(hydratedMessage);
  const cap = Math.max(20, Number(state.chat.maxDomMessages || 100));
  if (state.chat.messages.length > cap) {
    state.chat.messages.splice(0, state.chat.messages.length - cap);
  }
  return true;
}

function getVirtualizedChatWindow(messages, box) {
  const list = Array.isArray(messages) ? messages : [];
  const total = list.length;
  const threshold = Math.max(40, Number(state.chat.virtualizationThreshold || 90));
  if (!box || total <= threshold) {
    return {
      start: 0,
      end: total,
      topPad: 0,
      bottomPad: 0,
      virtualized: false
    };
  }

  const estimate = Math.max(56, Number(state.chat.virtualRowEstimate || 84));
  const overscan = Math.max(4, Number(state.chat.virtualOverscan || 14));
  const viewportH = Math.max(240, Number(box.clientHeight || 0));
  const baseCount = Math.max(20, Math.ceil(viewportH / estimate));
  const windowSize = Math.max(baseCount, Number(state.chat.virtualWindowSize || 64));
  const approxStart = Math.max(0, Math.floor(Number(box.scrollTop || 0) / estimate) - overscan);
  const start = Math.min(Math.max(0, total - windowSize), approxStart);
  const end = Math.min(total, start + windowSize + overscan * 2);

  return {
    start,
    end,
    topPad: Math.max(0, Math.round(start * estimate)),
    bottomPad: Math.max(0, Math.round((total - end) * estimate)),
    virtualized: true
  };
}

function getOutgoingChatStatusLabel(message) {
  const status = resolveOutgoingMessageStatus(message);
  if (status === 'pending') return 'Dang gui...';
  if (status === 'failed') return 'Gui that bai';
  if (status === 'delivered') return 'Da nhan';
  if (status === 'seen') return 'Da xem';
  return 'Da gui';
}

function syncChatUnreadUi(preferredMessage = null) {
  const unseenMessages = getUnseenSupportMessages(state.chat.messages);
  const unseen = unseenMessages.length;
  const prevUnread = Number(state.chat.lastUnreadCount || 0);

  updateChatFabBadge(unseen);

  if (!isChatPanelOpen() && unseen > prevUnread) {
    const latestMsg = preferredMessage || unseenMessages[unseenMessages.length - 1];
    if (latestMsg) {
      const currentText = String(latestMsg.message || '').replace(/^([🖼️📎]\s*)/, '').trim();
      const wasRecent = (Date.now() - Number(state.chat.lastToastAt || 0)) < 900;
      const isSameContent = currentText && currentText === String(state.chat.lastToastText || '');
      if (!(wasRecent && isSameContent)) {
        showChatToast(latestMsg);
        showChatFabHintMessage(latestMsg);
      }
    }
  }

  state.chat.lastUnreadCount = unseen;
}

function scheduleChatUnreadSync(preferredMessage = null) {
  if (state.chat.unreadSyncTimer) return;
  state.chat.unreadSyncTimer = setTimeout(() => {
    state.chat.unreadSyncTimer = null;
    syncChatUnreadUi(preferredMessage);
  }, 140);
}

function isChatPanelOpen() {
  const panel = document.getElementById('cpanel');
  return !!(panel && panel.classList.contains('open'));
}

function isNearChatBottom(box, thresholdPx = 96) {
  if (!box) return false;
  const remaining = box.scrollHeight - (box.scrollTop + box.clientHeight);
  return remaining <= Math.max(16, Number(thresholdPx) || 96);
}

function scheduleChatRender(options = {}) {
  const fresh = !!options.fresh;
  if (!state.chat.pendingFreshRender && fresh) {
    state.chat.pendingFreshRender = true;
  }
  if (state.chat.renderTimer) {
    // If a fresh render is requested, shorten the existing timer
    if (fresh && state.chat.renderTimerDelay > 50) {
      clearTimeout(state.chat.renderTimer);
      state.chat.renderTimer = null;
    } else {
      return;
    }
  }

  const delay = fresh ? 35 : 120;
  state.chat.renderTimerDelay = delay;
  state.chat.renderTimer = setTimeout(() => {
    state.chat.renderTimer = null;
    state.chat.renderTimerDelay = 0;
    const useFresh = !!state.chat.pendingFreshRender;
    state.chat.pendingFreshRender = false;
    renderChatMessages({ forceFresh: useFresh });
  }, delay);
}

function showChatToast(msg) {
  const stack = ensureChatToastStack();
  if (!stack || !state.chat.toastTemplate) return;

  const panelOpen = isChatPanelOpen();
  const lifetime = panelOpen ? 3600 : 5600;
  const textValue = String(msg?.message || '').replace(/^([🖼️📎]\s*)/, '').trim();
  // Strip HTML tags for toast preview (support messages may contain rich HTML)
  const plainTextValue = (() => {
    if (!textValue) return '';
    if (!/<[a-z][\s\S]*?>/i.test(textValue)) return textValue;
    var tmp = document.createElement('div');
    tmp.innerHTML = textValue;
    return (tmp.innerText || tmp.textContent || '').trim();
  })();
  const preview = (plainTextValue || 'Bạn có tin nhắn mới').slice(0, 90);
  rtDbg('toast-show', {
    sessionCode: state.chat.sessionCode || '',
    panelOpen,
    text: preview
  });
  const now = Date.now();

  const bucket = state.chat.toastGroupBucket;
  const groupWindowMs = getChatToastGroupWindowMs();
  const canGroup = !!(
    groupWindowMs > 0
    &&
    bucket
    && bucket.el
    && bucket.el.isConnected
    && !bucket.el.classList.contains('is-closing')
    && bucket.panelOpen === panelOpen
    && (now - Number(bucket.lastAt || 0)) <= groupWindowMs
  );

  if (canGroup) {
    const nextCount = Math.max(2, Number(bucket.count || 1) + 1);
    updateChatToastNode(bucket.el, {
      panelOpen,
      preview,
      count: nextCount,
      ts: msg?.created_at || msg?.createdAt || Date.now()
    });
    bucket.count = nextCount;
    bucket.lastAt = now;

    const existingItem = Array.isArray(state.chat.toastItems)
      ? state.chat.toastItems.find((item) => item?.el === bucket.el)
      : null;
    if (existingItem?.timer) clearTimeout(existingItem.timer);
    const nextTimer = setTimeout(() => hideChatToast(bucket.el), lifetime);
    if (existingItem) existingItem.timer = nextTimer;

    state.chat.lastToastText = preview;
    state.chat.lastToastAt = now;
    return;
  }

  const clone = state.chat.toastTemplate.cloneNode(true);
  clone.classList.remove('is-template', 'visible', 'in-chat', 'is-closing');
  clone.removeAttribute('id');
  clone.removeAttribute('onclick');
  clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  clone.style.setProperty('--toast-life', `${lifetime}ms`);
  clone.classList.toggle('in-chat', panelOpen);
  updateChatToastNode(clone, {
    panelOpen,
    preview,
    count: 1,
    ts: msg?.created_at || msg?.createdAt || Date.now()
  });

  const closeBtn = clone.querySelector('.chat-msg-toast-x');
  if (closeBtn) {
    closeBtn.removeAttribute('onclick');
    closeBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      hideChatToast(clone);
    }, { passive: true });
  }

  clone.addEventListener('click', () => {
    if (clone.dataset.swiped === '1') {
      clone.dataset.swiped = '0';
      return;
    }
    hideChatToast(clone);
    resetChatFabHintMessage();
    togChat();
  }, { passive: true });

  attachSwipeDismissToToast(clone);

  stack.prepend(clone);
  requestAnimationFrame(() => clone.classList.add('visible'));

  if (!Array.isArray(state.chat.toastItems)) state.chat.toastItems = [];
  state.chat.toastItems.unshift({
    el: clone,
    timer: setTimeout(() => hideChatToast(clone), lifetime)
  });

  state.chat.toastGroupBucket = {
    el: clone,
    count: 1,
    panelOpen,
    lastAt: now
  };

  const isMobileStack = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
  const maxToasts = isMobileStack ? 3 : 4;
  while (state.chat.toastItems.length > maxToasts) {
    const old = state.chat.toastItems.pop();
    if (!old || !old.el) continue;
    clearTimeout(old.timer);
    hideChatToast(old.el);
  }

  state.chat.lastToastText = preview;
  state.chat.lastToastAt = now;
}

function updateChatToastNode(toastEl, payload = {}) {
  if (!toastEl) return;
  const count = Math.max(1, Number(payload.count || 1));
  const panelOpen = !!payload.panelOpen;
  const preview = String(payload.preview || 'Bạn có tin nhắn mới').slice(0, 90);
  const ts = payload.ts || Date.now();

  const textEl = toastEl.querySelector('.chat-msg-toast-text');
  const timeEl = toastEl.querySelector('.chat-msg-toast-time');
  const tagEl = toastEl.querySelector('.chat-msg-toast-tag');

  if (textEl) {
    textEl.textContent = count > 1 ? `${preview} (+${count - 1})` : preview;
  }
  if (timeEl) {
    timeEl.textContent = formatChatMessageDateTime(ts);
  }
  if (tagEl) {
    if (count > 1) {
      tagEl.textContent = panelOpen ? `${count} tin nhắn trong CSKH` : `${count} tin nhắn mới`;
    } else {
      tagEl.textContent = panelOpen ? 'Tin nhắn mới trong CSKH' : 'Thông báo mới';
    }
  }
}

function attachSwipeDismissToToast(toastEl) {
  if (!toastEl || toastEl.dataset.swipeBound === '1') return;
  if (!isChatToastSwipeDismissEnabled()) return;
  if (!(window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches)) return;

  toastEl.dataset.swipeBound = '1';
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let active = false;

  const onPointerMove = (event) => {
    if (!active || event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    if (Math.abs(dy) > Math.abs(dx)) return;
    deltaX = dx;
    toastEl.classList.add('is-swiping');
    toastEl.style.transform = `translate3d(${dx}px,0,0)`;
    toastEl.style.opacity = String(Math.max(0.2, 1 - Math.min(1, Math.abs(dx) / 180)));
  };

  const onPointerEnd = (event) => {
    if (!active || event.pointerId !== pointerId) return;
    active = false;
    try { toastEl.releasePointerCapture(pointerId); } catch (_) {}

    const dismiss = Math.abs(deltaX) > 84;
    toastEl.classList.remove('is-swiping');
    toastEl.style.removeProperty('transform');
    toastEl.style.removeProperty('opacity');

    if (dismiss) {
      toastEl.dataset.swiped = '1';
      hideChatToast(toastEl);
    }

    pointerId = null;
    deltaX = 0;
  };

  toastEl.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 && event.pointerType !== 'touch') return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    deltaX = 0;
    active = true;
    try { toastEl.setPointerCapture(pointerId); } catch (_) {}
  }, { passive: true });

  toastEl.addEventListener('pointermove', onPointerMove, { passive: true });
  toastEl.addEventListener('pointerup', onPointerEnd, { passive: true });
  toastEl.addEventListener('pointercancel', onPointerEnd, { passive: true });
}

function getChatToastGroupWindowMs() {
  const cfg = window.__lmbUiSettings?.chat || {};
  if (cfg.adminToastGroupEnabled === false) return 0;
  const raw = Number(cfg.adminToastGroupWindowMs || 2000);
  if (!Number.isFinite(raw)) return 2000;
  return Math.max(0, Math.min(6000, Math.round(raw)));
}

function isChatToastSwipeDismissEnabled() {
  const cfg = window.__lmbUiSettings?.chat || {};
  return cfg.adminToastSwipeDismissEnabled !== false;
}

function showChatFabHintMessage(msg) {
  const hint = document.getElementById('chatFabHint');
  if (!hint) return;
  stopChatFabHintCycle();
  hint.classList.remove('is-hidden');
  const lines = hint.querySelectorAll('.cfab-hint-line');
  if (!lines || lines.length < 2) return;

  if (!hint.dataset.defaultLine1) {
    hint.dataset.defaultLine1 = String(lines[0].textContent || 'Bấm vào');
    hint.dataset.defaultLine2 = String(lines[1].textContent || 'để sẵn sàng liên hệ CSKH');
  }

  const msgRaw = String(msg?.message || '').replace(/^([🖼️📎]\s*)/, '');
  // Strip HTML tags for hint display
  const msgText = (() => {
    if (!msgRaw) return '';
    if (!/<[a-z][\s\S]*?>/i.test(msgRaw)) return msgRaw.trim();
    var tmp = document.createElement('div');
    tmp.innerHTML = msgRaw;
    return (tmp.innerText || tmp.textContent || '').trim();
  })().slice(0, 38);
  lines[0].textContent = 'Tin nhắn mới';
  lines[1].textContent = msgText || 'Bấm vào để xem ngay';
  hint.classList.add('is-chat-message');

  clearTimeout(window._chatFabHintTimer);
  window._chatFabHintTimer = setTimeout(resetChatFabHintMessage, 6000);
}

function resetChatFabHintMessage() {
  const hint = document.getElementById('chatFabHint');
  if (!hint) return;
  const lines = hint.querySelectorAll('.cfab-hint-line');
  if (!lines || lines.length < 2) return;

  if (hint.dataset.defaultLine1) lines[0].textContent = hint.dataset.defaultLine1;
  if (hint.dataset.defaultLine2) lines[1].textContent = hint.dataset.defaultLine2;
  hint.classList.remove('is-chat-message');
  if (!isChatPanelOpen()) {
    startChatFabHintCycle();
  }
}

function stopChatFabHintCycle() {
  state.chat.fabHintCycleRunning = false;
  if (state.chat.fabHintCycleTimer) {
    clearTimeout(state.chat.fabHintCycleTimer);
    state.chat.fabHintCycleTimer = null;
  }
}

function startChatFabHintCycle() {
  const hint = document.getElementById('chatFabHint');
  if (!hint) return;
  if (state.chat.fabHintCycleRunning) return;
  if (isChatPanelOpen()) return;
  state.chat.fabHintCycleRunning = true;

  const showPhase = () => {
    if (!state.chat.fabHintCycleRunning) return;
    if (isChatPanelOpen()) {
      state.chat.fabHintCycleTimer = setTimeout(showPhase, 1000);
      return;
    }
    hint.classList.remove('is-hidden');
    restartCssAnimationByClass(hint, 'is-reveal');
    state.chat.fabHintCycleTimer = setTimeout(hidePhase, 5000);
  };

  const hidePhase = () => {
    if (!state.chat.fabHintCycleRunning) return;
    hint.classList.add('is-hidden');
    const waitMs = 6000 + Math.floor(Math.random() * 4001);
    state.chat.fabHintCycleTimer = setTimeout(showPhase, waitMs);
  };

  showPhase();
}

function hideChatToast(targetToast = null) {
  const removeToast = (toastEl) => {
    if (!toastEl || toastEl.classList.contains('is-template')) return;
    toastEl.classList.add('is-closing');
    toastEl.classList.remove('visible');
    setTimeout(() => {
      if (toastEl && toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 220);
  };

  if (targetToast) {
    removeToast(targetToast);
    if (Array.isArray(state.chat.toastItems)) {
      state.chat.toastItems = state.chat.toastItems.filter((item) => {
        const same = item?.el === targetToast;
        if (same && item?.timer) clearTimeout(item.timer);
        return !same;
      });
    }
    if (state.chat.toastGroupBucket?.el === targetToast) {
      state.chat.toastGroupBucket = null;
    }
    return;
  }

  const stack = document.getElementById('chatMsgToastStack');
  if (!stack) return;
  if (Array.isArray(state.chat.toastItems)) {
    state.chat.toastItems.forEach((item) => {
      if (item?.timer) clearTimeout(item.timer);
      removeToast(item?.el);
    });
    state.chat.toastItems = [];
    state.chat.toastGroupBucket = null;
    return;
  }

  stack.querySelectorAll('.chat-msg-toast:not(.is-template)').forEach(removeToast);
}

function ensureChatToastStack() {
  if (state.chat.toastStackRoot && state.chat.toastTemplate) return state.chat.toastStackRoot;

  const toastTemplate = document.getElementById('chatMsgToast') || createFallbackChatToastTemplate();
  if (!toastTemplate) return null;

  let stack = document.getElementById('chatMsgToastStack');
  if (!stack) {
    stack = document.createElement('div');
    stack.id = 'chatMsgToastStack';
    stack.className = 'chat-msg-toast-stack';
    document.body.appendChild(stack);
  }

  if (toastTemplate.parentNode !== stack) {
    stack.appendChild(toastTemplate);
  }

  toastTemplate.classList.add('is-template');
  state.chat.toastStackRoot = stack;
  state.chat.toastTemplate = toastTemplate;
  if (!Array.isArray(state.chat.toastItems)) state.chat.toastItems = [];
  if (!state.chat.toastGroupBucket) state.chat.toastGroupBucket = null;
  return stack;
}

function createFallbackChatToastTemplate() {
  const existing = document.getElementById('chatMsgToast');
  if (existing) return existing;

  const avatarSrc = String(
    window.__lmbUiSettings?.chat?.adminAvatar
    || document.querySelector('#chatFabBtn .cfab-avatar')?.getAttribute('src')
    || '/favicon.ico'
  ).trim();

  const wrapper = document.createElement('div');
  wrapper.id = 'chatMsgToast';
  wrapper.className = 'chat-msg-toast';
  wrapper.setAttribute('role', 'button');
  wrapper.setAttribute('tabindex', '0');
  wrapper.innerHTML = `
    <div class="chat-msg-toast-glow" aria-hidden="true"></div>
    <div class="chat-msg-toast-av"><img src="${escapeHtml(avatarSrc)}" alt="CSKH"></div>
    <div class="chat-msg-toast-body">
      <div class="chat-msg-toast-meta">
        <div class="chat-msg-toast-name">CSKH</div>
        <div class="chat-msg-toast-time" id="chatMsgToastTime">Bây giờ</div>
      </div>
      <div class="chat-msg-toast-text" id="chatMsgToastText">Bạn có tin nhắn mới</div>
      <div class="chat-msg-toast-tag" id="chatMsgToastTag">Thông báo mới</div>
    </div>
    <button class="chat-msg-toast-x" aria-label="Đóng">×</button>
    <div class="chat-msg-toast-progress" aria-hidden="true"></div>
  `;

  document.body.appendChild(wrapper);
  return wrapper;
}

function togChatFromToast() {
  hideChatToast();
  resetChatFabHintMessage();
  togChat();
}

function markChatMessagesAsSeen() {
  const latestSupportTs = (Array.isArray(state.chat.messages) ? state.chat.messages : []).reduce((max, m) => {
    if (m.sender_type === 'customer') return max;
    return Math.max(max, getChatMessageTs(m));
  }, state.chat.lastSeenAt || 0);

  state.chat.lastSeenAt = latestSupportTs;
  if (state.chat.sessionCode) {
    localStorage.setItem(getChatSeenStorageKey(), String(latestSupportTs));
    localStorage.setItem(getChatUnreadStorageKey(), '0');
  }
  state.chat.lastUnreadCount = 0;
  updateChatFabBadge(0);
}

function scheduleChatSeenPost(delayMs = 140) {
  if (!state.chat.sessionCode) return;
  if (state.chat.seenPostInFlight) return;
  if (state.chat.seenPostTimer) return;

  const now = Date.now();
  const cooldownMs = Math.max(300, Number(state.chat.seenPostCooldownMs || 1200));
  const earliest = Number(state.chat.seenPostLastAt || 0) + cooldownMs;
  const waitMs = Math.max(Number(delayMs) || 0, Math.max(0, earliest - now));

  state.chat.seenPostTimer = setTimeout(async () => {
    state.chat.seenPostTimer = null;
    if (!state.chat.sessionCode) return;
    if (document.hidden && !isChatPanelOpen()) return;

    state.chat.seenPostInFlight = true;
    try {
      await fetch(`/api/chat/mark-seen/${encodeURIComponent(state.chat.sessionCode)}`, { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      state.chat.seenPostLastAt = Date.now();
    } catch (_) {
      // Silent by design; seen sync can retry on next interaction/new message.
    } finally {
      state.chat.seenPostInFlight = false;
    }
  }, waitMs);
}

function setChatFieldError(fieldId, message) {
  const err = document.getElementById(`${fieldId}Err`);
  const input = document.getElementById(fieldId);
  if (err) err.textContent = message || '';
  if (input) {
    input.style.borderColor = message ? 'rgba(239,68,68,.8)' : 'rgba(124,58,237,.18)';
  }
}

function updateChatFabBadge(count = 0) {
  const badge = document.getElementById('chatFabBadge');
  const fabBtn = document.getElementById('chatFabBtn');
  if (!badge) return;
  const prevValue = Number(badge.textContent || 0) || 0;
  const value = Number(count) || 0;
  badge.textContent = String(value);
  badge.style.display = value > 0 ? 'flex' : 'none';
  if (fabBtn) fabBtn.classList.toggle('has-unread', value > 0);
  if (value > prevValue) {
    restartCssAnimationByClass(badge, 'is-bump');
    setTimeout(() => badge.classList.remove('is-bump'), 520);
  }
  if (state.chat.sessionCode) {
    localStorage.setItem(getChatUnreadStorageKey(), String(value));
  }
}

function initChatWidgetNotificationRuntime() {
  if (state.chat.notificationRuntimeReady) return;
  state.chat.notificationRuntimeReady = true;
  rtDbg('runtime-init', { sessionCode: state.chat.sessionCode || '' });
  ensureChatToastStack();
  startChatFabHintCycle();

  window.addEventListener('giftbox:chat-unread', (event) => {
    const detail = event?.detail || {};
    const incomingUnread = Number(detail.unreadCount || detail.count || 0);
    if (state.chat.sessionCode) {
      if (detail.message && !isChatPanelOpen()) {
        playRealtimeNotificationSound('admin_message');
        if (window.tabNotification) tabNotification.incrementBadge('Tin nhắn mới');
        showChatToast({ message: detail.message });
        showChatFabHintMessage({ message: detail.message });
      }
      return;
    }
    const current = Number(document.getElementById('chatFabBadge')?.textContent || '0') || 0;
    const nextCount = incomingUnread > 0 ? incomingUnread : (current + 1);
    updateChatFabBadge(nextCount);
    state.chat.lastUnreadCount = nextCount;
    if (nextCount > 0) {
      playRealtimeNotificationSound('admin_message');
      if (window.tabNotification) tabNotification.incrementBadge('Tin nhắn mới');
      showChatToast({ message: detail.message || 'Bạn có tin nhắn mới' });
      showChatFabHintMessage({ message: detail.message || 'Bạn có tin nhắn mới' });
    }
  });

  const savedSessionCode = localStorage.getItem(getChatSessionStorageKey()) || '';
  updateChatFabBadge(0);
  state.chat.lastUnreadCount = 0;
  state.chat.unreadBaselineReady = false;

  state.chat.sessionCode = String(state.chat.sessionCode || savedSessionCode || '').trim().toUpperCase();
  if (state.chat.sessionCode) {
    state.chat.lastSeenAt = Number(localStorage.getItem(getChatSeenStorageKey()) || '0') || 0;
  }

  // Keep notifications working even when chat panel is closed.
  startChatSSE();

  // Bootstrap realtime notifications in background so user does not need to
  // open the chat panel before receiving admin message sound/toast/hint.
  bootstrapChatNotificationRuntime().catch(() => {});
}

async function bootstrapChatNotificationRuntime() {
  if (state.chat.notificationBootstrapInFlight) return;
  state.chat.notificationBootstrapInFlight = true;
  rtDbg('bootstrap-start', { sessionCode: state.chat.sessionCode || '' });
  try {
    if (!state.chat.sessionCode) {
      state.chat.sessionCode = localStorage.getItem(getChatSessionStorageKey()) || '';
    }

    if (!state.chat.sessionCode) {
      scheduleChatNotificationBootstrapRetry();
      rtDbg('bootstrap-no-session', {});
      return;
    }

    state.chat.lastSeenAt = Number(localStorage.getItem(getChatSeenStorageKey()) || '0') || 0;
    state.chat.lastUnreadCount = Number(localStorage.getItem(getChatUnreadStorageKey()) || '0') || 0;

    startChatSSE();
    await fetchChatMessages();
    rtDbg('bootstrap-success', {
      sessionCode: state.chat.sessionCode || '',
      messageCount: Array.isArray(state.chat.messages) ? state.chat.messages.length : 0
    });
  } catch (_) {
    // Keep startup resilient: if bootstrap fails, panel-open path still works.
    scheduleChatNotificationBootstrapRetry();
    rtDbg('bootstrap-failed', {});
  } finally {
    state.chat.notificationBootstrapInFlight = false;
  }
}

function scheduleChatNotificationBootstrapRetry() {
  const attempts = Number(state.chat.notificationBootstrapAttempts || 0) + 1;
  state.chat.notificationBootstrapAttempts = attempts;
  if (attempts > 5) return;
  const delayMs = Math.min(7000, 900 + attempts * 900);
  if (state.chat.notificationBootstrapRetryTimer) {
    clearTimeout(state.chat.notificationBootstrapRetryTimer);
  }
  state.chat.notificationBootstrapRetryTimer = setTimeout(() => {
    state.chat.notificationBootstrapRetryTimer = null;
    bootstrapChatNotificationRuntime().catch(() => {});
  }, delayMs);
  rtDbg('bootstrap-retry-scheduled', { attempts, delayMs });
}

function applyUiMotionSettingForCustomer() {
  const mode = localStorage.getItem('uiMotionLevel') || 'full';
  document.body.classList.toggle('medium-motion', mode === 'medium');
  document.body.classList.toggle('reduce-motion', mode === 'reduced');
}

function setChatReadyUI(isReady) {
  const pre = document.getElementById('chatPreForm');
  const quick = document.querySelector('#cpanel .cquick');
  const inputWrap = document.getElementById('cinputWrap');
  const inputRow = document.querySelector('#cpanel .cinp-row');
  if (pre) pre.style.display = isReady ? 'none' : 'flex';
  if (quick) quick.style.display = isReady ? 'flex' : 'none';
  if (inputWrap) inputWrap.style.display = isReady ? 'block' : 'none';
  if (inputRow) inputRow.style.display = isReady ? 'flex' : 'none';
  const input = document.getElementById('cinp');
  if (input) {
    if (isReady) ensureCustomerChatInteractiveBindings();
    autoResizeCustomerChatInput(input);
    updateChatComposerState(input);
  }
}

function isChatProfileComplete() {
  return !!state.chat.profileCompleted;
}

function hasValidSavedChatProfile(profile) {
  const p = profile && typeof profile === 'object' ? profile : {};
  const nameOk = String(p.customerName || '').trim().length > 0;
  const phone = String(p.customerPhone || '').replace(/\D/g, '');
  const phoneOk = /^\d{10,11}$/.test(phone);
  const code = String(p.gameSessionCode || '').trim().toUpperCase();
  const codeOk = code.length > 0;
  return nameOk && phoneOk && codeOk;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const DEFAULT_CHAT_AGENT_NAME = 'CSKH Lâm TaoBao';

function isAutoBotSupportName(name) {
  const normalized = String(name || '').trim().toLowerCase();
  return normalized === 'bot hồng ngọc' || normalized === 'bot hong ngoc';
}

function getVisibleChatMessages(messages = state.chat.messages) {
  const list = Array.isArray(messages) ? messages : [];
  const hasHumanSupportReply = list.some((m) => {
    if (m.sender_type === 'customer') return false;
    return !isAutoBotSupportName(m.sender_name);
  });

  return hasHumanSupportReply
    ? list.filter((m) => !(m.sender_type !== 'customer' && isAutoBotSupportName(m.sender_name)))
    : list;
}

function getChatMessageDomKey(message) {
  const id = String(message?.id || '').trim();
  if (id) return `id:${id}`;
  const ts = getChatMessageTs(message);
  const sender = String(message?.sender_type || '').toLowerCase();
  const txt = String(message?.message || '').slice(0, 60);
  return `fallback:${ts}:${sender}:${txt}`;
}

function pseudoRandHeights(seed, count) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (((h << 5) - h) + seed.charCodeAt(i)) | 0;
  const out = [];
  for (let i = 0; i < count; i++) {
    h = (Math.imul(h, 1664525) + 1013904223) | 0;
    out.push(18 + ((h >>> 0) % 72));
  }
  return out;
}

function createVoicePlayerNode(url) {
  const BARS = 30;
  const PLAY_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>';
  const PAUSE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

  const wrap = document.createElement('div');
  wrap.className = 'chat-voice-player';

  const audio = document.createElement('audio');
  audio.src = url;
  audio.preload = 'auto';
  audio.style.cssText = 'display:none;position:absolute;pointer-events:none;';

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'chat-voice-play-btn';
  playBtn.innerHTML = PLAY_SVG;
  playBtn.setAttribute('aria-label', 'Phát tin nhắn thoại');

  const waveWrap = document.createElement('div');
  waveWrap.className = 'chat-voice-wave';

  const heights = pseudoRandHeights(url, BARS);
  for (let i = 0; i < BARS; i++) {
    const bar = document.createElement('span');
    bar.className = 'chat-voice-bar';
    bar.style.height = `${heights[i]}%`;
    waveWrap.appendChild(bar);
  }

  const timeEl = document.createElement('span');
  timeEl.className = 'chat-voice-time';
  timeEl.textContent = '0:00';

  function fmt(s) {
    const t = Math.floor(s || 0);
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  }

  function updateBars(pct) {
    const filled = Math.round(pct * BARS);
    const bars = waveWrap.children;
    for (let i = 0; i < bars.length; i++) bars[i].classList.toggle('played', i < filled);
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      document.querySelectorAll('.chat-voice-player audio').forEach(a => { if (a !== audio) a.pause(); });
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  waveWrap.addEventListener('click', e => {
    if (!audio.duration) return;
    const r = waveWrap.getBoundingClientRect();
    audio.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * audio.duration;
  });

  audio.addEventListener('play', () => { wrap.classList.add('playing'); playBtn.innerHTML = PAUSE_SVG; });
  audio.addEventListener('pause', () => { wrap.classList.remove('playing'); playBtn.innerHTML = PLAY_SVG; });
  audio.addEventListener('ended', () => {
    wrap.classList.remove('playing');
    playBtn.innerHTML = PLAY_SVG;
    updateBars(0);
    if (audio.duration) timeEl.textContent = fmt(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    updateBars(audio.currentTime / audio.duration);
    timeEl.textContent = fmt(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', () => {
    if (audio.duration > 0) timeEl.textContent = fmt(audio.duration);
  });

  wrap.appendChild(audio);
  wrap.appendChild(playBtn);
  wrap.appendChild(waveWrap);
  wrap.appendChild(timeEl);
  return wrap;
}

function createChatAttachmentNode(message) {
  const url = String(message?.attachment_url || '').trim();
  if (!url) return null;

  const messageType = String(message?.message_type || '').toLowerCase();
  const attachmentType = String(message?.attachment_type || '').toLowerCase();
  const name = String(message?.message || 'Tep dinh kem').replace(/^([🖼️📎🎤]\s*)/, '').trim() || 'Tep dinh kem';
  const isImage = messageType === 'image' || attachmentType.includes('image') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);
  const isAudio = attachmentType.includes('audio') || /\.(webm|ogg|mp3|wav|m4a|aac)$/i.test(url);

  const wrap = document.createElement('span');
  wrap.className = 'chat-attachment';
  if (isImage) {
    const img = document.createElement('img');
    img.className = 'chat-attachment-img';
    img.src = url;
    img.alt = name;
    img.loading = 'lazy';
    img.decoding = 'async';
    wrap.appendChild(img);
    return wrap;
  }

  if (isAudio) {
    return createVoicePlayerNode(url);
  }

  const link = document.createElement('a');
  link.className = 'chat-attachment-file';
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('download', '');

  const icon = document.createElement('span');
  icon.className = 'chat-attachment-icon';
  icon.textContent = 'FILE';

  const label = document.createElement('span');
  label.textContent = name;

  link.appendChild(icon);
  link.appendChild(label);
  wrap.appendChild(link);
  return wrap;
}

function sanitizeSupportHtml(raw) {
  var text = String(raw || '');
  if (!text) return '';
  if (!/<[a-z][\s\S]*?>/i.test(text)) {
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML.replace(/\n/g, '<br>');
  }
  var ALLOWED = { b:1, i:1, u:1, strong:1, em:1, span:1, br:1, p:1, div:1, ol:1, ul:1, li:1 };
  var tmp = document.createElement('div');
  tmp.innerHTML = text;
  (function clean(node) {
    Array.from(node.childNodes).forEach(function(child) {
      if (child.nodeType === 3) return;
      if (child.nodeType !== 1) { child.remove(); return; }
      var tag = child.tagName.toLowerCase();
      if (!ALLOWED[tag]) {
        while (child.firstChild) node.insertBefore(child.firstChild, child);
        child.remove();
        return;
      }
      Array.from(child.attributes).forEach(function(attr) {
        if (tag === 'span' && attr.name === 'style') {
          var safe = attr.value.split(';').filter(function(s) {
            return /^\s*(color|font-size)\s*:/i.test(s);
          }).join(';');
          child.setAttribute('style', safe);
        } else {
          child.removeAttribute(attr.name);
        }
      });
      clean(child);
    });
  })(tmp);
  return tmp.innerHTML;
}

function createChatMessageRowElement(message, opts = {}) {
  const m = message || {};
  const mine = String(m.sender_type || '').toLowerCase() === 'customer';
  const customerName = opts._cachedCustomerName || String(document.getElementById('chatCustomerName')?.value || 'Ban').trim() || 'Ban';
  const senderName = mine ? customerName : DEFAULT_CHAT_AGENT_NAME;
  const displayName = mine ? customerName : senderName;
  const supportAvatar = opts._cachedSupportAvatar ?? (String(document.querySelector('.ch-av img')?.getAttribute('src') || '').trim());
  const text = String(m.message || '').replace(/^([🖼️📎🎤]\s*)/, '').trim();
  const attachUrl = String(m.attachment_url || '').trim();
  const mType = String(m.message_type || '').toLowerCase();
  const aType = String(m.attachment_type || '').toLowerCase();
  const isImageMsg = !!attachUrl && (mType === 'image' || aType.includes('image') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(attachUrl));
  const isAudioMsg = !!attachUrl && (aType.includes('audio') || /\.(webm|ogg|mp3|wav|m4a|aac)$/i.test(attachUrl));
  const key = getChatMessageDomKey(m);

  const row = document.createElement('div');
  row.className = `cmsg-row ${mine ? 'mine' : ''}${opts.isFreshMessage ? ' is-fresh' : ''}`;
  row.dataset.chatId = String(m.id || m.created_at || Date.now());
  row.dataset.chatKey = key;

  const content = document.createElement('div');
  content.className = 'cmsg-row-content';

  if (!mine && supportAvatar) {
    const avatar = document.createElement('span');
    avatar.className = 'cmsg-avatar admin';
    const img = document.createElement('img');
    img.src = supportAvatar;
    img.alt = displayName;
    img.loading = 'lazy';
    img.decoding = 'async';
    avatar.appendChild(img);
    content.appendChild(avatar);
  } else {
    const avatar = document.createElement('span');
    avatar.className = `cmsg-avatar ${mine ? 'mine' : 'admin'}`;
    avatar.textContent = displayName.slice(0, 2).toUpperCase();
    content.appendChild(avatar);
  }

  const col = document.createElement('div');
  col.className = 'cmsg-col';

  const title = document.createElement('div');
  title.className = 'msnd';
  title.textContent = mine ? 'Ban' : DEFAULT_CHAT_AGENT_NAME;
  col.appendChild(title);

  const bubble = document.createElement('div');
  bubble.className = isImageMsg ? 'mbub media-only' : `mbub${mine ? ' mine' : ''}${isAudioMsg ? ' voice-bubble' : ''}`;
  if (!isImageMsg && !isAudioMsg && text) {
    if (mine) {
      bubble.textContent = text;
    } else {
      bubble.innerHTML = sanitizeSupportHtml(text);
    }
  }
  const attachment = createChatAttachmentNode(m);
  if (attachment) bubble.appendChild(attachment);
  col.appendChild(bubble);

  const timeEl = document.createElement('div');
  timeEl.className = 'cmsg-time';
  timeEl.textContent = formatChatMessageDateTime(m.created_at || m.createdAt || m.updated_at);

  const statusWrap = document.createElement('div');
  statusWrap.className = 'cmsg-meta';
  statusWrap.appendChild(timeEl);

  if (mine) {
    const statusEl = document.createElement('span');
    const status = resolveOutgoingMessageStatus(m);
    statusEl.className = `cmsg-status ${status}`;
    statusEl.textContent = getOutgoingChatStatusLabel(m);
    statusWrap.appendChild(statusEl);

    if (status === 'failed') {
      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'cmsg-retry-btn';
      retryBtn.dataset.chatRetryId = String(m.id || '');
      retryBtn.textContent = 'Thu lai';
      statusWrap.appendChild(retryBtn);
    }
  }

  col.appendChild(statusWrap);

  content.appendChild(col);
  row.appendChild(content);
  return row;
}

function createChatWelcomeRow() {
  return createChatMessageRowElement({
    id: 'welcome',
    sender_type: 'support',
    sender_name: DEFAULT_CHAT_AGENT_NAME,
    message: 'Xin chao! Chung toi co the giup gi cho ban?'
  });
}

function renderChatMessages(options = {}) {
  const box = document.getElementById('cmsgs');
  if (!box) return;
  const forceFresh = !!options.forceFresh;
  const shouldStickBottom = isNearChatBottom(box);
  state.chat.messages = capChatMessages(state.chat.messages);
  const visibleMessages = getVisibleChatMessages(state.chat.messages);

  const previousRenderedTs = Number(state.chat.lastRenderedMessageTs || 0);
  const allowFreshAnimation = previousRenderedTs > 0;
  let maxRenderedTs = previousRenderedTs;

  if (!visibleMessages.length) {
    box.textContent = '';
    box.appendChild(createChatWelcomeRow());
    box.dataset.chatHydrated = '1';
    box.dataset.chatEmpty = '1';
    box.dataset.chatVirtualized = '0';
    return;
  }

  const windowRange = getVirtualizedChatWindow(visibleMessages, box);
  const messagesInWindow = visibleMessages.slice(windowRange.start, windowRange.end);
  const renderFrag = document.createDocumentFragment();
  const cachedCustomerName = String(document.getElementById('chatCustomerName')?.value || 'Ban').trim() || 'Ban';
  const cachedSupportAvatar = String(document.querySelector('.ch-av img')?.getAttribute('src') || '').trim();

  if (windowRange.virtualized && windowRange.topPad > 0) {
    const topSpacer = document.createElement('div');
    topSpacer.className = 'chat-vspacer chat-vspacer-top';
    topSpacer.style.height = `${windowRange.topPad}px`;
    renderFrag.appendChild(topSpacer);
  }

  for (let i = 0; i < messagesInWindow.length; i += 1) {
    const message = messagesInWindow[i];
    const msgTs = getChatMessageTs(message);
    if (msgTs > maxRenderedTs) maxRenderedTs = msgTs;
    const isFreshMessage = forceFresh || (allowFreshAnimation && msgTs > previousRenderedTs);
    renderFrag.appendChild(createChatMessageRowElement(message, { isFreshMessage, _cachedCustomerName: cachedCustomerName, _cachedSupportAvatar: cachedSupportAvatar }));
  }

  if (windowRange.virtualized && windowRange.bottomPad > 0) {
    const bottomSpacer = document.createElement('div');
    bottomSpacer.className = 'chat-vspacer chat-vspacer-bottom';
    bottomSpacer.style.height = `${windowRange.bottomPad}px`;
    renderFrag.appendChild(bottomSpacer);
  }

  box.replaceChildren(renderFrag);

  if (maxRenderedTs > 0) {
    state.chat.lastRenderedMessageTs = maxRenderedTs;
  }
  box.dataset.chatHydrated = '1';
  box.dataset.chatEmpty = '0';
  box.dataset.chatVirtualized = windowRange.virtualized ? '1' : '0';
  if ((!document.hidden || isChatPanelOpen()) && shouldStickBottom) {
    box.scrollTop = box.scrollHeight;
  }
}

function renderChatAttachment(message) {
  const url = String(message?.attachment_url || '').trim();
  if (!url) return '';

  const messageType = String(message?.message_type || '').toLowerCase();
  const attachmentType = String(message?.attachment_type || '').toLowerCase();
  const name = escapeHtml(String(message?.message || 'Tệp đính kèm').replace(/^([🖼️📎🎤]\s*)/, ''));
  const isImage = messageType === 'image' || attachmentType.includes('image') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);
  const isAudio = messageType === 'audio' || attachmentType.includes('audio') || /\.(webm|ogg|mp3|wav|m4a|aac)$/i.test(url);

  if (isImage) {
    return `<span class="chat-attachment"><img class="chat-attachment-img" src="${escapeHtml(url)}" alt="${name}" loading="lazy"></span>`;
  }
  if (isAudio) {
    return `<span class="chat-attachment chat-attachment-voice"><audio controls preload="auto" src="${escapeHtml(url)}"></audio></span>`;
  }
  return `<span class="chat-attachment"><a class="chat-attachment-file" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" download><span class="chat-attachment-icon">FILE</span><span>${name}</span></a></span>`;
}

async function fetchChatMessages(options = {}) {
  if (!state.chat.sessionCode) return;
  if (state.chat.messagesFetchInFlight) {
    return state.chat.messagesFetchInFlight;
  }

  const force = options && options.force === true;
  const now = Date.now();
  const minIntervalMs = Math.max(400, Number(state.chat.messagesFetchMinIntervalMs || 1800));
  const hasHydratedMessages = Array.isArray(state.chat.messages) && state.chat.messages.length > 0;
  const elapsedMs = now - Number(state.chat.messagesLastFetchAt || 0);
  if (!force && hasHydratedMessages && elapsedMs >= 0 && elapsedMs < minIntervalMs) {
    if (isChatPanelOpen()) {
      markChatMessagesAsSeen();
      scheduleChatSeenPost(80);
      state.chat.unreadBaselineReady = true;
    } else {
      syncChatUnreadUi();
    }
    return;
  }

  const runFetch = async () => {
    rtDbg('fetch-messages-start', { sessionCode: state.chat.sessionCode || '' });
    notifyDbg('fetch-chat-messages-start', { sessionCode: state.chat.sessionCode || '' });
    let rs;
    try {
      rs = await apiJson(`/api/chat/messages/${encodeURIComponent(state.chat.sessionCode)}`);
    } catch (err) {
      notifyDbg('fetch-chat-messages-error', {
        sessionCode: state.chat.sessionCode || '',
        message: err?.message || String(err || '')
      });
      const msg = String(err?.message || '').toLowerCase();
      if (msg.includes('không tìm thấy phiên chat') || msg.includes('hết hạn')) {
        state.chat.sessionCode = '';
        localStorage.removeItem(getChatSessionStorageKey());
        state.chat.profileCompleted = false;
        setChatReadyUI(false);
        showToast('ℹ️ Phiên chat đã hết hạn, vui lòng bắt đầu chat lại.');
        return;
      }
      throw err;
    }
    state.chat.messagesLastFetchAt = Date.now();
    state.chat.messages = capChatMessages(hydrateChatMessageListForUi(Array.isArray(rs.data) ? rs.data : []));
    rtDbg('fetch-messages-done', {
      sessionCode: state.chat.sessionCode || '',
      messageCount: state.chat.messages.length
    });
    scheduleChatRender();

    if (isChatPanelOpen()) {
      markChatMessagesAsSeen();
      scheduleChatSeenPost(80);
      state.chat.unreadBaselineReady = true;
      return;
    }

    // On first hydration, always set baseline to latest support message.
    // This keeps badge at 0 on page load and only counts new incoming messages.
    if (!state.chat.unreadBaselineReady) {
      const latestSupportTs = getUnseenSupportMessages(state.chat.messages).reduce((max, m) => {
        return Math.max(max, getChatMessageTs(m));
      }, 0);
      if (latestSupportTs > 0) {
        state.chat.lastSeenAt = latestSupportTs;
        localStorage.setItem(getChatSeenStorageKey(), String(latestSupportTs));
      }
      state.chat.lastUnreadCount = 0;
      updateChatFabBadge(0);
      state.chat.unreadBaselineReady = true;
      return;
    }

    syncChatUnreadUi();
  };

  state.chat.messagesFetchInFlight = runFetch()
    .finally(() => {
      state.chat.messagesFetchInFlight = null;
    });
  return state.chat.messagesFetchInFlight;
}

async function startCustomerChat() {
  const customerName = (document.getElementById('chatCustomerName')?.value || '').trim();
  const customerPhone = (document.getElementById('chatCustomerPhone')?.value || '').trim();
  const gameSessionCode = (document.getElementById('chatGameSessionCode')?.value || '').trim().toUpperCase();

  setChatFieldError('chatCustomerName', '');
  setChatFieldError('chatCustomerPhone', '');
  setChatFieldError('chatGameSessionCode', '');

  let hasError = false;
  if (!customerName) {
    setChatFieldError('chatCustomerName', 'Vui lòng nhập họ và tên.');
    hasError = true;
  }
  if (!/^\d{10,11}$/.test(customerPhone.replace(/\D/g, ''))) {
    setChatFieldError('chatCustomerPhone', 'Số điện thoại phải gồm 10-11 chữ số.');
    hasError = true;
  }
  if (!gameSessionCode) {
    setChatFieldError('chatGameSessionCode', 'Vui lòng nhập mã phiên chơi.');
    hasError = true;
  }
  if (hasError) return;

  const payload = {
    customer_name: customerName,
    customer_phone: customerPhone,
    game_session_code: gameSessionCode,
    topic: `Hỗ trợ phiên ${gameSessionCode}`
  };

  try {
    let rs;
    if (state.chat.sessionCode) {
      notifyDbg('chat-start-profile-update', { sessionCode: state.chat.sessionCode, gameSessionCode });
      rs = await apiJson(`/api/chat/profile/${encodeURIComponent(state.chat.sessionCode)}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } else {
      notifyDbg('chat-start-new-session', { gameSessionCode });
      rs = await apiJson('/api/chat/start', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    state.chat.sessionCode = rs.data?.session_code || '';
    state.chat.profileCompleted = true;
    if (state.chat.sessionCode) {
      localStorage.setItem(getChatSessionStorageKey(), state.chat.sessionCode);
      localStorage.setItem(getChatProfileStorageKey(), JSON.stringify({ customerName, customerPhone, gameSessionCode }));
      state.chat.lastSeenAt = 0;
      localStorage.setItem(getChatSeenStorageKey(), '0');
      localStorage.setItem(getChatUnreadStorageKey(), '0');
    }

    setChatReadyUI(true);
    ensureCustomerChatInteractiveBindings();
    await fetchChatMessages();
    startChatSSE();
    notifyDbg('chat-start-success', {
      chatSessionCode: state.chat.sessionCode || '',
      gameSessionCode,
      messageCount: Array.isArray(state.chat.messages) ? state.chat.messages.length : 0
    });
    showToast('✅ Bắt đầu chat thành công');

    // Auto-send prize info if pending from openChatWithPrizeInfo
    if (state.chat.pendingPrizeInfo) {
      await sendPrizeInfoMessage();
    }
  } catch (err) {
    notifyDbg('chat-start-error', { message: err?.message || String(err || ''), code: err?.code || '' });
    if (err?.code === 'IP_RATE_LIMITED') {
      const existingCode = String(err?.data?.existing_session_code || '').trim().toUpperCase();
      if (existingCode) {
        try {
          await apiJson(`/api/chat/session/${encodeURIComponent(existingCode)}`);
          state.chat.sessionCode = existingCode;
          state.chat.profileCompleted = true;
          localStorage.setItem(getChatSessionStorageKey(), existingCode);
          localStorage.setItem(getChatProfileStorageKey(), JSON.stringify({ customerName, customerPhone, gameSessionCode }));
          state.chat.lastSeenAt = 0;
          localStorage.setItem(getChatSeenStorageKey(), '0');
          localStorage.setItem(getChatUnreadStorageKey(), '0');
          setChatReadyUI(true);
          ensureCustomerChatInteractiveBindings();
          await fetchChatMessages();
          startChatSSE();
          showToast('💬 Đã kết nối lại phiên chat hiện tại của bạn');
          return;
        } catch (_) {}
      }
      showToast(`⚠️ ${err.message}`);
      return;
    }
    showToast(`❌ ${err.message}`);
  }
}

async function sendCustomerMessage(text) {
  const options = (arguments.length > 1 && arguments[1] && typeof arguments[1] === 'object')
    ? arguments[1]
    : {};
  if (!state.chat.sessionCode) {
    showToast('❌ Vui lòng nhập thông tin và bắt đầu chat trước');
    throw new Error('Vui lòng bắt đầu chat trước');
  }
  if (!isChatProfileComplete()) {
    showToast('ℹ️ Vui lòng điền tên, số điện thoại và mã phiên để tiếp tục chat.');
    setChatReadyUI(false);
    throw new Error('Vui lòng điền đầy đủ thông tin chat');
  }
  const message = String(text || '').trim();
  if (!message) return;
  const senderName = (document.getElementById('chatCustomerName')?.value || 'Khach hang').trim() || 'Khach hang';
  const senderPhone = String(document.getElementById('chatCustomerPhone')?.value || '').replace(/\D/g, '');

  const optimisticMessage = createOptimisticTextMessage(message);
  const optimisticId = String(optimisticMessage.id || '');
  appendChatMessage(optimisticMessage);
  if (!document.hidden || isChatPanelOpen()) {
    scheduleChatRender({ fresh: true });
  }

  try {
    const rs = await apiJson('/api/chat/message', {
      method: 'POST',
      timeoutMs: Math.max(8000, Number(options.timeoutMs) || 20000),
      body: JSON.stringify({
        session_code: state.chat.sessionCode,
        sender_type: 'customer',
        sender_name: senderName,
        customer_name: senderName,
        customer_phone: senderPhone,
        message
      })
    });

    const sentMessage = hydrateChatMessageForUi(rs?.data);
    if (sentMessage) {
      const replaced = replaceOptimisticMessage(optimisticId, sentMessage);
      if (!replaced) appendChatMessage(sentMessage);
      if (!document.hidden || isChatPanelOpen()) {
        scheduleChatRender({ fresh: true });
      }
    }
  } catch (err) {
    markChatMessageFailedById(optimisticId, err?.message || 'Gui that bai');
    scheduleChatRender();
    throw err;
  }
}

function enqueueCustomerMessage(text, options = {}) {
  const message = String(text || '').trim();
  if (!message) return Promise.resolve();
  if (!Array.isArray(state.chat.sendQueue)) state.chat.sendQueue = [];

  return new Promise((resolve, reject) => {
    state.chat.sendQueue.push({
      text: message,
      options: {
        restoreDraftOnError: options.restoreDraftOnError !== false,
        focusInputOnDone: options.focusInputOnDone !== false,
        timeoutMs: Math.max(8000, Number(options.timeoutMs) || 20000),
        silent: options.silent === true
      },
      resolve,
      reject
    });
    flushCustomerMessageQueue().catch(() => {});
  });
}

async function flushCustomerMessageQueue() {
  if (state.chat.sendDrainPromise) return state.chat.sendDrainPromise;

  state.chat.sendDrainPromise = (async () => {
    while (Array.isArray(state.chat.sendQueue) && state.chat.sendQueue.length > 0) {
      const nextJob = state.chat.sendQueue.shift();
      if (!nextJob || !String(nextJob.text || '').trim()) continue;

      setChatSendBusy(true);
      try {
        await sendCustomerMessage(nextJob.text, { timeoutMs: nextJob.options?.timeoutMs || 20000 });
        nextJob.resolve();
      } catch (err) {
        const input = document.getElementById('cinp');
        if (nextJob.options?.restoreDraftOnError !== false && input && !String(input.value || '').trim()) {
          input.value = nextJob.text;
          autoResizeCustomerChatInput(input);
          updateChatComposerState(input);
        }
        if (nextJob.options?.focusInputOnDone !== false && input) {
          try { input.focus(); } catch (_) {}
        }
        nextJob.reject(err);
      } finally {
        setChatSendBusy(false);
      }
    }
  })().finally(() => {
    state.chat.sendDrainPromise = null;
    updateChatComposerState(document.getElementById('cinp'));
  });

  return state.chat.sendDrainPromise;
}

async function retryFailedChatMessage(messageId) {
  const targetId = String(messageId || '').trim();
  if (!targetId || !Array.isArray(state.chat.messages)) return;
  const message = state.chat.messages.find((m) => String(m?.id || '') === targetId);
  if (!message) return;

  const payload = message?._ui?.retryPayload;
  if (!payload || payload.type !== 'text') return;

  const ui = ensureChatMessageUiMeta(message);
  ui.status = 'pending';
  ui.error = '';
  scheduleChatRender({ fresh: true });

  try {
    const senderName = (document.getElementById('chatCustomerName')?.value || 'Khach hang').trim() || 'Khach hang';
    const senderPhone = String(document.getElementById('chatCustomerPhone')?.value || '').replace(/\D/g, '');
    setChatSendBusy(true);
    const rs = await apiJson('/api/chat/message', {
      method: 'POST',
      timeoutMs: 20000,
      body: JSON.stringify({
        session_code: state.chat.sessionCode,
        sender_type: 'customer',
        sender_name: senderName,
        customer_name: senderName,
        customer_phone: senderPhone,
        message: String(payload.message || '')
      })
    });
    const sentMessage = hydrateChatMessageForUi(rs?.data);
    if (sentMessage) {
      replaceOptimisticMessage(targetId, sentMessage);
      scheduleChatRender({ fresh: true });
    }
  } catch (err) {
    markChatMessageFailedById(targetId, err?.message || 'Gui that bai');
    scheduleChatRender();
    throw err;
  } finally {
    setChatSendBusy(false);
  }
}

function ensureChatMessageActionBindings() {
  if (state.chat.messageActionBound) return;
  const box = document.getElementById('cmsgs');
  if (!box) return;
  box.addEventListener('click', (event) => {
    const retryBtn = event.target?.closest?.('.cmsg-retry-btn');
    if (!retryBtn) return;
    event.preventDefault();
    event.stopPropagation();
    retryFailedChatMessage(retryBtn.dataset.chatRetryId).catch((err) => {
      showToast(`❌ ${err?.message || 'Khong the gui lai tin nhan'}`);
    });
  });
  state.chat.messageActionBound = true;
}

function ensureChatVirtualScrollBinding() {
  if (state.chat.virtualScrollBound) return;
  const box = document.getElementById('cmsgs');
  if (!box) return;
  let scrollTicking = false;
  box.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      scrollTicking = false;
      scheduleChatRender();
    });
  }, { passive: true });
  state.chat.virtualScrollBound = true;
}

function appendEmojiToChatInput(emoji) {
  const input = document.getElementById('cinp');
  if (!input) return;
  input.value = `${input.value || ''}${emoji}`;
  autoResizeCustomerChatInput(input);
  updateChatComposerState(input);
  input.focus();
}

let _chatInputResizeRaf = 0;
let _chatInputLastHeight = 38;
let _chatInputComposing = false;
let _chatTypingEmitDebounceTimer = null;

function setChatInputTypingState(text = '') {
  const typingEl = document.getElementById('cinputTypingState');
  if (!typingEl) return;
  typingEl.textContent = String(text || '').trim();
}

function updateChatComposerState(inputEl = document.getElementById('cinp')) {
  const panel = document.getElementById('cpanel');
  const inputWrap = document.getElementById('cinputWrap');
  const sendBtn = document.querySelector('.c-send');
  if (!inputEl || !sendBtn) return;

  // Auto-recover stale uploadBusy (e.g. network hang on mobile)
  if (state.chat.uploadBusy && state._uploadBusySince && (Date.now() - state._uploadBusySince > 45000)) {
    state.chat.uploadBusy = false;
    state._uploadBusySince = 0;
    inputEl.disabled = false;
  }

  if (state.chat.sendBusy && state.chat.sendBusySince && (Date.now() - state.chat.sendBusySince > 45000)) {
    state.chat.sendBusy = false;
    state.chat.sendBusySince = 0;
  }

  const hasText = String(inputEl.value || '').trim().length > 0;
  const chatReady = !!state.chat.sessionCode && isChatProfileComplete();
  const composerVisible = !inputWrap || inputWrap.style.display !== 'none';
  const canSend = hasText && composerVisible && chatReady && !state.chat.uploadBusy && !state.chat.sendBusy && !inputEl.disabled;
  sendBtn.disabled = !canSend;
  sendBtn.classList.toggle('is-busy', !!state.chat.sendBusy || !!state.chat.uploadBusy);
  sendBtn.setAttribute('aria-disabled', canSend ? 'false' : 'true');
  sendBtn.setAttribute('aria-busy', (state.chat.sendBusy || state.chat.uploadBusy) ? 'true' : 'false');

  if (panel) panel.classList.toggle('is-typing', hasText);
  setChatInputTypingState(hasText ? 'Bạn đang nhập tin nhắn...' : '');
}

function bindCustomerChatComposer(inputEl = document.getElementById('cinp')) {
  if (!inputEl || inputEl.dataset.composerBound === '1') return;

  const refreshComposer = () => {
    autoResizeCustomerChatInput(inputEl);
    updateChatComposerState(inputEl);
  };

  inputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !_chatInputComposing && !event.isComposing) {
      event.preventDefault();
      sendC();
    }
  });

  inputEl.addEventListener('compositionstart', () => {
    _chatInputComposing = true;
  });

  inputEl.addEventListener('compositionend', () => {
    _chatInputComposing = false;
    refreshComposer();
  });

  inputEl.addEventListener('input', () => {
    refreshComposer();
    if (_chatTypingEmitDebounceTimer) {
      clearTimeout(_chatTypingEmitDebounceTimer);
    }
    _chatTypingEmitDebounceTimer = setTimeout(() => {
      _chatTypingEmitDebounceTimer = null;
      if (state.chat.sessionCode) emitChatTyping();
    }, 90);
  });

  ['change', 'keyup', 'focus', 'blur'].forEach((eventName) => {
    inputEl.addEventListener(eventName, refreshComposer);
  });

  ['paste', 'cut'].forEach((eventName) => {
    inputEl.addEventListener(eventName, () => {
      setTimeout(refreshComposer, 0);
    });
  });

  refreshComposer();
  inputEl.dataset.composerBound = '1';
}

function ensureCustomerChatInteractiveBindings() {
  const input = document.getElementById('cinp');
  bindCustomerChatComposer(input);
  initChatDragDrop();
  initChatEmojiPicker();
  ensureChatMessageActionBindings();
  ensureChatVirtualScrollBinding();
  if (input) {
    autoResizeCustomerChatInput(input);
    updateChatComposerState(input);
  }
}

function autoResizeCustomerChatInput(inputEl) {
  if (!inputEl) return;
  if (_chatInputResizeRaf) {
    cancelAnimationFrame(_chatInputResizeRaf);
    _chatInputResizeRaf = 0;
  }
  _chatInputResizeRaf = requestAnimationFrame(() => {
    const minHeight = 44;
    const maxHeight = 136;
    inputEl.style.height = `${minHeight}px`;
    const nextHeight = Math.min(inputEl.scrollHeight, maxHeight);
    const finalHeight = Math.max(minHeight, nextHeight);
    if (Math.abs(finalHeight - _chatInputLastHeight) > 0.5) {
      _chatInputLastHeight = finalHeight;
      inputEl.style.height = `${finalHeight}px`;
    } else {
      inputEl.style.height = `${_chatInputLastHeight}px`;
    }
    inputEl.style.overflowY = inputEl.scrollHeight > maxHeight ? 'auto' : 'hidden';
    _chatInputResizeRaf = 0;
  });
}

function initChatEmojiPicker() {
  const panel = document.getElementById('chatEmojiPanel');
  const grid = document.getElementById('chatEmojiGrid');
  const trigger = document.querySelector('.c-emoji');
  if (!panel || !grid || !trigger) return;

  const positionEmojiPanel = () => {
    const row = document.querySelector('.cinp-row');
    if (!row) return;
    const rowRect = row.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const panelWidth = panel.offsetWidth || 352;
    const maxLeft = Math.max(8, rowRect.width - panelWidth - 8);
    const left = Math.min(Math.max(8, triggerRect.left - rowRect.left - 4), maxLeft);
    panel.style.left = `${Math.round(left)}px`;
    panel.style.bottom = `${Math.round(rowRect.height + 8)}px`;
  };

  const ensurePickerReady = async () => {
    if (grid.dataset.ready === '1') return;
    if (!window.EmojiMart || typeof window.EmojiMart.Picker !== 'function') {
      grid.innerHTML = '<div class="chat-emoji-fallback">Emoji tạm thời không khả dụng.</div>';
      return;
    }

    try {
      const data = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data').then((res) => {
        if (!res.ok) throw new Error('Không tải được dữ liệu emoji');
        return res.json();
      });

      const picker = new window.EmojiMart.Picker({
        data,
        theme: 'light',
        locale: 'vi',
        perLine: 8,
        previewPosition: 'none',
        skinTonePosition: 'none',
        onEmojiSelect: (emoji) => {
          appendEmojiToChatInput(emoji?.native || '');
          panel.style.display = 'none';
        }
      });

      grid.innerHTML = '';
      grid.appendChild(picker);
      grid.dataset.ready = '1';
      if (panel.style.display && panel.style.display !== 'none') {
        requestAnimationFrame(positionEmojiPanel);
      }
    } catch (_) {
      grid.innerHTML = '<div class="chat-emoji-fallback">Không thể tải bộ emoji.</div>';
    }
  };

  if (!state.chat.emojiBound) {
    trigger.addEventListener('click', async () => {
      await ensurePickerReady();
      panel.style.display = panel.style.display === 'none' || !panel.style.display ? 'block' : 'none';
      if (panel.style.display === 'block') {
        requestAnimationFrame(positionEmojiPanel);
      }
    });
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !trigger.contains(e.target)) {
        panel.style.display = 'none';
      }
    });
    window.addEventListener('resize', () => {
      if (panel.style.display === 'none' || !panel.style.display) return;
      positionEmojiPanel();
    });
    state.chat.emojiBound = true;
  }
}

// ─── Voice Recording ───
let _voiceMediaRecorder = null;
let _voiceChunks = [];
let _voiceRecordingTimer = null;
let _voiceRecordingStartTs = 0;
const VOICE_MAX_DURATION_MS = 120000; // 2 minutes max

function isVoiceRecording() {
  return _voiceMediaRecorder && _voiceMediaRecorder.state === 'recording';
}

function updateVoiceRecordingUI(recording) {
  const btn = document.getElementById('btnVoice');
  const timerEl = document.getElementById('voiceRecordTimer');
  const wrap = document.getElementById('cinputWrap');
  if (btn) {
    btn.classList.toggle('recording', recording);
    btn.title = recording ? 'Dừng ghi âm' : 'Ghi âm';
    btn.innerHTML = recording ? '<span class="voice-rec-pulse"></span>⏹️' : '🎤';
  }
  if (timerEl) timerEl.style.display = recording ? 'inline' : 'none';
  if (wrap) wrap.classList.toggle('voice-recording', recording);
}

function updateVoiceTimer() {
  const timerEl = document.getElementById('voiceRecordTimer');
  if (!timerEl || !_voiceRecordingStartTs) return;
  const elapsed = Math.floor((Date.now() - _voiceRecordingStartTs) / 1000);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  timerEl.textContent = `🔴 ${mm}:${ss}`;
}

async function startVoiceRecording() {
  if (!state.chat.sessionCode) {
    showToast('❌ Vui lòng bắt đầu chat trước khi ghi âm');
    return;
  }
  if (state.chat.uploadBusy) return;
  if (isVoiceRecording()) {
    stopVoiceRecording();
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

    _voiceChunks = [];
    _voiceMediaRecorder = new MediaRecorder(stream, { mimeType });

    _voiceMediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) _voiceChunks.push(e.data);
    };

    _voiceMediaRecorder.onstop = async () => {
      clearInterval(_voiceRecordingTimer);
      _voiceRecordingTimer = null;
      stream.getTracks().forEach((t) => t.stop());
      updateVoiceRecordingUI(false);

      if (!_voiceChunks.length) return;
      const blob = new Blob(_voiceChunks, { type: mimeType });
      _voiceChunks = [];
      if (blob.size < 1000) {
        showToast('ℹ️ Ghi âm quá ngắn, vui lòng thử lại');
        return;
      }

      const ext = mimeType.includes('webm') ? 'webm' : 'ogg';
      const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: mimeType });
      try {
        await uploadAndSendChatAttachment(file, 'audio');
      } catch (err) {
        showToast(`❌ ${err.message || 'Không thể gửi ghi âm'}`);
      }
    };

    _voiceMediaRecorder.onerror = () => {
      clearInterval(_voiceRecordingTimer);
      _voiceRecordingTimer = null;
      stream.getTracks().forEach((t) => t.stop());
      updateVoiceRecordingUI(false);
      showToast('❌ Lỗi ghi âm');
    };

    _voiceMediaRecorder.start(250);
    _voiceRecordingStartTs = Date.now();
    updateVoiceRecordingUI(true);
    _voiceRecordingTimer = setInterval(updateVoiceTimer, 500);

    // Auto-stop after max duration
    setTimeout(() => {
      if (isVoiceRecording()) stopVoiceRecording();
    }, VOICE_MAX_DURATION_MS);
  } catch (err) {
    const msg = String(err?.message || '').toLowerCase();
    if (msg.includes('denied') || msg.includes('permission') || msg.includes('not allowed')) {
      showToast('❌ Vui lòng cho phép quyền truy cập micro trong trình duyệt');
    } else {
      showToast('❌ Không thể bật ghi âm: ' + (err.message || 'Lỗi không xác định'));
    }
  }
}

function stopVoiceRecording() {
  if (_voiceMediaRecorder && _voiceMediaRecorder.state === 'recording') {
    _voiceMediaRecorder.stop();
  }
}

function openChatFilePicker(kind = 'file') {
  if (!state.chat.sessionCode) {
    showToast('❌ Vui lòng bắt đầu chat trước khi gửi ảnh/file');
    return;
  }
  if (state.chat.uploadBusy) return;
  const inputId = kind === 'image' ? 'chatImageInput' : 'chatAttachInput';
  const input = document.getElementById(inputId);
  if (input) input.click();
}

async function handleChatFilePicked(event, forcedType = 'file') {
  const file = event?.target?.files?.[0];
  if (!file) return;
  try {
    await uploadAndSendChatAttachment(file, forcedType);
  } catch (err) {
    showToast(`❌ ${err.message || 'Không thể gửi tệp'}`);
  } finally {
    if (event.target) event.target.value = '';
  }
}

function setChatUploadProgress(percent = null, text = '') {
  const progressEl = document.getElementById('chatUploadProgress');
  if (!progressEl) return;

  if (percent === null) {
    progressEl.style.display = 'none';
    return;
  }

  const pct = Math.max(0, Math.min(100, Number(percent) || 0));
  progressEl.style.display = 'block';
  progressEl.textContent = text || `Đang tải ${pct}%`;
}

function setChatUploadBusy(busy) {
  state.chat.uploadBusy = !!busy;
  if (state._uploadBusySafetyTimer) {
    clearTimeout(state._uploadBusySafetyTimer);
    state._uploadBusySafetyTimer = null;
  }
  if (busy) {
    state._uploadBusySince = Date.now();
    state._uploadBusySafetyTimer = setTimeout(() => {
      if (state.chat.uploadBusy) setChatUploadBusy(false);
    }, 45000);
  } else {
    state._uploadBusySince = 0;
  }
  const sendBtn = document.querySelector('.c-send');
  const fileBtn = document.querySelector('.c-tool[onclick*="file"]');
  const imageBtn = document.querySelector('.c-tool[onclick*="image"]');
  const input = document.getElementById('cinp');
  if (sendBtn) sendBtn.disabled = busy;
  if (fileBtn) fileBtn.disabled = busy;
  if (imageBtn) imageBtn.disabled = busy;
  if (input) input.disabled = busy;
  updateChatComposerState(input || document.getElementById('cinp'));
}

function setChatSendBusy(busy) {
  state.chat.sendBusy = !!busy;
  state.chat.sendBusySince = busy ? Date.now() : 0;
  updateChatComposerState(document.getElementById('cinp'));
}

function uploadFileWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_code', state.chat.sessionCode || '');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/chat/upload', true);

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      const percent = Math.round((evt.loaded / evt.total) * 100);
      if (typeof onProgress === 'function') onProgress(percent);
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300 && data.success) {
          resolve(data);
          return;
        }
        reject(new Error(data.message || 'Upload thất bại'));
      } catch (_) {
        reject(new Error('Phản hồi upload không hợp lệ'));
      }
    };

    xhr.onerror = () => reject(new Error('Lỗi mạng khi tải tệp'));
    xhr.timeout = 30000;
    xhr.ontimeout = () => reject(new Error('Tải tệp quá lâu, vui lòng thử lại'));
    xhr.send(formData);
  });
}

async function uploadAndSendChatAttachment(file, forcedType = 'file') {
  if (!state.chat.sessionCode) {
    throw new Error('Vui lòng bắt đầu chat trước');
  }
  if (!file) return;
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('Tệp vượt quá 20MB');
  }

  const isImage = forcedType === 'image' || String(file.type || '').startsWith('image/');
  const isAudio = forcedType === 'audio' || String(file.type || '').startsWith('audio/');
  const label = isAudio ? `🎤 Tin nhắn thoại` : isImage ? `🖼️ ${file.name}` : `📎 ${file.name}`;
  const messageType = isImage ? 'image' : 'file';

  setChatUploadBusy(true);
  setChatUploadProgress(0, 'Đang tải 0%');

  try {
    const uploadRs = await uploadFileWithProgress(file, (percent) => {
      setChatUploadProgress(percent, `Đang tải ${percent}%`);
    });

    const attachmentUrl = uploadRs?.data?.url;
    if (!attachmentUrl) throw new Error('Không nhận được URL tệp');

    const senderName = (document.getElementById('chatCustomerName')?.value || 'Khách hàng').trim() || 'Khách hàng';
    const senderPhone = String(document.getElementById('chatCustomerPhone')?.value || '').replace(/\D/g, '');
    const rs = await apiJson('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({
        session_code: state.chat.sessionCode,
        sender_type: 'customer',
        sender_name: senderName,
        customer_name: senderName,
        customer_phone: senderPhone,
        message: label,
        message_type: messageType,
        attachment_url: attachmentUrl,
        attachment_type: file.type || null
      })
    });

    setChatUploadProgress(100, 'Đã tải xong 100%');
    const sentMessage = rs?.data;
    if (sentMessage && appendChatMessage(sentMessage)) {
      if (!document.hidden || isChatPanelOpen()) {
        scheduleChatRender({ fresh: true });
      }
    }
    showToast(isAudio ? '🎤 Đã gửi tin nhắn thoại' : isImage ? '🖼️ Đã gửi ảnh' : '📎 Đã gửi tệp');
  } finally {
    setTimeout(() => setChatUploadProgress(null), 500);
    setChatUploadBusy(false);
  }
}

function initChatDragDrop() {
  if (state.chat.dragDropBound) return;
  const panel = document.getElementById('cpanel');
  const dropZone = document.getElementById('cmsgs');
  if (!panel || !dropZone) return;

  const stopEvt = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  ['dragenter', 'dragover'].forEach((evtName) => {
    dropZone.addEventListener(evtName, (evt) => {
      stopEvt(evt);
      if (!state.chat.sessionCode || state.chat.uploadBusy) return;
      panel.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach((evtName) => {
    dropZone.addEventListener(evtName, (evt) => {
      stopEvt(evt);
      panel.classList.remove('drag-over');
    });
  });

  dropZone.addEventListener('drop', async (evt) => {
    const file = evt.dataTransfer?.files?.[0];
    if (!file) return;
    if (!state.chat.sessionCode) {
      showToast('❌ Vui lòng bắt đầu chat trước khi kéo-thả tệp');
      return;
    }
    const forcedType = String(file.type || '').startsWith('image/') ? 'image' : 'file';
    try {
      await uploadAndSendChatAttachment(file, forcedType);
    } catch (err) {
      showToast(`❌ ${err.message || 'Không thể gửi tệp'}`);
    }
  });

  state.chat.dragDropBound = true;
}

async function qChat(t) {
  try {
    await enqueueCustomerMessage(t, { restoreDraftOnError: false, focusInputOnDone: true, timeoutMs: 20000 });
  } catch (err) {
    showToast(`❌ ${err.message}`);
  }
}

async function sendC() {
  const i = document.getElementById('cinp');
  if (!i) return;
  if (state.chat.sendBusy || state.chat.uploadBusy) return;
  const v = i.value.trim();
  if (!v) return;
  i.value = '';
  autoResizeCustomerChatInput(i);
  updateChatComposerState(i);
  try {
    await enqueueCustomerMessage(v, { restoreDraftOnError: true, focusInputOnDone: true, timeoutMs: 20000 });
  } catch (err) {
    showToast(`❌ ${err.message}`);
  } finally {
    updateChatComposerState(i);
    i.focus();
  }
}

// Open chat panel pre-filled with prize info for customer care request
async function openChatWithPrizeInfo(boxNumber) {
  const box = state.boxes[boxNumber] || {};
  const decision = String(box.decision || '').toLowerCase();
  const isUnluckyBox = box.state === 'opened-bad' || String(box.level || '').toUpperCase() === 'UNLUCKY';
  if (isUnluckyBox || decision === 'converted' || decision === 'declined') {
    showToast('ℹ️ Trạng thái phần thưởng hiện tại không hỗ trợ gửi yêu cầu CSKH.');
    return;
  }

  const sessionCode = state.sessionCode || 'N/A';
  const prizeName = box.name || 'Phần thưởng';
  const prizeIcon = box.icon || '🎁';
  const prizeValue = Number(box.value || 0);
  const isCash = !!(box.isCash && prizeValue > 0);

  // Store prize info so it auto-sends after chat starts
  state.chat.pendingPrizeInfo = {
    boxNumber,
    sessionCode,
    prizeName,
    prizeIcon,
    prizeValue,
    isCash
  };

  // Open chat panel
  const panel = document.getElementById('cpanel');
  if (panel && !panel.classList.contains('open')) {
    panel.classList.add('open');
    initCustomerChatUI();
  }

  // If chat is already started, send the prize info immediately
  if (state.chat.sessionCode) {
    await sendPrizeInfoMessage();
  }
  // Otherwise, it will be sent after startCustomerChat() completes
}

async function sendPrizeInfoMessage() {
  const info = state.chat.pendingPrizeInfo;
  if (!info || !state.chat.sessionCode) return;
  state.chat.pendingPrizeInfo = null;

  const lines = [
    `🎁 YÊU CẦU NHẬN THƯỞNG`,
    ``,
    `🎮  Mã phiên:  ${info.sessionCode}`,
    `📦  Hộp quà:   #${info.boxNumber}`,
    `${info.prizeIcon}  Giải thưởng: ${info.prizeName}`,
    info.isCash ? `💰  Giá trị:   ${formatCurrency(info.prizeValue, state.sessionCurrency)}` : '',
    ``,
    `Vui lòng hỗ trợ tôi nhận phần thưởng này. Xin cảm ơn!`
  ].filter(l => l !== false && l !== null && l !== undefined).join('\n');

  try {
    await enqueueCustomerMessage(lines, { restoreDraftOnError: false, focusInputOnDone: false, timeoutMs: 22000 });
  } catch (err) {
    showToast(`❌ ${err.message}`);
  }
}

async function initCustomerChatUI() {
  migrateLegacyChatStorage();
  ensureCustomerChatInteractiveBindings();

  if (isMobileLiteEffects()) {
    state.chat.maxDomMessages = 220;
    state.chat.virtualizationThreshold = 42;
    state.chat.virtualWindowSize = 32;
    state.chat.virtualOverscan = 8;
    state.chat.virtualRowEstimate = 76;
    state.chat.messagesFetchMinIntervalMs = 2600;
    state.chat.pollingInterval = 1200;
  }

  if (!state.chat.initialized) {
    const savedProfile = (() => {
      try {
        return JSON.parse(localStorage.getItem(getChatProfileStorageKey()) || '{}');
      } catch (_) {
        return {};
      }
    })();
    const fallback = loadSessionProfile('withdrawProfile', {});
    const nameInput = document.getElementById('chatCustomerName');
    const phoneInput = document.getElementById('chatCustomerPhone');
    const sessionCodeInput = document.getElementById('chatGameSessionCode');
    if (nameInput && !nameInput.value) nameInput.value = savedProfile.customerName || fallback.customerName || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = savedProfile.customerPhone || fallback.customerPhone || '';
    if (sessionCodeInput && !sessionCodeInput.value) sessionCodeInput.value = savedProfile.gameSessionCode || (state.sessionCode || '').toUpperCase();
    state.chat.profileCompleted = hasValidSavedChatProfile(savedProfile);
    state.chat.initialized = true;
  }

  if (!state.chat.sessionCode) {
    state.chat.sessionCode = localStorage.getItem(getChatSessionStorageKey()) || '';
  }

  if (!state.chat.sessionCode) {
    // Keep pre-chat form visible and wait for explicit customer submit.
    setChatReadyUI(false);
    scheduleChatRender();
    return;
  }

  if (state.chat.sessionCode) {
    state.chat.lastSeenAt = Number(localStorage.getItem(getChatSeenStorageKey()) || '0') || 0;
    state.chat.lastUnreadCount = Number(localStorage.getItem(getChatUnreadStorageKey()) || '0') || 0;
  }

  initChatDragDrop();
  initChatEmojiPicker();
  ensureChatMessageActionBindings();
  ensureChatVirtualScrollBinding();
  const cinpEl = document.getElementById('cinp');
  bindCustomerChatComposer(cinpEl);

  if (!state.chat.composerRecoveryBound) {
    const recoverComposer = () => {
      const input = document.getElementById('cinp');
      if (!input) return;
      autoResizeCustomerChatInput(input);
      updateChatComposerState(input);
    };

    window.addEventListener('pageshow', recoverComposer, { passive: true });
    window.addEventListener('focus', recoverComposer, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) recoverComposer();
    });
    state.chat.composerRecoveryBound = true;
  }

  if (!state.chat.sessionCode || !isChatProfileComplete()) {
    setChatReadyUI(false);
    scheduleChatRender();
    return;
  }

  setChatReadyUI(true);
  try {
    await fetchChatMessages();
  } catch (_) {
    setChatReadyUI(false);
    state.chat.sessionCode = '';
    localStorage.removeItem(getChatSessionStorageKey());
    localStorage.removeItem(getChatUnreadStorageKey());
  }
  startChatSSE();
}

async function checkExistingWithdrawal() {
  if (!state.sessionCode) return;
  state.existingWithdrawalId = null;
  state.isUpdatingWithdrawal = false;

  try {
    const result = await apiJson(`/api/withdrawals/session/${encodeURIComponent(state.sessionCode)}`);
    const rows = Array.isArray(result.data) ? result.data : [];
    state.withdrawalHistoryRows = rows;
    state.withdrawalHistorySessionCode = String(state.sessionCode || '').trim().toUpperCase();
    handleWithdrawalDecisionToasts(rows);
    if (!rows.length) return [];

    const sorted = [...rows].sort((a, b) => {
      const ta = new Date(a.requested_at || a.created_at || a.createdAt || 0).getTime();
      const tb = new Date(b.requested_at || b.created_at || b.createdAt || 0).getTime();
      return tb - ta;
    });
    const latest = sorted[0];
    if (!latest) return sorted;

    // Always create new withdrawal requests; history is used for prefill only.
    state.existingWithdrawalId = null;
    state.isUpdatingWithdrawal = false;

    // Store bank name for later matching after VietQR banks load
    if (latest.bank_name) state.existingWithdrawalBankName = latest.bank_name;
    const mappings = [
      ['withName', latest.customer_name],
      ['withPhone', latest.customer_phone],
      ['withEmail', latest.customer_email],
      ['withAccNo', latest.account_number],
      ['withAccName', latest.account_holder],
      ['withAmount', latest.amount]
    ];
    mappings.forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === 'withAmount') {
        if (!el.value && Number(value) > 0) el.value = formatMoneyComma(value);
        return;
      }
      if (!el.value && value) el.value = String(value);
    });
    return sorted;
  } catch (_) {
    // Keep modal usable even if history endpoint fails.
    state.withdrawalHistoryRows = [];
    state.withdrawalHistorySessionCode = String(state.sessionCode || '').trim().toUpperCase();
    return [];
  }
}

function switchWithTab(tab) {
  state.withdrawModalTab = 'create';

  const historyBtn = document.getElementById('withTabHistory');
  const createBtn = document.getElementById('withTabCreate');
  if (historyBtn) historyBtn.classList.remove('active');
  if (createBtn) createBtn.classList.remove('active');

  const historyPanel = document.getElementById('withPanelHistory');
  const createPanel = document.getElementById('withPanelCreate');
  if (historyPanel) historyPanel.style.display = '';
  if (createPanel) createPanel.style.display = '';

  const trustWrap = document.getElementById('withTrustWrap');
  if (trustWrap) trustWrap.style.display = '';
}

function fillWithdrawAmountPercent(percent) {
  const p = Number(percent) || 0;
  const amountInput = document.getElementById('withAmount');
  if (!amountInput) return;
  const amount = Math.floor((Math.max(0, Number(state.wallet.remaining || 0)) * p) / 100);
  amountInput.value = formatMoneyComma(amount);
}

function getWithdrawalStatusText(status) {
  const st = String(status || '').toLowerCase();
  if (st === 'approved') return 'Đã duyệt';
  if (st === 'rejected') return 'Từ chối';
  return 'Chờ xử lý';
}

function getCleanRejectionReason(row) {
  const raw = String(row?.rejection_reason || row?.rejectionReason || row?.reason || '').trim();
  if (!raw) return '';
  const lowered = raw.toLowerCase();
  const looksLikeRequestNote = /^\[wd-[^\]]+\]/i.test(raw)
    || (lowered.includes('liên hệ cskh') && lowered.includes('mã rút tiền'));
  if (looksLikeRequestNote) return '';
  return raw;
}

function getWithdrawalStatusNoteMeta(row, status) {
  const requestCode = getWithdrawalSupportRef(row);
  const snapshot = (row?.box_selection_snapshot && typeof row.box_selection_snapshot === 'object')
    ? row.box_selection_snapshot
    : {};
  const supportHint = String(snapshot.support_hint || '').trim();

  if (status === 'rejected') {
    const rejectionReason = getCleanRejectionReason(row);
    return {
      className: 'rejected',
      label: 'Ghi chú từ chối',
      text: rejectionReason || DEFAULT_WITHDRAW_REJECT_REASON
    };
  }

  if (status === 'approved') {
    const codeText = requestCode ? `Mã ${requestCode}. ` : '';
    return {
      className: 'approved',
      label: 'Ghi chú duyệt',
      text: `${codeText}Yêu cầu rút tiền đã được duyệt và xử lý thành công.`.trim()
    };
  }

  const hintText = supportHint || 'Yêu cầu đang chờ CSKH kiểm tra và duyệt.';
  const pendingText = requestCode ? `Mã ${requestCode}. ${hintText}` : hintText;
  return {
    className: 'pending',
    label: 'Ghi chú chờ duyệt',
    text: pendingText
  };
}

function renderWithdrawalHistory() {
  const list = document.getElementById('withHistoryList');
  if (!list) return;
  const rows = Array.isArray(state.withdrawalHistoryRows) ? [...state.withdrawalHistoryRows] : [];
  rows.sort((a, b) => {
    const ta = new Date(a.requested_at || a.created_at || a.createdAt || 0).getTime();
    const tb = new Date(b.requested_at || b.created_at || b.createdAt || 0).getTime();
    return tb - ta;
  });

  if (!rows.length) {
    list.className = 'with-history-empty';
    list.textContent = contentTextGlobal('withHistoryEmpty', 'Chưa có lệnh rút tiền nào');
    return;
  }

  list.className = 'with-history-list';
  list.innerHTML = rows.map((row, index) => {
    const amount = Number(row.amount || 0).toLocaleString('vi-VN');
    const dateText = formatDateTime(row.requested_at || row.created_at || row.createdAt || '');
    const status = String(row.status || 'pending').toLowerCase();
    const bankName = esc(row.bank_name || 'Chưa có ngân hàng');
    const accountNumber = esc(row.account_number || 'Chưa có số tài khoản');
    const accountHolder = esc(row.account_holder || 'Chưa có chủ tài khoản');
    const requestCode = getWithdrawalSupportRef(row);
    const noteMeta = getWithdrawalStatusNoteMeta(row, status);
    const noteHtml = noteMeta
      ? `<div class="with-history-note ${noteMeta.className}"><span class="with-history-note-label">${esc(noteMeta.label)}:</span> <span class="with-history-note-text">${esc(noteMeta.text)}</span></div>`
      : '';
    const remainingMs = requestCode ? getWithdrawalSupportRemainingMs(requestCode) : 0;
    const disabled = !requestCode || remainingMs > 0;
    const coolMinutes = Math.floor(remainingMs / 60000);
    const coolSeconds = Math.floor((remainingMs % 60000) / 1000);
    const supportLabel = remainingMs > 0
      ? `Đợi ${coolMinutes}:${String(coolSeconds).padStart(2, '0')}`
      : 'Gửi CSKH';
    const supportTitle = !requestCode
      ? 'Không có mã lệnh rút tiền để gửi CSKH'
      : (remainingMs > 0 ? 'Yêu cầu này chỉ được gửi 5 phút 1 lần' : 'Gửi yêu cầu nhanh cho CSKH theo lệnh này');
    return `<div class="with-history-item"><div class="with-history-main"><div class="with-history-amount">${amount} VNĐ</div><div class="with-history-account">${bankName} • STK ${accountNumber}</div><div class="with-history-account-holder">${accountHolder}</div><div class="with-history-meta">${dateText}</div>${noteHtml}</div><div class="with-history-side"><div class="with-history-status ${status}">${getWithdrawalStatusText(status)}</div><button type="button" class="with-history-support-btn" onclick="quickSupportWithdrawByIndex(${index})" ${disabled ? 'disabled' : ''} title="${esc(supportTitle)}">${supportLabel}</button></div></div>`;
  }).join('');
}

async function openWith() {
  await ensureWalletModuleReady();
  if (!validateSession()) return;
  if (!state.sessionCode) {
    showToast('❌ Vui lòng vào phiên trước');
    return;
  }

  await refreshWallet();

  const withdrawProfile = loadSessionProfile('withdrawProfile', {});
  const prefillMappings = [
    ['withName', withdrawProfile.customerName],
    ['withPhone', withdrawProfile.customerPhone],
    ['withEmail', withdrawProfile.customerEmail],
    ['withAccNo', withdrawProfile.accountNumber],
    ['withAccName', withdrawProfile.accountHolder],
    ['withAmount', withdrawProfile.amount]
  ];
  prefillMappings.forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (!el || el.value) return;
    if (id === 'withAmount') {
      if (Number(value) > 0) {
        el.value = formatMoneyComma(value);
      }
      return;
    }
    if (value) el.value = String(value);
  });

  const amountInput = document.getElementById('withAmount');
  if (amountInput) {
    bindMoneyCommaInput(amountInput);
    if (!amountInput.value) {
      amountInput.value = formatMoneyComma(state.wallet.remaining);
    }
  }

  // Prefill hidden contact fields from session if available (required by backend)
  try {
    const sessionRs = await apiJson(`/api/lucky-mystery-box/session?code=${encodeURIComponent(state.sessionCode)}`);
    const s = sessionRs?.data || {};
    const playerDefaults = [
      ['withName', s.player_name],
      ['withPhone', s.player_phone],
      ['withEmail', s.player_email]
    ];
    playerDefaults.forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el && !el.value && val) el.value = String(val);
    });
  } catch (_) { }

  await checkExistingWithdrawal();
  renderWithdrawalHistory();

  const withModalTitle = document.getElementById('withModalTitle');
  const withSubmitBtn = document.getElementById('withSubmitBtn');
  if (withModalTitle) withModalTitle.innerHTML = `Quản lý rút tiền - <span id="withSessionCode">${state.sessionCode || '-'}</span>`;
  if (withSubmitBtn) withSubmitBtn.textContent = contentTextGlobal('withSubmitCreateButton', 'Tạo lệnh rút tiền');

  const withAmt = document.getElementById('withAmt');
  if (withAmt) withAmt.textContent = Math.max(0, state.wallet.remaining).toLocaleString('vi-VN');
  const trustScoreEl = document.getElementById('withTrustScore');
  if (trustScoreEl) trustScoreEl.textContent = String(state.wallet.trustScore || 100);
  const trustAlert = document.getElementById('withTrustBlockAlert');
  if (trustAlert) {
    if (state.wallet.canWithdrawByTrust) {
      trustAlert.style.display = 'none';
      trustAlert.textContent = '';
    } else {
      trustAlert.style.display = '';
      trustAlert.textContent = state.wallet.trustBlockedMessage || 'Điểm tín nhiệm chưa đủ điều kiện để rút tiền.';
    }
  }
  if (withSubmitBtn) {
    const hasBalance = Number(state.wallet.remaining || 0) > 0;
    const canSubmit = state.wallet.canWithdrawByTrust && hasBalance;
    withSubmitBtn.disabled = !canSubmit;
    if (!state.wallet.canWithdrawByTrust) {
      withSubmitBtn.title = state.wallet.trustBlockedMessage || 'Điểm tín nhiệm chưa đủ để rút tiền';
    } else if (!hasBalance) {
      withSubmitBtn.title = 'Số dư ví đang bằng 0, chưa thể rút tiền';
    } else {
      withSubmitBtn.title = '';
    }
  }

  clearFieldErrors(['withName', 'withPhone', 'withEmail', 'withBank', 'withAccNo', 'withAccName', 'withAmount']);
  const modal = document.getElementById('modalOv');
  if (modal) modal.classList.add('open');
  switchWithTab('history');
  pushPageHistoryState('withdraw');

  // Load VietQR bank list and setup QR auto-update
  await loadVietQRBanks();
  const bankSel = document.getElementById('withBank');
  if (bankSel) {
    const savedBank = withdrawProfile.bankName || withdrawProfile.bankBin || state.existingWithdrawalBankName || '';
    if (savedBank) {
      const opts = Array.from(bankSel.options);
      const match = opts.find(o => o.value === savedBank || o.dataset.shortName === savedBank || (o.textContent && o.textContent.includes(savedBank)));
      if (match) bankSel.value = match.value;
    }
  }
}

function closeWith() {
  if (state.isSubmittingWithdrawal) {
    showToast('⏳ Đang gửi yêu cầu rút tiền, vui lòng chờ hoàn tất...');
    return;
  }

  const modal = document.getElementById('modalOv');
  if (modal) modal.classList.remove('open');
  stopWithdrawSubmitPendingState();
  const withSubmitBtn = document.getElementById('withSubmitBtn');
  if (withSubmitBtn) {
    withSubmitBtn.disabled = false;
    withSubmitBtn.title = '';
  }
  switchWithTab('history');
  clearFieldErrors(['withName', 'withPhone', 'withEmail', 'withBank', 'withAccNo', 'withAccName', 'withAmount']);
}

function togCk() {
  state.ckOn = !state.ckOn;
  const e = document.getElementById('ck');
  if (!e) return;
  e.classList.toggle('on', state.ckOn);
  e.innerHTML = state.ckOn
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
    : '';
}

function renderWithdrawSubmitPendingState(remainingSeconds) {
  const withSubmitBtn = document.getElementById('withSubmitBtn');
  if (!withSubmitBtn) return;
  const remaining = Math.max(1, Math.min(5, Number(remainingSeconds) || 1));
  withSubmitBtn.classList.add('with-submit-pending');
  withSubmitBtn.setAttribute('aria-busy', 'true');
  withSubmitBtn.disabled = true;
  withSubmitBtn.title = 'Đang gửi yêu cầu rút tiền';
  withSubmitBtn.innerHTML = `<span class="with-submit-check" aria-hidden="true">✓</span><span class="with-submit-label">Đang gửi yêu cầu rút tiền ${remaining}<span class="with-submit-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></span>`;
}

function startWithdrawSubmitPendingState() {
  state.isSubmittingWithdrawal = true;
  state.withdrawSubmitPendingStartedAt = Date.now();
  if (state.withdrawSubmitPendingTimer) {
    clearInterval(state.withdrawSubmitPendingTimer);
    state.withdrawSubmitPendingTimer = null;
  }

  renderWithdrawSubmitPendingState(5);
  state.withdrawSubmitPendingTimer = window.setInterval(() => {
    if (!state.isSubmittingWithdrawal) return;
    const elapsedMs = Date.now() - Number(state.withdrawSubmitPendingStartedAt || 0);
    const remaining = Math.max(1, 5 - Math.floor(elapsedMs / 1000));
    renderWithdrawSubmitPendingState(remaining);
  }, 220);
}

function stopWithdrawSubmitPendingState() {
  state.isSubmittingWithdrawal = false;
  state.withdrawSubmitPendingStartedAt = 0;
  if (state.withdrawSubmitPendingTimer) {
    clearInterval(state.withdrawSubmitPendingTimer);
    state.withdrawSubmitPendingTimer = null;
  }

  const withSubmitBtn = document.getElementById('withSubmitBtn');
  if (!withSubmitBtn) return;
  withSubmitBtn.classList.remove('with-submit-pending');
  withSubmitBtn.removeAttribute('aria-busy');
  withSubmitBtn.innerHTML = contentTextGlobal('withSubmitCreateButton', 'Tạo lệnh rút tiền');
}

async function waitWithdrawSubmitPendingCompletion() {
  const pendingDurationMs = 5000;
  const startedAt = Number(state.withdrawSubmitPendingStartedAt || 0);
  if (!startedAt) return;
  const elapsed = Date.now() - startedAt;
  const remain = Math.max(0, pendingDurationMs - elapsed);
  if (remain <= 0) return;
  await new Promise((resolve) => window.setTimeout(resolve, remain));
}

async function submitWith() {
  if (!state.sessionCode) {
    showToast('❌ Phiên không hợp lệ');
    return;
  }

  if (state.isSubmittingWithdrawal) {
    return;
  }

  const nameEl = document.getElementById('withName');
  const phoneEl = document.getElementById('withPhone');
  const emailEl = document.getElementById('withEmail');
  const backupProfile = loadSessionProfile('withdrawProfile', {});
  const fallbackName = backupProfile.customerName || `Khách hàng ${state.sessionCode || ''}`.trim();
  const fallbackPhone = backupProfile.customerPhone || '0900000000';
  const fallbackEmail = backupProfile.customerEmail || `${String(state.sessionCode || 'guest').toLowerCase()}@giftbox.local`;
  if (nameEl && !nameEl.value) nameEl.value = fallbackName;
  if (phoneEl && !phoneEl.value) phoneEl.value = fallbackPhone;
  if (emailEl && !emailEl.value) emailEl.value = fallbackEmail;

  const payload = {
    bankName: getSelectedBankName() || (document.getElementById('withBank')?.value || '').trim(),
    accountNumber: (document.getElementById('withAccNo')?.value || '').trim(),
    accountHolder: (document.getElementById('withAccName')?.value || '').trim(),
    amount: parseMoneyInputValue(document.getElementById('withAmount')?.value || ''),
    customerName: (document.getElementById('withName')?.value || '').trim(),
    customerPhone: (document.getElementById('withPhone')?.value || '').trim(),
    customerEmail: (document.getElementById('withEmail')?.value || '').trim(),
    note: (document.getElementById('withNote')?.value || '').trim()
  };

  // Strict balance re-check before submitting
  await refreshWallet();
  if (!state.wallet.canWithdrawByTrust) {
    const trustBlockMessage = state.wallet.trustBlockedMessage || 'Điểm tín nhiệm chưa đủ để rút tiền.';
    setFieldError('withAmount', trustBlockMessage);
    const trustAlert = document.getElementById('withTrustBlockAlert');
    if (trustAlert) {
      trustAlert.style.display = '';
      trustAlert.textContent = trustBlockMessage;
    }
    showToast(`❌ ${trustBlockMessage}`);
    return;
  }

  if (payload.amount > state.wallet.remaining) {
    setFieldError('withAmount', `Số dư không đủ. Hiện tại chỉ còn ${Math.max(0, state.wallet.remaining).toLocaleString('vi-VN')} đ`);
    const withAmt = document.getElementById('withAmt');
    if (withAmt) withAmt.textContent = Math.max(0, state.wallet.remaining).toLocaleString('vi-VN');
    showToast('❌ Số dư không đủ để rút');
    return;
  }

  clearFieldErrors(['withName', 'withPhone', 'withEmail', 'withBank', 'withAccNo', 'withAccName', 'withAmount']);
  let hasError = false;
  if (!payload.customerName) { setFieldError('withName', 'Vui lòng nhập họ và tên.'); hasError = true; }
  if (!payload.customerPhone) { setFieldError('withPhone', 'Vui lòng nhập số điện thoại.'); hasError = true; }
  else if (!/^\d{10,11}$/.test(payload.customerPhone)) { setFieldError('withPhone', 'Số điện thoại phải gồm 10-11 chữ số.'); hasError = true; }
  if (!payload.customerEmail) { setFieldError('withEmail', 'Vui lòng nhập email.'); hasError = true; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.customerEmail)) { setFieldError('withEmail', 'Email không hợp lệ.'); hasError = true; }
  if (!payload.bankName) { setFieldError('withBank', 'Vui lòng nhập ngân hàng.'); hasError = true; }
  if (!payload.accountNumber) { setFieldError('withAccNo', 'Vui lòng nhập số tài khoản.'); hasError = true; }
  if (!payload.accountHolder) { setFieldError('withAccName', 'Vui lòng nhập tên chủ tài khoản.'); hasError = true; }
  if (!payload.amount) { setFieldError('withAmount', 'Vui lòng nhập số tiền rút.'); hasError = true; }
  else if (payload.amount < 10000) { setFieldError('withAmount', 'Số tiền tối thiểu là 10.000 đ.'); hasError = true; }
  else if (payload.amount > state.wallet.remaining) {
    setFieldError('withAmount', `Số dư không đủ. Tối đa ${Math.max(0, state.wallet.remaining).toLocaleString('vi-VN')} đ`);
    hasError = true;
  }

  if (hasError) {
    showToast('❌ Vui lòng kiểm tra lại thông tin rút tiền');
    return;
  }

  try {
    let withdrawalResponse = null;
    startWithdrawSubmitPendingState();
    await withLoadingOverlay('Đang gửi yêu cầu rút tiền...', async () => {
      withdrawalResponse = await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/withdraw`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    });

    const createdWithdrawalId = String(withdrawalResponse?.data?.id || '').trim();
    if (createdWithdrawalId) {
      trackPendingWithdrawalDecision(createdWithdrawalId);
    }

    await waitWithdrawSubmitPendingCompletion();
    stopWithdrawSubmitPendingState();

    saveSessionProfile('withdrawProfile', { ...payload, bankBin: getSelectedBankBin() });
    closeWith();
    await Promise.all([refreshWallet(), refreshTransactions()]);
    showToast('✅ Yêu cầu rút tiền đã được gửi!');
    showThankYouPage({
      title: 'Yêu cầu rút tiền đã ghi nhận',
      subtitle: 'Bộ phận xử lý sẽ duyệt trong thời gian sớm nhất',
      method: 'Rút tiền',
      playerName: payload.customerName,
      playerPhone: payload.customerPhone,
      detail: `${Math.max(0, payload.amount).toLocaleString('vi-VN')} đ về ${payload.bankName}`
    });
    state.existingWithdrawalId = null;
    state.isUpdatingWithdrawal = false;
  } catch (err) {
    showToast(`❌ ${err.message}`);
    stopWithdrawSubmitPendingState();
  } finally {
    if (!state.isSubmittingWithdrawal) return;
    stopWithdrawSubmitPendingState();
  }
}

function getLatestWithdrawalSupportRef() {
  const rows = Array.isArray(state.withdrawalHistoryRows) ? [...state.withdrawalHistoryRows] : [];
  if (!rows.length) return '';
  rows.sort((a, b) => {
    const ta = new Date(a.requested_at || a.created_at || a.createdAt || 0).getTime();
    const tb = new Date(b.requested_at || b.created_at || b.createdAt || 0).getTime();
    return tb - ta;
  });
  const latest = rows[0] || {};
  return String(latest.id || latest.withdrawal_id || latest.request_id || latest.withdrawal_code || latest.request_code || latest.reference_code || latest.ref_code || '').trim();
}

function getWithdrawalSupportRef(row) {
  if (!row || typeof row !== 'object') return '';
  return String(row.id || row.withdrawal_id || row.request_id || row.withdrawal_code || row.request_code || row.reference_code || row.ref_code || '').trim();
}

function getWithdrawalSupportDisplayRef(requestCode) {
  const raw = String(requestCode || '').trim();
  if (!raw) return '';
  const compact = raw
    .replace(/^(ruttien|rut_tien|withdrawal|withdraw|request|req|wd)[_:\-]*/i, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim();
  const base = compact || raw;
  if (base.length <= 12) return base;
  return `${base.slice(0, 4)}...${base.slice(-4)}`;
}

function getWithdrawalSupportLastAtMap() {
  try {
    const raw = localStorage.getItem(CHAT_GLOBAL_KEYS.withdrawalSupportLastAt) || '{}';
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch (_) {
    return {};
  }
}

function saveWithdrawalSupportLastAtMap(map) {
  try {
    const payload = map && typeof map === 'object' ? map : {};
    localStorage.setItem(CHAT_GLOBAL_KEYS.withdrawalSupportLastAt, JSON.stringify(payload));
  } catch (_) {}
}

function buildWithdrawalPendingDecisionStorageKey() {
  const session = String(state.sessionCode || '').trim().toUpperCase();
  if (!session) return '';
  return `${CHAT_GLOBAL_KEYS.withdrawalPendingDecisionIds}:${session}`;
}

function getPendingWithdrawalDecisionIds() {
  const key = buildWithdrawalPendingDecisionStorageKey();
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key) || '[]';
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((id) => String(id || '').trim()).filter(Boolean);
  } catch (_) {
    return [];
  }
}

function savePendingWithdrawalDecisionIds(ids) {
  const key = buildWithdrawalPendingDecisionStorageKey();
  if (!key) return;
  try {
    const list = Array.isArray(ids)
      ? [...new Set(ids.map((id) => String(id || '').trim()).filter(Boolean))]
      : [];
    localStorage.setItem(key, JSON.stringify(list));
  } catch (_) {}
}

function trackPendingWithdrawalDecision(withdrawalId) {
  const id = String(withdrawalId || '').trim();
  if (!id) return;
  const next = getPendingWithdrawalDecisionIds();
  if (!next.includes(id)) next.push(id);
  savePendingWithdrawalDecisionIds(next);
}

function handleWithdrawalDecisionToasts(rows) {
  const pendingIds = getPendingWithdrawalDecisionIds();
  if (!pendingIds.length || !Array.isArray(rows) || !rows.length) return;

  const byId = rows.reduce((acc, row) => {
    const id = String(row?.id || '').trim();
    if (id) acc[id] = row;
    return acc;
  }, {});

  const remain = [];
  pendingIds.forEach((id) => {
    const row = byId[id];
    if (!row) return;
    const status = String(row.status || '').toLowerCase();
    if (status === 'approved') {
      const amount = Number(row.amount || 0);
      const amountText = amount > 0 ? `${amount.toLocaleString('vi-VN')} đ` : 'lệnh rút tiền';
      showToast(`✅ Yêu cầu rút tiền ${amountText} đã được admin duyệt.`);
      return;
    }
    if (status === 'rejected') {
      const reason = getCleanRejectionReason(row) || DEFAULT_WITHDRAW_REJECT_REASON;
      const reasonSuffix = reason ? ` (${reason})` : '';
      showToast(`❌ Yêu cầu rút tiền đã bị admin từ chối${reasonSuffix}`);
      return;
    }
    remain.push(id);
  });

  savePendingWithdrawalDecisionIds(remain);
}

function buildWithdrawalSupportThrottleKey(requestCode) {
  return `${String(state.sessionCode || '').trim()}:${String(requestCode || '').trim()}`;
}

function getWithdrawalSupportRemainingMs(requestCode) {
  const key = buildWithdrawalSupportThrottleKey(requestCode);
  if (!key || key === ':') return 0;
  const store = getWithdrawalSupportLastAtMap();
  const lastAt = Number(store[key] || 0);
  if (!lastAt || Number.isNaN(lastAt)) return 0;
  return Math.max(0, WITHDRAW_SUPPORT_COOLDOWN_MS - (Date.now() - lastAt));
}

function markWithdrawalSupportSent(requestCode) {
  const key = buildWithdrawalSupportThrottleKey(requestCode);
  if (!key || key === ':') return;
  const now = Date.now();
  const store = getWithdrawalSupportLastAtMap();
  const nextStore = {};
  Object.keys(store).forEach((k) => {
    const ts = Number(store[k] || 0);
    if (!ts || Number.isNaN(ts)) return;
    if ((now - ts) <= (24 * 60 * 60 * 1000)) {
      nextStore[k] = ts;
    }
  });
  nextStore[key] = now;
  saveWithdrawalSupportLastAtMap(nextStore);
}

function getWithdrawalByHistoryIndex(index) {
  const rows = Array.isArray(state.withdrawalHistoryRows) ? [...state.withdrawalHistoryRows] : [];
  rows.sort((a, b) => {
    const ta = new Date(a.requested_at || a.created_at || a.createdAt || 0).getTime();
    const tb = new Date(b.requested_at || b.created_at || b.createdAt || 0).getTime();
    return tb - ta;
  });
  return rows[index] || null;
}

function quickSupportWithdrawByIndex(index) {
  const row = getWithdrawalByHistoryIndex(Number(index));
  return quickSupportWithdraw(row);
}

async function quickSupportWithdraw(withdrawalRow) {
  if (!state.sessionCode) {
    showToast('❌ Phiên không hợp lệ');
    return;
  }

  const row = (withdrawalRow && typeof withdrawalRow === 'object') ? withdrawalRow : null;
  const amountInput = parseMoneyInputValue(document.getElementById('withAmount')?.value || '');
  const bankName = row
    ? String(row.bank_name || '').trim()
    : (getSelectedBankName() || (document.getElementById('withBank')?.value || '').trim());
  const accountNumber = row
    ? String(row.account_number || '').trim()
    : String((document.getElementById('withAccNo')?.value || '').trim());
  const accountHolder = row
    ? String(row.account_holder || '').trim()
    : String((document.getElementById('withAccName')?.value || '').trim());
  const requestCode = row ? getWithdrawalSupportRef(row) : getLatestWithdrawalSupportRef();
  if (!requestCode) {
    showToast('❌ Không tìm thấy mã lệnh rút tiền để gửi CSKH');
    return;
  }
  const requestDisplayRef = getWithdrawalSupportDisplayRef(requestCode);

  const remainingMs = getWithdrawalSupportRemainingMs(requestCode);
  if (remainingMs > 0) {
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    showToast(`⏱️ Vui lòng chờ ${minutes}:${String(seconds).padStart(2, '0')} rồi gửi lại yêu cầu cho lệnh ${requestDisplayRef || requestCode}`);
    return;
  }

  const amountValue = row ? Number(row.amount || 0) : amountInput;
  const amountText = amountValue > 0
    ? `${amountValue.toLocaleString('vi-VN')} VNĐ`
    : `${Math.max(0, Number(state.wallet.remaining || 0)).toLocaleString('vi-VN')} VNĐ`;

  const lines = [
    '💳 YÊU CẦU HỖ TRỢ RÚT TIỀN NHANH',
    '',
    `🎮 Mã phiên: ${state.sessionCode || 'N/A'}`,
    `💰 Số tiền: ${amountText}`,
    bankName ? `🏦 Ngân hàng: ${bankName}` : '',
    accountNumber ? `🔢 STK: ${accountNumber}` : '',
    accountHolder ? `👤 Chủ TK: ${accountHolder}` : '',
    requestCode ? `🧾 Mã lệnh rút: ${requestDisplayRef || requestCode}` : '',
    '',
    'Nhờ CSKH ưu tiên kiểm tra và duyệt giúp tôi. Xin cảm ơn!'
  ].filter(Boolean).join('\n');

  try {
    await ensureChatModuleReady();
    const panel = document.getElementById('cpanel');
    if (panel && !panel.classList.contains('open')) {
      panel.classList.add('open');
    }

    await initCustomerChatUI();
    await enqueueCustomerMessage(lines, { restoreDraftOnError: false, focusInputOnDone: false, timeoutMs: 22000 });
    markWithdrawalSupportSent(requestCode);
    showToast('✅ Đã gửi yêu cầu nhanh tới CSKH');
  } catch (err) {
    showToast(`❌ ${err.message || 'Không thể gửi yêu cầu tới CSKH'}`);
  }
}

function showHubTab(tab) {
  state.currentHubTab = tab;
  const tabs = ['inventory', 'exchange', 'wallet', 'search'];
  tabs.forEach((name) => {
    const el = document.getElementById(`hubTab${name.charAt(0).toUpperCase()}${name.slice(1)}`);
    if (el) el.style.display = name === tab ? 'block' : 'none';
  });

  const titles = {
    inventory: contentTextGlobal('hubTabInventoryTitle', 'Kho vật phẩm'),
    exchange: contentTextGlobal('hubTabExchangeTitle', 'Đổi quà / Nhận quà'),
    wallet: contentTextGlobal('hubTabWalletTitle', 'Ví phiên'),
    search: contentTextGlobal('hubTabSearchTitle', 'Tra cứu phiên chơi')
  };
  const titleEl = document.getElementById('hubTitle');
  if (titleEl) titleEl.textContent = titles[tab] || contentTextGlobal('hubTitleDefault', 'Quản lý phiên');
}

async function refreshHubData() {
  if (!state.sessionCode) return;
  await Promise.all([refreshWallet(), loadPlayerInventory(), refreshTransactions()]);
}

async function openHub(tab) {
  const isMobile = !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
  if (!isMobile && (tab === 'search' || tab === 'wallet')) {
    await ensureHistoryModuleReady();
  }
  if (tab === 'wallet' || tab === 'exchange' || tab === 'inventory') {
    await ensureWalletModuleReady();
  }
  if (!validateSession() && tab !== 'search') return;
  if (!state.sessionCode && tab !== 'search') {
    showToast('❌ Vui lòng nhập mã phiên trước');
    return;
  }

  showHubTab(tab);
  const hub = document.getElementById('hubOv');
  if (hub) hub.classList.add('open');
  window.dispatchEvent(new CustomEvent('lmb:open-hub', { detail: { tab: String(tab || '').toLowerCase() } }));
  pushPageHistoryState(`hub:${tab}`);

  if (state.sessionCode && tab !== 'search') {
    try {
      await refreshHubData();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  }

  if (tab === 'wallet') {
    renderWalletUnifiedHistory();
  }
}

function closeHub() {
  const hub = document.getElementById('hubOv');
  if (hub) hub.classList.remove('open');

  // Mobile DOM pressure guard: drop heavy list markup when hub closes.
  if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
    const inventoryList = document.getElementById('inventoryList');
    const exchangeList = document.getElementById('exchangeList');
    if (inventoryList) inventoryList.innerHTML = '';
    if (exchangeList) exchangeList.innerHTML = '';
  }
}

function openClaimModal(boxNumber) {
  state.activeClaimBox = Number(boxNumber);
  const item = state.inventoryItems.find((x) => Number(x.box_number || x.boxNumber) === Number(boxNumber));
  const itemName = item?.prize_name || 'Phần thưởng';
  const label = document.getElementById('claimItemLabel');
  if (label) label.textContent = `Phần quà hộp #${boxNumber}: ${itemName || 'Phần thưởng'}`;

  const claimProfile = loadSessionProfile('claimProfile', {});
  const mappings = [
    ['claimName', claimProfile.name],
    ['claimPhone', claimProfile.phone],
    ['claimEmail', claimProfile.email],
    ['claimAddress', claimProfile.address],
    ['claimCity', claimProfile.city],
    ['claimNote', claimProfile.note]
  ];
  mappings.forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el && !el.value && value) el.value = String(value);
  });

  clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
  const modal = document.getElementById('claimOv');
  if (modal) modal.classList.add('open');
  pushPageHistoryState('claim');
}

function closeClaimModal() {
  const modal = document.getElementById('claimOv');
  if (modal) modal.classList.remove('open');
  clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
}

async function confirmClaim() {
  if (!state.sessionCode || !state.activeClaimBox) {
    showToast('❌ Phiên hoặc hộp quà không hợp lệ');
    return;
  }

  const payload = {
    name: (document.getElementById('claimName')?.value || '').trim(),
    phone: (document.getElementById('claimPhone')?.value || '').trim(),
    email: (document.getElementById('claimEmail')?.value || '').trim(),
    address: (document.getElementById('claimAddress')?.value || '').trim(),
    city: (document.getElementById('claimCity')?.value || '').trim(),
    note: (document.getElementById('claimNote')?.value || '').trim(),
    boxNumber: state.activeClaimBox
  };

  clearFieldErrors(['claimName', 'claimPhone', 'claimEmail', 'claimAddress', 'claimCity']);
  let hasError = false;
  if (!payload.name) { setFieldError('claimName', 'Vui lòng nhập họ tên.'); hasError = true; }
  if (!payload.phone) { setFieldError('claimPhone', 'Vui lòng nhập số điện thoại.'); hasError = true; }
  else if (!/^\d{10,11}$/.test(payload.phone)) { setFieldError('claimPhone', 'Số điện thoại phải gồm 10-11 chữ số.'); hasError = true; }
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    setFieldError('claimEmail', 'Email không hợp lệ.');
    hasError = true;
  }
  if (!payload.address) { setFieldError('claimAddress', 'Vui lòng nhập địa chỉ giao hàng.'); hasError = true; }
  if (!payload.city) { setFieldError('claimCity', 'Vui lòng nhập tỉnh/thành phố.'); hasError = true; }

  if (hasError) {
    showToast('⚠️ Vui lòng kiểm tra lại thông tin nhận quà');
    return;
  }

  try {
    await withLoadingOverlay('Đang gửi thông tin nhận quà...', async () => apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/claim`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }));
    saveSessionProfile('claimProfile', payload);
    closeClaimModal();
    await refreshHubData();
    activateNextBox();
    renderBoxes();
    showToast('✅ Đã gửi thông tin nhận quà, đang chờ admin duyệt...');
    showApprovalWaitScreen(state.currentPrize);
  } catch (err) {
    showToast(`❌ ${err.message}`);
  }
}

async function convertPrize(boxNumber, options = {}) {
  if (!validateSession()) return;
  if (!state.sessionCode) {
    showToast('❌ Phiên không hợp lệ');
    return;
  }

  try {
    const result = await apiJson(`/api/lucky-mystery-box/${encodeURIComponent(state.sessionCode)}/convert`, {
      method: 'POST',
      body: JSON.stringify({ boxNumber, instant: true })
    });

    const safeBox = Number(boxNumber || 0);
    const box = state.boxes?.[safeBox] || null;
    if (box) {
      if (result?.pendingApproval) {
        box.decision = 'exchanged';
        box.status = 'exchanged';
        box.processingStatus = 'exchanged';
      } else {
        box.decision = 'converted';
        box.status = 'converted';
        box.processingStatus = 'converted';
      }
    }

    await Promise.all([refreshHubData(), refreshBoxesFromServer()]);

    if (!result?.pendingApproval) {
      activateNextBox();
    }

    if (!options.fromWin) {
      if (result?.pendingApproval) {
        showToast(`⏳ Yêu cầu quy đổi ${result.currency || ''} đã gửi cho CSKH. Vui lòng liên hệ CSKH!`);
      } else {
        showToast(`✅ Đã quy đổi thành công cho hộp #${boxNumber}`);
      }
    }
  } catch (err) {
    showToast(`❌ ${err.message}`);
    throw err;
  }
}

async function searchSession() {
  const input = document.getElementById('searchInput');
  const resultEl = document.getElementById('searchResult');
  const code = (input?.value || '').trim().toUpperCase();
  if (!code) {
    showToast('Vui lòng nhập mã phiên để tra cứu');
    return;
  }

  try {
    const rs = await apiJson(`/api/lucky-mystery-box/search?code=${encodeURIComponent(code)}`);
    const data = rs.data || {};
    const info = data.session || {};
    const safeCode = escapeHtml(info.code || code);
    const inventoryCount = Array.isArray(data.inventory) ? data.inventory.length : 0;

    if (resultEl) {
      resultEl.innerHTML = `
        <div class="hub-card search-session-card">
          <div class="hub-card-title">Mã phiên: ${safeCode}</div>
          <div class="hub-card-meta">Trạng thái hoạt động: ${info.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</div>
          <div class="hub-card-meta">Hoàn tất: ${info.isCompleted ? 'Đã hoàn tất' : 'Chưa hoàn tất'}</div>
          <div class="hub-card-meta">Người chơi: ${escapeHtml(info.playerName || 'Chưa cập nhật')}</div>
          <div class="hub-card-meta">Số bản ghi nhận quà: ${inventoryCount}</div>
          <div class="hub-card-actions">
            <button class="hub-inline-btn convert" type="button" onclick="openSessionDetailModal('${safeCode}')">Xem chi tiết phiên chơi</button>
          </div>
        </div>
      `;
    }
  } catch (err) {
    if (resultEl) {
      resultEl.innerHTML = `<div class="hub-card"><div class="hub-card-title">Không tìm thấy</div><div class="hub-card-meta">${err.message}</div></div>`;
    }
    showToast(`❌ ${err.message}`);
  }
}

function closeSessionDetailModal() {
  const ov = document.getElementById('sessionDetailOv');
  if (ov) ov.classList.remove('open');
}

function openSessionDetailImage(encodedUrl, encodedName) {
  const url = decodeURIComponent(String(encodedUrl || ''));
  if (!url) return;
  const name = decodeURIComponent(String(encodedName || 'Phần thưởng'));
  const lb = document.getElementById('wovLightbox');
  const img = document.getElementById('wovLbImg');
  if (!lb || !img) return;
  img.src = url;
  img.alt = name;
  lb.classList.add('open');
}

function buildSessionStatusBadge(active, completed) {
  const activeBadge = active
    ? '<span class="sd-badge active">Đang hoạt động</span>'
    : '<span class="sd-badge inactive">Không hoạt động</span>';
  const completedBadge = completed
    ? '<span class="sd-badge completed">Đã hoàn tất</span>'
    : '<span class="sd-badge pending">Đang chơi</span>';
  return `${activeBadge}${completedBadge}`;
}

function renderSessionDetailBoxCard(item) {
  const boxNumber = Number(item.box_number || item.boxNumber || item.selected_box_number || 0);
  const prizeName = escapeHtml(item.prize_name || 'Phần thưởng');
  const level = String(item.level || 'NORMAL').toUpperCase();
  const statusText = escapeHtml(getStatusText(item));
  const currency = String(item.currency || 'VND').toUpperCase();
  const amount = Number(item.prize_value || item.value || 0);
  const amountLabel = amount > 0 ? formatCurrency(amount, currency) : 'Quà hiện vật';
  const approx = currency !== 'VND' && amount > 0
    ? ` (≈ ${(amount * (currency === 'USD' ? 26000 : 3800)).toLocaleString('vi-VN')} VND)`
    : '';
  const desc = escapeHtml(item.prize_description || item.category || 'Không có mô tả chi tiết');
  const openedAt = formatDateTime(item.createdAt || item.created_at);
  const decision = item.decision ? escapeHtml(String(item.decision)) : '--';
  const imageUrl = String(item.prize_image || item.image_url || '').trim();

  let mediaHtml = `<span class="sd-box-icon">${escapeHtml(item.prize_icon || item.icon || '🎁')}</span>`;
  if (imageUrl) {
    const encodedUrl = encodeURIComponent(imageUrl);
    const encodedName = encodeURIComponent(item.prize_name || 'Phần thưởng');
    mediaHtml = `<img src="${escapeHtml(imageUrl)}" alt="${prizeName}" loading="lazy" decoding="async" onclick="openSessionDetailImage('${encodedUrl}','${encodedName}')">`;
  }

  return `
    <article class="sd-box-card">
      <div class="sd-box-media">${mediaHtml}</div>
      <div>
        <div class="sd-box-title">Hộp #${boxNumber}: ${prizeName}</div>
        <div class="sd-box-sub">${desc}</div>
        <div class="sd-tags">
          <span class="sd-tag">${escapeHtml(level)}</span>
          <span class="sd-tag">${statusText}</span>
          ${item.is_special ? '<span class="sd-tag">Special</span>' : ''}
          ${item.is_cash ? '<span class="sd-tag">Tiền mặt</span>' : '<span class="sd-tag">Hiện vật</span>'}
        </div>
        <div class="sd-box-lines">
          <div class="sd-line"><b>Giá trị:</b> ${escapeHtml(amountLabel)}${approx}</div>
          <div class="sd-line"><b>Quyết định:</b> ${decision}</div>
          <div class="sd-line"><b>Thời gian mở:</b> ${escapeHtml(openedAt)}</div>
        </div>
      </div>
    </article>
  `;
}

function renderSessionTimeline(transactions) {
  if (!Array.isArray(transactions) || !transactions.length) {
    return '<div class="sd-no-data">Chưa có giao dịch trong phiên này.</div>';
  }

  return transactions.slice(0, 30).map((tx) => {
    const type = String(tx.type || '').toLowerCase();
    const status = String(tx.status || '').toLowerCase();
    const amount = Number(tx.amountVND || tx.amount || 0);
    let title = 'Giao dịch';
    if (type.includes('conversion')) title = 'Quy đổi phần quà';
    if (type === 'withdraw') title = 'Yêu cầu rút tiền';
    const detail = amount > 0 ? `${amount.toLocaleString('vi-VN')} đ` : '--';
    const subtitle = `${status || 'pending'}${tx.boxNumber ? ` • Hộp #${Number(tx.boxNumber)}` : ''}`;
    const time = formatDateTime(tx.requestedAt || tx.createdAt || tx.approvedAt);

    return `
      <div class="sd-event">
        <div>
          <div class="sd-event-title">${escapeHtml(title)}: ${escapeHtml(detail)}</div>
          <div class="sd-event-sub">${escapeHtml(subtitle)}</div>
        </div>
        <div class="sd-event-time">${escapeHtml(time)}</div>
      </div>
    `;
  }).join('');
}

async function openSessionDetailModal(codeParam) {
  const rawCode = String(codeParam || document.getElementById('searchInput')?.value || '').trim().toUpperCase();
  if (!rawCode) {
    showToast(contentTextGlobal('sessionDetailMissingCode', 'Vui lòng nhập mã phiên để xem chi tiết'));
    return;
  }

  const ov = document.getElementById('sessionDetailOv');
  const body = document.getElementById('sessionDetailBody');
  const titleEl = document.getElementById('sessionDetailTitle');
  const subEl = document.getElementById('sessionDetailSub');
  if (!ov || !body || !titleEl || !subEl) return;

  titleEl.textContent = `${contentTextGlobal('sessionDetailTitlePrefix', 'Chi tiết phiên chơi')}: ${rawCode}`;
  subEl.textContent = contentTextGlobal('sessionDetailLoadingSub', 'Đang tải toàn bộ thông tin hộp quà, ví và giao dịch...');
  body.innerHTML = `<div class="session-detail-loading">${escapeHtml(contentTextGlobal('sessionDetailLoadingData', 'Đang tải dữ liệu phiên và ảnh phần thưởng...'))}</div>`;
  ov.classList.add('open');

  try {
    const [sessionRs, inventoryRs, walletRs, transactionsRs] = await Promise.allSettled([
      apiJson(`/api/lucky-mystery-box/search?code=${encodeURIComponent(rawCode)}`),
      apiJson(`/api/lucky-mystery-box/${encodeURIComponent(rawCode)}/player-inventory`),
      apiJson(`/api/lucky-mystery-box/${encodeURIComponent(rawCode)}/wallet`),
      apiJson(`/api/lucky-mystery-box/${encodeURIComponent(rawCode)}/transactions`)
    ]);

    const searchData = sessionRs.status === 'fulfilled' ? (sessionRs.value?.data || {}) : {};
    const session = searchData.session || {};
    const inventoryItems = inventoryRs.status === 'fulfilled'
      ? (inventoryRs.value?.data?.items || [])
      : (Array.isArray(searchData.inventory)
        ? searchData.inventory.map((row) => ({
          box_number: row.selected_box_number,
          prize_name: row.prize_name,
          status: row.status,
          createdAt: row.createdAt,
          prize_value: 0,
          currency: 'VND',
          prize_icon: '🎁',
          level: 'NORMAL'
        }))
        : []);

    const walletData = walletRs.status === 'fulfilled' ? (walletRs.value?.data || {}) : {};
    const txData = transactionsRs.status === 'fulfilled' ? (transactionsRs.value?.data || []) : [];

    const isActive = !!session.isActive;
    const isCompleted = !!session.isCompleted;
    const sessionCode = escapeHtml(session.code || rawCode);
    const playerName = escapeHtml(session.playerName || 'Chưa cập nhật');
    const itemCount = Number(inventoryItems.length || 0);
    const pendingConversion = Number(walletData.pending_conversion || 0);
    const walletRemaining = Number(walletData.remaining || walletData.balance || 0);
    const trustScore = Number(walletData.trust_score || 100);
    const statusBadges = buildSessionStatusBadge(isActive, isCompleted);
    const boxCardsHtml = itemCount
      ? inventoryItems.sort((a, b) => Number(a.box_number || a.boxNumber || 0) - Number(b.box_number || b.boxNumber || 0)).map(renderSessionDetailBoxCard).join('')
      : '<div class="sd-no-data">Phiên này chưa có hộp quà nào được mở.</div>';

    subEl.textContent = contentTextGlobal('sessionDetailSummarySub', 'Tổng hợp đầy đủ hộp quà, trạng thái xử lý, ví và lịch sử giao dịch theo phiên.');
    body.innerHTML = `
      <section class="sd-top">
        <div class="sd-hero">
          <div class="sd-code">${sessionCode}</div>
          <div class="sd-subline">
            ${statusBadges}
          </div>
          <div class="sd-meta-grid">
            <div class="sd-meta-item">
              <div class="sd-meta-label">Người chơi</div>
              <div class="sd-meta-value">${playerName}</div>
            </div>
            <div class="sd-meta-item">
              <div class="sd-meta-label">Số hộp đã có dữ liệu</div>
              <div class="sd-meta-value">${itemCount} hộp</div>
            </div>
            <div class="sd-meta-item">
              <div class="sd-meta-label">Nguồn dữ liệu</div>
              <div class="sd-meta-value">Player Inventory + Transactions</div>
            </div>
            <div class="sd-meta-item">
              <div class="sd-meta-label">Mã tra cứu</div>
              <div class="sd-meta-value">${sessionCode}</div>
            </div>
          </div>
        </div>
        <div class="sd-wallet">
          <div class="sd-wallet-row"><span class="lbl">Số dư khả dụng</span><span class="val">${walletRemaining.toLocaleString('vi-VN')} đ</span></div>
          <div class="sd-wallet-row"><span class="lbl">Đang chờ quy đổi</span><span class="val warn">${pendingConversion.toLocaleString('vi-VN')} đ</span></div>
          <div class="sd-wallet-row"><span class="lbl">Điểm tín nhiệm</span><span class="val">${Math.max(0, Math.min(100, trustScore)).toLocaleString('vi-VN')}</span></div>
        </div>
      </section>

      <section class="sd-section">
        <div class="sd-section-head">
          <div class="sd-section-title">Chi tiết từng hộp quà</div>
          <div class="sd-section-note">Nhấn ảnh để xem phóng to</div>
        </div>
        <div class="sd-box-grid">${boxCardsHtml}</div>
      </section>

      <section class="sd-section">
        <div class="sd-section-head">
          <div class="sd-section-title">Lịch sử giao dịch phiên</div>
          <div class="sd-section-note">Hiển thị tối đa 30 bản ghi mới nhất</div>
        </div>
        <div class="sd-timeline">${renderSessionTimeline(txData)}</div>
      </section>
    `;
    if (window.__manualTextMap && typeof applyManualTextMapToDOM === 'function') {
      applyManualTextMapToDOM(window.__manualTextMap);
    }
  } catch (err) {
    body.innerHTML = `<div class="sd-no-data">Không thể tải chi tiết phiên: ${escapeHtml(err.message || 'Lỗi không xác định')}</div>`;
    subEl.textContent = contentTextGlobal('sessionDetailLoadFailedSub', 'Không thể tải dữ liệu chi tiết, vui lòng thử lại.');
  }
}

function syncLoginStartButtonState() {
  const input = getHomepageSessionInput();
  const button = getHomepageStartButton();
  if (!input || !button) return;
  button.disabled = (input.value || '').trim().length < 1;
}

function bindLoginInputState() {
  const input = getHomepageSessionInput();
  if (!input || input.dataset.startButtonBound === '1') return;
  input.addEventListener('input', syncLoginStartButtonState);
  input.dataset.startButtonBound = '1';
  syncLoginStartButtonState();
}

function initLoginDecor() {
  const stars = document.getElementById('nhpStars');
  const blobs = document.getElementById('nhpGlowBlobs');
  const shapes = document.getElementById('nhpShapes');
  if (!stars || !blobs || !shapes || stars.dataset.decorReady === '1') return;

  const prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const lowPowerMode = prefersReducedMotion || isMobileLiteEffects();
  const starCount = lowPowerMode ? 18 : 36;
  const shapeCount = lowPowerMode ? 10 : 16;

  const starFrag = document.createDocumentFragment();
  for (let i = 0; i < starCount; i += 1) {
    const el = document.createElement('div');
    const size = (Math.random() * 2 + 0.4).toFixed(1);
    const o = (Math.random() * 0.35 + 0.1).toFixed(2);
    el.className = 'nhp-star';
    el.style.cssText = `width:${size}px;height:${size}px;top:${(Math.random() * 100).toFixed(2)}%;left:${(Math.random() * 100).toFixed(2)}%;--o:${o};--d:${(Math.random() * 5 + 2).toFixed(1)}s;--sd:${(Math.random() * 8).toFixed(1)}s;`;
    starFrag.appendChild(el);
  }
  stars.appendChild(starFrag);

  const blobCfg = [
    { w: 120, h: 44, top: 21, left: 41, blur: 18, color: 'rgba(96,165,250,0.22)', bd: 8, bx: '15px', by: '-20px' },
    { w: 90, h: 34, top: 44, left: 31, blur: 14, color: 'rgba(139,92,246,0.28)', bd: 11, bx: '-10px', by: '-25px' },
    { w: 60, h: 22, top: 61, left: 32, blur: 10, color: 'rgba(96,165,250,0.2)', bd: 9, bx: '8px', by: '-18px' },
    { w: 200, h: 72, top: 66, left: 24, blur: 22, color: 'rgba(139,92,246,0.22)', bd: 13, bx: '-20px', by: '-30px' },
    { w: 160, h: 58, top: 72, left: 46, blur: 20, color: 'rgba(96,165,250,0.18)', bd: 10, bx: '12px', by: '-22px' },
    { w: 230, h: 82, top: 63, left: 60, blur: 24, color: 'rgba(139,92,246,0.18)', bd: 14, bx: '18px', by: '-28px' },
    { w: 100, h: 36, top: 18, left: 79, blur: 14, color: 'rgba(167,139,250,0.2)', bd: 9, bx: '-12px', by: '-20px' }
  ];

  const blobFrag = document.createDocumentFragment();
  blobCfg.slice(0, lowPowerMode ? 4 : blobCfg.length).forEach((cfg, i) => {
    const el = document.createElement('div');
    el.className = 'nhp-glow-blob';
    el.style.cssText = `width:${cfg.w}px;height:${cfg.h}px;top:${cfg.top}%;left:${cfg.left}%;--gb-color:${cfg.color};--gb-blur:${cfg.blur}px;--gb-op:${lowPowerMode ? 0.12 : 0.2};--gb-dur:${cfg.bd}s;--gb-delay:${-(i * 1.3).toFixed(1)}s;--gb-tx:${cfg.bx};--gb-ty:${cfg.by};--gb-sc:${lowPowerMode ? 1.03 : 1.08};`;
    blobFrag.appendChild(el);
  });
  blobs.appendChild(blobFrag);

  const colors = ['#a78bfa', '#818cf8', '#c4b5fd', '#7dd3fc', '#93c5fd', '#ddd6fe', '#e879f9'];
  const shapeDefs = {
    diamond: (c) => `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,2 38,20 20,38 2,20" fill="${c}" fill-opacity=".18" stroke="${c}" stroke-width="1.5"/></svg>`,
    star: (c) => `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,2 24,15 38,15 27,23 31,37 20,29 9,37 13,23 2,15 16,15" fill="${c}" fill-opacity=".22" stroke="${c}" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
    gift: (c) => `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="18" width="28" height="18" rx="1.5" fill="${c}" fill-opacity=".2" stroke="${c}" stroke-width="1.4"/><rect x="4" y="13" width="32" height="7" rx="1.5" fill="${c}" fill-opacity=".28" stroke="${c}" stroke-width="1.4"/><rect x="18" y="13" width="4" height="23" fill="${c}" fill-opacity=".45"/></svg>`
  };
  const keys = Object.keys(shapeDefs);

  const shapeFrag = document.createDocumentFragment();
  for (let i = 0; i < shapeCount; i += 1) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const wrapper = document.createElement('div');
    wrapper.className = 'nhp-shape';
    wrapper.style.cssText = `top:${(Math.random() * 88 + 2).toFixed(2)}%;left:${(Math.random() * 94 + 1).toFixed(2)}%;width:40px;height:40px;--float-y:${(-(Math.random() * 28 + 10)).toFixed(0)}px;--r0:${(Math.random() * 30 - 15).toFixed(0)}deg;--r1:${(Math.random() * 30 - 15).toFixed(0)}deg;--sf-dur:${(Math.random() * 6 + 5).toFixed(1)}s;--s-delay:${(-(Math.random() * 14)).toFixed(1)}s;--s-op:${(Math.random() * 0.35 + 0.5).toFixed(2)};--s-color:${color};`;
    wrapper.innerHTML = shapeDefs[key](color);
    shapeFrag.appendChild(wrapper);
  }

  const commitShapes = () => {
    if (!shapes.isConnected) return;
    shapes.appendChild(shapeFrag);
  };

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(commitShapes, { timeout: 900 });
  } else {
    setTimeout(commitShapes, 180);
  }

  stars.dataset.decorReady = '1';
}

async function initFromBootstrap() {
  syncHomepagePerformanceMode();
  await initHomepageThemePicker();
  initLoginDecor();
  bindLoginInputState();
  bindSessionInputEnterKey();

  // Load game settings from server (must complete before game can start)
  const settingsReady = fetch('/api/settings').then(r => r.json()).then(j => {
    if (j.success && j.data) {
      const d = j.data;
      if (d.features) {
        const f = d.features;
        state.gameSettings.showUnluckyPopup = f.showUnluckyPopup === true;
        state.gameSettings.allowReopenPopup = f.allowReopenPopup !== false;
        state.gameSettings.showCelebrationEffects = f.showCelebrationEffects !== false;
      }

      window.__lmbUiSettings = {
        content: d.content || {},
        logo: d.logo || {},
        appearance: d.appearance || {},
        seo: d.seo || {},
        chat: d.chat || {},
        popup: d.popup || {},
        boxSettings: d.boxSettings || {},
        social: d.social || {},
        watermark: d.watermark || {},
        maintenance: d.maintenance || {},
        scripts: d.scripts || {},
        features: d.features || {},
        floatingNotification: d.floatingNotification || {},
        userNotification: d.userNotification || {},
        modalEditor: d.modalEditor || {},
        i18n: d.i18n || {},
        animationPresets: d.animationPresets || {}
      };
      applyUiCustomizationEverywhere();
      applyHomepageThemeLabelOverridesFromSettings();
    }
  }).catch(() => {});
  state._settingsReady = settingsReady;

  const bootstrap = window.LMB_BOOTSTRAP || {};
  const byUrl = getSessionCodeFromUrl();
  const byBootstrap = (bootstrap.sessionCode || '').toUpperCase();
  const byStorage = (typeof lmbManager !== 'undefined' ? (lmbManager.restoreSession() || '') : '').toUpperCase();
  const code = byUrl || byBootstrap || byStorage;

  if (bootstrap.showThankYou) {
    showThankYouPage({
      title: 'Cảm ơn bạn đã tham gia',
      subtitle: 'Hệ thống đã lưu trạng thái phiên chơi của bạn',
      method: 'Phiên chơi',
      detail: 'Bạn có thể tiếp tục tra cứu trong mục Quản lý phiên'
    });
  }

  renderBoxes();

  if (!code) return;

  const input = getHomepageSessionInput();
  if (input) input.value = code;
  syncLoginStartButtonState();

  if (bootstrap.autoLoadChooseBox || byUrl) {
    if (byUrl) await tryAutoEnterFromUrl('bootstrap');
    else await startGame(code);
  }
}

function enterSession() {
  return startGame();
}

function openWithdrawModal() {
  return openWith();
}

function closeWithdrawModal() {
  return closeWith();
}

function confirmWithdraw() {
  return submitWith();
}

function filterTx(type, el) {
  return setTxFilter(type, el);
}

function goBack() {
  return handleBackNavigationInSession();
}

function backToHome() {
  const gameScreen = document.getElementById('screen-game');
  const loginScreen = document.getElementById('screen-login');
  try {
    const cleanUrl = window.location.pathname;
    window.history.replaceState({ lmbPage: 'home', sessionCode: '' }, '', cleanUrl);
  } catch (_) {}
  if (gameScreen) gameScreen.style.display = 'none';
  if (loginScreen) loginScreen.style.display = 'flex';
  syncHomepagePerformanceMode();
  stopGameHeroTyping();
}

function initMobileWalletDocking() {
  // Nav, ticker and wallet are all position:fixed on mobile — no scroll tracking needed.
}

window.addEventListener('popstate', () => {
  handleBackNavigationInSession();
});

document.addEventListener('visibilitychange', () => {
  if (LMB_UPDATE_SCHEDULER && typeof LMB_UPDATE_SCHEDULER.setPaused === 'function') {
    LMB_UPDATE_SCHEDULER.setPaused(!!document.hidden);
  }
  LMB_EVENT_BUS.emit('app:visibility', { hidden: !!document.hidden, ts: Date.now() });
  if (document.hidden) {
    clearRealtimeQueueDrainTimer();
    stopGameHeroTyping();
    stopRealFloatingFeedRefreshTimer();
    if (state.homeFeedTimer) {
      clearTimeout(state.homeFeedTimer);
      state.homeFeedTimer = null;
    }
    if (state.gameFeedTimer) {
      clearTimeout(state.gameFeedTimer);
      state.gameFeedTimer = null;
    }
    return;
  }
  scheduleRealtimeQueueDrain();
  validateSession();
  if (LMB_UPDATE_SCHEDULER && typeof LMB_UPDATE_SCHEDULER.flushNow === 'function') {
    LMB_UPDATE_SCHEDULER.flushNow();
  }
  backgroundSync();
  initWinnerTicker();
  checkAndRestorePendingApproval();
});

window.addEventListener('focus', () => {
  if (document.hidden) return;
  validateSession();
  backgroundSync();
  checkAndRestorePendingApproval();
});

window.addEventListener('beforeunload', () => {
  clearAutoEnterRetryTimers();
  stopGameHeroTyping();
  stopRealtimeSync();
  stopChatSSE();
  stopRealFloatingFeedRefreshTimer();
  if (state.homeFeedTimer) {
    clearTimeout(state.homeFeedTimer);
    state.homeFeedTimer = null;
  }
  if (state.gameFeedTimer) {
    clearTimeout(state.gameFeedTimer);
    state.gameFeedTimer = null;
  }
});

window.selMode = selMode;
window.startGame = startGame;
window.openBox = openBox;
window.closeWin = closeWin;
window.closePrizeLightbox = closePrizeLightbox;
window.togChat = togChat;
window.togChatFromToast = togChatFromToast;
window.hideChatToast = hideChatToast;
window.qChat = qChat;
window.sendC = sendC;
window.startCustomerChat = startCustomerChat;
window.startVoiceRecording = startVoiceRecording;
window.openChatFilePicker = openChatFilePicker;
window.handleChatFilePicked = handleChatFilePicked;
window.contactSupportFromApprovalTimeout = contactSupportFromApprovalTimeout;
window.openWith = openWith;
window.closeWith = closeWith;
window.togCk = togCk;
window.submitWith = submitWith;
window.fillWithdrawAmountPercent = fillWithdrawAmountPercent;
window.refreshWallet = refreshWallet;
window.quickSupportWithdraw = quickSupportWithdraw;
window.quickSupportWithdrawByIndex = quickSupportWithdrawByIndex;
window.openHub = openHub;
window.closeHub = closeHub;
window.searchSession = searchSession;
window.setTxFilter = setTxFilter;
window.setTxPage = setTxPage;
window.refreshHubData = refreshHubData;
window.openClaimModal = openClaimModal;
window.closeClaimModal = closeClaimModal;
window.confirmClaim = confirmClaim;
window.convertPrize = convertPrize;
window.winChooseClaim = winChooseClaim;
window.winChooseMoney = winChooseMoney;
window.winConvertNow = winConvertNow;
window.winClaimNow = () => showToast('ℹ️ Liên hệ CSKH để nhận quà');
window.winDeclineNow = winDeclineNow;
window.acceptSpecialPrize = acceptSpecialPrize;
window.declineSpecialPrize = declineSpecialPrize;
window.reopenWinOptions = reopenWinOptions;
window.setupWinOverlay = setupWinOverlay;
window.shareCurrentPrizePreview = shareCurrentPrizePreview;
window.downloadCurrentPrizeImage = downloadCurrentPrizeImage;
window.captureResult = captureResult;
window.activateNextBox = activateNextBox;
window.openNextAvailableBox = openNextAvailableBox;
window.redeemFreeBox = redeemFreeBox;
window.showApprovalWaitScreen = showApprovalWaitScreen;
window.hideApprovalWaitScreen = hideApprovalWaitScreen;
window.showThankYouPage = showThankYouPage;
window.closeThankYou = closeThankYou;
window.enterSession = enterSession;
window.openWithdrawModal = openWithdrawModal;
window.closeWithdrawModal = closeWithdrawModal;
window.confirmWithdraw = confirmWithdraw;
window.filterTx = filterTx;
window.goBack = goBack;
window.backToHome = backToHome;
window.validateSession = validateSession;
window.getSessionRemainingTime = getSessionRemainingTime;
window.switchLanguage = switchLanguage;

window.__lmbHooks = {
  realtimeManagedByCore: true,
  eventDrivenFetchOnly: true,
  startChatRuntime: async () => {
    if (LMB_RUNTIME.chatRuntimeStarted || LMB_RUNTIME.chatRuntimeStarting) return;
    LMB_RUNTIME.chatRuntimeStarting = true;
    try {
      // Realtime notification runtime must start regardless of lazy widget state.
      initChatWidgetNotificationRuntime();
      bindRealtimeEventConsumers();
      await ensureChatModuleReady();
      startChatSSE();
      bootstrapChatNotificationRuntime().catch(() => {});
      requestBrowserNotificationPermissionOnce().catch(() => {});
      LMB_RUNTIME.chatRuntimeStarted = true;
    } finally {
      LMB_RUNTIME.chatRuntimeStarting = false;
    }
  },
  ensureWalletUi: async () => {
    await ensureWalletModuleReady();
  },
  ensureHistoryUi: async () => {
    await ensureHistoryModuleReady();
  },
  refreshWalletBundle: async () => {
    await Promise.all([refreshWallet(), refreshTransactions()]);
  },
  refreshInventoryBundle: async () => {
    await Promise.all([loadPlayerInventory(), refreshTransactions()]);
  }
};

initFromBootstrap().catch((err) => {
  showToast(`❌ ${err?.message || 'Không thể khởi tạo homepage'}`);
});
setTimeout(() => {
  if (getSessionCodeFromUrl()) {
    scheduleAutoEnterRetries('delayed-fallback');
  }
}, 900);
if (typeof BrowserFingerprint !== 'undefined' && typeof BrowserFingerprint.initializeCache === 'function') {
  BrowserFingerprint.initializeCache().catch(() => {});
}
ensureApiFingerprintCached().catch(() => {});
initMobileWalletDocking();
applyUiMotionSettingForCustomer();
setupEngagementSystem();
if (window.moduleLoader && typeof window.moduleLoader.preloadMobileDefaults === 'function') {
  window.moduleLoader.preloadMobileDefaults();
}

function scheduleChatRuntimeStartRetry(attempt = 0) {
  const maxAttempts = 5;
  const delays = [600, 1200, 2200, 3600, 5200];
  const idx = Math.max(0, Math.min(attempt, delays.length - 1));
  const waitMs = delays[idx];

  setTimeout(() => {
    if (!window.__lmbHooks || typeof window.__lmbHooks.startChatRuntime !== 'function') return;

    window.__lmbHooks.startChatRuntime()
      .catch(() => {})
      .finally(() => {
        if (LMB_RUNTIME.chatRuntimeStarted) return;
        if (attempt + 1 >= maxAttempts) return;
        scheduleChatRuntimeStartRetry(attempt + 1);
      });
  }, waitMs);
}

scheduleChatRuntimeStartRetry(0);

// Hard-start realtime chat notifications on page load.
// This bypasses lazy-widget timing so user can receive admin message
// sound/toast/hint without opening the chat widget first.
setTimeout(() => {
  try {
    initChatWidgetNotificationRuntime();
    bindRealtimeEventConsumers();
    bootstrapChatNotificationRuntime().catch(() => {});
    startChatSSE();
  } catch (_) {}
}, 280);

scheduleNoti();
initWinnerTicker();
