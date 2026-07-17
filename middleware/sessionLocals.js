/**
 * Session Locals Middleware
 * Injects session data into res.locals for every request
 * Sets session badge, wallet balance, inventory icon
 * Clears session on homepage
 */

const { GameSession } = require('../models');

function resetSessionLocals(res) {
  res.locals.session = null;
  res.locals.walletBalance = 0;
  res.locals.hasInventory = false;
}

function shouldHydrateSessionLocals(req) {
  const path = String(req.path || '').trim().toLowerCase();
  if (!path) return true;
  if (path === '/' || path === '/lucky-mystery-box') return false;
  if (path.startsWith('/api') || path.startsWith('/events') || path.startsWith('/stream')) return false;

  const accept = String(req.get?.('accept') || '').toLowerCase();
  const fetchDest = String(req.get?.('sec-fetch-dest') || '').toLowerCase();
  if (!accept && !fetchDest) return true;
  return fetchDest === 'document' || accept.includes('text/html');
}

const sessionLocalsMiddleware = async (req, res, next) => {
  try {
    if (!shouldHydrateSessionLocals(req)) {
      resetSessionLocals(res);
      return next();
    }

    // Get session code from URL params, query, or session storage
    const sessionCode = req.params.code || req.query.code || req.session?.sessionCode;

    if (!sessionCode) {
      resetSessionLocals(res);
      return next();
    }

    // Query database for this session
    const session = await GameSession.findOne({
      where: { session_code: sessionCode, is_active: true },
      attributes: [
        'id', 'session_code', 'player_name', 'is_active',
        'player_selected_box', 'is_exchanged',
        'prize_1_cash_amount', 'prize_2_cash_amount', 'prize_3_cash_amount'
      ]
    });

    if (!session) {
      resetSessionLocals(res);
      return next();
    }

    // Inject into res.locals
    res.locals.session = session;

    // Calculate wallet balance (only if exchanged)
    if (session.is_exchanged && session.player_selected_box) {
      const selectedBox = session.player_selected_box;
      const cashField = `prize_${selectedBox}_cash_amount`;
      res.locals.walletBalance = session[cashField] || 0;
    } else {
      res.locals.walletBalance = 0;
    }

    // Check if has inventory (opened a box)
    res.locals.hasInventory = session.player_selected_box !== null;

    next();
  } catch (err) {
    console.error('❌ Error in sessionLocalsMiddleware:', err);
    resetSessionLocals(res);
    next();
  }
};

module.exports = sessionLocalsMiddleware;
