const { DataTypes } = require('sequelize');

module.exports = (sequelize, DT) => {
  const PlayerInventory = sequelize.define('PlayerInventory', {
    id: {
      type: DT.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    
    session_code: {
      type: DT.STRING(50),
      allowNull: false,
      index: true,
      comment: 'Game session code'
    },
    
    box_number: {
      type: DT.INTEGER,
      allowNull: false,
      comment: 'Which box was opened (1, 2, or 3)'
    },
    
    prize_name: {
      type: DT.STRING(255),
      allowNull: false,
      comment: 'Prize name'
    },
    
    prize_description: {
      type: DT.TEXT,
      allowNull: true,
      comment: 'Prize description'
    },
    
    prize_icon: {
      type: DT.STRING(50),
      defaultValue: '🎁',
      comment: 'Prize emoji/icon'
    },
    
    prize_image: {
      type: DT.TEXT,
      allowNull: true,
      comment: 'Prize image URL'
    },
    
    prize_value: {
      type: DT.DECIMAL(15, 2),
      defaultValue: 0,
      comment: 'Prize cash value'
    },
    
    is_cash: {
      type: DT.BOOLEAN,
      defaultValue: false,
      comment: 'Is this a cash prize?'
    },
    
    is_special: {
      type: DT.BOOLEAN,
      defaultValue: false,
      comment: 'Is this a special prize requiring approval?'
    },
    
    rarity: {
      type: DT.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
      defaultValue: 'common',
      comment: 'Prize rarity level'
    },
    
    color_hex: {
      type: DT.STRING(7),
      defaultValue: '#666666',
      comment: 'Prize color in hex'
    },
    
    status: {
      type: DT.STRING(30),
      defaultValue: 'obtained',
      comment: 'Prize status: obtained, pending_approval, confirmed, converted, declined, rejected, claimed, exchanged'
    },
    
    claimed_at: {
      type: DT.DATE,
      allowNull: true,
      comment: 'When prize was claimed'
    },
    
    created_at: {
      type: DT.DATE,
      defaultValue: DT.NOW
    },
    
    updated_at: {
      type: DT.DATE,
      defaultValue: DT.NOW
    },
    
    approved_by: {
      type: DT.STRING,
      allowNull: true,
      comment: 'Admin nào phê duyệt'
    },
    
    rejected_by: {
      type: DT.STRING,
      allowNull: true,
      comment: 'Admin nào từ chối'
    },

    currency: {
      type: DT.STRING(10),
      allowNull: true,
      defaultValue: 'VND',
      comment: 'Prize currency: VND, USD, NDT'
    }
  }, {
    tableName: 'player_inventory',
    timestamps: true,
    underscored: true
  });

  return PlayerInventory;
};
