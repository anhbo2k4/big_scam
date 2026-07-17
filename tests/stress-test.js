/**
 * stress-test.js  —  Chat Transport Server Stress Test
 * ──────────────────────────────────────────────────────
 * Usage:
 *   node stress-test.js
 *   node stress-test.js --base-url=https://yourdomain.com
 *
 * Requirements: Node.js built-in (http/https) only — no npm install needed.
 *
 * What it tests:
 *   Scenario 1 — 50 SSE clients, each client sends 1 message every 5s (60s total)
 *   Scenario 2 — 20 clients cycling disconnect/reconnect every 3s (10 cycles)
 *   Scenario 3 — 10 SSE clients + 10 Long Polling clients concurrently (30s)
 *
 * NOTE: Requires a valid session_code to exist in the DB.
 *       Set SESSION_CODE env var or edit CONFIG below.
 *       The test POSTs messages as sender_type='customer' via /api/chat/message.
 */

'use strict';

const http  = require('http');
const https = require('https');
const { performance } = require('perf_hooks');

/* ── CONFIG ──────────────────────────────────────────────── */
const args = process.argv.slice(2).reduce((acc, a) => {
  const [k, v] = a.replace(/^--/, '').split('=');
  acc[k] = v; return acc;
}, {});

const BASE_URL    = args['base-url'] || process.env.BASE_URL    || 'http://localhost:3000';
const SESSION     = args['session']  || process.env.SESSION_CODE || 'TESTCODE001';
const VERBOSE     = args['verbose']  !== undefined;

/* ── HTTP helpers ────────────────────────────────────────── */
const urlLib = BASE_URL.startsWith('https') ? https : http;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url    = new URL(path, BASE_URL);
    const data   = body ? JSON.stringify(body) : null;
    const opts   = {
      hostname: url.hostname,
      port:     url.port || (BASE_URL.startsWith('https') ? 443 : 80),
      path:     url.pathname + url.search,
      method,
      headers: {
        'Content-Type':  'application/json',
        'Content-Length': data ? Buffer.byteLength(data) : 0
      },
      timeout: 10000
    };

    const req = urlLib.request(opts, (res) => {
      let raw = '';
      res.on('data', c => { raw += c; });
      res.on('end', () => {
        try   { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error',   reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    if (data) req.write(data);
    req.end();
  });
}

function openSSE(path, onData, onClose) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const opts = {
      hostname: url.hostname,
      port:     url.port || (BASE_URL.startsWith('https') ? 443 : 80),
      path:     url.pathname,
      method:   'GET',
      headers:  { 'Accept': 'text/event-stream', 'Cache-Control': 'no-cache' },
      timeout:  0
    };

    const req = urlLib.request(opts, (res) => {
      if (res.statusCode !== 200) {
        req.destroy();
        return reject(new Error('SSE HTTP ' + res.statusCode));
      }
      resolve(req); // give caller a handle to destroy
      let buf = '';
      res.on('data', (chunk) => {
        buf += chunk.toString();
        const lines = buf.split('\n');
        buf = lines.pop();
        let evtType = '', evtData = '';
        lines.forEach(l => {
          if (l.startsWith('event:')) evtType = l.slice(6).trim();
          else if (l.startsWith('data:')) evtData = l.slice(5).trim();
          else if (l === '' && evtType) { try { onData(evtType, JSON.parse(evtData)); } catch {} evtType = evtData = ''; }
        });
      });
      res.on('end',   () => onClose && onClose());
      res.on('error', () => onClose && onClose());
    });
    req.on('error', reject);
    req.end();
  });
}

function openPoll(sessionCode, since) {
  const path = `/api/chat/poll/${sessionCode}?since=${since}`;
  return request('GET', path).then(r => r.body);
}

/* ── Metrics ─────────────────────────────────────────────── */
function makeMetrics(name) {
  return {
    name,
    sent: 0, failed: 0, received: 0,
    latencies: [],
    start: Date.now(),
    memBefore: process.memoryUsage().heapUsed,
    memAfter: 0,

    record(ok, latencyMs) {
      if (ok) { this.sent++; this.latencies.push(latencyMs); }
      else    { this.failed++; }
    },
    onReceive() { this.received++; },
    finalize() {
      this.memAfter = process.memoryUsage().heapUsed;
      const lat = this.latencies;
      const avg = lat.length ? (lat.reduce((a,b)=>a+b,0)/lat.length).toFixed(0) : 'N/A';
      const p95 = lat.length ? lat.sort((a,b)=>a-b)[Math.floor(lat.length*0.95)].toFixed(0) : 'N/A';
      const memDeltaKB = ((this.memAfter - this.memBefore)/1024).toFixed(0);
      console.log(`\n${'─'.repeat(55)}`);
      console.log(`📊 ${this.name}`);
      console.log(`   Sent OK: ${this.sent}  |  Failed: ${this.failed}  |  Received via stream: ${this.received}`);
      console.log(`   Avg send latency: ${avg}ms  |  p95: ${p95}ms`);
      console.log(`   Server heap delta: ${memDeltaKB} KB`);
      console.log(`   Duration: ${((Date.now()-this.start)/1000).toFixed(1)}s`);
    }
  };
}

