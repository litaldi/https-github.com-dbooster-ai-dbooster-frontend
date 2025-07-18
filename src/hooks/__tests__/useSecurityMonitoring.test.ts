
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useSecurityMonitoring } from '../useSecurityMonitoring';
import { securityMonitoringService } from '@/services/security/securityMonitoringService';

// Mock dependencies
vi.mock('@/services/security/securityMonitoringService', () => ({
  securityMonitoringService: {
    getSecurityAlerts: vi.fn(),
    getSecurityMetrics: vi.fn(),
    secureRoleAssignment: vi.fn(),
    checkAdminBootstrapNeeded: vi.fn()
  }
}));

vi.mock('@/utils/productionLogger', () => ({
  productionLogger: {
    error: vi.fn()
  }
}));

describe('useSecurityMonitoring', () => {
  const mockAlerts = [
    {
      id: 'alert-1',
      type: 'privilege_escalation' as const,
      severity: 'high' as const,
      message: 'Privilege escalation attempt detected',
      user_id: 'user-123',
      metadata: { attempted_role: 'admin' },
      created_at: new Date().toISOString()
    }
  ];

  const mockMetrics = {
    totalEscalationAttempts: 5,
    recentEscalationAttempts: 2,
    securityScore: 85,
    criticalAlerts: 1
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(securityMonitoringService.getSecurityAlerts).mockResolvedValue(mockAlerts);
    vi.mocked(securityMonitoringService.getSecurityMetrics).mockResolvedValue(mockMetrics);
    vi.mocked(securityMonitoringService.secureRoleAssignment).mockResolvedValue({
      success: true,
      message: 'Role assigned successfully'
    });
    vi.mocked(securityMonitoringService.checkAdminBootstrapNeeded).mockResolvedValue(false);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      expect(result.current.loading).toBe(true);
      expect(result.current.alerts).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should load security data on mount', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.alerts).toEqual(mockAlerts);
      expect(result.current.metrics).toEqual(mockMetrics);
      expect(securityMonitoringService.getSecurityAlerts).toHaveBeenCalledWith(20);
      expect(securityMonitoringService.getSecurityMetrics).toHaveBeenCalled();
    });
  });

  describe('Data Management', () => {
    it('should refresh data successfully', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      vi.clearAllMocks();

      await act(async () => {
        await result.current.refreshData();
      });

      expect(securityMonitoringService.getSecurityAlerts).toHaveBeenCalledWith(20);
      expect(securityMonitoringService.getSecurityMetrics).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Network error');
      vi.mocked(securityMonitoringService.getSecurityAlerts).mockRejectedValue(error);

      const { result } = renderHook(() => useSecurityMonitoring());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to load security data');
    });
  });

  describe('Role Assignment', () => {
    it('should perform secure role assignment', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const assignmentResult = await act(async () => {
        return result.current.secureRoleAssignment('user-123', 'admin', 'Test assignment');
      });

      expect(assignmentResult).toEqual({
        success: true,
        message: 'Role assigned successfully'
      });
      expect(securityMonitoringService.secureRoleAssignment).toHaveBeenCalledWith(
        'user-123',
        'admin',
        'Test assignment'
      );
    });

    it('should handle role assignment errors', async () => {
      const error = new Error('Assignment failed');
      vi.mocked(securityMonitoringService.secureRoleAssignment).mockRejectedValue(error);

      const { result } = renderHook(() => useSecurityMonitoring());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.secureRoleAssignment('user-123', 'admin');
        })
      ).rejects.toThrow('Assignment failed');
    });
  });

  describe('Admin Bootstrap', () => {
    it('should check admin bootstrap status', async () => {
      const { result } = renderHook(() => useSecurityMonitoring());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const bootstrapNeeded = await act(async () => {
        return result.current.checkAdminBootstrapNeeded();
      });

      expect(bootstrapNeeded).toBe(false);
      expect(securityMonitoringService.checkAdminBootstrapNeeded).toHaveBeenCalled();
    });

    it('should handle bootstrap check errors', async () => {
      const error = new Error('Bootstrap check failed');
      vi.mocked(securityMonitoringService.checkAdminBootstrapNeeded).mockRejectedValue(error);

      const { result } = renderHook(() => useSecurityMonitoring());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const bootstrapNeeded = await act(async () => {
        return result.current.checkAdminBootstrapNeeded();
      });

      expect(bootstrapNeeded).toBe(false);
    });
  });
});
