
import React, { useState, useEffect, useCallback } from 'react';

interface AccessibilityPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
}

const ACCESSIBILITY_STORAGE_KEY = 'accessibility-preferences';

export function useAccessibility() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    if (typeof window === 'undefined') {
      return {
        highContrast: false,
        reducedMotion: false,
        largeText: false,
        screenReaderOptimized: false,
      };
    }

    const stored = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    const defaultPrefs = {
      highContrast: false,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      largeText: false,
      screenReaderOptimized: false,
    };

    return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
  });

  const updatePreference = useCallback((key: keyof AccessibilityPreferences, value: boolean) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    updatePreference('highContrast', !preferences.highContrast);
  }, [preferences.highContrast, updatePreference]);

  const toggleReducedMotion = useCallback(() => {
    updatePreference('reducedMotion', !preferences.reducedMotion);
  }, [preferences.reducedMotion, updatePreference]);

  const toggleLargeText = useCallback(() => {
    updatePreference('largeText', !preferences.largeText);
  }, [preferences.largeText, updatePreference]);

  const toggleScreenReaderOptimized = useCallback(() => {
    updatePreference('screenReaderOptimized', !preferences.screenReaderOptimized);
  }, [preferences.screenReaderOptimized, updatePreference]);

  // Apply preferences to document
  useEffect(() => {
    const html = document.documentElement;
    
    if (preferences.highContrast) {
      html.classList.add('accessibility-high-contrast');
    } else {
      html.classList.remove('accessibility-high-contrast');
    }

    if (preferences.largeText) {
      html.classList.add('accessibility-large-text');
      html.style.setProperty('--accessibility-font-size', '120%');
    } else {
      html.classList.remove('accessibility-large-text');
      html.style.removeProperty('--accessibility-font-size');
    }

    if (preferences.reducedMotion) {
      html.classList.add('accessibility-reduce-motion');
    } else {
      html.classList.remove('accessibility-reduce-motion');
    }

    if (preferences.screenReaderOptimized) {
      html.classList.add('accessibility-screen-reader');
    } else {
      html.classList.remove('accessibility-screen-reader');
    }
  }, [preferences]);

  // Keyboard navigation enhancement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip links shortcut
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const skipLink = document.querySelector('.skip-link') as HTMLElement;
        skipLink?.focus();
      }

      // Main navigation shortcut
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        const nav = document.querySelector('nav') as HTMLElement;
        nav?.focus();
      }

      // Main content shortcut
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const main = document.querySelector('main') as HTMLElement;
        main?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    preferences,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    toggleScreenReaderOptimized,
    updatePreference,
  };
}
