'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('player_inventory', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      session_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        index: true,
        comment: 'Game session code'
      },
      box_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Which box was opened (1, 2, or 3)'
      },
      prize_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Prize name'
      },
      prize_description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Prize description'
      },
      prize_icon: {
        type: Sequelize.STRING(50),
        defaultValue: '🎁',
        comment: 'Prize emoji/icon'
      },
      prize_image: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Prize image URL'
      },
      prize_value: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
        comment: 'Prize cash value'
      },
      is_cash: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Is this a cash prize?'
      },
      is_special: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Is this a special prize requiring approval?'
      },
      rarity: {
        type: Sequelize.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
        defaultValue: 'common',
        comment: 'Prize rarity level'
      },
      color_hex: {
        type: Sequelize.STRING(7),
        defaultValue: '#666666',
        comment: 'Prize color in hex'
      },
      status: {
        type: Sequelize.ENUM('obtained', 'claimed', 'converted', 'exchanged'),
        defaultValue: 'obtained',
        comment: 'Prize status'
      },
      claimed_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When prize was claimed'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create index for status (session_code already has index in column definition)
    try {
      await queryInterface.addIndex('player_inventory', ['status']);
    } catch (err) {
      // Index may already exist, silently continue
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('player_inventory');
  }
};
