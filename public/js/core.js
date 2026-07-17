/**
 * core.js — ES5-compatible module loader. Dependencies are loaded via
 * <script> tags before this file. Reads from window globals:
 *   window.EventQueueModule, window.SchedulerModule, window.SSEClientModule,
 *   window.StateManagerModule, window.ChatModule, window.NotificationSoundModule
 */
var CORE_CONFIG = {
  idlePreloadTimeoutMs: 1800,
  cleanupIntervalMs: 20000
};

var CORE_STATE = {
  runtime: null,
  cleanupTimer: 0,
  started: false
};

function getModuleExport(globalName) {
  return window[globalName] || null;
}

function onIdle(fn, timeout) {
  if (timeout === undefined) timeout = CORE_CONFIG.idlePreloadTimeoutMs;
  if (typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(fn, { timeout: timeout });
  }
  return window.setTimeout(fn, Math.min(1000, timeout));
}

function resolveSseUrl() {
  var body = document.body;
  var bodyAttr = String((body && body.dataset && body.dataset.sseUrl) || '').trim();
  if (bodyAttr) return bodyAttr;

  var meta = document.querySelector('meta[name="lmb-sse-url"]');
  var metaUrl = String((meta && meta.getAttribute('content')) || '').trim();
  if (metaUrl) return metaUrl;

  var runtime = window.__lmbPerfRuntime;
  var bootstrap = window.LMB_BOOTSTRAP;
  var fromGlobal = String(
    (runtime && runtime.sseUrl)
    || (bootstrap && bootstrap.sseUrl)
    || ''
  ).trim();
  if (fromGlobal) return fromGlobal;

  return '';
}

function resolveStateSyncUrl() {
  var body = document.body;
  var bodyAttr = String((body && body.dataset && body.dataset.stateSyncUrl) || '').trim();
  if (bodyAttr) return bodyAttr;

  var meta = document.querySelector('meta[name="lmb-state-sync-url"]');
  var metaUrl = String((meta && meta.getAttribute('content')) || '').trim();
  if (metaUrl) return metaUrl;

  var runtime = window.__lmbPerfRuntime;
  var fromGlobal = String((runtime && runtime.stateSyncUrl) || '').trim();
  return fromGlobal;
}

function createStateSnapshotFetcher() {
  var url = resolveStateSyncUrl();
  if (!url) return null;
  return function getStateSnapshot() {
    return fetch(url, { credentials: 'same-origin', cache: 'no-store' })
      .then(function(res) {
        if (!res.ok) return null;
        return res.json().catch(function() { return null; });
      })
      .then(function(data) {
        if (!data) return null;
        return data.data || data;
      });
  };
}

function installAudioLazyBootstrap() {
  var loaded = false;

  var bootAudio = function() {
    if (loaded) return;
    loaded = true;

    var soundMod = getModuleExport('NotificationSoundModule');
    var getter = (soundMod && soundMod.getNotificationSound) || null;
    if (typeof getter !== 'function') return;
    var manager = getter();
    if (manager && typeof manager.bindGestureUnlock === 'function') {
      manager.bindGestureUnlock();
    }
  };

  var onFirstGesture = function() {
    try { bootAudio(); } catch(e) {}
    var events = ['pointerdown', 'touchstart', 'keydown', 'click'];
    for (var i = 0; i < events.length; i++) {
      document.removeEventListener(events[i], onFirstGesture, true);
    }
  };

  var events = ['pointerdown', 'touchstart', 'keydown', 'click'];
  for (var i = 0; i < events.length; i++) {
    document.addEventListener(events[i], onFirstGesture, true);
  }
}

