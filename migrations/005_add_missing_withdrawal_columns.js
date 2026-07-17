'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add notes column
    try {
      await queryInterface.addColumn('withdrawals', 'notes', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    } catch (error) {
      if (!error.message.includes('Duplicate column name')) {
        throw error;
      }
    }
    
    // Add rejection_reason column
    try {
      await queryInterface.addColumn('withdrawals', 'rejection_reason', {
        type: Sequelize.TEXT,
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
      await queryInterface.removeColumn('withdrawals', 'notes');
    } catch (error) {
      if (!error.message.includes('Unknown column')) {
        throw error;
      }
    }
    
    try {
      await queryInterface.removeColumn('withdrawals', 'rejection_reason');
    } catch (error) {
      if (!error.message.includes('Unknown column')) {
        throw error;
      }
    }
  }
};
