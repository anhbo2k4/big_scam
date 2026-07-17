module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AuditLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Reference to User (admin or system user performing action)'
    },
    session_code: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Reference to GameSession'
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type of action: SESSION_CREATE, BOX_OPEN, USER_CREATED, USER_DELETED, etc'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Human-readable description of the action'
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Client IP address'
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Browser user agent string'
    },
    details: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Additional action details'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'success',
      comment: 'success or failure'
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'audit_logs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { fields: ['session_code'] },
      { fields: ['action'] },
      { fields: ['ip_address'] },
      { fields: ['created_at'] }
    ]
  })
}
