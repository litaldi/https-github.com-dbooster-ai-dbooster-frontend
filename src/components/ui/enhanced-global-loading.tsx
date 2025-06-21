
import React, { useState, useEffect } from 'react';
import { Loader2, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PulseElement } from '@/components/ui/micro-interactions';

interface EnhancedGlobalLoadingProps {
  isVisible?: boolean;
  message?: string;
  progress?: number;
  className?: string;
}

export function EnhancedGlobalLoading({ 
  isVisible = true, 
  message = "Loading...",
  progress,
  className 
}: EnhancedGlobalLoadingProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
      role="dialog"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center space-y-4 p-8 rounded-xl bg-card shadow-xl border">
        <PulseElement intensity="medium">
          <div className="relative">
            <Database className="h-12 w-12 text-primary" />
            <Loader2 className="absolute -top-1 -right-1 h-5 w-5 animate-spin text-blue-600" />
          </div>
        </PulseElement>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {message}{dots}
          </h3>
          
          {progress !== undefined && (
            <div className="w-48 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            Optimizing your database experience...
          </p>
        </div>
      </div>
    </div>
  );
}

export default EnhancedGlobalLoading;
