
import type { Json } from '@/integrations/supabase/types';

export interface SecurityEvent {
  id: string;
  event_type: string;
  event_data: Json;
  created_at: string;
  user_id?: string;
  ip_address?: string | null;
  user_agent?: string | null;
}

export interface SecuritySummary {
  totalEvents: number;
  threatsDetected: number;
  blockedIPs: number;
  recentHighRiskEvents: SecurityEvent[];
}

export interface SecurityMetrics {
  totalSecurityEvents: number;
  threatsBlocked: number;
  suspiciousActivities: number;
  activeSecuritySessions: number;
  riskScore: number;
  lastThreatDetection: string | null;
  topThreatTypes: Array<{ type: string; count: number }>;
  securityTrends: Array<{ date: string; events: number; threats: number }>;
}

export interface SecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  metadata?: Record<string, any>;
}

export interface AuditReport {
  id: string;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  totalEvents: number;
  suspiciousPatterns: Array<{
    pattern: string;
    occurrences: number;
    riskLevel: string;
  }>;
  recommendations: string[];
  summary: string;
}

// Type guard to safely check event data structure
export function isEventDataWithThreatTypes(data: Json): data is { threatTypes: string[] } {
  return typeof data === 'object' && data !== null && 'threatTypes' in data && Array.isArray((data as any).threatTypes);
}
