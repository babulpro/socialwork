'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { Event, EventsResponse } from '@/types';
import EventCard from '@/components/EventCard';
import { Search, Filter, Calendar } from 'lucide-react';

const CATEGORIES = ['all', 'social', 'tech', 'sports', 'education', 'music', 'food', 'art', 'other'];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Explore Events</h1>
        <p className="mt-1 text-sm text-zinc-500">Discover public gatherings and connect with organizers</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Dropdown & Sort */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Filter className="w-4 h-4" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="py-2 px-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 capitalize focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="py-2 px-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="-date">Newest Date First</option>
            <option value="date">Upcoming First</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200 dark:border-zinc-800"
            />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-8">
          <Calendar className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No events match your criteria</h3>
          <p className="text-xs text-zinc-500 mt-1">Try clearing your filters or search keywords.</p>
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
