/**
 * Migration 020: Create Leaderboard & User Level Tables
 * Gamification system: leaderboards, levels, XP, badges
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Leaderboard table
      await queryInterface.createTable(
        'leaderboards',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            references: { model: 'users', key: 'id' }
          },
          ranking_type: {
            type: Sequelize.ENUM(
              'TOTAL_WINNINGS',
              'GAMES_PLAYED',
              'GAMES_WON',
              'WITHDRAWALS',
              'HIGHEST_SINGLE_WIN',
              'WEEKLY',
              'MONTHLY'
            ),
            defaultValue: 'TOTAL_WINNINGS'
          },
          score: {
            type: Sequelize.BIGINT,
            defaultValue: 0
          },
          rank: Sequelize.INTEGER,
          total_games: { type: Sequelize.INTEGER, defaultValue: 0 },
          games_won: { type: Sequelize.INTEGER, defaultValue: 0 },
          win_rate: { type: Sequelize.FLOAT, defaultValue: 0 },
          total_withdrawn: { type: Sequelize.BIGINT, defaultValue: 0 },
          highest_single_win: { type: Sequelize.BIGINT, defaultValue: 0 },
          period_start: Sequelize.DATE,
          period_end: Sequelize.DATE,
          last_updated: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
          created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        },
        { transaction }
      );

      // User level table
      await queryInterface.createTable(
        'user_levels',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            references: { model: 'users', key: 'id' }
          },
          current_level: { type: Sequelize.INTEGER, defaultValue: 1 },
          current_xp: { type: Sequelize.INTEGER, defaultValue: 0 },
          xp_required_next_level: { type: Sequelize.INTEGER, defaultValue: 1000 },
          total_xp: { type: Sequelize.BIGINT, defaultValue: 0 },
          tier: {
            type: Sequelize.ENUM(
              'BRONZE',
              'SILVER',
              'GOLD',
              'PLATINUM',
              'DIAMOND',
              'LEGENDARY'
            ),
            defaultValue: 'BRONZE'
          },
          badges: { type: Sequelize.JSON, defaultValue: [] },
          current_streak: { type: Sequelize.INTEGER, defaultValue: 0 },
          max_streak: { type: Sequelize.INTEGER, defaultValue: 0 },
          last_play_date: Sequelize.DATE,
          daily_tasks_completed: { type: Sequelize.INTEGER, defaultValue: 0 },
          daily_reward_claimed: { type: Sequelize.BOOLEAN, defaultValue: false },
          daily_reward_last_claimed: Sequelize.DATE,
          consecutive_days: { type: Sequelize.INTEGER, defaultValue: 0 },
          created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        },
        { transaction }
      );

      // Indexes
      await queryInterface.addIndex('leaderboards', ['user_id', 'ranking_type'], { transaction });
      await queryInterface.addIndex('leaderboards', ['ranking_type', 'score'], { transaction });
      await queryInterface.addIndex('leaderboards', ['rank'], { transaction });
      await queryInterface.addIndex('user_levels', ['user_id'], { transaction });
      await queryInterface.addIndex('user_levels', ['current_level'], { transaction });
      await queryInterface.addIndex('user_levels', ['tier'], { transaction });
      await queryInterface.addIndex('user_levels', ['total_xp'], { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('leaderboards', { transaction });
      await queryInterface.dropTable('user_levels', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
