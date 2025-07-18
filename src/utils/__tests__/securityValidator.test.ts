
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SecurityValidator, securityValidator } from '../securityValidator';
import { productionLogger } from '../productionLogger';

vi.mock('../productionLogger', () => ({
  productionLogger: {
    warn: vi.fn(),
    info: vi.fn()
  }
}));

describe('SecurityValidator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = SecurityValidator.getInstance();
      const instance2 = SecurityValidator.getInstance();
      expect(instance1).toBe(instance2);
      expect(instance1).toBe(securityValidator);
    });
  });

  describe('Console Statement Detection', () => {
    it('should detect console statements in production code', () => {
      const code = `
        function test() {
          console.log('debug message');
          console.error('error message');
          return true;
        }
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/components/MyComponent.tsx');
      
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Console statements detected in production code');
      expect(result.riskLevel).toBe('medium');
    });

    it('should allow console statements in test files', () => {
      const code = `
        describe('test', () => {
          console.log('test debug');
        });
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/components/__tests__/MyComponent.test.tsx');
      
      expect(result.isValid).toBe(true);
      expect(result.violations).not.toContain('Console statements detected in production code');
    });

    it('should allow console statements in productionLogger file', () => {
      const code = `
        export const productionLogger = {
          log: (msg) => console.log(msg)
        };
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/utils/productionLogger.ts');
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('Hardcoded Secrets Detection', () => {
    it('should detect OpenAI API keys', () => {
      const code = `
        const apiKey = 'sk-1234567890abcdef1234567890abcdef';
        fetch('https://api.openai.com', {
          headers: { Authorization: \`Bearer \${apiKey}\` }
        });
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/services/api.ts');
      
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Potential hardcoded secrets detected');
      expect(result.riskLevel).toBe('high');
    });

    it('should detect GitHub personal access tokens', () => {
      const code = `
        const token = 'ghp_1234567890abcdef1234567890abcdef123456';
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/services/github.ts');
      
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Potential hardcoded secrets detected');
    });

    it('should detect password/secret assignments', () => {
      const code = `
        const password = "mySecretPassword123";
        const apiSecret = 'very-secret-key-here';
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/config.ts');
      
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Potential hardcoded secrets detected');
    });
  });

  describe('Unsafe Eval Detection', () => {
    it('should detect eval usage', () => {
      const code = `
        const result = eval('2 + 2');
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/utils/calc.ts');
      
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Unsafe eval() usage detected');
      expect(result.riskLevel).toBe('high');
    });

    it('should detect Function constructor usage', () => {
      const code = `
        const fn = new Function('return 42');
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/utils/dynamic.ts');
      
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Unsafe eval() usage detected');
    });

    it('should detect setTimeout with string', () => {
      const code = `
        setTimeout('alert("xss")', 1000);
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/utils/timer.ts');
      
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Unsafe eval() usage detected');
    });
  });

  describe('SQL Injection Pattern Detection', () => {
    it('should detect template literal SQL injection patterns', () => {
      const code = `
        const query = \`SELECT * FROM users WHERE id = \${userId}\`;
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/db/queries.ts');
      
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Potential SQL injection patterns detected');
      expect(result.riskLevel).toBe('high');
    });

    it('should detect string concatenation SQL patterns', () => {
      const code = `
        const query = "SELECT * FROM users WHERE name = '" + userName + "'";
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/db/users.ts');
      
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Potential SQL injection patterns detected');
    });
  });

  describe('Safe Code', () => {
    it('should validate safe code', () => {
      const code = `
        import React from 'react';
        
        export function SafeComponent() {
          const [count, setCount] = useState(0);
          
          const handleClick = () => {
            setCount(count + 1);
          };
          
          return (
            <button onClick={handleClick}>
              Count: {count}
            </button>
          );
        }
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'src/components/SafeComponent.tsx');
      
      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
      expect(result.riskLevel).toBe('low');
    });
  });

  describe('Project Scanning', () => {
    it('should scan multiple files and provide summary', () => {
      const files = [
        {
          path: 'src/components/Safe.tsx',
          content: 'export function Safe() { return <div>Safe</div>; }'
        },
        {
          path: 'src/utils/Debug.ts',
          content: 'console.log("debug"); const secret = "sk-123456789";'
        },
        {
          path: 'src/db/Unsafe.ts',
          content: 'const query = `SELECT * FROM users WHERE id = ${id}`;'
        }
      ];
      
      const result = securityValidator.scanProject(files);
      
      expect(result.totalFiles).toBe(3);
      expect(result.violations).toHaveLength(2);
      expect(result.summary.high).toBe(2);
      expect(result.summary.medium).toBe(0);
      expect(result.summary.low).toBe(0);
      
      expect(productionLogger.info).toHaveBeenCalledWith(
        'Security scan completed',
        expect.objectContaining({
          totalFiles: 3,
          violationsFound: 2
        }),
        'SecurityValidator'
      );
    });

    it('should handle files with no violations', () => {
      const files = [
        {
          path: 'src/components/Clean1.tsx',
          content: 'export function Clean1() { return <div>Clean</div>; }'
        },
        {
          path: 'src/components/Clean2.tsx',
          content: 'export function Clean2() { return <div>Clean</div>; }'
        }
      ];
      
      const result = securityValidator.scanProject(files);
      
      expect(result.totalFiles).toBe(2);
      expect(result.violations).toHaveLength(0);
      expect(result.summary.low).toBe(0);
      expect(result.summary.medium).toBe(0);
      expect(result.summary.high).toBe(0);
    });
  });

  describe('Risk Level Calculation', () => {
    it('should assign correct risk levels for different violations', () => {
      const testCases = [
        {
          code: 'console.log("debug");',
          expectedRiskLevel: 'medium'
        },
        {
          code: 'const secret = "sk-123456789";',
          expectedRiskLevel: 'high'
        },
        {
          code: 'eval("2 + 2");',
          expectedRiskLevel: 'high'
        },
        {
          code: 'const query = `SELECT * FROM users WHERE id = ${id}`;',
          expectedRiskLevel: 'high'
        }
      ];
      
      testCases.forEach(({ code, expectedRiskLevel }) => {
        const result = securityValidator.validateCodeSecurity(code, 'test.ts');
        expect(result.riskLevel).toBe(expectedRiskLevel);
      });
    });

    it('should prioritize highest risk level when multiple violations exist', () => {
      const code = `
        console.log("debug"); // medium risk
        const secret = "sk-123456789"; // high risk
      `;
      
      const result = securityValidator.validateCodeSecurity(code, 'mixed.ts');
      
      expect(result.riskLevel).toBe('high');
      expect(result.violations).toHaveLength(2);
    });
  });
});
