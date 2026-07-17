module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('prizes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      game_session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Reference to GameSession'
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Position (1-50)'
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      description: Sequelize.TEXT,
      icon: {
        type: Sequelize.STRING,
        defaultValue: '🎁'
      },
      image_url: Sequelize.TEXT,
      cash_amount: {
        type: Sequelize.BIGINT,
        comment: 'Cash prize amount'
      },
      rarity: {
        type: Sequelize.ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
        defaultValue: 'common'
      },
      color_hex: {
        type: Sequelize.STRING(7),
        defaultValue: '#666666',
        comment: 'Hex color for display'
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'NORMAL'
      },
      is_special: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      weight: {
        type: Sequelize.FLOAT,
        defaultValue: 1.0,
        comment: 'Weight for gacha pulls'
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });

    // Add indexes
    await queryInterface.addIndex('prizes', ['game_session_id']);
    await queryInterface.addIndex('prizes', ['position']);
    await queryInterface.addIndex('prizes', ['rarity']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('prizes');
  }
};
