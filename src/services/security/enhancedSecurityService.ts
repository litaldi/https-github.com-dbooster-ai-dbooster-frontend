
import { securityMonitoringService } from './securityMonitoringService';
import { consolidatedAuthenticationSecurity } from './consolidatedAuthenticationSecurity';
import { consolidatedInputValidation } from './consolidatedInputValidation';
import { enhancedRoleManager } from './enhancedRoleManager';
import { productionLogger } from '@/utils/productionLogger';

class EnhancedSecurityService {
  private static instance: EnhancedSecurityService;

  static getInstance(): EnhancedSecurityService {
    if (!EnhancedSecurityService.instance) {
      EnhancedSecurityService.instance = new EnhancedSecurityService();
    }
    return EnhancedSecurityService.instance;
  }

  async performSecurityHealthCheck(): Promise<{
    score: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const metrics = await securityMonitoringService.getSecurityMetrics();
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check for recent privilege escalation attempts
      if (metrics.recentEscalationAttempts > 0) {
        issues.push(`${metrics.recentEscalationAttempts} recent privilege escalation attempts detected`);
        recommendations.push('Review user access patterns and consider additional authentication measures');
      }

      // Check for critical security alerts
      if (metrics.criticalAlerts > 0) {
        issues.push(`${metrics.criticalAlerts} critical security alerts require attention`);
        recommendations.push('Investigate and resolve critical security alerts immediately');
      }

      // Check security score
      if (metrics.securityScore < 60) {
        issues.push('Overall security score is below acceptable threshold');
        recommendations.push('Implement additional security measures and monitor user activities');
      }

      // Check if admin bootstrap is properly configured
      const bootstrapNeeded = await securityMonitoringService.checkAdminBootstrapNeeded();
      if (bootstrapNeeded) {
        issues.push('Admin bootstrap process not completed');
        recommendations.push('Complete the secure admin user setup process');
      }

      // Determine overall status
      let status: 'excellent' | 'good' | 'warning' | 'critical';
      if (metrics.securityScore >= 90 && issues.length === 0) {
        status = 'excellent';
      } else if (metrics.securityScore >= 70 && issues.length <= 1) {
        status = 'good';
      } else if (metrics.securityScore >= 50 || issues.length <= 3) {
        status = 'warning';
      } else {
        status = 'critical';
      }

      return {
        score: metrics.securityScore,
        status,
        issues,
        recommendations
      };
    } catch (error) {
      productionLogger.error('Security health check failed', error, 'EnhancedSecurityService');
      return {
        score: 0,
        status: 'critical',
        issues: ['Security health check failed'],
        recommendations: ['Contact system administrator to resolve security monitoring issues']
      };
    }
  }

  async validateSecureAction(
    action: string,
    userId: string,
    context: Record<string, any> = {}
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Check if user exists and is authenticated
      if (!userId) {
        return { allowed: false, reason: 'User not authenticated' };
      }

      // Validate input for the action
      const inputValidation = await consolidatedInputValidation.validateInput(action, 'security_action');
      if (!inputValidation.isValid) {
        await securityMonitoringService.logPrivilegeEscalationAttempt(
          userId,
          'unknown',
          'invalid_action_input',
          context.ipAddress,
          context.userAgent
        );
        return { allowed: false, reason: 'Invalid action format' };
      }

      // Check for suspicious patterns
      const isSuspicious = await this.detectSuspiciousPattern(userId, action, context);
      if (isSuspicious) {
        await securityMonitoringService.logPrivilegeEscalationAttempt(
          userId,
          'unknown',
          'suspicious_pattern',
          context.ipAddress,
          context.userAgent
        );
        return { allowed: false, reason: 'Suspicious activity detected' };
      }

      return { allowed: true };
    } catch (error) {
      productionLogger.error('Secure action validation failed', error, 'EnhancedSecurityService');
      return { allowed: false, reason: 'Security validation error' };
    }
  }

  private async detectSuspiciousPattern(
    userId: string,
    action: string,
    context: Record<string, any>
  ): Promise<boolean> {
    // Check for rapid successive attempts
    const recentAttempts = await securityMonitoringService.getPrivilegeEscalationAttempts(10);
    const userRecentAttempts = recentAttempts.filter(
      attempt => attempt.user_id === userId && 
      new Date(attempt.created_at) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
    );

    if (userRecentAttempts.length >= 3) {
      return true;
    }

    // Check for unusual time patterns (e.g., actions at unusual hours)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      // Actions during unusual hours might be suspicious
      return context.bypassTimeCheck !== true;
    }

    return false;
  }

  async initializeSecurityMonitoring(): Promise<void> {
    try {
      productionLogger.info('Initializing enhanced security monitoring');

      // Start periodic security health checks
      this.startPeriodicHealthChecks();

      // Initialize real-time threat detection
      this.initializeRealTimeThreatDetection();

      productionLogger.info('Enhanced security monitoring initialized successfully');
    } catch (error) {
      productionLogger.error('Failed to initialize security monitoring', error, 'EnhancedSecurityService');
    }
  }

  private startPeriodicHealthChecks(): void {
    // Run security health check every hour
    setInterval(async () => {
      try {
        const healthCheck = await this.performSecurityHealthCheck();
        
        if (healthCheck.status === 'critical') {
          productionLogger.error('CRITICAL SECURITY ALERT', {
            score: healthCheck.score,
            issues: healthCheck.issues
          }, 'SecurityHealthCheck');
        } else if (healthCheck.status === 'warning') {
          productionLogger.warn('Security warning detected', {
            score: healthCheck.score,
            issues: healthCheck.issues
          }, 'SecurityHealthCheck');
        }
      } catch (error) {
        productionLogger.error('Periodic security health check failed', error, 'EnhancedSecurityService');
      }
    }, 60 * 60 * 1000); // 1 hour
  }

  private initializeRealTimeThreatDetection(): void {
    // Monitor for patterns that might indicate security threats
    // This could be expanded to include real-time analysis of user behavior
    productionLogger.info('Real-time threat detection initialized');
  }
}

export const enhancedSecurityService = EnhancedSecurityService.getInstance();
