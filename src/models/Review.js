const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: [true, 'Food ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ foodId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 