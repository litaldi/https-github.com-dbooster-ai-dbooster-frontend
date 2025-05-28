
import { toast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface FeedbackOptions {
  title: string;
  description?: string;
  duration?: number;
}

const feedbackIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const feedbackStyles = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export function showFeedback(type: FeedbackType, options: FeedbackOptions) {
  const Icon = feedbackIcons[type];
  
  toast({
    title: (
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${feedbackStyles[type]}`} />
        {options.title}
      </div>
    ) as any,
    description: options.description,
    duration: options.duration || 3000,
    variant: type === 'error' ? 'destructive' : 'default',
  });
}

// Convenience functions
export const showSuccess = (options: FeedbackOptions) => showFeedback('success', options);
export const showError = (options: FeedbackOptions) => showFeedback('error', options);
export const showWarning = (options: FeedbackOptions) => showFeedback('warning', options);
export const showInfo = (options: FeedbackOptions) => showFeedback('info', options);
