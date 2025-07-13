
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Settings, 
  BarChart3, 
  Database, 
  Zap,
  FileText,
  Users,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionsProps {
  onShowWizard: () => void;
}

export function QuickActions({ onShowWizard }: QuickActionsProps) {
  const actions = [
    {
      title: 'Add Repository',
      description: 'Connect a new repository for analysis',
      icon: Plus,
      action: () => {},
      href: '/app/repositories',
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700'
    },
    {
      title: 'Run Query Analysis',
      description: 'Analyze queries for optimization opportunities',
      icon: Search,
      action: () => {},
      href: '/app/queries',
      color: 'bg-green-50 hover:bg-green-100 text-green-700'
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics and insights',
      icon: BarChart3,
      action: () => {},
      href: '/app/analytics',
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700'
    },
    {
      title: 'Quick Setup',
      description: 'Get started with guided setup wizard',
      icon: Zap,
      action: onShowWizard,
      color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
    },
    {
      title: 'Security Check',
      description: 'Review security status and recommendations',
      icon: Shield,
      action: () => {},
      href: '/app/security',
      color: 'bg-red-50 hover:bg-red-100 text-red-700'
    },
    {
      title: 'Settings',
      description: 'Configure your preferences and integrations',
      icon: Settings,
      action: () => {},
      href: '/app/settings',
      color: 'bg-gray-50 hover:bg-gray-100 text-gray-700'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            const content = (
              <div className={`p-4 rounded-lg border-2 border-transparent hover:border-current transition-all duration-200 cursor-pointer ${action.color}`}>
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                    <p className="text-xs opacity-75 line-clamp-2">{action.description}</p>
                  </div>
                </div>
              </div>
            );

            if (action.href) {
              return (
                <Link key={action.title} to={action.href}>
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={action.title}
                onClick={action.action}
                className="text-left w-full"
              >
                {content}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
