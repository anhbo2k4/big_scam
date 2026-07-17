'use strict';

/**
 * Migration 046 - Add browser/device client signatures to access_visits
 */

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`access_visits\`
        ADD COLUMN \`client_signatures\` LONGTEXT NULL AFTER \`visited_paths\`,
        ADD COLUMN \`client_count\` INT(11) NOT NULL DEFAULT 0 AFTER \`client_signatures\`,
        ADD COLUMN \`last_user_agent\` VARCHAR(255) NULL AFTER \`client_count\`;
    `).catch((err) => {
      const msg = String(err && err.message || '');
      if (msg.includes('Duplicate column') || msg.includes('already exists') || msg.includes('ER_DUP_FIELDNAME')) return;
      throw err;
    });

    console.log('✅ 046: access_visits client signature fields ready');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`access_visits\`
        DROP COLUMN \`last_user_agent\`,
        DROP COLUMN \`client_count\`,
        DROP COLUMN \`client_signatures\`;
    `).catch(() => {});
  }
};
