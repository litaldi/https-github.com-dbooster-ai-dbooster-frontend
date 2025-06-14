
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

    // Route mapping for better labels
    const routeLabels: Record<string, string> = {
      'repositories': 'Repositories',
      'queries': 'Query Manager',
      'optimization': 'Query Optimization',
      'ai': 'AI Features',
      'reports': 'Reports',
      'settings': 'Settings',
      'account': 'Account',
      'teams': 'Teams',
      'approvals': 'Approvals',
      'audit': 'Audit Log',
      'import': 'Database Import',
      'sandbox': 'Sandbox',
      'about': 'About',
      'features': 'Features',
      'pricing': 'Pricing',
      'contact': 'Contact',
      'how-it-works': 'How It Works',
      'learn': 'Learning Hub',
      'blog': 'Blog',
      'support': 'Support',
      'docs': 'Documentation',
      'terms': 'Terms of Service',
      'privacy': 'Privacy Policy'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
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
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground mb-6", className)}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/60" aria-hidden="true" />
            )}
            
            {item.current ? (
              <span 
                className="font-medium text-foreground"
                aria-current="page"
              >
                {index === 0 && <Home className="h-4 w-4 inline mr-1" aria-hidden="true" />}
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-1 py-0.5"
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
