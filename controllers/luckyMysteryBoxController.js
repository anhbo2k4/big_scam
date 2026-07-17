/**
 * Lucky Mystery Box Controller
 * Handles all game logic, box opening, prize claiming, and wallet operations
 */

const { GameSession, Withdrawal, GiftExchange, PlayerInventory, ConversionRequest, SiteSettings } = require('../models');
const { Op, DataTypes } = require('sequelize');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { readSettingsFromDB } = require('./settingsController');
const {
  clampTrustScore,
  getWithdrawalTrustConfig,
  buildWithdrawTrustBlockedMessage
} = require('../utils/withdrawTrustConfig');

// ============================================
// Exchange rate constants
// ============================================
const DEFAULT_EXCHANGE_RATES = {
  VND: 1,        // base
  NDT: 3800,     // 1 ¥ = 3,800 VND
  USD: 26000     // 1 USD = 26,000 VND
};

function sanitizeRate(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return Math.round(num);
}

async function getExchangeRates() {
  try {
    const settings = await readSettingsFromDB();
    const config = settings?.exchangeRates || {};
    return {
      VND: 1,
      USD: sanitizeRate(config.USD, DEFAULT_EXCHANGE_RATES.USD),
      NDT: sanitizeRate(config.NDT, DEFAULT_EXCHANGE_RATES.NDT)
    };
  } catch (_) {
    return { ...DEFAULT_EXCHANGE_RATES };
  }
}

/**
 * Detect currency from prize name or cash amount text.
 * Returns 'VND', 'USD', or 'NDT'.
 */
function detectCurrency(prizeName, cashAmount) {
  const name = String(prizeName || '').toUpperCase();
  if (name.includes('USD') || name.includes('$') || name.includes('ĐÔ LA') || name.includes('DO LA')) return 'USD';
  if (name.includes('NDT') || name.includes('¥') || name.includes('NHÂN DÂN TỆ') || name.includes('TỆ') || name.includes('CNY')) return 'NDT';
  return 'VND';
}

/**
 * Convert an amount to VND using exchange rates.
 */
function toVND(amount, currency, exchangeRates = DEFAULT_EXCHANGE_RATES) {
  const rate = exchangeRates[currency] || 1;
  return Math.round(Number(amount) * rate);
}

const getClientIp = (req) => {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const raw = forwarded || req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '';
  return String(raw || '').replace('::ffff:', '') || 'unknown';
};

const sseChat = require('../services/sseChat');
const sessionTracker = require('../services/sessionTracker');

const emitAdminRealtime = (req, event, payload = {}) => {
  try {
    sseChat.sendAdminEvent(event, payload);
  } catch (err) {
    // Realtime should never break core business flow.
  }
};

const applySessionWalletDeltaAtomic = async (sessionCode, deltaAmount) => {
  const normalizedSessionCode = String(sessionCode || '').trim().toUpperCase();
  const delta = Number(deltaAmount || 0);
  if (!normalizedSessionCode || !Number.isFinite(delta) || delta === 0) {
    return { ok: false, reason: 'invalid_input' };
  }

  const sequelize = Withdrawal.sequelize;
  const tx = await sequelize.transaction();
  try {
    const session = await GameSession.findOne({
      where: { session_code: normalizedSessionCode, is_active: true },
      transaction: tx,
      lock: tx.LOCK.UPDATE
    });

    if (!session) {
      await tx.rollback();
      return { ok: false, reason: 'session_not_found' };
    }

    const convertedRaw = await PlayerInventory.sum('prize_value', {
      where: { session_code: normalizedSessionCode, status: 'converted' },
      transaction: tx
    });
    const convertedTotal = Number(convertedRaw || 0);
    const currentWallet = session.wallet_manual_amount === null || session.wallet_manual_amount === undefined
      ? convertedTotal
      : Number(session.wallet_manual_amount);

    const nextWallet = Number(currentWallet || 0) + delta;
    if (nextWallet < 0) {
      await tx.rollback();
      return {
        ok: false,
        reason: 'insufficient_wallet',
        currentWallet: Number(currentWallet || 0),
        attemptedDelta: delta
      };
    }

    await session.update({ wallet_manual_amount: nextWallet }, { transaction: tx });
    await tx.commit();
    return {
      ok: true,
      previousWallet: Number(currentWallet || 0),
      nextWallet: Number(nextWallet || 0),
      appliedDelta: delta
    };
  } catch (err) {
    try { await tx.rollback(); } catch (_) {}
    throw err;
  }
};

const parseSpecialFlag = (value) => {
  if (value === true || value === 1) return true;
  const normalized = String(value ?? '').toLowerCase();
  return normalized === 'true' || normalized === '1';
};

const normalizeUploadUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw) || /^data:image\//i.test(raw) || /^blob:/i.test(raw)) return raw;
  const normalized = raw.replace(/\\/g, '/').replace(/^\.\//, '');
  if (normalized.startsWith('/public/')) return normalized.replace('/public/', '/');
  if (normalized.startsWith('/public/uploads/')) return normalized.replace('/public/uploads/', '/uploads/');
  if (normalized.startsWith('/uploads/uploads/')) return normalized.replace('/uploads/uploads/', '/uploads/');
  // Keep absolute public paths (e.g. /images/foo.png) intact.
  if (normalized.startsWith('/')) return normalized;
  if (normalized.startsWith('/uploads/')) return normalized;
  if (normalized.startsWith('uploads/')) return `/${normalized}`;

  // Preserve known static asset folders when value is provided without leading slash.
  if (/^(images|img|css|js|homepage-presets|new_homepage|favicon\.ico)(\/|$)/i.test(normalized)) {
    return `/${normalized}`;
  }

  return `/uploads/${normalized.replace(/^\/+/, '')}`;
};

const resolveUploadImageUrl = (value) => {
  const normalized = normalizeUploadUrl(value);
  if (!normalized) return null;
  if (!normalized.startsWith('/uploads/')) return normalized;

  const filename = normalized.replace('/uploads/', '');
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
  const absolutePath = path.join(uploadDir, filename);
  if (fs.existsSync(absolutePath)) return normalized;

  // Recover stale prefixed filename (e.g. old timestamp) by matching original tail name.
  const dashIndex = filename.indexOf('-');
  const tailName = dashIndex >= 0 ? filename.slice(dashIndex + 1) : filename;
  if (!tailName) return null;

  try {
    const candidates = fs.readdirSync(uploadDir)
      .filter((f) => f === tailName || f.endsWith(`-${tailName}`));
    if (!candidates.length) return null;

    const best = candidates
      .map((name) => {
        const stat = fs.statSync(path.join(uploadDir, name));
        return { name, mtime: stat.mtimeMs || 0 };
      })
      .sort((a, b) => b.mtime - a.mtime)[0];

    return best ? `/uploads/${best.name}` : null;
  } catch (_) {
    return null;
  }
};

let ensuredWithdrawalUserNullable = false;

const generateWithdrawalRequestCode = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `WD-${ts}-${rand}`;
};

const getFirstConfiguredBox = (session) => {
  let order = session?.box_positions;
  if (typeof order === 'string') {
    try { order = JSON.parse(order); } catch (_) { order = null; }
  }
  if (!Array.isArray(order) || order.length !== 3) return 1;
  const normalized = [...new Set(order.map((v) => Number(v)).filter((v) => [1, 2, 3].includes(v)))];
  return normalized.length === 3 ? normalized[0] : 1;
};

const ensureWithdrawalUserIdNullable = async () => {
  if (ensuredWithdrawalUserNullable) {
    return;
  }

  try {
    const qi = Withdrawal.sequelize.getQueryInterface();
    await qi.changeColumn('withdrawals', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: true
    });
    ensuredWithdrawalUserNullable = true;
  } catch (_) {
    // Ignore schema-alter errors here; caller will still return a proper API error if create fails.
  }
};

