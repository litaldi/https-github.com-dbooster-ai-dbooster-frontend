import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { enhancedRoleManager } from '../enhancedRoleManager';
import { advancedThreatDetection } from '../advancedThreatDetection';

type AppRole = 'admin' | 'moderator' | 'user';

interface RoleAssignmentResponse {
  success: boolean;
  requires_approval?: boolean;
  request_id?: string;
  message: string;
}

// Type guard for RoleAssignmentResponse
function isRoleAssignmentResponse(data: any): data is RoleAssignmentResponse {
  return data && 
         typeof data === 'object' && 
         typeof data.success === 'boolean' && 
         typeof data.message === 'string';
}

export class EnhancedAuthenticationService {
  private static instance: EnhancedAuthenticationService;

  static getInstance(): EnhancedAuthenticationService {
    if (!EnhancedAuthenticationService.instance) {
      EnhancedAuthenticationService.instance = new EnhancedAuthenticationService();
    }
    return EnhancedAuthenticationService.instance;
  }

  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string> {
    try {
      const sessionId = crypto.randomUUID();
      const deviceFingerprint = await this.generateDeviceFingerprint();
      const ipAddress = await this.getUserIP();
      const userAgent = navigator.userAgent;
      const securityScore = await this.calculateSecurityScore();
      const expiresAt = new Date(Date.now() + (isDemo ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000));

      // Enhanced security validation for session creation
      const threatAnalysis = await advancedThreatDetection.analyzeThreat('', {
        ipAddress,
        userAgent,
        userId,
        context: 'session_creation'
      });

      if (threatAnalysis.shouldBlock) {
        throw new Error('Session creation blocked due to security concerns');
      }

      const { error } = await supabase
        .from('enhanced_session_tracking')
        .insert({
          user_id: userId,
          session_id: sessionId,
          device_fingerprint: deviceFingerprint,
          ip_address: ipAddress,
          user_agent: userAgent,
          is_demo: isDemo,
          security_score: Math.max(securityScore - threatAnalysis.riskScore, 0),
          expires_at: expiresAt.toISOString()
        });

      if (error) {
        throw error;
      }

      // Log session creation
      await this.logSecurityEvent('session_created', {
        session_id: sessionId,
        is_demo: isDemo,
        security_score: securityScore,
        threat_score: threatAnalysis.riskScore
      });

      return sessionId;
    } catch (error) {
      productionLogger.error('Failed to create secure session', error, 'EnhancedAuthenticationService');
      throw error;
    }
  }

  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const deviceFingerprint = await this.generateDeviceFingerprint();
      const ipAddress = await this.getUserIP();
      const userAgent = navigator.userAgent;

      // Enhanced threat detection for session validation
      const threatAnalysis = await advancedThreatDetection.analyzeThreat('', {
        ipAddress,
        userAgent,
        userId: user.user.id,
        context: 'session_validation'
      });

      if (threatAnalysis.shouldBlock) {
        await this.logSecurityEvent('session_validation_blocked', {
          session_id: sessionId,
          threats: threatAnalysis.detectedThreats,
          risk_score: threatAnalysis.riskScore
        });
        return false;
      }

      // Call the secure session validation edge function
      const { data, error } = await supabase.functions.invoke('secure-session-validation', {
        body: {
          sessionId,
          deviceFingerprint,
          ipAddress,
          userAgent
        }
      });

