const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// Auth routes
const authRouter = express.Router();

authRouter.get('/test', (req, res) => {
  res.json({ message: 'Auth test route works!' });
});

authRouter.post('/register', (req, res) => {
  res.json({ message: 'Register route works!', body: req.body });
});

// Mount auth routes
app.use('/api/v1/auth', authRouter);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
}); 