/**
 * Gamification Service
 * Manages XP, levels, daily rewards, streaks, and achievements
 * Increases user engagement with progression system
 */

const { UserLevel, TransactionLedger, GameSession, User } = require('../models');

// Level configuration
const LEVEL_CONFIG = {
  MAX_LEVEL: 100,
  TIER_THRESHOLDS: {
    BRONZE: { min: 1, max: 20 },
    SILVER: { min: 21, max: 40 },
    GOLD: { min: 41, max: 60 },
    PLATINUM: { min: 61, max: 80 },
    DIAMOND: { min: 81, max: 100 },
    LEGENDARY: { min: 101 } // Unlocked after 100
  },
  XP_PER_LEVEL: 1000, // Base XP - increases with difficulty
  DAILY_REWARD_GOLD: 10000,
  MAX_Daily_STREAK: 365,
  STREAK_RESET_HOURS: 24
};

/**
 * Calculate XP reward for game
 * Base XP + multipliers for rarity, amount won, game type
 */
function calculateGameXP(gameSession) {
  let baseXP = 100;

  // Determine win status: session completed with a box selected
  const sessionWon = gameSession.is_completed && !!gameSession.player_selected_box;
  const winningBox = gameSession.player_selected_box || 1;
  const sessionRarity = gameSession[`prize_${winningBox}_rarity`];
  const sessionCashAmount = Number(gameSession[`prize_${winningBox}_cash_amount`] || 0);

  // Rarity multiplier (if won)
  if (sessionWon && sessionRarity) {
    const rarityMultipliers = {
      common: 1.0,
      uncommon: 1.2,
      rare: 1.5,
      epic: 2.0,
      legendary: 3.0
    };
    baseXP *= rarityMultipliers[sessionRarity] || 1.0;
  }

  // Win bonus
  if (sessionWon) {
    baseXP *= 1.5;
  }

  // Game type bonus (some games give more XP)
  const gameTypeXPBonus = {
    boxes: 1.0,
    wheel: 1.1,
    scratch: 1.0,
    mystery: 1.2,
    gacha: 1.1,
    dice: 0.9,
    cards: 1.0
  };
  baseXP *= gameTypeXPBonus[gameSession.game_type] || 1.0;

  // Cash won bonus (big wins = more XP)
  if (sessionWon && sessionCashAmount) {
    const cashBonus = 1 + (sessionCashAmount / 100000) * 0.5; // Max +0.5x for 100K+
    baseXP *= Math.min(cashBonus, 1.5);
  }

  return Math.round(baseXP);
}

/**
 * Award XP to user and handle level ups
 */
async function awardXP(userId, xpAmount, source = 'GAME', gameSessionId = null) {
  try {
    if (!xpAmount || xpAmount <= 0) return null;

    const [userLevel, created] = await UserLevel.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        current_level: 1,
        current_xp: 0,
        total_xp: 0,
        xp_required_next_level: LEVEL_CONFIG.XP_PER_LEVEL,
        tier: 'BRONZE',
        badges: JSON.stringify([]),
        current_streak: 0,
        max_streak: 0,
        daily_reward_claimed: false,
        daily_reward_last_claimed: null,
        consecutive_days: 0
      }
    });

    const xpBefore = userLevel.current_xp;
    const levelBefore = userLevel.current_level;
    let currentXP = xpBefore + xpAmount;
    let currentLevel = levelBefore;
    let newLevelUp = false;

    // Handle level ups
    while (currentXP >= userLevel.xp_required_next_level && currentLevel < LEVEL_CONFIG.MAX_LEVEL) {
      currentXP -= userLevel.xp_required_next_level;
      currentLevel += 1;
      newLevelUp = true;

      // Calculate XP for next level (increases per level)
      const nextLevelXP = Math.round(LEVEL_CONFIG.XP_PER_LEVEL * (1 + currentLevel * 0.05));

      console.log(`🆙 Level UP! User ${userId}: Level ${levelBefore} → ${currentLevel}`);

      // TODO: Send notification email
      // TODO: Award badge if milestone (level 10, 25, 50, 100)
    }

    // Determine tier
    let newTier = 'BRONZE';
    for (const [tier, range] of Object.entries(LEVEL_CONFIG.TIER_THRESHOLDS)) {
      if (currentLevel >= range.min && currentLevel <= range.max) {
        newTier = tier;
        break;
      }
    }

    // Update user level
    const xpNextLevel = Math.round(LEVEL_CONFIG.XP_PER_LEVEL * (1 + currentLevel * 0.05));
    await userLevel.update({
      current_level: Math.min(currentLevel, LEVEL_CONFIG.MAX_LEVEL),
      current_xp: currentXP,
      total_xp: userLevel.total_xp + xpAmount,
      xp_required_next_level: xpNextLevel,
      tier: newTier,
      updated_at: new Date()
    });

    // Log XP award
    console.log(`⭐ Awarded ${xpAmount} XP to user ${userId} (source: ${source})`);

    return {
      userId,
      xpAwarded: xpAmount,
      newLevel: currentLevel,
      leveledUp: newLevelUp,
      currentXP: currentXP,
      tier: newTier,
      total_xp: userLevel.total_xp + xpAmount
    };
  } catch (err) {
    console.error('Error awarding XP:', err);
    return null;
  }
}

