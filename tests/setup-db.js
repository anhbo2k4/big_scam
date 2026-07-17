/**
 * Jest Setup - Database Initialization
 * This runs before any tests to ensure the database is ready
 */

process.env.NODE_ENV = 'test';
process.env.JEST_WORKER_ID = process.env.JEST_WORKER_ID || '1';

// tests are executed from the `tests/` folder, so reference the project-level models
// Use sqlite in-memory for tests to avoid MySQL schema/index limits during CI/local unit tests
process.env.DB_DIALECT = 'sqlite';
process.env.DB_STORAGE = ':memory:';
const db = require('../models');

module.exports = async () => {
  try {
    // Authenticate to database
    await db.sequelize.authenticate();
    console.log('✓ Database authenticated');

    // Sync models
    await db.sequelize.sync({ alter: true });
    console.log('✓ Database synced');
  } catch (err) {
    console.error('Database setup failed:', err.message);
    throw err;
  }
};
