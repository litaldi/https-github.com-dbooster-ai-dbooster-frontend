
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

interface MaintenanceModeProps {
  estimatedDuration?: string;
  message?: string;
}

export function MaintenanceMode({ 
  estimatedDuration = "30 minutes", 
  message = "We're performing scheduled maintenance to improve your experience." 
}: MaintenanceModeProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <FadeIn>
        <Card className="w-full max-w-lg text-center">
          <CardHeader className="space-y-4">
            <ScaleIn>
              <div className="w-24 h-24 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Settings className="w-12 h-12 text-orange-600 dark:text-orange-400 animate-spin" />
              </div>
            </ScaleIn>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                Maintenance in Progress
              </CardTitle>
              <p className="text-muted-foreground">
                {message}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Estimated time: {estimatedDuration}</span>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                What's happening?
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Updating database schemas</li>
                <li>• Optimizing performance</li>
                <li>• Installing security updates</li>
                <li>• Testing new features</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleRefresh}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Check Again
            </Button>
            
            <div className="text-xs text-muted-foreground">
              Thank you for your patience. We'll be back shortly!
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
