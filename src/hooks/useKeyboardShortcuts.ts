
import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

const shortcuts: KeyboardShortcut[] = [
  {
    key: '/',
    ctrl: true,
    description: 'Show keyboard shortcuts',
    action: () => {
      // This will be handled by the KeyboardShortcutsHelper component
    }
  },
  {
    key: 'k',
    ctrl: true,
    description: 'Search',
    action: () => {
      console.log('Search triggered');
    }
  },
  {
    key: 'n',
    ctrl: true,
    description: 'New query',
    action: () => {
      console.log('New query triggered');
    }
  },
  {
    key: 's',
    ctrl: true,
    description: 'Save',
    action: () => {
      console.log('Save triggered');
    }
  },
  {
    key: 'd',
    ctrl: true,
    description: 'Dashboard',
    action: () => {
      window.location.href = '/app';
    }
  }
];

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          altMatch &&
          shiftMatch
        ) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    shortcuts
  };
}
