'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if column exists before adding
      const tableDescription = await queryInterface.describeTable('game_sessions');
      
      if (!tableDescription.selected_prize) {
        await queryInterface.addColumn('game_sessions', 'selected_prize', {
          type: Sequelize.STRING,
          allowNull: true,
          comment: 'Name of the prize selected by player'
        });
        console.log('✅ Added selected_prize column');
      }

      if (!tableDescription.selected_box_number) {
        await queryInterface.addColumn('game_sessions', 'selected_box_number', {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: 'Which box was selected (1, 2, or 3)'
        });
        console.log('✅ Added selected_box_number column');
      }

      if (!tableDescription.prize_accepted_at) {
        await queryInterface.addColumn('game_sessions', 'prize_accepted_at', {
          type: Sequelize.DATE,
          allowNull: true,
          comment: 'When the player accepted the prize'
        });
        console.log('✅ Added prize_accepted_at column');
      }

      console.log('✅ Migration 008 completed successfully');
    } catch (err) {
      console.error('❌ Migration 008 error:', err.message);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      const tableDescription = await queryInterface.describeTable('game_sessions');
      
      if (tableDescription.selected_prize) {
        await queryInterface.removeColumn('game_sessions', 'selected_prize');
      }
      if (tableDescription.selected_box_number) {
        await queryInterface.removeColumn('game_sessions', 'selected_box_number');
      }
      if (tableDescription.prize_accepted_at) {
        await queryInterface.removeColumn('game_sessions', 'prize_accepted_at');
      }
      
      console.log('✅ Migration 008 rolled back');
    } catch (err) {
      console.error('❌ Migration 008 rollback error:', err.message);
      throw err;
    }
  }
};
