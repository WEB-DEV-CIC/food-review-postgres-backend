const jwt = require('jsonwebtoken');
const db = require('../db');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log('Auth header:', authHeader);

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1].trim();
        console.log('Processing token:', token);

        const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token:', decoded);

        const result = await db.query(
            'SELECT id, username, email, role FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (!result.rows[0]) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        res.status(401).json({ error: 'Invalid token', details: error.message });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin
};