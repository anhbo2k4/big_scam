"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get existing columns
    const table = await queryInterface.describeTable('withdrawals');
    
    // Add new columns only if they don't exist
    const columnsToAdd = [
      { name: 'withdrawal_type', defaultValue: 'cash_prize' },
      { name: 'requested_by', defaultValue: null },
      { name: 'requested_at', defaultValue: null },
      { name: 'approved_by', defaultValue: null },
      { name: 'approved_at', defaultValue: null }
    ];

    for (const col of columnsToAdd) {
      if (!table[col.name]) {
        if (col.name === 'withdrawal_type') {
          await queryInterface.addColumn('withdrawals', col.name, {
            type: Sequelize.STRING(50),
            allowNull: true,
            defaultValue: col.defaultValue
          });
        } else {
          await queryInterface.addColumn('withdrawals', col.name, {
            type: col.name.includes('_at') ? Sequelize.DATE : Sequelize.STRING(100),
            allowNull: true,
            defaultValue: col.defaultValue
          });
        }
      }
    }
  },

  down: async (queryInterface) => {
    const table = await queryInterface.describeTable('withdrawals');
    
    // Remove columns only if they exist
    if (table['approved_at']) await queryInterface.removeColumn('withdrawals', 'approved_at');
    if (table['approved_by']) await queryInterface.removeColumn('withdrawals', 'approved_by');
    if (table['requested_at']) await queryInterface.removeColumn('withdrawals', 'requested_at');
    if (table['requested_by']) await queryInterface.removeColumn('withdrawals', 'requested_by');
    if (table['withdrawal_type']) await queryInterface.removeColumn('withdrawals', 'withdrawal_type');
  }
};
