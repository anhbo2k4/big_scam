/**
 * History Controller
 * Manages game and user activity tracking and retrieval
 */

const fs = require('fs');
const path = require('path');
const { User, GameSession, Withdrawal, GiftExchange, AuditLog } = require('../models');
const { Op } = require('sequelize');

// Types of trackable actions
const ACTION_TYPES = {
  BOX_OPENED: 'box_opened',
  PRIZE_CLAIMED: 'prize_claimed',
  FORM_SUBMITTED: 'form_submitted',
  WITHDRAWAL_CREATED: 'withdrawal_created',
  WITHDRAWAL_APPROVED: 'withdrawal_approved',
  WITHDRAWAL_REJECTED: 'withdrawal_rejected',
  LOGIN: 'login',
  LOGOUT: 'logout',
  USER_CREATED: 'user_created',
  USER_DELETED: 'user_deleted',
  USER_UPDATED: 'user_updated',
  SETTINGS_CHANGED: 'settings_changed',
  EXPORT: 'export',
  SESSION_CREATED: 'session_created',
  SESSION_COMPLETED: 'session_completed'
};

/**
 * Log an action to the audit trail
 */
async function logAction(userId, action, description = '', details = {}, status = 'success') {
  try {
    const log = await AuditLog.create({
      user_id: userId,
      action,
      description,
      details: JSON.stringify(details),
      status
    });
    console.log(`📋 Action logged: ${action} by user ${userId}`);
    return log;
  } catch (err) {
    console.error('❌ Error logging action:', err.message);
    return null;
  }
}

/**
 * Get user activity history
 * GET /api/history
 */
async function getUserHistory(req, res) {
  try {
    const { filter = 'all', page = 1, limit = 15, userId } = req.query;
    const offset = (page - 1) * limit;

    // Build query
    let where = {};
    
    if (userId) {
      where.user_id = userId;
    }

    // Apply filters
    if (filter !== 'all') {
      where.action = filter;
    }

    // Get activity logs
    const logs = await AuditLog.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email'],
          as: 'user'
        }
      ]
    });

    // Format response
    const formatted = logs.rows.map(log => ({
      id: log.id,
      user_id: log.user_id,
      user_name: log.user?.username || 'Hệ thống',
      action: log.action,
      description: log.description,
      details: log.details ? JSON.parse(log.details) : {},
      status: log.status,
      created_at: log.created_at
    }));

    res.json({
      success: true,
      data: formatted,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(logs.count / limit),
        count: logs.count
      }
    });
  } catch (err) {
    console.error('❌ Error fetching history:', err.message);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy lịch sử hoạt động'
    });
  }
}

/**
 * Get game session history
 * GET /api/history/sessions
 */
async function getSessionHistory(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const sessions = await GameSession.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email'],
          as: 'user'
        }
      ],
      attributes: ['id', 'user_id', 'box_count', 'selected_box', 'created_at', 'is_completed']
    });

    const formatted = sessions.rows.map(session => ({
      id: session.id,
      user_name: session.user?.username,
      user_email: session.user?.email,
      box_count: session.box_count,
      selected_box: session.selected_box,
      is_completed: session.is_completed,
      created_at: session.created_at
    }));

    res.json({
      success: true,
      data: formatted,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(sessions.count / limit),
        count: sessions.count
      }
    });
  } catch (err) {
    console.error('❌ Error fetching session history:', err.message);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy lịch sử phiên chơi'
    });
  }
}

/**
 * Get user statistics
 * GET /api/history/stats/:userId
 */
