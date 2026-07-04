const express = require('express');
const router = express.Router();
const db = require('../db');

// Auto delete cart items older than 24 hours
function clearExpiredCart() {
  const query = `DELETE FROM cart WHERE created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)`;
  db.query(query, (err) => {
    if (err) console.log('Cart cleanup error:', err);
    else console.log('Expired cart items cleared!');
  });
}

// Run every hour
setInterval(clearExpiredCart, 60 * 60 * 1000);

// Run once on server start
clearExpiredCart();

// Get ALL orders (admin) — must be before /:user_id
router.get('/all', (req, res) => {
  db.query(
    `SELECT orders.*, users.name as customer_name 
     FROM orders 
     JOIN users ON orders.user_id = users.id 
     ORDER BY orders.created_at DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(results);
    }
  );
});

// Update order status (admin)
router.put('/:id', (req, res) => {
  const { status } = req.body;
  db.query(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Order status updated!' });
    }
  );
});

// Place an order
router.post('/', (req, res) => {
  const { user_id, cart, total } = req.body;

  const order_code = 'ORD' + Math.random().toString(36).substring(2, 8).toUpperCase();

  db.query(
    'INSERT INTO orders (user_id, order_code, total) VALUES (?, ?, ?)',
    [user_id, order_code, total],
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
        message: 'Order placed successfully!',
        order_code: order_code
      });
    }
  );
});

// Get orders for a specific user
router.get('/:user_id', (req, res) => {
  const { user_id } = req.params;

  db.query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(results);
    }
  );
});

module.exports = router;