
import { productionLogger } from '@/utils/productionLogger';
import { enhancedSecurityHeaders } from '@/services/security/enhancedSecurityHeaders';
import { unifiedSecurityService } from '@/services/security/unified/UnifiedSecurityService';

export class EventMonitoring {
  private static instance: EventMonitoring;

  static getInstance(): EventMonitoring {
    if (!EventMonitoring.instance) {
      EventMonitoring.instance = new EventMonitoring();
    }
    return EventMonitoring.instance;
  }

  initializeSecurityEventMonitoring(): void {
    this.setupFormMonitoring();
    this.setupLinkMonitoring();
    this.setupInputMonitoring();
  }

  private setupFormMonitoring(): void {
    // Monitor for suspicious form submissions with enhanced validation
    document.addEventListener('submit', async (event) => {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      
      // Convert FormData to object for validation
      const formObject: Record<string, any> = {};
      for (const [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      // Enhanced form validation
      try {
        const validation = await unifiedSecurityService.validateFormData(formObject, `form_${form.action || 'unknown'}`);
        
        if (!validation.valid) {
          event.preventDefault();
          productionLogger.error('Form submission blocked due to security validation failure', {
            formAction: form.action,
            errors: validation.errors
          }, 'SecurityMonitor');
          
          alert('Your submission contains potentially dangerous content and has been blocked for security reasons.');
          return;
        }
      } catch (error) {
        productionLogger.error('Form security validation failed', error, 'SecurityMonitor');
      }
    });
  }

  private setupLinkMonitoring(): void {
    // Monitor for suspicious link clicks with enhanced validation
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && link.href) {
        const urlValidation = enhancedSecurityHeaders.validateSecureUrl(link.href);
        if (!urlValidation.isValid) {
          event.preventDefault();
          productionLogger.warn('Dangerous link click blocked', {
            href: link.href,
            reason: urlValidation.reason
          }, 'SecurityMonitor');
          
          alert(`This link has been blocked for security reasons: ${urlValidation.reason}`);
        }
      }
    });
  }

  private setupInputMonitoring(): void {
    // Enhanced input monitoring
    document.addEventListener('input', async (event) => {
      const target = event.target as HTMLInputElement;
      
      // Only monitor sensitive inputs
      if (target.type === 'password' || target.name?.includes('token') || target.name?.includes('key')) {
        return; // Don't log sensitive data
      }

      // Monitor for potential injection attempts in regular inputs
      if (target.value.length > 100) { // Only check longer inputs
        try {
          const validation = await unifiedSecurityService.validateUserInput(target.value, `input_${target.name || 'unknown'}`);
          
          if (!validation.isValid && validation.threats?.length) {
            productionLogger.warn('Potentially malicious input detected', {
              inputName: target.name,
              threats: validation.threats,
              riskLevel: validation.riskLevel
            }, 'SecurityMonitor');
          }
        } catch (error) {
          // Silently handle validation errors to avoid disrupting user experience
        }
      }
    });
  }
}

export const eventMonitoring = EventMonitoring.getInstance();
