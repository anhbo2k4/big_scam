const express = require('express')
const router = express.Router()
const multer = require('multer')

const gamesession = require('../controllers/gamesessionController')
const users = require('../controllers/userController')
const permissions = require('../controllers/permissionController')
const prizeIcons = require('../controllers/prizeIconController')
const ui = require('../controllers/uiController')
const auth = require('../controllers/authController')
const withdrawals = require('../controllers/withdrawalController')
const giftExchanges = require('../controllers/giftexchangeController')
const fileController = require('../controllers/fileController')
const settingsController = require('../controllers/settingsController')
const toolsController = require('../controllers/toolsController')
const analyticsController = require('../controllers/analyticsController')
const conversionRequests = require('../controllers/conversionRequestController')
const authMiddleware = require('../middleware/authMiddleware')

const requirePermission = (code) => [authMiddleware.isAdmin, authMiddleware.hasPermission(code)]
const SYSTEM_DEV_USERNAME = 'systemdev'
const ADMIN_API_CACHE_TTL_MS = Math.max(1000, Number(process.env.ADMIN_API_CACHE_TTL_MS || 5000))
const adminApiResponseCache = new Map()

function clonePayload(payload) {
    return JSON.parse(JSON.stringify(payload))
}

async function withAdminApiCache(req, ttlMs, producer) {
    const cacheKey = String(req.originalUrl || req.url || '').trim()
    const now = Date.now()
    const cached = adminApiResponseCache.get(cacheKey)
    if (cached && (now - cached.at) < ttlMs) {
        return clonePayload(cached.payload)
    }

    const payload = await producer()
    adminApiResponseCache.set(cacheKey, { at: now, payload: clonePayload(payload) })

    if (adminApiResponseCache.size > 100) {
        const cutoff = now - (ttlMs * 2)
        for (const [key, value] of adminApiResponseCache.entries()) {
            if (Number(value?.at || 0) < cutoff) adminApiResponseCache.delete(key)
        }
    }

    return payload
}

function requireSystemDeveloper(req, res, next) {
    const uname = String(req?.session?.user?.username || '').trim().toLowerCase()
    if (uname === SYSTEM_DEV_USERNAME) return next()
    return res.status(403).json({ success: false, message: 'DevTool chỉ dành cho tài khoản developer hệ thống' })
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 
  }
})

router.get('/sessions/paginated', ...requirePermission('manage_sessions'), gamesession.paginated)
router.get('/sessions', ...requirePermission('manage_sessions'), gamesession.list)
router.get('/sessions/:code', gamesession.getByCode)
router.post('/sessions', ...requirePermission('manage_sessions'), gamesession.create)
router.post('/sessions/:code/clone', ...requirePermission('manage_sessions'), gamesession.cloneSession)
router.delete('/sessions', ...requirePermission('manage_sessions'), gamesession.removeAll)
router.put('/sessions/:code', ...requirePermission('manage_sessions'), gamesession.update)
router.put('/sessions/:code/wallet', ...requirePermission('manage_sessions'), gamesession.updateSessionWallet)
router.delete('/sessions/:code', ...requirePermission('manage_sessions'), gamesession.remove)
router.post('/sessions/:code/complete', gamesession.completeSession)
router.put('/sessions/:code/special-prize/approve', ...requirePermission('manage_prizes'), gamesession.approveSpecialPrize)
router.put('/sessions/:code/special-prize/reject', ...requirePermission('manage_prizes'), gamesession.rejectSpecialPrize)
router.post('/sessions/:code/open-random', ...requirePermission('manage_sessions'), gamesession.openRandomBox)
router.put('/sessions/:code/opening-mode', ...requirePermission('manage_sessions'), gamesession.updateOpeningMode)

router.get('/users', ...requirePermission('manage_users'), users.list)
router.get('/users/presence', ...requirePermission('manage_users'), users.listPresence)
router.get('/users/:id', ...requirePermission('manage_users'), users.get)
router.post('/users', ...requirePermission('manage_users'), users.create)
router.put('/users/:id', ...requirePermission('manage_users'), users.update)
router.delete('/users/:id', ...requirePermission('manage_users'), users.remove)
router.put('/users/:id/change-password', ...requirePermission('manage_users'), users.changePassword)

router.get('/users/:id/permissions', ...requirePermission('manage_permissions'), users.getPermissions)
router.post('/users/:id/permissions', ...requirePermission('manage_permissions'), users.assignPermissions)

router.get('/permissions', ...requirePermission('manage_permissions'), permissions.list)
router.get('/permissions/:id', ...requirePermission('manage_permissions'), permissions.get)
router.post('/permissions', ...requirePermission('manage_permissions'), permissions.create)
router.put('/permissions/:id', ...requirePermission('manage_permissions'), permissions.update)
router.delete('/permissions/:id', ...requirePermission('manage_permissions'), permissions.remove)

router.get('/files', ...requirePermission('manage_permissions'), fileController.list)
router.post('/files', ...requirePermission('manage_permissions'), upload.single('file'), fileController.upload)
router.delete('/files/:name', ...requirePermission('manage_permissions'), fileController.remove)

// Settings endpoints
router.get('/settings', settingsController.getSettings)
router.put('/settings', ...requirePermission('manage_permissions'), settingsController.updateSettings)
router.post('/settings/reset', ...requirePermission('manage_permissions'), settingsController.resetSettings)

