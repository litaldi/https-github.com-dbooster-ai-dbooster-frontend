
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Bell,
  Settings,
  Zap
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'outline';
  }>;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onClear: () => void;
}

export function NotificationCenter({ 
  notifications, 
  onDismiss, 
  onClear 
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const icons = {
    success: CheckCircle,
    warning: AlertCircle,
    info: Info,
    error: AlertCircle
  };

  const colors = {
    success: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-orange-600 bg-orange-50 border-orange-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    error: 'text-red-600 bg-red-50 border-red-200'
  };

  return (
    <div className="relative">
      <EnhancedButton
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
          >
            {notifications.length}
          </Badge>
        )}
      </EnhancedButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-96 z-50"
          >
            <Card className="shadow-lg border-2">
              <CardContent className="p-0">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <EnhancedButton
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="text-xs"
                      >
                        Clear all
                      </EnhancedButton>
                    )}
                    <EnhancedButton
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </EnhancedButton>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((notification) => {
                        const Icon = icons[notification.type];
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-4 border-l-4 ${colors[notification.type]} hover:bg-opacity-80 transition-colors`}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm">
                                  {notification.title}
                                </h4>
                                <p className="text-xs opacity-90 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs opacity-70 mt-2">
                                  {notification.timestamp.toLocaleTimeString()}
                                </p>
                                
                                {notification.actions && (
                                  <div className="flex gap-2 mt-3">
                                    {notification.actions.map((action, index) => (
                                      <EnhancedButton
                                        key={index}
                                        size="sm"
                                        variant={action.variant || 'outline'}
                                        onClick={action.action}
                                        className="h-6 px-2 text-xs"
                                      >
                                        {action.label}
                                      </EnhancedButton>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <EnhancedButton
                                variant="ghost"
                                size="icon"
                                onClick={() => onDismiss(notification.id)}
                                className="h-6 w-6"
                              >
                                <X className="h-3 w-3" />
                              </EnhancedButton>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Auto-dismiss success notifications after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => 
        prev.filter(n => n.type !== 'success' || 
          Date.now() - n.timestamp.getTime() < 5000)
      );
    }, 5000);

    return () => clearTimeout(timer);
  }, [notifications]);

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearNotifications
  };
}
