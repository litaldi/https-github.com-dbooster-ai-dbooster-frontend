
import { comprehensiveInputValidation } from './comprehensiveInputValidation';
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '@/services/auditLogger';

interface ValidationRule {
  type: 'email' | 'url' | 'filename' | 'sql' | 'general' | 'custom';
  customValidator?: (value: string) => { isValid: boolean; errors: string[] };
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  sanitize?: boolean;
}

interface FormValidationConfig {
  [fieldName: string]: ValidationRule;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedValue: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class EnhancedInputValidation {
  private static instance: EnhancedInputValidation;

  static getInstance(): EnhancedInputValidation {
    if (!EnhancedInputValidation.instance) {
      EnhancedInputValidation.instance = new EnhancedInputValidation();
    }
    return EnhancedInputValidation.instance;
  }

  async validateField(
    fieldName: string,
    value: any,
    rule: ValidationRule,
    context?: string
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    try {
      const stringValue = String(value || '');

      // Required field check
      if (rule.required && !stringValue.trim()) {
        errors.push(`${fieldName} is required`);
        return {
          isValid: false,
          errors,
          warnings,
          sanitizedValue: '',
          riskLevel: 'medium'
        };
      }

      // Length checks
      if (rule.minLength && stringValue.length < rule.minLength) {
        errors.push(`${fieldName} must be at least ${rule.minLength} characters long`);
      }

      if (rule.maxLength && stringValue.length > rule.maxLength) {
        errors.push(`${fieldName} must not exceed ${rule.maxLength} characters`);
        // Truncate for safety
        value = stringValue.substring(0, rule.maxLength);
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(stringValue)) {
        errors.push(`${fieldName} format is invalid`);
      }

      // Type-specific validation using comprehensive service
      let validationResult;
      if (rule.type === 'custom' && rule.customValidator) {
        validationResult = rule.customValidator(stringValue);
        errors.push(...validationResult.errors);
      } else {
        validationResult = comprehensiveInputValidation.validateInput(stringValue, rule.type);
        errors.push(...validationResult.errors);
      }

      // Determine risk level based on validation results
      if (validationResult.errors.some(error => 
        error.includes('SQL injection') || 
        error.includes('script') ||
        error.includes('dangerous pattern')
      )) {
        riskLevel = 'critical';
      } else if (validationResult.errors.length > 2) {
        riskLevel = 'high';
      } else if (validationResult.errors.length > 0) {
        riskLevel = 'medium';
      }

      // Sanitize if requested
      let sanitizedValue = stringValue;
      if (rule.sanitize !== false) {
        sanitizedValue = comprehensiveInputValidation.sanitizeInput(stringValue, {
          allowHtml: false,
          maxLength: rule.maxLength || 1000,
          stripScripts: true
        });
      }

      // Log high-risk validation attempts
      if (riskLevel === 'critical' || riskLevel === 'high') {
        await auditLogger.logSecurityEvent({
          event_type: 'high_risk_input_validation',
          event_data: {
            fieldName,
            riskLevel,
            errorCount: errors.length,
            context: context || 'unknown',
            hasScript: stringValue.includes('<script'),
            hasSql: /\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b/i.test(stringValue)
          }
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        sanitizedValue,
        riskLevel
      };
    } catch (error) {
      productionLogger.error('Field validation error', error, 'EnhancedInputValidation');
      return {
        isValid: false,
        errors: ['Validation failed'],
        warnings: [],
        sanitizedValue: String(value || ''),
        riskLevel: 'medium'
      };
    }
  }

  async validateForm(
    formData: Record<string, any>,
    config: FormValidationConfig,
    context?: string
  ): Promise<{
    isValid: boolean;
    fieldResults: Record<string, ValidationResult>;
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    sanitizedData: Record<string, any>;
  }> {
    const fieldResults: Record<string, ValidationResult> = {};
    const sanitizedData: Record<string, any> = {};
    let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Validate each field according to its rule
    for (const [fieldName, rule] of Object.entries(config)) {
      const fieldValue = formData[fieldName];
      const result = await this.validateField(fieldName, fieldValue, rule, context);
      
      fieldResults[fieldName] = result;
      sanitizedData[fieldName] = result.sanitizedValue;

      // Update overall risk level
      if (result.riskLevel === 'critical') {
        overallRiskLevel = 'critical';
      } else if (result.riskLevel === 'high' && overallRiskLevel !== 'critical') {
        overallRiskLevel = 'high';
      } else if (result.riskLevel === 'medium' && overallRiskLevel === 'low') {
        overallRiskLevel = 'medium';
      }
    }

    const isValid = Object.values(fieldResults).every(result => result.isValid);

    // Log form validation summary
    if (overallRiskLevel === 'critical' || overallRiskLevel === 'high') {
      await auditLogger.logSecurityEvent({
        event_type: 'high_risk_form_validation',
        event_data: {
          context: context || 'unknown',
          overallRiskLevel,
          fieldCount: Object.keys(config).length,
          invalidFields: Object.entries(fieldResults)
            .filter(([_, result]) => !result.isValid)
            .map(([name, _]) => name),
          riskDistribution: Object.values(fieldResults).reduce((acc, result) => {
            acc[result.riskLevel]++;
            return acc;
          }, { low: 0, medium: 0, high: 0, critical: 0 } as Record<string, number>)
        }
      });
    }

    return {
      isValid,
      fieldResults,
      overallRiskLevel,
      sanitizedData
    };
  }

  async validateFileUpload(
    file: File,
    allowedTypes: string[] = [],
    maxSize: number = 5 * 1024 * 1024,
    context?: string
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    try {
      // File size validation
      if (file.size > maxSize) {
        errors.push(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
        riskLevel = 'medium';
      }

      // File type validation
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        errors.push(`File type ${file.type} is not allowed`);
        riskLevel = 'medium';
      }

      // Dangerous file extension check
      const dangerousExtensions = [
        '.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar',
        '.msi', '.dll', '.app', '.deb', '.rpm', '.dmg', '.pkg', '.sh', '.php'
      ];
      
      const fileName = file.name.toLowerCase();
      const hasDangerousExtension = dangerousExtensions.some(ext => fileName.endsWith(ext));
      
      if (hasDangerousExtension) {
        errors.push('File type not allowed for security reasons');
        riskLevel = 'critical';
      }

      // Filename validation
      const filenameValidation = comprehensiveInputValidation.validateInput(file.name, 'filename');
      if (!filenameValidation.isValid) {
        errors.push(...filenameValidation.errors);
        riskLevel = 'high';
      }

      // Double extension check (e.g., file.txt.exe)
      const extensionCount = (file.name.match(/\./g) || []).length;
      if (extensionCount > 1) {
        warnings.push('File has multiple extensions - please verify this is intentional');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      // Log high-risk file upload attempts
      if (riskLevel === 'critical' || riskLevel === 'high') {
        await auditLogger.logSecurityEvent({
          event_type: 'high_risk_file_upload',
          event_data: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            riskLevel,
            context: context || 'unknown',
            hasDangerousExtension,
            extensionCount
          }
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        sanitizedValue: filenameValidation.sanitized,
        riskLevel
      };
    } catch (error) {
      productionLogger.error('File validation error', error, 'EnhancedInputValidation');
      return {
        isValid: false,
        errors: ['File validation failed'],
        warnings: [],
        sanitizedValue: file.name,
        riskLevel: 'medium'
      };
    }
  }

  // Predefined validation rules for common form fields
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

export const enhancedInputValidation = EnhancedInputValidation.getInstance();
