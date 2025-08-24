'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            {session ? (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                  Welcome back, <span className="text-gray-900">{session.user.name}</span>! 👋
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                  Ready to share your next story? Your audience is waiting to hear from you.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/dashboard/new-post"
                    className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                  >
                    Write New Post
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-8 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    My Dashboard
                  </Link>
                  <Link
                    href="/blog"
                    className="px-8 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Read Stories
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                  Welcome to <span className="text-gray-700">Resources</span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                  Share your stories, insights, and perspectives with the world. 
                  Join our community of writers and discover amazing content.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/login"
                    className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/blog"
                    className="px-8 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Read Stories
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Featured Content Preview */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            {session ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to Create, {session.user.name}?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Your next great story is just a click away. Share your insights and grow your audience.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Start Writing Today
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Join our community of writers and share your stories with the world. 
                  Your voice matters, and your experiences can inspire others.
                </p>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Write Your Story */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all duration-300 hover:shadow-lg text-center">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {session ? 'Write Your Next Story' : 'Write Your Story'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {session 
                    ? 'Keep building your audience with fresh, engaging content.'
                    : 'Share your thoughts, experiences, and knowledge with our community.'
                  }
                </p>
                <Link
                  href={session ? "/dashboard/new-post" : "/login"}
                  className={`inline-block px-6 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    session 
                      ? 'bg-gray-900 text-white hover:bg-gray-800' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {session ? 'Start Writing' : 'Get Started'}
                </Link>
              </div>
            </div>

            {/* Explore Stories */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all duration-300 hover:shadow-lg text-center">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {session ? 'Your Dashboard' : 'Explore Stories'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {session 
                    ? 'Manage your posts, track performance, and engage with your audience.'
                    : 'Discover amazing content from our growing community of writers.'
                  }
                </p>
                <Link
                  href={session ? "/dashboard" : "/blog"}
                  className={`inline-block px-6 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    session 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {session ? 'Go to Dashboard' : 'Browse Stories'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Write Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            {session ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Keep Writing, {session.user.name}?
                </h2>
                <p className="text-lg text-gray-600">
                  You&apos;re already part of our amazing community. Here&apos;s why your voice matters:
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Write on Resources?
                </h2>
                <p className="text-lg text-gray-600">
                  Join thousands of writers sharing their knowledge and stories
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {session ? 'Grow Your Audience' : 'Reach Your Audience'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {session 
                    ? 'Your existing readers are eager for more. Keep them engaged with fresh content.'
                    : 'Connect with readers who care about your topics and expertise.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {session ? 'Proven Publishing' : 'Simple Publishing'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {session 
                    ? 'You already know how easy it is. Keep using our distraction-free editor.'
                    : 'Focus on writing. We handle the rest with our clean, distraction-free editor.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {session ? 'Strengthen Community' : 'Build Community'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {session 
                    ? 'Your readers are responding. Keep building those relationships through engagement.'
                    : 'Engage with readers through comments and build lasting relationships.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {session ? 'Control Your Success' : 'Own Your Content'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {session 
                    ? 'You own your success. Track performance and control your growing portfolio.'
                    : 'Your stories belong to you. Export, backup, and control your work.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {session ? (
            <>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
                Keep inspiring others, {session.user.name}!
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Your stories are making a difference. Continue sharing your knowledge and experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/new-post"
                  className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                >
                  Write Another Story
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
                >
                  View My Posts
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
                Ready to share your story?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Join thousands of writers on Resources and start building your audience today.
              </p>
              <Link
                href="/login"
                className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
