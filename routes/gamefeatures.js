const express = require('express')
const router = express.Router()
const { body, param, query } = require('express-validator')
const gamefeaturesController = require('../controllers/gamefeaturesController')
const rateLimit = require('express-rate-limit')

// Strict rate limiting for game progress (security critical)
const gameProgressLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Too many game progress attempts. Please wait before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'GET' // Only limit POST/PUT
})

// Lighter rate limiting for game config (just reading data)
const gameConfigLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // 50 requests per window
  message: 'Too many requests for game config',
  standardHeaders: true,
  legacyHeaders: false
})

/**
 * Create a new game session
 * POST /api/games/create
 * Body: { game_type: 'boxes|wheel|scratch|mystery|gacha|dice|cards', box_count: 3-50, prizes: [...] }
 */
router.post('/create',
  gameProgressLimiter,
  [
    body('game_type')
      .isIn(['boxes', 'wheel', 'scratch', 'mystery', 'gacha', 'dice', 'cards'])
      .withMessage('Invalid game type'),
    body('box_count')
      .isInt({ min: 3, max: 50 })
      .withMessage('Box count must be 3-50'),
    body('prizes').optional().isArray().withMessage('Prizes must be an array'),
    body('wheel_speed').optional().isInt({ min: 1, max: 100 }).withMessage('Wheel speed must be 1-100'),
    body('custom_config').optional().isObject().withMessage('Custom config must be an object')
  ],
  async (req, res) => {
    await gamefeaturesController.createGameSession(req, res)
  }
)

/**
 * Get game configuration (for rendering)
 * GET /api/games/:sessionCode/config
 * Returns: game type specific config (grid, wheel, scratch, etc)
 */
router.get('/:sessionCode/config',
  gameConfigLimiter,
  [
    param('sessionCode')
      .isString()
      .isLength({ min: 6, max: 8 })
      .withMessage('Invalid session code format')
  ],
  async (req, res) => {
    await gamefeaturesController.getGameConfig(req, res)
  }
)

/**
 * Get all prizes for a game
 * GET /api/games/:sessionCode/prizes
 */
router.get('/:sessionCode/prizes',
  gameConfigLimiter,
  [
    param('sessionCode')
      .isString()
      .isLength({ min: 6, max: 8 })
      .withMessage('Invalid session code format')
  ],
  async (req, res) => {
    await gamefeaturesController.getPrizesForGameType(req, res)
  }
)

/**
 * Get grid layout for boxes game
 * GET /api/games/grid-layout
 * Query: ?boxCount=5
 */
router.get('/grid-layout',
  gameConfigLimiter,
  [
    query('boxCount')
      .optional()
      .isInt({ min: 3, max: 50 })
      .withMessage('Box count must be 3-50')
  ],
  async (req, res) => {
    try {
      const { boxCount = 9 } = req.query
      const layout = gamefeaturesController.getBoxGridLayout(parseInt(boxCount))
      
      res.json({
        success: true,
        data: {
          box_count: boxCount,
          columns: layout.columns,
          rows: layout.rows,
          total: layout.total
        }
      })
    } catch (err) {
      console.error('❌ Error getting grid layout:', err)
      res.status(400).json({
        success: false,
        message: 'Invalid box count'
      })
    }
  }
)

/**
 * Generate wheel segments (for wheel game)
 * POST /api/games/wheel-segments
 * Body: { prizes: [...] }
 */
router.post('/wheel-segments',
  gameConfigLimiter,
  [
    body('prizes').isArray({ min: 3 }).withMessage('Need at least 3 prizes for wheel')
  ],
  async (req, res) => {
    try {
      const { prizes } = req.body
      const segments = gamefeaturesController.generateWheelSegments(prizes)
      
      res.json({
        success: true,
        data: {
          segments: segments,
          total_segments: segments.length
        }
      })
    } catch (err) {
      console.error('❌ Error generating wheel segments:', err)
      res.status(400).json({
        success: false,
        message: 'Invalid prizes for wheel'
      })
    }
  }
)

/**
 * Get random boxes (server side)
 * POST /api/games/random-boxes
 * Body: { boxCount: 3-50 }
 */
router.post('/random-boxes',
  gameProgressLimiter,
  [
    body('boxCount')
      .isInt({ min: 3, max: 50 })
      .withMessage('Box count must be 3-50')
  ],
  async (req, res) => {
    try {
      const { boxCount } = req.body
      const randomBoxes = gamefeaturesController.generateServerRandomBoxes(parseInt(boxCount))
      
      res.json({
        success: true,
        data: {
          random_order: randomBoxes,
          total: randomBoxes.length
        }
      })
    } catch (err) {
      console.error('❌ Error generating random boxes:', err)
      res.status(500).json({
        success: false,
        message: 'Failed to generate random boxes'
      })
    }
  }
)

/**
 * Get rarity distribution
 * GET /api/games/rarity-distribution
 */
router.get('/rarity-distribution',
  gameConfigLimiter,
  async (req, res) => {
    try {
      const rarity = gamefeaturesController.RARITY_CONFIG
      
      res.json({
        success: true,
        data: rarity
      })
    } catch (err) {
      console.error('❌ Error getting rarity distribution:', err)
      res.status(500).json({
        success: false,
        message: 'Failed to get rarity distribution'
      })
    }
  }
)

/**
 * Get supported game types
 * GET /api/games/types
 */
router.get('/types',
  gameConfigLimiter,
  async (req, res) => {
    try {
      const types = gamefeaturesController.GAME_TYPES
      
      res.json({
        success: true,
        data: {
          types: types,
          count: Object.keys(types).length,
          details: [
            {
              type: types.BOXES,
              description: 'Grid of boxes to click and reveal prizes',
              min_boxes: 3,
              max_boxes: 50
            },
            {
              type: types.WHEEL,
              description: 'Spin the wheel to win prizes',
              min_segments: 3,
              max_segments: 50
            },
            {
              type: types.SCRATCH,
              description: 'Scratch off to reveal hidden prizes',
              reveal_threshold_percent: 50
            },
            {
              type: types.MYSTERY,
              description: 'Select boxes with hidden names until found',
              min_boxes: 3,
              max_boxes: 50
            },
            {
              type: types.GACHA,
              description: 'Summon prizes with rarity-based probability',
              pity_system: true,
              bulk_pull_discount: true
            },
            {
              type: types.DICE,
              description: 'Roll 3 dice and win based on outcome',
              dice_count: 3,
              sides_per_die: 6
            },
            {
              type: types.CARDS,
              description: 'Match pairs of cards to reveal prizes',
              min_cards: 3,
              max_cards: 50
            }
          ]
        }
      })
    } catch (err) {
      console.error('❌ Error getting game types:', err)
      res.status(500).json({
        success: false,
        message: 'Failed to get game types'
      })
    }
  }
)

module.exports = router
