import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if there are any users
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      return NextResponse.json({ error: 'No users found. Please create a user account first.' }, { status: 400 });
    }

    // Check if there are already admin users
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    if (adminCount > 0) {
      return NextResponse.json({ error: 'Admin users already exist.' }, { status: 400 });
    }

    // Get the first user and make them admin
    const firstUser = await User.findOne().sort({ createdAt: 1 });
    
    if (!firstUser) {
      return NextResponse.json({ error: 'No users found.' }, { status: 404 });
    }

    firstUser.role = 'admin';
    await firstUser.save();
    
    return NextResponse.json({ 
      message: `User ${firstUser.name} (${firstUser.email}) has been made admin`,
      user: {
        _id: firstUser._id,
        name: firstUser.name,
        email: firstUser.email,
        role: firstUser.role
      }
    });
  } catch (error) {
    console.error('Admin setup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
