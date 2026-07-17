'use strict';

/**
 * Migration 040 — Create Missing Tables
 *
 * Uses raw SQL CREATE TABLE IF NOT EXISTS — reliable on all MySQL hosting.
 * Tables: permissions, ui_customizations, prize_icons
 */

module.exports = {
  async up(queryInterface) {
    const q = queryInterface.sequelize;

    // ── permissions ────────────────────────────────────────────────
    await q.query(`
      CREATE TABLE IF NOT EXISTS \`permissions\` (
        \`id\`          INT(11)      NOT NULL AUTO_INCREMENT,
        \`name\`        VARCHAR(191) NOT NULL,
        \`code\`        VARCHAR(191) NOT NULL,
        \`description\` TEXT         DEFAULT NULL,
        \`category\`    VARCHAR(64)  NOT NULL DEFAULT 'system',
        \`is_active\`   TINYINT(1)  NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`permissions_name_unique\` (\`name\`),
        UNIQUE KEY \`permissions_code_unique\` (\`code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ 040: permissions ready');

    // ── ui_customizations ──────────────────────────────────────────
    await q.query(`
      CREATE TABLE IF NOT EXISTS \`ui_customizations\` (
        \`id\`                       INT(11)     NOT NULL AUTO_INCREMENT,
        \`game_title\`               TEXT        DEFAULT NULL,
        \`game_subtitle\`            TEXT        DEFAULT NULL,
        \`button_text\`              TEXT        DEFAULT NULL,
        \`completion_message\`       TEXT        DEFAULT NULL,
        \`logo_url\`                 TEXT        DEFAULT NULL,
        \`logo_height\`              INT(11)     DEFAULT NULL,
        \`favicon_url\`              TEXT        DEFAULT NULL,
        \`show_unlucky_popup\`       TINYINT(1)  DEFAULT 1,
        \`allow_reopen_result_popup\` TINYINT(1) DEFAULT 0,
        \`header_scripts\`           TEXT        DEFAULT NULL,
        \`body_scripts\`             TEXT        DEFAULT NULL,
        \`footer_scripts\`           TEXT        DEFAULT NULL,
        \`created_at\`               DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\`               DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ 040: ui_customizations ready');

    // ── prize_icons ────────────────────────────────────────────────
    await q.query(`
      CREATE TABLE IF NOT EXISTS \`prize_icons\` (
        \`id\`        INT(11)      NOT NULL AUTO_INCREMENT,
        \`name\`      VARCHAR(191) DEFAULT NULL,
        \`icon_path\` TEXT         DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ 040: prize_icons ready');
  },

  async down(queryInterface) {
    const q = queryInterface.sequelize;
    await q.query('DROP TABLE IF EXISTS `prize_icons`;').catch(() => {});
    await q.query('DROP TABLE IF EXISTS `ui_customizations`;').catch(() => {});
    await q.query('DROP TABLE IF EXISTS `permissions`;').catch(() => {});
  }
};
