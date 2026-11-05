'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from '@/lib/auth-client';
import { Calendar, Plus } from '@gravity-ui/icons';
import { Sparkles } from 'lucide-react';

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
    <nav className="fixed inset-x-0 top-0 z-50 w-full border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-all">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-2 md:gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-bold text-zinc-900 dark:text-zinc-100 text-lg tracking-tight"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent font-black tracking-tight text-xl">
              SocialHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/events"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
            >
              Events
            </Link>

            {user && (
              <Link
                href="/events/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
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
                className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-500 shadow-sm shadow-indigo-500/30"
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
                className="flex cursor-pointer items-center gap-2 rounded-full p-1 pr-2.5 outline-none transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-indigo-500 border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white text-xs font-bold shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>

                <span className="hidden max-w-[120px] truncate text-xs font-semibold sm:block text-zinc-800 dark:text-zinc-200">
                  {user.name}
                </span>

                <svg
                  className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8l4 4 4-4" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                      <span>My Events</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <span>Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-2 cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/sign-in"
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-zinc-900 dark:bg-white px-4 py-1.5 text-sm font-semibold text-white dark:text-zinc-950 shadow-sm hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
