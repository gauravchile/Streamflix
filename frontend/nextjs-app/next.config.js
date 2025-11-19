/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // If you need to set environment API base, use runtime config or env vars
  experimental: {
    appDir: false
  }
}
module.exports = nextConfig
