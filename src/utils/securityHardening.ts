
import { productionLogger } from '@/utils/productionLogger';

export function initializeSecurityHardening() {
  // Only run security hardening in production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  try {
    // Disable console in production for security
    if (typeof window !== 'undefined') {
      // Override console methods in production
      const noop = () => {};
      console.log = noop;
      console.warn = noop;
      console.error = noop;
      console.info = noop;
      console.debug = noop;
    }

    // Add security headers check
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
      productionLogger.warn('Application not running over HTTPS in production', {}, 'SecurityHardening');
    }

    // Basic XSS protection
    if (typeof window !== 'undefined') {
      const originalAlert = window.alert;
      window.alert = (message: any) => {
        productionLogger.warn('Alert blocked for security', { message }, 'SecurityHardening');
        return originalAlert('Security: Alert blocked');
      };
    }

    productionLogger.info('Security hardening initialized', {}, 'SecurityHardening');
  } catch (error) {
    productionLogger.error('Failed to initialize security hardening', error, 'SecurityHardening');
  }
}
