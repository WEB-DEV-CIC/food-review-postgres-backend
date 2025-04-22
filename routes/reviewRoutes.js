const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        r.*,
        u.username,
        f.name as food_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN foods f ON r.food_id = f.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get review by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        r.*,
        u.username,
        f.name as food_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN foods f ON r.food_id = f.id
      WHERE r.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new review
router.post('/', async (req, res) => {
  const { food_id, rating, comment } = req.body;
  const user_id = req.user.id; // Get user ID from authenticated user
  
  try {
    // Check if user has already reviewed this food
    const existingReview = await db.query(
      'SELECT id FROM reviews WHERE food_id = $1 AND user_id = $2',
      [food_id, user_id]
    );
    
    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'User has already reviewed this food' });
    }
    
    const result = await db.query(
      'INSERT INTO reviews (food_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [food_id, user_id, rating, comment]
    );
    
    // Get review with user and food details
    const reviewWithDetails = await db.query(`
      SELECT 
        r.*,
        u.username,
        f.name as food_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN foods f ON r.food_id = f.id
      WHERE r.id = $1
    `, [result.rows[0].id]);
    
    res.status(201).json(reviewWithDetails.rows[0]);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update review
router.put('/:id', async (req, res) => {
  const { rating, comment } = req.body;
  
  try {
    const result = await db.query(
      'UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3 RETURNING *',
      [rating, comment, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Get updated review with user and food details
    const reviewWithDetails = await db.query(`
      SELECT 
        r.*,
        u.username,
        f.name as food_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN foods f ON r.food_id = f.id
      WHERE r.id = $1
    `, [req.params.id]);
    
    res.json(reviewWithDetails.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM reviews WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router; 