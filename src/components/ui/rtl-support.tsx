
import React from 'react';
import { cn } from '@/lib/utils';

interface RTLSupportProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'ltr' | 'rtl' | 'auto';
}

/**
 * LTR (Left-to-Right) support component
 * Ensures proper text direction for English content
 */
export function LTRSupport({ children, className, direction = 'ltr' }: RTLSupportProps) {
  return (
    <div
      className={cn(
        'text-left',
        'flex-row',
        className
      )}
      dir={direction}
    >
      {children}
    </div>
  );
}

/**
 * LTR-aware spacing utilities for English content
 */
export const ltrStyles = {
  marginStart: 'ml-4',
  marginEnd: 'mr-4',
  paddingStart: 'pl-4',
  paddingEnd: 'pr-4',
  borderStart: 'border-l',
  borderEnd: 'border-r',
  roundedStart: 'rounded-l',
  roundedEnd: 'rounded-r',
};

/**
 * Hook for ensuring LTR direction
 */
export function useLTR() {
  React.useEffect(() => {
    // Ensure document direction is LTR for English content
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, []);

  return 'ltr';
}

// Alias for backward compatibility
export const RTLSupport = LTRSupport;
export const rtlStyles = ltrStyles;
export const useRTL = useLTR;
