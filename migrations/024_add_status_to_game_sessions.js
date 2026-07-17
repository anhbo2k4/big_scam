module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔧 Migration 024: Adding status column to game_sessions table...');
    try {
      const columns = await queryInterface.describeTable('game_sessions');
      
      if (!columns.status) {
        await queryInterface.addColumn('game_sessions', 'status', {
          type: Sequelize.ENUM('active', 'paused'),
          defaultValue: 'active',
          comment: 'Session pause/resume status'
        });
        console.log('✅ Status column added successfully');
      } else {
        console.log('⚠️ Status column already exists, skipping');
      }
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('⚠️ Status column already exists, skipping');
      } else {
        throw err;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('🔧 Migration 024 rollback: Removing status column...');
    try {
      await queryInterface.removeColumn('game_sessions', 'status');
      console.log('✅ Status column removed');
    } catch (err) {
      console.log('⚠️ Could not remove status column:', err.message);
    }
  }
};
