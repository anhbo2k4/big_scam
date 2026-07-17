const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ChatMessage = sequelize.define('ChatMessage', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        session_code: {
            type: DataTypes.STRING(50),
            allowNull: true,
            index: true,
            comment: 'Session code if user is in game'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'User ID if logged in'
        },
        sender_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'Khách hàng'
        },
        sender_type: {
            type: DataTypes.ENUM('customer', 'support', 'bot'),
            allowNull: false,
            defaultValue: 'customer',
            comment: 'Sender type: customer/support/bot'
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Chat message content'
        },
        message_type: {
            type: DataTypes.ENUM('text', 'image', 'file', 'quick_reply', 'system'),
            defaultValue: 'text',
            comment: 'Type of message'
        },
        attachment_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'URL for image/file attachments'
        },
        attachment_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Type of attachment: image, file, etc'
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Message read status'
        },
        read_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When message was read'
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Additional metadata'
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
        tableName: 'chat_messages',
        timestamps: false,
        indexes: [
            { fields: ['session_code', 'created_at'] },
            { fields: ['session_code'] },
            { fields: ['user_id'] },
            { fields: ['sender_type'] },
            { fields: ['created_at'] }
        ]
    });

    return ChatMessage;
};
