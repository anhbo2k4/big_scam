const express = require('express')
const router = express.Router()
const analyticsController = require('../controllers/analyticsController')
const authMiddleware = require('../middleware/authMiddleware')
const rateLimit = require('express-rate-limit')
const fs = require('fs').promises
const path = require('path')

// Data directory for JSON configs
const dataDir = path.join(__dirname, '../data')
const ANALYTICS_CACHE_TTL_MS = Math.max(1000, Number(process.env.ANALYTICS_CACHE_TTL_MS || 15000))
const analyticsResponseCache = new Map()

function clonePayload(payload) {
  return JSON.parse(JSON.stringify(payload))
}

async function withCachedJson(req, ttlMs, producer) {
  const cacheKey = String(req.originalUrl || req.url || '').trim()
  const now = Date.now()
  const cached = analyticsResponseCache.get(cacheKey)
  if (cached && (now - cached.at) < ttlMs) {
    return clonePayload(cached.payload)
  }

  const payload = await producer()
  analyticsResponseCache.set(cacheKey, { at: now, payload: clonePayload(payload) })

  if (analyticsResponseCache.size > 100) {
    const cutoff = now - (ttlMs * 2)
    for (const [key, value] of analyticsResponseCache.entries()) {
      if (Number(value?.at || 0) < cutoff) analyticsResponseCache.delete(key)
    }
  }

  return payload
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (e) {
    console.error('Error creating data directory:', e.message)
  }
}

// Rate limiting for analytics (gentler than game endpoints)
const analyticsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // 30 requests per window
  message: 'Too many analytics requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
})

/**
 * Dashboard statistics
 * GET /api/analytics/dashboard
 */
router.get('/dashboard', authMiddleware.isAuthenticated, analyticsLimiter, async (req, res) => {
  // Only admins can access
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required'
    })
  }
  
  await analyticsController.getDashboardStats(req, res)
})

/**
 * Performance metrics
 * GET /api/analytics/performance
 */
router.get('/performance', authMiddleware.isAuthenticated, analyticsLimiter, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required'
    })
  }
  
  await analyticsController.getPerformanceMetrics(req, res)
})

/**
 * Rarity distribution
 * GET /api/analytics/rarity
 */
router.get('/rarity', authMiddleware.isAuthenticated, analyticsLimiter, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required'
    })
  }
  
  await analyticsController.getRarityDistribution(req, res)
})

/**
 * Audit log summary
 * GET /api/analytics/audit
 * Query: ?days=7 (optional)
 */
router.get('/audit', authMiddleware.isAuthenticated, analyticsLimiter, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required'
    })
  }
  
  await analyticsController.getAuditLogSummary(req, res)
})

/**
 * Export analytics
 * GET /api/analytics/export
 * Query: ?format=csv|json
 */
router.get('/export', authMiddleware.isAuthenticated, analyticsLimiter, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required'
    })
  }
  
  await analyticsController.exportAnalytics(req, res)
})

/**
 * Fraud detection report
 * GET /api/analytics/fraud
 */
router.get('/fraud', authMiddleware.isAuthenticated, analyticsLimiter, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin role required'
    })
  }
  
  await analyticsController.getFraudReport(req, res)
})

// ============ CUSTOMIZATION - CONFIG ENDPOINTS ============

const defaultCustomization = {
  logoUrl: '',
  logoHeight: 120,
  mainTitle: 'Trò chơi Mở Hộp Quà May Mắn',
  mainDescription: 'Chơi trò chơi để giành quà tặng hấp dẫn',
  bannerText: '',
  bannerVisible: false,
  footerText: '© 2026 - Trò Chơi May Mắn',
  features: {
    history: true,
    chat: true,
    twoFA: false,
    withdraw: true,
    gifts: true
  },
  customCSS: '',
  customJS: ''
}

async function readCustomization() {
  try {
    const file = path.join(dataDir, 'customization.json')
    const data = await fs.readFile(file, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    return defaultCustomization
  }
}

async function writeCustomization(data) {
  try {
    await ensureDataDir()
    const file = path.join(dataDir, 'customization.json')
    await fs.writeFile(file, JSON.stringify(data, null, 2))
    return data
  } catch (e) {
    console.error('Write customization error:', e.message)
    return data
  }
}

router.get('/customization', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  const data = await readCustomization()
  res.json({ success: true, data })
})

