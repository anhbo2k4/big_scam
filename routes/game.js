const express = require('express');
const router = express.Router();
const db = require('../models');
const { gameProgressLimiter, sessionCreateLimiter } = require('../middleware/rateLimitMiddleware');
const { 
  sanitizeInputs, 
  validateBoxSelection, 
  detectSuspiciousPatterns,
  validateGameProgress 
} = require('../middleware/sanitizeMiddleware');
const crypto = require('crypto');

// Helper: Log audit event
async function logAuditEvent(sessionCode, action, req, details = {}, status = 'SUCCESS', errorMsg = null) {
  try {
    await db.AuditLog.create({
      session_code: sessionCode,
      action,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent'),
      details,
      status,
      error_message: errorMsg
    });
  } catch (err) {
  }
}

// Apply sanitization to all game routes
router.use(sanitizeInputs);
router.use(detectSuspiciousPatterns);

router.get('/session/:code', sessionCreateLimiter, async (req, res) => {
    try {
        const session = await db.GameSession.findOne({
            where: { session_code: req.params.code }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Phiên chơi không tồn tại'
            });
        }
        
        let boxPositions = session.box_positions;
        if (typeof boxPositions === 'string') {
            try {
                boxPositions = JSON.parse(boxPositions);
            } catch (e) {
                boxPositions = [1, 2, 3];
            }
        }

        // ✅ NEW: Don't expose server_random_boxes to client
        try {
            const resData = session.get({ plain: true });
            delete resData.server_random_boxes;
            delete resData.player_token;
            delete resData.server_random_seed;
            delete resData.result_hash;

            await logAuditEvent(session.session_code, 'SESSION_VIEW', req);

            res.json({
                success: true,
                data: {
                    ...resData,
                    box_positions: boxPositions
                }
            });
        } catch (serializeErr) {
            // Fallback response with minimal data
            res.json({
                success: true,
                data: {
                    id: session.id,
                    session_code: session.session_code,
                    is_active: session.is_active,
                    box_positions: boxPositions,
                    message: '⚠️ Partial data returned due to serialization issue'
                }
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message,
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Update game progress
router.post('/session/:code/progress', gameProgressLimiter, validateGameProgress(), async (req, res) => {
    try {
        const { boxesOpened, selectedPrize, isCompleted } = req.body;
        
        // ✅ CRITICAL FIX: IGNORE selectedBoxNumber from client!
        // The winning box was already determined on the server

        const session = await db.GameSession.findOne({
            where: { session_code: req.params.code }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Phiên chơi không tồn tại'
            });
        }

        // ✅ NEW: Use server_random_boxes instead of client selection
        let winningBox = null;
        if (session.server_random_boxes && session.server_random_boxes.length > 0) {
            winningBox = session.server_random_boxes[0];
        } else {
            // Fallback for sessions created before this update
            winningBox = 1;
        }

        // Update boxes opened status
        if (boxesOpened) {
            session.box_1_opened = boxesOpened[0] || session.box_1_opened;
            session.box_2_opened = boxesOpened[1] || session.box_2_opened;
            session.box_3_opened = boxesOpened[2] || session.box_3_opened;
        }

        // ✅ NEW: Set player_selected_box to the SERVER-DETERMINED winning box
        session.player_selected_box = winningBox;
        session.is_completed = isCompleted !== undefined ? isCompleted : true;
        session.player_selected_at = new Date();
        
        await session.save();

        await logAuditEvent(session.session_code, 'GAME_PROGRESS', req, { winning_box: winningBox });

        // Return safe data
        const resData = session.toJSON();
        delete resData.server_random_boxes;
        delete resData.player_token;
        delete resData.server_random_seed;
        delete resData.result_hash;

        res.json({
            success: true,
            data: resData
        });
    } catch (err) {
        await logAuditEvent(req.params.code, 'GAME_PROGRESS_ERROR', req, {}, 'FAILURE', err.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Track box selection in real-time
router.post('/session/:code/box-selected', gameProgressLimiter, validateBoxSelection(), async (req, res) => {
    try {
        // ✅ CRITICAL FIX: Reject box_number from client!
        // The server already determined the winning box
        
        const { player_name, player_phone, player_email } = req.body;
        const code = req.params.code;

        // Find session
        const session = await db.GameSession.findOne({
            where: { session_code: code }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Phiên chơi không tồn tại'
            });
        }

        // ✅ NEW: Use server_random_boxes to determine winning box
        const winningBox = session.server_random_boxes && session.server_random_boxes.length > 0 
            ? session.server_random_boxes[0] 
            : 1;

        const selectedPrize = session[`prize_${winningBox}`];

        // Capture event details
        const eventDetails = {
            timestamp: new Date().toISOString(),
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            method: 'web_selection',
            server_determined_box: winningBox
        };

        // Update session with box selection data
        session.player_selected_box = winningBox;
        session.player_selected_at = new Date();
        session.player_name = player_name || null;
        session.player_phone = player_phone || null;
        session.player_email = player_email || null;
        session.player_viewed_at = session.player_viewed_at || new Date();
        session.selected_prize_details = {
            box_number: winningBox,
            prize_name: selectedPrize,
            selected_at: new Date().toISOString()
        };
        session.box_selection_event = eventDetails;

        await session.save();

        await logAuditEvent(session.session_code, 'BOX_SELECTED', req, { winning_box: winningBox });

        // Return safe data
        const resData = session.toJSON();
        delete resData.server_random_boxes;
        delete resData.player_token;
        delete resData.server_random_seed;
        delete resData.result_hash;

        res.json({
            success: true,
            message: 'Đã ghi nhận lựa chọn hộp của bạn',
            data: {
                session_code: session.session_code,
                box_selected: winningBox,
                prize_name: selectedPrize,
                timestamp: session.player_selected_at
            }
        });
    } catch (err) {
        await logAuditEvent(req.params.code, 'BOX_SELECTED_ERROR', req, {}, 'FAILURE', err.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi ghi nhận lựa chọn'
        });
    }
});

// Mark session as viewed (when player opens it)
router.post('/session/:code/viewed', gameProgressLimiter, async (req, res) => {
    try {
        const session = await db.GameSession.findOne({
            where: { session_code: req.params.code }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Phiên chơi không tồn tại'
            });
        }

        // Only update if not already viewed
        if (!session.player_viewed_at) {
            session.player_viewed_at = new Date();
            await session.save();
        }

        await logAuditEvent(session.session_code, 'SESSION_VIEWED', req);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Save customer info for gift prizes
router.post('/session/:code/customer-info', gameProgressLimiter, async (req, res) => {
    try {
        const { customer_name, customer_phone, customer_email, customer_address, prize } = req.body;
        const code = req.params.code;

        // Validate required fields
        if (!customer_name || !customer_phone || !customer_address) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        // Find session
        const session = await db.GameSession.findOne({
            where: { session_code: code }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Phiên chơi không tồn tại'
            });
        }

        // Update customer info
        session.player_name = customer_name;
        session.player_phone = customer_phone;
        session.player_email = customer_email || null;
        
        // Store additional address info in selected_prize_details
        if (!session.selected_prize_details) {
            session.selected_prize_details = {};
        }
        session.selected_prize_details.customer_address = customer_address;
        session.selected_prize_details.customer_email = customer_email || null;

        await session.save();

        await logAuditEvent(session.session_code, 'CUSTOMER_INFO_SAVED', req, { 
            customer_name, 
            customer_phone 
        });

        res.json({
            success: true,
            message: 'Thông tin đã được lưu lại',
            data: {
                session_code: session.session_code,
                customer_name: session.player_name,
                customer_phone: session.player_phone
            }
        });
    } catch (err) {
        await logAuditEvent(req.params.code, 'CUSTOMER_INFO_ERROR', req, {}, 'FAILURE', err.message);
        res.status(500).json({
            success: false,
            message: 'Lỗi lưu thông tin khách hàng'
        });
    }
});

// Prize Exchange - Deprecated: Use /api/withdrawals and /api/gift-exchanges instead
// This endpoint is kept for backward compatibility but should not be used

// ============================================
// NEW GAME ENDPOINTS FOR PLAYERS
// ============================================

// GET /session-info/:code
// Check if session exists and can be played
router.get('/session-info/:code', async (req, res) => {
  try {
    const session = await db.GameSession.findOne({
      where: { session_code: req.params.code }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Mã phiên chơi không tồn tại',
        isValid: false
      });
    }

    // Check if already played with unlucky result
    const hasUnluckyPrize = 
      session.prize_1_status === 'UNLUCKY' || 
      session.prize_2_status === 'UNLUCKY' || 
      session.prize_3_status === 'UNLUCKY';
    
    if (hasUnluckyPrize && session.player_selected_box) {
      return res.json({
        success: true,
        isValid: true,
        alreadyPlayed: true,
        isUnlucky: true,
        message: 'Bạn đã chơi mã phiên này và không trúng phần quà nào cả. Hãy thử lại bằng mã phiên khác',
        sessionCode: session.session_code
      });
    }

    // Check if already played
    if (session.is_completed && session.player_selected_box) {
      return res.json({
        success: true,
        isValid: true,
        alreadyPlayed: true,
        message: 'Phiên này đã được sử dụng rồi',
        sessionCode: session.session_code
      });
    }

    // Check expiration (if created more than 7 days ago)
    const createdAt = new Date(session.created_at);
    const now = new Date();
    const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24);
    const isExpired = daysDiff > 7;

    res.json({
      success: true,
      isValid: true,
      alreadyPlayed: false,
      isExpired: isExpired,
      sessionCode: session.session_code,
      message: 'Phiên chơi hợp lệ'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message
    });
  }
});

// POST /start
// Start game session with player name and phone
router.post('/start', async (req, res) => {
  try {
    const { sessionCode, name, phone } = req.body;

    // Validate inputs
    if (!sessionCode || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã phiên, tên và số điện thoại'
      });
    }

    const session = await db.GameSession.findOne({
      where: { session_code: sessionCode }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Phiên chơi không tồn tại'
      });
    }

    // Update session with player info
    session.player_name = name;
    session.player_phone = phone;
    session.player_viewed_at = new Date();
    session.player_ip = req.ip || req.connection.remoteAddress;

    // Generate server-side box randomization if not already done
    if (!session.server_random_boxes || session.server_random_boxes.length === 0) {
      const boxes = [1, 2, 3];
      const shuffled = boxes.sort(() => Math.random() - 0.5);
      session.server_random_boxes = shuffled;
    }

    await session.save();

    res.json({
      success: true,
      message: 'Bắt đầu chơi thành công',
      data: {
        playerId: session.id,
        sessionCode: session.session_code,
        boxCount: 3
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message
    });
  }
});

// POST /open-box
// Open selected box and reveal prize
router.post('/open-box', async (req, res) => {
  try {
    const { playerId, sessionCode, boxIndex } = req.body;

    // Validate
    if (!playerId || !sessionCode || boxIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin không hợp lệ'
      });
    }

    const session = await db.GameSession.findOne({
      where: { 
        session_code: sessionCode,
        id: playerId
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Phiên chơi không tồn tại'
      });
    }

    // Check if already opened
    if (session.player_selected_box) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã chọn hộp rồi'
      });
    }

    // Get winning box from server-side random (ignore client boxIndex)
    let winningBox = 1;
    if (session.server_random_boxes && session.server_random_boxes.length > 0) {
      winningBox = session.server_random_boxes[0];
    }

    // Get prize details
    const prizeField = `prize_${winningBox}`;
    const prizeDescField = `prize_${winningBox}_description`;
    const prizeIconField = `prize_${winningBox}_icon`;
    const prizeStatusField = `prize_${winningBox}_status`;
    const prizeCashField = `prize_${winningBox}_cash`;
    const prizeCashAmtField = `prize_${winningBox}_cash_amount`;
    const prizeImageField = `prize_${winningBox}_image_url`;
    const prizeSpecialField = `prize_${winningBox}_is_special`;

    const prize = {
      name: session[prizeField] || 'Quà tặng',
      description: session[prizeDescField] || '',
      icon: session[prizeIconField] || '🎁',
      level: session[prizeStatusField] || 'NORMAL',
      isCash: session[prizeCashField] || false,
      cashAmount: session[prizeCashAmtField] || 0,
      imageUrl: session[prizeImageField] || null,
      isSpecial: session[prizeSpecialField] || false,
      boxNumber: winningBox
    };

    // Update session
    session.player_selected_box = winningBox;
    session.player_selected_at = new Date();
    session.is_completed = true;

    // Mark box as opened
    if (winningBox === 1) session.box_1_opened = true;
    else if (winningBox === 2) session.box_2_opened = true;
    else if (winningBox === 3) session.box_3_opened = true;

    await session.save();

    res.json({
      success: true,
      message: 'Hộp được mở thành công',
      data: { prize }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message
    });
  }
});

