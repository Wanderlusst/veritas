import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
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

    await connectDB();
    
    const posts = await Post.find({})
      .populate('author', 'name')
      .select('title author createdAt')
      .sort({ createdAt: -1 })
      .limit(20);
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Admin posts API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
