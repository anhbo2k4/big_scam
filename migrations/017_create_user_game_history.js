module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const columns = await queryInterface.describeTable('user_game_histories');
      console.log('⚠️ Table user_game_histories already exists, skipping migration 017');
      return;
    } catch (err) {
      // Table doesn't exist, proceed with creation
    }

    return queryInterface.createTable('user_game_histories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'Reference to user (nullable for guest plays)'
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'GameSessions',
          key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'Reference to game session'
      },
      session_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Session code for quick lookup'
      },
      game_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Type of game played (boxes, wheel, scratch, mystery, gacha, dice, cards)'
      },
      player_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Player name at time of play'
      },
      player_phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Player phone at time of play'
      },
      player_email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Player email at time of play'
      },
      player_ip: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'Player IP address'
      },
      player_device: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'User agent / device info'
      },
      
      // Prize Results
      selected_box: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Which box was selected (1, 2, 3)'
      },
      won_prize: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'The prize name they won'
      },
      prize_value: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Cash value of prize if applicable'
      },
      is_special: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether prize is special/bonus'
      },
      is_unlucky: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this was unlucky prize'
      },

      // Game Mechanics
      game_duration_ms: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Duration of game in milliseconds'
      },
      boxes_opened_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'How many boxes were opened'
      },
      game_actions: {
        type: Sequelize.JSON,
        defaultValue: [],
        comment: 'Detailed array of game actions (clicks, selections, timings)'
      },

      // Status Tracking
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether game was completed'
      },
      form_submitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether player submitted form'
      },

      // Timestamps
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW
      }
    }, {
      tableName: 'user_game_histories',
      underscored: true,
      indexes: [
        { fields: ['session_id'] },
        { fields: ['session_code'] },
        { fields: ['user_id'] },
        { fields: ['created_at'] },
        { fields: ['user_id', 'created_at'] },
        { fields: ['completed'] }
      ]
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTableIfExists('user_game_histories');
  }
};
