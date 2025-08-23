'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/lib/utils';

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
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

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
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Blog
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Blog */}
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
      </div>

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center space-x-4">
            <span>By {post.author.name}</span>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <>
                <span>•</span>
                <span>Updated {formatDate(post.updatedAt)}</span>
              </>
            )}
          </div>
          
          {canEdit && (
            <div className="flex space-x-2">
              <Link
                href={`/dashboard/edit-post/${post._id}`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </Link>
              <button
                onClick={deletePost}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Post Content */}
      <article className="prose prose-lg max-w-none">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>

      {/* Post Footer */}
      <footer className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span>Written by {post.author.name}</span>
          </div>
          <Link
            href="/blog"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all posts →
          </Link>
        </div>
      </footer>
    </div>
  );
}
