
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContextualHelp() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg"
        onClick={() => console.log('Help triggered')}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