async function getUserStats(req, res) {
  try {
    const { userId } = req.params;

    // Check user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    // Get session stats
    const sessionStats = await GameSession.findAll({
      where: { user_id: userId },
      attributes: [
        'id',
        'box_count',
        'selected_box',
        'is_completed',
        'created_at'
      ]
    });

    const totalSessions = sessionStats.length;
    const completedSessions = sessionStats.filter(s => s.is_completed).length;

    // Get withdrawal stats
    const withdrawals = await Withdrawal.findAll({
      where: { user_id: userId },
      attributes: ['id', 'status', 'amount', 'created_at']
    });

    const totalWithdrawals = withdrawals.length;
    const approvedWithdrawals = withdrawals.filter(w => w.status === 'approved').length;
    const totalAmount = withdrawals
      .filter(w => w.status === 'approved')
      .reduce((sum, w) => sum + (w.amount || 0), 0);

    // Get gift exchanges
    const giftsExchanged = await GiftExchange.count({
      where: { user_id: userId }
    });

    // Get recent activity
    const recentLogs = await AuditLog.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        },
        stats: {
          total_sessions: totalSessions,
          completed_sessions: completedSessions,
          session_completion_rate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
          total_withdrawals: totalWithdrawals,
          approved_withdrawals: approvedWithdrawals,
          total_withdrawn_amount: totalAmount,
          gifts_exchanged: giftsExchanged,
          last_activity: recentLogs[0]?.created_at || null
        },
        recent_activities: recentLogs.map(log => ({
          action: log.action,
          description: log.description,
          created_at: log.created_at
        }))
      }
    });
  } catch (err) {
    console.error('❌ Error fetching user stats:', err.message);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thống kê người dùng'
    });
  }
}

/**
 * Get admin activity log
 * GET /api/history/admin-log
 */
async function getAdminLog(req, res) {
  try {
    const { adminId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    
    // If adminId specified, get activities by that admin
    if (adminId) {
      where.user_id = adminId;
      where.action = {
        [Op.in]: [
          ACTION_TYPES.USER_CREATED,
          ACTION_TYPES.USER_DELETED,
          ACTION_TYPES.USER_UPDATED,
          ACTION_TYPES.WITHDRAWAL_APPROVED,
          ACTION_TYPES.WITHDRAWAL_REJECTED,
          ACTION_TYPES.SETTINGS_CHANGED
        ]
      };
    }

    const logs = await AuditLog.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email'],
          as: 'user'
        }
      ]
    });

    const formatted = logs.rows.map(log => ({
      id: log.id,
      admin_name: log.user?.username,
      action: log.action,
      description: log.description,
      details: log.details ? JSON.parse(log.details) : {},
      status: log.status,
      created_at: log.created_at
    }));

    res.json({
      success: true,
      data: formatted,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(logs.count / limit),
        count: logs.count
      }
    });
  } catch (err) {
    console.error('❌ Error fetching admin log:', err.message);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy nhật ký quản trị'
    });
  }
}

/**
 * Export history data
 * GET /api/history/export
 */
async function exportHistory(req, res) {
  try {
    const { format = 'csv', type = 'all' } = req.query;

    let logs = [];

    if (type === 'all' || type === 'activity') {
      logs = await AuditLog.findAll({
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['username'],
            as: 'user'
          }
        ]
      });
    }

    if (format === 'csv') {
      const headers = ['ID', 'Người dùng', 'Hành động', 'Mô tả', 'Trạng thái', 'Thời gian'];
      let csv = headers.join(',') + '\n';

      logs.forEach(log => {
        const row = [
          log.id,
          log.user?.username || 'Hệ thống',
          log.action,
          `"${(log.description || '').replace(/"/g, '""')}"`,
          log.status,
          new Date(log.created_at).toLocaleString('vi-VN')
        ];
        csv += row.join(',') + '\n';
      });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=history-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } else if (format === 'json') {
      res.json({
        success: true,
        data: logs.map(log => ({
          id: log.id,
          user: log.user?.username,
          action: log.action,
          description: log.description,
          status: log.status,
          created_at: log.created_at
        }))
      });
    }
  } catch (err) {
    console.error('❌ Error exporting history:', err.message);
    res.status(500).json({
      success: false,
      message: 'Không thể xuất dữ liệu lịch sử'
    });
  }
}

/**
 * Track game play in UserGameHistory
 */
async function trackGamePlay(req, res) {
  try {
    const { UserGameHistory } = require('../models');
    const {
      user_id,
      session_id,
      session_code,
      game_type,
      player_name,
      player_phone,
      player_email,
      selected_box,
      won_prize,
      prize_value,
      is_special,
      is_unlucky,
      game_duration_ms,
      boxes_opened_count,
      game_actions,
      completed,
      form_submitted
    } = req.body;

    const history = await UserGameHistory.create({
      user_id,
      session_id,
      session_code,
      game_type,
      player_name,
      player_phone,
      player_email,
      player_ip: req.ip,
      player_device: req.get('user-agent'),
      selected_box,
      won_prize,
      prize_value,
      is_special: is_special || false,
      is_unlucky: is_unlucky || false,
      game_duration_ms,
      boxes_opened_count,
      game_actions: game_actions || [],
      completed: completed !== false,
      form_submitted: form_submitted || false
    });

    return history;
  } catch (err) {
    console.error('❌ Error tracking game play:', err.message);
    return null;
  }
}

