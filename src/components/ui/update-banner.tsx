
import React, { useState, useEffect } from 'react';
import { X, Download, Sparkles } from 'lucide-react';
import { EnhancedButton } from './enhanced-button';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export function UpdateBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check for app updates (in a real app, this would check for service worker updates)
    const checkForUpdates = () => {
      // Simulate update check - in production this would be real update detection
      if (Math.random() > 0.9 && process.env.NODE_ENV === 'development') {
        setUpdateAvailable(true);
        setIsVisible(true);
      }
    };

    // Check for updates on mount and periodically
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = () => {
    // In a real app, this would trigger the update process
    window.location.reload();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setUpdateAvailable(false);
  };

  if (!isVisible || !updateAvailable) return null;

  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 shadow-lg',
      'transform transition-transform duration-300 ease-in-out',
      isVisible ? 'translate-y-0' : '-translate-y-full'
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">App Update Available!</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              New
            </Badge>
          </div>
          <span className="text-sm opacity-90 hidden sm:inline">
            Get the latest features and improvements
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <EnhancedButton
            onClick={handleUpdate}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Download className="mr-2 h-4 w-4" />
            Update Now
          </EnhancedButton>
          
          <EnhancedButton
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
            aria-label="Dismiss update notification"
          >
            <X className="h-4 w-4" />
          </EnhancedButton>
        </div>
      </div>
    </div>
  );
}
