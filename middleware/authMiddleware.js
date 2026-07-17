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

    
    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(401).json({ message: 'Vui lòng đăng nhập' });
    }
    
    return res.redirect('/admin/login');
  }
  
  // Set req.user from session for consistency
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  
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
      
      if (req.accepts('json') && !req.accepts('html')) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập' });
      }
      
      return res.redirect('/admin/login');
    }
  }

  if (req.session.user.role !== 'admin') {
    
    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này' });
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
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Vui lòng đăng nhập' });
    }

    const hasPermission = req.session.user.permissions.some(p => p.code === permissionCode);

    if (!hasPermission) {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
    }

    // Set req.user from session for consistency
    if (req.session && req.session.user) {
      req.user = req.session.user;
    }

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

    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access only' });
    }

    req.user = req.session.user;
    next();
  } catch (_) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
};