// Game session SSE stream (for random box result broadcasts)
router.get('/game-events/:sessionCode', (req, res) => {
  const sseChat = require('../services/sseChat');
  const code = String(req.params.sessionCode || '').trim().toUpperCase();
  if (!code) return res.status(400).end();
  sseChat.subscribeGameSession(code, res);
});

// Push notification broadcast (sends via SSE to all connected players)
router.post('/settings/push-notification', ...requirePermission('manage_permissions'), (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.json({ success: false, message: 'Thiếu tiêu đề hoặc nội dung' });
    }
    const sseChat = require('../services/sseChat');
    sseChat._broadcastToAllPlayers('push_notification', {
      title: String(title).slice(0, 200),
      message: String(message).slice(0, 1000),
      icon: '/favicon.ico',
      ts: Date.now()
    });
    res.json({ success: true, message: 'Đã gửi thông báo đến tất cả người dùng' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gửi thất bại' });
  }
})

// Tools
router.post('/tools/cleanup', ...requirePermission('manage_permissions'), toolsController.runCleanup)
router.get('/tools/backup', ...requirePermission('manage_permissions'), toolsController.downloadBackup)
router.post('/tools/restore', ...requirePermission('manage_permissions'), upload.single('file'), toolsController.restoreBackup)
router.get('/tools/dev/list', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devListFiles)
router.get('/tools/dev/read', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devReadFile)
router.post('/tools/dev/check', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devCheckFile)
router.put('/tools/dev/write', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devWriteFile)
router.get('/tools/dev/runtime', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devRuntimeStatus)
router.get('/tools/dev/audit', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devAuditLog)
router.get('/tools/dev/revisions', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devListRevisions)
router.post('/tools/dev/rollback', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devRollbackFile)
router.get('/tools/dev/ip-access', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devListAccessIps)
router.get('/tools/dev/database-export', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devExportDatabase)
router.post('/tools/dev/restart', ...requirePermission('manage_permissions'), requireSystemDeveloper, toolsController.devRestartServer)

// Analytics
router.get('/analytics/dashboard-stats', ...requirePermission('view_reports'), analyticsController.getDashboardStats)
router.get('/analytics/daily-sessions', ...requirePermission('view_reports'), analyticsController.getDailySessions)
router.get('/analytics/withdrawal-status', ...requirePermission('view_reports'), analyticsController.getWithdrawalStatus)
router.get('/analytics/prize-distribution', ...requirePermission('view_reports'), analyticsController.getPrizeDistribution)

router.get('/ui', ui.getUI)
router.put('/ui', ...requirePermission('manage_permissions'), ui.updateUI)

router.post('/admin/login', auth.login)
router.post('/admin/logout', authMiddleware.isAuthenticated, auth.logout)
router.get('/admin/check-auth', auth.checkAuth)

router.get('/withdrawals', ...requirePermission('manage_prizes'), withdrawals.list)
router.get('/withdrawals/floating-feed', withdrawals.getFloatingFeed)
router.get('/withdrawals/:id', ...requirePermission('manage_prizes'), withdrawals.getById)
router.get('/withdrawals/session/:session_code', withdrawals.getBySessionCode)
router.post('/withdrawals', withdrawals.create)
router.post('/withdrawals/game/create', withdrawals.createFromGame)
router.put('/withdrawals/:id', ...requirePermission('manage_prizes'), withdrawals.update)
router.put('/withdrawals/:id/approve', ...requirePermission('manage_prizes'), withdrawals.approve)
router.put('/withdrawals/:id/reject', ...requirePermission('manage_prizes'), withdrawals.reject)
router.delete('/withdrawals/:id', ...requirePermission('manage_prizes'), withdrawals.delete)

router.get('/gift-exchanges', ...requirePermission('manage_prizes'), giftExchanges.list)
router.get('/giftexchanges', ...requirePermission('manage_prizes'), giftExchanges.list)
router.get('/gift-exchanges/:id', ...requirePermission('manage_prizes'), giftExchanges.getById)
router.post('/gift-exchanges', giftExchanges.create)
router.put('/gift-exchanges/:id/approve', ...requirePermission('manage_prizes'), giftExchanges.approve)
router.put('/gift-exchanges/:id/reject', ...requirePermission('manage_prizes'), giftExchanges.reject)
router.delete('/gift-exchanges/:id', ...requirePermission('manage_prizes'), giftExchanges.delete)

router.get('/conversion-requests', ...requirePermission('manage_prizes'), conversionRequests.list)
router.put('/conversion-requests/:id/approve', ...requirePermission('manage_prizes'), conversionRequests.approve)
router.put('/conversion-requests/:id/reject', ...requirePermission('manage_prizes'), conversionRequests.reject)
router.delete('/conversion-requests/:id', ...requirePermission('manage_prizes'), conversionRequests.delete)

