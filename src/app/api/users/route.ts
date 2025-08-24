import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Get all users (for author filtering)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all users with basic info needed for author filter
    const users = await User.find({})
      .select('name')
      .sort({ name: 1 });

    return NextResponse.json({
      users,
      success: true
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
