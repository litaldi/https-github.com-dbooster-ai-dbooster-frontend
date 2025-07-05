
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestTube, Loader2, Sparkles, ArrowRight, Database, Zap } from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export function DemoModeButton() {
  const { loginDemo, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      await loginDemo();
      enhancedToast.success({
        title: 'Demo environment activated!',
        description: 'Welcome to DBooster! Explore with sample data and real optimization features.'
      });
      navigate('/app');
    } catch (error) {
      enhancedToast.error({
        title: 'Demo mode unavailable',
        description: 'Unable to start demo mode. Please try again.'
      });
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <Card className="mt-6 border-dashed border-2 border-primary/30 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/30 dark:to-purple-950/30 hover:border-primary/50 transition-all duration-300">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-3 mx-auto shadow-lg">
          <TestTube className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl flex items-center justify-center gap-2 flex-wrap">
          Try Demo Mode
          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            No signup needed
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Explore DBooster with enterprise sample data, real optimization scenarios, and full AI-powered features
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Database className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-xs font-medium">Sample DBs</p>
          </div>
          <div className="p-2 rounded-lg bg-green-500/10">
            <Zap className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <p className="text-xs font-medium">AI Optimizer</p>
          </div>
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Sparkles className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <p className="text-xs font-medium">Live Metrics</p>
          </div>
        </div>
        
        <Button
          onClick={handleDemoLogin}
          disabled={isLoading || isDemoLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 h-auto"
          aria-label="Start demo experience with sample data and full features"
        >
          {isDemoLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Launching Demo...
            </>
          ) : (
            <>
              <TestTube className="mr-2 h-5 w-5" />
              Start Demo Experience
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            ✨ Includes sample repositories, real query optimization, and AI-powered insights
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
