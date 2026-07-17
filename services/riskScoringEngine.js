/**
 * Anti-Cheat Risk Scoring Engine
 * Calculates user risk scores across 7 categories
 * CRITICAL: Prevents fraud, multi-accounting, unusual patterns
 */

const { RiskScore, GameSession, User, Wallet, TransactionLedger } = require('../models');
const crypto = require('crypto');

// Risk thresholds
const RISK_THRESHOLDS = {
  SAFE: { min: 0, max: 20 },
  MONITORING: { min: 21, max: 40 },
  ELEVATED: { min: 41, max: 60 },
  SUSPICIOUS: { min: 61, max: 80 },
  BLOCKED: { min: 81, max: 100 }
};

/**
 * Category 1: Win Rate Risk
 * Too high = suspicious (7%+ win rate is extremely unlikely)
 */
async function calculateWinRateRisk(userId) {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // game_sessions has no user_id — scoring only applies to linked users
    const user = await User.findByPk(userId);
    if (!user) return 0;

    // Get recent completed games
    const games = await GameSession.findAll({
      where: {
        created_by: user.username,
        created_at: { [require('sequelize').Op.gte]: thirtyDaysAgo }
      }
    });

    if (games.length < 10) {
      return 0; // Need sample size to assess
    }

    // is_won: session completed with a box selected
    const wins = games.filter(g => g.is_completed && g.player_selected_box).length;
    const winRate = (wins / games.length) * 100;

    // Risk scoring
    if (winRate > 10) return 100; // Impossible
    if (winRate > 8) return 80;
    if (winRate > 6) return 60;
    if (winRate > 4) return 40;
    if (winRate > 2) return 20;
    return 0;
  } catch (err) {
    console.error('Error calculating win rate risk:', err);
    return 0;
  }
}

/**
 * Category 2: Frequency Risk
 * Too many plays in short time = automated bot or excessive
 */
async function calculateFrequencyRisk(userId) {
  try {
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const user = await User.findByPk(userId);
    if (!user) return 0;

    const gamesLastHour = await GameSession.count({
      where: {
        created_by: user.username,
        created_at: { [require('sequelize').Op.gte]: oneHourAgo }
      }
    });

    const gamesLastDay = await GameSession.count({
      where: {
        created_by: user.username,
        created_at: { [require('sequelize').Op.gte]: oneDayAgo }
      }
    });

    // Risk scoring
    let frequencyRisk = 0;
    if (gamesLastHour > 50) frequencyRisk += 60; // 50+ plays/hour = bot
    else if (gamesLastHour > 20) frequencyRisk += 40;
    else if (gamesLastHour > 10) frequencyRisk += 20;

    if (gamesLastDay > 500) frequencyRisk += 40; // 500+ plays/day = suspicious
    else if (gamesLastDay > 300) frequencyRisk += 20;

    return Math.min(frequencyRisk, 100);
  } catch (err) {
    console.error('Error calculating frequency risk:', err);
    return 0;
  }
}

/**
 * Category 3: Device Risk
 * Sudden device changes or too many devices = suspicious
 */
async function calculateDeviceRisk(userId) {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const user = await User.findByPk(userId);
    if (!user) return 0;

    // Get unique devices in last 30 days (browser_fingerprint is the correct column)
    const games = await GameSession.findAll({
      where: {
        created_by: user.username,
        created_at: { [require('sequelize').Op.gte]: thirtyDaysAgo }
      },
      attributes: ['browser_fingerprint']
    });

    if (games.length === 0) return 0;

    // Count unique devices
    const uniqueDevices = new Set(games.map(g => g.browser_fingerprint).filter(Boolean)).size;

    // Risk scoring
    if (uniqueDevices > 10) return 100; // Way too many devices
    if (uniqueDevices > 5) return 80;
    if (uniqueDevices > 3) return 50;
    if (uniqueDevices > 1) return 20;
    return 0;
  } catch (err) {
    console.error('Error calculating device risk:', err);
    return 0;
  }
}

