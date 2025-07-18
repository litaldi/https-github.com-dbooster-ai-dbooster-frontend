
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { securityOrchestrator } from '@/services/security/securityOrchestrator';

interface SecurityStatus {
  level: 'secure' | 'warning' | 'danger';
  message: string;
  details: string[];
}

export function SecurityStatusIndicator() {
  const [status, setStatus] = useState<SecurityStatus>({
    level: 'secure',
    message: 'System Secure',
    details: []
  });

  useEffect(() => {
    const checkSecurityStatus = async () => {
      try {
        // This would typically check various security metrics
        const config = securityOrchestrator.getConfig();
        
        const details = [
          `Real-time monitoring: ${config.enableRealTimeMonitoring ? 'Active' : 'Inactive'}`,
          `Threat detection: ${config.enableAdvancedThreatDetection ? 'Active' : 'Inactive'}`,
          `Behavior analysis: ${config.enableBehaviorAnalysis ? 'Active' : 'Inactive'}`
        ];

        if (config.enableRealTimeMonitoring && config.enableAdvancedThreatDetection) {
          setStatus({
            level: 'secure',
            message: 'All Security Systems Active',
            details
          });
        } else {
          setStatus({
            level: 'warning',
            message: 'Partial Security Coverage',
            details
          });
        }
      } catch (error) {
        setStatus({
          level: 'danger',
          message: 'Security System Error',
          details: ['Unable to verify security status']
        });
      }
    };

    checkSecurityStatus();
    const interval = setInterval(checkSecurityStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getIcon = () => {
    switch (status.level) {
      case 'secure':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'danger':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getVariant = () => {
    switch (status.level) {
      case 'secure':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'danger':
        return 'destructive';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={getVariant()} className="flex items-center gap-2">
            {getIcon()}
            <Shield className="h-4 w-4" />
            {status.message}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">Security Status Details:</p>
            {status.details.map((detail, index) => (
              <p key={index} className="text-sm">• {detail}</p>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
