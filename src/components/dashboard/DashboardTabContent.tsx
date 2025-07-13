
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Shield, Settings, Download } from 'lucide-react';

export function AnalyticsTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Analytics</CardTitle>
        <CardDescription>Detailed performance insights and trends</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
        <p className="text-muted-foreground mb-4">
          Advanced charts and performance analytics coming soon
        </p>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </CardContent>
    </Card>
  );
}

export function SecurityTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Dashboard</CardTitle>
        <CardDescription>Monitor security status and compliance</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
        <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">All Systems Secure</h3>
        <p className="text-muted-foreground mb-4">
          SOC2 compliant with enterprise-grade security monitoring
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline">SOC2 Certified</Badge>
          <Badge variant="outline">99.9% Uptime</Badge>
          <Badge variant="outline">Zero Threats</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsTabContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Settings</CardTitle>
        <CardDescription>Configure your dashboard preferences</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-12">
        <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Customization Options</h3>
        <p className="text-muted-foreground mb-4">
          Personalize your dashboard layout and preferences
        </p>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configure Settings
        </Button>
      </CardContent>
    </Card>
  );
}
