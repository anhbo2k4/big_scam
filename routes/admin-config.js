/**
 * Admin Configuration Routes
 * /api/admin/config/* endpoints for game rule management
 */

const express = require('express');
const router = express.Router();
const adminConfigController = require('../controllers/adminConfigController');
const authMiddleware = require('../middleware/authMiddleware');

// All admin config routes require authentication
router.use(authMiddleware.isAuthenticated);

/**
 * GET /api/admin/config
 * Get all active configurations grouped by category
 */
router.get('/', adminConfigController.getAllConfigs);

/**
 * GET /api/admin/config/:configKey
 * Get specific configuration
 */
router.get('/:configKey', adminConfigController.getConfig);

/**
 * POST /api/admin/config
 * Create new configuration
 * Body: { configKey, value, category, description }
 */
router.post('/', adminConfigController.createConfig);

/**
 * PUT /api/admin/config/:configKey
 * Update configuration
 * Body: { newValue, description }
 */
router.put('/:configKey', adminConfigController.updateConfig);

/**
 * POST /api/admin/config/:configKey/rollback
 * Rollback to previous value
 */
router.post('/:configKey/rollback', adminConfigController.rollbackConfig);

/**
 * POST /api/admin/config/:configKey/toggle
 * Toggle feature flag (boolean)
 */
router.post('/:configKey/toggle', adminConfigController.toggleFeatureFlag);

/**
 * DELETE /api/admin/config/:configKey
 * Deactivate configuration
 */
router.delete('/:configKey', adminConfigController.deleteConfig);

module.exports = router;
