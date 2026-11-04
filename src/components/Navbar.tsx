'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Calendar, PlusCircle, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-white bg-clip-text text-transparent">
              SocialEvents
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/events"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Explore Events
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/events/create"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Event</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center gap-3 pl-2 border-l border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{user.name}</span>
                  </div>

                  <button
                    onClick={logout}
                    title="Log out"
                    className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-zinc-700 dark:text-zinc-200"
          >
            Explore Events
          </Link>

          {user ? (
            <>
              <Link
                href="/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-base font-medium text-indigo-600 dark:text-indigo-400"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Event</span>
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-base font-medium text-zinc-700 dark:text-zinc-200"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Signed in as <strong>{user.name}</strong>
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm text-red-600 font-medium"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 font-medium text-sm text-zinc-700 dark:text-zinc-200"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
