
import { useState, useEffect, useCallback } from 'react';
import { securityAuditService } from '@/services/security/monitoring/securityAuditService';
import { threatPatternUpdater } from '@/services/security/monitoring/threatPatternUpdater';
import { securityPerformanceMonitor } from '@/services/security/monitoring/performanceMonitor';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityMonitoringState {
  isMonitoring: boolean;
  lastAuditReport: any;
  performanceMetrics: any;
  patternUpdateHistory: any[];
  alerts: any[];
}

export function useSecurityMonitoring() {
  const [state, setState] = useState<SecurityMonitoringState>({
    isMonitoring: false,
    lastAuditReport: null,
    performanceMetrics: null,
    patternUpdateHistory: [],
    alerts: []
  });

  const [loading, setLoading] = useState(false);

  const startMonitoring = useCallback(async () => {
    try {
      setLoading(true);
      productionLogger.secureInfo('Starting comprehensive security monitoring');

      // Start all monitoring services
      await securityAuditService.startContinuousMonitoring();
      await threatPatternUpdater.startAutomaticUpdates();
      securityPerformanceMonitor.startMonitoring();

      setState(prev => ({ ...prev, isMonitoring: true }));
      
      // Initial data load
      await refreshMonitoringData();

    } catch (error) {
      productionLogger.error('Failed to start security monitoring', error, 'useSecurityMonitoring');
    } finally {
      setLoading(false);
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    productionLogger.secureInfo('Stopping security monitoring');
    
    securityAuditService.stopMonitoring();
    threatPatternUpdater.stopAutomaticUpdates();
    securityPerformanceMonitor.stopMonitoring();

    setState(prev => ({ ...prev, isMonitoring: false }));
  }, []);

  const refreshMonitoringData = useCallback(async () => {
    try {
      setLoading(true);

      // Get latest audit report
      const auditReport = await securityAuditService.getLatestAuditReport();
      
      // Get performance metrics
      const performanceMetrics = securityPerformanceMonitor.getMetrics();
      
      // Get pattern update history
      const patternHistory = await threatPatternUpdater.getPatternUpdateHistory();

      setState(prev => ({
        ...prev,
        lastAuditReport: auditReport,
        performanceMetrics,
        patternUpdateHistory: patternHistory,
        alerts: auditReport?.suspiciousPatterns || []
      }));

    } catch (error) {
      productionLogger.error('Failed to refresh monitoring data', error, 'useSecurityMonitoring');
    } finally {
      setLoading(false);
    }
  }, []);

  const performManualAudit = useCallback(async () => {
    try {
      setLoading(true);
      const report = await securityAuditService.performSecurityAudit();
      setState(prev => ({ ...prev, lastAuditReport: report }));
      return report;
    } catch (error) {
      productionLogger.error('Manual audit failed', error, 'useSecurityMonitoring');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkForPatternUpdates = useCallback(async () => {
    try {
      await threatPatternUpdater.checkForPatternUpdates();
      const history = await threatPatternUpdater.getPatternUpdateHistory();
      setState(prev => ({ ...prev, patternUpdateHistory: history }));
    } catch (error) {
      productionLogger.error('Pattern update check failed', error, 'useSecurityMonitoring');
    }
  }, []);

  // Auto-refresh data periodically
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isMonitoring) {
      interval = setInterval(() => {
        refreshMonitoringData();
      }, 5 * 60 * 1000); // Every 5 minutes
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isMonitoring, refreshMonitoringData]);

  return {
    ...state,
    loading,
    startMonitoring,
    stopMonitoring,
    refreshMonitoringData,
    performManualAudit,
    checkForPatternUpdates
  };
}
