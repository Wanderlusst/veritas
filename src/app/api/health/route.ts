import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    // Check database connection
    await connectDB();
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Basic system info
    const systemInfo = {
      status: 'healthy',
      timestamp,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development'
    };
    
    return NextResponse.json({
      success: true,
      data: systemInfo,
      message: 'Application is healthy'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      message: 'Application is unhealthy',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}
