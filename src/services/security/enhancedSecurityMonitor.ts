
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

// Define types for better type safety
interface SecurityEvent {
  id: string;
  event_type: string;
  event_data: {
    threatTypes?: string[];
    validationType?: string;
    input?: string;
    context?: string;
    activityType?: string;
    details?: any;
  } | null;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export class EnhancedSecurityMonitor {
  private static instance: EnhancedSecurityMonitor;
  private securityEventListeners: Map<string, Function[]> = new Map();
  private isMonitoring = false;

  static getInstance(): EnhancedSecurityMonitor {
    if (!EnhancedSecurityMonitor.instance) {
      EnhancedSecurityMonitor.instance = new EnhancedSecurityMonitor();
    }
    return EnhancedSecurityMonitor.instance;
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    productionLogger.info('Enhanced security monitoring started');

    // Monitor for real-time security events
    this.setupRealtimeSecurityMonitoring();
    
    // Monitor for suspicious patterns
    this.setupPatternDetection();
    
    // Setup automated threat response
    this.setupAutomatedThreatResponse();
  }

  private setupRealtimeSecurityMonitoring(): void {
    // Subscribe to security audit log changes
    supabase
      .channel('security_monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_audit_log'
        },
        (payload) => {
          this.handleSecurityEvent(payload.new as SecurityEvent);
        }
      )
      .subscribe();
  }

  private async handleSecurityEvent(event: SecurityEvent): Promise<void> {
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

  private setupPatternDetection(): void {
    // Monitor for suspicious patterns in user behavior
    setInterval(async () => {
      await this.analyzeSecurityPatterns();
    }, 60000); // Check every minute
  }

  private async analyzeSecurityPatterns(): Promise<void> {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      // Look for patterns in recent security events
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('*')
        .gte('created_at', fifteenMinutesAgo.toISOString())
        .order('created_at', { ascending: false });

      if (!recentEvents || recentEvents.length === 0) return;

      // Analyze patterns
      const ipCounts: Record<string, number> = {};
      const userCounts: Record<string, number> = {};
      const threatTypes: Record<string, number> = {};

      recentEvents.forEach(event => {
        // Count events by IP (with proper type checking)
        const ipAddress = event.ip_address as string | null;
        if (ipAddress) {
          ipCounts[ipAddress] = (ipCounts[ipAddress] || 0) + 1;
        }

        // Count events by user (with proper type checking)
        const userId = event.user_id as string | null;
        if (userId) {
          userCounts[userId] = (userCounts[userId] || 0) + 1;
        }

        // Count threat types (with proper type checking)
        const eventData = event.event_data as { threatTypes?: string[] } | null;
        if (eventData?.threatTypes) {
          eventData.threatTypes.forEach((threat: string) => {
            threatTypes[threat] = (threatTypes[threat] || 0) + 1;
          });
        }
      });

      // Alert on suspicious patterns
      Object.entries(ipCounts).forEach(([ip, count]) => {
        if (count > 10) { // More than 10 events from one IP in 15 minutes
          this.logSuspiciousActivity('high_frequency_ip_activity', { ip, count });
        }
      });

      Object.entries(userCounts).forEach(([userId, count]) => {
        if (count > 15) { // More than 15 events from one user in 15 minutes
          this.logSuspiciousActivity('high_frequency_user_activity', { userId, count });
        }
      });

    } catch (error) {
      productionLogger.error('Pattern analysis failed', error, 'SecurityMonitor');
    }
  }

  private async logSuspiciousActivity(activityType: string, details: any): Promise<void> {
    await supabase.from('security_audit_log').insert({
      event_type: 'suspicious_pattern_detected',
      event_data: { activityType, details },
      ip_address: null,
      user_agent: null
    });
  }

  private setupAutomatedThreatResponse(): void {
    // Set up automated responses to certain threat types
    this.addEventListener('security_validation_threat_detected', async (event: SecurityEvent) => {
      const threatTypes = event.event_data?.threatTypes || [];
      
      if (threatTypes.includes('sql_injection') || threatTypes.includes('command_injection')) {
        // Immediate response for critical threats
        await this.handleThreatDetection(event);
      }
    });
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

  async getSecuritySummary(): Promise<{
    totalEvents: number;
    threatsDetected: number;
    blockedIPs: number;
    recentHighRiskEvents: any[];
  }> {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const [eventsResult, threatsResult, blockedResult, highRiskResult] = await Promise.all([
        supabase
          .from('security_audit_log')
          .select('id', { count: 'exact' })
          .gte('created_at', twentyFourHoursAgo.toISOString()),
        
        supabase
          .from('security_audit_log')
          .select('id', { count: 'exact' })
          .eq('event_type', 'security_validation_threat_detected')
          .gte('created_at', twentyFourHoursAgo.toISOString()),
        
        supabase
          .from('rate_limit_tracking')
          .select('id', { count: 'exact' })
          .eq('action_type', 'security_block')
          .gt('blocked_until', new Date().toISOString()),
        
        supabase
          .from('security_audit_log')
          .select('*')
          .in('event_type', [
            'security_validation_threat_detected',
            'suspicious_activity_detected',
            'suspicious_pattern_detected'
          ])
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      return {
        totalEvents: eventsResult.count || 0,
        threatsDetected: threatsResult.count || 0,
        blockedIPs: blockedResult.count || 0,
        recentHighRiskEvents: highRiskResult.data || []
      };
    } catch (error) {
      productionLogger.error('Failed to get security summary', error, 'SecurityMonitor');
      return {
        totalEvents: 0,
        threatsDetected: 0,
        blockedIPs: 0,
        recentHighRiskEvents: []
      };
    }
  }
}

export const enhancedSecurityMonitor = EnhancedSecurityMonitor.getInstance();
