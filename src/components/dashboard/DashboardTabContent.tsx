
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Shield, 
  Settings, 
  TrendingUp, 
  Database,
  Activity,
  Lock,
  Bell,
  Palette,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AnalyticsTabContent() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Query Optimization Rate</span>
              <Badge>+15.3%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Response Time Improvement</span>
              <Badge variant="outline">-23.7%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cost Reduction</span>
              <Badge>+$2,340/mo</Badge>
            </div>
          </div>
          <Button asChild className="w-full mt-4">
            <Link to="/app/analytics">View Detailed Analytics</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold">12,847</div>
              <div className="text-sm text-muted-foreground">Total Queries Analyzed</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">9,634</div>
                <div className="text-xs text-muted-foreground">Optimized</div>
              </div>
              <div>
                <div className="text-lg font-semibold">156</div>
                <div className="text-xs text-muted-foreground">Active Connections</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SecurityTabContent() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Security Score</span>
              <Badge className="bg-green-100 text-green-800">94.2%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Threats Blocked</span>
              <Badge variant="outline">0 (24h)</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Security Scan</span>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
          </div>
          <Button asChild className="w-full mt-4">
            <Link to="/app/security">View Security Dashboard</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Access Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Two-Factor Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Session Management</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Audit Logging</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsTabContent() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="text-sm font-medium">Notifications</span>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">Real-time Updates</span>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="text-sm font-medium">Auto-optimization</span>
              </div>
              <Badge>Active</Badge>
            </div>
          </div>
          <Button asChild className="w-full mt-4">
            <Link to="/app/settings">Manage Settings</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <Badge variant="outline">System</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Language</span>
              <Badge variant="outline">English</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Timezone</span>
              <Badge variant="outline">UTC</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
