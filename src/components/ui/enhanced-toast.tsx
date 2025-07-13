
import { toast } from '@/hooks/use-toast';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const enhancedToast = {
  success: ({ title, description, duration = 5000 }: ToastOptions) => {
    toast({
      title,
      description,
      duration,
      variant: 'default',
    });
  },
  
  error: ({ title, description, duration = 5000 }: ToastOptions) => {
    toast({
      title,
      description,
      duration,
      variant: 'destructive',
    });
  },
  
  info: ({ title, description, duration = 5000 }: ToastOptions) => {
    toast({
      title,
      description,
      duration,
      variant: 'default',
    });
  },
  
  warning: ({ title, description, duration = 5000 }: ToastOptions) => {
    toast({
      title,
      description,
      duration,
      variant: 'destructive',
    });
  }
};
