const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')

require('dotenv').config();
const { isLocalPC } = require('../utils/envSetup');

const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DIALECT = process.env.DB_DIALECT
const IS_PROD = String(process.env.NODE_ENV || '').toLowerCase() === 'production'
const DEFAULT_DB_POOL_MAX = DIALECT === 'sqlite' ? 1 : Number(process.env.DB_POOL_MAX || (isLocalPC ? 5 : 30))
const DEFAULT_DB_POOL_MIN = DIALECT === 'sqlite' ? 0 : Number(process.env.DB_POOL_MIN || (isLocalPC ? 1 : 2))
const DB_POOL_MAX_CAP = DIALECT === 'sqlite'
  ? 1
  : Math.max(1, Math.floor(Number(process.env.DB_POOL_MAX_CAP || 50)) || 50)

function toPoolInteger(value, fallback) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.floor(parsed)
}

const configuredPoolMax = Math.max(
  1,
  Math.min(DB_POOL_MAX_CAP, toPoolInteger(process.env.DB_POOL_MAX, DEFAULT_DB_POOL_MAX))
)
const configuredPoolMin = Math.max(
  0,
  Math.min(configuredPoolMax, toPoolInteger(process.env.DB_POOL_MIN, DEFAULT_DB_POOL_MIN))
)

const buildSequelize = () => new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DIALECT,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: configuredPoolMax,
    min: configuredPoolMin,
    idle: Math.max(5000, Number(process.env.DB_POOL_IDLE || 10000)),
    acquire: Math.max(10000, Number(process.env.DB_POOL_ACQUIRE || 30000)),
    evict: Math.max(1000, Number(process.env.DB_POOL_EVICT || 1000))
  },
  charset: 'utf8mb4',
  dialectOptions: DIALECT === 'mysql' ? {
    charset: 'utf8mb4',
    supportBigNumbers: true
  } : {},
  // For sqlite (tests) allow configuring storage via env
  storage: DIALECT === 'sqlite' ? (process.env.DB_STORAGE || ':memory:') : undefined,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    underscored: true
  }
})

const sequelize = global.__giftboxSequelizeInstance || buildSequelize()
if (!global.__giftboxSequelizeInstance) {
  global.__giftboxSequelizeInstance = sequelize
}

if (DIALECT === 'mysql') {
  sequelize.afterConnect(async (connection) => {
    // Force connection/session charset to UTF-8 on every new pooled connection.
    const conn = (connection && typeof connection.promise === 'function')
      ? connection.promise()
      : connection;
    if (!conn || typeof conn.query !== 'function') return;

    await conn.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    await conn.query("SET character_set_connection = utf8mb4");
    await conn.query("SET character_set_client = utf8mb4");
    await conn.query("SET character_set_results = utf8mb4");
  });
}

const db = {}

fs.readdirSync(__dirname)
  .filter(f => f !== 'index.js' && f.endsWith('.js'))
  .forEach(file => {
    const modelFactory = require(path.join(__dirname, file))
    if (typeof modelFactory === 'function') {
      const model = modelFactory(sequelize, DataTypes)
      db[model.name] = model
    } else {
      
    }
  })

if (db.User && db.Permission) {
  db.User.belongsToMany(db.Permission, { 
    through: 'user_permissions', 
    foreignKey: 'user_id',
    otherKey: 'permission_id'
  })
  db.Permission.belongsToMany(db.User, { 
    through: 'user_permissions', 
    foreignKey: 'permission_id',
    otherKey: 'user_id'
  })
}

// AuditLog associations
if (db.AuditLog && db.User) {
  db.AuditLog.belongsTo(db.User, { 
    foreignKey: 'user_id',
    as: 'user',
    allowNull: true
  })
  db.User.hasMany(db.AuditLog, { 
    foreignKey: 'user_id',
    as: 'auditLogs'
  })
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
 
