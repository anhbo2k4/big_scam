'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sql = queryInterface.sequelize;
    
    try {
      // First, let's see what tables exist and what constraints are on gift_exchanges
      const tables = await sql.query(`
        SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME IN ('user', 'users', 'User', 'Users')
      `, { type: Sequelize.QueryTypes.SELECT });
      
      console.log('Available user tables:', tables);
      
      // Get current constraints on gift_exchanges
      const constraints = await sql.query(`
        SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_NAME = 'gift_exchanges' AND TABLE_SCHEMA = DATABASE()
      `, { type: Sequelize.QueryTypes.SELECT });
      
      console.log('Current gift_exchanges constraints:', constraints);
      
    } catch (error) {
      console.error('Error checking database:', error.message);
    }

    try {
      // Try to drop all possible constraint names
      const constraintNames = [
        'gift_exchanges_ibfk_1',
        'gift_exchanges_ibfk_2',
        'fk_gift_exchanges_user_id',
        'fk_gift_exchanges_session_id',
        'fk_gift_exchanges_user_id_correct',
        'fk_gift_exchanges_session_id_correct',
        'fk_gift_exchanges_user_id_fixed',
        'fk_gift_exchanges_session_id_fixed'
      ];

      for (const constraintName of constraintNames) {
        try {
          await sql.query(`ALTER TABLE gift_exchanges DROP FOREIGN KEY ${constraintName}`);
          console.log(`Dropped constraint: ${constraintName}`);
        } catch (e) {
          // Constraint doesn't exist, continue
        }
      }

      // Now add the correct constraint with 'users' table
      await sql.query(`
        ALTER TABLE gift_exchanges 
        ADD CONSTRAINT fk_gift_exchanges_user_final 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      `);
      console.log('Added correct user_id constraint referencing users table');

      // Add session constraint
      await sql.query(`
        ALTER TABLE gift_exchanges 
        ADD CONSTRAINT fk_gift_exchanges_session_final 
        FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE
      `);
      console.log('Added correct session_id constraint');

    } catch (error) {
      console.error('Error fixing constraints:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const sql = queryInterface.sequelize;
    try {
      await sql.query(`ALTER TABLE gift_exchanges DROP FOREIGN KEY fk_gift_exchanges_user_final`);
      await sql.query(`ALTER TABLE gift_exchanges DROP FOREIGN KEY fk_gift_exchanges_session_final`);
    } catch (error) {
      console.log('Could not drop constraints');
    }
  }
};
