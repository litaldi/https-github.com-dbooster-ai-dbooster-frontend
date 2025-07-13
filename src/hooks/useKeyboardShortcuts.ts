
import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
}

export function useKeyboardShortcuts() {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      description: 'Open search'
    },
    {
      key: '/',
      ctrl: true, 
      description: 'Show keyboard shortcuts'
    },
    {
      key: 'n',
      ctrl: true,
      description: 'New query'
    },
    {
      key: 's',
      ctrl: true,
      description: 'Save current work'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when no input elements are focused
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            // Trigger search functionality
            console.log('Search triggered');
            break;
          case '/':
            event.preventDefault();
            // Focus search input
            console.log('Focus search');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { shortcuts };
}
