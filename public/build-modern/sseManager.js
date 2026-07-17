/**
 * sseManager.js — Resilient SSE connection manager.
 *
 * Usage:
 *   const mgr = new SSEManager('/api/chat/events/admin', {
 *     new_message:   (data) => { ... },
 *     admin_event:   (data) => { ... },
 *   });
 *   mgr.connect();
 *
 * Features:
 *  - Exponential backoff on error (1s → 2s → 4s → … → 30s max)
 *  - Last-Event-ID header forwarded on reconnect
 *  - Tab hidden > 5 min → disconnect to save resources
 *  - Tab visible again → reconnect if disconnected
 *
 * Exported as window.SSEManager (constructor).
 */
(function () {
  'use strict';

  class SSEManager {
    /**
     * @param {string} url       SSE endpoint URL
     * @param {object} handlers  { eventName: (data) => {} }
     * @param {object} [opts]
     * @param {boolean} [opts.withCredentials=true]
     * @param {number}  [opts.hiddenThreshold=300000]  ms tab must be hidden before auto-disconnect
     */
    constructor(url, handlers, opts) {
      this.url = url;
      this.handlers = handlers || {};
      this.opts = Object.assign({ withCredentials: true, hiddenThreshold: 300000 }, opts);

      this._es = null;
      this._attempt = 0;
      this._reconnectTimer = null;
      this._lastEventId = null;
      this._hiddenAt = null;
      this._hiddenTimer = null;
      this._destroyed = false;

      // Visibility / focus management
      this._onVisibility = this._onVisibility.bind(this);
      this._onFocus = this._onFocus.bind(this);
      document.addEventListener('visibilitychange', this._onVisibility);
      window.addEventListener('focus', this._onFocus);
    }

    // ─── Public API ──────────────────────────────────────────────────────────────

    connect() {
      if (this._destroyed || this._es) return;
      if (window.LMB_DISABLE_SSE) return;
      this._createSource();
    }

    disconnect() {
      this._clearTimers();
      if (this._es) {
        this._es.close();
        this._es = null;
      }
    }

    /** Permanently tear down — removes all global listeners */
    destroy() {
      this._destroyed = true;
      this.disconnect();
      document.removeEventListener('visibilitychange', this._onVisibility);
      window.removeEventListener('focus', this._onFocus);
    }

    get isConnected() {
      return !!(this._es && this._es.readyState === EventSource.OPEN);
    }

    // ─── Internal ────────────────────────────────────────────────────────────────

    _buildUrl() {
      const u = new URL(this.url, window.location.href);
      if (this._lastEventId) u.searchParams.set('lastEventId', this._lastEventId);
      return u.toString();
    }

    _createSource() {
      if (this._destroyed) return;

      try {
        const es = new EventSource(this._buildUrl(), {
          withCredentials: this.opts.withCredentials
        });
        this._es = es;

        es.addEventListener('open', () => {
          this._attempt = 0;
          if (typeof this.onOpen === 'function') this.onOpen();
        });

        es.onerror = () => {
          if (this._destroyed) return;
          // Let the browser close and reopen if it wants (readyState → CONNECTING)
          // but we schedule our own reconnect if it transitions to CLOSED
          setTimeout(() => {
            if (!this._destroyed && this._es && this._es.readyState === EventSource.CLOSED) {
              this._es = null;
              this._scheduleReconnect();
            }
          }, 200);
        };

        // Register all event handlers
        Object.entries(this.handlers).forEach(([event, fn]) => {
          es.addEventListener(event, (e) => {
            if (e.lastEventId) this._lastEventId = e.lastEventId;
            try { fn(JSON.parse(e.data), e); } catch (_) {}
          });
        });

        // Keep track of last event ID from any event
        es.addEventListener('message', (e) => {
          if (e.lastEventId) this._lastEventId = e.lastEventId;
        });

      } catch (err) {
        this._scheduleReconnect();
      }
    }

    _scheduleReconnect() {
      if (this._destroyed || this._reconnectTimer) return;
      // Exponential backoff: 1s, 2s, 4s, 8s … capped at 30s
      const delay = Math.min(1000 * Math.pow(2, this._attempt), 30000);
      this._attempt++;

      this._reconnectTimer = setTimeout(() => {
        this._reconnectTimer = null;
        if (!this._destroyed && !this._es) {
          this._createSource();
        }
      }, delay);
    }

    _clearTimers() {
      clearTimeout(this._reconnectTimer);
      clearTimeout(this._hiddenTimer);
      this._reconnectTimer = null;
      this._hiddenTimer = null;
    }

    // ─── Visibility management ────────────────────────────────────────────────────

    _onVisibility() {
      if (document.visibilityState === 'hidden') {
        this._hiddenAt = Date.now();
        // disconnect after threshold to save server resources
        this._hiddenTimer = setTimeout(() => {
          if (document.visibilityState === 'hidden') {
            this.disconnect();
          }
        }, this.opts.hiddenThreshold);
      } else {
        clearTimeout(this._hiddenTimer);
        this._hiddenTimer = null;
        this._hiddenAt = null;
        // Reconnect if we were disconnected while hidden
        if (!this._destroyed && !this._es) {
          this._attempt = 0; // reset backoff on intentional reconnect
          this._createSource();
        }
      }
    }

    _onFocus() {
      if (!this._destroyed && !this._es) {
        this._attempt = 0;
        this._createSource();
      }
    }
  }

  window.SSEManager = SSEManager;
})();
