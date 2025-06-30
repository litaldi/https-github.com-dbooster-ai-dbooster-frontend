
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/components/theme-provider';

export function useNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const closeMenu = () => setIsOpen(false);

  const isCurrentRoute = (path: string) => location.pathname === path;

  return {
    isOpen,
    setIsOpen,
    user,
    theme,
    location,
    handleLogout,
    toggleTheme,
    closeMenu,
    isCurrentRoute
  };
}
