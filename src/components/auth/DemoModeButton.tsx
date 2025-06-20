
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestTube, Loader2, Sparkles } from 'lucide-react';

export function DemoModeButton() {
  const { loginDemo, isLoading } = useAuth();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      await loginDemo();
    } catch (error) {
      // Error is handled in auth context
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <Card className="mt-6 border-dashed border-2 border-primary/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <CardHeader className="text-center pb-3">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-2 mx-auto">
          <TestTube className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          Try Demo Mode
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            No signup needed
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          Explore DBooster with sample data and full functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          onClick={handleDemoLogin}
          disabled={isLoading || isDemoLoading}
          variant="outline"
          className="w-full border-primary/30 hover:bg-primary/5"
          aria-label="Start demo experience with sample data"
        >
          {isDemoLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting Demo...
            </>
          ) : (
            <>
              <TestTube className="mr-2 h-4 w-4" />
              Start Demo Experience
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Demo mode includes sample repositories, queries, and AI features
        </p>
      </CardContent>
    </Card>
  );
}
