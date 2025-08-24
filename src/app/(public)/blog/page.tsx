'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate, stripHtmlTags } from '@/lib/utils';
import { usePosts } from '@/hooks/useBlogData';
import ProgressBar from '@/components/ui/ProgressBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use SWR for data fetching
  const { posts, pagination, isLoading, error } = usePosts(currentPage, 10, debouncedSearchTerm);

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by debouncing
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <ProgressBar isLoading={isLoading} />
      
      {/* Hero Section */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Resources and insights
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
            Discover amazing content from our community of contributors. 
            Explore resources, insights, and tools that matter.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-lg">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resources..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 sm:px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200 text-sm sm:text-base"
              >
                Search
              </button>
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-2">
                Searching for &ldquo;{searchTerm}&rdquo;...
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {isLoading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" text="Loading resources..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {debouncedSearchTerm ? 'Try adjusting your search terms or browse all resources.' : 'Be the first to share your resource with the world!'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-12 sm:space-y-16">
              {posts.map((post: Post) => (
                <article key={post._id} className="group">
                  <Link href={`/blog/${post._id}`} className="block">
                    <div className="mb-4">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight group-hover:text-gray-700 transition-colors duration-200">
                        {post.title}
                      </h2>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6 max-w-3xl">
                        {post.excerpt ? stripHtmlTags(post.excerpt) : 'No excerpt available'}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-1 sm:space-y-0">
                      <span className="font-medium text-gray-900">{post.author.name}</span>
                      <span className="hidden sm:inline mx-2">•</span>
                      <span>Published at {formatDate(post.createdAt)}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-16 pt-8 border-t border-gray-100">
                <nav className="flex justify-center">
                  <div className="flex space-x-2">
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        ← Previous
                      </button>
                    )}
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                            page === currentPage
                              ? 'text-white bg-gray-900'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    {currentPage < pagination.pages && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        Next →
                      </button>
                    )}
                  </div>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
