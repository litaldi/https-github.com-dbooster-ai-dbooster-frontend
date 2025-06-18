
import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedButton } from './enhanced-button';

interface FeedbackToastProps {
  type: 'success' | 'error' | 'info' | 'loading';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export function FeedbackToast({ 
  type, 
  title, 
  description, 
  action, 
  duration = 5000,
  onClose,
  className 
}: FeedbackToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type !== 'loading' && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    loading: Loader2
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    loading: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const Icon = icons[type];

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 max-w-md w-full border rounded-lg p-4 shadow-lg transition-all duration-300',
      styles[type],
      'animate-slide-in-right',
      !isVisible && 'animate-slide-out-right',
      className
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn(
          'h-5 w-5 flex-shrink-0 mt-0.5',
          type === 'loading' && 'animate-spin'
        )} />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{title}</h4>
          {description && (
            <p className="text-sm opacity-90 mt-1 leading-relaxed">{description}</p>
          )}
          
          {action && (
            <div className="mt-3">
              <EnhancedButton
                size="sm"
                variant="outline"
                onClick={action.onClick}
                className="h-8 px-3 text-xs"
              >
                {action.label}
              </EnhancedButton>
            </div>
          )}
        </div>
        
        {type !== 'loading' && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface ValidationMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

export function ValidationMessage({ type, message, className }: ValidationMessageProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info
  };

  const styles = {
    success: 'text-green-600 bg-green-50 border-green-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-orange-600 bg-orange-50 border-orange-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      'flex items-center gap-2 p-3 rounded-lg border text-sm',
      styles[type],
      className
    )}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

interface ProgressFeedbackProps {
  steps: Array<{
    id: string;
    label: string;
    status: 'pending' | 'loading' | 'completed' | 'error';
  }>;
  className?: string;
}

export function ProgressFeedback({ steps, className }: ProgressFeedbackProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} className="flex items-center gap-3">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
              step.status === 'completed' && 'bg-green-100 text-green-600',
              step.status === 'loading' && 'bg-blue-100 text-blue-600',
              step.status === 'error' && 'bg-red-100 text-red-600',
              step.status === 'pending' && 'bg-muted text-muted-foreground'
            )}>
              {step.status === 'completed' && <CheckCircle className="h-4 w-4" />}
              {step.status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
              {step.status === 'error' && <AlertCircle className="h-4 w-4" />}
              {step.status === 'pending' && <span>{index + 1}</span>}
            </div>
            
            <div className="flex-1">
              <p className={cn(
                'text-sm font-medium',
                step.status === 'completed' && 'text-green-600',
                step.status === 'loading' && 'text-blue-600',
                step.status === 'error' && 'text-red-600',
                step.status === 'pending' && 'text-muted-foreground'
              )}>
                {step.label}
              </p>
            </div>
            
            {!isLast && (
              <div className={cn(
                'w-px h-6 ml-4',
                index < steps.findIndex(s => s.status === 'pending') ? 'bg-green-200' : 'bg-muted'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
