'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('gift_exchanges', {
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
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'game_sessions',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      recipient_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      prize_info: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Stores prize information as JSON'
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

    // Create indexes for faster queries
    await queryInterface.addIndex('gift_exchanges', ['user_id']);
    await queryInterface.addIndex('gift_exchanges', ['status']);
    await queryInterface.addIndex('gift_exchanges', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('gift_exchanges');
  }
};
