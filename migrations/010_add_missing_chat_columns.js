const sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if columns exist, if not add them
      const table = await queryInterface.describeTable('chat_sessions');
      
      if (!table.unread_count) {
        await queryInterface.addColumn('chat_sessions', 'unread_count', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: true
        });
        console.log('✅ Added unread_count to chat_sessions');
      }

      if (!table.last_activity) {
        await queryInterface.addColumn('chat_sessions', 'last_activity', {
          type: Sequelize.DATE,
          allowNull: true
        });
        console.log('✅ Added last_activity to chat_sessions');
      }

      if (!table.resolved_at) {
        await queryInterface.addColumn('chat_sessions', 'resolved_at', {
          type: Sequelize.DATE,
          allowNull: true
        });
        console.log('✅ Added resolved_at to chat_sessions');
      }

      if (!table.customer_ip) {
        await queryInterface.addColumn('chat_sessions', 'customer_ip', {
          type: Sequelize.STRING(50),
          allowNull: true,
          index: true
        });
        console.log('✅ Added customer_ip to chat_sessions');
      }

    } catch (error) {
      if (error.message.includes('Unknown column')) {
        console.log('ℹ️ Column already exists or other DB error:', error.message);
      } else {
        throw error;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('chat_sessions', 'unread_count');
      await queryInterface.removeColumn('chat_sessions', 'last_activity');
      await queryInterface.removeColumn('chat_sessions', 'resolved_at');
      await queryInterface.removeColumn('chat_sessions', 'customer_ip');
      console.log('✅ Migration 010 rolled back');
    } catch (error) {
      console.log('ℹ️ Rollback skipped:', error.message);
    }
  }
};
