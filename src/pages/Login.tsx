
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm';
import { DemoWalkthrough } from '@/components/demo-walkthrough';
import { FadeIn } from '@/components/ui/animations';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const { authMode, isLoading, error, setAuthMode, handleAuth, clearError } = useEnhancedAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <FadeIn>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <EnhancedAuthForm
              authMode={authMode}
              onAuthModeChange={setAuthMode}
              onSubmit={handleAuth}
              isLoading={isLoading}
            />
          </FadeIn>
        </div>
      </div>
      <DemoWalkthrough />
    </div>
  );
}
