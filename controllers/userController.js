const { User, Permission, Wallet, UserSession, sequelize, Sequelize } = require('../models')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { logAction, ACTION_TYPES } = require('./historyController')
const {
  IMMUTABLE_DEV_USERNAME,
  isImmutableDeveloperUser,
  ensureImmutableDeveloperAccount
} = require('../utils/immutableDeveloperAccount')

const PRESENCE_CACHE_TTL_MS = Math.max(1000, Number(process.env.PRESENCE_CACHE_TTL_MS || 10000))
let presenceCache = null
let presenceCacheAt = 0
let presenceCachePromise = null

function sanitizeUserOutput(userRecord) {
  const data = userRecord && typeof userRecord.toJSON === 'function'
    ? userRecord.toJSON()
    : { ...(userRecord || {}) }

  if (isImmutableDeveloperUser(data)) {
    data.plain_password_enc = null
  }

  return data
}

function normalizeTrustScore(value, fallback = 100) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(0, Math.min(100, Math.round(parsed)))
}

function tryParseSessionPayload(rawPayload) {
  let payload = rawPayload
  for (let i = 0; i < 2; i += 1) {
    if (!payload) return null
    if (typeof payload === 'object') return payload
    if (typeof payload !== 'string') return null
    try {
      payload = JSON.parse(payload)
    } catch (_) {
      return null
    }
  }
  return (payload && typeof payload === 'object') ? payload : null
}