// ============================================
// GET /api/lucky-mystery-box/session?code=XYZ
// ============================================
exports.getSession = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Mã phiên không hợp lệ' });
    }

    const session = await GameSession.findOne({
      where: { session_code: code.toUpperCase() }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Mã phiên không tồn tại' });
    }

    const sessionData = session.toJSON();
    delete sessionData.server_random_boxes;
    delete sessionData.player_token;
    delete sessionData.server_random_seed;
    delete sessionData.result_hash;
    delete sessionData.fraud_flag;
    delete sessionData.fraud_reason;
    delete sessionData.player_ip;

    // Ensure box_positions is always a valid 1-indexed array
    let bp = sessionData.box_positions;
    if (typeof bp === 'string') { try { bp = JSON.parse(bp); } catch (_) { bp = null; } }
    if (!Array.isArray(bp) || bp.length !== 3) bp = [1, 2, 3];
    bp = bp.map(v => parseInt(v, 10)).filter(v => [1, 2, 3].includes(v));
    if (new Set(bp).size !== 3) bp = [1, 2, 3];
    sessionData.box_positions = bp;

    for (let boxNum = 1; boxNum <= 3; boxNum++) {
      const imageKey = `prize_${boxNum}_image_url`;
      sessionData[imageKey] = resolveUploadImageUrl(sessionData[imageKey]);
    }

    let openedNumbers = [];
    try {
      const rawOpened = sessionData.boxes_opened;
      if (typeof rawOpened === 'string') openedNumbers = JSON.parse(rawOpened);
      else if (Array.isArray(rawOpened)) openedNumbers = rawOpened;
      else if (rawOpened && typeof rawOpened === 'object') openedNumbers = rawOpened;
    } catch (_) {
      openedNumbers = [];
    }
    if (!Array.isArray(openedNumbers)) openedNumbers = [];
    openedNumbers = [...new Set(openedNumbers.map((n) => Number(n)).filter((n) => [1, 2, 3].includes(n)))];

    // Backward compatibility for legacy rows that only stored player_selected_box.
    if (!openedNumbers.length && session.player_selected_box !== null && session.player_selected_box !== undefined) {
      const legacyBox = Number(session.player_selected_box);
      if ([1, 2, 3].includes(legacyBox)) openedNumbers = [legacyBox];
    }

    res.json({
      success: true,
      data: {
        ...sessionData,
        hasOpened: openedNumbers.length > 0,
        boxes_opened: openedNumbers,
        boxesOpenedCount: openedNumbers.length
      }
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// POST /api/lucky-mystery-box/join
// ============================================
exports.joinSession = async (req, res, next) => {
  try {
    const { sessionCode } = req.body;
    if (!sessionCode || typeof sessionCode !== 'string') {
      return res.status(400).json({ success: false, message: 'Mã phiên không hợp lệ' });
    }

    const session = await GameSession.findOne({
      where: { session_code: sessionCode.toUpperCase(), is_active: true }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Mã phiên không tồn tại' });
    }

    const currentIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || null;

    const updateData = {
      view_count: (session.view_count || 0) + 1,
      player_viewed_at: new Date(),
      player_ip: session.player_ip || currentIp,
      player_user_agent: session.player_user_agent || userAgent
    };

    // Record first-join timestamp if not already set
    if (!session.player_joined_at) {
      updateData.player_joined_at = new Date();
    }

    // Generate player token on first join
    if (!session.player_token) {
      updateData.player_token = require('crypto').randomBytes(32).toString('hex');
    }

    await session.update(updateData);

    // Broadcast join event to admins via SSE
    sseChat.sendAdminEvent('player_joined', {
      sessionCode: session.session_code,
      playerIp: String(currentIp || '').replace('::ffff:', ''),
      userAgent,
      joinedAt: updateData.player_joined_at || session.player_joined_at,
      viewCount: updateData.view_count
    });

    req.session.sessionCode = sessionCode.toUpperCase();
    sessionTracker.touchSession(req, {
      force: true,
      gameSessionCode: session.session_code,
      sessionType: 'game',
      metadata: {
        source: 'lucky_mystery_box_join'
      }
    }).catch(() => {});

    res.json({ success: true, data: { sessionCode: session.session_code } });
  } catch (err) {
    next(err);
  }
};

// ============================================
// POST /api/lucky-mystery-box/:sessionCode/select-box
// ============================================
exports.selectBox = async (req, res, next) => {
  try {
    const { sessionCode, boxNumber } = req.body;
    const validatedSession = req.validatedSession;

    if (!validatedSession) {
      return res.status(400).json({ success: false, message: 'Phiên không hợp lệ' });
    }

    const winningBox = boxNumber;

    const normalizedSessionCode = sessionCode.toUpperCase();

    // ✅ NEW: Track multiple boxes opened
    let boxesOpened = [];
    try {
      if (validatedSession.boxes_opened) {
        const rawValue = validatedSession.boxes_opened;
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
    } catch (e) {
      boxesOpened = [];
    }

    // Prevent duplicate opens if inventory already exists
    const existingInventory = await PlayerInventory.findOne({
      where: { session_code: normalizedSessionCode, box_number: winningBox }
    });
    if (existingInventory) {
      return res.status(403).json({
        success: false,
        message: `Hộp #${winningBox} đã được mở rồi`
      });
    }

    // Add current box to array
    if (!boxesOpened.includes(winningBox)) {
      boxesOpened.push(winningBox);
    }

    const prizeDetails = {
      name: validatedSession[`prize_${winningBox}`] || 'Quà tặng',
      description: validatedSession[`prize_${winningBox}_description`] || '',
      icon: validatedSession[`prize_${winningBox}_icon`] || '🎁',
      imageUrl: validatedSession[`prize_${winningBox}_image_url`],
      isCash: validatedSession[`prize_${winningBox}_cash`] === true || validatedSession[`prize_${winningBox}_cash`] === 1,
      cashAmount: validatedSession[`prize_${winningBox}_cash_amount`] || 0,
      isSpecial: validatedSession[`prize_${winningBox}_is_special`] === true || validatedSession[`prize_${winningBox}_is_special`] === 1,
      rarity: validatedSession[`prize_${winningBox}_rarity`] || 'NORMAL',
      colorHex: validatedSession[`prize_${winningBox}_color_hex`],
      status: validatedSession[`prize_${winningBox}_status`] || 'NORMAL'
    };

    prizeDetails.imageUrl = resolveUploadImageUrl(prizeDetails.imageUrl);

    if (prizeDetails.isSpecial) {
      const boxOpenedField = `box_${winningBox}_opened`;
      const updateData = {
        special_prize_pending: true,
        pending_box_number: winningBox,
        boxes_opened: JSON.stringify(boxesOpened),
        player_selected_box: winningBox,
        player_selected_at: new Date(),
        opened_at: new Date(),
        is_completed: boxesOpened.length >= 3,
        box_selection_event: JSON.stringify({
          winningBox, clientBoxNumber: boxNumber, ip: req.ip,
          userAgent: req.get('user-agent'), timestamp: new Date().toISOString()
        })
      };
      updateData[boxOpenedField] = true;

      const resultHash = crypto
        .createHash('sha256')
        .update(validatedSession.session_code + winningBox + prizeDetails.name + (validatedSession.server_random_seed || ''))
        .digest('hex');
      updateData.result_hash = resultHash;

      await validatedSession.update(updateData);

      // Save to player inventory for special prizes too
      const specialCurrency = validatedSession.currency || detectCurrency(prizeDetails.name, prizeDetails.cashAmount);
      try {
        if (PlayerInventory) {
          await PlayerInventory.create({
            session_code: normalizedSessionCode,
            box_number: winningBox,
            prize_name: prizeDetails.name,
            prize_description: prizeDetails.description,
            prize_icon: prizeDetails.icon,
            prize_image: prizeDetails.imageUrl,
            prize_value: prizeDetails.cashAmount || 0,
            is_cash: prizeDetails.isCash,
            is_special: true,
            rarity: prizeDetails.rarity,
            color_hex: prizeDetails.colorHex,
            status: 'pending_approval',
            currency: specialCurrency
          });
        }
      } catch (invErr) {
      }

      emitAdminRealtime(req, 'new_gift', {
        session_code: normalizedSessionCode,
        box_number: winningBox,
        prize_name: prizeDetails.name,
        prize_value: Number(prizeDetails.cashAmount || 0) || 0,
        currency: specialCurrency,
        status: 'pending_approval',
        request_type: 'special_prize_approval'
      });

      return res.json({
        success: true, won: true, requiresApproval: true,
        message: 'Phần thưởng này cần xác nhận từ admin',
        prize: {
          name: prizeDetails.name,
          description: prizeDetails.description,
          icon: prizeDetails.icon,
          image: prizeDetails.imageUrl,
          value: prizeDetails.cashAmount || 0,
          isCash: prizeDetails.isCash,
          isSpecial: true,
          rarity: prizeDetails.rarity,
          colorHex: prizeDetails.colorHex,
          level: prizeDetails.status,
          currency: specialCurrency
        },
        openedBox: winningBox,
        boxesOpenedCount: boxesOpened.length,
        currency: specialCurrency
      });
    }

    const boxOpenedField = `box_${winningBox}_opened`;
    const updateData = {
      selected_prize_details: JSON.stringify(prizeDetails),
      boxes_opened: JSON.stringify(boxesOpened),  // ✅ Track opened boxes
      player_selected_box: winningBox,
      player_selected_at: new Date(),
      opened_at: new Date(),
      is_completed: boxesOpened.length >= 3,  // ✅ Complete when all 3 opened
      result_event_count: (validatedSession.result_event_count || 0) + 1,
      box_selection_event: JSON.stringify({
        selected_box: winningBox,
        winningBox, clientBoxNumber: boxNumber, ip: req.ip,
        userAgent: req.get('user-agent'), timestamp: Date.now()
      })
    };

    updateData[boxOpenedField] = true;

    const resultHash = crypto
      .createHash('sha256')
      .update(validatedSession.session_code + winningBox + prizeDetails.name + (validatedSession.server_random_seed || ''))
      .digest('hex');

    updateData.result_hash = resultHash;
    await validatedSession.update(updateData);

    const sessionCurrency = validatedSession.currency || detectCurrency(prizeDetails.name, prizeDetails.cashAmount);
    const normalizedSessionCurrency = String(sessionCurrency || 'VND').toUpperCase();
    const firstConfiguredBox = getFirstConfiguredBox(validatedSession);
    const requiresSpecialApproval = parseSpecialFlag(validatedSession[`prize_${winningBox}_is_special`]);
    const shouldAutoConvertFirstCash =
      Number(winningBox) === Number(firstConfiguredBox)
      && normalizedSessionCurrency === 'VND'
      && !requiresSpecialApproval
      && prizeDetails.isCash
      && Number(prizeDetails.cashAmount || 0) > 0
      && String(prizeDetails.status || '').toUpperCase() !== 'UNLUCKY';

    // ✅ Save to player inventory
    try {
      if (PlayerInventory) {
        const isUnlucky = prizeDetails.status === 'UNLUCKY';
        const inventoryStatus = isUnlucky
          ? 'claimed'
          : (shouldAutoConvertFirstCash ? 'converted' : 'obtained');

        await PlayerInventory.create({
          session_code: normalizedSessionCode,
          box_number: winningBox,
          prize_name: prizeDetails.name,
          prize_description: prizeDetails.description,
          prize_icon: prizeDetails.icon,
          prize_image: prizeDetails.imageUrl,
          prize_value: prizeDetails.cashAmount || 0,
          is_cash: prizeDetails.isCash,
          is_special: prizeDetails.isSpecial,
          rarity: prizeDetails.rarity,
          color_hex: prizeDetails.colorHex,
          status: inventoryStatus,
          currency: sessionCurrency
        });

        if (shouldAutoConvertFirstCash) {
          await ConversionRequest.create({
            session_code: normalizedSessionCode,
            box_number: winningBox,
            prize_name: prizeDetails.name,
            amount: Math.round(Number(prizeDetails.cashAmount || 0)),
            status: 'approved',
            currency: sessionCurrency || 'VND',
            exchange_rate: 1,
            amount_vnd: Math.round(Number(prizeDetails.cashAmount || 0)),
            requested_by: validatedSession.player_name || 'Khách hàng',
            requested_at: new Date(),
            approved_at: new Date(),
            notes: `Tự động cộng ví từ quà tiền hộp đầu tiên #${winningBox}`
          });

          // Keep manual wallet in sync when this session uses wallet_manual_amount.
          if (validatedSession.wallet_manual_amount !== null && validatedSession.wallet_manual_amount !== undefined) {
            const manualCurrent = Number(validatedSession.wallet_manual_amount) || 0;
            const autoCredited = Math.max(0, Math.round(Number(prizeDetails.cashAmount || 0) || 0));
            await validatedSession.update({ wallet_manual_amount: manualCurrent + autoCredited });
          }
        }
      }
    } catch (invErr) {
    }

    res.json({
      success: true,
      won: true,
      prize: {
        name: prizeDetails.name,
        description: prizeDetails.description,
        icon: prizeDetails.icon,
        image: prizeDetails.imageUrl,
        value: prizeDetails.cashAmount || 0,
        isCash: prizeDetails.isCash,
        isSpecial: prizeDetails.isSpecial,
        rarity: prizeDetails.rarity,
        colorHex: prizeDetails.colorHex,
        level: prizeDetails.status,
        currency: sessionCurrency
      },
      openedBox: winningBox,
      boxesOpenedCount: boxesOpened.length,
      autoConverted: shouldAutoConvertFirstCash,
      requiresWithdrawalApprovalBeforeNext: shouldAutoConvertFirstCash,
      currency: sessionCurrency
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// POST /api/lucky-mystery-box/:sessionCode/claim
// ============================================
exports.claimItem = async (req, res, next) => {
  try {
    // Get sessionCode from URL params or fallback to body
    const sessionCode = req.params.sessionCode || req.body.sessionCode;
    const { name, phone, address, city, note, boxNumber } = req.body;

    if (!sessionCode || !name || !phone || !address || !city) {
      const missing = [];
      if (!sessionCode) missing.push('sessionCode');
      if (!name) missing.push('name');
      if (!phone) missing.push('phone');
      if (!address) missing.push('address');
      if (!city) missing.push('city');
      
      return res.status(400).json({ 
        success: false, 
        message: `Vui lòng điền đầy đủ thông tin: ${missing.join(', ')}` 
      });
    }

    const normalizedSessionCode = sessionCode.toUpperCase();
    const requestIp = getClientIp(req);
    const session = await GameSession.findOne({
      where: { session_code: normalizedSessionCode, is_active: true }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Phiên không tồn tại' });
    }

    const sessionTrustScore = clampTrustScore(session.trust_score, 100);
    const { minTrustScoreForWithdrawal } = await getWithdrawalTrustConfig({ SiteSettings });
    const canWithdrawByTrust = sessionTrustScore >= minTrustScoreForWithdrawal;
    const trustBlockMessage = canWithdrawByTrust
      ? null
      : buildWithdrawTrustBlockedMessage(sessionTrustScore, minTrustScoreForWithdrawal);

    const resolvedBoxNum = boxNumber || session.player_selected_box;
    if (!resolvedBoxNum || resolvedBoxNum < 1 || resolvedBoxNum > 3) {
      return res.status(400).json({ success: false, message: 'Hộp không hợp lệ' });
    }

    const boxNum = resolvedBoxNum;
    const isSpecialField = `prize_${boxNum}_is_special`;
    const sessionRequiresSpecialApproval = parseSpecialFlag(session[isSpecialField]);
    const inventoryItem = await PlayerInventory.findOne({
      where: { session_code: normalizedSessionCode, box_number: boxNum }
    });

    if (!inventoryItem) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phần quà trong kho' });
    }

    if (!sessionRequiresSpecialApproval && inventoryItem.is_special) {
      const staleApprovalStatus = ['pending_approval', 'confirmed', 'rejected'].includes(String(inventoryItem.status || '').toLowerCase());
      if (staleApprovalStatus) {
        await inventoryItem.update({ is_special: false, status: 'obtained' });
      }
    }

    if (inventoryItem.status !== 'obtained') {
      return res.status(400).json({ success: false, message: 'Phần quà này đã được xử lý' });
    }
    
    // ✅ CHECK IF PRIZE IS UNLUCKY - CANNOT CLAIM
    const prizeStatus = session[`prize_${boxNum}_status`] || 'NORMAL';
    if (prizeStatus === 'UNLUCKY') {
      return res.status(400).json({ 
        success: false, 
        message: '💔 Phần thưởng xui lỗi! Không thể nhận phần thưởng này. Phần thưởng này bị mất rồi!' 
      });
    }
    
    const cashField = `prize_${boxNum}_cash`;
    const prizeNameField = `prize_${boxNum}`;
    const createdAtField = `prize_${boxNum}_created_at`;

    if (!session[prizeNameField]) {
      return res.status(400).json({ success: false, message: `Bạn chưa có giải thưởng hợp lệ ở hộp ${boxNum}` });
    }

    await session.update({
      player_name: name,
      player_phone: phone,
      player_email: req.body.email,
      form_submitted_at: new Date(),
      is_form_submitted: true
    });

    const prizeDetails = {
      name: inventoryItem.prize_name,
      description: inventoryItem.prize_description,
      icon: inventoryItem.prize_icon,
      image: inventoryItem.prize_image,
      value: inventoryItem.prize_value,
      isCash: inventoryItem.is_cash,
      isSpecial: inventoryItem.is_special,
      rarity: inventoryItem.rarity,
      colorHex: inventoryItem.color_hex
    };
    const confirmationCode = `LMB${Date.now().toString().slice(-6)}`;
    const prizeField = `prize_${boxNum}`;

    const createdGiftExchange = await GiftExchange.create({
      user_id: null,
      session_code: normalizedSessionCode,
      selected_box_number: boxNum,
      prize_name: prizeDetails.name || session[prizeField],
      recipient_name: name,
      phone: phone,
      address: address,
      notes: note,
      prize_info: {
        ...prizeDetails,
        confirmation_code: confirmationCode,
        is_special: session[isSpecialField] || false,
        created_at: session[createdAtField]
      },
      status: session[isSpecialField] ? 'pending_approval' : 'pending',
      player_contact: {
        name,
        phone,
        email: req.body.email,
        city,
        ip_address: requestIp
      }
    });

    emitAdminRealtime(req, 'new_gift', {
      id: createdGiftExchange.id,
      session_code: normalizedSessionCode,
      status: createdGiftExchange.status || 'pending'
    });

    await inventoryItem.update({
      status: 'claimed',
      claimed_at: new Date()
    });

    res.json({
      success: true,
      message: 'Xác nhận đã lưu. Hàng sẽ sớm được giao đến bạn!!!.',
      data: {
        giftExchangeId: createdGiftExchange.id,
        confirmationCode,
        sessionCode: normalizedSessionCode
      }
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: 'Lỗi: ' + (err.message || 'Không thể xử lý yêu cầu')
    });
  }
};

// ============================================
// POST /api/lucky-mystery-box/:sessionCode/convert
// ============================================
exports.convertToMoney = async (req, res, next) => {
  try {
    const { sessionCode } = req.params;
    if (!sessionCode || typeof sessionCode !== 'string' || !sessionCode.trim()) {
      return res.status(400).json({ success: false, message: 'Thiếu mã phiên hợp lệ' });
    }
    const { boxNumber } = req.body;
    const isDecline = req.body?.decline === true || req.body?.action === 'decline';
    const normalizedSessionCode = sessionCode.trim().toUpperCase();

    const session = await GameSession.findOne({
      where: { session_code: normalizedSessionCode, is_active: true }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Phiên không tồn tại' });
    }

    if (!boxNumber || boxNumber < 1 || boxNumber > 3) {
      return res.status(400).json({ success: false, message: 'Hộp không hợp lệ' });
    }

    const boxNum = boxNumber;
    const isSpecialField = `prize_${boxNum}_is_special`;
    const sessionRequiresSpecialApproval = parseSpecialFlag(session[isSpecialField]);
    const inventoryItem = await PlayerInventory.findOne({
      where: { session_code: normalizedSessionCode, box_number: boxNum }
    });

    if (!inventoryItem) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phần quà trong kho' });
    }

    if (!sessionRequiresSpecialApproval && inventoryItem.is_special) {
      const staleApprovalStatus = ['pending_approval', 'confirmed', 'rejected'].includes(String(inventoryItem.status || '').toLowerCase());
      if (staleApprovalStatus) {
        await inventoryItem.update({ is_special: false, status: 'obtained' });
      }
    }

    const existingConversion = await ConversionRequest.findOne({
      where: {
        session_code: normalizedSessionCode,
        box_number: boxNum,
        status: { [Op.in]: ['approved', 'pending'] }
      },
      order: [['requested_at', 'DESC'], ['createdAt', 'DESC']]
    });

    // Special prizes must be confirmed by admin before converting/declining
    if (sessionRequiresSpecialApproval && inventoryItem.is_special) {
      if (inventoryItem.status === 'pending_approval') {
        return res.status(400).json({ success: false, message: 'Phần quà đang chờ admin duyệt' });
      }
      if (inventoryItem.status === 'declined') {
        return res.status(400).json({ success: false, message: 'Bạn đã từ chối phần quà này' });
      }
      if (inventoryItem.status === 'converted') {
        return res.status(400).json({ success: false, message: 'Phần quà đã được quy đổi rồi' });
      }
      if (inventoryItem.status === 'rejected') {
        return res.status(400).json({ success: false, message: 'Phần quà đã bị admin từ chối' });
      }
      if (inventoryItem.status !== 'confirmed') {
        return res.status(400).json({ success: false, message: 'Phần quà chưa được admin duyệt' });
      }
    } else {
      if (inventoryItem.status === 'converted' && existingConversion && existingConversion.status === 'approved') {
        const normalizedCurrency = String(existingConversion.currency || inventoryItem.currency || session.currency || 'VND').toUpperCase();
        const amountVnd = Math.max(
          0,
          Number(existingConversion.amount_vnd || 0)
          || Number(existingConversion.amount || 0)
          || Number(inventoryItem.prize_value || 0)
        );

        return res.json({
          success: true,
          pendingApproval: false,
          instant: true,
          alreadyApproved: true,
          message: 'Phần quà này đã quy đổi trước đó. Hệ thống đã đồng bộ lại số dư.',
          cashAmount: Math.max(0, Number(existingConversion.amount || inventoryItem.prize_value || 0)),
          amountVND: amountVnd,
          currency: normalizedCurrency,
          boxNumber: boxNum,
          prizeName: inventoryItem.prize_name || 'Quà tặng'
        });
      }

      if (inventoryItem.status === 'exchanged' && existingConversion && existingConversion.status === 'pending') {
        return res.status(400).json({ success: false, message: 'Phần quà này đang chờ duyệt quy đổi' });
      }

      if (inventoryItem.status !== 'obtained') {
        return res.status(400).json({ success: false, message: 'Phần quà này đã được xử lý' });
      }
    }
    
    // ✅ CHECK IF PRIZE IS UNLUCKY - CANNOT EXCHANGE
    const prizeStatus = session[`prize_${boxNum}_status`] || 'NORMAL';
    if (prizeStatus === 'UNLUCKY') {
      return res.status(400).json({ 
        success: false, 
        message: '💔 Phần thưởng xui lỗi! Không thể đổi sang tiền mặt. Phần thưởng này bị mất rồi!' 
      });
    }
    let prizeDetails = null;
    let cashAmount = 0;
    let prizeName = 'Quà tặng';

    // Try to get prize from selected_prize_details JSON first
    if (inventoryItem) {
      prizeDetails = {
        isCash: inventoryItem.is_cash,
        cashAmount: parseInt(inventoryItem.prize_value) || 0,
        name: inventoryItem.prize_name
      };
      cashAmount = prizeDetails.cashAmount || 0;
      prizeName = prizeDetails.name || 'Quà tặng';
    }

    // If still no cash amount, check for it in prize data fields at current box
    if (!prizeDetails || cashAmount === 0) {
      const prizeNum = boxNum;
      const cashAmountField = session[`prize_${prizeNum}_cash_amount`] || 0;
      const fallbackName = session[`prize_${prizeNum}`] || 'Quà tặng';

      if (cashAmountField > 0) {
        cashAmount = cashAmountField;
        prizeDetails = {
          isCash: true,
          cashAmount: cashAmountField,
          name: fallbackName
        };
      }
    }


    if (cashAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Số tiền không hợp lệ' });
    }

    if (existingConversion) {
      if (existingConversion.status === 'approved') {
        // Idempotent self-heal for legacy rows where ConversionRequest was approved
        // but PlayerInventory status did not get updated to converted.
        if (inventoryItem.status !== 'converted') {
          await inventoryItem.update({
            status: 'converted',
            claimed_at: inventoryItem.claimed_at || new Date(),
            prize_value: Math.max(0, Number(inventoryItem.prize_value || cashAmount || 0)),
            currency: inventoryItem.currency || session.currency || detectCurrency(prizeName, cashAmount)
          });
        }

        const normalizedCurrency = String(existingConversion.currency || inventoryItem.currency || session.currency || detectCurrency(prizeName, cashAmount) || 'VND').toUpperCase();
        const amountVnd = Math.max(
          0,
          Number(existingConversion.amount_vnd || 0)
          || Number(existingConversion.amount || 0)
          || Number(cashAmount || 0)
        );

        return res.json({
          success: true,
          pendingApproval: false,
          instant: true,
          alreadyApproved: true,
          message: 'Phần quà này đã quy đổi trước đó. Hệ thống đã đồng bộ lại số dư.',
          cashAmount: Math.max(0, Number(existingConversion.amount || cashAmount || 0)),
          amountVND: amountVnd,
          currency: normalizedCurrency,
          boxNumber: boxNum,
          prizeName
        });
      }

      return res.status(400).json({ success: false, message: 'Phần quà này đang chờ duyệt quy đổi' });
    }

    // Detect currency from session, inventory, or prize name
    const currency = session.currency || inventoryItem.currency || detectCurrency(prizeName, cashAmount);

    // NDT must go through admin approval; do not allow direct decline to bypass review.
    if (isDecline && currency === 'NDT') {
      return res.status(400).json({
        success: false,
        message: 'Phần thưởng NDT bắt buộc gửi admin duyệt trước khi xử lý.'
      });
    }

    if (isDecline) {
      // Update inventory status to declined
      await inventoryItem.update({ status: 'declined' });

      return res.json({
        success: true,
        declined: true,
        message: 'Đã từ chối quy đổi. Bạn có thể mở hộp tiếp theo.',
        cashAmount,
        boxNumber: boxNum,
        prizeName
      });
    }

    const exchangeRates = await getExchangeRates();
    const exchangeRate = exchangeRates[currency] || 1;
    const amountVND = toVND(cashAmount, currency, exchangeRates);

    // Mark session as exchanged
    await session.update({ is_exchanged: true, exchanged_at: new Date() });

    if (currency === 'VND') {
      // ============ VND: auto-approve, add to wallet immediately ============
      await inventoryItem.update({
        status: 'converted',
        claimed_at: new Date(),
        prize_value: Math.round(cashAmount),
        currency: 'VND'
      });

      await ConversionRequest.create({
        session_code: normalizedSessionCode,
        box_number: boxNum,
        prize_name: prizeName,
        amount: Math.round(cashAmount),
        status: 'approved',
        currency: 'VND',
        exchange_rate: 1,
        amount_vnd: Math.round(cashAmount),
        requested_by: session.player_name || 'Khách hàng',
        requested_at: new Date(),
        approved_at: new Date(),
        notes: `Quy đổi VND ngay từ hộp #${boxNum}`
      });

      // Keep manual wallet in sync when this session uses wallet_manual_amount.
      if (session.wallet_manual_amount !== null && session.wallet_manual_amount !== undefined) {
        const manualCurrent = Number(session.wallet_manual_amount) || 0;
        const convertedNow = Math.max(0, Math.round(Number(cashAmount) || 0));
        await session.update({ wallet_manual_amount: manualCurrent + convertedNow });
      }

      return res.json({
        success: true,
        pendingApproval: false,
        instant: true,
        message: `Đã quy đổi ${cashAmount.toLocaleString('vi-VN')} VND vào ví phiên.`,
        cashAmount,
        amountVND: Math.round(cashAmount),
        currency: 'VND',
        boxNumber: boxNum,
        prizeName
      });
    } else {
      // ============ USD / NDT: create PENDING request, require CSKH contact ============
      await inventoryItem.update({
        status: 'exchanged',
        currency: currency
      });

      await ConversionRequest.create({
        session_code: normalizedSessionCode,
        box_number: boxNum,
        prize_name: prizeName,
        amount: Math.round(cashAmount),
        status: 'pending',
        currency: currency,
        exchange_rate: exchangeRate,
        amount_vnd: amountVND,
        requested_by: session.player_name || 'Khách hàng',
        requested_at: new Date(),
        notes: `Chờ duyệt quy đổi ${currency} từ hộp #${boxNum} (tỷ giá 1 ${currency} = ${exchangeRate.toLocaleString('vi-VN')} VND)`
      });

      emitAdminRealtime(req, 'new_conversion_request', {
        session_code: normalizedSessionCode,
        box_number: boxNum,
        prize_name: prizeName,
        amount: Math.round(cashAmount),
        amount_vnd: amountVND,
        currency,
        status: 'pending'
      });

      const currencySymbol = currency === 'USD' ? '$' : '¥';

      return res.json({
        success: true,
        pendingApproval: true,
        instant: false,
        message: `Yêu cầu quy đổi ${currencySymbol}${cashAmount.toLocaleString('vi-VN')} ${currency} đã được gửi. Vui lòng liên hệ CSKH để hoàn tất.`,
        cashAmount,
        amountVND,
        currency,
        exchangeRate,
        boxNumber: boxNum,
        prizeName
      });
    }
  } catch (err) {
    next(err);
  }
};

// ============================================
// GET /api/lucky-mystery-box/:sessionCode/wallet
// ============================================
exports.getWallet = async (req, res, next) => {
  try {
    const { sessionCode } = req.params;
    const normalizedSessionCode = sessionCode.toUpperCase();

    const session = await GameSession.findOne({
      where: { session_code: normalizedSessionCode, is_active: true }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Phiên không tồn tại' });
    }

    const totalConvertedRaw = await PlayerInventory.sum('prize_value', {
      where: { session_code: normalizedSessionCode, status: 'converted' }
    }) || 0;
    const totalConverted = Number(totalConvertedRaw) || 0;
    const manualWalletAmount = session.wallet_manual_amount === null || session.wallet_manual_amount === undefined
      ? null
      : Number(session.wallet_manual_amount);
    const hasManualWallet = manualWalletAmount !== null && Number.isFinite(manualWalletAmount);
    const walletTotal = hasManualWallet ? Math.max(0, manualWalletAmount) : totalConverted;
    const sessionTrustScore = clampTrustScore(session.trust_score, 100);
    const { minTrustScoreForWithdrawal } = await getWithdrawalTrustConfig({ SiteSettings });
    const canWithdrawByTrust = sessionTrustScore >= minTrustScoreForWithdrawal;
    const trustBlockMessage = canWithdrawByTrust
      ? null
      : buildWithdrawTrustBlockedMessage(sessionTrustScore, minTrustScoreForWithdrawal);

    const pendingConversions = await ConversionRequest.findAll({
      where: { session_code: normalizedSessionCode, status: 'pending' },
      attributes: ['id', 'amount', 'status', 'requested_at', 'approved_at', 'box_number', 'prize_name', 'currency', 'exchange_rate', 'amount_vnd'],
      order: [['requested_at', 'DESC']],
      limit: 20
    });

    const pendingConversionAmount = pendingConversions.reduce(
      (sum, item) => sum + (Number(item.amount_vnd || item.amount) || 0),
      0
    );

    // Get all withdrawals for this session
    const withdrawals = await Withdrawal.findAll({
      where: { session_code: normalizedSessionCode },
      attributes: ['id', 'amount', 'status', 'requested_at', 'approved_at', 'prize_value', 'box_selection_snapshot'],
      order: [['requested_at', 'DESC']],
      limit: 20
    });

    if (walletTotal <= 0 && pendingConversionAmount <= 0 && withdrawals.length === 0) {
      return res.json({
        success: true,
        data: {
          balance: 0,
          total: 0,
          withdrawn: 0,
          pending: 0,
          pending_conversion: 0,
          conversion_transactions: [],
          transactions: [],
          status: 'not_exchanged',
          trust_score: sessionTrustScore,
          min_trust_score_for_withdrawal: minTrustScoreForWithdrawal,
          can_withdraw_by_trust: canWithdrawByTrust,
          trust_block_message: trustBlockMessage
        }
      });
    }

    const approvedWithdrawn = withdrawals
      .filter(w => w.status === 'approved')
      .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

    const pendingWithdrawn = withdrawals
      .filter(w => w.status === 'pending')
      .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

    const balance = Number(walletTotal) || 0;
    // For legacy sessions without manual wallet snapshot, reserve both pending and approved withdrawals.
    // For manual wallet sessions, requests are deducted at creation time in wallet_manual_amount.
    const used = hasManualWallet ? 0 : (approvedWithdrawn + pendingWithdrawn);
    const withdrawn = approvedWithdrawn;
    const remaining = Math.max(0, balance - used);

    // Format transactions for display
    const withdrawalTransactions = withdrawals.map(w => ({
      id: w.id,
      amount: Number(w.amount) || 0,
      type: 'withdraw',
      status: w.status,
      requestedAt: w.requested_at,
      approvedAt: w.approved_at,
      withdrawalCode: w?.box_selection_snapshot?.request_code || null,
      supportHint: w?.box_selection_snapshot?.support_hint || null,
      statusText: w.status === 'approved' ? '✅ Đã duyệt' : w.status === 'pending' ? '⏳ Chờ duyệt' : '❌ Từ chối'
    }));

    const conversionTransactions = pendingConversions.map(c => ({
      id: `conversion_${c.id}`,
      rawId: c.id,
      amount: Number(c.amount) || 0,
      amountVND: Number(c.amount_vnd || c.amount) || 0,
      currency: c.currency || 'VND',
      exchangeRate: Number(c.exchange_rate) || 1,
      type: 'conversion_pending',
      status: c.status,
      requestedAt: c.requested_at,
      approvedAt: c.approved_at,
      boxNumber: c.box_number,
      prizeName: c.prize_name,
      statusText: '⏳ Chờ duyệt quy đổi vào ví'
    }));

    const transactions = [...conversionTransactions, ...withdrawalTransactions].sort((a, b) => {
      const ta = new Date(a.requestedAt || 0).getTime();
      const tb = new Date(b.requestedAt || 0).getTime();
      return tb - ta;
    });

    res.json({
      success: true,
      data: {
        balance: balance,  // ✅ Total amount from prize conversion
        withdrawn: withdrawn,
        remaining: remaining,
        used: used,
        pending: pendingWithdrawn,
        pending_conversion: pendingConversionAmount,
        conversion_transactions: conversionTransactions,
        transactions: transactions,
        cashSourceFrom: hasManualWallet ? 'admin_manual' : 'session_prize_field',
        trust_score: sessionTrustScore,
        min_trust_score_for_withdrawal: minTrustScoreForWithdrawal,
        can_withdraw_by_trust: canWithdrawByTrust,
        trust_block_message: trustBlockMessage
      }
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// GET /api/lucky-mystery-box/:sessionCode/transactions
// ============================================
exports.getTransactions = async (req, res, next) => {
  try {
    const { sessionCode } = req.params;
    const normalizedSessionCode = sessionCode.toUpperCase();
    const { filter } = req.query;

    const session = await GameSession.findOne({
      where: { session_code: normalizedSessionCode, is_active: true }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Phiên không tồn tại' });
    }

    let where = { session_code: normalizedSessionCode };

    if (filter === 'approved') {
      where.status = 'approved';
    } else if (filter === 'pending') {
      where.status = 'pending';
    } else if (filter === 'rejected') {
      where.status = 'rejected';
    }

    const withdrawalRows = await Withdrawal.findAll({
      where: where,
      attributes: ['id', 'amount', 'status', 'withdrawal_type', 'requested_at', 'approved_at', 'approved_by', 'rejection_reason', 'box_selection_snapshot'],
      order: [['requested_at', 'DESC']],
      limit: 50
    });

    const conversionWhere = { session_code: normalizedSessionCode };
    if (filter === 'pending') {
      conversionWhere.status = 'pending';
    } else if (filter === 'approved') {
      conversionWhere.status = 'approved';
    } else if (filter === 'rejected') {
      conversionWhere.status = 'rejected';
    }

    const conversionRows = await ConversionRequest.findAll({
      where: conversionWhere,
      attributes: ['id', 'amount', 'status', 'requested_at', 'approved_at', 'approved_by', 'box_number', 'prize_name', 'rejection_reason'],
      order: [['requested_at', 'DESC']],
      limit: 50
    });

    const formattedWithdrawals = withdrawalRows.map(t => ({
      id: t.id,
      amount: t.amount,
      status: t.status,
      type: 'withdraw',
      requestedAt: t.requested_at,
      approvedAt: t.approved_at,
      approvedBy: t.approved_by,
      withdrawalCode: t?.box_selection_snapshot?.request_code || null,
      supportHint: t?.box_selection_snapshot?.support_hint || null,
      rejectionReason: t.rejection_reason || null
    }));

    const formattedConversions = conversionRows.map(t => ({
      id: `conversion_${t.id}`,
      rawId: t.id,
      amount: t.amount,
      status: t.status,
      type: t.status === 'approved' ? 'conversion_approved' : t.status === 'rejected' ? 'conversion_rejected' : 'conversion_pending',
      requestedAt: t.requested_at,
      approvedAt: t.approved_at,
      approvedBy: t.approved_by,
      boxNumber: t.box_number,
      prizeName: t.prize_name,
      rejectionReason: t.rejection_reason || null
    }));

    const formatted = [...formattedConversions, ...formattedWithdrawals].sort((a, b) => {
      const ta = new Date(a.requestedAt || 0).getTime();
      const tb = new Date(b.requestedAt || 0).getTime();
      return tb - ta;
    });

    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

// ============================================
// GET /api/lucky-mystery-box/:sessionCode/inventory
// ============================================
exports.getInventory = async (req, res, next) => {
  try {
    const { sessionCode } = req.params;
    const normalizedSessionCode = sessionCode.toUpperCase();

    const session = await GameSession.findOne({
      where: { session_code: normalizedSessionCode, is_active: true }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Phiên không tồn tại' });
    }

    const inventory = await GiftExchange.findAll({
      where: { session_code: normalizedSessionCode },
      attributes: ['id', 'selected_box_number', 'prize_name', 'recipient_name', 'phone', 'address', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    const formatted = inventory.map(item => ({
      id: item.id,
      boxNumber: item.selected_box_number,
      prizeName: item.prize_name,
      recipientName: item.recipient_name,
      phone: item.phone,
      address: item.address,
      status: item.status,
      createdAt: item.createdAt
    }));

    res.json({
      success: true,
      data: formatted,
      total: inventory.length
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// POST /api/lucky-mystery-box/:sessionCode/withdraw
// ============================================
exports.requestWithdrawal = async (req, res, next) => {
  try {
    const { sessionCode } = req.params;
    if (!sessionCode || typeof sessionCode !== 'string' || !sessionCode.trim()) {
      return res.status(400).json({ success: false, message: 'Thiếu mã phiên hợp lệ' });
    }
    const normalizedSessionCode = sessionCode.trim().toUpperCase();
    const requestIp = getClientIp(req);
    const { bankName, accountNumber, accountHolder, amount, customerName, customerPhone, customerEmail, boxNumber } = req.body;
    // Default withdraw_method to 'bank_transfer' — the game form only supports bank transfers
    const withdraw_method = String(req.body?.withdraw_method || 'bank_transfer').trim() || 'bank_transfer';
    const trimmedBankName = String(bankName || '').trim();
    const trimmedAccountNumber = String(accountNumber || '').trim();
    const trimmedAccountHolder = String(accountHolder || '').trim();
    const trimmedCustomerName = String(customerName || '').trim();
    const trimmedCustomerPhone = String(customerPhone || '').trim();
    const trimmedCustomerEmail = String(customerEmail || '').trim();

    // ✅ Validate required fields
    if (!trimmedBankName || !trimmedAccountNumber || !trimmedAccountHolder || !trimmedCustomerName || !trimmedCustomerPhone || !trimmedCustomerEmail) {
      const missing = [];
      if (!trimmedBankName) missing.push('bankName');
      if (!trimmedAccountNumber) missing.push('accountNumber');
      if (!trimmedAccountHolder) missing.push('accountHolder');
      if (!trimmedCustomerName) missing.push('customerName');
      if (!trimmedCustomerPhone) missing.push('customerPhone');
      if (!trimmedCustomerEmail) missing.push('customerEmail');
      return res.status(400).json({ success: false, message: `Vui lòng điền đầy đủ thông tin: ${missing.join(', ')}` });
    }

    if (!/^\d{10,11}$/.test(trimmedCustomerPhone)) {
      return res.status(400).json({ success: false, message: 'Số điện thoại liên hệ phải gồm 10-11 chữ số' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedCustomerEmail)) {
      return res.status(400).json({ success: false, message: 'Email liên hệ không hợp lệ' });
    }

    // ✅ Find session
    const session = await GameSession.findOne({
      where: { session_code: normalizedSessionCode, is_active: true }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Phiên không tồn tại hoặc không còn hoạt động' });
    }

    const totalConverted = Number(await PlayerInventory.sum('prize_value', {
      where: { session_code: normalizedSessionCode, status: 'converted' }
    }) || 0);

    const manualWalletAmount = session.wallet_manual_amount === null || session.wallet_manual_amount === undefined
      ? null
      : Number(session.wallet_manual_amount);
    const hasManualWallet = manualWalletAmount !== null && Number.isFinite(manualWalletAmount);
    const walletTotal = hasManualWallet ? Math.max(0, manualWalletAmount) : totalConverted;

    // Reserve both pending and approved withdrawals for legacy sessions.
    // In manual wallet mode, current balance is already tracked directly on wallet_manual_amount.
    const reserveStatuses = hasManualWallet ? [] : ['approved', 'pending'];
    const existingWithdrawals = await Withdrawal.findAll({
      where: { session_code: normalizedSessionCode, status: { [Op.in]: reserveStatuses } }
    });

    const usedBalance = existingWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    const availableBalance = Math.max(0, walletTotal - usedBalance);

    if (availableBalance <= 0) {
      return res.status(400).json({ success: false, message: 'Không có số tiền để rút. Kiểm tra lại số tiền.' });
    }

    // ✅ Convert and validate withdrawal amount
    const withdrawAmount = parseInt(amount) || 0;

    // Validate minimum withdrawal
    if (withdrawAmount < 10000) {
      return res.status(400).json({ 
        success: false, 
        message: `Số tiền tối thiểu là 10.000 VND. Số tiền của bạn: ${availableBalance.toLocaleString('vi-VN')} đ`
      });
    }

    // ✅ Validate balance >= requested amount
    if (withdrawAmount > availableBalance) {
      return res.status(400).json({ 
        success: false, 
        message: `Số dư không đủ. Số dư hiện tại: ${availableBalance.toLocaleString('vi-VN')} đ`
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

    await session.update({
      player_name: trimmedCustomerName,
      player_phone: trimmedCustomerPhone,
      player_email: trimmedCustomerEmail,
      form_submitted_at: new Date()
    });

    const resolvedBoxNumber = Number.isInteger(Number(boxNumber)) ? Number(boxNumber) : null;
    const prizeNameFromBox = resolvedBoxNumber && resolvedBoxNumber >= 1 && resolvedBoxNumber <= 3
      ? session[`prize_${resolvedBoxNumber}`] || null
      : null;
    const withdrawalRequestCode = generateWithdrawalRequestCode();
    const supportHint = 'Để được duyệt nhanh nhất, vui lòng liên hệ CSKH và cung cấp mã rút tiền.';

    const withdrawalPayload = {
      user_id: null,
      session_code: normalizedSessionCode,
      amount: withdrawAmount,  // ✅ Use requested amount
      status: 'pending',
      withdrawal_type: 'cash_prize',
      requested_by: session.player_name || 'Unknown',
      selected_box_number: resolvedBoxNumber,
      prize_name: prizeNameFromBox,
      bank_name: trimmedBankName,
      account_number: trimmedAccountNumber,
      account_holder: trimmedAccountHolder,
      customer_name: trimmedCustomerName,
      customer_phone: trimmedCustomerPhone,
      customer_email: trimmedCustomerEmail,
      player_contact: {
        name: trimmedCustomerName,
        phone: trimmedCustomerPhone,
        email: trimmedCustomerEmail,
        ip_address: requestIp
      },
      box_selection_snapshot: {
        request_code: withdrawalRequestCode,
        support_hint: supportHint,
        selected_box_number: resolvedBoxNumber || null,
        prize_name: prizeNameFromBox || null,
        wallet_deducted: true,
        wallet_deducted_amount: withdrawAmount,
        wallet_deducted_at: new Date().toISOString()
      },
      notes: `[${withdrawalRequestCode}] Rút ${withdrawAmount.toLocaleString('vi-VN')} đ từ quà hộp. ${supportHint}`,
      requested_at: new Date()
    };

    // Atomic deduction: prevents double-withdraw race by locking session wallet row.
    const deduction = await applySessionWalletDeltaAtomic(normalizedSessionCode, -Math.abs(withdrawAmount));
    if (!deduction.ok && deduction.reason === 'insufficient_wallet') {
      return res.status(400).json({
        success: false,
        message: `Số dư không đủ. Số dư hiện tại: ${Math.max(0, Number(deduction.currentWallet || 0)).toLocaleString('vi-VN')} đ`,
        data: {
          available_wallet: Number(deduction.currentWallet || 0),
          requested: withdrawAmount
        }
      });
    }

    // ✅ Create withdrawal with requested amount (session-based, no user required)
    let withdrawal;
    try {
      withdrawal = await Withdrawal.create(withdrawalPayload);
    } catch (createErr) {
      const msg = String(createErr?.message || '').toLowerCase();
      const isLegacyUserNotNullError =
        msg.includes('user_id') && (msg.includes('cannot be null') || msg.includes('doesn\'t have a default value'));

      try {
        await applySessionWalletDeltaAtomic(normalizedSessionCode, Math.abs(withdrawAmount));
      } catch (_) {
        // Best-effort rollback if create fails after deduction.
      }

      if (!isLegacyUserNotNullError) {
        throw createErr;
      }

      await ensureWithdrawalUserIdNullable();
      const secondDeduction = await applySessionWalletDeltaAtomic(normalizedSessionCode, -Math.abs(withdrawAmount));
      if (!secondDeduction.ok && secondDeduction.reason === 'insufficient_wallet') {
        return res.status(400).json({
          success: false,
          message: `Số dư không đủ. Số dư hiện tại: ${Math.max(0, Number(secondDeduction.currentWallet || 0)).toLocaleString('vi-VN')} đ`,
          data: {
            available_wallet: Number(secondDeduction.currentWallet || 0),
            requested: withdrawAmount
          }
        });
      }
      withdrawal = await Withdrawal.create(withdrawalPayload);
    }

    res.json({
      success: true,
      message: 'Yêu cầu rút tiền đã được gửi. Chúng tôi sẽ xử lý trong 2-3 ngày làm việc.',
      data: {
        ...(withdrawal?.toJSON ? withdrawal.toJSON() : withdrawal),
        withdrawal_code: withdrawalRequestCode,
        support_hint: supportHint
      }
    });

    emitAdminRealtime(req, 'new_withdrawal', {
      id: withdrawal.id,
      amount: Number(withdrawal.amount || 0),
      session_code: normalizedSessionCode,
      status: withdrawal.status || 'pending',
      withdrawal_code: withdrawalRequestCode
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi trên máy chủ',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};;

// ============================================
// GET /api/lucky-mystery-box/search
// ============================================
exports.searchSession = async (req, res, next) => {
  try {
    const rawCode = String(req.query?.code || '').trim();
    const normalizedCode = rawCode.toUpperCase();
    const isLegacyHtmlSearch = req.path === '/search';

    const esc = (value) => String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    if (!normalizedCode) {
      if (isLegacyHtmlSearch) {
        return res.status(200).type('html').send(`
          <html><body>
            <h1>Search Session</h1>
            <form method="get" action="/search">
              <input name="code" placeholder="Nhập mã phiên" />
              <button type="submit">Search</button>
            </form>
            <p>Vui lòng nhập mã phiên.</p>
          </body></html>
        `);
      }
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mã phiên' });
    }

    const session = await GameSession.findOne({ where: { session_code: normalizedCode } });

    if (!session) {
      if (isLegacyHtmlSearch) {
        return res.status(200).type('html').send(`
          <html><body>
            <h1>Search Session</h1>
            <form method="get" action="/search">
              <input name="code" value="${esc(rawCode)}" />
              <button type="submit">Search</button>
            </form>
            <p>Session not found (not exist)</p>
          </body></html>
        `);
      }
      return res.status(404).json({ success: false, message: 'Mã phiên không tồn tại' });
    }

    const inventory = await GiftExchange.findAll({
      where: { session_code: normalizedCode },
      attributes: ['id', 'selected_box_number', 'prize_name', 'recipient_name', 'status', 'createdAt']
    });

    const boxNum = session.player_selected_box;
    let walletBalance = 0;

    if (session.is_exchanged && boxNum) {
      const amountField = `prize_${boxNum}_cash_amount`;
      walletBalance = session[amountField] || 0;
    }

    if (isLegacyHtmlSearch) {
      const statusText = session.is_active ? 'active (open)' : 'inactive';
      return res.status(200).type('html').send(`
        <html><body>
          <h1>Search Session</h1>
          <form method="get" action="/search">
            <input name="code" value="${esc(session.session_code)}" />
            <button type="submit">Search</button>
          </form>
          <div>
            <p>Code: ${esc(session.session_code)}</p>
            <p>Name: ${esc(session.player_name || '')}</p>
            <p>Phone: ${esc(session.player_phone || '')}</p>
            <p>Status: ${esc(statusText)}</p>
            <p>Box: ${esc(session.player_selected_box || '')}</p>
          </div>
        </body></html>
      `);
    }

    return res.json({
      success: true,
      data: {
        session: {
          code: session.session_code,
          isActive: session.is_active,
          isCompleted: session.is_completed,
          playerName: session.player_name
        },
        inventory,
        wallet: {
          balance: walletBalance,
          isExchanged: session.is_exchanged
        },
        hasInventory: inventory.length > 0
      }
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// GET /api/lucky-mystery-box/:sessionCode/player-inventory
// Get player prizes from PlayerInventory
// ============================================
exports.getPlayerInventory = async (req, res, next) => {
  try {
    const { sessionCode } = req.params;
    const normalizedSessionCode = sessionCode.toUpperCase();

    if (!sessionCode) {
      return res.status(400).json({ success: false, message: 'Mã phiên không hợp lệ' });
    }

    const { PlayerInventory, ConversionRequest } = require('../models');

    // Try to get from PlayerInventory table first
    let inventory = await PlayerInventory.findAll({
      where: { session_code: normalizedSessionCode },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'box_number', 'prize_name', 'prize_description', 'prize_icon', 'prize_image', 'prize_value', 'is_cash', 'is_special', 'rarity', 'color_hex', 'status', 'currency', 'createdAt']
    });

    // ✅ If PlayerInventory is empty but session has opened box, build from GameSession
    if (inventory.length === 0) {
      const session = await GameSession.findOne({
        where: { session_code: normalizedSessionCode, is_active: true }
      });

      if (session && session.player_selected_box) {
        const boxNum = session.player_selected_box;
        
        // Build inventory array from game session data
        const normalizedImageUrl = resolveUploadImageUrl(session[`prize_${boxNum}_image_url`] || null);

        inventory = [{
          id: null,
          box_number: boxNum,
          prize_name: session[`prize_${boxNum}`] || 'Quà tặng',
          prize_description: session[`prize_${boxNum}_description`] || '',
          prize_icon: session[`prize_${boxNum}_icon`] || '🎁',
          prize_image: normalizedImageUrl,
          prize_value: session[`prize_${boxNum}_cash_amount`] || 0,
          is_cash: session[`prize_${boxNum}_cash`] || false,
          is_special: session[`prize_${boxNum}_is_special`] || false,
          rarity: session[`prize_${boxNum}_rarity`] || 'common',
          color_hex: session[`prize_${boxNum}_color_hex`] || '#666666',
          status: 'obtained',
          currency: session.currency || detectCurrency(session[`prize_${boxNum}`] || '', session[`prize_${boxNum}_cash_amount`] || 0),
          level: session[`prize_${boxNum}_status`] || 'NORMAL',
          createdAt: session.player_selected_at
        }];
      }
    }

    let sessionForLevels = null;
    if (inventory.length > 0) {
      sessionForLevels = await GameSession.findOne({
        where: { session_code: normalizedSessionCode }
      });
    }

    const conversionRows = await ConversionRequest.findAll({
      where: { session_code: normalizedSessionCode },
      attributes: ['box_number', 'status', 'requested_at', 'createdAt', 'amount', 'currency', 'amount_vnd'],
      order: [['requested_at', 'DESC'], ['createdAt', 'DESC']]
    });

    const latestDecisionByBox = {};
    const latestApprovedConversionByBox = {};
    conversionRows.forEach((row) => {
      const raw = row.toJSON ? row.toJSON() : row;
      const box = Number(raw.box_number || 0);
      if (!box || latestDecisionByBox[box]) return;
      if (raw.status === 'approved') latestDecisionByBox[box] = 'converted';
      else if (raw.status === 'rejected') latestDecisionByBox[box] = 'declined';

      if (raw.status === 'approved' && !latestApprovedConversionByBox[box]) {
        latestApprovedConversionByBox[box] = {
          amount: Number(raw.amount) || 0,
          amountVND: Number(raw.amount_vnd || raw.amount) || 0,
          currency: String(raw.currency || 'VND').toUpperCase()
        };
      }
    });

    inventory = inventory.map(item => {
      const data = item.toJSON ? item.toJSON() : item;
      const boxNumber = Number(data.box_number || 0);
      const sessionImageForBox = sessionForLevels
        ? sessionForLevels[`prize_${data.box_number}_image_url`]
        : null;
      const approvedConversion = latestApprovedConversionByBox[boxNumber] || null;
      const levelFromSession = sessionForLevels
        ? sessionForLevels[`prize_${data.box_number}_status`]
        : data.level;
      const sessionRequiresSpecialApproval = sessionForLevels
        ? parseSpecialFlag(sessionForLevels[`prize_${data.box_number}_is_special`])
        : parseSpecialFlag(data.is_special);
      const normalizedStatus = (!sessionRequiresSpecialApproval && ['pending_approval', 'confirmed', 'rejected'].includes(String(data.status || '').toLowerCase()))
        ? 'obtained'
        : data.status;

      // Keep original foreign-currency amount for card/inventory display after conversion approval.
      // Wallet balance is still sourced from conversion amount_vnd.
      const shouldUseOriginalForeignAmount = !!(
        approvedConversion
        && (approvedConversion.currency === 'USD' || approvedConversion.currency === 'NDT')
      );

      return {
        ...data,
        prize_image: resolveUploadImageUrl(data.prize_image || sessionImageForBox),
        level: levelFromSession || data.level || 'NORMAL',
        is_special: sessionRequiresSpecialApproval,
        status: normalizedStatus,
        processingStatus: data.status || 'obtained',
        currency: shouldUseOriginalForeignAmount
          ? approvedConversion.currency
          : (data.currency || 'VND'),
        prize_value: shouldUseOriginalForeignAmount
          ? approvedConversion.amount
          : (Number(data.prize_value) || 0),
        decision: latestDecisionByBox[boxNumber] || null
      };
    });

    res.json({
      success: true,
      data: {
        total: inventory.length,
        items: inventory
      }
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// GET /api/lucky-mystery-box/:sessionCode/preload-boxes
// Preload all 3 boxes info to reduce API calls
// ============================================
exports.preloadBoxes = async (req, res, next) => {
  try {
    const { sessionCode } = req.params;
    const validatedSession = req.validatedSession;

    if (!validatedSession) {
      return res.status(400).json({ success: false, message: 'Phiên không hợp lệ' });
    }

    // Ensure session data is plain object
    const sessionData = validatedSession.get ? validatedSession.get({ plain: true }) : validatedSession;

    // Build info for all 3 boxes
    const boxes = [];
    for (let boxNum = 1; boxNum <= 3; boxNum++) {
      // Safely get prize data with fallbacks
      const prizePrefix = `prize_${boxNum}`;
      
      const prizeDetails = {
        name: sessionData[prizePrefix] || `Phần thưởng ${boxNum}`,
        description: sessionData[`${prizePrefix}_description`] || '',
        icon: sessionData[`${prizePrefix}_icon`] || '🎁',
        imageUrl: sessionData[`${prizePrefix}_image_url`] || null,
        isCash: sessionData[`${prizePrefix}_cash`] === true || sessionData[`${prizePrefix}_cash`] === 1 || false,
        cashAmount: parseInt(sessionData[`${prizePrefix}_cash_amount`]) || 0,
        isSpecial: sessionData[`${prizePrefix}_is_special`] === true || sessionData[`${prizePrefix}_is_special`] === 1 || false,
        rarity: sessionData[`${prizePrefix}_rarity`] || 'NORMAL',
        colorHex: sessionData[`${prizePrefix}_color_hex`] || null,
        status: sessionData[`${prizePrefix}_status`] || 'NORMAL'
      };

      boxes.push({
        boxNumber: boxNum,
        name: prizeDetails.name,
        description: prizeDetails.description,
        icon: prizeDetails.icon,
        image: prizeDetails.imageUrl,
        value: prizeDetails.cashAmount || 0,
        isCash: prizeDetails.isCash,
        isSpecial: prizeDetails.isSpecial,
        rarity: prizeDetails.rarity,
        colorHex: prizeDetails.colorHex,
        level: prizeDetails.status,
        currency: detectCurrency(prizeDetails.name, prizeDetails.cashAmount)
      });
    }

    res.json({
      success: true,
      data: {
        sessionCode: sessionData.session_code,
        boxes: boxes
      }
    });
  } catch (err) {
    console.error('❌ Error in preloadBoxes:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải dữ liệu hộp quà',
      error: err.message
    });
  }
};
