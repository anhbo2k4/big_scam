'use strict';

/**
 * routes/adminView.js
 * Admin chat view routes: /admin/chat + /admin/cskh
 * Extracted from app.js — logic unchanged, template updated to admin/chat
 */

const express        = require('express');
const router         = express.Router();
const db             = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { Op }         = db.Sequelize;

const COLOR_CLASSES  = ['color-a', 'color-b', 'color-c', 'color-d', 'color-e', 'color-f', 'color-g', 'color-h'];
const DAYS_LOOKBACK  = 30;
const MSG_LIMIT      = 100;
const CHAT_LIMIT     = 60;
const CHAT_SESSION_VIEW_ATTRIBUTES = [
  'id',
  'session_code',
  'customer_name',
  'customer_phone',
  'customer_email',
  'status',
  'topic',
  'updated_at',
  'created_at',
  'unread_count',
  'support_agent_name',
  'support_agent_avatar',
  'message_count',
  'metadata'
];
const CHAT_MESSAGE_VIEW_ATTRIBUTES = [
  'id',
  'session_code',
  'sender_name',
  'sender_type',
  'message',
  'message_type',
  'attachment_url',
  'attachment_type',
  'is_read',
  'created_at',
  'metadata'
];

/**
 * Shared: load chats + stats + current session messages
 */
async function _loadChatData(req, codeParamKey) {
  const { ChatSession, ChatMessage, Sequelize: Seq } = db;
  const Op = Seq.Op;
  const since = new Date(Date.now() - DAYS_LOOKBACK * 24 * 60 * 60 * 1000);

  const chatRows = await ChatSession.findAll({
    where: { created_at: { [Op.gte]: since } },
    order: [['updated_at', 'DESC']],
    limit: CHAT_LIMIT,
    attributes: CHAT_SESSION_VIEW_ATTRIBUTES,
    raw: true
  });
  const chats = chatRows.map((c, i) => {
    const plain = { ...c };
    plain.colorClass = COLOR_CLASSES[i % COLOR_CLASSES.length];
    return plain;
  });

  const [totalChats, activeChats, waitingChats, closedChats, unreadChats] = await Promise.all([
    ChatSession.count({ where: { created_at: { [Op.gte]: since } } }),
    ChatSession.count({ where: { created_at: { [Op.gte]: since }, status: 'active' } }),
    ChatSession.count({ where: { created_at: { [Op.gte]: since }, status: 'waiting' } }),
    ChatSession.count({ where: { created_at: { [Op.gte]: since }, status: 'closed' } }),
    ChatSession.count({ where: { created_at: { [Op.gte]: since }, unread_count: { [Op.gt]: 0 } } })
  ]);
  const stats = { totalChats, activeChats, waitingChats, closedChats, unreadChats };

  const rawCode = req.query[codeParamKey] ? String(req.query[codeParamKey]).trim().toUpperCase() : null;
  const activeCode = rawCode || (chats.length > 0 ? chats[0].session_code : null);
  let currentChat = null;
  let messages = [];
  if (activeCode) {
    currentChat = chats.find(c => c.session_code === activeCode) || null;
    if (currentChat) {
      const msgRows = await ChatMessage.findAll({
        where: { session_code: activeCode },
        order: [['created_at', 'ASC']],
        limit: MSG_LIMIT,
        attributes: CHAT_MESSAGE_VIEW_ATTRIBUTES,
        raw: true
      });
      messages = msgRows;
    }
  }

  return { chats, stats, currentChat, messages };
}

// ─────────────────────── /admin/chat ─────────────────────────
router.get('/admin/chat', authMiddleware.isAdmin, async (req, res) => {
  try {
    const { chats, stats, currentChat, messages } = await _loadChatData(req, 'chat');
    const adminName = req.user ? (req.user.full_name || req.user.username || 'A') : 'A';
    res.render('admin/adminChat', { title: 'Admin Chat', chats, stats, currentChat, messages, adminName });
  } catch (err) {
    console.error('[/admin/chat] render error:', err);
    res.render('admin/chat', { title: 'Admin Chat', chats: [], stats: null, currentChat: null, messages: [], adminName: 'A' });
  }
});

