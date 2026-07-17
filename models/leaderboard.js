/**
 * Leaderboard Model
 * Real-time leaderboard tracking
 * Updated on each event (game win, withdrawal, etc)
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Leaderboard', {
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

    // Leaderboard types
    ranking_type: {
      type: DataTypes.ENUM(
        'TOTAL_WINNINGS',      // Most money won
        'GAMES_PLAYED',        // Most games
        'GAMES_WON',           // Win rate focused
        'WITHDRAWALS',         // Most withdrawn
        'HIGHEST_SINGLE_WIN',  // Single biggest win
        'WEEKLY',              // This week's top players
        'MONTHLY'              // This month's top players
      ),
      defaultValue: 'TOTAL_WINNINGS'
    },

    // Score based on type
    score: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: 'Points for this leaderboard type'
    },

    // Ranking position (auto-calculated)
    rank: {
      type: DataTypes.INTEGER,
      comment: 'Current rank (1 = 1st place)'
    },

    // Additional stats
    total_games: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    games_won: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    win_rate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      comment: 'Win rate percentage (0-100)'
    },

    total_withdrawn: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: 'Total amount withdrawn'
    },

    highest_single_win: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      comment: 'Largest single game win'
    },

    // Time period (for weekly/monthly boards)
    period_start: {
      type: DataTypes.DATE,
      comment: 'Start of period for time-based leaderboards'
    },

    period_end: {
      type: DataTypes.DATE,
      comment: 'End of period'
    },

    // Update tracking
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'leaderboards',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id', 'ranking_type'] },
      { fields: ['ranking_type', 'score'], order: [['score', 'DESC']] },
      { fields: ['rank'] },
      { fields: ['period_start'] }
    ]
  })
}
