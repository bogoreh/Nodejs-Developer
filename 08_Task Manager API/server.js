const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const app = require('./src/app');
require('colors');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║     🚀 TASK MANAGER API SERVER        ║
    ╠════════════════════════════════════════╣
    ║  Server running on: ${`http://localhost:${PORT}`.cyan}  ║
    ║  Environment: ${(process.env.NODE_ENV || 'development').yellow}      ║
    ║  Status: ${'ACTIVE'.green}                         ║
    ╚════════════════════════════════════════╝
    `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`❌ Uncaught Exception: ${err.message}`.red);
    server.close(() => process.exit(1));
});