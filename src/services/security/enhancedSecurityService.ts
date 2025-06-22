
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';
import { advancedThreatDetectionService } from './advancedThreatDetectionService';
import { inputSanitizationService } from './inputSanitizationService';
import { securityValidationService } from './securityValidationService';
import { securityHealthCheckService } from './securityHealthCheckService';
import type { EnhancedSecurityValidation, SecurityThreat, SeverityLevel } from './types';

export class EnhancedSecurityService {
  private static instance: EnhancedSecurityService;

  static getInstance(): EnhancedSecurityService {
    if (!EnhancedSecurityService.instance) {
      EnhancedSecurityService.instance = new EnhancedSecurityService();
    }
    return EnhancedSecurityService.instance;
  }

  async validateEnhancedInput(input: any, context: string): Promise<EnhancedSecurityValidation> {
    const threats: SecurityThreat[] = [];
    let riskScore = 0;

    try {
      const inputString = typeof input === 'string' ? input : JSON.stringify(input);

      // Use advanced threat detection
      const threatAnalysis = await advancedThreatDetectionService.analyzeInput(inputString, context);
      
      // Convert threat analysis to SecurityThreat format
      for (const threat of threatAnalysis.threats) {
        const severity = securityValidationService.normalizeSeverityLevel(threat.severity);
        threats.push({
          level: severity,
          type: threat.type,
          description: threat.description,
          recommended_action: securityValidationService.getRecommendedAction(severity)
        });
      }

      riskScore = threatAnalysis.riskScore;

      // Additional context-specific validation
      if (context === 'email') {
        const emailThreats = await securityValidationService.validateEmailSecurity(inputString);
        if (!emailThreats.isSecure) {
          const severity: SeverityLevel = 'medium';
          threats.push({
            level: severity,
            type: 'suspicious_email',
            description: 'Suspicious email pattern detected',
            recommended_action: securityValidationService.getRecommendedAction(severity)
          });
          riskScore += 20;
        }
      }

      // Sanitize input if not blocking
      let sanitizedInput: string | undefined;
      if (!threatAnalysis.shouldBlock) {
        sanitizedInput = inputSanitizationService.sanitizeInput(inputString);
      }

      // Log security validation
      if (threats.length > 0) {
        await auditLogger.logSecurityEvent({
          event_type: 'enhanced_security_validation',
          event_data: {
            context,
            threatCount: threats.length,
            riskScore,
            threatTypes: threats.map(t => t.type),
            blocked: threatAnalysis.shouldBlock
          }
        });
      }

      return {
        isValid: threats.length === 0,
        threats,
        riskScore,
        blockRequest: threatAnalysis.shouldBlock,
        sanitizedInput
      };
    } catch (error) {
      productionLogger.error('Enhanced security validation failed', error, 'EnhancedSecurityService');
      return {
        isValid: false,
        threats: [],
        riskScore: 0,
        blockRequest: false
      };
    }
  }

  async validateUserAgent(userAgent: string): Promise<{ isSuspicious: boolean; reason?: string; riskLevel?: string }> {
    return securityValidationService.validateUserAgent(userAgent);
  }

  async validateEmailSecurity(email: string): Promise<{ isSecure: boolean; reason?: string; riskLevel?: string }> {
    return securityValidationService.validateEmailSecurity(email);
  }

  async getUserSecurityRiskLevel(userId: string): Promise<'low' | 'medium' | 'high'> {
    try {
      // Since the database function doesn't exist yet, we'll implement basic logic
      // based on recent security events from the audit log
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('event_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('created_at', { ascending: false });

      if (!recentEvents || recentEvents.length === 0) {
        return 'low';
      }

      // Count security violations in the last 24 hours
      const securityViolations = recentEvents.filter(event => 
        event.event_type.includes('violation') || 
        event.event_type.includes('blocked') ||
        event.event_type.includes('threat')
      );

      if (securityViolations.length >= 5) {
        return 'high';
      } else if (securityViolations.length >= 2) {
        return 'medium';
      }

      return 'low';
    } catch (error) {
      productionLogger.error('Failed to get user security risk level', error, 'EnhancedSecurityService');
      return 'low';
    }
  }

  async validateEnvironmentSecurity(): Promise<{ isSecure: boolean; issues: string[]; score: number }> {
    return securityHealthCheckService.validateEnvironmentSecurity();
  }

  async performSecurityHealthCheck(): Promise<{
    overall: 'healthy' | 'warning' | 'critical';
    checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; message: string }>;
    score: number;
  }> {
    return securityHealthCheckService.performSecurityHealthCheck();
  }
}

export const enhancedSecurityService = EnhancedSecurityService.getInstance();
