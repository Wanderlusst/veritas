import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { role } = await request.json();
    
    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be "user" or "admin"' }, { status: 400 });
    }

    await connectDB();
    const { id } = await params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from removing their own admin role
    if (user._id.toString() === session.user.id && role === 'user') {
      return NextResponse.json({ error: 'Cannot remove your own admin role' }, { status: 400 });
    }

    user.role = role;
    await user.save();
    
    return NextResponse.json({ 
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Admin update user role API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
