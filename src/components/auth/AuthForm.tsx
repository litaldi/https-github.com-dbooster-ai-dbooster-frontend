
import React from 'react';
import { AuthFormHeader } from './AuthFormHeader';
import { AuthFormFields } from './AuthFormFields';
import { AuthFormActions } from './AuthFormActions';
import { AuthFormFooter } from './AuthFormFooter';
import { useAuthForm } from '@/hooks/useAuthForm';

export function AuthForm() {
  const {
    mode,
    setMode,
    loginType,
    setLoginType,
    rememberMe,
    setRememberMe,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    isLoading,
    handleSubmit,
    getFieldValidation
  } = useAuthForm();

  return (
    <div className="space-y-6">
      <AuthFormHeader mode={mode} onModeChange={setMode} />
      
      <AuthFormFields 
        mode={mode}
        loginType={loginType}
        setLoginType={setLoginType}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        getFieldValidation={getFieldValidation}
      />
      
      <AuthFormActions 
        mode={mode}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
      
      <AuthFormFooter mode={mode} />
    </div>
  );
}
