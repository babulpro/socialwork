import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import TopNavbar from '@/components/TopNavbar';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'babul • Modern Social Events & Community Gatherings',
  description: 'Discover community gatherings, tech conferences, workshops, and social meetups. Host your own event in seconds and invite others to join.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <Providers>
          <TopNavbar />
          <main className="flex-1 pt-16">{children}</main>
          <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md py-10 text-xs text-zinc-500">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">babul</span>
                <span className="text-zinc-400">•</span>
                <p>© 2026 Social Management Platform</p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Link href="/events" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Explore Events
                </Link>
                <Link href="/events/new" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Host an Event
                </Link>
                <a
                  href="https://mysocial-omega.vercel.app/health"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] border border-emerald-200 dark:border-emerald-800/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Backend Live</span>
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
