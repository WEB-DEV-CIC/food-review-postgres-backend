const express = require('express');
const router = express.Router();
const Food = require('../models/food');
const auth = require('../middleware/auth');

// Get all foods with optional filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, cuisine } = req.query;
    const query = {};

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Add cuisine filter if provided
    if (cuisine) {
      query.cuisine = cuisine;
    }

    const foods = await Food.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await Food.countDocuments(query);

    res.json({
      foods,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ message: 'Error fetching foods' });
  }
});

// Get featured foods
router.get('/featured', async (req, res) => {
  try {
    const featuredFoods = await Food.find({ isFeatured: true })
      .sort({ rating: -1 })
      .limit(6);
    res.json(featuredFoods);
  } catch (error) {
    console.error('Error fetching featured foods:', error);
    res.status(500).json({ message: 'Error fetching featured foods' });
  }
});

// Get available cuisines
router.get('/cuisines', async (req, res) => {
  try {
    const cuisines = await Food.distinct('cuisine');
    res.json(cuisines);
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    res.status(500).json({ message: 'Error fetching cuisines' });
  }
});

// Get food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ message: 'Error fetching food' });
  }
});

// Get reviews for a food
router.get('/:id/reviews', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Submit a review for a food
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const review = {
      userId: req.user.id,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
    };

    food.reviews.push(review);
    await food.save();

    res.status(201).json(review);
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

module.exports = router; 