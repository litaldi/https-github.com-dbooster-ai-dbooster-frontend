
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from './auditLogger';
import { secureRateLimitService } from './secureRateLimitService';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export class SecurityEnhancementService {
  private static instance: SecurityEnhancementService;

  static getInstance(): SecurityEnhancementService {
    if (!SecurityEnhancementService.instance) {
      SecurityEnhancementService.instance = new SecurityEnhancementService();
    }
    return SecurityEnhancementService.instance;
  }

  // Enhanced input validation with security checks
  async validateUserInput(input: any, context: string): Promise<SecurityValidationResult> {
    const errors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    try {
      // Check for SQL injection patterns
      const sqlPatterns = [
        /('|(\\');|(;)|(--|#)|(\*|\s*\*)/i,
        /(union|select|insert|update|delete|drop|create|alter)/i,
        /(script|javascript|vbscript|onload|onerror)/i
      ];

      const inputString = JSON.stringify(input).toLowerCase();
      
      for (const pattern of sqlPatterns) {
        if (pattern.test(inputString)) {
          errors.push('Potentially malicious input detected');
          riskLevel = 'high';
          
          // Log security violation
          await auditLogger.logSecurityEvent({
            event_type: 'input_validation_violation',
            event_data: {
              context,
              violationType: 'sql_injection_attempt',
              riskLevel: 'high'
            }
          });
          break;
        }
      }

      // Check for XSS patterns
      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
      ];

      for (const pattern of xssPatterns) {
        if (pattern.test(inputString)) {
          errors.push('Cross-site scripting attempt detected');
          riskLevel = riskLevel === 'high' ? 'high' : 'medium';
          
          await auditLogger.logSecurityEvent({
            event_type: 'input_validation_violation',
            event_data: {
              context,
              violationType: 'xss_attempt',
              riskLevel
            }
          });
          break;
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        riskLevel
      };
    } catch (error) {
      productionLogger.error('Security validation failed', error, 'SecurityEnhancementService');
      return {
        isValid: false,
        errors: ['Security validation failed'],
        riskLevel: 'medium'
      };
    }
  }

  // Enhanced authentication security checks
  async validateAuthenticationSecurity(email: string): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Check for suspicious authentication patterns
      const suspiciousPatterns = [
        /admin|root|superuser|sa|operator/i,
        /test|demo|example|null|undefined/i
      ];

      if (suspiciousPatterns.some(pattern => pattern.test(email))) {
        await auditLogger.logSecurityEvent({
          event_type: 'suspicious_auth_attempt',
          event_data: {
            email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
            reason: 'suspicious_email_pattern'
          }
        });
        
        return {
          allowed: false,
          reason: 'Suspicious authentication pattern detected'
        };
      }

      // Rate limit authentication attempts
      const rateLimitResult = await secureRateLimitService.checkRateLimit(`auth:${email}`, 'login');
      if (!rateLimitResult.allowed) {
        return {
          allowed: false,
          reason: `Too many attempts. Try again in ${rateLimitResult.retryAfter} seconds.`
        };
      }

      return { allowed: true };
    } catch (error) {
      productionLogger.error('Authentication security check failed', error, 'SecurityEnhancementService');
      return { allowed: true }; // Allow on error to avoid blocking legitimate users
    }
  }

  // Session security validation
  async validateSessionSecurity(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return false;
      }

      // Check session age (24 hours max)
      const sessionAge = Date.now() - new Date(session.user?.created_at || 0).getTime();
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAge > maxSessionAge) {
        await auditLogger.logSecurityEvent({
          event_type: 'session_expired',
          event_data: {
            userId: session.user?.id,
            sessionAge: Math.floor(sessionAge / 1000 / 60) // minutes
          }
        });
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Session security validation failed', error, 'SecurityEnhancementService');
      return false;
    }
  }

  // Repository access validation
  async validateRepositoryAccess(repositoryId: string, action: 'read' | 'write' | 'delete'): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        await auditLogger.logSecurityEvent({
          event_type: 'unauthorized_repository_access_attempt',
          event_data: { repositoryId, action, reason: 'no_user' }
        });
        return false;
      }

      // Verify repository ownership through RLS
      const { data: repository, error } = await supabase
        .from('repositories')
        .select('id, user_id')
        .eq('id', repositoryId)
        .single();

      if (error || !repository || repository.user_id !== user.id) {
        await auditLogger.logSecurityEvent({
          event_type: 'unauthorized_repository_access_attempt',
          event_data: {
            repositoryId,
            action,
            userId: user.id,
            reason: error ? 'query_error' : 'access_denied'
          }
        });
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Repository access validation failed', error, 'SecurityEnhancementService');
      return false;
    }
  }
}

export const securityEnhancementService = SecurityEnhancementService.getInstance();
