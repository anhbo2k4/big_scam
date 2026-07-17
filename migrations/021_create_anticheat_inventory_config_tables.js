/**
 * Migration 021: Create Risk Score, Prize Inventory, & Admin Config Tables
 * Anti-cheat, prize management, and configurable rules
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Risk scores table
      await queryInterface.createTable(
        'risk_scores',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            references: { model: 'users', key: 'id' }
          },
          risk_score: { type: Sequelize.INTEGER, defaultValue: 0 },
          win_rate_risk: { type: Sequelize.INTEGER, defaultValue: 0 },
          frequency_risk: { type: Sequelize.INTEGER, defaultValue: 0 },
          device_risk: { type: Sequelize.INTEGER, defaultValue: 0 },
          location_risk: { type: Sequelize.INTEGER, defaultValue: 0 },
          timing_risk: { type: Sequelize.INTEGER, defaultValue: 0 },
          multi_account_risk: { type: Sequelize.INTEGER, defaultValue: 0 },
          behavior_risk: { type: Sequelize.INTEGER, defaultValue: 0 },
          current_status: {
            type: Sequelize.ENUM('SAFE', 'MONITORING', 'ELEVATED', 'SUSPICIOUS', 'BLOCKED'),
            defaultValue: 'SAFE'
          },
          manual_locked: { type: Sequelize.BOOLEAN, defaultValue: false },
          locked_reason: Sequelize.TEXT,
          locked_until: Sequelize.DATE,
          locked_by_admin: Sequelize.INTEGER,
          flags_total: { type: Sequelize.INTEGER, defaultValue: 0 },
          flagged_sessions: { type: Sequelize.JSON, defaultValue: [] },
          last_flagged: Sequelize.DATE,
          last_reviewed: Sequelize.DATE,
          created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        },
        { transaction }
      );

      // Prize inventory table
      await queryInterface.createTable(
        'prize_inventories',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          prize_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            references: { model: 'prizes', key: 'id' }
          },
          game_session_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: 'game_sessions', key: 'id' }
          },
          total_stock: { type: Sequelize.INTEGER, defaultValue: 1 },
          remaining_stock: { type: Sequelize.INTEGER, defaultValue: 1 },
          reserved_count: { type: Sequelize.INTEGER, defaultValue: 0 },
          drawn_count: { type: Sequelize.INTEGER, defaultValue: 0 },
          prize_type: {
            type: Sequelize.ENUM(
              'MONEY',
              'PHYSICAL_ITEM',
              'VOUCHER',
              'DIGITAL',
              'EXPERIENCE',
              'SPECIAL'
            ),
            defaultValue: 'MONEY'
          },
          item_sku: Sequelize.STRING(50),
          can_convert_to_cash: { type: Sequelize.BOOLEAN, defaultValue: false },
          conversion_rate: { type: Sequelize.FLOAT, defaultValue: 1.0 },
          base_cash_value: Sequelize.BIGINT,
          converted_to_cash_count: { type: Sequelize.INTEGER, defaultValue: 0 },
          is_limited_stock: { type: Sequelize.BOOLEAN, defaultValue: false },
          restock_threshold: Sequelize.INTEGER,
          auto_restock: { type: Sequelize.BOOLEAN, defaultValue: false },
          unit_cost: Sequelize.BIGINT,
          total_cost: Sequelize.BIGINT,
          total_cash_distributed: { type: Sequelize.BIGINT, defaultValue: 0 },
          profit_loss: { type: Sequelize.BIGINT, defaultValue: 0 },
          created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        },
        { transaction }
      );

      // Admin config table
      await queryInterface.createTable(
        'admin_configs',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          config_key: {
            type: Sequelize.STRING(100),
            unique: true,
            allowNull: false
          },
          value: Sequelize.JSON,
          config_type: {
            type: Sequelize.ENUM(
              'PROBABILITY',
              'LIMIT',
              'REWARD',
              'WITHDRAWAL',
              'GAMIFICATION',
              'ANTI_CHEAT',
              'FEATURE_FLAG'
            ),
            defaultValue: 'FEATURE_FLAG'
          },
          description: Sequelize.TEXT,
          version: { type: Sequelize.INTEGER, defaultValue: 1 },
          is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
          changed_by_admin: Sequelize.INTEGER,
          last_changed_at: Sequelize.DATE,
          previous_value: Sequelize.JSON,
          created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
        },
        { transaction }
      );

      // Indexes
      await queryInterface.addIndex('risk_scores', ['user_id'], { transaction });
      await queryInterface.addIndex('risk_scores', ['risk_score'], { transaction });
      await queryInterface.addIndex('risk_scores', ['current_status'], { transaction });
      await queryInterface.addIndex('risk_scores', ['manual_locked'], { transaction });

      await queryInterface.addIndex('prize_inventories', ['prize_id'], { transaction });
      await queryInterface.addIndex('prize_inventories', ['game_session_id'], { transaction });
      await queryInterface.addIndex('prize_inventories', ['prize_type'], { transaction });
      await queryInterface.addIndex('prize_inventories', ['remaining_stock'], { transaction });

      await queryInterface.addIndex('admin_configs', ['config_key'], { transaction });
      await queryInterface.addIndex('admin_configs', ['config_type'], { transaction });
      await queryInterface.addIndex('admin_configs', ['is_active'], { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('risk_scores', { transaction });
      await queryInterface.dropTable('prize_inventories', { transaction });
      await queryInterface.dropTable('admin_configs', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
