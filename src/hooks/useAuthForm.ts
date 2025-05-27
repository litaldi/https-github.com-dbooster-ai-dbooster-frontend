
import { useState, useEffect } from 'react';
import { validateForm } from '@/utils/authValidation';

interface FormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  name: string;
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors = validateForm(formData, mode, loginType);
    setErrors(newErrors);
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
    handleInputChange,
    validate,
    handleRememberMe
  };
}
