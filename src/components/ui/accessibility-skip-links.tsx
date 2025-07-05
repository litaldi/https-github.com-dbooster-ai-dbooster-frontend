
import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  label: string;
}

interface AccessibilitySkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultSkipLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#main-navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' },
];

export function AccessibilitySkipLinks({ 
  links = defaultSkipLinks, 
  className 
}: AccessibilitySkipLinksProps) {
  return (
    <div className={cn("sr-only", className)}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="fixed top-2 left-2 z-[9999] px-4 py-2 bg-primary text-primary-foreground rounded-md focus:not-sr-only focus:absolute focus:top-2 focus:left-2 transition-all duration-200 hover:bg-primary/90"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
