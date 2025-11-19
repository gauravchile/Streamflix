// src/db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'streamflix',
  password: process.env.POSTGRES_PASSWORD || 'streamflixpass',
  database: process.env.POSTGRES_DB || 'streamflix',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

module.exports = pool;
