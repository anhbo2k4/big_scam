module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔧 Migration 023: Dropping withdrawal user_id foreign key constraint...');
    try {
      // Drop the foreign key constraint
      await queryInterface.removeConstraint('withdrawals', 'withdrawals_ibfk_1');
      console.log('✅ Foreign key constraint removed successfully');
    } catch (err) {
      if (err.message.includes('1091')) {
        console.log('⚠️  Constraint does not exist, skipping');
      } else {
        throw err;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('🔧 Migration 023 rollback: Re-adding foreign key constraint...');
    // Not implemented - this is a one-way migration
  }
};
