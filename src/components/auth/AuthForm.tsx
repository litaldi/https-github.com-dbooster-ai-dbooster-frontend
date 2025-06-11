
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs } from '@/components/ui/tabs';
import { AlertCircle, Loader2 } from 'lucide-react';
import { PasswordReset } from './PasswordReset';
import { LoginTypeSelector } from './LoginTypeSelector';
import { LoginTypeFields } from './LoginTypeFields';
import { PasswordField } from './PasswordField';
import { AuthFormFooter } from './AuthFormFooter';
import { useAuthForm } from '@/hooks/useAuthForm';

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
    validate,
    handleRememberMe
  } = useAuthForm(mode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      handleRememberMe();

      if (mode === 'login') {
        if (loginType === 'email') {
          await loginWithEmail(formData.email, formData.password);
        } else {
          await loginWithPhone(formData.phone, formData.password);
        }
      } else {
        if (loginType === 'email') {
          await signupWithEmail(formData.email, formData.password, formData.name);
        } else {
          await signupWithPhone(formData.phone, formData.password, formData.name);
        }
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showPasswordReset) {
    return <PasswordReset onBack={() => setShowPasswordReset(false)} />;
  }

  return (
    <Card className="w-full max-w-md">
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
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  autoComplete="name"
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <LoginTypeFields
              loginType={loginType}
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <PasswordField
              id="password"
              label="Password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Enter your password"
              error={errors.password}
              autoComplete={mode === 'login' ? "current-password" : "new-password"}
              showStrength={mode === 'signup'}
            />

            {mode === 'signup' && (
              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                autoComplete="new-password"
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
      </CardContent>
    </Card>
  );
}
