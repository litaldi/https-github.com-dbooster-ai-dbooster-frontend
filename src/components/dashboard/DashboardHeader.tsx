
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search, Bell } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back{user ? `, ${user.email?.split('@')[0]}` : ''}
        </h1>
        {isDemo && (
          <p className="text-muted-foreground mt-1">
            You're in demo mode - explore the features!
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onShowSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onShowNotifications}
        >
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
}
