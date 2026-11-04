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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Event Not Found</h2>
        <p className="mt-2 text-sm text-zinc-500">{error || 'This event does not exist or has been removed.'}</p>
        <Link
          href="/events"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }

  // Check if current logged-in user is the organizer (by ID or Email)
  const isOrganizer =
    user &&
    (event.organizer?._id === user.id ||
      event.organizer?.id === user.id ||
      event.organizer?.email === user.email ||
      (event.organizer as any) === user.id);

  // Check if current logged-in user is an attendee
  const isAttendee =
    user &&
    Array.isArray(event.attendees) &&
    event.attendees.some(
      (a) =>
        (typeof a === 'string' && (a === user.id || a === user.email)) ||
        (typeof a === 'object' && (a?._id === user.id || a?.id === user.id || (a as any)?.email === user.email))
    );

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
      setSuccessMsg('You have successfully joined this event! 🎉');
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
      setSuccessMsg('You have left the event.');
      await loadEvent();
    } catch (err: any) {
      setError(err.message || 'Failed to leave event');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Event (Organizer only)
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button & Action status alerts */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all events</span>
        </Link>

        {isOrganizer && (
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Event</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Details + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {event.category}
              </span>
              <span className="text-xs font-medium text-zinc-500 capitalize">{event.status}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight">
              {event.title}
            </h1>

            {/* Quick Meta Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <Calendar className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date & Time</div>
                  <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <MapPin className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Location</div>
                  <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 break-words">
                    {event.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-3">About this Event</h3>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>

          {/* Attendees List */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Attendees ({Array.isArray(event.attendees) ? event.attendees.length : 0})</span>
              </h3>
              {event.maxAttendees > 0 && (
                <span className="text-xs text-zinc-500">Max limit: {event.maxAttendees}</span>
              )}
            </div>

            {Array.isArray(event.attendees) && event.attendees.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {event.attendees.map((attendee: any, idx: number) => {
                  const attendeeName = typeof attendee === 'string' ? `User ${attendee.slice(-4)}` : attendee.name || 'Attendee';
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                        {attendeeName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                        {attendeeName}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 py-4">No attendees have joined yet. Be the first to join!</p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Organizer & Join Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white">Join Event</h3>

            {isOrganizer ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                <strong>You are the host</strong>
                <p>You cannot join your own event as an attendee.</p>
              </div>
            ) : isAttendee ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>You are attending this event</span>
                </div>
                <button
                  onClick={handleLeave}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Leaving...' : 'Cancel Attendance'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleJoin}
                disabled={actionLoading}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Join This Event</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Organized By</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-indigo-500/20">
                {event.organizer?.name ? event.organizer.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <div className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                  {event.organizer?.name || 'Anonymous Organizer'}
                </div>
                {event.organizer?.email && (
                  <div className="text-xs text-zinc-400 truncate">{event.organizer.email}</div>
                )}
              </div>
            </div>
            {event.organizer?.bio && (
              <p className="text-xs text-zinc-500 italic pt-2 border-t border-zinc-100 dark:border-zinc-800">
                "{event.organizer.bio}"
              </p>
            )}
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
