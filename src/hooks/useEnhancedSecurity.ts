
import { useState, useEffect, useCallback } from 'react';
import { enhancedSecurityHeaders } from '@/services/security/enhancedSecurityHeaders';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { enhancedSecurityValidation } from '@/services/security/enhancedSecurityValidation';
import { automaticSecurityResponse } from '@/services/security/automaticSecurityResponse';
import { serverSideRateLimit } from '@/services/security/serverSideRateLimit';

interface SecurityStatus {
  headersApplied: boolean;
  sessionSecure: boolean;
  threatProtectionActive: boolean;
  securityScore: number;
  healthCheck?: {
    overall: 'healthy' | 'warning' | 'critical';
    checks: Array<{ name: string; status: 'pass' | 'fail'; details?: string }>;
  };
  incidentStats?: {
    total: number;
    bySeverity: Record<string, number>;
    responseRate: number;
  };
}

interface SecurityActions {
  applySecurityHeaders: () => void;
  validateCurrentSession: () => Promise<boolean>;
  getSecurityRecommendations: () => string[];
  refreshSecurityStatus: () => void;
  performHealthCheck: () => Promise<void>;
  getIncidentStats: () => any;
}

export function useEnhancedSecurity(): {
  status: SecurityStatus;
  actions: SecurityActions;
  isLoading: boolean;
} {
  const [status, setStatus] = useState<SecurityStatus>({
    headersApplied: false,
    sessionSecure: false,
    threatProtectionActive: false,
    securityScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateSecurityScore = useCallback(() => {
    let score = 0;
    const maxScore = 100;
    
    // Security headers (25 points)
    const headersStatus = enhancedSecurityHeaders.getSecurityHeadersStatus();
    const headersCount = Object.values(headersStatus).filter(Boolean).length;
    const totalHeaders = Object.keys(headersStatus).length;
    if (totalHeaders > 0) {
      score += (headersCount / totalHeaders) * 25;
    }

    // HTTPS (20 points)
    if (location.protocol === 'https:') {
      score += 20;
    }

    // Secure context (15 points)
    if (window.isSecureContext) {
      score += 15;
    }

    // Browser security features (20 points)
    if ('crypto' in window && 'subtle' in crypto) score += 10;
    if ('serviceWorker' in navigator) score += 5;
    if ('permissions' in navigator) score += 5;

    // Content Security Policy (10 points)
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      score += 10;
    }

    // Enhanced security features (10 points)
    if (status.healthCheck?.overall === 'healthy') score += 5;
    if (status.incidentStats && status.incidentStats.responseRate > 90) score += 5;

    return Math.min(Math.round(score), maxScore);
  }, [status.healthCheck, status.incidentStats]);

  const performHealthCheck = useCallback(async () => {
    try {
      const healthCheck = await enhancedSecurityValidation.performSecurityHealthCheck();
      setStatus(prev => ({
        ...prev,
        healthCheck
      }));
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }, []);

  const getIncidentStats = useCallback(() => {
    return automaticSecurityResponse.getIncidentStats();
  }, []);

  const refreshSecurityStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const headersStatus = enhancedSecurityHeaders.getSecurityHeadersStatus();
      
      // Get incident statistics
      const incidentStats = getIncidentStats();
      
      // Perform health check
      await performHealthCheck();
      
      // Calculate security score
      const securityScore = calculateSecurityScore();
      
      // Check if main security features are active
      const headersApplied = Object.values(headersStatus).some(Boolean);
      const sessionSecure = window.isSecureContext && location.protocol === 'https:';
      const threatProtectionActive = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');

      setStatus(prev => ({
        ...prev,
        headersApplied,
        sessionSecure,
        threatProtectionActive,
        securityScore,
        incidentStats
      }));
    } catch (error) {
      console.error('Failed to refresh security status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [calculateSecurityScore, performHealthCheck, getIncidentStats]);

  const applySecurityHeaders = useCallback(() => {
    enhancedSecurityHeaders.applyStrictSecurityHeaders();
    setTimeout(refreshSecurityStatus, 100); // Allow time for headers to apply
  }, [refreshSecurityStatus]);

  const validateCurrentSession = useCallback(async (): Promise<boolean> => {
    try {
      // Enhanced session validation
      const session = JSON.parse(localStorage.getItem('supabase.auth.token') || 'null');
      
      if (session) {
        const validationResult = await enhancedSecurityValidation.validateSupabaseSession(session);
        return validationResult.isValid;
      }
      
      // Basic security requirements check
      return window.isSecureContext && location.protocol === 'https:';
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }, []);

  const getSecurityRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    
    if (!status.headersApplied) {
      recommendations.push('Apply security headers to protect against common attacks');
    }
    
    if (!status.sessionSecure) {
      recommendations.push('Ensure all connections use HTTPS for secure communication');
    }
    
    if (!status.threatProtectionActive) {
      recommendations.push('Enable Content Security Policy to prevent XSS attacks');
    }
    
    if (status.securityScore < 70) {
      recommendations.push('Security score is below recommended threshold - review security settings');
    }
    
    if (location.protocol !== 'https:') {
      recommendations.push('Enable HTTPS to secure all data transmission');
    }

    if (status.healthCheck?.overall === 'critical') {
      recommendations.push('Critical security issues detected - immediate attention required');
    }

    if (status.incidentStats && status.incidentStats.responseRate < 80) {
      recommendations.push('Improve automatic security response rate');
    }
    
    return recommendations;
  }, [status]);

  useEffect(() => {
    refreshSecurityStatus();
    
    // Set up periodic security status checks
    const interval = setInterval(refreshSecurityStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [refreshSecurityStatus]);

  const actions: SecurityActions = {
    applySecurityHeaders,
    validateCurrentSession,
    getSecurityRecommendations,
    refreshSecurityStatus,
    performHealthCheck,
    getIncidentStats
  };

  return {
    status,
    actions,
    isLoading
  };
}
