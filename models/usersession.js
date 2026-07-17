module.exports = (sequelize, DataTypes) => {
  const UserSession = sequelize.define('UserSession', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    session_id: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    session_type: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: 'guest'
    },
    game_session_code: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_authenticated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    remember_token_used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: 'active'
    },
    login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_seen_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    logout_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    }
  }, {
    tableName: 'user_sessions',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { unique: true, fields: ['session_id'] },
      { fields: ['user_id'] },
      { fields: ['game_session_code'] },
      { fields: ['status'] },
      { fields: ['last_seen_at'] },
      { fields: ['login_at'] }
    ]
  });

  UserSession.associate = (db) => {
    if (db.User) {
      UserSession.belongsTo(db.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  };

  return UserSession;
};
