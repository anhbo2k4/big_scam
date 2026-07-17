/**
 * Migration 025: Add Browser Fingerprinting Fields
 * Adds security fields for session validation using IP + device fingerprint
 */

module.exports = {
  up: async (sequelize) => {
    const queryInterface = sequelize.getQueryInterface();
    
    try {
      // Check if columns already exist
      const table = await queryInterface.describeTable('GameSessions');
      
      const columnsToAdd = {};
      
      if (!table.browser_fingerprint) {
        columnsToAdd.browser_fingerprint = {
          type: sequelize.Sequelize.STRING(256),
          allowNull: true,
          comment: 'SHA256 hash of browser fingerprint'
        };
      }
      
      if (!table.device_info) {
        columnsToAdd.device_info = {
          type: sequelize.Sequelize.JSON,
          allowNull: true,
          comment: 'Device info: userAgent, acceptLanguage, acceptEncoding'
        };
      }
      
      if (!table.last_activity_ip) {
        columnsToAdd.last_activity_ip = {
          type: sequelize.Sequelize.STRING(45),
          allowNull: true,
          comment: 'Last IP address that accessed this session'
        };
      }
      
      if (!table.session_validated) {
        columnsToAdd.session_validated = {
          type: sequelize.Sequelize.BOOLEAN,
          defaultValue: false,
          comment: 'Whether session has been validated by fingerprint'
        };
      }
      
      if (!table.suspicious_activity) {
        columnsToAdd.suspicious_activity = {
          type: sequelize.Sequelize.JSON,
          allowNull: true,
          comment: 'Flags for suspicious activities detected'
        };
      }
      
      if (Object.keys(columnsToAdd).length > 0) {
        await queryInterface.addColumn('GameSessions', columnsToAdd);
        console.log('✅ Migration 025: Added browser fingerprinting fields');
      } else {
        console.log('⚠️ Migration 025: All fingerprinting columns already exist, skipping');
      }
    } catch (err) {
      console.error('❌ Migration 025 error:', err.message);
      throw err;
    }
  },

  down: async (sequelize) => {
    const queryInterface = sequelize.getQueryInterface();
    
    try {
      const table = await queryInterface.describeTable('GameSessions');
      
      if (table.browser_fingerprint) {
        await queryInterface.removeColumn('GameSessions', 'browser_fingerprint');
      }
      if (table.device_info) {
        await queryInterface.removeColumn('GameSessions', 'device_info');
      }
      if (table.last_activity_ip) {
        await queryInterface.removeColumn('GameSessions', 'last_activity_ip');
      }
      if (table.session_validated) {
        await queryInterface.removeColumn('GameSessions', 'session_validated');
      }
      if (table.suspicious_activity) {
        await queryInterface.removeColumn('GameSessions', 'suspicious_activity');
      }
      
      console.log('✅ Migration 025 rolled back');
    } catch (err) {
      console.error('❌ Migration 025 rollback error:', err.message);
    }
  }
};
