/**
 * Migration 030: Initialize boxes_opened field for all game sessions
 * Ensures all existing game_sessions have boxes_opened JSON array initialized
 */

const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('⏳ Migration 030: Initializing boxes_opened for all game sessions...');
      
      // Check if boxes_opened column exists
      const table = await queryInterface.describeTable('game_sessions');
      if (!table.boxes_opened) {
        console.log('⚠️ boxes_opened column does not exist yet, skipping initialization');
        return;
      }

      // Update all game_sessions to have boxes_opened initialized if NULL
      await queryInterface.sequelize.query(`
        UPDATE game_sessions 
        SET boxes_opened = '[]'
        WHERE boxes_opened IS NULL OR boxes_opened = '' OR boxes_opened = 'null'
      `);
      
      console.log('✅ Migration 030 completed: boxes_opened initialized for all records');
    } catch (error) {
      console.error('⚠️ Migration 030 error:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      console.log('↩️ Reverting migration 030...');
      // No action needed on down for this initialization migration
      console.log('✅ Migration 030 reverted');
    } catch (error) {
      console.error('⚠️ Error reverting migration 030:', error.message);
    }
  }
};
