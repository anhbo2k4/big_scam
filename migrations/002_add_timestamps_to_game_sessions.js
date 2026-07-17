const { DataTypes } = require('sequelize');

module.exports = {
  up: async (sequelize) => {
    const transaction = await sequelize.transaction();
    try {
      // Add created_at column
      await sequelize.query(
        `ALTER TABLE game_sessions ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
        { transaction }
      );
      
      // Add updated_at column
      await sequelize.query(
        `ALTER TABLE game_sessions ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
        { transaction }
      );
      
      await transaction.commit();
      console.log('✓ Migration 002: Added timestamps to game_sessions');
    } catch (error) {
      await transaction.rollback();
      // Column might already exist
      if (error.message.includes('Duplicate column')) {
        console.log('✓ Migration 002: Columns already exist');
      } else {
        throw error;
      }
    }
  },

  down: async (sequelize) => {
    const transaction = await sequelize.transaction();
    try {
      await sequelize.query(
        `ALTER TABLE game_sessions DROP COLUMN created_at, DROP COLUMN updated_at`,
        { transaction }
      );
      await transaction.commit();
      console.log('✓ Migration 002 rolled back');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
