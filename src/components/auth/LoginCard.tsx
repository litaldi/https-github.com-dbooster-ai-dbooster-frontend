
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EnhancedAuthForm } from './EnhancedAuthForm';
import type { AuthMode, AuthFormData } from '@/types/auth';

interface LoginCardProps {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading: boolean;
}

export function LoginCard({ authMode, onAuthModeChange, onSubmit, isLoading }: LoginCardProps) {
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
          <Button
            variant={authMode === 'reset' ? 'default' : 'ghost'}
            size="sm"
            className="h-8 px-3"
            onClick={() => onAuthModeChange('reset')}
          >
            Reset
          </Button>
        </div>
        <CardTitle className="text-2xl text-center">
          {authMode === 'login' ? 'Welcome back' : 
           authMode === 'signup' ? 'Create account' : 
           'Reset password'}
        </CardTitle>
        <CardDescription className="text-center">
          {authMode === 'login' 
            ? 'Enter your credentials to access your account'
            : authMode === 'signup'
            ? 'Fill in your details to get started'
            : 'Enter your email to reset your password'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EnhancedAuthForm
          authMode={authMode}
          onAuthModeChange={onAuthModeChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />

        {authMode === 'login' && (
          <>
            <Separator className="my-4" />
            <div className="text-center">
              <Button variant="link" size="sm" onClick={() => onAuthModeChange('reset')}>
                Forgot your password?
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
