'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate, stripHtmlTags } from '@/lib/utils';
import { usePosts, useAuthors } from '@/hooks/useBlogData';
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

interface Author {
  _id: string;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use SWR for data fetching
  const { posts, pagination, isLoading, error } = usePosts(currentPage, 12, debouncedSearchTerm, selectedAuthor);
  const { authors } = useAuthors();

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

  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthor(authorId);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAuthor('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedAuthor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Progress Bar */}
      <ProgressBar isLoading={isLoading} />
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Amazing Content
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Explore resources, insights, and tools from our community of contributors. 
              Find exactly what you&apos;re looking for with our powerful search and filters.
            </p>

            {/* Search and Filter Form */}
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Search Bar with Author Filter */}
              <form onSubmit={handleSearch} className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by title, content, or keywords..."
                      className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white hover:border-gray-400"
                    />
                  </div>

                  {/* Author Filter */}
                  <div className="relative">
                    <select
                      value={selectedAuthor}
                      onChange={(e) => handleAuthorChange(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-2xl px-4 py-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 min-w-[180px] text-lg shadow-sm hover:border-gray-400"
                    >
                      <option value="">All Authors</option>
                      {authors?.map((author: Author) => (
                        <option key={author._id} value={author._id} className="text-gray-900 bg-white">
                          {author.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200 font-medium text-lg"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="flex justify-center">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Search: &quot;{searchTerm}&quot;
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedAuthor && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Author: {authors?.find((a: Author) => a._id === selectedAuthor)?.name}
                      <button
                        onClick={() => setSelectedAuthor('')}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {isLoading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" text="Loading resources..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No resources found</h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg">
              {hasActiveFilters ? 'Try adjusting your search terms or filters to find what you&apos;re looking for.' : 'Be the first to share your resource with the world!'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8 text-center">
              <p className="text-gray-600 text-lg">
                Showing {posts.length} of {pagination?.total || 0} resources
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post: Post) => (
                <article key={post._id} className="group">
                  <Link href={`/blog/${post._id}`} className="block">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                      {/* Card Header */}
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                          {post.excerpt ? stripHtmlTags(post.excerpt) : 'No excerpt available'}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-900 font-semibold text-sm">
                                {post.author.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                            </div>
                          </div>
                          <div className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="border-t border-gray-200 pt-8">
                <nav className="flex flex-col sm:flex-row items-center justify-between">
                  {/* Page Info */}
                  <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Page {currentPage} of {pagination.pages} • {pagination.total} total resources
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Previous</span>
                      </button>
                    )}
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              pageNum === currentPage
                                ? 'text-white bg-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Next Button */}
                    {currentPage < pagination.pages && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center space-x-1"
                      >
                        <span>Next</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
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
