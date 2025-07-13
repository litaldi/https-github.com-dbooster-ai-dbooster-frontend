
import { MonitoringService } from './security/core/monitoringService';
import { consolidatedInputValidation } from './security/consolidatedInputValidation';

export const securityService = {
  async getEnhancedSecuritySummary() {
    const monitoringService = MonitoringService.getInstance();
    return await monitoringService.getEnhancedSecuritySummary();
  },

  async validateFormData(formData: Record<string, any>, context: string): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    let valid = true;

    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        const result = consolidatedInputValidation.validateAndSanitize(value, 'general');
        if (!result.isValid) {
          errors.push(...result.errors);
          valid = false;
        }
      }
    }

    return { valid, errors };
  },

  async validateUserInput(input: string, context: string): Promise<{
    valid: boolean;
    threats: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }> {
    const result = consolidatedInputValidation.validateAndSanitize(input, 'general');
    
    // Map validation errors to threats for compatibility
    const threats = result.errors;
    
    // Determine risk level based on validation results
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (threats.length > 0) {
      riskLevel = 'medium';
    }

    return {
      valid: result.isValid,
      threats,
      riskLevel
    };
  }
};
