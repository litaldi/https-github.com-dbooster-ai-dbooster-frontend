
// Secure demo mode utilities - no hardcoded credentials
export const isDemoMode = (): boolean => {
  try {
    const user = JSON.parse(localStorage.getItem('demo_user') || 'null');
    return user?.email === 'demo@dbooster.ai';
  } catch {
    return false;
  }
};

export const clearDemoData = (): void => {
  try {
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_session');
  } catch {
    // Silently handle localStorage errors
  }
};

export const getDemoUserData = () => {
  try {
    const user = localStorage.getItem('demo_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Remove all hardcoded demo credentials - they should be server-managed
export const initializeDemoMode = async (): Promise<boolean> => {
  // Demo mode should be initialized through proper authentication flow
  // Not through client-side hardcoded credentials
  return false;
};
