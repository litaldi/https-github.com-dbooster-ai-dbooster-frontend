
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UniversalSearch } from '@/components/search/UniversalSearch';
import { NotificationCenter } from '@/components/notifications/SmartNotifications';

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div data-tour="dashboard">
        <h1 className="text-3xl font-bold tracking-tight">Enterprise Dashboard</h1>
        <p className="text-muted-foreground">
          AI-powered database optimization center - reducing query times by 73%
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button asChild className="bg-gradient-to-r from-primary to-blue-600">
          <Link to="/ai-studio">
            <Brain className="h-4 w-4 mr-2" />
            AI Studio
          </Link>
        </Button>
        <UniversalSearch />
        <NotificationCenter />
      </div>
    </div>
  );
}
