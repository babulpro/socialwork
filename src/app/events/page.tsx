'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { Event, EventsResponse } from '@/types';
import EventCard from '@/components/EventCard';
import { Search, Filter, ArrowUpDown, X, Plus, Compass } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  'all',
  'tech',
  'social',
  'sports',
  'education',
  'music',
  'food',
  'art',
  'other',
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-date');

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'all') queryParams.append('category', category);
        queryParams.append('sort', sort);

        const data = await apiRequest<EventsResponse>(`/events?${queryParams.toString()}`);
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [category, sort]);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              Explore Events
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold badge-mood">
              {filteredEvents.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Discover community gatherings, RSVP in one click, or host your own.
          </p>
        </div>

        <Link
          href="/events/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl btn-primary-glow text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Host Event</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-3xl soft-shadow">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search events by title, topic, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-9 py-2.5 text-sm rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-950/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="py-2.5 px-3 text-xs font-semibold rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 capitalize focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="py-2.5 px-3 text-xs font-semibold rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="-date">Latest Created</option>
              <option value="date">Upcoming Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200/60 dark:border-zinc-800/60"
            />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No events match your criteria</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category.
          </p>
          {(search || category !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setCategory('all');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
