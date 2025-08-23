'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import { useMyPosts } from '@/hooks/useBlogData';
import ProgressBar from '@/components/ui/ProgressBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    postId: string | null;
    postTitle: string;
  }>({
    isOpen: false,
    postId: null,
    postTitle: ''
  });
  const [deleting, setDeleting] = useState(false);

  // Use SWR for data fetching
  const { posts, isLoading, mutate } = useMyPosts();

  // Only check session on mount and when session changes
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  const openDeleteModal = (postId: string, postTitle: string) => {
    setDeleteModal({
      isOpen: true,
      postId,
      postTitle
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      postId: null,
      postTitle: ''
    });
  };

  const deletePost = async () => {
    if (!deleteModal.postId) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/posts/${deleteModal.postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the posts data using SWR
        mutate();
        closeDeleteModal();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  // Function to strip HTML tags and get clean text
  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <ProgressBar isLoading={isLoading} />
      
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Dashboard</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
              Welcome back, <span className="font-semibold text-gray-900">{session.user?.name}</span>! 
              Manage your resources and share your knowledge with the world.
            </p>
          </div>

          <Link
            href="/dashboard/new-post"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200 text-base sm:text-lg font-medium"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Resource
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {isLoading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" text="Loading your resources..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">No resources yet</h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
              Start your sharing journey by creating your first resource. Share your knowledge, tools, and experiences with the world.
            </p>
            <Link
              href="/dashboard/new-post"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-200 text-base sm:text-lg font-medium"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Resource
            </Link>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {posts.map((post: Post) => (
              <article key={post._id} className="group">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-gray-700 transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed max-w-3xl">
                      {stripHtmlTags(post.excerpt)}
                    </p>
                    <div className="text-sm text-gray-500">
                      <span>Created {formatDate(post.createdAt)}</span>
                      {post.updatedAt !== post.createdAt && (
                        <span className="ml-2 sm:ml-4">• Updated {formatDate(post.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:ml-8">
                    <Link
                      href={`/dashboard/edit-post/${post._id}`}
                      className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200 text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => openDeleteModal(post._id, post.title)}
                      className="px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 hover:cursor-pointer transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Posts Count Info */}
            {posts.length > 0 && (
              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                Showing {posts.length} {posts.length === 1 ? 'resource' : 'resources'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={deletePost}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deleteModal.postTitle}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
