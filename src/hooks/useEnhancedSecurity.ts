
import { useState, useEffect, useCallback } from 'react';
import { enhancedSecurityService } from '@/services/security/enhancedSecurityService';
import { productionSecurityHardening } from '@/services/security/productionSecurityHardening';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface SecurityStatus {
  level: 'secure' | 'warning' | 'danger';
  score: number;
  issues: string[];
  lastCheck: Date;
}

export function useEnhancedSecurity() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    level: 'secure',
    score: 100,
    issues: [],
    lastCheck: new Date()
  });
  const [isValidating, setIsValidating] = useState(false);

  const validateInput = useCallback(async (input: any, context: string) => {
    setIsValidating(true);
    try {
      const validation = await enhancedSecurityService.validateEnhancedInput(input, context);
      
      if (!validation.isValid) {
        enhancedToast.error({
          title: "Security Alert",
          description: `${validation.threats.length} security threat(s) detected. Request blocked.`,
        });
        
        return false;
      }
      
      if (validation.riskScore > 20) {
        enhancedToast.warning({
          title: "Security Warning",
          description: "Potentially risky input detected. Please review your data.",
        });
      }
      
      return true;
    } catch (error) {
      enhancedToast.error({
        title: "Security Validation Error",
        description: "Unable to validate input security. Please try again.",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateUserAgent = useCallback(async (userAgent: string) => {
    const result = await enhancedSecurityService.validateUserAgent(userAgent);
    
    if (result.isSuspicious) {
      enhancedToast.warning({
        title: "Suspicious Activity",
        description: result.reason || "Suspicious user agent detected",
      });
      return false;
    }
    
    return true;
  }, []);

  const validateEmail = useCallback(async (email: string) => {
    const result = await enhancedSecurityService.validateEmailSecurity(email);
    
    if (!result.isSecure) {
      enhancedToast.warning({
        title: "Email Security Warning",
        description: result.reason || "Email pattern appears suspicious",
      });
      return false;
    }
    
    return true;
  }, []);

  const checkEnvironmentSecurity = useCallback(async () => {
    const validation = await productionSecurityHardening.validateEnvironmentSecurity();
    
    const newStatus: SecurityStatus = {
      level: validation.isSecure ? 'secure' : validation.issues.length > 3 ? 'danger' : 'warning',
      score: Math.max(0, 100 - (validation.issues.length * 20)),
      issues: validation.issues,
      lastCheck: new Date()
    };
    
    setSecurityStatus(newStatus);
    
    if (!validation.isSecure) {
      enhancedToast.warning({
        title: "Environment Security Issues",
        description: `${validation.issues.length} security issue(s) detected`,
      });
    }
    
    return validation.isSecure;
  }, []);

  const getUserRiskLevel = useCallback(async (userId: string) => {
    return await enhancedSecurityService.getUserSecurityRiskLevel(userId);
  }, []);

  // Initialize security hardening on mount
  useEffect(() => {
    productionSecurityHardening.initializeProductionSecurity();
    checkEnvironmentSecurity();
  }, [checkEnvironmentSecurity]);

  return {
    securityStatus,
    isValidating,
    validateInput,
    validateUserAgent,
    validateEmail,
    checkEnvironmentSecurity,
    getUserRiskLevel
  };
}
