const {
  GameSession,
  AuditLog,
  GiftExchange,
  PlayerInventory,
  Withdrawal,
  ConversionRequest,
  UserGameHistory,
  PrizeRedemptionHistory,
  Prize,
  PrizeInventory,
  TransactionLedger
} = require('../models')
const crypto = require('crypto')
const { Op, fn, col, literal } = require('sequelize')

function parseBooleanLike(value, fallback = false) {
  if (value === true || value === 1) return true
  if (value === false || value === 0) return false
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true' || normalized === '1') return true
    if (normalized === 'false' || normalized === '0') return false
  }
  return fallback
}

function isPrizePatchPayload(payload = {}) {
  return Object.keys(payload).some((key) => /^prize_[1-3](?:_|$)/.test(String(key || '')))
}

// Helper: Generate secure random token
function generateSecureToken(length = 64) {
  return crypto.randomBytes(length / 2).toString('hex')
}

// Helper: Generate a cryptographically secure session code (CSPRNG)
// Produces 8 uppercase alphanumeric characters (~41 bits entropy, no Math.random)
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  // Use crypto.randomInt for uniform, unbiased selection
  for (let i = 0; i < 8; i++) {
    code += chars[crypto.randomInt(chars.length)];
  }
  return code;
}

// Helper: Generate server-side random box selection
function generateServerRandomBoxes(boxCount) {
  const boxes = Array.from({ length: boxCount }, (_, i) => i + 1);
  // Fisher-Yates shuffle
  for (let i = boxes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [boxes[i], boxes[j]] = [boxes[j], boxes[i]];
  }
  return boxes;
}

async function generateUniqueSessionCode(length = 8) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const code = generateCode();
    const exists = await GameSession.findOne({ where: { session_code: code }, attributes: ['id'] });
    if (!exists) return code;
  }
  return `${Date.now().toString(36).toUpperCase()}`.slice(-8).padEnd(8, 'X');
}
const sseChat = require('../services/sseChat')
let cachedGameSessionTableColumns = null
let cachedGameSessionTableColumnsPromise = null

async function getGameSessionSelectableColumns() {
  if (cachedGameSessionTableColumns) return cachedGameSessionTableColumns
  if (!cachedGameSessionTableColumnsPromise) {
    cachedGameSessionTableColumnsPromise = GameSession.sequelize.queryInterface.describeTable('game_sessions')
      .then((columns) => {
        const availableColumns = Object.keys(columns || {})
        const excludeColumns = ['server_random_boxes', 'player_token', 'server_random_seed', 'result_hash']
        cachedGameSessionTableColumns = availableColumns.filter(col => !excludeColumns.includes(col))
        return cachedGameSessionTableColumns
      })
      .catch(() => [])
      .finally(() => {
        cachedGameSessionTableColumnsPromise = null
      })
  }
  return cachedGameSessionTableColumnsPromise
}

// Helper: Calculate SHA256 hash
function calculateHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex')
}

