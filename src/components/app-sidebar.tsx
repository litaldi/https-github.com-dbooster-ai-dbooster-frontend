
import { Home, Database, Search, FileText, BarChart3, Settings, Users, Shield, HelpCircle, Zap, BookOpen, Brain } from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NotificationTrigger } from "@/components/notifications/SmartNotifications"

// Updated menu items with consistent branding and clearer labels
const items = [
  {
    title: "Dashboard",
    url: "/app",
    icon: Home,
    description: "Performance overview and key metrics"
  },
  {
    title: "Database Repositories",
    url: "/app/repositories",
    icon: Database,
    description: "Manage your database connections"
  },
  {
    title: "Query Manager",
    url: "/app/queries",
    icon: Search,
    description: "Optimize and manage SQL queries"
  },
  {
    title: "AI Studio",
    url: "/app/ai-studio",
    icon: Brain,
    description: "AI-powered optimization tools",
    badge: "AI"
  },
  {
    title: "Performance Reports",
    url: "/app/reports",
    icon: FileText,
    description: "Detailed analytics and insights"
  },
]

const managementItems = [
  {
    title: "Team Management",
    url: "/app/teams",
    icon: Users,
    description: "Manage team members and permissions"
  },
  {
    title: "App Settings",
    url: "/app/settings",
    icon: Settings,
    description: "Configure DBooster preferences"
  },
  {
    title: "Help Center",
    url: "/support",
    icon: HelpCircle,
    description: "Documentation and support"
  },
]

export function AppSidebar() {
  const { user, isDemo } = useAuth()

  return (
    <Sidebar data-tour="sidebar" className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-sm">
            DB
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">DBooster</span>
            <span className="text-xs text-muted-foreground">AI Database Optimizer</span>
          </div>
        </div>
        {isDemo && (
          <Badge variant="secondary" className="mt-2 text-xs bg-amber-100 text-amber-800 border-amber-200">
            Demo Mode
          </Badge>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Core Features
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <NavLink 
                      to={item.url}
                      end={item.url === "/app"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.02]",
                          isActive && "bg-accent text-accent-foreground shadow-sm"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.02]",
                          isActive && "bg-accent text-accent-foreground shadow-sm"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="space-y-3">
          {/* Notification Test Button */}
          <NotificationTrigger />
          
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                {user.email?.[0]?.toUpperCase()}
              </div>
              <span className="truncate text-muted-foreground">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
          )}
          
          {/* Quick Links */}
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="flex-1 text-xs hover:bg-accent">
              <BookOpen className="h-3 w-3 mr-1" />
              Docs
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 text-xs hover:bg-accent">
              <Shield className="h-3 w-3 mr-1" />
              Security
            </Button>
          </div>
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
