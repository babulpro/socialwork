'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { ArrowLeft, User, Mail, Shield, LogOut, CheckCircle2, Sun, Moon, Sparkles, Palette, Check } from 'lucide-react';
import { useTheme, MOOD_PRESETS, QUICK_CUSTOM_COLORS, ThemeMode, MoodPreset } from '@/context/ThemeContext';

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const {
    themeMode,
    customMood,
    customColor,
    moodCanvas,
    setThemeMode,
    setCustomMood,
    setCustomColor,
    setMoodCanvas,
    activeMoodDetails,
  } = useTheme();

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Please sign in</h2>
        <p className="text-sm text-zinc-500">You must be logged in to access your settings.</p>
        <Link
          href="/sign-in"
          className="inline-block px-5 py-2.5 rounded-2xl btn-primary-glow text-white font-semibold text-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
          Account & Appearance
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your profile, display theme, and custom mood vibes</p>
      </div>

      {/* Theme & Custom Mood Preferences */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 soft-shadow space-y-6">
        <div className="flex items-center justify-between pb-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl btn-primary-glow text-white shadow-xs">
              <Palette className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Display & Mood Experience</h2>
              <p className="text-xs text-zinc-500">Switch between Day, Night, or personal ambient vibes</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full badge-mood capitalize">
            {themeMode === 'custom' ? `${activeMoodDetails.name}` : `${themeMode} Mode`}
          </span>
        </div>

        {/* 3 Main Modes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Day Mode */}
          <button
            type="button"
            onClick={() => setThemeMode('day')}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              themeMode === 'day'
                ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <Sun className="w-4 h-4" />
              </span>
              {themeMode === 'day' && <Check className="w-4 h-4 text-amber-600 font-bold" />}
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Day Mode</h3>
            <p className="text-xs text-zinc-500 mt-1">Crisp high-clarity daylight theme with high contrast</p>
          </button>

          {/* Night Mode */}
          <button
            type="button"
            onClick={() => setThemeMode('night')}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              themeMode === 'night'
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Moon className="w-4 h-4" />
              </span>
              {themeMode === 'night' && <Check className="w-4 h-4 text-indigo-500 font-bold" />}
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Night Mode</h3>
            <p className="text-xs text-zinc-500 mt-1">Deep obsidian dark canvas with soft violet luminescence</p>
          </button>

          {/* Custom Mood Mode */}
          <button
            type="button"
            onClick={() => setThemeMode('custom')}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              themeMode === 'custom'
                ? 'border-pink-500 ring-2 ring-pink-500/20 bg-pink-50/50 dark:bg-pink-950/20'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400">
                <Sparkles className="w-4 h-4" />
              </span>
              {themeMode === 'custom' && <Check className="w-4 h-4 text-pink-500 font-bold" />}
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Custom Mood</h3>
            <p className="text-xs text-zinc-500 mt-1">Immersive vibes: Sunset, Emerald, Cyber, Ocean, or Mocha</p>
          </button>
        </div>

        {/* Custom Mood Details & Presets */}
        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Ambient Mood Presets</h3>
              <p className="text-xs text-zinc-500">Select an atmospheric aesthetic for headers, badges, and glows</p>
            </div>

            {/* Base Canvas switch */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold self-start sm:self-auto">
              <span className="text-[11px] text-zinc-500 px-2">Atmosphere:</span>
              <button
                type="button"
                onClick={() => setMoodCanvas('dark')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                  moodCanvas === 'dark'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-bold'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Dark Canvas
              </button>
              <button
                type="button"
                onClick={() => setMoodCanvas('light')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                  moodCanvas === 'light'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-bold'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Light Canvas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(MOOD_PRESETS) as Array<Exclude<MoodPreset, 'custom'>>).map((key) => {
              const preset = MOOD_PRESETS[key];
              const isSelected = themeMode === 'custom' && customMood === key;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setCustomMood(key)}
                  className={`flex items-start justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-zinc-400 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/60 shadow-xs'
                      : 'border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{preset.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                        <span>{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{preset.description}</p>
                    </div>
                  </div>

                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 shadow-xs ring-2 ring-white dark:ring-zinc-900"
                    style={{ background: preset.gradient }}
                  />
                </button>
              );
            })}
          </div>

          {/* Custom Palette Freedom */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Fine-tune Your Accent Color</h4>
              <p className="text-[11px] text-zinc-500">Pick any custom hex code or choose a signature accent</p>
            </div>

            <div className="flex items-center gap-2">
              {QUICK_CUSTOM_COLORS.map((item) => (
                <button
                  key={item.hex}
                  type="button"
                  title={item.name}
                  onClick={() => setCustomColor(item.hex)}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                    themeMode === 'custom' && customMood === 'custom' && customColor === item.hex
                      ? 'ring-2 ring-offset-2 ring-zinc-800 dark:ring-white scale-110'
                      : ''
                  }`}
                  style={{ backgroundColor: item.hex }}
                >
                  {themeMode === 'custom' && customMood === 'custom' && customColor === item.hex && (
                    <Check className="w-3 h-3 text-white drop-shadow-sm" />
                  )}
                </button>
              ))}

              <label className="relative grid h-7 w-7 place-items-center rounded-full border border-dashed border-zinc-400 dark:border-zinc-600 hover:border-zinc-700 cursor-pointer overflow-hidden">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Palette className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Account Profile Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 soft-shadow space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-3xl btn-primary-glow text-white flex items-center justify-center text-2xl font-black shadow-md shadow-indigo-600/20">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 text-zinc-500 font-medium">
              <User className="w-4 h-4 text-zinc-400" />
              <span>Full Name</span>
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 text-zinc-500 font-medium">
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>Email</span>
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.email}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 text-zinc-500 font-medium">
              <Shield className="w-4 h-4 text-zinc-400" />
              <span>Authentication Provider</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Better Auth • MongoDB</span>
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