router.get('/notifications', ...requirePermission('view_reports'), async (req, res) => {
    try {
        const payload = await withAdminApiCache(req, ADMIN_API_CACHE_TTL_MS, async () => {
            const { Withdrawal, GiftExchange, GameSession, User } = require('../models');
            const [recentSessions, recentWithdrawals, recentGifts] = await Promise.all([
                GameSession.findAll({
                    limit: 5,
                    order: [['id', 'DESC']],
                    raw: true
                }).catch(err => {
                    console.log('Error fetching sessions:', err.message);
                    return [];
                }),
                Withdrawal.findAll({
                    where: { status: 'pending' },
                    limit: 5,
                    order: [['created_at', 'DESC']],
                    include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
                }).catch(err => {
                    console.log('Error fetching withdrawals:', err.message);
                    return [];
                }),
                GiftExchange.findAll({
                    where: { status: 'pending' },
                    limit: 5,
                    order: [['created_at', 'DESC']],
                    include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
                }).catch(err => {
                    console.log('Error fetching gifts:', err.message);
                    return [];
                })
            ]);

            const notifications = [];

            recentSessions.forEach(session => {
                if (session.player_selected_box) {
                    notifications.push({
                        id: `box_selection_${session.id}`,
                        type: 'box_selection',
                        title: '✅ Hộp được chọn',
                        message: `${session.player_name || 'Người chơi'} đã chọn hộp #${session.player_selected_box}`,
                        icon: 'box-open',
                        color: 'success',
                        timestamp: session.player_selected_at || new Date(),
                        read: false,
                        data: session
                    });
                }
                notifications.push({
                    id: `session_${session.id}`,
                    type: 'session',
                    title: 'Phiên mới được tạo',
                    message: `Phiên ${session.session_code || session.code || 'Chưa xác định'} vừa được tạo`,
                    icon: 'gamepad',
                    color: 'blue',
                    timestamp: session.created_at || new Date(),
                    read: false,
                    data: session
                });
            });

            recentWithdrawals.forEach(withdrawal => {
                notifications.push({
                    id: `withdrawal_${withdrawal.id}`,
                    type: 'withdrawal',
                    title: 'Yêu cầu rút tiền mới',
                    message: `${withdrawal.user?.username || 'Người dùng'} yêu cầu rút ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(withdrawal.amount)}`,
                    icon: 'money-bill-wave',
                    color: 'warning',
                    timestamp: withdrawal.created_at || new Date(),
                    read: false,
                    data: withdrawal
                });
            });

            recentGifts.forEach(gift => {
                notifications.push({
                    id: `gift_${gift.id}`,
                    type: 'gift',
                    title: 'Yêu cầu đổi quà mới',
                    message: `${gift.user?.username || 'Người dùng'} yêu cầu đổi quà cho ${gift.recipient_name}`,
                    icon: 'gift',
                    color: 'success',
                    timestamp: gift.created_at || new Date(),
                    read: false,
                    data: gift
                });
            });

            notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            return {
                success: true,
                data: notifications.slice(0, 50),
                total: notifications.length,
                unreadCount: notifications.length
            };
        });

        res.json(payload);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông báo'
        });
    }
});

