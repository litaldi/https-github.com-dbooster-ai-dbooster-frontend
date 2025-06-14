
import { useState, useEffect } from 'react';
import { validateForm } from '@/utils/authValidation';

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
  const [showPassword, setShowPassword] = useState(false);
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

  // Load remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem('dbooster_remember_me');
    const savedEmail = localStorage.getItem('dbooster_email');
    if (remembered && savedEmail) {
      setRememberMe(true);
      setFormData(prev => ({ ...prev, email: savedEmail }));
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
    if (rememberMe) {
      localStorage.setItem('dbooster_remember_me', 'true');
      localStorage.setItem('dbooster_email', formData.email);
    } else {
      localStorage.removeItem('dbooster_remember_me');
      localStorage.removeItem('dbooster_email');
    }
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
    showPassword,
    setShowPassword,
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
