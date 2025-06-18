
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, XCircle, Info, Loader2 } from 'lucide-react';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastStyles = {
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 text-green-900'
  },
  error: {
    icon: XCircle,
    className: 'border-red-200 bg-red-50 text-red-900'
  },
  warning: {
    icon: AlertCircle,
    className: 'border-amber-200 bg-amber-50 text-amber-900'
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-900'
  },
  loading: {
    icon: Loader2,
    className: 'border-gray-200 bg-gray-50 text-gray-900'
  }
};

export const enhancedToast = {
  success: (options: ToastOptions) => {
    const Icon = toastStyles.success.icon;
    toast.success(options.title, {
      description: options.description,
      duration: options.duration || 5000,
      icon: <Icon className="h-4 w-4" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    });
  },

  error: (options: ToastOptions) => {
    const Icon = toastStyles.error.icon;
    toast.error(options.title, {
      description: options.description,
      duration: options.duration || 8000,
      icon: <Icon className="h-4 w-4" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    });
  },

  warning: (options: ToastOptions) => {
    const Icon = toastStyles.warning.icon;
    toast.warning(options.title, {
      description: options.description,
      duration: options.duration || 6000,
      icon: <Icon className="h-4 w-4" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    });
  },

  info: (options: ToastOptions) => {
    const Icon = toastStyles.info.icon;
    toast.info(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      icon: <Icon className="h-4 w-4" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined
    });
  },

  loading: (options: ToastOptions) => {
    const Icon = toastStyles.loading.icon;
    return toast.loading(options.title, {
      description: options.description,
      icon: <Icon className="h-4 w-4 animate-spin" />
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, options);
  }
};
