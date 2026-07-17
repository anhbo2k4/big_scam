/**
 * User Level & XP Model
 * Tracks player progression with levels and experience points
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserLevel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },

    // Levels (0-100 max)
    current_level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1, max: 100 },
      comment: 'Current level (1-100)'
    },

    // XP System
    current_xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'XP in current level'
    },

    xp_required_next_level: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
      comment: 'XP needed to reach next level'
    },

    total_xp: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: 'Lifetime total XP'
    },

    // Level Names / Tiers
    tier: {
      type: DataTypes.ENUM(
        'BRONZE',        // Levels 1-20
        'SILVER',        // Levels 21-40
        'GOLD',          // Levels 41-60
        'PLATINUM',      // Levels 61-80
        'DIAMOND',       // Levels 81-100
        'LEGENDARY'      // Special achievement
      ),
      defaultValue: 'BRONZE'
    },

    // Badges / Achievements
    badges: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of earned badge IDs'
    },

    // Streaks
    current_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Current play/win streak'
    },

    max_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Best streak ever'
    },

    last_play_date: {
      type: DataTypes.DATE,
      comment: 'Last time played (for streak tracking)'
    },

    // Daily rewards tracking
    daily_tasks_completed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Tasks completed today'
    },

    daily_reward_claimed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Already claimed daily reward today'
    },

    daily_reward_last_claimed: {
      type: DataTypes.DATE,
      comment: 'When daily reward was last claimed'
    },

    consecutive_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Consecutive days of login/play'
    }
  }, {
    tableName: 'user_levels',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['current_level'] },
      { fields: ['tier'] },
      { fields: ['total_xp'], order: [['total_xp', 'DESC']] },
      { fields: ['current_streak'] }
    ]
  })
}
