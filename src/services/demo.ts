
// Re-export all demo functionality from dedicated modules
export { demoData } from './demo/demoData';
export type { DemoData } from './demo/demoData';

export { 
  getDemoUser, 
  loginDemoUser, 
  logoutDemoUser, 
  getDemoSession 
} from './demo/demoAuth';

export { 
  isDemoMode, 
  clearDemoData 
} from './demo/demoUtils';

// For backward compatibility, also export logoutDemoUser as the old function name
export { logoutDemoUser } from './demo/demoAuth';
