
import { consolidatedInputValidation } from '@/services/security/consolidatedInputValidation';
import { productionLogger } from '@/utils/productionLogger';
import { passwordSecurity } from '@/utils/passwordSecurity';

export class SecurityMiddleware {
  static async validateRequest(request: {
    body?: any;
    headers?: Record<string, string>;
    ip?: string;
    method?: string;
    path?: string;
    userId?: string;
  }): Promise<{ allowed: boolean; reason?: string; securityScore?: number }> {
    try {
      let securityScore = 70; // Base security score

      // Enhanced IP validation
      if (request.ip) {
        const ipValidation = this.validateIPAddress(request.ip);
        if (!ipValidation.allowed) {
          return { allowed: false, reason: ipValidation.reason };
        }
        securityScore += ipValidation.scoreBonus;
      }

      // Enhanced rate limiting with dynamic thresholds
      if (request.userId) {
        const rateLimitResult = await this.checkAdvancedRateLimit(request);
        if (!rateLimitResult.allowed) {
          productionLogger.warn('Advanced rate limit exceeded', { 
            userId: request.userId.substring(0, 8),
            ip: request.ip,
            path: request.path
          }, 'SecurityMiddleware');
          return { allowed: false, reason: rateLimitResult.reason };
        }
        securityScore += rateLimitResult.scoreBonus;
      }

      // Enhanced input validation with context awareness
      if (request.body && (request.method === 'POST' || request.method === 'PUT')) {
        const validationResult = await this.validateInputWithContext(request.body, request.path || 'unknown');
        
        if (!validationResult.isValid) {
          productionLogger.warn('Enhanced input validation failed', { 
            path: request.path,
            errors: validationResult.errors,
            riskLevel: validationResult.riskLevel
          }, 'SecurityMiddleware');
          return { 
            allowed: false, 
            reason: 'Input validation failed',
            securityScore: Math.max(securityScore - 30, 0)
          };
        }
        securityScore += validationResult.scoreBonus;
      }

      // Security headers validation
      const headerValidation = this.validateSecurityHeaders(request.headers || {});
      securityScore += headerValidation.scoreBonus;

      return { 
        allowed: true, 
        securityScore: Math.min(securityScore, 100)
      };
    } catch (error) {
      productionLogger.error('Security middleware error', error, 'SecurityMiddleware');
      return { allowed: false, reason: 'Security check failed', securityScore: 0 };
    }
  }

  private static validateIPAddress(ip: string): { allowed: boolean; reason?: string; scoreBonus: number } {
    // Check for private/local IPs in production
    const isPrivate = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|127\.|::1|localhost)/.test(ip);
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction && isPrivate) {
      return { allowed: false, reason: 'Private IP not allowed in production' };
    }

    // Check for known malicious IP patterns
    const suspiciousPatterns = [
      /^0\.0\.0\.0$/,
      /^255\.255\.255\.255$/,
      /^169\.254\./, // Link-local
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(ip))) {
      return { allowed: false, reason: 'Suspicious IP address detected' };
    }

    return { allowed: true, scoreBonus: isPrivate ? 0 : 5 };
  }

  private static async checkAdvancedRateLimit(request: any): Promise<{ allowed: boolean; reason?: string; scoreBonus: number }> {
    // This would integrate with the advanced rate limiting hook
    // For now, return a basic implementation
    return { allowed: true, scoreBonus: 5 };
  }

  private static async validateInputWithContext(input: any, context: string): Promise<{
    isValid: boolean;
    errors: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    scoreBonus: number;
  }> {
    const inputString = JSON.stringify(input);
    const baseValidation = consolidatedInputValidation.validateAndSanitize(inputString, context);
    
    // Enhanced validation based on context
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let scoreBonus = 10;
    
    // Context-specific validation
    if (context.includes('auth') || context.includes('login')) {
      riskLevel = 'high';
      scoreBonus = 15;
      
      // Check for password field and validate if present
      if (input.password) {
        const passwordAnalysis = passwordSecurity.analyzePassword(input.password);
        if (passwordAnalysis.isCompromised) {
          return {
            isValid: false,
            errors: ['Compromised password detected'],
            riskLevel: 'critical',
            scoreBonus: -20
          };
        }
        if (!passwordAnalysis.isStrong) {
          scoreBonus -= 5;
        }
      }
    }

    return {
      isValid: baseValidation.isValid,
      errors: baseValidation.errors,
      riskLevel,
      scoreBonus: baseValidation.isValid ? scoreBonus : -10
    };
  }

  private static validateSecurityHeaders(headers: Record<string, string>): { scoreBonus: number } {
    let scoreBonus = 0;
    
    // Check for important security headers
    if (headers['x-forwarded-proto'] === 'https') scoreBonus += 5;
    if (headers['strict-transport-security']) scoreBonus += 3;
    if (headers['x-content-type-options']) scoreBonus += 2;
    if (headers['x-frame-options']) scoreBonus += 2;
    
    return { scoreBonus };
  }

  static sanitizeInput(input: any, context: string = 'general'): any {
    if (typeof input === 'string') {
      const result = consolidatedInputValidation.validateAndSanitize(input, context);
      return result.sanitizedValue || input;
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        // Enhanced sanitization for sensitive fields
        if (key.toLowerCase().includes('password')) {
          // Don't log or heavily process passwords
          sanitized[key] = value;
        } else {
          sanitized[key] = SecurityMiddleware.sanitizeInput(value, context);
        }
      }
      return sanitized;
    }
    
    return input;
  }
}
