
import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
}

const notifications = [
  {
    id: '1',
    type: 'warning',
    title: 'High Query Load Detected',
    message: 'Database is experiencing higher than normal query load. Consider scaling resources.',
    time: '5 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'success',
    title: 'Optimization Complete',
    message: 'Successfully optimized 15 queries, improving performance by 32%.',
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Weekly Report Available',
    message: 'Your weekly performance report is ready for review.',
    time: '2 hours ago',
    read: true
  }
];

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-muted/30' : 'bg-background border-primary/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(notification.type)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    {!notification.read && (
                      <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
