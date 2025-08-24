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
    console.log('MongoDB already connected, reusing connection');
    return;
  }

  try {
    console.log('Connecting to MongoDB...');
    const db = await mongoose.connect(MONGODB_URI, {
      // Add connection options for better reliability
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      // Remove bufferCommands: false to allow command buffering during connection
    });
    
    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully, readyState:', connection.isConnected);
    
    // Wait for the connection to be ready
    if (db.connections[0].readyState !== 1) {
      console.log('Waiting for MongoDB connection to be ready...');
      await new Promise((resolve) => {
        db.connection.once('connected', () => {
          console.log('MongoDB connection ready');
          resolve(true);
        });
      });
    }
    
    // Add connection event listeners for debugging
    db.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      connection.isConnected = 0;
    });
    
    db.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      connection.isConnected = 0;
    });
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    connection.isConnected = 0;
    throw error;
  }
}

export default connectDB;
