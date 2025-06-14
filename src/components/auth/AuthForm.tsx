
import React, { useState } from 'react';
import { AuthFormHeader } from './AuthFormHeader';
import { AuthFormFields } from './AuthFormFields';
import { AuthFormActions } from './AuthFormActions';
import { AuthFormFooter } from './AuthFormFooter';
import { useAuthForm } from '@/hooks/useAuthForm';

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const {
    loginType,
    setLoginType,
    rememberMe,
    setRememberMe,
    formData,
    errors,
    handleInputChange,
    handleBlur,
    validate,
    handleRememberMe,
    getFieldValidation
  } = useAuthForm(mode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setIsLoading(true);
    // Handle authentication logic here
    console.log('Form submitted:', { mode, formData });
    setIsLoading(false);
  };

  const handlePasswordReset = () => {
    console.log('Password reset requested');
  };

  return (
    <div className="space-y-6">
      <AuthFormHeader mode={mode} onModeChange={setMode} />
      
      <AuthFormFields 
        mode={mode}
        loginType={loginType}
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
        getFieldValidation={getFieldValidation}
      />
      
      <AuthFormActions 
        mode={mode}
        isLoading={isLoading}
        rememberMe={rememberMe}
        onRememberMeChange={setRememberMe}
        onModeChange={setMode}
      />
      
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
