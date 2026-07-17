const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RememberToken = sequelize.define('RememberToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'remember_tokens',
    timestamps: true,
    underscored: true
  });

  RememberToken.associate = (models) => {
    RememberToken.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return RememberToken;
};
