
import { useState, useEffect } from 'react';
import { nextGenAIService } from '@/services/ai/nextGenAIService';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface AnomalyData {
  anomalies: Array<{
    type: 'performance' | 'security' | 'resource';
    severity: 'critical' | 'warning' | 'info';
    description: string;
    timestamp: Date;
    recommendedAction: string;
  }>;
  trend: 'improving' | 'stable' | 'degrading';
  forecast: {
    nextHour: string;
    nextDay: string;
    nextWeek: string;
  };
}

export function useAnomalyDetection() {
  const [anomalyData, setAnomalyData] = useState<AnomalyData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  useEffect(() => {
    if (autoScanEnabled) {
      scanForAnomalies();
      
      const interval = setInterval(scanForAnomalies, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoScanEnabled]);

  const scanForAnomalies = async () => {
    setIsScanning(true);
    
    try {
      const mockMetrics = Array.from({ length: 100 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60000),
        executionTime: Math.random() * 1000 + 100,
        cpuUsage: Math.random() * 80 + 20,
        memoryUsage: Math.random() * 70 + 30,
        activeConnections: Math.floor(Math.random() * 100) + 10
      }));

      const result = await nextGenAIService.detectAnomalies(mockMetrics);
      setAnomalyData(result);
      setLastScan(new Date());

      if (result.anomalies.length > 0) {
        const criticalCount = result.anomalies.filter(a => a.severity === 'critical').length;
        if (criticalCount > 0) {
          enhancedToast.error({
            title: "Critical Anomalies Detected",
            description: `${criticalCount} critical anomalies found in your database`,
          });
        } else {
          enhancedToast.warning({
            title: "Anomalies Detected",
            description: `${result.anomalies.length} anomalies detected`,
          });
        }
      }
    } catch (error) {
      enhancedToast.error({
        title: "Anomaly Detection Failed",
        description: "Unable to scan for anomalies. Please try again.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return {
    anomalyData,
    isScanning,
    autoScanEnabled,
    setAutoScanEnabled,
    lastScan,
    scanForAnomalies
  };
}
