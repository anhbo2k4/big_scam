'use strict';

/**
 * Migration 038 — Random Box Opening Mode + User Join Tracking
 *
 * Adds to game_sessions:
 *   opening_mode      — 'sequential' (classic 3-box open) | 'random_single' (new mode)
 *   random_bias       — 'normal' | 'unlucky_bias' | 'always_unlucky'
 *   random_opened_box — which box number was randomly selected
 *   player_user_agent — browser user-agent captured on join
 *   player_joined_at  — precise timestamp when player joined
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const game_sessions_desc = await queryInterface.describeTable('game_sessions').catch(() => ({}));

    const cols = [
      {
        name: 'opening_mode',
        spec: {
          type: Sequelize.ENUM('sequential', 'random_single'),
          allowNull: false,
          defaultValue: 'sequential'
        }
      },
      {
        name: 'random_bias',
        spec: {
          type: Sequelize.ENUM('normal', 'unlucky_bias', 'always_unlucky'),
          allowNull: false,
          defaultValue: 'normal'
        }
      },
      {
        name: 'random_opened_box',
        spec: { type: Sequelize.INTEGER, allowNull: true, defaultValue: null }
      },
      {
        name: 'player_user_agent',
        spec: { type: Sequelize.TEXT, allowNull: true, defaultValue: null }
      },
      {
        name: 'player_joined_at',
        spec: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
      }
    ];

    for (const col of cols) {
      if (!game_sessions_desc[col.name]) {
        await queryInterface.addColumn('game_sessions', col.name, col.spec);
        console.log(`✅ 038: Added game_sessions.${col.name}`);
      }
    }
  },

  async down(queryInterface) {
    for (const col of ['opening_mode', 'random_bias', 'random_opened_box', 'player_user_agent', 'player_joined_at']) {
      await queryInterface.removeColumn('game_sessions', col).catch(() => {});
    }
  }
};