router.post('/customization', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const data = await readCustomization()
    const merged = { ...data, ...req.body }
    const saved = await writeCustomization(merged)
    res.json({ success: true, data: saved })
  } catch (e) {
    res.json({ success: false, message: e.message })
  }
})

router.patch('/customization/features', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const { feature, enabled } = req.body
    const data = await readCustomization()
    data.features = data.features || {}
    data.features[feature] = enabled
    const saved = await writeCustomization(data)
    res.json({ success: true, data: saved.features })
  } catch (e) {
    res.json({ success: false, message: e.message })
  }
})

// ============ STATS ENDPOINT ============

router.get('/stats', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const payload = await withCachedJson(req, ANALYTICS_CACHE_TTL_MS, async () => {
      const { GameSession, Withdrawal } = require('../models')
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const Op = require('sequelize').Op

      const [
        totalSessions,
        totalWithdrawals,
        approvedWithdrawals,
        totalRevenue,
        activeSessions,
        playersToday
      ] = await Promise.all([
        GameSession.count().catch(() => 0),
        Withdrawal.count().catch(() => 0),
        Withdrawal.count({ where: { status: 'approved' } }).catch(() => 0),
        Withdrawal.sum('amount', { where: { status: 'approved' } }).catch(() => 0),
        GameSession.count({ where: { status: 'active' } }).catch(() => 0),
        GameSession.count({ where: { createdAt: { [Op.gte]: today } } }).catch(() => 0)
      ])

      const approvalRate = totalWithdrawals > 0 ? ((approvedWithdrawals / totalWithdrawals) * 100).toFixed(1) : 0
      return {
        success: true,
        totalRevenue: totalRevenue || 0,
        approvalRate: parseFloat(approvalRate),
        activeSessions,
        playersToday,
        totalSessions,
        totalWithdrawals
      }
    })

    res.json(payload)
  } catch (e) {
    console.error('Stats error:', e.message)
    res.json({
      success: true,
      totalRevenue: 0,
      approvalRate: 0,
      activeSessions: 0,
      playersToday: 0,
      totalSessions: 0,
      totalWithdrawals: 0
    })
  }
})

// ============ CHARTS - SESSIONS OVER TIME ============

router.get('/sessions-over-time', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const payload = await withCachedJson(req, ANALYTICS_CACHE_TTL_MS, async () => {
      const { GameSession } = require('../models')
      const Op = require('sequelize').Op
      const { from, to } = req.query
      
      let whereClause = {}
      if (from || to) {
        whereClause.createdAt = {}
        if (from) whereClause.createdAt[Op.gte] = new Date(from)
        if (to) whereClause.createdAt[Op.lte] = new Date(to)
      } else {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        whereClause.createdAt = { [Op.gte]: thirtyDaysAgo }
      }
      
      const fn = require('sequelize').fn
      const col = require('sequelize').col
      const sessions = await GameSession.findAll({
        attributes: [
          [fn('DATE', col('created_at')), 'date'],
          [fn('COUNT', '*'), 'count']
        ],
        where: whereClause,
        group: [fn('DATE', col('created_at'))],
        order: [[fn('DATE', col('created_at')), 'ASC']],
        raw: true
      })
      
      const labels = sessions.map(s => {
        const date = new Date(s.date)
        return `${date.getDate()}/${date.getMonth() + 1}`
      })
      const data = sessions.map(s => parseInt(s.count))
      return { success: true, labels, data }
    })

    res.json(payload)
  } catch (e) {
    console.error('Sessions over time error:', e.message)
    res.json({ success: true, labels: [], data: [] })
  }
})

// ============ CHARTS - WITHDRAWALS OVER TIME ============

