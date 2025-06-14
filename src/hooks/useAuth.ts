
import { useState, useEffect } from 'react';
import { useFormValidation } from './useFormValidation';
import { getStoredAuthData, storeAuthData } from '@/utils/authUtils';
import { emailPattern, phonePattern, passwordValidator, confirmPasswordValidator } from '@/utils/validation';

interface AuthFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function useAuthForm(mode: 'login' | 'signup') {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [rememberMe, setRememberMe] = useState(false);

  const initialData: AuthFormData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  const validationRules = {
    name: mode === 'signup' ? { required: true, minLength: 2 } : undefined,
    email: loginType === 'email' ? { 
      required: true, 
      pattern: emailPattern 
    } : undefined,
    phone: loginType === 'phone' ? { 
      required: true, 
      pattern: phonePattern 
    } : undefined,
    password: { 
      required: true, 
      custom: mode === 'signup' ? passwordValidator : undefined,
      minLength: mode === 'login' ? 1 : 8
    },
    confirmPassword: mode === 'signup' ? { 
      required: true, 
      custom: confirmPasswordValidator(data.password)
    } : undefined
  };

  const {
    data,
    errors,
    handleChange,
    handleBlur,
    validateAll,
    getFieldValidation,
    setData
  } = useFormValidation(initialData, validationRules);

  // Load stored auth data on mount
  useEffect(() => {
    const { rememberMe: storedRememberMe, email: storedEmail } = getStoredAuthData();
    if (storedRememberMe && storedEmail) {
      setRememberMe(true);
      setData(prev => ({ ...prev, email: storedEmail }));
    }
  }, [setData]);

  const handleRememberMe = () => {
    if (rememberMe) {
      storeAuthData(data.email, true);
    }
  };

  return {
    loginType,
    setLoginType,
    rememberMe,
    setRememberMe,
    formData: data,
    errors,
    handleInputChange: handleChange,
    handleBlur,
    validate: validateAll,
    handleRememberMe,
    getFieldValidation
  };
}
