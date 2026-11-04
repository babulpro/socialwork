import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SocialEvents - Discover, Create & Join Events',
  description: 'A modern social management system where anyone can create and join events.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 py-8 text-center text-xs text-zinc-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 SocialEvents System. Built with Next.js, Node.js & MongoDB.</p>
              <div className="flex gap-6">
                <a href="https://mysocial-omega.vercel.app/health" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
                  Backend Health Status
                </a>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
