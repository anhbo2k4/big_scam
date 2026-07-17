'use strict';

/**
 * pushController.js
 *
 * Handles Web Push subscription management and sending push notifications
 * via the VAPID protocol (RFC 8292).
 *
 * Required .env variables:
 *   VAPID_PUBLIC_KEY   — base64url public key (from tools/generate-vapid.js)
 *   VAPID_PRIVATE_KEY  — base64url private key
 *   VAPID_EMAIL        — mailto: contact address, e.g. mailto:admin@example.com
 *
 * Usage from other controllers:
 *   const { sendToUser, broadcast } = require('./pushController');
 *   await sendToUser(userId, { title: 'Hello', body: 'World', url: '/chat' });
 *   await broadcast({ title: 'System notice', body: '...' });
 */

const db = require('../models');

// ─── web-push — optional dependency, fail gracefully if not installed ────────

let webpush = null;
try {
  webpush = require('web-push');
} catch (_) {
  console.warn(
    '[PushController] web-push package not found. ' +
    'Run: npm install web-push  then restart the server.'
  );
}

const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY  || null;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || null;
const VAPID_EMAIL   = process.env.VAPID_EMAIL || 'mailto:admin@example.com';

// Configure once at startup; skip if keys are missing
if (webpush && VAPID_PUBLIC && VAPID_PRIVATE) {
  try {
    webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);
  } catch (e) {
    console.error('[PushController] Invalid VAPID keys:', e.message);
    webpush = null;
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function isPushConfigured() {
  return !!(webpush && VAPID_PUBLIC && VAPID_PRIVATE);
}

/**
 * Send a push notification to a single subscription record.
 * Automatically deactivates expired subscriptions (HTTP 410/404).
 *
 * @param {object} record     — PushSubscription Sequelize instance
 * @param {object} payload    — { title, body, icon, tag, url, ... }
 * @returns {Promise<{success: boolean, reason?: string, statusCode?: number}>}
 */
async function sendToSubscription(record, payload) {
  if (!isPushConfigured()) {
    return { success: false, reason: 'push_not_configured' };
  }

  const sub = {
    endpoint: record.endpoint,
    keys: { p256dh: record.p256dh, auth: record.auth },
  };

  try {
    const ttl = payload.ttl || 86400; // default TTL: 24 h
    await webpush.sendNotification(sub, JSON.stringify(payload), { TTL: ttl });
    await record.update({ last_used_at: new Date() });
    return { success: true };
  } catch (err) {
    const code = err.statusCode;
    if (code === 410 || code === 404) {
      // Subscription has expired or been revoked by the browser
      await record.update({ is_active: false });
    }
    return { success: false, reason: err.message, statusCode: code };
  }
}

// ─── Route handlers ───────────────────────────────────────────────────────────

/**
 * GET /api/push/vapid-key
 * Returns the VAPID public key so clients can subscribe.
 */
async function getVapidKey(req, res) {
  if (!VAPID_PUBLIC) {
    return res.status(503).json({
      success: false,
      message: 'Push notifications are not configured on this server.',
    });
  }
  return res.json({ success: true, publicKey: VAPID_PUBLIC });
}

/**
 * POST /api/push/subscribe
 * Body: { subscription: { endpoint, keys: { p256dh, auth } }, deviceInfo }
 * Creates or updates a push subscription record.
 */
async function subscribe(req, res) {
  try {
    const { subscription, deviceInfo } = req.body || {};

    if (
      !subscription ||
      typeof subscription.endpoint !== 'string' ||
      !subscription.keys ||
      typeof subscription.keys.p256dh !== 'string' ||
      typeof subscription.keys.auth !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription object.',
      });
    }

    const endpoint = subscription.endpoint;
    const p256dh   = subscription.keys.p256dh;
    const auth     = subscription.keys.auth;

    if (!p256dh || !auth) {
      return res.status(400).json({ success: false, message: 'Missing encryption keys.' });
    }

    const userId = (req.session && req.session.user && req.session.user.id) || null;

    const [record, created] = await db.PushSubscription.findOrCreate({
      where: { endpoint },
      defaults: {
        user_id: userId,
        endpoint,
        p256dh,
        auth,
        device_info: deviceInfo || null,
        is_active: true,
        last_used_at: new Date(),
      },
    });

    if (!created) {
      await record.update({
        // Associate with logged-in user if we now have one
        user_id: userId || record.user_id,
        p256dh,
        auth,
        is_active: true,
        last_used_at: new Date(),
        device_info: deviceInfo || record.device_info,
      });
    }

    return res.json({ success: true, created });
  } catch (err) {
    console.error('[PushController] subscribe error:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

/**
 * DELETE /api/push/subscribe
 * Body: { endpoint }
 * Marks subscription as inactive.
 */
async function unsubscribe(req, res) {
  try {
    const { endpoint } = req.body || {};

    if (!endpoint || typeof endpoint !== 'string') {
      return res.status(400).json({ success: false, message: 'Missing endpoint.' });
    }

    await db.PushSubscription.update(
      { is_active: false },
      { where: { endpoint } }
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('[PushController] unsubscribe error:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// ─── Utility functions (for use by other controllers) ────────────────────────

/**
 * Send push notification to all active subscriptions of a user.
 *
 * @param {number|string} userId
 * @param {object} payload — { title, body, icon, tag, url, ... }
 * @returns {Promise<{success: boolean, sent: number, total: number, reason?: string}>}
 */
async function sendToUser(userId, payload) {
  if (!isPushConfigured()) {
    return { success: false, reason: 'push_not_configured', sent: 0, total: 0 };
  }

  try {
    const subs = await db.PushSubscription.findAll({
      where: { user_id: userId, is_active: true },
    });

    if (!subs.length) {
      return { success: true, sent: 0, total: 0 };
    }

    const results = await Promise.all(subs.map((s) => sendToSubscription(s, payload)));
    const sent = results.filter((r) => r.success).length;

    return { success: true, sent, total: subs.length };
  } catch (err) {
    console.error('[PushController] sendToUser error:', err.message);
    return { success: false, reason: err.message, sent: 0, total: 0 };
  }
}

/**
 * Broadcast push notification to all active subscriptions.
 *
 * @param {object} payload — { title, body, icon, tag, url, ... }
 * @param {object} [opts]  — { userId: number } to limit to one user
 * @returns {Promise<{success: boolean, sent: number, failed: number, total: number}>}
 */
async function broadcast(payload, opts) {
  if (!isPushConfigured()) {
    return { success: false, reason: 'push_not_configured', sent: 0, failed: 0, total: 0 };
  }

  try {
    const where = { is_active: true };
    if (opts && opts.userId) where.user_id = opts.userId;

    const subs = await db.PushSubscription.findAll({ where });

    if (!subs.length) {
      return { success: true, sent: 0, failed: 0, total: 0 };
    }

    const results = await Promise.all(subs.map((s) => sendToSubscription(s, payload)));

    return {
      success: true,
      sent:   results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      total:  subs.length,
    };
  } catch (err) {
    console.error('[PushController] broadcast error:', err.message);
    return { success: false, reason: err.message, sent: 0, failed: 0, total: 0 };
  }
}

module.exports = {
  getVapidKey,
  subscribe,
  unsubscribe,
  sendToUser,
  broadcast,
  isPushConfigured,
};
