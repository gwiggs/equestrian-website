// backend/src/migrations/001_create_users_table.js
const { Pool } = require('pg');

/**
 * Migration to create users table with additional authentication columns
 */
async function up() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Check if table already exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('Users table already exists, adding authentication columns...');
      
      // Add authentication columns if they don't exist
      // Check if is_verified column exists
      const verifiedColumnCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'is_verified'
        );
      `);
      
      if (!verifiedColumnCheck.rows[0].exists) {
        await pool.query(`
          ALTER TABLE users 
          ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE,
          ADD COLUMN verification_token VARCHAR(255),
          ADD COLUMN reset_password_token VARCHAR(255),
          ADD COLUMN reset_password_expires TIMESTAMP;
        `);
        console.log('Added authentication columns to users table');
      } else {
        console.log('Authentication columns already exist');
      }
    } else {
      // Create the full users table
      await pool.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          phone VARCHAR(20),
          user_type VARCHAR(20) NOT NULL, -- buyer, seller, admin
          business_name VARCHAR(100),
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          is_verified BOOLEAN NOT NULL DEFAULT FALSE,
          verification_token VARCHAR(255),
          reset_password_token VARCHAR(255),
          reset_password_expires TIMESTAMP
        );
      `);
      console.log('Created users table');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

/**
 * Migration to revert users table creation
 * Note: This is destructive as it will drop the users table
 */
async function down() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // We don't actually drop the table here since it may be used by other parts
    // Instead, we just remove the authentication columns
    await pool.query(`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS is_verified,
      DROP COLUMN IF EXISTS verification_token,
      DROP COLUMN IF EXISTS reset_password_token,
      DROP COLUMN IF EXISTS reset_password_expires;
    `);
    console.log('Removed authentication columns from users table');
  } catch (error) {
    console.error('Migration rollback failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

module.exports = {
  up,
  down
};