
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ValidationService, ValidationRule } from '../core/validationService';
import { productionLogger } from '@/utils/productionLogger';

// Mock the logger
vi.mock('@/utils/productionLogger', () => ({
  productionLogger: {
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('ValidationService', () => {
  let validationService: ValidationService;

  beforeEach(() => {
    validationService = ValidationService.getInstance();
    validationService.clearCache();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ValidationService.getInstance();
      const instance2 = ValidationService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Rule Registration', () => {
    it('should register validation rules', () => {
      const rule: ValidationRule = {
        name: 'test_rule',
        priority: 50,
        validator: (value) => ({
          isValid: true,
          errors: [],
          warnings: [],
          riskLevel: 'low'
        })
      };

      validationService.registerRule('test_type', rule);
      // Rule registration is tested indirectly through validation
    });

    it('should sort rules by priority', async () => {
      const highPriorityRule: ValidationRule = {
        name: 'high_priority',
        priority: 100,
        validator: (value) => ({
          isValid: true,
          errors: [],
          warnings: [],
          riskLevel: 'low',
          sanitizedValue: 'high_priority_processed'
        })
      };

      const lowPriorityRule: ValidationRule = {
        name: 'low_priority',
        priority: 10,
        validator: (value) => ({
          isValid: true,
          errors: [],
          warnings: [],
          riskLevel: 'low',
          sanitizedValue: 'low_priority_processed'
        })
      };

      validationService.registerRule('priority_test', lowPriorityRule);
      validationService.registerRule('priority_test', highPriorityRule);

      const result = await validationService.validate('priority_test', 'test');
      expect(result.sanitizedValue).toBe('low_priority_processed'); // Last rule processed wins
    });
  });

  describe('Input Validation', () => {
    it('should validate string input successfully', async () => {
      const result = await validationService.validateUserInput('valid input', 'general');
      
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('valid input');
      expect(result.threats).toEqual([]);
      expect(result.riskLevel).toBe('low');
    });

    it('should sanitize harmful input', async () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const result = await validationService.validateUserInput(maliciousInput, 'general');
      
      expect(result.sanitized).not.toContain('<script>');
    });

    it('should handle non-string input', async () => {
      const result = await validationService.validateUserInput(123 as any, 'general');
      
      expect(result.valid).toBe(false);
      expect(result.threats).toContain('Input must be a string');
    });

    it('should validate UUID format', async () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const result = await validationService.validate('repository_id', validUuid);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject invalid UUID format', async () => {
      const invalidUuid = 'not-a-uuid';
      const result = await validationService.validate('repository_id', invalidUuid);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid UUID format');
    });
  });

  describe('Form Data Validation', () => {
    it('should validate form data successfully', async () => {
      const formData = {
        username: 'testuser',
        email: 'test@example.com',
        age: 25
      };

      const result = await validationService.validateFormData(formData, 'registration');
      
      expect(result.valid).toBe(true);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
      expect(result.sanitized).toHaveProperty('username');
      expect(result.sanitized).toHaveProperty('email');
      expect(result.sanitized).toHaveProperty('age');
    });

    it('should handle mixed data types in form', async () => {
      const formData = {
        text: 'some text',
        number: 42,
        boolean: true,
        object: { nested: 'value' }
      };

      const result = await validationService.validateFormData(formData, 'mixed');
      
      expect(result.sanitized.text).toBe('some text');
      expect(result.sanitized.number).toBe(42);
      expect(result.sanitized.boolean).toBe(true);
      expect(result.sanitized.object).toEqual({ nested: 'value' });
    });
  });

  describe('Caching', () => {
    it('should cache validation results', async () => {
      const testValue = 'cache_test';
      
      // First call
      const result1 = await validationService.validate('user_input', testValue);
      
      // Second call should use cache
      const result2 = await validationService.validate('user_input', testValue);
      
      expect(result1).toEqual(result2);
    });

    it('should clear cache when rules change', async () => {
      const testValue = 'rule_change_test';
      
      await validationService.validate('cache_clear_test', testValue);
      
      // Register new rule
      const newRule: ValidationRule = {
        name: 'new_rule',
        priority: 50,
        validator: () => ({
          isValid: false,
          errors: ['New rule error'],
          warnings: [],
          riskLevel: 'high'
        })
      };
      
      validationService.registerRule('cache_clear_test', newRule);
      
      const result = await validationService.validate('cache_clear_test', testValue);
      expect(result.errors).toContain('New rule error');
    });
  });

  describe('Error Handling', () => {
    it('should handle rule execution errors gracefully', async () => {
      const faultyRule: ValidationRule = {
        name: 'faulty_rule',
        priority: 50,
        validator: () => {
          throw new Error('Rule execution failed');
        }
      };

      validationService.registerRule('error_test', faultyRule);
      
      const result = await validationService.validate('error_test', 'test');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Validation error in rule: faulty_rule');
      expect(result.riskLevel).toBe('high');
      expect(productionLogger.error).toHaveBeenCalled();
    });

    it('should provide default validation when no rules exist', async () => {
      const result = await validationService.validate('nonexistent_type', 'test');
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('No validation rules applied');
      expect(productionLogger.warn).toHaveBeenCalled();
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize common XSS patterns', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        'data:text/html,<script>alert("xss")</script>',
        '"onclick="alert(\'xss\')"'
      ];

      maliciousInputs.forEach(input => {
        const sanitized = validationService.sanitizeInput(input);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('data:');
        expect(sanitized).not.toContain('"');
      });
    });

    it('should limit input length', () => {
      const longInput = 'a'.repeat(20000);
      const sanitized = validationService.sanitizeInput(longInput);
      expect(sanitized.length).toBeLessThanOrEqual(10000);
    });
  });
});
