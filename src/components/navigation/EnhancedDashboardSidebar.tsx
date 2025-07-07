
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  Search, 
  ChevronDown, 
  Zap,
  Plus,
  Settings,
  HelpCircle,
  Home,
  BarChart3,
  Database,
  Brain,
  FileText,
  Activity,
  User
} from 'lucide-react';

const navigationGroups = [
  {
    group: 'Overview',
    items: [
      { 
        href: '/app', 
        label: 'Dashboard', 
        icon: Home, 
        description: 'Performance overview and key metrics'
      },
      { 
        href: '/app/analytics', 
        label: 'Analytics', 
        icon: BarChart3, 
        description: 'Detailed performance analytics'
      },
    ]
  },
  {
    group: 'Optimization',
    items: [
      { 
        href: '/app/queries', 
        label: 'Query Manager', 
        icon: Search, 
        description: 'Optimize and manage SQL queries',
        shortcut: '⌘K'
      },
      { 
        href: '/app/repositories', 
        label: 'Repositories', 
        icon: Database, 
        description: 'Database connections and repos'
      },
      { 
        href: '/app/ai-studio', 
        label: 'AI Studio', 
        icon: Brain, 
        badge: 'AI', 
        description: 'AI-powered optimization tools'
      },
    ]
  },
  {
    group: 'Reports',
    items: [
      { 
        href: '/app/reports', 
        label: 'Performance Reports', 
        icon: FileText, 
        description: 'Detailed analytics and insights'
      },
      { 
        href: '/app/monitoring', 
        label: 'Real-time Monitor', 
        icon: Activity, 
        description: 'Live performance monitoring'
      },
    ]
  },
  {
    group: 'Settings',
    items: [
      { 
        href: '/app/settings', 
        label: 'Settings', 
        icon: Settings, 
        description: 'App configuration and preferences'
      },
      { 
        href: '/app/account', 
        label: 'Profile', 
        icon: User, 
        description: 'Account and profile settings'
      },
    ]
  }
];

const quickActions = [
  { href: '/app/queries/new', label: 'New Query', icon: Plus, shortcut: '⌘N' },
  { href: '/app/repositories/connect', label: 'Connect DB', icon: Database, shortcut: '⌘D' },
];

export function EnhancedDashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Overview', 'Optimization']);

  useEffect(() => {
    const currentPath = location.pathname;
    navigationGroups.forEach(group => {
      const hasActiveItem = group.items.some(item => currentPath.startsWith(item.href));
      if (hasActiveItem && !expandedGroups.includes(group.group)) {
        setExpandedGroups(prev => [...prev, group.group]);
      }
    });
  }, [location.pathname, expandedGroups]);

  const isActiveRoute = (href: string) => {
    if (href === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(href + '/') || location.pathname === href;
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const filteredNavigation = navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      !searchQuery || 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <Sidebar className="border-r border-border/40 bg-card/50 backdrop-blur-sm">
      <SidebarContent className="p-0">
        {/* Header */}
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary via-primary to-blue-600 rounded-xl shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  DBooster
                </h2>
                <p className="text-xs text-muted-foreground leading-tight">AI Database Optimizer</p>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-background/60 border-border/40 focus:border-primary/40"
              />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border/20">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <Button
                  key={action.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-3 text-xs hover:bg-accent/80 hover:text-accent-foreground"
                >
                  <Link to={action.href}>
                    <action.icon className="h-3.5 w-3.5 mr-2.5" />
                    <span className="flex-1 text-left">{action.label}</span>
                    {action.shortcut && (
                      <kbd className="text-xs bg-muted/80 px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                        {action.shortcut.replace('⌘', '⌘')}
                      </kbd>
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Groups */}
        <div className="flex-1 p-4 space-y-6">
          {filteredNavigation.map((group) => {
            const isExpanded = expandedGroups.includes(group.group);
            
            return (
              <SidebarGroup key={group.group} className="space-y-2">
                <SidebarGroupLabel 
                  className={cn(
                    "flex items-center justify-between px-1 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors group",
                    isCollapsed && "justify-center"
                  )}
                  onClick={() => !isCollapsed && toggleGroup(group.group)}
                >
                  {!isCollapsed && <span>{group.group}</span>}
                  {!isCollapsed && (
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200 opacity-60 group-hover:opacity-100",
                      isExpanded && "rotate-180"
                    )} />
                  )}
                </SidebarGroupLabel>
                
                {(isExpanded || isCollapsed) && (
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = isActiveRoute(item.href);
                        
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild>
                              <Link
                                to={item.href}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group hover:scale-[1.02]",
                                  "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm",
                                  isActive && "bg-primary/10 text-primary border border-primary/20 shadow-sm",
                                  isCollapsed && "justify-center px-2"
                                )}
                                title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
                              >
                                <item.icon className={cn(
                                  "h-4 w-4 flex-shrink-0 transition-colors",
                                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )} />
                                
                                {!isCollapsed && (
                                  <>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="truncate font-medium">{item.label}</span>
                                        {item.badge && (
                                          <Badge variant="secondary" className="text-xs h-5 px-1.5 bg-primary/10 text-primary border-primary/20">
                                            {item.badge}
                                          </Badge>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-tight truncate">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    
                                    {item.shortcut && (
                                      <kbd className="text-xs bg-muted/80 px-1.5 py-0.5 rounded font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                                        {item.shortcut}
                                      </kbd>
                                    )}
                                  </>
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                )}
              </SidebarGroup>
            );
          })}
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border/40 bg-muted/20">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-8 hover:bg-accent/80"
                asChild
              >
                <Link to="/support">
                  <HelpCircle className="h-3.5 w-3.5 mr-2.5" />
                  Help & Support
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
