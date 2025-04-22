const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Import routes and middleware
const foodRoutes = require('./routes/foodRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');

// Basic middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/foods', (req, res, next) => {
  if (req.method === 'GET') {
    next();
  } else {
    authenticateToken(req, res, next);
  }
}, foodRoutes);
app.use('/api/v1/users', authenticateToken, userRoutes);
app.use('/api/v1/reviews', authenticateToken, reviewRoutes);
app.use('/api/v1/admin', authenticateToken, adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
