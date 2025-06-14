
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { PasswordField } from '@/components/auth/PasswordField';
import { LoginTypeSelector } from '@/components/auth/LoginTypeSelector';
import { LoginTypeFields } from '@/components/auth/LoginTypeFields';
import { useAuthForm } from '@/hooks/useAuthForm';
import { Loader2, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      {/* Login Type Selector */}
      <LoginTypeSelector 
        loginType={loginType} 
        onTypeChange={setLoginType} 
      />

      {/* Name field for signup */}
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
          aria-describedby="name-help"
        />
      )}

      {/* Email/Phone Fields */}
      <LoginTypeFields
        loginType={loginType}
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
        getFieldValidation={getFieldValidation}
      />

      {/* Password Field */}
      <PasswordField
        id="password"
        label="Password"
        value={formData.password}
        onChange={(value) => handleInputChange('password', value)}
        placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'}
        error={getFieldValidation('password').errorMessage}
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        showStrength={mode === 'signup'}
      />

      {/* Confirm Password for signup */}
      {mode === 'signup' && (
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
          placeholder="Confirm your password"
          error={getFieldValidation('confirmPassword').errorMessage}
          autoComplete="new-password"
        />
      )}

      {/* Remember Me & Forgot Password */}
      {mode === 'login' && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => {
              toast({
                title: "Feature Coming Soon",
                description: "Password reset functionality will be available soon.",
              });
            }}
            className="px-0 text-blue-600 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Forgot password?
          </Button>
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        size="lg"
        aria-describedby={errors.submit ? 'submit-error' : undefined}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
            {mode === 'login' ? 'Signing in...' : 'Creating account...'}
          </>
        ) : (
          <>
            {mode === 'login' ? (
              <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" aria-hidden="true" />
            )}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </>
        )}
      </Button>

      {/* Mode Switch */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        </span>
        <Button
          type="button"
          variant="link"
          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          className="px-0 text-blue-600 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
}
