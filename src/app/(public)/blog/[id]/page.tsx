import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import BlogPostContent from '@/components/BlogPostContent';

// Enable static generation with revalidation
export const revalidate = 300; // Revalidate every 5 minutes

// Generate static params for existing posts
export async function generateStaticParams() {
  try {
    await connectDB();
    
    // Get all post IDs for static generation (limit to 100 for performance)
    const posts = await Post.find({}, '_id').limit(100);
    
    return posts.map((post) => ({
      id: post._id.toString(),
    }));
  } catch (error) {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const post = await Post.findById(id).populate('author', 'name');
    
    if (!post) {
      return {
        title: 'Story Not Found - Postify',
        description: 'The story you are looking for does not exist.',
      };
    }
    
    return {
      title: `${post.title} - Postify`,
      description: post.excerpt || post.content.substring(0, 160),
      authors: [{ name: post.author.name }],
      openGraph: {
        title: post.title,
        description: post.excerpt || post.content.substring(0, 160),
        type: 'article',
        authors: [post.author.name],
      },
    };
  } catch (error) {
    return {
      title: 'Story - Postify',
      description: 'Read amazing stories from our community.',
    };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const post = await Post.findById(id).populate('author', 'name');
    
    if (!post) {
      notFound();
    }
    
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <div className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Stories
            </Link>
          </div>
        </div>

        {/* Article */}
        <Suspense fallback={
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        }>
          <BlogPostContent post={post} />
        </Suspense>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
