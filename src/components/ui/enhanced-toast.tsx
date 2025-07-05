
import { toast } from '@/hooks/use-toast';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const enhancedToast = {
  success: ({ title, description }: ToastOptions) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  },
  
  error: ({ title, description }: ToastOptions) => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  },
  
  info: ({ title, description }: ToastOptions) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  },
  
  warning: ({ title, description }: ToastOptions) => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  },
};
