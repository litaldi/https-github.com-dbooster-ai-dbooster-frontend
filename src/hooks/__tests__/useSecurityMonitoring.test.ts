
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSecurityMonitoring } from '../useSecurityMonitoring';
import { productionLogger } from '@/utils/productionLogger';

// Mock all the services
vi.mock('@/services/security/monitoring/securityAuditService', () => ({
  securityAuditService: {
    startContinuousMonitoring: vi.fn().mockResolvedValue(undefined),
    stopMonitoring: vi.fn(),
    getLatestAuditReport: vi.fn().mockResolvedValue({
      id: '1',
      timestamp: new Date(),
      riskLevel: 'low',
      totalEvents: 10,
      suspiciousPatterns: [],
      recommendations: ['Update security policies'],
      summary: 'All systems normal'
    }),
    performSecurityAudit: vi.fn().mockResolvedValue({
      id: '2',
      timestamp: new Date(),
      riskLevel: 'medium',
      totalEvents: 15,
      suspiciousPatterns: [{ pattern: 'test', occurrences: 1, riskLevel: 'low' }],
      recommendations: ['Review recent activities'],
      summary: 'Minor issues detected'
    })
  }
}));

vi.mock('@/services/security/monitoring/threatPatternUpdater', () => ({
  threatPatternUpdater: {
    startAutomaticUpdates: vi.fn().mockResolvedValue(undefined),
    stopAutomaticUpdates: vi.fn(),
    checkForPatternUpdates: vi.fn().mockResolvedValue(undefined),
    getPatternUpdateHistory: vi.fn().mockResolvedValue([
      {
        version: '1.0.0',
        date: new Date().toISOString(),
        patternsAdded: 5,
        description: 'Initial patterns'
      }
    ])
  }
}));

vi.mock('@/services/security/monitoring/performanceMonitor', () => ({
  securityPerformanceMonitor: {
    startMonitoring: vi.fn(),
    stopMonitoring: vi.fn(),
    getMetrics: vi.fn().mockReturnValue({
      averageResponseTime: 150,
      totalRequests: 1000,
      errorRate: 0.02,
      threatsDetected: 5
    })
  }
}));

vi.mock('@/utils/productionLogger', () => ({
  productionLogger: {
    secureInfo: vi.fn(),
    error: vi.fn()
  }
}));

describe('useSecurityMonitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any existing timers
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSecurityMonitoring());

      expect(result.current.isMonitoring).toBe(false);
      expect(result.current.lastAuditReport).toBeNull();
      expect(result.current.performanceMetrics).toBeNull();
      expect(result.current.patternUpdateHistory).toEqual([]);
      expect(result.current.alerts).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Start Monitoring', () => {
    it('should start monitoring successfully', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());

      await act(async () => {
        await result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(productionLogger.secureInfo).toHaveBeenCalledWith('Starting comprehensive security monitoring');
    });

    it('should handle monitoring start errors', async () => {
      const { securityAuditService } = await import('@/services/security/monitoring/securityAuditService');
      vi.mocked(securityAuditService.startContinuousMonitoring).mockRejectedValueOnce(new Error('Start failed'));

      const { result } = renderHook(() => useSecurityMonitoring());

      await act(async () => {
        await result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(false);
      expect(productionLogger.error).toHaveBeenCalledWith(
        'Failed to start security monitoring',
        expect.any(Error),
        'useSecurityMonitoring'
      );
    });
  });

  describe('Stop Monitoring', () => {
    it('should stop monitoring', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());

      // Start monitoring first
      await act(async () => {
        await result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(true);

      // Stop monitoring
      act(() => {
        result.current.stopMonitoring();
      });

      expect(result.current.isMonitoring).toBe(false);
      expect(productionLogger.secureInfo).toHaveBeenCalledWith('Stopping security monitoring');
    });
  });

  describe('Refresh Monitoring Data', () => {
    it('should refresh monitoring data successfully', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());

      await act(async () => {
        await result.current.refreshMonitoringData();
      });

      expect(result.current.lastAuditReport).toBeDefined();
      expect(result.current.performanceMetrics).toBeDefined();
      expect(result.current.patternUpdateHistory).toHaveLength(1);
      expect(result.current.loading).toBe(false);
    });

    it('should handle refresh errors', async () => {
      const { securityAuditService } = await import('@/services/security/monitoring/securityAuditService');
      vi.mocked(securityAuditService.getLatestAuditReport).mockRejectedValueOnce(new Error('Refresh failed'));

      const { result } = renderHook(() => useSecurityMonitoring());

      await act(async () => {
        await result.current.refreshMonitoringData();
      });

      expect(productionLogger.error).toHaveBeenCalledWith(
        'Failed to refresh monitoring data',
        expect.any(Error),
        'useSecurityMonitoring'
      );
    });
  });

  describe('Manual Audit', () => {
    it('should perform manual audit successfully', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());

      let auditResult;
      await act(async () => {
        auditResult = await result.current.performManualAudit();
      });

      expect(auditResult).toBeDefined();
      expect(result.current.lastAuditReport).toBeDefined();
      expect(result.current.loading).toBe(false);
    });

    it('should handle manual audit errors', async () => {
      const { securityAuditService } = await import('@/services/security/monitoring/securityAuditService');
      vi.mocked(securityAuditService.performSecurityAudit).mockRejectedValueOnce(new Error('Audit failed'));

      const { result } = renderHook(() => useSecurityMonitoring());

      await act(async () => {
        await expect(result.current.performManualAudit()).rejects.toThrow('Audit failed');
      });

      expect(productionLogger.error).toHaveBeenCalledWith(
        'Manual audit failed',
        expect.any(Error),
        'useSecurityMonitoring'
      );
    });
  });

  describe('Pattern Updates', () => {
    it('should check for pattern updates', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());

      await act(async () => {
        await result.current.checkForPatternUpdates();
      });

      expect(result.current.patternUpdateHistory).toHaveLength(1);
    });

    it('should handle pattern update errors', async () => {
      const { threatPatternUpdater } = await import('@/services/security/monitoring/threatPatternUpdater');
      vi.mocked(threatPatternUpdater.checkForPatternUpdates).mockRejectedValueOnce(new Error('Update failed'));

      const { result } = renderHook(() => useSecurityMonitoring());

      await act(async () => {
        await result.current.checkForPatternUpdates();
      });

      expect(productionLogger.error).toHaveBeenCalledWith(
        'Pattern update check failed',
        expect.any(Error),
        'useSecurityMonitoring'
      );
    });
  });

  describe('Auto-refresh', () => {
    it('should auto-refresh data when monitoring is active', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());

      // Start monitoring
      await act(async () => {
        await result.current.startMonitoring();
      });

      // Clear mock calls from initial start
      vi.clearAllMocks();

      // Fast-forward 5 minutes
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      // Wait for async operations
      await act(async () => {
        await Promise.resolve();
      });

      const { securityAuditService } = await import('@/services/security/monitoring/securityAuditService');
      expect(securityAuditService.getLatestAuditReport).toHaveBeenCalled();
    });

    it('should not auto-refresh when monitoring is stopped', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());

      // Start and then stop monitoring
      await act(async () => {
        await result.current.startMonitoring();
      });

      act(() => {
        result.current.stopMonitoring();
      });

      // Clear mock calls
      vi.clearAllMocks();

      // Fast-forward 5 minutes
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      const { securityAuditService } = await import('@/services/security/monitoring/securityAuditService');
      expect(securityAuditService.getLatestAuditReport).not.toHaveBeenCalled();
    });
  });
});
