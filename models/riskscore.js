/**
 * Anti-Cheat Configuration & Risk Scoring Model
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RiskScore', {
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
      }
    },

    // Overall risk score (0-100)
    risk_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
      comment: 'Overall risk%: 0=safe, 100=maximum risk'
    },

    // Risk categories
    win_rate_risk: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Too many wins = higher risk'
    },

    frequency_risk: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Playing too frequently consecutive games'
    },

    device_risk: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Device fingerprint anomalies'
    },

    location_risk: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'IP/location changes'
    },

    timing_risk: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Unusual play times or patterns'
    },

    multi_account_risk: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Detected multi-accounting'
    },

    behavior_risk: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Unusual behavior patterns'
    },

    // Actions taken
    current_status: {
      type: DataTypes.ENUM(
        'SAFE',           // ≤ 20%
        'MONITORING',     // 21-40%
        'ELEVATED',       // 41-60%
        'SUSPICIOUS',     // 61-80%
        'BLOCKED'         // > 80 or manual block
      ),
      defaultValue: 'SAFE',
      comment: 'Current risk status'
    },

    // Manual actions
    manual_locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Admin manually locked account'
    },

    locked_reason: {
      type: DataTypes.TEXT,
      comment: 'Why account is locked'
    },

    locked_until: {
      type: DataTypes.DATE,
      comment: 'When lock expires (null = permanent until admin review)'
    },

    locked_by_admin: {
      type: DataTypes.INTEGER,
      comment: 'Admin user ID who locked'
    },

    // Tracking
    flags_total: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Total suspicious flags ever raised'
    },

    flagged_sessions: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of flagged session IDs (last 20)'
    },

    last_flagged: {
      type: DataTypes.DATE,
      comment: 'Last time flagged'
    },

    last_reviewed: {
      type: DataTypes.DATE,
      comment: 'Last admin review'
    }
  }, {
    tableName: 'risk_scores',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['risk_score'], order: [['risk_score', 'DESC']] },
      { fields: ['current_status'] },
      { fields: ['manual_locked'] }
    ]
  })
}
