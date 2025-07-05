
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { LoginCard } from '@/components/auth/LoginCard';
import { DemoModeButton } from '@/components/auth/DemoModeButton';
import type { AuthMode, AuthFormData } from '@/types/auth';

export default function Login() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const navigate = useNavigate();
  const { signIn, signUp, user, isLoading } = useAuth();

  // Redirect if already authenticated
  if (user) {
    navigate('/app', { replace: true });
    return null;
  }

  const handleSubmit = async (formData: AuthFormData) => {
    try {
      if (authMode === 'login') {
        const result = await signIn(formData.email, formData.password);
        if (!result.error) {
          navigate('/app', { replace: true });
        } else {
          console.error('Login error:', result.error);
        }
      } else if (authMode === 'signup') {
        if (!formData.firstName || !formData.lastName) {
          throw new Error('First name and last name are required');
        }
        
        const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
        const result = await signUp(formData.email, formData.password, fullName, true);
        
        if (!result.error) {
          console.log('Please check your email for verification');
        } else {
          console.error('Signup error:', result.error);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      console.error('Auth error:', errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <LoginCard
          authMode={authMode}
          onAuthModeChange={setAuthMode}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <DemoModeButton />

        <div className="text-center text-xs text-muted-foreground">
          <p>Trusted by 10,000+ developers worldwide</p>
          <p className="mt-1">SOC2 compliant • Enterprise ready • 24/7 support</p>
        </div>
      </div>
    </div>
  );
}
