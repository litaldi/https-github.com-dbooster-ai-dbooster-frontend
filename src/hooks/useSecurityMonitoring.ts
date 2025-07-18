
import { useState, useEffect } from 'react';
import { securityMonitoringService, type SecurityAlert } from '@/services/security/securityMonitoringService';
import { productionLogger } from '@/utils/productionLogger';

export function useSecurityMonitoring() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState({
    totalEscalationAttempts: 0,
    recentEscalationAttempts: 0,
    securityScore: 100,
    criticalAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSecurityData = async () => {
    try {
      setError(null);
      const [alertsData, metricsData] = await Promise.all([
        securityMonitoringService.getSecurityAlerts(20),
        securityMonitoringService.getSecurityMetrics()
      ]);

      setAlerts(alertsData);
      setMetrics(metricsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load security data';
      setError(errorMessage);
      productionLogger.error('Security monitoring hook error', err, 'useSecurityMonitoring');
    } finally {
      setLoading(false);
    }
  };

  const secureRoleAssignment = async (
    targetUserId: string,
    newRole: string,
    reason?: string
  ) => {
    try {
      const result = await securityMonitoringService.secureRoleAssignment(
        targetUserId,
        newRole,
        reason
      );
      
      // Refresh security data after role assignment
      await loadSecurityData();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Role assignment failed';
      productionLogger.error('Secure role assignment failed', err, 'useSecurityMonitoring');
      throw new Error(errorMessage);
    }
  };

  const checkAdminBootstrapNeeded = async () => {
    try {
      return await securityMonitoringService.checkAdminBootstrapNeeded();
    } catch (err) {
      productionLogger.error('Failed to check admin bootstrap status', err, 'useSecurityMonitoring');
      return false;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await loadSecurityData();
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  return {
    alerts,
    metrics,
    loading,
    error,
    refreshData,
    secureRoleAssignment,
    checkAdminBootstrapNeeded
  };
}
