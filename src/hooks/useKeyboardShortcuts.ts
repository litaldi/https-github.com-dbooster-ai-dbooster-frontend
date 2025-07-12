
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
      action: () => navigate('/app'),
      description: 'Go to Dashboard'
    },
    {
      key: 'q',
      ctrlKey: true,
      action: () => navigate('/app/queries'),
      description: 'Go to Queries'
    },
    {
      key: '/',
      ctrlKey: true,
      action: () => {
        toast.info('Keyboard Shortcuts', {
          description: shortcuts.map(s => 
            `${s.ctrlKey ? 'Ctrl+' : ''}${s.altKey ? 'Alt+' : ''}${s.shiftKey ? 'Shift+' : ''}${s.key.toUpperCase()}: ${s.description}`
          ).join('\n')
        });
      },
      description: 'Show shortcuts'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return { shortcuts };
}
