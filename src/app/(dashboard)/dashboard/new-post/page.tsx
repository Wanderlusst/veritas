'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function NewPost() {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      setFormData({ title: '', content: '' });
      setError('');
      setSaving(false);
    };
  }, []);

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
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setSaving(true);

    try {
      // Validate form data
      if (!formData.title.trim()) {
        setError('Title is required');
        setSaving(false);
        return;
      }

      if (!formData.content.trim()) {
        setError('Content is required');
        setSaving(false);
        return;
      }

      if (formData.content.trim().length < 10) {
        setError('Content must be at least 10 characters long');
        setSaving(false);
        return;
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Form submission error:', error);
      setError(error.message || 'Failed to create post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Story</h1>
              <p className="text-lg text-gray-600">
                Share your thoughts and ideas with the world
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <form 
          onSubmit={handleSubmit} 
          className="space-y-8"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
              e.preventDefault();
            }
          }}
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-900 mb-3">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-6 py-4 text-lg border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="Enter your story title"
              maxLength={100}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              {formData.title.length}/100 characters
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-lg font-medium text-gray-900 mb-3">
              Content
            </label>
            <RichTextEditor
              key="new-post"
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Start writing your story..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Minimum 10 characters required. {formData.content.length} characters written.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100">
            <Link
              href="/dashboard"
              className="px-8 py-3 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? 'Creating...' : 'Create Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
