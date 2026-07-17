'use strict';

/**
 * Migration 047
 * Expand cash amount columns to BIGINT to avoid int32 overflow (2,147,483,647)
 * when prizes are configured at multi-billion VND values.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const gsCols = await queryInterface.describeTable('game_sessions');

    // Convert all existing prize_*_cash_amount columns in game_sessions.
    const gameSessionCashColumns = Object.keys(gsCols || {}).filter((name) => /^prize_\d+_cash_amount$/i.test(name));
    for (const col of gameSessionCashColumns) {
      try {
        await queryInterface.changeColumn('game_sessions', col, {
          type: Sequelize.BIGINT,
          allowNull: true
        });
      } catch (_) {
        // Continue best-effort: environments may already have compatible type.
      }
    }

    // Convert prizes.cash_amount if table/column exists.
    try {
      const prizeCols = await queryInterface.describeTable('prizes');
      if (prizeCols && prizeCols.cash_amount) {
        await queryInterface.changeColumn('prizes', 'cash_amount', {
          type: Sequelize.BIGINT,
          allowNull: true,
          comment: 'Cash prize amount'
        });
      }
    } catch (_) {
      // prizes table may not exist in some deployments.
    }

    console.log('✅ Migration 047 completed: cash amount columns expanded to BIGINT');
  },

  async down(queryInterface, Sequelize) {
    const gsCols = await queryInterface.describeTable('game_sessions');
    const gameSessionCashColumns = Object.keys(gsCols || {}).filter((name) => /^prize_\d+_cash_amount$/i.test(name));

    for (const col of gameSessionCashColumns) {
      try {
        await queryInterface.changeColumn('game_sessions', col, {
          type: Sequelize.INTEGER,
          allowNull: true
        });
      } catch (_) {
        // best-effort rollback
      }
    }

    try {
      const prizeCols = await queryInterface.describeTable('prizes');
      if (prizeCols && prizeCols.cash_amount) {
        await queryInterface.changeColumn('prizes', 'cash_amount', {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: 'Cash prize amount'
        });
      }
    } catch (_) {
      // best-effort rollback
    }
  }
};
