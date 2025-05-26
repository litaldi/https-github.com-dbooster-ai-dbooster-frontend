
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const { loginWithEmail, loginWithPhone, signupWithEmail, signupWithPhone, isLoading } = useAuth();
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (loginType === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'signup' && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (mode === 'signup') {
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
    
    try {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

        <Tabs value={loginType} onValueChange={(value) => setLoginType(value as 'email' | 'phone')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone
            </TabsTrigger>
          </TabsList>

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
                  className={cn(errors.name && "border-destructive")}
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

            <TabsContent value="email" className="space-y-2 mt-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn(errors.email && "border-destructive")}
                aria-describedby={errors.email ? "email-error" : undefined}
                autoComplete="email"
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </TabsContent>

            <TabsContent value="phone" className="space-y-2 mt-4">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn(errors.phone && "border-destructive")}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                autoComplete="tel"
              />
              {errors.phone && (
                <p id="phone-error" className="text-sm text-destructive" role="alert">
                  {errors.phone}
                </p>
              )}
            </TabsContent>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={cn(errors.password && "border-destructive", "pr-10")}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  autoComplete={mode === 'login' ? "current-password" : "new-password"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={cn(errors.confirmPassword && "border-destructive")}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="text-sm text-destructive" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

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

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </span>{' '}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
