module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SiteSettings', {
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    value: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    }
  }, {
    tableName: 'site_settings',
    underscored: true,
    timestamps: true
  });
};
