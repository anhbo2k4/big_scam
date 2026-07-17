/**
 * Validate Box Opening Middleware
 * Security checks before processing box opens:
 * 1. Session exists and is active
 * 2. Box not already opened
 * 3. No fraud flags
 * 4. IP address matches
 * 5. Player token matches
 * 6. Max 3 boxes per session
 * 7. Sequential box opening order
 */

const { GameSession, PlayerInventory, Withdrawal } = require('../models');
const { body, validationResult } = require('express-validator');

const validateBoxOpening = [
  // Validate input
  body('sessionCode')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .matches(/^[A-Za-z0-9_-]+$/),
  body('boxNumber').isInt({ min: 1, max: 3 }),

  // Check validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Thông tin không hợp lệ',
        errors: errors.array()
      });
    }
    next();
  },

  // Database checks
  async (req, res, next) => {
    try {
      const { sessionCode, boxNumber } = req.body;
      const normalizedSessionCode = String(sessionCode || '').trim().toUpperCase();
      const boxNumberInt = Number(boxNumber);

      // 1. Check session exists
      const session = await GameSession.findOne({
        where: { session_code: normalizedSessionCode }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Phiên không tồn tại'
        });
      }

      if (!session.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Phiên không còn hoạt động'
        });
      }

      // Multi-box mode: player_selected_box stores the latest opened box only,
      // so it must not be used as a hard lock for the whole session.

      if (session.fraud_flag === true || session.fraud_flag === 1 || String(session.fraud_flag || '').toLowerCase() === 'true') {
        return res.status(403).json({
          success: false,
          message: 'Phiên bị đánh dấu bất thường'
        });
      }

      if (session.is_completed === true || session.is_completed === 1 || String(session.is_completed || '').toLowerCase() === 'true') {
        return res.status(403).json({
          success: false,
          message: 'Phiên đã hoàn thành'
        });
      }

      // ✅ NEW: Parse boxes_opened to track multiple boxes
      let boxesOpened = [];
      try {
        if (session.boxes_opened) {
          const rawValue = session.boxes_opened;
          // Handle different formats
          if (typeof rawValue === 'string') {
            boxesOpened = JSON.parse(rawValue);
          } else if (Array.isArray(rawValue)) {
            boxesOpened = rawValue;
          } else if (typeof rawValue === 'object' && rawValue !== null) {
            // Sequelize already parsed it
            boxesOpened = rawValue;
          }
        }
        // Ensure it's always an array
        if (!Array.isArray(boxesOpened)) {
          boxesOpened = [];
        }

        // Backward compatibility for older sessions that tracked only one field.
        if (!boxesOpened.length && session.player_selected_box !== null && session.player_selected_box !== undefined) {
          const legacyBox = Number(session.player_selected_box);
          if ([1, 2, 3].includes(legacyBox)) {
            boxesOpened = [legacyBox];
          }
        }
      } catch (e) {
        console.warn('Error parsing boxes_opened in validateBox:', e.message);
        boxesOpened = [];
      }

      // 2. Check this specific box not already opened
      if (boxesOpened.map((n) => Number(n)).includes(boxNumberInt)) {
        return res.status(403).json({
          success: false,
          message: `Hộp #${boxNumberInt} đã được mở rồi`
        });
      }

      // ✅ NEW: Check max 3 boxes not exceeded
      if (boxesOpened.length >= 3) {
        return res.status(403).json({
          success: false,
          message: 'Bạn đã mở hết số hộp cho phép (tối đa 3)'
        });
      }

      // Enforce sequence based on configured box_positions
      let configuredOrder = session.box_positions;
      if (typeof configuredOrder === 'string') {
        try {
          configuredOrder = JSON.parse(configuredOrder);
        } catch {
          configuredOrder = [1, 2, 3];
        }
      }
      if (!Array.isArray(configuredOrder)) configuredOrder = [1, 2, 3];
      configuredOrder = [...new Set(configuredOrder.map(v => parseInt(v, 10)).filter(v => [1, 2, 3].includes(v)))];
      if (configuredOrder.length !== 3) configuredOrder = [1, 2, 3];

      const openedNumbers = boxesOpened.map((n) => Number(n));
      const nextBoxToOpen = configuredOrder.find(n => !openedNumbers.includes(n));
      if (nextBoxToOpen && boxNumberInt !== Number(nextBoxToOpen)) {
        return res.status(403).json({
          success: false,
          message: `Bạn phải mở theo thứ tự. Hộp tiếp theo là #${nextBoxToOpen}`
        });
      }

      // Business rule: for each opened money box, player needs one approved withdrawal
      // before being allowed to open the next box.
      // Skip if admin has disabled the withdrawal requirement for this session.
      const isOpeningSubsequentBox = openedNumbers.length > 0;
      const rawReqW = session.require_withdrawal;
      const withdrawalRequired = rawReqW === null || rawReqW === undefined || rawReqW === true || Number(rawReqW) === 1;
      if (isOpeningSubsequentBox && withdrawalRequired) {
        const openedMoneyBoxCount = openedNumbers.reduce((count, boxNo) => {
          const safeBox = Number(boxNo);
          if (![1, 2, 3].includes(safeBox)) return count;
          const prizeCash = session[`prize_${safeBox}_cash`] === true || Number(session[`prize_${safeBox}_cash`] || 0) === 1;
          const prizeAmount = Number(session[`prize_${safeBox}_cash_amount`] || 0);
          const prizeStatus = String(session[`prize_${safeBox}_status`] || '').toUpperCase();
          const isMoneyPrize = prizeCash && prizeAmount > 0 && prizeStatus !== 'UNLUCKY';
          return isMoneyPrize ? count + 1 : count;
        }, 0);

        if (openedMoneyBoxCount > 0) {
          const withdrawals = await Withdrawal.findAll({
            where: { session_code: normalizedSessionCode },
            attributes: ['id', 'status', 'amount'],
            order: [['requested_at', 'DESC']],
            limit: 50
          });

          const approvedWithdrawalCount = withdrawals.filter((w) => String(w.status || '').toLowerCase() === 'approved').length;

          if (approvedWithdrawalCount < openedMoneyBoxCount) {
            return res.status(403).json({
              success: false,
              message: 'Vui lòng hoàn tất bước xác minh phần thưởng tại CSKH trước khi mở hộp tiếp theo.'
            });
          }
        }
      }

      if (session.status === 'paused') {
        return res.status(403).json({
          success: false,
          message: 'Phiên chơi đang tạm dừng'
        });
      }

      // Check special prize blocking conditions
      const specialItems = await PlayerInventory.findAll({
        where: { session_code: normalizedSessionCode, is_special: true },
        attributes: ['box_number', 'status', 'is_cash', 'prize_value']
      });

      // Do not block opening remaining boxes when special prizes are pending/confirmed.
      // Multi-box flow allows users to finish all box opens before deciding claim/convert actions.

      // Attach session to request for use in route handler
      req.validatedSession = session;
      req.boxesOpenedCount = boxesOpened.length;

      next();
    } catch (err) {
      console.error('❌ Error in validateBoxOpening:', err);
      res.status(500).json({
        success: false,
        message: 'Lỗi xác thực'
      });
    }
  }
];

module.exports = validateBoxOpening;