/**
 * Category 4: Location Risk
 * Sudden location changes or impossible travel = suspicious
 */
async function calculateLocationRisk(userId) {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const user = await User.findByPk(userId);
    if (!user) return 0;

    // Get last 20 games with location (player_ip is the correct column)
    const games = await GameSession.findAll({
      where: {
        created_by: user.username,
        created_at: { [require('sequelize').Op.gte]: oneWeekAgo }
      },
      attributes: ['player_ip', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 20
    });

    if (games.length < 2) return 0;

    let locationRisk = 0;
    const uniqueIPs = new Set(games.map(g => g.player_ip).filter(Boolean)).size;

    // Too many different IPs
    if (uniqueIPs > 10) locationRisk += 60;
    else if (uniqueIPs > 5) locationRisk += 30;

    // Check for impossible travel (would need geolocation DB in production)
    // For now, flag if changing IPs frequently
    if (games.length >= 5) {
      let ipChanges = 0;
      for (let i = 0; i < games.length - 1; i++) {
        if (games[i].player_ip !== games[i + 1].player_ip) {
          ipChanges++;
        }
      }

      // Too many IP changes in short time
      if (ipChanges === games.length - 1) {
        locationRisk += 40; // Every play from different IP
      }
    }

    return Math.min(locationRisk, 100);
  } catch (err) {
    console.error('Error calculating location risk:', err);
    return 0;
  }
}

/**
 * Category 5: Timing Risk
 * Playing at unusual times or with suspicious patterns
 */
async function calculateTimingRisk(userId) {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const user = await User.findByPk(userId);
    if (!user) return 0;

    const games = await GameSession.findAll({
      where: {
        created_by: user.username,
        created_at: { [require('sequelize').Op.gte]: oneDayAgo }
      },
      attributes: ['created_at']
    });

    if (games.length === 0) return 0;

    // Analyze timing patterns
    let timingRisk = 0;

    // Check for 24/7 playing (no sleep patterns)
    const hours = new Set(games.map(g => g.created_at.getHours()));
    if (hours.size > 20) {
      timingRisk += 40; // Playing at almost all hours = bot
    }

    // Check for perfectly regular intervals (bot indicator)
    if (games.length >= 5) {
      const intervals = [];
      for (let i = 0; i < games.length - 1; i++) {
        const diff = (games[i].created_at - games[i + 1].created_at) / 1000; // seconds
        intervals.push(diff);
      }

      // If all intervals similar = bot
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, int) => sum + Math.pow(int - avgInterval, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev < 5 && avgInterval < 30) {
        timingRisk += 60; // Perfect regularity = bot
      }
    }

    return Math.min(timingRisk, 100);
  } catch (err) {
    console.error('Error calculating timing risk:', err);
    return 0;
  }
}

/**
 * Category 6: Multi-Account Risk
 * Same device, IP, or email for multiple accounts
 */
async function calculateMultiAccountRisk(userId) {
  try {
    const user = await User.findByPk(userId);
    if (!user) return 0;

    // Get user's fingerprint from latest game (browser_fingerprint + player_ip are the correct columns)
    const latestGame = await GameSession.findOne({
      where: { created_by: user.username },
      order: [['created_at', 'DESC']],
      attributes: ['browser_fingerprint', 'player_ip']
    });

    if (!latestGame) return 0;

    let multiAccountRisk = 0;

    // Count other accounts with same device fingerprint
    if (latestGame.browser_fingerprint) {
      const deviceCount = await GameSession.count({
        where: { browser_fingerprint: latestGame.browser_fingerprint },
        attributes: ['created_by'],
        group: ['created_by'],
        raw: true
      });

      if (deviceCount > 5) multiAccountRisk += 80; // Too many accounts on device
      else if (deviceCount > 2) multiAccountRisk += 40;
    }

    // Count other accounts with same IP
    if (latestGame.player_ip) {
      const ipCount = await GameSession.count({
        where: { player_ip: latestGame.player_ip },
        attributes: ['created_by'],
        group: ['created_by'],
        raw: true
      });

      if (ipCount > 10) multiAccountRisk += 80;
      else if (ipCount > 5) multiAccountRisk += 40;
    }

    return Math.min(multiAccountRisk, 100);
  } catch (err) {
    console.error('Error calculating multi-account risk:', err);
    return 0;
  }
}

