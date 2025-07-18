
import { useState, useEffect } from 'react';
import { nextGenAIService } from '@/services/ai/nextGenAIService';

interface MetricData {
  timestamp: Date;
  executionTime: number;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
}

interface AnomalyDetectionResult {
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
  const [isScanning, setIsScanning] = useState(false);
  const [anomalyData, setAnomalyData] = useState<AnomalyDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  // Generate mock metric data for demonstration
  const generateMockMetrics = (): MetricData[] => {
    const metrics: MetricData[] = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - (i * 60000)); // Every minute for 50 minutes
      metrics.push({
        timestamp,
        executionTime: 100 + Math.random() * 200 + (i > 40 ? Math.random() * 500 : 0), // Anomaly in recent data
        cpuUsage: 30 + Math.random() * 40,
        memoryUsage: 50 + Math.random() * 30,
        activeConnections: 10 + Math.random() * 20
      });
    }
    
    return metrics.reverse(); // Chronological order
  };

  const scanForAnomalies = async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      await nextGenAIService.initialize();
      const metrics = generateMockMetrics();
      const detectionResult = await nextGenAIService.detectAnomalies(metrics);
      setAnomalyData(detectionResult);
      setLastScan(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed');
      console.error('Anomaly detection failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Auto-scan functionality
  useEffect(() => {
    if (autoScanEnabled) {
      const interval = setInterval(() => {
        scanForAnomalies();
      }, 5 * 60 * 1000); // Every 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoScanEnabled]);

  return {
    isScanning,
    anomalyData,
    error,
    autoScanEnabled,
    setAutoScanEnabled,
    lastScan,
    scanForAnomalies
  };
}
