'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add foreign key constraint for user_id
    try {
      await queryInterface.addConstraint('gift_exchanges', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'fk_gift_exchanges_user_id',
        references: {
          table: 'users',
          field: 'id'
        },
        onDelete: 'CASCADE'
      });
    } catch (error) {
      console.log('user_id constraint may already exist');
    }

    // Add foreign key constraint for session_id
    try {
      await queryInterface.addConstraint('gift_exchanges', {
        fields: ['session_id'],
        type: 'foreign key',
        name: 'fk_gift_exchanges_session_id',
        references: {
          table: 'game_sessions',
          field: 'id'
        },
        onDelete: 'CASCADE'
      });
    } catch (error) {
      console.log('session_id constraint may already exist');
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint('gift_exchanges', 'fk_gift_exchanges_user_id');
    } catch (error) {
      console.log('Could not remove user_id constraint');
    }

    try {
      await queryInterface.removeConstraint('gift_exchanges', 'fk_gift_exchanges_session_id');
    } catch (error) {
      console.log('Could not remove session_id constraint');
    }
  }
};
