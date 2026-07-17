const DEFAULTS = {
  hardCap: 1200,
  hiddenCap: 120,
  overloadCap: 900,
  recentIdCap: 2000,
  dedupeTtlMs: 10 * 60 * 1000
};

const COLLAPSIBLE_TYPES = new Set([
  'typing',
  'stop_typing',
  'online_status',
  'wallet_update',
  'system_notification'
]);

function normalizeEvent(input) {
  if (!input || typeof input !== 'object') return null;
  const type = String(input.type || '').trim();
  if (!type) return null;

  const payload = input.payload !== undefined ? input.payload : null;
  const ts = Number(input.ts || Date.now());
  const id = String(input.id || payload?.id || payload?.messageId || '').trim() || null;
  const priority = String(input.priority || '').toLowerCase() === 'high' ? 'high' : 'low';

  return {
    type,
    payload,
    ts,
    id,
    key: String(input.key || ''),
    priority
  };
}

function buildCollapseKey(evt) {
  if (!COLLAPSIBLE_TYPES.has(evt.type)) return '';
  const p = evt.payload || {};
  const session = String(p.sessionCode || p.session_code || p.session || '').trim();
  const user = String(p.userId || p.user_id || p.senderId || p.sender_id || '').trim();
  const scope = session || user || 'global';
  return `${evt.type}:${scope}`;
}

function createEventQueue(options) {
  options = options || {};
  const cfg = { ...DEFAULTS, ...(options || {}) };
  const highFifo = [];
  const lowFifo = [];
  const highCoalesced = new Map();
  const lowCoalesced = new Map();
  const highCoalescedOrder = [];
  const lowCoalescedOrder = [];
  const recentIds = new Map();
  let droppedHigh = 0;
  let droppedLow = 0;
  let coalescedCount = 0;

  const api = {
    enqueue(input) {
      const evt = normalizeEvent(input);
      if (!evt) return false;

      if (evt.id) {
        if (recentIds.has(evt.id)) return false;
        recentIds.set(evt.id, evt.ts);
        if (recentIds.size > cfg.recentIdCap) {
          const oldest = recentIds.keys().next().value;
          recentIds.delete(oldest);
        }
      }

      const collapseKey = evt.key || buildCollapseKey(evt);
      if (collapseKey) {
        const isHigh = evt.priority === 'high';
        const map = isHigh ? highCoalesced : lowCoalesced;
        const order = isHigh ? highCoalescedOrder : lowCoalescedOrder;
        const prev = map.get(collapseKey);
        if (prev) {
          map.set(collapseKey, mergeEvents(prev, evt));
          coalescedCount += 1;
        } else {
          map.set(collapseKey, evt);
          order.push(collapseKey);
        }
      } else {
        if (evt.priority === 'high') highFifo.push(evt);
        else lowFifo.push(evt);
      }

      trimToCap(cfg.hardCap);
      return true;
    },

    takeNext(opts = {}) {
      const preferLow = opts && opts.prefer === 'low';
      if (preferLow) {
        const lowEvt = takeLow();
        if (lowEvt) return lowEvt;
        return takeHigh();
      }
      const highEvt = takeHigh();
      if (highEvt) return highEvt;
      return takeLow();
    },

    size() {
      return highFifo.length + lowFifo.length + highCoalesced.size + lowCoalesced.size;
    },

    sizeHigh() {
      return highFifo.length + highCoalesced.size;
    },

    sizeLow() {
      return lowFifo.length + lowCoalesced.size;
    },

    trimForHidden(cap = cfg.hiddenCap) {
      trimLowFirstToCap(Math.max(0, Number(cap) || cfg.hiddenCap));
    },

    trimForOverload(targetCap = cfg.overloadCap) {
      trimLowFirstToCap(Math.max(0, Number(targetCap) || cfg.overloadCap));
    },

    cleanup(now = Date.now()) {
      const threshold = now - cfg.dedupeTtlMs;
      for (const [id, ts] of recentIds.entries()) {
        if (ts < threshold) recentIds.delete(id);
      }

      trimToCap(cfg.hardCap);
    },

    clear() {
      highFifo.length = 0;
      lowFifo.length = 0;
      highCoalesced.clear();
      lowCoalesced.clear();
      highCoalescedOrder.length = 0;
      lowCoalescedOrder.length = 0;
      recentIds.clear();
      droppedHigh = 0;
      droppedLow = 0;
      coalescedCount = 0;
    },

    stats() {
      return {
        total: api.size(),
        high: api.sizeHigh(),
        low: api.sizeLow(),
        droppedHigh,
        droppedLow,
        coalescedCount,
        recentIds: recentIds.size
      };
    }
  };

  function mergeEvents(prev, next) {
    let payload = next.payload;
    if (
      prev && prev.payload && typeof prev.payload === 'object' && !Array.isArray(prev.payload)
      && next && next.payload && typeof next.payload === 'object' && !Array.isArray(next.payload)
    ) {
      payload = { ...prev.payload, ...next.payload };
    }
    return {
      ...prev,
      ...next,
      payload,
      ts: Math.max(Number(prev?.ts || 0), Number(next?.ts || 0))
    };
  }

  function takeHigh() {
    if (highFifo.length) return highFifo.shift() || null;
    return shiftCoalesced(highCoalesced, highCoalescedOrder);
  }

  function takeLow() {
    if (lowFifo.length) return lowFifo.shift() || null;
    return shiftCoalesced(lowCoalesced, lowCoalescedOrder);
  }

  function shiftCoalesced(map, order) {
    while (order.length) {
      const key = order.shift();
      if (!map.has(key)) continue;
      const evt = map.get(key) || null;
      map.delete(key);
      return evt;
    }
    return null;
  }

  function trimToCap(cap) {
    trimLowFirstToCap(cap);
    while (api.size() > cap) {
      if (highFifo.length) {
        highFifo.shift();
        droppedHigh += 1;
        continue;
      }
      if (highCoalesced.size) {
        const dropped = shiftCoalesced(highCoalesced, highCoalescedOrder);
        if (dropped) droppedHigh += 1;
        continue;
      }
      break;
    }
  }

  function trimLowFirstToCap(cap) {
    while (api.size() > cap) {
      if (lowFifo.length) {
        lowFifo.shift();
        droppedLow += 1;
        continue;
      }
      if (lowCoalesced.size) {
        const dropped = shiftCoalesced(lowCoalesced, lowCoalescedOrder);
        if (dropped) droppedLow += 1;
        continue;
      }
      break;
    }
  }

  return api;
}

window.EventQueueModule = { createEventQueue: createEventQueue };
