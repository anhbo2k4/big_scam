/**
 * Admin Configuration Model
 * Stores all configurable game rules and probabilities
 * Can be edited by admin at runtime
 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AdminConfig', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // Config category
    config_key: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      comment: 'Config key name (e.g., RARITY_COMMON_PERCENT)'
    },

    // Values stored as JSON for flexibility
    value: {
      type: DataTypes.JSON,
      comment: 'Config value (can be object, array, or scalar)'
    },

    config_type: {
      type: DataTypes.ENUM(
        'PROBABILITY',           // Game win probabilities
        'LIMIT',                 // Rate limits
        'REWARD',                // Reward amounts
        'WITHDRAWAL',            // Withdrawal rules
        'GAMIFICATION',          // Level/XP settings
        'ANTI_CHEAT',            // Anti-cheat rules
        'FEATURE_FLAG'           // Enable/disable features
      ),
      defaultValue: 'FEATURE_FLAG'
    },

    // Descriptive info
    description: {
      type: DataTypes.TEXT,
      comment: 'Human description of what this config does'
    },

    // Versioning
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'Version number for tracking'
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether this config is applied'
    },

    // Audit
    changed_by_admin: {
      type: DataTypes.INTEGER,
      comment: 'Admin user ID who last changed this'
    },

    last_changed_at: {
      type: DataTypes.DATE,
      comment: 'When config was last changed'
    },

    previous_value: {
      type: DataTypes.JSON,
      comment: 'Previous value for rollback'
    }
  }, {
    tableName: 'admin_configs',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['config_key'] },
      { fields: ['config_type'] },
      { fields: ['is_active'] }
    ]
  })
}
