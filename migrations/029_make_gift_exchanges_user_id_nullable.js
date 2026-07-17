'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sql = queryInterface.sequelize;
    const legacyFkName = 'fk_gift_exchanges_users';
    const targetFkName = 'fk_gift_exchanges_users_v2';

    try {
      // Disable foreign key checks temporarily
      await sql.query('SET FOREIGN_KEY_CHECKS = 0');
      console.log('Disabled foreign key checks');

      // Modify user_id column to be nullable
      await sql.query(`
        ALTER TABLE gift_exchanges 
        MODIFY COLUMN user_id INT NULL
      `);
      console.log('✓ Modified user_id column to be nullable');

      // Update constraint to allow NULL
      try {
        await sql.query(`ALTER TABLE gift_exchanges DROP FOREIGN KEY \`${legacyFkName}\``);
        console.log(`✓ Dropped existing FK constraint: ${legacyFkName}`);
      } catch (err) {
        console.log(`No existing FK to drop: ${legacyFkName}`);
      }

      try {
        await sql.query(`ALTER TABLE gift_exchanges DROP FOREIGN KEY \`${targetFkName}\``);
        console.log(`✓ Dropped existing FK constraint: ${targetFkName}`);
      } catch (err) {
        console.log(`No existing FK to drop: ${targetFkName}`);
      }

      const existing = await sql.query(`
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'gift_exchanges'
          AND REFERENCED_TABLE_NAME = 'users'
          AND COLUMN_NAME = 'user_id'
      `, { type: Sequelize.QueryTypes.SELECT });

      if (!existing || existing.length === 0) {
        await sql.query(`
          ALTER TABLE gift_exchanges 
          ADD CONSTRAINT \`${targetFkName}\` 
          FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) 
          ON DELETE SET NULL ON UPDATE CASCADE
        `);
        console.log(`✓ Added FK constraint with ON DELETE SET NULL: ${targetFkName}`);
      } else {
        console.log('✓ FK constraint already exists, skip add');
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
      
      try {
        await sql.query(`ALTER TABLE gift_exchanges DROP FOREIGN KEY \`fk_gift_exchanges_users_v2\``);
      } catch (e) {}
      try {
        await sql.query(`ALTER TABLE gift_exchanges DROP FOREIGN KEY \`fk_gift_exchanges_users\``);
      } catch (e) {}
      
      await sql.query(`
        ALTER TABLE gift_exchanges 
        MODIFY COLUMN user_id INT NOT NULL
      `);
      
      await sql.query(`
        ALTER TABLE gift_exchanges 
        ADD CONSTRAINT \`fk_gift_exchanges_users_v2\` 
        FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) 
        ON DELETE CASCADE ON UPDATE CASCADE
      `);
      
      await sql.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.log('Could not revert migration');
    }
  }
};
