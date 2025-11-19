// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES = '7d';

router.post('/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const q = 'INSERT INTO users(username,password) VALUES($1,$2) RETURNING id, username';
    const { rows } = await pool.query(q, [username, hashed]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err && err.code === '23505') { // unique_violation
      return res.status(409).json({ error: 'username taken' });
    }
    console.error('register error', err);
    res.status(500).json({ error: 'internal' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const q = 'SELECT id, username, password FROM users WHERE username = $1';
    const { rows } = await pool.query(q, [username]);
    if (!rows || rows.length === 0) return res.status(401).json({ error: 'invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
