import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface SessionSecurityMetrics {
  sessionId: string | null;
  securityScore: number;
  isValid: boolean;
  lastValidation: Date | null;
  deviceFingerprint: string;
  flags: string[];
}

interface SessionRotationResult {
  success: boolean;
  newSessionId?: string;
  error?: string;
}

export function useEnhancedSessionSecurity() {
  const [metrics, setMetrics] = useState<SessionSecurityMetrics>({
    sessionId: null,
    securityScore: 0,
    isValid: false,
    lastValidation: null,
    deviceFingerprint: '',
    flags: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Generate device fingerprint
  const generateDeviceFingerprint = useCallback(async (): Promise<string> => {
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      // Safe navigator properties check
      'hardwareConcurrency' in navigator ? navigator.hardwareConcurrency : 'unknown',
      'deviceMemory' in navigator ? (navigator as any).deviceMemory : 'unknown',
    ];

    // Add WebGL fingerprint if available
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          components.push(
            gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          );
        }
      }
    } catch (error) {
      // WebGL not available or blocked
      components.push('webgl-unavailable');
    }

    const fingerprint = components.join('|');
    
    // Create hash
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }, []);

  // Validate current session
  const validateSession = useCallback(async (sessionId: string): Promise<SessionSecurityMetrics> => {
    try {
      const deviceFingerprint = await generateDeviceFingerprint();
      
      const { data, error } = await supabase.functions.invoke('session-security', {
        body: {
          sessionId,
          deviceFingerprint,
          ipAddress: await getClientIP(),
          userAgent: navigator.userAgent,
          action: 'validate'
        }
      });

      if (error) {
        throw error;
      }

      const newMetrics: SessionSecurityMetrics = {
        sessionId,
        securityScore: data.securityScore || 0,
        isValid: data.valid || false,
        lastValidation: new Date(),
        deviceFingerprint,
        flags: data.flags || []
      };

      setMetrics(newMetrics);
      return newMetrics;

    } catch (error) {
      productionLogger.error('Session validation failed', error, 'useEnhancedSessionSecurity');
      
      const errorMetrics: SessionSecurityMetrics = {
        sessionId,
        securityScore: 0,
        isValid: false,
        lastValidation: new Date(),
        deviceFingerprint: await generateDeviceFingerprint(),
        flags: ['validation_error']
      };

      setMetrics(errorMetrics);
      return errorMetrics;
    }
  }, [generateDeviceFingerprint]);

  // Rotate session for enhanced security
  const rotateSession = useCallback(async (currentSessionId: string): Promise<SessionRotationResult> => {
    try {
      const deviceFingerprint = await generateDeviceFingerprint();
      
      const { data, error } = await supabase.functions.invoke('session-security', {
        body: {
          sessionId: currentSessionId,
          deviceFingerprint,
          ipAddress: await getClientIP(),
          userAgent: navigator.userAgent,
          action: 'rotate'
        }
      });

      if (error || !data.success) {
        throw new Error(error?.message || 'Session rotation failed');
      }

      // Update metrics with new session
      await validateSession(data.newSessionId);

      return {
        success: true,
        newSessionId: data.newSessionId
      };

    } catch (error) {
      productionLogger.error('Session rotation failed', error, 'useEnhancedSessionSecurity');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [generateDeviceFingerprint, validateSession]);

  // Invalidate session
  const invalidateSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('session-security', {
        body: {
          sessionId,
          action: 'invalidate'
        }
      });

      if (error) {
        throw error;
      }

      // Reset metrics
      setMetrics({
        sessionId: null,
        securityScore: 0,
        isValid: false,
        lastValidation: null,
        deviceFingerprint: await generateDeviceFingerprint(),
        flags: []
      });

      return true;

    } catch (error) {
      productionLogger.error('Session invalidation failed', error, 'useEnhancedSessionSecurity');
      return false;
    }
  }, [generateDeviceFingerprint]);

  // Check concurrent sessions
  const checkConcurrentSessions = useCallback(async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('session-security', {
        body: {
          sessionId,
          action: 'check_concurrent'
        }
      });

      if (error) {
        throw error;
      }

      return {
        activeSessions: data.activeSessions,
        maxAllowed: data.maxAllowed,
        limitEnforced: data.limitEnforced
      };

    } catch (error) {
      productionLogger.error('Concurrent session check failed', error, 'useEnhancedSessionSecurity');
      return null;
    }
  }, []);

  // Auto-validation effect
  useEffect(() => {
    const initializeSessionSecurity = async () => {
      try {
        setIsLoading(true);
        
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session) {
          await validateSession(session.access_token);
        } else {
          // No session, set empty metrics
          setMetrics({
            sessionId: null,
            securityScore: 0,
            isValid: false,
            lastValidation: null,
            deviceFingerprint: await generateDeviceFingerprint(),
            flags: []
          });
        }

      } catch (error) {
        productionLogger.error('Failed to initialize session security', error, 'useEnhancedSessionSecurity');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSessionSecurity();

    // Set up periodic validation
    const validationInterval = setInterval(async () => {
      if (metrics.sessionId) {
        await validateSession(metrics.sessionId);
      }
    }, 5 * 60 * 1000); // Validate every 5 minutes

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await validateSession(session.access_token);
      } else if (event === 'SIGNED_OUT') {
        setMetrics({
          sessionId: null,
          securityScore: 0,
          isValid: false,
          lastValidation: null,
          deviceFingerprint: await generateDeviceFingerprint(),
          flags: []
        });
      }
    });

    return () => {
      clearInterval(validationInterval);
      subscription.unsubscribe();
    };
  }, [validateSession, generateDeviceFingerprint, metrics.sessionId]);

  return {
    metrics,
    isLoading,
    validateSession,
    rotateSession,
    invalidateSession,
    checkConcurrentSessions,
    generateDeviceFingerprint
  };
}

// Helper function to get client IP (approximation)
async function getClientIP(): Promise<string> {
  // Client-side IP collection removed; rely on server headers
  return '';
}