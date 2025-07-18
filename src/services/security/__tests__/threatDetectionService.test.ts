
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThreatDetectionService } from '../../threatDetectionService';
import { productionLogger } from '@/utils/productionLogger';

// Mock the logger
vi.mock('@/utils/productionLogger', () => ({
  productionLogger: {
    error: vi.fn()
  }
}));

describe('ThreatDetectionService', () => {
  let threatDetectionService: ThreatDetectionService;

  beforeEach(() => {
    threatDetectionService = ThreatDetectionService.getInstance();
    vi.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ThreatDetectionService.getInstance();
      const instance2 = ThreatDetectionService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('SQL Injection Detection', () => {
    it('should detect SQL injection attempts', async () => {
      const sqlInjectionInputs = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "UNION SELECT * FROM passwords",
        "admin'--",
        "1; DELETE FROM users WHERE 1=1"
      ];

      for (const input of sqlInjectionInputs) {
        const result = await threatDetectionService.detectThreats(input);
        expect(result.isThreat).toBe(true);
        expect(result.threatType).toBe('sql_injection');
        expect(result.confidence).toBeGreaterThan(0.5);
      }
    });

    it('should not flag safe SQL-like content', async () => {
      const safeInputs = [
        "SELECT your favorite color",
        "I like to delete old files",
        "The union of two sets",
        "Please update your profile"
      ];

      for (const input of safeInputs) {
        const result = await threatDetectionService.detectThreats(input);
        expect(result.isThreat).toBe(false);
      }
    });
  });

  describe('XSS Detection', () => {
    it('should detect XSS attempts', async () => {
      const xssInputs = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert("xss")',
        '<iframe src="javascript:alert(1)"></iframe>'
      ];

      for (const input of xssInputs) {
        const result = await threatDetectionService.detectThreats(input);
        expect(result.isThreat).toBe(true);
        expect(result.threatType).toBe('xss');
        expect(result.confidence).toBeGreaterThan(0.5);
      }
    });

    it('should not flag safe HTML-like content', async () => {
      const safeInputs = [
        "I love JavaScript programming",
        "Check out this script for automation",
        "The image source is broken",
        "Use proper onclick handlers"
      ];

      for (const input of safeInputs) {
        const result = await threatDetectionService.detectThreats(input);
        expect(result.isThreat).toBe(false);
      }
    });
  });

  describe('Safe Content', () => {
    it('should not detect threats in normal content', async () => {
      const safeInputs = [
        "Hello, world!",
        "This is a normal message",
        "12345",
        "user@example.com",
        "https://example.com"
      ];

      for (const input of safeInputs) {
        const result = await threatDetectionService.detectThreats(input);
        expect(result.isThreat).toBe(false);
        expect(result.confidence).toBeLessThan(0.3);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', async () => {
      // Mock console.error to avoid noise in tests
      const originalConsoleError = console.error;
      console.error = vi.fn();

      // This should not throw, but instead log an error and return safe defaults
      const result = await threatDetectionService.detectThreats(null as any);
      
      expect(result.isThreat).toBe(false);
      expect(result.confidence).toBe(0);

      console.error = originalConsoleError;
    });
  });

  describe('Context Awareness', () => {
    it('should consider context in threat detection', async () => {
      const input = "SELECT * FROM users";
      
      // Should be more suspicious in user input context
      const userContext = await threatDetectionService.detectThreats(input, { type: 'user_input' });
      
      // Should be less suspicious in code documentation context
      const docContext = await threatDetectionService.detectThreats(input, { type: 'documentation' });
      
      // Both should detect the pattern, but confidence may vary based on implementation
      expect(userContext.isThreat).toBe(true);
      expect(docContext.isThreat).toBe(true);
    });
  });
});
