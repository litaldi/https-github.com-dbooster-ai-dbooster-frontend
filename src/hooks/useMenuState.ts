
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export function useMenuState() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);

  const isCurrentRoute = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    isCurrentRoute,
    currentPath: location.pathname
  };
}
