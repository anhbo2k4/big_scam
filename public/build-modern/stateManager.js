const STATES = Object.freeze({
  IDLE: 'IDLE',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  APPROVED: 'APPROVED',
  SHOW_RESULT: 'SHOW_RESULT'
});

const VALID_TRANSITIONS = Object.freeze({
  IDLE: new Set([STATES.WAITING_APPROVAL, STATES.SHOW_RESULT]),
  WAITING_APPROVAL: new Set([STATES.APPROVED, STATES.SHOW_RESULT, STATES.IDLE]),
  APPROVED: new Set([STATES.SHOW_RESULT, STATES.IDLE]),
  SHOW_RESULT: new Set([STATES.IDLE, STATES.WAITING_APPROVAL])
});

const DEFAULTS = {
  initialState: STATES.IDLE,
  syncIntervalMs: 4000,
  dedupeTtlMs: 10 * 60 * 1000,
  channelName: 'lmb-state-sync-v1',
  enableBroadcastSync: true,
  enableDebug: true,
  getSnapshot: null,
  onStateChange: null,
  renderers: {}
};

function getTabId() {
  return `tab-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

function normalizeState(state) {
  const next = String(state || '').trim().toUpperCase();
  if (Object.prototype.hasOwnProperty.call(STATES, next)) return STATES[next];
  if (Object.values(STATES).includes(next)) return next;
  return null;
}

function eventIdFrom(eventType, payload, eventMeta) {
  const direct = String(
    eventMeta?.id
    || payload?.eventId
    || payload?.id
    || payload?.messageId
    || payload?.resultId
    || ''
  ).trim();
  if (direct) return `${eventType}:${direct}`;

  const code = String(payload?.sessionCode || payload?.session_code || '').trim();
  const box = String(payload?.boxNumber || payload?.box_number || '').trim();
  const ts = String(payload?.ts || payload?.updatedAt || payload?.createdAt || '').trim();
  return `${eventType}:${code}:${box}:${ts}`;
}

function deriveStateFromSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return null;

  const explicit = normalizeState(snapshot.state || snapshot.currentState);
  if (explicit) return explicit;

  const status = String(snapshot.status || snapshot.approvalStatus || '').trim().toLowerCase();
  if (status === 'waiting' || status === 'pending' || status === 'pending_approval') {
    return STATES.WAITING_APPROVAL;
  }
  if (status === 'approved' || status === 'confirmed') return STATES.APPROVED;

  const hasResult = !!(snapshot.result || snapshot.reward || snapshot.prize || snapshot.sessionResult);
  if (hasResult) return STATES.SHOW_RESULT;
  return STATES.IDLE;
}

function extractVersion(payload, fallbackTs) {
  if (!payload || typeof payload !== 'object') return Number(fallbackTs || Date.now());
  const raw = payload.version
    ?? payload.stateVersion
    ?? payload.updatedAtMs
    ?? payload.updatedAt
    ?? payload.ts
    ?? payload.timestamp
    ?? fallbackTs
    ?? Date.now();

  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const asNum = Number(raw);
    if (Number.isFinite(asNum) && asNum > 0) return asNum;
    const asDate = Date.parse(raw);
    if (Number.isFinite(asDate) && asDate > 0) return asDate;
  }
  return Number(fallbackTs || Date.now());
}

function canTransition(fromState, toState) {
  if (fromState === toState) return true;
  const allowed = VALID_TRANSITIONS[fromState];
  return !!(allowed && allowed.has(toState));
}

function callRenderer(renderers, state, context, meta) {
  const fn = renderers[state];
  if (typeof fn === 'function') fn(context, meta);
  if (typeof renderers.onAny === 'function') renderers.onAny(state, context, meta);
}

/* exported via window.StateManagerModule */

function createStateManager(options) {
  options = options || {};
  const cfg = { ...DEFAULTS, ...(options || {}) };
  const renderers = cfg.renderers || {};

  let currentState = normalizeState(cfg.initialState) || STATES.IDLE;
  let lastContext = null;
  let currentVersion = 0;
  let syncTimer = 0;
  let bc = null;
  const tabId = getTabId();
  const processedIds = new Map();
  const actionLocks = new Map();

  function transitionTo(nextState, context = {}, meta = {}) {
    const next = normalizeState(nextState);
    if (!next) return false;

    const incomingVersion = Number(meta.version ?? extractVersion(context, meta.ts || Date.now()));
    if (!meta.force && Number.isFinite(incomingVersion) && incomingVersion > 0 && incomingVersion < currentVersion) {
      // Ignore stale out-of-order transition to preserve monotonic state progression.
      return false;
    }

    const eventId = String(meta.eventId || '').trim();
    if (eventId) {
      if (processedIds.has(eventId)) return false;
      processedIds.set(eventId, Date.now());
      trimProcessedIds();
    }

    if (!meta.force && !canTransition(currentState, next)) {
      return false;
    }

    if (currentState === next) {
      // Idempotent: duplicate transition should not re-render heavy UI.
      return false;
    }

    const prev = currentState;
    currentState = next;
    lastContext = context;
    if (Number.isFinite(incomingVersion) && incomingVersion > 0) {
      currentVersion = Math.max(currentVersion, incomingVersion);
    } else {
      currentVersion = Math.max(currentVersion, Date.now());
    }

    callRenderer(renderers, currentState, context, meta);
    if (typeof cfg.onStateChange === 'function') {
      cfg.onStateChange(currentState, prev, context, meta);
    }

    if (!meta.silentBroadcast) {
      broadcastState({
        state: currentState,
        context,
        version: currentVersion,
        eventId,
        source: meta.source || 'local'
      });
    }
    return true;
  }

  function handleCriticalEvent(eventType, payload = {}, eventMeta = {}) {
    const type = String(eventType || '').trim().toLowerCase();
    const eventId = eventIdFrom(type, payload, eventMeta);

    // Opening box starts a state transition to waiting approval.
    if (type === 'approval') {
      const status = String(payload?.status || payload?.approvalStatus || '').trim().toLowerCase();
      if (status === 'pending' || status === 'waiting' || status === 'pending_approval') {
        return transitionTo(STATES.WAITING_APPROVAL, payload, {
          source: 'sse-critical',
          eventType: type,
          eventId,
          version: extractVersion(payload, eventMeta?.ts)
        });
      }

      // Approval result must remove waiting state immediately.
      if (status === 'approved' || payload?.approved === true || payload?.isApproved === true) {
        const hasResult = !!(payload.result || payload.reward || payload.prize);
        if (hasResult) {
          return transitionTo(STATES.SHOW_RESULT, payload, {
            source: 'sse-critical',
            eventType: type,
            eventId: `${eventId}:result-fast`,
            version: extractVersion(payload, eventMeta?.ts),
            force: true
          });
        }

        const changed = transitionTo(STATES.APPROVED, payload, {
          source: 'sse-critical',
          eventType: type,
          eventId: `${eventId}:approved`,
          version: extractVersion(payload, eventMeta?.ts)
        });
        return changed;
      }

      if (status === 'rejected' || status === 'declined') {
        return transitionTo(STATES.IDLE, payload, {
          source: 'sse-critical',
          eventType: type,
          eventId,
          version: extractVersion(payload, eventMeta?.ts)
        });
      }

      return false;
    }

    if (type === 'box_result' || type === 'session_result') {
      // Critical result display should never be delayed.
      return transitionTo(STATES.SHOW_RESULT, payload, {
        source: 'sse-critical',
        eventType: type,
        eventId: `${eventId}:show-direct`,
        version: extractVersion(payload, eventMeta?.ts),
        force: true
      });
    }

    return false;
  }

  function syncNow() {
    if (typeof cfg.getSnapshot !== 'function') return Promise.resolve(false);

    return Promise.resolve()
      .then(() => cfg.getSnapshot())
      .then((snapshot) => {
        const target = deriveStateFromSnapshot(snapshot);
        if (!target) return false;
        return transitionTo(target, snapshot, {
          source: 'poll-sync',
          force: true,
          eventId: `sync:${target}:${String(snapshot?.updatedAt || '')}`,
          version: extractVersion(snapshot, Date.now())
        });
      })
      .catch(() => false);
  }

  function startBroadcastSync() {
    if (!cfg.enableBroadcastSync) return;
    if (typeof BroadcastChannel === 'undefined') return;
    if (bc) return;

    bc = new BroadcastChannel(cfg.channelName);
    bc.onmessage = (event) => {
      const data = event && event.data ? event.data : null;
      if (!data || data.kind !== 'state-transition') return;
      if (String(data.tabId || '') === tabId) return;

      const nextState = normalizeState(data.state);
      if (!nextState) return;
      transitionTo(nextState, data.context || {}, {
        source: 'broadcast',
        eventId: String(data.eventId || `bc:${data.version || ''}`),
        version: Number(data.version || 0),
        force: true,
        silentBroadcast: true
      });
    };
  }

  function stopBroadcastSync() {
    if (!bc) return;
    bc.close();
    bc = null;
  }

  function broadcastState(message) {
    if (!bc) return;
    try {
      bc.postMessage({
        kind: 'state-transition',
        tabId,
        state: message.state,
        context: message.context || null,
        version: Number(message.version || currentVersion || Date.now()),
        eventId: String(message.eventId || ''),
        source: String(message.source || 'state-manager')
      });
    } catch (_) {}
  }

  function startSync() {
    stopSync();
    const interval = Math.max(3000, Math.min(5000, Number(cfg.syncIntervalMs) || 4000));
    syncTimer = setInterval(() => {
      syncNow().catch(() => {});
      trimProcessedIds();
    }, interval);
  }

  function stopSync() {
    if (!syncTimer) return;
    clearInterval(syncTimer);
    syncTimer = 0;
  }

  function trimProcessedIds(now = Date.now()) {
    const ttl = Math.max(30000, Number(cfg.dedupeTtlMs) || DEFAULTS.dedupeTtlMs);
    const threshold = now - ttl;
    for (const [id, ts] of processedIds.entries()) {
      if (ts < threshold) processedIds.delete(id);
    }

    if (processedIds.size > 3000) {
      const overflow = processedIds.size - 3000;
      let removed = 0;
      for (const key of processedIds.keys()) {
        processedIds.delete(key);
        removed += 1;
        if (removed >= overflow) break;
      }
    }

    for (const [key, lock] of actionLocks.entries()) {
      if (!lock || Number(lock.expiresAt || 0) <= now) {
        actionLocks.delete(key);
      }
    }
  }

  function getState() {
    return currentState;
  }

  function getContext() {
    return lastContext;
  }

  function reset(context = null) {
    currentState = STATES.IDLE;
    lastContext = context;
    currentVersion = Math.max(currentVersion, Date.now());
    callRenderer(renderers, currentState, context, { source: 'reset', force: true });
  }

  function acquireActionLock(actionKey, ttlMs = 3500) {
    const key = String(actionKey || '').trim();
    if (!key) return true;
    const now = Date.now();
    trimProcessedIds(now);

    const existing = actionLocks.get(key);
    if (existing && Number(existing.expiresAt || 0) > now) {
      return false;
    }

    actionLocks.set(key, {
      acquiredAt: now,
      expiresAt: now + Math.max(200, Number(ttlMs) || 3500)
    });
    return true;
  }

  function releaseActionLock(actionKey) {
    const key = String(actionKey || '').trim();
    if (!key) return;
    actionLocks.delete(key);
  }

  function isActionLocked(actionKey) {
    const key = String(actionKey || '').trim();
    if (!key) return false;
    const now = Date.now();
    const lock = actionLocks.get(key);
    if (!lock) return false;
    if (Number(lock.expiresAt || 0) <= now) {
      actionLocks.delete(key);
      return false;
    }
    return true;
  }

  function getDebugInfo() {
    return {
      tabId,
      state: currentState,
      version: currentVersion,
      hasBroadcastChannel: !!bc,
      processedIds: processedIds.size,
      activeLocks: actionLocks.size,
      syncRunning: !!syncTimer,
      context: lastContext
    };
  }

  /* ── Visibility-based sync throttle ── */
  let _visibilityHandler = null;

  function bindVisibilityThrottle() {
    if (_visibilityHandler || typeof document === 'undefined') return;
    _visibilityHandler = () => {
      if (document.hidden) {
        stopSync();
      } else {
        startSync();
        syncNow().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', _visibilityHandler);
  }

  function unbindVisibilityThrottle() {
    if (!_visibilityHandler) return;
    document.removeEventListener('visibilitychange', _visibilityHandler);
    _visibilityHandler = null;
  }

  function dispose() {
    stopSync();
    stopBroadcastSync();
    unbindVisibilityThrottle();
    processedIds.clear();
    actionLocks.clear();
  }

  startBroadcastSync();
  bindVisibilityThrottle();
  if (cfg.enableDebug && typeof window !== 'undefined') {
    window.__lmbStateDebug = {
      getInfo: () => getDebugInfo(),
      getState: () => currentState,
      getVersion: () => currentVersion,
      forceTransition: (nextState, context = {}) => transitionTo(nextState, context, { force: true, source: 'debug', eventId: `debug:${Date.now()}` })
    };
  }

  return {
    STATES,
    getState,
    getDebugInfo,
    getContext,
    transitionTo,
    handleCriticalEvent,
    syncNow,
    startSync,
    stopSync,
    acquireActionLock,
    releaseActionLock,
    isActionLocked,
    reset,
    dispose
  };
}

window.StateManagerModule = { STATES: STATES, createStateManager: createStateManager };
