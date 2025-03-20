require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const reviewRoutes = require('./routes/reviewRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000'
}));
app.use(express.json());

// Routes
app.use('/api/reviews', reviewRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Food Review API' });
});

// Error handling
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 