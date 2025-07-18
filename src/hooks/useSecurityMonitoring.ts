
import { useState, useEffect } from 'react';
import { realTimeSecurityMonitor } from '@/services/security/realTimeSecurityMonitor';

interface SecurityMetrics {
  failedLogins: number;
  suspiciousActivities: number;
  blockedRequests: number;
  activeThreats: number;
}

interface SecurityEvent {
  type: string;
  severity: string;
  message: string;
  timestamp: number;
  metadata: Record<string, any>;
}

export function useSecurityMonitoring() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    failedLogins: 0,
    suspiciousActivities: 0,
    blockedRequests: 0,
    activeThreats: 0
  });
  
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateData = () => {
      setMetrics(realTimeSecurityMonitor.getSecurityMetrics());
      setRecentEvents(realTimeSecurityMonitor.getRecentEvents(10));
      setIsLoading(false);
    };

    updateData();
    const interval = setInterval(updateData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const logSecurityEvent = (event: Omit<SecurityEvent, 'timestamp'>) => {
    // Ensure metadata is always provided
    const eventWithMetadata = {
      ...event,
      metadata: event.metadata || {}
    };
    realTimeSecurityMonitor.logSecurityEvent(eventWithMetadata);
  };

  return {
    metrics,
    recentEvents,
    isLoading,
    logSecurityEvent
  };
}
