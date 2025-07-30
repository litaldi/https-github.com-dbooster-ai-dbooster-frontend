import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface CSPViolationReport {
  blockedURI: string;
  documentURI: string;
  effectiveDirective: string;
  originalPolicy: string;
  referrer: string;
  sample: string;
  statusCode: number;
  violatedDirective: string;
}

interface ThreatResponse {
  blocked: boolean;
  escalated: boolean;
  action: 'log' | 'block' | 'alert' | 'shutdown';
  reason: string;
}

export class EnhancedCSPViolationHandler {
  private static instance: EnhancedCSPViolationHandler;
  private violationCounts = new Map<string, number>();
  private blockedSources = new Set<string>();

  static getInstance(): EnhancedCSPViolationHandler {
    if (!EnhancedCSPViolationHandler.instance) {
      EnhancedCSPViolationHandler.instance = new EnhancedCSPViolationHandler();
    }
    return EnhancedCSPViolationHandler.instance;
  }

  setupEnhancedCSPMonitoring(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleCSPViolation({
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        effectiveDirective: event.effectiveDirective,
        originalPolicy: event.originalPolicy,
        referrer: event.referrer,
        sample: event.sample,
        statusCode: event.statusCode,
        violatedDirective: event.violatedDirective
      });
    });

    // Enhanced XSS detection
    window.addEventListener('error', (event) => {
      this.detectPotentialXSS(event);
    });
  }

  private async handleCSPViolation(violation: CSPViolationReport): Promise<void> {
    const threatResponse = this.assessViolationThreat(violation);
    
    // Log to Supabase
    await this.logViolationToDatabase(violation, threatResponse);
    
    // Take appropriate action
    await this.executeSecurityResponse(violation, threatResponse);
    
    // Update local tracking
    this.updateViolationTracking(violation);
  }

  private assessViolationThreat(violation: CSPViolationReport): ThreatResponse {
    const { blockedURI, effectiveDirective, violatedDirective } = violation;
    
    // High-risk patterns
    const highRiskPatterns = [
      /javascript:/,
      /data:text\/html/,
      /vbscript:/,
      /onclick/i,
      /onload/i,
      /onerror/i,
      /eval\(/,
      /Function\(/,
      /document\.write/
    ];

    // Critical directives
    const criticalDirectives = ['script-src', 'object-src', 'base-uri'];
    
    // Check for high-risk violation
    const isHighRisk = highRiskPatterns.some(pattern => pattern.test(blockedURI)) ||
                      criticalDirectives.includes(effectiveDirective);

    // Check violation frequency
    const source = this.extractSource(blockedURI);
    const violationCount = (this.violationCounts.get(source) || 0) + 1;
    
    if (isHighRisk || violationCount > 3) {
      return {
        blocked: true,
        escalated: true,
        action: violationCount > 5 ? 'shutdown' : 'block',
        reason: isHighRisk ? 'High-risk violation pattern' : 'Repeated violations'
      };
    }

    if (violationCount > 1) {
      return {
        blocked: false,
        escalated: true,
        action: 'alert',
        reason: 'Multiple violations from same source'
      };
    }

    return {
      blocked: false,
      escalated: false,
      action: 'log',
      reason: 'Standard violation monitoring'
    };
  }

  private async logViolationToDatabase(
    violation: CSPViolationReport, 
    response: ThreatResponse
  ): Promise<void> {
    try {
      await supabase.functions.invoke('csp-violation-report', {
        body: {
          violationReport: violation,
          threatResponse: response,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      });
    } catch (error) {
      productionLogger.error('Failed to log CSP violation to database', error, 'CSPViolationHandler');
    }
  }

  private async executeSecurityResponse(
    violation: CSPViolationReport,
    response: ThreatResponse
  ): Promise<void> {
    const source = this.extractSource(violation.blockedURI);

    switch (response.action) {
      case 'block':
        this.blockedSources.add(source);
        await this.createSecurityAlert('csp_source_blocked', 'high', 
          `Blocked suspicious source: ${source}`);
        break;

      case 'alert':
        await this.createSecurityAlert('csp_repeated_violation', 'medium',
          `Repeated CSP violations from: ${source}`);
        break;

      case 'shutdown':
        this.blockedSources.add(source);
        await this.createSecurityAlert('csp_emergency_response', 'critical',
          `Emergency response triggered for: ${source}`);
        await this.triggerEmergencyLockdown(violation);
        break;

      case 'log':
      default:
        productionLogger.warn('CSP Violation logged', {
          ...violation,
          response
        }, 'CSPViolationHandler');
        break;
    }
  }

  private async createSecurityAlert(type: string, severity: string, message: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase.from('security_events_enhanced').insert({
        event_type: type,
        severity,
        user_id: user.user?.id,
        event_data: { message, timestamp: new Date().toISOString() },
        threat_score: severity === 'critical' ? 90 : severity === 'high' ? 70 : 40,
        auto_blocked: true
      });
    } catch (error) {
      productionLogger.error('Failed to create security alert', error, 'CSPViolationHandler');
    }
  }

  private async triggerEmergencyLockdown(violation: CSPViolationReport): Promise<void> {
    try {
      const { unifiedSecurityService } = await import('./unified/UnifiedSecurityService');
      await unifiedSecurityService.emergencyLockdown(
        `Critical CSP violation: ${violation.violatedDirective} - ${violation.blockedURI}`
      );
    } catch (error) {
      productionLogger.error('Emergency lockdown failed', error, 'CSPViolationHandler');
    }
  }

  private updateViolationTracking(violation: CSPViolationReport): void {
    const source = this.extractSource(violation.blockedURI);
    const currentCount = this.violationCounts.get(source) || 0;
    this.violationCounts.set(source, currentCount + 1);

    // Clean up old entries (keep only last 100)
    if (this.violationCounts.size > 100) {
      const entries = Array.from(this.violationCounts.entries());
      entries.splice(0, 20); // Remove oldest 20 entries
      this.violationCounts = new Map(entries);
    }
  }

  private extractSource(uri: string): string {
    try {
      if (uri.startsWith('data:')) return 'data:';
      if (uri.startsWith('javascript:')) return 'javascript:';
      if (uri.startsWith('blob:')) return 'blob:';
      
      const url = new URL(uri);
      return url.origin;
    } catch {
      return uri.substring(0, 50); // Fallback for invalid URIs
    }
  }

  private async detectPotentialXSS(event: ErrorEvent): Promise<void> {
    const { message, filename, lineno, colno } = event;
    
    // XSS patterns in error messages
    const xssPatterns = [
      /script.*src/i,
      /javascript:/i,
      /eval\(/i,
      /document\.write/i,
      /innerHTML.*script/i,
      /onerror.*javascript/i
    ];

    if (xssPatterns.some(pattern => pattern.test(message))) {
      await this.createSecurityAlert('potential_xss_detected', 'high',
        `Potential XSS attempt in error: ${message}`);
      
      productionLogger.error('Potential XSS detected', {
        message,
        filename,
        lineno,
        colno,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }, 'CSPViolationHandler');
    }
  }

  // Public method to check if a source is blocked
  isSourceBlocked(uri: string): boolean {
    const source = this.extractSource(uri);
    return this.blockedSources.has(source);
  }

  // Get violation statistics
  getViolationStats() {
    return {
      totalSources: this.violationCounts.size,
      blockedSources: this.blockedSources.size,
      topViolators: Array.from(this.violationCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    };
  }
}

export const enhancedCSPViolationHandler = EnhancedCSPViolationHandler.getInstance();
