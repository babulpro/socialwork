import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<string, string> = {
  social: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  tech: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  sports: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  education: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  music: 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  food: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  art: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  other: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
};

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const attendeeCount =
    typeof event.attendeeCount === 'number'
      ? event.attendeeCount
      : Array.isArray(event.attendees)
      ? event.attendees.length
      : 0;

  const colorClass = categoryColors[event.category] || categoryColors.other;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Category & Status Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${colorClass}`}>
            {event.category}
          </span>
          <span className="text-xs font-medium text-zinc-500 capitalize">
            {event.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {event.title}
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {event.description}
        </p>

        {/* Meta details */}
        <div className="mt-4 space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span>
              {formattedDate} • {formattedTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>

      {/* Footer: Organizer & Attendees & Button */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {event.organizer?.name ? event.organizer.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              {attendeeCount}
              {event.maxAttendees > 0 ? ` / ${event.maxAttendees}` : ''}
            </span>
          </div>
        </div>

        <Link
          href={`/events/${event._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
