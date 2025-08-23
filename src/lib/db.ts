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
    console.error('MONGODB_URI is not defined in environment variables');
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (connection.isConnected) {
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI ? `${MONGODB_URI.substring(0, 20)}...` : 'undefined');
    
    const db = await mongoose.connect(MONGODB_URI, {
      // Add connection options for better reliability
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
    });
    
    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully');
    console.log('Connection state:', connection.isConnected);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      mongoUri: MONGODB_URI ? 'Set' : 'Not set'
    });
    throw error;
  }
}

export default connectDB;
