
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  const shortcuts: Shortcut[] = [
    {
      key: 'h',
      ctrl: true,
      description: 'Go to Home/Dashboard',
      action: () => navigate('/')
    },
    {
      key: 'q',
      ctrl: true,
      description: 'Go to Queries',
      action: () => navigate('/queries')
    },
    {
      key: 'r',
      ctrl: true,
      description: 'Go to Reports',
      action: () => navigate('/reports')
    },
    {
      key: 'd',
      ctrl: true,
      description: 'Go to Database Import',
      action: () => navigate('/db-import')
    },
    {
      key: 'a',
      ctrl: true,
      alt: true,
      description: 'Go to AI Features',
      action: () => navigate('/ai-features')
    },
    {
      key: 's',
      ctrl: true,
      description: 'Go to Settings',
      action: () => navigate('/settings')
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show keyboard shortcuts',
      action: () => {
        enhancedToast.info({
          title: 'Keyboard Shortcuts',
          description: 'Ctrl+H: Home | Ctrl+Q: Queries | Ctrl+R: Reports | Ctrl+D: DB Import | Ctrl+Alt+A: AI Features | Ctrl+S: Settings'
        });
      }
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return;
      }

      const matchingShortcut = shortcuts.find(shortcut => {
        return (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!event.ctrlKey === !!shortcut.ctrl &&
          !!event.altKey === !!shortcut.alt &&
          !!event.shiftKey === !!shortcut.shift
        );
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return { shortcuts };
}
