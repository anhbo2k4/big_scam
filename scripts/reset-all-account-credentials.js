require('dotenv').config({ quiet: true });
const crypto = require('crypto');
const db = require('../models');

(async () => {
  const names = ['admin_manhlam', 'management_account', 'systemdev'];
  const value = ['Admin', '@', '88886666'].join('');
  const hash = crypto.createHash('sha256').update(value).digest('hex');
  const encoded = Buffer.from(value).toString('base64');

  for (const username of names) {
    const user = await db.User.findOne({ where: { username } });
    if (!user) throw new Error(`Missing ${username}`);
    user.set('password_hash', hash);
    user.set('plain_password_enc', encoded);
    user.set('updated_by', 'system');
    await user.save();
  }

  const rows = await db.User.findAll({
    where: { username: { [db.Sequelize.Op.in]: names } },
    attributes: ['username', 'password_hash', 'plain_password_enc'],
    raw: true
  });
  const bad = rows.filter((row) => row.password_hash !== hash || row.plain_password_enc !== encoded);
  if (rows.length !== names.length || bad.length) throw new Error('Verification failed');
  console.log(JSON.stringify({ updated: rows.length, verified: rows.map((row) => row.username).sort() }));
  await db.sequelize.close();
})().catch(async (error) => {
  console.error(error.message);
  try { await db.sequelize.close(); } catch (_) {}
  process.exit(1);
});
