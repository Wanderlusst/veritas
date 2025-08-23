import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function connectDB() {
  // Only connect if we're not in a browser environment
  if (typeof window !== 'undefined') {
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
