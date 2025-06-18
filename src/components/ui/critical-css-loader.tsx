
import { useEffect } from 'react';

// Critical CSS loader for above-the-fold content
export function CriticalCSSLoader() {
  useEffect(() => {
    // Load non-critical CSS after page load
    const loadNonCriticalCSS = () => {
      const nonCriticalCSS = [
        // Add paths to non-critical CSS files
        '/css/animations.css',
        '/css/components.css'
      ];

      nonCriticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
        document.head.appendChild(link);
      });
    };

    // Load after initial render
    if (document.readyState === 'complete') {
      loadNonCriticalCSS();
    } else {
      window.addEventListener('load', loadNonCriticalCSS);
    }

    return () => {
      window.removeEventListener('load', loadNonCriticalCSS);
    };
  }, []);

  return null;
}

// Preload important resources
export function ResourcePreloader() {
  useEffect(() => {
    const preloadResources = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
      { href: '/api/auth/session', as: 'fetch' },
    ];

    preloadResources.forEach(({ href, as, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);

  return null;
}
