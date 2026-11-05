'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Home, Compass, Plus, Calendar, Settings, User } from 'lucide-react';

function MobileBottomNavContent() {
  const pathname = usePathname() || '/';
  const { data: session } = useSession();
  const user = session?.user;

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      active: pathname === '/',
    },
    {
      label: 'Events',
      href: '/events',
      icon: Compass,
      active: pathname.startsWith('/events') && pathname !== '/events/new' && pathname !== '/events/create',
    },
    {
      label: 'Create',
      href: user ? '/events/new' : '/sign-in',
      icon: Plus,
      isAction: true,
      active: pathname === '/events/new' || pathname === '/events/create',
    },
    {
      label: 'My Events',
      href: user ? '/dashboard' : '/sign-in',
      icon: Calendar,
      active: pathname === '/dashboard',
    },
    {
      label: 'Settings',
      href: user ? '/settings' : '/sign-in',
      icon: user ? Settings : User,
      active: pathname === '/settings',
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800/80 px-2 py-1.5 transition-all">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label="Create Event"
                className="group relative -top-3 flex flex-col items-center"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full btn-primary-glow text-white shadow-lg transition-transform group-active:scale-95">
                  <Icon className="h-5 w-5 stroke-[2.5]" />
                </span>
                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Host
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                item.active
                  ? 'text-primary-themed font-bold scale-105'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Icon className={`h-5 w-5 ${item.active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] font-medium tracking-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function MobileBottomNav() {
  return (
    <Suspense fallback={null}>
      <MobileBottomNavContent />
    </Suspense>
  );
}
