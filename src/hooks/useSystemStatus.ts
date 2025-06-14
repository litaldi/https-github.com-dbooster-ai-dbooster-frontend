
import { useState, useEffect } from 'react';

interface SystemStatus {
  api: 'online' | 'offline' | 'degraded';
  database: 'online' | 'offline' | 'degraded';
  ai: 'online' | 'offline' | 'degraded';
  lastChecked: Date;
}

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    api: 'online',
    database: 'online',
    ai: 'online',
    lastChecked: new Date()
  });

  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      // Simulate status checks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock status - in reality, you'd check actual endpoints
      const newStatus: SystemStatus = {
        api: Math.random() > 0.1 ? 'online' : 'degraded',
        database: Math.random() > 0.05 ? 'online' : 'degraded',
        ai: Math.random() > 0.15 ? 'online' : 'degraded',
        lastChecked: new Date()
      };
      
      setStatus(newStatus);
    } catch (error) {
      console.error('Failed to check system status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Check status every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getOverallStatus = (): 'online' | 'offline' | 'degraded' => {
    if (status.api === 'offline' || status.database === 'offline') {
      return 'offline';
    }
    if (status.api === 'degraded' || status.database === 'degraded' || status.ai === 'degraded') {
      return 'degraded';
    }
    return 'online';
  };

  return {
    status,
    isChecking,
    checkStatus,
    overallStatus: getOverallStatus()
  };
}
