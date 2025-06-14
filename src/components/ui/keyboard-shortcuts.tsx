
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Badge } from './badge';
import { Kbd } from './kbd';
import { Command, Search, Home, Settings, HelpCircle, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
    action?: () => void;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['G', 'H'], description: 'Go to Dashboard' },
      { keys: ['G', 'R'], description: 'Go to Repositories' },
      { keys: ['G', 'Q'], description: 'Go to Queries' },
      { keys: ['G', 'S'], description: 'Go to Settings' },
    ]
  },
  {
    title: 'Actions',
    shortcuts: [
      { keys: ['Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['Ctrl', 'Shift', 'P'], description: 'Quick actions' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close dialogs' },
    ]
  },
  {
    title: 'Database',
    shortcuts: [
      { keys: ['Ctrl', 'Enter'], description: 'Execute query' },
      { keys: ['Ctrl', 'S'], description: 'Save query' },
      { keys: ['Ctrl', 'Shift', 'F'], description: 'Format query' },
    ]
  }
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
      {children}
    </kbd>
  );
}

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show shortcuts dialog
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setIsOpen(true);
        return;
      }

      // Navigation shortcuts
      if (event.key === 'g' || event.key === 'G') {
        const nextKey = new Promise<string>((resolve) => {
          const handler = (e: KeyboardEvent) => {
            document.removeEventListener('keydown', handler);
            resolve(e.key.toLowerCase());
          };
          document.addEventListener('keydown', handler);
        });

        nextKey.then((key) => {
          switch (key) {
            case 'h':
              navigate('/');
              break;
            case 'r':
              navigate('/repositories');
              break;
            case 'q':
              navigate('/queries');
              break;
            case 's':
              navigate('/settings');
              break;
          }
        });
      }

      // Close dialogs with Escape
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and interact with DBooster more efficiently.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center gap-1">
                          <Kbd>{key}</Kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-xs text-muted-foreground">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t text-xs text-muted-foreground">
          <HelpCircle className="h-3 w-3" />
          Press <Kbd>?</Kbd> to open this dialog anytime
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Export the trigger component for use in other parts of the app
export function KeyboardShortcutsTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        title="View keyboard shortcuts"
      >
        <Command className="h-3 w-3" />
        <span className="hidden sm:inline">Shortcuts</span>
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <KeyboardShortcuts />
      </Dialog>
    </>
  );
}