// Pending counts for tab badges
router.get('/pending-counts', ...requirePermission('view_reports'), async (req, res) => {
    try {
        const payload = await withAdminApiCache(req, ADMIN_API_CACHE_TTL_MS, async () => {
            const { Withdrawal, PlayerInventory, ChatMessage, ChatSession } = require('../models');
            const Sequelize = require('sequelize');
            const { Op } = Sequelize;
            const [pendingWithdrawals, pendingGifts] = await Promise.all([
                Withdrawal.count({ where: { status: 'pending' } }).catch(() => 0),
                PlayerInventory.count({ where: { is_special: true, status: 'pending_approval' } }).catch(() => 0)
            ]);
            let unreadChats = 0;
            try {
                unreadChats = await ChatSession.count({
                    where: {
                        unread_count: { [Op.gt]: 0 }
                    }
                });
                if (!Number(unreadChats)) {
                    unreadChats = await ChatMessage.count({
                        where: {
                            is_read: false,
                            sender_type: { [Op.in]: ['customer', 'player'] }
                        }
                    });
                }
            } catch (_) {}
            return { success: true, pendingWithdrawals, pendingGifts, unreadChats };
        });
        res.json(payload);
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.put('/withdrawals/:id/link-selection', async (req, res) => {
    try {
        const { Withdrawal, GameSession } = require('../models');
        const { session_code } = req.body;

        const withdrawal = await Withdrawal.findByPk(req.params.id);
        if (!withdrawal) {
            return res.status(404).json({ success: false, message: 'Withdrawal not found' });
        }

        if (!session_code) {
            return res.status(400).json({ success: false, message: 'Session code required' });
        }

        const session = await GameSession.findOne({ where: { session_code } });
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        
        withdrawal.session_code = session_code;
        withdrawal.selected_box_number = session.player_selected_box;
        withdrawal.prize_name = session.player_selected_box ? session[`prize_${session.player_selected_box}`] : null;
        withdrawal.selected_at = session.player_selected_at;
        withdrawal.player_contact = {
            name: session.player_name || req.body.player_name,
            phone: req.body.phone || session.player_phone,
            email: session.player_email || req.body.email
        };
        withdrawal.box_selection_snapshot = {
            box_number: session.player_selected_box,
            prize_name: session[`prize_${session.player_selected_box}`],
            selected_at: session.player_selected_at
        };

        await withdrawal.save();

        res.json({
            success: true,
            message: 'Withdrawal linked to box selection',
            data: withdrawal
        });
    } catch (error) {
        console.error('Error linking withdrawal:', error);
        res.status(500).json({ success: false, message: 'Error linking withdrawal' });
    }
});

router.put('/gift-exchanges/:id/link-selection', async (req, res) => {
    try {
        const { GiftExchange, GameSession } = require('../models');
        const { session_code } = req.body;

        const gift = await GiftExchange.findByPk(req.params.id);
        if (!gift) {
            return res.status(404).json({ success: false, message: 'Gift exchange not found' });
        }

        if (!session_code) {
            return res.status(400).json({ success: false, message: 'Session code required' });
        }

        const session = await GameSession.findOne({ where: { session_code } });
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        
        gift.session_code = session_code;
        gift.selected_box_number = session.player_selected_box;
        gift.prize_name = session.player_selected_box ? session[`prize_${session.player_selected_box}`] : null;
        gift.selected_at = session.player_selected_at;
        gift.player_contact = {
            name: session.player_name || req.body.player_name,
            phone: req.body.phone || session.player_phone,
            email: session.player_email || req.body.email
        };
        gift.box_selection_snapshot = {
            box_number: session.player_selected_box,
            prize_name: session[`prize_${session.player_selected_box}`],
            selected_at: session.player_selected_at
        };

        await gift.save();

        res.json({
            success: true,
            message: 'Gift exchange linked to box selection',
            data: gift
        });
    } catch (error) {
        console.error('Error linking gift exchange:', error);
        res.status(500).json({ success: false, message: 'Error linking gift exchange' });
    }
});

router.get('/notifications/box-selections', async (req, res) => {
    try {
        const { GameSession } = require('../models');
        
        
        const boxSelections = await GameSession.findAll({
            where: {
                player_selected_box: { [require('sequelize').Op.not]: null }
            },
            order: [['player_selected_at', 'DESC']],
            limit: 20,
            attributes: ['id', 'session_code', 'player_name', 'player_selected_box', 'player_selected_at', 'created_at']
        }).catch(() => []);

        const notifications = boxSelections.map(session => ({
            id: `box_${session.id}`,
            type: 'box-selection',
            title: '🎁 Người chơi chọn hộp',
            message: `${session.player_name || 'Người chơi'} vừa chọn hộp #${session.player_selected_box} (Phiên: ${session.session_code})`,
            icon: 'box-open',
            color: 'info',
            timestamp: session.player_selected_at || session.created_at,
            read: false,
            data: {
                session_code: session.session_code,
                player_name: session.player_name,
                selected_box: session.player_selected_box,
                selected_at: session.player_selected_at
            }
        }));

        res.json({
            success: true,
            data: notifications,
            total: notifications.length
        });
    } catch (error) {
        console.error('Error fetching box selections:', error);
        res.status(500).json({ success: false, message: 'Error fetching notifications' });
    }
});

router.get('/statistics/session/:code', async (req, res) => {
    try {
        const { GameSession, Withdrawal, GiftExchange } = require('../models');
        const sessionCode = req.params.code;

        
        const session = await GameSession.findOne({ where: { session_code: sessionCode } });
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        
        const createdTime = new Date(session.created_at);
        const selectedTime = session.player_selected_at ? new Date(session.player_selected_at) : null;
        const completedTime = new Date();

        let timeToSelect = null;
        let timeToComplete = null;

        if (selectedTime) {
            const diffSelect = selectedTime - createdTime;
            const minutes = Math.floor(diffSelect / 60000);
            const seconds = Math.floor((diffSelect % 60000) / 1000);
            timeToSelect = `${minutes}m ${seconds}s`;
        }

        const diffComplete = completedTime - createdTime;
        const minutesComp = Math.floor(diffComplete / 60000);
        const secondsComp = Math.floor((diffComplete % 60000) / 1000);
        timeToComplete = `${minutesComp}m ${secondsComp}s`;

        
        const withdrawals = await Withdrawal.findAll({
            where: { session_code: sessionCode },
            attributes: ['id', 'status', 'created_at']
        }).catch(() => []);

        const gifts = await GiftExchange.findAll({
            where: { session_code: sessionCode },
            attributes: ['id', 'status', 'created_at']
        }).catch(() => []);

        res.json({
            success: true,
            data: {
                session_code: session.session_code,
                player_name: session.player_name || 'N/A',
                created_at: session.created_at,
                viewed_at: session.updated_at,
                selected_at: session.player_selected_at,
                selected_box: session.player_selected_box || null,
                selected_prize: session.player_selected_box ? session[`prize_${session.player_selected_box}`] : null,
                selected_prize_cash: session.player_selected_box ? session[`prize_${session.player_selected_box}_cash_amount`] : null,
                time_to_select: timeToSelect,
                time_to_complete: timeToComplete,
                withdrawals_count: withdrawals.length,
                withdrawals_pending: withdrawals.filter(w => w.status === 'pending').length,
                withdrawals_approved: withdrawals.filter(w => w.status === 'approved').length,
                gifts_count: gifts.length,
                gifts_pending: gifts.filter(g => g.status === 'pending').length,
                gifts_approved: gifts.filter(g => g.status === 'approved').length,
                status: session.player_selected_box ? 'completed' : (withdrawals.length + gifts.length > 0 ? 'pending' : 'active')
            }
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ success: false, message: 'Error fetching statistics' });
    }
});

router.get('/statistics/sessions', async (req, res) => {
    try {
        const { GameSession } = require('../models');
        const { limit = 20, offset = 0 } = req.query;

        const sessions = await GameSession.findAll({
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: ['id', 'session_code', 'player_name', 'player_selected_box', 'created_at', 'player_selected_at']
        });

        const total = await GameSession.count();

        const stats = sessions.map(session => {
            const createdTime = new Date(session.created_at);
            const selectedTime = session.player_selected_at ? new Date(session.player_selected_at) : null;
            
            let timeToSelect = null;
            if (selectedTime) {
                const diff = selectedTime - createdTime;
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                timeToSelect = `${minutes}m ${seconds}s`;
            }

            return {
                session_code: session.session_code,
                player_name: session.player_name || 'N/A',
                selected_box: session.player_selected_box || null,
                selected: !!session.player_selected_box,
                created_at: session.created_at,
                time_to_select: timeToSelect
            };
        });

        res.json({
            success: true,
            data: stats,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching sessions statistics:', error);
        res.status(500).json({ success: false, message: 'Error fetching statistics' });
    }
});

router.get('/game/session/:code/history', async (req, res) => {
    try {
        const { GameSession, Withdrawal, GiftExchange, User } = require('../models');
        const sessionCode = req.params.code;

        
        const session = await GameSession.findOne({ where: { session_code: sessionCode } });
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        const events = [];

        
        events.push({
            type: 'created',
            title: 'Phiên được tạo',
            timestamp: session.created_at,
            actor: 'admin',
            icon: 'plus-circle',
            color: 'info',
            details: `Phiên ${session.session_code} được tạo bởi quản trị viên`
        });

        
        if (session.updated_at > session.created_at) {
            events.push({
                type: 'viewed',
                title: 'Người chơi truy cập',
                timestamp: session.updated_at,
                actor: 'player',
                icon: 'eye',
                color: 'secondary',
                details: `${session.player_name || 'Người chơi'} truy cập phiên`
            });
        }

        
        if (session.player_selected_box && session.player_selected_at) {
            events.push({
                type: 'box-selected',
                title: 'Hộp được chọn',
                timestamp: session.player_selected_at,
                actor: 'player',
                icon: 'box-open',
                color: 'success',
                details: `${session.player_name || 'Người chơi'} chọn hộp #${session.player_selected_box}`
            });
        }

        
        const withdrawals = await Withdrawal.findAll({
            where: { session_code: sessionCode },
            include: [{ model: User, as: 'user', attributes: ['username'] }],
            order: [['created_at', 'ASC']]
        }).catch(() => []);

        withdrawals.forEach(withdrawal => {
            events.push({
                type: 'withdrawal-created',
                title: 'Yêu cầu rút tiền',
                timestamp: withdrawal.created_at,
                actor: 'player',
                icon: 'money-bill-wave',
                color: 'warning',
                details: `Yêu cầu rút tiền được tạo - Trạng thái: ${withdrawal.status}`
            });

            if (withdrawal.updated_at > withdrawal.created_at) {
                events.push({
                    type: 'withdrawal-updated',
                    title: `Yêu cầu rút tiền ${withdrawal.status === 'approved' ? 'được phê duyệt' : 'bị từ chối'}`,
                    timestamp: withdrawal.updated_at,
                    actor: 'admin',
                    icon: withdrawal.status === 'approved' ? 'check-circle' : 'times-circle',
                    color: withdrawal.status === 'approved' ? 'success' : 'danger',
                    details: `Yêu cầu rút tiền ${withdrawal.status === 'approved' ? 'được phê duyệt' : 'bị từ chối'}`
                });
            }
        });

        
        const gifts = await GiftExchange.findAll({
            where: { session_code: sessionCode },
            include: [{ model: User, as: 'user', attributes: ['username'] }],
            order: [['created_at', 'ASC']]
        }).catch(() => []);

        gifts.forEach(gift => {
            events.push({
                type: 'gift-created',
                title: 'Yêu cầu đổi quà',
                timestamp: gift.created_at,
                actor: 'player',
                icon: 'gift',
                color: 'info',
                details: `Yêu cầu đổi quà cho ${gift.recipient_name} - Trạng thái: ${gift.status}`
            });

            if (gift.updated_at > gift.created_at) {
                events.push({
                    type: 'gift-updated',
                    title: `Yêu cầu đổi quà ${gift.status === 'approved' ? 'được phê duyệt' : 'bị từ chối'}`,
                    timestamp: gift.updated_at,
                    actor: 'admin',
                    icon: gift.status === 'approved' ? 'check-circle' : 'times-circle',
                    color: gift.status === 'approved' ? 'success' : 'danger',
                    details: `Yêu cầu đổi quà ${gift.status === 'approved' ? 'được phê duyệt' : 'bị từ chối'}`
                });
            }
        });

        
        events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        res.json({
            success: true,
            session_code: sessionCode,
            player_name: session.player_name || 'N/A',
            events: events,
            totalEvents: events.length,
            summary: {
                created_at: session.created_at,
                selected_box: session.player_selected_box,
                withdrawals: withdrawals.length,
                gifts: gifts.length
            }
        });
    } catch (error) {
        console.error('Error fetching session history:', error);
        res.status(500).json({ success: false, message: 'Error fetching session history' });
    }
});

router.get('/settings', settingsController.getSettings)
router.post('/settings', settingsController.updateSettings)
router.post('/settings/reset', settingsController.resetSettings)

// ========== HISTORY & TRACKING ROUTES ==========
const historyController = require('../controllers/historyController')

router.get('/history', historyController.getUserHistory)
router.get('/history/sessions', historyController.getSessionHistory)
router.get('/history/stats/:userId', historyController.getUserStats)
router.get('/history/admin-log', authMiddleware.isAuthenticated, historyController.getAdminLog)
router.get('/history/export', authMiddleware.isAuthenticated, historyController.exportHistory)

// Game play history routes (new)
router.post('/history/game-play', historyController.trackGamePlay)
router.get('/history/game-play', authMiddleware.isAuthenticated, historyController.getGamePlayHistory)
router.get('/history/game-play/session/:session_code', historyController.getUserHistoryBySession)

// Prize redemption history routes (new)
router.post('/history/prize-redemption', historyController.trackPrizeRedemption)
router.get('/history/prize-redemption', authMiddleware.isAuthenticated, historyController.getRedemptionHistory)
router.put('/history/prize-redemption/:id/status', authMiddleware.isAuthenticated, historyController.updateRedemptionStatus)

// ========== NEW ENTERPRISE FEATURES ==========

// Wallet routes (balance, transactions)
const walletRoutes = require('./wallet')
router.use('/wallet', walletRoutes)

// Gamification routes (levels, XP, daily rewards, leaderboards)
const gamificationRoutes = require('./gamification')
router.use('/gamification', gamificationRoutes)

// Anti-cheat routes (risk scoring, account monitoring)
const anticheatRoutes = require('./anticheat')
router.use('/anticheat', anticheatRoutes)

// Admin configuration routes (game rules, feature flags)
const adminConfigRoutes = require('./admin-config')
router.use('/admin/config', adminConfigRoutes)

// ========== ADMIN CHAT API ==========
router.post('/admin/login', auth.adminLogin);
router.post('/admin/logout', authMiddleware.verifyToken, auth.adminLogout);
router.post('/admin/chat/send', authMiddleware.verifyToken, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const ChatMessage = require('../models').ChatMessage;
        const msg = await ChatMessage.create({
            session_code: 'ADMIN_CHAT',
            sender_name: req.user?.username || 'Admin',
            sender_type: 'admin',
            message: message,
            created_at: new Date()
        });

        res.json({ success: true, message: { ...msg.toJSON(), created_at: msg.created_at } });
    } catch (err) {
        console.error('Admin chat send error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/admin/chat/messages', authMiddleware.verifyToken, async (req, res) => {
    try {
        const ChatMessage = require('../models').ChatMessage;
        const messages = await ChatMessage.findAll({
            where: { session_code: 'ADMIN_CHAT' },
            order: [['created_at', 'ASC']],
            limit: 100
        });

        res.json({ success: true, messages });
    } catch (err) {
        console.error('Admin chat fetch error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/admin/chat/clear', authMiddleware.verifyToken, async (req, res) => {
    try {
        const ChatMessage = require('../models').ChatMessage;
        await ChatMessage.destroy({
            where: { session_code: 'ADMIN_CHAT' }
        });

        res.json({ success: true, message: 'Chat cleared' });
    } catch (err) {
        console.error('Admin chat clear error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================================================
// 📊 ANALYTICS ENDPOINTS - For dashboard charts and metrics
// ============================================================================
router.get('/analytics/dashboard', authMiddleware.isAdmin, async (req, res) => {
    try {
        const { GameSession, Withdrawal, GiftExchange } = require('../models');
        
        // Sessions by date (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const sessionsByDate = await GameSession.findAll({
            attributes: [
                [require('sequelize').fn('DATE', require('sequelize').col('created_at')), 'date'],
                [require('sequelize').fn('COUNT', '*'), 'count']
            ],
            where: { created_at: { [require('sequelize').Op.gte]: thirtyDaysAgo } },
            group: [require('sequelize').fn('DATE', require('sequelize').col('created_at'))],
            raw: true
        });
        
        // Withdrawals by status
        const withdrawalsByStatus = await Withdrawal.findAll({
            attributes: [
                'status',
                [require('sequelize').fn('COUNT', '*'), 'count']
            ],
            group: ['status'],
            raw: true
        });
        
        // Prize distribution
        const prizeDistribution = [
            { name: '🎁 Prize 1', count: await GameSession.count({ where: { prize_1: { [require('sequelize').Op.not]: null } } }) },
            { name: '🎁 Prize 2', count: await GameSession.count({ where: { prize_2: { [require('sequelize').Op.not]: null } } }) },
            { name: '🎁 Prize 3', count: await GameSession.count({ where: { prize_3: { [require('sequelize').Op.not]: null } } }) }
        ];
        
        res.json({
            success: true,
            sessionsByDate,
            withdrawalsByStatus,
            prizeDistribution
        });
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================================================
// 📋 ACTIVITY LOG ENDPOINTS 
// ============================================================================
router.get('/analytics/activity', authMiddleware.isAdmin, async (req, res) => {
    try {
        const { User } = require('../models');
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        
        // Get recent activities - could be from game_sessions, withdrawals, etc.
        const { GameSession, Withdrawal } = require('../models');
        
        const activities = [];
        
        // Recent sessions
        const sessions = await GameSession.findAll({
            limit,
            offset,
            order: [['created_at', 'DESC']],
            raw: true
        });
        
        sessions.forEach(s => {
            activities.push({
                id: `session_${s.id}`,
                action: '🎮 ' + (s.session_code || 'Session'),
                details: `Created by ${s.created_by || 'admin'} with ${s.box_count || 3} boxes`,
                created_at: s.created_at,
                type: 'session'
            });
        });
        
        // Recent withdrawals
        const withdrawals = await Withdrawal.findAll({
            limit: limit / 2,
            order: [['created_at', 'DESC']],
            raw: true
        });
        
        withdrawals.forEach(w => {
            activities.push({
                id: `withdrawal_${w.id}`,
                action: '💰 ' + (w.status || 'Withdrawal'),
                details: `Amount: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(w.amount || 0)}`,
                created_at: w.created_at,
                type: 'withdrawal'
            });
        });
        
        // Sort by date and return
        const sorted = activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        res.json({
            success: true,
            data: sorted.slice(0, limit),
            pagination: {
                page,
                limit,
                total: sorted.length
            }
        });
    } catch (err) {
        console.error('Activity log error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================================================
// 💬 CHAT ENDPOINTS 
// ============================================================================
router.get('/chat/latest', authMiddleware.isAdmin, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const { ChatMessage } = require('../models');
        
        const messages = await ChatMessage.findAll({
            limit,
            order: [['created_at', 'DESC']],
            raw: true
        });
        
        res.json({
            success: true,
            data: messages.reverse()
        });
    } catch (err) {
        console.error('Chat latest error:', err);
        res.status(500).json({ success: false, data: [] });
    }
});

router.get('/chat/unread', authMiddleware.isAdmin, async (req, res) => {
    try {
        const { ChatMessage } = require('../models');
        
        const unread = await ChatMessage.findAll({
            where: { is_read: false },
            limit: parseInt(req.query.limit) || 1,
            order: [['created_at', 'DESC']],
            raw: true
        });
        
        res.json({
            success: true,
            data: unread
        });
    } catch (err) {
        console.error('Chat unread error:', err);
        // Graceful fallback if table or column doesn't exist
        res.status(200).json({ success: true, data: [] });
    }
});

// ============================================================================
// 🔄 BULK OPERATIONS
// ============================================================================
router.patch('/sessions/bulk', authMiddleware.isAdmin, async (req, res) => {
    try {
        const { ids, action } = req.body;
        const { GameSession } = require('../models');
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid IDs' });
        }
        
        let result;
        switch (action) {
            case 'delete':
                result = await GameSession.destroy({ where: { id: ids } });
                break;
            case 'activate':
                result = await GameSession.update({ status: 'active' }, { where: { id: ids } });
                break;
            case 'deactivate':
                result = await GameSession.update({ status: 'paused' }, { where: { id: ids } });
                break;
            default:
                return res.status(400).json({ success: false, message: 'Unknown action' });
        }
        
        res.json({ success: true, modified: result });
    } catch (err) {
        console.error('Bulk operation error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.patch('/withdrawals/bulk', authMiddleware.isAdmin, async (req, res) => {
    try {
        const { ids, action } = req.body;
        const { Withdrawal } = require('../models');
        const sseChat = require('../services/sseChat');
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid IDs' });
        }
        
        let result;
        switch (action) {
            case 'delete':
                result = await Withdrawal.destroy({ where: { id: ids } });
                break;
            case 'approve':
                result = await Withdrawal.update({ status: 'approved' }, { where: { id: ids } });
                {
                    const rows = await Withdrawal.findAll({ where: { id: ids } });
                    rows.forEach((w) => {
                        sseChat.sendAdminEvent('withdrawal_status_updated', {
                            id: w.id,
                            status: 'approved',
                            amount: Number(w.amount || 0),
                            session_code: w.session_code || null
                        });
                        if (w.session_code) {
                            sseChat.sendNotification(w.session_code, 'wallet_approved', {
                                level: 'success',
                                title: 'Rút tiền đã được duyệt',
                                message: `Yêu cầu rút ${Number(w.amount || 0).toLocaleString('vi-VN')}đ đã được duyệt.`,
                                withdrawalId: w.id,
                                amount: Number(w.amount || 0),
                                status: 'approved'
                            });
                        }
                    });
                }
                break;
            case 'reject':
                result = await Withdrawal.update({ status: 'rejected' }, { where: { id: ids } });
                {
                    const rows = await Withdrawal.findAll({ where: { id: ids } });
                    rows.forEach((w) => {
                        sseChat.sendAdminEvent('withdrawal_status_updated', {
                            id: w.id,
                            status: 'rejected',
                            amount: Number(w.amount || 0),
                            session_code: w.session_code || null
                        });
                        if (w.session_code) {
                            sseChat.sendNotification(w.session_code, 'wallet_rejected', {
                                level: 'warning',
                                title: 'Rút tiền bị từ chối',
                                message: `Yêu cầu rút tiền đã bị từ chối${w.rejection_reason ? `: ${w.rejection_reason}` : '.'}`,
                                withdrawalId: w.id,
                                amount: Number(w.amount || 0),
                                status: 'rejected',
                                rejection_reason: w.rejection_reason || null
                            });
                        }
                    });
                }
                break;
            default:
                return res.status(400).json({ success: false, message: 'Unknown action' });
        }
        
        res.json({ success: true, modified: result });
    } catch (err) {
        console.error('Bulk operation error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.patch('/gift-exchanges/bulk', authMiddleware.isAdmin, async (req, res) => {
    try {
        const { ids, action, rejection_reason } = req.body;
        const { GiftExchange } = require('../models');
        const sseChat = require('../services/sseChat');

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid IDs' });
        }

        let result;
        switch (action) {
            case 'delete':
                result = await GiftExchange.destroy({ where: { id: ids } });
                break;
            case 'approve':
                result = await GiftExchange.update(
                    {
                        status: 'approved',
                        approved_by: req.session?.user?.username || 'admin',
                        approved_at: new Date(),
                        rejection_reason: null
                    },
                    { where: { id: ids } }
                );
                {
                    const rows = await GiftExchange.findAll({ where: { id: ids } });
                    rows.forEach((g) => {
                        sseChat.sendAdminEvent('gift_status_updated', {
                            id: g.id,
                            status: 'approved',
                            session_code: g.session_code || null,
                            gift_name: g.gift_name || null
                        });
                        if (g.session_code) {
                            sseChat.sendNotification(g.session_code, 'gift_approved', {
                                level: 'success',
                                title: 'Yêu cầu nhận quà đã được duyệt',
                                message: 'Yêu cầu nhận quà của bạn đã được duyệt.',
                                giftExchangeId: g.id,
                                status: 'approved'
                            });
                        }
                    });
                }
                break;
            case 'reject':
                result = await GiftExchange.update(
                    {
                        status: 'rejected',
                        approved_by: req.session?.user?.username || 'admin',
                        approved_at: new Date(),
                        rejection_reason: rejection_reason || null
                    },
                    { where: { id: ids } }
                );
                {
                    const rows = await GiftExchange.findAll({ where: { id: ids } });
                    rows.forEach((g) => {
                        sseChat.sendAdminEvent('gift_status_updated', {
                            id: g.id,
                            status: 'rejected',
                            session_code: g.session_code || null,
                            gift_name: g.gift_name || null,
                            rejection_reason: g.rejection_reason || null
                        });
                        if (g.session_code) {
                            sseChat.sendNotification(g.session_code, 'gift_rejected', {
                                level: 'warning',
                                title: 'Yêu cầu nhận quà bị từ chối',
                                message: g.rejection_reason || 'Yêu cầu nhận quà của bạn đã bị từ chối.',
                                giftExchangeId: g.id,
                                status: 'rejected',
                                rejection_reason: g.rejection_reason || null
                            });
                        }
                    });
                }
                break;
            default:
                return res.status(400).json({ success: false, message: 'Unknown action' });
        }

        res.json({ success: true, modified: result });
    } catch (err) {
        console.error('Bulk operation error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.patch('/conversion-requests/bulk', authMiddleware.isAdmin, async (req, res) => {
    try {
        const { ids, action, rejection_reason } = req.body;
        const { ConversionRequest, GameSession } = require('../models');
        const sseChat = require('../services/sseChat');

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid IDs' });
        }

        let result;
        switch (action) {
            case 'delete':
                result = await ConversionRequest.destroy({ where: { id: ids } });
                break;
            case 'approve':
                result = await ConversionRequest.update(
                    {
                        status: 'approved',
                        approved_by: req.session?.user?.username || 'admin',
                        approved_at: new Date(),
                        rejection_reason: null
                    },
                    { where: { id: ids } }
                );
                {
                    const rows = await ConversionRequest.findAll({ where: { id: ids } });
                    for (const c of rows) {
                        const approvedAmountVND = Math.max(0, Math.round(Number(c.amount_vnd || c.amount) || 0));
                        if (c.session_code) {
                            const session = await GameSession.findOne({ where: { session_code: c.session_code } });
                            if (session) {
                                const currentManual = Number(session.wallet_manual_amount || 0);
                                await session.update({ wallet_manual_amount: currentManual + approvedAmountVND });
                            }
                        }

                        sseChat.sendAdminEvent('conversion_status_updated', {
                            id: c.id,
                            status: 'approved',
                            session_code: c.session_code || null,
                            amount_vnd: approvedAmountVND
                        });

                        if (c.session_code) {
                            sseChat.sendNotification(c.session_code, 'conversion_approved', {
                                level: 'success',
                                title: 'Yêu cầu quy đổi đã được duyệt',
                                message: `Hộp #${c.box_number} đã được duyệt quy đổi ${approvedAmountVND.toLocaleString('vi-VN')} VND.`,
                                status: 'approved',
                                conversionId: c.id,
                                box_number: c.box_number,
                                amount_vnd: approvedAmountVND,
                                approved_by: req.session?.user?.username || 'admin'
                            });
                        }
                    }
                }
                break;
            case 'reject':
                result = await ConversionRequest.update(
                    {
                        status: 'rejected',
                        approved_by: req.session?.user?.username || 'admin',
                        approved_at: new Date(),
                        rejection_reason: rejection_reason || null
                    },
                    { where: { id: ids } }
                );
                {
                    const rows = await ConversionRequest.findAll({ where: { id: ids } });
                    rows.forEach((c) => {
                        sseChat.sendAdminEvent('conversion_status_updated', {
                            id: c.id,
                            status: 'rejected',
                            session_code: c.session_code || null,
                            rejection_reason: c.rejection_reason || null
                        });

                        if (c.session_code) {
                            sseChat.sendNotification(c.session_code, 'conversion_rejected', {
                                level: 'warning',
                                title: 'Yêu cầu quy đổi bị từ chối',
                                message: `Yêu cầu quy đổi hộp #${c.box_number} đã bị từ chối${c.rejection_reason ? `: ${c.rejection_reason}` : '.'}`,
                                status: 'rejected',
                                conversionId: c.id,
                                box_number: c.box_number,
                                rejection_reason: c.rejection_reason || null,
                                approved_by: req.session?.user?.username || 'admin'
                            });
                        }
                    });
                }
                break;
            default:
                return res.status(400).json({ success: false, message: 'Unknown action' });
        }

        res.json({ success: true, modified: result });
    } catch (err) {
        console.error('Bulk operation error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================================================
// 📥 EXPORT/IMPORT ENDPOINTS
// ============================================================================
router.get('/sessions/export', authMiddleware.isAdmin, async (req, res) => {
    try {
        const format = req.query.format || 'csv';
        const { GameSession } = require('../models');
        const sessions = await GameSession.findAll({ raw: true });
        
        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=sessions.json');
            res.json(sessions);
        } else {
            // CSV format
            const csv = [Object.keys(sessions[0] || {}).join(',')];
            sessions.forEach(s => {
                csv.push(Object.values(s).join(','));
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=sessions.csv');
            res.send(csv.join('\n'));
        }
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router
