
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';
import type { User } from '@/types';

interface NavigationLogoProps {
  user: User | null;
}

export function NavigationLogo({ user }: NavigationLogoProps) {
  const linkTo = user ? '/app' : '/';
  
  return (
    <Link 
      to={linkTo} 
      className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
      aria-label="DBooster - Database Optimization Platform"
    >
      <Database className="h-8 w-8" />
      <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        DBooster
      </span>
    </Link>
  );
}
