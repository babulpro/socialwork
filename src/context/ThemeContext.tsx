'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type ThemeMode = 'day' | 'night' | 'custom';
export type MoodPreset = 'sunset' | 'emerald' | 'cyber' | 'ocean' | 'mocha' | 'custom';

export interface MoodDetails {
  id: MoodPreset;
  name: string;
  icon: string;
  primaryHex: string;
  gradient: string;
  glow: string;
  description: string;
}

export const MOOD_PRESETS: Record<Exclude<MoodPreset, 'custom'>, MoodDetails> = {
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    icon: '🌅',
    primaryHex: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    glow: 'rgba(249, 115, 22, 0.35)',
    description: 'Warm amber, dusk tangerine & glowing coral radiance',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Oasis',
    icon: '🌲',
    primaryHex: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    glow: 'rgba(16, 185, 129, 0.35)',
    description: 'Lush jade, forest mint & calm organic vitality',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Violet',
    icon: '💜',
    primaryHex: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #f43f5e 100%)',
    glow: 'rgba(168, 85, 247, 0.35)',
    description: 'Electric synthwave purple, neon magenta & deep midnight',
  },
  ocean: {
    id: 'ocean',
    name: 'Oceanic Azure',
    icon: '🌊',
    primaryHex: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    glow: 'rgba(6, 182, 212, 0.35)',
    description: 'Bioluminescent cyan, electric azure & coastal tranquility',
  },
  mocha: {
    id: 'mocha',
    name: 'Warm Mocha',
    icon: '☕',
    primaryHex: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    glow: 'rgba(245, 158, 11, 0.35)',
    description: 'Caramel bronze, roasted espresso & cozy fireside amber',
  },
};

export const QUICK_CUSTOM_COLORS = [
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink', hex: '#ec4899' },
];

interface ThemeContextType {
  themeMode: ThemeMode;
  customMood: MoodPreset;
  customColor: string;
  moodCanvas: 'dark' | 'light';
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setCustomMood: (mood: MoodPreset) => void;
  setCustomColor: (hex: string) => void;
  setMoodCanvas: (canvas: 'dark' | 'light') => void;
  activeMoodDetails: MoodDetails;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('night');
  const [customMood, setCustomMoodState] = useState<MoodPreset>('sunset');
  const [customColor, setCustomColorState] = useState<string>('#f97316');
  const [moodCanvas, setMoodCanvasState] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  // Load persisted theme on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('socialhub-theme-mode') as ThemeMode | null;
      const savedMood = localStorage.getItem('socialhub-custom-mood') as MoodPreset | null;
      const savedColor = localStorage.getItem('socialhub-custom-color');
      const savedCanvas = localStorage.getItem('socialhub-mood-canvas') as 'dark' | 'light' | null;

      if (savedMode && ['day', 'night', 'custom'].includes(savedMode)) {
        setThemeModeState(savedMode);
      } else {
        // Default to night mode
        setThemeModeState('night');
      }

      if (savedMood && (savedMood in MOOD_PRESETS || savedMood === 'custom')) {
        setCustomMoodState(savedMood);
      }

      if (savedColor && /^#[0-9A-Fa-f]{3,6}$/.test(savedColor)) {
        setCustomColorState(savedColor);
      }

