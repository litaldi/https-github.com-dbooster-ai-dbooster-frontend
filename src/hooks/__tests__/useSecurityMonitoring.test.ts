
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useSecurityMonitoring } from '../useSecurityMonitoring';
import { securityAuditService } from '@/services/security/monitoring/securityAuditService';
import { threatPatternUpdater } from '@/services/security/monitoring/threatPatternUpdater';
import { securityPerformanceMonitor } from '@/services/security/monitoring/performanceMonitor';

// Mock dependencies
vi.mock('@/services/security/monitoring/securityAuditService', () => ({
  securityAuditService: {
    startContinuousMonitoring: vi.fn(),
    stopMonitoring: vi.fn(),
    getLatestAuditReport: vi.fn(),
    performSecurityAudit: vi.fn()
  }
}));

vi.mock('@/services/security/monitoring/threatPatternUpdater', () => ({
  threatPatternUpdater: {
    startAutomaticUpdates: vi.fn(),
    stopAutomaticUpdates: vi.fn(),
    getPatternUpdateHistory: vi.fn(),
    checkForPatternUpdates: vi.fn()
  }
}));

vi.mock('@/services/security/monitoring/performanceMonitor', () => ({
  securityPerformanceMonitor: {
    startMonitoring: vi.fn(),
    stopMonitoring: vi.fn(),
    getMetrics: vi.fn()
  }
}));

vi.mock('@/utils/productionLogger', () => ({
  productionLogger: {
    secureInfo: vi.fn(),
    error: vi.fn()
  }
}));