function startRealtimeRuntime() {
  if (CORE_STATE.runtime) return Promise.resolve(CORE_STATE.runtime);

  var queueMod = getModuleExport('EventQueueModule');
  var schedulerMod = getModuleExport('SchedulerModule');
  var sseMod = getModuleExport('SSEClientModule');
  var stateMod = getModuleExport('StateManagerModule');
  var chatMod = getModuleExport('ChatModule');
  var soundMod = getModuleExport('NotificationSoundModule');

  if (!queueMod || !schedulerMod || !sseMod || !stateMod || !chatMod) {
    return Promise.resolve(null);
  }

  var chatContainer = document.getElementById('chatMessages');
  if (!chatContainer) return Promise.resolve(null);

  var typingEl = document.getElementById('chatTyping');
  var presenceEl = document.getElementById('onlineStatus');

  var queue = queueMod.createEventQueue({
    hardCap: 1200,
    hiddenCap: 120,
    recentIdCap: 2000
  });

  var getSound = (soundMod && soundMod.getNotificationSound) || null;
  if (typeof getSound !== 'function') return Promise.resolve(null);
  var sound = getSound();
  var renderer = chatMod.createChatRenderer({
    container: chatContainer,
    typingEl: typingEl,
    presenceEl: presenceEl,
    maxDomNodes: 50,
    sound: sound
  });

  var scheduler = schedulerMod.createAdaptiveScheduler(queue, function(evt) {
    renderer.handleEvent(evt);
  }, {
    frameBudgetMs: 7,
    maxEventsPerFrame: 50,
    minEventsPerFrame: 10,
    hiddenQueueCap: 120
  });

  var getStateSnapshot = createStateSnapshotFetcher();
  var stateManager = stateMod.createStateManager({
    syncIntervalMs: 4000,
    getSnapshot: getStateSnapshot,
    onStateChange: function(next, prev, context, meta) {
      var rt = window.__lmbPerfRuntime;
      if (rt && typeof rt.onStateChange === 'function') {
        rt.onStateChange(next, prev, context, meta);
      }
    },
    renderers: {
      WAITING_APPROVAL: function(context) {
        var rt = window.__lmbPerfRuntime;
        if (rt && typeof rt.showWaitingApproval === 'function') {
          rt.showWaitingApproval(context);
        }
      },
      APPROVED: function(context) {
        var rt = window.__lmbPerfRuntime;
        if (rt && typeof rt.hideWaitingApproval === 'function') {
          rt.hideWaitingApproval(context);
        }
      },
      SHOW_RESULT: function(context) {
        var rt = window.__lmbPerfRuntime;
        if (rt && typeof rt.showResult === 'function') {
          rt.showResult(context);
        }
      },
      IDLE: function(context) {
        var rt = window.__lmbPerfRuntime;
        if (rt && typeof rt.resetResultUi === 'function') {
          rt.resetResultUi(context);
        }
      }
    }
  });

  stateManager.startSync();

  var client = new sseMod.SSEClient({
    onEvent: function(evt) {
      if (queue.enqueue(evt)) scheduler.schedule();
    },
    onCriticalEvent: function(evt) {
      stateManager.handleCriticalEvent(evt.type, evt.payload || {}, evt);
      var rt = window.__lmbPerfRuntime;
      if (rt && typeof rt.onCriticalEvent === 'function') {
        rt.onCriticalEvent(evt);
      }
    },
    onReconnect: function() {
      stateManager.syncNow().catch(function() {});
    },
    onError: function() {
      // Let EventSource handle reconnection internally.
    }
  });

  var sseUrl = resolveSseUrl();
  if (sseUrl) client.connect(sseUrl);

  scheduler.start();

  CORE_STATE.runtime = {
    queue: queue,
    scheduler: scheduler,
    client: client,
    stateManager: stateManager,
    renderer: renderer,
    sound: sound,
    lockAction: function(key, ttlMs) { return stateManager.acquireActionLock(key, ttlMs); },
    unlockAction: function(key) { return stateManager.releaseActionLock(key); },
    isActionLocked: function(key) { return stateManager.isActionLocked(key); },
    getDebugInfo: function() {
      return {
        state: stateManager.getDebugInfo(),
        queue: typeof queue.stats === 'function' ? queue.stats() : { total: queue.size() },
        scheduler: typeof scheduler.stats === 'function' ? scheduler.stats() : {},
        sseUrl: sseUrl,
        connected: !!client.source
      };
    },
    stop: function() {
      client.disconnect();
      scheduler.stop();
      stateManager.stopSync();
      if (renderer && typeof renderer.dispose === 'function') renderer.dispose();
      queue.clear();
    },
    dispose: function() {
      this.stop();
      scheduler.dispose();
      stateManager.dispose();
      CORE_STATE.runtime = null;
    }
  };

  window.__lmbPerfDebug = window.__lmbPerfDebug || {};
  window.__lmbPerfDebug.getInfo = function() {
    return CORE_STATE.runtime && typeof CORE_STATE.runtime.getDebugInfo === 'function'
      ? CORE_STATE.runtime.getDebugInfo() : null;
  };
  window.__lmbPerfDebug.lockAction = function(key, ttlMs) {
    return CORE_STATE.runtime && typeof CORE_STATE.runtime.lockAction === 'function'
      ? CORE_STATE.runtime.lockAction(key, ttlMs) : false;
  };
  window.__lmbPerfDebug.unlockAction = function(key) {
    if (CORE_STATE.runtime && typeof CORE_STATE.runtime.unlockAction === 'function') {
      CORE_STATE.runtime.unlockAction(key);
    }
  };
  window.__lmbPerfDebug.isActionLocked = function(key) {
    return CORE_STATE.runtime && typeof CORE_STATE.runtime.isActionLocked === 'function'
      ? !!CORE_STATE.runtime.isActionLocked(key) : false;
  };

  return Promise.resolve(CORE_STATE.runtime);
}

function installIdleCleanup() {
  if (CORE_STATE.cleanupTimer) return;

  var tick = function() {
    if (CORE_STATE.runtime && CORE_STATE.runtime.queue) {
      CORE_STATE.runtime.queue.cleanup();
    }
    CORE_STATE.cleanupTimer = window.setTimeout(function() {
      onIdle(tick, 1200);
    }, CORE_CONFIG.cleanupIntervalMs);
  };

  onIdle(tick, 2000);
}

function initCore() {
  if (CORE_STATE.started) return;
  CORE_STATE.started = true;

  installAudioLazyBootstrap();
  installIdleCleanup();

  // Opt-in runtime start to avoid double-SSE with legacy stacks.
  var body = document.body;
  var shouldStart = (body && body.dataset && body.dataset.modularRealtime === '1')
    || (window.__lmbPerfRuntime && window.__lmbPerfRuntime.enableModularRealtime === true);

  if (shouldStart) {
    startRealtimeRuntime();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCore);
} else {
  initCore();
}

window.LMBCoreLoader = {
  init: initCore,
  startRealtimeRuntime: startRealtimeRuntime
};
