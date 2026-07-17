const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Withdrawal = sequelize.define('Withdrawal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'User ID if logged in (optional, not required for game withdrawals)'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    account_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    account_holder: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    withdrawal_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'cash_prize',
      comment: 'Type of withdrawal, e.g., cash_prize'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    requested_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    requested_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejected_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Admin nào từ chối'
    },
    
    customer_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Customer name from withdrawal form'
    },
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Customer phone number'
    },
    customer_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Customer email address'
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
    prize_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Value of prize in cash'
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
    
    withdraw_method: {
      type: DataTypes.ENUM('bank_transfer', 'momo', 'zalopay'),
      allowNull: true,
      defaultValue: 'bank_transfer',
      comment: 'Method: bank_transfer, momo, or zalopay'
    },
    
    request_source: {
      type: DataTypes.ENUM('game', 'result', 'admin', 'other'),
      allowNull: true,
      defaultValue: 'game',
      comment: 'Where request came from: game page or result page'
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
    tableName: 'withdrawals',
    timestamps: true,
    underscored: true
  });

  Withdrawal.associate = (models) => {
    // No associations needed - user_id is optional for game withdrawals
  };

  return Withdrawal;
};
