
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  persistent?: boolean;
}

const notificationIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  loading: Zap,
};

const notificationStyles = {
  success: {
    container: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-200',
    description: 'text-green-700 dark:text-green-300',
  },
  error: {
    container: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    description: 'text-red-700 dark:text-red-300',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-200',
    description: 'text-yellow-700 dark:text-yellow-300',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-200',
    description: 'text-blue-700 dark:text-blue-300',
  },
  loading: {
    container: 'bg-primary/5 border-primary/20',
    icon: 'text-primary',
    title: 'text-primary',
    description: 'text-primary/80',
  },
};

export function NotificationItem({ 
  id, 
  type, 
  title, 
  description, 
  action, 
  onDismiss, 
  persistent = false 
}: NotificationProps) {
  const Icon = notificationIcons[type];
  const styles = notificationStyles[type];

  React.useEffect(() => {
    if (!persistent && onDismiss) {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [persistent, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        'relative p-4 rounded-lg border shadow-lg backdrop-blur-sm max-w-md w-full',
        styles.container
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {type === 'loading' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Icon className={cn('h-5 w-5', styles.icon)} />
            </motion.div>
          ) : (
            <Icon className={cn('h-5 w-5', styles.icon)} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn('text-sm font-medium', styles.title)}>
            {title}
          </h4>
          
          {description && (
            <p className={cn('text-sm mt-1', styles.description)}>
              {description}
            </p>
          )}
          
          {action && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={action.onClick}
                className="h-8 px-3 text-xs"
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={onDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {!persistent && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-full"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

interface NotificationContainerProps {
  notifications: NotificationProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function NotificationContainer({ 
  notifications, 
  position = 'top-right' 
}: NotificationContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={cn('fixed z-50 pointer-events-none', positionClasses[position])}>
      <div className="flex flex-col gap-2 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} {...notification} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = React.useState<NotificationProps[]>([]);

  const addNotification = React.useCallback((notification: Omit<NotificationProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications((prev) => [...prev, newNotification]);
    
    return id;
  }, []);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = React.useCallback((title: string, description?: string) => {
    return addNotification({ type: 'success', title, description });
  }, [addNotification]);

  const error = React.useCallback((title: string, description?: string) => {
    return addNotification({ type: 'error', title, description, persistent: true });
  }, [addNotification]);

  const warning = React.useCallback((title: string, description?: string) => {
    return addNotification({ type: 'warning', title, description });
  }, [addNotification]);

  const info = React.useCallback((title: string, description?: string) => {
    return addNotification({ type: 'info', title, description });
  }, [addNotification]);

  const loading = React.useCallback((title: string, description?: string) => {
    return addNotification({ type: 'loading', title, description, persistent: true });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    loading,
  };
}

// Global notification provider
const NotificationContext = React.createContext<ReturnType<typeof useNotifications> | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
      <NotificationContainer 
        notifications={notifications.notifications}
        position="top-right"
      />
    </NotificationContext.Provider>
  );
}

export function useNotificationSystem() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationSystem must be used within NotificationProvider');
  }
  return context;
}
