
import { productionLogger } from '@/utils/productionLogger';
import { serverSideRateLimit } from './serverSideRateLimit';
import { enhancedThreatDetection } from './threatDetectionEnhanced';
import { realTimeSecurityMonitor } from './realTimeSecurityMonitor';

interface SecurityIncident {
  id: string;
  type: 'rate_limit_violation' | 'threat_detected' | 'session_anomaly' | 'authentication_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  metadata: Record<string, any>;
  autoResponse?: string;
}

interface ResponseAction {
  type: 'block_ip' | 'lock_account' | 'require_reverification' | 'notify_admin' | 'escalate';
  executed: boolean;
  timestamp: Date;
  details?: string;
}

class AutomaticSecurityResponse {
  private static instance: AutomaticSecurityResponse;
  private incidents: SecurityIncident[] = [];
  private responseHistory: ResponseAction[] = [];

  static getInstance(): AutomaticSecurityResponse {
    if (!AutomaticSecurityResponse.instance) {
      AutomaticSecurityResponse.instance = new AutomaticSecurityResponse();
    }
    return AutomaticSecurityResponse.instance;
  }

  async processSecurityIncident(incident: Omit<SecurityIncident, 'id' | 'timestamp'>): Promise<void> {
    const securityIncident: SecurityIncident = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...incident
    };

    this.incidents.push(securityIncident);

    // Log the incident
    realTimeSecurityMonitor.logSecurityEvent({
      type: 'security_violation',
      severity: incident.severity,
      message: `Security incident: ${incident.type}`,
      metadata: incident.metadata
    });

    // Determine and execute automatic response
    const responses = await this.determineResponse(securityIncident);
    
    for (const response of responses) {
      await this.executeResponse(response, securityIncident);
    }

