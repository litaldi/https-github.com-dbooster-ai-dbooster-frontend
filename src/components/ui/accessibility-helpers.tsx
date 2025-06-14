
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
        "skip-link",
        "absolute -top-40 left-6 bg-primary text-primary-foreground px-4 py-2 z-50",
        "focus:top-6 transition-all duration-200 rounded-md font-medium",
        className
      )}
    >
      {children}
    </a>
  );
}

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function ScreenReaderOnly({ 
  children, 
  as: Component = 'span', 
  className 
}: ScreenReaderOnlyProps) {
  return (
    <Component className={cn("sr-only", className)}>
      {children}
    </Component>
  );
}

interface LiveRegionProps {
  children: React.ReactNode;
  level?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({ 
  children, 
  level = 'polite', 
  atomic = false, 
  className 
}: LiveRegionProps) {
  return (
    <div
      aria-live={level}
      aria-atomic={atomic}
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  );
}