      if (error || !data?.valid) {
        if (data?.reason) {
          await this.logSecurityEvent('session_validation_failed', {
            session_id: sessionId,
            reason: data.reason
          });
        }
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'EnhancedAuthenticationService');
      return false;
    }
  }

  async assignUserRole(targetUserId: string, newRole: AppRole, reason?: string): Promise<boolean> {
    try {
      const ipAddress = await this.getUserIP();
      
      // Use the enhanced secure role assignment function
      const { data, error } = await supabase.rpc('secure_assign_user_role', {
        target_user_id: targetUserId,
        new_role: newRole,
        change_reason: reason,
        requester_ip: ipAddress
      });

      if (error) {
        throw new Error(error.message);
      }

      // Safe type handling with type guard
      if (!isRoleAssignmentResponse(data)) {
        productionLogger.error('Invalid response format from role assignment', { data }, 'EnhancedAuthenticationService');
        return false;
      }
      
      if (!data.success && data.requires_approval) {
        productionLogger.secureInfo('Role assignment requires approval', {
          request_id: data.request_id,
          target_user_id: targetUserId,
          new_role: newRole
        });
        
        // This would trigger a notification to administrators
        if (data.request_id) {
          await this.notifyAdminsOfRoleRequest(data.request_id, targetUserId, newRole);
        }
        return false; // Not immediately assigned, requires approval
      }

      return data.success;
    } catch (error) {
      productionLogger.error('Role assignment failed', error, 'EnhancedAuthenticationService');
      throw error;
    }
  }

  async detectSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      // Check for suspicious sessions
      const { data: suspiciousSessions } = await supabase
        .from('enhanced_session_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'suspicious');

      if (suspiciousSessions && suspiciousSessions.length > 0) {
        await this.logSecurityEvent('suspicious_activity_detected', {
          user_id: userId,
          suspicious_sessions: suspiciousSessions.length
        });
        return true;
      }

      // Check for multiple active sessions from different IPs
      const { data: activeSessions } = await supabase
        .from('enhanced_session_tracking')
        .select('ip_address')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString());

      if (activeSessions) {
        const uniqueIPs = new Set(activeSessions.map(s => s.ip_address)).size;
        if (uniqueIPs > 3) {
          await this.logSecurityEvent('multiple_ip_access', {
            user_id: userId,
            unique_ips: uniqueIPs
          });
          return true;
        }
      }

      // Enhanced behavioral analysis
      const ipAddress = await this.getUserIP();
      const threatAnalysis = await advancedThreatDetection.analyzeThreat('', {
        ipAddress,
        userId,
        context: 'activity_analysis'
      });

      if (threatAnalysis.riskScore > 50) {
        await this.logSecurityEvent('high_risk_behavior_detected', {
          user_id: userId,
          risk_score: threatAnalysis.riskScore,
          threats: threatAnalysis.detectedThreats
        });
        return true;
      }

      return false;
    } catch (error) {
      productionLogger.error('Suspicious activity detection failed', error, 'EnhancedAuthenticationService');
      return false;
    }
  }

  private async notifyAdminsOfRoleRequest(requestId: string, targetUserId: string, newRole: string): Promise<void> {
    try {
      // Log the role request for admin notification
      await supabase.from('security_events_enhanced').insert({
        event_type: 'role_assignment_request_created',
        severity: 'medium',
        event_data: {
          request_id: requestId,
          target_user_id: targetUserId,
          requested_role: newRole,
          requires_admin_approval: true
        }
      });
    } catch (error) {
      productionLogger.error('Failed to notify admins of role request', error, 'EnhancedAuthenticationService');
    }
  }

  private async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || '0',
      navigator.platform || 'unknown'
    ];

    const fingerprint = components.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  private async calculateSecurityScore(): Promise<number> {
    let score = 50; // Base score

    // HTTPS bonus
    if (location.protocol === 'https:') score += 20;

    // Modern browser features
    if ('crypto' in window && 'subtle' in crypto) score += 15;
    if ('serviceWorker' in navigator) score += 10;
    if (window.isSecureContext) score += 5;

    return Math.min(score, 100);
  }

  private async logSecurityEvent(eventType: string, eventData: any): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      await supabase.from('security_audit_log').insert({
        user_id: user.user?.id,
        event_type: eventType,
        event_data: eventData,
        ip_address: await this.getUserIP(),
        user_agent: navigator.userAgent
      });
    } catch (error) {
      productionLogger.error('Failed to log security event', error, 'EnhancedAuthenticationService');
    }
  }
}

export const enhancedAuthenticationService = EnhancedAuthenticationService.getInstance();
