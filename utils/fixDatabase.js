const db = require('../models');

const fixDatabase = async () => {
  try {
    console.log('Fixing database columns...');
    
    // Get game_sessions table columns and add missing security fields
    const gameSessionsColumns = await db.sequelize.queryInterface.describeTable('game_sessions');
    
    const gameSessionsFieldsToAdd = [
      { name: 'server_random_boxes', type: db.Sequelize.JSON, allowNull: true },
      { name: 'player_token', type: db.Sequelize.STRING(64), allowNull: true },
      { name: 'result_hash', type: db.Sequelize.STRING(64), allowNull: true },
      { name: 'server_random_seed', type: db.Sequelize.STRING(128), allowNull: true },
      { name: 'game_type', type: db.Sequelize.ENUM('boxes', 'wheel', 'scratch', 'mystery', 'gacha', 'dice', 'cards'), allowNull: true, defaultValue: 'boxes' },
      { name: 'box_count', type: db.Sequelize.INTEGER, allowNull: true, defaultValue: 3 }
    ];

    for (const field of gameSessionsFieldsToAdd) {
      if (!gameSessionsColumns[field.name]) {
        console.log(`Adding ${field.name} column to game_sessions...`);
        try {
          await db.sequelize.queryInterface.addColumn('game_sessions', field.name, {
            type: field.type,
            allowNull: field.allowNull,
            defaultValue: field.defaultValue
          });
          console.log(`✓ ${field.name} column added`);
        } catch (addErr) {
          if (addErr.sqlState === '42S21') {
            // Column already exists, skip
            console.log(`⚠️ ${field.name} already exists, skipping`);
          } else {
            throw addErr;
          }
        }
      }
    }
    
    // Get withdrawals table columns
    const withdrawalsColumns = await db.sequelize.queryInterface.describeTable('withdrawals');

    if (withdrawalsColumns.user_id && withdrawalsColumns.user_id.allowNull === false) {
      console.log('Updating withdrawals.user_id to allow NULL (session-based withdrawals)...');
      try {
        await db.sequelize.queryInterface.changeColumn('withdrawals', 'user_id', {
          type: db.Sequelize.INTEGER,
          allowNull: true
        });
        console.log('✓ withdrawals.user_id now allows NULL');
      } catch (userIdErr) {
        console.log('⚠️ Failed to update withdrawals.user_id nullability:', userIdErr.message);
      }
    }
    
    if (!withdrawalsColumns.notes) {
      console.log('Adding notes column to withdrawals...');
      await db.sequelize.queryInterface.addColumn('withdrawals', 'notes', {
        type: db.Sequelize.TEXT,
        allowNull: true
      });
      console.log('✓ notes column added');
    }
    
    if (!withdrawalsColumns.rejection_reason) {
      console.log('Adding rejection_reason column to withdrawals...');
      await db.sequelize.queryInterface.addColumn('withdrawals', 'rejection_reason', {
        type: db.Sequelize.TEXT,
        allowNull: true
      });
      console.log('✓ rejection_reason column added');
    }
    
    // Get gift_exchanges table columns
    const giftExchangesColumns = await db.sequelize.queryInterface.describeTable('gift_exchanges');
    
    if (!giftExchangesColumns.prize_info) {
      console.log('Adding prize_info column to gift_exchanges...');
      await db.sequelize.queryInterface.addColumn('gift_exchanges', 'prize_info', {
        type: db.Sequelize.JSON,
        allowNull: true
      });
      console.log('✓ prize_info column added');
    }
    
    // Get audit_logs table columns and add tracking fields if needed
    const auditLogsColumns = await db.sequelize.queryInterface.describeTable('audit_logs');
    
    if (!auditLogsColumns.user_id) {
      console.log('Adding user_id column to audit_logs...');
      try {
        await db.sequelize.queryInterface.addColumn('audit_logs', 'user_id', {
          type: db.Sequelize.INTEGER,
          allowNull: true
        });
        console.log('✓ user_id column added');
        
        // Add index after column is created
        try {
          await db.sequelize.queryInterface.addIndex('audit_logs', ['user_id']);
          console.log('✓ user_id index created');
        } catch (indexErr) {
          console.log('⚠️ user_id index creation skipped:', indexErr.message);
        }
      } catch (colErr) {
        console.log('⚠️ user_id column skipped:', colErr.message);
      }
    }
    
    if (!auditLogsColumns.description) {
      console.log('Adding description column to audit_logs...');
      try {
        await db.sequelize.queryInterface.addColumn('audit_logs', 'description', {
          type: db.Sequelize.TEXT,
          allowNull: true
        });
        console.log('✓ description column added');
      } catch (descErr) {
        console.log('⚠️ description column skipped:', descErr.message);
      }
    }
    
    // Fix player_inventory.status column: ENUM → VARCHAR(30) for new statuses
    try {
      const piCols = await db.sequelize.queryInterface.describeTable('player_inventory');
      if (piCols.status && piCols.status.type && piCols.status.type.startsWith('ENUM')) {
        console.log('Altering player_inventory.status from ENUM to VARCHAR(30)...');
        await db.sequelize.query("ALTER TABLE player_inventory MODIFY COLUMN status VARCHAR(30) DEFAULT 'obtained'");
        console.log('✓ player_inventory.status altered to VARCHAR(30)');
      }
    } catch (piErr) {
      // Table may not exist yet, skip silently
    }

    console.log('Database fix complete ✅');
  } catch (error) {
    console.error('Error fixing database:', error.message);
    throw error;
  }
};

module.exports = fixDatabase;
