#!/usr/bin/env node
'use strict';

/**
 * tools/generate-vapid.js
 *
 * One-time utility to generate a VAPID key pair for Web Push.
 *
 * Usage:
 *   node tools/generate-vapid.js
 *
 * Copy the output into your .env file, then restart the server.
 */

let webpush;
try {
  webpush = require('web-push');
} catch (_) {
  console.error(
    '\n[ERROR] web-push package not found.\n' +
    'Run:  npm install web-push\n' +
    'Then: node tools/generate-vapid.js\n'
  );
  process.exit(1);
}

const keys = webpush.generateVAPIDKeys();

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  VAPID keys generated — add these to your .env  ');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('VAPID_PUBLIC_KEY='  + keys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + keys.privateKey);
console.log('VAPID_EMAIL=mailto:admin@yourdomain.com\n');
console.log('Keep VAPID_PRIVATE_KEY secret — never commit it to source control.');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
