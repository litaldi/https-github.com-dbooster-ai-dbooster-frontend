
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Database, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { productionLogger } from '@/utils/productionLogger';

interface DemoAccessCardProps {
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

export function DemoAccessCard({ isLoading, onLoadingChange }: DemoAccessCardProps) {
  const { loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      onLoadingChange(true);
      await loginDemo();
      toast.success('Demo session started!');
      navigate('/app');
    } catch (error) {
      productionLogger.error('Demo login error', error, 'DemoAccessCard');
      toast.error('Failed to start demo session');
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-blue-500/5">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Eye className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Try Demo Mode</CardTitle>
        </div>
        <CardDescription>
          Experience DBooster with sample data - no signup required
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center p-3 bg-background/50 rounded-lg">
            <Database className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <div className="font-semibold text-green-600">15,234</div>
            <div className="text-xs text-muted-foreground">Queries Optimized</div>
          </div>
          <div className="text-center p-3 bg-background/50 rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-500 mx-auto mb-1" />
            <div className="font-semibold text-blue-600">73%</div>
            <div className="text-xs text-muted-foreground">Avg Improvement</div>
          </div>
        </div>
        
        <Button 
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
          size="lg"
        >
          <Zap className="h-4 w-4 mr-2" />
          {isLoading ? 'Starting Demo...' : 'Launch Demo Dashboard'}
        </Button>
        
        <div className="flex flex-wrap justify-center gap-1 text-xs">
          <Badge variant="outline" className="text-xs">No Credit Card</Badge>
          <Badge variant="outline" className="text-xs">Full Features</Badge>
          <Badge variant="outline" className="text-xs">Sample Data</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
