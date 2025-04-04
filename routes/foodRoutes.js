const express = require('express');
const router = express.Router();
const db = require('../db');

// get all foods
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM foods');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// get food by id
router.get('/:id', async (req, res) => {
  const foodId = req.params.id;
  try {
    const result = await db.query('SELECT * FROM foods WHERE id = $1', [foodId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
