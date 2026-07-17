'use strict';

/**
 * Migration 041 — Banner popup + design fields
 */

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`banners\`
        ADD COLUMN \`display_type\` ENUM('bar','popup','both') NOT NULL DEFAULT 'bar' AFTER \`location\`,
        ADD COLUMN \`popup_delay_ms\` INT(11) NOT NULL DEFAULT 800 AFTER \`display_type\`,
        ADD COLUMN \`popup_frequency\` ENUM('always','session','daily') NOT NULL DEFAULT 'session' AFTER \`popup_delay_ms\`,
        ADD COLUMN \`popup_dismissible\` TINYINT(1) NOT NULL DEFAULT 1 AFTER \`popup_frequency\`,
        ADD COLUMN \`cta_text\` VARCHAR(120) DEFAULT NULL AFTER \`text_color\`,
        ADD COLUMN \`cta_bg_color\` VARCHAR(32) DEFAULT NULL AFTER \`cta_text\`,
        ADD COLUMN \`cta_text_color\` VARCHAR(32) DEFAULT NULL AFTER \`cta_bg_color\`,
        ADD COLUMN \`design_json\` LONGTEXT DEFAULT NULL AFTER \`cta_text_color\`;
    `).catch(async (err) => {
      const msg = String(err && err.message || '');
      if (
        msg.includes('Duplicate column') ||
        msg.includes('already exists') ||
        msg.includes('ER_DUP_FIELDNAME')
      ) {
        return;
      }
      throw err;
    });

    console.log('✅ 041: banners popup/design columns ready');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`banners\`
        DROP COLUMN \`design_json\`,
        DROP COLUMN \`cta_text_color\`,
        DROP COLUMN \`cta_bg_color\`,
        DROP COLUMN \`cta_text\`,
        DROP COLUMN \`popup_dismissible\`,
        DROP COLUMN \`popup_frequency\`,
        DROP COLUMN \`popup_delay_ms\`,
        DROP COLUMN \`display_type\`;
    `).catch(() => {});
  }
};
