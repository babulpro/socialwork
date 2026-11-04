'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from '@/lib/auth-client';
import { Calendar, Plus } from '@gravity-ui/icons';

export default function TopNavbar() {
  const { data: session, isPending } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const user = session?.user;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-2 md:gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-zinc-900 dark:text-zinc-100 text-lg tracking-tight"
          >
            babul
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/events"
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Events
            </Link>

            {user && (
              <Link
                href="/events/new"
                className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Mobile Navigation + Auth */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Navigation */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              href="/events"
              aria-label="Events"
              className="grid h-9 w-9 place-items-center rounded-full text-zinc-600 dark:text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <Calendar className="h-4 w-4" />
            </Link>

            {user && (
              <Link
                href="/events/new"
                aria-label="Create event"
                className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Auth Actions */}
          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2 outline-none transition hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-white font-semibold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>

                <span className="hidden max-w-[120px] truncate text-sm font-medium sm:block text-zinc-900 dark:text-zinc-100">
                  {user.name}
                </span>

                <svg
                  className={`h-4 w-4 text-zinc-400 transition-transform ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8l4 4 4-4" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl z-50 py-1">
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    My Events
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>
    </nav>
  );
}
