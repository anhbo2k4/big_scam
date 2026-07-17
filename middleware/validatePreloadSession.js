/**
 * Validate Session for Preload
 * Lightweight validation for preload endpoints
 * Only checks: session exists and is active
 */

const { GameSession } = require('../models');

const validatePreloadSession = async (req, res, next) => {
  try {
    const sessionCode = (req.params.sessionCode || '').toUpperCase();
    
    if (!sessionCode || sessionCode.length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Mã phiên không hợp lệ'
      });
    }

    // Find session
    const session = await GameSession.findOne({
      where: { session_code: sessionCode, is_active: true }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Phiên không tồn tại hoặc đã hết hạn'
      });
    }

    // Attach validated session to request
    req.validatedSession = session;
    next();
  } catch (err) {
    console.error('❌ Error in validatePreloadSession:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực phiên'
    });
  }
};

module.exports = validatePreloadSession;