async function list(req, res) {
  try {
    await ensureImmutableDeveloperAccount(require('../models'))

    const { page = 1, limit = 10, role, status, search } = req.query
    const Op = require('sequelize').Op
    const where = {}
    
    // Filter by role if provided
    if (role) {
      where.role = role
    }
    
    // Filter by status if provided
    if (status) {
      where.is_active = status === 'active'
    }
    
    // Search by username, email, or full_name if provided
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { full_name: { [Op.like]: `%${search}%` } }
      ]
    }
    
    const offset = (parseInt(page) - 1) * parseInt(limit)
    
    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ association: 'Permissions', through: { attributes: [] } }],
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']]
    })

    const safeRows = rows.map((row) => sanitizeUserOutput(row))
    
    res.json({ 
      success: true, 
      data: safeRows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

async function get(req, res) {
  try {
    await ensureImmutableDeveloperAccount(require('../models'))

    const u = await User.findByPk(req.params.id, {
      include: [{ association: 'Permissions', through: { attributes: [] } }]
    })
    if (!u) return res.status(404).json({ success: false })

    const wallet = await Wallet.findOne({ where: { user_id: u.id } })
    const userData = sanitizeUserOutput(u)
    userData.wallet = {
      total_balance: Number(wallet?.total_balance || 0),
      available_balance: Number(wallet?.available_balance || 0),
      pending_balance: Number(wallet?.pending_balance || 0),
      locked_balance: Number(wallet?.locked_balance || 0)
    }

    res.json({ success: true, data: userData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

async function create(req, res) {
  try {
    await ensureImmutableDeveloperAccount(require('../models'))

    const { username, email, full_name, password, role, permissions, trust_score } = req.body

    if (isImmutableDeveloperUser(username)) {
      return res.status(409).json({
        success: false,
        message: 'Tài khoản developer hệ thống đã được bảo vệ sẵn và không thể tạo lại'
      })
    }
    
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      })
    }

    
    const password_hash = crypto.createHash('sha256').update(password).digest('hex')
    const plain_password_enc = Buffer.from(password).toString('base64')

    const user = await User.create({
      username,
      email,
      full_name: full_name || '',
      password_hash,
      plain_password_enc,
      role: role || 'user',
      is_active: true,
      trust_score: normalizeTrustScore(trust_score, 100),
      created_by: req.session?.user?.username || 'system'
    })

    
    if (permissions && Array.isArray(permissions)) {
      for (const permissionId of permissions) {
        const permission = await Permission.findByPk(permissionId)
        if (permission) {
          await user.addPermission(permission)
        }
      }
    }

    // Log user creation
    await logAction(
      req.session?.user?.id || null,
      ACTION_TYPES.USER_CREATED,
      `Người dùng ${username} đã được tạo`,
      { username, email, role },
      'success'
    )

    const userData = await User.findByPk(user.id, {
      include: [{ association: 'Permissions', through: { attributes: [] } }]
    })

    res.json({ success: true, data: userData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

async function update(req, res) {
  try {
    await ensureImmutableDeveloperAccount(require('../models'))

    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ success: false })

    if (isImmutableDeveloperUser(user)) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản developer hệ thống không thể chỉnh sửa'
      })
    }
    
    const { password, permissions, wallet_available_balance, trust_score, ...updateData } = req.body

    updateData.updated_by = req.session?.user?.username || 'system';
    
    if (password) {
      updateData.password_hash = crypto.createHash('sha256').update(password).digest('hex')
      updateData.plain_password_enc = Buffer.from(password).toString('base64')
    }

    if (trust_score !== undefined) {
      updateData.trust_score = normalizeTrustScore(trust_score, user.trust_score)
    }

    await user.update(updateData)

    if (wallet_available_balance !== undefined) {
      const availableBalance = Math.max(0, Math.round(Number(wallet_available_balance) || 0))
      const existingWallet = await Wallet.findOne({ where: { user_id: user.id } })

      if (existingWallet) {
        const pendingBalance = Number(existingWallet.pending_balance || 0)
        const lockedBalance = Number(existingWallet.locked_balance || 0)
        await existingWallet.update({
          available_balance: availableBalance,
          total_balance: availableBalance + pendingBalance + lockedBalance,
          updated_by: req.session?.user?.username || 'admin',
          last_updated_at: new Date()
        })
      } else {
        await Wallet.create({
          user_id: user.id,
          available_balance: availableBalance,
          pending_balance: 0,
          locked_balance: 0,
          total_balance: availableBalance,
          updated_by: req.session?.user?.username || 'admin',
          last_updated_at: new Date()
        })
      }
    }

    
    if (permissions && Array.isArray(permissions)) {
      await user.setPermissions([])
      for (const permissionId of permissions) {
        const permission = await Permission.findByPk(permissionId)
        if (permission) {
          await user.addPermission(permission)
        }
      }
    }

    // Log user update
    await logAction(
      req.session?.user?.id || null,
      ACTION_TYPES.USER_UPDATED,
      `Người dùng ${user.username} đã được cập nhật`,
      { username: user.username, changes: updateData },
      'success'
    )

    const userData = await User.findByPk(user.id, {
      include: [{ association: 'Permissions', through: { attributes: [] } }]
    })

    const wallet = await Wallet.findOne({ where: { user_id: user.id } })
    const mergedData = sanitizeUserOutput(userData)
    mergedData.wallet = {
      total_balance: Number(wallet?.total_balance || 0),
      available_balance: Number(wallet?.available_balance || 0),
      pending_balance: Number(wallet?.pending_balance || 0),
      locked_balance: Number(wallet?.locked_balance || 0)
    }

    res.json({ success: true, data: mergedData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

async function remove(req, res) {
  try {
    await ensureImmutableDeveloperAccount(require('../models'))

    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    if (isImmutableDeveloperUser(user)) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản developer hệ thống không thể xóa'
      })
    }
    
    const username = user.username;
    const userId = user.id;
    
    // Actually delete the user from database
    await user.destroy();
    
    // Log user deletion
    await logAction(
      req.session?.user?.id || null,
      ACTION_TYPES.USER_DELETED,
      `Người dùng ${username} (ID: ${userId}) đã bị xóa`,
      { username, user_id: userId },
      'success'
    )
    
    console.log(`✅ User deleted: ${username} (ID: ${userId})`);
    res.json({ success: true, message: `User ${username} deleted successfully` })
  } catch (err) {
    console.error('❌ Error deleting user:', err.message);
    res.status(500).json({ success: false, message: err.message })
  }
}

async function getPermissions(req, res) {
  try {
    await ensureImmutableDeveloperAccount(require('../models'))

    const user = await User.findByPk(req.params.id, {
      include: [{ association: 'Permissions', through: { attributes: [] } }]
    })
    if (!user) return res.status(404).json({ success: false })
    
    res.json({ success: true, data: user.Permissions || [] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

async function assignPermissions(req, res) {
  try {
    await ensureImmutableDeveloperAccount(require('../models'))

    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ success: false })

    if (isImmutableDeveloperUser(user)) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản developer hệ thống không thể chỉnh quyền'
      })
    }

    const { permissionIds } = req.body
    if (!Array.isArray(permissionIds)) {
      return res.status(400).json({ success: false, message: 'permissionIds must be an array' })
    }

    
    await user.setPermissions([])

    
    for (const permissionId of permissionIds) {
      const permission = await Permission.findByPk(permissionId)
      if (permission) {
        await user.addPermission(permission)
      }
    }

    const userData = await User.findByPk(user.id, {
      include: [{ association: 'Permissions', through: { attributes: [] } }]
    })

    res.json({ success: true, data: userData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

async function changePassword(req, res) {
  try {
    await ensureImmutableDeveloperAccount(require('../models'))

    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' })

    if (isImmutableDeveloperUser(user)) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản developer hệ thống không thể đổi mật khẩu'
      })
    }

    const { password } = req.body
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.plain_password_enc = Buffer.from(password).toString('base64')
    await user.save()

    res.json({ success: true, message: 'Đổi mật khẩu thành công' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

async function listPresence(req, res) {
  try {
    const nowMs = Date.now()
    if (presenceCache && (nowMs - presenceCacheAt) < PRESENCE_CACHE_TTL_MS) {
      return res.json(presenceCache)
    }
    if (presenceCachePromise) {
      return res.json(await presenceCachePromise)
    }

    presenceCachePromise = (async () => {
      await ensureImmutableDeveloperAccount(require('../models'))

      const limitRaw = Number(req.query.limit || 80)
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(limitRaw, 500)) : 80
      const ONLINE_ACTIVE_WINDOW_MS = 5 * 60 * 1000

      const users = await User.findAll({
        attributes: ['id', 'username', 'full_name', 'email', 'role', 'is_active', 'updated_at'],
        order: [['created_at', 'DESC']],
        limit
      })

      // Query UserSession instead of the raw sessions table to avoid table locks and heavy JSON.parse calls.
      const userSessions = await UserSession.findAll({
        where: {
          user_id: { [Sequelize.Op.ne]: null }
        },
        order: [['last_seen_at', 'DESC']],
        limit: 1000,
        raw: true
      })

      const sessionMapById = new Map()
      const sessionMapByUsername = new Map()
      const latestSeenById = new Map()
      const latestSeenByUsername = new Map()

      for (const row of userSessions) {
        const userId = Number(row.user_id)
        const username = String(row.username || '').trim().toLowerCase()
        if (!Number.isFinite(userId) && !username) continue

        const lastSeenAt = row.last_seen_at ? new Date(row.last_seen_at) : null
        const lastSeenMs = lastSeenAt ? lastSeenAt.getTime() : 0
        const isActiveNow = row.status === 'active' && lastSeenMs > 0 && (nowMs - lastSeenMs <= ONLINE_ACTIVE_WINDOW_MS)

        const mergeSession = (targetMap, key) => {
          if (key === null || key === undefined || key === '') return
          const current = targetMap.get(key) || { sessions: 0, expires_at: null }
          if (!isActiveNow) {
            targetMap.set(key, current)
            return
          }
          current.sessions += 1
          const expDate = new Date(lastSeenMs + 24 * 60 * 60 * 1000)
          if (!current.expires_at || expDate > new Date(current.expires_at)) {
            current.expires_at = expDate.toISOString()
          }
          targetMap.set(key, current)
        }

        if (Number.isFinite(userId)) mergeSession(sessionMapById, userId)
        if (username) mergeSession(sessionMapByUsername, username)

        if (!lastSeenAt) continue
        const seenIso = lastSeenAt.toISOString()

        if (Number.isFinite(userId)) {
          const current = latestSeenById.get(userId)
          if (!current || lastSeenAt > new Date(current)) latestSeenById.set(userId, seenIso)
        }

        if (username) {
          const current = latestSeenByUsername.get(username)
          if (!current || lastSeenAt > new Date(current)) latestSeenByUsername.set(username, seenIso)
        }
      }

      const data = users.map((u) => {
        const item = u.toJSON()
        const keyById = Number(item.id)
        const keyByUsername = String(item.username || '').trim().toLowerCase()
        const isSystemDev = keyByUsername === IMMUTABLE_DEV_USERNAME
        const live = (Number.isFinite(keyById) ? sessionMapById.get(keyById) : null) || sessionMapByUsername.get(keyByUsername)
        const isOnline = Boolean(item.is_active && live && live.sessions > 0)
        const lastSeen = (Number.isFinite(keyById) ? latestSeenById.get(keyById) : null) || latestSeenByUsername.get(keyByUsername) || null
        return {
          id: item.id,
          username: item.username,
          full_name: item.full_name,
          email: item.email,
          role: item.role,
          role_label: isSystemDev ? 'Developer' : item.role,
          is_system_dev: isSystemDev,
          is_active: item.is_active,
          is_online: isOnline,
          active_sessions: isOnline ? live.sessions : 0,
          online_expires_at: isOnline ? live.expires_at : null,
          last_seen_at: lastSeen,
          last_updated_at: item.updated_at || null
        }
      })

      const onlineCount = data.filter((u) => u.is_online).length

      const payload = {
        success: true,
        data,
        summary: {
          total: data.length,
          online: onlineCount,
          offline: data.length - onlineCount
        }
      }
      presenceCache = payload
      presenceCacheAt = Date.now()
      return payload
    })().finally(() => {
      presenceCachePromise = null
    })

    return res.json(await presenceCachePromise)
  } catch (err) {
    console.error('listPresence error:', err)
    return res.status(500).json({ success: false, message: 'Không lấy được trạng thái đăng nhập' })
  }
}

module.exports = { list, get, create, update, remove, getPermissions, assignPermissions, changePassword, listPresence }
