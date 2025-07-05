
import React, { useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';

export function AccessibilityEnhancements() {
  const { direction } = useI18n();

  useEffect(() => {
    // Apply LTR direction
    document.documentElement.dir = direction;
    document.documentElement.lang = 'en';

    // Add accessibility classes for better screen reader support
    document.body.classList.add('accessibility-ready');
    
    // Ensure focus is visible for keyboard navigation
    const style = document.createElement('style');
    style.id = 'accessibility-styles';
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
        transition: top 0.2s ease;
      }
      
      .skip-link:focus {
        top: 6px;
      }
      
      /* Enhanced keyboard navigation */
      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible,
      a:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
      }
      
      /* Screen reader only content */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
    `;

    // Remove existing style if it exists
    const existingStyle = document.getElementById('accessibility-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);

    return () => {
      const styleElement = document.getElementById('accessibility-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [direction]);

  return null;
}
