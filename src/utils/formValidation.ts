
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateField(value: string, rules: ValidationRule): ValidationResult {
  if (rules.required && !value.trim()) {
    return { isValid: false, error: 'This field is required' };
  }

  if (rules.minLength && value.length < rules.minLength) {
    return { isValid: false, error: `Must be at least ${rules.minLength} characters` };
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return { isValid: false, error: `Must be less than ${rules.maxLength} characters` };
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: 'Invalid format' };
  }

  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true };
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

export const passwordRules: ValidationRule = {
  required: true,
  minLength: 8,
  custom: (value: string) => {
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    return null;
  }
};
