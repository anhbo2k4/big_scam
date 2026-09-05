const { GameSession, Prize, AuditLog } = require('../models')
const crypto = require('crypto')

/**
 * Game Features Controller
 * Handles different game types and their specific logic
 */

// Supported game types
const GAME_TYPES = {
  BOXES: 'boxes',
  WHEEL: 'wheel',
  SCRATCH: 'scratch',
  MYSTERY: 'mystery',
  GACHA: 'gacha',
  DICE: 'dice',
  CARDS: 'cards'
}

// Rarity settings
const RARITY_CONFIG = {
  common: {
    weight: 0.60,
    color: '#6B7280',
    emoji: '⚪'
  },
  uncommon: {
    weight: 0.25,
    color: '#10B981',
    emoji: '🟢'
  },
  rare: {
    weight: 0.10,
    color: '#3B82F6',
    emoji: '🔵'
  },
  epic: {
    weight: 0.04,
    color: '#A855F7',
    emoji: '🟣'
  },
  legendary: {
    weight: 0.01,
    color: '#F59E0B',
    emoji: '⭐'
  }
}

/**
 * Create a new game session with specific game type
 */
async function createGameSession(req, res) {
  try {
    const {
      session_code,
      game_type = GAME_TYPES.BOXES,
      box_count = 3,
      prizes = [],
      wheel_segments = null,
      mystery_categories = [],
      gacha_enabled = false
    } = req.body

    // Validate game type
    if (!Object.values(GAME_TYPES).includes(game_type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid game type. Allowed: ${Object.values(GAME_TYPES).join(', ')}`
      })
    }

    // Validate box count
    if (![3, 5, 10, 16, 25, 50].includes(box_count)) {
      return res.status(400).json({
        success: false,
        message: 'Box count must be one of: 3, 5, 10, 16, 25, 50'
      })
    }

    // Generate session code if not provided
    const finalSessionCode = session_code || Math.random().toString(36).substring(2, 10).toUpperCase()

    // Create base payload
    const sessionPayload = {
      session_code: finalSessionCode,
      game_type,
      box_count,
      player_token: crypto.randomBytes(32).toString('hex'),
      server_random_boxes: generateServerRandomBoxes(box_count),
      server_random_seed: crypto.randomBytes(64).toString('hex'),
      result_hash: crypto.createHash('sha256').update(Date.now().toString()).digest('hex'),
      mystery_enabled: game_type === GAME_TYPES.MYSTERY,
      mystery_categories: mystery_categories || [],
      gacha_enabled: gacha_enabled || game_type === GAME_TYPES.GACHA,
      gacha_rates: RARITY_CONFIG,
      wheel_segments: wheel_segments || null
    }

    // Add prizes from request
    if (prizes && Array.isArray(prizes) && prizes.length > 0) {
      for (let i = 0; i < Math.min(prizes.length, box_count); i++) {
        const prize = prizes[i]
        const prizeNum = i + 1
        
        sessionPayload[`prize_${prizeNum}`] = prize.name
        sessionPayload[`prize_${prizeNum}_description`] = prize.description || ''
        sessionPayload[`prize_${prizeNum}_icon`] = prize.icon || '🎁'
        sessionPayload[`prize_${prizeNum}_image_url`] = prize.image_url || null
        sessionPayload[`prize_${prizeNum}_cash_amount`] = prize.cash_amount || null
        sessionPayload[`prize_${prizeNum}_rarity`] = validateRarity(prize.rarity)
        sessionPayload[`prize_${prizeNum}_color_hex`] = prize.color_hex || RARITY_CONFIG[validateRarity(prize.rarity)].color
      }
    }

    // Create session
    const session = await GameSession.create(sessionPayload)

    // Log creation
    await logAuditEvent(session.session_code, 'GAME_SESSION_CREATED', req, {
      game_type,
      box_count,
      prizes_count: prizes.length
    })

    // Return safe data (hide secrets!)
    const responseData = sanitizeSessionResponse(session)

    res.json({
      success: true,
      data: responseData,
      message: `Game session created: ${game_type} with ${box_count} boxes`
    })
  } catch (err) {
    console.error('❌ Error creating game session:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to create game session'
    })
  }
}

/**
 * Get game configuration (UI needs to render correctly)
 */
async function getGameConfig(req, res) {
  try {
    const { code } = req.params
    const session = await GameSession.findOne({ where: { session_code: code } })

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' })
    }

    // Increment view count
    session.view_count = (session.view_count || 0) + 1
    await session.save()

    // Get game configuration based on type
    const config = getConfigByGameType(session.game_type, session)

    res.json({
      success: true,
      data: {
        session_code: session.session_code,
        game_type: session.game_type,
        box_count: session.box_count,
        config,
        prizes: getPrizesForGameType(session, session.game_type),
        view_count: session.view_count,
        is_completed: session.is_completed
      }
    })
  } catch (err) {
    console.error('❌ Error getting game config:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to get game configuration'
    })
  }
}

/**
 * Helper: Generate server-side random boxes
 */
function generateServerRandomBoxes(boxCount) {
  const boxes = Array.from({ length: boxCount }, (_, i) => i + 1)
  for (let i = boxes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [boxes[i], boxes[j]] = [boxes[j], boxes[i]]
  }
  return boxes
}

/**
 * Helper: Validate and normalize rarity
 */
function validateRarity(rarity) {
  const valid = Object.keys(RARITY_CONFIG)
  return valid.includes(rarity) ? rarity : 'common'
}

/**
 * Helper: Get configuration by game type
 */
function getConfigByGameType(gameType, session) {
  switch (gameType) {
    case GAME_TYPES.BOXES:
      return {
        type: 'grid',
        layout: getBoxGridLayout(session.box_count),
        show_animation: true,
        show_count: true,
        can_select: false // Server selects, not client
      }

    case GAME_TYPES.WHEEL:
      return {
        type: 'wheel',
        segments: session.wheel_segments || generateWheelSegments(session),
        speed: session.wheel_speed || 20,
        show_animation: true,
        spin_time_ms: 3000
      }

    case GAME_TYPES.SCRATCH:
      return {
        type: 'scratch',
        scratch_area: 'cover_all',
        reveal_threshold: 0.5, // Reveal when 50% scratched
        show_animation: true
      }

    case GAME_TYPES.MYSTERY:
      return {
        type: 'mystery',
        categories: session.mystery_categories || [],
        show_animation: true,
        reveal_category: false // Don't show until selected
      }

    case GAME_TYPES.GACHA:
      return {
        type: 'gacha',
        rates: session.gacha_rates,
        pity_system: true,
        pity_count: session.gacha_pity_count,
        bulk_pull: true,
        bulk_discount: 0.1
      }

    case GAME_TYPES.DICE:
      return {
        type: 'dice',
        dice_count: 3,
        sides: 6,
        show_animation: true,
        roll_time_ms: 1500
      }

    case GAME_TYPES.CARDS:
      return {
        type: 'cards',
        card_count: session.box_count,
        shuffle: true,
        show_animation: true,
        flip_time_ms: 300
      }

    default:
      return { type: 'unknown', error: 'Unsupported game type' }
  }
}

/**
 * Get grid layout based on box count
 */
function getBoxGridLayout(boxCount) {
  const layouts = {
    3: { columns: 3, rows: 1, gap: '20px' },
    5: { columns: 5, rows: 1, gap: '15px' },
    10: { columns: 5, rows: 2, gap: '15px' },
    16: { columns: 4, rows: 4, gap: '12px' },
    25: { columns: 5, rows: 5, gap: '10px' },
    50: { columns: 10, rows: 5, gap: '8px' }
  }
  return layouts[boxCount] || layouts[3]
}

/**
 * Generate wheel segments from session prizes
 */
function generateWheelSegments(session) {
  const segments = []
  for (let i = 1; i <= session.box_count; i++) {
    const prize = session[`prize_${i}`]
    const rarity = session[`prize_${i}_rarity`] || 'common'
    const color = session[`prize_${i}_color_hex`] || RARITY_CONFIG[rarity].color

    if (prize) {
      segments.push({
        label: prize,
        color: color,
        rarity: rarity,
        percentage: 100 / session.box_count
      })
    }
  }
  return segments
}

/**
 * Get prizes formatted for game type
 */
function getPrizesForGameType(session, gameType) {
  const prizes = []
  
  for (let i = 1; i <= session.box_count; i++) {
    const prizeName = session[`prize_${i}`]
    if (!prizeName) continue

    const prize = {
      position: i,
      name: prizeName,
      description: session[`prize_${i}_description`],
      icon: session[`prize_${i}_icon`],
      rarity: session[`prize_${i}_rarity`],
      color: session[`prize_${i}_color_hex`],
      is_special: session[`prize_${i}_is_special`],
      cash_amount: session[`prize_${i}_cash_amount`]
    }

    // For mystery boxes, don't reveal the name until selected
    if (gameType === GAME_TYPES.MYSTERY) {
      prize.name = '???' // Hide name
    }

    prizes.push(prize)
  }

  return prizes
}

/**
 * Sanitize session response (remove secrets)
 */
function sanitizeSessionResponse(session) {
  const data = session.toJSON()
  delete data.server_random_boxes
  delete data.player_token
  delete data.server_random_seed
  delete data.result_hash
  return data
}

/**
 * Log audit event
 */
async function logAuditEvent(sessionCode, action, req, details = {}, status = 'SUCCESS', errorMsg = null) {
  try {
    await AuditLog.create({
      session_code: sessionCode,
      action,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent'),
      details,
      status,
      error_message: errorMsg
    })
  } catch (err) {
    console.error('Failed to log audit event:', err)
  }
}

module.exports = {
  GAME_TYPES,
  RARITY_CONFIG,
  createGameSession,
  getGameConfig,
  generateServerRandomBoxes,
  validateRarity,
  getConfigByGameType,
  getBoxGridLayout,
  generateWheelSegments,
  getPrizesForGameType,
  sanitizeSessionResponse,
  logAuditEvent
}