router.get('/withdrawals-over-time', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const payload = await withCachedJson(req, ANALYTICS_CACHE_TTL_MS, async () => {
      const { Withdrawal } = require('../models')
      const Op = require('sequelize').Op
      const { from, to } = req.query
      
      let whereClause = {}
      if (from || to) {
        whereClause.created_at = {}
        if (from) whereClause.created_at[Op.gte] = new Date(from)
        if (to) whereClause.created_at[Op.lte] = new Date(to)
      } else {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        whereClause.created_at = { [Op.gte]: thirtyDaysAgo }
      }
      
      const fn = require('sequelize').fn
      const col = require('sequelize').col
      const withdrawals = await Withdrawal.findAll({
        attributes: [
          [fn('DATE', col('created_at')), 'date'],
          'status',
          [fn('COUNT', '*'), 'count']
        ],
        where: whereClause,
        group: [fn('DATE', col('created_at')), 'status'],
        order: [[fn('DATE', col('created_at')), 'ASC']],
        raw: true
      })
      
      const dateMap = {}
      withdrawals.forEach(w => {
        const date = new Date(w.date)
        const label = `${date.getDate()}/${date.getMonth() + 1}`
        if (!dateMap[label]) {
          dateMap[label] = { total: 0, approved: 0 }
        }
        dateMap[label].total += parseInt(w.count)
        if (w.status === 'approved') {
          dateMap[label].approved += parseInt(w.count)
        }
      })
      
      const labels = Object.keys(dateMap)
      const total = labels.map(l => dateMap[l].total)
      const approved = labels.map(l => dateMap[l].approved)
      return { success: true, labels, total, approved }
    })

    res.json(payload)
  } catch (e) {
    console.error('Withdrawals over time error:', e.message)
    res.json({ success: true, labels: [], total: [], approved: [] })
  }
})

// ============ CHARTS - PRIZE DISTRIBUTION ============

router.get('/prize-distribution', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const payload = await withCachedJson(req, ANALYTICS_CACHE_TTL_MS, async () => {
      const { GameSession } = require('../models')
      const Op = require('sequelize').Op
      
      const [vipCount, normalCount, unluckyCount] = await Promise.all([
        GameSession.count({ 
          where: { 
            [Op.or]: [
              { prize_1_status: 'VIP' },
              { prize_2_status: 'VIP' },
              { prize_3_status: 'VIP' }
            ]
          }
        }).catch(() => 0),
        GameSession.count({ 
          where: { 
            [Op.or]: [
              { prize_1_status: 'NORMAL' },
              { prize_2_status: 'NORMAL' },
              { prize_3_status: 'NORMAL' }
            ]
          }
        }).catch(() => 0),
        GameSession.count({ 
          where: { 
            [Op.or]: [
              { prize_1_status: 'UNLUCKY' },
              { prize_2_status: 'UNLUCKY' },
              { prize_3_status: 'UNLUCKY' }
            ]
          }
        }).catch(() => 0)
      ])
      
      return {
        success: true,
        labels: ['VIP', 'NORMAL', 'UNLUCKY'],
        data: [vipCount, normalCount, unluckyCount],
        colors: ['#eab308', '#3b82f6', '#ef4444']
      }
    })

    res.json(payload)
  } catch (e) {
    console.error('Prize distribution error:', e.message)
    res.json({ success: true, labels: ['VIP', 'NORMAL', 'UNLUCKY'], data: [0, 0, 0], colors: ['#eab308', '#3b82f6', '#ef4444'] })
  }
})

// ============ CHARTS - TOP BANKS ============

router.get('/top-banks', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const payload = await withCachedJson(req, ANALYTICS_CACHE_TTL_MS, async () => {
      const { Withdrawal } = require('../models')
      const fn = require('sequelize').fn
      
      const banks = await Withdrawal.findAll({
        attributes: [
          'bank_name',
          [fn('COUNT', '*'), 'count']
        ],
        where: { status: 'approved' },
        group: ['bank_name'],
        order: [[fn('COUNT', '*'), 'DESC']],
        limit: 5,
        raw: true
      })
      
      const labels = banks.map(b => b.bank_name || 'Unknown')
      const data = banks.map(b => parseInt(b.count))
      return { success: true, labels, data }
    })

    res.json(payload)
  } catch (e) {
    console.error('Top banks error:', e.message)
    res.json({ success: true, labels: [], data: [] })
  }
})

// ============ ACTIVITY LOG ============

