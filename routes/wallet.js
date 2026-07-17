/**
 * Wallet Routes
 * /api/wallet/* endpoints for balance queries, transfers, transactions
 */

const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

// All wallet routes require authentication
router.use(authMiddleware.isAuthenticated);

/**
 * GET /api/wallet/:userId
 * Get wallet balance details
 */
router.get('/:userId', walletController.getWallet);

/**
 * POST /api/wallet/add-money
 * Add money to wallet (game win, bonus, etc.)
 * Body: { userId, amount, transactionType, metadata: {} }
 */
router.post('/add-money', walletController.addMoney);

/**
 * POST /api/wallet/subtract-money
 * Subtract money (withdrawal request)
 * Body: { userId, amount, transactionType, withdrawalId, metadata: {} }
 */
router.post('/subtract-money', walletController.subtractMoney);

/**
 * POST /api/wallet/lock-money
 * Lock money for game entry fee
 * Body: { userId, amount, metadata: {} }
 */
router.post('/lock-money', walletController.lockMoney);

/**
 * POST /api/wallet/unlock-money
 * Unlock money if game cancelled or fee refunded
 * Body: { userId, amount, metadata: {} }
 */
router.post('/unlock-money', walletController.unlockMoney);

/**
 * GET /api/wallet/:userId/transactions
 * Get transaction history
 * Query: limit=50, offset=0
 */
router.get('/:userId/transactions', walletController.getTransactionHistory);

module.exports = router;
