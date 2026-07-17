'use strict';

/**
 * Migration 039 — Banners Table
 *
 * Uses raw SQL CREATE TABLE IF NOT EXISTS — reliable on all MySQL hosting.
 */

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`banners\` (
        \`id\`          INT(11)       NOT NULL AUTO_INCREMENT,
        \`text\`        TEXT          DEFAULT NULL,
        \`image_url\`   VARCHAR(512)  DEFAULT NULL,
        \`link_url\`    VARCHAR(512)  DEFAULT NULL,
        \`link_target\` ENUM('_blank','_self') NOT NULL DEFAULT '_blank',
        \`location\`    ENUM('game','home','both') NOT NULL DEFAULT 'both',
        \`bg_color\`    VARCHAR(32)   DEFAULT NULL,
        \`text_color\`  VARCHAR(32)   DEFAULT NULL,
        \`is_active\`   TINYINT(1)   NOT NULL DEFAULT 1,
        \`sort_order\`  INT(11)      NOT NULL DEFAULT 0,
        \`created_by\`  VARCHAR(64)   DEFAULT NULL,
        \`created_at\`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ 039: banners table ready (CREATE IF NOT EXISTS)');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS `banners`;').catch(() => {});
  }
};
