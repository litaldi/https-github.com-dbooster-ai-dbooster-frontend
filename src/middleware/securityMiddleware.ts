
import { consolidatedInputValidation } from '@/services/security/consolidatedInputValidation';
import { rateLimitService } from '@/services/security/rateLimitService';
import { productionLogger } from '@/utils/productionLogger';

export class SecurityMiddleware {
  static async validateRequest(request: {
    body?: any;
    headers?: Record<string, string>;
    ip?: string;
    method?: string;
    path?: string;
  }): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Rate limiting check
      const identifier = request.ip || 'unknown';
      const rateLimitResult = await rateLimitService.checkRateLimit(identifier, 'api');
      
      if (!rateLimitResult.allowed) {
        productionLogger.warn('Rate limit exceeded', { ip: identifier }, 'SecurityMiddleware');
        return { allowed: false, reason: 'Rate limit exceeded' };
      }

      // Input validation for POST/PUT requests
      if (request.body && (request.method === 'POST' || request.method === 'PUT')) {
        const validationResult = consolidatedInputValidation.validateAndSanitize(
          JSON.stringify(request.body),
          'api'
        );
        
        if (!validationResult.isValid) {
          productionLogger.warn('Invalid input detected', { 
            path: request.path,
            errors: validationResult.errors
          }, 'SecurityMiddleware');
          return { allowed: false, reason: 'Invalid input detected' };
        }
      }

      return { allowed: true };
    } catch (error) {
      productionLogger.error('Security middleware error', error, 'SecurityMiddleware');
      return { allowed: false, reason: 'Security check failed' };
    }
  }

  static sanitizeInput(input: any, context: string = 'general'): any {
    if (typeof input === 'string') {
      const result = consolidatedInputValidation.validateAndSanitize(input, context);
      return result.sanitizedValue || input;
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = SecurityMiddleware.sanitizeInput(value, context);
      }
      return sanitized;
    }
    
    return input;
  }
}
