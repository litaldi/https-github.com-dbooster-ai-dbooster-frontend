
import { securityHeadersService } from './securityHeadersService';
import { enhancedInputValidation } from './enhancedInputValidation';
import { advancedThreatDetection } from './advancedThreatDetection';
import { enhancedAuthenticationService } from './core/enhancedAuthenticationService';
import { securityDashboardEnhanced } from './securityDashboardEnhanced';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityConfig {
  enableRealTimeMonitoring: boolean;
  enableAdvancedThreatDetection: boolean;
  enableBehaviorAnalysis: boolean;
  blockThreshold: number;
  alertThreshold: number;
}

export class SecurityOrchestrator {
  private static instance: SecurityOrchestrator;
  private config: SecurityConfig = {
    enableRealTimeMonitoring: true,
    enableAdvancedThreatDetection: true,
    enableBehaviorAnalysis: true,
    blockThreshold: 75,
    alertThreshold: 50
  };

  static getInstance(): SecurityOrchestrator {
    if (!SecurityOrchestrator.instance) {
      SecurityOrchestrator.instance = new SecurityOrchestrator();
    }
    return SecurityOrchestrator.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Apply security headers
      securityHeadersService.applySecurityHeaders();
      
      // Initialize monitoring
      if (this.config.enableRealTimeMonitoring) {
        await this.startRealTimeMonitoring();
      }

      productionLogger.secureInfo('Security orchestrator initialized successfully');
    } catch (error) {
      productionLogger.error('Failed to initialize security orchestrator', error, 'SecurityOrchestrator');
      throw error;
    }
  }

  async processSecurityRequest(data: {
    input?: string;
    context?: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    action?: string;
  }): Promise<{
    allowed: boolean;
    sanitizedInput?: string;
    threats: string[];
    riskScore: number;
    action: 'allow' | 'block' | 'monitor';
  }> {
    const startTime = Date.now();
    let allowed = true;
    let sanitizedInput = data.input;
    let threats: string[] = [];
    let riskScore = 0;
    let action: 'allow' | 'block' | 'monitor' = 'allow';

    try {
      // Input validation and sanitization
      if (data.input) {
        const validation = await enhancedInputValidation.validateInput(data.input, data.context);
        sanitizedInput = validation.sanitized;
        
        if (!validation.valid) {
          threats.push('invalid_input');
          riskScore += 20;
        }

        if (validation.riskLevel === 'high') {
          riskScore += 30;
        } else if (validation.riskLevel === 'medium') {
          riskScore += 15;
        }
      }

      // Advanced threat detection
      if (this.config.enableAdvancedThreatDetection && data.input) {
        const threatAnalysis = await advancedThreatDetection.analyzeThreat(data.input, {
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          userId: data.userId,
          context: data.context
        });

        threats.push(...threatAnalysis.detectedThreats);
        riskScore = Math.max(riskScore, threatAnalysis.riskScore);

        if (threatAnalysis.shouldBlock) {
          allowed = false;
          action = 'block';
        }
      }

      // Session validation
      if (data.userId) {
        const sessionValid = await this.validateUserSession(data.userId);
        if (!sessionValid) {
          threats.push('invalid_session');
          riskScore += 40;
          allowed = false;
          action = 'block';
        }
      }

      // Determine final action
      if (allowed) {
        if (riskScore >= this.config.alertThreshold) {
          action = 'monitor';
        }
        if (riskScore >= this.config.blockThreshold) {
          action = 'block';
          allowed = false;
        }
      }

      // Log security decision
      await this.logSecurityDecision({
        userId: data.userId,
        ipAddress: data.ipAddress,
        action: data.action,
        threats,
        riskScore,
        decision: action,
        processingTime: Date.now() - startTime
      });

      return {
        allowed,
        sanitizedInput,
        threats,
        riskScore,
        action
      };

    } catch (error) {
      productionLogger.error('Security processing failed', error, 'SecurityOrchestrator');
      
      // Fail secure - block on error
      return {
        allowed: false,
        sanitizedInput: data.input,
        threats: ['processing_error'],
        riskScore: 100,
        action: 'block'
      };
    }
  }

  private async validateUserSession(userId: string): Promise<boolean> {
    try {
      // Check for suspicious activity
      const suspicious = await enhancedAuthenticationService.detectSuspiciousActivity(userId);
      if (suspicious) {
        return false;
      }

      // Additional session validation logic would go here
      return true;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'SecurityOrchestrator');
      return false;
    }
  }

  private async startRealTimeMonitoring(): Promise<void> {
    // Set up periodic security checks
    setInterval(async () => {
      try {
        await this.performSecurityHealthCheck();
      } catch (error) {
        productionLogger.error('Security health check failed', error, 'SecurityOrchestrator');
      }
    }, 60000); // Every minute

    productionLogger.secureInfo('Real-time security monitoring started');
  }

  private async performSecurityHealthCheck(): Promise<void> {
    try {
      // Check for blocked IPs
      const blockedIPs = await advancedThreatDetection.getIPBlocklist();
      
      // Check security metrics
      const metrics = await securityDashboardEnhanced.getSecurityMetrics();
      
      // Check for alerts
      const alerts = await securityDashboardEnhanced.getSecurityAlerts();
      const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');

      if (criticalAlerts.length > 0) {
        productionLogger.secureWarn('Critical security alerts detected', {
          alertCount: criticalAlerts.length,
          blockedIPCount: blockedIPs.length
        });
      }

    } catch (error) {
      productionLogger.error('Security health check failed', error, 'SecurityOrchestrator');
    }
  }

  private async logSecurityDecision(decision: {
    userId?: string;
    ipAddress?: string;
    action?: string;
    threats: string[];
    riskScore: number;
    decision: string;
    processingTime: number;
  }): Promise<void> {
    try {
      productionLogger.secureInfo('Security decision made', decision);
    } catch (error) {
      productionLogger.error('Failed to log security decision', error, 'SecurityOrchestrator');
    }
  }

  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    productionLogger.secureInfo('Security configuration updated', newConfig);
  }

  getConfig(): SecurityConfig {
    return { ...this.config };
  }
}

export const securityOrchestrator = SecurityOrchestrator.getInstance();
