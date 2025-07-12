
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import type { SecurityEvent } from '../types/securityEvent';

export class SecurityEventHandler {
  private securityEventListeners: Map<string, Function[]> = new Map();

  async handleSecurityEvent(event: SecurityEvent): Promise<void> {
    const { event_type, event_data, user_id, ip_address } = event;

    // Check for high-risk events
    const highRiskEvents = [
      'security_validation_threat_detected',
      'suspicious_activity_detected',
      'rate_limit_exceeded',
      'auth_brute_force_attempt'
    ];

    if (highRiskEvents.includes(event_type)) {
      await this.triggerSecurityAlert(event);
    }

    // Notify listeners
    const listeners = this.securityEventListeners.get(event_type) || [];
    listeners.forEach(listener => listener(event));
  }

  private async triggerSecurityAlert(event: SecurityEvent): Promise<void> {
    productionLogger.error('High-risk security event detected', event, 'SecurityMonitor');

    // Could integrate with external alerting systems here
    // For now, we'll log and potentially block the user/IP
    
    if (event.event_type === 'security_validation_threat_detected') {
      await this.handleThreatDetection(event);
    }
  }

  private async handleThreatDetection(event: SecurityEvent): Promise<void> {
    const { event_data, ip_address, user_id } = event;
    const threatTypes = event_data?.threatTypes || [];

    // For high-risk threats, implement temporary blocking
    if (threatTypes.includes('sql_injection') || threatTypes.includes('command_injection')) {
      await this.temporarilyBlockSource(ip_address || 'unknown', user_id || '', 'high_risk_threat');
    }
  }

  private async temporarilyBlockSource(ipAddress: string, userId: string, reason: string): Promise<void> {
    try {
      // Block by IP if available
      if (ipAddress && ipAddress !== 'unknown') {
        await supabase.from('rate_limit_tracking').upsert({
          identifier: `blocked_ip:${ipAddress}`,
          action_type: 'security_block',
          attempt_count: 999,
          blocked_until: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
          window_start: new Date().toISOString()
        });

        productionLogger.warn(`Temporarily blocked IP ${ipAddress} for ${reason}`);
      }

      // Block by user if available
      if (userId) {
        await supabase.from('rate_limit_tracking').upsert({
          identifier: `blocked_user:${userId}`,
          action_type: 'security_block',
          attempt_count: 999,
          blocked_until: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
          window_start: new Date().toISOString()
        });

        productionLogger.warn(`Temporarily blocked user ${userId} for ${reason}`);
      }
    } catch (error) {
      productionLogger.error('Failed to block security threat source', error, 'SecurityMonitor');
    }
  }

  addEventListener(eventType: string, callback: Function): void {
    if (!this.securityEventListeners.has(eventType)) {
      this.securityEventListeners.set(eventType, []);
    }
    this.securityEventListeners.get(eventType)!.push(callback);
  }

  removeEventListener(eventType: string, callback: Function): void {
    const listeners = this.securityEventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}
