import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    console.log('🧪 Testing database connection...');
    
    // Check environment variables
    const envCheck = {
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Not Set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not Set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Not Set',
      NODE_ENV: process.env.NODE_ENV || '❌ Not Set'
    };
    
    console.log('📋 Environment Variables Check:', envCheck);
    
    // Try to connect to MongoDB
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        message: 'MONGODB_URI environment variable is not set',
        envCheck,
        instructions: 'Please set MONGODB_URI in your Vercel environment variables'
      }, { status: 500 });
    }
    
    console.log('🔗 Attempting MongoDB connection...');
    await connectDB();
    console.log('✅ MongoDB connection successful!');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      envCheck,
      timestamp: new Date().toISOString(),
      status: 'Connected to MongoDB'
    });
    
  } catch (error: any) {
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection test failed',
      error: error.message,
      errorType: error.name,
      envCheck: {
        MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Not Set',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not Set',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Not Set',
        NODE_ENV: process.env.NODE_ENV || '❌ Not Set'
      },
      instructions: 'Check Vercel environment variables and MongoDB Atlas network access'
    }, { status: 500 });
  }
}
