import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { MapPin, Users, ArrowUpRight, Clock } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const categoryStyles: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  social: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500', border: 'border-blue-200 dark:border-blue-800' },
  tech: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-500', border: 'border-indigo-200 dark:border-indigo-800' },
  sports: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-800' },
  education: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500', border: 'border-amber-200 dark:border-amber-800' },
  music: { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', text: 'text-fuchsia-700 dark:text-fuchsia-300', dot: 'bg-fuchsia-500', border: 'border-fuchsia-200 dark:border-fuchsia-800' },
  food: { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500', border: 'border-orange-200 dark:border-orange-800' },
  art: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500', border: 'border-rose-200 dark:border-rose-800' },
  other: { bg: 'bg-zinc-100 dark:bg-zinc-800/60', text: 'text-zinc-700 dark:text-zinc-300', dot: 'bg-zinc-500', border: 'border-zinc-200 dark:border-zinc-700' },
};

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const monthStr = eventDate.toLocaleDateString('en-US', { month: 'short' });
  const dayStr = eventDate.getDate();
  const timeStr = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const attendeeCount =
    typeof event.attendeeCount === 'number'
      ? event.attendeeCount
      : Array.isArray(event.attendees)
      ? event.attendees.length
      : 0;

  const spotsLeft = event.maxAttendees > 0 ? Math.max(0, event.maxAttendees - attendeeCount) : null;
  const isFull = event.maxAttendees > 0 && spotsLeft === 0;

  const style = categoryStyles[event.category] || categoryStyles.other;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 soft-shadow hover:soft-shadow-lg hover:border-primary-themed transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
      {/* Ambient hover glow inside card using active mood glow */}
      <div
        className="absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'var(--primary-glow)' }}
      />

      {/* Cover Image if present */}
      {event.coverImage && (
        <div className="relative w-[calc(100%+3rem)] h-40 -mx-6 -mt-6 mb-5 overflow-hidden border-b border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div>
        {/* Top Header: Category Tag & Calendar Block */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize border ${style.bg} ${style.text} ${style.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {event.category}
            </span>

            {isFull ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                Full
              </span>
            ) : spotsLeft !== null && spotsLeft <= 5 ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} left
              </span>
            ) : null}
          </div>

          {/* Calendar block */}
          <div className="flex flex-col items-center justify-center w-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-700/70 text-center flex-shrink-0 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-themed">
              {monthStr}
            </span>
            <span className="text-lg font-black leading-none text-zinc-900 dark:text-zinc-100">
              {dayStr}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/events/${event._id}`} className="block group-hover:text-primary-themed transition-colors">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1 leading-snug">
            {event.title}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Meta details: Time & Location */}
        <div className="mt-5 space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <span className="font-medium">{timeStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <span className="truncate font-medium">{event.location}</span>
          </div>
        </div>
      </div>

      {/* Footer: Organizer + Attendees count + CTA link */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full btn-primary-glow text-white flex items-center justify-center text-xs font-bold shadow-xs flex-shrink-0">
            {event.organizer?.name ? event.organizer.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[100px] font-medium">
            {event.organizer?.name || 'Organizer'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium bg-zinc-100/70 dark:bg-zinc-800/60 px-2.5 py-1 rounded-full">
            <Users className="w-3.5 h-3.5 text-primary-themed" />
            <span>
              {attendeeCount}
              {event.maxAttendees > 0 ? `/${event.maxAttendees}` : ''}
            </span>
          </div>

          <Link
            href={`/events/${event._id}`}
            aria-label={`View ${event.title}`}
            className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:btn-primary-glow transition-all shadow-xs group-hover:scale-105"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
