
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Database, Activity, Server, Settings, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionsProps {
  onShowWizard: () => void;
}

export function QuickActions({ onShowWizard }: QuickActionsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Essential tools for database optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <Link to="/app/queries">
                <Database className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Query Manager</div>
                  <div className="text-xs text-muted-foreground">Optimize SQL queries</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <Link to="/app/monitoring">
                <Activity className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Real-time Monitor</div>
                  <div className="text-xs text-muted-foreground">Live performance metrics</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <Link to="/app/repositories">
                <Server className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Repositories</div>
                  <div className="text-xs text-muted-foreground">Manage connections</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Set up your optimization environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connected</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">First Query Analyzed</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Studio Configured</span>
              <div className="h-4 w-4 border-2 border-muted rounded-full" />
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={onShowWizard}
            >
              Complete Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
