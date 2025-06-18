
import { useEffect, useRef, useCallback } from 'react';

interface FocusOptions {
  restoreFocus?: boolean;
  focusFirstElement?: boolean;
  trapFocus?: boolean;
}

export function useFocusManagement(isActive: boolean, options: FocusOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const { restoreFocus = true, focusFirstElement = true, trapFocus = false } = options;

  // Store the previously focused element when becoming active
  useEffect(() => {
    if (isActive) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isActive]);

  // Focus management when active state changes
  useEffect(() => {
    if (!containerRef.current) return;

    if (isActive) {
      if (focusFirstElement) {
        const firstFocusable = getFocusableElements(containerRef.current)[0];
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          containerRef.current.focus();
        }
      }
    } else if (restoreFocus && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isActive, focusFirstElement, restoreFocus]);

  // Focus trap implementation
  useEffect(() => {
    if (!isActive || !trapFocus || !containerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return;

      const focusableElements = getFocusableElements(containerRef.current);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, trapFocus]);

  const moveFocusToFirst = useCallback(() => {
    if (!containerRef.current) return;
    const firstFocusable = getFocusableElements(containerRef.current)[0];
    firstFocusable?.focus();
  }, []);

  const moveFocusToLast = useCallback(() => {
    if (!containerRef.current) return;
    const focusableElements = getFocusableElements(containerRef.current);
    const lastFocusable = focusableElements[focusableElements.length - 1];
    lastFocusable?.focus();
  }, []);

  return {
    containerRef,
    moveFocusToFirst,
    moveFocusToLast,
  };
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
    'summary',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors));
}
