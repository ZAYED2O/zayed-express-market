// Vercel API Handler - forwards all /api/* requests to Express
// Vercel injects env vars automatically in production

const app = require('../server/server.js');
module.exports = app;
