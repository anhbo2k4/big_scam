/**
 * Migration 019: Create Transaction Ledger Table
 * CRITICAL: Append-only ledger for audit trail
 * Every money movement recorded here
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'transaction_ledger',
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' }
          },
          transaction_type: {
            type: Sequelize.ENUM(
              'GAME_WIN',
              'GAME_LOSS',
              'PRIZE_DRAWN',
              'PRIZE_CONVERTED',
              'WITHDRAWAL_REQUEST',
              'WITHDRAWAL_APPROVED',
              'WITHDRAWAL_REJECTED',
              'WITHDRAWAL_PAID',
              'ADMIN_ADJUSTMENT',
              'REFERRAL_BONUS',
              'DAILY_REWARD',
              'LEVEL_UP_REWARD',
              'PROMOTION',
              'REFUND',
              'CHARGEBACK',
              'LOCKED_HOLD',
              'LOCKED_RELEASE'
            ),
            allowNull: false
          },
          amount: {
            type: Sequelize.BIGINT,
            allowNull: false
          },
          balance_before: {
            type: Sequelize.BIGINT,
            allowNull: false
          },
          balance_after: {
            type: Sequelize.BIGINT,
            allowNull: false
          },
          available_before: Sequelize.BIGINT,
          available_after: Sequelize.BIGINT,
          pending_before: Sequelize.BIGINT,
          pending_after: Sequelize.BIGINT,
          locked_before: Sequelize.BIGINT,
          locked_after: Sequelize.BIGINT,
          game_session_id: Sequelize.INTEGER,
          withdrawal_id: Sequelize.INTEGER,
          prize_id: Sequelize.INTEGER,
          description: Sequelize.TEXT,
          metadata: { type: Sequelize.JSON, defaultValue: {} },
          created_by: Sequelize.STRING(100),
          ip_address: Sequelize.STRING,
          user_agent: Sequelize.TEXT,
          transaction_hash: Sequelize.STRING(64),
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
          }
        },
        { transaction }
      );

      // Indexes for performance
      await queryInterface.addIndex('transaction_ledger', ['user_id'], { transaction });
      await queryInterface.addIndex('transaction_ledger', ['transaction_type'], { transaction });
      await queryInterface.addIndex('transaction_ledger', ['game_session_id'], { transaction });
      await queryInterface.addIndex('transaction_ledger', ['withdrawal_id'], { transaction });
      await queryInterface.addIndex('transaction_ledger', ['created_at'], { transaction });
      await queryInterface.addIndex('transaction_ledger', ['user_id', 'created_at'], { transaction });
      await queryInterface.addIndex('transaction_ledger', ['transaction_type', 'created_at'], { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transaction_ledger');
  }
};
