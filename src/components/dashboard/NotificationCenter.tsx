
import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertTriangle, Info, X, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationCenterProps {
  onClose: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'warning',
      title: 'High CPU Usage Detected',
      message: 'Database server CPU at 89%. Consider optimizing queries.',
      timestamp: '2 minutes ago',
      read: false,
      actionLabel: 'View Details',
      onAction: () => console.log('View CPU details')
    },
    {
      id: '2',
      type: 'success',
      title: 'Optimization Complete',
      message: 'Query batch #247 optimized successfully. 23% performance improvement achieved.',
      timestamp: '15 minutes ago',
      read: false,
      actionLabel: 'View Report',
      onAction: () => console.log('View optimization report')
    },
    {
      id: '3',
      type: 'info',
      title: 'New AI Studio Features Available',
      message: 'Enhanced query analysis and predictive optimization tools are now available.',
      timestamp: '1 hour ago',
      read: true,
      actionLabel: 'Explore',
      onAction: () => console.log('Open AI Studio')
    },
    {
      id: '4',
      type: 'success',
      title: 'Weekly Report Ready',
      message: 'Your performance summary for this week is ready for review.',
      timestamp: '2 hours ago',
      read: true,
      actionLabel: 'Download',
      onAction: () => console.log('Download report')
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationBorder = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 max-h-[600px]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm">
              Mark all as read
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="space-y-1 px-6">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    p-4 border-l-4 rounded-r-lg transition-colors
                    ${getNotificationBorder(notification.type)}
                    ${notification.read ? 'bg-muted/30' : 'bg-background hover:bg-muted/50'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {notification.timestamp}
                        </div>
                        {notification.actionLabel && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto p-1"
                            onClick={notification.onAction}
                          >
                            {notification.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm">
              Notification Settings
            </Button>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
