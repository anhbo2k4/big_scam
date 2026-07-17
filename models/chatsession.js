const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ChatSession = sequelize.define('ChatSession', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        session_code: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true,
            index: true
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
        customer_ip: {
            type: DataTypes.STRING(50),
            allowNull: true,
            index: true,
            comment: 'Customer IP address for session tracking'
        },
        avatar_url: {
            type: DataTypes.STRING(500),
            defaultValue: 'https://i.pravatar.cc/50?img=default'
        },
        support_agent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Assigned support agent'
        },
        support_agent_name: {
            type: DataTypes.STRING(100),
            defaultValue: 'Hồng Ngọc',
            comment: 'Support agent display name'
        },
        support_agent_avatar: {
            type: DataTypes.STRING(500),
            defaultValue: 'https://i.pravatar.cc/50?img=5'
        },
        status: {
            type: DataTypes.ENUM('active', 'waiting', 'closed', 'archived'),
            defaultValue: 'active',
            comment: 'Chat session status'
        },
        priority: {
            type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
            defaultValue: 'normal'
        },
        topic: {
            type: DataTypes.STRING(200),
            allowNull: true,
            comment: 'Chat topic/subject'
        },
        issue_description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Customer issue description'
        },
        resolution: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'How issue was resolved'
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
            allowNull: true,
            validate: { min: 1, max: 5 }
        },
        satisfaction_feedback: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tags: {
            type: DataTypes.JSON,
            defaultValue: [],
            comment: 'Tags for categorizing chats'
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
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW
        }
    }, {
        tableName: 'chat_sessions',
        timestamps: false,
        indexes: [
            { fields: ['session_code'] },
            { fields: ['user_id'] },
            { fields: ['support_agent_id'] },
            { fields: ['status'] },
            { fields: ['created_at'] }
        ]
    });

    return ChatSession;
};
