const { Prize, GameSession, AuditLog } = require('../models')
const { validationResult } = require('express-validator')
const { sanitize } = require('xss')

/**
 * Prize Controller
 * Manages prize operations for game sessions
 */

/**
 * Create a new prize for a game session
 * POST /api/prizes/
 */
async function createPrize(req, res) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const {
      game_session_id,
      position,
      name,
      description,
      icon,
      image_url,
      cash_amount,
      rarity,
      color_hex,
      is_special,
      is_approved,
      weight
    } = req.body

    // Verify game session exists
    const gameSession = await GameSession.findByPk(game_session_id)
    if (!gameSession) {
      return res.status(404).json({
        success: false,
        message: 'Game session not found'
      })
    }

    // Validate rarity
    const validRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary']
    if (rarity && !validRarities.includes(rarity)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rarity. Must be: ' + validRarities.join(', ')
      })
    }

    // Create prize
    const prize = await Prize.create({
      game_session_id,
      position: parseInt(position),
      name: sanitize(name),
      description: sanitize(description || ''),
      icon: sanitize(icon || ''),
      image_url: sanitize(image_url || ''),
      cash_amount: parseFloat(cash_amount || 0),
      rarity: rarity || 'common',
      color_hex: color_hex || '#6B7280',
      status: 'ACTIVE',
      is_special: is_special ? true : false,
      is_approved: is_approved ? true : false,
      weight: parseFloat(weight || 1)
    })

    // Log audit event
    await AuditLog.create({
      session_code: gameSession.session_code,
      action: 'PRIZE_CREATED',
      details: `Prize #${position} created for session ${game_session_id}`,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
      status: 'SUCCESS'
    })

    res.status(201).json({
      success: true,
      message: 'Prize created successfully',
      data: {
        id: prize.id,
        game_session_id: prize.game_session_id,
        position: prize.position,
        name: prize.name,
        rarity: prize.rarity,
        created_at: prize.created_at
      }
    })
  } catch (err) {
    console.error('❌ Error creating prize:', err)
    
    // Log failure
    await AuditLog.create({
      action: 'PRIZE_CREATED',
      details: err.message,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
      status: 'FAILURE'
    }).catch(() => {})

    res.status(500).json({
      success: false,
      message: 'Failed to create prize'
    })
  }
}

/**
 * Get all prizes for a game session
 * GET /api/games/:sessionCode/prizes
 */
async function getPrizesBySession(req, res) {
  try {
    const { sessionCode } = req.params

    // Get game session
    const gameSession = await GameSession.findOne({
      where: { session_code: sessionCode }
    })

    if (!gameSession) {
      return res.status(404).json({
        success: false,
        message: 'Game session not found'
      })
    }

    // Get prizes
    const prizes = await Prize.findAll({
      where: { game_session_id: gameSession.id },
      order: [['position', 'ASC']],
      attributes: [
        'id',
        'position',
        'name',
        'description',
        'icon',
        'rarity',
        'color_hex',
        'is_special',
        'status',
        'cash_amount' // Only show cash if player won
      ]
    })

    res.json({
      success: true,
      data: prizes
    })
  } catch (err) {
    console.error('❌ Error getting prizes:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to get prizes'
    })
  }
}

/**
 * Update a prize
 * PUT /api/prizes/:prizeId
 */
async function updatePrize(req, res) {
  try {
    const { prizeId } = req.params
    const updateData = {}

    // Only allow updating specific fields
    const allowedFields = [
      'name',
      'description',
      'icon',
      'image_url',
      'cash_amount',
      'color_hex',
      'is_approved',
      'status'
    ]

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'name' || field === 'description' || field === 'icon' || field === 'image_url') {
          updateData[field] = sanitize(req.body[field])
        } else if (field === 'cash_amount') {
          updateData[field] = parseFloat(req.body[field])
        } else {
          updateData[field] = req.body[field]
        }
      }
    }

    const prize = await Prize.findByPk(prizeId)
    if (!prize) {
      return res.status(404).json({
        success: false,
        message: 'Prize not found'
      })
    }

    await prize.update(updateData)

    // Log audit event
    const gameSession = await GameSession.findByPk(prize.game_session_id)
    await AuditLog.create({
      session_code: gameSession?.session_code,
      action: 'PRIZE_UPDATED',
      details: `Prize #${prize.position} updated`,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
      status: 'SUCCESS'
    })

    res.json({
      success: true,
      message: 'Prize updated successfully',
      data: prize
    })
  } catch (err) {
    console.error('❌ Error updating prize:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to update prize'
    })
  }
}

