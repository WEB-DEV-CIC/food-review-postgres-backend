const express = require('express');
const router = express.Router();

// Example route
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

module.exports = router;
