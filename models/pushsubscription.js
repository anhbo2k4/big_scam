const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PushSubscription = sequelize.define('PushSubscription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Nullable — supports subscriptions before login (anonymous visitors)
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Full push endpoint URL — unique per device+browser+site
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // P-256 DH public key (base64url)
    p256dh: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Auth secret (base64url)
    auth: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    device_info: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'push_subscriptions',
    timestamps: true,
    underscored: true,
    indexes: [
      // Unique endpoint (one active sub per browser context)
      { unique: true, fields: ['endpoint'], name: 'push_subscriptions_endpoint_unique' },
      // Lookup all subs for a user efficiently
      { fields: ['user_id', 'is_active'], name: 'push_subscriptions_user_active' },
    ],
  });

  PushSubscription.associate = (models) => {
    if (models.User) {
      PushSubscription.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        constraints: false, // endpoint can exist without a user
      });
    }
  };

  return PushSubscription;
};
