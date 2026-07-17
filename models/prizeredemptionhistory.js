module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PrizeRedemptionHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
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

    // Prize Details
    prize_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    prize_description: DataTypes.TEXT,
    prize_value: DataTypes.INTEGER,
    prize_image_url: DataTypes.TEXT,

    // Redemption Method
    redemption_method: {
      type: DataTypes.ENUM('withdrawal', 'gift_exchange', 'direct'),
      allowNull: false
    },

    // For Withdrawal
    withdrawal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'withdrawals',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    withdrawal_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
      defaultValue: 'pending'
    },
    withdrawal_amount: DataTypes.INTEGER,
    bank_name: DataTypes.STRING(100),
    bank_account: DataTypes.STRING(50),

    // For Gift Exchange
    gift_exchange_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'gift_exchanges',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    gift_exchange_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'shipped', 'delivered'),
      defaultValue: 'pending'
    },
    recipient_name: DataTypes.STRING(100),
    recipient_address: DataTypes.TEXT,
    recipient_phone: DataTypes.STRING(20),
    shipping_provider: DataTypes.STRING(100),
    tracking_number: DataTypes.STRING(100),

    // Timeline
    requested_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    approved_at: DataTypes.DATE,
    completed_at: DataTypes.DATE,
    rejected_at: DataTypes.DATE,
    rejection_reason: DataTypes.TEXT,

    // Status
    current_status: {
      type: DataTypes.ENUM('pending', 'approved', 'completed', 'rejected'),
      defaultValue: 'pending'
    },
    status_notes: DataTypes.TEXT
  }, {
    tableName: 'prize_redemption_histories',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['session_id'] },
      { fields: ['session_code'] },
      { fields: ['redemption_method'] },
      { fields: ['current_status'] },
      { fields: ['created_at'] }
    ]
  })
}
