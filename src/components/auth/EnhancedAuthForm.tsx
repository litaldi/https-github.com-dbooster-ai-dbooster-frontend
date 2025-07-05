
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { AuthMode, AuthFormData } from '@/types/auth';

interface EnhancedAuthFormProps {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading?: boolean;
}

export function EnhancedAuthForm({ authMode, onAuthModeChange, onSubmit, isLoading }: EnhancedAuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const updateFormData = (field: keyof AuthFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {authMode === 'signup' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName || ''}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName || ''}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              required
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData('password', e.target.value)}
          required
        />
      </div>

      {authMode === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword || ''}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            required
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {authMode === 'login' ? 'Signing in...' : 'Creating account...'}
          </>
        ) : (
          authMode === 'login' ? 'Sign In' : 'Create Account'
        )}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={() => onAuthModeChange(authMode === 'login' ? 'signup' : 'login')}
          className="text-sm"
        >
          {authMode === 'login' 
            ? "Don't have an account? Sign up" 
            : 'Already have an account? Sign in'
          }
        </Button>
      </div>
    </form>
  );
}
