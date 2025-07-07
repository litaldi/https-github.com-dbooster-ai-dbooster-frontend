
import { productionLogger } from './productionLogger';

interface SecurityValidationResult {
  isValid: boolean;
  violations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export class SecurityValidator {
  private static instance: SecurityValidator;

  static getInstance(): SecurityValidator {
    if (!SecurityValidator.instance) {
      SecurityValidator.instance = new SecurityValidator();
    }
    return SecurityValidator.instance;
  }

  validateCodeSecurity(content: string, filename: string): SecurityValidationResult {
    const violations: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Check for console statements in production code
    if (this.hasConsoleStatements(content, filename)) {
      violations.push('Console statements detected in production code');
      riskLevel = 'medium';
    }

    // Check for hardcoded secrets
    if (this.hasHardcodedSecrets(content)) {
      violations.push('Potential hardcoded secrets detected');
      riskLevel = 'high';
    }

    // Check for unsafe eval usage
    if (this.hasUnsafeEval(content)) {
      violations.push('Unsafe eval() usage detected');
      riskLevel = 'high';
    }

    // Check for SQL injection patterns
    if (this.hasSQLInjectionPatterns(content)) {
      violations.push('Potential SQL injection patterns detected');
      riskLevel = 'high';
    }

    return {
      isValid: violations.length === 0,
      violations,
      riskLevel
    };
  }

  private hasConsoleStatements(content: string, filename: string): boolean {
    // Allow console statements in development utilities and test files
    if (filename.includes('test') || 
        filename.includes('spec') || 
        filename.includes('productionConsole') ||
        filename.includes('productionLogger')) {
      return false;
    }

    const consolePattern = /console\.(log|debug|info|warn|error|trace)/g;
    const matches = content.match(consolePattern);
    
    if (matches) {
      productionLogger.warn('Console statements found in production code', {
        filename,
        matches: matches.length
      }, 'SecurityValidator');
      return true;
    }
    
    return false;
  }

  private hasHardcodedSecrets(content: string): boolean {
    const secretPatterns = [
      /sk-[a-zA-Z0-9]{32,}/g, // OpenAI API keys
      /ghp_[a-zA-Z0-9]{36}/g, // GitHub personal access tokens
      /ya29\.[a-zA-Z0-9_-]+/g, // Google OAuth tokens
      /[a-zA-Z0-9]{32,}\.[a-zA-Z0-9]{6,}/g, // JWT-like tokens
      /(password|secret|key|token)[\s]*[=:]\s*["'][a-zA-Z0-9]{8,}["']/gi
    ];

    return secretPatterns.some(pattern => pattern.test(content));
  }

  private hasUnsafeEval(content: string): boolean {
    const evalPatterns = [
      /eval\s*\(/g,
      /Function\s*\(/g,
      /setTimeout\s*\(\s*["']/g,
      /setInterval\s*\(\s*["']/g
    ];

    return evalPatterns.some(pattern => pattern.test(content));
  }

  private hasSQLInjectionPatterns(content: string): boolean {
    const sqlPatterns = [
      /\$\{[^}]*\}.*(?:SELECT|INSERT|UPDATE|DELETE)/gi,
      /["']\s*\+\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\+\s*["'].*(?:SELECT|INSERT|UPDATE|DELETE)/gi,
      /query\s*\(\s*["'][^"']*["']\s*\+/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(content));
  }

  scanProject(files: Array<{ path: string; content: string }>): {
    totalFiles: number;
    violations: Array<{ file: string; issues: string[]; riskLevel: string }>;
    summary: { low: number; medium: number; high: number };
  } {
    const violations: Array<{ file: string; issues: string[]; riskLevel: string }> = [];
    const summary = { low: 0, medium: 0, high: 0 };

    files.forEach(file => {
      const result = this.validateCodeSecurity(file.content, file.path);
      if (!result.isValid) {
        violations.push({
          file: file.path,
          issues: result.violations,
          riskLevel: result.riskLevel
        });
        summary[result.riskLevel]++;
      }
    });

    productionLogger.info('Security scan completed', {
      totalFiles: files.length,
      violationsFound: violations.length,
      summary
    }, 'SecurityValidator');

    return {
      totalFiles: files.length,
      violations,
      summary
    };
  }
}

export const securityValidator = SecurityValidator.getInstance();
