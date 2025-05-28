
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

const routeMap: Record<string, string> = {
  '/': 'Dashboard',
  '/repositories': 'Repositories',
  '/queries': 'Queries',
  '/ai-features': 'AI Features',
  '/reports': 'Reports',
  '/approvals': 'Approvals',
  '/teams': 'Teams',
  '/db-import': 'DB Import',
  '/sandbox': 'Sandbox',
  '/audit-log': 'Audit Log',
  '/support': 'Support',
  '/docs-help': 'Docs & Help',
  '/settings': 'Settings',
  '/account': 'Account',
  '/home': 'Home',
  '/about': 'About',
  '/contact': 'Contact',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
};

export function BreadcrumbNav() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Add home/dashboard
  if (location.pathname !== '/' && location.pathname !== '/home') {
    breadcrumbs.push({
      label: location.pathname.startsWith('/home') ? 'Home' : 'Dashboard',
      href: location.pathname.startsWith('/home') ? '/home' : '/'
    });
  }
  
  // Build breadcrumb path
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    if (index < pathSegments.length - 1) {
      breadcrumbs.push({
        label,
        href: currentPath
      });
    }
  });

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          <Link
            to={crumb.href}
            className="hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1"
          >
            {crumb.label}
          </Link>
        </div>
      ))}
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-foreground">
        {routeMap[location.pathname] || 'Current Page'}
      </span>
    </nav>
  );
}
