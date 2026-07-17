'use strict';

/**
 * Migration 049 — compound index on chat_messages (session_code, created_at)
 *
 * Speeds up the common query: "fetch all messages for a session ordered by time".
 * MySQL can satisfy the WHERE + ORDER BY from a single index scan instead of a
 * filesort, which matters most once a session accumulates many messages.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Guard: skip creation if the index already exists (safe for re-deploys).
      const [rows] = await queryInterface.sequelize.query(
        `SELECT COUNT(*) AS cnt
         FROM INFORMATION_SCHEMA.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME   = 'chat_messages'
           AND INDEX_NAME   = 'idx_chat_messages_session_created'`,
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
      );
      if (rows && rows.cnt > 0) {
        await transaction.commit();
        return;
      }

      await queryInterface.addIndex(
        'chat_messages',
        ['session_code', 'created_at'],
        { name: 'idx_chat_messages_session_created', transaction }
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeIndex(
        'chat_messages',
        'idx_chat_messages_session_created',
        { transaction }
      );
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }
};
