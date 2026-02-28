const express = require('express');
const cors = require('cors');
require('dotenv').config();
const helloRoutes = require('./routes/hello.routes');

const app = express();

// ======================
// Middleware
// ======================
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ======================
// Request Logging Middleware
// ======================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ======================
// Routes
// ======================
app.use('/', helloRoutes);

// ======================
// 404 Handler
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}`,
    timestamp: new Date().toISOString(),
    suggestion: 'Try GET / or POST /hello'
  });
});

// ======================
// Error Handling Middleware
// ======================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;