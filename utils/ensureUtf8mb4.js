const db = require('../models');

async function listAllTables() {
  const [rows] = await db.sequelize.query('SHOW TABLES');
  if (!Array.isArray(rows)) return [];

  return rows
    .map((row) => {
      const keys = Object.keys(row || {});
      if (!keys.length) return '';
      return String(row[keys[0]] || '').trim();
    })
    .filter(Boolean);
}

async function ensureUtf8mb4() {
  const dialect = String(db?.sequelize?.getDialect?.() || '').toLowerCase();
  if (dialect !== 'mysql') return;

  // Keep database default charset/collation UTF-8 for newly created tables.
  await db.sequelize.query('ALTER DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');

  // Keep the current session in UTF-8 mode.
  await db.sequelize.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
  await db.sequelize.query('SET character_set_connection = utf8mb4');
  await db.sequelize.query('SET character_set_client = utf8mb4');
  await db.sequelize.query('SET character_set_results = utf8mb4');

  const tables = await listAllTables();
  for (const tableName of tables) {
    // Convert all character/text columns to utf8mb4 in one operation.
    await db.sequelize.query(`ALTER TABLE \`${tableName}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  }
}

module.exports = ensureUtf8mb4;
