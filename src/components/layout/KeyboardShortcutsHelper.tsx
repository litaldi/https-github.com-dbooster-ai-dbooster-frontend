
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Command } from 'lucide-react';
import { useState } from 'react';

export function KeyboardShortcutsHelper() {
  const { shortcuts } = useKeyboardShortcuts();
  const [isOpen, setIsOpen] = useState(false);

  const formatShortcut = (shortcut: any) => {
    const keys = [];
    if (shortcut.ctrl) keys.push('Ctrl');
    if (shortcut.alt) keys.push('Alt');
    if (shortcut.shift) keys.push('Shift');
    keys.push(shortcut.key.toUpperCase());
    return keys.join(' + ');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            title="Keyboard Shortcuts (Ctrl + /)"
          >
            <Keyboard className="h-4 w-4" />
            <span className="hidden sm:inline">Shortcuts</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Command className="h-5 w-5 text-blue-600" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Speed up your workflow with these keyboard shortcuts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{shortcut.description}</div>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {formatShortcut(shortcut)}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t text-xs text-muted-foreground">
            <p>💡 Tip: Press <Badge variant="outline" className="font-mono text-xs mx-1">Ctrl + /</Badge> anytime to see this dialog</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
