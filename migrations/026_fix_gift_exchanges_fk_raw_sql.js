'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Use raw SQL to fix the foreign key constraint
    const sequelize = queryInterface.sequelize;
    
    try {
      // Drop the old constraints first
      await sequelize.query(`
        ALTER TABLE gift_exchanges 
        DROP FOREIGN KEY gift_exchanges_ibfk_1
      `);
      console.log('Dropped old gift_exchanges_ibfk_1 constraint');
    } catch (error) {
      console.log('Could not drop gift_exchanges_ibfk_1:', error.message);
    }

    try {
      await sequelize.query(`
        ALTER TABLE gift_exchanges 
        DROP FOREIGN KEY gift_exchanges_ibfk_2
      `);
      console.log('Dropped old gift_exchanges_ibfk_2 constraint');
    } catch (error) {
      console.log('Could not drop gift_exchanges_ibfk_2:', error.message);
    }

    try {
      await sequelize.query(`
        ALTER TABLE gift_exchanges 
        DROP FOREIGN KEY fk_gift_exchanges_user_id
      `);
      console.log('Dropped old fk_gift_exchanges_user_id constraint');
    } catch (error) {
      console.log('Could not drop fk_gift_exchanges_user_id:', error.message);
    }

    try {
      await sequelize.query(`
        ALTER TABLE gift_exchanges 
        DROP FOREIGN KEY fk_gift_exchanges_session_id
      `);
      console.log('Dropped old fk_gift_exchanges_session_id constraint');
    } catch (error) {
      console.log('Could not drop fk_gift_exchanges_session_id:', error.message);
    }

    // Add correct foreign key constraints
    try {
      await sequelize.query(`
        ALTER TABLE gift_exchanges 
        ADD CONSTRAINT fk_gift_exchanges_user_id_correct 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      `);
      console.log('Added correct fk_gift_exchanges_user_id constraint');
    } catch (error) {
      console.log('Could not add user_id constraint:', error.message);
    }

    try {
      await sequelize.query(`
        ALTER TABLE gift_exchanges 
        ADD CONSTRAINT fk_gift_exchanges_session_id_correct 
        FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE
      `);
      console.log('Added correct fk_gift_exchanges_session_id constraint');
    } catch (error) {
      console.log('Could not add session_id constraint:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize;
    
    try {
      await sequelize.query(`
        ALTER TABLE gift_exchanges 
        DROP FOREIGN KEY fk_gift_exchanges_user_id_correct
      `);
    } catch (error) {
      console.log('Could not drop user_id constraint');
    }

    try {
      await sequelize.query(`
        ALTER TABLE gift_exchanges 
        DROP FOREIGN KEY fk_gift_exchanges_session_id_correct
      `);
    } catch (error) {
      console.log('Could not drop session_id constraint');
    }
  }
};
