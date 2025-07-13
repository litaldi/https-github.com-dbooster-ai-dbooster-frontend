
import { toast } from 'sonner';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const enhancedToast = {
  success: ({ title, description, duration = 4000 }: ToastOptions) => {
    toast.success(title, {
      description,
      duration,
    });
  },

  error: ({ title, description, duration = 6000 }: ToastOptions) => {
    toast.error(title, {
      description,
      duration,
    });
  },

  info: ({ title, description, duration = 4000 }: ToastOptions) => {
    toast.info(title, {
      description,
      duration,
    });
  },

  warning: ({ title, description, duration = 5000 }: ToastOptions) => {
    toast.warning(title, {
      description,
      duration,
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