/**
 * Track prize redemption
 */
async function trackPrizeRedemption(req, res) {
  try {
    const { PrizeRedemptionHistory } = require('../models');
    const {
      user_id,
      session_id,
      session_code,
      prize_name,
      prize_description,
      prize_value,
      prize_image_url,
      redemption_method,
      withdrawal_id,
      gift_exchange_id,
      recipient_name,
      recipient_address,
      recipient_phone
    } = req.body;

    const history = await PrizeRedemptionHistory.create({
      user_id,
      session_id,
      session_code,
      prize_name,
      prize_description,
      prize_value,
      prize_image_url,
      redemption_method,
      withdrawal_id,
      gift_exchange_id,
      recipient_name,
      recipient_address,
      recipient_phone,
      current_status: 'pending'
    });

    return history;
  } catch (err) {
    console.error('❌ Error tracking prize redemption:', err.message);
    return null;
  }
}

/**
 * Get user history by session code
 */
async function getUserHistoryBySession(req, res) {
  try {
    const { UserGameHistory, PrizeRedemptionHistory } = require('../models');
    const { session_code } = req.params;

    const gameHistory = await UserGameHistory.findAll({
      where: { session_code },
      order: [['created_at', 'DESC']]
    });

    const redemptionHistory = await PrizeRedemptionHistory.findAll({
      where: { session_code },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        gameHistory,
        redemptionHistory
      }
    });
  } catch (err) {
    console.error('❌ Error fetching user history:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch user history', error: err.message });
  }
}

/**
 * Get all game plays (admin)
 */
async function getGamePlayHistory(req, res) {
  try {
    const { UserGameHistory } = require('../models');
    const { page = 1, limit = 20, session_code, user_id } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (session_code) where.session_code = session_code;
    if (user_id) where.user_id = user_id;

    const { count, rows } = await UserGameHistory.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
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
  } catch (err) {
    console.error('❌ Error fetching game play history:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch game play history', error: err.message });
  }
}

/**
 * Get all redemption history (admin)
 */
async function getRedemptionHistory(req, res) {
  try {
    const { PrizeRedemptionHistory, User } = require('../models');
    const { page = 1, limit = 20, status, method } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.current_status = status;
    if (method) where.redemption_method = method;

    const { count, rows } = await PrizeRedemptionHistory.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
      include: [{ model: User, attributes: ['id', 'username', 'email'] }]
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
  } catch (err) {
    console.error('❌ Error fetching redemption history:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch redemption history', error: err.message });
  }
}

/**
 * Update redemption status
 */
async function updateRedemptionStatus(req, res) {
  try {
    const { PrizeRedemptionHistory } = require('../models');
    const { id } = req.params;
    const { status, notes, tracking_number } = req.body;

    const history = await PrizeRedemptionHistory.findByPk(id);
    if (!history) {
      return res.status(404).json({ success: false, message: 'Redemption history not found' });
    }

    history.current_status = status;
    history.status_notes = notes;
    if (tracking_number) history.tracking_number = tracking_number;

    // Update timestamps
    if (status === 'approved') history.approved_at = new Date();
    if (status === 'completed') history.completed_at = new Date();
    if (status === 'rejected') history.rejected_at = new Date();

    await history.save();

    res.json({ success: true, data: history });
  } catch (err) {
    console.error('❌ Error updating redemption status:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
}

module.exports = {
  logAction,
  getUserHistory,
  getSessionHistory,
  getUserStats,
  getAdminLog,
  exportHistory,
  trackGamePlay,
  trackPrizeRedemption,
  getUserHistoryBySession,
  getGamePlayHistory,
  getRedemptionHistory,
  updateRedemptionStatus,
  ACTION_TYPES
};
