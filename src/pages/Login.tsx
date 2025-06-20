
import { useState } from 'react';
import { EnhancedLoginCard } from '@/components/auth/EnhancedLoginCard';
import { DemoWalkthrough } from '@/components/demo-walkthrough';
import { FadeIn } from '@/components/ui/enhanced-animations';
import type { AuthMode } from '@/types/auth';

export default function Login() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <FadeIn>
            <EnhancedLoginCard 
              authMode={authMode} 
              onAuthModeChange={setAuthMode} 
            />
          </FadeIn>
        </div>
      </div>
      <DemoWalkthrough />
    </div>
  );
}
