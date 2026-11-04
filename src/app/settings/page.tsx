'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { ArrowLeft, User, Mail, Shield, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Please sign in</h2>
        <p className="text-sm text-zinc-500">You must be logged in to access your settings.</p>
        <Link
          href="/sign-in"
          className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Account Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your profile details and session</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-600/20">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 text-zinc-500">
              <User className="w-4 h-4" />
              <span>Full Name</span>
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 text-zinc-500">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.email}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 text-zinc-500">
              <Shield className="w-4 h-4" />
              <span>Authentication Provider</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 capitalize border border-indigo-200 dark:border-indigo-800">
              Better Auth (MongoDB)
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
