'use strict';

/**
 * Migration 042 — Advanced banner popup fields
 */

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`banners\`
        ADD COLUMN \`aspect_ratio\` VARCHAR(16) NOT NULL DEFAULT '16:9' AFTER \`display_type\`,
        ADD COLUMN \`show_animation\` VARCHAR(32) NOT NULL DEFAULT 'zoom' AFTER \`popup_frequency\`,
        ADD COLUMN \`hide_animation\` VARCHAR(32) NOT NULL DEFAULT 'fade' AFTER \`show_animation\`,
        ADD COLUMN \`auto_close_ms\` INT(11) DEFAULT NULL AFTER \`hide_animation\`,
        ADD COLUMN \`design_html\` LONGTEXT DEFAULT NULL AFTER \`design_json\`,
        ADD COLUMN \`design_css\` LONGTEXT DEFAULT NULL AFTER \`design_html\`;
    `).catch((err) => {
      const msg = String(err && err.message || '');
      if (msg.includes('Duplicate column') || msg.includes('already exists') || msg.includes('ER_DUP_FIELDNAME')) return;
      throw err;
    });

    console.log('✅ 042: advanced banner popup fields ready');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`banners\`
        DROP COLUMN \`design_css\`,
        DROP COLUMN \`design_html\`,
        DROP COLUMN \`auto_close_ms\`,
        DROP COLUMN \`hide_animation\`,
        DROP COLUMN \`show_animation\`,
        DROP COLUMN \`aspect_ratio\`;
    `).catch(() => {});
  }
};
