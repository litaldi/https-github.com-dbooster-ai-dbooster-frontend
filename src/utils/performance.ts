
// Performance optimization utilities
import { lazy } from 'react';

// Image optimization utilities
export const optimizeImage = (src: string, width?: number, height?: number, format: 'webp' | 'avif' | 'jpeg' = 'webp') => {
  if (!src) return src;
  
  // For production, you'd integrate with a service like Cloudinary or ImageKit
  // This is a placeholder for the optimization logic
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('f', format);
  params.append('q', 'auto');
  
  return `${src}?${params.toString()}`;
};

// Lazy loading component factory
export const createLazyComponent = (importFn: () => Promise<any>) => {
  return lazy(importFn);
};

// Resource preloading
export const preloadResource = (href: string, as: 'script' | 'style' | 'font' | 'image') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
};

// Critical resource preloader
export const preloadCriticalResources = () => {
  // Preload critical fonts
  preloadResource('/fonts/inter-var.woff2', 'font');
  
  // Preload hero images
  preloadResource('/images/hero-bg.webp', 'image');
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  return async () => {
    const start = performance.now();
    try {
      await fn();
    } finally {
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
      
      // In production, send to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: name,
          value: Math.round(end - start)
        });
      }
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
  if (typeof window === 'undefined') return null;
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};

// Bundle size analyzer helper
export const logBundleInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    import('webpack-bundle-analyzer/lib/analyzer').then(({ getBundleDir }) => {
      console.log('Bundle analysis available in development mode');
    }).catch(() => {
      console.log('Bundle analyzer not available');
    });
  }
};
