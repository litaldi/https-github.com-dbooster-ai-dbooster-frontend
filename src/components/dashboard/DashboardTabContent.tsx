
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Shield, Settings, TrendingUp, Database, Activity, Lock, Bell } from 'lucide-react';

export function AnalyticsTabContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Performance Trends
            </CardTitle>
            <CardDescription>
              Query performance over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Response Time</span>
                <Badge variant="outline">125ms</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Query Success Rate</span>
                <Badge className="bg-green-100 text-green-800">99.8%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Optimization Opportunities</span>
                <Badge variant="secondary">12 Found</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              Database Health
            </CardTitle>
            <CardDescription>
              Real-time database metrics and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Connections</span>
                <Badge variant="outline">156/500</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">CPU Usage</span>
                <Badge className="bg-yellow-100 text-yellow-800">45%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Memory Usage</span>
                <Badge className="bg-blue-100 text-blue-800">62%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>
            Comprehensive performance analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Advanced Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Detailed charts, query analysis, and performance insights
            </p>
            <Button>
              <Activity className="h-4 w-4 mr-2" />
              View Detailed Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SecurityTabContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <Badge className="bg-green-100 text-green-800">Excellent</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              Encryption Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-lg font-medium mb-2">AES-256</div>
              <Badge variant="outline">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Threat Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-lg font-medium mb-2">0 Threats</div>
              <Badge className="bg-green-100 text-green-800">Secure</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
          <CardDescription>
            SOC2 compliant monitoring with enterprise-grade security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Data Encryption</div>
                <div className="text-sm text-muted-foreground">End-to-end encryption</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Access Control</div>
                <div className="text-sm text-muted-foreground">Role-based permissions</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Configured</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Audit Logging</div>
                <div className="text-sm text-muted-foreground">Complete activity logs</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Compliance</div>
                <div className="text-sm text-muted-foreground">SOC2 Type II</div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Certified</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsTabContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Dashboard Preferences
            </CardTitle>
            <CardDescription>
              Customize your dashboard experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-refresh</div>
                <div className="text-sm text-muted-foreground">Update data automatically</div>
              </div>
              <Badge variant="outline">30s</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm text-muted-foreground">Interface appearance</div>
              </div>
              <Badge variant="secondary">System</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Timezone</div>
                <div className="text-sm text-muted-foreground">Display timezone</div>
              </div>
              <Badge variant="outline">UTC</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Alerts</div>
                <div className="text-sm text-muted-foreground">Performance issues</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Weekly Reports</div>
                <div className="text-sm text-muted-foreground">Summary reports</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Critical Alerts</div>
                <div className="text-sm text-muted-foreground">Immediate notifications</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            System configuration and advanced options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Database className="h-4 w-4 mr-2" />
              Manage Database Connections
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Performance Tuning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
