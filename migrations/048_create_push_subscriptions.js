'use strict';

/**
 * Migration 048
 * Create push_subscriptions table for Web Push API (VAPID).
 * Stores per-device browser push subscriptions linked to optional user accounts.
 */

module.exports = {
  name: '048_create_push_subscriptions',

  async up(sequelize) {
    const { DataTypes } = require('sequelize');
    const qi = sequelize.getQueryInterface();

    const tables = await qi.showAllTables();
    if (tables.includes('push_subscriptions')) {
      console.log('⏭  Migration 048: push_subscriptions already exists, skipping');
      return;
    }

    await qi.createTable('push_subscriptions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Linked user (null for anonymous subscriptions)',
      },
      endpoint: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Push service endpoint URL (unique per browser context)',
      },
      p256dh: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'P-256 DH public key (base64url)',
      },
      auth: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Auth secret (base64url)',
      },
      device_info: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'User-agent, platform, isWebView, isPWA',
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'False when subscription expires (410) or user unsubscribes',
      },
      last_used_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    // Add unique index on endpoint (one subscription per browser)
    try {
      await qi.addIndex('push_subscriptions', ['endpoint'], {
        name: 'push_subscriptions_endpoint_unique',
        unique: true,
        // endpoint is TEXT — MySQL needs prefix length for TEXT index keys
        ...(process.env.DB_DIALECT !== 'sqlite' ? {
          using: 'BTREE',
          // Use a prefix to satisfy MySQL TEXT index length requirement
          length: { endpoint: 500 },
        } : {}),
      });
    } catch (e) {
      console.warn('[048] Could not create unique index on endpoint:', e.message);
    }

    // Add composite index for fast user subscription lookup
    try {
      await qi.addIndex('push_subscriptions', ['user_id', 'is_active'], {
        name: 'push_subscriptions_user_active',
      });
    } catch (e) {
      console.warn('[048] Could not create user_active index:', e.message);
    }

    console.log('✅ Migration 048 completed: push_subscriptions table created');
  },

  async down(sequelize) {
    const qi = sequelize.getQueryInterface();
    const tables = await qi.showAllTables();
    if (tables.includes('push_subscriptions')) {
      await qi.dropTable('push_subscriptions');
      console.log('↩  Migration 048 rolled back: push_subscriptions table dropped');
    }
  },
};
