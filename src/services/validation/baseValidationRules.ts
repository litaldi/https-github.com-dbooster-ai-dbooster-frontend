
export interface ValidationRule {
  type: 'email' | 'url' | 'filename' | 'sql' | 'general' | 'custom';
  customValidator?: (value: string) => { isValid: boolean; errors: string[] };
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  sanitize?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedValue: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class BaseValidationRules {
  static readonly COMMON_RULES: Record<string, ValidationRule> = {
    email: {
      type: 'email',
      required: true,
      maxLength: 254,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: 'general',
      required: true,
      minLength: 8,
      sanitize: false // Don't sanitize passwords
    },
    strongPassword: {
      type: 'general',
      required: true,
      minLength: 12,
      sanitize: false
    },
    name: {
      type: 'general',
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    url: {
      type: 'url',
      required: false,
      maxLength: 2048
    },
    phoneNumber: {
      type: 'general',
      required: false,
      pattern: /^\+?[\d\s\-\(\)]+$/,
      minLength: 10,
      maxLength: 20
    },
    generalText: {
      type: 'general',
      required: false,
      maxLength: 1000
    },
    searchQuery: {
      type: 'sql', // Use SQL validation to prevent injection
      required: false,
      maxLength: 200
    }
  };
}
