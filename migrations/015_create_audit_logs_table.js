module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      session_code: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Reference to GameSession'
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Type of action: SESSION_CREATE, BOX_OPEN, RESULT_VIEW, etc'
      },
      ip_address: {
        type: Sequelize.STRING,
        comment: 'Client IP address'
      },
      user_agent: {
        type: Sequelize.TEXT,
        comment: 'Browser user agent string'
      },
      details: {
        type: Sequelize.JSON,
        defaultValue: {},
        comment: 'Additional action details'
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'SUCCESS',
        comment: 'SUCCESS or FAILURE'
      },
      error_message: Sequelize.TEXT,
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for fast queries
    await queryInterface.addIndex('audit_logs', ['session_code']);
    await queryInterface.addIndex('audit_logs', ['action']);
    await queryInterface.addIndex('audit_logs', ['ip_address']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('audit_logs');
  }
};
