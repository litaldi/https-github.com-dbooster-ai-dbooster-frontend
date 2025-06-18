
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { LoginHeader } from '@/components/auth/LoginHeader';
import { LoginFooter } from '@/components/auth/LoginFooter';
import { DemoModeButton } from '@/components/auth/DemoModeButton';
import { EnhancedLoading } from '@/components/ui/enhanced-loading';
import { AccessibilityEnhancements } from '@/components/ui/accessibility-enhancements';
import { SkipLink } from '@/components/ui/accessibility-helpers';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { InputField } from '@/components/forms/InputField';
import { PasswordField } from '@/components/forms/PasswordField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, KeyRound, UserPlus } from 'lucide-react';

export default function Login() {
  const { user, isLoading, signIn, signUp } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const timer = setTimeout(() => setIsPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (authMode === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      if (authMode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setSubmitError(error.message.includes('Invalid login credentials') 
            ? 'Invalid email or password. Please check your credentials and try again.'
            : error.message);
        }
      } else {
        const { error } = await signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.name },
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) {
          setSubmitError(error.message.includes('User already registered')
            ? 'An account with this email already exists. Please try logging in instead.'
            : error.message);
        }
      }
    } catch (error: any) {
      setSubmitError(error?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isPageLoading) {
    return (
      <EnhancedLoading 
        variant="full-screen" 
        text="Loading authentication..." 
        showProgress={true}
        progress={isPageLoading ? 50 : 90}
      />
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AccessibilityEnhancements />
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <AnimatedBackground />
        
        <main id="main-content" className="w-full max-w-md space-y-6 animate-fade-in">
          <LoginHeader />
          
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-left">
                {authMode === 'login' ? 'Welcome back! Please log in to continue.' : 'Create your account'}
              </CardTitle>
              <CardDescription className="text-sm text-left">
                {authMode === 'login' 
                  ? 'Enter your credentials to access your dashboard'
                  : 'Sign up to start optimizing your database performance'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Auth Mode Toggle */}
              <div className="grid grid-cols-2 gap-3" role="tablist" aria-label="Authentication mode">
                <Button
                  variant={authMode === 'login' ? 'default' : 'outline'}
                  onClick={() => setAuthMode('login')}
                  className="flex items-center gap-2 justify-start"
                  role="tab"
                  aria-selected={authMode === 'login'}
                >
                  <KeyRound className="h-4 w-4" />
                  Log In
                </Button>
                <Button
                  variant={authMode === 'signup' ? 'default' : 'outline'}
                  onClick={() => setAuthMode('signup')}
                  className="flex items-center gap-2 justify-start"
                  role="tab"
                  aria-selected={authMode === 'signup'}
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" role="form">
                {authMode === 'signup' && (
                  <InputField
                    id="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                    error={errors.name}
                    required
                    autoComplete="name"
                  />
                )}

                <InputField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  error={errors.email}
                  required
                  autoComplete="email"
                />

                <PasswordField
                  id="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                  error={errors.password}
                  required
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                />

                {authMode === 'signup' && (
                  <PasswordField
                    id="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
                    error={errors.confirmPassword}
                    required
                    autoComplete="new-password"
                  />
                )}

                {authMode === 'login' && (
                  <div className="flex items-center justify-between text-left">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                      />
                      <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {submitError && (
                  <Alert variant="destructive" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Please wait...' : (authMode === 'login' ? 'Log In' : 'Sign Up')}
                </Button>

                <div className="text-center text-sm text-left">
                  <span className="text-muted-foreground">
                    {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  </span>{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    {authMode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </div>

                {authMode === 'signup' && (
                  <p className="text-xs text-muted-foreground text-left">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          <DemoModeButton />
          <LoginFooter />
        </main>
      </div>
    </>
  );
}
