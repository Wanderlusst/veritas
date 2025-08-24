'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-all duration-300">
              Resources
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`transition-all duration-200 font-medium hover:text-gray-900 ${
                pathname === '/' 
                  ? 'text-gray-900' 
                  : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className={`transition-all duration-200 font-medium hover:text-gray-900 ${
                pathname === '/blog' 
                  ? 'text-gray-900' 
                  : 'text-gray-600'
              }`}
            >
              Blog
            </Link>
            
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded-lg"></div>
            ) : session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`transition-all duration-200 font-medium hover:text-gray-900 ${
                    pathname === '/dashboard' 
                      ? 'text-gray-900' 
                      : 'text-gray-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  className={`transition-all duration-200 font-medium hover:text-gray-900 ${
                    pathname === '/profile' 
                      ? 'text-gray-900' 
                      : 'text-gray-600'
                  }`}
                >
                  Profile
                </Link>
                {session.user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className={`transition-all duration-200 font-medium hover:text-gray-900 ${
                      pathname === '/admin' 
                        ? 'text-gray-900' 
                        : 'text-gray-600'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="px-6 py-2.5 text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="px-6 py-2.5 text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={toggleMenu}
            />
            
            {/* Menu Panel - Smaller Width */}
            <div className="absolute left-0 top-0 h-full w-full bg-white">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Resources</h2>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 bg-white">
                <div className="space-y-3">
                  <Link 
                    href="/" 
                    onClick={toggleMenu}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium text-base ${
                      pathname === '/' 
                        ? 'text-gray-900 bg-gray-100 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                  
                  <Link 
                    href="/blog" 
                    onClick={toggleMenu}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium text-base ${
                      pathname === '/blog' 
                        ? 'text-gray-900 bg-gray-100 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Blog
                  </Link>
                  
                  {session ? (
                    <>
                      <Link 
                        href="/dashboard" 
                        onClick={toggleMenu}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium text-base ${
                          pathname === '/dashboard' 
                            ? 'text-gray-900 bg-gray-100 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </Link>
                      
                      <Link 
                        href="/profile" 
                        onClick={toggleMenu}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium text-base ${
                          pathname === '/profile' 
                            ? 'text-gray-900 bg-gray-100 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      
                      {session.user.role === 'admin' && (
                        <Link 
                          href="/admin" 
                          onClick={toggleMenu}
                          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium text-base ${
                            pathname === '/admin' 
                              ? 'text-gray-900 bg-gray-100 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Admin
                        </Link>
                      )}
                      <div className="pt-3 border-t border-gray-200">
                        <button
                          onClick={() => {
                            handleSignOut();
                            toggleMenu();
                          }}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-base cursor-pointer hover:shadow-sm"
                        >
                          <svg className="w-5 h-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        onClick={toggleMenu}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium text-base ${
                          pathname === '/login' 
                            ? 'text-gray-900 bg-gray-100 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
