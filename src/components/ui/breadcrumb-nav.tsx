
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

export function BreadcrumbNav({ className }: { className?: string }) {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    // Enhanced route mapping with better labels
    const routeLabels: Record<string, string> = {
      'app': 'Dashboard',
      'repositories': 'Database Repositories',
      'queries': 'Query Manager',
      'optimization': 'Query Optimization',
      'ai-studio': 'AI Studio',
      'reports': 'Performance Reports',
      'settings': 'App Settings',
      'account': 'Profile Settings',
      'teams': 'Team Management',
      'approvals': 'Query Approvals',
      'audit': 'Audit Log',
      'import': 'Database Import',
      'sandbox': 'Testing Sandbox',
      'about': 'About DBooster',
      'features': 'Features & Capabilities',
      'pricing': 'Pricing Plans',
      'contact': 'Contact Support',
      'how-it-works': 'How DBooster Works',
      'learn': 'Learning Center',
      'blog': 'DBooster Blog',
      'support': 'Help Center',
      'docs': 'Documentation',
      'terms': 'Terms of Service',
      'privacy': 'Privacy Policy',
      'accessibility': 'Accessibility Statement'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb navigation" 
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground mb-6 p-2 bg-muted/30 rounded-lg", className)}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/60" aria-hidden="true" />
            )}
            
            {item.current ? (
              <span 
                className="font-medium text-foreground px-2 py-1 bg-background rounded-md shadow-sm"
                aria-current="page"
              >
                {index === 0 && <Home className="h-4 w-4 inline mr-1" aria-hidden="true" />}
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1 hover:bg-background/50"
              >
                {index === 0 && <Home className="h-4 w-4 inline mr-1" aria-hidden="true" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
