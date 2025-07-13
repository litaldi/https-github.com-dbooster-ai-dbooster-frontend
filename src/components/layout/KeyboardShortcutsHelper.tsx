
import React from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from 'lucide-react';

export function KeyboardShortcutsHelper() {
  const { shortcuts } = useKeyboardShortcuts();

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Keyboard className="h-5 w-5" />
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm">{shortcut.description}</span>
            <div className="flex gap-1">
              {shortcut.ctrl && <Badge variant="outline">Ctrl</Badge>}
              {shortcut.alt && <Badge variant="outline">Alt</Badge>}
              {shortcut.shift && <Badge variant="outline">Shift</Badge>}
              <Badge variant="outline">{shortcut.key.toUpperCase()}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
