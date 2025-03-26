const express = require('express');
const router = express.Router();
const {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
} = require('../controllers/food');

// Get all foods with filtering and pagination
router.get('/', getAllFoods);

// Get a single food by ID
router.get('/:id', getFoodById);

// Create a new food
router.post('/', createFood);

// Update a food
router.put('/:id', updateFood);

// Delete a food
router.delete('/:id', deleteFood);

module.exports = router; 