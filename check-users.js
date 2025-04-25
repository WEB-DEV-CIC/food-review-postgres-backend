const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Disable SSL for local PostgreSQL
});

async function checkUsers() {
  try {
    const result = await pool.query('SELECT * FROM users');
    console.log('Users in database:', result.rows);
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await pool.end();
  }
}

checkUsers();