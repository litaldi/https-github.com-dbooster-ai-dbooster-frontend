
import React from 'react';

/**
 * Utility functions for code cleanup and performance optimization
 */

/**
 * Remove unused imports and variables
 */
export const cleanupUnusedCode = () => {
  // This would be handled by build tools like Vite's tree shaking
  // and ESLint rules for unused variables
  if (import.meta.env.DEV) {
    console.info('Code cleanup handled by build tools and ESLint');
  }
};

/**
 * Optimize bundle size by lazy loading components
 */
export const lazyLoadComponent = (importFn: () => Promise<any>) => {
  return React.lazy(importFn);
};

/**
 * Performance monitoring utility
 */
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  if (import.meta.env.DEV) {
    console.info(`${name} took ${end - start} milliseconds`);
  }
};

/**
 * Remove console logs in production
 */
export const safeLog = (message: any, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(message, ...args);
  }
};

/**
 * Memory cleanup utility
 */
export const cleanupEventListeners = (element: Element | Window, events: string[]) => {
  events.forEach(event => {
    element.removeEventListener(event, () => {});
  });
};
