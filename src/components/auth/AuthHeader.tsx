
import React from 'react';
import { ScaleIn, FadeIn } from '@/components/ui/animations';
import { Zap, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle } from '@/components/ui/card';
import type { AuthMode } from '@/types/auth';

interface AuthHeaderProps {
  authMode: AuthMode;
}

export function AuthHeader({ authMode }: AuthHeaderProps) {
  const cardTitle = authMode === 'login' 
    ? 'Welcome back to DBooster' 
    : 'Start your enterprise trial';
    
  const cardDescription = authMode === 'login'
    ? 'Sign in to access your database optimization workspace'
    : 'Join thousands of teams reducing database costs by 60%';

  return (
    <CardHeader className="space-y-1 text-center pb-6">
      <ScaleIn delay={0.1}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-primary">DBooster</span>
        </div>
      </ScaleIn>
      
      <ScaleIn delay={0.2}>
        <CardTitle className="text-2xl font-bold">
          {cardTitle}
        </CardTitle>
      </ScaleIn>
      
      <FadeIn delay={0.3}>
        <p className="text-muted-foreground text-sm">
          {cardDescription}
        </p>
      </FadeIn>

      {authMode === 'signup' && (
        <FadeIn delay={0.4}>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-3">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>SOC2 Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>2min Setup</span>
            </div>
          </div>
        </FadeIn>
      )}
    </CardHeader>
  );
}
