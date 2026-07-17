module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const normalizedTables = tables.map((t) => (typeof t === 'string' ? t : t.tableName || t.table_name));

    if (normalizedTables.includes('conversion_requests')) {
      return;
    }

    await queryInterface.createTable('conversion_requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      session_code: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      box_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      prize_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      },
      requested_by: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      requested_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      approved_by: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('conversion_requests', ['session_code']);
    await queryInterface.addIndex('conversion_requests', ['status']);
    await queryInterface.addIndex('conversion_requests', ['session_code', 'box_number']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('conversion_requests');
  }
};
