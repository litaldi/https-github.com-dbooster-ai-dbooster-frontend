
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';

interface ThreatPattern {
  name: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export class AdvancedThreatDetectionService {
  private static instance: AdvancedThreatDetectionService;

  // Enhanced SQL injection patterns
  private readonly SQL_INJECTION_PATTERNS: ThreatPattern[] = [
    {
      name: 'union_select',
      pattern: /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\s)/gi,
      severity: 'high',
      description: 'SQL command injection attempt'
    },
    {
      name: 'boolean_logic',
      pattern: /(\b(or|and)\s+[\w\s]*\s*=\s*[\w\s]*)/gi,
      severity: 'high',
      description: 'Boolean logic injection'
    },
    {
      name: 'comment_injection',
      pattern: /(--|\/\*|\*\/|;)/g,
      severity: 'medium',
      description: 'SQL comment injection'
    },
    {
      name: 'hex_encoding',
      pattern: /(0x[0-9a-f]+)/gi,
      severity: 'medium',
      description: 'Hexadecimal encoding attack'
    },
    {
      name: 'time_based_blind',
      pattern: /\b(waitfor|delay|sleep|benchmark)\s*\(/gi,
      severity: 'critical',
      description: 'Time-based blind SQL injection'
    }
  ];

  // Enhanced XSS patterns
  private readonly XSS_PATTERNS: ThreatPattern[] = [
    {
      name: 'script_tag',
      pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      severity: 'high',
      description: 'Script tag injection'
    },
    {
      name: 'javascript_protocol',
      pattern: /javascript:/gi,
      severity: 'high',
      description: 'JavaScript protocol injection'
    },
    {
      name: 'event_handler',
      pattern: /on\w+\s*=/gi,
      severity: 'high',
      description: 'Event handler injection'
    },
    {
      name: 'iframe_injection',
      pattern: /<iframe\b[^>]*>/gi,
      severity: 'critical',
      description: 'iFrame injection attack'
    },
    {
      name: 'data_uri',
      pattern: /data:\s*text\/html/gi,
      severity: 'medium',
      description: 'Data URI XSS attempt'
    }
  ];

  // Command injection patterns
  private readonly COMMAND_INJECTION_PATTERNS: ThreatPattern[] = [
    {
      name: 'shell_operators',
      pattern: /[;&|`$(){}[\]]/g,
      severity: 'critical',
      description: 'Shell command operators'
    },
    {
      name: 'system_commands',
      pattern: /\b(rm|del|format|exec|eval|system|cmd|powershell)\b/gi,
      severity: 'critical',
      description: 'System command execution'
    },
    {
      name: 'file_operations',
      pattern: /\b(cat|type|more|less|head|tail|find|grep)\b/gi,
      severity: 'high',
      description: 'File operation commands'
    }
  ];

  static getInstance(): AdvancedThreatDetectionService {
    if (!AdvancedThreatDetectionService.instance) {
      AdvancedThreatDetectionService.instance = new AdvancedThreatDetectionService();
    }
    return AdvancedThreatDetectionService.instance;
  }

  async analyzeInput(input: string, context: string): Promise<{
    threats: Array<{ type: string; severity: string; description: string }>;
    riskScore: number;
    shouldBlock: boolean;
  }> {
    const threats: Array<{ type: string; severity: string; description: string }> = [];
    let riskScore = 0;

    // Check SQL injection patterns
    for (const pattern of this.SQL_INJECTION_PATTERNS) {
      if (pattern.pattern.test(input)) {
        threats.push({
          type: `sql_injection_${pattern.name}`,
          severity: pattern.severity,
          description: pattern.description
        });
        riskScore += this.getSeverityScore(pattern.severity);
      }
    }

    // Check XSS patterns
    for (const pattern of this.XSS_PATTERNS) {
      if (pattern.pattern.test(input)) {
        threats.push({
          type: `xss_${pattern.name}`,
          severity: pattern.severity,
          description: pattern.description
        });
        riskScore += this.getSeverityScore(pattern.severity);
      }
    }

    // Check command injection patterns
    for (const pattern of this.COMMAND_INJECTION_PATTERNS) {
      if (pattern.pattern.test(input)) {
        threats.push({
          type: `command_injection_${pattern.name}`,
          severity: pattern.severity,
          description: pattern.description
        });
        riskScore += this.getSeverityScore(pattern.severity);
      }
    }

    const shouldBlock = riskScore >= 50 || threats.some(t => t.severity === 'critical');

    if (threats.length > 0) {
      await auditLogger.logSecurityEvent({
        event_type: 'advanced_threat_detection',
        event_data: {
          context,
          threats,
          riskScore,
          shouldBlock,
          inputLength: input.length
        }
      });
    }

    return { threats, riskScore, shouldBlock };
  }

  private getSeverityScore(severity: string): number {
    switch (severity) {
      case 'critical': return 40;
      case 'high': return 25;
      case 'medium': return 15;
      case 'low': return 5;
      default: return 0;
    }
  }

  async analyzeUserBehavior(userId: string): Promise<{
    riskLevel: 'low' | 'medium' | 'high';
    suspiciousActivities: string[];
    recommendedActions: string[];
  }> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('event_type, created_at, event_data')
        .eq('user_id', userId)
        .gte('created_at', oneHourAgo.toISOString())
        .order('created_at', { ascending: false });

      if (!recentEvents) {
        return { riskLevel: 'low', suspiciousActivities: [], recommendedActions: [] };
      }

      const suspiciousActivities: string[] = [];
      const recommendedActions: string[] = [];
      let riskScore = 0;

      // Analyze patterns
      const failedLogins = recentEvents.filter(e => 
        e.event_type === 'auth_login' && 
        e.event_data && 
        typeof e.event_data === 'object' && 
        'success' in e.event_data && 
        !e.event_data.success
      ).length;

      if (failedLogins > 3) {
        suspiciousActivities.push(`${failedLogins} failed login attempts in the last hour`);
        riskScore += 30;
      }

      const threatEvents = recentEvents.filter(e => 
        e.event_type.includes('threat') || e.event_type.includes('violation')
      ).length;

      if (threatEvents > 2) {
        suspiciousActivities.push(`${threatEvents} security threats detected`);
        riskScore += 40;
      }

      // Determine risk level and recommendations
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (riskScore >= 60) {
        riskLevel = 'high';
        recommendedActions.push('Temporarily suspend account', 'Require additional verification');
      } else if (riskScore >= 30) {
        riskLevel = 'medium';
        recommendedActions.push('Enable additional monitoring', 'Request password change');
      }

      return { riskLevel, suspiciousActivities, recommendedActions };
    } catch (error) {
      productionLogger.error('User behavior analysis failed', error, 'AdvancedThreatDetectionService');
      return { riskLevel: 'low', suspiciousActivities: [], recommendedActions: [] };
    }
  }
}

export const advancedThreatDetectionService = AdvancedThreatDetectionService.getInstance();
