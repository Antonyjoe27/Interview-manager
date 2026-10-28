import dotenv from 'dotenv';
dotenv.config();

import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';

let isConnected = false;

export default async function handler(req, res) {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB in serverless handler:', err);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Please ensure MONGODB_URI environment variable is configured in Vercel.',
      error: err.message
    });
  }

  return app(req, res);
}
