
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Database, GitBranch, Search, Settings, BarChart3, Users, User } from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: BarChart3,
  },
  {
    title: 'Repositories',
    url: '/repositories',
    icon: GitBranch,
  },
  {
    title: 'Queries',
    url: '/queries',
    icon: Search,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: BarChart3,
  },
  {
    title: 'Teams',
    url: '/teams',
    icon: Users,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
  {
    title: 'Account',
    url: '/account',
    icon: User,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">DBooster</h1>
            <p className="text-xs text-muted-foreground">Database Optimizer</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
