const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    console.log('Checking admin status for user:', req.user.id);
    const result = await db.query(
      'SELECT role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!result.rows[0]) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    if (result.rows[0].role !== 'admin') {
      console.log('User is not admin');
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    console.log('User is admin, proceeding');
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Server error during admin check' });
  }
};

// Apply authentication and admin check to all routes
router.use(authenticateToken, isAdmin);

// Get all foods for admin
router.get('/foods', async (req, res) => {
  try {
    console.log('Fetching all foods for admin');
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
    console.log('Successfully fetched foods:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ error: 'Failed to fetch foods', details: error.message });
  }
});

// Add new food
router.post('/foods', async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    if (!name || !description || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await db.query(
      'INSERT INTO foods (name, description, image_url, region_id) VALUES ($1, $2, $3, 1) RETURNING *',
      [name, description, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(500).json({ error: 'Failed to add food', details: error.message });
  }
});

// Update food
router.put('/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region_name, description, price, image_url } = req.body;
    
    if (!name || !region_name || !description || !price || !image_url) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // First get the region_id
    const regionResult = await db.query(
      'SELECT id FROM regions WHERE name = $1',
      [region_name]
    );

    if (regionResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid region name' });
    }

    const region_id = regionResult.rows[0].id;

    const result = await db.query(
      'UPDATE foods SET name = $1, description = $2, image_url = $3, region_id = $4, price = $5 WHERE id = $6 RETURNING *',
      [name, description, image_url, region_id, price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(500).json({ error: 'Failed to update food', details: error.message });
  }
});

// Delete food
router.delete('/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM foods WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }

    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ error: 'Failed to delete food', details: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('Fetching dashboard statistics');
    const stats = await Promise.all([
      // Total number of foods
      db.query('SELECT COUNT(*) as total_foods FROM foods'),
      // Total number of users
      db.query('SELECT COUNT(*) as total_users FROM users'),
      // Total number of reviews
      db.query('SELECT COUNT(*) as total_reviews FROM reviews'),
      // Average rating
      db.query('SELECT COALESCE(AVG(rating)::numeric(10,2), 0) as avg_rating FROM reviews'),
      // Recent activity
      db.query(`
        SELECT 
          'food' as type,
          f.name as item,
          'System' as user,
          f.created_at as date
        FROM foods f
        UNION ALL
        SELECT 
          'review' as type,
          f.name as item,
          u.username as user,
          r.created_at as date
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN foods f ON r.food_id = f.id
        ORDER BY date DESC
        LIMIT 5
      `)
    ]);

    console.log('Successfully fetched all statistics');
    res.json({
      totalFoods: parseInt(stats[0].rows[0].total_foods),
      totalUsers: parseInt(stats[1].rows[0].total_users),
      totalReviews: parseInt(stats[2].rows[0].total_reviews),
      averageRating: parseFloat(stats[3].rows[0].avg_rating) || 0,
      recentActivity: stats[4].rows
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    console.log('Fetching all users for admin');
    const result = await db.query(`
      SELECT 
        id,
        username,
        email,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);
    console.log('Successfully fetched users:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

module.exports = router;
