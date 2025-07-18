
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'dbooster-theme',
  ...props
}: ThemeProviderProps) {
  // Initialize with defaultTheme to avoid localStorage access during SSR
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load theme from localStorage after component mounts
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      if (storedTheme && ['dark', 'light', 'system'].includes(storedTheme)) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, [storageKey]);

  useEffect(() => {
    // Only apply theme changes after initialization
    if (!isInitialized) return;

    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme, isInitialized]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      try {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
        setTheme(theme);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
