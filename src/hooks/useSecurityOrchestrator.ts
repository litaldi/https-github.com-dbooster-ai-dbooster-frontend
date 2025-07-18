
import { useState, useEffect, useCallback } from 'react';
import { securityOrchestrator } from '@/services/security/securityOrchestrator';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityProcessingResult {
  allowed: boolean;
  sanitizedInput?: string;
  threats: string[];
  riskScore: number;
  action: 'allow' | 'block' | 'monitor';
}

export function useSecurityOrchestrator() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        await securityOrchestrator.initialize();
        setIsInitialized(true);
        productionLogger.secureInfo('Security orchestrator initialized in hook');
      } catch (error) {
        productionLogger.error('Failed to initialize security orchestrator', error, 'useSecurityOrchestrator');
      }
    };

    initializeSecurity();
  }, []);

  const processSecurityRequest = useCallback(async (data: {
    input?: string;
    context?: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    action?: string;
  }): Promise<SecurityProcessingResult> => {
    if (!isInitialized) {
      throw new Error('Security orchestrator not initialized');
    }

    setIsProcessing(true);
    try {
      const result = await securityOrchestrator.processSecurityRequest(data);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [isInitialized]);

  const validateInput = useCallback(async (
    input: string,
    context?: string
  ): Promise<{ valid: boolean; sanitized: string; threats: string[] }> => {
    const result = await processSecurityRequest({
      input,
      context,
      action: 'validate_input'
    });

    return {
      valid: result.allowed,
      sanitized: result.sanitizedInput || input,
      threats: result.threats
    };
  }, [processSecurityRequest]);

  const checkUserAccess = useCallback(async (
    userId: string,
    action: string,
    resource?: string
  ): Promise<{ allowed: boolean; reason?: string }> => {
    const result = await processSecurityRequest({
      userId,
      action,
      context: resource
    });

    return {
      allowed: result.allowed,
      reason: result.threats.length > 0 ? result.threats.join(', ') : undefined
    };
  }, [processSecurityRequest]);

  return {
    isInitialized,
    isProcessing,
    processSecurityRequest,
    validateInput,
    checkUserAccess
  };
}
