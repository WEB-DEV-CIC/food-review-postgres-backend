const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, role, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role, created_at',
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let query = 'UPDATE users SET username = $1, email = $2';
    const values = [username, email];
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = $3';
      values.push(hashedPassword);
    }
    
    query += ' WHERE id = $' + (values.length + 1) + ' RETURNING id, username, email, role, created_at';
    values.push(req.params.id);
    
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router; 