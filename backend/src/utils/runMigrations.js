// backend/src/utils/runMigrations.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

/**
 * Run all migrations in order
 * @param {boolean} down - Whether to run migrations down (rollback) instead of up
 */
async function runMigrations(down = false) {
  console.log(`Running migrations ${down ? 'down' : 'up'}...`);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Ensure migrations table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Get all migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort(); // Sort to ensure order

    if (down) {
      // Run migrations in reverse order for down
      migrationFiles.reverse();
    }

    // Get already executed migrations
    const { rows: executedMigrations } = await pool.query(
      'SELECT name FROM migrations'
    );
    const executedMigrationNames = executedMigrations.map(m => m.name);

    // Process each migration
    for (const file of migrationFiles) {
      const migrationName = file.replace('.js', '');
      const migrationPath = path.join(migrationsDir, file);
      const migration = require(migrationPath);

      if (down) {
        // Only run down for executed migrations
        if (executedMigrationNames.includes(migrationName)) {
          console.log(`Rolling back migration: ${migrationName}`);
          await migration.down();
          await pool.query(
            'DELETE FROM migrations WHERE name = $1',
            [migrationName]
          );
          console.log(`Rolled back migration: ${migrationName}`);
        }
      } else {
        // Only run migrations that haven't been executed yet
        if (!executedMigrationNames.includes(migrationName)) {
          console.log(`Executing migration: ${migrationName}`);
          await migration.up();
          await pool.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [migrationName]
          );
          console.log(`Completed migration: ${migrationName}`);
        } else {
          console.log(`Skipping already executed migration: ${migrationName}`);
        }
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// When run directly from command line
if (require.main === module) {
  const down = process.argv.includes('--down');
  runMigrations(down)
    .then(() => {
      console.log('Migration process completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = runMigrations;