/**
 * Delete a prize
 * DELETE /api/prizes/:prizeId
 */
async function deletePrize(req, res) {
  try {
    const { prizeId } = req.params

    const prize = await Prize.findByPk(prizeId)
    if (!prize) {
      return res.status(404).json({
        success: false,
        message: 'Prize not found'
      })
    }

    const gameSession = await GameSession.findByPk(prize.game_session_id)
    
    await prize.destroy()

    // Log audit event
    await AuditLog.create({
      session_code: gameSession?.session_code,
      action: 'PRIZE_DELETED',
      details: `Prize #${prize.position} deleted`,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
      status: 'SUCCESS'
    })

    res.json({
      success: true,
      message: 'Prize deleted successfully'
    })
  } catch (err) {
    console.error('❌ Error deleting prize:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to delete prize'
    })
  }
}

/**
 * Bulk create prizes for a session
 * POST /api/games/:sessionCode/prizes/bulk
 */
async function bulkCreatePrizes(req, res) {
  try {
    const { sessionCode } = req.params
    const { prizes } = req.body

    if (!Array.isArray(prizes) || prizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Prizes must be a non-empty array'
      })
    }

    // Get game session
    const gameSession = await GameSession.findOne({
      where: { session_code: sessionCode }
    })

    if (!gameSession) {
      return res.status(404).json({
        success: false,
        message: 'Game session not found'
      })
    }

    // Create all prizes
    const createdPrizes = []
    for (let i = 0; i < prizes.length; i++) {
      const prizeData = prizes[i]
      const prize = await Prize.create({
        game_session_id: gameSession.id,
        position: i + 1,
        name: sanitize(prizeData.name),
        description: sanitize(prizeData.description || ''),
        icon: sanitize(prizeData.icon || ''),
        image_url: sanitize(prizeData.image_url || ''),
        cash_amount: parseFloat(prizeData.cash_amount || 0),
        rarity: prizeData.rarity || 'common',
        color_hex: prizeData.color_hex || '#6B7280',
        status: 'ACTIVE',
        is_special: prizeData.is_special ? true : false,
        is_approved: prizeData.is_approved ? true : false,
        weight: parseFloat(prizeData.weight || 1)
      })
      createdPrizes.push(prize)
    }

    // Log audit event
    await AuditLog.create({
      session_code: gameSession.session_code,
      action: 'PRIZES_BULK_CREATED',
      details: `${createdPrizes.length} prizes created`,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
      status: 'SUCCESS'
    })

    res.status(201).json({
      success: true,
      message: `${createdPrizes.length} prizes created successfully`,
      data: createdPrizes.map(p => ({
        id: p.id,
        position: p.position,
        name: p.name,
        rarity: p.rarity
      }))
    })
  } catch (err) {
    console.error('❌ Error bulk creating prizes:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to bulk create prizes'
    })
  }
}

/**
 * Get single prize
 * GET /api/prizes/:prizeId
 */
async function getPrize(req, res) {
  try {
    const { prizeId } = req.params

    const prize = await Prize.findByPk(prizeId)
    if (!prize) {
      return res.status(404).json({
        success: false,
        message: 'Prize not found'
      })
    }

    res.json({
      success: true,
      data: prize
    })
  } catch (err) {
    console.error('❌ Error getting prize:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to get prize'
    })
  }
}

module.exports = {
  createPrize,
  getPrizesBySession,
  updatePrize,
  deletePrize,
  bulkCreatePrizes,
  getPrize
}
