module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('game_sessions', 'trust_score', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
        comment: 'Điểm tín nhiệm theo phiên chơi (0-100)'
      });
      console.log('✅ Added trust_score to game_sessions');
    } catch (error) {
      if (!error.message.includes('already exists') && !error.message.includes('Duplicate column')) {
        throw error;
      }
      console.log('ℹ️ trust_score already exists on game_sessions');
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('game_sessions', 'trust_score');
    } catch (error) {}
  }
};
