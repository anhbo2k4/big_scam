const db = require('../models');

// Temporary rollback switch: keep authentication, disable authorization until permission rollout resumes.
const PERMISSIONS_DISABLED = process.env.DISABLE_PERMISSION_CHECKS === 'true';

const PERMISSIONS = Object.freeze({
  CHAT_VIEW: 'chat.view',
  CHAT_SEND: 'chat.send',
  CHAT_ASSIGN: 'chat.assign',
  CHAT_EDIT: 'chat.edit',
  CHAT_DELETE: 'chat.delete',
  MANAGE_PRIZES: 'manage_prizes'
});

function userHas(req, code) {
  const user = req.session?.user;
  if (!user || user.is_active === false) return false;
  if (PERMISSIONS_DISABLED || user.role === 'admin') return true;
  return Array.isArray(user.permissions) && user.permissions.some(p => p && p.code === code);
}

function requirePermission(code) {
  return (req, res, next) => {
    if (!req.session?.user || req.session.user.is_active === false) {
      return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' });
    }
    if (PERMISSIONS_DISABLED) {
      req.user = req.session.user;
      return next();
    }
    if (!userHas(req, code)) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện hành động này' });
    }
    req.user = req.session.user;
    return next();
  };
}

async function requireChatSessionAccess(req, res, next) {
  const code = String(req.params.sessionCode || req.params.session_code || '').trim();
  if (!code || req.user?.role === 'admin') return next();
  const session = await db.ChatSession.findOne({ where: { session_code: code }, attributes: ['id', 'support_agent_id', 'record_scope_id'] });
  if (!session) return res.status(404).json({ success: false, message: 'Chat session không tồn tại' });
  const userId = Number(req.user?.id);
  if (Number(session.support_agent_id) !== userId) {
    return res.status(403).json({ success: false, message: 'Chat session không thuộc phạm vi của bạn' });
  }
  req.chatSession = session;
  return next();
}

async function requireChatBodySessionAccess(req, res, next) {
  const code = String(req.body?.session_code || req.query?.session_code || '').trim();
  if (!code || req.user?.role === 'admin') return next();
  const session = await db.ChatSession.findOne({ where: { session_code: code }, attributes: ['id', 'support_agent_id', 'record_scope_id'] });
  if (!session) return res.status(404).json({ success: false, message: 'Chat session không tồn tại' });
  if (Number(session.support_agent_id) !== Number(req.user?.id)) {
    return res.status(403).json({ success: false, message: 'Chat session không thuộc phạm vi của bạn' });
  }
  req.chatSession = session;
  return next();
}

module.exports = { PERMISSIONS, requirePermission, requireChatSessionAccess, requireChatBodySessionAccess, userHas };
