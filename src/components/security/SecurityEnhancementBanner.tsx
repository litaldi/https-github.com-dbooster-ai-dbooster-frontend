
import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';

export function SecurityEnhancementBanner() {
  const { securityStatus, isSecurityValidated } = useEnhancedSecurity();
  const [isVisible, setIsVisible] = useState(true);
  const [lastSecurityCheck, setLastSecurityCheck] = useState<Date>(new Date());

  useEffect(() => {
    const checkInterval = setInterval(() => {
      setLastSecurityCheck(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(checkInterval);
  }, []);

  if (!isVisible || securityStatus === 'secure') {
    return null;
  }

  const getStatusIcon = () => {
    switch (securityStatus) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = () => {
    switch (securityStatus) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-green-200 bg-green-50';
    }
  };

  const getStatusText = () => {
    switch (securityStatus) {
      case 'critical':
        return 'Critical security issue detected';
      case 'warning':
        return 'Security warning - enhanced monitoring active';
      default:
        return 'Security systems operational';
    }
  };

  return (
    <Card className={`mb-4 ${getStatusColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{getStatusText()}</span>
                <Badge variant={securityStatus === 'critical' ? 'destructive' : 'secondary'}>
                  {securityStatus.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Last security check: {lastSecurityCheck.toLocaleTimeString()}
                {isSecurityValidated && ' • Session validated'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
