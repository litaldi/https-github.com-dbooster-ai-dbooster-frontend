
import { useState, useEffect, useCallback, useRef } from 'react';
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
  error: string | null;
}

interface MonitoringConfig {
  refreshInterval?: number;
  enablePerformanceMonitoring?: boolean;
  enablePatternUpdates?: boolean;
}

export function useSecurityMonitoring(config: MonitoringConfig = {}) {
  const {
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    enablePerformanceMonitoring = true,
    enablePatternUpdates = true
  } = config;

  const [state, setState] = useState<SecurityMonitoringState>({
    isMonitoring: false,
    lastAuditReport: null,
    performanceMetrics: null,
    patternUpdateHistory: [],
    alerts: [],
    error: null
  });

  const [loading, setLoading] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const updateState = useCallback((updates: Partial<SecurityMonitoringState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const startMonitoring = useCallback(async () => {
    if (state.isMonitoring) {
      return;
    }

    try {
      setLoading(true);
      updateState({ error: null });
      
      // Create abort controller for cleanup
      abortControllerRef.current = new AbortController();

      productionLogger.secureInfo('Starting comprehensive security monitoring');

      // Start monitoring services with error handling
      const startupPromises = [];
      
      startupPromises.push(securityAuditService.startContinuousMonitoring());
      
      if (enablePatternUpdates) {
        startupPromises.push(threatPatternUpdater.startAutomaticUpdates());
      }
      
      if (enablePerformanceMonitoring) {
        startupPromises.push(
          Promise.resolve(securityPerformanceMonitor.startMonitoring())
        );
      }

      await Promise.allSettled(startupPromises);
      
      updateState({ isMonitoring: true });
      
      // Initial data load
      await refreshMonitoringData();

    } catch (error) {
      const errorMessage = 'Failed to start security monitoring';
      updateState({ error: errorMessage });
      productionLogger.error(errorMessage, error, 'useSecurityMonitoring');
    } finally {
      setLoading(false);
    }
  }, [state.isMonitoring, enablePatternUpdates, enablePerformanceMonitoring]);

  const stopMonitoring = useCallback(() => {
    productionLogger.secureInfo('Stopping security monitoring');
    
    // Cancel ongoing operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear refresh interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    
    // Stop monitoring services
    securityAuditService.stopMonitoring();
    
    if (enablePatternUpdates) {
      threatPatternUpdater.stopAutomaticUpdates();
    }
    
    if (enablePerformanceMonitoring) {
      securityPerformanceMonitor.stopMonitoring();
    }

    updateState({ isMonitoring: false, error: null });
  }, [enablePatternUpdates, enablePerformanceMonitoring]);

  const refreshMonitoringData = useCallback(async () => {
    if (!state.isMonitoring) {
      return;
    }

    try {
      setLoading(true);
      updateState({ error: null });

      // Use Promise.allSettled to handle partial failures gracefully
      const [auditResult, performanceResult, patternResult] = await Promise.allSettled([
        securityAuditService.getLatestAuditReport(),
        enablePerformanceMonitoring ? securityPerformanceMonitor.getMetrics() : null,
        enablePatternUpdates ? threatPatternUpdater.getPatternUpdateHistory() : []
      ]);

      const updates: Partial<SecurityMonitoringState> = {};

      if (auditResult.status === 'fulfilled') {
        updates.lastAuditReport = auditResult.value;
        updates.alerts = auditResult.value?.suspiciousPatterns || [];
      }

      if (performanceResult.status === 'fulfilled' && performanceResult.value) {
        updates.performanceMetrics = performanceResult.value;
      }

      if (patternResult.status === 'fulfilled') {
        updates.patternUpdateHistory = patternResult.value;
      }

      updateState(updates);

    } catch (error) {
      const errorMessage = 'Failed to refresh monitoring data';
      updateState({ error: errorMessage });
      productionLogger.error(errorMessage, error, 'useSecurityMonitoring');
    } finally {
      setLoading(false);
    }
  }, [state.isMonitoring, enablePerformanceMonitoring, enablePatternUpdates]);

  const performManualAudit = useCallback(async () => {
    try {
      setLoading(true);
      updateState({ error: null });
      
      const report = await securityAuditService.performSecurityAudit();
      updateState({ lastAuditReport: report });
      
      return report;
    } catch (error) {
      const errorMessage = 'Manual audit failed';
      updateState({ error: errorMessage });
      productionLogger.error(errorMessage, error, 'useSecurityMonitoring');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkForPatternUpdates = useCallback(async () => {
    if (!enablePatternUpdates) {
      return;
    }

    try {
      updateState({ error: null });
      
      await threatPatternUpdater.checkForPatternUpdates();
      const history = await threatPatternUpdater.getPatternUpdateHistory();
      updateState({ patternUpdateHistory: history });
    } catch (error) {
      const errorMessage = 'Pattern update check failed';
      updateState({ error: errorMessage });
      productionLogger.error(errorMessage, error, 'useSecurityMonitoring');
    }
  }, [enablePatternUpdates]);

  // Auto-refresh data periodically
  useEffect(() => {
    if (state.isMonitoring && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        refreshMonitoringData();
      }, refreshInterval);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [state.isMonitoring, refreshInterval, refreshMonitoringData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    ...state,
    loading,
    startMonitoring,
    stopMonitoring,
    refreshMonitoringData,
    performManualAudit,
    checkForPatternUpdates,
    config: {
      refreshInterval,
      enablePerformanceMonitoring,
      enablePatternUpdates
    }
  };
}
