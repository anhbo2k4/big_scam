'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('game_sessions', 'currency', {
      type: Sequelize.STRING(10),
      defaultValue: 'VND',
      allowNull: false,
      comment: 'Loại tiền tệ cho phiên: VND, USD, NDT'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('game_sessions', 'currency');
  }
};
