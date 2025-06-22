
import { useState, useEffect, useCallback } from 'react';
import { enhancedSecurityService } from '@/services/security/enhancedSecurityService';
import { productionSecurityHardening } from '@/services/security/productionSecurityHardening';
import { advancedThreatDetectionService } from '@/services/security/advancedThreatDetectionService';
import { environmentSecurityService } from '@/services/security/environmentSecurityService';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityStatus {
  level: 'secure' | 'warning' | 'danger';
  score: number;
  issues: string[];
  lastCheck: Date;
}

interface SecurityHealthCheck {
  overall: 'healthy' | 'warning' | 'critical';
  checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; message: string }>;
  score: number;
}

export function useEnhancedSecurity() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    level: 'secure',
    score: 100,
    issues: [],
    lastCheck: new Date()
  });
  const [isValidating, setIsValidating] = useState(false);
  const [healthCheck, setHealthCheck] = useState<SecurityHealthCheck | null>(null);

  const validateInput = useCallback(async (input: any, context: string) => {
    setIsValidating(true);
    try {
      const validation = await enhancedSecurityService.validateEnhancedInput(input, context);
      
      if (!validation.isValid) {
        enhancedToast.error({
          title: "Security Alert",
          description: `${validation.threats.length} security threat(s) detected. Request blocked.`,
        });
        
        productionLogger.warn('Input validation failed', {
          context,
          threatCount: validation.threats.length,
          riskScore: validation.riskScore
        }, 'useEnhancedSecurity');
        
        return { 
          isValid: false, 
          sanitizedInput: validation.sanitizedInput,
          threats: validation.threats 
        };
      }
      
      if (validation.riskScore > 20) {
        enhancedToast.warning({
          title: "Security Warning",
          description: "Potentially risky input detected. Please review your data.",
        });
      }
      
      return { 
        isValid: true, 
        sanitizedInput: validation.sanitizedInput,
        threats: validation.threats 
      };
    } catch (error) {
      enhancedToast.error({
        title: "Security Validation Error",
        description: "Unable to validate input security. Please try again.",
      });
      productionLogger.error('Input validation error', error, 'useEnhancedSecurity');
      return { isValid: false, sanitizedInput: input };
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
      
      productionLogger.warn('Suspicious user agent detected', {
        userAgent: userAgent.substring(0, 100),
        riskLevel: result.riskLevel
      }, 'useEnhancedSecurity');
      
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
      
      productionLogger.warn('Suspicious email pattern', {
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        riskLevel: result.riskLevel
      }, 'useEnhancedSecurity');
      
      return false;
    }
    
    return true;
  }, []);

  const checkEnvironmentSecurity = useCallback(async () => {
    const validation = await enhancedSecurityService.validateEnvironmentSecurity();
    
    const newStatus: SecurityStatus = {
      level: validation.isSecure ? 'secure' : validation.issues.length > 3 ? 'danger' : 'warning',
      score: validation.score,
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

  const performHealthCheck = useCallback(async () => {
    try {
      const health = await enhancedSecurityService.performSecurityHealthCheck();
      setHealthCheck(health);
      
      if (health.overall === 'critical') {
        enhancedToast.error({
          title: "Critical Security Issues",
          description: "Multiple security issues detected. Please review immediately.",
        });
      } else if (health.overall === 'warning') {
        enhancedToast.warning({
          title: "Security Warnings",
          description: "Some security issues detected. Review recommended.",
        });
      }
      
      return health;
    } catch (error) {
      productionLogger.error('Security health check failed', error, 'useEnhancedSecurity');
      return null;
    }
  }, []);

  const analyzeUserBehavior = useCallback(async (userId: string) => {
    try {
      const analysis = await advancedThreatDetectionService.analyzeUserBehavior(userId);
      
      if (analysis.riskLevel === 'high') {
        enhancedToast.error({
          title: "High Risk User Activity",
          description: "Suspicious behavior patterns detected.",
        });
      } else if (analysis.riskLevel === 'medium') {
        enhancedToast.warning({
          title: "Elevated Risk Activity",
          description: "Monitoring recommended for this user.",
        });
      }
      
      return analysis;
    } catch (error) {
      productionLogger.error('User behavior analysis failed', error, 'useEnhancedSecurity');
      return { riskLevel: 'low' as const, suspiciousActivities: [], recommendedActions: [] };
    }
  }, []);

  const getUserRiskLevel = useCallback(async (userId: string) => {
    return await enhancedSecurityService.getUserSecurityRiskLevel(userId);
  }, []);

  // Initialize security hardening on mount
  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        productionSecurityHardening.initializeProductionSecurity();
        environmentSecurityService.initializeSecurityHeaders();
        await checkEnvironmentSecurity();
        await performHealthCheck();
        
        productionLogger.warn('Enhanced security initialized', {
          timestamp: new Date().toISOString()
        }, 'useEnhancedSecurity');
      } catch (error) {
        productionLogger.error('Security initialization failed', error, 'useEnhancedSecurity');
      }
    };

    initializeSecurity();
  }, [checkEnvironmentSecurity, performHealthCheck]);

  return {
    securityStatus,
    healthCheck,
    isValidating,
    validateInput,
    validateUserAgent,
    validateEmail,
    checkEnvironmentSecurity,
    performHealthCheck,
    analyzeUserBehavior,
    getUserRiskLevel
  };
}
