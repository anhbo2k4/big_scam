module.exports = (sequelize, DataTypes) => {
  const AccessVisit = sequelize.define('AccessVisit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    hit_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    visited_paths: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON array of visited page paths'
    },
    client_signatures: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON array of browser/device signatures observed on this IP'
    },
    client_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    last_user_agent: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    first_seen_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    last_seen_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    }
  }, {
    tableName: 'access_visits',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['ip_address'] },
      { fields: ['last_seen_at'] }
    ]
  });

  return AccessVisit;
};
