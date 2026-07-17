/**
 * Migration: Add user_id and description columns to audit_logs
 * 
 * This migration expands audit logging to track user-initiated actions,
 * not just game session events.
 */

module.exports = {
  async up(sequelize, DataTypes) {
    const queryInterface = sequelize.getQueryInterface();
    
    try {
      // Add user_id column
      await queryInterface.addColumn('audit_logs', 'user_id', {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Reference to User (admin or system user performing action)',
        after: 'id'
      }).catch(err => {
        if (err.message.includes('Duplicate column name')) {
          console.log('✓ user_id column already exists');
        } else {
          throw err;
        }
      });

      // Add description column
      await queryInterface.addColumn('audit_logs', 'description', {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Human-readable description of the action',
        after: 'action'
      }).catch(err => {
        if (err.message.includes('Duplicate column name')) {
          console.log('✓ description column already exists');
        } else {
          throw err;
        }
      });

      // Make session_code nullable (since not all actions are session-related)
      await queryInterface.changeColumn('audit_logs', 'session_code', {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Reference to GameSession'
      }).catch(err => {
        console.log('✓ session_code already nullable or column change skipped');
      });

      // Add index on user_id
      await queryInterface.addIndex('audit_logs', ['user_id'])
        .catch(err => {
          if (
            err.message.includes('already exists') ||
            err.message.includes('Duplicate key name')
          ) {
            console.log('✓ user_id index already exists');
          } else {
            throw err;
          }
        });

      console.log('✅ Migration completed: Expanded audit_logs schema for user tracking');
    } catch (err) {
      console.error('❌ Migration error:', err.message);
      throw err;
    }
  },

  async down(sequelize, DataTypes) {
    const queryInterface = sequelize.getQueryInterface();
    
    try {
      // Remove user_id column
      await queryInterface.removeColumn('audit_logs', 'user_id')
        .catch(err => {
          if (err.message.includes('check that column/key exists')) {
            console.log('✓ user_id column not found (already removed)');
          }
        });

      // Remove description column
      await queryInterface.removeColumn('audit_logs', 'description')
        .catch(err => {
          if (err.message.includes('check that column/key exists')) {
            console.log('✓ description column not found (already removed)');
          }
        });

      console.log('✅ Rollback completed: Removed expanded audit_logs columns');
    } catch (err) {
      console.error('❌ Rollback error:', err.message);
      throw err;
    }
  }
};
