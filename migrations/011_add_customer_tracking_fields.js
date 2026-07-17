module.exports = {
  name: '011_add_customer_tracking_fields',
  async up(db) {
    const { sequelize } = db;
    try {
      // Add customer fields to withdrawals
      await sequelize.query(`
        ALTER TABLE withdrawals 
        ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
        ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20),
        ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
        ADD COLUMN IF NOT EXISTS customer_ip VARCHAR(50),
        ADD COLUMN IF NOT EXISTS customer_cookie_id VARCHAR(255) UNIQUE
      `);

      // Add customer fields to gift_exchanges
      await sequelize.query(`
        ALTER TABLE gift_exchanges 
        ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
        ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20),
        ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
        ADD COLUMN IF NOT EXISTS customer_ip VARCHAR(50),
        ADD COLUMN IF NOT EXISTS customer_cookie_id VARCHAR(255) UNIQUE
      `);

      console.log('✅ Migration 011: Added customer tracking fields');
    } catch (error) {
      console.error('❌ Migration 011 error:', error);
      throw error;
    }
  }
};
