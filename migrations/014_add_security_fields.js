module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add security fields to GameSessions table
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      const columns = await queryInterface.describeTable('game_sessions');

      // Add server-side random boxes (most critical)
      if (!columns.server_random_boxes) {
        await queryInterface.addColumn('game_sessions', 'server_random_boxes', {
          type: Sequelize.JSON,
          defaultValue: [],
          allowNull: false,
          comment: 'Server-determined box results - NEVER expose to client'
        }, { transaction });
      }

      // Add player token for validation
      if (!columns.player_token) {
        await queryInterface.addColumn('game_sessions', 'player_token', {
          type: Sequelize.STRING(64),
          unique: true,
          allowNull: true,
          comment: 'Unique token per player session for validation'
        }, { transaction });
      }

      // Add result hash for verification
      if (!columns.result_hash) {
        await queryInterface.addColumn('game_sessions', 'result_hash', {
          type: Sequelize.STRING(64),
          allowNull: true,
          comment: 'SHA256 hash of result for verification'
        }, { transaction });
      }

      // Add server random seed
      if (!columns.server_random_seed) {
        await queryInterface.addColumn('game_sessions', 'server_random_seed', {
          type: Sequelize.STRING(128),
          allowNull: true,
          comment: 'Seed used for random generation'
        }, { transaction });
      }

      // Add game type field for future game variations
      if (!columns.game_type) {
        await queryInterface.addColumn('game_sessions', 'game_type', {
          type: Sequelize.ENUM('boxes', 'wheel', 'scratch', 'mystery', 'gacha', 'dice', 'cards'),
          defaultValue: 'boxes',
          comment: 'Type of lottery game'
        }, { transaction });
      }

      // Add box count for flexibility
      if (!columns.box_count) {
        await queryInterface.addColumn('game_sessions', 'box_count', {
          type: Sequelize.INTEGER,
          defaultValue: 3,
          comment: 'Number of boxes for this session'
        }, { transaction });
      }

      // Add fraud detection fields
      if (!columns.fraud_flag) {
        await queryInterface.addColumn('game_sessions', 'fraud_flag', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          comment: 'Whether this session is flagged as fraudulent'
        }, { transaction });
      }

      if (!columns.fraud_reason) {
        await queryInterface.addColumn('game_sessions', 'fraud_reason', {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: 'Reason for fraud flag'
        }, { transaction });
      }

      // Create indexes if they don't already exist
      try {
        await queryInterface.addIndex('game_sessions', ['player_token'], { transaction });
      } catch (e) { /* index might already exist */ }

      try {
        await queryInterface.addIndex('game_sessions', ['result_hash'], { transaction });
      } catch (e) { /* index might already exist */ }

      try {
        await queryInterface.addIndex('game_sessions', ['server_random_seed'], { transaction });
      } catch (e) { /* index might already exist */ }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      const columns = await queryInterface.describeTable('game_sessions');

      if (columns.server_random_boxes) {
        await queryInterface.removeColumn('game_sessions', 'server_random_boxes', { transaction });
      }
      if (columns.player_token) {
        await queryInterface.removeColumn('game_sessions', 'player_token', { transaction });
      }
      if (columns.result_hash) {
        await queryInterface.removeColumn('game_sessions', 'result_hash', { transaction });
      }
      if (columns.server_random_seed) {
        await queryInterface.removeColumn('game_sessions', 'server_random_seed', { transaction });
      }
      if (columns.game_type) {
        await queryInterface.removeColumn('game_sessions', 'game_type', { transaction });
      }
      if (columns.box_count) {
        await queryInterface.removeColumn('game_sessions', 'box_count', { transaction });
      }
      if (columns.fraud_flag) {
        await queryInterface.removeColumn('game_sessions', 'fraud_flag', { transaction });
      }
      if (columns.fraud_reason) {
        await queryInterface.removeColumn('game_sessions', 'fraud_reason', { transaction });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
