module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      const columns = await queryInterface.describeTable('game_sessions');

      // Add rarity fields
      if (!columns.prize_1_rarity) {
        await queryInterface.addColumn('game_sessions', 'prize_1_rarity', {
          type: Sequelize.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
          defaultValue: 'common',
          allowNull: false
        }, { transaction });
      }

      if (!columns.prize_2_rarity) {
        await queryInterface.addColumn('game_sessions', 'prize_2_rarity', {
          type: Sequelize.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
          defaultValue: 'common',
          allowNull: false
        }, { transaction });
      }

      if (!columns.prize_3_rarity) {
        await queryInterface.addColumn('game_sessions', 'prize_3_rarity', {
          type: Sequelize.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
          defaultValue: 'common',
          allowNull: false
        }, { transaction });
      }

      // Add color hex fields
      if (!columns.prize_1_color_hex) {
        await queryInterface.addColumn('game_sessions', 'prize_1_color_hex', {
          type: Sequelize.STRING(7),
          defaultValue: '#666666',
          allowNull: true
        }, { transaction });
      }

      if (!columns.prize_2_color_hex) {
        await queryInterface.addColumn('game_sessions', 'prize_2_color_hex', {
          type: Sequelize.STRING(7),
          defaultValue: '#666666',
          allowNull: true
        }, { transaction });
      }

      if (!columns.prize_3_color_hex) {
        await queryInterface.addColumn('game_sessions', 'prize_3_color_hex', {
          type: Sequelize.STRING(7),
          defaultValue: '#666666',
          allowNull: true
        }, { transaction });
      }

      // Add wheel support fields
      if (!columns.wheel_segments) {
        await queryInterface.addColumn('game_sessions', 'wheel_segments', {
          type: Sequelize.JSON,
          allowNull: true,
          comment: 'Wheel segments for roulette game'
        }, { transaction });
      }

      if (!columns.wheel_speed) {
        await queryInterface.addColumn('game_sessions', 'wheel_speed', {
          type: Sequelize.INTEGER,
          defaultValue: 20,
          allowNull: false
        }, { transaction });
      }

      // Add mystery box support fields
      if (!columns.mystery_enabled) {
        await queryInterface.addColumn('game_sessions', 'mystery_enabled', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        }, { transaction });
      }

      if (!columns.mystery_categories) {
        await queryInterface.addColumn('game_sessions', 'mystery_categories', {
          type: Sequelize.JSON,
          defaultValue: [],
          allowNull: false
        }, { transaction });
      }

      // Add gacha system support fields
      if (!columns.gacha_enabled) {
        await queryInterface.addColumn('game_sessions', 'gacha_enabled', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        }, { transaction });
      }

      if (!columns.gacha_rates) {
        await queryInterface.addColumn('game_sessions', 'gacha_rates', {
          type: Sequelize.JSON,
          defaultValue: {
            'common': 0.60,
            'uncommon': 0.25,
            'rare': 0.10,
            'epic': 0.04,
            'legendary': 0.01
          },
          allowNull: false
        }, { transaction });
      }

      if (!columns.gacha_pity_count) {
        await queryInterface.addColumn('game_sessions', 'gacha_pity_count', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false
        }, { transaction });
      }

      // Add statistics fields
      if (!columns.view_count) {
        await queryInterface.addColumn('game_sessions', 'view_count', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false
        }, { transaction });
      }

      if (!columns.result_event_count) {
        await queryInterface.addColumn('game_sessions', 'result_event_count', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false
        }, { transaction });
      }

      if (!columns.share_count) {
        await queryInterface.addColumn('game_sessions', 'share_count', {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false
        }, { transaction });
      }

      await transaction.commit();
      console.log('✅ Migration 015: Added Week 2 fields to game_sessions');
    } catch (err) {
      await transaction.rollback();
      console.error('❌ Migration 015 error:', err.message);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      const columns = await queryInterface.describeTable('game_sessions');

      if (columns.prize_1_rarity) await queryInterface.removeColumn('game_sessions', 'prize_1_rarity', { transaction });
      if (columns.prize_2_rarity) await queryInterface.removeColumn('game_sessions', 'prize_2_rarity', { transaction });
      if (columns.prize_3_rarity) await queryInterface.removeColumn('game_sessions', 'prize_3_rarity', { transaction });
      if (columns.prize_1_color_hex) await queryInterface.removeColumn('game_sessions', 'prize_1_color_hex', { transaction });
      if (columns.prize_2_color_hex) await queryInterface.removeColumn('game_sessions', 'prize_2_color_hex', { transaction });
      if (columns.prize_3_color_hex) await queryInterface.removeColumn('game_sessions', 'prize_3_color_hex', { transaction });
      if (columns.wheel_segments) await queryInterface.removeColumn('game_sessions', 'wheel_segments', { transaction });
      if (columns.wheel_speed) await queryInterface.removeColumn('game_sessions', 'wheel_speed', { transaction });
      if (columns.mystery_enabled) await queryInterface.removeColumn('game_sessions', 'mystery_enabled', { transaction });
      if (columns.mystery_categories) await queryInterface.removeColumn('game_sessions', 'mystery_categories', { transaction });
      if (columns.gacha_enabled) await queryInterface.removeColumn('game_sessions', 'gacha_enabled', { transaction });
      if (columns.gacha_rates) await queryInterface.removeColumn('game_sessions', 'gacha_rates', { transaction });
      if (columns.gacha_pity_count) await queryInterface.removeColumn('game_sessions', 'gacha_pity_count', { transaction });
      if (columns.view_count) await queryInterface.removeColumn('game_sessions', 'view_count', { transaction });
      if (columns.result_event_count) await queryInterface.removeColumn('game_sessions', 'result_event_count', { transaction });
      if (columns.share_count) await queryInterface.removeColumn('game_sessions', 'share_count', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
