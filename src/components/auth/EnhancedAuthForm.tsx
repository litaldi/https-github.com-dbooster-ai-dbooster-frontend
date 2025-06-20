
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';
import { Loader2, Shield } from 'lucide-react';

interface EnhancedAuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
}

export function EnhancedAuthForm({ isLogin, onToggleMode }: EnhancedAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { validateInput, detectThreatOnLogin, rotateSensitiveSession } = useEnhancedSecurity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate and sanitize inputs
      const sanitizedEmail = await validateInput(email, 'auth_email');
      const sanitizedName = name ? await validateInput(name, 'auth_name') : '';

      if (!sanitizedEmail || (name && !sanitizedName)) {
        return;
      }

      // Detect potential threats
      const isSafeToLogin = await detectThreatOnLogin(sanitizedEmail);
      if (!isSafeToLogin) {
        return;
      }

      if (isLogin) {
        await signIn(sanitizedEmail, password);
        // Rotate session after successful login
        await rotateSensitiveSession();
      } else {
        // Fix: signUp expects a single object parameter
        await signUp({
          email: sanitizedEmail,
          password: password,
          name: sanitizedName || ''
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle className="text-2xl">
            {isLogin ? 'Sign In' : 'Create Account'}
          </CardTitle>
        </div>
        <CardDescription>
          {isLogin 
            ? 'Welcome back! Please sign in to your account.' 
            : 'Create a new account to get started with DBooster.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                {isLogin ? 'Sign In Securely' : 'Create Secure Account'}
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-sm text-primary hover:underline"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'
            }
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
