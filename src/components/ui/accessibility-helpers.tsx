
import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useRef } from 'react';

interface SkipLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "bg-primary text-primary-foreground px-4 py-2 rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      {children}
    </a>
  );
}

interface FocusTrapProps {
  children: ReactNode;
  enabled?: boolean;
  className?: string;
}

export function FocusTrap({ children, enabled = true, className }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
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
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

interface LiveRegionProps {
  children: ReactNode;
  level?: 'polite' | 'assertive';
  className?: string;
}

export function LiveRegion({ children, level = 'polite', className }: LiveRegionProps) {
  return (
    <div
      aria-live={level}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  );
}

interface ProgressiveDisclosureProps {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function ProgressiveDisclosure({ 
  summary, 
  children, 
  defaultOpen = false, 
  className 
}: ProgressiveDisclosureProps) {
  return (
    <details className={cn("group", className)} open={defaultOpen}>
      <summary className="cursor-pointer list-none flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors">
        <span>{summary}</span>
        <svg
          className="h-4 w-4 transition-transform group-open:rotate-180"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </summary>
      <div className="px-4 pb-4 animate-fade-in">
        {children}
      </div>
    </details>
  );
}
