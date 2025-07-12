
// Re-export everything from the animations system
export * from './animations/basic-animations';
export * from './animations/stagger-animations';

// Re-export interactive animations but exclude FloatingElement to avoid conflict
export { 
  HoverScale, 
  Pulse, 
  SlideInOut,
  GestureInteractive 
} from './animations/interactive-animations';

// Re-export from micro-interactions (this includes FloatingElement)
export * from './micro-interactions';
export * from './page-transition';

// Ensure PageTransition is available at the root level
export { PageTransition, AnimatedRouteWrapper } from './page-transition';
