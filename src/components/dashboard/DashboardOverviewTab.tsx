
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Database, CheckCircle } from 'lucide-react';

interface DashboardOverviewTabProps {
  setActiveTab: (tab: string) => void;
}

export function DashboardOverviewTab({ setActiveTab }: DashboardOverviewTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Optimization Engine
          </CardTitle>
          <CardDescription>
            Advanced machine learning models analyzing your database patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Model Accuracy</span>
              <span className="text-sm font-medium">95.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Predictions Today</span>
              <span className="text-sm font-medium">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Success Rate</span>
              <span className="text-sm font-medium text-green-600">97.8%</span>
            </div>
            <Button className="w-full" onClick={() => setActiveTab('optimizer')}>
              <Brain className="h-4 w-4 mr-2" />
              Start Optimization
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Database Health
          </CardTitle>
          <CardDescription>
            Real-time monitoring of your database ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All systems operational. Performance is optimal.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Active Connections</div>
                <div className="text-2xl font-bold text-blue-600">24</div>
              </div>
              <div>
                <div className="font-medium">Avg Response Time</div>
                <div className="text-2xl font-bold text-green-600">45ms</div>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setActiveTab('connections')}>
              <Database className="h-4 w-4 mr-2" />
              Manage Connections
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
