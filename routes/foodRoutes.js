const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all foods with their details
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        f.*,
        r.name as region_name,
        array_agg(DISTINCT i.name) as ingredients,
        array_agg(DISTINCT tp.name) as taste_profiles,
        COALESCE(AVG(rv.rating), 0) as average_rating,
        COUNT(rv.id) as review_count,
        f.price
      FROM foods f
      LEFT JOIN regions r ON f.region_id = r.id
      LEFT JOIN food_ingredients fi ON f.id = fi.food_id
      LEFT JOIN ingredients i ON fi.ingredient_id = i.id
      LEFT JOIN food_taste_profiles ftp ON f.id = ftp.food_id
      LEFT JOIN taste_profiles tp ON ftp.taste_profile_id = tp.id
      LEFT JOIN reviews rv ON f.id = rv.food_id
      GROUP BY f.id, r.name
      ORDER BY f.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get food by ID with all details
router.get('/:id', async (req, res) => {
  try {
    // Get food details
    const foodResult = await db.query(`
      SELECT 
        f.*,
        r.name as region_name,
        array_agg(DISTINCT i.name) as ingredients,
        array_agg(DISTINCT tp.name) as taste_profiles,
        COALESCE(AVG(rv.rating), 0) as average_rating,
        COUNT(rv.id) as review_count,
        f.price
      FROM foods f
      LEFT JOIN regions r ON f.region_id = r.id
      LEFT JOIN food_ingredients fi ON f.id = fi.food_id
      LEFT JOIN ingredients i ON fi.ingredient_id = i.id
      LEFT JOIN food_taste_profiles ftp ON f.id = ftp.food_id
      LEFT JOIN taste_profiles tp ON ftp.taste_profile_id = tp.id
      LEFT JOIN reviews rv ON f.id = rv.food_id
      WHERE f.id = $1
      GROUP BY f.id, r.name
    `, [req.params.id]);
    
    if (foodResult.rows.length === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }

    // Get reviews
    const reviewsResult = await db.query(`
      SELECT 
        r.*,
        u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.food_id = $1
      ORDER BY r.created_at DESC
    `, [req.params.id]);

    // Combine food details with reviews
    const response = {
      ...foodResult.rows[0],
      reviews: reviewsResult.rows
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching food details:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new food
router.post('/', async (req, res) => {
  const { name, description, region_id, image_url, ingredients, taste_profiles } = req.body;
  
  try {
    // Start transaction
    await db.query('BEGIN');
    
    // Insert food
    const foodResult = await db.query(
      'INSERT INTO foods (name, description, region_id, image_url) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, description, region_id, image_url]
    );
    const foodId = foodResult.rows[0].id;
    
    // Insert ingredients
    for (const ingredient of ingredients) {
      await db.query(
        'INSERT INTO food_ingredients (food_id, ingredient_id) VALUES ($1, (SELECT id FROM ingredients WHERE name = $2))',
        [foodId, ingredient]
      );
    }
    
    // Insert taste profiles
    for (const taste of taste_profiles) {
      await db.query(
        'INSERT INTO food_taste_profiles (food_id, taste_profile_id) VALUES ($1, (SELECT id FROM taste_profiles WHERE name = $2))',
        [foodId, taste]
      );
    }
    
    await db.query('COMMIT');
    
    // Return the created food with all details
    const result = await db.query(`
      SELECT 
        f.*,
        r.name as region_name,
        array_agg(DISTINCT i.name) as ingredients,
        array_agg(DISTINCT tp.name) as taste_profiles,
        COALESCE(AVG(rv.rating), 0) as average_rating,
        COUNT(rv.id) as review_count,
        f.price
      FROM foods f
      LEFT JOIN regions r ON f.region_id = r.id
      LEFT JOIN food_ingredients fi ON f.id = fi.food_id
      LEFT JOIN ingredients i ON fi.ingredient_id = i.id
      LEFT JOIN food_taste_profiles ftp ON f.id = ftp.food_id
      LEFT JOIN taste_profiles tp ON ftp.taste_profile_id = tp.id
      WHERE f.id = $1
      GROUP BY f.id, r.name
    `, [foodId]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: 'Database error' });
  }
});

// Update food
router.put('/:id', async (req, res) => {
  const { name, description, region_id, image_url, ingredients, taste_profiles } = req.body;
  
  try {
    await db.query('BEGIN');
    
    // Update food
    await db.query(
      'UPDATE foods SET name = $1, description = $2, region_id = $3, image_url = $4 WHERE id = $5',
      [name, description, region_id, image_url, req.params.id]
    );
    
    // Delete existing ingredients and taste profiles
    await db.query('DELETE FROM food_ingredients WHERE food_id = $1', [req.params.id]);
    await db.query('DELETE FROM food_taste_profiles WHERE food_id = $1', [req.params.id]);
    
    // Insert new ingredients
    for (const ingredient of ingredients) {
      await db.query(
        'INSERT INTO food_ingredients (food_id, ingredient_id) VALUES ($1, (SELECT id FROM ingredients WHERE name = $2))',
        [req.params.id, ingredient]
      );
    }
    
    // Insert new taste profiles
    for (const taste of taste_profiles) {
      await db.query(
        'INSERT INTO food_taste_profiles (food_id, taste_profile_id) VALUES ($1, (SELECT id FROM taste_profiles WHERE name = $2))',
        [req.params.id, taste]
      );
    }
    
    await db.query('COMMIT');
    
    // Return updated food with all details
    const result = await db.query(`
      SELECT 
        f.*,
        r.name as region_name,
        array_agg(DISTINCT i.name) as ingredients,
        array_agg(DISTINCT tp.name) as taste_profiles,
        COALESCE(AVG(rv.rating), 0) as average_rating,
        COUNT(rv.id) as review_count,
        f.price
      FROM foods f
      LEFT JOIN regions r ON f.region_id = r.id
      LEFT JOIN food_ingredients fi ON f.id = fi.food_id
      LEFT JOIN ingredients i ON fi.ingredient_id = i.id
      LEFT JOIN food_taste_profiles ftp ON f.id = ftp.food_id
      LEFT JOIN taste_profiles tp ON ftp.taste_profile_id = tp.id
      WHERE f.id = $1
      GROUP BY f.id, r.name
    `, [req.params.id]);
    
    res.json(result.rows[0]);
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete food
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM foods WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json({ message: 'Food deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get food reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        r.*,
        u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.food_id = $1
      ORDER BY r.created_at DESC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Submit a review for a food
router.post('/:id/reviews', async (req, res) => {
  const { rating, comment } = req.body;
  const foodId = req.params.id;
  const userId = req.user.id; // Get user ID from authenticated user

  try {
    // Check if user has already reviewed this food
    const existingReview = await db.query(
      'SELECT id FROM reviews WHERE food_id = $1 AND user_id = $2',
      [foodId, userId]
    );
    
    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this food' });
    }

    // Insert the new review
    const result = await db.query(
      'INSERT INTO reviews (food_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [foodId, userId, rating, comment]
    );

    // Get the review with user details
    const reviewWithUser = await db.query(`
      SELECT 
        r.*,
        u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `, [result.rows[0].id]);

    res.status(201).json(reviewWithUser.rows[0]);
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
