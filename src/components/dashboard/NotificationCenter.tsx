
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Query Optimized',
      message: 'Successfully optimized 3 slow queries in user-service repository',
      time: '2 minutes ago',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'warning',
      title: 'Performance Alert',
      message: 'High CPU usage detected on primary database connection',
      time: '15 minutes ago',
      icon: AlertTriangle
    },
    {
      id: 3,
      type: 'info',
      title: 'New Repository Connected',
      message: 'Analytics service repository has been successfully connected',
      time: '1 hour ago',
      icon: Info
    }
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-start justify-end pt-20 pr-6 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="w-80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex gap-3 p-3 rounded-lg border">
                <notification.icon className={`h-4 w-4 mt-0.5 ${getIconColor(notification.type)}`} />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
