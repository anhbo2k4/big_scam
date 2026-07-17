const { ConversionRequest, PlayerInventory, GameSession } = require('../models');
const sseChat = require('../services/sseChat');

const emitAdminRealtime = (event, payload = {}) => {
  try {
    sseChat.sendAdminEvent(event, payload);
  } catch (_) {
    // Realtime emit errors must not break conversion flow.
  }
};

module.exports = {
  async list(req, res) {
    try {
      const { status, sessionCode, page = 1, limit = 20 } = req.query;
      const where = {};

      if (status) where.status = status;
      if (sessionCode) where.session_code = String(sessionCode).toUpperCase();

      const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      const { count, rows } = await ConversionRequest.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit, 10),
        offset
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          pages: Math.ceil(count / parseInt(limit, 10))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách quy đổi tiền'
      });
    }
  },

  async approve(req, res) {
    try {
      const { id } = req.params;
      const conversion = await ConversionRequest.findByPk(id);

      if (!conversion) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu quy đổi' });
      }

      if (conversion.status === 'approved') {
        return res.json({ success: true, message: 'Yêu cầu đã được duyệt trước đó', data: conversion });
      }

      const inventoryItem = await PlayerInventory.findOne({
        where: {
          session_code: conversion.session_code,
          box_number: conversion.box_number
        }
      });

      if (!inventoryItem) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy vật phẩm trong kho phiên chơi' });
      }

      if (inventoryItem.status !== 'converted') {
        // Use amount_vnd (converted amount in VND) for the wallet value
        const walletValue = Math.round(Number(conversion.amount_vnd || conversion.amount) || 0);
        await inventoryItem.update({
          status: 'converted',
          prize_value: walletValue,
          claimed_at: new Date()
        });
      }

      const approvalUser = req.session?.user?.username || req.session?.user?.full_name || 'admin';
      // Use amount_vnd for proper VND value
      const approvedAmountVND = Math.max(0, Math.round(Number(conversion.amount_vnd || conversion.amount) || 0));
      await conversion.update({
        status: 'approved',
        approved_by: approvalUser,
        approved_at: new Date(),
        rejection_reason: null
      });

      emitAdminRealtime('conversion_status_updated', {
        id: conversion.id,
        session_code: conversion.session_code,
        box_number: conversion.box_number,
        amount: Number(conversion.amount || 0),
        amount_vnd: approvedAmountVND,
        currency: conversion.currency || 'VND',
        status: 'approved'
      });

      const session = await GameSession.findOne({ where: { session_code: conversion.session_code } });

      // Keep manual wallet in sync when this session is managed by manual wallet amount.
      if (session && session.wallet_manual_amount !== null && session.wallet_manual_amount !== undefined) {
        const currentManual = Number(session.wallet_manual_amount) || 0;
        await session.update({ wallet_manual_amount: currentManual + approvedAmountVND });
      }

      // Notify the player in real-time with rich detail.
      sseChat.sendNotification(conversion.session_code, 'conversion_approved', {
        level: 'success',
        title: 'Quy đổi đã được duyệt',
        message: `Hộp #${conversion.box_number} đã được duyệt quy đổi ${approvedAmountVND.toLocaleString('vi-VN')} VND.`,
        status: 'approved',
        box_number: conversion.box_number,
        amount_vnd: approvedAmountVND,
        amount: Number(conversion.amount || 0),
        currency: conversion.currency || 'VND',
        approved_by: approvalUser,
        conversion_id: conversion.id,
        session_code: conversion.session_code
      });

      const currencyLabel = conversion.currency && conversion.currency !== 'VND'
        ? ` (${conversion.amount} ${conversion.currency} → ${approvedAmountVND.toLocaleString('vi-VN')} VND)`
        : '';

      res.json({
        success: true,
        message: `Đã duyệt quy đổi tiền và cộng vào ví phiên chơi${currencyLabel}`,
        data: {
          conversion,
          session_code: session?.session_code || conversion.session_code,
          amount: approvedAmountVND,
          currency: conversion.currency || 'VND',
          original_amount: Math.round(Number(conversion.amount) || 0)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi duyệt yêu cầu quy đổi tiền'
      });
    }
  },

  async reject(req, res) {
    try {
      const { id } = req.params;
      const { rejection_reason } = req.body || {};
      const conversion = await ConversionRequest.findByPk(id);

      if (!conversion) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu quy đổi' });
      }

      await conversion.update({
        status: 'rejected',
        rejection_reason: rejection_reason || null,
        approved_by: req.session?.user?.username || req.session?.user?.full_name || 'admin',
        approved_at: new Date()
      });

      emitAdminRealtime('conversion_status_updated', {
        id: conversion.id,
        session_code: conversion.session_code,
        box_number: conversion.box_number,
        amount: Number(conversion.amount || 0),
        amount_vnd: Number(conversion.amount_vnd || conversion.amount || 0),
        currency: conversion.currency || 'VND',
        status: 'rejected',
        rejection_reason: rejection_reason || null
      });

      sseChat.sendNotification(conversion.session_code, 'conversion_rejected', {
        level: 'warning',
        title: 'Quy đổi bị từ chối',
        message: `Yêu cầu quy đổi hộp #${conversion.box_number} đã bị từ chối${rejection_reason ? `: ${rejection_reason}` : '.'}`,
        status: 'rejected',
        box_number: conversion.box_number,
        amount_vnd: Number(conversion.amount_vnd || conversion.amount || 0),
        amount: Number(conversion.amount || 0),
        currency: conversion.currency || 'VND',
        rejection_reason: rejection_reason || null,
        conversion_id: conversion.id,
        session_code: conversion.session_code
      });

      const inventoryItem = await PlayerInventory.findOne({
        where: {
          session_code: conversion.session_code,
          box_number: conversion.box_number
        }
      });

      if (inventoryItem && inventoryItem.status === 'exchanged') {
        await inventoryItem.update({
          status: 'obtained'
        });
      }

      res.json({
        success: true,
        message: 'Đã từ chối yêu cầu quy đổi tiền',
        data: conversion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi từ chối yêu cầu quy đổi tiền'
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const conversion = await ConversionRequest.findByPk(id);

      if (!conversion) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu quy đổi' });
      }

      const inventoryItem = await PlayerInventory.findOne({
        where: {
          session_code: conversion.session_code,
          box_number: conversion.box_number
        }
      });

      if (inventoryItem && inventoryItem.status === 'exchanged') {
        await inventoryItem.update({
          status: 'obtained'
        });
      }

      await conversion.destroy();
      res.json({ success: true, message: 'Đã xóa yêu cầu quy đổi tiền' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi khi xóa yêu cầu quy đổi tiền' });
    }
  }
};
