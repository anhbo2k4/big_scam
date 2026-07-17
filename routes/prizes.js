const express = require('express')
const router = express.Router()
const { body, param } = require('express-validator')
const prizeController = require('../controllers/prizeController')
const authMiddleware = require('../middleware/authMiddleware')
const rateLimit = require('express-rate-limit')

// Rate limiting for prize operations
const prizeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per window
  message: 'Too many prize requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
})

/**
 * Get single prize
 * GET /api/prizes/:prizeId
 */
router.get('/:prizeId', prizeLimiter, async (req, res) => {
  await prizeController.getPrize(req, res)
})

/**
 * Create a single prize
 * POST /api/prizes/
 */
router.post('/',
  authMiddleware.isAuthenticated,
  prizeLimiter,
  [
    body('game_session_id').isInt().withMessage('Invalid session ID'),
    body('position').isInt({ min: 1, max: 50 }).withMessage('Position must be 1-50'),
    body('name').trim().notEmpty().withMessage('Prize name is required'),
    body('rarity').optional().isIn(['common', 'uncommon', 'rare', 'epic', 'legendary'])
      .withMessage('Invalid rarity'),
    body('cash_amount').optional().isFloat({ min: 0 }).withMessage('Cash amount must be positive')
  ],
  async (req, res) => {
    await prizeController.createPrize(req, res)
  }
)

/**
 * Update a prize
 * PUT /api/prizes/:prizeId
 */
router.put('/:prizeId',
  authMiddleware.isAuthenticated,
  prizeLimiter,
  [
    param('prizeId').isInt().withMessage('Invalid prize ID'),
    body('rarity').optional().isIn(['common', 'uncommon', 'rare', 'epic', 'legendary'])
      .withMessage('Invalid rarity'),
    body('cash_amount').optional().isFloat({ min: 0 }).withMessage('Cash amount must be positive'),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'CLAIMED'])
      .withMessage('Invalid status')
  ],
  async (req, res) => {
    await prizeController.updatePrize(req, res)
  }
)

/**
 * Delete a prize
 * DELETE /api/prizes/:prizeId
 */
router.delete('/:prizeId',
  authMiddleware.isAuthenticated,
  prizeLimiter,
  async (req, res) => {
    await prizeController.deletePrize(req, res)
  }
)

/**
 * Get all prizes for a game session
 * GET /api/games/:sessionCode/prizes
 */
router.get('/game/:sessionCode', prizeLimiter, async (req, res) => {
  await prizeController.getPrizesBySession(req, res)
})

/**
 * Bulk create prizes for a session
 * POST /api/games/:sessionCode/prizes/bulk
 */
router.post('/game/:sessionCode/bulk',
  authMiddleware.isAuthenticated,
  prizeLimiter,
  [
    param('sessionCode').isString().withMessage('Invalid session code'),
    body('prizes').isArray({ min: 1 }).withMessage('Prizes must be a non-empty array'),
    body('prizes.*.name').trim().notEmpty().withMessage('Each prize needs a name')
  ],
  async (req, res) => {
    await prizeController.bulkCreatePrizes(req, res)
  }
)

module.exports = router
