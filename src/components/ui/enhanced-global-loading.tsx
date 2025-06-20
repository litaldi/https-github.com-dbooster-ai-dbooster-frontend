
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { Loader2, Database, Zap, BarChart3, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingElement, PulseElement } from '@/components/ui/micro-interactions';

interface GlobalLoadingOverlayProps {
  isVisible?: boolean;
  message?: string;
  variant?: 'default' | 'database' | 'query' | 'analytics' | 'security';
  duration?: number;
}

export function GlobalLoadingOverlay({ 
  isVisible, 
  message,
  variant = 'default',
  duration = 800 
}: GlobalLoadingOverlayProps) {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (isVisible !== undefined) {
      setShow(isVisible);
      return;
    }

    // Auto-show on navigation
    setShow(true);
    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [location, isVisible, duration]);

  const variantConfig = {
    default: { 
      icon: Loader2, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      message: 'Loading...' 
    },
    database: { 
      icon: Database, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      message: 'Connecting to database...' 
    },
    query: { 
      icon: Zap, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-500/10',
      message: 'Optimizing queries...' 
    },
    analytics: { 
      icon: BarChart3, 
      color: 'text-green-500', 
      bg: 'bg-green-500/10',
      message: 'Analyzing performance...' 
    },
    security: { 
      icon: Shield, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10',
      message: 'Securing connection...' 
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;
  const displayMessage = message || config.message;

  if (!show) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm transition-all duration-300',
        'bg-background/80',
        show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
      role="alert"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={cn(
        'p-8 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300',
        'bg-card/95 border-border/50',
        show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      )}>
        <div className="flex flex-col items-center gap-6 min-w-[200px]">
          <FloatingElement intensity="subtle">
            <PulseElement intensity="medium">
              <div className={cn(
                'p-4 rounded-2xl border-2',
                config.bg,
                config.color,
                'border-current/20'
              )}>
                <Icon className="h-10 w-10 animate-spin" />
              </div>
            </PulseElement>
          </FloatingElement>
          
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg text-foreground">
              {displayMessage}
            </h3>
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full animate-bounce',
                    config.color.replace('text-', 'bg-')
                  )}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for controlling global loading state
export function useGlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  const [variant, setVariant] = useState<'default' | 'database' | 'query' | 'analytics' | 'security'>('default');

  const showLoading = (options?: {
    message?: string;
    variant?: 'default' | 'database' | 'query' | 'analytics' | 'security';
  }) => {
    setMessage(options?.message);
    setVariant(options?.variant || 'default');
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setMessage(undefined);
  };

  return {
    isLoading,
    message,
    variant,
    showLoading,
    hideLoading
  };
}

// Context for global loading state
const GlobalLoadingContext = React.createContext<{
  showLoading: (options?: { message?: string; variant?: 'default' | 'database' | 'query' | 'analytics' | 'security' }) => void;
  hideLoading: () => void;
  isLoading: boolean;
} | null>(null);

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, message, variant, showLoading, hideLoading } = useGlobalLoading();

  return (
    <GlobalLoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      <GlobalLoadingOverlay isVisible={isLoading} message={message} variant={variant} />
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoadingContext() {
  const context = React.useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoadingContext must be used within GlobalLoadingProvider');
  }
  return context;
}
