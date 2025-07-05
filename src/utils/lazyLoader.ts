import { lazy, ComponentType } from 'react';
import { ResourcePreloader } from './resourcePreloader';

interface LazyLoadOptions {
  preloadRoute?: string;
  preloadDelay?: number;
  fallbackTimeout?: number;
}

export function createLazyRoute<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): ComponentType<T> {
  const { preloadRoute, preloadDelay = 2000, fallbackTimeout = 10000 } = options;
  
  // Create the lazy component
  const LazyComponent = lazy(importFn);
  
  // Preload related resources when this route might be accessed
  if (preloadRoute) {
    setTimeout(() => {
      ResourcePreloader.preloadRouteAssets(preloadRoute);
    }, preloadDelay);
  }
  
  return LazyComponent;
}

export function preloadComponent(importFn: () => Promise<any>): void {
  const componentImport = importFn();
  
  // Store the promise to avoid duplicate imports
  if (typeof window !== 'undefined') {
    (window as any).__preloadedComponents = (window as any).__preloadedComponents || new Map();
    (window as any).__preloadedComponents.set(importFn.toString(), componentImport);
  }
}

// Intelligent preloading based on user behavior
export class IntelligentPreloader {
  private static instance: IntelligentPreloader;
  private mousePositions: Array<{ x: number; y: number; timestamp: number }> = [];
  private preloadedRoutes = new Set<string>();

  static getInstance(): IntelligentPreloader {
    if (!IntelligentPreloader.instance) {
      IntelligentPreloader.instance = new IntelligentPreloader();
    }
    return IntelligentPreloader.instance;
  }

  initialize() {
    if (typeof window === 'undefined') return;

    // Track mouse movements to predict user intent
    document.addEventListener('mousemove', this.trackMouseMovement.bind(this));
    
    // Preload on hover with debouncing
    document.addEventListener('mouseenter', this.handleLinkHover.bind(this), true);
  }

  private trackMouseMovement(event: MouseEvent) {
    this.mousePositions.push({
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now()
    });

    // Keep only recent positions (last 2 seconds)
    this.mousePositions = this.mousePositions.filter(
      pos => Date.now() - pos.timestamp < 2000
    );
  }

  private handleLinkHover(event: Event) {
    const target = event.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;
    
    if (link && link.href && link.origin === window.location.origin) {
      const path = new URL(link.href).pathname;
      
      if (!this.preloadedRoutes.has(path)) {
        this.preloadedRoutes.add(path);
        ResourcePreloader.preloadRouteAssets(path);
      }
    }
  }
}
