const { ChatMessage, ChatSession, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllChatSessions = async (req, res) => {
    try {
        const { search, category, status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let where = {};
        if (search) {
            where[Op.or] = [
                { customer_name: { [Op.like]: `%${search}%` } },
                { customer_email: { [Op.like]: `%${search}%` } },
                { customer_phone: { [Op.like]: `%${search}%` } }
            ];
        }
        if (category) where.category = category;
        if (status) where.status = status;

        const { count, rows } = await ChatSession.findAndCountAll({
            where,
            order: [['updatedAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('❌ Error getting chat sessions:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getChatMessages = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const messages = await ChatMessage.findAll({
            where: { chat_session_id: sessionId },
            order: [['createdAt', 'ASC']],
            include: [{ model: User, as: 'sender', attributes: ['id', 'username', 'full_name'] }]
        });

        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('❌ Error getting chat messages:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.sendAdminMessage = async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        const adminId = req.user?.id || 1;

        const chatMessage = await ChatMessage.create({
            chat_session_id: sessionId,
            sender_id: adminId,
            message_text: message,
            message_type: 'admin',
            is_read: false
        });

        
        await ChatSession.update(
            { last_message_at: new Date(), status: 'in_progress' },
            { where: { id: sessionId } }
        );

        res.json({ success: true, data: chatMessage });
    } catch (error) {
        console.error('❌ Error sending admin message:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markChatResolved = async (req, res) => {
    try {
        const { sessionId } = req.params;

        await ChatSession.update(
            { status: 'resolved', resolved_at: new Date() },
            { where: { id: sessionId } }
        );

        res.json({ success: true, message: 'Chat đã được đánh dấu là hoàn tất' });
    } catch (error) {
        console.error('❌ Error marking chat resolved:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteChat = async (req, res) => {
    try {
        const { sessionId } = req.params;

        
        await ChatMessage.destroy({
            where: { chat_session_id: sessionId }
        });

        
        await ChatSession.destroy({
            where: { id: sessionId }
        });

        res.json({ success: true, message: 'Chat đã bị xóa' });
    } catch (error) {
        console.error('❌ Error deleting chat:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getChatStats = async (req, res) => {
    try {
        const total = await ChatSession.count();
        const resolved = await ChatSession.count({ where: { status: 'resolved' } });
        const pending = await ChatSession.count({ where: { status: 'pending' } });
        const inProgress = await ChatSession.count({ where: { status: 'in_progress' } });

        const avgResponseTime = await ChatMessage.sequelize.query(`
            SELECT AVG(TIMESTAMPDIFF(MINUTE, 
                (SELECT MAX(created_at) FROM chat_messages cm2 
                 WHERE cm2.chat_session_id = cm1.chat_session_id AND cm2.message_type = 'customer'),
                (SELECT MIN(created_at) FROM chat_messages cm3 
                 WHERE cm3.chat_session_id = cm1.chat_session_id AND cm3.message_type = 'admin'))) as avg_time
            FROM chat_messages cm1
        `, { type: require('sequelize').QueryTypes.SELECT });

        res.json({
            success: true,
            data: {
                total,
                resolved,
                pending,
                inProgress,
                avgResponseTime: avgResponseTime?.[0]?.avg_time || 0,
                resolutionRate: Math.round((resolved / total) * 100) || 0
            }
        });
    } catch (error) {
        console.error('❌ Error getting chat stats:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await ChatMessage.count({
            where: {
                message_type: 'customer',
                is_read: false
            }
        });

        res.json({ success: true, unreadCount });
    } catch (error) {
        console.error('❌ Error getting unread count:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markSessionRead = async (req, res) => {
    try {
        const { sessionId } = req.params;

        await ChatMessage.update(
            { is_read: true },
            {
                where: {
                    chat_session_id: sessionId,
                    message_type: 'customer'
                }
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error marking session read:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
