const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to check admin
function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Not admin' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Get all records
router.get('/', (req, res) => {
  db.query('SELECT * FROM records WHERE sold = false', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});

// Add record (admin only)
router.post('/', isAdmin, (req, res) => {
  const { artist, title, genre, size, price } = req.body;
  db.query(
    'INSERT INTO records (artist, title, genre, size, price) VALUES (?, ?, ?, ?, ?)',
    [artist, title, genre, size, price],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Record added!' });
    }
  );
});

// Update record (admin only)
router.put('/:id', isAdmin, (req, res) => {
  const { artist, title, genre, size, price } = req.body;
  db.query(
    'UPDATE records SET artist=?, title=?, genre=?, size=?, price=? WHERE id=?',
    [artist, title, genre, size, price, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Record updated!' });
    }
  );
});

// Delete record (admin only)
router.delete('/:id', isAdmin, (req, res) => {
  db.query('DELETE FROM records WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Record deleted!' });
  });
});

module.exports = router;