describe('useSecurityMonitoring', () => {
  const mockAuditReport = {
    id: 'audit-123',
    timestamp: new Date(),
    riskLevel: 'medium' as const,
    totalEvents: 100,
    suspiciousPatterns: [
      { pattern: 'pattern1', occurrences: 5, riskLevel: 'medium' },
      { pattern: 'pattern2', occurrences: 3, riskLevel: 'low' }
    ],
    recommendations: ['Recommendation 1', 'Recommendation 2'],
    summary: 'Security audit completed successfully'
  };

  const mockMetrics = {
    averageResponseTime: 150,
    requestsPerMinute: 50,
    validationLatency: 25,
    memoryUsage: 0.65
  };

  const mockPatternHistory = [
    { timestamp: Date.now(), patterns: ['sql_injection', 'xss'] }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    vi.mocked(securityAuditService.startContinuousMonitoring).mockResolvedValue();
    vi.mocked(securityAuditService.getLatestAuditReport).mockResolvedValue(mockAuditReport);
    vi.mocked(securityAuditService.performSecurityAudit).mockResolvedValue(mockAuditReport);
    
    vi.mocked(threatPatternUpdater.startAutomaticUpdates).mockResolvedValue();
    vi.mocked(threatPatternUpdater.getPatternUpdateHistory).mockResolvedValue(mockPatternHistory);
    vi.mocked(threatPatternUpdater.checkForPatternUpdates).mockResolvedValue();
    
    vi.mocked(securityPerformanceMonitor.getMetrics).mockReturnValue(mockMetrics);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe('Initialization and Configuration', () => {
    it('should initialize with default configuration', () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      expect(result.current.isMonitoring).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.config).toEqual({
        refreshInterval: 5 * 60 * 1000,
        enablePerformanceMonitoring: true,
        enablePatternUpdates: true
      });
    });

    it('should accept custom configuration', () => {
      const config = {
        refreshInterval: 60000,
        enablePerformanceMonitoring: false,
        enablePatternUpdates: false
      };

      const { result } = renderHook(() => useSecurityMonitoring(config));
      
      expect(result.current.config).toEqual(config);
    });
  });

  describe('Monitoring Lifecycle', () => {
    it('should start monitoring successfully', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      await act(async () => {
        await result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(true);
      expect(result.current.error).toBeNull();
      expect(securityAuditService.startContinuousMonitoring).toHaveBeenCalled();
      expect(threatPatternUpdater.startAutomaticUpdates).toHaveBeenCalled();
      expect(securityPerformanceMonitor.startMonitoring).toHaveBeenCalled();
    });

    it('should handle selective service enablement', async () => {
      const { result } = renderHook(() => 
        useSecurityMonitoring({ 
          enablePerformanceMonitoring: false,
          enablePatternUpdates: false 
        })
      );
      
      await act(async () => {
        await result.current.startMonitoring();
      });

      expect(securityAuditService.startContinuousMonitoring).toHaveBeenCalled();
      expect(threatPatternUpdater.startAutomaticUpdates).not.toHaveBeenCalled();
      expect(securityPerformanceMonitor.startMonitoring).not.toHaveBeenCalled();
    });

    it('should stop monitoring and cleanup resources', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      await act(async () => {
        await result.current.startMonitoring();
      });

      act(() => {
        result.current.stopMonitoring();
      });

      expect(result.current.isMonitoring).toBe(false);
      expect(securityAuditService.stopMonitoring).toHaveBeenCalled();
      expect(threatPatternUpdater.stopAutomaticUpdates).toHaveBeenCalled();
      expect(securityPerformanceMonitor.stopMonitoring).toHaveBeenCalled();
    });

    it('should not start monitoring if already monitoring', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      await act(async () => {
        await result.current.startMonitoring();
      });

      vi.clearAllMocks();

      await act(async () => {
        await result.current.startMonitoring();
      });

      expect(securityAuditService.startContinuousMonitoring).not.toHaveBeenCalled();
    });
  });

  describe('Data Refresh', () => {
    it('should refresh monitoring data successfully', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      await act(async () => {
        await result.current.startMonitoring();
      });

      expect(result.current.lastAuditReport).toEqual(mockAuditReport);
      expect(result.current.performanceMetrics).toEqual(mockMetrics);
      expect(result.current.patternUpdateHistory).toEqual(mockPatternHistory);
      expect(result.current.alerts).toEqual(mockAuditReport.suspiciousPatterns);
    });

    it('should handle partial service failures gracefully', async () => {
      vi.mocked(securityAuditService.getLatestAuditReport).mockRejectedValue(
        new Error('Audit service failed')
      );

      const { result } = renderHook(() => useSecurityMonitoring());
      
      await act(async () => {
        await result.current.startMonitoring();
      });

      // Should still have metrics and pattern history
      expect(result.current.performanceMetrics).toEqual(mockMetrics);
      expect(result.current.patternUpdateHistory).toEqual(mockPatternHistory);
      expect(result.current.lastAuditReport).toBeNull();
    });

    it('should auto-refresh data at specified intervals', async () => {
      const { result } = renderHook(() => 
        useSecurityMonitoring({ refreshInterval: 1000 })
      );
      
      await act(async () => {
        await result.current.startMonitoring();
      });

      vi.clearAllMocks();

      // Fast-forward time to trigger refresh
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await vi.runAllTimersAsync();
      });

      expect(securityAuditService.getLatestAuditReport).toHaveBeenCalled();
    });

    it('should not auto-refresh when monitoring is stopped', async () => {
      const { result } = renderHook(() => 
        useSecurityMonitoring({ refreshInterval: 1000 })
      );
      
      await act(async () => {
        await result.current.startMonitoring();
      });

      act(() => {
        result.current.stopMonitoring();
      });

      vi.clearAllMocks();

      // Fast-forward time
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await vi.runAllTimersAsync();
      });

      expect(securityAuditService.getLatestAuditReport).not.toHaveBeenCalled();
    });
  });

  describe('Manual Operations', () => {
    it('should perform manual audit successfully', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      let auditResult;
      await act(async () => {
        auditResult = await result.current.performManualAudit();
      });

      expect(auditResult).toEqual(mockAuditReport);
      expect(result.current.lastAuditReport).toEqual(mockAuditReport);
      expect(securityAuditService.performSecurityAudit).toHaveBeenCalled();
    });

    it('should handle manual audit errors', async () => {
      const auditError = new Error('Manual audit failed');
      vi.mocked(securityAuditService.performSecurityAudit).mockRejectedValue(auditError);

      const { result } = renderHook(() => useSecurityMonitoring());
      
      await expect(
        act(async () => {
          await result.current.performManualAudit();
        })
      ).rejects.toThrow('Manual audit failed');

      expect(result.current.error).toBe('Manual audit failed');
    });

    it('should check for pattern updates', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      await act(async () => {
        await result.current.checkForPatternUpdates();
      });

      expect(threatPatternUpdater.checkForPatternUpdates).toHaveBeenCalled();
      expect(threatPatternUpdater.getPatternUpdateHistory).toHaveBeenCalled();
      expect(result.current.patternUpdateHistory).toEqual(mockPatternHistory);
    });

    it('should skip pattern updates when disabled', async () => {
      const { result } = renderHook(() => 
        useSecurityMonitoring({ enablePatternUpdates: false })
      );
      
      await act(async () => {
        await result.current.checkForPatternUpdates();
      });

      expect(threatPatternUpdater.checkForPatternUpdates).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle startup errors gracefully', async () => {
      const startupError = new Error('Startup failed');
      vi.mocked(securityAuditService.startContinuousMonitoring).mockRejectedValue(startupError);

      const { result } = renderHook(() => useSecurityMonitoring());
      
      await act(async () => {
        await result.current.startMonitoring();
      });

      expect(result.current.error).toBe('Failed to start security monitoring');
      expect(result.current.isMonitoring).toBe(false);
    });

    it('should handle refresh errors gracefully', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      await act(async () => {
        await result.current.startMonitoring();
      });

      // Cause an error in refresh
      vi.mocked(securityAuditService.getLatestAuditReport).mockRejectedValue(
        new Error('Refresh failed')
      );

      await act(async () => {
        await result.current.refreshMonitoringData();
      });

      expect(result.current.error).toBe('Failed to refresh monitoring data');
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', () => {
      const { result, unmount } = renderHook(() => useSecurityMonitoring());
      
      act(() => {
        result.current.startMonitoring();
      });

      unmount();

      expect(securityAuditService.stopMonitoring).toHaveBeenCalled();
    });
  });
});
