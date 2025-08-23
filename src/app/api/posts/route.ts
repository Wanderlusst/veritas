import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

// Create new post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.create({
      title,
      content,
      author: session.user.id
    });

    return NextResponse.json(
      { message: 'Post created successfully', post },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all posts (public)
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting GET /api/posts request');
    
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      return NextResponse.json(
        { 
          message: 'Database configuration error',
          error: 'MONGODB_URI not configured',
          details: 'Please check your Vercel environment variables'
        },
        { status: 500 }
      );
    }

    console.log('📡 Attempting to connect to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    console.log(`🔍 Query params: page=${page}, limit=${limit}, search="${search}"`);

    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      };
    }

    console.log('📊 Executing database query...');
    const posts = await Post.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title excerpt author createdAt');

    const total = await Post.countDocuments(query);

    console.log(`✅ Successfully fetched ${posts.length} posts out of ${total} total`);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('❌ Error in GET /api/posts:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    });

    // Return more specific error messages
    if (error.name === 'MongoNetworkError') {
      return NextResponse.json(
        { 
          message: 'Database connection failed',
          error: 'Network error connecting to MongoDB',
          details: 'Please check your MongoDB Atlas network access settings'
        },
        { status: 500 }
      );
    }

    if (error.name === 'MongoServerSelectionError') {
      return NextResponse.json(
        { 
          message: 'Database server selection failed',
          error: 'Cannot connect to MongoDB cluster',
          details: 'Please check your connection string and cluster status'
        },
        { status: 500 }
      );
    }

    if (error.name === 'MongoAuthenticationError') {
      return NextResponse.json(
        { 
          message: 'Database authentication failed',
          error: 'Invalid username or password',
          details: 'Please check your MongoDB Atlas credentials'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error.message || 'Unknown error',
        details: 'Check server logs for more information'
      },
      { status: 500 }
    );
  }
}
