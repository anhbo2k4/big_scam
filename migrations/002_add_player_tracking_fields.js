module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Add new columns to game_sessions table
      await queryInterface.addColumn('game_sessions', 'player_selected_box', {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Which box player selected (1, 2, or 3)'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'player_selected_at', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When player selected a box'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'player_name', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Player name from form submission'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'player_phone', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Player phone number'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'player_email', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Player email address'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'player_viewed_at', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When player first opened the session'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'selected_prize_details', {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Snapshot of selected prize info'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'box_selection_event', {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Event details like IP, user agent, etc'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'is_form_submitted', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether form was submitted'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'form_submitted_at', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When form was submitted'
      }, { transaction });

      await transaction.commit();
      console.log('✅ Migration 002 completed: Added player tracking fields');
    } catch (err) {
      await transaction.rollback();
      console.error('❌ Migration 002 failed:', err);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('game_sessions', 'player_selected_box', { transaction });
      await queryInterface.removeColumn('game_sessions', 'player_selected_at', { transaction });
      await queryInterface.removeColumn('game_sessions', 'player_name', { transaction });
      await queryInterface.removeColumn('game_sessions', 'player_phone', { transaction });
      await queryInterface.removeColumn('game_sessions', 'player_email', { transaction });
      await queryInterface.removeColumn('game_sessions', 'player_viewed_at', { transaction });
      await queryInterface.removeColumn('game_sessions', 'selected_prize_details', { transaction });
      await queryInterface.removeColumn('game_sessions', 'box_selection_event', { transaction });
      await queryInterface.removeColumn('game_sessions', 'is_form_submitted', { transaction });
      await queryInterface.removeColumn('game_sessions', 'form_submitted_at', { transaction });
      
      await transaction.commit();
      console.log('✅ Migration 002 rollback completed');
    } catch (err) {
      await transaction.rollback();
      console.error('❌ Migration 002 rollback failed:', err);
      throw err;
    }
  }
};
