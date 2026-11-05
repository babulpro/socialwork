'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { MapPin, Users, ArrowUpRight, Clock, Sparkles } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const CATEGORY_META: Record<string, { gradient: string; emoji: string; dotColor: string }> = {
  tech: {
    gradient: 'from-indigo-600 via-indigo-800 to-slate-900',
    emoji: '💻',
    dotColor: 'bg-indigo-400',
  },
  social: {
    gradient: 'from-pink-500 via-purple-700 to-indigo-900',
    emoji: '🎉',
    dotColor: 'bg-pink-400',
  },
  sports: {
    gradient: 'from-emerald-600 via-teal-800 to-slate-900',
    emoji: '⚽',
    dotColor: 'bg-emerald-400',
  },
  education: {
    gradient: 'from-amber-600 via-orange-700 to-stone-900',
    emoji: '📚',
    dotColor: 'bg-amber-400',
  },
  music: {
    gradient: 'from-fuchsia-600 via-purple-800 to-slate-950',
    emoji: '🎵',
    dotColor: 'bg-fuchsia-400',
  },
  food: {
    gradient: 'from-orange-500 via-amber-700 to-neutral-900',
    emoji: '🍕',
    dotColor: 'bg-orange-400',
  },
  art: {
    gradient: 'from-rose-500 via-violet-700 to-slate-900',
    emoji: '🎨',
    dotColor: 'bg-rose-400',
  },
  other: {
    gradient: 'from-violet-600 via-purple-800 to-slate-900',
    emoji: '✨',
    dotColor: 'bg-violet-400',
  },
};

export default function EventCard({ event }: EventCardProps) {
  const [imageError, setImageError] = useState(false);

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

  const categoryKey = (event.category || 'other').toLowerCase();
  const meta = CATEGORY_META[categoryKey] || CATEGORY_META.other;

  const hasValidImage = Boolean(event.coverImage) && !imageError;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 soft-shadow hover:soft-shadow-lg hover:border-primary-themed transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
      {/* Ambient hover glow inside card */}
      <div
        className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'var(--primary-glow)' }}
      />

      {/* Smart Cover Banner (Image or Curated Gradient) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        {hasValidImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        ) : (
          /* Smart Curated Generative Visual Banner */
          <div
            className={`h-full w-full bg-gradient-to-br ${meta.gradient} flex items-center justify-center relative overflow-hidden transition-transform duration-700 group-hover:scale-105`}
          >
            {/* Ambient pattern */}
            <div className="absolute inset-0 bg-dot-pattern opacity-25" />
            <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <span className="text-5xl drop-shadow-lg transform group-hover:scale-115 transition-transform duration-500 select-none">
              {meta.emoji}
            </span>
          </div>
        )}

        {/* High-end Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          {/* Category Chip */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/50 text-white border border-white/20 shadow-xs capitalize">
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
            <span>{event.category || 'Event'}</span>
          </span>

          {/* Floating Calendar Date Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-black/60 text-white border border-white/20 shadow-xs text-xs">
            <span className="text-primary-themed font-extrabold uppercase tracking-wider text-[10px]">
              {monthStr}
            </span>
            <span className="text-zinc-400 text-[10px]">•</span>
            <span className="font-black text-xs text-white">{dayStr}</span>
          </div>
        </div>

        {/* Bottom Floating Status / Time */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          {isFull ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md bg-rose-600/85 text-white border border-rose-400/30 shadow-xs">
              Sold Out
            </span>
          ) : spotsLeft !== null && spotsLeft <= 5 ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md bg-amber-500/85 text-white border border-amber-400/30 shadow-xs">
              ⚡ Only {spotsLeft} left
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-md bg-white/20 text-white border border-white/15 shadow-xs">
              Free to Attend
            </span>
          )}

          <div className="flex items-center gap-1 text-[11px] font-semibold text-white/95 backdrop-blur-md bg-black/50 px-2 py-0.5 rounded-full border border-white/15 shadow-xs">
            <Clock className="w-3 h-3 text-white/80" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <Link
            href={`/events/${event._id}`}
            className="block group-hover:text-primary-themed transition-colors"
          >
            <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1 leading-snug tracking-tight">
              {event.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Location snippet */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <span className="truncate font-medium">{event.location}</span>
          </div>
        </div>

        {/* Footer: Organizer + Attendees count + Action Link */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full btn-primary-glow text-white flex items-center justify-center text-xs font-bold shadow-xs flex-shrink-0">
              {event.organizer?.name ? event.organizer.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[110px] font-medium">
              {event.organizer?.name || 'Organizer'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300 font-medium bg-zinc-100/80 dark:bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
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
    </div>
  );
}
