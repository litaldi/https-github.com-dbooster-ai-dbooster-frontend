
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Search, Bell, Settings } from 'lucide-react';
import type { User } from '@/types/auth';

interface DashboardHeaderProps {
  user?: User;
  isDemo: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onShowSearch: () => void;
  onShowNotifications: () => void;
}

export function DashboardHeader({
  user,
  isDemo,
  refreshing,
  onRefresh,
  onShowSearch,
  onShowNotifications
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
          </h1>
          {isDemo && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Demo Mode
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Real-time database optimization dashboard with advanced analytics
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onShowSearch}
          className="hidden lg:flex"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onShowNotifications}
          className="relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
}
