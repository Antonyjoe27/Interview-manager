import express from 'express';
import cors from 'cors';

// Route Handlers
import healthRoutes from './routes/healthRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Middleware
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Global Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow serverless, curl, mobile, same-origin, or matching origins
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Route Mounts
app.use('/api', healthRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
