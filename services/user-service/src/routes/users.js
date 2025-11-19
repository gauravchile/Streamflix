// src/routes/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// simple list endpoint (no auth)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, username FROM users ORDER BY id ASC LIMIT 100');
    res.json(rows);
  } catch (err) {
    console.error('list users error', err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
