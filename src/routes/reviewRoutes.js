const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReview,
  getFoodReviews,
  submitReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Get all reviews
router.get('/', getAllReviews);

// Get single review
router.get('/:id', getReview);

// Get reviews for a food item
router.get('/foods/:foodId/reviews', getFoodReviews);

// Submit a review
router.post('/foods/:foodId/reviews', auth, submitReview);

// Update a review
router.put('/reviews/:id', auth, updateReview);

// Delete a review
router.delete('/reviews/:id', auth, deleteReview);

module.exports = router; 