// POST /claim
// Claim prize via bank transfer or gift delivery
router.post('/claim', async (req, res) => {
  try {
    const { playerId, sessionCode, method, bankName, accountNumber, accountName, phone, province, district, address, note } = req.body;

    // Validate
    if (!playerId || !sessionCode || !method) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin không hợp lệ'
      });
    }

    const session = await db.GameSession.findOne({
      where: {
        session_code: sessionCode,
        id: playerId
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Phiên chơi không tồn tại'
      });
    }

    if (!session.player_selected_box) {
      return res.status(400).json({
        success: false,
        message: 'Chưa chọn hộp'
      });
    }

    // Get prize info
    const winningBox = session.player_selected_box;
    const prizeField = `prize_${winningBox}`;
    const prizeCashField = `prize_${winningBox}_cash`;
    const prizeCashAmtField = `prize_${winningBox}_cash_amount`;

    let claim = null;

    if (method === 'bank') {
      // Create withdrawal record
      claim = await db.Withdrawal.create({
        session_code: sessionCode,
        player_id: playerId,
        withdrawal_method: 'bank_transfer',
        bank_name: bankName,
        account_number: accountNumber,
        account_holder_name: accountName,
        phone_number: phone,
        amount: session[prizeCashAmtField] || 0,
        status: 'pending',
        requested_at: new Date()
      });
    } else if (method === 'gift') {
      // Create gift exchange record
      claim = await db.GiftExchange.create({
        session_code: sessionCode,
        player_id: playerId,
        gift_name: session[prizeField],
        receiver_name: session.player_name,
        phone_number: phone,
        province: province,
        district: district,
        address: address,
        note: note,
        status: 'pending',
        requested_at: new Date()
      });
    }

    // Update session to mark as claimed
    session.is_exchanged = true;
    session.exchanged_at = new Date();
    await session.save();

    res.json({
      success: true,
      message: 'Đơn của bạn đã được ghi nhận',
      data: {
        claimId: claim.id,
        sessionCode: sessionCode,
        method: method
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + err.message,
      error: err.message
    });
  }
});

module.exports = router;
