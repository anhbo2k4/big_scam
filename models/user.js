module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true },
    email: DataTypes.STRING,
    full_name: DataTypes.STRING,
    password_hash: DataTypes.TEXT,
    plain_password_enc: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mật khẩu mã hóa base64 để admin xem'
    },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    role: { 
      type: DataTypes.STRING, 
      defaultValue: 'user',
      comment: 'admin, manager, user'
    },
    trust_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      comment: 'Điểm tín nhiệm người dùng (0-100)'
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Admin nào tạo người dùng này'
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Admin nào cập nhật gần nhất'
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true
  })
}
