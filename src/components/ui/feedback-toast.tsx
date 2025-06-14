
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle, Info, Star } from 'lucide-react';

interface FeedbackOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showSuccess = (options: FeedbackOptions) => {
  return toast.success(options.title, {
    description: options.description,
    duration: options.duration || 4000,
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    action: options.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
    className: 'border-l-4 border-l-green-500',
  });
};

export const showError = (options: FeedbackOptions) => {
  return toast.error(options.title, {
    description: options.description,
    duration: options.duration || 6000,
    icon: <XCircle className="h-5 w-5 text-red-600" />,
    action: options.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
    className: 'border-l-4 border-l-red-500',
  });
};

export const showWarning = (options: FeedbackOptions) => {
  return toast.warning(options.title, {
    description: options.description,
    duration: options.duration || 5000,
    icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
    action: options.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
    className: 'border-l-4 border-l-orange-500',
  });
};

export const showInfo = (options: FeedbackOptions) => {
  return toast.info(options.title, {
    description: options.description,
    duration: options.duration || 4000,
    icon: <Info className="h-5 w-5 text-blue-600" />,
    action: options.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
    className: 'border-l-4 border-l-blue-500',
  });
};

export const showFeature = (options: FeedbackOptions) => {
  return toast.success(options.title, {
    description: options.description,
    duration: options.duration || 5000,
    icon: <Star className="h-5 w-5 text-purple-600" />,
    action: options.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
    className: 'border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20',
  });
};
