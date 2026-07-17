module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      const columns = await queryInterface.describeTable('game_sessions');

      // Add analytics/performance fields
      if (!columns.completion_time_seconds) {
        await queryInterface.addColumn('game_sessions', 'completion_time_seconds', {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: 'How long it took to complete the session'
        }, { transaction });
        console.log('✓ Added completion_time_seconds column');
      }

      await transaction.commit();
      console.log('✅ Migration 016: Added remaining columns');
    } catch (err) {
      await transaction.rollback();
      console.error('❌ Migration 016 error:', err.message);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      const columns = await queryInterface.describeTable('game_sessions');

      if (columns.completion_time_seconds) {
        await queryInterface.removeColumn('game_sessions', 'completion_time_seconds', { transaction });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
