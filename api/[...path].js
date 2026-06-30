// Vercel Catch-All Serverless Function
// Handles ALL /api/* requests → forwards to Express app
// [...path].js catches: /api/products, /api/auth/login, /api/products/123/reviews, etc.

// Vercel injects env vars automatically in production.
// dotenv only needed for local dev - load silently (no crash if .env missing)
try {
  require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
} catch (e) {
  // dotenv not needed in production - Vercel provides env vars directly
}

// Import and export the Express app as the serverless handler
const app = require('../server/server.js');

module.exports = app;