router.get('/activity', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const payload = await withCachedJson(req, Math.max(3000, ANALYTICS_CACHE_TTL_MS), async () => {
      const limit = parseInt(req.query.limit) || 50
      const page = parseInt(req.query.page) || 1
      const offset = (page - 1) * limit
      const { GameSession } = require('../models')
      
      const [sessions, total] = await Promise.all([
        GameSession.findAll({
          limit,
          offset,
          order: [['created_at', 'DESC']],
          raw: true
        }),
        GameSession.count()
      ])
      
      const activities = sessions.map(s => ({
        id: s.id,
        type: 'session',
        action: 'Tạo phiên chơi',
        user: s.created_by || 'System',
        ip: s.ip_address || 'Unknown',
        createdAt: s.created_at,
        detail: s.session_code
      }))
      
      const hasMore = offset + limit < total
      return { success: true, activities, total, hasMore }
    })

    res.json(payload)
  } catch (e) {
    console.error('Activity error:', e.message)
    res.json({ success: true, activities: [], total: 0, hasMore: false })
  }
})

// ============ CLEANUP CONFIG ============

const defaultCleanupConfig = {
  enabled: true,
  days: 15,
  lastRun: null,
  nextRun: null
}

async function readCleanupConfig() {
  try {
    const file = path.join(dataDir, 'cleanup-config.json')
    const data = await fs.readFile(file, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    return defaultCleanupConfig
  }
}

async function writeCleanupConfig(data) {
  try {
    await ensureDataDir()
    const file = path.join(dataDir, 'cleanup-config.json')
    await fs.writeFile(file, JSON.stringify(data, null, 2))
    return data
  } catch (e) {
    console.error('Write cleanup config error:', e.message)
    return data
  }
}

router.get('/cleanup', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  const config = await readCleanupConfig()
  res.json({ success: true, data: config })
})

router.patch('/cleanup', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const config = await readCleanupConfig()
    const merged = { ...config, ...req.body }
    const saved = await writeCleanupConfig(merged)
    res.json({ success: true, data: saved })
  } catch (e) {
    res.json({ success: false, message: e.message })
  }
})

router.post('/cleanup/run', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const { GameSession } = require('../models')
    const Op = require('sequelize').Op
    const config = await readCleanupConfig()
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - config.days)
    
    const deleted = await GameSession.destroy({
      where: {
        created_at: { [Op.lt]: cutoffDate }
      }
    })
    
    config.lastRun = new Date().toISOString()
    const nextRun = new Date()
    nextRun.setDate(nextRun.getDate() + 1)
    config.nextRun = nextRun.toISOString()
    await writeCleanupConfig(config)
    
    res.json({
      success: true,
      deleted,
      message: `Đã xóa ${deleted} phiên chơi cũ hơn ${config.days} ngày`
    })
  } catch (e) {
    res.json({ success: false, message: e.message })
  }
})

// ============ EXPORT ALL DATA ============

router.get('/export-all', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const { GameSession, Withdrawal, User } = require('../models')
    
    const sessions = await GameSession.findAll({ raw: true })
    const withdrawals = await Withdrawal.findAll({ raw: true })
    const users = await User.findAll({ 
      attributes: { exclude: ['password_hash'] },
      raw: true 
    })
    
    const exportData = {
      sessions,
      withdrawals,
      users,
      exportedAt: new Date().toISOString()
    }
    
    res.setHeader('Content-Disposition', 'attachment; filename=backup.json')
    res.json(exportData)
  } catch (e) {
    res.json({ success: false, message: e.message })
  }
})

// ============ SYSTEM STATS ============

router.get('/system-stats', authMiddleware.isAuthenticated, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false })
  try {
    const payload = await withCachedJson(req, Math.max(5000, ANALYTICS_CACHE_TTL_MS), async () => {
      const { GameSession, Withdrawal, User } = require('../models')
      
      const [totalSessions, totalWithdrawals, totalUsers] = await Promise.all([
        GameSession.count().catch(() => 0),
        Withdrawal.count().catch(() => 0),
        User.count().catch(() => 0)
      ])
      
      let totalFiles = 0
      try {
        const fileDir = path.join(__dirname, '../public/uploads')
        const files = await fs.readdir(fileDir)
        totalFiles = files.length
      } catch (e) {
        totalFiles = 0
      }
      
      return {
        success: true,
        totalSessions,
        totalWithdrawals,
        totalUsers,
        totalFiles,
        serverTime: new Date().toISOString()
      }
    })

    res.json(payload)
  } catch (e) {
    res.json({
      success: true,
      totalSessions: 0,
      totalWithdrawals: 0,
      totalUsers: 0,
      totalFiles: 0,
      serverTime: new Date().toISOString()
    })
  }
})

module.exports = router

