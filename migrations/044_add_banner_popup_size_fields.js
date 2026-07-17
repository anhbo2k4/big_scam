'use strict';

/**
 * Migration 044 — Banner popup custom size fields
 */

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`banners\`
        ADD COLUMN \`popup_width\` VARCHAR(16) DEFAULT NULL AFTER \`aspect_ratio\`,
        ADD COLUMN \`popup_height\` VARCHAR(16) DEFAULT NULL AFTER \`popup_width\`;
    `).catch((err) => {
      const msg = String(err && err.message || '');
      if (msg.includes('Duplicate column') || msg.includes('already exists') || msg.includes('ER_DUP_FIELDNAME')) return;
      throw err;
    });

    console.log('✅ 044: banner popup size fields ready');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`banners\`
        DROP COLUMN \`popup_height\`,
        DROP COLUMN \`popup_width\`;
    `).catch(() => {});
  }
};
