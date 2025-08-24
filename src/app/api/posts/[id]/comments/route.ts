import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Post from '@/models/Post';

// Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: postId } = await params;
    
    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate('author', 'name')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name' }
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ comments });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id: postId } = await params;
    const { content, parentComment } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { message: 'Comment cannot exceed 1000 characters' },
        { status: 400 }
      );
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // If this is a reply, verify parent comment exists
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return NextResponse.json(
          { message: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: session.user.id,
      post: postId,
      parentComment: parentComment || null
    });

    // Populate author info for response
    await comment.populate('author', 'name');

    return NextResponse.json(
      { message: 'Comment created successfully', comment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
