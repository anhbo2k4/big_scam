const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = {
  up: async (db) => {
    try {
      // Check if admin user already exists
      const adminExists = await db.User.findOne({
        where: { username: 'admin' }
      });

      if (!adminExists) {
        // Create default admin account
        const adminUser = await db.User.create({
          username: 'admin',
          email: 'admin@giftbox.local',
          full_name: 'CSKH Manh Lam',
          password_hash: hashPassword('admin123'),
          role: 'admin',
          is_active: true
        });

        console.log('✓ Default admin account created (admin / admin123)');

        // Create default permissions
        const permissions = await db.Permission.bulkCreate([
          {
            name: 'Quản lý phiên chơi',
            code: 'manage_sessions',
            description: 'Tạo, sửa, xóa phiên chơi',
            category: 'sessions',
            is_active: true
          },
          {
            name: 'Quản lý người dùng',
            code: 'manage_users',
            description: 'Tạo, sửa, xóa tài khoản người dùng',
            category: 'users',
            is_active: true
          },
          {
            name: 'Quản lý quyền',
            code: 'manage_permissions',
            description: 'Gán quyền cho người dùng',
            category: 'permissions',
            is_active: true
          },
          {
            name: 'Xem báo cáo',
            code: 'view_reports',
            description: 'Xem báo cáo thống kê',
            category: 'analytics',
            is_active: true
          },
          {
            name: 'Quản lý giải thưởng',
            code: 'manage_prizes',
            description: 'Cập nhật thông tin giải thưởng',
            category: 'prizes',
            is_active: true
          }
        ]);

        console.log('✓ Created 5 default permissions');

        // Assign all permissions to admin
        await adminUser.addPermissions(permissions);
        console.log('✓ Assigned all permissions to admin user');
      } else {
        console.log('✓ Admin account already exists');
      }
    } catch (error) {
      console.error('Migration error:', error.message);
      throw error;
    }
  }
};
