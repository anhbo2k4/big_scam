/**
 * Gamification Routes
 * /api/gamification/* endpoints for XP, levels, daily rewards, leaderboards
 */

const express = require('express');
const router = express.Router();
const gamificationService = require('../services/gamificationService');
const authMiddleware = require('../middleware/authMiddleware');

// All gamification routes require authentication
router.use(authMiddleware.isAuthenticated);

/**
 * GET /api/gamification/user/:userId/status
 * Get user's gamification status (level, XP, streaks, badges)
 */
router.get('/user/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;

    // Check user permission (can only see own status unless admin)
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const status = await gamificationService.getUserStatus(userId);

    res.json({
      success: true,
      data: status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch status' });
  }
});

/**
 * POST /api/gamification/daily-reward/claim
 * Claim daily login reward
 * Body: { userId }
 */
router.post('/daily-reward/claim', async (req, res) => {
  try {
    const { userId } = req.body;

    // Permission check
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const result = await gamificationService.claimDailyReward(userId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Daily reward claimed',
        data: result.reward
      });
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to claim reward' });
  }
});

/**
 * GET /api/gamification/leaderboard/:tier
 * Get leaderboard for tier (BRONZE, SILVER, GOLD, PLATINUM, DIAMOND)
 * Query: limit=50
 */
router.get('/leaderboard/:tier', async (req, res) => {
  try {
    const { tier } = req.params;
    const { limit = 50 } = req.query;

    const validTiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
    if (!validTiers.includes(tier.toUpperCase())) {
      return res.status(400).json({ success: false, message: 'Invalid tier' });
    }

    const leaderboard = await gamificationService.getTierLeaderboard(tier.toUpperCase(), parseInt(limit));

    res.json({
      success: true,
      tier: tier.toUpperCase(),
      data: leaderboard,
      count: leaderboard.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
});

/**
 * GET /api/gamification/leaderboard
 * Get all leaderboards summary
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
    const leaderboards = {};

    for (const tier of tiers) {
      leaderboards[tier] = await gamificationService.getTierLeaderboard(tier, 10);
    }

    res.json({
      success: true,
      data: leaderboards
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboards' });
  }
});

module.exports = router;
