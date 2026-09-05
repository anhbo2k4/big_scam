const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();
    const has = name => tables.some(t => String(t).toLowerCase() === name.toLowerCase());

    if (!has('permission_scopes')) {
      await queryInterface.createTable('permission_scopes', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
        scope_type: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'global' },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
      });
    }

    if (!has('user_permission_scopes')) {
      await queryInterface.createTable('user_permission_scopes', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        permission_code: { type: DataTypes.STRING(100), allowNull: false },
        scope_id: { type: DataTypes.INTEGER, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
      });
      await queryInterface.addIndex('user_permission_scopes', ['user_id', 'permission_code', 'scope_id'], { unique: true, name: 'uq_user_permission_scope' });
    }

    const columns = await queryInterface.describeTable('chat_sessions');
    if (!columns.support_agent_id) await queryInterface.addColumn('chat_sessions', 'support_agent_id', { type: DataTypes.INTEGER, allowNull: true });
    if (!columns.assigned_at) await queryInterface.addColumn('chat_sessions', 'assigned_at', { type: DataTypes.DATE, allowNull: true });
    if (!columns.assigned_by_user_id) await queryInterface.addColumn('chat_sessions', 'assigned_by_user_id', { type: DataTypes.INTEGER, allowNull: true });
    if (!columns.record_scope_id) await queryInterface.addColumn('chat_sessions', 'record_scope_id', { type: DataTypes.INTEGER, allowNull: true });
  }
};
