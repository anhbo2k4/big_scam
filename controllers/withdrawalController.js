const { Op } = require('sequelize');
const { Withdrawal, User, GameSession, PlayerInventory } = require('../models');
const sseChat = require('../services/sseChat');
const {
  clampTrustScore,
  getWithdrawalTrustConfig,
  buildWithdrawTrustBlockedMessage
} = require('../utils/withdrawTrustConfig');

const getClientIp = (req) => {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const raw = forwarded || req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '';
  return String(raw || '').replace('::ffff:', '') || 'unknown';
};

const emitAdminRealtime = (req, event, payload = {}) => {
  try {
    sseChat.sendAdminEvent(event, payload);
  } catch (err) {
    // Keep request flow healthy even if realtime emit fails.
  }
};

const getSessionWalletBalance = async (sessionCode) => {
  const normalizedSessionCode = String(sessionCode || '').trim().toUpperCase();
  if (!normalizedSessionCode) {
    return { session: null, currentWallet: 0, convertedPrizesTotal: 0 };
  }

  const session = await GameSession.findOne({ where: { session_code: normalizedSessionCode } });
  if (!session) {
    return { session: null, currentWallet: 0, convertedPrizesTotal: 0 };
  }

  const convertedPrizesRaw = await PlayerInventory.sum('prize_value', {
    where: { session_code: normalizedSessionCode, status: 'converted' }
  });
  const convertedPrizesTotal = Number(convertedPrizesRaw || 0);

  const currentWallet = session.wallet_manual_amount !== null && session.wallet_manual_amount !== undefined
    ? Number(session.wallet_manual_amount)
    : convertedPrizesTotal;

  return { session, currentWallet, convertedPrizesTotal };
};

const applySessionWalletDelta = async (sessionCode, deltaAmount) => {
  const normalizedSessionCode = String(sessionCode || '').trim().toUpperCase();
  const delta = Number(deltaAmount || 0);
  if (!normalizedSessionCode || !Number.isFinite(delta) || delta === 0) {
    return { ok: false, reason: 'invalid_input' };
  }

  const { session, currentWallet } = await getSessionWalletBalance(normalizedSessionCode);
  if (!session) {
    return { ok: false, reason: 'session_not_found' };
  }

  const nextWallet = currentWallet + delta;
  if (nextWallet < 0) {
    return {
      ok: false,
      reason: 'insufficient_wallet',
      currentWallet,
      attemptedDelta: delta
    };
  }

  await session.update({ wallet_manual_amount: nextWallet });
  return {
    ok: true,
    session,
    previousWallet: currentWallet,
    nextWallet,
    appliedDelta: delta
  };
};

const parseWalletDeductedFlag = (snapshot = {}, fallbackStatus = '') => {
  const raw = snapshot?.wallet_deducted;
  if (raw === false || raw === 0 || raw === '0') return false;
  if (raw === true || raw === 1 || raw === '1') return true;
  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  // Backward compatibility: older pending/approved rows might miss the flag
  // even though current business flow deducts at request creation.
  const status = String(fallbackStatus || '').trim().toLowerCase();
  const hasRefundedAt = !!snapshot?.wallet_refunded_at;
  const deductedAmount = Math.abs(Number(snapshot?.wallet_deducted_amount || 0));
  if (!hasRefundedAt && (status === 'pending' || status === 'approved')) {
    return deductedAmount > 0 || raw === undefined || raw === null;
  }

  return false;
};