/* ── Scenario 1 ──────────────────────────────────────────── */
async function scenario1() {
  console.log('\n══════════════════════════════════════════════');
  console.log('Scenario 1: 50 SSE clients, 1 msg/5s for 60s');
  console.log('══════════════════════════════════════════════');
  const m = makeMetrics('Scenario 1');
  const clients = [];
  const DURATION = 60000;
  const MSG_INTERVAL = 5000;

  // Connect 50 SSE clients
  const connectPromises = Array.from({ length: 50 }, (_, i) =>
    openSSE(
      `/api/chat/events/${SESSION}`,
      (t, d) => { if (t === 'new_message') m.onReceive(); },
      () => {}
    ).catch(() => null)
  );
  const reqs = await Promise.allSettled(connectPromises);
  const connected = reqs.filter(r => r.status === 'fulfilled' && r.value).length;
  console.log(`  Connected: ${connected}/50 SSE streams`);

  // Send messages every 5s
  const deadline = Date.now() + DURATION;
  while (Date.now() < deadline) {
    const t0 = performance.now();
    await request('POST', '/api/chat/message', {
      session_code: SESSION,
      sender_type: 'customer',
      message: `stress-s1-${Date.now()}`,
      message_type: 'text'
    }).then(r => m.record(r.body?.success, performance.now() - t0))
      .catch(() => m.record(false, 0));
    await new Promise(r => setTimeout(r, MSG_INTERVAL));
  }

  // Cleanup
  reqs.forEach(r => { try { if (r.value) r.value.destroy(); } catch {} });
  m.finalize();
}

/* ── Scenario 2 ──────────────────────────────────────────── */
async function scenario2() {
  console.log('\n══════════════════════════════════════════════');
  console.log('Scenario 2: 20 clients disconnect/reconnect, 10 cycles');
  console.log('══════════════════════════════════════════════');
  const m = makeMetrics('Scenario 2');
  const CYCLES = 10;
  const STAY_MS = 3000;

  for (let cycle = 0; cycle < CYCLES; cycle++) {
    const opens = await Promise.allSettled(
      Array.from({ length: 20 }, () =>
        openSSE(`/api/chat/events/${SESSION}`, () => {}, () => {}).catch(() => null)
      )
    );
    const alive = opens.filter(r => r.status === 'fulfilled' && r.value);
    if (VERBOSE) console.log(`  Cycle ${cycle+1}: ${alive.length}/20 connected`);

    await new Promise(r => setTimeout(r, STAY_MS));

    // Disconnect
    alive.forEach(r => { try { r.value.destroy(); } catch {} });
    await new Promise(r => setTimeout(r, 300));

    m.record(alive.length >= 15, STAY_MS); // pass if ≥75% connected
  }

  m.finalize();
}

/* ── Scenario 3 ──────────────────────────────────────────── */
async function scenario3() {
  console.log('\n══════════════════════════════════════════════');
  console.log('Scenario 3: 10 SSE + 10 Long Polling clients, 30s');
  console.log('══════════════════════════════════════════════');
  const m = makeMetrics('Scenario 3');
  const DURATION = 30000;
  const deadline = Date.now() + DURATION;

  // SSE clients
  const sseReqs = await Promise.allSettled(
    Array.from({ length: 10 }, () =>
      openSSE(`/api/chat/events/${SESSION}`, (t, d) => { if (t === 'new_message') m.onReceive(); }, () => {})
        .catch(() => null)
    )
  );
  console.log(`  SSE: ${sseReqs.filter(r=>r.value).length}/10 connected`);

  // Long polling clients — 10 concurrent, each polls continuously
  let pollErrors = 0;
  const pollers = Array.from({ length: 10 }, async () => {
    let since = Date.now() - 30000;
    while (Date.now() < deadline) {
      try {
        const body = await openPoll(SESSION, since);
        if (body?.messages) {
          body.messages.forEach(msg => {
            since = Math.max(since, new Date(msg.created_at).getTime() + 1);
            m.onReceive();
          });
        }
      } catch (e) {
        pollErrors++;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  });

  // Send a few messages during the test
  let sends = 0;
  while (Date.now() < deadline) {
    const t0 = performance.now();
    await request('POST', '/api/chat/message', {
      session_code: SESSION,
      sender_type: 'customer',
      message: `stress-s3-${++sends}`,
      message_type: 'text'
    }).then(r => m.record(r.body?.success, performance.now() - t0))
      .catch(() => m.record(false, 0));
    await new Promise(r => setTimeout(r, 3000));
  }

  await Promise.allSettled(pollers);
  sseReqs.forEach(r => { try { if (r.value) r.value.destroy(); } catch {} });
  console.log(`  Poll errors: ${pollErrors}`);
  m.finalize();
}

/* ── Main ────────────────────────────────────────────────── */
async function main() {
  console.log(`\n🔧 Chat Stress Test`);
  console.log(`   Base URL:    ${BASE_URL}`);
  console.log(`   Session:     ${SESSION}`);
  console.log(`   Node.js:     ${process.version}`);
  console.log(`   Heap before: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)} MB\n`);

  // Verify session exists before running
  const check = await request('GET', `/api/chat/poll/${SESSION}?since=0`).catch(() => null);
  if (!check || check.status === 404) {
    console.error(`\n❌  SESSION "${SESSION}" not found (HTTP ${check?.status}).`);
    console.error(`   Set a real session: SESSION_CODE=YOURCODE node stress-test.js`);
    process.exit(1);
  }
  console.log(`✅  Session verified (HTTP ${check.status})\n`);

  await scenario1();
  await scenario2();
  await scenario3();

  console.log(`\n\n${'═'.repeat(55)}`);
  console.log(`✅  All scenarios complete.`);
  console.log(`   Heap after:  ${(process.memoryUsage().heapUsed/1024/1024).toFixed(1)} MB`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
