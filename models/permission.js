module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Permission', {
    name: { 
      type: DataTypes.STRING, 
      unique: true,
      allowNull: false
    },
    code: { 
      type: DataTypes.STRING, 
      unique: true,
      allowNull: false
    },
    description: DataTypes.TEXT,
    category: {
      type: DataTypes.STRING,
      defaultValue: 'system'
    },
    is_active: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    }
  }, {
    tableName: 'permissions',
    underscored: true,
    timestamps: false
  })
}
