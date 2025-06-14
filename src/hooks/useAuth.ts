
import { useState, useEffect } from 'react';
import { getStoredAuthData, storeAuthData } from '@/utils/authUtils';
import type { AuthFormData, AuthMode, LoginType } from '@/types/auth';

export function useAuth(mode: AuthMode) {
  const [loginType, setLoginType] = useState<LoginType>('email');
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Load stored auth data on mount
  useEffect(() => {
    const { rememberMe: storedRememberMe, email: storedEmail } = getStoredAuthData();
    if (storedRememberMe && storedEmail) {
      setRememberMe(true);
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRememberMe = () => {
    if (rememberMe) {
      storeAuthData(formData.email, true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
  };

  return {
    loginType,
    setLoginType,
    rememberMe,
    setRememberMe,
    formData,
    handleInputChange,
    handleRememberMe,
    resetForm
  };
}
