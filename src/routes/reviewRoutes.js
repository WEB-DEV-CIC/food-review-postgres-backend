const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

router.route('/')
  .get(getAllReviews)
  .post(createReview);

router.route('/:id')
  .get(getReview)
  .put(updateReview)
  .delete(deleteReview);

module.exports = router; 