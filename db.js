const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool with updated connection settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Disable SSL for local PostgreSQL
});

// Log successful connection
pool.on('connect', () => {
  console.log('✅ Database connection established');
});

// Log connection errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Enhanced query function with logging
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`✅ Query executed in ${duration}ms: ${text}`);
    return res;
  } catch (error) {
    console.error(`❌ Query failed: ${text}`, error);
    throw error;
  }
};

module.exports = {
  query,
  pool
};
