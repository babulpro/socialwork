'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme, MOOD_PRESETS, QUICK_CUSTOM_COLORS, ThemeMode, MoodPreset } from '@/context/ThemeContext';
import { Sun, Moon, Palette, Check, Sparkles, SlidersHorizontal, ChevronRight } from 'lucide-react';

export default function ThemeMoodSwitcher() {
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

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Switch Day, Night, or Custom Mood"
        aria-expanded={isOpen}
        className="group relative flex h-9 items-center gap-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs backdrop-blur-md transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
      >
        {themeMode === 'day' ? (
          <>
            <Sun className="h-4 w-4 text-amber-500 transition-transform group-hover:rotate-45 duration-300" />
            <span className="hidden sm:inline text-[11px] font-bold">Day</span>
          </>
        ) : themeMode === 'night' ? (
          <>
            <Moon className="h-4 w-4 text-indigo-400 transition-transform group-hover:-rotate-12 duration-300" />
            <span className="hidden sm:inline text-[11px] font-bold">Night</span>
          </>
        ) : (
          <>
            <span className="relative flex items-center justify-center">
              <Palette className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
              <span
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full ring-2 ring-white dark:ring-zinc-900 animate-pulse"
                style={{ backgroundColor: activeMoodDetails.primaryHex }}
              />
            </span>
            <span className="hidden sm:inline text-[11px] font-bold truncate max-w-[80px]">
              {activeMoodDetails.name}
            </span>
          </>
        )}
      </button>

      {/* Floating Theme & Mood Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </span>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Display Mood & Theme</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              {themeMode}
            </span>
          </div>

          {/* Primary 3-Way Mode Segmented Switcher */}
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-1">
            {/* Day Button */}
            <button
              type="button"
              onClick={() => setThemeMode('day')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                themeMode === 'day'
                  ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>Day</span>
            </button>

            {/* Night Button */}
            <button
              type="button"
              onClick={() => setThemeMode('night')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                themeMode === 'night'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Moon className="h-4 w-4" />
              <span>Night</span>
            </button>

            {/* Custom Mood Button */}
            <button
              type="button"
              onClick={() => setThemeMode('custom')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                themeMode === 'custom'
                  ? 'bg-white dark:bg-zinc-800 text-pink-600 dark:text-pink-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Mood</span>
            </button>
          </div>

          {/* Custom Mood Selector Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Select Mood Vibe
              </span>
              {themeMode === 'custom' && (
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setMoodCanvas('dark')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                      moodCanvas === 'dark'
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoodCanvas('light')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                      moodCanvas === 'light'
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Light
                  </button>
                </div>
              )}
            </div>

            {/* Preset Vibe Cards */}
            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(MOOD_PRESETS) as Array<Exclude<MoodPreset, 'custom'>>).map((key) => {
                const preset = MOOD_PRESETS[key];
                const isSelected = themeMode === 'custom' && customMood === key;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setCustomMood(key)}
                    className={`group flex items-center justify-between w-full px-3 py-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-100/90 dark:bg-zinc-900/90 shadow-xs'
                        : 'border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base flex-shrink-0">{preset.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
                          <span>{preset.name}</span>
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate leading-tight">
                          {preset.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <div
                        className="h-3.5 w-7 rounded-full shadow-xs"
                        style={{ background: preset.gradient }}
                      />
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 font-bold" />
                      ) : (
                        <div className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Freeform Custom Color Swatches & Native Color Picker */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Personal Palette
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {themeMode === 'custom' && customMood === 'custom' ? customColor : 'Custom'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1.5">
                {QUICK_CUSTOM_COLORS.map((item) => {
                  const isActive =
                    themeMode === 'custom' &&
                    customMood === 'custom' &&
                    customColor.toLowerCase() === item.hex.toLowerCase();

                  return (
                    <button
                      key={item.hex}
                      type="button"
                      title={item.name}
                      onClick={() => setCustomColor(item.hex)}
                      className={`h-7 w-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center relative ${
                        isActive ? 'ring-2 ring-offset-2 ring-zinc-800 dark:ring-white scale-110' : ''
                      }`}
                      style={{ backgroundColor: item.hex }}
                    >
                      {isActive && <Check className="h-3 w-3 text-white drop-shadow-md" />}
                    </button>
                  );
                })}

                {/* Color input for full RGB freedom */}
                <label
                  title="Pick custom hex color"
                  className="relative grid h-7 w-7 place-items-center rounded-full border border-dashed border-zinc-400 dark:border-zinc-600 hover:border-zinc-700 dark:hover:border-zinc-300 cursor-pointer overflow-hidden transition-colors"
                >
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Palette className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300 pointer-events-none" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
