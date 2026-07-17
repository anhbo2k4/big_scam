module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PrizeIcon', {
    name: DataTypes.STRING,
    icon_path: DataTypes.TEXT
  }, {
    tableName: 'prize_icons',
    underscored: true,
    timestamps: false
  })
}
