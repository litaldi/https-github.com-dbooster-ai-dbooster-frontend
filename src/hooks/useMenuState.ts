
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useMenuState() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isCurrentRoute = (path: string) => {
    return location.pathname === path;
  };

  return {
    isOpen,
    toggleMenu,
    closeMenu,
    isCurrentRoute
  };
}
