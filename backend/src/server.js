import dotenv from 'dotenv';
// Load environment variables before importing app and db
dotenv.config();

import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

let server;

async function startServer() {
  try {
    // 1. Await database connection before opening port
    await connectDB();

    // 2. Start HTTP listener
    server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 Health check available at http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown handlers
    const handleShutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      if (server) {
        server.close(async () => {
          console.log(' HTTP server closed.');
          await disconnectDB();
          process.exit(0);
        });
      } else {
        await disconnectDB();
        process.exit(0);
      }
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  } catch (error) {
    console.error('💥 Fatal error during server startup: Failed to connect to MongoDB.');
    console.error(`Detail: ${error.message}`);
    process.exit(1);
  }
}

// Start only if not imported as module in test suites
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
