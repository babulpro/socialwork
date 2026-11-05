'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { apiRequest } from '@/lib/api';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import {
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  Clock,
  Eye,
  Upload,
  Image as ImageIcon,
  X,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';

const CATEGORIES: Array<{ id: Event['category']; label: string; icon: string }> = [
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'social', label: 'Social', icon: '🎉' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'education', label: 'Workshops', icon: '📚' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'food', label: 'Food', icon: '🍕' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'other', label: 'Other', icon: '📌' },
];

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending: isLoading } = useSession();
  const user = session?.user;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [category, setCategory] = useState<Event['category']>('tech');
  const [maxAttendees, setMaxAttendees] = useState<number | ''>('');
  const [isPublic, setIsPublic] = useState(true);

  // Cover image states
  const [coverImage, setCoverImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect guest users to sign-in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Handle file upload to Cloudinary via Next.js API
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
        throw new Error(data.message || 'Failed to upload image');
      }

      setCoverImage(data.url);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Upload failed. Ensure CLOUDINARY_URL is configured.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !location || !date) {
      setError('Please fill in all required fields (title, description, location, date)');
      return;
    }

    setSubmitting(true);

    try {
      const combinedDateTime = new Date(`${date}T${time || '00:00'}:00`).toISOString();

      const payload = {
        title,
        description,
        location,
        date: combinedDateTime,
        category,
        maxAttendees: maxAttendees === '' ? 0 : Number(maxAttendees),
        isPublic,
        coverImage,
      };

      const data = await apiRequest<{ success: boolean; event: Event }>('/events', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (data?.event?._id) {
        router.push(`/events/${data.event._id}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Construct mock event for live preview
  const previewDate = date ? new Date(`${date}T${time || '18:00'}:00`).toISOString() : new Date().toISOString();
  const previewEvent: Event = {
    _id: 'preview',
    title: title || 'Your Event Title Will Appear Here',
    description: description || 'Add a compelling description of what will happen at your event, who should attend, and what to bring.',
    location: location || 'City or Online Location',
    date: previewDate,
    category,
    maxAttendees: maxAttendees === '' ? 0 : Number(maxAttendees),
    attendees: [],
    attendeeCount: 1,
    coverImage,
    status: 'upcoming',
    isPublic: true,
    organizer: {
      _id: user.id,
      id: user.id,
      name: user.name || 'You',
      email: user.email || '',
      avatar: user.image || '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Events</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          Host a New Event
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Publish your gathering to the community, upload a cover photo, and manage attendee RSVPs.
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
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 rounded-3xl soft-shadow">
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
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
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
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
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
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 h-44 group">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white text-zinc-900 text-xs font-semibold shadow-md hover:bg-zinc-100 cursor-pointer"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-md hover:bg-rose-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 ${
                      uploadingImage
                        ? 'border-indigo-500 bg-indigo-50/10'
                        : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40'
                    }`}
                  >
                    {uploadingImage ? (
                      <div className="space-y-2 py-3">
                        <Loader2 className="w-7 h-7 animate-spin text-indigo-600 mx-auto" />
                        <p className="text-xs font-semibold text-indigo-600">Uploading to Cloudinary...</p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          Click to upload cover image
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
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
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
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
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
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
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
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
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
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-zinc-400">Leave blank if there is no attendance cap.</p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full py-4 rounded-2xl btn-primary-glow text-white font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Event...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Event</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
            <Eye className="w-4 h-4 text-indigo-500" />
            <span>Live Card Preview</span>
          </div>
          <EventCard event={previewEvent} />
          <p className="text-[11px] text-zinc-400 text-center px-4">
            This is how your event card will appear to attendees on the feed.
          </p>
        </div>
      </div>
    </div>
  );
}
