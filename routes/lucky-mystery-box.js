/**
 * LUCKY MYSTERY BOX ROUTES
 * Routes for the Lucky Mystery Box game
 */

const express = require('express');
const router = express.Router();
const luckyMysteryBoxController = require('../controllers/luckyMysteryBoxController');
const validateBox = require('../middleware/validateBox');
const validatePreloadSession = require('../middleware/validatePreloadSession');
const { validateSessionSecurity, initializeSessionSecurity } = require('../middleware/sessionSecurityMiddleware');

/**
 * API ENDPOINTS for Lucky Mystery Box
 * These are mounted at /api/lucky-mystery-box
 */

// Apply session security checks to all game routes
router.use(validateSessionSecurity);

// Session management
router.get('/session', luckyMysteryBoxController.getSession);
router.post('/join', initializeSessionSecurity, luckyMysteryBoxController.joinSession);

// Game actions (box opening requires validation)
router.post('/:sessionCode/select-box', initializeSessionSecurity, validateBox, luckyMysteryBoxController.selectBox);
router.post('/open', initializeSessionSecurity, validateBox, luckyMysteryBoxController.selectBox); // Test-friendly route
router.post('/:sessionCode/claim', initializeSessionSecurity, luckyMysteryBoxController.claimItem);
router.post('/claim', initializeSessionSecurity, luckyMysteryBoxController.claimItem); // Test-friendly route
router.post('/:sessionCode/convert', initializeSessionSecurity, luckyMysteryBoxController.convertToMoney);
router.post('/convert', initializeSessionSecurity, luckyMysteryBoxController.convertToMoney); // Test-friendly route

// Wallet and inventory
router.get('/:sessionCode/wallet', validatePreloadSession, luckyMysteryBoxController.getWallet);
router.get('/:sessionCode/transactions', validatePreloadSession, luckyMysteryBoxController.getTransactions);
router.get('/:sessionCode/inventory', validatePreloadSession, luckyMysteryBoxController.getInventory);
router.get('/:sessionCode/player-inventory', validatePreloadSession, luckyMysteryBoxController.getPlayerInventory);
router.get('/:sessionCode/preload-boxes', validatePreloadSession, luckyMysteryBoxController.preloadBoxes);

// Withdrawal
router.post('/:sessionCode/withdraw', initializeSessionSecurity, luckyMysteryBoxController.requestWithdrawal);

// Search
router.get('/search', luckyMysteryBoxController.searchSession);

module.exports = router;
