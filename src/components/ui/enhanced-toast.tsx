
import { toast } from 'sonner';

interface ToastOptions {
  title: string;
  description?: string;
}

export const enhancedToast = {
  success: ({ title, description }: ToastOptions) => {
    toast.success(title, {
      description,
    });
  },
  error: ({ title, description }: ToastOptions) => {
    toast.error(title, {
      description,
    });
  },
  info: ({ title, description }: ToastOptions) => {
    toast.info(title, {
      description,
    });
  },
};
