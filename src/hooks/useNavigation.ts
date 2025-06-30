
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/components/theme-provider';
import { useMenuState } from './useMenuState';

export function useNavigation() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const menuState = useMenuState();

  const handleLogout = async () => {
    try {
      await logout();
      menuState.closeMenu();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return {
    ...menuState,
    user,
    theme,
    handleLogout,
    toggleTheme
  };
}
