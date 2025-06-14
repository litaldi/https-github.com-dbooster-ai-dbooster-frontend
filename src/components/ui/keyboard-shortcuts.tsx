
import { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['G', 'H'], description: 'Go to dashboard' },
      { keys: ['G', 'R'], description: 'Go to repositories' },
      { keys: ['G', 'Q'], description: 'Go to queries' },
      { keys: ['G', 'S'], description: 'Go to settings' },
    ]
  },
  {
    title: 'Actions',
    shortcuts: [
      { keys: ['Ctrl', 'N'], description: 'New query' },
      { keys: ['Ctrl', 'S'], description: 'Save current work' },
      { keys: ['Ctrl', '/'], description: 'Toggle sidebar' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close modal/dialog' },
    ]
  },
  {
    title: 'Query Editor',
    shortcuts: [
      { keys: ['Ctrl', 'Enter'], description: 'Execute query' },
      { keys: ['Ctrl', 'D'], description: 'Duplicate line' },
      { keys: ['Ctrl', 'L'], description: 'Select line' },
      { keys: ['Ctrl', 'F'], description: 'Find in query' },
      { keys: ['F11'], description: 'Toggle fullscreen' },
    ]
  }
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts with '?'
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsOpen(true);
        }
      }
      
      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto animate-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            <CardTitle>Keyboard Shortcuts</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {shortcutGroups.map((group, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div 
                    key={shortcutIndex} 
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <Badge 
                          key={keyIndex} 
                          variant="outline" 
                          className="text-xs font-mono px-2 py-1 min-w-[28px] text-center"
                        >
                          {key}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Press <Badge variant="outline" className="text-xs font-mono mx-1">?</Badge> 
              to show shortcuts or <Badge variant="outline" className="text-xs font-mono mx-1">Esc</Badge> to close
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
