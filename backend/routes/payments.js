const express = require('express');
  const router = express.Router();
  const Razorpay = require('razorpay');
  const db = require('../db');

  // Initialize RazorPay with your credentials (set in .env)
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  // Create RazorPay order
  router.post('/create-order', async (req, res) => {
    try {
      const { user_id, cart, total } = req.body;

      const order = await razorpay.orders.create({
        amount: total * 100, // RazorPay expects amount in paise (multiply by 100)
        currency: 'INR',
        receipt: 'receipt_' + Date.now()
      });

      res.json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      console.error('RazorPay order creation error:', error);
      res.status(500).json({ message: 'Failed to create order' });
    }
  });

  // Verify payment and save order
  router.post('/verify-payment', async (req, res) => {
    try {
      const {
        user_id,
        cart,
        total,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = req.body;

      const crypto = require('crypto');
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid signature' });
      }

      // Save order to database
      const order_code = 'ORD' + Math.random().toString(36).substring(2, 8).toUpperCase();

      db.query(
        'INSERT INTO orders (user_id, order_code, total, payment_id) VALUES (?, ?, ?, ?)',
        [user_id, order_code, total, razorpay_payment_id],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error' });

          const order_id = result.insertId;

          const cartItems = cart.map(item => [order_id, user_id, item.id]);

          db.query(
            'INSERT INTO cart (order_id, user_id, record_id) VALUES ?',
            [cartItems],
            (err2) => {
              if (err2) console.log('Cart insert error:', err2);
            }
          );

          res.json({
            message: 'Payment verified and order placed!',
            order_code: order_code
          });
        }
      );
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ message: 'Payment verification failed' });
    }
  });

  module.exports = router;

 