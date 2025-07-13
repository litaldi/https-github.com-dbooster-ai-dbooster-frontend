
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AccessibilityEnhancedProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  tabIndex?: number;
  focusOnMount?: boolean;
}

export function AccessibilityEnhanced({
  children,
  className,
  role,
  ariaLabel,
  ariaDescribedBy,
  tabIndex,
  focusOnMount = false,
  ...props
}: AccessibilityEnhancedProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusOnMount && elementRef.current) {
      elementRef.current.focus();
    }
  }, [focusOnMount]);

  return (
    <div
      ref={elementRef}
      className={cn(
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
        className
      )}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={tabIndex}
      {...props}
    >
      {children}
    </div>
  );
}

export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 transition-all"
    >
      {children}
    </a>
  );
}

export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

export function FocusTrap({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

export function LiveRegion({ 
  children, 
  politeness = 'polite' as 'polite' | 'assertive' | 'off',
  className 
}: { 
  children: React.ReactNode; 
  politeness?: 'polite' | 'assertive' | 'off';
  className?: string;
}) {
  return (
    <div 
      aria-live={politeness}
      aria-atomic="true"
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  );
}
