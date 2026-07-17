module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Add columns to withdrawals table
      const withdrawalColumns = [
        { name: 'session_code', type: Sequelize.STRING(50), allowNull: true },
        { name: 'selected_box_number', type: Sequelize.INTEGER, allowNull: true },
        { name: 'prize_name', type: Sequelize.STRING(255), allowNull: true },
        { name: 'prize_value', type: Sequelize.DECIMAL(15, 2), allowNull: true },
        { name: 'selected_at', type: Sequelize.DATE, allowNull: true },
        { name: 'player_contact', type: Sequelize.JSON, allowNull: true },
        { name: 'box_selection_snapshot', type: Sequelize.JSON, allowNull: true }
      ];

      for (const col of withdrawalColumns) {
        const columnExists = await queryInterface.describeTable('withdrawals', { transaction });
        if (!columnExists[col.name]) {
          await queryInterface.addColumn('withdrawals', col.name, col, { transaction });
        }
      }

      // Add columns to gift_exchanges table
      const giftColumns = [
        { name: 'session_code', type: Sequelize.STRING(50), allowNull: true },
        { name: 'selected_box_number', type: Sequelize.INTEGER, allowNull: true },
        { name: 'prize_name', type: Sequelize.STRING(255), allowNull: true },
        { name: 'selected_at', type: Sequelize.DATE, allowNull: true },
        { name: 'player_contact', type: Sequelize.JSON, allowNull: true },
        { name: 'box_selection_snapshot', type: Sequelize.JSON, allowNull: true }
      ];

      for (const col of giftColumns) {
        const columnExists = await queryInterface.describeTable('gift_exchanges', { transaction });
        if (!columnExists[col.name]) {
          await queryInterface.addColumn('gift_exchanges', col.name, col, { transaction });
        }
      }

      await transaction.commit();
      console.log('✅ Migration 003 completed: Added box tracking fields to withdrawals and gifts');
    } catch (err) {
      await transaction.rollback();
      console.error('❌ Migration 003 failed:', err);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const withdrawalColumns = ['session_code', 'selected_box_number', 'prize_name', 'prize_value', 'selected_at', 'player_contact', 'box_selection_snapshot'];
      for (const col of withdrawalColumns) {
        const columnExists = await queryInterface.describeTable('withdrawals', { transaction });
        if (columnExists[col]) {
          await queryInterface.removeColumn('withdrawals', col, { transaction });
        }
      }

      const giftColumns = ['session_code', 'selected_box_number', 'prize_name', 'selected_at', 'player_contact', 'box_selection_snapshot'];
      for (const col of giftColumns) {
        const columnExists = await queryInterface.describeTable('gift_exchanges', { transaction });
        if (columnExists[col]) {
          await queryInterface.removeColumn('gift_exchanges', col, { transaction });
        }
      }

      await transaction.commit();
      console.log('✅ Migration 003 rollback completed');
    } catch (err) {
      await transaction.rollback();
      console.error('❌ Migration 003 rollback failed:', err);
      throw err;
    }
  }
};
