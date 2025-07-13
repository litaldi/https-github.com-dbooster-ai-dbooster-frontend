
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, BarChart3, Shield } from 'lucide-react';

interface QuickActionsProps {
  onShowWizard: () => void;
}

export function QuickActions({ onShowWizard }: QuickActionsProps) {
  const actions = [
    {
      title: 'Add Repository',
      description: 'Connect a new repository for analysis',
      icon: Plus,
      action: onShowWizard
    },
    {
      title: 'View Analytics',
      description: 'Detailed performance insights',
      icon: BarChart3,
      action: () => console.log('View Analytics')
    },
    {
      title: 'Security Audit',
      description: 'Run security vulnerability scan',
      icon: Shield,
      action: () => console.log('Security Audit')
    },
    {
      title: 'Settings',
      description: 'Configure your preferences',
      icon: Settings,
      action: () => console.log('Settings')
    }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={action.action}
            >
              <div className="flex items-center gap-2">
                <action.icon className="h-4 w-4" />
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
