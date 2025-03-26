require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/food');

const sampleFoods = [
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh tomatoes, mozzarella, and basil',
    cuisine: 'Italian',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 12.99,
    tags: ['pizza', 'italian', 'vegetarian'],
    isFeatured: true,
    reviews: [
      {
        userId: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: 'Best pizza in town! The crust is perfect and the ingredients are fresh.'
      },
      {
        userId: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: 'Great pizza, but a bit pricey for the size.'
      }
    ]
  },
  {
    name: 'Sushi Roll',
    description: 'Fresh salmon and avocado roll with premium sushi rice',
    cuisine: 'Japanese',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 15.99,
    tags: ['sushi', 'japanese', 'seafood'],
    isFeatured: true,
    reviews: [
      {
        userId: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: 'Amazing sushi! The fish is so fresh and the rice is perfectly seasoned.'
      }
    ]
  },
  {
    name: 'Pad Thai',
    description: 'Classic Thai stir-fried rice noodles with shrimp, tofu, and peanuts',
    cuisine: 'Thai',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 13.99,
    tags: ['thai', 'noodles', 'seafood'],
    isFeatured: true,
    reviews: [
      {
        userId: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: 'Good pad thai, but could use more shrimp.'
      }
    ]
  },
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in rich, creamy tomato sauce with Indian spices',
    cuisine: 'Indian',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 16.99,
    tags: ['indian', 'curry', 'spicy'],
    isFeatured: true,
    reviews: [
      {
        userId: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: 'Authentic Indian flavors! The sauce is rich and creamy.'
      }
    ]
  },
  {
    name: 'Beef Tacos',
    description: 'Mexican street tacos with seasoned beef, onions, and cilantro',
    cuisine: 'Mexican',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 11.99,
    tags: ['mexican', 'tacos', 'spicy'],
    isFeatured: false,
    reviews: [
      {
        userId: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: 'Great tacos! The beef is well-seasoned and tender.'
      }
    ]
  },
  {
    name: 'Peking Duck',
    description: 'Crispy duck with thin pancakes, hoisin sauce, and scallions',
    cuisine: 'Chinese',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 29.99,
    tags: ['chinese', 'duck', 'asian'],
    isFeatured: true,
    reviews: [
      {
        userId: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: 'Authentic Peking duck! The skin is perfectly crispy.'
      }
    ]
  },
  {
    name: 'Greek Salad',
    description: 'Fresh Mediterranean salad with feta, olives, and olive oil',
    cuisine: 'Greek',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 9.99,
    tags: ['greek', 'salad', 'vegetarian'],
    isFeatured: false,
    reviews: [
      {
        userId: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: 'Fresh and healthy! The feta is high quality.'
      }
    ]
  },
  {
    name: 'Beef Wellington',
    description: 'Classic British dish with beef tenderloin wrapped in pastry',
    cuisine: 'British',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 34.99,
    tags: ['british', 'beef', 'fine-dining'],
    isFeatured: true,
    reviews: [
      {
        userId: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: 'Perfectly cooked! The pastry is flaky and the beef is tender.'
      }
    ]
  },
  {
    name: 'Pho',
    description: 'Vietnamese noodle soup with beef and fresh herbs',
    cuisine: 'Vietnamese',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 14.99,
    tags: ['vietnamese', 'soup', 'noodles'],
    isFeatured: true,
    reviews: [
      {
        userId: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: 'Authentic pho! The broth is rich and flavorful.'
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Food.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample data
    await Food.insertMany(sampleFoods);
    console.log('Sample data inserted successfully');

    // Close the connection
    await mongoose.connection.close();
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 