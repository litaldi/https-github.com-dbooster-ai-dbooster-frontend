
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { LoginTypeSelector } from '@/components/auth/LoginTypeSelector';
import { AuthFormFields } from '@/components/auth/AuthFormFields';
import { AuthFormActions } from '@/components/auth/AuthFormActions';
import { useAuthForm } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EnhancedAuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function EnhancedAuthForm({ mode, onModeChange }: EnhancedAuthFormProps) {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    loginType,
    setLoginType,
    rememberMe,
    setRememberMe,
    formData,
    errors,
    setErrors,
    handleInputChange,
    handleBlur,
    validate,
    handleRememberMe,
    getFieldValidation
  } = useAuthForm(mode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const identifier = loginType === 'email' ? formData.email : formData.phone;
      
      if (mode === 'login') {
        const { error } = await signIn(identifier, formData.password);
        if (error) {
          const errorMessage = error.message.includes('Invalid login credentials') 
            ? 'Invalid email or password. Please check your credentials and try again.'
            : error.message;
          setErrors({ submit: errorMessage });
          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          if (rememberMe) {
            handleRememberMe();
          }
          toast({
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
          setErrors({ submit: errorMessage });
          toast({
            title: "Signup Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account.",
          });
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred. Please try again.';
      setErrors({ submit: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label={`${mode === 'login' ? 'Sign in' : 'Sign up'} form`}>
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
        onBlur={handleBlur}
        getFieldValidation={getFieldValidation}
      />

      {errors.submit && (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
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
