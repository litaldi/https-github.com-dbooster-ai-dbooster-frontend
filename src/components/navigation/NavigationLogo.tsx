
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';

interface NavigationLogoProps {
  user: any;
}

export function NavigationLogo({ user }: NavigationLogoProps) {
  return (
    <Link 
      to={user ? "/app" : "/"} 
      className="flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
    >
      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
        <Database className="h-5 w-5 text-white" />
      </div>
      <div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          DBooster
        </span>
        <p className="text-xs text-muted-foreground hidden sm:block">AI Database Optimizer</p>
      </div>
    </Link>
  );
}
