
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import type { AuthMode } from '@/types/auth';

interface LoginCardProps {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function LoginCard({ authMode, onAuthModeChange, onSubmit, isLoading }: LoginCardProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    rememberMe: false,
    acceptedTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center space-x-1 mb-4">
          <Button
            variant={authMode === 'login' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 px-3"
            onClick={() => onAuthModeChange('login')}
          >
            Sign In
          </Button>
          <Button
            variant={authMode === 'signup' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 px-3"
            onClick={() => onAuthModeChange('signup')}
          >
            Sign Up
          </Button>
        </div>
        <CardTitle className="text-2xl text-center">
          {authMode === 'login' ? 'Welcome back' : 'Create account'}
        </CardTitle>
        <CardDescription className="text-center">
          {authMode === 'login' 
            ? 'Enter your credentials to access your account'
            : 'Fill in your details to get started'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {authMode === 'login' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => handleInputChange('rememberMe', checked)}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                Remember me
              </Label>
            </div>
          )}

          {authMode === 'signup' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptedTerms"
                checked={formData.acceptedTerms}
                onCheckedChange={(checked) => handleInputChange('acceptedTerms', checked)}
                required
              />
              <Label htmlFor="acceptedTerms" className="text-sm">
                I accept the terms and conditions
              </Label>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        {authMode === 'login' && (
          <>
            <Separator className="my-4" />
            <div className="text-center">
              <Button variant="link" size="sm">
                Forgot your password?
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
