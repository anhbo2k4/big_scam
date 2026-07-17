'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('withdrawals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      bank_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      account_number: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      account_holder: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create index for faster queries
    await queryInterface.addIndex('withdrawals', ['user_id']);
    await queryInterface.addIndex('withdrawals', ['status']);
    await queryInterface.addIndex('withdrawals', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('withdrawals');
  }
};
