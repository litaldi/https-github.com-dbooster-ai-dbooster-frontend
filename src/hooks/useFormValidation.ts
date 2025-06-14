
import { useState, useCallback } from 'react';
import { validateEmail, validatePhone, validateName, passwordValidator } from '@/utils/validation';

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationConfig {
  required?: string[];
  validators?: Record<string, (value: any) => string | null>;
}

export function useFormValidation(config: FormValidationConfig = {}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((field: string, value: any): string | null => {
    // Check if field is required
    if (config.required?.includes(field) && (!value || value.toString().trim() === '')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    // Run custom validators
    const validator = config.validators?.[field];
    if (validator && value) {
      return validator(value);
    }

    // Built-in validators
    switch (field) {
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'name':
        return validateName(value);
      case 'password':
        return passwordValidator(value);
      default:
        return null;
    }
  }, [config]);

  const setFieldTouched = useCallback((field: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const setFieldError = useCallback((field: string, error: string | null) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  }, []);

  const validateForm = useCallback((formData: Record<string, any>): boolean => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    Object.keys(formData).forEach(field => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldValidation = useCallback((field: string, value: any) => {
    const hasError = !!errors[field];
    const isValid = touched[field] && !hasError && !!value;
    
    return {
      isValid,
      hasError,
      errorMessage: errors[field]
    };
  }, [errors, touched]);

  return {
    errors,
    touched,
    validateField,
    validateForm,
    setFieldTouched,
    setFieldError,
    clearErrors,
    getFieldValidation,
    hasErrors: Object.keys(errors).length > 0
  };
}
