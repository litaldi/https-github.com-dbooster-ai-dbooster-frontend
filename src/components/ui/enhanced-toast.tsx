
import { toast as sonnerToast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

interface LoadingToastOptions {
  title: string;
  description?: string;
  promise?: Promise<any>;
  success?: string | ((data: any) => string);
  error?: string | ((error: any) => string);
}

class EnhancedToast {
  success(options: ToastOptions) {
    return sonnerToast.success(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      icon: <CheckCircle className="h-4 w-4" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      onDismiss: options.onDismiss,
      className: 'toast-success',
    });
  }

  error(options: ToastOptions) {
    return sonnerToast.error(options.title, {
      description: options.description,
      duration: options.duration || 6000,
      icon: <XCircle className="h-4 w-4" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      onDismiss: options.onDismiss,
      className: 'toast-error',
    });
  }

  warning(options: ToastOptions) {
    return sonnerToast.warning(options.title, {
      description: options.description,
      duration: options.duration || 5000,
      icon: <AlertCircle className="h-4 w-4" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      onDismiss: options.onDismiss,
      className: 'toast-warning',
    });
  }

  info(options: ToastOptions) {
    return sonnerToast.info(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      icon: <Info className="h-4 w-4" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      onDismiss: options.onDismiss,
      className: 'toast-info',
    });
  }

  loading(options: LoadingToastOptions) {
    if (options.promise) {
      return sonnerToast.promise(options.promise, {
        loading: options.title,
        success: (data) => typeof options.success === 'function' ? options.success(data) : (options.success || 'Success'),
        error: (error) => typeof options.error === 'function' ? options.error(error) : (options.error || 'Error'),
      });
    }

    return sonnerToast.loading(options.title, {
      description: options.description,
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
    });
  }

  dismiss(toastId?: string | number) {
    return sonnerToast.dismiss(toastId);
  }

  custom(jsx: React.ReactElement, options?: { duration?: number }) {
    return sonnerToast.custom(() => jsx, options);
  }
}

export const enhancedToast = new EnhancedToast();

// Re-export for backward compatibility
export { enhancedToast as toast };
