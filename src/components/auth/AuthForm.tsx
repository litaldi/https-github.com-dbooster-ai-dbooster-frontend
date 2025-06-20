
import React, { useState } from 'react';
import { AuthFormHeader } from './AuthFormHeader';
import { AuthFormFields } from './AuthFormFields';
import { AuthFormActions } from './AuthFormActions';
import { AuthFormFooter } from './AuthFormFooter';
import { useAuth } from '@/hooks/useAuth';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import type { AuthMode } from '@/types/auth';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  const {
    loginType,
    setLoginType,
    rememberMe,
    setRememberMe,
    formData,
    handleInputChange,
    handleRememberMe
  } = useAuth(mode);

  const {
    errors,
    handleBlur,
    validateAll,
    getFieldValidation
  } = useAuthValidation(mode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll(formData, loginType)) {
      return;
    }
    setIsLoading(true);
    
    try {
      // Handle authentication logic here
      console.log('Form submitted:', { mode, formData });
      
      if (mode === 'login' && rememberMe) {
        handleRememberMe();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = () => {
    console.log('Password reset requested');
  };

  return (
    <div className="space-y-6">
      <AuthFormHeader mode={mode} onModeChange={setMode} />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormFields 
          mode={mode}
          loginType={loginType}
          setLoginType={setLoginType}
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onBlur={(field) => handleBlur(field, formData, loginType)}
          getFieldValidation={(field) => getFieldValidation(field, formData, loginType)}
        />
        
        <AuthFormActions 
          mode={mode}
          isLoading={isLoading}
          rememberMe={rememberMe}
          onRememberMeChange={setRememberMe}
          onModeChange={setMode}
        />
      </form>
      
      <AuthFormFooter 
        mode={mode}
        onModeChange={setMode}
        rememberMe={rememberMe}
        onRememberMeChange={setRememberMe}
        onPasswordReset={handlePasswordReset}
      />
    </div>
  );
}
