import { Router } from 'express';
import { isDBConnected } from '../config/db.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint returning server and database connectivity status
 * @access  Public
 */
router.get('/health', (req, res) => {
  const dbConnected = isDBConnected();

  const response = {
    success: dbConnected,
    status: dbConnected ? 'ok' : 'degraded',
    message: dbConnected
      ? 'Interview Preparation Tracker API is healthy and connected to database'
      : 'API is running but database is not connected',
    database: {
      status: dbConnected ? 'connected' : 'disconnected'
    },
    timestamp: new Date().toISOString()
  };

  res.status(dbConnected ? 200 : 503).json(response);
});

export default router;
