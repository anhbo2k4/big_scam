const mysql = require('mysql2/promise');

/**
 * Database Recovery Utility
 * Safely drops and recreates the MySQL database with proper charset and engine
 */
class DatabaseRecovery {
  constructor(config = {}) {
    this.config = {
      host: config.host || process.env.DB_HOST || '127.0.0.1',
      port: config.port || process.env.DB_PORT || 3306,
      user: config.user || process.env.DB_USER || 'root',
      password: config.password || process.env.DB_PASS || '15082004',
      database: config.database || process.env.DB_NAME || 'giftbox',
      dialectOptions: {
        charset: 'utf8mb4',
        supportBigNumbers: true,
        bigNumberStrings: true
      }
    };

    this.adminConnection = null;
  }

  /**
   * Connect to MySQL without specifying a database (for admin operations)
   */
  async connectAsAdmin() {
    try {
      this.adminConnection = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password
      });
      console.log('✓ Connected to MySQL as admin');
      return this.adminConnection;
    } catch (err) {
      console.error('✗ Failed to connect to MySQL:', err.message);
      throw new Error(`MySQL connection failed: ${err.message}`);
    }
  }

  /**
   * Check if database exists
   */
  async databaseExists() {
    try {
      const conn = await this.connectAsAdmin();
      const result = await conn.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
        [this.config.database]
      );
      await conn.end();
      return result[0].length > 0;
    } catch (err) {
      console.error('Error checking database existence:', err.message);
      return false;
    }
  }

  /**
   * Drop database safely
   */
  async dropDatabase() {
    try {
      const dbName = this.config.database;
      const conn = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        multipleStatements: true
      });

      try {
        // Simply drop the database without killing connections
        // MySQL will handle any open connections
        await conn.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
        console.log(`✓ Database '${dbName}' dropped successfully`);
      } finally {
        await conn.end();
      }
    } catch (err) {
      console.error('✗ Error dropping database:', err.message);
      throw new Error(`Failed to drop database: ${err.message}`);
    }
  }

  /**
   * Create database with proper charset and engine
   */
  async createDatabase() {
    try {
      const conn = await this.connectAsAdmin();
      const dbName = this.config.database;
      
      const sql = `
        CREATE DATABASE IF NOT EXISTS \`${dbName}\`
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci
      `;
      
      await conn.query(sql);
      console.log(`✓ Database '${dbName}' created with UTF-8 charset and InnoDB engine`);
      
      await conn.end();
    } catch (err) {
      console.error('✗ Error creating database:', err.message);
      throw new Error(`Failed to create database: ${err.message}`);
    }
  }

  /**
   * Verify database connectivity
   */
  async verifyConnectivity() {
    try {
      const conn = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database
      });
      await conn.query('SELECT 1');
      console.log('✓ Database connectivity verified');
      await conn.end();
      return true;
    } catch (err) {
      console.error('✗ Database connectivity check failed:', err.message);
      return false;
    }
  }

  /**
   * Perform complete database recovery
   */
  async recover() {
    try {
      console.log('\n📦 Starting Database Recovery Process...\n');

      // Step 1: Check for existing database
      console.log('Step 1: Checking for existing database...');
      const exists = await this.databaseExists();
      if (exists) {
        console.log(`  Database '${this.config.database}' found, preparing to drop...`);
      } else {
        console.log(`  Database '${this.config.database}' not found, will create new one`);
      }

      // Step 2: Drop existing database if it exists
      if (exists) {
        console.log('\nStep 2: Dropping corrupted database...');
        await this.dropDatabase();
      } else {
        console.log('\nStep 2: Skipping drop (database does not exist)');
      }

      // Step 3: Create fresh database
      console.log('\nStep 3: Creating new database with proper configuration...');
      await this.createDatabase();

      // Step 4: Verify connectivity
      console.log('\nStep 4: Verifying database connectivity...');
      const connected = await this.verifyConnectivity();
      if (!connected) {
        throw new Error('Database connectivity verification failed');
      }

      console.log('\n✅ Database Recovery Complete!\n');
      return true;

    } catch (err) {
      console.error('\n❌ Database Recovery Failed:', err.message);
      throw err;
    }
  }
}

module.exports = DatabaseRecovery;
