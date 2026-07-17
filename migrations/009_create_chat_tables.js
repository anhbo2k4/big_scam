module.exports = {
  name: '009_create_chat_tables',
  async up(sequelize) {
    const { DataTypes } = require('sequelize');

    // Create chat_sessions table
    await sequelize.getQueryInterface().createTable('chat_sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      session_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      customer_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      customer_phone: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      customer_email: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      avatar_url: {
        type: DataTypes.STRING(500),
        defaultValue: 'https://i.pravatar.cc/50?img=default'
      },
      support_agent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      support_agent_name: {
        type: DataTypes.STRING(100),
        defaultValue: 'Hồng Ngọc'
      },
      support_agent_avatar: {
        type: DataTypes.STRING(500),
        defaultValue: 'https://i.pravatar.cc/50?img=5'
      },
      status: {
        type: DataTypes.ENUM('active', 'waiting', 'closed', 'archived'),
        defaultValue: 'active'
      },
      priority: {
        type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
        defaultValue: 'normal'
      },
      topic: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      issue_description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      resolution: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      message_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      unread_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      first_response_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      resolved_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      closed_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      customer_satisfaction: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      satisfaction_feedback: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tags: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    // Create chat_messages table
    await sequelize.getQueryInterface().createTable('chat_messages', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      session_code: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      sender_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Khách hàng'
      },
      sender_type: {
        type: DataTypes.ENUM('customer', 'support', 'bot'),
        allowNull: false,
        defaultValue: 'customer'
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      message_type: {
        type: DataTypes.ENUM('text', 'image', 'file', 'quick_reply', 'system'),
        defaultValue: 'text'
      },
      attachment_url: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      attachment_type: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      read_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    console.log('✅ Migration 009: Chat tables created successfully');
  },

  async down(sequelize) {
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.dropTable('chat_messages', { force: true });
    await queryInterface.dropTable('chat_sessions', { force: true });
    console.log('✅ Migration 009 rollback: Chat tables dropped');
  }
};
