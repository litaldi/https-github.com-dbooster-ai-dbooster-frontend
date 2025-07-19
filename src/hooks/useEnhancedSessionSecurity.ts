
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface SessionSecurityStatus {
  isValid: boolean;
  securityScore: number;
  requiresReauth: boolean;
  lastValidation: string | null;
}

export function useEnhancedSessionSecurity() {
  const [sessionStatus, setSessionStatus] = useState<SessionSecurityStatus>({
    isValid: false,
    securityScore: 0,
    requiresReauth: false,
    lastValidation: null
  });
  const [isValidating, setIsValidating] = useState(false);

  // Enhanced device fingerprinting
  const generateEnhancedFingerprint = useCallback((): string => {
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.languages?.join(',') || '',
      screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || '0',
      navigator.deviceMemory?.toString() || '0',
      navigator.cookieEnabled.toString(),
      navigator.doNotTrack || '0',
      window.devicePixelRatio?.toString() || '1'
    ];

    // Simple hash for consistent fingerprinting
    let hash = 0;
    const fingerprint = components.join('|');
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return hash.toString(36);
  }, []);

  const validateSession = useCallback(async (sessionId: string) => {
    if (!sessionId) return false;

    setIsValidating(true);
    try {
      const deviceFingerprint = generateEnhancedFingerprint();
      
      const { data, error } = await supabase.functions.invoke('session-security', {
        body: {
          sessionId,
          deviceFingerprint,
          action: 'validate'
        }
      });

      if (error) {
        productionLogger.error('Session validation failed', error, 'useEnhancedSessionSecurity');
        return false;
      }

      setSessionStatus({
        isValid: data.valid,
        securityScore: data.securityScore || 0,
        requiresReauth: data.requiresReauth || false,
        lastValidation: new Date().toISOString()
      });

      return data.valid;
    } catch (error) {
      productionLogger.error('Session validation error', error, 'useEnhancedSessionSecurity');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [generateEnhancedFingerprint]);

  const rotateSession = useCallback(async (currentSessionId: string) => {
    try {
      const deviceFingerprint = generateEnhancedFingerprint();
      
      const { data, error } = await supabase.functions.invoke('session-security', {
        body: {
          sessionId: currentSessionId,
          deviceFingerprint,
          action: 'rotate'
        }
      });

      if (error) {
        productionLogger.error('Session rotation failed', error, 'useEnhancedSessionSecurity');
        return null;
      }

      productionLogger.info('Session rotated successfully', { newSessionId: data.newSessionId });
      return data.newSessionId;
    } catch (error) {
      productionLogger.error('Session rotation error', error, 'useEnhancedSessionSecurity');
      return null;
    }
  }, [generateEnhancedFingerprint]);

  const terminateSession = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase.functions.invoke('session-security', {
        body: {
          sessionId,
          deviceFingerprint: generateEnhancedFingerprint(),
          action: 'terminate'
        }
      });

      if (error) {
        productionLogger.error('Session termination failed', error, 'useEnhancedSessionSecurity');
        return false;
      }

      setSessionStatus({
        isValid: false,
        securityScore: 0,
        requiresReauth: true,
        lastValidation: null
      });

      return true;
    } catch (error) {
      productionLogger.error('Session termination error', error, 'useEnhancedSessionSecurity');
      return false;
    }
  }, [generateEnhancedFingerprint]);

  // Periodic session validation
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const sessionId = session.access_token.substring(0, 32); // Use part of token as session ID
        await validateSession(sessionId);
      }
    }, 5 * 60 * 1000); // Validate every 5 minutes

    return () => clearInterval(interval);
  }, [validateSession]);

  return {
    sessionStatus,
    isValidating,
    validateSession,
    rotateSession,
    terminateSession,
    generateEnhancedFingerprint
  };
}
