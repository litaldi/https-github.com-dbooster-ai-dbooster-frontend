
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedAuthForm } from './EnhancedAuthForm';
import { SocialAuthButtons } from './SocialAuthButtons';
import { Separator } from '@/components/ui/separator';
import { UserRegistrationForm } from './UserRegistrationForm';
import type { AuthMode, AuthFormData } from '@/types/auth';

interface AuthTabsProps {
  onSuccess: () => void;
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

export function AuthTabs({ onSuccess, isLoading, onLoadingChange }: AuthTabsProps) {
  const handleAuthSubmit = async (data: AuthFormData) => {
    // This will be handled by the individual form components
    onSuccess();
  };

  return (
    <Tabs defaultValue="login" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Sign In</TabsTrigger>
        <TabsTrigger value="register">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="space-y-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EnhancedAuthForm
              authMode="login"
              onAuthModeChange={() => {}}
              onSubmit={handleAuthSubmit}
              isLoading={isLoading}
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <SocialAuthButtons
              isLoading={isLoading}
              onLoadingChange={onLoadingChange}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="register" className="space-y-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              Get started with your free account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UserRegistrationForm
              onSuccess={onSuccess}
              onSwitchToLogin={() => {}}
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <SocialAuthButtons
              isLoading={isLoading}
              onLoadingChange={onLoadingChange}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
