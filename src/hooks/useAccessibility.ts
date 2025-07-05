
import { useState, useEffect, useCallback } from 'react';

interface AccessibilityPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  screenReaderOptimized: false,
  keyboardNavigation: false
};

const STORAGE_KEY = 'accessibility-preferences';

export function useAccessibility() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load accessibility preferences:', error);
    }
    return DEFAULT_PREFERENCES;
  });

  // Detect system preferences
  useEffect(() => {
    const detectSystemPreferences = () => {
      const mediaQueries = {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
        highContrast: window.matchMedia('(prefers-contrast: high)'),
        largeText: window.matchMedia('(prefers-reduced-data: reduce)')
      };

      const updateFromSystem = () => {
        setPreferences(prev => ({
          ...prev,
          reducedMotion: prev.reducedMotion || mediaQueries.reducedMotion.matches,
          highContrast: prev.highContrast || mediaQueries.highContrast.matches
        }));
      };

      // Initial check
      updateFromSystem();

      // Listen for changes
      Object.values(mediaQueries).forEach(mq => {
        mq.addEventListener('change', updateFromSystem);
      });

      return () => {
        Object.values(mediaQueries).forEach(mq => {
          mq.removeEventListener('change', updateFromSystem);
        });
      };
    };

    if (typeof window !== 'undefined') {
      detectSystemPreferences();
    }
  }, []);

  // Apply accessibility preferences to DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
      root.style.setProperty('--accessibility-contrast', 'high');
    } else {
      root.classList.remove('high-contrast');
      root.style.removeProperty('--accessibility-contrast');
    }

    // Reduced motion
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion');
      root.style.setProperty('--accessibility-motion', 'reduce');
    } else {
      root.classList.remove('reduce-motion');
      root.style.removeProperty('--accessibility-motion');
    }

    // Large text
    if (preferences.largeText) {
      root.classList.add('large-text');
      root.style.setProperty('--accessibility-font-scale', '1.2');
    } else {
      root.classList.remove('large-text');
      root.style.removeProperty('--accessibility-font-scale');
    }

    // Screen reader optimized
    if (preferences.screenReaderOptimized) {
      root.classList.add('screen-reader-optimized');
      root.setAttribute('data-screen-reader-optimized', 'true');
    } else {
      root.classList.remove('screen-reader-optimized');
      root.removeAttribute('data-screen-reader-optimized');
    }

    // Keyboard navigation
    if (preferences.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  }, [preferences]);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save accessibility preferences:', error);
    }
  }, [preferences]);

  const updatePreference = useCallback((key: keyof AccessibilityPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
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

  const toggleKeyboardNavigation = useCallback(() => {
    updatePreference('keyboardNavigation', !preferences.keyboardNavigation);
  }, [preferences.keyboardNavigation, updatePreference]);

  const resetToDefaults = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return {
    preferences,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    toggleScreenReaderOptimized,
    toggleKeyboardNavigation,
    updatePreference,
    resetToDefaults
  };
}
