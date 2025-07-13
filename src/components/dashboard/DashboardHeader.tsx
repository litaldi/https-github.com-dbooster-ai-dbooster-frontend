
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  CheckCircle,
  Eye,
  Search,
  Bell,
  RefreshCw,
  BarChart3,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  user: any;
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl border border-primary/20">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Performance Dashboard
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                All Systems Operational
              </Badge>
              {isDemo && (
                <Badge variant="secondary">
                  <Eye className="h-3 w-3 mr-1" />
                  Demo Mode
                </Badge>
              )}
              <Badge variant="outline" className="animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                Live Updates
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Welcome back, <span className="font-semibold text-foreground">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo User'}
          </span>. 
          Monitor your database performance with real-time insights and AI-powered optimization recommendations.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowSearch}
            className="hover:bg-muted/50"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onShowNotifications}
            className="hover:bg-muted/50 relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              2
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            className="hover:bg-muted/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" className="hover:bg-muted/50" asChild>
            <Link to="/app/reports">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </Link>
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 shadow-lg" asChild>
            <Link to="/app/ai-studio">
              <Brain className="h-4 w-4 mr-2" />
              AI Studio
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
