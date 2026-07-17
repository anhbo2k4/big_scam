/**
 * chat-transport-devtools.js
 * ──────────────────────────
 * Paste the ENTIRE contents of this file into Chrome/Edge DevTools Console
 * while the chat page is open.  
 * No framework needed — runs in the page's own JS context.
 *
 * Run:  ChatQA.runAll()          — all tests sequentially
 *       ChatQA.test1()           — Layer1→2 fallback only
 *       ChatQA.test2()           — Layer2→3 fallback only
 *       ChatQA.test3()           — send-button lock test
 *       ChatQA.test4()           — memory/cleanup test
 *       ChatQA.testSlowNetwork() — slow-network simulation
 */
(function () {

  /* ── Utilities ────────────────────────────────────────── */

  function log(tag, msg, color) {
    color = color || '#6366f1';
    console.log(
      '%c[ChatQA:' + tag + ']%c ' + msg,
      'background:' + color + ';color:#fff;border-radius:3px;padding:1px 5px',
      'color:inherit'
    );
  }
  function pass(tag, msg) { log(tag, '✅ PASS — ' + msg, '#16a34a'); }
  function fail(tag, msg) { log(tag, '❌ FAIL — ' + msg, '#dc2626'); }
  function info(tag, msg) { log(tag, 'ℹ ' + msg, '#0284c7'); }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function getTransport() { return window._chatTransport || null; }

  function getLayer() {
    var t = getTransport();
    return t ? t._layer : 0;
  }

  function getBadgeText() {
    var el = document.getElementById('chatConnectionText');
    return el ? el.textContent.trim() : '(no badge)';
  }

  function isSendBtnDisabled() {
    var btn = document.getElementById('sendButton');
    return btn ? btn.disabled : undefined;
  }

  /* ── Ensure chat is open ──────────────────────────────── */
  function ensureChatOpen() {
    var box = document.getElementById('chatBox');
    if (!box) { info('SETUP', 'No #chatBox found — make sure chat partial is on this page'); return false; }
    if (!box.classList.contains('active')) {
      var icon = document.getElementById('chatFloatIcon');
      if (icon) icon.click();
    }
    return true;
  }

  /* ─────────────────────────────────────────────────────────
   * TEST 1 — Layer 1→2 fallback
   * Monkey-patch global fetch to fail SSE ReadableStream
   * so Layer 1 probe times out and Layer 2 (SSE) starts.
   * ───────────────────────────────────────────────────── */
  async function test1() {
    info('T1', 'Simulating Fetch+Stream fail → expect downgrade to Layer 2 (SSE)');
    if (!ensureChatOpen()) return;

    // Stop existing transport first
    if (window._chatTransport) { window._chatTransport.stop(); window._chatTransport = null; }

    var originalFetch = window.fetch;
    var patchActive = true;

    window.fetch = function (url, opts) {
      if (patchActive && typeof url === 'string' && url.includes('/api/chat/events')) {
        info('T1', 'Intercepted SSE fetch → returning broken response (no body)');
        return Promise.resolve({ ok: false, status: 503, body: null });
      }
      return originalFetch.apply(this, arguments);
    };

    // Restart transport
    if (typeof connectChatSSE === 'function') connectChatSSE();

    var t1 = Date.now();
    // Wait up to 8s for layer to change
    for (var i = 0; i < 16; i++) {
      await wait(500);
      var layer = getLayer();
      if (layer >= 2) {
        pass('T1', 'Fell to Layer ' + layer + ' (' + (Date.now() - t1) + 'ms) — Badge: "' + getBadgeText() + '"');
        break;
      }
    }
    if (getLayer() < 2) fail('T1', 'Still on Layer ' + getLayer() + ' after 8s — fallback did not happen');

    // Restore
    patchActive = false;
    window.fetch = originalFetch;
    info('T1', 'fetch restored. Reconnecting properly...');
    if (window._chatTransport) { window._chatTransport.stop(); window._chatTransport = null; }
    await wait(500);
    if (typeof connectChatSSE === 'function') connectChatSSE();
  }

  /* ─────────────────────────────────────────────────────────
   * TEST 2 — Layer 2→3 fallback
   * Force SSE EventSource to error immediately, no fetch patch.
   * ───────────────────────────────────────────────────── */
  async function test2() {
    info('T2', 'Simulating SSE onerror → expect downgrade to Layer 3 (Polling)');
    if (!ensureChatOpen()) return;

    var originalFetch = window.fetch;
    var OrigES = window.EventSource;

    // Kill fetch-stream so Layer 1 fails instantly
    window.fetch = function (url, opts) {
      if (typeof url === 'string' && url.includes('/api/chat/events')) {
        return Promise.resolve({ ok: false, status: 503, body: null });
      }
      return originalFetch.apply(this, arguments);
    };

    // Kill EventSource so Layer 2 also fails immediately
    window.EventSource = function (url) {
      var fakeES = {
        url: url,
        readyState: 2, // CLOSED
        close: function () {},
        addEventListener: function () {},
        onopen: null,
        onerror: null
      };
      // Fire onerror asynchronously
      setTimeout(function () {
        if (typeof fakeES.onerror === 'function') fakeES.onerror(new Event('error'));
      }, 50);
      return fakeES;
    };

    if (window._chatTransport) { window._chatTransport.stop(); window._chatTransport = null; }
    if (typeof connectChatSSE === 'function') connectChatSSE();

    var t1 = Date.now();
    for (var i = 0; i < 20; i++) {
      await wait(500);
      if (getLayer() === 3) {
        pass('T2', 'Reached Layer 3 Polling in ' + (Date.now() - t1) + 'ms — Badge: "' + getBadgeText() + '"');
        break;
      }
    }
    if (getLayer() !== 3) fail('T2', 'Did not reach Layer 3 — stuck at Layer ' + getLayer());

    // Restore and reconnect cleanly
    window.fetch = originalFetch;
    window.EventSource = OrigES;
    if (window._chatTransport) { window._chatTransport.stop(); window._chatTransport = null; }
    await wait(500);
    if (typeof connectChatSSE === 'function') connectChatSSE();
    info('T2', 'Restored EventSource + fetch. Layer now: ' + getLayer());
  }

  /* ─────────────────────────────────────────────────────────
   * TEST 3 — Send button never stays disabled
   * ───────────────────────────────────────────────────── */
  async function test3() {
    info('T3', 'Testing send-button lock/unlock...');
    if (!ensureChatOpen()) return;

    var input = document.getElementById('chatInput');
    var btn   = document.getElementById('sendButton');
    if (!input || !btn) { fail('T3', '#chatInput or #sendButton not found'); return; }

    // Snapshot disabled state before
    if (btn.disabled) {
      fail('T3', 'Button is already disabled before test — previous test left it locked');
      // Force unlock for remaining tests
      if (typeof setSending === 'function') setSending(false);
    }

    input.value = '__QA_TEST_MSG__';

    var t0 = Date.now();
    if (typeof sendMessage === 'function') sendMessage();

    // Check at 100ms — should be disabled during send
    await wait(100);
    var disabledDuringSend = btn.disabled;

    // Check at 5000ms — must be unlocked
    await wait(4900);
    var disabledAfter5s = btn.disabled;

    if (disabledAfter5s) {
      fail('T3', 'Button STILL disabled after 5s — setSending(false) not called in finally');
    } else {
      pass('T3', 'Button unlocked within 5s (was locked=' + disabledDuringSend + ' during send)');
    }

    // Extra: simulate network failure during send
    info('T3', 'Testing unlock after network failure...');
    var originalFetch = window.fetch;
    window.fetch = function (url, opts) {
      if (typeof url === 'string' && url.includes('/api/chat/message')) {
        return Promise.reject(new Error('QA simulated network fail'));
      }
      return originalFetch.apply(this, arguments);
    };

    input.value = '__QA_NET_FAIL__';
    if (typeof sendMessage === 'function') sendMessage();

    await wait(3000);
    window.fetch = originalFetch;

    if (btn.disabled) {
      fail('T3', 'Button stuck disabled after network error — finally block not executing');
    } else {
      pass('T3', 'Button correctly unlocked after network error (finally block works)');
    }
  }

  /* ─────────────────────────────────────────────────────────
   * TEST 4 — Memory / cleanup: open+close 10 times
   * ───────────────────────────────────────────────────── */
  async function test4() {
    info('T4', 'Memory leak test: connect/disconnect 10 times...');

    var beforeTimers = window._QA_timerCount || 0; // not measurable directly
    var counts = [];

    for (var round = 0; round < 10; round++) {
      // Connect
      if (typeof connectChatSSE === 'function') connectChatSSE();
      await wait(600);

      var during = {
        transportLayer: getLayer(),
        hasPollTimer: !!(window._chatTransport && window._chatTransport._pollTimer),
        hasSseSource: !!(window._chatTransport && window._chatTransport._sseSource),
        hasFetchAbort: !!(window._chatTransport && window._chatTransport._fetchAbort)
      };

      // Disconnect
      if (typeof disconnectChatSSE === 'function') disconnectChatSSE();
      await wait(300);

      var after = {
        transportNull: window._chatTransport === null,
        noSseSource:   !window._sseSource,
        noPollTimer:   !(window._chatTransport && window._chatTransport._pollTimer)
      };

      counts.push({ round: round + 1, during: during, after: after });
    }

    var leaks = counts.filter(function (c) { return !c.after.transportNull; });
    if (leaks.length > 0) {
      fail('T4', leaks.length + ' rounds left _chatTransport non-null after disconnect');
    } else {
      pass('T4', '_chatTransport = null after all 10 disconnect cycles');
    }

    // Check EventSource references
    var orphanES = counts.some(function (c) { return c.after.hasSseSource; });
    if (orphanES) {
      fail('T4', 'Orphaned EventSource found after disconnect (memory leak)');
    } else {
      pass('T4', 'No orphaned EventSource instances');
    }

    console.table(counts.map(function (c) {
      return { round: c.round, layer: c.during.transportLayer, cleanedUp: c.after.transportNull };
    }));
  }

  /* ─────────────────────────────────────────────────────────
   * TEST 5 — Slow network simulation
   * Patch fetch to add 2s artificial latency and check Layer 1
   * probe correctly falls through (not hangs indefinitely).
   * ───────────────────────────────────────────────────── */
  async function testSlowNetwork() {
    info('T5', 'Simulating slow 3G (2s latency on SSE connect)...');
    if (!ensureChatOpen()) return;

    var originalFetch = window.fetch;
    var patched = true;

    window.fetch = function (url, opts) {
      if (patched && typeof url === 'string' && url.includes('/api/chat/events')) {
        return new Promise(function (resolve) {
          // Delay 4s (beyond 3s probe) then return bad response
          setTimeout(function () { resolve({ ok: false, status: 503, body: null }); }, 4000);
        });
      }
      return originalFetch.apply(this, arguments);
    };

    if (window._chatTransport) { window._chatTransport.stop(); window._chatTransport = null; }
    if (typeof connectChatSSE === 'function') connectChatSSE();

    var t0 = Date.now();
    for (var i = 0; i < 20; i++) {
      await wait(500);
      if (getLayer() >= 2) break;
    }
    var elapsed = Date.now() - t0;

    if (getLayer() >= 2 && elapsed < 7000) {
      pass('T5', 'Fell through to Layer ' + getLayer() + ' in ' + elapsed + 'ms (probe correctly expired)');
    } else if (getLayer() === 1) {
      fail('T5', 'Still on Layer 1 after ' + elapsed + 'ms — probe timer NOT working');
    } else {
      fail('T5', 'Took too long (' + elapsed + 'ms) to detect slow connection');
    }

    patched = false;
    window.fetch = originalFetch;
    if (window._chatTransport) { window._chatTransport.stop(); window._chatTransport = null; }
    await wait(300);
    if (typeof connectChatSSE === 'function') connectChatSSE();
  }

  /* ── Runner ───────────────────────────────────────────── */
  async function runAll() {
    console.group('%c🧪 ChatQA Full Suite', 'font-size:14px;font-weight:bold;color:#6366f1');
    await test1();
    await wait(1000);
    await test2();
    await wait(1000);
    await test3();
    await wait(1000);
    await test4();
    await wait(1000);
    await testSlowNetwork();
    console.groupEnd();
    info('DONE', 'All tests completed. Review PASS/FAIL above.');
  }

  window.ChatQA = { runAll: runAll, test1: test1, test2: test2, test3: test3, test4: test4, testSlowNetwork: testSlowNetwork };
  info('LOADED', 'ChatQA ready. Run ChatQA.runAll() or individual tests like ChatQA.test1()');

}());
