require('dotenv').config();
const { Pool } = require('pg');

// Create a new pool using the full connection string and SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // ✅ Required by Neon
  }
});

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected to Neon DB at:', res.rows[0].now);
  } catch (error) {
    console.error('❌ Failed to connect to Neon DB:', error.message);
  } finally {
    await pool.end();
  }
})();
