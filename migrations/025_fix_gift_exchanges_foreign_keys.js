'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fix the foreign key constraint for user_id - drop and recreate with correct table name
    try {
      await queryInterface.removeConstraint('gift_exchanges', 'gift_exchanges_ibfk_1');
      console.log('Removed old constraint gift_exchanges_ibfk_1');
    } catch (error) {
      console.log('Could not remove gift_exchanges_ibfk_1:', error.message);
    }

    try {
      await queryInterface.removeConstraint('gift_exchanges', 'fk_gift_exchanges_user_id');
      console.log('Removed old constraint fk_gift_exchanges_user_id');
    } catch (error) {
      console.log('Could not remove fk_gift_exchanges_user_id:', error.message);
    }

    // Add the correct foreign key constraint with lowercase table name
    try {
      await queryInterface.addConstraint('gift_exchanges', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'fk_gift_exchanges_user_id_fixed',
        references: {
          table: 'users',  // lowercase as per User model
          field: 'id'
        },
        onDelete: 'CASCADE'
      });
      console.log('Added correct foreign key constraint for user_id');
    } catch (error) {
      console.log('Could not add user_id constraint:', error.message);
    }

    // Fix session_id constraint too
    try {
      await queryInterface.removeConstraint('gift_exchanges', 'gift_exchanges_ibfk_2');
      console.log('Removed old constraint gift_exchanges_ibfk_2');
    } catch (error) {
      console.log('Could not remove gift_exchanges_ibfk_2:', error.message);
    }

    try {
      await queryInterface.removeConstraint('gift_exchanges', 'fk_gift_exchanges_session_id');
      console.log('Removed old constraint fk_gift_exchanges_session_id');
    } catch (error) {
      console.log('Could not remove fk_gift_exchanges_session_id:', error.message);
    }

    try {
      await queryInterface.addConstraint('gift_exchanges', {
        fields: ['session_id'],
        type: 'foreign key',
        name: 'fk_gift_exchanges_session_id_fixed',
        references: {
          table: 'game_sessions',  // as per GameSession model
          field: 'id'
        },
        onDelete: 'CASCADE'
      });
      console.log('Added correct foreign key constraint for session_id');
    } catch (error) {
      console.log('Could not add session_id constraint:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to old constraints if needed
    try {
      await queryInterface.removeConstraint('gift_exchanges', 'fk_gift_exchanges_user_id_fixed');
    } catch (error) {
      console.log('Could not remove fk_gift_exchanges_user_id_fixed');
    }

    try {
      await queryInterface.removeConstraint('gift_exchanges', 'fk_gift_exchanges_session_id_fixed');
    } catch (error) {
      console.log('Could not remove fk_gift_exchanges_session_id_fixed');
    }
  }
};
