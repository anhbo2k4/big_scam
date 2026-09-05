const db = require('../models');
const sessionTracker = require('../services/sessionTracker');

function trackRestoredSession(req) {
  sessionTracker.touchSession(req, {
    force: true,
    user: req.session?.user || req.user || null,
    rememberTokenUsed: true,
    metadata: {
      restored_from_remember_token: true
    }
  }).catch(() => {});
}

function expectsJson(req) {
  return String(req.originalUrl || req.url || '').startsWith('/api/')
    || (req.accepts('json') && !req.accepts('html'));
}

function deny(req, res, status, message) {
  if (expectsJson(req)) return res.status(status).json({ success: false, message });
  return res.status(status).send(message);
}

function isActiveSessionUser(req) {
  return Boolean(req.session?.user && req.session.user.is_active !== false);
}

exports.isAuthenticated = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    
    const rememberToken = req.cookies.rememberMe;
    if (rememberToken) {
      try {
        const tokenRecord = await db.RememberToken.findOne({
          where: { token: rememberToken }
        });

        if (tokenRecord && tokenRecord.expires_at > new Date()) {
          
          const user = await db.User.findOne({
            where: { id: tokenRecord.user_id },
            include: [
              {
                model: db.Permission,
                as: 'Permissions',
                through: { attributes: [] },
                attributes: ['id', 'name', 'code', 'description']
              }
            ]
          });

          if (user && user.is_active) {
            req.session.user = {
              id: user.id,
              username: user.username,
              email: user.email,
              full_name: user.full_name,
              role: user.role,
              permissions: user.Permissions.map(p => ({ id: p.id, name: p.name, code: p.code }))
            };
            req.user = req.session.user;
            trackRestoredSession(req);
            return next();
          }
        }
      } catch (error) {
        console.error('Remember token check error:', error);
      }
    }

    
    if (expectsJson(req)) {
      return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' });
    }
    
    return res.redirect('/admin/login');
  }
  
  if (!isActiveSessionUser(req)) {
    return deny(req, res, 401, 'Vui lòng đăng nhập');
  }

  // Set req.user from session for consistency
  req.user = req.session.user;
  
  next();
};

exports.isAdmin = async (req, res, next) => {
  if (!req.session || !req.session.user) {
    
    const rememberToken = req.cookies.rememberMe;
    if (rememberToken) {
      try {
        const tokenRecord = await db.RememberToken.findOne({
          where: { token: rememberToken }
        });

        if (tokenRecord && tokenRecord.expires_at > new Date()) {
          
          const user = await db.User.findOne({
            where: { id: tokenRecord.user_id },
            include: [
              {
                model: db.Permission,
                as: 'Permissions',
                through: { attributes: [] },
                attributes: ['id', 'name', 'code', 'description']
              }
            ]
          });

          if (user && user.is_active) {
            req.session.user = {
              id: user.id,
              username: user.username,
              email: user.email,
              full_name: user.full_name,
              role: user.role,
              permissions: user.Permissions.map(p => ({ id: p.id, name: p.name, code: p.code }))
            };
            req.user = req.session.user;
            trackRestoredSession(req);
          }
        }
      } catch (error) {
        console.error('Remember token check error:', error);
      }
    }

    if (!req.session || !req.session.user) {
      
      if (expectsJson(req)) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' });
      }
      
      return res.redirect('/admin/login');
    }
  }

  if (process.env.DISABLE_PERMISSION_CHECKS === 'true') {
    if (req.session?.user?.is_active === false) return res.redirect('/admin/login');
    req.user = req.session.user;
    return next();
  }

  if (req.session.user.role !== 'admin') {
    
    if (expectsJson(req)) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập tài nguyên này' });
    }
    
    return res.redirect('/admin/login');
  }

  // Set req.user from session for consistency
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }

  next();
};

exports.hasPermission = (permissionCode) => {
  return (req, res, next) => {
    if (!isActiveSessionUser(req)) {
      return deny(req, res, 401, 'Vui lòng đăng nhập');
    }

    const user = req.session.user;
    if (process.env.DISABLE_PERMISSION_CHECKS === 'true') {
      req.user = user;
      return next();
    }
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];
    const hasPermission = user.role === 'admin' || permissions.some(p => p && p.code === permissionCode);

    if (!hasPermission) {
      return deny(req, res, 403, 'Bạn không có quyền thực hiện hành động này');
    }

    req.user = user;
    next();
  };
};
// Alias for API token verification
exports.verifyToken = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      const rememberToken = req.cookies.rememberMe;
      if (rememberToken) {
        const tokenRecord = await db.RememberToken.findOne({
          where: { token: rememberToken }
        }).catch(() => null);

        if (tokenRecord && tokenRecord.expires_at > new Date()) {
          const user = await db.User.findOne({ where: { id: tokenRecord.user_id } }).catch(() => null);
          if (user && user.is_active) {
            req.session.user = {
              id: user.id,
              username: user.username,
              email: user.email,
              full_name: user.full_name,
              role: user.role,
              permissions: []
            };
            trackRestoredSession(req);
          }
        }
      }
    }

    if (!req.session || !req.session.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!isActiveSessionUser(req)) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    req.user = req.session.user;
    next();
  } catch (_) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
};
