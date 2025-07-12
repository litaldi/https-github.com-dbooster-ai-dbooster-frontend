
// Re-export everything from the animations system
export * from './animations/basic-animations';
export * from './animations/interactive-animations';
export * from './animations/stagger-animations';
export * from './micro-interactions';
export * from './page-transition';

// Ensure PageTransition is available at the root level
export { PageTransition, AnimatedRouteWrapper } from './page-transition';
