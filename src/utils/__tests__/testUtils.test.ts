
import { describe, it, expect } from 'vitest';
import { 
  mockSecurityData, 
  createMockSecurityService, 
  createMockThreatDetection,
  securityTestHelpers 
} from '../testUtils';

describe('Test Utils', () => {
  describe('Mock Security Data', () => {
    it('should provide valid audit report structure', () => {
      const { auditReport } = mockSecurityData;
      
      expect(auditReport).toHaveProperty('totalEvents');
      expect(auditReport).toHaveProperty('threatsDetected');
      expect(auditReport).toHaveProperty('blockedIPs');
      expect(auditReport).toHaveProperty('suspiciousPatterns');
      expect(auditReport).toHaveProperty('recentHighRiskEvents');
      
      expect(typeof auditReport.totalEvents).toBe('number');
      expect(Array.isArray(auditReport.suspiciousPatterns)).toBe(true);
      expect(Array.isArray(auditReport.recentHighRiskEvents)).toBe(true);
    });

    it('should provide valid performance metrics structure', () => {
      const { performanceMetrics } = mockSecurityData;
      
      expect(performanceMetrics).toHaveProperty('averageResponseTime');
      expect(performanceMetrics).toHaveProperty('requestsPerMinute');
      expect(performanceMetrics).toHaveProperty('validationLatency');
      expect(performanceMetrics).toHaveProperty('memoryUsage');
      
      expect(typeof performanceMetrics.averageResponseTime).toBe('number');
      expect(typeof performanceMetrics.memoryUsage).toBe('number');
      expect(performanceMetrics.memoryUsage).toBeGreaterThan(0);
      expect(performanceMetrics.memoryUsage).toBeLessThanOrEqual(1);
    });

    it('should provide valid pattern update history', () => {
      const { patternUpdateHistory } = mockSecurityData;
      
      expect(Array.isArray(patternUpdateHistory)).toBe(true);
      expect(patternUpdateHistory.length).toBeGreaterThan(0);
      
      patternUpdateHistory.forEach(update => {
        expect(update).toHaveProperty('timestamp');
        expect(update).toHaveProperty('patterns');
        expect(update).toHaveProperty('updateSource');
        expect(Array.isArray(update.patterns)).toBe(true);
      });
    });
  });

  describe('Mock Security Service', () => {
    it('should create a mock security service with correct methods', () => {
      const mockService = createMockSecurityService();
      
      expect(mockService).toHaveProperty('validateUserInput');
      expect(mockService).toHaveProperty('validateFormData');
      expect(mockService).toHaveProperty('checkRateLimit');
      expect(mockService).toHaveProperty('logSecurityEvent');
      expect(mockService).toHaveProperty('getSecurityDashboard');
      expect(mockService).toHaveProperty('detectSuspiciousActivity');
      
      expect(typeof mockService.validateUserInput).toBe('function');
      expect(typeof mockService.checkRateLimit).toBe('function');
    });

    it('should return appropriate mock responses', async () => {
      const mockService = createMockSecurityService();
      
      const validationResult = await mockService.validateUserInput('test input');
      expect(validationResult).toHaveProperty('valid', true);
      expect(validationResult).toHaveProperty('sanitized');
      expect(validationResult).toHaveProperty('threats');
      
      const rateLimitResult = await mockService.checkRateLimit('test-id', 'test-action');
      expect(rateLimitResult).toHaveProperty('allowed', true);
    });
  });

  describe('Mock Threat Detection', () => {
    it('should create a mock threat detection service', () => {
      const mockThreatDetection = createMockThreatDetection();
      
      expect(mockThreatDetection).toHaveProperty('detectThreats');
      expect(mockThreatDetection).toHaveProperty('analyzeBehaviorPatterns');
      expect(mockThreatDetection).toHaveProperty('updateThreatPatterns');
    });

    it('should return appropriate threat detection responses', async () => {
      const mockThreatDetection = createMockThreatDetection();
      
      const threatResult = await mockThreatDetection.detectThreats('test input');
      expect(threatResult).toHaveProperty('isThreat', false);
      expect(threatResult).toHaveProperty('confidence');
      expect(typeof threatResult.confidence).toBe('number');
    });
  });

  describe('Security Test Helpers', () => {
    describe('createSecurityContext', () => {
      it('should create default security context', () => {
        const context = securityTestHelpers.createSecurityContext();
        
        expect(context).toEqual({
          isInitialized: true,
          isProcessing: false,
          error: null
        });
      });

      it('should accept overrides', () => {
        const context = securityTestHelpers.createSecurityContext({
          isProcessing: true,
          error: 'Test error'
        });
        
        expect(context.isInitialized).toBe(true);
        expect(context.isProcessing).toBe(true);
        expect(context.error).toBe('Test error');
      });
    });

    describe('generateSecurityEvent', () => {
      it('should generate valid security event', () => {
        const event = securityTestHelpers.generateSecurityEvent();
        
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('event_type', 'test_event');
        expect(event).toHaveProperty('user_id', 'test_user');
        expect(event).toHaveProperty('ip_address', '127.0.0.1');
        expect(event).toHaveProperty('created_at');
        expect(event).toHaveProperty('event_data');
        
        expect(typeof event.id).toBe('string');
        expect(event.id.length).toBeGreaterThan(5);
      });

      it('should accept overrides', () => {
        const event = securityTestHelpers.generateSecurityEvent({
          event_type: 'custom_event',
          user_id: 'custom_user'
        });
        
        expect(event.event_type).toBe('custom_event');
        expect(event.user_id).toBe('custom_user');
        expect(event.ip_address).toBe('127.0.0.1'); // default maintained
      });
    });

    describe('createValidationResult', () => {
      it('should create valid validation result by default', () => {
        const result = securityTestHelpers.createValidationResult();
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
        expect(result.riskLevel).toBe('low');
      });

      it('should create invalid validation result when specified', () => {
        const result = securityTestHelpers.createValidationResult(false);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Test validation error');
        expect(result.riskLevel).toBe('medium');
      });

      it('should accept custom overrides', () => {
        const result = securityTestHelpers.createValidationResult(true, {
          riskLevel: 'high',
          warnings: ['Custom warning']
        });
        
        expect(result.isValid).toBe(true);
        expect(result.riskLevel).toBe('high');
        expect(result.warnings).toContain('Custom warning');
      });
    });

    describe('createMockSession', () => {
      it('should create valid mock session', () => {
        const session = securityTestHelpers.createMockSession();
        
        expect(session).toHaveProperty('session_id');
        expect(session).toHaveProperty('user_id');
        expect(session).toHaveProperty('ip_address');
        expect(session).toHaveProperty('security_score');
        expect(session).toHaveProperty('expires_at');
        expect(session).toHaveProperty('status', 'active');
        
        expect(typeof session.security_score).toBe('number');
        expect(session.security_score).toBeGreaterThan(0);
        expect(session.security_score).toBeLessThanOrEqual(100);
      });

      it('should accept overrides', () => {
        const session = securityTestHelpers.createMockSession({
          status: 'expired',
          security_score: 50
        });
        
        expect(session.status).toBe('expired');
        expect(session.security_score).toBe(50);
      });
    });

    describe('waitForAsync', () => {
      it('should return a promise that resolves', async () => {
        const start = Date.now();
        await securityTestHelpers.waitForAsync();
        const end = Date.now();
        
        // Should complete quickly but not synchronously
        expect(end - start).toBeGreaterThanOrEqual(0);
        expect(end - start).toBeLessThan(100);
      });
    });
  });
});
