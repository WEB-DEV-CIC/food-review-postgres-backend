require('dotenv').config();
const { Pool } = require('pg');

// Create a new pool with updated connection settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Disable SSL for local PostgreSQL
});

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected to local PostgreSQL DB at:', res.rows[0].now);
  } catch (error) {
    console.error('❌ Failed to connect to local PostgreSQL DB:', error.message);
  } finally {
    await pool.end();
  }
})();
