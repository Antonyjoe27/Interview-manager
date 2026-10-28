import mongoose from 'mongoose';

/**
 * Connect to MongoDB with timeout and proper error reporting
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interview_preparation_tracker';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

/**
 * Disconnect from MongoDB gracefully
 */
export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log(' MongoDB connection closed.');
  }
};

/**
 * Check if MongoDB is connected
 */
export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

export default connectDB;
