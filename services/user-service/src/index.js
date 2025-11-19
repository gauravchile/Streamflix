// src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const authenticate = require('./middleware/authenticate');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

// a protected route example
app.get('/me', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, username FROM users WHERE id = $1', [req.user.sub]);
    res.json(rows[0] || null);
  } catch (err) {
    console.error('get me', err);
    res.status(500).json({ error: 'internal' });
  }
});

// health (readiness/liveness)
app.get('/health', (req, res) => res.json({ ok: true }));

// init DB table if not exists (safe on repeated calls)
(async function init() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('users table ready');
  } catch (err) {
    console.error('init db error', err);
  }
})();

const port = parseInt(process.env.PORT || '5000');
app.listen(port, () => console.log('user-service listening on', port));
