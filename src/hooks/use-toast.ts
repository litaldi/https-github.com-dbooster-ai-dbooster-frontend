
import { enhancedToast } from '@/components/ui/enhanced-toast';

// Compatibility hook for components that use the old toast API
export function useToast() {
  const toast = (options: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }) => {
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
  };

  return { toast };
}

export { useToast as toast };
