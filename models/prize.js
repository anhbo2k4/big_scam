  module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Prize', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      game_session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to GameSession'
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Position (1-50)'
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      description: DataTypes.TEXT,
      icon: {
        type: DataTypes.STRING,
        defaultValue: '🎁'
      },
      image_url: DataTypes.TEXT,
      cash_amount: {
        type: DataTypes.BIGINT,
        comment: 'Cash prize amount'
      },
      rarity: {
        type: DataTypes.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
        defaultValue: 'common'
      },
      color_hex: {
        type: DataTypes.STRING(7),
        defaultValue: '#666666',
        comment: 'Hex color for display'
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'NORMAL'
      },
      is_special: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      weight: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0,
        comment: 'Weight for gacha pulls'
      }
    }, {
      tableName: 'prizes',
      underscored: true,
      timestamps: true,
      indexes: [
        { fields: ['game_session_id'] },
        { fields: ['position'] },
        { fields: ['rarity'] }
      ]
    })
  }