      if (savedCanvas && ['dark', 'light'].includes(savedCanvas)) {
        setMoodCanvasState(savedCanvas);
      }
    } catch {
      // localStorage may fail in restricted iframes
    }
    setMounted(true);
  }, []);

  // Compute effective dark state
  const isDark = useMemo(() => {
    if (themeMode === 'night') return true;
    if (themeMode === 'day') return false;
    return moodCanvas === 'dark';
  }, [themeMode, moodCanvas]);

  // Apply to DOM and synchronise whenever state updates
  useEffect(() => {
    if (!mounted && typeof document === 'undefined') return;

    const root = document.documentElement;

    // 1. Toggle dark / light classes
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // 2. Data attributes
    root.setAttribute('data-theme', themeMode);
    if (themeMode === 'custom') {
      root.setAttribute('data-mood', customMood);
    } else {
      root.removeAttribute('data-mood');
    }

    // 3. Custom color styling if custom mood is chosen
    if (themeMode === 'custom') {
      let primary = customMood === 'custom' ? customColor : MOOD_PRESETS[customMood]?.primaryHex || customColor;
      const rgb = hexToRgb(primary) || { r: 99, g: 102, b: 241 };

      root.style.setProperty('--primary', primary);
      root.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      root.style.setProperty('--primary-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isDark ? 0.35 : 0.22})`);
      root.style.setProperty('--primary-subtle', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isDark ? 0.16 : 0.08})`);
      
      if (customMood === 'custom') {
        root.style.setProperty('--gradient-accent', `linear-gradient(135deg, ${primary} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%)`);
      } else {
        root.style.setProperty('--gradient-accent', MOOD_PRESETS[customMood]?.gradient || '');
      }
    } else {
      // Clear custom overrides to let CSS rule take over
      root.style.removeProperty('--primary');
      root.style.removeProperty('--primary-rgb');
      root.style.removeProperty('--primary-glow');
      root.style.removeProperty('--primary-subtle');
      root.style.removeProperty('--gradient-accent');
    }

    // 4. Update meta color-scheme per Modern Web Guidance
    const metaTag = document.querySelector('meta[name="color-scheme"]');
    if (metaTag) {
      metaTag.setAttribute('content', isDark ? 'dark' : 'light');
    }
  }, [themeMode, customMood, customColor, moodCanvas, isDark, mounted]);

  // Handle storage event to sync across browser tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'socialhub-theme-mode' && e.newValue) {
        setThemeModeState(e.newValue as ThemeMode);
      }
      if (e.key === 'socialhub-custom-mood' && e.newValue) {
        setCustomMoodState(e.newValue as MoodPreset);
      }
      if (e.key === 'socialhub-custom-color' && e.newValue) {
        setCustomColorState(e.newValue);
      }
      if (e.key === 'socialhub-mood-canvas' && e.newValue) {
        setMoodCanvasState(e.newValue as 'dark' | 'light');
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('socialhub-theme-mode', mode);
    } catch {}
  };

  const setCustomMood = (mood: MoodPreset) => {
    setCustomMoodState(mood);
    try {
      localStorage.setItem('socialhub-custom-mood', mood);
      localStorage.setItem('socialhub-theme-mode', 'custom');
      setThemeModeState('custom');
    } catch {}
  };

  const setCustomColor = (hex: string) => {
    setCustomColorState(hex);
    try {
      localStorage.setItem('socialhub-custom-color', hex);
      localStorage.setItem('socialhub-custom-mood', 'custom');
      localStorage.setItem('socialhub-theme-mode', 'custom');
      setCustomMoodState('custom');
      setThemeModeState('custom');
    } catch {}
  };

  const setMoodCanvas = (canvas: 'dark' | 'light') => {
    setMoodCanvasState(canvas);
    try {
      localStorage.setItem('socialhub-mood-canvas', canvas);
    } catch {}
  };

  const activeMoodDetails: MoodDetails = useMemo(() => {
    if (customMood === 'custom') {
      const rgb = hexToRgb(customColor) || { r: 99, g: 102, b: 241 };
      return {
        id: 'custom',
        name: 'Personal Vibe',
        icon: '🎨',
        primaryHex: customColor,
        gradient: `linear-gradient(135deg, ${customColor} 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8) 100%)`,
        glow: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`,
        description: 'Your custom tailored ambient mood',
      };
    }
    return MOOD_PRESETS[customMood];
  }, [customMood, customColor]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        customMood,
        customColor,
        moodCanvas,
        isDark,
        setThemeMode,
        setCustomMood,
        setCustomColor,
        setMoodCanvas,
        activeMoodDetails,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
