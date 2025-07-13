
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Database, BarChart3, Settings, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionsProps {
  onShowWizard: () => void;
}

export function QuickActions({ onShowWizard }: QuickActionsProps) {
  const actions = [
    {
      title: 'Add Repository',
      description: 'Connect a new database repository',
      icon: Plus,
      href: '/app/repositories',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Optimize Queries',
      description: 'Find and fix slow queries',
      icon: Search,
      href: '/app/queries',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'View Reports',
      description: 'See detailed performance reports',
      icon: BarChart3,
      href: '/app/reports',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Quick Setup',
      description: 'Set up new connections quickly',
      icon: Zap,
      onClick: onShowWizard,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => {
            const ActionButton = (
              <Button
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-3 hover:scale-105 transition-all duration-200 ${action.color ? 'border-transparent text-white' : ''}`}
                style={action.color ? { background: action.color.split(' ')[0].replace('bg-', '') } : {}}
                onClick={action.onClick}
              >
                <action.icon className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm opacity-80">{action.description}</div>
                </div>
              </Button>
            );

            return action.href ? (
              <Link key={action.title} to={action.href}>
                {ActionButton}
              </Link>
            ) : (
              <div key={action.title}>
                {ActionButton}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
