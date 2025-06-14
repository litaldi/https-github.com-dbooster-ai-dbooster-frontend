
import { useState, useEffect } from 'react';
import { validateForm } from '@/utils/authValidation';
import { getStoredAuthData, storeAuthData } from '@/utils/authUtils';

interface FormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  name: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export function useAuthForm(mode: 'login' | 'signup') {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Load stored auth data on mount
  useEffect(() => {
    const { rememberMe: storedRememberMe, email: storedEmail } = getStoredAuthData();
    if (storedRememberMe && storedEmail) {
      setRememberMe(true);
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation for touched fields
    if (touched[field]) {
      const newErrors = validateForm({ ...formData, [field]: value }, mode, loginType);
      setErrors(prev => ({ 
        ...prev, 
        [field]: newErrors[field] || '' 
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    const newErrors = validateForm(formData, mode, loginType);
    setErrors(prev => ({ 
      ...prev, 
      [field]: newErrors[field] || '' 
    }));
  };

  const validate = (): boolean => {
    const newErrors = validateForm(formData, mode, loginType);
    setErrors(newErrors);
    
    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    return Object.keys(newErrors).length === 0;
  };

  const handleRememberMe = () => {
    storeAuthData(formData.email, rememberMe);
  };

  const getFieldValidation = (field: string) => {
    const hasError = touched[field] && errors[field];
    const hasValue = formData[field as keyof FormData]?.length > 0;
    const isValid = touched[field] && hasValue && !errors[field];
    
    return {
      isValid,
      hasError: !!hasError,
      errorMessage: hasError ? errors[field] : undefined
    };
  };

  return {
    loginType,
    setLoginType,
    rememberMe,
    setRememberMe,
    formData,
    errors,
    setErrors,
    touched,
    handleInputChange,
    handleBlur,
    validate,
    handleRememberMe,
    getFieldValidation
  };
}
