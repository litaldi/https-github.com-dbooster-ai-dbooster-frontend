
// Basic animations
export { 
  FadeIn, 
  FadeInUp, 
  ScaleIn, 
  SlideIn, 
  RotateIn, 
  BlurIn 
} from './basic-animations';

// Interactive animations  
export { 
  HoverScale, 
  FloatingElement, 
  Pulse, 
  SlideInOut,
  GestureInteractive 
} from './interactive-animations';

// Stagger animations
export { 
  StaggerContainer as StaggerChildren, 
  StaggerItem as StaggerChild, 
  StaggerContainer, 
  StaggerItem,
  FastStaggerContainer,
  FastStaggerItem
} from './stagger-animations';

// Re-export from micro-interactions for convenience
export { 
  InteractiveButton, 
  PulseElement,
  HoverLift,
  ScaleOnHover
} from '../micro-interactions';

// Page transitions - export from page-transition file
export {
  PageTransition,
  AnimatedRouteWrapper
} from '../page-transition';

// Backward compatibility aliases
export { StaggerContainer as Stagger } from './stagger-animations';
