/**
 * ========================================================
 * 🚀 HELLO WORLD API - SERVER ENTRY POINT
 * ========================================================
 * 
 * Main server file that starts the Express application.
 * Features:
 * - Environment configuration
 * - Graceful shutdown handling
 * - Startup banner with ASCII art
 * - Health checks
 * - Port configuration
 * 
 * @author Your Name
 * @version 1.0.0
 */

// ========================================================
// 📦 DEPENDENCIES
// ========================================================
const app = require('./src/app');
require('dotenv').config();

// ========================================================
// ⚙️ CONFIGURATION
// ========================================================
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'Hello World API';

// ========================================================
// 🎨 ASCII ART & BANNER
// ========================================================
const banner = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ██╗  ██╗███████╗██╗     ██╗      ██████╗ ██╗    ██╗      ║
║    ██║  ██║██╔════╝██║     ██║     ██╔═══██╗██║    ██║      ║
║    ███████║█████╗  ██║     ██║     ██║   ██║██║ █╗ ██║      ║
║    ██╔══██║██╔══╝  ██║     ██║     ██║   ██║██║███╗██║      ║
║    ██║  ██║███████╗███████╗███████╗╚██████╔╝╚███╔███╔╝      ║
║    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝  ╚══╝╚══╝       ║
║                                                              ║
║                  📦 ${APP_NAME.padEnd(36)} 📦                  ║
║                  🌟 Beginner Friendly REST API 🌟           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`;

// ========================================================
// 🏃‍♂️ SERVER STARTUP
// ========================================================
const startServer = () => {
  // Create HTTP server
  const server = app.listen(PORT, () => {
    // Clear console for clean startup
    console.clear();
    
    // Display banner
    console.log('\x1b[36m%s\x1b[0m', banner); // Cyan color
    
    // Display server info
    console.log('\x1b[32m%s\x1b[0m', '✅ SERVER STARTED SUCCESSFULLY');
    console.log('\x1b[33m%s\x1b[0m', '📋 SERVER INFORMATION');
    console.log('   ├─ 📍 Port:', `\x1b[1m${PORT}\x1b[0m`);
    console.log('   ├─ 🏷️  Environment:', `\x1b[1m${NODE_ENV}\x1b[0m`);
    console.log('   ├─ 🕐 Started at:', `\x1b[1m${new Date().toLocaleString()}\x1b[0m`);
    console.log('   ├─ 🖥️  PID:', `\x1b[1m${process.pid}\x1b[0m`);
    console.log('   └─ 📍 Local URL:', `\x1b[4m\x1b[1mhttp://localhost:${PORT}\x1b[0m`);
    
    console.log('\n\x1b[34m%s\x1b[0m', '🌐 AVAILABLE ENDPOINTS');
    console.log('   ├─ GET  \x1b[36m/\x1b[0m            Welcome message');
    console.log('   └─ POST \x1b[36m/hello\x1b[0m       Personalized greeting');
    
    console.log('\n\x1b[35m%s\x1b[0m', '🚀 QUICK START');
    console.log('   Test with curl:');
    console.log('   \x1b[90mcurl http://localhost:' + PORT + '\x1b[0m');
    console.log('   \x1b[90mcurl -X POST http://localhost:' + PORT + '/hello \\\x1b[0m');
    console.log('   \x1b[90m  -H "Content-Type: application/json" \\\x1b[0m');
    console.log('   \x1b[90m  -d \'{"name": "World"}\'\x1b[0m');
    
    console.log('\n\x1b[90m%s\x1b[0m', '='.repeat(60));
    console.log('\x1b[90m%s\x1b[0m', '💡 Press Ctrl+C to stop the server');
    console.log('\x1b[90m%s\x1b[0m', '='.repeat(60));
  });

  return server;
};

// ========================================================
// ⚡ HEALTH CHECK
// ========================================================
const performHealthCheck = () => {
  console.log('\n\x1b[33m%s\x1b[0m', '🔍 PERFORMING HEALTH CHECK...');
  
  // Check environment variables
  const requiredEnvVars = ['NODE_ENV'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.warn('\x1b[33m%s\x1b[0m', `⚠️  Warning: Missing env vars: ${missingEnvVars.join(', ')}`);
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✅ Environment variables check passed');
  }
  
  // Memory check
  const usedMemory = process.memoryUsage();
  const memoryUsage = Math.round(usedMemory.heapUsed / 1024 / 1024 * 100) / 100;
  console.log(`📊 Memory Usage: ${memoryUsage} MB`);
  
  // Node version
  console.log(`⚙️  Node Version: ${process.version}`);
  
  return true;
};

// ========================================================
// 🛑 GRACEFUL SHUTDOWN HANDLER
// ========================================================
const setupGracefulShutdown = (server) => {
  const shutdown = (signal) => {
    console.log(`\n\x1b[33m⚠️  ${signal} received. Starting graceful shutdown...\x1b[0m`);
    
    // Stop accepting new connections
    server.close(() => {
      console.log('\x1b[32m✅ HTTP server closed\x1b[0m');
      console.log('\x1b[32m✅ Server shutdown completed\x1b[0m');
      console.log('\x1b[90m👋 Goodbye!\x1b[0m');
      process.exit(0);
    });
    
    // Force shutdown after 10 seconds if graceful shutdown fails
    setTimeout(() => {
      console.error('\x1b[31m❌ Could not close connections in time, forcefully shutting down\x1b[0m');
      process.exit(1);
    }, 10000);
  };
  
  // Handle different shutdown signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('\x1b[31m%s\x1b[0m', '💥 UNCAUGHT EXCEPTION!');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    shutdown('UNCAUGHT_EXCEPTION');
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('\x1b[31m%s\x1b[0m', '💥 UNHANDLED PROMISE REJECTION!');
    console.error('Promise:', promise);
    console.error('Reason:', reason);
  });
};

// ========================================================
// 🚦 START THE APPLICATION
// ========================================================
try {
  // Perform health check before starting
  performHealthCheck();
  
  // Start the server
  const server = startServer();
  
  // Setup graceful shutdown handlers
  setupGracefulShutdown(server);
  
  // Listen for server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\x1b[31m❌ Port ${PORT} is already in use!\x1b[0m`);
      console.log(`\x1b[33m💡 Try one of these solutions:\x1b[0m`);
      console.log(`   1. Use a different port: PORT=3001 npm start`);
      console.log(`   2. Kill the process using port ${PORT}`);
      console.log(`   3. Wait for the port to become available`);
    } else {
      console.error('\x1b[31m❌ Server error:\x1b[0m', error);
    }
    process.exit(1);
  });
  
} catch (error) {
  console.error('\x1b[31m❌ Failed to start server:\x1b[0m', error);
  process.exit(1);
}

// ========================================================
// 📝 ADDITIONAL FEATURES
// ========================================================

// Memory usage monitoring (optional)
if (NODE_ENV === 'development') {
  setInterval(() => {
    const used = process.memoryUsage();
    const heapUsed = Math.round(used.heapUsed / 1024 / 1024 * 100) / 100;
    const heapTotal = Math.round(used.heapTotal / 1024 / 1024 * 100) / 100;
    
    if (heapUsed > 100) { // Warn if using more than 100MB
      console.warn(`\x1b[33m⚠️  High memory usage: ${heapUsed}MB / ${heapTotal}MB\x1b[0m`);
    }
  }, 30000); // Check every 30 seconds
}

// Server uptime tracking
const startTime = new Date();
process.on('exit', () => {
  const uptime = Math.round((new Date() - startTime) / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  console.log(`\n⏱️  Server was running for: ${hours}h ${minutes}m ${seconds}s`);
});