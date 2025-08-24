import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all posts
    const posts = await Post.find({});
    let updatedCount = 0;

    for (const post of posts) {
      if (post.content) {
        // Strip HTML tags from content before creating excerpt
        const cleanContent = post.content
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
          .replace(/&amp;/g, '&') // Replace &amp; with &
          .replace(/&lt;/g, '<') // Replace &lt; with <
          .replace(/&gt;/g, '>') // Replace &gt; with >
          .replace(/&quot;/g, '"') // Replace &quot; with "
          .replace(/&#39;/g, "'") // Replace &#39; with '
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim(); // Remove leading/trailing whitespace
        
        const newExcerpt = cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : '');
        
        // Update the post with the new excerpt
        await Post.findByIdAndUpdate(post._id, { excerpt: newExcerpt });
        updatedCount++;
      }
    }

    return NextResponse.json({
      message: `Successfully regenerated excerpts for ${updatedCount} posts`,
      updatedCount
    });
  } catch (error: any) {
    console.error('Error regenerating excerpts:', error);
    return NextResponse.json(
      { message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
