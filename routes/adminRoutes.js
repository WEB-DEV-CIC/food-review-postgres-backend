const express = require('express');
const router = express.Router();

// Example route
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

module.exports = router;
