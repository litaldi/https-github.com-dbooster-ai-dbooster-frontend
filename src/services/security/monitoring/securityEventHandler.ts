
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import type { SecurityEvent } from '../types/securityEvent';

export class SecurityEventHandler {
  private eventListeners: Map<string, Function[]> = new Map();

  addEventListener(eventType: string, callback: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  removeEventListener(eventType: string, callback: Function): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  async handleSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Log the event
      productionLogger.secureInfo('Security event detected', {
        type: event.event_type,
        severity: this.calculateEventSeverity(event)
      });

      // Trigger event listeners
      const listeners = this.eventListeners.get(event.event_type) || [];
      await Promise.all(listeners.map(listener => listener(event)));

      // Handle high-severity events
      if (this.isHighSeverityEvent(event)) {
        await this.handleHighSeverityEvent(event);
      }
    } catch (error) {
      productionLogger.error('Failed to handle security event', error, 'SecurityEventHandler');
    }
  }

  private calculateEventSeverity(event: SecurityEvent): 'low' | 'medium' | 'high' | 'critical' {
    const eventData = event.event_data as any;
    
    if (event.event_type.includes('threat_detected') || event.event_type.includes('suspicious')) {
      return eventData?.riskScore > 75 ? 'critical' : 'high';
    }
    
    if (event.event_type.includes('rate_limit') || event.event_type.includes('blocked')) {
      return 'medium';
    }
    
    return 'low';
  }

  private isHighSeverityEvent(event: SecurityEvent): boolean {
    const severity = this.calculateEventSeverity(event);
    return severity === 'high' || severity === 'critical';
  }

  private async handleHighSeverityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Log to enhanced security events table
      await supabase.from('security_events_enhanced').insert({
        event_type: event.event_type,
        severity: this.calculateEventSeverity(event),
        event_data: event.event_data,
        user_id: event.user_id,
        ip_address: event.ip_address,
        user_agent: event.user_agent
      });
    } catch (error) {
      productionLogger.error('Failed to log high severity event', error, 'SecurityEventHandler');
    }
  }

  async handleThreatDetection(event: SecurityEvent): Promise<void> {
    const eventData = event.event_data as any;
    const threatTypes = eventData?.threatTypes || [];
    
    // Block IP for critical threats
    if (threatTypes.includes('sql_injection') || threatTypes.includes('command_injection')) {
      await this.blockSuspiciousIP(event.ip_address as string);
    }
  }

  private async blockSuspiciousIP(ipAddress: string): Promise<void> {
    if (!ipAddress) return;

    try {
      const blockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await supabase.from('rate_limit_tracking').insert({
        identifier: `blocked_ip:${ipAddress}`,
        action_type: 'security_block',
        attempt_count: 1,
        blocked_until: blockUntil.toISOString()
      });

      productionLogger.secureWarn('IP blocked due to security threat', { ipAddress, blockUntil });
    } catch (error) {
      productionLogger.error('Failed to block suspicious IP', error, 'SecurityEventHandler');
    }
  }
}
