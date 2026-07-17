module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Add rarity field to GameSession for better organization
      await queryInterface.addColumn('game_sessions', 'prize_1_rarity', {
        type: Sequelize.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
        defaultValue: 'common',
        comment: 'Prize 1 rarity tier'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'prize_2_rarity', {
        type: Sequelize.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
        defaultValue: 'common'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'prize_3_rarity', {
        type: Sequelize.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
        defaultValue: 'common'
      }, { transaction });

      // Add color/visual representation
      await queryInterface.addColumn('game_sessions', 'prize_1_color_hex', {
        type: Sequelize.STRING(7),
        defaultValue: '#666666',
        comment: 'Hex color for prize 1'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'prize_2_color_hex', {
        type: Sequelize.STRING(7),
        defaultValue: '#666666'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'prize_3_color_hex', {
        type: Sequelize.STRING(7),
        defaultValue: '#666666'
      }, { transaction });

      // Add support for more boxes (5, 10, 16, 25, 50+)
      // For now, we'll support up to 50 prizes
      for (let i = 4; i <= 50; i++) {
        await queryInterface.addColumn('game_sessions', `prize_${i}`, {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: `Prize ${i}`
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `prize_${i}_description`, {
          type: Sequelize.TEXT,
          allowNull: true
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `prize_${i}_icon`, {
          type: Sequelize.STRING,
          defaultValue: '🎁'
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `prize_${i}_status`, {
          type: Sequelize.STRING,
          defaultValue: 'NORMAL'
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `prize_${i}_is_special`, {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `prize_${i}_cash`, {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `prize_${i}_cash_amount`, {
          type: Sequelize.BIGINT,
          allowNull: true
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `prize_${i}_image_url`, {
          type: Sequelize.TEXT,
          allowNull: true
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `prize_${i}_approved`, {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `prize_${i}_rarity`, {
          type: Sequelize.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
          defaultValue: 'common'
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `prize_${i}_color_hex`, {
          type: Sequelize.STRING(7),
          defaultValue: '#666666'
        }, { transaction });

        await queryInterface.addColumn('game_sessions', `box_${i}_opened`, {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }, { transaction });
      }

      // Add wheel game support (for future wheel game)
      await queryInterface.addColumn('game_sessions', 'wheel_segments', {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Wheel segments for roulette game'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'wheel_speed', {
        type: Sequelize.INTEGER,
        defaultValue: 20,
        comment: 'Wheel spin speed (1-100)'
      }, { transaction });

      // Add mystery box support
      await queryInterface.addColumn('game_sessions', 'mystery_enabled', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Enable mystery/blind box mode'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'mystery_categories', {
        type: Sequelize.JSON,
        defaultValue: [],
        comment: 'Categories for mystery boxes'
      }, { transaction });

      // Add gacha system support
      await queryInterface.addColumn('game_sessions', 'gacha_enabled', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Enable gacha system'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'gacha_rates', {
        type: Sequelize.JSON,
        defaultValue: { 'common': 0.60, 'uncommon': 0.25, 'rare': 0.10, 'epic': 0.04, 'legendary': 0.01 },
        comment: 'Gacha pull rates'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'gacha_pity_count', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Current pity count for guaranteed drops'
      }, { transaction });

      // Add analytics fields
      await queryInterface.addColumn('game_sessions', 'view_count', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Number of times viewed'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'share_count', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Number of times shared'
      }, { transaction });

      await queryInterface.addColumn('game_sessions', 'completion_time_seconds', {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'How long it took to complete'
      }, { transaction });

      // Add indexes for performance
      await queryInterface.addIndex('game_sessions', ['game_type'], { transaction });
      await queryInterface.addIndex('game_sessions', ['box_count'], { transaction });
      await queryInterface.addIndex('game_sessions', ['view_count'], { transaction });
      await queryInterface.addIndex('game_sessions', ['is_completed'], { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remove rarity fields
      await queryInterface.removeColumn('game_sessions', 'prize_1_rarity', { transaction });
      await queryInterface.removeColumn('game_sessions', 'prize_2_rarity', { transaction });
      await queryInterface.removeColumn('game_sessions', 'prize_3_rarity', { transaction });

      // Remove color fields
      await queryInterface.removeColumn('game_sessions', 'prize_1_color_hex', { transaction });
      await queryInterface.removeColumn('game_sessions', 'prize_2_color_hex', { transaction });
      await queryInterface.removeColumn('game_sessions', 'prize_3_color_hex', { transaction });

      // Remove prize 4-50 fields
      for (let i = 4; i <= 50; i++) {
        try {
          await queryInterface.removeColumn('game_sessions', `prize_${i}`, { transaction });
          await queryInterface.removeColumn('game_sessions', `prize_${i}_description`, { transaction });
          await queryInterface.removeColumn('game_sessions', `prize_${i}_icon`, { transaction });
          await queryInterface.removeColumn('game_sessions', `prize_${i}_status`, { transaction });
          await queryInterface.removeColumn('game_sessions', `prize_${i}_is_special`, { transaction });
          await queryInterface.removeColumn('game_sessions', `prize_${i}_cash`, { transaction });
          await queryInterface.removeColumn('game_sessions', `prize_${i}_cash_amount`, { transaction });
          await queryInterface.removeColumn('game_sessions', `prize_${i}_image_url`, { transaction });
          await queryInterface.removeColumn('game_sessions', `prize_${i}_approved`, { transaction });
          await queryInterface.removeColumn('game_sessions', `prize_${i}_rarity`, { transaction });
          await queryInterface.removeColumn('game_sessions', `prize_${i}_color_hex`, { transaction });
          await queryInterface.removeColumn('game_sessions', `box_${i}_opened`, { transaction });
        } catch (e) {
          // Skip if column doesn't exist
        }
      }

      // Remove game feature columns
      await queryInterface.removeColumn('game_sessions', 'wheel_segments', { transaction });
      await queryInterface.removeColumn('game_sessions', 'wheel_speed', { transaction });
      await queryInterface.removeColumn('game_sessions', 'mystery_enabled', { transaction });
      await queryInterface.removeColumn('game_sessions', 'mystery_categories', { transaction });
      await queryInterface.removeColumn('game_sessions', 'gacha_enabled', { transaction });
      await queryInterface.removeColumn('game_sessions', 'gacha_rates', { transaction });
      await queryInterface.removeColumn('game_sessions', 'gacha_pity_count', { transaction });

      // Remove analytics
      await queryInterface.removeColumn('game_sessions', 'view_count', { transaction });
      await queryInterface.removeColumn('game_sessions', 'share_count', { transaction });
      await queryInterface.removeColumn('game_sessions', 'completion_time_seconds', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
