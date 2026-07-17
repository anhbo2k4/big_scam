'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add prize_info column
    try {
      await queryInterface.addColumn('gift_exchanges', 'prize_info', {
        type: Sequelize.JSON,
        allowNull: true
      });
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        throw error;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('gift_exchanges', 'prize_info');
    } catch (error) {
      if (!error.message.includes('Unknown column')) {
        throw error;
      }
    }
  }
};
