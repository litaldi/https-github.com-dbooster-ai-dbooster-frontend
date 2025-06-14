
import { useState } from 'react';

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

export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  rules: Partial<Record<keyof T, ValidationRule>>
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (field: keyof T, value: string): ValidationResult => {
    const rule = rules[field];
    if (!rule) return { isValid: true };

    if (rule.required && !value.trim()) {
      return { isValid: false, error: 'This field is required' };
    }

    if (rule.minLength && value.length < rule.minLength) {
      return { isValid: false, error: `Must be at least ${rule.minLength} characters` };
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return { isValid: false, error: `Must be less than ${rule.maxLength} characters` };
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return { isValid: false, error: 'Invalid format' };
    }

    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return { isValid: false, error: customError };
      }
    }

    return { isValid: true };
  };

  const handleChange = (field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const validation = validateField(field, value);
      setErrors(prev => ({ 
        ...prev, 
        [field]: validation.error || undefined 
      }));
    }
  };

  const handleBlur = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validation = validateField(field, data[field]);
    setErrors(prev => ({ 
      ...prev, 
      [field]: validation.error || undefined 
    }));
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(data).forEach(key => {
      const field = key as keyof T;
      const validation = validateField(field, data[field]);
      if (!validation.isValid) {
        newErrors[field] = validation.error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(data).reduce((acc, key) => ({ 
      ...acc, 
      [key]: true 
    }), {} as Partial<Record<keyof T, boolean>>));

    return isValid;
  };

  const getFieldValidation = (field: keyof T) => {
    const hasError = touched[field] && errors[field];
    const hasValue = data[field]?.toString().length > 0;
    const isValid = touched[field] && hasValue && !errors[field];
    
    return {
      isValid,
      hasError: !!hasError,
      errorMessage: hasError ? errors[field] : undefined
    };
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    getFieldValidation,
    setData,
    setErrors
  };
}
