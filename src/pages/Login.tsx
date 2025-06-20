
import { useState } from 'react';
import { LoginCard } from '@/components/auth/LoginCard';
import { DemoWalkthrough } from '@/components/demo-walkthrough';
import { FadeIn } from '@/components/ui/enhanced-animations';

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <FadeIn>
            <LoginCard />
          </FadeIn>
        </div>
      </div>
      <DemoWalkthrough />
    </div>
  );
}
