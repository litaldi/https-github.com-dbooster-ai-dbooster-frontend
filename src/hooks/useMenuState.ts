
import { useState } from 'react';

export function useMenuState() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return {
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
}
