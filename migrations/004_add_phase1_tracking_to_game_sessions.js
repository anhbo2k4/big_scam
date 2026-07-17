module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Add Phase 1 columns to game_sessions table (real-time box tracking)
      const gameSessionColumns = [
        { name: 'player_selected_box', type: Sequelize.INTEGER, allowNull: true },
        { name: 'player_selected_at', type: Sequelize.DATE, allowNull: true },
        { name: 'player_name', type: Sequelize.STRING, allowNull: true },
        { name: 'player_phone', type: Sequelize.STRING, allowNull: true },
        { name: 'player_email', type: Sequelize.STRING, allowNull: true },
        { name: 'player_viewed_at', type: Sequelize.DATE, allowNull: true },
        { name: 'selected_prize_details', type: Sequelize.JSON, allowNull: true },
        { name: 'box_selection_event', type: Sequelize.JSON, allowNull: true },
        { name: 'is_form_submitted', type: Sequelize.BOOLEAN, defaultValue: false },
        { name: 'form_submitted_at', type: Sequelize.DATE, allowNull: true }
      ];

      for (const col of gameSessionColumns) {
        const columnExists = await queryInterface.describeTable('game_sessions', { transaction });
        if (!columnExists[col.name]) {
          await queryInterface.addColumn('game_sessions', col.name, {
            type: col.type,
            allowNull: col.allowNull || true,
            defaultValue: col.defaultValue || null
          }, { transaction });
        }
      }

      await transaction.commit();
      console.log('✅ Migration 004 completed: Added Phase 1 real-time tracking to game_sessions');
    } catch (err) {
      await transaction.rollback();
      console.error('❌ Migration 004 failed:', err);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const columns = ['player_selected_box', 'player_selected_at', 'player_name', 'player_phone', 'player_email', 'player_viewed_at', 'selected_prize_details', 'box_selection_event', 'is_form_submitted', 'form_submitted_at'];
      for (const col of columns) {
        const columnExists = await queryInterface.describeTable('game_sessions', { transaction });
        if (columnExists[col]) {
          await queryInterface.removeColumn('game_sessions', col, { transaction });
        }
      }

      await transaction.commit();
      console.log('✅ Migration 004 rollback completed');
    } catch (err) {
      await transaction.rollback();
      console.error('❌ Migration 004 rollback failed:', err);
      throw err;
    }
  }
};
