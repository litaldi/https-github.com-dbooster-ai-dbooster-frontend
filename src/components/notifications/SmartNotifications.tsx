
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  X, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Zap,
  Database,
  TrendingUp,
  Clock,
  Users,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error' | 'performance' | 'security';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  category: 'system' | 'query' | 'user' | 'security' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Initialize with some sample notifications
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'performance',
        title: 'Query Optimization Completed',
        message: 'Your database query has been optimized and is now 40% faster.',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false,
        category: 'performance',
        priority: 'medium',
        action: {
          label: 'View Results',
          onClick: () => toast({ title: 'Viewing optimization results...' })
        }
      },
      {
        id: '2',
        type: 'warning',
        title: 'High Memory Usage Detected',
        message: 'Database memory usage has exceeded 85% for the past 10 minutes.',
        timestamp: new Date(Date.now() - 15 * 60000),
        read: false,
        category: 'system',
        priority: 'high'
      },
      {
        id: '3',
        type: 'success',
        title: 'Backup Completed',
        message: 'Daily database backup completed successfully.',
        timestamp: new Date(Date.now() - 60 * 60000),
        read: true,
        category: 'system',
        priority: 'low'
      },
      {
        id: '4',
        type: 'security',
        title: 'New Login Detected',
        message: 'New login from IP address 192.168.1.100.',
        timestamp: new Date(Date.now() - 2 * 60 * 60000),
        read: false,
        category: 'security',
        priority: 'medium'
      }
    ];

    setNotifications(sampleNotifications);
  }, [toast]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast for high priority notifications
    if (notification.priority === 'high' || notification.priority === 'critical') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        unreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationCenter() {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll, 
    unreadCount 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'performance' | 'security'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
      case 'performance': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'security': return <Shield className="h-4 w-4 text-orange-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'low': return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10';
      default: return 'border-l-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.category === filter;
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.action) {
      notification.action.onClick();
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-96 z-50"
          >
            <Card className="shadow-lg border">
              <CardContent className="p-0">
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {unreadCount}
                        </Badge>
                      )}
                    </h3>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-1 overflow-x-auto">
                    {[
                      { key: 'all', label: 'All', icon: Bell },
                      { key: 'unread', label: 'Unread', icon: Info },
                      { key: 'system', label: 'System', icon: Database },
                      { key: 'performance', label: 'Performance', icon: TrendingUp },
                      { key: 'security', label: 'Security', icon: Shield }
                    ].map(({ key, label, icon: Icon }) => (
                      <Button
                        key={key}
                        variant={filter === key ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter(key as any)}
                        className="flex-shrink-0"
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {label}
                      </Button>
                    ))}
                  </div>

                  {/* Actions */}
                  {notifications.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={markAllAsRead}>
                        Mark All Read
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearAll}>
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>

                {/* Notifications List */}
                <ScrollArea className="max-h-96">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications to display</p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-2">
                      {filteredNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:bg-accent/50 ${
                            getPriorityColor(notification.priority)
                          } ${!notification.read ? 'ring-1 ring-blue-200 dark:ring-blue-800' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-sm truncate">
                                  {notification.title}
                                </h4>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeNotification(notification.id);
                                    }}
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {notification.category}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {notification.timestamp.toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                {notification.action && (
                                  <Button variant="outline" size="sm" className="text-xs h-6">
                                    {notification.action.label}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-2 border-t bg-muted/30">
                    <Button variant="ghost" size="sm" className="w-full justify-center">
                      <Settings className="h-3 w-3 mr-1" />
                      Notification Settings
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export function NotificationTrigger() {
  const { addNotification } = useNotifications();

  // Example function to add notifications programmatically
  const triggerTestNotification = () => {
    addNotification({
      type: 'info',
      title: 'Test Notification',
      message: 'This is a test notification to demonstrate the system.',
      category: 'system',
      priority: 'medium',
      action: {
        label: 'View Details',
        onClick: () => console.log('Test notification action clicked')
      }
    });
  };

  return (
    <Button onClick={triggerTestNotification} variant="outline" size="sm">
      <Zap className="h-4 w-4 mr-1" />
      Test Notification
    </Button>
  );
}
