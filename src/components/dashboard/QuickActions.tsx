
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Zap, 
  FileText, 
  Users, 
  Upload, 
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  variant?: 'default' | 'secondary' | 'outline';
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      title: 'Connect Database',
      description: 'Import and connect your database for analysis',
      icon: Database,
      href: '/db-import',
      badge: 'Popular',
      variant: 'default'
    },
    {
      title: 'AI Query Analysis',
      description: 'Get intelligent insights about your queries',
      icon: Zap,
      href: '/ai-features',
      badge: 'AI Powered',
      variant: 'default'
    },
    {
      title: 'View Reports',
      description: 'Check performance metrics and trends',
      icon: BarChart3,
      href: '/reports',
      variant: 'outline'
    },
    {
      title: 'Manage Queries',
      description: 'Browse and optimize your database queries',
      icon: FileText,
      href: '/queries',
      variant: 'outline'
    },
    {
      title: 'Team Management',
      description: 'Invite team members and manage permissions',
      icon: Users,
      href: '/teams',
      variant: 'outline'
    },
    {
      title: 'Settings',
      description: 'Configure your account and preferences',
      icon: Settings,
      href: '/settings',
      variant: 'secondary'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common tasks to help you get the most out of DBooster
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Button
                variant={action.variant || 'outline'}
                className="h-auto p-4 flex flex-col items-start gap-2 w-full hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-2 w-full">
                  <action.icon className="h-5 w-5" />
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground font-normal">
                    {action.description}
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Need help getting started?
            </div>
            <Link to="/docs-help">
              <Button variant="ghost" size="sm" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
