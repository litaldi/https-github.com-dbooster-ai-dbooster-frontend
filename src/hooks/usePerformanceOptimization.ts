
import { useEffect, useCallback } from 'react';

export function usePerformanceOptimization() {
  useEffect(() => {
    // Prefetch critical routes
    const criticalRoutes = ['/app', '/features', '/pricing', '/documentation'];
    
    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });

    // Optimize images with intersection observer
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));

    // Memory cleanup for observers
    return () => {
      imageObserver.disconnect();
    };
  }, []);

  // Debounced scroll handler for performance
  const useDebounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Optimized resize handler
  const useOptimizedResize = useCallback((callback: () => void) => {
    let ticking = false;
    
    const handleResize = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback();
          ticking = false;
        });
        ticking = true;
      }
    };

    return handleResize;
  }, []);

  return {
    useDebounce,
    useOptimizedResize
  };
}

// Custom hook for intersection observer
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options
    });

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, callback, options]);
}

// Custom hook for lazy loading
export function useLazyLoad() {
  const lazyLoadImage = useCallback((img: HTMLImageElement) => {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLImageElement;
          target.src = target.dataset.src || '';
          target.classList.remove('opacity-0');
          target.classList.add('opacity-100', 'transition-opacity', 'duration-300');
          imageObserver.unobserve(target);
        }
      });
    });

    imageObserver.observe(img);
    return () => imageObserver.disconnect();
  }, []);

  return { lazyLoadImage };
}
