'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { apiRequest } from '@/lib/api';
import { Event } from '@/types';
import {
  Calendar,
  MapPin,
  Users,
  UserCheck,
  UserPlus,
  ArrowLeft,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Share2,
  Check,
  Sparkles,
} from 'lucide-react';

function EventDetailContent() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  const { data: session } = useSession();
  const user = session?.user;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadEvent = async () => {
    if (!eventId) return;
    try {
      const data = await apiRequest<{ success: boolean; event: Event }>(`/events/${eventId}`);
      setEvent(data.event);
    } catch (err: any) {
      setError(err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Event Not Found</h2>
        <p className="text-sm text-zinc-500">{error || 'This event does not exist or has been removed.'}</p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>
    );
  }

  // Check if current user is the organizer
  const isOrganizer =
    user &&
    (event.organizer?._id === user.id ||
      event.organizer?.id === user.id ||
      event.organizer?.email === user.email ||
      (event.organizer as any) === user.id);

  // Check if current user has joined
  const isAttendee =
    user &&
    Array.isArray(event.attendees) &&
    event.attendees.some(
      (a) =>
        (typeof a === 'string' && (a === user.id || a === user.email)) ||
        (typeof a === 'object' && (a?._id === user.id || a?.id === user.id || (a as any)?.email === user.email))
    );

  const attendeeCount = Array.isArray(event.attendees) ? event.attendees.length : 0;
  const isFull = event.maxAttendees > 0 && attendeeCount >= event.maxAttendees;
  const spotsLeft = event.maxAttendees > 0 ? Math.max(0, event.maxAttendees - attendeeCount) : null;
  const percentage = event.maxAttendees > 0 ? Math.min(100, Math.round((attendeeCount / event.maxAttendees) * 100)) : null;

  // Handle Join
  const handleJoin = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await apiRequest(`/events/${eventId}/join`, { method: 'POST' });
      setSuccessMsg('You have successfully secured your spot! 🎉');
      await loadEvent();
    } catch (err: any) {
      setError(err.message || 'Failed to join event');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Leave
  const handleLeave = async () => {
    if (!user) return;
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await apiRequest(`/events/${eventId}/join`, { method: 'DELETE' });
      setSuccessMsg('You have left this event.');
      await loadEvent();
    } catch (err: any) {
      setError(err.message || 'Failed to leave event');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete (Organizer only)
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    setActionLoading(true);
    try {
      await apiRequest(`/events/${eventId}`, { method: 'DELETE' });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
      setActionLoading(false);
    }
  };

  const eventDate = new Date(event.date);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer soft-shadow"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          {isOrganizer && (
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-sm shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Main Grid: Details (Left) + Sticky RSVP (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Content) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-3xl soft-shadow space-y-6 overflow-hidden">
            {event.coverImage && (
              <div className="w-full h-64 sm:h-80 -mt-6 sm:-mt-8 -mx-6 sm:-mx-8 w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] mb-6 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider badge-mood">
                {event.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 capitalize">
                {event.status}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            {/* Quick Meta Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-100 dark:border-zinc-800">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Date & Time</div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-100 dark:border-zinc-800">
                <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Location</div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 break-words">
                    {event.location}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">
                    Public Gathering
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">About this Event</h3>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Organizer Info */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-sm font-extrabold shadow-sm flex-shrink-0">
                {event.organizer?.name ? event.organizer.name.charAt(0).toUpperCase() : 'O'}
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Organized by</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  {event.organizer?.name || 'Community Member'}
                </p>
              </div>
            </div>
          </div>

          {/* Attendees List */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-3xl soft-shadow space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Attendees ({attendeeCount})</span>
              </h3>
              {event.maxAttendees > 0 && (
                <span className="text-xs font-medium text-zinc-500">
                  Capacity: {event.maxAttendees}
                </span>
              )}
            </div>

            {attendeeCount === 0 ? (
              <p className="text-xs text-zinc-500 italic">No attendees have joined yet. Be the first!</p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {event.attendees.map((attendee: any, i: number) => {
                  const attName = typeof attendee === 'object' ? attendee?.name || 'Attendee' : 'Attendee';
                  const attEmail = typeof attendee === 'object' ? attendee?.email : '';
                  return (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {attName.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate max-w-[120px]">{attName}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky RSVP Box */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-7 rounded-3xl soft-shadow space-y-6">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Registration</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">Free</span>
                <span className="text-xs text-zinc-500 font-medium">to attend</span>
              </div>
            </div>

            {/* Spots capacity progress */}
            {event.maxAttendees > 0 && percentage !== null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-500">Occupancy</span>
                  <span className={percentage >= 90 ? 'text-rose-600 font-bold' : 'text-zinc-700 dark:text-zinc-300'}>
                    {attendeeCount} / {event.maxAttendees} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 90 ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && (
                  <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 text-center">
                    ⚠️ Hurry, only {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} remaining!
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {isOrganizer ? (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-center space-y-1">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto" />
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">You are the Organizer</p>
                <p className="text-[11px] text-zinc-500">You are hosting this event.</p>
              </div>
            ) : isAttendee ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <UserCheck className="w-4 h-4" />
                  <span>You are attending this event</span>
                </div>

                <button
                  type="button"
                  onClick={handleLeave}
                  disabled={actionLoading}
                  className="w-full py-3 px-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Leave Event'}
                </button>
              </div>
            ) : isFull ? (
              <button
                disabled
                className="w-full py-3.5 px-4 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-400 font-bold text-sm cursor-not-allowed text-center"
              >
                Event Capacity Reached
              </button>
            ) : (
              <button
                type="button"
                onClick={handleJoin}
                disabled={actionLoading}
                className="w-full py-3.5 px-4 rounded-2xl btn-primary-glow text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Join Event Now</span>
                  </>
                )}
              </button>
            )}

            <div className="pt-2 text-center">
              <p className="text-[11px] text-zinc-400">
                🔒 Protected by Better Auth & MongoDB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <EventDetailContent />
    </Suspense>
  );
}