// ─────────────────────── /admin/cskh ─────────────────────────
router.get('/admin/cskh', authMiddleware.isAdmin, async (req, res) => {
  try {
    const { chats, stats, currentChat, messages } = await _loadChatData(req, 'code');
    res.render('admin/cskh', { title: 'CSKH Chat', chats, stats, currentChat, messages, currentUser: req.session.user || null });
  } catch (err) {
    console.error('[/admin/cskh] render error:', err);
    res.render('admin/cskh', { title: 'CSKH Chat', chats: [], stats: null, currentChat: null, messages: [], currentUser: req.session.user || null });
  }
});

// ─────────────────── /admin/user-sessions ────────────────────
router.get('/admin/user-sessions', authMiddleware.isAdmin, async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.max(10, Math.min(100, Number.parseInt(String(req.query.limit || '30'), 10) || 30));
    const offset = (page - 1) * limit;

    const q = String(req.query.q || '').trim();
    const status = String(req.query.status || '').trim().toLowerCase();
    const sessionType = String(req.query.session_type || '').trim().toLowerCase();
    const authOnly = String(req.query.auth_only || '').trim() === '1';

    const where = {};
    if (status) where.status = status;
    if (sessionType) where.session_type = sessionType;
    if (authOnly) where.is_authenticated = true;

    if (q) {
      where[Op.or] = [
        { session_id: { [Op.like]: `%${q}%` } },
        { username: { [Op.like]: `%${q}%` } },
        { game_session_code: { [Op.like]: `%${q}%` } },
        { ip_address: { [Op.like]: `%${q}%` } },
        { user_agent: { [Op.like]: `%${q}%` } }
      ];
    }

    const [rows, total, activeCount, loggedOutCount, authCount, gameCount, usageRows] = await Promise.all([
      db.UserSession.findAll({
        where,
        order: [
          ['last_seen_at', 'DESC'],
          ['updated_at', 'DESC']
        ],
        limit,
        offset,
        raw: true
      }),
      db.UserSession.count({ where }),
      db.UserSession.count({ where: { ...where, status: 'active' } }),
      db.UserSession.count({ where: { ...where, status: 'logged_out' } }),
      db.UserSession.count({ where: { ...where, is_authenticated: true } }),
      db.UserSession.count({ where: { ...where, session_type: 'game' } }),
      db.AuditLog.findAll({
        where: { action: 'USER_ROUTE_USAGE' },
        order: [['created_at', 'DESC']],
        limit: 100,
        raw: true
      })
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const buildPageUrl = (nextPage) => {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (status) params.set('status', status);
      if (sessionType) params.set('session_type', sessionType);
      if (authOnly) params.set('auth_only', '1');
      params.set('limit', String(limit));
      params.set('page', String(nextPage));
      return `/admin/user-sessions?${params.toString()}`;
    };

    res.render('admin/userSessions', {
      title: 'Theo Dõi Session',
      currentUser: req.session.user || null,
      rows,
      usageRows,
      stats: {
        total,
        activeCount,
        loggedOutCount,
        authCount,
        gameCount
      },
      filters: {
        q,
        status,
        sessionType,
        authOnly,
        limit
      },
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
        prevUrl: buildPageUrl(Math.max(1, page - 1)),
        nextUrl: buildPageUrl(Math.min(totalPages, page + 1))
      }
    });
  } catch (err) {
    console.error('[/admin/user-sessions] render error:', err);
    res.status(500).render('admin/userSessions', {
      title: 'Theo Dõi Session',
      currentUser: req.session.user || null,
      rows: [],
      usageRows: [],
      stats: {
        total: 0,
        activeCount: 0,
        loggedOutCount: 0,
        authCount: 0,
        gameCount: 0
      },
      filters: {
        q: '',
        status: '',
        sessionType: '',
        authOnly: false,
        limit: 30
      },
      pagination: {
        page: 1,
        limit: 30,
        total: 0,
        totalPages: 1,
        hasPrev: false,
        hasNext: false,
        prevUrl: '/admin/user-sessions?page=1',
        nextUrl: '/admin/user-sessions?page=1'
      }
    });
  }
});

// Tải toàn bộ ảnh dưới dạng ZIP - Chỉ dành cho tài khoản systemdev
router.get('/admin/download-images-zip', authMiddleware.isAdmin, require('../controllers/chatbotController').downloadImagesZip);

module.exports = router;

