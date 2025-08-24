import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reactionType } = await request.json();
    const { commentId } = await params;

    if (!reactionType || !['upvote', 'love', 'laugh', 'wow', 'sad', 'angry'].includes(reactionType)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    await connectDB();

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Initialize reactions object if it doesn't exist
    if (!comment.reactions) {
      comment.reactions = {
        upvote: [],
        love: [],
        laugh: [],
        wow: [],
        sad: [],
        angry: []
      };
    }

    const userEmail = session.user.email;
    const reactionArray = comment.reactions[reactionType as keyof typeof comment.reactions];

    // Check if user already reacted
    const userIndex = reactionArray.indexOf(userEmail);
    
    if (userIndex > -1) {
      // Remove reaction (toggle off)
      reactionArray.splice(userIndex, 1);
    } else {
      // Add reaction
      reactionArray.push(userEmail);
    }

    // Save the comment
    await comment.save();

    return NextResponse.json({ 
      success: true, 
      reactions: comment.reactions 
    });

  } catch (error) {
    console.error('Error handling reaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
