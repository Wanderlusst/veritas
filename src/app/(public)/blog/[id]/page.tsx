'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/lib/utils';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import { usePost } from '@/hooks/useBlogData';
import ProgressBar from '@/components/ui/ProgressBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function BlogPost() {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  // Use SWR for data fetching
  const { post, isLoading, error } = usePost(params.id as string);

  const openDeleteModal = () => {
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const deletePost = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/blog');
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
      closeDeleteModal();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading resource..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Resource Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The resource you are looking for does not exist.'}</p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = session && (
    session.user.id === post.author._id || 
    session.user.role === 'admin'
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <ProgressBar isLoading={isLoading} />
      
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
            Back to Resources
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600">
              <span className="font-medium text-gray-900">{post.author.name}</span>
              <span className="hidden sm:inline">•</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.updatedAt !== post.createdAt && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </>
              )}
            </div>
            
            {canEdit && (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Link
                  href={`/dashboard/edit-post/${post._id}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200 text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={openDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-800 leading-relaxed text-base sm:text-lg"
            dangerouslySetInnerHTML={{ 
              __html: post.content.replace(/<p><strong>/g, '<p class="mb-4"><strong class="text-gray-900">')
                                   .replace(/<\/strong><\/p>/g, '</strong></p>')
                                   .replace(/<p>/g, '<p class="mb-4">')
                                   .replace(/<h[1-6]>/g, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">')
                                   .replace(/<\/h[1-6]>/g, '</h2>')
                                   .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-4">')
                                   .replace(/<ol>/g, '<ol class="list-decimal pl-6 mb-4">')
                                   .replace(/<li>/g, '<li class="mb-2">')
                                   .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-200 pl-4 italic text-gray-700 mb-4">')
                                   .replace(/<code>/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">')
                                   .replace(/<pre>/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">')
            }}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-gray-600 text-center sm:text-left">
              <span>Written by <span className="font-medium text-gray-900">{post.author.name}</span></span>
            </div>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-center sm:text-right"
            >
              View all resources →
            </Link>
          </div>
        </footer>
      </article>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={deletePost}
        title="Delete Resource"
        message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
