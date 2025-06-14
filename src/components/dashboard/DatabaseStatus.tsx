
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'mongodb' | 'redis';
  status: 'connected' | 'disconnected' | 'error' | 'checking';
  lastChecked: Date;
  responseTime?: number;
  version?: string;
}

const mockConnections: DatabaseConnection[] = [
  {
    id: '1',
    name: 'Production DB',
    type: 'postgresql',
    status: 'connected',
    lastChecked: new Date(),
    responseTime: 23,
    version: '15.2'
  },
  {
    id: '2',
    name: 'Analytics DB',
    type: 'mysql',
    status: 'connected',
    lastChecked: new Date(Date.now() - 300000),
    responseTime: 45,
    version: '8.0'
  },
  {
    id: '3',
    name: 'Cache Layer',
    type: 'redis',
    status: 'disconnected',
    lastChecked: new Date(Date.now() - 1800000),
  }
];

function ConnectionCard({ connection }: { connection: DatabaseConnection }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const statusConfig = {
    connected: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      label: 'Connected'
    },
    disconnected: {
      icon: XCircle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-900/20',
      label: 'Disconnected'
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      label: 'Error'
    },
    checking: {
      icon: RefreshCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      label: 'Checking'
    }
  };

  const config = statusConfig[connection.status];
  const StatusIcon = config.icon;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{connection.name}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {connection.type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn("p-1 rounded-full", config.bgColor)}>
              <StatusIcon className={cn("h-3 w-3", config.color)} />
            </div>
            <span className={cn("text-sm font-medium", config.color)}>
              {config.label}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={cn(
              "h-3 w-3",
              isRefreshing && "animate-spin"
            )} />
          </Button>
        </div>
        
        {connection.status === 'connected' && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Response:</span>
              <span className="ml-1 font-medium">{connection.responseTime}ms</span>
            </div>
            {connection.version && (
              <div>
                <span className="text-muted-foreground">Version:</span>
                <span className="ml-1 font-medium">{connection.version}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Last checked: {connection.lastChecked.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function DatabaseStatus() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Database Connections</h3>
        <p className="text-sm text-muted-foreground">
          Monitor the status of your connected databases
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockConnections.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}
      </div>
    </div>
  );
}
