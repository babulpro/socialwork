'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import { PlusCircle, Calendar, Users, Loader2, Sparkles, LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'created' | 'joined'>('created');
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

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

        // Fetch user profile with populated joined events
        const profileData = await apiRequest<{ success: boolean; user: any }>('/auth/me');
        if (profileData?.user?.joinedEvents) {
          setJoinedEvents(profileData.user.joinedEvents || []);
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

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const displayedEvents = activeTab === 'created' ? createdEvents : joinedEvents;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Profile Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-indigo-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>{user.name}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 capitalize border border-indigo-200 dark:border-indigo-800">
                {user.role}
              </span>
            </h1>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        <Link
          href="/events/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Host New Event</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('created')}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 transition-all relative ${
              activeTab === 'created'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events I Created ({createdEvents.length})</span>
            {activeTab === 'created' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('joined')}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 transition-all relative ${
              activeTab === 'joined'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Events I've Joined ({joinedEvents.length})</span>
            {activeTab === 'joined' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Content */}
        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200 dark:border-zinc-800"
              />
            ))}
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-8">
            <LayoutDashboard className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              {activeTab === 'created' ? "You haven't hosted any events yet" : "You haven't joined any events yet"}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              {activeTab === 'created'
                ? 'Create your first event today and start connecting with people.'
                : 'Explore upcoming public events and click "Join" to participate.'}
            </p>
            <div className="mt-6">
              <Link
                href={activeTab === 'created' ? '/events/create' : '/events'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                {activeTab === 'created' ? (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Create an Event</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
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
