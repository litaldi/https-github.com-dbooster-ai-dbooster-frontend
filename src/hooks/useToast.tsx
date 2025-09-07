import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from '@/components/ui/toast-notifications';

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (message: string, options?: Partial<Toast>) => void;
  error: (message: string, options?: Partial<Toast>) => void;
  warning: (message: string, options?: Partial<Toast>) => void;
  info: (message: string, options?: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // Default 5 seconds
    };
    
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({ ...options, message, type: 'success' });
  }, [addToast]);

  const error = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({ ...options, message, type: 'error', duration: options?.duration ?? 7000 });
  }, [addToast]);

  const warning = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({ ...options, message, type: 'warning' });
  }, [addToast]);

  const info = useCallback((message: string, options?: Partial<Toast>) => {
    addToast({ ...options, message, type: 'info' });
  }, [addToast]);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Legacy compatibility for existing toast usage
export const toast = {
  success: (message: string, options?: Partial<Toast>) => {
    // This will be overridden by the context when available
    console.log('Toast (fallback):', message);
  },
  error: (message: string, options?: Partial<Toast>) => {
    console.error('Toast Error (fallback):', message);
  },
  warning: (message: string, options?: Partial<Toast>) => {
    console.warn('Toast Warning (fallback):', message);
  },
  info: (message: string, options?: Partial<Toast>) => {
    console.info('Toast Info (fallback):', message);
  },
};