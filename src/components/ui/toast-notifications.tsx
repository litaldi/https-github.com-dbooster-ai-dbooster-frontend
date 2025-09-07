import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastNotificationProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'bg-success/10 border-success/20 text-success-foreground',
  error: 'bg-destructive/10 border-destructive/20 text-destructive-foreground',
  warning: 'bg-warning/10 border-warning/20 text-warning-foreground',
  info: 'bg-info/10 border-info/20 text-info-foreground',
};

export function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
  const { id, title, message, type = 'info', action } = toast;
  const Icon = toastIcons[type];

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        'relative flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        toastStyles[type]
      )}
    >
      {/* Icon */}
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 space-y-1">
        {title && (
          <p className="text-sm font-semibold leading-none">{title}</p>
        )}
        <p className="text-sm opacity-90">{message}</p>
        
        {action && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="mt-2 text-xs font-medium underline-offset-4 hover:underline"
          >
            {action.label}
          </motion.button>
        )}
      </div>

      {/* Dismiss button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </motion.button>

      {/* Progress bar for timed toasts */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current rounded-b-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastContainer({ 
  toasts, 
  onDismiss, 
  position = 'top-right' 
}: ToastContainerProps) {
  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-2 w-full max-w-sm',
      positionClasses[position]
    )}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}