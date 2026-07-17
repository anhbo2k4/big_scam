module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'trust_score', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
        comment: 'Điểm tín nhiệm người dùng (0-100)'
      });
      console.log('✅ Added trust_score to users');
    } catch (error) {
      if (!error.message.includes('already exists') && !error.message.includes('Duplicate column')) {
        throw error;
      }
      console.log('ℹ️ trust_score already exists on users');
    }

    try {
      await queryInterface.addColumn('game_sessions', 'wallet_manual_amount', {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: null,
        comment: 'Số tiền ví do admin chỉnh trực tiếp cho phiên'
      });
      console.log('✅ Added wallet_manual_amount to game_sessions');
    } catch (error) {
      if (!error.message.includes('already exists') && !error.message.includes('Duplicate column')) {
        throw error;
      }
      console.log('ℹ️ wallet_manual_amount already exists on game_sessions');
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('users', 'trust_score');
    } catch (error) {}

    try {
      await queryInterface.removeColumn('game_sessions', 'wallet_manual_amount');
    } catch (error) {}
  }
};
