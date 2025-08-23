import { Suspense } from 'react';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import BlogList from '@/components/BlogList';

// Enable static generation with revalidation
export const revalidate = 300; // Revalidate every 5 minutes

// Generate static params for better performance
export async function generateStaticParams() {
  // This will pre-generate the blog page at build time
  return [];
}

export default async function BlogPage() {
  try {
    await connectDB();
    
    // Get initial posts for static generation
    const posts = await Post.find({})
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title excerpt author createdAt');
    
    const total = await Post.countDocuments({});
    const hasMore = total > 10;
    
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Stories and insights
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
              Discover amazing content from our community of writers. 
              Explore stories, insights, and perspectives that matter.
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Suspense fallback={
            <div className="space-y-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          }>
            <BlogList 
              initialPosts={posts} 
              totalPosts={total} 
              hasMore={hasMore} 
            />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    // Fallback if database connection fails
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Stories and insights
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
            Discover amazing content from our community of writers. 
            Explore stories, insights, and perspectives that matter.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <BlogList 
            initialPosts={[]} 
            totalPosts={0} 
            hasMore={false} 
          />
        </div>
      </div>
    );
  }
}
