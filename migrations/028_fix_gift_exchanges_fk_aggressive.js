'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sql = queryInterface.sequelize;
    const userFkName = 'fk_gift_exchanges_users_v2';
    const sessionFkName = 'fk_gift_exchanges_game_sessions_v2';

    try {
      // Disable foreign key checks temporarily
      await sql.query('SET FOREIGN_KEY_CHECKS = 0');
      console.log('Disabled foreign key checks');

      // Drop all existing constraints on gift_exchanges
      const allConstraints = [
        'gift_exchanges_ibfk_1',
        'gift_exchanges_ibfk_2',
        'fk_gift_exchanges_user_id',
        'fk_gift_exchanges_session_id',
        'fk_gift_exchanges_user_id_correct',
        'fk_gift_exchanges_session_id_correct',
        'fk_gift_exchanges_user_id_fixed',
        'fk_gift_exchanges_session_id_fixed',
        'fk_gift_exchanges_user_final',
        'fk_gift_exchanges_session_final',
        'fk_gift_exchanges_users',
        'fk_gift_exchanges_game_sessions',
        userFkName,
        sessionFkName
      ];

      for (const constraintName of allConstraints) {
        try {
          await sql.query(`ALTER TABLE gift_exchanges DROP FOREIGN KEY \`${constraintName}\``);
          console.log(`✓ Dropped constraint: ${constraintName}`);
        } catch (err) {
          // Silently skip if constraint doesn't exist
        }
      }

      const existingUserFk = await sql.query(`
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'gift_exchanges'
          AND REFERENCED_TABLE_NAME = 'users'
          AND COLUMN_NAME = 'user_id'
      `, { type: Sequelize.QueryTypes.SELECT });

      if (!existingUserFk || existingUserFk.length === 0) {
        await sql.query(`
          ALTER TABLE gift_exchanges 
          ADD CONSTRAINT \`${userFkName}\` 
          FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);
        console.log(`✓ Added constraint: ${userFkName}`);
      } else {
        console.log('✓ user_id FK already exists, skip add');
      }

      const existingSessionFk = await sql.query(`
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'gift_exchanges'
          AND REFERENCED_TABLE_NAME = 'game_sessions'
          AND COLUMN_NAME = 'session_id'
      `, { type: Sequelize.QueryTypes.SELECT });

      if (!existingSessionFk || existingSessionFk.length === 0) {
        await sql.query(`
          ALTER TABLE gift_exchanges 
          ADD CONSTRAINT \`${sessionFkName}\` 
          FOREIGN KEY (\`session_id\`) REFERENCES \`game_sessions\`(\`id\`) 
          ON DELETE CASCADE ON UPDATE CASCADE
        `);
        console.log(`✓ Added constraint: ${sessionFkName}`);
      } else {
        console.log('✓ session_id FK already exists, skip add');
      }

      // Re-enable foreign key checks
      await sql.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('✓ Re-enabled foreign key checks');

    } catch (error) {
      console.error('❌ Error in migration:', error.message);
      try {
        await sql.query('SET FOREIGN_KEY_CHECKS = 1');
      } catch (e) {}
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const sql = queryInterface.sequelize;
    try {
      await sql.query('SET FOREIGN_KEY_CHECKS = 0');
      await sql.query(`ALTER TABLE gift_exchanges DROP FOREIGN KEY \`fk_gift_exchanges_users_v2\``);
      await sql.query(`ALTER TABLE gift_exchanges DROP FOREIGN KEY \`fk_gift_exchanges_game_sessions_v2\``);
      await sql.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.log('Could not revert migration');
    }
  }
};
