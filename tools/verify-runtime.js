'use strict';

const checks = [
  { name: 'Home page', url: 'http://localhost:3000/' },
  { name: 'Game page template route', url: 'http://localhost:3000/lucky-mystery-box' },
  { name: 'Admin login page', url: 'http://localhost:3000/admin/login' },
  { name: 'Notification sound asset', url: 'http://localhost:3000/js/notificationSound.js' },
  { name: 'Tab notification asset', url: 'http://localhost:3000/js/tabNotification.js' },
  { name: 'Customer chat script', url: 'http://localhost:3000/js/lucky-mystery-box-v2.js' },
  { name: 'Admin dashboard CSS', url: 'http://localhost:3000/css/admin-customer-care.css' }
];

async function run() {
  const started = Date.now();
  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      const res = await fetch(check.url, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        passed += 1;
        console.log(`OK   ${check.name}: ${res.status} ${check.url}`);
      } else {
        failed += 1;
        console.log(`FAIL ${check.name}: ${res.status} ${check.url}`);
      }
    } catch (err) {
      failed += 1;
      console.log(`FAIL ${check.name}: ${err.message}`);
    }
  }

  const elapsed = Date.now() - started;
  console.log('');
  console.log(`Summary: ${passed} passed, ${failed} failed (${elapsed}ms)`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

run().catch((err) => {
  console.error('Runtime verify crashed:', err);
  process.exitCode = 1;
});
