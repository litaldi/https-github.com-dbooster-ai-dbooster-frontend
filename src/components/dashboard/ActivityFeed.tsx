
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Zap, 
  Database, 
  AlertCircle, 
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ActivityItem {
  id: string | number;
  type: 'optimization' | 'connection' | 'alert' | 'analysis' | 'success' | 'info';
  message: string;
  time: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const activityIcons = {
  optimization: Zap,
  connection: Database,
  alert: AlertCircle,
  analysis: FileText,
  success: CheckCircle,
  info: Activity
};

const activityColors = {
  optimization: 'text-blue-600 bg-blue-50',
  connection: 'text-green-600 bg-green-50',
  alert: 'text-orange-600 bg-orange-50',
  analysis: 'text-purple-600 bg-purple-50',
  success: 'text-emerald-600 bg-emerald-50',
  info: 'text-gray-600 bg-gray-50'
};

const defaultActivities: ActivityItem[] = [
  { 
    id: 1, 
    type: 'optimization', 
    message: 'Query optimization completed for users table', 
    time: '2 minutes ago' 
  },
  { 
    id: 2, 
    type: 'connection', 
    message: 'New database connection established', 
    time: '15 minutes ago' 
  },
  { 
    id: 3, 
    type: 'alert', 
    message: 'Performance threshold exceeded on staging', 
    time: '1 hour ago' 
  },
  { 
    id: 4, 
    type: 'analysis', 
    message: 'Weekly performance report generated', 
    time: '3 hours ago' 
  },
  { 
    id: 5, 
    type: 'success', 
    message: 'Database backup completed successfully', 
    time: '6 hours ago' 
  }
];

interface ActivityFeedProps {
  activities?: ActivityItem[];
  title?: string;
  description?: string;
  showTime?: boolean;
}

export function ActivityFeed({ 
  activities = defaultActivities, 
  title = "Recent Activity",
  description = "Latest database optimization activities",
  showTime = true
}: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon || activityIcons[activity.type];
          const colorClass = activityColors[activity.type];
          
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-relaxed">{activity.message}</p>
                {showTime && (
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
