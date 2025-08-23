import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layouts/Navbar';
import { SessionProvider } from '@/components/providers/SessionProvider';
import SWRProvider from '@/components/providers/SWRProvider';
import LoadingProvider from '@/components/providers/LoadingProvider';
import ProgressBar from '@/components/ui/ProgressBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Resources - Platform for Knowledge',
  description: 'A modern platform for contributors to share their knowledge, tools, and resources with the world.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <SWRProvider>
            <LoadingProvider>
              <ProgressBar isLoading={false} />
              <Navbar />
              <main className="min-h-screen bg-gray-50">
                {children}
              </main>
            </LoadingProvider>
          </SWRProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
