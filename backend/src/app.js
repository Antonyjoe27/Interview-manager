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
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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
