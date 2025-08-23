'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState(0);

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch posts when debounced search term or page changes
  useEffect(() => {
    fetchPosts();
  }, [debouncedSearchTerm, currentPage]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setProgress(0);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      const response = await fetch(`/api/posts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setPagination(data.pagination);
        setProgress(100);
      }
      
      clearInterval(progressInterval);
    } catch (error) {
      // Silent error handling for production
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500); // Hide progress bar after completion
    }
  }, [debouncedSearchTerm, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by debouncing
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to strip HTML tags and get clean text
  const stripHtmlTags = (html: string) => {
    if (typeof document !== 'undefined') {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
    // Fallback for server-side rendering
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      {progress > 0 && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div 
            className="h-full bg-gray-900 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

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

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-lg">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stories..."
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
        {loading ? (
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
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {debouncedSearchTerm ? 'Try adjusting your search terms or browse all stories.' : 'Be the first to share your story with the world!'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-12 sm:space-y-16">
              {posts.map((post) => (
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
                      <span>{formatDate(post.createdAt)}</span>
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
