const { GameSession, Withdrawal, GiftExchange, AuditLog, sequelize } = require('../models')
const { Op } = require('sequelize')

/**
 * Analytics Controller
 * Provides statistics and insights about game sessions
 */

/**
 * Get overall dashboard statistics
 */
async function getDashboardStats(req, res) {
  try {
    const stats = {}

    // Total games
    stats.total_games = await GameSession.count()

    // Completed games
    stats.completed_games = await GameSession.count({
      where: { is_completed: true }
    })

    // Completion rate
    stats.completion_rate = stats.total_games > 0 
      ? ((stats.completed_games / stats.total_games) * 100).toFixed(2)
      : 0

    // Active games today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    stats.games_today = await GameSession.count({
      where: {
        created_at: {
          [Op.gte]: today
        }
      }
    })

    // Game type distribution
    stats.game_type_distribution = await GameSession.findAll({
      attributes: [
        'game_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['game_type'],
      raw: true
    })

    // Box count distribution
    stats.box_count_distribution = await GameSession.findAll({
      attributes: [
        'box_count',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['box_count'],
      raw: true
    })

    // Total prizes value (if tracking cash)
    const prizeValues = await GameSession.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('prize_1_cash_amount')), 'total']
      ],
      raw: true
    })
    stats.total_prizes_cash = prizeValues[0]?.total || 0

    // Fraud detection
    stats.flagged_sessions = await GameSession.count({
      where: { fraud_flag: true }
    })

    // View statistics
    const viewStats = await GameSession.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('view_count')), 'total_views'],
        [sequelize.fn('AVG', sequelize.col('view_count')), 'avg_views']
      ],
      raw: true
    })
    stats.total_views = viewStats?.total_views || 0
    stats.avg_views = viewStats?.avg_views ? parseFloat(viewStats.avg_views).toFixed(2) : 0

    res.json({
      success: true,
      data: stats,
      timestamp: new Date()
    })
  } catch (err) {
    console.error('❌ Error getting dashboard stats:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics'
    })
  }
}

/**
 * Get game session performance metrics
 */
async function getPerformanceMetrics(req, res) {
  try {
    const metrics = {}

    // Average completion time (in seconds)
    const timeMetrics = await GameSession.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('completion_time_seconds')), 'avg_time'],
        [sequelize.fn('MIN', sequelize.col('completion_time_seconds')), 'min_time'],
        [sequelize.fn('MAX', sequelize.col('completion_time_seconds')), 'max_time']
      ],
      where: {
        completion_time_seconds: {
          [Op.not]: null
        }
      },
      raw: true
    })

    metrics.avg_completion_time_seconds = timeMetrics?.avg_time ? parseInt(timeMetrics.avg_time) : null
    metrics.min_completion_time_seconds = timeMetrics?.min_time || null
    metrics.max_completion_time_seconds = timeMetrics?.max_time || null

    // Share statistics
    const shareStats = await GameSession.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('share_count')), 'total_shares'],
        [sequelize.fn('AVG', sequelize.col('share_count')), 'avg_shares']
      ],
      raw: true
    })
    metrics.total_shares = shareStats?.total_shares || 0
    metrics.avg_shares_per_session = shareStats?.avg_shares ? parseFloat(shareStats.avg_shares).toFixed(2) : 0

    // Response time (from audit logs)
    const auditStats = await AuditLog.count({
      where: { action: 'GAME_PROGRESS' }
    })
    metrics.total_game_actions = auditStats

    // Error rate
    const errorCount = await AuditLog.count({
      where: { status: 'FAILURE' }
    })
    const totalLogs = await AuditLog.count()
    metrics.error_rate_percent = totalLogs > 0 ? ((errorCount / totalLogs) * 100).toFixed(2) : 0

    res.json({
      success: true,
      data: metrics
    })
  } catch (err) {
    console.error('❌ Error getting performance metrics:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to get performance metrics'
    })
  }
}

/**
 * Get rarity distribution
 */
async function getRarityDistribution(req, res) {
  try {
    const distribution = {}
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary']

    for (const rarity of rarities) {
      distribution[rarity] = await GameSession.count({
        where: {
          [Op.or]: [
            { prize_1_rarity: rarity },
            { prize_2_rarity: rarity },
            { prize_3_rarity: rarity }
          ]
        }
      })
    }

    res.json({
      success: true,
      data: distribution
    })
  } catch (err) {
    console.error('❌ Error getting rarity distribution:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to get rarity distribution'
    })
  }
}

/**
 * Get audit log summary
 */
