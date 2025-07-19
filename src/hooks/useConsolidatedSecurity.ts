
import { useState, useCallback } from 'react';
import { unifiedSecurityService } from '@/services/security/unifiedSecurityService';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { enhancedPrivilegeControl } from '@/services/security/enhancedPrivilegeControl';
import { secureSessionManager } from '@/services/security/secureSessionManager';
import { toast } from 'sonner';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityStatus {
  isAuthenticated: boolean;
  sessionValid: boolean;
  hasValidSession: boolean;
  securityScore?: number;
}

export function useConsolidatedSecurity() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    isAuthenticated: false,
    sessionValid: false,
    hasValidSession: false
  });

  const [loading, setLoading] = useState(false);

  // Initialize security service
  const initializeSecurity = useCallback(async () => {
    try {
      await unifiedSecurityService.initialize({
        enableRateLimit: true,
        enableInputValidation: true,
        enableSessionSecurity: true,
        enableErrorSanitization: true,
        strictMode: true
      });
      productionLogger.info('Security service initialized', {}, 'useConsolidatedSecurity');
    } catch (error) {
      productionLogger.error('Failed to initialize security', error, 'useConsolidatedSecurity');
    }
  }, []);

  // Secure login with comprehensive validation
  const secureLogin = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    setLoading(true);
    try {
      const result = await consolidatedAuthenticationSecurity.secureLogin(email, password, { rememberMe });
      
      if (result.success) {
        setSecurityStatus({
          isAuthenticated: true,
          sessionValid: true,
          hasValidSession: true
        });
        
        await unifiedSecurityService.logSecurityEvent('secure_login_success', true, {
          email,
          rememberMe
        });
        
        return { success: true, user: result.user };
      } else {
        toast.error(result.error || 'Login failed');
        
        await unifiedSecurityService.logSecurityEvent('secure_login_failure', false, {
          email,
          error: result.error
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      const sanitizedError = unifiedSecurityService.sanitizeError(error, 'secureLogin');
      toast.error(sanitizedError.message);
      productionLogger.error('Secure login failed', error, 'useConsolidatedSecurity');
      return { success: false, error: sanitizedError.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Secure signup with validation
  const secureSignup = useCallback(async (email: string, password: string, userData: { fullName: string; acceptedTerms: boolean }) => {
    setLoading(true);
    try {
      const result = await consolidatedAuthenticationSecurity.secureSignup(email, password, userData);
      
      if (result.success) {
        toast.success(result.message || 'Account created successfully');
        return { success: true, user: result.user };
      } else {
        toast.error(result.error || 'Signup failed');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const sanitizedError = unifiedSecurityService.sanitizeError(error, 'secureSignup');
      toast.error(sanitizedError.message);
      productionLogger.error('Secure signup failed', error, 'useConsolidatedSecurity');
      return { success: false, error: sanitizedError.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create secure demo session
  const createDemoSession = useCallback(async () => {
    setLoading(true);
    try {
      const session = await consolidatedAuthenticationSecurity.createSecureDemoSession();
      
      setSecurityStatus({
        isAuthenticated: true,
        sessionValid: true,
        hasValidSession: true,
        securityScore: session.securityScore
      });
      
      toast.success('Demo session created successfully');
      return { success: true, session };
    } catch (error) {
      const sanitizedError = unifiedSecurityService.sanitizeError(error, 'createDemoSession');
      toast.error(sanitizedError.message);
      productionLogger.error('Demo session creation failed', error, 'useConsolidatedSecurity');
      return { success: false, error: sanitizedError.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate current session
  const validateSession = useCallback(async (sessionId?: string) => {
    try {
      let isValid = false;
      
      if (sessionId) {
        isValid = await unifiedSecurityService.validateSession(sessionId);
      } else {
        // Validate current session via authentication service
        isValid = await consolidatedAuthenticationSecurity.validateSessionSecurity('current');
      }
      
      setSecurityStatus(prev => ({
        ...prev,
        sessionValid: isValid,
        hasValidSession: isValid
      }));
      
      return isValid;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'useConsolidatedSecurity');
      setSecurityStatus(prev => ({
        ...prev,
        sessionValid: false,
        hasValidSession: false
      }));
      return false;
    }
  }, []);

  // Invalidate session and clean up
  const invalidateSession = useCallback(async () => {
    try {
      // Find demo sessions in localStorage and invalidate them
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith('demo_session_') || key.startsWith('secure_session_')) {
          const sessionId = key.split('_').pop();
          if (sessionId) {
            await secureSessionManager.invalidateSession(sessionId);
          }
          localStorage.removeItem(key);
        }
      }
      
      setSecurityStatus({
        isAuthenticated: false,
        sessionValid: false,
        hasValidSession: false
      });
      
      await unifiedSecurityService.logSecurityEvent('session_invalidated', true);
    } catch (error) {
      productionLogger.error('Session invalidation failed', error, 'useConsolidatedSecurity');
    }
  }, []);

  // Assign user role with security validation
  const assignUserRole = useCallback(async (targetUserId: string, role: string, reason?: string) => {
    setLoading(true);
    try {
      const result = await enhancedPrivilegeControl.secureRoleAssignment({
        targetUserId,
        newRole: role as any,
        reason
      });
      
      if (result.success) {
        toast.success(result.message || 'Role assigned successfully');
        return { success: true };
      } else {
        toast.error(result.error || 'Role assignment failed');
        return { success: false, error: result.error };
      }
    } catch (error) {
      const sanitizedError = unifiedSecurityService.sanitizeError(error, 'assignUserRole');
      toast.error(sanitizedError.message);
      productionLogger.error('Role assignment failed', error, 'useConsolidatedSecurity');
      return { success: false, error: sanitizedError.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate user input
  const validateInput = useCallback(async (input: string, context: string = 'general') => {
    try {
      return await unifiedSecurityService.validateInput(input, context);
    } catch (error) {
      productionLogger.error('Input validation failed', error, 'useConsolidatedSecurity');
      return {
        isValid: false,
        hasThreats: true,
        threatTypes: ['validation_error'],
        sanitizedInput: '',
        riskLevel: 'critical' as const,
        blocked: true
      };
    }
  }, []);

  // Check rate limits
  const checkRateLimit = useCallback(async (identifier: string, action: string = 'api') => {
    try {
      return await unifiedSecurityService.checkRateLimit(identifier, action);
    } catch (error) {
      productionLogger.error('Rate limit check failed', error, 'useConsolidatedSecurity');
      return { allowed: false, reason: 'Rate limit service error' };
    }
  }, []);

  return {
    securityStatus,
    loading,
    initializeSecurity,
    secureLogin,
    secureSignup,
    createDemoSession,
    validateSession,
    invalidateSession,
    assignUserRole,
    validateInput,
    checkRateLimit
  };
}
