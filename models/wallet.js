/**
 * Wallet Model
 * Tracks user's wallet with balance types: total, available, pending, locked
 * This is the single source of truth for user money
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Wallet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User ID - one wallet per user'
    },

    // The 4 critical balance types (in smallest currency unit, e.g., VND)
    total_balance: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
      comment: 'Total balance = available + pending + locked'
    },

    available_balance: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
      comment: 'Can withdraw or use immediately'
    },

    pending_balance: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
      comment: 'Waiting for approval (e.g., withdrawal pending)'
    },

    locked_balance: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
      comment: 'Locked for game in progress or other holds'
    },

    // Tracking
    last_updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'Last update timestamp'
    },

    updated_by: {
      type: DataTypes.STRING(100),
      comment: 'Who/what updated the balance (admin_user_id, system, game_id, etc)'
    },

    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'Optimistic locking version for concurrent updates'
    },

    // Integrity check
    integrity_hash: {
      type: DataTypes.STRING(64),
      comment: 'SHA256 of (user_id + total + available + pending + locked) for verification'
    }
  }, {
    tableName: 'wallets',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['total_balance'] },
      { fields: ['available_balance'] },
      { fields: ['created_at'] }
    ]
  })
}