/**
 * Claim daily reward (once per 24 hours)
 * Increases streak if consecutive, resets if gap
 */
async function claimDailyReward(userId) {
  try {
    const userLevel = await UserLevel.findOne({ where: { user_id: userId } });

    if (!userLevel) {
      return { success: false, message: 'User level not found' };
    }

    const now = new Date();

    // Check if already claimed today
    if (userLevel.daily_reward_claimed) {
      const lastClaimed = new Date(userLevel.daily_reward_last_claimed);
      const hoursSinceLastClaim = (now - lastClaimed) / (1000 * 60 * 60);

      if (hoursSinceLastClaim < LEVEL_CONFIG.STREAK_RESET_HOURS) {
        return {
          success: false,
          message: `Already claimed today. Try again in ${Math.round(LEVEL_CONFIG.STREAK_RESET_HOURS - hoursSinceLastClaim)} hours`,
          nextClaimIn: Math.round(LEVEL_CONFIG.STREAK_RESET_HOURS - hoursSinceLastClaim)
        };
      }
    }

    // Check for streak continuity
    let newStreak = userLevel.current_streak + 1;
    const lastClaimed = userLevel.daily_reward_last_claimed;

    if (lastClaimed) {
      const timeSinceLastClaim = (now - new Date(lastClaimed)) / (1000 * 60 * 60);

      // If gap > 24 hours, reset streak
      if (timeSinceLastClaim > LEVEL_CONFIG.STREAK_RESET_HOURS + 1) {
        newStreak = 1;
        console.log(`🔄 Streak reset for user ${userId} (gap: ${Math.round(timeSinceLastClaim)}h)`);
      }
    } else {
      newStreak = 1;
    }

    // Calculate reward gold (bonus for streak)
    const baseReward = LEVEL_CONFIG.DAILY_REWARD_GOLD;
    const streakBonus = Math.floor((newStreak - 1) / 7) * 5000; // Bonus every 7 days
    const totalReward = baseReward + streakBonus;

    // Award XP
    const xpReward = 50 + (newStreak * 5); // XP bonus for streak too
    await awardXP(userId, xpReward, 'DAILY_LOGIN');

    // Award gold to wallet
    const wallet = await require('../models').Wallet.findOne({ where: { user_id: userId } });
    if (wallet) {
      await wallet.update({
        available_balance: wallet.available_balance + totalReward,
        total_balance: wallet.total_balance + totalReward,
        last_updated_at: now
      });

      // Log transaction
      await TransactionLedger.create({
        user_id: userId,
        transaction_type: 'DAILY_REWARD',
        amount: totalReward,
        balance_before: wallet.total_balance,
        balance_after: wallet.total_balance + totalReward,
        description: `Daily login reward (Day ${newStreak})`,
        created_by: 'system'
      });
    }

    // Update streak
    const maxStreak = Math.max(userLevel.max_streak, newStreak);
    await userLevel.update({
      daily_reward_claimed: true,
      daily_reward_last_claimed: now,
      current_streak: newStreak,
      max_streak: maxStreak,
      updated_at: now
    });

    console.log(`🎁 Daily reward claimed by user ${userId}: ${totalReward} gold + ${xpReward} XP (Streak: ${newStreak}/${maxStreak})`);

    return {
      success: true,
      reward: {
        gold: totalReward,
        xp: xpReward,
        streak: newStreak,
        maxStreak: maxStreak,
        baseReward,
        streakBonus
      }
    };
  } catch (err) {
    console.error('Error claiming daily reward:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get user's gamification status
 */
async function getUserStatus(userId) {
  try {
    const userLevel = await UserLevel.findOne({
      where: { user_id: userId },
      attributes: [
        'current_level',
        'current_xp',
        'total_xp',
        'xp_required_next_level',
        'tier',
        'badges',
        'current_streak',
        'max_streak',
        'daily_reward_claimed',
        'daily_reward_last_claimed',
        'consecutive_days'
      ]
    });

    if (!userLevel) {
      return {
        level: 1,
        xp: { current: 0, required: LEVEL_CONFIG.XP_PER_LEVEL, total: 0 },
        tier: 'BRONZE',
        streak: 0,
        maxStreak: 0,
        dailyRewardClaimed: false
      };
    }

    const xpProgress = Math.round((userLevel.current_xp / userLevel.xp_required_next_level) * 100);

    return {
      level: userLevel.current_level,
      xp: {
        current: userLevel.current_xp,
        required: userLevel.xp_required_next_level,
        total: userLevel.total_xp,
        progress_percent: xpProgress
      },
      tier: userLevel.tier,
      badges: JSON.parse(userLevel.badges || '[]'),
      streak: {
        current: userLevel.current_streak,
        max: userLevel.max_streak
      },
      dailyReward: {
        claimed: userLevel.daily_reward_claimed,
        lastClaimedAt: userLevel.daily_reward_last_claimed
      }
    };
  } catch (err) {
    console.error('Error getting user status:', err);
    return null;
  }
}

/**
 * Award badge to user
 */
async function awardBadge(userId, badgeId, badgeName) {
  try {
    const userLevel = await UserLevel.findOne({ where: { user_id: userId } });

    if (!userLevel) return false;

    const badges = JSON.parse(userLevel.badges || '[]');
    const badgeExists = badges.find(b => b.id === badgeId);

    if (!badgeExists) {
      badges.push({
        id: badgeId,
        name: badgeName,
        awardedAt: new Date(),
        rarity: 'normal'
      });

      await userLevel.update({
        badges: JSON.stringify(badges)
      });

      console.log(`🏅 Badge awarded to user ${userId}: ${badgeName}`);
      return true;
    }

    return false;
  } catch (err) {
    console.error('Error awarding badge:', err);
    return false;
  }
}

/**
 * Process game completion - award XP and check level up
 */
async function processGameCompletion(gameSession) {
  try {
    if (!gameSession || !gameSession.user_id) return null;

    // Calculate XP
    const xpReward = calculateGameXP(gameSession);

    // Award XP
    const result = await awardXP(gameSession.user_id, xpReward, 'GAME', gameSession.id);

    // Check for badges (milestone levels)
    if (result && result.leveledUp) {
      const milestones = [10, 25, 50, 75, 100];
      if (milestones.includes(result.newLevel)) {
        await awardBadge(
          gameSession.user_id,
          `LEVEL_${result.newLevel}`,
          `Reached Level ${result.newLevel}`
        );
      }
    }

    return result;
  } catch (err) {
    console.error('Error processing game completion:', err);
    return null;
  }
}

/**
 * Get leaderboard by tier
 */
async function getTierLeaderboard(tier = 'GOLD', limit = 50) {
  try {
    const leaderboard = await UserLevel.findAll({
      where: { tier: tier },
      attributes: ['user_id', 'current_level', 'total_xp', 'tier', 'current_streak'],
      order: [
        ['current_level', 'DESC'],
        ['total_xp', 'DESC']
      ],
      limit: limit,
      include: [
        {
          model: User,
          attributes: ['username'],
          required: true
        }
      ]
    });

    return leaderboard.map((ul, index) => ({
      rank: index + 1,
      username: ul.User.username,
      level: ul.current_level,
      totalXP: ul.total_xp,
      tier: ul.tier,
      streak: ul.current_streak
    }));
  } catch (err) {
    console.error('Error getting tier leaderboard:', err);
    return [];
  }
}

module.exports = {
  awardXP,
  claimDailyReward,
  getUserStatus,
  awardBadge,
  processGameCompletion,
  getTierLeaderboard,
  calculateGameXP,
  LEVEL_CONFIG
};
