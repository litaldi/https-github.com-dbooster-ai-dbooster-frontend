
import React, { useEffect } from 'react';

export function CriticalCSSLoader() {
  useEffect(() => {
    // Load non-critical CSS asynchronously
    const loadCSS = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
      document.head.appendChild(link);
    };

    // Load font stylesheets asynchronously
    const fontStylesheets = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    fontStylesheets.forEach(loadCSS);
  }, []);

  return null;
}

export function ResourcePreloader() {
  useEffect(() => {
    // Preload critical resources
    const preloadResource = (href: string, as: string, type?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    };

    // Preload critical fonts
    preloadResource('/fonts/inter-var.woff2', 'font', 'font/woff2');
    
    // Preload hero images
    preloadResource('/hero-bg.webp', 'image');
    preloadResource('/logo.svg', 'image');

    // DNS prefetch for external resources
    const dnsPrefetch = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    };

    dnsPrefetch('https://fonts.googleapis.com');
    dnsPrefetch('https://fonts.gstatic.com');
  }, []);

  return null;
}
