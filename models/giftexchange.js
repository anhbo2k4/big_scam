const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GiftExchange = sequelize.define('GiftExchange', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'game_sessions',
        key: 'id'
      }
    },
    recipient_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prize_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    
    session_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Link to game session code'
    },
    selected_box_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Which box (1, 2, 3) player selected'
    },
    prize_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Name of prize from selected box'
    },
    selected_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When player selected the box'
    },
    player_contact: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Player contact info {phone, email, name}'
    },
    box_selection_snapshot: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Full box data at time of selection'
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
    tableName: 'gift_exchanges',
    timestamps: true,
    underscored: true
  });

  GiftExchange.associate = (models) => {
    GiftExchange.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    GiftExchange.belongsTo(models.GameSession, {
      foreignKey: 'session_id',
      as: 'session'
    });
  };

  return GiftExchange;
};
