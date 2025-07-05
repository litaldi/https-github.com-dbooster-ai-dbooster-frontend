
import { useEffect, useRef, useCallback } from 'react';

interface FocusManagementOptions {
  trapFocus?: boolean;
  restoreFocus?: boolean;
  initialFocus?: 'first' | 'last' | HTMLElement | null;
  skipLink?: string;
}

export function useFocusManagement(
  isActive: boolean,
  options: FocusManagementOptions = {}
) {
  const {
    trapFocus = false,
    restoreFocus = false,
    initialFocus = 'first',
    skipLink
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!trapFocus || !containerRef.current) return;

    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements(containerRef.current);
      
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    // Handle Escape key for modal-like components
    if (event.key === 'Escape' && restoreFocus) {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [trapFocus, restoreFocus, getFocusableElements]);

  const setInitialFocus = useCallback(() => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);

    if (focusableElements.length === 0) return;

    let elementToFocus: HTMLElement | null = null;

    if (typeof initialFocus === 'string') {
      elementToFocus = initialFocus === 'first' 
        ? focusableElements[0] 
        : focusableElements[focusableElements.length - 1];
    } else if (initialFocus instanceof HTMLElement) {
      elementToFocus = initialFocus;
    }

    if (elementToFocus) {
      // Use setTimeout to ensure the element is rendered
      setTimeout(() => {
        elementToFocus?.focus();
      }, 0);
    }
  }, [initialFocus, getFocusableElements]);

  // Handle skip link functionality
  const handleSkipLink = useCallback(() => {
    if (skipLink) {
      const targetElement = document.querySelector(skipLink) as HTMLElement;
      if (targetElement) {
        targetElement.focus();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [skipLink]);

  useEffect(() => {
    if (isActive) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Set initial focus
      setInitialFocus();

      // Add event listeners
      if (trapFocus) {
        document.addEventListener('keydown', handleKeyDown);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        
        // Restore focus when component unmounts or becomes inactive
        if (restoreFocus && previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isActive, handleKeyDown, setInitialFocus, restoreFocus, trapFocus]);

  // Announce changes to screen readers
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return {
    containerRef,
    handleSkipLink,
    announceToScreenReader,
    setInitialFocus
  };
}
