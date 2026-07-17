module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const transaction = await queryInterface.sequelize.transaction();

      try {
        // Check if columns already exist
        const tableDescription = await queryInterface.describeTable('withdrawals', { transaction });

        // Add customer_name if not exists
        if (!tableDescription.customer_name) {
          await queryInterface.addColumn('withdrawals', 'customer_name', {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Customer name from withdrawal form'
          }, { transaction });
          console.log('✅ Added customer_name column');
        }

        // Add customer_phone if not exists
        if (!tableDescription.customer_phone) {
          await queryInterface.addColumn('withdrawals', 'customer_phone', {
            type: Sequelize.STRING(20),
            allowNull: true,
            comment: 'Customer phone number'
          }, { transaction });
          console.log('✅ Added customer_phone column');
        }

        // Add customer_email if not exists
        if (!tableDescription.customer_email) {
          await queryInterface.addColumn('withdrawals', 'customer_email', {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Customer email address'
          }, { transaction });
          console.log('✅ Added customer_email column');
        }

        await transaction.commit();
        console.log('✅ Migration 013 completed successfully');
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('❌ Migration 013 error:', error.message);
      // Don't throw - continue startup if columns already exist
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      const transaction = await queryInterface.sequelize.transaction();

      try {
        await queryInterface.removeColumn('withdrawals', 'customer_name', { transaction });
        await queryInterface.removeColumn('withdrawals', 'customer_phone', { transaction });
        await queryInterface.removeColumn('withdrawals', 'customer_email', { transaction });
        
        await transaction.commit();
        console.log('✅ Migration 013 rollback completed');
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('❌ Migration 013 rollback error:', error.message);
    }
  }
};
