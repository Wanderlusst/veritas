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
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

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

    const posts = await Post.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title excerpt author createdAt');

    const total = await Post.countDocuments(query);

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
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
