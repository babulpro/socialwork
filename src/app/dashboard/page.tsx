'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import { apiRequest } from '@/lib/api';
import { Event, EventsResponse } from '@/types';
import EventCard from '@/components/EventCard';
import {
  Plus,
  Calendar,
  Users,
  Loader2,
  Sparkles,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState<'created' | 'joined'>('created');
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isPending && !user) {
      router.push('/sign-in');
    }
  }, [user, isPending, router]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      setFetching(true);
      try {
        // Fetch created events
        const createdData = await apiRequest<{ success: boolean; count: number; events: Event[] }>(
          '/events/user/my-events'
        );
        setCreatedEvents(createdData.events || []);

        // Also fetch all events and filter for joined events where user is an attendee
        const allEventsData = await apiRequest<EventsResponse>('/events');
        if (allEventsData?.events) {
          const joined = allEventsData.events.filter((e) =>
            e.attendees?.some((att) => {
              const attendeeId = typeof att === 'string' ? att : att._id;
              return attendeeId === user.id || attendeeId === (user as any)._id;
            })
          );
          setJoinedEvents(joined);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (isPending || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const displayedEvents = activeTab === 'created' ? createdEvents : joinedEvents;
  const totalAudience = createdEvents.reduce((acc, curr) => acc + (curr.attendeeCount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-8 rounded-3xl soft-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {user.image ? (
            <div className="relative w-14 sm:w-16 h-14 sm:h-16 rounded-3xl overflow-hidden ring-2 ring-indigo-500/30 shadow-lg flex-shrink-0">
              <Image
                src={user.image}
                alt={user.name || 'User'}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-3xl btn-primary-glow text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold badge-mood capitalize">
                Member
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        <Link
          href="/events/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl btn-primary-glow text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Host New Event</span>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 rounded-3xl soft-shadow space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Events Hosted</p>
          <p className="text-3xl font-black text-zinc-900 dark:text-white">{createdEvents.length}</p>
          <p className="text-[11px] text-zinc-500 font-medium">Published by you</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 rounded-3xl soft-shadow space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Events Joined</p>
          <p className="text-3xl font-black text-zinc-900 dark:text-white">{joinedEvents.length}</p>
          <p className="text-[11px] text-zinc-500 font-medium">Confirmed RSVPs</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 rounded-3xl soft-shadow space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Community Reach</p>
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{totalAudience}</p>
          <p className="text-[11px] text-zinc-500 font-medium">Total attendees in your events</p>
        </div>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('created')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'created'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events I Created ({createdEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('joined')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'joined'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Events I've Joined ({joinedEvents.length})</span>
          </button>
        </div>

        {/* Content Feed */}
        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200/70 dark:border-zinc-800/70"
              />
            ))}
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {activeTab === 'created' ? "You haven't hosted any events yet" : "You haven't joined any events yet"}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                {activeTab === 'created'
                  ? 'Publish your first gathering today and start connecting with people.'
                  : 'Explore upcoming public events and click "Join" to reserve your spot.'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href={activeTab === 'created' ? '/events/new' : '/events'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-sm"
              >
                {activeTab === 'created' ? (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create an Event</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explore Events</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
