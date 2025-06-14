
import { useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';

export function AccessibilityEnhancements() {
  const { direction } = useI18n();

  useEffect(() => {
    // Apply RTL/LTR direction
    document.documentElement.dir = direction;
    document.documentElement.lang = direction === 'rtl' ? 'he' : 'en';

    // Add accessibility classes for better screen reader support
    document.body.classList.add('accessibility-ready');
    
    // Ensure focus is visible for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
      .accessibility-high-contrast {
        --background: 255 255 255;
        --foreground: 0 0 0;
        --muted: 245 245 245;
        --muted-foreground: 64 64 64;
        --popover: 255 255 255;
        --popover-foreground: 0 0 0;
        --card: 255 255 255;
        --card-foreground: 0 0 0;
        --border: 229 229 229;
        --input: 229 229 229;
        --primary: 0 0 0;
        --primary-foreground: 255 255 255;
        --secondary: 245 245 245;
        --secondary-foreground: 0 0 0;
        --accent: 245 245 245;
        --accent-foreground: 0 0 0;
      }
      
      .accessibility-large-text {
        font-size: calc(var(--accessibility-font-size, 100%) * 1.2);
      }
      
      .accessibility-reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .focus-visible:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
      }
      
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        padding: 8px;
        z-index: 1000;
        text-decoration: none;
        border-radius: 4px;
      }
      
      .skip-link:focus {
        top: 6px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [direction]);

  return null;
}
