
import { supabase } from '@/integrations/supabase/client';
import { environmentSecurityService } from './environmentSecurityService';
import { productionLogger } from '@/utils/productionLogger';
import type { SecurityHealthCheck } from './types';

export class SecurityHealthCheckService {
  private static instance: SecurityHealthCheckService;

  static getInstance(): SecurityHealthCheckService {
    if (!SecurityHealthCheckService.instance) {
      SecurityHealthCheckService.instance = new SecurityHealthCheckService();
    }
    return SecurityHealthCheckService.instance;
  }

  async performSecurityHealthCheck(): Promise<SecurityHealthCheck> {
    const checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; message: string }> = [];
    let totalScore = 0;

    try {
      // Environment security check
      const envCheck = await environmentSecurityService.validateEnvironment();
      checks.push({
        name: 'Environment Security',
        status: envCheck.isSecure ? 'pass' : envCheck.issues.length > 0 ? 'fail' : 'warn',
        message: envCheck.isSecure ? 'Environment is secure' : `${envCheck.issues.length} issues, ${envCheck.warnings.length} warnings`
      });
      totalScore += envCheck.score * 0.3;

      // Session security check
      const sessionValid = await environmentSecurityService.validateSessionSecurity();
      checks.push({
        name: 'Session Security',
        status: sessionValid ? 'pass' : 'fail',
        message: sessionValid ? 'Session is secure' : 'Session security issues detected'
      });
      totalScore += sessionValid ? 30 : 0;

      // Database connectivity check
      try {
        const { error } = await supabase.from('security_audit_log').select('id').limit(1);
        checks.push({
          name: 'Database Security',
          status: error ? 'fail' : 'pass',
          message: error ? 'Database connection issues' : 'Database is accessible'
        });
        totalScore += error ? 0 : 20;
      } catch {
        checks.push({
          name: 'Database Security',
          status: 'fail',
          message: 'Cannot connect to database'
        });
      }

      // Security headers check
      const hasCSP = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      checks.push({
        name: 'Security Headers',
        status: hasCSP ? 'pass' : 'warn',
        message: hasCSP ? 'CSP is configured' : 'Missing Content Security Policy'
      });
      totalScore += hasCSP ? 20 : 10;

      const overall = totalScore >= 80 ? 'healthy' : totalScore >= 60 ? 'warning' : 'critical';

      return { overall, checks, score: Math.round(totalScore) };
    } catch (error) {
      productionLogger.error('Security health check failed', error, 'SecurityHealthCheckService');
      return {
        overall: 'critical',
        checks: [{ name: 'Health Check', status: 'fail', message: 'Security health check failed' }],
        score: 0
      };
    }
  }

  async validateEnvironmentSecurity(): Promise<{ isSecure: boolean; issues: string[]; score: number }> {
    const result = await environmentSecurityService.validateEnvironment();
    return {
      isSecure: result.isSecure,
      issues: [...result.issues, ...result.warnings],
      score: result.score
    };
  }
}

export const securityHealthCheckService = SecurityHealthCheckService.getInstance();
