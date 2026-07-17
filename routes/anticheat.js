/**
 * Anti-Cheat Routes
 * /api/anticheat/* endpoints for risk scoring, monitoring, admin controls
 */

const express = require('express');
const router = express.Router();
const riskScoringEngine = require('../services/riskScoringEngine');
const authMiddleware = require('../middleware/authMiddleware');
const { RiskScore } = require('../models');

// All anti-cheat routes require authentication
router.use(authMiddleware.isAuthenticated);

/**
 * GET /api/anticheat/risk/:userId
 * Get user's current risk score and status
 */
router.get('/risk/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Permission: admin or own user
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const risk = await RiskScore.findOne({ where: { user_id: userId } });

    if (!risk) {
      return res.status(404).json({ success: false, message: 'Risk profile not found' });
    }

    res.json({
      success: true,
      data: {
        userId: risk.user_id,
        riskScore: risk.risk_score,
        status: risk.current_status,
        components: {
          winRate: risk.win_rate_risk,
          frequency: risk.frequency_risk,
          device: risk.device_risk,
          location: risk.location_risk,
          timing: risk.timing_risk,
          multiAccount: risk.multi_account_risk,
          behavior: risk.behavior_risk
        },
        manualLocked: risk.manual_locked,
        lockedReason: risk.locked_reason,
        lockedUntil: risk.locked_until,
        lastCalculated: risk.last_calculated_at,
        lastReviewed: risk.last_reviewed_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch risk score' });
  }
});

/**
 * POST /api/anticheat/recalculate/:userId
 * Force recalculation of risk score for user
 */
router.post('/recalculate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Require admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const result = await riskScoringEngine.calculateRiskScore(userId);

    res.json({
      success: true,
      message: 'Risk score recalculated',
      data: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to recalculate' });
  }
});

/**
 * POST /api/anticheat/check-status/:userId
 * Check if user can play (not blocked)
 */
router.post('/check-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const status = await riskScoringEngine.checkRiskStatus(userId);

    res.json({
      success: true,
      data: status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/**
 * POST /api/anticheat/admin/lock
 * Admin: Lock account (prevent playing)
 * Body: { userId, reason, until: null or ISO date }
 */
router.post('/admin/lock', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const { userId, reason, until } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({ success: false, message: 'Missing userId or reason' });
    }

    const result = await riskScoringEngine.lockAccount(userId, reason, until);

    if (result.success) {
      res.json({
        success: true,
        message: `User ${userId} locked`,
        data: { userId, reason, until }
      });
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to lock account' });
  }
});

/**
 * POST /api/anticheat/admin/unlock
 * Admin: Unlock account
 * Body: { userId }
 */
router.post('/admin/unlock', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const { userId } = req.body;

    const result = await riskScoringEngine.unlockAccount(userId, req.user.id);

    if (result.success) {
      res.json({
        success: true,
        message: `User ${userId} unlocked`
      });
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/**
 * GET /api/anticheat/admin/monitoring
 * Admin: Get list of all flagged/suspicious accounts
 * Query: status=BLOCKED,SUSPICIOUS, limit=50
 */
router.get('/admin/monitoring', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const { status = 'BLOCKED,SUSPICIOUS', limit = 50, offset = 0 } = req.query;

    const statuses = status.split(',').map(s => s.trim().toUpperCase());
    const Op = require('sequelize').Op;

    const flagged = await RiskScore.findAndCountAll({
      where: {
        current_status: { [Op.in]: statuses }
      },
      order: [['risk_score', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: flagged.rows.map(r => ({
        userId: r.user_id,
        riskScore: r.risk_score,
        status: r.current_status,
        manualLocked: r.manual_locked,
        lastCalculated: r.last_calculated_at
      })),
      total: flagged.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/**
 * GET /api/anticheat/admin/stats
 * Admin: Get overall anti-cheat statistics
 */
router.get('/admin/stats', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const Op = require('sequelize').Op;

    const stats = {
      BLOCKED: await RiskScore.count({ where: { current_status: 'BLOCKED' } }),
      SUSPICIOUS: await RiskScore.count({ where: { current_status: 'SUSPICIOUS' } }),
      ELEVATED: await RiskScore.count({ where: { current_status: 'ELEVATED' } }),
      MONITORING: await RiskScore.count({ where: { current_status: 'MONITORING' } }),
      SAFE: await RiskScore.count({ where: { current_status: 'SAFE' } }),
      MANUAL_LOCKED: await RiskScore.count({ where: { manual_locked: true } })
    };

    res.json({
      success: true,
      data: stats,
      total: Object.values(stats).reduce((a, b) => a + b, 0)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
