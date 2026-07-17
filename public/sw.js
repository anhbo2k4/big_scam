/**
 * sw.js — Service Worker for Push Notifications
 *
 * Served at /sw.js (scope: /).
 * Handles:
 *   • push events — show native notification
 *   • notificationclick — open / focus app window
 *   • message — client-triggered actions (SKIP_WAITING)
 *
 * Written with Promise chains only (compatible with Chrome 45+,
 * which is the minimum that supports Service Workers).
 */

'use strict';

var CACHE_VERSION = 'sw-v1';

// ─── Lifecycle ───────────────────────────────────────────────────────────────

self.addEventListener('install', function (event) {
  // Skip waiting so updates activate immediately without user reopening the tab
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  // Claim all open clients immediately so push works right away
  event.waitUntil(
    self.clients.claim().then(function () {
      // Clean up old caches from previous SW versions
      return caches.keys().then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) { return k !== CACHE_VERSION; })
            .map(function (k) { return caches.delete(k); })
        );
      });
    })
  );
});

// ─── Push event ──────────────────────────────────────────────────────────────

self.addEventListener('push', function (event) {
  var payload = {};

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (_) {
      payload = {
        title: 'Thông báo mới',
        body: event.data.text() || 'Bạn có thông báo mới',
      };
    }
  }

  var title = payload.title || 'Thông báo mới';

  var options = {
    body: payload.body || 'Bạn có thông báo mới',
    icon: payload.icon || '/favicon.ico',
    badge: payload.badge || '/favicon.ico',
    // Group notifications by tag to collapse repeats
    tag: payload.tag || 'giftbox-notification',
    // Reuse existing notification with same tag (avoid spam)
    renotify: !!payload.renotify,
    requireInteraction: payload.requireInteraction || false,
    silent: payload.silent || false,
    // Store url & extra data for notificationclick
    data: {
      url: payload.url || '/',
      notifId: payload.notifId || null,
      extra: payload.extra || null,
    },
  };

  if (payload.image) options.image = payload.image;
  if (payload.vibrate) options.vibrate = payload.vibrate;
  if (payload.actions) options.actions = payload.actions;

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ─── Notification click ──────────────────────────────────────────────────────

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  var targetUrl = '/';
  try {
    targetUrl = (event.notification.data && event.notification.data.url) || '/';
  } catch (_) {}

  // Handle action button clicks (if defined in options.actions)
  if (event.action && event.action !== '') {
    targetUrl = '/?action=' + encodeURIComponent(event.action);
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clients) {
        // Focus an already-open window on the same origin
        for (var i = 0; i < clients.length; i++) {
          var client = clients[i];
          var isSameOrigin = (client.url.indexOf(self.location.origin) === 0);
          if (isSameOrigin && 'focus' in client) {
            client.focus();
            if (targetUrl && targetUrl !== '/') {
              try { client.navigate(targetUrl); } catch (_) {}
            }
            return;
          }
        }
        // No existing window — open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
      .catch(function () {})
  );
});

// ─── Notification close (analytics hook, optional) ───────────────────────────

self.addEventListener('notificationclose', function (event) {
  // Could send analytics here — left as no-op for now
  void event;
});

// ─── Message from client ──────────────────────────────────────────────────────

self.addEventListener('message', function (event) {
  if (!event.data) return;

  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'PING':
      // Health check — respond to client
      if (event.source && event.source.postMessage) {
        event.source.postMessage({ type: 'PONG', version: CACHE_VERSION });
      }
      break;

    default:
      break;
  }
});
