module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserGameHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'game_sessions',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    session_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    game_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    player_name: DataTypes.STRING(100),
    player_phone: DataTypes.STRING(20),
    player_email: DataTypes.STRING(100),
    player_ip: DataTypes.STRING(45),
    player_device: DataTypes.TEXT,
    
    // Prize Results
    selected_box: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    won_prize: DataTypes.TEXT,
    prize_value: DataTypes.INTEGER,
    is_special: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_unlucky: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    // Game Mechanics
    game_duration_ms: DataTypes.INTEGER,
    boxes_opened_count: DataTypes.INTEGER,
    game_actions: {
      type: DataTypes.JSON,
      defaultValue: []
    },

    // Status
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    form_submitted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'user_game_histories',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['session_id'] },
      { fields: ['session_code'] },
      { fields: ['user_id'] },
      { fields: ['created_at'] },
      { fields: ['user_id', 'created_at'] }
    ]
  })
}