// Helper: Log audit event
async function logAuditEvent(sessionCode, action, req, details = {}, status = 'SUCCESS', errorMsg = null) {
  try {
    await AuditLog.create({
      session_code: sessionCode,
      action,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent'),
      details,
      status,
      error_message: errorMsg
    });
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}
async function list(req, res) {
  try {
    console.log('📋 [API] Fetching all sessions...');
    const selectColumns = await getGameSessionSelectableColumns()
    
    const sessions = await GameSession.findAll({ 
      limit: 200,
      attributes: selectColumns.length > 0 ? selectColumns : undefined,
      raw: true 
    });
    
    console.log(`✅ [API] Found ${sessions ? sessions.length : 0} sessions`);
    
    if (!sessions) {
      console.warn('⚠️ [API] GameSession.findAll returned null');
      return res.json({ success: true, data: [] });
    }
    
    res.json({ success: true, data: sessions });
  } catch (err) {
    console.error('❌ [API] Error fetching sessions:', err.message, err.stack);
    res.status(500).json({ success: false, message: 'Unable to fetch sessions', error: err.message });
  }
}

async function getByCode(req, res) {
  try {
    const session = await GameSession.findOne({ where: { session_code: req.params.code } })
    if (!session) return res.status(404).json({ success: false, message: 'Not found' })
    
    // Don't expose secret to client
    const sessionData = session.toJSON()
    delete sessionData.server_random_boxes
    delete sessionData.player_token
    delete sessionData.server_random_seed
    delete sessionData.result_hash

    // Include special-prize inventory for admin detail views.
    const specialPrizes = await PlayerInventory.findAll({
      where: { session_code: req.params.code, is_special: true },
      attributes: [
        'id', 'session_code', 'box_number', 'prize_name', 'prize_icon', 'prize_description',
        'prize_value', 'status', 'rarity', 'is_cash', 'created_at', 'updated_at'
      ],
      order: [['box_number', 'ASC']]
    });
    sessionData.special_prizes = specialPrizes.map((item) => item.toJSON ? item.toJSON() : item);
    
    res.json({ success: true, data: sessionData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

async function create(req, res) {
  try {
    const payload = req.body
    
    // ✅ LOG: Debug incoming prizes
    if (payload.prizes && Array.isArray(payload.prizes)) {
      console.log('📦 [CREATE SESSION] Received prizes:', payload.prizes.length);
      payload.prizes.forEach((p, idx) => {
        console.log(`   Prize ${idx+1}: name="${p.name}", cash=${p.cash}, cash_amount=${p.cash_amount}, image_url=${p.image_url ? 'present' : 'null'}`);
      });
    }
    
    if (!payload.session_code) {
      payload.session_code = await generateUniqueSessionCode();
    }

    // ✅ NEW: Generate server-side random boxes (CRITICAL SECURITY FIX)
    const boxCount = payload.box_count || 3
    payload.box_count = boxCount
    payload.server_random_boxes = generateServerRandomBoxes(boxCount)
    
    // ✅ NEW: Generate unique player token
    payload.player_token = generateSecureToken()
    
    // ✅ NEW: Generate seed and hash for verification
    payload.server_random_seed = generateSecureToken(256)
    payload.result_hash = calculateHash(payload.server_random_seed)

    // Track which admin created this session
    payload.created_by = req.session?.user?.username || 'system';

    // Validate and set currency
    const validCurrencies = ['VND', 'USD', 'NDT'];
    if (payload.currency && validCurrencies.includes(payload.currency)) {
      payload.currency = payload.currency;
    } else {
      payload.currency = 'VND';
    }

    // ✅ Save prize information from request
    if (payload.prizes && Array.isArray(payload.prizes)) {
      payload.prizes.forEach((prize, idx) => {
        const prizeNum = idx + 1;
        payload[`prize_${prizeNum}`] = prize.name;
        payload[`prize_${prizeNum}_description`] = prize.description;
        payload[`prize_${prizeNum}_icon`] = prize.icon || '🎁';
        payload[`prize_${prizeNum}_status`] = prize.status || 'NORMAL';
        payload[`prize_${prizeNum}_is_special`] = prize.is_special || false;
        payload[`prize_${prizeNum}_cash`] = prize.cash || false;
        // ✅ FIX: Ensure cash_amount is an integer using Math.round()
        payload[`prize_${prizeNum}_cash_amount`] = Math.round(prize.cash_amount || 0);
        payload[`prize_${prizeNum}_image_url`] = prize.image_url || null;
      });
      delete payload.prizes;
    }

    const session = await GameSession.create(payload);    
    // Log session creation
    await logAuditEvent(
      session.session_code,
      'SESSION_CREATE',
      req,
      { box_count: boxCount, prizes: payload.prizes ? payload.prizes.length : 0 }
    )

    // Return to client without exposing server secrets
    const sessionData = session.toJSON()
    delete sessionData.server_random_boxes
    delete sessionData.player_token
    delete sessionData.server_random_seed
    delete sessionData.result_hash

    res.json({ success: true, data: sessionData })
  } catch (err) {
    console.error(err)
    await logAuditEvent('UNKNOWN', 'SESSION_CREATE', req, {}, 'FAILURE', err.message)
    res.status(500).json({ success: false, message: 'Create failed', error: err.message })
  }
}

async function update(req, res) {
  try {
    const session = await GameSession.findOne({ where: { session_code: req.params.code } })
    if (!session) return res.status(404).json({ success: false, message: 'Not found' })
    
    // Don't allow updating security fields from client
    const { server_random_boxes, player_token, server_random_seed, result_hash, ...safePayload } = req.body
    
    // Validate currency if provided
    if (safePayload.currency) {
      const validCurrencies = ['VND', 'USD', 'NDT'];
      if (!validCurrencies.includes(safePayload.currency)) {
        safePayload.currency = 'VND';
      }
    }
    
    // ✅ Save prize information from request
    const hasPrizePayload = Array.isArray(safePayload.prizes)
    if (hasPrizePayload) {
      safePayload.prizes.forEach((prize, idx) => {
        const prizeNum = idx + 1;
        safePayload[`prize_${prizeNum}`] = prize.name;
        safePayload[`prize_${prizeNum}_description`] = prize.description;
        safePayload[`prize_${prizeNum}_icon`] = prize.icon || '🎁';
        safePayload[`prize_${prizeNum}_status`] = prize.status || 'NORMAL';
        safePayload[`prize_${prizeNum}_is_special`] = prize.is_special || false;
        safePayload[`prize_${prizeNum}_cash`] = prize.cash || false;
        // ✅ FIX: Ensure cash_amount is an integer using Math.round()
        safePayload[`prize_${prizeNum}_cash_amount`] = Math.round(prize.cash_amount || 0);
        safePayload[`prize_${prizeNum}_image_url`] = prize.image_url || null;
      });
      delete safePayload.prizes;
    }

    const shouldSyncPrizeMeta = hasPrizePayload || isPrizePatchPayload(safePayload)
    const previousSessionCode = session.session_code
    
    await session.update(safePayload)

    // Keep inventory metadata in sync so admin reload reflects edited gift-box info.
    if (shouldSyncPrizeMeta) {
      const sessionCodeCandidates = [...new Set([previousSessionCode, session.session_code].filter(Boolean))]
      const sessionCodeWhere = sessionCodeCandidates.length > 1
        ? { [Op.in]: sessionCodeCandidates }
        : sessionCodeCandidates[0]

      for (let i = 1; i <= 3; i += 1) {
        const sessionPrizeName = session[`prize_${i}`] || null
        const sessionPrizeDescription = session[`prize_${i}_description`] || null
        const sessionPrizeIcon = session[`prize_${i}_icon`] || '🎁'
        const sessionPrizeStatus = String(session[`prize_${i}_status`] || 'NORMAL').toUpperCase()
        const sessionPrizeIsSpecial = parseBooleanLike(session[`prize_${i}_is_special`], false)
        const sessionPrizeIsCash = parseBooleanLike(session[`prize_${i}_cash`], false)
        const sessionPrizeValue = Math.max(0, Math.round(Number(session[`prize_${i}_cash_amount`] || 0)))
        const sessionPrizeImage = session[`prize_${i}_image_url`] || null

        const invPatch = {
          prize_name: sessionPrizeName,
          prize_description: sessionPrizeDescription,
          prize_icon: sessionPrizeIcon,
          is_special: sessionPrizeIsSpecial,
          is_cash: sessionPrizeIsCash,
          prize_value: sessionPrizeValue,
          rarity: sessionPrizeStatus,
          prize_image: sessionPrizeImage
        }

        await PlayerInventory.update(invPatch, {
          where: {
            session_code: sessionCodeWhere,
            box_number: i
          }
        })
      }

      const selectedBoxNumber = Number(session.player_selected_box || 0)
      if ([1, 2, 3].includes(selectedBoxNumber)) {
        await session.update({
          selected_prize_details: {
            name: session[`prize_${selectedBoxNumber}`] || 'Quà tặng',
            description: session[`prize_${selectedBoxNumber}_description`] || '',
            icon: session[`prize_${selectedBoxNumber}_icon`] || '🎁',
            imageUrl: session[`prize_${selectedBoxNumber}_image_url`] || null,
            isCash: parseBooleanLike(session[`prize_${selectedBoxNumber}_cash`], false),
            cashAmount: Math.max(0, Math.round(Number(session[`prize_${selectedBoxNumber}_cash_amount`] || 0))),
            isSpecial: parseBooleanLike(session[`prize_${selectedBoxNumber}_is_special`], false),
            status: String(session[`prize_${selectedBoxNumber}_status`] || 'NORMAL').toUpperCase()
          }
        })
      }

      try {
        sseChat.sendNotification(session.session_code, 'session_updated', {
          level: 'info',
          title: 'Phiên chơi đã được cập nhật',
          message: 'Thông tin hộp quà vừa được cập nhật. Hệ thống đang đồng bộ dữ liệu mới.',
          session_code: session.session_code,
          updated_at: new Date().toISOString()
        })
      } catch (_) {}
    }
    
    await logAuditEvent(session.session_code, 'SESSION_UPDATE', req, safePayload)

    // Return safe data
    const sessionData = session.toJSON()
    delete sessionData.server_random_boxes
    delete sessionData.player_token
    delete sessionData.server_random_seed
    delete sessionData.result_hash

    res.json({ success: true, data: sessionData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

async function remove(req, res) {
  try {
    const session = await GameSession.findOne({ where: { session_code: req.params.code } })
    if (!session) return res.status(404).json({ success: false, message: 'Not found' })
    
    try {
      await logAuditEvent(session.session_code, 'SESSION_DELETE', req)
    } catch (logErr) {
      console.warn('⚠️ Failed to log audit event for session delete:', logErr.message)
      // Continue even if logging fails
    }
    
    const deletedRelated = await GameSession.sequelize.transaction(async (transaction) => {
      const stats = await deleteRelatedBySessionSet({
        sessionIds: [session.id],
        sessionCodes: [session.session_code],
        transaction
      })

      await session.destroy({ transaction })
      return stats
    })
    
    res.json({ success: true, deletedRelated })
  } catch (err) {
    console.error('❌ Error deleting session:', err.message)
    console.error('Full error:', err)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete session',
      error: err.message
    })
  }
}

function buildInWhere(field, values = []) {
  const arr = Array.isArray(values) ? values.filter(Boolean) : []
  if (!arr.length) return null
  return { [field]: { [Op.in]: arr } }
}

async function safeDestroyModel(model, where, transaction, label) {
  if (!model || !where) return 0
  try {
    return await model.destroy({ where, transaction })
  } catch (err) {
    console.warn(`⚠️ Failed to delete ${label}:`, err.message)
    return 0
  }
}

async function deleteRelatedBySessionSet({ sessionIds = [], sessionCodes = [], transaction }) {
  const idsWhere = buildInWhere('id', sessionIds)
  const sessionIdWhere = buildInWhere('session_id', sessionIds)
  const sessionCodeWhere = buildInWhere('session_code', sessionCodes)
  const gameSessionIdWhere = buildInWhere('game_session_id', sessionIds)

  const giftWhere = [sessionIdWhere, sessionCodeWhere].filter(Boolean)
  const historyWhere = [sessionIdWhere, sessionCodeWhere].filter(Boolean)

  const deleted = {
    auditLogs: await safeDestroyModel(AuditLog, sessionCodeWhere, transaction, 'audit logs'),
    conversionRequests: await safeDestroyModel(ConversionRequest, sessionCodeWhere, transaction, 'conversion requests'),
    playerInventory: await safeDestroyModel(PlayerInventory, sessionCodeWhere, transaction, 'player inventory'),
    withdrawals: await safeDestroyModel(Withdrawal, sessionCodeWhere, transaction, 'withdrawals'),
    giftExchanges: await safeDestroyModel(
      GiftExchange,
      giftWhere.length === 2 ? { [Op.or]: giftWhere } : giftWhere[0],
      transaction,
      'gift exchanges'
    ),
    userGameHistories: await safeDestroyModel(
      UserGameHistory,
      historyWhere.length === 2 ? { [Op.or]: historyWhere } : historyWhere[0],
      transaction,
      'user game histories'
    ),
    prizeRedemptionHistories: await safeDestroyModel(
      PrizeRedemptionHistory,
      historyWhere.length === 2 ? { [Op.or]: historyWhere } : historyWhere[0],
      transaction,
      'prize redemption histories'
    ),
    transactionLedger: await safeDestroyModel(TransactionLedger, gameSessionIdWhere, transaction, 'transaction ledger'),
    prizeInventories: await safeDestroyModel(PrizeInventory, gameSessionIdWhere, transaction, 'prize inventories'),
    prizes: await safeDestroyModel(Prize, gameSessionIdWhere, transaction, 'prizes')
  }

  return deleted
}

async function removeAll(req, res) {
  try {
    const sessions = await GameSession.findAll({ attributes: ['id', 'session_code'], raw: true })
    if (!sessions.length) {
      return res.json({ success: true, deletedSessions: 0, deletedRelated: {} })
    }

    const sessionIds = sessions.map((s) => s.id).filter(Boolean)
    const sessionCodes = sessions.map((s) => s.session_code).filter(Boolean)

    const result = await GameSession.sequelize.transaction(async (transaction) => {
      const deletedRelated = await deleteRelatedBySessionSet({ sessionIds, sessionCodes, transaction })
      const deletedSessions = await GameSession.destroy({ where: buildInWhere('id', sessionIds), transaction })
      return { deletedSessions, deletedRelated }
    })

    res.json({
      success: true,
      deletedSessions: result.deletedSessions,
      deletedRelated: result.deletedRelated,
      message: `Đã xóa ${result.deletedSessions} phiên và dữ liệu liên quan.`
    })
  } catch (err) {
    console.error('❌ Error deleting all sessions:', err)
    res.status(500).json({ success: false, message: 'Failed to delete all sessions', error: err.message })
  }
}

async function completeSession(req, res) {
  try {
    const session = await GameSession.findOne({ where: { session_code: req.params.code } })
    if (!session) return res.status(404).json({ success: false, message: 'Phiên không tìm thấy' })
    
    await session.update({
      is_active: false,
      is_completed: true
    })
    
    await logAuditEvent(session.session_code, 'SESSION_COMPLETE', req)

    // Track game play in history
    try {
      const { UserGameHistory } = require('../models');
      const gameHistory = await UserGameHistory.create({
        session_id: session.id,
        session_code: session.session_code,
        game_type: session.game_type || 'boxes',
        player_name: session.player_name,
        player_phone: session.player_phone,
        player_email: session.player_email,
        player_ip: req.ip || req.connection.remoteAddress,
        player_device: req.get('user-agent'),
        selected_box: session.player_selected_box,
        won_prize: session.prize_1 || session.prize_2 || session.prize_3,
        prize_value: session.prize_1_cash_amount || session.prize_2_cash_amount || session.prize_3_cash_amount,
        is_special: session.prize_1_is_special || session.prize_2_is_special || session.prize_3_is_special,
        is_unlucky: false,
        game_duration_ms: session.completion_time_seconds ? session.completion_time_seconds * 1000 : null,
        boxes_opened_count: [session.box_1_opened, session.box_2_opened, session.box_3_opened].filter(Boolean).length,
        completed: true,
        form_submitted: session.form_submitted_at ? true : false
      });

      // Broadcast game completion via WebSocket
      const historyWS = require('../utils/websocketHistory');
      if (req.app && req.app.locals && req.app.locals.historyWS) {
        req.app.locals.historyWS.broadcastGamePlay({
          id: gameHistory.id,
          session_code: gameHistory.session_code,
          player_name: gameHistory.player_name,
          won_prize: gameHistory.won_prize,
          timestamp: new Date().toISOString()
        });
        console.log('📊 Game completion broadcasted via WebSocket');
      }
    } catch (historyErr) {
      console.error('⚠️ Error tracking game history:', historyErr.message);
      // Continue even if tracking fails
    }

    // Return safe data
    const sessionData = session.toJSON()
    delete sessionData.server_random_boxes
    delete sessionData.player_token
    delete sessionData.server_random_seed
    delete sessionData.result_hash
    
    res.json({ success: true, data: sessionData, message: 'Phiên đã hoàn thành' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Lỗi khi hoàn thành phiên' })
  }
}

async function paginated(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 12);
    const offset = (page - 1) * limit;
    
    
    const selectColumns = await getGameSessionSelectableColumns()
    
    const { count, rows } = await GameSession.findAndCountAll({
      limit,
      offset,
      attributes: selectColumns.length > 0 ? selectColumns : undefined,
      order: [['createdAt', 'DESC']],
      raw: true
    });
    
    const safeSessions = rows;

    const sessionCodes = safeSessions
      .map(session => session.session_code)
      .filter(Boolean);

    const convertedBySession = {};
    const pendingBySession = {};
    const approvedBySession = {};
    const specialBySession = {};
    const inventoryBySession = {};

    if (sessionCodes.length > 0) {
      const convertedRows = await PlayerInventory.findAll({
        attributes: [
          'session_code',
          [fn('COALESCE', fn('SUM', col('prize_value')), 0), 'converted_total']
        ],
        where: {
          session_code: { [Op.in]: sessionCodes },
          status: 'converted'
        },
        group: ['session_code'],
        raw: true
      });

      const usedRows = await Withdrawal.findAll({
        attributes: [
          'session_code',
          [fn('COALESCE', fn('SUM', literal("CASE WHEN status = 'pending' THEN amount ELSE 0 END")), 0), 'pending_total'],
          [fn('COALESCE', fn('SUM', literal("CASE WHEN status = 'approved' THEN amount ELSE 0 END")), 0), 'approved_total']
        ],
        where: {
          session_code: { [Op.in]: sessionCodes }
        },
        group: ['session_code'],
        raw: true
      });

      convertedRows.forEach(row => {
        convertedBySession[row.session_code] = Number(row.converted_total || 0);
      });

      usedRows.forEach(row => {
        pendingBySession[row.session_code] = Number(row.pending_total || 0);
        approvedBySession[row.session_code] = Number(row.approved_total || 0);
      });

      const specialRows = await PlayerInventory.findAll({
        where: {
          session_code: { [Op.in]: sessionCodes },
          is_special: true
        },
        attributes: [
          'session_code', 'box_number', 'prize_name', 'prize_icon', 'status',
          'rarity', 'prize_value', 'updated_at', 'created_at'
        ],
        order: [['updated_at', 'DESC']],
        raw: true
      });

      specialRows.forEach((row) => {
        const code = row.session_code;
        if (!specialBySession[code]) {
          specialBySession[code] = [];
        }
        specialBySession[code].push(row);
      });

      // Fetch per-box inventory processing status
      const inventoryRows = await PlayerInventory.findAll({
        where: { session_code: { [Op.in]: sessionCodes } },
        attributes: ['session_code', 'box_number', 'status'],
        order: [['box_number', 'ASC']],
        raw: true
      });

      inventoryRows.forEach((row) => {
        const code = row.session_code;
        if (!inventoryBySession[code]) inventoryBySession[code] = {};
        inventoryBySession[code][row.box_number] = row.status || 'obtained';
      });

    }

    const sessionsWithWallet = safeSessions.map(session => {
      const convertedTotal = Number(convertedBySession[session.session_code] || 0);
      const manualWalletAmount = session.wallet_manual_amount === null || session.wallet_manual_amount === undefined
        ? null
        : Number(session.wallet_manual_amount);
      const hasManualWallet = manualWalletAmount !== null && Number.isFinite(manualWalletAmount);
      const walletTotal = hasManualWallet
        ? Math.max(0, manualWalletAmount)
        : convertedTotal;
      const pendingUsed = Number(pendingBySession[session.session_code] || 0);
      const approvedUsed = Number(approvedBySession[session.session_code] || 0);
      // If wallet is manual, approved withdrawals are already deducted into wallet_manual_amount.
      const usedTotal = hasManualWallet ? pendingUsed : (pendingUsed + approvedUsed);
      const walletRemaining = Math.max(0, walletTotal - usedTotal);
      const trustScore = Number.isFinite(Number(session.trust_score))
        ? Math.max(0, Math.min(100, Math.round(Number(session.trust_score))))
        : 100;

      const specialItems = specialBySession[session.session_code] || [];
      const pendingSpecialItems = specialItems
        .filter((item) => String(item.status || '').toLowerCase() === 'pending_approval')
        .sort((a, b) => Number(a.box_number || 0) - Number(b.box_number || 0));

      const invStatuses = inventoryBySession[session.session_code] || {};

      return {
        ...session,
        wallet_total: walletTotal,
        wallet_remaining: walletRemaining,
        wallet_used: usedTotal,
        wallet_is_manual: hasManualWallet,
        trust_score: trustScore,
        inv_status_1: invStatuses[1] || '',
        inv_status_2: invStatuses[2] || '',
        inv_status_3: invStatuses[3] || '',
        special_summary: {
          hasSpecial: specialItems.length > 0,
          pendingCount: pendingSpecialItems.length,
          pendingItems: pendingSpecialItems.map((item) => ({
            box_number: Number(item.box_number || 0),
            prize_name: item.prize_name || 'Phần thưởng đặc biệt',
            prize_icon: item.prize_icon || '🎁',
            status: item.status || 'pending_approval',
            level: item.level || item.rarity || 'NORMAL',
            prize_value: Number(item.prize_value || 0)
          }))
        }
      };
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.json({
      success: true,
      data: sessionsWithWallet,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error('❌ [API] Error fetching paginated sessions:', err.message);
    res.status(500).json({ success: false, message: 'Unable to fetch sessions', error: err.message });
  }
}

async function updateSessionWallet(req, res) {
  try {
    const code = String(req.params.code || '').toUpperCase();
    const amount = Number(req.body?.amount);
    const trustScoreInput = req.body?.trust_score;
    const prizeAmountsInput = req.body?.prize_amounts;
    const prizeStatusesInput = req.body?.prize_statuses;
    const processingStatusesInput = req.body?.processing_statuses;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Mã phiên không hợp lệ' });
    }

    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ success: false, message: 'Số tiền ví phải là số >= 0' });
    }

    const session = await GameSession.findOne({ where: { session_code: code } });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chơi' });
    }

    const roundedAmount = Math.round(amount);
    const convertedBeforeRaw = await PlayerInventory.sum('prize_value', {
      where: { session_code: code, status: 'converted' }
    });
    const convertedBefore = Number(convertedBeforeRaw || 0);
    const existingManualWallet = session.wallet_manual_amount === null || session.wallet_manual_amount === undefined
      ? null
      : Number(session.wallet_manual_amount);
    const walletBefore = existingManualWallet !== null && Number.isFinite(existingManualWallet)
      ? Math.max(0, existingManualWallet)
      : Math.max(0, convertedBefore);

    const updateData = {};
    const updatedPrizeAmounts = {};
    const updatedPrizeStatuses = {};
    const skippedUnluckyBoxes = [];

    const normalizePrizeStatus = (value) => {
      const status = String(value || '').toUpperCase();
      if (status === 'VIP' || status === 'UNLUCKY' || status === 'NORMAL') return status;
      return 'NORMAL';
    };

    const effectiveStatusByBox = {
      1: normalizePrizeStatus(session.prize_1_status || 'NORMAL'),
      2: normalizePrizeStatus(session.prize_2_status || 'NORMAL'),
      3: normalizePrizeStatus(session.prize_3_status || 'NORMAL')
    };

    if (prizeStatusesInput && typeof prizeStatusesInput === 'object') {
      [1, 2, 3].forEach((box) => {
        const incoming = prizeStatusesInput[box] ?? prizeStatusesInput[String(box)];
        if (incoming === undefined) return;

        const normalized = normalizePrizeStatus(incoming);
        effectiveStatusByBox[box] = normalized;
        updateData[`prize_${box}_status`] = normalized;
        updatedPrizeStatuses[box] = normalized;

        if (normalized === 'UNLUCKY') {
          updateData[`prize_${box}_cash_amount`] = 0;
          updatedPrizeAmounts[box] = 0;
        }
      });
    }

    if (prizeAmountsInput && typeof prizeAmountsInput === 'object') {
      [1, 2, 3].forEach((box) => {
        if (prizeAmountsInput[box] !== undefined || prizeAmountsInput[String(box)] !== undefined) {
          const prizeStatus = String(effectiveStatusByBox[box] || '').toUpperCase();
          if (prizeStatus === 'UNLUCKY') {
            skippedUnluckyBoxes.push(box);
            updateData[`prize_${box}_cash_amount`] = 0;
            updatedPrizeAmounts[box] = 0;
            return;
          }

          const value = prizeAmountsInput[box] ?? prizeAmountsInput[String(box)];
          const parsed = Math.round(Number(value));
          if (!Number.isFinite(parsed) || parsed < 0) {
            throw new Error(`Tiền hộp ${box} phải là số >= 0`);
          }
          updateData[`prize_${box}_cash_amount`] = parsed;
          updatedPrizeAmounts[box] = parsed;
        }
      });
    }

    let trustScoreUpdated = false;
    let trustScoreValue = null;
    if (trustScoreInput !== undefined && trustScoreInput !== null && trustScoreInput !== '') {
      const parsedTrust = Math.round(Number(trustScoreInput));
      if (!Number.isFinite(parsedTrust) || parsedTrust < 0 || parsedTrust > 100) {
        return res.status(400).json({ success: false, message: 'Điểm tín nhiệm phải trong khoảng 0-100' });
      }

      updateData.trust_score = parsedTrust;
      trustScoreUpdated = true;
      trustScoreValue = parsedTrust;
    }

    const walletExplicitlyChanged = roundedAmount !== Math.round(walletBefore);
    if (walletExplicitlyChanged) {
      updateData.wallet_manual_amount = roundedAmount;
    }

    await session.update(updateData);

    for (const [box, value] of Object.entries(updatedPrizeAmounts)) {
      const parsedBox = Number(box);
      if (!Number.isInteger(parsedBox) || parsedBox < 1 || parsedBox > 3) {
        continue;
      }

      await PlayerInventory.update(
        { prize_value: value },
        {
          where: {
            session_code: code,
            box_number: parsedBox
          }
        }
      );
    }

    // Update per-box inventory processing status
    const allowedProcessing = ['obtained', 'pending_approval', 'confirmed', 'converted', 'declined', 'rejected', 'claimed', 'exchanged', 'banned'];
    if (processingStatusesInput && typeof processingStatusesInput === 'object') {
      for (const box of [1, 2, 3]) {
        const incoming = processingStatusesInput[box] ?? processingStatusesInput[String(box)];
        if (incoming === undefined) continue;
        const normalized = String(incoming).toLowerCase();
        if (!allowedProcessing.includes(normalized)) continue;
        await PlayerInventory.update(
          { status: normalized },
          { where: { session_code: code, box_number: box } }
        );
      }
    }

    const convertedAfterRaw = await PlayerInventory.sum('prize_value', {
      where: { session_code: code, status: 'converted' }
    });
    const convertedAfter = Number(convertedAfterRaw || 0);
    const walletTotalAfter = updateData.wallet_manual_amount === null
      ? Math.max(0, convertedAfter)
      : updateData.wallet_manual_amount !== undefined
        ? Math.max(0, Number(updateData.wallet_manual_amount) || 0)
        : (existingManualWallet !== null && Number.isFinite(existingManualWallet)
          ? Math.max(0, existingManualWallet)
          : Math.max(0, convertedAfter));

    return res.json({
      success: true,
      message: skippedUnluckyBoxes.length > 0
        ? `Đã cập nhật tài chính phiên. Bỏ qua hộp UNLUCKY: ${skippedUnluckyBoxes.join(', ')}`
        : 'Đã cập nhật thông tin tài chính phiên chơi',
      data: {
        session_code: code,
        wallet_manual_amount: updateData.wallet_manual_amount === undefined ? existingManualWallet : updateData.wallet_manual_amount,
        wallet_total: walletTotalAfter,
        prize_amounts: updatedPrizeAmounts,
        prize_statuses: updatedPrizeStatuses,
        trust_score: trustScoreValue,
        trust_score_updated: trustScoreUpdated,
        skipped_unlucky_boxes: skippedUnluckyBoxes
      }
    });
  } catch (err) {
    console.error('❌ [API] Error updating session wallet:', err.message);
    if (err.message && err.message.includes('Tiền hộp')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Không thể cập nhật tiền ví phiên chơi' });
  }
}

async function approveSpecialPrize(req, res) {
  try {
    const { code } = req.params;
    const boxNumber = parseInt(req.body.boxNumber || req.query.boxNumber, 10);

    const session = await GameSession.findOne({ where: { session_code: code } });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chơi' });
    }

    // Find the specific special inventory item for this box
    const item = await PlayerInventory.findOne({
      where: { session_code: code, box_number: boxNumber, is_special: true }
    });
    if (!item) {
      return res.status(404).json({ success: false, message: `Không tìm thấy quà đặc biệt hộp #${boxNumber}` });
    }
    if (item.status !== 'pending_approval') {
      return res.status(400).json({ success: false, message: `Hộp #${boxNumber} không ở trạng thái chờ duyệt (hiện tại: ${item.status})` });
    }

    await item.update({ status: 'confirmed', approved_by: req.session?.user?.username || 'admin' });

    await logAuditEvent(code, 'SPECIAL_PRIZE_APPROVED', req, {
      box_number: boxNumber,
      admin: req.session?.user?.username || 'admin'
    });

    // Broadcast real-time notification to player via WebSocket
    const historyWS = req.app.locals.historyWS;
    if (historyWS) {
      historyWS.broadcastToRoom(`session:${code}`, {
        type: 'special_prize_decision',
        decision: 'approved',
        sessionCode: code,
        boxNumber: boxNumber,
        timestamp: new Date().toISOString()
      });
    }

    sseChat.sendNotification(code, 'special_prize_approved', {
      level: 'success',
      title: 'Quà đặc biệt đã được duyệt',
      message: `Hộp #${boxNumber} đã được admin duyệt. Bạn có thể tiếp tục nhận/đổi quà.`,
      session_code: code,
      box_number: boxNumber,
      status: 'approved',
      approved_by: req.session?.user?.username || 'admin'
    });

    return res.json({ success: true, message: `Đã duyệt quà đặc biệt hộp #${boxNumber}` });
  } catch (err) {
    console.error('[approveSpecialPrize] error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}

async function rejectSpecialPrize(req, res) {
  try {
    const { code } = req.params;
    const boxNumber = parseInt(req.body.boxNumber || req.query.boxNumber, 10);

    const session = await GameSession.findOne({ where: { session_code: code } });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chơi' });
    }

    const item = await PlayerInventory.findOne({
      where: { session_code: code, box_number: boxNumber, is_special: true }
    });
    if (!item) {
      return res.status(404).json({ success: false, message: `Không tìm thấy quà đặc biệt hộp #${boxNumber}` });
    }
    if (item.status !== 'pending_approval') {
      return res.status(400).json({ success: false, message: `Hộp #${boxNumber} không ở trạng thái chờ duyệt` });
    }

    await item.update({ status: 'rejected', rejected_by: req.session?.user?.username || 'admin' });

    await logAuditEvent(code, 'SPECIAL_PRIZE_REJECTED', req, {
      box_number: boxNumber,
      admin: req.session?.user?.username || 'admin'
    });

    // Broadcast real-time notification to player via WebSocket
    const historyWS = req.app.locals.historyWS;
    if (historyWS) {
      historyWS.broadcastToRoom(`session:${code}`, {
        type: 'special_prize_decision',
        decision: 'rejected',
        sessionCode: code,
        boxNumber: boxNumber,
        timestamp: new Date().toISOString()
      });
    }

    sseChat.sendNotification(code, 'special_prize_rejected', {
      level: 'warning',
      title: 'Quà đặc biệt bị từ chối',
      message: `Hộp #${boxNumber} không được duyệt. Bạn có thể tiếp tục mở hộp còn lại.`,
      session_code: code,
      box_number: boxNumber,
      status: 'rejected',
      rejected_by: req.session?.user?.username || 'admin'
    });

    return res.json({ success: true, message: `Đã từ chối quà đặc biệt hộp #${boxNumber}` });
  } catch (err) {
    console.error('[rejectSpecialPrize] error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}

/**
 * POST /api/sessions/:code/open-random
 *
 * Executes the RANDOM BOX OPENING mode for a session.
 * The winning box is determined server-side using the configured random_bias.
 * Result is persisted to the DB and broadcast via SSE to admins + game viewers.
 */
async function openRandomBox(req, res) {
  try {
    const { code } = req.params;
    const session = await GameSession.findOne({ where: { session_code: code } });
    if (!session) return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chơi' });
    if (!session.is_active) return res.status(400).json({ success: false, message: 'Phiên đã kết thúc' });
    if (session.opening_mode !== 'random_single') {
      return res.status(400).json({ success: false, message: 'Phiên này không dùng chế độ mở hộp ngẫu nhiên' });
    }
    if (session.random_opened_box) {
      return res.status(400).json({ success: false, message: 'Hộp đã được mở', openedBox: session.random_opened_box });
    }

    const { selectRandomBox, buildOpenedBoxResult } = require('../services/randomBoxService');
    const sseChat = require('../services/sseChat');

    const boxCount = session.box_count || 3;
    const bias = session.random_bias || 'normal';
    const sessionPlain = session.toJSON();

    const openedBoxNum = selectRandomBox(sessionPlain, bias, boxCount);
    const result = buildOpenedBoxResult(sessionPlain, openedBoxNum);

    // Persist to DB
    await session.update({
      random_opened_box: openedBoxNum,
      player_selected_box: openedBoxNum,
      player_selected_at: new Date()
    });

    await logAuditEvent(code, 'RANDOM_BOX_OPENED', req, {
      openedBox: openedBoxNum,
      bias,
      prize: result.prize
    });

    // SSE broadcast to admins + game viewers
    sseChat.broadcastGameEvent(code, 'random_box_result', {
      sessionCode: code,
      openedBox: openedBoxNum,
      bias,
      result,
      ts: Date.now()
    });

    return res.json({ success: true, data: { openedBox: openedBoxNum, result } });
  } catch (err) {
    console.error('[openRandomBox] error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server khi mở hộp ngẫu nhiên' });
  }
}

/**
 * PUT /api/sessions/:code/opening-mode
 *
 * Admin changes the opening mode and bias setting for a session.
 * Body: { opening_mode: 'sequential'|'random_single', random_bias: 'normal'|'unlucky_bias'|'always_unlucky' }
 */
async function updateOpeningMode(req, res) {
  try {
    const { code } = req.params;
    const { opening_mode, random_bias } = req.body;

    const validModes = ['sequential', 'random_single'];
    const validBiases = ['normal', 'unlucky_bias', 'always_unlucky'];

    if (opening_mode && !validModes.includes(opening_mode)) {
      return res.status(400).json({ success: false, message: 'opening_mode không hợp lệ' });
    }
    if (random_bias && !validBiases.includes(random_bias)) {
      return res.status(400).json({ success: false, message: 'random_bias không hợp lệ' });
    }

    const session = await GameSession.findOne({ where: { session_code: code } });
    if (!session) return res.status(404).json({ success: false, message: 'Không tìm thấy phiên chơi' });

    const updates = {};
    if (opening_mode) updates.opening_mode = opening_mode;
    if (random_bias) updates.random_bias = random_bias;

    // If switching to random mode, validate at least one unlucky prize exists
    if (opening_mode === 'random_single') {
      const { hasAtLeastOneUnluckyPrize } = require('../services/randomBoxService');
      const boxCount = session.box_count || 3;
      const prizes = [];
      for (let i = 1; i <= boxCount; i++) {
        prizes.push({ status: session[`prize_${i}_status`] || 'NORMAL' });
      }
      if (!hasAtLeastOneUnluckyPrize(prizes)) {
        return res.status(400).json({
          success: false,
          message: 'Chế độ mở hộp ngẫu nhiên yêu cầu ít nhất một hộp UNLUCKY (NORMAL).'
        });
      }
    }

    await session.update(updates);
    await logAuditEvent(code, 'OPENING_MODE_CHANGED', req, updates);

    const sessionData = session.toJSON();
    delete sessionData.server_random_boxes;
    delete sessionData.player_token;
    delete sessionData.server_random_seed;
    delete sessionData.result_hash;

    return res.json({ success: true, data: sessionData });
  } catch (err) {
    console.error('[updateOpeningMode] error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
}

async function cloneSession(req, res) {
  try {
    const sourceCode = String(req.params.code || '').trim().toUpperCase();
    if (!sourceCode) {
      return res.status(400).json({ success: false, message: 'Thiếu mã phiên nguồn' });
    }

    const source = await GameSession.findOne({ where: { session_code: sourceCode } });
    if (!source) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiên nguồn' });
    }

    const sourceData = source.toJSON();
    const cloneData = {};
    const copyableFields = Object.keys(GameSession.rawAttributes || {});
    const excludedFields = new Set([
      'id',
      'session_code',
      'created_at',
      'updated_at',
      'deleted_at',
      'player_selected_box',
      'player_selected_at',
      'player_name',
      'player_phone',
      'player_email',
      'player_viewed_at',
      'selected_prize_details',
      'box_selection_event',
      'is_form_submitted',
      'form_submitted_at',
      'box_1_opened',
      'box_2_opened',
      'box_3_opened',
      'boxes_opened',
      'is_completed',
      'opened_at',
      'is_exchanged',
      'exchanged_at',
      'special_prize_pending',
      'special_prize_approved',
      'pending_box_number',
      'approved_by_admin_at',
      'prize_1_approved',
      'prize_2_approved',
      'prize_3_approved',
      'random_opened_box',
      'view_count',
      'result_event_count',
      'share_count',
      'completion_time_seconds',
      'server_random_boxes',
      'player_token',
      'result_hash',
      'server_random_seed',
      'fraud_flag',
      'fraud_reason'
    ]);

    copyableFields.forEach((field) => {
      if (excludedFields.has(field)) return;
      if (typeof sourceData[field] === 'undefined') return;
      cloneData[field] = sourceData[field];
    });

    const boxCount = Math.max(1, Math.min(20, Number(sourceData.box_count || cloneData.box_count || 3) || 3));
    const requestedCode = String(req.body?.session_code || '').trim().toUpperCase();
    let nextCode = requestedCode || await generateUniqueSessionCode(8);
    if (requestedCode) {
      const codeExists = await GameSession.findOne({ where: { session_code: requestedCode }, attributes: ['id'] });
      if (codeExists) {
        return res.status(409).json({ success: false, message: 'Mã phiên clone đã tồn tại, vui lòng chọn mã khác' });
      }
    }

    cloneData.session_code = nextCode;
    cloneData.box_count = boxCount;
    cloneData.box_positions = Array.isArray(sourceData.box_positions) && sourceData.box_positions.length
      ? sourceData.box_positions
      : [1, 2, 3];

    cloneData.status = sourceData.status === 'paused' ? 'paused' : 'active';
    cloneData.is_active = sourceData.is_active !== false;
    cloneData.created_by = req.session?.user?.username || sourceData.created_by || 'system';

    cloneData.box_1_opened = false;
    cloneData.box_2_opened = false;
    cloneData.box_3_opened = false;
    cloneData.boxes_opened = [];
    cloneData.is_completed = false;
    cloneData.opened_at = null;
    cloneData.is_exchanged = false;
    cloneData.exchanged_at = null;
    cloneData.special_prize_pending = false;
    cloneData.special_prize_approved = false;
    cloneData.pending_box_number = null;
    cloneData.approved_by_admin_at = null;
    cloneData.player_selected_box = null;
    cloneData.player_selected_at = null;
    cloneData.player_name = null;
    cloneData.player_phone = null;
    cloneData.player_email = null;
    cloneData.player_viewed_at = null;
    cloneData.selected_prize_details = null;
    cloneData.box_selection_event = null;
    cloneData.is_form_submitted = false;
    cloneData.form_submitted_at = null;
    cloneData.prize_1_approved = false;
    cloneData.prize_2_approved = false;
    cloneData.prize_3_approved = false;
    cloneData.random_opened_box = null;
    cloneData.view_count = 0;
    cloneData.result_event_count = 0;
    cloneData.share_count = 0;
    cloneData.completion_time_seconds = null;
    cloneData.fraud_flag = false;
    cloneData.fraud_reason = null;

    cloneData.server_random_boxes = generateServerRandomBoxes(boxCount);
    cloneData.player_token = generateSecureToken();
    cloneData.server_random_seed = generateSecureToken(256);
    cloneData.result_hash = calculateHash(cloneData.server_random_seed);

    const cloned = await GameSession.create(cloneData);

    await logAuditEvent(cloned.session_code, 'SESSION_CLONE', req, {
      source_session_code: sourceCode,
      cloned_session_code: cloned.session_code,
      box_count: boxCount
    });

    const responseData = cloned.toJSON();
    delete responseData.server_random_boxes;
    delete responseData.player_token;
    delete responseData.server_random_seed;
    delete responseData.result_hash;

    return res.json({
      success: true,
      message: `Đã clone phiên ${sourceCode} thành ${cloned.session_code}`,
      data: responseData,
      source_session_code: sourceCode
    });
  } catch (err) {
    console.error('[cloneSession] error:', err);
    return res.status(500).json({ success: false, message: 'Clone phiên thất bại', error: err.message });
  }
}

module.exports = { list, getByCode, create, update, remove, removeAll, completeSession, paginated, updateSessionWallet, approveSpecialPrize, rejectSpecialPrize, openRandomBox, updateOpeningMode, cloneSession }
