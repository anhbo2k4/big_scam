(function adminCustomerCareModule() {
  const state = {
    sessions: [],
    filteredSessions: [],
    selectedSessionCode: '',
    messages: [],
    statusFilter: 'all',
    unreadTotal: 0,
    pollingTimer: null,
    pollingInterval: 60000,
    pollingBaseInterval: 60000,
    pollingMaxInterval: 60000,
    pollingErrorCount: 0,
    pollingBusy: false,
    pollingBurstRemaining: 0,
    adminIsTyping: false,
    adminTypingTimer: null,
    autoSaveStyleTimer: null,
    autoSaveNicknameTimer: null,
    lastRenderedMessageTs: {}, // sessionCode -> latest rendered message timestamp
    playerTypingTimers: {}, // sessionCode -> timeout
    typingSessionCodes: new Set(),
    seenSessions: new Set(),  // kept for backward compatibility
    seenSessionAt: {}, // sessionCode -> latest seen timestamp from player
    forceClearedUnread: new Set(), // sessionCodes force-cleared after admin reply
    composerBusy: false,
    recentBumpedSessions: {}, // sessionCode -> expiresAt(ms)
    lastMessagesDigestBySession: {},
    inputRaf: 0,
    avgApiLatencyMs: 0,
    mobileMessagePollTick: 0,
    forceNextMessagePoll: false,
    searchDebounceTimer: null,
    filterDebounceTimer: null,
    sessionsInFlightPromise: null,
    messagesInFlightBySession: {},
    sessionsLastFetchAt: 0,
    slowApiWarnAt: 0,
    paneAnimationTimer: null,
    sseConnected: false,
    sseLastEventId: 0,
    messageAppendQueue: [],
    messageAppendRaf: 0,
    inputHeight: 40,
    inputResizeRaf: 0,
    pendingSessionRefreshTimer: null,
    pendingMessagePollFallback: false,
    editingMessageId: null,
    editingDraftText: '',
    editingEditorNode: null,
    deleteConfirmMessageId: null,
    sessionSwitchInFlight: false,
    pendingSelectedSessionCode: '',
    messageRetryTimersBySession: {},
    messagesReloadQueuedBySession: {},
    takeoverPromptShownBySession: {},
    openConversationMenuCode: '',
    adminPresenceList: [],
    _presenceTimer: null,
    expandedIpGroups: new Set(),  // IPs whose group is expanded in the session list
  };

  const DEFAULT_SUPPORT_DISPLAY_NAME = 'CSKH Mạnh Lâm TaoBao';
  const CURRENT_ADMIN_ID = Number(window.CURRENT_ADMIN_ID || window.__CURRENT_ADMIN_ID || 0) || null;
  const CURRENT_ADMIN_USERNAME = String(window.CURRENT_ADMIN_USERNAME || window.__CURRENT_ADMIN_USERNAME || 'admin').trim() || 'admin';
  const CURRENT_ADMIN_FULL_NAME = String(window.CURRENT_ADMIN_FULL_NAME || '').trim();
  const CURRENT_ADMIN_DISPLAY_NAME = CURRENT_ADMIN_FULL_NAME || DEFAULT_SUPPORT_DISPLAY_NAME;

  function getAdminDisplayNameByIdentity({ adminId, username, fallbackName = '' } = {}) {
    const list = Array.isArray(state.adminPresenceList) ? state.adminPresenceList : [];
    const normalizedId = Number(adminId || 0) || null;
    const normalizedUsername = String(username || '').trim().toLowerCase();

    if (normalizedId) {
      const byId = list.find((u) => Number(u?.id || 0) === normalizedId);
      const nameById = String(byId?.full_name || byId?.username || '').trim();
      if (nameById) return nameById;
    }

    if (normalizedUsername) {
      const byUsername = list.find((u) => String(u?.username || '').trim().toLowerCase() === normalizedUsername);
      const nameByUsername = String(byUsername?.full_name || byUsername?.username || '').trim();
      if (nameByUsername) return nameByUsername;
    }

    return String(fallbackName || '').trim();
  }

  function getCurrentAdminDisplayName() {
    const liveName = getAdminDisplayNameByIdentity({
      adminId: CURRENT_ADMIN_ID,
      username: CURRENT_ADMIN_USERNAME,
      fallbackName: CURRENT_ADMIN_DISPLAY_NAME
    });
    return liveName || DEFAULT_SUPPORT_DISPLAY_NAME;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function getCustomerCareRoot() {
    return document.querySelector('#panel-customer-care .cc-root');
  }

  function refreshPaneToggleUi() {
    const root = getCustomerCareRoot();
    const convBtn = byId('ccToggleConversationsBtn');
    const infoBtn = byId('ccToggleInfoBtn');
    if (!root) return;

    const convOpen = !root.classList.contains('cc-hide-conversations');
    const infoOpen = !root.classList.contains('cc-hide-info');

    if (convBtn) {
      convBtn.classList.toggle('is-open', convOpen);
      convBtn.setAttribute('aria-pressed', convOpen ? 'true' : 'false');
    }
    if (infoBtn) {
      infoBtn.classList.toggle('is-open', infoOpen);
      infoBtn.setAttribute('aria-pressed', infoOpen ? 'true' : 'false');
    }
  }

  function setDesktopPaneVisibility(kind) {
    const root = getCustomerCareRoot();
    if (!root) return;
    if (isMobileChatUi()) return;

    if (kind === 'conversations') {
      root.classList.toggle('cc-hide-conversations');
    } else if (kind === 'info') {
      root.classList.toggle('cc-hide-info');
    }

    root.classList.remove('cc-pane-animating');
    void root.offsetWidth;
    root.classList.add('cc-pane-animating');
    if (state.paneAnimationTimer) clearTimeout(state.paneAnimationTimer);
    state.paneAnimationTimer = setTimeout(() => {
      root.classList.remove('cc-pane-animating');
      state.paneAnimationTimer = null;
    }, 280);

    refreshPaneToggleUi();
  }

  function updateConversationToggleUnreadBadge(totalUnread) {
    const badge = byId('ccToggleConversationsCount');
    if (!badge) return;
    const total = Number(totalUnread || 0);
    badge.textContent = total > 99 ? '99+' : String(total);
    badge.classList.toggle('has-count', total > 0);
  }

  function setComposerBusy(isBusy) {
    state.composerBusy = !!isBusy;
    const panel = byId('panel-customer-care');
    const sendBtn = byId('ccSendBtn');
    const attachBtn = byId('ccAttachBtn');
    const imageBtn = byId('ccImageBtn');
    const inputRow = document.querySelector('#panel-customer-care .cc-input-row');
    if (panel) panel.classList.toggle('cc-composer-busy', state.composerBusy);
    if (inputRow) inputRow.classList.toggle('is-busy', state.composerBusy);
    if (sendBtn) {
      sendBtn.classList.toggle('is-sending', state.composerBusy);
      sendBtn.disabled = state.composerBusy;
      sendBtn.setAttribute('aria-busy', state.composerBusy ? 'true' : 'false');
    }
    if (attachBtn) attachBtn.disabled = state.composerBusy;
    if (imageBtn) imageBtn.disabled = state.composerBusy;
  }

  function bumpConversation(sessionCode) {
    if (!sessionCode) return;
    state.recentBumpedSessions[sessionCode] = Date.now() + 3200;
    renderSessionList();
  }

  function isMobileChatUi() {
    return window.matchMedia('(max-width: 1300px)').matches;
  }

  /** At 1301-1450px the 3-column layout is too cramped — hide right panel by default. */
  function applyCompactDesktopDefaults() {
    const root = getCustomerCareRoot();
    if (!root) return;
    const w = window.innerWidth;
    if (w > 1300 && w <= 1450) {
      root.classList.add('cc-hide-info');
    } else if (w > 1450) {
      // Restore default when user grows the window
      root.classList.remove('cc-hide-info');
    }
  }

  function setMobileScreen(screen) {
    const panel = byId('panel-customer-care');
    if (!panel) return;
    if (!isMobileChatUi()) {
      panel.classList.remove('cc-mobile-chat-open', 'cc-mobile-search-open', 'cc-mobile-filter-open');
      refreshPaneToggleUi();
      return;
    }
    panel.classList.toggle('cc-mobile-chat-open', screen === 'chat');
    if (screen === 'chat') {
      state.forceNextMessagePoll = true;
    }
  }

  function isCustomerCarePanelVisible() {
    const panel = byId('panel-customer-care');
    return !!(panel && panel.classList.contains('active'));
  }

  function shouldPollMessages() {
    if (!isCustomerCarePanelVisible()) return false;
    // Poll only when SSE is degraded or a forced one-shot refresh is requested.
    if (state.forceNextMessagePoll) {
      state.forceNextMessagePoll = false;
      return true;
    }
    return !state.sseConnected || state.pendingMessagePollFallback;
  }

  function queueSessionRefresh() {
    if (state.pendingSessionRefreshTimer) return;
    state.pendingSessionRefreshTimer = setTimeout(() => {
      state.pendingSessionRefreshTimer = null;
      loadSessions().catch(() => {});
    }, 250);
  }

  function getCurrentNearBottom() {
    const box = byId('ccMessages');
    if (!box) return false;
    return (box.scrollHeight - (box.scrollTop + box.clientHeight)) <= 80;
  }

  function openInfoSheet() {
    const panel = byId('panel-customer-care');
    if (!panel) return;
    panel.classList.add('cc-info-sheet-open');
  }

  function closeInfoSheet() {
    const panel = byId('panel-customer-care');
    if (!panel) return;
    panel.classList.remove('cc-info-sheet-open');
  }

  function syncInfoSheetFromDetails() {
    const copyText = (fromId, toId) => {
      const from = byId(fromId);
      const to = byId(toId);
      if (!to) return;
      to.textContent = (from?.textContent || '--').trim() || '--';
    };
    const copyHtml = (fromId, toId) => {
      const from = byId(fromId);
      const to = byId(toId);
      if (!to) return;
      to.innerHTML = String(from?.innerHTML || '').trim() || getDefaultPersonAvatarSvg();
    };
    copyHtml('ccCustAvatar', 'ccSheetAvatar');
    copyText('ccCustName', 'ccSheetName');
    copyText('ccCustStatus', 'ccSheetStatus');
    copyText('ccJoinDate', 'ccSheetJoinDate');
    copyText('ccPhone', 'ccSheetPhone');
    copyText('ccEmail', 'ccSheetEmail');
    copyText('ccChatCode', 'ccSheetChatCode');
    copyText('ccGameSession', 'ccSheetGameSession');
    copyText('ccSessionExpireAt', 'ccSheetSessionExpireAt');
    copyText('ccCustIp', 'ccSheetIp');
    copyText('ccUserAgent', 'ccSheetUserAgent');
    copyText('ccFingerprint', 'ccSheetFingerprint');
    copyText('ccMsgCount', 'ccSheetMsgCount');
  }

  function fmtTime(raw) {
    const d = new Date(raw || Date.now());
    if (Number.isNaN(d.getTime())) return '--:--';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm} ${hh}:${mi}`;
  }

  function fmtDate(raw) {
    const d = new Date(raw || Date.now());
    if (Number.isNaN(d.getTime())) return '--/--/----';
    return d.toLocaleDateString('vi-VN');
  }

  function messageTimestamp(message) {
    const ts = new Date(message?.created_at || message?.createdAt || message?.updated_at || 0).getTime();
    return Number.isFinite(ts) && ts > 0 ? ts : 0;
  }

  function safe(v) {
    return String(v || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Render a chat message body safely.
   * Plain text → HTML-escaped. Rich-text HTML (from Tiptap) → sanitized HTML.
   * Allowlist: b, i, u, strong, em, span (color/font-size only), br, p, div.
   */
  function renderMessageBody(raw) {
    const text = String(raw || '');
    if (!text) return '';
    if (!/<[a-z][\s\S]*?>/i.test(text)) {
      return safe(text).replace(/\n/g, '<br>');
    }
    const ALLOWED = new Set(['b','i','u','strong','em','span','br','p','div','ol','ul','li']);
    const tmp = document.createElement('div');
    tmp.innerHTML = text;
    (function clean(node) {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === 3) return;
        if (child.nodeType !== 1) { child.remove(); return; }
        const tag = child.tagName.toLowerCase();
        if (!ALLOWED.has(tag)) {
          while (child.firstChild) node.insertBefore(child.firstChild, child);
          child.remove(); return;
        }
        Array.from(child.attributes).forEach(attr => {
          if (tag === 'span' && attr.name === 'style') {
            child.setAttribute('style',
              attr.value.split(';')
                .filter(s => /^\s*(color|font-size)\s*:/i.test(s))
                .join(';')
            );
          } else {
            child.removeAttribute(attr.name);
          }
        });
        clean(child);
      });
    })(tmp);
    return tmp.innerHTML;
  }

  function plainTextToRichHtml(text) {
    const raw = String(text || '').replace(/\r\n?/g, '\n').replace(/\u00a0/g, ' ').trim();
    if (!raw) return '';
    return raw
      .split(/\n{2,}/)
      .map((block) => `<p>${safe(block).replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  function shouldPreferPlainTextPaste(rawHtml) {
    const html = String(rawHtml || '');
    if (!html) return true;
    if (/class=(["'])?Mso/i.test(html)) return true;
    if (/docs-internal-guid/i.test(html)) return true;
    if (/<table[\s>]/i.test(html)) return true;
    const noisyAttrs = (html.match(/\s(?:class|style|lang|width|height|align|data-[\w-]+)=/gi) || []).length;
    return noisyAttrs >= 18;
  }

  function normalizeClipboardRichText(clipboardData) {
    if (!clipboardData) return '';
    const rawHtml = String(clipboardData.getData('text/html') || '').trim();
    const rawText = String(clipboardData.getData('text/plain') || '').trim();

    if (rawHtml && !shouldPreferPlainTextPaste(rawHtml)) {
      const sanitized = renderMessageBody(rawHtml)
        .replace(/<(p|div)>\s*<\/\1>/gi, '<br>')
        .replace(/(<br>\s*){3,}/gi, '<br><br>')
        .trim();
      if (sanitized) return sanitized;
    }

    return plainTextToRichHtml(rawText);
  }

  function insertHtmlIntoEditable(editor, html) {
    const target = editor;
    const content = String(html || '').trim();
    if (!target || !content) return;

    target.focus();
    try {
      document.execCommand('insertHTML', false, content);
      return;
    } catch (_) {}

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const fragment = range.createContextualFragment(content);
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  function escapeCssSelectorValue(value) {
    const raw = String(value || '');
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(raw);
    }
    return raw.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  }

  function normalizeHexColor(hex) {
    const raw = String(hex || '').trim();
    if (!raw) return '';
    if (/^#[0-9a-f]{6}$/i.test(raw)) return raw;
    if (/^#[0-9a-f]{3}$/i.test(raw)) {
      return `#${raw.slice(1).split('').map((ch) => ch + ch).join('')}`;
    }
    return '';
  }

  function hexToRgb(hex) {
    const normalized = normalizeHexColor(hex);
    if (!normalized) return null;
    const value = normalized.slice(1);
    return {
      r: Number.parseInt(value.slice(0, 2), 16),
      g: Number.parseInt(value.slice(2, 4), 16),
      b: Number.parseInt(value.slice(4, 6), 16)
    };
  }

  function rgbToHex(r, g, b) {
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(Number(v) || 0)));
    const toHex = (v) => clamp(v).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function mixHex(hexA, hexB, weightB = 0.5) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    if (!a && !b) return '#111827';
    if (!a) return normalizeHexColor(hexB) || '#111827';
    if (!b) return normalizeHexColor(hexA) || '#111827';

    const w = Math.max(0, Math.min(1, Number(weightB) || 0));
    const wa = 1 - w;
    return rgbToHex(
      (a.r * wa) + (b.r * w),
      (a.g * wa) + (b.g * w),
      (a.b * wa) + (b.b * w)
    );
  }

  function relativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const channel = (n) => {
      const c = (Number(n) || 0) / 255;
      return c <= 0.03928 ? (c / 12.92) : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return (0.2126 * channel(rgb.r)) + (0.7152 * channel(rgb.g)) + (0.0722 * channel(rgb.b));
  }

  function autoResizeInput(el) {
    if (!el) return;
    const minHeight = 40;
    const maxHeight = 120; // 3x the default input height
    if (state.inputResizeRaf) {
      cancelAnimationFrame(state.inputResizeRaf);
      state.inputResizeRaf = 0;
    }
    state.inputResizeRaf = requestAnimationFrame(() => {
      el.style.height = `${minHeight}px`;
      const nextHeight = Math.min(el.scrollHeight, maxHeight);
      const finalHeight = Math.max(minHeight, nextHeight);
      if (Math.abs(finalHeight - Number(state.inputHeight || minHeight)) > 0.5) {
        state.inputHeight = finalHeight;
      }
      el.style.height = `${state.inputHeight}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
      state.inputResizeRaf = 0;
    });
  }

  function getMessageDigest(messages) {
    if (!Array.isArray(messages) || messages.length === 0) return '0';
    const last = messages[messages.length - 1] || {};
    const lastId = String(last.id || '');
    const lastTs = String(last.updated_at || last.created_at || '');
    const lastSize = String((last.message || '').length);
    return `${messages.length}|${lastId}|${lastTs}|${lastSize}`;
  }

  function updatePollingProfile() {
    const base = 60000;
    if (state.pollingBaseInterval === base && state.pollingInterval === base && state.pollingMaxInterval === base) return;
    state.pollingBaseInterval = base;
    state.pollingInterval = base;
    state.pollingMaxInterval = base;
    restartPollingTimer();
  }

  const CHAT_THEME_PRESETS = {
    messenger: { text: '#f1f5f9', bg: '#0f172a', theirsBg: '#1f2937', mineBg: '#2563eb', theirsText: '#e2e8f0', mineText: '#ffffff', bgPattern: 'grid' },
    telegram: { text: '#e2e8f0', bg: '#0b1220', theirsBg: '#1e293b', mineBg: '#0ea5e9', theirsText: '#e2e8f0', mineText: '#ffffff', bgPattern: 'grid' },
    dark: { text: '#f1f5f9', bg: '#111827', theirsBg: '#1f2937', mineBg: '#374151', theirsText: '#f1f5f9', mineText: '#ffffff', bgPattern: 'solid' },
    ocean: { text: '#e0f2fe', bg: '#082f49', theirsBg: '#0c4a6e', mineBg: '#0ea5e9', theirsText: '#e0f2fe', mineText: '#ffffff', bgPattern: 'waves' },
    sunset: { text: '#fff7ed', bg: '#3f1d2e', theirsBg: '#5b2140', mineBg: '#f97316', theirsText: '#fff1f2', mineText: '#ffffff', bgPattern: 'waves' },
    forest: { text: '#ecfdf5', bg: '#052e16', theirsBg: '#14532d', mineBg: '#16a34a', theirsText: '#d1fae5', mineText: '#ffffff', bgPattern: 'dots' },
    rose: { text: '#fdf2f8', bg: '#3f0b24', theirsBg: '#6b2149', mineBg: '#ec4899', theirsText: '#fbcfe8', mineText: '#ffffff', bgPattern: 'dots' },
    mono: { text: '#f3f4f6', bg: '#0f172a', theirsBg: '#1f2937', mineBg: '#4b5563', theirsText: '#e5e7eb', mineText: '#ffffff', bgPattern: 'grid' },
    daylight: { text: '#0f172a', bg: '#f8fafc', theirsBg: '#e5e7eb', mineBg: '#2563eb', theirsText: '#0f172a', mineText: '#ffffff', bgPattern: 'solid' },
    mintlight: { text: '#064e3b', bg: '#f0fdfa', theirsBg: '#d1fae5', mineBg: '#10b981', theirsText: '#065f46', mineText: '#ffffff', bgPattern: 'dots' },
    skyglass: { text: '#0f172a', bg: '#eff6ff', theirsBg: '#e2e8f0', mineBg: '#0ea5e9', theirsText: '#0f172a', mineText: '#ffffff', bgPattern: 'grid' },
    peachcream: { text: '#7c2d12', bg: '#fff7ed', theirsBg: '#fed7aa', mineBg: '#ea580c', theirsText: '#7c2d12', mineText: '#ffffff', bgPattern: 'solid' },
    lavenderpaper: { text: '#4c1d95', bg: '#faf5ff', theirsBg: '#e9d5ff', mineBg: '#7c3aed', theirsText: '#4c1d95', mineText: '#ffffff', bgPattern: 'dots' },
    sandstone: { text: '#134e4a', bg: '#fafaf9', theirsBg: '#d6d3d1', mineBg: '#0f766e', theirsText: '#134e4a', mineText: '#ffffff', bgPattern: 'solid' }
  };

  let currentChatBgPattern = 'solid';
  let currentThemePresetKey = '';

  function getChatBgPatternCss(pattern) {
    const key = String(pattern || 'solid').toLowerCase();
    if (key === 'dots') {
      return 'radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01))';
    }
    if (key === 'grid') {
      return 'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)';
    }
    if (key === 'waves') {
      return 'radial-gradient(circle at 20% 20%, rgba(255,255,255,.12), transparent 40%), radial-gradient(circle at 80% 10%, rgba(255,255,255,.08), transparent 30%)';
    }
    return 'none';
  }

  function setActiveThemePreset(themeKey) {
    currentThemePresetKey = String(themeKey || '').toLowerCase();
    const buttons = document.querySelectorAll('.cc-theme-card');
    buttons.forEach((btn) => {
      const active = String(btn.getAttribute('data-cc-theme') || '').toLowerCase() === currentThemePresetKey;
      btn.classList.toggle('active', active);
    });
  }

  function applyChatFrameStyle(textColor, bgColor, bubbleTheirsColor, bubbleMineColor, bgPattern) {
    const root = byId('panel-customer-care');
    if (!root) return;

    const safeText = normalizeHexColor(textColor) || '#f1f5f9';
    const safeBg = normalizeHexColor(bgColor) || '#111827';
    const safeTheirs = normalizeHexColor(bubbleTheirsColor) || safeBg;
    const safeMine = normalizeHexColor(bubbleMineColor) || safeBg;
    const safeTextTheirs = normalizeHexColor(byId('ccTextTheirsColorText')?.value || '') || safeText;
    const safeTextMine = normalizeHexColor(byId('ccTextMineColorText')?.value || '') || '#ffffff';
    const isLightTheme = relativeLuminance(safeBg) >= 0.57;

    const convBg = isLightTheme
      ? mixHex(safeBg, '#dbe3ec', 0.42)
      : mixHex(safeBg, '#2a313d', 0.62);
    const convHoverBg = isLightTheme
      ? mixHex(convBg, '#cfd8e3', 0.3)
      : mixHex(convBg, '#3b4452', 0.34);
    const convActiveBg = isLightTheme
      ? mixHex(convBg, safeMine, 0.24)
      : mixHex(convBg, safeMine, 0.29);
    const convBorderHover = isLightTheme ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.08)';
    const convBorderActive = isLightTheme ? 'rgba(15,23,42,0.2)' : 'rgba(255,255,255,0.16)';
    const convPreviewText = isLightTheme
      ? mixHex(safeTextTheirs, '#334155', 0.5)
      : mixHex(safeTextTheirs, '#d1d9e6', 0.55);
    const convTimeText = isLightTheme
      ? mixHex(safeTextTheirs, '#475569', 0.56)
      : mixHex(safeTextTheirs, '#94a3b8', 0.62);

    const personAvatarBg = isLightTheme
      ? mixHex(safeBg, '#d5dce5', 0.72)
      : mixHex(safeBg, '#c7d0db', 0.78);
    const msgAvatarTheirsBg = mixHex(safeTheirs, personAvatarBg, 0.52);
    const msgAvatarMineBg = mixHex(safeMine, personAvatarBg, isLightTheme ? 0.3 : 0.2);

    root.style.setProperty('--cc-chat-text', safeText);
    root.style.setProperty('--cc-chat-box-bg', safeBg);
    root.style.setProperty('--cc-bubble-theirs-bg', safeTheirs);
    root.style.setProperty('--cc-bubble-mine-bg', safeMine);
    root.style.setProperty('--cc-chat-text-theirs', safeTextTheirs);
    root.style.setProperty('--cc-chat-text-mine', safeTextMine);
    root.style.setProperty('--cc-chat-bg-image', getChatBgPatternCss(bgPattern));
    root.style.setProperty('--cc-conv-bg', convBg);
    root.style.setProperty('--cc-conv-hover-bg', convHoverBg);
    root.style.setProperty('--cc-conv-active-bg', convActiveBg);
    root.style.setProperty('--cc-conv-border-hover', convBorderHover);
    root.style.setProperty('--cc-conv-border-active', convBorderActive);
    root.style.setProperty('--cc-conv-preview-text', convPreviewText);
    root.style.setProperty('--cc-conv-time-text', convTimeText);
    root.style.setProperty('--cc-person-avatar-bg', personAvatarBg);
    root.style.setProperty('--cc-person-avatar-icon', '#ffffff');
    root.style.setProperty('--cc-person-avatar-border', isLightTheme ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.24)');
    root.style.setProperty('--cc-msg-avatar-theirs-bg', msgAvatarTheirsBg);
    root.style.setProperty('--cc-msg-avatar-mine-bg', msgAvatarMineBg);
    root.style.setProperty('--cc-msg-avatar-theirs-border', isLightTheme ? 'rgba(15,23,42,0.14)' : 'rgba(255,255,255,0.22)');
    root.style.setProperty('--cc-msg-avatar-mine-border', isLightTheme ? 'rgba(15,23,42,0.14)' : 'rgba(191,219,254,0.75)');
    root.style.setProperty('--cc-msg-avatar-icon', '#ffffff');
  }

  function applyChatFrameStyleFromInputs() {
    applyChatFrameStyle(
      byId('ccChatTextColorText')?.value,
      byId('ccChatBgColorText')?.value,
      byId('ccBubbleTheirsColorText')?.value,
      byId('ccBubbleMineColorText')?.value,
      currentChatBgPattern
    );
  }

  function syncColorPair(pickerId, textId) {
    const picker = byId(pickerId);
    const text = byId(textId);
    if (!picker && !text) return;

    let syncing = false;

    const commitColor = (raw, source) => {
      const normalized = normalizeHexColor(raw);
      if (!normalized || syncing) return;
      syncing = true;

      if (picker && source !== 'picker') picker.value = normalized;
      if (text && source !== 'text') text.value = normalized;

      clearActiveThemePreset();
      applyChatFrameStyleFromInputs();
      scheduleAutoSaveChatFrameStyle();

      syncing = false;
    };

    if (picker) {
      picker.addEventListener('input', () => commitColor(picker.value, 'picker'));
      picker.addEventListener('change', () => commitColor(picker.value, 'picker'));
    }

    if (text) {
      text.addEventListener('input', () => {
        const normalized = normalizeHexColor(text.value);
        if (normalized) {
          commitColor(normalized, 'text');
          return;
        }
        clearActiveThemePreset();
      });

      text.addEventListener('blur', () => {
        const normalized = normalizeHexColor(text.value);
        if (normalized) {
          commitColor(normalized, 'text');
          return;
        }

        if (picker?.value) {
          text.value = picker.value;
          return;
        }

        const fallback = '#111827';
        text.value = fallback;
        if (picker) picker.value = fallback;
        applyChatFrameStyleFromInputs();
      });
    }
  }

  function getDisplayCustomerName(session) {
    const meta = getSessionMeta(session || {});
    return String(meta.customerNickname || session?.customer_name || 'Khách hàng').trim();
  }

  function getMessageMeta(message) {
    if (message && message.metadata && typeof message.metadata === 'object') {
      return message.metadata;
    }
    if (typeof message?.metadata === 'string') {
      try {
        return JSON.parse(message.metadata) || {};
      } catch (_) {
        return {};
      }
    }
    return {};
  }

  function canManageOwnSupportMessage(message) {
    if (!message || message.__pending) return false;
    if (String(message.sender_type || '').toLowerCase() !== 'support') return false;

    const meta = getMessageMeta(message);
    const senderAdminId = Number(meta.sender_admin_id || 0) || null;
    const senderAdminUsername = String(meta.sender_admin_username || '').trim().toLowerCase();
    const currentAdminUsername = String(CURRENT_ADMIN_USERNAME || '').trim().toLowerCase();

    if (senderAdminId && CURRENT_ADMIN_ID && senderAdminId !== CURRENT_ADMIN_ID) return false;
    if (!senderAdminId && senderAdminUsername && currentAdminUsername && senderAdminUsername !== currentAdminUsername) return false;

    return true;
  }

  function canEditSupportMessage(message) {
    if (!canManageOwnSupportMessage(message)) return false;
    const messageType = String(message.message_type || 'text').toLowerCase();
    return messageType === 'text';
  }

  function getSupportSenderName(message, fallbackName) {
    const preferredCurrentName = String(fallbackName || getCurrentAdminDisplayName() || DEFAULT_SUPPORT_DISPLAY_NAME).trim();
    if (preferredCurrentName && canEditSupportMessage(message)) {
      return preferredCurrentName;
    }

    const meta = getMessageMeta(message);
    const senderAdminId = Number(meta.sender_admin_id || 0) || null;
    const senderAdminUsername = String(meta.sender_admin_username || '').trim().toLowerCase();
    const currentAdminUsername = String(CURRENT_ADMIN_USERNAME || '').trim().toLowerCase();

    // If this message belongs to the currently logged-in admin, always use
    // current profile name (so renamed accounts don't keep showing old sender_name).
    if (preferredCurrentName) {
      if (senderAdminId && CURRENT_ADMIN_ID && senderAdminId === CURRENT_ADMIN_ID) {
        return preferredCurrentName;
      }
      if (!senderAdminId && senderAdminUsername && currentAdminUsername && senderAdminUsername === currentAdminUsername) {
        return preferredCurrentName;
      }
    }

    const fromPresence = getAdminDisplayNameByIdentity({
      adminId: senderAdminId,
      username: senderAdminUsername,
      fallbackName: ''
    });
    if (fromPresence) return fromPresence;

    const fromMeta = String(meta.sender_admin_full_name || meta.sender_admin_username || '').trim();
    if (fromMeta) return fromMeta;

    const fromMessage = String(message?.sender_name || '').trim();
    if (fromMessage) return fromMessage;

    return preferredCurrentName || DEFAULT_SUPPORT_DISPLAY_NAME;
  }

  function isMessageEdited(message) {
    const meta = getMessageMeta(message);
    return !!meta.edited_at;
  }

  async function loadVisualSettings() {
    const root = byId('panel-customer-care');
    if (!root) return;
    try {
      const rs = await api('/api/settings', { timeoutMs: 1200 });
      const chatCfg = rs?.data?.chat || {};
      const textColor = normalizeHexColor(chatCfg.adminChatTextColor || chatCfg.textColor || '') || '#f1f5f9';
      const chatBgColor = normalizeHexColor(chatCfg.adminChatBgColor || '') || '#111827';
      const bubbleTheirsColor = normalizeHexColor(chatCfg.adminBubbleCustomerColor || '') || chatBgColor;
      const bubbleMineColor = normalizeHexColor(chatCfg.adminBubbleAdminColor || '') || chatBgColor;
      const textTheirsColor = normalizeHexColor(chatCfg.adminTextCustomerColor || '') || textColor;
      const textMineColor = normalizeHexColor(chatCfg.adminTextAdminColor || '') || '#ffffff';
      currentChatBgPattern = String(chatCfg.adminChatBgPattern || 'solid').toLowerCase();
      currentThemePresetKey = String(chatCfg.adminChatThemeKey || '').toLowerCase();
      const textPicker = byId('ccChatTextColor');
      const textInput = byId('ccChatTextColorText');
      const bgPicker = byId('ccChatBgColor');
      const bgInput = byId('ccChatBgColorText');
      const theirsPicker = byId('ccBubbleTheirsColor');
      const theirsInput = byId('ccBubbleTheirsColorText');
      const minePicker = byId('ccBubbleMineColor');
      const mineInput = byId('ccBubbleMineColorText');
      const textTheirsPicker = byId('ccTextTheirsColor');
      const textTheirsInput = byId('ccTextTheirsColorText');
      const textMinePicker = byId('ccTextMineColor');
      const textMineInput = byId('ccTextMineColorText');
      const groupEnabledInput = byId('ccToastGroupEnabled');
      const groupWindowInput = byId('ccToastGroupWindowMs');
      const swipeDismissInput = byId('ccToastSwipeDismissEnabled');

      const groupEnabled = chatCfg.adminToastGroupEnabled !== false;
      const groupWindowMs = Math.max(0, Math.min(6000, Number(chatCfg.adminToastGroupWindowMs || 2000) || 2000));
      const swipeDismissEnabled = chatCfg.adminToastSwipeDismissEnabled !== false;
      if (textPicker) textPicker.value = textColor;
      if (textInput) textInput.value = textColor;
      if (bgPicker) bgPicker.value = chatBgColor;
      if (bgInput) bgInput.value = chatBgColor;
      if (theirsPicker) theirsPicker.value = bubbleTheirsColor;
      if (theirsInput) theirsInput.value = bubbleTheirsColor;
      if (minePicker) minePicker.value = bubbleMineColor;
      if (mineInput) mineInput.value = bubbleMineColor;
      if (textTheirsPicker) textTheirsPicker.value = textTheirsColor;
      if (textTheirsInput) textTheirsInput.value = textTheirsColor;
      if (textMinePicker) textMinePicker.value = textMineColor;
      if (textMineInput) textMineInput.value = textMineColor;
      if (groupEnabledInput) groupEnabledInput.checked = groupEnabled;
      if (groupWindowInput) groupWindowInput.value = String(groupWindowMs);
      if (swipeDismissInput) swipeDismissInput.checked = swipeDismissEnabled;
      applyChatFrameStyle(textColor, chatBgColor, bubbleTheirsColor, bubbleMineColor, currentChatBgPattern);
      setActiveThemePreset(currentThemePresetKey);
    } catch (_) {
      currentChatBgPattern = 'solid';
      currentThemePresetKey = '';
      applyChatFrameStyle('#f1f5f9', '#111827', '#111827', '#111827', currentChatBgPattern);
      setActiveThemePreset('');
    }
  }

  async function saveChatFrameStyle(options = {}) {
    const { silent = false } = options;
    const textColor = normalizeHexColor(byId('ccChatTextColorText')?.value || '') || '#f1f5f9';
    const bgColor = normalizeHexColor(byId('ccChatBgColorText')?.value || '') || '#111827';
    const bubbleTheirsColor = normalizeHexColor(byId('ccBubbleTheirsColorText')?.value || '') || bgColor;
    const bubbleMineColor = normalizeHexColor(byId('ccBubbleMineColorText')?.value || '') || bgColor;
    const textTheirsColor = normalizeHexColor(byId('ccTextTheirsColorText')?.value || '') || textColor;
    const textMineColor = normalizeHexColor(byId('ccTextMineColorText')?.value || '') || '#ffffff';
    const toastGroupEnabled = byId('ccToastGroupEnabled')?.checked !== false;
    const toastGroupWindowMs = Math.max(0, Math.min(6000, Number(byId('ccToastGroupWindowMs')?.value || 2000) || 2000));
    const toastSwipeDismissEnabled = byId('ccToastSwipeDismissEnabled')?.checked !== false;
    await api('/api/settings', {
      method: 'PUT',
      body: JSON.stringify({
        chat: {
          adminChatTextColor: textColor,
          adminChatBgColor: bgColor,
          adminBubbleCustomerColor: bubbleTheirsColor,
          adminBubbleAdminColor: bubbleMineColor,
          adminTextCustomerColor: textTheirsColor,
          adminTextAdminColor: textMineColor,
          adminChatBgPattern: currentChatBgPattern,
          adminChatThemeKey: currentThemePresetKey || '',
          adminToastGroupEnabled: toastGroupEnabled,
          adminToastGroupWindowMs: toastGroupWindowMs,
          adminToastSwipeDismissEnabled: toastSwipeDismissEnabled
        }
      })
    });
    applyChatFrameStyle(textColor, bgColor, bubbleTheirsColor, bubbleMineColor, currentChatBgPattern);
    if (!silent && typeof window.showToast === 'function') {
      window.showToast('Đã lưu màu khung chat CSKH.', 'success');
    }
    if (!silent && typeof window.showNotification === 'function') {
      window.showNotification('Thành công', 'Đã lưu màu khung chat CSKH.', 'success');
    }
  }

  function scheduleAutoSaveChatFrameStyle() {
    if (state.autoSaveStyleTimer) clearTimeout(state.autoSaveStyleTimer);
    state.autoSaveStyleTimer = setTimeout(async () => {
      try {
        await saveChatFrameStyle({ silent: true });
      } catch (_) {
        // Keep UI responsive; user can still use manual save if network is unstable.
      }
    }, 500);
  }

  function clearActiveThemePreset() {
    if (!currentThemePresetKey) return;
    setActiveThemePreset('');
  }

  function safeAttachmentUrl(raw) {
    const url = String(raw || '').trim();
    if (!url) return '';
    if (url.startsWith('/')) return safe(url);
    if (/^https?:\/\//i.test(url)) return safe(url);
    return '';
  }

  // ─── Voice player helpers ───────────────────────────────────────────────────
  function _ccVoiceSeed(url) {
    const s = String(url || '');
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function _ccVoiceBarsHtml(url, count) {
    const n = count || 26;
    let seed = _ccVoiceSeed(url);
    let html = '';
    for (let i = 0; i < n; i++) {
      seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
      const h = Math.round(5 + ((seed >>> 16) / 65535) * 22);
      html += `<span class="cc-vbar" style="height:${h}px"></span>`;
    }
    return html;
  }

  function initCcVoiceAudio(container) {
    if (!container) return;
    container.querySelectorAll('.cc-voice-player:not([data-vp-init])').forEach(player => {
      player.setAttribute('data-vp-init', '1');
      const audio = player.querySelector('audio');
      const timeEl = player.querySelector('.cc-vp-time');
      const bars = Array.from(player.querySelectorAll('.cc-vbar'));
      if (!audio) return;
      const fmt = s => { if (!s || !isFinite(s)) return '0:00'; const m = Math.floor(s / 60); return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`; };
      audio.addEventListener('loadedmetadata', () => { if (timeEl) timeEl.textContent = fmt(audio.duration); });
      audio.addEventListener('timeupdate', () => {
        if (!audio.duration || !isFinite(audio.duration)) return;
        if (timeEl) timeEl.textContent = fmt(audio.currentTime);
        const pct = audio.currentTime / audio.duration;
        const played = Math.round(pct * bars.length);
        bars.forEach((b, i) => b.classList.toggle('cc-vbar-played', i < played));
      });
      audio.addEventListener('ended', () => {
        player.classList.remove('cc-vp-playing');
        const pi = player.querySelector('.cc-vp-play-icon'); const pa = player.querySelector('.cc-vp-pause-icon');
        if (pi) pi.style.display = ''; if (pa) pa.style.display = 'none';
        if (timeEl) timeEl.textContent = fmt(audio.duration);
        bars.forEach(b => b.classList.remove('cc-vbar-played'));
      });
    });
  }
  // ───────────────────────────────────────────────────────────────────────────

  function renderAttachment(message) {
    const url = safeAttachmentUrl(message?.attachment_url);
    if (!url) return '';

    const messageType = String(message?.message_type || '').toLowerCase();
    const attachmentType = String(message?.attachment_type || '').toLowerCase();
    const fileLabel = safe((message?.message || 'Tệp đính kèm').replace(/^([🖼️📎]\s*)/, ''));
    const isImage = messageType === 'image'
      || attachmentType.includes('image')
      || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);
    const isAudio = attachmentType.includes('audio')
      || /\.(webm|ogg|mp3|wav|m4a|aac|opus)$/i.test(url);

    if (isImage) {
      return `<div class="cc-attachment"><a href="${url}" target="_blank" rel="noopener noreferrer"><img class="cc-attachment-img" src="${url}" alt="${fileLabel}" loading="lazy"></a></div>`;
    }

    if (isAudio) {
      return `<div class="cc-voice-player" data-vp-url="${url}">
        <button class="cc-vp-btn" type="button" aria-label="Phát/Dừng">
          <svg class="cc-vp-play-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 4.7l9 5.3-9 5.3V4.7z"/></svg>
          <svg class="cc-vp-pause-icon" viewBox="0 0 20 20" fill="currentColor" style="display:none"><rect x="4" y="4" width="4" height="12" rx="1"/><rect x="12" y="4" width="4" height="12" rx="1"/></svg>
        </button>
        <div class="cc-vp-wave">${_ccVoiceBarsHtml(url)}</div>
        <span class="cc-vp-time">0:00</span>
        <audio style="display:none" preload="metadata" src="${url}"></audio>
      </div>`;
    }

    return `<div class="cc-attachment"><a class="cc-attachment-file" href="${url}" target="_blank" rel="noopener noreferrer" download><span class="cc-attachment-file-icon">FILE</span><span>${fileLabel}</span></a></div>`;
  }

  function normalizeAvatarUrl(raw) {
    const url = String(raw || '').trim();
    if (!url) return '';
    if (url.startsWith('/')) return url;
    if (/^https?:\/\//i.test(url)) return url;
    return '';
  }

  function getChatAvatarHtml({ mine, customerName, supportName, customerAvatar, supportAvatar, sessionSeed }) {
    const displayName = mine ? (supportName || '') : (customerName || '');
    const rawAvatar = mine ? supportAvatar : customerAvatar;
    const avatarUrl = normalizeAvatarUrl(rawAvatar);
    const roleCls = mine ? 'mine' : 'theirs';
    const personSvg = getDefaultPersonAvatarSvg(mine ? (supportName || 'support') : (sessionSeed || customerName || 'guest'), mine ? 'support' : 'customer');
    if (avatarUrl) {
      return `<span class="cc-msg-avatar ${roleCls}"><img src="${safe(avatarUrl)}" alt="${safe(displayName)}" loading="lazy"></span>`;
    }
    return `<span class="cc-msg-avatar ${roleCls}">${personSvg}</span>`;
  }

  function applyThemePreset(kind) {
    const themeKey = String(kind || '').toLowerCase();
    const p = CHAT_THEME_PRESETS[themeKey];
    if (!p) return;
    currentChatBgPattern = p.bgPattern || 'solid';
    setActiveThemePreset(themeKey);

    const mapping = [
      ['ccChatTextColor', 'ccChatTextColorText', p.text],
      ['ccChatBgColor', 'ccChatBgColorText', p.bg],
      ['ccBubbleTheirsColor', 'ccBubbleTheirsColorText', p.theirsBg],
      ['ccBubbleMineColor', 'ccBubbleMineColorText', p.mineBg],
      ['ccTextTheirsColor', 'ccTextTheirsColorText', p.theirsText],
      ['ccTextMineColor', 'ccTextMineColorText', p.mineText]
    ];

    mapping.forEach(([pickerId, textId, value]) => {
      const picker = byId(pickerId);
      const text = byId(textId);
      if (picker) picker.value = value;
      if (text) text.value = value;
    });

    applyChatFrameStyleFromInputs();
    scheduleAutoSaveChatFrameStyle();
  }

  function isSystemAutoMessage(message) {
    const senderType = String(message?.sender_type || '').toLowerCase();
    const senderName = String(message?.sender_name || '').trim().toLowerCase();
    if (senderType === 'bot') return true;
    if (senderName === 'bot hồng ngọc' || senderName === 'bot hong ngoc') return true;
    // Hide automated welcome/system messages sent under the generic 'CS Support' name,
    // but only when there is no real admin account behind the message (no sender_admin_id
    // in metadata). Parse metadata robustly — MySQL/Sequelize may return it as a string.
    if (senderName === 'cs support') {
      let meta = message?.metadata;
      if (typeof meta === 'string') {
        try { meta = JSON.parse(meta); } catch (_) { meta = null; }
      }
      const hasAdminId = meta && Number(meta.sender_admin_id || 0) > 0;
      if (!hasAdminId) return true;
    }
    return false;
  }

  function withNoCache(url) {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}_ts=${Date.now()}`;
  }

  function updateNavbarUnreadBadge(totalUnread, highlight) {
    const badge = byId('ccNavbarUnread');
    if (!badge) return;

    const total = Number(totalUnread || 0);
    if (total > 0) {
      badge.textContent = total > 99 ? '99+' : String(total);
      badge.style.display = 'inline-block';
      if (highlight) {
        badge.classList.remove('is-alert');
        // Restart animation when new unread arrives.
        void badge.offsetWidth;
        badge.classList.add('is-alert');
      }
    } else {
      badge.textContent = '0';
      badge.style.display = 'none';
      badge.classList.remove('is-alert');
    }
  }

  function notifyIncomingMessage(increasedBy) {
    if (increasedBy <= 0) return;
    const label = increasedBy > 1
      ? `Bạn có ${increasedBy} tin nhắn CSKH mới.`
      : 'Bạn có 1 tin nhắn CSKH mới.';

    if (typeof window.showToast === 'function') {
      window.showToast(label, 'info');
      return;
    }

    if (typeof window.showNotification === 'function') {
      window.showNotification('Tin nhắn mới', label, 'info');
    }
  }

  async function api(url, options = {}) {
    const startedAt = Date.now();
    const timeoutMs = Math.max(0, Number(options.timeoutMs || 0) || 0);
    const fetchOptions = { ...options };
    delete fetchOptions.timeoutMs;

    let timeoutId = null;
    const controller = timeoutMs > 0 && typeof AbortController === 'function'
      ? new AbortController()
      : null;
    if (controller) {
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    }

    try {
      const res = await fetch(url, {
        ...fetchOptions,
        cache: 'no-store',
        signal: controller ? controller.signal : fetchOptions.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          ...(fetchOptions.headers || {})
        }
      });

      const duration = Date.now() - startedAt;
      state.avgApiLatencyMs = state.avgApiLatencyMs > 0
        ? Math.round((state.avgApiLatencyMs * 0.75) + (duration * 0.25))
        : duration;
      updatePollingProfile();
      if (duration > 1800 && (Date.now() - Number(state.slowApiWarnAt || 0)) > 30000) {
        state.slowApiWarnAt = Date.now();
        try {
          console.warn('[CSKH] API chậm', { url, duration, avgApiLatencyMs: state.avgApiLatencyMs });
        } catch (_) {}
      }

      const data = await res.json().catch(() => ({ success: false, message: 'Dữ liệu phản hồi không hợp lệ' }));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || `Request failed (${res.status})`);
      }
      return data;
    } catch (err) {
      if (err && err.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw err;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  function getSessionMeta(session) {
    let meta = {};
    if (session && session.metadata && typeof session.metadata === 'object') {
      meta = session.metadata;
    } else if (session && typeof session.metadata === 'string') {
      try {
        meta = JSON.parse(session.metadata) || {};
      } catch (_) {
        meta = {};
      }
    }

    const directGameCode = String(session?.game_session_code || session?.gameSessionCode || '').trim().toUpperCase();
    const metaGameCode = String(meta.game_session_code || meta.gameSessionCode || '').trim().toUpperCase();

    // Fallback for older rows that store game session in topic or generated email.
    const topicMatch = String(session?.topic || '').toUpperCase().match(/([A-Z0-9_-]{6,20})/);
    const emailMatch = String(session?.customer_email || '').toUpperCase().match(/^([A-Z0-9_-]{6,20})@SESSION\.LOCAL$/);
    const inferredGameCode = (topicMatch && topicMatch[1]) || (emailMatch && emailMatch[1]) || '';

    const gameSessionCode = directGameCode || metaGameCode || inferredGameCode || '--';
    const fingerprintHash = String(meta.fingerprint_hash || '').trim();
    const fingerprintShort = fingerprintHash ? `${fingerprintHash.slice(0, 8)}...` : '--';
    const createdIp = String(meta.created_ip || '').trim();
    const lastSeenIp = String(meta.last_seen_ip || '').trim();
    const customerIp = String(session?.customer_ip || lastSeenIp || createdIp || '').trim() || '--';
    const userAgent = String(meta.last_seen_user_agent || meta.user_agent || '').trim() || '--';
    const expiresAtRaw = meta.expires_at || null;
    const sessionCode = String(session?.session_code || '').trim();
    const sessionCodeShort = sessionCode ? sessionCode.slice(-8) : '--';
    const customerNickname = String(meta.customer_nickname || '').trim();
    const customerAvatarUrl = normalizeAvatarUrl(meta.customer_avatar_url || meta.customerAvatarUrl || session?.customer_avatar_url || '');
    const supportAvatarUrl = normalizeAvatarUrl(meta.support_avatar_url || meta.supportAvatarUrl || '');
    const activeAdminName = String(meta.active_admin_name || '').trim();
    const activeAdminUsername = String(meta.active_admin_username || '').trim();
    const activeAdminAtRaw = meta.active_admin_at || null;
    return {
      gameSessionCode,
      adminNote: meta.admin_note || '',
      fingerprintHash,
      fingerprintShort,
      customerIp,
      userAgent,
      expiresAtRaw,
      sessionCodeShort,
      customerNickname,
      customerAvatarUrl,
      supportAvatarUrl,
      activeAdminName,
      activeAdminUsername,
      activeAdminAtRaw
    };
  }

  function normalizeDateKey(raw) {
    const d = new Date(raw || 0);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function normalizeMonthKey(raw) {
    const d = new Date(raw || 0);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  function getAdvancedFilters() {
    return {
      ip: String(byId('ccIpFilter')?.value || '').trim().toLowerCase(),
      gameSession: String(byId('ccGameSessionFilter')?.value || '').trim().toUpperCase(),
      day: String(byId('ccDateFilter')?.value || '').trim(),
      month: String(byId('ccMonthFilter')?.value || '').trim()
    };
  }

  function applyAdvancedSessionFilters(list) {
    const rows = Array.isArray(list) ? list : [];
    const f = getAdvancedFilters();
    if (!f.ip && !f.gameSession && !f.day && !f.month) return rows;

    return rows.filter((s) => {
      const meta = getSessionMeta(s);
      const ipOk = !f.ip || String(meta.customerIp || '').toLowerCase().includes(f.ip);
      const gameOk = !f.gameSession || String(meta.gameSessionCode || '').toUpperCase().includes(f.gameSession);
      const sessionDateRaw = s?.updated_at || s?.created_at || null;
      const dayOk = !f.day || normalizeDateKey(sessionDateRaw) === f.day;
      const monthOk = !f.month || normalizeMonthKey(sessionDateRaw) === f.month;
      return ipOk && gameOk && dayOk && monthOk;
    });
  }

  function fmtDateTime(raw) {
    const d = new Date(raw || Date.now());
    if (Number.isNaN(d.getTime())) return '--';
    return d.toLocaleString('vi-VN');
  }

  function mapStatusLabel(status) {
    if (status === 'closed') return 'Đã đóng';
    if (status === 'waiting') return 'Đang chờ';
    if (status === 'archived') return 'Lưu trữ';
    return 'Đang hoạt động';
  }

  function getEffectiveSessionStatus(session) {
    if (!session || typeof session !== 'object') return 'active';

    const rawStatus = String(session.status || '').toLowerCase();
    if (rawStatus === 'closed' || rawStatus === 'archived') return rawStatus;

    const unread = Number(session.unread_count || 0);
    if (Number.isFinite(unread) && unread > 0) return 'waiting';

    if (rawStatus === 'waiting' || rawStatus === 'active') return rawStatus;
    return 'active';
  }

  function applyStatusClass(el, status) {
    if (!el) return;
    el.classList.remove('status-active', 'status-waiting', 'status-closed', 'status-archived');
    const cls = {
      active: 'status-active',
      waiting: 'status-waiting',
      closed: 'status-closed',
      archived: 'status-archived'
    }[String(status || 'active')] || 'status-active';
    el.classList.add(cls);
  }

  function hashSessionCode(input) {
    const text = String(input || '');
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function getAvatarGradientBySessionCode(sessionCode) {
    const gradients = [
      'linear-gradient(135deg, #0284c7, #0ea5e9, #22d3ee)',
      'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
      'linear-gradient(135deg, #059669, #10b981, #22c55e)',
      'linear-gradient(135deg, #ea580c, #f97316, #fb7185)',
      'linear-gradient(135deg, #334155, #475569, #0f172a)',
      'linear-gradient(135deg, #2563eb, #6366f1, #8b5cf6)'
    ];
    const idx = hashSessionCode(sessionCode) % gradients.length;
    return gradients[idx];
  }

  function getConversationPreviewText(session) {
    const latestTextRaw = String(session?.last_message_text || '').trim();
    const latestSenderType = String(session?.last_message_sender_type || '').toLowerCase();
    const latestMessageType = String(session?.last_message_type || '').toLowerCase();
    const fallbackContact = String(session?.customer_phone || session?.customer_email || '').trim();

    const messageText = latestTextRaw || (latestMessageType === 'image'
      ? '[Hình ảnh]'
      : (latestMessageType === 'file' ? '[Tệp đính kèm]' : ''));

    if (messageText) {
      if (latestSenderType === 'support') {
        return `🧑‍💼 Bạn: ${messageText}`;
      }
      if (latestSenderType === 'player' || latestSenderType === 'customer') {
        return `👤 ${messageText}`;
      }
      return `💬 ${messageText}`;
    }

    return fallbackContact || 'Chưa có tin nhắn';
  }

  function getDefaultPersonAvatarSvg(seed = '', role = 'customer') {
    const customerVariants = [
      '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4.2"></circle><path d="M4.5 20c0-4.2 3.4-7 7.5-7s7.5 2.8 7.5 7"></path></svg>',
      '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.6" r="4"></circle><path d="M4.4 20c0-3.9 3.3-6.8 7.6-6.8s7.6 2.9 7.6 6.8"></path><path d="M8.4 5.6h7.2" opacity=".72"></path></svg>',
      '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4.7 20c0-4 3.3-6.9 7.3-6.9s7.3 2.9 7.3 6.9"></path><circle cx="9.6" cy="8" r="0.7" opacity=".76"></circle><circle cx="14.4" cy="8" r="0.7" opacity=".76"></circle></svg>',
      '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.1" r="4.1"></circle><path d="M4.3 20c0-4.1 3.5-7 7.7-7s7.7 2.9 7.7 7"></path><path d="M7.4 6.3c1.4-1.3 3-1.9 4.6-1.9s3.2.6 4.6 1.9" opacity=".74"></path></svg>',
      '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.9"></circle><path d="M4.1 20c0-4.3 3.6-7.1 7.9-7.1s7.9 2.8 7.9 7.1"></path><path d="M10.2 6.2h3.6" opacity=".75"></path><path d="M8.8 9.2h6.4" opacity=".56"></path></svg>',
      '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4.2"></circle><path d="M4.6 20c0-4 3.5-6.8 7.4-6.8s7.4 2.8 7.4 6.8"></path><path d="M6.6 18.2h10.8" opacity=".58"></path></svg>'
    ];
    const supportVariant = '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4.4 20c0-4 3.5-6.9 7.6-6.9s7.6 2.9 7.6 6.9"></path><path d="M8.5 5.9h7" opacity=".7"></path></svg>';

    if (String(role || '').toLowerCase() === 'support') return supportVariant;
    const idx = hashSessionCode(String(seed || 'guest')) % customerVariants.length;
    return customerVariants[idx];
  }

  function showInlineFeedback(message, type = 'info') {
    const text = String(message || '').trim();
    if (!text) return;
    if (typeof window.showToast === 'function') {
      window.showToast(text, type);
      return;
    }
    if (typeof window.showNotification === 'function') {
      window.showNotification(type === 'error' ? 'Lỗi' : 'Thông báo', text, type);
      return;
    }
    if (type === 'error') alert(text);
  }

  function getSessionByCode(sessionCode) {
    return state.sessions.find((s) => s.session_code === sessionCode) || null;
  }

  function getSessionPriority(session) {
    const rawMeta = session && session.metadata;
    let meta = {};
    if (rawMeta && typeof rawMeta === 'object') {
      meta = rawMeta;
    } else if (typeof rawMeta === 'string') {
      try {
        meta = JSON.parse(rawMeta) || {};
      } catch (_) {
        meta = {};
      }
    }
    return String(meta.priority || 'normal').toLowerCase() === 'high' ? 'high' : 'normal';
  }

  function openGameSessionByCode(sessionCode) {
    const current = getSessionByCode(sessionCode);
    if (!current) return;
    const meta = getSessionMeta(current);
    const gameCode = meta.gameSessionCode;
    if (!gameCode || gameCode === '--') {
      showInlineFeedback('Khách hàng chưa gắn mã phiên chơi.', 'warning');
      return;
    }
    window.open(`/lucky-mystery-box?code=${encodeURIComponent(gameCode)}`, '_blank');
  }

  async function runConversationMenuAction(action, sessionCode) {
    const code = String(sessionCode || '').trim();
    if (!code) return;
    const currentSession = getSessionByCode(code);
    const isPriorityHigh = getSessionPriority(currentSession) === 'high';

    if (action === 'open-chat') {
      await selectSession(code);
      return;
    }

    if (action === 'open-game-session') {
      openGameSessionByCode(code);
      return;
    }

    if (action === 'quick-note') {
      const currentMeta = getSessionMeta(currentSession || {});
      const note = window.prompt('Ghi chú nội bộ cho khách hàng:', currentMeta.adminNote || '');
      if (note === null) return;
      await api(`/api/chat/admin/chat/${encodeURIComponent(code)}/note`, {
        method: 'PUT',
        body: JSON.stringify({ note: String(note).trim() })
      });
      if (code === state.selectedSessionCode) {
        byId('ccAdminNote').value = String(note).trim();
        renderDetails();
      }
      showInlineFeedback('Đã lưu ghi chú nội bộ.', 'success');
      await loadSessions();
      return;
    }

    if (action === 'mark-read') {
      await api(`/api/chat/admin/chat/${encodeURIComponent(code)}/mark-read`, { method: 'PUT' });
      if (code === state.selectedSessionCode) {
        await loadMessages(code, { forceImmediate: true });
      }
      await loadSessions();
      showInlineFeedback('Đã đánh dấu đã đọc.', 'success');
      return;
    }

    if (action === 'toggle-priority') {
      const nextPriority = isPriorityHigh ? 'normal' : 'high';
      await api(`/api/chat/admin/chat/${encodeURIComponent(code)}/priority`, {
        method: 'PUT',
        body: JSON.stringify({ priority: nextPriority })
      });
      if (code === state.selectedSessionCode) {
        byId('ccPriorityBtn')?.classList.toggle('priority-high', nextPriority === 'high');
      }
      await loadSessions();
      showInlineFeedback(nextPriority === 'high' ? 'Đã bật ưu tiên hội thoại.' : 'Đã tắt ưu tiên hội thoại.', 'success');
      return;
    }

    if (action === 'mark-resolved') {
      await api(`/api/chat/admin/chat/${encodeURIComponent(code)}/mark-resolved`, { method: 'PUT' });
      await loadSessions();
      if (code === state.selectedSessionCode) {
        await loadMessages(code, { forceImmediate: true });
        renderDetails();
      }
      showInlineFeedback('Đã đóng hội thoại.', 'success');
      return;
    }

    if (action === 'archive') {
      await api(`/api/chat/admin/chat/${encodeURIComponent(code)}/archive`, { method: 'PUT' });
      await loadSessions();
      if (code === state.selectedSessionCode) renderDetails();
      showInlineFeedback('Đã lưu trữ hội thoại.', 'success');
      return;
    }

    if (action === 'delete') {
      if (!confirm('Xóa hội thoại này? Hành động này không thể hoàn tác.')) return;
      await api(`/api/chat/admin/chat/${encodeURIComponent(code)}`, { method: 'DELETE' });
      if (code === state.selectedSessionCode) {
        state.selectedSessionCode = '';
        renderMessages();
        renderDetails();
      }
      await loadSessions();
      showInlineFeedback('Đã xóa hội thoại.', 'success');
    }
  }

  function renderSessionList() {
    const root = byId('ccConversationList');
    if (!root) return;
    const prevScrollTop = root.scrollTop;

    if (!state.filteredSessions.length) {
      root.innerHTML = '<div class="cc-conv-sub" style="padding:12px;">Chưa có cuộc hội thoại</div>';
      return;
    }

    // ── Group sessions by customer_ip ─────────────────────────────────────
    // Sessions whose IP is blank/unknown are treated individually.
    const ipMap   = new Map();   // ip → [sessions]
    const singles = [];          // sessions that don't belong to a multi-session IP

    for (const s of state.filteredSessions) {
      const ip = String(s.customer_ip || '').trim();
      if (!ip || ip === 'unknown') {
        singles.push(s);
        continue;
      }
      if (!ipMap.has(ip)) ipMap.set(ip, []);
      ipMap.get(ip).push(s);
    }

    // Flatten: groups with >1 session become a collapsible group; single → normal item.
    const segments = [];
    for (const s of state.filteredSessions) {
      const ip = String(s.customer_ip || '').trim();
      if (!ip || ip === 'unknown') {
        segments.push({ type: 'single', session: s });
        continue;
      }
      const group = ipMap.get(ip);
      if (group.length === 1) {
        segments.push({ type: 'single', session: s });
      } else if (!segments.some((seg) => seg.type === 'group' && seg.ip === ip)) {
        segments.push({ type: 'group', ip, sessions: group });
      }
    }

    // ── Render each segment ───────────────────────────────────────────────
    function buildConvItem(s) {
      const active      = s.session_code === state.selectedSessionCode ? 'active' : '';
      const pulse       = Number(state.recentBumpedSessions[s.session_code] || 0) > Date.now() ? 'is-updated' : '';
      const loading     = state.sessionSwitchInFlight && s.session_code === state.selectedSessionCode ? 'is-loading' : '';
      const customerDisplayName = getDisplayCustomerName(s);
      const unread      = Number(s.unread_count || 0);
      const meta        = getSessionMeta(s);
      const effectiveStatus = getEffectiveSessionStatus(s);
      const statusCls   = { active: 'status-active', waiting: 'status-waiting', closed: 'status-closed', archived: 'status-archived' }[effectiveStatus] || 'status-active';
      const statusLabel = { active: 'Đang hoạt động', waiting: 'Đang chờ', closed: 'Đã đóng', archived: 'Lưu trữ' }[effectiveStatus] || 'Đang hoạt động';
      const activeAdminLabel = meta.activeAdminName ? `👨‍💼 ${safe(meta.activeAdminName)}` : '';
      const isTyping    = state.typingSessionCodes.has(s.session_code);
      const previewRaw  = isTyping ? '💬 Đang nhập...' : getConversationPreviewText(s);
      const subInfo     = safe(previewRaw);
      const unreadCls   = unread > 0 ? 'is-unread' : '';
      const itemUnreadCls = unread > 0 ? 'has-unread' : '';
      const timeStateCls = unread > 0 ? 'is-unread' : 'is-read';
      const typingPreviewCls = isTyping ? 'is-typing' : '';
      const isMenuOpen  = state.openConversationMenuCode === s.session_code;
      const priority    = getSessionPriority(s);
      const priorityLabel = priority === 'high' ? 'Bỏ ưu tiên cao' : 'Ghim ưu tiên cao';
      return `
        <div class="cc-conv-item ${active} ${pulse} ${loading} ${itemUnreadCls}" data-code="${safe(s.session_code)}">
          <div class="cc-avatar-wrap">
            <div class="cc-avatar">${getDefaultPersonAvatarSvg(s.session_code, 'customer')}</div>
            <span class="cc-status-dot ${statusCls}" title="${statusLabel}"></span>
            <span class="cc-status-pill ${statusCls}">${statusLabel}</span>
          </div>
          <div class="cc-conv-body">
            <div class="cc-conv-menu-wrap ${isMenuOpen ? 'show' : ''}">
              <button class="cc-conv-menu-btn" data-action="toggle-conv-menu" data-code="${safe(s.session_code)}" type="button" aria-label="Mở công cụ quản lý" title="Công cụ quản lý">⋯</button>
              <div class="cc-conv-menu" role="menu">
                <button class="cc-conv-menu-item" data-action="open-chat" data-code="${safe(s.session_code)}" type="button">Mở hội thoại</button>
                <button class="cc-conv-menu-item" data-action="open-game-session" data-code="${safe(s.session_code)}" type="button">Mở phiên game</button>
                <button class="cc-conv-menu-item" data-action="quick-note" data-code="${safe(s.session_code)}" type="button">Ghi chú nhanh</button>
                <button class="cc-conv-menu-item" data-action="mark-read" data-code="${safe(s.session_code)}" type="button">Đánh dấu đã đọc</button>
                <button class="cc-conv-menu-item" data-action="toggle-priority" data-code="${safe(s.session_code)}" type="button">${priorityLabel}</button>
                <button class="cc-conv-menu-item" data-action="mark-resolved" data-code="${safe(s.session_code)}" type="button">Đóng hội thoại</button>
                <button class="cc-conv-menu-item" data-action="archive" data-code="${safe(s.session_code)}" type="button">Lưu trữ</button>
                <button class="cc-conv-menu-item danger" data-action="delete" data-code="${safe(s.session_code)}" type="button">Xóa hội thoại</button>
              </div>
            </div>
            <div class="cc-conv-row1">
              <span class="cc-conv-name">${safe(customerDisplayName || 'Khách hàng')}</span>
              <span class="cc-conv-time ${timeStateCls}">· ${fmtTime(s.updated_at || s.created_at)}</span>
            </div>
            <div class="cc-conv-row2">
              <span class="cc-conv-sub cc-conv-preview ${unreadCls} ${typingPreviewCls}">${subInfo || '<span class="cc-conv-sub-muted">Chưa có tin nhắn</span>'}</span>
              <span class="cc-conv-right-meta">${isTyping ? '<span class="cc-typing-pill">typing<span class="dots"></span></span>' : ''}${unread > 0 ? `<span class="cc-badge">${unread}</span>` : ''}</span>
            </div>
            ${activeAdminLabel ? `<div class="cc-conv-sub" style="margin-top:4px;color:#60a5fa;font-size:11px;">${activeAdminLabel}</div>` : ''}
            ${(meta.gameSessionCode && meta.gameSessionCode !== '--') || (meta.sessionCodeShort && meta.sessionCodeShort !== '--') ? `
            <div class="cc-tags">
              ${meta.gameSessionCode && meta.gameSessionCode !== '--' ? `<span class="cc-tag cc-tag-game"><i class="fas fa-gamepad"></i> ${safe(meta.gameSessionCode)}</span>` : ''}
              ${meta.sessionCodeShort && meta.sessionCodeShort !== '--' ? `<span class="cc-tag cc-tag-code">#${safe(meta.sessionCodeShort)}</span>` : ''}
            </div>` : ''}
          </div>
        </div>
      `;
    }

    function buildIpGroup(ip, sessions) {
      const isOpen     = state.expandedIpGroups.has(ip);
      const totalUnread = sessions.reduce((n, s) => n + Number(s.unread_count || 0), 0);
      const hasActive  = sessions.some((s) => s.session_code === state.selectedSessionCode);
      const groupCls   = [
        'cc-ip-group',
        isOpen   ? 'is-open'   : '',
        hasActive ? 'has-active' : '',
      ].filter(Boolean).join(' ');

      const ipShort = ip.length > 16 ? ip.slice(0, 14) + '…' : ip;
      const unreadPill = totalUnread > 0
        ? `<span class="cc-badge cc-ip-group-badge">${totalUnread}</span>`
        : '';
      const spamWarning = sessions.length >= 3
        ? `<span class="cc-ip-spam-warning" title="Nhiều phiên từ cùng 1 IP — có thể là spam">⚠️</span>`
        : '';

      const innerHtml = isOpen
        ? `<div class="cc-ip-group-sessions">${sessions.map(buildConvItem).join('')}</div>`
        : '';

      return `
        <div class="${groupCls}" data-ip-group="${safe(ip)}">
          <div class="cc-ip-group-header" data-action="toggle-ip-group" data-ip="${safe(ip)}">
            <span class="cc-ip-group-chevron">${isOpen ? '▾' : '▸'}</span>
            <span class="cc-ip-group-icon">🌐</span>
            <span class="cc-ip-group-label" title="${safe(ip)}">${safe(ipShort)}</span>
            <span class="cc-ip-group-count">${sessions.length} phiên</span>
            ${spamWarning}
            ${unreadPill}
          </div>
          ${innerHtml}
        </div>
      `;
    }

    root.innerHTML = segments.map((seg) =>
      seg.type === 'group'
        ? buildIpGroup(seg.ip, seg.sessions)
        : buildConvItem(seg.session)
    ).join('');

    root.scrollTop = prevScrollTop;
  }

  function renderMessages(options = {}) {
    const box = byId('ccMessages');
    if (!box) return;
    const forceScrollBottom = !!options.forceScrollBottom;
    const prevScrollTop = box.scrollTop;
    const prevScrollHeight = box.scrollHeight;
    const wasNearBottom = (prevScrollHeight - (prevScrollTop + box.clientHeight)) <= 80;

    if (!state.selectedSessionCode) {
      box.innerHTML = '<div class="cc-msg-time">Chọn một cuộc hội thoại để bắt đầu hỗ trợ.</div>';
      return;
    }

    // state.messages is already pre-filtered by loadMessages (isSystemAutoMessage applied at
    // fetch time). Using it directly avoids a second parse of metadata in the hot render path.
    const visibleMessages = state.messages;
    const mobileLimit = 120;
    const isTruncated = isMobileChatUi() && visibleMessages.length > mobileLimit;
    const renderableMessages = isTruncated ? visibleMessages.slice(-mobileLimit) : visibleMessages;

    if (!renderableMessages.length) {
      box.innerHTML = '<div class="cc-msg-time">Chưa có tin nhắn.</div>';
      return;
    }

    // Progressive render for large histories to avoid blocking mobile/main thread.
    if (renderableMessages.length > 80 && !options.forceImmediate) {
      const current = state.sessions.find((s) => s.session_code === state.selectedSessionCode);
      box.innerHTML = isTruncated
        ? `<div class="cc-msg-time">Đang hiển thị ${mobileLimit} tin nhắn gần nhất để tối ưu tốc độ trên mobile.</div>`
        : '';

      const queue = renderableMessages.slice();
      const chunkSize = 18;
      const nearBottom = wasNearBottom || forceScrollBottom;

      const pump = () => {
        const chunk = queue.splice(0, chunkSize);
        if (!chunk.length) {
          if (nearBottom) {
            const behavior = isMobileChatUi() ? 'auto' : 'smooth';
            box.scrollTo({ top: box.scrollHeight, behavior });
          }
          return;
        }

        const html = chunk.map((m) => buildSingleMessageRowHtml(m, current, false)).join('');
        box.insertAdjacentHTML('beforeend', html);
        initCcVoiceAudio(box);
        requestAnimationFrame(pump);
      };

      requestAnimationFrame(pump);
      return;
    }

    const current = state.sessions.find((s) => s.session_code === state.selectedSessionCode);
    const meta = getSessionMeta(current || {});
    const customerDisplayName = getDisplayCustomerName(current || {}) || 'Khách hàng';
    const supportDisplayName = getCurrentAdminDisplayName();
    const customerAvatar = meta?.customerAvatarUrl || '';
    const supportAvatar = meta?.supportAvatarUrl || '';
    const lastRenderedTs = Number(state.lastRenderedMessageTs[state.selectedSessionCode] || 0);
    const allowFreshAnimation = lastRenderedTs > 0;
    let maxRenderedTs = lastRenderedTs;

    const renderedHtml = renderableMessages.map((m) => {
      const msgTs = messageTimestamp(m);
      if (msgTs > maxRenderedTs) maxRenderedTs = msgTs;
      const isFreshMessage = allowFreshAnimation && msgTs > lastRenderedTs;
      return renderMessageRowHtml(m, {
        currentSession: current,
        customerDisplayName,
        supportDisplayName,
        customerAvatar,
        supportAvatar,
        isFreshMessage,
        sessionCode: state.selectedSessionCode
      });
    }).join('');

    box.innerHTML = isTruncated
      ? `<div class="cc-msg-time">Đang hiển thị ${mobileLimit} tin nhắn gần nhất để tối ưu tốc độ trên mobile.</div>${renderedHtml}`
      : renderedHtml;
    initCcVoiceAudio(box);

    if (maxRenderedTs > 0) {
      state.lastRenderedMessageTs[state.selectedSessionCode] = maxRenderedTs;
    }

    if (forceScrollBottom || wasNearBottom) {
      const behavior = isMobileChatUi() ? 'auto' : 'smooth';
      box.scrollTo({ top: box.scrollHeight, behavior });
      return;
    }

    const heightDiff = box.scrollHeight - prevScrollHeight;
    box.scrollTop = Math.max(0, prevScrollTop + heightDiff);
  }

  function renderMessageRowHtml(message, options = {}) {
    const mine = message.sender_type === 'support';
    const rowCls = mine ? 'cc-msg-row mine' : 'cc-msg-row';
    const bubbleCls = mine ? 'cc-bubble mine' : 'cc-bubble theirs';
    const attachment = renderAttachment(message);
    const isFreshMessage = !!options.isFreshMessage;
    const sessionCode = String(options.sessionCode || state.selectedSessionCode || '');
    const isEditing = canEditSupportMessage(message)
      && sessionCode
      && state.editingMessageId !== null
      && String(state.editingMessageId) === String(message.id)
      && sessionCode === state.selectedSessionCode;
    const canEdit = canEditSupportMessage(message);
    const canDelete = canManageOwnSupportMessage(message);
    const isDeleteConfirming = canDelete
      && state.deleteConfirmMessageId !== null
      && String(state.deleteConfirmMessageId) === String(message.id)
      && sessionCode === state.selectedSessionCode;

    const avatarHtml = getChatAvatarHtml({
      mine,
      customerName: options.customerDisplayName || 'Khách hàng',
      supportName: mine ? getSupportSenderName(message, options.supportDisplayName) : (options.supportDisplayName || DEFAULT_SUPPORT_DISPLAY_NAME),
      customerAvatar: options.customerAvatar || '',
      supportAvatar: options.supportAvatar || '',
      sessionSeed: sessionCode
    });

    const sessionSeenAt = Number(state.seenSessionAt[sessionCode] || 0);
    const isSeen = mine && (
      message.is_read
      || message.read_at
      || message.seen_at
      || message.customer_read_at
      || (sessionSeenAt > 0 && messageTimestamp(message) > 0 && messageTimestamp(message) <= sessionSeenAt)
    );

    const statusBadge = mine
      ? `<span class="cc-msg-status ${message.__pending ? 'pending' : (isSeen ? 'seen' : 'sent')}"><svg class="cc-msg-status-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.2 8.4 5.8 12l8-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>${isSeen && !message.__pending ? '<path d="M6 8.4 9.6 12l4.2-4.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>' : ''}</svg><span>${message.__pending ? 'Đang gửi...' : (isSeen ? 'Đã xem' : 'Đã gửi')}</span></span>`
      : '';

    const editedFlag = isMessageEdited(message) ? '<span class="cc-msg-edited">(đã chỉnh sửa)</span>' : '';
    const bubbleContent = isEditing
      ? `<div class="cc-msg-edit-shell">
          <div class="cc-msg-edit-head">
            <span class="cc-msg-edit-badge">Đang sửa bằng rich text</span>
            <span class="cc-msg-edit-shortcut">Chọn chữ để hiện toolbar nổi • Ctrl/Cmd + Enter để lưu</span>
          </div>
          <div class="cc-msg-edit-input" contenteditable="true" data-edit-message-id="${safe(message.id)}" data-placeholder="Chỉnh sửa nội dung tin nhắn..."></div>
          <div class="cc-msg-edit-actions">
            <button type="button" class="cc-msg-edit-btn cancel" data-action="cancel-edit-message">Hủy</button>
            <button type="button" class="cc-msg-edit-btn save" data-action="save-edit-message" data-message-id="${safe(message.id)}">Lưu thay đổi</button>
          </div>
        </div>`
      : `${renderMessageBody(message.message || '')}${attachment}`;

    const editAction = (mine && canEdit && !isEditing)
      ? `<button type="button" class="cc-msg-edit-link" data-action="start-edit-message" data-message-id="${safe(message.id)}">Sửa</button>`
      : '';
    const deleteAction = (mine && canDelete && !isEditing)
      ? `<button type="button" class="cc-msg-edit-link danger" data-action="request-delete-message" data-message-id="${safe(message.id)}">Xóa</button>`
      : '';
    const deleteConfirm = isDeleteConfirming
      ? `<span class="cc-msg-delete-confirm"><span class="cc-msg-delete-confirm-text">Xác nhận xóa?</span><button type="button" class="cc-msg-edit-link danger" data-action="confirm-delete-message" data-message-id="${safe(message.id)}">Xóa</button><button type="button" class="cc-msg-edit-link" data-action="cancel-delete-message">Hủy</button></span>`
      : '';

    const supportSenderName = mine ? getSupportSenderName(message, options.supportDisplayName) : '';

    return `
      <div class="${rowCls}${isFreshMessage ? ' is-fresh' : ''}${message.__pending ? ' pending' : ''}" data-message-id="${safe(message.id || '')}">
        <div class="cc-msg-row-content"><span class="cc-msg-avatar-wrap${isFreshMessage ? ' is-fresh' : ''}">${avatarHtml}</span><div class="${bubbleCls}">${bubbleContent}</div></div>
        <div class="cc-msg-time">${fmtTime(message.created_at)} ${mine ? ('• ' + safe(supportSenderName)) : ''}${editedFlag}${statusBadge}${editAction}${deleteAction}${deleteConfirm}</div>
      </div>
    `;
  }

  function requestDeleteSupportMessage(messageId) {
    const target = state.messages.find((m) => String(m.id) === String(messageId));
    if (!target || !canManageOwnSupportMessage(target)) return;
    state.deleteConfirmMessageId = target.id;
    renderMessages({ forceImmediate: true });
  }

  async function deleteSupportMessage(messageId) {
    if (!state.selectedSessionCode) return;
    const target = state.messages.find((m) => String(m.id) === String(messageId));
    if (!target || !canManageOwnSupportMessage(target)) return;

    await api(`/api/chat/admin/chat/${encodeURIComponent(state.selectedSessionCode)}/messages/${encodeURIComponent(String(messageId))}`, {
      method: 'DELETE'
    });

    state.messages = state.messages.filter((m) => String(m.id) !== String(messageId));
    if (state.editingMessageId !== null && String(state.editingMessageId) === String(messageId)) {
      detachCurrentEditMessageEditor();
      state.editingMessageId = null;
      state.editingDraftText = '';
    }
    if (state.deleteConfirmMessageId !== null && String(state.deleteConfirmMessageId) === String(messageId)) {
      state.deleteConfirmMessageId = null;
    }
    renderMessages({ forceImmediate: true });
    queueSessionRefresh();
  }

  function buildSingleMessageRowHtml(message, currentSession, isFreshMessage) {
    const meta = getSessionMeta(currentSession || {});
    const customerDisplayName = getDisplayCustomerName(currentSession || {}) || 'Khách hàng';
    const supportDisplayName = getCurrentAdminDisplayName();
    const customerAvatar = meta?.customerAvatarUrl || '';
    const supportAvatar = meta?.supportAvatarUrl || '';
    return renderMessageRowHtml(message, {
      currentSession,
      customerDisplayName,
      supportDisplayName,
      customerAvatar,
      supportAvatar,
      isFreshMessage,
      sessionCode: state.selectedSessionCode
    });
  }

  function detachCurrentEditMessageEditor() {
    if (window.CcTiptap && typeof window.CcTiptap.unbindEditable === 'function' && state.editingEditorNode) {
      window.CcTiptap.unbindEditable(state.editingEditorNode);
    }
    state.editingEditorNode = null;
  }

  function attachCurrentEditMessageEditor(messageId) {
    if (!window.CcTiptap || typeof window.CcTiptap.bindEditable !== 'function') return;
    const editor = document.querySelector(`#ccMessages [contenteditable][data-edit-message-id="${escapeCssSelectorValue(String(messageId || ''))}"]`);
    if (!editor) return;

    detachCurrentEditMessageEditor();
    state.editingEditorNode = editor;
    window.CcTiptap.bindEditable(editor, {
      submitOnEnter: false,
      onInput: (activeEditor) => {
        state.editingDraftText = String(activeEditor?.innerHTML || '');
      }
    });
    if (typeof window.CcTiptap.setHTML === 'function') {
      window.CcTiptap.setHTML(state.editingDraftText, editor);
    } else {
      editor.innerHTML = state.editingDraftText;
    }
    if (typeof window.CcTiptap.focus === 'function') {
      window.CcTiptap.focus(editor, { atEnd: true });
    } else {
      editor.focus();
    }
    if (typeof window.CcTiptap.setActiveEditor === 'function') {
      window.CcTiptap.setActiveEditor(editor);
    }
  }

  function startEditMessage(messageId) {
    const target = state.messages.find((m) => String(m.id) === String(messageId));
    if (!target || !canEditSupportMessage(target)) return;
    detachCurrentEditMessageEditor();
    state.editingMessageId = target.id;
    // Preserve full HTML so formatting is maintained in the contenteditable editor
    state.editingDraftText = String(target.message || '');
    state.deleteConfirmMessageId = null;
    renderMessages({ forceImmediate: true });
    requestAnimationFrame(() => {
      attachCurrentEditMessageEditor(target.id);
    });
  }

  function cancelEditMessage() {
    detachCurrentEditMessageEditor();
    state.editingMessageId = null;
    state.editingDraftText = '';
    renderMessages({ forceImmediate: true });
  }

  async function saveEditedMessage(messageId, nextHtml) {
    if (!state.selectedSessionCode) return;
    const target = state.messages.find((m) => String(m.id) === String(messageId));
    if (!target || !canEditSupportMessage(target)) return;

    // Sanitize the HTML before sending / comparing
    const sanitized = renderMessageBody(nextHtml);

    // Extract plain text for empty-check and change-check
    const tmpCheck = document.createElement('div');
    tmpCheck.innerHTML = sanitized;
    const plainText = (tmpCheck.innerText || tmpCheck.textContent || '').trim();
    if (!plainText) {
      alert('Nội dung tin nhắn không được để trống.');
      return;
    }

    // Avoid re-saving identical content (compare sanitized HTML, not plain text — formatting-only changes must be saved)
    if (sanitized === renderMessageBody(target.message || '')) {
      cancelEditMessage();
      return;
    }

    const rs = await api(`/api/chat/admin/chat/${encodeURIComponent(state.selectedSessionCode)}/messages/${encodeURIComponent(String(target.id))}`, {
      method: 'PUT',
      body: JSON.stringify({ message: sanitized })
    });

    const updated = rs?.data || null;
    if (updated) {
      const index = state.messages.findIndex((m) => String(m.id) === String(target.id));
      if (index >= 0) {
        state.messages[index] = { ...state.messages[index], ...updated };
      }
    }

    detachCurrentEditMessageEditor();
    state.editingMessageId = null;
    state.editingDraftText = '';
    renderMessages({ forceImmediate: true });
    queueSessionRefresh();
  }

  function flushMessageAppendQueue() {
    if (!state.selectedSessionCode) {
      state.messageAppendQueue.length = 0;
      state.messageAppendRaf = 0;
      return;
    }

    const box = byId('ccMessages');
    if (!box) {
      state.messageAppendQueue.length = 0;
      state.messageAppendRaf = 0;
      return;
    }

    const current = state.sessions.find((s) => s.session_code === state.selectedSessionCode);
    const nearBottom = getCurrentNearBottom();
    const chunkSize = 8;
    // Drop any queued items that were enqueued for a session the admin has since
    // navigated away from — they must not bleed into the current session's view.
    const currentCode = state.selectedSessionCode;
    while (state.messageAppendQueue.length > 0 && state.messageAppendQueue[0].__sessionCode !== currentCode) {
      state.messageAppendQueue.shift();
    }

    const chunk = state.messageAppendQueue.splice(0, chunkSize);
    if (!chunk.length) {
      state.messageAppendRaf = 0;
      return;
    }

    let html = '';
    chunk.forEach((m) => {
      state.messages.push(m);
      html += buildSingleMessageRowHtml(m, current, true);
      const ts = messageTimestamp(m);
      if (ts > 0) {
        const prev = Number(state.lastRenderedMessageTs[state.selectedSessionCode] || 0);
        state.lastRenderedMessageTs[state.selectedSessionCode] = Math.max(prev, ts);
      }
    });

    // Remove placeholder text once first message chunk arrives.
    if (box.children.length === 1 && /Chưa có tin nhắn|Chọn một cuộc hội thoại/.test(box.textContent || '')) {
      box.innerHTML = '';
    }

    box.insertAdjacentHTML('beforeend', html);
    initCcVoiceAudio(box);
    if (nearBottom) {
      const behavior = isMobileChatUi() ? 'auto' : 'smooth';
      box.scrollTo({ top: box.scrollHeight, behavior });
    }

    if (state.messageAppendQueue.length > 0) {
      state.messageAppendRaf = requestAnimationFrame(flushMessageAppendQueue);
    } else {
      state.messageAppendRaf = 0;
    }
  }

  function enqueueIncomingMessage(sessionCode, message) {
    if (!sessionCode || sessionCode !== state.selectedSessionCode) return false;
    if (!message || typeof message !== 'object') return false;

    const normalized = {
      id: message.id || `sse_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      sender_type: message.sender_type || message.senderType || 'player',
      sender_name: message.sender_name || message.senderName || 'Khách hàng',
      message: message.message || message.text || '',
      created_at: message.created_at || message.createdAt || new Date().toISOString(),
      attachment_url: message.attachment_url || null,
      attachment_name: message.attachment_name || null,
      // Track the session at enqueue time so flushMessageAppendQueue can
      // discard items that are stale after the admin switches conversations.
      __sessionCode: sessionCode
    };

    // Lightweight dedupe by id against existing and queued messages.
    if (normalized.id && state.messages.some((m) => String(m.id) === String(normalized.id))) return false;
    if (normalized.id && state.messageAppendQueue.some((m) => String(m.id) === String(normalized.id))) return false;

    state.messageAppendQueue.push(normalized);
    if (!state.messageAppendRaf) {
      state.messageAppendRaf = requestAnimationFrame(flushMessageAppendQueue);
    }
    return true;
  }

  function clearMessageRetryTimers(sessionCode) {
    const code = String(sessionCode || '');
    if (!code) return;
    const timers = state.messageRetryTimersBySession[code];
    if (!Array.isArray(timers) || !timers.length) return;
    timers.forEach((timerId) => {
      try { clearTimeout(timerId); } catch (_) {}
    });
    state.messageRetryTimersBySession[code] = [];
  }

  function scheduleMessageFetchRetries(sessionCode) {
    const code = String(sessionCode || '').trim();
    if (!code) return;
    clearMessageRetryTimers(code);
    const delays = [220, 700, 1500];
    state.messageRetryTimersBySession[code] = delays.map((delayMs) => setTimeout(() => {
      if (code !== state.selectedSessionCode) return;
      loadMessages(code, { forceImmediate: true }).catch(() => {});
    }, delayMs));
  }

  function normalizeIncomingPayloadMessage(payload) {
    const raw = payload && typeof payload === 'object' ? payload : {};
    if (raw.message && typeof raw.message === 'object') {
      return raw.message;
    }
    // Fallback for event shapes where message fields are flattened at top level.
    if (raw.id || raw.message || raw.sender_type || raw.senderType || raw.created_at || raw.createdAt) {
      return {
        id: raw.id,
        sender_type: raw.sender_type || raw.senderType,
        sender_name: raw.sender_name || raw.senderName,
        message: raw.message || raw.text || '',
        created_at: raw.created_at || raw.createdAt,
        attachment_url: raw.attachment_url || raw.attachmentUrl || null,
        attachment_name: raw.attachment_name || raw.attachmentName || null,
        message_type: raw.message_type || raw.messageType || 'text',
        metadata: raw.metadata || null
      };
    }
    return null;
  }

  // Real-time online state cache (populated by SSE online_status events)
  const _playerOnlineCache = {};
  let _statusTicker = null; // single shared ticker — only one session open at a time

  function formatPlayerLastSeen(lastSeenTs) {
    if (!lastSeenTs) return 'Offline';
    const diffMs = Date.now() - Number(lastSeenTs);
    if (diffMs < 0) return 'Offline';
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `Offline · ${diffSec} giây trước`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Offline · ${diffMin} phút trước`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `Offline · ${diffHour} giờ trước`;
    const diffDay = Math.floor(diffHour / 24);
    return `Lần cuối hoạt động ${diffDay} ngày trước`;
  }

  function formatOnlineDuration(sinceTs) {
    const diffSec = Math.max(0, Math.floor((Date.now() - Number(sinceTs)) / 1000));
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;
    const pad = n => String(n).padStart(2, '0');
    return `Đang hoạt động ${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  // Start a 1-second ticker for the given session. Reads wsManager directly each tick
  // so it always reflects live state without relying on event ordering.
  function _refreshOnlineStatusUI(sessionCode) {
    if (_statusTicker) {
      clearInterval(_statusTicker);
      _statusTicker = null;
    }
    if (!sessionCode) return;

    const runTick = function() {
      // Self-cancel if admin has switched to a different session
      if (sessionCode !== state.selectedSessionCode) {
        clearInterval(_statusTicker);
        _statusTicker = null;
        return;
      }

      // Read live state directly from wsManager — the authoritative source
      let online = null;
      let sinceTs = null;
      let lastSeenTs = null;
      try {
        const info = window.wsManager?.onlinePlayers?.get(sessionCode);
        if (info) {
          online = !!info.online;
          sinceTs = info.since ? Number(new Date(info.since)) : null;
          lastSeenTs = info.lastSeen ? Number(new Date(info.lastSeen)) : null;
        }
      } catch (_) {}

      // Fall back to local cache if wsManager has no entry yet
      if (online === null) {
        const cached = _playerOnlineCache[sessionCode];
        if (!cached) return; // no data at all — leave session-status label as-is
        online = cached.online;
        sinceTs = cached.sinceTs;
        lastSeenTs = cached.lastSeenTs;
      }

      const label = online
        ? (sinceTs ? formatOnlineDuration(sinceTs) : 'Đang hoạt động')
        : formatPlayerLastSeen(lastSeenTs);
      const cls = online ? 'active' : 'waiting';

      const statusEl = byId('ccChatStatus');
      const custStatusEl = byId('ccCustStatus');
      [statusEl, custStatusEl].forEach(function(el) {
        if (!el) return;
        el.textContent = label;
        applyStatusClass(el, cls);
      });
    };

    runTick();
    _statusTicker = setInterval(runTick, 1000);
  }

  function renderDetails() {
    const current = state.sessions.find((s) => s.session_code === state.selectedSessionCode);
    const effectiveStatus = getEffectiveSessionStatus(current);
    const meta = current ? getSessionMeta(current) : { gameSessionCode: '--' };
    const displayName = getDisplayCustomerName(current);
    byId('ccPriorityBtn')?.classList.toggle('priority-high', getSessionPriority(current) === 'high');

    byId('ccChatName').textContent = displayName || 'Chưa chọn hội thoại';
    byId('ccCustName').textContent = displayName || '--';
    const nicknameInput = byId('ccCustomerNicknameInput');
    if (nicknameInput) nicknameInput.value = meta.customerNickname || '';
    const chatStatusEl = byId('ccChatStatus');
    if (chatStatusEl) {
      chatStatusEl.textContent = mapStatusLabel(effectiveStatus);
      applyStatusClass(chatStatusEl, effectiveStatus || 'active');
    }
    byId('ccJoinDate').textContent = current ? fmtDate(current.created_at) : '--';
    byId('ccPhone').textContent = current?.customer_phone || '--';
    byId('ccEmail').textContent = current?.customer_email || '--';
    byId('ccChatCode').textContent = current?.session_code || '--';
    byId('ccGameSession').textContent = meta.gameSessionCode;
    byId('ccCustIp').textContent = meta.customerIp || '--';
    byId('ccUserAgent').textContent = meta.userAgent || '--';
    byId('ccFingerprint').textContent = meta.fingerprintHash || '--';
    byId('ccSessionExpireAt').textContent = meta.expiresAtRaw ? fmtDateTime(meta.expiresAtRaw) : '--';
    byId('ccMsgCount').textContent = `${Number(current?.message_count || 0)} tin`;
    byId('ccAdminNote').value = meta.adminNote;

    // Satisfaction score
    const satEl = byId('ccSatScore');
    if (satEl) satEl.textContent = current?.satisfaction_rating ? `${current.satisfaction_rating}/5` : '--';

    const headerGameEl = byId('ccHeaderGameSession');
    if (headerGameEl) {
      const hasSession = meta.gameSessionCode && meta.gameSessionCode !== '--';
      headerGameEl.textContent = hasSession ? `🎮 ${meta.gameSessionCode}` : '';
      headerGameEl.style.display = hasSession ? 'inline-flex' : 'none';
    }

    const headerIdentityEl = byId('ccHeaderIdentity');
    if (headerIdentityEl) {
      const hasIdentity = meta.sessionCodeShort && meta.sessionCodeShort !== '--';
      headerIdentityEl.textContent = hasIdentity ? `#${meta.sessionCodeShort}` : '#--';
      headerIdentityEl.style.display = hasIdentity ? 'inline-flex' : 'none';
    }

    const customerAvatarMarkup = getDefaultPersonAvatarSvg(state.selectedSessionCode || current?.session_code || '', 'customer');
    const supportAvatarMarkup = getDefaultPersonAvatarSvg(CURRENT_ADMIN_USERNAME || 'support', 'support');
    byId('ccChatAvatar').innerHTML = customerAvatarMarkup;
    byId('ccCustAvatar').innerHTML = customerAvatarMarkup;
    const headerSupportAvatar = byId('ccHeaderSupportAvatar');
    if (headerSupportAvatar) headerSupportAvatar.innerHTML = supportAvatarMarkup;
    const custStatusEl = byId('ccCustStatus');
    if (custStatusEl) {
      custStatusEl.textContent = mapStatusLabel(effectiveStatus);
      applyStatusClass(custStatusEl, effectiveStatus || 'active');
    }

    // Start/restart live status ticker for the selected session.
    // The ticker reads wsManager.onlinePlayers every second so it always
    // reflects current state regardless of SSE event ordering.
    _refreshOnlineStatusUI(state.selectedSessionCode || '');

    // Agent assignment / join button
    const agentId = Number(current?.support_agent_id || 0);
    const agentName = String(current?.support_agent_name || '').trim();
    const isMySession = !!(agentId && CURRENT_ADMIN_ID && agentId === CURRENT_ADMIN_ID);
    const hasOtherAgent = !!(agentId && !isMySession && agentName);
    const joinBtn = byId('ccJoinSessionBtn');
    if (joinBtn) {
      if (!current) {
        joinBtn.style.display = 'none';
      } else if (isMySession) {
        joinBtn.textContent = '🟢 Đang hỗ trợ';
        joinBtn.className = 'cc-btn cc-btn-join is-joined';
        joinBtn.title = 'Bạn là người hỗ trợ chính của hội thoại này';
        joinBtn.style.display = '';
      } else if (hasOtherAgent) {
        joinBtn.textContent = `🤝 Tiếp quản`;
        joinBtn.className = 'cc-btn cc-btn-join is-other';
        joinBtn.title = `Hiện đang do ${agentName} hỗ trợ. Click để tiếp quản.`;
        joinBtn.style.display = '';
      } else {
        joinBtn.textContent = '🙋 Tham gia';
        joinBtn.className = 'cc-btn cc-btn-join';
        joinBtn.title = 'Nhận hỗ trợ khách hàng này';
        joinBtn.style.display = '';
      }
    }
    const agentNameEl = byId('ccAgentName');
    if (agentNameEl) {
      if (isMySession) {
        agentNameEl.innerHTML = `<span class="cc-agent-badge is-me">🟢 Bạn (${safe(getCurrentAdminDisplayName())})</span>`;
      } else if (hasOtherAgent) {
        agentNameEl.innerHTML = `<span class="cc-agent-badge is-other">👤 ${safe(agentName)}</span>`;
      } else {
        agentNameEl.innerHTML = '<span class="cc-agent-badge unassigned">Chưa có ai tham gia</span>';
      }
    }

    syncInfoSheetFromDetails();
  }

  async function loadSessions() {
    if (state.sessionsInFlightPromise) {
      return state.sessionsInFlightPromise;
    }

    const now = Date.now();
    if ((now - state.sessionsLastFetchAt) < 900 && state.sessions.length > 0) {
      return;
    }

    state.sessionsLastFetchAt = now;
    const search = (byId('ccSearchInput')?.value || '').trim();
    const status = state.statusFilter && state.statusFilter !== 'all' ? `&status=${encodeURIComponent(state.statusFilter)}` : '';
    const hasAdvancedFilter = (() => {
      const f = getAdvancedFilters();
      return !!(f.ip || f.gameSession || f.day || f.month);
    })();
    const limit = hasAdvancedFilter ? 200 : (isMobileChatUi() ? 20 : 30);

    state.sessionsInFlightPromise = api(`/api/chat/admin/all-chats?limit=${limit}&search=${encodeURIComponent(search)}${status}`)
      .then((rs) => {
        state.sessions = Array.isArray(rs.data) ? rs.data : [];

        if (state.forceClearedUnread.size > 0) {
          state.sessions.forEach((s) => {
            if (state.forceClearedUnread.has(s.session_code)) {
              s.unread_count = 0;
              if (!['closed', 'archived'].includes(String(s.status || '').toLowerCase())) {
                s.status = 'active';
              }
            }
          });
        }

        state.filteredSessions = applyAdvancedSessionFilters(state.sessions);

        const newUnreadTotal = state.sessions.reduce((sum, s) => sum + Number(s.unread_count || 0), 0);
        const unreadIncrease = newUnreadTotal - state.unreadTotal;
        if (unreadIncrease > 0 && window.LMB_DISABLE_SSE) {
          if (typeof window.playNotificationSound === 'function') {
            window.playNotificationSound();
          } else if (window.notificationSound && typeof window.notificationSound.playSound === 'function') {
            window.notificationSound.playSound('message');
          }
        }
        const isCustomerCareActive = document.getElementById('panel-customer-care')?.classList.contains('active');

        // Keep global navbar badge source-of-truth while CSKH tab is hidden.
        // This avoids badge reset on admin page reload before user opens CSKH.
        if (isCustomerCareActive) {
          updateNavbarUnreadBadge(newUnreadTotal, unreadIncrease > 0 && !isCustomerCareActive);
        }
        updateConversationToggleUnreadBadge(newUnreadTotal);
        state.unreadTotal = newUnreadTotal;

        if (!state.selectedSessionCode && state.filteredSessions.length) {
          state.selectedSessionCode = state.filteredSessions[0].session_code;
        }

        // NOTE: Do NOT auto-switch selectedSessionCode when the current session is absent
        // from the paginated result (limit 20-30). That would silently discard messages the
        // admin is actively viewing. The session stays selected even if it scrolled off the
        // first page; subsequent loadMessages calls remain correct because they use the
        // preserved session code, not whatever happens to be first in the list.

        renderSessionList();
        renderDetails();
        renderTags();
        if (state._updateStatPills) state._updateStatPills();
      })
      .finally(() => {
        state.sessionsInFlightPromise = null;
      });

    await state.sessionsInFlightPromise;
  }

  async function loadMessages(sessionCode, options = {}) {
    if (!sessionCode) {
      state.messages = [];
      renderMessages(options);
      return;
    }

    if (state.messagesInFlightBySession[sessionCode]) {
      if (options.forceImmediate || options.forceScrollBottom) {
        state.messagesReloadQueuedBySession[sessionCode] = true;
      }
      await state.messagesInFlightBySession[sessionCode];
      return;
    }

    state.messagesInFlightBySession[sessionCode] = api(`/api/chat/admin/chat/${encodeURIComponent(sessionCode)}/messages`)
      .then((rs) => {
        const rawMessages = Array.isArray(rs.data) ? rs.data : [];
        const nextMessages = rawMessages.filter((m) => !isSystemAutoMessage(m));
        const nextDigest = getMessageDigest(nextMessages);
        const prevDigest = String(state.lastMessagesDigestBySession[sessionCode] || '');
        state.lastMessagesDigestBySession[sessionCode] = nextDigest;

        // Never overwrite messages for a session the admin is no longer viewing.
        // This guards against stale in-flight fetches that complete after the user
        // has already switched to a different conversation.
        if (sessionCode !== state.selectedSessionCode) return;

        if (!options.forceScrollBottom && prevDigest && prevDigest === nextDigest) {
          return;
        }

        state.messages = nextMessages;
        renderMessages(options);
      })
      .finally(() => {
        delete state.messagesInFlightBySession[sessionCode];
        if (state.messagesReloadQueuedBySession[sessionCode]) {
          delete state.messagesReloadQueuedBySession[sessionCode];
          setTimeout(() => {
            if (sessionCode === state.selectedSessionCode) {
              loadMessages(sessionCode, { forceImmediate: true }).catch(() => {});
            }
          }, 0);
        }
      });

    await state.messagesInFlightBySession[sessionCode];
  }

  async function selectSession(sessionCode) {
    if (!sessionCode) return;
    if (state.sessionSwitchInFlight) {
      state.pendingSelectedSessionCode = sessionCode;
      return;
    }
    state.sessionSwitchInFlight = true;
    state.pendingSelectedSessionCode = '';
    state.selectedSessionCode = sessionCode;
    detachCurrentEditMessageEditor();
    state.editingMessageId = null;
    state.editingDraftText = '';
    state.deleteConfirmMessageId = null;

    // Optimistic clear unread as soon as admin opens the conversation.
    state.forceClearedUnread.add(sessionCode);
    const targetSession = state.sessions.find((s) => s.session_code === sessionCode);
    if (targetSession) {
      targetSession.unread_count = 0;
      if (!['closed', 'archived'].includes(String(targetSession.status || '').toLowerCase())) {
        targetSession.status = 'active';
      }
    }
    state.unreadTotal = state.sessions.reduce((sum, s) => sum + Number(s.unread_count || 0), 0);
    updateNavbarUnreadBadge(state.unreadTotal, false);
    updateConversationToggleUnreadBadge(state.unreadTotal);

    setMobileScreen('chat');
    renderSessionList();
    renderDetails();

    // Show takeover overlay only once per session and only while unassigned.
    if (shouldShowTakeoverOverlay(targetSession)) {
      showTakeoverOverlay(targetSession);
      markTakeoverPromptShown(sessionCode);
    } else {
      hideTakeoverOverlay();
    }

    try {
      await loadMessages(sessionCode, { forceScrollBottom: true });
      await api(`/api/chat/admin/chat/${encodeURIComponent(sessionCode)}/mark-read`, { method: 'PUT' });
      // Tell the player their messages have been delivered (triggers ✓✓ in player UI)
      fetch(`/api/chat/admin/chat/${encodeURIComponent(sessionCode)}/mark-delivered`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {});
    } catch (_) {
      // Best effort.
    } finally {
      state.sessionSwitchInFlight = false;
      renderSessionList();
      if (state.pendingSelectedSessionCode && state.pendingSelectedSessionCode !== state.selectedSessionCode) {
        const queuedCode = state.pendingSelectedSessionCode;
        state.pendingSelectedSessionCode = '';
        selectSession(queuedCode);
      }
    }
  }

  async function sendMessage() {
    // Prefer Tiptap editor content; fall back to hidden textarea
    const useTiptap = window.CcTiptap && !window.CcTiptap.isEmpty();
    const inp = byId('ccInput');
    const text = useTiptap
      ? window.CcTiptap.getText().trim()
      : String(inp?.value || '').trim();
    const html = useTiptap
      ? window.CcTiptap.getHTML().trim()
      : text;
    if (!text || !state.selectedSessionCode || state.composerBusy) return;

    const sessionCode = state.selectedSessionCode;
    const currentDisplayName = getCurrentAdminDisplayName();
    const optimisticMsg = {
      id: `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      sender_type: 'support',
      sender_name: currentDisplayName,
      message: html,
      created_at: new Date().toISOString(),
      metadata: {
        sender_admin_id: CURRENT_ADMIN_ID,
        sender_admin_username: CURRENT_ADMIN_USERNAME,
        sender_admin_full_name: currentDisplayName
      },
      __pending: true
    };

    // Stop typing immediately once admin sends a message.
    stopAdminTyping(sessionCode);

    // Optimistic render for snappier chat UX.
    state.messages.push(optimisticMsg);
    renderMessages({ forceScrollBottom: true });

    // Clear composer
    if (window.CcTiptap) {
      window.CcTiptap.clear();
    } else {
      const inp = byId('ccInput');
      if (inp) { inp.value = ''; autoResizeInput(inp); }
    }
    setComposerBusy(true);

    try {
      await api('/api/chat/admin/send-message', {
        method: 'POST',
        body: JSON.stringify({
          session_code: sessionCode,
          message: html
        })
      });

      state.forceClearedUnread.add(sessionCode);
      const targetSession = state.sessions.find((s) => s.session_code === sessionCode);
      if (targetSession) {
        targetSession.unread_count = 0;
        targetSession.support_agent_id = CURRENT_ADMIN_ID;
        targetSession.support_agent_name = currentDisplayName;
        if (!['closed', 'archived'].includes(String(targetSession.status || '').toLowerCase())) {
          targetSession.status = 'active';
        }
      }
      markTakeoverPromptShown(sessionCode);
      hideTakeoverOverlay();
      state.unreadTotal = state.sessions.reduce((sum, s) => sum + Number(s.unread_count || 0), 0);
      updateNavbarUnreadBadge(state.unreadTotal, false);
      renderSessionList();
      renderDetails();
      renderTags();
      if (state._updateStatPills) state._updateStatPills();

      await loadMessages(sessionCode, { forceScrollBottom: true });
      await loadSessions();
    } catch (err) {
      state.messages = state.messages.filter((m) => m.id !== optimisticMsg.id);
      renderMessages({ forceScrollBottom: true });
      throw err;
    } finally {
      setComposerBusy(false);
    }
  }

  async function markDone() {
    if (!state.selectedSessionCode) return;
    await api(`/api/chat/admin/chat/${encodeURIComponent(state.selectedSessionCode)}/mark-resolved`, {
      method: 'PUT'
    });
    await loadSessions();
    await loadMessages(state.selectedSessionCode);
    renderDetails();
  }

  async function joinSession(sessionCode) {
    const code = sessionCode || state.selectedSessionCode;
    if (!code) return;
    try {
      await api(`/api/chat/admin/chat/${encodeURIComponent(code)}/join`, { method: 'POST' });
      markTakeoverPromptShown(code);
      hideTakeoverOverlay();
      await loadSessions();
      renderDetails();
      if (code === state.selectedSessionCode) await loadMessages(code);
    } catch (err) {
      alert(err.message || 'Không thể tham gia hội thoại');
    }
  }

  // ─── Takeover Overlay ────────────────────────────────────────────────────────
  function showTakeoverOverlay(session) {
    const overlay = byId('ccTakeoverOverlay');
    if (!overlay) return;
    const titleEl = byId('ccTakeoverTitle');
    const descEl = byId('ccTakeoverDesc');
    const acceptBtn = byId('ccTakeoverAccept');
    const agentId = Number(session?.support_agent_id || 0);
    const agentName = String(session?.support_agent_name || '').trim();
    const isOther = !!(agentId && agentName && agentId !== CURRENT_ADMIN_ID);

    if (titleEl) titleEl.textContent = isOther
      ? `Phiên đang do ${agentName} hỗ trợ`
      : 'Khách hàng cần hỗ trợ';
    if (descEl) descEl.textContent = isOther
      ? `Bạn muốn tiếp quản phiên chat này từ ${agentName}?`
      : 'Phiên chat này chưa có ai hỗ trợ. Bạn muốn tiếp quản?';
    if (acceptBtn) acceptBtn.textContent = isOther ? '🤝 Tiếp quản' : '✅ Tiếp quản';
    overlay.style.display = '';
  }

  function hideTakeoverOverlay() {
    const overlay = byId('ccTakeoverOverlay');
    if (overlay) overlay.style.display = 'none';
  }

  function markTakeoverPromptShown(sessionCode) {
    const code = String(sessionCode || '').trim().toUpperCase();
    if (!code) return;
    state.takeoverPromptShownBySession[code] = true;
  }

  function shouldShowTakeoverOverlay(session) {
    if (!session) return false;
    const sessionCode = String(session.session_code || '').trim().toUpperCase();
    if (!sessionCode) return false;
    const agentId = Number(session.support_agent_id || 0);
    if (agentId > 0) return false;
    if (state.takeoverPromptShownBySession[sessionCode]) return false;
    return true;
  }

  // ─── Admin Presence ──────────────────────────────────────────────────────────
  async function loadAdminPresence() {
    try {
      const data = await fetch('/api/users/presence?limit=100', { cache: 'no-store' }).then(r => r.json());
      if (!data?.success || !Array.isArray(data.data)) return;
      // Only show admin/manager accounts, not regular players
      state.adminPresenceList = data.data.filter(u => u.role && u.role !== 'player' && u.is_active);
      renderAdminPresence();
    } catch (_) {}
  }

  function renderAdminPresence() {
    const bar = byId('ccAdminPresenceBar');
    if (!bar) return;
    const list = state.adminPresenceList || [];
    if (!list.length) { bar.innerHTML = ''; return; }
    const now = Date.now();
    const pills = list.map(u => {
      const online = !!u.is_online;
      const lastSeen = u.last_seen_at ? new Date(u.last_seen_at).getTime() : 0;
      let timeLabel = '';
      if (online) {
        timeLabel = 'Online';
      } else if (lastSeen > 0) {
        const diffMs = now - lastSeen;
        const diffMin = Math.round(diffMs / 60000);
        if (diffMin < 1) timeLabel = 'Vừa offline';
        else if (diffMin < 60) timeLabel = `${diffMin}ph trước`;
        else if (diffMin < 1440) timeLabel = `${Math.round(diffMin / 60)}h trước`;
        else timeLabel = `${Math.round(diffMin / 1440)}ng trước`;
      } else {
        timeLabel = 'Không rõ';
      }
      const name = String(u.full_name || u.username || 'Admin').trim();
      const isCurrent = CURRENT_ADMIN_ID && Number(u.id) === CURRENT_ADMIN_ID;
      return `<span class="cc-presence-pill${online ? ' online' : ' offline'}${isCurrent ? ' is-me' : ''}" title="${safe(name)} — ${timeLabel}">
        <span class="cc-presence-dot"></span>
        <span class="cc-presence-name">${safe(name)}${isCurrent ? ' (bạn)' : ''}</span>
        <span class="cc-presence-time">${timeLabel}</span>
      </span>`;
    }).join('');
    bar.innerHTML = `<span class="cc-presence-label">👥 Nhóm:</span>${pills}`;
  }
  // ─────────────────────────────────────────────────────────────────────────────

  async function saveAdminNote() {
    if (!state.selectedSessionCode) return;
    const note = String(byId('ccAdminNote')?.value || '').trim();
    await api(`/api/chat/admin/chat/${encodeURIComponent(state.selectedSessionCode)}/note`, {
      method: 'PUT',
      body: JSON.stringify({ note })
    });
    await loadSessions();
    renderDetails();
  }

  function csvEscape(value) {
    const text = String(value === undefined || value === null ? '' : value);
    const escaped = text.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  async function exportCurrentSessionCsv() {
    if (!state.selectedSessionCode) {
      alert('Vui lòng chọn hội thoại trước khi xuất CSV.');
      return;
    }
    const sessionCode = state.selectedSessionCode;
    const rs = await api(`/api/chat/admin/chat/${encodeURIComponent(sessionCode)}/messages`);
    const rows = Array.isArray(rs.data) ? rs.data : [];

    const header = ['session_code', 'created_at', 'sender_type', 'sender_name', 'message', 'message_type', 'attachment_url', 'ip', 'user_agent'];
    const csvLines = [header.map(csvEscape).join(',')];

    rows.forEach((m) => {
      const meta = (m && typeof m.metadata === 'object')
        ? m.metadata
        : (() => {
          try { return JSON.parse(m?.metadata || '{}'); } catch (_) { return {}; }
        })();
      const line = [
        sessionCode,
        m?.created_at || m?.createdAt || '',
        m?.sender_type || '',
        m?.sender_name || '',
        m?.message || '',
        m?.message_type || '',
        m?.attachment_url || '',
        meta?.ip || '',
        meta?.user_agent || ''
      ];
      csvLines.push(line.map(csvEscape).join(','));
    });

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${sessionCode}_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function saveCustomerNickname(options = {}) {
    const { silent = false } = options;
    if (!state.selectedSessionCode) return;
    const nickname = String(byId('ccCustomerNicknameInput')?.value || '').trim();
    await api(`/api/chat/admin/chat/${encodeURIComponent(state.selectedSessionCode)}/nickname`, {
      method: 'PUT',
      body: JSON.stringify({ nickname })
    });
    await loadSessions();
    renderDetails();
    if (!silent && typeof window.showToast === 'function') {
      window.showToast('Đã lưu nickname khách hàng.', 'success');
    }
  }

  function scheduleAutoSaveNickname() {
    if (state.autoSaveNicknameTimer) clearTimeout(state.autoSaveNicknameTimer);
    state.autoSaveNicknameTimer = setTimeout(async () => {
      try {
        await saveCustomerNickname({ silent: true });
      } catch (_) {
        // Ignore auto-save errors silently; manual save remains available.
      }
    }, 600);
  }

  function openGameSession() {
    if (!state.selectedSessionCode) return;
    openGameSessionByCode(state.selectedSessionCode);
  }

  async function uploadFile(file) {
    if (!state.selectedSessionCode || state.composerBusy) return;
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) { alert('File quá lớn (tối đa 10MB)'); return; }

    setComposerBusy(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_code', state.selectedSessionCode);

    const res = await fetch('/api/chat/admin/send-file', {
      method: 'POST',
      body: formData,
      cache: 'no-store'
    });
    try {
      const data = await res.json().catch(() => ({ success: false }));
      if (!res.ok || !data.success) throw new Error(data.message || 'Upload thất bại');

      await loadMessages(state.selectedSessionCode, { forceScrollBottom: true });
      await loadSessions();
    } finally {
      setComposerBusy(false);
    }
  }

  async function uploadFiles(files, options = {}) {
    const list = Array.from(files || []).filter(Boolean);
    if (!list.length) return;

    const source = String(options.source || '').trim().toLowerCase();
    if (source === 'paste') {
      showInlineFeedback(
        list.length > 1
          ? `Đã dán ${list.length} ảnh, đang gửi...`
          : 'Đã dán ảnh từ clipboard, đang gửi...',
        'info'
      );
    }

    for (const file of list) {
      await uploadFile(file);
    }
  }

  // Tags management
  window.addSessionTag = async function() {
    if (!state.selectedSessionCode) return;
    const input = byId('ccTagInput');
    const tag = (input?.value || '').trim();
    if (!tag) return;
    try {
      await api(`/api/chat/admin/chat/${encodeURIComponent(state.selectedSessionCode)}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tag })
      });
      input.value = '';
      await loadSessions();
      renderTags();
    } catch (_) {}
  };

  function renderTags() {
    const current = state.sessions.find(s => s.session_code === state.selectedSessionCode);
    const tags = current?.metadata?.tags || [];
    const list = byId('ccTagsList');
    if (!list) return;
    list.innerHTML = tags.map(t =>
      `<span class="cc-session-tag">${safe(t)} <span class="cc-tag-remove" onclick="removeSessionTag('${safe(t)}')">✕</span></span>`
    ).join('');
  }

  window.removeSessionTag = async function(tag) {
    if (!state.selectedSessionCode) return;
    try {
      await api(`/api/chat/admin/chat/${encodeURIComponent(state.selectedSessionCode)}/tags`, {
        method: 'DELETE',
        body: JSON.stringify({ tag })
      });
      await loadSessions();
      renderTags();
    } catch (_) {}
  };

  function startPolling(burstCount = 1) {
    if (!isCustomerCarePanelVisible()) return;
    if (state.sseConnected) return;
    const nextBurst = Number.isFinite(Number(burstCount)) ? Number(burstCount) : 0;
    state.pollingBurstRemaining = Math.max(state.pollingBurstRemaining, nextBurst);
    if (state.pollingTimer) return;

    const runBurst = async () => {
      state.pollingTimer = null;
      await pollOnce();
      state.pollingBurstRemaining = Math.max(0, Number(state.pollingBurstRemaining || 0) - 1);

      if (!isCustomerCarePanelVisible() || state.sseConnected || (state.pollingBurstRemaining <= 0 && !window.LMB_DISABLE_SSE)) {
        return;
      }

      state.pollingTimer = setTimeout(runBurst, state.pollingInterval);
    };

    runBurst();
  }

  function restartPollingTimer() {
    if (!state.pollingTimer) return;
    clearTimeout(state.pollingTimer);
    state.pollingTimer = null;
    if (!state.sseConnected && isCustomerCarePanelVisible() && state.pollingBurstRemaining > 0) {
      startPolling(0);
    }
  }

  async function pollOnce() {
    if (!isCustomerCarePanelVisible()) return;
    if (state.sseConnected) return;
    if (state.pollingBusy) return;
    state.pollingBusy = true;
    try {
      const selectedBefore = state.selectedSessionCode;
      await loadSessions();
      const selectedAfter = state.selectedSessionCode || selectedBefore;
      const selectedSession = state.sessions.find((s) => s.session_code === selectedAfter);
      const hasPotentialNew = Number(selectedSession?.unread_count || 0) > 0 || !!state.forceNextMessagePoll;
      if (selectedAfter && shouldPollMessages() && hasPotentialNew) {
        await loadMessages(selectedAfter);
      }
      if (state.pollingErrorCount !== 0 || state.pollingInterval !== state.pollingBaseInterval) {
        state.pollingErrorCount = 0;
        state.pollingInterval = state.pollingBaseInterval;
        restartPollingTimer();
      }
    } catch (_) {
      // Backoff polling on hosting/upstream failures to reduce repeated 503 bursts.
      state.pollingErrorCount += 1;
      const nextInterval = Math.min(
        state.pollingMaxInterval,
        state.pollingBaseInterval * Math.pow(2, state.pollingErrorCount)
      );
      if (nextInterval !== state.pollingInterval) {
        state.pollingInterval = nextInterval;
        restartPollingTimer();
      }
    } finally {
      state.pollingBusy = false;
    }
  }

  function stopPolling() {
    if (!state.pollingTimer) return;
    clearTimeout(state.pollingTimer);
    state.pollingTimer = null;
    state.pollingBurstRemaining = 0;
  }

  function bindEvents() {
    const runReloadForFilter = async () => {
      await loadSessions();
      if (state.selectedSessionCode && shouldPollMessages()) {
        await loadMessages(state.selectedSessionCode);
      }
    };

    byId('ccMobileSearchBtn')?.addEventListener('click', () => {
      const panel = byId('panel-customer-care');
      if (!panel) return;
      const opening = !panel.classList.contains('cc-mobile-search-open');
      panel.classList.toggle('cc-mobile-search-open', opening);
      panel.classList.remove('cc-mobile-filter-open');
      if (opening) byId('ccSearchInput')?.focus();
    });

    byId('ccMobileFilterBtn')?.addEventListener('click', () => {
      const panel = byId('panel-customer-care');
      if (!panel) return;
      const opening = !panel.classList.contains('cc-mobile-filter-open');
      panel.classList.toggle('cc-mobile-filter-open', opening);
      panel.classList.remove('cc-mobile-search-open');
      if (opening) byId('ccStatusFilter')?.focus();
    });

    byId('ccToggleAdvancedFiltersBtn')?.addEventListener('click', () => {
      const panel = byId('panel-customer-care');
      if (!panel) return;
      const opening = panel.classList.contains('cc-advanced-filters-collapsed');
      panel.classList.toggle('cc-advanced-filters-collapsed', !opening);
      const btn = byId('ccToggleAdvancedFiltersBtn');
      if (btn) {
        btn.classList.toggle('is-open', opening);
        btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
      }
    });

    byId('ccMobileBackBtn')?.addEventListener('click', () => {
      setMobileScreen('list');
    });

    byId('ccConversationList')?.addEventListener('click', (e) => {
      // ── IP group header toggle ──────────────────────────────────────────
      const ipGroupHeader = e.target.closest('[data-action="toggle-ip-group"]');
      if (ipGroupHeader) {
        e.preventDefault();
        e.stopPropagation();
        const ip = String(ipGroupHeader.getAttribute('data-ip') || '').trim();
        if (!ip) return;
        if (state.expandedIpGroups.has(ip)) {
          state.expandedIpGroups.delete(ip);
        } else {
          state.expandedIpGroups.add(ip);
        }
        renderSessionList();
        return;
      }

      const menuBtn = e.target.closest('[data-action="toggle-conv-menu"]');
      if (menuBtn) {
        e.preventDefault();
        e.stopPropagation();
        const code = String(menuBtn.getAttribute('data-code') || '').trim();
        state.openConversationMenuCode = state.openConversationMenuCode === code ? '' : code;
        renderSessionList();
        return;
      }

      const menuAction = e.target.closest('.cc-conv-menu-item[data-action]');
      if (menuAction) {
        e.preventDefault();
        e.stopPropagation();
        const action = String(menuAction.getAttribute('data-action') || '').trim();
        const code = String(menuAction.getAttribute('data-code') || '').trim();
        state.openConversationMenuCode = '';
        renderSessionList();
        runConversationMenuAction(action, code).catch((err) => {
          showInlineFeedback(err?.message || 'Không thể thực hiện thao tác.', 'error');
        });
        return;
      }

      const item = e.target.closest('.cc-conv-item');
      if (!item) return;
      const code = item.getAttribute('data-code');
      if (!code) return;
      state.openConversationMenuCode = '';
      if (state.selectedSessionCode === code && !state.sessionSwitchInFlight) {
        // Allow re-clicking active conversation to force sync unread/messages quickly.
        api(`/api/chat/admin/chat/${encodeURIComponent(code)}/mark-read`, { method: 'PUT' }).catch(() => {});
        loadMessages(code, { forceImmediate: true }).catch(() => {});
        queueSessionRefresh();
        return;
      }
      selectSession(code);
    });

    byId('ccMessages')?.addEventListener('click', async (e) => {
      const startBtn = e.target.closest('[data-action="start-edit-message"]');
      if (startBtn) {
        startEditMessage(startBtn.getAttribute('data-message-id'));
        return;
      }

      const cancelBtn = e.target.closest('[data-action="cancel-edit-message"]');
      if (cancelBtn) {
        cancelEditMessage();
        return;
      }

      const saveBtn = e.target.closest('[data-action="save-edit-message"]');
      if (saveBtn) {
        const messageId = saveBtn.getAttribute('data-message-id');
        const editor = document.querySelector(`#ccMessages [contenteditable][data-edit-message-id="${escapeCssSelectorValue(String(messageId || ''))}"]`);
        const draft = String(editor?.innerHTML || '').trim();
        try {
          await saveEditedMessage(messageId, draft);
        } catch (err) {
          alert(err.message || 'Không thể chỉnh sửa tin nhắn');
        }
        return;
      }

      const requestDeleteBtn = e.target.closest('[data-action="request-delete-message"]');
      if (requestDeleteBtn) {
        requestDeleteSupportMessage(requestDeleteBtn.getAttribute('data-message-id'));
        return;
      }

      const confirmDeleteBtn = e.target.closest('[data-action="confirm-delete-message"]');
      if (confirmDeleteBtn) {
        const messageId = confirmDeleteBtn.getAttribute('data-message-id');
        try {
          await deleteSupportMessage(messageId);
        } catch (err) {
          alert(err.message || 'Không thể xóa tin nhắn');
        }
        return;
      }

      const cancelDeleteBtn = e.target.closest('[data-action="cancel-delete-message"]');
      if (cancelDeleteBtn) {
        state.deleteConfirmMessageId = null;
        renderMessages({ forceImmediate: true });
        return;
      }

      // Voice player: play/pause button
      const vpBtn = e.target.closest('.cc-vp-btn');
      if (vpBtn) {
        const player = vpBtn.closest('.cc-voice-player');
        const audio = player?.querySelector('audio');
        if (!audio) return;
        // Stop all other players in this container
        document.querySelectorAll('#ccMessages .cc-voice-player.cc-vp-playing').forEach(p => {
          if (p === player) return;
          const a = p.querySelector('audio');
          if (a) a.pause();
          p.classList.remove('cc-vp-playing');
          const pi = p.querySelector('.cc-vp-play-icon'), pa = p.querySelector('.cc-vp-pause-icon');
          if (pi) pi.style.display = ''; if (pa) pa.style.display = 'none';
        });
        const playIcon = player.querySelector('.cc-vp-play-icon');
        const pauseIcon = player.querySelector('.cc-vp-pause-icon');
        if (audio.paused) {
          audio.play().catch(() => {});
          player.classList.add('cc-vp-playing');
          if (playIcon) playIcon.style.display = 'none';
          if (pauseIcon) pauseIcon.style.display = '';
        } else {
          audio.pause();
          player.classList.remove('cc-vp-playing');
          if (playIcon) playIcon.style.display = '';
          if (pauseIcon) pauseIcon.style.display = 'none';
        }
        return;
      }

      // Voice player: waveform scrub
      const waveEl = e.target.closest('.cc-vp-wave');
      if (waveEl) {
        const player = waveEl.closest('.cc-voice-player');
        const audio = player?.querySelector('audio');
        if (!audio || !audio.duration || !isFinite(audio.duration)) return;
        const rect = waveEl.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = pct * audio.duration;
        return;
      }
    });

    byId('ccMessages')?.addEventListener('input', (e) => {
      const editor = e.target.closest('[contenteditable][data-edit-message-id]');
      if (!editor) return;
      state.editingDraftText = editor.innerHTML;
    });

    byId('ccMessages')?.addEventListener('keydown', async (e) => {
      const editor = e.target.closest('[contenteditable][data-edit-message-id]');
      if (!editor) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelEditMessage();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const messageId = editor.getAttribute('data-edit-message-id');
        try {
          await saveEditedMessage(messageId, editor.innerHTML);
        } catch (err) {
          alert(err.message || 'Không thể chỉnh sửa tin nhắn');
        }
      }
    });

    byId('ccMobileMenuBtn')?.addEventListener('click', () => {
      byId('ccMoreBtn')?.click();
    });

    byId('ccToggleConversationsBtn')?.addEventListener('click', () => {
      setDesktopPaneVisibility('conversations');
    });

    byId('ccToggleInfoBtn')?.addEventListener('click', () => {
      setDesktopPaneVisibility('info');
    });

    byId('ccChatInfoTap')?.addEventListener('click', () => {
      if (!isMobileChatUi()) return;
      openInfoSheet();
    });

    byId('ccInfoSheetBackdrop')?.addEventListener('click', closeInfoSheet);
    byId('ccInfoSheetCloseBtn')?.addEventListener('click', closeInfoSheet);

    byId('ccSearchInput')?.addEventListener('input', async () => {
      if (state.searchDebounceTimer) clearTimeout(state.searchDebounceTimer);
      state.searchDebounceTimer = setTimeout(async () => {
        await runReloadForFilter();
      }, 280);
    });

    ['ccIpFilter', 'ccGameSessionFilter', 'ccDateFilter', 'ccMonthFilter'].forEach((id) => {
      byId(id)?.addEventListener('input', async () => {
        if (state.filterDebounceTimer) clearTimeout(state.filterDebounceTimer);
        state.filterDebounceTimer = setTimeout(async () => {
          await runReloadForFilter();
        }, 220);
      });
      byId(id)?.addEventListener('change', async () => {
        if (state.filterDebounceTimer) clearTimeout(state.filterDebounceTimer);
        await runReloadForFilter();
      });
    });

    byId('ccClearFiltersBtn')?.addEventListener('click', async () => {
      ['ccIpFilter', 'ccGameSessionFilter', 'ccDateFilter', 'ccMonthFilter'].forEach((id) => {
        const el = byId(id);
        if (el) el.value = '';
      });
      await runReloadForFilter();
    });

    byId('ccExportCsvBtn')?.addEventListener('click', async () => {
      try {
        await exportCurrentSessionCsv();
      } catch (err) {
        alert(err.message || 'Không xuất được CSV');
      }
    });

    byId('ccStatusFilter')?.addEventListener('change', async (e) => {
      state.statusFilter = e.target.value || 'all';
      byId('panel-customer-care')?.classList.remove('cc-mobile-filter-open');
      await loadSessions();
      if (state.selectedSessionCode) {
        await loadMessages(state.selectedSessionCode);
      }
    });

    byId('ccSendBtn')?.addEventListener('click', async () => {
      try {
        await sendMessage();
      } catch (err) {
        alert(err.message || 'Không gửi được tin nhắn');
      }
    });

    byId('ccInput')?.addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter') return;
      if (e.shiftKey) return;
      e.preventDefault();
      try {
        await sendMessage();
      } catch (err) {
        alert(err.message || 'Không gửi được tin nhắn');
      }
    });

    // Emit typing event when admin types
    byId('ccInput')?.addEventListener('input', () => {
      const inputEl = byId('ccInput');
      if (!inputEl) return;
      if (state.inputRaf) cancelAnimationFrame(state.inputRaf);
      state.inputRaf = requestAnimationFrame(() => {
        autoResizeInput(inputEl);
        emitAdminTyping();
        state.inputRaf = 0;
      });
    });

    byId('ccMarkDoneBtn')?.addEventListener('click', async () => {
      try {
        await markDone();
      } catch (err) {
        alert(err.message || 'Không thể cập nhật trạng thái');
      }
    });

    byId('ccJoinSessionBtn')?.addEventListener('click', () => {
      joinSession(state.selectedSessionCode).catch(() => {});
    });

    byId('ccTakeoverAccept')?.addEventListener('click', async () => {
      hideTakeoverOverlay();
      await joinSession(state.selectedSessionCode).catch(() => {});
    });

    byId('ccTakeoverDecline')?.addEventListener('click', () => {
      hideTakeoverOverlay();
    });

    byId('ccViewSessionBtn')?.addEventListener('click', openGameSession);

    byId('ccSaveNoteBtn')?.addEventListener('click', async () => {
      try {
        await saveAdminNote();
        alert('Đã lưu ghi chú nội bộ.');
      } catch (err) {
        alert(err.message || 'Không lưu được ghi chú');
      }
    });

    // === NEW: File & image upload ===
    byId('ccAttachBtn')?.addEventListener('click', () => byId('ccFileUpload')?.click());
    byId('ccImageBtn')?.addEventListener('click', () => byId('ccImageUpload')?.click());

    byId('ccFileUpload')?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file || !state.selectedSessionCode) return;
      try { await uploadFiles([file]); } catch (err) { alert(err.message || 'Không gửi được file'); }
      e.target.value = '';
    });
    byId('ccImageUpload')?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file || !state.selectedSessionCode) return;
      try { await uploadFiles([file]); } catch (err) { alert(err.message || 'Không gửi được ảnh'); }
      e.target.value = '';
    });

    // === Emoji picker ===
    byId('ccEmojiBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const p = byId('ccEmojiPicker');
      if (!p) return;
      initEmojiPicker();
      const open = p.style.display !== 'none' && p.style.display !== '';
      p.style.display = open ? 'none' : 'block';
      if (!open) {
        requestAnimationFrame(positionEmojiPicker);
      }
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#ccEmojiPicker') && !e.target.closest('#ccEmojiBtn')) {
        const p = byId('ccEmojiPicker');
        if (p) p.style.display = 'none';
      }
    });

    window.addEventListener('resize', () => {
      const p = byId('ccEmojiPicker');
      if (!p || p.style.display === 'none' || p.style.display === '') return;
      positionEmojiPicker();
    });

    window.addEventListener('resize', () => {
      updatePollingProfile();
      applyCompactDesktopDefaults();
      setMobileScreen(byId('panel-customer-care')?.classList.contains('cc-mobile-chat-open') ? 'chat' : 'list');
    });

    // === NEW: Message search toggle ===
    byId('ccSearchMsgBtn')?.addEventListener('click', () => {
      const bar = byId('ccMsgSearchBar');
      if (!bar) return;
      bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
      if (bar.style.display === 'flex') byId('ccMsgSearchInput')?.focus();
    });
    byId('ccMsgSearchInput')?.addEventListener('input', (e) => {
      const q = (e.target.value || '').toLowerCase();
      const box = byId('ccMessages');
      if (!box) return;
      box.querySelectorAll('.cc-msg-row').forEach((row) => {
        const text = (row.textContent || '').toLowerCase();
        row.style.display = q && !text.includes(q) ? 'none' : '';
      });
    });

    byId('ccToggleChatStyleBtn')?.addEventListener('click', () => {
      const bar = byId('ccChatStyleBar');
      if (!bar) return;
      bar.style.display = bar.style.display === 'flex' ? 'none' : 'flex';
    });

    // === NEW: More dropdown ===
    byId('ccMoreBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      byId('ccMoreDropdown')?.classList.toggle('show');
    });
    document.addEventListener('click', () => {
      byId('ccMoreDropdown')?.classList.remove('show');
      if (state.openConversationMenuCode) {
        state.openConversationMenuCode = '';
        renderSessionList();
      }
    });

    byId('ccArchiveBtn')?.addEventListener('click', async () => {
      if (!state.selectedSessionCode) return;
      if (!confirm('Lưu trữ hội thoại này?')) return;
      try {
        await api(`/api/chat/admin/chat/${encodeURIComponent(state.selectedSessionCode)}/archive`, { method: 'PUT' });
        await loadSessions();
        renderDetails();
      } catch (err) { alert(err.message || 'Lỗi'); }
    });

    byId('ccDeleteBtn')?.addEventListener('click', async () => {
      if (!state.selectedSessionCode) return;
      if (!confirm('Xóa hội thoại? Hành động này không thể hoàn tác.')) return;
      try {
        await api(`/api/chat/admin/chat/${encodeURIComponent(state.selectedSessionCode)}`, { method: 'DELETE' });
        state.selectedSessionCode = '';
        await loadSessions();
        renderMessages();
        renderDetails();
      } catch (err) { alert(err.message || 'Lỗi'); }
    });

    // === NEW: Priority toggle ===
    byId('ccPriorityBtn')?.addEventListener('click', async () => {
      if (!state.selectedSessionCode) return;
      const btn = byId('ccPriorityBtn');
      const isHigh = btn?.classList.contains('priority-high');
      try {
        await api(`/api/chat/admin/chat/${encodeURIComponent(state.selectedSessionCode)}/priority`, {
          method: 'PUT',
          body: JSON.stringify({ priority: isHigh ? 'normal' : 'high' })
        });
        btn?.classList.toggle('priority-high');
      } catch (_) {}
    });

    syncColorPair('ccChatTextColor', 'ccChatTextColorText');
    syncColorPair('ccChatBgColor', 'ccChatBgColorText');
    syncColorPair('ccBubbleTheirsColor', 'ccBubbleTheirsColorText');
    syncColorPair('ccBubbleMineColor', 'ccBubbleMineColorText');
    syncColorPair('ccTextTheirsColor', 'ccTextTheirsColorText');
    syncColorPair('ccTextMineColor', 'ccTextMineColorText');

    [
      'ccChatTextColorText',
      'ccChatBgColorText',
      'ccBubbleTheirsColorText',
      'ccBubbleMineColorText',
      'ccTextTheirsColorText',
      'ccTextMineColorText'
    ].forEach((id) => {
      byId(id)?.addEventListener('input', () => {
        clearActiveThemePreset();
      });
    });

    byId('ccSaveChatStyleBtn')?.addEventListener('click', async () => {
      try {
        await saveChatFrameStyle();
      } catch (err) {
        alert(err.message || 'Không lưu được màu chat');
      }
    });

    ['ccToastGroupEnabled', 'ccToastSwipeDismissEnabled', 'ccToastGroupWindowMs'].forEach((id) => {
      byId(id)?.addEventListener('change', () => {
        scheduleAutoSaveChatFrameStyle();
      });
    });

    byId('ccSaveNicknameBtn')?.addEventListener('click', async () => {
      try {
        await saveCustomerNickname();
      } catch (err) {
        alert(err.message || 'Không lưu được nickname');
      }
    });

    byId('ccCustomerNicknameInput')?.addEventListener('input', () => {
      scheduleAutoSaveNickname();
    });

    document.querySelectorAll('[data-cc-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const themeKey = btn.getAttribute('data-cc-theme') || '';
        applyThemePreset(themeKey);
      });
    });

    // === NEW: Update stat pills ===
    state._updateStatPills = () => {
      const online = state.sessions.filter(s => s.status === 'active').length;
      const waiting = state.sessions.filter(s => s.status === 'waiting').length;
      const unread = state.sessions.reduce((sum, s) => sum + Number(s.unread_count || 0), 0);
      const onlineEl = byId('ccOnlineCount');
      const waitingEl = byId('ccWaitingCount');
      const unreadEl = byId('ccUnreadCount');
      if (onlineEl) onlineEl.textContent = online;
      if (waitingEl) waitingEl.textContent = waiting;
      if (unreadEl) unreadEl.textContent = unread;
    };
  }

  // === Typing indicator functions ===
  let ccEmojiDataPromise = null;

  async function getEmojiMartData() {
    if (!ccEmojiDataPromise) {
      ccEmojiDataPromise = fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data')
        .then((res) => {
          if (!res.ok) throw new Error('Không tải được dữ liệu emoji');
          return res.json();
        });
    }
    return ccEmojiDataPromise;
  }

  async function initEmojiPicker() {
    const picker = byId('ccEmojiPicker');
    if (!picker || picker.dataset.ready === '1') return;

    if (!window.EmojiMart || typeof window.EmojiMart.Picker !== 'function') {
      picker.innerHTML = '<div class="cc-emoji-fallback">Emoji đang tạm thời không khả dụng.</div>';
      return;
    }

    try {
      const data = await getEmojiMartData();
      const emojiPicker = new window.EmojiMart.Picker({
        data,
        theme: 'dark',
        locale: 'vi',
        perLine: 8,
        previewPosition: 'none',
        skinTonePosition: 'none',
        onEmojiSelect: (emoji) => {
          const native = emoji?.native || '';
          if (window.CcTiptap) {
            window.CcTiptap.insertText(native);
            picker.style.display = 'none';
          } else {
            const inp = byId('ccInput');
            if (!inp) return;
            inp.value = `${inp.value || ''}${native}`;
            autoResizeInput(inp);
            inp.focus();
            picker.style.display = 'none';
          }
        }
      });

      picker.innerHTML = '';
      picker.appendChild(emojiPicker);
      picker.dataset.ready = '1';
      if (picker.style.display !== 'none' && picker.style.display !== '') {
        requestAnimationFrame(positionEmojiPicker);
      }
    } catch (_) {
      picker.innerHTML = '<div class="cc-emoji-fallback">Không thể tải bộ emoji.</div>';
    }
  }

  function positionEmojiPicker() {
    const picker = byId('ccEmojiPicker');
    const row = document.querySelector('#panel-customer-care .cc-input-row');
    const btn = byId('ccEmojiBtn');
    if (!picker || !row || !btn) return;

    const rowRect = row.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const pickerWidth = picker.offsetWidth || 352;
    const maxLeft = Math.max(8, rowRect.width - pickerWidth - 8);
    const left = Math.min(Math.max(8, btnRect.left - rowRect.left - 12), maxLeft);

    picker.style.left = `${Math.round(left)}px`;
    picker.style.bottom = `${Math.round(rowRect.height + 8)}px`;
  }

  function emitAdminTyping() {
    if (!state.selectedSessionCode) return;
    if (!state.adminIsTyping) {
      state.adminIsTyping = true;
      window.wsManager?.sendTyping(state.selectedSessionCode, true);
    }
    clearTimeout(state.adminTypingTimer);
    state.adminTypingTimer = setTimeout(() => {
      stopAdminTyping(state.selectedSessionCode);
    }, 2000);
  }

  function stopAdminTyping(sessionCode) {
    if (!sessionCode) return;
    state.adminIsTyping = false;
    clearTimeout(state.adminTypingTimer);
    window.wsManager?.sendTyping(sessionCode, false);
  }

  function showPlayerTyping(sessionCode) {
    if (!sessionCode) return;
    state.typingSessionCodes.add(sessionCode);
    renderSessionList();
    if (sessionCode !== state.selectedSessionCode) return;
    const el = byId('ccTypingIndicator');
    if (el) el.style.display = 'flex';
    clearTimeout(state.playerTypingTimers[sessionCode]);
    state.playerTypingTimers[sessionCode] = setTimeout(() => hidePlayerTyping(sessionCode), 3000);
  }

  function hidePlayerTyping(sessionCode) {
    if (!sessionCode) return;
    state.typingSessionCodes.delete(sessionCode);
    renderSessionList();
    if (sessionCode === state.selectedSessionCode) {
      const el = byId('ccTypingIndicator');
      if (el) el.style.display = 'none';
    }
    clearTimeout(state.playerTypingTimers[sessionCode]);
  }

  /**
   * Register window-level callbacks that AdminSSEManager (adminDashboard.ejs) calls
   * whenever SSE events arrive. This replaces the old Socket.IO listener setup.
   */
  function setupSSEListeners() {
    // Called by AdminSSEManager to indicate realtime health and last event id.
    window.adminChatSseHealth = function(status) {
      const connected = !!status?.connected;
      state.sseConnected = connected;
      state.pendingMessagePollFallback = !connected;
      const parsedId = parseInt(status?.lastEventId || '0', 10);
      if (Number.isFinite(parsedId) && parsedId > 0) {
        state.sseLastEventId = parsedId;
      }

      if (!isCustomerCarePanelVisible()) {
        stopPolling();
        return;
      }

      if (connected) {
        stopPolling();
      } else if (window.LMB_DISABLE_SSE) {
        // SSE is disabled — ensure polling is running as the real-time fallback
        startPolling(1);
      }
    };

    // Called when player starts/stops typing
    window.adminChatShowTyping = function(sessionCode, isTyping) {
      if (isTyping) showPlayerTyping(sessionCode);
      else hidePlayerTyping(sessionCode);
    };

    window.adminChatUpdateOnlineStatus = function(sessionCode, online, lastSeen, sinceTs) {
      // Update local cache as fallback for when wsManager hasn't seen events yet
      const lastSeenTs = lastSeen ? new Date(lastSeen).getTime() : null;
      const parsedSinceTs = sinceTs ? new Date(sinceTs).getTime() : null;
      _playerOnlineCache[sessionCode] = { online: !!online, lastSeenTs, sinceTs: parsedSinceTs };

      // If this is the currently open session, (re)start the live ticker
      if (sessionCode === state.selectedSessionCode) {
        _refreshOnlineStatusUI(sessionCode);
      }
    };

    // Called when player reads admin messages (mark-seen event)
    window.adminChatMarkSeen = function(sessionCode, seenAt) {
      // Persist in memory so renderMessages shows correct state until DB poll
      state.seenSessions.add(sessionCode);
      const parsedSeenAt = new Date(seenAt || Date.now()).getTime();
      state.seenSessionAt[sessionCode] = Number.isFinite(parsedSeenAt) && parsedSeenAt > 0 ? parsedSeenAt : Date.now();
      // Re-render if this is the currently open session
      if (sessionCode === state.selectedSessionCode) {
        renderMessages();
      }
    };

    // Called by handleChatMessage in adminDashboard.ejs when a new player message arrives
    window.adminChatHandleNewMessage = function(payload) {
      const sessionCode = payload?.sessionCode || payload?.session_code;
      if (!sessionCode) return;
      state.typingSessionCodes.delete(sessionCode);
      clearTimeout(state.playerTypingTimers[sessionCode]);
      const incomingMessage = normalizeIncomingPayloadMessage(payload);
      const isSelected = sessionCode === state.selectedSessionCode;
      if (!isSelected) {
        state.forceClearedUnread.delete(sessionCode);
      }
      // If this session is currently open, reload its messages in real-time
      if (isSelected) {
        hidePlayerTyping(sessionCode);
        const appended = enqueueIncomingMessage(sessionCode, incomingMessage);
        // Keep unread at zero for currently handled conversation.
        state.forceClearedUnread.add(sessionCode);
        const selectedSession = state.sessions.find((s) => s.session_code === sessionCode);
        if (selectedSession) {
          selectedSession.unread_count = 0;
          if (!['closed', 'archived'].includes(String(selectedSession.status || '').toLowerCase())) {
            selectedSession.status = 'active';
          }
        }
        state.unreadTotal = state.sessions.reduce((sum, s) => sum + Number(s.unread_count || 0), 0);
        updateNavbarUnreadBadge(state.unreadTotal, false);
        updateConversationToggleUnreadBadge(state.unreadTotal);
        renderSessionList();

        api(`/api/chat/admin/chat/${encodeURIComponent(sessionCode)}/mark-read`, { method: 'PUT' }).catch(() => {});
        if (!appended) {
          // Fallback when payload does not contain enough data to append directly.
          state.forceNextMessagePoll = true;
          if (shouldPollMessages()) {
            loadMessages(sessionCode, { forceImmediate: true }).catch(() => {});
            startPolling(1);
          }
          scheduleMessageFetchRetries(sessionCode);
        }
        queueSessionRefresh();
      } else {
        // Just refresh the session list so unread count updates
        bumpConversation(sessionCode);
        queueSessionRefresh();
      }
    };

    window.adminChatHandleEditedMessage = function(payload) {
      const sessionCode = payload?.sessionCode || payload?.session_code;
      const editedMessage = payload?.message;
      if (!sessionCode || !editedMessage) return;

      if (sessionCode === state.selectedSessionCode) {
        const index = state.messages.findIndex((m) => String(m.id) === String(editedMessage.id));
        if (index >= 0) {
          state.messages[index] = { ...state.messages[index], ...editedMessage };
          if (state.editingMessageId !== null && String(state.editingMessageId) === String(editedMessage.id)) {
            detachCurrentEditMessageEditor();
            state.editingMessageId = null;
            state.editingDraftText = '';
          }
          renderMessages({ forceImmediate: true });
        } else {
          // Message ID not found in current state — this can happen during race conditions
          // (SSE arrives before or after a full reload). Do NOT call loadMessages here:
          // a forceImmediate reload would replace state.messages and can make messages
          // "disappear" while the admin is actively reading/writing. The next natural
          // digest-based poll will pick up the change safely.
        }
      }

      queueSessionRefresh();
    };
  }

  async function init() {
    if (window.LMB_DISABLE_SSE) {
      state.pollingInterval = 2000;
      state.pollingBaseInterval = 2000;
      state.pollingMaxInterval = 5000;
    }
    const root = byId('panel-customer-care');
    if (!root) return;

    // Setup SSE callbacks early so health events can suppress fallback polling.
    setupSSEListeners();

    bindEvents();
    root.classList.add('cc-advanced-filters-collapsed');
    const filterToggleBtn = byId('ccToggleAdvancedFiltersBtn');
    if (filterToggleBtn) {
      filterToggleBtn.classList.remove('is-open');
      filterToggleBtn.setAttribute('aria-expanded', 'false');
    }
    refreshPaneToggleUi();
    applyCompactDesktopDefaults();
    setMobileScreen('list');
    initEmojiPicker();
    loadVisualSettings().catch(() => {});
    autoResizeInput(byId('ccInput'));
    if (window.CcTiptap) {
      CcTiptap.init({
        onSend: async () => {
          try { await sendMessage(); } catch (err) { alert(err.message || 'Không gửi được tin nhắn'); }
        },
        onInput: () => { emitAdminTyping(); },
        onPasteImage: async (files) => {
          try {
            await uploadFiles(files, { source: 'paste' });
          } catch (err) {
            alert(err.message || 'Không gửi được ảnh đã dán');
          }
        }
      });
    }
    try {
      await loadSessions();
      await loadMessages(state.selectedSessionCode);
      renderDetails();
      if (isCustomerCarePanelVisible()) {
        updateNavbarUnreadBadge(state.unreadTotal, false);
      }
      if (window.LMB_DISABLE_SSE) {
        startPolling(1);
      } else {
        stopPolling();
      }
    } catch (err) {
      byId('ccConversationList').innerHTML = `<div class="cc-conv-sub" style="padding:12px;">${safe(err.message || 'Không tải được dữ liệu')}</div>`;
    }
    // Load admin presence on init and refresh every 30s
    loadAdminPresence();
    if (state._presenceTimer) clearInterval(state._presenceTimer);
    state._presenceTimer = setInterval(() => {
      if (isCustomerCarePanelVisible()) loadAdminPresence();
    }, 30000);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden || !isCustomerCarePanelVisible()) {
      stopPolling();
    } else if (!state.sseConnected && isCustomerCarePanelVisible()) {
      // Tab became visible again — restart polling if SSE is not connected
      startPolling(1);
    }
  });

  // Fired by customer-care.ejs when the CSKH panel active state changes.
  window.addEventListener('cc:visibility', (event) => {
    const visible = !!event?.detail?.visible;
    if (!visible) {
      stopPolling();
    } else if (!state.sseConnected) {
      // CSKH panel became visible — restart polling if SSE is not connected
      startPolling(1);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
