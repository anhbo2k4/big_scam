module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const columns = await queryInterface.describeTable('prize_redemption_histories');
      console.log('⚠️ Table prize_redemption_histories already exists, skipping migration 018');
      return;
    } catch (err) {
      // Table doesn't exist, proceed with creation
    }

    return queryInterface.createTable('prize_redemption_histories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'Reference to user'
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
        comment: 'Session code'
      },

      // Prize Details
      prize_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Name of the prize'
      },
      prize_description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Prize description'
      },
      prize_value: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Cash value if applicable'
      },
      prize_image_url: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Prize image URL'
      },

      // Redemption Method
      redemption_method: {
        type: Sequelize.ENUM('withdrawal', 'gift_exchange', 'direct'),
        allowNull: false,
        comment: 'How the prize is being redeemed'
      },

      // For Withdrawal
      withdrawal_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Withdrawals',
          key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'Reference to withdrawal if applicable'
      },
      withdrawal_status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending',
        comment: 'Current status of withdrawal'
      },
      withdrawal_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Withdrawal amount'
      },
      bank_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Bank name for withdrawal'
      },
      bank_account: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Bank account number (masked)'
      },

      // For Gift Exchange
      gift_exchange_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'GiftExchanges',
          key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'Reference to gift exchange if applicable'
      },
      gift_exchange_status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'shipped', 'delivered'),
        defaultValue: 'pending',
        comment: 'Current status of gift exchange'
      },
      recipient_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Recipient name for gift'
      },
      recipient_address: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Delivery address'
      },
      recipient_phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Recipient phone'
      },
      shipping_provider: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Shipping company name'
      },
      tracking_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Shipping tracking number'
      },

      // Timeline
      requested_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: 'When prize redemption was requested'
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When prize redemption was approved'
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When prize was delivered/completed'
      },
      rejected_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When prize redemption was rejected'
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Reason for rejection if applicable'
      },

      // Status
      current_status: {
        type: Sequelize.ENUM('pending', 'approved', 'completed', 'rejected'),
        defaultValue: 'pending',
        comment: 'Overall redemption status'
      },
      status_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Admin notes on status'
      },

      // Tracking
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
      tableName: 'prize_redemption_histories',
      underscored: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['session_id'] },
        { fields: ['session_code'] },
        { fields: ['redemption_method'] },
        { fields: ['current_status'] },
        { fields: ['created_at'] },
        { fields: ['user_id', 'created_at'] }
      ]
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTableIfExists('prize_redemption_histories');
  }
};
