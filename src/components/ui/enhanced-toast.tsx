
import { toast as sonnerToast } from 'sonner';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

const enhancedToast = {
  success: ({ title, description, duration = 4000 }: ToastOptions) => {
    return sonnerToast.success(title, {
      description,
      duration,
      icon: <CheckCircle className="h-4 w-4" />,
      className: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    });
  },

  error: ({ title, description, duration = 5000 }: ToastOptions) => {
    return sonnerToast.error(title, {
      description,
      duration,
      icon: <AlertCircle className="h-4 w-4" />,
      className: 'bg-red-50 border-red-200 text-red-900',
    });
  },

  warning: ({ title, description, duration = 4000 }: ToastOptions) => {
    return sonnerToast.warning(title, {
      description,
      duration,
      icon: <AlertTriangle className="h-4 w-4" />,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    });
  },

  info: ({ title, description, duration = 4000 }: ToastOptions) => {
    return sonnerToast.info(title, {
      description,
      duration,
      icon: <Info className="h-4 w-4" />,
      className: 'bg-blue-50 border-blue-200 text-blue-900',
    });
  },

  loading: ({ title, description }: Omit<ToastOptions, 'duration'>) => {
    return sonnerToast.loading(title, {
      description,
    });
  },

  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  }
};

export { enhancedToast };
