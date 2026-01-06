const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const config = require('./config');
const { initializeSocketHandlers } = require('./src/socketHandlers');

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = config.NODE_ENV === 'development' 
  ? { origin: true, credentials: true } // Allow all origins in development
  : { origin: config.FRONTEND_URL, methods: ['GET', 'POST'], credentials: true };

const io = new Server(server, {
  cors: corsOptions,
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Prictionary Backend',
    version: '1.0.0',
    status: 'running',
  });
});

// Initialize Socket.IO handlers
initializeSocketHandlers(io);

// Start server
server.listen(config.PORT, () => {
  console.log('🎨 Prictionary Backend Server');
  console.log(`   Environment: ${config.NODE_ENV}`);
  console.log(`   Port: ${config.PORT}`);
  console.log(`   Frontend URL: ${config.FRONTEND_URL}`);
  console.log(`   Max players per room: ${config.MAX_PLAYERS_PER_ROOM}`);
  console.log(`\n✅ Server is running!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = server;
