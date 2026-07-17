const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ConversionRequest = sequelize.define('ConversionRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    session_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    box_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    prize_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
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
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'VND',
      comment: 'Original prize currency'
    },
    exchange_rate: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: true,
      defaultValue: null,
      comment: 'Exchange rate to VND at time of conversion'
    },
    amount_vnd: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: null,
      comment: 'Converted amount in VND'
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
    tableName: 'conversion_requests',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['session_code'] },
      { fields: ['status'] },
      { fields: ['session_code', 'box_number'] }
    ]
  });

  return ConversionRequest;
};
