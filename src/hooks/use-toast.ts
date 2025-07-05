
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { useState, useCallback } from 'react';

// Toast interface matching what the Toaster expects
interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactElement;
}

// Global toast state
let toasts: Toast[] = [];
let listeners: (() => void)[] = [];

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { ...toast, id };
  toasts = [...toasts, newToast];
  listeners.forEach(listener => listener());
  
  // Auto-remove toast after delay
  setTimeout(() => {
    removeToast(id);
  }, toast.variant === 'destructive' ? 6000 : 4000);
  
  return id;
};

const removeToast = (id: string) => {
  toasts = toasts.filter(toast => toast.id !== id);
  listeners.forEach(listener => listener());
};

// Compatibility hook for components that use the old toast API
export function useToast() {
  const [, forceUpdate] = useState({});
  
  const rerender = useCallback(() => {
    forceUpdate({});
  }, []);
  
  // Subscribe to toast changes
  useState(() => {
    listeners.push(rerender);
    return () => {
      listeners = listeners.filter(listener => listener !== rerender);
    };
  });
  
  const toast = useCallback((options: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }) => {
    // Add to local toast state for the Toaster component
    addToast(options);
    
    // Also trigger the enhanced toast for better UX
    if (options.variant === 'destructive') {
      enhancedToast.error({
        title: options.title,
        description: options.description,
      });
    } else {
      enhancedToast.success({
        title: options.title,
        description: options.description,
      });
    }
  }, []);

  return { 
    toast,
    toasts,
    dismiss: removeToast
  };
}

export { useToast as toast };
