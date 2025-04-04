const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const foodRoutes = require('./routes/foodRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/foods', foodRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(3002, () => {
  console.log('Server running on http://localhost:3002');
});