    // Clean up old incidents
    this.cleanupOldIncidents();
  }

  private async determineResponse(incident: SecurityIncident): Promise<ResponseAction[]> {
    const responses: ResponseAction[] = [];
    const { type, severity, metadata } = incident;

    switch (type) {
      case 'rate_limit_violation':
        if (severity === 'critical') {
          responses.push({
            type: 'block_ip',
            executed: false,
            timestamp: new Date(),
            details: 'Critical rate limit violation detected'
          });
        }
        if (severity === 'high' || severity === 'critical') {
          responses.push({
            type: 'notify_admin',
            executed: false,
            timestamp: new Date(),
            details: `Rate limit violation: ${severity}`
          });
        }
        break;

      case 'threat_detected':
        if (severity === 'critical') {
          responses.push({
            type: 'block_ip',
            executed: false,
            timestamp: new Date(),
            details: 'Critical threat detected'
          });
          responses.push({
            type: 'escalate',
            executed: false,
            timestamp: new Date(),
            details: 'Critical threat requires immediate attention'
          });
        }
        if (severity === 'high') {
          responses.push({
            type: 'require_reverification',
            executed: false,
            timestamp: new Date(),
            details: 'High severity threat detected'
          });
        }
        break;

      case 'session_anomaly':
        if (severity === 'high' || severity === 'critical') {
          responses.push({
            type: 'require_reverification',
            executed: false,
            timestamp: new Date(),
            details: 'Session anomaly detected'
          });
        }
        break;

      case 'authentication_failure':
        const failureCount = this.getRecentFailureCount(metadata.identifier);
        if (failureCount >= 10) {
          responses.push({
            type: 'lock_account',
            executed: false,
            timestamp: new Date(),
            details: `Multiple authentication failures: ${failureCount}`
          });
        } else if (failureCount >= 5) {
          responses.push({
            type: 'require_reverification',
            executed: false,
            timestamp: new Date(),
            details: `Repeated authentication failures: ${failureCount}`
          });
        }
        break;
    }

    return responses;
  }

  private async executeResponse(response: ResponseAction, incident: SecurityIncident): Promise<void> {
    try {
      switch (response.type) {
        case 'block_ip':
          await this.blockIP(incident.metadata.ipAddress || 'unknown', response.details || '');
          break;

        case 'lock_account':
          await this.lockAccount(incident.metadata.userId || incident.metadata.identifier, response.details || '');
          break;

        case 'require_reverification':
          await this.requireReverification(incident.metadata.userId || incident.metadata.identifier);
          break;

        case 'notify_admin':
          await this.notifyAdmin(incident, response.details || '');
          break;

        case 'escalate':
          await this.escalateIncident(incident);
          break;
      }

      response.executed = true;
      this.responseHistory.push(response);

      productionLogger.info('Security response executed', {
        responseType: response.type,
        incidentId: incident.id,
        severity: incident.severity
      });
    } catch (error) {
      productionLogger.error('Failed to execute security response', error, 'AutomaticSecurityResponse');
      response.executed = false;
    }
  }

  private async blockIP(ipAddress: string, reason: string): Promise<void> {
    if (ipAddress && ipAddress !== 'unknown') {
      enhancedThreatDetection.recordFailedAttempt(ipAddress, reason);
      
      // Record in server-side rate limiting
      await serverSideRateLimit.recordViolation(ipAddress, 'critical');
      
      productionLogger.warn(`IP blocked automatically: ${ipAddress}`, { reason });
    }
  }

  private async lockAccount(identifier: string, reason: string): Promise<void> {
    // In a real implementation, this would call the authentication service
    // to lock the user account
    productionLogger.warn(`Account lock requested: ${identifier}`, { reason });
    
    // Set a flag in localStorage for demo purposes
    localStorage.setItem(`account_locked_${identifier}`, JSON.stringify({
      lockedAt: new Date().toISOString(),
      reason,
      automatic: true
    }));
  }

  private async requireReverification(identifier: string): Promise<void> {
    // Set a flag requiring reverification on next login
    localStorage.setItem(`requires_reverification_${identifier}`, JSON.stringify({
      requiredAt: new Date().toISOString(),
      automatic: true
    }));
    
    productionLogger.info(`Reverification required for: ${identifier}`);
  }

  private async notifyAdmin(incident: SecurityIncident, details: string): Promise<void> {
    // In a real implementation, this would send notifications to administrators
    productionLogger.warn('Admin notification triggered', {
      incidentId: incident.id,
      type: incident.type,
      severity: incident.severity,
      details
    });
  }

  private async escalateIncident(incident: SecurityIncident): Promise<void> {
    // In a real implementation, this would escalate to security team
    productionLogger.error('Security incident escalated', {
      incidentId: incident.id,
      type: incident.type,
      severity: incident.severity,
      metadata: incident.metadata
    });
    
    // For demo, we'll add it to a high-priority queue
    localStorage.setItem(`escalated_incident_${incident.id}`, JSON.stringify({
      ...incident,
      escalatedAt: new Date().toISOString()
    }));
  }

  private getRecentFailureCount(identifier: string): number {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return this.incidents.filter(incident => 
      incident.type === 'authentication_failure' &&
      incident.metadata.identifier === identifier &&
      incident.timestamp.getTime() > oneHourAgo
    ).length;
  }

  private cleanupOldIncidents(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.incidents = this.incidents.filter(incident => 
      incident.timestamp.getTime() > oneDayAgo
    );
    
    this.responseHistory = this.responseHistory.filter(response =>
      response.timestamp.getTime() > oneDayAgo
    );
  }

  getIncidentStats(): {
    total: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    responseRate: number;
  } {
    const bySeverity: Record<string, number> = {};
    const byType: Record<string, number> = {};
    
    this.incidents.forEach(incident => {
      bySeverity[incident.severity] = (bySeverity[incident.severity] || 0) + 1;
      byType[incident.type] = (byType[incident.type] || 0) + 1;
    });
    
    const totalResponses = this.responseHistory.length;
    const executedResponses = this.responseHistory.filter(r => r.executed).length;
    const responseRate = totalResponses > 0 ? (executedResponses / totalResponses) * 100 : 100;
    
    return {
      total: this.incidents.length,
      bySeverity,
      byType,
      responseRate
    };
  }

  isAccountLocked(identifier: string): boolean {
    const lockData = localStorage.getItem(`account_locked_${identifier}`);
    if (!lockData) return false;
    
    try {
      const lock = JSON.parse(lockData);
      const lockAge = Date.now() - new Date(lock.lockedAt).getTime();
      const lockDuration = 24 * 60 * 60 * 1000; // 24 hours
      
      if (lockAge > lockDuration) {
        localStorage.removeItem(`account_locked_${identifier}`);
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  requiresReverification(identifier: string): boolean {
    const revData = localStorage.getItem(`requires_reverification_${identifier}`);
    return !!revData;
  }

  clearReverificationRequirement(identifier: string): void {
    localStorage.removeItem(`requires_reverification_${identifier}`);
  }
}

export const automaticSecurityResponse = AutomaticSecurityResponse.getInstance();
