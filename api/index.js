// Vercel Serverless Entry Point
// Routes all /api/* requests to the Express app

const path = require('path');

// Load .env from server directory (for local dev)
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

// Import and export the Express app
const app = require('../server/server.js');

module.exports = app;
