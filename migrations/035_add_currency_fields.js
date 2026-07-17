'use strict';

/**
 * Migration 035: Add currency support fields
 * - PlayerInventory: currency column (VND, USD, NDT)
 * - ConversionRequest: currency, exchange_rate, amount_vnd columns
 */

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    // --- player_inventory ---
    const piCols = await queryInterface.describeTable('player_inventory');

    if (!piCols.currency) {
      await queryInterface.addColumn('player_inventory', 'currency', {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: 'VND',
        comment: 'Prize currency: VND, USD, NDT'
      });
    }

    // --- conversion_requests ---
    const crCols = await queryInterface.describeTable('conversion_requests');

    if (!crCols.currency) {
      await queryInterface.addColumn('conversion_requests', 'currency', {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: 'VND',
        comment: 'Original prize currency'
      });
    }

    if (!crCols.exchange_rate) {
      await queryInterface.addColumn('conversion_requests', 'exchange_rate', {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: true,
        defaultValue: null,
        comment: 'Exchange rate to VND at time of conversion'
      });
    }

    if (!crCols.amount_vnd) {
      await queryInterface.addColumn('conversion_requests', 'amount_vnd', {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'Converted amount in VND'
      });
    }

    console.log('✅ Migration 035: currency fields added');
  },

  async down(queryInterface) {
    const piCols = await queryInterface.describeTable('player_inventory');
    if (piCols.currency) await queryInterface.removeColumn('player_inventory', 'currency');

    const crCols = await queryInterface.describeTable('conversion_requests');
    if (crCols.currency) await queryInterface.removeColumn('conversion_requests', 'currency');
    if (crCols.exchange_rate) await queryInterface.removeColumn('conversion_requests', 'exchange_rate');
    if (crCols.amount_vnd) await queryInterface.removeColumn('conversion_requests', 'amount_vnd');
  }
};
