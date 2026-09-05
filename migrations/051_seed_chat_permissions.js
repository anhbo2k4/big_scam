const permissions = [
  ['chat.view', 'Xem chat'],
  ['chat.send', 'Gửi tin nhắn chat'],
  ['chat.assign', 'Phân công chat'],
  ['chat.edit', 'Sửa tin nhắn chat'],
  ['chat.delete', 'Xóa dữ liệu chat']
];

module.exports = {
  up: async (queryInterface) => {
    const table = 'permissions';
    const existing = await queryInterface.sequelize.query(
      'SELECT code FROM permissions WHERE code IN (:codes)',
      { replacements: { codes: permissions.map(([code]) => code) }, type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const known = new Set(existing.map(row => row.code));
    const now = new Date();
    for (const [code, name] of permissions) {
      if (!known.has(code)) {
        await queryInterface.bulkInsert(table, [{ code, name, description: name, category: 'chat', is_active: true, created_at: now, updated_at: now }]);
      }
    }
  }
};
