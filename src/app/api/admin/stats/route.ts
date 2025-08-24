import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Post from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    console.log('Admin stats API: Connecting to database...');
    await connectDB();
    console.log('Admin stats API: Database connected, executing queries...');
    
    const [totalUsers, totalPosts, totalAdmins] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      User.countDocuments({ role: 'admin' })
    ]);
    
    console.log('Admin stats API: Query results:', { totalUsers, totalPosts, totalAdmins });
    
    return NextResponse.json({ 
      totalUsers,
      totalPosts,
      totalAdmins
    });
  } catch (error) {
    console.error('Admin stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
