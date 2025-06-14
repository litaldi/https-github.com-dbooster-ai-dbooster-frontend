
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs } from '@/components/ui/tabs';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { PasswordReset } from './PasswordReset';
import { LoginTypeSelector } from './LoginTypeSelector';
import { LoginTypeFields } from './LoginTypeFields';
import { PasswordField } from './PasswordField';
import { AuthFormFooter } from './AuthFormFooter';
import { useAuthForm } from '@/hooks/useAuthForm';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const { loginWithEmail, loginWithPhone, signupWithEmail, signupWithPhone, isLoading } = useAuth();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      enhancedToast.error({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting.'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      handleRememberMe();

      if (mode === 'login') {
        if (loginType === 'email') {
          await loginWithEmail(formData.email, formData.password);
        } else {
          await loginWithPhone(formData.phone, formData.password);
        }
        
        enhancedToast.success({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.'
        });
      } else {
        if (loginType === 'email') {
          await signupWithEmail(formData.email, formData.password, formData.name);
        } else {
          await signupWithPhone(formData.phone, formData.password, formData.name);
        }
        
        enhancedToast.success({
          title: 'Account Created!',
          description: 'Welcome to DBooster. Your account has been created successfully.'
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred. Please try again.';
      setErrors({ submit: errorMessage });
      
      enhancedToast.error({
        title: mode === 'login' ? 'Login Failed' : 'Signup Failed',
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showPasswordReset) {
    return <PasswordReset onBack={() => setShowPasswordReset(false)} />;
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Sign in to your account to continue'
            : 'Enter your details to create your account'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errors.submit && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <Tabs value={loginType}>
          <LoginTypeSelector loginType={loginType} onTypeChange={setLoginType} />

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <EnhancedInput
                id="name"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                error={getFieldValidation('name').errorMessage}
                isValid={getFieldValidation('name').isValid}
                showValidation={true}
                autoComplete="name"
                required
              />
            )}

            <LoginTypeFields
              loginType={loginType}
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              getFieldValidation={getFieldValidation}
            />

            <PasswordField
              id="password"
              label="Password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your password"
              error={getFieldValidation('password').errorMessage}
              isValid={getFieldValidation('password').isValid}
              autoComplete={mode === 'login' ? "current-password" : "new-password"}
              showStrength={mode === 'signup'}
              required
            />

            {mode === 'signup' && (
              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword', value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Confirm your password"
                error={getFieldValidation('confirmPassword').errorMessage}
                isValid={getFieldValidation('confirmPassword').isValid}
                autoComplete="new-password"
                required
              />
            )}

            <AuthFormFooter
              mode={mode}
              onModeChange={onModeChange}
              rememberMe={rememberMe}
              onRememberMeChange={setRememberMe}
              onPasswordReset={() => setShowPasswordReset(true)}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isSubmitting}
              aria-label={mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Tabs>

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline hover:text-primary">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
