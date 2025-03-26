const Food = require('../models/food');

// Get all foods with filtering and pagination
const getAllFoods = async (req, res) => {
  try {
    const {
      region,
      tasteProfile,
      dietaryRestrictions,
      search,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};
    
    if (region) query.region = region;
    if (tasteProfile) query.tasteProfile = tasteProfile;
    if (dietaryRestrictions) query.dietaryRestrictions = dietaryRestrictions;
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    // Execute query
    const foods = await Food.find(query)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parsedLimit);

    // Get total count for pagination
    const total = await Food.countDocuments(query);

    res.json({
      foods,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parsedLimit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single food by ID
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new food
const createFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a food
const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a food
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
}; 