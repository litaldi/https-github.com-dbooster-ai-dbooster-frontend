
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function LogoutButton({ variant = 'ghost', size = 'default', className }: LogoutButtonProps) {
  const { signOut, isDemo } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      enhancedToast.success({
        title: 'Signed out successfully',
        description: isDemo ? 'Demo session ended' : 'You have been signed out of your account'
      });
    } catch (error) {
      enhancedToast.error({
        title: 'Sign out failed',
        description: 'There was an error signing out. Please try again.'
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  );
}
