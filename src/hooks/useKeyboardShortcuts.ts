
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'h',
      ctrlKey: true,
      action: () => navigate('/'),
      description: 'Go to Home'
    },
    {
      key: 'd',
      ctrlKey: true,
      action: () => navigate('/dashboard'),
      description: 'Go to Dashboard'
    },
    {
      key: 'q',
      ctrlKey: true,
      action: () => navigate('/query-builder'),
      description: 'Open Query Builder'
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => navigate('/settings'),
      description: 'Open Settings'
    },
    {
      key: '/',
      ctrlKey: true,
      action: () => {
        enhancedToast.info({
          title: 'Keyboard Shortcuts',
          description: 'Ctrl+H: Home, Ctrl+D: Dashboard, Ctrl+Q: Query Builder, Ctrl+S: Settings'
        });
      },
      description: 'Show shortcuts help'
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return;
    }

    const shortcut = shortcuts.find(s => 
      s.key.toLowerCase() === event.key.toLowerCase() &&
      !!s.ctrlKey === event.ctrlKey &&
      !!s.altKey === event.altKey &&
      !!s.shiftKey === event.shiftKey
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
}
