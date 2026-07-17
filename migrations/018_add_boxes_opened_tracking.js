'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn(
        'game_sessions',
        'boxes_opened',
        {
          type: Sequelize.JSON,
          defaultValue: [],
          comment: 'Array of box numbers that have been opened (e.g., [1, 2])'
        }
      );
      console.log('✅ Added boxes_opened column to game_sessions');
    } catch (err) {
      // Column might already exist
      if (err.message.includes('duplicate column')) {
        console.log('⚠️ boxes_opened column already exists');
      } else {
        throw err;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('game_sessions', 'boxes_opened');
      console.log('✅ Removed boxes_opened column from game_sessions');
    } catch (err) {
      console.log('⚠️ Error removing column:', err.message);
    }
  }
};
