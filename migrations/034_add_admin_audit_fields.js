/**
 * Migration: Add admin audit tracking fields
 * - game_sessions.created_by (which admin created the session)
 * - users.created_by, users.updated_by (which admin created/updated the user)
 * - withdrawals.approved_by, withdrawals.rejected_by
 * - player_inventories.approved_by, player_inventories.rejected_by
 */
const db = require('../models');

async function up() {
  const qi = db.sequelize.queryInterface;

  const tables = {
    game_sessions: ['created_by'],
    users: ['created_by', 'updated_by', 'plain_password_enc'],
    withdrawals: ['approved_by', 'rejected_by'],
    player_inventory: ['approved_by', 'rejected_by']
  };

  for (const [table, fields] of Object.entries(tables)) {
    try {
      const columns = await qi.describeTable(table);
      for (const field of fields) {
        if (!columns[field]) {
          console.log(`⏳ Adding ${table}.${field}`);
          await qi.addColumn(table, field, {
            type: db.Sequelize.STRING,
            allowNull: true,
            defaultValue: null
          });
          console.log(`✅ Added ${table}.${field}`);
        }
      }
    } catch (err) {
      console.log(`⚠️ Table ${table} not found or error: ${err.message}`);
    }
  }
}

module.exports = { up };
