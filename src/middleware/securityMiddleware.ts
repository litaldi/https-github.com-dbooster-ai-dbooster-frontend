
import { securityService } from '@/services/securityService';
import { enhancedRateLimiter } from '@/utils/enhancedRateLimiting';
import { logger } from '@/utils/logger';

export interface SecurityMiddlewareOptions {
  rateLimitAction?: string;
  validateInput?: boolean;
  logEvents?: boolean;
}

export class SecurityMiddleware {
  static async apply(
    request: any,
    options: SecurityMiddlewareOptions = {}
  ): Promise<{ allowed: boolean; error?: string }> {
    const {
      rateLimitAction = 'api_call',
      validateInput = true,
      logEvents = true
    } = options;

    try {
      // Rate limiting
      const rateLimitCheck = await enhancedRateLimiter.checkRateLimit(rateLimitAction);
      if (!rateLimitCheck.allowed) {
        if (logEvents) {
          await securityService.logSecurityEvent({
            event_type: 'middleware_rate_limit_block',
            event_data: { action: rateLimitAction, retryAfter: rateLimitCheck.retryAfter }
          });
        }
        return { 
          allowed: false, 
          error: `Rate limit exceeded. Try again in ${rateLimitCheck.retryAfter} seconds.` 
        };
      }

      // Input validation
      if (validateInput && request.body) {
        const validationErrors: string[] = [];
        
        for (const [key, value] of Object.entries(request.body)) {
          if (typeof value === 'string') {
            const sanitized = securityService.sanitizeInput(value);
            if (sanitized !== value) {
              validationErrors.push(`Field '${key}' contains potentially harmful content`);
            }
          }
        }

        if (validationErrors.length > 0) {
          if (logEvents) {
            await securityService.logSecurityEvent({
              event_type: 'middleware_validation_failure',
              event_data: { errors: validationErrors, fields: Object.keys(request.body) }
            });
          }
          return { 
            allowed: false, 
            error: 'Input validation failed: ' + validationErrors.join(', ') 
          };
        }
      }

      // Log successful request
      if (logEvents) {
        logger.debug('Middleware request allowed', { action: rateLimitAction }, 'SecurityMiddleware');
        await securityService.logSecurityEvent({
          event_type: 'middleware_request_allowed',
          event_data: { action: rateLimitAction }
        });
      }

      return { allowed: true };
    } catch (error) {
      logger.error('Security middleware error', error, 'SecurityMiddleware');
      // In case of middleware error, allow the request but log it
      if (logEvents) {
        await securityService.logSecurityEvent({
          event_type: 'middleware_error',
          event_data: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }
      return { allowed: true };
    }
  }
}
