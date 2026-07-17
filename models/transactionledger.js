/**
 * Transaction Ledger Model
 * CRITICAL: Every money movement recorded here
 * This is the complete audit trail - no update without log entry
 * 
 * Design: Append-only ledger, never delete transactions
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TransactionLedger', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User making the transaction'
    },

    // Transaction type (every type of money movement)
    transaction_type: {
      type: DataTypes.ENUM(
        'GAME_WIN',              // Player won money from game
        'GAME_LOSS',             // Player lost money (if applicable)
        'PRIZE_DRAWN',           // Prize converted to cash
        'PRIZE_CONVERTED',       // Prize manually converted  
        'WITHDRAWAL_REQUEST',    // Withdraw request submitted
        'WITHDRAWAL_APPROVED',   // Withdrawal approved by admin
        'WITHDRAWAL_REJECTED',   // Withdrawal rejected
        'WITHDRAWAL_PAID',       // Withdrawal completed
        'ADMIN_ADJUSTMENT',      // Admin manual adjustments
        'REFERRAL_BONUS',        // Referral reward
        'DAILY_REWARD',          // Daily bonus
        'LEVEL_UP_REWARD',       // Level up bonus
        'PROMOTION',             // Marketing promotion
        'REFUND',                // Refund from failed transaction
        'CHARGEBACK',            // Chargeback/dispute
        'LOCKED_HOLD',           // Money locked (not actual transfer)
        'LOCKED_RELEASE'         // Money unlocked
      ),
      allowNull: false,
      comment: 'Type of transaction'
    },

    // Amount (in smallest unit, VND)
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Amount (can be negative for debits)'
    },

    // Balance state at this transaction
    balance_before: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Total balance before this transaction'
    },

    balance_after: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Total balance after this transaction'
    },

    // Impact on different balance types
    available_before: { type: DataTypes.BIGINT, comment: 'Available balance before' },
    available_after: { type: DataTypes.BIGINT, comment: 'Available balance after' },
    pending_before: { type: DataTypes.BIGINT, comment: 'Pending balance before' },
    pending_after: { type: DataTypes.BIGINT, comment: 'Pending balance after' },
    locked_before: { type: DataTypes.BIGINT, comment: 'Locked balance before' },
    locked_after: { type: DataTypes.BIGINT, comment: 'Locked balance after' },

    // References to source
    game_session_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'If game result, link to GameSession'
    },

    withdrawal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'If withdrawal related, link to Withdrawal'
    },

    prize_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'If prize related, link to Prize'
    },

    // Details  
    description: {
      type: DataTypes.TEXT,
      comment: 'Human-readable description'
    },

    metadata: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Extra data: game_result_details, payment_proof, etc'
    },

    // Audit
    created_by: {
      type: DataTypes.STRING(100),
      comment: 'Who created this: user_id, admin_id, system, etc'
    },

    ip_address: {
      type: DataTypes.STRING,
      comment: 'IP where transaction originated'
    },

    user_agent: {
      type: DataTypes.TEXT,
      comment: 'Browser info at transaction time'
    },

    // Integrity
    transaction_hash: {
      type: DataTypes.STRING(64),
      comment: 'SHA256 of all transaction details for verification'
    }
  }, {
    tableName: 'transaction_ledger',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,  // Append-only, never update
    indexes: [
      { fields: ['user_id'] },
      { fields: ['transaction_type'] },
      { fields: ['game_session_id'] },
      { fields: ['withdrawal_id'] },
      { fields: ['created_at'] },
      { fields: ['user_id', 'created_at'] },  // For user history
      { fields: ['transaction_type', 'created_at'] }  // For type reporting
    ]
  })
}
