const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  tasteProfile: [{
    type: String,
    trim: true
  }],
  dietaryRestrictions: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for text search
foodSchema.index({ name: 'text', description: 'text' });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food; 