module.exports = {
  
  async list(req, res) {
    try {
      const { status, userId, page = 1, limit = 10 } = req.query;
      const where = {};
      
      if (status) where.status = status;
      if (userId) where.user_id = userId;

      const offset = (page - 1) * limit;

      const { count, rows } = await Withdrawal.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error listing withdrawals:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi lấy danh sách rút tiền',
        error: error.message 
      });
    }
  },

  
  async getById(req, res) {
    try {
      const { id } = req.params;
      const withdrawal = await Withdrawal.findByPk(id);

      if (!withdrawal) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy yêu cầu rút tiền' 
        });
      }

      res.json({ success: true, data: withdrawal });
    } catch (error) {
      console.error('Error getting withdrawal:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi lấy thông tin rút tiền',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  
  async create(req, res) {
    try {
      const { user_id, amount, bank_name, account_number, account_holder, notes, session_code, customer_name, customer_phone, customer_email } = req.body;
      const normalizedSessionCode = String(session_code || '').trim().toUpperCase();
      const requestIp = getClientIp(req);

      
      if (!user_id || amount === undefined || amount === null || !bank_name || !account_number || !account_holder) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng cung cấp đầy đủ thông tin' 
        });
      }

      
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Người dùng không tồn tại' 
        });
      }

      
      let boxData = null;
      if (normalizedSessionCode) {
        const { GameSession } = require('../models');
        const session = await GameSession.findOne({ where: { session_code: normalizedSessionCode } });
        if (session && session.player_selected_box) {
          boxData = {
            session_code: normalizedSessionCode,
            selected_box_number: session.player_selected_box,
            prize_name: session[`prize_${session.player_selected_box}`],
            selected_at: session.player_selected_at,
            player_contact: {
              name: session.player_name,
              phone: customer_phone || session.player_phone,
              email: customer_email || session.player_email,
              ip_address: requestIp
            },
            box_selection_snapshot: {
              box_number: session.player_selected_box,
              prize_name: session[`prize_${session.player_selected_box}`],
              selected_at: session.player_selected_at
            }
          };
        }
      }

      // Deduct immediately from session wallet when customer submits withdrawal.
      if (normalizedSessionCode) {
        const deduction = await applySessionWalletDelta(normalizedSessionCode, -Math.abs(Number(amount || 0)));
        if (!deduction.ok && deduction.reason === 'insufficient_wallet') {
          return res.status(400).json({
            success: false,
            message: 'Số dư ví không đủ để tạo yêu cầu rút tiền',
            data: {
              available_wallet: Number(deduction.currentWallet || 0),
              requested: Number(amount || 0)
            }
          });
        }
      }

      const snapshot = (boxData && boxData.box_selection_snapshot && typeof boxData.box_selection_snapshot === 'object')
        ? { ...boxData.box_selection_snapshot }
        : {};
      if (normalizedSessionCode) {
        snapshot.wallet_deducted = true;
        snapshot.wallet_deducted_amount = Number(amount || 0);
        snapshot.wallet_deducted_at = new Date().toISOString();
      }

      const withdrawal = await Withdrawal.create({
        user_id,
        amount: parseFloat(amount),
        bank_name,
        account_number,
        account_holder,
        notes: notes || null,
        status: 'pending',
        customer_name: customer_name || 'Khách hàng',
        customer_phone,
        customer_email,
        session_code: normalizedSessionCode || null,
        ...boxData,
        box_selection_snapshot: Object.keys(snapshot).length ? snapshot : (boxData?.box_selection_snapshot || null)
      });

      emitAdminRealtime(req, 'new_withdrawal', {
        id: withdrawal.id,
        amount: Number(withdrawal.amount || 0),
        session_code: withdrawal.session_code || null,
        status: withdrawal.status || 'pending'
      });

      res.status(201).json({ 
        success: true, 
        message: 'Tạo yêu cầu rút tiền thành công',
        data: withdrawal 
      });
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi tạo yêu cầu rút tiền',
        error: error.message 
      });
    }
  },

  
  async approve(req, res) {
    try {
      const { id } = req.params;
      const withdrawal = await Withdrawal.findByPk(id);

      if (!withdrawal) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy yêu cầu rút tiền' 
        });
      }

      if (withdrawal.status === 'approved') {
        return res.json({
          success: true,
          message: 'Yêu cầu rút tiền đã được duyệt trước đó',
          data: withdrawal
        });
      }

      await withdrawal.update({ status: 'approved', approved_by: req.session?.user?.username || 'admin' });

      emitAdminRealtime(req, 'withdrawal_status_updated', {
        id: withdrawal.id,
        status: 'approved',
        amount: Number(withdrawal.amount || 0),
        session_code: withdrawal.session_code || null
      });

      if (withdrawal.session_code) {
        sseChat.sendNotification(withdrawal.session_code, 'wallet_approved', {
          level: 'success',
          title: 'Rút tiền đã được duyệt',
          message: `Yêu cầu rút ${Number(withdrawal.amount || 0).toLocaleString('vi-VN')}đ đã được duyệt.`,
          withdrawalId: withdrawal.id,
          amount: Number(withdrawal.amount || 0),
          status: 'approved'
        });
      }

      // Track redemption in history
      try {
        const { PrizeRedemptionHistory, GameSession, PlayerInventory } = require('../models');
        
        // Get associated game session if available
        let sessionId = null;
        let sessionCode = null;
        let prizeName = 'Tiền mặt';
        
        if (withdrawal.session_code) {
          const session = await GameSession.findOne({ 
            where: { session_code: withdrawal.session_code } 
          });
          if (session) {
            sessionId = session.id;
            sessionCode = session.session_code;
            const boxNum = withdrawal.box_selection_snapshot?.box_number || 1;
            prizeName = session[`prize_${boxNum}`] || 'Tiền mặt';

            // Wallet is already deducted at request creation time.
          }
        }

        const redemptionHistory = await PrizeRedemptionHistory.create({
          user_id: withdrawal.user_id,
          session_id: sessionId,
          session_code: sessionCode || withdrawal.session_code || 'UNKNOWN',
          prize_name: prizeName,
          prize_value: withdrawal.amount,
          redemption_method: 'withdrawal',
          withdrawal_id: withdrawal.id,
          withdrawal_status: 'approved',
          withdrawal_amount: withdrawal.amount,
          bank_name: withdrawal.bank_name,
          bank_account: withdrawal.account_number?.slice(-4), // Mask account
          approved_at: new Date(),
          current_status: 'approved'
        });

        // Broadcast via WebSocket
        if (req.app && req.app.locals && req.app.locals.historyWS) {
          req.app.locals.historyWS.broadcastRedemptionStatusUpdate(
            redemptionHistory.id,
            'approved',
            { 
              withdrawalId: withdrawal.id,
              amount: withdrawal.amount,
              bankName: withdrawal.bank_name 
            }
          );
          console.log('💰 Withdrawal approval broadcasted via WebSocket');
        }
      } catch (historyErr) {
        console.error('⚠️ Error tracking redemption history:', historyErr.message);
        // Continue even if tracking fails
      }

      res.json({ 
        success: true, 
        message: 'Duyệt yêu cầu rút tiền thành công',
        data: withdrawal 
      });
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi duyệt yêu cầu rút tiền' 
      });
    }
  },

  
  async reject(req, res) {
    try {
      const { id } = req.params;
      const rejectionReason = String(
        req.body?.rejection_reason
        || req.body?.rejectionReason
        || req.body?.reason
        || ''
      ).trim();
      
      const withdrawal = await Withdrawal.findByPk(id);

      if (!withdrawal) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy yêu cầu rút tiền' 
        });
      }

      const snapshot = (withdrawal.box_selection_snapshot && typeof withdrawal.box_selection_snapshot === 'object')
        ? { ...withdrawal.box_selection_snapshot }
        : {};
      const wasWalletDeducted = parseWalletDeductedFlag(snapshot, withdrawal.status);

      // Prevent duplicate refund on already-rejected record.
      if (String(withdrawal.status || '').toLowerCase() === 'rejected') {
        return res.json({
          success: true,
          message: 'Yêu cầu rút tiền đã ở trạng thái từ chối',
          data: withdrawal
        });
      }

      // Refund wallet if this request had deducted funds earlier.
      if (withdrawal.session_code && wasWalletDeducted) {
        const refundAmount = Math.abs(Number(withdrawal.amount || 0));
        const refundResult = await applySessionWalletDelta(withdrawal.session_code, refundAmount);
        if (!refundResult.ok) {
          return res.status(500).json({
            success: false,
            message: 'Không thể hoàn tiền về ví khi từ chối yêu cầu. Vui lòng thử lại.',
            data: {
              reason: refundResult.reason || 'wallet_refund_failed',
              session_code: withdrawal.session_code,
              refund_amount: refundAmount
            }
          });
        }
        snapshot.wallet_deducted = false;
        snapshot.wallet_refunded_at = new Date().toISOString();
        snapshot.wallet_refunded_amount = refundAmount;
      }

      await withdrawal.update({ 
        status: 'rejected',
        rejection_reason: rejectionReason || null,
        rejected_by: req.session?.user?.username || 'admin',
        box_selection_snapshot: snapshot
      });

      if (withdrawal.session_code) {
        sseChat.sendNotification(withdrawal.session_code, 'wallet_rejected', {
          level: 'error',
          title: 'Rút tiền bị từ chối',
          message: rejectionReason || 'Yêu cầu rút tiền của bạn đã bị từ chối.',
          withdrawalId: withdrawal.id,
          amount: Number(withdrawal.amount || 0),
          status: 'rejected'
        });
      }

      res.json({ 
        success: true, 
        message: 'Từ chối yêu cầu rút tiền thành công',
        data: withdrawal 
      });
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi từ chối yêu cầu rút tiền' 
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { amount, bank_name, account_number, account_holder, customer_name, customer_phone, customer_email, notes, status } = req.body;
      const hasRejectionReasonField = Object.prototype.hasOwnProperty.call(req.body || {}, 'rejection_reason')
        || Object.prototype.hasOwnProperty.call(req.body || {}, 'rejectionReason')
        || Object.prototype.hasOwnProperty.call(req.body || {}, 'reason');
      const rejectionReason = String(
        req.body?.rejection_reason
        || req.body?.rejectionReason
        || req.body?.reason
        || ''
      ).trim();

      const withdrawal = await Withdrawal.findByPk(id);

      if (!withdrawal) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy yêu cầu rút tiền' 
        });
      }

      const oldStatus = withdrawal.status;

      // Allow editing these fields
      const updateData = {};
      if (amount !== undefined) {
        const parsedAmount = Number(amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
          return res.status(400).json({
            success: false,
            message: 'Số tiền không hợp lệ'
          });
        }
        updateData.amount = parsedAmount;
      }
      if (bank_name !== undefined) updateData.bank_name = bank_name;
      if (account_number !== undefined) updateData.account_number = account_number;
      if (account_holder !== undefined) updateData.account_holder = account_holder;
      if (customer_name !== undefined) updateData.customer_name = customer_name;
      if (customer_phone !== undefined) updateData.customer_phone = customer_phone;
      if (customer_email !== undefined) updateData.customer_email = customer_email;
      if (notes !== undefined) updateData.notes = notes;
      if (status !== undefined && ['pending', 'approved', 'rejected'].includes(status)) updateData.status = status;
      if (hasRejectionReasonField) {
        updateData.rejection_reason = rejectionReason || null;
      }

      // If status is switched to rejected via generic edit flow, reuse admin note as visible reason.
      if (status === 'rejected' && !hasRejectionReasonField) {
        const notesAsReason = String(notes || '').trim();
        if (notesAsReason) {
          updateData.rejection_reason = notesAsReason;
        }
      }

      // 💰 WALLET MANAGEMENT - Handle status changes with deduct-on-create semantics.
      if (status !== undefined && status !== oldStatus && withdrawal.session_code) {
        try {
          const snapshot = (withdrawal.box_selection_snapshot && typeof withdrawal.box_selection_snapshot === 'object')
            ? { ...withdrawal.box_selection_snapshot }
            : {};
          const wasWalletDeducted = parseWalletDeductedFlag(snapshot, oldStatus);
          const nextStatus = String(status || '').toLowerCase();
          const withdrawalAmount = Math.abs(Number(withdrawal.amount || 0));

          // Reject => refund if currently deducted.
          if (nextStatus === 'rejected' && wasWalletDeducted) {
            const refundResult = await applySessionWalletDelta(withdrawal.session_code, withdrawalAmount);
            if (!refundResult.ok) {
              return res.status(500).json({
                success: false,
                message: 'Không thể hoàn tiền về ví khi chuyển trạng thái từ chối. Vui lòng thử lại.',
                data: {
                  reason: refundResult.reason || 'wallet_refund_failed',
                  session_code: withdrawal.session_code,
                  refund_amount: withdrawalAmount
                }
              });
            }
            snapshot.wallet_deducted = false;
            snapshot.wallet_refunded_at = new Date().toISOString();
            snapshot.wallet_refunded_amount = withdrawalAmount;
            updateData.box_selection_snapshot = snapshot;
          }

          // Re-open to pending/approved => deduct back if not currently deducted.
          if ((nextStatus === 'pending' || nextStatus === 'approved') && !wasWalletDeducted) {
            const deduction = await applySessionWalletDelta(withdrawal.session_code, -withdrawalAmount);
            if (deduction.ok === false && deduction.reason === 'insufficient_wallet') {
              return res.status(400).json({
                success: false,
                message: 'Số dư ví không đủ để cập nhật trạng thái yêu cầu rút tiền',
                data: {
                  available_wallet: Number(deduction.currentWallet || 0),
                  requested: withdrawalAmount
                }
              });
            }
            snapshot.wallet_deducted = true;
            snapshot.wallet_deducted_at = new Date().toISOString();
            snapshot.wallet_deducted_amount = withdrawalAmount;
            updateData.box_selection_snapshot = snapshot;
          }
        } catch (walletErr) {
          console.error('⚠️ Error updating wallet balance:', walletErr.message);
          return res.status(500).json({
            success: false,
            message: 'Không thể cập nhật số dư ví theo trạng thái mới. Vui lòng thử lại.',
            error: process.env.NODE_ENV === 'development' ? walletErr.message : undefined
          });
        }
      }

      await withdrawal.update(updateData);

      const nextStatus = String(withdrawal.status || '').toLowerCase();
      const statusChanged = status !== undefined && String(status).toLowerCase() !== String(oldStatus || '').toLowerCase();
      if (statusChanged) {
        emitAdminRealtime(req, 'withdrawal_status_updated', {
          id: withdrawal.id,
          status: nextStatus,
          amount: Number(withdrawal.amount || 0),
          session_code: withdrawal.session_code || null
        });

        if (withdrawal.session_code && (nextStatus === 'approved' || nextStatus === 'rejected')) {
          const isApproved = nextStatus === 'approved';
          sseChat.sendNotification(withdrawal.session_code, isApproved ? 'wallet_approved' : 'wallet_rejected', {
            level: isApproved ? 'success' : 'warning',
            title: isApproved ? 'Rút tiền đã được duyệt' : 'Rút tiền bị từ chối',
            message: isApproved
              ? `Yêu cầu rút ${Number(withdrawal.amount || 0).toLocaleString('vi-VN')}đ đã được duyệt.`
              : `Yêu cầu rút tiền đã bị từ chối${withdrawal.rejection_reason ? `: ${withdrawal.rejection_reason}` : '.'}`,
            withdrawalId: withdrawal.id,
            amount: Number(withdrawal.amount || 0),
            status: nextStatus,
            rejection_reason: withdrawal.rejection_reason || null
          });
        }
      }

      res.json({ 
        success: true, 
        message: 'Cập nhật yêu cầu rút tiền thành công',
        data: withdrawal
      });
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi cập nhật yêu cầu rút tiền',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  
  async delete(req, res) {
    try {
      const { id } = req.params;
      const withdrawal = await Withdrawal.findByPk(id);

      if (!withdrawal) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy yêu cầu rút tiền' 
        });
      }

      await withdrawal.destroy();

      res.json({ 
        success: true, 
        message: 'Xóa yêu cầu rút tiền thành công' 
      });
    } catch (error) {
      console.error('Error deleting withdrawal:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi xóa yêu cầu rút tiền' 
      });
    }
  },

  
  async createFromGame(req, res) {
    try {
      const { 
        session_code, 
        amount, 
        customer_name, 
        customer_phone, 
        customer_email,
        withdraw_method, 
        bank_name,
        account_number,
        account_holder,
        request_source 
      } = req.body;
      const requestIp = getClientIp(req);
      const normalizedSessionCode = String(session_code || '').trim().toUpperCase();
      const trimmedCustomerName = String(customer_name || '').trim();
      const trimmedCustomerPhone = String(customer_phone || '').trim();
      const trimmedCustomerEmail = String(customer_email || '').trim();
      const trimmedBankName = String(bank_name || '').trim();
      const trimmedAccountNumber = String(account_number || '').trim();
      const trimmedAccountHolder = String(account_holder || '').trim();

      
      if (!normalizedSessionCode || amount === undefined || amount === null || !withdraw_method || !trimmedCustomerName) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vui lòng cung cấp đầy đủ thông tin bao gồm tên khách hàng' 
        });
      }

      if (amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Số tiền phải lớn hơn 0' 
        });
      }

      
      if (withdraw_method === 'bank_transfer') {
        if (!trimmedBankName || !trimmedAccountNumber || !trimmedAccountHolder) {
          return res.status(400).json({ 
            success: false, 
            message: 'Vui lòng cung cấp thông tin ngân hàng' 
          });
        }
      } else if (withdraw_method === 'momo' || withdraw_method === 'zalopay') {
        if (!trimmedCustomerPhone) {
          return res.status(400).json({ 
            success: false, 
            message: 'Vui lòng cung cấp số điện thoại' 
          });
        }
      }

      
      const { GameSession, SiteSettings } = require('../models');
      const session = await GameSession.findOne({ where: { session_code: normalizedSessionCode } });
      
      if (!session) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy phiên chơi' 
        });
      }

      const sessionTrustScore = clampTrustScore(session.trust_score, 100);
      const { minTrustScoreForWithdrawal } = await getWithdrawalTrustConfig({ SiteSettings });

      if (sessionTrustScore < minTrustScoreForWithdrawal) {
        return res.status(403).json({
          success: false,
          message: buildWithdrawTrustBlockedMessage(sessionTrustScore, minTrustScoreForWithdrawal),
          data: {
            trust_score: sessionTrustScore,
            min_trust_score_for_withdrawal: minTrustScoreForWithdrawal,
            can_withdraw_by_trust: false
          }
        });
      }

      
      const withdrawalData = {
        user_id: null,
        amount: parseFloat(amount),
        status: 'pending',
        customer_name: trimmedCustomerName,
        customer_phone: trimmedCustomerPhone || null,
        customer_email: trimmedCustomerEmail || null,
        session_code: normalizedSessionCode,
        withdraw_method,
        request_source: request_source || 'game',
        bank_name: trimmedBankName || null,
        account_number: trimmedAccountNumber || null,
        account_holder: trimmedAccountHolder || null,
        
        selected_box_number: session.player_selected_box,
        prize_name: session.player_selected_box ? session[`prize_${session.player_selected_box}`] : null,
        selected_at: session.player_selected_at,
        player_contact: {
          name: trimmedCustomerName,
          phone: trimmedCustomerPhone || null,
          email: trimmedCustomerEmail || null,
          ip_address: requestIp
        },
        box_selection_snapshot: {
          box_number: session.player_selected_box,
          prize_name: session.player_selected_box ? session[`prize_${session.player_selected_box}`] : null,
          selected_at: session.player_selected_at,
          wallet_deducted: true,
          wallet_deducted_amount: Number(amount || 0),
          wallet_deducted_at: new Date().toISOString()
        }
      };

      // Deduct immediately from wallet on withdrawal request creation.
      const deduction = await applySessionWalletDelta(normalizedSessionCode, -Math.abs(Number(amount || 0)));
      if (!deduction.ok && deduction.reason === 'insufficient_wallet') {
        return res.status(400).json({
          success: false,
          message: 'Số dư ví không đủ để tạo yêu cầu rút tiền',
          data: {
            available_wallet: Number(deduction.currentWallet || 0),
            requested: Number(amount || 0)
          }
        });
      }

      const withdrawal = await Withdrawal.create(withdrawalData);

      emitAdminRealtime(req, 'new_withdrawal', {
        id: withdrawal.id,
        amount: Number(withdrawal.amount || 0),
        session_code: withdrawal.session_code || null,
        status: withdrawal.status || 'pending'
      });

      res.status(201).json({ 
        success: true, 
        message: 'Yêu cầu rút tiền đã được tạo. Sẽ được xử lý trong 24-48 giờ',
        data: withdrawal 
      });
    } catch (error) {
      console.error('Error creating withdrawal from game:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi khi tạo yêu cầu rút tiền',
        error: error.message 
      });
    }
  },

  
  async getBySessionCode(req, res) {
    try {
      const { session_code } = req.params;

      const withdrawals = await Withdrawal.findAll({
        where: { session_code },
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: withdrawals
      });
    } catch (error) {
      console.error('Error getting withdrawals by session:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy lịch sử rút tiền'
      });
    }
  },

  async getFloatingFeed(req, res) {
    try {
      const limitRaw = parseInt(req.query?.limit, 10);
      const daysRaw = parseInt(req.query?.days, 10);
      const limit = Number.isFinite(limitRaw) ? Math.min(1000, Math.max(10, limitRaw)) : 200;
      const days = Number.isFinite(daysRaw) ? Math.min(30, Math.max(1, daysRaw)) : 14;
      const cutoffAt = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const rows = await Withdrawal.findAll({
        where: {
          status: 'approved',
          [Op.or]: [
            { approved_at: { [Op.gte]: cutoffAt } },
            { updated_at: { [Op.gte]: cutoffAt } }
          ]
        },
        attributes: [
          'id',
          'session_code',
          'customer_name',
          'account_holder',
          'prize_name',
          'selected_box_number',
          'box_selection_snapshot',
          'player_contact',
          'approved_at',
          'requested_at',
          'amount',
          'prize_value'
        ],
        order: [['approved_at', 'DESC'], ['id', 'DESC']],
        limit
      });

      const sessionCodes = [...new Set(rows.map((row) => String(row.session_code || '').trim().toUpperCase()).filter(Boolean))];
      let sessionByCode = {};
      let inventoryBySessionBox = {};
      if (sessionCodes.length) {
        const { GameSession, PlayerInventory } = require('../models');
        const sessions = await GameSession.findAll({
          where: { session_code: { [Op.in]: sessionCodes } },
          attributes: ['session_code', 'player_name', 'prize_1', 'prize_2', 'prize_3']
        });
        sessionByCode = sessions.reduce((acc, session) => {
          const code = String(session.session_code || '').trim().toUpperCase();
          if (code) acc[code] = session;
          return acc;
        }, {});

        const inventoryRows = await PlayerInventory.findAll({
          where: { session_code: { [Op.in]: sessionCodes } },
          attributes: ['session_code', 'box_number', 'prize_name', 'updated_at', 'created_at'],
          order: [['updated_at', 'DESC'], ['id', 'DESC']],
          limit: Math.max(300, sessionCodes.length * 6)
        });
        inventoryBySessionBox = inventoryRows.reduce((acc, inv) => {
          const code = String(inv.session_code || '').trim().toUpperCase();
          const boxNum = Number(inv.box_number || 0) || 0;
          if (!code || boxNum < 1 || boxNum > 3) return acc;
          const key = `${code}#${boxNum}`;
          if (!acc[key]) acc[key] = String(inv.prize_name || '').trim();
          return acc;
        }, {});
      }

      const toSafeText = (raw, fallback = '') => {
        const s = String(raw || '').trim();
        if (!s) return fallback;
        return s.slice(0, 140);
      };

      const data = rows.map((row) => {
        const code = String(row.session_code || '').trim().toUpperCase();
        const session = code ? sessionByCode[code] : null;
        const snapshot = (row.box_selection_snapshot && typeof row.box_selection_snapshot === 'object') ? row.box_selection_snapshot : {};
        const contact = (row.player_contact && typeof row.player_contact === 'object') ? row.player_contact : {};
        const boxNum = Number(row.selected_box_number || snapshot.box_number || 0) || null;
        const sessionPrize = (session && boxNum >= 1 && boxNum <= 3) ? session[`prize_${boxNum}`] : '';

        const winnerName =
          toSafeText(row.account_holder)
          || toSafeText(row.customer_name)
          || toSafeText(contact.name)
          || toSafeText(session?.player_name)
          || 'Khách hàng may mắn';

        const amountNum = Number(row.prize_value || row.amount || 0) || 0;
        const inventoryPrize = (code && boxNum) ? toSafeText(inventoryBySessionBox[`${code}#${boxNum}`] || '') : '';
        const fallbackPrize =
          toSafeText(session?.prize_1)
          || toSafeText(session?.prize_2)
          || toSafeText(session?.prize_3)
          || 'Phần quà đặc biệt';

        // Prefer exact prize labels configured by admin on each box.
        const prizeName =
          toSafeText(sessionPrize)
          || inventoryPrize
          || toSafeText(row.prize_name)
          || toSafeText(snapshot.prize_name)
          || fallbackPrize;

        return {
          id: `wd_${row.id}`,
          source: 'approved_withdrawal',
          sessionCode: code || null,
          boxNumber: boxNum,
          winnerName,
          prizeName,
          amount: amountNum,
          approvedAt: row.approved_at || row.updated_at || row.requested_at || row.created_at || null,
          requestedAt: row.requested_at || row.created_at || null
        };
      });

      res.json({ success: true, data });
    } catch (error) {
      console.error('Error getting floating feed withdrawals:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy dữ liệu floating feed'
      });
    }
  }
};
