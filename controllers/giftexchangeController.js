const { GiftExchange, User } = require('../models');
const sseChat = require('../services/sseChat');

const emitAdminRealtime = (req, event, payload = {}) => {
  try {
    sseChat.sendAdminEvent(event, payload);
  } catch (err) {
    // Ignore realtime emit failures to avoid breaking API flow.
  }
};

module.exports = {
  
  async list(req, res) {
    try {
      const { status, userId, sessionCode, page = 1, limit = 10 } = req.query;
      const where = {};
      
      // If sessionCode provided, filter by it
      if (sessionCode) {
        where.session_code = sessionCode.toUpperCase();
      }
      
      // If no status specified, show both pending and pending_approval
      if (status) {
        where.status = status;
      } else if (!sessionCode) {
        // Only default filter if not searching by session code
        where.status = ['pending', 'pending_approval'];
      }
      
      if (userId) where.user_id = userId;

      const offset = (page - 1) * limit;

      const { count, rows } = await GiftExchange.findAndCountAll({
        where,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'full_name']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error listing gift exchanges:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi lấy danh sách phê duyệt quà tặng',
        error: error.message 
      });
    }
  },

  
  async getById(req, res) {
    try {
      const { id } = req.params;
      const giftExchange = await GiftExchange.findByPk(id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'full_name']
        }]
      });

      if (!giftExchange) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy yêu cầu quà tặng' 
        });
      }

      res.json({ success: true, data: giftExchange });
    } catch (error) {
      console.error('Error getting gift exchange:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi lấy thông tin quà tặng' 
      });
    }
  },

  
  async create(req, res) {
    try {
      const { user_id, session_id, recipient_name, address, phone, notes, prize_info, session_code, customer_name, customer_phone, customer_email } = req.body;
      const normalizedSessionCode = String(session_code || '').trim().toUpperCase();

      
      if (!user_id || !recipient_name || !address || !phone) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng cung cấp đầy đủ thông tin' 
        });
      }

      
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Người dùng không tồn tại' 
        });
      }

      
      let boxData = null;
      if (normalizedSessionCode) {
        const { GameSession } = require('../models');
        const session = await GameSession.findOne({ where: { session_code: normalizedSessionCode } });
        if (session && session.player_selected_box) {
          boxData = {
            session_code: normalizedSessionCode,
            selected_box_number: session.player_selected_box,
            prize_name: session[`prize_${session.player_selected_box}`],
            selected_at: session.player_selected_at,
            player_contact: {
              name: customer_name || session.player_name,
              phone: customer_phone || phone,
              email: customer_email || session.player_email
            },
            box_selection_snapshot: {
              box_number: session.player_selected_box,
              prize_name: session[`prize_${session.player_selected_box}`],
              selected_at: session.player_selected_at
            }
          };
        }
      }

      const giftExchange = await GiftExchange.create({
        user_id,
        session_id: session_id || null,
        recipient_name,
        address,
        phone,
        notes: notes || null,
        prize_info: prize_info || null,
        customer_name: customer_name || 'Khách hàng',
        customer_phone,
        customer_email,
        session_code: normalizedSessionCode || null,
        status: 'pending',
        ...boxData
      });

      emitAdminRealtime(req, 'new_gift', {
        id: giftExchange.id,
        session_code: giftExchange.session_code || null,
        status: giftExchange.status || 'pending'
      });

      res.status(201).json({ 
        success: true, 
        message: 'Tạo yêu cầu quà tặng thành công',
        data: giftExchange 
      });
    } catch (error) {
      console.error('Error creating gift exchange:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi tạo yêu cầu quà tặng',
        error: error.message 
      });
    }
  },

  
  async approve(req, res) {
    try {
      const { id } = req.params;
      const giftExchange = await GiftExchange.findByPk(id, {
        include: [{ model: User, as: 'user' }]
      });

      if (!giftExchange) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy yêu cầu quà tặng' 
        });
      }

      await giftExchange.update({ status: 'approved' });

      emitAdminRealtime(req, 'gift_status_updated', {
        id: giftExchange.id,
        status: 'approved',
        session_code: giftExchange.session_code || null
      });

      if (giftExchange.session_code) {
        sseChat.sendNotification(giftExchange.session_code, 'gift_approved', {
          level: 'success',
          title: 'Quà đã được duyệt',
          message: 'Yêu cầu nhận quà của bạn đã được admin duyệt.',
          giftExchangeId: giftExchange.id,
          status: 'approved'
        });
      }

      // Track redemption in history
      try {
        const { PrizeRedemptionHistory, GameSession } = require('../models');
        
        // Get associated game session if available
        let sessionId = giftExchange.session_id;
        let sessionCode = giftExchange.session_code;
        let prizeName = 'Quà tặng';
        
        if (!sessionCode && giftExchange.session_code) {
          sessionCode = giftExchange.session_code;
        }

        if (sessionId) {
          const session = await GameSession.findByPk(sessionId);
          if (session) {
            const boxNum = giftExchange.box_selection_snapshot?.box_number || 1;
            prizeName = session[`prize_${boxNum}`] || 'Quà tặng';
          }
        }

        const redemptionHistory = await PrizeRedemptionHistory.create({
          user_id: giftExchange.user_id,
          session_id: sessionId,
          session_code: sessionCode || 'UNKNOWN',
          prize_name: prizeName,
          redemption_method: 'gift_exchange',
          gift_exchange_id: giftExchange.id,
          gift_exchange_status: 'approved',
          recipient_name: giftExchange.recipient_name,
          recipient_address: giftExchange.address,
          recipient_phone: giftExchange.phone,
          approved_at: new Date(),
          current_status: 'approved'
        });

        // Broadcast via WebSocket
        if (req.app && req.app.locals && req.app.locals.historyWS) {
          req.app.locals.historyWS.broadcastRedemptionStatusUpdate(
            redemptionHistory.id,
            'approved',
            { 
              giftExchangeId: giftExchange.id,
              recipient: giftExchange.recipient_name,
              address: giftExchange.address 
            }
          );
          console.log('🎁 Gift exchange approval broadcasted via WebSocket');
        }
      } catch (historyErr) {
        console.error('⚠️ Error tracking redemption history:', historyErr.message);
        // Continue even if tracking fails
      }

      res.json({ 
        success: true, 
        message: 'Duyệt yêu cầu quà tặng thành công',
        data: giftExchange 
      });
    } catch (error) {
      console.error('Error approving gift exchange:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi duyệt yêu cầu quà tặng' 
      });
    }
  },

  
  async reject(req, res) {
    try {
      const { id } = req.params;
      const { rejection_reason } = req.body;
      
      const giftExchange = await GiftExchange.findByPk(id);

      if (!giftExchange) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy yêu cầu quà tặng' 
        });
      }

      await giftExchange.update({ 
        status: 'rejected',
        rejection_reason: rejection_reason || null
      });

      emitAdminRealtime(req, 'gift_status_updated', {
        id: giftExchange.id,
        status: 'rejected',
        session_code: giftExchange.session_code || null
      });

      if (giftExchange.session_code) {
        sseChat.sendNotification(giftExchange.session_code, 'gift_rejected', {
          level: 'error',
          title: 'Quà bị từ chối',
          message: rejection_reason || 'Yêu cầu nhận quà của bạn đã bị từ chối.',
          giftExchangeId: giftExchange.id,
          status: 'rejected'
        });
      }

      res.json({ 
        success: true, 
        message: 'Từ chối yêu cầu quà tặng thành công',
        data: giftExchange 
      });
    } catch (error) {
      console.error('Error rejecting gift exchange:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi từ chối yêu cầu quà tặng' 
      });
    }
  },

  
  async delete(req, res) {
    try {
      const { id } = req.params;
      const giftExchange = await GiftExchange.findByPk(id);

      if (!giftExchange) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy yêu cầu quà tặng' 
        });
      }

      await giftExchange.destroy();

      res.json({ 
        success: true, 
        message: 'Xóa yêu cầu quà tặng thành công' 
      });
    } catch (error) {
      console.error('Error deleting gift exchange:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi xóa yêu cầu quà tặng' 
      });
    }
  }
};
