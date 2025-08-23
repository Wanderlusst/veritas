'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-all duration-300">
              Postify
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
              Blog
            </Link>
            
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded-lg"></div>
            ) : session ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-6 py-2 text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors duration-200 font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="px-6 py-2 text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors duration-200 font-medium">
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
            
            {/* Menu Panel - Full Width */}
            <div className="absolute left-0 top-0 h-full w-full bg-white">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">Postify</h2>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-6 bg-white">
                <div className="space-y-3">
                  <Link 
                    href="/" 
                    onClick={toggleMenu}
                    className="flex items-center px-4 py-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium text-lg"
                  >
                    <svg className="w-6 h-6 mr-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                  
                  <Link 
                    href="/blog" 
                    onClick={toggleMenu}
                    className="flex items-center px-4 py-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium text-lg"
                  >
                    <svg className="w-6 h-6 mr-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Blog
                  </Link>
                  
                  {session ? (
                    <>
                      <Link 
                        href="/dashboard" 
                        onClick={toggleMenu}
                        className="flex items-center px-4 py-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium text-lg"
                      >
                        <svg className="w-6 h-6 mr-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </Link>
                      
                      <Link 
                        href="/profile" 
                        onClick={toggleMenu}
                        className="flex items-center px-4 py-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium text-lg"
                      >
                        <svg className="w-6 h-6 mr-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            handleSignOut();
                            toggleMenu();
                          }}
                          className="flex items-center w-full px-4 py-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium text-lg cursor-pointer"
                        >
                          <svg className="w-6 h-6 mr-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        className="flex items-center px-4 py-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium text-lg"
                      >
                        <svg className="w-6 h-6 mr-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
