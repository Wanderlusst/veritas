'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const setupAdmin = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Redirect to admin dashboard after 3 seconds
        setTimeout(() => {
          router.push('/admin');
        }, 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to setup admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Setup</h1>
          <p className="text-gray-600">
            Make the first registered user an admin
          </p>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {message}
            <p className="text-sm mt-2">Redirecting to admin dashboard...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={setupAdmin}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Setting up admin...' : 'Setup Admin'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            This will make your first registered user an admin.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Only use this once during initial setup.
          </p>
        </div>
      </div>
    </div>
  );
}
