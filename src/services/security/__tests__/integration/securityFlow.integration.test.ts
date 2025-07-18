
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SecurityService } from '../../securityService';
import { productionLogger } from '@/utils/productionLogger';

// Mock external dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null })
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({ data: [{ id: '1' }] })
      }))
    }))
  }
}));

vi.mock('@/utils/productionLogger', () => ({
  productionLogger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    secureInfo: vi.fn(),
    secureWarn: vi.fn()
  }
}));

describe('Security Service Integration', () => {
  let securityService: SecurityService;

  beforeEach(() => {
    securityService = SecurityService.getInstance();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Complete Security Workflow', () => {
    it('should handle a complete security validation workflow', async () => {
      // Step 1: Validate user input
      const userInput = 'normal user input';
      const validationResult = await securityService.validateUserInput(userInput, 'general');
      
      expect(validationResult.valid).toBe(true);
      expect(validationResult.sanitized).toBe(userInput);
      expect(validationResult.threats).toHaveLength(0);
      
      // Step 2: Check rate limits
      const rateLimitResult = await securityService.checkRateLimit('user-123', 'api_call');
      expect(rateLimitResult).toBeDefined();
      
      // Step 3: Log security event
      await securityService.logSecurityEvent({
        type: 'user_action',
        userId: 'user-123',
        action: 'data_access',
        timestamp: Date.now()
      });
      
      // Step 4: Get security dashboard
      const dashboard = await securityService.getSecurityDashboard('user-123');
      expect(dashboard).toHaveProperty('userId');
      expect(dashboard).toHaveProperty('securityLevel');
    });

    it('should handle malicious input detection and blocking', async () => {
      // Test SQL injection attempt
      const maliciousInput = "'; DROP TABLE users; --";
      const validationResult = await securityService.validateUserInput(maliciousInput, 'form_field');
      
      expect(validationResult.valid).toBe(false);
      expect(validationResult.threats.length).toBeGreaterThan(0);
      expect(validationResult.riskLevel).not.toBe('low');
      
      // Verify sanitization
      expect(validationResult.sanitized).not.toContain('DROP TABLE');
    });

    it('should handle form data validation comprehensively', async () => {
      const formData = {
        username: 'testuser',
        email: 'test@example.com',
        bio: '<script>alert("xss")</script>',
        age: 25
      };
      
      const result = await securityService.validateFormData(formData, 'user_profile');
      
      expect(result.valid).toBe(true); // Overall form might still be valid after sanitization
      expect(result.sanitized.bio).not.toContain('<script>');
      expect(result.sanitized.username).toBe('testuser');
      expect(result.sanitized.age).toBe(25);
    });

    it('should handle API security requests', async () => {
      // Mock fetch for secure API request
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      });
      
      const result = await securityService.makeSecureApiRequest('https://api.example.com/data');
      expect(result).toEqual({ data: 'test' });
      
      // Test GitHub API request
      const githubResult = await securityService.makeSecureGitHubRequest('/user/repos');
      expect(githubResult).toEqual({ data: 'test' });
    });

    it('should handle permission checks', async () => {
      const hasPermission = await securityService.checkPermission('user-123', 'read_data');
      expect(typeof hasPermission).toBe('boolean');
      
      // This should not throw if user doesn't have permission
      try {
        await securityService.requirePermission('user-123', 'admin_access');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle repository access validation', async () => {
      const accessResult = await securityService.validateRepositoryAccess(
        '123e4567-e89b-12d3-a456-426614174000',
        'read',
        'user-123'
      );
      
      expect(accessResult).toHaveProperty('allowed');
      expect(typeof accessResult.allowed).toBe('boolean');
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should gracefully handle service failures', async () => {
      // Mock a service failure
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      // This should not throw but handle the error gracefully
      const result = await securityService.validateUserInput(null as any, 'test');
      expect(result).toBeDefined();
      expect(result.valid).toBe(false);
      
      console.error = originalConsoleError;
    });

    it('should handle network failures in API requests', async () => {
      // Mock network failure
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      await expect(
        securityService.makeSecureApiRequest('https://api.example.com/data')
      ).rejects.toThrow();
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle multiple concurrent validations', async () => {
      const inputs = Array.from({ length: 10 }, (_, i) => `input-${i}`);
      
      const startTime = Date.now();
      const results = await Promise.all(
        inputs.map(input => securityService.validateUserInput(input, 'concurrent_test'))
      );
      const endTime = Date.now();
      
      expect(results).toHaveLength(10);
      expect(results.every(r => r.valid)).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
    });

    it('should handle large input efficiently', async () => {
      const largeInput = 'a'.repeat(5000);
      
      const startTime = Date.now();
      const result = await securityService.validateUserInput(largeInput, 'large_input');
      const endTime = Date.now();
      
      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(500); // Should process quickly
    });
  });

  describe('Security Monitoring Integration', () => {
    it('should integrate with monitoring systems', async () => {
      const summary = await securityService.getEnhancedSecuritySummary();
      
      expect(summary).toHaveProperty('totalEvents');
      expect(summary).toHaveProperty('threatsDetected');
      expect(summary).toHaveProperty('blockedIPs');
      expect(summary).toHaveProperty('recentHighRiskEvents');
      expect(Array.isArray(summary.recentHighRiskEvents)).toBe(true);
    });

    it('should log auth events properly', async () => {
      await securityService.logAuthEvent('login_attempt', true, {
        userId: 'user-123',
        ip: '192.168.1.1'
      });
      
      expect(productionLogger.secureInfo).toHaveBeenCalledWith(
        'Auth event',
        expect.objectContaining({
          eventType: 'login_attempt',
          success: true
        }),
        'MonitoringService'
      );
    });

    it('should detect suspicious activity', async () => {
      const suspicious = await securityService.detectSuspiciousActivity('user-123');
      
      expect(typeof suspicious).toBe('object');
      expect(suspicious).toHaveProperty('suspicious');
      expect(suspicious).toHaveProperty('riskLevel');
    });
  });
});
