
export interface SecurityEvent {
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

export interface SecuritySummary {
  totalEvents: number;
  threatsDetected: number;
  blockedIPs: number;
  recentHighRiskEvents: any[];
}
