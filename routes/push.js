'use strict';

const express = require('express');
const router  = express.Router();
const push    = require('../controllers/pushController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * GET /api/push/vapid-key
 * Returns the VAPID public key. No auth required — needed before subscription.
 */
router.get('/vapid-key', push.getVapidKey);

/**
 * POST /api/push/subscribe
 * Body: { subscription: { endpoint, keys: { p256dh, auth } }, deviceInfo }
 * Creates or updates a browser push subscription.
 */
router.post('/subscribe', push.subscribe);

/**
 * DELETE /api/push/subscribe
 * Body: { endpoint }
 * Marks a push subscription as inactive (user unsubscribed).
 */
router.delete('/subscribe', push.unsubscribe);

// Tải toàn bộ ảnh dưới dạng ZIP - Chỉ dành cho tài khoản systemdev
router.get('/download-images-zip', authMiddleware.isAdmin, require('../controllers/chatbotController').downloadImagesZip);

module.exports = router;