async function getAuditLogSummary(req, res) {
  try {
    const { days = 7 } = req.query

    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - parseInt(days))

    // Group audit logs by action
    const actionSummary = await AuditLog.findAll({
      attributes: [
        'action',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: sinceDate
        }
      },
      group: ['action'],
      raw: true
    })

    // Group by status
    const statusSummary = await AuditLog.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: sinceDate
        }
      },
      group: ['status'],
      raw: true
    })

    res.json({
      success: true,
      data: {
        period_days: parseInt(days),
        actions: actionSummary,
        statuses: statusSummary,
        total_logs: actionSummary.reduce((sum, a) => sum + parseInt(a.count), 0)
      }
    })
  } catch (err) {
    console.error('❌ Error getting audit log summary:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to get audit log summary'
    })
  }
}

/**
 * Export analytics as CSV
 */
async function exportAnalytics(req, res) {
  try {
    const { format = 'csv' } = req.query

    const sessions = await GameSession.findAll({
      limit: 10000,
      raw: true
    })

    if (format === 'csv') {
      // Create CSV header
      const headers = [
        'Session Code',
        'Game Type',
        'Box Count',
        'Completed',
        'Views',
        'Shares',
        'Completion Time (s)',
        'Fraud Flag',
        'Created At'
      ]

      // Create CSV rows
      const rows = sessions.map(s => [
        s.session_code,
        s.game_type,
        s.box_count,
        s.is_completed ? 'Yes' : 'No',
        s.view_count,
        s.share_count,
        s.completion_time_seconds || 'N/A',
        s.fraud_flag ? 'Yes' : 'No',
        new Date(s.created_at).toLocaleString()
      ])

      // Combine headers and rows
      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="analytics.csv"')
      res.send(csv)

    } else if (format === 'json') {
      res.json({
        success: true,
        data: sessions,
        count: sessions.length
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Unsupported format. Use: csv or json'
      })
    }
  } catch (err) {
    console.error('❌ Error exporting analytics:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics'
    })
  }
}

/**
 * Get fraud detection report
 */
async function getFraudReport(req, res) {
  try {
    const flaggedSessions = await GameSession.findAll({
      where: { fraud_flag: true },
      attributes: ['session_code', 'fraud_reason', 'created_at'],
      limit: 100,
      order: [['created_at', 'DESC']],
      raw: true
    })

    // Get related audit logs
    const fraudDetails = await AuditLog.findAll({
      where: {
        status: 'FAILURE'
      },
      attributes: ['session_code', 'action', 'ip_address', 'created_at'],
      limit: 100,
      order: [['created_at', 'DESC']],
      raw: true
    })

    res.json({
      success: true,
      data: {
        flagged_sessions: flaggedSessions,
        failure_logs: fraudDetails,
        total_flagged: flaggedSessions.length,
        total_failures: fraudDetails.length
      }
    })
  } catch (err) {
    console.error('❌ Error getting fraud report:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to get fraud report'
    })
  }
}

/**
 * Get daily sessions over last 30 days
 */
async function getDailySessions(req, res) {
  try {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const sessions = await sequelize.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM game_sessions
      WHERE created_at >= :startDate
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, {
      replacements: { startDate: thirtyDaysAgo },
      type: sequelize.QueryTypes.SELECT
    }).catch(()=>[])
    
    res.json({ success: true, data: sessions || [] })
  } catch (err) {
    console.error('getDailySessions error:', err)
    res.json({ success: true, data: [] })
  }
}

/**
 * Get withdrawal status breakdown
 */
async function getWithdrawalStatus(req, res) {
  try {
    const pending = await Withdrawal.count({ where: { status: 'pending' } }).catch(()=>0)
    const approved = await Withdrawal.count({ where: { status: 'approved' } }).catch(()=>0)
    const rejected = await Withdrawal.count({ where: { status: 'rejected' } }).catch(()=>0)
    
    res.json({ success: true, data: {
      pending, approved, rejected
    }})
  } catch (err) {
    console.error('getWithdrawalStatus error:', err)
    res.json({ success: true, data: { pending: 0, approved: 0, rejected: 0 } })
  }
}

/**
 * Get prize distribution
 */
async function getPrizeDistribution(req, res) {
  try {
    const normal = await GiftExchange.count({ where: { status: 'approved' } }).catch(()=>0)
    const pending = await GiftExchange.count({ where: { status: 'pending_approval' } }).catch(()=>0)
    const rejected = await GiftExchange.count({ where: { status: 'rejected' } }).catch(()=>0)
    
    res.json({ success: true, data: {
      approved: normal, pending_approval: pending, rejected
    }})
  } catch (err) {
    console.error('getPrizeDistribution error:', err)
    res.json({ success: true, data: { approved: 0, pending_approval: 0, rejected: 0 } })
  }
}

module.exports = {
  getDashboardStats,
  getPerformanceMetrics,
  getDailySessions,
  getWithdrawalStatus,
  getPrizeDistribution,
  getRarityDistribution,
  getAuditLogSummary,
  exportAnalytics,
  getFraudReport
}
