'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import { apiRequest } from '@/lib/api';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Upload,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  Eye,
  Check,
  Save,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'tech', label: 'Tech & Code', icon: '💻' },
  { id: 'social', label: 'Social', icon: '🎉' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'education', label: 'Workshops', icon: '📚' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'food', label: 'Food', icon: '🍕' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'other', label: 'Other', icon: '📌' },
];

function EditEventContent() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  const { data: session, isPending: authPending } = useSession();
  const user = session?.user;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loadingEvent, setLoadingEvent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [category, setCategory] = useState<Event['category']>('tech');
  const [maxAttendees, setMaxAttendees] = useState<number | ''>('');
  const [isPublic, setIsPublic] = useState(true);
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  // Cover image states
  const [coverImage, setCoverImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Original event state for comparison and preview
  const [originalEvent, setOriginalEvent] = useState<Event | null>(null);

  // Fetch initial event data
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      setLoadingEvent(true);
      try {
        const data = await apiRequest<{ success: boolean; event: Event }>(`/events/${eventId}`);
        const ev = data.event;
        setOriginalEvent(ev);

        // Pre-fill form fields
        setTitle(ev.title || '');
        setDescription(ev.description || '');
        setLocation(ev.location || '');
        setCategory(ev.category || 'tech');
        setMaxAttendees(ev.maxAttendees && ev.maxAttendees > 0 ? ev.maxAttendees : '');
        setIsPublic(ev.isPublic ?? true);
        setCoverImage(ev.coverImage || '');

        // Format Date and Time
        if (ev.date) {
          const d = new Date(ev.date);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          setDate(`${yyyy}-${mm}-${dd}`);

          const hours = String(d.getHours()).padStart(2, '0');
          const minutes = String(d.getMinutes()).padStart(2, '0');
          setTime(`${hours}:${minutes}`);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load event details for editing');
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Auth & ownership check
  const isOrganizer =
    user &&
    originalEvent &&
    (originalEvent.organizer?._id === user.id ||
      originalEvent.organizer?.id === user.id ||
      originalEvent.organizer?.email === user.email ||
      (originalEvent.organizer as any) === user.id);

  if (authPending || loadingEvent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-themed" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Please sign in</h2>
        <p className="text-sm text-zinc-500">You must be logged in to edit events.</p>
        <Link
          href="/sign-in"
          className="inline-block px-5 py-2.5 rounded-2xl btn-primary-glow text-white font-semibold text-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (originalEvent && !isOrganizer) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Access Denied</h2>
        <p className="text-sm text-zinc-500">Only the host of this event is authorized to modify it.</p>
        <Link
          href={`/events/${eventId}`}
          className="inline-block px-5 py-2.5 rounded-2xl btn-primary-glow text-white font-semibold text-sm"
        >
          Back to Event
        </Link>
      </div>
    );
  }

  // Handle file upload to Cloudinary
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be under 10MB');
      return;
    }

    setUploadError(null);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Image upload failed');
      }

      setCoverImage(data.url);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!title.trim() || !description.trim() || !location.trim() || !date || !time) {
        throw new Error('Please fill in all required fields marked with *');
      }

      const selectedDateTime = new Date(`${date}T${time}`);
      if (isNaN(selectedDateTime.getTime())) {
        throw new Error('Please enter a valid event date and time.');
      }

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (selectedDateTime < fiveMinutesAgo) {
        throw new Error('Event date and time cannot be in the past. Please select today or a future date/time.');
      }

      const dateTime = selectedDateTime.toISOString();

      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date: dateTime,
        category,
        isPublic,
        coverImage: coverImage.trim() || '',
      };

      if (typeof maxAttendees === 'number' && maxAttendees > 0) {
        payload.maxAttendees = maxAttendees;
      } else {
        payload.maxAttendees = 0; // unlimited
      }

      await apiRequest(`/events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      // Redirect back to event detail page
      router.push(`/events/${eventId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Live Card Preview
  const previewDate = date ? `${date}T${time || '00:00'}:00.000Z` : originalEvent?.date || '';
  const previewEvent: Event = {
    _id: eventId,
    title: title || 'Your Event Title',
    description: description || 'Your event description will appear here...',
    category,
    date: previewDate,
    location: location || 'Venue or Online Link',
    coverImage: coverImage || '',
    maxAttendees: typeof maxAttendees === 'number' ? maxAttendees : 0,
    attendees: originalEvent?.attendees || [],
    attendeeCount: originalEvent?.attendeeCount || 0,
    isPublic,
    status: originalEvent?.status || 'upcoming',
    organizer: originalEvent?.organizer || {
      _id: user.id,
      name: user.name || 'You',
    },
    createdAt: originalEvent?.createdAt || '',
    updatedAt: '',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div>
        <Link
          href={`/events/${eventId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-primary-themed mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Event Details</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          Edit Event
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Update the event details, change the cover photo, or adjust attendee capacity.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-600 dark:text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-8 rounded-3xl soft-shadow"
        >
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js & React Developers Meetup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Cover Image Upload (Cloudinary) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Cover Image (Cloudinary)
              </label>
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    imageTab === 'upload'
                      ? 'bg-white dark:bg-zinc-900 text-primary-themed shadow-xs'
                      : 'text-zinc-500'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    imageTab === 'url'
                      ? 'bg-white dark:bg-zinc-900 text-primary-themed shadow-xs'
                      : 'text-zinc-500'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {imageTab === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {coverImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 h-48 sm:h-52 bg-zinc-900 group">
                    <Image
                      src={coverImage}
                      alt="Cover Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white/95 text-zinc-900 text-xs font-semibold shadow-md hover:bg-white cursor-pointer transition-transform hover:scale-105"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-md hover:bg-rose-700 cursor-pointer transition-transform hover:scale-105"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      uploadingImage
                        ? 'border-indigo-500 bg-indigo-50/10'
                        : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40'
                    }`}
                  >
                    {uploadingImage ? (
                      <div className="space-y-2 py-3">
                        <Loader2 className="w-7 h-7 animate-spin text-primary-themed mx-auto" />
                        <p className="text-xs font-semibold text-primary-themed">Uploading to Cloudinary...</p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <div className="w-10 h-10 rounded-2xl badge-mood mx-auto flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          Click to upload new cover image
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          PNG, JPG, or WEBP up to 10MB (Cloudinary optimized)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or Cloudinary link"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            )}

            {uploadError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {uploadError}
              </p>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id as Event['category'])}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'btn-primary-glow border-transparent shadow-sm'
                        : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700/80 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the agenda, who should attend, and what to expect..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Location <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Dhaka Tech Park, Room 302 or Google Meet link"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  min={todayStr || undefined}
                  value={date}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && todayStr && val < todayStr) {
                      setError('Event date cannot be in the past. Please choose today or a future date.');
                      return;
                    }
                    setError(null);
                    setDate(val);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Time <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Capacity Limit */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Capacity Limit (Optional)
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                placeholder="Leave blank for unlimited attendees"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <p className="text-[11px] text-zinc-400">Leave blank if there is no attendance cap.</p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full sm:flex-1 py-3.5 rounded-2xl btn-primary-glow text-white font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <Link
              href={`/events/${eventId}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 font-semibold text-sm text-center transition-all cursor-pointer"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
            <Eye className="w-4 h-4 text-primary-themed" />
            <span>Updated Live Preview</span>
          </div>
          <EventCard event={previewEvent} />
          <p className="text-[11px] text-zinc-400 text-center px-4">
            Changes are rendered in real time as you edit the fields.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EditEventPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-themed" />
        </div>
      }
    >
      <EditEventContent />
    </Suspense>
  );
}
