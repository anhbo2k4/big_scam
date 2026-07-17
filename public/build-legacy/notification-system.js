function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * notification-system.js  (ES6 source — Babel → public/build-legacy/notification-system.js)
 *
 * Progressive Notification System — production-ready for:
 *   • Modern browsers (Chrome, Edge, Firefox, Safari 16.4+)
 *   • Android WebView (Telegram, Facebook, Zalo) — full fallback path
 *   • Android 5+ legacy (via ES5 transpiled build)
 *
 * Priority chain:
 *   1. Service Worker + Push API  (cross-tab, background)
 *   2. Notification API           (foreground / tab not focused)
 *   3. Sound                      (window.notificationSound)
 *   4. Title blink + tab badge    (window.tabNotification)
 *
 * Exposed globals:
 *   window.notifyNewMessage(options)   — trigger a notification immediately
 *   window.pushNotification            — push subscription management
 *   window.notificationSystem          — status / internals
 *
 * Usage:
 *   notifyNewMessage({ title: 'Tin nhắn mới', body: 'Bạn có tin nhắn mới' });
 */

(function (window, document) {
  'use strict';

  // ─── Guard: prevent double-init ──────────────────────────────────────────
  if (window.notificationSystem && window.notificationSystem._initialized) return;

  // ─── IIFE-safe setTimeout (works even if window.setTimeout is shimmed) ───
  var _setTimeout = typeof window !== 'undefined' && window.setTimeout || setTimeout;
  var _clearTimeout = typeof window !== 'undefined' && window.clearTimeout || clearTimeout;

  // ─── Environment Detection ───────────────────────────────────────────────

  var WEB_VIEW_RE = /FBAN|FBAV|FB_IAB|Telegram\/|TelegramWebApp|Line\/|MicroMessenger|ZaloApp|Instagram;|Twitter\/|Snapchat|WhatsApp|Viber/i;
  function detectEnv() {
    var ua = '';
    try {
      ua = String(navigator.userAgent || '');
    } catch (_) {}
    var isWebView = WEB_VIEW_RE.test(ua);
    var isPWA = false;
    try {
      isPWA = !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    } catch (_) {}
    return {
      ua: ua,
      isWebView: isWebView,
      isPWA: isPWA,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasNotification: typeof Notification !== 'undefined',
      hasPushManager: 'serviceWorker' in navigator && 'PushManager' in window,
      hasPromise: typeof Promise !== 'undefined',
      hasFetch: typeof fetch === 'function'
    };
  }
  var env = detectEnv();

  // ─── Safe executor ───────────────────────────────────────────────────────

  function safe(fn, fallback) {
    try {
      return fn();
    } catch (_) {
      return fallback !== undefined ? fallback : undefined;
    }
  }

  // ─── State ───────────────────────────────────────────────────────────────

  var state = {
    _initialized: false,
    swRegistration: null,
    pushSubscription: null,
    vapidPublicKey: null,
    permission: null,
    unreadCount: 0,
    pendingBatch: [],
    debounceTimer: null
  };

  // ─── VAPID key decoder ───────────────────────────────────────────────────

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    var raw = window.atob(base64);
    var arr = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) {
      arr[i] = raw.charCodeAt(i);
    }
    return arr;
  }

  // ─── Visibility helpers ──────────────────────────────────────────────────

  function isDocHidden() {
    return safe(function () {
      if (typeof document.hidden !== 'undefined') return document.hidden;
      if (typeof document.webkitHidden !== 'undefined') return document.webkitHidden;
      return false;
    }, false);
  }
  function isPageFocused() {
    return safe(function () {
      return !!(document.hasFocus && document.hasFocus());
    }, true);
  }

  // ─── Sound integration (window.notificationSound) ───────────────────────

  function playSound(type) {
    safe(function () {
      var snd = window.notificationSound;
      if (!snd) return;
      if (type === 'action') {
        if (snd.playActionNotification) snd.playActionNotification();else if (snd.play) snd.play('action');
      } else {
        if (snd.playChatNotification) snd.playChatNotification();else if (snd.play) snd.play('chat');
      }
    });
  }

  // ─── Tab badge + blink (window.tabNotification) ──────────────────────────

  function updateTabBadge(count, label) {
    safe(function () {
      var tab = window.tabNotification;
      if (!tab) return;
      if (count > 0) {
        if (tab.startTabBlink) tab.startTabBlink(count, label || 'Thông báo mới');else if (tab.incrementBadge) tab.incrementBadge(label);
      } else {
        if (tab.stopTabBlink) tab.stopTabBlink();else if (tab.resetBadge) tab.resetBadge();
      }
    });
  }

  // ─── Notification permission ─────────────────────────────────────────────

  function getCurrentPermission() {
    if (!env.hasNotification) return 'unsupported';
    return safe(function () {
      return Notification.permission;
    }, 'default');
  }

  /**
   * Request notification permission.
   * Returns a Promise<'granted'|'denied'|'default'>
   */
  function requestPermission() {
    if (!env.hasNotification) return Promise.resolve('unsupported');
    var perm = safe(function () {
      return Notification.permission;
    }, 'default');
    if (perm === 'granted' || perm === 'denied') return Promise.resolve(perm);
    return safe(function () {
      // Chrome 47+ → Promise API; legacy Safari → old callback API.
      // Calling requestPermission() on the old API returns undefined, so
      // Promise.resolve(undefined) would resolve immediately as undefined.
      // We detect which form is supported and normalise to a Promise.
      var result = Notification.requestPermission();
      var p = result && typeof result.then === 'function' ? result : new Promise(function (resolve) {
        Notification.requestPermission(function (r) {
          resolve(r);
        });
      });
      return p.then(function (r) {
        state.permission = r;
        return r;
      });
    }, Promise.resolve('denied'));
  }

  // ─── Browser Notification API ────────────────────────────────────────────

  function showBrowserNotification(opts) {
    if (!env.hasNotification) return false;
    if (getCurrentPermission() !== 'granted') return false;
    return safe(function () {
      var title = opts.title || 'Thông báo mới';
      var options = {
        body: opts.body || '',
        icon: opts.icon || '/favicon.ico',
        tag: opts.tag || 'notif-' + Date.now(),
        requireInteraction: false,
        silent: !!opts.silent
      };
      if (opts.badge) options.badge = opts.badge;
      if (opts.image) options.image = opts.image;
      var notif = new Notification(title, options);
      notif.onclick = function () {
        safe(function () {
          window.focus();
          if (opts.url) window.location.href = opts.url;
          notif.close();
        });
      };
      _setTimeout(function () {
        safe(function () {
          notif.close();
        });
      }, 5000);
      return true;
    }, false);
  }

  // ─── Service Worker ──────────────────────────────────────────────────────

  function registerServiceWorker() {
    if (!env.hasServiceWorker || env.isWebView) {
      return Promise.resolve(null);
    }
    return safe(function () {
      return navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      }).then(function (reg) {
        state.swRegistration = reg;

        // If a new SW is already waiting (re-deploy scenario), activate it.
        function activateWaiting(worker) {
          if (worker && worker.state !== 'redundant') {
            safe(function () {
              worker.postMessage({
                type: 'SKIP_WAITING'
              });
            });
          }
        }
        if (reg.waiting) activateWaiting(reg.waiting);

        // Watch for future SW updates downloaded in the background.
        reg.addEventListener('updatefound', function () {
          var next = reg.installing;
          if (!next) return;
          next.addEventListener('statechange', function () {
            if (next.state === 'installed' && navigator.serviceWorker.controller) {
              activateWaiting(reg.waiting);
            }
          });
        });
        return reg;
      }).catch(function () {
        return null;
      });
    }, Promise.resolve(null));
  }
  function loadVapidKey() {
    if (!env.hasFetch) return Promise.resolve(null);
    return safe(function () {
      return fetch('/api/push/vapid-key', {
        credentials: 'same-origin'
      }).then(function (r) {
        return r.ok ? r.json() : null;
      }).then(function (data) {
        state.vapidPublicKey = data && data.publicKey || null;
        return state.vapidPublicKey;
      }).catch(function () {
        return null;
      });
    }, Promise.resolve(null));
  }
  function subscribeToPush() {
    if (!env.hasPushManager || !state.swRegistration || !state.vapidPublicKey) {
      return Promise.resolve(null);
    }
    if (getCurrentPermission() !== 'granted') return Promise.resolve(null);
    return safe(function () {
      return state.swRegistration.pushManager.getSubscription().then(function (existing) {
        if (existing) {
          state.pushSubscription = existing;
          return existing;
        }
        return state.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(state.vapidPublicKey)
        });
      }).then(function (sub) {
        state.pushSubscription = sub;
        savePushSubscription(sub); // non-blocking
        return sub;
      }).catch(function () {
        return null;
      });
    }, Promise.resolve(null));
  }
  function savePushSubscription(sub) {
    if (!env.hasFetch || !sub) return;
    safe(function () {
      var serialized = JSON.parse(JSON.stringify(sub));
      fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          subscription: serialized,
          deviceInfo: {
            userAgent: env.ua,
            platform: safe(function () {
              return navigator.platform || '';
            }, ''),
            isWebView: env.isWebView,
            isPWA: env.isPWA
          }
        })
      }).catch(function () {/* non-blocking */});
    });
  }
  function unsubscribeFromPush() {
    return safe(function () {
      if (!state.pushSubscription) return Promise.resolve();
      var endpoint = state.pushSubscription.endpoint;
      return state.pushSubscription.unsubscribe().then(function () {
        state.pushSubscription = null;
        if (env.hasFetch) {
          fetch('/api/push/subscribe', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
              endpoint: endpoint
            })
          }).catch(function () {});
        }
      }).catch(function () {});
    }, Promise.resolve());
  }

  // ─── Notification dispatch ───────────────────────────────────────────────

  var DEBOUNCE_MS = 450;
  var MAX_BATCH = 8;
  // Per-call options can override these; set via notifyNewMessage.setDefaults()
  var _defaults = {};
  function _flush() {
    var batch = state.pendingBatch.slice();
    state.pendingBatch = [];
    state.debounceTimer = null;
    if (!batch.length) return;
    var first = batch[0];
    var count = batch.length;
    var title = count > 1 ? (first.title || 'Thông báo mới') + ' (+' + (count - 1) + ' tin khác)' : first.title || 'Thông báo mới';
    var body = count > 1 ? 'Bạn có ' + count + ' thông báo mới' : first.body || '';

    // 1. Always play sound + update badge
    playSound(first.soundType || 'chat');
    state.unreadCount += count;
    updateTabBadge(state.unreadCount, title);

    // 2. Browser notification only when page is not focused
    if (!isPageFocused()) {
      var swPromise = null;

      // Prefer SW-based notification — it works even with the page backgrounded/closed.
      // showNotification() returns a Promise; we must chain .catch() for the fallback
      // because a synchronous try/catch won't catch an async rejection.
      if (state.swRegistration && state.swRegistration.showNotification) {
        swPromise = safe(function () {
          return state.swRegistration.showNotification(title, {
            body: body,
            icon: first.icon || '/favicon.ico',
            badge: first.badge || '/favicon.ico',
            tag: first.tag || 'notification',
            renotify: !!first.tag,
            requireInteraction: false,
            data: {
              url: first.url || window.location.href
            }
          });
        }, null);
      }
      if (swPromise && typeof swPromise.then === 'function') {
        // SW path: use Notification API as fallback if the Promise rejects
        swPromise.catch(function () {
          showBrowserNotification({
            title: title,
            body: body,
            icon: first.icon,
            tag: first.tag,
            url: first.url
          });
        });
      } else {
        // No SW available — fall back to Notification API directly
        showBrowserNotification({
          title: title,
          body: body,
          icon: first.icon,
          tag: first.tag,
          url: first.url
        });
      }
    }
  }
  function notify(options) {
    if (!options || _typeof(options) !== 'object') {
      options = {
        title: String(options || 'Thông báo mới')
      };
    }
    // Merge global defaults (per-call options take precedence)
    var merged = {};
    for (var _dk in _defaults) {
      if (Object.prototype.hasOwnProperty.call(_defaults, _dk)) merged[_dk] = _defaults[_dk];
    }
    for (var _ok in options) {
      if (Object.prototype.hasOwnProperty.call(options, _ok)) merged[_ok] = options[_ok];
    }
    state.pendingBatch.push(merged);
    if (state.pendingBatch.length >= MAX_BATCH) {
      if (state.debounceTimer) _clearTimeout(state.debounceTimer);
      _flush();
      return;
    }
    if (state.debounceTimer) _clearTimeout(state.debounceTimer);
    state.debounceTimer = _setTimeout(_flush, DEBOUNCE_MS);
  }

  // ─── Page focus — reset badge ────────────────────────────────────────────

  function onFocus() {
    state.unreadCount = 0;
    updateTabBadge(0);
  }

  // ─── Init ────────────────────────────────────────────────────────────────

  function init() {
    if (state._initialized) return;
    state._initialized = true;
    state.permission = getCurrentPermission();

    // Reset badge on tab focus
    safe(function () {
      window.addEventListener('focus', onFocus);
    });
    safe(function () {
      document.addEventListener('visibilitychange', function () {
        if (!isDocHidden()) onFocus();
      });
    });

    // When a new SW takes control, refresh our registration reference so
    // subsequent showNotification() calls go to the correct (updated) worker.
    if (env.hasServiceWorker) {
      safe(function () {
        navigator.serviceWorker.addEventListener('controllerchange', function () {
          safe(function () {
            navigator.serviceWorker.ready.then(function (reg) {
              state.swRegistration = reg;
            }).catch(function () {});
          });
        });
      });
    }

    // Non-blocking: register SW and optionally subscribe to push
    registerServiceWorker().then(function (reg) {
      if (!reg) return;
      return loadVapidKey().then(function (key) {
        if (!key) return;
        // Only subscribe if permission already granted (don't prompt UI on init)
        if (getCurrentPermission() === 'granted') {
          return subscribeToPush();
        }
      });
    }).catch(function () {/* non-blocking */});
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  /**
   * Trigger a notification.
   * @param {object|string} options
   *   { title, body, icon, tag, url, silent, soundType: 'chat'|'action' }
   */
  window.notifyNewMessage = function (options) {
    notify(typeof options === 'string' ? {
      title: options
    } : options || {});
  };

  /**
   * Convenience wrapper for incoming chat messages.
   * Usage: window.notifyNewMessage.fromChat(msg);
   * msg shape: { sender_name?, support_agent_name?, customer_name?,
   *              content?, message?, text?, avatar_url?, session_code? }
   */
  window.notifyNewMessage.fromChat = function (msg, opts) {
    var senderName = msg && (msg.sender_name || msg.support_agent_name || msg.customer_name) || 'Tin nhắn mới';
    var body = msg && (msg.content || msg.message || msg.text || msg.body) || '';
    notify({
      title: senderName,
      body: body,
      icon: msg && msg.avatar_url || _defaults.icon || '/favicon.ico',
      tag: 'chat-' + (msg && (msg.session_code || msg.session_id) || 'default'),
      url: opts && opts.url || window.location.href,
      soundType: 'chat'
    });
  };

  /**
   * Set global defaults applied to every notify() call.
   * Per-call options always take precedence.
   * Usage: window.notifyNewMessage.setDefaults({ icon: '/logo.png', url: '/' });
   */
  window.notifyNewMessage.setDefaults = function (opts) {
    if (opts && _typeof(opts) === 'object') {
      for (var k in opts) {
        if (Object.prototype.hasOwnProperty.call(opts, k)) _defaults[k] = opts[k];
      }
    }
  };

  /**
   * Push subscription management for user-facing controls
   * (e.g. a "Enable push notifications" toggle in user settings).
   */
  window.pushNotification = {
    /** Request permission + subscribe. Returns a Promise<{success, reason?}> */
    subscribe: function subscribe() {
      return requestPermission().then(function (perm) {
        if (perm !== 'granted') {
          return {
            success: false,
            reason: 'permission_' + perm
          };
        }
        var p = state.vapidPublicKey ? Promise.resolve(state.vapidPublicKey) : loadVapidKey();
        return p.then(function () {
          var regP = state.swRegistration ? Promise.resolve(state.swRegistration) : registerServiceWorker();
          return regP.then(function () {
            return subscribeToPush().then(function (sub) {
              return {
                success: !!sub,
                subscription: sub || undefined
              };
            });
          });
        });
      });
    },
    /** Unsubscribe from push. Returns a Promise<{success}> */
    unsubscribe: function unsubscribe() {
      return unsubscribeFromPush().then(function () {
        return {
          success: true
        };
      });
    },
    requestPermission: requestPermission,
    /** Current status snapshot */
    getStatus: function getStatus() {
      return {
        env: {
          isWebView: env.isWebView,
          isPWA: env.isPWA,
          hasServiceWorker: env.hasServiceWorker,
          hasNotification: env.hasNotification,
          hasPushManager: env.hasPushManager
        },
        permission: getCurrentPermission(),
        swRegistered: !!state.swRegistration,
        pushSubscribed: !!state.pushSubscription,
        unreadCount: state.unreadCount
      };
    }
  };

  /** Internal API for debugging / integration */
  window.notificationSystem = {
    _initialized: true,
    notify: notify,
    resetBadge: onFocus,
    getStatus: window.pushNotification.getStatus,
    env: env
  };

  // ─── Boot ────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);