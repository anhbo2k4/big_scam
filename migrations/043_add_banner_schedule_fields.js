'use strict';

/**
 * Migration 043 — Banner schedule window
 */

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`banners\`
        ADD COLUMN \`start_at\` DATETIME NULL DEFAULT NULL AFTER \`auto_close_ms\`,
        ADD COLUMN \`end_at\` DATETIME NULL DEFAULT NULL AFTER \`start_at\`;
    `).catch((err) => {
      const msg = String(err && err.message || '');
      if (msg.includes('Duplicate column') || msg.includes('already exists') || msg.includes('ER_DUP_FIELDNAME')) return;
      throw err;
    });

    console.log('✅ 043: banner schedule fields ready');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`banners\`
        DROP COLUMN \`end_at\`,
        DROP COLUMN \`start_at\`;
    `).catch(() => {});
  }
};
