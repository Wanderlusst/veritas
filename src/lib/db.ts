import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function connectDB() {
  // Don't connect during build time
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    return;
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB;
