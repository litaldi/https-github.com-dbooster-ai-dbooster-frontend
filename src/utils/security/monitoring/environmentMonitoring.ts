
import { productionLogger } from '@/utils/productionLogger';
import { enhancedSecurityHeaders } from '@/services/security/enhancedSecurityHeaders';

export class EnvironmentMonitoring {
  private static instance: EnvironmentMonitoring;

  static getInstance(): EnvironmentMonitoring {
    if (!EnvironmentMonitoring.instance) {
      EnvironmentMonitoring.instance = new EnvironmentMonitoring();
    }
    return EnvironmentMonitoring.instance;
  }

  initializeGlobalSecurityMonitoring(): void {
    // Override console methods in production to prevent information disclosure
    if (import.meta.env.PROD) {
      const originalConsole = { ...console };
      
      console.log = (...args) => {
        // Log security-relevant console calls
        if (args.some(arg => typeof arg === 'string' && 
            (arg.includes('security') || arg.includes('auth') || arg.includes('token')))) {
          productionLogger.warn('Security-related console.log detected', { args: args.map(String) }, 'SecurityMonitor');
        }
      };
      
      console.error = (...args) => {
        // Always log console.error calls as they might indicate security issues
        productionLogger.error('Console error detected', { args: args.map(String) }, 'SecurityMonitor');
      };
    }

    // Monitor for suspicious JavaScript execution
    const originalEval = window.eval;
    window.eval = function(code: string) {
      productionLogger.error('Eval execution blocked for security', {
        codeLength: code?.length || 0,
        codePreview: code?.substring(0, 50) || ''
      }, 'SecurityMonitor');
      throw new Error('eval() is disabled for security reasons');
    };

    // Monitor dynamic script creation
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string) {
      const element = originalCreateElement.call(document, tagName);
      if (tagName.toLowerCase() === 'script') {
        productionLogger.warn('Dynamic script creation detected', {
          timestamp: Date.now()
        }, 'SecurityMonitor');
        
        // Add security attributes to dynamically created scripts
        (element as HTMLScriptElement).nonce = enhancedSecurityHeaders.getNonce();
      }
      return element;
    };
  }
}

export const environmentMonitoring = EnvironmentMonitoring.getInstance();
