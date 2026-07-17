module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('📋 Migration 012: Adding withdrawal tracking fields...');

      // Add withdraw_method field
      await queryInterface.addColumn('withdrawals', 'withdraw_method', {
        type: Sequelize.ENUM('bank_transfer', 'momo', 'zalopay'),
        allowNull: true,
        defaultValue: 'bank_transfer',
        comment: 'Method: bank_transfer, momo, or zalopay'
      });
      console.log('✅ Added withdraw_method column');

      // Add request_source field
      await queryInterface.addColumn('withdrawals', 'request_source', {
        type: Sequelize.ENUM('game', 'result', 'admin', 'other'),
        allowNull: true,
        defaultValue: 'game',
        comment: 'Where request came from: game page or result page'
      });
      console.log('✅ Added request_source column');

      console.log('✅ Migration 012 completed successfully');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('Duplicate column')) {
        console.log('⚠️ Columns already exist, skipping migration 012');
      } else {
        throw error;
      }
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('withdrawals', 'withdraw_method');
      await queryInterface.removeColumn('withdrawals', 'request_source');
      console.log('✅ Migration 012 rolled back');
    } catch (error) {
      console.error('Error rolling back migration 012:', error.message);
    }
  }
};
