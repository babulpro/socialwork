'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { Event, EventsResponse } from '@/types';
import EventCard from '@/components/EventCard';
import {
  Sparkles,
  Search,
  Compass,
  Plus,
  RefreshCw,
  Users,
  CalendarCheck,
  Globe2,
  X,
  ArrowRight,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Events', icon: '✨' },
  { id: 'tech', label: 'Tech & Code', icon: '💻' },
  { id: 'social', label: 'Social & Hangouts', icon: '🎉' },
  { id: 'sports', label: 'Sports & Fitness', icon: '⚽' },
  { id: 'education', label: 'Workshops', icon: '📚' },
  { id: 'music', label: 'Music & Concerts', icon: '🎵' },
  { id: 'food', label: 'Food & Drinks', icon: '🍕' },
  { id: 'art', label: 'Art & Design', icon: '🎨' },
  { id: 'other', label: 'Other', icon: '📌' },
];

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryParam = selectedCategory !== 'all' ? `category=${selectedCategory}` : '';
      const query = categoryParam ? `?${categoryParam}` : '';
      const data = await apiRequest<EventsResponse>(`/events${query}`);
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events from backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-24">
      {/* Hero Section with Ambient Glows */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-dot-pattern border-b border-zinc-200/60 dark:border-zinc-800/60">
        {/* Dynamic Colorful Glow Orbs reflecting active mood */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] blur-3xl pointer-events-none rounded-full transition-all duration-700"
          style={{
            background:
              'radial-gradient(ellipse at center, var(--accent-orb-1) 0%, var(--accent-orb-2) 50%, transparent 80%)',
          }}
        />
        <div
          className="absolute -top-12 right-10 w-72 h-72 blur-3xl pointer-events-none rounded-full transition-all duration-700"
          style={{ background: 'var(--accent-orb-2)' }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-mood text-xs font-semibold mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover & Host Real-World Meetups</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Create, Connect & Experience{' '}
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
              style={{ backgroundImage: 'var(--gradient-accent)' }}
            >
              Events Together
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The modern social management hub. Browse community hangouts, tech workshops, sports meetups, or host your own in seconds and gather with people.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl btn-primary-glow text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Events</span>
            </Link>

            <Link
              href="/events/new"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] soft-shadow"
            >
              <Plus className="w-4 h-4 text-primary-themed" />
              <span>Host an Event</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-14 pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">100%</p>
              <p className="text-xs text-zinc-500 font-medium">Free to Join & Host</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">Instant</p>
              <p className="text-xs text-zinc-500 font-medium">One-Click RSVP</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">Live</p>
              <p className="text-xs text-zinc-500 font-medium">Real-Time Attendee Sync</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">Active</p>
              <p className="text-xs text-zinc-500 font-medium">Community Driven</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Feed */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header + Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Featured Events
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold badge-mood">
                {filteredEvents.length}
              </span>
            </div>
            <p className="text-sm text-zinc-500 mt-1">
              Find what interests you, meet attendees, and secure your spot
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all soft-shadow"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'btn-primary-glow shadow-md scale-[1.02]'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 animate-pulse p-6 space-y-4"
              >
                <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                <div className="h-7 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-8 text-center space-y-4">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>
            <button
              onClick={fetchEvents}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl badge-mood flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No events found</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `No matches for "${searchQuery}". Try a different keyword or clear your filter.`
                  : 'There are no events listed in this category yet. Be the first to create one!'}
              </p>
            </div>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Clear Search Filter
              </button>
            ) : (
              <Link
                href="/events/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary-glow text-white text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create an Event Now</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
