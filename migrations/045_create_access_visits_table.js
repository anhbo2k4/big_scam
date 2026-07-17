'use strict';

/**
 * Migration 045 - Create access_visits table for site-wide IP/page tracking
 */

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`access_visits\` (
        \`id\` INT(11) NOT NULL AUTO_INCREMENT,
        \`ip_address\` VARCHAR(45) NOT NULL,
        \`hit_count\` INT(11) NOT NULL DEFAULT 0,
        \`visited_paths\` LONGTEXT DEFAULT NULL,
        \`first_seen_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`last_seen_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`access_visits_ip_unique\` (\`ip_address\`),
        KEY \`access_visits_last_seen_idx\` (\`last_seen_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ 045: access_visits ready');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS \`access_visits\`;').catch(() => {});
  }
};
