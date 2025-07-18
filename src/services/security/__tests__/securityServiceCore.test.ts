
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SecurityServiceCore } from '../core/securityServiceCore';
import { productionLogger } from '@/utils/productionLogger';

// Mock the logger
vi.mock('@/utils/productionLogger', () => ({
  productionLogger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

// Mock the enhanced security monitor
vi.mock('../enhancedSecurityMonitor', () => ({
  enhancedSecurityMonitor: {
    startMonitoring: vi.fn().mockResolvedValue(undefined)
  }
}));

// Mock the enhanced authentication service
vi.mock('../core/enhancedAuthenticationService', () => ({
  enhancedAuthenticationService: {
    createSecureSession: vi.fn().mockResolvedValue('session-123'),
    validateSession: vi.fn().mockResolvedValue(true),
    detectSuspiciousActivity: vi.fn().mockResolvedValue(false),
    assignUserRole: vi.fn().mockResolvedValue(true)
  }
}));

describe('SecurityServiceCore', () => {
  let securityService: SecurityServiceCore;

  beforeEach(() => {
    securityService = SecurityServiceCore.getInstance();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = SecurityServiceCore.getInstance();
      const instance2 = SecurityServiceCore.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Initialization', () => {
    it('should initialize enhanced security features', async () => {
      await securityService.initialize();
      expect(productionLogger.info).toHaveBeenCalledWith('Enhanced security services initialized');
    });

    it('should handle initialization errors gracefully', async () => {
      const mockEnhancedSecurityMonitor = await import('../enhancedSecurityMonitor');
      vi.mocked(mockEnhancedSecurityMonitor.enhancedSecurityMonitor.startMonitoring)
        .mockRejectedValueOnce(new Error('Initialization failed'));

      await securityService.initialize();
      expect(productionLogger.error).toHaveBeenCalledWith(
        'Failed to initialize enhanced security',
        expect.any(Error),
        'SecurityServiceCore'
      );
    });
  });

  describe('Session Management', () => {
    it('should create secure session successfully', async () => {
      const sessionId = await securityService.createSecureSession('user-123', false);
      expect(sessionId).toBe('session-123');
    });

    it('should handle session creation errors', async () => {
      const mockEnhancedAuth = await import('../core/enhancedAuthenticationService');
      vi.mocked(mockEnhancedAuth.enhancedAuthenticationService.createSecureSession)
        .mockRejectedValueOnce(new Error('Session creation failed'));

      await expect(securityService.createSecureSession('user-123'))
        .rejects.toThrow('Session creation failed');
    });

    it('should validate session successfully', async () => {
      const isValid = await securityService.validateSession('session-123');
      expect(isValid).toBe(true);
    });

    it('should handle session validation errors gracefully', async () => {
      const mockEnhancedAuth = await import('../core/enhancedAuthenticationService');
      vi.mocked(mockEnhancedAuth.enhancedAuthenticationService.validateSession)
        .mockRejectedValueOnce(new Error('Validation failed'));

      const isValid = await securityService.validateSession('invalid-session');
      expect(isValid).toBe(false);
    });
  });

  describe('User Input Validation', () => {
    it('should validate user input', async () => {
      const result = await securityService.validateUserInput('test input', 'general');
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('sanitized');
      expect(result).toHaveProperty('threats');
      expect(result).toHaveProperty('riskLevel');
    });

    it('should sanitize input', () => {
      const sanitized = securityService.sanitizeInput('<script>alert("xss")</script>');
      expect(sanitized).not.toContain('<script>');
    });
  });

  describe('Health Status', () => {
    it('should return health status', () => {
      const status = securityService.getHealthStatus();
      expect(status).toHaveProperty('initialized');
      expect(status).toHaveProperty('services');
      expect(status.services).toHaveProperty('validation');
      expect(status.services).toHaveProperty('authentication');
      expect(status.services).toHaveProperty('monitoring');
      expect(status.services).toHaveProperty('apiSecurity');
    });
  });
});
