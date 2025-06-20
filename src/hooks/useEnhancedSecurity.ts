
import { useState, useEffect, useCallback } from 'react';
import { advancedThreatDetection } from '@/services/security/advancedThreatDetection';
import { sessionSecurityEnhancer } from '@/services/security/sessionSecurityEnhancer';
import { advancedInputValidator } from '@/services/security/advancedInputValidator';
import { useToast } from '@/hooks/use-toast';

export function useEnhancedSecurity() {
  const [isSecurityValidated, setIsSecurityValidated] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'critical'>('secure');
  const { toast } = useToast();

  const validateSessionSecurity = useCallback(async () => {
    try {
      const isValid = await sessionSecurityEnhancer.validateSessionIntegrity();
      
      if (!isValid) {
        setSecurityStatus('critical');
        toast({
          title: "Security Alert",
          description: "Session integrity check failed. Please log in again.",
          variant: "destructive",
        });
        return false;
      }
      
      setIsSecurityValidated(true);
      return true;
    } catch (error) {
      setSecurityStatus('warning');
      return false;
    }
  }, [toast]);

  const validateInput = useCallback(async (input: string, context: string) => {
    try {
      const result = await advancedInputValidator.validateAndSanitize(input, context);
      
      if (!result.isValid && result.riskLevel === 'critical') {
        toast({
          title: "Security Threat Detected",
          description: "Malicious input detected and blocked.",
          variant: "destructive",
        });
        return null;
      }
      
      if (result.threats.length > 0) {
        toast({
          title: "Input Sanitized",
          description: "Input was automatically cleaned for security.",
          variant: "default",
        });
      }
      
      return result.sanitizedInput;
    } catch (error) {
      return input; // Return original on error to avoid blocking legitimate users
    }
  }, [toast]);

  const detectThreatOnLogin = useCallback(async (email: string) => {
    try {
      const userAgent = navigator.userAgent;
      const fingerprint = await advancedThreatDetection.generateDeviceFingerprint();
      
      const threatResult = await advancedThreatDetection.detectAnomalousLogin(
        email,
        userAgent,
        fingerprint
      );
      
      if (threatResult.blockAction) {
        toast({
          title: "Login Blocked",
          description: "Suspicious activity detected. Please try again later.",
          variant: "destructive",
        });
        return false;
      }
      
      if (threatResult.isSuspicious && threatResult.riskLevel === 'high') {
        toast({
          title: "Security Notice",
          description: "Additional security measures have been applied to your account.",
          variant: "default",
        });
      }
      
      return true;
    } catch (error) {
      // Allow login on error to avoid blocking legitimate users
      return true;
    }
  }, [toast]);

  const rotateSensitiveSession = useCallback(async () => {
    try {
      await sessionSecurityEnhancer.rotateSessionOnSensitiveAction();
    } catch (error) {
      // Silent failure - session rotation is a security enhancement, not critical
    }
  }, []);

  useEffect(() => {
    // Validate session security on mount
    validateSessionSecurity();
    
    // Set up periodic security checks
    const securityCheckInterval = setInterval(validateSessionSecurity, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(securityCheckInterval);
  }, [validateSessionSecurity]);

  return {
    isSecurityValidated,
    securityStatus,
    validateSessionSecurity,
    validateInput,
    detectThreatOnLogin,
    rotateSensitiveSession
  };
}
