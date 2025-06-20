
import { useState } from 'react';
import { validateForm } from '@/utils/authValidation';
import type { AuthFormData, AuthMode, LoginType, ValidationResult } from '@/types/auth';

export function useAuthValidation(mode: AuthMode) {
  const [errors, setErrors] = useState<Partial<Record<keyof AuthFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof AuthFormData, boolean>>>({});

  const validateField = (field: keyof AuthFormData, formData: AuthFormData, loginType: LoginType): ValidationResult => {
    const validationMode = mode === 'register' ? 'register' : 'login';
    const fieldErrors = validateForm(formData, validationMode, loginType);
    const hasError = !!fieldErrors[field];
    const isValid = touched[field] && !hasError && !!formData[field];
    
    return {
      isValid,
      hasError,
      errorMessage: hasError ? fieldErrors[field] : undefined
    };
  };

  const handleBlur = (field: keyof AuthFormData, formData: AuthFormData, loginType: LoginType) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validation = validateField(field, formData, loginType);
    setErrors(prev => ({ 
      ...prev, 
      [field]: validation.errorMessage 
    }));
  };

  const validateAll = (formData: AuthFormData, loginType: LoginType): boolean => {
    const validationMode = mode === 'register' ? 'register' : 'login';
    const newErrors = validateForm(formData, validationMode, loginType);
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ 
      ...acc, 
      [key]: true 
    }), {} as Partial<Record<keyof AuthFormData, boolean>>));

    return Object.keys(newErrors).length === 0;
  };

  const getFieldValidation = (field: keyof AuthFormData, formData: AuthFormData, loginType: LoginType): ValidationResult => {
    return validateField(field, formData, loginType);
  };

  const clearErrors = () => {
    setErrors({});
    setTouched({});
  };

  return {
    errors,
    touched,
    handleBlur,
    validateAll,
    getFieldValidation,
    clearErrors,
    setErrors
  };
}
