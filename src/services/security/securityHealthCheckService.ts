
import { productionLogger } from '@/utils/productionLogger';
import { securityHeadersService } from './securityHeadersService';
import { environmentSecurityService } from './environmentSecurityService';

interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

export class SecurityHealthCheckService {
  private static instance: SecurityHealthCheckService;

  static getInstance(): SecurityHealthCheckService {
    if (!SecurityHealthCheckService.instance) {
      SecurityHealthCheckService.instance = new SecurityHealthCheckService();
    }
    return SecurityHealthCheckService.instance;
  }

  async validateEnvironmentSecurity(): Promise<{ isSecure: boolean; issues: string[]; score: number }> {
    const checks = await this.performSecurityHealthCheck();
    const passedChecks = checks.checks.filter(check => check.status === 'pass').length;
    const score = Math.round((passedChecks / checks.checks.length) * 100);
    const issues = checks.checks.filter(check => check.status === 'fail').map(check => check.message);

    return {
      isSecure: checks.overall === 'healthy',
      issues,
      score
    };
  }

  async performSecurityHealthCheck(): Promise<{
    overall: 'healthy' | 'warning' | 'critical';
    checks: HealthCheck[];
    score: number;
  }> {
    const checks: HealthCheck[] = [];

    try {
      // Check HTTPS
      if (location.protocol === 'https:' || location.hostname === 'localhost') {
        checks.push({
          name: 'HTTPS',
          status: 'pass',
          message: 'Site is served over HTTPS'
        });
      } else {
        checks.push({
          name: 'HTTPS',
          status: 'fail',
          message: 'Site is not served over HTTPS'
        });
      }

      // Check security headers
      const headersValidation = securityHeadersService.validateSecurityHeaders();
      if (headersValidation.isSecure) {
        checks.push({
          name: 'Security Headers',
          status: 'pass',
          message: 'All security headers are present'
        });
      } else {
        checks.push({
          name: 'Security Headers',
          status: 'warn',
          message: `Missing headers: ${headersValidation.missingHeaders.join(', ')}`
        });
      }

      // Check environment security
      const envValidation = environmentSecurityService.validateEnvironment();
      if (envValidation.isSecure) {
        checks.push({
          name: 'Environment Security',
          status: 'pass',
          message: 'Environment is secure'
        });
      } else {
        checks.push({
          name: 'Environment Security',
          status: 'warn',
          message: `Issues: ${envValidation.issues.join(', ')}`
        });
      }

      // Check for development tools in production
      if (process.env.NODE_ENV === 'production') {
        if (!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ || (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled) {
          checks.push({
            name: 'Development Tools',
            status: 'pass',
            message: 'Development tools are disabled in production'
          });
        } else {
          checks.push({
            name: 'Development Tools',
            status: 'fail',
            message: 'Development tools are active in production'
          });
        }
      } else {
        checks.push({
          name: 'Development Tools',
          status: 'pass',
          message: 'Running in development mode'
        });
      }

      // Check CSP
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (cspMeta) {
        checks.push({
          name: 'Content Security Policy',
          status: 'pass',
          message: 'CSP header is present'
        });
      } else {
        checks.push({
          name: 'Content Security Policy',
          status: 'warn',
          message: 'CSP header is missing'
        });
      }

      // Calculate overall status
      const failedChecks = checks.filter(check => check.status === 'fail').length;
      const warningChecks = checks.filter(check => check.status === 'warn').length;
      const passedChecks = checks.filter(check => check.status === 'pass').length;

      let overall: 'healthy' | 'warning' | 'critical';
      if (failedChecks > 0) {
        overall = 'critical';
      } else if (warningChecks > 0) {
        overall = 'warning';
      } else {
        overall = 'healthy';
      }

      const score = Math.round((passedChecks / checks.length) * 100);

      return { overall, checks, score };
    } catch (error) {
      productionLogger.error('Security health check failed', error, 'SecurityHealthCheckService');
      return {
        overall: 'critical',
        checks: [{
          name: 'Health Check',
          status: 'fail',
          message: 'Security health check failed to execute'
        }],
        score: 0
      };
    }
  }
}

export const securityHealthCheckService = SecurityHealthCheckService.getInstance();
