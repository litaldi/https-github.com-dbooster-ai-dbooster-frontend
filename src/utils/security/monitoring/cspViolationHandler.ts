
import { productionLogger } from '@/utils/productionLogger';
import { enhancedThreatDetection } from '@/services/security/threatDetectionEnhanced';

export class CSPViolationHandler {
  private static instance: CSPViolationHandler;

  static getInstance(): CSPViolationHandler {
    if (!CSPViolationHandler.instance) {
      CSPViolationHandler.instance = new CSPViolationHandler();
    }
    return CSPViolationHandler.instance;
  }

  setupCSPViolationReporting(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      productionLogger.error('CSP Violation detected', {
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        effectiveDirective: event.effectiveDirective,
        originalPolicy: event.originalPolicy,
        referrer: event.referrer,
        sample: event.sample,
        statusCode: event.statusCode,
        violatedDirective: event.violatedDirective
      }, 'CSPViolation');

      // Log to audit system for investigation
      enhancedThreatDetection.detectThreats(event.blockedURI || '', {
        inputType: 'csp_violation',
        userAgent: navigator.userAgent
      });
    });
  }
}

export const cspViolationHandler = CSPViolationHandler.getInstance();
