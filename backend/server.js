const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/records');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
app.use('/auth', authRoutes);
app.use('/records', recordRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
// Test route
app.get('/', (req, res) => {
  res.send('Record Store Backend is Running!');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});