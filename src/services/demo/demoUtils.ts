
export const isDemoMode = (): boolean => {
  const user = JSON.parse(localStorage.getItem('demo_user') || 'null');
  return user?.email === 'demo@dbooster.ai';
};

export const clearDemoData = (): void => {
  localStorage.removeItem('demo_user');
  localStorage.removeItem('demo_session');
};
