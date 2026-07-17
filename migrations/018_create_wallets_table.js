/**
 * Migration 018: Create Wallet Table
 * Establishes the financial center - wallet system with balance tracking
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Create wallets table
      await queryInterface.createTable(
        'wallets',
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
          total_balance: {
            type: Sequelize.BIGINT,
            defaultValue: 0,
            allowNull: false
          },
          available_balance: {
            type: Sequelize.BIGINT,
            defaultValue: 0,
            allowNull: false
          },
          pending_balance: {
            type: Sequelize.BIGINT,
            defaultValue: 0,
            allowNull: false
          },
          locked_balance: {
            type: Sequelize.BIGINT,
            defaultValue: 0,
            allowNull: false
          },
          last_updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
          },
          updated_by: Sequelize.STRING(100),
          version: {
            type: Sequelize.INTEGER,
            defaultValue: 1
          },
          integrity_hash: Sequelize.STRING(64),
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
          }
        },
        { transaction }
      );

      // Create indexes
      await queryInterface.addIndex('wallets', ['user_id'], { transaction });
      await queryInterface.addIndex('wallets', ['total_balance'], { transaction });
      await queryInterface.addIndex('wallets', ['available_balance'], { transaction });
      await queryInterface.addIndex('wallets', ['created_at'], { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('wallets');
  }
};
