
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

interface NavigationLogoProps {
  user?: any;
}

export function NavigationLogo({ user }: NavigationLogoProps) {
  const href = user ? '/app' : '/';

  return (
    <Link to={href} className="flex items-center space-x-3">
      <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
        <Zap className="h-5 w-5 text-white" />
      </div>
      <div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          DBooster
        </span>
      </div>
    </Link>
  );
}
