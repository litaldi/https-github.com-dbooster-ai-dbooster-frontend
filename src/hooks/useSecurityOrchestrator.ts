
import { useState, useEffect, useCallback, useRef } from 'react';
import { securityOrchestrator } from '@/services/security/securityOrchestrator';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityProcessingResult {
  allowed: boolean;
  sanitizedInput?: string;
  threats: string[];
  riskScore: number;
  action: 'allow' | 'block' | 'monitor';
}

interface SecurityRequestData {
  input?: string;
  context?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  action?: string;
}

export function useSecurityOrchestrator() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializationRef = useRef<Promise<void> | null>(null);
  const processingQueueRef = useRef<Map<string, Promise<SecurityProcessingResult>>>(new Map());

  // Memoized initialization to prevent multiple calls
  const initializeSecurity = useCallback(async () => {
    if (initializationRef.current) {
      return initializationRef.current;
    }

    initializationRef.current = (async () => {
      try {
        await securityOrchestrator.initialize();
        setIsInitialized(true);
        setError(null);
        productionLogger.secureInfo('Security orchestrator initialized in hook');
      } catch (error) {
        const errorMessage = 'Failed to initialize security orchestrator';
        setError(errorMessage);
        productionLogger.error(errorMessage, error, 'useSecurityOrchestrator');
        throw error;
      }
    })();

    return initializationRef.current;
  }, []);

  useEffect(() => {
    initializeSecurity();
    
    return () => {
      // Cleanup processing queue on unmount
      processingQueueRef.current.clear();
    };
  }, [initializeSecurity]);

  const processSecurityRequest = useCallback(async (
    data: SecurityRequestData
  ): Promise<SecurityProcessingResult> => {
    if (!isInitialized) {
      throw new Error('Security orchestrator not initialized');
    }

    // Create a unique key for deduplication
    const requestKey = JSON.stringify(data);
    
    // Check if the same request is already being processed
    if (processingQueueRef.current.has(requestKey)) {
      return processingQueueRef.current.get(requestKey)!;
    }

    const requestPromise = (async () => {
      setIsProcessing(true);
      try {
        const result = await securityOrchestrator.processSecurityRequest(data);
        setError(null);
        return result;
      } catch (error) {
        const errorMessage = 'Security request processing failed';
        setError(errorMessage);
        productionLogger.error(errorMessage, error, 'useSecurityOrchestrator');
        throw error;
      } finally {
        setIsProcessing(false);
        processingQueueRef.current.delete(requestKey);
      }
    })();

    processingQueueRef.current.set(requestKey, requestPromise);
    return requestPromise;
  }, [isInitialized]);

  const validateInput = useCallback(async (
    input: string,
    context?: string
  ): Promise<{ valid: boolean; sanitized: string; threats: string[] }> => {
    try {
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
    } catch (error) {
      productionLogger.error('Input validation failed', error, 'useSecurityOrchestrator');
      return {
        valid: false,
        sanitized: input,
        threats: ['Validation service unavailable']
      };
    }
  }, [processSecurityRequest]);

  const checkUserAccess = useCallback(async (
    userId: string,
    action: string,
    resource?: string
  ): Promise<{ allowed: boolean; reason?: string }> => {
    try {
      const result = await processSecurityRequest({
        userId,
        action,
        context: resource
      });

      return {
        allowed: result.allowed,
        reason: result.threats.length > 0 ? result.threats.join(', ') : undefined
      };
    } catch (error) {
      productionLogger.error('Access check failed', error, 'useSecurityOrchestrator');
      return {
        allowed: false,
        reason: 'Access validation service unavailable'
      };
    }
  }, [processSecurityRequest]);

  return {
    isInitialized,
    isProcessing,
    error,
    processSecurityRequest,
    validateInput,
    checkUserAccess,
    reinitialize: initializeSecurity
  };
}
