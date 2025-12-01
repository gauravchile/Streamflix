/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY, // ✅ Load from .env
  },
  experimental: {
    appDir: false
  }
};

module.exports = nextConfig;
