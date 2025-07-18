
import { useState, useEffect, useCallback } from 'react';
import { enhancedSecurityHeaders } from '@/services/security/enhancedSecurityHeaders';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';

interface SecurityStatus {
  headersApplied: boolean;
  sessionSecure: boolean;
  threatProtectionActive: boolean;
  securityScore: number;
}

interface SecurityActions {
  applySecurityHeaders: () => void;
  validateCurrentSession: () => Promise<boolean>;
  getSecurityRecommendations: () => string[];
  refreshSecurityStatus: () => void;
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
    
    // Security headers (30 points)
    const headersStatus = enhancedSecurityHeaders.getSecurityHeadersStatus();
    const headersCount = Object.values(headersStatus).filter(Boolean).length;
    const totalHeaders = Object.keys(headersStatus).length;
    if (totalHeaders > 0) {
      score += (headersCount / totalHeaders) * 30;
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

    // Content Security Policy (15 points)
    if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      score += 15;
    }

    return Math.min(Math.round(score), maxScore);
  }, []);

  const refreshSecurityStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const headersStatus = enhancedSecurityHeaders.getSecurityHeadersStatus();
      const securityScore = calculateSecurityScore();
      
      // Check if main security features are active
      const headersApplied = Object.values(headersStatus).some(Boolean);
      const sessionSecure = window.isSecureContext && location.protocol === 'https:';
      const threatProtectionActive = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');

      setStatus({
        headersApplied,
        sessionSecure,
        threatProtectionActive,
        securityScore
      });
    } catch (error) {
      console.error('Failed to refresh security status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [calculateSecurityScore]);

  const applySecurityHeaders = useCallback(() => {
    enhancedSecurityHeaders.applyStrictSecurityHeaders();
    setTimeout(refreshSecurityStatus, 100); // Allow time for headers to apply
  }, [refreshSecurityStatus]);

  const validateCurrentSession = useCallback(async (): Promise<boolean> => {
    try {
      // This would typically validate against the current session
      // For now, we'll check basic security requirements
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
    refreshSecurityStatus
  };

  return {
    status,
    actions,
    isLoading
  };
}
