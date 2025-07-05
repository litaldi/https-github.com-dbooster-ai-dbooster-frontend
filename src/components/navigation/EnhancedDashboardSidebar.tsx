
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
  ChevronRight, 
  Command, 
  Zap,
  Plus,
  Settings,
  HelpCircle
} from 'lucide-react';
import { dashboardSidebarNavigation, quickActions } from '@/config/navigation';

export function EnhancedDashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Overview', 'Optimization']);

  // Keep relevant groups expanded based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    dashboardSidebarNavigation.forEach(group => {
      const hasActiveItem = group.items.some(item => currentPath.startsWith(item.href));
      if (hasActiveItem && !expandedGroups.includes(group.group)) {
        setExpandedGroups(prev => [...prev, group.group]);
      }
    });
  }, [location.pathname, expandedGroups]);

  const isActiveRoute = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const filteredNavigation = dashboardSidebarNavigation.map(group => ({
    ...group,
    items: group.items.filter(item =>
      !searchQuery || 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <Sidebar className={cn(isCollapsed ? "w-16" : "w-72")}>
      <SidebarContent className="p-4 space-y-6">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                DBooster
              </h2>
              <p className="text-xs text-muted-foreground">AI Database Optimizer</p>
            </div>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        )}

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-1">
              {quickActions.slice(0, 2).map((action) => (
                <Button
                  key={action.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8 text-xs hover:bg-accent/50"
                >
                  <Link to={action.href}>
                    <action.icon className="h-3 w-3 mr-2" />
                    {action.label}
                    {action.shortcut && (
                      <kbd className="ml-auto text-xs bg-muted px-1 rounded">
                        {action.shortcut.replace('Cmd', '⌘')}
                      </kbd>
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Groups */}
        <div className="space-y-1">
          {filteredNavigation.map((group) => {
            const isExpanded = expandedGroups.includes(group.group);
            
            return (
              <SidebarGroup key={group.group}>
                <SidebarGroupLabel 
                  className={cn(
                    "flex items-center justify-between px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors",
                    isCollapsed && "justify-center"
                  )}
                  onClick={() => toggleGroup(group.group)}
                >
                  {!isCollapsed && <span>{group.group}</span>}
                  {!isCollapsed && (
                    <ChevronRight className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      isExpanded && "rotate-90"
                    )} />
                  )}
                </SidebarGroupLabel>
                
                {(isExpanded || isCollapsed) && (
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const isActive = isActiveRoute(item.href);
                        
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild>
                              <Link
                                to={item.href}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                  "hover:bg-accent/50 hover:text-accent-foreground group",
                                  isActive && "bg-accent text-accent-foreground shadow-sm",
                                  isCollapsed && "justify-center"
                                )}
                                title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
                              >
                                <item.icon className={cn(
                                  "h-5 w-5 flex-shrink-0",
                                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )} />
                                
                                {!isCollapsed && (
                                  <>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="truncate">{item.label}</span>
                                        {item.badge && (
                                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                            {item.badge}
                                          </Badge>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    
                                    {item.shortcut && (
                                      <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono opacity-60 group-hover:opacity-100 transition-opacity">
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

        {/* Bottom Actions */}
        {!isCollapsed && (
          <div className="mt-auto space-y-2 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              asChild
            >
              <Link to="/app/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              asChild
            >
              <Link to="/support">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </Link>
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
