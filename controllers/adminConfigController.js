/**
 * Admin Configuration Controller
 * Manage game rules at runtime (no redeploy needed)
 * Supports: Probability, Limits, Rewards, Withdrawal, Gamification, Anti-cheat, Feature Flags
 */

const { AdminConfig, AuditLog } = require('../models');

/**
 * Get all configurations
 */
async function getAllConfigs(req, res) {
  try {
    // Admin only
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const configs = await AdminConfig.findAll({
      where: { is_active: true },
      attributes: ['config_key', 'value', 'description', 'category', 'version', 'last_changed_at']
    });

    // Group by category
    const grouped = {};
    configs.forEach(cfg => {
      if (!grouped[cfg.category]) {
        grouped[cfg.category] = [];
      }
      grouped[cfg.category].push({
        key: cfg.config_key,
        value: JSON.parse(cfg.value),
        description: cfg.description,
        version: cfg.version
      });
    });

    res.json({
      success: true,
      data: grouped,
      total: configs.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch configs' });
  }
}

/**
 * Get specific configuration
 */
async function getConfig(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const { configKey } = req.params;

    const config = await AdminConfig.findOne({
      where: { config_key: configKey }
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: `Config '${configKey}' not found`
      });
    }

    res.json({
      success: true,
      data: {
        key: config.config_key,
        value: JSON.parse(config.value),
        type: typeof JSON.parse(config.value),
        description: config.description,
        category: config.category,
        version: config.version,
        lastChangedAt: config.last_changed_at,
        changedBy: config.changed_by_admin
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}

/**
 * Update configuration
 * Body: { configKey, newValue, description }
 */
async function updateConfig(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const { configKey, newValue, description } = req.body;

    if (!configKey || newValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing configKey or newValue'
      });
    }

    // Find existing config
    let config = await AdminConfig.findOne({
      where: { config_key: configKey }
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: `Config '${configKey}' not found`
      });
    }

    const oldValue = config.value;
    const newValueStr = JSON.stringify(newValue);

    // Update with version tracking
    await config.update({
      value: newValueStr,
      previous_value: oldValue,
      version: config.version + 1,
      last_changed_at: new Date(),
      changed_by_admin: req.user.id,
      description: description || config.description
    });

    // Audit log
    await AuditLog.create({
      session_code: `CONFIG_UPDATE_${configKey}`,
      action: 'CONFIG_UPDATE',
      user_id: req.user.id,
      ip_address: req.ip || '',
      user_agent: req.get('user-agent') || '',
      details: `Updated ${configKey} from ${oldValue} to ${newValueStr}`,
      status: 'success'
    });

    console.log(`✅ Config updated: ${configKey} by admin ${req.user.id}`);

    res.json({
      success: true,
      message: `Config '${configKey}' updated successfully`,
      data: {
        key: configKey,
        oldValue: JSON.parse(oldValue),
        newValue: newValue,
        version: config.version
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update config' });
  }
}

/**
 * Create new configuration
 * Body: { configKey, value, category, description }
 */
async function createConfig(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const { configKey, value, category, description } = req.body;

    if (!configKey || value === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing configKey, value, or category'
      });
    }

    const validCategories = ['PROBABILITY', 'LIMIT', 'REWARD', 'WITHDRAWAL', 'GAMIFICATION', 'ANTI_CHEAT', 'FEATURE_FLAG'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Check if already exists
    const existing = await AdminConfig.findOne({
      where: { config_key: configKey }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Config '${configKey}' already exists`
      });
    }

    const config = await AdminConfig.create({
      config_key: configKey,
      value: JSON.stringify(value),
      category: category,
      description: description || '',
      version: 1,
      is_active: true,
      changed_by_admin: req.user.id,
      last_changed_at: new Date()
    });

    console.log(`✅ New config created: ${configKey} by admin ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Config created successfully',
      data: {
        key: config.config_key,
        value: JSON.parse(config.value),
        category: config.category
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create config' });
  }
}

/**
 * Rollback configuration to previous version
 */
async function rollbackConfig(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const { configKey } = req.params;

    const config = await AdminConfig.findOne({
      where: { config_key: configKey }
    });

    if (!config || !config.previous_value) {
      return res.status(404).json({
        success: false,
        message: 'No previous version available'
      });
    }

    const currentValue = config.value;
    const previousValue = config.previous_value;

    // Rollback
    await config.update({
      value: previousValue,
      previous_value: currentValue,
      version: config.version + 1,
      last_changed_at: new Date(),
      changed_by_admin: req.user.id
    });

    console.log(`⏮️ Config rolled back: ${configKey}`);

    res.json({
      success: true,
      message: `Config '${configKey}' rolled back`,
      data: {
        key: configKey,
        rolledBackTo: JSON.parse(previousValue),
        version: config.version
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}

/**
 * Toggle feature flag
 */
async function toggleFeatureFlag(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const { configKey } = req.params;

    const config = await AdminConfig.findOne({
      where: {
        config_key: configKey,
        category: 'FEATURE_FLAG'
      }
    });

    if (!config) {
      return res.status(404).json({ success: false, message: 'Feature flag not found' });
    }

    const currentValue = JSON.parse(config.value);
    const newValue = !currentValue;

    await config.update({
      value: JSON.stringify(newValue),
      previous_value: config.value,
      version: config.version + 1,
      last_changed_at: new Date(),
      changed_by_admin: req.user.id
    });

    console.log(`🚩 Feature flag toggled: ${configKey} = ${newValue}`);

    res.json({
      success: true,
      message: `Feature flag '${configKey}' toggled`,
      data: {
        flag: configKey,
        enabled: newValue
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}

/**
 * Delete configuration (deactivate)
 */
async function deleteConfig(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const { configKey } = req.params;

    const config = await AdminConfig.findOne({
      where: { config_key: configKey }
    });

    if (!config) {
      return res.status(404).json({ success: false, message: 'Config not found' });
    }

    await config.update({ is_active: false });

    console.log(`🗑️ Config deactivated: ${configKey}`);

    res.json({
      success: true,
      message: `Config '${configKey}' deactivated`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}

module.exports = {
  getAllConfigs,
  getConfig,
  updateConfig,
  createConfig,
  rollbackConfig,
  toggleFeatureFlag,
  deleteConfig
};
