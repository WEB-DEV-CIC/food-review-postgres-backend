const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  foodItem: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true
  },
  images: [{
    type: String, // URLs to uploaded images
  }],
  user: {
    type: String,
    required: [true, 'User identifier is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema); 