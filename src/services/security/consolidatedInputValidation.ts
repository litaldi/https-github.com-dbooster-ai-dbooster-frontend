
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue: string;
}

export const consolidatedInputValidation = {
  validateAndSanitize: (value: string, context: string = 'general'): ValidationResult => {
    const errors: string[] = [];
    let sanitizedValue = value.trim();
    
    // Basic validation
    if (!sanitizedValue) {
      errors.push('Value cannot be empty');
      return { isValid: false, errors, sanitizedValue };
    }

    // Context-specific validation
    switch (context) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedValue)) {
          errors.push('Invalid email format');
        }
        break;
      case 'password':
        if (sanitizedValue.length < 8) {
          errors.push('Password must be at least 8 characters long');
        }
        break;
      case 'name':
        if (sanitizedValue.length < 2) {
          errors.push('Name must be at least 2 characters long');
        }
        break;
    }

    // Basic sanitization - remove potentially harmful characters
    sanitizedValue = sanitizedValue.replace(/[<>]/g, '');

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    };
  }
};
