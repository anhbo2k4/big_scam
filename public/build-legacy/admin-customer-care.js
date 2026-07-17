function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function adminCustomerCareModule() {
  var state = {
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
    lastRenderedMessageTs: {},
    // sessionCode -> latest rendered message timestamp
    playerTypingTimers: {},
    // sessionCode -> timeout
    typingSessionCodes: new Set(),
    seenSessions: new Set(),
    // kept for backward compatibility
    seenSessionAt: {},
    // sessionCode -> latest seen timestamp from player
    forceClearedUnread: new Set(),
    // sessionCodes force-cleared after admin reply
    composerBusy: false,
    recentBumpedSessions: {},
    // sessionCode -> expiresAt(ms)
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
    expandedIpGroups: new Set() // IPs whose group is expanded in the session list
  };
  var DEFAULT_SUPPORT_DISPLAY_NAME = 'CSKH Mạnh Lâm TaoBao';
  var CURRENT_ADMIN_ID = Number(window.CURRENT_ADMIN_ID || window.__CURRENT_ADMIN_ID || 0) || null;
  var CURRENT_ADMIN_USERNAME = String(window.CURRENT_ADMIN_USERNAME || window.__CURRENT_ADMIN_USERNAME || 'admin').trim() || 'admin';
  var CURRENT_ADMIN_FULL_NAME = String(window.CURRENT_ADMIN_FULL_NAME || '').trim();
  var CURRENT_ADMIN_DISPLAY_NAME = CURRENT_ADMIN_FULL_NAME || DEFAULT_SUPPORT_DISPLAY_NAME;
  function getAdminDisplayNameByIdentity() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      adminId = _ref.adminId,
      username = _ref.username,
      _ref$fallbackName = _ref.fallbackName,
      fallbackName = _ref$fallbackName === void 0 ? '' : _ref$fallbackName;
    var list = Array.isArray(state.adminPresenceList) ? state.adminPresenceList : [];
    var normalizedId = Number(adminId || 0) || null;
    var normalizedUsername = String(username || '').trim().toLowerCase();
    if (normalizedId) {
      var _byId = list.find(function (u) {
        return Number((u === null || u === void 0 ? void 0 : u.id) || 0) === normalizedId;
      });
      var nameById = String((_byId === null || _byId === void 0 ? void 0 : _byId.full_name) || (_byId === null || _byId === void 0 ? void 0 : _byId.username) || '').trim();
      if (nameById) return nameById;
    }
    if (normalizedUsername) {
      var byUsername = list.find(function (u) {
        return String((u === null || u === void 0 ? void 0 : u.username) || '').trim().toLowerCase() === normalizedUsername;
      });
      var nameByUsername = String((byUsername === null || byUsername === void 0 ? void 0 : byUsername.full_name) || (byUsername === null || byUsername === void 0 ? void 0 : byUsername.username) || '').trim();
      if (nameByUsername) return nameByUsername;
    }
    return String(fallbackName || '').trim();
  }
  function getCurrentAdminDisplayName() {
    var liveName = getAdminDisplayNameByIdentity({
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
    var root = getCustomerCareRoot();
    var convBtn = byId('ccToggleConversationsBtn');
    var infoBtn = byId('ccToggleInfoBtn');
    if (!root) return;
    var convOpen = !root.classList.contains('cc-hide-conversations');
    var infoOpen = !root.classList.contains('cc-hide-info');
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
    var root = getCustomerCareRoot();
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
    state.paneAnimationTimer = setTimeout(function () {
      root.classList.remove('cc-pane-animating');
      state.paneAnimationTimer = null;
    }, 280);
    refreshPaneToggleUi();
  }
  function updateConversationToggleUnreadBadge(totalUnread) {
    var badge = byId('ccToggleConversationsCount');
    if (!badge) return;
    var total = Number(totalUnread || 0);
    badge.textContent = total > 99 ? '99+' : String(total);
    badge.classList.toggle('has-count', total > 0);
  }
  function setComposerBusy(isBusy) {
    state.composerBusy = !!isBusy;
    var panel = byId('panel-customer-care');
    var sendBtn = byId('ccSendBtn');
    var attachBtn = byId('ccAttachBtn');
    var imageBtn = byId('ccImageBtn');
    var inputRow = document.querySelector('#panel-customer-care .cc-input-row');
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
    var root = getCustomerCareRoot();
    if (!root) return;
    var w = window.innerWidth;
    if (w > 1300 && w <= 1450) {
      root.classList.add('cc-hide-info');
    } else if (w > 1450) {
      // Restore default when user grows the window
      root.classList.remove('cc-hide-info');
    }
  }
  function setMobileScreen(screen) {
    var panel = byId('panel-customer-care');
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
    var panel = byId('panel-customer-care');
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
    state.pendingSessionRefreshTimer = setTimeout(function () {
      state.pendingSessionRefreshTimer = null;
      loadSessions().catch(function () {});
    }, 250);
  }
  function getCurrentNearBottom() {
    var box = byId('ccMessages');
    if (!box) return false;
    return box.scrollHeight - (box.scrollTop + box.clientHeight) <= 80;
  }
  function openInfoSheet() {
    var panel = byId('panel-customer-care');
    if (!panel) return;
    panel.classList.add('cc-info-sheet-open');
  }
  function closeInfoSheet() {
    var panel = byId('panel-customer-care');
    if (!panel) return;
    panel.classList.remove('cc-info-sheet-open');
  }
  function syncInfoSheetFromDetails() {
    var copyText = function copyText(fromId, toId) {
      var from = byId(fromId);
      var to = byId(toId);
      if (!to) return;
      to.textContent = ((from === null || from === void 0 ? void 0 : from.textContent) || '--').trim() || '--';
    };
    var copyHtml = function copyHtml(fromId, toId) {
      var from = byId(fromId);
      var to = byId(toId);
      if (!to) return;
      to.innerHTML = String((from === null || from === void 0 ? void 0 : from.innerHTML) || '').trim() || getDefaultPersonAvatarSvg();
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
    var d = new Date(raw || Date.now());
    if (Number.isNaN(d.getTime())) return '--:--';
    var dd = String(d.getDate()).padStart(2, '0');
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var hh = String(d.getHours()).padStart(2, '0');
    var mi = String(d.getMinutes()).padStart(2, '0');
    return "".concat(dd, "/").concat(mm, " ").concat(hh, ":").concat(mi);
  }
  function fmtDate(raw) {
    var d = new Date(raw || Date.now());
    if (Number.isNaN(d.getTime())) return '--/--/----';
    return d.toLocaleDateString('vi-VN');
  }
  function messageTimestamp(message) {
    var ts = new Date((message === null || message === void 0 ? void 0 : message.created_at) || (message === null || message === void 0 ? void 0 : message.createdAt) || (message === null || message === void 0 ? void 0 : message.updated_at) || 0).getTime();
    return Number.isFinite(ts) && ts > 0 ? ts : 0;
  }
  function safe(v) {
    return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /**
   * Render a chat message body safely.
   * Plain text → HTML-escaped. Rich-text HTML (from Tiptap) → sanitized HTML.
   * Allowlist: b, i, u, strong, em, span (color/font-size only), br, p, div.
   */
  function renderMessageBody(raw) {
    var text = String(raw || '');
    if (!text) return '';
    if (!/<[a-z][\s\S]*?>/i.test(text)) {
      return safe(text).replace(/\n/g, '<br>');
    }
    var ALLOWED = new Set(['b', 'i', 'u', 'strong', 'em', 'span', 'br', 'p', 'div', 'ol', 'ul', 'li']);
    var tmp = document.createElement('div');
    tmp.innerHTML = text;
    (function clean(node) {
      Array.from(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) return;
        if (child.nodeType !== 1) {
          child.remove();
          return;
        }
        var tag = child.tagName.toLowerCase();
        if (!ALLOWED.has(tag)) {
          while (child.firstChild) node.insertBefore(child.firstChild, child);
          child.remove();
          return;
        }
        Array.from(child.attributes).forEach(function (attr) {
          if (tag === 'span' && attr.name === 'style') {
            child.setAttribute('style', attr.value.split(';').filter(function (s) {
              return /^\s*(color|font-size)\s*:/i.test(s);
            }).join(';'));
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
    var raw = String(text || '').replace(/\r\n?/g, '\n').replace(/\u00a0/g, ' ').trim();
    if (!raw) return '';
    return raw.split(/\n{2,}/).map(function (block) {
      return "<p>".concat(safe(block).replace(/\n/g, '<br>'), "</p>");
    }).join('');
  }
  function shouldPreferPlainTextPaste(rawHtml) {
    var html = String(rawHtml || '');
    if (!html) return true;
    if (/class=(["'])?Mso/i.test(html)) return true;
    if (/docs-internal-guid/i.test(html)) return true;
    if (/<table[\s>]/i.test(html)) return true;
    var noisyAttrs = (html.match(/\s(?:class|style|lang|width|height|align|data-[\w-]+)=/gi) || []).length;
    return noisyAttrs >= 18;
  }
  function normalizeClipboardRichText(clipboardData) {
    if (!clipboardData) return '';
    var rawHtml = String(clipboardData.getData('text/html') || '').trim();
    var rawText = String(clipboardData.getData('text/plain') || '').trim();
    if (rawHtml && !shouldPreferPlainTextPaste(rawHtml)) {
      var sanitized = renderMessageBody(rawHtml).replace(/<(p|div)>\s*<\/\1>/gi, '<br>').replace(/(<br>\s*){3,}/gi, '<br><br>').trim();
      if (sanitized) return sanitized;
    }
    return plainTextToRichHtml(rawText);
  }
  function insertHtmlIntoEditable(editor, html) {
    var target = editor;
    var content = String(html || '').trim();
    if (!target || !content) return;
    target.focus();
    try {
      document.execCommand('insertHTML', false, content);
      return;
    } catch (_) {}
    var selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    var range = selection.getRangeAt(0);
    range.deleteContents();
    var fragment = range.createContextualFragment(content);
    var lastNode = fragment.lastChild;
    range.insertNode(fragment);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  function escapeCssSelectorValue(value) {
    var raw = String(value || '');
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(raw);
    }
    return raw.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  }
  function normalizeHexColor(hex) {
    var raw = String(hex || '').trim();
    if (!raw) return '';
    if (/^#[0-9a-f]{6}$/i.test(raw)) return raw;
    if (/^#[0-9a-f]{3}$/i.test(raw)) {
      return "#".concat(raw.slice(1).split('').map(function (ch) {
        return ch + ch;
      }).join(''));
    }
    return '';
  }
  function hexToRgb(hex) {
    var normalized = normalizeHexColor(hex);
    if (!normalized) return null;
    var value = normalized.slice(1);
    return {
      r: Number.parseInt(value.slice(0, 2), 16),
      g: Number.parseInt(value.slice(2, 4), 16),
      b: Number.parseInt(value.slice(4, 6), 16)
    };
  }
  function rgbToHex(r, g, b) {
    var clamp = function clamp(v) {
      return Math.max(0, Math.min(255, Math.round(Number(v) || 0)));
    };
    var toHex = function toHex(v) {
      return clamp(v).toString(16).padStart(2, '0');
    };
    return "#".concat(toHex(r)).concat(toHex(g)).concat(toHex(b));
  }
  function mixHex(hexA, hexB) {
    var weightB = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var a = hexToRgb(hexA);
    var b = hexToRgb(hexB);
    if (!a && !b) return '#111827';
    if (!a) return normalizeHexColor(hexB) || '#111827';
    if (!b) return normalizeHexColor(hexA) || '#111827';
    var w = Math.max(0, Math.min(1, Number(weightB) || 0));
    var wa = 1 - w;
    return rgbToHex(a.r * wa + b.r * w, a.g * wa + b.g * w, a.b * wa + b.b * w);
  }
  function relativeLuminance(hex) {
    var rgb = hexToRgb(hex);
    if (!rgb) return 0;
    var channel = function channel(n) {
      var c = (Number(n) || 0) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
  }
  function autoResizeInput(el) {
    if (!el) return;
    var minHeight = 40;
    var maxHeight = 120; // 3x the default input height
    if (state.inputResizeRaf) {
      cancelAnimationFrame(state.inputResizeRaf);
      state.inputResizeRaf = 0;
    }
    state.inputResizeRaf = requestAnimationFrame(function () {
      el.style.height = "".concat(minHeight, "px");
      var nextHeight = Math.min(el.scrollHeight, maxHeight);
      var finalHeight = Math.max(minHeight, nextHeight);
      if (Math.abs(finalHeight - Number(state.inputHeight || minHeight)) > 0.5) {
        state.inputHeight = finalHeight;
      }
      el.style.height = "".concat(state.inputHeight, "px");
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
      state.inputResizeRaf = 0;
    });
  }
  function getMessageDigest(messages) {
    if (!Array.isArray(messages) || messages.length === 0) return '0';
    var last = messages[messages.length - 1] || {};
    var lastId = String(last.id || '');
    var lastTs = String(last.updated_at || last.created_at || '');
    var lastSize = String((last.message || '').length);
    return "".concat(messages.length, "|").concat(lastId, "|").concat(lastTs, "|").concat(lastSize);
  }
  function updatePollingProfile() {
    var base = 60000;
    if (state.pollingBaseInterval === base && state.pollingInterval === base && state.pollingMaxInterval === base) return;
    state.pollingBaseInterval = base;
    state.pollingInterval = base;
    state.pollingMaxInterval = base;
    restartPollingTimer();
  }
  var CHAT_THEME_PRESETS = {
    messenger: {
      text: '#f1f5f9',
      bg: '#0f172a',
      theirsBg: '#1f2937',
      mineBg: '#2563eb',
      theirsText: '#e2e8f0',
      mineText: '#ffffff',
      bgPattern: 'grid'
    },
    telegram: {
      text: '#e2e8f0',
      bg: '#0b1220',
      theirsBg: '#1e293b',
      mineBg: '#0ea5e9',
      theirsText: '#e2e8f0',
      mineText: '#ffffff',
      bgPattern: 'grid'
    },
    dark: {
      text: '#f1f5f9',
      bg: '#111827',
      theirsBg: '#1f2937',
      mineBg: '#374151',
      theirsText: '#f1f5f9',
      mineText: '#ffffff',
      bgPattern: 'solid'
    },
    ocean: {
      text: '#e0f2fe',
      bg: '#082f49',
      theirsBg: '#0c4a6e',
      mineBg: '#0ea5e9',
      theirsText: '#e0f2fe',
      mineText: '#ffffff',
      bgPattern: 'waves'
    },
    sunset: {
      text: '#fff7ed',
      bg: '#3f1d2e',
      theirsBg: '#5b2140',
      mineBg: '#f97316',
      theirsText: '#fff1f2',
      mineText: '#ffffff',
      bgPattern: 'waves'
    },
    forest: {
      text: '#ecfdf5',
      bg: '#052e16',
      theirsBg: '#14532d',
      mineBg: '#16a34a',
      theirsText: '#d1fae5',
      mineText: '#ffffff',
      bgPattern: 'dots'
    },
    rose: {
      text: '#fdf2f8',
      bg: '#3f0b24',
      theirsBg: '#6b2149',
      mineBg: '#ec4899',
      theirsText: '#fbcfe8',
      mineText: '#ffffff',
      bgPattern: 'dots'
    },
    mono: {
      text: '#f3f4f6',
      bg: '#0f172a',
      theirsBg: '#1f2937',
      mineBg: '#4b5563',
      theirsText: '#e5e7eb',
      mineText: '#ffffff',
      bgPattern: 'grid'
    },
    daylight: {
      text: '#0f172a',
      bg: '#f8fafc',
      theirsBg: '#e5e7eb',
      mineBg: '#2563eb',
      theirsText: '#0f172a',
      mineText: '#ffffff',
      bgPattern: 'solid'
    },
    mintlight: {
      text: '#064e3b',
      bg: '#f0fdfa',
      theirsBg: '#d1fae5',
      mineBg: '#10b981',
      theirsText: '#065f46',
      mineText: '#ffffff',
      bgPattern: 'dots'
    },
    skyglass: {
      text: '#0f172a',
      bg: '#eff6ff',
      theirsBg: '#e2e8f0',
      mineBg: '#0ea5e9',
      theirsText: '#0f172a',
      mineText: '#ffffff',
      bgPattern: 'grid'
    },
    peachcream: {
      text: '#7c2d12',
      bg: '#fff7ed',
      theirsBg: '#fed7aa',
      mineBg: '#ea580c',
      theirsText: '#7c2d12',
      mineText: '#ffffff',
      bgPattern: 'solid'
    },
    lavenderpaper: {
      text: '#4c1d95',
      bg: '#faf5ff',
      theirsBg: '#e9d5ff',
      mineBg: '#7c3aed',
      theirsText: '#4c1d95',
      mineText: '#ffffff',
      bgPattern: 'dots'
    },
    sandstone: {
      text: '#134e4a',
      bg: '#fafaf9',
      theirsBg: '#d6d3d1',
      mineBg: '#0f766e',
      theirsText: '#134e4a',
      mineText: '#ffffff',
      bgPattern: 'solid'
    }
  };
  var currentChatBgPattern = 'solid';
  var currentThemePresetKey = '';
  function getChatBgPatternCss(pattern) {
    var key = String(pattern || 'solid').toLowerCase();
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
    var buttons = document.querySelectorAll('.cc-theme-card');
    buttons.forEach(function (btn) {
      var active = String(btn.getAttribute('data-cc-theme') || '').toLowerCase() === currentThemePresetKey;
      btn.classList.toggle('active', active);
    });
  }
  function applyChatFrameStyle(textColor, bgColor, bubbleTheirsColor, bubbleMineColor, bgPattern) {
    var _byId2, _byId3;
    var root = byId('panel-customer-care');
    if (!root) return;
    var safeText = normalizeHexColor(textColor) || '#f1f5f9';
    var safeBg = normalizeHexColor(bgColor) || '#111827';
    var safeTheirs = normalizeHexColor(bubbleTheirsColor) || safeBg;
    var safeMine = normalizeHexColor(bubbleMineColor) || safeBg;
    var safeTextTheirs = normalizeHexColor(((_byId2 = byId('ccTextTheirsColorText')) === null || _byId2 === void 0 ? void 0 : _byId2.value) || '') || safeText;
    var safeTextMine = normalizeHexColor(((_byId3 = byId('ccTextMineColorText')) === null || _byId3 === void 0 ? void 0 : _byId3.value) || '') || '#ffffff';
    var isLightTheme = relativeLuminance(safeBg) >= 0.57;
    var convBg = isLightTheme ? mixHex(safeBg, '#dbe3ec', 0.42) : mixHex(safeBg, '#2a313d', 0.62);
    var convHoverBg = isLightTheme ? mixHex(convBg, '#cfd8e3', 0.3) : mixHex(convBg, '#3b4452', 0.34);
    var convActiveBg = isLightTheme ? mixHex(convBg, safeMine, 0.24) : mixHex(convBg, safeMine, 0.29);
    var convBorderHover = isLightTheme ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.08)';
    var convBorderActive = isLightTheme ? 'rgba(15,23,42,0.2)' : 'rgba(255,255,255,0.16)';
    var convPreviewText = isLightTheme ? mixHex(safeTextTheirs, '#334155', 0.5) : mixHex(safeTextTheirs, '#d1d9e6', 0.55);
    var convTimeText = isLightTheme ? mixHex(safeTextTheirs, '#475569', 0.56) : mixHex(safeTextTheirs, '#94a3b8', 0.62);
    var personAvatarBg = isLightTheme ? mixHex(safeBg, '#d5dce5', 0.72) : mixHex(safeBg, '#c7d0db', 0.78);
    var msgAvatarTheirsBg = mixHex(safeTheirs, personAvatarBg, 0.52);
    var msgAvatarMineBg = mixHex(safeMine, personAvatarBg, isLightTheme ? 0.3 : 0.2);
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
    var _byId4, _byId5, _byId6, _byId7;
    applyChatFrameStyle((_byId4 = byId('ccChatTextColorText')) === null || _byId4 === void 0 ? void 0 : _byId4.value, (_byId5 = byId('ccChatBgColorText')) === null || _byId5 === void 0 ? void 0 : _byId5.value, (_byId6 = byId('ccBubbleTheirsColorText')) === null || _byId6 === void 0 ? void 0 : _byId6.value, (_byId7 = byId('ccBubbleMineColorText')) === null || _byId7 === void 0 ? void 0 : _byId7.value, currentChatBgPattern);
  }
  function syncColorPair(pickerId, textId) {
    var picker = byId(pickerId);
    var text = byId(textId);
    if (!picker && !text) return;
    var syncing = false;
    var commitColor = function commitColor(raw, source) {
      var normalized = normalizeHexColor(raw);
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
      picker.addEventListener('input', function () {
        return commitColor(picker.value, 'picker');
      });
      picker.addEventListener('change', function () {
        return commitColor(picker.value, 'picker');
      });
    }
    if (text) {
      text.addEventListener('input', function () {
        var normalized = normalizeHexColor(text.value);
        if (normalized) {
          commitColor(normalized, 'text');
          return;
        }
        clearActiveThemePreset();
      });
      text.addEventListener('blur', function () {
        var normalized = normalizeHexColor(text.value);
        if (normalized) {
          commitColor(normalized, 'text');
          return;
        }
        if (picker !== null && picker !== void 0 && picker.value) {
          text.value = picker.value;
          return;
        }
        var fallback = '#111827';
        text.value = fallback;
        if (picker) picker.value = fallback;
        applyChatFrameStyleFromInputs();
      });
    }
  }
  function getDisplayCustomerName(session) {
    var meta = getSessionMeta(session || {});
    return String(meta.customerNickname || (session === null || session === void 0 ? void 0 : session.customer_name) || 'Khách hàng').trim();
  }
  function getMessageMeta(message) {
    if (message && message.metadata && _typeof(message.metadata) === 'object') {
      return message.metadata;
    }
    if (typeof (message === null || message === void 0 ? void 0 : message.metadata) === 'string') {
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
    var meta = getMessageMeta(message);
    var senderAdminId = Number(meta.sender_admin_id || 0) || null;
    var senderAdminUsername = String(meta.sender_admin_username || '').trim().toLowerCase();
    var currentAdminUsername = String(CURRENT_ADMIN_USERNAME || '').trim().toLowerCase();
    if (senderAdminId && CURRENT_ADMIN_ID && senderAdminId !== CURRENT_ADMIN_ID) return false;
    if (!senderAdminId && senderAdminUsername && currentAdminUsername && senderAdminUsername !== currentAdminUsername) return false;
    return true;
  }
  function canEditSupportMessage(message) {
    if (!canManageOwnSupportMessage(message)) return false;
    var messageType = String(message.message_type || 'text').toLowerCase();
    return messageType === 'text';
  }
  function getSupportSenderName(message, fallbackName) {
    var preferredCurrentName = String(fallbackName || getCurrentAdminDisplayName() || DEFAULT_SUPPORT_DISPLAY_NAME).trim();
    if (preferredCurrentName && canEditSupportMessage(message)) {
      return preferredCurrentName;
    }
    var meta = getMessageMeta(message);
    var senderAdminId = Number(meta.sender_admin_id || 0) || null;
    var senderAdminUsername = String(meta.sender_admin_username || '').trim().toLowerCase();
    var currentAdminUsername = String(CURRENT_ADMIN_USERNAME || '').trim().toLowerCase();

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
    var fromPresence = getAdminDisplayNameByIdentity({
      adminId: senderAdminId,
      username: senderAdminUsername,
      fallbackName: ''
    });
    if (fromPresence) return fromPresence;
    var fromMeta = String(meta.sender_admin_full_name || meta.sender_admin_username || '').trim();
    if (fromMeta) return fromMeta;
    var fromMessage = String((message === null || message === void 0 ? void 0 : message.sender_name) || '').trim();
    if (fromMessage) return fromMessage;
    return preferredCurrentName || DEFAULT_SUPPORT_DISPLAY_NAME;
  }
  function isMessageEdited(message) {
    var meta = getMessageMeta(message);
    return !!meta.edited_at;
  }
  function loadVisualSettings() {
    return _loadVisualSettings.apply(this, arguments);
  }
  function _loadVisualSettings() {
    _loadVisualSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
      var root, _rs$data, rs, chatCfg, textColor, chatBgColor, bubbleTheirsColor, bubbleMineColor, textTheirsColor, textMineColor, textPicker, textInput, bgPicker, bgInput, theirsPicker, theirsInput, minePicker, mineInput, textTheirsPicker, textTheirsInput, textMinePicker, textMineInput, groupEnabledInput, groupWindowInput, swipeDismissInput, groupEnabled, groupWindowMs, swipeDismissEnabled, _t18;
      return _regenerator().w(function (_context27) {
        while (1) switch (_context27.p = _context27.n) {
          case 0:
            root = byId('panel-customer-care');
            if (root) {
              _context27.n = 1;
              break;
            }
            return _context27.a(2);
          case 1:
            _context27.p = 1;
            _context27.n = 2;
            return api('/api/settings', {
              timeoutMs: 1200
            });
          case 2:
            rs = _context27.v;
            chatCfg = (rs === null || rs === void 0 || (_rs$data = rs.data) === null || _rs$data === void 0 ? void 0 : _rs$data.chat) || {};
            textColor = normalizeHexColor(chatCfg.adminChatTextColor || chatCfg.textColor || '') || '#f1f5f9';
            chatBgColor = normalizeHexColor(chatCfg.adminChatBgColor || '') || '#111827';
            bubbleTheirsColor = normalizeHexColor(chatCfg.adminBubbleCustomerColor || '') || chatBgColor;
            bubbleMineColor = normalizeHexColor(chatCfg.adminBubbleAdminColor || '') || chatBgColor;
            textTheirsColor = normalizeHexColor(chatCfg.adminTextCustomerColor || '') || textColor;
            textMineColor = normalizeHexColor(chatCfg.adminTextAdminColor || '') || '#ffffff';
            currentChatBgPattern = String(chatCfg.adminChatBgPattern || 'solid').toLowerCase();
            currentThemePresetKey = String(chatCfg.adminChatThemeKey || '').toLowerCase();
            textPicker = byId('ccChatTextColor');
            textInput = byId('ccChatTextColorText');
            bgPicker = byId('ccChatBgColor');
            bgInput = byId('ccChatBgColorText');
            theirsPicker = byId('ccBubbleTheirsColor');
            theirsInput = byId('ccBubbleTheirsColorText');
            minePicker = byId('ccBubbleMineColor');
            mineInput = byId('ccBubbleMineColorText');
            textTheirsPicker = byId('ccTextTheirsColor');
            textTheirsInput = byId('ccTextTheirsColorText');
            textMinePicker = byId('ccTextMineColor');
            textMineInput = byId('ccTextMineColorText');
            groupEnabledInput = byId('ccToastGroupEnabled');
            groupWindowInput = byId('ccToastGroupWindowMs');
            swipeDismissInput = byId('ccToastSwipeDismissEnabled');
            groupEnabled = chatCfg.adminToastGroupEnabled !== false;
            groupWindowMs = Math.max(0, Math.min(6000, Number(chatCfg.adminToastGroupWindowMs || 2000) || 2000));
            swipeDismissEnabled = chatCfg.adminToastSwipeDismissEnabled !== false;
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
            _context27.n = 4;
            break;
          case 3:
            _context27.p = 3;
            _t18 = _context27.v;
            currentChatBgPattern = 'solid';
            currentThemePresetKey = '';
            applyChatFrameStyle('#f1f5f9', '#111827', '#111827', '#111827', currentChatBgPattern);
            setActiveThemePreset('');
          case 4:
            return _context27.a(2);
        }
      }, _callee27, null, [[1, 3]]);
    }));
    return _loadVisualSettings.apply(this, arguments);
  }
  function saveChatFrameStyle() {
    return _saveChatFrameStyle.apply(this, arguments);
  }
  function _saveChatFrameStyle() {
    _saveChatFrameStyle = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28() {
      var _byId67, _byId68, _byId69, _byId70, _byId71, _byId72, _byId73, _byId74, _byId75;
      var options,
        _options$silent,
        silent,
        textColor,
        bgColor,
        bubbleTheirsColor,
        bubbleMineColor,
        textTheirsColor,
        textMineColor,
        toastGroupEnabled,
        toastGroupWindowMs,
        toastSwipeDismissEnabled,
        _args28 = arguments;
      return _regenerator().w(function (_context28) {
        while (1) switch (_context28.n) {
          case 0:
            options = _args28.length > 0 && _args28[0] !== undefined ? _args28[0] : {};
            _options$silent = options.silent, silent = _options$silent === void 0 ? false : _options$silent;
            textColor = normalizeHexColor(((_byId67 = byId('ccChatTextColorText')) === null || _byId67 === void 0 ? void 0 : _byId67.value) || '') || '#f1f5f9';
            bgColor = normalizeHexColor(((_byId68 = byId('ccChatBgColorText')) === null || _byId68 === void 0 ? void 0 : _byId68.value) || '') || '#111827';
            bubbleTheirsColor = normalizeHexColor(((_byId69 = byId('ccBubbleTheirsColorText')) === null || _byId69 === void 0 ? void 0 : _byId69.value) || '') || bgColor;
            bubbleMineColor = normalizeHexColor(((_byId70 = byId('ccBubbleMineColorText')) === null || _byId70 === void 0 ? void 0 : _byId70.value) || '') || bgColor;
            textTheirsColor = normalizeHexColor(((_byId71 = byId('ccTextTheirsColorText')) === null || _byId71 === void 0 ? void 0 : _byId71.value) || '') || textColor;
            textMineColor = normalizeHexColor(((_byId72 = byId('ccTextMineColorText')) === null || _byId72 === void 0 ? void 0 : _byId72.value) || '') || '#ffffff';
            toastGroupEnabled = ((_byId73 = byId('ccToastGroupEnabled')) === null || _byId73 === void 0 ? void 0 : _byId73.checked) !== false;
            toastGroupWindowMs = Math.max(0, Math.min(6000, Number(((_byId74 = byId('ccToastGroupWindowMs')) === null || _byId74 === void 0 ? void 0 : _byId74.value) || 2000) || 2000));
            toastSwipeDismissEnabled = ((_byId75 = byId('ccToastSwipeDismissEnabled')) === null || _byId75 === void 0 ? void 0 : _byId75.checked) !== false;
            _context28.n = 1;
            return api('/api/settings', {
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
          case 1:
            applyChatFrameStyle(textColor, bgColor, bubbleTheirsColor, bubbleMineColor, currentChatBgPattern);
            if (!silent && typeof window.showToast === 'function') {
              window.showToast('Đã lưu màu khung chat CSKH.', 'success');
            }
            if (!silent && typeof window.showNotification === 'function') {
              window.showNotification('Thành công', 'Đã lưu màu khung chat CSKH.', 'success');
            }
          case 2:
            return _context28.a(2);
        }
      }, _callee28);
    }));
    return _saveChatFrameStyle.apply(this, arguments);
  }
  function scheduleAutoSaveChatFrameStyle() {
    if (state.autoSaveStyleTimer) clearTimeout(state.autoSaveStyleTimer);
    state.autoSaveStyleTimer = setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return saveChatFrameStyle({
              silent: true
            });
          case 1:
            _context.n = 3;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
          case 3:
            return _context.a(2);
        }
      }, _callee, null, [[0, 2]]);
    })), 500);
  }
  function clearActiveThemePreset() {
    if (!currentThemePresetKey) return;
    setActiveThemePreset('');
  }
  function safeAttachmentUrl(raw) {
    var url = String(raw || '').trim();
    if (!url) return '';
    if (url.startsWith('/')) return safe(url);
    if (/^https?:\/\//i.test(url)) return safe(url);
    return '';
  }

  // ─── Voice player helpers ───────────────────────────────────────────────────
  function _ccVoiceSeed(url) {
    var s = String(url || '');
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function _ccVoiceBarsHtml(url, count) {
    var n = count || 26;
    var seed = _ccVoiceSeed(url);
    var html = '';
    for (var i = 0; i < n; i++) {
      seed = Math.imul(1664525, seed) + 1013904223 >>> 0;
      var h = Math.round(5 + (seed >>> 16) / 65535 * 22);
      html += "<span class=\"cc-vbar\" style=\"height:".concat(h, "px\"></span>");
    }
    return html;
  }
  function initCcVoiceAudio(container) {
    if (!container) return;
    container.querySelectorAll('.cc-voice-player:not([data-vp-init])').forEach(function (player) {
      player.setAttribute('data-vp-init', '1');
      var audio = player.querySelector('audio');
      var timeEl = player.querySelector('.cc-vp-time');
      var bars = Array.from(player.querySelectorAll('.cc-vbar'));
      if (!audio) return;
      var fmt = function fmt(s) {
        if (!s || !isFinite(s)) return '0:00';
        var m = Math.floor(s / 60);
        return "".concat(m, ":").concat(Math.floor(s % 60).toString().padStart(2, '0'));
      };
      audio.addEventListener('loadedmetadata', function () {
        if (timeEl) timeEl.textContent = fmt(audio.duration);
      });
      audio.addEventListener('timeupdate', function () {
        if (!audio.duration || !isFinite(audio.duration)) return;
        if (timeEl) timeEl.textContent = fmt(audio.currentTime);
        var pct = audio.currentTime / audio.duration;
        var played = Math.round(pct * bars.length);
        bars.forEach(function (b, i) {
          return b.classList.toggle('cc-vbar-played', i < played);
        });
      });
      audio.addEventListener('ended', function () {
        player.classList.remove('cc-vp-playing');
        var pi = player.querySelector('.cc-vp-play-icon');
        var pa = player.querySelector('.cc-vp-pause-icon');
        if (pi) pi.style.display = '';
        if (pa) pa.style.display = 'none';
        if (timeEl) timeEl.textContent = fmt(audio.duration);
        bars.forEach(function (b) {
          return b.classList.remove('cc-vbar-played');
        });
      });
    });
  }
  // ───────────────────────────────────────────────────────────────────────────

  function renderAttachment(message) {
    var url = safeAttachmentUrl(message === null || message === void 0 ? void 0 : message.attachment_url);
    if (!url) return '';
    var messageType = String((message === null || message === void 0 ? void 0 : message.message_type) || '').toLowerCase();
    var attachmentType = String((message === null || message === void 0 ? void 0 : message.attachment_type) || '').toLowerCase();
    var fileLabel = safe(((message === null || message === void 0 ? void 0 : message.message) || 'Tệp đính kèm').replace(/^([🖼️📎]\s*)/, ''));
    var isImage = messageType === 'image' || attachmentType.includes('image') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);
    var isAudio = attachmentType.includes('audio') || /\.(webm|ogg|mp3|wav|m4a|aac|opus)$/i.test(url);
    if (isImage) {
      return "<div class=\"cc-attachment\"><a href=\"".concat(url, "\" target=\"_blank\" rel=\"noopener noreferrer\"><img class=\"cc-attachment-img\" src=\"").concat(url, "\" alt=\"").concat(fileLabel, "\" loading=\"lazy\"></a></div>");
    }
    if (isAudio) {
      return "<div class=\"cc-voice-player\" data-vp-url=\"".concat(url, "\">\n        <button class=\"cc-vp-btn\" type=\"button\" aria-label=\"Ph\xE1t/D\u1EEBng\">\n          <svg class=\"cc-vp-play-icon\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path d=\"M6.3 4.7l9 5.3-9 5.3V4.7z\"/></svg>\n          <svg class=\"cc-vp-pause-icon\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"display:none\"><rect x=\"4\" y=\"4\" width=\"4\" height=\"12\" rx=\"1\"/><rect x=\"12\" y=\"4\" width=\"4\" height=\"12\" rx=\"1\"/></svg>\n        </button>\n        <div class=\"cc-vp-wave\">").concat(_ccVoiceBarsHtml(url), "</div>\n        <span class=\"cc-vp-time\">0:00</span>\n        <audio style=\"display:none\" preload=\"metadata\" src=\"").concat(url, "\"></audio>\n      </div>");
    }
    return "<div class=\"cc-attachment\"><a class=\"cc-attachment-file\" href=\"".concat(url, "\" target=\"_blank\" rel=\"noopener noreferrer\" download><span class=\"cc-attachment-file-icon\">FILE</span><span>").concat(fileLabel, "</span></a></div>");
  }
  function normalizeAvatarUrl(raw) {
    var url = String(raw || '').trim();
    if (!url) return '';
    if (url.startsWith('/')) return url;
    if (/^https?:\/\//i.test(url)) return url;
    return '';
  }
  function getChatAvatarHtml(_ref3) {
    var mine = _ref3.mine,
      customerName = _ref3.customerName,
      supportName = _ref3.supportName,
      customerAvatar = _ref3.customerAvatar,
      supportAvatar = _ref3.supportAvatar,
      sessionSeed = _ref3.sessionSeed;
    var displayName = mine ? supportName || '' : customerName || '';
    var rawAvatar = mine ? supportAvatar : customerAvatar;
    var avatarUrl = normalizeAvatarUrl(rawAvatar);
    var roleCls = mine ? 'mine' : 'theirs';
    var personSvg = getDefaultPersonAvatarSvg(mine ? supportName || 'support' : sessionSeed || customerName || 'guest', mine ? 'support' : 'customer');
    if (avatarUrl) {
      return "<span class=\"cc-msg-avatar ".concat(roleCls, "\"><img src=\"").concat(safe(avatarUrl), "\" alt=\"").concat(safe(displayName), "\" loading=\"lazy\"></span>");
    }
    return "<span class=\"cc-msg-avatar ".concat(roleCls, "\">").concat(personSvg, "</span>");
  }
  function applyThemePreset(kind) {
    var themeKey = String(kind || '').toLowerCase();
    var p = CHAT_THEME_PRESETS[themeKey];
    if (!p) return;
    currentChatBgPattern = p.bgPattern || 'solid';
    setActiveThemePreset(themeKey);
    var mapping = [['ccChatTextColor', 'ccChatTextColorText', p.text], ['ccChatBgColor', 'ccChatBgColorText', p.bg], ['ccBubbleTheirsColor', 'ccBubbleTheirsColorText', p.theirsBg], ['ccBubbleMineColor', 'ccBubbleMineColorText', p.mineBg], ['ccTextTheirsColor', 'ccTextTheirsColorText', p.theirsText], ['ccTextMineColor', 'ccTextMineColorText', p.mineText]];
    mapping.forEach(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 3),
        pickerId = _ref5[0],
        textId = _ref5[1],
        value = _ref5[2];
      var picker = byId(pickerId);
      var text = byId(textId);
      if (picker) picker.value = value;
      if (text) text.value = value;
    });
    applyChatFrameStyleFromInputs();
    scheduleAutoSaveChatFrameStyle();
  }
  function isSystemAutoMessage(message) {
    var senderType = String((message === null || message === void 0 ? void 0 : message.sender_type) || '').toLowerCase();
    var senderName = String((message === null || message === void 0 ? void 0 : message.sender_name) || '').trim().toLowerCase();
    if (senderType === 'bot') return true;
    if (senderName === 'bot hồng ngọc' || senderName === 'bot hong ngoc') return true;
    // Hide automated welcome/system messages sent under the generic 'CS Support' name,
    // but only when there is no real admin account behind the message (no sender_admin_id
    // in metadata). Parse metadata robustly — MySQL/Sequelize may return it as a string.
    if (senderName === 'cs support') {
      var meta = message === null || message === void 0 ? void 0 : message.metadata;
      if (typeof meta === 'string') {
        try {
          meta = JSON.parse(meta);
        } catch (_) {
          meta = null;
        }
      }
      var hasAdminId = meta && Number(meta.sender_admin_id || 0) > 0;
      if (!hasAdminId) return true;
    }
    return false;
  }
  function withNoCache(url) {
    var sep = url.includes('?') ? '&' : '?';
    return "".concat(url).concat(sep, "_ts=").concat(Date.now());
  }
  function updateNavbarUnreadBadge(totalUnread, highlight) {
    var badge = byId('ccNavbarUnread');
    if (!badge) return;
    var total = Number(totalUnread || 0);
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
    var label = increasedBy > 1 ? "B\u1EA1n c\xF3 ".concat(increasedBy, " tin nh\u1EAFn CSKH m\u1EDBi.") : 'Bạn có 1 tin nhắn CSKH mới.';
    if (typeof window.showToast === 'function') {
      window.showToast(label, 'info');
      return;
    }
    if (typeof window.showNotification === 'function') {
      window.showNotification('Tin nhắn mới', label, 'info');
    }
  }
  function api(_x) {
    return _api.apply(this, arguments);
  }
  function _api() {
    _api = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(url) {
      var options,
        startedAt,
        timeoutMs,
        fetchOptions,
        timeoutId,
        controller,
        res,
        duration,
        data,
        _args29 = arguments,
        _t19;
      return _regenerator().w(function (_context29) {
        while (1) switch (_context29.p = _context29.n) {
          case 0:
            options = _args29.length > 1 && _args29[1] !== undefined ? _args29[1] : {};
            startedAt = Date.now();
            timeoutMs = Math.max(0, Number(options.timeoutMs || 0) || 0);
            fetchOptions = _objectSpread({}, options);
            delete fetchOptions.timeoutMs;
            timeoutId = null;
            controller = timeoutMs > 0 && typeof AbortController === 'function' ? new AbortController() : null;
            if (controller) {
              timeoutId = setTimeout(function () {
                return controller.abort();
              }, timeoutMs);
            }
            _context29.p = 1;
            _context29.n = 2;
            return fetch(url, _objectSpread(_objectSpread({}, fetchOptions), {}, {
              cache: 'no-store',
              signal: controller ? controller.signal : fetchOptions.signal,
              headers: _objectSpread({
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0'
              }, fetchOptions.headers || {})
            }));
          case 2:
            res = _context29.v;
            duration = Date.now() - startedAt;
            state.avgApiLatencyMs = state.avgApiLatencyMs > 0 ? Math.round(state.avgApiLatencyMs * 0.75 + duration * 0.25) : duration;
            updatePollingProfile();
            if (duration > 1800 && Date.now() - Number(state.slowApiWarnAt || 0) > 30000) {
              state.slowApiWarnAt = Date.now();
              try {
                console.warn('[CSKH] API chậm', {
                  url: url,
                  duration: duration,
                  avgApiLatencyMs: state.avgApiLatencyMs
                });
              } catch (_) {}
            }
            _context29.n = 3;
            return res.json().catch(function () {
              return {
                success: false,
                message: 'Dữ liệu phản hồi không hợp lệ'
              };
            });
          case 3:
            data = _context29.v;
            if (!(!res.ok || data.success === false)) {
              _context29.n = 4;
              break;
            }
            throw new Error(data.message || "Request failed (".concat(res.status, ")"));
          case 4:
            return _context29.a(2, data);
          case 5:
            _context29.p = 5;
            _t19 = _context29.v;
            if (!(_t19 && _t19.name === 'AbortError')) {
              _context29.n = 6;
              break;
            }
            throw new Error('Request timed out');
          case 6:
            throw _t19;
          case 7:
            _context29.p = 7;
            if (timeoutId) clearTimeout(timeoutId);
            return _context29.f(7);
          case 8:
            return _context29.a(2);
        }
      }, _callee29, null, [[1, 5, 7, 8]]);
    }));
    return _api.apply(this, arguments);
  }
  function getSessionMeta(session) {
    var meta = {};
    if (session && session.metadata && _typeof(session.metadata) === 'object') {
      meta = session.metadata;
    } else if (session && typeof session.metadata === 'string') {
      try {
        meta = JSON.parse(session.metadata) || {};
      } catch (_) {
        meta = {};
      }
    }
    var directGameCode = String((session === null || session === void 0 ? void 0 : session.game_session_code) || (session === null || session === void 0 ? void 0 : session.gameSessionCode) || '').trim().toUpperCase();
    var metaGameCode = String(meta.game_session_code || meta.gameSessionCode || '').trim().toUpperCase();

    // Fallback for older rows that store game session in topic or generated email.
    var topicMatch = String((session === null || session === void 0 ? void 0 : session.topic) || '').toUpperCase().match(/([A-Z0-9_-]{6,20})/);
    var emailMatch = String((session === null || session === void 0 ? void 0 : session.customer_email) || '').toUpperCase().match(/^([A-Z0-9_-]{6,20})@SESSION\.LOCAL$/);
    var inferredGameCode = topicMatch && topicMatch[1] || emailMatch && emailMatch[1] || '';
    var gameSessionCode = directGameCode || metaGameCode || inferredGameCode || '--';
    var fingerprintHash = String(meta.fingerprint_hash || '').trim();
    var fingerprintShort = fingerprintHash ? "".concat(fingerprintHash.slice(0, 8), "...") : '--';
    var createdIp = String(meta.created_ip || '').trim();
    var lastSeenIp = String(meta.last_seen_ip || '').trim();
    var customerIp = String((session === null || session === void 0 ? void 0 : session.customer_ip) || lastSeenIp || createdIp || '').trim() || '--';
    var userAgent = String(meta.last_seen_user_agent || meta.user_agent || '').trim() || '--';
    var expiresAtRaw = meta.expires_at || null;
    var sessionCode = String((session === null || session === void 0 ? void 0 : session.session_code) || '').trim();
    var sessionCodeShort = sessionCode ? sessionCode.slice(-8) : '--';
    var customerNickname = String(meta.customer_nickname || '').trim();
    var customerAvatarUrl = normalizeAvatarUrl(meta.customer_avatar_url || meta.customerAvatarUrl || (session === null || session === void 0 ? void 0 : session.customer_avatar_url) || '');
    var supportAvatarUrl = normalizeAvatarUrl(meta.support_avatar_url || meta.supportAvatarUrl || '');
    var activeAdminName = String(meta.active_admin_name || '').trim();
    var activeAdminUsername = String(meta.active_admin_username || '').trim();
    var activeAdminAtRaw = meta.active_admin_at || null;
    return {
      gameSessionCode: gameSessionCode,
      adminNote: meta.admin_note || '',
      fingerprintHash: fingerprintHash,
      fingerprintShort: fingerprintShort,
      customerIp: customerIp,
      userAgent: userAgent,
      expiresAtRaw: expiresAtRaw,
      sessionCodeShort: sessionCodeShort,
      customerNickname: customerNickname,
      customerAvatarUrl: customerAvatarUrl,
      supportAvatarUrl: supportAvatarUrl,
      activeAdminName: activeAdminName,
      activeAdminUsername: activeAdminUsername,
      activeAdminAtRaw: activeAdminAtRaw
    };
  }
  function normalizeDateKey(raw) {
    var d = new Date(raw || 0);
    if (Number.isNaN(d.getTime())) return '';
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return "".concat(y, "-").concat(m, "-").concat(day);
  }
  function normalizeMonthKey(raw) {
    var d = new Date(raw || 0);
    if (Number.isNaN(d.getTime())) return '';
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    return "".concat(y, "-").concat(m);
  }
  function getAdvancedFilters() {
    var _byId8, _byId9, _byId0, _byId1;
    return {
      ip: String(((_byId8 = byId('ccIpFilter')) === null || _byId8 === void 0 ? void 0 : _byId8.value) || '').trim().toLowerCase(),
      gameSession: String(((_byId9 = byId('ccGameSessionFilter')) === null || _byId9 === void 0 ? void 0 : _byId9.value) || '').trim().toUpperCase(),
      day: String(((_byId0 = byId('ccDateFilter')) === null || _byId0 === void 0 ? void 0 : _byId0.value) || '').trim(),
      month: String(((_byId1 = byId('ccMonthFilter')) === null || _byId1 === void 0 ? void 0 : _byId1.value) || '').trim()
    };
  }
  function applyAdvancedSessionFilters(list) {
    var rows = Array.isArray(list) ? list : [];
    var f = getAdvancedFilters();
    if (!f.ip && !f.gameSession && !f.day && !f.month) return rows;
    return rows.filter(function (s) {
      var meta = getSessionMeta(s);
      var ipOk = !f.ip || String(meta.customerIp || '').toLowerCase().includes(f.ip);
      var gameOk = !f.gameSession || String(meta.gameSessionCode || '').toUpperCase().includes(f.gameSession);
      var sessionDateRaw = (s === null || s === void 0 ? void 0 : s.updated_at) || (s === null || s === void 0 ? void 0 : s.created_at) || null;
      var dayOk = !f.day || normalizeDateKey(sessionDateRaw) === f.day;
      var monthOk = !f.month || normalizeMonthKey(sessionDateRaw) === f.month;
      return ipOk && gameOk && dayOk && monthOk;
    });
  }
  function fmtDateTime(raw) {
    var d = new Date(raw || Date.now());
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
    if (!session || _typeof(session) !== 'object') return 'active';
    var rawStatus = String(session.status || '').toLowerCase();
    if (rawStatus === 'closed' || rawStatus === 'archived') return rawStatus;
    var unread = Number(session.unread_count || 0);
    if (Number.isFinite(unread) && unread > 0) return 'waiting';
    if (rawStatus === 'waiting' || rawStatus === 'active') return rawStatus;
    return 'active';
  }
  function applyStatusClass(el, status) {
    if (!el) return;
    el.classList.remove('status-active', 'status-waiting', 'status-closed', 'status-archived');
    var cls = {
      active: 'status-active',
      waiting: 'status-waiting',
      closed: 'status-closed',
      archived: 'status-archived'
    }[String(status || 'active')] || 'status-active';
    el.classList.add(cls);
  }
  function hashSessionCode(input) {
    var text = String(input || '');
    var hash = 0;
    for (var i = 0; i < text.length; i += 1) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
  function getAvatarGradientBySessionCode(sessionCode) {
    var gradients = ['linear-gradient(135deg, #0284c7, #0ea5e9, #22d3ee)', 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)', 'linear-gradient(135deg, #059669, #10b981, #22c55e)', 'linear-gradient(135deg, #ea580c, #f97316, #fb7185)', 'linear-gradient(135deg, #334155, #475569, #0f172a)', 'linear-gradient(135deg, #2563eb, #6366f1, #8b5cf6)'];
    var idx = hashSessionCode(sessionCode) % gradients.length;
    return gradients[idx];
  }
  function getConversationPreviewText(session) {
    var latestTextRaw = String((session === null || session === void 0 ? void 0 : session.last_message_text) || '').trim();
    var latestSenderType = String((session === null || session === void 0 ? void 0 : session.last_message_sender_type) || '').toLowerCase();
    var latestMessageType = String((session === null || session === void 0 ? void 0 : session.last_message_type) || '').toLowerCase();
    var fallbackContact = String((session === null || session === void 0 ? void 0 : session.customer_phone) || (session === null || session === void 0 ? void 0 : session.customer_email) || '').trim();
    var messageText = latestTextRaw || (latestMessageType === 'image' ? '[Hình ảnh]' : latestMessageType === 'file' ? '[Tệp đính kèm]' : '');
    if (messageText) {
      if (latestSenderType === 'support') {
        return "\uD83E\uDDD1\u200D\uD83D\uDCBC B\u1EA1n: ".concat(messageText);
      }
      if (latestSenderType === 'player' || latestSenderType === 'customer') {
        return "\uD83D\uDC64 ".concat(messageText);
      }
      return "\uD83D\uDCAC ".concat(messageText);
    }
    return fallbackContact || 'Chưa có tin nhắn';
  }
  function getDefaultPersonAvatarSvg() {
    var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var role = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'customer';
    var customerVariants = ['<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4.2"></circle><path d="M4.5 20c0-4.2 3.4-7 7.5-7s7.5 2.8 7.5 7"></path></svg>', '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.6" r="4"></circle><path d="M4.4 20c0-3.9 3.3-6.8 7.6-6.8s7.6 2.9 7.6 6.8"></path><path d="M8.4 5.6h7.2" opacity=".72"></path></svg>', '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4.7 20c0-4 3.3-6.9 7.3-6.9s7.3 2.9 7.3 6.9"></path><circle cx="9.6" cy="8" r="0.7" opacity=".76"></circle><circle cx="14.4" cy="8" r="0.7" opacity=".76"></circle></svg>', '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.1" r="4.1"></circle><path d="M4.3 20c0-4.1 3.5-7 7.7-7s7.7 2.9 7.7 7"></path><path d="M7.4 6.3c1.4-1.3 3-1.9 4.6-1.9s3.2.6 4.6 1.9" opacity=".74"></path></svg>', '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.9"></circle><path d="M4.1 20c0-4.3 3.6-7.1 7.9-7.1s7.9 2.8 7.9 7.1"></path><path d="M10.2 6.2h3.6" opacity=".75"></path><path d="M8.8 9.2h6.4" opacity=".56"></path></svg>', '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4.2"></circle><path d="M4.6 20c0-4 3.5-6.8 7.4-6.8s7.4 2.8 7.4 6.8"></path><path d="M6.6 18.2h10.8" opacity=".58"></path></svg>'];
    var supportVariant = '<svg class="cc-person-avatar-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4.4 20c0-4 3.5-6.9 7.6-6.9s7.6 2.9 7.6 6.9"></path><path d="M8.5 5.9h7" opacity=".7"></path></svg>';
    if (String(role || '').toLowerCase() === 'support') return supportVariant;
    var idx = hashSessionCode(String(seed || 'guest')) % customerVariants.length;
    return customerVariants[idx];
  }
  function showInlineFeedback(message) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
    var text = String(message || '').trim();
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
    return state.sessions.find(function (s) {
      return s.session_code === sessionCode;
    }) || null;
  }
  function getSessionPriority(session) {
    var rawMeta = session && session.metadata;
    var meta = {};
    if (rawMeta && _typeof(rawMeta) === 'object') {
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
    var current = getSessionByCode(sessionCode);
    if (!current) return;
    var meta = getSessionMeta(current);
    var gameCode = meta.gameSessionCode;
    if (!gameCode || gameCode === '--') {
      showInlineFeedback('Khách hàng chưa gắn mã phiên chơi.', 'warning');
      return;
    }
    window.open("/lucky-mystery-box?code=".concat(encodeURIComponent(gameCode)), '_blank');
  }
  function runConversationMenuAction(_x2, _x3) {
    return _runConversationMenuAction.apply(this, arguments);
  }
  function _runConversationMenuAction() {
    _runConversationMenuAction = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(action, sessionCode) {
      var code, currentSession, isPriorityHigh, currentMeta, note, nextPriority, _byId76;
      return _regenerator().w(function (_context30) {
        while (1) switch (_context30.n) {
          case 0:
            code = String(sessionCode || '').trim();
            if (code) {
              _context30.n = 1;
              break;
            }
            return _context30.a(2);
          case 1:
            currentSession = getSessionByCode(code);
            isPriorityHigh = getSessionPriority(currentSession) === 'high';
            if (!(action === 'open-chat')) {
              _context30.n = 3;
              break;
            }
            _context30.n = 2;
            return selectSession(code);
          case 2:
            return _context30.a(2);
          case 3:
            if (!(action === 'open-game-session')) {
              _context30.n = 4;
              break;
            }
            openGameSessionByCode(code);
            return _context30.a(2);
          case 4:
            if (!(action === 'quick-note')) {
              _context30.n = 8;
              break;
            }
            currentMeta = getSessionMeta(currentSession || {});
            note = window.prompt('Ghi chú nội bộ cho khách hàng:', currentMeta.adminNote || '');
            if (!(note === null)) {
              _context30.n = 5;
              break;
            }
            return _context30.a(2);
          case 5:
            _context30.n = 6;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(code), "/note"), {
              method: 'PUT',
              body: JSON.stringify({
                note: String(note).trim()
              })
            });
          case 6:
            if (code === state.selectedSessionCode) {
              byId('ccAdminNote').value = String(note).trim();
              renderDetails();
            }
            showInlineFeedback('Đã lưu ghi chú nội bộ.', 'success');
            _context30.n = 7;
            return loadSessions();
          case 7:
            return _context30.a(2);
          case 8:
            if (!(action === 'mark-read')) {
              _context30.n = 12;
              break;
            }
            _context30.n = 9;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(code), "/mark-read"), {
              method: 'PUT'
            });
          case 9:
            if (!(code === state.selectedSessionCode)) {
              _context30.n = 10;
              break;
            }
            _context30.n = 10;
            return loadMessages(code, {
              forceImmediate: true
            });
          case 10:
            _context30.n = 11;
            return loadSessions();
          case 11:
            showInlineFeedback('Đã đánh dấu đã đọc.', 'success');
            return _context30.a(2);
          case 12:
            if (!(action === 'toggle-priority')) {
              _context30.n = 15;
              break;
            }
            nextPriority = isPriorityHigh ? 'normal' : 'high';
            _context30.n = 13;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(code), "/priority"), {
              method: 'PUT',
              body: JSON.stringify({
                priority: nextPriority
              })
            });
          case 13:
            if (code === state.selectedSessionCode) {
              (_byId76 = byId('ccPriorityBtn')) === null || _byId76 === void 0 || _byId76.classList.toggle('priority-high', nextPriority === 'high');
            }
            _context30.n = 14;
            return loadSessions();
          case 14:
            showInlineFeedback(nextPriority === 'high' ? 'Đã bật ưu tiên hội thoại.' : 'Đã tắt ưu tiên hội thoại.', 'success');
            return _context30.a(2);
          case 15:
            if (!(action === 'mark-resolved')) {
              _context30.n = 20;
              break;
            }
            _context30.n = 16;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(code), "/mark-resolved"), {
              method: 'PUT'
            });
          case 16:
            _context30.n = 17;
            return loadSessions();
          case 17:
            if (!(code === state.selectedSessionCode)) {
              _context30.n = 19;
              break;
            }
            _context30.n = 18;
            return loadMessages(code, {
              forceImmediate: true
            });
          case 18:
            renderDetails();
          case 19:
            showInlineFeedback('Đã đóng hội thoại.', 'success');
            return _context30.a(2);
          case 20:
            if (!(action === 'archive')) {
              _context30.n = 23;
              break;
            }
            _context30.n = 21;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(code), "/archive"), {
              method: 'PUT'
            });
          case 21:
            _context30.n = 22;
            return loadSessions();
          case 22:
            if (code === state.selectedSessionCode) renderDetails();
            showInlineFeedback('Đã lưu trữ hội thoại.', 'success');
            return _context30.a(2);
          case 23:
            if (!(action === 'delete')) {
              _context30.n = 27;
              break;
            }
            if (confirm('Xóa hội thoại này? Hành động này không thể hoàn tác.')) {
              _context30.n = 24;
              break;
            }
            return _context30.a(2);
          case 24:
            _context30.n = 25;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(code)), {
              method: 'DELETE'
            });
          case 25:
            if (code === state.selectedSessionCode) {
              state.selectedSessionCode = '';
              renderMessages();
              renderDetails();
            }
            _context30.n = 26;
            return loadSessions();
          case 26:
            showInlineFeedback('Đã xóa hội thoại.', 'success');
          case 27:
            return _context30.a(2);
        }
      }, _callee30);
    }));
    return _runConversationMenuAction.apply(this, arguments);
  }
  function renderSessionList() {
    var root = byId('ccConversationList');
    if (!root) return;
    var prevScrollTop = root.scrollTop;
    if (!state.filteredSessions.length) {
      root.innerHTML = '<div class="cc-conv-sub" style="padding:12px;">Chưa có cuộc hội thoại</div>';
      return;
    }

    // ── Group sessions by customer_ip ─────────────────────────────────────
    // Sessions whose IP is blank/unknown are treated individually.
    var ipMap = new Map(); // ip → [sessions]
    var singles = []; // sessions that don't belong to a multi-session IP
    var _iterator = _createForOfIteratorHelper(state.filteredSessions),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var s = _step.value;
        var ip = String(s.customer_ip || '').trim();
        if (!ip || ip === 'unknown') {
          singles.push(s);
          continue;
        }
        if (!ipMap.has(ip)) ipMap.set(ip, []);
        ipMap.get(ip).push(s);
      }

      // Flatten: groups with >1 session become a collapsible group; single → normal item.
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var segments = [];
    var _iterator2 = _createForOfIteratorHelper(state.filteredSessions),
      _step2;
    try {
      var _loop = function _loop() {
        var s = _step2.value;
        var ip = String(s.customer_ip || '').trim();
        if (!ip || ip === 'unknown') {
          segments.push({
            type: 'single',
            session: s
          });
          return 1; // continue
        }
        var group = ipMap.get(ip);
        if (group.length === 1) {
          segments.push({
            type: 'single',
            session: s
          });
        } else if (!segments.some(function (seg) {
          return seg.type === 'group' && seg.ip === ip;
        })) {
          segments.push({
            type: 'group',
            ip: ip,
            sessions: group
          });
        }
      };
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        if (_loop()) continue;
      }

      // ── Render each segment ───────────────────────────────────────────────
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    function buildConvItem(s) {
      var active = s.session_code === state.selectedSessionCode ? 'active' : '';
      var pulse = Number(state.recentBumpedSessions[s.session_code] || 0) > Date.now() ? 'is-updated' : '';
      var loading = state.sessionSwitchInFlight && s.session_code === state.selectedSessionCode ? 'is-loading' : '';
      var customerDisplayName = getDisplayCustomerName(s);
      var unread = Number(s.unread_count || 0);
      var meta = getSessionMeta(s);
      var effectiveStatus = getEffectiveSessionStatus(s);
      var statusCls = {
        active: 'status-active',
        waiting: 'status-waiting',
        closed: 'status-closed',
        archived: 'status-archived'
      }[effectiveStatus] || 'status-active';
      var statusLabel = {
        active: 'Đang hoạt động',
        waiting: 'Đang chờ',
        closed: 'Đã đóng',
        archived: 'Lưu trữ'
      }[effectiveStatus] || 'Đang hoạt động';
      var activeAdminLabel = meta.activeAdminName ? "\uD83D\uDC68\u200D\uD83D\uDCBC ".concat(safe(meta.activeAdminName)) : '';
      var isTyping = state.typingSessionCodes.has(s.session_code);
      var previewRaw = isTyping ? '💬 Đang nhập...' : getConversationPreviewText(s);
      var subInfo = safe(previewRaw);
      var unreadCls = unread > 0 ? 'is-unread' : '';
      var itemUnreadCls = unread > 0 ? 'has-unread' : '';
      var timeStateCls = unread > 0 ? 'is-unread' : 'is-read';
      var typingPreviewCls = isTyping ? 'is-typing' : '';
      var isMenuOpen = state.openConversationMenuCode === s.session_code;
      var priority = getSessionPriority(s);
      var priorityLabel = priority === 'high' ? 'Bỏ ưu tiên cao' : 'Ghim ưu tiên cao';
      return "\n        <div class=\"cc-conv-item ".concat(active, " ").concat(pulse, " ").concat(loading, " ").concat(itemUnreadCls, "\" data-code=\"").concat(safe(s.session_code), "\">\n          <div class=\"cc-avatar-wrap\">\n            <div class=\"cc-avatar\">").concat(getDefaultPersonAvatarSvg(s.session_code, 'customer'), "</div>\n            <span class=\"cc-status-dot ").concat(statusCls, "\" title=\"").concat(statusLabel, "\"></span>\n            <span class=\"cc-status-pill ").concat(statusCls, "\">").concat(statusLabel, "</span>\n          </div>\n          <div class=\"cc-conv-body\">\n            <div class=\"cc-conv-menu-wrap ").concat(isMenuOpen ? 'show' : '', "\">\n              <button class=\"cc-conv-menu-btn\" data-action=\"toggle-conv-menu\" data-code=\"").concat(safe(s.session_code), "\" type=\"button\" aria-label=\"M\u1EDF c\xF4ng c\u1EE5 qu\u1EA3n l\xFD\" title=\"C\xF4ng c\u1EE5 qu\u1EA3n l\xFD\">\u22EF</button>\n              <div class=\"cc-conv-menu\" role=\"menu\">\n                <button class=\"cc-conv-menu-item\" data-action=\"open-chat\" data-code=\"").concat(safe(s.session_code), "\" type=\"button\">M\u1EDF h\u1ED9i tho\u1EA1i</button>\n                <button class=\"cc-conv-menu-item\" data-action=\"open-game-session\" data-code=\"").concat(safe(s.session_code), "\" type=\"button\">M\u1EDF phi\xEAn game</button>\n                <button class=\"cc-conv-menu-item\" data-action=\"quick-note\" data-code=\"").concat(safe(s.session_code), "\" type=\"button\">Ghi ch\xFA nhanh</button>\n                <button class=\"cc-conv-menu-item\" data-action=\"mark-read\" data-code=\"").concat(safe(s.session_code), "\" type=\"button\">\u0110\xE1nh d\u1EA5u \u0111\xE3 \u0111\u1ECDc</button>\n                <button class=\"cc-conv-menu-item\" data-action=\"toggle-priority\" data-code=\"").concat(safe(s.session_code), "\" type=\"button\">").concat(priorityLabel, "</button>\n                <button class=\"cc-conv-menu-item\" data-action=\"mark-resolved\" data-code=\"").concat(safe(s.session_code), "\" type=\"button\">\u0110\xF3ng h\u1ED9i tho\u1EA1i</button>\n                <button class=\"cc-conv-menu-item\" data-action=\"archive\" data-code=\"").concat(safe(s.session_code), "\" type=\"button\">L\u01B0u tr\u1EEF</button>\n                <button class=\"cc-conv-menu-item danger\" data-action=\"delete\" data-code=\"").concat(safe(s.session_code), "\" type=\"button\">X\xF3a h\u1ED9i tho\u1EA1i</button>\n              </div>\n            </div>\n            <div class=\"cc-conv-row1\">\n              <span class=\"cc-conv-name\">").concat(safe(customerDisplayName || 'Khách hàng'), "</span>\n              <span class=\"cc-conv-time ").concat(timeStateCls, "\">\xB7 ").concat(fmtTime(s.updated_at || s.created_at), "</span>\n            </div>\n            <div class=\"cc-conv-row2\">\n              <span class=\"cc-conv-sub cc-conv-preview ").concat(unreadCls, " ").concat(typingPreviewCls, "\">").concat(subInfo || '<span class="cc-conv-sub-muted">Chưa có tin nhắn</span>', "</span>\n              <span class=\"cc-conv-right-meta\">").concat(isTyping ? '<span class="cc-typing-pill">typing<span class="dots"></span></span>' : '').concat(unread > 0 ? "<span class=\"cc-badge\">".concat(unread, "</span>") : '', "</span>\n            </div>\n            ").concat(activeAdminLabel ? "<div class=\"cc-conv-sub\" style=\"margin-top:4px;color:#60a5fa;font-size:11px;\">".concat(activeAdminLabel, "</div>") : '', "\n            ").concat(meta.gameSessionCode && meta.gameSessionCode !== '--' || meta.sessionCodeShort && meta.sessionCodeShort !== '--' ? "\n            <div class=\"cc-tags\">\n              ".concat(meta.gameSessionCode && meta.gameSessionCode !== '--' ? "<span class=\"cc-tag cc-tag-game\"><i class=\"fas fa-gamepad\"></i> ".concat(safe(meta.gameSessionCode), "</span>") : '', "\n              ").concat(meta.sessionCodeShort && meta.sessionCodeShort !== '--' ? "<span class=\"cc-tag cc-tag-code\">#".concat(safe(meta.sessionCodeShort), "</span>") : '', "\n            </div>") : '', "\n          </div>\n        </div>\n      ");
    }
    function buildIpGroup(ip, sessions) {
      var isOpen = state.expandedIpGroups.has(ip);
      var totalUnread = sessions.reduce(function (n, s) {
        return n + Number(s.unread_count || 0);
      }, 0);
      var hasActive = sessions.some(function (s) {
        return s.session_code === state.selectedSessionCode;
      });
      var groupCls = ['cc-ip-group', isOpen ? 'is-open' : '', hasActive ? 'has-active' : ''].filter(Boolean).join(' ');
      var ipShort = ip.length > 16 ? ip.slice(0, 14) + '…' : ip;
      var unreadPill = totalUnread > 0 ? "<span class=\"cc-badge cc-ip-group-badge\">".concat(totalUnread, "</span>") : '';
      var spamWarning = sessions.length >= 3 ? "<span class=\"cc-ip-spam-warning\" title=\"Nhi\u1EC1u phi\xEAn t\u1EEB c\xF9ng 1 IP \u2014 c\xF3 th\u1EC3 l\xE0 spam\">\u26A0\uFE0F</span>" : '';
      var innerHtml = isOpen ? "<div class=\"cc-ip-group-sessions\">".concat(sessions.map(buildConvItem).join(''), "</div>") : '';
      return "\n        <div class=\"".concat(groupCls, "\" data-ip-group=\"").concat(safe(ip), "\">\n          <div class=\"cc-ip-group-header\" data-action=\"toggle-ip-group\" data-ip=\"").concat(safe(ip), "\">\n            <span class=\"cc-ip-group-chevron\">").concat(isOpen ? '▾' : '▸', "</span>\n            <span class=\"cc-ip-group-icon\">\uD83C\uDF10</span>\n            <span class=\"cc-ip-group-label\" title=\"").concat(safe(ip), "\">").concat(safe(ipShort), "</span>\n            <span class=\"cc-ip-group-count\">").concat(sessions.length, " phi\xEAn</span>\n            ").concat(spamWarning, "\n            ").concat(unreadPill, "\n          </div>\n          ").concat(innerHtml, "\n        </div>\n      ");
    }
    root.innerHTML = segments.map(function (seg) {
      return seg.type === 'group' ? buildIpGroup(seg.ip, seg.sessions) : buildConvItem(seg.session);
    }).join('');
    root.scrollTop = prevScrollTop;
  }
  function renderMessages() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var box = byId('ccMessages');
    if (!box) return;
    var forceScrollBottom = !!options.forceScrollBottom;
    var prevScrollTop = box.scrollTop;
    var prevScrollHeight = box.scrollHeight;
    var wasNearBottom = prevScrollHeight - (prevScrollTop + box.clientHeight) <= 80;
    if (!state.selectedSessionCode) {
      box.innerHTML = '<div class="cc-msg-time">Chọn một cuộc hội thoại để bắt đầu hỗ trợ.</div>';
      return;
    }

    // state.messages is already pre-filtered by loadMessages (isSystemAutoMessage applied at
    // fetch time). Using it directly avoids a second parse of metadata in the hot render path.
    var visibleMessages = state.messages;
    var mobileLimit = 120;
    var isTruncated = isMobileChatUi() && visibleMessages.length > mobileLimit;
    var renderableMessages = isTruncated ? visibleMessages.slice(-mobileLimit) : visibleMessages;
    if (!renderableMessages.length) {
      box.innerHTML = '<div class="cc-msg-time">Chưa có tin nhắn.</div>';
      return;
    }

    // Progressive render for large histories to avoid blocking mobile/main thread.
    if (renderableMessages.length > 80 && !options.forceImmediate) {
      var _current = state.sessions.find(function (s) {
        return s.session_code === state.selectedSessionCode;
      });
      box.innerHTML = isTruncated ? "<div class=\"cc-msg-time\">\u0110ang hi\u1EC3n th\u1ECB ".concat(mobileLimit, " tin nh\u1EAFn g\u1EA7n nh\u1EA5t \u0111\u1EC3 t\u1ED1i \u01B0u t\u1ED1c \u0111\u1ED9 tr\xEAn mobile.</div>") : '';
      var queue = renderableMessages.slice();
      var chunkSize = 18;
      var nearBottom = wasNearBottom || forceScrollBottom;
      var _pump = function pump() {
        var chunk = queue.splice(0, chunkSize);
        if (!chunk.length) {
          if (nearBottom) {
            var behavior = isMobileChatUi() ? 'auto' : 'smooth';
            box.scrollTo({
              top: box.scrollHeight,
              behavior: behavior
            });
          }
          return;
        }
        var html = chunk.map(function (m) {
          return buildSingleMessageRowHtml(m, _current, false);
        }).join('');
        box.insertAdjacentHTML('beforeend', html);
        initCcVoiceAudio(box);
        requestAnimationFrame(_pump);
      };
      requestAnimationFrame(_pump);
      return;
    }
    var current = state.sessions.find(function (s) {
      return s.session_code === state.selectedSessionCode;
    });
    var meta = getSessionMeta(current || {});
    var customerDisplayName = getDisplayCustomerName(current || {}) || 'Khách hàng';
    var supportDisplayName = getCurrentAdminDisplayName();
    var customerAvatar = (meta === null || meta === void 0 ? void 0 : meta.customerAvatarUrl) || '';
    var supportAvatar = (meta === null || meta === void 0 ? void 0 : meta.supportAvatarUrl) || '';
    var lastRenderedTs = Number(state.lastRenderedMessageTs[state.selectedSessionCode] || 0);
    var allowFreshAnimation = lastRenderedTs > 0;
    var maxRenderedTs = lastRenderedTs;
    var renderedHtml = renderableMessages.map(function (m) {
      var msgTs = messageTimestamp(m);
      if (msgTs > maxRenderedTs) maxRenderedTs = msgTs;
      var isFreshMessage = allowFreshAnimation && msgTs > lastRenderedTs;
      return renderMessageRowHtml(m, {
        currentSession: current,
        customerDisplayName: customerDisplayName,
        supportDisplayName: supportDisplayName,
        customerAvatar: customerAvatar,
        supportAvatar: supportAvatar,
        isFreshMessage: isFreshMessage,
        sessionCode: state.selectedSessionCode
      });
    }).join('');
    box.innerHTML = isTruncated ? "<div class=\"cc-msg-time\">\u0110ang hi\u1EC3n th\u1ECB ".concat(mobileLimit, " tin nh\u1EAFn g\u1EA7n nh\u1EA5t \u0111\u1EC3 t\u1ED1i \u01B0u t\u1ED1c \u0111\u1ED9 tr\xEAn mobile.</div>").concat(renderedHtml) : renderedHtml;
    initCcVoiceAudio(box);
    if (maxRenderedTs > 0) {
      state.lastRenderedMessageTs[state.selectedSessionCode] = maxRenderedTs;
    }
    if (forceScrollBottom || wasNearBottom) {
      var behavior = isMobileChatUi() ? 'auto' : 'smooth';
      box.scrollTo({
        top: box.scrollHeight,
        behavior: behavior
      });
      return;
    }
    var heightDiff = box.scrollHeight - prevScrollHeight;
    box.scrollTop = Math.max(0, prevScrollTop + heightDiff);
  }
  function renderMessageRowHtml(message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var mine = message.sender_type === 'support';
    var rowCls = mine ? 'cc-msg-row mine' : 'cc-msg-row';
    var bubbleCls = mine ? 'cc-bubble mine' : 'cc-bubble theirs';
    var attachment = renderAttachment(message);
    var isFreshMessage = !!options.isFreshMessage;
    var sessionCode = String(options.sessionCode || state.selectedSessionCode || '');
    var isEditing = canEditSupportMessage(message) && sessionCode && state.editingMessageId !== null && String(state.editingMessageId) === String(message.id) && sessionCode === state.selectedSessionCode;
    var canEdit = canEditSupportMessage(message);
    var canDelete = canManageOwnSupportMessage(message);
    var isDeleteConfirming = canDelete && state.deleteConfirmMessageId !== null && String(state.deleteConfirmMessageId) === String(message.id) && sessionCode === state.selectedSessionCode;
    var avatarHtml = getChatAvatarHtml({
      mine: mine,
      customerName: options.customerDisplayName || 'Khách hàng',
      supportName: mine ? getSupportSenderName(message, options.supportDisplayName) : options.supportDisplayName || DEFAULT_SUPPORT_DISPLAY_NAME,
      customerAvatar: options.customerAvatar || '',
      supportAvatar: options.supportAvatar || '',
      sessionSeed: sessionCode
    });
    var sessionSeenAt = Number(state.seenSessionAt[sessionCode] || 0);
    var isSeen = mine && (message.is_read || message.read_at || message.seen_at || message.customer_read_at || sessionSeenAt > 0 && messageTimestamp(message) > 0 && messageTimestamp(message) <= sessionSeenAt);
    var statusBadge = mine ? "<span class=\"cc-msg-status ".concat(message.__pending ? 'pending' : isSeen ? 'seen' : 'sent', "\"><svg class=\"cc-msg-status-icon\" viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M2.2 8.4 5.8 12l8-8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>").concat(isSeen && !message.__pending ? '<path d="M6 8.4 9.6 12l4.2-4.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>' : '', "</svg><span>").concat(message.__pending ? 'Đang gửi...' : isSeen ? 'Đã xem' : 'Đã gửi', "</span></span>") : '';
    var editedFlag = isMessageEdited(message) ? '<span class="cc-msg-edited">(đã chỉnh sửa)</span>' : '';
    var bubbleContent = isEditing ? "<div class=\"cc-msg-edit-shell\">\n          <div class=\"cc-msg-edit-head\">\n            <span class=\"cc-msg-edit-badge\">\u0110ang s\u1EEDa b\u1EB1ng rich text</span>\n            <span class=\"cc-msg-edit-shortcut\">Ch\u1ECDn ch\u1EEF \u0111\u1EC3 hi\u1EC7n toolbar n\u1ED5i \u2022 Ctrl/Cmd + Enter \u0111\u1EC3 l\u01B0u</span>\n          </div>\n          <div class=\"cc-msg-edit-input\" contenteditable=\"true\" data-edit-message-id=\"".concat(safe(message.id), "\" data-placeholder=\"Ch\u1EC9nh s\u1EEDa n\u1ED9i dung tin nh\u1EAFn...\"></div>\n          <div class=\"cc-msg-edit-actions\">\n            <button type=\"button\" class=\"cc-msg-edit-btn cancel\" data-action=\"cancel-edit-message\">H\u1EE7y</button>\n            <button type=\"button\" class=\"cc-msg-edit-btn save\" data-action=\"save-edit-message\" data-message-id=\"").concat(safe(message.id), "\">L\u01B0u thay \u0111\u1ED5i</button>\n          </div>\n        </div>") : "".concat(renderMessageBody(message.message || '')).concat(attachment);
    var editAction = mine && canEdit && !isEditing ? "<button type=\"button\" class=\"cc-msg-edit-link\" data-action=\"start-edit-message\" data-message-id=\"".concat(safe(message.id), "\">S\u1EEDa</button>") : '';
    var deleteAction = mine && canDelete && !isEditing ? "<button type=\"button\" class=\"cc-msg-edit-link danger\" data-action=\"request-delete-message\" data-message-id=\"".concat(safe(message.id), "\">X\xF3a</button>") : '';
    var deleteConfirm = isDeleteConfirming ? "<span class=\"cc-msg-delete-confirm\"><span class=\"cc-msg-delete-confirm-text\">X\xE1c nh\u1EADn x\xF3a?</span><button type=\"button\" class=\"cc-msg-edit-link danger\" data-action=\"confirm-delete-message\" data-message-id=\"".concat(safe(message.id), "\">X\xF3a</button><button type=\"button\" class=\"cc-msg-edit-link\" data-action=\"cancel-delete-message\">H\u1EE7y</button></span>") : '';
    var supportSenderName = mine ? getSupportSenderName(message, options.supportDisplayName) : '';
    return "\n      <div class=\"".concat(rowCls).concat(isFreshMessage ? ' is-fresh' : '').concat(message.__pending ? ' pending' : '', "\" data-message-id=\"").concat(safe(message.id || ''), "\">\n        <div class=\"cc-msg-row-content\"><span class=\"cc-msg-avatar-wrap").concat(isFreshMessage ? ' is-fresh' : '', "\">").concat(avatarHtml, "</span><div class=\"").concat(bubbleCls, "\">").concat(bubbleContent, "</div></div>\n        <div class=\"cc-msg-time\">").concat(fmtTime(message.created_at), " ").concat(mine ? '• ' + safe(supportSenderName) : '').concat(editedFlag).concat(statusBadge).concat(editAction).concat(deleteAction).concat(deleteConfirm, "</div>\n      </div>\n    ");
  }
  function requestDeleteSupportMessage(messageId) {
    var target = state.messages.find(function (m) {
      return String(m.id) === String(messageId);
    });
    if (!target || !canManageOwnSupportMessage(target)) return;
    state.deleteConfirmMessageId = target.id;
    renderMessages({
      forceImmediate: true
    });
  }
  function deleteSupportMessage(_x4) {
    return _deleteSupportMessage.apply(this, arguments);
  }
  function _deleteSupportMessage() {
    _deleteSupportMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31(messageId) {
      var target;
      return _regenerator().w(function (_context31) {
        while (1) switch (_context31.n) {
          case 0:
            if (state.selectedSessionCode) {
              _context31.n = 1;
              break;
            }
            return _context31.a(2);
          case 1:
            target = state.messages.find(function (m) {
              return String(m.id) === String(messageId);
            });
            if (!(!target || !canManageOwnSupportMessage(target))) {
              _context31.n = 2;
              break;
            }
            return _context31.a(2);
          case 2:
            _context31.n = 3;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(state.selectedSessionCode), "/messages/").concat(encodeURIComponent(String(messageId))), {
              method: 'DELETE'
            });
          case 3:
            state.messages = state.messages.filter(function (m) {
              return String(m.id) !== String(messageId);
            });
            if (state.editingMessageId !== null && String(state.editingMessageId) === String(messageId)) {
              detachCurrentEditMessageEditor();
              state.editingMessageId = null;
              state.editingDraftText = '';
            }
            if (state.deleteConfirmMessageId !== null && String(state.deleteConfirmMessageId) === String(messageId)) {
              state.deleteConfirmMessageId = null;
            }
            renderMessages({
              forceImmediate: true
            });
            queueSessionRefresh();
          case 4:
            return _context31.a(2);
        }
      }, _callee31);
    }));
    return _deleteSupportMessage.apply(this, arguments);
  }
  function buildSingleMessageRowHtml(message, currentSession, isFreshMessage) {
    var meta = getSessionMeta(currentSession || {});
    var customerDisplayName = getDisplayCustomerName(currentSession || {}) || 'Khách hàng';
    var supportDisplayName = getCurrentAdminDisplayName();
    var customerAvatar = (meta === null || meta === void 0 ? void 0 : meta.customerAvatarUrl) || '';
    var supportAvatar = (meta === null || meta === void 0 ? void 0 : meta.supportAvatarUrl) || '';
    return renderMessageRowHtml(message, {
      currentSession: currentSession,
      customerDisplayName: customerDisplayName,
      supportDisplayName: supportDisplayName,
      customerAvatar: customerAvatar,
      supportAvatar: supportAvatar,
      isFreshMessage: isFreshMessage,
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
    var editor = document.querySelector("#ccMessages [contenteditable][data-edit-message-id=\"".concat(escapeCssSelectorValue(String(messageId || '')), "\"]"));
    if (!editor) return;
    detachCurrentEditMessageEditor();
    state.editingEditorNode = editor;
    window.CcTiptap.bindEditable(editor, {
      submitOnEnter: false,
      onInput: function onInput(activeEditor) {
        state.editingDraftText = String((activeEditor === null || activeEditor === void 0 ? void 0 : activeEditor.innerHTML) || '');
      }
    });
    if (typeof window.CcTiptap.setHTML === 'function') {
      window.CcTiptap.setHTML(state.editingDraftText, editor);
    } else {
      editor.innerHTML = state.editingDraftText;
    }
    if (typeof window.CcTiptap.focus === 'function') {
      window.CcTiptap.focus(editor, {
        atEnd: true
      });
    } else {
      editor.focus();
    }
    if (typeof window.CcTiptap.setActiveEditor === 'function') {
      window.CcTiptap.setActiveEditor(editor);
    }
  }
  function startEditMessage(messageId) {
    var target = state.messages.find(function (m) {
      return String(m.id) === String(messageId);
    });
    if (!target || !canEditSupportMessage(target)) return;
    detachCurrentEditMessageEditor();
    state.editingMessageId = target.id;
    // Preserve full HTML so formatting is maintained in the contenteditable editor
    state.editingDraftText = String(target.message || '');
    state.deleteConfirmMessageId = null;
    renderMessages({
      forceImmediate: true
    });
    requestAnimationFrame(function () {
      attachCurrentEditMessageEditor(target.id);
    });
  }
  function cancelEditMessage() {
    detachCurrentEditMessageEditor();
    state.editingMessageId = null;
    state.editingDraftText = '';
    renderMessages({
      forceImmediate: true
    });
  }
  function saveEditedMessage(_x5, _x6) {
    return _saveEditedMessage.apply(this, arguments);
  }
  function _saveEditedMessage() {
    _saveEditedMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32(messageId, nextHtml) {
      var target, sanitized, tmpCheck, plainText, rs, updated, index;
      return _regenerator().w(function (_context32) {
        while (1) switch (_context32.n) {
          case 0:
            if (state.selectedSessionCode) {
              _context32.n = 1;
              break;
            }
            return _context32.a(2);
          case 1:
            target = state.messages.find(function (m) {
              return String(m.id) === String(messageId);
            });
            if (!(!target || !canEditSupportMessage(target))) {
              _context32.n = 2;
              break;
            }
            return _context32.a(2);
          case 2:
            // Sanitize the HTML before sending / comparing
            sanitized = renderMessageBody(nextHtml); // Extract plain text for empty-check and change-check
            tmpCheck = document.createElement('div');
            tmpCheck.innerHTML = sanitized;
            plainText = (tmpCheck.innerText || tmpCheck.textContent || '').trim();
            if (plainText) {
              _context32.n = 3;
              break;
            }
            alert('Nội dung tin nhắn không được để trống.');
            return _context32.a(2);
          case 3:
            if (!(sanitized === renderMessageBody(target.message || ''))) {
              _context32.n = 4;
              break;
            }
            cancelEditMessage();
            return _context32.a(2);
          case 4:
            _context32.n = 5;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(state.selectedSessionCode), "/messages/").concat(encodeURIComponent(String(target.id))), {
              method: 'PUT',
              body: JSON.stringify({
                message: sanitized
              })
            });
          case 5:
            rs = _context32.v;
            updated = (rs === null || rs === void 0 ? void 0 : rs.data) || null;
            if (updated) {
              index = state.messages.findIndex(function (m) {
                return String(m.id) === String(target.id);
              });
              if (index >= 0) {
                state.messages[index] = _objectSpread(_objectSpread({}, state.messages[index]), updated);
              }
            }
            detachCurrentEditMessageEditor();
            state.editingMessageId = null;
            state.editingDraftText = '';
            renderMessages({
              forceImmediate: true
            });
            queueSessionRefresh();
          case 6:
            return _context32.a(2);
        }
      }, _callee32);
    }));
    return _saveEditedMessage.apply(this, arguments);
  }
  function flushMessageAppendQueue() {
    if (!state.selectedSessionCode) {
      state.messageAppendQueue.length = 0;
      state.messageAppendRaf = 0;
      return;
    }
    var box = byId('ccMessages');
    if (!box) {
      state.messageAppendQueue.length = 0;
      state.messageAppendRaf = 0;
      return;
    }
    var current = state.sessions.find(function (s) {
      return s.session_code === state.selectedSessionCode;
    });
    var nearBottom = getCurrentNearBottom();
    var chunkSize = 8;
    // Drop any queued items that were enqueued for a session the admin has since
    // navigated away from — they must not bleed into the current session's view.
    var currentCode = state.selectedSessionCode;
    while (state.messageAppendQueue.length > 0 && state.messageAppendQueue[0].__sessionCode !== currentCode) {
      state.messageAppendQueue.shift();
    }
    var chunk = state.messageAppendQueue.splice(0, chunkSize);
    if (!chunk.length) {
      state.messageAppendRaf = 0;
      return;
    }
    var html = '';
    chunk.forEach(function (m) {
      state.messages.push(m);
      html += buildSingleMessageRowHtml(m, current, true);
      var ts = messageTimestamp(m);
      if (ts > 0) {
        var prev = Number(state.lastRenderedMessageTs[state.selectedSessionCode] || 0);
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
      var behavior = isMobileChatUi() ? 'auto' : 'smooth';
      box.scrollTo({
        top: box.scrollHeight,
        behavior: behavior
      });
    }
    if (state.messageAppendQueue.length > 0) {
      state.messageAppendRaf = requestAnimationFrame(flushMessageAppendQueue);
    } else {
      state.messageAppendRaf = 0;
    }
  }
  function enqueueIncomingMessage(sessionCode, message) {
    if (!sessionCode || sessionCode !== state.selectedSessionCode) return false;
    if (!message || _typeof(message) !== 'object') return false;
    var normalized = {
      id: message.id || "sse_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8)),
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
    if (normalized.id && state.messages.some(function (m) {
      return String(m.id) === String(normalized.id);
    })) return false;
    if (normalized.id && state.messageAppendQueue.some(function (m) {
      return String(m.id) === String(normalized.id);
    })) return false;
    state.messageAppendQueue.push(normalized);
    if (!state.messageAppendRaf) {
      state.messageAppendRaf = requestAnimationFrame(flushMessageAppendQueue);
    }
    return true;
  }
  function clearMessageRetryTimers(sessionCode) {
    var code = String(sessionCode || '');
    if (!code) return;
    var timers = state.messageRetryTimersBySession[code];
    if (!Array.isArray(timers) || !timers.length) return;
    timers.forEach(function (timerId) {
      try {
        clearTimeout(timerId);
      } catch (_) {}
    });
    state.messageRetryTimersBySession[code] = [];
  }
  function scheduleMessageFetchRetries(sessionCode) {
    var code = String(sessionCode || '').trim();
    if (!code) return;
    clearMessageRetryTimers(code);
    var delays = [220, 700, 1500];
    state.messageRetryTimersBySession[code] = delays.map(function (delayMs) {
      return setTimeout(function () {
        if (code !== state.selectedSessionCode) return;
        loadMessages(code, {
          forceImmediate: true
        }).catch(function () {});
      }, delayMs);
    });
  }
  function normalizeIncomingPayloadMessage(payload) {
    var raw = payload && _typeof(payload) === 'object' ? payload : {};
    if (raw.message && _typeof(raw.message) === 'object') {
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
  var _playerOnlineCache = {};
  var _statusTicker = null; // single shared ticker — only one session open at a time

  function formatPlayerLastSeen(lastSeenTs) {
    if (!lastSeenTs) return 'Offline';
    var diffMs = Date.now() - Number(lastSeenTs);
    if (diffMs < 0) return 'Offline';
    var diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Offline \xB7 ".concat(diffSec, " gi\xE2y tr\u01B0\u1EDBc");
    var diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return "Offline \xB7 ".concat(diffMin, " ph\xFAt tr\u01B0\u1EDBc");
    var diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return "Offline \xB7 ".concat(diffHour, " gi\u1EDD tr\u01B0\u1EDBc");
    var diffDay = Math.floor(diffHour / 24);
    return "L\u1EA7n cu\u1ED1i ho\u1EA1t \u0111\u1ED9ng ".concat(diffDay, " ng\xE0y tr\u01B0\u1EDBc");
  }
  function formatOnlineDuration(sinceTs) {
    var diffSec = Math.max(0, Math.floor((Date.now() - Number(sinceTs)) / 1000));
    var h = Math.floor(diffSec / 3600);
    var m = Math.floor(diffSec % 3600 / 60);
    var s = diffSec % 60;
    var pad = function pad(n) {
      return String(n).padStart(2, '0');
    };
    return "\u0110ang ho\u1EA1t \u0111\u1ED9ng ".concat(pad(h), ":").concat(pad(m), ":").concat(pad(s));
  }

  // Start a 1-second ticker for the given session. Reads wsManager directly each tick
  // so it always reflects live state without relying on event ordering.
  function _refreshOnlineStatusUI(sessionCode) {
    if (_statusTicker) {
      clearInterval(_statusTicker);
      _statusTicker = null;
    }
    if (!sessionCode) return;
    var runTick = function runTick() {
      // Self-cancel if admin has switched to a different session
      if (sessionCode !== state.selectedSessionCode) {
        clearInterval(_statusTicker);
        _statusTicker = null;
        return;
      }

      // Read live state directly from wsManager — the authoritative source
      var online = null;
      var sinceTs = null;
      var lastSeenTs = null;
      try {
        var _window$wsManager;
        var info = (_window$wsManager = window.wsManager) === null || _window$wsManager === void 0 || (_window$wsManager = _window$wsManager.onlinePlayers) === null || _window$wsManager === void 0 ? void 0 : _window$wsManager.get(sessionCode);
        if (info) {
          online = !!info.online;
          sinceTs = info.since ? Number(new Date(info.since)) : null;
          lastSeenTs = info.lastSeen ? Number(new Date(info.lastSeen)) : null;
        }
      } catch (_) {}

      // Fall back to local cache if wsManager has no entry yet
      if (online === null) {
        var cached = _playerOnlineCache[sessionCode];
        if (!cached) return; // no data at all — leave session-status label as-is
        online = cached.online;
        sinceTs = cached.sinceTs;
        lastSeenTs = cached.lastSeenTs;
      }
      var label = online ? sinceTs ? formatOnlineDuration(sinceTs) : 'Đang hoạt động' : formatPlayerLastSeen(lastSeenTs);
      var cls = online ? 'active' : 'waiting';
      var statusEl = byId('ccChatStatus');
      var custStatusEl = byId('ccCustStatus');
      [statusEl, custStatusEl].forEach(function (el) {
        if (!el) return;
        el.textContent = label;
        applyStatusClass(el, cls);
      });
    };
    runTick();
    _statusTicker = setInterval(runTick, 1000);
  }
  function renderDetails() {
    var _byId10;
    var current = state.sessions.find(function (s) {
      return s.session_code === state.selectedSessionCode;
    });
    var effectiveStatus = getEffectiveSessionStatus(current);
    var meta = current ? getSessionMeta(current) : {
      gameSessionCode: '--'
    };
    var displayName = getDisplayCustomerName(current);
    (_byId10 = byId('ccPriorityBtn')) === null || _byId10 === void 0 || _byId10.classList.toggle('priority-high', getSessionPriority(current) === 'high');
    byId('ccChatName').textContent = displayName || 'Chưa chọn hội thoại';
    byId('ccCustName').textContent = displayName || '--';
    var nicknameInput = byId('ccCustomerNicknameInput');
    if (nicknameInput) nicknameInput.value = meta.customerNickname || '';
    var chatStatusEl = byId('ccChatStatus');
    if (chatStatusEl) {
      chatStatusEl.textContent = mapStatusLabel(effectiveStatus);
      applyStatusClass(chatStatusEl, effectiveStatus || 'active');
    }
    byId('ccJoinDate').textContent = current ? fmtDate(current.created_at) : '--';
    byId('ccPhone').textContent = (current === null || current === void 0 ? void 0 : current.customer_phone) || '--';
    byId('ccEmail').textContent = (current === null || current === void 0 ? void 0 : current.customer_email) || '--';
    byId('ccChatCode').textContent = (current === null || current === void 0 ? void 0 : current.session_code) || '--';
    byId('ccGameSession').textContent = meta.gameSessionCode;
    byId('ccCustIp').textContent = meta.customerIp || '--';
    byId('ccUserAgent').textContent = meta.userAgent || '--';
    byId('ccFingerprint').textContent = meta.fingerprintHash || '--';
    byId('ccSessionExpireAt').textContent = meta.expiresAtRaw ? fmtDateTime(meta.expiresAtRaw) : '--';
    byId('ccMsgCount').textContent = "".concat(Number((current === null || current === void 0 ? void 0 : current.message_count) || 0), " tin");
    byId('ccAdminNote').value = meta.adminNote;

    // Satisfaction score
    var satEl = byId('ccSatScore');
    if (satEl) satEl.textContent = current !== null && current !== void 0 && current.satisfaction_rating ? "".concat(current.satisfaction_rating, "/5") : '--';
    var headerGameEl = byId('ccHeaderGameSession');
    if (headerGameEl) {
      var hasSession = meta.gameSessionCode && meta.gameSessionCode !== '--';
      headerGameEl.textContent = hasSession ? "\uD83C\uDFAE ".concat(meta.gameSessionCode) : '';
      headerGameEl.style.display = hasSession ? 'inline-flex' : 'none';
    }
    var headerIdentityEl = byId('ccHeaderIdentity');
    if (headerIdentityEl) {
      var hasIdentity = meta.sessionCodeShort && meta.sessionCodeShort !== '--';
      headerIdentityEl.textContent = hasIdentity ? "#".concat(meta.sessionCodeShort) : '#--';
      headerIdentityEl.style.display = hasIdentity ? 'inline-flex' : 'none';
    }
    var customerAvatarMarkup = getDefaultPersonAvatarSvg(state.selectedSessionCode || (current === null || current === void 0 ? void 0 : current.session_code) || '', 'customer');
    var supportAvatarMarkup = getDefaultPersonAvatarSvg(CURRENT_ADMIN_USERNAME || 'support', 'support');
    byId('ccChatAvatar').innerHTML = customerAvatarMarkup;
    byId('ccCustAvatar').innerHTML = customerAvatarMarkup;
    var headerSupportAvatar = byId('ccHeaderSupportAvatar');
    if (headerSupportAvatar) headerSupportAvatar.innerHTML = supportAvatarMarkup;
    var custStatusEl = byId('ccCustStatus');
    if (custStatusEl) {
      custStatusEl.textContent = mapStatusLabel(effectiveStatus);
      applyStatusClass(custStatusEl, effectiveStatus || 'active');
    }

    // Start/restart live status ticker for the selected session.
    // The ticker reads wsManager.onlinePlayers every second so it always
    // reflects current state regardless of SSE event ordering.
    _refreshOnlineStatusUI(state.selectedSessionCode || '');

    // Agent assignment / join button
    var agentId = Number((current === null || current === void 0 ? void 0 : current.support_agent_id) || 0);
    var agentName = String((current === null || current === void 0 ? void 0 : current.support_agent_name) || '').trim();
    var isMySession = !!(agentId && CURRENT_ADMIN_ID && agentId === CURRENT_ADMIN_ID);
    var hasOtherAgent = !!(agentId && !isMySession && agentName);
    var joinBtn = byId('ccJoinSessionBtn');
    if (joinBtn) {
      if (!current) {
        joinBtn.style.display = 'none';
      } else if (isMySession) {
        joinBtn.textContent = '🟢 Đang hỗ trợ';
        joinBtn.className = 'cc-btn cc-btn-join is-joined';
        joinBtn.title = 'Bạn là người hỗ trợ chính của hội thoại này';
        joinBtn.style.display = '';
      } else if (hasOtherAgent) {
        joinBtn.textContent = "\uD83E\uDD1D Ti\u1EBFp qu\u1EA3n";
        joinBtn.className = 'cc-btn cc-btn-join is-other';
        joinBtn.title = "Hi\u1EC7n \u0111ang do ".concat(agentName, " h\u1ED7 tr\u1EE3. Click \u0111\u1EC3 ti\u1EBFp qu\u1EA3n.");
        joinBtn.style.display = '';
      } else {
        joinBtn.textContent = '🙋 Tham gia';
        joinBtn.className = 'cc-btn cc-btn-join';
        joinBtn.title = 'Nhận hỗ trợ khách hàng này';
        joinBtn.style.display = '';
      }
    }
    var agentNameEl = byId('ccAgentName');
    if (agentNameEl) {
      if (isMySession) {
        agentNameEl.innerHTML = "<span class=\"cc-agent-badge is-me\">\uD83D\uDFE2 B\u1EA1n (".concat(safe(getCurrentAdminDisplayName()), ")</span>");
      } else if (hasOtherAgent) {
        agentNameEl.innerHTML = "<span class=\"cc-agent-badge is-other\">\uD83D\uDC64 ".concat(safe(agentName), "</span>");
      } else {
        agentNameEl.innerHTML = '<span class="cc-agent-badge unassigned">Chưa có ai tham gia</span>';
      }
    }
    syncInfoSheetFromDetails();
  }
  function loadSessions() {
    return _loadSessions.apply(this, arguments);
  }
  function _loadSessions() {
    _loadSessions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33() {
      var _byId77;
      var now, search, status, hasAdvancedFilter, limit;
      return _regenerator().w(function (_context33) {
        while (1) switch (_context33.n) {
          case 0:
            if (!state.sessionsInFlightPromise) {
              _context33.n = 1;
              break;
            }
            return _context33.a(2, state.sessionsInFlightPromise);
          case 1:
            now = Date.now();
            if (!(now - state.sessionsLastFetchAt < 900 && state.sessions.length > 0)) {
              _context33.n = 2;
              break;
            }
            return _context33.a(2);
          case 2:
            state.sessionsLastFetchAt = now;
            search = (((_byId77 = byId('ccSearchInput')) === null || _byId77 === void 0 ? void 0 : _byId77.value) || '').trim();
            status = state.statusFilter && state.statusFilter !== 'all' ? "&status=".concat(encodeURIComponent(state.statusFilter)) : '';
            hasAdvancedFilter = function () {
              var f = getAdvancedFilters();
              return !!(f.ip || f.gameSession || f.day || f.month);
            }();
            limit = hasAdvancedFilter ? 200 : isMobileChatUi() ? 20 : 30;
            state.sessionsInFlightPromise = api("/api/chat/admin/all-chats?limit=".concat(limit, "&search=").concat(encodeURIComponent(search)).concat(status)).then(function (rs) {
              var _document$getElementB;
              state.sessions = Array.isArray(rs.data) ? rs.data : [];
              if (state.forceClearedUnread.size > 0) {
                state.sessions.forEach(function (s) {
                  if (state.forceClearedUnread.has(s.session_code)) {
                    s.unread_count = 0;
                    if (!['closed', 'archived'].includes(String(s.status || '').toLowerCase())) {
                      s.status = 'active';
                    }
                  }
                });
              }
              state.filteredSessions = applyAdvancedSessionFilters(state.sessions);
              var newUnreadTotal = state.sessions.reduce(function (sum, s) {
                return sum + Number(s.unread_count || 0);
              }, 0);
              var unreadIncrease = newUnreadTotal - state.unreadTotal;
              if (unreadIncrease > 0 && window.LMB_DISABLE_SSE) {
                if (typeof window.playNotificationSound === 'function') {
                  window.playNotificationSound();
                } else if (window.notificationSound && typeof window.notificationSound.playSound === 'function') {
                  window.notificationSound.playSound('message');
                }
              }
              var isCustomerCareActive = (_document$getElementB = document.getElementById('panel-customer-care')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.classList.contains('active');

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
            }).finally(function () {
              state.sessionsInFlightPromise = null;
            });
            _context33.n = 3;
            return state.sessionsInFlightPromise;
          case 3:
            return _context33.a(2);
        }
      }, _callee33);
    }));
    return _loadSessions.apply(this, arguments);
  }
  function loadMessages(_x7) {
    return _loadMessages.apply(this, arguments);
  }
  function _loadMessages() {
    _loadMessages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34(sessionCode) {
      var options,
        _args34 = arguments;
      return _regenerator().w(function (_context34) {
        while (1) switch (_context34.n) {
          case 0:
            options = _args34.length > 1 && _args34[1] !== undefined ? _args34[1] : {};
            if (sessionCode) {
              _context34.n = 1;
              break;
            }
            state.messages = [];
            renderMessages(options);
            return _context34.a(2);
          case 1:
            if (!state.messagesInFlightBySession[sessionCode]) {
              _context34.n = 3;
              break;
            }
            if (options.forceImmediate || options.forceScrollBottom) {
              state.messagesReloadQueuedBySession[sessionCode] = true;
            }
            _context34.n = 2;
            return state.messagesInFlightBySession[sessionCode];
          case 2:
            return _context34.a(2);
          case 3:
            state.messagesInFlightBySession[sessionCode] = api("/api/chat/admin/chat/".concat(encodeURIComponent(sessionCode), "/messages")).then(function (rs) {
              var rawMessages = Array.isArray(rs.data) ? rs.data : [];
              var nextMessages = rawMessages.filter(function (m) {
                return !isSystemAutoMessage(m);
              });
              var nextDigest = getMessageDigest(nextMessages);
              var prevDigest = String(state.lastMessagesDigestBySession[sessionCode] || '');
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
            }).finally(function () {
              delete state.messagesInFlightBySession[sessionCode];
              if (state.messagesReloadQueuedBySession[sessionCode]) {
                delete state.messagesReloadQueuedBySession[sessionCode];
                setTimeout(function () {
                  if (sessionCode === state.selectedSessionCode) {
                    loadMessages(sessionCode, {
                      forceImmediate: true
                    }).catch(function () {});
                  }
                }, 0);
              }
            });
            _context34.n = 4;
            return state.messagesInFlightBySession[sessionCode];
          case 4:
            return _context34.a(2);
        }
      }, _callee34);
    }));
    return _loadMessages.apply(this, arguments);
  }
  function selectSession(_x8) {
    return _selectSession.apply(this, arguments);
  }
  function _selectSession() {
    _selectSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35(sessionCode) {
      var targetSession, queuedCode, _t20;
      return _regenerator().w(function (_context35) {
        while (1) switch (_context35.p = _context35.n) {
          case 0:
            if (sessionCode) {
              _context35.n = 1;
              break;
            }
            return _context35.a(2);
          case 1:
            if (!state.sessionSwitchInFlight) {
              _context35.n = 2;
              break;
            }
            state.pendingSelectedSessionCode = sessionCode;
            return _context35.a(2);
          case 2:
            state.sessionSwitchInFlight = true;
            state.pendingSelectedSessionCode = '';
            state.selectedSessionCode = sessionCode;
            detachCurrentEditMessageEditor();
            state.editingMessageId = null;
            state.editingDraftText = '';
            state.deleteConfirmMessageId = null;

            // Optimistic clear unread as soon as admin opens the conversation.
            state.forceClearedUnread.add(sessionCode);
            targetSession = state.sessions.find(function (s) {
              return s.session_code === sessionCode;
            });
            if (targetSession) {
              targetSession.unread_count = 0;
              if (!['closed', 'archived'].includes(String(targetSession.status || '').toLowerCase())) {
                targetSession.status = 'active';
              }
            }
            state.unreadTotal = state.sessions.reduce(function (sum, s) {
              return sum + Number(s.unread_count || 0);
            }, 0);
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
            _context35.p = 3;
            _context35.n = 4;
            return loadMessages(sessionCode, {
              forceScrollBottom: true
            });
          case 4:
            _context35.n = 5;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(sessionCode), "/mark-read"), {
              method: 'PUT'
            });
          case 5:
            // Tell the player their messages have been delivered (triggers ✓✓ in player UI)
            fetch("/api/chat/admin/chat/".concat(encodeURIComponent(sessionCode), "/mark-delivered"), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            }).catch(function () {});
            _context35.n = 7;
            break;
          case 6:
            _context35.p = 6;
            _t20 = _context35.v;
          case 7:
            _context35.p = 7;
            state.sessionSwitchInFlight = false;
            renderSessionList();
            if (state.pendingSelectedSessionCode && state.pendingSelectedSessionCode !== state.selectedSessionCode) {
              queuedCode = state.pendingSelectedSessionCode;
              state.pendingSelectedSessionCode = '';
              selectSession(queuedCode);
            }
            return _context35.f(7);
          case 8:
            return _context35.a(2);
        }
      }, _callee35, null, [[3, 6, 7, 8]]);
    }));
    return _selectSession.apply(this, arguments);
  }
  function sendMessage() {
    return _sendMessage.apply(this, arguments);
  }
  function _sendMessage() {
    _sendMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36() {
      var useTiptap, inp, text, html, sessionCode, currentDisplayName, optimisticMsg, _inp, targetSession, _t21;
      return _regenerator().w(function (_context36) {
        while (1) switch (_context36.p = _context36.n) {
          case 0:
            // Prefer Tiptap editor content; fall back to hidden textarea
            useTiptap = window.CcTiptap && !window.CcTiptap.isEmpty();
            inp = byId('ccInput');
            text = useTiptap ? window.CcTiptap.getText().trim() : String((inp === null || inp === void 0 ? void 0 : inp.value) || '').trim();
            html = useTiptap ? window.CcTiptap.getHTML().trim() : text;
            if (!(!text || !state.selectedSessionCode || state.composerBusy)) {
              _context36.n = 1;
              break;
            }
            return _context36.a(2);
          case 1:
            sessionCode = state.selectedSessionCode;
            currentDisplayName = getCurrentAdminDisplayName();
            optimisticMsg = {
              id: "tmp_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8)),
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
            }; // Stop typing immediately once admin sends a message.
            stopAdminTyping(sessionCode);

            // Optimistic render for snappier chat UX.
            state.messages.push(optimisticMsg);
            renderMessages({
              forceScrollBottom: true
            });

            // Clear composer
            if (window.CcTiptap) {
              window.CcTiptap.clear();
            } else {
              _inp = byId('ccInput');
              if (_inp) {
                _inp.value = '';
                autoResizeInput(_inp);
              }
            }
            setComposerBusy(true);
            _context36.p = 2;
            _context36.n = 3;
            return api('/api/chat/admin/send-message', {
              method: 'POST',
              body: JSON.stringify({
                session_code: sessionCode,
                message: html
              })
            });
          case 3:
            state.forceClearedUnread.add(sessionCode);
            targetSession = state.sessions.find(function (s) {
              return s.session_code === sessionCode;
            });
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
            state.unreadTotal = state.sessions.reduce(function (sum, s) {
              return sum + Number(s.unread_count || 0);
            }, 0);
            updateNavbarUnreadBadge(state.unreadTotal, false);
            renderSessionList();
            renderDetails();
            renderTags();
            if (state._updateStatPills) state._updateStatPills();
            _context36.n = 4;
            return loadMessages(sessionCode, {
              forceScrollBottom: true
            });
          case 4:
            _context36.n = 5;
            return loadSessions();
          case 5:
            _context36.n = 7;
            break;
          case 6:
            _context36.p = 6;
            _t21 = _context36.v;
            state.messages = state.messages.filter(function (m) {
              return m.id !== optimisticMsg.id;
            });
            renderMessages({
              forceScrollBottom: true
            });
            throw _t21;
          case 7:
            _context36.p = 7;
            setComposerBusy(false);
            return _context36.f(7);
          case 8:
            return _context36.a(2);
        }
      }, _callee36, null, [[2, 6, 7, 8]]);
    }));
    return _sendMessage.apply(this, arguments);
  }
  function markDone() {
    return _markDone.apply(this, arguments);
  }
  function _markDone() {
    _markDone = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37() {
      return _regenerator().w(function (_context37) {
        while (1) switch (_context37.n) {
          case 0:
            if (state.selectedSessionCode) {
              _context37.n = 1;
              break;
            }
            return _context37.a(2);
          case 1:
            _context37.n = 2;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(state.selectedSessionCode), "/mark-resolved"), {
              method: 'PUT'
            });
          case 2:
            _context37.n = 3;
            return loadSessions();
          case 3:
            _context37.n = 4;
            return loadMessages(state.selectedSessionCode);
          case 4:
            renderDetails();
          case 5:
            return _context37.a(2);
        }
      }, _callee37);
    }));
    return _markDone.apply(this, arguments);
  }
  function joinSession(_x9) {
    return _joinSession.apply(this, arguments);
  } // ─── Takeover Overlay ────────────────────────────────────────────────────────
  function _joinSession() {
    _joinSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38(sessionCode) {
      var code, _t22;
      return _regenerator().w(function (_context38) {
        while (1) switch (_context38.p = _context38.n) {
          case 0:
            code = sessionCode || state.selectedSessionCode;
            if (code) {
              _context38.n = 1;
              break;
            }
            return _context38.a(2);
          case 1:
            _context38.p = 1;
            _context38.n = 2;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(code), "/join"), {
              method: 'POST'
            });
          case 2:
            markTakeoverPromptShown(code);
            hideTakeoverOverlay();
            _context38.n = 3;
            return loadSessions();
          case 3:
            renderDetails();
            if (!(code === state.selectedSessionCode)) {
              _context38.n = 4;
              break;
            }
            _context38.n = 4;
            return loadMessages(code);
          case 4:
            _context38.n = 6;
            break;
          case 5:
            _context38.p = 5;
            _t22 = _context38.v;
            alert(_t22.message || 'Không thể tham gia hội thoại');
          case 6:
            return _context38.a(2);
        }
      }, _callee38, null, [[1, 5]]);
    }));
    return _joinSession.apply(this, arguments);
  }
  function showTakeoverOverlay(session) {
    var overlay = byId('ccTakeoverOverlay');
    if (!overlay) return;
    var titleEl = byId('ccTakeoverTitle');
    var descEl = byId('ccTakeoverDesc');
    var acceptBtn = byId('ccTakeoverAccept');
    var agentId = Number((session === null || session === void 0 ? void 0 : session.support_agent_id) || 0);
    var agentName = String((session === null || session === void 0 ? void 0 : session.support_agent_name) || '').trim();
    var isOther = !!(agentId && agentName && agentId !== CURRENT_ADMIN_ID);
    if (titleEl) titleEl.textContent = isOther ? "Phi\xEAn \u0111ang do ".concat(agentName, " h\u1ED7 tr\u1EE3") : 'Khách hàng cần hỗ trợ';
    if (descEl) descEl.textContent = isOther ? "B\u1EA1n mu\u1ED1n ti\u1EBFp qu\u1EA3n phi\xEAn chat n\xE0y t\u1EEB ".concat(agentName, "?") : 'Phiên chat này chưa có ai hỗ trợ. Bạn muốn tiếp quản?';
    if (acceptBtn) acceptBtn.textContent = isOther ? '🤝 Tiếp quản' : '✅ Tiếp quản';
    overlay.style.display = '';
  }
  function hideTakeoverOverlay() {
    var overlay = byId('ccTakeoverOverlay');
    if (overlay) overlay.style.display = 'none';
  }
  function markTakeoverPromptShown(sessionCode) {
    var code = String(sessionCode || '').trim().toUpperCase();
    if (!code) return;
    state.takeoverPromptShownBySession[code] = true;
  }
  function shouldShowTakeoverOverlay(session) {
    if (!session) return false;
    var sessionCode = String(session.session_code || '').trim().toUpperCase();
    if (!sessionCode) return false;
    var agentId = Number(session.support_agent_id || 0);
    if (agentId > 0) return false;
    if (state.takeoverPromptShownBySession[sessionCode]) return false;
    return true;
  }

  // ─── Admin Presence ──────────────────────────────────────────────────────────
  function loadAdminPresence() {
    return _loadAdminPresence.apply(this, arguments);
  }
  function _loadAdminPresence() {
    _loadAdminPresence = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39() {
      var data, _t23;
      return _regenerator().w(function (_context39) {
        while (1) switch (_context39.p = _context39.n) {
          case 0:
            _context39.p = 0;
            _context39.n = 1;
            return fetch('/api/users/presence?limit=100', {
              cache: 'no-store'
            }).then(function (r) {
              return r.json();
            });
          case 1:
            data = _context39.v;
            if (!(!(data !== null && data !== void 0 && data.success) || !Array.isArray(data.data))) {
              _context39.n = 2;
              break;
            }
            return _context39.a(2);
          case 2:
            // Only show admin/manager accounts, not regular players
            state.adminPresenceList = data.data.filter(function (u) {
              return u.role && u.role !== 'player' && u.is_active;
            });
            renderAdminPresence();
            _context39.n = 4;
            break;
          case 3:
            _context39.p = 3;
            _t23 = _context39.v;
          case 4:
            return _context39.a(2);
        }
      }, _callee39, null, [[0, 3]]);
    }));
    return _loadAdminPresence.apply(this, arguments);
  }
  function renderAdminPresence() {
    var bar = byId('ccAdminPresenceBar');
    if (!bar) return;
    var list = state.adminPresenceList || [];
    if (!list.length) {
      bar.innerHTML = '';
      return;
    }
    var now = Date.now();
    var pills = list.map(function (u) {
      var online = !!u.is_online;
      var lastSeen = u.last_seen_at ? new Date(u.last_seen_at).getTime() : 0;
      var timeLabel = '';
      if (online) {
        timeLabel = 'Online';
      } else if (lastSeen > 0) {
        var diffMs = now - lastSeen;
        var diffMin = Math.round(diffMs / 60000);
        if (diffMin < 1) timeLabel = 'Vừa offline';else if (diffMin < 60) timeLabel = "".concat(diffMin, "ph tr\u01B0\u1EDBc");else if (diffMin < 1440) timeLabel = "".concat(Math.round(diffMin / 60), "h tr\u01B0\u1EDBc");else timeLabel = "".concat(Math.round(diffMin / 1440), "ng tr\u01B0\u1EDBc");
      } else {
        timeLabel = 'Không rõ';
      }
      var name = String(u.full_name || u.username || 'Admin').trim();
      var isCurrent = CURRENT_ADMIN_ID && Number(u.id) === CURRENT_ADMIN_ID;
      return "<span class=\"cc-presence-pill".concat(online ? ' online' : ' offline').concat(isCurrent ? ' is-me' : '', "\" title=\"").concat(safe(name), " \u2014 ").concat(timeLabel, "\">\n        <span class=\"cc-presence-dot\"></span>\n        <span class=\"cc-presence-name\">").concat(safe(name)).concat(isCurrent ? ' (bạn)' : '', "</span>\n        <span class=\"cc-presence-time\">").concat(timeLabel, "</span>\n      </span>");
    }).join('');
    bar.innerHTML = "<span class=\"cc-presence-label\">\uD83D\uDC65 Nh\xF3m:</span>".concat(pills);
  }
  // ─────────────────────────────────────────────────────────────────────────────
  function saveAdminNote() {
    return _saveAdminNote.apply(this, arguments);
  }
  function _saveAdminNote() {
    _saveAdminNote = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40() {
      var _byId78;
      var note;
      return _regenerator().w(function (_context40) {
        while (1) switch (_context40.n) {
          case 0:
            if (state.selectedSessionCode) {
              _context40.n = 1;
              break;
            }
            return _context40.a(2);
          case 1:
            note = String(((_byId78 = byId('ccAdminNote')) === null || _byId78 === void 0 ? void 0 : _byId78.value) || '').trim();
            _context40.n = 2;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(state.selectedSessionCode), "/note"), {
              method: 'PUT',
              body: JSON.stringify({
                note: note
              })
            });
          case 2:
            _context40.n = 3;
            return loadSessions();
          case 3:
            renderDetails();
          case 4:
            return _context40.a(2);
        }
      }, _callee40);
    }));
    return _saveAdminNote.apply(this, arguments);
  }
  function csvEscape(value) {
    var text = String(value === undefined || value === null ? '' : value);
    var escaped = text.replace(/"/g, '""');
    return "\"".concat(escaped, "\"");
  }
  function exportCurrentSessionCsv() {
    return _exportCurrentSessionCsv.apply(this, arguments);
  }
  function _exportCurrentSessionCsv() {
    _exportCurrentSessionCsv = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee41() {
      var sessionCode, rs, rows, header, csvLines, bom, blob, url, a;
      return _regenerator().w(function (_context41) {
        while (1) switch (_context41.n) {
          case 0:
            if (state.selectedSessionCode) {
              _context41.n = 1;
              break;
            }
            alert('Vui lòng chọn hội thoại trước khi xuất CSV.');
            return _context41.a(2);
          case 1:
            sessionCode = state.selectedSessionCode;
            _context41.n = 2;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(sessionCode), "/messages"));
          case 2:
            rs = _context41.v;
            rows = Array.isArray(rs.data) ? rs.data : [];
            header = ['session_code', 'created_at', 'sender_type', 'sender_name', 'message', 'message_type', 'attachment_url', 'ip', 'user_agent'];
            csvLines = [header.map(csvEscape).join(',')];
            rows.forEach(function (m) {
              var meta = m && _typeof(m.metadata) === 'object' ? m.metadata : function () {
                try {
                  return JSON.parse((m === null || m === void 0 ? void 0 : m.metadata) || '{}');
                } catch (_) {
                  return {};
                }
              }();
              var line = [sessionCode, (m === null || m === void 0 ? void 0 : m.created_at) || (m === null || m === void 0 ? void 0 : m.createdAt) || '', (m === null || m === void 0 ? void 0 : m.sender_type) || '', (m === null || m === void 0 ? void 0 : m.sender_name) || '', (m === null || m === void 0 ? void 0 : m.message) || '', (m === null || m === void 0 ? void 0 : m.message_type) || '', (m === null || m === void 0 ? void 0 : m.attachment_url) || '', (meta === null || meta === void 0 ? void 0 : meta.ip) || '', (meta === null || meta === void 0 ? void 0 : meta.user_agent) || ''];
              csvLines.push(line.map(csvEscape).join(','));
            });
            bom = "\uFEFF";
            blob = new Blob([bom + csvLines.join('\n')], {
              type: 'text/csv;charset=utf-8;'
            });
            url = URL.createObjectURL(blob);
            a = document.createElement('a');
            a.href = url;
            a.download = "chat_".concat(sessionCode, "_").concat(Date.now(), ".csv");
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          case 3:
            return _context41.a(2);
        }
      }, _callee41);
    }));
    return _exportCurrentSessionCsv.apply(this, arguments);
  }
  function saveCustomerNickname() {
    return _saveCustomerNickname.apply(this, arguments);
  }
  function _saveCustomerNickname() {
    _saveCustomerNickname = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee42() {
      var _byId79;
      var options,
        _options$silent2,
        silent,
        nickname,
        _args42 = arguments;
      return _regenerator().w(function (_context42) {
        while (1) switch (_context42.n) {
          case 0:
            options = _args42.length > 0 && _args42[0] !== undefined ? _args42[0] : {};
            _options$silent2 = options.silent, silent = _options$silent2 === void 0 ? false : _options$silent2;
            if (state.selectedSessionCode) {
              _context42.n = 1;
              break;
            }
            return _context42.a(2);
          case 1:
            nickname = String(((_byId79 = byId('ccCustomerNicknameInput')) === null || _byId79 === void 0 ? void 0 : _byId79.value) || '').trim();
            _context42.n = 2;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(state.selectedSessionCode), "/nickname"), {
              method: 'PUT',
              body: JSON.stringify({
                nickname: nickname
              })
            });
          case 2:
            _context42.n = 3;
            return loadSessions();
          case 3:
            renderDetails();
            if (!silent && typeof window.showToast === 'function') {
              window.showToast('Đã lưu nickname khách hàng.', 'success');
            }
          case 4:
            return _context42.a(2);
        }
      }, _callee42);
    }));
    return _saveCustomerNickname.apply(this, arguments);
  }
  function scheduleAutoSaveNickname() {
    if (state.autoSaveNicknameTimer) clearTimeout(state.autoSaveNicknameTimer);
    state.autoSaveNicknameTimer = setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            _context2.n = 1;
            return saveCustomerNickname({
              silent: true
            });
          case 1:
            _context2.n = 3;
            break;
          case 2:
            _context2.p = 2;
            _t2 = _context2.v;
          case 3:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 2]]);
    })), 600);
  }
  function openGameSession() {
    if (!state.selectedSessionCode) return;
    openGameSessionByCode(state.selectedSessionCode);
  }
  function uploadFile(_x0) {
    return _uploadFile.apply(this, arguments);
  }
  function _uploadFile() {
    _uploadFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee43(file) {
      var maxSize, formData, res, data;
      return _regenerator().w(function (_context43) {
        while (1) switch (_context43.p = _context43.n) {
          case 0:
            if (!(!state.selectedSessionCode || state.composerBusy)) {
              _context43.n = 1;
              break;
            }
            return _context43.a(2);
          case 1:
            maxSize = 10 * 1024 * 1024; // 10MB
            if (!(file.size > maxSize)) {
              _context43.n = 2;
              break;
            }
            alert('File quá lớn (tối đa 10MB)');
            return _context43.a(2);
          case 2:
            setComposerBusy(true);
            formData = new FormData();
            formData.append('file', file);
            formData.append('session_code', state.selectedSessionCode);
            _context43.n = 3;
            return fetch('/api/chat/admin/send-file', {
              method: 'POST',
              body: formData,
              cache: 'no-store'
            });
          case 3:
            res = _context43.v;
            _context43.p = 4;
            _context43.n = 5;
            return res.json().catch(function () {
              return {
                success: false
              };
            });
          case 5:
            data = _context43.v;
            if (!(!res.ok || !data.success)) {
              _context43.n = 6;
              break;
            }
            throw new Error(data.message || 'Upload thất bại');
          case 6:
            _context43.n = 7;
            return loadMessages(state.selectedSessionCode, {
              forceScrollBottom: true
            });
          case 7:
            _context43.n = 8;
            return loadSessions();
          case 8:
            _context43.p = 8;
            setComposerBusy(false);
            return _context43.f(8);
          case 9:
            return _context43.a(2);
        }
      }, _callee43, null, [[4,, 8, 9]]);
    }));
    return _uploadFile.apply(this, arguments);
  }
  function uploadFiles(_x1) {
    return _uploadFiles.apply(this, arguments);
  } // Tags management
  function _uploadFiles() {
    _uploadFiles = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee44(files) {
      var options,
        list,
        source,
        _iterator3,
        _step3,
        file,
        _args44 = arguments,
        _t24;
      return _regenerator().w(function (_context44) {
        while (1) switch (_context44.p = _context44.n) {
          case 0:
            options = _args44.length > 1 && _args44[1] !== undefined ? _args44[1] : {};
            list = Array.from(files || []).filter(Boolean);
            if (list.length) {
              _context44.n = 1;
              break;
            }
            return _context44.a(2);
          case 1:
            source = String(options.source || '').trim().toLowerCase();
            if (source === 'paste') {
              showInlineFeedback(list.length > 1 ? "\u0110\xE3 d\xE1n ".concat(list.length, " \u1EA3nh, \u0111ang g\u1EEDi...") : 'Đã dán ảnh từ clipboard, đang gửi...', 'info');
            }
            _iterator3 = _createForOfIteratorHelper(list);
            _context44.p = 2;
            _iterator3.s();
          case 3:
            if ((_step3 = _iterator3.n()).done) {
              _context44.n = 5;
              break;
            }
            file = _step3.value;
            _context44.n = 4;
            return uploadFile(file);
          case 4:
            _context44.n = 3;
            break;
          case 5:
            _context44.n = 7;
            break;
          case 6:
            _context44.p = 6;
            _t24 = _context44.v;
            _iterator3.e(_t24);
          case 7:
            _context44.p = 7;
            _iterator3.f();
            return _context44.f(7);
          case 8:
            return _context44.a(2);
        }
      }, _callee44, null, [[2, 6, 7, 8]]);
    }));
    return _uploadFiles.apply(this, arguments);
  }
  window.addSessionTag = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var input, tag, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          if (state.selectedSessionCode) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2);
        case 1:
          input = byId('ccTagInput');
          tag = ((input === null || input === void 0 ? void 0 : input.value) || '').trim();
          if (tag) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2);
        case 2:
          _context3.p = 2;
          _context3.n = 3;
          return api("/api/chat/admin/chat/".concat(encodeURIComponent(state.selectedSessionCode), "/tags"), {
            method: 'POST',
            body: JSON.stringify({
              tag: tag
            })
          });
        case 3:
          input.value = '';
          _context3.n = 4;
          return loadSessions();
        case 4:
          renderTags();
          _context3.n = 6;
          break;
        case 5:
          _context3.p = 5;
          _t3 = _context3.v;
        case 6:
          return _context3.a(2);
      }
    }, _callee3, null, [[2, 5]]);
  }));
  function renderTags() {
    var _current$metadata;
    var current = state.sessions.find(function (s) {
      return s.session_code === state.selectedSessionCode;
    });
    var tags = (current === null || current === void 0 || (_current$metadata = current.metadata) === null || _current$metadata === void 0 ? void 0 : _current$metadata.tags) || [];
    var list = byId('ccTagsList');
    if (!list) return;
    list.innerHTML = tags.map(function (t) {
      return "<span class=\"cc-session-tag\">".concat(safe(t), " <span class=\"cc-tag-remove\" onclick=\"removeSessionTag('").concat(safe(t), "')\">\u2715</span></span>");
    }).join('');
  }
  window.removeSessionTag = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(tag) {
      var _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            if (state.selectedSessionCode) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2);
          case 1:
            _context4.p = 1;
            _context4.n = 2;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(state.selectedSessionCode), "/tags"), {
              method: 'DELETE',
              body: JSON.stringify({
                tag: tag
              })
            });
          case 2:
            _context4.n = 3;
            return loadSessions();
          case 3:
            renderTags();
            _context4.n = 5;
            break;
          case 4:
            _context4.p = 4;
            _t4 = _context4.v;
          case 5:
            return _context4.a(2);
        }
      }, _callee4, null, [[1, 4]]);
    }));
    return function (_x10) {
      return _ref8.apply(this, arguments);
    };
  }();
  function startPolling() {
    var burstCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    if (!isCustomerCarePanelVisible()) return;
    if (state.sseConnected) return;
    var nextBurst = Number.isFinite(Number(burstCount)) ? Number(burstCount) : 0;
    state.pollingBurstRemaining = Math.max(state.pollingBurstRemaining, nextBurst);
    if (state.pollingTimer) return;
    var _runBurst = /*#__PURE__*/function () {
      var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              state.pollingTimer = null;
              _context5.n = 1;
              return pollOnce();
            case 1:
              state.pollingBurstRemaining = Math.max(0, Number(state.pollingBurstRemaining || 0) - 1);
              if (!(!isCustomerCarePanelVisible() || state.sseConnected || state.pollingBurstRemaining <= 0 && !window.LMB_DISABLE_SSE)) {
                _context5.n = 2;
                break;
              }
              return _context5.a(2);
            case 2:
              state.pollingTimer = setTimeout(_runBurst, state.pollingInterval);
            case 3:
              return _context5.a(2);
          }
        }, _callee5);
      }));
      return function runBurst() {
        return _ref9.apply(this, arguments);
      };
    }();
    _runBurst();
  }
  function restartPollingTimer() {
    if (!state.pollingTimer) return;
    clearTimeout(state.pollingTimer);
    state.pollingTimer = null;
    if (!state.sseConnected && isCustomerCarePanelVisible() && state.pollingBurstRemaining > 0) {
      startPolling(0);
    }
  }
  function pollOnce() {
    return _pollOnce.apply(this, arguments);
  }
  function _pollOnce() {
    _pollOnce = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee45() {
      var selectedBefore, selectedAfter, selectedSession, hasPotentialNew, nextInterval, _t25;
      return _regenerator().w(function (_context45) {
        while (1) switch (_context45.p = _context45.n) {
          case 0:
            if (isCustomerCarePanelVisible()) {
              _context45.n = 1;
              break;
            }
            return _context45.a(2);
          case 1:
            if (!state.sseConnected) {
              _context45.n = 2;
              break;
            }
            return _context45.a(2);
          case 2:
            if (!state.pollingBusy) {
              _context45.n = 3;
              break;
            }
            return _context45.a(2);
          case 3:
            state.pollingBusy = true;
            _context45.p = 4;
            selectedBefore = state.selectedSessionCode;
            _context45.n = 5;
            return loadSessions();
          case 5:
            selectedAfter = state.selectedSessionCode || selectedBefore;
            selectedSession = state.sessions.find(function (s) {
              return s.session_code === selectedAfter;
            });
            hasPotentialNew = Number((selectedSession === null || selectedSession === void 0 ? void 0 : selectedSession.unread_count) || 0) > 0 || !!state.forceNextMessagePoll;
            if (!(selectedAfter && shouldPollMessages() && hasPotentialNew)) {
              _context45.n = 6;
              break;
            }
            _context45.n = 6;
            return loadMessages(selectedAfter);
          case 6:
            if (state.pollingErrorCount !== 0 || state.pollingInterval !== state.pollingBaseInterval) {
              state.pollingErrorCount = 0;
              state.pollingInterval = state.pollingBaseInterval;
              restartPollingTimer();
            }
            _context45.n = 8;
            break;
          case 7:
            _context45.p = 7;
            _t25 = _context45.v;
            // Backoff polling on hosting/upstream failures to reduce repeated 503 bursts.
            state.pollingErrorCount += 1;
            nextInterval = Math.min(state.pollingMaxInterval, state.pollingBaseInterval * Math.pow(2, state.pollingErrorCount));
            if (nextInterval !== state.pollingInterval) {
              state.pollingInterval = nextInterval;
              restartPollingTimer();
            }
          case 8:
            _context45.p = 8;
            state.pollingBusy = false;
            return _context45.f(8);
          case 9:
            return _context45.a(2);
        }
      }, _callee45, null, [[4, 7, 8, 9]]);
    }));
    return _pollOnce.apply(this, arguments);
  }
  function stopPolling() {
    if (!state.pollingTimer) return;
    clearTimeout(state.pollingTimer);
    state.pollingTimer = null;
    state.pollingBurstRemaining = 0;
  }
  function bindEvents() {
    var _byId11, _byId13, _byId15, _byId16, _byId17, _byId18, _byId19, _byId20, _byId21, _byId23, _byId24, _byId25, _byId26, _byId27, _byId28, _byId31, _byId32, _byId33, _byId35, _byId36, _byId37, _byId38, _byId39, _byId40, _byId41, _byId42, _byId43, _byId44, _byId46, _byId48, _byId49, _byId50, _byId52, _byId54, _byId55, _byId56, _byId59, _byId60, _byId61, _byId63, _byId65, _byId66;
    var runReloadForFilter = /*#__PURE__*/function () {
      var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return loadSessions();
            case 1:
              if (!(state.selectedSessionCode && shouldPollMessages())) {
                _context6.n = 2;
                break;
              }
              _context6.n = 2;
              return loadMessages(state.selectedSessionCode);
            case 2:
              return _context6.a(2);
          }
        }, _callee6);
      }));
      return function runReloadForFilter() {
        return _ref0.apply(this, arguments);
      };
    }();
    (_byId11 = byId('ccMobileSearchBtn')) === null || _byId11 === void 0 || _byId11.addEventListener('click', function () {
      var _byId12;
      var panel = byId('panel-customer-care');
      if (!panel) return;
      var opening = !panel.classList.contains('cc-mobile-search-open');
      panel.classList.toggle('cc-mobile-search-open', opening);
      panel.classList.remove('cc-mobile-filter-open');
      if (opening) (_byId12 = byId('ccSearchInput')) === null || _byId12 === void 0 || _byId12.focus();
    });
    (_byId13 = byId('ccMobileFilterBtn')) === null || _byId13 === void 0 || _byId13.addEventListener('click', function () {
      var _byId14;
      var panel = byId('panel-customer-care');
      if (!panel) return;
      var opening = !panel.classList.contains('cc-mobile-filter-open');
      panel.classList.toggle('cc-mobile-filter-open', opening);
      panel.classList.remove('cc-mobile-search-open');
      if (opening) (_byId14 = byId('ccStatusFilter')) === null || _byId14 === void 0 || _byId14.focus();
    });
    (_byId15 = byId('ccToggleAdvancedFiltersBtn')) === null || _byId15 === void 0 || _byId15.addEventListener('click', function () {
      var panel = byId('panel-customer-care');
      if (!panel) return;
      var opening = panel.classList.contains('cc-advanced-filters-collapsed');
      panel.classList.toggle('cc-advanced-filters-collapsed', !opening);
      var btn = byId('ccToggleAdvancedFiltersBtn');
      if (btn) {
        btn.classList.toggle('is-open', opening);
        btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
      }
    });
    (_byId16 = byId('ccMobileBackBtn')) === null || _byId16 === void 0 || _byId16.addEventListener('click', function () {
      setMobileScreen('list');
    });
    (_byId17 = byId('ccConversationList')) === null || _byId17 === void 0 || _byId17.addEventListener('click', function (e) {
      // ── IP group header toggle ──────────────────────────────────────────
      var ipGroupHeader = e.target.closest('[data-action="toggle-ip-group"]');
      if (ipGroupHeader) {
        e.preventDefault();
        e.stopPropagation();
        var ip = String(ipGroupHeader.getAttribute('data-ip') || '').trim();
        if (!ip) return;
        if (state.expandedIpGroups.has(ip)) {
          state.expandedIpGroups.delete(ip);
        } else {
          state.expandedIpGroups.add(ip);
        }
        renderSessionList();
        return;
      }
      var menuBtn = e.target.closest('[data-action="toggle-conv-menu"]');
      if (menuBtn) {
        e.preventDefault();
        e.stopPropagation();
        var _code = String(menuBtn.getAttribute('data-code') || '').trim();
        state.openConversationMenuCode = state.openConversationMenuCode === _code ? '' : _code;
        renderSessionList();
        return;
      }
      var menuAction = e.target.closest('.cc-conv-menu-item[data-action]');
      if (menuAction) {
        e.preventDefault();
        e.stopPropagation();
        var action = String(menuAction.getAttribute('data-action') || '').trim();
        var _code2 = String(menuAction.getAttribute('data-code') || '').trim();
        state.openConversationMenuCode = '';
        renderSessionList();
        runConversationMenuAction(action, _code2).catch(function (err) {
          showInlineFeedback((err === null || err === void 0 ? void 0 : err.message) || 'Không thể thực hiện thao tác.', 'error');
        });
        return;
      }
      var item = e.target.closest('.cc-conv-item');
      if (!item) return;
      var code = item.getAttribute('data-code');
      if (!code) return;
      state.openConversationMenuCode = '';
      if (state.selectedSessionCode === code && !state.sessionSwitchInFlight) {
        // Allow re-clicking active conversation to force sync unread/messages quickly.
        api("/api/chat/admin/chat/".concat(encodeURIComponent(code), "/mark-read"), {
          method: 'PUT'
        }).catch(function () {});
        loadMessages(code, {
          forceImmediate: true
        }).catch(function () {});
        queueSessionRefresh();
        return;
      }
      selectSession(code);
    });
    (_byId18 = byId('ccMessages')) === null || _byId18 === void 0 || _byId18.addEventListener('click', /*#__PURE__*/function () {
      var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(e) {
        var startBtn, cancelBtn, saveBtn, messageId, editor, draft, requestDeleteBtn, confirmDeleteBtn, _messageId, cancelDeleteBtn, vpBtn, player, audio, playIcon, pauseIcon, waveEl, _player, _audio, rect, pct, _t5, _t6;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              startBtn = e.target.closest('[data-action="start-edit-message"]');
              if (!startBtn) {
                _context7.n = 1;
                break;
              }
              startEditMessage(startBtn.getAttribute('data-message-id'));
              return _context7.a(2);
            case 1:
              cancelBtn = e.target.closest('[data-action="cancel-edit-message"]');
              if (!cancelBtn) {
                _context7.n = 2;
                break;
              }
              cancelEditMessage();
              return _context7.a(2);
            case 2:
              saveBtn = e.target.closest('[data-action="save-edit-message"]');
              if (!saveBtn) {
                _context7.n = 7;
                break;
              }
              messageId = saveBtn.getAttribute('data-message-id');
              editor = document.querySelector("#ccMessages [contenteditable][data-edit-message-id=\"".concat(escapeCssSelectorValue(String(messageId || '')), "\"]"));
              draft = String((editor === null || editor === void 0 ? void 0 : editor.innerHTML) || '').trim();
              _context7.p = 3;
              _context7.n = 4;
              return saveEditedMessage(messageId, draft);
            case 4:
              _context7.n = 6;
              break;
            case 5:
              _context7.p = 5;
              _t5 = _context7.v;
              alert(_t5.message || 'Không thể chỉnh sửa tin nhắn');
            case 6:
              return _context7.a(2);
            case 7:
              requestDeleteBtn = e.target.closest('[data-action="request-delete-message"]');
              if (!requestDeleteBtn) {
                _context7.n = 8;
                break;
              }
              requestDeleteSupportMessage(requestDeleteBtn.getAttribute('data-message-id'));
              return _context7.a(2);
            case 8:
              confirmDeleteBtn = e.target.closest('[data-action="confirm-delete-message"]');
              if (!confirmDeleteBtn) {
                _context7.n = 13;
                break;
              }
              _messageId = confirmDeleteBtn.getAttribute('data-message-id');
              _context7.p = 9;
              _context7.n = 10;
              return deleteSupportMessage(_messageId);
            case 10:
              _context7.n = 12;
              break;
            case 11:
              _context7.p = 11;
              _t6 = _context7.v;
              alert(_t6.message || 'Không thể xóa tin nhắn');
            case 12:
              return _context7.a(2);
            case 13:
              cancelDeleteBtn = e.target.closest('[data-action="cancel-delete-message"]');
              if (!cancelDeleteBtn) {
                _context7.n = 14;
                break;
              }
              state.deleteConfirmMessageId = null;
              renderMessages({
                forceImmediate: true
              });
              return _context7.a(2);
            case 14:
              // Voice player: play/pause button
              vpBtn = e.target.closest('.cc-vp-btn');
              if (!vpBtn) {
                _context7.n = 16;
                break;
              }
              player = vpBtn.closest('.cc-voice-player');
              audio = player === null || player === void 0 ? void 0 : player.querySelector('audio');
              if (audio) {
                _context7.n = 15;
                break;
              }
              return _context7.a(2);
            case 15:
              // Stop all other players in this container
              document.querySelectorAll('#ccMessages .cc-voice-player.cc-vp-playing').forEach(function (p) {
                if (p === player) return;
                var a = p.querySelector('audio');
                if (a) a.pause();
                p.classList.remove('cc-vp-playing');
                var pi = p.querySelector('.cc-vp-play-icon'),
                  pa = p.querySelector('.cc-vp-pause-icon');
                if (pi) pi.style.display = '';
                if (pa) pa.style.display = 'none';
              });
              playIcon = player.querySelector('.cc-vp-play-icon');
              pauseIcon = player.querySelector('.cc-vp-pause-icon');
              if (audio.paused) {
                audio.play().catch(function () {});
                player.classList.add('cc-vp-playing');
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = '';
              } else {
                audio.pause();
                player.classList.remove('cc-vp-playing');
                if (playIcon) playIcon.style.display = '';
                if (pauseIcon) pauseIcon.style.display = 'none';
              }
              return _context7.a(2);
            case 16:
              // Voice player: waveform scrub
              waveEl = e.target.closest('.cc-vp-wave');
              if (!waveEl) {
                _context7.n = 18;
                break;
              }
              _player = waveEl.closest('.cc-voice-player');
              _audio = _player === null || _player === void 0 ? void 0 : _player.querySelector('audio');
              if (!(!_audio || !_audio.duration || !isFinite(_audio.duration))) {
                _context7.n = 17;
                break;
              }
              return _context7.a(2);
            case 17:
              rect = waveEl.getBoundingClientRect();
              pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              _audio.currentTime = pct * _audio.duration;
              return _context7.a(2);
            case 18:
              return _context7.a(2);
          }
        }, _callee7, null, [[9, 11], [3, 5]]);
      }));
      return function (_x11) {
        return _ref1.apply(this, arguments);
      };
    }());
    (_byId19 = byId('ccMessages')) === null || _byId19 === void 0 || _byId19.addEventListener('input', function (e) {
      var editor = e.target.closest('[contenteditable][data-edit-message-id]');
      if (!editor) return;
      state.editingDraftText = editor.innerHTML;
    });
    (_byId20 = byId('ccMessages')) === null || _byId20 === void 0 || _byId20.addEventListener('keydown', /*#__PURE__*/function () {
      var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(e) {
        var editor, messageId, _t7;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              editor = e.target.closest('[contenteditable][data-edit-message-id]');
              if (editor) {
                _context8.n = 1;
                break;
              }
              return _context8.a(2);
            case 1:
              if (!(e.key === 'Escape')) {
                _context8.n = 2;
                break;
              }
              e.preventDefault();
              cancelEditMessage();
              return _context8.a(2);
            case 2:
              if (!((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
                _context8.n = 6;
                break;
              }
              e.preventDefault();
              messageId = editor.getAttribute('data-edit-message-id');
              _context8.p = 3;
              _context8.n = 4;
              return saveEditedMessage(messageId, editor.innerHTML);
            case 4:
              _context8.n = 6;
              break;
            case 5:
              _context8.p = 5;
              _t7 = _context8.v;
              alert(_t7.message || 'Không thể chỉnh sửa tin nhắn');
            case 6:
              return _context8.a(2);
          }
        }, _callee8, null, [[3, 5]]);
      }));
      return function (_x12) {
        return _ref10.apply(this, arguments);
      };
    }());
    (_byId21 = byId('ccMobileMenuBtn')) === null || _byId21 === void 0 || _byId21.addEventListener('click', function () {
      var _byId22;
      (_byId22 = byId('ccMoreBtn')) === null || _byId22 === void 0 || _byId22.click();
    });
    (_byId23 = byId('ccToggleConversationsBtn')) === null || _byId23 === void 0 || _byId23.addEventListener('click', function () {
      setDesktopPaneVisibility('conversations');
    });
    (_byId24 = byId('ccToggleInfoBtn')) === null || _byId24 === void 0 || _byId24.addEventListener('click', function () {
      setDesktopPaneVisibility('info');
    });
    (_byId25 = byId('ccChatInfoTap')) === null || _byId25 === void 0 || _byId25.addEventListener('click', function () {
      if (!isMobileChatUi()) return;
      openInfoSheet();
    });
    (_byId26 = byId('ccInfoSheetBackdrop')) === null || _byId26 === void 0 || _byId26.addEventListener('click', closeInfoSheet);
    (_byId27 = byId('ccInfoSheetCloseBtn')) === null || _byId27 === void 0 || _byId27.addEventListener('click', closeInfoSheet);
    (_byId28 = byId('ccSearchInput')) === null || _byId28 === void 0 || _byId28.addEventListener('input', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            if (state.searchDebounceTimer) clearTimeout(state.searchDebounceTimer);
            state.searchDebounceTimer = setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
              return _regenerator().w(function (_context9) {
                while (1) switch (_context9.n) {
                  case 0:
                    _context9.n = 1;
                    return runReloadForFilter();
                  case 1:
                    return _context9.a(2);
                }
              }, _callee9);
            })), 280);
          case 1:
            return _context0.a(2);
        }
      }, _callee0);
    })));
    ['ccIpFilter', 'ccGameSessionFilter', 'ccDateFilter', 'ccMonthFilter'].forEach(function (id) {
      var _byId29, _byId30;
      (_byId29 = byId(id)) === null || _byId29 === void 0 || _byId29.addEventListener('input', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              if (state.filterDebounceTimer) clearTimeout(state.filterDebounceTimer);
              state.filterDebounceTimer = setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
                return _regenerator().w(function (_context1) {
                  while (1) switch (_context1.n) {
                    case 0:
                      _context1.n = 1;
                      return runReloadForFilter();
                    case 1:
                      return _context1.a(2);
                  }
                }, _callee1);
              })), 220);
            case 1:
              return _context10.a(2);
          }
        }, _callee10);
      })));
      (_byId30 = byId(id)) === null || _byId30 === void 0 || _byId30.addEventListener('change', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              if (state.filterDebounceTimer) clearTimeout(state.filterDebounceTimer);
              _context11.n = 1;
              return runReloadForFilter();
            case 1:
              return _context11.a(2);
          }
        }, _callee11);
      })));
    });
    (_byId31 = byId('ccClearFiltersBtn')) === null || _byId31 === void 0 || _byId31.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            ['ccIpFilter', 'ccGameSessionFilter', 'ccDateFilter', 'ccMonthFilter'].forEach(function (id) {
              var el = byId(id);
              if (el) el.value = '';
            });
            _context12.n = 1;
            return runReloadForFilter();
          case 1:
            return _context12.a(2);
        }
      }, _callee12);
    })));
    (_byId32 = byId('ccExportCsvBtn')) === null || _byId32 === void 0 || _byId32.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
      var _t8;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.p = _context13.n) {
          case 0:
            _context13.p = 0;
            _context13.n = 1;
            return exportCurrentSessionCsv();
          case 1:
            _context13.n = 3;
            break;
          case 2:
            _context13.p = 2;
            _t8 = _context13.v;
            alert(_t8.message || 'Không xuất được CSV');
          case 3:
            return _context13.a(2);
        }
      }, _callee13, null, [[0, 2]]);
    })));
    (_byId33 = byId('ccStatusFilter')) === null || _byId33 === void 0 || _byId33.addEventListener('change', /*#__PURE__*/function () {
      var _ref18 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(e) {
        var _byId34;
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.n) {
            case 0:
              state.statusFilter = e.target.value || 'all';
              (_byId34 = byId('panel-customer-care')) === null || _byId34 === void 0 || _byId34.classList.remove('cc-mobile-filter-open');
              _context14.n = 1;
              return loadSessions();
            case 1:
              if (!state.selectedSessionCode) {
                _context14.n = 2;
                break;
              }
              _context14.n = 2;
              return loadMessages(state.selectedSessionCode);
            case 2:
              return _context14.a(2);
          }
        }, _callee14);
      }));
      return function (_x13) {
        return _ref18.apply(this, arguments);
      };
    }());
    (_byId35 = byId('ccSendBtn')) === null || _byId35 === void 0 || _byId35.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
      var _t9;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.p = _context15.n) {
          case 0:
            _context15.p = 0;
            _context15.n = 1;
            return sendMessage();
          case 1:
            _context15.n = 3;
            break;
          case 2:
            _context15.p = 2;
            _t9 = _context15.v;
            alert(_t9.message || 'Không gửi được tin nhắn');
          case 3:
            return _context15.a(2);
        }
      }, _callee15, null, [[0, 2]]);
    })));
    (_byId36 = byId('ccInput')) === null || _byId36 === void 0 || _byId36.addEventListener('keydown', /*#__PURE__*/function () {
      var _ref20 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(e) {
        var _t0;
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.p = _context16.n) {
            case 0:
              if (!(e.key !== 'Enter')) {
                _context16.n = 1;
                break;
              }
              return _context16.a(2);
            case 1:
              if (!e.shiftKey) {
                _context16.n = 2;
                break;
              }
              return _context16.a(2);
            case 2:
              e.preventDefault();
              _context16.p = 3;
              _context16.n = 4;
              return sendMessage();
            case 4:
              _context16.n = 6;
              break;
            case 5:
              _context16.p = 5;
              _t0 = _context16.v;
              alert(_t0.message || 'Không gửi được tin nhắn');
            case 6:
              return _context16.a(2);
          }
        }, _callee16, null, [[3, 5]]);
      }));
      return function (_x14) {
        return _ref20.apply(this, arguments);
      };
    }());

    // Emit typing event when admin types
    (_byId37 = byId('ccInput')) === null || _byId37 === void 0 || _byId37.addEventListener('input', function () {
      var inputEl = byId('ccInput');
      if (!inputEl) return;
      if (state.inputRaf) cancelAnimationFrame(state.inputRaf);
      state.inputRaf = requestAnimationFrame(function () {
        autoResizeInput(inputEl);
        emitAdminTyping();
        state.inputRaf = 0;
      });
    });
    (_byId38 = byId('ccMarkDoneBtn')) === null || _byId38 === void 0 || _byId38.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
      var _t1;
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.p = _context17.n) {
          case 0:
            _context17.p = 0;
            _context17.n = 1;
            return markDone();
          case 1:
            _context17.n = 3;
            break;
          case 2:
            _context17.p = 2;
            _t1 = _context17.v;
            alert(_t1.message || 'Không thể cập nhật trạng thái');
          case 3:
            return _context17.a(2);
        }
      }, _callee17, null, [[0, 2]]);
    })));
    (_byId39 = byId('ccJoinSessionBtn')) === null || _byId39 === void 0 || _byId39.addEventListener('click', function () {
      joinSession(state.selectedSessionCode).catch(function () {});
    });
    (_byId40 = byId('ccTakeoverAccept')) === null || _byId40 === void 0 || _byId40.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.n) {
          case 0:
            hideTakeoverOverlay();
            _context18.n = 1;
            return joinSession(state.selectedSessionCode).catch(function () {});
          case 1:
            return _context18.a(2);
        }
      }, _callee18);
    })));
    (_byId41 = byId('ccTakeoverDecline')) === null || _byId41 === void 0 || _byId41.addEventListener('click', function () {
      hideTakeoverOverlay();
    });
    (_byId42 = byId('ccViewSessionBtn')) === null || _byId42 === void 0 || _byId42.addEventListener('click', openGameSession);
    (_byId43 = byId('ccSaveNoteBtn')) === null || _byId43 === void 0 || _byId43.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
      var _t10;
      return _regenerator().w(function (_context19) {
        while (1) switch (_context19.p = _context19.n) {
          case 0:
            _context19.p = 0;
            _context19.n = 1;
            return saveAdminNote();
          case 1:
            alert('Đã lưu ghi chú nội bộ.');
            _context19.n = 3;
            break;
          case 2:
            _context19.p = 2;
            _t10 = _context19.v;
            alert(_t10.message || 'Không lưu được ghi chú');
          case 3:
            return _context19.a(2);
        }
      }, _callee19, null, [[0, 2]]);
    })));

    // === NEW: File & image upload ===
    (_byId44 = byId('ccAttachBtn')) === null || _byId44 === void 0 || _byId44.addEventListener('click', function () {
      var _byId45;
      return (_byId45 = byId('ccFileUpload')) === null || _byId45 === void 0 ? void 0 : _byId45.click();
    });
    (_byId46 = byId('ccImageBtn')) === null || _byId46 === void 0 || _byId46.addEventListener('click', function () {
      var _byId47;
      return (_byId47 = byId('ccImageUpload')) === null || _byId47 === void 0 ? void 0 : _byId47.click();
    });
    (_byId48 = byId('ccFileUpload')) === null || _byId48 === void 0 || _byId48.addEventListener('change', /*#__PURE__*/function () {
      var _ref24 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(e) {
        var _e$target$files;
        var file, _t11;
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.p = _context20.n) {
            case 0:
              file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
              if (!(!file || !state.selectedSessionCode)) {
                _context20.n = 1;
                break;
              }
              return _context20.a(2);
            case 1:
              _context20.p = 1;
              _context20.n = 2;
              return uploadFiles([file]);
            case 2:
              _context20.n = 4;
              break;
            case 3:
              _context20.p = 3;
              _t11 = _context20.v;
              alert(_t11.message || 'Không gửi được file');
            case 4:
              e.target.value = '';
            case 5:
              return _context20.a(2);
          }
        }, _callee20, null, [[1, 3]]);
      }));
      return function (_x15) {
        return _ref24.apply(this, arguments);
      };
    }());
    (_byId49 = byId('ccImageUpload')) === null || _byId49 === void 0 || _byId49.addEventListener('change', /*#__PURE__*/function () {
      var _ref25 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(e) {
        var _e$target$files2;
        var file, _t12;
        return _regenerator().w(function (_context21) {
          while (1) switch (_context21.p = _context21.n) {
            case 0:
              file = (_e$target$files2 = e.target.files) === null || _e$target$files2 === void 0 ? void 0 : _e$target$files2[0];
              if (!(!file || !state.selectedSessionCode)) {
                _context21.n = 1;
                break;
              }
              return _context21.a(2);
            case 1:
              _context21.p = 1;
              _context21.n = 2;
              return uploadFiles([file]);
            case 2:
              _context21.n = 4;
              break;
            case 3:
              _context21.p = 3;
              _t12 = _context21.v;
              alert(_t12.message || 'Không gửi được ảnh');
            case 4:
              e.target.value = '';
            case 5:
              return _context21.a(2);
          }
        }, _callee21, null, [[1, 3]]);
      }));
      return function (_x16) {
        return _ref25.apply(this, arguments);
      };
    }());

    // === Emoji picker ===
    (_byId50 = byId('ccEmojiBtn')) === null || _byId50 === void 0 || _byId50.addEventListener('click', function (e) {
      e.stopPropagation();
      var p = byId('ccEmojiPicker');
      if (!p) return;
      initEmojiPicker();
      var open = p.style.display !== 'none' && p.style.display !== '';
      p.style.display = open ? 'none' : 'block';
      if (!open) {
        requestAnimationFrame(positionEmojiPicker);
      }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#ccEmojiPicker') && !e.target.closest('#ccEmojiBtn')) {
        var p = byId('ccEmojiPicker');
        if (p) p.style.display = 'none';
      }
    });
    window.addEventListener('resize', function () {
      var p = byId('ccEmojiPicker');
      if (!p || p.style.display === 'none' || p.style.display === '') return;
      positionEmojiPicker();
    });
    window.addEventListener('resize', function () {
      var _byId51;
      updatePollingProfile();
      applyCompactDesktopDefaults();
      setMobileScreen((_byId51 = byId('panel-customer-care')) !== null && _byId51 !== void 0 && _byId51.classList.contains('cc-mobile-chat-open') ? 'chat' : 'list');
    });

    // === NEW: Message search toggle ===
    (_byId52 = byId('ccSearchMsgBtn')) === null || _byId52 === void 0 || _byId52.addEventListener('click', function () {
      var _byId53;
      var bar = byId('ccMsgSearchBar');
      if (!bar) return;
      bar.style.display = bar.style.display === 'none' ? 'flex' : 'none';
      if (bar.style.display === 'flex') (_byId53 = byId('ccMsgSearchInput')) === null || _byId53 === void 0 || _byId53.focus();
    });
    (_byId54 = byId('ccMsgSearchInput')) === null || _byId54 === void 0 || _byId54.addEventListener('input', function (e) {
      var q = (e.target.value || '').toLowerCase();
      var box = byId('ccMessages');
      if (!box) return;
      box.querySelectorAll('.cc-msg-row').forEach(function (row) {
        var text = (row.textContent || '').toLowerCase();
        row.style.display = q && !text.includes(q) ? 'none' : '';
      });
    });
    (_byId55 = byId('ccToggleChatStyleBtn')) === null || _byId55 === void 0 || _byId55.addEventListener('click', function () {
      var bar = byId('ccChatStyleBar');
      if (!bar) return;
      bar.style.display = bar.style.display === 'flex' ? 'none' : 'flex';
    });

    // === NEW: More dropdown ===
    (_byId56 = byId('ccMoreBtn')) === null || _byId56 === void 0 || _byId56.addEventListener('click', function (e) {
      var _byId57;
      e.stopPropagation();
      (_byId57 = byId('ccMoreDropdown')) === null || _byId57 === void 0 || _byId57.classList.toggle('show');
    });
    document.addEventListener('click', function () {
      var _byId58;
      (_byId58 = byId('ccMoreDropdown')) === null || _byId58 === void 0 || _byId58.classList.remove('show');
      if (state.openConversationMenuCode) {
        state.openConversationMenuCode = '';
        renderSessionList();
      }
    });
    (_byId59 = byId('ccArchiveBtn')) === null || _byId59 === void 0 || _byId59.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
      var _t13;
      return _regenerator().w(function (_context22) {
        while (1) switch (_context22.p = _context22.n) {
          case 0:
            if (state.selectedSessionCode) {
              _context22.n = 1;
              break;
            }
            return _context22.a(2);
          case 1:
            if (confirm('Lưu trữ hội thoại này?')) {
              _context22.n = 2;
              break;
            }
            return _context22.a(2);
          case 2:
            _context22.p = 2;
            _context22.n = 3;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(state.selectedSessionCode), "/archive"), {
              method: 'PUT'
            });
          case 3:
            _context22.n = 4;
            return loadSessions();
          case 4:
            renderDetails();
            _context22.n = 6;
            break;
          case 5:
            _context22.p = 5;
            _t13 = _context22.v;
            alert(_t13.message || 'Lỗi');
          case 6:
            return _context22.a(2);
        }
      }, _callee22, null, [[2, 5]]);
    })));
    (_byId60 = byId('ccDeleteBtn')) === null || _byId60 === void 0 || _byId60.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
      var _t14;
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.p = _context23.n) {
          case 0:
            if (state.selectedSessionCode) {
              _context23.n = 1;
              break;
            }
            return _context23.a(2);
          case 1:
            if (confirm('Xóa hội thoại? Hành động này không thể hoàn tác.')) {
              _context23.n = 2;
              break;
            }
            return _context23.a(2);
          case 2:
            _context23.p = 2;
            _context23.n = 3;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(state.selectedSessionCode)), {
              method: 'DELETE'
            });
          case 3:
            state.selectedSessionCode = '';
            _context23.n = 4;
            return loadSessions();
          case 4:
            renderMessages();
            renderDetails();
            _context23.n = 6;
            break;
          case 5:
            _context23.p = 5;
            _t14 = _context23.v;
            alert(_t14.message || 'Lỗi');
          case 6:
            return _context23.a(2);
        }
      }, _callee23, null, [[2, 5]]);
    })));

    // === NEW: Priority toggle ===
    (_byId61 = byId('ccPriorityBtn')) === null || _byId61 === void 0 || _byId61.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
      var btn, isHigh, _t15;
      return _regenerator().w(function (_context24) {
        while (1) switch (_context24.p = _context24.n) {
          case 0:
            if (state.selectedSessionCode) {
              _context24.n = 1;
              break;
            }
            return _context24.a(2);
          case 1:
            btn = byId('ccPriorityBtn');
            isHigh = btn === null || btn === void 0 ? void 0 : btn.classList.contains('priority-high');
            _context24.p = 2;
            _context24.n = 3;
            return api("/api/chat/admin/chat/".concat(encodeURIComponent(state.selectedSessionCode), "/priority"), {
              method: 'PUT',
              body: JSON.stringify({
                priority: isHigh ? 'normal' : 'high'
              })
            });
          case 3:
            btn === null || btn === void 0 || btn.classList.toggle('priority-high');
            _context24.n = 5;
            break;
          case 4:
            _context24.p = 4;
            _t15 = _context24.v;
          case 5:
            return _context24.a(2);
        }
      }, _callee24, null, [[2, 4]]);
    })));
    syncColorPair('ccChatTextColor', 'ccChatTextColorText');
    syncColorPair('ccChatBgColor', 'ccChatBgColorText');
    syncColorPair('ccBubbleTheirsColor', 'ccBubbleTheirsColorText');
    syncColorPair('ccBubbleMineColor', 'ccBubbleMineColorText');
    syncColorPair('ccTextTheirsColor', 'ccTextTheirsColorText');
    syncColorPair('ccTextMineColor', 'ccTextMineColorText');
    ['ccChatTextColorText', 'ccChatBgColorText', 'ccBubbleTheirsColorText', 'ccBubbleMineColorText', 'ccTextTheirsColorText', 'ccTextMineColorText'].forEach(function (id) {
      var _byId62;
      (_byId62 = byId(id)) === null || _byId62 === void 0 || _byId62.addEventListener('input', function () {
        clearActiveThemePreset();
      });
    });
    (_byId63 = byId('ccSaveChatStyleBtn')) === null || _byId63 === void 0 || _byId63.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
      var _t16;
      return _regenerator().w(function (_context25) {
        while (1) switch (_context25.p = _context25.n) {
          case 0:
            _context25.p = 0;
            _context25.n = 1;
            return saveChatFrameStyle();
          case 1:
            _context25.n = 3;
            break;
          case 2:
            _context25.p = 2;
            _t16 = _context25.v;
            alert(_t16.message || 'Không lưu được màu chat');
          case 3:
            return _context25.a(2);
        }
      }, _callee25, null, [[0, 2]]);
    })));
    ['ccToastGroupEnabled', 'ccToastSwipeDismissEnabled', 'ccToastGroupWindowMs'].forEach(function (id) {
      var _byId64;
      (_byId64 = byId(id)) === null || _byId64 === void 0 || _byId64.addEventListener('change', function () {
        scheduleAutoSaveChatFrameStyle();
      });
    });
    (_byId65 = byId('ccSaveNicknameBtn')) === null || _byId65 === void 0 || _byId65.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26() {
      var _t17;
      return _regenerator().w(function (_context26) {
        while (1) switch (_context26.p = _context26.n) {
          case 0:
            _context26.p = 0;
            _context26.n = 1;
            return saveCustomerNickname();
          case 1:
            _context26.n = 3;
            break;
          case 2:
            _context26.p = 2;
            _t17 = _context26.v;
            alert(_t17.message || 'Không lưu được nickname');
          case 3:
            return _context26.a(2);
        }
      }, _callee26, null, [[0, 2]]);
    })));
    (_byId66 = byId('ccCustomerNicknameInput')) === null || _byId66 === void 0 || _byId66.addEventListener('input', function () {
      scheduleAutoSaveNickname();
    });
    document.querySelectorAll('[data-cc-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var themeKey = btn.getAttribute('data-cc-theme') || '';
        applyThemePreset(themeKey);
      });
    });

    // === NEW: Update stat pills ===
    state._updateStatPills = function () {
      var online = state.sessions.filter(function (s) {
        return s.status === 'active';
      }).length;
      var waiting = state.sessions.filter(function (s) {
        return s.status === 'waiting';
      }).length;
      var unread = state.sessions.reduce(function (sum, s) {
        return sum + Number(s.unread_count || 0);
      }, 0);
      var onlineEl = byId('ccOnlineCount');
      var waitingEl = byId('ccWaitingCount');
      var unreadEl = byId('ccUnreadCount');
      if (onlineEl) onlineEl.textContent = online;
      if (waitingEl) waitingEl.textContent = waiting;
      if (unreadEl) unreadEl.textContent = unread;
    };
  }

  // === Typing indicator functions ===
  var ccEmojiDataPromise = null;
  function getEmojiMartData() {
    return _getEmojiMartData.apply(this, arguments);
  }
  function _getEmojiMartData() {
    _getEmojiMartData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee46() {
      return _regenerator().w(function (_context46) {
        while (1) switch (_context46.n) {
          case 0:
            if (!ccEmojiDataPromise) {
              ccEmojiDataPromise = fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data').then(function (res) {
                if (!res.ok) throw new Error('Không tải được dữ liệu emoji');
                return res.json();
              });
            }
            return _context46.a(2, ccEmojiDataPromise);
        }
      }, _callee46);
    }));
    return _getEmojiMartData.apply(this, arguments);
  }
  function initEmojiPicker() {
    return _initEmojiPicker.apply(this, arguments);
  }
  function _initEmojiPicker() {
    _initEmojiPicker = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee47() {
      var picker, data, emojiPicker, _t26;
      return _regenerator().w(function (_context47) {
        while (1) switch (_context47.p = _context47.n) {
          case 0:
            picker = byId('ccEmojiPicker');
            if (!(!picker || picker.dataset.ready === '1')) {
              _context47.n = 1;
              break;
            }
            return _context47.a(2);
          case 1:
            if (!(!window.EmojiMart || typeof window.EmojiMart.Picker !== 'function')) {
              _context47.n = 2;
              break;
            }
            picker.innerHTML = '<div class="cc-emoji-fallback">Emoji đang tạm thời không khả dụng.</div>';
            return _context47.a(2);
          case 2:
            _context47.p = 2;
            _context47.n = 3;
            return getEmojiMartData();
          case 3:
            data = _context47.v;
            emojiPicker = new window.EmojiMart.Picker({
              data: data,
              theme: 'dark',
              locale: 'vi',
              perLine: 8,
              previewPosition: 'none',
              skinTonePosition: 'none',
              onEmojiSelect: function onEmojiSelect(emoji) {
                var native = (emoji === null || emoji === void 0 ? void 0 : emoji.native) || '';
                if (window.CcTiptap) {
                  window.CcTiptap.insertText(native);
                  picker.style.display = 'none';
                } else {
                  var inp = byId('ccInput');
                  if (!inp) return;
                  inp.value = "".concat(inp.value || '').concat(native);
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
            _context47.n = 5;
            break;
          case 4:
            _context47.p = 4;
            _t26 = _context47.v;
            picker.innerHTML = '<div class="cc-emoji-fallback">Không thể tải bộ emoji.</div>';
          case 5:
            return _context47.a(2);
        }
      }, _callee47, null, [[2, 4]]);
    }));
    return _initEmojiPicker.apply(this, arguments);
  }
  function positionEmojiPicker() {
    var picker = byId('ccEmojiPicker');
    var row = document.querySelector('#panel-customer-care .cc-input-row');
    var btn = byId('ccEmojiBtn');
    if (!picker || !row || !btn) return;
    var rowRect = row.getBoundingClientRect();
    var btnRect = btn.getBoundingClientRect();
    var pickerWidth = picker.offsetWidth || 352;
    var maxLeft = Math.max(8, rowRect.width - pickerWidth - 8);
    var left = Math.min(Math.max(8, btnRect.left - rowRect.left - 12), maxLeft);
    picker.style.left = "".concat(Math.round(left), "px");
    picker.style.bottom = "".concat(Math.round(rowRect.height + 8), "px");
  }
  function emitAdminTyping() {
    if (!state.selectedSessionCode) return;
    if (!state.adminIsTyping) {
      var _window$wsManager2;
      state.adminIsTyping = true;
      (_window$wsManager2 = window.wsManager) === null || _window$wsManager2 === void 0 || _window$wsManager2.sendTyping(state.selectedSessionCode, true);
    }
    clearTimeout(state.adminTypingTimer);
    state.adminTypingTimer = setTimeout(function () {
      stopAdminTyping(state.selectedSessionCode);
    }, 2000);
  }
  function stopAdminTyping(sessionCode) {
    var _window$wsManager3;
    if (!sessionCode) return;
    state.adminIsTyping = false;
    clearTimeout(state.adminTypingTimer);
    (_window$wsManager3 = window.wsManager) === null || _window$wsManager3 === void 0 || _window$wsManager3.sendTyping(sessionCode, false);
  }
  function showPlayerTyping(sessionCode) {
    if (!sessionCode) return;
    state.typingSessionCodes.add(sessionCode);
    renderSessionList();
    if (sessionCode !== state.selectedSessionCode) return;
    var el = byId('ccTypingIndicator');
    if (el) el.style.display = 'flex';
    clearTimeout(state.playerTypingTimers[sessionCode]);
    state.playerTypingTimers[sessionCode] = setTimeout(function () {
      return hidePlayerTyping(sessionCode);
    }, 3000);
  }
  function hidePlayerTyping(sessionCode) {
    if (!sessionCode) return;
    state.typingSessionCodes.delete(sessionCode);
    renderSessionList();
    if (sessionCode === state.selectedSessionCode) {
      var el = byId('ccTypingIndicator');
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
    window.adminChatSseHealth = function (status) {
      var connected = !!(status !== null && status !== void 0 && status.connected);
      state.sseConnected = connected;
      state.pendingMessagePollFallback = !connected;
      var parsedId = parseInt((status === null || status === void 0 ? void 0 : status.lastEventId) || '0', 10);
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
    window.adminChatShowTyping = function (sessionCode, isTyping) {
      if (isTyping) showPlayerTyping(sessionCode);else hidePlayerTyping(sessionCode);
    };
    window.adminChatUpdateOnlineStatus = function (sessionCode, online, lastSeen, sinceTs) {
      // Update local cache as fallback for when wsManager hasn't seen events yet
      var lastSeenTs = lastSeen ? new Date(lastSeen).getTime() : null;
      var parsedSinceTs = sinceTs ? new Date(sinceTs).getTime() : null;
      _playerOnlineCache[sessionCode] = {
        online: !!online,
        lastSeenTs: lastSeenTs,
        sinceTs: parsedSinceTs
      };

      // If this is the currently open session, (re)start the live ticker
      if (sessionCode === state.selectedSessionCode) {
        _refreshOnlineStatusUI(sessionCode);
      }
    };

    // Called when player reads admin messages (mark-seen event)
    window.adminChatMarkSeen = function (sessionCode, seenAt) {
      // Persist in memory so renderMessages shows correct state until DB poll
      state.seenSessions.add(sessionCode);
      var parsedSeenAt = new Date(seenAt || Date.now()).getTime();
      state.seenSessionAt[sessionCode] = Number.isFinite(parsedSeenAt) && parsedSeenAt > 0 ? parsedSeenAt : Date.now();
      // Re-render if this is the currently open session
      if (sessionCode === state.selectedSessionCode) {
        renderMessages();
      }
    };

    // Called by handleChatMessage in adminDashboard.ejs when a new player message arrives
    window.adminChatHandleNewMessage = function (payload) {
      var sessionCode = (payload === null || payload === void 0 ? void 0 : payload.sessionCode) || (payload === null || payload === void 0 ? void 0 : payload.session_code);
      if (!sessionCode) return;
      state.typingSessionCodes.delete(sessionCode);
      clearTimeout(state.playerTypingTimers[sessionCode]);
      var incomingMessage = normalizeIncomingPayloadMessage(payload);
      var isSelected = sessionCode === state.selectedSessionCode;
      if (!isSelected) {
        state.forceClearedUnread.delete(sessionCode);
      }
      // If this session is currently open, reload its messages in real-time
      if (isSelected) {
        hidePlayerTyping(sessionCode);
        var appended = enqueueIncomingMessage(sessionCode, incomingMessage);
        // Keep unread at zero for currently handled conversation.
        state.forceClearedUnread.add(sessionCode);
        var selectedSession = state.sessions.find(function (s) {
          return s.session_code === sessionCode;
        });
        if (selectedSession) {
          selectedSession.unread_count = 0;
          if (!['closed', 'archived'].includes(String(selectedSession.status || '').toLowerCase())) {
            selectedSession.status = 'active';
          }
        }
        state.unreadTotal = state.sessions.reduce(function (sum, s) {
          return sum + Number(s.unread_count || 0);
        }, 0);
        updateNavbarUnreadBadge(state.unreadTotal, false);
        updateConversationToggleUnreadBadge(state.unreadTotal);
        renderSessionList();
        api("/api/chat/admin/chat/".concat(encodeURIComponent(sessionCode), "/mark-read"), {
          method: 'PUT'
        }).catch(function () {});
        if (!appended) {
          // Fallback when payload does not contain enough data to append directly.
          state.forceNextMessagePoll = true;
          if (shouldPollMessages()) {
            loadMessages(sessionCode, {
              forceImmediate: true
            }).catch(function () {});
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
    window.adminChatHandleEditedMessage = function (payload) {
      var sessionCode = (payload === null || payload === void 0 ? void 0 : payload.sessionCode) || (payload === null || payload === void 0 ? void 0 : payload.session_code);
      var editedMessage = payload === null || payload === void 0 ? void 0 : payload.message;
      if (!sessionCode || !editedMessage) return;
      if (sessionCode === state.selectedSessionCode) {
        var index = state.messages.findIndex(function (m) {
          return String(m.id) === String(editedMessage.id);
        });
        if (index >= 0) {
          state.messages[index] = _objectSpread(_objectSpread({}, state.messages[index]), editedMessage);
          if (state.editingMessageId !== null && String(state.editingMessageId) === String(editedMessage.id)) {
            detachCurrentEditMessageEditor();
            state.editingMessageId = null;
            state.editingDraftText = '';
          }
          renderMessages({
            forceImmediate: true
          });
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
  function init() {
    return _init.apply(this, arguments);
  }
  function _init() {
    _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee50() {
      var root, filterToggleBtn, _t29;
      return _regenerator().w(function (_context50) {
        while (1) switch (_context50.p = _context50.n) {
          case 0:
            if (window.LMB_DISABLE_SSE) {
              state.pollingInterval = 2000;
              state.pollingBaseInterval = 2000;
              state.pollingMaxInterval = 5000;
            }
            root = byId('panel-customer-care');
            if (root) {
              _context50.n = 1;
              break;
            }
            return _context50.a(2);
          case 1:
            // Setup SSE callbacks early so health events can suppress fallback polling.
            setupSSEListeners();
            bindEvents();
            root.classList.add('cc-advanced-filters-collapsed');
            filterToggleBtn = byId('ccToggleAdvancedFiltersBtn');
            if (filterToggleBtn) {
              filterToggleBtn.classList.remove('is-open');
              filterToggleBtn.setAttribute('aria-expanded', 'false');
            }
            refreshPaneToggleUi();
            applyCompactDesktopDefaults();
            setMobileScreen('list');
            initEmojiPicker();
            loadVisualSettings().catch(function () {});
            autoResizeInput(byId('ccInput'));
            if (window.CcTiptap) {
              CcTiptap.init({
                onSend: function () {
                  var _onSend = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee48() {
                    var _t27;
                    return _regenerator().w(function (_context48) {
                      while (1) switch (_context48.p = _context48.n) {
                        case 0:
                          _context48.p = 0;
                          _context48.n = 1;
                          return sendMessage();
                        case 1:
                          _context48.n = 3;
                          break;
                        case 2:
                          _context48.p = 2;
                          _t27 = _context48.v;
                          alert(_t27.message || 'Không gửi được tin nhắn');
                        case 3:
                          return _context48.a(2);
                      }
                    }, _callee48, null, [[0, 2]]);
                  }));
                  function onSend() {
                    return _onSend.apply(this, arguments);
                  }
                  return onSend;
                }(),
                onInput: function onInput() {
                  emitAdminTyping();
                },
                onPasteImage: function () {
                  var _onPasteImage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee49(files) {
                    var _t28;
                    return _regenerator().w(function (_context49) {
                      while (1) switch (_context49.p = _context49.n) {
                        case 0:
                          _context49.p = 0;
                          _context49.n = 1;
                          return uploadFiles(files, {
                            source: 'paste'
                          });
                        case 1:
                          _context49.n = 3;
                          break;
                        case 2:
                          _context49.p = 2;
                          _t28 = _context49.v;
                          alert(_t28.message || 'Không gửi được ảnh đã dán');
                        case 3:
                          return _context49.a(2);
                      }
                    }, _callee49, null, [[0, 2]]);
                  }));
                  function onPasteImage(_x17) {
                    return _onPasteImage.apply(this, arguments);
                  }
                  return onPasteImage;
                }()
              });
            }
            _context50.p = 2;
            _context50.n = 3;
            return loadSessions();
          case 3:
            _context50.n = 4;
            return loadMessages(state.selectedSessionCode);
          case 4:
            renderDetails();
            if (isCustomerCarePanelVisible()) {
              updateNavbarUnreadBadge(state.unreadTotal, false);
            }
            if (window.LMB_DISABLE_SSE) {
              startPolling(1);
            } else {
              stopPolling();
            }
            _context50.n = 6;
            break;
          case 5:
            _context50.p = 5;
            _t29 = _context50.v;
            byId('ccConversationList').innerHTML = "<div class=\"cc-conv-sub\" style=\"padding:12px;\">".concat(safe(_t29.message || 'Không tải được dữ liệu'), "</div>");
          case 6:
            // Load admin presence on init and refresh every 30s
            loadAdminPresence();
            if (state._presenceTimer) clearInterval(state._presenceTimer);
            state._presenceTimer = setInterval(function () {
              if (isCustomerCarePanelVisible()) loadAdminPresence();
            }, 30000);
          case 7:
            return _context50.a(2);
        }
      }, _callee50, null, [[2, 5]]);
    }));
    return _init.apply(this, arguments);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden || !isCustomerCarePanelVisible()) {
      stopPolling();
    } else if (!state.sseConnected && isCustomerCarePanelVisible()) {
      // Tab became visible again — restart polling if SSE is not connected
      startPolling(1);
    }
  });

  // Fired by customer-care.ejs when the CSKH panel active state changes.
  window.addEventListener('cc:visibility', function (event) {
    var _event$detail;
    var visible = !!(event !== null && event !== void 0 && (_event$detail = event.detail) !== null && _event$detail !== void 0 && _event$detail.visible);
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