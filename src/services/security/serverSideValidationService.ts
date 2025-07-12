
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export class ServerSideValidationService {
  private static instance: ServerSideValidationService;

  static getInstance(): ServerSideValidationService {
    if (!ServerSideValidationService.instance) {
      ServerSideValidationService.instance = new ServerSideValidationService();
    }
    return ServerSideValidationService.instance;
  }

  async validateInput(
    input: string, 
    validationType: 'general' | 'database' | 'html' | 'system' = 'general',
    context?: string
  ): Promise<{
    isValid: boolean;
    hasThreats: boolean;
    threatTypes: string[];
    sanitizedInput: string;
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('security-validation', {
        body: {
          input,
          validationType,
          context: context || 'unknown'
        }
      });

      if (error) {
        productionLogger.error('Server-side validation failed', error, 'ServerSideValidation');
        // Fail securely - treat as high risk if validation fails
        return {
          isValid: false,
          hasThreats: true,
          threatTypes: ['validation_error'],
          sanitizedInput: '',
          riskLevel: 'high'
        };
      }

      return data;
    } catch (error) {
      productionLogger.error('Server-side validation error', error, 'ServerSideValidation');
      // Fail securely
      return {
        isValid: false,
        hasThreats: true,
        threatTypes: ['validation_error'],
        sanitizedInput: '',
        riskLevel: 'high'
      };
    }
  }

  async validateFormData(formData: Record<string, any>, context: string): Promise<{
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData: Record<string, any>;
  }> {
    const errors: Record<string, string[]> = {};
    const sanitizedData: Record<string, any> = {};
    let overallValid = true;

    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        const validation = await this.validateInput(value, 'general', `${context}.${key}`);
        
        if (!validation.isValid) {
          errors[key] = validation.threatTypes;
          overallValid = false;
        }
        
        sanitizedData[key] = validation.sanitizedInput;
      } else {
        sanitizedData[key] = value;
      }
    }

    return {
      isValid: overallValid,
      errors,
      sanitizedData
    };
  }

  async validateDatabaseQuery(query: string, params?: any[]): Promise<{
    isValid: boolean;
    threats: string[];
    sanitizedQuery: string;
  }> {
    const validation = await this.validateInput(query, 'database', 'database_query');
    
    return {
      isValid: validation.isValid,
      threats: validation.threatTypes,
      sanitizedQuery: validation.sanitizedInput
    };
  }
}

export const serverSideValidationService = ServerSideValidationService.getInstance();
