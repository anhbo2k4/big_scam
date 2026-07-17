/**
 * tabNotification.js — Browser tab title counter + favicon badge.
 *
 * Shows unread count in tab title: "(3) Admin Dashboard"
 * Blinks title when startTabBlink() is called.
 * Auto-resets when the user focuses the tab.
 *
 * Exports (window.tabNotification):
 *   incrementBadge(label) — +1 unread, update title & favicon
 *   resetBadge()          — clear to 0, restore title & favicon
 *   getCount()            — current unread count
 *   startTabBlink(n,lbl)  — set count n and start title blinking
 *   stopTabBlink()        — stop blinking, reset everything
 */
(function () {
  'use strict';

  var _originalTitle = document.title || 'Page';
  var _originalFaviconHref = null;
  var _count = 0;
  var _blinkInterval = null;
  var _blinkState = false;
  var _badgeDataUrl = null;

  /* ── Favicon helpers ────────────────────────────────────────────── */

  function _getFaviconEl() {
    return document.querySelector('link[rel~="icon"]') ||
           document.querySelector('link[rel="shortcut icon"]');
  }

  function _setFavicon(href) {
    if (!href) return;
    var el = _getFaviconEl();
    if (!el) {
      el = document.createElement('link');
      el.rel = 'icon';
      document.head.appendChild(el);
    }
    el.href = href;
  }

  function _buildBadgeFavicon(src, count) {
    return new Promise(function (resolve) {
      var canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      var ctx2d = canvas.getContext('2d');
      if (!ctx2d) { resolve(null); return; }

      function drawBadge() {
        ctx2d.beginPath();
        ctx2d.arc(23, 9, 9, 0, Math.PI * 2);
        ctx2d.fillStyle = '#e4191c';
        ctx2d.fill();
        ctx2d.fillStyle = '#fff';
        ctx2d.font = 'bold 10px -apple-system,sans-serif';
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'middle';
        ctx2d.fillText(count > 9 ? '9+' : String(count), 23, 9);
        try { resolve(canvas.toDataURL('image/png')); }
        catch (e) { resolve(null); } // tainted canvas — skip favicon badge
      }

      if (src) {
        var img = new Image();
        // No crossOrigin — same-origin favicons work fine without it.
        // For cross-origin favicons, toDataURL() is caught above; original favicon is preserved.
        img.onload = function () {
          try { ctx2d.drawImage(img, 0, 0, 32, 32); drawBadge(); }
          catch (e) { resolve(null); }
        };
        img.onerror = function () { resolve(null); }; // can't load — keep original favicon unchanged
        img.src = src;
      } else {
        drawBadge();
      }
    });
  }

  function _captureOrigFavicon() {
    if (!_originalFaviconHref) {
      var el = _getFaviconEl();
      _originalFaviconHref = el ? el.href : '';
    }
  }

  /* ── Core logic ─────────────────────────────────────────────────── */

  function _stopBlink() {
    if (_blinkInterval) {
      clearInterval(_blinkInterval);
      _blinkInterval = null;
    }
    _blinkState = false;
  }

  function _updateTitle() {
    if (_count <= 0) {
      document.title = _originalTitle;
    } else {
      document.title = '(' + _count + ') ' + _originalTitle;
    }
  }

  /* ── Public API ─────────────────────────────────────────────────── */

  function incrementBadge(label) {
    _count++;
    _updateTitle();
    // Favicon is intentionally NOT modified — only the tab title shows the count
  }

  function resetBadge() {
    _count = 0;
    _stopBlink();
    document.title = _originalTitle;
    // No favicon to restore since we never modify it
  }

  function startTabBlink(count, label) {
    if (count !== undefined) _count = count;
    else if (_count < 1) _count = 1;
    _updateTitle();

    if (_blinkInterval) return; // already blinking

    var notifLabel = label || 'Có.. thông báo';
    _blinkInterval = setInterval(function () {
      _blinkState = !_blinkState;
      if (_blinkState) {
        document.title = String.fromCodePoint(0x1F514) + ' (' + _count + ') ' + notifLabel + ' | ' + _originalTitle;
      } else {
        document.title = '(' + _count + ') ' + _originalTitle;
      }
    }, 1000);
  }

  function stopTabBlink() {
    resetBadge();
  }

  // Auto-reset when user focuses the tab
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') resetBadge();
  });
  window.addEventListener('focus', function () { resetBadge(); });

  // Recapture original title after full load (title may change after JS runs)
  window.addEventListener('load', function () {
    if (!_count) _originalTitle = document.title || _originalTitle;
  });

  window.tabNotification = {
    incrementBadge: incrementBadge,
    resetBadge: resetBadge,
    getCount: function () { return _count; },
    startTabBlink: startTabBlink,
    stopTabBlink: stopTabBlink
  };
})();
