
import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
    >
      {children}
    </a>
  );
}

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

export function VisuallyHidden({ children, className }: VisuallyHiddenProps) {
  return (
    <span className={cn('sr-only', className)}>
      {children}
    </span>
  );
}

interface FocusTrapProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function FocusTrap({ children, enabled = true }: FocusTrapProps) {
  const trapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!enabled || !trapRef.current) return;

    const trap = trapRef.current;
    const focusableElements = trap.querySelectorAll(
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

    trap.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      trap.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled]);

  return (
    <div ref={trapRef}>
      {children}
    </div>
  );
}

interface ProgressiveDisclosureProps {
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export function ProgressiveDisclosure({ 
  summary, 
  children, 
  className,
  defaultOpen = false,
  onToggle
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const contentId = React.useId();

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div className={cn('progressive-disclosure', className)}>
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity cursor-pointer w-full"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className={cn(
          'transition-transform duration-200 flex-shrink-0',
          isOpen ? 'rotate-90' : 'rotate-0'
        )}>
          ▶
        </span>
        <span className="flex-1">{summary}</span>
      </button>
      
      {isOpen && (
        <div 
          id={contentId}
          className="mt-2 pl-6 animate-in slide-in-from-top-2 duration-200"
          role="region"
          aria-label="Expanded content"
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface LiveRegionProps {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({ 
  children, 
  priority = 'polite', 
  atomic = false,
  className 
}: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  );
}

interface LandmarkProps {
  children: React.ReactNode;
  role?: 'main' | 'navigation' | 'complementary' | 'banner' | 'contentinfo' | 'region';
  ariaLabel?: string;
  className?: string;
}

export function Landmark({ 
  children, 
  role = 'region', 
  ariaLabel,
  className 
}: LandmarkProps) {
  const Component = role === 'main' ? 'main' : 
                   role === 'navigation' ? 'nav' :
                   role === 'banner' ? 'header' :
                   role === 'contentinfo' ? 'footer' : 'section';

  return (
    <Component
      role={role}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </Component>
  );
}
