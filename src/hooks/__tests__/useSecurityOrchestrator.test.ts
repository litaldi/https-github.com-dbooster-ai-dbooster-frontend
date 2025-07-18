
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useSecurityOrchestrator } from '../useSecurityOrchestrator';
import { securityOrchestrator } from '@/services/security/securityOrchestrator';
import { productionLogger } from '@/utils/productionLogger';

// Mock dependencies
vi.mock('@/services/security/securityOrchestrator', () => ({
  securityOrchestrator: {
    initialize: vi.fn(),
    processSecurityRequest: vi.fn()
  }
}));

vi.mock('@/utils/productionLogger', () => ({
  productionLogger: {
    secureInfo: vi.fn(),
    error: vi.fn()
  }
}));

describe('useSecurityOrchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(securityOrchestrator.initialize).mockResolvedValue();
    vi.mocked(securityOrchestrator.processSecurityRequest).mockResolvedValue({
      allowed: true,
      sanitizedInput: 'clean input',
      threats: [],
      riskScore: 0,
      action: 'allow'
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize security orchestrator on mount', async () => {
      const { result } = renderHook(() => useSecurityOrchestrator());
      
      expect(result.current.isInitialized).toBe(false);
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });
      
      expect(securityOrchestrator.initialize).toHaveBeenCalledTimes(1);
      expect(productionLogger.secureInfo).toHaveBeenCalledWith(
        'Security orchestrator initialized in hook'
      );
    });

    it('should handle initialization errors gracefully', async () => {
      const initError = new Error('Initialization failed');
      vi.mocked(securityOrchestrator.initialize).mockRejectedValue(initError);

      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.error).toBe('Failed to initialize security orchestrator');
      });
      
      expect(result.current.isInitialized).toBe(false);
      expect(productionLogger.error).toHaveBeenCalledWith(
        'Failed to initialize security orchestrator',
        initError,
        'useSecurityOrchestrator'
      );
    });

    it('should not initialize multiple times', async () => {
      const { result, rerender } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });
      
      rerender();
      
      // Should still only be called once
      expect(securityOrchestrator.initialize).toHaveBeenCalledTimes(1);
    });
  });

  describe('Security Request Processing', () => {
    it('should process security requests successfully', async () => {
      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const requestData = {
        input: 'test input',
        context: 'test',
        userId: 'user123'
      };

      let processResult;
      await act(async () => {
        processResult = await result.current.processSecurityRequest(requestData);
      });

      expect(processResult).toEqual({
        allowed: true,
        sanitizedInput: 'clean input',
        threats: [],
        riskScore: 0,
        action: 'allow'
      });
      
      expect(securityOrchestrator.processSecurityRequest).toHaveBeenCalledWith(requestData);
    });

    it('should throw error when not initialized', async () => {
      vi.mocked(securityOrchestrator.initialize).mockImplementation(() => 
        new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await expect(
        result.current.processSecurityRequest({ input: 'test' })
      ).rejects.toThrow('Security orchestrator not initialized');
    });

    it('should deduplicate identical requests', async () => {
      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const requestData = { input: 'test input' };

      // Make two identical requests simultaneously
      const [result1, result2] = await Promise.all([
        result.current.processSecurityRequest(requestData),
        result.current.processSecurityRequest(requestData)
      ]);

      expect(result1).toEqual(result2);
      expect(securityOrchestrator.processSecurityRequest).toHaveBeenCalledTimes(1);
    });

    it('should handle processing errors', async () => {
      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const processError = new Error('Processing failed');
      vi.mocked(securityOrchestrator.processSecurityRequest).mockRejectedValue(processError);

      await expect(
        result.current.processSecurityRequest({ input: 'test' })
      ).rejects.toThrow('Processing failed');

      expect(result.current.error).toBe('Security request processing failed');
    });
  });

  describe('Input Validation', () => {
    it('should validate input successfully', async () => {
      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      let validationResult;
      await act(async () => {
        validationResult = await result.current.validateInput('test input', 'general');
      });

      expect(validationResult).toEqual({
        valid: true,
        sanitized: 'clean input',
        threats: []
      });

      expect(securityOrchestrator.processSecurityRequest).toHaveBeenCalledWith({
        input: 'test input',
        context: 'general',
        action: 'validate_input'
      });
    });

    it('should handle validation errors gracefully', async () => {
      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      vi.mocked(securityOrchestrator.processSecurityRequest).mockRejectedValue(
        new Error('Validation failed')
      );

      let validationResult;
      await act(async () => {
        validationResult = await result.current.validateInput('test input');
      });

      expect(validationResult).toEqual({
        valid: false,
        sanitized: 'test input',
        threats: ['Validation service unavailable']
      });
    });
  });

  describe('User Access Check', () => {
    it('should check user access successfully', async () => {
      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      let accessResult;
      await act(async () => {
        accessResult = await result.current.checkUserAccess('user123', 'read', 'resource1');
      });

      expect(accessResult).toEqual({
        allowed: true,
        reason: undefined
      });

      expect(securityOrchestrator.processSecurityRequest).toHaveBeenCalledWith({
        userId: 'user123',
        action: 'read',
        context: 'resource1'
      });
    });

    it('should handle access check with threats', async () => {
      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      vi.mocked(securityOrchestrator.processSecurityRequest).mockResolvedValue({
        allowed: false,
        threats: ['Insufficient permissions', 'Suspicious activity'],
        riskScore: 75,
        action: 'block'
      });

      let accessResult;
      await act(async () => {
        accessResult = await result.current.checkUserAccess('user123', 'delete');
      });

      expect(accessResult).toEqual({
        allowed: false,
        reason: 'Insufficient permissions, Suspicious activity'
      });
    });

    it('should handle access check errors gracefully', async () => {
      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      vi.mocked(securityOrchestrator.processSecurityRequest).mockRejectedValue(
        new Error('Access check failed')
      );

      let accessResult;
      await act(async () => {
        accessResult = await result.current.checkUserAccess('user123', 'read');
      });

      expect(accessResult).toEqual({
        allowed: false,
        reason: 'Access validation service unavailable'
      });
    });
  });

  describe('Reinitialization', () => {
    it('should allow manual reinitialization', async () => {
      const { result } = renderHook(() => useSecurityOrchestrator());
      
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Reset mocks to track new calls
      vi.clearAllMocks();
      vi.mocked(securityOrchestrator.initialize).mockResolvedValue();

      await act(async () => {
        await result.current.reinitialize();
      });

      expect(securityOrchestrator.initialize).toHaveBeenCalledTimes(1);
    });
  });
});