/**
 * Category 7: Behavior Risk
 * Unusual withdrawal patterns, balance changes, etc.
 */
async function calculateBehaviorRisk(userId) {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const user = await User.findByPk(userId);
    if (!user) return 0;

    // Check withdrawal velocity
    const withdrawals = await TransactionLedger.count({
      where: {
        user_id: userId,
        transaction_type: 'WITHDRAWAL_REQUEST',
        created_at: { [require('sequelize').Op.gte]: oneDayAgo }
      }
    });

    let behaviorRisk = 0;

    // Too many withdrawal attempts
    if (withdrawals > 10) behaviorRisk += 70;
    else if (withdrawals > 5) behaviorRisk += 40;
    else if (withdrawals > 2) behaviorRisk += 20;

    // Check for rapid balance increases (suspicious wins)
    const games = await GameSession.findAll({
      where: {
        created_by: user.username,
        created_at: { [require('sequelize').Op.gte]: oneDayAgo }
      },
      order: [['created_at', 'DESC']],
      limit: 10
    });

    let totalWinnings = 0;
    const bigWins = games.filter(g => {
      // Determine win amount from whichever prize box was selected
      const boxNum = g.player_selected_box || 1;
      const cashAmt = g[`prize_${boxNum}_cash_amount`] || 0;
      if (g.is_completed && g.player_selected_box && cashAmt > 100000) {
        totalWinnings += cashAmt;
        return true;
      }
      return false;
    }).length;

    // Too many big wins in short time
    if (bigWins > 2) behaviorRisk += 50;
    if (totalWinnings > 1000000) behaviorRisk += 40; // Too much money in 24h

    return Math.min(behaviorRisk, 100);
  } catch (err) {
    console.error('Error calculating behavior risk:', err);
    return 0;
  }
}

/**
 * Calculate overall risk score
 * Returns status: SAFE, MONITORING, ELEVATED, SUSPICIOUS, BLOCKED
 */
async function calculateRiskScore(userId) {
  try {
    console.log(`🔍 Calculating risk score for user ${userId}`);

    // Calculate all 7 components
    const [winRateRisk, frequencyRisk, deviceRisk, locationRisk, timingRisk, multiAccountRisk, behaviorRisk] = await Promise.all([
      calculateWinRateRisk(userId),
      calculateFrequencyRisk(userId),
      calculateDeviceRisk(userId),
      calculateLocationRisk(userId),
      calculateTimingRisk(userId),
      calculateMultiAccountRisk(userId),
      calculateBehaviorRisk(userId)
    ]);

    // Weighted average
    const overallScore = Math.round(
      winRateRisk * 0.25 + // Highest weight - most important
      behaviorRisk * 0.20 +
      frequencyRisk * 0.15 +
      multiAccountRisk * 0.15 +
      deviceRisk * 0.10 +
      locationRisk * 0.10 +
      timingRisk * 0.05
    );

    // Clamp score
    const finalScore = Math.max(0, Math.min(100, overallScore));

    // Determine status
    let status = 'SAFE';
    if (finalScore < 21) status = 'SAFE';
    else if (finalScore < 41) status = 'MONITORING';
    else if (finalScore < 61) status = 'ELEVATED';
    else if (finalScore < 81) status = 'SUSPICIOUS';
    else status = 'BLOCKED';

    console.log(`✅ Risk Score: ${finalScore} (${status})`);
    console.log(`   Win Rate: ${winRateRisk}, Frequency: ${frequencyRisk}, Device: ${deviceRisk}, Location: ${locationRisk}, Timing: ${timingRisk}, MultiAccount: ${multiAccountRisk}, Behavior: ${behaviorRisk}`);

    // Update or create risk score
    const [riskRecord, created] = await RiskScore.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        risk_score: finalScore,
        current_status: status,
        win_rate_risk: winRateRisk,
        frequency_risk: frequencyRisk,
        device_risk: deviceRisk,
        location_risk: locationRisk,
        timing_risk: timingRisk,
        multi_account_risk: multiAccountRisk,
        behavior_risk: behaviorRisk,
        last_calculated_at: new Date()
      }
    });

    if (!created) {
      // Update existing
      await riskRecord.update({
        risk_score: finalScore,
        current_status: status,
        win_rate_risk: winRateRisk,
        frequency_risk: frequencyRisk,
        device_risk: deviceRisk,
        location_risk: locationRisk,
        timing_risk: timingRisk,
        multi_account_risk: multiAccountRisk,
        behavior_risk: behaviorRisk,
        last_calculated_at: new Date()
      });
    }

    // Log if crosses threshold or manually locked
    if (status === 'BLOCKED' && !riskRecord.manual_locked) {
      console.warn(`⚠️ AUTO-BLOCKED User ${userId} - Risk Score ${finalScore}`);
      await riskRecord.update({
        manual_locked: true,
        locked_reason: `Auto-blocked: Risk score ${finalScore}`,
        locked_at: new Date()
      });
    }

    return {
      score: finalScore,
      status: status,
      components: {
        winRateRisk,
        frequencyRisk,
        deviceRisk,
        locationRisk,
        timingRisk,
        multiAccountRisk,
        behaviorRisk
      }
    };
  } catch (err) {
    console.error('❌ Error calculating risk score:', err);
    return {
      score: 0,
      status: 'SAFE',
      error: err.message
    };
  }
}

