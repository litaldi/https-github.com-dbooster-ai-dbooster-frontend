
import React from 'react';
import { cn } from '@/lib/utils';

interface RTLSupportProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'ltr' | 'rtl' | 'auto';
}

/**
 * RTL (Right-to-Left) support component
 * Provides proper layout direction for international users
 */
export function RTLSupport({ children, className, direction = 'auto' }: RTLSupportProps) {
  return (
    <div
      className={cn(
        'rtl:text-right ltr:text-left',
        'rtl:flex-row-reverse ltr:flex-row',
        className
      )}
      dir={direction}
    >
      {children}
    </div>
  );
}

/**
 * RTL-aware spacing utilities
 */
export const rtlStyles = {
  marginStart: 'rtl:mr-4 ltr:ml-4',
  marginEnd: 'rtl:ml-4 ltr:mr-4',
  paddingStart: 'rtl:pr-4 ltr:pl-4',
  paddingEnd: 'rtl:pl-4 ltr:pr-4',
  borderStart: 'rtl:border-r ltr:border-l',
  borderEnd: 'rtl:border-l ltr:border-r',
  roundedStart: 'rtl:rounded-r ltr:rounded-l',
  roundedEnd: 'rtl:rounded-l ltr:rounded-r',
};

/**
 * Hook for detecting RTL language
 */
export function useRTL() {
  const [isRTL, setIsRTL] = React.useState(false);

  React.useEffect(() => {
    const direction = document.documentElement.dir || 
                     getComputedStyle(document.documentElement).direction ||
                     'ltr';
    setIsRTL(direction === 'rtl');
  }, []);

  return isRTL;
}
