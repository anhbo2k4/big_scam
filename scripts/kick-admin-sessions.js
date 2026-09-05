require('dotenv').config({ quiet: true });
const db = require('../models');

(async () => {
  const transaction = await db.sequelize.transaction();
  try {
    const [rows] = await db.sequelize.query('SELECT `sid`, `data` FROM `sessions`', { transaction });
    const adminSessionIds = rows.flatMap((row) => {
      try {
        const payload = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        return payload?.user?.role === 'admin' ? [row.sid] : [];
      } catch (_) {
        return [];
      }
    });

    let deleted = 0;
    let trackerUpdated = 0;
    const now = new Date();
    for (const sessionId of adminSessionIds) {
      const [, deleteMeta] = await db.sequelize.query(
        'DELETE FROM `sessions` WHERE `sid` = :sessionId',
        { replacements: { sessionId }, transaction }
      );
      deleted += Number(deleteMeta?.affectedRows || deleteMeta || 0);

      if (db.UserSession) {
        const [count] = await db.UserSession.update(
          { status: 'logged_out', is_authenticated: false, logout_at: now },
          { where: { session_id: sessionId }, transaction }
        );
        trackerUpdated += count;
      }
    }

    await transaction.commit();
    console.log(JSON.stringify({ matched: adminSessionIds.length, deleted, trackerUpdated }));
  } catch (error) {
    await transaction.rollback();
    throw error;
  } finally {
    await db.sequelize.close();
  }
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
