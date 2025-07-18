
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { realTimeSecurityMonitor } from '@/services/security/realTimeSecurityMonitor';

export function SecurityStatusIndicator() {
  const [securityHealth, setSecurityHealth] = useState({
    score: 100,
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    issues: [] as string[]
  });

  useEffect(() => {
    const updateSecurityHealth = () => {
      const health = realTimeSecurityMonitor.getSecurityHealth();
      setSecurityHealth(health);
    };

    updateSecurityHealth();
    const interval = setInterval(updateSecurityHealth, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (securityHealth.status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <Shield className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (securityHealth.status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">Security Status</span>
          </div>
          <Badge className={getStatusColor()}>
            {securityHealth.score}/100
          </Badge>
        </div>

        {securityHealth.issues.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Active Issues:</div>
            {securityHealth.issues.map((issue, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