/**
 * Check if user is blocked or should be warned
 */
async function checkRiskStatus(userId) {
  try {
    const risk = await RiskScore.findOne({ where: { user_id: userId } });

    if (!risk) return { canPlay: true, warning: false };

    // Manually locked
    if (risk.manual_locked) {
      if (risk.locked_until && new Date(risk.locked_until) > new Date()) {
        return { canPlay: false, warning: false, reason: risk.locked_reason };
      }
    }

    // Auto-blocked
    if (risk.current_status === 'BLOCKED' || risk.risk_score > 85) {
      return { canPlay: false, warning: false, reason: 'Account flagged for suspicious activity' };
    }

    // Warnings for monitoring/elevated
    if (risk.current_status === 'SUSPICIOUS' || risk.risk_score > 75) {
      return { canPlay: true, warning: true, message: 'Account under review' };
    }

    if (risk.current_status === 'ELEVATED' || risk.risk_score > 55) {
      return { canPlay: true, warning: false, message: 'Unusual activity detected' };
    }

    return { canPlay: true, warning: false };
  } catch (err) {
    console.error('Error checking risk status:', err);
    return { canPlay: true, warning: false }; // Fail open
  }
}

/**
 * Admin: Manually lock account
 */
async function lockAccount(userId, reason, until = null) {
  try {
    const risk = await RiskScore.findOne({ where: { user_id: userId } });

    if (!risk) return { success: false, message: 'Risk score not found' };

    await risk.update({
      manual_locked: true,
      locked_reason: reason,
      locked_until: until,
      locked_by_admin: true
    });

    console.log(`🔒 Account ${userId} locked: ${reason}`);
    return { success: true };
  } catch (err) {
    console.error('Error locking account:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Unlock account
 */
async function unlockAccount(userId, unlockedBy = 'admin') {
  try {
    const risk = await RiskScore.findOne({ where: { user_id: userId } });

    if (!risk) return { success: false };

    await risk.update({
      manual_locked: false,
      locked_reason: null,
      locked_until: null,
      locked_by_admin: false,
      last_reviewed_at: new Date()
    });

    console.log(`🔓 Account ${userId} unlocked by ${unlockedBy}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  calculateRiskScore,
  checkRiskStatus,
  lockAccount,
  unlockAccount,
  RISK_THRESHOLDS
};
