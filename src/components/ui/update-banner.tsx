
import { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Download, X } from 'lucide-react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export function UpdateBanner() {
  const { updateAvailable, updateApp } = useServiceWorker();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) {
    return null;
  }

  return (
    <Card className="fixed top-4 right-4 z-50 p-4 shadow-lg border-primary bg-background/95 backdrop-blur">
      <div className="flex items-center gap-3">
        <Download className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">Update Available</p>
          <p className="text-xs text-muted-foreground">
            A new version of DBooster is ready to install
          </p>
        </div>
        <div className="flex gap-1">
          <Button size="sm" onClick={updateApp}>
            Update
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
