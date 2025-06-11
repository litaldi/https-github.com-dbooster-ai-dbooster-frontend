
import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  'home': 'Home',
  'features': 'Features',
  'learn': 'Learn',
  'how-it-works': 'How It Works',
  'pricing': 'Pricing',
  'blog': 'Blog',
  'about': 'About',
  'contact': 'Contact',
  'repositories': 'Repositories',
  'queries': 'Queries',
  'ai-features': 'AI Features',
  'account': 'Account',
  'settings': 'Settings',
  'reports': 'Reports',
  'teams': 'Teams',
  'support': 'Support',
  'db-import': 'DB Import',
  'approvals': 'Approvals',
  'audit-log': 'Audit Log',
  'docs-help': 'Docs & Help',
  'sandbox': 'Sandbox',
  'privacy': 'Privacy Policy',
  'terms': 'Terms of Service'
};

export function BreadcrumbNav() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) {
    return null; // Don't show breadcrumbs on root
  }

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: Home
    }
  ];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({
      label,
      href: currentPath
    });
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = crumb.icon;
          
          return (
            <Fragment key={crumb.href}>
              <li className="flex items-center">
                {isLast ? (
                  <span 
                    className="flex items-center font-medium text-foreground"
                    aria-current="page"
                  >
                    {Icon && <Icon className="w-4 h-4 mr-1" />}
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className={cn(
                      "flex items-center hover:text-foreground transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-1" />}
                    {crumb.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
