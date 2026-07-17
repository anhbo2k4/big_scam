const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('site_settings', {
      key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      value: {
        type: DataTypes.TEXT('long'),
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('site_settings');
  }
};
