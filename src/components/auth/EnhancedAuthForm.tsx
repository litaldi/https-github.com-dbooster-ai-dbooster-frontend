
import { useState } from 'react';
import { useAuth as useAuthContext } from '@/contexts/auth-context';
import { LoginTypeSelector } from '@/components/auth/LoginTypeSelector';
import { AuthFormFields } from '@/components/auth/AuthFormFields';
import { AuthFormActions } from '@/components/auth/AuthFormActions';
import { useAuth } from '@/hooks/useAuth';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { AuthMode } from '@/types/auth';

interface EnhancedAuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function EnhancedAuthForm({ mode, onModeChange }: EnhancedAuthFormProps) {
  const { signIn, signUp } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    loginType,
    setLoginType,
    rememberMe,
    setRememberMe,
    formData,
    handleInputChange,
    handleRememberMe,
    resetForm
  } = useAuth(mode);

  const {
    errors,
    handleBlur,
    validateAll,
    getFieldValidation,
    clearErrors
  } = useAuthValidation(mode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll(formData, loginType)) {
      enhancedToast.error({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
      });
      return;
    }

    setIsLoading(true);
    clearErrors();
    setSubmitError('');

    try {
      const identifier = loginType === 'email' ? formData.email : formData.phone;
      
      if (mode === 'login') {
        const { error } = await signIn(identifier, formData.password);
        if (error) {
          const errorMessage = error.message.includes('Invalid login credentials') 
            ? 'Invalid email or password. Please check your credentials and try again.'
            : error.message;
          setSubmitError(errorMessage);
          enhancedToast.error({
            title: "Login Failed",
            description: errorMessage,
          });
        } else {
          if (rememberMe) {
            handleRememberMe();
          }
          enhancedToast.success({
            title: "Welcome back!",
            description: "You have been successfully signed in.",
          });
        }
      } else {
        const userData: any = {
          [loginType]: identifier,
          password: formData.password,
        };
        
        if (formData.name) {
          userData.options = {
            data: { full_name: formData.name },
            emailRedirectTo: `${window.location.origin}/`
          };
        }

        const { error } = await signUp(userData);
        if (error) {
          const errorMessage = error.message.includes('User already registered')
            ? 'An account with this email already exists. Please try logging in instead.'
            : error.message;
          setSubmitError(errorMessage);
          enhancedToast.error({
            title: "Signup Failed",
            description: errorMessage,
          });
        } else {
          enhancedToast.success({
            title: "Account Created!",
            description: "Please check your email to verify your account.",
          });
          resetForm();
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred. Please try again.';
      setSubmitError(errorMessage);
      enhancedToast.error({
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6" 
      role="form" 
      aria-label={`${mode === 'login' ? 'Sign in' : 'Sign up'} form`}
      noValidate
    >
      <LoginTypeSelector 
        loginType={loginType} 
        onTypeChange={setLoginType} 
      />

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

      {submitError && (
        <Alert variant="destructive" role="alert" className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-4" role="status" aria-live="polite">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">
            {mode === 'login' ? 'Signing you in...' : 'Creating your account...'}
          </span>
        </div>
      )}

      <AuthFormActions
        mode={mode}
        isLoading={isLoading}
        rememberMe={rememberMe}
        onRememberMeChange={setRememberMe}
        onModeChange={onModeChange}
      />
    </form>
  );
}
