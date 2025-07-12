
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

// Re-export from main animations file for backward compatibility
export {
  FadeIn,
  ScaleIn,
  SlideIn,
  Stagger,
  StaggerItem,
  HoverScale
} from '../animations';

// Additional exports for compatibility
export { StaggerContainer, StaggerChild } from '../animations';
